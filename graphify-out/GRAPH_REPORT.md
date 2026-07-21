# Graph Report - /home/ruben/dev/flashcards-hebreu  (2026-07-21)

## Corpus Check
- 10 files · ~130,943 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 420 nodes · 679 edges · 28 communities (17 shown, 11 thin omitted)
- Extraction: 87% EXTRACTED · 12% INFERRED · 1% AMBIGUOUS · INFERRED: 82 edges (avg confidence: 0.87)
- Token cost: 337,940 input · 57,526 output

## Community Hubs (Navigation)
- Mode Cartes et moteur de réponse
- build.js — chaîne de génération
- Audit mécanique du carnet
- Carnet : sections et régimes d attributs
- Amorçage, filtres et préférences
- Architecture : extraction et contrats
- Doctrine du dépôt et pièges
- Révision espacée (Leitner)
- Carnet : blocs de grammaire
- Extracteurs et build autonome
- Carnet : charte, colonne, typographie
- Icônes PWA et identité visuelle
- Icône PWA 512
- Icône iOS apple-touch
- Synthèse vocale hébraïque
- Portail index.html
- Accessibilité et anneau de focus
- Service worker et précache
- Règle de la carte unique
- Règle des couches
- PRODUCT.md — registre et utilisateurs
- But : tenir une conversation
- Anti-références produit
- Principe : ça marche dans l avion
- Principe : une seule charte
- Principe : le calme soutient l étude
- Principe : l hébreu est la vedette
- Principe : taillé pour un francophone

## God Nodes (most connected - your core abstractions)
1. `render() — rendu de la carte courante` - 20 edges
2. `Partie 1 · Grammaire (div.part #part-grammaire)` - 20 edges
3. `ul.word-list > li — les 18 sections en liste (mono-thème par nature)` - 20 edges
4. `extractCards() — scrape du carnet` - 18 edges
5. `buildChips()` - 13 edges
6. `Partie 3 · Mots-outils, nombres & quotidien (div.part #part-mots-outils)` - 13 edges
7. `extractCards()` - 12 edges
8. `state (objet d'état global de la session)` - 12 edges
9. `recordResult()` - 12 edges
10. `updateStart()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Les 15 slugs de thème (abstrait, argent-achats, communication-pensee, corps-sante, emotions-caractere, famille-personnes, loisirs-culture, maison-objets, nature, nourriture, temps-calendrier, travail-etudes, vetements-couleurs, vie-quotidienne, ville-transport)` --shares_data_with--> `EXPECTED_THEMES`  [INFERRED]
  vocabulaire_hebreu.html → build.js
- `La voix hébraïque et le plafond de WebKit (voiceURI, jamais name)` --semantically_similar_to--> `Piège n°14 : une mesure d'émulation ne vaut qu'en A/B, jamais en absolu`  [INFERRED] [semantically similar]
  ARCHITECTURE.md → CLAUDE.md
- `Fence BUILD:ONLINE-ONLY retirée — aucun enregistrement de service worker` --conceptually_related_to--> `sw.js — service worker precaching the icon assets`  [INFERRED]
  flashcards_hebreu.html → icons/icon-192.png
- `Régime data-niveau — A1 (350) / A2 (311) / B1 (124) / B2 (4), obligatoire sur chaque li et tr` --shares_data_with--> `EXPECTED_LEVELS`  [INFERRED]
  vocabulaire_hebreu.html → build.js
- `Piège : les <li> d'exemples sont imbriqués dans les <li> de word-list` --rationale_for--> `lisOf()`  [INFERRED]
  vocabulaire_hebreu.html → build.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Le flux d'extraction : du carnet aux cartes, en deux implémentations** — architecture_vocabulaire_hebreu_html, architecture_contrat_de_balisage_du_carnet, architecture_extractcards, architecture_couplage_des_deux_extracteurs, architecture_schema_de_carte, architecture_build_js, architecture_app_html [EXTRACTED 1.00]
