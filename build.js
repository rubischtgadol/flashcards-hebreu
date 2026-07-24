#!/usr/bin/env node
/*
 * build.js — outil de développement (non déployé). v2 (chantier 2) : data/*.json
 * (source de vérité) devient l'ENTRÉE du build, plus jamais vocabulaire_hebreu.html.
 *
 * Régénère QUATRE artefacts depuis data/ + src/carnet/ + src/app/ (chantier 3, tâche 13 :
 * app.html a rejoint le carnet côté « généré », plus jamais une source qu'on édite à la main) :
 *   - vocabulaire_hebreu.html (le carnet)      via genereCarnet()   (gabarits.js)
 *   - cards.json ({version, cartes})           via deriveCartes()
 *   - app.html (les flashcards en ligne)       via assembleApp() depuis src/app/
 *     (coquille.html + css/*.css et js/*.js dans l'ordre de ordre.json + src/tokens.css)
 *   - flashcards_hebreu.html (version autonome) via generateStandalone(cards, appAssemble),
 *     inchangé sur le fond : dérivé de l'app FRAÎCHEMENT ASSEMBLÉE (jamais de l'ancien
 *     app.html du disque — sinon --check, qui n'écrit rien, validerait un déphasage), dont
 *     le bloc marqué BUILD:ONLINE-ONLY (fetch + extraction runtime) est remplacé par le
 *     snapshot `const CARDS = [...]` et un démarrage direct.
 * Affiche le compte de cartes par section et échoue bruyamment si une section
 * attendue tombe à zéro, ou si data/ est invalide (valideDonnees).
 *
 * L'ancien parseur regex du carnet HTML (fonction de scrape retirée + les helpers
 * rowsOf/lisOf) a servi d'oracle de non-régression pour deriveCartes le temps de la
 * migration (chantier 2, tâche 7 : mode --verrou, VERROU OK avant suppression) puis
 * de pont pour les derniers lecteurs de HTML (verifie_exemples.js, cherche_mots.js,
 * ajoute_mots.js) — supprimé à la tâche 11, une fois ce dernier basculé sur data/
 * (voir task-11-report.md). Une partie des helpers reste : ils servent encore aux
 * scripts ponctuels de outils_migration/ (decoupe_carnet.js, extrait_donnees.js),
 * qui eux lisent toujours le carnet HTML — cf. leur propre en-tête pour pourquoi.
 *
 * Usage :
 *   node build.js           # régénère les quatre artefacts
 *   node build.js --check   # vérifie sans écrire (artefacts en phase avec data/ + src/ ?)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const gabarits = require('./src/carnet/gabarits.js');

const ROOT = __dirname;
const NOTEBOOK = path.join(ROOT, 'vocabulaire_hebreu.html');
const APP = path.join(ROOT, 'app.html');
const STANDALONE = path.join(ROOT, 'flashcards_hebreu.html');
const CARDS_JSON = path.join(ROOT, 'cards.json');
const SRC_CARNET = path.join(ROOT, 'src', 'carnet');
const SRC_APP = path.join(ROOT, 'src', 'app');

// Sections dont la disparition doit faire échouer le build (clé = catégorie des cartes).
const EXPECTED_CATS = ['Verbes','Verbes modaux','Adjectifs','Noms','Pronoms personnels','Démonstratifs',
  'Prépositions','Conjonctions','Mots interrogatifs','Nombres','Jours de la semaine','Adverbes','Saisons & mois',
  'Mots de quantité','Expressions','Existence','Phrases'];
// Niveaux CECRL (data-niveau du carnet) dont la disparition doit faire échouer le
// build — le carnet actuel n'a rien au-delà de B2 ; étendre quand il grandira.
const EXPECTED_LEVELS = ['A1','A2','B1','B2'];
// Thèmes sémantiques (data-theme du carnet, tables Noms/Adjectifs/Verbes
// uniquement — les listes n'en portent pas, déjà mono-thème par nature).
// ⚠️ Doit rester aligné sur la constante THEMES d'app.html (slugs identiques).
const EXPECTED_THEMES = ['famille-personnes','corps-sante','nourriture','maison-objets',
  'vetements-couleurs','ville-transport','nature','temps-calendrier','travail-etudes',
  'vie-quotidienne','argent-achats','loisirs-culture','communication-pensee',
  'emotions-caractere','abstrait'];
// Catégories où data-theme est obligatoire sur chaque entrée (même règle de
// couverture que data-niveau : tenue par l'outillage, pas par la discipline).
const THEMED_CATS = ['Noms','Adjectifs','Verbes'];
// Sections du carnet en <ul class="word-list"> → catégorie de carte. Au niveau
// module : ajoute_mots.js et deriveCartes() valident/lisent les labels de section
// contre cette table — une seule source côté Node (outils_migration/decoupe_carnet.js
// et extrait_donnees.js s'y réfèrent aussi, pour leur propre lecture du carnet HTML).
const listCats = { 'Pronoms personnels':'Pronoms personnels', 'Démonstratifs':'Démonstratifs',
  'Verbes modaux':'Verbes modaux',
  'Prépositions':'Prépositions', 'Conjonctions':'Conjonctions', 'Mots interrogatifs':'Mots interrogatifs',
  'Nombres (0–10)':'Nombres', 'Nombres (11 et plus)':'Nombres', 'Nombres ordinaux':'Nombres',
  'Jours de la semaine':'Jours de la semaine', 'Adverbes':'Adverbes', 'Saisons & mois':'Saisons & mois',
  'Mots de quantité':'Mots de quantité', 'Expressions / Divers':'Expressions',
  'Existence et possession':'Existence', 'Phrases':'Phrases' };

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

// ---------- helpers hébreu + lecture du carnet HTML (encore utiles à outils_migration/) ----------
function stripNikud(s){ return s.replace(/[֑-ׇ]/g, ''); }

// ---------- appariement ktiv male / ktiv haser ----------
// Un mot vocalisé s'écrit défectif (עִתּוֹן → « עתון » sans niqqud) mais se
// cherche plein (« עיתון ») : la comparaison exacte sur he_plain rate le couple
// et répond « absent » d'un mot présent — le sens dangereux (on insère alors un
// doublon). Règle mesurée sur les 1053 he_plain du carnet (SPEC_ECONOMIE_TOKENS
// §10.1) : A ~ B si l'un s'obtient de l'autre en n'INSÉRANT que des ו/י, forme
// courte ≥ 3 lettres, ≤ 2 insertions → 37 paires (3,5 %), toutes des
// quasi-homographes utiles (מלוח~מלח, עצוב~עצב). Les garde-fous ne sont pas
// décoratifs : sans eux לישן (dormir) s'apparie à לשון (langue) et יפה à פה.
const MATRES_LECTIONIS = ['ו', 'י'];
const ORTHO_MIN = 3;   // longueur de la forme courte, en dessous : trop de bruit
const ORTHO_MAX = 2;   // insertions tolérées

function orthographeVoisine(a, b){
  a = String(a || ''); b = String(b || '');
  if (!a || !b || a === b) return false;
  const court = a.length <= b.length ? a : b;
  const long  = a.length <= b.length ? b : a;
  const insertions = long.length - court.length;
  if (insertions < 1 || insertions > ORTHO_MAX) return false;
  if (court.length < ORTHO_MIN) return false;
  // Alignement exact (pas glouton) : on avance en parallèle, et l'on ne saute un
  // caractère du long que si c'est une mère de lecture.
  const aligne = (i, j) => {
    if (i === court.length) return long.slice(j).split('').every(ch => MATRES_LECTIONIS.includes(ch));
    if (j === long.length) return false;
    if (court[i] === long[j] && aligne(i + 1, j + 1)) return true;
    return MATRES_LECTIONIS.includes(long[j]) && aligne(i, j + 1);
  };
  return aligne(0, 0);
}

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

// ---------- data/ : chargement + validation (absorbé d'outils_migration/valide_donnees.js) ----------

function chargeDonnees(racine){
  const d = (f) => JSON.parse(fs.readFileSync(path.join(racine, 'data', f), 'utf8'));
  const listes = {};
  for (const f of fs.readdirSync(path.join(racine, 'data', 'listes')).sort())
    listes[f.replace(/\.json$/, '')] = d(path.join('listes', f));
  return { noms: d('noms.json'), adjectifs: d('adjectifs.json'), verbes: d('verbes.json'), listes };
}

// Garde de schéma (chantier 2, watch-item de revue de branche) : un champ .fr contenant
// de l'hébreu que le motif HEBREW_RUN de gabarits.js (escFr) ne capturerait pas
// entièrement produirait, une fois généré, de l'hébreu nu dans la prose française — sans
// lang="he" ni la taille 1.15em de la rampe typo (DESIGN.md §3, trap 6 de CLAUDE.md).
// ⚠️ Round 1 de revue (chantier 2) : la première version testait la sortie d'escFr()
// avec la MÊME classe de caractères qu'escFr() utilise pour wrapper (U+0591–U+05F4,
// copiée depuis HEBREW_RUN) — tautologique, ne pouvait jamais échouer (confirmé : runs
// adjacents, doubles espaces, ponctuation, injection <>, rien ne le faisait déclencher).
// Le détecteur ci-dessous est INDÉPENDANT du motif de wrappage : \p{Script=Hebrew} est
// la définition canonique Unicode, qui couvre aussi les formes de présentation
// U+FB1D–U+FB4F qu'HEBREW_RUN (calé sur le seul bloc principal) ne reconnaît pas — donc
// CETTE garde peut réellement échouer sur un caractère que gabarits.js laisserait nu.
// Preuve (sandbox, aucun caractère du dépôt) : avec fr = "avant " + String.fromCodePoint
// (0xFB4B) + " apres" (ligature vav+holam, formes de présentation), escFr(fr) laisse le
// caractère hors span et heNonWrappe(fr) renvoie true ; avec l'équivalent décomposé
// (bloc standard, 0x05D1+0x05B0) il renvoie false — voir task-7-report.md pour la
// sortie de commande complète.
const ANY_HEBREW = /\p{Script=Hebrew}/u;
function heNonWrappe(fr){
  const wrapped = gabarits.escFr(String(fr == null ? '' : fr));
  const sansSpans = wrapped.replace(/<span lang="he">[^<]*<\/span>/g, '');
  return ANY_HEBREW.test(sansSpans);
}

function valideDonnees(donnees){
  const echec = (ou, e, msg) => { throw new Error(`${ou} — « ${e.he || '?'} / ${e.fr || '?'} » : ${msg}`); };
  const commun = (ou, e, theme) => {
    if (!e.he || !e.fr) echec(ou, e, 'he/fr manquant');
    if (!EXPECTED_LEVELS.includes(e.niveau)) echec(ou, e, `niveau « ${e.niveau} » invalide`);
    if (theme){
      if (!EXPECTED_THEMES.includes(e.theme)) echec(ou, e, `theme « ${e.theme} » invalide`);
      if (!(e.exemples || []).length) echec(ou, e, 'aucun exemple');
    } else if (e.theme){
      // Piège 8 (CLAUDE.md) : les listes sont mono-thème par nature — un theme sur une
      // entrée de liste est une erreur. deriveCartes() ne le copie jamais dans la carte
      // dérivée (seules Noms/Adjectifs/Verbes le font), donc c'est ICI, sur la donnée
      // d'entrée, qu'il faut le repérer : une garde côté carte ne le verrait jamais
      // (revue de branche, chantier 2 — la garde `stray` de report() était devenue
      // structurellement inatteignable).
      echec(ou, e, `theme « ${e.theme} » interdit sur une entrée de liste (mono-thème par nature)`);
    }
    (e.exemples || []).forEach(x => { if (!x.he || !x.tr || !x.fr) echec(ou, e, 'exemple incomplet'); });
    if (heNonWrappe(e.fr)) echec(ou, e, 'hébreu du champ fr non entièrement capturé par le motif de wrappage des gabarits (HEBREW_RUN) — un fragment resterait affiché sans lang="he"');
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

// ---------- carnet : assemblage depuis src/carnet/ (absorbé d'outils_migration/genere_carnet.js) ----------

const ENTETE_GENERE =
  '<!-- FICHIER GÉNÉRÉ — ne pas éditer. Source : data/ + src/carnet/. Regénération : node build.js. -->';
const ENTETE_GENERE_APP =
  '<!-- FICHIER GÉNÉRÉ — ne pas éditer. Source : src/app/. Regénération : node build.js. -->';

// Insère l'en-tête juste après la première ligne du HTML (la ligne <!DOCTYPE html>).
// `entete` par défaut = ENTETE_GENERE (carnet) ; assembleApp() passe ENTETE_GENERE_APP.
function insereEntete(html, entete){
  entete = entete || ENTETE_GENERE;
  const finLigne = html.indexOf('\n');
  if (finLigne === -1){
    throw new Error('insereEntete: HTML sans retour à la ligne après la première ligne — insertion de l\'en-tête impossible');
  }
  return html.slice(0, finLigne + 1) + entete + '\n' + html.slice(finLigne + 1);
}

// Extrait le "cle" d'un placeholder <!-- @ENTREES:cle --> ; non gourmand pour
// s'arrêter au premier « -->» rencontré.
const PLACEHOLDER_RE = /<!-- @ENTREES:(.*?) -->/g;

/**
 * genereCarnet(donnees, srcCarnet) → chaîne HTML complète du carnet.
 * `donnees`   : { noms, adjectifs, verbes, listes } — forme de chargeDonnees().
 * `srcCarnet` : chemin absolu vers src/carnet (contient tete.html, pied.html,
 *               sections.json, sections/, carnet.css, carnet.js) ;
 *               src/tokens.css est lu un niveau au-dessus.
 * Garde anti-perte silencieuse : un placeholder qui ne consomme aucune entrée, ou une
 * entrée qu'aucun placeholder n'a consommée, est une erreur bloquante nommée — jamais
 * un carnet tronqué en silence.
 */
