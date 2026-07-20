# Graph Report - .  (2026-07-21)

## Corpus Check
- 10 files · ~132,856 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 418 nodes · 648 edges · 24 communities (13 shown, 11 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.88)
- Token cost: 0 input · 451,374 output

## Community Hubs (Navigation)
- Carnet — sections et contrat
- App — écran d’étude et réponse
- App — session, prefs et SRS
- Build du standalone
- Architecture documentée
- Critiques impeccable (portail)
- Audit mécanique du carnet
- Icônes et identité visuelle
- Règles DESIGN.md
- Standalone hors-ligne
- Pièges et chantiers
- Icône 512 (manifest)
- Portail et couche PWA
- Voix hébraïque (TTS)
- Service worker
- Niveaux CECRL
- PRODUCT.md
- But : aisance orale
- Anti-références produit
- Hors-ligne (avion)
- Charte unique carnet/app
- Le calme soutient l’étude
- L’hébreu en vedette
- Taillé pour un francophone

## God Nodes (most connected - your core abstractions)
1. `vocabulaire_hebreu.html — le carnet (source unique du contenu)` - 43 edges
2. `render` - 19 edges
3. `Listes ul.word-list > li (word-main .he/.cursive, meta .tr/.fr)` - 19 edges
4. `flashcards_hebreu.html — Standalone hors-ligne (fichier généré)` - 17 edges
5. `Plan d'exécution de l'audit du carnet (2026-07-20)` - 14 edges
6. `extractCards()` - 12 edges
7. `buildChips` - 11 edges
8. `updateStart` - 10 edges
9. `recordResult` - 10 edges
10. `Critique index.html 18/07 13:02 — 28/40, 3 P1` - 9 edges

## Surprising Connections (you probably didn't know these)
- `flashcards_hebreu.html — Standalone hors-ligne (fichier généré)` --conceptually_related_to--> `STANDALONE`  [INFERRED]
  flashcards_hebreu.html → build.js
- `generateStandalone()` --implements--> `Instantané de cartes intégré (const CARDS)`  [INFERRED]
  build.js → flashcards_hebreu.html
- `Les 14 pièges de CLAUDE.md (payés une fois chacun)` --semantically_similar_to--> `Rampe typographique de 8 pas du carnet`  [INFERRED] [semantically similar]
  CLAUDE.md → ARCHITECTURE.md
- `Les 14 pièges de CLAUDE.md (payés une fois chacun)` --semantically_similar_to--> `Invariant lang=he sur 100 % de l'hébreu`  [INFERRED] [semantically similar]
  CLAUDE.md → ARCHITECTURE.md
- `Les 14 pièges de CLAUDE.md (payés une fois chacun)` --semantically_similar_to--> `Piège transition:all — les outline-* figés par WebKit`  [INFERRED] [semantically similar]
  CLAUDE.md → ARCHITECTURE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Pipeline d'audit à étages : script 0 token → étalonnage → fan-out Sonnet → contre-expertise → arbitrage Opus** — architecture_audit_carnet_mecanique_js, docs_superpowers_specs_2026_07_20_audit_carnet_plan_quatre_etages, docs_superpowers_specs_2026_07_20_audit_carnet_plan_etalonnage, docs_superpowers_specs_2026_07_20_audit_carnet_plan_routage_drapeaux, docs_superpowers_specs_2026_07_20_audit_carnet_plan_contre_expertise, docs_superpowers_specs_2026_07_20_audit_carnet_plan_gabarits [EXTRACTED 1.00]
