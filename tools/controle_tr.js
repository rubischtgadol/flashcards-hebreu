#!/usr/bin/env node
// controle_tr.js — contrôle d'une translittération avant insertion : he2tr(he) vs tr
// rédigé, pour la tête de chaque entrée ET pour chaque élément de exemples[] /
// formes[] / pluriel (mêmes champs he/tr). Une seule responsabilité, élargie à un
// seul endroit : dire où une translittération rédigée s'écarte de la
// translittération dérivée, PARTOUT où he/tr coexistent dans une entrée. Aucune
// écriture, aucune validation de schéma, aucune correction automatique.
//
// Extension du 2026-07-28 : l'outil ne regardait que la tête de chaque entrée. Une
// revue a trouvé 5 incohérences tr/he réelles dans des exemples que ce contrôle ne
// pouvait pas voir (ni aucun autre outil du pipeline) : hé final manquant
// (harishona/hashniya vs rishonah/shniyah portés par la tête), sujet « hi » absent
// du tr alors qu'il est dans le he, deux graphies du même mot dans la même entrée
// (kanireh en tête, kanir'e dans l'exemple), et un alef mater lectionis rendu comme
// une consonne ('aleihah au lieu de 'aleiha). verifie_exemples.js ne les attrape
// pas : il tolère jusqu'à 3 d'edit-distance entre .tr et he2tr(he), ce que ces
// fautes ne dépassent pas toujours.
//
// Piège connu : un he d'exemple qui finit par un signe de ponctuation (?!.,;:)
// casse la détection de fin de mot de he2tr (le patach furtif final n'est plus
// reconnu, ex. lokeach rendu autrement) — la ponctuation finale est donc retirée
// des DEUX côtés (he et tr) avant comparaison, sinon l'outil crie à tort sur des
// exemples corrects.
//
// Usage : node tools/controle_tr.js <fichier.json>
// Fichier accepté : [{he, tr, exemples?, formes?, pluriel?, …}] ou {entries:[…]}
//   ou {mots:[…]} — seuls he (vocalisé) et tr sont lus, à la tête et dans chaque
//   exemples[]/formes[]/pluriel.
// ✔ replié  = trKey confond les deux graphies : divergence d'affichage seulement.
// ✘ BRUT    = désaccord réel → arbitrage humain (le tr rédigé est souverain : un
//             BRUT n'est pas forcément une faute — cf. chva morphologique).
// Code retour 1 s'il reste au moins un ✘ BRUT (tête, exemple ou forme).
const fs = require('fs'), path = require('path');
const { fonctionsApp } = require(path.join(__dirname, 'build.js'));
const { he2tr, trKey } = fonctionsApp(['he2tr', 'trKey']);

// Ponctuation finale retirée des deux côtés — cf. piège ci-dessus.
function sansPonctuationFinale(s){ return (s || '').replace(/[?!.,;:]+\s*$/, ''); }

let bruts = 0, tetes = 0, exemplesN = 0, formesN = 0;

function controle(tag, he, tr, porteur){
  if (!he || !tr) return; // pas de validation de schéma : un champ manquant n'est pas signalé ici
  const heNet = sansPonctuationFinale(he), trNet = sansPonctuationFinale(tr);
  const auto = he2tr(heNet);
  if (auto === trNet) return; // accord exact : rien à dire
  const replie = trKey(auto) === trKey(trNet);
  if (!replie) bruts++;
  const label = porteur ? `  [porteur: ${porteur}]` : '';
  console.log(`${replie ? '✔ replié' : '✘ BRUT  '}  ${tag}${label}  ${he}  rédigé=${tr}  he2tr=${auto}`);
}

const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const entries = Array.isArray(j) ? j : (j.entries || j.mots);
for (const e of entries) {
  tetes++;
  controle('TÊTE   ', e.he, e.tr, null);
  const porteur = `${e.he} / ${e.fr || ''}`;
  for (const ex of (e.exemples || [])) {
    exemplesN++;
    controle('EXEMPLE', ex.he, ex.tr, porteur);
  }
  for (const f of (e.formes || [])) {
    formesN++;
    controle('FORME  ', f.he, f.tr, porteur);
  }
  if (e.pluriel) {
    formesN++;
    controle('FORME  ', e.pluriel.he, e.pluriel.tr, porteur);
  }
}
console.log(`${tetes} tête(s), ${exemplesN} exemple(s), ${formesN} forme(s) contrôlé(s), ${bruts} désaccord(s) brut(s)`);
process.exit(bruts ? 1 : 0);
