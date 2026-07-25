# État du projet et travail restant

> **Archive** : les chantiers clos et l'historique des acquis sont déplacés dans [TODO_ARCHIVE.md](TODO_ARCHIVE.md) — ne pas charger en session sauf besoin explicite (grep ponctuel). L'état courant et les chantiers ouverts vivent ici.

## Reprendre ici (prochaine session)

⚠️ GRAPHE À RECALER — 2026-07-23 : SPEC_AJOUTE_MOTS.md (créé), ajoute_mots.js
(créé), SPEC_ECONOMIE_TOKENS.md (créé), cherche_mots.js (créé), TODO_ARCHIVE.md
(créé) ; 2026-07-24 : prototype-nerv.html, prototype-variantes.html,
prototype-effets.html, test-crt-iphone.html, specimen-hebreu.html,
specimen-monospace-hebreu.html, duel-miriam-unifont.html,
unifont-nikoud-repare.html, polices/, REFERENCES_SENTRY.md et PROMPT_REPRISE.md
(créés, branche refonte-retrofuturiste) ; 2026-07-25 : prototype-mouvement.html
prototype-ame.html et prototype-parures.html (créés, même branche).
Le flag enregistre la dette, il ne déclenche rien (règle du 21/07).

> ⚠️ **Vous êtes sur la branche `refonte-retrofuturiste`** (worktree
> `~/dev/flashcards-hebreu-refonte` ; le checkout principal `~/dev/flashcards-hebreu`
> est resté sur `main`). Cette branche ne porte **que la direction artistique** :
> aucune surface déployée, aucun script, aucun contenu n'y est modifié.
> **Pour la réorganisation du dépôt, le contenu et les comptes, `main` fait
> autorité** — tous les paragraphes sous celui-ci sont un instantané figé au
> point de départ de la branche (24/07) et sont **périmés**.

