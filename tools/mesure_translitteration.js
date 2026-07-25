#!/usr/bin/env node
/*
 * mesure_translitteration.js — outil de développement (non déployé), zéro dépendance.
 *
 * Mesure l'accord entre `he2tr` (la translittération générée depuis le nikud) et
 * les `.tr` écrits à la main dans data/, qui FONT FOI. Il existe pour une raison
 * précise : la règle du shva initial est morphologique, donc `he2tr` ne peut que
 * l'approcher (ARCHITECTURE.md § Ce que he2tr sait faire du shva initial). Toute
 * retouche de cette approximation doit être arbitrée sur des chiffres, jamais à
 * l'oreille sur trois exemples — c'est exactement ainsi que la correction du
 * 25/07 a été arbitrée, variante par variante.
 *
 * Trois nombres, et la règle qui va avec : un changement ne se garde que s'il
 * améliore LES TROIS.
 *   - accord exact        : he2tr(he) === le tr écrit à la main ;
 *   - accord après trKey  : les deux se replient sur la même clé de saisie —
 *                           c'est CE nombre qui dit ce que l'utilisateur vit,
 *                           puisque c'est trKey qui juge une réponse tapée ;
 *   - distance totale     : somme des distances d'édition, sensible aux écarts
 *                           que les deux taux ci-dessus arrondissent à « faux ».
 *
 * Usage :
 *   node tools/mesure_translitteration.js            # les trois nombres
 *   node tools/mesure_translitteration.js --top      # + les 15 pires écarts
 *   node tools/mesure_translitteration.js --shva     # + la tabulation du shva
 *                                                    #   initial par consonne
 *
 * ⚠️ Se lance DEPUIS LA RACINE du dépôt, comme les autres outils.
 */
'use strict';
const { chargeDonnees, deriveCartes, fonctionsApp, ROOT } = require('./build.js');

const { he2tr, trKey, editDist } = fonctionsApp(['he2tr', 'trKey', 'editDist']);
const cards = deriveCartes(chargeDonnees(ROOT));

// Paires (hébreu, tr faisant foi) : uniquement là où un humain a écrit le tr.
// Les cartes de table en sont dépourvues (tr:'') — elles ne prouvent rien ici.
const paires = [];
for (const c of cards) {
  if (c.he && c.tr) paires.push([c.he, c.tr, c.cat]);
  for (const e of c.exemples || []) if (e.he && e.tr) paires.push([e.he, e.tr, 'exemple']);
  for (const f of c.forms || []) if (f.he && f.tr) paires.push([f.he, f.tr, 'forme']);
}
if (!paires.length) {
  console.error('✗ Aucune paire (hébreu, tr) trouvée dans data/ — mesure impossible.');
  process.exit(1);
}

let exact = 0, plie = 0, somme = 0;
const ecarts = [];
for (const [he, tr, cat] of paires) {
  const auto = he2tr(he);
  if (auto === tr) exact++;
  if (trKey(auto) === trKey(tr)) plie++;
  const d = editDist(auto, tr);
  somme += d;
  if (d > 0) ecarts.push({ he, tr, auto, d, cat });
}
ecarts.sort((a, b) => b.d - a.d);

const pc = (n) => (100 * n / paires.length).toFixed(2) + ' %';
console.log('Paires (hébreu + tr écrit à la main) : ' + paires.length);
console.log('  accord exact         : ' + exact + '  (' + pc(exact) + ')');
console.log('  accord après trKey   : ' + plie + '  (' + pc(plie) + ')   ← ce que la saisie accepte');
console.log('  distance d\'édition   : ' + somme + '  (moyenne ' + (somme / paires.length).toFixed(4) + ')');

if (process.argv.includes('--top')) {
  console.log('\nLes 15 plus gros écarts (le tr à la main fait foi) :');
  for (const e of ecarts.slice(0, 15))
    console.log('  d=' + e.d + '  ' + e.he + '   main « ' + e.tr + ' »   auto « ' + e.auto + ' »');
}

if (process.argv.includes('--shva')) {
  // Tabulation du shva initial : pour chaque consonne d'attaque, l'humain
  // garde-t-il ou supprime-t-il le « e » que he2tr écrirait par défaut ?
  const mots = new Map();
  const aligne = (he, tr) => {
    const H = he.trim().split(/\s+/), T = tr.trim().split(/\s+/);
    if (H.length !== T.length) return;              // alignement mot à mot seulement
    for (let i = 0; i < H.length; i++) {
      const t = T[i].replace(/[.,!?;:]/g, '');
      if (/^[֐-׿]+$/.test(H[i]) && t) mots.set(H[i], t);
    }
  };
  for (const [he, tr] of paires) aligne(he, tr);

  // ⚠️ Le verdict se lit sur le tr HUMAIN seul, jamais par comparaison à he2tr :
  // sans quoi la tabulation mesurerait la règle en vigueur au lieu de l'usage
  // qui doit l'arbitrer, et confirmerait toujours ce qui est déjà codé.
  // « e initial » = une voyelle e entre l'attaque consonantique et la consonne
  // suivante (shekufah, gedolim) — le motif même que replie trKey.
  const AVEC_E = /^[^aeiou]{1,2}e[^aeiou]/;
  const stats = {};
  for (const [he, tr] of mots) {
    const m = he.match(/^(.)([֑-ׇ]*)/);
    if (!m || ![...m[2]].some(c => c.charCodeAt(0) === 0x05B0)) continue;
    const propre = tr.toLowerCase().replace(/[^a-z']/g, '');
    if (propre.length < 3) continue;
    const s = stats[he[0]] || (stats[he[0]] = { garde: 0, supprime: 0 });
    if (AVEC_E.test(propre)) s.garde++; else s.supprime++;
  }
  const lignes = Object.entries(stats)
    .map(([c, s]) => ({ c, ...s, total: s.garde + s.supprime }))
    .sort((a, b) => b.total - a.total);
  console.log('\nShva initial — ce que le tr écrit à la main fait, par consonne d\'attaque.');
  console.log('(mesuré sur le tr humain seul ; he2tr n\'entre pas dans ce verdict)');
  console.log('  consonne | garde le e | le supprime | majorité');
  for (const l of lignes)
    console.log('     ' + l.c + '     |    ' + String(l.garde).padStart(4)
      + '    |    ' + String(l.supprime).padStart(4) + '     |  '
      + (l.garde >= l.supprime ? 'garde' : 'SUPPRIME')
      + ' (' + Math.round(100 * Math.max(l.garde, l.supprime) / l.total) + ' %)');
  const g = lignes.reduce((a, l) => a + l.garde, 0), s = lignes.reduce((a, l) => a + l.supprime, 0);
  console.log('  TOTAL garde=' + g + '  supprime=' + s
    + '  → le défaut « garder » est ' + (g > s ? 'confirmé' : 'À REVOIR'));
  console.log('  he2tr ne supprime que pour ש ס כ צ, et jamais devant une gutturale.');
  console.log('  ⚠️ Ce tableau est un INDICE, pas le verdict : il compte des mots isolés,');
  console.log('  alors que la décision se prend sur les trois nombres du haut, qui couvrent');
  console.log('  aussi les phrases. Les deux ne concordent pas toujours — צ y penche à peine');
  console.log('  vers « garde », mais l\'inclure améliorait les trois ; ג y penche vers');
  console.log('  « supprime », et l\'inclure coûtait 9 mots. Mesurer, jamais déduire du tableau.');
}
