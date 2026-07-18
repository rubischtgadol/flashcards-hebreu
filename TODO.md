# Plan d'amélioration UX — suite de la re-critique du 18/07/2026

État au 18/07/2026 au soir : les étapes 1 à 5 sont **faites, vérifiées (jsdom) et poussées** sur
`main`. Reste le chantier des exemples (ouvre par un shape avec décisions de Ruben) puis la
re-mesure.

## Fait (historique compact — détail dans les messages de commit)

- **[x] 1. `harden` — intégrité du verdict** (`b727bd3`) : verdict annulable dans les trois
  modes (« Corriger » en QCM, « Annuler la dernière réponse » en Cartes avec restauration
  SRS/compteurs/position), Entrée sur champ vide = no-op, requête de recherche échappée,
  `#retry-missed` en `.hide`.
- **[x] 2. `audit` — égalité des trois modes** (`66b3264`) : verso annoncé aux lecteurs
  d'écran (`#flip-live`), clavier QCM (1–4, Entrée/Espace), `role="group"` sur les `.seg`,
  touche P « prononcer ».
- **[x] 3. `shape accueil` + implémentation** (`83c5a0c`) — décisions Ruben du 18/07 :
  pli « Réglages avancés » (details natif : Ordre/Longueur/Prononciation), « Commencer »
  sticky sous le pouce (tactile), premier lancement tout sauf Phrases, note pédagogique
  sous le Mode.
- **[x] 4. Mineures** (`f4bb468`) : ligne « Session interrompue — X/Y déjà comptées »,
  « Rejouer ces N cartes », effet Sisyphe expliqué en fin de révision, distracteurs QCM
  sans quasi-synonymes, DESIGN.md (les quatre emplois des capitales espacées).
- **[x] 5. Niveaux de difficulté (CECRL)** — shape validé par Ruben le 18/07 (mapping
  Facile = A1 / Intermédiaire = A2–B1 / Difficile = B2–C1 / Expert = C2 ; chips
  multi-sélection ; groupe sous les catégories). Les 709 mots classés dans le carnet
  (`data-niveau`, distribution A1 327 / A2 268 / B1 107 / B2 7 — méthode dans
  ARCHITECTURE.md §4), `card.niveau` extrait dans les deux implémentations, chips
  construites depuis les données (pas de chip « Expert » tant que 0 mot C2), filtre croisé
  catégories × niveau dans `start()` (révision du jour non filtrée), `prefs_v1.niveaux`
  rétro-compatible, trois indices de sélection vide distincts, comptes + garde-fou
  `EXPECTED_LEVELS` dans build.js. Vérifié jsdom : 20/20. **Relecture du classement par
  Ruben : par échantillons, en corrigeant `data-niveau` directement dans le carnet.**

Reste transverse : **contrôle visuel navigateur (mobile) côté Ruben** — rien n'a été vu dans
un vrai navigateur depuis la refonte. Points à regarder en priorité : le pli et le bouton
collant de l'accueil, et la frontière scroll/tap du `#flip` sur iOS quand `.face` déborde
(`bindTap` + `preventDefault()` sur `pointerup`).

Décisions prises (ne pas re-débattre) :
- Priorité SRS → accessibilité → accueil : épuisée, les trois sont faites.
- Le setup reste le premier écran ; seul son poids était en cause (tranché à l'étape 3).

## Ce qui reste

### 6. `/impeccable shape exemples` — exemples concrets d'utilisation, puis implémentation  [ ]
Demande de Ruben (18/07/2026) : sur les flashcards, un lien ou une autre fenêtre avec des
exemples concrets d'utilisation du mot (phrase en situation, pas juste la traduction).
**L'exemple est écrit et affiché** — la phrase hébraïque en toutes lettres (nikud), sa
translittération et sa traduction française lisibles à l'écran ; l'audio n'est qu'un
complément optionnel, jamais le seul vecteur.

- **Le contenu vit dans le carnet** (source unique de vérité) : chaque exemple = hébreu avec
  nikud + translittération + français. Format à trancher au shape : sous-liste imbriquée
  `<ul class="exemples"><li>` avec les spans `.he`/`.tr`/`.fr` habituels (plusieurs exemples
  possibles, cohérent avec le markup existant) plutôt que des `data-*` (trois champs × N
  exemples ne tiennent pas dans des attributs).
- **Affordance côté app** — à trancher au shape, dans l'esprit de la charte (pas de modale
  par réflexe, divulgation progressive) :
  - pli inline « Voir un exemple » (ghost) sur le **verso** de la carte et dans le feedback
    de saisie/QCM — jamais sur le recto en fr→he (l'exemple contient le mot : il révélerait
    la réponse) ;
  - et/ou lien profond vers le mot dans le carnet (nécessite des ancres `id` par entrée —
    utile aussi à la recherche) ;
  - la recherche du setup a déjà son tiroir `sr-detail` : y afficher les exemples aussi.
- **Audio (complément)** : en plus du texte affiché, un bouton Écouter par exemple (la phrase
  entière — la synthèse vocale au service du but conversationnel de PRODUCT.md) ; masqué
  comme le reste sous `no-he-voice`, sans jamais priver du texte.
- **Extraction** : `card.exemples?: [{he, tr, fr, he_plain}]` dans le schéma ; miroir dans
  **les deux** implémentations (`extractCards()` d'index.html + réplique regex de build.js) ;
  champ optionnel — un mot sans exemple reste une carte normale, le contenu s'écrit
  progressivement.
- **Contenu** (~700 mots, gros chantier éditorial) : par lots, en commençant par les mots
  A1/A2 (synergie avec l'étape 5 — les niveaux disent par où commencer) et les verbes/noms
  du quotidien ; exemples courts (5–8 mots), vocabulaire de l'exemple ≤ niveau du mot autant
  que possible, relecture de Ruben par échantillons.
- Garde-fous : compte d'exemples par section dans la sortie de `build.js` ; `--check` couvre
  la dérive.

### 7. `/impeccable critique index.html` — re-mesure  [ ]
- Objectif : ≥ 33/40 et **0 P1**. Le trend se lit dans `.impeccable/critique/` (28 → 33 → ?).

## Rituel à chaque étape
1. `node build.js` (régénère `flashcards_hebreu.html` ; échec si une section tombe à 0).
2. Vérif sans Chrome (WSL) : Node + jsdom dans le scratchpad ; contrôle visuel navigateur → côté Ruben.
3. Si `sw.js`/assets touchés : bump `VERSION`.
4. Commit par étape (messages en français, comme l'historique).
5. Documentation à jour en fin de passe : README, ARCHITECTURE, CLAUDE.md, DESIGN.md.
