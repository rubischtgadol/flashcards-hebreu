# Analyse du dépôt — juillet 2026

> Analyse en lecture seule du dépôt `flashcards-hebreu`. Chaque affirmation cite `fichier:ligne`.
> Distinction explicite entre ce qui a été **vérifié** (lu dans le code ou reproduit par script) et ce qui est **supposé** (comportement non testé sur appareil).

## 1. Ce que fait le projet

Outil d'apprentissage de l'hébreu moderne pour francophones : un carnet de grammaire/vocabulaire consultable et une app de flashcards qui en dérive ses cartes. Stack : **zéro build, zéro dépendance, zéro test** — trois fichiers HTML autonomes (CSS + JS vanilla inline), déployés tels quels sur GitHub Pages (`README.md:50-52`). Point d'entrée : `index.html` ; il utilise `fetch('./vocabulaire_hebreu.html')` (`index.html:1096`), donc lancement local via serveur HTTP obligatoire (`python3 -m http.server`), pas en `file://` — le message d'erreur le dit lui-même (`index.html:1108`).

## 2. Chemin de la donnée (vérifié)

**Stockage** : le vocabulaire vit uniquement dans le DOM du carnet — sections `<h2>` portant un `<span class="count">Label</span>` (`vocabulaire_hebreu.html:359`), entrées dans des `<table>` (Verbes/Adjectifs/Noms) ou des `<ul class="word-list">` (`vocabulaire_hebreu.html:361`), champs portés par des spans `.he`/`.tr`/`.fr` (`vocabulaire_hebreu.html:440-443`).

**Chargement** : au boot, `init()` fetch le carnet avec `cache:'no-store'` (`index.html:1096`) → `DOMParser` (`index.html:1099`) → `extractCards(doc)` (`index.html:1024-1090`) qui scrape par nom de section et par **position de colonne** (Verbes exige ≥5 `<td>` `index.html:1046`, Adjectifs ≥4 `index.html:1054`, Noms ≥3 `index.html:1062`) et produit des objets `{cat, he, tr, fr, he_plain, forms?}`.

**Affichage** : `CARDS` → chips de catégories (`index.html:554-566`) → `start()` construit une file mélangée (`index.html:606`) → `render()` affiche une carte à la fois (`index.html:629`).

**Voie parallèle** : `flashcards_hebreu.html:399` embarque un snapshot JSON `const CARDS = [...]` de **593 cartes** sur une seule ligne (~130 Ko) au lieu de fetcher. La logique d'extraction a été ré-exécutée sur le carnet actuel : **593 cartes, mêmes comptes par catégorie** (291 Noms, 102 Adjectifs, 81 Verbes, 35 Expressions, 23 Prépositions, 12 Mots interrogatifs, 11 Nombres, 10 Pronoms personnels, 10 Mots de quantité, 7 Jours de la semaine, 6 Conjonctions, 3 Démonstratifs, 2 Existence) — **le snapshot est en phase aujourd'hui** (vérifié par script ; les deux fichiers ont été committés ensemble le 16/07, commit `67efd07`).

## 3. Les 3 faiblesses les plus sérieuses

### a) L'app entière est dupliquée dans deux fichiers, synchronisés à la main

Le diff des deux scripts montre **143 lignes divergentes sur ~700**, presque uniquement des commentaires supprimés et le bloc d'extraction. Exemples de dérive déjà réelle : `buildChips()` refactoré dans `index.html:554-566` vs code inline dans `flashcards_hebreu.html:547-555` ; `'›'` (`index.html:501`) vs `'›'` littéral. Tout fix de `checkAnswer` ou `he2tr` doit être appliqué deux fois, plus régénération manuelle du snapshot ligne 399. Le workflow README (upload via l'UI GitHub, `README.md:48`) rend l'oubli quasi certain à terme.

**Effort : moyen** — un script Node de ~60 lignes qui régénère `flashcards_hebreu.html` à partir du carnet et du corps d'`index.html`.

### b) Extraction fragile et silencieuse, clé = texte français exact

`extractCards` indexe les sections par le texte exact du `.count` (`index.html:1029`) et la map `listCats` contient des chaînes comme `'Nombres (0–10)'` — avec **tiret demi-cadratin** — et `'Expressions / Divers'` (`index.html:1071-1075`). Renommer un titre dans le carnet, ou ajouter une colonne à une table (parsing positionnel, cf. 3 seuils ci-dessus), fait disparaître des cartes **sans aucun signal** : la seule vérification est `if(!CARDS.length) throw` (`index.html:1101`). Concrètement : retoucher « Expressions / Divers » perd 35 cartes et personne ne le voit — le compteur « 593 mots chargés » (`index.html:1106`) est la seule trace, si on connaît le chiffre attendu.

**Effort : faible** — logguer le compte par section et alerter si une section connue tombe à 0.

### c) Du contenu est patché en dur dans le code de l'app

