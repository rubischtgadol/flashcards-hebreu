'use strict';
const fs = require('fs'), path = require('path');
const { EXPECTED_LEVELS, EXPECTED_THEMES } = require('../build.js');

function chargeDonnees(racine){
  const d = (f) => JSON.parse(fs.readFileSync(path.join(racine, 'data', f), 'utf8'));
  const listes = {};
  for (const f of fs.readdirSync(path.join(racine, 'data', 'listes')).sort())
    listes[f.replace(/\.json$/, '')] = d(path.join('listes', f));
  return { noms: d('noms.json'), adjectifs: d('adjectifs.json'), verbes: d('verbes.json'), listes };
}

function valideDonnees(donnees){
  const echec = (ou, e, msg) => { throw new Error(`${ou} — « ${e.he || '?'} / ${e.fr || '?'} » : ${msg}`); };
  const commun = (ou, e, theme) => {
    if (!e.he || !e.fr) echec(ou, e, 'he/fr manquant');
    if (!EXPECTED_LEVELS.includes(e.niveau)) echec(ou, e, `niveau « ${e.niveau} » invalide`);
    if (theme && !EXPECTED_THEMES.includes(e.theme)) echec(ou, e, `theme « ${e.theme} » invalide`);
    if (theme && !(e.exemples || []).length) echec(ou, e, 'aucun exemple');
    (e.exemples || []).forEach(x => { if (!x.he || !x.tr || !x.fr) echec(ou, e, 'exemple incomplet'); });
  };
  donnees.noms.forEach(e => { commun('noms', e, true);
    if (!['m','f'].includes(e.genre)) echec('noms', e, `genre « ${e.genre} »`); });
  donnees.adjectifs.forEach(e => { commun('adjectifs', e, true);
    if ((e.formes || []).length !== 3) echec('adjectifs', e, 'formes ≠ 3'); });
  donnees.verbes.forEach(e => { commun('verbes', e, true);
    if ((e.formes || []).length !== 4) echec('verbes', e, 'formes ≠ 4'); });
  for (const [slug, l] of Object.entries(donnees.listes)){
    if (!l.entries.length) throw new Error(`listes/${slug} : section vide`);
    l.entries.forEach(e => commun(`listes/${slug}`, e, false));
  }
  return true;
}
module.exports = { chargeDonnees, valideDonnees };
