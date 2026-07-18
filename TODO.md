# Plan d'amélioration UX — suite de la critique du 18/07/2026

État de départ : critique `/impeccable critique index.html` = **28/40**, 3 P1, snapshot commité dans
`.impeccable/critique/2026-07-18T13-02-30Z__index-html.md` (commit `50982c4`). Arbre propre à ce commit.

Décisions prises (ne pas re-débattre) :
- **Priorité** : friction quotidienne d'abord, puis accessibilité, puis pédagogie du feedback.
- **Accueil** : on garde le setup en premier écran ; on améliore de l'intérieur (pas de refonte « Révision du jour en accueil » pour l'instant — question notée dans le snapshot).
- **Périmètre** : tout — les 5 issues (3 P1 + 2 P2) et les observations mineures.

## Ordre des commandes

### 1. `/impeccable harden index.html` — friction quotidienne + robustesse  [x]
- Persistance `prefs_v1` en localStorage : `{cats, mode, dir, script, order, audio}`, restaurée au boot
  (les deux chemins : `init()` en ligne **et** boot standalone — attention au bloc `BUILD:ONLINE-ONLY`).
- Snapshot de session en `sessionStorage` (`{queueIds, idx, score}`) restauré après reload/éviction iOS.
- CTA jamais muet : catégories restaurées (ou « tout » au 1er lancement) ; sinon ligne
  « Choisis au moins une catégorie » sous `#start` désactivé.
- Écran d'erreur du loader : bouton « Réessayer », diagnostic honnête (perte réseau ≠ fichier local),
  sans jargon « GitHub Pages ».
- Mode saisie : afficher « Ta réponse : X » (barrée/estompée) au-dessus de la correction
  (ne plus masquer la tentative, cf. `submitAnswer` ~l.1129).
- Verdict annulable : bouton « Corriger » sur le feedback qui inverse le dernier `recordResult`
  (stocker l'entrée SRS précédente avant écriture).

### 2. `/impeccable shape taille de session` — puis implémentation  [ ]
- Groupe « Longueur » au setup : 10 / 20 / 50 / tout, appliqué au pool après shuffle.
- À trancher pendant le shape : interaction avec « Révision du jour » (limite aussi ?) et « Rejouer les ratées ».

### 3. `/impeccable audit index.html` — accessibilité  [ ]
- Recherche au clavier : `.sr-row` en vrais `<button>` (ou `role="button"` + `tabindex="0"` + keydown).
- `aria-live="polite"` : `#feedback`, verdict QCM, titre de `#done`, message du loader.
- `lang="he"` sur tout l'hébreu (`.big-he`, `.sr-he`, `.f-he`, `.sub-he`…).
- `:focus-visible{outline:2px solid var(--gold); outline-offset:2px}` global ; supprimer les `outline:none` nus.
- Cibles ≥44px : `.search-clear` (28px), `.sr-speak` (34px), `.exit`, chips.
- `role="progressbar"` sur `.bar` ; un `h1` (la marque) ; `dir="auto"` sur `#answer-input`/`#search-input`.

### 4. `/impeccable clarify index.html` — libellés & pédagogie  [ ]
- « tap pour retourner » → français (« touche la carte pour la retourner »).
- Désambiguïser « Je savais pas » (cartes) vs « Je ne sais pas → » (saisie).
- Un mot d'explication du nikud sur les chips « Écriture au recto ».
- Exemple de translittération dans le placeholder de saisie (« ex. shalom, chaver »).
- « Presque ! » quand `editDist` = 1 (le moteur mesure déjà la distance).
- Réchauffer le message de fin 70–99 % (actuellement le plus froid : « 3 cartes à revoir. ») — peak-end.
- Expliquer Leitner en une phrase (état vide ou « maîtrisée »).

### 5. `/impeccable polish index.html` — reliquat  [ ]
- Emojis d'interface (⌨️ ✅ 🔊 🔁 👌 ⚠️) → SVG inline ou texte (seule fuite hors charte).
- `transition:width` → `transform:scaleX()` sur `.bar > span` et `.mbar > span`.
- CSS mort `.done .big-he` ; `segPick` sans le global déprécié `event`.
- Chips « Prononciation » désactivés sous `body.no-he-voice` ; audio QCM respecte « Au clic » (~l.836).
- Scroll imbriqué des résultats de recherche ; écran de fin : lister les ratées avant « Rejouer ».
- Enrichir le frontmatter de DESIGN.md (style cursive, radius 10/14 ou normalisation, couleurs d'ombre,
  ramp de tailles réel) pour éteindre les ~56 advisories du détecteur.

### 6. `/impeccable critique index.html` — re-mesure  [ ]
- Objectif : > 28/40, 0 P1. Le trend se lit dans `.impeccable/critique/`.

## Rituel à chaque étape
1. `node build.js` (régénère `flashcards_hebreu.html` ; échec si une section tombe à 0).
2. Vérif sans Chrome (WSL) : Node + jsdom dans le scratchpad ; contrôle visuel navigateur → côté Ruben.
3. Si `sw.js`/assets touchés : bump `VERSION`.
4. Commit par étape (messages en français, comme l'historique).