L'objet `trim` (`index.html:1082-1088`) réécrit le `fr` et ajoute une `note` pour 4 mots, avec pour clé la **chaîne hébraïque nikud inclus** (ex. `'וַאלָה'`). Le carnet, « source unique de vérité » (`README.md:43`), contient la version longue (`vocabulaire_hebreu.html:4184`). Si on corrige un nikud de ces mots dans le carnet, le patch cesse de s'appliquer en silence et la carte affiche la parenthèse fleuve. Et ces patchs sont **cuits dans le snapshot** de flashcards_hebreu.html (vérifié : les 4 notes y figurent) — le contenu vit donc en trois endroits.

**Effort : faible** — déplacer la version courte dans le carnet (ex. attribut `data-fr-court` sur le `<li>`) et supprimer `trim`.

## 4. Passage à l'échelle

**500 cartes : vous y êtes déjà (593).** Vérifié. Ce qui se dégrade en grossissant encore :

- La recherche du carnet re-scanne et re-highlighte **toutes** les entrées à chaque frappe, sans debounce (listener `input` direct, `vocabulaire_hebreu.html` script interne ; boucle `entries.forEach` + manipulation de classes DOM). À ~600 entrées ça passe ; à 2-3× sur mobile ça se sentira. La recherche de l'app est déjà bornée à 80 résultats (`index.html:494`) — elle, tiendra.
- Le fetch `no-store` retélécharge les ~224 Ko du carnet à **chaque** ouverture (`index.html:1096`) — croît linéairement avec le contenu.
- La ligne 399 de flashcards_hebreu.html (déjà ~130 Ko sur une ligne) devient ingérable à la main.
- Le reste (shuffle, render une carte à la fois, chips) est O(n) trivial : rien ne casse.

**Translittération et audio : ils existent déjà** — c'est le point important. Audio : Web Speech API avec sélection scorée de voix hébraïque (Premium > Enhanced > Carmit, `index.html:415-439`), mode auto (`index.html:340-341`). Translit : acceptée en saisie via la paire `trKey`/`he2tr` (`index.html:819-825`, `771-818`) + clavier hébreu virtuel (`index.html:925-926`). Ce qui manque réellement :

- Les cartes Verbes/Adjectifs/Noms ont `tr:''` en dur (`index.html:1051`, `1059`, `1066`) : pas de translit affichée pour l'infinitif ou le nom au recto (le rendu la saute si vide, `index.html:642`) ; la correction repose alors sur `he2tr` généré, qui est une approximation (le shva n'émet aucune voyelle, cf. table `V` `index.html:772-773`).
- Sans voix hébraïque sur l'appareil, `speak()` retombe sur `u.lang='he-IL'` avec la voix par défaut (`index.html:445-446`) : le bouton reste visible (`TTS_OK` seul est testé, `index.html:470`) mais la prononciation sera fausse. **Supposition** (non testé sur appareil) : c'est le comportement standard de l'API.

## 5. Code mort, dupliqué, vestiges

- **Mort (vérifié)** : `normTr` défini dans les deux apps (`index.html:760`, `flashcards_hebreu.html:753`), une seule occurrence chacune = la définition. Jamais appelé.
- **Dupliqué (vérifié)** : ~95 % du JS et du CSS entre les deux apps (cf. 3a).
- **Vestige (vérifié par le diff)** : flashcards_hebreu.html est visiblement l'ancêtre — il a conservé les commentaires (`// strip accents + nikud`, `// Auto-play…`) que index.html a perdus en y greffant l'extraction runtime. Le champ `tr` toujours vide des cartes de tables (cf. §4) est un demi-vestige : le champ existe dans le schéma mais n'est peuplé que pour les catégories en liste.
- **Incohérence avec le README (vérifié)** : la version « autonome, fonctionne hors ligne » (`README.md:44`) charge ses 4 polices depuis Google Fonts (`flashcards_hebreu.html:7-8`) — hors ligne, l'hébreu s'affichera en police système et le mode cursif (police `Playpen Sans Hebrew`) retombera sur `Segoe Script`/`Comic Sans`, qui ne couvrent pas l'hébreu → cursive affichée en police par défaut. **Supposition** : le fallback exact dépend de l'OS ; le fait que les polices soient distantes est, lui, vérifié.

## Action à faire en premier

**Écrire un script Node `build.js` qui régénère `flashcards_hebreu.html` depuis `vocabulaire_hebreu.html` et affiche le compte de cartes par section.** C'est celle-là parce qu'elle neutralise les deux risques silencieux à la fois : la désynchronisation du snapshot (faiblesse a — aujourd'hui en phase par chance, rien ne le garantit demain) et la perte muette de cartes à l'extraction (faiblesse b — le script imprime « Verbes: 81, Noms: 291… » à chaque build, toute section qui tombe à 0 saute aux yeux). Tout le reste — dédupliquer l'app, sortir `trim` du code — devient sûr à faire *après*, précisément parce que ce script vérifie le résultat.
