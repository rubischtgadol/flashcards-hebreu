#!/usr/bin/env node
/*
 * cherche_mots.js — outil de développement (non déployé), zéro dépendance.
 * Consultation du carnet par commande : répond « ce mot existe-t-il déjà ? »
 * et « où ? » pour ~200 tokens, au lieu d'une lecture du carnet (~9600 lignes)
 * ou d'un inventaire par sous-agent (56k tokens mesurés le 23/07/2026).
 *
 * Usage :
 *   node cherche_mots.js TERME [TERME…]   # hébreu → he_plain exact (headwords + formes),
 *                                         #          puis « orthographe voisine » (ktiv male/haser)
 *                                         # latin  → sous-chaîne dans .fr / note / exemples
 *   node cherche_mots.js --stats          # répartition du corpus (sections, niveaux, thèmes)
 *
 * Consultation pure : n'écrit jamais rien. Réutilise l'extraction de build.js
 * (jamais de troisième parseur — doctrine SPEC_AJOUTE_MOTS §1).
 */
'use strict';

const fs = require('fs');
const { extractCards, NOTEBOOK, stripNikud, orthographeVoisine,
        EXPECTED_LEVELS, EXPECTED_THEMES } = require('./build.js');

const MAX_HITS = 8; // par terme — au-delà on compte, on ne liste pas (sortie bornée)

// Minuscules + accents retirés : « épais » trouve « Épais » et vice-versa.
function normFr(s){
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Ligne (approximative) où vit un hébreu — première occurrence dans le source.
function ligneDe(html, he){
  const i = html.indexOf(he);
  return i < 0 ? '?' : html.slice(0, i).split('\n').length;
}

function chercheTerme(cards, html, terme){
  const hits = [];
  const voisins = [];   // ktiv male/haser — rubrique distincte, jamais mêlée aux exactes
  const enHebreu = /[֐-׿]/.test(terme);

  if (enHebreu){
    const plain = stripNikud(terme);
    for (const c of cards){
      if (c.he_plain === plain)
        hits.push({ c, quoi: c.he + ' — ' + c.fr });
      else if (c.forms && c.forms.some(f => f.he_plain === plain))
        hits.push({ c, quoi: 'forme de ' + c.he + ' — ' + c.fr });
      else if (c.exemples && c.exemples.some(e => e.he_plain && e.he_plain.split(/[^א-ת]+/).includes(plain)))
        // mot exact, pas sous-chaîne : « חי » ne doit pas matcher « מחיר »
        hits.push({ c, quoi: 'dans un exemple de ' + c.he + ' — ' + c.fr });
      else if (orthographeVoisine(c.he_plain, plain))
        voisins.push({ c, quoi: c.he + ' — ' + c.fr });
      else if (c.forms && c.forms.some(f => orthographeVoisine(f.he_plain, plain)))
        voisins.push({ c, quoi: 'forme de ' + c.he + ' — ' + c.fr });
    }
  } else {
    // Frontière de mot en tête : « fin » trouve « fin », « fine », « finir »,
    // mais pas « (infinitif) » ni « enfin » (173 faux positifs sinon, mesuré).
    const q = new RegExp('\\b' + normFr(terme).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    for (const c of cards){
      if (q.test(normFr(c.fr)))
        hits.push({ c, quoi: c.he + ' — ' + c.fr });
      else if (c.note && q.test(normFr(c.note)))
        hits.push({ c, quoi: 'note de ' + c.he + ' — ' + c.fr + ' (« ' + c.note + ' »)' });
      else {
        const ex = (c.exemples || []).find(e => q.test(normFr(e.fr)));
        if (ex) hits.push({ c, quoi: 'exemple de ' + c.he + ' (' + c.fr + ') : « ' + ex.fr + ' »' });
      }
    }
  }

  const liste = (arr, indent) => {
    for (const h of arr.slice(0, MAX_HITS))
      console.log(indent + h.c.cat + ' L' + ligneDe(html, h.c.he) + ' · ' + h.quoi);
    if (arr.length > MAX_HITS)
      console.log(indent + '… +' + (arr.length - MAX_HITS) + ' autres (affiner le terme)');
  };

  if (!hits.length && !voisins.length){ console.log(terme + ' : ABSENT'); return; }

  if (hits.length){
    console.log(terme + ' : ' + hits.length + ' occurrence' + (hits.length > 1 ? 's' : ''));
    liste(hits, '  ');
  } else {
    console.log(terme + ' : aucune correspondance exacte');
  }

  if (voisins.length){
    // Le carnet est vocalisé, donc écrit en ktiv haser : un terme cherché en
    // ktiv male tombe ici et non dans ABSENT (SPEC_ECONOMIE_TOKENS §10.1).
    console.log('  orthographe voisine (insertion de ו/י) : ' + voisins.length);
    liste(voisins, '    ');
  }
}

function stats(cards){
  const compte = (arr, cle) => {
    const m = new Map();
    for (const x of arr){ const k = cle(x); m.set(k, (m.get(k) || 0) + 1); }
    return m;
  };
  const pad = (s, n) => String(s).padEnd(n);

  console.log('Corpus : ' + cards.length + ' cartes\n');

  console.log('Par section :');
  for (const [cat, n] of compte(cards, c => c.cat)) console.log('  ' + pad(cat, 22) + n);

  console.log('\nPar niveau :');
  const parNiveau = compte(cards, c => c.niveau || '(sans)');
  for (const lvl of EXPECTED_LEVELS) if (parNiveau.has(lvl)) console.log('  ' + pad(lvl, 22) + parNiveau.get(lvl));
  if (parNiveau.has('(sans)')) console.log('  ' + pad('(sans)', 22) + parNiveau.get('(sans)'));

  console.log('\nPar thème (cartes des 3 tables), avec répartition par niveau :');
  const tables = cards.filter(c => c.theme);
  const parTheme = compte(tables, c => c.theme);
  const lignes = EXPECTED_THEMES.map(t => [t, parTheme.get(t) || 0]).sort((a, b) => a[1] - b[1]);
  for (const [t, n] of lignes){
    const niveaux = EXPECTED_LEVELS
      .map(lvl => [lvl, tables.filter(c => c.theme === t && c.niveau === lvl).length])
      .filter(([, k]) => k > 0).map(([lvl, k]) => lvl + ':' + k).join(' ');
    console.log('  ' + pad(t, 22) + pad(n, 5) + (n ? niveaux : '⚠ vide'));
  }

  const unSeul = tables.filter(c => (c.exemples || []).length === 1).length;
  const sansEx = cards.filter(c => !c.theme && !(c.exemples || []).length).length;
  console.log('\nSignaux éditoriaux :');
  console.log('  ' + pad('tables à 1 seul exemple', 28) + unSeul);
  console.log('  ' + pad('listes sans exemple (licite)', 28) + sansEx);
}

function main(){
  const args = process.argv.slice(2).filter(a => a !== '--stats');
  const modeStats = process.argv.includes('--stats');
  if (!args.length && !modeStats){
    console.error('Usage : node cherche_mots.js TERME [TERME…] | --stats');
    process.exit(1);
  }
  const html = fs.readFileSync(NOTEBOOK, 'utf8');
  const cards = extractCards(html);
  if (modeStats) stats(cards);
  for (const t of args) chercheTerme(cards, html, t);
}

main();