- **Le couplage d'extraction et ses filets anti-casse-silencieuse** — architecture_extractcards_double_implementation, architecture_build_js, architecture_app_html, architecture_garde_fous_extraction, architecture_card_schema [EXTRACTED 1.00]
- **Charte :root partagée, identique au caractère près, entre les trois fichiers déployés** — architecture_charte_root_tokens, architecture_vocabulaire_hebreu_html, architecture_app_html, architecture_index_html [EXTRACTED 1.00]
- **Les trois blocs :root du carnet, séparés à dessein (charte partagée / rampe locale / colonne locale)** — vocabulaire_hebreu_root_charte, vocabulaire_hebreu_rampe_typographique, vocabulaire_hebreu_colonne_lecture [EXTRACTED 1.00]
- **Contrat d'extraction du carnet vers les deux extracteurs (extractCards / build.js)** — vocabulaire_hebreu_contrat_markup, vocabulaire_hebreu_count_label, vocabulaire_hebreu_word_list, vocabulaire_hebreu_table_layout, vocabulaire_hebreu_exemples, vocabulaire_hebreu_data_niveau, vocabulaire_hebreu_lang_he [EXTRACTED 1.00]
- **Les trois scripts inline du carnet (redirection file:, cursive, recherche)** — vocabulaire_hebreu_app_link, vocabulaire_hebreu_script_cursive, vocabulaire_hebreu_recherche [EXTRACTED 1.00]
- **Pipeline de génération du standalone (build.js ← app.html + carnet)** — build, vocabulaire_hebreu, flashcards_hebreu_standalone, flashcards_hebreu_embedded_snapshot [EXTRACTED 1.00]
- **Flux de session : Réglages → Étude → Fin** — flashcards_hebreu_setup_panel, flashcards_hebreu_study_screen, flashcards_hebreu_done_screen [EXTRACTED 1.00]
- **Persistance du profil (SRS + préférences + instantané, effacés ensemble)** — flashcards_hebreu_srs_leitner, flashcards_hebreu_prefs_persistees, flashcards_hebreu_session_snapshot, flashcards_hebreu_reset_profil [INFERRED 0.85]
- **Leitner spaced-repetition system (srs_v1)** — app_srs, app_cardid, app_srsload, app_srssave, app_srsmigrateids, app_recordresult, app_undolastrecord, app_duecards, app_masterystats, app_refreshsrsui, app_startreview, app_todaynum [EXTRACTED 1.00]
- **Session snapshot in sessionStorage (sess_v1)** — app_sesssave, app_sessclear, app_sessrestore, app_cardid, app_state [EXTRACTED 1.00]
- **iPhone latency diagnostic instrumentation** — app_perfreport, app_fmtms, app_buildchips, app_segpick, app_start, app_startreview, app_init [EXTRACTED 1.00]
- **Chantier « une seule lampe à la fois » (20/07 au soir)** — design_une_seule_lampe, design_body_has_due, design_trois_registres_commencer, design_sticky_suit_la_lampe, design_review_card, docs_superpowers_specs_2026_07_20_lampes_accueil_design_spec [EXTRACTED 1.00]
- **La colonne de lecture du carnet (20/07)** — design_regle_deux_colonnes, design_colonne, design_colonne_large, design_calibrage_avance_prose, design_piege_plancher_specificite, design_critere_titre_cadre [EXTRACTED 1.00]
- **Trajectoire des snapshots de critique (28 → 33 → 34 → 30/40, changement de slug)** — _impeccable_critique_2026_07_18t13_02_30z__index_html_critique, _impeccable_critique_2026_07_18t17_37_33z__index_html_critique, _impeccable_critique_2026_07_18t19_31_06z__index_html_critique, _impeccable_critique_2026_07_19t09_14_04z__app_html_critique, _impeccable_critique_2026_07_19t09_57_31z__vocabulaire_hebreu_html__audit_audit [EXTRACTED 1.00]
- **Chaîne de réversibilité du verdict SRS (signalée, généralisée, mesurée)** — _impeccable_critique_2026_07_18t13_02_30z__index_html_persistance_prefs, _impeccable_critique_2026_07_18t17_37_33z__index_html_undo_verdict, _impeccable_critique_2026_07_18t17_37_33z__index_html_champ_vide_noop, _impeccable_critique_2026_07_19t09_14_04z__app_html_reversibilite_invariant [INFERRED 0.85]
- **Infractions à la règle de la lampe recensées sur les trois fichiers** — _impeccable_critique_2026_07_19t09_14_04z__app_html_regle_de_la_lampe, _impeccable_critique_2026_07_19t09_14_04z__app_html_p0_start_fantome_dore, _impeccable_critique_2026_07_19t09_57_31z__vocabulaire_hebreu_html__audit_part_dore_au_repos, _impeccable_critique_2026_07_19t09_14_04z__app_html_correction_bandeau_lateral [EXTRACTED 1.00]
- **Les trois :root de la charte doivent rester identiques** — index_root_tokens [EXTRACTED 1.00]
- **Le portail en deux temps : accueil, bascule, portes** — index_accueil_overlay, index_body_entree_class, index_deux_portes, index_salut_aleatoire [EXTRACTED 1.00]

