# Plan d'implémentation — le système de chartes graphiques

> **Pour les exécutants agentiques :** SOUS-SKILL REQUIS : superpowers:subagent-driven-development
> (recommandé) ou superpowers:executing-plans, tâche par tâche. Les étapes utilisent des
> cases (`- [ ]`) pour le suivi.

**But :** rendre l'app et le portail indifférents à la direction artistique — une charte
est un dossier qu'on crée, essaie et jette sans toucher aux surfaces.

**Architecture :** trois phases. (1) Désincrustation : tous les littéraux d'identité de
`src/app/css/` et du `<style>` du portail deviennent des `var()` du contrat de 44 jetons —
strictement invisible à l'écran. (2) Mécanisme : `src/chartes/<slug>/` (jetons/regles/
identité), émission multi-chartes par le build, amorce anti-flash, polices par
déclaration, quatre gardes. (3) Sélecteur : au portail et dans les Réglages avancés,
persistance `localStorage`, `theme-color` dynamique.

**Spec de référence :** `docs/superpowers/specs/2026-07-29-systeme-de-chartes-design.md`
(fait foi en cas de doute).

**Pile technique :** HTML/CSS/JS vanilla, Node zéro dépendance (`tools/build.js`),
Playwright + WebKit pour les recettes visuelles (jamais Chrome headless — il pend en WSL2).

## Contraintes globales (implicites dans chaque tâche)

- **Zéro dépendance, zéro package manager.** Rien ne s'installe hors de l'outillage
  Playwright déjà en place (docs/RITUEL.md § Outillage).
- **Un fichier ne fait qu'une chose** (règle permanente du propriétaire), et tout point
  de câblage a une garde — un câblage sans garde est un défaut.
- **Jamais d'édition d'un artefact** (`app.html`, `index.html`, `vocabulaire_hebreu.html`,
  `flashcards_hebreu.html`, `cards.json`) : sources dans `src/`, build `node tools/build.js`.
- **Chaque commit** : `node tools/build.js` d'abord, puis `git add` des sources **et** des
  artefacts **et** de `sw.js` (le stamp — piège n°10). Le hook pre-commit exécute
  `--check` + `verifie_exemples.js`. Messages en français. Push sur `main` : autorisation
  permanente, on annonce, on ne demande pas.
- **`transition:all` interdit partout** (piège n°2) ; les propriétés animées se listent.
- **Texte UI en français** ; le hébreu porte `lang="he"` (piège n°6).
- **Ne pas interroger le graphe de connaissance pour `src/` ou `tools/`** (il leur est
  antérieur) : `grep -n` direct. Tout pilotage WebKit passe par un sous-agent.
- **Rendu : le lot 1 est invisible.** Toute différence visuelle avant/après est un échec,
  y compris 1px (piège n°17 : une marge mesurée à zéro est un défaut en sursis).
