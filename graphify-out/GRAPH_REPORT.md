# Graph Report - .  (2026-07-20)

## Corpus Check
- 10 files · ~115,886 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 335 nodes · 505 edges · 23 communities (10 shown, 13 thin omitted)
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.85)
- Token cost: 122,500 input · 438,795 output

## Community Hubs (Navigation)
- Modes d'étude et rendu des cartes
- Écran de départ, préférences et session
- Le carnet : sections et contrat de balisage
- Critique impeccable du portail (18/07)
- Architecture : SRS, identité et extraction
- Voix, icônes et charte partagée
- build.js : l'extracteur regex
- Validation des exemples
- Dossier lag iPhone et diagnostic
- Icône 512 et son rôle PWA
- Service worker
- PRODUCT : le document
- PRODUCT : l'aisance orale
- PRODUCT : anti-références
- PRODUCT : hors-ligne
- PRODUCT : une seule charte
- PRODUCT : le calme
- PRODUCT : l'hébreu vedette
- PRODUCT : taille francophone
- Carnet : anneau de focus
- Carnet : lien vers l'app
- Carnet : deux voix de micro-titre
- Carnet : charte :root

## God Nodes (most connected - your core abstractions)
1. `vocabulaire_hebreu.html — Carnet de vocabulaire (source unique du contenu)` - 29 edges
2. `render` - 19 edges
3. `extractCards()` - 13 edges
4. `buildChips` - 12 edges
5. `recordResult` - 11 edges
6. `updateStart` - 10 edges
7. `Critique index.html 18/07 13:02 — 28/40, 3 P1` - 9 edges
8. `Critique index.html 18/07 17:37 — 33/40, 1 P1 (post-passes 1–5)` - 9 edges
9. `quizPick` - 9 edges
10. `he2tr (nikud transliteration)` - 9 edges

## Surprising Connections (you probably didn't know these)
- `const CARDS = […] — vocabulaire intégré (payload JSON des 713 cartes)` --shares_data_with--> `extractCards()`  [INFERRED]
  flashcards_hebreu.html → build.js
- `flashcards_hebreu.html — build autonome hors-ligne (généré)` --semantically_similar_to--> `recordResult`  [INFERRED] [semantically similar]
  flashcards_hebreu.html → app.html
- `flashcards_hebreu.html — build autonome hors-ligne (généré)` --semantically_similar_to--> `he2tr (nikud transliteration)`  [INFERRED] [semantically similar]
  flashcards_hebreu.html → app.html
- `Avertissement ligne 1 : « FICHIER GÉNÉRÉ par node build.js — ne pas éditer à la main »` --references--> `generateStandalone()`  [EXTRACTED]
  flashcards_hebreu.html → build.js
