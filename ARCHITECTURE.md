# Architecture du dépôt

> Vision d'ensemble du fonctionnement du projet. Pour les consignes d'édition destinées à Claude Code, voir [CLAUDE.md](CLAUDE.md) ; pour la présentation utilisateur, voir [README.md](README.md).

## Vue d'ensemble

Un toolkit en français pour apprendre l'hébreu moderne, déployé en **fichiers statiques** sur GitHub Pages (`https://rubischtgadol.github.io/flashcards-hebreu/`).

**Aucune dépendance, aucun test, aucun gestionnaire de paquets.** Chaque fichier déployé est un document HTML autonome (CSS et JS inline, vanilla). Le seul outillage est `build.js` et `verifie_exemples.js`, deux scripts Node zéro-dépendance, utilisés uniquement en développement et jamais déployés.

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
│         app.html          │───▶│    flashcards_hebreu.html     │
│  app flashcards EN LIGNE  │    │  app flashcards AUTONOME      │
│  (derrière le portail     │    │  (hors ligne, double-clic)    │
│   index.html à la racine) │    │  = app.html dont le bloc      │
│  bloc BUILD:ONLINE-ONLY   │    │  réseau est remplacé par      │
│  (fetch + extraction)     │    │  const CARDS = [...] intégré  │
└───────────────────────────┘    │  100 % GÉNÉRÉ par build.js —  │
                                 │  ne jamais éditer à la main   │
                                 └───────────────────────────────┘