> **Fin de session du 2026-07-25 — rien n'est en cours, rien n'attend d'être fini.**
> Trois chantiers ont été soldés ce jour-là : le **test des calques CRT sur iPhone
> réel** (les trois effets rejetés, charte en v0.6), l'**exploration typographique
> hébraïque** (classée, on garde Frank Ruhl Libre) et la **recette du spec § 6**
> (nikoud et grille jugés lisibles sur l'appareil). Le propriétaire reprendra
> **après la refonte complète du code sur `main`**. Trois chantiers restent, tous
> listés plus bas : le prélèvement des animations sur SENTRY, le système de thèmes,
> et le portage.
>
> **Premier geste à la reprise** : vérifier où en est la réorganisation de `main`,
> puis relire le PIÈGE AU MERGE en bas de cette section — la divergence a doublé
> depuis l'ouverture de la branche.
>
> **Le prompt à copier dans une session neuve est versionné :
> [PROMPT_REPRISE.md](PROMPT_REPRISE.md).** Il est autoportant et porte un bloc
> ÉTAT qui empêche de « réparer » les décisions prises exprès. **À mettre à jour à
> la fin de chaque session qui arbitre quelque chose**, sinon il vieillit mal.

**Chantier de cette branche : la charte v2 « La console d'étude ». Direction
artistique SOLDÉE**, arbitrée de bout en bout par le propriétaire, sur pièces.

Décisions actées :

- **Référence fondatrice** : l'app SENTRY (`sentry-by-artificial-isa.fuser.app`),
  charte extraite mécaniquement (Playwright WebKit, CSS calculé). **Les deux liens
  (app déployée et vue Fuser Studio), la méthode d'extraction, ce qui a été prélevé
  et ce qui reste à prélever : [REFERENCES_SENTRY.md](REFERENCES_SENTRY.md).**
- **Variante A « Observatoire »**, contre B Phosphore (monochrome vert), C NERV
  (orange dominant) et D Or ancien (pont avec la charte actuelle).
- **Typographie à trois voix, zéro italique** : Frank Ruhl Libre 900 (hébreu
  vedette), Saira Condensed (UI + titres d'écran), Share Tech Mono (données,
  traduction française des cartes, sous-titre de marque). Instrument Serif a été
  **retirée de la charte** (arbitrage S2, exigence « zéro italique, la même
  police que le reste »).
- **12 modules retenus sur 21** : 01 radar de révision, 02 carte orbitale des
  thèmes, 03 timeline de session, 04 numérotation, 05 bandeau de boot,
  08 graduations de bord, 09 pilule voix, 11 aberration chromatique,
  14 code-barres, 15 insigne hexagonal de niveau, 16 champ d'étoiles, 19 jauge à
  aiguille. Écartés « pour l'instant » : 06, 07, 10, 12, 13, 17, 18, 20, 21.
- **Plus aucun effet de surface d'écran dans la charte** (24/07, sur iPhone réel).
  Le **scintillement** est parti par choix, alors qu'il avait passé le test. Le
  **bruit** et le **vignettage** ont été **refusés jusqu'à leur cran minimal** à la
  seconde passation, écran nu jugé bon. Ce qui reste de « console » tient donc à la
  grille 32px, aux graduations de bord, aux croix de visée, au glow et aux trois
  voix typo — pas à un artefact d'écran. La règle de la lampe est désormais portée
  par le **seul glow**. Détail des deux passations et de leur contradiction :
  spec § 5 (tableau). ⚠️ Le module 11 (aberration chromatique sur les titres) n'a
  jamais été un calque et **n'est pas concerné**.
- **Deux chartes coexisteront** (décision du 24/07, spec § 7) : la console ne
  remplace pas « le carnet d'étude du soir », elle s'y **ajoute** — avec un
  **sélecteur de charte à l'accueil**. L'ancienne charte est sauvegardée en jeu
  de tokens nommé dans le spec § 7, prête à devenir un thème.

Les pièces, dans cet ordre de lecture :

- **[docs/superpowers/specs/2026-07-24-charte-retrofuturiste-design.md](docs/superpowers/specs/2026-07-24-charte-retrofuturiste-design.md)**
  — le spec, source de vérité écrite ; § 7 = les deux chartes et le sélecteur.
- **`prototype-nerv.html`** — la page-témoin v0.6 ; **elle fait foi en cas de
  désaccord avec le spec**. Quatre écrans (carte recto/verso, accueil,
  révélation, bilan) plus l'inventaire (nuancier, gamme typo, états).
- **`test-crt-iphone.html`** — le protocole de test des calques sur device,
  **soldé** (les trois effets ont été rejetés) et conservé pour un futur effet à
  juger. Son écran de garde le dit, pour qu'une repasse ne soit pas prise pour un
  verdict de charte.
- **`specimen-hebreu.html`** — שָׁלוֹם dans les **62 familles Google Fonts qui
  couvrent l'hébreu**, classées par voix typographique, sur le fond de la charte.
  Chaque carte porte un **verdict nikoud mesuré dans le fichier de fonte** (table
  `cmap` du sous-ensemble hébreu, 14 marques vérifiées) : 57 complètes,
  Solitreo 13/14, **Cascadia Code et Cascadia Mono 6/14**, **Handjet et Google Sans
  sans aucune marque**. Contrôle du protocole : Frank Ruhl Libre ressort à 14/14.
- **Exploration typographique hébraïque — CLASSÉE le 25/07.** Décision du
  propriétaire : **on garde `Frank Ruhl Libre`** pour l'hébreu (pile inchangée :
  `'Frank Ruhl Libre','David Libre','Times New Roman',serif` ; 900 en vedette,
  500 en courant), dans les deux chartes. Les pièces sont conservées **au cas où**,
  pas pour être reprises — ne pas rouvrir sans demande explicite :
  - `specimen-hebreu.html` — שָׁלוֹם dans les 62 familles Google Fonts couvrant
    l'hébreu, verdict nikoud mesuré dans chaque fichier de fonte (57 complètes ;
    Cascadia 6/14, Handjet et Google Sans sans aucune marque).
  - `specimen-monospace-hebreu.html` — la recherche hors catalogue : aucune police
    de terminal du catalogue n'est vocalisable ; trois tiennent (Miriam Mono CLM,
    GNU Unifont, FreeMono), Terminus et DejaVu Sans Mono sont hors jeu.
  - `duel-miriam-unifont.html` — la finale entre les deux, alphabet entier et dix
    mots du carnet.
  - `unifont-nikoud-repare.html` + `polices/repare_unifont.py` — le nikoud
    d'Unifont réparé (qamats 42 px → 18, écart 0 → 6 px, lettre plus repoussée),
    **jugé insuffisant à l'arrivée**. Script versionné, donc reproductible si la
    question revient.
  - `polices/` — les sous-ensembles de fontes et leurs licences.
