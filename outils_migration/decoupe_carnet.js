'use strict';
// Chantier 1, tâche 3 : découpe vocabulaire_hebreu.html en fragments statiques
// (src/tokens.css, src/carnet/{carnet.css,carnet.js,tete.html,pied.html,
// sections/NN-<slug>.html,sections.json}), avec les <tr>/<li> de données
// remplacés par des placeholders <!-- @ENTREES:... -->. Script jetable (pas de
// garde require.main : usage CLI direct, comme extrait_donnees.js).
//
// Convention de placeholder (le seul contrat avec genere_carnet.js, Task 5) :
//   <!-- @ENTREES:verbes#<groupe> -->        (resp. adjectifs, noms) — tbody de table
//   <!-- @ENTREES:listes/<slug> -->          — <li> d'un <ul class="word-list"> seul dans sa section
//   <!-- @ENTREES:listes/<slug>#<groupe> -->  — idem, quand la section a des sous-thèmes
//     <h3 class="subtheme"> (correctif contrôleur : mécanisme de groupe des tables
//     étendu aux listes — résout Adverbes/Saisons & mois, qui ont deux <ul> chacune)
//   <!-- @TOKENS --> / <!-- @CSS:carnet --> / <!-- @JS:carnet -->  — tete/pied
//
// Les contenus retirés (lignes de données) ne sont PAS persistés par ce script
// — ils vivent déjà dans data/*.json (Task 2) et, pour la preuve d'inversibilité
// ci-dessous, sont re-dérivés à la demande depuis vocabulaire_hebreu.html lui-même
// (source de vérité, non modifiée par cette tâche).
const fs = require('fs'), path = require('path');
const B = require('../build.js');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const CARNET = path.join(SRC, 'carnet');
const SECTIONS_DIR = path.join(CARNET, 'sections');

