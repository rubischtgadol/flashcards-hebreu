# État du projet et travail restant

> **Archive** : les chantiers clos et l'historique des acquis sont déplacés dans [TODO_ARCHIVE.md](TODO_ARCHIVE.md) — ne pas charger en session sauf besoin explicite (grep ponctuel). L'état courant et les chantiers ouverts vivent ici.

## Reprendre ici (prochaine session)

⚠️ GRAPHE À RECALER — 2026-07-23 : SPEC_AJOUTE_MOTS.md (créé), ajoute_mots.js
(créé), SPEC_ECONOMIE_TOKENS.md (créé), cherche_mots.js (créé), TODO_ARCHIVE.md
(créé). Le flag enregistre la dette, il ne déclenche rien (règle du 21/07).

**Chantier économie de tokens (SPEC_ECONOMIE_TOKENS.md) — SOLDÉ, correctifs §10
compris.** Rien n'y est en attente ; la suite est libre.

Le défaut trouvé à la relecture est corrigé : `cherche_mots.js` répondait
`ABSENT` sur 6 des 24 mots pourtant insérés (ktiv male de la requête vs ktiv
haser du carnet vocalisé) — faux négatif, donc le sens dangereux : il laissait
passer un doublon. `orthographeVoisine` vit maintenant dans `build.js` (insertion
de ו/י seulement, forme courte ≥ 3 lettres, ≤ 2 insertions ; 37 paires sur 1053
mots, toutes légitimes), consommé par `cherche_mots.js` en rubrique séparée et
par `ajoute_mots.js` en informatif non bloquant. Validation §10.5 verte de bout
en bout : les 6 mots retrouvés, contre-tests **négatifs** compris (לישן ne
remonte pas לשון, יפה ne remonte pas פה — les deux mots-pièges sont bien au
corpus), `--check` vert, 14 avertissements inchangés, idempotence du lot des 24
intacte et les 12 cas d'erreur de SPEC_AJOUTE_MOTS §8 toujours verts. Aucun
doublon n'avait été créé (§10.6) : piège corrigé avant qu'il ne morde. Aucun
contenu touché ⇒ pas de bump `sw.js`, pas de flag graphe.

Les 3 commits de la spec §8 + le chantier C + le lot des 24 mots, tous livrés :

- **Commits 1–2** : la spec ; `cherche_mots.js`, consultation du carnet par
  commande (piège n°15) — validation §2.3 verte, et חי détecté comme forme MS
  de לִחְיוֹת que l'inventaire par sous-agent à 56k tokens avait raté.
- **Commit 3** : TODO.md archivé **165 → 16 Ko** (pur couper-coller, conservation
  des 2009 lignes non vides prouvée par script) → tout l'historique dans
  TODO_ARCHIVE.md ; piège n°15 codifié (CLAUDE.md, § Outillage ici, README,
  ARCHITECTURE) ; flag graphe étendu à TODO_ARCHIVE.md.
- **Chantier C** : CLAUDE.md compressé **−5,8 %** (Group A validé par Ruben, 9
  migrations de narration déjà dupliquée dans DESIGN/ARCHITECTURE/mémoire ;
  aucune règle retirée). La cible §4 de −30 % abandonnée : le fichier est ~94 %
  de règles, que §4 interdit de retirer. ⚠️ **Gain net réel : nul** — 21 014 o
  avant, 21 026 o après (la compression a exactement payé le piège n°15). La
  promesse « 1,5–2k tokens par tour » de §4 était irréaliste dès l'écriture —
  elle est désormais barrée dans §4 même, avec le chiffre réel et la leçon
  (§10.3). Le vrai gain acquis est ailleurs : TODO.md 163 → 16 Ko, et
  l'inventaire à 56k tokens remplacé par une commande à ~200.
