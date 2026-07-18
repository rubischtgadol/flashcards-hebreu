# Plan d'amélioration UX — suite de la re-critique du 18/07/2026

État de départ : `/impeccable critique index.html` (double-agent) = **33/40**, 0 finding détecteur,
1 nouveau P1, snapshot commité dans `.impeccable/critique/2026-07-18T17-37-33Z__index-html.md`
(commit `58d72f5`). Le plan précédent (28 → 33, passes harden/longueur/audit/clarify/polish) est
terminé — historique dans git et dans les snapshots.

Reste transverse : **contrôle visuel navigateur (mobile) côté Ruben** — aucune des passes n'a été
vue dans un vrai navigateur depuis la refonte.

Décisions prises (ne pas re-débattre) :
- **Priorité** : d'abord l'intégrité du SRS (un pouce qui glisse ne doit pas polluer les boîtes
  Leitner), ensuite l'égalité d'accessibilité entre les trois modes, ensuite l'accueil.
- **Accueil** : la question reste ouverte (posée dans les deux snapshots) — elle se tranche à
  l'étape 3, avec Ruben, pas avant.

## Ordre des commandes

### 1. `/impeccable harden index.html` — intégrité du verdict  [x]
- **[P1]** Généraliser `lastRecord`/`undoLastRecord` hors mode saisie : bouton « Corriger » à côté
  de `#quiz-next` en QCM ; affordance discrète « annuler la dernière » en mode Cartes (la carte
  suivante est déjà affichée — restaurer aussi `goodCount`/`missed`/`idx`).
- **[P2]** Entrée sur champ vide en saisie : no-op (ne pas compter raté, ne pas écrire en SRS).
- Échapper `raw` dans « Aucun résultat pour « … » » (`escapeHtml` existe déjà).
- `#retry-missed` : passer de `style.display` à `.hide` (vocabulaire interne unique).

### 2. `/impeccable audit index.html` — égalité des trois modes  [x]
- **[P2]** Verso annoncé au lecteur d'écran en mode Cartes : région `aria-live` masquée alimentée
  par `doFlip()` (français + translit), symétrique de `#quiz-live`.
- Raccourcis clavier du QCM : touches 1–4 pour les choix, Entrée/Espace pour « Suivant »
  (aujourd'hui le handler global exige `state.mode==='input'`).
- Sémantique de groupe sur les `.seg` (`fieldset`/`role="radiogroup"` + libellé).
- Une touche pour (re)jouer l'audio de la carte courante.

### 3. `/impeccable shape accueil` — puis implémentation  [x] (décisions Ruben 18/07 : pli oui, CTA collant tactile oui, 1er lancement tout sauf Phrases, note Mode oui)
- La question des deux snapshots : « Révision du jour » est la seule surface d'or au repos, mais
  l'app s'ouvre sur un panneau de réglages ; `#start` n'arrive qu'après un long défilement.
- À trancher pendant le shape (avec Ruben) : pli « Réglages avancés » (Ordre/Longueur/
  Prononciation) ? CTA collant en zone du pouce sous `pointer:coarse` ? Premier lancement
  débutant (tout sélectionné, Phrases comprises — commencer petit ?) ; une note sous le
  `.seg` Mode (seul groupe sans pédagogie).
- Contrainte : pas de refonte de fond sans décision explicite — le setup premier écran a été
  confirmé au plan précédent, seul son *poids* est en cause.

### 4. Mineures (au fil des passes 1–3, ou en `clarify` dédié)  [x] (sauf bindTap iOS → côté Ruben)
- « Quitter » : atterrir avec une ligne « Session interrompue — X/Y déjà comptées dans ta
  révision » (le SRS est déjà écrit, le dire).
- « Recommencer » → « Rejouer ces N cartes » (même tirage, l'expliciter).
- Fin de révision : une ligne pour expliquer que les ratées redeviennent dues aussitôt
  (effet Sisyphe du compteur).
- Distracteurs QCM : éviter deux quasi-synonymes français comme options.
- `bindTap` + `preventDefault()` sur `pointerup` du `#flip` : vérifier la frontière scroll/tap
  sur iOS quand `.face` déborde (contrôle navigateur côté Ruben).
- DESIGN.md : documenter les trois usages secondaires de capitales espacées (`.face .eyebrow`,
  `.sr-cat`, `.srd-title`) ou unifier avec « Title ».

### 5. `/impeccable shape niveaux` — niveaux de difficulté, puis implémentation  [ ]
Demande de Ruben (18/07/2026) : diviser noms, adjectifs, verbes (et les autres catégories qui
s'y prêtent) en niveaux **facile / intermédiaire / difficile / expert**, avec un flag par mot
et une méthode de catégorisation robuste et rationnelle (piste : CECRL A1/A2, B1/B2, C1/C2).

- **Le flag vit dans le carnet** (source unique de vérité, comme `data-fr-court`/`data-note`) :
  `data-niveau="A1"…"C2"` sur chaque `<li>` de `word-list` et sur chaque `<tr>` des tables
  (Verbes, Adjectifs, Noms). Stocker le **CECRL fin (6 valeurs)** — standard, vérifiable contre
  des listes de référence — et mapper vers les 4 libellés dans l'app ; mapping à trancher au
  shape (proposition : facile = A1, intermédiaire = A2–B1, difficile = B2–C1, expert = C2 ;
  alternative : facile = A1/A2, intermédiaire = B1, difficile = B2, expert = C1/C2).
- **Méthode de catégorisation** (robuste et rationnelle, à documenter dans ARCHITECTURE.md) :
  croiser (a) les listes de vocabulaire des curricula d'oulpan/hébreu L2 alignés CECRL quand
  elles existent, (b) un classement fréquentiel de l'hébreu moderne (liste de fréquence de
  corpus, type wordfreq/SUBTLEX-IL) avec seuils de rang par niveau, (c) une passe de jugement
  par lots (mots du quotidien vs abstraits/idiomatiques), en notant les cas limites. Environ
  700 mots à classer : procéder par sections, avec relecture de Ruben sur échantillons.
- **Extraction** : `card.niveau` dans le schéma ; répercuter dans **les deux** implémentations
  (`extractCards()` d'index.html **et** la réplique regex de build.js), défaut raisonnable si
  l'attribut manque (ex. non classé = visible partout) pour que le carnet reste éditable
  progressivement — aucun mot ne doit disparaître des flashcards faute de flag.
- **UI setup** : un groupe « Niveau » (chips, persisté dans `prefs_v1`, rétro-compatible) qui
  filtre le pool en croisement avec les catégories ; à trancher au shape : multi-sélection
  comme les catégories ou seg exclusif, interaction avec « Révision du jour » (probablement
  non filtrée : une carte apprise reste due) et avec les compteurs des chips.
- Garde-fous : comptes par niveau affichés par `build.js`, warning si un niveau attendu tombe
  à 0 ; `--check` couvre la dérive comme d'habitude.

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
