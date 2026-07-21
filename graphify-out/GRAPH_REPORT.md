# Graph Report - .  (2026-07-21)

## Corpus Check
- 10 files · ~119,752 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 335 nodes · 511 edges · 28 communities (18 shown, 10 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 59 edges (avg confidence: 0.89)
- Token cost: 390,866 input · 0 output

## Community Hubs (Navigation)
- Audit mécanique du carnet
- App : session et préférences
- App : rendu des cartes
- Build du standalone
- Pièges et outillage
- Carnet : contrat de balisage
- Contrat d extraction et schéma
- Validateur d exemples
- App : boot et extraction
- App : réponse et QCM
- App : voix et recherche
- PWA : icône 192 et manifest
- Règles de design nommées
- PWA : icône 512
- PWA : icône Apple
- Portail d accueil
- Typo : polices et clavier
- Typo : le pli et registres
- Produit
- Produit : aisance orale
- Produit : hors-ligne avion
- Produit : charte unique
- Produit : le calme
- Produit : hébreu vedette
- Produit : taille francophone
- README : mise à jour auto
- README : révision du jour
- README : trois modes

## God Nodes (most connected - your core abstractions)
1. `render` - 19 edges
2. `extractCards()` - 15 edges
3. `Les 14 pièges (inline, hors graphe)` - 14 edges
4. `recordResult` - 11 edges
5. `he2tr` - 11 edges
6. `Révision espacée (système de Leitner, localStorage srs_v1)` - 11 edges
7. `buildChips` - 10 edges
8. `quizPick` - 9 edges
9. `checkAnswer` - 9 edges
10. `extractCards` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Le contrat de balisage du carnet (clé d'extraction)` --references--> `extractCards()`  [EXTRACTED]
  ARCHITECTURE.md → build.js
- `extractCards()` --shares_data_with--> `Instantané de cartes intégré (const CARDS)`  [INFERRED]
  build.js → flashcards_hebreu.html
- `Le couplage d'extraction (deux extracteurs miroirs)` --references--> `extractCards()`  [EXTRACTED]
  CLAUDE.md → build.js
- `Démarrage autonome (vocabulaire intégré)` --conceptually_related_to--> `mustReplace()`  [INFERRED]
  flashcards_hebreu.html → build.js
- `PWA installable et hors ligne (vue utilisateur)` --semantically_similar_to--> `La couche PWA (manifest, sw.js, icônes)`  [INFERRED] [semantically similar]
  README.md → ARCHITECTURE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Le contrat d'extraction — ce que extractCards et build.js scrutent ensemble** — vocabulaire_hebreu_markup_contract, vocabulaire_hebreu_count_label_convention, vocabulaire_hebreu_word_list_markup, vocabulaire_hebreu_table_markup, vocabulaire_hebreu_exemples_markup, vocabulaire_hebreu_data_niveau_attribute, vocabulaire_hebreu_he_tr_fr_spans [INFERRED 0.95]
- **Les trois blocs :root du carnet — charte partagée / rampe locale / colonne, jamais fusionnés** — vocabulaire_hebreu_root_design_tokens, vocabulaire_hebreu_root_type_ramp, vocabulaire_hebreu_root_reading_column [EXTRACTED 1.00]
- **Extraction positionnelle des trois tables (Verbes ≥5, Adjectifs ≥4, Noms ≥3 colonnes)** — vocabulaire_hebreu_sec_verbes, vocabulaire_hebreu_sec_adjectifs, vocabulaire_hebreu_sec_noms, vocabulaire_hebreu_table_markup [EXTRACTED 1.00]
- **Provenance du build standalone (app.html + carnet → build.js → fichier généré)** — build, flashcards_hebreu_standalone [EXTRACTED 1.00]
- **Flux de révision espacée (Leitner, srs_v1)** — app_cardid, app_todaynum, app_srsload, app_srssave, app_srsmigrateids, app_recordresult, app_undolastrecord, app_duecards, app_masterystats, app_refreshsrsui, app_startreview [EXTRACTED 1.00]
- **Flux de réponse du mode Saisie (vérification tolérante + verdict corrigeable)** — app_submitanswer, app_checkanswer, app_showinputfeedback, app_answerhtml, app_fixverdict, app_skipanswer, app_nextafterinput [EXTRACTED 1.00]
- **Flux de démarrage (fetch du carnet → extraction → construction de l'accueil)** — app_init, app_extractcards, app_buildchips, app_applyprefs, app_sessrestore, app_updatestart, app_showloadererror [EXTRACTED 1.00]
- **Les règles nommées de la charte visuelle** — design_regle_de_la_lampe, design_regle_des_couches, design_regle_des_trois_voix, design_regle_de_la_vedette, design_regle_carte_unique, design_le_pli [EXTRACTED 1.00]
- **Le couplage critique des deux extracteurs et ses gardes** — claude_extraction_coupling, architecture_extraction_contract, architecture_silent_breakage_guards, architecture_card_schema, app_extractcards, build_extractcards [EXTRACTED 1.00]
- **Le workflow d'économie de contexte (graphe + sous-agents + recalage conditionnel)** — claude_knowledge_graph_first_workflow, claude_subagent_regime, claude_graph_refresh_rule, architecture_repo_knowledge_graph [INFERRED 0.85]

## Communities (28 total, 10 thin omitted)

### Community 0 - "Audit mécanique du carnet"
Cohesion: 0.06
Nodes (31): APP, appSrc, CARDS, controleTexte(), donnees, drapeaux, drapeauxParCarte, erreurs (+23 more)

### Community 1 - "App : session et préférences"
Cohesion: 0.11
Nodes (36): applyFoldState, applyPrefs, beginSession, buildChips, buildNivChips, cardId, closeConfirm, dueCards (+28 more)

### Community 2 - "App : rendu des cartes"
Cohesion: 0.13
Nodes (32): animateFace, answer, answerHtml, bigFr, Clavier hébreu virtuel (3 rangées, finales en doré), doFlip, escapeHtml, exHtml (+24 more)

### Community 3 - "Build du standalone"
Cohesion: 0.13
Nodes (29): APP, attrOf(), blocksOf(), closeOf(), decodeEntities(), exemplesOf(), EXPECTED_CATS, EXPECTED_LEVELS (+21 more)

### Community 4 - "Pièges et outillage"
Cohesion: 0.08
Nodes (29): Accessibilité du carnet (lot du 19/07), Charte graphique unifiée : le bloc :root de 11 jetons, Le bloc « Diagnostic de latence » (Réglages avancés), La couche PWA (manifest, sw.js, icônes), Stratégie stale-while-revalidate du service worker, Vérification sans navigateur graphique (Playwright WebKit + jsdom), Les 14 pièges (inline, hors graphe), Piège 14 : une mesure d'émulation ne vaut qu'en A/B, jamais en absolu (+21 more)

### Community 5 - "Carnet : contrat de balisage"
Cohesion: 0.13
Nodes (25): Script de bascule du lien flashcards en protocole file:, Convention h2 > span.count — le libellé exact est la clé de section, Script de génération des lignes cursives (stripNikud), Attribut data-niveau (niveau CECR obligatoire), vocabulaire_hebreu.html — Le carnet de vocabulaire (source de vérité), Convention .empty — le pointillé ne dit que « rien ici », Balisage ul.exemples (exemple obligatoire par entrée de table), Anneau de focus doré (:focus-visible, idiome des trois fichiers) (+17 more)

### Community 6 - "Contrat d extraction et schéma"
Cohesion: 0.09
Nodes (24): Identité de carte vocalisée cat|he, Le schéma de carte produit (ARCHITECTURE §3), Niveaux CECRL fins et repli en quatre libellés, Les exemples en situation (ligne éditoriale), Le contrat de balisage du carnet (clé d'extraction), Révision espacée (système de Leitner), Le graphe de connaissance du dépôt (graphify-out/), Garde-fous contre la casse silencieuse (+16 more)

### Community 7 - "Validateur d exemples"
Cohesion: 0.09
Nodes (13): appSrc, cards, CATS_COUVERTES, errors, { extractCards, NOTEBOOK, APP }, fs, horsExemples, LEVELS (+5 more)

### Community 8 - "App : boot et extraction"
Cohesion: 0.18
Nodes (16): Fence BUILD:ONLINE-ONLY (bloc remplacé par build.js dans le standalone), Diagnostic de latence (attente/travail/affichage, Réglages avancés), exOf (inner de extractCards), extractCards, Chargement du carnet par fetch() au boot (cache:no-store, DOMParser), firstText, fmtMs, init (+8 more)

### Community 9 - "App : réponse et QCM"
Cohesion: 0.24
Nodes (15): checkAnswer, editDist, frShort, frVariants, he2tr, normFr, normHe, pickDistractors (+7 more)

### Community 10 - "App : voix et recherche"
Cohesion: 0.21
Nodes (12): bindTap, Diagnostic de la voix hébraïque (nom + voiceURI affichés dans les réglages), exActivate, exBind, loadVoices, Recherche dynamique dans la banque de mots (accueil), reflectVoiceUi, runSearch (+4 more)

### Community 11 - "PWA : icône 192 et manifest"
Cohesion: 0.24
Nodes (10): DESIGN.md — Nuit d'encre / Or ancien token system, icon-192.png — PWA app icon (192×192), Format — 192px square PNG, rounded-corner full-bleed tile, centered glyph, Golden aleph (א) glyph — the icon's sole mark, Icon palette — Nuit d'encre background, Or ancien glyph, Regeneration rule — icons must be redrawn if --bg/--gold tokens change, Role — installable PWA home-screen icon, index.html portal — golden א vector glyph on the welcome screen (+2 more)

### Community 12 - "Règles de design nommées"
Cohesion: 0.25
Nodes (9): Piège 7 : jamais d'or sur un état inactif ni de surface dorée au repos, Les trois anti-références (Duolingo, SaaS générique, manuel austère), North Star : « Le carnet d'étude du soir », Carte « Révision du jour » (composant signature), CTA sous le pouce (sticky « Commencer »), Le pointillé ne dit qu'une chose : « rien ici », La règle de la lampe, Les trois registres de « Commencer » (lampe / secondaire / désactivé) (+1 more)

### Community 13 - "PWA : icône 512"
Cohesion: 0.39
Nodes (8): icon-512.png — PWA large app icon, 512×512 square PNG, full-bleed flat background, no border or text, Golden aleph (א) glyph, centered, Nuit d'encre background + Or ancien glyph, Same golden aleph used as vector glyph on the portal welcome screen, Role: manifest/splash icon declared in manifest.webmanifest, Role: precached asset of the service worker, Regenerated when --bg / --gold design tokens change

### Community 14 - "PWA : icône Apple"
Cohesion: 0.40
Nodes (6): apple-touch-icon.png (icône PWA iOS), Format carré plein bord, sans marge ni texte, Glyphe א (alef) doré, plein cadre, Une seule lettre comme signature de marque, Palette Nuit d'encre + Or ancien de l'icône, Rôle : icône d'écran d'accueil iOS (PWA installée)

### Community 15 - "Portail d accueil"
Cohesion: 0.40
Nodes (5): Accueil plein écran (ménorahs, א vectoriel, s'efface au clic), Bloc :root de la charte unifiée (identique carnet/app/portail), Fontes Google chargées en non-bloquant (media=print puis bascule onload), Portail (index.html) : la porte d'entrée commune aux deux côtés, Salut bilingue au hasard (français / hébreu sans nikoud)

### Community 16 - "Typo : polices et clavier"
Cohesion: 0.67
Nodes (3): Clavier hébreu virtuel (composant signature, bureau seulement), Les quatre piles de polices normatives, écrites en entier, La règle des trois voix

### Community 17 - "Typo : le pli et registres"
Cohesion: 0.67
Nodes (3): Le pli (details natif : condense, ne cache pas), La voix Repère-mono (JetBrains Mono, 0.7rem), La voix Title (Assistant 700, 0.84rem, capitales, or)

## Ambiguous Edges - Review These
- `Format carré plein bord, sans marge ni texte` → `Rôle : icône d'écran d'accueil iOS (PWA installée)`  [AMBIGUOUS]
  icons/apple-touch-icon.png · relation: rationale_for
- `icon-512.png — PWA large app icon` → `Same golden aleph used as vector glyph on the portal welcome screen`  [AMBIGUOUS]
  icons/icon-512.png · relation: conceptually_related_to

## Knowledge Gaps
- **84 isolated node(s):** `fs`, `path`, `STANDALONE`, `EXPECTED_CATS`, `EXPECTED_LEVELS` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Format carré plein bord, sans marge ni texte` and `Rôle : icône d'écran d'accueil iOS (PWA installée)`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **What is the exact relationship between `icon-512.png — PWA large app icon` and `Same golden aleph used as vector glyph on the portal welcome screen`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Le contrat de balisage du carnet (clé d'extraction)` connect `Contrat d extraction et schéma` to `App : boot et extraction`, `Build du standalone`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Why does `extractCards()` connect `Build du standalone` to `Contrat d extraction et schéma`, `Validateur d exemples`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Why does `he2tr` connect `App : réponse et QCM` to `App : rendu des cartes`, `App : voix et recherche`, `Contrat d extraction et schéma`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `extractCards()` (e.g. with `build.js` and `Instantané de cartes intégré (const CARDS)`) actually correct?**
  _`extractCards()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `fs`, `path`, `STANDALONE` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._