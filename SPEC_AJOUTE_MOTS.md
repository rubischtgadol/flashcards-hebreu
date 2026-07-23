# SPEC — `ajoute_mots.js`, le générateur de fiche (étage 1) — v2

Spec figée après audit red team (2026-07-23). Version 2 : intègre les corrections de
l'audit — opération « exemple sur mot existant », création gâtée de sous-thème,
réutilisation des helpers de `build.js` (pas de troisième parseur), extraction
textuelle de `he2tr` depuis `app.html` (pas de troisième translittération), tableau
de relecture des `tr` dérivés, formes défectives, doublons corpus entier, règles
d'échappement, contrôle de parité jsdom, champ `apres` pour les listes ordonnées,
rappel PWA dans le verdict.

## 0. Principe directeur

Un script Node dev-only, zéro dépendance, non déployé, frère de `build.js` /
`verifie_exemples.js`. Il consomme un petit `nouveaux_mots.json` (1..N opérations)
et fait tout le mécanique, **insertion dans le carnet comprise**, pour ne plus
jamais rouvrir `vocabulaire_hebreu.html` (~8000 lignes) pour composer. On ne
manipule que le JSON et on relit un **diff ciblé** (les seuls hunks insérés) plus
un **tableau des `tr` dérivés** — jamais le fichier entier.

La règle de partage en une phrase : **l'humain fournit ce que lui seul peut décider ;
le script dérive tout ce qui est calculable, place au bon endroit, valide, et rend
un verdict.**

## 1. Architecture — interdiction du troisième parseur et de la troisième translittération

Le dépôt vit déjà avec un couplage à deux extracteurs (`extractCards()` d'`app.html`
en DOM, `build.js` en regex) que rien de mécanique n'enforce. Le générateur ne doit
pas tripler cette surface de dérive :

1. **Parsing : réutiliser `build.js`.** `build.js` exporte déjà
   `{ extractCards, NOTEBOOK, APP }` (module.exports en fin de fichier) —
   `verifie_exemples.js` consomme déjà cet export, le pattern est établi. Étendre
   l'export avec : les helpers `parseSections`, `closeOf`, `lisOf`, `exemplesOf`,
   `firstSpanText`, `attrOf`, `tdsOf`, `stripNikud`, `decodeEntities` ; les
   constantes `EXPECTED_CATS`, `EXPECTED_LEVELS`, `EXPECTED_THEMES`,
   `THEMED_CATS` ; et `listCats`, **hissée au niveau module** (aujourd'hui locale
   à `extractCards`) pour valider les labels de section — aucun changement de
   comportement CLI. `ajoute_mots.js` fait `require('./build.js')` et n'implémente
   **aucune** logique de parsing propre, ne duplique **aucune** constante. Le
   repérage des points d'insertion (fin de `<tbody>`, fin de `ul.word-list`) passe
   par `closeOf` (depth-aware) — jamais une regex non-gourmande, qui confondrait le
   `</ul>` de la word-list avec celui d'un `ul.exemples` imbriqué.
