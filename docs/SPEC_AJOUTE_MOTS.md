# SPEC — `ajoute_mots.js`, le générateur de fiche (étage 1) — v3

Spec v2 figée après audit red team (2026-07-23), décrivait un script qui composait
le HTML du carnet et l'insérait dans `vocabulaire_hebreu.html` par offset de texte.
**v3 (chantier 2, tâche 11)** : le script a basculé sur `data/*.json` — `build.js`
v2 a fait de `data/` la source de vérité (tâche 7) et de `vocabulaire_hebreu.html`
un artefact 100 % généré (`genereCarnet()`/`gabarits.js`) ; toute l'étape « composer
le HTML de la fiche » a donc disparu de ce script. Cette révision documente le
script tel qu'il est après la bascule — pas un idéal : deux fonctionnalités de v2
sont retirées plutôt qu'adaptées (§10), parce que leur prérequis technique a
disparu ou que leur portée a changé de nature (composition de gabarit, plus
l'affaire d'un outil d'insertion de données).

## 0. Principe directeur

Un script Node dev-only, zéro dépendance, non déployé, frère de `build.js` /
`verifie_exemples.js`. Il consomme un petit `nouveaux_mots.json` (1..N opérations)
et fait tout le mécanique, **insertion dans `data/*.json` comprise**, pour ne plus
jamais composer de balisage à la main. On ne manipule que le JSON et on relit un
**diff ciblé** (les seules entrées insérées, en JSON) plus un **tableau des `tr`
dérivés** — jamais un fichier entier.

La règle de partage en une phrase : **l'humain fournit ce que lui seul peut décider ;
le script dérive tout ce qui est calculable, place au bon endroit, valide, et rend
un verdict.**

## 1. Architecture — une seule source pour la donnée, une seule pour la translittération

1. **Donnée : réutiliser `build.js` v2.** `build.js` exporte
   `{ chargeDonnees, valideDonnees, deriveCartes, genereCarnet, NOTEBOOK, APP,
   stripNikud, orthographeVoisine, EXPECTED_LEVELS, EXPECTED_THEMES, listCats, … }`
   (module.exports en fin de fichier). `ajoute_mots.js` fait `require('./build.js')`
   et n'implémente **aucune** logique de chargement/validation propre, ne duplique
   **aucune** constante. Le placement (bon tableau `data/*.json`, bon groupe/sous-
   thème) se fait sur les objets JS renvoyés par `chargeDonnees()` — plus de scan
   `<h2>`/`<h3>`/`closeOf` sur un fichier HTML de ~8000 lignes : la « frontière de
   section » de la spec v2 devient un filtre sur le champ `groupe` d'un tableau.
2. **Translittération : extraction textuelle, pas de copie.** Inchangé depuis v2 :
   `ajoute_mots.js` lit `app.html`, extrait **textuellement** le source de `he2tr`
   et l'évalue via `vm` — même procédé que `verifie_exemples.js`. Dérive impossible
   par construction : la seule implémentation vivante reste celle d'`app.html`. Si
   l'extraction échoue (fonction renommée/déplacée), erreur bruyante — jamais de
   fallback silencieux. `stripNikud` vient de l'export de `build.js`.
3. **Écriture : uniquement `data/*.json`.** Jamais `vocabulaire_hebreu.html`
   directement (100 % généré depuis v2), jamais `cards.json`, jamais
   `flashcards_hebreu.html`, jamais `app.html`, jamais `sw.js`. Les trois artefacts
   déployés/dérivés sont régénérés en appelant `node tools/build.js`, jamais composés par
   ce script.
4. **Sous-thème humain → `groupe` de data/ : un seul algorithme, déjà éprouvé.**
   Le champ `groupe` de `data/*.json` est un slug (`"nourriture-repas"`), pas le
   titre humain qui vivait dans `<h3 class="subtheme">` (`"Nourriture & repas"`).
   `ajoute_mots.js` réutilise **l'algorithme `slug()` qui a produit ces valeurs au
   chantier 1** (NFD + retrait diacritiques + minuscule + `[^a-z0-9]+` → `-` ;
   les scripts qui l'ont appliqué ont été supprimés au Task 20) plutôt que d'en
   redéfinir un second. Il est idempotent sur un slug déjà propre
   (`slug("nourriture-repas") === "nourriture-repas"`), donc `sous_theme` accepte
   indifféremment l'ancien titre humain ou directement le slug de `data/`.

## 2. Ce que l'humain fournit vs ce que le script dérive

| Champ | Source | Détail |
| --- | --- | --- |
| `he` (hébreu **avec niqqud**) | **humain** | irréductible |
| `fr` (sens) | **humain** | |
| `niveau` (A1/A2/B1/B2) | **humain** | ∈ `EXPECTED_LEVELS` |
| `theme` (slug) | **humain** (tables seulement) | ∈ `EXPECTED_THEMES` (15) |
| `section` + `sous_theme` | **humain** | où placer (§5) — titre humain ou slug `groupe`, §1.4 |
| genre `m`/`f` + pluriel `he` (noms) | **humain** | |
| formes MS/FS/MP/FP `he` (verbes/adjectifs) | **humain** | le niqqud des formes ; les 3/4 formes sont obligatoires (§3.3, changement v3) |
| exemple(s) : `he` + `fr` | **humain** | verbe ⇒ phrase au présent |
| `note` / `fr_court` (listes) | **humain**, optionnel | |
| `apres` (ancrage dans une liste ordonnée) | **humain**, optionnel | §5.3 |
| **`tr` de tout champ hébreu** | **machine** (`he2tr`), surchargeable | §2.1 |
| l'objet JSON à insérer dans `data/*.json` | **machine** | jamais de balisage HTML composé (§10) |
| placement + position dans le tableau/la liste | **machine** | §5 |
| `build.js` + `verifie_exemples.js`, verdict | **machine** | §7 |

### 2.1 Politique des `tr` (inchangée depuis v2)

Tout champ portant de l'hébreu **qui reçoit un `.tr` dans le schéma de `data/`**
accepte un `tr` optionnel dans le JSON. Absent → dérivé via `he2tr` et écrit en dur ;
présent → la valeur humaine gagne (`data/*.json` est autoritaire, doctrine
`trKey`/`he2tr`).

⚠️ Deux garde-fous, parce qu'un `tr` machine écrit dans `data/` devient autoritaire
et ne sera plus jamais recalculé, alors que `he2tr` est une heuristique faible
exactement là où le standard demande du jugement (shva entendu ou non — `gdolim`
mais `ledaber` —, ayin vs alef, patach furtif) :

- Le verdict imprime un **tableau dédié des `tr` dérivés** (`he` | `tr proposé` |
  champ | mot porteur), séparé du diff, avec le compte (« N dérivés, M fournis »).
  C'est ce tableau qu'on relit avant `--ecrire`, pas le diff.
- Les cas où l'heuristique est connue fragile (shva initial, ayin/alef
  intervocalique) sont marqués `⚠` dans ce tableau.

**Les fautes reproductibles d'`he2tr`** (shva initial devant sifflante, yud
consonantique rendu `i`, redoublement mal résolu, alef final sans apostrophe —
détail dans la version précédente de ce document, `git log -p` si besoin) restent
à chercher en priorité dans le tableau ; le `⚠` ne les couvre pas toutes.

