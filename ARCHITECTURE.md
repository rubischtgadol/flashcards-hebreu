# Architecture du dépôt

> Vision d'ensemble du fonctionnement du projet. Pour les consignes d'édition destinées à Claude Code, voir [CLAUDE.md](CLAUDE.md) ; pour la présentation utilisateur, voir [README.md](README.md).

## Vue d'ensemble

Un toolkit en français pour apprendre l'hébreu moderne, déployé en **fichiers statiques** sur GitHub Pages (`https://rubischtgadol.github.io/flashcards-hebreu/`).

**Aucune dépendance, aucun test, aucun gestionnaire de paquets.** Chaque fichier déployé est un document HTML autonome (CSS et JS inline, vanilla). Le seul outillage est `build.js`, un script Node zéro-dépendance, utilisé uniquement en développement et jamais déployé.

```
┌─────────────────────────────────────────────────────────────────┐
│                     vocabulaire_hebreu.html                      │
│              LE CARNET — source unique de vérité                 │
│         (grammaire + vocabulaire, ~4900 lignes de HTML)          │
└───────────────┬────────────────────────────────┬────────────────┘
                │ fetch() + extractCards()       │ lu par build.js
                │ au chargement, dans le         │ (réplique regex
                │ navigateur                     │  de extractCards)
                ▼                                ▼
┌───────────────────────────┐    ┌───────────────────────────────┐
│        index.html         │───▶│    flashcards_hebreu.html     │
│  app flashcards EN LIGNE  │    │  app flashcards AUTONOME      │
│  (page principale)        │    │  (hors ligne, double-clic)    │
│                           │    │  = index.html dont le bloc    │
│  bloc BUILD:ONLINE-ONLY   │    │  réseau est remplacé par      │
│  (fetch + extraction)     │    │  const CARDS = [...] intégré  │
└───────────────────────────┘    │  100 % GÉNÉRÉ par build.js —  │
                                 │  ne jamais éditer à la main   │
                                 └───────────────────────────────┘
```

