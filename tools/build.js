#!/usr/bin/env node
/*
 * build.js — outil de développement (non déployé). v2 (chantier 2) : data/*.json
 * (source de vérité) devient l'ENTRÉE du build, plus jamais vocabulaire_hebreu.html.
 *
 * Régénère CINQ artefacts depuis data/ + src/carnet/ + src/app/ + src/portail/ (chantier 3,
 * tâche 13 : app.html a rejoint le carnet côté « généré » ; chantier 4, tâche 18 : index.html
 * à son tour — plus AUCUN fichier HTML déployé ne s'édite à la main) :
 *   - vocabulaire_hebreu.html (le carnet)      via genereCarnet()   (gabarits.js)
 *   - cards.json ({version, cartes})           via deriveCartes()
 *   - app.html (les flashcards en ligne)       via assembleApp() depuis src/app/
 *     (coquille.html + css/*.css et js/*.js dans l'ordre de ordre.json + src/tokens.css)
 *   - flashcards_hebreu.html (version autonome) via generateStandalone(cards, appAssemble),
 *     inchangé sur le fond : dérivé de l'app FRAÎCHEMENT ASSEMBLÉE (jamais de l'ancien
 *     app.html du disque — sinon --check, qui n'écrit rien, validerait un déphasage), dont
 *     le bloc marqué BUILD:ONLINE-ONLY (fetch + extraction runtime) est remplacé par le
 *     snapshot `const CARDS = [...]` et un démarrage direct.
 *   - index.html (le portail)                  via assemblePortail() depuis src/portail/
 *     (index.html + src/tokens.css injecté au marqueur @TOKENS). Les trois pages déployées
 *     tirent donc leur bloc :root de la MÊME source — le piège n°5 (charte recopiée à la
 *     main) est clos par construction depuis la tâche 18.
 * Puis il ESTAMPILLE la ligne `const VERSION` de sw.js avec un hash des cinq artefacts +
 * manifest.webmanifest (chantier 4, tâche 19 : le bump manuel du piège n°10 est aboli ;
 * sw.js reste écrit à la main, cette seule ligne excepté). Détail et pièges de la liste
 * de hachage au § « estampille » plus bas.
 *
 * Affiche le compte de cartes par section et échoue bruyamment si une section
 * attendue tombe à zéro, ou si data/ est invalide (valideDonnees).
 *
 * Le build n'a plus AUCUN lecteur de HTML. L'ancien parseur regex du carnet a servi
 * d'oracle de non-régression pour deriveCartes le temps de la migration (chantier 2,
 * tâche 7 : mode --verrou, VERROU OK avant suppression) puis de pont pour les derniers
 * lecteurs de HTML (verifie_exemples.js, cherche_mots.js, ajoute_mots.js) — supprimé à
 * la tâche 11, une fois ce dernier basculé sur data/. Ses derniers helpers ne servaient
 * plus qu'aux scripts jetables d'outils_migration/, dossier supprimé au Task 20 : ils
 * sont partis avec lui (git en garde l'état). Le HTML ne fait plus que SORTIR d'ici.
 *
 * Usage :
 *   node tools/build.js           # régénère les cinq artefacts + estampille VERSION dans sw.js
 *   node tools/build.js --check   # vérifie sans écrire (artefacts en phase avec data/ + src/ ?
 *                                 #   et VERSION de sw.js égale au hash du contenu servi ?)
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const gabarits = require('../src/carnet/gabarits.js');

// ⚠️ Les scripts vivent dans tools/, la racine du dépôt est donc le dossier parent
// (chantier 4, Task 17). Les quatre outils partagent cette convention : `ROOT` n'est
// JAMAIS `__dirname`. Corollaire : tout ce qui recopie ces scripts ailleurs doit
// reproduire la disposition `tools/` — voir `sandboxValidation` d'ajoute_mots.js.
const ROOT = path.join(__dirname, '..');
const NOTEBOOK = path.join(ROOT, 'vocabulaire_hebreu.html');
const APP = path.join(ROOT, 'app.html');
const STANDALONE = path.join(ROOT, 'flashcards_hebreu.html');
const CARDS_JSON = path.join(ROOT, 'cards.json');
const SRC_CARNET = path.join(ROOT, 'src', 'carnet');
const SRC_APP = path.join(ROOT, 'src', 'app');
const INDEX = path.join(ROOT, 'index.html');
const SRC_PORTAIL = path.join(ROOT, 'src', 'portail');
const TOKENS = path.join(ROOT, 'src', 'tokens.css');
const SW = path.join(ROOT, 'sw.js');

// Sections dont la disparition doit faire échouer le build (clé = catégorie des cartes).
const EXPECTED_CATS = ['Verbes','Verbes modaux','Adjectifs','Noms','Pronoms personnels','Démonstratifs',
  'Comparatif et superlatif','Tournures impersonnelles','Impératif',
  'Prépositions','Prépositions fléchies','Conjonctions','Connecteurs du discours','Mots interrogatifs','Nombres','Jours de la semaine','Heure et date','Adverbes','Saisons & mois',
  'Mots de quantité','Expressions','Existence','Phrases','Hébreu parlé'];
// Niveaux CECRL (data-niveau du carnet) dont la disparition doit faire échouer le
// build — étendre quand le carnet grandira. C1 ouvert le 2026-07-27 avec le lot
// « mortier grammatical » : l'app n'a rien demandé (07-filtres.js range déjà C1
// dans la puce « Difficile »), seule cette constante verrouillait le palier.
// ⚠️ Un niveau listé ici SANS aucune carte fait échouer le build (garde
// `missingLevels`) : n'ajoute jamais un palier avant les mots qui le peuplent.
const EXPECTED_LEVELS = ['A1','A2','B1','B2','C1'];
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
// contre cette table — une seule source côté Node, ici et nulle part ailleurs.
const listCats = { 'Pronoms personnels':'Pronoms personnels', 'Démonstratifs':'Démonstratifs',
  'Verbes modaux':'Verbes modaux', 'Comparatif et superlatif':'Comparatif et superlatif',
  'Tournures impersonnelles':'Tournures impersonnelles', 'Impératif':'Impératif',
  'Prépositions':'Prépositions', 'Prépositions fléchies':'Prépositions fléchies', 'Conjonctions':'Conjonctions',
  'Connecteurs du discours':'Connecteurs du discours', 'Mots interrogatifs':'Mots interrogatifs',
  'Nombres (0–10)':'Nombres', 'Nombres (11 et plus)':'Nombres', 'Nombres ordinaux':'Nombres',
  'Nombres — fractions et multiplicatifs':'Nombres',
  'Jours de la semaine':'Jours de la semaine', 'Heure et date':'Heure et date', 'Adverbes':'Adverbes', 'Saisons & mois':'Saisons & mois',
  'Mots de quantité':'Mots de quantité', 'Expressions / Divers':'Expressions',
  'Existence et possession':'Existence', 'Phrases':'Phrases', 'Hébreu parlé':'Hébreu parlé' };

// ---------- helpers hébreu ----------
// Plus aucun lecteur de HTML ici : le mini-parseur du carnet (decodeEntities, textContent,
// firstSpanText, blocksOf, parseSections, closeOf, exemplesOf, attrOf, tdsOf) ne servait
// plus qu’aux scripts jetables d’outils_migration/ ; il est parti avec ce dossier au
// Task 20. Le build ÉCRIT du HTML, il n’en relit jamais — si le besoin revenait, le
// reprendre dans git (dernier état : commit du Task 19) plutôt qu’en improviser un autre.
function stripNikud(s){ return s.replace(/[֑-ׇ]/g, ''); }

// ---------- appariement ktiv male / ktiv haser ----------
// Un mot vocalisé s'écrit défectif (עִתּוֹן → « עתון » sans niqqud) mais se
// cherche plein (« עיתון ») : la comparaison exacte sur he_plain rate le couple
// et répond « absent » d'un mot présent — le sens dangereux (on insère alors un
// doublon). Règle mesurée sur les he_plain du carnet : A ~ B si l'un s'obtient de l'autre en n'INSÉRANT que des ו/י, forme
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

// ---------- data/ : chargement + validation (absorbé de valide_donnees.js, chantier 2) ----------

// Énumération de data/ — UNE seule place. chargeDonnees() (ici) et
// construitIndexFichiers() (cherche_mots.js) portaient chacun leur propre
// readdirSync de data/listes/ : deux endroits à corriger le jour où
// l'arborescence bouge, et rien pour signaler l'oubli du second. Les deux
// helpers sont exportés ; aucun autre outil n'énumère data/ de son côté.
function fichiersListes(racine){
  return fs.readdirSync(path.join(racine, 'data', 'listes')).sort();
}
// Les fichiers de contenu, en chemins relatifs à la racine et dans l'ordre de
// lecture (tables d'abord, puis les listes triées) — ce que consomme un outil
// qui veut parcourir la source, pas la charger.
function fichiersDonnees(racine){
  return ['data/noms.json', 'data/adjectifs.json', 'data/verbes.json']
    .concat(fichiersListes(racine).map(f => 'data/listes/' + f));
}

// ---------- fonctions de l'app, chargées depuis leur MODULE SOURCE ----------
// verifie_exemples.js et ajoute_mots.js ont besoin de he2tr / trKey / editDist
// pour rester d'accord avec l'appli au caractère près. Ils les prenaient dans
// app.html — un ARTEFACT : c'était le dernier endroit du dépôt où une SORTIE du
// build servait d'ENTRÉE, donc les outils ne tournaient pas sur un clone frais
// tant qu'un premier build n'avait pas eu lieu. La source est
// src/app/js/02-translitteration.js, que assembleApp() concatène tel quel.
//
// Le module est déclaré « logique pure » par son en-tête `// Expose :` et ne
// contient que des déclarations de fonctions (aucune instruction de haut
// niveau, aucun accès au DOM) : on l'évalue donc EN ENTIER dans un bac vm.
// C'est ce qui permet de supprimer l'extracteur textuel `grabFunction` que les
// deux outils portaient chacun de son côté, mot pour mot — un découpage à
// l'accolade est fragile là où un `runInContext` est exact.
// ⚠️ Si ce module cessait d'être pur (un `document.` y suffirait), l'appel
// ci-dessous échouerait bruyamment ici plutôt que silencieusement plus loin.
const MODULE_TRANSLIT = path.join('src', 'app', 'js', '02-translitteration.js');

function fonctionsApp(noms, racine){
  const fichier = path.join(racine || ROOT, MODULE_TRANSLIT);
  const bac = {};
  vm.createContext(bac);
  vm.runInContext(fs.readFileSync(fichier, 'utf8'), bac);
  const sortie = {};
  for (const nom of noms){
    if (typeof bac[nom] !== 'function')
      throw new Error('fonction « ' + nom + ' » introuvable dans ' + MODULE_TRANSLIT
        + ' (renommée, déplacée dans un autre module, ou module devenu impur ?)');
    sortie[nom] = bac[nom];
  }
  return sortie;
}

function chargeDonnees(racine){
  const d = (f) => JSON.parse(fs.readFileSync(path.join(racine, 'data', f), 'utf8'));
  const listes = {};
  for (const f of fichiersListes(racine))
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

// ---------- carnet : assemblage depuis src/carnet/ (absorbé de genere_carnet.js, chantier 2) ----------

const ENTETE_GENERE =
  '<!-- FICHIER GÉNÉRÉ — ne pas éditer. Source : data/ + src/carnet/. Regénération : node tools/build.js. -->';
const ENTETE_GENERE_APP =
  '<!-- FICHIER GÉNÉRÉ — ne pas éditer. Source : src/app/. Regénération : node tools/build.js. -->';
const ENTETE_GENERE_PORTAIL =
  '<!-- FICHIER GÉNÉRÉ — ne pas éditer. Source : src/portail/. Regénération : node tools/build.js. -->';

/*
 * lisTokens() → { brut, indente } — le bloc :root de la charte, lu à sa source unique
 * (src/tokens.css) sous les DEUX formes que le dépôt connaît : `brut` (le fichier tel quel,
 * qui pose ":root{" en colonne 0) et `indente` (réindenté de 2 espaces).
 * La forme dépend de l'endroit où le marqueur <!-- @TOKENS --> est posé : le carnet ouvre son
 * :root à la racine du <style> et prend `brut` ; l'app et le portail l'imbriquent d'un cran et
 * prennent `indente` (piège d'indentation, cf. assembleApp). Les trois lisaient le fichier
 * chacun de son côté avant le Task 18 — une lecture, trois consommateurs, et verifieCharte
 * n'a plus à recalculer la réindentation pour la comparer.
 */
