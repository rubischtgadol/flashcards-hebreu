#!/usr/bin/env node
/*
 * verifie_exemples.js — outil de développement (non déployé), zéro dépendance.
 *
 * Filet de sécurité des « exemples en situation » du carnet : chaque lot ajouté
 * (sans relecture humaine) doit passer ces contrôles avant commit. Vérifie,
 * pour chaque exemple de chaque mot :
 *
 *   1. champs .he / .tr / .fr non vides ;
 *   2. longueur : 3 à 8 mots hébreux (ligne éditoriale, ARCHITECTURE.md §5 —
 *      3 mots suffisent aux phrases nominales, l'hébreu n'a pas de « être ») ;
 *   3. nikoud : chaque mot hébreu de la phrase est vocalisé ;
 *   4. translittération : .tr concorde avec he2tr(.he) — les deux fonctions
 *      sont EXTRAITES d'app.html (concordance par construction avec l'appli),
 *      comparées après pliage trKey, petite tolérance d'édition ;
 *   5. niveau : chaque mot de la phrase appartient au lexique du carnet
 *      (formes conjuguées/pluriels inclus, préfixes ו/ה/ב/ל/מ/ש/כ décollés)
 *      avec un niveau ≤ celui du mot illustré — token inconnu ou d'un niveau
 *      supérieur : avertissement (le naturel de la phrase peut primer,
 *      --strict pour rendre bloquant). « תל אביב » est reconnu comme nom propre.
 *
 * Le format du français (minuscule initiale, ponctuation interrogative seule)
 * suit le style du carnet — non contrôlé ici, c'est la relecture éditoriale.
 *
 * Usage :
 *   node verifie_exemples.js            # tout le carnet
 *   node verifie_exemples.js --strict   # les avertissements deviennent bloquants
 */
'use strict';
const fs = require('fs');
const vm = require('vm');
const { extractCards, NOTEBOOK, APP } = require('./build.js');

// ---------- fonctions de l'appli, extraites telles quelles d'app.html ----------
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

// ---------- lexique : tout l'hébreu du carnet, avec son niveau ----------
const LEVELS = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
function stripNikud(s){ return s.replace(/[֑-ׇ]/g, ''); }

const cards = extractCards(fs.readFileSync(NOTEBOOK, 'utf8'));
// he_plain (mot + formes) → meilleur (plus bas) niveau connu ; 0 = non classé (toujours permis).
const lexicon = new Map();
function feed(hePlain, niveau){
  if (!hePlain) return;
  hePlain.split(/\s+/).forEach(w => {
    if (!w) return;
    const lv = niveau ? LEVELS[niveau] || 0 : 0;
    const cur = lexicon.get(w);
    if (cur === undefined || lv < cur) lexicon.set(w, lv);
  });
}
cards.forEach(c => {
  feed(c.he_plain, c.niveau);
  (c.forms || []).forEach(f => feed(f.he_plain, c.niveau));
});

// Un token de phrase peut porter des préfixes agglutinés (ו, ה, ב, ל, מ, ש, כ,
// et leurs combinaisons courtes). On cherche le token entier, puis en pelant
// jusqu'à deux préfixes d'une lettre.
function lookup(token){
  const tries = [token];
  let t = token;
  for (let n = 0; n < 2; n++){
    if (/^[והבלמשכ]/.test(t) && t.length > 2){ t = t.slice(1); tries.push(t); }
  }
  for (const w of tries){
    if (lexicon.has(w)) return { word: w, level: lexicon.get(w) };
    // ה interrogatif/article déjà pelé ; essaie aussi le hé final possessif ? Non — trop laxiste.
  }
  return null;
}

// ---------- parcours ----------
const strict = process.argv.includes('--strict');
let nbEx = 0, nbWords = 0;
const errors = [], warnings = [];
const flag = (sev, card, ex, msg) => {
  (sev === 'err' ? errors : warnings).push('[' + card.cat + ' · ' + card.he_plain + '] « ' + ex.he_plain + ' » — ' + msg);
};

cards.forEach(card => {
  if (!card.exemples) return;
  nbWords++;
  const wordLevel = card.niveau ? LEVELS[card.niveau] || 0 : 0;
  card.exemples.forEach(ex => {
    nbEx++;
    // 1. champs
    if (!ex.he || !ex.fr || !ex.tr){ flag('err', card, ex, 'champ .he/.tr/.fr vide'); return; }
    const heWords = ex.he.trim().split(/\s+/);
    // 2. longueur (les mots à maqaf comptent pour leurs morceaux)
    const count = ex.he_plain.trim().split(/[\s־]+/).filter(Boolean).length;
    if (count < 3 || count > 8) flag('err', card, ex, count + ' mots (ligne éditoriale : 3–8)');
    // 3. nikoud sur chaque mot
    heWords.forEach(w => {
      const plain = stripNikud(w);
      if (plain.replace(/[^א-ת]/g, '').length > 1 && w === plain)
        flag('err', card, ex, 'mot sans nikoud : ' + plain);
    });
    // 4. translittération concordante avec l'appli
    const auto = trKey(he2tr(ex.he));
    const given = trKey(ex.tr);
    const d = editDist(auto, given);
    if (d > 3) flag('err', card, ex, '.tr « ' + ex.tr + ' » trop loin de he2tr « ' + he2tr(ex.he) + ' » (distance ' + d + ')');
    else if (d > 1) flag('warn', card, ex, '.tr « ' + ex.tr + ' » s\'écarte de he2tr « ' + he2tr(ex.he) + ' » (distance ' + d + ')');
    // 5. niveau du vocabulaire de la phrase (noms propres du quotidien admis)
    const sansPropres = ex.he_plain.replace(/תל אביב|ירושלים|ישראל/g, ' ');
    sansPropres.split(/[\s־]+/).forEach(tok => {
      const clean = tok.replace(/[^א-ת]/g, '');
      if (clean.length <= 1) return;                    // lettres seules (ו…) : toujours permises
      const hit = lookup(clean);
      if (!hit) flag('warn', card, ex, 'mot hors carnet : ' + clean);
      else if (wordLevel && hit.level > wordLevel)
        flag('warn', card, ex, 'mot ' + clean + ' d\'un niveau supérieur (' + hit.level + ' > ' + wordLevel + ')');
    });
  });
});

console.log(nbEx + ' exemple(s) sur ' + nbWords + ' mot(s) contrôlés.');
if (warnings.length){
  console.log('\nAvertissements (' + warnings.length + ') :');
  warnings.forEach(w => console.log('  ⚠ ' + w));
}
if (errors.length){
  console.error('\nErreurs (' + errors.length + ') :');
  errors.forEach(e => console.error('  ✗ ' + e));
}
if (errors.length || (strict && warnings.length)){
  console.error('\n✗ Contrôle des exemples en échec.');
  process.exit(1);
}
console.log('\n✓ Exemples conformes' + (warnings.length ? ' (avec avertissements)' : '') + '.');
