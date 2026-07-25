# État du projet et travail restant

> **Archive** : les chantiers clos et l'historique des acquis sont déplacés dans [TODO_ARCHIVE.md](TODO_ARCHIVE.md) — ne pas charger en session sauf besoin explicite (grep ponctuel). L'état courant et les chantiers ouverts vivent ici.

## Reprendre ici (prochaine session)

**Chantier 3 de la réorganisation « le dépôt généré » : SOLDÉ (Tasks 13 à 16,
25/07).** `app.html` est le 4ᵉ artefact généré ; `sw.js` est en **v33**.
Prochaine étape : **chantier 4, Task 17** (`tools/` et `docs/` — plan complet
dans
[docs/superpowers/plans/2026-07-24-reorganisation-depot-genere.md](docs/superpowers/plans/2026-07-24-reorganisation-depot-genere.md)).
⚠️ **Deux choses à savoir avant d'attaquer le Task 17.** (1) Il déplace et
supprime des fichiers : il **devra** poser son flag « GRAPHE À RECALER »
(rituel étape 5). (2) Le plan a été écrit avant le lot tripwires et avant le
chantier 3 — **trois pièges y ont été ajoutés au Task 16 (25/07), à lire avant
le `git mv`** : les quatre scripts (pas seulement `build.js`) prennent
`__dirname` pour la racine ; le bac à sable d'`ajoute_mots.js` casse **en
silence** si la disposition `tools/` n'y est pas reproduite ; et
`.githooks/pre-commit` appelle `node build.js --check` sans que le `grep` du
plan, borné aux `.md`, ne le voie.

**Lot transversal du 25/07, hors chantier : les tripwires** (demande du
propriétaire : « si je change quelque chose, la casse doit être détectée
mécaniquement »). `verifieCharte()` dans `build.js` mécanise les pièges n°2, 3
et 5 ; les jetons interdits du standalone s'élargissent ; un hook `pre-commit`
versionné arrive dans `.githooks/`. Chaque garde éprouvée par casse fabriquée
(exit 1 réel, échec nommé). Détail : ARCHITECTURE.md § Garde-fous, TODO
§ Rituel étape 4.

### Ce que le chantier 3 a produit (df5ccfc..d518269, poussé sur `main`)