function genereCarnet(donnees, srcCarnet){
  const lire = (f) => fs.readFileSync(path.join(srcCarnet, f), 'utf8');
  const tete = lire('tete.html');
  const pied = lire('pied.html');
  const sectionsListees = JSON.parse(lire('sections.json'));
  const tokens = fs.readFileSync(path.join(srcCarnet, '..', 'tokens.css'), 'utf8');
  const cssCarnet = lire('carnet.css');
  const jsCarnet = lire('carnet.js');

  const corps = sectionsListees
    .map(f => fs.readFileSync(path.join(srcCarnet, 'sections', f), 'utf8'))
    .join('');

  let html = tete + corps + pied;
  // Remplacement par fonction (jamais par chaîne) : le contenu de tokens.css /
  // carnet.css / carnet.js peut contenir des séquences "$&", "$1"… que
  // String.prototype.replace interpréterait comme des motifs de substitution
  // si on lui passait une chaîne — la fonction insère le résultat au mot près.
  html = html.replace('<!-- @TOKENS -->', () => tokens);
  html = html.replace('<!-- @CSS:carnet -->', () => cssCarnet);
  html = html.replace('<!-- @JS:carnet -->', () => jsCarnet);

  // ---------- substitution des placeholders @ENTREES + garde anti-perte ----------

  const TABLES = {
    noms: { arr: donnees.noms, gabarit: gabarits.ligneNom },
    adjectifs: { arr: donnees.adjectifs, gabarit: gabarits.ligneAdjectif },
    verbes: { arr: donnees.verbes, gabarit: gabarits.ligneVerbe },
  };
  // indices consommés, par table / par slug de liste — sert la garde anti-perte
  const consommeesTable = { noms: new Set(), adjectifs: new Set(), verbes: new Set() };
  const consommeesListe = {}; // slug -> Set(indices)

  const vusPlaceholders = new Set();

  html = html.replace(PLACEHOLDER_RE, (m, cle) => {
    if (vusPlaceholders.has(cle)){
      throw new Error(`placeholder @ENTREES:${cle} apparaît plus d'une fois — cible ambiguë`);
    }
    vusPlaceholders.add(cle);

    if (cle.startsWith('listes/')){
      const reste = cle.slice('listes/'.length);
      const sepIdx = reste.indexOf('#');
      const slug = sepIdx === -1 ? reste : reste.slice(0, sepIdx);
      const groupe = sepIdx === -1 ? undefined : reste.slice(sepIdx + 1);

      const liste = donnees.listes[slug];
      if (!liste) throw new Error(`placeholder @ENTREES:${cle} — liste "${slug}" introuvable dans data/listes/`);
      if (!consommeesListe[slug]) consommeesListe[slug] = new Set();

      const indices = [];
      liste.entries.forEach((e, i) => {
        const consomme = groupe === undefined ? true : (e.groupe || '') === groupe;
        if (consomme) indices.push(i);
      });
      if (!indices.length){
        throw new Error(`placeholder @ENTREES:${cle} ne consomme aucune entrée (garde anti-perte) — vérifier le "groupe" attendu`);
      }
      indices.forEach(i => consommeesListe[slug].add(i));
      return indices.map(i => gabarits.itemListe(liste.entries[i])).join('\n');
    }

    const sepIdx = cle.indexOf('#');
    if (sepIdx === -1) throw new Error(`placeholder @ENTREES:${cle} — forme inconnue (attendu "table#groupe" ou "listes/slug[#groupe]")`);
    const table = cle.slice(0, sepIdx);
    const groupe = cle.slice(sepIdx + 1);

    const def = TABLES[table];
    if (!def) throw new Error(`placeholder @ENTREES:${cle} — table "${table}" inconnue (attendu noms/adjectifs/verbes)`);

    const indices = [];
    def.arr.forEach((e, i) => { if ((e.groupe || '') === groupe) indices.push(i); });
    if (!indices.length){
      throw new Error(`placeholder @ENTREES:${cle} ne consomme aucune entrée (garde anti-perte) — groupe "${groupe}" absent de data/${table}.json`);
    }
    indices.forEach(i => consommeesTable[table].add(i));
    return indices.map(i => def.gabarit(def.arr[i])).join('\n');
  });

  // Toute entrée qu'aucun placeholder n'a consommée = erreur bloquante nommée.
  for (const table of Object.keys(TABLES)){
    const arr = TABLES[table].arr;
    const vus = consommeesTable[table];
    if (vus.size !== arr.length){
      const idx = arr.findIndex((_, i) => !vus.has(i));
      const e = arr[idx];
      throw new Error(`garde anti-perte : ${vus.size}/${arr.length} entrées de data/${table}.json consommées par un placeholder — première orpheline #${idx} (« ${e.he} / ${e.fr} », groupe "${e.groupe}")`);
    }
  }
  for (const slug of Object.keys(donnees.listes)){
    const entries = donnees.listes[slug].entries;
    const vus = consommeesListe[slug] || new Set();
    if (vus.size !== entries.length){
      const idx = entries.findIndex((_, i) => !vus.has(i));
      const e = entries[idx];
      throw new Error(`garde anti-perte : ${vus.size}/${entries.length} entrées de data/listes/${slug}.json consommées par un placeholder — première orpheline #${idx} (« ${e.he} / ${e.fr} »)`);
    }
  }

  return insereEntete(html);
}

