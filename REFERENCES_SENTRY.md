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

## Le mouvement — passe du 2026-07-25 : **le gisement est sec**

⚠️ **Le mouvement est le grand absent de la charte actuelle.** Après le retrait des trois calques,
il ne reste qu'**une seule animation** dans toute la page-témoin : le bandeau de boot (module 05),
qui ne joue qu'une fois à l'ouverture. La console est donc, aujourd'hui, entièrement statique.

**La passe d'extraction du mouvement a eu lieu le 2026-07-25. Elle a rendu presque rien, et ce
résultat négatif est acquis : ne pas la refaire.** WebKit sur l'app déployée (`getAnimations()`,
CSS calculé sur 818 nœuds, sondage de 12 interactifs avant/hover/clic, défilement), puis
**contre-vérifié à la source** hors navigateur (`curl` sur la page et sur `client.js`). Le
vocabulaire de mouvement **propre à SENTRY**, en entier :

| Animation | Timing | Ce que c'est | Statut |
|---|---|---|---|
| `noiseShift` | 0,55 s `steps(2)` ∞ | calque de bruit `.noise` | déjà rejeté sur iPhone (24/07) |
| `flick` | 4 s `steps(2)` ∞ | scintillement `.scan` | déjà rejeté sur iPhone (24/07) |
| `satspin` | 0,7 s `linear` ∞ | rotation | **keyframe mort** — `.sat-spin` n'est jamais monté dans le DOM |

**C'est tout.** Zéro animation d'état, zéro transition d'écran, zéro comportement au défilement,
zéro `<svg>`, zéro `clip-path`, zéro `mask`, zéro `filter`. Le survol est assuré par les classes
utilitaires `transition-colors` / `transition-opacity` de **Tailwind** — le défaut du framework
(150 ms), pas une décision de charte. La référence est statique par construction.

⚠️ **Piège payé, à ne pas retomber dedans.** Une première lecture avait rapporté comme trouvailles
une transition à rebond `cubic-bezier(.2,1.1,.3,1)` et deux keyframes scintillants
(`f-shimmer`, `f-spark`). Vérification faite : ils appartiennent au **badge « Made with Fuser »**
et à son tiroir QR — du **mobilier d'hébergeur injecté sur toutes les apps de la plateforme**, pas
à SENTRY. Sur une référence hébergée, toujours séparer l'app du chrome du fournisseur : ici il se
reconnaît au préfixe de classe `f-` et à l'`id` `__fuser_made_with_badge`.

**Ce que ça fait à la règle `steps()`.** Le spec § 5 pose que « tout mouvement est en `steps()`,
jamais de transition fluide », justifié par « la signature *instrument* de la référence ». Or
`steps()` n'a que **deux occurrences dans toute la référence, et ce sont exactement les deux
calques rejetés sur l'appareil**. La règle a donc été héritée d'un matériau retiré depuis, et
n'a jamais été jugée pour elle-même. **Ce n'est pas une réouverture de la DA** — c'est une mesure
qui montre qu'une règle n'a pas de fondement mesuré. Elle est mise au jugement dans
`prototype-mouvement.html` (chaque moment rendu deux fois, `steps()` contre fluide, même markup,
même durée, même distance).

Un seul acquis technique est réellement transposable, et il est bon — le commentaire de
l'hébergeur l'explicite : **animer deux valeurs avec durée et easing identiques pour que leurs
deltas s'annulent**, afin qu'un élément reste rigoureusement immobile pendant que son conteneur
grandit. Chez nous : la vedette hébraïque ne doit pas bouger d'un pixel quand la réponse se
déploie sous elle (moment 01 de la planche, obtenu par `clip-path` plutôt que par la hauteur).

Deux garde-fous hérités, dont un seul est encore fondé :

1. **Aucun effet de surface d'écran** — solide, jugé sur l'appareil. Bruit, vignettage et
   scintillement ont été refusés jusqu'à leur cran minimal. Une animation qui reviendrait à teinter
   ou faire vibrer toute la surface retomberait dans ce qui a déjà été refusé. Le mouvement doit
   être **local et signifiant** : quelque chose bouge parce qu'il se passe quelque chose (règle de
   la lampe, spec § 5).
2. **Tout mouvement en `steps()`** — **en cours de jugement**, pour la raison mesurée ci-dessus.

**Conclusion de méthode : le mouvement de la charte ne peut plus être prélevé, il doit être
composé.** La référence garde son autorité sur les couleurs, la structure d'écran et les ornements
— c'est de là qu'ils viennent, et ça ne bouge pas. Elle n'a simplement rien à dire sur le
mouvement. Inutile de la repiloter pour ça.