- **La charte unifiée : un bloc :root identique dans les trois fichiers déployés** — architecture_charte_graphique_unifiee, architecture_vocabulaire_hebreu_html, architecture_app_html, architecture_index_html, design_nuit_d_encre_et_or_ancien, claude_piege_trois_blocs_root [EXTRACTED 1.00]
- **L'échelle du canal le moins cher : graphe → grep → sous-agent → fil principal** — claude_token_economy_doctrine, architecture_graphe_de_connaissance, claude_delegation_aux_sous_agents, claude_regle_du_flag_graphe_a_recaler, claude_rituel_apres_modification [EXTRACTED 1.00]
- **Chemin d'amorçage en ligne : fetch → extraction → chips → restauration** — app_init, app_extractcards, app_buildchips, app_applyprefs, app_srsmigrateids, app_sessrestore, app_cards [EXTRACTED 1.00]
- **Correction du verdict dans les trois modes (Cartes, Saisie, QCM)** — app_undocardanswer, app_fixverdict, app_quizfixverdict, app_undolastrecord, app_recordresult, app_lastrecord [EXTRACTED 1.00]
- **Instrumentation de latence sur tous les gestes coûteux** — app_perfreport, app_fmtms, app_lastpointerup, app_buildchips, app_segpick, app_start, app_startreview, app_perf_panel [EXTRACTED 1.00]
- **Le contrat d'extraction du carnet (clé .count, tables positionnelles, word-lists, champs he/tr/fr)** — vocabulaire_hebreu_count_label_contract, vocabulaire_hebreu_table_verbes, vocabulaire_hebreu_table_noms, vocabulaire_hebreu_table_adjectifs, vocabulaire_hebreu_word_list_contract, vocabulaire_hebreu_span_he_tr_fr, app_extractcards [INFERRED 0.95]
- **Les trois blocs :root du carnet — charte partagée, rampe typographique, colonne de lecture** — vocabulaire_hebreu_root_design_tokens, vocabulaire_hebreu_root_type_ramp, vocabulaire_hebreu_root_reading_column, vocabulaire_hebreu_rule_three_roots_never_merge, vocabulaire_hebreu_trap_rem_is_16px, vocabulaire_hebreu_rule_colonne_mesuree [EXTRACTED 1.00]
- **Le régime d'attributs des entrées (data-niveau partout, data-theme sur les tables, lang=he sur tout hébreu)** — vocabulaire_hebreu_data_niveau_regime, vocabulaire_hebreu_data_theme_regime, vocabulaire_hebreu_theme_slugs, vocabulaire_hebreu_lang_he_regime, vocabulaire_hebreu_exemples_contract [EXTRACTED 1.00]

## Communities (28 total, 11 thin omitted)

### Community 0 - "Mode Cartes et moteur de réponse"
Cohesion: 0.07
Nodes (62): Régions live et annonces lecteur d'écran, animateFace(), answer() — verdict du mode Cartes, answerHtml(), beginSession(), bigFr(), bindTap() — pointerup + click en filet, CARDS (banque de cartes extraite du carnet) (+54 more)

### Community 1 - "build.js — chaîne de génération"
Cohesion: 0.06
Nodes (40): APP, attrOf(), blocksOf(), closeOf(), decodeEntities(), exemplesOf(), EXPECTED_CATS, EXPECTED_THEMES (+32 more)

### Community 2 - "Audit mécanique du carnet"
Cohesion: 0.06
Nodes (31): APP, appSrc, CARDS, controleTexte(), donnees, drapeaux, drapeauxParCarte, erreurs (+23 more)

### Community 3 - "Carnet : sections et régimes d attributs"
Cohesion: 0.09
Nodes (38): THEMES (15 champs sémantiques), EXPECTED_LEVELS, .cursive — Playpen Sans Hebrew, ligne sans nikud sous chaque entrée, Script cursive — génère un span.cursive sans nikud sous chaque .he d'entrée, Régime data-niveau — A1 (350) / A2 (311) / B1 (124) / B2 (4), obligatoire sur chaque li et tr, Régime data-theme — sur les trois tables seulement, 15 slugs, ul.exemples — au moins un exemple par entrée de table (he / tr / fr), Régime lang="he" — porté par 100 % des nœuds hébreux, y compris les .cursive générés (+30 more)

