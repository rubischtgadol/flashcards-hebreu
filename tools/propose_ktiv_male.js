#!/usr/bin/env node
/**
 * propose_ktiv_male.js — propose la graphie PLEINE d'un mot vocalisé, et mesure
 * combien de formes du carnet s'en écarteraient. Lecture seule : n'écrit jamais
 * dans data/.
 *
 * POURQUOI. Le carnet stocke le vocalisé en ktiv haser (מְסֻבָּךְ). Les deux
 * surfaces affichent des lignes SANS nikoud — la ligne cursive du carnet
 * (5573 occurrences) et celle de l'app, plus ses deux modes d'écriture — et
 * elles se contentent de RETIRER les points : מסבך. Or ce n'est ni du ktiv
 * haser (qui a besoin de ses points) ni du ktiv male (qui écrit מסובך). C'est
 * une graphie qu'aucun texte réel n'emploie, montrée à quelqu'un qui apprend.
 *
 * CE QUE CET OUTIL EST, ET N'EST PAS. Il PROPOSE, il ne décide pas. Il n'existe
 * dans data/ aucune graphie pleine écrite à la main : il n'y a donc rien contre
 * quoi mesurer une règle, à la différence de `he2tr` que 4229 `tr` rédigés
 * gardent (cf. mesure_translitteration.js). Sa sortie est une liste à relire,
 * triée par confiance ; le régime visé est celui des `.tr` — la machine
 * propose, la main écrit, la main fait autorité.
 *
 * ⚠️ LA LIMITE EST DÉMONTRÉE, PAS SUPPOSÉE. Le redoublement du ו/י consonantique
 * n'est PAS dérivable du nikoud :
 *      לַיְלָה  (patach, yod, chva) → לילה   — un seul yod
 *      בַּיְשָׁן (patach, yod, chva) → ביישן  — deux yods
 * Motif rigoureusement identique, réponses opposées (לילה est une exception
 * lexicale). Aucune règle sur les points ne peut les séparer : ces cas-là
 * demandent un arbitrage humain ou les règles de l'Académie. C'est pourquoi la
 * sortie sépare « mécanique » de « redoublement ».
 *
 * Usage :
 *   node tools/propose_ktiv_male.js              # les comptes, par famille et par règle
 *   node tools/propose_ktiv_male.js --liste      # + la liste complète des propositions
 *   node tools/propose_ktiv_male.js --vedettes   # les vedettes seules (le lot le plus court)
 *   node tools/propose_ktiv_male.js --temoins    # rejoue les témoins connus (auto-contrôle)
 */
const fs = require('fs');
const path = require('path');
const { ROOT, fichiersDonnees, stripNikud } = require('./build.js');

const KUBUTZ = 'ֻ', HOLAM = 'ֹ', HIRIK = 'ִ', SHVA = 'ְ';
// Voyelles « pleines ». Leur présence sur un ו/י prouve qu'il porte une voyelle
// propre — le dagesh seul ne compte pas : ו+dagesh est un shuruk, une voyelle.
const VOYELLES = ['ַ','ָ','ֵ','ֶ','ִ','ֹ','ֻ','ְ','ֲ','ֱ','ֳ'];
const estConsonne = c => c >= 'א' && c <= 'ת';
const estMarque   = c => c >= '֑' && c <= 'ׇ';
const porteVoyelle = m => VOYELLES.some(v => m.includes(v));
// Mère de lecture : ו portant un holam (holam male) ou rien qu'un dagesh
// (shuruk), et י sans voyelle propre. ⚠️ Compter le holam comme une voyelle
// pleine ici fait passer le ו de אוֹיֵב pour une consonne, et le yod suivant
// est alors redoublé à tort (אוייב au lieu de אויב) — défaut mesuré.
const estMater = x => !!x && ((x.c === 'ו' && (!porteVoyelle(x.m) || x.m.includes(HOLAM)))
                           || (x.c === 'י' && !porteVoyelle(x.m)));

function grappes(mot){
  const g = [];
  for (const ch of mot){
    if (estConsonne(ch)) g.push({ c: ch, m: '' });
    else if (estMarque(ch) && g.length) g[g.length - 1].m += ch;
    else g.push({ c: ch, m: '' });
  }
  return g;
}

