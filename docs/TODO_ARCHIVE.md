# Archive de TODO.md — chantiers clos et historique

Ce fichier n'est **jamais lu en session courante** : il existe pour l'histoire et le
grep ponctuel. Contenu déplacé depuis TODO.md le 2026-07-23 par **pur couper-coller**
(chantier économie de tokens, SPEC_ECONOMIE_TOKENS §3) — aucune ligne réécrite.
L'état courant et les chantiers ouverts vivent dans TODO.md.

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

**Chantier `ajoute_mots.js` (générateur de fiche, étage 1) — soldé le 23/07.**
Le script est né conforme à `SPEC_AJOUTE_MOTS.md` (v2 figée), en deux commits :
d'abord le refactor des exports de `build.js` (`listCats` hissée au niveau
module, helpers + constantes exportés — compteurs byte-identiques, 1046 cartes,
`--check` vert, `verifie_exemples.js` consommateur toujours vert), puis le
script lui-même : `nouveaux_mots.json` → balisage byte-conforme aux gabarits §4,
`tr` dérivés via le `he2tr` d'app.html (extraction textuelle + `vm`, échec
bruyant) avec tableau de relecture et marques ⚠ heuristique-fragile, placement
par frontière de section (`closeOf` depth-aware), doublons corpus entier
(idempotence), tout-ou-rien, sandbox `build`+`verifie` sur copie temporaire,
dry-run par défaut, `--ecrire`/`--force`/`--nouveau-sous-theme`/`--parite`.
**Preuve (sous-agents Sonnet, 23/07)** : les 12 cas d'erreur du §8 PASS
(niqqud, doublon+`--force`, thème inconnu avec procédure récitée, sous-thème
gâté avec squelette §4.6, typo suggérée, mono-thème des listes, forme manquante,
sans-exemple, `apres` introuvable, tout-ou-rien, cible introuvable, CLI) ; et
sur copie du dépôt : dry-run strictement inerte (sha256), `--ecrire` 1046→1050
avec `--check` et `verifie` verts, idempotence (rejouer = « Rien à insérer »,
sha identique), byte-conformité §6 des 5 fragments comparés aux voisins, parité
jsdom `extractCards()` app.html vs build.js — comptes et clés identiques sur
1050 cartes (le chaînon que `--check` n'a jamais couvert, enfin contrôlable).
L'étage 2 (pré-remplissage des champs mécaniques depuis une source externe à
froid) reste explicitement hors périmètre. Graphe : flag étendu ci-dessus,
jamais d'update réflexe.

**Lot de 200 mots, 15 thèmes (22/07) — soldé.** Sur demande explicite de
Ruben (« j'ai besoin d'ajouter énormément de vocabulaire »), régime complet en
trois passes de sous-agents Sonnet parallèles :

1. **Audit de couverture** (5 agents, 3 thèmes chacun sur les 15 champs
   sémantiques) — comptages Verbes/Noms/Adjectifs par niveau CECRL et trous
   structurels (`travail-etudes`/`loisirs-culture`/`communication-pensee` à
   0 adjectif, `nature`/`temps-calendrier` à 0 verbe, `abstrait` à 0 adjectif
   B2 malgré 44 adjectifs). Présenté à Ruben, qui a approuvé une répartition
   pondérée vers ces trous plutôt que proportionnelle (corps-sante,
   emotions-caractere, travail-etudes à 20 chacun ; le reste 10-15).
2. **Rédaction** (15 agents, un par thème, contenu complet niqqud +
   translittération + exemple en situation).
3. **Arbitrage au fil principal** : 5 collisions inter-lots repérées (agents
   parallèles ne se voient pas) — רַע réutilisé pour « méchant » alors qu'il
   porte déjà « mauvais » (retiré), מַחְשֵׁב « ordinateur » rédigé deux fois
   (gardé sous travail-etudes), לְתַקֵּן rédigé pour « corriger » ET
   « réparer » (gardé « réparer » sous maison-objets), לְהִכָּשֵׁל « échouer »
   rédigé deux fois (gardé sous travail-etudes), צָפוּף rédigé pour « bondé »
   ET « exigu » (gardé « bondé » sous ville-transport). Au passage, 2 vrais
   doublons préexistants repérés par les agents d'audit et corrigés :
   רַוָּק/נָשׂוּי (célibataire/marié) dupliqués mot pour mot en fin de table
   Adjectifs, אוּלְפָּן/אֻלְפָּן (deux orthographes de niqqud du même mot)
   dupliqués en Noms. ⚠️ Les mots signalés comme « mal classés » par les
   agents d'audit (restaurant/bague/essayer/large, rangés sous un thème large
   plutôt que le thème le plus étroit) n'ont **pas** été reclassés après
   vérification — c'est le rangement existant déjà en vigueur ailleurs dans
   le carnet (adjectifs généraux sous `abstrait`, lieux sous
   `ville-transport`), pas une erreur.
4. **Insertion** (1 agent Sonnet, mécanique) : nettoyage des 2 doublons, pose
   de chaque bloc sous le bon `data-theme` dans la bonne table, puis rituel
   `build.js`/`verifie_exemples.js` en boucle jusqu'à 0 erreur — a aussi
   trouvé et corrigé deux effets de bord (un exemple préexistant qui citait
   la graphie d'oulpan supprimée ; deux adjectifs neufs — מֻסְמָך diplômé,
   מֻכְשָׁר doué — dont l'exemple à 2 mots tombait sous le plancher éditorial
   de `verifie_exemples.js`, étoffés à 4 mots).

**Total : 853 → 1046 cartes (+193).** Couverture 829/829, 15 thèmes en phase,
`verifie_exemples` 701→894 exemples, **0 erreur** (14 avertissements non
bloquants : 10 préexistants inchangés + 4 nouveaux de dérive de
translittération/niveau — צָמוּד, רֶגֶל, מְלָפְפוֹן, מְצִיאוּת — à regarder à
l'occasion, non urgents). Contenu seul → pas de WebKit, SW inchangé. Graphe
laissé tel quel (dérive interne, aucun fichier créé/supprimé/renommé).

**Gros lot de vocabulaire (22/07) — soldé.** Suite à l'audit de couverture (trois
sous-agents Sonnet en parallèle sur vie concrète / vie sociale / abstrait,
22/07), Ruben a demandé un ajout massif ciblé plutôt qu'un rééquilibrage
général :

1. **Grammaire — « et » (וְ)** : nouvelle section Partie 1, entre L'article défini
   et État construit (+ lien Sommaire). Les trois prononciations וְ/וּ/וַ
   (ve-/u-/va-) selon la lettre suivante — jusque-là seule וְ était mentionnée
   en une ligne dans Conjonctions, qui pointe maintenant vers la nouvelle
   section.
2. **Famille-personnes complétée en entier** (34 → 54 cartes) : petite-fille,
   neveu/nièce, beau-père/belle-mère, beau-frère/belle-sœur, veuf/veuve,
   demi-frère/demi-sœur, jumeau/jumelle, orphelin, voisine, gendre/bru (avec
   note sur la double lecture marié(e)/gendre-bru), + 3 adjectifs d'état civil
   (célibataire, marié, divorcé).