### Community 4 - "Amorçage, filtres et préférences"
Cohesion: 0.10
Nodes (35): applyFoldState(), applyPrefs(), body font-size:22px (base typographique), Barrière BUILD:ONLINE-ONLY, buildChips(), buildNivChips(), buildThemeChips(), catOrder (ordre d'affichage des catégories) (+27 more)

### Community 5 - "Architecture : extraction et contrats"
Cohesion: 0.07
Nodes (35): app.html — flashcards en ligne, build.js — chaîne de génération du standalone, Le contrat de balisage du carnet (span.count, word-list, tables positionnelles), Le couplage critique des deux extracteurs, Les exemples en situation (ul.exemples, 637 phrases), extractCards — l'extraction du carnet vers les cartes, flashcards_hebreu.html — build autonome hors ligne, Les garde-fous contre la casse silencieuse (init, build.js, --check) (+27 more)

### Community 6 - "Doctrine du dépôt et pièges"
Cohesion: 0.07
Nodes (31): audit_carnet_mecanique.js — étage 0 de l'audit du carnet, La charte graphique unifiée (bloc :root identique dans les trois fichiers), checkAnswer — correction tolérante des réponses tapées, La couche PWA (manifest.webmanifest, sw.js, icons/), Le diagnostic de latence embarqué (perfReport, #perf-boot), L'identité de carte vocalisée (cat|he), index.html — le portail (porte d'entrée en deux temps), Persistance des réglages et reprise de session (prefs_v1, sess_v1) (+23 more)

### Community 7 - "Révision espacée (Leitner)"
Cohesion: 0.15
Nodes (22): cardId() — clé `cat|he` (forme vocalisée), dueCards(), fixVerdict(), Règle de la lampe — une seule lumière (body.has-due), lastRecord (état SRS annulable), Système de Leitner (révision espacée), masteryStats(), quizFixVerdict() (+14 more)

### Community 8 - "Carnet : blocs de grammaire"
Cohesion: 0.15
Nodes (21): Blocs de grammaire — .gram-title / .ex-title / .example (hors extraction des cartes), Partie 1 · Grammaire (div.part #part-grammaire), Section « Démonstratifs » (מִלּוֹת רֶמֶז), Section « État construit » (סְמִיכוּת), Section « Existence et possession » (יֵשׁ וְאֵין), Section « Le hé directionnel » (הֵא הַמְּגַמָּה), Section « L'article défini » (הַ־), Section « L'impératif » (צִוּוּי) (+13 more)

### Community 9 - "Extracteurs et build autonome"
Cohesion: 0.16
Nodes (18): exOf() — exemples en situation, extractCards() — scrape du carnet, Contrat d'extraction du carnet (labels .count, colonnes positionnelles), firstText(), lisOf() — <li> de premier niveau (ul.word-list > li), listCats (carte section du carnet → catégorie), rowsOf() — lignes de table d'une section, stripNikud() (+10 more)

### Community 10 - "Carnet : charte, colonne, typographie"
Cohesion: 0.18
Nodes (13): Lien #app-link vers ./app.html (« S'entraîner avec les flashcards »), Le carnet — vocabulaire_hebreu.html (source de vérité du contenu), :focus-visible — anneau doré, jamais de border-radius, header — h1 אוֹצַר מִלִּים + lien vers app.html, Mise en œuvre de la colonne : padding-inline sur main + main > *:not(.table-wrap), .note / .attention / .empty — encadrés (dashed = « rien ici » uniquement), :root #1 — jetons de charte partagés (bg/gold/ink), :root #3 — colonne de lecture (--colonne 28rem / --colonne-large 56rem) (+5 more)

### Community 11 - "Icônes PWA et identité visuelle"
Cohesion: 0.21
Nodes (12): DESIGN.md — Nuit d'encre / Or ancien token system, Fence BUILD:ONLINE-ONLY retirée — aucun enregistrement de service worker, Métadonnées PWA conservées (manifest, apple-touch-icon, theme-color) sans SW, icon-192.png — PWA app icon (192×192), Format — 192px square PNG, rounded-corner full-bleed tile, centered glyph, Golden aleph (א) glyph — the icon's sole mark, Icon palette — Nuit d'encre background, Or ancien glyph, Regeneration rule — icons must be redrawn if --bg/--gold tokens change (+4 more)

### Community 12 - "Icône PWA 512"
Cohesion: 0.39
Nodes (8): icon-512.png — PWA large app icon, 512×512 square PNG, full-bleed flat background, no border or text, Golden aleph (א) glyph, centered, Nuit d'encre background + Or ancien glyph, Same golden aleph used as vector glyph on the portal welcome screen, Role: manifest/splash icon declared in manifest.webmanifest, Role: precached asset of the service worker, Regenerated when --bg / --gold design tokens change

### Community 13 - "Icône iOS apple-touch"
Cohesion: 0.40
Nodes (6): apple-touch-icon.png (icône PWA iOS), Format carré plein bord, sans marge ni texte, Glyphe א (alef) doré, plein cadre, Une seule lettre comme signature de marque, Palette Nuit d'encre + Or ancien de l'icône, Rôle : icône d'écran d'accueil iOS (PWA installée)

### Community 14 - "Synthèse vocale hébraïque"
Cohesion: 0.60
Nodes (5): heVoice / voicesCache / TTS_OK (voix hébraïque retenue), loadVoices(), Garde « no-he-voice » (pas de réglage sans effet), reflectVoiceUi(), score() — classement des voix hébraïques

### Community 15 - "Portail index.html"
Cohesion: 0.40
Nodes (5): Accueil plein écran (ménorahs, א vectoriel, s'efface au clic), Bloc :root de la charte unifiée (identique carnet/app/portail), Fontes Google chargées en non-bloquant (media=print puis bascule onload), Portail (index.html) : la porte d'entrée commune aux deux côtés, Salut bilingue au hasard (français / hébreu sans nikoud)

### Community 16 - "Accessibilité et anneau de focus"
Cohesion: 0.50
Nodes (4): Accessibilité du carnet (lang=he, reduced-motion, cibles 44px, anneau doré), lang="he" sur 100 % des nœuds hébreux, Piège n°2 : ne jamais écrire transition:all (WebKit fige les outline-*), L'anneau :focus-visible doré global (jamais de border-radius)

## Ambiguous Edges - Review These
- `Format carré plein bord, sans marge ni texte` → `Rôle : icône d'écran d'accueil iOS (PWA installée)`  [AMBIGUOUS]
  icons/apple-touch-icon.png · relation: rationale_for
- `icon-512.png — PWA large app icon` → `Same golden aleph used as vector glyph on the portal welcome screen`  [AMBIGUOUS]
  icons/icon-512.png · relation: conceptually_related_to
- `cardsUndo (dernière réponse du mode Cartes)` → `srsMigrateIds() — migration cat|he_plain → cat|he`  [AMBIGUOUS]
  app.html · relation: conceptually_related_to
- `Fence BUILD:ONLINE-ONLY retirée — aucun enregistrement de service worker` → `Métadonnées PWA conservées (manifest, apple-touch-icon, theme-color) sans SW`  [AMBIGUOUS]
  flashcards_hebreu.html · relation: conceptually_related_to
- `Section « Phrases » (מִשְׁפָּטִים שִׁמּוּשִׁיִּים) — word-list` → `ul.exemples — au moins un exemple par entrée de table (he / tr / fr)`  [AMBIGUOUS]
  vocabulaire_hebreu.html · relation: conceptually_related_to

## Knowledge Gaps
- **79 isolated node(s):** `fs`, `vm`, `{ extractCards, NOTEBOOK, APP }`, `appSrc`, `sandbox` (+74 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Format carré plein bord, sans marge ni texte` and `Rôle : icône d'écran d'accueil iOS (PWA installée)`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **What is the exact relationship between `icon-512.png — PWA large app icon` and `Same golden aleph used as vector glyph on the portal welcome screen`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `cardsUndo (dernière réponse du mode Cartes)` and `srsMigrateIds() — migration cat|he_plain → cat|he`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Fence BUILD:ONLINE-ONLY retirée — aucun enregistrement de service worker` and `Métadonnées PWA conservées (manifest, apple-touch-icon, theme-color) sans SW`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Section « Phrases » (מִשְׁפָּטִים שִׁמּוּשִׁיִּים) — word-list` and `ul.exemples — au moins un exemple par entrée de table (he / tr / fr)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `extractCards() — scrape du carnet` connect `Extracteurs et build autonome` to `Mode Cartes et moteur de réponse`, `Carnet : charte, colonne, typographie`, `Carnet : sections et régimes d attributs`, `Amorçage, filtres et préférences`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `ul.word-list > li — les 18 sections en liste (mono-thème par nature)` connect `Carnet : sections et régimes d attributs` to `Carnet : blocs de grammaire`, `Extracteurs et build autonome`, `build.js — chaîne de génération`?**
  _High betweenness centrality (0.117) - this node is a cross-community bridge._