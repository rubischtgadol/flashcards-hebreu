# État du projet et travail restant

> **Archive** : les chantiers clos et l'historique des acquis sont déplacés dans [TODO_ARCHIVE.md](TODO_ARCHIVE.md) — ne pas charger en session sauf besoin explicite (grep ponctuel). L'état courant et les chantiers ouverts vivent ici.

## Reprendre ici (prochaine session)

**Où en est le dépôt (25/07/2026, tout poussé sur `main`).** La réorganisation
« le dépôt généré » a soldé ses chantiers 1 à 3 et les **Tasks 17 à 20** du
chantier 4 : **il ne reste que le Task 21** (contrôle global + livraison). Le
dépôt est désormais rangé ainsi :

| Où | Quoi | S'édite à la main ? |
| --- | --- | --- |
| `data/*.json` | **le contenu** : noms, adjectifs, verbes, `listes/*.json` | ✅ oui — source unique |
| `src/carnet/` | gabarits et prose du carnet | ✅ oui |
| `src/app/` | **le code de l'app** : `coquille.html`, `ordre.json`, 6 fragments `css/`, 14 modules `js/` | ✅ oui |
| `src/portail/` | **la source du portail** : `index.html` (les jetons y sont injectés au marqueur `<!-- @TOKENS -->`) | ✅ oui |
| `src/tokens.css` | le bloc `:root` de la charte, source unique des **trois** pages déployées | ✅ oui |
| `tools/` | les 4 outils (build, verifie_exemples, ajoute_mots, cherche_mots) | ✅ oui |
| `docs/` | toute la prose du projet | ✅ oui |
| `vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html`, `index.html` | les **5 artefacts générés** | ❌ **jamais** — écrasés au build |
| `sw.js` | le service worker | ✅ oui — **sauf** la ligne `const VERSION`, estampillée par le build depuis le Task 19 (`grep -n "const VERSION" sw.js` pour la valeur du jour) |

⚠️ **Les outils se lancent DEPUIS LA RACINE**, jamais depuis `tools/` :
`node tools/build.js`, `node tools/verifie_exemples.js`,
`node tools/cherche_mots.js`, `node tools/ajoute_mots.js`. Chacun vise
`ROOT = path.join(__dirname, '..')`, exporté par `build.js` et consommé par les
trois autres — jamais recalculé ailleurs.

**Prochaine (et dernière) étape : Task 21** — contrôle global et livraison. Plan
complet dans
[le plan du chantier](superpowers/plans/2026-07-24-reorganisation-depot-genere.md) :

- **Task 21** — (1) rituel complet : `node tools/build.js && node tools/build.js --check
  && node tools/verifie_exemples.js`, `node tools/cherche_mots.js שלום` répond,
  dry-run d'`ajoute_mots.js` sur un mot **absent** du carnet (un mot déjà présent
  court-circuite sur l'idempotence et ne prouve PAS le bac à sable — vérifier que
  la sortie contient bien les deux lignes « ✓ … bac à sable ») ; (2) sous-agent
  Sonnet WebKit : parcours PWA complet en local (portail → app → une session de
  chaque mode → carnet), « PASS/FAIL par étape + erreurs console, max 10 lignes » ;
  (3) push, puis vérifier que `https://rubischtgadol.github.io/flashcards-hebreu/cards.json`
  répond 200 après redéploiement. Rappeler à Ruben : sur l'iPhone, deux lancements
  pour voir la nouvelle version (stale-while-revalidate).

⚠️ **Cinq choses apprises aux Tasks 17-20, à ne pas réapprendre.**

1. **Le plan du chantier a été écrit avant le lot tripwires du 25/07 : il ne
   connaît pas `verifieCharte()` ni `.githooks/`.** Ses `grep` de contrôle sont
   bornés aux `.md` et ratent donc trois familles de références : les **chaînes
   d'usage et messages d'erreur dans les scripts eux-mêmes** (dont trois
   sortent dans l'en-tête « FICHIER GÉNÉRÉ » des artefacts — les toucher force
   un rebuild, qui réestampille `sw.js` au passage), l'allowlist
   `.claude/settings.local.json`, et les **liens markdown à fragment**
   (`](…#L42)`). Élargi comme tel au Task 20 — les quatre familles y étaient
   vierges, mais c'est le balayage qui le prouve. Le Task 19 y a ajouté une quatrième
   famille : le **bac à sable d'`ajoute_mots.js`**, qui recopie un dépôt
   miniature — toute garde neuve qui lit un fichier de la racine casse le
   dry-run tant que le fichier n'est pas dans `FICHIERS_RACINE_BAC_A_SABLE`
   (payé au Task 17 avec `index.html`, re-payé au Task 19 avec `sw.js`).
