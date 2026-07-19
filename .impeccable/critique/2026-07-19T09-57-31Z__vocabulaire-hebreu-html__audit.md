# Audit technique — `vocabulaire_hebreu.html`

**Date** : 2026-07-19 · **Commande** : `/impeccable audit` · **Registre** : product · **Plateforme** : web
**Méthode** : détecteur impeccable + lecture CSS/markup complète (agent dédié) + **mesures en WebKit réel**
(moteur Safari) sur desktop 1280px et iPhone 16 Pro. Chaque affirmation ci-dessous est mesurée ou
vérifiée dans le fichier, pas déduite.

## Score de santé

| # | Dimension | Score | Constat principal |
|---|-----------|-------|-------------------|
| 1 | Accessibilité | 2/4 | **0 %** des 4903 nœuds hébreux portent `lang="he"` (l'app est à 100 %) |
| 2 | Performance | 3/4 | Très sobre : 166 lignes de JS, 3 transitions, 1 ombre, 0 image |
| 3 | Responsive | 2/4 | 0 débordement horizontal, mais **aucun `@media`** : 21 cibles tactiles sur 23 sous 44 px |
| 4 | Theming | 3/4 | `:root` **identique au octet près** entre les 3 fichiers ; 15 littéraux hors jetons |
| 5 | Anti-patterns | 3/4 | Aucun tell IA ; deux surfaces dorées au repos contre la règle de la lampe |
| **Total** | | **13/20** | **Acceptable — travail significatif à prévoir** |

## Verdict anti-patterns : PASS, franchement

**Non, ça ne ressemble pas à de l'IA.** Aucun des tells : pas de palette cream/sand, pas de texte
en dégradé, pas de hero-metric, pas de grille de cards identiques, pas de police générique, pas
d'eyebrow répété en scaffolding (les « Partie 1/2/3 » sont une vraie structure documentaire à trois
niveaux nommés, pas du `01/02/03` décoratif). Le carnet a une identité tenue : nuit d'encre, or
ancien, sérif hébraïque en vedette.

Les défauts relevés sont des **écarts à la charte du projet**, pas des réflexes de génération.
C'est une bien meilleure position de départ.

## Résumé exécutif

- **Score : 13/20.** 4 P1, 9 P2, 7 P3. Aucun P0.
- **La cause systémique tient en une phrase** : le carnet n'a jamais reçu les trois passes que
  l'app a reçues (accessibilité, mobile, focus). Il a **zéro `@media`**, zéro `lang`, zéro
  `:focus-visible`, zéro `prefers-reduced-motion` — pendant que `app.html` et `index.html` ont
  tout cela. Le carnet est la *référence visuelle* de la charte, mais il en est devenu le
  *retardataire fonctionnel*. Ce n'est pas 20 défauts indépendants, c'est un décalage de passes.
- **Top 5** : (1) `lang="he"` absent partout ; (2) `.part` doré au repos ; (3) aucun
  `prefers-reduced-motion` + `scroll-behavior:smooth` non gardé ; (4) cibles tactiles ; (5) la
  rampe typographique a réellement dérivé (24 tailles distinctes pour 52 déclarations).

## La question posée dans TODO.md : fermer la rampe ou poser un `ignore` ?

**Ni l'un ni l'autre. Les deux options partaient d'une prémisse fausse.** Le débat supposait que
le détecteur signalait des tailles « hors liste mais légitimes ». La mesure dit autre chose :

**24 tailles distinctes pour 52 déclarations** — presque une valeur neuve toutes les deux
déclarations. `1.12rem`, `0.92rem`, `0.82rem`, `0.66rem`, `1.35rem`, `1.15rem`, `1.45rem`,
`1.55rem`, `1.6rem`… Ce n'est pas un système de rôles typographiques, c'est de l'improvisation
accumulée. Poser un `ignore` de règle reviendrait à faire taire un capteur qui a raison ; fermer
la rampe sur les 24 valeurs actuelles reviendrait à documenter la dérive comme si c'était un
dessein.

