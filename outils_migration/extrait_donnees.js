'use strict';
// Chantier 1, tâche 2 : extrait le vocabulaire du carnet (vocabulaire_hebreu.html)
// vers data/{noms,adjectifs,verbes}.json + data/listes/<slug>.json, conformes à
// data/SCHEMA.md. Script jetable (pas de garde require.main : usage CLI direct).
const fs = require('fs'), path = require('path');
const B = require('../build.js');
const html = fs.readFileSync(B.NOTEBOOK, 'utf8');
const sections = B.parseSections(html);

// rowsOf n'est pas exporté : réimplémentation locale (script jetable),
// même regex que build.js — <tr> du tbody de la section, dans l'ordre.
function rowsOf(sec){ const m = []; const re = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/g;
  let r; while ((r = re.exec(sec))) if (/data-niveau=/.test(r[1])) m.push(r[0]); return m; }
// groupe = dernier <h3 class="subtheme"> avant la ligne (slugifié)
function slug(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function groupesOf(sec){ // [{groupe, corps}] découpé aux <h3 class="subtheme">
  const parts = sec.split(/<h3 class="subtheme">([\s\S]*?)<\/h3>/);
  const out = [{ groupe: '', corps: parts[0] }];
  // ⚠️ Unicité des groupes (brief) : deux <h3 class="subtheme"> d'une même
  // section qui produisent le même slug fusionneraient au chargement (le
  // générateur du Task 3 filtre par e.groupe === groupe) — échec nommé ici,
  // avant que le doublon ne se propage silencieusement.
  const vus = new Set(['']);
  for (let i = 1; i < parts.length; i += 2){
    const g = slug(B.decodeEntities(parts[i].replace(/<[^>]*>/g,'')));
    if (vus.has(g)) throw new Error(
      `groupe dupliqué : le slug "${g}" est produit par au moins deux <h3 class="subtheme"> ` +
      `de la même section (titre en cause : « ${B.decodeEntities(parts[i].replace(/<[^>]*>/g,''))} »)`);
    vus.add(g);
    out.push({ groupe: g, corps: parts[i+1] });
  }
  return out;
}
function exemples(td){ return B.exemplesOf(td).map(x => ({ he: x.he, tr: x.tr, fr: x.fr })); }
function celluleVedette(td){ return { he: B.firstSpanText(td, 'he'), fr: B.firstSpanText(td, 'fr') }; }
function heTr(td){ const he = B.firstSpanText(td, 'he');
  return he ? { he, tr: B.firstSpanText(td, 'tr') } : null; }

function extraisTable(nom, mappe){ const out = [];
  for (const g of groupesOf(sections[nom]))
    for (const tr of rowsOf(g.corps)){
      const tds = B.tdsOf(tr);
      const e = mappe(tds, tr);
      e.niveau = B.attrOf(tr, 'data-niveau'); e.theme = B.attrOf(tr, 'data-theme');
      e.groupe = g.groupe; e.exemples = exemples(tds[0]);
      // (a) note : même source qu'extractCards() — attribut data-note de la
      // balise ouvrante (jamais vu sur <tr> à date, mais champ optionnel du
      // schéma pour les trois tables : on l'aligne quand même par cohérence).
      const note = B.attrOf(tr, 'data-note'); if (note) e.note = note;
      out.push(e);
    }
  return out; }

const noms = extraisTable('Noms', (tds) => ({ ...celluleVedette(tds[0]),
  genre: tds[1].replace(/<[^>]*>/g,'').trim(), pluriel: heTr(tds[2]) }));
const adjectifs = extraisTable('Adjectifs', (tds) => ({ ...celluleVedette(tds[0]),
  formes: [heTr(tds[1]), heTr(tds[2]), heTr(tds[3])] }));
const verbes = extraisTable('Verbes', (tds) => ({ ...celluleVedette(tds[0]),
  formes: [1,2,3,4].map(i => heTr(tds[i])) }));

// lisOf() n'est exporté que pour (sections, name) — deux sections (Adverbes,
// Saisons & mois) ont deux <ul class="word-list"> côte à côte (une par
// <h3 class="subtheme">, correctif contrôleur) ; on doit donc pouvoir
// l'appliquer à un fragment de section (g.corps), pas seulement à la section
// entière — réimplémentation locale sur un corps de texte, même logique.
function lisOfBody(body){
  const lis = [];
  const ulRe = /<ul\b[^>]*\bclass="word-list"[^>]*>/g;
  let ul;
  while ((ul = ulRe.exec(body))){
    const end = B.closeOf(body, ul.index + ul[0].length, 'ul');
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

const listes = {};
for (const label of Object.keys(B.listCats)){
  const entries = [];
  // même découpe aux <h3 class="subtheme"> que les tables (groupesOf, garde
  // d'unicité incluse) : la plupart des sections n'ont aucun h3, donc un seul
  // groupe '' — groupe omis sur l'entrée (14 fichiers inchangés, octet pour
  // octet). Adverbes et Saisons & mois ont chacune deux <h3>, donc e.groupe
  // posé sur chaque entrée.
  for (const g of groupesOf(sections[label])){
    for (const li of lisOfBody(g.corps)){
      const e = { he: B.firstSpanText(li, 'he'), tr: B.firstSpanText(li, 'tr'),
        fr: B.firstSpanText(li, 'fr'), niveau: B.attrOf(li, 'data-niveau') };
      if (g.groupe) e.groupe = g.groupe;
      e.exemples = B.exemplesOf(li).map(x => ({ he: x.he, tr: x.tr, fr: x.fr }));
      const court = B.attrOf(li, 'data-fr-court'); if (court) e.fr_court = court;
      // (a) note : même attribut data-note qu'extractCards() lit pour les listes
      // (build.js L275) — c'est la seule source réelle de note dans le carnet
      // (17 occurrences, toutes sur des <li>, 0 sur des <tr> — vérifié par grep).
      const note = B.attrOf(li, 'data-note'); if (note) e.note = note;
      entries.push(e);
    }
  }
  listes[slug(label)] = { section: label, entries };
}

// écriture : JSON.stringify(v, null, 2), un fichier par table + data/listes/<slug>.json
const DATA = path.join(__dirname, '..', 'data');
fs.mkdirSync(path.join(DATA, 'listes'), { recursive: true });
const ecrit = (f, v) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(v, null, 2) + '\n');
ecrit('noms.json', noms);
ecrit('adjectifs.json', adjectifs);
ecrit('verbes.json', verbes);
for (const [s, v] of Object.entries(listes)) ecrit(path.join('listes', s + '.json'), v);

console.log('noms', noms.length, '— adjectifs', adjectifs.length, '— verbes', verbes.length,
  '— listes', Object.values(listes).reduce((s, l) => s + l.entries.length, 0),
  '(' + Object.keys(listes).length + ' fichiers)');
