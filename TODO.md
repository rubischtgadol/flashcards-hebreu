# État du projet et travail restant

État au 2026-07-21 (session 11). **Dernier acquis : les deux règles d'économie de
tokens de CLAUDE.md sont FUSIONNÉES en une doctrine unique — « The token-economy
doctrine — STANDING DIRECTIVE », l'échelle du canal le moins cher qui prouve.**
Quatre barreaux : graphe d'abord (~2,3k tokens, 10,5× mesuré) → grep court
(≤ ~15 lignes) → sous-agent dès que la réponse demande du volume (critères
chiffrés, fan-out, réutilisation) → fil principal (jugement de charte,
arbitrages, édits, commits, docs). Nouveau et explicite : le couplage dans les
deux sens — les sous-agents héritent de CLAUDE.md donc interrogent le graphe eux
aussi, chaque prompt de repérage le rappelle (« demande au graphe avant d'ouvrir
un fichier ») ; et ce que le graphe sait déjà ne part jamais en sous-agent (un
explain à 2,3k bat un agent à 30k). Désaccord graphe/fichier : le fichier fait
foi + rebuild. Les deux coûts mesurés conservés (10,5× ; --update ~235k,
structurel seulement), fichier raccourci d'une ligne (fusion, pas empilement),
pièges et rituel intacts. Mémoire recalée (regime-subagents-maximal.md pointe
vers la section fusionnée). Édits de prose .md : pas de recalage du graphe.
Complément (même session) : **audit de cohérence en 2 sous-agents, 11 critères,
4 accrocs corrigés** — compte du graphe périmé au § Outillage (505/23 → 511/28),
le rituel de ce fichier réordonné pour s'aligner sur CLAUDE.md (le commit passe
en clôture, étape 8 ; renvois de la doctrine rendus insensibles aux numéros),
2 pointeurs `.impeccable/critique/` marqués « historique git », et le renvoi
mort « CLAUDE.md § Delegate to a subagent » recalé sur la doctrine. Purge des
reliquats historiques de CLAUDE.md (archéologie des recalages, parenthèse +11
des ancres, méta-commentaires) — le fichier ne porte plus que l'opérationnel.

**L'acquis précédent : le graphe de connaissance est
RECALÉ après le ménage de clôture — 335 nœuds / 511 arêtes / 28 communautés.**
Le `--update` a élagué les 63 nœuds des 8 documents de chantier supprimés (specs
`docs/superpowers/specs/` + snapshots `.impeccable/critique/`) et ré-extrait les
10 fichiers modifiés depuis le 20/07 (4 sous-agents parallèles, ~391k tokens,
santé du graphe : 0 arête pendante). La garde anti-rétrécissement (418 → 335) a
été forcée après vérification : le rétrécissement est le ménage lui-même.
Vérifié par critères chiffrés : 0 occurrence des chemins supprimés dans
`graph.json`, `extractCards` (build.js L156, 15 connexions) et `checkAnswer`
(app.html L1885, 9 connexions) répondent. Doc recalée (CLAUDE.md, ARCHITECTURE.md,
GRAPH_REPORT.md régénéré). Aucun fichier déployé touché : pas de build, pas de
bump SW.

**Plus tôt (session 10) : le lot santé/sécurité P2+P3 est
livré — l'audit du carnet est SOLDÉ sur ses trois phases, 729 → 757 cartes,
577 → 605 exemples, SW v17.** Les 28 mots (17 noms P2 dont טֹפֶס arbitré pour le
17e tronqué du rapport, 3 adjectifs P2, 6 noms P3, 2 verbes P3) ont suivi la
rigueur phase 1 en fan-out : rédaction du matériau (le rapport ne donnait que le
français), contre-expertise 2 lentilles (justesse : 3 erreurs attrapées — leveitsim,
גְּרָם, טֹפֶס/אָרוֹךְ alignés sur le carnet ; la suspicion מנוי/מינוי RÉFUTÉE sources
Académie à l'appui ; usage : registre oral tranché — קוֹלֵגָה, סוֹלְלָה, דֶּלֶק
« carburant / essence » —, 3 exemples existentiels reformulés, 6/28 « יש ל־ »
restants), double contrôle à blanc du validateur sur le JSON (a arrêté אָרֹךְ puis
עַכְשָׁו, graphies défectives hors lexique du carnet, AVANT écriture), coût SRS
chiffré **N = 0** (28 entrées neuves, 0 doublon). Insertion par script déterministe
(23 noms sur 7 sous-thèmes, 3 adjectifs, 2 verbes dans « Travail, étude & action »),
rituel au vert : **757/757** data-niveau (A1 339 / A2 295 / B1 119 / B2 4),
`--check` en phase, validateur **0 erreur / 605 exemples** — 6 avertissements, tous
« .tr manuscrit vs he2tr d=2 » (קצת l'existant + 5 nouveaux où le manuscrit est
meilleur, carnet autoritaire). Graphe : pur contenu, PAS de `--update` (règle du
20/07). Pas de WebKit : aucun changement d'UI.

**Plus tôt (session 9) : la campagne WebKit C1–C12 est
AU VERT et les lots de présentation sont sur `main`.** Rejouée en trois sous-agents
WebKit réels parallèles (~167k tokens, 22 verdicts, **0 échec**) : le P0 est prouvé —
les 19 tables de vocabulaire en cartes sans défilement (366 px pile), les 12 grilles
de grammaire ouvertes sur leur DÉBUT au scroll initial, A/B à 768 : décalage de 42 px
= exactement l'overflow (signature du `direction:rtl`) ; étiquettes GENRE/PLURIEL,
FS/MP/FP, MS/FS/MP/FP lisibles sur captures relues ; recherche 10/10 (« maison » →
6 sections sans prose + `mark.hl` dans un `.ex-fr` ; « zzzz » → `p.empty` visible
puis × restaure 28 h2 ; `role="status"` ; placeholder entier 141,7/280 px) ;
pastilles `.steps` en `--bg2` + filet `--line` + chiffre or ; barre opaque sans
backdrop-filter ; sommaire 28 pilules / 6 groupes (6-6-4-3-5-4) / 0 orpheline /
min 48,5 px ; 0 débordement aux 6 largeurs ; 0 erreur console ; A/B 1440 pleine page :
différences attendues seules (la voix Assistant du `.count`, en marge du périmètre
annoncé par l'agent, est bien le lot 4 — texte-clé d'extraction inchangé). Branche
`lots-presentation-phase3` mergée dans `main` et poussée — c'est ce push qui déploie.
**Confirmé on-device par Ruben le 21/07** (P0 des tables, premier affichage,
arrivée du lot santé — les trois d'un coup). Graphe non recalé (contenu+CSS+JS
internes au carnet, pas structurel) ; SW v16 du lot, pas de re-bump.

**L'acquis précédent : la phase 3 (présentation) de
l'audit du carnet est exécutée** — feu vert de Ruben en ouverture de session (avec le
lot santé/sécurité P2+P3 décidé pour après, arrêt entre les deux). Critique impeccable
dual-agent du carnet : **26/40**, 1 P0 (les **31 tables s'ouvrent sur leur FIN en
mobile** — `table{direction:rtl}` dans un wrap LTR, le mot-vedette hors-champ), 2 P1
(état « 0 résultat » cassé + `.empty` en CSS mort ; la recherche renvoie des leçons
entières sans surligner les exemples), 2 P2 (6 sections sur 28 hors sommaire dont
**Phrases** ; rangs de table ~274 px de vide), pastilles `.steps` or plein au repos
(règle de la lampe). **Critère de phase atteint : 0 débordement horizontal aux six
largeurs** ; lampe ≤ 1,07 % d'or ; 0 cible tactile < 44 px ; `:root` identique au
octet dans les trois fichiers ; sidecar `.impeccable/design.json` régénéré AVANT
l'audit (il prescrivait `transition:all`, contre la charte). 123 `low-contrast` du
détecteur = faux positifs (fond blanc inventé, il ne résout pas le dégradé). Rapport et
snapshot : supprimés du dépôt à la clôture (ménage du 21/07, historique git). **Suite du
même jour : Ruben a validé les 4 lots (appliqués, + SW v16 + DESIGN.md recalé) ;
la session 9 a été arrêtée PENDANT la campagne WebKit — rejouée AU VERT en
session 10 et mergée dans `main` : voir le dernier acquis ci-dessus.** Dérives de compte
relevées : 31 `.table-wrap` (docs : 29), `lang="he"` **5234** (CLAUDE.md/
ARCHITECTURE.md recalés). Coût publié de l'analyse : ~201k tokens de sous-agents
(estimation du plan ~200k tenue).

