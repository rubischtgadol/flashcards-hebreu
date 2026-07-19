# État du projet et travail restant

État au 2026-07-19, fin de journée. **Dernier acquis : le point 4 est soldé sauf la
consolidation typographique** — les dix P2/P3 de charte du carnet traités d'un lot
(`.tip` éteint, quatre micro-titres ad hoc ramenés à deux voix nommées, le voile noir
des exemples remplacé par une vraie couche, piles de polices complétées, `.attention`
extraite, anneau `:focus-visible` global, `theme-color`, tap-highlight, les deux
`transition:all`, `<main>`). **Le fichier autonome est inchangé au octet** : rien du
vocabulaire n'a bougé. 22 contrôles WebKit au vert, et le détecteur passe de 24 à 10
findings — les 10 restants *sont* le chantier typographique, seul reliquat du point 4.
**Acquis précédent : les points 2 et 5 de « Reprendre ici » sont soldés.** Les avertissements du validateur passent de **31 à 2** (les deux
restants sont légitimes et documentés), le carnet gagne 3 mots qui lui manquaient
(**713 cartes, 510 exemples**), la **fourmi cesse de vouloir dire « port »**, et le
portail revient au barème des jetons. Aucun des 29 avertissements soldés n'était un
mauvais exemple : c'étaient de la dérive orthographique, des trous de lexique, et deux
règles du validateur mal calibrées. **Toute la documentation est recalée** sur ce nouvel
état (comptes, règles du validateur, jeton de la porte, idiome de l'anneau de focus), et
deux chiffres qui étaient faux depuis un moment sont corrigés : les nœuds `lang="he"`
(5015, à mesurer et non à calculer) et les mots-outils sans exemple (181, pas 203).
**Deux acquis antérieurs du jour.** (1) **L'anneau de focus doré rendu
à tout l'interactif de l'app** — cause racine trouvée (`transition:all` fige les `outline-*`, et
non la piste `-webkit-appearance` qui est réfutée), six règles corrigées, 58 arrêts de
tabulation vérifiés en WebKit réel, 0 défaut (détail en « Fait »). (2) **L'audit du carnet est
fait** (13/20, 4 P1, aucun P0) **et ses 4 P1 sont corrigés** : le carnet a reçu les passes qui
lui manquaient — `lang="he"` de 0 à **100 %** (5003 nœuds), garde `prefers-reduced-motion`, or
ambiant de `.part` retiré, cibles tactiles de 21 défauts à 0. (Les P2/P3 de charte, alors non
engagés, ont été soldés depuis — voir le point 4 ; seule la consolidation typographique reste.) Avant cela : **critique
impeccable du portail et de l'app (30/40), P0 et P2 corrigés et vérifiés en WebKit** — le
bouton « Commencer » désactivé ne recouvre plus les chips, les dix cibles tactiles sous
44 px sont soldées, « Révision du jour » sort de la voix Title, la copie du verdict raté
est réécrite. Snapshot : `.impeccable/critique/2026-07-19T09-14-04Z__app-html.md`
(nouveau slug `app-html` — les anciens `index-html` critiquaient l'app quand elle vivait
à la racine ; la tendance repart de 30, ce n'est pas une régression).

Avant cela, les **cinq demandes du 19/07 sont livrées et poussées**
(voir « Fait ») : portail refondu en accueil deux temps (« Bienvenue » personnalisé,
א, ménorahs, portes égales, hébreu idiomatique), `start_url` revenu au portail
(sw v8 — Ruben doit re-sauvegarder l'icône), clavier virtuel réservé au bureau,
audit de péremption des six documents (ancres de lignes recalées), et **premier
lancement vierge** : plus aucune catégorie ni niveau présélectionné (`defaultCats`
supprimé, l'utilisateur choisit lui-même ; rétro-compat des anciens profils gardée). Acquis des sessions
précédentes : plan UX terminé (34/40, snapshots dans `.impeccable/critique/`), remise à
zéro du profil, diagnostic voix (premier pas), workflow « lots d'exemples sans
relecture » outillé (`verifie_exemples.js`), contrôle visuel WebKit/iPhone 16 Pro.
**La prochaine session commence par « Reprendre ici » ci-dessous.**

## Reprendre ici (prochaine session)

1. **Exemples en situation — les trois tables sont couvertes à 100 %** (19/07 au
   soir, demande de Ruben) : chaque **nom (301), adjectif (102) et verbe (97)** porte
   un exemple du quotidien (verbes : phrase au présent) — plus 8 Mots de quantité et
   2 Verbes modaux hors règle, soit **510 exemples** pour 713 cartes.
   La règle est **verrouillée dans `verifie_exemples.js`** : un mot ajouté à l'une de
   ces trois tables sans son `<ul class="exemples">` fait échouer le contrôle (erreur
   bloquante, pas un avertissement). Méthode d'un futur lot : écrire les phrases en
   JSON, script d'insertion qui génère la `.tr` avec le `he2tr` de l'appli
   (concordance par construction) + retouches d'affichage (kol, akhshav, chva sonore,
   noms propres en capitale), puis `node verifie_exemples.js` (**0 erreur exigé**),
   `node build.js`, commit. **Resterait, si on veut aller plus loin** (hors règle,
   décision produit à prendre) : **181** mots des catégories-outils sans exemple
   (recompté le 19/07 au soir — le « 203 » noté ici auparavant *incluait* les 22
   « Phrases » que la même phrase disait d'exclure ; 181 + 22 = 203) — Nombres 41 ·
   Expressions 35 · Prépositions 23 · Adverbes 19 · Saisons & mois 16 · Mots
   interrogatifs 12 · Pronoms 10 · Jours 7 · le reste ≤ 6. Les 22 « Phrases » sont
   hors sujet : ce sont déjà des phrases complètes.
2. **[FAIT le 19/07 au soir] Les avertissements du validateur soldés : 31 → 2.**
   Détail en « Fait ». Quatre causes, dont **aucune n'était un mauvais exemple** :
   dérive orthographique ktiv malé/chaser sur 4 mots (10 avert.), 3 vrais trous du
   lexique désormais comblés (אוּלְפָּן, מִדַּי, כָּל כָּךְ), un lexique de validateur qui
   ne lisait que les cartes et ignorait les sections de grammaire (4 avert.), et un
   seuil de niveau qui alertait à +1 alors que +1 est inévitable (13 avert.).
   La **fourmi est corrigée** : נָמָל (= port) → נְמָלָה, seule identité SRS déplacée.
   **Les 2 restants sont légitimes**, à ne pas « corriger » à l'aveugle :
   הַבַּיְתָה (hé directionnel, réellement absent du carnet — décision de contenu :
   l'enseigner, ou récrire l'exemple de לַחֲזֹר sans lui) et le `.tr` « bamekarer »
   à distance 2 de `he2tr`, où le `.tr` écrit à la main fait foi.
3. **Voix robotique — en attente d'une donnée de Ruben** : le nom de voix affiché dans la
   note Prononciation de son iPhone. Selon la réponse : si « Carmit » simple →
   recommander Carmit Enhanced (Réglages > Accessibilité > Contenu énoncé > Voix >
   Hébreu) ; ajuster `rate`/`pitch` si besoin ; API TTS externe **rejetée** (casse le
   tout-statique hors-ligne) ; audio préenregistré = décision produit, seulement si
   Enhanced déçoit.
4. **Correctifs du carnet — les 4 P1, le bloc tactile ET tous les P2/P3 de charte sont
   FAITS. Il ne reste que la consolidation typographique.**
   Appliqué le 19/07 (détail en « Fait ») : `lang="he"` à **100 %**, garde
   `prefers-reduced-motion` + `scroll-behavior:auto`, or ambiant de `.part` retiré,
   `--bg` tokenisé, cibles tactiles à 44 px, nom accessible du champ de recherche.
   Puis, le même jour, **les dix P2/P3 de charte soldés d'un lot** (détail en « Fait ») :
   `.tip` éteint, deux voix de micro-titre à la place de quatre specs ad hoc,
   `rgba(0,0,0,.14)` remplacé par une couche tonale, piles de fallback complétées,
   `.attention` extraite, anneau `:focus-visible` global, `theme-color`, tap-highlight,
   les 2 `transition:all`, `<main>`.
   **Reste, et seulement cela : la consolidation typographique** (24 → 6–8 pas),
   volontairement reportée — elle retouche l'apparence de tout le document et mérite
   d'être vue avant/après. Le lot de charte en a déjà résorbé une partie en unifiant
   les micro-titres : le détecteur est passé de **24 à 10 findings**, tous de la famille
   rampe. Ces 10 sont donc **attendus, pas un oubli** — ils *sont* le chantier restant.
   ⚠️ Ne pas poser d'`ignore` dessus : le capteur a raison, cf. l'analyse ci-dessous.

   *Contexte d'origine de l'audit :*
   `/impeccable audit vocabulaire_hebreu.html` a tourné le 19/07 : **13/20**, 4 P1, 9 P2, 7 P3,
   aucun P0. Rapport complet :
   `.impeccable/critique/2026-07-19T09-57-31Z__vocabulaire-hebreu-html__audit.md`.
   Méthode : détecteur + lecture CSS intégrale + **mesures en WebKit réel** (desktop + iPhone 16 Pro).
   **Le constat systémique** : le carnet n'a jamais reçu les trois passes que l'app a reçues.
   Il a **zéro `@media`, zéro `lang`, zéro `:focus-visible`, zéro `prefers-reduced-motion`**
   pendant que `app.html` et `index.html` ont les quatre. Ce n'est pas 20 tickets, c'est un
   décalage de passes — à traiter en lot.
   **Les quatre P1** : (a) `lang="he"` absent des **4903** nœuds hébreux (l'app est à 100 % ;
   un lecteur d'écran prononce donc tout l'hébreu en phonétique française — le défaut le plus
   lourd, sur un document dont l'hébreu *est* le produit) ; (b) `.part` (L294–298) est une
   surface **dorée au repos** sur un séparateur structurel, contre la règle de la lampe —
   vérifié à l'écran, le bandeau pèse plus lourd que le vrai bouton d'action ; (c) aucun
   `prefers-reduced-motion` alors que `scroll-behavior:smooth` (L290) pilote les 27 liens du
   sommaire — et la garde de l'app ne suffirait pas, `scroll-behavior` exige son propre `auto` ;
   (d) `rgba(18,24,31,.86)` (L201) est un doublon non tokenisé de `--bg`.
   **La question « fermer la rampe ou poser un `ignore` » est tranchée : ni l'un ni l'autre.**
   Les deux options partaient d'une prémisse fausse (des tailles « hors liste mais légitimes »).
   Mesure : **24 tailles distinctes pour 52 déclarations** — `1.12rem`, `0.92rem`, `0.82rem`,
   `0.66rem`, `1.35rem`… Ce n'est pas un système de rôles, c'est de la dérive accumulée. Un
   `ignore` ferait taire un capteur qui a raison ; fermer la rampe sur les 24 valeurs actuelles
   documenterait la dérive comme un dessein. Il faut **consolider en 6–8 pas, puis** fermer la
   rampe dans DESIGN.md. Les deux autres familles du détecteur : les `radius` sont un symptôme
   des 4 encadrés inline dupliqués (le défaut est l'absence de classe, pas le rayon) ; et
   `em-dash-overuse` (164) est un **faux positif** — la règle vise l'anglais, le tiret d'incise
   est une ponctuation française standard.
   **Ordre recommandé** : `harden` (lot des passes manquantes) → `quieter` (or de `.part`) →
   `colorize` (11 littéraux dérivés de jetons) → `adapt` (44 px) → `typeset` → `extract` → `polish`.
   **Rectification d'une note antérieure** : j'avais écrit ici que l'`outline:none` de la L209
   violait les invariants d'accessibilité. **C'est faux, mesuré** : il est remplacé par un
   indicateur bordure+halo à **9,07:1** (minimum requis 3:1). C'est une divergence d'idiome avec
   l'app, pas une faute. En revanche l'absence de `:focus-visible` global est réelle (29 arrêts
   sur l'anneau UA) — rupture de charte, pas d'accessibilité.
   ⚠️ Le carnet est la source des cartes : tout passe par `node build.js` puis
   `node verifie_exemples.js`. Les correctifs sont presque tous en CSS/`<head>` (faible risque
   d'extraction) **sauf** l'ajout de `lang="he"`, qui touche les `<span class="he">`.
5. **[FAIT le 19/07 au soir] `.door` prend le jeton `carte` (20px)**, et le
   `border-radius:6px` parasite de la règle `:focus-visible` du portail est supprimé
   (détail en « Fait »). Il ne reste dans les fichiers en périmètre que des findings
   de la famille **rampe typographique** — c'est-à-dire le point 4 **ci-dessus**, pas
   des tickets séparés.
6. **Piles de polices tronquées dans `app.html` — dette ouverte, trouvée le 19/07 au soir.**
   En recalant la documentation je me suis aperçu que la règle que je venais d'écrire dans
   DESIGN.md §6 était **fausse sur deux piles** : je l'avais rédigée d'après la prose du §3 au
   lieu de la relever dans le code (`Arial` manquait dans la pile Assistant, la pile Playpen
   était absente). Corrigé, et le carnet aligné sur la forme réelle d'`app.html`. **Mais
   `app.html` garde 11 déclarations tronquées** : 9 `'JetBrains Mono',monospace` et 2
   `'Assistant',sans-serif`. Sans conséquence visuelle en ligne (les polices Google chargent),
   mais contraire au principe « ça marche dans l'avion » — et le fichier autonome, qui *est* la
   version hors-ligne, en hérite. Travail : 11 remplacements, `node build.js` (qui régénère
   `flashcards_hebreu.html`, donc contrôle navigateur ensuite), commit.
   **Leçon à garder** : une règle de charte se relève **dans le code**, jamais dans la charte.
7. **Densité de l'écran de configuration — option restée ouverte.** La critique posait un
   P1 (1633 px pour 681 px de viewport, 10 `<h2>` de poids identique, 43 focusables, un
   point de décision à 17 chips). Ruben a choisi **la typographie seule** : « Révision du
   jour » sort de la voix Title, aucun contrôle déplacé. **La restructuration reste
   disponible si l'écran pèse encore à l'usage** : replier « Catégories » + « Niveau »
   dans un `<details>` résumant la sélection (`Noms, Verbes · Facile · 20 cartes`), comme
   le fait déjà le pli « Réglages avancés » — l'écran passerait de ~2,4 à ~1,2 écran.
   Ne pas l'engager sans nouvelle demande.

**Checklist côté Ruben (vrai iPhone)** :

- [ ] Réinstaller la PWA / re-sauvegarder l'icône (une icône installée garde le
      `start_url` de son installation → la refaire pour qu'elle ouvre le **portail**,
      comme demandé le 2026-07-19).
- [ ] Relever le **nom de la voix** affiché dans Réglages avancés → Prononciation.
- [ ] Sentir la frontière défilement/tap de la carte (`#flip`) quand la face déborde.

## Fait (historique compact — détail dans les messages de commit)

Plan UX en 7 étapes, terminé (`fd84d94` verdict annulable + no-op champ vide,
`71d6a12` a11y des trois modes + clavier QCM, `2fd2efa` accueil allégé (pli « Réglages
avancés », Commencer collant, 1er lancement tout sauf Phrases), `f5ff87b` mineures,
`65d341c` niveaux CECRL (709 mots classés `data-niveau`, chips Niveau, garde-fou
`EXPECTED_LEVELS`), `ac784a4` exemples en situation (extraction ×2, plis « Voir un
exemple », lot pilote 77), `5e53e8e` re-critique 34/40 + correctifs, `abce563` backlog
mineur). Puis, le 2026-07-18 au soir :

- **[x] Remise à zéro du profil** (`6f074d0`) : zone « Repartir de zéro » en bas du pli
  « Réglages avancés », confirmation en deux temps qui nomme la perte (N cartes suivies),
  « Annuler » = défaut sûr focalisé. Efface `srs_v1`/`prefs_v1`/`sess_v1` et remet l'état
  premier lancement **en place** (y compris les six clés de réglage de `state`, que
  `applyPrefs` seul ne toucherait pas) ; ligne `role="status"`. jsdom 36/36.
- **[x] Diagnostic voix — premier pas** (`f8a00fb`) : la note Prononciation affiche le
  nom réel de la voix retenue (« Voix hébraïque détectée ✓ — … »).
- **[x] Portail à la racine** (`ba93e32`) : `index.html` = porte d'entrée (deux portes,
  la lampe sur les flashcards), l'appli déménage dans **`app.html`**, `build.js` la suit,
  `sw.js` v7 (app.html dans les assets, la coquille racine sert le portail), `start_url`
  → `./app.html`, lien du carnet retargeté.
- **[x] Salut aléatoire du portail** (`2e21068`, sans nikoud `f1004d2`) : « Bienvenue ! »
  ou « ברוכים הבאים! » (exclamation collée), tiré au sort à chaque ouverture.
- **[x] Place de la recherche tranchée** (`b0c225a`) : la « Révision du jour » ouvre
  l'écran, la recherche passe sous la barre de maîtrise — la lampe d'abord.
- **[x] verifie_exemples.js** (`73d0208`) : filet de sécurité des exemples — champs,
  3–8 mots, nikoud par mot, translittération concordante avec `he2tr`/`trKey` **extraits
  d'app.html**, vocabulaire de la phrase ≤ niveau du mot (avertissement, `--strict` pour
  bloquer). Calibré sur le pilote : 0 erreur, 36 avertissements.
- **[x] Contrôle visuel mobile** : parcours complet vérifié en émulation **WebKit réel
  (moteur Safari), profil iPhone 16 Pro** (l'appareil de Ruben) — zéro erreur JS, rendu
  conforme (portail, pli, reset, cartes, recherche déplacée).

Puis, le 2026-07-19 (trois problèmes remontés par Ruben) :

- **[x] Portail en deux temps** : accueil plein écran (« Bienvenue » très grand en or
  tendre, ou « ברוכים הבאים! » — même tirage que le petit salut), « Toucher/Cliquer pour
  entrer », puis les deux portes. L'accueil est un `<button>` plein écran (Tab + Entrée
  au clavier, focus rendu à la première porte) ; sans JS il n'existe pas (portes
  directes) ; `prefers-reduced-motion` respecté.
- **[x] Portes égales** : suppression de `.door.main` (bordure or + bouton or plein sur
  les flashcards, lu comme un faux état « sélectionné ») — les deux portes partagent
  exactement les mêmes styles, l'or n'arrive qu'au survol et sur les liens d'action.
- **[x] L'icône installée ouvre le portail** : `start_url` → `./` dans le manifest,
  `sw.js` v8. Vérifié en WebKit desktop (souris + clavier + sans JS + reduced-motion)
  et iPhone 16 Pro émulé (tactile, zéro débordement horizontal) — 28 contrôles, tout
  passe ; navigation réelle des deux portes testée.
- **[x] Clavier virtuel réservé au bureau** (3e demande du 19/07) : sur tactile
  (`pointer:coarse`), le bouton « Clavier hébreu » et le clavier disparaissent — Ruben
  ajoute le clavier hébreu iOS lui-même, et la translittération tapée reste acceptée ;
  le virtuel ne sert que l'AZERTY du bureau (comportement bureau inchangé : replié,
  ouvert à la demande). CSS pur (`display:none !important` — prime sur les bascules
  `.hide` du JS). Vérifié WebKit : bureau (bouton, ouverture, frappe ש), iPhone 16 Pro
  (absent, « Je ne sais pas » et champ intacts), standalone régénéré idem.
- **[x] Accueil habillé** (2e demande du 19/07) : marque « עברית · Hébreu » retirée de
  l'écran d'accueil (elle reste l'en-tête du second temps), salut personnalisé
  « Ruben vous souhaite la bienvenue ! » / « ראובן מקבל אתכם בברכה! », le א de
  l'icône en glyphe vectoriel doré centré dessous, et deux **ménorahs à sept branches**
  (SVG inline `<symbol>` + `<use>`, flammes or tendre, halo en pseudo-élément qui
  respire — figé sous reduced-motion) qui éclairent les côtés. 33 contrôles WebKit
  (desktop + iPhone 16 Pro), dont non-chevauchement texte/ménorahs — tout passe.

Puis, le 2026-07-19 en fin de journée — **critique impeccable du portail et de l'app
(30/40)**, méthode double agent (revue design isolée + détecteur/preuves navigateur),
WebKit réel iPhone 16 Pro, 17 états capturés :

- **[x] P0 — « Commencer » désactivé ne recouvre plus rien.** `opacity:.4` sur le dégradé
  d'or rendait le bouton *translucide* (l'or restait) : collant au premier écran, il
  recouvrait **4 chips** de catégories en interceptant leurs taps (`elementFromPoint`
  renvoyait `start`) et son libellé s'imprimait par-dessus le texte d'aide du nikoud, les
  deux illisibles. Désormais peau pleine et opaque (`background:none`, filet, `--ink-dim`)
  et sticky scopé à `.start:enabled`. Mesuré après : `position:static`, fond `none`,
  **0 chip recouverte** ; à la sélection d'une catégorie, sticky et or reviennent.
  `#start-hint` reçoit `role="status"` (ses trois messages n'étaient jamais annoncés).
- **[x] P2 — dix cibles tactiles sous 44 px soldées**, chacune mesurée dans l'état où elle
  est réellement visible : `.ex-toggle` 34→44, `#fix-verdict`/`#quiz-fix` 36→44,
  `#btn-skip` 39→44, `#reset-btn` 39→44, `#selall` 19→44, lien carnet 20→44,
  `#speak-btn` et `.ex-speak` 40→44×44.
- **[x] P2 — copie du verdict raté** : « ✗ Réponse : » → « ✗ Pas tout à fait — la
  réponse : », dans le registre de sa branche voisine (« ✓ Presque ! La forme exacte : »).
- **[x] Hiérarchie, typographie seule** (choix de Ruben face au P1 de densité) :
  `.panel h2.lead` sort « Révision du jour » de la voix Title pour la voix display
  (Frank Ruhl 1.5rem, parchemin, sans capitales) — les dix titres du panneau pesaient
  exactement pareil. Aucun contrôle déplacé, aucun or ajouté.
- **[x] Bandeau latéral doré supprimé** (`.example`, carnet) : `border-left:3px solid var(--gold)`
  — interdit par le ban absolu *et* par DESIGN.md §6. Touchait **7** encadrés de grammaire
  (et non 507 : `.example` et `ul.exemples` sont deux classes distinctes).
- **Vérifié au passage, rien à faire** : 0 échec de contraste sur **113** paires mesurées
  (pire valeur réelle 4,93:1) ; `lang="he"` sur **100 %** des nœuds hébreux générés ;
  0 débordement horizontal à 320/402/430 px ; les trois gardes `tagName==='BUTTON'`
  fonctionnent sous vraie frappe clavier ; `prefers-reduced-motion` ne masque aucun contenu
  derrière une transition qui ne se déclenche pas ; 39 arrêts de tabulation, 0 piège,
  ordre = ordre visuel ; les deux portes du portail sont **bien identiques au repos**
  (l'or observé au premier passage n'était qu'un `:hover` retenu par le curseur de test).

Puis, le 2026-07-19 — **l'anneau de focus doré rendu à tout l'interactif** (ex-point 5,
qui n'attendait qu'un mécanisme prouvé) :

- **[x] Cause racine trouvée, et ce n'était pas la piste notée.** La corrélation supposée
  (`-webkit-appearance:auto` + absence de `background-image`) est **réfutée par la mesure** :
  `#selall` est un `<button>` qui a exactement ces deux propriétés et rend l'or. Le vrai
  coupable est **`transition:all`** : le raccourci capture les sous-propriétés `outline-*`,
  et WebKit les fige à leurs valeurs initiales — `medium` (=3 px), `currentColor`, offset 0,
  soit *précisément* l'« anneau UA » observé. Ce n'était donc jamais une affaire de cascade :
  les règles gagnaient bien, c'est l'animation qui n'arrivait pas à destination. Preuve par
  variable unique : `transition:none` sur la seule `.chip` → l'or apparaît immédiatement ;
  et une mesure iPhone a attrapé un état en vol (`2.666667px … off=0.006729px`).
- **[x] Correctif** : les **six** `transition:all` d'`app.html` remplacés par la liste
  explicite `background, color, border-color, opacity` — les seules propriétés que ces
  règles animent réellement. Aucun `transition:all` ne subsiste dans l'app ni dans le
  fichier autonome.
- **[x] Vérifié en WebKit réel** (desktop + iPhone 16 Pro) : **58 arrêts de tabulation,
  0 sans anneau d'or** (18 avant), test rejoué sur les cinq écrans ; les trois boutons du
  mode Cartes nommés dans la critique (`#btn-flip`/`#btn-good`/`#btn-again`) mesurés un par
  un dans l'état où ils sont visibles. **Non-régression du survol** contrôlée : la chip
  passe toujours par une valeur intermédiaire (`rgb(168,134,73)`) entre repos et or.
  `node build.js --check` en phase, 710 cartes, 507 exemples.

Puis, le 2026-07-19 — **le carnet reçoit les passes qui lui manquaient** (les 4 P1 de
l'audit + le bloc tactile) :

- **[x] `lang="he"` : 0 % → 100 %** sur 5003 nœuds hébreux. Deux temps : les éléments
  purement hébreux reçoivent l'attribut directement (2419 `span.he`, 20 `toc-he`, 3
  `part-he`, 7 `ex-he`, 26 `h2`, le `h1`, et les 2350 `span.cursive` **générés par le JS**,
  d'où `cursive.lang='he'` à la création) ; les **177 suites hébraïques insérées dans de la
  prose française** (notes, en-têtes `Présent (הֹוֶה)`, gloses) sont enveloppées dans
  `<span lang="he">` par un scanner sur le HTML brut — sans parseur, pour ne rien altérer
  d'autre. **Couplage d'extraction vérifié** : `build.js --check` reste en phase et le
  fichier autonome est **inchangé au octet** ; la recherche fonctionne toujours en hébreu
  comme en français (3 et 16 résultats mesurés), ce qui était le vrai risque puisque son
  filtre travaille sur `textContent`.
- **[x] Garde `prefers-reduced-motion`** — le carnet n'avait **aucune** règle `@media`. La
  garde inclut `scroll-behavior:auto`, sans quoi elle serait décorative : c'est le
  défilement doux qui anime les 27 liens du sommaire, et le `transition:none` de l'app ne
  l'aurait pas couvert. Vérifié sous `reducedMotion:'reduce'` : `scroll-behavior` = `auto`.
- **[x] Or ambiant de `.part` retiré** (règle de la lampe) : un séparateur structurel n'est
  ni une action, ni une sélection, ni l'identité. Passé à `--bg2` + `--card-edge` ; l'or ne
  subsiste que sur le numéro de partie. Vérifié à l'écran — le bouton d'action redevient
  l'élément le plus lumineux de la page.
- **[x] `--bg` tokenisé** : `rgba(18,24,31,.86)` → `color-mix(in srgb, var(--bg) 86%, transparent)`,
  avec repli plein pour les moteurs sans `color-mix`.
- **[x] Cibles tactiles : 21 sous 44 px → 0** (iPhone 16 Pro mesuré) — bloc
  `@media (pointer:coarse)` sur les 27 pastilles du sommaire, `.app-link` et `.search-clear`
  (28→44, son jumeau dans l'app était déjà à 44).
- **[x] Champ de recherche nommé** (`aria-label`) : il n'avait qu'un `placeholder`.
- **Contrôlé après coup** : 0 erreur JS, 0 échec de contraste, 0 débordement horizontal,
  710 cartes et 507 exemples intacts.

Puis, le 2026-07-19 au soir — **les avertissements du validateur soldés (31 → 2)**
et le portail remis au barème (points 2 et 5 de « Reprendre ici ») :

- **[x] Orthographe : quatre mots écrits de deux façons** (`41cf08c`). מְאוֹד→מְאֹד,
  עַכְשָׁו→עַכְשָׁיו, שָׁחֹר→שָׁחוֹר, בַּחֹרֶף→בַּחוֹרֶף — à chaque fois une poignée d'exemples
  dérivaient contre leur propre entrée et la grande majorité des autres. L'exemple de
  la carte שחור écrivait même son mot vedette autrement que son entrée. **Direction du
  correctif, à garder** : aligner les exemples sur l'entrée, **jamais l'inverse** —
  l'identité SRS est `cat|he_plain`, toucher une entrée réinitialise sa progression.
  Vérifié : 0 identité déplacée. 10 avertissements de moins.
- **[x] La fourmi n'était pas une fourmi** (`302d4ec`) : l'entrée portait נָמָל, qui
  veut dire *port*. Tout le reste de la ligne décrivait pourtant la fourmi (genre f,
  pluriel נְמָלִים, exemple « les fourmis travaillent… ») — seul le mot vedette était
  faux. `Noms|נמל` → `Noms|נמלה`, seule identité SRS déplacée des 713.
- **[x] Portail au barème** (`ea3eab5`) : `.door` 18px → **20px**, tranché par le
  voisinage (c'est une quasi-copie de `.flip`, la carte de l'appli : même dégradé
  `160deg`, même bordure `--card-edge`). Et suppression du `border-radius:6px` de la
  règle globale `:focus-visible` — un rayon posé là ne décore pas l'anneau, il
  **redessine l'élément** focalisé ; en pratique il n'atteignait personne (les portes
  gagnaient la cascade) et app.html, l'idiome de référence, ne le pose pas.
- **[x] Les 21 avertissements restants soldés** (`436e3a4`), trois groupes :
  **(a)** trois vrais trous du lexique comblés — אוּלְפָּן (Noms A2, avec son exemple,
  règle de couverture oblige), מִדַּי et כָּל כָּךְ (Mots de quantité A2) ; 710 → **713
  cartes**, 507 → **510 exemples**, aucune identité perdue. **(b)** le lexique du
  validateur ne lisait que les cartes : שֶׁלְּךָ, שֶׁלָּנוּ, אוֹתְךָ étaient dits « hors
  carnet » alors qu'ils figurent en toutes lettres dans « Prépositions fléchies », une
  section de grammaire sans cartes. Il verse maintenant aussi l'hébreu de grammaire,
  avec **deux garde-fous à ne pas retirer** : exclusion des `<ul class="exemples">`
  (sinon chaque phrase validerait son propre vocabulaire) et ajout *uniquement* de
  mots inconnus au niveau 0 — un mot de grammaire ne doit jamais abaisser le niveau
  d'une carte, ce qui neutraliserait le contrôle 5 en silence. **(c)** le seuil de
  niveau passe de +1 à **+2** : les 13 avertissements étaient tous à +1 exactement, et
  une phrase du quotidien pour un verbe A1 réclame des noms concrets (תִּינוֹק, מַתָּנָה,
  מִכְתָּב) qui sont A2 par nature — le signal se noyait dans l'inévitable.
- **Vérifié** : WebKit réel iPhone 16 Pro, app.html **et** fichier autonome à
  l'identique — « אולפן »/« oulpan » trouvent la nouvelle carte, « fourmi » renvoie
  נְמָלָה, 0 erreur JS ; portes à 20px, anneau d'or `rgb(212,162,76)` sur chaque arrêt
  de tabulation, 0 débordement horizontal.

Puis, le 2026-07-19 — **les dix P2/P3 de charte du carnet soldés d'un lot** (le reste du
point 4). Aucun n'a touché au vocabulaire : `node build.js` répond **« flashcards_hebreu.html
déjà à jour »**, c'est-à-dire que le fichier autonome est **inchangé au octet** — la preuve
la plus courte que l'extraction n'a pas bougé. 713 cartes, 510 exemples, 2 avertissements
(les deux légitimes déjà documentés) :

- **[x] `.tip` éteint** (choix de Ruben) — la seconde surface dorée au repos rejoint `.part` :
  `--bg2` + `--card-edge`, l'or ne subsistant que sur le texte de `.tip-title`. Hors de la
  carte « Révision du jour », plus **aucune** surface n'est teintée d'or au repos dans les
  trois fichiers. Mesuré après : `background-image:none`, bordure `rgb(44,56,68)`.
- **[x] Quatre micro-titres ad hoc → deux voix nommées** (choix de Ruben). Il n'y avait pas
  quatre idées mais deux rôles : la **voix Title** (Assistant 700 / 0,84rem / 0,12em / or)
  pour `thead th` et `.subtheme` (×21), et une **voix Repère-mono** (JetBrains Mono /
  0,7rem / 0,14em) pour `.toc-group-label` et `.part-num`. Vérifié en WebKit : les deux
  paires ont des specs calculées **identiques**. `.subtheme` est du même coup **inscrit dans
  DESIGN.md §3** comme emploi déclaré de la voix Title, et non « toléré » : la contradiction
  code/charte venait d'un angle mort de la charte (ses quatre emplois d'origine vivaient
  tous dans `app.html`, le carnet n'avait jamais été inventorié), pas d'une dérive du carnet.
  Effet de bord mesuré : le détecteur passe de **24 à 10 findings** de rampe typographique.
- **[x] `rgba(0,0,0,.14)` → couche `carte`** : un cinquième gris inventé (règle des couches),
  qui rendait en plus les blocs d'exemples presque indiscernables de leur rangée. Ils passent
  à `var(--card)` — la même couche que l'encadré `.example` de la grammaire, si bien que les
  **deux familles d'exemples du carnet se lisent enfin pareil**. C'est le seul changement
  visible du lot sur les 510 exemples : ils cessent d'être un creux pour devenir une surface
  posée. Captures avant/après à l'appui.
- **[x] Piles de fallback complétées** — `'Frank Ruhl Libre',serif` partout devenait, hors
  ligne, un `serif` générique qui rend mal le nikoud, alors que la charte spécifiait David
  Libre. Les trois piles sont désormais écrites en entier. Règle inscrite dans DESIGN.md §6
  (corollaire de « ça marche dans l'avion »).
- **[x] Deux composants qui s'ignoraient extraits** : `.attention` (les 4 `style=` inline
  identiques de l'audit) **et `.gram-title`** — 5 duplications d'un même titre de
  sous-section de grammaire (« שֶׁל — possessif », « לְ — datif »…) que **l'audit n'avait
  pas relevées**, trouvées en relisant le diff. À retenir : relire son propre diff attrape
  ce qu'un détecteur qui ne lit que le CSS ne peut pas voir — ces cinq-là vivaient dans
  des attributs `style=` du corps du document. Il ne reste **0 `<div style="color:var(--gold)…`**.
  Et le **pointillé ne dit plus qu'une chose** — « rien ici » (`.empty`) : il portait deux
  sens opposés, les encadrés d'avertissement et le soulignement des sous-thèmes passent au
  filet plein. Supprime aussi 4 des 5 findings `radius` du détecteur.
- **[x] Anneau `:focus-visible` doré global** — le carnet était le seul des trois fichiers
  sans. Mesuré sous vraie tabulation : **23 focusables déclarés, 1 masqué, 22 arrêts
  parcourus, 0 sans anneau d'or**. Le champ de recherche perd son `outline:none` et son glow
  (DESIGN.md §5 : « bordure or au focus, pas de glow ») et reçoit les deux idiomes de l'app.
  ⚠️ Les deux `transition:all` ont été corrigés **d'abord** : dans l'autre ordre, le nouvel
  anneau serait né déjà cassé (le raccourci fige les `outline-*`).
- **[x] P3 restants** : `<meta name="theme-color">`, `-webkit-tap-highlight-color` dans le
  `*{}`, et `<main>` autour des trois parties (le sommaire et la recherche restent dehors —
  l'un est une navigation, l'autre un outil global).
- **Vérifié en WebKit réel** (22 contrôles, desktop 1280 + iPhone 16 Pro) : 0 erreur JS,
  **0 échec de contraste**, 0 débordement horizontal, **0 cible tactile sous 44 px**,
  `scroll-behavior:auto` sous reduced-motion, et la **recherche intacte** — « fourmi » → 1,
  « אולפן » → 2, « maison » → 16.
  ⚠️ *Piège de mesure rencontré, à retenir* : lire `borderTopColor` juste après un `.focus()`
  par API renvoie encore `--line` et se lit à tort comme un défaut — la transition de 150 ms
  est **en vol**. Il faut attendre sa fin (ou cliquer pour de vrai) avant de conclure.

Décisions actées (ne pas re-débattre sans nouvelle demande) :

- Le **portail est la racine** ; l'appli vit dans `app.html` ; l'icône installée ouvre
  le **portail** (`start_url: "./"` — demande de Ruben du 2026-07-19, qui annule le
  `./app.html` du 18/07 : atterrir directement dans les flashcards le surprenait).
- Le portail est un **accueil en deux temps** : « Bienvenue » très grand plein écran,
  un toucher, puis deux portes **strictement égales** (aucune dorée d'avance — l'ancien
  encadré doré des flashcards se lisait comme un faux état « sélectionné »).
- L'écran de réglages reste le premier écran de l'appli ; il s'ouvre sur la « Révision
  du jour », la recherche vit dessous.
- Le salut du portail : **personnalisé** depuis le 2026-07-19 — « Ruben vous souhaite
  la bienvenue ! » / « ראובן מקבל אתכם בברכה! » (prénom adapté ראובן ; tournure
  idiomatique לקבל בברכה, corrigée le même jour sur question de Ruben — מאחל +
  ברוכים הבאים ne se dit pas), tiré au sort fr/he, toujours **sans nikoud** et
  exclamation collée en hébreu ; l'écho du second temps garde la formule courte
  « ברוכים הבאים! ». Le prénom sur la page publique est une
  **exception assumée** (demande explicite du 19/07) à la neutralité du dépôt — les
  docs, l'historique git et la config restent au pseudonyme.
- Les **lots d'exemples s'écrivent sans relecture humaine**, gardés par
  `verifie_exemples.js` (0 erreur exigé avant commit).
- **Une incohérence entre un exemple et son entrée se corrige dans l'exemple**, jamais
  dans l'entrée : l'identité SRS d'une carte est `cat|he_plain`, donc toucher un mot
  vedette remet sa progression Leitner à zéro. On ne déplace une entrée que pour une
  vraie faute de sens (cf. נָמָל → נְמָלָה), et en le disant.
- **Le validateur alerte sur le vocabulaire à +2 niveaux, pas à +1** : +1 est la
  texture normale d'une phrase du quotidien, pas un défaut.
- **Hors « Révision du jour », aucune surface n'est teintée d'or au repos** — `.part`
  puis `.tip` ont été éteints le 19/07, chacun après le même test : « action, sélection
  ou identité ? ». L'emphase d'un contenu se dit par la position et le titre, pas par
  la lumière.
- **Le pointillé signifie « rien ici », et rien d'autre** (`.empty` seul). Un encadré
  important prend un filet plein.
- **`.subtheme` et `thead th` sont des emplois déclarés de la voix Title** (DESIGN.md §3,
  19/07) : la charte avait un angle mort — elle n'avait inventorié que `app.html`.
- La révision du jour ignore le filtre Niveau ; un mot sans `data-niveau` reste visible
  quel que soit le filtre — et l'interface le dit.
- API TTS externe rejetée pour la voix (le tout-statique hors-ligne prime).

## Pistes de design ouvertes (mineures, non tranchées)

- **Deux « lampes » sur l'accueil de l'appli** : « Révision du jour » vs « Commencer ».
  Piste recommandée si on y touche : emphase **selon l'état** (des cartes dues → la
  révision est la lampe ; sinon Commencer). Raffinement, pas urgent. *Partiellement
  adressé le 19/07* : « Révision du jour » a gagné la voix display, donc la hiérarchie
  n'est plus une égalité — mais l'emphase reste **statique**, pas encore fonction de
  `dueCards()`.
- **« Facile » comme vrai contrat** : masquer les mots non classés quand un niveau est
  coché ? Théorique — tout le carnet est classé (0 mot sans `data-niveau`).

## Outillage (WSL, à recréer en début de session si besoin)

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
  l'utiliser.
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
- **Détecteur impeccable** (sans réseau, lit HTML/CSS local) :
  `node <base-skill>/scripts/detect.mjs --json <fichier>`. Ses findings sont des *signaux*,
  pas des verdicts : les vérifier à la main avant d'agir (l'`em-dash-overuse` du carnet est
  un faux positif — la règle vise l'anglais).
- **Serveur local** : `python3 -m http.server` depuis la racine (l'appli fetch le carnet).
- **Piège jsdom** : `const CARDS` au premier niveau d'un script **n'apparaît pas** sur
  `window` (les `const` ne créent pas de propriété globale) — inutile de chercher
  `w.CARDS` après un boot. Pour vérifier le contenu chargé, passer par le DOM (la
  recherche est le plus court chemin : remplir `#search-input` — et non `#search` —
  puis lire `#search-results`).

## Rituel à chaque modification

1. `node build.js` — régénère `flashcards_hebreu.html` ; échec si une section ou un
   niveau attendu tombe à 0 ; vérifier les comptes affichés (sections, niveaux, exemples).
2. Si des exemples ont changé : `node verifie_exemples.js` — **0 erreur exigé**.
3. Vérifier le comportement : navigateur local, jsdom, ou émulation WebKit (ci-dessus).
4. Si `sw.js`, la liste d'assets ou les icônes changent : incrémenter `VERSION` dans `sw.js`.
5. Commit par changement, messages en français (comme l'historique), puis push sur `main`
   (GitHub Pages redéploie automatiquement).
6. Documentation à jour : README, ARCHITECTURE, CLAUDE.md, DESIGN.md, PRODUCT.md, et ce
   fichier (surtout « Reprendre ici »). ⚠️ Les **comptes** cités dans les docs (cartes,
   exemples, nœuds `lang="he"`) se recalent à chaque ajout de vocabulaire — et le compte
   de nœuds `lang="he"` se **mesure dans le navigateur, il ne se calcule pas** : une
   entrée ajoutée crée aussi ses `span.cursive` générés, donc elle pèse plus d'un nœud
   (5003 → 5015 pour 3 mots, le 19/07, là où le calcul de tête donnait 5010).
7. **Recaler les ancres de lignes** si `app.html` a changé de taille. Elles ont dérivé
   **deux fois** (audit de péremption du 19/07 au matin, puis retrouvées toutes fausses le
   soir : les 16 ancres d'ARCHITECTURE.md étaient décalées de +25, et les 3 « near line » de
   CLAUDE.md avec). Une ancre fausse est pire qu'absente — elle envoie lire le mauvais code
   avec assurance. Contrôle en une commande :
   `for l in $(grep -o 'app.html#L[0-9]*' ARCHITECTURE.md | grep -o '[0-9]*' | sort -u); do printf '%5s: %s\n' "$l" "$(sed -n "${l}p" app.html | cut -c1-60)"; done`
   — chaque ligne affichée doit correspondre à ce que le document annonce.