/** Retourne { sortie, regles:Set, motif } — `motif` groupe les cas de redoublement. */
function ktivMale(mot){
  const g = grappes(mot);
  const regles = new Set();
  let out = '', motif = '';
  for (let i = 0; i < g.length; i++){
    const { c, m } = g[i];
    const suiv = g[i + 1], prec = g[i - 1];
    out += c + m;
    if (!estConsonne(c)) continue;

    if (m.includes(KUBUTZ)){ out += 'ו'; regles.add('kubutz'); continue; }

    // holam → ו, sauf holam male (porté par le ו lui-même) et sauf devant א :
    // רֹאשׁ reste ראש, la règle naïve produirait ראוש.
    if (m.includes(HOLAM) && c !== 'ו'){
      if (suiv && suiv.c === 'א'){ regles.add('holam-devant-alef'); continue; }
      out += 'ו'; regles.add('holam'); continue;
    }

    // hirik → י, sauf hirik male (le yod est déjà écrit : אִישׁ reste איש) et
    // sauf syllabe fermée (la consonne suivante porte un chva).
    if (m.includes(HIRIK)){
      if (suiv && suiv.c === 'י'){ regles.add('hirik-deja-plein'); continue; }
      if (suiv && estConsonne(suiv.c) && !suiv.m.includes(SHVA)){ out += 'י'; regles.add('hirik'); }
      else regles.add('hirik-ferme');
      continue;
    }

    // ו / י CONSONANTIQUE en milieu de mot → redoublé (מִצְוָה → מצווה).
    // ⚠️ EN DERNIER, et c'est un défaut payé : placé en tête, son `continue`
    // court-circuitait les trois règles ci-dessus quand la lettre portait
    // elle-même la voyelle — מְיֻחָד sortait מייחד au lieu de מיוחד.
    if ((c === 'ו' || c === 'י') && i > 0 && suiv && porteVoyelle(m)){
      // La lettre elle-même doit être une CONSONNE : un ו portant un holam est
      // un holam male, donc une mère de lecture — le redoubler donnait אוויב.
      if (estMater(g[i])){ regles.add('redoublement-lettre-mater'); continue; }
      if (estMater(prec) || estMater(suiv)){ regles.add('redoublement-bloque-mater'); continue; }
      out += c; regles.add('redoublement');
      motif = motif || (c + (m.includes(HIRIK) ? '+hirik' : m.includes('ָ') ? '+kamatz'
        : m.includes('ַ') ? '+patach' : '+autre') + (g[i + 2] ? ' median' : ' final'));
    }
  }
  return { sortie: out, regles, motif };
}

// ---- les témoins : la règle doit les rendre exactement ----
const TEMOINS = [
  ['רֹאשׁ', 'ראש'],                       // רֹאשׁ → ראש (rien à ajouter)
  ['אִישׁ', 'איש'],                       // אִישׁ → איש (hirik déjà plein)
  ['מְסֻבָּךְ', 'מסובך'],  // מְסֻבָּךְ → מסובך
  ['אֹזֶן', 'אוזן'],                 // אֹזֶן → אוזן
  ['מִצְוָה', 'מצווה'], // מִצְוָה → מצווה
  ['אוֹיֵב', 'אויב'],           // אוֹיֵב → אויב (pas de redoublement après une mater)
];

function temoins(){
  let ko = 0;
  for (const [vocalise, attendu] of TEMOINS){
    const obtenu = stripNikud(ktivMale(vocalise).sortie);
    const ok = obtenu === attendu;
    if (!ok) ko++;
    console.log((ok ? '  ok  ' : '  KO  ') + vocalise.padEnd(14) + ' → ' + obtenu.padEnd(12) + (ok ? '' : '(attendu ' + attendu + ')'));
  }
  console.log(ko ? '\n✗ ' + ko + ' témoin(s) en échec.' : '\n✓ ' + TEMOINS.length + ' témoins conformes.');
  return ko;
}