- **Une garde neuve doit être vue échouer** sur un cas fabriqué (sortie réelle à l'appui)
  avant d'être crue — une garde muette passe toujours au vert.

---

## Références communes

Les tâches citent ces blocs par leur titre. Ils font partie du plan : rien n'y est un
placeholder.

### R1. Le contrat de jetons — 44 noms, valeurs v1 (la charte `carnet`)

Les 11 historiques gardent leurs noms anglais (les renommer churnerait tous les `var()`
en place — la désincrustation ne touche que les littéraux) ; les 33 neufs sont en
français, la voix du dépôt.

```css
:root{
  /* Couleur — les 11 historiques */
  --bg:#12181f; --bg2:#161e28; --card:#1a222b; --card-edge:#2c3844;
  --ink:#ece7dd; --ink-dim:#9aa3ac; --gold:#d4a24c; --gold-soft:#e6c68a;
  --green:#5bbd7a; --red:#d96a5b; --line:#2a3440;
  /* Couleur — triplets par teinte, consommés en rgba(var(--x-rgb),a) */
  --gold-rgb:212,162,76; --gold-soft-rgb:230,198,138;
  --green-rgb:91,189,122; --red-rgb:217,106,91;
  /* Couleur — encres de contraste (texte posé sur un fond accentué) */
  --sur-or:#1a1206; --sur-rouge:#1a0d0a; --sur-vert:#0a1a0f;
  /* Ombres et voiles */
  --ombre-carte:0 20px 50px -22px #000, inset 0 1px 0 rgba(255,255,255,.03);
  --voile-sombre:rgba(0,0,0,.18);
  /* Typographie — les quatre voix */
  --fonte-hebreu:'Frank Ruhl Libre','David Libre','Times New Roman',serif;
  --fonte-ui:'Assistant','Arial Hebrew','Helvetica Neue',Arial,sans-serif;
  --fonte-mono:'JetBrains Mono','Courier New',monospace;
  --fonte-cursive:'Playpen Sans Hebrew','Segoe Script','Comic Sans MS',cursive;
  /* Typographie — les graisses */
  --graisse-titre:700; --graisse-label:600; --graisse-hebreu:500; --graisse-cursive:300;
  /* Forme — les rayons */
  --rayon-carte:20px; --rayon-panneau:16px; --rayon-vedette:14px;
  --rayon-controle:12px; --rayon-rangee:11px; --rayon-bouton:10px;
  --rayon-touche:9px; --rayon-badge:4px; --rayon-pilule:999px;
  /* Rythme — les interlettrages */
  --interlettre-vedette:.14em; --interlettre-titre:.12em; --interlettre-detail:.1em;
  --interlettre-pilule:.08em; --interlettre-bouton:.02em; --interlettre-marque:.01em;
  /* Casse */
  --casse-etiquette:uppercase;
}
```

### R2. La table de correspondance littéral → jeton (exhaustive, mesurée le 29/07)

Couleur (le triplet remplace la teinte, l'alpha reste littéral) :

| Littéral | Devient | Où (rappel) |
|---|---|---|
| `rgba(212,162,76,A)` (8 alphas) | `rgba(var(--gold-rgb),A)` | `10-base.css` ::selection, `60-revision.css` gradients, portail (menorah, alef, sélection) |
| `rgba(230,198,138,.85)` | `rgba(var(--gold-soft-rgb),.85)` | portail, flammes |
| `rgba(91,189,122,.14)` | `rgba(var(--green-rgb),.14)` | `50-qcm.css` choix correct |
| `rgba(217,106,91,A)` (.07/.13) | `rgba(var(--red-rgb),A)` | `20-selection.css` confirmation, `50-qcm.css` choix incorrect |
| `#1a1206` (×8, `color`) | `var(--sur-or)` | CTA/chips actifs (`20-selection.css`, `40-reponses.css`) |
| `#1a0d0a` (×2, `color`) | `var(--sur-rouge)` | `.danger-btn`, `.btn-again:hover` |
| `#0a1a0f` (×1, `color`) | `var(--sur-vert)` | `.btn-good:hover` |
| `0 20px 50px -22px #000, inset 0 1px 0 rgba(255,255,255,.03)` | `var(--ombre-carte)` | `30-cartes.css:27` |
| `rgba(0,0,0,.18)` | `var(--voile-sombre)` | `30-cartes.css:73` galet d'écoute |

Typographie :

| Littéral | Devient |
|---|---|
| `'Frank Ruhl Libre','David Libre','Times New Roman',serif` (×19) | `var(--fonte-hebreu)` |
| `'Assistant','Arial Hebrew','Helvetica Neue',Arial,sans-serif` (×5) | `var(--fonte-ui)` |
| `'JetBrains Mono','Courier New',monospace` (×10) | `var(--fonte-mono)` |
| `'Playpen Sans Hebrew','Segoe Script','Comic Sans MS',cursive` (×2) | `var(--fonte-cursive)` |
| `font-weight:700` (×13) | `var(--graisse-titre)` |
| `font-weight:600` (×13) | `var(--graisse-label)` |
| `font-weight:500` (×3) | `var(--graisse-hebreu)` |
| `font-weight:300` (×2) | `var(--graisse-cursive)` |

Forme, rythme, casse :

| Littéral | Devient |
|---|---|
| `border-radius:20px` | `var(--rayon-carte)` — `16px` → `--rayon-panneau` — `14px` → `--rayon-vedette` — `12px` → `--rayon-controle` — `11px` → `--rayon-rangee` — `10px` → `--rayon-bouton` — `9px` → `--rayon-touche` — `4px` → `--rayon-badge` — `999px` → `--rayon-pilule` |
| `letter-spacing:.14em` | `var(--interlettre-vedette)` — `.12em` → `--interlettre-titre` — `.1em` → `--interlettre-detail` — `.08em` → `--interlettre-pilule` — `.02em` → `--interlettre-bouton` — `.01em` → `--interlettre-marque` |
| `text-transform:uppercase` (×4) | `var(--casse-etiquette)` |

### R3. Les littéraux ADMIS (la liste d'exceptions de `verifieDesincrustation()`)

Chacun justifié — c'est la liste `EXCEPTIONS` de la garde, verbatim :

- `font-weight:400` (1×, `.adv-sub`) — 400 est l'absence de graisse, pas une identité ;
- `border-radius:50%` — cercle géométrique, pas un choix de charte ;
- `border-radius:0` (1×, `.sr-item .sr-row`) — aplatissement local d'un coin ;
- `letter-spacing:0` et `text-transform:none` (voix display) — annulations, pas des choix ;
- `box-shadow:none` — la lampe éteinte (état inerte, docs/DESIGN.md) ;
- `box-shadow:0 6px 18px -8px var(--gold)` — la géométrie du halo CTA est un dosage de
  surface, sa couleur vient déjà du jeton ;
- `transparent`, `currentColor` — neutres (spec § 8.1).

### R4. Le banc A/B — script Playwright complet

Fichier de travail : `<scratchpad>/ab/banc.js` (jamais versionné). Exécution **par
sous-agent uniquement**, serveur local préalable : `python3 -m http.server 8000` à la
racine du dépôt.

```js
// Usage : node banc.js <avant|apres>   — écrit <scratchpad>/ab/<phase>/<etat>-<largeur>.png
const { webkit, devices } = require('playwright');
const fs = require('fs'); const path = require('path');
const PHASE = process.argv[2]; if (!['avant','apres'].includes(PHASE)) process.exit(2);
const DIR = path.join(__dirname, PHASE); fs.mkdirSync(DIR, { recursive: true });
const BASE = 'http://localhost:8000';
const LARGEURS = [768, 900, 992, 1280, 1440];         // piège n°13 : le palier ordi est à 900px
(async () => {
  const b = await webkit.launch();
  async function shoot(ctx, nom, largeur){
    const p = await ctx.newPage();
    // États : portail, app-selection, app-cartes (clic #start), app-reglages (ouvre #adv)
    if (nom === 'portail') await p.goto(BASE + '/index.html');
    else {
      await p.goto(BASE + '/app.html');
      await p.waitForSelector('#start');
      if (nom === 'app-cartes'){ await p.click('#start'); await p.waitForSelector('.flip'); }
      if (nom === 'app-reglages'){ await p.click('#adv summary'); }
    }
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(600);
    await p.screenshot({ path: path.join(DIR, `${nom}-${largeur}.png`), fullPage: true });
    await p.close();
  }
  for (const etat of ['portail','app-selection','app-cartes','app-reglages']){
    { const ctx = await b.newContext({ ...devices['iPhone 16 Pro'], reducedMotion: 'reduce' });
      await shoot(ctx, etat, 393); await ctx.close(); }
    for (const l of LARGEURS){
      const ctx = await b.newContext({ viewport: { width: l, height: 900 }, reducedMotion: 'reduce' });
      await shoot(ctx, etat, l); await ctx.close();
    }
  }
  await b.close(); console.log('OK ' + PHASE);
})();
```

⚠️ Piège connu du banc : `app-cartes` tire une carte — l'ordre des cartes doit être
déterministe entre les deux passes. Avant de cliquer `#start`, forcer le même état :
`p.evaluate(() => localStorage.clear())` puis recharger, dans les DEUX phases — et le
réglage `order` par défaut doit être séquentiel ; s'il est aléatoire, remplacer l'état
`app-cartes` par `app-selection` + `#adv` ouvert et le noter dans le verdict.

Comparaison : `cmp -s avant/X.png apres/X.png` par paire. Sur écart : recapturer la paire
deux fois (éliminer le non-déterminisme), et si l'écart persiste, verdict nommé
fichier + largeur + description de la zone qui diffère. **24 paires, 24 verdicts nommés.**

### R5. Le rituel de commit de chaque tâche

```bash
node tools/build.js          # régénère les 5 artefacts + stampe sw.js
git add <sources modifiées> vocabulaire_hebreu.html cards.json app.html \
        flashcards_hebreu.html index.html sw.js
git commit -m "<message en français>"
```

---

## Phase 1 — La désincrustation (invisible à l'écran)

### Tâche 1 : le banc A/B, passe « avant »

**Fichiers :** aucun versionné — `<scratchpad>/ab/banc.js` (script R4), captures dans
`<scratchpad>/ab/avant/`.

**Interfaces :** produit les 24 PNG « avant » que la tâche 9 comparera. Aucun commit.

- [ ] **Étape 1 : écrire le script R4** dans `<scratchpad>/ab/banc.js`, verbatim.
- [ ] **Étape 2 : lancer le serveur** : `python3 -m http.server 8000` (racine du dépôt,
  arrière-plan).
- [ ] **Étape 3 (sous-agent) : exécuter** `node banc.js avant`. Attendu : `OK avant`,
  24 PNG. Critères au sous-agent : compter les fichiers, nommer tout état qui a échoué,
  PASS/FAIL par état, max 10 lignes, aucune image dans la réponse.
- [ ] **Étape 4 : vérifier le compte** : `ls <scratchpad>/ab/avant | wc -l` → 24.

### Tâche 2 : étendre `src/tokens.css` au contrat complet

**Fichiers :** Modifier : `src/tokens.css` (11 → 44 jetons).

**Interfaces :** produit les 44 noms de R1, que TOUTES les tâches suivantes consomment.
Le fichier garde sa forme exacte `:root{` première ligne, `}` dernière (l'émission de la
tâche 11 en dépend).

- [ ] **Étape 1 : remplacer le contenu** de `src/tokens.css` par le bloc R1, verbatim.
- [ ] **Étape 2 : bâtir et contrôler** : `node tools/build.js` → comptes habituels, zéro
  FAIL. `git diff --stat` sur les artefacts : seules des lignes de custom properties
  s'ajoutent (aucune règle existante modifiée).
- [ ] **Étape 3 : committer** (rituel R5) :
  `Le contrat de jetons : 44 noms, les valeurs du carnet du soir`

### Tâche 3 : désincruster `10-base.css` et `20-selection.css`

**Fichiers :** Modifier : `src/app/css/10-base.css`, `src/app/css/20-selection.css`.

**Interfaces :** consomme R1/R2/R3. Aucun littéral d'identité ne doit survivre hors R3.

- [ ] **Étape 1 : appliquer R2** aux deux fichiers — notamment : `::selection`
  (`10-base.css:3`) → `rgba(var(--gold-rgb),.30)` ; les 8× `#1a1206` de ces fichiers →
  `var(--sur-or)` ; `rgba(217,106,91,.07)` (`20-selection.css:177`) →
  `rgba(var(--red-rgb),.07)` ; toutes piles `font-family`, graisses, rayons,
  interlettrages, casses selon R2. Les entrées R3 restent telles quelles.
- [ ] **Étape 2 : auto-contrôle** :
  `grep -nE "#[0-9a-f]{3,8}|rgba?\([0-9]|font-family:'" src/app/css/10-base.css src/app/css/20-selection.css`
  → uniquement des lignes couvertes par R3 (le halo CTA, `box-shadow:none`…).
- [ ] **Étape 3 : bâtir** : `node tools/build.js` → zéro FAIL.
- [ ] **Étape 4 : committer** (R5) :
  `Désincrustation : la base et l'écran de sélection ne portent plus un littéral`

### Tâche 4 : désincruster `30-cartes.css` et `40-reponses.css`

**Fichiers :** Modifier : `src/app/css/30-cartes.css`, `src/app/css/40-reponses.css`.

**Interfaces :** consomme R1/R2/R3.

- [ ] **Étape 1 : appliquer R2** — notamment : l'ombre composée de `30-cartes.css:27` →
  `box-shadow:var(--ombre-carte)` (une seule valeur, la virgule interne vit dans le
  jeton) ; `rgba(0,0,0,.18)` (`30-cartes.css:73`) → `var(--voile-sombre)` ; le reste
  (piles, graisses, rayons — dont `.flip` 20px → `var(--rayon-carte)`, `kbd` 4px →
  `var(--rayon-badge)`, `.hebkb button` 9px → `var(--rayon-touche)`) selon R2.
- [ ] **Étape 2 : auto-contrôle** : même grep que tâche 3 sur ces deux fichiers →
  uniquement du R3.
- [ ] **Étape 3 : bâtir** : `node tools/build.js` → zéro FAIL.
- [ ] **Étape 4 : committer** (R5) :
  `Désincrustation : les cartes et les réponses passent aux jetons`

### Tâche 5 : désincruster `50-qcm.css` et `60-revision.css`

**Fichiers :** Modifier : `src/app/css/50-qcm.css`, `src/app/css/60-revision.css`.

- [ ] **Étape 1 : appliquer R2** — notamment : QCM correct/incorrect →
  `rgba(var(--green-rgb),.14)` / `rgba(var(--red-rgb),.13)` ; les 4 alphas des gradients
  de la carte de révision (`.24/.16/.08/.05`) → `rgba(var(--gold-rgb),A)` (la carte
  reste l'unique surface teintée or au repos — piège n°7, on ne touche pas au dosage) ;
  `.review-card` 14px → `var(--rayon-vedette)`.
- [ ] **Étape 2 : auto-contrôle** : même grep → uniquement du R3.
- [ ] **Étape 3 : bâtir** : `node tools/build.js` → zéro FAIL.
- [ ] **Étape 4 : committer** (R5) :
  `Désincrustation : le QCM et la révision du jour passent aux jetons`

### Tâche 6 : désincruster le `<style>` du portail

**Fichiers :** Modifier : `src/portail/index.html` (le CSS entre `<style>` et `</style>`
uniquement — le corps HTML ne bouge pas).

- [ ] **Étape 1 : appliquer R2** — notamment : `::selection` (portail:37) →
  `rgba(var(--gold-rgb),.30)` ; le halo de la menorah (portail:46, alphas `.16`/`0`) et
  les drop-shadows des flammes (portail:51 : `.5` or, `.85` or-tendre) → triplets ; le
  text-shadow du alef (portail:67, `.28`) → `rgba(var(--gold-rgb),.28)` ; `.door` 20px →
  `var(--rayon-carte)` ; piles, graisses (`500` des titres hébreu →
  `var(--graisse-hebreu)`), interlettrages selon R2. Le décor ne MIGRE pas encore
  (tâche 14) — il se jetonne sur place.
- [ ] **Étape 2 : auto-contrôle** : grep de la tâche 3 sur la zone `<style>` → uniquement
  du R3.
- [ ] **Étape 3 : bâtir** : `node tools/build.js` → zéro FAIL.
- [ ] **Étape 4 : committer** (R5) :
  `Désincrustation : le portail passe aux jetons`

### Tâche 7 : `src/tokens.css` devient `src/chartes/carnet/jetons.css`

**Fichiers :** Créer : `src/chartes/carnet/jetons.css` (par `git mv`). Modifier :
`tools/build.js:63` (la constante `TOKENS`).

**Interfaces :** produit le chemin `src/chartes/carnet/jetons.css` que les tâches 10-11
consomment. Les artefacts doivent sortir **byte-identiques**.

- [ ] **Étape 1 : déplacer** :
  `git mv src/tokens.css src/chartes/carnet/jetons.css`
- [ ] **Étape 2 : recâbler** `tools/build.js:63` :
  `const TOKENS = path.join(ROOT, 'src', 'chartes', 'carnet', 'jetons.css');`
- [ ] **Étape 3 : prouver l'identité** : `node tools/build.js` puis
  `git diff --stat -- app.html index.html vocabulaire_hebreu.html flashcards_hebreu.html cards.json sw.js`
  → **vide** (aucun artefact ne bouge).
- [ ] **Étape 4 : committer** (R5) :
  `Les jetons déménagent : src/chartes/carnet/jetons.css, artefacts intacts`

### Tâche 8 : la garde `verifieDesincrustation()`

**Fichiers :** Modifier : `tools/build.js` (fonction neuve + appel dans le flot normal
ET dans `--check`, à côté de l'appel de `verifieCharte()`).

**Interfaces :** consomme les fragments CSS de l'app (déjà lus par `assembleApp()`) et le
`<style>` du portail. Échecs accumulés puis `console.error` + `process.exit(1)` — le
motif exact de `verifieCharte()` (`tools/build.js:809`, tableau `echecs`).

- [ ] **Étape 1 : écrire la fonction** (style maison : français, zéro dépendance) :

```js
// Piège scellé par le chantier des chartes : un littéral d'identité (couleur, fonte,
// rayon, interlettrage, casse, graisse) réintroduit dans les surfaces désincrustées
// rend la charte active mensongère — la valeur ignorerait le jeton. La liste
// EXCEPTIONS_DESINCRUSTATION est le contrat inverse : chaque littéral admis, justifié.
const EXCEPTIONS_DESINCRUSTATION = [
  /font-weight:\s*400\b/,                       // absence de graisse (.adv-sub)
  /border-radius:\s*50%/,                       // cercle géométrique
  /border-radius:\s*0\b/,                       // aplatissement local
  /letter-spacing:\s*0\b/,                      // annulation (voix display)
  /text-transform:\s*none\b/,                   // annulation (voix display)
  /box-shadow:\s*none\b/,                       // lampe éteinte
  /box-shadow:\s*0 6px 18px -8px var\(--gold\)/ // halo CTA : géométrie de surface
];
function verifieDesincrustation(morceaux){       // morceaux : [{nom, css}]
  const echecs = [];
  for (const { nom, css } of morceaux){
    const sans = css
      .replace(/\/\*[\s\S]*?\*\//g, '')                                  // commentaires
      .replace(/rgba?\(\s*var\(--[a-z-]+-rgb\)\s*,[^)]*\)/g, '§rgbvar§'); // triplets admis
    const nettoye = EXCEPTIONS_DESINCRUSTATION.reduce((s, re) => s.replace(new RegExp(re.source, 'g'), '§exc§'), sans);
    for (const [prop, forme] of [
      ['couleur', /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g],
      ['font-family', /font-family:\s*(?!inherit\b|var\(--fonte-)[^;]+/g],
      ['font-weight', /font-weight:\s*(?!var\()[^;]+/g],
      ['border-radius', /border-radius:\s*(?!var\()[^;]+/g],
      ['letter-spacing', /letter-spacing:\s*(?!var\()[^;]+/g],
      ['text-transform', /text-transform:\s*(?!var\()[^;]+/g]
    ]){
      const prises = nettoye.match(forme) || [];
      for (const p of prises)
        echecs.push(nom + ' porte un littéral de ' + prop + ' hors exceptions : « ' + p.trim().slice(0, 60) + ' »');
    }
  }
  return echecs; // l'appelant les joint au flot d'échecs standard
}
```

  L'appelant passe les 6 fragments (`{nom:'src/app/css/10-base.css', css}`…) et
  `{nom:'src/portail/index.html <style>', css: <contenu entre <style> et </style>>}`.
  ⚠️ Le motif « couleur » attrapera tout `#hex` résiduel — y compris dans un dégradé ou
  un `text-shadow` : c'est voulu.
- [ ] **Étape 2 : fabriquer l'échec** — ajouter temporairement `color:#ff0000;` dans
  `10-base.css`, lancer `node tools/build.js`. Attendu : FAIL nommant le fichier et le
  littéral. **Copier la sortie réelle dans le rapport de tâche.**
- [ ] **Étape 3 : retirer le littéral fabriqué**, relancer → vert.
- [ ] **Étape 4 : vérifier `--check`** : `node tools/build.js --check` → vert (la garde
  tourne dans les deux modes).
- [ ] **Étape 5 : committer** (R5) :
  `verifieDesincrustation() : un littéral d'identité ne repassera pas`

### Tâche 9 : le banc A/B, passe « après » — le verdict du lot

**Fichiers :** aucun versionné — captures dans `<scratchpad>/ab/apres/`.

- [ ] **Étape 1 (sous-agent) : exécuter** `node banc.js apres` (mêmes conditions que la
  tâche 1 : serveur, `localStorage.clear()`).
- [ ] **Étape 2 (sous-agent) : comparer** les 24 paires au `cmp`. Critères : PASS/FAIL
  par paire, recapture ×2 sur écart avant verdict, description de zone sur écart
  persistant, max 30 lignes, aucune image.
- [ ] **Étape 3 : sur tout écart persistant** — c'est un littéral mal transposé :
  retrouver la valeur dans la table R2, corriger la tâche fautive, recommitter, refaire
  l'étape 1. **Le lot 1 n'est clos qu'à 24/24 PASS.**

---

## Phase 2 — Le mécanisme

### Tâche 10 : le registre et les dossiers de chartes

**Fichiers :** Créer : `src/chartes/chartes.json`, `src/chartes/carnet/charte.json`,
`src/chartes/essai/jetons.css`, `src/chartes/essai/charte.json`. Modifier :
`tools/build.js` (fonction `chargeChartes()` appelée en tête de flot, à côté de
`chargeDonnees()`).

**Interfaces :** produit `chargeChartes() → { defaut:'carnet', liste:[{slug, nom,
description, visible, polices, jetons, regles|null}] }` que les tâches 11-13 et 15-18
consomment. `jetons` est le contenu du fichier (forme `:root{…}` stricte), `regles` une
chaîne ou `null`.

- [ ] **Étape 1 : le registre** `src/chartes/chartes.json` :

```json
{ "defaut": "carnet", "ordre": ["carnet", "essai"] }
```

- [ ] **Étape 2 : l'identité du carnet** `src/chartes/carnet/charte.json` :

```json
{
  "nom": "Le carnet d'étude du soir",
  "description": "Nuit d'encre et or ancien — la charte historique.",
  "visible": true,
  "polices": {
    "Frank Ruhl Libre": [400, 500, 700],
    "Assistant": [400, 500, 600, 700],
    "JetBrains Mono": [400, 500],
    "Playpen Sans Hebrew": [300, 400]
  }
}
```

- [ ] **Étape 3 : la charte-canari** `src/chartes/essai/jetons.css` — les MÊMES 44 noms
  (garde 2a), valeurs criardes, piles 100 % système (aucune police à déclarer) :

```css
:root{
  --bg:#f2ede2; --bg2:#e6dcc8; --card:#fffdf6; --card-edge:#b0006d;
  --ink:#1c1633; --ink-dim:#6b5f8a; --gold:#b0006d; --gold-soft:#e0489e;
  --green:#0a7d3c; --red:#c41e00; --line:#c9b8e8;
  --gold-rgb:176,0,109; --gold-soft-rgb:224,72,158;
  --green-rgb:10,125,60; --red-rgb:196,30,0;
  --sur-or:#fff6ee; --sur-rouge:#fff3ec; --sur-vert:#f0fff2;
  --ombre-carte:0 4px 0 0 #b0006d;
  --voile-sombre:rgba(28,22,51,.12);
  --fonte-hebreu:Georgia,'Times New Roman',serif;
  --fonte-ui:Verdana,Geneva,sans-serif;
  --fonte-mono:'Courier New',monospace;
  --fonte-cursive:'Comic Sans MS',cursive;
  --graisse-titre:900; --graisse-label:800; --graisse-hebreu:700; --graisse-cursive:400;
  --rayon-carte:0; --rayon-panneau:0; --rayon-vedette:0;
  --rayon-controle:0; --rayon-rangee:0; --rayon-bouton:0;
  --rayon-touche:0; --rayon-badge:0; --rayon-pilule:0;
  --interlettre-vedette:.3em; --interlettre-titre:.25em; --interlettre-detail:.2em;
  --interlettre-pilule:.18em; --interlettre-bouton:.1em; --interlettre-marque:.08em;
  --casse-etiquette:lowercase;
}
```

  et `src/chartes/essai/charte.json` :

```json
{
  "nom": "Charte d'essai (canari)",
  "description": "Volontairement criarde : toute fuite de la charte v1 s'y voit immédiatement.",
  "visible": false,
  "polices": {}
}
```

- [ ] **Étape 4 : `chargeChartes()`** dans `tools/build.js` — lit le registre, charge
  chaque dossier, et garde en croisant les deux sens (le motif de `verifieOrphelins()`,
  `tools/build.js:646`) : un slug du registre sans dossier = échec nommé ; un dossier de
  `src/chartes/` hors registre = échec nommé ; `defaut` doit être dans `ordre` ;
  `jetons.css` doit commencer par `:root{` et finir par `}` ; `charte.json` doit porter
  `nom`, `description`, `visible`, `polices`.
- [ ] **Étape 5 : fabriquer les échecs** — (a) dossier fantôme
  `mkdir src/chartes/zombie` → FAIL nommé ; (b) slug fantôme dans `ordre` → FAIL nommé.
  Sortie réelle dans le rapport, puis nettoyer.
- [ ] **Étape 6 : bâtir** → vert (le build charge, ne consomme pas encore). Committer
  (R5, ajouter `src/chartes/`) :
  `Le registre des chartes : carnet, et le canari criard qui ne ment pas`

### Tâche 11 : l'émission multi-chartes et l'attribut

**Fichiers :** Modifier : `tools/build.js` (`lisTokens()` remplacée par l'émission ;
`assembleApp()` ~:704, `assemblePortail()` ~:739, `genereCarnet()` ~:316 ;
`verifieCharte()` :809-887). Modifier : `src/app/coquille.html:2`,
`src/portail/index.html:2` (l'attribut par défaut est écrit par le build, pas à la main —
aucune édition de ces fichiers ici, voir étape 2).

**Interfaces :** produit dans l'app et le portail : un bloc `:root{…}` nu (charte par
défaut, le repli) + un bloc `:root[data-charte="slug"]{…}` par charte + les `regles.css`
telles quelles ; et `<html lang="fr" data-charte="carnet">`. Le carnet (page) reçoit le
seul bloc nu du défaut, comme aujourd'hui.

- [ ] **Étape 1 : l'émission.** Fonction `blocsChartes(chartes, indenter)` : pour la
  charte par défaut, le `jetons` tel quel (le `:root` nu) ; puis pour CHAQUE charte du
  registre, `mustReplace(jetons, ':root{', ':root[data-charte="' + slug + '"]{', …)`
  suivi de son `regles` s'il existe. Injection au marqueur `<!-- @TOKENS -->` existant
  (`coquille.html:32`, `portail:35`) — ré-indentée de 2 espaces comme aujourd'hui.
  `genereCarnet()` continue de recevoir le seul `brut` du défaut (`tete.html:25`).
- [ ] **Étape 2 : l'attribut.** Dans `assembleApp()`/`assemblePortail()` :
  `mustReplace(html, '<html lang="fr">', '<html lang="fr" data-charte="' + defaut + '">', …)`.
  Les sources gardent `<html lang="fr">` — l'attribut est un fait de build, comme les
  tokens.
- [ ] **Étape 3 : recaler `verifieCharte()`.** (a) Le verbatim par charte : le CORPS de
  chaque `jetons.css` (les lignes entre `:root{` et `}`) doit être présent tel quel dans
  l'app et le portail, celui du défaut aussi dans le carnet — échec nommé par charte et
  par page. (b) Le compte des `:root` NUS : régler la regex sur `/:root\s*\{/g` (elle ne
  doit PAS attraper `:root[data-charte=`), constante `ROOTS_ATTENDUS` inchangée
  (app 1, carnet 3, portail 1). (c) Chaque occurrence de `:root[data-charte="X"]` dans
  une page doit correspondre à un slug du registre — échec nommé sinon. (d) Manifeste et
  `theme-color` : comparaison au `--bg` **du défaut** (comportement actuel conservé,
  le commentaire dit désormais pourquoi).
- [ ] **Étape 4 : fabriquer les échecs** — (a) un `:root{}` nu ajouté à la main dans un
  fragment CSS → FAIL (compte des nus) ; (b) retirer un jeton du `jetons.css` d'essai →
  le verbatim d'essai casse ? Non — c'est la garde 2a (tâche 15) ; ici vérifier plutôt :
  (b) `:root[data-charte="zombie"]` glissé dans un fragment → FAIL nommé. Sorties
  réelles au rapport, puis nettoyer.
- [ ] **Étape 5 : prouver l'invisibilité** : `node tools/build.js` puis, en WebKit par
  sous-agent, UNE capture du portail et UNE de l'app-sélection (iPhone) comparées au
  banc « après » de la tâche 9 (`cmp`) → identiques (les blocs scopés existent mais le
  défaut est actif : rien ne change).
- [ ] **Étape 6 : committer** (R5) :
  `L'émission multi-chartes : un :root nu en repli, un bloc scopé par charte`

### Tâche 12 : l'amorce anti-flash

**Fichiers :** Modifier : `src/app/coquille.html` (marqueur `<!-- @CHARTES:amorce -->`
sur sa propre ligne, juste avant le `<style>` de la ligne ~31), `src/portail/index.html`
(idem, avant son `<style>` ligne ~32), `tools/build.js` (génération + injection).

**Interfaces :** produit `window.CHARTES_REGISTRE = [{slug, nom, visible}]` et
l'application du choix stocké — AVANT le premier paint. Clé de stockage :
**`charte_v1`** (la convention de `04-stockage.js` : `prefs_v1`, `srs_v1`). Les tâches
16-18 consomment `window.CHARTES_REGISTRE` et la clé.

- [ ] **Étape 1 : poser les deux marqueurs** dans les coquilles (ligne dédiée, avant le
  `<style>`).
- [ ] **Étape 2 : générer dans le build** — `amorceChartes(chartes)` retourne :

```js
'<script>/* Amorce des chartes — générée par build.js */\n'
+ '(function(){window.CHARTES_REGISTRE=' + JSON.stringify(
    chartes.liste.map(c => ({ slug: c.slug, nom: c.nom, visible: c.visible }))
  ) + ';\n'
+ 'try{var c=localStorage.getItem("charte_v1");'
+ 'if(c&&window.CHARTES_REGISTRE.some(function(x){return x.slug===c}))'
+ 'document.documentElement.dataset.charte=c;}catch(e){}})();</script>'
```

  Injection par `mustReplace` du marqueur, app + portail. Le carnet n'a pas d'amorce.
  ⚠️ L'amorce est dans le `<head>`, donc HORS de la fence `BUILD:ONLINE-ONLY`
  (`99-principal.js:270-352`) : le standalone la garde — voulu, le sélecteur doit y
  marcher.
- [ ] **Étape 3 : vérifier** : `node tools/build.js` ; `grep -c 'CHARTES_REGISTRE' app.html
  index.html flashcards_hebreu.html` → 1 partout ; `grep -c 'CHARTES_REGISTRE'
  vocabulaire_hebreu.html` → 0.
- [ ] **Étape 4 : committer** (R5) :
  `L'amorce des chartes : le choix s'applique avant le premier paint`

### Tâche 13 : les polices par déclaration

**Fichiers :** Modifier : `src/app/coquille.html:27-28` (le `<link>` + `<noscript>`
remplacés par le marqueur `<!-- @CHARTES:fontes -->`), `src/portail/index.html:29-30`
(idem), `tools/build.js` (génération de l'union + garde des déclarations).
`src/carnet/tete.html` ne bouge pas.

**Interfaces :** produit `lienFontes(chartes)` → la paire `<link>`/`<noscript>` émise aux
marqueurs. Consomme les `polices` des `charte.json` (tâche 10).

- [ ] **Étape 1 : générer l'URL** — familles de TOUTES les chartes fusionnées (union des
  poids par famille), tri alphabétique (déterminisme du hash `sw.js`), format css2 :

```js
function lienFontes(chartes){
  const familles = new Map();
  for (const c of chartes.liste)
    for (const [nom, poids] of Object.entries(c.polices)){
      if (!familles.has(nom)) familles.set(nom, new Set());
      poids.forEach(p => familles.get(nom).add(p));
    }
  const q = [...familles.keys()].sort().map(nom =>
    'family=' + nom.replace(/ /g, '+') + ':wght@' + [...familles.get(nom)].sort((a,b)=>a-b).join(';')
  ).join('&');
  return 'https://fonts.googleapis.com/css2?' + q + '&display=swap';
}
```

- [ ] **Étape 2 : remplacer les `<link>` statiques** des deux coquilles par le marqueur ;
  le build émet `<link rel="stylesheet" media="print" onload="this.media='all'" …>` +
  `<noscript>` — la forme non-bloquante ACTUELLE (`coquille.html:27-28`), reproduite.
- [ ] **Étape 3 : la garde des déclarations** (elle vivra dans `verifieRegistreChartes()`,
  tâche 15, mais s'écrit ici pour être testée avec son objet) : toute famille citée dans
  un `--fonte-*` ou un `font-family` d'une charte et absente de `REPLIS_SYSTEME` doit
  être déclarée dans son `charte.json`, et toute famille déclarée doit être citée.
  `REPLIS_SYSTEME = ['David Libre','Times New Roman','Arial Hebrew','Helvetica Neue','Arial','Courier New','Segoe Script','Comic Sans MS','Georgia','Verdana','Geneva','serif','sans-serif','monospace','cursive','system-ui']`
  — `David Libre` y figure : c'est un repli local de pile, jamais chargé aujourd'hui.
- [ ] **Étape 4 : vérifier** : `node tools/build.js` ; l'URL émise dans `app.html`
  contient les 4 familles aux poids actuels (l'union ne change rien tant que seul le
  carnet déclare) ; le portail charge désormais les 4 familles (coût accepté, spec § 7).
  Fabriquer l'échec : déclarer `"Rubik": [400]` dans `essai/charte.json` sans la citer →
  FAIL nommé ; nettoyer.
- [ ] **Étape 5 : committer** (R5) :
  `Les polices se déclarent : l'union des chartes fait le lien Google Fonts`

### Tâche 14 : le décor v1 migre vers `carnet/regles.css`

**Fichiers :** Créer : `src/chartes/carnet/regles.css`. Modifier :
`src/portail/index.html` (retrait des blocs migrés + la règle d'accroche).

**Interfaces :** consomme l'émission (tâche 11 — les `regles` sont déjà injectées).
Produit le motif « point d'accroche » que toute charte future suivra.

- [ ] **Étape 1 : migrer la menorah** — les sélecteurs `.menorah`, `.menorah-g`,
  `.menorah-d`, `.menorah::before`, `.flammes` et `@keyframes lueur` (portail:68-84)
  partent dans `src/chartes/carnet/regles.css`, chaque sélecteur préfixé
  `:root[data-charte="carnet"] ` (les `@keyframes` restent non préfixés — leur nom
  suffit, la garde de la tâche 15 les exempte). Le HTML (`<span class="menorah …>`,
  `<symbol id="menorah-7">`, portail:156-178) RESTE : c'est le point d'accroche.
- [ ] **Étape 2 : la règle d'accroche** dans le `<style>` du portail :
  `.menorah{display:none}` — le SVG brut se peindrait en noir par défaut sous une charte
  qui ne le stylise pas ; la surface éteint l'ornement, la charte le rallume
  (`:root[data-charte="carnet"] .menorah{display:inline-block;…}` dans `regles.css`).
  Les animations d'usage (`acc-in`, `acc-pouls`, `porte-in`) restent au portail : ce
  sont des comportements de la surface, pas du décor de charte.
- [ ] **Étape 3 : le garde-fou du mouvement réduit** — `regles.css` porte son propre
  `@media (prefers-reduced-motion:reduce){ … }` couvrant `lueur`, sélecteurs en
  `*,*::before,*::after` (le bug « `*` ne cible pas les pseudo-éléments » est apparu
  3× dans le dépôt — défaut n°1 relevé le 25/07 sur ce portail précisément ; ne pas le
  reproduire dans le fichier neuf).
- [ ] **Étape 4 : prouver l'invisibilité** : build, puis sous-agent WebKit : capture du
  portail (iPhone + 900px) `cmp` contre la tâche 9 → identiques (carnet actif par
  défaut).
- [ ] **Étape 5 : committer** (R5) :
  `La menorah appartient au carnet : le décor v1 migre dans sa charte`

### Tâche 15 : `verifieRegistreChartes()` et la recette du canari

**Fichiers :** Modifier : `tools/build.js` (la garde, appelée avec `chargeChartes()`
dans les deux modes).

**Interfaces :** consomme `chargeChartes()`. Ferme la phase 2.

- [ ] **Étape 1 : écrire la garde** — quatre volets, échecs nommés dans le tableau
  standard :
  (a) **le contrat exact** : les noms `--x` extraits (`/--[\w-]+(?=\s*:)/g`) du
  `jetons.css` de chaque charte comparés à ceux du défaut — tout manquant, tout surplus
  est nommé avec son slug ;
  (b) **le portage des sélecteurs** de `regles.css` : parcours à profondeur d'accolades ;
  toute tête de règle hors bloc `@keyframes` et hors préambule `@media`/`@supports` doit
  contenir `[data-charte="<slug>"]` — sinon échec nommé (sélecteur cité) ;
  (c) **`transition:…all`** interdit dans `regles.css` (la regex existante de
  `verifieCharte()` :820-822, réutilisée) ;
  (d) **les polices** : le volet écrit en tâche 13, rattaché ici.
- [ ] **Étape 2 : fabriquer les quatre échecs** — (a) retirer `--casse-etiquette` du
  canari ; (b) ajouter `body{color:red}` dans `carnet/regles.css` ; (c) y ajouter
  `transition:all .2s` ; (d) déclarer une famille fantôme. Quatre sorties réelles au
  rapport, puis tout nettoyer, build vert.
- [ ] **Étape 3 : la recette du canari (sous-agent WebKit)** — protocole :
  serveur local ; `page.goto(app)` ; `page.evaluate(() =>
  localStorage.setItem('charte_v1','essai'))` ; recharger ; captures iPhone + 900px de
  la sélection et du mode cartes ; MÊME chose sur le portail. Critères numérotés au
  sous-agent : (1) fond clair partout, zéro panneau nuit-d'encre résiduel ; (2) zéro
  coin arrondi ; (3) étiquettes en bas-de-casse ; (4) aucune police à empattement
  Frank Ruhl dans l'UI (l'hébreu du canari est Georgia/système) ; (5) `#12181f` absent
  de toute couleur calculée sur 20 nœuds sondés (`getComputedStyle`) ; (6) recharger
  SANS JS (`javaScriptEnabled:false`) → le carnet intégral revient. PASS/FAIL par
  critère, max 15 lignes, aucune image. **Toute fuite v1 = un littéral survivant :
  corriger (retour tâches 3-6), recommitter, refaire.**
- [ ] **Étape 4 : committer** (R5) :
  `verifieRegistreChartes() : le contrat exact, les sélecteurs portés, les polices dites`

---

## Phase 3 — Le sélecteur

### Tâche 16 : le module `14-charte.js`

**Fichiers :** Créer : `src/app/js/14-charte.js`. Modifier : `src/app/ordre.json` (entrée
`"14-charte.js"` insérée avant `"99-principal.js"`).

**Interfaces :** produit `applyCharte(slug)` et `chartesVisibles()`, consommés par la
tâche 17. Consomme `window.CHARTES_REGISTRE` (tâche 12) et la clé `charte_v1`.

- [ ] **Étape 1 : écrire le module** :

```js
// ============================== 14-charte.js ==============================
// Expose : applyCharte, chartesVisibles, CHARTE_KEY
// La charte visuelle : appliquer un slug (attribut + persistance + theme-color)
// et dire lesquelles sont offertes au choix. Le registre vient de l'amorce
// générée par build.js (window.CHARTES_REGISTRE) ; la clé suit la convention
// de 04-stockage.js. Le choix survit à resetProfile() : une préférence
// d'apparence n'est pas une progression.
const CHARTE_KEY='charte_v1';
function chartesVisibles(){
  return (window.CHARTES_REGISTRE||[]).filter(c=>c.visible);
}
function applyCharte(slug){
  const connue=(window.CHARTES_REGISTRE||[]).some(c=>c.slug===slug);
  if(!connue) return false;
  document.documentElement.dataset.charte=slug;
  try{ localStorage.setItem(CHARTE_KEY, slug); }catch(e){}
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta){
    const bg=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    if(bg) meta.setAttribute('content', bg);
  }
  return true;
}
```

- [ ] **Étape 2 : câbler `ordre.json`** et bâtir : `node tools/build.js` →
  `verifieOrphelins()` passe (15 modules JS désormais).
- [ ] **Étape 3 : committer** (R5, avec `src/app/ordre.json`) :
  `14-charte.js : appliquer une charte, une seule responsabilité`

### Tâche 17 : la rangée « Charte graphique » des Réglages avancés

**Fichiers :** Modifier : `src/app/coquille.html` (après `#audio-note`, ligne ~170,
avant le bloc « Diagnostic de latence » ligne ~175), `src/app/js/14-charte.js` (le
câblage de la rangée), `src/app/css/20-selection.css` (le style, jetons seulement —
`verifieDesincrustation()` veille).

**Interfaces :** consomme `applyCharte`/`chartesVisibles` (tâche 16). Présente dans le
standalone (la rangée est du HTML statique, le module est hors fence).

- [ ] **Étape 1 : le HTML** — après `#audio-note` :

```html
<div class="adv-row" id="charte-row">
  <span class="adv-row-lbl">Charte graphique</span>
  <div class="seg" id="charte-seg" role="group" aria-label="Charte graphique"></div>
</div>
```

- [ ] **Étape 2 : le câblage** dans `14-charte.js` — une fonction `montreChartes()`
  appelée au boot (depuis l'init existante de `99-principal.js`, UNE ligne d'appel hors
  fence) : vide `#charte-seg`, un `<button>` par charte visible (`textContent = c.nom`,
  `aria-pressed` sur l'active), clic → `applyCharte(c.slug)` + rafraîchir les états.
  Si `chartesVisibles().length < 2`, la rangée s'affiche quand même (une charte offerte
  aujourd'hui, d'autres viendront — et le canari invisible n'y figure pas).
- [ ] **Étape 3 : le style** dans `20-selection.css`, à côté des styles `.adv` existants,
  en jetons uniquement (le motif `.seg` existant sert de modèle — même densité de
  commentaires).
- [ ] **Étape 4 : bâtir et vérifier** : build vert ; `grep -c 'charte-seg'
  flashcards_hebreu.html` → présent (le standalone l'a).
- [ ] **Étape 5 : committer** (R5) :
  `Le choix de charte entre aux Réglages avancés — standalone compris`

### Tâche 18 : le sélecteur du portail, vignettes rendues depuis les jetons

**Fichiers :** Modifier : `src/portail/index.html` (marqueur
`<!-- @CHARTES:selecteur -->` sous les portes, ~ligne 205 ; extension du `<script>`
existant lignes 209-246 ; styles des vignettes dans le `<style>`, jetons seulement),
`tools/build.js` (émission des vignettes).

**Interfaces :** consomme le registre et les `jetons` de chaque charte (tâche 10) ;
le build EXTRAIT de chaque `jetons.css` les valeurs `--bg`, `--ink`, `--gold`,
`--fonte-hebreu` (regex `/--bg:\s*([^;]+);/` etc. — littéraux GÉNÉRÉS dans l'artefact,
pas dans les sources : `verifieDesincrustation()` ne scanne que les sources, c'est
cohérent).

- [ ] **Étape 1 : l'émission.** Au marqueur, pour chaque charte **visible** :

```html
<button class="vignette-charte" data-charte-cible="carnet" lang="fr">
  <span class="vignette-apercu" lang="he">א</span>
  <span class="vignette-nom">Le carnet d'étude du soir</span>
</button>
```

  et dans le `<style>` du portail, au sous-marqueur `<!-- @CHARTES:vignettes -->`, une
  règle générée par charte :
  `.vignette-charte[data-charte-cible="carnet"] .vignette-apercu{background:#12181f;color:#ece7dd;border:1px solid #d4a24c;font-family:'Frank Ruhl Libre',…}`
  (valeurs extraites du `jetons.css` de la charte — la vignette montre la charte CIBLE,
  pas la charte active ; jamais de capture).
- [ ] **Étape 2 : le comportement** — dans le `<script>` du portail : délégation de clic
  sur `.vignette-charte` → poser `dataset.charte`, écrire `charte_v1`, mettre à jour la
  meta `theme-color` depuis `getComputedStyle` (le même geste que `applyCharte()` — le
  portail n'a pas les modules de l'app, il porte ses ~6 lignes).
- [ ] **Étape 3 : le style des vignettes** — jetons seulement dans la partie manuelle
  (l'or ne s'allume que sur la charte ACTIVE — règle de la lampe, piège n°7 : l'état
  actif porte `aria-pressed="true"` et le liseré `--gold`, les inactives restent
  sourdes).
- [ ] **Étape 4 : bâtir et vérifier** : build vert ; `grep -c 'vignette-charte'
  index.html` → 1 vignette (seul le carnet est visible) ; le canari n'y est pas.
- [ ] **Étape 5 : committer** (R5) :
  `Le portail choisit sa charte : vignettes tirées des jetons, jamais de capture`

### Tâche 19 : la recette de la phase 3

**Fichiers :** aucun (recette). Sous-agent WebKit, serveur local, critères numérotés.

- [ ] **Étape 1 (sous-agent) : dérouler le protocole**, PASS/FAIL par point, max
  20 lignes, aucune image :
  (1) app : la rangée « Charte graphique » liste « Le carnet d'étude du soir », état
  actif marqué ; (2) `applyCharte('essai')` via console → bascule sans rechargement ET
  la meta `theme-color` passe à `#f2ede2` ; (3) recharger → l'essai persiste (l'amorce
  lit `charte_v1`) ; (4) `localStorage.setItem('charte_v1','zzz')` + recharger → carnet
  (repli), aucune erreur console ; (5) `javaScriptEnabled:false` → carnet intégral ;
  (6) portail : clic vignette → application immédiate + persistance au rechargement ;
  (7) standalone ouvert en `file://` → la rangée existe, le choix s'applique et
  persiste ; (8) `node tools/build.js --check` → vert.
- [ ] **Étape 2 : corriger tout FAIL** (retour à la tâche fautive), recommitter, refaire.
- [ ] **Étape 3 : nettoyer l'état de test** (`localStorage` du navigateur de banc).

### Tâche 20 : la passe documentaire et la clôture

**Fichiers :** Modifier : `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `CLAUDE.md`,
`docs/TODO.md`. (README : vérifier s'il cite `src/tokens.css` — `grep -n tokens
README.md` — et recaler le cas échéant.)

- [ ] **Étape 1 : ARCHITECTURE.md** — un § « Le système de chartes » : l'anatomie
  (`src/chartes/<slug>/`, les trois fichiers, le registre), l'émission (`:root` nu de
  repli + blocs scopés, l'attribut stampé, l'amorce), les polices par déclaration et
  l'union, les quatre gardes (les nommer dans le § Garde-fous existant — le compte des
  garde-fous change, le tableau de TODO.md aussi).
- [ ] **Étape 2 : DESIGN.md** — une note d'ouverture : la charte v1 est désormais LA
  charte `carnet`, référence du contrat ; les règles nommées (lampe, couches, vedette…)
  restent des règles de la charte `carnet`, pas du système.
- [ ] **Étape 3 : CLAUDE.md** — recaler le piège n°5 (la source unique devient
  `src/chartes/<défaut>/jetons.css`, « byte-identique par charte » via le corps des
  blocs, `ROOTS_ATTENDUS` sur les `:root` nus) ; le § pipeline (mention de
  `chargeChartes()` et des marqueurs `@CHARTES:*`) ; le piège n°1 n'a pas changé (les
  artefacts restent 100 % générés).
- [ ] **Étape 4 : TODO.md** — le chantier passe en clos (renvoi d'archive), le tableau
  des chiffres est recalé (garde-fous, modules 15 JS), et le flag « GRAPHE À RECALER »
  s'étend : `src/chartes/` créé (5 fichiers), `src/tokens.css` déplacé,
  `src/app/js/14-charte.js` créé. Le flag ne déclenche rien.
- [ ] **Étape 5 : committer et pousser** :
  `La doc dit le système de chartes, et le chantier se clôt` — puis `git push origin
  main` (autorisation permanente ; annoncer).

---

## Auto-revue du plan (faite à l'écriture)

- **Couverture de la spec** : § 1→T globales ; § 2→nommage partout ; § 3→T10 ; § 4→T2
  (44 jetons, tailles exclues) ; § 5→T11-12 (repli, attribut, amorce, PWA, clé,
  survie au reset — vérifiée T19.4/T19.5) ; § 6→T14 (+garde T15b) ; § 7→T13 ;
  § 8→T8/T10/T11/T15 (les 4 gardes, chacune vue échouer) ; § 9→T16-18
  (visible:false, hors fence, vignettes-jetons) ; § 10→les 3 phases + A/B T1/T9 +
  canari T15 + recette T19 ; § 11→rien du plan ne touche carnet/branche
  refonte/CSP/planches ; § 12→T20.
- **Écarts assumés vis-à-vis de la spec, amendés dans la spec le 29/07** : triplets RGB
  au lieu d'alphas nommés (§ 4) ; migration du décor au lot 2 (§ 10).
- **Types/noms cohérents** : `chargeChartes()` (T10) consommé T11/T13/T15/T18 ;
  `charte_v1` défini T12, consommé T16/T18/T19 ; `applyCharte` défini T16, consommé
  T17/T19 ; les 44 noms de R1 sont l'unique référentiel.