- `index.html — Portail (page racine)` --references--> `apple-touch-icon.png (icône PWA iOS)`  [INFERRED]
  index.html → icons/apple-touch-icon.png

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Leitner spaced-repetition system (srs_v1)** — app_srs, app_cardid, app_srsload, app_srssave, app_srsmigrateids, app_recordresult, app_undolastrecord, app_duecards, app_masterystats, app_refreshsrsui, app_startreview, app_todaynum [EXTRACTED 1.00]
- **Session snapshot in sessionStorage (sess_v1)** — app_sesssave, app_sessclear, app_sessrestore, app_cardid, app_state [EXTRACTED 1.00]
- **iPhone latency diagnostic instrumentation** — app_perfreport, app_fmtms, app_buildchips, app_segpick, app_start, app_startreview, app_init [EXTRACTED 1.00]
- **Contrat de balisage scruté par les deux extracteurs de cartes** — vocabulaire_hebreu_count_label, vocabulaire_hebreu_word_list, vocabulaire_hebreu_table_layout, vocabulaire_hebreu_exemples, vocabulaire_hebreu_data_niveau, vocabulaire_hebreu_data_fr_court, vocabulaire_hebreu_lang_he [INFERRED 0.95]
- **Les trois blocs :root du carnet — jetons partagés, rampe locale, colonne locale, à ne jamais fusionner** — vocabulaire_hebreu_root_charte, vocabulaire_hebreu_rampe_typographique, vocabulaire_hebreu_colonne_lecture [EXTRACTED 1.00]
- **Partie 1 · Grammaire — les onze sections-cours, exclues des cartes** — vocabulaire_hebreu_pronoms_personnels, vocabulaire_hebreu_demonstratifs, vocabulaire_hebreu_la_racine, vocabulaire_hebreu_le_passe, vocabulaire_hebreu_le_futur, vocabulaire_hebreu_binyanim, vocabulaire_hebreu_article_defini, vocabulaire_hebreu_etat_construit, vocabulaire_hebreu_prepositions_flechies, vocabulaire_hebreu_he_directionnel, vocabulaire_hebreu_existence_possession [EXTRACTED 1.00]
- **Instruction du dossier lag iPhone (20/07 nuit)** — todo_lag_iphone_dossier, todo_hypothese_h1_travail_synchrone, todo_hypothese_h2_relayout_sticky, todo_hypothese_h3_carnet_chargement, todo_hypothese_h4_has_due, todo_campagne_webkit_lag, todo_diagnostic_latence, todo_grille_attente_travail_affichage, todo_premier_rendu_329ms [EXTRACTED 1.00]
- **Chantier « une seule lampe à la fois » (20/07 au soir)** — design_une_seule_lampe, design_body_has_due, design_trois_registres_commencer, design_sticky_suit_la_lampe, design_review_card, architecture_refreshsrsui, docs_superpowers_specs_2026_07_20_lampes_accueil_design_spec, todo_lampes_accueil_fait [EXTRACTED 1.00]
- **La colonne de lecture du carnet (20/07)** — design_regle_deux_colonnes, design_colonne, design_colonne_large, design_calibrage_avance_prose, design_piege_plancher_specificite, design_critere_titre_cadre [EXTRACTED 1.00]
- **Trajectoire des snapshots de critique (28 → 33 → 34 → 30/40, changement de slug)** — _impeccable_critique_2026_07_18t13_02_30z__index_html_critique, _impeccable_critique_2026_07_18t17_37_33z__index_html_critique, _impeccable_critique_2026_07_18t19_31_06z__index_html_critique, _impeccable_critique_2026_07_19t09_14_04z__app_html_critique, _impeccable_critique_2026_07_19t09_57_31z__vocabulaire_hebreu_html__audit_audit [EXTRACTED 1.00]
- **Chaîne de réversibilité du verdict SRS (signalée, généralisée, mesurée)** — _impeccable_critique_2026_07_18t13_02_30z__index_html_persistance_prefs, _impeccable_critique_2026_07_18t17_37_33z__index_html_undo_verdict, _impeccable_critique_2026_07_18t17_37_33z__index_html_champ_vide_noop, _impeccable_critique_2026_07_19t09_14_04z__app_html_reversibilite_invariant [INFERRED 0.85]
- **Infractions à la règle de la lampe recensées sur les trois fichiers** — _impeccable_critique_2026_07_19t09_14_04z__app_html_regle_de_la_lampe, _impeccable_critique_2026_07_19t09_14_04z__app_html_p0_start_fantome_dore, _impeccable_critique_2026_07_19t09_57_31z__vocabulaire_hebreu_html__audit_part_dore_au_repos, _impeccable_critique_2026_07_19t09_14_04z__app_html_correction_bandeau_lateral [EXTRACTED 1.00]
- **Les trois :root de la charte doivent rester identiques** — index_root_tokens [EXTRACTED 1.00]
- **Le portail en deux temps : accueil, bascule, portes** — index_accueil_overlay, index_body_entree_class, index_deux_portes, index_salut_aleatoire [EXTRACTED 1.00]

## Communities (23 total, 13 thin omitted)

### Community 0 - "Modes d'étude et rendu des cartes"
Cohesion: 0.08
Nodes (48): animateFace, answer, answerHtml, bigFr, bindTap, checkAnswer, doFlip, editDist (+40 more)

### Community 1 - "Écran de départ, préférences et session"
Cohesion: 0.08
Nodes (47): applyFoldState, applyPrefs, beginSession, BUILD:ONLINE-ONLY fence, buildChips, buildNivChips, cardId, CARDS (word bank global) (+39 more)

### Community 2 - "Le carnet : sections et contrat de balisage"
Cohesion: 0.06
Nodes (44): vocabulaire_hebreu.html — Carnet de vocabulaire (source unique du contenu), Section Adjectifs (tables 4 colonnes : MS/FS/MP/FP, carré magique), Section Adverbes (word-list, sous-thèmes Temps / Lieu & direction), Section L'article défini (ha-), Section Patrons de conjugaison (binyanim, 7 moules), Bloc :root n°3 — colonne de lecture (--colonne 28rem, --colonne-large 56rem), Section Conjonctions (word-list), Contrat de balisage du carnet (ce que les deux extracteurs scrutent) (+36 more)

