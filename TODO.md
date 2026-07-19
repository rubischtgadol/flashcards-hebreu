# État du projet et travail restant

État au 2026-07-19, fin de journée. **Dernier acquis : le point 4 est ENTIÈREMENT soldé —
la consolidation typographique est faite, et elle a mis au jour la cause de la dérive.**
Le carnet passe de **24 tailles distinctes à une rampe de 8 pas nommés**, mais le vrai
résultat est ailleurs : `font-size:22px` est posé sur **`body`**, jamais sur `html`, dans
les trois fichiers — donc **1rem vaut 16px, pas 22px** (mesuré en WebKit). Le commentaire
du carnet qui affirmait le contraire était faux depuis toujours, et c'est lui qui
expliquait les 24 valeurs : chacune avait été poussée à tâtons contre une base qui ne
réagissait pas comme annoncé. La prose grammaticale sortait ainsi à **15,2 px** et le nom
français des sections à **11,2 px**. Corrigé avec la rampe : interlignage 1.55 sur `body`
(le carnet n'en avait aucun, alors que le nikoud se compose *sous* la ligne), prose à 16 px,
nom de section à 13,4 px en parchemin plein, et **152 hébreux de prose rendus au serif**
(ils héritaient d'Assistant, contre la règle des trois voix *et* celle de la vedette).
17 contrôles WebKit au vert, `flashcards_hebreu.html` **inchangé au octet**, 713 cartes et
510 exemples intacts. **Périmètre arrêté avec Ruben** avant l'écriture : rampe + défauts
mesurés, mais **pas** le bornage de la largeur de lecture (166 caractères par ligne en
desktop) — reste ouvert, voir le point 8.
**Acquis précédent** — les dix P2/P3 de charte du carnet traités d'un lot
(`.tip` éteint, quatre micro-titres ad hoc ramenés à deux voix nommées, le voile noir
des exemples remplacé par une vraie couche, piles de polices complétées, `.attention`
extraite, anneau `:focus-visible` global, `theme-color`, tap-highlight, les deux
`transition:all`, `<main>`). **Le fichier autonome est inchangé au octet** : rien du
vocabulaire n'a bougé. 22 contrôles WebKit au vert, et le détecteur passe de 24 à 10
findings — les 10 restants *sont* le chantier typographique, seul reliquat du point 4.
**Périmètre arrêté avec Ruben le même soir**, qui rouvre trois chantiers et en ferme deux :
le prochain lot d'exemples se limite à **Prépositions, Adverbes et Mots interrogatifs**
(54 mots — le reste est abandonné) ; « Catégories » et « Niveau » **seront repliés** ;
les deux pistes de design ont été **explorées** (l'une confirmée et enrichie d'un défaut
de charte trouvé au passage, l'autre périmée mais remplacée par une garde d'outillage
utile) ; et la **piste « Carmit Enhanced » est morte** — WebKit n'expose délibérément que
les voix compactes, ce n'est pas un réglage à trouver.
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
   `node build.js`, commit.

   **➤ PROCHAIN LOT D'EXEMPLES — périmètre arrêté par Ruben le 19/07 au soir :
   Prépositions (23) · Adverbes (19) · Mots interrogatifs (12) = 54 mots.**
   Ce sont les trois catégories où un exemple *apprend* vraiment quelque chose : une
   préposition ou un mot interrogatif ne s'emploie qu'en contexte, et la traduction
   seule (« sur », « pourquoi ») ne dit pas comment la placer. Méthode identique au lot
   précédent (JSON → script d'insertion → `verifie_exemples.js` 0 erreur → `build.js`).
   ⚠️ Attention au piège du contrôle 5 : ces mots sont majoritairement A1, donc leurs
   phrases tireront des noms A2 — c'est normal, le seuil est à +2 depuis le 19/07.

   **Le reste est abandonné, décision de Ruben** — Nombres 41 · Expressions 35 ·
   Saisons & mois 16 · Pronoms 10 · Jours 7 · le reste ≤ 6. Ne pas les reproposer :
   un nombre, un jour ou une saison se comprend sans mise en situation, et les
   « Expressions » sont déjà des formules autonomes. Les 22 « Phrases » restent hors
   sujet (ce sont déjà des phrases complètes). Après ce lot, la question des exemples
   est **close**.
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
3. **Voix robotique — la piste « Carmit Enhanced » est MORTE, et c'est documenté.**
   Donnée relevée par Ruben le 19/07 : la note affiche **« Carmit »**, alors qu'il avait
   bien installé Carmit Enhanced. Recherche faite le même jour — **ce n'est ni un bug ni
   un échec d'installation** : WebKit *filtre délibérément* les voix par qualité et
   n'expose que les `compact`. Le code (bug WebKit 203689, r251960, nov. 2019) ne garde
   dans `getVoices()` que `voice.quality == AVSpeechSynthesisVoiceQualityDefault`, motif
   déclaré « réduire la surface de fingerprinting ». Apple le confirme en toutes lettres
   sur son forum développeurs (thread 723503) : *« with Web Speech APIs only the
   pre-installed voices are available. Optionally downloadable voices are not
   available. »* Et le nom ne dira jamais « Enhanced » : au niveau système,
   `AVSpeechSynthesisVoice` sépare `name` et `quality` en deux champs, et l'API Web
   Speech n'a aucun champ pour la qualité.
   **Conséquence directe : ne plus recommander à Ruben d'installer une voix Enhanced —
   la PWA ne pourra jamais s'en servir.** C'est une contrainte de plateforme, pas un
   réglage à trouver.

   **Le seul test qui reste à faire (court)** : afficher `voice.voiceURI` à côté de
   `voice.name` dans `#audio-note`. L'identifiant AVFoundation, lui, porte la qualité :
   - se termine par `-compact` (`com.apple.ttsbundle.Carmit-compact`) → confirmé, on est
     au plafond de ce que le web permet sur iOS, dossier clos ;
   - contient `.enhanced.` ou `.premium.` → le filtre aurait changé depuis 2019, et c'est
     une information neuve qui rouvre la piste.
   Un champ à ajouter, rien de plus. C'est empirique sur l'appareil réel, là où le reste
   est de la déduction.

   **Si le test confirme `-compact`, les options restantes sont, dans l'ordre :**
   (a) ajuster `rate`/`pitch` — gain réel mais modeste sur une voix compacte ;
   (b) audio préenregistré (décision produit lourde : ~713 fichiers, mais c'est la seule
   voie vers une vraie qualité hors-ligne) ; (c) rien, et l'assumer.
   **API TTS externe reste rejetée** (casse le tout-statique hors-ligne).

   ⚠️ **Risque à surveiller** : plusieurs rapports (dont la doc Readium) signalent
   qu'installer une variante Enhanced peut faire **disparaître** la voix de base de
   Safari, jusqu'à vider une langue entière. Ce n'est pas arrivé chez Ruben (Carmit
   répond toujours). Mais si l'hébreu disparaissait un jour de `getVoices()` après une
   mise à jour iOS, ce serait **cette régression-là** et non une panne de l'app — le
   `body.no-he-voice` s'activerait proprement. À ne pas debugger dans l'app.

   Sources : [WebKit bug 203689](https://bugs.webkit.org/show_bug.cgi?id=203689) ·
   [Apple Developer Forums 723503](https://developer.apple.com/forums/thread/723503) ·
   [Readium — SpeechSynthesis in browsers and OSes](https://readium.org/speech/docs/WebSpeech.html)
4. **[FAIT le 19/07 au soir] Correctifs du carnet — TOUT est soldé, consolidation
   typographique comprise.** Détail en « Fait ». La rampe de 8 pas est en place, la
   cause racine de la dérive est trouvée et documentée (le `22px` sur `body` ne
   déplace pas la racine des rem), et la rampe est **fermée dans DESIGN.md §3**.
   Ce qui suit est conservé comme contexte d'origine de l'audit.

   *Ancien libellé : « les 4 P1, le bloc tactile ET tous les P2/P3 de charte sont
   FAITS, il ne reste que la consolidation typographique. »*
   Appliqué le 19/07 (détail en « Fait ») : `lang="he"` à **100 %**, garde
   `prefers-reduced-motion` + `scroll-behavior:auto`, or ambiant de `.part` retiré,
   `--bg` tokenisé, cibles tactiles à 44 px, nom accessible du champ de recherche.
   Puis, le même jour, **les dix P2/P3 de charte soldés d'un lot** (détail en « Fait ») :
   `.tip` éteint, deux voix de micro-titre à la place de quatre specs ad hoc,
   `rgba(0,0,0,.14)` remplacé par une couche tonale, piles de fallback complétées,
   `.attention` extraite, anneau `:focus-visible` global, `theme-color`, tap-highlight,
   les 2 `transition:all`, `<main>`.
   Puis, le soir même, **la consolidation typographique** (24 → **8 pas**), qui était le
   dernier reliquat : les 10 findings de rampe qui restaient sont tombés à **0**, sans
   aucun `ignore` — le capteur avait raison, comme annoncé. Il ne subsiste dans le carnet
   qu'un finding `radius` (`mark.hl`, 3px, le surlignage de recherche), hors sujet
   typographique et non traité.

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
7. **➤ DEMANDÉ par Ruben le 19/07 au soir : replier « Catégories » et « Niveau ».**
   La nouvelle demande que le point attendait. Contexte : la critique posait un P1 de
   densité (1633 px pour 681 px de viewport, 10 `<h2>` de poids identique, 43 focusables,
   un point de décision à 17 chips) ; Ruben avait alors choisi la typographie seule
   (« Révision du jour » sort de la voix Title). L'écran pèse toujours — on passe à la
   restructuration.

   **Forme retenue** : un `<details>` par groupe, sur le modèle exact du pli « Réglages
   avancés » qui existe déjà (`<details class="adv" id="adv">`, [app.html:581](app.html#L581))
   — même rangée sur nuit claire, même filet, même chevron qui pivote. Le `<summary>`
   **résume la sélection en cours** (`Noms, Verbes · Facile · 20 cartes`), de sorte que
   replier ne cache aucune information : c'est le principe déjà tenu par le sous-titre
   du pli avancé. Gain estimé : ~2,4 → ~1,2 écran.

   **Points d'attention repérés en lisant le code** :
   - ⚠️ **Ne pas replier par défaut au premier lancement.** Depuis le 19/07, un profil
     vierge n'a **aucune catégorie ni niveau sélectionné** et `#start` est désactivé :
     si les deux groupes sont fermés, l'écran n'offre plus rien à faire et l'indice
     `#start-hint` désigne des contrôles invisibles. Régle : **ouvert tant que la
     sélection est vide, replié dès qu'elle ne l'est plus.**
   - Le `<summary>` doit rester une cible ≥ 44 px sous `pointer:coarse` (le bloc existe,
     y ajouter le nouveau sélecteur).
   - `buildChips()` et `applyPrefs()` alimentent `#cats`/`#niv` : vérifier que le résumé
     se recalcule à chaque `segPick`/`savePrefs`, sinon il mentira silencieusement.
   - Les deux groupes sont des `role="group"` + `aria-labelledby` : en passant sous un
     `<summary>`, contrôler que le nom accessible ne se dédouble pas.
   - Contrôle final : nombre d'arrêts de tabulation avant/après (43 aujourd'hui), et
     0 débordement horizontal à 320 px.

8. **Largeur de lecture non bornée — dette ouverte, écartée du périmètre le 19/07.**
   Relevé en mesurant pour le point 4, et **délibérément non traité** : Ruben a choisi
   « rampe + défauts mesurés » sans le bornage. `grep max-width` ne trouve **qu'une**
   occurrence dans tout le carnet (`.search-inner{max-width:560px}`) — ni `body`, ni
   `<main>`, ni `.note` n'ont de largeur maximale. Mesuré en desktop 1280 : la prose
   grammaticale court sur **158 caractères par ligne** (cible confortable 45–75), et les
   rangées de table laissent ~1000 px de vide entre l'hébreu calé à droite et le français
   calé à gauche. **Le mobile est épargné** (le viewport borne naturellement), ce qui
   explique que le défaut n'ait jamais été vu : tous les contrôles visuels du projet se
   font en iPhone 16 Pro émulé.
   Travail : `main{max-width:~34rem; margin-inline:auto}`. ⚠️ Piège repéré en lisant le
   code : les `.table-wrap` portent `min-width:640px` sur leur table et sont déjà dans un
   défileur horizontal — il faut les autoriser à déborder de la colonne de texte, sinon on
   déclenche un scroll horizontal sur des tables qui tenaient auparavant. C'est un
   changement d'allure du document, à voir avant/après.

**Checklist côté Ruben (vrai iPhone)** :

- [ ] Réinstaller la PWA / re-sauvegarder l'icône (une icône installée garde le
      `start_url` de son installation → la refaire pour qu'elle ouvre le **portail**,
      comme demandé le 2026-07-19).
- [x] ~~Relever le **nom de la voix** affiché dans Réglages avancés → Prononciation.~~
      **Fait le 19/07 : « Carmit »**, alors que Carmit Enhanced était installée. Dossier
      instruit au point 3 — c'est une restriction de WebKit, pas un réglage manqué.
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

Puis, le 2026-07-19 au soir — **la consolidation typographique du carnet, et la cause de
la dérive** (dernier reliquat du point 4). `node build.js` répond **« flashcards_hebreu.html
déjà à jour »** : le fichier autonome est **inchangé au octet**, 713 cartes, 510 exemples,
2 avertissements (les deux légitimes). 17 contrôles WebKit au vert, 0 au rouge :

- **[x] La cause racine, trouvée en mesurant avant d'écrire.** `font-size:22px` est posé
  sur **`body`**, jamais sur `html` — dans les trois fichiers. Il ne déplace donc pas la
  racine des `rem` : **1rem vaut 16px**, et le commentaire du carnet (« *base agrandie
  (+12 %) — tout le reste est en rem/em et suit* ») était faux. **C'est lui qui expliquait
  les 24 valeurs** : chacune avait été poussée à tâtons contre une base qui ne réagissait
  pas comme annoncé. Ce n'était donc pas de la négligence, et c'est pourquoi il ne fallait
  surtout pas se contenter de regrouper les valeurs. ⚠️ **Ne pas « corriger » en déplaçant
  le 22px sur `html`** : ×1,375 sur chaque `rem` du carnet *et* d'`app.html`, dont les
  tailles sont réglées sur ce qu'elles rendent vraiment. Le commentaire était faux, pas le CSS.
- **[x] Rampe de 8 pas** dans un **second bloc `:root` local** (le premier reste le jeu de
  jetons partagé, identique au caractère près) : `--pas-titre` 2.3rem … `--pas-micro`
  0.7rem. **44 remplacements**, aucune taille littérale hors rampe. Exception unique et
  nommée : `1.15em` sur l'hébreu de prose (« un cran au-dessus de ce qui m'entoure »),
  qui produit 3 valeurs dérivées tombant d'elles-mêmes près des pas voisins.
  Rampe **fermée dans DESIGN.md §3** (tableau + 4 entrées de frontmatter).
- **[x] Trois défauts que seule la mesure révélait**, et que la rampe seule n'aurait pas
  corrigés : (a) `body` n'avait **aucun `line-height`** et héritait de `normal` (~1,2),
  trop serré pour du nikoud qui se compose **sous** la ligne de base — passé à `1.55`,
  valeur que `.steps li` et `.tip p` avaient déjà choisie chacun de son côté sans qu'elle
  remonte jamais à la racine ; (b) la prose grammaticale sortait à **15,2 px** (0.95rem
  contre une base qu'on croyait à 22px) → 16 px ; (c) le **nom français de chaque section**
  (`h2 .count`) sortait à **11,2 px en gris** — le seul repère de navigation d'un
  francophone dans un document dont tous les titres sont en hébreu → 13,4 px, parchemin plein.
- **[x] 152 hébreux de prose rendus au serif.** Sur les 204 `span[lang="he"]` **sans
  classe** (les suites hébraïques enveloppées au milieu d'un paragraphe français, posées
  par la passe a11y du matin), 152 vivent dans de la prose et héritaient d'**Assistant à
  15,2 px** — soit exactement la taille et la famille du français qui les entoure. Deux
  règles de charte tombaient d'un coup : les **trois voix** (« Frank Ruhl pour *tout*
  l'hébreu ») et la **vedette** (« toujours plus grand que sa traduction »). Pire, à cette
  échelle en sans, le nikoud devient illisible — or ces passages sont précisément ceux qui
  l'enseignent. Réparé en **CSS pur**, sans toucher au HTML, via
  `span[lang="he"]:not([class])` : le sélecteur ne peut pas atteindre `.he`, `.cursive`,
  `.toc-he`, `.part-he` ni `.ex-he`, qui ont chacun leur voix. **`thead th` et `.tr` sont
  explicitement exclus** — leurs voix déclarées (Title, mono) gardent la main sur leur
  hébreu. Captures avant/après : le paragraphe des binyanim passe de blocs illisibles à
  du nikoud net.
- **[x] La règle de la vedette rendue visible** sur `.part` : `.part-name` (1.45rem) et
  `.part-he` (1.5rem) n'étaient séparés que de **1,1 px**. L'intention était écrite mais
  invisible. Les deux ont été **écartés d'un vrai pas** (compagnon / vedette) plutôt que
  fusionnés — une hiérarchie qu'on ne voit pas n'est pas une hiérarchie.
- **[x] Quatre `style=` inline supprimés** : les trois `font-size:1.2rem` des binyanim
  (ils compensaient à la main un `1.15em` jugé trop faible — la rampe absorbe le besoin)
  et le sous-titre du `<h1>`, extrait en `.h1-sub`.
- **Vérifié en WebKit réel** (desktop 1280 + iPhone 16 Pro), 17 contrôles : 12 tailles
  rendues = 9 pas + 3 dérivées `em`, **0 intruse** ; interlignage 1.55 hérité ; **0 échec
  de contraste sur 42 paires notées** (pire 6,28:1) ; recherche intacte (« fourmi » → 1,
  « אולפן » → 2, « maison » → 16) ; **23 focusables déclarés, 22 arrêts, 0 sans anneau
  d'or** ; 0 débordement de 320 à 1280 px ; **0 cible tactile sous 44 px** ; 0 erreur JS.
  ⚠️ *Deux pièges de mesure payés en route, à retenir* : (1) un contrôle de contraste dont
  la regex était `[\d.]` mal échappé **notait zéro paire** et affichait un vert — un
  contrôle qui ne mesure rien passe toujours ; vérifier qu'il annonce le **nombre de paires
  réellement notées**. (2) `#voc-search-clear` n'existe que si le champ est rempli : le
  compter comme un arrêt de tabulation fabrique un faux défaut (il n'est jamais focalisé,
  donc rend l'anneau UA). C'est le « 1 masqué » déjà documenté le matin.

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
- **Les voix « Enhanced » sont hors de portée du web sur iOS** (mesuré et sourcé le
  19/07) : WebKit ne publie que les voix compactes préinstallées. Ne plus proposer à
  Ruben d'en installer une — ce n'est pas un réglage, c'est un plafond de plateforme.
- **`font-size:22px` est sur `body`, pas sur `html` — donc 1rem vaut 16px**, dans les
  trois fichiers. Mesuré le 19/07. Ne pas « réparer » en déplaçant la déclaration sur
  `html` : ×1,375 sur chaque `rem` du carnet *et* d'`app.html`, dont les tailles sont
  réglées sur leur rendu réel. Le commentaire qui prétendait l'inverse était faux ; il
  a été corrigé, et c'est lui qui expliquait la dérive des 24 tailles.
- **Le carnet a sa propre rampe de 8 pas**, dans un **second** bloc `:root` local — le
  premier reste le jeu de jetons partagé, identique au caractère près entre les trois
  fichiers. Aucune taille littérale hors rampe ; seule exception nommée, le `1.15em` de
  l'hébreu en prose, relatif par nature.
- **Tout hébreu se compose en Frank Ruhl**, y compris celui inséré au milieu d'un
  paragraphe français (`span[lang="he"]:not([class])`). Deux voix déclarées gardent la
  main sur le leur et sont explicitement exclues : `thead th` (voix Title) et `.tr` (mono).
- **Le périmètre des exemples est arrêté** : après le lot Prépositions / Adverbes /
  Mots interrogatifs (54 mots), la question est close. Nombres, Expressions, Saisons &
  mois, Pronoms et Jours **n'auront pas d'exemples** — décision de Ruben du 19/07,
  motif : ces mots-là se comprennent sans mise en situation.

## Pistes de design ouvertes — explorées le 19/07 au soir

Les deux étaient notées en une ligne d'intention. Lecture du code faite, mesures prises ;
voici ce qu'elles valent réellement.

### A. Les deux « lampes » de l'accueil — **piste confirmée, et elle cache un défaut de charte**

Le problème est réel et mesurable dans le CSS. Quand des cartes sont dues, **deux surfaces
dorées coexistent** sur le même écran :

- `.review-card` ([app.html:489](app.html#L489)) — bordure `--gold` pleine + dégradé d'or
  135° (16 % → 5 %), icône et flèche en or ;
- `.start` ([app.html:148](app.html#L148)) — dégradé d'or **plein** + lueur portée
  `0 6px 18px -8px var(--gold)`.

C'est exactement ce que la règle de la lampe interdit : deux lumières d'égale intensité,
donc aucune hiérarchie. La voix display gagnée le 19/07 par « Révision du jour » a réglé la
*typographie*, pas la *lumière*.

**Forme proposée — une seule lampe à la fois, choisie par l'état** :
`refreshSrsUi()` connaît déjà `due` ; il suffit qu'il pose un drapeau
(`document.body.classList.toggle('has-due', due>0)`), et que le CSS fasse le reste :

- `due > 0` → la révision garde l'or ; « Commencer » passe en **secondaire actif** ;
- `due === 0` → la révision est déjà éteinte (elle est `:disabled`), « Commencer » reprend
  l'or plein. Aucun changement dans ce cas.

⚠️ **Le vrai risque, à ne pas sous-estimer** : le « Commencer » désactivé porte déjà
`background:none; border-color:var(--line); color:var(--ink-dim)`. Un « Commencer »
*secondaire mais actif* lui ressemblerait à s'y méprendre — seule la couleur du texte
changerait. Il faut donc un troisième registre lisible (piste : filet `--card-edge` +
texte `--ink` plein + bordure qui passe à l'or au survol), et **le vérifier à l'écran côte
à côte avec l'état désactivé**, sinon on troque un défaut de hiérarchie contre un défaut
d'affordance — ce qui serait pire.

🔎 **Trouvé en explorant, à traiter avec** : `.review-card:disabled` porte `opacity:.55`
([app.html:496](app.html#L496)) — or DESIGN.md §5 interdit désormais d'exprimer un état
désactivé par une opacité, règle apprise en juillet sur ce même bouton « Commencer ». Ici
le fond doré *est* bien remplacé par `--bg2`, donc le symptôme grave (l'or translucide)
n'existe pas ; mais l'opacité fait aussi pâlir le texte et l'icône, qui restent en or. À
remplacer par une peau pleine, comme `.start:disabled`.

### B. « Facile » comme vrai contrat — **question périmée, mais elle en a révélé une vraie**

La piste demandait s'il fallait masquer les mots non classés quand un niveau est coché.
**Mesuré : la question ne se pose pas.** 213 `<li>` + 500 `<tr>` portent `data-niveau`,
soit **713 sur 713 cartes** — couverture stricte à 100 %, aucun mot non classé. Changer la
sémantique du filtre n'aurait donc *aucun effet observable* aujourd'hui.

**En revanche l'exploration a mis au jour un vrai trou** : rien ne garantit que cette
couverture tienne. `build.js` compte les niveaux et n'échoue que si un niveau **entier**
disparaît (`EXPECTED_LEVELS`, [build.js:33](build.js#L33)) ; un mot ajouté **sans**
`data-niveau` passe donc en silence — et il sera visible sous tous les filtres, y compris
« Facile ». C'est précisément le scénario qui rendrait la piste A pertinente, sauf qu'on ne
le verrait jamais venir.

**➤ Action recommandée, à la place de la piste d'origine** : ajouter à `build.js` une
**garde de couverture des niveaux**, sur le modèle exact de la règle de couverture des
exemples déjà appliquée par `verifie_exemples.js` — si une carte sort de l'extraction sans
`niveau`, le build échoue en nommant le mot. Court, sans effet visuel, et cela transforme
une propriété qui n'est vraie que par chance en propriété tenue par l'outillage.
La piste de design d'origine, elle, est **close** : le filtre garde sa sémantique actuelle
(un mot non classé reste visible partout), qui est déjà une décision actée plus haut.

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
