# Architecture du dépôt

> Vision d'ensemble du fonctionnement du projet. Pour les consignes d'édition destinées à Claude Code, voir [CLAUDE.md](../CLAUDE.md) ; pour la présentation utilisateur, voir [README.md](../README.md).

## Vue d'ensemble

Un toolkit en français pour apprendre l'hébreu moderne, déployé en **fichiers statiques** sur GitHub Pages (`https://rubischtgadol.github.io/flashcards-hebreu/`).

**Aucune dépendance, aucun test, aucun gestionnaire de paquets.** Chaque fichier déployé est un document HTML autonome (CSS et JS inline, vanilla). Le seul outillage est `tools/build.js`, `tools/verifie_exemples.js`, `tools/ajoute_mots.js`, `tools/cherche_mots.js`, `tools/mesure_translitteration.js` et `tools/controle_tr.js`, six scripts Node zéro-dépendance, utilisés uniquement en développement et jamais déployés. Ils vivent dans `tools/` et **se lancent depuis la racine du dépôt** : chacun vise `ROOT = path.join(__dirname, '..')`, exporté par `build.js` pour que les cinq autres ne le recalculent jamais.

```text
┌──────────────────────────────────────────────────────────────────┐
│         data/*.json  +  src/carnet/  +  src/app/  +  src/tokens.css │
│   SOURCE UNIQUE DE VÉRITÉ — contenu (data/), gabarits du carnet     │
│   (src/carnet/), sources de l'app (src/app/ : coquille, 6 fragments  │
│   CSS, 14 modules JS, ordre porté par src/app/ordre.json), source du  │
│   portail (src/portail/), jetons de charte (src/tokens.css)           │
└───────────────────────────────┬────────────────────────────────────┘
                                │ node tools/build.js
                                ▼
        CINQ artefacts committés, 100 % GÉNÉRÉS — jamais édités à la main :
        • vocabulaire_hebreu.html — le carnet, lu par les humains
        • cards.json — {version, cartes}, lu par app.html
        • app.html — flashcards EN LIGNE, assemblé par assembleApp()
        • flashcards_hebreu.html — app AUTONOME hors ligne (cartes inlinées)
        • index.html — le PORTAIL, assemblé par assemblePortail()
        …puis sw.js reçoit son ESTAMPILLE : la ligne `const VERSION` est réécrite
          avec un hash des cinq artefacts + manifest.webmanifest. Tout
          le reste de sw.js s'édite à la main.
                                │
                                │ app.html fetch('./cards.json')
                                ▼
                    (derrière le portail index.html
                     à la racine — généré lui aussi
                     )
```

Il n'y a donc **qu'une seule app** (les sources de `src/app/`, la racine étant un portail léger) et **qu'une seule source de contenu** (`data/*.json`). Le carnet, `cards.json`, `app.html`, le fichier autonome et le portail sont cinq projections mécaniques de ces sources, produites par `node tools/build.js`.

⚠️ **`app.html` n'est plus une source** : il est assemblé, et toute édition à la main y est écrasée au prochain build. Le détail du découpage est en § Anatomie de l'app.

## Les fichiers

