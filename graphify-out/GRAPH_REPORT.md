# Graph Report - .  (2026-07-20)

## Corpus Check
- 24 files · ~103,523 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 357 nodes · 604 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 1% AMBIGUOUS · INFERRED: 77 edges (avg confidence: 0.88)
- Token cost: 118,964 input · 0 output

## Community Hubs (Navigation)
- Moteur d'étude : correction, verdicts et Leitner
- Cartographie documentaire du dépôt
- Génération et validation (build.js)
- Le carnet : balisage et accessibilité
- Critiques design et correctifs
- Amorçage, préférences et filtres
- Portail et icône iOS
- Icône PWA 192px
- Icône PWA 512px
- Voix typographiques et rampe
- La règle de la lampe
- Registre produit et anti-références
- Palette et règles de surface
- Clavier hébreu et public francophone
- Polices normatives et hors-ligne
- Service worker et cache
- But : tenir une conversation
- Charte unique carnet + app

## God Nodes (most connected - your core abstractions)
1. `render` - 20 edges
2. `extractCards()` - 13 edges
3. `Le graphe de connaissance du dépôt (graphify-out/)` - 13 edges
4. `applyPrefs` - 12 edges
5. `recordResult` - 12 edges
6. `Les douze pièges prophylactiques de CLAUDE.md` - 12 edges
7. `state (global session + settings object)` - 11 edges
8. `vocabulaire_hebreu.html — le carnet (source unique de vérité)` - 11 edges
9. `buildChips` - 10 edges
10. `quizPick` - 10 edges

## Surprising Connections (you probably didn't know these)
- `const CARDS — instantané du vocabulaire embarqué` --shares_data_with--> `extractCards()`  [INFERRED]
  flashcards_hebreu.html → build.js
- `Le couplage d'extraction (extractCards implémenté deux fois)` --references--> `lisOf()`  [EXTRACTED]
  ARCHITECTURE.md → build.js
- `Tirage aléatoire du salut français / hébreu` --semantically_similar_to--> `reflectVoiceUi`  [INFERRED] [semantically similar]
  index.html → app.html
- `index.html — Portail (page racine)` --references--> `apple-touch-icon.png (icône PWA iOS)`  [INFERRED]
  index.html → icons/apple-touch-icon.png
- `index.html — Portail (page racine)` --references--> `manifest.webmanifest — PWA manifest declaring the icons`  [EXTRACTED]
  index.html → icons/icon-192.png

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Trajectoire des snapshots de critique (28 → 33 → 34 → 30/40, changement de slug)** — _impeccable_critique_2026_07_18t13_02_30z__index_html_critique, _impeccable_critique_2026_07_18t17_37_33z__index_html_critique, _impeccable_critique_2026_07_18t19_31_06z__index_html_critique, _impeccable_critique_2026_07_19t09_14_04z__app_html_critique, _impeccable_critique_2026_07_19t09_57_31z__vocabulaire_hebreu_html__audit_audit [EXTRACTED 1.00]
- **Chaîne de réversibilité du verdict SRS (signalée, généralisée, mesurée)** — _impeccable_critique_2026_07_18t13_02_30z__index_html_persistance_prefs, _impeccable_critique_2026_07_18t17_37_33z__index_html_undo_verdict, _impeccable_critique_2026_07_18t17_37_33z__index_html_champ_vide_noop, _impeccable_critique_2026_07_19t09_14_04z__app_html_reversibilite_invariant [INFERRED 0.85]
- **Infractions à la règle de la lampe recensées sur les trois fichiers** — _impeccable_critique_2026_07_19t09_14_04z__app_html_regle_de_la_lampe, _impeccable_critique_2026_07_19t09_14_04z__app_html_p0_start_fantome_dore, _impeccable_critique_2026_07_19t09_57_31z__vocabulaire_hebreu_html__audit_part_dore_au_repos, _impeccable_critique_2026_07_19t09_14_04z__app_html_correction_bandeau_lateral [EXTRACTED 1.00]
- **Lenient answer-grading flow** — app_checkanswer, app_normfr, app_frvariants, app_normhe, app_trkey, app_he2tr, app_editdist [EXTRACTED 1.00]
- **SRS write / verdict-reversal flow across the three modes** — app_recordresult, app_undolastrecord, app_fixverdict, app_quizfixverdict, app_undocardanswer, app_srssave, app_cardid [EXTRACTED 1.00]
- **Boot: fetch notebook, extract, build chips, restore state** — app_init, app_extractcards, app_buildchips, app_buildnivchips, app_applyprefs, app_sessrestore, app_refreshsrsui, app_updatestart [EXTRACTED 1.00]
- **build.js fusionne app.html et le carnet en flashcards autonomes** — vocabulaire_hebreu_notebook, flashcards_hebreu_standalone, flashcards_hebreu_cards_snapshot [EXTRACTED 1.00]
- **Les trois :root de la charte doivent rester identiques** — index_root_tokens, vocabulaire_hebreu_root_tokens [EXTRACTED 1.00]
- **Le portail en deux temps : accueil, bascule, portes** — index_accueil_overlay, index_body_entree_class, index_deux_portes, index_salut_aleatoire [EXTRACTED 1.00]
- **Contrat de balisage exploité par l'extraction des cartes** — vocabulaire_hebreu_count_label, vocabulaire_hebreu_field_spans, vocabulaire_hebreu_word_list, vocabulaire_hebreu_tables, vocabulaire_hebreu_data_niveau, vocabulaire_hebreu_exemples [EXTRACTED 1.00]
- **Chaîne de recherche : index → normalisation → filtrage → surlignage** — vocabulaire_hebreu_search_index, vocabulaire_hebreu_norm, vocabulaire_hebreu_run, vocabulaire_hebreu_highlight, vocabulaire_hebreu_search_hidden [EXTRACTED 1.00]
- **Système typographique : rampe, deux voix nommées, hébreu en prose** — vocabulaire_hebreu_type_ramp, vocabulaire_hebreu_voice_title, vocabulaire_hebreu_voice_repere_mono, vocabulaire_hebreu_hebrew_in_prose, vocabulaire_hebreu_rem_pitfall [INFERRED 0.85]
- **Le graphe remplace les ancres de lignes dérivantes** — architecture_knowledge_graph, claude_query_graph_first, claude_line_anchor_drift, todo_anchor_recalibration, architecture_graph_staleness_caveat [EXTRACTED 1.00]
- **La famille des gardes de couverture (niveaux, exemples, extraction)** — architecture_level_coverage_guard, architecture_example_coverage_rule, architecture_silent_breakage_guards, architecture_validator_lexicon_guards [INFERRED 0.85]
- **Le rituel après toute modification (build, validation, graphe, docs)** — todo_rituel, claude_ritual, architecture_content_change_checklist, architecture_build_js, architecture_verifie_exemples_js, architecture_knowledge_graph [EXTRACTED 1.00]