// même slugifieur que Task 2 (outils_migration/extrait_donnees.js), copié —
// script jetable, aucune extraction de lib partagée pour deux usages ponctuels.
function slug(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

const TOKENS_MARKER = '<!-- @TOKENS -->';
const CSS_MARKER = '<!-- @CSS:carnet -->';
const JS_MARKER = '<!-- @JS:carnet -->';

const TABLE_CATS = { 'Verbes': 'verbes', 'Adjectifs': 'adjectifs', 'Noms': 'noms' };

function dedent(text, prefix){
  return text.split('\n').map(l => l.startsWith(prefix) ? l.slice(prefix.length) : l).join('\n');
}
function reindent(text, prefix){
  return text.split('\n').map(l => l.length ? prefix + l : l).join('\n');
}

// Remplace, dans `chunk`, le contenu de chaque <tbody>…</tbody> par le
// placeholder de la clé `cat#groupe`, en empilant l'original retiré dans
// `originaux` (Map clé -> file d'attente FIFO). `gardeSection` (Set, propre à
// la section en cours) fait qu'une même clé vue deux fois dans une section est
// une erreur nommée — pas une fusion silencieuse.
function remplaceTbodies(chunk, cat, groupe, originaux, gardeSection){
  const key = `${cat}#${groupe}`;
  const re = /(<tbody\b[^>]*>)([\s\S]*?)(<\/tbody>)/g;
  return chunk.replace(re, (m, open, inner, close) => {
    if (gardeSection.has(key)) throw new Error(
      `clé de placeholder dupliquée dans la section "${cat}" : "${key}" produite par au moins deux <tbody>`);
    gardeSection.add(key);
    if (!originaux.has(key)) originaux.set(key, []);
    originaux.get(key).push(inner);
    return open + `<!-- @ENTREES:${key} -->` + close;
  });
}

// Découpe une section de table (Verbes/Adjectifs/Noms) aux <h3 class="subtheme">
// — même logique que groupesOf() d'extrait_donnees.js (Task 2) : le premier
// morceau (avant tout h3, ou toute la section si aucun h3 — cas Adjectifs) a
// le groupe '' ; l'unicité des slugs de groupe est une erreur nommée, comme Task 2.
function traiteTable(cat, sectionHtml, originaux){
  const parts = sectionHtml.split(/<h3 class="subtheme">([\s\S]*?)<\/h3>/);
  const gardeSection = new Set();
  let out = remplaceTbodies(parts[0], cat, '', originaux, gardeSection);
  const vus = new Set(['']);
  for (let i = 1; i < parts.length; i += 2){
    const g = slug(B.decodeEntities(parts[i].replace(/<[^>]*>/g, '')));
    if (vus.has(g)) throw new Error(
      `groupe dupliqué : le slug "${g}" est produit par au moins deux <h3 class="subtheme"> ` +
      `de la section "${cat}" (titre en cause : « ${B.decodeEntities(parts[i].replace(/<[^>]*>/g, ''))} »)`);
    vus.add(g);
    out += '<h3 class="subtheme">' + parts[i] + '</h3>';
    out += remplaceTbodies(parts[i + 1], cat, g, originaux, gardeSection);
  }
  return out;
}

// Remplace, dans `chunk`, le contenu de chaque <ul class="word-list">…</ul> par
// le placeholder de la clé (listes/<slug>, ou listes/<slug>#<groupe> dans un
// sous-thème) — fermeture trouvée par B.closeOf (profondeur de balise, robuste
// aux <ul class="exemples"> imbriqués dans les <li>). Même garde d'unicité de
// clé par section que remplaceTbodies.
function remplaceUlsListe(chunk, sslug, groupe, originaux, gardeSection){
  const key = groupe ? `listes/${sslug}#${groupe}` : `listes/${sslug}`;
  const re = /<ul\b[^>]*class="word-list"[^>]*>/g;
  let out = '', last = 0, m;
  while ((m = re.exec(chunk))){
    const openEnd = m.index + m[0].length;
    const closeIdx = B.closeOf(chunk, openEnd, 'ul');
    out += chunk.slice(last, openEnd);
    const inner = chunk.slice(openEnd, closeIdx);
    if (gardeSection.has(key)) throw new Error(
      `clé de placeholder dupliquée dans la section liste "${sslug}" : "${key}" produite par au moins deux <ul class="word-list">`);
    gardeSection.add(key);
    if (!originaux.has(key)) originaux.set(key, []);
    originaux.get(key).push(inner);
    out += `<!-- @ENTREES:${key} -->`;
    last = closeIdx;
    re.lastIndex = closeIdx;
  }
  out += chunk.slice(last);
  return out;
}

// Découpe une section de liste (listCats) aux <h3 class="subtheme"> — même
// mécanisme que traiteTable (correctif contrôleur, 2026-07-24) : la plupart des
// sections n'ont aucun h3 (un seul <ul>, clé plate listes/<slug>) ; Adverbes et
// Saisons & mois en ont deux (Temps/Lieu & direction, Saisons/Mois) → clés
// listes/<slug>#<groupe> distinctes, une par sous-thème.
function traiteListe(sslug, sectionHtml, originaux){
  const parts = sectionHtml.split(/<h3 class="subtheme">([\s\S]*?)<\/h3>/);
  const gardeSection = new Set();
  let out = remplaceUlsListe(parts[0], sslug, '', originaux, gardeSection);
  const vus = new Set(['']);
  for (let i = 1; i < parts.length; i += 2){
    const g = slug(B.decodeEntities(parts[i].replace(/<[^>]*>/g, '')));
    if (vus.has(g)) throw new Error(
      `groupe dupliqué : le slug "${g}" est produit par au moins deux <h3 class="subtheme"> ` +
      `de la section liste "${sslug}" (titre en cause : « ${B.decodeEntities(parts[i].replace(/<[^>]*>/g, ''))} »)`);
    vus.add(g);
    out += '<h3 class="subtheme">' + parts[i] + '</h3>';
    out += remplaceUlsListe(parts[i + 1], sslug, g, originaux, gardeSection);
  }
  return out;
}

function labelOf(sectionRaw){
  const h2m = /<h2\b[^>]*>([\s\S]*?)<\/h2>/.exec(sectionRaw);
  if (!h2m) throw new Error('section sans <h2> — structure inattendue');
  const cm = /<span\b[^>]*class="count"[^>]*>([\s\S]*?)<\/span>/.exec(h2m[1]);
  if (!cm) throw new Error(`<h2> sans <span class="count"> : ${h2m[1].slice(0, 80)}`);
  return B.decodeEntities(cm[1].replace(/<[^>]*>/g, '')).trim();
}

// Scinde le carnet en tête/corps/pied, extrait les tokens partagés et le
// script final, découpe le corps aux <h2>, et remplace les lignes de données
// par des placeholders. Fonction pure — utilisée telle quelle à l'écriture ET
// à la vérification (--verifie recalcule `originaux` depuis le carnet actuel,
// seule source des lignes retirées puisque ce script ne les persiste nulle part).
function decoupe(raw){
  // ---------- 1) tête / corps / pied ----------
  const styleOpenIdx = raw.indexOf('<style>');
  if (styleOpenIdx < 0) throw new Error('<style> introuvable');
  const styleContentStart = styleOpenIdx + '<style>'.length;
  const styleContentEnd = raw.indexOf('</style>', styleContentStart);
  if (styleContentEnd < 0) throw new Error('</style> introuvable');
  const styleInner = raw.slice(styleContentStart, styleContentEnd);

  const bodyOpenIdx = raw.indexOf('<body>', styleContentEnd);
  if (bodyOpenIdx < 0) throw new Error('<body> introuvable après </style>');
  const bodyTagEnd = bodyOpenIdx + '<body>'.length;

  // premier bloc :root — piège 5, doit rester byte-identique (dedenté puis
  // redenté, l'auto-contrôle ci-dessous prouve la réversibilité).
  const rootRe = /( *):root\{[^}]*\}/;
  const rm = rootRe.exec(styleInner);
  if (!rm) throw new Error('premier bloc :root introuvable dans <style>');
  const rootBlockExact = rm[0];
  const indentStr = rm[1];
  const restBeforeRoot = styleInner.slice(0, rm.index);
  const restAfterRoot = styleInner.slice(rm.index + rm[0].length);

  const tokensCss = dedent(rootBlockExact, indentStr);
  if (reindent(tokensCss, indentStr) !== rootBlockExact)
    throw new Error('dedent/reindent du bloc :root non réversible — structure inattendue');
  const carnetCss = restAfterRoot;

  const teteContent = raw.slice(0, styleContentStart)
    + restBeforeRoot + TOKENS_MARKER + CSS_MARKER
    + raw.slice(styleContentEnd, bodyTagEnd);

  // script final ("le script du carnet") — dernier <script> du document.
  const lastScriptOpenIdx = raw.lastIndexOf('<script>');
  if (lastScriptOpenIdx < bodyTagEnd) throw new Error('<script> final introuvable après <body>');
  const lastScriptContentStart = lastScriptOpenIdx + '<script>'.length;
  const lastScriptContentEnd = raw.indexOf('</script>', lastScriptContentStart);
  if (lastScriptContentEnd < 0) throw new Error('</script> final introuvable');
  const carnetJs = raw.slice(lastScriptContentStart, lastScriptContentEnd);

  const piedContent = raw.slice(lastScriptOpenIdx, lastScriptContentStart)
    + JS_MARKER + raw.slice(lastScriptContentEnd);

  const corpsStart = bodyTagEnd;
  const corpsEnd = lastScriptOpenIdx;

  // ---------- 2) corps scindé aux <h2> ----------
  const h2re = /<h2\b[^>]*>[\s\S]*?<\/h2>/g;
  const h2starts = [];
  let hm;
  while ((hm = h2re.exec(raw))){
    if (hm.index >= corpsStart && hm.index < corpsEnd) h2starts.push(hm.index);
  }
  if (!h2starts.length) throw new Error('aucun <h2> trouvé dans le corps');

  const rawSections = [{ label: null, html: raw.slice(corpsStart, h2starts[0]) }];
  for (let i = 0; i < h2starts.length; i++){
    const start = h2starts[i];
    const end = i + 1 < h2starts.length ? h2starts[i + 1] : corpsEnd;
    const html = raw.slice(start, end);
    rawSections.push({ label: labelOf(html), html });
  }

  // unicité des slugs de fichier de section (même garde qu'à Task 2 pour les groupes)
  const vusSlugs = new Map();
  const originaux = new Map();
  const sectionFiles = rawSections.map((sec, i) => {
    if (i === 0) return { filename: '00-preambule.html', content: sec.html };
    const s = slug(sec.label);
    if (vusSlugs.has(s)) throw new Error(
      `slug de section dupliqué : "${s}" produit à la fois par « ${vusSlugs.get(s)} » et « ${sec.label} »`);
    vusSlugs.set(s, sec.label);
    let content = sec.html;
    if (TABLE_CATS[sec.label]) content = traiteTable(TABLE_CATS[sec.label], content, originaux);
    else if (Object.prototype.hasOwnProperty.call(B.listCats, sec.label)) content = traiteListe(slug(sec.label), content, originaux);
    const nn = String(i).padStart(2, '0');
    return { filename: `${nn}-${s}.html`, content };
  });

  return { teteContent, tokensCss, carnetCss, piedContent, carnetJs, sectionFiles, originaux, indentStr };
}

