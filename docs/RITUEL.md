# Le rituel et l'outillage

> **Procédures permanentes.** Ce fichier reste distinct de [TODO.md](TODO.md) : le rituel et l'outillage ne changent pas d'une session à
> l'autre, alors que TODO.md décrit un état qui change à chaque chantier.
> TODO.md ne porte que ce qui bouge ; ce qui ne bouge pas est ici.

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
   l'installation de l'outillage plus une session de pilotage.

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
4. **Rien à faire sur `sw.js` : l'étape 1 a déjà estampillé `VERSION`** (un hash
   des cinq artefacts + `manifest.webmanifest`). Le seul devoir qui reste est de
   **committer `sw.js` avec les artefacts** : séparés en deux commits, le nom du cache
   retarde d'un commit sur le contenu qu'il nomme. Un `VERSION` édité à la main est
   rejeté par `--check` — et pour forcer une vraie purge de cache, c'est le préfixe de
   `CACHE` qu'on change, pas la version.

   ⚠️ **Un hook `pre-commit` versionné tient le filet** (`.githooks/
   pre-commit` ; installation, une fois par machine : `git config core.hooksPath
   .githooks`). Il exécute `node tools/build.js --check` + `node tools/verifie_exemples.js`
   avant chaque commit (bypass assumé, à justifier dans le message : `git commit
   --no-verify`). Il n'a pas de contrôle distinct pour `VERSION` : `--check` recalcule
   l'estampille, et le premier contrôle en hérite. Le hook est le filet, pas le rituel :
   continuer à lancer les étapes à la main. Les tripwires de charte (pièges n°2, 3, 5),
   eux, vivent dans `verifieCharte()` de `build.js` — détail dans ARCHITECTURE.md
   § Garde-fous.
