# État du projet et travail restant

État au 2026-07-19, fin de journée. **Dernier acquis : critique impeccable du portail et
de l'app (30/40), P0 et P2 corrigés et vérifiés en WebKit** — le bouton « Commencer »
désactivé ne recouvre plus les chips, les dix cibles tactiles sous 44 px sont soldées,
« Révision du jour » sort de la voix Title, la copie du verdict raté est réécrite
(détail en « Fait »). Snapshot : `.impeccable/critique/2026-07-19T09-14-04Z__app-html.md`
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
   soir, demande de Ruben) : chaque **nom (300), adjectif (102) et verbe (97)** porte
   un exemple du quotidien (verbes : phrase au présent), soit **507 exemples**.
   La règle est **verrouillée dans `verifie_exemples.js`** : un mot ajouté à l'une de
   ces trois tables sans son `<ul class="exemples">` fait échouer le contrôle (erreur
   bloquante, pas un avertissement). Méthode d'un futur lot : écrire les phrases en
   JSON, script d'insertion qui génère la `.tr` avec le `he2tr` de l'appli
   (concordance par construction) + retouches d'affichage (kol, akhshav, chva sonore,
   noms propres en capitale), puis `node verifie_exemples.js` (**0 erreur exigé**),
   `node build.js`, commit. **Resterait, si on veut aller plus loin** (hors règle,
   décision produit à prendre) : 203 mots des catégories-outils — Nombres 41 ·
   Expressions 35 · Adverbes 19 · Saisons & mois 16 · Mots interrogatifs 12 ·
   Pronoms 10 · Prépositions 23 · Jours 7 · le reste ≤ 6 (+ 22 « Phrases », à
   exclure : déjà des phrases complètes).
2. **Solder les 31 avertissements du validateur** sur le lot pilote : mots hors carnet
   (souvent des mots utiles à AJOUTER au carnet, comme עַכְשָׁיו en ktiv malé — עברית
   est **fait**, ajoutée aux Noms le 19/07), écarts de translittération distance 2,
   quelques mots d'un niveau au-dessus. **À vérifier aussi** : l'entrée fourmi est
   écrite נָמָל (= port !) — le singulier attendu est נְמָלָה ; changer le mot change
   l'identité SRS de la carte (`cat|he_plain`), à faire en connaissance de cause.
3. **Voix robotique — en attente d'une donnée de Ruben** : le nom de voix affiché dans la
   note Prononciation de son iPhone. Selon la réponse : si « Carmit » simple →
   recommander Carmit Enhanced (Réglages > Accessibilité > Contenu énoncé > Voix >
   Hébreu) ; ajuster `rate`/`pitch` si besoin ; API TTS externe **rejetée** (casse le
   tout-statique hors-ligne) ; audio préenregistré = décision produit, seulement si
   Enhanced déçoit.
4. **Analyse et audit complet du carnet avec impeccable** (demande du 2026-07-19,
   explicitement **reportée** lors de la critique du même jour, qui s'est limitée au
   portail et à l'app) : passer `vocabulaire_hebreu.html` au crible — `/impeccable critique`
   puis `/impeccable audit`, et en tirer un plan de correctifs. **Point de départ déjà
   mesuré** : le détecteur y relève **24 findings**, tous `advisory` (18 `design-system-font-size`,
   5 `design-system-radius`, 1 `em-dash-overuse`). Ils ont été **laissés tels quels et non
   silencés** : DESIGN.md documente des *rôles* typographiques, pas une rampe fermée, donc
   une taille littérale hors liste n'est pas automatiquement un défaut — c'est précisément
   ce qu'il faut trancher lors de l'audit (soit on ferme la rampe dans DESIGN.md, soit on
   pose un `ignore` de règle). Le carnet est la **référence de la charte** (`:root` normatif) :
   toute retouche visuelle qui en sortirait doit se répercuter sur `app.html` et le portail,
   et passer par `node build.js` (le carnet est la source des cartes — attention au couplage
   d'extraction, CLAUDE.md § extraction).
5. **Anneau de focus doré absent des chips** (P2 de la critique du 19/07, **non corrigé
   volontairement**) : `app.html` ne déclare qu'une seule règle d'`outline`
   (`:focus-visible` → 2 px or, offset 2), mais mesuré pendant une vraie tabulation
   WebKit, les 40+ `.chip` et les boutons du mode Cartes (`#btn-flip`/`#btn-good`/`#btn-again`)
   rendent `3px solid currentColor` offset 0 — l'anneau UA de WebKit — alors qu'ils
   *matchent* bien `:focus-visible`. Sur une chip sélectionnée, `currentColor` vaut
   `#1a1206` : sombre sur sombre (1,04:1 contre le fond de page), collé au bord. Le focus
   reste **toujours visible** (ce n'est pas une régression d'accessibilité), mais ce n'est
   pas l'anneau prévu, et sur iPhone c'est le cas majoritaire. **Le symptôme est mesuré,
   le mécanisme de cascade ne l'est pas** (corrélé à `-webkit-appearance:auto` + absence de
   `background-image`, causalité non prouvée) : à investiguer avant de corriger, pas de
   correctif à l'aveugle.
6. **`.door{border-radius:18px}` dans le portail** ([index.html:122](index.html#L122)) :
   ni `panneau:16px` ni `carte:20px` — les deux seuls jetons du barème `rounded` qui
   s'appliquent à une porte. Seul finding du détecteur réellement actionnable sur les
   fichiers en périmètre (`app.html` en compte **0**). Un caractère, laissé hors du
   périmètre validé le 19/07.
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
- **Serveur local** : `python3 -m http.server` depuis la racine (l'appli fetch le carnet).

## Rituel à chaque modification

1. `node build.js` — régénère `flashcards_hebreu.html` ; échec si une section ou un
   niveau attendu tombe à 0 ; vérifier les comptes affichés (sections, niveaux, exemples).
2. Si des exemples ont changé : `node verifie_exemples.js` — **0 erreur exigé**.
3. Vérifier le comportement : navigateur local, jsdom, ou émulation WebKit (ci-dessus).
4. Si `sw.js`, la liste d'assets ou les icônes changent : incrémenter `VERSION` dans `sw.js`.
5. Commit par changement, messages en français (comme l'historique), puis push sur `main`
   (GitHub Pages redéploie automatiquement).
6. Documentation à jour : README, ARCHITECTURE, CLAUDE.md, DESIGN.md, PRODUCT.md, et ce
   fichier (surtout « Reprendre ici »).
