# État du projet et travail restant

État au 2026-07-18. Le plan d'amélioration UX est **terminé** : intégrité du verdict,
accessibilité des trois modes, allègement de l'accueil, niveaux de difficulté (CECRL),
exemples en situation, re-mesure UX finale à **34/40** (progression 28 → 33 → 34,
détecteur de qualité à 0 finding — snapshots dans `.impeccable/critique/`), puis backlog
mineur soldé. Des trois fonctionnalités demandées le 2026-07-18, la **remise à zéro du
profil est faite** et le chantier voix a son **premier pas de diagnostic** ; restent la
**page d'accueil commune** (décision d'architecture à trancher), la suite du chantier
voix, du contenu (relectures éditoriales, lots d'exemples) et quelques pistes de design
non tranchées.

## Fait (historique compact — détail dans les messages de commit)

- **[x] Intégrité du verdict** (`fd84d94`) : verdict annulable dans les trois modes
  (« Corriger » en QCM, « Annuler la dernière réponse » en Cartes avec restauration
  SRS/compteurs/position), Entrée sur champ vide = no-op, requête de recherche échappée.
- **[x] Égalité des trois modes** (`71d6a12`) : verso annoncé aux lecteurs d'écran
  (`#flip-live`), clavier QCM (1–4, Entrée/Espace), `role="group"` sur les `.seg`,
  touche P « prononcer ».
- **[x] Accueil allégé** (`2fd2efa`) : pli « Réglages avancés » (details natif :
  Ordre/Longueur/Prononciation), « Commencer » collant sous le pouce en tactile,
  premier lancement tout sélectionné sauf Phrases, note pédagogique sous le Mode.
- **[x] Mineures** (`f5ff87b`) : ligne « Session interrompue — X/Y déjà comptées »,
  « Rejouer ces N cartes », effet Sisyphe expliqué en fin de révision, distracteurs QCM
  sans quasi-synonymes.
- **[x] Niveaux de difficulté (CECRL)** (`65d341c`) : les 709 mots du carnet classés via
  `data-niveau` (A1 327 · A2 268 · B1 107 · B2 7 — méthode dans ARCHITECTURE.md §4),
  mappés en quatre paliers dans l'app (Facile = A1, Intermédiaire = A2–B1,
  Difficile = B2–C1, Expert = C2). Chips multi-sélection sous les catégories, construites
  depuis les données (un niveau vide n'affiche pas de chip), filtre croisé
  catégories × niveau dans `start()`, révision du jour volontairement non filtrée,
  préférences rétro-compatibles, garde-fou `EXPECTED_LEVELS` dans build.js.
- **[x] Exemples en situation** (`ac784a4`) : sous-listes `<ul class="exemples">` dans le
  carnet (hébreu nikud + translittération + français), extraites en `card.exemples` dans
  les deux implémentations, pli « Voir un exemple » sur le verso des Cartes, le feedback
  de Saisie et le verdict du QCM (jamais côté question en fr→he), exemples dans le tiroir
  de la recherche, bouton Écouter par phrase. Lot pilote : 77 exemples sur les mots A1.
- **[x] Re-mesure UX + correctifs** (`5e53e8e`) : score 34/40. Le problème majeur trouvé
  (Entrée/Espace sur un bouton du feedback de Saisie avançaient la carte au lieu d'activer
  le bouton) est corrigé — garde « bouton focalisé » aligné sur celui du QCM, en Saisie et
  en Cartes. Avec lui : « Commencer — N cartes » vivant (croisement catégories × niveau,
  borné par la Longueur), note « mot non classé reste visible » sous le groupe Niveau,
  l'exemple déplié entre dans le champ (`scrollIntoView`), le pli « Réglages avancés »
  affiche ses valeurs mémorisées.
- **[x] Backlog mineur soldé** (`abce563`) : « tout sélectionner » ↔ « tout
  désélectionner » selon l'état, « Voir un exemple » ↔ « Masquer l'exemple », rangée de
  recherche dépliable qui déplie sans jouer l'audio (une action par geste), touche **C**
  « corriger » dans les trois modes (P et C laissent passer Ctrl/Cmd/Alt), `#flip-live`
  annonce l'exemple disponible, options « Phrases » du QCM compactées (`.qc.ph`).
  Vérifié en jsdom (24 contrôles) ; comportements documentés dans ARCHITECTURE.md
  et CLAUDE.md.
- **[x] Remise à zéro du profil** (`6f074d0`) : zone « Repartir de zéro » en bas du pli
  « Réglages avancés » (action rare et destructrice — jamais en concurrence avec les
  lampes de l'accueil). Deux temps : confirmation qui nomme la perte (N cartes suivies),
  « Annuler » en défaut sûr avec le focus. Efface `srs_v1`/`prefs_v1`/`sess_v1` et remet
  l'état premier lancement en place (`applyPrefs`/`refreshSrsUi`/`updateStart` — y compris
  les six clés de réglage de `state`, que `applyPrefs` seul ne remettrait pas) ; ligne
  `role="status"` « Profil effacé ». Vérifié en jsdom (36 contrôles, script conservé en
  scratchpad de session).
- **[x] Diagnostic voix — premier pas** (`f8a00fb`) : la note du groupe Prononciation
  affiche le nom réel de la voix retenue (« Voix hébraïque détectée ✓ — … »).

Décisions actées (ne pas re-débattre sans nouvelle demande) :
- L'écran de réglages reste le premier écran ; la hiérarchie de l'accueil est tranchée.
- La révision du jour ignore le filtre Niveau : une carte apprise reste due.
- Un mot sans `data-niveau` reste visible quel que soit le filtre (le carnet s'annote
  progressivement sans jamais perdre une carte) — et l'interface le dit.

## Ce qui reste

### Fonctionnalités demandées (2026-07-18)

- **[ ] Page d'accueil commune (portail)** : une porte d'entrée qui oriente vers les deux
  branches — le **carnet** (`vocabulaire_hebreu.html`) et l'**appli flashcards**.
  Aujourd'hui `index.html` **est** l'appli et occupe la racine ; un portail à la racine
  impose de trancher l'architecture : soit déplacer l'appli (ex. `app.html`) avec un
  portail léger en `index.html`, soit garder l'appli en racine et faire du portail une
  page à part. Impacts à traiter quel que soit le choix : `sw.js` (les navigations
  **racine** sont rabattues sur la coquille `./` — un portail change ce que « racine »
  veut dire, et la liste d'assets + `VERSION` bougent), `manifest.webmanifest`
  (`start_url` : l'icône installée doit-elle ouvrir le portail ou l'appli ?), `build.js`
  (remplacements par correspondance exacte dans `index.html`), les liens croisés existants
  app ↔ carnet, et l'URL GitHub Pages publiée. Décision produit + design (DESIGN.md :
  même charte, le portail est une « porte », pas un troisième univers).
- **[ ] Voix robotique (option audio)** : la voix hébraïque de la synthèse vocale sonne
  robotique. Le code choisit déjà la « meilleure » voix disponible (`loadVoices` dans
  index.html : score Premium > Enhanced/Neural/Siri > Carmit, `rate` à 0.88) — donc le
  problème est en aval. Le premier pas est fait : la note audio du setup **affiche le nom
  de la voix retenue** (`f8a00fb`) — relever ce nom sur l'appareil concerné, puis
  tester les alternatives par plateforme (iOS : Carmit Enhanced à télécharger dans
  Réglages > Accessibilité > Contenu énoncé > Voix ; Android/desktop : voix Google/
  Microsoft he-IL), ajuster `rate`/`pitch`, et si aucune voix système ne suffit, trancher
  la piste lourde : audio préenregistré ou API TTS externe — en tension avec le
  tout-statique hors-ligne (PRODUCT.md), donc décision produit.

### Relectures éditoriales (contenu, par échantillons)
- **Classement CECRL** : relire des échantillons par section et corriger les
  `data-niveau` directement dans `vocabulaire_hebreu.html`, puis `node build.js`.
  Les cas limites ont été tranchés « vers le bas » (mieux vaut découvrir un mot trop tôt).
- **Lot pilote d'exemples (77)** : relire nikud, ton et translittération (standard maison,
  cf. README) directement dans le carnet.