2. ⚠️ **Un chiffre juste n'est pas une preuve — ce qui prouve, c'est d'où il
   vient.** Le bac à sable d'`ajoute_mots.js` affichait un compte de cartes
   calculé *en process* : il aurait montré le bon nombre en validant un tout
   autre arbre. C'est maintenant `assertBacASableCoherent()` qui relit le `TOTAL`
   imprimé par le build de la sandbox. Toute garde ajoutée ici se prouve par
   **casse fabriquée** (exit 1 réel, message nommé), jamais par « je l'ai
   ajoutée ».
3. ⚠️ **Générer un fichier prouve que le contenu arrive, jamais qu'il soit
   seul** (Task 18). L'injection des jetons au marqueur `<!-- @TOKENS -->`
   garantit que `src/tokens.css` est bien dans les trois pages ; elle ne dit
   rien d'un **second `:root` écrit en dur** à côté, qui gagnerait par cascade
   et rouvrirait précisément la divergence que le Task 18 vient de fermer —
   sans rien casser de visible. D'où le compte de blocs `:root` attendu par
   page dans `verifieCharte()` (carnet 3, app 1, portail 1). Même forme de
   raisonnement pour la suite : quand une tâche « clôt un piège par
   construction », demander *par quel chemin il pourrait revenir* et mécaniser
   ce chemin-là.
4. ⚠️ **Une garde qui ne peut pas échouer ne prouve rien — et il faut le
   vérifier, pas le supposer** (Task 19). L'estampille avait d'abord reçu un
   contrôle d'existence sur chacun des six fichiers hachés ; la casse fabriquée
   (retirer `manifest.webmanifest`) a montré qu'il était **muet par
   construction** : `verifieCharte()` lit le manifeste bien avant, et le build
   meurt là. Le contrôle a été supprimé plutôt que gardé pour la forme. Corollaire
   inverse, du même task : `String.replace` d'un motif qui ne matche pas **ne lève
   rien** — il rend la chaîne inchangée. Toute réécriture par regex a donc besoin
   d'une garde explicite sur le motif introuvable, sinon la couture se défait en
   silence (ici : `VERSION` figée pour toujours, c'est-à-dire le piège n°10 remis
   en place sans que personne le sache).
5. ⚠️ **Un export mort n'est presque jamais seul : c'est la fermeture transitive
   qu'il faut calculer, pas le nom** (Task 20). Le plan annonçait sept helpers HTML
   dont « les fonctions restent utilisées en interne par `build.js` ». Le contrôle
   nom par nom (`grep -n "\bnom\b" tools/build.js`, définition **et** appels) a
   montré l'inverse : `parseSections`, `exemplesOf`, `attrOf`, `tdsOf` n'avaient
   plus **aucun** appelant interne, et les trois autres (`closeOf`, `firstSpanText`,
   `decodeEntities`) n'étaient appelés que par les quatre premiers, plus leurs
   propres satellites (`textContent`, `blocksOf`, `NAMED_ENTITIES`). Tout le
   sous-graphe ne tenait que par les exports : en retirant les exports on retirait
   le mini-parseur entier — 90 lignes, et l'affirmation « le dépôt ne lit plus de
   HTML » devenue vraie au sens littéral. **Ne pas s'arrêter au nom cité par un
   plan : suivre les appelants jusqu'à l'appelant vivant, ou constater qu'il n'y
   en a pas.**

### Dette de graphe — flags en attente, aucun ne déclenche rien

`/graphify . --update` coûte **~235 000 tokens** : c'est toujours une décision
séparée et explicite (règle du propriétaire, 21/07). Ces flags **consignent la
dette**, ils ne la soldent pas. Quand un recalage est décidé, les effacer dans
le même commit que `graphify-out/graph.json`.