function lisTokens(){
  const brut = fs.readFileSync(TOKENS, 'utf8');
  return { brut, indente: brut.split('\n').map(l => l ? '  ' + l : l).join('\n') };
}

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
  const tokens = lisTokens().brut;
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
  // Les trois substitutions passent par mustReplace depuis le Task 18 : elles étaient les
  // seules à ne pas l'être (le côté app l'avait acquis au Task 13). Sans garde, un marqueur
  // retiré de tete.html fait tomber la charte, tout le CSS ou tout le JS du carnet EN
  // SILENCE — le carnet « se régénère » quand même et --check repasse vert sur l'artefact
  // amputé, exactement le scénario que le Task 13 avait fermé côté coquille.html.
  html = mustReplace(html, '<!-- @TOKENS -->', () => tokens,
    'marqueur <!-- @TOKENS --> absent (le bloc :root/charte serait perdu, en silence)',
    'src/carnet/tete.html');
  html = mustReplace(html, '<!-- @CSS:carnet -->', () => cssCarnet,
    'marqueur <!-- @CSS:carnet --> absent (tout le CSS du carnet serait perdu, en silence)',
    'src/carnet/tete.html');
  html = mustReplace(html, '<!-- @JS:carnet -->', () => jsCarnet,
    'marqueur <!-- @JS:carnet --> absent (tout le JS du carnet serait perdu, en silence)',
    'src/carnet/pied.html');

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
// (revue de branche, chantier 2) : `node tools/build.js --check` compare des artefacts
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
      console.error('  (faute de frappe dans un data-theme ? nouveau thème → l\'ajouter à EXPECTED_THEMES ici ET à THEMES dans src/app/js/07-filtres.js.)');
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