function main(){
  const args = process.argv.slice(2);
  if (args.includes('--temoins')) process.exit(temoins() ? 1 : 0);

  const compteurs = { vedettes: 0, formes: 0, exemples: 0 };
  const change = { vedettes: [], formes: [], exemples: [] };
  const parRegle = {}, parMotif = {};

  const examine = (he, bucket, contexte) => {
    if (!he || !/[א-ת]/.test(he)) return;
    compteurs[bucket]++;
    const nu = stripNikud(he);
    const { sortie, regles, motif } = ktivMale(he);
    const propose = stripNikud(sortie);
    if (propose === nu) return;
    const actives = [...regles].filter(r => ['kubutz','holam','hirik','redoublement'].includes(r));
    change[bucket].push({ he, nu, propose, regles: actives, motif, contexte });
    for (const r of actives) parRegle[r] = (parRegle[r] || 0) + 1;
    if (motif) parMotif[motif] = (parMotif[motif] || 0) + 1;
  };

  for (const rel of fichiersDonnees(ROOT)){
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
    for (const e of (Array.isArray(j) ? j : j.entries || [])){
      examine(e.he, 'vedettes', e.fr);
      if (e.pluriel) examine(e.pluriel, 'formes', e.fr + ' (pluriel)');
      for (const f of (e.formes || [])) examine(typeof f === 'string' ? f : f.he, 'formes', e.fr);
      for (const ex of (e.exemples || [])) examine(ex.he, 'exemples', 'exemple de ' + e.fr);
    }
  }

  const tout = [...change.vedettes, ...change.formes, ...change.exemples];
  const doubl = tout.filter(c => c.regles.includes('redoublement'));

  console.log('Formes hébraïques examinées : '
    + Object.entries(compteurs).map(([k, v]) => k + ' ' + v).join(' · ')
    + ' — total ' + Object.values(compteurs).reduce((a, b) => a + b, 0));
  console.log('\nÀ REVOIR (la graphie affichée diffère de la proposition) :');
  for (const k of Object.keys(change))
    console.log('  ' + k.padEnd(9) + String(change[k].length).padStart(5) + ' / ' + String(compteurs[k]).padStart(5)
      + '  (' + (100 * change[k].length / compteurs[k]).toFixed(1) + ' %)');
  console.log('  ' + 'TOTAL'.padEnd(9) + String(tout.length).padStart(5));

  console.log('\nPAR CONFIANCE :');
  console.log('  mécanique (kubutz/holam/hirik) : ' + (tout.length - doubl.length)
    + '  — confirmation en bloc, la règle y est fiable');
  console.log('  redoublement ו/י               : ' + doubl.length
    + '  — arbitrage mot à mot, cf. לילה vs ביישן en tête de fichier');
  console.log('  dont VEDETTES seules           : ' + change.vedettes.length + ' ('
    + change.vedettes.filter(c => !c.regles.includes('redoublement')).length + ' mécaniques, '
    + change.vedettes.filter(c => c.regles.includes('redoublement')).length + ' à arbitrer)');

  console.log('\nPAR RÈGLE : ' + Object.entries(parRegle).sort((a, b) => b[1] - a[1])
    .map(([r, n]) => r + ' ' + n).join(' · '));
  console.log('MOTIFS DE REDOUBLEMENT (pour grouper la relecture) :');
  for (const [m, n] of Object.entries(parMotif).sort((a, b) => b[1] - a[1]))
    console.log('  ' + m.padEnd(16) + String(n).padStart(4));

  if (args.includes('--liste') || args.includes('--vedettes')){
    const lot = args.includes('--vedettes') ? change.vedettes : tout;
    console.log('\n' + lot.length + ' PROPOSITIONS (affiché → proposé) :');
    for (const c of lot)
      console.log('  ' + c.nu.padEnd(14) + ' → ' + c.propose.padEnd(16)
        + '[' + c.regles.join('+') + (c.motif ? ' ' + c.motif : '') + '] ' + String(c.contexte).slice(0, 30));
  } else {
    console.log('\n(--liste pour tout voir, --vedettes pour le lot court, --temoins pour l\'auto-contrôle)');
  }
}

if (require.main === module) main();
module.exports = { ktivMale, TEMOINS };
