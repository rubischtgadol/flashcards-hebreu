#!/usr/bin/env node
/*
 * audit_carnet_mecanique.js — outil de développement (non déployé), zéro dépendance.
 *
 * Étage 0 du plan d'audit du carnet (docs/superpowers/specs/2026-07-20-audit-carnet-plan.md) :
 * tout ce qui est décidable par script se décide ici, pour zéro token. Le script
 * produit TOUTES les pièces de travail de `audit/` (dossier gitignoré, régénérable) :
 *
 *   audit/mecanique.json  — { erreurs, drapeaux, donnees } des 14 contrôles ;
 *   audit/sNN.json        — les 28 tranches de cartes (17–28 cartes chacune,
 *                           catégorie pure pour les grandes, mixte pour les petites),
 *                           chaque tranche portant en `flags` les drapeaux de ses
 *                           cartes (routage ✎R2 : l'auditeur de l'étage 2 les tranche) ;
 *   audit/_index.json     — la table des tranches, avec la preuve somme = 713.
 *
 * Trois natures de sortie, à ne pas confondre :
 *   erreur   — certaine, décidée ici, aucun modèle à consulter ;
 *   drapeau  — suspicion, l'hébreu est plein d'exceptions légitimes : tranché par
 *              l'auditeur LLM de la tranche (ou par Haiku si > ~150 drapeaux) ;
 *   donnee   — mesure informative (contrôle 14), ni erreur ni suspicion.
 *
 * Source des cartes : le CARDS embarqué de `flashcards_hebreu.html` (identique à
 * l'extraction du carnet par construction — `build.js --check` le garantit).
 * he2tr / trKey / editDist sont extraites d'app.html via vm, comme dans
 * `verifie_exemples.js` (concordance par construction avec l'appli).
 *
 * Usage : node audit_carnet_mecanique.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const STANDALONE = path.join(ROOT, 'flashcards_hebreu.html');
const NOTEBOOK = path.join(ROOT, 'vocabulaire_hebreu.html');
const APP = path.join(ROOT, 'app.html');
const OUT = path.join(ROOT, 'audit');

// ---------- cartes ----------
const standalone = fs.readFileSync(STANDALONE, 'utf8');
const mCards = standalone.match(/^const CARDS = (\[.*\]);$/m);
if (!mCards) { console.error('✗ CARDS introuvable dans flashcards_hebreu.html'); process.exit(1); }
const CARDS = JSON.parse(mCards[1]);
CARDS.forEach((c, i) => { c.__i = i; });
if (CARDS.length !== 713) { console.error('✗ ' + CARDS.length + ' cartes lues, 713 attendues'); process.exit(1); }

// ---------- fonctions de l'appli (mêmes briques que verifie_exemples.js) ----------
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
const sandbox = {};
vm.createContext(sandbox);
['he2tr', 'trKey', 'editDist'].forEach(fn => vm.runInContext(grabFunction(appSrc, fn), sandbox));
const he2tr = (s) => vm.runInContext('he2tr(' + JSON.stringify(s) + ')', sandbox);
const trKey = (s) => vm.runInContext('trKey(' + JSON.stringify(s) + ')', sandbox);
const editDist = (a, b) => vm.runInContext('editDist(' + JSON.stringify(a) + ',' + JSON.stringify(b) + ')', sandbox);

// ---------- utilitaires hébreu ----------
const stripNikud = s => s.replace(/[֑-ׇ]/g, '');
const FINALES = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const normFinales = s => s.replace(/[ךםןףץ]/g, ch => FINALES[ch]);
const hebOnly = s => s.replace(/[^א-ת]/g, '');
const tokens = s => s.split(/[\s־]+/).map(t => t.trim()).filter(Boolean);

// ---------- collecte ----------
const erreurs = [], drapeaux = [], donnees = [];
const pousse = (liste, controle, nom, card, detail, extra) =>
  liste.push(Object.assign({ controle, nom, card_index: card ? card.__i : null,
    cat: card ? card.cat : null, he: card ? card.he : null, detail }, extra || {}));

// ---------- contrôle 1 : he_plain === stripNikud(he), partout ----------
CARDS.forEach(c => {
  if (stripNikud(c.he) !== c.he_plain)
    pousse(erreurs, 1, 'he_plain incohérent', c, 'carte : « ' + c.he_plain + ' » ≠ stripNikud(« ' + c.he + ' »)');
  (c.forms || []).forEach(f => {
    if (stripNikud(f.he) !== f.he_plain)
      pousse(erreurs, 1, 'he_plain incohérent', c, 'forme ' + f.label + ' : « ' + f.he_plain + ' » ≠ stripNikud(he)');
  });
  (c.exemples || []).forEach(ex => {
    if (stripNikud(ex.he) !== ex.he_plain)
      pousse(erreurs, 1, 'he_plain incohérent', c, 'exemple « ' + ex.he_plain + ' » ≠ stripNikud(he)');
  });
});

// ---------- contrôle 2 : carte sans aucun nikoud ----------
CARDS.forEach(c => {
  if (c.he === c.he_plain)
    pousse(erreurs, 2, 'carte sans nikoud', c, 'he === he_plain — le carnet promet de l\'hébreu vocalisé');
});

// ---------- contrôle 3 : doublons cat|he (0 attendu) et cat|he_plain (3 homographes) ----------
const HOMOGRAPHES = ['לספר', 'ללמד', 'מה שלומך'];
{
  const parHe = new Map(), parPlain = new Map();
  CARDS.forEach(c => {
    const k1 = c.cat + '|' + c.he, k2 = c.cat + '|' + c.he_plain;
    (parHe.get(k1) || parHe.set(k1, []).get(k1)).push(c.__i);
    (parPlain.get(k2) || parPlain.set(k2, []).get(k2)).push(c.__i);
  });
  for (const [k, idx] of parHe) if (idx.length > 1)
    pousse(erreurs, 3, 'doublon cat|he', CARDS[idx[0]], k + ' porté par les cartes ' + idx.join(', '));
  const collisions = [...parPlain].filter(([, idx]) => idx.length > 1);
  const inattendues = collisions.filter(([k]) => !HOMOGRAPHES.includes(k.split('|')[1]));
  for (const [k, idx] of inattendues)
    pousse(erreurs, 3, 'collision cat|he_plain inattendue', CARDS[idx[0]], k + ' — cartes ' + idx.join(', ') + ' (seuls les 3 homographes connus sont admis)');
  if (collisions.length - inattendues.length !== HOMOGRAPHES.length)
    pousse(erreurs, 3, 'garde homographes', null, (collisions.length - inattendues.length) + ' collisions connues au lieu de 3 — régression de la garde');
}

// ---------- contrôle 4 : cardinalité des formes (distribution mesurée le 20/07) ----------
const FORMES_ATTENDUES = {
  Verbes: ['il', 'elle', 'ils', 'elles'],
  Adjectifs: ['f. sing.', 'm. plur.', 'f. plur.']
};
CARDS.forEach(c => {
  const labels = (c.forms || []).map(f => f.label);
  if (c.cat === 'Verbes' || c.cat === 'Adjectifs') {
    const attendu = FORMES_ATTENDUES[c.cat];
    if (labels.join('|') !== attendu.join('|'))
      pousse(erreurs, 4, 'cardinalité des formes', c, 'formes [' + labels.join(', ') + '], attendu exactement [' + attendu.join(', ') + ']');
  } else if (c.cat === 'Noms') {
    if (!(labels.length === 0 || labels.join('|') === 'pluriel'))
      pousse(erreurs, 4, 'cardinalité des formes', c, 'formes [' + labels.join(', ') + '], attendu 0 ou 1 « pluriel »');
  } else if (labels.length)
    pousse(erreurs, 4, 'cardinalité des formes', c, 'formes inattendues [' + labels.join(', ') + '] pour la catégorie ' + c.cat);
});

// ---------- contrôle 5 : pluriel identique au singulier ----------
CARDS.filter(c => c.cat === 'Noms').forEach(c => {
  const pl = (c.forms || []).find(f => f.label === 'pluriel');
  if (!pl) return;
  if (pl.he === c.he)
    pousse(erreurs, 5, 'pluriel = singulier', c, 'la forme pluriel est identique au singulier vocalisé');
  else if (pl.he_plain === c.he_plain)
    pousse(drapeaux, 5, 'pluriel = singulier (consonnes)', c, 'pluriel « ' + pl.he + ' » ne diffère du singulier que par le nikoud');
});

// ---------- contrôle 6 : lettres finales, nikoud doublé, tiret ASCII ----------
function controleTexte(c, contexte, he){
  tokens(stripNikud(he)).forEach(tok => {
    const lettres = hebOnly(tok);
    for (let i = 0; i < lettres.length - 1; i++)
      if (FINALES[lettres[i]])
        pousse(erreurs, 6, 'lettre finale en position non finale', c, contexte + ' : « ' + tok + ' » (lettre ' + lettres[i] + ')');
  });
  const dbl = he.match(/([ְ-ׇ])\1/);
  if (dbl)
    pousse(erreurs, 6, 'nikoud doublé', c, contexte + ' : signe ' + dbl[1].codePointAt(0).toString(16) + ' répété dans « ' + he + ' »');
  if (/[א-ת][^ ]*-|-[^ ]*[א-ת]/.test(he))
    pousse(erreurs, 6, 'tiret ASCII dans l\'hébreu', c, contexte + ' : « ' + he + ' » — un maqaf U+05BE est attendu');
}
CARDS.forEach(c => {
  controleTexte(c, 'vedette', c.he);
  (c.forms || []).forEach(f => controleTexte(c, 'forme ' + f.label, f.he));
  (c.exemples || []).forEach(ex => controleTexte(c, 'exemple', ex.he));
});

// ---------- contrôle 7 : accord genre ↔ terminaison (drapeaux) ----------
CARDS.filter(c => c.cat === 'Noms' && c.genre).forEach(c => {
  const finKamatsHe = c.he.endsWith('ָה');           // ־ָה
  const finTav = c.he_plain.endsWith('ת');
  const allureFeminine = finKamatsHe || finTav;
  if (c.genre === 'm' && allureFeminine)
    pousse(drapeaux, 7, 'genre m à terminaison féminine', c, 'déclaré m mais finit par ' + (finKamatsHe ? '־ָה' : '־ת'));
  if (c.genre === 'f' && !allureFeminine && !c.he_plain.endsWith('ה'))
    pousse(drapeaux, 7, 'genre f sans terminaison féminine', c, 'déclaré f sans finir par ־ָה ni ־ת');
});

// ---------- contrôle 8 : pluriel ↔ genre (drapeaux — exceptions légitimes nombreuses) ----------
CARDS.filter(c => c.cat === 'Noms' && c.genre).forEach(c => {
  const pl = (c.forms || []).find(f => f.label === 'pluriel');
  if (!pl) return;
  if (c.genre === 'm' && !pl.he_plain.endsWith('ים'))
    pousse(drapeaux, 8, 'pluriel m hors schéma ־ים', c, 'pluriel « ' + pl.he + ' »');
  if (c.genre === 'f' && !pl.he_plain.endsWith('ות'))
    pousse(drapeaux, 8, 'pluriel f hors schéma ־ות', c, 'pluriel « ' + pl.he + ' »');
});

// ---------- contrôle 9 : terminaisons des 3 accords d'adjectif (heuristique, drapeaux) ----------
CARDS.filter(c => c.cat === 'Adjectifs').forEach(c => {
  (c.forms || []).forEach(f => {
    const p = f.he_plain;
    const ok = f.label === 'f. sing.' ? (p.endsWith('ה') || p.endsWith('ת'))
             : f.label === 'm. plur.' ? p.endsWith('ים')
             : f.label === 'f. plur.' ? p.endsWith('ות') : true;
    if (!ok)
      pousse(drapeaux, 9, 'accord d\'adjectif hors schéma', c, f.label + ' « ' + f.he + ' » ne porte pas la terminaison attendue');
  });
});

// ---------- contrôle 10 : cohérence intra-famille (deux filets, ✎R2) ----------
// Raffinements mesurés le 20/07 (à reporter dans le rapport — règle « aucun
// plafond silencieux ») : la version naïve produisait 1073 drapeaux-cartes dont
// l'écrasante majorité de bruit structurel. Trois restrictions décidables :
//   1. filet a limité aux VEDETTES et FORMES (les tokens d'exemples portent des
//      préfixes dont la vocalisation varie légitimement : בְּבַיִת / בַּבַּיִת) ;
//   2. filet a : un constat dont toutes les variantes vivent dans UNE seule carte
//      est le paradigme il/elle d'un même verbe (קוֹנֶה/קוֹנָה) — exclu ;
//   3. filet b : insertions INTÉRIEURES seulement (ni première ni dernière
//      lettre), hors alternances flexionnelles ־וֹת/־ת et ־ִים/־ם. Les 4 cas
//      historiques de 41cf08c passent tous ces filtres (vérifié).
// Un constat = UN drapeau, rattaché à chaque carte impliquée pour le routage.
{
  const citations = new Map();   // plain → Map(vocalisé → Set(card_index)) — vedettes + formes
  const ancres = new Map();      // plain → { entree: idx|null, exemple: idx|null } — tout le carnet
  function verseCitation(he, idx){
    tokens(he).forEach(tok => {
      const voc = tok.replace(/[^א-ת֑-ׇ]/g, '');
      const plain = hebOnly(voc);
      if (plain.length < 2) return;
      if (!citations.has(plain)) citations.set(plain, new Map());
      const m = citations.get(plain);
      if (!m.has(voc)) m.set(voc, new Set());
      m.get(voc).add(idx);
    });
  }
  function verseAncre(he, idx, type){
    tokens(stripNikud(he)).forEach(tok => {
      const plain = hebOnly(tok);
      if (plain.length < 2) return;
      if (!ancres.has(plain)) ancres.set(plain, { entree: null, exemple: null });
      const a = ancres.get(plain);
      if (a[type] === null) a[type] = idx;
    });
  }
  CARDS.forEach(c => {
    verseCitation(c.he, c.__i);
    verseAncre(c.he, c.__i, 'entree');
    (c.forms || []).forEach(f => { verseCitation(f.he, c.__i); verseAncre(f.he, c.__i, 'entree'); });
    (c.exemples || []).forEach(ex => verseAncre(ex.he, c.__i, 'exemple'));
  });
  // Filet a : un même he_plain de citation porté par ≥ 2 vocalisations distinctes.
  // Liste blanche : les tokens des 3 homographes voulus (distingués par le nikoud).
  const BLANCHE = new Set(['לספר', 'ללמד', 'שלומך']);
  for (const [plain, m] of citations){
    if (m.size < 2 || BLANCHE.has(plain)) continue;
    const cartes = new Set(); m.forEach(set => set.forEach(i => cartes.add(i)));
    if (cartes.size < 2) continue;                       // paradigme interne d'une carte
    const detail = 'les vocalisations « ' + [...m.keys()].join(' » / « ') +
      ' » coexistent (cartes ' + [...cartes].join(', ') + ')';
    const liste = [...cartes];
    pousse(drapeaux, 10, 'même consonnes, nikoud divergent', CARDS[liste[0]], detail,
      { cartes_liees: liste });
  }
  // Filet b : deux plains ne différant que par l'insertion intérieure d'un ו ou
  // d'un י (ktiv malé vs ktiv haser — le filet qui attrape les 4 cas de 41cf08c).
  const paires = new Set();
  const ancre = plain => { const a = ancres.get(plain); return a.entree !== null ? a.entree : a.exemple; };
  for (const plain of ancres.keys()){
    for (let i = 1; i < plain.length - 1; i++){
      if (plain[i] !== 'ו' && plain[i] !== 'י') continue;
      const court = plain.slice(0, i) + plain.slice(i + 1);
      if (court.length < 2 || !ancres.has(court)) continue;
      if (i === plain.length - 2 && plain[i] === 'ו' && plain.endsWith('ות')) continue;
      if (i === plain.length - 2 && plain[i] === 'י' && plain.endsWith('ים')) continue;
      const cle = court + '<' + plain;
      if (paires.has(cle)) continue;
      paires.add(cle);
      const liste = [...new Set([ancre(plain), ancre(court)])];
      const detail = '« ' + plain + ' » et « ' + court + ' » ne diffèrent que par un ' + plain[i] +
        ' intérieur (ktiv malé/haser ? cartes ' + liste.join(', ') + ')';
      pousse(drapeaux, 10, 'paire malé/haser', CARDS[liste[0]], detail, { cartes_liees: liste });
    }
  }
}

// ---------- contrôle 11 : écart tr ↔ he2tr sur vedettes et formes (drapeau, sévérité basse) ----------
CARDS.forEach(c => {
  const paires = [];
  if (c.tr) paires.push(['vedette', c.he, c.tr]);
  (c.forms || []).forEach(f => { if (f.tr) paires.push(['forme ' + f.label, f.he, f.tr]); });
  paires.forEach(([contexte, he, tr]) => {
    const d = editDist(trKey(he2tr(he)), trKey(tr));
    if (d > 2)
      pousse(drapeaux, 11, 'écart tr/he2tr (sévérité basse : le carnet fait foi)', c,
        contexte + ' : « ' + tr + ' » vs he2tr « ' + he2tr(he) + ' » (distance ' + d + ')');
  });
});

// ---------- contrôle 12 : l'exemple contient-il le mot vedette ? (drapeau) ----------
const PREFIXES = /^[והבלמשכ]/;
function variantes(tok){
  const v = [tok];
  let t = tok;
  for (let n = 0; n < 2; n++)
    if (PREFIXES.test(t) && t.length > 2){ t = t.slice(1); v.push(t); }
  return v;
}
CARDS.forEach(c => {
  if (!c.exemples) return;
  const cibles = [c.he_plain].concat((c.forms || []).map(f => f.he_plain))
    .map(normFinales).filter(Boolean);
  c.exemples.forEach(ex => {
    const phrase = normFinales(ex.he_plain);
    const toks = tokens(phrase).map(hebOnly).filter(Boolean);
    const trouve = cibles.some(cible => {
      if (cible.includes(' ')) return phrase.includes(cible);
      return toks.some(tok => variantes(tok).some(v =>
        cible.length <= 2 ? v === cible : v.includes(cible)));
    });
    if (!trouve)
      pousse(drapeaux, 12, 'exemple sans le mot vedette', c, '« ' + ex.he_plain + ' » ne contient ni la vedette ni ses formes (préfixes pelés)');
  });
});

// ---------- contrôle 13 : traduction d'exemple absente ou de longueur aberrante ----------
CARDS.forEach(c => {
  (c.exemples || []).forEach(ex => {
    if (!ex.fr){ pousse(erreurs, 13, 'exemple sans traduction', c, '« ' + ex.he_plain + ' »'); return; }
    const r = ex.fr.length / ex.he_plain.length;
    if (r < 0.6 || r > 5)
      pousse(drapeaux, 13, 'ratio de longueur he/fr aberrant', c,
        '« ' + ex.he_plain + ' » ↔ « ' + ex.fr + ' » (ratio ' + r.toFixed(2) + ')');
  });
});

// ---------- contrôle 14 : vocabulaire d'exemple à +1 niveau (donnée, pas erreur) ----------
{
  const LEVELS = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
  const lexicon = new Map();
  const feed = (hePlain, niveau) => {
    if (!hePlain) return;
    hePlain.split(/\s+/).forEach(w => {
      if (!w) return;
      const lv = niveau ? LEVELS[niveau] || 0 : 0;
      const cur = lexicon.get(w);
      if (cur === undefined || lv < cur) lexicon.set(w, lv);
    });
  };
  CARDS.forEach(c => {
    feed(c.he_plain, c.niveau);
    (c.forms || []).forEach(f => feed(f.he_plain, c.niveau));
  });
  // Les sections de grammaire enseignent des formes sans produire de cartes
  // (mêmes garde-fous que verifie_exemples.js : hors <ul class="exemples">,
  // ajout des seuls mots inconnus, au niveau 0).
  const horsExemples = fs.readFileSync(NOTEBOOK, 'utf8')
    .replace(/<ul class="exemples">[\s\S]*?<\/ul>/g, ' ');
  for (const m of horsExemples.matchAll(/<span class="he"[^>]*>([^<]*)<\/span>/g))
    stripNikud(m[1]).split(/[\s־]+/).forEach(w => {
      const clean = hebOnly(w);
      if (clean.length > 1 && !lexicon.has(clean)) lexicon.set(clean, 0);
    });
  const lookup = tok => {
    for (const v of variantes(tok)) if (lexicon.has(v)) return lexicon.get(v);
    return null;
  };
  CARDS.forEach(c => {
    if (!c.exemples || !c.niveau) return;
    const wordLevel = LEVELS[c.niveau] || 0;
    c.exemples.forEach(ex => {
      ex.he_plain.replace(/תל אביב|ירושלים|ישראל/g, ' ').split(/[\s־]+/).forEach(tok => {
        const clean = hebOnly(tok);
        if (clean.length <= 1) return;
        const lv = lookup(clean);
        if (lv !== null && wordLevel && lv === wordLevel + 1)
          pousse(donnees, 14, 'mot d\'exemple à +1 niveau', c,
            clean + ' (niveau ' + lv + ') dans « ' + ex.he_plain + ' » (mot de niveau ' + wordLevel + ')');
      });
    });
  });
}

// ---------- découpe en 28 tranches ----------
const MAX = 28, MIN = 17;
const parCat = new Map();
CARDS.forEach(c => (parCat.get(c.cat) || parCat.set(c.cat, []).get(c.cat)).push(c));
const tranches = [];
// Grandes catégories (> MAX cartes) : tranches pures, équilibrées.
for (const [cat, cs] of parCat){
  if (cs.length <= MAX) continue;
  const k = Math.ceil(cs.length / MAX), base = Math.floor(cs.length / k), rem = cs.length % k;
  let pos = 0;
  for (let i = 0; i < k; i++){
    const taille = base + (i < rem ? 1 : 0);
    tranches.push({ cats: [cat], cards: cs.slice(pos, pos + taille) });
    pos += taille;
  }
}
// Petites catégories (≤ MAX) : first-fit-decreasing dans des tranches mixtes.
{
  const petites = [...parCat].filter(([, cs]) => cs.length <= MAX)
    .sort((a, b) => b[1].length - a[1].length);
  const bacs = [];
  for (const [cat, cs] of petites){
    let bac = bacs.find(b => b.cards.length + cs.length <= MAX);
    if (!bac){ bac = { cats: [], cards: [] }; bacs.push(bac); }
    bac.cats.push(cat);
    bac.cards.push(...cs);
  }
  tranches.push(...bacs);
}
// Vérifications structurelles — la somme fait 713, sans recouvrement.
const somme = tranches.reduce((n, t) => n + t.cards.length, 0);
const indices = new Set();
tranches.forEach(t => t.cards.forEach(c => {
  if (indices.has(c.__i)) { console.error('✗ recouvrement : carte ' + c.__i); process.exit(1); }
  indices.add(c.__i);
}));
if (somme !== 713 || indices.size !== 713){
  console.error('✗ découpe : ' + somme + ' cartes dans les tranches, 713 attendues'); process.exit(1);
}
const horsBornes = tranches.filter(t => t.cards.length < MIN || t.cards.length > MAX);
if (horsBornes.length){
  console.error('✗ tranches hors bornes 17–28 : ' + horsBornes.map(t => t.cats.join('+') + '=' + t.cards.length).join(', '));
  process.exit(1);
}

// ---------- écriture ----------
fs.mkdirSync(OUT, { recursive: true });
// Purge des anciennes pièces (régénération propre).
fs.readdirSync(OUT).filter(f => /^(s\d\d\.json|_index\.json|mecanique\.json)$/.test(f))
  .forEach(f => fs.unlinkSync(path.join(OUT, f)));
// Un drapeau à cartes_liees (contrôle 10) est injecté dans la tranche de CHAQUE
// carte impliquée — l'auditeur d'une tranche ne voit pas les autres tranches.
const drapeauxParCarte = new Map();
drapeaux.forEach(d => {
  const cibles = d.cartes_liees || (d.card_index !== null ? [d.card_index] : []);
  cibles.forEach(i =>
    (drapeauxParCarte.get(i) || drapeauxParCarte.set(i, []).get(i)).push(d));
});
const index = [];
tranches.forEach((t, i) => {
  const nom = 's' + String(i + 1).padStart(2, '0');
  const flags = [];
  t.cards.forEach(c => (drapeauxParCarte.get(c.__i) || []).forEach(d =>
    flags.push({ card_index: d.card_index, controle: d.controle, check: d.nom, detail: d.detail })));
  fs.writeFileSync(path.join(OUT, nom + '.json'),
    JSON.stringify({ tranche: nom, cats: t.cats, count: t.cards.length, cards: t.cards, flags }, null, 1));
  index.push({ tranche: nom, cats: t.cats, count: t.cards.length, flags: flags.length,
    indices: t.cards.map(c => c.__i) });
});
fs.writeFileSync(path.join(OUT, '_index.json'), JSON.stringify({
  total: somme, tranches: index.length, bornes: [MIN, MAX],
  erreurs: erreurs.length, drapeaux: drapeaux.length, donnees: donnees.length, index
}, null, 1));
fs.writeFileSync(path.join(OUT, 'mecanique.json'),
  JSON.stringify({ erreurs, drapeaux, donnees }, null, 1));

// ---------- bilan ----------
const parControle = liste => {
  const n = {};
  liste.forEach(e => { n[e.controle] = (n[e.controle] || 0) + 1; });
  return Object.entries(n).map(([c, x]) => 'C' + c + ':' + x).join(' ') || '—';
};
console.log('713 cartes · ' + tranches.length + ' tranches (' +
  tranches.map(t => t.cards.length).join(',') + ')');
console.log('erreurs  : ' + erreurs.length + '  [' + parControle(erreurs) + ']');
console.log('drapeaux : ' + drapeaux.length + '  [' + parControle(drapeaux) + ']');
console.log('donnees  : ' + donnees.length + '  [' + parControle(donnees) + ']');
console.log('→ audit/mecanique.json, audit/s01–s' + String(tranches.length).padStart(2, '0') + '.json, audit/_index.json');
