# État du projet et travail restant

État au 2026-07-19 au soir. Les **cinq demandes du 19/07 sont livrées et poussées**
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

1. **Lots d'exemples A1** — le chantier principal. **Le lot Noms est fait** (19/07 au
   soir : 130 noms + la nouvelle entrée עִבְרִית = 131 exemples, 0 erreur, 0 nouvel
   avertissement). Reste **101 mots A1 sans exemple** : Expressions 22 · Nombres 14 ·
   Saisons & mois 12 · Pronoms personnels 10 · Mots interrogatifs 9 · Adverbes 9 ·
   Prépositions 8 · Jours de la semaine 7 · Conjonctions 5 · Démonstratifs 3 ·
   Existence 2 (+ 19 « Phrases », à **exclure** : ce sont déjà des phrases complètes).
   Méthode par lot : lister les mots sans exemple (`extractCards` exporté par build.js —
   filtrer `niveau==='A1' && !exemples`), écrire les `<ul class="exemples">` dans le
   carnet (ligne éditoriale ARCHITECTURE.md §5 : 3–8 mots, présent, vocabulaire ≤ A1,
   une situation concrète du quotidien), puis `node verifie_exemples.js` (**0 erreur
   exigé** — c'est le filet qui remplace la relecture), `node build.js`, commit.
   Outillage réutilisable du lot Noms : les phrases en JSON + un script d'insertion
   qui génère la `.tr` avec le `he2tr` de l'appli (concordance par construction) et
   quelques retouches d'affichage (kol, akhshav, chva sonore, noms propres en capitale).
   Ensuite : les 268 mots A2.
2. **Solder les 31 avertissements du validateur** sur le lot pilote : mots hors carnet
   (souvent des mots utiles à AJOUTER au carnet, comme עַכְשָׁיו en ktiv malé — עברית
   est **fait**, ajoutée aux Noms le 19/07), écarts de translittération distance 2,
   quelques mots d'un niveau au-dessus.
3. **Voix robotique — en attente d'une donnée de Ruben** : le nom de voix affiché dans la
   note Prononciation de son iPhone. Selon la réponse : si « Carmit » simple →
   recommander Carmit Enhanced (Réglages > Accessibilité > Contenu énoncé > Voix >
   Hébreu) ; ajuster `rate`/`pitch` si besoin ; API TTS externe **rejetée** (casse le
   tout-statique hors-ligne) ; audio préenregistré = décision produit, seulement si
   Enhanced déçoit.
4. **Analyse et audit complet du carnet avec impeccable** (demande du 2026-07-19) :
   passer `vocabulaire_hebreu.html` au crible — `/impeccable critique` (revue UX avec
   score, comme celle qui a mené l'app de 28 à 34/40) puis `/impeccable audit`
   (technique : a11y, perf, responsive), et en tirer un plan de correctifs. Le carnet
   est la **référence de la charte** (`:root` normatif) : toute retouche visuelle qui
   en sortirait doit se répercuter sur `app.html` et le portail, et passer par
   `node build.js` (le carnet est la source des cartes — attention au couplage
   d'extraction, CLAUDE.md § extraction).

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
  révision est la lampe ; sinon Commencer). Raffinement, pas urgent.
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