Il n'y a donc **qu'une seule app** (le code d'`index.html`) et **qu'une seule source de contenu** (le carnet). Le fichier autonome est une projection mécanique des deux.

## Les quatre fichiers

| Fichier | Rôle | Édité à la main ? |
|---|---|---|
| [vocabulaire_hebreu.html](vocabulaire_hebreu.html) | Carnet grammaire + vocabulaire. Toute modification de contenu se fait ici. | ✅ oui |
| [index.html](index.html) | App de flashcards en ligne (page principale). Ne contient **pas** de vocabulaire : elle l'extrait du carnet au chargement. | ✅ oui |
| [flashcards_hebreu.html](flashcards_hebreu.html) | Flashcards autonomes hors ligne, vocabulaire intégré. | ❌ **jamais** — généré par `build.js` |
| [build.js](build.js) | Dev only. Régénère le fichier autonome, compte les cartes par section, échoue si une section attendue tombe à 0. | ✅ oui |
| [manifest.webmanifest](manifest.webmanifest), [sw.js](sw.js), `icons/` | Couche PWA : installation (icône א, plein écran) et hors-ligne. | ✅ oui (icônes générées) |

## La couche PWA

L'app en ligne est installable (iPhone : Safari → « Sur l'écran d'accueil ») et fonctionne hors ligne :

- **`manifest.webmanifest`** — nom, `display: standalone`, couleurs de la charte, icônes 192/512. `start_url` et `scope` sont **relatifs** (le site vit sous `/flashcards-hebreu/`).
- **`sw.js`** — service worker en *stale-while-revalidate* : l'app et le carnet sont servis depuis le cache puis rafraîchis en arrière-plan (une mise à jour de contenu est visible au lancement suivant). Les polices Google sont en cache-first. Seules les navigations vers la racine (`/`, `/index.html`) sont rabattues sur la coquille `./` — les autres pages (le carnet !) sont servies telles quelles. Incrémenter `VERSION` en tête de fichier après un changement de stratégie, de liste d'assets ou d'icônes.
- **L'enregistrement du service worker vit DANS le bloc `BUILD:ONLINE-ONLY` d'`index.html`** : le fichier autonome ne doit pas en hériter (inutile hors ligne, et invalide en `file://`).
- Les icônes sont un א en Frank Ruhl Libre 700 (la police du bandeau de l'app) sur fond `--bg`, or `--gold` ; en cas de changement de palette, les régénérer (ImageMagick) et bumper `VERSION`.
- Limite iOS : l'icône d'une PWA déjà installée est figée à l'installation — supprimer/réajouter l'app pour la rafraîchir.

## Charte graphique unifiée

Le bloc `:root` (11 tokens : `--bg`, `--bg2`, `--card`, `--card-edge`, `--ink`, `--ink-dim`, `--gold`, `--gold-soft`, `--green`, `--red`, `--line`) est **identique au caractère près** dans le carnet et `index.html` — le carnet est la référence (`#12181f` / or `#d4a24c`). Toute retouche de couleur se répercute dans les deux fichiers, plus `manifest.webmanifest`/`theme-color`/icônes si le fond ou l'or change.

## Flux de données : du carnet aux cartes

### 1. Le carnet expose une structure conventionnelle

Chaque section du carnet est un `<h2>` contenant un `<span class="count">LABEL</span>`. **Le texte exact du label est la clé d'extraction** (`'Verbes'`, `'Noms'`, `'Nombres (0–10)'`…) : le renommer détache silencieusement la section des flashcards.

Deux formats d'entrées :

- **Tables** (`<table><tbody><tr>`) pour Verbes, Adjectifs, Noms. Lecture **positionnelle** : Verbes exige ≥ 5 colonnes (infinitif + il/elle/ils/elles), Adjectifs ≥ 4 (m. sing. + f. sing./m. plur./f. plur.), Noms ≥ 3 (mot, genre `m`/`f`, pluriel). Ajouter une colonne casse l'extraction.
- **Listes** (`<ul class="word-list"><li>`) pour pronoms, prépositions, nombres, expressions, **phrases**, etc. (voir la map `listCats`). La section **Phrases** (label `.count` = `Phrases`) contient des phrases entières du quotidien : elles deviennent des cartes ordinaires (catégorie `Phrases`) et traversent tous les modes. Ajouter une entrée `listCats` impose de la répercuter dans `build.js` (objet `listCats` **et** `EXPECTED_CATS`).

Les champs sont portés par des spans enfants : `.he` (hébreu avec nikud), `.tr` (translittération), `.fr` (français). Un `<li>` peut porter deux attributs qui pilotent la carte sans toucher au code de l'app :

- `data-fr-court` — français court affiché sur la carte à la place du `.fr` long du carnet ;
- `data-note` — précision affichée sous la réponse.

Les sections purement grammaticales (racine, passé, futur, binyanim, article, smikhut, prépositions fléchies) ont un label `.count` **sans** entrée dans les maps d'extraction : elles sont volontairement exclues des flashcards.

### 2. Deux implémentations de la même extraction (couplage critique)

`extractCards()` existe **deux fois** et doit rester identique en comportement :

- [index.html:1277](index.html#L1277) — version navigateur (DOM, `querySelector`), dans le bloc `BUILD:ONLINE-ONLY` ;
- [build.js:111](build.js#L111) — réplique en parsing regex (pas de DOM sous Node).

Toute modification de l'une doit être miroir dans l'autre. Le garde-fou : `node build.js --check` régénère en mémoire et **compare au byte près** avec `flashcards_hebreu.html` sur disque — toute dérive est détectée.

### 3. Le schéma de carte produit

```js
{
  cat,        // catégorie ('Verbes', 'Noms', 'Nombres', 'Phrases', …)
  he,         // hébreu avec nikud (une phrase entière pour la catégorie 'Phrases')
  tr,         // translittération du carnet ('' pour les cartes issues de tables)
  fr,         // français (préfixé '(infinitif) ' pour les verbes, suffixé ' (m)'/' (f)' pour les noms)
  he_plain,   // he sans nikud (stripNikud)
  note?,      // depuis data-note
  genre?,     // 'm' | 'f' (noms)
  forms?: [{ he, tr, label, he_plain }]  // conjugaisons, accords, pluriel
}
```

Quand `tr` est vide, l'UI génère la translittération à l'affichage via `he2tr(card.he)`. Les cartes de catégorie `Phrases` reçoivent un affichage réduit (`.big-he.phrase` / `.big-fr.phrase`) pour que les longues phrases passent à la ligne proprement.

## build.js : la chaîne de génération

`node build.js` (ou `--check` pour vérifier sans écrire) :

1. Lit le carnet, extrait les cartes, **affiche le compte par section** et sort en erreur si une catégorie de `EXPECTED_CATS` ([build.js:28](build.js#L28)) est vide.
2. Copie `index.html` et applique des remplacements ancrés (`mustReplace`, qui échoue si l'ancre a disparu) :
   - bannière « fichier généré » après le doctype ;
   - suppression du loader, panneau setup visible d'emblée ;
   - `let CARDS = []` → `const CARDS = [...]` (snapshot JSON du vocabulaire) ;
   - bloc `BUILD:ONLINE-ONLY` → démarrage direct (`buildChips()` + `updateStart()`).
3. Vérifie qu'aucune trace du chemin réseau (`fetch(`, `DOMParser`, `extractCards`) ne subsiste dans le fichier généré.

**Règle de travail : lancer `node build.js` après toute édition du carnet ou d'`index.html`**, vérifier les comptes, puis contrôler dans le navigateur que le loader affiche le « N mots chargés » attendu.

## Anatomie d'index.html (~1390 lignes)

Un seul fichier : CSS inline (l. 1–370 env.), puis quatre écrans, puis le JS.

### Écrans

| Écran | Ligne | Rôle |
|---|---|---|
| `#loader` | [index.html:375](index.html#L375) | Spinner pendant le fetch du carnet (absent de la version autonome) |
| `#setup` | [index.html:376](index.html#L376) | « Révision du jour » (SRS), recherche, catégories (chips) et réglages |
| `#study` | [index.html:441](index.html#L441) | La session (carte / saisie / QCM), bouton « ‹ Quitter » |
| `#done` | [index.html:490](index.html#L490) | Bilan + reprise des cartes ratées / de la session |

### Réglages

L'écran setup utilise des toggles segmentés `.chip` portant des `data-*` (`data-mode`, `data-dir`, `data-script`, `data-order`, `data-audio`), câblés par `segPick` ([index.html:666](index.html#L666)) dans l'objet `state` ([index.html:503](index.html#L503)) :

- **mode** : `cards` (recto-verso), `input` (saisie tapée) ou `quiz` (QCM à 4 choix) ;
- **direction** : `he2fr` / `fr2he` ;
- **script** : nikud, sans nikud, ou cursive ;
- **audio** : voix hébraïque de `SpeechSynthesis` du navigateur (`loadVoices`/`speak`).

Chaque mode a sa zone dans `#study` (`#controls-cards` / `#input-zone` / `#quiz-zone`) et un `setup*Card()` qui bascule les classes body `input-mode` / `quiz-mode` ; `render()` aiguille selon `state.mode`. Le passage à la carte suivante est mutualisé (`nextAfterInput`, réutilisé par le QCM). Toutes les entrées de session (catégories, révision, rejeu) passent par `beginSession(pool)` ; `state.origQueue` mémorise le jeu de la session pour que « Recommencer » le rejoue tel quel (jamais un re-filtrage — sinon une session de révision repartirait à vide).

### Révision espacée (système de Leitner)

Couche de mémorisation persistée, **invisible pour `build.js`** (pur état applicatif) :

- `recordResult(card, good)` est appelé depuis **tous** les chemins de réponse (cartes `answer`, saisie `submitAnswer`/`skipAnswer`, QCM `quizPick`) et écrit un enregistrement par carte dans `localStorage`, clé `srs_v1`. Identité d'une carte : `cat|he_plain`.
- Chaque bonne réponse fait monter la carte d'une « boîte » (intervalle croissant, `SRS_INTERVALS`), un échec la remet à zéro. `dueCards()` renvoie les cartes arrivées à échéance ; le bouton « Révision du jour » (`startReview`) en fait une session tous thèmes confondus.
- `refreshSrsUi()` met à jour le compteur de cartes dues et la barre de maîtrise. Il est appelé à la fin de `buildChips()` — donc **dans les deux chemins de démarrage** (en ligne et autonome) sans toucher à `build.js` — ainsi qu'après chaque session.

### Persistance des réglages et reprise de session

Deux couches d'état applicatif, elles aussi **invisibles pour `build.js`**, restaurées via `buildChips()` (donc les deux chemins de démarrage) :

- **Préférences** (`localStorage`, clé `prefs_v1`) : `{cats, mode, dir, script, order, audio}`. `savePrefs()` est déclenché à chaque changement (`segPick`, chips de catégories, « tout sélectionner ») ; `applyPrefs()` restaure l'état **et** le reflète dans l'UI (`aria-pressed`). Au **premier lancement** (aucune préférence), tout est sélectionné — le bouton « Commencer » n'est donc jamais muet. `updateStart()` affiche l'indice « Choisis au moins une catégorie » et désactive le CTA quand la sélection est vide.
- **Instantané de session** (`sessionStorage`, clé `sess_v1`) : `{queueIds, origIds, missedIds, idx, goodCount, total, session, mode, dir, script}`. `sessSave()` est appelé à chaque avancée (`render`) et réponse ; `sessRestore()` reconstruit la file par id de carte (`cat|he_plain`) et rouvre `#study` directement. Si le vocabulaire a changé sous la session (un id manque, `idx` hors limites), la session est **abandonnée proprement** (`sessClear()`). Effacé à la fin (`finish`), à « Quitter » (`exit`) et au retour au menu (`back-setup`).
- **Verdict annulable** : `recordResult` mémorise l'entrée SRS d'avant écriture (`lastRecord`) ; en mode saisie, le bouton « Corriger » (`fixVerdict`) restaure cet état (`undoLastRecord`), ré-enregistre le verdict inverse et rééquilibre `goodCount`/`missed`.
- **Écran d'erreur du loader** (`showLoaderError`, dans le bloc `BUILD:ONLINE-ONLY`) : diagnostic distinguant fichier local (`file://`), perte réseau et indisponibilité, avec un bouton « Réessayer » qui relance `init()`.

### Correction des réponses tapées (la logique la plus délicate)

`checkAnswer` ([index.html:1072](index.html#L1072)) corrige avec tolérance :

- **Direction hébreu → français** : `normFr` retire accents et casse ; `frVariants` éclate le champ français sur `/`, virgules, parenthèses et articles, pour accepter plusieurs formulations.
- **Direction français → hébreu** : accepte **soit** du vrai hébreu (clavier virtuel israélien intégré, rangées définies à [index.html:1173](index.html#L1173)), comparé sans nikud (`normHe`), **soit** une translittération « à la française ». Celle-ci est repliée en clé canonique par `trKey` ([index.html:1065](index.html#L1065)) — `ph→f`, `kh/ch→h`, `q→k`, `w→v`, `tz/ts`, `ou→u`, apostrophes ignorées, doublons réduits — et comparée à `he2tr(card.he)` ([index.html:1003](index.html#L1003)), le générateur hébreu→translittération piloté par le nikud, avec une petite tolérance de Levenshtein (`editDist`).

⚠️ `trKey` et `he2tr` doivent **converger vers la même forme canonique** : toute modification de l'acceptation se fait dans les deux ensemble. Et `he2tr` sert aussi à l'**affichage** dès qu'une carte n'a pas de `tr` de carnet.

### Le standard de translittération

Les `.tr` du carnet et la sortie de `he2tr` suivent la même convention (validée le 2026-07-17) : **kh** = khaf sans daguech, **ch** = het (avec patach furtif final → `ach`), **ts** = tsadi, **`'`** = ayin partout (`'ivrit`, `be'er`, `rega'`, patach furtif → `'a` : `yode'a`) et alef entre deux voyelles (`tsme'ah`), **hé final conservé** (`atah`, `zeh`), **ei** = tsere/segol + yud (`beit`), `u` (jamais `ou`), `f` (jamais `ph`), `k` (jamais `q`), `v` (jamais `w`). Le shva initial d'un groupe de consonnes n'est écrit que s'il s'entend (`gdolim` mais `ledaber`) — c'est la seule zone de jugement humain, le carnet fait foi. Grâce aux replis de `trKey`, ce standard est purement d'affichage : la saisie tolère toutes les variantes.

## Garde-fous contre la casse silencieuse

L'extraction étant couplée au markup du carnet, trois filets détectent les cartes perdues :

1. **`init()` dans index.html** ([index.html:1345](index.html#L1345)) : avertit (console + écran setup) si une catégorie attendue donne 0 carte au chargement.
2. **`node build.js`** : compte par section, sortie non-zéro si une section de `EXPECTED_CATS` est vide, ancres `mustReplace` qui échouent bruyamment.
3. **`node build.js --check`** : détecte la dérive entre les deux implémentations d'`extractCards` et un fichier autonome obsolète (comparaison byte à byte).

## Développement et déploiement

- **Servir en HTTP** : `index.html` fait un `fetch()`, donc `file://` ne marche pas. Depuis la racine : `python3 -m http.server` puis `http://localhost:8000/`. (Le fichier autonome, lui, s'ouvre en double-clic.)
- **Vérification sans navigateur** (WSL sans Chrome headless, y compris réseau coupé) : Node dans le scratchpad — `build.js --check` pour la cohérence, `node --check` sur le JS extrait pour la syntaxe, et de petits harnais à stubs pour la logique pure (Leitner, distracteurs QCM, navigation).
- **Déployer** = pousser sur `main` : GitHub Pages resert les fichiers tels quels, mêmes URL. Aucune étape de build côté CI — `flashcards_hebreu.html` doit donc être régénéré **et commité** avec les sources.
- **Langue** : toute l'UI et la doc sont en français ; s'y tenir pour les chaînes visibles.

## Check-list d'une modification de contenu

1. Éditer `vocabulaire_hebreu.html` (et lui seul pour le vocabulaire).
2. `node build.js` — vérifier les comptes par section.
3. Ouvrir `http://localhost:8000/` — vérifier « N mots chargés » et la carte concernée.
4. Committer le carnet **et** `flashcards_hebreu.html` régénéré, pousser sur `main`.