```

Il n'y a donc **qu'une seule app** (le code d'`app.html`, la racine étant un portail léger) et **qu'une seule source de contenu** (le carnet). Le fichier autonome est une projection mécanique des deux.

## Les fichiers

| Fichier | Rôle | Édité à la main ? |
|---|---|---|
| [vocabulaire_hebreu.html](vocabulaire_hebreu.html) | Carnet grammaire + vocabulaire. Toute modification de contenu se fait ici. | ✅ oui |
| [index.html](index.html) | Le **portail** : la porte d'entrée à la racine — deux portes (flashcards, carnet), salut aléatoire français/hébreu. Sans vocabulaire ni couplage build. | ✅ oui |
| [app.html](app.html) | App de flashcards en ligne. Ne contient **pas** de vocabulaire : elle l'extrait du carnet au chargement. | ✅ oui |
| [flashcards_hebreu.html](flashcards_hebreu.html) | Flashcards autonomes hors ligne, vocabulaire intégré. | ❌ **jamais** — généré par `build.js` |
| [build.js](build.js) | Dev only. Régénère le fichier autonome, compte les cartes par section, échoue si une section attendue tombe à 0. | ✅ oui |
| [verifie_exemples.js](verifie_exemples.js) | Dev only. Filet de sécurité des exemples en situation (champs, longueur, nikoud, translittération concordante avec l'appli, vocabulaire ≤ niveau). | ✅ oui |
| [manifest.webmanifest](manifest.webmanifest), [sw.js](sw.js), `icons/` | Couche PWA : installation (icône א, plein écran) et hors-ligne. | ✅ oui (icônes générées) |

## La couche PWA

L'app en ligne est installable (iPhone : Safari → « Sur l'écran d'accueil ») et fonctionne hors ligne :

- **`manifest.webmanifest`** — nom, `display: standalone`, couleurs de la charte, icônes 192/512. `start_url` et `scope` sont **relatifs** (le site vit sous `/flashcards-hebreu/`).
- **`sw.js`** — service worker en *stale-while-revalidate* : l'app et le carnet sont servis depuis le cache puis rafraîchis en arrière-plan (une mise à jour de contenu est visible au lancement suivant). Les polices Google sont en cache-first. Seules les navigations vers la racine (`/`, `/index.html`) sont rabattues sur la coquille `./` — le **portail** — les autres pages (le carnet !) sont servies telles quelles. Incrémenter `VERSION` en tête de fichier après un changement de stratégie, de liste d'assets ou d'icônes.
- **L'enregistrement du service worker vit DANS le bloc `BUILD:ONLINE-ONLY` d'`app.html`** : le fichier autonome ne doit pas en hériter (inutile hors ligne, et invalide en `file://`). Le portail (`index.html`) porte son propre petit script d'enregistrement.
- **`start_url` pointe sur `./app.html`** : l'icône installée ouvre directement l'appli, sans passer par le portail. (Une PWA installée avant le portail garde son ancien `start_url` — la réinstaller une fois.)
- Les icônes sont un א en Frank Ruhl Libre 700 (la police du bandeau de l'app) sur fond `--bg`, or `--gold` ; en cas de changement de palette, les régénérer (ImageMagick) et bumper `VERSION`.
- Limite iOS : l'icône d'une PWA déjà installée est figée à l'installation — supprimer/réajouter l'app pour la rafraîchir.

## Charte graphique unifiée

Le bloc `:root` (11 tokens : `--bg`, `--bg2`, `--card`, `--card-edge`, `--ink`, `--ink-dim`, `--gold`, `--gold-soft`, `--green`, `--red`, `--line`) est **identique au caractère près** dans le carnet, `app.html` et le portail — le carnet est la référence (`#12181f` / or `#d4a24c`). Toute retouche de couleur se répercute dans les trois fichiers, plus `manifest.webmanifest`/`theme-color`/icônes si le fond ou l'or change.

## Flux de données : du carnet aux cartes

### 1. Le carnet expose une structure conventionnelle

Chaque section du carnet est un `<h2>` contenant un `<span class="count">LABEL</span>`. **Le texte exact du label est la clé d'extraction** (`'Verbes'`, `'Noms'`, `'Nombres (0–10)'`…) : le renommer détache silencieusement la section des flashcards.

Deux formats d'entrées :

- **Tables** (`<table><tbody><tr>`) pour Verbes, Adjectifs, Noms. Lecture **positionnelle** : Verbes exige ≥ 5 colonnes (infinitif + il/elle/ils/elles), Adjectifs ≥ 4 (m. sing. + f. sing./m. plur./f. plur.), Noms ≥ 3 (mot, genre `m`/`f`, pluriel). Ajouter une colonne casse l'extraction.
- **Listes** (`<ul class="word-list"><li>`) pour pronoms, prépositions, nombres, expressions, **phrases**, etc. (voir la map `listCats`). La section **Phrases** (label `.count` = `Phrases`) contient des phrases entières du quotidien : elles deviennent des cartes ordinaires (catégorie `Phrases`) et traversent tous les modes. Ajouter une entrée `listCats` impose de la répercuter dans `build.js` (objet `listCats` **et** `EXPECTED_CATS`).

Les champs sont portés par des spans enfants : `.he` (hébreu avec nikud), `.tr` (translittération), `.fr` (français). Un `<li>` peut porter des attributs qui pilotent la carte sans toucher au code de l'app :

- `data-fr-court` — français court affiché sur la carte à la place du `.fr` long du carnet ;
- `data-note` — précision affichée sous la réponse ;
- `data-niveau` — niveau CECRL fin (`A1`…`C2`) du mot, porté aussi par les `<tr>` des trois tables (voir § 4). Attribut **optionnel** : un mot sans niveau reste visible quel que soit le filtre de l'app — le carnet peut s'annoter progressivement sans jamais perdre une carte.

Un mot peut aussi porter des **exemples en situation** (voir § 5) : une sous-liste `<ul class="exemples"><li>` — chaque `<li>` avec les spans `.he`/`.tr`/`.fr` habituels — imbriquée **dans le `<li>` du mot** (sections listes) ou **en fin de première cellule** des tables (après les spans du mot : l'extraction lit toujours le *premier* `.he`/`.fr` du fragment, l'ordre est donc significatif). ⚠️ Ces `<li>` imbriqués interdisent les regex non-gourmandes : `lisOf` (build.js) délimite les `<li>` de premier niveau par balayage à profondeur, et le DOM d'app.html utilise `ul.word-list > li` (enfant direct). Toute évolution du parsing doit préserver cette robustesse.

Les sections purement grammaticales (racine, passé, futur, binyanim, article, smikhut, prépositions fléchies) ont un label `.count` **sans** entrée dans les maps d'extraction : elles sont volontairement exclues des flashcards.

### 2. Deux implémentations de la même extraction (couplage critique)

`extractCards()` existe **deux fois** et doit rester identique en comportement :

- [app.html:1982](app.html#L1982) — version navigateur (DOM, `querySelector`), dans le bloc `BUILD:ONLINE-ONLY` ;
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
  niveau?,    // depuis data-niveau ('A1'…'C2' — absent si le mot n'est pas classé)
  exemples?: [{ he, tr, fr, he_plain }], // phrases en situation (ul.exemples du carnet)
  genre?,     // 'm' | 'f' (noms)
  forms?: [{ he, tr, label, he_plain }]  // conjugaisons, accords, pluriel
}
```

⚠️ L'**ordre d'insertion des propriétés** doit rester identique entre les deux extracteurs : le snapshot embarqué est comparé au byte près par `--check`, un simple `niveau` posé avant `forms` d'un côté et après de l'autre casse la vérification.

Quand `tr` est vide, l'UI génère la translittération à l'affichage via `he2tr(card.he)`. Les cartes de catégorie `Phrases` reçoivent un affichage réduit (`.big-he.phrase` / `.big-fr.phrase`) pour que les longues phrases passent à la ligne proprement.

### 4. Les niveaux de difficulté (CECRL)

Le carnet stocke le **CECRL fin** (six valeurs, `data-niveau="A1"…"C2"`) — standard, vérifiable contre des listes de référence — et l'app le replie en quatre libellés (table `NIVEAUX` d'app.html) : **Facile = A1, Intermédiaire = A2–B1, Difficile = B2–C1, Expert = C2**. Les chips de l'accueil sont construites depuis les données (`buildNivChips`) : un niveau vide n'affiche pas de chip — le carnet actuel n'ayant rien au-delà de B2, « Expert » n'apparaîtra qu'avec les premiers mots C2 ; un carnet sans aucun `data-niveau` masque le groupe entier.

**Méthode de classement** (passe initiale du 2026-07-18, 709 mots, distribution A1 327 / A2 268 / B1 107 / B2 7) — trois critères croisés, dans cet ordre :

1. **Curricula d'hébreu L2 alignés CECRL** : le vocabulaire des niveaux d'oulpan (alef ≈ A1–A2, bet ≈ B1) et des manuels d'hébreu moderne pour débutants ; les listes de survie (salutations, nombres, jours, famille proche, nourriture de base) sont A1 par convention.
2. **Fréquence en hébreu moderne parlé** : un mot du top courant de la conversation quotidienne descend d'un cran (ex. `lehargish`, `beseder`), un mot rare ou littéraire monte (`tachat` littéraire → B2, `be'ad` → B2).
3. **Jugement quotidien vs abstrait/idiomatique** : concret du quotidien ≤ A2 ; abstractions (`emet`, `matarah`, `regesh`) ≥ B1 ; argot fin (`valah`) et mots de précision (`mikhshol`, `tsiporen`) B2.

Les cas limites se tranchent vers le bas (l'app sert des débutants : mieux vaut découvrir un mot « trop tôt » que de ne jamais le croiser). La relecture humaine se fait par échantillons, section par section — le classement vit dans le carnet, donc se corrige comme le reste du contenu : en éditant l'attribut, puis `node build.js`.

### 5. Les exemples en situation

Chaque exemple est une phrase **écrite et affichée** — hébreu avec nikud, translittération au standard maison, français — jamais portée par le seul audio (PRODUCT.md : l'aisance orale est le but, le texte reste le vecteur). Côté app, le pli « Voir un exemple » (`exHtml`/`exBind` dans app.html) n'apparaît que là où la réponse est déjà visible : verso des Cartes, feedback de Saisie, verdict du QCM — jamais côté recto en fr→he (l'exemple contient le mot). Le tiroir de la recherche les affiche aussi (`srd-ex`). Le libellé du pli suit son état (« Voir un exemple » ↔ « Masquer l'exemple », géré dans `exActivate`). Un bouton Écouter par exemple lit la phrase entière (masqué sous `no-he-voice`). La délégation d'événements suit le motif `bindTap` avec `stopPropagation` — sans lui, toucher le pli retournerait la carte.

**Ligne éditoriale** (lot pilote du 2026-07-18 : 77 exemples sur les mots A1 — verbes, modaux, quantité, adjectifs courants) : phrases courtes (3–8 mots — les phrases nominales de 3 mots sont idiomatiques, l'hébreu n'a pas de « être » au présent), présent, vocabulaire de l'exemple ≤ niveau du mot autant que possible (les niveaux de § 4 disent par où commencer), une situation concrète du quotidien par phrase. **Workflow des lots** (décision du 2026-07-18) : les lots suivants s'écrivent sans relecture humaine — chaque lot doit passer `node verifie_exemples.js` (0 erreur ; les avertissements sont des signaux éditoriaux à arbitrer), puis `node build.js`, avant commit.

## build.js : la chaîne de génération

`node build.js` (ou `--check` pour vérifier sans écrire) :

1. Lit le carnet, extrait les cartes, **affiche le compte par section, par niveau CECRL et par section d'exemples** et sort en erreur si une catégorie de `EXPECTED_CATS` ([build.js:28](build.js#L28)) ou un niveau de `EXPECTED_LEVELS` est vide.
2. Copie `app.html` et applique des remplacements ancrés (`mustReplace`, qui échoue si l'ancre a disparu) :
   - bannière « fichier généré » après le doctype ;
   - suppression du loader, panneau setup visible d'emblée ;
   - `let CARDS = []` → `const CARDS = [...]` (snapshot JSON du vocabulaire) ;
   - bloc `BUILD:ONLINE-ONLY` → démarrage direct (`buildChips()` + `updateStart()`).
3. Vérifie qu'aucune trace du chemin réseau (`fetch(`, `DOMParser`, `extractCards`) ne subsiste dans le fichier généré.

**Règle de travail : lancer `node build.js` après toute édition du carnet ou d'`app.html`**, vérifier les comptes, puis contrôler dans le navigateur que le loader affiche le « N mots chargés » attendu.

## Anatomie d'app.html (~2140 lignes)

Un seul fichier : CSS inline (l. 1–400 env.), puis quatre écrans, puis le JS.

### Écrans

| Écran | Ligne | Rôle |
|---|---|---|
| `#loader` | [app.html:489](app.html#L489) | Spinner pendant le fetch du carnet (absent de la version autonome) |
| `#setup` | [app.html:490](app.html#L490) | « Révision du jour » (SRS) en tête, recherche sous la barre de maîtrise, catégories (chips), réglages — Ordre/Longueur/Prononciation repliés dans le `<details>` « Réglages avancés » ([app.html:551](app.html#L551)) |
| `#study` | [app.html:604](app.html#L604) | La session (carte / saisie / QCM), bouton « ‹ Quitter » |
| `#done` | [app.html:660](app.html#L660) | Bilan + liste des cartes ratées (`#missed-list`) + reprise des ratées / de la session |

### Réglages

L'écran setup utilise des toggles segmentés `.chip` portant des `data-*` (`data-mode`, `data-dir`, `data-script`, `data-order`, `data-audio`, `data-len`), câblés en boucle sur `SEG_KEYS` par `segPick(container, key, btn)` ([app.html:994](app.html#L994)) dans l'objet `state` ([app.html:674](app.html#L674)). Chaque groupe est un `role="group"` relié à son `<h2>` (`aria-labelledby`, notes en `aria-describedby`). Les trois groupes « qu'on règle une fois » (Ordre, Longueur, Prononciation) vivent repliés dans le `<details class="adv">` « Réglages avancés », fermé par défaut ; sous `@media (pointer:coarse)`, le bouton « Commencer » est `position:sticky` en bas d'écran (zone du pouce), l'indice de sélection vide étant placé **au-dessus** de lui pour rester visible. Détail des clés :

- **mode** : `cards` (recto-verso), `input` (saisie tapée) ou `quiz` (QCM à 4 choix — `pickDistractors` ([app.html:1237](app.html#L1237)) pioche d'abord dans la même catégorie et **écarte tout candidat dont une variante française frôle celles déjà retenues** (égalité ou Levenshtein ≤ 1) : pas de quasi-synonymes entre les options, et en fr→he pas de « deuxième bonne réponse » ; un dernier recours relâché garantit 4 options ; les options de la catégorie « Phrases » portent la classe `.qc.ph` — corps réduit et boutons resserrés, pour que quatre phrases complètes empilées restent lisibles sur petit écran) ;
- **direction** : `he2fr` / `fr2he` ;
- **niveau** (hors `SEG_KEYS` — multi-sélection comme les catégories) : le groupe « Niveau » (`#niv`, chips construites par `buildNivChips`) filtre le pool de `start()` en **croisement** avec les catégories (`nivOk(card)`). La « Révision du jour » l'ignore volontairement : une carte apprise reste due quel que soit le filtre. `updateStart()` distingue trois vides — aucune catégorie, aucun niveau, croisement sans carte — avec un indice dédié pour chacun ;
- **script** : nikud, sans nikud, ou cursive ;
- **audio** : voix hébraïque de `SpeechSynthesis` du navigateur (`loadVoices`/`speak`). Deux valeurs : « Au clic » (seul le bouton haut-parleur déclenche la lecture) et « Automatique » (lecture au rendu de la carte et à la révélation de l'hébreu) — le réglage est respecté dans **tous** les chemins de réponse. Sans voix hébraïque détectée, `reflectVoiceUi()` pose `body.no-he-voice` (boutons haut-parleur masqués) **et** désactive les chips « Prononciation » ; quand une voix est trouvée, la note du groupe affiche **son nom réel** (« Voix hébraïque détectée ✓ — Carmit (Enhanced) ») — premier outil de diagnostic quand la synthèse sonne robotique ;
- **longueur** (`state.len` : `'10'|'20'|'50'|'all'`, défaut `'20'`) : `limitPool()` tronque le jeu **après** le mélange dans `start()` (aléatoire = pioche différente à chaque session ; dans l'ordre = les N premières). `startReview()` l'applique aussi, après tri des cartes dues par retard décroissant — le reste demeure dû et réapparaît sur la carte de révision (sous-titre explicite quand dû > limite). « Rejouer les ratées » n'est volontairement **jamais** limité.

Chaque mode a sa zone dans `#study` (`#controls-cards` / `#input-zone` / `#quiz-zone`) et un `setup*Card()` qui bascule les classes body `input-mode` / `quiz-mode` ; `render()` aiguille selon `state.mode`. Le passage à la carte suivante est mutualisé (`nextAfterInput`, réutilisé par le QCM). Toutes les entrées de session (catégories, révision, rejeu) passent par `beginSession(pool)` ; `state.origQueue` mémorise le jeu de la session pour que « Recommencer » le rejoue tel quel (jamais un re-filtrage — sinon une session de révision repartirait à vide).

### Révision espacée (système de Leitner)

Couche de mémorisation persistée, **invisible pour `build.js`** (pur état applicatif) :

- `recordResult(card, good)` est appelé depuis **tous** les chemins de réponse (cartes `answer`, saisie `submitAnswer`/`skipAnswer`, QCM `quizPick`) et écrit un enregistrement par carte dans `localStorage`, clé `srs_v1`. Identité d'une carte : `cat|he_plain`.
- Chaque bonne réponse fait monter la carte d'une « boîte » (intervalle croissant, `SRS_INTERVALS`), un échec la remet à zéro. `dueCards()` renvoie les cartes arrivées à échéance ; le bouton « Révision du jour » (`startReview`) en fait une session tous thèmes confondus.
- `refreshSrsUi()` met à jour le compteur de cartes dues et la barre de maîtrise. Il est appelé à la fin de `buildChips()` — donc **dans les deux chemins de démarrage** (en ligne et autonome) sans toucher à `build.js` — ainsi qu'après chaque session.

### Persistance des réglages et reprise de session

Deux couches d'état applicatif, elles aussi **invisibles pour `build.js`**, restaurées via `buildChips()` (donc les deux chemins de démarrage) :

- **Préférences** (`localStorage`, clé `prefs_v1`) : `{cats, niveaux, mode, dir, script, order, audio, len}` — `niveaux` est **rétro-compatible** : absent des anciennes préférences (ou vidé), il redevient « tout sélectionné », rien ne disparaît. `savePrefs()` est déclenché à chaque changement (`segPick`, chips de catégories, « tout sélectionner ») ; `applyPrefs()` restaure l'état **et** le reflète dans l'UI (`aria-pressed`). Au **premier lancement** (aucune préférence), `defaultCats()` sélectionne **tout sauf « Phrases »** — le bouton « Commencer » n'est jamais muet, mais un débutant ne tombe pas sur une phrase complète d'entrée (« tout sélectionner » les ramène ; des préférences sauvegardées restent intactes). `updateStart()` affiche l'indice « Choisis au moins une catégorie » et désactive le CTA quand la sélection est vide.
- **Instantané de session** (`sessionStorage`, clé `sess_v1`) : `{queueIds, origIds, missedIds, idx, goodCount, total, session, mode, dir, script}`. `sessSave()` est appelé à chaque avancée (`render`) et réponse ; `sessRestore()` reconstruit la file par id de carte (`cat|he_plain`) et rouvre `#study` directement. Si le vocabulaire a changé sous la session (un id manque, `idx` hors limites), la session est **abandonnée proprement** (`sessClear()`). Effacé à la fin (`finish`), à « Quitter » (`exit`) et au retour au menu (`back-setup`).
- **Verdict annulable dans les trois modes** (un pouce qui glisse ne doit pas polluer les boîtes de Leitner) : `recordResult` mémorise l'entrée SRS d'avant écriture (`lastRecord`), que `undoLastRecord` restaure. En **saisie**, `fixVerdict` (« J'avais juste → » après un raté, « En fait, je ne savais pas » après un juste ou un « Presque ») ré-enregistre le verdict inverse et rééquilibre `goodCount`/`missed`. En **QCM**, `quizFixVerdict` ([app.html:1319](app.html#L1319)) fait de même via le bouton `#quiz-fix` (mêmes libellés), qui se fige en confirmation (`✓ Compté comme réussi` / `✗ À revoir`) et s'annonce dans `#quiz-live`. En **Cartes**, la carte suivante étant déjà affichée, `undoCardAnswer` ([app.html:1548](app.html#L1548)) revient en arrière via l'instantané `cardsUndo` posé par `answer()` : SRS restauré, `goodCount`/`missed`/`idx` réalignés, bouton « ‹ Annuler la dernière réponse » visible seulement quand un retour est possible. `beginSession` remet `cardsUndo`/`lastRecord` à zéro. En saisie, **Entrée/Vérifier sur champ vide est un no-op** (ni raté compté, ni écriture SRS — « Je ne sais pas » reste le geste volontaire).
- **Sortie explicite** : « Quitter » affiche sur l'accueil la ligne `#exit-note` (`role="status"`) « Session interrompue — X réponse(s) sur Y déjà comptée(s) dans ta révision » quand au moins une réponse a été donnée (les réponses sont déjà en SRS — le dire) ; masquée au démarrage suivant. Sur l'écran de fin, « Recommencer » est libellé « Rejouer ces N cartes » (même tirage `origQueue`), et une fin de **révision** avec ratées explique qu'elles sont aussitôt redevenues dues (effet Sisyphe du compteur, pas un bug).
- **Remise à zéro du profil** : la zone « Repartir de zéro » ferme le pli « Réglages avancés » (action rare et destructrice — jamais en concurrence avec « Commencer » ni la révision du jour ; le sous-titre du pli continue de n'annoncer que les valeurs mémorisées). Deux temps obligatoires : le bouton `#reset-btn` ouvre un bloc de confirmation qui **nomme la perte** (nombre de cartes suivies, via `masteryStats().seen`), « Annuler » est le défaut sûr et reçoit le focus. Confirmer efface `srs_v1`, `prefs_v1` (localStorage) et `sess_v1` (sessionStorage), remet en mémoire `SRS={}`, `lastRecord`/`cardsUndo` à `null` **et les six clés de réglage de `state` à leurs valeurs initiales** (`applyPrefs()` sans préférences ne les touche pas), puis rafraîchit l'UI en place — `applyPrefs()` (catégories = tout sauf « Phrases », niveaux = tous), `refreshSrsUi()`, `updateStart()`, `#exit-note` masqué — sans recharger la page. Une ligne `role="status"` (`#reset-done`) annonce « Profil effacé », et le focus revient sur le bouton d'appel.
- **Écran d'erreur du loader** (`showLoaderError`, dans le bloc `BUILD:ONLINE-ONLY`) : diagnostic distinguant fichier local (`file://`), perte réseau et indisponibilité, avec un bouton « Réessayer » qui relance `init()`.

### Accessibilité (invariants)

- Tout hébreu généré porte `lang="he"` (`.big-he`, `.sub-he`, `.cursive-line`, `.f-he`, `.qc-he`, `.sr-he`, `.srd-he`, `.answer .he`, `.m-he` de la liste des ratées, marque) — à préserver dans les gabarits de chaînes.
- Focus clavier : un seul anneau global `:focus-visible` doré (aucun `outline:none` nu).
- Annonces aux lecteurs d'écran : `#feedback` (`aria-live`), `#quiz-live` (verdict QCM masqué visuellement, écrit dans `quizPick`/`quizFixVerdict`, vidé dans `setupQuizCard`), `#flip-live` (**verso du mode Cartes** — français + translittération, plus l'annonce « exemple disponible » quand la carte en a, alimenté par `doFlip()`, vidé au recto et à chaque nouvelle carte), `#done-msg`, `#loader-msg` et `#exit-note` (`role="status"`) ; `.bar` est un `role="progressbar"` mis à jour dans `render()`/`finish()`.
- Clavier, à égalité entre les modes : Cartes = Espace retourner, ←/→ juger ; Saisie = Entrée vérifier/passer ; **QCM = 1–4 choisir, Entrée/Espace « Suivant »** (un bouton focalisé garde la main) ; **P « prononcer »** rejoue l'audio dans tous les modes, aux mêmes conditions de visibilité que le bouton haut-parleur (jamais avant la réponse en fr→he, jamais sans voix) ; **C « corriger »** active le bouton de correction du mode courant (« Corriger » en Saisie et QCM, « Annuler la dernière réponse » en Cartes), seulement quand il est visible et actif — P et C ignorent les combinaisons Ctrl/Cmd/Alt (copier, imprimer restent au navigateur). L'indice `#kbd-hint` s'adapte au mode (masqué en saisie), sa mention de P disparaissant sous `body.no-he-voice` (`.spk-hint`).
- Groupes de réglages : chaque `.seg` (et `#cats`) est un `role="group"` + `aria-labelledby` vers son `<h2>` ; le pli « Réglages avancés » est un `<details>/<summary>` natif (clavier et lecteurs d'écran gérés par le navigateur).
- Recherche au clavier : `.sr-row` en `role="button"` + `tabindex="0"` + `keydown` (un vrai `<button>` est impossible : le bouton Écouter est imbriqué dedans), `aria-expanded` sur les lignes dépliables ; **une action par geste** : une ligne dépliable se contente de (dé)plier — l'audio reste sur son bouton Écouter — et une ligne sans détail prononce le mot ; la requête est échappée (`escapeHtml`) dans le message « Aucun résultat ».
- Cibles tactiles : `.search-clear` et `.sr-speak` 44 px, `.exit` `min-height:44px`, chips élargies sous `@media (pointer:coarse)` (densité bureau inchangée).

### Correction des réponses tapées (la logique la plus délicate)

`checkAnswer` ([app.html:1657](app.html#L1657)) corrige avec tolérance et renvoie `'exact'`, `'almost'` ou `false` (toute valeur non-false = réponse acceptée) :

- **Direction hébreu → français** : `normFr` retire accents et casse ; `frVariants` éclate le champ français sur `/`, virgules, parenthèses et articles, pour accepter plusieurs formulations.
- **Direction français → hébreu** : accepte **soit** du vrai hébreu (clavier virtuel israélien intégré, rangées définies à [app.html:1801](app.html#L1801)), comparé sans nikud (`normHe`), **soit** une translittération « à la française ». Celle-ci est repliée en clé canonique par `trKey` ([app.html:1649](app.html#L1649)) — `ph→f`, `kh/ch→h`, `q→k`, `w→v`, `tz/ts`, `ou→u`, apostrophes ignorées, doublons réduits — et comparée à `he2tr(card.he)` ([app.html:1587](app.html#L1587)), le générateur hébreu→translittération piloté par le nikud, avec une petite tolérance de Levenshtein (`editDist`).
- **Pédagogie du verdict** : `'almost'` (accepté uniquement grâce à la tolérance `editDist`) fait afficher par `showInputFeedback` le verdict « ✓ Presque ! La forme exacte : » — vert, tentative affichée non barrée pour comparer. Les kinds de feedback sont `'ok' | 'almost' | 'no' | 'skip'` ; `fixVerdict` traite `ok`/`almost` comme « avait été compté juste ».

⚠️ `trKey` et `he2tr` doivent **converger vers la même forme canonique** : toute modification de l'acceptation se fait dans les deux ensemble. Et `he2tr` sert aussi à l'**affichage** dès qu'une carte n'a pas de `tr` de carnet.

### Le standard de translittération

Les `.tr` du carnet et la sortie de `he2tr` suivent la même convention (validée le 2026-07-17) : **kh** = khaf sans daguech, **ch** = het (avec patach furtif final → `ach`), **ts** = tsadi, **`'`** = ayin partout (`'ivrit`, `be'er`, `rega'`, patach furtif → `'a` : `yode'a`) et alef entre deux voyelles (`tsme'ah`), **hé final conservé** (`atah`, `zeh`), **ei** = tsere/segol + yud (`beit`), `u` (jamais `ou`), `f` (jamais `ph`), `k` (jamais `q`), `v` (jamais `w`). Le shva initial d'un groupe de consonnes n'est écrit que s'il s'entend (`gdolim` mais `ledaber`) — c'est la seule zone de jugement humain, le carnet fait foi. Grâce aux replis de `trKey`, ce standard est purement d'affichage : la saisie tolère toutes les variantes.

## Garde-fous contre la casse silencieuse

L'extraction étant couplée au markup du carnet, trois filets détectent les cartes perdues :

1. **`init()` dans app.html** ([app.html:2097](app.html#L2097)) : avertit (console + écran setup) si une catégorie attendue donne 0 carte au chargement.
2. **`node build.js`** : compte par section, sortie non-zéro si une section de `EXPECTED_CATS` est vide, ancres `mustReplace` qui échouent bruyamment.
3. **`node build.js --check`** : détecte la dérive entre les deux implémentations d'`extractCards` et un fichier autonome obsolète (comparaison byte à byte).

## Développement et déploiement

- **Servir en HTTP** : `app.html` fait un `fetch()`, donc `file://` ne marche pas. Depuis la racine : `python3 -m http.server` puis `http://localhost:8000/`. (Le fichier autonome, lui, s'ouvre en double-clic.)
- **Vérification sans navigateur** (environnement sans Chrome headless, y compris réseau coupé) : des scripts Node jetables, hors du dépôt — `build.js --check` pour la cohérence, `node --check` sur le JS extrait pour la syntaxe, de petits harnais à stubs pour la logique pure (Leitner, distracteurs QCM, navigation), et jsdom pour booter le fichier autonome et exercer l'UI de bout en bout (chips, session, écran de fin). Pour un rendu visuel mobile, Playwright + Chromium headless fonctionne en WSL (émulation iPhone : viewport, tactile, captures) ; WebKit réel exige `libgtk-4-1 libavif13 libgstreamer-plugins-bad1.0-0`.
- **Déployer** = pousser sur `main` : GitHub Pages resert les fichiers tels quels, mêmes URL. Aucune étape de build côté CI — `flashcards_hebreu.html` doit donc être régénéré **et commité** avec les sources.
- **Langue** : toute l'UI et la doc sont en français ; s'y tenir pour les chaînes visibles.

## Check-list d'une modification de contenu

1. Éditer `vocabulaire_hebreu.html` (et lui seul pour le vocabulaire).
2. `node build.js` — vérifier les comptes par section.
3. Si des exemples ont changé : `node verifie_exemples.js` — 0 erreur exigé.
4. Ouvrir `http://localhost:8000/` — vérifier « N mots chargés » et la carte concernée.
5. Committer le carnet **et** `flashcards_hebreu.html` régénéré, pousser sur `main`.