// Garde d'orphelin entre un répertoire de fragments (src/app/js/, src/app/css/, et tout
// futur répertoire assemblé du chantier 4) et la liste ordonnée qui les concatène dans
// ordre.json. Factorisée au round de correction du Task 14 (le motif était dupliqué
// verbatim entre JS et CSS, et se serait payé une troisième fois au remaniement JS du
// Task 15) : sans elle, un fichier retiré de l'un des deux sans toucher l'autre est omis
// du build EN SILENCE — soit ordre.json pointe sur un fichier qui n'existe plus, soit un
// nouveau fichier traîne dans le dossier sans jamais être concaténé. Les deux sens sont
// vérifiés séparément pour nommer le fichier fautif, le répertoire et la clé d'ordre.json
// en cause — pas un diff vague. Fatale (process.exit(1)) avant toute écriture, donc en
// mode normal comme en --check : appelée depuis assembleApp(), toujours avant les lectures
// de contenu qui suivent.
function verifieOrphelins(repertoire, extension, listeOrdonnee, cle){
  const etiquette = path.relative(ROOT, repertoire) + '/';
  const surDisque = fs.readdirSync(repertoire).filter(f => f.endsWith(extension));
  const manquants = listeOrdonnee.filter(f => !surDisque.includes(f));
  if (manquants.length){
    console.error(`\n✗ src/app/ordre.json (clé ${cle}) liste des fichiers absents de ${etiquette} : ` + manquants.join(', '));
    console.error('  (fichier renommé ou supprimé sans mettre ordre.json à jour ?)');
    process.exit(1);
  }
  const orphelins = surDisque.filter(f => !listeOrdonnee.includes(f));
  if (orphelins.length){
    console.error(`\n✗ Fichier(s) dans ${etiquette} absent(s) de src/app/ordre.json (clé ${cle}) : ` + orphelins.join(', '));
    console.error(`  (nouveau fichier ajouté sans l'inscrire dans ordre.json ? il serait omis du build en silence.)`);
    process.exit(1);
  }
}

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

  // Garde d'orphelin (factorisée dans verifieOrphelins(), cf. commentaire au-dessus de sa
  // définition) entre src/app/ordre.json et le contenu réel de src/app/js/ et src/app/css/ :
  // sans elle, un fichier retiré de l'un des deux côtés sans toucher l'autre est omis du
  // build EN SILENCE. Doit s'exécuter avant toute lecture de contenu ci-dessous.
  const jsDir = path.join(srcApp, 'js');
  const cssDir = path.join(srcApp, 'css');
  verifieOrphelins(jsDir, '.js', ordre.js, 'js');
  verifieOrphelins(cssDir, '.css', ordre.css, 'css');

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
  const tokens = lisTokens();

  // Piège d'indentation (résolu à l'assemblage, jamais en éditant app.html — task-13-brief.md
  // § Arbitrages) : le :root d'app.html est imbriqué dans <style> avec 2 espaces de plus que
  // src/tokens.css (qui pose ":root{" à la racine — cf. vocabulaire_hebreu.html, où ça matche
  // tel quel car le carnet pose son :root à la racine aussi). On réindente donc tokens.css de
  // 2 espaces ici, spécifiquement pour l'app.
  const tokensIndentes = tokens.indente;

  let html = coquille;
  // Remplacement par fonction (jamais par chaîne) : le contenu de tokens.css / app.css /
  // Les modules JS peuvent contenir des séquences "$&", "$1"… que String.prototype.replace
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
 * assemblePortail(srcPortail) → chaîne HTML complète d'index.html, SANS l'en-tête
 * « FICHIER GÉNÉRÉ » (posé par insereEntete() dans main(), comme pour le carnet et l'app).
 * `srcPortail` : chemin absolu vers src/portail (ne contient qu'index.html — le portail est
 * une page courte, entièrement inline : rien à découper en fragments, contrairement à l'app).
 * Une seule substitution : <!-- @TOKENS -->, réindenté de 2 espaces (le :root du portail est
 * imbriqué dans <style>, même piège d'indentation que l'app — cf. assembleApp).
 * C'est ce qui CLÔT LE PIÈGE N°5 par construction : le bloc :root des trois pages déployées
 * n'est plus recopié à la main nulle part, il sort de src/tokens.css à chaque build.
 */
function assemblePortail(srcPortail){
  const source = fs.readFileSync(path.join(srcPortail, 'index.html'), 'utf8');
  return mustReplace(source, '<!-- @TOKENS -->', () => lisTokens().indente,
    'marqueur <!-- @TOKENS --> absent (le bloc :root/charte serait perdu, en silence)',
    'src/portail/index.html');
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
    console.error('\n✗ Constante THEMES introuvable dans l\'app assemblée (renommée ? reformatée ? — src/app/js/07-filtres.js).');
    console.error('  Ce garde-fou compare la taxonomie des deux fichiers ; il ne peut plus le faire.');
    process.exit(1);
  }
  const onlyBuild = EXPECTED_THEMES.filter(t => !appThemes.includes(t));
  const onlyApp   = appThemes.filter(t => !EXPECTED_THEMES.includes(t));
  if (onlyBuild.length || onlyApp.length){
    console.error('\n✗ Taxonomie désynchronisée entre build.js et l\'app :');
    if (onlyBuild.length) console.error('    EXPECTED_THEMES (build.js) seul : ' + onlyBuild.join(', '));
    if (onlyApp.length)   console.error('    THEMES (src/app/js/07-filtres.js) seul : ' + onlyApp.join(', '));
    console.error('  Un nouveau thème doit être ajouté aux DEUX listes (mêmes slugs).');
    process.exit(1);
  }
  console.log('\nTaxonomie : ' + EXPECTED_THEMES.length + ' thèmes, build.js et app.html en phase.');
}

/*
 * verifieCharte(appAssembled, notebookGenerated) — tripwires de charte (lot du 2026-07-25),
 * un contrôle mécanique par piège de CLAUDE.md dont la violation passait au vert :
 *  - piège n°2 : `transition:…all` dans l'app assemblée. WebKit fige alors les longhands
 *    outline-* à leur valeur initiale — l'anneau de focus or disparaît SANS casser
 *    :focus-visible, donc sans aucun symptôme côté build ni côté console.
 *  - piège n°3 : un `font-size` posé sur le sélecteur `html`. Les 22px vivent sur body ;
 *    1rem doit rester 16px, dans le carnet comme dans l'app (les tailles y sont calibrées
 *    sur ce qu'elles rendent réellement).
 *  - piège n°5 (première moitié) : CLOS PAR CONSTRUCTION au Task 18. Le contrôle « le bloc
 *    :root d'index.html a-t-il dérivé de src/tokens.css ? » n'a plus d'objet : le portail est
 *    généré, ses tokens sont injectés depuis la source unique, et un marqueur @TOKENS disparu
 *    est déjà fatal chez mustReplace (assemblePortail). Ce qui reste vérifiable ici — et ne
 *    l'était pas —, c'est que les trois pages déployées portent bien les MÊMES tokens, donc
 *    qu'aucune n'a rouvert un :root en dur à côté de l'injection.
 *  - piège n°5 (seconde moitié) : si `--bg` change dans src/tokens.css, la couleur doit
 *    suivre dans manifest.webmanifest (theme_color, background_color) et dans chaque
 *    <meta name="theme-color"> déployé — et les icônes sont à régénérer (ça, aucune
 *    commande ne peut le vérifier : le message le rappelle).
 * Fatale (process.exit(1)), tous les échecs nommés d'un coup — exercée en mode normal
 * comme en --check, cf. main() (même régime que verifieTaxonomieApp : une garde qui ne
 * s'exerce qu'au moment d'écrire laisse --check valider un dépôt cassé).
 * ⚠️ Les trois arguments sont les chaînes FRAÎCHEMENT ASSEMBLÉES, jamais relues du disque —
 * y compris le portail depuis le Task 18 (il lisait index.html du disque tant qu'il était
 * écrit à la main). Une garde qui interroge l'artefact committé valide le passé, pas ce que
 * le build s'apprête à écrire.
 */
function verifieCharte(appAssembled, notebookGenerated, portailGenerated){
  const echecs = [];

  // Les TROIS pages déployées, chacune sous sa forme fraîchement générée. Élargi au portail
  // au Task 18 : tant qu'index.html s'éditait à la main il échappait aux contrôles de forme
  // (seul son bloc :root était comparé) — or il pose lui aussi un anneau de focus or et des
  // transitions sur ses portes, donc il court exactement le piège n°2.
  const deployees = [['l\'app assemblée', appAssembled], ['le carnet généré', notebookGenerated],
                     ['le portail généré', portailGenerated]];

  for (const [nom, source] of [['l\'app assemblée', appAssembled], ['le portail généré', portailGenerated]]){
    if (/transition\s*:[^;{}]*\ball\b/.test(source)){
      echecs.push('`transition: all` détecté dans ' + nom + ' (piège n°2 : WebKit fige les longhands outline-*, l\'anneau de focus or disparaît sans symptôme). Cherche dans src/app/css/*.css, src/app/coquille.html ou src/portail/index.html ; liste les propriétés animées explicitement.');
    }
  }

  // Le parcours de blocs `sélecteur{…}` ne s'applique qu'aux contenus <style> : denses en
  // accolades, il y reste linéaire. Sur le document entier, `[^{}]+\{` repartait de chaque
  // position d'un long run HTML sans accolade — quadratique, build gelé (payé à
  // l'installation du lot : ~1 Mo de carnet, --check ne rendait plus la main).
  for (const [nom, source] of deployees){
    const css = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
      const selecteurs = m[1].split(',').map(s => s.trim().split(/\s+/).pop());
      if (selecteurs.includes('html') && /font-size/.test(m[2])){
        echecs.push('un `font-size` est posé sur le sélecteur `html` dans ' + nom + ' (piège n°3 : les 22px vivent sur body, 1rem doit rester 16px) — bloc fautif : « ' + m[0].replace(/\s+/g, ' ').slice(0, 90) + ' ».');
      }
    }
  }

  // Piège n°5, première moitié. L'injection depuis src/tokens.css garantit que les tokens
  // sont PRÉSENTS ; elle ne garantit pas qu'ils soient SEULS. Un second `:root{…}` écrit à la
  // main dans une source (ou survivant d'une reprise) gagnerait par ordre de cascade et
  // rétablirait en silence la divergence que le Task 18 vient de fermer. On exige donc
  // exactement une ouverture de :root par page déployée, et que ce soit celle qui a été
  // injectée (l'une des deux formes que le dépôt connaît : brute pour le carnet, réindentée
  // de 2 espaces pour l'app et le portail).
  // Le carnet en ouvre trois, et ils NE FUSIONNENT JAMAIS (piège n°4) : les jetons de charte,
  // la gamme typographique en 8 pas, la colonne de lecture. L'app et le portail n'ont que
  // celui de la charte. Le compte attendu est donc une constante par page, pas « exactement
  // un » — mesuré sur les artefacts committés du 25/07.
  const ROOTS_ATTENDUS = { 'l\'app assemblée': 1, 'le carnet généré': 3, 'le portail généré': 1 };
  const { brut: tokens, indente: tokensIndentes } = lisTokens();
  for (const [nom, source] of deployees){
    if (!source.includes(tokens) && !source.includes(tokensIndentes)){
      echecs.push('les tokens de src/tokens.css sont introuvables tels quels dans ' + nom + ' (piège n°5 : la charte est la même dans les trois pages déployées) — injection @TOKENS détournée ou réindentée autrement ?');
      continue;
    }
    const ouvertures = (source.match(/(^|[\s;}])\:root\s*[,{]/g) || []).length;
    if (ouvertures !== ROOTS_ATTENDUS[nom]){
      echecs.push(nom + ' ouvre ' + ouvertures + ' bloc(s) `:root`, on en attend ' + ROOTS_ATTENDUS[nom] + ' (pièges n°4 et n°5). Un :root de plus, c\'est la charte réécrite en dur à côté de l\'injection <!-- @TOKENS --> : elle gagne par cascade et fait diverger les pages sans rien casser de visible. Un de moins, c\'est un bloc perdu.');
    }
  }

  const bg = (tokens.match(/--bg\s*:\s*(#[0-9a-fA-F]{3,8})/) || [])[1];
  if (!bg){
    echecs.push('`--bg` introuvable dans src/tokens.css (renommé ? reformaté ?) — la garde theme-color ne peut plus comparer.');
  } else {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
    for (const champ of ['theme_color', 'background_color']){
      if (manifest[champ] !== bg){
        echecs.push('manifest.webmanifest.' + champ + ' vaut « ' + manifest[champ] + ' » mais --bg vaut « ' + bg + ' » (piège n°5). Aligne le manifest — et si --bg a changé : régénère les icônes (icons/), aucune commande ne le vérifie.');
      }
    }
    for (const [nom, source] of deployees){
      const meta = (source.match(/<meta name="theme-color" content="([^"]+)"/) || [])[1];
      if (meta !== bg){
        echecs.push('<meta name="theme-color"> de ' + nom + ' vaut « ' + meta + ' » mais --bg vaut « ' + bg + ' » (piège n°5).');
      }
    }
  }

  if (echecs.length){
    console.error('\n✗ Charte violée (' + echecs.length + ' contrôle' + (echecs.length > 1 ? 's' : '') + ') :');
    for (const e of echecs) console.error('  - ' + e);
    process.exit(1);
  }
  console.log('Charte : transition:all absent, font-size hors de html, :root au compte attendu, tokens et theme-color (' + bg + ') en phase sur les 3 pages déployées.');
}

/**
 * verifieCatOrder(racine) — le 7e point de câblage, enfin gardé.
 *
 * `catOrder` (src/app/js/07-filtres.js) est la seule liste dont dépend l'affichage
 * des puces de catégorie : buildChips() n'itère que sur elle. Une section neuve
 * complète et correcte mais absente de catOrder produit un carnet juste, un
 * --check vert et une app SANS sa puce — un échec parfaitement muet, le seul des
 * sept points de câblage que rien ne surveillait.
 *
 * Sens fatal : toute catégorie attendue (EXPECTED_CATS ∪ valeurs de listCats)
 * doit figurer dans catOrder. Sens inverse (une entrée de catOrder qui ne
 * correspond à aucune catégorie) : simple avertissement — buildChips() filtre
 * déjà sur catCounts, une entrée morte n'affiche rien et ne casse rien.
 *
 * Le bac à sable d'ajoute_mots.js recopie src/ : la garde y fonctionne (contrairement
 * à verifieDoc, qui doit tolérer l'absence de docs/).
 */
function verifieCatOrder(racine){
  const f = path.join(racine, 'src', 'app', 'js', '07-filtres.js');
  const src = fs.readFileSync(f, 'utf8');
  const m = src.match(/const\s+catOrder\s*=\s*\[([\s\S]*?)\]/);
  if (!m) throw new Error('verifieCatOrder : const catOrder introuvable dans 07-filtres.js');
  const ordre = (m[1].match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));
  const attendues = [...new Set([...EXPECTED_CATS, ...Object.values(listCats)])];
  const absentes = attendues.filter(c => !ordre.includes(c));
  if (absentes.length) {
    throw new Error('catOrder (07-filtres.js) : catégorie(s) sans puce dans l\'app : '
      + absentes.join(', ') + ' — ajoute-les à catOrder.');
  }
  const mortes = ordre.filter(c => !attendues.includes(c));
  if (mortes.length) console.log('  ⚠ catOrder : entrée(s) sans catégorie : ' + mortes.join(', '));
}

/*
 * verifieDoc(racine) — la doc attribue-t-elle chaque symbole au bon module ? (2026-07-27)
 *
 * Motif : la passe d'audit du 27/07 a trouvé dans ARCHITECTURE.md deux renvois symbole→module
 * INTERVERTIS (`undoCardAnswer` donné dans 02-translitteration.js, `he2tr` dans 11-cartes.js).
 * Classe de défaut typique du dépôt : faux, invisible, et coûteux — il envoie corriger dans le
 * mauvais fichier. La source de vérité existe déjà, c'est l'en-tête « // Expose : » de chaque
 * module plus ses définitions top-level ; il n'y avait qu'à comparer.
 *
 * ⚠️ Absence de docs/ tolérée, et ce n'est pas de la complaisance : le bac à sable
 * d'`ajoute_mots.js` recopie tools/, src/ et deux fichiers racine — jamais docs/. Une garde
 * fatale qui EXIGERAIT le fichier casserait tous les dry-runs (leçon n°1 d'ARCHITECTURE.md,
 * payée au Task 17 avec index.html puis au Task 19 avec sw.js). Le bac à sable valide de la
 * donnée, pas de la prose : il est légitime qu'il ne contrôle pas la doc. Le build réel, lui,
 * la contrôle — et `--check` passe par le même chemin.
 *
 * ⚠️ Le symbole retenu est le DERNIER en accents graves avant le lien, jamais le premier de la
 * phrase : « `listCats` … et dans `catOrder` de [07-filtres.js] » attribue `catOrder`. Une
 * première version prenait le premier et rendait 5 fausses alertes sur 9 — une garde qui crie
 * à tort est désactivée dans la semaine, donc elle ne vaut que juste.
 */
function verifieDoc(racine){
  const docPath = path.join(racine, 'docs', 'ARCHITECTURE.md');
  const dirJs = path.join(racine, 'src', 'app', 'js');
  if (!fs.existsSync(docPath) || !fs.existsSync(dirJs)) return;

  // module → symboles qu'il définit (top-level) ou déclare exposer.
  const definis = {};
  for (const f of fs.readdirSync(dirJs).filter(n => n.endsWith('.js'))){
    const src = fs.readFileSync(path.join(dirJs, f), 'utf8');
    const noms = new Set();
    for (const m of src.matchAll(/^(?:function|const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)/gm)) noms.add(m[1]);
    const tete = src.split('\n')[0].match(/^\/\/ Expose\s*:\s*(.*?)(?:—\s*Utilise|$)/);
    if (tete) tete[1].split(',').map(s => s.trim()).filter(Boolean).forEach(s => noms.add(s));
    definis[f] = noms;
  }

  const doc = fs.readFileSync(docPath, 'utf8');
  const RE = /`([A-Za-z_$][A-Za-z0-9_$]*)`(?:\([^)`\n]*\))?[^`\n[]{0,40}\[src\/app\/js\/([0-9]{2}-[a-z-]+\.js)\]/g;
  const echecs = []; let controles = 0;
  for (const m of doc.matchAll(RE)){
    const [, sym, mod] = m;
    controles++;
    if (!definis[mod]){ echecs.push('docs/ARCHITECTURE.md renvoie `' + sym + '` vers ' + mod + ', qui n\'existe pas dans src/app/js/.'); continue; }
    if (definis[mod].has(sym)) continue;
    const vrais = Object.keys(definis).filter(f => definis[f].has(sym)).sort();
    echecs.push('docs/ARCHITECTURE.md attribue `' + sym + '` à ' + mod + ' — il est défini dans '
      + (vrais.length ? vrais.join(', ') : 'aucun module (renommé ou supprimé ?)') + '.');
  }

  if (echecs.length){
    console.error('\n✗ Doc désynchronisée du code (' + echecs.length + ') :');
    for (const e of echecs) console.error('  - ' + e);
    process.exit(1);
  }
  console.log('Doc : ' + controles + ' renvois symbole→module d\'ARCHITECTURE.md vérifiés contre les en-têtes « Expose ».');
}

// ---------- génération du fichier autonome depuis l'app assemblée ----------
// `fichier` (obligatoire en pratique) : où l'auteur doit aller corriger. ⚠️ JAMAIS 'app.html'
// — depuis la tâche 13 c'est un artefact généré, et y envoyer l'auteur lui fait éditer un
// fichier écrasé au build suivant. Les ancres vivent dans src/app/coquille.html (balisage) ou
// src/app/js/*.js (code) ; le défaut ne sert que de garde si un appel oublie l'étiquette
// (round de correction Task 13, finding Important : les substitutions n'étaient gardées par
// rien avant ce round ; étiquettes recalées au Task 16).
function mustReplace(src, from, to, what, fichier){
  fichier = fichier || 'src/app/ (fichier non précisé par l\'appelant)';
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
    '<!DOCTYPE html>\n<!-- FICHIER GÉNÉRÉ par `node tools/build.js` depuis src/app/ + data/ — ne pas éditer à la main. -->',
    'doctype', 'src/app/coquille.html');

  // La couche PWA n'a aucun sens hors ligne : on n'installe pas une application depuis un
  // file://, et ces deux liens y étaient déjà morts avant la CSP. Celle-ci n'a fait que les
  // rendre visibles : en file:// l'origine est opaque, donc 'self' ne matche plus rien et le
  // navigateur les refuse bruyamment. On retire la cause plutôt que d'assouplir la règle.
  out = mustReplace(out, '<link rel="manifest" href="manifest.webmanifest">\n',
    '', 'link rel=manifest', 'src/app/coquille.html');
  out = mustReplace(out, '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n',
    '', 'link rel=apple-touch-icon', 'src/app/coquille.html');

  // Version autonome : pas de chargement réseau → pas de loader, panneau visible d\'emblée.
  out = mustReplace(out,
    '<div id="loader" class="loader"><div class="spin"></div><p id="loader-msg" role="status">Chargement du vocabulaire…</p></div>\n',
    '', 'div #loader', 'src/app/coquille.html');
  out = mustReplace(out,
    '<section class="setup panel hidden" id="setup">',
    '<section class="setup panel" id="setup">', 'section #setup (classe hidden)',
    'src/app/coquille.html');

  // Vocabulaire intégré à la place du tableau vide.
  out = mustReplace(out, 'let CARDS = [];',
    'const CARDS = ' + JSON.stringify(cards) + ';', 'let CARDS = []',
    'src/app/js/05-donnees.js');

  // Le bloc en-ligne (fetch + extraction runtime) devient un démarrage direct.
  out = mustReplace(out,
    /\/\/ ===== BUILD:ONLINE-ONLY[^\n]*\n[\s\S]*?\/\/ ===== \/BUILD:ONLINE-ONLY =====\n/,
    '// ---------- Démarrage (version autonome : vocabulaire intégré ci-dessus) ----------\n'
    + 'buildChips();\n'
    + 'updateStart();\n'
    + "document.getElementById('count-note').textContent = CARDS.length + ' mots intégrés (version autonome)';\n",
    'bloc BUILD:ONLINE-ONLY', 'src/app/js/99-principal.js');

  // Garde-fous : plus aucune trace du chemin réseau dans le fichier autonome.
  // « serviceWorker » et « BUILD:ONLINE-ONLY » ajoutés au lot tripwires (2026-07-25) :
  // une fence coupée en deux blocs ne fait retirer que le premier par le regex non-greedy
  // ci-dessus — le second bloc livrait un standalone qui enregistre un service worker,
  // build en exit 0 (éprouvé en bac à sable par le relecteur du chantier 3).
  ['fetch(', 'DOMParser', 'serviceWorker', 'BUILD:ONLINE-ONLY'].forEach(tok => {
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

// ---------- estampille : la VERSION du service worker dérivée du contenu servi ----------

/*
 * Les fichiers SERVIS dont le hash estampille `const VERSION` dans sw.js (chantier 4,
 * Task 19) : les cinq artefacts + le manifeste. Tout build qui change l'un d'eux change la
 * version ; un build qui ne change rien la laisse stable (hash identique). Le piège n°10
 * — « bump oublié », donc ancien app.html resservi une fois de plus — n'a plus de prise.
 *
 * ⚠️ sw.js N'EST PAS DANS LA LISTE et ne doit jamais y entrer. C'est le fichier où la
 * version s'écrit : l'y inclure ferait courir le hash après sa propre queue — estampiller
 * changerait sw.js, ce qui changerait le hash, ce qui redemanderait une estampille.
 * `--check` ne repasserait plus jamais vert et le cache serait purgé à chaque build.
 *
 * ⚠️ Corollaire assumé : ce qui n'est pas dans la liste ne bouge pas la version — sw.js
 * lui-même et icons/ au premier chef. La conséquence est bornée, pas nulle : le handler
 * `fetch` est en stale-while-revalidate sur tout le même-origine, donc une icône changée
 * arrive avec un lancement de retard, pas jamais. Ce qui n'arriverait PAS tout seul, c'est
 * une vraie purge de cache (changement de stratégie qui rendrait les entrées gardées
 * nuisibles) : elle se force à la main en changeant le préfixe de `CACHE` dans sw.js.
 *
 * Le hash porte sur les OCTETS DU DISQUE, pas sur les chaînes générées en mémoire : c'est
 * ce que le navigateur reçoit qui doit décider de la version. En mode normal le build vient
 * de les écrire, et en `--check` l'égalité généré/committé est déjà prouvée avant qu'on
 * arrive ici — les deux coïncident donc, mais en cas de doute c'est le fichier servi qui
 * tranche.
 *
 * ⚠️ Un effet de bord mesuré le 25/07, à connaître avant de s'étonner : le champ `version`
 * de cards.json (la date du build) entre dans le hash. Il ne rend PAS la version instable au
 * quotidien — cards.json n'est réécrit que si les CARTES changent, donc sa date est figée à
 * contenu constant. Mais elle est COLLANTE : après un changement de contenu suivi d'un
 * `git checkout -- data/` seul, cards.json garde la date du build intermédiaire et la
 * version ne revient pas à sa valeur d'origine (elle en prend une troisième). Le remède est
 * de restaurer les artefacts avec les sources (`git checkout -- .`) — vérifié : la version
 * d'origine revient alors au bit près. Rien de committé n'en souffre, c'est un transitoire
 * de poste de travail ; on ne canonicalise pas cards.json pour autant, le hash doit porter
 * sur les octets réellement servis.
 */
const FICHIERS_ESTAMPILLES = ['index.html', 'app.html', 'vocabulaire_hebreu.html',
  'flashcards_hebreu.html', 'cards.json', 'manifest.webmanifest'];
const VERSION_RE = /^const VERSION = '([^']*)';$/m;

// Pas de garde d'existence ici, à dessein : elle serait MUETTE par construction. Un fichier
// haché qui manque fait déjà échouer le build plus tôt et bruyamment — verifieCharte lit le
// manifeste et les artefacts avant qu'on arrive ici (vérifié le 25/07 par casse fabriquée :
// manifest.webmanifest retiré → ENOENT fatal dans verifieCharte, jamais jusqu'ici). Un
// contrôle qui ne peut pas échouer passe au vert sans rien prouver.
function calculeEstampille(){
  const h = crypto.createHash('sha256');
  for (const f of FICHIERS_ESTAMPILLES) h.update(fs.readFileSync(path.join(ROOT, f)));
  return 'v-' + h.digest('hex').slice(0, 8);
}

/*
 * Lit la ligne estampillée de sw.js. Fatale si le motif a bougé : `String.replace` d'une
 * regex qui ne matche pas ne lève RIEN — il rend la chaîne inchangée. Sans cette garde, un
 * renommage de la ligne laisserait le build vert et la version gelée pour toujours, c'est-à-dire
 * exactement le piège n°10 remis en place, en silence et sans que personne le sache.
 */
function litVersionSw(){
  const sw = fs.readFileSync(SW, 'utf8');
  const m = sw.match(VERSION_RE);
  if (!m){
    console.error('\n✗ sw.js : ligne `const VERSION = \'…\';` introuvable — l\'estampille du Task 19 ne peut pas être posée.');
    console.error('  Restaure-la (une seule, en colonne 0, guillemets simples) ou recale VERSION_RE dans tools/build.js.');
    process.exit(1);
  }
  return { sw, actuelle: m[1] };
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
  const portailAssembled = assemblePortail(SRC_PORTAIL);
  verifieTaxonomieApp(appAssembled); // fatale — exercée en mode normal comme en --check
  verifieCharte(appAssembled, notebookGenerated, portailAssembled); // fatale — même régime (tripwires de charte)
  verifieDoc(ROOT);                                                 // fatale aussi ; muette si docs/ absent (bac à sable)
  try { verifieCatOrder(ROOT); } catch (e) { console.error('✗ ' + e.message); process.exit(1); } // fatale — 7e point de câblage
  const appGenerated = insereEntete(appAssembled, ENTETE_GENERE_APP);
  const portailGenerated = insereEntete(portailAssembled, ENTETE_GENERE_PORTAIL);

  const standaloneGenerated = generateStandalone(cards, appAssembled);
  const cardsJson = JSON.stringify({ version: new Date().toISOString().slice(0, 10), cartes: cards }, null, 2) + '\n';

  const notebookOnDisk = fs.existsSync(NOTEBOOK) ? fs.readFileSync(NOTEBOOK, 'utf8') : '';
  const appOnDisk = fs.existsSync(APP) ? fs.readFileSync(APP, 'utf8') : '';
  const standaloneOnDisk = fs.existsSync(STANDALONE) ? fs.readFileSync(STANDALONE, 'utf8') : '';
  const portailOnDisk = fs.existsSync(INDEX) ? fs.readFileSync(INDEX, 'utf8') : '';
  const cardsOnDiskRaw = fs.existsSync(CARDS_JSON) ? fs.readFileSync(CARDS_JSON, 'utf8') : '';
  let cardsOnDiskCartes = null;
  if (cardsOnDiskRaw){
    try { cardsOnDiskCartes = JSON.parse(cardsOnDiskRaw).cartes; } catch (e) { cardsOnDiskCartes = null; }
  }
  // Comparaison de contenu (jamais la « version » — la date du jour du build changerait
  // seule, sans rien dire sur data/ — --check doit rester stable d'un jour à l'autre).
  const cardsContentUpToDate = JSON.stringify(cardsOnDiskCartes) === JSON.stringify(cards);

  if (check){
    // --check compare désormais les CINQ artefacts régénérés aux committés (chantier 4,
    // tâche 18 : index.html rejoint vocabulaire_hebreu.html/cards.json/app.html/
    // flashcards_hebreu.html — le portail n'est plus écrit à la main).
    let ok = true;
    if (notebookGenerated !== notebookOnDisk){
      console.error('\n✗ vocabulaire_hebreu.html obsolète — lance `node tools/build.js` pour le régénérer.');
      ok = false;
    }
    if (!cardsContentUpToDate){
      console.error('\n✗ cards.json obsolète (cartes) — lance `node tools/build.js` pour le régénérer.');
      ok = false;
    }
    if (appGenerated !== appOnDisk){
      console.error('\n✗ app.html obsolète — lance `node tools/build.js` pour le régénérer.');
      ok = false;
    }
    if (standaloneGenerated !== standaloneOnDisk){
      console.error('\n✗ flashcards_hebreu.html obsolète — lance `node tools/build.js` pour le régénérer.');
      ok = false;
    }
    if (portailGenerated !== portailOnDisk){
      console.error('\n✗ index.html obsolète — lance `node tools/build.js` pour le régénérer.');
      ok = false;
    }
    // L'estampille ne se contrôle qu'une fois les cinq artefacts prouvés en phase, pour deux
    // raisons : si l'un est périmé, le correctif est le rebuild — qui repose la version au
    // passage —, et le hash porte sur le disque, qu'on vient justement de déclarer douteux.
    // Ce contrôle est ce qui rend le Task 19 complet : sans lui, un artefact peut être
    // committé sans son estampille et personne ne le voit (cf. contrôle n°3 du pre-commit,
    // retiré au même commit).
    let estampille = null;
    if (ok){
      estampille = calculeEstampille();
      const { actuelle } = litVersionSw();
      if (actuelle !== estampille){
        console.error('\n✗ sw.js : VERSION vaut ' + actuelle + ', le contenu servi vaut ' + estampille +
          ' — lance `node tools/build.js` pour réestampiller.');
        ok = false;
      }
    }
    if (ok) console.log('\n✓ vocabulaire_hebreu.html, cards.json, app.html, flashcards_hebreu.html et index.html en phase avec data/ + src/ ; VERSION de sw.js estampillée (' + estampille + ').');
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

  if (portailGenerated === portailOnDisk){
    console.log('✓ index.html déjà à jour.');
  } else {
    fs.writeFileSync(INDEX, portailGenerated);
    console.log('✓ index.html régénéré (' + Buffer.byteLength(portailGenerated, 'utf8') + ' octets).');
  }

  // EN DERNIER, une fois les cinq artefacts sur le disque : la version est le hash de ce
  // qui est servi, elle ne peut donc se calculer qu'après la dernière écriture.
  const attendue = calculeEstampille();
  const { sw, actuelle } = litVersionSw();
  if (actuelle === attendue){
    console.log('✓ sw.js : VERSION déjà estampillée (' + attendue + ').');
  } else {
    fs.writeFileSync(SW, sw.replace(VERSION_RE, () => "const VERSION = '" + attendue + "';"));
    console.log('✓ sw.js : VERSION ' + actuelle + ' → ' + attendue + ' (hash du contenu servi).');
  }
}

// Réutilisable en module : chargeDonnees/valideDonnees/genereCarnet/deriveCartes sont
// l'API v2 du build — verifie_exemples.js, cherche_mots.js et ajoute_mots.js s'appuient
// dessus (tâches 10-11, chantier 2). Le parseur regex de vocabulaire_hebreu.html a servi
// d'oracle de non-régression puis de pont pour ces trois scripts ; supprimé à la tâche 11,
// une fois le dernier (ajoute_mots.js) basculé sur data/. Ses derniers helpers ne survivaient
// que pour outils_migration/ : supprimés avec ce dossier au Task 20, exports compris — plus
// une seule ligne de lecture de HTML dans le dépôt. Jamais de nouveau parseur, jamais de
// constante dupliquée.
// `ROOT` est exporté depuis le Task 17 : les trois autres outils vivent dans le même
// dossier et doivent viser la MÊME racine — le recalculer chez eux, c'est trois
// occasions de le recalculer faux (piège n°1 du Task 17).
module.exports = { ROOT, NOTEBOOK, APP, CARDS_JSON, INDEX,
  stripNikud, orthographeVoisine,
  EXPECTED_CATS, EXPECTED_LEVELS, EXPECTED_THEMES, THEMED_CATS, listCats,
  fichiersListes, fichiersDonnees, fonctionsApp,
  chargeDonnees, valideDonnees, genereCarnet, deriveCartes, assertFormeCartes };
if (require.main === module) main();