// ---------- data/ → cartes (remplace l'extraction regex dans le pipeline principal) ----------

// deriveCartes(donnees) : schéma de carte figé (cf. card schema, CLAUDE.md/ARCHITECTURE.md),
// même ordre d'insertion des propriétés d'un appel à l'autre — cards.json et le fichier
// autonome en dépendent pour rester stables d'un build à l'autre sans rien changer au
// contenu réel de data/.
function deriveCartes(donnees){
  const cards = [];
  const withPlain = (exs) => (exs || []).map(x => ({ he: x.he, tr: x.tr, fr: x.fr, he_plain: stripNikud(x.he) }));

  donnees.verbes.forEach(e => {
    const labels = ['il','elle','ils','elles'];
    const forms = (e.formes || []).map((f, i) => ({ he: f.he, tr: f.tr, label: labels[i], he_plain: stripNikud(f.he) }));
    const card = { cat: 'Verbes', he: e.he, tr: '', fr: '(infinitif) ' + e.fr, forms };
    if (e.niveau) card.niveau = e.niveau;
    if (e.theme) card.theme = e.theme;
    if ((e.exemples || []).length) card.exemples = withPlain(e.exemples);
    cards.push(card);
  });

  donnees.adjectifs.forEach(e => {
    const labels = ['f. sing.','m. plur.','f. plur.'];
    const forms = [];
    (e.formes || []).forEach((f, i) => { if (f.he) forms.push({ he: f.he, tr: f.tr, label: labels[i], he_plain: stripNikud(f.he) }); });
    const card = { cat: 'Adjectifs', he: e.he, tr: '', fr: e.fr, forms };
    if (e.niveau) card.niveau = e.niveau;
    if (e.theme) card.theme = e.theme;
    if ((e.exemples || []).length) card.exemples = withPlain(e.exemples);
    cards.push(card);
  });

  donnees.noms.forEach(e => {
    const genre = e.genre;
    const card = { cat: 'Noms', he: e.he, tr: '', fr: e.fr + ((genre === 'm' || genre === 'f') ? (' (' + genre + ')') : '') };
    if (genre === 'm' || genre === 'f') card.genre = genre;
    if (e.pluriel && e.pluriel.he) card.forms = [{ he: e.pluriel.he, tr: e.pluriel.tr, label: 'pluriel', he_plain: stripNikud(e.pluriel.he) }];
    if (e.niveau) card.niveau = e.niveau;
    if (e.theme) card.theme = e.theme;
    if ((e.exemples || []).length) card.exemples = withPlain(e.exemples);
    cards.push(card);
  });

  const listeParSection = {};
  Object.values(donnees.listes).forEach(l => { listeParSection[l.section] = l; });
  Object.keys(listCats).forEach(sec => {
    const liste = listeParSection[sec];
    // Une section de listCats absente de data/listes/ (l.section ne correspond à aucune
    // clé) : ni valideDonnees ni la garde anti-perte de genereCarnet ne valident l.section,
    // donc ni l'une ni l'autre n'attrape ce cas. Le vrai filet est plus loin : la section
    // "sec" tombe alors à zéro carte, et la garde EXPECTED_CATS de report() (« Sections
    // attendues sans aucune carte ») fait échouer le build en la nommant.
    if (!liste) return;
    liste.entries.forEach(e => {
      const card = { cat: listCats[sec], he: e.he, tr: e.tr, fr: e.fr_court || e.fr };
      if (e.note) card.note = e.note;
      if (e.niveau) card.niveau = e.niveau;
      if ((e.exemples || []).length) card.exemples = withPlain(e.exemples);
      cards.push(card);
    });
  });

  cards.forEach(c => { c.he_plain = stripNikud(c.he); });
  return cards;
}

