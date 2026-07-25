# SENTRY — la référence fondatrice de la charte v2

La direction artistique « La console d'étude » vient d'une seule source, choisie par le
propriétaire parmi les familles cassette futurism / synthwave / Evangelion. Ce fichier existe pour
qu'on n'ait plus jamais à la retrouver de mémoire, et pour dire **ce qui a déjà été prélevé et ce
qui reste à explorer**.

## Les liens

| Lien | Ce que c'est |
|---|---|
| **https://sentry-by-artificial-isa.fuser.app/** | **L'application déployée** — titre `Sentry Encounter Scope`, ~163 Ko. C'est d'elle que la charte a été extraite le 2026-07-24, et c'est elle qu'il faut piloter pour la suite. |
| **https://app.fuser.studio/view/ee4f1ac3-ddc4-44bf-b34c-9600b6dc0263** | **La vue Fuser Studio du même projet** — titre `SENTRY - Fuser`, ~64 Ko. Une seconde entrée sur la référence, utile si l'app déployée bougeait ou disparaissait. |

Les deux ont répondu `200` sans authentification le 2026-07-25, vérifié en fin de session.
⚠️ Ce sont des adresses de service tiers : elles peuvent changer ou tomber. Si la prochaine
passe les trouve mortes, ce qui a déjà été prélevé reste intact dans le spec, dans
`prototype-nerv.html` et dans `prototype-effets.html` — c'est le **gisement restant** qui serait
perdu, pas la charte.

## Comment la charte en a été extraite

Playwright + WebKit sur **l'app déployée** (premier lien), en lisant le **CSS calculé**
(pas le code source) : couleurs
résolues, familles et graisses de police, épaisseurs de filet, rayons, ombres. C'est cette méthode
qui a produit les jetons du § 2 du spec — ambre `#f0b32a` sur quasi-noir `#05040A`, phosphore
`#54ff8a`, alerte `#FF4747`. La même méthode resservira pour aller chercher les animations.

## Ce qui a déjà été prélevé

- **Les jetons de couleur et la structure d'écran** — spec § 2 et § 4 : grille de fond 32 px,
  graduations de bord, croix de visée aux quatre coins, onglets à coin coupé, pilules, panneaux à
  petits `+`, curseur à poignée pentagonale, feed de logs préfixés `▸`.
- **21 modules candidats**, tous rejoués dans `prototype-effets.html`. **12 retenus** : radar de
  révision, carte orbitale des thèmes, timeline de session, numérotation à matricule, bandeau de
  boot, graduations de bord, pilule voix, aberration chromatique, code-barres, insigne hexagonal de
  niveau, champ d'étoiles, jauge à aiguille. **9 écartés « pour l'instant »** : halo, bloom,
  balayage, glitch, équerres, bande, lettre fantôme, ticker, réticule — leurs démos sont conservées
  sur la même page, prêtes à être repêchées.
- **Les trois calques CRT** (bruit, vignettage, scintillement) : prélevés, puis **tous rejetés sur
  iPhone réel** le 24/07 (spec § 5). Ce n'est pas un jugement sur la référence, c'est un jugement
  sur le confort d'étude à 23 h.

## Ce qui reste à explorer — le chantier ouvert

⚠️ **Le mouvement est le grand absent de la charte actuelle.** Après le retrait des trois calques,
il ne reste qu'**une seule animation** dans toute la page-témoin : le bandeau de boot (module 05),
qui ne joue qu'une fois à l'ouverture. La console est donc, aujourd'hui, entièrement statique.

À aller chercher dans SENTRY, en priorité :

- **Les animations d'état** : ce qui se passe quand une valeur change, quand un panneau devient
  actif, quand une alerte apparaît. C'est le registre qui manque le plus à une app de révision, où
  chaque réponse est un changement d'état.
- **Les transitions d'écran** : comment on passe d'une vue à l'autre. La charte n'en dit rien, et
  l'app a quatre écrans (carte, révélation, accueil, bilan) plus le sélecteur de charte à venir.
- **Les éléments graphiques non encore relevés** : tout ce que la première passe, concentrée sur
  les 21 modules, a laissé de côté — décorations de fond, séparateurs, indicateurs, cartouches.
- **Le comportement au défilement**, s'il y en a un.

Deux garde-fous hérités, à ne pas rouvrir :

1. **Tout mouvement est en `steps()`**, jamais de transition fluide (spec § 5) — c'est la signature
   « instrument » de la référence.
2. **Aucun effet de surface d'écran** : bruit, vignettage et scintillement ont été jugés sur
   l'appareil et rejetés. Une animation qui reviendrait à teinter ou faire vibrer toute la surface
   retomberait dans ce qui a déjà été refusé. Le mouvement doit être **local et signifiant** :
   quelque chose bouge parce qu'il se passe quelque chose (règle de la lampe, spec § 5).

Méthode suggérée pour la prochaine passe : rejouer l'extraction en WebKit, mais sur les
**`@keyframes`, `transition` et `animation` calculés** de la référence, et rendre le tout dans une
planche à la manière de `prototype-effets.html` — une démo par animation, jugée sur pièces avant
d'entrer dans la charte.