## Communities (24 total, 11 thin omitted)

### Community 0 - "Carnet — sections et contrat"
Cohesion: 0.09
Nodes (49): vocabulaire_hebreu.html — le carnet (source unique du contenu), Section Adjectifs (table), Section Adverbes (sous-thèmes Temps, Lieu & direction), Anneau de focus doré (:focus-visible outline or), Lien vers les flashcards (.app-link) + redirection file: vers le standalone, Section L'article défini (ha-), Section Patrons de conjugaison (binyanim), Blocs pédagogiques de la grammaire (.note, .steps, .example, .tip, .gram-title, .ex-title) (+41 more)

### Community 1 - "App — écran d’étude et réponse"
Cohesion: 0.09
Nodes (47): animateFace, answer, answerHtml, bigFr, bindTap, checkAnswer, doFlip, editDist (+39 more)

### Community 2 - "App — session, prefs et SRS"
Cohesion: 0.08
Nodes (47): applyFoldState, applyPrefs, beginSession, BUILD:ONLINE-ONLY fence, buildChips, buildNivChips, cardId, CARDS (word bank global) (+39 more)

### Community 3 - "Build du standalone"
Cohesion: 0.07
Nodes (37): APP, attrOf(), blocksOf(), closeOf(), decodeEntities(), exemplesOf(), EXPECTED_CATS, EXPECTED_LEVELS (+29 more)

### Community 4 - "Architecture documentée"
Cohesion: 0.06
Nodes (45): app.html — app de flashcards en ligne, audit_carnet_mecanique.js — étage 0 de l'audit, build.js — chaîne de génération du standalone, Schéma de carte {cat, he, tr, fr, he_plain, …}, Identité de carte vocalisée cat|he, Correction tolérante des réponses tapées (checkAnswer), Exemples en situation (564, couverture 100 % des trois tables), extractCards : double implémentation couplée (+37 more)

### Community 5 - "Critiques impeccable (portail)"
Cohesion: 0.07
Nodes (42): P1 — Recherche inaccessible au clavier, app muette pour lecteurs d'écran, Boucle de correction tolérante (normFr / frVariants / trKey / editDist), Critique index.html 18/07 13:02 — 28/40, 3 P1, P1 — « Commencer » désactivé sans explication, Design Health Score (10 heuristiques Nielsen sur 40), Méthode dual-agent (A revue design · B détecteur déterministe), Emojis d'interface — seule fuite hors charte « calme, studieux », P1 — Aucune persistance des réglages ni de la session (+34 more)

### Community 6 - "Audit mécanique du carnet"
Cohesion: 0.06
Nodes (31): APP, appSrc, CARDS, controleTexte(), donnees, drapeaux, drapeauxParCarte, erreurs (+23 more)

### Community 7 - "Icônes et identité visuelle"
Cohesion: 0.08
Nodes (31): loadVoices, reflectVoiceUi, voiceURI over localized voice name, DESIGN.md — Nuit d'encre / Or ancien token system, Bloc :root partagé (charte unifiée carnet + app), apple-touch-icon.png (icône PWA iOS), Format carré plein bord, sans marge ni texte, Glyphe א (alef) doré, plein cadre (+23 more)

