# Charte graphique v2 « La console d'étude » — spec de design

Date : 2026-07-24 · Branche : `refonte-retrofuturiste` · Statut : direction validée sur page-témoin

## 1. Contexte et périmètre

Remplacement, à terme, de l'identité « Le carnet d'étude du soir » (DESIGN.md) par une
identité rétrofuturiste sur **tout l'écosystème** (app, carnet, portail, icônes PWA,
manifest). Ce spec ne couvre **que la direction artistique et la charte** : la refonte de
l'organisation du code est un chantier séparé (spec du dépôt généré) et rien ici ne
s'appuie sur la structure actuelle des fichiers. Aucune surface déployée n'est modifiée
par ce chantier ; `main` reste intact.

**Référence fondatrice** : l'app SENTRY (`sentry-by-artificial-isa.fuser.app`), choisie
par le propriétaire parmi les familles cassette futurism / synthwave / Evangelion.
Charte extraite mécaniquement (Playwright WebKit, CSS calculé) le 2026-07-24.
**Liens, méthode et gisement restant : [REFERENCES_SENTRY.md](../../../REFERENCES_SENTRY.md)** —
la référence n'a été prélevée que sur ses couleurs, sa structure et ses 21 modules ; **ses
animations restent à explorer** (chantier ouvert le 25/07).

**Décisions actées sur planches comparatives** :
- Variante **A « Observatoire »** (la référence SENTRY telle quelle) — retenue contre
  B Phosphore (monochrome vert), C NERV (orange dominant, angles durs), D Or ancien (pont
  avec la charte actuelle).
- Ligne de traduction française des cartes : **T4 Share Tech Mono** — retenue contre
  Instrument Serif italique (T1), Frank Ruhl (T2), Saira Condensed (T3).
- Sous-titre de marque : **S2 Share Tech Mono** (capitales espacées) — retenu contre
  S1 Instrument Serif italique. Corollaire acté dans le même arbitrage : **plus aucun
  italique dans la charte** ; Instrument Serif, qui n'avait plus d'emploi, quitte la
  typographie. Les titres d'écran passent en Saira Condensed 600 capitales.
- Registre d'effets : celui de la référence (bruit, vignettage, scintillement) — validé
  visuellement sur émulation, puis **entièrement rejeté sur iPhone réel le 24/07**
  (§ 5). Le piège n°14 a joué exactement son rôle : ce qui passait en émulation ne
  passait pas sur l'appareil.