## Communities (18 total, 5 thin omitted)

### Community 0 - "Moteur d'étude : correction, verdicts et Leitner"
Cohesion: 0.06
Nodes (67): Accessibility invariants (lang=he, live regions, role=button rows), animateFace, answer (cards-mode verdict), answerHtml, beginSession, bigFr, bindTap (pointerup + click guard), cardId (cat|he_plain identity) (+59 more)

### Community 1 - "Cartographie documentaire du dépôt"
Cohesion: 0.08
Nodes (54): Invariants d'accessibilité de l'app, app.html — l'application de flashcards en ligne, build.js — chaîne de génération du fichier autonome, La barrière BUILD:ONLINE-ONLY, Schéma de carte produit par l'extraction, Les niveaux CECRL (data-niveau) et leur repli en quatre paliers, checkAnswer — la correction tolérante des réponses tapées, Check-list d'une modification de contenu (+46 more)

### Community 2 - "Génération et validation (build.js)"
Cohesion: 0.07
Nodes (38): APP, attrOf(), blocksOf(), closeOf(), decodeEntities(), exemplesOf(), EXPECTED_CATS, EXPECTED_LEVELS (+30 more)

### Community 3 - "Le carnet : balisage et accessibilité"
Cohesion: 0.06
Nodes (46): Couche d'accessibilité du carnet, Repli du lien app vers la version autonome en protocole file:, clearHighlights() — retrait des mark.hl, span.count dans les <h2> — clé de section, Script de génération des lignes cursives, Convention : bordure pointillée = « rien ici » (.empty vs .attention), Attributs data-fr-court et data-note, Attribut data-niveau (CEFR A1–C2), 713 occurrences (+38 more)

### Community 4 - "Critiques design et correctifs"
Cohesion: 0.07
Nodes (42): P1 — Recherche inaccessible au clavier, app muette pour lecteurs d'écran, Boucle de correction tolérante (normFr / frVariants / trKey / editDist), Critique index.html 18/07 13:02 — 28/40, 3 P1, P1 — « Commencer » désactivé sans explication, Design Health Score (10 heuristiques Nielsen sur 40), Méthode dual-agent (A revue design · B détecteur déterministe), Emojis d'interface — seule fuite hors charte « calme, studieux », P1 — Aucune persistance des réglages ni de la session (+34 more)

### Community 5 - "Amorçage, préférences et filtres"
Cohesion: 0.09
Nodes (40): applyFoldState, applyPrefs, BUILD:ONLINE-ONLY fence, buildChips, buildNivChips, CARDS (runtime card array), catOrder (canonical category order), Empty first launch (no default selection) (+32 more)

