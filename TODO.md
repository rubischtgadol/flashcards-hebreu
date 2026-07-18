# Plan d'amélioration UX — suite de la re-critique du 18/07/2026

État au 18/07/2026 au soir : les étapes 1 à 6 sont **faites, vérifiées (jsdom) et poussées** sur
`main`. Reste la re-mesure (étape 7), et deux chantiers éditoriaux au long cours : la relecture
du classement CECRL par Ruben, et les lots d'exemples suivants.

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
- **[x] 6. Exemples en situation** — shape validé par Ruben le 18/07 (pli inline « Voir un
  exemple », lot pilote A1 d'abord). Sous-listes `<ul class="exemples">` dans le carnet
  (li du mot / 1re cellule des tables), `card.exemples` extrait dans les deux
  implémentations (`lisOf` de build.js réécrit en balayage à profondeur — les `<li>`
  imbriqués cassaient l'énumération regex), pli sur le verso Cartes + feedback Saisie +
  verdict QCM (jamais côté recto fr→he), exemples dans le tiroir de la recherche, bouton
  Écouter par phrase (masqué sous `no-he-voice`), comptes par section dans build.js.
  **Lot pilote : 77 exemples A1** (42 verbes, 2 modaux, 6 quantité, 27 adjectifs), ligne
  éditoriale dans ARCHITECTURE.md §5. Vérifié jsdom : 22/22 + non-régression niveaux.
  **Restent : relecture du lot par Ruben (nikud, ton, translittération), puis les lots
  suivants** (A1 restants — noms, expressions, interrogatifs — puis A2) par sections.

Reste transverse : **contrôle visuel navigateur (mobile) côté Ruben** — rien n'a été vu dans
un vrai navigateur depuis la refonte. Points à regarder en priorité : le pli et le bouton
collant de l'accueil, et la frontière scroll/tap du `#flip` sur iOS quand `.face` déborde
(`bindTap` + `preventDefault()` sur `pointerup`).

Décisions prises (ne pas re-débattre) :
- Priorité SRS → accessibilité → accueil : épuisée, les trois sont faites.
- Le setup reste le premier écran ; seul son poids était en cause (tranché à l'étape 3).

## Ce qui reste

### 7. `/impeccable critique index.html` — re-mesure  [ ]
- Objectif : ≥ 33/40 et **0 P1**. Le trend se lit dans `.impeccable/critique/` (28 → 33 → ?).

## Rituel à chaque étape
1. `node build.js` (régénère `flashcards_hebreu.html` ; échec si une section tombe à 0).
2. Vérif sans Chrome (WSL) : Node + jsdom dans le scratchpad ; contrôle visuel navigateur → côté Ruben.
3. Si `sw.js`/assets touchés : bump `VERSION`.
4. Commit par étape (messages en français, comme l'historique).
5. Documentation à jour en fin de passe : README, ARCHITECTURE, CLAUDE.md, DESIGN.md.