2. **Translittération : extraction textuelle, pas de copie.** `ajoute_mots.js` lit
   `app.html`, extrait **textuellement** le source de `he2tr` et l'évalue via
   `vm` — le mécanisme existe déjà dans le dépôt : `verifie_exemples.js` fait
   exactement cela (`require('vm')` + lecture d'`app.html`) ; reprendre son
   procédé. Dérive impossible par construction : la seule implémentation vivante
   reste celle d'`app.html`. Si l'extraction échoue (fonction renommée/déplacée),
   erreur bruyante — jamais de fallback silencieux. `stripNikud`, lui, vient de
   l'export de `build.js` (§1.1) : une seule source côté Node.
3. **Écriture : uniquement `vocabulaire_hebreu.html`.** Jamais
   `flashcards_hebreu.html` (100 % généré), jamais `app.html`, jamais `sw.js`.

## 2. Ce que l'humain fournit vs ce que le script dérive

| Champ | Source | Détail |
| --- | --- | --- |
| `he` (hébreu **avec niqqud**) | **humain** | irréductible |
| `fr` (sens) | **humain** | |
| `niveau` (A1/A2/B1/B2) | **humain** | ∈ `EXPECTED_LEVELS` |
| `theme` (slug) | **humain** (tables seulement) | ∈ `EXPECTED_THEMES` (15) |
| `section` + `sous_theme` | **humain** | où placer (§5) |
| genre `m`/`f` + pluriel `he` (noms) | **humain** | |
| formes MS/FS/MP/FP `he` (verbes/adjectifs) | **humain** | le niqqud des formes ; adjectifs : `null` autorisé (défectif) |
| exemple(s) : `he` + `fr` | **humain** | verbe ⇒ phrase au présent |
| `note` / `fr_court` (listes) | **humain**, optionnel | |
| `apres` (ancrage dans une liste ordonnée) | **humain**, optionnel | §5.3 |
| **`tr` de tout champ hébreu** | **machine** (`he2tr`), surchargeable | §2.1 |
| **`he_plain`** | **machine** (`stripNikud`) | jamais saisi |
| tout le balisage HTML contractuel | **machine** | spans, `class`, `lang="he"`, échappement §4.5 |
| placement + position | **machine** | §5 |
| `build.js` + `verifie_exemples.js`, verdict | **machine** | §7 |

### 2.1 Politique des `tr` (durcie par l'audit)

Tout champ portant de l'hébreu **qui reçoit un `.tr` dans le markup** accepte un
`tr` optionnel dans le JSON. Absent → dérivé via `he2tr` et écrit en dur ; présent
→ la valeur humaine gagne (le carnet est autoritaire, doctrine `trKey`/`he2tr`).

⚠️ Deux garde-fous, parce qu'un `tr` machine écrit dans le carnet devient
autoritaire et ne sera plus jamais recalculé, alors que `he2tr` est une heuristique
faible exactement là où le standard demande du jugement (shva entendu ou non —
`gdolim` mais `ledaber` —, ayin vs alef, patach furtif) :

- Le verdict imprime un **tableau dédié des `tr` dérivés** (`he` | `tr proposé` |
  champ | mot porteur), séparé du diff, avec le compte (« 14 tr dérivés, 3
  fournis »). C'est ce tableau qu'on relit avant `--ecrire`, pas les hunks.
- Les cas où l'heuristique est connue fragile (shva initial, ayin/alef
  intervocalique) sont marqués `⚠` dans ce tableau.

**Exception contractuelle** : le headword des entrées de tables (col. 1 de
Noms/Adjectifs/Verbes) ne porte **pas** de `.tr` dans le carnet — l'extracteur pose
`tr:''` et l'app retombe sur `he2tr` à l'affichage. Le générateur n'en écrit donc
jamais là.

## 3. Format d'entrée — `nouveaux_mots.json`

Un tableau d'objets. Champ discriminant : `type` ∈ `nom` | `adjectif` | `verbe` |
`liste` | `exemple`.

### 3.1 Champs communs aux quatre types « mot »

```json
{ "type": "...", "he": "...", "fr": "...", "niveau": "A2",
  "section": "...", "sous_theme": "...",
  "exemples": [ { "he": "...", "fr": "...", "tr": "…(optionnel)" } ] }
```

Un objet « mot » porte **le mot, ses inflexions et son ou ses exemples en une seule
entrée** — insérés comme un seul fragment atomique (l'exemple vit dans le `<td>` /
`<li>` du mot, le lien est structurel, rien à maintenir). `exemples[]` peut porter
plusieurs éléments : ils deviennent autant de `<li>` dans le **même**
`ul.exemples`.

### 3.2 `nom`

