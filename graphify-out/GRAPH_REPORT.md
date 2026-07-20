# Graph Report - /home/ruben/dev/flashcards-hebreu  (2026-07-20)

## Corpus Check
- 6 files · ~105,845 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 438 nodes · 658 edges · 31 communities (21 shown, 10 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 85 edges (avg confidence: 0.86)
- Token cost: 234,708 input · 0 output

## Community Hubs (Navigation)
- App runtime — modes et rendu de carte
- build.js — génération du fichier autonome
- Historique des critiques impeccable
- Fichier autonome — snapshot et modes
- Carnet — CSS, balisage et recherche
- Charte partagée, PWA et pièges de plateforme
- Écran de départ et couplage d'extraction
- Icônes PWA et identité de marque
- Le graphe, le rituel et l'outillage WSL
- Exemples en situation et validateur
- Schéma de carte, SRS et session
- Portail, README et décisions actées
- Les cinq fichiers et leurs garde-fous
- Le pli et les trois voix typographiques
- Icône PWA 512 px
- Niveaux CECRL et préférences persistées
- Rampe typographique et voix du carnet
- Ergonomie tactile et pistes ouvertes
- La règle de la lampe
- DESIGN.md et PRODUCT.md
- Palette et règles de couches
- Clavier hébreu — taillé pour un francophone
- Piles de polices — ça marche dans l'avion
- sw.js — liste d'assets
- Media queries d'accessibilité
- Le pointillé — rien ici
- But produit — tenir une conversation
- Une seule charte, carnet et app
- README — les trois modes
- README — le contenu du carnet
- README — installation PWA

## God Nodes (most connected - your core abstractions)
1. `render` - 20 edges
2. `extractCards()` - 12 edges
3. `applyPrefs` - 12 edges
4. `recordResult` - 12 edges
5. `state (global session + settings object)` - 11 edges
6. `Les pièges inline de CLAUDE.md (hors graphe, par conception)` - 11 edges
7. `buildChips` - 10 edges
8. `quizPick` - 10 edges
9. `Critique index.html 18/07 13:02 — 28/40, 3 P1` - 9 edges
10. `Critique index.html 18/07 17:37 — 33/40, 1 P1 (post-passes 1–5)` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Piège : un contrôle qui ne mesure rien passe toujours au vert` --semantically_similar_to--> `Les trois garde-fous contre la casse silencieuse`  [INFERRED] [semantically similar]
  TODO.md → ARCHITECTURE.md
- `Tirage aléatoire du salut français / hébreu` --semantically_similar_to--> `reflectVoiceUi`  [INFERRED] [semantically similar]
  index.html → app.html
- `index.html — Portail (page racine)` --references--> `apple-touch-icon.png (icône PWA iOS)`  [INFERRED]
  index.html → icons/apple-touch-icon.png
- `index.html — Portail (page racine)` --references--> `manifest.webmanifest — PWA manifest declaring the icons`  [EXTRACTED]
  index.html → icons/icon-192.png
- `Défaut réel : loadVoices() classait sur un champ localisé` --semantically_similar_to--> `Invariant lang="he" sur 100 % de l'hébreu`  [INFERRED] [semantically similar]
  TODO.md → ARCHITECTURE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **La chaîne d'extraction : du carnet aux cartes, en double implémentation** — architecture_carnet, architecture_contrat_balisage_carnet, architecture_extraction_couplage, architecture_lisof_profondeur, architecture_schema_carte, architecture_build_js, architecture_app_html, architecture_gardes_casse_silencieuse [EXTRACTED 1.00]
- **Les invariants de charte partagés par les trois fichiers HTML** — architecture_charte_tokens_root, architecture_anneau_focus_visible, architecture_piege_transition_all, architecture_font_size_22px_body, architecture_regle_de_la_lampe, architecture_regle_trois_voix, architecture_lang_he_invariant [EXTRACTED 1.00]
- **Le dossier « voix robotique » : de la déduction à la preuve** — architecture_synthese_vocale, architecture_plafond_webkit_voix, architecture_voiceuri_pas_name, todo_preuve_carmit_forbedret, todo_defaut_loadvoices_localise, todo_ligne_identifiant_detecteur, todo_dossier_voix_clos [EXTRACTED 1.00]
- **Le contrat d'extraction du carnet (ce que les deux extracteurs lisent)** — vocabulaire_hebreu_span_count_cle_extraction, vocabulaire_hebreu_ul_word_list, vocabulaire_hebreu_tables_positionnelles, vocabulaire_hebreu_ul_exemples, vocabulaire_hebreu_classification_data_niveau, vocabulaire_hebreu_contrat_de_balisage [EXTRACTED 1.00]
- **Le système typographique du carnet (rampe, voix, exceptions em)** — vocabulaire_hebreu_rampe_typographique, vocabulaire_hebreu_piege_rem_22px, vocabulaire_hebreu_regle_trois_voix, vocabulaire_hebreu_exception_115em, vocabulaire_hebreu_selecteur_span_lang_he_nu, vocabulaire_hebreu_polices_google [EXTRACTED 1.00]
- **Le pipeline de recherche du carnet (indexation, pliage, masquage en cascade)** — vocabulaire_hebreu_recherche_incrementale, vocabulaire_hebreu_norm_recherche, vocabulaire_hebreu_cascade_search_hidden, vocabulaire_hebreu_blocs_example, vocabulaire_hebreu_sommaire_trois_parties [EXTRACTED 1.00]
- **Les trois modes d'étude alimentent la même révision espacée** — flashcards_hebreu_mode_cartes, flashcards_hebreu_mode_saisie, flashcards_hebreu_mode_qcm, flashcards_hebreu_recordresult, flashcards_hebreu_render [EXTRACTED 1.00]
- **Autonomie hors ligne : snapshot intégré, pas de fetch, pas de service worker** — flashcards_hebreu_standalone_build, flashcards_hebreu_cards_snapshot, flashcards_hebreu_no_fetch, flashcards_hebreu_no_service_worker, flashcards_hebreu_generated_file_warning [INFERRED 0.95]
- **Trois clés de stockage local et leur effacement** — flashcards_hebreu_srs_persistence, flashcards_hebreu_prefs_persistence, flashcards_hebreu_session_persistence, flashcards_hebreu_resetprofile [EXTRACTED 1.00]
- **Trajectoire des snapshots de critique (28 → 33 → 34 → 30/40, changement de slug)** — _impeccable_critique_2026_07_18t13_02_30z__index_html_critique, _impeccable_critique_2026_07_18t17_37_33z__index_html_critique, _impeccable_critique_2026_07_18t19_31_06z__index_html_critique, _impeccable_critique_2026_07_19t09_14_04z__app_html_critique, _impeccable_critique_2026_07_19t09_57_31z__vocabulaire_hebreu_html__audit_audit [EXTRACTED 1.00]
- **Chaîne de réversibilité du verdict SRS (signalée, généralisée, mesurée)** — _impeccable_critique_2026_07_18t13_02_30z__index_html_persistance_prefs, _impeccable_critique_2026_07_18t17_37_33z__index_html_undo_verdict, _impeccable_critique_2026_07_18t17_37_33z__index_html_champ_vide_noop, _impeccable_critique_2026_07_19t09_14_04z__app_html_reversibilite_invariant [INFERRED 0.85]
- **Infractions à la règle de la lampe recensées sur les trois fichiers** — _impeccable_critique_2026_07_19t09_14_04z__app_html_regle_de_la_lampe, _impeccable_critique_2026_07_19t09_14_04z__app_html_p0_start_fantome_dore, _impeccable_critique_2026_07_19t09_57_31z__vocabulaire_hebreu_html__audit_part_dore_au_repos, _impeccable_critique_2026_07_19t09_14_04z__app_html_correction_bandeau_lateral [EXTRACTED 1.00]
- **Lenient answer-grading flow** — app_checkanswer, app_normfr, app_frvariants, app_normhe, app_trkey, app_he2tr, app_editdist [EXTRACTED 1.00]
- **SRS write / verdict-reversal flow across the three modes** — app_recordresult, app_undolastrecord, app_fixverdict, app_quizfixverdict, app_undocardanswer, app_srssave, app_cardid [EXTRACTED 1.00]
- **Boot: fetch notebook, extract, build chips, restore state** — app_init, app_extractcards, app_buildchips, app_buildnivchips, app_applyprefs, app_sessrestore, app_refreshsrsui, app_updatestart [EXTRACTED 1.00]
- **Les trois :root de la charte doivent rester identiques** — index_root_tokens [EXTRACTED 1.00]
- **Le portail en deux temps : accueil, bascule, portes** — index_accueil_overlay, index_body_entree_class, index_deux_portes, index_salut_aleatoire [EXTRACTED 1.00]

## Communities (31 total, 10 thin omitted)

### Community 0 - "App runtime — modes et rendu de carte"
Cohesion: 0.06
Nodes (72): Accessibility invariants (lang=he, live regions, role=button rows), animateFace, answer (cards-mode verdict), answerHtml, beginSession, bigFr, bindTap (pointerup + click guard), cardId (cat|he_plain identity) (+64 more)

### Community 1 - "build.js — génération du fichier autonome"
Cohesion: 0.07
Nodes (38): APP, attrOf(), blocksOf(), closeOf(), decodeEntities(), exemplesOf(), EXPECTED_CATS, EXPECTED_LEVELS (+30 more)

### Community 2 - "Historique des critiques impeccable"
Cohesion: 0.07
Nodes (42): P1 — Recherche inaccessible au clavier, app muette pour lecteurs d'écran, Boucle de correction tolérante (normFr / frVariants / trKey / editDist), Critique index.html 18/07 13:02 — 28/40, 3 P1, P1 — « Commencer » désactivé sans explication, Design Health Score (10 heuristiques Nielsen sur 40), Méthode dual-agent (A revue design · B détecteur déterministe), Emojis d'interface — seule fuite hors charte « calme, studieux », P1 — Aucune persistance des réglages ni de la session (+34 more)

### Community 3 - "Fichier autonome — snapshot et modes"
Cohesion: 0.08
Nodes (37): beginSession / limitPool / start, Card object schema (cat/he/tr/fr/forms/exemples/niveau/he_plain), Embedded CARDS snapshot (713 cards, 17 categories), checkAnswer, Filtres catégories et niveaux (buildChips, buildNivChips), Bloc :root de la charte unifiée, dueCards, finish — écran de fin et score (+29 more)

### Community 4 - "Carnet — CSS, balisage et recherche"
Cohesion: 0.07
Nodes (34): Blocs .example / .ex-title — recettes et exemples pédagogiques hors cartes, Le carnet (vocabulaire_hebreu.html) — source unique de vérité, Cascade .search-hidden (entrée → table-wrap → subtheme → section → part), Bloc :root partagé (charte unifiée carnet + app), Classification CECR data-niveau (A1 328 / A2 271 / B1 107 / B2 7), color-mix avec repli plein sur --bg (barre de recherche collante), .attention — encadré à filet plein (contraire de .empty), .gram-title — titre de sous-section de grammaire (composant extrait) (+26 more)

### Community 5 - "Charte partagée, PWA et pièges de plateforme"
Cohesion: 0.08
Nodes (33): Passes d'accessibilité du carnet (2026-07-19), Anneau :focus-visible doré global (les trois fichiers), Bloc :root des 11 jetons de charte, identique au caractère près, La couche PWA (manifest, sw.js, icônes), Déploiement : pousser sur main, sans étape de build CI, flashcards_hebreu.html — le build autonome hors ligne, font-size:22px sur body, jamais sur html — 1rem vaut 16px, Garde prefers-reduced-motion avec scroll-behavior:auto (+25 more)

### Community 6 - "Écran de départ et couplage d'extraction"
Cohesion: 0.11
Nodes (32): applyFoldState, applyPrefs, BUILD:ONLINE-ONLY fence, buildChips, buildNivChips, catOrder (canonical category order), Empty first launch (no default selection), extractCards (+24 more)

### Community 7 - "Icônes PWA et identité de marque"
Cohesion: 0.09
Nodes (27): reflectVoiceUi, DESIGN.md — Nuit d'encre / Or ancien token system, apple-touch-icon.png (icône PWA iOS), Format carré plein bord, sans marge ni texte, Glyphe א (alef) doré, plein cadre, Une seule lettre comme signature de marque, Palette Nuit d'encre + Or ancien de l'icône, Rôle : icône d'écran d'accueil iOS (PWA installée) (+19 more)

### Community 8 - "Le graphe, le rituel et l'outillage WSL"
Cohesion: 0.17
Nodes (13): Le graphe de connaissance du dépôt (graphify-out/), Limite du graphe : dérive d'identifiants entre lots d'extraction, Limite du graphe : chaque fichier déployé apparaît en double, Piège 12 : outillage WSL — Playwright/WebKit, jamais Chrome headless système, Interroger le graphe avant d'ouvrir un fichier, Retrait des ancres « near line NNN » de CLAUDE.md, Le rituel après toute modification (7 étapes), Dérive des ancres de lignes (quatre fois) (+5 more)

### Community 9 - "Exemples en situation et validateur"
Cohesion: 0.24
Nodes (11): Les exemples en situation (ul.exemples) et leur ligne éditoriale, Garde-fou : les ul.exemples sont exclus du balayage du lexique, Garde-fou : un mot de grammaire ne peut qu'ajouter au niveau 0, Le lexique du validateur (cartes + hébreu de grammaire), Les <li> imbriqués interdisent les regex non-gourmandes, Le standard de translittération maison, trKey / he2tr — convergence vers la même forme canonique, verifie_exemples.js — filet de sécurité des exemples (+3 more)

### Community 10 - "Schéma de carte, SRS et session"
Cohesion: 0.24
Nodes (10): Attributs data-* des entrées (data-fr-court, data-note, data-niveau), checkAnswer — correction tolérante ('exact' | 'almost' | false), Les quatre écrans d'app.html (#loader, #setup, #study, #done), Instantané de session (sess_v1) et abandon propre, limitPool — longueur de session appliquée après le mélange, pickDistractors — options du QCM sans quasi-synonymes, Remise à zéro du profil (confirmation en deux temps), Révision espacée — système de Leitner (srs_v1) (+2 more)

### Community 11 - "Portail, README et décisions actées"
Cohesion: 0.22
Nodes (10): index.html — le portail, Règle de la lampe — aucune surface dorée au repos, Le pointillé ne veut dire qu'une chose : « rien ici », README : la liste des fichiers du dépôt, README : le dossier graphify-out/ (aide au développement, non déployée), Avertissements du validateur soldés : 31 → 2, Une incohérence se corrige dans l'exemple, jamais dans l'entrée, Décisions actées (ne pas re-débattre sans nouvelle demande) (+2 more)

### Community 12 - "Les cinq fichiers et leurs garde-fous"
Cohesion: 0.36
Nodes (9): app.html — l'app de flashcards en ligne, build.js — chaîne de génération du fichier autonome, vocabulaire_hebreu.html — le carnet, source unique de vérité, Contrat de balisage du carnet (labels .count, tables, ul.word-list), Le couplage d'extraction : extractCards existe deux fois, Les trois garde-fous contre la casse silencieuse, mustReplace — remplacements ancrés qui échouent bruyamment, app.html doit être servi en HTTP, jamais en file:// (+1 more)

### Community 13 - "Le pli et les trois voix typographiques"
Cohesion: 0.22
Nodes (9): Le pli <details class="adv"> — Catégories, Niveau, Réglages avancés, Règle des trois voix — tout hébreu se compose en Frank Ruhl, Voix Repère-mono (JetBrains Mono / 0,7rem / 0,14em), Voix Title (Assistant 700 / 0,84rem / 0,12em / or), Un <h2> devenu rangée de pli quitte la voix Title, Les 11 piles de polices tronquées d'app.html complétées, « Catégories » et « Niveau » repliés (1278 → 874 px, 43 → 35 arrêts), Un pli condense, il ne cache pas (+1 more)

### Community 14 - "Icône PWA 512 px"
Cohesion: 0.39
Nodes (8): icon-512.png — PWA large app icon, 512×512 square PNG, full-bleed flat background, no border or text, Golden aleph (א) glyph, centered, Nuit d'encre background + Or ancien glyph, Same golden aleph used as vector glyph on the portal welcome screen, Role: manifest/splash icon declared in manifest.webmanifest, Role: precached asset of the service worker, Regenerated when --bg / --gold design tokens change

### Community 15 - "Niveaux CECRL et préférences persistées"
Cohesion: 0.29
Nodes (7): Garde de couverture des niveaux dans build.js, Méthode de classement des niveaux (trois critères croisés), Niveaux CECRL — data-niveau A1…C2 replié en quatre libellés, Préférences persistées (prefs_v1) et premier lancement vierge, Réglages segmentés (SEG_KEYS, chips data-*, state), Piège : un contrôle qui ne mesure rien passe toujours au vert, Piste B — « Facile » comme vrai contrat (question périmée)

### Community 16 - "Rampe typographique et voix du carnet"
Cohesion: 0.29
Nodes (7): Le pli (details/summary : condense, ne cache pas), La rampe de 8 pas du carnet (--pas-titre … --pas-micro), La règle de la vedette, La règle des trois voix, La voix Repère-mono (JetBrains Mono / 0.7rem / 0.14em), La voix Title (Assistant 700 / 0.84rem / 0.12em / or), Principe : l'hébreu est la vedette

### Community 17 - "Ergonomie tactile et pistes ouvertes"
Cohesion: 0.40
Nodes (5): Bloc @media (pointer:coarse) — cibles tactiles à 44 px, « Commencer » sticky sous le pouce, seulement quand il est actif, Clavier hébreu virtuel réservé au bureau, Critique impeccable du portail et de l'app (30/40), Piste A — les deux « lampes » de l'accueil

### Community 18 - "La règle de la lampe"
Cohesion: 0.50
Nodes (4): Carte « Révision du jour » (seule surface dorée au repos), CTA sous le pouce (start sticky, jamais doré ni collant désactivé), La règle de la lampe, Principe : le calme soutient l'étude

### Community 19 - "DESIGN.md et PRODUCT.md"
Cohesion: 0.67
Nodes (3): DESIGN.md — Design System « Le carnet d'étude du soir », PRODUCT.md — registre, utilisateurs, principes, Anti-références (Duolingo, SaaS générique, manuel austère)

### Community 20 - "Palette et règles de couches"
Cohesion: 0.67
Nodes (3): Palette Nuit d'encre & Or ancien, La règle de la carte unique, La règle des couches

## Ambiguous Edges - Review These
- `Format carré plein bord, sans marge ni texte` → `Rôle : icône d'écran d'accueil iOS (PWA installée)`  [AMBIGUOUS]
  icons/apple-touch-icon.png · relation: rationale_for
- `icon-512.png — PWA large app icon` → `Same golden aleph used as vector glyph on the portal welcome screen`  [AMBIGUOUS]
  icons/icon-512.png · relation: conceptually_related_to
- `Absence de l'enregistrement du service worker` → `En-tête PWA (manifest, theme-color, apple-touch-icon)`  [AMBIGUOUS]
  flashcards_hebreu.html · relation: conceptually_related_to

## Knowledge Gaps
- **64 isolated node(s):** `fs`, `path`, `STANDALONE`, `EXPECTED_CATS`, `EXPECTED_LEVELS` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Format carré plein bord, sans marge ni texte` and `Rôle : icône d'écran d'accueil iOS (PWA installée)`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **What is the exact relationship between `icon-512.png — PWA large app icon` and `Same golden aleph used as vector glyph on the portal welcome screen`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Absence de l'enregistrement du service worker` and `En-tête PWA (manifest, theme-color, apple-touch-icon)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `loadVoices` connect `App runtime — modes et rendu de carte` to `Icônes PWA et identité de marque`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `reflectVoiceUi` connect `Icônes PWA et identité de marque` to `App runtime — modes et rendu de carte`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `applyPrefs` (e.g. with `Persistence layer (prefs_v1 / srs_v1 / sess_v1)` and `sessRestore`) actually correct?**
  _`applyPrefs` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fs`, `path`, `STANDALONE` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._