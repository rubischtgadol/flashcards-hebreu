# État du projet et travail restant

> **Archive** : les chantiers clos et l'historique des acquis sont déplacés dans [TODO_ARCHIVE.md](TODO_ARCHIVE.md) — ne pas charger en session sauf besoin explicite (grep ponctuel). L'état courant et les chantiers ouverts vivent ici.

## Reprendre ici (prochaine session)

**Où en est le dépôt (27/07/2026, tout poussé sur `main`).** La réorganisation
« le dépôt généré » est **CLOSE** : ses 21 tasks, chantiers 1 à 4, sont soldés,
contrôle de sortie compris (Task 21 — la preuve et sa procédure de rejeu sont
dans TODO_ARCHIVE.md § « Chantiers clos et dette soldée — archivés le
2026-07-27 »). **Aucun chantier n'est ouvert** sur `main` ; la dette ouverte
compte **une entrée**, rouverte le 27/07 (les notes d'usage que le carnet stocke
sans les afficher — voir § Dette ouverte).

**Le carnet compte 1428 cartes** (A1 429 · A2 573 · B1 390 · B2 26 · C1 10).
⚠️ Ce chiffre est le seul de ce fichier qui vaille recopie, et il périme au
prochain lot : l'autorité qui le recalcule est `node tools/cherche_mots.js
--stats`, jamais cette page.

⚠️ **GRAPHE À RECALER — 27/07/2026 : `data/listes/hebreu-parle.json`,
`src/carnet/sections/37-hebreu-parle.html` (créés) ; `docs/superpowers/**`
(4 fichiers supprimés au ménage documentaire).** Le graphe n'a jamais connu ces
quatre-là — il est antérieur à `docs/` —, donc il n'y a rien à en retirer : la
ligne est là pour que le prochain recalage n'aille pas les chercher. Le flag
enregistre la dette, il ne déclenche rien (`/graphify . --update` coûte ~235k tokens et ne se
lance que sur décision explicite).

**Dernier chantier livré — « Le mortier grammatical », 27/07/2026, soldé.**
Constat du propriétaire : « il manque beaucoup de trucs de base comme *efshar*,
*quelque chose*, *zone* ». Vérifié, et fondé : le carnet était riche en
vocabulaire **thématique** (nourriture 87, ville-transport 94) et pauvre en
**mots-outils** — אֶפְשָׁר, מַשֶּׁהוּ, מִישֶׁהוּ, רַק, כִּמְעַט, לָכֵן, כְּדֵי
absents avec 1262 cartes au compteur. Audit systématique en 3 sous-agents
parallèles : **301 candidats testés, ~150 absences confirmées**. **1262 → 1428
cartes** (166 neuves, aucune retirée — consigne explicite : « ajoute tout ce que
tu trouves, n'enlève rien », B2/C1 compris).

- **Palier C1 ouvert** (`EXPECTED_LEVELS`, build.js) : 10 entrées de registre
  soutenu. Côté app, **zéro câblage** — `NIVEAUX` rangeait déjà C1 dans
  « Difficile ». Détail et piège de l'ordre en ARCHITECTURE.md § 4.
- **Deux sous-thèmes neufs** aux Adverbes : « Degré & intensité », « Manière ».
- ⚠️ **Erreur de spec corrigée** (SPEC_AJOUTE_MOTS §10) : « éditer le gabarit
  puis relancer `ajoute_mots.js` » est **faux** pour un sous-thème de liste. La
  résolution se fait sur `info.liste.entries` (la donnée), et `genereCarnet()`
  refuse un placeholder qui ne consomme rien — **blocage circulaire**. Il faut
  une **entrée d'amorce écrite à la main** en même temps que le gabarit.
- ⚠️ **Leçon payée : un vérificateur d'absence doit être contrôlé avant usage.**
  Le premier repli ktiv male/haser annonçait `רַק` et `מִיָּד` *présents* par
  collision de squelette (ירק « légume », מדי « trop ») — un audit lancé
  là-dessus aurait enterré les absences les plus criantes. Deux garde-fous :
  une ו/י **initiale** n'est jamais mater lectionis, et **sous 3 lettres** de
  squelette on exige l'exact. Corollaire assumé : le repli devient aveugle aux
  mots courts, donc `כִּוּוּן` ressort `ABSENT` à tort — le doute se lève à la main.
- ⚠️ **Les sous-agents confondent `ch` (het) et `kh` (khaf sans daguech)**, de
  façon systématique (`'achshav`, `nachon`, `bechol`), et capitalisent les gloses
  françaises avec un point final. Ne jamais insérer un rendu d'agent sans passer
  les `tr` au comparateur `he2tr` : c'est lui qui a nommé les 12 fautes.
- ⚠️ **Un audit délégué a des trous : le relire.** Les trois agents ont manqué
  מַשֶּׁהוּ et מִישֶׁהוּ — les deux indéfinis les plus fréquents —, plus עוֹד,
  פַּעַם, כָּזֶה. Et `רַק` a survécu à l'audit *et* à ma propre synthèse : il n'a
  été rattrapé qu'au contrôle final contre la liste initiale. Un lot de
  rattrapage (11 entrées) a suivi.
- Preuve : `--check` vert sur les cinq artefacts, `verifie_exemples` **0 erreur**
  (124 avertissements éditoriaux). Pas de WebKit : aucun CSS ni chemin de rendu
  touché.

**Passe documentaire du 27/07/2026, dans la foulée.** Toute la documentation a
été auditée contre l'état réel (4 sous-agents, ~160 affirmations vérifiées) :
**17 faussetés corrigées** — ARCHITECTURE.md 8 (dont `firstSpanText` et
`parseSections` décrites comme vivantes alors que le mini-parseur HTML est parti
au Task 20, et deux renvois de module intervertis), SPEC_AJOUTE_MOTS.md 5,
DESIGN.md 3, README.md 1. `docs/superpowers/**` supprimé (4 fichiers de chantiers
clos, précédent du dépôt, historique git conservé), 137 lignes de TODO.md
archivées. Les **15 pièges de CLAUDE.md ont été re-vérifiés un par un : tous
tiennent**.

### Deux branches latérales — aucune n'est le chantier courant

`main` n'en porte aucune trace : consigné ici pour qu'une session ne les
redécouvre pas par hasard. L'écart se relit à tout moment —
`git rev-list --count main..<branche>` (devant) et
`git rev-list --count <branche>..main` (derrière). Relevé du 27/07 :
`refonte-retrofuturiste` **48 devant / 63 derrière**, `pilier-oral`
**7 devant / 98 derrière**.

⚠️ **Consigne du propriétaire, 27/07/2026 : « ne touche pas à la branche
retrofuturiste ».** Ni checkout, ni merge, ni rebase, ni écriture dans son
worktree. On peut la lire pour documenter l'écart — pas la modifier.

- **`refonte-retrofuturiste`** — la charte v2 « La console d'étude », **refonte
  purement visuelle**. ⚠️ **Rectification du 27/07 : la rédaction précédente
  annonçait qu'elle était « le chantier courant » depuis le 25/07.** C'est faux
  aujourd'hui — deux chantiers ont été livrés sur `main` le 27/07 (« Hébreu
  parlé », puis « Le mortier grammatical » et sa passe documentaire). `main` est
  bien le tronc actif ; cette branche est en attente, pas en cours. Elle est
  **sortie en worktree**
  (`git worktree list` → `/home/ruben/dev/flashcards-hebreu-refonte`), donc on
  ne la `checkout` pas depuis ce répertoire-ci. Intention déjà cadrée sur la
  branche (commit `92e7aa3`, spec §7) : les deux chartes coexisteront via un
  sélecteur à l'accueil.
- **`pilier-oral`** — verso des verbes en grille 2×2, accueil idiomatique,
  quelques points de vocabulaire. Pas d'échéance décidée.

⚠️ **Le coût du report n'est PAS le même pour les deux — vérifié le 25/07, après
une première rédaction qui les mettait à tort dans le même sac.** La commande qui
tranche, branche par branche :

```bash
git diff --name-only main...<branche> -- app.html index.html vocabulaire_hebreu.html flashcards_hebreu.html cards.json
```

- **`refonte-retrofuturiste`** — la sortie est **vide** : la branche n'a jamais
  touché un seul artefact déployé. C'est une
  branche d'**exploration de design** : prototypes autonomes (`prototype-*.html`,
  `specimen-*.html`, `test-crt-iphone.html`), polices dans `polices/`, la spec de
  la charte, et de la prose. Son résultat n'est donc pas un patch à fusionner
  mais une **spécification arbitrée à implémenter** — travail neuf, côté `src/`.
  Ce qui entrera vraiment en conflit à un merge : les docs (la branche les édite
  à la **racine**, `main` les a déplacées dans `docs/` au Task 17), `data/`
  (doublon de commit ci-dessous) et `outils_migration/extrait_donnees.js`
  (supprimé sur `main`, modifié sur la branche) — trois conflits mécaniques,
  aucun sur du code d'application.
- **`pilier-oral`** — la sortie **n'est pas vide** : elle édite bel et bien
  `app.html`, `index.html`, `vocabulaire_hebreu.html` et `flashcards_hebreu.html`
  **à la main**, alors que ce sont désormais des artefacts régénérés. Là, un
  `git merge` produirait des conflits sur des fichiers **écrasés au prochain
  `node tools/build.js`** : le report se fait par **re-portage dans la source**
  (`src/app/`, `src/portail/`, `data/` + `src/carnet/`), en lisant le diff comme
  une spécification. Ce n'est pas un merge, c'est une réécriture guidée.

💡 **Et la réorganisation a rendu la charte v2 nettement moins chère qu'à
l'époque où la branche a été ouverte.** La charte couleur tient maintenant dans
**`src/tokens.css` — 11 jetons, 4 lignes**, injectés au marqueur
`<!-- @TOKENS -->` dans les trois pages déployées (piège 5). Une seconde charte
est donc d'abord un **second jeu de jetons**, plus ce que la v2 ajoute au-delà
de la couleur (typographie, traitements) dans `src/app/css/` (6 fragments, ~536
lignes) et `src/portail/`. L'idée déjà cadrée sur la branche — les deux chartes
coexistant via un sélecteur à l'accueil — se pose donc en ces termes-là.

⚠️ **Un doublon de commit attend au croisement** : `bcf71d0` (sur
`refonte-retrofuturiste` seulement) et `ff25eec` (sur `main` seulement) portent
le **même changement** — l'extraction du vocabulaire vers `data/` — sous deux
hashes, parce qu'il a été appliqué des deux côtés. Vérifiable :
`git log --oneline -1 bcf71d0` et `git log --oneline -1 ff25eec` donnent le
même titre, et `git branch --contains` sur chacun ne renvoie qu'une branche.
Le traiter explicitement au report, sinon il ressort en conflit d'un travail
déjà fait.

### Cinq leçons de méthode — le chantier est clos, elles engagent la suite

Elles ne sont pas archivées avec le chantier : chacune décrit une manière de se
tromper qui reste ouverte au prochain garde-fou, au prochain déménagement de
fichier, au prochain export supprimé.

1. **Quand un fichier bouge ou disparaît, un `grep` borné aux `.md` rate quatre
   familles de références.** (1) Les **chaînes d'usage et messages d'erreur dans
   les scripts eux-mêmes** — dont trois sortent dans l'en-tête « FICHIER
   GÉNÉRÉ » des artefacts, donc les toucher force un rebuild, qui réestampille
   `sw.js` au passage ; (2) l'allowlist `.claude/settings.local.json` ; (3) les
   **liens markdown à fragment** (`](…#L42)`) ; (4) le **bac à sable
   d'`ajoute_mots.js`**, qui recopie un dépôt
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
- **2026-07-25 (dette ouverte)** — `tools/mesure_translitteration.js` **créé**
  (harnais de notation de `he2tr`). Le graphe ne l'a jamais connu ; la ligne est
  ici pour que le prochain recalage sache qu'il existe.
- **2026-07-25 (Task 20)** — `outils_migration/` **supprimé** (ses trois scripts :
  `extrait_donnees.js`, `decoupe_carnet.js`, `decoupe_app.js`). Le graphe ne les a
  jamais connus (dossier créé après le dernier recalage), donc **rien à retirer de
  son côté** — la ligne est ici pour que le prochain recalage n'aille pas les
  chercher.

### Dette ouverte — une entrée, rouverte le 27/07/2026

Elle était vide depuis le 25/07 (les quatre entrées soldées sont dans
TODO_ARCHIVE.md). La passe documentaire en a rouvert une, trouvée en répondant à
une question du propriétaire — « as-tu expliqué dans le carnet comment utiliser
*efshar* ? ».

1. ⚠️ **Le carnet stocke 49 notes d'usage qu'il n'affiche pas.** `gabarits.js`
   émet le champ `note` de `data/` en attribut `data-note` sur le `<li>`
   ([src/carnet/gabarits.js](../src/carnet/gabarits.js), `itemListe`), et
   **rien ne le lit** : aucun `attr(data-note)` dans `src/carnet/carnet.css`,
   aucune lecture dans `src/carnet/carnet.js`. Vérifiable :
   `grep -c data-note vocabulaire_hebreu.html` → 49, et le même compte d'entrées
   portant une `note` dans `data/`. Ces notes ne s'affichent **que dans l'app**,
   au dos de la carte (`.note-line`, `src/app/js/10-rendu.js`).

   Ce qui est perdu, ce n'est pas de la décoration : c'est le mode d'emploi des
   mots-outils. `אֶפְשָׁר` « impersonnel, invariable : suit un infinitif »,
   `כְּשֶׁ` « préfixe soudé au verbe », `אַף אֶחָד` « toujours avec la
   négation », `יָכוֹל` et `צָרִיךְ` et leur accord — un lecteur du carnet ne
   voit rien de tout cela. Le défaut est **antérieur au lot du 27/07** : יָכוֹל
   et צָרִיךְ portaient déjà leur note invisible.

   **Non bloquant** parce que l'exemple en situation, lui, s'affiche, et qu'il
   porte l'essentiel de l'usage. **Ce qui le résoudrait** : afficher la note sous
   la ligne du mot dans le carnet — c'est une décision de charte (voix, place
   dans la hiérarchie typographique, comportement en colonne étroite), pas une
   correction mécanique, d'où son inscription ici plutôt qu'un correctif
   improvisé.

*Si un nouveau défaut connu apparaît, c'est ici qu'il se note — avec ce qui le
rend non bloquant, faute de quoi il devient un chantier.*

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
