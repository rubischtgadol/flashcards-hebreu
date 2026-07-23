#!/usr/bin/env node
/*
 * ajoute_mots.js — outil de développement (non déployé), zéro dépendance.
 * Générateur de fiche, étage 1 — contrat : SPEC_AJOUTE_MOTS.md (v2, 2026-07-23).
 *
 * Consomme un petit nouveaux_mots.json (1..N opérations : nom, adjectif, verbe,
 * liste, exemple) et fait tout le mécanique : balisage byte-conforme aux gabarits
 * du carnet, translittération dérivée (he2tr d'app.html, surchargeable),
 * placement par frontière de section (jamais par numéro de ligne), validation
 * complète en sandbox, verdict avec diff ciblé et tableau des tr dérivés.
 *
 * L'humain fournit ce que lui seul peut décider (hébreu vocalisé, sens, niveau,
 * thème, placement) ; le script dérive tout le calculable et n'écrit le carnet
 * réel qu'après vert complet — et seulement avec --ecrire.
 *
 * Usage :
 *   node ajoute_mots.js nouveaux_mots.json                       # dry-run (défaut) : ne touche RIEN
 *   node ajoute_mots.js nouveaux_mots.json --ecrire              # insère, build, vérifie, garde si vert
 *   node ajoute_mots.js nouveaux_mots.json --ecrire --force      # passe outre les doublons même-section
 *   node ajoute_mots.js nouveaux_mots.json --ecrire --nouveau-sous-theme  # autorise la création de sous-thème
 *   node ajoute_mots.js nouveaux_mots.json --parite              # + contrôle de parité jsdom (extractCards d'app.html)
 *
 * Aucun troisième parseur : tout le parsing vient des exports de build.js.
 * Aucune troisième translittération : he2tr est extraite textuellement
 * d'app.html et évaluée via vm (même procédé que verifie_exemples.js) —
 * échec bruyant si la fonction bouge, jamais de fallback silencieux.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync, execFileSync } = require('child_process');

const {
  extractCards, NOTEBOOK, APP,
  parseSections, closeOf, lisOf, exemplesOf, firstSpanText, tdsOf,
  stripNikud, decodeEntities,
  EXPECTED_LEVELS, EXPECTED_THEMES, listCats,
} = require('./build.js');

// ---------- he2tr : extraite telle quelle d'app.html (procédé de verifie_exemples.js) ----------
function grabFunction(src, name){
  const open = src.indexOf('function ' + name + '(');
  if (open < 0) throw new Error('function ' + name + ' introuvable dans app.html');
  let i = src.indexOf('{', open), depth = 0;
  for (let j = i; j < src.length; j++){
    if (src[j] === '{') depth++;
    else if (src[j] === '}' && --depth === 0) return src.slice(open, j + 1);
  }
  throw new Error('accolades non équilibrées pour ' + name);
}
const appSrc = fs.readFileSync(APP, 'utf8');
let he2tr;
try {
  const sb = {};
  vm.createContext(sb);
  vm.runInContext(grabFunction(appSrc, 'he2tr'), sb);
  he2tr = (s) => vm.runInContext('he2tr(' + JSON.stringify(s) + ')', sb);
} catch (e){
  console.error('✗ Extraction de he2tr depuis app.html en échec : ' + e.message);
  console.error('  (fonction renommée/déplacée ? le générateur refuse de continuer sans elle.)');
  process.exit(1);
}

// ---------- constantes du générateur ----------
const NIQQUD = /[֑-ׇ]/;               // même plage que stripNikud
const TABLES = ['Verbes', 'Adjectifs', 'Noms'];
const TYPES = ['nom', 'adjectif', 'verbe', 'liste', 'exemple'];
// Listes à ordre sémantique : l'append y est une faute d'édition, `apres` recommandé (§5.3).
const LISTES_ORDONNEES = ['Nombres (0–10)', 'Nombres ordinaux', 'Jours de la semaine'];
// <thead> contractuels pour la création gâtée de sous-thème (§4.6) — relevés dans le carnet.
const THEAD = {
  'Verbes': '<th>Infinitif</th><th>MS</th><th>FS</th><th>MP</th><th>FP</th>',
  'Noms': '<th>Singulier</th><th>Genre</th><th>Pluriel</th>',
};

// ---------- CLI ----------
const argv = process.argv.slice(2);
const FLAGS = {
  ecrire: argv.includes('--ecrire'),
  force: argv.includes('--force'),
  nouveauSousTheme: argv.includes('--nouveau-sous-theme'),
  parite: argv.includes('--parite'),
};
const inconnus = argv.filter(a => a.startsWith('--') &&
  !['--ecrire', '--force', '--nouveau-sous-theme', '--parite'].includes(a));
const jsonPath = argv.find(a => !a.startsWith('--'));
if (!jsonPath || inconnus.length){
  if (inconnus.length) console.error('✗ Option(s) inconnue(s) : ' + inconnus.join(', '));
  console.error('Usage : node ajoute_mots.js nouveaux_mots.json [--ecrire] [--force] [--nouveau-sous-theme] [--parite]');
  process.exit(1);
}

// ---------- échappement (§4.5 : UTF-8 brut, jamais d'entités nommées) ----------
function escText(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escAttr(s){ return escText(s).replace(/"/g, '&quot;'); }

// ---------- politique des tr (§2.1) ----------
const trDerives = [];   // { he, tr, champ, mot, fragile }
let trFournis = 0;
function trPour(he, trHumain, champ, mot){
  if (trHumain){ trFournis++; return trHumain; }
  const tr = he2tr(he);
  trDerives.push({ he, tr, champ, mot, fragile: heuristiqueFragile(he) });
  return tr;
}
// he2tr est une heuristique faible exactement là où le standard demande du
// jugement : shva initial entendu ou non (gdolim mais ledaber), ayin vs alef
// entre voyelles. Ces cas sont marqués ⚠ dans le tableau de relecture.
function heuristiqueFragile(he){
  return he.split(/\s+/).some(w =>
    /^[א-ת]ְ/.test(w) || /[עא]/.test(stripNikud(w).slice(1)));
}

// ---------- petits repérages (offsets ; le parsing reste celui de build.js) ----------
function noLigne(html, index){ return html.slice(0, index).split('\n').length; }
function indentDe(html, tagIndex, defaut){
  const debut = html.lastIndexOf('\n', tagIndex - 1) + 1;
  const avant = html.slice(debut, tagIndex);
  return /^[ \t]*$/.test(avant) ? avant : defaut;
}
// Ligne (approximative) où vit un headword — pour nommer les doublons.
function ligneDuMot(html, he){
  const pats = ['<td><span class="he" lang="he">' + he + '</span>',
    '<span class="word-main"><span class="he" lang="he">' + he + '</span>'];
  for (const p of pats){ const i = html.indexOf(p); if (i >= 0) return noLigne(html, i); }
  const i = html.indexOf('>' + he + '<');
  return i >= 0 ? noLigne(html, i) : 0;
}

// Sections du carnet avec leurs offsets absolus (parseSections de build.js ;
// le corps d'une section est un slice assez gros pour être unique dans le fichier).
function carteDesSections(html){
  const sections = parseSections(html);
  const infos = {};
  Object.keys(sections).forEach(nom => {
    const body = sections[nom];
    infos[nom] = { nom, body, debut: html.indexOf(body) };
  });
  return infos;
}

// Zones de sous-thème d'une section : chaque <h3 class="subtheme"> court
// jusqu'au <h3> suivant ou la fin de section (frontières, jamais de n° de ligne).
function zonesDe(section){
  const re = /<h3\b[^>]*\bclass="subtheme"[^>]*>([\s\S]*?)<\/h3>/g;
  const marks = []; let m;
  while ((m = re.exec(section.body))){
    marks.push({ titre: decodeEntities(m[1].replace(/<[^>]*>/g, '')).trim(),
      debut: m.index, fin: m.index + m[0].length });
  }
  return marks.map((mk, i) => ({ titre: mk.titre, de: mk.fin,
    a: i + 1 < marks.length ? marks[i + 1].debut : section.body.length }));
}

// Premier <tbody> d'une zone → offset (relatif au corps) juste avant </tbody>.
function pointTbody(body, de, a){
  const re = /<tbody\b[^>]*>/g; re.lastIndex = de;
  const open = re.exec(body);
  if (!open || open.index >= a) return null;
  return closeOf(body, open.index + open[0].length, 'tbody');
}
// Première <ul class="word-list"> d'une zone → bornes internes + offset avant </ul>.
function pointWordList(body, de, a){
  const re = /<ul\b[^>]*\bclass="word-list"[^>]*>/g; re.lastIndex = de;
  const open = re.exec(body);
  if (!open || open.index >= a) return null;
  const ulDe = open.index + open[0].length;
  return { ulDe, ulA: closeOf(body, ulDe, 'ul') };
}

// <li> de premier niveau d'une word-list, AVEC leurs offsets — miroir exact du
// scan depth-aware de lisOf (build.js), que l'insertion oblige à refaire ici
// parce qu'il faut les positions, pas seulement les fragments.
function lisAvecOffsets(body, ulDe, ulA){
  const inner = body.slice(ulDe, ulA);
  const out = [];
  const liRe = /<\/?li\b[^>]*>/g;
  let depth = 0, start = -1, t;
  while ((t = liRe.exec(inner))){
    if (t[0][1] !== '/'){ if (depth === 0) start = t.index; depth++; }
    else {
      depth--;
      if (depth === 0 && start >= 0){
        out.push({ frag: inner.slice(start, t.index + t[0].length),
          de: ulDe + start, a: ulDe + t.index + t[0].length });
        start = -1;
      }
    }
  }
  return out;
}

// <tr> complets d'une zone, avec offsets (closeOf depth-aware, règle §1.1).
function rowsAvecOffsets(body, de, a){
  const out = []; const re = /<tr\b[^>]*>/g; re.lastIndex = de;
  let m;
  while ((m = re.exec(body)) && m.index < a){
    const close = closeOf(body, m.index + m[0].length, 'tr');
    out.push({ frag: body.slice(m.index, close + '</tr>'.length), de: m.index, a: close + '</tr>'.length });
    re.lastIndex = close;
  }
  return out;
}

// ---------- gabarits §4 (lignes à indentation relative ; base répliquée du voisin) ----------
function ulExemples(exs, mot){
  return '<ul class="exemples">' + exs.map(ex =>
    '<li><span class="he" lang="he">' + escText(ex.he) + '</span><span class="tr">' +
    escText(trPour(ex.he, ex.tr, 'exemple', mot)) + '</span><span class="fr">' +
    escText(ex.fr) + '</span></li>').join('') + '</ul>';
}
function celluleForme(f, champ, mot){
  if (!f) return '<td>—</td>';
  return '<td><span class="he" lang="he">' + escText(f.he) + '</span><span class="tr">' +
    escText(trPour(f.he, f.tr, champ, mot)) + '</span></td>';
}
function lignesRangee(op){
  const l = [];
  l.push('<tr data-niveau="' + escAttr(op.niveau) + '" data-theme="' + escAttr(op.theme) + '">');
  l.push('  <td><span class="he" lang="he">' + escText(op.he) + '</span><span class="fr">' + escText(op.fr) + '</span>');
  l.push('  ' + ulExemples(op.exemples, op.he));
  l.push('</td>');
  if (op.type === 'verbe'){
    ['ms', 'fs', 'mp', 'fp'].forEach(k => l.push('  ' + celluleForme(op.formes[k], 'forme ' + k.toUpperCase(), op.he)));
  } else if (op.type === 'adjectif'){
    ['fs', 'mp', 'fp'].forEach(k => l.push('  ' + celluleForme(op.formes[k], 'forme ' + k.toUpperCase(), op.he)));
  } else { // nom
    l.push('  <td>' + op.genre + '</td>');
    l.push('  ' + celluleForme(op.pluriel || null, 'pluriel', op.he));
  }
  l.push('</tr>');
  return l;
}
function lignesLi(op){
  const attrs = (op.note ? ' data-note="' + escAttr(op.note) + '"' : '') +
    ' data-niveau="' + escAttr(op.niveau) + '"' +
    (op.fr_court ? ' data-fr-court="' + escAttr(op.fr_court) + '"' : '');
  const l = [];
  l.push('<li' + attrs + '>');
  l.push('  <span class="word-main"><span class="he" lang="he">' + escText(op.he) + '</span></span>');
  l.push('  <span class="meta"><span class="tr">' + escText(trPour(op.he, op.tr, 'mot', op.he)) + '</span><span class="fr">' + escText(op.fr) + '</span></span>');
  if (op.exemples && op.exemples.length) l.push('    ' + ulExemples(op.exemples, op.he));
  l.push('</li>');
  return l;
}
function indente(lignes, base){ return lignes.map(li => base + li).join('\n'); }

// ---------- résolution des labels (comparaison post-decodeEntities, §4.5) ----------
function normLabel(s){
  return decodeEntities(String(s)).normalize('NFC').toLowerCase()
    .replace(/[–—]/g, '-').replace(/&/g, 'et').replace(/\s+/g, ' ').trim();
}
function quasi(label, candidats){
  const n = normLabel(label);
  return candidats.find(c => normLabel(c) === n && c !== label) || null;
}

// ---------- verdict : accumulateurs ----------
const erreurs = [], avertissements = [], infosDiverses = [], rappels = [];
const err = (m) => erreurs.push(m);
const warn = (m) => avertissements.push(m);

// ---------- validation d'une opération (§7.A) ----------
function chaine(v){ return typeof v === 'string' && v.trim() !== ''; }
function verifieNiqqud(qui, he){
  if (!NIQQUD.test(he)) err(qui + ' : « ' + he + ' » sans niqqud — l\'hébreu du carnet est toujours vocalisé.');
}
function verifieExemplesChamp(qui, exs, obligatoire){
  if (exs === undefined){
    if (obligatoire) err(qui + ' : exemples[] manquant — chaque entrée des tables Noms/Adjectifs/Verbes porte au moins un exemple (verbe : phrase au présent).');
    return;
  }
  if (!Array.isArray(exs) || (obligatoire && !exs.length)){
    err(qui + ' : exemples[] doit être un tableau' + (obligatoire ? ' non vide' : '') + '.');
    return;
  }
  exs.forEach((ex, i) => {
    if (!ex || !chaine(ex.he) || !chaine(ex.fr)){ err(qui + ' : exemples[' + i + '] doit porter he et fr non vides.'); return; }
    verifieNiqqud(qui + ' exemples[' + i + ']', ex.he);
  });
}

function messageThemeInconnu(qui, theme){
  err(qui + ' : thème « ' + theme + ' » hors taxonomie. Les 15 slugs : ' + EXPECTED_THEMES.join(', ') + '.\n' +
    '    Nouveau thème (16ᵉ slug) : hors périmètre du script — l\'ajouter à EXPECTED_THEMES (build.js) ET à THEMES (app.html), slugs identiques, avant tout data-theme neuf dans le carnet.');
}
function messageSectionInconnue(qui, section, valides){
  const sugg = quasi(section, valides);
  err(qui + ' : section « ' + section + ' » introuvable.' + (sugg ? ' Vouliez-vous dire « ' + sugg + ' » ?' : '') + '\n' +
    '    Sections valides : ' + valides.join(' · ') + '.\n' +
    '    Nouvelle section <h2> : hors périmètre du script — exige listCats + EXPECTED_CATS (build.js) ET le miroir listCats d\'extractCards() (app.html), les deux extracteurs.');
}

// ---------- programme principal ----------
function main(){
  // Entrée
  let ops;
  try { ops = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); }
  catch (e){ console.error('✗ Lecture de ' + jsonPath + ' : ' + e.message); process.exit(1); }
  if (!Array.isArray(ops) || !ops.length){
    console.error('✗ ' + jsonPath + ' doit contenir un tableau non vide d\'opérations.');
    process.exit(1);
  }

  const html = fs.readFileSync(NOTEBOOK, 'utf8');
  const sections = carteDesSections(html);
  const nomsDeSections = Object.keys(sections);

  // Arbre git sale sur le carnet : le diff du script se mélangerait à autre chose (§8).
  try {
    const st = execFileSync('git', ['status', '--porcelain', '--', path.basename(NOTEBOOK)],
      { cwd: __dirname, encoding: 'utf8' }).trim();
    if (st) infosDiverses.push('ℹ Arbre git sale sur ' + path.basename(NOTEBOOK) + ' — le diff de ce script se mélangera à des modifications déjà en cours.');
  } catch (e){ /* pas de git : tant pis pour l'avertissement */ }

  // Index corpus entier : he_plain (headword) → occurrences {section, he} (§7.A doublons).
  const index = new Map();
  const pousseIndex = (plain, section, he) => {
    if (!plain) return;
    const a = index.get(plain) || []; a.push({ section, he }); index.set(plain, a);
  };
  TABLES.forEach(nom => {
    const s = sections[nom]; if (!s) return;
    rowsAvecOffsets(s.body, 0, s.body.length).forEach(r => {
      const tds = tdsOf(r.frag); if (!tds.length) return;
      const he = firstSpanText(tds[0], 'he'); if (he) pousseIndex(stripNikud(he), nom, he);
    });
  });
  Object.keys(listCats).forEach(nom => {
    const s = sections[nom]; if (!s) return;
    lisOf({ [nom]: s.body }, nom).forEach(li => {
      const he = firstSpanText(li, 'he'); if (he) pousseIndex(stripNikud(he), nom, he);
    });
  });

  const insertions = [];        // { at, ord, text, etiquette }
  const ignorees = [];          // doublons skippés (idempotence)
  const nouveauxSousThemes = new Map();  // 'Section Titre' → { section, titre, lignes: [] }
  const vusDansLeLot = new Set();        // doublons internes au JSON : 'section he_plain'

  ops.forEach((op, iOp) => {
    const qui = 'opération ' + (iOp + 1) + (op && op.he ? ' (' + op.he + ')' : op && op.cible ? ' (cible ' + op.cible + ')' : '');
    if (!op || typeof op !== 'object' || !TYPES.includes(op.type)){
      err(qui + ' : type inconnu « ' + (op && op.type) + ' » — attendu : ' + TYPES.join(' | ') + '.');
      return;
    }

    // ----- type exemple : enrichir un mot existant (§3.6) -----
    if (op.type === 'exemple'){
      if (!chaine(op.section) || !chaine(op.cible) || !op.exemple || !chaine(op.exemple.he) || !chaine(op.exemple.fr)){
        err(qui + ' : une op exemple exige section, cible (he_plain) et exemple {he, fr}.');
        return;
      }
      verifieNiqqud(qui, op.exemple.he); // cible seule est exemptée du contrôle
      const valides = nomsDeSections.filter(n => TABLES.includes(n) || listCats[n] !== undefined);
      const section = sections[op.section] ? op.section : null;
      if (!section){ messageSectionInconnue(qui, op.section, valides); return; }
      const s = sections[section];
      const cible = op.cible.trim();

      // candidats dans la section (tables : rangées ; listes : <li> de premier niveau)
      const candidats = [];
      if (TABLES.includes(section)){
        rowsAvecOffsets(s.body, 0, s.body.length).forEach(r => {
          const tds = tdsOf(r.frag); if (!tds.length) return;
          const he = firstSpanText(tds[0], 'he');
          if (he && stripNikud(he) === cible) candidats.push({ ...r, he, fr: firstSpanText(tds[0], 'fr'), table: true });
        });
      } else {
        const zones = zonesDe(s).length ? zonesDe(s) : [{ de: 0, a: s.body.length }];
        zones.forEach(z => {
          let de = z.de;
          let wl;
          while ((wl = pointWordList(s.body, de, z.a))){
            lisAvecOffsets(s.body, wl.ulDe, wl.ulA).forEach(li => {
              const he = firstSpanText(li.frag, 'he');
              if (he && stripNikud(he) === cible) candidats.push({ ...li, he, fr: firstSpanText(li.frag, 'fr'), table: false });
            });
            de = wl.ulA;
            if (de >= z.a) break;
          }
        });
      }
      if (!candidats.length){ err(qui + ' : cible « ' + cible + ' » introuvable dans la section ' + section + '.'); return; }
      if (candidats.length > 1){
        err(qui + ' : cible « ' + cible + ' » ambiguë dans ' + section + ' — candidats : ' +
          candidats.map(c => c.he + ' (' + c.fr + ')').join(' ; ') + '. Homographes : préciser via une autre section ou enrichir à la main.');
        return;
      }
      const c = candidats[0];
      // idempotence : l'exemple existe déjà sur ce mot → skip sauf --force
      const deja = exemplesOf(c.frag).some(ex => ex.he_plain === stripNikud(op.exemple.he));
      if (deja && !FLAGS.force){
        const l = noLigne(html, s.debut + c.de);
        ignorees.push('⚠ ' + qui + ' : cet exemple existe déjà sur ' + c.he + ' (' + section + ', L' + l + ') — ignoré (--force pour l\'ajouter quand même).');
        return;
      }
      const li = '<li><span class="he" lang="he">' + escText(op.exemple.he) + '</span><span class="tr">' +
        escText(trPour(op.exemple.he, op.exemple.tr, 'exemple', c.he)) + '</span><span class="fr">' +
        escText(op.exemple.fr) + '</span></li>';
      const ulRe = /<ul\b[^>]*\bclass="exemples"[^>]*>/;
      const ulOpen = ulRe.exec(c.frag);
      const etiquette = section + ' · ' + c.he + ' (exemple)';
      if (ulOpen){
        // append dans le ul.exemples existant (inline, comme les gabarits)
        const close = closeOf(c.frag, ulOpen.index + ulOpen[0].length, 'ul');
        insertions.push({ at: s.debut + c.de + close, ord: iOp, text: li, etiquette });
      } else {
        // création du ul à la position contractuelle : après .fr (tables) / .meta (listes) — §3.6
        const cls = c.table ? 'fr' : 'meta';
        const openRe = new RegExp('<span\\b[^>]*\\bclass="' + cls + '"[^>]*>');
        const open = openRe.exec(c.frag);
        if (!open){ err(qui + ' : span .' + cls + ' introuvable dans l\'entrée ' + c.he + ' — balisage inattendu, rien inséré.'); return; }
        const finSpan = closeOf(c.frag, open.index + open[0].length, 'span') + '</span>'.length;
        const base = indentDe(s.body, c.de, c.table ? '    ' : '  ');
        insertions.push({ at: s.debut + c.de + finSpan, ord: iOp,
          text: '\n' + base + '  ' + '<ul class="exemples">' + li + '</ul>', etiquette });
      }
      return;
    }

    // ----- les quatre types « mot » : validations communes -----
    if (!chaine(op.he) || !chaine(op.fr)){ err(qui + ' : he et fr sont obligatoires.'); return; }
    verifieNiqqud(qui, op.he);
    if (!chaine(op.niveau) || !EXPECTED_LEVELS.includes(op.niveau)){
      err(qui + ' : niveau « ' + op.niveau + ' » invalide — EXPECTED_LEVELS (build.js) : ' + EXPECTED_LEVELS.join(', ') +
        '. Au-delà de B2 : étendre EXPECTED_LEVELS dans build.js.');
      return;
    }

    const estTable = op.type !== 'liste';
    const sectionAttendue = { nom: 'Noms', adjectif: 'Adjectifs', verbe: 'Verbes' }[op.type];

    if (estTable){
      if (op.section !== sectionAttendue){
        err(qui + ' : un type « ' + op.type + ' » va dans la section « ' + sectionAttendue + ' » (reçu : « ' + op.section + ' »).');
        return;
      }
      if (!chaine(op.theme)){ err(qui + ' : theme obligatoire sur les tables Noms/Adjectifs/Verbes.'); return; }
      if (!EXPECTED_THEMES.includes(op.theme)){ messageThemeInconnu(qui, op.theme); return; }
      verifieExemplesChamp(qui, op.exemples, true);
    } else {
      if (op.theme !== undefined){ err(qui + ' : pas de theme sur un mot de liste (les listes sont mono-thème par nature).'); return; }
      if (!listCats[op.section]){
        messageSectionInconnue(qui, String(op.section), Object.keys(listCats));
        return;
      }
      verifieExemplesChamp(qui, op.exemples, false);
    }

    // formes par type
    if (op.type === 'verbe'){
      const manquantes = ['ms', 'fs', 'mp', 'fp'].filter(k => !op.formes || !op.formes[k] || !chaine(op.formes[k].he));
      if (manquantes.length){
        err(qui + ' : formes du présent incomplètes (' + manquantes.join(', ') + ') — les 4 sont obligatoires et non-nulles, l\'extracteur les pousse sans condition.');
        return;
      }
      ['ms', 'fs', 'mp', 'fp'].forEach(k => verifieNiqqud(qui + ' forme ' + k.toUpperCase(), op.formes[k].he));
    }
    if (op.type === 'adjectif'){
      const absentes = ['fs', 'mp', 'fp'].filter(k => !op.formes || !(k in op.formes));
      if (absentes.length){
        err(qui + ' : formes fs/mp/fp requises (clé présente ; null licite pour un défectif) — manquent : ' + absentes.join(', ') + '.');
        return;
      }
      ['fs', 'mp', 'fp'].forEach(k => {
        const f = op.formes[k];
        if (f === null) return;
        if (!f || !chaine(f.he)){ err(qui + ' : forme ' + k.toUpperCase() + ' invalide — objet {he, tr?} ou null.'); return; }
        verifieNiqqud(qui + ' forme ' + k.toUpperCase(), f.he);
      });
      if (chaine(op.sous_theme)){ err(qui + ' : pas de sous_theme sur un adjectif (Adjectifs = table unique).'); return; }
    }
    if (op.type === 'nom'){
      if (op.genre !== 'm' && op.genre !== 'f'){ err(qui + ' : genre obligatoire, « m » ou « f ».'); return; }
      if (op.pluriel !== undefined && op.pluriel !== null){
        if (!chaine(op.pluriel.he)){ err(qui + ' : pluriel invalide — objet {he, tr?} ou absent.'); return; }
        verifieNiqqud(qui + ' pluriel', op.pluriel.he);
      }
    }
    if (erreurs.length && erreurs[erreurs.length - 1].startsWith(qui)) return; // niqqud d'une forme a pu échouer

    // ----- doublons (corpus entier, §7.A) -----
    const plain = stripNikud(op.he.trim());
    const cleLot = op.section + ' ' + plain;
    const occs = index.get(plain) || [];
    const memeSection = occs.filter(o => o.section === op.section);
    const autres = occs.filter(o => o.section !== op.section);
    if ((memeSection.length || vusDansLeLot.has(cleLot)) && !FLAGS.force){
      const ou = memeSection.length
        ? op.section + ', L' + ligneDuMot(html, memeSection[0].he)
        : 'déjà dans ce lot';
      ignorees.push('⚠ ' + qui + ' : « ' + plain + ' » déjà présent (' + ou + ') — ignoré (--force pour l\'insérer quand même).');
      return;
    }
    autres.forEach(o => infosDiverses.push('ℹ ' + qui + ' : « ' + plain + ' » figure aussi dans ' +
      o.section + ', L' + ligneDuMot(html, o.he) + ' — homographe légitime ? à arbitrer, n\'empêche rien.'));
    vusDansLeLot.add(cleLot);

    // ----- placement (§5) -----
    const s = sections[op.section];
    if (!s){ messageSectionInconnue(qui, op.section, estTable ? TABLES : Object.keys(listCats)); return; }
    const zones = zonesDe(s);

    if (estTable && op.type !== 'adjectif'){
      // Verbes / Noms : sous-thème obligatoire
      if (!chaine(op.sous_theme)){
        err(qui + ' : sous_theme obligatoire dans ' + op.section + '. Disponibles : ' + zones.map(z => z.titre).join(' · ') + '.');
        return;
      }
      const zone = zones.find(z => normLabel(z.titre) === normLabel(op.sous_theme));
      if (!zone){
        if (FLAGS.nouveauSousTheme){
          // création gâtée §4.6 : les entrées du lot pour ce sous-thème vivent dans le squelette
          const cle = op.section + ' ' + op.sous_theme.trim();
          if (!nouveauxSousThemes.has(cle)) nouveauxSousThemes.set(cle, { section: op.section, titre: op.sous_theme.trim(), lignes: [], ord: iOp });
          nouveauxSousThemes.get(cle).lignes.push(indente(lignesRangee(op), '    '));
          return;
        }
        const sugg = quasi(op.sous_theme, zones.map(z => z.titre));
        err(qui + ' : sous-thème « ' + op.sous_theme + ' » introuvable dans ' + op.section + '.' +
          (sugg ? ' Vouliez-vous dire « ' + sugg + ' » ?' : '') +
          '\n    Disponibles : ' + zones.map(z => z.titre).join(' · ') +
          '.\n    Pour en créer un : relancer avec --nouveau-sous-theme (jamais de création silencieuse).');
        return;
      }
      const close = pointTbody(s.body, zone.de, zone.a);
      if (close === null){ err(qui + ' : aucune <table><tbody> sous le sous-thème « ' + zone.titre + ' » — balisage inattendu.'); return; }
      const rows = rowsAvecOffsets(s.body, zone.de, close);
      const base = rows.length ? indentDe(s.body, rows[rows.length - 1].de, '    ') : '    ';
      poseAvantFermeture(insertions, html, s.debut + close, indente(lignesRangee(op), base), iOp,
        op.section + ' — ' + zone.titre + ' · ' + op.he);
      return;
    }

    if (op.type === 'adjectif'){
      const close = pointTbody(s.body, 0, s.body.length);
      if (close === null){ err(qui + ' : table des Adjectifs introuvable — balisage inattendu.'); return; }
      const rows = rowsAvecOffsets(s.body, 0, close);
      const base = rows.length ? indentDe(s.body, rows[rows.length - 1].de, '    ') : '    ';
      poseAvantFermeture(insertions, html, s.debut + close, indente(lignesRangee(op), base), iOp,
        'Adjectifs · ' + op.he);
      return;
    }

    // ----- liste (§3.5) -----
    let zone = { de: 0, a: s.body.length, titre: null };
    if (zones.length){
      if (!chaine(op.sous_theme)){
        err(qui + ' : ' + op.section + ' est multi-listes — sous_theme obligatoire. Disponibles : ' + zones.map(z => z.titre).join(' · ') + '.');
        return;
      }
      const z = zones.find(zz => normLabel(zz.titre) === normLabel(op.sous_theme));
      if (!z){
        const sugg = quasi(op.sous_theme, zones.map(zz => zz.titre));
        err(qui + ' : sous-thème « ' + op.sous_theme + ' » introuvable dans ' + op.section + '.' +
          (sugg ? ' Vouliez-vous dire « ' + sugg + ' » ?' : '') +
          '\n    Disponibles : ' + zones.map(zz => zz.titre).join(' · ') + '.');
        return;
      }
      zone = z;
    } else if (chaine(op.sous_theme)){
      err(qui + ' : ' + op.section + ' est mono-liste — pas de sous_theme.');
      return;
    }
    const wl = pointWordList(s.body, zone.de, zone.a);
    if (!wl){ err(qui + ' : aucune <ul class="word-list"> dans ' + op.section + (zone.titre ? ' — ' + zone.titre : '') + ' — balisage inattendu.'); return; }
    const lis = lisAvecOffsets(s.body, wl.ulDe, wl.ulA);
    const base = lis.length ? indentDe(s.body, lis[0].de, '  ') : '  ';
    const etiquette = op.section + (zone.titre ? ' — ' + zone.titre : '') + ' · ' + op.he;

    if (op.apres !== undefined){
      if (!chaine(op.apres)){ err(qui + ' : apres doit être le he_plain d\'un voisin de la liste.'); return; }
      const voisin = lis.find(li => stripNikud(firstSpanText(li.frag, 'he')) === op.apres.trim());
      if (!voisin){
        err(qui + ' : voisin « ' + op.apres + ' » introuvable dans ' + op.section + (zone.titre ? ' — ' + zone.titre : '') +
          ' — apres attend le he_plain d\'une entrée existante de cette liste.');
        return;
      }
      insertions.push({ at: s.debut + voisin.a, ord: iOp, text: '\n' + indente(lignesLi(op), base), etiquette });
    } else {
      if (LISTES_ORDONNEES.includes(op.section)){
        rappels.push('↪ ' + qui + ' : append en fin de « ' + op.section + ' », liste à ordre sémantique — le champ apres (he_plain d\'un voisin) place l\'entrée à sa place naturelle.');
      }
      poseAvantFermeture(insertions, html, s.debut + wl.ulA, indente(lignesLi(op), base), iOp, etiquette);
    }
  });

  // ----- squelettes de nouveaux sous-thèmes (§4.6), un par sous-thème, en fin de section -----
  nouveauxSousThemes.forEach(nst => {
    const s = sections[nst.section];
    const trail = /\s*$/.exec(s.body)[0].length;
    const lignes = [
      '<h3 class="subtheme">' + escText(nst.titre) + '</h3>',
      '<div class="table-wrap">',
      '<table>',
      '  <thead>',
      '    <tr>' + THEAD[nst.section] + '</tr>',
      '  </thead>',
      '  <tbody>',
      nst.lignes.join('\n'),
      '  </tbody>',
      '</table>',
      '</div>',
    ];
    insertions.push({ at: s.debut + s.body.length - trail, ord: nst.ord,
      text: '\n\n' + lignes.join('\n'), etiquette: nst.section + ' — ' + nst.titre + ' (nouveau sous-thème)' });
    rappels.push('↪ Nouveau sous-thème « ' + nst.titre + ' » créé en fin de section ' + nst.section + ' (--nouveau-sous-theme).');
  });

  // ----- tout ou rien (§7.A) -----
  if (erreurs.length){
    console.error('✗ Validation pré-insertion en échec — rien n\'est écrit (tout ou rien).\n');
    erreurs.forEach(e => console.error('  ✗ ' + e));
    ignorees.forEach(i => console.error('  ' + i));
    process.exit(1);
  }

  // ----- candidat -----
  insertions.sort((a, b) => a.at - b.at || a.ord - b.ord);
  let candidat = '', pos = 0;
  insertions.forEach(ins => {
    candidat += html.slice(pos, ins.at) + ins.text;
    ins.finalAt = candidat.length - ins.text.length;
    pos = ins.at;
  });
  candidat += html.slice(pos);

  // ----- verdict §7.C -----
  const avant = comptes(extractCards(html));
  const apres = insertions.length ? comptes(extractCards(candidat)) : avant;
  console.log('Compteurs par section (avant → après) :');
  const cats = [...new Set([...Object.keys(avant.parCat), ...Object.keys(apres.parCat)])].sort();
  cats.forEach(c => {
    const a = avant.parCat[c] || 0, b = apres.parCat[c] || 0;
    if (a !== b) console.log('  ' + c.padEnd(20) + a + ' → ' + b);
  });
  console.log('  ' + 'TOTAL'.padEnd(20) + avant.total + ' → ' + apres.total +
    '   (exemples : ' + avant.exemples + ' → ' + apres.exemples + ')');

  if (ignorees.length || infosDiverses.length || avertissements.length){
    console.log('');
    ignorees.forEach(i => console.log('  ' + i));
    avertissements.forEach(w => console.log('  ⚠ ' + w));
    infosDiverses.forEach(i => console.log('  ' + i));
  }

  if (trDerives.length || trFournis){
    console.log('\nTranslittérations : ' + trDerives.length + ' dérivée(s) via he2tr, ' + trFournis + ' fournie(s).');
    if (trDerives.length){
      console.log('  À RELIRE avant --ecrire (un tr écrit devient autoritaire, jamais recalculé) — ⚠ = heuristique fragile (shva initial, ayin/alef) :');
      const w1 = Math.max(...trDerives.map(d => [...d.he].length), 4);
      trDerives.forEach(d => {
        console.log('  ' + (d.fragile ? '⚠ ' : '  ') + d.he + ' '.repeat(Math.max(1, w1 - [...d.he].length + 2)) +
          '→ ' + d.tr + '   [' + d.champ + ' de ' + d.mot + ']');
      });
    }
  }

  if (!insertions.length){
    console.log('\nRien à insérer' + (ignorees.length ? ' (tout le lot est déjà dans le carnet — idempotence)' : '') + '. Le carnet n\'est pas modifié.');
    if (FLAGS.parite) lanceParite(candidat);
    return;
  }

  console.log('\nDiff ciblé (' + insertions.length + ' insertion(s)) :');
  insertions.forEach(ins => imprimeHunk(candidat, ins));

  rappels.forEach(r => console.log('\n' + r));

  // ----- preuve sandbox (§7.B) -----
  console.log('\nValidation sandbox (build.js + verifie_exemples.js sur le candidat)…');
  const sb = sandboxValidation(candidat);
  if (!sb.ok){
    console.error('\n✗ Sandbox en échec — le carnet réel n\'est PAS modifié.');
    console.error(sb.detail);
    process.exit(1);
  }
  console.log('  ✓ build.js sandbox : vert (' + apres.total + ' cartes).');
  console.log('  ✓ verifie_exemples.js sandbox : 0 erreur.');
  if (sb.warnings.length){
    console.log('  Avertissements de verifie_exemples.js (signaux éditoriaux, non bloquants) :');
    sb.warnings.forEach(w => console.log('  ' + w));
  }

  if (FLAGS.parite && !lanceParite(candidat)) process.exit(1);

  // ----- écriture (§9) -----
  if (FLAGS.ecrire){
    fs.writeFileSync(NOTEBOOK, candidat);
    const rb = spawnSync(process.execPath, ['build.js'], { cwd: __dirname, encoding: 'utf8' });
    if (rb.status !== 0){
      fs.writeFileSync(NOTEBOOK, html); // rollback — ne devrait jamais arriver après vert sandbox
      console.error('\n✗ node build.js a échoué sur le carnet réel — carnet restauré tel quel.');
      console.error((rb.stderr || rb.stdout || '').trim());
      process.exit(1);
    }
    console.log('\n✓ Carnet écrit (' + path.basename(NOTEBOOK) + ') et standalone régénéré (node build.js).');
  } else {
    console.log('\nDry-run : rien n\'est écrit. Relire le tableau des tr dérivés puis relancer avec --ecrire.');
  }

  console.log('\n↪ PWA : le carnet est servi en stale-while-revalidate (sw.js) — les mots neufs atteignent');
  console.log('  l\'iPhone au 2ᵉ lancement sans bump ; bump VERSION dans sw.js si tu les veux au 1ᵉʳ.');
  console.log('  (Le script ne bump jamais lui-même — décision de fil principal.)');
}