**`app.html` n'est plus une source : c'est le 4ᵉ artefact généré.** `node
build.js` l'assemble par `assembleApp()` depuis `src/app/coquille.html` (trois
marqueurs `<!-- @TOKENS -->`, `<!-- @CSS:app -->`, `<!-- @JS:app -->`),
`src/tokens.css`, les **6 fragments** de `src/app/css/` et les **14 modules**
de `src/app/js/`, l'ordre des deux concaténations étant porté par
`src/app/ordre.json`. **N'édite plus `app.html` à la main** — comme les trois
autres artefacts, il est écrasé au prochain build. `node build.js --check`
couvre désormais les **4** artefacts (le 5ᵉ, `index.html`, ne devient généré
qu'au Task 18).

⚠️ **Les deux concaténations n'ont pas le même séparateur, et c'est voulu** :
les modules JS sont joints par `join('\n')` (`build.js:657`), les fragments CSS
par `join('')` (`build.js:663`) — c'est ce `join('')` qui porte la
byte-identité du CSS. Un fragment CSS finit donc par un saut de ligne, un
module JS **jamais**. Corollaire payé une fois : `99-principal.js` doit
conserver son `\n` final explicite, sinon le regex de fence de `build.js` ne
matche plus (rien ne suit `<!-- @JS:app -->` dans la coquille).

**Comment le découpage a été prouvé sans rien casser** : Tasks 13 et 14
byte-identiques (`app.html` régénéré identique au committé, à l'en-tête
« FICHIER GÉNÉRÉ » près). Task 15 : les 83 fonctions top-level retrouvées une à
une, les lignes triées identiques à l'écart près des 14 en-têtes `// Expose :`,
et surtout — vérifié **au parseur (acorn), pas au grep** — les 148 nœuds
top-level appariés des deux côtés, dont les **39 instructions exécutées au
chargement dans une séquence identique indice par indice**, toutes regroupées
dans `99-principal.js`. Les 812 lignes d'`app.html` situées **hors du
`<script>`** (head, CSS, balisage) sont **byte-identiques** à l'avant-chantier :
aucun changement de rendu n'est structurellement possible. Comportement exercé
en jsdom, 29/29 PASS, 0 erreur console : cartes (flip/answer/undo), saisie
(verdict, correction, clavier hébreu), QCM, révision espacée, recherche, les
6 segments de `SEG_KEYS`.

### Ce que le Task 16 a soldé (25/07)

1. **`sw.js` bumpé en `v33`** — `app.html` et `flashcards_hebreu.html` avaient
   changé sans bump depuis la v32.
2. **Les trois minors gelés** par la gate byte-identique du chantier : l'en-tête
   du standalone annonce désormais sa vraie provenance (« depuis `src/app/` +
   `data/` ») ; `mustReplace` ne peut plus renvoyer l'auteur vers `app.html`
   (chacun des 8 appels nomme son fichier source — `src/app/coquille.html`,
   `src/app/js/05-donnees.js`, `src/app/js/99-principal.js` — et le défaut est
   devenu un aveu d'appel incomplet, plus un artefact) ; les messages de la
   garde de taxonomie pointent `src/app/js/07-filtres.js` — au passage, le lot
   tripwires les faisait pointer `00-tout.js`, le module intermédiaire du Task 13
   qui n'existe plus depuis son éclatement en 14 modules au Task 15.
3. **Les trois en-têtes `// Expose :`** relevés en revue. Le contrat a d'abord
   été tranché, puisque c'est lui qui rendait le relevé ambigu : **« Expose »
   liste les noms top-level qu'un *autre* module référence**, rien de plus —
   vérifié fichier par fichier. Ajoutés à 07 : `SPK_SVG`, `catCounts`,
   `nivCounts`, `themeCounts`, `catsEl`, `nivEl`, `themeEl`, `catOrder` (les 8
   que `13-reglages.js` déclarait « utiliser (07) » — la contradiction est
   levée) ; ajouté à 08 : `lastRecord` (lu par 09 et 99). En revanche `NIVEAUX`
   (07), `voicesCache` (06), `SRS_INTERVALS` et `SRS_MASTER` (08) **restent
   hors liste** : aucun autre module ne les référence, ils sont locaux par
   convention. Convention écrite dans ARCHITECTURE.md § Anatomie de l'app.
4. **Toutes les ancres `app.html#L` de la doc ont été supprimées**, pas
   recalées : le chantier 3 les avait de nouveau toutes faussées (5ᵉ dérive), et
   `app.html` est régénéré à chaque build. ARCHITECTURE.md pointe désormais les
   modules sources — et les ancres `build.js#L` ont suivi, l'audit de sortie en
   ayant trouvé 3 fausses sur 5. La doc vivante ne porte plus **aucune** ancre
   de ligne vers du code ; contrôle en rituel étape 7.
5. **La gate visuelle du plan, réduite sur décision du propriétaire.** La
   matrice A/B (mobile + desktop 1440/1280/992/900/768, avant-chantier vs HEAD)
   n'a **pas** été jouée : le hors-`<script>` d'`app.html` est byte-identique à
   l'avant-chantier et le diff résiduel du Task 16 est du commentaire — elle
   n'aurait mesuré que ce que la byte-identité prouve déjà, et le piège 13
   (desktop) ne mord pas quand aucune ligne de CSS ni de balisage n'a bougé.
   Elle est remplacée par ce qu'elle seule prouvait vraiment : **un smoke dans
   un vrai WebKit** (iPhone 16 Pro émulé, servi en HTTP, sous-agent Sonnet) —
   `#count-note` annonce « 1220 mots chargés », les 7 points passent (cartes,
   saisie, QCM, révision, recherche, réglages), **0 erreur console et 0
   `pageerror`**. C'est la seule chose que jsdom ne pouvait pas dire : que la
   concaténation des 14 modules parse et démarre dans le moteur réel.
6. **La passe documentaire de sortie de chantier** : CLAUDE.md (pièges 1, 2, 5,
   6, 8, 11, « The five deployed pieces », « extraction coupling », rituel
   étape 1 et 3), ARCHITECTURE.md (§ Vue d'ensemble, § Les fichiers, § chaîne de
   génération, § Anatomie de l'app, § Check-list) et README.md disaient tous
   encore qu'`app.html` s'édite à la main.

**Deux minors hérités du chantier 2, toujours ouverts** : `app.html`
l'étiquette de diagnostic « extraction » mesure désormais `JSON.parse` ;
`construitIndexFichiers()` dans `cherche_mots.js` (le `readdirSync` sur
`data/listes`) duplique l'énumération que `build.js` fait déjà.

**Ce que le chantier 3 a durci au passage (quatre gardes neuves, toutes
éprouvées par cas fabriqué en bac à sable, échec réel constaté)** : les 3
marqueurs de coquille passent par `mustReplace` — un marqueur disparu fait
`exit 1` en le nommant, **avant** toute écriture (sans elle, supprimer
`<!-- @CSS:app -->` produisait un `app.html` amputé de tout son CSS avec
`exit 0`, puis un `--check` au vert sur l'artefact cassé) ; `verifieOrphelins()`
(dans `build.js`, partagée JS/CSS) échoue **dans les deux sens** — fichier
présent non listé dans `ordre.json`, ou listé mais absent du disque ; la garde
de taxonomie `THEMES` a quitté `report()` pour `verifieTaxonomieApp(appSource)`
et s'exerce désormais sur la source **assemblée en mémoire**, fatale en mode
normal **comme en `--check`** ; `generateStandalone(cards, appSource)` ne lit
plus `app.html` du disque — sans quoi `--check`, qui n'écrit rien, aurait
dérivé le standalone d'un fichier périmé.

**Le ledger de reprise** (dispatches, verdicts de revue, arbitrages, preuves de
gardes) est dans `.superpowers/sdd/2026-07-24-reorganisation-depot-genere/progress.md`
— **gitignoré, donc local à la machine** ; il porte aussi les briefs et les
revues des Tasks 13 à 15. Le chantier 4 (Tasks 17 à 21) n'a **pas** été entamé.
⚠️ Le ledger s'arrête au Task 15 : le Task 16 s'est joué dans la session du
25/07, et c'est cette section-ci qui en tient lieu.

### Ce que le chantier 2 avait produit

Ce que le chantier a produit : `data/*.json` est désormais l'unique source de
vérité du contenu. `node build.js` régénère à partir de `data/` les trois
artefacts `vocabulaire_hebreu.html`, `cards.json` et `flashcards_hebreu.html`.
`app.html` charge `cards.json` au démarrage — **plus aucun extracteur HTML
n'existe dans le dépôt** : `extractCards` (les deux implémentations, carnet et
`app.html`) et le mode `node build.js --verrou` qui prouvait leur équivalence
ont été retirés une fois la preuve faite ; `outils_migration/
compare_carnets.js`, le harnais qui portait cette preuve, a été supprimé avec
eux, sa mission remplie. `verifie_exemples.js`, `cherche_mots.js` et
`ajoute_mots.js` lisent tous `data/`. `sw.js` passait alors en **v32** et précache
`cards.json`. État : **1220 cartes**, `--check` en phase.

À savoir sur le champ `version` de `cards.json` : le build ne réécrit le fichier
que si son **contenu** change (sinon un build un autre jour réécrivait 890 Ko
pour rien). Conséquence : `version` porte la date du **dernier changement de
contenu**, pas celle du dernier build. Sans conséquence aujourd'hui — personne
ne le lit (`app.html`, `sw.js` et le standalone l'ignorent) — mais à savoir si
on veut un jour s'en servir pour invalider un cache.

**`CLAUDE.md` et `ARCHITECTURE.md` ont été recalés** (passe d'exactitude du
24/07, après le chantier 2) : on peut leur faire confiance sur le flux de
données. La section « The extraction coupling » de CLAUDE.md a été remplacée en
place par un exposé court du pipeline `data/` → `build.js` → artefacts, les
pièges 1/6/8 et le rituel sont recalés, et ARCHITECTURE.md décrit le contrat
gabarits/données au lieu des deux extracteurs. Ce qui **reste** au **Task 20**
est éditorial, pas factuel : la version définitive de la section pipeline, la
renumérotation des pièges, et le recalage des chemins d'outils vers `tools/`
(volontairement différé — les outils déménagent au chantier 4, l'écrire
maintenant serait à refaire).

⚠️ **Le graphe (`graphify-out/`), lui, date d'avant les chantiers 1 à 3** : il ne
connaît ni `data/`, ni `src/carnet/`, ni `src/app/`, ni `.githooks/`, ni la
disparition des extracteurs — et il situe les fonctions de l'app aux lignes
d'`app.html` **d'avant** leur redécoupage en 14 modules. Sur tout ce périmètre,
`graphify explain` répond à côté : passer directement au `grep -n` sur le module
nommé par les en-têtes `// Expose :`. Il reste fiable sur ce qui n'a pas bougé
(structure du carnet, règles de charte, pièges).
Les flags ci-dessous enregistrent la dette ; le recalage reste une décision
explicite, jamais automatique.

⚠️ **Sécurité des deux outils de migration survivants**
(`outils_migration/extrait_donnees.js`, `decoupe_carnet.js`) : ils écrivent
**sans confirmation ni dry-run par défaut** (`decoupe_carnet.js` sans
`--verifie` écrit 8 fichiers). Un lancement accidentel a écrit dans
`src/carnet/tete.html` pendant ce chantier (annulé, sans dégât). À garder en
tête jusqu'à leur retrait au Task 20.

⚠️ GRAPHE À RECALER — 2026-07-23 : SPEC_AJOUTE_MOTS.md (créé), ajoute_mots.js
(créé), SPEC_ECONOMIE_TOKENS.md (créé), cherche_mots.js (créé), TODO_ARCHIVE.md
(créé). Le flag enregistre la dette, il ne déclenche rien (règle du 21/07).

⚠️ GRAPHE À RECALER — 2026-07-24 : data/**, src/carnet/**, src/tokens.css,
outils_migration/** créés ; vocabulaire_hebreu.html régénéré (chantier 1).

⚠️ GRAPHE À RECALER — 2026-07-24 (chantier 2, Tasks 7-12) : cards.json créé ;
outils_migration/genere_carnet.js, outils_migration/valide_donnees.js et
outils_migration/compare_carnets.js supprimés (logique absorbée dans
build.js, harnais d'équivalence devenu inutile une fois la preuve faite).

⚠️ GRAPHE À RECALER — 2026-07-25 (chantier 3, Tasks 13-15) : `src/app/**` créé
(`coquille.html`, `ordre.json`, 6 fragments `css/`, 14 modules `js/`),
`outils_migration/decoupe_app.js` créé ; `app.html` est devenu un artefact
généré. Le graphe connaît encore les 83 fonctions de l'app **comme si elles
vivaient dans `app.html`** — les lignes qu'il cite n'existent plus là où il le
dit. Le flag enregistre la dette, il ne déclenche rien (règle du 21/07).

⚠️ GRAPHE À RECALER — 2026-07-25 (lot tripwires) : `.githooks/pre-commit` créé
(hook versionné) ; `verifieCharte()` ajoutée à build.js.

Lot « intermédiaire » du 24/07 : **100 mots neufs** (1120 → 1220) — 57 noms,
24 verbes, 19 adjectifs, ventilés **81 B1 / 19 A2**, ce qui porte le B1 de 254 à
335 (désormais le deuxième niveau le plus fourni, après A2). Rédaction en
sous-agents Opus, **deux passes** : la première a proposé 100 candidats
« courants » dont **77 existaient déjà** (carnet mûr) — 23 neufs seulement ; la
seconde, armée de l'**inventaire complet des 903 têtes de table en liste
d'exclusion**, a visé du vocabulaire plus spécifique (ustensiles, matières,
symptômes, rôles, notions abstraites) qui a survécu presque intact au
dédoublonnage. Leçon réutilisable : **donner l'inventaire d'exclusion aux
rédacteurs dès la première passe** — sans lui, on paie une passe entière pour
~20 % de neuf.

- **`he2tr` faute de façon reproductible** sur : shva initial devant sifflante
  (`shekufah` pour shkufah), yud consonantique (`meiuman` pour meyuman,
  `veiafah` pour veyafah), redoublement (`boddim` pour bodedim, `chiurim` pour
  chivrim), et alef final (`achray` pour achra'i, `kefuot` pour kefu'ot). Ce lot
  n'a fourni **aucun `tr` à la main** : les 307 dérivés ont été relus dans le
  tableau du verdict, aucune de ces fautes présente — les `⚠` restants relèvent
  du shva initial « jugement », laissé tel quel (`pegishah`, `kerovim`,
  `tekufah`).

Les deux derniers chantiers sont soldés et archivés dans
[TODO_ARCHIVE.md](TODO_ARCHIVE.md) § « Chantiers clos — archivés le 2026-07-24 » :
**économie de tokens** (SPEC_ECONOMIE_TOKENS.md, `cherche_mots.js`, lot des 24
mots, appariement ktiv male/haser) et **QCM thématique** (`pickDistractors` sert
maintenant les distracteurs par cascade — même thème + même catégorie, puis même
thème + autre catégorie, puis les étages d'avant, puis le dernier recours ;
prouvé en jsdom, 5/5 en logique pure et 6/6 en parcours de bout en bout).

Une chose à savoir avant d'ouvrir le prochain chantier, acquise le 24/07 et
toujours vraie (chantier 2 a supprimé `extractCards`, donc la recette
d'exercice qui vivait ici avant le chantier ne s'applique plus — voir
l'avertissement CLAUDE.md/ARCHITECTURE.md en tête de section) :

- **Découverte hors chantier, non corrigée** : au tout premier lancement, si
  aucun chip de niveau n'est sélectionné, `state.niveaux` reste vide et le
  bouton « démarrer » ne fait rien. Jugé conforme à l'intention lors du contrôle,
  volontairement laissé tel quel — à trancher si quelqu'un le rencontre.

## Outillage (WSL, à recréer en début de session si besoin)

- **Consultation du carnet par commande** (`cherche_mots.js`, versionné, dev-only, zéro
  dépendance, ne modifie rien — le canal cheap du piège n°15) : `node cherche_mots.js TERME
  [TERME…]` répond « existe-t-il ? où ? » — terme hébreu = comparaison exacte sur `he_plain`
  (headwords, puis formes, puis mot exact dans les exemples), **puis, seulement si l'exacte
  échoue, l'appariement ktiv male/haser** en rubrique séparée « orthographe voisine » (le
  carnet est vocalisé donc défectif : עִתּוֹן s'y écrit `עתון` quand on cherche `עיתון` —
  sans cette rubrique, 6 mots sur 24 ressortaient `ABSENT` alors qu'ils étaient là, le sens
  qui fait insérer un doublon) ; terme latin = sous-chaîne à
  frontière de mot en tête dans `.fr`/`note`/`exemples`. Sortie `SECTION Lnnnn · hébreu —
  français` (le n° de ligne sert d'ancre de lecture fenêtrée), `ABSENT` seulement si ni
  exacte ni voisine, bornée à 8
  occurrences par rubrique (surplus compté, jamais tronqué en silence). `node cherche_mots.js --stats` :
  total, répartition par section/niveau/thème (du moins doté au plus doté) — l'arbitrage
  « quel thème/niveau est sous-doté ? » sans lire le carnet. Réutilise `extractCards` &
  cie exportés par `build.js` (pas de troisième parseur), dont `orthographeVoisine` —
  règle mesurée : insertion de ו/י seulement, forme courte ≥ 3 lettres, ≤ 2 insertions,
  soit 37 paires sur 1053 mots. Les garde-fous ne sont pas décoratifs : sans eux לישן
  (dormir) s'apparie à לשון (langue). `ajoute_mots.js` consomme le même helper en
  **informatif non bloquant** — son garde doublons reste la comparaison exacte.
- **Logique/DOM** : Node + jsdom dans le scratchpad de session
  (`npm i jsdom playwright` — installer les DEUX ensemble, npm évince l'autre sinon),
  booter `flashcards_hebreu.html` avec `runScripts:'dangerously'`.
- **Rendu visuel (mobile ET desktop)** : Playwright + **WebKit** (vrai moteur Safari — les
  libs système sont installées) avec `devices['iPhone 16 Pro']` ; captures d'écran à
  l'appui, relues visuellement. Les navigateurs téléchargés **persistent** dans
  `~/.cache/ms-playwright` (webkit-2311 en place) : en début de session, un simple
  `npm i playwright` dans le scratchpad suffit — ne relancer
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 npx playwright install webkit` que si le
  cache a disparu. Le Chrome système (`google-chrome --headless`) pend en WSL2 — ne pas
  l'utiliser. **Piloter depuis un sous-agent, jamais depuis la session principale**
  (étape 3 du rituel) : c'est l'outil qui pollue le plus une fenêtre de contexte.
- **Suite de contrôle du portail** : `verifie_portail.js` (scratchpad de session, à
  recréer au besoin) — 33 contrôles : accueil/portes en desktop (souris, clavier, sans
  JS, reduced-motion), iPhone 16 Pro (tactile, débordement, chevauchement
  texte/ménorahs), navigation réelle des deux portes, `start_url`, tirage fr/he
  (détection hébreu par plage Unicode, pas par mot littéral).
- **Suite d'audit** (scratchpad, à recréer au besoin — écrite le 19/07 pour l'audit du
  carnet, réutilisable sur n'importe quelle page) : `audit_carnet.js` mesure en un passage
  le contraste réel de chaque nœud texte (composition alpha comprise, seuils AA 4,5:1/3:1),
  la hiérarchie des titres et les sauts de niveau, les landmarks, la **couverture `lang="he"`**
  (parcours du DOM avec remontée d'ancêtres), l'anneau de focus sous vraie tabulation, le
  débordement horizontal à 320/375/402/430/768 px et les cibles tactiles sur iPhone 16 Pro.
  ⚠️ Piège Playwright : la forme **chaîne** d'`evaluate()` attend une *expression* — envelopper
  le corps dans `(()=>{ … })()`, sinon `SyntaxError: Unexpected keyword 'function'`.
- **Suite de mise en page** (scratchpad, à recréer au besoin — écrite le 20/07 pour le
  bornage de la largeur de lecture, réutilisable sur tout changement de layout). Elle
  compare **deux copies du fichier**, l'une avec le bloc CSS en cause retiré, aux six
  largeurs 1440/1280/992/900/768 + iPhone 16 Pro, et mesure : débordement horizontal du
  document (`scrollWidth` vs `clientWidth`), `clientWidth`/`scrollWidth` de **chacune**
  des 29 `.table-wrap` — c'est le contrôle qui a attrapé les deux régressions du jour —,
  les axes de centrage, et les **caractères par ligne** de la prose.
  ⚠️ **La mesure des caractères par ligne ne peut pas se faire au plus long nœud texte** :
  la prose du carnet est fragmentée par des `<span>` hébreux et des `<b>`, si bien que le
  plus long nœud isolé ne fait que 176 caractères pour des lignes réelles bien plus
  longues. Il faut un `Range` caractère par caractère sur **tous** les nœuds texte de
  l'élément, regroupés par `top` de rectangle via `getClientRects()`.
  ⚠️ Et comparer **avant/après**, pas seulement après : c'est le comparatif qui prouve que
  le mobile n'a pas bougé et qu'aucune table n'a gagné de défilement. Un contrôle qui ne
  mesure que l'état final ne sait pas ce qu'il a cassé.
- **Détecteur impeccable** (sans réseau, lit HTML/CSS local) :
  `node <base-skill>/scripts/detect.mjs --json <fichier>`. Ses findings sont des *signaux*,
  pas des verdicts : les vérifier à la main avant d'agir (l'`em-dash-overuse` du carnet est
  un faux positif — la règle vise l'anglais).
- **Graphe de connaissance** (`graphify-out/`, versionné depuis le 20/07) : cartographie du
  dépôt — 335 nœuds, 511 arêtes, 28 communautés (recalé le 21/07 après le ménage de
  clôture ; le standalone n'est plus dupliqué en ~90 nœuds depuis le 20/07). **À
  interroger avant d'ouvrir un gros fichier** : `graphify explain "checkAnswer"` donne la ligne source exacte et les
  appelants/appelés en ~15 lignes, `graphify query "…"` répond en ~2 300 tokens là où lire
  `app.html` en coûte des dizaines de milliers (10,5× d'économie, mesurée le 20/07 par
  `graphify benchmark`). Se reconstruit par
  `/graphify . --update`. ⚠️ C'est un **instantané** : en cas de contradiction avec le fichier,
  le fichier fait foi. Détail et limites connues dans ARCHITECTURE.md § Le graphe de
  connaissance du dépôt.
- **Serveur local** : `python3 -m http.server` depuis la racine (l'appli fetch le carnet).
- **Piège jsdom** : `const CARDS` au premier niveau d'un script **n'apparaît pas** sur
  `window` (les `const` ne créent pas de propriété globale) — inutile de chercher
  `w.CARDS` après un boot. Pour vérifier le contenu chargé, passer par le DOM (la
  recherche est le plus court chemin : remplir `#search-input` — et non `#search` —
  puis lire `#search-results`). `window.eval('CARDS')` marche en dernier recours.
- **Suite du diagnostic de latence** (scratchpad de session, à recréer au besoin —
  écrite le 20/07) : `test_perf_note.js` boote le **standalone** en jsdom et vérifie
  le format des trois rapports (chip, départ, `#perf-boot` vide donc masqué) ;
  `test_srs_migration.js` sème un `srs_v1` à l'ancien format **avant** le boot
  (`beforeParse` + `localStorage.setItem`) et vérifie migration + séparation des
  homographes. ⚠️ Piège payé en l'écrivant : l'espace avant « ms » est une **fine
  insécable U+202F** (invisible au terminal, échoue toute comparaison naïve) — elle
  est en escape `\u202f` dans la source d'`app.html` pour cette raison.

## Rituel à chaque modification

1. `node build.js` — lit `data/*.json` + `src/` et régénère les **quatre** artefacts
   (`vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html`) ; échec
   si une section ou un niveau attendu tombe à 0, si une entrée sort sans `niveau` valide,
   ou si un `theme` sort de `EXPECTED_THEMES` ; vérifier les comptes affichés (sections,
   niveaux, thèmes, exemples).
2. Si des exemples ont changé : `node verifie_exemples.js` — **0 erreur exigé**.
3. Vérifier le comportement **au niveau le moins cher qui prouve vraiment quelque chose**.
   `node build.js --check` compare déjà les **quatre artefacts régénérés** au contenu
   committé, octet par octet : un changement de **contenu seul est prouvé par les
   étapes 1–2**, rien à ajouter. Serveur local ou jsdom
   quand de la **logique** a bougé. **WebKit/Playwright uniquement si tu as touché à
   l'UI** — balisage, CSS, ou un chemin de rendu. Démarrer un vrai navigateur pour
   reconfirmer ce que `--check` vient d'établir est du confort, pas une preuve : ça coûte
   l'installation de l'outillage plus une session de pilotage. (Leçon payée le 20/07 sur
   le lot d'exemples.)

   ⚠️ **Et quand le contrôle est justifié, le déléguer à un sous-agent.** Une session
   WebKit, c'est des dizaines d'allers-retours de pilotage et des captures d'écran — le
   poste le plus lourd d'une fenêtre de contexte — pour un verdict de trois lignes.
   Le sous-agent a sa propre fenêtre et ne rend que la conclusion ; le trafic
   intermédiaire n'entre jamais dans la session principale, qui est renvoyée en entier
   à chaque tour. Même chose pour un `build.js` / `verifie_exemples.js` de gros lot, ou
   une exploration large à laquelle le graphe ne répond pas d'une requête.
   **Restent dans le fil principal** : les éditions, les arbitrages de charte et de
   contenu, et l'étape 6 (documentation) — elles ont besoin du contexte accumulé.
   Le prompt du sous-agent doit **chiffrer le critère d'acceptation** (« rends le compte
   de X et nomme chaque défaut »), jamais « vérifie que c'est bon » : un contrôle muet
   passe toujours au vert, c'est la leçon de la garde de couverture de `build.js`.
   Doctrine complète dans CLAUDE.md § *The token-economy doctrine — STANDING DIRECTIVE*.
4. Si `sw.js`, la liste d'assets ou les icônes changent : incrémenter `VERSION` dans `sw.js`.

   ⚠️ **Depuis le 25/07, un hook `pre-commit` versionné tient le filet** (`.githooks/
   pre-commit` ; installation, une fois par machine : `git config core.hooksPath
   .githooks`). Il exécute `node build.js --check` + `node verifie_exemples.js` avant
   chaque commit et **refuse** un commit qui change un fichier servi (artefacts,
   `index.html`, `manifest.webmanifest`, `sw.js`, `icons/`) sans bump de `VERSION`
   dans `sw.js` (bypass assumé, à justifier dans le message : `git commit
   --no-verify`). Le hook est le filet, pas le rituel : continuer à lancer les étapes
   à la main. Il devient partiellement inutile au Task 19 (VERSION estampillée par le
   build). Les tripwires de charte (pièges n°2, 3, 5), eux, vivent dans
   `verifieCharte()` de `build.js` — détail dans ARCHITECTURE.md § Garde-fous.
5. **Le graphe ne se recale JAMAIS dans le rituel — au plus il se FLAGGE (règle de
   Ruben, 21/07).** `/graphify . --update` coûte **~235 000 tokens** (mesuré le 20/07) :
   le lancer est toujours une décision séparée et explicite. **Le flag ne déclenche pas
   la mise à jour — rien dans ce rituel ne la déclenche.**
   - **Un fichier a été créé, supprimé ou renommé** → poser (ou compléter) la ligne de
     flag dans « Reprendre ici » : `⚠️ GRAPHE À RECALER — <date> : <fichiers>`. Le flag
     consigne la dette pour que le prochain recalage décidé sache pourquoi il tourne —
     c'est TOUT ce qu'il fait.
   - **Tout le reste** — lots de contenu du carnet, prose des `.md`, et même les
     modifications structurelles *à l'intérieur* de fichiers existants : ni recalage,
     ni flag. Cette dérive interne est tolérée par construction : `graphify explain`
     re-dérive les lignes mécaniquement, et un désaccord graphe/fichier se tranche pour
     le fichier. Le dire dans le message de commit (« graphe laissé tel quel »).
   - Quand un recalage EST décidé (flag en attente + une session qui a besoin d'une
     carte juste), solder le flag dans le même commit que `graphify-out/graph.json`.

   ⚠️ *Le piège qui a payé cette règle* : le lot de 54 exemples du 20/07 était du contenu
   pur, et le recalage lancé quand même a coûté **~4 fois le travail utile** pour faire
   passer deux compteurs de 510 à 564. Le diff de `--update` (168 nœuds ajoutés, 87
   retirés) montre qu'il **brasse** le graphe au lieu de l'étendre — raison de plus pour ne
   pas le lancer pour rien.
6. Documentation à jour : README, ARCHITECTURE, CLAUDE.md, DESIGN.md, PRODUCT.md, et ce
   fichier (surtout « Reprendre ici »). ⚠️ Les **comptes** cités dans les docs (cartes,
   exemples, nœuds `lang="he"`) se recalent à chaque ajout de vocabulaire — et le compte
   de nœuds `lang="he"` se **mesure dans le navigateur, il ne se calcule pas** : une
   entrée ajoutée crée aussi ses `span.cursive` générés, donc elle pèse plus d'un nœud
   (5003 → 5015 pour 3 mots, le 19/07, là où le calcul de tête donnait 5010).
7. **Plus aucune ancre de ligne vers `app.html` dans la doc — et ne pas en réintroduire**
   (clos au Task 16, 25/07). Elles avaient dérivé **cinq fois** (19/07 au matin ; toutes
   fausses le soir, +25 ; après les plis, de +22 à +82 selon l'endroit ; +11 uniforme le
   20/07 ; puis en vrac au chantier 3, qui a réordonné le JS). Le décalage n'est **pas**
   uniforme — et une ancre fausse est pire qu'absente : elle envoie lire le mauvais code
   avec assurance. La cause de fond a été supprimée plutôt que réparée une sixième fois :
   `app.html` est un artefact régénéré à chaque build, donc **la doc pointe le module
   source** (`src/app/js/12-qcm.js`, `src/app/coquille.html`…), sans numéro de ligne pour
   le code — `graphify explain "<symbole>"` redonne la ligne exacte sans entretien manuel.

   Contrôle (chaîne littérale, pour ne pas matcher les mentions en prose ;
   `TODO_ARCHIVE.md` est exclu — c'est un gel historique, on n'y touche pas) :

   `grep -rnF '](app.html#L' README.md CLAUDE.md ARCHITECTURE.md DESIGN.md PRODUCT.md TODO.md`

   — doit rester **vide**.
8. Commit par changement, messages en français (comme l'historique), puis push sur `main`
   (GitHub Pages redéploie automatiquement). C'est le point de coupure propre : l'état vit
   dans git et dans « Reprendre ici », pas dans la fenêtre de contexte.