- **Modules retenus** (arbitrage sur `prototype-effets.html`, 21 candidats) :
  **01** radar de révision (accueil : blips = cartes, distance au centre = échéance SRS,
  dues en vert + halo — elles clignotaient jusqu'au retrait du scintillement, § 5), **02** carte orbitale des thèmes (bilan : orbites = niveaux, points
  = thèmes), **03** timeline de session (traits vert/rouge par réponse sur la piste),
  **04** numérotation systématique (matricule `0421` sur cartes et feed), **05** bandeau
  de boot (3 lignes tapées à l'ouverture, **une seule fois**, repli statique sans
  animation), **08** graduations de bord d'écran (couches de fond de `.ecran`),
  **09** pilule d'état audio (`VOIX · OK` en barre d'état), **11** aberration chromatique
  (titres uniquement, jamais le contenu d'étude), **14** code-barres + série
  (pied de carte verso), **15** insigne hexagonal de niveau (lettre hébraïque + palier),
  **16** champ d'étoiles + constellation (écrans calmes seulement : accueil, bilan),
  **19** jauge à aiguille (bilan : précision de session). Écartés à ce stade (« pour
  l'instant ») : 06 halo, 07 bloom, 10 balayage, 12 glitch, 13 équerres, 17 bande,
  18 lettre fantôme, 20 ticker, 21 réticule — démos conservées sur `prototype-effets.html`.
- Un **écran Bilan** rejoint les écrans témoins (jauge, timeline complète, carte
  orbitale, feed de synthèse).

**Pièces à conviction** (commitées sur la branche) : `prototype-nerv.html` (la page-témoin,
annexe vivante de cette charte — en cas de doute, elle fait foi), `prototype-variantes.html`
(l'historique des options écartées) et `prototype-effets.html` (les 21 modules candidats).

## 2. Tokens

| Token | Valeur | Rôle |
|---|---|---|
| `--bg` | `#05040A` | Fond, quasi-noir |
| `--panneau` | `#0A0814` | Surfaces (légèrement translucides sur grille : `rgba(10,8,20,.82)`) |
| `--grille` | `#0F0C1C` | Grille de fond (pas de 32px) et filets sourds |
| `--ligne` | `#7a5a14` | Or sourd : bordures 1px au repos, viseurs, séparateurs |
| `--ambre` | `#f0b32a` | **Voix dominante** : texte courant, labels, data, hébreu |
| `--vert` | `#54ff8a` | Phosphore : titres, translittérations, états actifs, succès, focus |
| `--rouge` | `#FF4747` | Alerte, erreur, correction |
| `--orange` | `#ff6a1f` | Accent secondaire (réserve, usage parcimonieux) |
| `--lune` | `#cfd6e6` | Gris-lune : texte neutre (traductions françaises) |

Halos associés : ambre `rgba(240,179,42,.35)`, vert `rgba(84,255,138,.3)`,
rouge `rgba(255,71,71,.4)`.

## 3. Typographie — trois voix (S2 : l'italique a quitté la charte)

| Voix | Famille | Usage |
|---|---|---|
| Hébreu vedette | **Frank Ruhl Libre 900** | Le carton-titre : mot hébreu énorme, seul en scène, halo ambre. Hébreu courant en 500. |
| Labels & titres | **Saira Condensed** 400/600 | Toute l'UI : boutons, étiquettes, statuts, **et les titres d'écran** (600, capitales, letter-spacing .26em, vert + glow `0 0 6px currentColor`). Capitales, letter-spacing ≥ .14em. |
| Données | **Share Tech Mono** | Feed de logs, numéros, translittérations (en `--vert` + glow), la ligne de traduction française des cartes (1.05rem, `--lune`, letter-spacing .08em), **et le sous-titre de marque** (capitales, letter-spacing .22em, vert + glow). |

**La question de l'hébreu a été rouverte le 25/07, puis refermée sur le même choix.** Tout le
catalogue Google Fonts couvrant l'hébreu a été passé en revue, les monospaces hébreux hors
catalogue aussi, et le nikoud de GNU Unifont a même été réparé pour l'occasion (planches et
script conservés sur la branche). Verdict du propriétaire : **on garde Frank Ruhl Libre**. Ne pas
rouvrir sans demande explicite.

Règles : `lang="he"` obligatoire sur tout nœud hébreu (invariant conservé de la charte v1).
Les tailles seront normalisées en gamme lors du portage (le prototype porte des valeurs
mesurées, pas encore une gamme nommée).

## 4. Composants et ornements

- **Écran** : fond grille 32px sourde, bordure 1px `--ligne`, croix de visée `+` aux
  quatre coins (Share Tech Mono, couleur `--ligne`).
- **Onglet HUD** : boîte à coin coupé (`clip-path` pentagone), fond plein (ambre / vert /
  rouge selon nature), texte fond-noir (blanc sur l'onglet rouge), capitales condensées.
- **Boutons** : pilules (`border-radius:9999px`), 1px, transparentes ; primaire = vert +
  glow + ombre interne ; danger = rouge ; focus = outline vert 2px décalé 3px.
- **Panneau** : fond translucide, 1px `--ligne`, petits `+` aux coins ; état actif =
  bordure verte + halo.
- **Curseur de progression** : piste 3px, rempli rouge, poignée pentagonale verte avec
  halo (transposition du « MISSION TIME » de la référence).
- **Feed de données** : lignes mono préfixées `▸ ` (vert), segments séparés par ` · `,
  numéros à trois chiffres (`CARTE 012`).
- **États** : vide = 1px pointillé `--ligne` (hérité v1 : pointillé = « rien ici ») ;
  warning = bordure rouge, fond rouge 5%, titre rouge + halo (il clignotait avant le
  retrait du scintillement, § 5).

## 5. Effets — la charte se passe des calques CRT

**Aucun calque de surface d'écran n'est retenu.** Les trois effets de la référence
(bruit, vignettage, scintillement) ont tous quitté la charte le 2026-07-24, jugés sur
iPhone réel avec le protocole `test-crt-iphone.html`. Ce qui reste de « console » ne
tient donc à aucun artefact d'écran : **grille de fond 32px, graduations de bord
(module 08), croix de visée, glow `currentColor`, les trois voix typographiques et
l'ambre/phosphore** portent seuls l'identité.

Historique des deux passations, à garder — sans lui, une session future croira à un
oubli et voudra les repêcher :

| Effet | Valeur testée | Passation 1 (24/07) | Passation 2 (24/07, protocole guidé) |
|---|---|---|---|
| Bruit | rayures 1px blanches 2,2%, `steps(3)` 1.2s | `ok` au cran du spec | **refusé** à 2,2%, 1,1% et 0,55% |
| Vignettage | radial noir 50% aux bords | `ok` au cran du spec | **refusé** à 50%, 25% et 12,5% |
| Scintillement | `flick` `steps(1)`, 4s et 2,6s | `ok` | retiré avant la passation 2, **par choix** |

C'est la **passation 2 qui fait foi** : consigne explicite avant chaque passe, verdict
verrouillé 20 s, recette recueillie. Deux facteurs expliquent le renversement, et
aucun n'invalide le verdict — la première passation s'est faite sur une version de
l'outil sans consigne guidée, et la seconde sur un écran déjà débarrassé du
scintillement, où le bruit avait moins de concurrence. L'écran nu, lui, a été jugé
`ok` avec nikoud et grille lisibles.

**Ce que ça n'autorise pas** : rien ici ne condamne le module 11 (aberration
chromatique sur les titres), qui n'a jamais été un calque de surface et n'a pas été
soumis au test.

**Mouvement réduit** (ajout normatif) : sous `prefers-reduced-motion: reduce`, toute
animation se fige. Il ne reste que le bandeau de boot (module 05), qui a de toute
façon un repli statique.

Règle conservée : **tout mouvement est en `steps()`, jamais de transition fluide**
(l'esthétique instrument, signature de la référence). Le glow est du
`text-shadow`/`box-shadow` `currentColor` ; il marque l'actif et le vivant —
transposition directe de la « règle de la lampe » v1 : *l'alarme ne sonne que quand il
se passe quelque chose*. Depuis le retrait du scintillement, il la porte **seul**.

> ⚠️ **Rectificatif mesuré, 2026-07-25 — la justification ci-dessus est fausse.**
> « Signature de la référence » ne tient pas à la mesure : `steps()` n'a que **deux
> occurrences dans tout SENTRY**, et ce sont **exactement les deux calques rejetés sur
> iPhone** le 24/07 (`noiseShift` 0,55 s `steps(2)` et `flick` 4 s `steps(2)`). Le seul
> autre keyframe de la référence, `satspin`, est **mort** — jamais monté dans le DOM.
> Tout le reste du mouvement y vient des classes Tailwind `transition-colors`, soit
> **150 ms en `cubic-bezier`** : un défaut de framework, et fluide. Relevé en WebKit
> puis contre-vérifié à la source hors navigateur ; détail et piège du badge
> d'hébergeur dans [REFERENCES_SENTRY.md](../../../REFERENCES_SENTRY.md).
>
> **La règle n'est pas annulée : elle est mise au jugement**, faute d'avoir jamais été
> jugée pour elle-même. `prototype-mouvement.html` rend les 9 moments de l'app deux
> fois côte à côte, `steps()` contre fluide, à markup, durée et distance identiques.
> Le verdict du propriétaire — A, B ou rien, moment par moment — remplacera ce
> paragraphe. Ce qui n'est **pas** remis en cause : l'absence de tout effet de surface
> d'écran, jugée sur l'appareil, et la règle de la lampe.

## 5 bis. La règle de la veilleuse — proposée le 2026-07-25, non arbitrée

Le propriétaire demande des mouvements **purement cosmétiques**, « pour donner de l'âme
au projet ». Pris au mot, c'est **interdit par le § 5** : la règle de la lampe exige que
le mouvement soit *signifiant*, et un mouvement cosmétique ne l'est par définition pas.

La proposition est que la règle ne parle pas de ça. Une console tient **deux registres** :

- les **signaux** — voyants, alarmes, verdicts. Soumis à la lampe : ils ne s'allument que
  pour dire quelque chose. Inchangé.
- la **vie ambiante** — le ronflement, l'aiguille jamais tout à fait immobile, le radar
  qui balaie un ciel vide. Elle ne signale rien ; c'est elle qui distingue un instrument
  **allumé** d'un instrument **débranché**.

La charte a déjà admis le second registre sans le nommer : le **module 16 (champ
d'étoiles) est retenu avec la mention « écrans calmes seulement »** — une décoration
ambiante, retenue à l'arbitrage du 24/07. Le précédent existe.

> **La règle de la veilleuse.** Un mouvement ambiant n'est admis que là où **rien n'est
> demandé à l'utilisateur** — accueil, bilan, états vides, attente. **Jamais** sur un
> écran où une carte attend une réponse. Il doit être **lent** (cycle ≥ 4 s, hors vision
> centrale), **sourd** (l'or plein reste réservé à la lampe), **au fond** (jamais sur le
> contenu d'étude), et **il s'arrête sous `prefers-reduced-motion`**.

Les 9 propositions sont dans `prototype-ame.html`, isolées puis cumulées, avec un
compteur d'animations actives — parce que neuf micro-mouvements irréprochables un par un
peuvent faire un écran qui grouille. Le halo qui respire y est **signalé comme risqué et
non recommandé** : c'est le plus proche du scintillement rejeté sur l'appareil.

⚠️ **Point technique normatif, payé trois fois le 25/07** : la coupure du mouvement
réduit doit s'écrire `*,*::before,*::after`. Le sélecteur `*` seul **ne cible pas les
pseudo-éléments** — le portail déployé laisse tourner le halo de sa ménorah malgré la
demande d'arrêt, et deux planches de cette branche avaient le même trou.

## 5 ter. La règle du mobilier — proposée le 2026-07-25, non arbitrée

Le propriétaire demande, le 2026-07-25, du décor **entièrement gratuit** : « des animations vraiment
cosmétiques et esthétiques, qui ne sont PAS forcément en rapport direct avec l'utilisation de l'app
ou du carnet », pour **décorer tout le site**. C'est un troisième registre, et il faut le nommer pour
la même raison que le second : sans nom, il est interdit par le § 5.

Les deux règles déjà écrites ne le couvrent pas. La **lampe** (§ 5) régit ce qui **signale**. La
**veilleuse** (§ 5 bis) régit ce qui dit que **l'instrument est allumé**. Le décor ne fait ni l'un ni
l'autre : il dit **de quoi l'objet est fait**.

> **La règle du mobilier.** Une console n'est pas faite que de voyants : elle a un châssis, des
> rivets, une plaque gravée, une grille d'aération. Rien de cela ne mesure quoi que ce soit, et
> personne n'a jamais reproché à un instrument d'avoir un beau boîtier. Un ornement gratuit est admis
> s'il porte sur un **objet nommé et encadré** — jamais sur la surface entière —, s'il ne **mime pas
> un signal**, et s'il s'arrête sous `prefers-reduced-motion`. Sa forme préférée est **statique** :
> le mobilier n'a pas besoin de bouger pour être du mobilier.

Trois conséquences, qui sont ce que la règle apporte réellement :

1. **La contrainte de l'objet encadré** est ce qui rend le décor compatible avec le verdict du 24/07.
   Bruit, vignettage et scintillement ont été refusés **jusqu'à leur cran minimal** parce qu'ils
   couvraient tout l'écran. Un terrain filaire dans une fenêtre qu'on peut regarder ou ignorer n'est
   pas un film posé sur la surface. Le verdict n'est pas rouvert : il est respecté par construction.
2. **L'interdiction de mimer un signal** est le vrai garde-fou vis-à-vis de la lampe. Un ornement qui
   prend la forme d'un voyant entraîne à ignorer les voyants, et l'app en a de vrais. C'est à ce
   titre que les **diodes de façade** (ornement 10 de la planche) sont signalées comme le plus
   contestable des dix-huit.
3. **La préférence pour le statique** n'est pas de la prudence, c'est une conséquence du réglage de
   l'appareil du propriétaire (« Réduire les animations », permanence non tranchée à ce jour) : un
   ornement statique est le seul qui lui parvienne à coup sûr. Onze des dix-huit sont statiques.

Les 18 propositions sont dans **`prototype-decor.html`**, en cinq familles : le châssis (statique),
l'alphabet comme ornement, les instruments qui ne mesurent rien, la profondeur (encadrée), et **les
six procédés prélevés** — ces derniers avec leur **valeur mesurée** au CSS calculé, issus de la
seconde passe SENTRY du 25/07 (voir [REFERENCES_SENTRY.md](../../../REFERENCES_SENTRY.md) §
« le mobilier décoratif »). Comme pour `prototype-ame.html`, la planche porte une **scène cumulée**
et un **compteur d'animations actives** : dix-huit ornements irréprochables un par un peuvent faire
un écran qui grouille, et c'est le nombre que le propriétaire **retire** qui est le verdict.

### 5 ter bis. La séquence d'ouverture — un quatrième cas, qui n'est pas un ornement

Demandée le 2026-07-25 : « une animation à l'ouverture de l'application, très spectaculaire, une
étoile de David avec les triangles entrelacés qui se transforme en alef progressivement pour ensuite
donner l'écran d'accueil ». C'est la **famille F** de la planche (ornement 19), et elle relève d'un
régime à part : une séquence a un **début, une fin, et ne joue qu'une fois**. La règle du mobilier ne
la couvre pas — le mobilier est permanent, une séquence est transitoire. Le précédent existe déjà et
il est acquis : le **bandeau de boot (module 05) est retenu**, et c'est le seul mouvement qui ait
survécu au retrait des trois calques.

**Ce qui n'est pas en cause** : l'interdiction des effets de surface d'écran (§ 5) porte sur des
calques **permanents** posés pendant l'usage, pas sur un écran d'ouverture qui est un écran à lui
seul puis disparaît. Le distinguer explicitement évite qu'une session future croie la règle violée.

**La géométrie est mesurée, et c'est ce qui fait la valeur de la proposition.** Sur un hexagramme de
circonradius 88, les six arêtes font toutes **152,4 px**, aux angles **±60° et 180°**. Les trois
traits de l'alef visé sont à **≈128°** (diagonale, longueur 140) et **≈40°** (les deux bras, 62 et
58). L'appariement qui en découle ne demande que **8° de rotation pour la diagonale et 20° par
bras** — autrement dit **l'hexagramme contient déjà la lettre**, et la séquence la révèle au lieu de
l'interpoler. Les trois arêtes qui s'effacent (les deux horizontales et une diagonale) sont
exactement celles qui n'ont pas d'emploi dans l'alef. Les six valeurs et les trois écarts sont en
commentaire au-dessus de la séquence dans la feuille de style.

L'**entrelacement est réel** : les six croisements sont les sommets de l'hexagone intérieur de rayon
88/√3 = 50,8 ; le triangle descendant passe devant partout, et **trois ponts** — fragments du
triangle montant — sont posés par-dessus **à un croisement sur deux** (azimuts 0°, 120°, 240°). Le
verrouillage de ces trois ponts est le **seul endroit de tout le chantier où `steps()` est pleinement
justifié** : un tissage se cliquette, il ne glisse pas. C'est un argument pour la règle du § 5, et
le premier qui soit fondé sur autre chose qu'un matériau retiré.

> ⚠️ **Point normatif payé par le raisonnement, valable pour TOUTE séquence.** Sous
> `prefers-reduced-motion`, une animation d'ouverture **ne se gèle pas — elle se rend déjà
> terminée**. Les dix-huit ornements partent d'un état neutre et les figer ne casse rien ; une
> séquence part d'un **écran noir** et construit l'accueil, donc `animation:none` laisserait une
> **page vide**, c'est-à-dire une app qui ne démarre pas. La coupure doit poser l'état **final**.
> C'est le pendant du piège `*,*::before,*::after` du § 5 bis : les deux concernent la coupure du
> mouvement, et les deux sont invisibles jusqu'à ce qu'on les mesure.

⚠️ **Le risque de cette proposition n'est pas technique, il est d'usage, et il est sérieux.** Une
ouverture de 6,5 s est somptueuse la première fois et pénible la trentième, sur une app ouverte
plusieurs fois par jour. Si elle est retenue, elle doit l'être **au lancement à froid seulement**,
**interruptible au premier appui**, **abrégée (2,2 s) dès la deuxième ouverture du jour** et
**coupable par réglage**. La planche porte la bascule intégrale / abrégée pour que les deux durées
soient jugées, pas pour illustrer un choix déjà fait.

⚠️ **Et une réserve de fond, qui n'est pas d'ordre esthétique** : l'étoile de David est un **symbole
identitaire et religieux**, et c'est le seul élément du chantier qui ferait **ouvrir l'app sur une
déclaration**. Le propriétaire l'a demandée explicitement et elle est livrée telle quelle ; la
décision n'est simplement pas de même nature que « prendre ou jeter un filet double ». Même régime
que la guématrie (09) et la rosace (05) : arbitrage du propriétaire, pas d'un agent.

⚠️ **Deux questions restent ouvertes et attendent son arbitrage, pas une décision d'agent** : la
**guématrie** (ornement 09) est un usage traditionnel et religieux, alors que le dépôt a écarté
sciemment la vie religieuse du périmètre du *vocabulaire* — on ne sait pas si cette décision couvre
l'*ornement* ; et la **grille de points** (ornement 15) est la seule proposition qui **remplace** un
acquis au lieu d'ajouter, puisqu'elle change le fond des trois surfaces et donc le § 4.

## 6. Validation et suites

- **Recette visuelle** : nikoud lisible à taille réelle sur `--bg` (le halo ambre ne doit
  jamais noyer les points-voyelles), contrastes AA sur texte courant, lisibilité de la
  grille de fond sous le texte, et confirmation **sur iPhone réel** des calques CRT.
  **Soldée le 24/07** : nikoud `lisible` sous le halo ambre, grille de fond `lisible`
  sous le texte, écran d'ensemble `ok` — le tout mesuré sur iPhone 16 Pro
  (`402×874@3`, animations actives), pas en émulation. Les calques, eux, ont été
  rejetés (§ 5). **Outil : `test-crt-iphone.html`**, conservé sur la branche : son
  protocole (isolement, calibrage à la moitié puis au quart, passe d'ensemble, ligne de
  verdict) resservira tel quel le jour où un effet de surface sera reproposé.
- **Hors périmètre de ce spec** : portage sur les surfaces réelles (attend la fin de la
  réorganisation du dépôt), icônes/manifest/theme-color (découlent des tokens § 2 le
  moment venu), sort des règles v1 non transposées (le pli, la carte unique, les couches —
  à arbitrer au portage), mode d'emploi des grands écrans (le prototype est mobile-first,
  piège n°13 à honorer au portage).
- **Prochaine étape** : plan d'implémentation (skill writing-plans) quand le portage
  sera d'actualité ; d'ici là, toute itération de DA se fait sur `prototype-nerv.html`.

## 7. Deux chartes coexistantes — le sélecteur à l'accueil (idée, 2026-07-24)

Décision de direction du propriétaire : **ne pas remplacer, mais ajouter**. « La console
d'étude » (§ 2–5) devient un thème parmi deux ; « Le carnet d'étude du soir » (la charte
v1) est conservé et **choisissable à l'accueil**. Cela recadre tout le portage : la cible
n'est plus « repeindre les surfaces » mais « paramétrer la surface par un thème ».

**L'ancienne charte n'est pas perdue** — elle vit dans `DESIGN.md` (prose complète, règles
nommées) et dans les tokens des fichiers déployés sur `main`. Elle est reproduite ici en
jeu de tokens nommé pour qu'elle devienne un thème au même format que la console :

| Rôle | Console (v2) | Carnet du soir (v1) |
|---|---|---|
| Fond | `#05040A` | `#12181f` (nuit d'encre) |
| Surface | `#0A0814` | `#1a222b` (carte), couche `#161e28` |
| Filet/bordure | `#7a5a14` | `#2a3440` (filet), `#2c3844` (bord) |
| Accent identité | `#f0b32a` (ambre) | `#d4a24c` (or ancien), `#e6c68a` (or tendre) |
| Actif/succès | `#54ff8a` (vert phosphore) | `#5bbd7a` (vert juste) |
| Alerte | `#FF4747` | `#d96a5b` (rouge à revoir) |
| Texte | `#e8e2d4` | `#ece7dd` (parchemin), `#9aa3ac` estompé |
| Hébreu | Frank Ruhl Libre 900 | Frank Ruhl Libre |
| UI | Saira Condensed | Assistant |
| Données | Share Tech Mono | JetBrains Mono |
| Cursive | — | Playpen Sans Hebrew (or tendre) |

**Implications pour l'architecture** (à trancher au portage, en phase avec la
réorganisation « dépôt généré » en cours sur `main`) :
- Chaque charte est un **jeu de custom properties** appliqué sur `:root` via un attribut
  (`data-charte="console" | "carnet"`), le choix mémorisé en `localStorage` et lu au
  tout premier paint (avant le CSS, pour éviter le flash de thème).
- **Ce ne sont pas que des couleurs** : les polices, et surtout les *ornements* (calques
  CRT, viseurs, radar, graduations) sont propres à la console. Le carnet doit pouvoir les
  **désactiver en bloc** — un thème n'est pas qu'une palette, c'est un ensemble de règles.
  Piste : les ornements CRT gardés derrière une classe `.charte-console` sur `<body>`.
- Le sélecteur vit à l'accueil (le portail actuel `index.html`, ou l'écran d'accueil de
  l'app), à côté des réglages existants ; deux vignettes de prévisualisation.
- **Invariant à préserver** : le trap n°5 (le premier bloc `:root` byte-identique entre
  carnet, app et portail) devient « byte-identique **par thème** » — chaque charte a son
  bloc de référence, partagé à l'identique entre les surfaces.

Statut : **idée cadrée, non planifiée**. Ne rien implémenter avant (a) la fin de la
réorganisation du dépôt et (b) une session de conception dédiée au système de thèmes
(brainstorming → writing-plans). Consigné ici pour ne pas perdre la décision.