### Community 3 - "Critique impeccable du portail (18/07)"
Cohesion: 0.07
Nodes (42): P1 — Recherche inaccessible au clavier, app muette pour lecteurs d'écran, Boucle de correction tolérante (normFr / frVariants / trKey / editDist), Critique index.html 18/07 13:02 — 28/40, 3 P1, P1 — « Commencer » désactivé sans explication, Design Health Score (10 heuristiques Nielsen sur 40), Méthode dual-agent (A revue design · B détecteur déterministe), Emojis d'interface — seule fuite hors charte « calme, studieux », P1 — Aucune persistance des réglages ni de la session (+34 more)

### Community 4 - "Architecture : SRS, identité et extraction"
Cohesion: 0.07
Nodes (42): Identité de carte cat|he (forme vocalisée), Trois collisions d'homographes consonantiques, ARCHITECTURE.md — vue d'ensemble du dépôt, Le graphe de connaissance du dépôt (graphify-out/), Section « hé directionnel » (הֵא הַמְּגַמָּה), refreshSrsUi() — source de vérité de l'éclairage de l'accueil, Section de grammaire : enseigner un mot sans créer de carte, Clé localStorage srs_v1 (+34 more)

### Community 5 - "Voix, icônes et charte partagée"
Cohesion: 0.08
Nodes (29): loadVoices, reflectVoiceUi, voiceURI over localized voice name, DESIGN.md — Nuit d'encre / Or ancien token system, apple-touch-icon.png (icône PWA iOS), Format carré plein bord, sans marge ni texte, Glyphe א (alef) doré, plein cadre, Une seule lettre comme signature de marque (+21 more)

### Community 6 - "build.js : l'extracteur regex"
Cohesion: 0.14
Nodes (27): attrOf(), blocksOf(), closeOf(), decodeEntities(), exemplesOf(), EXPECTED_CATS, EXPECTED_LEVELS, extractCards() (+19 more)

### Community 7 - "Validation des exemples"
Cohesion: 0.08
Nodes (15): APP, NOTEBOOK, appSrc, cards, CATS_COUVERTES, errors, { extractCards, NOTEBOOK, APP }, fs (+7 more)

### Community 8 - "Dossier lag iPhone et diagnostic"
Cohesion: 0.22
Nodes (9): README.md — présentation utilisateur, Bissection par déploiement (app d'hier contre carnet du jour), Panneau « Diagnostic de latence » (SW v12), Facteur confondant n°1 : la réinstallation de la PWA, Grille de lecture attente / travail / affichage, Chantier ouvert : lag sur iPhone réel (dossier du 20/07), Distinction latence / saccade — elle commande l'enquête, Piste non instrumentée : concurrence du SW stale-while-revalidate (+1 more)

### Community 9 - "Icône 512 et son rôle PWA"
Cohesion: 0.39
Nodes (8): icon-512.png — PWA large app icon, 512×512 square PNG, full-bleed flat background, no border or text, Golden aleph (א) glyph, centered, Nuit d'encre background + Or ancien glyph, Same golden aleph used as vector glyph on the portal welcome screen, Role: manifest/splash icon declared in manifest.webmanifest, Role: precached asset of the service worker, Regenerated when --bg / --gold design tokens change

## Ambiguous Edges - Review These
- `Format carré plein bord, sans marge ni texte` → `Rôle : icône d'écran d'accueil iOS (PWA installée)`  [AMBIGUOUS]
  icons/apple-touch-icon.png · relation: rationale_for
- `icon-512.png — PWA large app icon` → `Same golden aleph used as vector glyph on the portal welcome screen`  [AMBIGUOUS]
  icons/icon-512.png · relation: conceptually_related_to

## Knowledge Gaps
- **70 isolated node(s):** `fs`, `path`, `STANDALONE`, `EXPECTED_CATS`, `EXPECTED_LEVELS` (+65 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Format carré plein bord, sans marge ni texte` and `Rôle : icône d'écran d'accueil iOS (PWA installée)`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **What is the exact relationship between `icon-512.png — PWA large app icon` and `Same golden aleph used as vector glyph on the portal welcome screen`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Contrat de balisage du carnet (ce que les deux extracteurs scrutent)` connect `Le carnet : sections et contrat de balisage` to `build.js : l'extracteur regex`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `flashcards_hebreu.html — build autonome hors-ligne (généré)` connect `build.js : l'extracteur regex` to `Modes d'étude et rendu des cartes`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `extractCards()` (e.g. with `build.js` and `const CARDS = […] — vocabulaire intégré (payload JSON des 713 cartes)`) actually correct?**
  _`extractCards()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fs`, `path`, `STANDALONE` to the rest of the system?**
  _70 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Modes d'étude et rendu des cartes` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._