**Exception contractuelle** : le headword des entrées de tables (`he` de
`data/noms.json`/`adjectifs.json`/`verbes.json`) ne porte **pas** de champ `tr` —
`deriveCartes` pose `tr:''` et l'app retombe sur `he2tr` à l'affichage. Le
générateur n'en dérive donc jamais pour ce champ précis.

## 3. Format d'entrée — `nouveaux_mots.json`

**Inchangé depuis v2** : un tableau d'objets, champ discriminant `type` ∈
`nom` | `adjectif` | `verbe` | `liste` | `exemple`. Les cinq formes d'opération et
leurs champs sont identiques à la version précédente de ce document ; seul le
§3.3 change (voir ci-dessous). Résumé des champs communs :

```json
{ "type": "...", "he": "...", "fr": "...", "niveau": "A2",
  "section": "...", "sous_theme": "...",
  "exemples": [ { "he": "...", "fr": "...", "tr": "…(optionnel)" } ] }
```

### 3.1 `nom`

```json
{ "type": "nom", "he": "לֶחֶם", "fr": "pain", "niveau": "A1",
  "section": "Noms", "sous_theme": "Nourriture & repas",
  "theme": "nourriture",
  "genre": "m",
  "pluriel": { "he": "לְחָמִים", "tr": "…(optionnel)" },
  "exemples": [ { "he": "אֲנִי אוֹכֵל לֶחֶם", "fr": "je mange du pain" } ] }
```

