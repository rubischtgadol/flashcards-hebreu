#!/usr/bin/env node
/*
 * build.js — outil de développement (non déployé).
 *
 * Régénère ENTIÈREMENT flashcards_hebreu.html (version autonome, hors ligne) :
 *   - le vocabulaire est extrait de vocabulaire_hebreu.html en répliquant
 *     exactement extractCards() d'app.html ;
 *   - le reste du fichier (HTML, CSS, JS) est copié depuis app.html, dont le
 *     bloc marqué BUILD:ONLINE-ONLY (fetch + extraction runtime) est remplacé
 *     par le snapshot `const CARDS = [...]` et un démarrage direct.
 * Affiche le compte de cartes par section et échoue bruyamment si une section
 * attendue tombe à zéro.
 *
 * Usage :
 *   node build.js           # régénère flashcards_hebreu.html
 *   node build.js --check   # vérifie sans écrire (fichier autonome en phase ?)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const NOTEBOOK = path.join(ROOT, 'vocabulaire_hebreu.html');
const APP = path.join(ROOT, 'app.html');
const STANDALONE = path.join(ROOT, 'flashcards_hebreu.html');

// Sections dont la disparition doit faire échouer le build (clé = catégorie des cartes).
const EXPECTED_CATS = ['Verbes','Verbes modaux','Adjectifs','Noms','Pronoms personnels','Démonstratifs',
  'Prépositions','Conjonctions','Mots interrogatifs','Nombres','Jours de la semaine','Adverbes','Saisons & mois',
  'Mots de quantité','Expressions','Existence','Phrases'];
// Niveaux CECRL (data-niveau du carnet) dont la disparition doit faire échouer le
// build — le carnet actuel n'a rien au-delà de B2 ; étendre quand il grandira.
const EXPECTED_LEVELS = ['A1','A2','B1','B2'];

// ---------- mini-parsing HTML (zéro dépendance) ----------
const NAMED_ENTITIES = { amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", nbsp:' ',
  hellip:'…', rsquo:'’', lsquo:'‘', laquo:'«', raquo:'»', middot:'·',
  rarr:'→', larr:'←', ndash:'–', mdash:'—', times:'×', deg:'°', eacute:'é', egrave:'è', agrave:'à', ccedil:'ç' };
function decodeEntities(s){
  return s.replace(/&(#[xX]?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, g) => {
    if (g[0] === '#'){
      const code = (g[1] === 'x' || g[1] === 'X') ? parseInt(g.slice(2), 16) : parseInt(g.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED_ENTITIES[g] !== undefined ? NAMED_ENTITIES[g] : m;
  });
}
function textContent(html){ return decodeEntities(html.replace(/<[^>]*>/g, '')); }

// Premier <span class="cls">…</span> d'un fragment → texte (équivalent firstText(el,'.cls')).
function firstSpanText(fragment, cls){
  const open = new RegExp('<span\\b[^>]*\\bclass="' + cls + '"[^>]*>');
  const m = open.exec(fragment);
  if (!m) return '';
  // trouve le </span> correspondant en tenant compte des <span> imbriqués
  let depth = 1, i = m.index + m[0].length;
  const tag = /<\/?span\b[^>]*>/g;
  tag.lastIndex = i;
  let t;
  while ((t = tag.exec(fragment))){
    depth += t[0][1] === '/' ? -1 : 1;
    if (depth === 0) return textContent(fragment.slice(i, t.index)).trim();
  }
  return textContent(fragment.slice(i)).trim();
}
function blocksOf(html, re){
  const out = []; let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

// ---------- réplique de extractCards() (app.html) ----------
function stripNikud(s){ return s.replace(/[֑-ׇ]/g, ''); }

function parseSections(html){
  // name du <span class="count"> → HTML du corps de section (jusqu'au <h2> suivant)
  const sections = {};
  const h2 = /<h2\b[^>]*>([\s\S]*?)<\/h2>/g;
  const marks = [];
  let m;
  while ((m = h2.exec(html))) marks.push({ inner: m[1], end: m.index + m[0].length, start: m.index });
  marks.forEach((mk, i) => {
    const c = /<span\b[^>]*\bclass="count"[^>]*>([\s\S]*?)<\/span>/.exec(mk.inner);
    if (!c) return;
    const name = textContent(c[1]).trim();
    sections[name] = html.slice(mk.end, i + 1 < marks.length ? marks[i + 1].start : html.length);
  });
  return sections;
}
function rowsOf(sections, name){
  // renvoie chaque <tr> COMPLET (balise ouvrante incluse, pour lire son data-niveau)
  const body = sections[name] || '';
  const rows = [];
  blocksOf(body, /<tbody\b[^>]*>([\s\S]*?)<\/tbody>/g).forEach(tb => {
    let m; const re = /<tr\b[^>]*>[\s\S]*?<\/tr>/g;
    while ((m = re.exec(tb))) rows.push(m[0]);
  });
  return rows;
}
// Fin du bloc ouvert à openTag.index : suit la profondeur des <tag>/<\/tag> imbriqués
// (une regex non-gourmande s'arrêterait au premier fermant — celui d'un enfant).
function closeOf(html, openEnd, tag){
  const re = new RegExp('</?' + tag + '\\b[^>]*>', 'g');
  re.lastIndex = openEnd;
  let depth = 1, t;
  while ((t = re.exec(html))){
    depth += t[0][1] === '/' ? -1 : 1;
    if (depth === 0) return t.index;
  }
  return html.length;
}
function lisOf(sections, name){
  // renvoie chaque <li> COMPLET de premier niveau (balise ouvrante incluse, pour
  // lire ses data-*) — les <ul class="exemples"> imbriqués et leurs <li> restent
  // à l'intérieur du fragment, jamais énumérés comme des mots.
  const body = sections[name] || '';
  const lis = [];
  const ulRe = /<ul\b[^>]*\bclass="word-list"[^>]*>/g;
  let ul;
  while ((ul = ulRe.exec(body))){
    const end = closeOf(body, ul.index + ul[0].length, 'ul');
    const inner = body.slice(ul.index + ul[0].length, end);
    const liRe = /<\/?li\b[^>]*>/g;
    let depth = 0, start = -1, t;
    while ((t = liRe.exec(inner))){
      if (t[0][1] !== '/'){ if (depth === 0) start = t.index; depth++; }
      else { depth--; if (depth === 0 && start >= 0){ lis.push(inner.slice(start, t.index + t[0].length)); start = -1; } }
    }
    ulRe.lastIndex = end;
  }
  return lis;
}
// Exemples en situation : <ul class="exemples"><li> .he/.tr/.fr </li></ul> dans un
// <li> de word-list ou dans la première cellule d'une table. Champ optionnel.
function exemplesOf(fragment){
  const out = [];
  const ulRe = /<ul\b[^>]*\bclass="exemples"[^>]*>/g;
  let ul;
  while ((ul = ulRe.exec(fragment))){
    const end = closeOf(fragment, ul.index + ul[0].length, 'ul');
    blocksOf(fragment.slice(ul.index + ul[0].length, end), /<li\b[^>]*>([\s\S]*?)<\/li>/g).forEach(li => {
      const he = firstSpanText(li, 'he'); if (!he) return;
      out.push({ he, tr: firstSpanText(li, 'tr'), fr: firstSpanText(li, 'fr'), he_plain: stripNikud(he) });
    });
    ulRe.lastIndex = end;
  }
  return out;
}
function attrOf(fragment, name){
  // attribut de la balise ouvrante d'un fragment <li>/<tr> complet
  const m = new RegExp('^<(?:li|tr)\\b[^>]*\\s' + name + '="([^"]*)"').exec(fragment);
  return m ? decodeEntities(m[1]).trim() : '';
}
function tdsOf(tr){ return blocksOf(tr, /<td\b[^>]*>([\s\S]*?)<\/td>/g); }

function extractCards(html){
  const sections = parseSections(html);
  const cards = [];

  rowsOf(sections, 'Verbes').forEach(tr => {
    const tds = tdsOf(tr); if (tds.length < 5) return;
    const he = firstSpanText(tds[0], 'he'); const fr = firstSpanText(tds[0], 'fr');
    const labels = ['il','elle','ils','elles']; const forms = [];
    for (let i = 1; i < 5; i++){
      const fhe = firstSpanText(tds[i], 'he'); const ftr = firstSpanText(tds[i], 'tr');
      forms.push({ he: fhe, tr: ftr, label: labels[i-1], he_plain: stripNikud(fhe) });
    }
    if (he){
      const card = { cat: 'Verbes', he, tr: '', fr: '(infinitif) ' + fr, forms };
      const niveau = attrOf(tr, 'data-niveau');
      if (niveau) card.niveau = niveau;
      const ex = exemplesOf(tds[0]);
      if (ex.length) card.exemples = ex;
      cards.push(card);
    }
  });

  rowsOf(sections, 'Adjectifs').forEach(tr => {
    const tds = tdsOf(tr); if (tds.length < 4) return;
    const he = firstSpanText(tds[0], 'he'); const fr = firstSpanText(tds[0], 'fr');
    const labels = ['f. sing.','m. plur.','f. plur.']; const forms = [];
    for (let i = 1; i < 4; i++){
      const fhe = firstSpanText(tds[i], 'he'); const ftr = firstSpanText(tds[i], 'tr');
      if (fhe) forms.push({ he: fhe, tr: ftr, label: labels[i-1], he_plain: stripNikud(fhe) });
    }
    if (he){
      const card = { cat: 'Adjectifs', he, tr: '', fr, forms };
      const niveau = attrOf(tr, 'data-niveau');
      if (niveau) card.niveau = niveau;
      const ex = exemplesOf(tds[0]);
      if (ex.length) card.exemples = ex;
      cards.push(card);
    }
  });

  rowsOf(sections, 'Noms').forEach(tr => {
    const tds = tdsOf(tr); if (tds.length < 3) return;
    const he = firstSpanText(tds[0], 'he'); const fr = firstSpanText(tds[0], 'fr');
    const genre = textContent(tds[1]).trim();
    const plHe = firstSpanText(tds[2], 'he'); const plTr = firstSpanText(tds[2], 'tr');
    const card = { cat: 'Noms', he, tr: '', fr: fr + ((genre === 'm' || genre === 'f') ? (' (' + genre + ')') : '') };
    if (genre === 'm' || genre === 'f') card.genre = genre;
    if (plHe && plHe !== '—'){ card.forms = [{ he: plHe, tr: plTr, label: 'pluriel', he_plain: stripNikud(plHe) }]; }
    const niveau = attrOf(tr, 'data-niveau');
    if (niveau) card.niveau = niveau;
    const ex = exemplesOf(tds[0]);
    if (ex.length) card.exemples = ex;
    if (he) cards.push(card);
  });

  const listCats = { 'Pronoms personnels':'Pronoms personnels', 'Démonstratifs':'Démonstratifs',
    'Verbes modaux':'Verbes modaux',
    'Prépositions':'Prépositions', 'Conjonctions':'Conjonctions', 'Mots interrogatifs':'Mots interrogatifs',
    'Nombres (0–10)':'Nombres', 'Nombres (11 et plus)':'Nombres', 'Nombres ordinaux':'Nombres',
    'Jours de la semaine':'Jours de la semaine', 'Adverbes':'Adverbes', 'Saisons & mois':'Saisons & mois',
    'Mots de quantité':'Mots de quantité', 'Expressions / Divers':'Expressions',
    'Existence et possession':'Existence', 'Phrases':'Phrases' };
  Object.keys(listCats).forEach(sec => {
    lisOf(sections, sec).forEach(li => {
      const he = firstSpanText(li, 'he'); if (!he) return;
      // data-fr-court / data-note : mêmes attributs que lit extractCards() d'app.html
      const card = { cat: listCats[sec], he, tr: firstSpanText(li, 'tr'), fr: attrOf(li, 'data-fr-court') || firstSpanText(li, 'fr') };
      const note = attrOf(li, 'data-note');
      if (note) card.note = note;
      const niveau = attrOf(li, 'data-niveau');
      if (niveau) card.niveau = niveau;
      const ex = exemplesOf(li);
      if (ex.length) card.exemples = ex;
      cards.push(card);
    });
  });

  cards.forEach(c => { c.he_plain = stripNikud(c.he); });
  return cards;
}

// ---------- comptes + garde-fous ----------
function report(cards){
  const counts = {};
  cards.forEach(c => { counts[c.cat] = (counts[c.cat] || 0) + 1; });
  const width = Math.max(...Object.keys(counts).map(k => k.length));
  Object.keys(counts).sort((a, b) => counts[b] - counts[a]).forEach(cat => {
    console.log('  ' + cat.padEnd(width) + '  ' + counts[cat]);
  });
  console.log('  ' + 'TOTAL'.padEnd(width) + '  ' + cards.length);
  const missing = EXPECTED_CATS.filter(cat => !counts[cat]);
  if (missing.length){
    console.error('\n✗ Sections attendues sans aucune carte : ' + missing.join(', '));
    console.error('  (titre de section renommé dans le carnet ? colonne ajoutée à une table ?)');
    process.exit(1);
  }
  if (!cards.length){ console.error('\n✗ Aucune carte extraite.'); process.exit(1); }

  // Niveaux CECRL (étape 5 du plan UX) : comptes + garde-fou anti-dérive.
  const levels = {};
  cards.forEach(c => { const k = c.niveau || 'non classé'; levels[k] = (levels[k] || 0) + 1; });
  console.log('\nNiveaux CECRL (data-niveau) :');
  const lw = Math.max(...Object.keys(levels).map(k => k.length));
  Object.keys(levels).sort().forEach(k => {
    console.log('  ' + k.padEnd(lw) + '  ' + levels[k]);
  });
  const missingLevels = EXPECTED_LEVELS.filter(l => !levels[l]);
  if (missingLevels.length){
    console.error('\n✗ Niveaux attendus sans aucune carte : ' + missingLevels.join(', '));
    console.error('  (data-niveau retirés ou renommés dans le carnet ?)');
    process.exit(1);
  }

  // Exemples en situation (étape 6 du plan UX) : comptes par section.
  const exCounts = {};
  let exTotal = 0, exWords = 0;
  cards.forEach(c => {
    if (!c.exemples) return;
    exWords++; exTotal += c.exemples.length;
    exCounts[c.cat] = (exCounts[c.cat] || 0) + c.exemples.length;
  });
  if (exTotal){
    console.log('\nExemples en situation : ' + exTotal + ' phrase(s) sur ' + exWords + ' mot(s)');
    const ew = Math.max(...Object.keys(exCounts).map(k => k.length));
    Object.keys(exCounts).sort((a, b) => exCounts[b] - exCounts[a]).forEach(cat => {
      console.log('  ' + cat.padEnd(ew) + '  ' + exCounts[cat]);
    });
  }
}

// ---------- génération du fichier autonome depuis app.html ----------
function mustReplace(src, from, to, what){
  const out = typeof from === 'string' ? src.replace(from, to) : src.replace(from, to);
  if (out === src){
    console.error('✗ Point d\'ancrage introuvable dans app.html : ' + what);
    process.exit(1);
  }
  return out;
}

function generateStandalone(cards){
  const app = fs.readFileSync(APP, 'utf8');
  let out = app;

  out = mustReplace(out, '<!DOCTYPE html>',
    '<!DOCTYPE html>\n<!-- FICHIER GÉNÉRÉ par `node build.js` depuis app.html + vocabulaire_hebreu.html — ne pas éditer à la main. -->',
    'doctype');

  // Version autonome : pas de chargement réseau → pas de loader, panneau visible d\'emblée.
  out = mustReplace(out,
    '<div id="loader" class="loader"><div class="spin"></div><p id="loader-msg" role="status">Chargement du vocabulaire…</p></div>\n',
    '', 'div #loader');
  out = mustReplace(out,
    '<section class="setup panel hidden" id="setup">',
    '<section class="setup panel" id="setup">', 'section #setup (classe hidden)');

  // Vocabulaire intégré à la place du tableau vide.
  out = mustReplace(out, 'let CARDS = [];',
    'const CARDS = ' + JSON.stringify(cards) + ';', 'let CARDS = []');

  // Le bloc en-ligne (fetch + extraction runtime) devient un démarrage direct.
  out = mustReplace(out,
    /\/\/ ===== BUILD:ONLINE-ONLY[^\n]*\n[\s\S]*?\/\/ ===== \/BUILD:ONLINE-ONLY =====\n/,
    '// ---------- Démarrage (version autonome : vocabulaire intégré ci-dessus) ----------\n'
    + 'buildChips();\n'
    + 'updateStart();\n'
    + "document.getElementById('count-note').textContent = CARDS.length + ' mots intégrés (version autonome)';\n",
    'bloc BUILD:ONLINE-ONLY');

  // Garde-fous : plus aucune trace du chemin réseau dans le fichier autonome.
  ['fetch(', 'DOMParser', 'extractCards'].forEach(tok => {
    if (out.includes(tok)){
      console.error('✗ Le fichier généré contient encore « ' + tok + ' » — marqueurs BUILD:ONLINE-ONLY déplacés ?');
      process.exit(1);
    }
  });
  return out;
}

function main(){
  const check = process.argv.includes('--check');
  const notebook = fs.readFileSync(NOTEBOOK, 'utf8');
  const cards = extractCards(notebook);
  console.log('Cartes extraites de vocabulaire_hebreu.html :');
  report(cards);

  const generated = generateStandalone(cards);
  const onDisk = fs.existsSync(STANDALONE) ? fs.readFileSync(STANDALONE, 'utf8') : '';

  if (check){
    if (generated === onDisk) console.log('\n✓ flashcards_hebreu.html en phase avec le carnet et app.html.');
    else {
      console.error('\n✗ flashcards_hebreu.html obsolète — lance `node build.js` pour le régénérer.');
      process.exit(1);
    }
    return;
  }

  if (generated === onDisk){
    console.log('\n✓ flashcards_hebreu.html déjà à jour.');
  } else {
    fs.writeFileSync(STANDALONE, generated);
    console.log('\n✓ flashcards_hebreu.html régénéré (' + cards.length + ' cartes).');
  }
}

main();
