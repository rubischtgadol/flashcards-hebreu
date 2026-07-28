#!/usr/bin/env node
// controle_tr.js — contrôle d'un bordereau avant insertion : he2tr(he) vs tr rédigé.
// Une seule responsabilité : dire où la translittération rédigée s'écarte de la
// translittération dérivée. Aucune écriture, aucune validation de schéma.
// Usage : node tools/controle_tr.js <bordereau.json>
// Bordereau accepté : [{he, tr, …}] ou {entries:[…]} ou {mots:[…]} — seuls he
// (vocalisé) et tr sont lus.
// ✔ replié  = trKey confond les deux graphies : divergence d'affichage seulement.
// ✘ BRUT    = désaccord réel → arbitrage humain (le tr rédigé est souverain : un
//             BRUT n'est pas forcément une faute — cf. chva morphologique).
// Code retour 1 s'il reste au moins un ✘ BRUT.
const fs = require('fs'), path = require('path');
const { fonctionsApp } = require(path.join(__dirname, 'build.js'));
const { he2tr, trKey } = fonctionsApp(['he2tr', 'trKey']);
const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const entries = Array.isArray(j) ? j : (j.entries || j.mots);
let bruts = 0;
for (const e of entries) {
  const auto = he2tr(e.he);
  if (auto === e.tr) continue;
  const replie = trKey(auto) === trKey(e.tr);
  if (!replie) bruts++;
  console.log(`${replie ? '✔ replié' : '✘ BRUT  '}  ${e.he}  rédigé=${e.tr}  he2tr=${auto}`);
}
console.log(`${entries.length} entrées, ${bruts} désaccord(s) brut(s)`);
process.exit(bruts ? 1 : 0);