⚠️ **État du graphe au 25/07 : il ne connaît ni `data/`, ni `src/carnet/`, ni
`src/app/`, ni `src/portail/`, ni `tools/`, ni `docs/`, ni `.githooks/`.** Il reste fiable sur ce
qui n'a pas bougé — la structure du carnet, les règles de design, les pièges.
Pour tout le reste, va directement au `grep -n` sur le module nommé par les
en-têtes `// Expose :` (listés dans ARCHITECTURE.md § Anatomie de l'app).

- **2026-07-23** — `SPEC_AJOUTE_MOTS.md`, `ajoute_mots.js`,
  `SPEC_ECONOMIE_TOKENS.md`, `cherche_mots.js`, `TODO_ARCHIVE.md` créés.
- **2026-07-24** — `data/**`, `src/carnet/**`, `src/tokens.css`,
  `outils_migration/**` créés ; carnet régénéré (chantier 1). Puis (chantier 2)
  `cards.json` créé ; `genere_carnet.js`, `valide_donnees.js` et
  `compare_carnets.js` supprimés d'`outils_migration/`.
- **2026-07-25 (chantier 3)** — `src/app/**` créé (coquille, `ordre.json`, 6
  fragments CSS, 14 modules JS), `outils_migration/decoupe_app.js` créé ;
  `app.html` devenu artefact. Le graphe situe encore les 83 fonctions de l'app
  **dans `app.html`**, à des lignes qui n'existent plus.
- **2026-07-25 (tripwires)** — `.githooks/pre-commit` créé.
- **2026-07-25 (Task 17)** — `tools/` et `docs/` créés (11 fichiers déplacés),
  `audit_carnet_mecanique.js` **supprimé** : le graphe porte une **communauté
  morte de 39 nœuds** sur un fichier qui n'existe plus.
- **2026-07-25 (Task 18)** — `src/portail/index.html` créé ; `index.html` devenu
  artefact généré. Le graphe le situe encore côté « source éditée à la main ».
- **2026-07-25 (Task 20)** — `outils_migration/` **supprimé** (ses trois scripts :
  `extrait_donnees.js`, `decoupe_carnet.js`, `decoupe_app.js`). Le graphe ne les a
  jamais connus (dossier créé après le dernier recalage), donc **rien à retirer de
  son côté** — la ligne est ici pour que le prochain recalage n'aille pas les
  chercher.

### Dette ouverte — petits défauts connus, non corrigés

Aucun n'est bloquant ; aucun n'a de task assignée. À trancher si quelqu'un les
rencontre.

- **Premier lancement sans chip de niveau** : `state.niveaux` reste vide et
  « démarrer » ne fait rien. Jugé conforme à l'intention lors du contrôle, laissé
  tel quel.
- **Étiquette de diagnostic « extraction »** dans l'app : elle mesure désormais
  un `JSON.parse`, son nom est un reliquat de l'époque de l'extracteur HTML.
- **`construitIndexFichiers()` dans `cherche_mots.js`** duplique l'énumération de
  `data/listes/` que `build.js` fait déjà.
- **`he2tr` faute de façon reproductible** sur : shva initial devant sifflante
  (`shekufah` pour shkufah), yud consonantique (`meiuman` pour meyuman),
  redoublement (`boddim` pour bodedim), alef final (`achray` pour achra'i). Les
  `tr` du carnet font foi — ne jamais les régénérer en masse depuis `he2tr`
  (piège documenté dans CLAUDE.md § Transliteration standard).
## Outillage (WSL, à recréer en début de session si besoin)

- **Consultation du carnet par commande** : `node tools/cherche_mots.js TERME…` (« ce mot
  existe-t-il, où ? ») et `--stats` (thèmes/niveaux sous-dotés). Le canal cheap du piège
  n°15 : une question d'existence, de compte ou d'emplacement se paie par commande, jamais
  par une lecture ni un sous-agent. ⚠️ **`ABSENT` ne conclut rien sans lire la rubrique
  « orthographe voisine »** : le carnet est vocalisé donc défectif, et l'appariement ktiv
  male/haser est la seule chose qui empêche d'insérer un doublon. Contrat complet dans
  ARCHITECTURE.md § Les fichiers.
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
  des `.table-wrap` — c'est le contrôle qui a attrapé les deux régressions du jour —,
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
- **Graphe de connaissance** (`graphify-out/`, versionné) : **à interroger avant d'ouvrir un
  gros fichier** — `graphify explain "checkAnswer"` donne la ligne source et les
  appelants/appelés en ~15 lignes, `graphify query "…"` répond en ~2 300 tokens là où lire
  `app.html` en coûte des dizaines de milliers. ⚠️ C'est un **instantané**, et il est
  périmé sur tout ce que les chantiers 1 à 4 ont créé (voir « Dette de graphe » ci-dessus,
  seul état de référence) : en cas de contradiction avec le fichier, le fichier fait foi.
  Contenu, communautés et coût de recalage dans ARCHITECTURE.md § Le graphe de connaissance
  du dépôt.
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

1. `node tools/build.js` — lit `data/*.json` + `src/` et régénère les **cinq** artefacts
   (`vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html`,
   `index.html`) ; échec
   si une section ou un niveau attendu tombe à 0, si une entrée sort sans `niveau` valide,
   ou si un `theme` sort de `EXPECTED_THEMES` ; vérifier les comptes affichés (sections,
   niveaux, thèmes, exemples).
2. Si des exemples ont changé : `node tools/verifie_exemples.js` — **0 erreur exigé**.
3. Vérifier le comportement **au niveau le moins cher qui prouve vraiment quelque chose**.
   `node tools/build.js --check` compare déjà les **cinq artefacts régénérés** au contenu
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
4. **Rien à faire sur `sw.js` : l'étape 1 a déjà estampillé `VERSION`** (Task 19 — un hash
   des cinq artefacts + `manifest.webmanifest`). Le seul devoir qui reste est de
   **committer `sw.js` avec les artefacts** : séparés en deux commits, le nom du cache
   retarde d'un commit sur le contenu qu'il nomme. Un `VERSION` édité à la main est
   rejeté par `--check` — et pour forcer une vraie purge de cache, c'est le préfixe de
   `CACHE` qu'on change, pas la version.

   ⚠️ **Depuis le 25/07, un hook `pre-commit` versionné tient le filet** (`.githooks/
   pre-commit` ; installation, une fois par machine : `git config core.hooksPath
   .githooks`). Il exécute `node tools/build.js --check` + `node tools/verifie_exemples.js`
   avant chaque commit (bypass assumé, à justifier dans le message : `git commit
   --no-verify`). Il portait un troisième contrôle — bump manuel de `VERSION` exigé dès
   qu'un fichier servi changeait — **retiré au Task 19** : `--check` recalculant
   l'estampille, le premier contrôle en hérite. Le hook est le filet, pas le rituel :
   continuer à lancer les étapes à la main. Les tripwires de charte (pièges n°2, 3, 5),
   eux, vivent dans `verifieCharte()` de `build.js` — détail dans ARCHITECTURE.md
   § Garde-fous.
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
   fichier (surtout « Reprendre ici »).

   ⚠️ **Règle des comptes gelés — n'écris pas un nombre que personne ne recalculera.**
   Cartes, exemples, mots, sections, tables, nœuds : tous se périment au lot suivant, en
   silence, et une doc fausse coûte plus qu'une doc muette (payé deux fois : « aucune
   table ne dépasse 894px » et les répartitions `data-niveau` du graphe, toutes deux
   restées écrites longtemps après être devenues fausses). **Écris la commande qui donne
   le chiffre, pas le chiffre** : `node tools/build.js --check` (sections, niveaux,
   thèmes, exemples), `node tools/cherche_mots.js --stats` (thèmes/niveaux sous-dotés),
   `grep -c` pour le reste. N'inscris un nombre en dur que s'il est **mesuré et stable
   par nature** (une largeur en px, un seuil de contraste) — et dis alors ce qui le
   remesure. Seule exception connue : le compte de nœuds `lang="he"` se **mesure dans le
   navigateur, il ne se calcule pas** (une entrée crée aussi ses `span.cursive` générés,
   donc elle pèse plus d'un nœud) — raison de plus pour ne pas le figer dans la prose.
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

   `grep -rnE '\]\((\.\./)?app\.html#L' README.md CLAUDE.md docs/*.md --exclude=TODO_ARCHIVE.md --exclude=TODO.md`

   — doit rester **vide**. (Depuis le Task 17, la prose vit dans `docs/`, donc une
   ancre y prendrait la forme `](../app.html#L…)` : le motif ci-dessus couvre les deux
   graphies. `TODO.md` s'exclut lui-même — il contient la commande.)
8. Commit par changement, messages en français (comme l'historique), puis push sur `main`
   (GitHub Pages redéploie automatiquement). C'est le point de coupure propre : l'état vit
   dans git et dans « Reprendre ici », pas dans la fenêtre de contexte.