3. **Vie-quotidienne, main lourde** (28 → 42) : 9 noms de routine (réveil,
   oreiller, couverture, brosse à dents, dentifrice, shampoing, rasoir, peigne,
   lessive) + 5 verbes (se doucher, se raser, se coiffer/peigner, ranger,
   se coucher/s'allonger).
4. **Ville-transport, main lourde** (55 → 74) : 17 noms (vélo, moto, métro,
   trottoir, feu rouge, passage piéton, piéton, stationnement, embouteillage,
   quartier, carrefour, station-service, quai, circulation, pneu, ceinture de
   sécurité, casque) + 2 verbes (se garer, traverser).
5. **Nourriture et Temps-calendrier, trous ciblés** (comme demandé, pas
   « main lourde ») : nourriture 57 → 64 (poisson, pâtes, petit-déjeuner/
   déjeuner/dîner, yaourt, farine) ; temps-calendrier 18 → 21 (après-midi,
   week-end, anniversaire).

**Total : 790 → 853 cartes (+63).** Couverture 636/636, 15 thèmes en phase,
`verifie_exemples` 638→701 exemples, **0 erreur**. ⚠️ **Leçon retenue en cours
de route** : la première passe d'exemples a introduit 20 avertissements
« mot hors carnet » (des mots inédits comme בזהירות, אוניברסיטה, אדיב glissés
dans des phrases d'exemple) — tous corrigés en réécrivant ces exemples avec du
vocabulaire déjà enseigné ailleurs dans le carnet ; ne reste que la dérive de
translittération tolérée (10 avertissements, dont 7 préexistants). Graphe
laissé tel quel (dérive interne, aucun fichier créé/supprimé/renommé). Contenu
seul → pas de WebKit, SW inchangé. Commit direct sur `main` (session basculée
sur cette branche plus tôt dans la journée), `pilier-oral` restant isolée pour
son propre chantier.

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

**Deux oublis de vocabulaire comblés (22/07) — soldé.** Signalés par Ruben :

1. **Pluriel de « quel »** : la liste des mots interrogatifs n'avait que אֵיזֶה
   (masc.) et אֵיזוֹ (fém.). Ajout de אֵילוּ (eilu, pluriel) + une note qui pose les
   trois formes et signale que l'oral rabat souvent tout sur אֵיזֶה. Une carte de
   plus (789 → **790**), exemples des interrogatifs 12 → 13.
2. **Pluriel des smikhuts** : la section grammaire « État construit » enseignait la
   formation et la définition mais jamais le pluriel. Note ajoutée : le **premier**
   mot change (בֵּית סֵפֶר → בָּתֵּי סֵפֶר), sauf quelques smikhuts de parenté où **les
   deux** passent au pluriel (בֶּן דּוֹד → בְּנֵי דּוֹדִים, l'exemple donné par Ruben, déjà
   présent comme carte dans la table Noms). Notes de grammaire → hors extraction,
   pas de carte.

Rituel : `build.js` 790 cartes / couverture 573/573 / 15 thèmes en phase,
`verifie_exemples` 638/638 **0 erreur** (7 avertissements préexistants, aucun sur
les ajouts), `--check` en phase. Contenu seul, aucun chemin d'UI touché → pas de
WebKit, SW inchangé. Graphe laissé tel quel (dérive interne tolérée, aucun fichier
créé/supprimé/renommé).

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

**Verso des verbes en grille 2×2 (22/07) — soldé.** Demande de Ruben (capture) :
les 4 formes conjuguées ne se rangent plus sur une ligne repliable mais en
**grille 2 colonnes** (`.forms.forms-grid`, `formsHtml` ajoute la classe quand
`cat==='Verbes'`) — singulier au-dessus, pluriel dessous ; en RTL (le `.forms`
est déjà `direction:rtl`) le masculin tombe à droite, le féminin à gauche :
```
        (infinitif)
elle · …  —  il · …      (fém. sing. / masc. sing.)
elles · … —  ils · …     (fém. plur. / masc. plur.)
```
Scopé aux verbes (4 formes) : noms (1 forme « pluriel ») et adjectifs (3 formes)
gardent la ligne souple, vérifié non-régressé. **Preuve : WebKit iPhone 16 Pro,
3/3 PASS.** SW **v25 → v26**. Graphe laissé tel quel (édit interne).

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

- `.review-card` (`app.html`, avant le chantier 3) — bordure `--gold` pleine + dégradé d'or
  135° (16 % → 5 %), icône et flèche en or ;
- `.start` (`app.html`, avant le chantier 3) — dégradé d'or **plein** + lueur portée
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
(`app.html`, avant le chantier 3) — or DESIGN.md §5 interdit désormais d'exprimer un état
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
disparaît (`EXPECTED_LEVELS`, `tools/build.js`) ; un mot ajouté **sans**
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

## Chantiers clos — archivés le 2026-07-24

Déplacés depuis « Reprendre ici » de TODO.md par **pur couper-coller**, même
convention que le 2026-07-23 — aucune ligne réécrite. Seul ajout : le compte
rendu de la vérification de bout en bout du QCM, qui a eu lieu après la
rédaction du bloc.

### Chantier économie de tokens (SPEC_ECONOMIE_TOKENS.md) — SOLDÉ le 23/07

**Chantier économie de tokens (SPEC_ECONOMIE_TOKENS.md) — SOLDÉ, correctifs §10
compris.** Rien n'y est en attente ; la suite est libre.

Le défaut trouvé à la relecture est corrigé : `cherche_mots.js` répondait
`ABSENT` sur 6 des 24 mots pourtant insérés (ktiv male de la requête vs ktiv
haser du carnet vocalisé) — faux négatif, donc le sens dangereux : il laissait
passer un doublon. `orthographeVoisine` vit maintenant dans `build.js` (insertion
de ו/י seulement, forme courte ≥ 3 lettres, ≤ 2 insertions ; 37 paires sur 1053
mots, toutes légitimes), consommé par `cherche_mots.js` en rubrique séparée et
par `ajoute_mots.js` en informatif non bloquant. Validation §10.5 verte de bout
en bout : les 6 mots retrouvés, contre-tests **négatifs** compris (לישן ne
remonte pas לשון, יפה ne remonte pas פה — les deux mots-pièges sont bien au
corpus), `--check` vert, 14 avertissements inchangés, idempotence du lot des 24
intacte et les 12 cas d'erreur de SPEC_AJOUTE_MOTS §8 toujours verts. Aucun
doublon n'avait été créé (§10.6) : piège corrigé avant qu'il ne morde. Aucun
contenu touché ⇒ pas de bump `sw.js`, pas de flag graphe.

Les 3 commits de la spec §8 + le chantier C + le lot des 24 mots, tous livrés :

- **Commits 1–2** : la spec ; `cherche_mots.js`, consultation du carnet par
  commande (piège n°15) — validation §2.3 verte, et חי détecté comme forme MS
  de לִחְיוֹת que l'inventaire par sous-agent à 56k tokens avait raté.
- **Commit 3** : TODO.md archivé **165 → 16 Ko** (pur couper-coller, conservation
  des 2009 lignes non vides prouvée par script) → tout l'historique dans
  TODO_ARCHIVE.md ; piège n°15 codifié (CLAUDE.md, § Outillage ici, README,
  ARCHITECTURE) ; flag graphe étendu à TODO_ARCHIVE.md.
- **Chantier C** : CLAUDE.md compressé **−5,8 %** (Group A validé par Ruben, 9
  migrations de narration déjà dupliquée dans DESIGN/ARCHITECTURE/mémoire ;
  aucune règle retirée). La cible §4 de −30 % abandonnée : le fichier est ~94 %
  de règles, que §4 interdit de retirer. ⚠️ **Gain net réel : nul** — 21 014 o
  avant, 21 026 o après (la compression a exactement payé le piège n°15). La
  promesse « 1,5–2k tokens par tour » de §4 était irréaliste dès l'écriture —
  elle est désormais barrée dans §4 même, avec le chiffre réel et la leçon
  (§10.3). Le vrai gain acquis est ailleurs : TODO.md 163 → 16 Ko, et
  l'inventaire à 56k tokens remplacé par une commande à ~200.
- **Lot des 24 mots « de base »** : **1046 → 1070 cartes** (8 noms, 8 adjectifs,
  8 verbes), exemples **894 → 918**, via `ajoute_mots.js` dry-run puis `--ecrire`.
  Dosage A1/A2 confirmé (6 A2 : סוֹף, סוּג, דֻּגְמָה, אֲמִיתִּי, לְהַפְסִיק,
  לְהַרְוִיחַ). חַי « vivant » ajouté en **adjectif** (cardId `Adjectifs|חי`
  distinct de la forme MS de לִחְיוֹת — aucune fusion SRS possible). Trois `tr`
  corrigés à la relecture (marviach, dugma'ot, exemple de עגל étoffé à 3 mots).
  **0 nouvel avertissement** (les 14 préexistants tolérés inchangés) ; niveaux
  A1 402 / A2 436 / B1 223 / B2 9, couverture 1070/1070, thèmes 853/853,
  `--check` en phase. SW **non bumpé** (contenu pur, stale-while-revalidate →
  2ᵉ lancement). Graphe : flag en attente, pas d'update réflexe.

### Chantier QCM : distracteurs dans le thème de la réponse — SOLDÉ le 24/07

**Chantier QCM : distracteurs dans le thème de la réponse (demande Ruben,
23/07) — SOLDÉ.** `pickDistractors()` piochait dans toute la banque : les
propositions hors sujet rendaient le QCM résoluble par élimination, sans
reconnaître le mot. Deux étages ont été **insérés en tête** de la cascade
existante (jamais en remplacement) : même `theme` + même `cat`, puis même
`theme` + autre `cat` — la préférence pour la même catégorie évite de rendre la
bonne réponse repérable à sa seule forme grammaticale (un infinitif en ל se voit
au milieu de trois noms). Suivent les étages d'avant : même `cat`, autre `cat`,
puis le dernier recours relâché qui garantit 4 options. Les deux nouveaux étages
sont gardés par `if(card.theme)` : seules les cartes des 3 tables portent un
thème (853/1070), et sans ce garde les `undefined` s'apparieraient entre eux,
c'est-à-dire toutes les listes ensemble. Le garde-fou anti-ambiguïté
(`frVariants`/`editDist` + l'accumulateur `kept`) est conservé tel quel sur les
nouveaux étages.

Preuve en jsdom (sous-agent Sonnet, aucun navigateur — logique pure, rituel
étape 3), **5 critères sur 5 au vert** : 42 800 tirages (1070 cartes × 2 sens ×
20) donnent 100 % de QCM à 4 propositions distinctes selon la clé du mode ; sur
les 34 120 tirages des 853 cartes à thème, **100 % des distracteurs partagent le
thème — aucun repli constaté**, le vivier n'est jamais assez maigre pour épuiser
l'étage ; les 217 cartes sans thème rendent une sortie **octet-à-octet identique
à l'ancienne cascade** (comparaison à `Math.random` semé, 6 510 tirages), le
bloc étant bien sauté en entier ; 0 violation de `tooClose` sur 128 400
distracteurs ; les 3 couples thème×cat les plus maigres (effectif 3 :
`vetements-couleurs×Verbes`, `temps-calendrier×Verbes`, `nature×Adjectifs`)
dégradent proprement vers l'étage thème+autre-cat, sans jamais atteindre le
dernier recours. `build.js` + `--check` verts ; `sw.js` **bumpé v26 → v27**
(changement de comportement, il doit atteindre l'iPhone au prochain lancement) ;
graphe laissé tel quel (édit interne à un fichier existant, règle du 21/07).

Vérification de bout en bout ajoutée le 24/07 (sous-agent Sonnet, jsdom, aucun
navigateur graphique), **6 critères sur 6** : `app.html` servi en HTTP charge le
carnet et construit **1070 cartes, 0 erreur console** ; la session QCM démarre
par l'UI (chips `data-mode`/`data-dir`) dans les deux sens ; sur 80 cartes
enchaînées, 4 boutons `.qc` distincts et non vides à chaque fois, `lang="he"`
sur les 4 propositions en fr→he (40/40, piège n°6) ; **thème homogène à l'écran
sur 100 % des cartes à thème** (he2fr 32/32, fr2he 27/27, bonne réponse
comprise) ; clic réel → classes `ok`/`no`, `#quiz-live` renseigné, `srs_v1`
écrit ; écran de fin cohérent (10/10). Deux réserves consignées : jsdom ne
fournit pas `fetch` (branché sur celui de Node — le carnet est bien passé par
HTTP, mais pas par l'implémentation d'un navigateur), et une découverte sans
rapport avec le chantier — au tout premier lancement, aucun chip de niveau
sélectionné laisse `state.niveaux` vide et le bouton « démarrer » ne fait rien
(jugé conforme à l'intention, non touché).

⚠️ **Ce parcours vaut plus que sa liste de critères** : c'est l'`extractCards()`
d'**`app.html`** qui a tourné (1070 cartes, en accord avec le compte de
`build.js`) — le chemin que CLAUDE.md signale comme invisible à toute la chaîne
d'outillage, puisque `--check` ne compare que l'extracteur de `build.js`. La
recette est reproductible : `python3 -m http.server`, jsdom en
`runScripts:'dangerously'` + `resources:'usable'`, `fetch` de Node injecté.

Recalage des ancres de lignes le 24/07 dans le même chantier (rituel étape 7,
commit `a5dfd3e`) : les 16 ancres `app.html` d'ARCHITECTURE.md avaient dérivé
**avant** ce chantier, jusqu'à +112 lignes (`pickDistractors` annoncé L1460 pour
L1561, `#loader` L566 pour L582), et les 3 ancres `build.js` avec elles
(`firstSpanText` L52 → L72, l'extracteur regex L156 → L209). Toutes relues une
par une sur leur cible.

---

## Chantiers 2 et 3 de « le dépôt généré » — archivés le 2026-07-25

> Déplacé depuis TODO.md § « Reprendre ici » à la clôture du Task 17. Récit historique :
> l'état courant et les invariants encore vivants vivent dans TODO.md et ARCHITECTURE.md,
> pas ici. Les flags « GRAPHE À RECALER » ont été laissés dans TODO.md, seule copie vivante.

### Ce que le chantier 3 a produit (df5ccfc..d518269, poussé sur `main`)

**`app.html` n'est plus une source : c'est le 4ᵉ artefact généré.** `node
build.js` l'assemble par `assembleApp()` depuis `src/app/coquille.html` (trois
marqueurs `<!-- @TOKENS -->`, `<!-- @CSS:app -->`, `<!-- @JS:app -->`),
`src/tokens.css`, les **6 fragments** de `src/app/css/` et les **14 modules**
de `src/app/js/`, l'ordre des deux concaténations étant porté par
`src/app/ordre.json`. **N'édite plus `app.html` à la main** — comme les trois
autres artefacts, il est écrasé au prochain build. `node tools/build.js --check`
couvre désormais les **4** artefacts (le 5ᵉ, `index.html`, ne devient généré
qu'au Task 18).

⚠️ **Les deux concaténations n'ont pas le même séparateur, et c'est voulu** :
les modules JS sont joints par `join('\n')` (`build.js:657`), les fragments CSS
par `join('')` (`build.js:663`) — c'est ce `join('')` qui porte la
byte-identité du CSS. Un fragment CSS finit donc par un saut de ligne, un
module JS **jamais**. Corollaire payé une fois : `99-principal.js` doit
conserver son `\n` final explicite, sinon le regex de fence de `build.js` ne
matche plus (rien ne suit `<!-- @JS:app -->` dans la coquille).

**Comment le découpage a été prouvé sans rien casser** : Tasks 13 et 14
byte-identiques (`app.html` régénéré identique au committé, à l'en-tête
« FICHIER GÉNÉRÉ » près). Task 15 : les 83 fonctions top-level retrouvées une à
une, les lignes triées identiques à l'écart près des 14 en-têtes `// Expose :`,
et surtout — vérifié **au parseur (acorn), pas au grep** — les 148 nœuds
top-level appariés des deux côtés, dont les **39 instructions exécutées au
chargement dans une séquence identique indice par indice**, toutes regroupées
dans `99-principal.js`. Les 812 lignes d'`app.html` situées **hors du
`<script>`** (head, CSS, balisage) sont **byte-identiques** à l'avant-chantier :
aucun changement de rendu n'est structurellement possible. Comportement exercé
en jsdom, 29/29 PASS, 0 erreur console : cartes (flip/answer/undo), saisie
(verdict, correction, clavier hébreu), QCM, révision espacée, recherche, les
6 segments de `SEG_KEYS`.

### Ce que le Task 16 a soldé (25/07)

1. **`sw.js` bumpé en `v33`** — `app.html` et `flashcards_hebreu.html` avaient
   changé sans bump depuis la v32.
2. **Les trois minors gelés** par la gate byte-identique du chantier : l'en-tête
   du standalone annonce désormais sa vraie provenance (« depuis `src/app/` +
   `data/` ») ; `mustReplace` ne peut plus renvoyer l'auteur vers `app.html`
   (chacun des 8 appels nomme son fichier source — `src/app/coquille.html`,
   `src/app/js/05-donnees.js`, `src/app/js/99-principal.js` — et le défaut est
   devenu un aveu d'appel incomplet, plus un artefact) ; les messages de la
   garde de taxonomie pointent `src/app/js/07-filtres.js` — au passage, le lot
   tripwires les faisait pointer `00-tout.js`, le module intermédiaire du Task 13
   qui n'existe plus depuis son éclatement en 14 modules au Task 15.
3. **Les trois en-têtes `// Expose :`** relevés en revue. Le contrat a d'abord
   été tranché, puisque c'est lui qui rendait le relevé ambigu : **« Expose »
   liste les noms top-level qu'un *autre* module référence**, rien de plus —
   vérifié fichier par fichier. Ajoutés à 07 : `SPK_SVG`, `catCounts`,
   `nivCounts`, `themeCounts`, `catsEl`, `nivEl`, `themeEl`, `catOrder` (les 8
   que `13-reglages.js` déclarait « utiliser (07) » — la contradiction est
   levée) ; ajouté à 08 : `lastRecord` (lu par 09 et 99). En revanche `NIVEAUX`
   (07), `voicesCache` (06), `SRS_INTERVALS` et `SRS_MASTER` (08) **restent
   hors liste** : aucun autre module ne les référence, ils sont locaux par
   convention. Convention écrite dans ARCHITECTURE.md § Anatomie de l'app.
4. **Toutes les ancres `app.html#L` de la doc ont été supprimées**, pas
   recalées : le chantier 3 les avait de nouveau toutes faussées (5ᵉ dérive), et
   `app.html` est régénéré à chaque build. ARCHITECTURE.md pointe désormais les
   modules sources — et les ancres `build.js#L` ont suivi, l'audit de sortie en
   ayant trouvé 3 fausses sur 5. La doc vivante ne porte plus **aucune** ancre
   de ligne vers du code ; contrôle en rituel étape 7.
5. **La gate visuelle du plan, réduite sur décision du propriétaire.** La
   matrice A/B (mobile + desktop 1440/1280/992/900/768, avant-chantier vs HEAD)
   n'a **pas** été jouée : le hors-`<script>` d'`app.html` est byte-identique à
   l'avant-chantier et le diff résiduel du Task 16 est du commentaire — elle
   n'aurait mesuré que ce que la byte-identité prouve déjà, et le piège 13
   (desktop) ne mord pas quand aucune ligne de CSS ni de balisage n'a bougé.
   Elle est remplacée par ce qu'elle seule prouvait vraiment : **un smoke dans
   un vrai WebKit** (iPhone 16 Pro émulé, servi en HTTP, sous-agent Sonnet) —
   `#count-note` annonce « 1220 mots chargés », les 7 points passent (cartes,
   saisie, QCM, révision, recherche, réglages), **0 erreur console et 0
   `pageerror`**. C'est la seule chose que jsdom ne pouvait pas dire : que la
   concaténation des 14 modules parse et démarre dans le moteur réel.
6. **La passe documentaire de sortie de chantier** : CLAUDE.md (pièges 1, 2, 5,
   6, 8, 11, « The five deployed pieces », « extraction coupling », rituel
   étape 1 et 3), ARCHITECTURE.md (§ Vue d'ensemble, § Les fichiers, § chaîne de
   génération, § Anatomie de l'app, § Check-list) et README.md disaient tous
   encore qu'`app.html` s'édite à la main.

**Deux minors hérités du chantier 2, toujours ouverts** : `app.html`
l'étiquette de diagnostic « extraction » mesure désormais `JSON.parse` ;
`construitIndexFichiers()` dans `cherche_mots.js` (le `readdirSync` sur
`data/listes`) duplique l'énumération que `build.js` fait déjà.

**Ce que le chantier 3 a durci au passage (quatre gardes neuves, toutes
éprouvées par cas fabriqué en bac à sable, échec réel constaté)** : les 3
marqueurs de coquille passent par `mustReplace` — un marqueur disparu fait
`exit 1` en le nommant, **avant** toute écriture (sans elle, supprimer
`<!-- @CSS:app -->` produisait un `app.html` amputé de tout son CSS avec
`exit 0`, puis un `--check` au vert sur l'artefact cassé) ; `verifieOrphelins()`
(dans `build.js`, partagée JS/CSS) échoue **dans les deux sens** — fichier
présent non listé dans `ordre.json`, ou listé mais absent du disque ; la garde
de taxonomie `THEMES` a quitté `report()` pour `verifieTaxonomieApp(appSource)`
et s'exerce désormais sur la source **assemblée en mémoire**, fatale en mode
normal **comme en `--check`** ; `generateStandalone(cards, appSource)` ne lit
plus `app.html` du disque — sans quoi `--check`, qui n'écrit rien, aurait
dérivé le standalone d'un fichier périmé.

**Le ledger de reprise** (dispatches, verdicts de revue, arbitrages, preuves de
gardes) est dans `.superpowers/sdd/2026-07-24-reorganisation-depot-genere/progress.md`
— **gitignoré, donc local à la machine** ; il porte aussi les briefs et les
revues des Tasks 13 à 15. Le chantier 4 (Tasks 17 à 21) n'a **pas** été entamé.
⚠️ Le ledger s'arrête au Task 15 : le Task 16 s'est joué dans la session du
25/07, et c'est cette section-ci qui en tient lieu.

### Ce que le chantier 2 avait produit

Ce que le chantier a produit : `data/*.json` est désormais l'unique source de
vérité du contenu. `node tools/build.js` régénère à partir de `data/` les trois
artefacts `vocabulaire_hebreu.html`, `cards.json` et `flashcards_hebreu.html`.
`app.html` charge `cards.json` au démarrage — **plus aucun extracteur HTML
n'existe dans le dépôt** : `extractCards` (les deux implémentations, carnet et
`app.html`) et le mode `node tools/build.js --verrou` qui prouvait leur équivalence
ont été retirés une fois la preuve faite ; `outils_migration/
compare_carnets.js`, le harnais qui portait cette preuve, a été supprimé avec
eux, sa mission remplie. `verifie_exemples.js`, `cherche_mots.js` et
`ajoute_mots.js` lisent tous `data/`. `sw.js` passait alors en **v32** et précache
`cards.json`. État : **1220 cartes**, `--check` en phase.

À savoir sur le champ `version` de `cards.json` : le build ne réécrit le fichier
que si son **contenu** change (sinon un build un autre jour réécrivait 890 Ko
pour rien). Conséquence : `version` porte la date du **dernier changement de
contenu**, pas celle du dernier build. Sans conséquence aujourd'hui — personne
ne le lit (`app.html`, `sw.js` et le standalone l'ignorent) — mais à savoir si
on veut un jour s'en servir pour invalider un cache.

**`CLAUDE.md` et `ARCHITECTURE.md` ont été recalés** (passe d'exactitude du
24/07, après le chantier 2) : on peut leur faire confiance sur le flux de
données. La section « The extraction coupling » de CLAUDE.md a été remplacée en
place par un exposé court du pipeline `data/` → `build.js` → artefacts, les
pièges 1/6/8 et le rituel sont recalés, et ARCHITECTURE.md décrit le contrat
gabarits/données au lieu des deux extracteurs. Ce qui **reste** au **Task 20**
est éditorial, pas factuel : la version définitive de la section pipeline, la
renumérotation des pièges, et le recalage des chemins d'outils vers `tools/`
(volontairement différé — les outils déménagent au chantier 4, l'écrire
maintenant serait à refaire).

⚠️ **Le graphe (`graphify-out/`), lui, date d'avant les chantiers 1 à 3** : il ne
connaît ni `data/`, ni `src/carnet/`, ni `src/app/`, ni `.githooks/`, ni la
disparition des extracteurs — et il situe les fonctions de l'app aux lignes
d'`app.html` **d'avant** leur redécoupage en 14 modules. Sur tout ce périmètre,
`graphify explain` répond à côté : passer directement au `grep -n` sur le module
nommé par les en-têtes `// Expose :`. Il reste fiable sur ce qui n'a pas bougé
(structure du carnet, règles de charte, pièges).
Les flags ci-dessous enregistrent la dette ; le recalage reste une décision
explicite, jamais automatique.

⚠️ **Sécurité des deux outils de migration survivants**
(`outils_migration/extrait_donnees.js`, `decoupe_carnet.js`) : ils écrivent
**sans confirmation ni dry-run par défaut** (`decoupe_carnet.js` sans
`--verifie` écrit 8 fichiers). Un lancement accidentel a écrit dans
`src/carnet/tete.html` pendant ce chantier (annulé, sans dégât). À garder en
tête jusqu'à leur retrait au Task 20.


Lot « intermédiaire » du 24/07 : **100 mots neufs** (1120 → 1220) — 57 noms,
24 verbes, 19 adjectifs, ventilés **81 B1 / 19 A2**, ce qui porte le B1 de 254 à
335 (désormais le deuxième niveau le plus fourni, après A2). Rédaction en
sous-agents Opus, **deux passes** : la première a proposé 100 candidats
« courants » dont **77 existaient déjà** (carnet mûr) — 23 neufs seulement ; la
seconde, armée de l'**inventaire complet des 903 têtes de table en liste
d'exclusion**, a visé du vocabulaire plus spécifique (ustensiles, matières,
symptômes, rôles, notions abstraites) qui a survécu presque intact au
dédoublonnage. Leçon réutilisable : **donner l'inventaire d'exclusion aux
rédacteurs dès la première passe** — sans lui, on paie une passe entière pour
~20 % de neuf.

- **`he2tr` faute de façon reproductible** sur : shva initial devant sifflante
  (`shekufah` pour shkufah), yud consonantique (`meiuman` pour meyuman,
  `veiafah` pour veyafah), redoublement (`boddim` pour bodedim, `chiurim` pour
  chivrim), et alef final (`achray` pour achra'i, `kefuot` pour kefu'ot). Ce lot
  n'a fourni **aucun `tr` à la main** : les 307 dérivés ont été relus dans le
  tableau du verdict, aucune de ces fautes présente — les `⚠` restants relèvent
  du shva initial « jugement », laissé tel quel (`pegishah`, `kerovim`,
  `tekufah`).

Les deux derniers chantiers sont soldés et archivés dans
[TODO_ARCHIVE.md](TODO_ARCHIVE.md) § « Chantiers clos — archivés le 2026-07-24 » :
**économie de tokens** (SPEC_ECONOMIE_TOKENS.md, `cherche_mots.js`, lot des 24
mots, appariement ktiv male/haser) et **QCM thématique** (`pickDistractors` sert
maintenant les distracteurs par cascade — même thème + même catégorie, puis même
thème + autre catégorie, puis les étages d'avant, puis le dernier recours ;
prouvé en jsdom, 5/5 en logique pure et 6/6 en parcours de bout en bout).

Une chose à savoir avant d'ouvrir le prochain chantier, acquise le 24/07 et
toujours vraie (chantier 2 a supprimé `extractCards`, donc la recette
d'exercice qui vivait ici avant le chantier ne s'applique plus — voir
l'avertissement CLAUDE.md/ARCHITECTURE.md en tête de section) :

- **Découverte hors chantier, non corrigée** : au tout premier lancement, si
  aucun chip de niveau n'est sélectionné, `state.niveaux` reste vide et le
  bouton « démarrer » ne fait rien. Jugé conforme à l'intention lors du contrôle,
  volontairement laissé tel quel — à trancher si quelqu'un le rencontre.

## Chantiers clos et dette soldée — archivés le 2026-07-27

Sortis de `docs/TODO.md` lors de la passe documentaire du 27/07/2026, qui a
remis ce fichier à l'état réel du dépôt. Rien n'est réécrit ici : le texte est
celui qui vivait dans TODO.md, figé à sa date.

**Chantier précédent — « Hébreu parlé », 27/07/2026, soldé et poussé.** Le
carnet a une **37ᵉ section** : le registre familier, 45 entrées, dernière de
*Partie 3 · Au quotidien*. Le constat qui l'a motivée : le carnet enseignait un
hébreu correct mais écrit, et qui le maîtrisait entièrement ne comprenait
toujours pas une conversation israélienne, faute des particules qui la portent
(תכלס, כאילו, דווקא, סתם). Quatre `groupe` — `particules` (10), `conversation`
(13), `reagir` (14), `emprunts` (8) —, **chaque entrée avec sa phrase d'usage**,
sans quoi les intraduisibles restent intraduisibles. **1220 → 1262 cartes** : 42
mots neufs, **3 déplacés** depuis « Expressions / Divers » (סבבה, יאללה, ואלה),
aucun dupliqué ; « Expressions » descend de 35 à 32.

- Spec et plan : `docs/superpowers/specs/2026-07-27-hebreu-parle-design.md`,
  `docs/superpowers/plans/2026-07-27-hebreu-parle.md`.
- **Sept points de câblage** pour une section neuve, `ajoute_mots.js` la
  déclarant hors périmètre : le fichier `data/listes/`, le gabarit
  `src/carnet/sections/`, `sections.json`, le lien du sommaire dans
  `00-preambule.html`, `EXPECTED_CATS` + `listCats` (`tools/build.js`), et
  **`catOrder`** (`src/app/js/07-filtres.js`) — ce dernier est le piège : sans
  lui les cartes existent mais aucune puce ne s'affiche.
- ⚠️ **Leçon payée : `cherche_mots.js` ne prend qu'un mot à la fois.** Lui passer
  « אין בעיה » comme un seul terme répond `ABSENT` **à tort**. Le crible correct
  pour une expression est une recherche de sous-chaîne sans nikoud sur tout
  `data/`. Il a montré que אֵין בְּעָיָה était déjà au carnet **deux fois** et
  מָה נִשְׁמָע une fois — tous deux écartés de l'inventaire, remplacés par
  אֵיזֶה קֶטַע et עַל הַכֵּיפַק à compte constant.
- Preuve : `build` (45 cartes annoncées), `verifie_exemples` **0 erreur**,
  `--check` vert, `sw.js` estampillé `v-8d7b83dc`. Pas de WebKit : aucun CSS ni
  chemin de rendu touché, la section réutilisant les gabarits `word-list` /
  `subtheme` existants.
- **Reste à faire, si on veut** : le seul avertissement non trivial est celui de
  l'exemple de יָאלְלָה (`.tr` à distance 2 de `he2tr` « yalelah »), qui vient de
  la valeur autoritaire existante — **ne pas le corriger**.

⚠️ **Le chantier courant n'est pas sur `main` : c'est la charte v2, sur
`refonte-retrofuturiste`** (décision du 25/07 — voir « Deux branches latérales »
plus bas, qui dit aussi ce que la réorganisation vient de lui faire gagner).
`main` est au repos ; ce qui suit décrit son rangement.

Le dépôt est rangé ainsi :

| Où | Quoi | S'édite à la main ? |
| --- | --- | --- |
| `data/*.json` | **le contenu** : noms, adjectifs, verbes, `listes/*.json` | ✅ oui — source unique |
| `src/carnet/` | gabarits et prose du carnet | ✅ oui |
| `src/app/` | **le code de l'app** : `coquille.html`, `ordre.json`, 6 fragments `css/`, 14 modules `js/` | ✅ oui |
| `src/portail/` | **la source du portail** : `index.html` (les jetons y sont injectés au marqueur `<!-- @TOKENS -->`) | ✅ oui |
| `src/tokens.css` | le bloc `:root` de la charte, source unique des **trois** pages déployées | ✅ oui |
| `tools/` | les 5 outils (`build`, `verifie_exemples`, `ajoute_mots`, `cherche_mots`, `mesure_translitteration`) | ✅ oui |
| `docs/` | toute la prose du projet | ✅ oui |
| `vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html`, `index.html` | les **5 artefacts générés** | ❌ **jamais** — écrasés au build |
| `sw.js` | le service worker | ✅ oui — **sauf** la ligne `const VERSION`, estampillée par le build depuis le Task 19 (`grep -n "const VERSION" sw.js` pour la valeur du jour) |

⚠️ **Les outils se lancent DEPUIS LA RACINE**, jamais depuis `tools/` :
`node tools/build.js`, `node tools/verifie_exemples.js`,
`node tools/cherche_mots.js`, `node tools/ajoute_mots.js`,
`node tools/mesure_translitteration.js`. Chacun vise
`ROOT = path.join(__dirname, '..')`, exporté par `build.js` et consommé par les
quatre autres — jamais recalculé ailleurs.

### La preuve de sortie (Task 21, 25/07) — et comment la rejouer

Ce qu'a établi le contrôle final. Chaque ligne dit **la commande**, pas son
résultat du jour : c'est elle qui refait la preuve, à n'importe quelle date.
Plan complet dans
le plan du chantier — `docs/superpowers/plans/2026-07-24-reorganisation-depot-genere.md`, **supprimé depuis au ménage documentaire, à relire dans l'historique git** (le lien vivant a été retiré : il promettait un fichier qui n'existe plus).

1. **Rituel en ligne de commande** — `node tools/build.js`, puis
   `node tools/build.js --check`, puis `node tools/verifie_exemples.js`
   (0 erreur exigée ; les ⚠ sont des signaux éditoriaux),
   `node tools/cherche_mots.js שלום` répond.
   ⚠️ **Le dry-run d'`ajoute_mots.js` ne prouve son bac à sable que sur un mot
   ABSENT du carnet** — un mot déjà présent court-circuite sur l'idempotence et
   ne prouve rien. Choisir le candidat avec `node tools/cherche_mots.js <mot>`
   jusqu'à obtenir `ABSENT`, puis exiger dans la sortie les **deux** lignes
   `✓ build.js bac à sable : vert (N cartes, concordantes avec le candidat)` et
   `✓ verifie_exemples.js bac à sable : 0 erreur`, et un `git status` propre.
2. **Parcours WebKit complet**, en sous-agent Sonnet (jamais depuis le fil
   principal) : serveur `python3 -m http.server` **depuis la racine**,
   `devices['iPhone 16 Pro']`, portail → app → une session de **chacun** des
   trois modes (`cards`, `input`, `quiz`) → révision du jour → carnet.
   Les 8 étapes sont passées PASS le 25/07, dont : cartes chargées par l'app
   **égales** à `node -e "console.log(require('./cards.json').cartes.length)"`,
   0 erreur console, 0 réponse HTTP ≥ 400, carnet sans débordement horizontal.
   C'était le premier parcours complet depuis le découpage de l'app en 14
   modules — **aucune régression**.
   ⚠️ Piège de pilotage, à ne pas rechercher : le portail ouvre sur un écran
   d'accueil plein écran (`#accueil`) qui **intercepte les clics** tant qu'il
   n'a pas été cliqué lui-même. Un script qui vise les portes directement
   échoue sans rien avoir prouvé.
3. **Livraison** — push sur `main`, puis `https://rubischtgadol.github.io/flashcards-hebreu/cards.json`
   doit répondre 200 après le redéploiement Pages (une à deux minutes).
   ⚠️ Sur l'iPhone, **deux lancements** pour voir la nouvelle version : le
   service worker sert d'abord le cache et rafraîchit derrière
   (stale-while-revalidate).

### Dette ouverte — **vide** depuis le 25/07

La liste des petits défauts connus est vide pour la première fois. Les quatre
entrées qu'elle portait ont été traitées ; ce qu'il faut en retenir vit
désormais là où on le cherchera, pas ici.

1. **Étiquette de diagnostic « extraction »** — corrigée. Elle mesurait un
   `JSON.parse` sous un nom hérité de l'extracteur HTML : devenue « lecture
   JSON », et « carnet (réseau) » devenue « cartes (réseau) », puisque l'app
   charge `cards.json` et non le carnet.
2. **Double énumération de `data/listes/`** — corrigée. `cherche_mots.js` avait
   son propre `readdirSync` à côté de celui de `build.js` ; les deux passent par
   `fichiersListes()` / `fichiersDonnees()`, exportés par `build.js`.
3. **`he2tr` extraite d'`app.html`** — corrigée, et c'était la dernière entorse
   au principe « aucun artefact n'est jamais une entrée ». Les fonctions
   viennent de `fonctionsApp()` (`build.js`), qui évalue le module source
   `src/app/js/02-translitteration.js` en entier dans un bac `vm` ; l'extracteur
   textuel a disparu des deux outils, et `app.html` n'est plus copié dans le bac
   à sable. Détail dans ARCHITECTURE.md § Flux de données.
4. **Les quatre fautes reproductibles de `he2tr`** — corrigées : shva initial
   (`shkufah`), yud consonantique (`meyuman`), redoublement (`bodedim`), alef
   devant yod final (`achra'i`). ⚠️ **Mais la règle du shva initial est
   morphologique, donc elle reste approchée — par conception, pas par dette
   résiduelle.** Ce qui a remplacé le défaut, c'est une mesure et son outil :
   `node tools/mesure_translitteration.js` (`--top`, `--shva`) donne l'accord
   exact, l'accord après `trKey` et la distance d'édition contre tous les `.tr`
   écrits à la main. **Aucune retouche de la classe de consonnes ne se garde si
   les trois nombres ne s'améliorent pas tous les trois** — c'est ainsi que ג a
   été écarté, et pourquoi `gdolim` sort encore `gedolim`. Le raisonnement
   complet est dans ARCHITECTURE.md § Ce que `he2tr` sait faire du shva initial.
   La règle qui n'a pas bougé : **les `tr` du carnet font foi**, on ne les
   régénère jamais en masse depuis `he2tr`.

**Reclassé, pas corrigé** — le « premier lancement sans chip de niveau »
(`state.niveaux` vide, « Commencer » muet) n'a jamais été un défaut : c'est une
décision du 19/07, écrite en commentaire au-dessus d'`applyPrefs()` dans
`src/app/js/13-reglages.js`, et `#start-hint` guide l'utilisateur. À ne rouvrir
que si l'intention change.

*Si un nouveau défaut connu apparaît, c'est ici qu'il se note — avec ce qui le
rend non bloquant, faute de quoi il devient un chantier.*

---

## Ménage de clôture du 2026-07-27 — `docs/superpowers/` supprimé

Les plans et specs des deux derniers chantiers clos ont été retirés du dépôt :

- `docs/superpowers/plans/2026-07-24-reorganisation-depot-genere.md` (513 lignes)
- `docs/superpowers/specs/2026-07-24-reorganisation-depot-genere-design.md` (195 lignes)
- `docs/superpowers/plans/2026-07-27-hebreu-parle.md` (588 lignes)
- `docs/superpowers/specs/2026-07-27-hebreu-parle-design.md` (163 lignes)

C'est le **précédent déjà établi** dans ce dépôt : les specs des chantiers clos
sont supprimées au ménage de clôture (voir plus haut, « les 5 specs de
`docs/superpowers/specs/` ont été supprimés du dépôt au ménage de clôture »),
l'historique git les conservant intégralement — `git log --diff-filter=D
--name-only -- 'docs/superpowers/**'` les retrouve, `git show <commit>^:<chemin>`
les relit.

⚠️ **Les renvois à ces fichiers qui subsistent plus haut dans cette archive sont
donc morts au sens du système de fichiers, et vivants au sens de l'historique.**
Ils ne sont pas corrigés à dessein : une archive consigne ce qui a été écrit à sa
date, elle ne se réécrit pas.

---

## Récit sorti d'ARCHITECTURE.md — archivé le 2026-07-27

Le propriétaire a tranché : plus aucune histoire du projet dans les documents
vivants. Ces quatre sections d'ARCHITECTURE.md étaient, pour l'essentiel, du
récit daté — chantiers, numéros de Task, relevés figés — ou la redite de
CLAUDE.md. Elles sont reproduites ici telles qu'elles étaient ; ce qui restait
du contrat au présent a été réécrit dans ARCHITECTURE.md, sans date.

## Développement et déploiement

- **Servir en HTTP** : `app.html` fait un `fetch()`, donc `file://` ne marche pas. Depuis la racine : `python3 -m http.server` puis `http://localhost:8000/`. (Le fichier autonome, lui, s'ouvre en double-clic.)
- **Vérification sans navigateur graphique** (WSL, y compris réseau coupé) : des scripts Node jetables, hors du dépôt — `tools/build.js --check` pour la cohérence, `node --check` sur le JS extrait pour la syntaxe, de petits harnais à stubs pour la logique pure (Leitner, distracteurs QCM, navigation), et jsdom pour booter le fichier autonome et exercer l'UI de bout en bout (chips, session, écran de fin). Pour le **rendu visuel**, l'outil de référence est **Playwright + WebKit réel** (le moteur de Safari — même rendu que l'iPhone cible) avec `devices['iPhone 16 Pro']` pour le mobile et un viewport classique pour le desktop ; les libs système nécessaires (`libgtk-4-1`, `libavif13`, `libgstreamer-plugins-bad1.0-0`) sont installées et les navigateurs téléchargés persistent dans `~/.cache/ms-playwright` (seule la lib npm `playwright` est à réinstaller par session). Le Chrome headless **système** pend en WSL2 — ne pas l'utiliser. Détail opérationnel dans RITUEL.md § Outillage.
- **Déployer** = pousser sur `main` : GitHub Pages resert les fichiers tels quels, mêmes URL. Aucune étape de build côté CI — `flashcards_hebreu.html` doit donc être régénéré **et commité** avec les sources.
- **Langue** : toute l'UI et la doc sont en français ; s'y tenir pour les chaînes visibles.

## Le graphe de connaissance du dépôt

Depuis le 2026-07-20, le dépôt embarque une **cartographie de lui-même** dans `graphify-out/`,
produite par [graphify](https://github.com/safishamsi/graphify). Elle existe pour une raison
précise : `app.html` fait plus de 2 000 lignes et le carnet plus de 6 000 — les lire pour
répondre à une question coûte des dizaines de milliers de tokens, là où une interrogation du
graphe en coûte environ 2 300 (mesuré le 20/07 : **10,5× moins par question**). Ce rapport
baisse quand le graphe grossit — `graphify benchmark` le remesure.

**Ce que contient le graphe** — 420 nœuds, 679 arêtes, 28 communautés, figés au dernier
recalage décidé (2026-07-21). ⚠️ **Tous les chiffres que le graphe porte sur le CONTENU du
carnet — nombre de sections, répartition `data-niveau`, ancres de ligne — datent de ce
jour-là et ne valent plus.** Les comptes courants s'obtiennent par commande, jamais par
lecture : `node tools/build.js --check` (sections, niveaux, thèmes, exemples) et
`node tools/cherche_mots.js --stats`. Ce qui reste fiable dans le graphe, c'est la
**structure** de ce qui n'a pas bougé — le balisage du carnet, les règles de design, les
pièges. L'état d'obsolescence fichier par fichier est tenu dans TODO.md § Dette de graphe,
seule référence.

⚠️ **Leçon payée le 21/07, la seule qui arme encore quelque chose** : recaler après un lot
de pur contenu a **churné** le graphe au lieu de l'étendre (des centaines de nœuds
remplacés, pour ~4× le travail utile), parce qu'un lot de vocabulaire déplace tout le
carnet sans rien changer à sa structure. D'où la règle du propriétaire : `--update` ne part
jamais d'un rituel, seulement d'une décision explicite.

Les huit plus grosses communautés couvrent l'essentiel des nœuds :

| Communauté | Contenu |
| --- | --- |
| Mode Cartes et moteur de réponse (62) | `render`, `answer`, `doFlip`, `checkAnswer`, `editDist`, le clavier hébreu, les régions live |
| `build.js` — chaîne de génération (50) | `build.js` et ses fonctions (extraction regex, `EXPECTED_CATS`/`EXPECTED_THEMES`, `generateStandalone`) |
| Audit mécanique du carnet (39) | `audit_carnet_mecanique.js` et ses fonctions — ⚠️ **communauté morte**, le script n'existe plus (cf. TODO.md § Dette de graphe) |
| Carnet : sections et régimes d'attributs (38) | les sections `<h2>`, les trois tables, les `word-list`, `data-niveau`/`data-theme`, le script cursive |
| Amorçage, filtres et préférences (36) | `init`, `applyPrefs`, `buildChips`, `buildNivChips`/`buildThemeChips`, la barrière `BUILD:ONLINE-ONLY` |
| Architecture : extraction et contrats (35) | le couplage des deux extracteurs, le schéma de carte, le contrat de balisage, les garde-fous |
| Doctrine du dépôt et pièges (31) | les 14 pièges de CLAUDE.md, la charte unifiée, la couche PWA, le diagnostic de latence |
| Révision espacée (Leitner) (24) | `recordResult`, `dueCards`, `cardId`, `masteryStats`, la carte « Révision du jour », la règle de la lampe |

Les vingt restantes sont petites et thématiques : blocs de grammaire du carnet, extracteurs
et build autonome, charte/colonne/typo du carnet, icônes PWA (192/512/Apple), portail, voix
hébraïque, service worker, accessibilité, règles de design nommées, les sept principes de
PRODUCT.md.

**Comment l'interroger** (depuis la racine du dépôt) :

```bash
graphify explain "checkAnswer"                   # ligne source exacte + appelants/appelés
graphify query "comment le verdict est-il annulable ?"
graphify path "deriveCartes" "recordResult"      # comment deux choses se relient
```

`graphify explain` remplace les ancres `near line NNN` que CLAUDE.md portait : celles-ci
avaient **dérivé trois fois** et étaient toutes fausses (+11) au moment de leur retrait, tandis
que le graphe redérive les numéros de ligne mécaniquement. Les ancres `app.html#L` de ce
fichier ont suivi le même sort au **Task 16 (25/07)** : recalées quatre fois, de nouveau
toutes fausses après le chantier 3 (qui a réordonné le JS), elles ont été **remplacées par
des liens vers le module source** (`src/app/js/*.js`, `src/app/coquille.html`) — plus aucun
numéro de ligne d'artefact dans la doc (contrôle en TODO.md § Rituel étape 7 ; `TODO_ARCHIVE.md`, gel historique, est le seul fichier qui en porte encore).

⚠️ **Le graphe est un instantané, pas une vérité vivante.** Il se périme exactement comme les
ancres — la différence est qu'il se régénère en une commande au lieu de se vérifier à la main.
Concrètement, ce graphe **date d'avant les chantiers 1 à 4** de la réorganisation du dépôt
généré : il ne connaît ni `data/`, ni `src/carnet/`, ni la disparition des extracteurs HTML —
une requête sur ces sujets répondra depuis l'ancien monde (l'extraction depuis le carnet, les
deux implémentations d'`extractCards`). La dette est enregistrée par les flags
`⚠️ GRAPHE À RECALER` de TODO.md « Reprendre ici » ; le recalage reste, comme toujours, une
décision explicite, jamais automatique.
En cas de contradiction entre le graphe et le fichier, **le fichier fait foi**, et le graphe
doit être reconstruit :

```bash
/graphify . --update      # ne réextrait que les fichiers modifiés
```

**Ce qui est versionné** : `graph.json` (le graphe interrogeable) et `GRAPH_REPORT.md` (la
piste d'audit : god nodes, ponts entre communautés, provenance EXTRACTED/INFERRED/AMBIGUOUS).
`graph.html` (visualisation interactive), le cache et les fichiers techniques restent locaux —
ces derniers contiennent des chemins absolus de la machine de développement, contraires à la
décision d'anonymisation du dépôt.

**Deux limites connues**, mesurées à la construction du 20/07 et toujours valables (le
mécanisme n'a pas changé au recalage du 21/07, dont le diagnostic post-fusion affiche 0 arête
pendante — les arêtes perdues le sont *avant* `graph.json`) : les deux découlent du même
principe, l'extraction est découpée en lots confiés à des agents parallèles, qui ne voient
pas les identifiants forgés par les autres.

- **Dérive d'identifiants entre lots** : environ 26 arêtes visent un nœud qui n'existe pas,
  parce que deux lots ont nommé le même concept différemment (`architecture_piege_transition_all`
  contre l'identifiant retenu ailleurs). Ces arêtes sont **écartées à la construction** — elles
  n'entrent jamais dans `graph.json`, qui n'en contient aucune ; c'est du signal perdu, pas du
  graphe corrompu. Deux cas seulement relèvent d'une autre cause (`manifest.webmanifest`, dont
  graphify ne reconnaît pas l'extension) et trois des modules Node (`fs`, `path`, `vm`) que
  l'AST référence sans les définir. Le diagnostic `graphify.diagnostics` compte l'extraction
  **brute** : un écart entre son total d'arêtes et celui de `graph.json` est normal.
- **Chaque fichier déployé apparaît en double** — une fois extrait du fichier lui-même, une
  fois extrait de la description qu'en fait la doc (`index_portal` contre
  `architecture_index_html`). Ce n'est pas une erreur : les communautés documentaires sont la
  vue *prose*, les autres la vue *code*. Mais le degré des nœuds-fichiers est de ce fait
  sous-estimé, chaque moitié comptant seule — n'en tirez pas de conclusion sur l'importance
  relative d'un fichier.

## Cinq leçons de méthode

> Détachées de TODO.md le 27/07/2026 : elles ne décrivent pas un état, elles
> décrivent des manières de se tromper qui restent ouvertes. Leur place est
> auprès de l'architecture qu'elles protègent, pas dans une liste de tâches.


Elles ne sont pas archivées avec le chantier : chacune décrit une manière de se
tromper qui reste ouverte au prochain garde-fou, au prochain déménagement de
fichier, au prochain export supprimé.

1. **Quand un fichier bouge ou disparaît, un `grep` borné aux `.md` rate quatre
   familles de références.** (1) Les **chaînes d'usage et messages d'erreur dans
   les scripts eux-mêmes** — dont trois sortent dans l'en-tête « FICHIER
   GÉNÉRÉ » des artefacts, donc les toucher force un rebuild, qui réestampille
   `sw.js` au passage ; (2) l'allowlist `.claude/settings.local.json` ; (3) les
   **liens markdown à fragment** (`](…#L42)`) ; (4) le **bac à sable
   d'`ajoute_mots.js`**, qui recopie un dépôt
   miniature — toute garde neuve qui lit un fichier de la racine casse le
   dry-run tant que le fichier n'est pas dans `FICHIERS_RACINE_BAC_A_SABLE`
   (payé au Task 17 avec `index.html`, re-payé au Task 19 avec `sw.js`).
2. ⚠️ **Un chiffre juste n'est pas une preuve — ce qui prouve, c'est d'où il
   vient.** Le bac à sable d'`ajoute_mots.js` affichait un compte de cartes
   calculé *en process* : il aurait montré le bon nombre en validant un tout
   autre arbre. C'est maintenant `assertBacASableCoherent()` qui relit le `TOTAL`
   imprimé par le build de la sandbox. Toute garde ajoutée ici se prouve par
   **casse fabriquée** (exit 1 réel, message nommé), jamais par « je l'ai
   ajoutée ».
3. ⚠️ **Générer un fichier prouve que le contenu arrive, jamais qu'il soit
   seul** (Task 18). L'injection des jetons au marqueur `<!-- @TOKENS -->`
   garantit que `src/tokens.css` est bien dans les trois pages ; elle ne dit
   rien d'un **second `:root` écrit en dur** à côté, qui gagnerait par cascade
   et rouvrirait précisément la divergence que le Task 18 vient de fermer —
   sans rien casser de visible. D'où le compte de blocs `:root` attendu par
   page dans `verifieCharte()` (carnet 3, app 1, portail 1). Même forme de
   raisonnement pour la suite : quand une tâche « clôt un piège par
   construction », demander *par quel chemin il pourrait revenir* et mécaniser
   ce chemin-là.
4. ⚠️ **Une garde qui ne peut pas échouer ne prouve rien — et il faut le
   vérifier, pas le supposer** (Task 19). L'estampille avait d'abord reçu un
   contrôle d'existence sur chacun des six fichiers hachés ; la casse fabriquée
   (retirer `manifest.webmanifest`) a montré qu'il était **muet par
   construction** : `verifieCharte()` lit le manifeste bien avant, et le build
   meurt là. Le contrôle a été supprimé plutôt que gardé pour la forme. Corollaire
   inverse, du même task : `String.replace` d'un motif qui ne matche pas **ne lève
   rien** — il rend la chaîne inchangée. Toute réécriture par regex a donc besoin
   d'une garde explicite sur le motif introuvable, sinon la couture se défait en
   silence (ici : `VERSION` figée pour toujours, c'est-à-dire le piège n°10 remis
   en place sans que personne le sache).
5. ⚠️ **Un export mort n'est presque jamais seul : c'est la fermeture transitive
   qu'il faut calculer, pas le nom** (Task 20). Le plan annonçait sept helpers HTML
   dont « les fonctions restent utilisées en interne par `build.js` ». Le contrôle
   nom par nom (`grep -n "\bnom\b" tools/build.js`, définition **et** appels) a
   montré l'inverse : `parseSections`, `exemplesOf`, `attrOf`, `tdsOf` n'avaient
   plus **aucun** appelant interne, et les trois autres (`closeOf`, `firstSpanText`,
   `decodeEntities`) n'étaient appelés que par les quatre premiers, plus leurs
   propres satellites (`textContent`, `blocksOf`, `NAMED_ENTITIES`). Tout le
   sous-graphe ne tenait que par les exports : en retirant les exports on retirait
   le mini-parseur entier — 90 lignes, et l'affirmation « le dépôt ne lit plus de
   HTML » devenue vraie au sens littéral. **Ne pas s'arrêter au nom cité par un
   plan : suivre les appelants jusqu'à l'appelant vivant, ou constater qu'il n'y
   en a pas.**

## Check-list d'une modification de contenu

1. Éditer `data/*.json` (et lui seul pour le vocabulaire — jamais `vocabulaire_hebreu.html`, généré).
2. `node tools/build.js` — vérifier les comptes par section.
3. Si du vocabulaire ou des exemples ont changé : `node tools/verifie_exemples.js` — 0 erreur exigé (un nom, adjectif ou verbe ajouté doit arriver **avec** son exemple, règle de couverture).
4. Ouvrir `http://localhost:8000/` — vérifier « N mots chargés » et la carte concernée.
5. **Ne pas recaler le graphe** : un lot de contenu ne crée ni ne supprime de fichier, donc pas même de flag (règle durcie du 21/07 — `--update` coûte ~235k jetons et ne se lance que sur décision explicite ; `graphify explain` re-dérive les lignes mécaniquement, et un désaccord graphe/fichier tranche pour le fichier). Voir RITUEL.md § Rituel étape 5.
6. Committer `data/*.json` et les **cinq** artefacts régénérés (`vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html`, `index.html`) **plus `sw.js`**, dont le build vient de réestampiller `VERSION` — séparés en deux commits, le nom de cache se décale d'un commit sur le contenu qu'il nomme (piège 10). Puis pousser sur `main`.

### Genèse des thèmes — sortie d'ARCHITECTURE.md le 2026-07-27

**Le treizième thème, né d'un arbitrage défait (2026-07-21, seconde passe).** La taxonomie initiale rangeait les couleurs en `abstrait` et les vêtements en `vie-quotidienne` — deux pis-aller documentés comme tels, qui gonflaient précisément les deux plus gros thèmes. `vetements-couleurs` les regroupe : 13 noms (vêtement → t-shirt, lunettes comprises), 11 adjectifs de couleur (rouge → marron), 2 verbes (porter, s'habiller), soit 26 entrées. Sa frontière est « ce qui s'enfile » : sac et bague restent en `vie-quotidienne` (objet transporté / bijou, pas de l'habillement).

**Les quatorzième et quinzième thèmes (2026-07-21, troisième passe) — et le premier lot de vocabulaire neuf par thème.** Même méthode : `vie-quotidienne` (63 entrées) rendait encore deux amas cohérents. `argent-achats` (la transaction et ce qui la paie : acheter, vendre, payer, prix, loyer, riche/pauvre…) et `loisirs-culture` (l'activité et l'œuvre : jouer, chanter, danser, film, musique, ballon…) en extraient 35, et `vie-quotidienne` retombe à 28 (gestes et états du quotidien : se lever, dormir, prendre, donner, attendre…). Les deux frontières, miroir du « ce qui s'enfile » : **« la transaction, pas le lieu »** (magasin, marché, supermarché restent `ville-transport` ; salaire reste `travail-etudes` ; le portefeuille suit l'argent) et **« l'activité et l'œuvre, pas le lieu »** (cinéma, théâtre, musée, bibliothèque restent `ville-transport` ; livre, lire, écrire restent `travail-etudes`). S'y ajoute un **lot de 32 mots neufs** ciblé sur les manques révélés par ces deux champs (sport, vacances, vendeur, monnaie rendue, réduction, gratuit… étaient à zéro) : 14 en `argent-achats`, 18 en `loisirs-culture`, rédigé en sous-agent puis arbitré au fil principal (le compte de cartes de l'époque n'est pas recopié ici : voir `node tools/cherche_mots.js --stats`).

---

## Récit de chantier sorti de TODO.md — archivé le 2026-07-27

TODO.md répond désormais à « où en est-on ? » seulement. Le récit des chantiers
livrés vit ici.

**Dernier chantier livré — « Le mortier grammatical », 27/07/2026, soldé.**
Constat du propriétaire : « il manque beaucoup de trucs de base comme *efshar*,
*quelque chose*, *zone* ». Vérifié, et fondé : le carnet était riche en
vocabulaire **thématique** (nourriture 87, ville-transport 94) et pauvre en
**mots-outils** — אֶפְשָׁר, מַשֶּׁהוּ, מִישֶׁהוּ, רַק, כִּמְעַט, לָכֵן, כְּדֵי
absents avec 1262 cartes au compteur. Audit systématique en 3 sous-agents
parallèles : **301 candidats testés, ~150 absences confirmées**. **1262 → 1428
cartes** (166 neuves, aucune retirée — consigne explicite : « ajoute tout ce que
tu trouves, n'enlève rien », B2/C1 compris).

- **Palier C1 ouvert** (`EXPECTED_LEVELS`, build.js) : 10 entrées de registre
  soutenu. Côté app, **zéro câblage** — `NIVEAUX` rangeait déjà C1 dans
  « Difficile ». Détail et piège de l'ordre en ARCHITECTURE.md § 4.
- **Deux sous-thèmes neufs** aux Adverbes : « Degré & intensité », « Manière ».
- ⚠️ **Erreur de spec corrigée** (SPEC_AJOUTE_MOTS §10) : « éditer le gabarit
  puis relancer `ajoute_mots.js` » est **faux** pour un sous-thème de liste. La
  résolution se fait sur `info.liste.entries` (la donnée), et `genereCarnet()`
  refuse un placeholder qui ne consomme rien — **blocage circulaire**. Il faut
  une **entrée d'amorce écrite à la main** en même temps que le gabarit.
- ⚠️ **Leçon payée : un vérificateur d'absence doit être contrôlé avant usage.**
  Le premier repli ktiv male/haser annonçait `רַק` et `מִיָּד` *présents* par
  collision de squelette (ירק « légume », מדי « trop ») — un audit lancé
  là-dessus aurait enterré les absences les plus criantes. Deux garde-fous :
  une ו/י **initiale** n'est jamais mater lectionis, et **sous 3 lettres** de
  squelette on exige l'exact. Corollaire assumé : le repli devient aveugle aux
  mots courts, donc `כִּוּוּן` ressort `ABSENT` à tort — le doute se lève à la main.
- ⚠️ **Les sous-agents confondent `ch` (het) et `kh` (khaf sans daguech)**, de
  façon systématique (`'achshav`, `nachon`, `bechol`), et capitalisent les gloses
  françaises avec un point final. Ne jamais insérer un rendu d'agent sans passer
  les `tr` au comparateur `he2tr` : c'est lui qui a nommé les 12 fautes.
- ⚠️ **Un audit délégué a des trous : le relire.** Les trois agents ont manqué
  מַשֶּׁהוּ et מִישֶׁהוּ — les deux indéfinis les plus fréquents —, plus עוֹד,
  פַּעַם, כָּזֶה. Et `רַק` a survécu à l'audit *et* à ma propre synthèse : il n'a
  été rattrapé qu'au contrôle final contre la liste initiale. Un lot de
  rattrapage (11 entrées) a suivi.
- Preuve : `--check` vert sur les cinq artefacts, `verifie_exemples` **0 erreur**
  (124 avertissements éditoriaux). Pas de WebKit : aucun CSS ni chemin de rendu
  touché.

**Passe documentaire du 27/07/2026, dans la foulée.** Toute la documentation a
été auditée contre l'état réel (4 sous-agents, ~160 affirmations vérifiées) :
**17 faussetés corrigées** — ARCHITECTURE.md 8 (dont `firstSpanText` et
`parseSections` décrites comme vivantes alors que le mini-parseur HTML est parti
au Task 20, et deux renvois de module intervertis), SPEC_AJOUTE_MOTS.md 5,
DESIGN.md 3, README.md 1. `docs/superpowers/**` supprimé (4 fichiers de chantiers
clos, précédent du dépôt, historique git conservé), 137 lignes de TODO.md
archivées. Les **15 pièges de CLAUDE.md ont été re-vérifiés un par un : tous
tiennent**.

---

## SPEC_ECONOMIE_TOKENS.md — archivée en entier le 2026-07-27

Ce document decrivait un chantier (le passage a une consultation par commande) qui
est livre depuis longtemps ; chaque regle quil enoncait vit desormais dans le code
ou dans les documents vivants. Il ne restait que le compte rendu. Reproduit tel quel.

# SPEC — Économie de tokens sur tout le dépôt (chantier transversal)

Statut : **validée**. Déclencheur : l'inventaire du carnet par sous-agent du
23/07 — 56k tokens pour apprendre que 24 mots étaient absents, quand une
commande aurait répondu pour ~200.

## 0. Principe directeur

**Une question dont la réponse est mécanique — existence, comptage,
localisation — se paye en commande (~200 tokens), jamais en lecture de fichier
(~30–100k) ni en sous-agent (~30–56k).** Le sous-agent reste le bon canal pour
ce qui exige du jugement en volume (WebKit, audits éditoriaux) ; il cesse d'être
un canal de consultation. Deux conséquences : (1) le dépôt doit être outillé
pour que le canal cheap **existe toujours** ; (2) les règles doivent être
codifiées dans les fichiers du dépôt pour survivre au `/clear` — l'économie ne
doit plus dépendre de la vigilance du propriétaire.

## 1. Diagnostic mesuré

⚠️ **Instantané daté, conservé comme motivation de cette spec — ne pas le lire comme
l'état courant.** Plusieurs de ces valeurs ont bougé depuis : `TODO.md` est retombé à
~32 Ko après deux vagues d'archivage (c'est précisément l'effet recherché), et le carnet
a grossi. Pour les tailles du jour : `wc -l` ; pour les comptes de contenu :
`node tools/cherche_mots.js --stats`.

| Source de gaspillage | Taille | Coût d'une lecture complète | Fréquence |
| --- | --- | --- | --- |
| `vocabulaire_hebreu.html` | 9 591 lignes | ~100k tokens | chaque lot de contenu |
| Inventaire par sous-agent | — | 56k (mesuré 23/07) | chaque proposition de lot |
| **`TODO.md`** | **163 KB** (2 162 lignes) | **~40k tokens** | passe de doc de chaque rituel |
| `ARCHITECTURE.md` | 69 KB | ~17k tokens | passes de doc |
| `app.html` | 2 480 lignes | ~30k tokens | chantiers UI (le graphe couvre déjà) |
| `CLAUDE.md` | 21 KB | ~5k tokens **rechargés à chaque tour** | permanent |

TODO.md était alors le plus gros document du dépôt — plus lourd
qu'ARCHITECTURE.md. Le trou d'outillage : le dry-run d'`ajoute_mots.js` détecte
les doublons (§7.A) mais exige la fiche complète (niqqud, formes, exemples)
avant de répondre — trop tard et trop cher pour un simple « existe-t-il ? ».
Aucune commande de consultation amont n'existait.

## 2. Chantier A — `cherche_mots.js`, la consultation par commande

État : **livré et en service** — `tools/cherche_mots.js`, committé le 23/07 et
déplacé dans `tools/` au Task 17 du chantier 4.

Frère de `verifie_exemples.js` : dev-only, zéro dépendance, non déployé,
consultation pure (n'écrit jamais rien). Réutilise les exports de `build.js` —
`chargeDonnees`, `deriveCartes`, `stripNikud`, `orthographeVoisine`, `ROOT`,
`EXPECTED_LEVELS`, `EXPECTED_THEMES` — donc pas de troisième parseur (doctrine
SPEC_AJOUTE_MOTS §1). ⚠️ La rédaction initiale de cette spec le disait bâti sur
`extractCards` et `NOTEBOOK` : c'est caduc depuis le chantier 2, qui a supprimé
tout extracteur HTML — la source est `data/*.json`, plus le carnet généré.

```text
node tools/cherche_mots.js TERME [TERME…]   # existe-t-il ? où ?
node tools/cherche_mots.js --stats          # répartition du corpus
```

### 2.1 Sémantique de recherche

- **Terme hébreu** (contient un caractère de la plage hébraïque) : comparaison
  **exacte** sur `he_plain` (niqqud retiré) — headwords, puis formes
  (pluriel/MS/FS/MP/FP), puis présence dans les exemples (**mot exact**, pas
  sous-chaîne : « חי » ne matche pas « מחיר »). Tout le corpus, tables et
  listes. **Puis, et seulement après cet échec exact, l'appariement ktiv
  male/haser** (`orthographeVoisine`, `build.js`, §10.1) sur les headwords et
  les formes : le carnet étant vocalisé, il s'écrit défectif (עִתּוֹן →
  « עתון ») quand on cherche plein (« עיתון »). Ces occurrences sortent dans
  une rubrique **« orthographe voisine »** distincte, **jamais mêlée** aux
  exactes — la question « ce mot est-il déjà là ? » et la question « en
  existe-t-il une graphie voisine ? » n'ont pas la même réponse.
- **Terme latin** : sous-chaîne **à frontière de mot en tête**, insensible à la
  casse et aux accents, dans `.fr`, puis `note`, puis `exemples[].fr`.
  La frontière de mot est obligatoire : la sous-chaîne nue fait 173 faux
  positifs sur « fin » — `build.js` préfixe le `fr` de chaque verbe par
  `(infinitif)` + espace (L190), que « fin » matche en sous-chaîne. Mesuré sur le
  brouillon. « fin » trouve « fin », « fine », « finir » ; pas « enfin » ni
  « infinitif ».
- **Sortie** : une ligne par occurrence — `SECTION Lnnnn · hébreu — français`
  (le n° de ligne, approximatif, sert d'ancre de lecture fenêtrée, §5.1) ;
  `ABSENT` seulement si **ni** exacte **ni** voisine (sinon « aucune
  correspondance exacte » suivi de la rubrique). Bornée à 8 occurrences par
  terme et par rubrique, le surplus est **compté** (« … +165 autres ») —
  jamais de troncature silencieuse.

### 2.2 `--stats` (l'arbitrage « quel thème/niveau est sous-doté ? »)

Total de cartes ; répartition par section ; par niveau (ordre
`EXPECTED_LEVELS`) ; par thème (les 15 `EXPECTED_THEMES`, triés du moins doté
au plus doté, avec ventilation par niveau, `⚠ vide` si 0) ; signaux
éditoriaux : nombre d'entrées de tables à 1 seul exemple, nombre d'items de
listes sans exemple (licite). Sortie bornée ~40 lignes.

### 2.3 Validation du chantier A

1. Les 24 candidats du lot en cours, côté **sens français** : les quatre
   chevauchements connus sortent nommés (langue → לָשׁוֹן ; mince → רָזֶה ;
   frais → רַעֲנָן ; vrai → נָכוֹן). Des hits **sans conflit** sont attendus et
   licites (gloses : « couleur » matche `orange (couleur)`, « rond » matche
   `rond-point`, « perdre » matche `perdre (un match)`…) — le critère n'est pas
   « ABSENT partout », c'est « aucun chevauchement de sens non identifié ».
2. Les 24 candidats côté **hébreu** : aucun présent comme headword. Une seule
   présence comme *forme*, attendue et réelle : חי (candidat « vivant ») est la
   forme MS de לִחְיוֹת — chevauchement légitime à arbitrer, que l'inventaire
   par sous-agent du 23/07 n'avait pas vu (il n'extrayait que les headwords) :
   la commande à ~200 tokens détecte ce que les 56k tokens rataient. Les
   présences en mot exact dans des *exemples* sont informatives, pas des
   collisions. Contre-test positif : `לשון` → présent (Noms).
3. **Critère orthographique** (ajouté par §10.1, mesuré). Positif : les
   6 mots que la comparaison exacte déclarait `ABSENT` alors qu'ils étaient
   insérés — עיתון, דוגמה, עמוק, עגול, לזרוק, להרוויח — ressortent tous, en
   rubrique « orthographe voisine ». **Négatif, et c'est là que le réglage se
   joue** : `לישן` (dormir) ne doit pas remonter לשון (langue) et `יפה` (beau)
   ne doit pas remonter פה (bouche) — les deux mots-pièges sont bien au corpus,
   le contre-test n'est donc pas vide ; c'est le retrait naïf des ו/י, écarté,
   qui les appariait. Réglage reproductible : 1053 `he_plain` distincts →
   **37 paires** (3,5 %).
4. Anti-régression : « fin » ne matche plus « (infinitif) ».
5. Total `--stats` == compteur imprimé par `node tools/build.js`.
6. `node tools/build.js` et `node tools/verifie_exemples.js` restent verts. ⚠️ La rédaction
   initiale ajoutait « aucune modification de `build.js` — tout est déjà
   exporté » : §10.1 y a depuis posé le helper d'appariement, seul endroit
   licite (jamais de logique dupliquée), et `--check` doit rester vert avec.

## 3. Chantier B — TODO.md : archiver les chantiers clos

- Créer **`TODO_ARCHIVE.md`** ; y déplacer les sections de chantiers **clos /
  soldés** (marqués TERMINÉ, CLOS, SOLDÉ, ou dont la mémoire/le git montre
  qu'ils sont finis : refonte 5 étapes, audit C1–C12, lag iPhone, lots
  d'exemples passés…) et les historiques de mesures datées.
- **Pur couper-coller** : zéro réécriture de contenu, blocs entiers déplacés —
  le diff se relit comme un déplacement, rien ne se perd.
- Restent dans TODO.md : état courant, « Reprendre ici », chantiers **ouverts**,
  § Outillage, § Rituel. Cible : ≤ ~15 KB (économie ~35k tokens par passe de
  doc — la plus grosse du plan).
- En tête de TODO.md, une ligne pointe l'archive : « chantiers clos →
  TODO_ARCHIVE.md (ne pas charger en session sauf besoin explicite) ».
- TODO_ARCHIVE.md n'est **jamais lu en session courante** ; il existe pour
  l'histoire et le grep ponctuel.

## 4. Chantier C — CLAUDE.md : compression (arbitrage par diff)

~21 KB rechargés à chaque tour. Méthode, sur validation du propriétaire
**ligne à ligne** (livrable = un diff, rien d'appliqué sans arbitrage) :

- **Toutes les règles restent.** Aucune règle, aucun piège, aucun invariant
  supprimé.
- Migre : la **narration d'historique** — dates de mesures répétées, genèses
  (« payé le 20/07 par… »), chiffres d'anecdotes déjà consignés en mémoire ou
  dans ARCHITECTURE. Chaque piège garde sa règle sèche + une ligne de pourquoi
  au maximum.
- Destination : faits durables → ARCHITECTURE.md ; leçons d'agent → mémoire
  (fichiers existants, pas de doublon).
- ~~Cible : −30 à 40 %, soit ~1,5–2k tokens économisés **à chaque tour de chaque
  session future**.~~ ⚠️ **Promesse fausse, abandonnée à l'exécution (§10.3).**
  Résultat réel, mesuré : 21 014 o → 22 330 o (piège n°15, **+1 316**) → 21 026 o
  (compression, **−1 304**) — soit **+12 o net**. La compression a exactement
  payé le nouveau piège ; l'économie par tour est **nulle**. La cible était
  irréaliste dès l'écriture de cette spec : le fichier est ~94 % de règles, et
  la première puce de ce même §4 interdit d'en retirer une seule — on ne peut
  donc pas couper 30 % d'un fichier dont 94 % est intouchable. **La leçon :
  chiffrer une cible avant d'avoir mesuré la matière compressible.** Le vrai
  gain du chantier est ailleurs, et il est acquis : TODO.md 163 → 16 Ko, et
  l'inventaire du carnet à 56k tokens remplacé par une commande à ~200.

## 5. Chantier D — règles de conduite (codifiées, plus jamais orales)

### 5.1 Le piège n°15 de CLAUDE.md (texte proposé, verbatim)

> 15\. ⚠️ **A question of existence, count or location is NEVER paid for by
> reading a file or dispatching a subagent — a command answers it directly**:
> `node tools/cherche_mots.js` (notebook: words, French senses, line anchors,
> `--stats` for theme/level gaps), `graphify explain` (code), `grep -n` (the
> rest). Corollaries: (a) never `Read` a file over ~30 KB without
> `offset/limit` — the notebook, `app.html`, `flashcards_hebreu.html`,
> `ARCHITECTURE.md`, `DESIGN.md`, `TODO_ARCHIVE.md` all qualify. Get the target
> line from a command first (`cherche_mots.js` for content, `graphify explain`
> for code, `grep -n` on a section title for `.md` docs), then read ±30 lines
> around it — this includes the ritual's documentation pass, which edits
> sections, never re-reads whole files; (b) never paste a list, log or
> inventory longer than ~20 lines into a reply — named verdicts and `file:line`
> references only; (c) the paid-for counter-example: 2026-07-23, a subagent
> inventory of the notebook cost 56k tokens to learn that 24 words were
> absent — ~200 tokens by command.

### 5.2 Où chaque règle s'écrit (récapitulatif de codification)

| Fichier | Modification |
| --- | --- |
| `CLAUDE.md` | piège n°15 (§5.1) ; + `cherche_mots.js` dans la liste d'outillage de « What this is » |
| `TODO.md` | § Outillage : les deux commandes documentées ; « Reprendre ici » : flag `⚠️ GRAPHE À RECALER — 23/07 : cherche_mots.js, TODO_ARCHIVE.md, SPEC_ECONOMIE_TOKENS.md créés` (flag seulement, jamais d'update auto — règle du 21/07) |
| `README.md` | 1 ligne outillage |
| `ARCHITECTURE.md` | 1 ligne outillage (+ receveur des faits migrés du chantier C) |
| Mémoire agent | `dedup-mots-sans-lire-la-liste.md` mise à jour → pointer `cherche_mots.js` au lieu du one-liner grep |

### 5.3 Le déroulé standard d'un lot de vocabulaire (gravé par le piège 15)

1. Proposition de N candidats — **`he` + `fr` seulement**, tableau court (~1k).
2. `node tools/cherche_mots.js` sur les N (~200) — seules les collisions remontent.
3. Arbitrage humain sur les collisions + le choix des mots.
4. Rédaction du JSON complet (niqqud, formes, exemples).
5. `node tools/ajoute_mots.js lot.json` — dry-run, validation profonde, doublons §7.A
   en filet.
6. Relecture : tableau des `tr` dérivés + diff ciblé.
7. `--ecrire`, puis rituel (build, verifie, docs, commit).

## 6. Ce qui ne change pas (déjà optimal)

Graphe en rung 1 pour le code ; `tools/build.js --check` /
`tools/verifie_exemples.js` ; WebKit par sous-agents ; flag graphe
sans update automatique ; dry-run + diff ciblé d'`ajoute_mots.js` ;
ARCHITECTURE/DESIGN non coupés — ce sont des références, la règle de lecture
fenêtrée par taille (§5.1, corollaire a, qui les nomme explicitement) suffit.

## 7. Écartés, et pourquoi

- **Flag `--existe` dans `ajoute_mots.js`** : sa spec v2 est figée ; l'entrée
  de la consultation amont est différente (chaînes nues, pas un JSON de
  fiches). Un script, une responsabilité.
- **Hook bloquant les sous-agents d'inventaire** : un hook ne juge pas
  l'intention d'un prompt ; le piège 15 + la mémoire suffisent.
- **Recalage du graphe** : flag seulement, conformément à la règle du 21/07.
- **Étage 2 d'`ajoute_mots.js`** (pré-remplissage des fiches) : déjà spec'é
  hors périmètre (SPEC_AJOUTE_MOTS §10), inchangé.

## 8. Ordre d'exécution et commits

1. **Commit 1** — cette spec, une fois validée ; la ligne « Statut » d'en-tête
   passe à « validée (JJ/MM/AAAA) » dans le même commit (on ne commite pas un
   document qui se déclare en arbitrage).
2. **Commit 2** — outillage : `cherche_mots.js` ajusté + validation §2.3.
3. **Commit 3** — docs : TODO archivé (§3) + codification (§5.2).
4. **Chantier C** — diff proposé à part, commit séparé après arbitrage ligne à
   ligne. Peut être refusé sans affecter le reste.
5. Reprise du lot des 24 mots à l'étape 4 du déroulé §5.3 (les étapes 1–3 sont
   déjà faites).

## 9. Critères de succès du chantier entier

- Un « ce mot existe-t-il ? » coûte ~200 tokens, prouvé par l'usage sur le lot
  en cours.
- `wc -c TODO.md` ≤ ~15 Ko ; le diff d'archivage est un pur déplacement.
- Plus aucune règle d'économie qui ne vive que dans la conversation : tout est
  dans CLAUDE.md, TODO.md ou la mémoire.
- Le rituel et tous les gardes existants restent verts.

## 10. Correctifs post-livraison (relecture du 23/07, à appliquer)

La relecture par commandes du chantier livré a trouvé **un vrai défaut d'outil
et une promesse fausse**. Le carnet n'a rien subi : le bug était latent (§10.5).
Statut : **livré le 23/07/2026** (commit A outillage, commit B docs) — validation
§10.5 verte de bout en bout, contre-tests négatifs compris.

### 10.1 Correctif 1 — `cherche_mots.js` : faux « ABSENT » sur ktiv male/haser

**Symptôme mesuré** : sur les 24 mots du lot fraîchement insérés, **6 ressortent
`ABSENT`** — עיתון, דוגמה, עמוק, עגול, לזרוק, להרוויח.

**Cause** : un mot vocalisé s'écrit en **ktiv haser** (עִתּוֹן → `עתון` une fois
le niqqud retiré), mais on le cherche naturellement en **ktiv male** (`עיתון`).
La comparaison exacte sur `he_plain` rate le couple. Le sens de l'échec est le
dangereux : « absent » d'un mot présent ⇒ on insère un doublon. Taux réel :
**6/24 = 25 %**.

**Règle retenue** — après échec de la comparaison exacte, tenter la variante
orthographique : *A ~ B si l'un s'obtient de l'autre en n'**insérant** que des
ו/י*, avec deux garde-fous — forme courte **≥ 3 lettres**, **≤ 2 insertions**.
Les occurrences ainsi trouvées sortent dans une rubrique **« orthographe
voisine »**, jamais mêlées aux exactes.

**Réglage mesuré sur les 1053 `he_plain` distincts du carnet :**

| Réglage | Paires sur tout le corpus | Rattrape les 6 ? |
| --- | --- | --- |
| retrait naïf de tous les ו/י | 60 groupes / 132 mots — **écarté** | oui |
| MIN 3 / MAX 1 | 27 | oui |
| **MIN 3 / MAX 2 — retenu** | **37 (3,5 %)** | **oui** |
| MIN 4 / MAX 2 | 8 | **non** (rate עמק, עגל) |

Le retrait naïf est écarté par la mesure : il apparie לישן (dormir) ~ לשון
(langue) et יפה (beau) ~ פה (bouche). Les 37 paires de la règle retenue sont au
contraire **utiles** — מלוח~מלח (salé/sel), עצוב~עצב, רחב~רחוב : les
quasi-homographes qu'un éditeur veut voir signalés.

**Emplacement** : le helper va dans `build.js` + son `module.exports` (doctrine
« jamais de logique dupliquée »), parce que §10.2 le consomme aussi.

### 10.2 Correctif 2 — `ajoute_mots.js` partage l'angle mort

Le garde doublons §7.A de SPEC_AJOUTE_MOTS compare `he_plain` **exactement**. Il
passe aujourd'hui parce que tout candidat porte le niqqud, donc s'écrit défectif
comme le carnet — mais une fiche future écrite en ktiv male vocalisé (עִיתּוֹן)
glisserait à travers.

**Correctif à risque maîtrisé** : signal « orthographe voisine » en
**informatif non bloquant uniquement**, via le helper de §10.1. Le comportement
bloquant ne change pas ⇒ les 12 cas d'erreur validés le 23/07 restent verts.

### 10.3 Correctif 3 — documentaire : cette spec affirme deux choses fausses

- **§2.1** annonce « comparaison **exacte** sur `he_plain` » — c'est exactement
  ce qui a produit le bug. Réécrire avec la tolérance §10.1 et ses garde-fous.
- **§2.3** n'a aucun critère orthographique. Ajouter : les 6 mots retrouvés,
  **et** les contre-tests négatifs (לישן ne doit pas matcher לשון ; יפה ne doit
  pas matcher פה).
- **§4** promet « ~1,5–2k tokens économisés à chaque tour de chaque session
  future ». **Faux** : CLAUDE.md est passé de 21 014 o à 22 330 o (piège n°15,
  +1 316) puis à 21 026 o (compression, −1 304) — résultat net **+12 o**. La
  compression a exactement payé le nouveau piège. Consigner le résultat réel et
  la leçon : le fichier est ~94 % de règles, que §4 interdit de retirer ; **la
  cible était irréaliste dès l'écriture de la spec**. Le vrai gain du chantier
  est ailleurs et il est acquis : TODO.md 163 → 16 Ko, et l'inventaire à 56k
  tokens remplacé par une commande à ~200.

### 10.4 Correctif 4 — propagation

`TODO.md` § Outillage et la mémoire agent `dedup-mots-sans-lire-la-liste.md`
décrivent tous deux « hébreu → `he_plain` exact » : à corriger. Le piège n°15 de
CLAUDE.md ne détaille pas l'appariement — rien à y changer, vérifier au passage.

### 10.5 Validation des correctifs

1. Les 6 mots ressortent trouvés (rubrique « orthographe voisine »).
2. Contre-tests **négatifs** : `לישן` ne remonte pas לשון ; `יפה` ne remonte
   pas פה.
3. `node tools/build.js --check` vert ; `verifie_exemples.js` **sans erreur**, et son
   compte d'avertissements inchangé par le correctif (il valait 14 à l'époque de ce
   chantier ; il a suivi la croissance du corpus depuis — ce qui comptait était la
   stabilité, pas la valeur).
4. `ajoute_mots.js` : rejouer le lot des 24 déjà inséré donne toujours « Rien à
   insérer » (idempotence intacte), et les 12 cas d'erreur du §8 de
   SPEC_AJOUTE_MOTS restent verts.

### 10.6 Ce que la mesure a aussi prouvé

**Aucune des 37 paires n'est un doublon réel** — ce sont toutes des entrées
légitimement distinctes. Le carnet ne contient donc **aucun doublon caché** par
ce défaut : on corrige un piège avant qu'il ne morde, pas après.

### 10.7 Ordre d'exécution

Deux commits, **aucun contenu touché** ⇒ pas de bump `sw.js`, pas de flag graphe
(aucun fichier créé/supprimé/renommé) :

1. **Commit A** — outillage : helper dans `build.js` + export, consommation dans
   `cherche_mots.js` (rubrique dédiée) et `ajoute_mots.js` (informatif), puis la
   validation §10.5 en entier.
2. **Commit B** — docs : §2.1, §2.3 et §4 de cette spec ; TODO.md § Outillage et
   « Reprendre ici » ; mémoire agent.


## Chantiers clos — archivés le 2026-07-28

Déplacé depuis TODO.md § « Reprendre ici », qui s'en était rempli. Quatre
chantiers, tous poussés sur `main`, tous vérifiés en WebKit avant commit.

**1. Le palier « ordi » de l'app** (`c03baee`). L'app était née sur iPhone et y
était restée : ses seules media queries de largeur étaient des
`max-width:480px`, c'est-à-dire des ordres de *rétrécir*. Aucune ne disait
jamais de grandir, d'où une carte plafonnée à 420 px et un hébreu de 57,6 px au
milieu d'un écran de 1900. Le vide latéral et le débordement sous la ligne de
flottaison étaient **le même défaut vu par deux bouts** — une carte qui gaspille
la largeur (`max-width` en dur) et réclame la hauteur (`height:min(60vh,520px)`
rigide, réclamée même à moitié vide). Palier `min-width:900px` : colonne
520 → 760 px, carte 420 → 640 px, rampe hébraïque +35 %, hauteur passée au
contenu. Les contrôles ne bougent pas — les agrandir avec l'hébreu aurait annulé
la hiérarchie que la règle de la vedette cherche. Vérifié 6/6 : aucun
débordement vertical aux quatre largeurs dans les deux modes, et **iPhone
inchangé** (51,2 / 30,4 / 24 / 12,8 / 30,4 px), qui était le contrôle miroir du
piège 13.

**2. `.face` en trois rangées de flux** (même commit). L'étiquette de catégorie
et l'indice de la carte étaient en `position:absolute` dans une `.face` qui
défile : épinglés, ils ne défilaient pas avec le contenu, et un adjectif à trois
inflexions dans la carte compacte du mode saisie passait **sous** « traduis en
français ». Le padding réservait leur place, ce qui ne vaut que tant que rien ne
défile. Correction valable à toutes les tailles, téléphone compris ; rangées
jointives au pixel après coup (165→184, 184→365, 365→385).

**3. Section « Le nikoud »** (`f31e85e`), en tête de Partie 1. Tout le carnet est
vocalisé et n'expliquait nulle part comment lire cette vocalisation : 43 sections,
aucune sur le système d'écriture. Carnet seul, aucune carte — un signe de voyelle
ne se révise pas comme un mot, la question « traduis ָ » n'a pas de sens. Les
treize signes un par un, précédés du tableau « cinq sons, treize signes » qui est
ce qui rend l'ensemble apprenable ; puis le shva et ses deux emplois, les chatafs
des gutturales, le qamats katan, le dagesh et ses trois rôles, le point du shin,
le patach furtif, le ktiv male. Les 29 mots cités reprennent la vocalisation
exacte du carnet, vérifiée entrée par entrée contre `data/`. La règle de l'article
devant gutturale (הֶ et non הַ : *hechadash*) a rejoint « L'article défini », où
elle manquait. Garde neuve au passage : `verifieOrphelins()` couvre enfin
`src/carnet/sections.json`.

**4. Les deux défauts du carnet sur iPhone** (`0f6e6c0`, `4e801c6`), préexistants
— la section nikoud les a seulement fait apparaître. Le débordement horizontal
d'abord : `display:contents` supprime la boîte mais **pas l'héritage**, si bien
que le `white-space:nowrap` de `th,td` traversait la cellule dissoute du mode
carte vers des textes qui doivent revenir à la ligne ; en grille défilante le
wrap coupait, mais la carte mobile est en `overflow-x:visible`. Une cause, deux
symptômes opposés : la glose sortait à gauche, les `.fr`/`.tr` des exemples (en
`direction:ltr`) sortaient à droite. `scrollWidth` 444 → 402, 6 → 0 nœuds texte
débordants. ⚠️ La leçon de mesure est devenue le **piège n°16 de CLAUDE.md** : un
débordement de texte est invisible sur `getBoundingClientRect()` des éléments, il
se mesure au `Range` sur les nœuds texte — deux investigations avaient conclu de
travers avant qu'on le voie. La recherche ensuite : elle n'indexait ni les titres
ni la prose, si bien qu'une section cherchée par son nom était introuvable *et*
masquée (« qamats » trouvait le nikoud, « nikoud » non). Les titres sont
désormais indexés, sans entamer la règle « des correspondances, pas des leçons » —
mesuré : 24 blocs de prose dans la section retenue, 0 visible.

**5. Section « Abréviations et sigles »** (`3631a8c`), à la place 42 qui
l'attendait. Elle était prête depuis un chantier et bloquée **non par son contenu
mais par le validateur** : 13 erreurs, toutes structurelles. Levée par un
**contrat de sigle** typographique dans `verifie_exemples.js` — gershayim,
apostrophe finale, points — plutôt que par une exemption de catégorie, si bien
que la règle vaut partout dans le corpus au lieu d'ouvrir un trou par section.
⚠️ L'apostrophe non finale ne compte pas : elle note un son étranger (ג' = j,
צ' = tch) sur un mot ordinaire, qui reste soumis au contrôle. Éprouvé par cas
fabriqué dans les deux sens, dont celui qui comptait : un mot ordinaire non
vocalisé **dans une phrase portant par ailleurs un vrai sigle** échoue toujours,
l'exemption étant par jeton et non par phrase. 1717 → 1728 cartes.

## Chantiers clos — archivés le 2026-07-29

Une session, sept chantiers : un défaut signalé par le propriétaire, une refonte
d'agencement, et les six entrées de la dette ouverte soldées ou requalifiées.

**1. La barre de défilement dans la carte** (`5f18c5a`). Signalée sur capture :
sur ordinateur, la carte du mode saisie affichait une barre interne qui lui
volait 15 px de large. **Deux hypothèses ont été construites et réfutées** — une
divergence de dimensionnement flex entre moteurs, puis un repli de police sous
Windows — avant qu'une mesure demandée au propriétaire sur son propre navigateur
ne tranche en dix secondes : `#face-content` débordait d'**exactement 1 px**
(`clientHeight` 152, `scrollHeight` 153). Un arrondi sous-pixel que WebKit et
Blink ne tranchent pas du même côté ; invisible sur notre banc, dont les barres
sont en surimpression, et défigurant sous Windows où elles sont classiques et
apparaissent dès le premier pixel. 80 cellules de mesure WebKit avaient rapporté
une marge « exactement nulle » partout — ce qui se lisait « ça tient » et voulait
dire « à un arrondi de casser ». D'où le **piège n°17** de CLAUDE.md, et son
corollaire sur les DevTools ancrés à droite, qui avaient fait basculer la
première mesure dans le palier téléphone.

En vérifiant les respirations de la carte, **tout le bloc `body.input-mode
#face-content .forms` du palier ordi s'est révélé mort depuis `c03baee`** : sa
règle de base vit dans `40-reponses.css`, concaténé après `30-cartes.css`, et à
sélecteur égal c'est le dernier qui gagne — une `@media` n'ajoute pas de
spécificité. Les inflexions rendaient donc à 1,7rem sur ordinateur, la taille
pensée pour la carte comprimée du téléphone. Un balayage des 1049 déclarations
des six fragments n'a trouvé que deux overrides morts en tout.

**2. L'agencement à deux colonnes.** Le propriétaire a signalé que « Suivant » et
« J'avais juste » passaient sous la fenêtre. Mesuré à 1536×730 : **+42 px**
l'exemple replié, **+150 px** déplié, **+222 px** sur un verbe à quatre formes ;
en mode Cartes « Je savais » dépassait de 19 px. Le coupable n'était pas la carte
(264 px) mais le bloc de correction (375 px). Trois agencements ont été proposés,
le propriétaire a choisi les deux colonnes pour les trois modes. Un conteneur
`.answer-col` a été ajouté à `coquille.html` — le seul changement de balisage —
et `.study.active` passe en grille au palier 900. Colonne de droite à **420 px**,
largeur dictée par la translittération d'exemple et couvrant 96,8 % du corpus.
Déficit après : **zéro sur 39 des 42 combinaisons mesurées**.

**3. Dette 1 — les notes d'usage du carnet.** Le carnet stockait ses notes en
`data-note` sans jamais les rendre. Elles étaient **64 et non 49** : le chiffre
de la dette avait vieilli, et toutes sont sur des listes, aucune sur une table.
Rendues en `.note-line`, avec la voix qu'elles ont déjà dans l'app.

**4. Dette 2 — les désaccords de translittération.** La seule entrée que la
documentation interdisait de toucher sans protocole. Le harnais a montré **326
désaccords et non 286**, et surtout que **zéro n'était visible** : `checkAnswer`
accepte toujours les deux graphies. Deux règles ont été ajoutées avec gain strict
sur les trois métriques — kamats katan de כל, et `ayv`→`av`. Exact 3557 → 3615,
replié 3902 → 3970, distance 901 → 830 ; bruts 326 → 258.

**La leçon de méthode vaut plus que le gain** : la moyenne qui monte ne prouve
rien. Un contrôle paire par paire — ancienne `he2tr` contre nouvelle, évaluées
côte à côte en bacs à sable `vm` — a révélé six pertes derrière un harnais déjà
vert : **une vraie sur-application** de la règle du kamats sur `כַּלְכָּלִי`, et
**cinq `tr` rédigés fautifs** (`kal` pour כָּל, `bastayv` pour בַּסְּתָיו),
corrigés dans `data/`. Après resserrage de la règle : 0 perte, 73 gains.
Corollaire consigné : améliorer `he2tr`, c'est auditer le corpus.

**5. Dette 3 — le silence de `controle_tr.js`.** La garde `if (!he || !tr)
return;` avalait un couple troué. Levée, mais **scopée sur la mesure** : 1051 des
1728 têtes n'ont légitimement pas de `tr` (les tables retombent sur `he2tr`),
alors que les 2070 formes et 1482 exemples en ont tous un. Le nouveau `⚠ MUET`
ne parle donc que là où l'absence est une anomalie.

**6. Dette 4 — la revue navigateur jamais passée.** Elle a trouvé ce qu'elle
était censée trouver : **7 titres `h3.subtheme` hébraïques sans `lang="he"`**,
plus l'hébreu du titre « Et ». Couverture portée à 11822/11822, mesurée dans le
navigateur comme le piège 6 l'exige. Elle a aussi exposé un défaut que personne
n'avait nommé : `.subtheme` appliquait à l'hébreu vocalisé une chasse de 0,12em
pensée pour des capitales latines — שֶׁל mesurait 18,75 px, il en mesure 15,52.
Sur l'orientation RTL, la recommandation de l'agent **n'a pas été suivie** : les
44 `<h2>` du carnet posent tous l'hébreu en tête d'un bloc LTR.

**7. Dettes 5 et 6 — le téléphone.** Le rognage des inflexions
(`height:min(32vh,290px)`, un plafond rigide) est réglé en rendant la hauteur
élastique : `#face-content` passe de 151/179 à 179/179. Et les chips gagnent
`min-height:44px` sous `pointer:coarse`. ⚠️ La dette accusait `.cat-row .chip` :
**ce sélecteur ne matchait rien** — `.cat-row` n'entoure que « tout
sélectionner ». Le défaut était réel (42 px au lieu de 44), sa cause déclarée
était fausse ; les trois règles mortes ont été retirées plutôt que reconduites.

## Le carnet fermait `<main>` trop tôt — corrigé le 2026-07-29

Trouvé en tirant un fil qui n'en était pas un. Je croyais avoir repéré un défaut
— « le carnet n'a aucune ligne cursive » — après avoir compté `class="cursive"`
dans l'artefact : zéro. **C'était moi qui tombais dans le piège n°6 de
CLAUDE.md**, qui dit mot pour mot que ce compte « doit être mesuré dans un
navigateur, pas calculé depuis la source ». Les cursives sont créées au
chargement par un script inline ; elles sont 5573.

Mais sous le faux défaut il y en avait un vrai. Ce script vivait dans
`src/carnet/sections/41-phrases.html` — un comportement **global** du carnet
logé dans un fichier de section —, et le même fichier portait le `</main>`. Or
**deux sections le suivent au registre** : « Abréviations et sigles » et
« Hébreu parlé » se rendaient donc **hors de `<main>`**, sans la colonne de
lecture posée par `main > *:not(.table-wrap)`. Deux sections entières en pleine
largeur sur ordinateur, et rigoureusement invisibles autrement : le carnet était
complet, `--check` vert, et le banc iPhone borne la largeur tout seul
(piège n°13).

Correction : `</main>` rejoint `pied.html`, toujours assemblé en dernier ; le
script part dans `src/carnet/cursive.js` et consomme le `normHe` du module
partagé au lieu d'une quatrième copie locale du même `replace`.
`verifieStructureCarnet()` échoue désormais sur toute section rendue après la
fermeture, en la nommant — vue échouer sur le défaut d'origine, qui a rendu les
deux noms.

⚠️ **Leçon pour toute garde qui lit du balisage** : retirer les `<script>`
d'abord. La première version comptait les `<main>` cités dans le commentaire du
JS injecté et échouait sur un carnet juste. C'est la symétrique de la leçon de
`verifieCharte()`, qui ne scanne que les `<style>`.

## La graphie pleine mesurée, non lancée — 2026-07-29

Chantier chiffré puis laissé ouvert, faute d'être décidable par un agent. Ce que
la mesure a coûté et rendu : trois versions successives de la règle, chacune
corrigée par un cas du corpus. (1) La première ajoutait un yod aux mots qui en
portaient déjà un (`אִישׁ` → `אייש`). (2) La deuxième redoublait le yod après une
mère de lecture (`אוֹיֵב` → `אוייב`) parce qu'elle comptait le holam comme une
voyelle pleine, donc prenait le `ו` de `אוֹ` pour une consonne. (3) La troisième
laissait le redoublement court-circuiter les trois autres règles par son
`continue` : `מְיֻחָד` sortait `מייחד` au lieu de `מיוחד`. Chaque version passait
ses témoins précédents — d'où six témoins figés dans l'outil.

⚠️ **Et la limite est démontrée, pas supposée** : `לַיְלָה` et `בַּיְשָׁן` portent
le motif identique (patach, yod, chva) et donnent `לילה` contre `ביישן`. Aucune
règle sur le nikoud ne les sépare. S'y ajoute l'absence de harnais : `he2tr` se
règle contre 4229 `tr` manuscrits, `data/` ne porte aucune graphie pleine
écrite à la main. L'outil `tools/propose_ktiv_male.js` propose et compte ; il ne
décide pas.

## La recherche qui mentait — corrigée le 2026-07-29

Signalé par le propriétaire en deux fois : `מסובך` ne rendait rien alors que
`מְסֻבָּךְ` (compliqué) est dans les Adjectifs, puis « la translittération non
plus ». Un seul défaut à trois faces, toutes mesurées avant correction.

**(a) L'orthographe, pas le nikud.** Les deux recherches déshabillaient le
nikud correctement ; `data/` stocke le vocalisé en *ktiv haser*, donc dépouillé
`מְסֻבָּךְ` donne `מסבך` — sans le `ו` du *ktiv male* que tout le monde tape.
186 entrées sur 1728 étaient dans ce cas. **(b) La translittération absente de
la botte de foin sur 1051 cartes / 1728** : les cartes issues des tables portent
`tr:''`, l'écran affiche `he2tr(card.he)` et la recherche fouillait `c.tr` brut —
la translittération **lisible à l'écran au même instant** était introuvable.
**(c) Aucun repliage des variantes** : `searchNorm` ne faisait que minuscules +
dénikoudage, si bien que `mesubakh`, `mesubach` et `msubakh` restaient trois
chaînes distinctes. Le contraste qui résumait tout : `checkAnswer` acceptait
déjà `trKey(card.tr)` **et** `trKey(he2tr(card.he))` — répondre était tolérant,
chercher ne l'était pas. Les trois normalisations existaient dans le dépôt ; la
recherche n'en appelait aucune.

**Correction** : `cleRecherche` dans `02-translitteration.js` (source unique,
injectée dans le carnet avant `carnet.js`), index mémoïsé côté app, classement
des résultats, et `verifieRecherche()` dans le build.

⚠️ **Le vrai enseignement est venu du contrôle NÉGATIF, et il a failli manquer.**
Les douze cas positifs passaient au vert ; c'est `zzzqqq` qui a révélé que le
repliage sur-générait — trois résultats, et `qqqqq` en rendait **449**. Cause :
la gémination héritée de `trKey` écrase les *séries* (`(.)\1+`), si bien que
`zzzqqq` tombait sur `zk`, deux caractères présents partout. Mesure qui a
tranché : `he2tr` **n'émet jamais de consonne doublée** (`שַׁבָּת` → `shabat`,
8 doublements dans tout le corpus, 0 triplement) — le pliage n'existe que pour
accepter la graphie géminée qu'on *tape*. D'où paires seulement, consonnes
seulement : les voyelles gardent leur doublement, ce qui a fait retomber `baal`
de 10 résultats bruyants à 1 (`bal` matchait « balai » et « balcon »).
Deuxième effet du même chantier : `שלום` rendait `לְשַׁלֵּם` en tête — le
squelette consonantique fait se rencontrer les mots d'une même racine, d'où un
classement à trois rangs (mot exact, préfixe, ailleurs) et un balayage complet
du corpus avant la coupe à 80, puisque s'arrêter au 80e trouvé rendrait le
classement inopérant.

**Recette** : trois modes de panne vus échouer au build (mère de lecture non
pliée, `he2tr` retiré de la botte de foin, mot témoin disparu de `data/`), puis
WebKit sur les deux surfaces — 14 requêtes, 0 erreur console, régression hors
recherche contrôlée, et les trois requêtes absurdes à zéro.

## Récits sortis des documents vivants — passe documentaire du 2026-07-29

Chaque règle est restée dans son document, au présent ; voici les épisodes qui
l'avaient établie, sortis de DESIGN.md (et une parenthèse de PRODUCT.md : le
retard d'accessibilité du carnet, soldé par audit).

**Le test de la lampe, gagné trois fois sur le carnet.** `.part` était bordé et
teinté d'or au repos et pesait plus lourd que le bouton d'action au-dessus de
lui ; `.tip` (« 💡 point clé ») était la seconde surface dorée au repos, mieux
défendable mais échouant au même test (contenu emphatique ≠ action) ; les
pastilles `.steps li::before` étaient des disques d'or pleins de 26 px. Les
trois ramenés à leur couche, l'or ne survivant que sur le repère. Même passe :
les blocs d'exemples vivaient sur `rgba(0,0,0,.14)` — le cinquième gris interdit
—, remontés à la couche `carte` pour rejoindre `.example`.

**La voix Title et l'angle mort du carnet.** `.subtheme` et `thead th` avaient
dérivé sur leur propre spec (0.82rem/0.12em, 0.92rem/0.08em) parce que les
quatre emplois d'origine de la voix vivaient tous dans l'app : la charte n'avait
jamais inventorié le carnet. Alignés sur la spec Title exacte.

**La typo mesurée, deux corollaires du même jour.** Le carnet n'avait aucun
`line-height` (héritage `normal` ~1,2, trop serré pour du nikoud) — `1.55` posé
sur `body`, valeur que `.steps li` et `.tip p` avaient déjà choisie isolément.
Et `.part-name`/`.part-he` n'étaient séparés que de 1,1 px — écartés d'un vrai
pas plutôt que fusionnés.

**La colonne et la table qui débordait.** Sans borne de largeur, la prose
courait sur 158 caractères par ligne en 1280 ; la première calibration, réglée
sur la largeur du « 0 » (7,87px contre 6,63px d'avance réelle), annonçait 69
caractères et en rendait 82. Resserrer `--colonne-large` à 44rem a été essayé,
mesuré, annulé — deux fois. La phrase « aucune table ne dépasse 894px » est
restée écrite alors qu'un lot venait d'en produire une à 909,94px (« Vie
quotidienne », Verbes) : une mesure sans garde. Trois pistes fausses avant la
bonne (relever le cadre ; `white-space:normal` sur un mot sans espace —
inopérant ; rogner les exemples d'une colonne bornée par une pile : paliers
902,22/899,61/896,02/894,00). Le coupable : une seule translittération,
`mitmake'ach` à 105,61px dans une colonne plafonnant à 86,41 — לְהִתְמַקֵּחַ
remplacé par לְהַחְלִיף (`machlif`, 67,20px), un mot sorti du carnet parce
qu'aucune retouche ne pouvait le faire entrer.

**Le CTA collant, mesuré à cinq hauteurs.** `static` à `due > 0`, `sticky` à
`due === 0`, tranché au relevé à mi-course (à défilement maximal les deux états
montrent le bouton). Désactivé, il restait doré translucide (`opacity:.4`),
laissait transparaître le contenu et interceptait les taps de quatre chips —
d'où la peau pleine. Les trois registres capturés côte à côte en WebKit au
cadrage identique.

**`display:contents`, une cause et deux symptômes sans ressemblance.** Le
`white-space:nowrap` hérité faisait sortir la glose française par la gauche
(`left −31px`) et les `.fr`/`.tr` LTR par la droite (document à 444 px pour 402
de viewport). La passe `getBoundingClientRect()` sur tous les éléments trouvait
zéro débordant ; la mesure au `Range` en trouvait 6, le pire à `right = 444,1`
— au dixième de pixel du `scrollWidth`. Deux investigations avaient conclu de
travers avant ça (piège n°16 de CLAUDE.md, né ici).

**Le palier ordi, quatre épisodes.** (1) Le pixel : la carte à hauteur de
contenu tombait sur `clientHeight` 152 / `scrollHeight` 153 sous Blink (152/152
en WebKit) — invisible au banc à barres en surimpression, défigurant sous
Windows (piège n°17, né ici). (2) Le bloc mort : `body.input-mode #face-content
.forms` a vécu tout un chantier dans le `@media` de `30-cartes.css` sans jamais
rien faire, sa base vivant dans `40-reponses.css` concaténé après — inflexions
rendues à 1,7rem au lieu de 2,2, marge 12 px au lieu de 24. (3) L'écran empilé :
à 1536×730, « Suivant » tombait 42/150/222 px sous la fenêtre selon le contenu,
« Je savais » dépassait de 19 px — le coupable était le bloc de correction
(375 px), pas la carte (264 px). (4) La grille à deux colonnes : déficit
vertical nul sur 39 des 42 combinaisons mesurées, les trois restantes cumulant
fenêtre ≤ 700 px, contenu le plus dense et exemple déplié ; confirmé sur
Chrome/Windows.

**La carte de révision éteinte.** `.review-card:disabled` portait `opacity:.55`
qui pâlissait le texte et laissait l'icône en or ; remplacé par la peau pleine.
Mesuré : 0 pixel doré sur les 344 736 de la capture, écart R−B maximal −17. Et
les 64 notes `data-note` du carnet n'étaient jamais rendues avant `.note-line`.