**Recommandation** : consolider sur une échelle réelle (6–8 pas), *puis* fermer la rampe dans
DESIGN.md. C'est du `/impeccable typeset`, pas une décision de documentation.

Les deux autres familles du détecteur, tranchées :

- **`design-system-radius` (5)** : `3px` sur `mark.hl` est légitime (surlignage, pas une surface).
  Les `8px` ×4 sont les encadrés inline dupliqués (voir P2 ci-dessous) — le vrai défaut est
  l'absence de classe, pas le rayon.
- **`em-dash-overuse` (164)** : **faux positif.** La règle vise l'anglais, où le tiret cadratin
  signale une prose sur-rythmée. En français le tiret d'incise est une ponctuation standard et
  le carnet est un document de prose longue. À ignorer sans état d'âme.

## Findings par sévérité

### P1 — Majeur

**[P1] `lang="he"` absent des 4903 nœuds hébreux**
`vocabulaire_hebreu.html`, tout le document · Accessibilité · WCAG 3.1.2 (AA)
Mesuré : `grep -c 'lang="he"'` → **0** dans le carnet, **16** dans `app.html`. Un lecteur d'écran
prononce donc tout l'hébreu du carnet avec la phonétique française, et la synthèse vocale ne
bascule pas de voix. C'est l'exact inverse de l'invariant tenu dans l'app (« every generated Hebrew
node carries `lang="he"` »). Sur un document dont le contenu hébreu **est** le produit, c'est le
défaut le plus lourd du fichier.
→ `/impeccable harden`