// Insertion d'un bloc juste avant une balise fermante, au début de sa ligne si
// elle y est seule (le bloc garde alors une indentation propre).
function poseAvantFermeture(insertions, html, closeAbs, bloc, ord, etiquette){
  const debutLigne = html.lastIndexOf('\n', closeAbs - 1) + 1;
  if (/^[ \t]*$/.test(html.slice(debutLigne, closeAbs))){
    insertions.push({ at: debutLigne, ord, text: bloc + '\n', etiquette });
  } else {
    insertions.push({ at: closeAbs, ord, text: '\n' + bloc + '\n', etiquette });
  }
}

function comptes(cards){
  const parCat = {};
  let exemples = 0;
  cards.forEach(c => {
    parCat[c.cat] = (parCat[c.cat] || 0) + 1;
    if (c.exemples) exemples += c.exemples.length;
  });
  return { parCat, total: cards.length, exemples };
}

// Hunk ciblé : les seules lignes insérées, avec 2 lignes de contexte.
function imprimeHunk(candidat, ins){
  // un texte qui commence par '\n' n'insère rien sur la ligne de l'ancre : elle est du contexte
  const de = ins.finalAt + (ins.text.startsWith('\n') ? 1 : 0);
  const a = ins.finalAt + ins.text.length;
  const lignes = candidat.split('\n');
  const ligneDe = noLigne(candidat, de) - 1;          // index 0-based
  const ligneA = noLigne(candidat, Math.max(de, a - 1)) - 1;
  const ctxDe = Math.max(0, ligneDe - 2), ctxA = Math.min(lignes.length - 1, ligneA + 2);
  console.log('\n  @@ ' + ins.etiquette + ' (L' + (ligneDe + 1) + ') @@');
  for (let i = ctxDe; i <= ctxA; i++){
    const marque = (i >= ligneDe && i <= ligneA) ? '+' : ' ';
    console.log('  ' + marque + ' ' + lignes[i]);
  }
}