**L'acquis précédent : les 4 lots de la phase 2 de l'audit
sont exécutés** — décision de Ruben en ouverture de session 8 : les quatre déclenchés, la
phase 3 (présentation) alors PAS encore ouverte. **713 → 729 cartes, 564 → 577
exemples, SW v15**, quatre commits (un par lot). En une ligne chacun : **niveaux** — 5
cartes recalées (מענין A1→A2, אמת A2→B1, סקרן/חרוץ/תחת B2→B1), coût SRS nul ;
**registre** — arbitrage « garder + note » (N = 0 au lieu du N ≤ 3 autorisé) : notes
d'oralité sur מִן et מֵאַיִן, la note הַיי posée sous שָׁלוֹם, תַּחַת portait déjà la
sienne ; **grammaire** — section « Le « que » de subordination » (שֶׁ־) sur le modèle du
hé directionnel, standalone inchangé au octet, les 4 emplois orphelins soldés ;
**santé/sécurité P1** — 16 entrées (9 noms dont le nouveau sous-thème « Santé &
urgences », l'adjectif אבוד, 3 verbes, 3 phrases), le matériau brut vérifié **avant
écriture** par contre-expertise 2 lentilles (justesse 16/16 OK ; usage 13/16, les 3
signaux étant mes exemples, réécrits — dont נוהג בְּ+véhicule) puis rattrapage validateur
(באוטו hors carnet → במכונית). Graphe : pur contenu, refresh sciemment différé
(précédent du 21/07).

**L'acquis précédent : le premier affichage est instruit et
corrigé** — la feuille CSS Google Fonts bloquait le premier pixel des trois pages (écran
blanc, pas même le fond, tant qu'elle n'était pas arrivée) ; ses liens sont passés en
non-bloquant, SW v14. Chiffres et contrepartie en « Reprendre ici ». L'acquis précédent
tient : le lag *à l'usage* est CLOS, et clos par une mesure prise sur l'appareil de
Ruben — pas par déduction.
Les trois gestes relevés tiennent tous sous le seuil de perception : chargement **31 ms**
(carnet 8 · extraction 18), tap de chip **49 ms** (dont 1 ms de JavaScript), départ de
session **82 ms**. Aucun chemin de l'app n'est lent ; le cache froid de la PWA
fraîchement réinstallée, facteur confondant annoncé dès le premier jour du dossier,
reste la seule explication debout, et **aucune correction n'était due**.

⚠️ **Le vrai acquis est une leçon de méthode, et elle est coûteuse** : mon émulation
annonçait 329 ms sur le premier rendu de l'écran d'étude — j'en avais fait la piste n°1,
en écrivant que le CPU du téléphone ne pourrait qu'aggraver le chiffre. **L'appareil en
fait 41.** Sur les trois gestes, le vrai iPhone s'est révélé *plus rapide* que la machine
de développement. C'est le miroir du piège n°13 : là-bas l'émulation masquait un défaut
desktop réel, ici elle a fabriqué un défaut mobile imaginaire. **Une mesure d'émulation
ne vaut que comparée à elle-même** (avant/après), jamais en valeur absolue.

Acquis du même chantier : un bloc **« Diagnostic de latence »** (SW **v12**, vérifié 9/9
en WebKit réel) affiche les millisecondes dans « Réglages avancés » — c'est l'instrument
qui a clos le dossier, et il reste en place. Et une faute sans lien avec le lag, débusquée
au passage : `cardId` n'était pas unique — trois homographes consonantiques fusionnaient
leur progression Leitner —, corrigé en clé vocalisée `cat|he` avec migration (`cb44367`).
Graphe recalé (335 nœuds, 23 communautés, le standalone dédupliqué).

**Acquis précédent : la largeur de lecture du carnet est bornée, et le
hé directionnel est enseigné — la dernière dette de mise en page est soldée, et les
avertissements du validateur tombent de 2 à 1.** La prose du carnet passe de **158 à 67
caractères par ligne** (cible 45–75, 0 bloc sur 13 hors cible), avec **le mobile inchangé
au pixel** — le défaut n'existait qu'en desktop, et nos contrôles se font en iPhone
émulé, ce qui l'avait rendu structurellement invisible. Le hé directionnel entre comme
**section de grammaire** : il enseigne הַבַּיְתָה sans créer de carte (713 cartes et 564
exemples inchangés, `flashcards_hebreu.html` inchangé au octet), mécanisme qui n'était
écrit nulle part et l'est maintenant. **Ce chantier s'est joué en quatre passes WebKit
dont deux au rouge** : la campagne a rattrapé deux erreurs de raisonnement — une colonne
calibrée sur la largeur d'un chiffre au lieu de l'avance réelle de la prose, et un cadre
de tables déduit d'un `min-width` qui n'est qu'un plancher mobile — plus une **règle CSS
inerte** qui serait partie en commit avec un commentaire affirmant qu'elle agissait.
Détail et les trois pièges au point 8, règle dans DESIGN.md §3.

**Acquis précédent : le lot de clôture des exemples est livré — la
question des exemples en situation est CLOSE.** Les 54 mots-outils dont le sens ne
s'attrape qu'en contexte (Prépositions 23, Adverbes 19, Mots interrogatifs 12) portent
désormais leur phrase du quotidien : **510 → 564 exemples**, 713 cartes inchangées,
`verifie_exemples.js` à **0 erreur et 0 avertissement nouveau**, et 20 versos sur 20
vérifiés en WebKit réel. Le lot a été écrit **contre un contrôle à blanc** — les cinq
contrôles du validateur rejoués sur le JSON avant d'écrire une seule ligne dans le
carnet —, ce qui a arrêté trois phrases sur du vocabulaire hors carnet avant qu'elles
n'entrent dans la source de vérité. Détail et arbitrages de contenu au point 1.

**Acquis précédent : le dossier « voix robotique »
est CLOS, et par une preuve et non plus par déduction.** Donnée apportée par Ruben :
son iPhone est réglé **en norvégien**, et les Réglages iOS y nomment la voix
**« Carmit (forbedret) »** — pendant que l'app, elle, n'affiche que **« Carmit »**.
L'écart entre les deux écrans *est* le filtre de WebKit pris en flagrant délit : le
système sait que la voix installée est l'améliorée, l'API web ne le dit pas. Une phrase
de notre documentation était fausse et a été corrigée — le nom **porte** bien la qualité,
mais **traduit** dans la langue du téléphone ; ce qui est vrai, c'est que le nom renvoyé
par `getVoices()` ne la porte pas. Cette donnée a aussi révélé un **défaut de code réel** :
`loadVoices()` classait les voix en cherchant « enhanced »/« premium »/« hebrew » dans un
champ localisé, donc en silence sur tout téléphone non anglophone — le score se lit
désormais d'abord sur `voiceURI`, que le système ne traduit jamais.
**Acquis du même soir : les quatre chantiers demandés
par Ruben — points 7, 3, 6 et la garde de couverture — sont soldés.**
L'écran de départ **se replie** : « Catégories » et « Niveau » rejoignent le pli des
« Réglages avancés », 1278 → 874 px de panneau (−32 %) et 43 → 35 arrêts de tabulation.
Le `<summary>` porte la sélection en cours, donc replier condense au lieu de cacher ;
au-delà de deux entrées on compte plutôt que de lister, une liste coupée à l'ellipse
étant mensongère. Deux pièges tenus : l'état ouvert/replié se décide **au chargement
seulement** (ouvert tant que la sélection est vide — sinon un profil vierge n'offre plus
rien à faire), et le `<h2>` **devient** la rangée du `<summary>` au lieu d'un titre
dupliqué, ce qui lui fait quitter la voix Title (règle inscrite dans DESIGN.md § Le pli).
La note Prononciation affiche désormais le **`voiceURI`** sous le nom de la voix : c'est
le seul champ qui porte la qualité, donc le dernier test du dossier « voix robotique » —
**il attend maintenant une lecture de Ruben sur son iPhone** (voir la checklist).
Les **11 piles de polices tronquées** d'`app.html` sont complétées : les trois fichiers
écrivent enfin les quatre piles en entier. Et `build.js` **tient** la couverture des
niveaux au lieu de la supposer — 713/713 était vrai par chance, c'est désormais une
erreur bloquante qui nomme le mot fautif. 56 contrôles WebKit au vert, 0 au rouge ;
713 cartes, 510 exemples, 2 avertissements (les deux légitimes documentés).
**Acquis précédent : le point 4 est ENTIÈREMENT soldé —
la consolidation typographique est faite, et elle a mis au jour la cause de la dérive.**
Le carnet passe de **24 tailles distinctes à une rampe de 8 pas nommés**, mais le vrai
résultat est ailleurs : `font-size:22px` est posé sur **`body`**, jamais sur `html`, dans
les trois fichiers — donc **1rem vaut 16px, pas 22px** (mesuré en WebKit). Le commentaire
du carnet qui affirmait le contraire était faux depuis toujours, et c'est lui qui
expliquait les 24 valeurs : chacune avait été poussée à tâtons contre une base qui ne
réagissait pas comme annoncé. La prose grammaticale sortait ainsi à **15,2 px** et le nom
français des sections à **11,2 px**. Corrigé avec la rampe : interlignage 1.55 sur `body`
(le carnet n'en avait aucun, alors que le nikoud se compose *sous* la ligne), prose à 16 px,
nom de section à 13,4 px en parchemin plein, et **152 hébreux de prose rendus au serif**
(ils héritaient d'Assistant, contre la règle des trois voix *et* celle de la vedette).
17 contrôles WebKit au vert, `flashcards_hebreu.html` **inchangé au octet**, 713 cartes et
510 exemples intacts. **Périmètre arrêté avec Ruben** avant l'écriture : rampe + défauts
mesurés, mais **pas** le bornage de la largeur de lecture (166 caractères par ligne en
desktop) — **soldé depuis, le 20/07, voir le point 8**.
**Acquis précédent** — les dix P2/P3 de charte du carnet traités d'un lot
(`.tip` éteint, quatre micro-titres ad hoc ramenés à deux voix nommées, le voile noir
des exemples remplacé par une vraie couche, piles de polices complétées, `.attention`
extraite, anneau `:focus-visible` global, `theme-color`, tap-highlight, les deux
`transition:all`, `<main>`). **Le fichier autonome est inchangé au octet** : rien du
vocabulaire n'a bougé. 22 contrôles WebKit au vert, et le détecteur passe de 24 à 10
findings — les 10 restants *sont* le chantier typographique, seul reliquat du point 4.
**Périmètre arrêté avec Ruben le même soir**, qui rouvre trois chantiers et en ferme deux :
le prochain lot d'exemples se limite à **Prépositions, Adverbes et Mots interrogatifs**
(54 mots — le reste est abandonné) ; « Catégories » et « Niveau » **seront repliés** ;
les deux pistes de design ont été **explorées** (l'une confirmée et enrichie d'un défaut
de charte trouvé au passage, l'autre périmée mais remplacée par une garde d'outillage
utile) ; et la **piste « Carmit Enhanced » est morte** — WebKit n'expose délibérément que
les voix compactes, ce n'est pas un réglage à trouver.
**Acquis précédent : les points 2 et 5 de « Reprendre ici » sont soldés.** Les avertissements du validateur passent de **31 à 2** (les deux
restants sont légitimes et documentés), le carnet gagne 3 mots qui lui manquaient
(**713 cartes, 510 exemples**), la **fourmi cesse de vouloir dire « port »**, et le
portail revient au barème des jetons. Aucun des 29 avertissements soldés n'était un
mauvais exemple : c'étaient de la dérive orthographique, des trous de lexique, et deux
règles du validateur mal calibrées. **Toute la documentation est recalée** sur ce nouvel
état (comptes, règles du validateur, jeton de la porte, idiome de l'anneau de focus), et
deux chiffres qui étaient faux depuis un moment sont corrigés : les nœuds `lang="he"`
(5015, à mesurer et non à calculer) et les mots-outils sans exemple (181, pas 203).
**Deux acquis antérieurs du jour.** (1) **L'anneau de focus doré rendu
à tout l'interactif de l'app** — cause racine trouvée (`transition:all` fige les `outline-*`, et
non la piste `-webkit-appearance` qui est réfutée), six règles corrigées, 58 arrêts de
tabulation vérifiés en WebKit réel, 0 défaut (détail en « Fait »). (2) **L'audit de charte du
carnet est fait** (13/20, 4 P1, aucun P0) **et ses 4 P1 sont corrigés** — ⚠️ à ne pas confondre
avec l'**audit de contenu** du carnet (justesse de l'hébreu), qui est un chantier distinct,
encore ouvert, et dont le plan est en « Reprendre ici » : le carnet a reçu les passes qui
lui manquaient — `lang="he"` de 0 à **100 %** (5003 nœuds), garde `prefers-reduced-motion`, or
ambiant de `.part` retiré, cibles tactiles de 21 défauts à 0. (Les P2/P3 de charte, alors non
engagés, ont été soldés depuis — voir le point 4 ; seule la consolidation typographique reste.) Avant cela : **critique
impeccable du portail et de l'app (30/40), P0 et P2 corrigés et vérifiés en WebKit** — le
bouton « Commencer » désactivé ne recouvre plus les chips, les dix cibles tactiles sous
44 px sont soldées, « Révision du jour » sort de la voix Title, la copie du verdict raté
est réécrite. Snapshot : `.impeccable/critique/2026-07-19T09-14-04Z__app-html.md`
(supprimé du dépôt au ménage du 21/07 — historique git ; nouveau slug `app-html` — les
anciens `index-html` critiquaient l'app quand elle vivait à la racine ; la tendance
repart de 30, ce n'est pas une régression).

Avant cela, les **cinq demandes du 19/07 sont livrées et poussées**
(voir « Fait ») : portail refondu en accueil deux temps (« Bienvenue » personnalisé,
א, ménorahs, portes égales, hébreu idiomatique), `start_url` revenu au portail
(sw v8 — Ruben doit re-sauvegarder l'icône), clavier virtuel réservé au bureau,
audit de péremption des six documents (ancres de lignes recalées), et **premier
lancement vierge** : plus aucune catégorie ni niveau présélectionné (`defaultCats`
supprimé, l'utilisateur choisit lui-même ; rétro-compat des anciens profils gardée). Acquis des sessions
précédentes : plan UX terminé (34/40, snapshots dans `.impeccable/critique/`, supprimés
du dépôt le 21/07 — historique git), remise à
zéro du profil, diagnostic voix (premier pas), workflow « lots d'exemples sans
relecture » outillé (`verifie_exemples.js`), contrôle visuel WebKit/iPhone 16 Pro.
**La prochaine session commence par « Reprendre ici » ci-dessous.**

## Reprendre ici (prochaine session)

⚠️ **Régime de travail exigé par Ruben (répété trois fois le 21/07), désormais
fusionné dans CLAUDE.md § « The token-economy doctrine — STANDING DIRECTIVE » :
chaque question passe par le canal le moins cher qui la prouve.** L'échelle :
graphe d'abord (~2,3k tokens) → grep court (≤ ~15 lignes) → sous-agent dès que
volume (parallèles quand indépendants, critères CHIFFRÉS dans le prompt) → le
fil principal ne garde que jugement de charte, arbitrages, édits, commits, docs.
Couplage des deux sens : rappeler « demande au graphe avant d'ouvrir un
fichier » dans chaque prompt de repérage, et ne jamais envoyer en sous-agent ce
que le graphe sait déjà. Ne jamais lire un gros fichier ni un transcript d'agent
au fil principal.

**Sens de lecture réparé sur mobile (22/07) — soldé.** Deux gestes issus d'une
capture iPhone de Ruben :
1. **Flashcards, verso des verbes** : le bloc `.forms` passe de `direction:ltr` à
   `rtl` (`app.html`), pour que les 4 formes se lisent droite→gauche (« il » à
   droite). Les libellés `.f-lbl` gardent leur `direction:ltr`, donc « il · … »
   reste lisible. Standalone régénéré, SW **v24 → v25**.
2. **Carnet, rangs de vocabulaire sous 640px** : la carte empilée remettait
   l'exemple AU-DESSUS des formes. Ruben préfère les inflexions **sur une ligne**,
   l'**exemple EN DESSOUS**. Le rang devient un flex souple ; la 1re cellule se
   dissout (`display:contents`) pour libérer ses enfants (`he/cursive/fr/exemples`)
   et les réordonner (vedette 1-3, formes 4, exemple 5) **sans toucher au markup
   dont dépend l'extraction**. Appliqué aux trois tables (Verbes/Noms/Adjectifs).
   ⚠️ Nuance assumée : les formes qui débordent la carte **passent à la ligne**
   plutôt que de défiler — un vrai défilement d'une sous-ligne exigerait un
   conteneur d'enrobage interdit par le couplage d'extraction. **Preuve : WebKit
   iPhone 16 Pro, 6/6 PASS** (verso RTL + les 3 tables ordre vedette→formes→exemple
   + étiquettes + zéro chevauchement). Graphe laissé tel quel (édits internes,
   aucun fichier créé/supprimé → pas de flag).

**Passe de cybersécurité (21/07) — soldée.** Trois gestes, tous vérifiés par
relecture fraîche de l'API et non par l'écho de la requête qui les a posés :

1. **Secret scanning + push protection activés** sur le dépôt (ils étaient
   `disabled`, alors qu'ils sont gratuits sur un dépôt public). ⚠️ Piège payé :
   `gh api -F 'security_and_analysis[...]'` envoie du *form-data* et ne modifie
   rien **en répondant 200** — il faut un vrai corps JSON via `--input -`. La
   première tentative a semblé réussir et n'avait rien fait.
2. **CSP en `<meta http-equiv>`** dans les trois pages, bloc **identique**
   (même discipline que les tokens de charte), placé juste après `<meta
   charset>`. GitHub Pages ne sert aucun en-tête de réponse : le `<meta>` est la
   seule voie. ⚠️ Deux corrections contre le plan initial : le projet **charge
   bien Google Fonts** (`style-src` doit lister `fonts.googleapis.com`,
   `font-src` `fonts.gstatic.com`) — l'affirmation « aucune ressource externe »
   était fausse ; et le `<link>` des polices porte un **gestionnaire inline**
   `onload`, ce qui condamne l'option des hashes et impose `'unsafe-inline'`.
   La CSP durcit donc les **origines** (`connect-src`, `object-src`,
   `base-uri`, `form-action`), pas l'injection de script — c'est son vrai
   périmètre, il ne faut pas se raconter autre chose.
   **Preuve : WebKit iPhone 16 Pro, 5/5 PASS, 0 violation**, avec contrôle
   négatif (page témoin `img-src 'none'` → 2 violations capturées, donc le
   détecteur n'était pas muet). SW bumpé **v23 → v24**.
   **Le standalone en `file://` est soldé** (même session) : en origine opaque
   `'self'` ne matche rien, donc `manifest.webmanifest` et l'apple-touch-icon y
   étaient refusés. Plutôt qu'assouplir la règle, **`build.js` retire ces deux
   `<link>` du fichier autonome** — ils y étaient morts bien avant la CSP (on
   n'installe pas une PWA depuis un `file://`), celle-ci n'a fait que les rendre
   visibles. Deux `mustReplace` (donc échec bruyant si l'ancre bouge dans
   `app.html`) + un garde-fou sur les jetons `manifest.webmanifest` /
   `apple-touch-icon`, dont la capacité à échouer a été vérifiée par contrôle
   négatif. **WebKit en `file://` : 6/6 PASS, 0 violation**, 789 cartes, session
   jouée, fond réellement peint `rgb(20,26,35)` — plus un contrôle négatif en
   origine opaque (2 violations capturées). `sw.js` n'est pas concerné : il
   annonce lui-même ne pas servir `flashcards_hebreu.html`, donc **pas de bump**.
   Seul reliquat, sain : le lien vers le carnet, la navigation n'étant pas
   régie par la CSP.
3. **Branch protection sur `main`** : force-push et suppression bloqués,
   **sans** review exigée ni `enforce_admins` — le commit direct sur `main` du
   rituel reste possible, c'est un filet anti-erreur, pas un processus.

⚠️ **Faux positif de portée, à ne pas « corriger » en le revoyant.** Le hook
impeccable signale des `font-size` littérales dans `index.html` (2.1rem,
1.05rem…) au nom de la rampe de type. Or DESIGN.md §3 borne explicitement cette
rampe au **carnet** (« second bloc `:root`, **local au fichier** ») : vérifié,
`index.html` et `app.html` ne définissent **aucun** `--pas-*`, et le portail
compte 12 tailles littérales distinctes, pas 2. Ce qui est partagé entre les
trois fichiers est le *premier* bloc `:root` — les jetons de couleur —, pas la
rampe. Étendre la rampe au portail et à l'app serait une **décision de charte**
avec mesures avant/après (les tailles d'`app.html` sont accordées à leur rendu
réel, cf. piège n°3), pas un correctif à la volée.

Écartés sciemment, et pourquoi : **Dependabot** (zéro dépendance, rien à
scanner), **Scorecard**/**Allstar** (notent des dépendances consommées par des
tiers ; ce dépôt n'est la dépendance de personne), **TruffleHog** (sa valeur est
la vérif *live* de credentials — il n'y en a aucun), **Semgrep CLI** (exige
Python, recouvre CodeQL sans rien ajouter sur du vanilla JS), **CodeQL** (couvre
bien les `<script>` inline, mais bruyant sur les `innerHTML` des templates pour
peu de vrais sinks). **`zizmor` est le seul à garder en signet** : il devient le
premier outil à poser le jour où un workflow GitHub Actions apparaît — il n'y a
aujourd'hui aucun `.github/`. Plugin **`security-guidance`** installé (portée
utilisateur) : avertissements sur les édits + revue LLM du diff au Stop.

**Aucun chantier ouvert.** Dernier acte (session 18, 21/07) : **la dérive de
table héritée du lot argent-achats est soldée**. La cible annoncée (« la table
de sec-verbes ») n'existait pas : `#sec-verbes` est un `<h2>`, et la section
porte **18 tables**, une par sous-thème. Une seule débordait — « Vie
quotidienne » à **909,94 px** —, les 17 autres à 894,00. Cause isolée par
ablation cellule par cellule : la translittération **`mitmake'ach` (105,61 px)**
de `לְהִתְמַקֵּחַ` (marchander), dans une colonne MS dont les pairs plafonnent à
86,41 ; `git log -S` la date de `aa231d8`, le lot argent-achats — l'hypothèse
d'accumulation était juste. Ni l'hébreu ni la cursive n'y étaient pour rien
(ablation : gain 0,00 ; ils ne *rendent* 105,61 qu'étant `display:block`).
**Correctif : `לְהִתְמַקֵּחַ` → `לְהַחְלִיף` (échanger)**, `machlif` à
67,20 px, absent du carnet entier (vérifié — le premier candidat, `לְהַזְמִין`,
était un doublon dans cette même table). Un mot est sorti du carnet avec sa
phrase d'exemple : aucune retouche ne pouvait le faire entrer, le standard de
translittération interdisant de raccourcir `mitmake'ach`. **Trois pistes
essayées et mesurées avant celle-là, toutes fausses pour la même raison —
elles traitaient 909,94 comme une propriété de la table alors que c'est une
somme de min-contents de colonnes ; DESIGN.md §3 les consigne** (relever
`--colonne-large` : refusé, piège n°4 ; faire revenir la translittération à la
ligne : inopérant, mot sans espace ; rogner les exemples de la colonne
Infinitif : pile et non pic, 3 exemples entiers à réécrire pour sauver 1 mot).
Corrigé au passage : `menatse'ach` → `menatseach` (l'apostrophe de hiatus n'est
pas au standard — pas d'ayin ni d'alef dans מְנַצֵּחַ ; le carnet écrit déjà
`poteach`, `lokeach`, `sholeach`, `shokheach`). **Vérifié WebKit, les deux
côtés** : desktop 1280 — 42 tables, **0 au-dessus de 896** (contre 1), « Vie
quotidienne » 894,00, hauteur de document identique au centième ; miroir iPhone
16 Pro (piège n°13) — `scrollWidth` 402 inchangé, mode cartes intact, delta de
hauteur **−35,94 px imputable à la seule ligne remplacée** (sections antérieures
identiques au pixel, les trois postérieures décalées de −35,94 et de rien
d'autre) ; **0 erreur console** sur les 4 chargements. Compteurs de cartes
inchangés (2499 avant / 2499 après), `verifie_exemples.js` 0 erreur, SW **v23**.
⚠️ **Le balayage a aussi corrigé une phrase fausse de DESIGN.md §3** (« aucune ne
dépasse 894px ») : elle décrivait une mesure, pas une garde, et est restée
fausse pendant tout un lot. La vraie garde est désormais écrite : *une forme
conjuguée dont la translittération dépasse ~90 px ne tient pas dans une table à
5 colonnes*. À surveiller aux prochains lots de verbes.
⚠️ **Point éditorial non tranché par la mesure** : `data-theme="argent-achats"`
a été conservé tel quel de `marchander` à `échanger`. Défendable (échanger un
article en magasin), mais c'est un choix de contenu à confirmer.

**Acquis précédent (session 17, 21/07 au soir)** : **recalage
décidé du graphe** (`/graphify . --update`, demandé explicitement par Ruben —
jamais un réflexe du rituel). Dix fichiers ré-extraits : `build.js`, `sw.js` et
les huit documents (le carnet, `app.html`, `flashcards_hebreu.html`, les cinq
`.md`). **335 → 420 nœuds, 511 → 679 arêtes, 28 communautés**, santé du graphe
OK (0 arête pendante, orpheline, en boucle ou effondrée). Diff franc — 183
nœuds neufs, 362 arêtes neuves, 98 nœuds et 194 arêtes remplacés — parce que le
carnet passe d'une description extérieure à sa vraie structure : ses 35 sections
`<h2>` avec leur label `span.count` (la clé d'extraction), ses trois blocs
`:root` ancrés à leur ligne réelle (18 / 43 / 551), les trois tables et leurs
contrats de colonnes, les 18 `word-list`, les régimes `data-niveau` (A1 350 / A2
311 / B1 124 / B2 4) et `data-theme` (15 slugs). **La dette des deux lots
grammaire est soldée** ; CLAUDE.md et ARCHITECTURE.md § graphe portent les
nouveaux compteurs. Coût mesuré : **396k tokens** (338k in / 58k out), au-dessus
des ~235k du 20/07 — huit documents changés, dont le carnet. Quatre sous-agents
en parallèle (docs / `app.html` / standalone / carnet), aucun transcript lu au
fil principal. Aucun flag « GRAPHE À RECALER » n'était en attente (aucun fichier
créé/supprimé/renommé depuis le dernier recalage) ; il n'y en a pas non plus
maintenant.

**Ce que le recalage a fait remonter, et qui a été traité dans la foulée.** En
traçant le pont `extractCards` (betweenness 0,212), le graphe a montré que les
arêtes vers le carnet sont toutes INFERRED alors que celles vers `CARDS` sont
EXTRACTED — autrement dit le couplage au balisage n'a aucun lien mécanique, ce
qui est exactement la forme du piège connu. Deux suites, l'une écartée, l'autre
livrée :

1. **Écarté — la duplication des deux extracteurs n'est pas un défaut.**
   `app.html` travaille sur le DOM du navigateur, `build.js` en regex sous Node ;
   les réunir demanderait un module partagé, donc une dépendance et un fichier de
   plus, contre la doctrine « zéro dépendance, un seul document autonome ».
   L'absence d'arête dans le graphe décrit une architecture voulue. Rien à faire.
2. **Livré — garde de taxonomie dans `build.js`.** `EXPECTED_THEMES` et la
   constante `THEMES` d'`app.html` décrivaient la même liste sans qu'aucun
   contrôle ne les relie : seulement un commentaire. Elles étaient en phase
   (15/15), mais un 16e thème posé d'un seul côté passait au vert — slug accepté
   au build, aucune pastille dans l'appli, ou l'inverse. `build.js` lit désormais
   `THEMES` dans `app.html` et échoue en nommant la liste fautive. **Contrôle à
   blanc fait, les quatre cas** (slug fantôme côté build → exit 1 ; slug fantôme
   côté app → exit 1 ; constante `THEMES` introuvable → exit 1, plutôt qu'un vert
   qui ne compare rien ; état normal → exit 0). Le premier jet du test avait un
   `$?` qui lisait le code de `tail` et non de `node` : tous les cas semblaient
   passer. Refait proprement.

**Correction de doc du même coup — `--check` était surévalué dans trois
endroits.** Il ne compare PAS les deux extracteurs : le snapshot de l'autonome
vient de l'extracteur de `build.js` seul, l'`extractCards()` d'`app.html` ne
s'exécute jamais sous Node et sa sortie n'est comparée à rien. Il attrape donc un
autonome obsolète, une dérive de l'extracteur de `build.js` et une dérive du
gabarit d'`app.html` — pas une dérive de l'`extractCards()` d'`app.html`, qui ne
se voit qu'en chargeant l'appli contre le carnet ou en relisant les deux
fonctions. CLAUDE.md (§ couplage + rituel étape 3) et ARCHITECTURE.md (§ couplage,
ordre des propriétés, liste des filets, passée à quatre) rectifiés. C'est le genre
d'écart qui fait sauter une vérification en se croyant couvert.

Acquis précédent (session 16, 21/07) : **le lot
grammaire n°2 — les cinq manques de la section grammaire comblés, par ordre
d'importance.** La question de Ruben (« que manque-t-il ? y a-t-il
l'impératif ? ») a été instruite sur pièces (grep des 53 titres h2/h3 + des
gram-title, pas de mémoire) : l'impératif n'existait que comme bloc « Bonus »
dans Le futur, et le vrai trou structurel était **Le présent** — le carnet
expliquait la formation du passé et du futur mais jamais celle du présent.
Livré : (1) **Le présent** (זְמַן הֹוֶה, entre Racine et Passé) — 4 formes,
accord en genre/nombre, terminaisons ־ֶת/־ָה/־ִים/־וֹת, pronom obligatoire,
tableau aux trois mêmes verbes-témoins que le passé/futur ; c'est aussi la
première explication du « carré magique » des tables de la Partie 2. (2)
**L'impératif** (צִוּוּי) promu en section après Le futur : contenu du bonus
repris tel quel + tableau des 7 impératifs irréguliers du quotidien (viens, va,
assieds-toi, lève-toi, donne, prends, attends — tous infinitifs déjà au
carnet). (3) **Le conditionnel** (הָיִיתִי) : table de לִהְיוֹת au passé, puis
trois usages en gram-title — politesse (הָיִיתִי רוֹצֶה), hypothèse irréelle
(אִם + passé), habitude passée (הָיִינוּ + présent). (4) **Suffixes
possessifs** (כִּנּוּיֵי קִנְיָן, entre Smikhut et Prépositions fléchies) :
série des suffixes + les mots toujours suffixés (מָה שְׁלוֹמְךָ, אִשְׁתִּי,
אָחִי, אֲדוֹנִי, לְדַעְתִּי…), cadrés « reconnaître, pas produire ». (5) Bloc
**« Reconnaître le binyan depuis l'infinitif »** dans Patrons de conjugaison
(לִ־/לְ־/לְהַ־/לְהִתְ־/לְהִ־, exemples pris dans le carnet). Renvois recalés
(« la section précédente » du passé, note שֶׁל, moule du temps voulu), sommaire
31 → **35 pilules** (compteur du commentaire mis à jour). Écarté sciemment :
section de lecture/beged-kefet (Ruben : « lecture déjà acquise »). Bilan
mécanique : cartes **789 inchangées** (« déjà à jour » au build — les sections
de grammaire restent hors extraction, zéro dérive), `--check` en phase,
validateur **0 erreur / 7 avertissements** (les 7 préexistants), SW **v22**.
Graphe : édits internes à un fichier existant → ni recalage ni flag (règle du
21/07) ; la dette qui en résultait — les nœuds TOC/grammaire prédatant DEUX lots
grammaire — a été soldée le soir même par le recalage de la session 17. Passe WebKit (déléguée, 3 allers-retours, UI touchée : nouveau
markup + tableaux) : 35 pilules et ancres OK, 0 erreur console, 245 nœuds
hébreux des nouvelles sections tous sous `lang="he"`, et les deux tableaux
d'abord hors gabarit (« Forme » 979 px, « Qui ? » 829 px — cellules françaises
longues sous le `white-space:nowrap` global) ramenés au patron maison (cellules
courtes, littéralités déplacées en note, pronom-témoin par ligne) : 894/894 à
1280, 730/730 à 768, alignés sur les tables Personne du passé/futur. ✅
**Dérive PRÉEXISTANTE : SOLDÉE (session 18, 21/07).** Voir « Reprendre ici ».

**Acquis précédent (session 15, 21/07) : les 14e et
15e thèmes « Argent & achats » / « Loisirs & culture » + 32 mots NEUFS.** Deux
temps. (a) Reclassement : le fourre-tout `vie-quotidienne` (63) rendait encore
deux amas cohérents → 35 entrées reclassées vers `argent-achats` (18) et
`loisirs-culture` (17), `vie-quotidienne` retombe à 28 (gestes et états).
Frontières assumées, miroir du « ce qui s'enfile » : **« la transaction, pas le
lieu »** (magasin, marché, supermarché restent `ville-transport` ; salaire reste
`travail-etudes`) et **« l'activité et l'œuvre, pas le lieu »** (cinéma,
théâtre, musée, bibliothèque restent `ville-transport` ; livre/lire/écrire
restent `travail-etudes`). Libellé chip « Vie quotidienne & loisirs » → « Vie
quotidienne ». (b) ⚠️ **Consigne de Ruben précisée en cours de session : « quel
thème manque » appelle du vocabulaire NEUF, pas un redécoupage de l'existant.**
Lot de 32 entrées rédigé en sous-agent (rapport 8/8 PASS, doublons greppés,
translit vérifiée sur pièces du carnet), arbitré au fil principal : 14
`argent-achats` (shekel, vendeur, monnaie rendue, caisse, reçu, réduction,
promotion, pièce de monnaie, gratuit, économiser, gaspiller, prêter, emprunter,
marchander) + 18 `loisirs-culture` (sport, football, équipe, vacances,
excursion, hobby, guitare, concert, spectacle, exposition, appareil photo,
acteur, gagner, perdre, s'entraîner, se reposer, jouer d'un instrument,
photographier). Insertion scriptée aux ancres thématiques des trois tables
(ancrage sur les lignes `data-theme`, pas la 1re occurrence — לְהַזְמִין vit
aussi dans une table de grammaire). Deux corrections d'arbitrage : מְאוֹד →
מְאֹד (graphie du carnet, 31 occurrences font foi) et l'exemple de מַטְבֵּעַ
reformulé sans רַק (mot hors carnet). Bilan : **757 → 789 cartes, 605 → 637
exemples (100 % maintenu)**, niveaux A1 350 / A2 311 / B1 124 / B2 4, couverture
thèmes **573/573**, `--check` en phase, validateur **0 erreur / 7
avertissements** (les 6 préexistants + ספורט, emprunt lexical he2tr d=2, même
classe tolérée que סוללה/גרם). SW **v21**. Graphe : pur contenu, pas de
recalage ni de flag. Pas de WebKit : aucune UI touchée (les puces naissent des
données via `buildThemeChips`). La question d'origine (« quel thème manque ? »)
avait aussi fait émerger le champ **fêtes & tradition** (Pessah, Kippour,
Hanoukka, casher, Torah… : 0 occurrence) — Ruben a tranché : on reste sur la
vie non religieuse.

**Acquis précédent (session 14, 21/07) : le 13e
thème « Vêtements & couleurs »** (`vetements-couleurs`) — extrait des deux
fourre-tout sur le constat qu'ils absorbaient un champ A1 classique (à la
question « quel thème manque ? », les deux plus gros thèmes étaient justement
les voitures-balais). 26 entrées reclassées dans le carnet : 13 noms
(vêtement → t-shirt, lunettes comprises), 11 couleurs (rouge → marron, qui
n'avaient rien d'abstrait), 2 verbes (porter, s'habiller). `vie-quotidienne`
78 → 63, `abstrait` 75 → 64. Frontière assumée « ce qui s'enfile » : sac,
portefeuille et bague restent en `vie-quotidienne`. Slug ajouté aux deux
listes alignées (`EXPECTED_THEMES` build.js / `THEMES` app.html), build
541/541, `--check` OK, 0 erreur d'exemples, SW **v20**. Distribution à jour
dans ARCHITECTURE.md § 4.1. Aucune UI touchée (la puce naît des données via
`buildThemeChips`), donc pas de passe WebKit.

**Acquis précédent (session 13, 21/07) : le filtre « Thèmes »** — choisir le
vocabulaire par champ sémantique dans l'appli (demande de Ruben du 21/07,
design validé par lui en 3 réponses : les 3 tables, ~10-12 thèmes larges,
filtre combiné ET).

- **Carnet** : `data-theme` sur les 541 `<tr>` des tables Noms/Adjectifs/Verbes
  (injection scriptée, vérifiée par le vrai extracteur), 12 thèmes — taxonomie
  et distribution dans ARCHITECTURE.md § 4.1. Classification par sous-agent,
  arbitrages assumés consignés (couleurs → abstrait, vêtements →
  vie-quotidienne…). Les listes n'en portent pas : mono-thème par nature.
- **Extracteurs** : `theme?` dans le schéma de carte (les deux côtés, même
  position — `--check` OK), garde-fous build.js sur le modèle des niveaux :
  couverture 541/541, slug hors `EXPECTED_THEMES` refusé, `data-theme` sur une
  liste refusé. ⚠️ `EXPECTED_THEMES` (build.js) et `THEMES` (app.html) doivent
  rester alignés — **tout ajout futur au carnet doit porter les mêmes
  conventions, le build échoue sinon (consigne de Ruben, 21/07)**.
- **Appli** : pli « Thèmes » sous « Niveau » (`buildThemeChips`), filtre
  OPTIONNEL — rien de coché = « Tous », rien n'est bloqué ; coché = croisement
  thème × catégorie × niveau, les cartes sans thème sortent. Persisté dans
  `prefs_v1` (rétro-compatible : champ absent = rien de coché). La révision du
  jour l'ignore, comme le niveau. SW **v19**.

**Acquis précédent (session 12, 21/07) : le lot grammaire.** L'audit de la
partie grammaire (14 + 12 critères, mené en sous-agent) a révélé 7 manques
clairs, tous comblés dans le carnet :

- **3 sections nouvelles** — « La phrase sans verbe » (copule hu/hi, hayah/yihyeh),
  « La particule d'objet » (règle de את devant COD défini + tableau fléchi
  oti…otan : le trou n°1, את était employée ~34 fois sans être expliquée nulle
  part), « La négation » (lo / ein / al + futur).
- **Compléments dans les sections existantes** — impératif complété (fém./pluriel,
  futur poli, interdiction), fusion préposition+article (ba- = בְּ+הַ, la- = לְ+הַ,
  mi- ne fusionne pas), smikhut définie (article sur le 2e mot), double série des
  nombres 1–10 (fém. = comptage, masc. en -ah), règles de pluriel -im/-ot + duel
  -ayim (Noms), accord de l'adjectif + comparatif yoter…mi-/hakhi (Adjectifs),
  syntaxe de la question + ha'im (Mots interrogatifs), règle du démonstratif
  postposé (Démonstratifs).
- **Bug factuel corrigé** : la glose du passé décomposait la- (« à la ») en
  בְּ+הַ au lieu de לְ+הַ.

Sommaire 28 → 31 pilules (groupes 7-8-4-3-5-4). **757 cartes / 605 exemples
inchangés** : tout est hors extraction (sections de grammaire pure), le
standalone n'a pas bougé d'un octet. Contre-expertise linguistique en sous-agent
(nikud PASS intégral ; 2 corrections .tr appliquées : 'ivrit ×2, poteach) et
contrôle WebKit 8/8 PASS (iPhone 16 Pro + desktop 1280/900, 0 débordement,
31 pilules, 0 span sans lang="he"). SW **v18**. Restes assumés hors lot (mineurs
pour l'A1–A2) : prépositions fléchies el/mi-/bishvil, suffixes possessifs sur le
nom (beiti), conjugaison de Nif'al/Hitpa'el.

**Le graphe n'a PAS été recalé.** Dérive interne cumulée : les compteurs et la
carte du bloc grammaire datent d'avant le lot grammaire (session 12), et le
filtre « Thèmes » (session 13) a ajouté à app.html des fonctions que le graphe
ignore (`buildThemeChips`, `themeOk`, la constante `THEMES`) et décalé des
lignes — `graphify explain` re-dérive les lignes mécaniquement, le
graphe/fichier se tranche pour le fichier. **Aucun flag « GRAPHE À RECALER » n'est
posé ni requis** : aucun fichier créé/supprimé/renommé (règle du 21/07, rituel
§ 5 — le flag ne se pose que sur changement du *nombre* de fichiers, et ne
déclenche jamais la mise à jour). Dérive interne tolérée, tranchée pour le
fichier au cas par cas. Dernier recalage : session 11, 21/07 (335 nœuds /
511 arêtes / 28 communautés).

**Les trois confirmations on-device sont ACQUISES (Ruben, 21/07, sur l'iPhone
après déploiement)** : le P0 des tables (rangs-cartes lisibles, grilles ouvertes
sur le mot-vedette), le premier affichage (correctif v14, plus d'écran blanc) et
l'arrivée des 28 mots du lot santé (SW v17). **Plus aucune attente, d'aucun côté.**

**Ménage de clôture (21/07)** : les documents de chantier obsolètes sont supprimés
du dépôt — les 5 specs de `docs/superpowers/specs/` (plan d'audit, rapports des
phases 1–3, exploration « lampes accueil »), les 6 snapshots de
`.impeccable/critique/`, le dossier local `audit/` (gitignoré, régénérable par
`node audit_carnet_mecanique.js`) et la branche mergée `lots-presentation-phase3`.
Toute mention de ces chemins plus bas dans ce fichier est d'archive : les fichiers
vivent dans l'historique git.

Prochain chantier éventuel, à la décision de Ruben — rien n'est engagé : les
signaux éditoriaux en réserve sont documentés (note ktiv malé au rapport phase 1
§ 5 ; 6 avertissements .tr d=2 légitimes ; variantes orales en notes du lot
santé : עָמִית, בֶּנְזִין, מְצֻנָּן/נַזֶּלֶת, פְּגִישָׁה candidate écartée du 17e nom).

**La checklist côté Ruben est soldée** (les trois cases restantes fermées le 20/07,
identifiant de voix archivé compris) et **le bloc « Diagnostic de latence » est gardé**,
sur décision de Ruben. Le chantier du lag *à l'usage* est clos par la mesure on-device.

Un chantier corrigé (confirmation au téléphone attendue), un chantier dont il ne reste
que la phase 3, non ouverte :

1. ✅ **Le premier affichage** — signalé par Ruben le 20/07, **instruit puis corrigé le
   21/07 (session 7)**. Le suspect n°1 était le bon, et pire que prévu : la feuille CSS
   Google Fonts est la **seule** ressource externe bloquante des pages, et tant qu'elle
   n'est pas arrivée WebKit ne peint **rien** — pas même le fond Nuit d'encre : écran
   blanc. Preuve par A/B émulé (valide en delta seulement, piège n°14) : avec 3 s de
   retard injecté sur les domaines Google Fonts, FCP ≈ 3,2 s tel quel contre ≈ 0,45 s
   une fois le lien rendu non-bloquant (delta ~2,8 s, portail et app). Deux aggravants
   relevés : les trois pages demandent **trois URL css2 différentes** (ouvrir le portail
   PUIS l'app paie donc deux allers-retours bloquants — la forme exacte du symptôme
   décrit), et le preconnect `fonts.gstatic.com` manquait partout.

   **Correctif appliqué** aux trois pages (+ standalone via `build.js`) :
   `media="print" onload="this.onload=null;this.media='all'"` sur le lien css2,
   fallback `<noscript>`, preconnect `fonts.gstatic.com` `crossorigin` ajouté. SW
   **v14** (la coquille HTML est en stale-while-revalidate : sans bump, la page qui
   bloque serait resservie une fois de plus). **Vérifié post-correctif en WebKit**
   (contexte froid, 3 s de retard injecté) : FCP 92–159 ms sur portail et app,
   638–745 ms sur le carnet (coût de layout de son document massif, plus les fontes —
   son DCL est à 56–89 ms), polices bien appliquées après coup (`Assistant` calculée
   sur le body, `media` basculé `all`, les 4 familles du carnet chargées), zéro erreur
   console. **Contrepartie assumée** : au tout premier chargement, le texte s'affiche
   quelques centaines de ms en polices de repli avant la bascule — cohérent avec le
   `display=swap` déjà choisi, et strictement mieux qu'un écran blanc.
   ⚠️ **Le juge final reste le téléphone** : le diagnostic embarqué ne voit pas cette
   phase (son chronomètre démarre après les polices), la confirmation est donc le
   ressenti de Ruben à la première ouverture après déploiement. Graphe : édits de
   `<head>` uniquement, aucun nœud/arête du graphe n'en parle — **refresh différé** au
   prochain changement structurel réel (précédent de différé du 21/07).
2. 🔶 **Audit complet du carnet — LES TROIS PHASES SONT EXÉCUTÉES.** Phases 1 et 2
   terminées et leurs lots livrés (sessions 4–8). **Phase 3 (présentation) rendue le
   21/07 (session 9)** : critique 26/40, 1 P0 + 2 P1 + 2 P2 + micro-charte — voir
   l'en-tête de ce fichier. **Les deux décisions de Ruben sont prises et exécutées ou en cours** :
   (a) les **4 lots de présentation** tous déclenchés (21/07), appliqués, vérifiés
   au vert (campagne C1–C12, session 10) et mergés dans `main` ; (b) le **lot
   santé/sécurité P2+P3** (28 mots, rigueur phase 1 appliquée au matériau brut),
   accepté le 21/07 (« les deux, dans cet ordre ») et **livré en session 10** —
   757 cartes, 605 exemples, détail au dernier acquis en tête de fichier.
   Les rapports des trois phases, le plan et le journal (anciennement sous
   `docs/superpowers/specs/`) ont été **supprimés du dépôt au ménage de clôture
   du 21/07** — récupérables dans l'historique git.
   Angle tranché par Ruben : **les trois en séquence** (justesse de l'hébreu →
   pédagogie et progression → présentation), en **fan-out multi-agents**, avec un
   point d'arrêt et une validation entre chaque phase.

   **Résultat de la phase 1 (justesse)** : rappel d'étalonnage **17/20** publié
   (angle mort : les erreurs vocaliques subtiles, ~1 sur 3 ratée), 713 cartes
   couvertes, 22 anomalies brutes → après contre-expertise 2 lentilles et arbitrage
   Opus : **3 confirmées** (nikoud de מְלוֹן « hôtel », nikoud de סְפְרִיָּה
   « bibliothèque », genre de סַכָּנָה « danger »), **1 escalade** (le pluriel de
   גַּב « dos » : גַּבּוֹת vs גַּבִּים — protocole de vérification au rapport § 3),
   **18 réfutées consignées** (dont la classe « ktiv haser du he_plain », 16 cas —
   note systémique au rapport § 5). **Coût SRS : N = 2** (recommandation : accepter
   la remise à zéro). 320/320 drapeaux de l'étage 0 couverts par un verdict.

   **Décisions de Ruben (21/07) et lot de correction (session 5)** : les 3
   corrections validées et appliquées dans le carnet (מָלוֹן, סִפְרִיָּה + pluriel,
   genre `f` de סַכָּנָה — le `tr` de l'exemple de מלון aligné « hamalon » dans la
   foulée) ; **גַּב tranché « pas d'erreur »** — vérification déléguée selon le
   protocole du § 3 : l'entrée officielle de l'Académie de la langue hébraïque
   (hebrew-academy.org.il/keyword/גַּב, sens « הצד האחורי בגוף האדם ») donne
   « נטייה: גַּבִּים וגם גַּבּוֹת », donc גַּבּוֹת est attesté pour CE lexème et la
   carte reste ; **issue SRS : remise à zéro acceptée** (N = 2, pas de table de
   migration — le changement de `he` change l'identité des deux cartes tout seul) ;
   **note ktiv malé : documentée au rapport § 5, pas de chantier**. SW bumpé v13.
   - ⚠️ Reprise pratique (phase 2) : `node audit_carnet_mecanique.js` régénère
     `audit/` **mais efface s29/s30** ; les refabriquer par
     `node audit/_injecte_etalonnage.js`. Le fil principal ne lit jamais les
     tranches ; il PEUT lire le corrigé.
   - Graphe : le `/graphify . --update` différé (script racine structurel) a été
     **payé avec le lot de correction, le 21/07**.

   **Résultat de la phase 2 (pédagogie, session 6 du 21/07)** — cinq analyses
   Sonnet en parallèle, toutes chiffrées, ~479 k tokens de sous-agents (~300 k
   estimés) : **(1) trous** — 13/20 domaines fonctionnels A1/A2 bien couverts,
   deux trous nets (**santé** 6 entrées, **sécurité/urgences** 4), proposition
   **+45 mots** (32 noms, 5 adjectifs, 5 verbes, 3 phrases → 42 exemples sous la
   garde de `verifie_exemples.js`) — matériau **brut, non audité** ; **(2)
   équilibre** — statu quo défendable (1:3,10 en entrées mais **1:1,24 en formes
   à mémoriser** ; verbes = catégorie la mieux réemployée, 61,9 %) ; **(3)
   ordre** — **0 violation de prérequis** sur 713 cartes (structurel : la
   grammaire est groupée en tête), 4 emplois de la subordonnée שֶׁ־ jamais
   enseignée ; **(4) niveaux CECRL** — pas de biais systématique (2 désaccords /
   134 échantillonnées, 1,5 %), 3 des 7 B2 surclassées d'un cran ; **(5)
   registre** — 8/713 signalées (1,1 %), résidus concentrés sur les mots-outils
   (תחת, מאין, מן). Étage 0 enrichi en session : **364/713 mots jamais
   réemployés** dans l'exemple d'une autre carte. ⚠️ Acquis méthodologique :
   **`__i` n'est PAS l'ordre du document** (extraction : tables puis listes) —
   tout raisonnement d'ordre se fait au numéro de ligne. Les **4 lots
   possibles** (micro-lot niveaux ~5 cartes à coût SRS nul ; micro-lot registre
   3 entrées + note הַיי, coût SRS N ≤ 3 ; note de grammaire שֶׁ־ ; lot d'ajout
   santé/sécurité en commençant par la priorité 1 seule, 17 mots) sont détaillés
   au § 8 du rapport — **tous quatre décidés par Ruben et exécutés en session 8
   (21/07)**, avec un coût SRS final de **zéro** (l'arbitrage registre « garder +
   note » a évité les remplacements de `he`).

   ⚠️ **Trois sessions distinctes, décidées par Ruben** : (1) l'écriture du plan — faite
   le 20/07 ; (2) la **review complète du plan par Fable 5** — **faite le 20/07**, ses
   corrections sont marquées ✎R2 dans le plan (récapitulatif en tête de fichier :
   étalonnage refondu à 2×10 erreurs, asymétrie de la contre-expertise corrigée, Haiku
   rétrogradé en option, contrôles 9/10/12 opérationnalisés, gabarit Opus ajouté) ;
   (3) la session d'**exécution** — **commencée le 20/07 et interrompue pendant
   l'étalonnage** : la reprise continue la phase 1 là où le journal la laisse, elle ne
   repart pas de zéro.

   Les trois choses à savoir avant d'ouvrir le plan :
   - il tient en **quatre étages d'instrument** (script à 0 token → Haiku en option
     pour le tri de masse → Sonnet pour tout jugement d'hébreu → Fable en chef
     d'orchestre qui ne lit jamais les tranches), sur la règle « ne jamais demander à
     un modèle ce qu'un script décide mieux et gratuitement » ;
   - il **commence par un étalonnage** de l'auditeur sur 2 tranches × 10 erreurs
     injectées, avec un seuil de rappel (16/20) qui autorise ou interdit le lancement —
     un contrôle muet passe toujours au vert ;
   - ⚠️ il porte une contrainte que rien d'autre ne signale : **depuis `cb44367`,
     corriger un nikoud change l'identité SRS de la carte et efface sa progression
     Leitner.** Le coût doit être chiffré et l'issue choisie *avant* la première
     correction, pas découverte en route.

⚠️ Si un ralentissement *à l'usage* est resignalé : **ne rien corriger avant de lire les
trois lignes du diagnostic** et de les comparer au tableau de référence du chantier. Le
premier réflexe utile est de vérifier si « attente » domine — c'est le seul segment
réductible, et la manière de le faire (ainsi que son risque d'accessibilité) est écrite.

## ✅ CHANTIER CLOS PAR LA MESURE — Lag sur iPhone réel (ouvert le 20/07 au soir, clos la nuit même)

**Verdict : aucun chemin de l'app n'est lent sur l'appareil de Ruben. Les trois gestes
mesurés tiennent tous sous le seuil de perception (~100 ms), y compris celui qu'il avait
nommé en premier.** Le code est disculpé par la mesure, pas par déduction.

### Le verdict de l'appareil (relevé par Ruben, iPhone réel, SW v12)

| Geste | Attente | Travail | Affichage | **Total** |
| --- | --- | --- | --- | --- |
| Chargement (carnet 8 · extraction 18 · construction 5) | — | — | — | **31 ms** |
| Chip « Intermédiaire » (état 0 · bouton 1 · sauvegarde 0) | 21 ms | 1 ms | 27 ms | **49 ms** |
| Départ de session (préparation 1 · rendu 11) | 29 ms | 12 ms | 41 ms | **82 ms** |

Ce que ces trois lignes établissent :

- **Le carnet est hors de cause, définitivement** : 8 ms pour l'obtenir (donc servi par
  le cache du service worker, pas par le réseau) et 18 ms pour en extraire 713 cartes.
- **Le travail JavaScript est négligeable partout** : 1 ms sur une chip, 12 ms sur un
  départ de session. H1 est morte sur le vrai matériel, plus seulement en émulation.
- **Le rendu ne coûte pas ce que je croyais** : « affichage » du départ de session vaut
  **41 ms sur l'appareil contre 329 ms en émulation**. La piste la plus sérieuse de la
  campagne n'existe pas sur le téléphone.
- **Le poste le plus lourd est « attente »** (21 et 29 ms) : le délai qu'iOS met à
  transformer le doigt en `click`. Ce n'est pas notre code, et c'est le seul segment
  qu'on saurait réduire (voir « La piste laissée ouverte » plus bas).

### ⚠️ La leçon de méthode, qui vaut plus que le verdict

**Mon émulation a inventé un défaut qui n'existe pas.** Elle annonçait 329 ms sur le
premier rendu de l'écran d'étude ; l'appareil en fait 41. J'avais écrit que « sur le CPU
du téléphone ce coût ne peut qu'enfler » — c'était faux, et sur les trois gestes le vrai
iPhone s'est révélé **plus rapide que la machine de développement** (chargement 31 contre
88 ms, chip 49 contre 53 ms).

C'est le **miroir du piège n°13** de CLAUDE.md : là-bas, l'émulation iPhone masquait un
défaut desktop bien réel ; ici, elle a fabriqué un défaut mobile imaginaire. La règle qui
en sort n'est pas « ne pas émuler » mais : **une mesure d'émulation ne vaut que comparée
à elle-même** (avant/après, A contre B). En valeur absolue, elle ne dit rien de
l'appareil — ni en trop, ni en trop peu.

### Ce qui restait comme explication

Le facteur confondant annoncé dès le premier jour du dossier : **la PWA venait d'être
réinstallée** le jour du rapport (SW v11 tout neuf, cache à reconstituer, iOS en train
d'indexer). Un cache froid lague légitimement, et les mesures ci-dessus ont été prises
sur une app installée depuis. Aucune correction n'était due — et le réflexe de défaire
le commit du jour, que le dossier avait interdit d'avance, aurait été une erreur.

### La piste laissée ouverte (mesurée, chiffrée, NON appliquée)

Sur les 49 et 82 ms, **21 et 29 ms sont de l'« attente »** — le délai de synthèse du
`click` par iOS. L'app sait déjà l'éviter : `bindTap()` réagit dès le `pointerup` et
équipe les boutons de l'écran d'étude. Les chips et « Commencer », eux, sont en `onclick`
classique. Les y faire passer rendrait ~30 % du geste.

**Non appliqué, et pour deux raisons qu'il faut garder** : (1) à 49 et 82 ms les gestes
sont déjà imperceptibles, donc l'optimisation ne se verrait pas ; (2) `bindTap` fait
`preventDefault()` sur `pointerup`, **ce qui empêche le focus de se poser** — sur des
chips navigables au clavier et porteuses de l'anneau doré, c'est un risque
d'accessibilité réel, à ne prendre que contre un bénéfice mesuré. À rouvrir seulement si
un ralentissement est signalé *et* que « attente » domine à nouveau.

### Ce que la session d'instruction avait établi avant la mesure (20/07, nuit)

La campagne de mesure en WebKit réel (iPhone 16 Pro émulé, Playwright, médianes sur
20 répétitions minimum) **réfute les quatre hypothèses du dossier, en émulation** :

1. **H1 travail synchrone par clic — réfutée.** Le gestionnaire complet d'un clic de
   chip tient sous la résolution d'horloge (≤ 1 ms), `updateStart()` < 1 ms,
   `savePrefs()` < 1 ms, `localStorage.setItem` ~0 ms sur 100 répétitions, `srsSave()`
   avec 198 entrées (11,4 Ko) idem.
2. **H2 relayout du sticky — réfutée en émulation.** Clic → peinture : médiane 23 ms,
   soit le plancher du double-rAF à 60 Hz, pas du travail. Le face-à-face avec
   l'`app.html` de `3a7ab38` (avant lampes et sticky conditionnel) donne 22/23 ms —
   delta +1 ms, et le pire max était côté *ancien*.
3. **H3 le carnet au chargement — hors de cause pour un lag au tap.** fetch 9 ms +
   DOMParser 14 ms + extractCards 7 ms ≈ 30 ms, boot total 344 ms à froid (dev). La
   part qui dépend du CPU du téléphone (parse + extraction ≈ 21 ms) est minime.
4. **H4 `body.has-due` — réfutée.** À due=200 (`has-due` posé et vérifié), gestionnaire
   et peinture identiques à due=0 (23 ms contre 23 ms, contre-mesure 30+30 taps).

Aucun chemin ne produit plus d'1 ms de travail ni plus d'une trame de délai. **Si le
lag est réel, il vit en dehors de ces quatre chemins, ou n'existe que sur le vrai
matériel** (plancher rAF, thermique, synthèse vocale, contention du SW, cache froid).
L'émulation ne peut pas trancher plus loin — c'est exactement le piège n°1 du dossier
d'origine, et la raison de l'instrumentation ci-dessous.

**Un seul poste dépassait 100 ms dans tout le parcours émulé, et il collait au rapport** :
le **premier rendu de l'écran d'étude** — « Départ de session : travail 7 ms ·
affichage **329 ms** » (les départs suivants ~23 ms ; une chip peint en 51 ms). J'en
avais fait la piste n°1, en écrivant que « sur le CPU du téléphone ce coût ne peut
qu'enfler ». ⚠️ **L'appareil a répondu 41 ms.** La piste était un artefact de
l'émulation — voir « La leçon de méthode » plus haut, c'est le vrai acquis du chantier.

**Prise au passage** : la campagne a débusqué une vraie faute sans lien avec le lag —
`cardId` (`cat|he_plain`) n'était pas unique. Corrigée le soir même (`cb44367`,
clé vocalisée + migration), voir « Fait ».

### L'instrumentation livrée (SW v12) — l'instrument qui a clos le dossier

« Réglages avancés » porte un bloc **« Diagnostic de latence »** qui affiche
en clair, sur l'appareil, sans inspecteur :

- **Chargement** : `carnet (réseau) · extraction · construction · total` — mesuré à
  chaque boot en ligne (masqué dans le standalone) ;
- **le dernier geste** (chips catégories/niveaux, « tout sélectionner », réglages,
  « Commencer », « Révision du jour ») : `attente · travail (état · bouton ·
  sauvegarde) · affichage · total`.

Grille de lecture — **à garder** : c'est elle qui a permis de lire les relevés, et elle
resservira telle quelle si un ralentissement est signalé un jour :

| Si domine… | Alors la cause est… |
| --- | --- |
| **attente** | le fil principal occupé avant le geste, ou le délai de synthèse du clic iOS — pas le gestionnaire |
| **travail** | H1 enfin prouvée — le segment affiché nomme le coupable |
| **affichage** | le rendu (style/mise en page/compositing) — H2 et parentes |
| **aucun** (tout < ~30 ms) | le lag n'est pas dans l'app : cache froid de la PWA réinstallée, thermique, iOS |

Protocole (reproductible) : **fermer et relancer l'app une fois** (le SW doit servir le
nouveau `app.html` après un bump), ouvrir « Réglages avancés », toucher deux ou trois
chips puis « Commencer », revenir par « ‹ Quitter » et lire la ligne du bas.

### Le sort du bloc de diagnostic — **TRANCHÉ le 20/07 : il reste**

**Décision de Ruben : on garde le bloc** (« toujours utile »). Il ne coûte rien au repos,
vit à l'intérieur d'un pli fermé, et c'est le seul instrument dont on dispose si un
ralentissement est signalé — sans lui, une prochaine plainte repartirait de zéro,
c'est-à-dire d'une session entière d'instrumentation.

**Il cesse donc d'être un échafaudage pour devenir un élément d'interface** : à traiter
comme tel (charte, a11y, libellés) si l'écran des réglages est retouché. Ce n'est pas
une dette, c'est un choix.

⚠️ Le corollaire vaut d'être écrit : **il ne mesure pas tout**. Son chronomètre démarre
quand le script s'exécute, donc **après** l'arrivée du HTML, du CSS et des polices — la
phase d'ouverture de page lui est invisible (voir le chantier « premier affichage »).

### Le dossier d'origine (conservé pour mémoire — l'instruction ci-dessus l'a suivi)

### Le rapport

Ruben, sur son iPhone réel, PWA fraîchement réinstallée (SW v11) : **« tout lag un peu,
par exemple quand je quitte l'écran d'accueil ou que je sélectionne des catégories »**.

Deux précisions obtenues, toutes deux décisives :

1. **C'est une régression** — l'app était fluide avant, elle lague depuis aujourd'hui.
2. **Le symptôme est une LATENCE, pas une saccade** — « le geste met du temps à
   répondre », un délai avant que quoi que ce soit ne bouge. ⚠️ **Cette distinction
   commande toute l'enquête** : une latence est du travail synchrone qui bloque le fil
   principal, pas un problème de rendu ni de compositing. Les pistes « transition
   coûteuse », « box-shadow », « couche de compositing » expliquent une saccade et **pas**
   un délai — elles sont donc secondaires, contre-intuitivement.

### Établi (et comment)

- **Le chemin d'un clic de chip ne passe PAS par `refreshSrsUi()`** — lu dans
  `buildChips()` : le `onclick` d'une chip fait `toggle` → `state` → `updateStart()` →
  `savePrefs()`. Le drapeau `body.has-due` n'est donc pas sur ce chemin.
- **Sur un profil fraîchement réinstallé, `SRS` est vide → `due=0` → `body` n'a pas
  `has-due` → `body:not(.has-due)` matche exactement comme l'ancien `.start:enabled`.**
  Autrement dit, dans l'état où Ruben est aujourd'hui, les sélecteurs livrés le 20/07
  sont **quasi inertes**. C'est l'argument le plus gênant contre l'hypothèse évidente.
- **`app.html` n'a été touché aujourd'hui que par `336def7`** (les lampes). Le commit
  précédent sur ce fichier date du 19/07 16:25.
- **Aucune inflation de taille** : carnet 444 697 → 452 828 o (+1,8 %), `app.html`
  119 513 → 121 442 o (+1,9 Ko). Le volume n'explique rien.
- **Aucun rapport de lenteur n'existe dans l'historique du projet** — ce qui ne prouve
  pas que c'est nouveau, seulement que ça n'a jamais été signalé.

### Non éliminé, et à ne pas oublier

Trois commits du 20/07 touchent le **carnet**, que `app.html` va chercher par `fetch()`
et reparse à chaque chargement (`extractCards`) : `cafa245` (54 exemples), `0970245` (la
colonne de lecture), `1aafb0f` (le hé directionnel). Le lag est peut-être **côté carnet,
pas côté app** — et personne n'y penserait en lisant « lag de l'app ».

Autre piste non explorée : le **service worker en stale-while-revalidate** re-télécharge
le carnet (443 Ko) en arrière-plan à chaque lancement. Sur réseau mobile, cela pourrait
concurrencer le fil principal au moment précis où l'utilisateur touche l'écran.

### Hypothèses, classées

1. **Quelque chose de synchrone et coûteux tourne à chaque clic.** `updateStart()`
   appelle `refreshSelAll()`, `refreshFoldSubs()`, un `CARDS.filter` sur 713 cartes, puis
   `savePrefs()` qui **écrit dans localStorage** — une opération synchrone et bloquante,
   candidate n°1 pour une latence. À mesurer avant tout.
2. **Le relayout d'un élément `sticky`.** `updateStart()` change le `textContent` du
   bouton (« Commencer — 12 cartes ») à chaque clic ; sous `pointer:coarse` ce bouton est
   `position:sticky`, donc chaque changement peut forcer un recalcul de mise en page du
   conteneur défilant. Préexistant, mais possiblement aggravé.
3. **Le carnet**, via `fetch` + `extractCards` au chargement (voir ci-dessus).
4. **Le drapeau `body.has-due`** invalide le style du document entier. Faible : il n'est
   pas sur le chemin des chips, et il est inerte à `due=0`.

### Les expériences qui discriminent, du moins cher au plus cher

1. **Instrumenter, ne pas deviner.** Poser des `performance.now()` autour des trois
   segments du clic (état, `updateStart()`, `savePrefs()`) et autour du départ de
   session, et **afficher les millisecondes à l'écran** — Ruben n'a pas d'inspecteur
   Safari sous la main. C'est la seule mesure prise sur le vrai matériel, donc la seule
   qui fasse foi. ⚠️ *Ce point vient en premier : les quatre hypothèses ci-dessus sont
   toutes plausibles et une seule mesure les départage.*
2. **Bissection par déploiement.** Servir sur le téléphone l'`app.html` de `3a7ab38`
   (la veille) **contre le carnet d'aujourd'hui** : si le lag persiste, mon commit est
   hors de cause et c'est le carnet. Puis l'inverse. Deux essais, la moitié de l'espace
   éliminée à chaque fois.
3. **Rejouer en WebKit** seulement ensuite, et en sachant que le bureau ne reproduira
   probablement pas une latence liée au CPU du téléphone. Ne pas conclure « pas de
   défaut » d'une machine de dev fluide.

### Pièges de cette enquête

- ⚠️ **Ne pas conclure de la fluidité en émulation.** Le grief est sur un iPhone réel,
  et la contrainte est le CPU, pas le moteur de rendu.
- ⚠️ **La réinstallation de la PWA est un facteur confondant** : SW v11 tout neuf, cache
  à reconstituer, premiers lancements légitimement lourds. Faire confirmer par Ruben que
  le lag **persiste après plusieurs lancements**, sinon on débogue un cache froid.
- ⚠️ **Mon commit du jour est le suspect commode, pas forcément le coupable.** Les faits
  établis ci-dessus le disculpent en partie (sélecteurs inertes à `due=0`, absent du
  chemin des chips). Résister au réflexe de défaire le dernier changement.

---

**Le reste de cette section est soldé.** Les huit points ci-dessous
sont clos, et la piste A l'a été le 20/07 en fin de journée :

- **Les deux « lampes » de l'accueil — FAIT le 20/07 au soir.** Le principe visé par
  DESIGN.md §5 est tenu : une seule lampe allumée à la fois, choisie par l'état. Un
  commutateur `body.has-due`, posé par `refreshSrsUi()` qui connaît déjà le compte, fait
  céder la lumière à « Commencer » quand des cartes sont dues, et lui fait **abandonner
  le sticky** avec — sans quoi la hiérarchie corrigée dans l'espace serait revenue dans
  le temps (l'action secondaire épinglée pendant que la lampe défile hors de vue). Le
  `.review-card:disabled` à `opacity:.55` est traité dans le même geste : son icône
  restait **en or pâli**, donc de la lumière sur un état inactif. Spec :
  `docs/superpowers/specs/2026-07-20-lampes-accueil-design.md`.

  ⚠️ **La leçon du chantier, à garder** : le risque documenté par la piste était réel
  mais mal localisé. Elle proposait de distinguer le « Commencer » secondaire par un
  `filet --card-edge` — or `--card-edge` (#2c3844) et `--line` (#2a3440), le filet de
  l'état désactivé, **diffèrent de deux points sur chaque canal**. Le filet ne pouvait
  pas porter la distinction. Il ne restait que la surface et la couleur du texte, ce qui
  rendait la vérification côte à côte non négociable — elle l'a validée. *Deux valeurs
  nommées différemment ne sont pas nécessairement deux valeurs différentes : le vérifier
  avant de bâtir une distinction dessus.*
- **Le dernier avertissement du validateur** (« bamekarer », point 2) est **légitime** :
  le `.tr` écrit à la main fait foi. Ne pas le « corriger ».
- **La checklist côté Ruben** (vrai iPhone), inchangée, en bas de cette section.

Le reste de cette section est l'historique des huit chantiers soldés : à lire pour les
leçons qu'ils portent, pas comme du travail en attente.

1. **Exemples en situation — les trois tables sont couvertes à 100 %** (19/07 au
   soir, demande de Ruben) : chaque **nom (301), adjectif (102) et verbe (97)** porte
   un exemple du quotidien (verbes : phrase au présent) — plus 8 Mots de quantité et
   2 Verbes modaux hors règle. Avec le lot de clôture du 20/07 (ci-dessous),
   le carnet porte **564 exemples** pour 713 cartes.
   La règle est **verrouillée dans `verifie_exemples.js`** : un mot ajouté à l'une de
   ces trois tables sans son `<ul class="exemples">` fait échouer le contrôle (erreur
   bloquante, pas un avertissement). Méthode d'un futur lot : écrire les phrases en
   JSON, script d'insertion qui génère la `.tr` avec le `he2tr` de l'appli
   (concordance par construction) + retouches d'affichage (kol, akhshav, chva sonore,
   noms propres en capitale), puis `node verifie_exemples.js` (**0 erreur exigé**),
   `node build.js`, commit.

   **➤ [FAIT le 20/07] LOT DE CLÔTURE LIVRÉ — Prépositions (23) · Adverbes (19) ·
   Mots interrogatifs (12) = 54 mots. La question des exemples est CLOSE.**
   **510 → 564 exemples**, 713 cartes inchangées, `verifie_exemples.js` **0 erreur et
   aucun avertissement nouveau** (les 2 restants sont les deux légitimes d'avant le lot).
   Méthode conforme à l'annonce : JSON → contrôle **à blanc** → insertion → `build.js`.
   ⚠️ *La leçon du lot, à garder :* le contrôle à blanc **avant** d'écrire dans le carnet
   a payé. Il rejoue les 5 contrôles du validateur sur le JSON, sans toucher aux 431 ko de
   la source de vérité — et il a arrêté trois phrases sur un vocabulaire hors carnet
   (הָיָה, נִמְצָא ×2) qui seraient sinon parties en avertissements dans le fichier réel,
   à défaire ensuite. Écrire d'abord, valider ensuite, aurait coûté un aller-retour sur
   un fichier qu'on ne veut toucher qu'une fois.
   Trois arbitrages de contenu pris en route, tous dictés par le lexique du carnet :
   - **אֶתְמוֹל** (hier) réclame un passé, et le carnet n'enseigne qu'**une** forme du
     passé hors section de grammaire : אָכַלְתִּי. La phrase l'utilise donc
     (« hier j'ai mangé au restaurant ») au lieu d'introduire un הָיָה que le carnet
     n'a pas. Un exemple ne doit pas enseigner en douce un mot absent.
   - **יָמִין / שְׂמֹאל** devaient éviter נִמְצָא (hors carnet). Rendus en phrase
     nominale — « le magasin est à droite de la station » —, ce qui est de l'hébreu plus
     idiomatique que le verbe, et non un pis-aller.
   - **הַבַּיְתָה soigneusement évité** dans les phrases de אַחֲרֵי et de מָחָר : c'est
     l'un des 2 avertissements légitimes ouverts (point 2), on ne l'aggrave pas.
   Quatre retouches d'affichage sur la `.tr` générée, là où le carnet fait foi :
   `'akhshayv → 'akhshav` (×2), `matay → matai`, `leiad → leyad`, `kevar → kvar`.
   Vérifié en **WebKit réel (iPhone 16 Pro)** : session tirée des trois catégories,
   **20 versos sur 20** portent leur pli « Voir un exemple », le pli révèle bien
   hébreu + translittération + français, et l'hébreu révélé porte son `lang="he"`.

   **Le reste est abandonné, décision de Ruben** — Nombres 41 · Expressions 35 ·
   Saisons & mois 16 · Pronoms 10 · Jours 7 · le reste ≤ 6. Ne pas les reproposer :
   un nombre, un jour ou une saison se comprend sans mise en situation, et les
   « Expressions » sont déjà des formules autonomes. Les 22 « Phrases » restent hors
   sujet (ce sont déjà des phrases complètes). Après ce lot, la question des exemples
   est **close**.
2. **[FAIT le 19/07 au soir] Les avertissements du validateur soldés : 31 → 2.**
   Détail en « Fait ». Quatre causes, dont **aucune n'était un mauvais exemple** :
   dérive orthographique ktiv malé/chaser sur 4 mots (10 avert.), 3 vrais trous du
   lexique désormais comblés (אוּלְפָּן, מִדַּי, כָּל כָּךְ), un lexique de validateur qui
   ne lisait que les cartes et ignorait les sections de grammaire (4 avert.), et un
   seuil de niveau qui alertait à +1 alors que +1 est inévitable (13 avert.).
   La **fourmi est corrigée** : נָמָל (= port) → נְמָלָה, seule identité SRS déplacée.
   **[20/07 — la question ouverte est tranchée : 2 → 1 avertissement.]** Ruben a choisi
   **d'enseigner le hé directionnel** plutôt que de récrire l'exemple de לַחֲזֹר. Une
   section de grammaire `הֵא הַמְּגַמָּה` (Partie 1, après les prépositions fléchies)
   enseigne les trois choses qui comptent : le mouvement **vers** et jamais le lieu où
   l'on est (`אֲנִי בַּבַּיִת` contre `אֲנִי חוֹזֵר הַבַּיְתָה` — c'est l'encadré
   `.attention`, et c'est ce qui justifie l'exemple), le `ָה־` qui n'est **pas** le
   féminin (non accentué, ne change pas le genre), et la **liste fermée** : hors des cinq
   formes du tableau, on revient à `לְ`. Cinq formes retenues (הַבַּיְתָה, יָמִינָה,
   שְׂמֹאלָה, קָדִימָה, אָחוֹרָה), dont trois appuyées sur des mots que le carnet
   connaissait déjà. Nord/sud **écartés** : leurs mots de départ sont absents du carnet,
   les enseigner en passant serait le reproche que la note d'אֶתְמוֹל s'était fait.

   ⚠️ **Le mécanisme à retenir, il n'était écrit nulle part** (il l'est maintenant dans
   ARCHITECTURE.md §1) : une section de grammaire **enseigne un mot sans créer de carte**.
   Son label `.count` n'a pas d'entrée dans les maps d'extraction, mais son hébreu alimente
   le lexique du validateur. Résultat mesuré : l'avertissement tombe, et le carnet reste
   à **713 cartes et 564 exemples**, `flashcards_hebreu.html` inchangé au octet.

   **Le dernier avertissement est légitime**, à ne pas « corriger » à l'aveugle : le `.tr`
   « bamekarer » à distance 2 de `he2tr`, où le `.tr` écrit à la main fait foi.
3. **[DOSSIER CLOS le 19/07 au soir — le plafond de plateforme est prouvé, plus déduit]**
   **La preuve, apportée par Ruben** : son iPhone est réglé **en norvégien**, et les
   Réglages iOS y nomment la voix **« Carmit (forbedret) »** (= « améliorée »). La même
   voix, vue par l'app, s'appelle **« Carmit »** tout court. **C'est le filtre de WebKit
   pris en flagrant délit** : le système sait parfaitement que la voix installée est
   l'améliorée — il l'écrit dans ses propres Réglages — et l'API web ne le dit pas.
   Jusque-là nous le déduisions d'un rapport de bug de 2019 ; nous le mesurons
   maintenant sur l'appareil, par la différence entre les deux écrans.
   **Ne plus rien tenter du côté « installer une meilleure voix ».**

   ⚠️ **Une phrase de cette note était fausse, et elle est corrigée** : nous avions écrit
   que « le nom ne dira jamais Enhanced ». C'est inexact — **iOS écrit bien la qualité
   dans le nom, mais traduite dans la langue du téléphone** (« forbedret » en norvégien,
   « Erweitert » en allemand, « Enhanced » en anglais). Ce qui est vrai, et qui suffit à
   la conclusion, c'est que **le nom renvoyé par `getVoices()` ne la porte pas** : WebKit
   ne publie que la variante compacte, dont le nom est nu. Distinguer les deux écrans est
   essentiel — c'est justement leur écart qui fait la preuve.

   🔎 **Défaut de code révélé par cette donnée, corrigé le même soir** : `loadVoices()`
   cherchait « enhanced », « premium » et « hebrew » dans `name`, un champ **localisé**.
   Sur tout téléphone non anglophone — celui de Ruben, donc — une voix améliorée aurait
   été classée comme ordinaire, en silence. Le score se lit désormais d'abord sur
   `voiceURI`, identifiant reverse-DNS que le système ne traduit jamais. Défaut dormant
   aujourd'hui (WebKit ne publie que les compactes), filet pour le jour où ce serait
   faux. **Leçon à garder : ne jamais brancher une logique sur un libellé destiné à
   l'utilisateur — il est traduit.**

   **La ligne « identifiant » reste à l'écran** (`#audio-note`, voix Label, LTR). Elle ne
   sert plus à trancher — c'est fait — mais de **détecteur permanent**. ✅ **Valeur
   relevée le 20/07 : `com.apple.voice.super-compact.he-IL.Carmit`.** Elle est **pire que
   ce que le dossier supposait** : nous écrivions « la compacte », l'appareil sert la
   *super*-compacte, un cran en dessous. La conclusion ne bouge pas (c'est le filtre de
   WebKit, pas un réglage manqué) mais elle gagne en netteté : le « robotique » ressenti
   par Ruben n'était pas une impression, c'est le plus bas palier de la famille. Cette
   chaîne est désormais la **référence du détecteur** : si elle devient un jour
   `.compact.`, `.enhanced.` ou `.premium.`, le filtre a changé et le dossier se rouvre.

   *Le dossier documentaire, conservé — c'est lui qui explique pourquoi il ne faut plus
   rien tenter :* WebKit *filtre délibérément* les voix par qualité et n'expose que les
   `compact`. Le code (bug WebKit 203689, r251960, nov. 2019) ne garde dans `getVoices()`
   que `voice.quality == AVSpeechSynthesisVoiceQualityDefault`, motif déclaré « réduire
   la surface de fingerprinting ». Apple le confirme en toutes lettres sur son forum
   développeurs (thread 723503) : *« with Web Speech APIs only the pre-installed voices
   are available. Optionally downloadable voices are not available. »* Au niveau système,
   `AVSpeechSynthesisVoice` sépare `name` et `quality` en deux champs, et l'API Web Speech
   n'a aucun champ pour la qualité — elle ne peut donc pas la transmettre autrement que
   par l'identifiant.

   **[20/07 — Ruben tranche : « on est bon pour la voix ».]** C'est l'option (c) :
   la voix compacte est assumée telle quelle. **Ne plus rouvrir le sujet**, ni côté
   réglages, ni côté audio préenregistré, sauf demande explicite de sa part.
   *Les options sont conservées pour mémoire, au cas où la demande reviendrait :*
   (a) ajuster `rate`/`pitch` — gain réel mais modeste sur une voix compacte ;
   (b) audio préenregistré (décision produit lourde : ~713 fichiers, mais c'est la seule
   voie vers une vraie qualité hors-ligne) ; (c) rien, et l'assumer — **retenue**.
   **API TTS externe reste rejetée** (casse le tout-statique hors-ligne).

   ⚠️ **Risque à surveiller** : plusieurs rapports (dont la doc Readium) signalent
   qu'installer une variante Enhanced peut faire **disparaître** la voix de base de
   Safari, jusqu'à vider une langue entière. Ce n'est pas arrivé chez Ruben (Carmit
   répond toujours). Mais si l'hébreu disparaissait un jour de `getVoices()` après une
   mise à jour iOS, ce serait **cette régression-là** et non une panne de l'app — le
   `body.no-he-voice` s'activerait proprement. À ne pas debugger dans l'app.

   Sources : [WebKit bug 203689](https://bugs.webkit.org/show_bug.cgi?id=203689) ·
   [Apple Developer Forums 723503](https://developer.apple.com/forums/thread/723503) ·
   [Readium — SpeechSynthesis in browsers and OSes](https://readium.org/speech/docs/WebSpeech.html)
4. **[FAIT le 19/07 au soir] Correctifs du carnet — TOUT est soldé, consolidation
   typographique comprise.** Détail en « Fait ». La rampe de 8 pas est en place, la
   cause racine de la dérive est trouvée et documentée (le `22px` sur `body` ne
   déplace pas la racine des rem), et la rampe est **fermée dans DESIGN.md §3**.
   Ce qui suit est conservé comme contexte d'origine de l'audit.

   *Ancien libellé : « les 4 P1, le bloc tactile ET tous les P2/P3 de charte sont
   FAITS, il ne reste que la consolidation typographique. »*
   Appliqué le 19/07 (détail en « Fait ») : `lang="he"` à **100 %**, garde
   `prefers-reduced-motion` + `scroll-behavior:auto`, or ambiant de `.part` retiré,
   `--bg` tokenisé, cibles tactiles à 44 px, nom accessible du champ de recherche.
   Puis, le même jour, **les dix P2/P3 de charte soldés d'un lot** (détail en « Fait ») :
   `.tip` éteint, deux voix de micro-titre à la place de quatre specs ad hoc,
   `rgba(0,0,0,.14)` remplacé par une couche tonale, piles de fallback complétées,
   `.attention` extraite, anneau `:focus-visible` global, `theme-color`, tap-highlight,
   les 2 `transition:all`, `<main>`.
   Puis, le soir même, **la consolidation typographique** (24 → **8 pas**), qui était le
   dernier reliquat : les 10 findings de rampe qui restaient sont tombés à **0**, sans
   aucun `ignore` — le capteur avait raison, comme annoncé. Il ne subsiste dans le carnet
   qu'un finding `radius` (`mark.hl`, 3px, le surlignage de recherche), hors sujet
   typographique et non traité.

   *Contexte d'origine de l'audit :*
   `/impeccable audit vocabulaire_hebreu.html` a tourné le 19/07 : **13/20**, 4 P1, 9 P2, 7 P3,
   aucun P0. Rapport complet :
   `.impeccable/critique/2026-07-19T09-57-31Z__vocabulaire-hebreu-html__audit.md`.
   Méthode : détecteur + lecture CSS intégrale + **mesures en WebKit réel** (desktop + iPhone 16 Pro).
   **Le constat systémique** : le carnet n'a jamais reçu les trois passes que l'app a reçues.
   Il a **zéro `@media`, zéro `lang`, zéro `:focus-visible`, zéro `prefers-reduced-motion`**
   pendant que `app.html` et `index.html` ont les quatre. Ce n'est pas 20 tickets, c'est un
   décalage de passes — à traiter en lot.
   **Les quatre P1** : (a) `lang="he"` absent des **4903** nœuds hébreux (l'app est à 100 % ;
   un lecteur d'écran prononce donc tout l'hébreu en phonétique française — le défaut le plus
   lourd, sur un document dont l'hébreu *est* le produit) ; (b) `.part` (L294–298) est une
   surface **dorée au repos** sur un séparateur structurel, contre la règle de la lampe —
   vérifié à l'écran, le bandeau pèse plus lourd que le vrai bouton d'action ; (c) aucun
   `prefers-reduced-motion` alors que `scroll-behavior:smooth` (L290) pilote les 27 liens du
   sommaire — et la garde de l'app ne suffirait pas, `scroll-behavior` exige son propre `auto` ;
   (d) `rgba(18,24,31,.86)` (L201) est un doublon non tokenisé de `--bg`.
   **La question « fermer la rampe ou poser un `ignore` » est tranchée : ni l'un ni l'autre.**
   Les deux options partaient d'une prémisse fausse (des tailles « hors liste mais légitimes »).
   Mesure : **24 tailles distinctes pour 52 déclarations** — `1.12rem`, `0.92rem`, `0.82rem`,
   `0.66rem`, `1.35rem`… Ce n'est pas un système de rôles, c'est de la dérive accumulée. Un
   `ignore` ferait taire un capteur qui a raison ; fermer la rampe sur les 24 valeurs actuelles
   documenterait la dérive comme un dessein. Il faut **consolider en 6–8 pas, puis** fermer la
   rampe dans DESIGN.md. Les deux autres familles du détecteur : les `radius` sont un symptôme
   des 4 encadrés inline dupliqués (le défaut est l'absence de classe, pas le rayon) ; et
   `em-dash-overuse` (164) est un **faux positif** — la règle vise l'anglais, le tiret d'incise
   est une ponctuation française standard.
   **Ordre recommandé** : `harden` (lot des passes manquantes) → `quieter` (or de `.part`) →
   `colorize` (11 littéraux dérivés de jetons) → `adapt` (44 px) → `typeset` → `extract` → `polish`.
   **Rectification d'une note antérieure** : j'avais écrit ici que l'`outline:none` de la L209
   violait les invariants d'accessibilité. **C'est faux, mesuré** : il est remplacé par un
   indicateur bordure+halo à **9,07:1** (minimum requis 3:1). C'est une divergence d'idiome avec
   l'app, pas une faute. En revanche l'absence de `:focus-visible` global est réelle (29 arrêts
   sur l'anneau UA) — rupture de charte, pas d'accessibilité.
   ⚠️ Le carnet est la source des cartes : tout passe par `node build.js` puis
   `node verifie_exemples.js`. Les correctifs sont presque tous en CSS/`<head>` (faible risque
   d'extraction) **sauf** l'ajout de `lang="he"`, qui touche les `<span class="he">`.
5. **[FAIT le 19/07 au soir] `.door` prend le jeton `carte` (20px)**, et le
   `border-radius:6px` parasite de la règle `:focus-visible` du portail est supprimé
   (détail en « Fait »). Il ne reste dans les fichiers en périmètre que des findings
   de la famille **rampe typographique** — c'est-à-dire le point 4 **ci-dessus**, pas
   des tickets séparés.
6. **[FAIT le 19/07 au soir] Les 11 piles de polices tronquées d'`app.html` complétées.**
   9 `'JetBrains Mono',monospace` et 2 `'Assistant',sans-serif` → forme entière.
   **Les trois fichiers écrivent désormais les quatre piles normatives en entier** ;
   DESIGN.md §6 est recalé (la dette n'y est plus annoncée comme ouverte) et la voix
   `label` de son bloc de tête, qui reproduisait la forme tronquée, est corrigée.
   Vérifié : 0 pile tronquée dans `app.html` et `flashcards_hebreu.html`, toute pile a
   au moins deux replis, familles calculées en WebKit conformes.
   *Contexte d'origine, à garder pour la leçon :*
   En recalant la documentation je me suis aperçu que la règle que je venais d'écrire dans
   DESIGN.md §6 était **fausse sur deux piles** : je l'avais rédigée d'après la prose du §3 au
   lieu de la relever dans le code (`Arial` manquait dans la pile Assistant, la pile Playpen
   était absente). Corrigé, et le carnet aligné sur la forme réelle d'`app.html`. **Mais
   `app.html` garde 11 déclarations tronquées** : 9 `'JetBrains Mono',monospace` et 2
   `'Assistant',sans-serif`. Sans conséquence visuelle en ligne (les polices Google chargent),
   mais contraire au principe « ça marche dans l'avion » — et le fichier autonome, qui *est* la
   version hors-ligne, en hérite. Travail : 11 remplacements, `node build.js` (qui régénère
   `flashcards_hebreu.html`, donc contrôle navigateur ensuite), commit.
   **Leçon à garder** : une règle de charte se relève **dans le code**, jamais dans la charte.
7. **[FAIT le 19/07 au soir — demande de Ruben] « Catégories » et « Niveau » repliés.**
   Détail en « Fait ». Les cinq points d'attention notés en lisant le code ont tous été
   tenus, et deux d'entre eux ont changé de forme à l'écriture :
   - **Gain mesuré** : panneau 1278 → 874 px (−32 %), arrêts de tabulation 43 → 35.
     L'estimation « ~2,4 → ~1,2 écran » était optimiste : c'est un écran de moins,
     pas la moitié.
   - **La règle « replié dès que la sélection n'est plus vide » a été restreinte à
     l'instant du chargement.** Appliquée en continu, elle referme le groupe sous le
     doigt au moment même où l'on vient d'y choisir quelque chose — on est puni de son
     geste. `applyFoldState()` ne tourne donc qu'au boot (et après une remise à zéro,
     qui repasse par `applyPrefs`) ; ensuite le pli n'obéit qu'à l'utilisateur.
     Inscrit comme règle de charte dans DESIGN.md § Le pli.
   - **Le `<h2>` devient la rangée du `<summary>`** au lieu d'un titre dupliqué au-dessus.
     Il reste la cible de l'`aria-labelledby` (nom accessible non dédoublé, vérifié) mais
     **quitte la voix Title** pour celle du libellé de pli — un groupe replié se lit comme
     un pli, un groupe déplié comme une section. DESIGN.md a été corrigé en conséquence :
     sa voix Title déclarait « Catégories » parmi ses emplois, ce qui était devenu faux.
   - Le résumé se recalcule depuis `updateStart()`, par où passent **toutes** les voies
     qui changent la sélection (chips, `#selall`, remise à zéro, restauration des prefs).
     Au-delà de deux entrées il compte au lieu de lister (`3 catégories`, `Toutes (17)`) :
     une liste coupée à l'ellipse mentirait. L'ordre suit `catOrder`, donc celui des
     chips à l'écran — et non l'ordre des clics.
   - `<summary>` à 44 px sous `pointer:coarse` (mesuré 340×44 sur iPhone 16 Pro).
   ⚠️ *Piège de mesure payé en route, à retenir* : pour compter les arrêts de tabulation,
   ne pas dédupliquer sur `tag+id+class`. Les `<summary>` n'ont ni id ni classe, donc les
   trois plis se confondent et le parcours se coupe au second en croyant boucler — il
   annonçait « 1 SUMMARY » sur 3. Estampiller l'**élément** (attribut posé sur le nœud).

8. **[FAIT le 20/07] Largeur de lecture bornée — la dette est soldée.**
   La prose passe de **158 à 67 caractères par ligne** (médiane ; étendue 50–69, cible
   45–75, **0 bloc sur 13 hors cible** aux cinq largeurs desktop), et la mesure est
   désormais **indépendante du viewport** de 768 à 1440. **Le mobile ne bouge pas d'un
   pixel** : vérifié au comparatif JSON exact sur iPhone 16 Pro, 0 écart sur les 29 tables,
   les 6 axes et les 13 blocs de prose. Deux jetons dans un **troisième bloc `:root`**
   (`--colonne:28rem`, `--colonne-large:56rem`), mise en œuvre par le `padding-inline` de
   `main` — et non par `max-width` + marges auto, qui aurait cassé la fusion des marges
   verticales, c'est-à-dire tout le rythme du document. Règle complète dans DESIGN.md §3.

   ⚠️ **Trois pièges payés en route, tous par la mesure, aucun par le raisonnement.**
   Ils valent d'être lus avant de retoucher ce bloc :
   - **Une colonne se calibre sur l'avance réelle de la prose, pas sur la largeur d'un
     chiffre.** Le « 0 » d'Assistant fait 7,87px, la prose française avance de 6,63px :
     la première version visait 69 caractères et en rendait **82**. Le commentaire que
     je venais d'écrire était faux — exactement le mécanisme du « 1rem = 22px ».
   - **`--colonne-large` est un plancher mesuré (55,6rem), pas un confort.** L'avoir
     resserré à 44rem « puisque les tables portent `min-width:640px` » a mis **7 tables
     sur 29 en défilement** : ce `min-width` est lui aussi un plancher, qui ne joue que
     sur mobile. Les tables se posent en réalité à 759–890px. `56rem` était juste à 6px.
   - **`main > *:not(.table-wrap)` (0,1,1) fait plancher de spécificité.** Un
     `main > h2` (0,0,2) est ignoré **en silence** : la règle des titres est partie en
     vérification morte, avec un commentaire de sept lignes affirmant qu'elle agissait.
     Une règle inerte est pire qu'une règle absente — elle attend qu'on réordonne le
     bloc pour s'appliquer d'un coup.

   Le critère final des titres n'est pas « porte un filet » mais **« porte un filet ET
   ouvre sur un objet au cadre »** : élargir tous les sous-thèmes corrigeait 17 cas et en
   créait 4 (Temps, Lieu & direction, Saisons, Mois, qui ouvrent sur une liste). D'où
   `main > .subtheme:has(+ .table-wrap)`. Décalage filet/contenu résiduel : **0 sur 21**.
   Vérifié en **WebKit réel** en quatre passes (1440/1280/992/900/768 + iPhone 16 Pro),
   dont deux au rouge : la campagne a rattrapé deux de mes erreurs de raisonnement que la
   relecture n'aurait pas vues.

**Checklist côté Ruben (vrai iPhone) — SOLDÉE le 20/07** :

- [x] ~~Réinstaller la PWA / re-sauvegarder l'icône~~ (pour que l'icône ouvre le
      **portail** et non l'app : une icône installée garde le `start_url` de son
      installation). **Fait de longue date.**
- [x] ~~Relever le **nom de la voix** affiché dans Réglages avancés → Prononciation.~~
      **Fait le 19/07 : « Carmit »**, alors que Carmit Enhanced était installée. Dossier
      instruit au point 3 — c'est une restriction de WebKit, pas un réglage manqué.
- [x] ~~Relever la voix dans les Réglages iOS.~~ **Fait le 19/07 au soir : « Carmit
      (forbedret) »** — le téléphone est en norvégien, et iOS y écrit la qualité dans
      le nom, traduite. L'app, elle, n'affiche que « Carmit ». **Cet écart entre les
      deux écrans est la preuve du filtre de WebKit** : le dossier voix est CLOS
      (point 3), et un défaut de code en a été tiré (classement des voix qui lisait un
      libellé traduit).
- [x] ~~Relever l'`identifiant` affiché dans l'app.~~ **Fait le 20/07. Valeur archivée :**

      ```
      Voix hébraïque détectée — Carmit
      identifiant : com.apple.voice.super-compact.he-IL.Carmit
      ```

      ⚠️ **C'est plus dur que ce que le dossier supposait** : nous attendions
      `…compact…` et l'appareil sert `…super-compact…`, un cran **en dessous** encore.
      La voix réellement jouée n'est donc pas seulement « pas l'améliorée » : c'est la
      plus comprimée de la famille. Le dossier voix reste **CLOS** et la conclusion ne
      change pas (c'est le filtre de WebKit, pas un réglage manqué) — mais cette valeur
      explique mieux le « robotique » ressenti, et elle **disculpe définitivement** toute
      idée d'aller chercher un réglage côté iOS.
      **Cette chaîne est désormais la valeur de référence du détecteur** : si la ligne
      affiche un jour `.compact.`, `.enhanced.` ou `.premium.` à la place, le filtre de
      WebKit aura changé et le dossier se rouvrira de lui-même.
- [x] ~~Sentir la frontière défilement/tap de la carte (`#flip`) quand la face déborde.~~
      **Éprouvé à l'usage, rien à corriger** (20/07).

## Fait (historique compact — détail dans les messages de commit)

Chantier lag iPhone, séance d'instruction du 20/07 dans la nuit (`cb44367` l'identité
SRS devient la forme vocalisée `cat|he` — trois homographes fusionnaient leur boîte de
Leitner et `sessRestore` pouvait substituer l'un à l'autre ; migration `srsMigrateIds`,
vérifiée jsdom + WebKit —, `22bd70a` le diagnostic de latence entre aux Réglages
avancés — quatre hypothèses réfutées en émulation, ms affichées sur l'appareil, SW v12,
9/9 WebKit —, `9cefad4` graphe recalé — 335 nœuds/23 communautés, standalone dédupliqué
de ~90 nœuds fantômes).

Plan UX en 7 étapes, terminé (`fd84d94` verdict annulable + no-op champ vide,
`71d6a12` a11y des trois modes + clavier QCM, `2fd2efa` accueil allégé (pli « Réglages
avancés », Commencer collant, 1er lancement tout sauf Phrases), `f5ff87b` mineures,
`65d341c` niveaux CECRL (709 mots classés `data-niveau`, chips Niveau, garde-fou
`EXPECTED_LEVELS`), `ac784a4` exemples en situation (extraction ×2, plis « Voir un
exemple », lot pilote 77), `5e53e8e` re-critique 34/40 + correctifs, `abce563` backlog
mineur). Puis, le 2026-07-18 au soir :

- **[x] Remise à zéro du profil** (`6f074d0`) : zone « Repartir de zéro » en bas du pli
  « Réglages avancés », confirmation en deux temps qui nomme la perte (N cartes suivies),
  « Annuler » = défaut sûr focalisé. Efface `srs_v1`/`prefs_v1`/`sess_v1` et remet l'état
  premier lancement **en place** (y compris les six clés de réglage de `state`, que
  `applyPrefs` seul ne toucherait pas) ; ligne `role="status"`. jsdom 36/36.
- **[x] Diagnostic voix — premier pas** (`f8a00fb`) : la note Prononciation affiche le
  nom réel de la voix retenue (« Voix hébraïque détectée ✓ — … »).
- **[x] Portail à la racine** (`ba93e32`) : `index.html` = porte d'entrée (deux portes,
  la lampe sur les flashcards), l'appli déménage dans **`app.html`**, `build.js` la suit,
  `sw.js` v7 (app.html dans les assets, la coquille racine sert le portail), `start_url`
  → `./app.html`, lien du carnet retargeté.
- **[x] Salut aléatoire du portail** (`2e21068`, sans nikoud `f1004d2`) : « Bienvenue ! »
  ou « ברוכים הבאים! » (exclamation collée), tiré au sort à chaque ouverture.
- **[x] Place de la recherche tranchée** (`b0c225a`) : la « Révision du jour » ouvre
  l'écran, la recherche passe sous la barre de maîtrise — la lampe d'abord.
- **[x] verifie_exemples.js** (`73d0208`) : filet de sécurité des exemples — champs,
  3–8 mots, nikoud par mot, translittération concordante avec `he2tr`/`trKey` **extraits
  d'app.html**, vocabulaire de la phrase ≤ niveau du mot (avertissement, `--strict` pour
  bloquer). Calibré sur le pilote : 0 erreur, 36 avertissements.
- **[x] Contrôle visuel mobile** : parcours complet vérifié en émulation **WebKit réel
  (moteur Safari), profil iPhone 16 Pro** (l'appareil de Ruben) — zéro erreur JS, rendu
  conforme (portail, pli, reset, cartes, recherche déplacée).

Puis, le 2026-07-19 (trois problèmes remontés par Ruben) :

- **[x] Portail en deux temps** : accueil plein écran (« Bienvenue » très grand en or
  tendre, ou « ברוכים הבאים! » — même tirage que le petit salut), « Toucher/Cliquer pour
  entrer », puis les deux portes. L'accueil est un `<button>` plein écran (Tab + Entrée
  au clavier, focus rendu à la première porte) ; sans JS il n'existe pas (portes
  directes) ; `prefers-reduced-motion` respecté.
- **[x] Portes égales** : suppression de `.door.main` (bordure or + bouton or plein sur
  les flashcards, lu comme un faux état « sélectionné ») — les deux portes partagent
  exactement les mêmes styles, l'or n'arrive qu'au survol et sur les liens d'action.
- **[x] L'icône installée ouvre le portail** : `start_url` → `./` dans le manifest,
  `sw.js` v8. Vérifié en WebKit desktop (souris + clavier + sans JS + reduced-motion)
  et iPhone 16 Pro émulé (tactile, zéro débordement horizontal) — 28 contrôles, tout
  passe ; navigation réelle des deux portes testée.
- **[x] Clavier virtuel réservé au bureau** (3e demande du 19/07) : sur tactile
  (`pointer:coarse`), le bouton « Clavier hébreu » et le clavier disparaissent — Ruben
  ajoute le clavier hébreu iOS lui-même, et la translittération tapée reste acceptée ;
  le virtuel ne sert que l'AZERTY du bureau (comportement bureau inchangé : replié,
  ouvert à la demande). CSS pur (`display:none !important` — prime sur les bascules
  `.hide` du JS). Vérifié WebKit : bureau (bouton, ouverture, frappe ש), iPhone 16 Pro
  (absent, « Je ne sais pas » et champ intacts), standalone régénéré idem.
- **[x] Accueil habillé** (2e demande du 19/07) : marque « עברית · Hébreu » retirée de
  l'écran d'accueil (elle reste l'en-tête du second temps), salut personnalisé
  « Ruben vous souhaite la bienvenue ! » / « ראובן מקבל אתכם בברכה! », le א de
  l'icône en glyphe vectoriel doré centré dessous, et deux **ménorahs à sept branches**
  (SVG inline `<symbol>` + `<use>`, flammes or tendre, halo en pseudo-élément qui
  respire — figé sous reduced-motion) qui éclairent les côtés. 33 contrôles WebKit
  (desktop + iPhone 16 Pro), dont non-chevauchement texte/ménorahs — tout passe.

Puis, le 2026-07-19 en fin de journée — **critique impeccable du portail et de l'app
(30/40)**, méthode double agent (revue design isolée + détecteur/preuves navigateur),
WebKit réel iPhone 16 Pro, 17 états capturés :

- **[x] P0 — « Commencer » désactivé ne recouvre plus rien.** `opacity:.4` sur le dégradé
  d'or rendait le bouton *translucide* (l'or restait) : collant au premier écran, il
  recouvrait **4 chips** de catégories en interceptant leurs taps (`elementFromPoint`
  renvoyait `start`) et son libellé s'imprimait par-dessus le texte d'aide du nikoud, les
  deux illisibles. Désormais peau pleine et opaque (`background:none`, filet, `--ink-dim`)
  et sticky scopé à `.start:enabled`. Mesuré après : `position:static`, fond `none`,
  **0 chip recouverte** ; à la sélection d'une catégorie, sticky et or reviennent.
  `#start-hint` reçoit `role="status"` (ses trois messages n'étaient jamais annoncés).
- **[x] P2 — dix cibles tactiles sous 44 px soldées**, chacune mesurée dans l'état où elle
  est réellement visible : `.ex-toggle` 34→44, `#fix-verdict`/`#quiz-fix` 36→44,
  `#btn-skip` 39→44, `#reset-btn` 39→44, `#selall` 19→44, lien carnet 20→44,
  `#speak-btn` et `.ex-speak` 40→44×44.
- **[x] P2 — copie du verdict raté** : « ✗ Réponse : » → « ✗ Pas tout à fait — la
  réponse : », dans le registre de sa branche voisine (« ✓ Presque ! La forme exacte : »).
- **[x] Hiérarchie, typographie seule** (choix de Ruben face au P1 de densité) :
  `.panel h2.lead` sort « Révision du jour » de la voix Title pour la voix display
  (Frank Ruhl 1.5rem, parchemin, sans capitales) — les dix titres du panneau pesaient
  exactement pareil. Aucun contrôle déplacé, aucun or ajouté.
- **[x] Bandeau latéral doré supprimé** (`.example`, carnet) : `border-left:3px solid var(--gold)`
  — interdit par le ban absolu *et* par DESIGN.md §6. Touchait **7** encadrés de grammaire
  (et non 507 : `.example` et `ul.exemples` sont deux classes distinctes).
- **Vérifié au passage, rien à faire** : 0 échec de contraste sur **113** paires mesurées
  (pire valeur réelle 4,93:1) ; `lang="he"` sur **100 %** des nœuds hébreux générés ;
  0 débordement horizontal à 320/402/430 px ; les trois gardes `tagName==='BUTTON'`
  fonctionnent sous vraie frappe clavier ; `prefers-reduced-motion` ne masque aucun contenu
  derrière une transition qui ne se déclenche pas ; 39 arrêts de tabulation, 0 piège,
  ordre = ordre visuel ; les deux portes du portail sont **bien identiques au repos**
  (l'or observé au premier passage n'était qu'un `:hover` retenu par le curseur de test).

Puis, le 2026-07-19 — **l'anneau de focus doré rendu à tout l'interactif** (ex-point 5,
qui n'attendait qu'un mécanisme prouvé) :

- **[x] Cause racine trouvée, et ce n'était pas la piste notée.** La corrélation supposée
  (`-webkit-appearance:auto` + absence de `background-image`) est **réfutée par la mesure** :
  `#selall` est un `<button>` qui a exactement ces deux propriétés et rend l'or. Le vrai
  coupable est **`transition:all`** : le raccourci capture les sous-propriétés `outline-*`,
  et WebKit les fige à leurs valeurs initiales — `medium` (=3 px), `currentColor`, offset 0,
  soit *précisément* l'« anneau UA » observé. Ce n'était donc jamais une affaire de cascade :
  les règles gagnaient bien, c'est l'animation qui n'arrivait pas à destination. Preuve par
  variable unique : `transition:none` sur la seule `.chip` → l'or apparaît immédiatement ;
  et une mesure iPhone a attrapé un état en vol (`2.666667px … off=0.006729px`).
- **[x] Correctif** : les **six** `transition:all` d'`app.html` remplacés par la liste
  explicite `background, color, border-color, opacity` — les seules propriétés que ces
  règles animent réellement. Aucun `transition:all` ne subsiste dans l'app ni dans le
  fichier autonome.
- **[x] Vérifié en WebKit réel** (desktop + iPhone 16 Pro) : **58 arrêts de tabulation,
  0 sans anneau d'or** (18 avant), test rejoué sur les cinq écrans ; les trois boutons du
  mode Cartes nommés dans la critique (`#btn-flip`/`#btn-good`/`#btn-again`) mesurés un par
  un dans l'état où ils sont visibles. **Non-régression du survol** contrôlée : la chip
  passe toujours par une valeur intermédiaire (`rgb(168,134,73)`) entre repos et or.
  `node build.js --check` en phase, 710 cartes, 507 exemples.

Puis, le 2026-07-19 — **le carnet reçoit les passes qui lui manquaient** (les 4 P1 de
l'audit + le bloc tactile) :

- **[x] `lang="he"` : 0 % → 100 %** sur 5003 nœuds hébreux. Deux temps : les éléments
  purement hébreux reçoivent l'attribut directement (2419 `span.he`, 20 `toc-he`, 3
  `part-he`, 7 `ex-he`, 26 `h2`, le `h1`, et les 2350 `span.cursive` **générés par le JS**,
  d'où `cursive.lang='he'` à la création) ; les **177 suites hébraïques insérées dans de la
  prose française** (notes, en-têtes `Présent (הֹוֶה)`, gloses) sont enveloppées dans
  `<span lang="he">` par un scanner sur le HTML brut — sans parseur, pour ne rien altérer
  d'autre. **Couplage d'extraction vérifié** : `build.js --check` reste en phase et le
  fichier autonome est **inchangé au octet** ; la recherche fonctionne toujours en hébreu
  comme en français (3 et 16 résultats mesurés), ce qui était le vrai risque puisque son
  filtre travaille sur `textContent`.
- **[x] Garde `prefers-reduced-motion`** — le carnet n'avait **aucune** règle `@media`. La
  garde inclut `scroll-behavior:auto`, sans quoi elle serait décorative : c'est le
  défilement doux qui anime les 27 liens du sommaire, et le `transition:none` de l'app ne
  l'aurait pas couvert. Vérifié sous `reducedMotion:'reduce'` : `scroll-behavior` = `auto`.
- **[x] Or ambiant de `.part` retiré** (règle de la lampe) : un séparateur structurel n'est
  ni une action, ni une sélection, ni l'identité. Passé à `--bg2` + `--card-edge` ; l'or ne
  subsiste que sur le numéro de partie. Vérifié à l'écran — le bouton d'action redevient
  l'élément le plus lumineux de la page.
- **[x] `--bg` tokenisé** : `rgba(18,24,31,.86)` → `color-mix(in srgb, var(--bg) 86%, transparent)`,
  avec repli plein pour les moteurs sans `color-mix`.
- **[x] Cibles tactiles : 21 sous 44 px → 0** (iPhone 16 Pro mesuré) — bloc
  `@media (pointer:coarse)` sur les 27 pastilles du sommaire, `.app-link` et `.search-clear`
  (28→44, son jumeau dans l'app était déjà à 44).
- **[x] Champ de recherche nommé** (`aria-label`) : il n'avait qu'un `placeholder`.
- **Contrôlé après coup** : 0 erreur JS, 0 échec de contraste, 0 débordement horizontal,
  710 cartes et 507 exemples intacts.

Puis, le 2026-07-19 au soir — **les avertissements du validateur soldés (31 → 2)**
et le portail remis au barème (points 2 et 5 de « Reprendre ici ») :

- **[x] Orthographe : quatre mots écrits de deux façons** (`41cf08c`). מְאוֹד→מְאֹד,
  עַכְשָׁו→עַכְשָׁיו, שָׁחֹר→שָׁחוֹר, בַּחֹרֶף→בַּחוֹרֶף — à chaque fois une poignée d'exemples
  dérivaient contre leur propre entrée et la grande majorité des autres. L'exemple de
  la carte שחור écrivait même son mot vedette autrement que son entrée. **Direction du
  correctif, à garder** : aligner les exemples sur l'entrée, **jamais l'inverse** —
  toucher une entrée réinitialise sa progression SRS. Vérifié : 0 identité déplacée.
  10 avertissements de moins. (Depuis le 20/07 l'identité est `cat|he` **vocalisé** —
  la règle s'est donc durcie : même une retouche de nikoud déplace l'identité.)
- **[x] La fourmi n'était pas une fourmi** (`302d4ec`) : l'entrée portait נָמָל, qui
  veut dire *port*. Tout le reste de la ligne décrivait pourtant la fourmi (genre f,
  pluriel נְמָלִים, exemple « les fourmis travaillent… ») — seul le mot vedette était
  faux. `Noms|נמל` → `Noms|נמלה`, seule identité SRS déplacée des 713.
- **[x] Portail au barème** (`ea3eab5`) : `.door` 18px → **20px**, tranché par le
  voisinage (c'est une quasi-copie de `.flip`, la carte de l'appli : même dégradé
  `160deg`, même bordure `--card-edge`). Et suppression du `border-radius:6px` de la
  règle globale `:focus-visible` — un rayon posé là ne décore pas l'anneau, il
  **redessine l'élément** focalisé ; en pratique il n'atteignait personne (les portes
  gagnaient la cascade) et app.html, l'idiome de référence, ne le pose pas.
- **[x] Les 21 avertissements restants soldés** (`436e3a4`), trois groupes :
  **(a)** trois vrais trous du lexique comblés — אוּלְפָּן (Noms A2, avec son exemple,
  règle de couverture oblige), מִדַּי et כָּל כָּךְ (Mots de quantité A2) ; 710 → **713
  cartes**, 507 → **510 exemples**, aucune identité perdue. **(b)** le lexique du
  validateur ne lisait que les cartes : שֶׁלְּךָ, שֶׁלָּנוּ, אוֹתְךָ étaient dits « hors
  carnet » alors qu'ils figurent en toutes lettres dans « Prépositions fléchies », une
  section de grammaire sans cartes. Il verse maintenant aussi l'hébreu de grammaire,
  avec **deux garde-fous à ne pas retirer** : exclusion des `<ul class="exemples">`
  (sinon chaque phrase validerait son propre vocabulaire) et ajout *uniquement* de
  mots inconnus au niveau 0 — un mot de grammaire ne doit jamais abaisser le niveau
  d'une carte, ce qui neutraliserait le contrôle 5 en silence. **(c)** le seuil de
  niveau passe de +1 à **+2** : les 13 avertissements étaient tous à +1 exactement, et
  une phrase du quotidien pour un verbe A1 réclame des noms concrets (תִּינוֹק, מַתָּנָה,
  מִכְתָּב) qui sont A2 par nature — le signal se noyait dans l'inévitable.
- **Vérifié** : WebKit réel iPhone 16 Pro, app.html **et** fichier autonome à
  l'identique — « אולפן »/« oulpan » trouvent la nouvelle carte, « fourmi » renvoie
  נְמָלָה, 0 erreur JS ; portes à 20px, anneau d'or `rgb(212,162,76)` sur chaque arrêt
  de tabulation, 0 débordement horizontal.

Puis, le 2026-07-19 — **les dix P2/P3 de charte du carnet soldés d'un lot** (le reste du
point 4). Aucun n'a touché au vocabulaire : `node build.js` répond **« flashcards_hebreu.html
déjà à jour »**, c'est-à-dire que le fichier autonome est **inchangé au octet** — la preuve
la plus courte que l'extraction n'a pas bougé. 713 cartes, 510 exemples, 2 avertissements
(les deux légitimes déjà documentés) :

- **[x] `.tip` éteint** (choix de Ruben) — la seconde surface dorée au repos rejoint `.part` :
  `--bg2` + `--card-edge`, l'or ne subsistant que sur le texte de `.tip-title`. Hors de la
  carte « Révision du jour », plus **aucune** surface n'est teintée d'or au repos dans les
  trois fichiers. Mesuré après : `background-image:none`, bordure `rgb(44,56,68)`.
- **[x] Quatre micro-titres ad hoc → deux voix nommées** (choix de Ruben). Il n'y avait pas
  quatre idées mais deux rôles : la **voix Title** (Assistant 700 / 0,84rem / 0,12em / or)
  pour `thead th` et `.subtheme` (×21), et une **voix Repère-mono** (JetBrains Mono /
  0,7rem / 0,14em) pour `.toc-group-label` et `.part-num`. Vérifié en WebKit : les deux
  paires ont des specs calculées **identiques**. `.subtheme` est du même coup **inscrit dans
  DESIGN.md §3** comme emploi déclaré de la voix Title, et non « toléré » : la contradiction
  code/charte venait d'un angle mort de la charte (ses quatre emplois d'origine vivaient
  tous dans `app.html`, le carnet n'avait jamais été inventorié), pas d'une dérive du carnet.
  Effet de bord mesuré : le détecteur passe de **24 à 10 findings** de rampe typographique.
- **[x] `rgba(0,0,0,.14)` → couche `carte`** : un cinquième gris inventé (règle des couches),
  qui rendait en plus les blocs d'exemples presque indiscernables de leur rangée. Ils passent
  à `var(--card)` — la même couche que l'encadré `.example` de la grammaire, si bien que les
  **deux familles d'exemples du carnet se lisent enfin pareil**. C'est le seul changement
  visible du lot sur les 510 exemples : ils cessent d'être un creux pour devenir une surface
  posée. Captures avant/après à l'appui.
- **[x] Piles de fallback complétées** — `'Frank Ruhl Libre',serif` partout devenait, hors
  ligne, un `serif` générique qui rend mal le nikoud, alors que la charte spécifiait David
  Libre. Les trois piles sont désormais écrites en entier. Règle inscrite dans DESIGN.md §6
  (corollaire de « ça marche dans l'avion »).
- **[x] Deux composants qui s'ignoraient extraits** : `.attention` (les 4 `style=` inline
  identiques de l'audit) **et `.gram-title`** — 5 duplications d'un même titre de
  sous-section de grammaire (« שֶׁל — possessif », « לְ — datif »…) que **l'audit n'avait
  pas relevées**, trouvées en relisant le diff. À retenir : relire son propre diff attrape
  ce qu'un détecteur qui ne lit que le CSS ne peut pas voir — ces cinq-là vivaient dans
  des attributs `style=` du corps du document. Il ne reste **0 `<div style="color:var(--gold)…`**.
  Et le **pointillé ne dit plus qu'une chose** — « rien ici » (`.empty`) : il portait deux
  sens opposés, les encadrés d'avertissement et le soulignement des sous-thèmes passent au
  filet plein. Supprime aussi 4 des 5 findings `radius` du détecteur.
- **[x] Anneau `:focus-visible` doré global** — le carnet était le seul des trois fichiers
  sans. Mesuré sous vraie tabulation : **23 focusables déclarés, 1 masqué, 22 arrêts
  parcourus, 0 sans anneau d'or**. Le champ de recherche perd son `outline:none` et son glow
  (DESIGN.md §5 : « bordure or au focus, pas de glow ») et reçoit les deux idiomes de l'app.
  ⚠️ Les deux `transition:all` ont été corrigés **d'abord** : dans l'autre ordre, le nouvel
  anneau serait né déjà cassé (le raccourci fige les `outline-*`).
- **[x] P3 restants** : `<meta name="theme-color">`, `-webkit-tap-highlight-color` dans le
  `*{}`, et `<main>` autour des trois parties (le sommaire et la recherche restent dehors —
  l'un est une navigation, l'autre un outil global).
- **Vérifié en WebKit réel** (22 contrôles, desktop 1280 + iPhone 16 Pro) : 0 erreur JS,
  **0 échec de contraste**, 0 débordement horizontal, **0 cible tactile sous 44 px**,
  `scroll-behavior:auto` sous reduced-motion, et la **recherche intacte** — « fourmi » → 1,
  « אולפן » → 2, « maison » → 16.
  ⚠️ *Piège de mesure rencontré, à retenir* : lire `borderTopColor` juste après un `.focus()`
  par API renvoie encore `--line` et se lit à tort comme un défaut — la transition de 150 ms
  est **en vol**. Il faut attendre sa fin (ou cliquer pour de vrai) avant de conclure.

Puis, le 2026-07-19 au soir — **la consolidation typographique du carnet, et la cause de
la dérive** (dernier reliquat du point 4). `node build.js` répond **« flashcards_hebreu.html
déjà à jour »** : le fichier autonome est **inchangé au octet**, 713 cartes, 510 exemples,
2 avertissements (les deux légitimes). 17 contrôles WebKit au vert, 0 au rouge :

- **[x] La cause racine, trouvée en mesurant avant d'écrire.** `font-size:22px` est posé
  sur **`body`**, jamais sur `html` — dans les trois fichiers. Il ne déplace donc pas la
  racine des `rem` : **1rem vaut 16px**, et le commentaire du carnet (« *base agrandie
  (+12 %) — tout le reste est en rem/em et suit* ») était faux. **C'est lui qui expliquait
  les 24 valeurs** : chacune avait été poussée à tâtons contre une base qui ne réagissait
  pas comme annoncé. Ce n'était donc pas de la négligence, et c'est pourquoi il ne fallait
  surtout pas se contenter de regrouper les valeurs. ⚠️ **Ne pas « corriger » en déplaçant
  le 22px sur `html`** : ×1,375 sur chaque `rem` du carnet *et* d'`app.html`, dont les
  tailles sont réglées sur ce qu'elles rendent vraiment. Le commentaire était faux, pas le CSS.
- **[x] Rampe de 8 pas** dans un **second bloc `:root` local** (le premier reste le jeu de
  jetons partagé, identique au caractère près) : `--pas-titre` 2.3rem … `--pas-micro`
  0.7rem. **44 remplacements**, aucune taille littérale hors rampe. Exception unique et
  nommée : `1.15em` sur l'hébreu de prose (« un cran au-dessus de ce qui m'entoure »),
  qui produit 3 valeurs dérivées tombant d'elles-mêmes près des pas voisins.
  Rampe **fermée dans DESIGN.md §3** (tableau + 4 entrées de frontmatter).
- **[x] Trois défauts que seule la mesure révélait**, et que la rampe seule n'aurait pas
  corrigés : (a) `body` n'avait **aucun `line-height`** et héritait de `normal` (~1,2),
  trop serré pour du nikoud qui se compose **sous** la ligne de base — passé à `1.55`,
  valeur que `.steps li` et `.tip p` avaient déjà choisie chacun de son côté sans qu'elle
  remonte jamais à la racine ; (b) la prose grammaticale sortait à **15,2 px** (0.95rem
  contre une base qu'on croyait à 22px) → 16 px ; (c) le **nom français de chaque section**
  (`h2 .count`) sortait à **11,2 px en gris** — le seul repère de navigation d'un
  francophone dans un document dont tous les titres sont en hébreu → 13,4 px, parchemin plein.
- **[x] 152 hébreux de prose rendus au serif.** Sur les 204 `span[lang="he"]` **sans
  classe** (les suites hébraïques enveloppées au milieu d'un paragraphe français, posées
  par la passe a11y du matin), 152 vivent dans de la prose et héritaient d'**Assistant à
  15,2 px** — soit exactement la taille et la famille du français qui les entoure. Deux
  règles de charte tombaient d'un coup : les **trois voix** (« Frank Ruhl pour *tout*
  l'hébreu ») et la **vedette** (« toujours plus grand que sa traduction »). Pire, à cette
  échelle en sans, le nikoud devient illisible — or ces passages sont précisément ceux qui
  l'enseignent. Réparé en **CSS pur**, sans toucher au HTML, via
  `span[lang="he"]:not([class])` : le sélecteur ne peut pas atteindre `.he`, `.cursive`,
  `.toc-he`, `.part-he` ni `.ex-he`, qui ont chacun leur voix. **`thead th` et `.tr` sont
  explicitement exclus** — leurs voix déclarées (Title, mono) gardent la main sur leur
  hébreu. Captures avant/après : le paragraphe des binyanim passe de blocs illisibles à
  du nikoud net.
- **[x] La règle de la vedette rendue visible** sur `.part` : `.part-name` (1.45rem) et
  `.part-he` (1.5rem) n'étaient séparés que de **1,1 px**. L'intention était écrite mais
  invisible. Les deux ont été **écartés d'un vrai pas** (compagnon / vedette) plutôt que
  fusionnés — une hiérarchie qu'on ne voit pas n'est pas une hiérarchie.
- **[x] Quatre `style=` inline supprimés** : les trois `font-size:1.2rem` des binyanim
  (ils compensaient à la main un `1.15em` jugé trop faible — la rampe absorbe le besoin)
  et le sous-titre du `<h1>`, extrait en `.h1-sub`.
- **Vérifié en WebKit réel** (desktop 1280 + iPhone 16 Pro), 17 contrôles : 12 tailles
  rendues = 9 pas + 3 dérivées `em`, **0 intruse** ; interlignage 1.55 hérité ; **0 échec
  de contraste sur 42 paires notées** (pire 6,28:1) ; recherche intacte (« fourmi » → 1,
  « אולפן » → 2, « maison » → 16) ; **23 focusables déclarés, 22 arrêts, 0 sans anneau
  d'or** ; 0 débordement de 320 à 1280 px ; **0 cible tactile sous 44 px** ; 0 erreur JS.
  ⚠️ *Deux pièges de mesure payés en route, à retenir* : (1) un contrôle de contraste dont
  la regex était `[\d.]` mal échappé **notait zéro paire** et affichait un vert — un
  contrôle qui ne mesure rien passe toujours ; vérifier qu'il annonce le **nombre de paires
  réellement notées**. (2) `#voc-search-clear` n'existe que si le champ est rempli : le
  compter comme un arrêt de tabulation fabrique un faux défaut (il n'est jamais focalisé,
  donc rend l'anneau UA). C'est le « 1 masqué » déjà documenté le matin.

Puis, le 2026-07-19 au soir — **les quatre chantiers demandés par Ruben** (points 7, 3, 6
et la garde de couverture). Aucun n'a touché au vocabulaire : 713 cartes, 510 exemples,
2 avertissements (les deux légitimes). 56 contrôles WebKit au vert, 0 au rouge :

- **[x] L'écran de départ se replie** (point 7). « Catégories » et « Niveau » passent sous
  deux `<details class="adv">` identiques au pli « Réglages avancés » : **1278 → 874 px**
  de panneau (−32 %), **43 → 35 arrêts de tabulation**. Le `<summary>` porte la sélection
  (« Verbes, Noms », « Toutes (17) », « Facile ») ; au-delà de deux entrées on compte
  plutôt que de lister, une liste coupée à l'ellipse étant mensongère ; l'ordre suit
  celui des chips à l'écran, pas celui des clics. **Deux décisions prises à l'écriture** :
  l'état ouvert/replié ne se décide **qu'au chargement** (ouvert tant que la sélection est
  vide) — en continu, le pli se refermerait sous le doigt au moment du premier choix ; et
  le `<h2>` **devient** la rangée du `<summary>`, ce qui lui fait quitter la voix Title
  tout en restant le nom accessible du `role="group"`. Les deux sont inscrites dans
  DESIGN.md § Le pli, et la voix Title y a été corrigée : elle déclarait « Catégories »
  parmi ses emplois, ce qui était devenu faux.
- **[x] Le dossier « voix robotique » est CLOS par une preuve** (voir point 3). Ruben
  relève « Carmit (forbedret) » dans les Réglages iOS — téléphone en norvégien — quand
  l'app affiche « Carmit ». L'écart entre les deux écrans démontre le filtre de WebKit,
  là où nous n'avions qu'un rapport de bug de 2019. Corrige au passage une phrase fausse
  de notre note (« le nom ne dira jamais Enhanced » : il le dit, traduit — c'est le nom
  vu par `getVoices()` qui ne le dit pas).
- **[x] Le classement des voix ne dépend plus de la langue du téléphone** — défaut réel
  révélé par cette donnée. `loadVoices()` testait « enhanced »/« premium »/« hebrew »
  sur `name`, champ localisé : sur un appareil non anglophone, une voix améliorée aurait
  été classée comme ordinaire, en silence. Score et filtre lisent maintenant d'abord
  `voiceURI`. Dormant aujourd'hui, filet pour demain. 9 contrôles WebKit (noms norvégien,
  allemand, anglais, cas réel, voix reconnue par son seul identifiant, absence de voix).
- **[x] La note Prononciation affiche le `voiceURI`** (point 3), sous le nom de la voix,
  en voix Label et en LTR. Dernier test du dossier « voix robotique » : `name` ne dit
  jamais la qualité (deux champs distincts au niveau système, un seul exposé par l'API),
  l'identifiant si. Quatre scénarios vérifiés — voix compacte, `voiceURI` absent (repli
  explicite, pas de ligne vide), aucune voix hébraïque (message et `body.no-he-voice`
  inchangés, pas de ligne orpheline), identifiant très long sur iPhone 16 Pro (0
  débordement). **La suite ne dépend plus du code** : Ruben lit l'identifiant.
- **[x] Les 11 piles de polices tronquées d'`app.html` complétées** (point 6) : 9 mono,
  2 Assistant. Les trois fichiers écrivent enfin les quatre piles normatives en entier.
  DESIGN.md §6 recalé (la dette n'y est plus annoncée comme ouverte) et sa voix `label`
  corrigée — elle reproduisait justement la forme tronquée relevée dans `app.html`,
  nouvelle illustration de la leçon « une règle de charte se relève dans le code ».
- **[x] `build.js` tient la couverture des niveaux** au lieu de la supposer. 713/713
  n'était vrai que par chance : le garde-fou existant n'attrapait qu'une disparition de
  niveau *entier*, si bien qu'un mot ajouté sans `data-niveau` passait en silence et
  serait apparu jusque dans « Facile ». Le build échoue désormais en nommant les mots,
  et affiche une ligne « couverture N/N ». Vérifié en retirant un `data-niveau` : code
  de sortie 1 en mode normal **et** `--check`, fichier autonome non réécrit.
- **Contrôlé au passage** : les **19 ancres de lignes** des quatre documents étaient
  toutes fausses (dérive de +22 à +82 selon l'endroit) ; recalées et vérifiées une à une.
  ⚠️ *Piège de mesure à retenir* : pour compter les arrêts de tabulation, ne pas
  dédupliquer sur `tag+id+class` — les `<summary>` n'ayant ni id ni classe, les trois
  plis se confondent et le parcours se coupe au second en croyant boucler (il annonçait
  « 1 SUMMARY » sur 3). Estampiller l'élément lui-même.

Décisions actées (ne pas re-débattre sans nouvelle demande) :

- Le **portail est la racine** ; l'appli vit dans `app.html` ; l'icône installée ouvre
  le **portail** (`start_url: "./"` — demande de Ruben du 2026-07-19, qui annule le
  `./app.html` du 18/07 : atterrir directement dans les flashcards le surprenait).
- Le portail est un **accueil en deux temps** : « Bienvenue » très grand plein écran,
  un toucher, puis deux portes **strictement égales** (aucune dorée d'avance — l'ancien
  encadré doré des flashcards se lisait comme un faux état « sélectionné »).
- L'écran de réglages reste le premier écran de l'appli ; il s'ouvre sur la « Révision
  du jour », la recherche vit dessous.
- Le salut du portail : **personnalisé** depuis le 2026-07-19 — « Ruben vous souhaite
  la bienvenue ! » / « ראובן מקבל אתכם בברכה! » (prénom adapté ראובן ; tournure
  idiomatique לקבל בברכה, corrigée le même jour sur question de Ruben — מאחל +
  ברוכים הבאים ne se dit pas), tiré au sort fr/he, toujours **sans nikoud** et
  exclamation collée en hébreu ; l'écho du second temps garde la formule courte
  « ברוכים הבאים! ». Le prénom sur la page publique est une
  **exception assumée** (demande explicite du 19/07) à la neutralité du dépôt — les
  docs, l'historique git et la config restent au pseudonyme.
- Les **lots d'exemples s'écrivent sans relecture humaine**, gardés par
  `verifie_exemples.js` (0 erreur exigé avant commit).
- **Une incohérence entre un exemple et son entrée se corrige dans l'exemple**, jamais
  dans l'entrée : l'identité SRS d'une carte est `cat|he` (forme **vocalisée** depuis
  le 20/07 — la forme plate fusionnait les homographes לספר/ללמד/שלומך), donc toucher
  un mot vedette, **nikoud compris**, remet sa progression Leitner à zéro. On ne
  déplace une entrée que pour une vraie faute (cf. נָמָל → נְמָלָה), et en le disant.
- **Le validateur alerte sur le vocabulaire à +2 niveaux, pas à +1** : +1 est la
  texture normale d'une phrase du quotidien, pas un défaut.
- **Hors « Révision du jour », aucune surface n'est teintée d'or au repos** — `.part`
  puis `.tip` ont été éteints le 19/07, chacun après le même test : « action, sélection
  ou identité ? ». L'emphase d'un contenu se dit par la position et le titre, pas par
  la lumière.
- **Le pointillé signifie « rien ici », et rien d'autre** (`.empty` seul). Un encadré
  important prend un filet plein.
- **Un pli ne se referme jamais sous le doigt de l'utilisateur** : l'état ouvert/replié
  se décide au chargement (ouvert tant que la sélection du groupe est vide), jamais en
  réaction à un clic. Refermer un groupe au moment où l'on vient d'y choisir quelque
  chose donne l'impression d'être puni de son geste.
- **Un pli condense, il ne cache pas** : sa rangée porte toujours un résumé véridique de
  ce qu'elle contient. Au-delà de deux entrées, un compte plutôt qu'une liste — une liste
  coupée à l'ellipse en dit moins que rien, elle ment.
- **Un `<h2>` qui devient la rangée d'un pli quitte la voix Title** pour celle du libellé
  de pli, tout en restant le nom accessible du `role="group"`. Un groupe replié se lit
  comme un pli, un groupe déplié comme une section. (À l'*intérieur* d'un pli, en
  revanche, les titres gardent la voix Title : le pli range, il ne rétrograde pas.)
- **Tout mot du carnet doit porter `data-niveau`** — `build.js` échoue sinon, en nommant
  le mot. La tolérance de l'appli (un mot non classé reste visible partout) reste un
  filet de robustesse, pas une licence pour omettre l'attribut.
- **`.subtheme` et `thead th` sont des emplois déclarés de la voix Title** (DESIGN.md §3,
  19/07) : la charte avait un angle mort — elle n'avait inventorié que `app.html`.
- La révision du jour ignore le filtre Niveau ; un mot sans `data-niveau` reste visible
  quel que soit le filtre — et l'interface le dit.
- API TTS externe rejetée pour la voix (le tout-statique hors-ligne prime).
- **Les voix « Enhanced » sont hors de portée du web sur iOS** (sourcé *et prouvé sur
  l'appareil* le 19/07) : WebKit ne publie que les voix compactes préinstallées. Ne plus
  proposer à Ruben d'en installer une — ce n'est pas un réglage, c'est un plafond de
  plateforme. **La preuve tient en une comparaison** : les Réglages iOS affichent
  « Carmit (forbedret) », l'app « Carmit ». Ne pas confondre les deux écrans : c'est leur
  écart qui démontre le filtre, et le nom vu dans iOS n'infirme rien.
- **Le `name` d'une voix est LOCALISÉ, jamais une donnée à tester en code.** iOS écrit la
  qualité dedans, mais traduite (« forbedret », « Erweitert », « Enhanced »). Toute
  logique de détection ou de classement se branche sur `voiceURI`, identifiant
  reverse-DNS non traduit. Règle générale : **ne jamais brancher une logique sur un
  libellé destiné à l'utilisateur.**
- **`font-size:22px` est sur `body`, pas sur `html` — donc 1rem vaut 16px**, dans les
  trois fichiers. Mesuré le 19/07. Ne pas « réparer » en déplaçant la déclaration sur
  `html` : ×1,375 sur chaque `rem` du carnet *et* d'`app.html`, dont les tailles sont
  réglées sur leur rendu réel. Le commentaire qui prétendait l'inverse était faux ; il
  a été corrigé, et c'est lui qui expliquait la dérive des 24 tailles.
- **Le carnet a sa propre rampe de 8 pas**, dans un **second** bloc `:root` local — le
  premier reste le jeu de jetons partagé, identique au caractère près entre les trois
  fichiers. Aucune taille littérale hors rampe ; seule exception nommée, le `1.15em` de
  l'hébreu en prose, relatif par nature.
- **Tout hébreu se compose en Frank Ruhl**, y compris celui inséré au milieu d'un
  paragraphe français (`span[lang="he"]:not([class])`). Deux voix déclarées gardent la
  main sur le leur et sont explicitement exclues : `thead th` (voix Title) et `.tr` (mono).
- **Le périmètre des exemples est arrêté** : après le lot Prépositions / Adverbes /
  Mots interrogatifs (54 mots), la question est close. Nombres, Expressions, Saisons &
  mois, Pronoms et Jours **n'auront pas d'exemples** — décision de Ruben du 19/07,
  motif : ces mots-là se comprennent sans mise en situation.

## Pistes de design ouvertes — explorées le 19/07 au soir

Les deux étaient notées en une ligne d'intention. Lecture du code faite, mesures prises ;
voici ce qu'elles valent réellement.

### A. Les deux « lampes » de l'accueil — **➤ [FAIT le 20/07 au soir] LIVRÉ ET VÉRIFIÉ**

**Livré.** `body.has-due` posé par `refreshSrsUi()`, « Commencer » à trois registres,
sticky conditionnel, `.review-card:disabled` sans opacité. Vérifié en WebKit réel
(iPhone 16 Pro) : **50 arrêts de tabulation, 0 défaut d'anneau de focus** ; **0 pixel
doré** sur `#start` secondaire (0/246 825) comme sur `#review-btn` désactivé
(0/344 736) ; `position` = `static` à `due>0` et `sticky` à `due=0`, relevé à cinq
hauteurs de défilement ; **aucune différence** de style calculé à 1440/1280/992/768
hors la règle `pointer:coarse` elle-même. Spec complète :
`docs/superpowers/specs/2026-07-20-lampes-accueil-design.md`, décision consignée dans
DESIGN.md §5.

⚠️ **Ce que la piste avait faux, et qui vaut plus que ce qu'elle avait juste** : elle
proposait le `filet --card-edge` comme distinction du secondaire actif. `--card-edge`
(#2c3844) et `--line` (#2a3440) sont indiscernables — la distinction repose en réalité
sur la **surface** et le **texte** seuls. Deux jetons nommés différemment ne sont pas
nécessairement deux valeurs différentes.

⚠️ **Deux mesures se sont révélées impossibles, et ce ne sont pas des défauts** : WebKit
exclut les boutons `disabled` de l'ordre de tabulation, donc `#start` désactivé et
`#review-btn` désactivé ne peuvent pas porter de `:focus-visible`. Un critère
d'acceptation qui les exigeait était mal écrit, pas violé.

*Texte d'origine de la piste, conservé pour l'analyse qui l'a produite :*

**Piste confirmée, et elle cache un défaut de charte**

Le problème est réel et mesurable dans le CSS. Quand des cartes sont dues, **deux surfaces
dorées coexistent** sur le même écran :

- `.review-card` ([app.html:511](app.html#L511)) — bordure `--gold` pleine + dégradé d'or
  135° (16 % → 5 %), icône et flèche en or ;
- `.start` ([app.html:148](app.html#L148)) — dégradé d'or **plein** + lueur portée
  `0 6px 18px -8px var(--gold)`.

C'est exactement ce que la règle de la lampe interdit : deux lumières d'égale intensité,
donc aucune hiérarchie. La voix display gagnée le 19/07 par « Révision du jour » a réglé la
*typographie*, pas la *lumière*.

**Forme proposée — une seule lampe à la fois, choisie par l'état** :
`refreshSrsUi()` connaît déjà `due` ; il suffit qu'il pose un drapeau
(`document.body.classList.toggle('has-due', due>0)`), et que le CSS fasse le reste :

- `due > 0` → la révision garde l'or ; « Commencer » passe en **secondaire actif** ;
- `due === 0` → la révision est déjà éteinte (elle est `:disabled`), « Commencer » reprend
  l'or plein. Aucun changement dans ce cas.

⚠️ **Le vrai risque, à ne pas sous-estimer** : le « Commencer » désactivé porte déjà
`background:none; border-color:var(--line); color:var(--ink-dim)`. Un « Commencer »
*secondaire mais actif* lui ressemblerait à s'y méprendre — seule la couleur du texte
changerait. Il faut donc un troisième registre lisible (piste : filet `--card-edge` +
texte `--ink` plein + bordure qui passe à l'or au survol), et **le vérifier à l'écran côte
à côte avec l'état désactivé**, sinon on troque un défaut de hiérarchie contre un défaut
d'affordance — ce qui serait pire.

🔎 **Trouvé en explorant, à traiter avec** : `.review-card:disabled` porte `opacity:.55`
([app.html:518](app.html#L518)) — or DESIGN.md §5 interdit désormais d'exprimer un état
désactivé par une opacité, règle apprise en juillet sur ce même bouton « Commencer ». Ici
le fond doré *est* bien remplacé par `--bg2`, donc le symptôme grave (l'or translucide)
n'existe pas ; mais l'opacité fait aussi pâlir le texte et l'icône, qui restent en or. À
remplacer par une peau pleine, comme `.start:disabled`.

### B. « Facile » comme vrai contrat — **question périmée, mais elle en a révélé une vraie**

La piste demandait s'il fallait masquer les mots non classés quand un niveau est coché.
**Mesuré : la question ne se pose pas.** 213 `<li>` + 500 `<tr>` portent `data-niveau`,
soit **713 sur 713 cartes** — couverture stricte à 100 %, aucun mot non classé. Changer la
sémantique du filtre n'aurait donc *aucun effet observable* aujourd'hui.

**En revanche l'exploration a mis au jour un vrai trou** : rien ne garantit que cette
couverture tienne. `build.js` compte les niveaux et n'échoue que si un niveau **entier**
disparaît (`EXPECTED_LEVELS`, [build.js:33](build.js#L33)) ; un mot ajouté **sans**
`data-niveau` passe donc en silence — et il sera visible sous tous les filtres, y compris
« Facile ». C'est précisément le scénario qui rendrait la piste A pertinente, sauf qu'on ne
le verrait jamais venir.

**➤ [FAIT le 19/07 au soir] La garde de couverture des niveaux est en place** dans
`build.js`, sur le modèle exact de la règle de couverture des exemples de
`verifie_exemples.js` : une carte sans `niveau` fait échouer le build, qui **nomme** les
mots fautifs, et une ligne « couverture 713/713 » s'ajoute au tableau des niveaux pour
que le contrôle annonce ce qu'il mesure (un contrôle muet passe toujours au vert).
Vérifié en retirant un `data-niveau` du carnet : le build nomme la carte
(« Verbes — לָרוּץ »), sort avec le code **1** en mode normal *et* `--check`, et ne
réécrit pas `flashcards_hebreu.html`. La propriété n'est plus vraie par chance.
La tolérance de l'appli (un mot non classé reste visible partout) **reste** : c'est un
filet, et cette garde vise à ce qu'il ne serve jamais.
La piste de design d'origine, elle, est **close** : le filtre garde sa sémantique actuelle
(un mot non classé reste visible partout), qui est déjà une décision actée plus haut.

## Outillage (WSL, à recréer en début de session si besoin)

- **Logique/DOM** : Node + jsdom dans le scratchpad de session
  (`npm i jsdom playwright` — installer les DEUX ensemble, npm évince l'autre sinon),
  booter `flashcards_hebreu.html` avec `runScripts:'dangerously'`.
- **Rendu visuel (mobile ET desktop)** : Playwright + **WebKit** (vrai moteur Safari — les
  libs système sont installées) avec `devices['iPhone 16 Pro']` ; captures d'écran à
  l'appui, relues visuellement. Les navigateurs téléchargés **persistent** dans
  `~/.cache/ms-playwright` (webkit-2311 en place) : en début de session, un simple
  `npm i playwright` dans le scratchpad suffit — ne relancer
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 npx playwright install webkit` que si le
  cache a disparu. Le Chrome système (`google-chrome --headless`) pend en WSL2 — ne pas
  l'utiliser. **Piloter depuis un sous-agent, jamais depuis la session principale**
  (étape 3 du rituel) : c'est l'outil qui pollue le plus une fenêtre de contexte.
- **Suite de contrôle du portail** : `verifie_portail.js` (scratchpad de session, à
  recréer au besoin) — 33 contrôles : accueil/portes en desktop (souris, clavier, sans
  JS, reduced-motion), iPhone 16 Pro (tactile, débordement, chevauchement
  texte/ménorahs), navigation réelle des deux portes, `start_url`, tirage fr/he
  (détection hébreu par plage Unicode, pas par mot littéral).
- **Suite d'audit** (scratchpad, à recréer au besoin — écrite le 19/07 pour l'audit du
  carnet, réutilisable sur n'importe quelle page) : `audit_carnet.js` mesure en un passage
  le contraste réel de chaque nœud texte (composition alpha comprise, seuils AA 4,5:1/3:1),
  la hiérarchie des titres et les sauts de niveau, les landmarks, la **couverture `lang="he"`**
  (parcours du DOM avec remontée d'ancêtres), l'anneau de focus sous vraie tabulation, le
  débordement horizontal à 320/375/402/430/768 px et les cibles tactiles sur iPhone 16 Pro.
  ⚠️ Piège Playwright : la forme **chaîne** d'`evaluate()` attend une *expression* — envelopper
  le corps dans `(()=>{ … })()`, sinon `SyntaxError: Unexpected keyword 'function'`.
- **Suite de mise en page** (scratchpad, à recréer au besoin — écrite le 20/07 pour le
  bornage de la largeur de lecture, réutilisable sur tout changement de layout). Elle
  compare **deux copies du fichier**, l'une avec le bloc CSS en cause retiré, aux six
  largeurs 1440/1280/992/900/768 + iPhone 16 Pro, et mesure : débordement horizontal du
  document (`scrollWidth` vs `clientWidth`), `clientWidth`/`scrollWidth` de **chacune**
  des 29 `.table-wrap` — c'est le contrôle qui a attrapé les deux régressions du jour —,
  les axes de centrage, et les **caractères par ligne** de la prose.
  ⚠️ **La mesure des caractères par ligne ne peut pas se faire au plus long nœud texte** :
  la prose du carnet est fragmentée par des `<span>` hébreux et des `<b>`, si bien que le
  plus long nœud isolé ne fait que 176 caractères pour des lignes réelles bien plus
  longues. Il faut un `Range` caractère par caractère sur **tous** les nœuds texte de
  l'élément, regroupés par `top` de rectangle via `getClientRects()`.
  ⚠️ Et comparer **avant/après**, pas seulement après : c'est le comparatif qui prouve que
  le mobile n'a pas bougé et qu'aucune table n'a gagné de défilement. Un contrôle qui ne
  mesure que l'état final ne sait pas ce qu'il a cassé.
- **Détecteur impeccable** (sans réseau, lit HTML/CSS local) :
  `node <base-skill>/scripts/detect.mjs --json <fichier>`. Ses findings sont des *signaux*,
  pas des verdicts : les vérifier à la main avant d'agir (l'`em-dash-overuse` du carnet est
  un faux positif — la règle vise l'anglais).
- **Graphe de connaissance** (`graphify-out/`, versionné depuis le 20/07) : cartographie du
  dépôt — 335 nœuds, 511 arêtes, 28 communautés (recalé le 21/07 après le ménage de
  clôture ; le standalone n'est plus dupliqué en ~90 nœuds depuis le 20/07). **À
  interroger avant d'ouvrir un gros fichier** : `graphify explain "checkAnswer"` donne la ligne source exacte et les
  appelants/appelés en ~15 lignes, `graphify query "…"` répond en ~2 300 tokens là où lire
  `app.html` en coûte des dizaines de milliers (10,5× d'économie, mesurée le 20/07 par
  `graphify benchmark`). Se reconstruit par
  `/graphify . --update`. ⚠️ C'est un **instantané** : en cas de contradiction avec le fichier,
  le fichier fait foi. Détail et limites connues dans ARCHITECTURE.md § Le graphe de
  connaissance du dépôt.
- **Serveur local** : `python3 -m http.server` depuis la racine (l'appli fetch le carnet).
- **Piège jsdom** : `const CARDS` au premier niveau d'un script **n'apparaît pas** sur
  `window` (les `const` ne créent pas de propriété globale) — inutile de chercher
  `w.CARDS` après un boot. Pour vérifier le contenu chargé, passer par le DOM (la
  recherche est le plus court chemin : remplir `#search-input` — et non `#search` —
  puis lire `#search-results`). `window.eval('CARDS')` marche en dernier recours.
- **Suite du diagnostic de latence** (scratchpad de session, à recréer au besoin —
  écrite le 20/07) : `test_perf_note.js` boote le **standalone** en jsdom et vérifie
  le format des trois rapports (chip, départ, `#perf-boot` vide donc masqué) ;
  `test_srs_migration.js` sème un `srs_v1` à l'ancien format **avant** le boot
  (`beforeParse` + `localStorage.setItem`) et vérifie migration + séparation des
  homographes. ⚠️ Piège payé en l'écrivant : l'espace avant « ms » est une **fine
  insécable U+202F** (invisible au terminal, échoue toute comparaison naïve) — elle
  est en escape `\u202f` dans la source d'`app.html` pour cette raison.

## Rituel à chaque modification

1. `node build.js` — régénère `flashcards_hebreu.html` ; échec si une section ou un
   niveau attendu tombe à 0 ; vérifier les comptes affichés (sections, niveaux, exemples).
2. Si des exemples ont changé : `node verifie_exemples.js` — **0 erreur exigé**.
3. Vérifier le comportement **au niveau le moins cher qui prouve vraiment quelque chose**.
   `node build.js --check` compare déjà les deux extracteurs au octet : un changement de
   **contenu seul est prouvé par les étapes 1–2**, rien à ajouter. Serveur local ou jsdom
   quand de la **logique** a bougé. **WebKit/Playwright uniquement si tu as touché à
   l'UI** — balisage, CSS, ou un chemin de rendu. Démarrer un vrai navigateur pour
   reconfirmer ce que `--check` vient d'établir est du confort, pas une preuve : ça coûte
   l'installation de l'outillage plus une session de pilotage. (Leçon payée le 20/07 sur
   le lot d'exemples.)

   ⚠️ **Et quand le contrôle est justifié, le déléguer à un sous-agent.** Une session
   WebKit, c'est des dizaines d'allers-retours de pilotage et des captures d'écran — le
   poste le plus lourd d'une fenêtre de contexte — pour un verdict de trois lignes.
   Le sous-agent a sa propre fenêtre et ne rend que la conclusion ; le trafic
   intermédiaire n'entre jamais dans la session principale, qui est renvoyée en entier
   à chaque tour. Même chose pour un `build.js` / `verifie_exemples.js` de gros lot, ou
   une exploration large à laquelle le graphe ne répond pas d'une requête.
   **Restent dans le fil principal** : les éditions, les arbitrages de charte et de
   contenu, et l'étape 6 (documentation) — elles ont besoin du contexte accumulé.
   Le prompt du sous-agent doit **chiffrer le critère d'acceptation** (« rends le compte
   de X et nomme chaque défaut »), jamais « vérifie que c'est bon » : un contrôle muet
   passe toujours au vert, c'est la leçon de la garde de couverture de `build.js`.
   Doctrine complète dans CLAUDE.md § *The token-economy doctrine — STANDING DIRECTIVE*.
4. Si `sw.js`, la liste d'assets ou les icônes changent : incrémenter `VERSION` dans `sw.js`.
5. **Le graphe ne se recale JAMAIS dans le rituel — au plus il se FLAGGE (règle de
   Ruben, 21/07).** `/graphify . --update` coûte **~235 000 tokens** (mesuré le 20/07) :
   le lancer est toujours une décision séparée et explicite. **Le flag ne déclenche pas
   la mise à jour — rien dans ce rituel ne la déclenche.**
   - **Un fichier a été créé, supprimé ou renommé** → poser (ou compléter) la ligne de
     flag dans « Reprendre ici » : `⚠️ GRAPHE À RECALER — <date> : <fichiers>`. Le flag
     consigne la dette pour que le prochain recalage décidé sache pourquoi il tourne —
     c'est TOUT ce qu'il fait.
   - **Tout le reste** — lots de contenu du carnet, prose des `.md`, et même les
     modifications structurelles *à l'intérieur* de fichiers existants : ni recalage,
     ni flag. Cette dérive interne est tolérée par construction : `graphify explain`
     re-dérive les lignes mécaniquement, et un désaccord graphe/fichier se tranche pour
     le fichier. Le dire dans le message de commit (« graphe laissé tel quel »).
   - Quand un recalage EST décidé (flag en attente + une session qui a besoin d'une
     carte juste), solder le flag dans le même commit que `graphify-out/graph.json`.

   ⚠️ *Le piège qui a payé cette règle* : le lot de 54 exemples du 20/07 était du contenu
   pur, et le recalage lancé quand même a coûté **~4 fois le travail utile** pour faire
   passer deux compteurs de 510 à 564. Le diff de `--update` (168 nœuds ajoutés, 87
   retirés) montre qu'il **brasse** le graphe au lieu de l'étendre — raison de plus pour ne
   pas le lancer pour rien.
6. Documentation à jour : README, ARCHITECTURE, CLAUDE.md, DESIGN.md, PRODUCT.md, et ce
   fichier (surtout « Reprendre ici »). ⚠️ Les **comptes** cités dans les docs (cartes,
   exemples, nœuds `lang="he"`) se recalent à chaque ajout de vocabulaire — et le compte
   de nœuds `lang="he"` se **mesure dans le navigateur, il ne se calcule pas** : une
   entrée ajoutée crée aussi ses `span.cursive` générés, donc elle pèse plus d'un nœud
   (5003 → 5015 pour 3 mots, le 19/07, là où le calcul de tête donnait 5010).
7. **Recaler les ancres de lignes** si `app.html` a changé de taille. Elles ont dérivé
   **quatre fois** (19/07 au matin ; retrouvées toutes fausses le soir, +25 ; de nouveau
   après les plis, de +22 à +82 selon l'endroit ; puis +11 uniforme, constaté le 20/07).
   Le décalage n'est **pas** toujours uniforme — chaque ancre se vérifie. Une ancre fausse
   est pire qu'absente : elle envoie lire le mauvais code avec assurance.

   Depuis le 20/07 la surface a beaucoup réduit : **CLAUDE.md et DESIGN.md n'en portent
   plus aucune** (CLAUDE.md déléguant au graphe, dont `graphify explain "<symbole>"` redonne
   la ligne exacte sans entretien manuel). Restent ARCHITECTURE.md (16) et TODO.md (3) :

   `for l in $(grep -o 'app\.html#L[0-9][0-9]*' ARCHITECTURE.md TODO.md | grep -o '[0-9]*$' | sort -un); do printf '%5s: %s\n' "$l" "$(sed -n "${l}p" app.html | cut -c1-64)"; done`

   — chaque ligne affichée doit correspondre à ce que le document annonce. En cas de doute
   sur la vraie position d'un symbole : `graphify explain "<symbole>"`.
8. Commit par changement, messages en français (comme l'historique), puis push sur `main`
   (GitHub Pages redéploie automatiquement). C'est le point de coupure propre : l'état vit
   dans git et dans « Reprendre ici », pas dans la fenêtre de contexte.