⚠️ **Où vit quoi** : la racine ne porte plus que
ce qui est **servi** (les cinq artefacts, la couche PWA) plus `README.md`
et `CLAUDE.md`. Les sources sont dans `data/` (contenu) et `src/` (gabarits du carnet, code
de l'app, source du portail) ; l'outillage dans `tools/` ; la prose dans `docs/`. **Les outils se lancent
toujours depuis la racine** (`node tools/build.js`), jamais depuis `tools/` : ils visent
`ROOT = path.join(__dirname, '..')`, exporté par `build.js` pour que les quatre autres ne
le recalculent pas. Les chemins de ce tableau sont donnés depuis la racine.

| Fichier | Rôle | Édité à la main ? |
| --- | --- | --- |
| [vocabulaire_hebreu.html](../vocabulaire_hebreu.html) | Carnet grammaire + vocabulaire, lu par les humains. Généré depuis `data/*.json` + `src/carnet/` — le contenu s'édite dans `data/`, jamais ici. | ❌ **jamais** — généré par `build.js` |
| [index.html](../index.html) | Le **portail** : la porte d'entrée à la racine, en deux temps — accueil plein écran (« Ruben vous souhaite la bienvenue ! » / « ראובן מקבל אתכם בברכה! » au hasard, le א doré de l'icône en vectoriel, deux ménorahs à sept branches qui éclairent les côtés), puis le choix entre deux portes égales (flashcards, carnet). Sans JS, l'accueil s'efface et les portes sont directement là. Sans vocabulaire : il ne dépend pas de `data/`. Assemblé par `assemblePortail()` depuis `src/portail/index.html` + `src/tokens.css` — **le portail s'édite dans `src/portail/`, jamais ici**. | ❌ **jamais** — généré par `build.js` |
| [app.html](../app.html) | App de flashcards en ligne. Ne contient **pas** de vocabulaire : elle charge ses cartes via `fetch('./cards.json')` au démarrage. Assemblée par `assembleApp()` depuis `src/app/` + `src/tokens.css` — **le code s'édite dans `src/app/`, jamais ici**. | ❌ **jamais** — généré par `build.js` |
| [flashcards_hebreu.html](../flashcards_hebreu.html) | Flashcards autonomes hors ligne, vocabulaire intégré. | ❌ **jamais** — généré par `build.js` |
| [cards.json](../cards.json) | `{version, cartes}` — snapshot JSON des cartes dérivées de `data/`, chargé par `app.html` au démarrage. | ❌ **jamais** — généré par `build.js` |
| [build.js](../tools/build.js) | Dev only. Lit `data/*.json` et `src/`, valide (`valideDonnees`), régénère les **cinq** artefacts committés (`vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html`, `index.html`), compte les cartes par section/niveau/thème, échoue si une section ou un niveau attendu tombe à 0, puis **estampille `VERSION` dans `sw.js`** (hash du contenu servi — seule ligne de `sw.js` que le build touche). `--check` compare les cinq artefacts régénérés aux committés sans écrire, et recalcule l'estampille. | ✅ oui |
| [verifie_exemples.js](../tools/verifie_exemples.js) | Dev only. Filet de sécurité des exemples en situation (champs, longueur, nikoud, translittération concordante avec l'appli, niveau du vocabulaire) + règle de couverture : tout nom, adjectif ou verbe sans exemple est une erreur bloquante. Son lexique lit **les cartes et les sections de grammaire** — voir § 5.1 pour les deux garde-fous qui l'empêchent de devenir circulaire. | ✅ oui |
| [ajoute_mots.js](../tools/ajoute_mots.js) | Dev only. Générateur de fiche, étage 1 (contrat : [SPEC_AJOUTE_MOTS.md](SPEC_AJOUTE_MOTS.md)) : consomme un petit `nouveaux_mots.json` (nom, adjectif, verbe, mot de liste, exemple sur mot existant) et insère les entrées correspondantes dans `data/*.json` — `tr` dérivés via le `he2tr` du **module source** `src/app/js/02-translitteration.js`, chargé par `fonctionsApp()` (comme `verifie_exemples.js`), placement par frontière de section, doublons corpus entier (idempotent — comparaison **exacte** sur `he_plain`, à quoi s'ajoute un signal « orthographe voisine » ktiv male/haser purement **informatif**, qui ne bloque jamais), tout-ou-rien. Valide en **sandbox** (`chargeDonnees`/`valideDonnees`/`deriveCartes`/`assertFormeCartes` + build + verifie sur un **dépôt miniature** temporaire qui reproduit la disposition `tools/` et embarque les fichiers racine lus par `verifieCharte()` — voir [SPEC_AJOUTE_MOTS.md](SPEC_AJOUTE_MOTS.md) §7.B, deux invariants) et n'écrit `data/*.json` qu'avec `--ecrire` après vert complet ; dry-run par défaut. Réutilise les exports de build.js : aucun troisième parseur, aucune constante dupliquée. | ✅ oui |
| [cherche_mots.js](../tools/cherche_mots.js) | Dev only. Consultation **en lecture seule** de `data/*.json` (n'écrit jamais rien) — le canal cheap du piège n°15 de CLAUDE.md. `node tools/cherche_mots.js TERME…` : terme hébreu = comparaison exacte sur `he_plain` (headwords, puis formes pluriel/MS/FS/MP/FP, puis mot exact dans les exemples), **puis, seulement si l'exacte échoue, l'appariement ktiv male/haser** (`orthographeVoisine`) sorti en rubrique séparée « orthographe voisine » — le carnet vocalisé s'écrit défectif (עִתּוֹן → `עתון`) quand on cherche plein (`עיתון`), et sans cette rubrique 6 mots sur 24 ressortaient `ABSENT` en étant présents ; terme latin = sous-chaîne à frontière de mot en tête dans `.fr`/`note`/`exemples`. Sortie `CATÉGORIE fichier:ligne · hébreu — français` (ancre dans `data/*.json`, qui remplace l'ancienne ancre « carnet Lnnnn » — la source d'un mot est désormais `data/`, le carnet n'en est qu'un dérivé généré), `ABSENT` seulement si ni exacte ni voisine, bornée à 8 occurrences par rubrique (surplus compté). `--stats` : total + répartition section/niveau/thème (du moins doté au plus doté). Répond « ce mot existe-t-il ? où ? quel thème est sous-doté ? » pour ~200 tokens au lieu de lire le carnet. Réutilise les exports de build.js (`chargeDonnees`, `deriveCartes`, `stripNikud`, `orthographeVoisine`, `fichiersDonnees`…) : aucun troisième parseur, et **aucune énumération de `data/` en propre** — l'index des fichiers vient de `fichiersDonnees()`. | ✅ oui |
| [mesure_translitteration.js](../tools/mesure_translitteration.js) | Dev only. Note `he2tr` face à **tous les `.tr` écrits à la main** (cartes, exemples, formes) — les seuls qui font foi. Sort trois nombres : accord exact, accord après `trKey` (celui qui dit ce que la saisie accepte) et distance d'édition totale. `--top` liste les 15 plus gros écarts ; `--shva` tabule, **sur le `tr` humain seul**, ce que l'usage fait du shva initial consonne par consonne. Existe parce que la règle du shva est morphologique et que `he2tr` ne peut que l'approcher : c'est le harnais qui arbitre toute retouche de l'approximation, et **un changement ne se garde que s'il améliore les trois nombres**. Charge les fonctions par `fonctionsApp()` — aucune copie de la translittération. | ✅ oui |
| [controle_tr.js](../tools/controle_tr.js) | Dev only. Compare la translittération rédigée à la main au résultat de `he2tr`, entrée par entrée — têtes, exemples et formes. Distingue `✔ replié` (divergence d'affichage que `trKey` confond) de `✘ BRUT` (désaccord réel, arbitrage humain : le `tr` rédigé fait foi, un brut n'est pas forcément une faute — cf. chva morphologique). Signale aussi `⚠ MUET` : un couple he/tr troué — `he` absent, ou `tr` absent **sur une forme, un pluriel ou un exemple**. Jamais sur une tête, où l'absence de `tr` est la norme des tables (1051 des 1728 entrées du corpus n'en portent pas et l'app retombe sur `he2tr`). Sort en code 1 s'il reste un `✘ BRUT` **ou** un `⚠ MUET`. Tout bordereau de mots nouveaux y passe avant insertion dans `data/`. Charge les fonctions par `fonctionsApp()` — aucune copie de la translittération ; toujours pas de validation de schéma : il ne regarde que les couples he/tr, qui sont son sujet, et refuse ceux qui ont un trou. | ✅ oui |
| [manifest.webmanifest](../manifest.webmanifest), [sw.js](../sw.js), `icons/` | Couche PWA : installation (icône א, plein écran) et hors-ligne. | ✅ oui (icônes générées) |

## La couche PWA

L'app en ligne est installable (iPhone : Safari → « Sur l'écran d'accueil ») et fonctionne hors ligne :

- **`manifest.webmanifest`** — nom, `display: standalone`, couleurs de la charte, icônes 192/512. `start_url` et `scope` sont **relatifs** (le site vit sous `/flashcards-hebreu/`).
- **`sw.js`** — service worker en *stale-while-revalidate* : l'app et le carnet sont servis depuis le cache puis rafraîchis en arrière-plan (une mise à jour de contenu est visible au lancement suivant). Les polices Google sont en cache-first. Seules les navigations vers la racine (`/`, `/index.html`) sont rabattues sur la coquille `./` — le **portail** — les autres pages (le carnet !) sont servies telles quelles. ⚠️ **`VERSION` ne s'incrémente plus à la main** : `node tools/build.js` l'estampille avec un sha256 des cinq artefacts + `manifest.webmanifest`, et `--check` recalcule le hash. Le seul geste manuel qui reste sur ce fichier est le préfixe de `CACHE`, à changer pour forcer une vraie purge (changement de stratégie qui rendrait les entrées gardées nuisibles).
- **L'enregistrement du service worker vit DANS le bloc `BUILD:ONLINE-ONLY` d'`app.html`** : le fichier autonome ne doit pas en hériter (inutile hors ligne, et invalide en `file://`). Le portail (`index.html`) porte son propre petit script d'enregistrement.
- **`start_url` pointe sur `./`** : l'icône installée ouvre le **portail** (qui annule le `./app.html` de la veille — atterrir directement dans les flashcards surprenait). (Une PWA installée avant garde son ancien `start_url` — la réinstaller une fois.)
- Les icônes sont un א en Frank Ruhl Libre 700 (la police du bandeau de l'app) sur fond `--bg`, or `--gold` ; en cas de changement de palette, les régénérer (ImageMagick). ⚠️ `icons/` **n'entre pas** dans le hash qui estampille `VERSION` : une icône régénérée ne déplace donc pas la version. Conséquence bornée — tout le même-origine étant en *stale-while-revalidate*, la nouvelle icône arrive avec un lancement de retard.
- Limite iOS : l'icône d'une PWA déjà installée est figée à l'installation — supprimer/réajouter l'app pour la rafraîchir.

## Charte graphique unifiée

Le bloc `:root` (11 tokens : `--bg`, `--bg2`, `--card`, `--card-edge`, `--ink`, `--ink-dim`, `--gold`, `--gold-soft`, `--green`, `--red`, `--line`) est **identique au caractère près** dans le carnet, `app.html` et le portail — non plus par discipline mais **par construction** : sa source unique est [src/tokens.css](../src/tokens.css), injectée au build au marqueur `<!-- @TOKENS -->` de chacune des trois sources (brute pour le carnet, dont le `:root` s'ouvre à la racine du `<style>` ; réindentée de 2 espaces pour l'app et le portail, où il est imbriqué d'un cran). Une retouche de couleur s'écrit **une fois**, dans `src/tokens.css`, et `node tools/build.js` la répercute ; restent à la main `manifest.webmanifest`/`theme-color` (vérifiés par `verifieCharte()`) et les icônes (qu'aucune commande ne vérifie) si le fond ou l'or change.

## Accessibilité du carnet

Le carnet est aligné sur `app.html` et `index.html` pour l'accessibilité : mêmes règles
`@media`, même attribut `lang`, même garde de mouvement. Ce qui est acquis, et à préserver :

- **`lang="he"` sur 100 % des nœuds hébreux** (le compte **se mesure dans le
  navigateur, il ne se calcule pas** : ajouter une entrée au carnet crée aussi ses `span.cursive`,
  donc un mot ajouté pèse plus d'un nœud). Trois familles à connaître quand on ajoute
  du contenu : les éléments purement hébreux portent l'attribut **directement** dans la source
  (`span.he`, `span.toc-he`, `span.part-he`, `div.ex-he`, les `<h2>` de section, le `<h1>`) ; les
  `span.cursive` sont **générés par le JS** du carnet, qui pose `cursive.lang = 'he'` à la création ;
  et l'hébreu **inséré dans de la prose française** (notes, en-têtes `Présent (הֹוֶה)`, gloses) est
  enveloppé au cas par cas dans un `<span lang="he">`. Sans cela un lecteur d'écran prononce
  l'hébreu en phonétique française — sur un document dont l'hébreu *est* le produit.
- **Garde `prefers-reduced-motion`**, qui doit inclure `scroll-behavior:auto`. Le `transition:none`
  global de l'app **ne suffirait pas** ici : c'est le défilement doux (`html{scroll-behavior:smooth}`)
  qui anime les 42 liens du sommaire.
- **Bloc `@media (pointer:coarse)`** tenant les cibles à 44 px : pastilles du sommaire, `.app-link`,
  `.search-clear` (elle était à 28 px alors que son jumeau dans l'app était déjà à 44).
- Le champ de recherche porte un `aria-label` (il n'avait qu'un `placeholder`).
- **Anneau `:focus-visible` doré global**, identique à celui des deux autres fichiers
  (`outline:2px solid var(--gold)`, offset 2px, **jamais de `border-radius`**). ⚠️ Les deux `transition:all` du carnet ont été corrigés **avant** de poser
  l'anneau : dans l'autre ordre il serait né déjà cassé (voir le piège décrit plus bas, il vaut
  pour les trois fichiers et pas seulement pour `app.html`). Mesuré sous vraie tabulation :
  23 focusables déclarés, 1 masqué, **22 arrêts, 0 sans anneau d'or**.
- **`<main>`** autour des trois parties. Le `<nav class="toc">` et la barre de recherche restent
  **hors** du landmark : l'un est une navigation, l'autre un outil global.
- **`theme-color`** et `-webkit-tap-highlight-color:transparent` alignés sur les deux autres
  fichiers (la chrome Safari changeait de couleur en passant du portail au carnet).

### Conventions visuelles propres au carnet

Six règles nées des passes de charte, de typographie et de mise en page, à ne pas défaire
par inadvertance :

- **Les deux colonnes, et le troisième bloc `:root`.** Le carnet porte une colonne de
  lecture (`--colonne` 28rem pour la prose, `--colonne-large` 56rem pour le cadre : tables,
  en-tête, sommaire), dans un **troisième** bloc `:root` local — les trois ne se fusionnent
  jamais. La mise en œuvre passe par le `padding-inline` de `main`, **et non par
  `max-width` + marges auto** : le padding centre le cadre sans toucher aux marges
  verticales des enfants, dont la fusion règle tout le rythme du document.
  ⚠️ **Les deux valeurs sont mesurées, pas choisies** : `--colonne-large` est un plancher
  (la table la plus large se pose à ~890px, aucune au-delà de 894 ; sous 55,6rem les
  tables passent en défilement — 4 sur 36 —, et `--colonne` se calibre sur l'avance réelle de la prose (6,63px par
  caractère), jamais sur la largeur d'un chiffre (7,87px, soit 19 % de trop).
  ⚠️ **Piège de cascade** : `main > *:not(.table-wrap)` pèse 0,1,1 et fait **plancher de
  spécificité** — tout sélecteur d'élément nu qui voudrait le contredire (`main > h2`,
  `main > ol`…) est ignoré **en silence**. Détail et les trois pièges : DESIGN.md §3.

- **La rampe de 8 pas, et le socle qu'elle corrige.** ⚠️ `font-size:22px` est posé sur
  **`body`**, jamais sur `html` — dans les trois fichiers — donc **1rem vaut 16px**, pas
  22px (mesuré en WebKit). Le commentaire qui affirmait « tout le reste est en
  rem/em et suit » était faux, et c'est ce malentendu qui avait produit 24 tailles
  distinctes : chacune poussée à tâtons contre une base inerte. Le carnet porte désormais
  une rampe de 8 pas (`--pas-titre` … `--pas-micro`) dans un **second** bloc `:root`, local
  au fichier — le premier reste le jeu de jetons partagé, identique au caractère près.
  Aucune taille littérale hors rampe ; seule exception nommée, le `1.15em` de l'hébreu en
  prose, relatif par nature. **Ne pas déplacer le 22px sur `html`** pour « réparer » :
  ×1,375 sur chaque `rem` d'ici *et* d'`app.html`. Détail : DESIGN.md §3.
- **Tout hébreu se compose en Frank Ruhl**, y compris les 429 suites insérées au milieu
  d'un paragraphe français, atteintes par `span[lang="he"]:not([class])` (serif + 1,15em).
  Elles héritaient d'Assistant, ce qui violait la règle des trois voix *et* celle de la
  vedette, et rendait le nikoud illisible dans les passages qui l'enseignent. Deux voix
  déclarées sont **explicitement exclues** et gardent la main sur leur hébreu : `thead th`
  (voix Title) et `.tr` (mono).

- **Deux voix de micro-titre, pas quatre.** `thead th, .subtheme` portent la voix Title
  (Assistant 700 / 0,84rem / 0,12em / or) ; `.toc-group-label, .part .part-num` portent la voix
  Repère-mono (JetBrains Mono / 0,7rem / 0,14em). Elles remplacent quatre specs ad hoc. Une
  nouvelle étiquette rejoint l'une des deux — on n'en invente pas une troisième.
- **`border:1px dashed` ne veut dire qu'une chose : « rien ici »** (`.empty`, section vidée par la
  recherche). Un encadré important prend un filet **plein** : c'est la classe `.attention` (×4).
  Le pointillé portait auparavant les deux sens opposés.
- **Aucune surface n'est teintée d'or au repos** : `.part` puis `.tip` ont été éteints, chacun
  après le test « action, sélection ou identité ? ». Seule la carte « Révision du jour » de l'app
  garde cette licence. Deux composants extraits au passage : `.attention` (×4) et `.gram-title`
  (×5, titres de sous-section de grammaire) — ces cinq-là vivaient dans des attributs `style=`
  du corps du document et **échappaient au détecteur**, qui ne lit que le CSS.

**Sûreté vis-à-vis de l'extraction — la question ne se pose plus.** Le mini-parseur HTML
de `build.js` n'existe plus (il n'en reste qu'une ligne de commentaire,
[build.js:100](../tools/build.js#L100)), et plus aucun outil du dépôt ne lit un artefact.
Le carnet n'étant qu'une **sortie**, un attribut ajouté à ses spans ne peut plus casser
d'extraction : il n'y en a pas. Ce qui reste à vérifier après une retouche de balisage est
`node tools/build.js --check` (les cinq artefacts en phase) et le filtre de recherche du
carnet, qui travaille sur `textContent` — envelopper l'hébreu ne doit pas le casser
(le compte du jour se relit par `node tools/cherche_mots.js <terme>` — ne pas le recopier ici, il bouge à chaque lot).

## Flux de données : du carnet aux cartes

### 1. Le carnet expose une structure conventionnelle

Cette structure vit désormais dans `data/*.json` (schéma complet dans `data/SCHEMA.md`) ; le carnet généré ne fait que l'afficher selon les mêmes conventions visuelles qu'avant — il n'est plus jamais reparcouru pour en extraire quoi que ce soit.

Chaque fichier de liste (`data/listes/<slug>.json`) porte un champ `section`. **Le texte exact de ce champ est la clé d'extraction** (`'Verbes'`, `'Noms'`, `'Nombres (0–10)'`…) — il doit correspondre au label `.count` du `<h2>` que `genereCarnet()` rend dans le carnet ; une valeur orpheline détache silencieusement la section des flashcards.

Deux formes d'entrées :

- **`data/noms.json`, `data/adjectifs.json`, `data/verbes.json`** — un objet par mot (`he`, `fr`, `niveau`, `theme`, `groupe`, `exemples`, et selon la catégorie `genre`/`pluriel` ou `formes` ×3/×4). Rendus en tables par `genereCarnet()` ; lus directement par `deriveCartes()`, sans lecture positionnelle de colonnes.
- **`data/listes/<slug>.json`** — `{ section, entries: [{ he, tr, fr, fr_court?, niveau, groupe?, exemples, note? }] }` pour pronoms, prépositions, nombres, expressions, **phrases**, etc. (voir la map `listCats`). La section **Phrases** (`section: 'Phrases'`) contient des phrases entières du quotidien : elles deviennent des cartes ordinaires (catégorie `Phrases`) et traversent tous les modes. La section **Hébreu parlé** (`section: 'Hébreu parlé'`) porte le registre familier — 45 entrées réparties en quatre `groupe` (`particules`, `conversation`, `reagir`, `emprunts`), chacune avec sa phrase d'usage, parce que תכלס ou דווקא ne veulent rien dire hors contexte. Ajouter une entrée `listCats` impose de la répercuter dans `build.js` (objet `listCats` **et** `EXPECTED_CATS`) **et** dans `catOrder` de [src/app/js/07-filtres.js](../src/app/js/07-filtres.js) : sans cette dernière ligne les cartes existent mais aucune puce ne s'affiche, `buildChips()` n'itérant que sur `catOrder`.

Une entrée peut porter des champs qui pilotent la carte sans toucher au code de l'app :

- `fr_court` — français court affiché sur la carte à la place du `fr` long ;
- `note` — précision affichée sous la réponse ;
- `niveau` — niveau CECRL fin (`A1`…`C2`) du mot (voir § 4). **Obligatoire sur toute entrée**, tables et listes confondues : `valideDonnees()` refuse une entrée sans `niveau` valide.
- `theme` — champ sémantique du mot (voir § 4.1), **obligatoire uniquement sur `noms.json`/`adjectifs.json`/`verbes.json`** (garde de couverture dans `build.js`). Les listes n'en portent pas — déjà mono-thème par nature — et `valideDonnees()` refuse un `theme` posé sur une entrée de liste.

Un mot peut aussi porter des **exemples en situation** (voir § 5) dans son champ `exemples` (tableau de `{he, tr, fr}`). `genereCarnet()` les rend en `<ul class="exemples"><li>` — imbriquée dans le `<li>` du mot (listes) ou en fin de première cellule (tables) — mais `deriveCartes()` les lit directement dans `donnees`, jamais en reparcourant ce HTML.

Les sections purement grammaticales (phrase sans verbe, racine, présent, passé, futur, impératif, conditionnel, binyanim, article, smikhut, suffixes possessifs, prépositions fléchies, particule d'objet את, hé directionnel, négation) n'ont pas d'équivalent dans `data/` : elles vivent en HTML statique dans `src/carnet/sections/` et sont volontairement exclues des flashcards. C'est aussi la façon d'**enseigner un mot sans créer de carte** — le lexique du validateur lit ces sections de grammaire (§ 5.1), `deriveCartes()` non.

### 2. Le contrat gabarits/données (l'extraction HTML a disparu)

Il n'y a plus d'`extractCards()`, ni côté `app.html` ni côté `build.js` : les deux implémentations regex/DOM qui devaient rester synchrones ont disparu, avec le mode `node tools/build.js --verrou` qui servait à prouver leur équivalence, et le harnais de comparaison des carnets.

**Le dépôt ne contient plus une seule ligne de lecture de HTML.** Le mini-parseur qui restait dans `build.js` (`decodeEntities`, `firstSpanText`, `parseSections`, `closeOf`, `exemplesOf`, `attrOf`, `tdsOf`) n'avait plus que les scripts jetables de migration pour consommateurs : il a été supprimé avec eux, exports compris (`grep -c "function .*Of\b" tools/build.js` pour le vérifier). Le HTML ne fait plus que **sortir** du build. Si un besoin de relecture réapparaissait, le reprendre dans l'historique git plutôt que d'en réécrire un — un lecteur de HTML dans ce dépôt est le retour du couplage que trois chantiers ont servi à défaire.

À la place, un seul chemin : `chargeDonnees(racine)` (build.js) lit `data/*.json` en mémoire, `valideDonnees(donnees)` la valide (champs, niveaux, thèmes, thème interdit sur une entrée de liste), puis deux fonctions consomment cette même structure sans jamais repasser par du HTML :

- `genereCarnet(donnees, srcCarnet)` — assemble le carnet HTML depuis les gabarits de `src/carnet/`. ⚠️ **Le champ `note` sort désormais deux fois** dans `itemListe` : en attribut `data-note` (la forme lisible par une machine) *et* en `<span class="note-line">` visible, entre la ligne du mot et la sous-liste d'exemples. Il n'était rendu nulle part avant — 64 modes d'emploi que le carnet portait sans les montrer, alors que l'app les affiche au dos de la carte. Le texte passe par **`escFr` et non `esc`** : 52 des 64 notes contiennent de l'hébreu, qui doit porter son `lang="he"` ;
- `deriveCartes(donnees)` — dérive directement le tableau de cartes, validé en sortie par `assertFormeCartes(cards)` (forme des cartes : `cat`/`he`/`fr`/`he_plain` non vides, `tr === ''` sur les cartes de table, 4 formes pour un verbe, 3 pour un adjectif, 0 ou 1 pour un nom).

**Et plus aucun artefact n'est une entrée — sans exception**. `verifie_exemples.js` et `ajoute_mots.js` avaient besoin de `he2tr` / `trKey` / `editDist` pour rester d'accord avec l'appli, et les prenaient dans `app.html` en découpant le texte à l'accolade (`grabFunction`, dupliqué mot pour mot dans les deux outils). Ils passent désormais par **`fonctionsApp(noms, racine)`** (exportée par `build.js`), qui évalue le module source `src/app/js/02-translitteration.js` **en entier** dans un bac `vm` : le module est déclaré « logique pure » par son en-tête `// Expose :` et ne contient que des déclarations de fonctions, donc aucun découpage n'est nécessaire — l'extracteur a disparu des deux outils. Une fonction absente lève une erreur **nommée** (vérifié par casse fabriquée : renommer `he2tr` fait mourir les deux outils en exit 1). Corollaire concret : les outils tournent sur un dépôt fraîchement cloné, `app.html` absent — et le bac à sable d'`ajoute_mots.js` ne copie plus l'artefact, puisque plus personne ne le lit.

**L'arborescence de `data/` ne s'énumère qu'à un seul endroit** : `fichiersListes(racine)` (les fichiers de `data/listes/`, triés) et `fichiersDonnees(racine)` (les chemins relatifs de tout le contenu, tables puis listes, dans l'ordre de lecture), tous deux exportés par `build.js`. `chargeDonnees()` et le `construitIndexFichiers()` de `cherche_mots.js` portaient chacun leur propre `readdirSync` de `data/listes/` — deux endroits à corriger le jour où l'arborescence bouge, et rien pour signaler l'oubli du second. Un outil qui doit parcourir la source passe désormais par ces helpers, jamais par un `readdirSync` à lui.

Le garde-fou : `node tools/build.js --check` régénère les **cinq** artefacts en mémoire et les **compare au contenu près** à ce qui est committé (`vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html`, `index.html`), et recalcule l'estampille `VERSION` de `sw.js`. N'ayant plus qu'une seule fonction de dérivation par artefact, il n'existe plus de « côté non couvert » comme au temps des deux extracteurs : ce que `--check` valide couvre tout le chemin `data/` + `src/` → artefacts.

### 3. Le schéma de carte produit

```js
{
  cat,        // catégorie ('Verbes', 'Noms', 'Nombres', 'Phrases', …)
  he,         // hébreu avec nikud (une phrase entière pour la catégorie 'Phrases')
  tr,         // translittération de data/*.json, autoritaire ('' pour les cartes issues de tables)
  fr,         // français (préfixé '(infinitif) ' pour les verbes, suffixé ' (m)'/' (f)' pour les noms)
  he_plain,   // he sans nikud (stripNikud)
  note?,      // depuis le champ note
  niveau?,    // depuis le champ niveau ('A1'…'C2' — obligatoire dans data/, donc toujours présent)
  theme?,     // depuis le champ theme (slug de la taxonomie § 4.1 — cartes des trois tables uniquement)
  exemples?: [{ he, tr, fr, he_plain }], // depuis le champ exemples de l'entrée
  genre?,     // 'm' | 'f' (noms)
  forms?: [{ he, tr, label, he_plain }]  // conjugaisons, accords, pluriel
}
```

Ce schéma est produit par une unique fonction, `deriveCartes(donnees)` (build.js) : il n'y a plus deux implémentations dont l'ordre d'insertion des propriétés devrait rester synchrone — un changement d'ordre ici se répercute identiquement dans le carnet, `cards.json` et le fichier autonome, puisque les trois sortent de la même fonction.

Quand `tr` est vide, l'UI génère la translittération à l'affichage via `he2tr(card.he)`. Les cartes de catégorie `Phrases` reçoivent un affichage réduit (`.big-he.phrase` / `.big-fr.phrase`) pour que les longues phrases passent à la ligne proprement.

### 4. Les niveaux de difficulté (CECRL)

`data/*.json` stocke le **CECRL fin** (six valeurs, `niveau: "A1"…"C2"`, rendu en `data-niveau` sur le carnet généré) — standard, vérifiable contre des listes de référence — et l'app le replie en quatre libellés (table `NIVEAUX` d'app.html) : **Facile = A1, Intermédiaire = A2–B1, Difficile = B2–C1, Expert = C2**. Les chips de l'accueil sont construites depuis les données (`buildNivChips`) : un niveau vide n'affiche pas de chip — le carnet n'ayant rien au-delà de C1, « Expert » n'apparaîtra qu'avec les premiers mots C2 ; un corpus sans aucun niveau classé masque le groupe entier.

⚠️ **`EXPECTED_LEVELS` (build.js) est le verrou, et il est plus étroit que le CECRL fin.** Le champ `niveau` accepte en principe `A1`…`C2`, mais `valideDonnees()` refuse tout ce qui n'est pas dans `EXPECTED_LEVELS` — `['A1','A2','B1','B2','C1']`, où le palier **C1** a été ouvert avec le lot « mortier grammatical » (registre soutenu : כִּבְיָכוֹל, אוּלָם, עַל כָּל פָּנִים, כְּלַפֵּי…). Côté app, **rien à câbler** : `NIVEAUX` ([src/app/js/07-filtres.js](../src/app/js/07-filtres.js)) rangeait déjà C1 dans « Difficile », et la note de l'écran de réglages l'annonçait. Ouvrir C2 ne demandera donc, là aussi, que cette constante. ⚠️ **Mais l'ordre compte** : un palier listé dans `EXPECTED_LEVELS` sans aucune carte fait **échouer le build** (garde `missingLevels`) — ajouter le niveau et les mots qui le peuplent dans le même geste.

⚠️ **La distribution par niveau ne se recopie plus ici** : elle change à chaque lot de vocabulaire, et toute valeur écrite dans cette page est périmée dès le lot suivant. Une seule autorité, qui la recalcule depuis `data/` : **`node tools/cherche_mots.js --stats`**. (L'historique des lots successifs est dans TODO_ARCHIVE.md.)

**Méthode de classement** — trois critères croisés, dans cet ordre :

1. **Curricula d'hébreu L2 alignés CECRL** : le vocabulaire des niveaux d'oulpan (alef ≈ A1–A2, bet ≈ B1) et des manuels d'hébreu moderne pour débutants ; les listes de survie (salutations, nombres, jours, famille proche, nourriture de base) sont A1 par convention.
2. **Fréquence en hébreu moderne parlé** : un mot du top courant de la conversation quotidienne descend d'un cran (ex. `lehargish`, `beseder`), un mot rare ou littéraire monte (`tachat` littéraire → B2, `be'ad` → B2).
3. **Jugement quotidien vs abstrait/idiomatique** : concret du quotidien ≤ A2 ; abstractions (`emet`, `matarah`, `regesh`) ≥ B1 ; argot fin (`valah`) et mots de précision (`mikhshol`, `tsiporen`) B2.

Les cas limites se tranchent vers le bas (l'app sert des débutants : mieux vaut découvrir un mot « trop tôt » que de ne jamais le croiser). La relecture humaine se fait par échantillons, section par section — le classement vit dans le carnet, donc se corrige comme le reste du contenu : en éditant l'attribut, puis `node tools/build.js`.

### 4.1 Les thèmes sémantiques (`data-theme`)

Chaque `<tr>` des trois tables Noms/Adjectifs/Verbes porte un `data-theme` — le champ sémantique du mot, classé sur sa glose française. **Quinze thèmes** (douze à la taxonomie initiale ; `vetements-couleurs` ajouté le jour même en seconde passe, puis `argent-achats` et `loisirs-culture` en troisième passe le jour même encore, extraits des fourre-tout — voir les arbitrages ci-dessous), et la liste vit à **deux endroits qui doivent rester alignés** : `EXPECTED_THEMES` dans build.js (le garde-fou) et la table `THEMES` dans app.html (slugs + libellés + ordre des chips). Voici le **contrat** — les slugs et leurs libellés, qui eux ne bougent pas :

| Slug | Libellé (app) |
| --- | --- |
| `abstrait` | Notions abstraites |
| `argent-achats` | Argent & achats |
| `communication-pensee` | Parler & penser |
| `corps-sante` | Corps & santé |
| `emotions-caractere` | Émotions & caractère |
| `famille-personnes` | Famille & personnes |
| `loisirs-culture` | Loisirs & culture |
| `maison-objets` | Maison & objets |
| `nature` | Nature & animaux |
| `nourriture` | Nourriture & repas |
| `temps-calendrier` | Temps & calendrier |
| `travail-etudes` | Travail & études |
| `vetements-couleurs` | Vêtements & couleurs |
| `vie-quotidienne` | Vie quotidienne |
| `ville-transport` | Ville, lieux & transports |

⚠️ **Le nombre de cartes par thème ne se recopie pas ici** — il change à chaque lot. `node tools/cherche_mots.js --stats` l'imprime, trié du moins doté au plus doté, avec la ventilation par niveau : c'est la commande à lancer pour répondre à « quel thème manque ? ».

**Le périmètre est délibérément les trois tables.** Les sections listes (nombres, jours, saisons, pronoms…) sont déjà mono-thème par nature : leur catégorie *est* leur thème, un tag serait redondant. `build.js` tient la frontière dans les deux sens : **couverture intégrale** des trois tables — le build imprime le rapport `n/n` et une entrée ajoutée sans `theme` échoue en nommant le mot — même règle de couverture que `data-niveau`), slug hors `EXPECTED_THEMES` refusé (une faute de frappe créerait un thème fantôme), et `data-theme` posé sur une liste refusé aussi.

Côté app, le filtre est **optionnel** — c'est sa différence voulue avec Catégories et Niveau : aucune puce cochée = « Tous », rien n'est bloqué ; dès qu'un thème est coché, le croisement devient thème × catégorie × niveau **et les cartes sans thème (les listes) sortent du jeu**. `buildThemeChips()` construit les puces depuis les données (thème vide → pas de puce ; slug inconnu de `THEMES` → puce quand même, libellé = slug, le temps qu'on lui donne son libellé) ; préférences persistées dans `prefs_v1` (champ absent = rien de coché, les profils d'avant ne voient rien changer) ; la révision du jour ignore le thème comme elle ignore le niveau.

**Arbitrages de classement assumés** (un seul thème par mot, tranché sur l'usage dominant) : affamé/assoiffé, kilo/litre/gramme → `nourriture` ; hôpital → `corps-sante` ; plage, chaud/froid → `nature` ; vouloir/décider/choisir → `communication-pensee` ; perdu/proche/loin → `ville-transport`. Un reclassement se fait comme pour le niveau : éditer l'attribut dans le carnet, puis `node tools/build.js`.

### 5. Les exemples en situation

Chaque exemple est une phrase **écrite et affichée** — hébreu avec nikud, translittération au standard maison, français — jamais portée par le seul audio (PRODUCT.md : l'aisance orale est le but, le texte reste le vecteur). Côté app, le pli « Voir un exemple » (`exHtml`/`exBind` dans app.html) n'apparaît que là où la réponse est déjà visible : verso des Cartes, feedback de Saisie, verdict du QCM — jamais côté recto en fr→he (l'exemple contient le mot). Le tiroir de la recherche les affiche aussi (`srd-ex`). Le libellé du pli suit son état (« Voir un exemple » ↔ « Masquer l'exemple », géré dans `exActivate`). Un bouton Écouter par exemple lit la phrase entière (masqué sous `no-he-voice`). La délégation d'événements suit le motif `bindTap` avec `stopPropagation` — sans lui, toucher le pli retournerait la carte.

**Ligne éditoriale.** Les tables Noms, Adjectifs et Verbes sont couvertes à **100 %**, et `verifie_exemples.js` en fait une **règle bloquante** : un mot ajouté à l'une de ces trois tables sans exemple met le contrôle en échec (verbes : phrase au présent). Le compte courant s'affiche à chaque `node tools/build.js`. Les règles : phrases courtes (3–8 mots — les phrases nominales de 3 mots sont idiomatiques, l'hébreu n'a pas de « être » au présent), présent, vocabulaire de l'exemple proche du niveau du mot (les niveaux de § 4 disent par où commencer) — **le validateur tolère +1 niveau et n'alerte qu'à +2** : une phrase du quotidien pour un verbe A1 réclame des noms concrets (תִּינוֹק, מַתָּנָה, מִכְתָּב) qui sont A2 par nature, alerter à +1 noyait le signal dans l'inévitable —, une situation concrète du quotidien par phrase. **Workflow des lots** : les lots suivants s'écrivent sans relecture humaine — chaque lot doit passer `node tools/verifie_exemples.js` (0 erreur ; les avertissements sont des signaux éditoriaux à arbitrer), puis `node tools/build.js`, avant commit.

**Le contrat de sigle** (`estSigle()` dans `verifie_exemples.js`). Deux des contrôles du validateur sont **invalides par catégorie** sur un sigle, et non simplement sévères. (a) *Le nikoud* : un sigle est une suite d'initiales, il ne se vocalise pas — le pointer serait une faute, pas une rigueur. (b) *La concordance avec `he2tr`* : `he2tr` est un transcripteur lettre→son, or la prononciation d'un sigle est **lexicale**, donc non dérivable — ז"א se lit *zot omeret*, עו"ד *orekh din*, צה"ל *tsahal* —, si bien que l'écart dépasse forcément le seuil. Le premier contrôle est donc **sauté** sur un sigle, le second **rétrogradé en avertissement** avec un message qui nomme la raison.

⚠️ **Le sigle se reconnaît à sa typographie, jamais à une liste de catégories exemptées.** Gershayim avant la dernière lettre (צה"ל), apostrophe **finale** de troncation (וכו'), ou points (נ.ב.). La règle vaut ainsi partout dans le corpus — un sigle cité dans un exemple de Noms est traité comme celui d'une liste — au lieu d'ouvrir un trou par section, où n'importe quel mot non vocalisé passerait. ⚠️ **L'apostrophe non finale ne compte pas** : elle note un son étranger (ג' = *j*, צ' = *tch*) sur un mot ordinaire, qui lui reste soumis au contrôle. Les deux sens de l'exemption sont éprouvés par cas fabriqué : un mot ordinaire non vocalisé **dans une phrase portant par ailleurs un vrai sigle** échoue toujours (l'exemption est par jeton, pas par phrase), et ג'ירפה non vocalisé échoue aussi.

### 5.1 Le lexique du validateur (deux garde-fous à ne pas retirer)

Le contrôle « ce mot est-il enseigné par le carnet ? » repose sur un lexique que
`verifie_exemples.js` construit en deux temps.

1. **Les cartes** (`deriveCartes`, sur les données chargées par `chargeDonnees()`), avec leur `niveau` et leurs formes conjuguées.
2. **L'hébreu des sections de grammaire**. Les prépositions fléchies,
   les conjugaisons et l'article ne produisent **aucune carte**, mais leurs formes sont bel et
   bien enseignées : שֶׁלְּךָ et שֶׁלָּנוּ figurent en toutes lettres dans le carnet et étaient
   pourtant signalés « hors carnet ». Le validateur posait la question « ce mot est-il une
   carte ? » quand la vraie question est « le carnet l'enseigne-t-il ? ».

Les deux garde-fous de l'étape 2, chacun contre un mode de panne silencieuse :

- **Les `<ul class="exemples">` sont exclus du balayage.** Sans quoi le contrôle deviendrait
  circulaire : chaque phrase validerait son propre vocabulaire, et le capteur ne dirait plus
  jamais rien.
- **Un mot de grammaire ne peut qu'*ajouter* une entrée inconnue, au niveau 0** (non classé =
  toujours permis) — jamais abaisser le niveau d'un mot déjà connu. La fonction `feed()` des
  cartes retient volontairement le niveau **le plus bas** ; réutilisée telle quelle ici, elle
  aurait rabaissé à 0 le niveau de toute carte citée en grammaire et neutralisé le contrôle de
  niveau sans qu'aucun test n'échoue.

## build.js : la chaîne de génération

`node tools/build.js` (ou `--check` pour vérifier sans écrire) :

1. Lit `data/*.json` (`chargeDonnees`), valide (`valideDonnees`), dérive les cartes (`deriveCartes`) et régénère le carnet (`genereCarnet`) depuis `src/carnet/`. **Affiche le compte par section, par niveau CECRL, par thème et par section d'exemples** et sort en erreur si une catégorie de `EXPECTED_CATS` (`EXPECTED_CATS` dans [build.js](../tools/build.js)) ou un niveau de `EXPECTED_LEVELS` est vide, **ou si une seule entrée sort sans `niveau` valide** (garde de couverture : elle nomme les mots fautifs et affiche une ligne « couverture N/N », de sorte que le contrôle annonce ce qu'il mesure) — mêmes règles pour les thèmes : slug hors `EXPECTED_THEMES` refusé, `theme` hors des trois tables refusé (§ 4.1). Ces gardes vivent désormais dans `valideDonnees()`, au niveau des données, avant même la dérivation des cartes.
2. **Assemble `app.html`** (`assembleApp()`) : `src/app/coquille.html` porte trois marqueurs — `<!-- @TOKENS -->` (le `:root` de `src/tokens.css`, ré-indenté à l'assemblage), `<!-- @CSS:app -->` (les 6 fragments de `src/app/css/`), `<!-- @JS:app -->` (les 14 modules de `src/app/js/`) —, l'ordre des deux concaténations étant porté par `src/app/ordre.json`. Les trois substitutions passent par `mustReplace` : un marqueur disparu est une erreur bruyante, jamais un CSS perdu en silence.
3. Dérive **le fichier autonome de l'app fraîchement assemblée en mémoire** (jamais de l'`app.html` du disque : `--check`, qui n'écrit rien, validerait sinon un déphasage) et applique des remplacements ancrés (`mustReplace`) :
   - bannière « fichier généré » après le doctype ;
   - suppression du loader et de la couche PWA, panneau setup visible d'emblée ;
   - `let CARDS = []` → `const CARDS = [...]` (snapshot JSON des cartes dérivées) ;
   - bloc `BUILD:ONLINE-ONLY` → démarrage direct (`buildChips()` + `updateStart()`).
4. Vérifie qu'aucune trace du chemin réseau (`fetch(`, `DOMParser`, `serviceWorker`, `BUILD:ONLINE-ONLY`) ne subsiste dans le fichier autonome, que la taxonomie des thèmes est en phase entre `build.js` et l'app assemblée (`verifieTaxonomieApp`), et que la charte tient (`verifieCharte`, § Garde-fous).

⚠️ **Les deux concaténations n'ont pas le même séparateur, et c'est voulu** : les modules JS sont joints par `join('\n')`, les fragments CSS par `join('')` — c'est ce `join('')` qui porte la byte-identité du CSS avec l'avant-chantier. Un fragment CSS finit donc par un saut de ligne, un module JS **jamais** ; corollaire payé une fois, `99-principal.js` doit conserver son `\n` final explicite, sinon le regex de fence ne matche plus (rien ne suit `<!-- @JS:app -->` dans la coquille).

**Règle de travail : lancer `node tools/build.js` après toute édition de `data/*.json` ou de `src/`**, vérifier les comptes, puis contrôler dans le navigateur que le loader affiche le « N mots chargés » attendu.

## Anatomie de l'app (sources `src/app/`, artefact `app.html`)

L'app se lit dans ses sources et se déploie en un seul fichier : `src/app/coquille.html` (le `<head>`, les quatre écrans, les trois marqueurs), 6 fragments CSS et 14 modules JS, tous concaténés dans l'ordre de `src/app/ordre.json`. **Le scope top-level reste partagé** — la concaténation ne change rien à l'exécution, il n'y a ni module ES ni IIFE : le découpage est une convention de lecture, pas une barrière technique.

Chaque module s'ouvre donc sur un en-tête `// Expose : … — Utilise : …` qui tient lieu d'interface : **« Expose » liste les noms top-level qu'un *autre* module référence** (fonctions comme variables) ; ce qui n'y figure pas est local par convention (`voicesCache` en 06, `NIVEAUX` en 07, `SRS_INTERVALS`/`SRS_MASTER` en 08). ⚠️ Les `function` sont hoistées, l'ordre y est libre, mais **les `const`/`let` top-level doivent précéder leur premier usage à l'exécution** : `99-principal.js` porte tout ce qui s'exécute au chargement (les 39 instructions de démarrage, dans une séquence prouvée identique à l'avant-chantier, indice par indice).

⚠️ Les renvois ci-dessous pointent désormais le **module source**, pas l'artefact : les anciennes ancres `app.html:NNN` dérivaient à chaque build et envoyaient corriger un fichier régénéré. Pour la ligne exacte d'une fonction, `graphify explain <fonction>` la re-dérive mécaniquement — ne jamais recopier un numéro de ligne d'`app.html` dans la doc.

### Écrans

| Écran | Où | Rôle |
| --- | --- | --- |
| `#loader` | [src/app/coquille.html:42](../src/app/coquille.html#L42) | Spinner pendant le fetch du carnet (absent de la version autonome) |
| `#setup` | [src/app/coquille.html:43](../src/app/coquille.html#L43) | « Révision du jour » (SRS) en tête, recherche sous la barre de maîtrise, puis **quatre plis `<details class="adv">`** : Catégories (`#fold-cats`), Niveau (`#fold-niv`), Thèmes (`#fold-theme`) et « Réglages avancés » (`#adv`, [src/app/coquille.html:144](../src/app/coquille.html#L144)) qui porte Ordre/Longueur/Prononciation, le diagnostic de latence (`#perf-boot`/`#perf-note`) et « Repartir de zéro » ; entre les deux, les groupes Mode / Sens / Écriture restent dépliés |
| `#study` | [src/app/coquille.html:204](../src/app/coquille.html#L204) | La session (carte / saisie / QCM), bouton « ‹ Quitter ». Trois enfants seulement : `.progress-wrap`, `.stage` (la carte) et **`.answer-col`**, qui enveloppe tout ce qu'on *fait* de la carte — `#controls-cards`, `#undo-row`, `#flip-live`, `#input-zone`, `#quiz-zone`, `.kbd-hint`. Ce conteneur existe pour la grille du palier ordi (carte à gauche, réponse à droite, cf. DESIGN.md § Le palier « ordi ») ; **il est `display:flex; flex-direction:column` à toutes les largeurs**, y compris sous 900 px où il n'est qu'un conteneur transparent — c'est ce qui laisse le téléphone strictement inchangé malgré une boîte de plus dans l'arbre, les marges ne fusionnant pas en flex |
| `#done` | [src/app/coquille.html:260](../src/app/coquille.html#L260) | Bilan + liste des cartes ratées (`#missed-list`) + reprise des ratées / de la session |

### Réglages

L'écran setup utilise des toggles segmentés `.chip` portant des `data-*` (`data-mode`, `data-dir`, `data-script`, `data-order`, `data-audio`, `data-len`), câblés en boucle sur `SEG_KEYS` par `segPick(container, key, btn)` ([src/app/js/07-filtres.js](../src/app/js/07-filtres.js)) dans l'objet `state` ([src/app/js/99-principal.js](../src/app/js/99-principal.js)). Chaque groupe est un `role="group"` relié à son `<h2>` (`aria-labelledby`, notes en `aria-describedby`). Les trois groupes « qu'on règle une fois » (Ordre, Longueur, Prononciation) vivent repliés dans le `<details class="adv">` « Réglages avancés », fermé par défaut.

**Catégories et Niveau se replient de même**, dans deux `<details class="adv">` de forme identique : ce sont les deux plus gros points de décision de l'écran, **28 chips à eux deux** (25 catégories, 3 niveaux — les puces vides ne sont pas rendues, cf. les `filter` de `buildChips`/`buildNivChips`, d'où 3 et non les 4 `NIVEAUX` déclarés : « Expert » attend ses cartes C2), et les laisser dépliés allongeait le panneau au point de repousser « Commencer » hors de vue. Trois propriétés à ne pas casser :

- **Le `<h2>` du groupe *est* la rangée du `<summary>`** (et non un titre dupliqué au-dessus). Il reste la cible de l'`aria-labelledby`, donc le nom accessible n'est pas dédoublé ; il prend en revanche la voix du libellé de pli (`.adv summary h2.adv-lbl`) et non la voix Title dorée — un groupe replié se lit comme un pli, un groupe déplié comme une section.
- **Le `<summary>` résume la sélection** (`refreshFoldSubs()`, appelé depuis `updateStart()` — donc par toutes les voies qui changent la sélection : chips, `#selall`, remise à zéro, restauration des préférences). Au-delà de deux entrées on compte au lieu de lister, une liste coupée à l'ellipse étant mensongère ; l'ordre suit `catOrder`, c'est-à-dire celui des chips à l'écran.
- ⚠️ **L'état ouvert/replié se décide au chargement seulement** (`applyFoldState()`, depuis `applyPrefs()`) : ouvert tant que la sélection est vide. Sinon un profil vierge — qui par décision n'a aucune catégorie ni aucun niveau coché — n'offrirait plus rien à faire, et `#start-hint` désignerait des chips invisibles. Ensuite le pli n'obéit qu'à l'utilisateur : le refermer sous son doigt au premier choix serait hostile. `buildNivChips()` masque le pli entier quand le carnet ne porte aucun `data-niveau` ; même règle pour le pli « Thèmes » (`buildThemeChips()` et `data-theme`), à ceci près que ce pli-là ne s'ouvre jamais tout seul — sa sélection vide veut dire « Tous », pas « à faire ».

Sous `@media (pointer:coarse)`, le bouton « Commencer » est `position:sticky` en bas d'écran (zone du pouce) **tant qu'il est actif et seul allumé** (`body:not(.has-due) .start:enabled`), l'indice de sélection vide (`role="status"`) étant placé **au-dessus** de lui pour rester visible. Désactivé, il quitte le sticky *et* l'or pour une peau pleine et opaque : collant et translucide, il recouvrait quatre chips de catégories au premier écran en interceptant leurs taps (mesuré en WebKit, cf. DESIGN.md § CTA sous le pouce). Il quitte aussi l'or et le sticky **quand des cartes sont dues** — la carte « Révision du jour » est alors la lampe, et deux lumières simultanées ne feraient aucune hiérarchie (DESIGN.md § CTA sous le pouce, les trois registres). Détail des clés :

- **mode** : `cards` (recto-verso), `input` (saisie tapée) ou `quiz` (QCM à 4 choix — `pickDistractors` ([src/app/js/12-qcm.js](../src/app/js/12-qcm.js)) sert les mauvaises réponses par **cascade**, du plus exigeant au filet : même `theme` + même `cat`, puis même `theme` + autre `cat`, puis même `cat`, puis autre `cat`, puis un dernier recours relâché qui garantit 4 options quel que soit le vivier. Le **thème d'abord** est ce qui empêche de résoudre le QCM par élimination sans reconnaître le mot ; ⚠️ seules les cartes des 3 tables portent `theme` (proportion du jour : `node -e "const c=require('./cards.json').cartes;console.log(c.filter(x=>x.theme).length+'/'+c.length)"`), donc les deux premiers étages sont gardés par `if(card.theme)` — sur une carte de liste ils se sautent en entier, sans quoi tous les `theme` absents s'apparieraient entre eux. À tous les étages sauf le dernier recours, on **écarte tout candidat dont une variante française frôle celles déjà retenues** (égalité ou Levenshtein ≤ 1) : pas de quasi-synonymes entre les options, et en fr→he pas de « deuxième bonne réponse » — garde-fou d'autant plus sollicité que des distracteurs du même thème sont sémantiquement plus proches ; les options de la catégorie « Phrases » portent la classe `.qc.ph` — corps réduit et boutons resserrés, pour que quatre phrases complètes empilées restent lisibles sur petit écran) ;
- **direction** : `he2fr` / `fr2he` ;
- **niveau** (hors `SEG_KEYS` — multi-sélection comme les catégories) : le groupe « Niveau » (`#niv`, chips construites par `buildNivChips`) filtre le pool de `start()` en **croisement** avec les catégories (`nivOk(card)`). La « Révision du jour » l'ignore volontairement : une carte apprise reste due quel que soit le filtre. `updateStart()` distingue trois vides — aucune catégorie, aucun niveau, croisement sans carte — avec un indice dédié pour chacun ;
- **script** : nikud, sans nikud, ou cursive ;
- **audio** : voix hébraïque de `SpeechSynthesis` du navigateur (`loadVoices`/`speak`). Deux valeurs : « Au clic » (seul le bouton haut-parleur déclenche la lecture) et « Automatique » (lecture au rendu de la carte et à la révélation de l'hébreu) — le réglage est respecté dans **tous** les chemins de réponse. Sans voix hébraïque détectée, `reflectVoiceUi()` pose `body.no-he-voice` (boutons haut-parleur masqués) **et** désactive les chips « Prononciation » ; quand une voix est trouvée, la note du groupe affiche **son nom réel** (« Voix hébraïque détectée ✓ — Carmit ») **et, sur une seconde ligne `.voice-id` en voix Label et en LTR, son `voiceURI`** (« identifiant : com.apple.ttsbundle.Carmit-compact »). C'est l'outil de diagnostic de la synthèse robotique : le nom **renvoyé par `getVoices()`** ne dit pas la qualité, alors que l'identifiant, lui, la porte. Un suffixe `…-compact` confirme le plafond de WebKit sur iOS ; un `.enhanced.`/`.premium.` signifierait que son filtre a changé (cf. TODO.md point 3).

  ⚠️ **`name` est localisé par le système — ne jamais y brancher de logique.** iOS écrit bien la qualité dans le nom qu'il affiche dans ses Réglages, mais traduite : « Carmit (forbedret) » sur un téléphone en norvégien, « Erweitert » en allemand, « Enhanced » en anglais. C'est précisément l'écart entre ce nom-là et le « Carmit » nu que voit l'app qui **prouve** le filtre de WebKit, mesuré sur l'appareil. Conséquence pour le code : `loadVoices()` classe et filtre d'abord sur **`voiceURI`** — identifiant reverse-DNS jamais traduit — et ne se rabat sur `name` qu'ensuite. Tester `name` seul, comme le faisait la première version, dégradait silencieusement le classement sur tout appareil non anglophone.
  ⚠️ **Plafond de plateforme, mesuré** : sur iOS, la voix ne sera **jamais** une variante « Enhanced » ou « Premium ». WebKit filtre `getVoices()` sur `AVSpeechSynthesisVoiceQualityDefault` (bug WebKit 203689, pour réduire la surface de fingerprinting) et Apple le confirme : *« with Web Speech APIs only the pre-installed voices are available »*. `name` et `quality` sont deux champs distincts côté système, et l'API Web Speech n'expose pas le second : **le nom renvoyé par `getVoices()`** ne dira donc jamais la qualité, quelle que soit la variante installée. ⚠️ *Ne pas surinterpréter cette phrase* — le nom que **iOS** affiche dans ses propres Réglages, lui, la dit (traduite) ; c'est l'écart entre les deux qui prouve le filtre, et une rédaction antérieure de cette note l'avait à tort étendue à tous les noms. Ne pas conseiller à l'utilisateur d'installer une voix de meilleure qualité : la PWA ne pourra pas s'en servir. Seul `voiceURI` porte la qualité (`com.apple.ttsbundle.Carmit-compact` vs `com.apple.voice.enhanced.…`) — il est **affiché en permanence** sous le nom, et sert désormais de détecteur : s'il passait un jour à `.enhanced.`, le sujet se rouvrirait (cf. TODO.md point 3) ;
- **longueur** (`state.len` : `'10'|'20'|'50'|'all'`, défaut `'20'`) : `limitPool()` tronque le jeu **après** le mélange dans `start()` (aléatoire = pioche différente à chaque session ; dans l'ordre = les N premières). `startReview()` l'applique aussi, après tri des cartes dues par retard décroissant — le reste demeure dû et réapparaît sur la carte de révision (sous-titre explicite quand dû > limite). « Rejouer les ratées » n'est volontairement **jamais** limité.

Chaque mode a sa zone dans `#study` (`#controls-cards` / `#input-zone` / `#quiz-zone`) et un `setup*Card()` qui bascule les classes body `input-mode` / `quiz-mode` ; `render()` aiguille selon `state.mode`. Le passage à la carte suivante est mutualisé (`nextAfterInput`, réutilisé par le QCM). Toutes les entrées de session (catégories, révision, rejeu) passent par `beginSession(pool)` ; `state.origQueue` mémorise le jeu de la session pour que « Recommencer » le rejoue tel quel (jamais un re-filtrage — sinon une session de révision repartirait à vide).

### Révision espacée (système de Leitner)

Couche de mémorisation persistée, **invisible pour `build.js`** (pur état applicatif) :

- `recordResult(card, good)` est appelé depuis **tous** les chemins de réponse (cartes `answer`, saisie `submitAnswer`/`skipAnswer`, QCM `quizPick`) et écrit un enregistrement par carte dans `localStorage`, clé `srs_v1`. Identité d'une carte : `cat|he` (forme **vocalisée**). ⚠️ Jamais `cat|he_plain` : la forme plate crée trois collisions d'homographes consonantiques (לְסַפֵּר raconter / לִסְפֹּר compter, לְלַמֵּד enseigner / לִלְמֹד étudier, מה שלומך m./f.) qui fusionnaient leur progression. `srsMigrateIds()` (appelée de `buildChips()`) recopie les anciennes clés vers les nouvelles au premier boot, les deux cartes d'une ancienne collision héritant chacune de l'entrée partagée.
- Chaque bonne réponse fait monter la carte d'une « boîte » (intervalle croissant, `SRS_INTERVALS`), un échec la remet à zéro. `dueCards()` renvoie les cartes arrivées à échéance ; le bouton « Révision du jour » (`startReview`) en fait une session tous thèmes confondus.
- `refreshSrsUi()` met à jour le compteur de cartes dues et la barre de maîtrise. Il est appelé à la fin de `buildChips()` — donc **dans les deux chemins de démarrage** (en ligne et autonome) sans toucher à `build.js` — ainsi qu'après chaque session. Il porte aussi la **source de vérité unique de l'état d'éclairage de l'accueil** : `document.body.classList.toggle('has-due', due>0)`, dont tout le reste est déduit en CSS. Il est le seul endroit à connaître déjà le compte, donc le seul à pouvoir poser le drapeau sans le recalculer.

### Persistance des réglages et reprise de session

Deux couches d'état applicatif, elles aussi **invisibles pour `build.js`**, restaurées via `buildChips()` (donc les deux chemins de démarrage) :

- **Préférences** (`localStorage`, clé `prefs_v1`) : `{cats, niveaux, mode, dir, script, order, audio, len}` — `niveaux` est **rétro-compatible** : absent des anciennes préférences (profil d'avant le filtre), il redevient « tout sélectionné », rien ne disparaît — mais un tableau présent et vide reste vide. `savePrefs()` est déclenché à chaque changement (`segPick`, chips de catégories, « tout sélectionner ») ; `applyPrefs()` restaure l'état **et** le reflète dans l'UI (`aria-pressed`). Au **premier lancement** (aucune préférence), **aucune catégorie ni aucun niveau n'est présélectionné** — le choix appartient à l'utilisateur (qui remplace l'ancien défaut « tout sauf Phrases » de `defaultCats()`) ; les six autres réglages gardent leurs valeurs initiales. `updateStart()` guide alors : indice « Choisis au moins une catégorie » (ou niveau) dans `#start-hint` et CTA désactivé tant que la sélection est vide.
- **Instantané de session** (`sessionStorage`, clé `sess_v1`) : `{queueIds, origIds, missedIds, idx, goodCount, total, session, mode, dir, script}`. `sessSave()` est appelé à chaque avancée (`render`) et réponse ; `sessRestore()` reconstruit la file par id de carte (`cat|he`, vocalisé) et rouvre `#study` directement. Si le vocabulaire a changé sous la session (un id manque, `idx` hors limites), la session est **abandonnée proprement** (`sessClear()`). Effacé à la fin (`finish`), à « Quitter » (`exit`) et au retour au menu (`back-setup`).
- **Verdict annulable dans les trois modes** (un pouce qui glisse ne doit pas polluer les boîtes de Leitner) : `recordResult` mémorise l'entrée SRS d'avant écriture (`lastRecord`), que `undoLastRecord` restaure. En **saisie**, `fixVerdict` (« J'avais juste → » après un raté, « En fait, je ne savais pas » après un juste ou un « Presque ») ré-enregistre le verdict inverse et rééquilibre `goodCount`/`missed`. En **QCM**, `quizFixVerdict` ([src/app/js/12-qcm.js](../src/app/js/12-qcm.js)) fait de même via le bouton `#quiz-fix` (mêmes libellés), qui se fige en confirmation (`✓ Compté comme réussi` / `✗ À revoir`) et s'annonce dans `#quiz-live`. En **Cartes**, la carte suivante étant déjà affichée, `undoCardAnswer` ([src/app/js/11-cartes.js](../src/app/js/02-translitteration.js)) revient en arrière via l'instantané `cardsUndo` posé par `answer()` : SRS restauré, `goodCount`/`missed`/`idx` réalignés, bouton « ‹ Annuler la dernière réponse » visible seulement quand un retour est possible. `beginSession` remet `cardsUndo`/`lastRecord` à zéro. En saisie, **Entrée/Vérifier sur champ vide est un no-op** (ni raté compté, ni écriture SRS — « Je ne sais pas » reste le geste volontaire).
- **Sortie explicite** : « Quitter » affiche sur l'accueil la ligne `#exit-note` (`role="status"`) « Session interrompue — X réponse(s) sur Y déjà comptée(s) dans ta révision » quand au moins une réponse a été donnée (les réponses sont déjà en SRS — le dire) ; masquée au démarrage suivant. Sur l'écran de fin, « Recommencer » est libellé « Rejouer ces N cartes » (même tirage `origQueue`), et une fin de **révision** avec ratées explique qu'elles sont aussitôt redevenues dues (effet Sisyphe du compteur, pas un bug).
- **Remise à zéro du profil** : la zone « Repartir de zéro » ferme le pli « Réglages avancés » (action rare et destructrice — jamais en concurrence avec « Commencer » ni la révision du jour ; le sous-titre du pli continue de n'annoncer que les valeurs mémorisées). Deux temps obligatoires : le bouton `#reset-btn` ouvre un bloc de confirmation qui **nomme la perte** (nombre de cartes suivies, via `masteryStats().seen`), « Annuler » est le défaut sûr et reçoit le focus. Confirmer efface `srs_v1`, `prefs_v1` (localStorage) et `sess_v1` (sessionStorage), remet en mémoire `SRS={}`, `lastRecord`/`cardsUndo` à `null` **et les six clés de réglage de `state` à leurs valeurs initiales** (`applyPrefs()` sans préférences ne les touche pas), puis rafraîchit l'UI en place — `applyPrefs()` (aucune catégorie ni niveau sélectionné, l'état du premier lancement), `refreshSrsUi()`, `updateStart()`, `#exit-note` masqué — sans recharger la page. Une ligne `role="status"` (`#reset-done`) annonce « Profil effacé », et le focus revient sur le bouton d'appel.
- **Écran d'erreur du loader** (`showLoaderError`, dans le bloc `BUILD:ONLINE-ONLY`) : diagnostic distinguant fichier local (`file://`), perte réseau et indisponibilité, avec un bouton « Réessayer » qui relance `init()`.
- **Diagnostic de latence** : `perfReport(label, segs, t0, tEnd)` mesure chaque geste instrumenté (chips catégories/niveaux, « tout sélectionner », `segPick`, `start`, `startReview`) en trois temps — **attente** (dernier `pointerup` capturé passivement → entrée du gestionnaire), **travail** (le gestionnaire, décomposé état/bouton/sauvegarde), **affichage** (gestionnaire → double `requestAnimationFrame`) — et l'écrit dans `#perf-note` (« Réglages avancés ») **après** la capture du temps de peinture, pour ne pas se mesurer lui-même. `init()` décompose de même le boot dans `#perf-boot` — **cartes (réseau) / lecture JSON / construction / total** —, masqué dans le standalone par `#perf-boot:empty{display:none}` (pas de fetch à y mesurer). ⚠️ `fmtMs` écrit une **fine insécable U+202F** avant « ms », en escape `\u202f` dans la source — invisible au terminal, elle fait échouer toute comparaison de texte naïve.

### Accessibilité (invariants)

- Tout hébreu généré porte `lang="he"` (`.big-he`, `.sub-he`, `.cursive-line`, `.f-he`, `.qc-he`, `.sr-he`, `.srd-he`, `.answer .he`, `.m-he` de la liste des ratées, marque) — à préserver dans les gabarits de chaînes.
- Focus clavier : un seul anneau global `:focus-visible` doré (aucun `outline:none` nu). Les
  **trois** fichiers le portent, et aucun ne pose de `border-radius` dessus
  (ce rayon ne décorerait pas l'anneau : il redessinerait l'élément tant qu'il est focalisé).
  ⚠️ **Ne jamais écrire `transition:all`** — dans `app.html` ni ailleurs : le raccourci capture les longhands
  `outline-*`, et WebKit les fige alors à leurs valeurs initiales (`medium` = 3 px, `currentColor`,
  offset 0) — l'élément rend l'anneau UA du navigateur *tout en matchant `:focus-visible`*. Le
  symptôme fait croire à un problème de cascade alors que les règles gagnent : c'est l'animation
  qui n'arrive pas à destination. Ce piège a coûté leur anneau aux 40+ `.chip` et aux boutons du
  mode Cartes (corrigé sur six règles dans `app.html`, deux dans le carnet).
  Toujours énumérer les propriétés animées : `background, color, border-color, opacity`.
  ⚠️ *Piège de mesure jumeau, appris le même jour* : lire `borderTopColor` **juste après** un
  `.focus()` par API renvoie encore la couleur de repos — la transition de 150 ms est **en vol**,
  et ça se lit à tort comme une règle qui ne s'applique pas. Attendre la fin de la transition
  (ou déclencher le focus par un vrai clic) avant de conclure à un défaut.
- Annonces aux lecteurs d'écran : `#feedback` (`aria-live`), `#quiz-live` (verdict QCM masqué visuellement, écrit dans `quizPick`/`quizFixVerdict`, vidé dans `setupQuizCard`), `#flip-live` (**verso du mode Cartes** — français + translittération, plus l'annonce « exemple disponible » quand la carte en a, alimenté par `doFlip()`, vidé au recto et à chaque nouvelle carte), `#done-msg`, `#loader-msg` et `#exit-note` (`role="status"`) ; `.bar` est un `role="progressbar"` mis à jour dans `render()`/`finish()`.
- Clavier, à égalité entre les modes : Cartes = Espace retourner, ←/→ juger ; Saisie = Entrée vérifier/passer ; **QCM = 1–4 choisir, Entrée/Espace « Suivant »** (un bouton focalisé garde la main) ; **P « prononcer »** rejoue l'audio dans tous les modes, aux mêmes conditions de visibilité que le bouton haut-parleur (jamais avant la réponse en fr→he, jamais sans voix) ; **C « corriger »** active le bouton de correction du mode courant (« Corriger » en Saisie et QCM, « Annuler la dernière réponse » en Cartes), seulement quand il est visible et actif — P et C ignorent les combinaisons Ctrl/Cmd/Alt (copier, imprimer restent au navigateur). L'indice `#kbd-hint` s'adapte au mode (masqué en saisie), sa mention de P disparaissant sous `body.no-he-voice` (`.spk-hint`).
- Groupes de réglages : chaque `.seg` (et `#cats`) est un `role="group"` + `aria-labelledby` vers son `<h2>` ; le pli « Réglages avancés » est un `<details>/<summary>` natif (clavier et lecteurs d'écran gérés par le navigateur).
- Recherche au clavier : `.sr-row` en `role="button"` + `tabindex="0"` + `keydown` (un vrai `<button>` est impossible : le bouton Écouter est imbriqué dedans), `aria-expanded` sur les lignes dépliables ; **une action par geste** : une ligne dépliable se contente de (dé)plier — l'audio reste sur son bouton Écouter — et une ligne sans détail prononce le mot ; la requête est échappée (`escapeHtml`) dans le message « Aucun résultat ».
- Cibles tactiles sous `@media (pointer:coarse)` (densité bureau inchangée) : chips élargies, `.search-clear`/`.sr-speak`/`.exit` 44 px, puis — après mesure de **dix** contrôles sous la barre — `.ex-speak` et `#speak-btn` en 44×44, `.ex-toggle`/`#fix-verdict`/`#quiz-fix`/`#btn-skip`/`#reset-btn` en `min-height:44px`, `#selall` et `.src-link a` passés en `inline-flex` pour gagner la hauteur. Tout nouvel élément interactif rejoint ce bloc.

### Correction des réponses tapées (la logique la plus délicate)

`checkAnswer` ([src/app/js/03-reponses.js](../src/app/js/03-reponses.js)) corrige avec tolérance et renvoie `'exact'`, `'almost'` ou `false` (toute valeur non-false = réponse acceptée) :

- **Direction hébreu → français** : `normFr` retire accents et casse ; `frVariants` éclate le champ français sur `/`, virgules, parenthèses et articles, pour accepter plusieurs formulations.
- **Direction français → hébreu** : accepte **soit** du vrai hébreu (clavier virtuel israélien intégré, rangées définies dans [src/app/js/99-principal.js](../src/app/js/99-principal.js) — replié derrière le bouton « Clavier hébreu », et **absent sur tactile** (`@media (pointer:coarse)`) : l'iPhone a son clavier hébreu natif, le virtuel ne sert que les claviers physiques AZERTY du bureau), comparé sans nikud (`normHe`), **soit** une translittération « à la française ». Celle-ci est repliée en clé canonique par `trKey` ([src/app/js/02-translitteration.js](../src/app/js/02-translitteration.js)) — `ph→f`, `kh/ch→h`, `q→k`, `w→v`, `tz/ts`, `ou→u`, apostrophes ignorées, doublons réduits — et comparée à `he2tr(card.he)` ([src/app/js/02-translitteration.js](../src/app/js/11-cartes.js)), le générateur hébreu→translittération piloté par le nikud, avec une petite tolérance de Levenshtein (`editDist`).
- **Pédagogie du verdict** : `'almost'` (accepté uniquement grâce à la tolérance `editDist`) fait afficher par `showInputFeedback` le verdict « ✓ Presque ! La forme exacte : » — vert, tentative affichée non barrée pour comparer. Les kinds de feedback sont `'ok' | 'almost' | 'no' | 'skip'` ; `fixVerdict` traite `ok`/`almost` comme « avait été compté juste ».

⚠️ `trKey` et `he2tr` doivent **converger vers la même forme canonique** : toute modification de l'acceptation se fait dans les deux ensemble. Et `he2tr` sert aussi à l'**affichage** dès qu'une carte n'a pas de `tr` de carnet.

### Le standard de translittération

Les `.tr` du carnet et la sortie de `he2tr` suivent la même convention : **kh** = khaf sans daguech, **ch** = het (avec patach furtif final → `ach`), **ts** = tsadi, **`'`** = ayin partout (`'ivrit`, `be'er`, `rega'`, patach furtif → `'a` : `yode'a`) et alef entre deux voyelles (`tsme'ah`), **hé final conservé** (`atah`, `zeh`), **ei** = tsere/segol + yud (`beit`), `u` (jamais `ou`), `f` (jamais `ph`), `k` (jamais `q`), `v` (jamais `w`). Le shva initial d'un groupe de consonnes n'est écrit que s'il s'entend (`gdolim` mais `ledaber`) — c'est la seule zone de jugement humain, le carnet fait foi. Grâce aux replis de `trKey`, ce standard est purement d'affichage : la saisie tolère toutes les variantes.

#### Ce que `he2tr` sait faire du shva initial — et pourquoi il s'arrête là

La règle « écrit seulement s'il s'entend » est **morphologique**, pas phonétique : un générateur piloté par le seul nikud ne peut donc pas la trancher partout. Le corpus, tabulé sur tous les mots à shva initial dont un humain a écrit le `tr`, dit **582 fois « garde le e » contre 155 fois « supprime »** — le défaut est donc de garder. La coupure nette est le préfixe : après le מְ du participe (272 mots, aucune exception), après לְ/בְּ/וְ/נְ/רְ/יְ, le `e` se garde ; à l'intérieur d'un groupe de racine, il tombe.

`he2tr` implémente l'approximation qui maximise l'accord mesuré : **il ne supprime le `e` qu'après ש, ס, כ, צ — et jamais devant une gutturale** (א ה ח ע ר, où le shva se prononce toujours). Chaque variante a été mesurée, y compris celles rejetées : ajouter ג coûtait 9 mots, d'où le fait que `gdolim` sort encore `gedolim`. Ce n'est pas une dette en attente, c'est la limite du procédé.

⚠️ **Ne pas « améliorer » cette classe de consonnes sans remesurer.** Le harnais tient en ~40 lignes : charger le module dans un bac `vm`, comparer `he2tr(he)` à chaque `.tr` écrit à la main (cartes, exemples, formes), et sortir trois nombres — accord exact, accord après `trKey`, distance d'édition totale. Un changement ne se garde que s'il améliore **les trois**. Ce que l'utilisateur ne perd jamais dans l'intervalle : `trKey` replie le `e` initial optionnel (`^(consonne{1,2})e(?=consonne)`), donc `gdolim` et `gedolim` sont la même clé et la saisie accepte les deux, quelle que soit la graphie affichée.

## Garde-fous contre la casse silencieuse

Onze filets, groupés par ce qu'ils rattrapent plutôt que par leur rang — la numérotation dérive, les familles non : les **cartes perdues** (1, 2), la **dérive d'artefact ou d'estampille** (3, 8, 9), la **casse de charte ou de taxonomie** (4, 5), le **silence d'un point de câblage** (10, 11), et la **preuve muette** (6, 7).

⚠️ **Chacune a été vue échouer sur un cas de casse fabriqué avant d'être crue.** C'est la règle qui donne leur valeur aux dix autres lignes de cette section : une garde qu'on n'a jamais vue rougir ne prouve rien, elle rassure. Un contrôle muet passe toujours au vert.

1. **`init()` dans app.html** ([src/app/js/99-principal.js](../src/app/js/99-principal.js)) : avertit (console + écran setup) si une catégorie attendue donne 0 carte au chargement.
2. **`node tools/build.js`** : compte par section, sortie non-zéro si une section de `EXPECTED_CATS` est vide, ancres `mustReplace` qui échouent bruyamment.
3. **`node tools/build.js --check`** : compare les **cinq** artefacts régénérés (`vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html`, `index.html`) au contenu committé — un artefact obsolète, une dérive des gabarits ou une dérive de `data/*.json` non répercutée se voient tous, puisque tous sortent de la même donnée. **Il recalcule aussi l'estampille** : la `VERSION` committée dans `sw.js` doit égaler le hash du contenu servi, sinon FAIL nommé. Le contrôle est *gardé* par le précédent (il ne s'exerce que si les cinq artefacts sont déjà prouvés en phase) : si l'un est périmé, le correctif est le rebuild, qui repose l'estampille au passage.
4. **Garde de taxonomie de `build.js`** : `EXPECTED_THEMES` est comparé aux slugs de la constante `THEMES` de l'app assemblée en mémoire. Un thème ajouté d'un seul côté échoue le build en nommant la liste fautive ; la disparition de la constante échoue aussi, plutôt que de passer au vert en ne comparant rien.
5. **`verifieCharte()` dans `build.js`** : mécanise les pièges n°2, 3, 4 et 5 de CLAUDE.md, fatale en mode normal comme en `--check`. **Élargi au portail** : les trois pages déployées y passent désormais, chacune sous sa forme fraîchement assemblée (jamais relue du disque — une garde qui interroge l'artefact committé valide le passé, pas ce que le build va écrire). Contrôles : `transition:…all` interdit dans l'app **et le portail** (WebKit fige les longhands `outline-*`, l'anneau de focus disparaît sans symptôme — le portail pose lui aussi un anneau or et anime ses portes) ; aucun `font-size` sur le sélecteur `html` (les trois) ; les jetons de `src/tokens.css` présents **verbatim** dans les trois, et le **nombre de blocs `:root` attendu par page** (carnet 3 — piège n°4, ils ne fusionnent jamais —, app 1, portail 1), ce qui interdit un second `:root` en dur qui reprendrait la main par cascade à côté de l'injection ; et `--bg` doit se retrouver dans `manifest.webmanifest` (`theme_color`, `background_color`) et dans chaque `<meta name="theme-color">` — le message rappelle que les icônes, elles, ne sont vérifiables par aucune commande. ⚠️ Le scan CSS ne parcourt que les contenus `<style>` : appliqué au document entier, le regex de blocs était quadratique sur les longs runs HTML sans accolade (build gelé, payé à l'installation du lot).
6. **Jetons interdits du standalone élargis** : `serviceWorker` et `BUILD:ONLINE-ONLY` rejoignent `fetch(`/`DOMParser` dans `generateStandalone()` — une fence `BUILD:ONLINE-ONLY` coupée en deux blocs (le regex non-greedy ne retire que le premier) sortait en exit 0 avec un standalone qui enregistre un service worker ; elle échoue désormais en nommant le jeton.
7. **`assertBacASableCoherent()` dans `ajoute_mots.js`** : le bac à sable du générateur de fiche imprimait un compte de cartes calculé **en process** — il aurait affiché le bon chiffre même en validant un autre arbre que le candidat. Le script relit désormais le `TOTAL <n>` imprimé par le build **du bac à sable lui-même** et refuse toute divergence, ainsi qu'un `TOTAL` illisible (format de sortie de `build.js` changé). C'est le contrôle du contrôle : sans lui, la preuve la plus coûteuse du générateur pouvait passer au vert sans rien prouver. Voir [SPEC_AJOUTE_MOTS.md](SPEC_AJOUTE_MOTS.md) §7.B.
8. **Hook `pre-commit` versionné** ([.githooks/pre-commit](../.githooks/pre-commit) ; installation par machine : `git config core.hooksPath .githooks`) : exécute `node tools/build.js --check` et `node tools/verifie_exemples.js` avant chaque commit (bypass assumé : `--no-verify`). L'estampille étant recalculée par `--check`, le contrôle n°1 couvre aussi le cas « un fichier servi change sans bump de `VERSION` », sans avoir à deviner la liste des fichiers servis dans une regex de shell.
9. **Estampille de `VERSION`** : `node tools/build.js` réécrit la ligne `const VERSION` de `sw.js` avec `'v-' + sha256(cinq artefacts + manifest).slice(0,8)`. Deux gardes autour, chacune prouvée par casse fabriquée : la ligne introuvable est **fatale et nommée** (`String.replace` d'un motif qui ne matche pas ne lève rien — il rendrait la chaîne inchangée, remettant le piège n°10 en place en silence), et une `VERSION` éditée à la main échoue en `--check` (exit 1, valeur attendue nommée). ⚠️ `sw.js` n'entre jamais dans son propre hash : la version s'y écrit, donc l'y inclure ferait courir le hash après sa propre queue et `--check` ne repasserait jamais vert. Effet de bord connu : le champ `version` de `cards.json` (date du build) entre dans le hash et y est **collant** — après un changement de contenu puis un `git checkout -- data/` seul, la version ne revient pas à sa valeur d'origine ; restaurer les artefacts avec les sources (`git checkout -- .`) la ramène au bit près.
10. **`verifieCatOrder()` dans `build.js`** : fait échouer le build si une catégorie attendue (`EXPECTED_CATS` ∪ les valeurs de `listCats`) manque dans `catOrder` ([src/app/js/07-filtres.js](../src/app/js/07-filtres.js)). C'était le seul des sept points de câblage d'une section neuve que rien ne surveillait : oublié, les cartes existent, le carnet est juste, `--check` reste vert — et **aucune puce n'apparaît dans l'app**, parce que `buildChips()` n'itère que sur `catOrder`. Une casse parfaitement muette, vue échouer puis passer sur chacune des six catégories neuves avant d'être crue. Le sens inverse (une entrée de `catOrder` sans catégorie correspondante) n'est qu'un avertissement.

11. **`verifieOrphelins()` étendue à `src/carnet/sections.json`** : la garde bidirectionnelle qui liait `src/app/` à `src/app/ordre.json` ne couvrait pas le carnet, dont le registre de sections souffrait pourtant du trou identique — une section neuve déposée dans `src/carnet/sections/` sans être inscrite au registre **disparaît du carnet sans un mot**, et `--check` repasse vert sur l'artefact amputé (le carnet régénéré est cohérent avec le registre : il est juste incomplet). La fonction prend désormais le chemin du manifeste et une clé facultative (`sections.json` est un tableau nu, `ordre.json` a des clés `js`/`css`), et nomme le fichier, le répertoire et le manifeste fautifs. Les deux sens sont éprouvés par casse fabriquée : fichier non listé → exit 1, fichier listé mais absent → exit 1.

## Développement et déploiement

Servir en HTTP depuis la racine (`app.html` lit `cards.json` par `fetch`, donc `file://` ne
marche pas), déployer en poussant sur `main`. Le détail opérationnel — outillage WSL, navigateur
de contrôle, ordre des commandes — vit dans [RITUEL.md](RITUEL.md), pas ici.

## Le graphe de connaissance du dépôt

`graphify-out/` porte un graphe interrogeable du dépôt : `graphify explain <symbole>` rend la
ligne source et les appelants, `graphify query` répond en langue naturelle, `graphify path`
relie deux nœuds. Le mode d'emploi et la règle de coût sont dans [CLAUDE.md](../CLAUDE.md) ;
l'état d'obsolescence, fichier par fichier, dans [TODO.md § Dette de graphe](TODO.md). Ils ne
sont pas répétés ici.

**Ce qui est versionné** : `graph.json` (le graphe interrogeable) et `GRAPH_REPORT.md` (la piste
d'audit : god nodes, ponts entre communautés, provenance EXTRACTED/INFERRED/AMBIGUOUS).
`graph.html`, le cache et les fichiers techniques restent locaux : ils contiennent des chemins
absolus de la machine de développement, contraires à la décision d'anonymisation du dépôt.

**Deux limites structurelles**, qui tiennent au mode d'extraction — des lots confiés à des
agents parallèles, aveugles aux identifiants forgés par les autres :

- **Des arêtes se perdent entre lots.** Quand deux lots nomment le même concept différemment,
  l'arête vise un nœud inexistant et se trouve **écartée à la construction** : elle n'entre
  jamais dans `graph.json`. C'est du signal perdu, pas du graphe corrompu. Conséquence à
  connaître : `graphify.diagnostics` compte l'extraction **brute**, donc un écart entre son
  total d'arêtes et celui de `graph.json` est normal, jamais un symptôme.
- **Chaque fichier déployé apparaît en double** — une fois vu du code, une fois vu de la prose
  qui le décrit (`index_portal` contre `architecture_index_html`). Ce n'est pas une erreur :
  ce sont deux vues. Mais le degré des nœuds-fichiers est de ce fait sous-estimé, chaque moitié
  comptant seule — n'en tire aucune conclusion sur l'importance relative d'un fichier.

## Check-list d'une modification de contenu

Elle vit dans [RITUEL.md](RITUEL.md) — un seul endroit, pour qu'il n'y ait pas deux versions à
tenir d'accord.