### Community 6 - "Portail et icône iOS"
Cohesion: 0.14
Nodes (18): reflectVoiceUi, apple-touch-icon.png (icône PWA iOS), Format carré plein bord, sans marge ni texte, Glyphe א (alef) doré, plein cadre, Une seule lettre comme signature de marque, Palette Nuit d'encre + Or ancien de l'icône, Rôle : icône d'écran d'accueil iOS (PWA installée), Garde prefers-reduced-motion + anneau de focus or (+10 more)

### Community 7 - "Icône PWA 192px"
Cohesion: 0.28
Nodes (9): DESIGN.md — Nuit d'encre / Or ancien token system, icon-192.png — PWA app icon (192×192), Format — 192px square PNG, rounded-corner full-bleed tile, centered glyph, Golden aleph (א) glyph — the icon's sole mark, Icon palette — Nuit d'encre background, Or ancien glyph, Regeneration rule — icons must be redrawn if --bg/--gold tokens change, Role — installable PWA home-screen icon, index.html portal — golden א vector glyph on the welcome screen (+1 more)

### Community 8 - "Icône PWA 512px"
Cohesion: 0.39
Nodes (8): icon-512.png — PWA large app icon, 512×512 square PNG, full-bleed flat background, no border or text, Golden aleph (א) glyph, centered, Nuit d'encre background + Or ancien glyph, Same golden aleph used as vector glyph on the portal welcome screen, Role: manifest/splash icon declared in manifest.webmanifest, Role: precached asset of the service worker, Regenerated when --bg / --gold design tokens change

### Community 9 - "Voix typographiques et rampe"
Cohesion: 0.29
Nodes (7): Le pli (details/summary : condense, ne cache pas), La rampe de 8 pas du carnet (--pas-titre … --pas-micro), La règle de la vedette, La règle des trois voix, La voix Repère-mono (JetBrains Mono / 0.7rem / 0.14em), La voix Title (Assistant 700 / 0.84rem / 0.12em / or), Principe : l'hébreu est la vedette

### Community 10 - "La règle de la lampe"
Cohesion: 0.50
Nodes (4): Carte « Révision du jour » (seule surface dorée au repos), CTA sous le pouce (start sticky, jamais doré ni collant désactivé), La règle de la lampe, Principe : le calme soutient l'étude

### Community 11 - "Registre produit et anti-références"
Cohesion: 0.67
Nodes (3): DESIGN.md — Design System « Le carnet d'étude du soir », PRODUCT.md — registre, utilisateurs, principes, Anti-références (Duolingo, SaaS générique, manuel austère)

### Community 12 - "Palette et règles de surface"
Cohesion: 0.67
Nodes (3): Palette Nuit d'encre & Or ancien, La règle de la carte unique, La règle des couches

## Ambiguous Edges - Review These
- `Contrat de balisage pour l'extraction des cartes` → `Sections de grammaire (racine, passé, futur, binyanim, article, smikhut…)`  [AMBIGUOUS]
  vocabulaire_hebreu.html · relation: conceptually_related_to
- `Format carré plein bord, sans marge ni texte` → `Rôle : icône d'écran d'accueil iOS (PWA installée)`  [AMBIGUOUS]
  icons/apple-touch-icon.png · relation: rationale_for
- `icon-512.png — PWA large app icon` → `Same golden aleph used as vector glyph on the portal welcome screen`  [AMBIGUOUS]
  icons/icon-512.png · relation: conceptually_related_to
- `index.html — le portail (accueil en deux temps)` → `Piste de design A : les deux « lampes » de l'accueil`  [AMBIGUOUS]
  TODO.md · relation: references

## Knowledge Gaps
- **56 isolated node(s):** `fs`, `path`, `STANDALONE`, `EXPECTED_CATS`, `EXPECTED_LEVELS` (+51 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Contrat de balisage pour l'extraction des cartes` and `Sections de grammaire (racine, passé, futur, binyanim, article, smikhut…)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Format carré plein bord, sans marge ni texte` and `Rôle : icône d'écran d'accueil iOS (PWA installée)`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **What is the exact relationship between `icon-512.png — PWA large app icon` and `Same golden aleph used as vector glyph on the portal welcome screen`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `index.html — le portail (accueil en deux temps)` and `Piste de design A : les deux « lampes » de l'accueil`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `flashcards_hebreu.html — flashcards autonomes (fichier généré)` connect `Amorçage, préférences et filtres` to `Le carnet : balisage et accessibilité`, `Portail et icône iOS`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **Why does `Carnet de vocabulaire hébreu (vocabulaire_hebreu.html)` connect `Le carnet : balisage et accessibilité` to `Amorçage, préférences et filtres`, `Portail et icône iOS`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `extractCards()` (e.g. with `build.js` and `const CARDS — instantané du vocabulaire embarqué`) actually correct?**
  _`extractCards()` has 2 INFERRED edges - model-reasoned connections that need verification._