- `pluriel` optionnel : absent/`null` ⇒ écrit `pluriel: null` dans `data/noms.json`
  (`gabarits.js:ligneNom` affiche alors `<td>—</td>`, jamais une cellule vide).
- `genre` ∈ `m` | `f`, obligatoire.

### 3.2 `adjectif`

```json
{ "type": "adjectif", "he": "גָּדוֹל", "fr": "grand", "niveau": "A1",
  "section": "Adjectifs", "theme": "abstrait",
  "formes": { "fs": {"he":"גְּדוֹלָה"}, "mp": {"he":"גְּדוֹלִים"}, "fp": {"he":"גְּדוֹלוֹת"} },
  "exemples": [ { "he": "יֵשׁ לָהֶם בַּיִת גָּדוֹל", "fr": "ils ont une grande maison" } ] }
```

- Pas de `sous_theme` (Adjectifs = table unique, `groupe: ""` dans `data/`).
- `he` = MS ; `formes` = les 3 autres colonnes.

### 3.3 Formes de table : les 3/4 sont obligatoires, jamais de défectif (**changement v3**)

v2 tolérait une forme adjectif `null` (défectif/invariable) qui produisait un
`<td>—</td>` — ce comportement venait de l'ancien générateur HTML manuel. Le
gabarit repris tel quel de `build.js` v2 (`src/carnet/gabarits.js:heSpan`,
`ligneAdjectif`/`ligneVerbe`) **n'a pas de représentation pour une forme absente** :
`heSpan({})` écrirait littéralement `undefined` dans le carnet plutôt qu'un tiret
(vérifié en lisant `heSpan` avant d'écrire ce contrôle — aucune entrée de
`data/adjectifs.json` n'a de forme défective aujourd'hui, donc ce gap dormait sans
symptôme). `ajoute_mots.js` v3 est donc **plus strict que v2** ici : les 3 formes
d'un adjectif (`fs`/`mp`/`fp`) et les 4 d'un verbe (`ms`/`fs`/`mp`/`fp`) doivent
toutes porter un `he` non vide et vocalisé — erreur pré-insertion nommée sinon.
Un vrai défectif reste possible via une note éditoriale dans `fr`, pas via une
cellule vide (hors périmètre d'automatiser ce cas, comme avant).

### 3.4 `verbe`

```json
{ "type": "verbe", "he": "לָלֶכֶת", "fr": "aller", "niveau": "A1",
  "section": "Verbes", "sous_theme": "Mouvement & déplacement",
  "theme": "ville-transport",
  "formes": { "ms":{"he":"הוֹלֵךְ"}, "fs":{"he":"הוֹלֶכֶת"}, "mp":{"he":"הוֹלְכִים"}, "fp":{"he":"הוֹלְכוֹת"} },
  "exemples": [ { "he": "אֲנִי הוֹלֵךְ לָעֲבוֹדָה בַּבֹּקֶר", "fr": "je vais au travail le matin" } ] }
```

- `he` = infinitif ; `formes` = les 4 formes du présent, toutes obligatoires et
  non vides (inchangé depuis v2 — `deriveCartes` les pousse sans condition).
  Exemple obligatoirement au présent.

### 3.5 `liste`

```json
{ "type": "liste", "he": "יָכוֹל", "fr": "pouvoir", "niveau": "A1",
  "section": "Verbes modaux", "sous_theme": null,
  "tr": "…(optionnel)",
  "note": "s'accorde : יָכוֹל / יְכוֹלָה…",
  "fr_court": "…(optionnel, → champ fr_court de data/)",
  "apres": "…(optionnel, he_plain d'un voisin, §5.3)",
  "exemples": [ { "he": "…", "fr": "…" } ] }
```

- `section` = un LABEL de `listCats` (build.js), inchangé : `Pronoms personnels`,
  `Démonstratifs`, `Verbes modaux`, `Prépositions`, `Conjonctions`,
  `Mots interrogatifs`, `Nombres (0–10)`, `Nombres (11 et plus)`,
  `Nombres ordinaux`, `Jours de la semaine`, `Adverbes`, `Saisons & mois`,
  `Mots de quantité`, `Expressions / Divers`, `Existence et possession`, `Phrases`.
- `sous_theme` requis seulement pour les listes dont au moins une entrée porte déjà
  un champ `groupe` dans `data/listes/<slug>.json` (aujourd'hui : `Adverbes` →
  `Temps` | `Lieu & direction` ; `Saisons & mois` → `Saisons` | `Mois`) — dérivé
  mécaniquement de la donnée, jamais d'une liste codée en dur dans le script.
- **Pas de `theme`** sur une liste (mono-thème par nature ; en poser un = erreur).
- `exemples` optionnel (obligatoire seulement sur les 3 tables).

### 3.6 `exemple` — enrichir un mot **existant**

```json
{ "type": "exemple", "section": "Noms", "cible": "לחם",
  "exemple": { "he": "הַלֶּחֶם טָרִי", "fr": "le pain est frais", "tr": "…(optionnel)" } }
```

- `cible` = `he_plain` (sans niqqud) du mot porteur, résolu **dans la section
  donnée** en comparant `stripNikud(entrée.he)` — seul champ hébreu du schéma
  **exempté** du contrôle de niqqud. Erreur nommée si introuvable ; erreur nommée
  listant les candidats si ambigu (homographes).
- Append d'un objet `{he, tr, fr}` dans le tableau `exemples` de l'entrée visée
  (créé s'il est absent — dans `data/`, `exemples` est toujours un tableau, jamais
  un champ optionnel à créer de toutes pièces).

## 4. Ce que le script construit — l'objet `data/*.json`, plus de gabarit HTML

**Toute la section « gabarits de sortie » de v2 (balisage `<tr>`/`<li>` byte-exact,
règles d'échappement `&`/`<`/`>`, squelette de nouveau sous-thème) a disparu.**
`ajoute_mots.js` construit un objet JS conforme à `data/SCHEMA.md` et l'écrit via
`JSON.stringify(valeur, null, 2) + '\n'` — round-trip byte-identique au format déjà
sur disque (prouvé, task-11-report.md). Composer du HTML, échapper `&`/`<`/`>`,
gérer `lang="he"` : c'est `src/carnet/gabarits.js` qui s'en charge, au moment du
`node tools/build.js` lancé en aval (§7.B) — jamais ce script.

Ordre des champs (mêmes conventions que `data/SCHEMA.md`, respecté pour que le
diff avec l'existant reste minimal) :

- `data/noms.json` : `he, fr, genre, pluriel, niveau, theme, groupe, exemples`.
- `data/adjectifs.json` / `verbes.json` : `he, fr, formes, niveau, theme, groupe, exemples`.
- `data/listes/<slug>.json` (entrée) : `he, tr, fr, niveau, [groupe], exemples, [fr_court], [note]`.

L'invariant headword-avant-exemple (v2 §4.7) n'a plus de sens à ce niveau : c'est
`gabarits.js` qui décide de l'ordre d'affichage à partir de l'objet — le script ne
compose plus rien qui puisse l'inverser.

## 5. Logique de placement

1. **Résoudre la section** : comparaison directe de `op.section` contre les
   constantes de `build.js` (`TABLES` = `Noms`/`Adjectifs`/`Verbes`, ou une clé de
   `listCats` pour une liste) — aucune lecture de fichier, ce sont des constantes.
   Erreur nommée sinon, avec suggestion en cas de quasi-correspondance (typos
   fréquentes normalisées : `-` vs `–`, `&` vs `et`).
2. **Résoudre le groupe/sous-table** :
   - `Adjectifs` et listes mono-groupe : `groupe` fixe (`""` ou absent).
   - `Verbes`, `Noms`, et listes multi-groupes (`Adverbes`, `Saisons & mois`) :
     `groupe = slug(op.sous_theme)` (§1.4), comparé à l'ensemble des `groupe`
     déjà présents dans le tableau/la liste visée. Introuvable ⇒ erreur listant
     les slugs disponibles (dérivés de la donnée au moment de l'exécution, jamais
     codés en dur).
3. **Position — append par défaut, `apres` pour les listes ordonnées** : append =
   `splice` juste après la dernière entrée du même groupe (ou en fin de tableau
   si le groupe n'a pas de notion d'ordre). Trois listes ont un ordre sémantique
   où l'append serait une faute d'édition : `Nombres (0–10)`, `Nombres ordinaux`,
   `Jours de la semaine`. Le champ optionnel `apres` (`he_plain` d'un voisin
   existant) insère juste après ce voisin ; accepté dans toute liste, recommandé
   dans ces trois-là (le verdict le rappelle si on y append sans `apres`).
4. **Multi-opérations** : appliquées dans l'ordre du tableau JSON, sur un clone
   profond de la donnée chargée (`structuredClone`) — jamais sur les fichiers
   avant la preuve bac à sable (§7.B).

Le repérage se fait par **champ `groupe`/`section` de la donnée**, jamais par
numéro de ligne d'un fichier HTML — l'ancienne classe de bogue (ancres qui
dérivent) n'a plus d'existence possible dans ce modèle.

## 6. Invariants préservés (contrôlés par le script, pas par la discipline)

1. **Ne jamais écrire ailleurs que `data/*.json`.** Les trois artefacts dérivés
   (`vocabulaire_hebreu.html`, `cards.json`, `flashcards_hebreu.html`) ne sont
   jamais composés par ce script — seulement régénérés en appelant `node tools/build.js`
   en aval, après vert bac à sable.
2. **`data-niveau` obligatoire** partout ; **`theme` sur les 3 tables
   uniquement**, jamais sur une liste — contrôlé par `valideDonnees` (build.js)
   ET par les contrôles pré-insertion de ce script (double filet, §7).
3. `theme` ∈ `EXPECTED_THEMES` (15), `niveau` ∈ `EXPECTED_LEVELS` (A1/A2/B1/B2) —
   lus depuis `build.js`, pas dupliqués.
4. **Formes complètes** : Verbes 4, Adjectifs 3, toutes avec un `he` non vide
   (§3.3 — plus strict qu'en v2).
5. **≥1 exemple par entrée des 3 tables** (verbe : présent) — sinon
   `verifie_exemples.js` bloque en bac à sable.
6. **`he_plain`/`tr` jamais saisis à la main sans que le script les dérive** : le
   script calcule toujours `stripNikud`/`he2tr`, jamais l'inverse.
7. **Ordre des propriétés stable** dans chaque objet `data/*.json` (§4) — un
   ordre différent romprait le round-trip byte-identique, pas le contenu, mais
   pollue le diff.

## 7. Validations et verdict

### A. Pré-insertion (sur le JSON, échoue tôt, n'écrit rien)

- `type` connu ; champs requis présents ; `niveau`/`theme` dans les constantes de
  `build.js`.
- **Niqqud présent** : chaque `he` (mot, formes, exemples) doit contenir ≥1 signe
  `/[֑-ׇ]/` — sinon erreur nommée.
- Verbe : 4 formes non vides ; adjectif : 3 formes non vides (§3.3) ; nom :
  `genre` ∈ `m`/`f`.
- Section/sous-thème/cible résolus (§5), sinon liste des valeurs valides.
- **Doublon, corpus entier** : `he_plain` déjà présent dans la **même section**
  (même fichier `data/`) ⇒ warning bloquant nommé (mot + fichier), skip sauf
  `--force` ; présent dans une **autre section** ⇒ informatif nommé (« déjà dans
  Verbes modaux, data/listes/verbes-modaux.json ») qui ne bloque pas — arbitrage
  humain, homographes légitimes non interdits. Rend le script idempotent (rejouer
  le même JSON ne double rien).
- **Orthographe voisine** (ktiv male/haser, `orthographeVoisine` de `build.js`) :
  signal informatif seulement, jamais bloquant.
- **Tout ou rien** : validation complète du lot d'abord ; une seule entrée
  invalide ⇒ aucune écriture (jamais de `data/` à demi-modifié).
- **`valideDonnees(candidat)` en process** (nouveau en v3) : une fois le clone
  candidat construit (donnée originale + insertions), le script rappelle
  `valideDonnees` (le même contrôle que `build.js` lance à chaque run) directement
  en process, avant tout bac à sable — filet bon marché contre un bogue de
  construction d'entrée que les contrôles ci-dessus n'auraient pas attrapé.

### B. Post-insertion (la preuve, au niveau le moins cher)

Le bac à sable recrée un **dépôt miniature** dans un répertoire temporaire : les deux
validateurs dans un sous-dossier **`tools/`**, `app.html`, tout `src/` (gabarits +
squelette + `sections/*.html` + `sections.json` + `tokens.css` + `src/app/` + `src/portail/`,
donc le bac à sable régénère son propre `index.html`), les fichiers de la racine que
`build.js` lit du disque — `manifest.webmanifest` (lu par `verifieCharte()`, et haché par
l'estampille) et `sw.js` (la ligne estampillée ; le bac à sable estampille sa copie, jamais
le `sw.js` réel) — et **la donnée candidate sérialisée en `data/*.json`** ; il y
lance ensuite `node tools/build.js` puis `node tools/verifie_exemples.js`. Zéro
modification des validateurs, preuve complète sur le candidat avant de toucher le
dépôt réel.

⚠️ **Deux invariants, chacun payé une fois — un bac à sable faux passe au vert, comme
un témoin muet.**

1. **La disposition `tools/` doit être reproduite.** Depuis le chantier 4 les scripts
   calculent leur racine par `path.join(__dirname, '..')` : copiés *à plat* dans le
   temporaire, ils prendraient `os.tmpdir()` pour racine et vérifieraient tout autre
   chose que le candidat. Éprouvé par casse fabriquée le 25/07 — et l'échec observé est
   **bruyant** (`Cannot find module '../src/carnet/gabarits.js'`, exit 1), non silencieux
   comme le plan du chantier 4 le craignait. Ce bruit vient du `require` relatif de
   `build.js` : c'est un accident heureux, pas une garantie, et l'invariant ne s'appuie
   pas dessus.
2. **Tout fichier de la racine que `build.js` lit du disque doit figurer dans
   `FICHIERS_RACINE_BAC_A_SABLE`** — et rien d'autre : un fichier copié « au cas où »
   ferait croire que le bac à sable en dépend et masquerait la règle. Payé deux fois,
   toujours par un ENOENT au dry-run : le 25/07 `verifieCharte()` a introduit la lecture
   d'`index.html` sans que le bac à sable la suive (cassé jusqu'au Task 17 — et depuis le
   Task 18 `index.html` est SORTI de la liste, le portail étant généré et contrôlé sur la
   chaîne assemblée) ; au Task 19 l'estampille a introduit la lecture — et la réécriture —
   de `sw.js`, absent du temporaire. Ajouter une garde qui lit un fichier racine, c'est
   ajouter ce fichier ici.

### Le contrôle du contrôle (`assertBacASableCoherent`, Task 17)

Le verdict imprimait un compte de cartes calculé **en process**
(`comptes(deriveCartes(candidat))`) : il aurait affiché le bon chiffre même si le bac à
sable avait validé un tout autre arbre — un témoin muet, vert sans rien prouver. Le
script relit donc le `TOTAL <n>` que le **bac à sable lui-même** a imprimé et exige la
concordance avec le compte attendu (`cartes réelles + n` insertions) ; il refuse aussi de
continuer si ce `TOTAL` n'est pas lisible (format de sortie de `build.js` changé). Les
deux branches sont éprouvées par casse fabriquée (25/07, exit 1 réel avec message
nommé) : arbre substitué → « il a compté 1220 cartes, on en attendait 1221 » ; motif
cassé → « impossible de relire son compte de cartes ».

- Bac à sable `node tools/build.js` — compteurs par section, échec nominatif si une
  carte sort sans `niveau`/`theme` ou hors thèmes, ou si la garde anti-perte de
  `genereCarnet` détecte une entrée orpheline.
- Bac à sable `node tools/verifie_exemples.js` — **0 erreur requise**, warnings
  remontés tels quels (signaux éditoriaux).
- En `--ecrire`, après vert bac à sable : écriture des seuls fichiers `data/*.json`
  réellement modifiés, puis `node tools/build.js` **réel** (régénère les trois
  artefacts déployés/dérivés). Si ce build réel échoue (ne devrait jamais arriver
  après un bac à sable vert), rollback des fichiers `data/` modifiés à leur
  contenu d'origine.

## 8. Cas limites

| Cas | Comportement |
| --- | --- |
| Thème inconnu (hors 15) | erreur pré-insertion, liste les 15 slugs, n'écrit rien ; le message documente la procédure d'extension (§10) |
| Niveau hors A1/A2/B1/B2 | erreur pré-insertion ; le message pointe `EXPECTED_LEVELS` (build.js) |
| Niqqud manquant (mot, forme ou exemple) | erreur nommée, n'écrit rien |
| Doublon même section | warning bloquant nommé, skip sauf `--force` |
| Doublon autre section | informatif nommé, ne bloque pas |
| Sous-thème introuvable | erreur + slugs disponibles ; **pas de création automatique** (§10, changement v3) |
| Typo de label de section (`-` vs `–`, `&` vs `et`) | « vouliez-vous dire… », pas d'erreur sèche |
| `theme` sur une liste | erreur (mono-thème par nature) |
| Entrée de table sans exemple | erreur pré-insertion |
| Verbe/adjectif avec forme manquante/vide | erreur — les 4/3 formes sont désormais toutes obligatoires (§3.3) |
| `cible` d'op `exemple` introuvable / ambiguë | erreur nommée ; si ambiguë, liste les candidats |
| `tr` non fourni | dérivé `he2tr`, écrit en dur, listé dans le tableau §2.1 |
| `apres` introuvable dans la liste cible | erreur nommée |
| N opérations, une invalide | tout ou rien : aucune écriture |
| `build.js`/`verifie` échoue après insertion (bac à sable) | rien n'est écrit dans le dépôt réel |
| `build.js` réel échoue après écriture (ne devrait jamais arriver) | rollback des fichiers `data/` modifiés |
| Arbre git sale sur `data/` | warning (le diff du script se mélangerait à autre chose) ; ne bloque pas |

## 9. Interface & sécurité d'écriture

```text
node tools/ajoute_mots.js nouveaux_mots.json              # dry-run (défaut) : valide + verdict + diff, ne touche RIEN
node tools/ajoute_mots.js nouveaux_mots.json --ecrire     # insère dans data/, build, vérifie, garde si vert
node tools/ajoute_mots.js nouveaux_mots.json --ecrire --force   # passe outre les doublons même-section
```

- **Dry-run par défaut** : on voit diff + verdict + tableau des `tr` sans risque ;
  on repasse en `--ecrire` une fois les `tr` relus. (`--ecrire`, pas `--commit` :
  le script ne touche jamais git.)
- **Sécurité** : insertion sur un clone candidat en mémoire ; `build.js` +
  `verifie_exemples.js` tournent contre lui **en bac à sable** (§7.B) ; `data/`
  réel n'est modifié qu'après **vert complet**. Sinon rien n'est écrit, verdict
  d'échec nommé. Prouvé mécaniquement (`git status --porcelain` vide après un
  dry-run, y compris un dry-run avec des insertions en attente — task-11-report.md).
- Le script ne commit pas git et ne met pas à jour la doc — fil principal (rung 4
  de la doctrine). En revanche il n'a plus rien à décider sur `sw.js` : le
  `node tools/build.js` qu'il lance en mode `--ecrire` **estampille `VERSION`**
  lui-même (Task 19), donc les mots neufs atteignent le téléphone au 1ᵉʳ
  lancement. Il reste à committer `sw.js` avec `data/` et les artefacts.

## 10. Hors périmètre — et procédures documentées pour ne pas les re-chercher

- **`--nouveau-sous-theme` (retiré en v3)** : v2 créait un squelette `<h3>` +
  `<table>`/`<ul>` neuf dans le carnet HTML directement. Depuis `build.js` v2, un
  sous-thème neuf exige un `<h3 class="subtheme">` **et** un placeholder
  `<!-- @ENTREES:table#groupe -->` neufs dans le gabarit source
  (`src/carnet/sections/*.html`) — composition de template, l'exact inverse de ce
  que ce script doit désormais faire (§0, §4). Procédure : éditer le gabarit à la
  main, puis relancer `ajoute_mots.js` avec ce `sous_theme` (il sera alors résolu
  normalement, la garde anti-perte de `genereCarnet` confirmant que le placeholder
  consomme bien l'entrée).
- **`--parite` (retiré en v3)** : comparait `deriveCartes` (build.js) à
  l'extraction DOM d'`app.html` via jsdom. Depuis le chantier 2 tâche 8, `app.html`
  ne fait plus aucune extraction — il lit `cards.json` directement. Il n'y a plus
  deux extracteurs à faire converger : le flag n'a plus d'objet.
- **Étage 2** (plus tard) : pré-remplir les champs mécaniques du JSON (pluriel,
  genre, formes, 1ʳᵉ translittération) depuis une source externe **à froid**
  (Pealim/Wiktionnaire en cache), jamais en live. `data/` reste la source unique.
  L'étage 1 prend ces champs comme entrées.
- **Nouveau thème (16ᵉ slug)** : hors périmètre du script — exige d'aligner
  **deux fichiers** : `EXPECTED_THEMES` (build.js) **et** `THEMES` (app.html),
  slugs identiques, avant tout `theme` neuf dans `data/`. Le message d'erreur
  « thème inconnu » récite cette procédure.
- **Nouvelle section** : hors périmètre — exige `listCats` + `EXPECTED_CATS` dans
  `build.js`, un nouveau `data/listes/<slug>.json` et le placeholder `@ENTREES`
  correspondant dans `src/carnet/sections/`. Le message d'erreur la récite.
- **Niveau au-delà de B2** : étendre `EXPECTED_LEVELS` dans `build.js` (commentaire
  en place le prévoit déjà).

## 11. Notes de construction

1. `build.js` v2 exporte déjà tout ce qu'il faut (`chargeDonnees`, `valideDonnees`,
   `deriveCartes`, `genereCarnet`, `NOTEBOOK`, `APP`, `stripNikud`,
   `orthographeVoisine`, `EXPECTED_LEVELS`, `EXPECTED_THEMES`, `listCats`) — rien
   à y ajouter pour ce script. L'ancien parseur regex du carnet HTML
   (`extractCards` + `rowsOf`/`lisOf`) et le mode `node tools/build.js --verrou` ont été
   supprimés à cette même tâche (11), `ajoute_mots.js` en étant le dernier
   consommateur ; les helpers HTML qui survivaient pour les scripts jetables du
   chantier 1 sont partis avec eux au Task 20, exports compris — `build.js`
   n'exporte plus rien qui lise du HTML.
2. `he2tr` : extraction textuelle depuis `app.html` + éval `vm`, en reprenant le
   procédé déjà en place dans `verifie_exemples.js` ; échec bruyant si la fonction
   bouge. `stripNikud` : export de `build.js`, pas d'extraction.
3. `slug()` : même algorithme que celui qui a produit les valeurs `groupe`
   actuelles de `data/` (chantier 1) — voir §1.4. Redéfini
   localement dans `ajoute_mots.js` (fonction à 2 lignes, pas assez pour justifier
   un export de `build.js`, mais **jamais réinventé autrement**.)
4. Rituel post-lot inchangé : le script exécute les étapes 1–2 (build + verifie,
   en bac à sable puis réel) — l'estampille de `VERSION` vient avec le build,
   plus rien à bumper ; commit et doc restent au fil principal.