// ---------- garde de forme des cartes dérivées ----------
// Remplace en partie ce que la suppression de l'ancien extracteur HTML et du --verrou a emporté
// (revue de branche, chantier 2) : `node build.js --check` compare des artefacts
// régénérés aux artefacts committés, donc il attrape « artefacts déphasés » mais jamais
// « deriveCartes est faux » — une dérivation modifiée suivie d'un rebuild passe tous les
// gates au vert puisque les committés seraient régénérés avec la même (mauvaise) logique.
// Cette garde teste la FORME de chaque carte dérivée, indépendamment de tout artefact
// committé, et nomme la carte fautive.
// Cardinalités mesurées sur data/ réel (1220 cartes, 24/07/2026) plutôt que supposées :
// Verbes → toujours 4 formes (il/elle/ils/elles), Adjectifs → toujours 3
// (f. sing./m. plur./f. plur.), Noms → 0 ou 1 (pluriel optionnel). tr === '' pour les
// trois tables (l'UI retombe sur he2tr(card.he) en son absence).
const ARITE_FORMES = { Verbes: n => n === 4, Adjectifs: n => n === 3, Noms: n => n === 0 || n === 1 };
function assertFormeCartes(cards){
  const echec = (c, msg) => {
    console.error('\n✗ carte mal formée (' + (c.cat || '?') + ' — « ' + (c.he || '?') + ' / ' + (c.fr || '?') + ' ») : ' + msg);
    process.exit(1);
  };
  cards.forEach(c => {
    if (!c.cat) echec(c, 'cat manquant');
    if (!c.he) echec(c, 'he manquant');
    if (!c.fr) echec(c, 'fr manquant');
    if (!c.he_plain) echec(c, 'he_plain manquant');
    if (THEMED_CATS.includes(c.cat) && c.tr !== '') echec(c, `tr devrait être '' pour une carte de table, trouvé « ${c.tr} »`);
    const arite = ARITE_FORMES[c.cat];
    if (arite){
      const n = (c.forms || []).length;
      if (!arite(n)) echec(c, `nombre de formes inattendu pour ${c.cat} (${n})`);
    }
  });
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
  // Garde de couverture des niveaux, sur le modèle de la règle de couverture des
  // exemples tenue par verifie_exemples.js. Le garde-fou ci-dessus n'échoue que si un
  // niveau ENTIER disparaît : un mot ajouté sans data-niveau passait donc en silence,
  // et l'appli, qui laisse volontairement les cartes non classées franchir tous les
  // filtres, l'aurait montré jusque dans « Facile » sans que rien ne le signale.
  // La couverture est à 100 % depuis le 19/07 — ceci la rend tenue par l'outillage
  // plutôt que vraie par chance. (La tolérance de l'appli reste, comme filet.)
  const unclassified = cards.filter(c => !c.niveau);
  console.log('  ' + 'couverture'.padEnd(lw) + '  ' +
    (cards.length - unclassified.length) + '/' + cards.length);
  if (unclassified.length){
    console.error('\n✗ ' + unclassified.length + ' carte(s) sans data-niveau :');
    unclassified.slice(0, 15).forEach(c => console.error('    ' + c.cat + ' — ' + c.he + ' (' + c.fr + ')'));
    if (unclassified.length > 15) console.error('    … et ' + (unclassified.length - 15) + ' autre(s)');
    console.error('  Chaque entrée du carnet doit porter data-niveau="A1"…"C2".');
    process.exit(1);
  }

  // Thèmes sémantiques : mêmes garde-fous que les niveaux — couverture 100 %
  // sur les trois tables (un mot ajouté sans data-theme échoue en le nommant)
  // et slugs verrouillés (une faute de frappe créerait un thème fantôme,
  // invisible dans l'appli sous son vrai libellé).
  // (Le theme parasite sur une entrée de liste n'est PAS testé ici : deriveCartes()
  // ne le copie jamais dans la carte dérivée, donc une garde sur les cartes ne pourrait
  // jamais déclencher — revue de branche, chantier 2. Il est repéré plus tôt, sur la
  // donnée d'entrée, dans valideDonnees().)
  const themes = {};
  cards.forEach(c => { if (c.theme) themes[c.theme] = (themes[c.theme] || 0) + 1; });
  if (Object.keys(themes).length){
    console.log('\nThèmes (data-theme) :');
    const tw = Math.max(...Object.keys(themes).map(k => k.length), 'couverture'.length);
    Object.keys(themes).sort((a, b) => themes[b] - themes[a]).forEach(k => {
      console.log('  ' + k.padEnd(tw) + '  ' + themes[k]);
    });
    const themedPool = cards.filter(c => THEMED_CATS.includes(c.cat));
    const themeless = themedPool.filter(c => !c.theme);
    console.log('  ' + 'couverture'.padEnd(tw) + '  ' +
      (themedPool.length - themeless.length) + '/' + themedPool.length + ' (tables Noms/Adjectifs/Verbes)');
    if (themeless.length){
      console.error('\n✗ ' + themeless.length + ' carte(s) des tables sans data-theme :');
      themeless.slice(0, 15).forEach(c => console.error('    ' + c.cat + ' — ' + c.he + ' (' + c.fr + ')'));
      if (themeless.length > 15) console.error('    … et ' + (themeless.length - 15) + ' autre(s)');
      console.error('  Chaque entrée des tables Noms/Adjectifs/Verbes doit porter data-theme="…" (voir EXPECTED_THEMES).');
      process.exit(1);
    }
    const badThemes = Object.keys(themes).filter(k => !EXPECTED_THEMES.includes(k));
    if (badThemes.length){
      console.error('\n✗ Thème(s) hors taxonomie : ' + badThemes.join(', '));
      console.error('  (faute de frappe dans un data-theme ? nouveau thème → l\'ajouter à EXPECTED_THEMES ici ET à THEMES dans src/app/js/00-tout.js.)');
      process.exit(1);
    }
  }

  // Synchronisation de la taxonomie entre les deux fichiers : voir verifieTaxonomieApp()
  // (chantier 3, tâche 13 — sortie de report() pour s'exercer sur l'app.html FRAÎCHEMENT
  // ASSEMBLÉE en mémoire, jamais sur le disque : app.html n'est plus une source).

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

// ---------- app.html : assemblage depuis src/app/ (chantier 3, tâche 13) ----------

/**
 * assembleApp(srcApp) → chaîne HTML complète d'app.html, SANS l'en-tête
 * « FICHIER GÉNÉRÉ » (celui-ci reste la responsabilité de l'appelant — insereEntete()
 * — pour que generateStandalone() puisse dériver du même contenu brut et poser son
 * propre en-tête distinct sans en empiler deux, cf. task-13-brief.md § Couture B).
 * `srcApp` : chemin absolu vers src/app (contient coquille.html, css/, js/, ordre.json) ;
 * src/tokens.css est lu un niveau au-dessus, comme pour le carnet (genereCarnet).
 */
function assembleApp(srcApp){
  const lire = (f) => fs.readFileSync(path.join(srcApp, f), 'utf8');
  const coquille = lire('coquille.html');
  const ordre = JSON.parse(lire('ordre.json'));

  // Garde d'orphelin entre src/app/ordre.json et le contenu réel de src/app/js/ (round de
  // correction Task 13, minor 2) : sans elle, un fichier retiré de l'un des deux sans toucher
  // l'autre est omis du build EN SILENCE — soit ordre.json pointe sur un module qui n'existe
  // plus, soit un nouveau module JS traîne dans le dossier sans jamais être concaténé. Les deux
  // sens sont vérifiés séparément pour nommer le fichier fautif, pas un diff vague.
  const jsDir = path.join(srcApp, 'js');
  const jsSurDisque = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  const manquants = ordre.js.filter(f => !jsSurDisque.includes(f));
  if (manquants.length){
    console.error('\n✗ src/app/ordre.json (clé js) liste des fichiers absents de src/app/js/ : ' + manquants.join(', '));
    console.error('  (fichier renommé ou supprimé sans mettre ordre.json à jour ?)');
    process.exit(1);
  }
  const orphelins = jsSurDisque.filter(f => !ordre.js.includes(f));
  if (orphelins.length){
    console.error('\n✗ Fichier(s) dans src/app/js/ absent(s) de src/app/ordre.json (clé js) : ' + orphelins.join(', '));
    console.error('  (nouveau module JS ajouté sans l\'inscrire dans ordre.json ? il serait omis du build en silence.)');
    process.exit(1);
  }

  // Même garde d'orphelin, côté src/app/css/ (Task 14 : le CSS monolithique app.css est
  // scindé en 6 fragments cascadés par ordre.json/css). Symétrique à la garde JS ci-dessus,
  // pour la même raison : un fragment retiré du dossier sans toucher ordre.json, ou l'inverse,
  // serait sinon omis du CSS servi EN SILENCE.
  const cssDir = path.join(srcApp, 'css');
  const cssSurDisque = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
  const cssManquants = ordre.css.filter(f => !cssSurDisque.includes(f));
  if (cssManquants.length){
    console.error('\n✗ src/app/ordre.json (clé css) liste des fichiers absents de src/app/css/ : ' + cssManquants.join(', '));
    console.error('  (fichier renommé ou supprimé sans mettre ordre.json à jour ?)');
    process.exit(1);
  }
  const cssOrphelins = cssSurDisque.filter(f => !ordre.css.includes(f));
  if (cssOrphelins.length){
    console.error('\n✗ Fichier(s) dans src/app/css/ absent(s) de src/app/ordre.json (clé css) : ' + cssOrphelins.join(', '));
    console.error('  (nouveau fragment CSS ajouté sans l\'inscrire dans ordre.json ? il serait omis du build en silence.)');
    process.exit(1);
  }

  // Séparateur explicite entre modules JS (round de correction Task 13, minor 1) : dès que
  // ordre.json liste plusieurs fichiers, un module sans retour à la ligne final collerait
  // sinon au suivant. Sans effet sur le cas actuel à un seul fichier — join() ne pose un
  // séparateur qu'ENTRE éléments, jamais après le dernier ni avant le seul.
  const jsApp = ordre.js.map(f => fs.readFileSync(path.join(jsDir, f), 'utf8')).join('\n');
  // CSS : concaténation SANS séparateur (contrairement au JS ci-dessus). Les 6 fragments sont
  // des coupures pures aux frontières de lignes de l'ancien app.css (Task 14, un octet ne
  // change pas) : chacun se termine déjà par le \n exact de la coupure d'origine, donc join('')
  // reproduit l'original au caractère près — un join('\n') ajouterait une ligne vide à chacune
  // des 5 frontières et romprait l'identité byte-à-byte avec l'app.html committé.
  const cssApp = ordre.css.map(f => fs.readFileSync(path.join(cssDir, f), 'utf8')).join('');
  const tokens = fs.readFileSync(path.join(srcApp, '..', 'tokens.css'), 'utf8');

  // Piège d'indentation (résolu à l'assemblage, jamais en éditant app.html — task-13-brief.md
  // § Arbitrages) : le :root d'app.html est imbriqué dans <style> avec 2 espaces de plus que
  // src/tokens.css (qui pose ":root{" à la racine — cf. vocabulaire_hebreu.html, où ça matche
  // tel quel car le carnet pose son :root à la racine aussi). On réindente donc tokens.css de
  // 2 espaces ici, spécifiquement pour l'app.
  const tokensIndentes = tokens.split('\n').map(l => l ? '  ' + l : l).join('\n');

  let html = coquille;
  // Remplacement par fonction (jamais par chaîne) : le contenu de tokens.css / app.css /
  // 00-tout.js peut contenir des séquences "$&", "$1"… que String.prototype.replace
  // interpréterait comme des motifs de substitution si on lui passait une chaîne — la
  // fonction insère le résultat au caractère près (même remarque que genereCarnet).
  // Les trois substitutions passent par mustReplace (round de correction Task 13, finding
  // Important) : sans garde, un marqueur retiré de coquille.html (@CSS:app en tête, éprouvé
  // par le relecteur) fait tomber le CSS ou le :root en silence — app.html "régénère" quand
  // même, plus petit de plusieurs dizaines de Ko, et --check repasse vert sur l'artefact cassé.
  html = mustReplace(html, '<!-- @TOKENS -->', () => tokensIndentes,
    'marqueur <!-- @TOKENS --> absent (le bloc :root/charte serait perdu, en silence)',
    'src/app/coquille.html');
  html = mustReplace(html, '<!-- @CSS:app -->', () => cssApp,
    'marqueur <!-- @CSS:app --> absent (tout le CSS d\'app.html serait perdu, en silence)',
    'src/app/coquille.html');
  html = mustReplace(html, '<!-- @JS:app -->', () => jsApp,
    'marqueur <!-- @JS:app --> absent (tout le JS d\'app.html serait perdu, en silence)',
    'src/app/coquille.html');
  return html;
}

/**
 * verifieTaxonomieApp(appSource) — garde de synchronisation de la taxonomie entre les
 * deux fichiers. EXPECTED_THEMES ici et THEMES dans app.html décrivent la même liste de
 * slugs, mais rien ne les reliait mécaniquement avant le 21/07 (relevé en traçant le pont
 * entre les deux extracteurs, alors encore l'un DOM l'autre regex, dans le graphe). Un
 * thème ajouté d'un seul côté passait donc au vert — slug accepté au build mais aucune
 * pastille dans l'appli, ou l'inverse, une pastille qui ne filtre rien. Seuls les slugs
 * sont comparés ; les libellés restent libres côté app.
 * `appSource` : la chaîne HTML d'app.html FRAÎCHEMENT ASSEMBLÉE (assembleApp()) — jamais
 * lue du disque : depuis la tâche 13, app.html est un artefact généré, et --check (qui
 * n'écrit rien) validerait un déphasage s'il comparait à l'ancien app.html du disque.
 * Fatale (process.exit(1)) — exercée en mode normal comme en --check, cf. main().
 */
function verifieTaxonomieApp(appSource){
  const appThemes = (() => {
    const i = appSource.indexOf('const THEMES = [');
    if (i === -1) return null;
    const end = appSource.indexOf('];', i);
    if (end === -1) return null;
    return [...appSource.slice(i, end).matchAll(/key\s*:\s*'([^']+)'/g)].map(m => m[1]);
  })();
  if (!appThemes){
    console.error('\n✗ Constante THEMES introuvable dans app.html assemblé (renommée ? reformatée ?).');
    console.error('  Ce garde-fou compare la taxonomie des deux fichiers ; il ne peut plus le faire.');
    process.exit(1);
  }
  const onlyBuild = EXPECTED_THEMES.filter(t => !appThemes.includes(t));
  const onlyApp   = appThemes.filter(t => !EXPECTED_THEMES.includes(t));
  if (onlyBuild.length || onlyApp.length){
    console.error('\n✗ Taxonomie désynchronisée entre build.js et app.html :');
    if (onlyBuild.length) console.error('    EXPECTED_THEMES (build.js) seul : ' + onlyBuild.join(', '));
    if (onlyApp.length)   console.error('    THEMES (app.html) seul        : ' + onlyApp.join(', '));
    console.error('  Un nouveau thème doit être ajouté aux DEUX listes (mêmes slugs).');
    process.exit(1);
  }
  console.log('\nTaxonomie : ' + EXPECTED_THEMES.length + ' thèmes, build.js et app.html en phase.');
}

// ---------- génération du fichier autonome depuis l'app assemblée ----------
// `fichier` (optionnel, défaut 'app.html') : où l'auteur doit aller corriger — assembleApp()
// passe 'src/app/coquille.html' pour ses trois marqueurs (round de correction Task 13,
// finding Important : les trois substitutions n'étaient gardées par rien avant ce round).
function mustReplace(src, from, to, what, fichier){
  fichier = fichier || 'app.html';
  const out = typeof from === 'string' ? src.replace(from, to) : src.replace(from, to);
  if (out === src){
    console.error('✗ Point d\'ancrage introuvable dans ' + fichier + ' : ' + what);
    process.exit(1);
  }
  return out;
}

// `appSource` : l'app FRAÎCHEMENT ASSEMBLÉE en mémoire (assembleApp()), SANS l'en-tête
// « FICHIER GÉNÉRÉ » d'app.html — jamais lue du disque (tâche 13 : sinon --check, qui
// n'écrit rien, dériverait le standalone de l'ancien app.html et validerait un déphasage ;
// et l'en-tête d'app.html s'empilerait avec celui posé juste dessous par ce mustReplace).
function generateStandalone(cards, appSource){
  let out = appSource;

  out = mustReplace(out, '<!DOCTYPE html>',
    '<!DOCTYPE html>\n<!-- FICHIER GÉNÉRÉ par `node build.js` depuis app.html + vocabulaire_hebreu.html — ne pas éditer à la main. -->',
    'doctype');

  // La couche PWA n'a aucun sens hors ligne : on n'installe pas une application depuis un
  // file://, et ces deux liens y étaient déjà morts avant la CSP. Celle-ci n'a fait que les
  // rendre visibles : en file:// l'origine est opaque, donc 'self' ne matche plus rien et le
  // navigateur les refuse bruyamment. On retire la cause plutôt que d'assouplir la règle.
  out = mustReplace(out, '<link rel="manifest" href="manifest.webmanifest">\n',
    '', 'link rel=manifest');
  out = mustReplace(out, '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n',
    '', 'link rel=apple-touch-icon');

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
  ['fetch(', 'DOMParser'].forEach(tok => {
    if (out.includes(tok)){
      console.error('✗ Le fichier généré contient encore « ' + tok + ' » — marqueurs BUILD:ONLINE-ONLY déplacés ?');
      process.exit(1);
    }
  });

  // Même garde pour la couche PWA : une ressource locale qui repasserait dans le fichier
  // autonome serait bloquée par la CSP en file:// (origine opaque), sans bruit côté build.
  ['manifest.webmanifest', 'apple-touch-icon'].forEach(tok => {
    if (out.includes(tok)){
      console.error('✗ Le fichier généré contient encore « ' + tok + ' » — couche PWA non retirée ?');
      process.exit(1);
    }
  });
  return out;
}

function main(){
  const argv = process.argv.slice(2);
  const check = argv.includes('--check');

  let donnees;
  try {
    donnees = chargeDonnees(ROOT);
    valideDonnees(donnees);
  } catch (e) {
    console.error('✗ données invalides (data/) : ' + e.message);
    process.exit(1);
  }

  const notebookGenerated = genereCarnet(donnees, SRC_CARNET);
  const cards = deriveCartes(donnees);
  assertFormeCartes(cards);
  console.log('Cartes dérivées de data/ :');
  report(cards);

  // assembleApp() s'exécute AVANT generateStandalone() : celui-ci se dérive de l'app
  // fraîchement assemblée, jamais de l'ancien app.html du disque (task-13-brief.md § Step 2).
  const appAssembled = assembleApp(SRC_APP);
  verifieTaxonomieApp(appAssembled); // fatale — exercée en mode normal comme en --check
  const appGenerated = insereEntete(appAssembled, ENTETE_GENERE_APP);

  const standaloneGenerated = generateStandalone(cards, appAssembled);
  const cardsJson = JSON.stringify({ version: new Date().toISOString().slice(0, 10), cartes: cards }, null, 2) + '\n';

  const notebookOnDisk = fs.existsSync(NOTEBOOK) ? fs.readFileSync(NOTEBOOK, 'utf8') : '';
  const appOnDisk = fs.existsSync(APP) ? fs.readFileSync(APP, 'utf8') : '';
  const standaloneOnDisk = fs.existsSync(STANDALONE) ? fs.readFileSync(STANDALONE, 'utf8') : '';
  const cardsOnDiskRaw = fs.existsSync(CARDS_JSON) ? fs.readFileSync(CARDS_JSON, 'utf8') : '';
  let cardsOnDiskCartes = null;
  if (cardsOnDiskRaw){
    try { cardsOnDiskCartes = JSON.parse(cardsOnDiskRaw).cartes; } catch (e) { cardsOnDiskCartes = null; }
  }
  // Comparaison de contenu (jamais la « version » — la date du jour du build changerait
  // seule, sans rien dire sur data/ — --check doit rester stable d'un jour à l'autre).
  const cardsContentUpToDate = JSON.stringify(cardsOnDiskCartes) === JSON.stringify(cards);

  if (check){
    // --check compare désormais les QUATRE artefacts régénérés aux committés (chantier 3,
    // tâche 13 : app.html rejoint vocabulaire_hebreu.html/cards.json/flashcards_hebreu.html).
    let ok = true;
    if (notebookGenerated !== notebookOnDisk){
      console.error('\n✗ vocabulaire_hebreu.html obsolète — lance `node build.js` pour le régénérer.');
      ok = false;
    }
    if (!cardsContentUpToDate){
      console.error('\n✗ cards.json obsolète (cartes) — lance `node build.js` pour le régénérer.');
      ok = false;
    }
    if (appGenerated !== appOnDisk){
      console.error('\n✗ app.html obsolète — lance `node build.js` pour le régénérer.');
      ok = false;
    }
    if (standaloneGenerated !== standaloneOnDisk){
      console.error('\n✗ flashcards_hebreu.html obsolète — lance `node build.js` pour le régénérer.');
      ok = false;
    }
    if (ok) console.log('\n✓ vocabulaire_hebreu.html, cards.json, app.html et flashcards_hebreu.html en phase avec data/ + src/.');
    else process.exit(1);
    return;
  }

  if (notebookGenerated === notebookOnDisk){
    console.log('\n✓ vocabulaire_hebreu.html déjà à jour.');
  } else {
    fs.writeFileSync(NOTEBOOK, notebookGenerated);
    // Bogue corrigé en absorbant (revue de branche) : .length compte des unités UTF-16,
    // pas des octets — Buffer.byteLength donne le vrai compte, celui que le mot « octets »
    // promet (fichier UTF-8 chargé de nikoud, l'écart n'est pas anecdotique).
    console.log('\n✓ vocabulaire_hebreu.html régénéré (' + Buffer.byteLength(notebookGenerated, 'utf8') + ' octets).');
  }

  if (cardsContentUpToDate){
    console.log('✓ cards.json déjà à jour (contenu inchangé, version conservée).');
  } else {
    fs.writeFileSync(CARDS_JSON, cardsJson);
    console.log('✓ cards.json régénéré (' + cards.length + ' cartes).');
  }

  if (appGenerated === appOnDisk){
    console.log('✓ app.html déjà à jour.');
  } else {
    fs.writeFileSync(APP, appGenerated);
    console.log('✓ app.html régénéré (' + Buffer.byteLength(appGenerated, 'utf8') + ' octets).');
  }

  if (standaloneGenerated === standaloneOnDisk){
    console.log('✓ flashcards_hebreu.html déjà à jour.');
  } else {
    fs.writeFileSync(STANDALONE, standaloneGenerated);
    console.log('✓ flashcards_hebreu.html régénéré (' + cards.length + ' cartes).');
  }
}

// Réutilisable en module : chargeDonnees/valideDonnees/genereCarnet/deriveCartes sont
// l'API v2 du build — verifie_exemples.js, cherche_mots.js et ajoute_mots.js s'appuient
// dessus (tâches 10-11, chantier 2). Le parseur regex de vocabulaire_hebreu.html
// (fonction de scrape + rowsOf/lisOf) a servi d'oracle de non-régression puis de pont
// pour ces trois scripts ; supprimé à la tâche 11, une fois le dernier (ajoute_mots.js) basculé.
// Les helpers HTML restants (parseSections, closeOf, exemplesOf, firstSpanText, attrOf,
// tdsOf, decodeEntities, listCats) restent exportés : outils_migration/decoupe_carnet.js
// et extrait_donnees.js, scripts ponctuels du chantier 1, lisent toujours le carnet HTML.
// Jamais de troisième parseur, jamais de constante dupliquée.
module.exports = { NOTEBOOK, APP, CARDS_JSON,
  parseSections, closeOf, exemplesOf, firstSpanText, attrOf, tdsOf,
  stripNikud, decodeEntities, orthographeVoisine,
  EXPECTED_CATS, EXPECTED_LEVELS, EXPECTED_THEMES, THEMED_CATS, listCats,
  chargeDonnees, valideDonnees, genereCarnet, deriveCartes, assertFormeCartes };
if (require.main === module) main();
