# État du projet et travail restant

État au 2026-07-19 (portail refondu en deux temps — voir « Fait »). Le plan d'amélioration UX est **terminé** (score final 34/40,
progression 28 → 33 → 34, détecteur à 0 finding — snapshots dans `.impeccable/critique/`)
et les **trois fonctionnalités demandées le 2026-07-18 sont livrées** : remise à zéro du
profil, portail à la racine (avec salut aléatoire), diagnostic voix (premier pas). La
place de la recherche est tranchée, le workflow « lots d'exemples sans relecture » est
outillé (`verifie_exemples.js`), et le contrôle visuel mobile est couvert par l'émulation
WebKit/iPhone 16 Pro. **La prochaine session commence par « Reprendre ici » ci-dessous.**

## Reprendre ici (prochaine session)

1. **Lots d'exemples A1** — le chantier principal. **250 mots A1 sans exemple** :
   Noms 130 · Expressions 22 · Nombres 14 · Saisons & mois 12 · Pronoms personnels 10 ·
   Mots interrogatifs 9 · Adverbes 9 · Prépositions 8 · Jours de la semaine 7 ·
   Conjonctions 5 · Démonstratifs 3 · Existence 2 (+ 19 « Phrases », à **exclure** : ce
   sont déjà des phrases complètes). Commencer par les **Noms** (gros du lot, fort impact).
   Méthode par lot : lister les mots sans exemple (`extractCards` exporté par build.js —
   filtrer `niveau==='A1' && !exemples`), écrire les `<ul class="exemples">` dans le
   carnet (ligne éditoriale ARCHITECTURE.md §5 : 3–8 mots, présent, vocabulaire ≤ A1,
   une situation concrète du quotidien), puis `node verifie_exemples.js` (**0 erreur
   exigé** — c'est le filet qui remplace la relecture), `node build.js`, commit.
   Ensuite : les 268 mots A2.
2. **Solder les 36 avertissements du validateur** sur le lot pilote : mots hors carnet
   (souvent des mots utiles à AJOUTER au carnet — עברית « hébreu », עכשיו en ktiv malé…),
   écarts de translittération distance 2, quelques mots d'un niveau au-dessus.
3. **Voix robotique — en attente d'une donnée de Ruben** : le nom de voix affiché dans la
   note Prononciation de son iPhone. Selon la réponse : si « Carmit » simple →
   recommander Carmit Enhanced (Réglages > Accessibilité > Contenu énoncé > Voix >
   Hébreu) ; ajuster `rate`/`pitch` si besoin ; API TTS externe **rejetée** (casse le
   tout-statique hors-ligne) ; audio préenregistré = décision produit, seulement si
   Enhanced déçoit.

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

Décisions actées (ne pas re-débattre sans nouvelle demande) :
- Le **portail est la racine** ; l'appli vit dans `app.html` ; l'icône installée ouvre
  le **portail** (`start_url: "./"` — demande de Ruben du 2026-07-19, qui annule le
  `./app.html` du 18/07 : atterrir directement dans les flashcards le surprenait).
- Le portail est un **accueil en deux temps** : « Bienvenue » très grand plein écran,
  un toucher, puis deux portes **strictement égales** (aucune dorée d'avance — l'ancien
  encadré doré des flashcards se lisait comme un faux état « sélectionné »).
- L'écran de réglages reste le premier écran de l'appli ; il s'ouvre sur la « Révision
  du jour », la recherche vit dessous.
- Le salut du portail : aléatoire fr/he, **sans nikoud**, pluriel (formule d'accueil
  standard), exclamation collée en hébreu.
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
- **Rendu visuel mobile** : Playwright + **WebKit** (vrai moteur Safari — les libs
  système sont installées) avec `devices['iPhone 16 Pro']` ; captures d'écran à l'appui.
  Premier install : `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 npx playwright install webkit`.
  Le Chrome système (`google-chrome --headless`) pend en WSL2 — ne pas l'utiliser.
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