5. **Le graphe ne se recale JAMAIS dans le rituel — au plus il se FLAGGE (règle de
   Ruben).** `/graphify . --update` coûte **~235 000 tokens** (mesuré) :
   le lancer est toujours une décision séparée et explicite. **Le flag ne déclenche pas
   la mise à jour — rien dans ce rituel ne la déclenche.**
   - **Un fichier a été créé, supprimé ou renommé** → poser (ou compléter) la ligne de
     flag dans « Reprendre ici » : `⚠️ GRAPHE À RECALER : <fichiers>`. Le flag
     consigne la dette pour que le prochain recalage décidé sache pourquoi il tourne —
     c'est TOUT ce qu'il fait.
   - **Tout le reste** — lots de contenu du carnet, prose des `.md`, et même les
     modifications structurelles *à l'intérieur* de fichiers existants : ni recalage,
     ni flag. Cette dérive interne est tolérée par construction : `graphify explain`
     re-dérive les lignes mécaniquement, et un désaccord graphe/fichier se tranche pour
     le fichier. Le dire dans le message de commit (« graphe laissé tel quel »).
   - Quand un recalage EST décidé (flag en attente + une session qui a besoin d'une
     carte juste), solder le flag dans le même commit que `graphify-out/graph.json`.

   ⚠️ Un recalage lancé sur un lot de contenu pur coûte **~4 fois le travail utile** pour ne
   faire bouger que quelques compteurs. Le diff de `--update` (168 nœuds ajoutés, 87
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
   Les ancres de ligne dérivent à chaque réorganisation du code, et le décalage n'est
   **pas** uniforme — une ancre fausse est pire qu'absente : elle envoie lire le mauvais code
   avec assurance. La cause de fond est supprimée plutôt que réparée à chaque fois :
   `app.html` est un artefact régénéré à chaque build, donc **la doc pointe le module
   source** (`src/app/js/12-qcm.js`, `src/app/coquille.html`…), sans numéro de ligne pour
   le code — `graphify explain "<symbole>"` redonne la ligne exacte sans entretien manuel.

   Contrôle (chaîne littérale, pour ne pas matcher les mentions en prose ;
   `TODO_ARCHIVE.md` est exclu — c'est un gel historique, on n'y touche pas) :

   `grep -rnE '\]\((\.\./)?app\.html#L' README.md CLAUDE.md docs/*.md --exclude=TODO_ARCHIVE.md --exclude=TODO.md`

   — doit rester **vide**. (La prose vit dans `docs/`, donc une
   ancre y prendrait la forme `](../app.html#L…)` : le motif ci-dessus couvre les deux
   graphies. `TODO.md` s'exclut lui-même — il contient la commande.)
8. Commit par changement, messages en français (comme l'historique), puis push sur `main`
   (GitHub Pages redéploie automatiquement). C'est le point de coupure propre : l'état vit
   dans git et dans « Reprendre ici », pas dans la fenêtre de contexte.

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
- **Suite d'audit** (scratchpad, à recréer au besoin — pour l'audit du
  carnet, réutilisable sur n'importe quelle page) : `audit_carnet.js` mesure en un passage
  le contraste réel de chaque nœud texte (composition alpha comprise, seuils AA 4,5:1/3:1),
  la hiérarchie des titres et les sauts de niveau, les landmarks, la **couverture `lang="he"`**
  (parcours du DOM avec remontée d'ancêtres), l'anneau de focus sous vraie tabulation, le
  débordement horizontal à 320/375/402/430/768 px et les cibles tactiles sur iPhone 16 Pro.
  ⚠️ Piège Playwright : la forme **chaîne** d'`evaluate()` attend une *expression* — envelopper
  le corps dans `(()=>{ … })()`, sinon `SyntaxError: Unexpected keyword 'function'`.
- **Suite de mise en page** (scratchpad, à recréer au besoin — pour le
  bornage de la largeur de lecture, réutilisable sur tout changement de layout). Elle
  compare **deux copies du fichier**, l'une avec le bloc CSS en cause retiré, aux six
  largeurs 1440/1280/992/900/768 + iPhone 16 Pro, et mesure : débordement horizontal du
  document (`scrollWidth` vs `clientWidth`), `clientWidth`/`scrollWidth` de **chacune**
  des `.table-wrap` — c'est le contrôle qui attrape une régression de largeur —,
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
- **Suite du diagnostic de latence** (scratchpad de session, à recréer au besoin) : `test_perf_note.js` boote le **standalone** en jsdom et vérifie
  le format des trois rapports (chip, départ, `#perf-boot` vide donc masqué) ;
  `test_srs_migration.js` sème un `srs_v1` à l'ancien format **avant** le boot
  (`beforeParse` + `localStorage.setItem`) et vérifie migration + séparation des
  homographes. ⚠️ Piège payé en l'écrivant : l'espace avant « ms » est une **fine
  insécable U+202F** (invisible au terminal, échoue toute comparaison naïve) — elle
  est en escape `\u202f` dans la source d'`app.html` pour cette raison.

## Règles de méthode

Elles ne racontent rien : chacune dit une manière de se tromper qui reste ouverte
au prochain garde-fou, au prochain déménagement de fichier, au prochain export
supprimé.

1. **Quand un fichier bouge ou disparaît, un `grep` borné aux `.md` ne suffit
   pas.** Quatre familles de références lui échappent : les **chaînes d'usage et
   messages d'erreur dans les scripts eux-mêmes** — certaines sortent dans
   l'en-tête « FICHIER GÉNÉRÉ » des artefacts, donc les toucher force un rebuild,
   qui réestampille `sw.js` au passage ; l'**allowlist**
   `.claude/settings.local.json` ; les **liens markdown à fragment**
   (`](…#L42)`), invisibles au motif sans `#` ; et le **bac à sable
   d'`ajoute_mots.js`**, qui recopie un dépôt miniature — toute garde neuve qui
   lit un fichier hors de ce périmètre casse le dry-run tant que le fichier n'y
   est pas ajouté.
2. ⚠️ **Un chiffre juste n'est pas une preuve — ce qui prouve, c'est d'où il
   vient.** Un compte calculé *en process* peut afficher la bonne valeur en
   validant un tout autre arbre. Un contrôle doit relire ce que le processus
   contrôlé a réellement imprimé.
3. ⚠️ **Générer un fichier prouve que le contenu arrive, jamais qu'il soit
   seul.** Injecter des jetons garantit qu'ils sont là ; cela ne dit rien d'une
   seconde déclaration écrite en dur à côté, qui gagnerait par cascade sans rien
   casser de visible. Quand une tâche « clôt un piège par construction »,
   demander *par quel chemin il pourrait revenir* et mécaniser ce chemin-là.
4. ⚠️ **Une garde qui ne peut pas échouer ne prouve rien — et cela se vérifie,
   ne se suppose pas.** Toute garde se prouve par **casse fabriquée** : sortie
   non-zéro réelle, message nommé. Une garde muette par construction se supprime
   plutôt qu'elle ne se garde pour la forme. Corollaire de même famille :
   `String.replace` d'un motif qui ne matche pas **ne lève rien**, il rend la
   chaîne inchangée — toute réécriture par regex a besoin d'une garde explicite
   sur le motif introuvable, sinon la couture se défait en silence.
5. ⚠️ **Un export mort n'est presque jamais seul : c'est la fermeture transitive
   qu'il faut calculer, pas le nom.** Un helper « encore utilisé en interne » ne
   l'est souvent que par d'autres helpers eux-mêmes morts ; tout le sous-graphe
   ne tient que par les exports. Suivre les appelants jusqu'à l'appelant vivant,
   ou constater qu'il n'y en a pas.