- **`prototype-effets.html`** — les 21 modules candidats, retenus et écartés.
- **`prototype-variantes.html`** — les 4 directions et les bancs d'essai typo.
- Liens iPhone et ordinateur : encart en tête de [README.md](README.md).

**Ce qui reste, dans l'ordre :**

1. ~~Test des calques CRT sur iPhone réel~~ — **SOLDÉ le 24/07.** Deux passations
   sur iPhone 16 Pro (`402×874@3`, animations actives). La seconde, guidée, fait
   foi : `BRUIT ⇒ REJETÉ · VIGNETTAGE ⇒ REJETÉ · ENSEMBLE=ok · NIKOUD=lisible ·
   GRILLE=lisible`. Les calques sont retirés de la charte (spec § 5,
   `prototype-nerv.html` en v0.6), et la recette du spec § 6 est acquise : le nikoud
   tient sous le halo ambre, la grille de fond reste discrète sous le texte.
   `test-crt-iphone.html` est conservé, marqué « protocole soldé » sur son écran de
   garde — il resservira si un effet de surface est un jour reproposé.
2. ~~Prélever les animations sur SENTRY~~ — **passe faite le 25/07, résultat
   négatif et acquis : le gisement est sec, ne pas la refaire.** Le mouvement propre
   à la référence tient en **trois `@keyframes`** : `noiseShift` et `flick` (les deux
   calques CRT **déjà rejetés sur iPhone**) et `satspin`, **keyframe mort** jamais
   monté dans le DOM. Zéro animation d'état, zéro transition d'écran, zéro
   comportement au défilement, zéro SVG. Le survol y vient des classes Tailwind
   `transition-colors` — un défaut de framework, pas une décision de charte. Mesuré
   en WebKit (818 nœuds, 12 interactifs sondés) **puis contre-vérifié à la source**
   hors navigateur. ⚠️ Piège payé : la transition à rebond et les keyframes
   `f-shimmer`/`f-spark` qu'une première lecture avait pris pour des trouvailles
   appartiennent au **badge « Made with Fuser »** — du mobilier d'hébergeur, pas à
   SENTRY. Détail complet et leçon de méthode :
   [REFERENCES_SENTRY.md](REFERENCES_SENTRY.md) § « le gisement est sec ».

   **Conséquence, ouverte : la règle `steps()` n'a pas de fondement mesuré.** Le
   spec § 5 la justifie par « la signature *instrument* de la référence » ; or
   `steps()` n'a que **deux occurrences dans toute la référence, et ce sont
   exactement les deux calques rejetés**. La règle a été héritée d'un matériau
   retiré depuis. Elle est **mise au jugement**, pas rouverte d'office.

   **Le mouvement doit donc être composé, pas prélevé** →
   **`prototype-mouvement.html`** (créé le 25/07) : les **9 moments** de l'app qui
   appellent du mouvement — révélation recto/verso, verdict juste/faux, carte
   suivante, progression, radar, transition d'écran, chiffres du bilan, pilule voix,
   alerte — chacun rendu **deux fois côte à côte, `steps()` contre fluide**, à
   markup, durée et distance identiques, rejouables ensemble. Aucun effet de surface
   d'écran ; un seul mouvement en boucle (la pilule voix) et il est borné par un état
   réel. **En attente du verdict du propriétaire : A (steps), B (fluide) ou rien,
   moment par moment** — « rien » étant une réponse légitime sur plusieurs lignes.
