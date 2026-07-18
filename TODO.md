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

### 1. `/impeccable harden index.html` — intégrité du verdict  [ ]
- **[P1]** Généraliser `lastRecord`/`undoLastRecord` hors mode saisie : bouton « Corriger » à côté
  de `#quiz-next` en QCM ; affordance discrète « annuler la dernière » en mode Cartes (la carte
  suivante est déjà affichée — restaurer aussi `goodCount`/`missed`/`idx`).
- **[P2]** Entrée sur champ vide en saisie : no-op (ne pas compter raté, ne pas écrire en SRS).
- Échapper `raw` dans « Aucun résultat pour « … » » (`escapeHtml` existe déjà).
- `#retry-missed` : passer de `style.display` à `.hide` (vocabulaire interne unique).

### 2. `/impeccable audit index.html` — égalité des trois modes  [ ]
- **[P2]** Verso annoncé au lecteur d'écran en mode Cartes : région `aria-live` masquée alimentée
  par `doFlip()` (français + translit), symétrique de `#quiz-live`.
- Raccourcis clavier du QCM : touches 1–4 pour les choix, Entrée/Espace pour « Suivant »
  (aujourd'hui le handler global exige `state.mode==='input'`).
- Sémantique de groupe sur les `.seg` (`fieldset`/`role="radiogroup"` + libellé).
- Une touche pour (re)jouer l'audio de la carte courante.

### 3. `/impeccable shape accueil` — puis implémentation  [ ]
- La question des deux snapshots : « Révision du jour » est la seule surface d'or au repos, mais
  l'app s'ouvre sur un panneau de réglages ; `#start` n'arrive qu'après un long défilement.
- À trancher pendant le shape (avec Ruben) : pli « Réglages avancés » (Ordre/Longueur/
  Prononciation) ? CTA collant en zone du pouce sous `pointer:coarse` ? Premier lancement
  débutant (tout sélectionné, Phrases comprises — commencer petit ?) ; une note sous le
  `.seg` Mode (seul groupe sans pédagogie).
- Contrainte : pas de refonte de fond sans décision explicite — le setup premier écran a été
  confirmé au plan précédent, seul son *poids* est en cause.

### 4. Mineures (au fil des passes 1–3, ou en `clarify` dédié)  [ ]
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

### 5. `/impeccable critique index.html` — re-mesure  [ ]
- Objectif : ≥ 33/40 et **0 P1**. Le trend se lit dans `.impeccable/critique/` (28 → 33 → ?).

## Rituel à chaque étape
1. `node build.js` (régénère `flashcards_hebreu.html` ; échec si une section tombe à 0).
2. Vérif sans Chrome (WSL) : Node + jsdom dans le scratchpad ; contrôle visuel navigateur → côté Ruben.
3. Si `sw.js`/assets touchés : bump `VERSION`.
4. Commit par étape (messages en français, comme l'historique).
