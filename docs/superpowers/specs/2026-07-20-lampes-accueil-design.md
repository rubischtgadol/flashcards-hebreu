# Une seule lampe à la fois — l'accueil de l'app

**Date** : 2026-07-20
**Fichier visé** : `app.html` (et `flashcards_hebreu.html` par régénération)
**Origine** : TODO.md § Pistes de design ouvertes, piste A — relevée le 19/07, écartée
le 20/07 au matin par décision de Ruben, reprise le 20/07 au soir.

## Le problème

Quand des cartes sont dues, deux surfaces dorées coexistent sur l'écran d'accueil :

- `.review-card` — bordure `--gold` pleine, dégradé d'or 135° (16 % → 5 %), icône et
  flèche en or ;
- `.start` — dégradé d'or plein et lueur portée `0 6px 18px -8px var(--gold)`.

C'est la règle de la lampe prise en défaut à l'échelle de l'écran, là où on l'avait
jusqu'ici appliquée composant par composant : deux lumières d'égale intensité, donc
aucune hiérarchie.

**Aggravation mesurée le 20/07, que la piste n'avait pas relevée** : sous
`pointer:coarse`, `.start:enabled` est `position:sticky; bottom:12px`. La carte de
révision est en tête de panneau, « Commencer » est collé en pied. Les deux lampes ne
sont donc pas seulement sur la même page — elles sont **simultanément à l'écran en
permanence**, une à chaque extrémité du pouce.

DESIGN.md §5 a déjà arrêté le principe visé : **une seule lampe allumée à la fois,
choisie par l'état.** Cette spec ne rouvre pas ce choix ; elle en règle la forme.

## Le piège de la piste elle-même