3. **Mouvement ambiant — « l'âme ».** Demande du propriétaire, 25/07 : des mouvements
   « juste cosmétiques » pour donner de l'âme au projet. ⚠️ **Cela entre en conflit
   frontal avec la charte telle qu'elle est écrite** — la règle de la lampe exige que
   le mouvement soit *signifiant*, et un mouvement cosmétique ne l'est par définition
   pas. Résolution proposée, **pas encore arbitrée** : la charte confond deux
   registres, les **signaux** (voyants, verdicts — soumis à la lampe) et la **vie
   ambiante** (le ronflement de l'instrument, qui ne signale rien mais distingue un
   appareil allumé d'un appareil débranché). Le précédent existe déjà sans avoir été
   nommé : le **module 16, le champ d'étoiles, est retenu avec la mention « écrans
   calmes seulement »**. D'où la **règle de la veilleuse** proposée au spec § 5 bis.

   **`prototype-ame.html`** (créé le 25/07) porte les **9 propositions** : étoiles à la
   dérive, radar qui balaie à vide, orbites lentes, feed de veille, aiguille qui
   frémit, curseur qui bat, séquence d'allumage, croix de visée qui se posent, halo qui
   respire (celui-là **signalé comme risqué** — c'est le plus proche du scintillement
   rejeté, et il n'est pas recommandé). Chacune isolée avec son interrupteur, puis un
   **écran d'accueil cumulé** avec « tout couper » et **un compteur d'animations
   actives** — le chiffre qui objective « est-ce que ça grouille ? » (la charte
   arbitrée est à 0 au repos). La bascule `steps()`/fluide s'y applique aussi :
   **le mouvement ambiant est le cas où la règle `steps()` risque le plus de casser**,
   une dérive lente par à-coups n'étant pas une dérive lente.
   **En attente du verdict** : garder / jeter / garder mais moins, pour chacune des 9.

   ⚠️ **Incident du 25/07, à ne pas repayer — et question ouverte pour le
   propriétaire.** La planche du mouvement a été ouverte sur son appareil et
   **aucune animation n'a joué**. Le fichier servi était pourtant byte-identique
   (53 390 octets, comparaison binaire) : la cause était le réglage système
   **« Réduire les animations »**, que les deux planches respectaient en figeant
   tout — **en silence**. Le précédent existait pourtant : `test-crt-iphone.html`
   affiche un écran « TEST IMPOSSIBLE EN L'ÉTAT » pour exactement ce cas, il n'avait
   pas été transposé. **Règle qui en sort : une page de jugement doit annoncer
   quand un réglage d'accessibilité la neutralise, et offrir une dérogation locale.**
   Les deux planches portent désormais un encart `#alarme` (visible seulement si le
   média correspond) et un bouton `#forcer` qui pose `body.force-anim` ; la coupure
   est devenue `body:not(.force-anim) *,…::before,…::after`.
   ⚠️ **Question non tranchée : si « Réduire les animations » est un réglage
   permanent chez le propriétaire, alors tout le chantier du mouvement ne le
   concernera pas en usage réel** — l'app respectera le réglage. À confirmer avant
   d'investir davantage dans les animations.

4. **Les parures — l'ornement de l'app.** Demande du propriétaire, 25/07 : du
   cosmétique **dans l'app elle-même**, des animations et d'autres éléments, « pour
   faire une app super belle ». C'est une troisième question, distincte des deux
   précédentes : le mouvement dit ce qui bouge quand il se passe quelque chose,
   l'âme ce qui vit quand rien ne se passe, **les parures disent de quoi l'app est
   faite**. **`prototype-parures.html`** (créé le 25/07) porte **13 propositions**,
   chacune en bascule **sans / avec**, réparties en quatre familles : la vedette
   hébraïque (lettre fantôme, nikoud teinté, racine en vedette, réglure de cahier),
   la matière de la carte (épaisseur du paquet, cartouche poinçonné, filigrane de
   niveau, sceau de session), les ornements de données (constellation des thèmes,
   quantième hébraïque, règle de bord qui suit le défilement, bouton qui s'enfonce)
   et le geste qui enseigne (écho de saisie).

   **Trois d'entre elles ne sont pas décoratives, elles enseignent** — et c'est ce qui
   les rend défendables : le **nikoud teinté** (les voyelles dans leur propre teinte,
   la vocalisation devient un calque lisible ; découpage des marques U+0591–U+05C7 à
   l'exécution, **vérifié à l'œil ×4 : le rendu de l'hébreu n'est pas cassé**), la
   **racine en vedette**, et l'**écho de saisie** (les lettres hébraïques s'allument à
   mesure qu'on tape la translittération — elle transforme le mode Saisie, qui est
   précisément celui sans aucune animation aujourd'hui).

   Deux réserves consignées : la **racine demande un champ `racine` dans
   `data/*.json`** — seule proposition à coût de contenu, c'est un lot à part
   entière ; et le **cartouche + le filigrane font double emploi avec l'insigne
   hexagonal** de niveau, à choisir sans cumuler. **11 des 13 sont statiques** :
   rien en batterie, rien au repos, et **elles survivent au mouvement réduit** — ce
   qui n'est pas un détail vu la question ouverte plus haut. **En attente du
   verdict** : prendre / jeter / prendre plus discret, pour chacune des 13.

5. **Session de conception du système de thèmes** (brainstorming →
   writing-plans) : le sélecteur du § 7 est une idée cadrée, rien n'est planifié.
6. **Portage** sur les vraies surfaces — **attend la fin de la réorganisation du
   dépôt sur `main`**, sinon on peint sur une structure qui bouge.

**Audit d'animation du 25/07 — quatre défauts relevés sur `main`, non corrigés
ici** (cette branche ne touche pas aux surfaces déployées ; à reprendre dans une
session `main`). Mesuré en WebKit sur le site en ligne, parcours réel piloté :

- ⚠️ **Portail, `.menorah::before` — vrai défaut d'accessibilité.** La règle de
  mouvement réduit est `*{transition:none!important;animation:none!important}`, et
  **`*` ne cible pas les pseudo-éléments** : le halo `lueur` continue de pulser à
  l'infini alors que l'utilisateur a demandé l'arrêt des animations. Correctif :
  `*,*::before,*::after`. **Le même bug existait deux fois de plus dans cette
  branche** (`prototype-effets.html`, et `prototype-variantes.html` n'avait aucune
  règle du tout) — corrigés ici. À trois occurrences, **ça mérite d'entrer dans les
  pièges de `CLAUDE.md`** lors de la prochaine session `main`.
- Portail : 2 animations infinies tournent en permanence à l'accueil (`lueur` 4,5 s,
  `acc-pouls` 2,6 s) — seul coût batterie identifié du site.
- `app.html`, **mode Saisie** : le feedback juste/faux apparaît **sans aucune
  transition**, alors que le QCM anime son option. Incohérence entre deux modes
  voisins, et l'un des deux moments les plus chargés de l'app.
- `app.html` : **l'écran de bilan n'a aucune transition d'entrée**. Avec le point
  précédent, ça confirme le constat de la planche du mouvement — **les deux moments
  les plus chargés émotionnellement sont précisément les deux qui ne bougent pas.**
- Ce qui est **sain** et n'a pas besoin d'être revérifié : aucune occurrence de
  `transition:all` sur les 4 pages déployées (piège n°2 tenu), anneau de focus doré
  confirmé sur 10 tabulations au portail comme dans l'app, aucun état figé, aucune
  animation morte, mobile et desktop identiques.

⚠️ **PIÈGE AU MERGE — à lire avant de fusionner cette branche.** Elle est partie
de `bcf71d0` (« Chantier 1 : extraction du vocabulaire vers `data/` »), un commit
**absent de `main`** : `main` a refait ce travail autrement (`ff25eec` puis la
suite du chantier 1). La branche traîne donc un **doublon périmé** de
`data/*.json` et `outils_migration/extrait_donnees.js`, plus un `TODO.md` et un
`README.md` figés au 24/07. Au merge : **prendre la version de `main` pour
tout**, ne garder de cette branche que les **fichiers de la DA**
(`prototype-nerv.html`, `prototype-effets.html`, `prototype-variantes.html`,
`test-crt-iphone.html`, `specimen-hebreu.html`, `specimen-monospace-hebreu.html`,
`duel-miriam-unifont.html`, `unifont-nikoud-repare.html`, `polices/` et le spec) et, si voulu, l'encart
README. Divergence **remesurée le 25/07 en fin de session : 30 commits de retard,
28 d'avance** (elle était de 13/17 à l'ouverture de la branche — elle continuera de
croître tant que la réorganisation de `main` avance, ce qui est normal et sans
gravité puisque rien n'est partagé entre les deux côtés hors des docs).

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

Deux choses à savoir avant d'ouvrir le prochain chantier, toutes deux acquises
le 24/07 :

- **Exercer l'`extractCards()` d'`app.html` est possible, et c'est le seul
  moyen** : `--check` ne compare que l'extracteur de `build.js`, donc une dérive
  côté `app.html` est invisible à l'outillage (CLAUDE.md § extraction coupling).
  Recette : `python3 -m http.server`, jsdom en `runScripts:'dangerously'` +
  `resources:'usable'`, le `fetch` de Node injecté (jsdom n'en fournit pas).
  Passage vert le 24/07 : 1070 cartes, 0 erreur console.
- **Découverte hors chantier, non corrigée** : au tout premier lancement, si
  aucun chip de niveau n'est sélectionné, `state.niveaux` reste vide et le
  bouton « démarrer » ne fait rien. Jugé conforme à l'intention lors du contrôle,
  volontairement laissé tel quel — à trancher si quelqu'un le rencontre.

## Outillage (WSL, à recréer en début de session si besoin)

- **Consultation du carnet par commande** (`cherche_mots.js`, versionné, dev-only, zéro
  dépendance, ne modifie rien — le canal cheap du piège n°15) : `node cherche_mots.js TERME
  [TERME…]` répond « existe-t-il ? où ? » — terme hébreu = comparaison exacte sur `he_plain`
  (headwords, puis formes, puis mot exact dans les exemples), **puis, seulement si l'exacte
  échoue, l'appariement ktiv male/haser** en rubrique séparée « orthographe voisine » (le
  carnet est vocalisé donc défectif : עִתּוֹן s'y écrit `עתון` quand on cherche `עיתון` —
  sans cette rubrique, 6 mots sur 24 ressortaient `ABSENT` alors qu'ils étaient là, le sens
  qui fait insérer un doublon) ; terme latin = sous-chaîne à
  frontière de mot en tête dans `.fr`/`note`/`exemples`. Sortie `SECTION Lnnnn · hébreu —
  français` (le n° de ligne sert d'ancre de lecture fenêtrée), `ABSENT` seulement si ni
  exacte ni voisine, bornée à 8
  occurrences par rubrique (surplus compté, jamais tronqué en silence). `node cherche_mots.js --stats` :
  total, répartition par section/niveau/thème (du moins doté au plus doté) — l'arbitrage
  « quel thème/niveau est sous-doté ? » sans lire le carnet. Réutilise `extractCards` &
  cie exportés par `build.js` (pas de troisième parseur), dont `orthographeVoisine` —
  règle mesurée : insertion de ו/י seulement, forme courte ≥ 3 lettres, ≤ 2 insertions,
  soit 37 paires sur 1053 mots. Les garde-fous ne sont pas décoratifs : sans eux לישן
  (dormir) s'apparie à לשון (langue). `ajoute_mots.js` consomme le même helper en
  **informatif non bloquant** — son garde doublons reste la comparaison exacte.
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