- **Lots d'exemples suivants** : d'abord les mots A1 restants (noms, expressions,
  interrogatifs…), puis A2 — ligne éditoriale dans ARCHITECTURE.md §5 (phrases de
  4–8 mots, présent, vocabulaire de l'exemple ≤ niveau du mot, une situation concrète
  du quotidien par phrase).

### Contrôle visuel navigateur (mobile)
Rien n'a été vérifié dans un vrai navigateur depuis la refonte (les vérifications ont été
faites en DOM simulé). À regarder en priorité : le pli et le bouton collant de l'accueil,
la nouvelle zone « Repartir de zéro » (rendu du bloc rouge de confirmation, focus),
et la frontière défilement/tap de la carte (`#flip`) sur iOS quand la face déborde
(`bindTap` + `preventDefault()` sur `pointerup`).

### Pistes de design ouvertes (non tranchées — demandent une décision produit)
- **Deux « lampes » sur l'accueil** : la carte « Révision du jour » (l'action quotidienne
  que le système veut encourager) rivalise avec « Commencer », qui reste le bouton le plus
  doré et le plus accessible au pouce. Faut-il inverser la hiérarchie ?
- **« Facile » comme vrai contrat** : masquer les mots non classés quand un niveau est
  coché, plutôt que les laisser passer ? (Théorique tant que tout le carnet est classé.)
- **La place de la recherche** : le dictionnaire trône en tête de l'écran de réglages —
  est-ce le bon premier écran pour lui ?

## Rituel à chaque modification

1. `node build.js` — régénère `flashcards_hebreu.html` ; échec si une section ou un
   niveau attendu tombe à 0 ; vérifier les comptes affichés (sections, niveaux, exemples).
2. Vérifier le comportement : dans un navigateur (`python3 -m http.server` puis
   `http://localhost:8000/`), ou sans navigateur avec un script Node + jsdom jetable qui
   boote `flashcards_hebreu.html` (cf. ARCHITECTURE.md « Développement et déploiement »).
3. Si `sw.js`, la liste d'assets ou les icônes changent : incrémenter `VERSION` dans `sw.js`.
4. Commit par changement, messages en français (comme l'historique), puis push sur `main`
   (GitHub Pages redéploie automatiquement).
5. Documentation à jour : README, ARCHITECTURE, CLAUDE.md, DESIGN.md, et ce fichier.
