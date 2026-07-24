#!/usr/bin/env node
/*
 * ajoute_mots.js — outil de développement (non déployé), zéro dépendance.
 * Générateur de fiche, étage 1 — contrat : SPEC_AJOUTE_MOTS.md (v3, chantier 2).
 *
 * v2 (chantier 2, tâche 11) : la cible d'écriture devient data/*.json (source de
 * vérité depuis build.js v2), plus jamais vocabulaire_hebreu.html directement.
 * Toute l'étape « composer le HTML de la fiche » a disparu : les gabarits
 * (src/carnet/gabarits.js) sont l'affaire du build, jamais de ce script.
 *
 * Consomme un petit nouveaux_mots.json (1..N opérations : nom, adjectif, verbe,
 * liste, exemple) et fait tout le mécanique : validation complète en amont,
 * placement dans le bon tableau/liste de data/ (par sous-thème/groupe, jamais par
 * numéro de ligne), translittération dérivée (he2tr d'app.html, surchargeable),
 * preuve par bac à sable (node build.js + node verifie_exemples.js sur la donnée
 * candidate, copiée dans un dossier temporaire), verdict avec diff ciblé (les
 * entrées JSON insérées) et tableau des tr dérivés.
 *
 * L'humain fournit ce que lui seul peut décider (hébreu vocalisé, sens, niveau,
 * thème, placement) ; le script dérive tout le calculable et n'écrit les données
 * réelles qu'après vert complet — et seulement avec --ecrire.
 *
 * Usage :
 *   node ajoute_mots.js nouveaux_mots.json                       # dry-run (défaut) : ne touche RIEN
 *   node ajoute_mots.js nouveaux_mots.json --ecrire              # insère dans data/, build, vérifie, garde si vert
 *   node ajoute_mots.js nouveaux_mots.json --ecrire --force      # passe outre les doublons même-section
 *
 * Aucun troisième parseur : la donnée vient de chargeDonnees()/valideDonnees()/
 * deriveCartes() (build.js). Aucune troisième translittération : he2tr est
 * extraite textuellement d'app.html et évaluée via vm (même procédé que
 * verifie_exemples.js) — échec bruyant si la fonction bouge, jamais de fallback
 * silencieux.
 *
 * Retiré au passage à v2 (raisons dans SPEC_AJOUTE_MOTS.md §10) :
 *   --nouveau-sous-theme : créer un sous-thème exige désormais un <h3>/placeholder
 *     neuf dans src/carnet/sections/ — composition de gabarit, plus l'affaire de
 *     ce script (édition manuelle du template, hors périmètre).
 *   --parite : comparait deriveCartes (build.js) à extractCards() d'app.html en
 *     jsdom. app.html n'a plus d'extraction (Chantier 2, tâche 8 : l'appli lit
 *     cards.json) — il n'y a plus rien à comparer, le flag n'a plus de sens.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const { spawnSync, execFileSync } = require('child_process');

const {
  chargeDonnees, valideDonnees, deriveCartes, NOTEBOOK, APP,
  stripNikud, orthographeVoisine,
  EXPECTED_LEVELS, EXPECTED_THEMES, listCats,
} = require('./build.js');

const ROOT = __dirname;

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

// ---------- slug (titre de sous-thème humain → groupe de data/), même algorithme que
// celui qui a produit les valeurs "groupe" actuelles de data/ (outils_migration/
// extrait_donnees.js et decoupe_carnet.js, chantier 1) — une seule source, jamais
// redéfinie deux fois. Idempotent sur un slug déjà propre : sous_theme peut donc
// être écrit en titre humain ("Nourriture & repas") ou déjà en slug ("nourriture-repas").
function slug(s){
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---------- constantes du générateur ----------
const NIQQUD = /[֑-ׇ]/;      // même plage que stripNikud
const TABLES = ['Verbes', 'Adjectifs', 'Noms'];
const TYPES = ['nom', 'adjectif', 'verbe', 'liste', 'exemple'];
// Listes à ordre sémantique : l'append y est une faute d'édition, `apres` recommandé (§5.3).
const LISTES_ORDONNEES = ['Nombres (0–10)', 'Nombres ordinaux', 'Jours de la semaine'];
const TABLE_KEY = { Noms: 'noms', Adjectifs: 'adjectifs', Verbes: 'verbes' };

// ---------- CLI ----------
const argv = process.argv.slice(2);
const FLAGS = {
  ecrire: argv.includes('--ecrire'),
  force: argv.includes('--force'),
};
const inconnus = argv.filter(a => a.startsWith('--') && !['--ecrire', '--force'].includes(a));
const jsonPath = argv.find(a => !a.startsWith('--'));
if (!jsonPath || inconnus.length){
  if (inconnus.length) console.error('✗ Option(s) inconnue(s) : ' + inconnus.join(', '));
  console.error('Usage : node ajoute_mots.js nouveaux_mots.json [--ecrire] [--force]');
  process.exit(1);
}

// ---------- politique des tr (§2.1 de la spec) ----------
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

// ---------- résolution des labels de section (typos fréquentes normalisées) ----------
function normLabel(s){
  return String(s).normalize('NFC').toLowerCase()
    .replace(/[–—]/g, '-').replace(/&/g, 'et').replace(/\s+/g, ' ').trim();
}
function quasi(label, candidats){
  const n = normLabel(label);
  return candidats.find(c => normLabel(c) === n && c !== label) || null;
}

// ---------- verdict : accumulateurs ----------
const erreurs = [], avertissements = [], infosDiverses = [], rappels = [];
const err = (m) => erreurs.push(m);

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
    '    Nouveau thème (16ᵉ slug) : hors périmètre du script — l\'ajouter à EXPECTED_THEMES (build.js) ET à THEMES (app.html), slugs identiques, avant tout theme neuf dans data/.');
}
function messageSectionInconnue(qui, section, valides){
  const sugg = quasi(section, valides);
  err(qui + ' : section « ' + section + ' » introuvable.' + (sugg ? ' Vouliez-vous dire « ' + sugg + ' » ?' : '') + '\n' +
    '    Sections valides : ' + valides.join(' · ') + '.\n' +
    '    Nouvelle section : hors périmètre du script — exige listCats + EXPECTED_CATS (build.js), un nouveau data/listes/<slug>.json et le placeholder @ENTREES correspondant dans src/carnet/sections/.');
}

// ---------- accès aux données (tableaux/listes de data/) ----------
function groupesDeTable(donnees, table){
  return new Set(donnees[table].map(e => e.groupe || ''));
}
function infoListe(donnees, sectionLabel){
  for (const s of Object.keys(donnees.listes)){
    if (donnees.listes[s].section === sectionLabel) return { slug: s, liste: donnees.listes[s] };
  }
  return null;
}
function trouveEntree(donnees, sectionLabel, ciblePlain){
  if (TABLES.includes(sectionLabel)){
    const table = TABLE_KEY[sectionLabel];
    return { table, hits: donnees[table].filter(e => stripNikud(e.he) === ciblePlain) };
  }
  const info = infoListe(donnees, sectionLabel);
  if (!info) return null;
  return { slug: info.slug, hits: info.liste.entries.filter(e => stripNikud(e.he) === ciblePlain) };
}

// ---------- construction des entrées data/ (remplace les gabarits HTML de v1) ----------
function exemplesArray(exs, mot){
  return (exs || []).map(ex => ({ he: ex.he, tr: trPour(ex.he, ex.tr, 'exemple', mot), fr: ex.fr }));
}
function formesArray(op, cles){
  return cles.map(k => {
    const f = op.formes[k];
    return { he: f.he, tr: trPour(f.he, f.tr, 'forme ' + k.toUpperCase(), op.he) };
  });
}
function construitNom(op){
  return {
    he: op.he, fr: op.fr, genre: op.genre,
    pluriel: (op.pluriel && chaine(op.pluriel.he))
      ? { he: op.pluriel.he, tr: trPour(op.pluriel.he, op.pluriel.tr, 'pluriel', op.he) }
      : null,
    niveau: op.niveau, theme: op.theme, groupe: slug(op.sous_theme),
    exemples: exemplesArray(op.exemples, op.he),
  };
}
function construitAdjectif(op){
  return {
    he: op.he, fr: op.fr, formes: formesArray(op, ['fs', 'mp', 'fp']),
    niveau: op.niveau, theme: op.theme, groupe: '',
    exemples: exemplesArray(op.exemples, op.he),
  };
}
function construitVerbe(op){
  return {
    he: op.he, fr: op.fr, formes: formesArray(op, ['ms', 'fs', 'mp', 'fp']),
    niveau: op.niveau, theme: op.theme, groupe: slug(op.sous_theme),
    exemples: exemplesArray(op.exemples, op.he),
  };
}
function construitListeEntree(op, hasGroupes){
  const e = { he: op.he, tr: trPour(op.he, op.tr, 'mot', op.he), fr: op.fr, niveau: op.niveau };
  if (hasGroupes) e.groupe = slug(op.sous_theme);
  e.exemples = exemplesArray(op.exemples, op.he);
  if (chaine(op.fr_court)) e.fr_court = op.fr_court;
  if (chaine(op.note)) e.note = op.note;
  return e;
}

// ---------- écriture des fichiers data/ (round-trip byte-identique prouvé, task-11-report.md) ----------
function cheminFichier(racine, cle){
  return cle.startsWith('listes/')
    ? path.join(racine, 'data', 'listes', cle.slice('listes/'.length) + '.json')
    : path.join(racine, 'data', cle + '.json');
}
function ecritFichier(racine, cle, valeur){
  const p = cheminFichier(racine, cle);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(valeur, null, 2) + '\n');
}
function ecritDonneesCompletes(racine, donnees){
  ecritFichier(racine, 'noms', donnees.noms);
  ecritFichier(racine, 'adjectifs', donnees.adjectifs);
  ecritFichier(racine, 'verbes', donnees.verbes);
  Object.keys(donnees.listes).forEach(s => ecritFichier(racine, 'listes/' + s, donnees.listes[s]));
}

// ---------- comptes (verdict §7.C) ----------
function comptes(cards){
  const parCat = {};
  let exemples = 0;
  cards.forEach(c => {
    parCat[c.cat] = (parCat[c.cat] || 0) + 1;
    if (c.exemples) exemples += c.exemples.length;
  });
  return { parCat, total: cards.length, exemples };
}

// ---------- diff ciblé : l'entrée JSON insérée, pas un hunk HTML (v1 → v2) ----------
function cheminDe(ins){
  if (ins.kind === 'mot') return 'data/' + ins.table + '.json';
  if (ins.kind === 'liste') return 'data/listes/' + ins.slug + '.json';
  return ins.table ? 'data/' + ins.table + '.json' : 'data/listes/' + ins.slug + '.json'; // exemple
}
function imprimeInsertion(ins){
  console.log('\n  @@ ' + ins.etiquette + '  (' + cheminDe(ins) + ') @@');
  const objet = ins.kind === 'exemple' ? ins.exemple : ins.entry;
  JSON.stringify(objet, null, 2).split('\n').forEach(l => console.log('  + ' + l));
}

// ---------- application des insertions à la donnée candidate (§5) ----------
function appliqueInsertions(candidat, insertions){
  insertions.forEach(ins => {
    if (ins.kind === 'mot'){
      const arr = candidat[ins.table];
      let idx = -1;
      for (let i = arr.length - 1; i >= 0; i--){ if ((arr[i].groupe || '') === ins.groupe){ idx = i; break; } }
      arr.splice(idx + 1, 0, ins.entry);
    } else if (ins.kind === 'liste'){
      const arr = candidat.listes[ins.slug].entries;
      let idx = -1;
      if (ins.apresPlain !== undefined){
        idx = arr.findIndex(e => stripNikud(e.he) === ins.apresPlain);
      } else {
        for (let i = arr.length - 1; i >= 0; i--){
          if (ins.groupe === undefined || arr[i].groupe === ins.groupe){ idx = i; break; }
        }
      }
      arr.splice(idx + 1, 0, ins.entry);
    } else { // exemple
      const arr = ins.table ? candidat[ins.table] : candidat.listes[ins.slug].entries;
      const entree = arr.find(e => stripNikud(e.he) === ins.ciblePlain);
      if (!entree.exemples) entree.exemples = [];
      entree.exemples.push(ins.exemple);
    }
  });
}

// ---------- bac à sable §7.B : copie build.js + verifie_exemples.js + app.html + src/carnet/
// + la donnée candidate dans un répertoire temporaire, y lance node build.js puis
// node verifie_exemples.js — __dirname suit la copie, zéro modification des validateurs,
// preuve complète sur le candidat avant de toucher le dépôt réel. ----------
function indenteTexte(t){ return String(t).trim().split('\n').map(l => '  ' + l).join('\n'); }
function sandboxValidation(candidat){
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ajoute-mots-'));
  try {
    ['build.js', 'verifie_exemples.js'].forEach(f =>
      fs.copyFileSync(path.join(ROOT, f), path.join(dir, f)));
    fs.copyFileSync(APP, path.join(dir, 'app.html'));
    fs.cpSync(path.join(ROOT, 'src'), path.join(dir, 'src'), { recursive: true });
    ecritDonneesCompletes(dir, candidat);
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

  const donnees = chargeDonnees(ROOT);

  // Arbre git sale sur data/ : le diff du script se mélangerait à autre chose (§8).
  try {
    const st = execFileSync('git', ['status', '--porcelain', '--', 'data'],
      { cwd: ROOT, encoding: 'utf8' }).trim();
    if (st) infosDiverses.push('ℹ Arbre git sale sur data/ — le diff de ce script se mélangera à des modifications déjà en cours.');
  } catch (e){ /* pas de git : tant pis pour l'avertissement */ }

  // Index corpus entier : he_plain (headword) → occurrences {section, he, fichier} (§7.A doublons).
  const index = new Map();
  const pousseIndex = (plain, section, he, fichier) => {
    if (!plain) return;
    const a = index.get(plain) || []; a.push({ section, he, fichier }); index.set(plain, a);
  };
  TABLES.forEach(nom => {
    const table = TABLE_KEY[nom];
    donnees[table].forEach(e => pousseIndex(stripNikud(e.he), nom, e.he, 'data/' + table + '.json'));
  });
  Object.keys(listCats).forEach(nom => {
    const info = infoListe(donnees, nom);
    if (!info) return;
    info.liste.entries.forEach(e => pousseIndex(stripNikud(e.he), nom, e.he, 'data/listes/' + info.slug + '.json'));
  });

  const insertions = [];          // specs { kind, ... }
  const ignorees = [];            // doublons skippés (idempotence)
  const vusDansLeLot = new Set(); // doublons internes au JSON : 'section he_plain'

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
      const valides = TABLES.concat(Object.keys(listCats));
      if (!valides.includes(op.section)){ messageSectionInconnue(qui, op.section, valides); return; }
      const cible = op.cible.trim();
      const trouve = trouveEntree(donnees, op.section, cible);
      if (!trouve || !trouve.hits.length){ err(qui + ' : cible « ' + cible + ' » introuvable dans la section ' + op.section + '.'); return; }
      if (trouve.hits.length > 1){
        err(qui + ' : cible « ' + cible + ' » ambiguë dans ' + op.section + ' — candidats : ' +
          trouve.hits.map(h => h.he + ' (' + h.fr + ')').join(' ; ') + '. Homographes : préciser via une autre section ou enrichir à la main.');
        return;
      }
      const cibleEntry = trouve.hits[0];
      const deja = (cibleEntry.exemples || []).some(ex => stripNikud(ex.he) === stripNikud(op.exemple.he));
      if (deja && !FLAGS.force){
        ignorees.push('⚠ ' + qui + ' : cet exemple existe déjà sur ' + cibleEntry.he + ' (' + op.section + ') — ignoré (--force pour l\'ajouter quand même).');
        return;
      }
      insertions.push({
        kind: 'exemple', table: trouve.table, slug: trouve.slug, ciblePlain: cible,
        exemple: { he: op.exemple.he, tr: trPour(op.exemple.he, op.exemple.tr, 'exemple', cibleEntry.he), fr: op.exemple.fr },
        etiquette: op.section + ' · ' + cibleEntry.he + ' (exemple)', iOp,
      });
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
        err(qui + ' : formes du présent incomplètes (' + manquantes.join(', ') + ') — les 4 sont obligatoires et non vides, l\'extracteur les pousse sans condition.');
        return;
      }
      ['ms', 'fs', 'mp', 'fp'].forEach(k => verifieNiqqud(qui + ' forme ' + k.toUpperCase(), op.formes[k].he));
    }
    if (op.type === 'adjectif'){
      // v1 tolérait une forme défective (null → <td>—</td>) ; retiré en v2 : le
      // gabarit actuel (src/carnet/gabarits.js:heSpan) n'a pas de représentation
      // pour une forme absente et écrirait « undefined » en toutes lettres dans
      // le carnet — vérifié en lisant heSpan avant d'écrire ce contrôle
      // (task-11-report.md). Les 3 formes sont donc obligatoires et non vides,
      // comme pour un verbe.
      const manquantes = ['fs', 'mp', 'fp'].filter(k => !op.formes || !op.formes[k] || !chaine(op.formes[k].he));
      if (manquantes.length){
        err(qui + ' : formes fs/mp/fp incomplètes (' + manquantes.join(', ') + ') — les 3 sont obligatoires et non vides (aucun gabarit pour une forme défective, voir SPEC_AJOUTE_MOTS.md §3.3).');
        return;
      }
      ['fs', 'mp', 'fp'].forEach(k => verifieNiqqud(qui + ' forme ' + k.toUpperCase(), op.formes[k].he));
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
    const cleLot = op.section + ' ' + plain;
    const occs = index.get(plain) || [];
    const memeSection = occs.filter(o => o.section === op.section);
    const autres = occs.filter(o => o.section !== op.section);
    if ((memeSection.length || vusDansLeLot.has(cleLot)) && !FLAGS.force){
      const ou = memeSection.length ? (op.section + ' — ' + memeSection[0].fichier) : 'déjà dans ce lot';
      ignorees.push('⚠ ' + qui + ' : « ' + plain + ' » déjà présent (' + ou + ') — ignoré (--force pour l\'insérer quand même).');
      return;
    }
    autres.forEach(o => infosDiverses.push('ℹ ' + qui + ' : « ' + plain + ' » figure aussi dans ' +
      o.section + ' (' + o.fichier + ') — homographe légitime ? à arbitrer, n\'empêche rien.'));

    // Angle mort du garde exact ci-dessus : une fiche écrite en ktiv male
    // vocalisé (עִיתּוֹן) ne rencontrerait pas le mot défectif du corpus (עתון).
    // Signal INFORMATIF seulement — le bloquant reste la comparaison exacte.
    for (const [autrePlain, occs2] of index){
      if (!orthographeVoisine(autrePlain, plain)) continue;
      const o = occs2[0];
      infosDiverses.push('ℹ ' + qui + ' : orthographe voisine de « ' + autrePlain + ' » (' +
        o.section + ', ' + o.fichier + ') — ktiv male/haser du même mot ? à vérifier, n\'empêche rien.');
    }

    vusDansLeLot.add(cleLot);

    // ----- placement (§5) -----
    if (estTable && op.type !== 'adjectif'){
      const table = TABLE_KEY[op.section];
      const groupesDisponibles = groupesDeTable(donnees, table);
      if (!chaine(op.sous_theme)){
        err(qui + ' : sous_theme obligatoire dans ' + op.section + '. Disponibles : ' +
          [...groupesDisponibles].filter(Boolean).sort().join(' · ') + '.');
        return;
      }
      const groupe = slug(op.sous_theme);
      if (!groupesDisponibles.has(groupe)){
        err(qui + ' : sous-thème « ' + op.sous_theme + ' » (slug « ' + groupe + ' ») introuvable dans ' + op.section + '.\n' +
          '    Disponibles : ' + [...groupesDisponibles].filter(Boolean).sort().join(' · ') +
          '.\n    Nouveau sous-thème : hors périmètre du script — exige un <h3 class="subtheme"> et un placeholder @ENTREES neufs dans src/carnet/sections/ (édition manuelle du gabarit), puis relancer.');
        return;
      }
      const entry = op.type === 'nom' ? construitNom(op) : construitVerbe(op);
      insertions.push({ kind: 'mot', table, groupe, entry, etiquette: op.section + ' — ' + op.sous_theme + ' · ' + op.he, iOp });
      return;
    }

    if (op.type === 'adjectif'){
      const entry = construitAdjectif(op);
      insertions.push({ kind: 'mot', table: 'adjectifs', groupe: '', entry, etiquette: 'Adjectifs · ' + op.he, iOp });
      return;
    }

    // ----- liste (§3.5) -----
    const info = infoListe(donnees, op.section);
    if (!info){ messageSectionInconnue(qui, op.section, Object.keys(listCats)); return; }
    const hasGroupes = info.liste.entries.some(e => e.groupe !== undefined);
    let groupe;
    if (hasGroupes){
      if (!chaine(op.sous_theme)){
        const disp = [...new Set(info.liste.entries.map(e => e.groupe))].filter(Boolean).sort();
        err(qui + ' : ' + op.section + ' est multi-listes — sous_theme obligatoire. Disponibles : ' + disp.join(' · ') + '.');
        return;
      }
      groupe = slug(op.sous_theme);
      const disp = new Set(info.liste.entries.map(e => e.groupe));
      if (!disp.has(groupe)){
        err(qui + ' : sous-thème « ' + op.sous_theme + ' » (slug « ' + groupe + ' ») introuvable dans ' + op.section + '. Disponibles : ' +
          [...disp].filter(Boolean).sort().join(' · ') + '.');
        return;
      }
    } else {
      if (chaine(op.sous_theme)){ err(qui + ' : ' + op.section + ' est mono-liste — pas de sous_theme.'); return; }
      groupe = undefined;
    }

    let apresPlain;
    if (op.apres !== undefined){
      if (!chaine(op.apres)){ err(qui + ' : apres doit être le he_plain d\'un voisin de la liste.'); return; }
      apresPlain = op.apres.trim();
      const pool = info.liste.entries.filter(e => (hasGroupes ? e.groupe === groupe : true));
      const voisin = pool.find(e => stripNikud(e.he) === apresPlain);
      if (!voisin){
        err(qui + ' : voisin « ' + op.apres + ' » introuvable dans ' + op.section + (hasGroupes ? ' — ' + op.sous_theme : '') +
          ' — apres attend le he_plain d\'une entrée existante de cette liste.');
        return;
      }
    } else if (LISTES_ORDONNEES.includes(op.section)){
      rappels.push('↪ ' + qui + ' : append en fin de « ' + op.section + ' », liste à ordre sémantique — le champ apres (he_plain d\'un voisin) place l\'entrée à sa place naturelle.');
    }

    const entry = construitListeEntree(op, hasGroupes);
    insertions.push({
      kind: 'liste', slug: info.slug, groupe, apresPlain, entry,
      etiquette: op.section + (hasGroupes ? ' — ' + op.sous_theme : '') + ' · ' + op.he, iOp,
    });
  });

  // ----- tout ou rien (§7.A) -----
  if (erreurs.length){
    console.error('✗ Validation pré-insertion en échec — rien n\'est écrit (tout ou rien).\n');
    erreurs.forEach(e => console.error('  ✗ ' + e));
    ignorees.forEach(i => console.error('  ' + i));
    process.exit(1);
  }

  // ----- candidat : clone profond + application des insertions (§5) -----
  const candidat = structuredClone(donnees);
  appliqueInsertions(candidat, insertions);

  // ----- validation de la cible (mêmes contrôles que build.js, en process, avant tout bac à sable) -----
  try {
    valideDonnees(candidat);
  } catch (e){
    console.error('✗ valideDonnees(candidat) en échec après insertion — rien n\'est écrit : ' + e.message);
    console.error('  (bogue de construction de l\'entrée — les contrôles pré-insertion ci-dessus n\'ont pas suffi à l\'attraper.)');
    process.exit(1);
  }

  // ----- verdict §7.C -----
  const avant = comptes(deriveCartes(donnees));
  const apres = insertions.length ? comptes(deriveCartes(candidat)) : avant;
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
    console.log('\nRien à insérer' + (ignorees.length ? ' (tout le lot est déjà dans data/ — idempotence)' : '') + '. data/ n\'est pas modifié.');
    return;
  }

  console.log('\nDiff ciblé (' + insertions.length + ' insertion(s)) :');
  insertions.forEach(imprimeInsertion);

  rappels.forEach(r => console.log('\n' + r));

  // ----- preuve bac à sable (§7.B) -----
  console.log('\nValidation bac à sable (build.js + verifie_exemples.js sur la donnée candidate)…');
  const sb = sandboxValidation(candidat);
  if (!sb.ok){
    console.error('\n✗ Bac à sable en échec — data/ réel n\'est PAS modifié.');
    console.error(sb.detail);
    process.exit(1);
  }
  console.log('  ✓ build.js bac à sable : vert (' + apres.total + ' cartes).');
  console.log('  ✓ verifie_exemples.js bac à sable : 0 erreur.');
  if (sb.warnings.length){
    console.log('  Avertissements de verifie_exemples.js (signaux éditoriaux, non bloquants) :');
    sb.warnings.forEach(w => console.log('  ' + w));
  }

  // ----- écriture (§9) -----
  if (FLAGS.ecrire){
    const changes = [];
    ['noms', 'adjectifs', 'verbes'].forEach(t => {
      if (JSON.stringify(donnees[t]) !== JSON.stringify(candidat[t])) changes.push(t);
    });
    Object.keys(candidat.listes).forEach(s => {
      if (JSON.stringify(donnees.listes[s]) !== JSON.stringify(candidat.listes[s])) changes.push('listes/' + s);
    });
    changes.forEach(cle => ecritFichier(ROOT, cle, cle.startsWith('listes/') ? candidat.listes[cle.slice(7)] : candidat[cle]));

    const rb = spawnSync(process.execPath, ['build.js'], { cwd: ROOT, encoding: 'utf8' });
    if (rb.status !== 0){
      changes.forEach(cle => ecritFichier(ROOT, cle, cle.startsWith('listes/') ? donnees.listes[cle.slice(7)] : donnees[cle]));
      console.error('\n✗ node build.js a échoué sur les données réelles — data/ restauré tel quel.');
      console.error((rb.stderr || rb.stdout || '').trim());
      process.exit(1);
    }
    console.log('\n✓ data/ écrit (' + changes.map(c => 'data/' + c + '.json').join(', ') + ') — carnet, cards.json et standalone régénérés (node build.js).');
  } else {
    console.log('\nDry-run : rien n\'est écrit. Relire le tableau des tr dérivés puis relancer avec --ecrire.');
  }

  console.log('\n↪ PWA : le carnet est servi en stale-while-revalidate (sw.js) — les mots neufs atteignent');
  console.log('  l\'iPhone au 2ᵉ lancement sans bump ; bump VERSION dans sw.js si tu les veux au 1ᵉʳ.');
  console.log('  (Le script ne bump jamais lui-même — décision de fil principal.)');
}

main();