**[P1] Aucun `prefers-reduced-motion`, et `scroll-behavior:smooth` non gardé**
[L290](vocabulaire_hebreu.html#L290) · Accessibilité · WCAG 2.3.3
Mesuré : **0 règle `@media`** dans tout le fichier. `app.html` L37 et `index.html` L40 portent
toutes deux la garde globale. Le carnet ne l'a pas — et le défilement doux pilote les 27 liens du
sommaire, ce qui déclenche un mouvement de page entier chez un utilisateur qui a demandé qu'on
l'évite. À noter : la garde de l'app (`transition:none`) **ne suffirait pas ici**, `scroll-behavior`
exige son propre `auto`.
→ `/impeccable harden`

**[P1] `.part` : surface dorée au repos sur un séparateur structurel**
[L294–298](vocabulaire_hebreu.html#L294) · Anti-pattern · Règle de la lampe (DESIGN.md §6)
`border:1px solid rgba(212,162,76,.4)` + `background:linear-gradient(180deg, rgba(212,162,76,.08), transparent)`,
3 instances. DESIGN.md ne licencie **qu'une seule** surface teintée d'or au repos — la carte
« Révision du jour » — et la justifie parce qu'elle *est* l'action encouragée. Un séparateur de
partie n'est ni une action, ni une sélection, ni l'identité. Vérifié à l'écran : le bandeau pèse
visuellement plus lourd que le vrai bouton d'action situé au-dessus de lui.
→ `/impeccable quieter`

**[P1] `rgba(18,24,31,.86)` : doublon non tokenisé de `--bg`**
[L201](vocabulaire_hebreu.html#L201) · Theming
`--bg:#12181f` = `rgb(18,24,31)`. La valeur est correcte aujourd'hui et se désynchronisera
silencieusement le jour où `--bg` bouge — précisément le risque que la règle « `:root` normatif »
existe pour empêcher. Forme sûre : `color-mix(in srgb, var(--bg) 86%, transparent)`.
→ `/impeccable colorize`

### P2 — Mineur

- **[P2] 21 cibles tactiles sur 23 sous 44 px** — mesuré sur iPhone 16 Pro : les 27 pastilles du
  sommaire font ~36 px de haut, `.search-clear` ([L214](vocabulaire_hebreu.html#L214)) fait
  **28×28** alors que son jumeau dans `app.html` fait 44×44. Le carnet n'a aucun bloc
  `@media (pointer:coarse)` : rien du travail tactile de l'app ne l'atteint. → `/impeccable adapt`
- **[P2] Aucun `:focus-visible` global** — `app.html` L46 et `index.html` L41 définissent l'anneau
  d'or ; le carnet ne définit rien. Le focus reste **toujours visible** (anneau UA du navigateur,
  mesuré), donc ce n'est pas une faute d'accessibilité — c'est une rupture de charte sur 29 arrêts.
  → `/impeccable polish`
- **[P2] Halo de focus contraire à DESIGN.md §5** — [L211](vocabulaire_hebreu.html#L211)
  `box-shadow:0 0 0 3px rgba(212,162,76,.15)` alors que la charte dit « champs : bordure or au
  focus, **pas de glow** ». `app.html` fait le même travail sans ombre. *Mesuré : l'indicateur est
  excellent (**9,07:1**, minimum requis 3:1) — c'est une divergence de style, pas d'accessibilité.*
- **[P2] `.tip` : seconde surface dorée au repos** — [L245–249](vocabulaire_hebreu.html#L245),
  3 instances, bordure `rgba(212,162,76,.55)`. Plus défendable que `.part` (un encadré « point clé »
  est plausiblement ce que la lampe éclaire), mais c'est une deuxième famille que la charte ne
  couvre pas. → `/impeccable quieter`
- **[P2] `.subtheme` : cinquième emploi non déclaré de la voix Title, ×21** —
  [L308–311](vocabulaire_hebreu.html#L308), spec matériellement identique à la voix Title
  (700 / 0,82rem / 0,12em / or). DESIGN.md §3 dit « exactement quatre emplois … aucun cinquième
  sans décision de charte », et les quatre nommés vivent tous dans `app.html`. Le code et la charte
  se contredisent : soit DESIGN.md a une lacune, soit le carnet a dérivé. → décision de charte
- **[P2] Quatre formulations ad hoc d'une même idée typographique** — `thead th` (Assistant .92rem
  .08em), `.toc-group-label` (mono .66rem .1em), `.part-num` (mono .7rem .16em), `.subtheme`
  (Assistant .82rem .12em). Quatre micro-titres capitales-tracking, quatre specs différentes.
  → `/impeccable typeset`
- **[P2] `rgba(0,0,0,.14)` : cinquième gris inventé** — [L179, L181](vocabulaire_hebreu.html#L179).
  La règle des couches veut une couche tonale, pas un voile noir — et DESIGN.md a un
  `voile-audio: rgba(0,0,0,.18)` que cette valeur frôle sans l'atteindre.
- **[P2] Piles de fallback tronquées** — la charte spécifie `Frank Ruhl Libre, David Libre, Times
  New Roman, serif` ; le carnet écrit partout `'Frank Ruhl Libre',serif`. Google Fonts étant la
  seule dépendance réseau tolérée, hors-ligne l'hébreu retombe sur le `serif` générique, qui rend
  le nikoud nettement moins bien. Contredit directement le principe « Ça marche dans l'avion ».
- **[P2] Quatre encadrés inline identiques, sans classe** — L4959, L5063, L5097, L5421 portent le
  même `style="border:1px dashed var(--line); border-radius:8px; …"`. C'est un composant qui
  s'ignore (et l'origine de 4 des 5 findings `radius` du détecteur). → `/impeccable extract`

### P3 — Finition

- Pas de `<meta name="theme-color">` (les deux autres fichiers en ont un) : la chrome Safari change
  de couleur en passant du portail au carnet.
- `-webkit-tap-highlight-color:transparent` absent du `*{}` (présent dans les deux autres) : le
  carnet fait clignoter le halo gris iOS sur ses pastilles, pas l'app.
- `transition:all` ([L263](vocabulaire_hebreu.html#L263), [L286](vocabulaire_hebreu.html#L286)) —
  **même piège que celui corrigé dans `app.html` aujourd'hui** : le raccourci capture `outline-*`.
  Sans conséquence ici tant que le carnet n'a pas de `:focus-visible`, mais à corriger *avant*
  d'en ajouter un, sinon le nouvel anneau naîtra déjà cassé.
- `border:1px dashed var(--line)` porte deux sens opposés : `.empty` (« rien ici ») et les encadrés
  « important, à lire ».
- `'Courier New'` en fallback sur une seule des cinq déclarations mono ([L240](vocabulaire_hebreu.html#L240)).
- Pas de `<main>` ; le champ de recherche n'a qu'un `placeholder` pour nom accessible.
- Emoji comme marqueurs de composant (🎴 💡 ⚠️ 📌) — registre « blog générique » dans un système
  qui se veut calme et studieux. *(L'emoji manquant observé en capture est un artefact de WebKit
  headless, dépourvu de police emoji — pas un défaut du fichier.)*

## Problèmes systémiques

1. **Le décalage de passes.** Zéro `@media`, zéro `lang`, zéro `:focus-visible`, zéro
   `prefers-reduced-motion` — quatre absences totales, là où les deux autres fichiers ont les
   quatre. Traiter cela comme un lot unique, pas comme 15 tickets.
2. **Les alpha de jetons s'écrivent en littéraux.** 9 `rgba(212,162,76,…)`, 1 doublon de `--bg`,
   1 gris inventé. Cause mécanique : on ne peut pas appliquer d'alpha à un jeton hex sans
   `color-mix()`. La discipline `:root` est réelle (identique au octet près sur 3 fichiers) mais
   elle s'arrête à la frontière de la transparence.
3. **La typographie a dérivé sans que personne ne le décide** (24 tailles / 52 déclarations).

## Points positifs — à préserver

- **`:root` strictement identique entre les trois fichiers**, vérifié au octet. La discipline
  centrale de la charte tient.
- **0 échec de contraste** sur tout le document, seuils AA appliqués (4,5:1 / 3:1 grand texte).
- **Hiérarchie de titres impeccable** : 48 titres, 1 seul `<h1>`, **0 saut de niveau**.
- **0 débordement horizontal** à 320/375/402/430/768 px, et les tables larges sont correctement
  encapsulées dans `.table-wrap{overflow-x:auto}` qui **défile réellement** (vérifié : `scrollLeft`
  atteint 276) — le vocabulaire reste atteignable au doigt.
- **Aucun `border-left` coloré** : la suppression du bandeau doré (`cb101a4`) a tenu.
- **Sobriété technique** : 166 lignes de JS, 3 transitions, 1 seule ombre, 0 image, 0 erreur console.
- **Trois voix typographiques respectées** — aucune quatrième famille, aucun sérif dans un bouton.

## Actions recommandées, dans l'ordre

1. **[P1] `/impeccable harden`** — le lot « passes manquantes » : `lang="he"` sur les nœuds hébreux,
   garde `prefers-reduced-motion` (+ `scroll-behavior:auto`), nom accessible du champ de recherche.
2. **[P1] `/impeccable quieter`** — retirer l'or ambiant de `.part` (et trancher `.tip`).
3. **[P1] `/impeccable colorize`** — tokeniser les 11 littéraux dérivés de jetons (`color-mix`).
4. **[P2] `/impeccable adapt`** — bloc `@media (pointer:coarse)` : pastilles du sommaire et
   `.search-clear` à 44 px.
5. **[P2] `/impeccable typeset`** — consolider 24 tailles en 6–8 pas, *puis* fermer la rampe dans
   DESIGN.md (c'est la réponse à la question ouverte du TODO).
6. **[P2] `/impeccable extract`** — nommer le composant « encadré d'avertissement » (4 duplications).
7. **[P3] `/impeccable polish`** — `theme-color`, tap-highlight, `transition:all`, fallbacks de
   polices, `<main>`, sémantique du pointillé.

⚠️ **Couplage à ne pas oublier** : le carnet est la source des cartes. Toute retouche de markup
doit passer par `node build.js` (comptes par section et par niveau) puis `node verifie_exemples.js`.
Les correctifs ci-dessus sont presque tous en CSS/`<head>`, donc à faible risque d'extraction — sauf
l'ajout de `lang="he"`, qui touche les `<span class="he">` et doit être vérifié au build.