function ecrit(){
  const raw = fs.readFileSync(B.NOTEBOOK, 'utf8');
  const d = decoupe(raw);

  fs.mkdirSync(SECTIONS_DIR, { recursive: true });
  const w = (p, v) => fs.writeFileSync(p, v);
  w(path.join(SRC, 'tokens.css'), d.tokensCss);
  w(path.join(CARNET, 'carnet.css'), d.carnetCss);
  w(path.join(CARNET, 'carnet.js'), d.carnetJs);
  w(path.join(CARNET, 'tete.html'), d.teteContent);
  w(path.join(CARNET, 'pied.html'), d.piedContent);
  d.sectionFiles.forEach(f => w(path.join(SECTIONS_DIR, f.filename), f.content));
  w(path.join(CARNET, 'sections.json'), JSON.stringify(d.sectionFiles.map(f => f.filename), null, 2) + '\n');

  const porteurs = d.sectionFiles.filter(f => /@ENTREES/.test(f.content)).length;
  console.log(`sections : ${d.sectionFiles.length} fichiers (dont 00-preambule.html)`);
  console.log(`fragments porteurs de placeholder @ENTREES : ${porteurs}`);
  console.log('écrit sous src/ et src/carnet/.');
}

// Reconstruction --verifie : relit les fragments sur disque, réinjecte les
// contenus originaux (tokens/carnet.css/carnet.js depuis les fragments écrits ;
// les lignes de données depuis un nouveau `decoupe()` du carnet actuel, seule
// source qui les porte encore), et compare octet à octet au carnet.
function verifie(){
  const raw = fs.readFileSync(B.NOTEBOOK, 'utf8');
  const d = decoupe(raw); // recalcule `originaux` (fraîcheur = preuve que rien n'a changé)

  const r = (p) => fs.readFileSync(p, 'utf8');
  const teteDisk = r(path.join(CARNET, 'tete.html'));
  const tokensDisk = r(path.join(SRC, 'tokens.css'));
  const carnetCssDisk = r(path.join(CARNET, 'carnet.css'));
  const carnetJsDisk = r(path.join(CARNET, 'carnet.js'));
  const piedDisk = r(path.join(CARNET, 'pied.html'));
  const sectionsList = JSON.parse(r(path.join(CARNET, 'sections.json')));

  const teteResolved = teteDisk
    .replace(TOKENS_MARKER, reindent(tokensDisk, d.indentStr))
    .replace(CSS_MARKER, carnetCssDisk);
  const piedResolved = piedDisk.replace(JS_MARKER, carnetJsDisk);

  const entriesRe = /<!-- @ENTREES:([^\s]+?) -->/g;
  const sectionsResolved = sectionsList.map(filename => {
    const content = r(path.join(SECTIONS_DIR, filename));
    return content.replace(entriesRe, (m, key) => {
      const file = d.originaux.get(key);
      if (!file || !file.length) throw new Error(
        `reconstruction : plus de contenu original pour la clé "${key}" (fichier ${filename})`);
      return file.shift();
    });
  });

  const reconstruit = teteResolved + sectionsResolved.join('') + piedResolved;
  const a = Buffer.from(reconstruit, 'utf8');
  const b = Buffer.from(raw, 'utf8');
  const cmp = Buffer.compare(a, b);
  if (cmp === 0){
    console.log('RECONSTRUCTION BYTE-IDENTIQUE : OK');
  } else {
    console.error(`RECONSTRUCTION DIFFÉRENTE DU CARNET (Buffer.compare = ${cmp}, ` +
      `reconstruit ${a.length} octets vs carnet ${b.length} octets)`);
    // première divergence, pour diagnostiquer sans tout réafficher
    let i = 0; const n = Math.min(a.length, b.length);
    while (i < n && a[i] === b[i]) i++;
    console.error(`première divergence à l'octet ${i} : reconstruit="${a.slice(Math.max(0,i-20), i+20)}" ` +
      `carnet="${b.slice(Math.max(0,i-20), i+20)}"`);
    process.exit(1);
  }
}

if (process.argv.includes('--verifie')) verifie();
else ecrit();
