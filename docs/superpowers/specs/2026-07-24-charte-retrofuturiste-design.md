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
- Registre d'effets : celui de la référence (bruit, vignettage, scintillement) — validé
  visuellement, à re-juger sur iPhone réel avant généralisation (piège n°14 : jamais de
  verdict de confort sur émulation).
- **Modules retenus** (arbitrage sur `prototype-effets.html`, 21 candidats) :
  **01** radar de révision (accueil : blips = cartes, distance au centre = échéance SRS,
  dues clignotantes), **02** carte orbitale des thèmes (bilan : orbites = niveaux, points
  = thèmes), **03** timeline de session (traits vert/rouge par réponse sur la piste),
  **04** numérotation systématique (matricule `0421` sur cartes et feed), **05** bandeau
  de boot (3 lignes tapées à l'ouverture, **une seule fois**, repli statique sans
  animation), **08** graduations de bord d'écran (couches de fond de `.ecran`),
  **09** pilule d'état audio (`VOIX · OK` en barre d'état), **11** aberration chromatique
  (titres display uniquement, jamais le contenu d'étude), **14** code-barres + série
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
| `--vert` | `#54ff8a` | Phosphore : titres display, translittérations, états actifs, succès, focus |
| `--rouge` | `#FF4747` | Alerte, erreur, correction |
| `--orange` | `#ff6a1f` | Accent secondaire (réserve, usage parcimonieux) |
| `--lune` | `#cfd6e6` | Gris-lune : texte neutre (traductions françaises) |

Halos associés : ambre `rgba(240,179,42,.35)`, vert `rgba(84,255,138,.3)`,
rouge `rgba(255,71,71,.4)`.

## 3. Typographie — quatre voix

| Voix | Famille | Usage |
|---|---|---|
| Hébreu vedette | **Frank Ruhl Libre 900** | Le carton-titre : mot hébreu énorme, seul en scène, halo ambre. Hébreu courant en 500. |
| Display | **Instrument Serif italique** | Titres de pages/sections, sous-titre de marque. Toujours vert + glow `0 0 6px currentColor`. Jamais pour le contenu d'étude. |
| Labels | **Saira Condensed** 400/600 | Toute l'UI : boutons, étiquettes, statuts. Capitales, letter-spacing ≥ .14em. |
| Données | **Share Tech Mono** | Feed de logs, numéros, translittérations (en `--vert` + glow), **et la ligne de traduction française des cartes** (1.05rem, `--lune`, letter-spacing .08em). |

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
  warning = bordure rouge, fond rouge 5%, titre clignotant.

## 5. Effets — les trois calques CRT

1. **Bruit** : rayures horizontales 1px blanches à 2,2%, animées en `steps(3)` (1.2s).
2. **Vignettage** : radial noir 50% aux bords.
3. **Scintillement** : `@keyframes flick` en `steps(1)` (creux à 88–95%), deux cadences —
   **4s** sur les indicateurs vivants (`● SESSION`), **2,6s** (plus nerveuse) sur les
   alertes (`⚠`, titres de warning, verdict d'erreur).

**Mouvement réduit** (ajout normatif) : sous `prefers-reduced-motion: reduce`, toute
animation se fige — bruit et scintillement immobiles, vignettage conservé (il est
statique). Implémenté dans le prototype.

Règles : **tout mouvement est en `steps()`, jamais de transition fluide** (l'esthétique
instrument, signature de la référence). Le glow est du `text-shadow`/`box-shadow`
`currentColor` ; il marque l'actif et le vivant — transposition directe de la « règle de
la lampe » v1 : *l'alarme ne sonne que quand il se passe quelque chose*.

## 6. Validation et suites

- **Recette visuelle** : nikoud lisible à taille réelle sur `--bg` (le halo ambre ne doit
  jamais noyer les points-voyelles), contrastes AA sur texte courant, lisibilité de la
  grille de fond sous le texte, et confirmation **sur iPhone réel** des trois calques CRT
  (coût perceptif à juger sur device, pas en émulation).
- **Hors périmètre de ce spec** : portage sur les surfaces réelles (attend la fin de la
  réorganisation du dépôt), icônes/manifest/theme-color (découlent des tokens § 2 le
  moment venu), sort des règles v1 non transposées (le pli, la carte unique, les couches —
  à arbitrer au portage), mode d'emploi des grands écrans (le prototype est mobile-first,
  piège n°13 à honorer au portage).
- **Prochaine étape** : plan d'implémentation (skill writing-plans) quand le portage
  sera d'actualité ; d'ici là, toute itération de DA se fait sur `prototype-nerv.html`.