- **Lot des 24 mots « de base »** : **1046 → 1070 cartes** (8 noms, 8 adjectifs,
  8 verbes), exemples **894 → 918**, via `ajoute_mots.js` dry-run puis `--ecrire`.
  Dosage A1/A2 confirmé (6 A2 : סוֹף, סוּג, דֻּגְמָה, אֲמִיתִּי, לְהַפְסִיק,
  לְהַרְוִיחַ). חַי « vivant » ajouté en **adjectif** (cardId `Adjectifs|חי`
  distinct de la forme MS de לִחְיוֹת — aucune fusion SRS possible). Trois `tr`
  corrigés à la relecture (marviach, dugma'ot, exemple de עגל étoffé à 3 mots).
  **0 nouvel avertissement** (les 14 préexistants tolérés inchangés) ; niveaux
  A1 402 / A2 436 / B1 223 / B2 9, couverture 1070/1070, thèmes 853/853,
  `--check` en phase. SW **non bumpé** (contenu pur, stale-while-revalidate →
  2ᵉ lancement). Graphe : flag en attente, pas d'update réflexe.

**Chantier QCM : distracteurs dans le thème de la réponse (demande Ruben,
23/07) — SOLDÉ.** `pickDistractors()` piochait dans toute la banque : les
propositions hors sujet rendaient le QCM résoluble par élimination, sans
reconnaître le mot. Deux étages ont été **insérés en tête** de la cascade
existante (jamais en remplacement) : même `theme` + même `cat`, puis même
`theme` + autre `cat` — la préférence pour la même catégorie évite de rendre la
bonne réponse repérable à sa seule forme grammaticale (un infinitif en ל se voit
au milieu de trois noms). Suivent les étages d'avant : même `cat`, autre `cat`,
puis le dernier recours relâché qui garantit 4 options. Les deux nouveaux étages
sont gardés par `if(card.theme)` : seules les cartes des 3 tables portent un
thème (853/1070), et sans ce garde les `undefined` s'apparieraient entre eux,
c'est-à-dire toutes les listes ensemble. Le garde-fou anti-ambiguïté
(`frVariants`/`editDist` + l'accumulateur `kept`) est conservé tel quel sur les
nouveaux étages.

Preuve en jsdom (sous-agent Sonnet, aucun navigateur — logique pure, rituel
étape 3), **5 critères sur 5 au vert** : 42 800 tirages (1070 cartes × 2 sens ×
20) donnent 100 % de QCM à 4 propositions distinctes selon la clé du mode ; sur
les 34 120 tirages des 853 cartes à thème, **100 % des distracteurs partagent le
thème — aucun repli constaté**, le vivier n'est jamais assez maigre pour épuiser
l'étage ; les 217 cartes sans thème rendent une sortie **octet-à-octet identique
à l'ancienne cascade** (comparaison à `Math.random` semé, 6 510 tirages), le
bloc étant bien sauté en entier ; 0 violation de `tooClose` sur 128 400
distracteurs ; les 3 couples thème×cat les plus maigres (effectif 3 :
`vetements-couleurs×Verbes`, `temps-calendrier×Verbes`, `nature×Adjectifs`)
dégradent proprement vers l'étage thème+autre-cat, sans jamais atteindre le
dernier recours. `build.js` + `--check` verts ; `sw.js` **bumpé v26 → v27**
(changement de comportement, il doit atteindre l'iPhone au prochain lancement) ;
graphe laissé tel quel (édit interne à un fichier existant, règle du 21/07).

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

1. `node build.js` — régénère `flashcards_hebreu.html` ; échec si une section ou un
   niveau attendu tombe à 0 ; vérifier les comptes affichés (sections, niveaux, exemples).
2. Si des exemples ont changé : `node verifie_exemples.js` — **0 erreur exigé**.
3. Vérifier le comportement **au niveau le moins cher qui prouve vraiment quelque chose**.
   `node build.js --check` compare déjà les deux extracteurs au octet : un changement de
   **contenu seul est prouvé par les étapes 1–2**, rien à ajouter. Serveur local ou jsdom
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
7. **Recaler les ancres de lignes** si `app.html` a changé de taille. Elles ont dérivé
   **quatre fois** (19/07 au matin ; retrouvées toutes fausses le soir, +25 ; de nouveau
   après les plis, de +22 à +82 selon l'endroit ; puis +11 uniforme, constaté le 20/07).
   Le décalage n'est **pas** toujours uniforme — chaque ancre se vérifie. Une ancre fausse
   est pire qu'absente : elle envoie lire le mauvais code avec assurance.

   Depuis le 20/07 la surface a beaucoup réduit : **CLAUDE.md et DESIGN.md n'en portent
   plus aucune** (CLAUDE.md déléguant au graphe, dont `graphify explain "<symbole>"` redonne
   la ligne exacte sans entretien manuel). Restent ARCHITECTURE.md (16) et TODO.md (3) :

   `for l in $(grep -o 'app\.html#L[0-9][0-9]*' ARCHITECTURE.md TODO.md | grep -o '[0-9]*$' | sort -un); do printf '%5s: %s\n' "$l" "$(sed -n "${l}p" app.html | cut -c1-64)"; done`

   — chaque ligne affichée doit correspondre à ce que le document annonce. En cas de doute
   sur la vraie position d'un symbole : `graphify explain "<symbole>"`.
8. Commit par changement, messages en français (comme l'historique), puis push sur `main`
   (GitHub Pages redéploie automatiquement). C'est le point de coupure propre : l'état vit
   dans git et dans « Reprendre ici », pas dans la fenêtre de contexte.