La piste proposait de distinguer un « Commencer » secondaire actif par un
`filet --card-edge`. **Ce filet ne peut pas porter la distinction** :
`--card-edge:#2c3844` et `--line:#2a3440` (le filet de l'état désactivé) diffèrent de
deux points sur chaque canal — ils sont indiscernables à l'écran.

Il ne reste donc que deux axes réels entre « secondaire actif » et « désactivé » :

1. **la surface** — peau opaque `--card` contre `background:none` ;
2. **le texte** — `--ink` (#ece7dd) contre `--ink-dim` (#9aa3ac).

C'est le risque que la piste documentait (« on troquerait un défaut de hiérarchie
contre un défaut d'affordance, ce qui serait pire »), et il est plus étroit qu'annoncé.
D'où le critère d'acceptation à l'écran, ci-dessous, qui n'est pas négociable.

**Réserve à garder en tête** : `.exit` est un bouton *actif* dont le texte est
`--ink-dim`. « Texte estompé = désactivé » n'est donc pas une loi universelle dans
cette app. Ce qui sauve la lecture ici, c'est que la comparaison qui compte est *le
même bouton, au même endroit, dans deux états* : le passage de #ece7dd à #9aa3ac s'y
lit comme un changement, pas comme un style. Cette réserve est la raison pour laquelle
les trois états doivent être vus côte à côte avant de conclure.

## Les trois registres de `.start`

| État | Fond | Filet | Texte | Lueur | Collant (doigt) |
| --- | --- | --- | --- | --- | --- |
| Lampe (`due === 0`, actif) | dégradé or | transparent | #1a1206 | oui | **oui** |
| Secondaire actif (`due > 0`) | `--card` opaque | `--card-edge`, or au survol/focus | `--ink` | non | **non** |
| Désactivé | `none` | `--line` | `--ink-dim` | non | non |

Le registre secondaire n'est pas un idiome inventé : `.exit` porte déjà cette peau
(`--card` + `--card-edge`). L'or n'y apparaît qu'au survol et au focus — donc jamais
sur un état inactif, conformément à la règle de la lampe.

`.start` porte déjà `border:1px solid transparent` : le changement de filet ne provoque
aucun déplacement de mise en page.

## Les cinq pièces

**1. Le drapeau d'état.** `refreshSrsUi()` calcule déjà `due`. Il pose
`document.body.classList.toggle('has-due', due>0)`. Source de vérité unique : la
fonction est appelée depuis `buildChips`, `resetProfile`, `segPick` et `finish`, soit
tous les moments où le compte peut changer.

**2. `body.has-due .start:enabled`** → fond `--card`, filet `--card-edge`, texte
`--ink`, `box-shadow:none`. Survol et `:focus-visible` → filet `--gold`.

**3. Le sticky devient conditionnel.** Le `@media (pointer:coarse)` cible désormais
`body:not(.has-due) .start:enabled`. Motif : si « Commencer » restait épinglé sous le
pouce en état secondaire, la lampe (en tête de panneau) défilerait hors de vue pendant
que l'action secondaire resterait visible en permanence — on aurait corrigé la
hiérarchie dans l'espace pour la réintroduire dans le temps. La carte de révision n'a
jamais eu besoin d'être collée : elle est en tête, là où l'app s'ouvre. Le sticky avait
été inventé pour « Commencer » précisément parce qu'il vient *après* une longue liste
de chips.

**4. `.review-card:disabled` abandonne son opacité.** `opacity:.55` enfreint DESIGN.md
§5 sur deux plans : il exprime un état inerte par une opacité, et il laisse l'icône
**en or pâli** sur un état inactif. Remplacé par une peau pleine — `color:var(--ink-dim)`
sur le bouton, plus `.review-card:disabled .review-ico{ color:var(--ink-dim) }`. La
flèche est déjà masquée. `opacity` sort de la liste de transition, où elle devient morte.

**5. Piège n°2 respecté.** La transition ajoutée sur `.start` liste ses propriétés
explicitement — `background, border-color, color, box-shadow` — jamais `all`. `.start`
est exactement le composant où `transition:all` fige les longhands `outline-*` et coûte
l'anneau de focus doré sans qu'aucun sélecteur cesse de matcher.

## Hors périmètre — signalé, pas passé sous silence

`.start-hint` est en or (#d4a24c, 0.86rem) et s'affiche quand aucune catégorie n'est
cochée. Il peut donc coexister avec la carte de révision dorée. **Laissé tel quel** :
c'est du texte court, pas une surface — la règle de la lampe vise l'or ambiant et les
états inactifs, ni l'un ni l'autre ici. Consigné pour qu'une critique future sache que
le cas a été vu et tranché, non oublié.

## Composition des états

Les trois registres se composent correctement avec le cas « cartes dues **et** aucune
catégorie cochée » : la règle du secondaire cible `.start:enabled`, donc
`.start:disabled` l'emporte. Le bouton est désactivé, la carte de révision est la lampe,
`.start-hint` guide. Aucun état intermédiaire n'existe.

## Critère d'acceptation

L'UI bouge : WebKit réel est obligatoire (rituel §3), `devices['iPhone 16 Pro']`.
Le verdict se prend à l'œil sur les captures — un sous-agent ne conclut pas à notre
place, il rapporte des chiffres et des images.

1. **Les trois états de « Commencer » capturés côte à côte** — lampe, secondaire actif,
   désactivé. Question tranchée à l'écran : le secondaire actif est-il distinguable du
   désactivé sans hésitation ? Si non, la spec échoue et on remonte au registre.
2. **Anneau de focus doré présent** sur `#start` et `#review-btn` **dans leurs états
   focusables** — 0 défaut. ⚠️ *Critère corrigé après mesure* : il exigeait d'abord les
   états désactivés, or WebKit exclut les boutons `disabled` de l'ordre de tabulation.
   Ils ne peuvent pas porter de `:focus-visible` ; le critère était mal écrit, pas violé.
3. **Aucun pixel d'or dans `#review-btn` désactivé** — l'icône est le point à vérifier.
4. **Le sticky suit l'état** : à `due > 0`, `#start` n'est plus épinglé au défilement ;
   à `due === 0`, il l'est encore.
5. **Trap n°13** : mesuré aussi à **1440 / 1280 / 992 / 768**, et le rendu iPhone montré
   **identique** hors des états visés.

## Rituel

- `node build.js` — régénère le standalone (la couche SRS existe dans les deux fichiers).
- `node verifie_exemples.js` — non requis : aucun contenu ne change.
- `sw.js` — **bumper `VERSION`** : le changement doit atteindre l'appareil au premier
  lancement, pas au second (stale-while-revalidate).
- **Graphe : pas de recalage.** Contre la lettre du rituel §5, qui classe tout
  `app.html` comme structurel — mais aucun nœud ne bouge ici : pas de fonction créée,
  renommée ni supprimée, une instruction ajoutée dans `refreshSrsUi` et quatre règles
  CSS. Le graphe reste exact ; ~235k tokens ne sont pas dus. À dire dans le commit.
- Docs : DESIGN.md §5 (le paragraphe « Défaut connu, non corrigé » devient le registre
  documenté), TODO.md (piste A soldée, « Reprendre ici » recalé).

---

## ➤ LIVRÉ le 2026-07-20 au soir

Vérifié en WebKit réel (`devices['iPhone 16 Pro']`), état « cartes dues » obtenu par
injection propre dans `srs_v1` (12 cartes à échéance passée), pas par un
`classList.add` de complaisance.

| mesure | attendu | relevé |
| --- | --- | --- |
| arrêts de tabulation testés | — | 50 |
| défauts d'anneau de focus | 0 | **0** |
| px dorés sur `#start` secondaire | 0 | **0** / 246 825 |
| px dorés sur `#review-btn` désactivé | 0 | **0** / 344 736 |
| écart R−B max, review désactivé | < 40 | **−17** |
| `opacity` du review désactivé | 1 | **1** |
| `position` de `#start` à `due>0` | `static` | **`static`** |
| `position` de `#start` à `due=0` | `sticky` | **`sticky`** |
| différences de style à 1440/1280/992/768 | 0 hors `pointer:coarse` | **0** |

Verdict à l'œil sur les trois captures au cadrage identique : **le secondaire actif se
distingue du désactivé sans hésitation.** La peau se détache du fond, le texte est à
pleine intensité contre un gris franc. Un renfort non conçu s'y ajoute : le libellé
diffère toujours (« Commencer — 10 cartes » contre « Commencer »), l'état désactivé ne
survenant que faute de sélection, donc ne pouvant jamais porter de compte.

**Deux enseignements dépassent ce chantier.**

1. *Deux jetons nommés différemment ne sont pas nécessairement deux valeurs
   différentes.* La piste bâtissait sa distinction sur `--card-edge` contre `--line` ;
   ils diffèrent de deux points par canal. À vérifier avant de fonder quoi que ce soit
   sur un écart de jetons.
2. *Un critère d'acceptation peut être mal écrit sans être violé.* Exiger un
   `:focus-visible` sur un bouton `disabled` demande à WebKit une chose qu'il ne fait
   pas. Le distinguer d'un vrai défaut est ce qui sépare une vérification d'un rituel.
