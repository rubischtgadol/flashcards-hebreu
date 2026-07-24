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