### Community 8 - "Règles DESIGN.md"
Cohesion: 0.13
Nodes (20): Commutateur d'état body.has-due, Une colonne se calibre sur l'avance réelle de la prose, Jeton --colonne (28rem, prose), Jeton --colonne-large (56rem, cadre), Un titre prend le cadre s'il porte un filet ET ouvre sur un objet au cadre, DESIGN.md — « Le carnet d'étude du soir », Piège : main > *:not(.table-wrap) fait plancher de spécificité, La rampe de 8 pas du carnet (second bloc :root) (+12 more)

### Community 9 - "Standalone hors-ligne"
Cohesion: 0.19
Nodes (14): STANDALONE, Démarrage autonome (vocabulaire intégré), Écran de fin (#done), Instantané de cartes intégré (const CARDS), Mode QCM (standalone), Retrait de la clôture BUILD:ONLINE-ONLY, Préférences persistées (PREFS_KEY prefs_v1), Métadonnées PWA sans enregistrement du service worker (+6 more)

### Community 10 - "Pièges et chantiers"
Cohesion: 0.17
Nodes (13): Bloc :root de jetons partagés (charte unifiée), Colonne de lecture (--colonne 28rem / --colonne-large 56rem), Diagnostic de latence (perfReport, attente/travail/affichage), Anneau :focus-visible doré global, Invariant lang=he sur 100 % de l'hébreu, Piège transition:all — les outline-* figés par WebKit, Rampe typographique de 8 pas du carnet, Piège 13 : les contrôles iPhone-émulés sont aveugles au desktop (+5 more)

### Community 11 - "Icône 512 (manifest)"
Cohesion: 0.39
Nodes (8): icon-512.png — PWA large app icon, 512×512 square PNG, full-bleed flat background, no border or text, Golden aleph (א) glyph, centered, Nuit d'encre background + Or ancien glyph, Same golden aleph used as vector glyph on the portal welcome screen, Role: manifest/splash icon declared in manifest.webmanifest, Role: precached asset of the service worker, Regenerated when --bg / --gold design tokens change

### Community 12 - "Portail et couche PWA"
Cohesion: 0.67
Nodes (3): index.html — le portail, Couche PWA (manifest, sw.js, icônes), PWA installable et hors ligne (vue utilisateur)

## Ambiguous Edges - Review These
- `Format carré plein bord, sans marge ni texte` → `Rôle : icône d'écran d'accueil iOS (PWA installée)`  [AMBIGUOUS]
  icons/apple-touch-icon.png · relation: rationale_for
- `icon-512.png — PWA large app icon` → `Same golden aleph used as vector glyph on the portal welcome screen`  [AMBIGUOUS]
  icons/icon-512.png · relation: conceptually_related_to

## Knowledge Gaps
- **99 isolated node(s):** `fs`, `path`, `EXPECTED_CATS`, `EXPECTED_LEVELS`, `NAMED_ENTITIES` (+94 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Format carré plein bord, sans marge ni texte` and `Rôle : icône d'écran d'accueil iOS (PWA installée)`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **What is the exact relationship between `icon-512.png — PWA large app icon` and `Same golden aleph used as vector glyph on the portal welcome screen`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `flashcards_hebreu.html — Standalone hors-ligne (fichier généré)` connect `Standalone hors-ligne` to `Carnet — sections et contrat`, `App — session, prefs et SRS`, `Build du standalone`, `Icônes et identité visuelle`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **Why does `vocabulaire_hebreu.html — le carnet (source unique du contenu)` connect `Carnet — sections et contrat` to `Standalone hors-ligne`, `Icônes et identité visuelle`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `Instantané de cartes intégré (const CARDS)` connect `Standalone hors-ligne` to `App — session, prefs et SRS`, `Build du standalone`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `fs`, `path`, `EXPECTED_CATS` to the rest of the system?**
  _99 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Carnet — sections et contrat` be split into smaller, more focused modules?**
  _Cohesion score 0.08503401360544217 - nodes in this community are weakly interconnected._