// ---------- sandbox §7.B : les validateurs lisent ROOT = __dirname → on copie tout ----------
function sandboxValidation(candidat){
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ajoute-mots-'));
  try {
    ['build.js', 'verifie_exemples.js'].forEach(f =>
      fs.copyFileSync(path.join(__dirname, f), path.join(dir, f)));
    fs.copyFileSync(APP, path.join(dir, 'app.html'));
    fs.writeFileSync(path.join(dir, 'vocabulaire_hebreu.html'), candidat);
    const build = spawnSync(process.execPath, ['build.js'], { cwd: dir, encoding: 'utf8' });
    if (build.status !== 0){
      return { ok: false, detail: '  [build.js]\n' + indenteTexte(build.stdout + build.stderr) };
    }
    const verif = spawnSync(process.execPath, ['verifie_exemples.js'], { cwd: dir, encoding: 'utf8' });
    if (verif.status !== 0){
      return { ok: false, detail: '  [verifie_exemples.js]\n' + indenteTexte(verif.stdout + verif.stderr) };
    }
    const warnings = (verif.stdout || '').split('\n').filter(l => l.trim().startsWith('⚠'));
    return { ok: true, warnings };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
function indenteTexte(t){ return String(t).trim().split('\n').map(l => '  ' + l).join('\n'); }

// ---------- parité §7.B : extractCards() d'app.html exécuté en jsdom vs build.js ----------
function lanceParite(candidat){
  let JSDOM;
  try { ({ JSDOM } = require('jsdom')); }
  catch (e){
    console.error('\n✗ --parite : jsdom introuvable. Recette (TODO.md § Outillage) :');
    console.error('    npm i jsdom dans un répertoire de travail hors dépôt, puis');
    console.error('    NODE_PATH=<ce répertoire>/node_modules node ajoute_mots.js …');
    return false;
  }
  let appCards;
  try {
    const ctx = vm.createContext({});
    ['stripNikud', 'firstText', 'extractCards'].forEach(fn =>
      vm.runInContext(grabFunction(appSrc, fn), ctx));
    ctx.__doc = new JSDOM(candidat).window.document;
    appCards = vm.runInContext('extractCards(__doc)', ctx);
  } catch (e){
    console.error('\n✗ --parite : exécution d\'extractCards (app.html) en échec : ' + e.message);
    return false;
  }
  const nodeCards = extractCards(candidat);
  const ecarts = [];
  if (appCards.length !== nodeCards.length){
    ecarts.push('comptes : app.html ' + appCards.length + ' cartes vs build.js ' + nodeCards.length);
  }
  const n = Math.min(appCards.length, nodeCards.length);
  for (let i = 0; i < n && ecarts.length < 12; i++){
    const a = appCards[i], b = nodeCards[i];
    if (a.cat !== b.cat || a.he_plain !== b.he_plain){
      ecarts.push('carte ' + i + ' : ' + a.cat + ' · ' + a.he_plain + ' (app) vs ' + b.cat + ' · ' + b.he_plain + ' (build)');
      continue;
    }
    const ka = Object.keys(a).join(','), kb = Object.keys(b).join(',');
    if (ka !== kb) ecarts.push('carte ' + i + ' (' + b.he_plain + ') : clés [' + ka + '] (app) vs [' + kb + '] (build) — l\'ordre d\'insertion des propriétés doit rester identique.');
  }
  if (ecarts.length){
    console.error('\n✗ Parité extractCards app.html / build.js en échec :');
    ecarts.forEach(e => console.error('    ' + e));
    return false;
  }
  console.log('\n  ✓ Parité extractCards : ' + nodeCards.length + ' cartes, comptes et clés identiques entre app.html (jsdom) et build.js.');
  return true;
}

main();