```json
{ "type": "nom", "he": "לֶחֶם", "fr": "pain", "niveau": "A1",
  "section": "Noms", "sous_theme": "Nourriture & repas",
  "theme": "nourriture",
  "genre": "m",
  "pluriel": { "he": "לְחָמִים", "tr": "…(optionnel)" },
  "exemples": [ { "he": "אֲנִי אוֹכֵל לֶחֶם", "fr": "je mange du pain" } ] }
```

- `pluriel` optionnel : absent ⇒ `<td>—</td>` (l'extracteur ignore `—`).
- `genre` ∈ `m` | `f`, obligatoire.

### 3.3 `adjectif`

```json
{ "type": "adjectif", "he": "גָּדוֹל", "fr": "grand", "niveau": "A1",
  "section": "Adjectifs", "theme": "abstrait",
  "formes": { "fs": {"he":"גְּדוֹלָה"}, "mp": {"he":"גְּדוֹלִים"}, "fp": {"he":"גְּדוֹלוֹת"} },
  "exemples": [ { "he": "יֵשׁ לָהֶם בַּיִת גָּדוֹל", "fr": "ils ont une grande maison" } ] }
```

- Pas de `sous_theme` (Adjectifs = table unique).
- `he` = MS ; `formes` = les 3 autres colonnes, chacune `{he, tr?}` **ou `null`**
  pour un défectif/invariable ⇒ `<td>—</td>` (l'extracteur adjectifs tolère la
  cellule vide : `if (fhe) forms.push` ; leçon de l'audit du carnet — אָרֹךְ).

### 3.4 `verbe`

```json
{ "type": "verbe", "he": "לָלֶכֶת", "fr": "aller", "niveau": "A1",
  "section": "Verbes", "sous_theme": "Mouvement & déplacement",
  "theme": "ville-transport",
  "formes": { "ms":{"he":"הוֹלֵךְ"}, "fs":{"he":"הוֹלֶכֶת"}, "mp":{"he":"הוֹלְכִים"}, "fp":{"he":"הוֹלְכוֹת"} },
  "exemples": [ { "he": "אֲנִי הוֹלֵךְ לָעֲבוֹדָה בַּבֹּקֶר", "fr": "je vais au travail le matin" } ] }
```

- `he` = infinitif (col. 1) ; `formes` = les 4 colonnes du présent, **toutes
  obligatoires et non-nulles** (l'extracteur verbes pousse les 4 sans condition —
  une forme vide produirait une carte sale). Exemple obligatoirement au présent.

### 3.5 `liste`

```json
{ "type": "liste", "he": "יָכוֹל", "fr": "pouvoir", "niveau": "A1",
  "section": "Verbes modaux", "sous_theme": null,
  "tr": "…(optionnel)",
  "note": "s'accorde : יָכוֹל / יְכוֹלָה…",
  "fr_court": "…(optionnel, → data-fr-court)",
  "apres": "…(optionnel, he_plain d'un voisin, §5.3)",
  "exemples": [ { "he": "…", "fr": "…" } ] }
```

- `section` = un LABEL de `listCats` (build.js) : `Pronoms personnels`,
  `Démonstratifs`, `Verbes modaux`, `Prépositions`, `Conjonctions`,
  `Mots interrogatifs`, `Nombres (0–10)`, `Nombres (11 et plus)`,
  `Nombres ordinaux`, `Jours de la semaine`, `Adverbes`, `Saisons & mois`,
  `Mots de quantité`, `Expressions / Divers`, `Existence et possession`, `Phrases`.
- `sous_theme` requis seulement pour les sections multi-listes
  (`Adverbes` → `Temps` | `Lieu & direction` ; `Saisons & mois` → `Saisons` | `Mois`).
- **Pas de `theme`** sur une liste (mono-thème par nature ; en poser un = erreur).
- `exemples` optionnel (obligatoire seulement sur les 3 tables).

### 3.6 `exemple` — enrichir un mot **existant** (ajout de l'audit, finding 1)

```json
{ "type": "exemple", "section": "Noms", "cible": "לחם",
  "exemple": { "he": "הַלֶּחֶם טָרִי", "fr": "le pain est frais", "tr": "…(optionnel)" } }
```

- `cible` = `he_plain` (sans niqqud) du mot porteur, résolu **dans la section
  donnée** — seul champ hébreu du schéma **exempté** du contrôle de niqqud (§7.A).
  Erreur nommée si introuvable ; erreur nommée listant les candidats si ambigu
  (homographes — cf. `HOMOGRAPHES` d'`audit_carnet_mecanique.js`).
- Append d'un `<li>` dans le `ul.exemples` existant du mot ; **création du `ul`
  s'il manque**, à la position contractuelle : dans le `<td>` col 1 **après** le
  `.fr` (tables), dans le `<li>` **après** le `.meta` (listes) — l'invariant
  headword-d'abord (§6.8) reste sauf.

## 4. Gabarits de sortie — byte-corrects (relevés dans le carnet)

Placeholders `{{…}}`. Le script réplique l'indentation de la (sous-)table voisine ;
les extracteurs sont insensibles au blanc, mais on reste propre. `tr` = fourni ou
`he2tr(he)`.

### 4.1 Verbe (ligne de `Verbes`, 5 `<td>`)

```html
    <tr data-niveau="{{niveau}}" data-theme="{{theme}}">
      <td><span class="he" lang="he">{{he}}</span><span class="fr">{{fr}}</span>
      <ul class="exemples"><li><span class="he" lang="he">{{ex.he}}</span><span class="tr">{{ex.tr}}</span><span class="fr">{{ex.fr}}</span></li></ul>
    </td>
      <td><span class="he" lang="he">{{ms.he}}</span><span class="tr">{{ms.tr}}</span></td>
      <td><span class="he" lang="he">{{fs.he}}</span><span class="tr">{{fs.tr}}</span></td>
      <td><span class="he" lang="he">{{mp.he}}</span><span class="tr">{{mp.tr}}</span></td>
      <td><span class="he" lang="he">{{fp.he}}</span><span class="tr">{{fp.tr}}</span></td>
    </tr>
```

### 4.2 Adjectif (ligne de `Adjectifs`, 4 `<td>` ; forme `null` ⇒ `<td>—</td>`)

```html
    <tr data-niveau="{{niveau}}" data-theme="{{theme}}">
      <td><span class="he" lang="he">{{he}}</span><span class="fr">{{fr}}</span>
      <ul class="exemples"><li><span class="he" lang="he">{{ex.he}}</span><span class="tr">{{ex.tr}}</span><span class="fr">{{ex.fr}}</span></li></ul>
    </td>
      <td><span class="he" lang="he">{{fs.he}}</span><span class="tr">{{fs.tr}}</span></td>
      <td><span class="he" lang="he">{{mp.he}}</span><span class="tr">{{mp.tr}}</span></td>
      <td><span class="he" lang="he">{{fp.he}}</span><span class="tr">{{fp.tr}}</span></td>
    </tr>
```

### 4.3 Nom (ligne de `Noms`, 3 `<td>`)

Col. 2 = genre en **texte nu**, sans span ; sans pluriel ⇒ `<td>—</td>` en 3ᵉ
cellule.

```html
    <tr data-niveau="{{niveau}}" data-theme="{{theme}}">
      <td><span class="he" lang="he">{{he}}</span><span class="fr">{{fr}}</span>
      <ul class="exemples"><li><span class="he" lang="he">{{ex.he}}</span><span class="tr">{{ex.tr}}</span><span class="fr">{{ex.fr}}</span></li></ul>
    </td>
      <td>{{genre}}</td>
      <td><span class="he" lang="he">{{pluriel.he}}</span><span class="tr">{{pluriel.tr}}</span></td>
    </tr>
```

### 4.4 Mot de liste (`<li>` de `ul.word-list`)

```html
  <li data-note="{{note}}" data-niveau="{{niveau}}">
    <span class="word-main"><span class="he" lang="he">{{he}}</span></span>
    <span class="meta"><span class="tr">{{tr}}</span><span class="fr">{{fr}}</span></span>
      <ul class="exemples"><li><span class="he" lang="he">{{ex.he}}</span><span class="tr">{{ex.tr}}</span><span class="fr">{{ex.fr}}</span></li></ul>
  </li>
```

- `data-note` omis si absent ; `data-fr-court="{{fr_court}}"` ajouté si fourni
  (l'extracteur le préfère au `.fr`).
- Sans exemple : le `<ul class="exemples">` disparaît (autorisé hors 3 tables).

### 4.5 Règles d'échappement (ajout de l'audit, finding 7)

- Sortie en **UTF-8 brut** : accents français et `&` nus, comme le fichier existant
  (les `<h3>` portent des `&` non échappés). **Jamais d'entités nommées** — la
  table `NAMED_ENTITIES` de `build.js` est volontairement minimale.
- Échapper `&` `<` `>` dans les nœuds texte ; `&quot;` en plus dans les valeurs
  d'attributs (`data-note`, `data-fr-court`).
- Tout matching de `section` / `sous_theme` / `cible` compare **après
  `decodeEntities`** de part et d'autre.

### 4.6 Squelette de nouveau sous-thème (ajout de l'audit, finding 2 — gâté, §5.4)

```html
<h3 class="subtheme">{{sous_theme}}</h3>
<div class="table-wrap">
<table>
  <thead>
    <tr>{{thead-de-la-section}}</tr>
  </thead>
  <tbody>
  </tbody>
</table>
</div>
```

`{{thead-de-la-section}}`, relevé dans le carnet :

- Verbes : `<th>Infinitif</th><th>MS</th><th>FS</th><th>MP</th><th>FP</th>`
- Noms : `<th>Singulier</th><th>Genre</th><th>Pluriel</th>`
- Adjectifs : table unique, jamais de nouveau sous-thème.

Inséré en **fin de section**, avant le `<h2>` suivant (ou la fin de la partie).

### 4.7 Invariant d'ordre des exemples

Le `.he`/`.fr` **du mot** précède ceux de l'exemple — les deux extracteurs lisent
le *premier* `.he`/`.fr` du fragment. Les gabarits ci-dessus le garantissent
(headword avant `ul.exemples`) ; l'op `exemple` (§3.6) le préserve en créant le
`ul` après `.fr`/`.meta`.

## 5. Logique de placement

1. **Résoudre la section** : `<h2>` dont le `<span class="count">` == `section`
   (comparaison post-`decodeEntities`). Erreur si introuvable, avec suggestion en
   cas de quasi-correspondance (typos fréquentes normalisées : `-` vs `–` de
   `Nombres (0–10)`, `&` vs `et`).
2. **Résoudre la sous-table** :
   - `Adjectifs` et sections mono-liste : la table / `ul.word-list` unique.
   - `Verbes`, `Noms`, `Adverbes`, `Saisons & mois` : le `<h3 class="subtheme">`
     dont le texte == `sous_theme`, puis la première `<table><tbody>` (ou
     `ul.word-list`) qui suit avant le `<h3>`/`<h2>` suivant. Introuvable ⇒ erreur
     listant les sous-thèmes disponibles de la section (relevés dans le fichier au
     moment de l'exécution, pas codés en dur).
3. **Position — append par défaut, `apres` pour les listes ordonnées** : append =
   insertion juste avant le `</tbody>` / `</ul>` de la cible (localisé par
   `closeOf`, depth-aware). Trois sections ont un ordre sémantique où l'append
   serait une faute d'édition : `Nombres (0–10)`, `Nombres ordinaux`,
   `Jours de la semaine`. Le champ optionnel `apres` (`he_plain` d'un voisin
   existant) insère juste après ce voisin ; il est accepté dans toute word-list,
   recommandé dans ces trois-là (le verdict le rappelle si on y appende sans
   `apres`).
4. **Nouveau sous-thème — gâté** : si `sous_theme` est introuvable **et** que le
   flag `--nouveau-sous-theme` est passé, créer le squelette §4.6 puis insérer.
   Sans le flag : erreur + suggestions (une typo ne crée jamais silencieusement
   une table fantôme).
5. **Multi-opérations** : grouper par point cible, appliquer en une passe, produire
   un diff par sous-table touchée.

Le repérage se fait par **frontière de section** (scan `<h2>`/`<h3>` via les
helpers de `build.js`), jamais par numéro de ligne — les ancres dérivent
(constaté 4×).

## 6. Invariants préservés (contrôlés par le script, pas par la discipline)

1. **Ne jamais écrire dans `flashcards_hebreu.html`** (100 % généré) ni dans
   `app.html`/`sw.js`. Le script ne touche que `vocabulaire_hebreu.html`.
2. **`lang="he"` sur chaque nœud hébreu** — tous les `.he`, headwords et exemples.
3. **`data-niveau` obligatoire** partout ; **`data-theme` sur les 3 tables
   uniquement**, jamais sur une liste.
4. `data-theme` ∈ `EXPECTED_THEMES` (15), `data-niveau` ∈ `EXPECTED_LEVELS`
   (A1/A2/B1/B2) — lus depuis `build.js`, pas dupliqués.
5. **Compte de colonnes exact** : Verbes 5 `<td>`, Adjectifs 4, Noms 3, ordre
   positionnel.
6. **≥1 exemple par entrée des 3 tables** (verbe : présent) — sinon
   `verifie_exemples.js` bloque.
7. **Balisage byte-identique** aux gabarits §4 : classes `he`/`tr`/`fr`,
   `word-main`/`meta`, genre en texte nu, headword de table sans `.tr` (§2.1).
8. **Ordre headword-avant-exemple** (§4.7).
9. **Ne pas casser les deux extracteurs** : fragments déjà clos, `ul.exemples`
   *dans* le `<li>`/`<td>`, `ul.word-list > li` direct-child, `<tbody>` intact —
   garanti par la réutilisation des helpers depth-aware (§1.1).
10. **Ne pas modifier** les 3 blocs `:root`, les `<h2>`/`count` (clés
    d'extraction), la ligne loader remplacée par `build.js`.

## 7. Validations et verdict

### A. Pré-insertion (sur le JSON, échoue tôt, n'écrit rien)

- `type` connu ; champs requis présents ; `niveau`/`theme` dans les constantes de
  `build.js`.
- **Niqqud présent** : chaque `he` (mot, formes, exemples) doit contenir ≥1 signe
  `/[֑-ׇ]/` — sinon erreur nommée (piège fréquent : texte collé sans
  niqqud).
- Verbe : 4 formes non-nulles ; adjectif : 3 clés (dont `null` licite) ; nom :
  `genre` ∈ `m`/`f`.
- Section/sous-thème/cible résolus (§5), sinon liste des valeurs valides.
- **Doublon, corpus entier** (durci par l'audit, finding 6) : `he_plain` déjà
  présent dans la **même section** ⇒ warning bloquant nommé (mot + ligne), skip
  sauf `--force` ; présent dans une **autre section** ⇒ informatif nommé
  (« déjà dans Verbes modaux, L3429 ») qui ne bloque pas — il nourrit l'arbitrage
  humain sans interdire les homographes légitimes. Bonus : ce garde rend le script
  idempotent (rejouer le même JSON ne double rien).
- **Tout ou rien** : validation complète du lot d'abord ; une seule entrée invalide
  ⇒ aucune écriture (jamais de carnet à demi-inséré).

### B. Post-insertion (la preuve, au niveau le moins cher)

⚠️ **Mécanisme sandbox — corrigé en relecture.** Les deux validateurs lisent des
chemins fixés par `__dirname` (`ROOT = __dirname` dans `build.js` ;
`verifie_exemples.js` hérite de `NOTEBOOK`/`APP` via `require('./build.js')`) :
lancés depuis le dépôt, ils valideraient le carnet **réel**, pas le candidat. Le
script les exécute donc en **sandbox** : copie de `build.js`,
`verifie_exemples.js`, `app.html` et du **carnet candidat** dans un répertoire
temporaire (scratchpad), puis `node build.js` et `node verifie_exemples.js`
**là-bas** — `__dirname` suit la copie, zéro modification des validateurs, preuve
complète sur le candidat.

- Sandbox `node build.js` — compteurs par section, échec nominatif si une carte
  sort sans `data-niveau`/`data-theme` ou hors thèmes.
- Sandbox `node verifie_exemples.js` — **0 erreur requise**, warnings remontés
  tels quels (signaux éditoriaux).
- En `--ecrire`, après vert sandbox : remplacement du carnet réel, puis
  `node build.js` **réel** (régénère le standalone déployé).
- `--parite` (optionnel, ajout de l'audit, finding 8) : charge le carnet en
  **jsdom**, y exécute `extractCards()` extrait textuellement d'`app.html`, compare
  compte + clés de cartes avec l'extracteur de `build.js`. C'est le chaînon que
  `--check` n'a jamais couvert (l'extracteur d'`app.html` ne tourne jamais en
  Node) ; à lancer au moins à chaque évolution des gabarits du générateur.
  Seule entorse assumée au zéro-dépendance, et cantonnée à ce flag : jsdom est
  déjà l'outil béni du dépôt pour la logique (TODO.md § Outillage).

### C. Verdict (ce que le script imprime avant de rendre la main)

1. Compteurs par section **avant → après**.
2. Toute erreur/warning **nommée** (le mot, la ligne) — aucun log brut.
3. Le **tableau des `tr` dérivés** (§2.1) avec les `⚠` heuristique-fragile.
4. Le **diff ciblé** (uniquement les hunks insérés).
5. Rappel PWA (finding 10) : le carnet est dans la liste d'assets de `sw.js`
   (stale-while-revalidate) — les mots neufs atteignent l'iPhone **au 2ᵉ lancement**
   sans bump ; « bump `VERSION` si tu les veux au 1ᵉʳ ». Le script ne bump pas
   lui-même (décision de fil principal, piège n°10).
6. Si append sans `apres` dans une des trois listes ordonnées : rappel (§5.3).

## 8. Cas limites

| Cas | Comportement |
| --- | --- |
| Thème inconnu (hors 15) | erreur pré-insertion, liste les 15 slugs, n'écrit rien ; le message documente la procédure d'extension (§10) |
| Niveau hors A1/A2/B1/B2 | erreur pré-insertion ; le message pointe `EXPECTED_LEVELS` (build.js) |
| Niqqud manquant (mot, forme ou exemple) | erreur nommée, n'écrit rien |
| Doublon même section | warning bloquant nommé, skip sauf `--force` |
| Doublon autre section | informatif nommé, ne bloque pas |
| Sous-thème introuvable | erreur + sous-thèmes disponibles ; création seulement via `--nouveau-sous-theme` |
| Typo de label (`-` vs `–`, `&` vs `et`) | « vouliez-vous dire… », pas d'erreur sèche |
| `theme` sur une liste | erreur (mono-thème par nature) |
| Entrée de table sans exemple | erreur pré-insertion |
| Verbe avec forme manquante/nulle | erreur (l'extracteur pousse les 4 sans condition) |
| Adjectif défectif (`null`) | `<td>—</td>`, licite |
| `cible` d'op `exemple` introuvable / ambiguë | erreur nommée ; si ambiguë, liste les candidats |
| `tr` non fourni | dérivé `he2tr`, écrit en dur, listé dans le tableau §7.C.3 |
| `apres` introuvable dans la liste cible | erreur nommée |
| N opérations, une invalide | tout ou rien : aucune écriture |
| `build.js`/`verifie` échoue après insertion | rollback — le carnet réel n'est jamais remplacé (§9) |
| Arbre git sale sur le carnet | warning (le diff du script se mélangerait à autre chose) ; ne bloque pas |

## 9. Interface & sécurité d'écriture

```text
node ajoute_mots.js nouveaux_mots.json              # dry-run (défaut) : valide + verdict + diff, ne touche RIEN
node ajoute_mots.js nouveaux_mots.json --ecrire     # insère, build, vérifie, garde si vert
node ajoute_mots.js nouveaux_mots.json --ecrire --force            # passe outre les doublons même-section
node ajoute_mots.js nouveaux_mots.json --ecrire --nouveau-sous-theme  # autorise la création §4.6
node ajoute_mots.js nouveaux_mots.json --parite     # + contrôle de parité jsdom (§7.B)
```

- **Dry-run par défaut** : on voit diff + verdict + tableau des `tr` sans risque ;
  on repasse en `--ecrire` une fois les `tr` relus. (`--ecrire`, pas `--commit` :
  le script ne touche jamais git.)
- **Sécurité** : insertion sur copie candidate ; `build.js` +
  `verifie_exemples.js` tournent contre elle **en sandbox** (mécanisme §7.B) ; le
  carnet réel n'est remplacé qu'après **vert complet**. Sinon rien n'est écrit,
  verdict d'échec nommé.
- Le script ne commit pas git, ne met pas à jour la doc, ne bump pas `sw.js` —
  fil principal (rung 4 de la doctrine).

## 10. Hors périmètre — et procédures documentées pour ne pas les re-chercher

- **Étage 2** (plus tard) : pré-remplir les champs mécaniques du JSON (pluriel,
  genre, formes, 1ʳᵉ translittération) depuis une source externe **à froid**
  (Pealim/Wiktionnaire en cache), jamais en live. Le carnet reste la source unique.
  L'étage 1 prend ces champs comme entrées.
- **Nouveau thème (16ᵉ slug)** : hors périmètre du script — exige d'aligner
  **deux fichiers** : `EXPECTED_THEMES` (build.js) **et** `THEMES` (app.html),
  slugs identiques, avant tout `data-theme` neuf dans le carnet. Le message
  d'erreur « thème inconnu » récite cette procédure.
- **Nouvelle section `<h2>`** : hors périmètre — exige `listCats` + `EXPECTED_CATS`
  dans `build.js` **et** le miroir `listCats` d'`extractCards()` dans `app.html`
  (les deux extracteurs). Idem : le message d'erreur la récite.
- **Niveau au-delà de B2** : étendre `EXPECTED_LEVELS` dans `build.js` (commentaire
  en place le prévoit déjà).

## 11. Notes de construction

1. Étendre `module.exports` de `build.js` (déjà présent : `{ extractCards,
   NOTEBOOK, APP }`) avec les helpers **et les constantes** §1.1, dont `listCats`
   hissée au niveau module — aucun changement de comportement CLI
   (`verifie_exemples.js`, consommateur actuel de l'export, doit rester vert).
2. `he2tr` : extraction textuelle depuis `app.html` + éval `vm` (§1.2), en
   reprenant le procédé déjà en place dans `verifie_exemples.js` ; test d'échec
   bruyant. `stripNikud` : export de `build.js`, pas d'extraction.
3. À la création d'`ajoute_mots.js` (et de cette spec) : fichiers créés ⇒ flag
   `⚠️ GRAPHE À RECALER` dans TODO.md « Reprendre ici » (règle du propriétaire,
   2026-07-21 — le flag ne déclenche jamais l'update).
4. Rituel post-lot inchangé : le script exécute les étapes 1–2 (build + verifie) ;
   commit, doc et éventuel bump `VERSION` restent au fil principal.
