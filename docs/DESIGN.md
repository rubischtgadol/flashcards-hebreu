---
name: Flashcards Hébreu
description: Boîte à outils d'apprentissage de l'hébreu moderne pour francophones — carnet + flashcards, hors-ligne, zéro compte.
colors:
  nuit-encre: "#12181f"
  nuit-encre-claire: "#161e28"
  carte: "#1a222b"
  bord-de-carte: "#2c3844"
  parchemin: "#ece7dd"
  parchemin-estompe: "#9aa3ac"
  or-ancien: "#d4a24c"
  or-tendre: "#e6c68a"
  encre-sur-or: "#1a1206"
  vert-juste: "#5bbd7a"
  rouge-a-revoir: "#d96a5b"
  filet: "#2a3440"
  ombre: "#000000"
  voile-audio: "rgba(0,0,0,.18)"
  encre-sur-vert: "#0a1a0f"
  encre-sur-rouge: "#1a0d0a"
typography:
  display:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "3.6rem"
    fontWeight: 400
    lineHeight: 1.15
  headline:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "2.4rem"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Assistant, Arial Hebrew, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 700
    letterSpacing: "0.12em"
  body:
    fontFamily: "Assistant, Arial Hebrew, Helvetica Neue, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, Courier New, monospace"
    fontSize: "0.88rem"
    fontWeight: 400
  cursive:
    fontFamily: "Playpen Sans Hebrew, Segoe Script, Comic Sans MS, cursive"
    fontSize: "3.2rem"
    fontWeight: 300
  cursive-mobile:
    fontFamily: "Playpen Sans Hebrew, Segoe Script, Comic Sans MS, cursive"
    fontSize: "2.8rem"
    fontWeight: 300
  score:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "3.4rem"
    fontWeight: 400
  phrase-he:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "2.15rem"
    lineHeight: 1.45
  inflexion:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "2rem"
    lineHeight: 1.1
  sous-hebreu:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "1.9rem"
  inflexion-compacte:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "1.7rem"
  marque:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "1.5rem"
    fontWeight: 700
  hebreu-rang:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "1.3rem"
  sous-titre:
    fontFamily: "Assistant, Arial Hebrew, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.15rem"
  saisie:
    fontFamily: "Assistant, Arial Hebrew, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.1rem"
  corps-ui:
    fontFamily: "Assistant, Arial Hebrew, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
  controle:
    fontFamily: "Assistant, Arial Hebrew, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
  petite:
    fontFamily: "Assistant, Arial Hebrew, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8rem"
  legende:
    fontFamily: "Assistant, Arial Hebrew, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.76rem"
  carnet-titre:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "2.3rem"
    fontWeight: 700
  carnet-vedette:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "1.6rem"
  carnet-compagnon:
    fontFamily: "Frank Ruhl Libre, David Libre, Times New Roman, serif"
    fontSize: "1.45rem"
  carnet-micro:
    fontFamily: "JetBrains Mono, Courier New, monospace"
    fontSize: "0.7rem"
    letterSpacing: "0.14em"
rounded:
  kbd: "4px"
  touche: "9px"
  bouton-discret: "10px"
  rang: "11px"
  controle: "12px"
  revision: "14px"
  panneau: "16px"
  carte: "20px"
  pilule: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "22px"
components:
  button-primary:
    backgroundColor: "{colors.or-ancien}"
    textColor: "{colors.encre-sur-or}"
    rounded: "{rounded.controle}"
    padding: "14px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.parchemin}"
    rounded: "{rounded.pilule}"
    padding: "7px 13px"
  chip-selected:
    backgroundColor: "{colors.or-ancien}"
    textColor: "{colors.encre-sur-or}"
    rounded: "{rounded.pilule}"
    padding: "7px 13px"
  button-good:
    backgroundColor: "{colors.carte}"
    textColor: "{colors.vert-juste}"
    rounded: "{rounded.controle}"
    padding: "13px"
  button-again:
    backgroundColor: "{colors.carte}"
    textColor: "{colors.rouge-a-revoir}"
    rounded: "{rounded.controle}"
    padding: "13px"
  input-field:
    backgroundColor: "{colors.nuit-encre-claire}"
    textColor: "{colors.parchemin}"
    rounded: "{rounded.controle}"
    padding: "13px 15px"
  quiz-choice:
    backgroundColor: "{colors.carte}"
    textColor: "{colors.parchemin}"
    rounded: "{rounded.controle}"
    padding: "14px 16px"
  porte:
    backgroundColor: "{colors.carte}"
    textColor: "{colors.parchemin}"
    rounded: "{rounded.carte}"
    padding: "22px 22px 20px"
---

# Design System : Flashcards Hébreu

## 1. Overview

**Creative North Star : « Le carnet d'étude du soir »**

Tout le système découle d'une scène : on révise son hébreu le soir, à la lampe, dans un carnet qu'on aime rouvrir. Le fond est une nuit d'encre bleutée, le texte un parchemin doux, et l'or n'est pas un décor — c'est la lumière de la lampe, posée uniquement sur ce qui compte : l'hébreu de la marque, l'action principale, la sélection en cours. L'ambiance est calme, chaleureuse, studieuse ; l'interface s'efface pour que les caractères hébreux et leur nikoud restent la vedette.

Ce système rejette explicitement trois familles (les anti-références de PRODUCT.md) : la gamification façon Duolingo (mascottes, confettis, streaks), l'esthétique SaaS générique (dégradés violets, cards partout), et le manuel scolaire austère (sec, gris, intimidant). La chaleur vient de l'or et des sérifs hébraïques, jamais d'artifices.

Le carnet (`vocabulaire_hebreu.html`) est la **référence visuelle** ; l'app (`app.html`) et le portail (`index.html`) en héritent. Le bloc `:root` est strictement identique dans les trois fichiers — **par construction** : sa source unique est `src/tokens.css`, que le build injecte dans le carnet, dans l'app **et dans le portail**. Plus aucune copie n'est tenue à la main ; `verifieCharte()` échoue si une des trois pages perd les jetons ou ouvre un `:root` de plus que prévu. Le portail est une **porte**, pas un troisième univers, et il s'ouvre en deux temps : un accueil plein écran — le salut personnalisé très grand en or tendre (« Ruben vous souhaite la bienvenue ! » ou sa version hébraïque, voix display Frank Ruhl), le א de l'icône en glyphe vectoriel doré dessous, et **deux ménorahs à sept branches** (SVG inline, trait or ancien, flammes or tendre, halo qui respire) qui éclairent les côtés — la règle de la lampe prise au pied de la lettre ; un toucher pour entrer (sans JS, cet écran n'existe pas et les portes sont directement là). Puis le choix — deux portes **strictement égales** dans les couches de la nuit d'encre, aucune n'étant « sélectionnée » d'avance ; l'or n'arrive qu'au survol et sur les petits liens d'action, l'hébreu de chaque porte en Frank Ruhl vedette.

**Key Characteristics:**
- Sombre par vocation (étude du soir), jamais par mode.
- L'hébreu toujours en sérif Frank Ruhl Libre, toujours plus grand que sa traduction.
- Or réservé à la lumière : actions, sélection, identité — environ 10 % de l'écran.
- Plat par défaut ; une seule vraie ombre, sous la flashcard.
- Base typographique généreuse (22px) : lisibilité du nikoud avant densité.

## 2. Colors : Nuit d'encre & Or ancien

Une nuit bleutée en quatre couches tonales, éclairée par un or ancien et lue en parchemin.

### Primary
- **Or ancien** (#d4a24c) : la lumière de la lampe. Actions principales (dégradé vers l'or tendre), chips sélectionnées, hébreu de la marque, titres de sections, focus des champs, barre de progression. Le texte posé sur l'or est toujours **Encre sur or** (#1a1206), jamais blanc.
- **Or tendre** (#e6c68a) : haut des dégradés d'or, écriture cursive hébraïque, accents chaleureux secondaires.

### Secondary
- **Vert juste** (#5bbd7a) : uniquement le feedback « bonne réponse » (bordures, verdicts, bouton « Je savais »).
- **Rouge à revoir** (#d96a5b) : uniquement le feedback « à revoir ». Jamais décoratifs ni l'un ni l'autre.

### Neutral
- **Nuit d'encre** (#12181f) : le fond de la pièce (corps de page, en dégradé radial doux avec la nuit claire).
- **Nuit d'encre claire** (#161e28) : deuxième couche — champs, rangées, fonds de listes.
- **Carte** (#1a222b) : troisième couche — panneaux, flashcard, boutons posés.
- **Bord de carte** (#2c3844) : bordure des surfaces élevées.
- **Filet** (#2a3440) : bordure des contrôles au repos et séparateurs.
- **Parchemin** (#ece7dd) : le texte courant — l'encre claire du carnet.
- **Parchemin estompé** (#9aa3ac) : texte secondaire, translittérations, indices. Réservé aux petits textes d'appoint, jamais au contenu d'étude.

### Named Rules
**La règle de la lampe.** L'or est une lumière rare : actions primaires, sélection, identité — jamais plus d'environ 10 % de l'écran. Si l'or devient un fond ambiant, la lampe éblouit et n'éclaire plus rien.

*Le test de la lampe* : avant de teinter une surface d'or au repos, répondre « action, sélection ou identité ? ». Un séparateur de partie, un encadré pédagogique, une pastille numérotée n'en sont aucun des trois — l'emphase d'un contenu se dit par la position et le titre, jamais par la lumière, et l'or ne subsiste alors que sur le petit repère (numéro de partie, titre d'encadré, chiffre d'étape). Hors de la carte « Révision du jour » — licenciée parce qu'elle *est* l'action encouragée — **aucune surface n'est teintée d'or au repos dans les trois fichiers**.

**La règle des couches.** La profondeur se dit d'abord par la couleur : nuit d'encre → nuit claire → carte, chaque couche bordée d'un filet. On ne saute jamais une couche et on n'invente pas de cinquième gris.

*Corollaire* : un élément **imbriqué** monte d'une couche, il ne se creuse pas d'un voile noir. Pour assombrir ou éclaircir, on change de couche déclarée ; on ne superpose jamais de noir transparent — un `rgba(0,0,0,…)` posé en fond est un cinquième gris inventé. Et un même contenu porte le même fond partout : les deux familles d'exemples du carnet vivent sur la couche `carte`.

## 3. Typography

**Display Font :** Frank Ruhl Libre (fallback David Libre, Times New Roman) — tout l'hébreu et les grands mots français des cartes.
**Body Font :** Assistant (fallback Arial Hebrew, Helvetica Neue) — toute l'interface.
**Label/Mono Font :** JetBrains Mono — translittérations, compteurs, raccourcis `kbd`.
**Cursive :** Playpen Sans Hebrew (300) — l'écriture manuscrite israélienne, toujours en or tendre.

**Character :** un sérif hébraïque solennel qui porte le contenu, un sans-serif discret qui porte l'outil, une mono qui porte la prononciation. Trois voix, trois rôles, aucune confusion.

### Hierarchy
- **Display** (3.6rem, lh 1.15, RTL) : le mot hébreu sur la carte — l'élément le plus grand de tout l'écran. Phrases : 2.15rem. Mobile ≤480px : 3.2rem.
- **Headline** (600, 2.4rem) : le mot français sur la carte. Phrases : 1.5rem.
- **Title** (700, 0.84rem, capitales, espacement 0.12em, or ancien) : les titres de sections **dépliées** du panneau (« Mode », « Sens de la carte », « Écriture au recto », et à l'intérieur du pli avancé « Ordre », « Longueur », « Prononciation »). Les capitales espacées sont la voix des *étiquettes de repère* — toujours en or, toujours minuscules face au contenu. ⚠️ **Un titre qui devient la rangée d'un pli quitte cette voix** — voir « Le pli » ci-dessous ; c'est pourquoi « Catégories » et « Niveau » n'y figurent plus. Emplois déclarés : les titres de sections dépliées du panneau, la catégorie au sommet de la carte (`.face .eyebrow`, 0.8rem/0.14em), la pilule de catégorie des résultats de recherche (`.sr-cat`, 0.76rem/0.08em), le titre du tiroir de détail (`.srd-title`, 0.76rem/0.1em) et — **décision de charte** — les deux étiquettes de repère du carnet : les en-têtes de colonnes des tables (`thead th`) et les sous-thèmes de section (`.subtheme`, ×39 : « Famille & personnes », « Corps »…). Un système de repères nommé, pas un réflexe décoratif ; aucun emploi supplémentaire sans décision de charte.
- **Repère-mono** (JetBrains Mono 400, 0.7rem, capitales, espacement 0.14em) : le repère *structurel*, celui qui situe dans le document plutôt que d'étiqueter un contenu — les groupes du sommaire (`.toc-group-label`, parchemin estompé) et les numéros de partie (`.part-num`, or ancien). La couleur n'appartient pas à la voix : elle suit la règle de la lampe au cas par cas. **Exception nommée** : « Révision du jour » a **quitté** cette voix pour la voix display (`.panel h2.lead` — Frank Ruhl Libre 1.5rem, pas de capitales, parchemin, pas d'or). Motif : si les dix titres du panneau portaient tous la voix Title, l'action que toute la couche SRS existe pour encourager pèserait exactement autant que « Écriture au recto ». Ce n'est pas un cinquième emploi de la voix Title, c'est un titre qui en sort — parce qu'il n'étiquette pas un réglage, il annonce une action. Aucun or ajouté : la carte de révision porte déjà la seule teinte dorée au repos.
- **Body** (22px de base, Assistant) : interface et contenus. Les contrôles descendent vers 0.9–1.1rem.
- **Label** (JetBrains Mono, 0.82–1.1rem, LTR, parchemin estompé) : translittérations, compteurs de session, étiquettes d'inflexions.

### Named Rules
**La règle des trois voix.** Frank Ruhl Libre pour l'hébreu et les grands mots, Assistant pour l'outil, JetBrains Mono pour la translittération. Aucune quatrième famille, jamais de sérif dans les boutons.

**La règle de la vedette.** À l'écran, l'hébreu est toujours plus grand que sa traduction et que tout élément d'interface. Si un contrôle rivalise visuellement avec le mot hébreu, le contrôle a tort.

**La rampe du carnet, et le socle qu'elle corrige.** La rampe existe parce que le socle des `rem` ne fait pas ce qu'on croit : il faut connaître la cause avant de toucher aux valeurs.

⚠️ **`font-size:22px` est posé sur `body`, jamais sur `html` — dans les trois fichiers.** Il ne déplace donc **pas** la racine des `rem` : **1rem vaut 16px**, mesuré en WebKit. Seul le texte qui ne déclare **rien** hérite réellement des 22px (`.steps li`, `.tip p`, la prose nue).

**Ne pas « corriger » en déplaçant le 22px sur `html`** : cela multiplierait chaque `rem` par 1,375 ici *comme dans `app.html`*, dont les tailles sont réglées sur ce qu'elles rendent vraiment et validées par plusieurs critiques.

La rampe du carnet vit donc dans un **second bloc `:root`, local au fichier** — le premier reste le jeu de jetons partagé, identique au caractère près entre les trois fichiers (§6). Huit pas, resserrés en haut parce que l'hébreu demande une gradation fine, plus ouverts en bas :

| Jeton | Valeur | Rendu | Rôle |
|---|---|---|---|
| `--pas-titre` | 2.3rem | 36,8px | titre de page |
| `--pas-vedette` | 1.6rem | 25,6px | hébreu vedette, titres de section |
| `--pas-compagnon` | 1.45rem | 23,2px | cursive, français de partie |
| `--pas-hebreu-2` | 1.3rem | 20,8px | hébreu secondaire (exemples) |
| `--pas-glose` | 1.15rem | 18,4px | français attaché à un mot, titres de bloc |
| `--pas-corps` | 1rem | 16px | prose, interface, translittération |
| `--pas-petite` | 0.84rem | 13,4px | légendes, voix Title, translittération d'exemple |
| `--pas-micro` | 0.7rem | 11,2px | voix Repère-mono |

**Aucune taille littérale hors de cette rampe.** Exception unique et nommée : l'hébreu inséré dans la prose française garde un `em` (`1.15em`), parce que son rôle est « un cran au-dessus de ce qui m'entoure » quel que soit le contexte — un pas absolu le casserait. Il produit trois valeurs dérivées (25,3 / 21,2 / 15,5px) qui tombent d'elles-mêmes près des pas voisins.

*Deux corollaires* : (a) `body` porte `line-height:1.55` — l'héritage `normal` (~1,2) est trop serré pour du nikoud, qui se compose **sous** la ligne de base ; (b) deux pas voisins de la hiérarchie s'écartent d'un vrai pas (`.part-name` / `.part-he`) — une hiérarchie qu'on ne voit pas n'est pas une hiérarchie.

**La règle des deux colonnes (carnet).** La prose se lit dans une colonne bornée (confort : 45–75 caractères par ligne) ; les tables, l'en-tête et le sommaire vivent dans un cadre plus large. ⚠️ Un défaut de largeur n'existe qu'en desktop — le viewport du téléphone borne tout seul, et le banc iPhone ne le voit pas (piège n°13) : toute retouche de ces valeurs se mesure aux largeurs bureau.

Deux largeurs, dans un **troisième bloc `:root`** local au fichier (le premier reste le jeton partagé, le second la rampe — les trois ne se fusionnent pas) :

| Jeton | Valeur | Rendu | Rôle |
|---|---|---|---|
| `--colonne` | 28rem | 448px | prose : 67 caractères par ligne en médiane (50–69 mesuré) |
| `--colonne-large` | 56rem | 896px | cadre : tables, en-tête, sommaire |

Trois règles tiennent ces valeurs :

⚠️ **Une colonne se calibre sur l'avance moyenne réelle de la prose, jamais sur la largeur d'un chiffre.** Le « 0 » d'Assistant fait 7,87px, la prose française avance de **6,63px** par caractère : 19 % d'écart — de quoi annoncer 69 caractères par ligne et en rendre 82. Une valeur déduite n'est pas une valeur vue à l'écran.

⚠️ **`--colonne-large` est un plancher mesuré, pas un confort.** Les tables s'y posent pleines (`table{width:100%}`) ; le resserrer en met plusieurs en défilement horizontal — leur `min-width:640px` est lui aussi un plancher, qui ne joue que sur mobile. Et un chiffre de largeur consigné dans la prose se périme en silence, aucune commande ne le surveille : à **remesurer** (suite de mise en page, RITUEL.md § Outillage) après tout lot de vocabulaire.

⚠️ **La largeur d'une table est la somme des min-contents de ses colonnes, jamais la largeur d'un contenu.** Une colonne est bornée par une **pile, pas par un pic** — rogner son contenu le plus large ne rend que quelques pixels avant que le suivant reprenne la main — et `white-space:normal` ne libère rien sur un mot sans espace : une translittération ne se coupe pas en pleine syllabe. La garde éditoriale qui en découle : **une forme conjuguée dont la translittération dépasse ~90px ne tient pas dans une table à 5 colonnes** ; le standard interdisant de la raccourcir, c'est le mot qui change (un synonyme au `tr` plus court).

**Un titre prend le cadre s'il porte un filet ET s'il ouvre sur un objet au cadre** — les deux conditions. Le filet n'est pas un ornement : l'œil le lit comme la borne du groupe, et un trait en désaccord avec son contenu affiche ce désaccord **dans les deux sens**. Un sous-thème dont le filet s'arrête à 448px au-dessus d'une table de 896px se lit comme un défaut d'alignement (17 cas) ; le même filet mené à 896px au-dessus d'une simple liste restée à 448px est le même défaut retourné (4 cas). D'où `main > .subtheme:has(+ .table-wrap)`, et non un `.subtheme` global. Restent sur la colonne : les `h2` (ils portent un filet, mais ouvrent sur de la prose dans 27 cas sur 27 — élargis, ils se lisent comme un titre qui a glissé) et `.gram-title`/`.ex-title` (pas de filet, donc rien qui prétende borner ; l'œil les lit comme des légendes).

⚠️ **Piège de cascade propre à ce bloc** : `main > *:not(.table-wrap)` pèse 0,1,1 et fait **plancher de spécificité**. Tout sélecteur d'élément nu qui voudrait le contredire (`main > h2`, `main > ol`…) est ignoré **en silence**. Une règle inerte est pire qu'une règle absente : elle attend qu'on réordonne le bloc pour s'appliquer d'un coup.

## 4. Elevation

Le système est **plat, à une exception près**. La profondeur vient des couches tonales et des filets (règle des couches), pas des ombres. Une seule ombre portée existe : sous la flashcard, l'objet qu'on tient en main (`box-shadow: 0 20px 50px -22px #000, inset 0 1px 0 rgba(255,255,255,.03)`). Le bouton de démarrage porte une lueur d'or discrète (`0 6px 18px -8px` or ancien) — c'est une lumière, pas une élévation. Les dégradés de surface (radial du fond, linéaires très courts sur panneaux et carte) donnent le modelé de la lampe ; ils restent dans la même famille de teintes.

### Named Rules
**La règle de la carte unique.** Seule la flashcard a droit à une vraie ombre portée. Panneaux, chips, champs, choix de QCM restent plats : bordure + couche tonale. Ajouter une ombre à un deuxième objet, c'est retirer sa singularité au premier.

## 5. Components

Caractère commun : **discrets jusqu'à l'action**. Au repos, un contrôle est transparent ou posé sur sa couche, bordé d'un filet. Le survol amène la bordure à l'or ; la sélection et l'action principale remplissent d'or. Transitions courtes (120–150 ms, ease), `prefers-reduced-motion` respecté globalement.

### Buttons
- **Shape :** coins nets et amicaux (12px).
- **Primary** (Commencer, Vérifier, Suivant) : dégradé d'or vertical (or tendre → or ancien), texte Encre sur or 700, padding 14px, pleine largeur dans les panneaux.
- **Hover / Focus :** bordure vers l'or ancien ; champs : bordure or au focus, pas de glow. L'anneau global est `outline:2px solid var(--gold)` **et rien d'autre** : une règle `:focus-visible` ne doit **jamais** poser de `border-radius`, car ce rayon ne décore pas l'anneau — il redessine l'élément tant qu'il est focalisé, et le fait sauter d'une forme à l'autre. L'outline suit déjà le rayon propre de l'élément. (`app.html` est l'idiome de référence.)
- **Ghost** (Passer, contrôles secondaires) : fond transparent, filet, texte estompé ; survol : bordure et texte or.
- **Verdict** (Je savais / À revoir) : posés sur la couche carte, bordure et texte vert juste / rouge à revoir ; le survol inverse (fond plein, texte encre-sur-vert #0a1a0f / encre-sur-rouge #1a0d0a — jamais de blanc sur couleur).
- **Discrets** (Quitter, Corriger, Réessayer, boutons fantômes) : rayon 10px (`bouton-discret`), filet, texte estompé.

### Chips
- **Style :** pilule (999px), fond transparent, filet, texte parchemin, 7px 13px.
- **State :** sélectionnée = or ancien plein + Encre sur or 600 (`aria-pressed="true"`). Le compteur de cartes s'affiche en opacité réduite dans la chip.

### Cards / Containers
- **Corner Style :** flashcard 20px, panneaux 16px, carte de révision 14px, rangées de liste 11px, boutons discrets 10px.
- **Background :** dégradés courts carte → nuit claire.
- **Shadow Strategy :** voir la règle de la carte unique.
- **Border :** toujours 1px bord-de-carte (surfaces) ou filet (contrôles).
- **Internal Padding :** panneaux 16px 15px ; face de carte 44px 22px 40px.

### Inputs / Fields
- **Style :** nuit d'encre claire, filet 1px, 12px de rayon, texte 1rem+.
- **Focus :** bordure or ancien (150 ms).
- **Verdict :** bordure vert juste (`.ok`) ou rouge à revoir (`.no`) après correction.

### Navigation
Pas de barre de navigation : l'app est un flux setup → session → score. Le retour est un bouton « Quitter » discret (couche carte, filet, texte estompé) ; la progression est une fine barre d'or (5px, pilule) + compteur mono.

### Le pli
Une forme unique, portée par un `<details>` natif : rangée posée sur la nuit claire, filet, rayon 12px, chevron qui pivote à l'ouverture, résumé estompé aligné à droite. **Quatre emplois** : « Réglages avancés » (Ordre, Longueur, Prononciation — ce qu'on règle une fois), « Catégories » et « Niveau » (les deux plus gros points de décision de l'écran, **29 chips à eux deux** — 26 catégories et 3 niveaux, les puces vides n'étant pas rendues), plus « Thèmes ».

**Un pli ne cache rien : il condense.** Le résumé de la rangée porte la sélection en cours (« Verbes, Noms », « Toutes (17) », « Aléatoire · 20 cartes · Au clic »). Au-delà de deux entrées on donne un compte plutôt qu'une liste — une liste coupée à l'ellipse en dirait moins que rien, elle mentirait. Corollaire : pas de pli sans résumé véridique.

**La voix suit la fonction, pas l'élément.** À l'*intérieur* d'un pli, les titres gardent la voix Title : le pli range, il ne rétrograde pas. Mais un titre qui **devient la rangée** du pli prend la voix du libellé de pli (Assistant 600, 0.95rem, parchemin, pas de capitales, pas d'or) : ce n'est plus une étiquette qui nomme un groupe visible, c'est la poignée qui l'ouvre. Un groupe replié se lit comme un pli, un groupe déplié comme une section — et l'écran gagne à ce que la différence s'entende. Le titre reste la cible de l'`aria-labelledby` du groupe, donc le nom accessible ne se dédouble pas.

⚠️ **Un pli ne se referme jamais sous le doigt de l'utilisateur.** L'état ouvert/replié se décide au chargement, jamais en réaction à un clic : ouvert tant que la sélection du groupe est vide (là où tout reste à faire), replié sinon. Refermer un groupe au moment où l'on vient d'y choisir quelque chose donne l'impression d'avoir été puni de son geste.

### CTA sous le pouce (tactile)
Sous `pointer:coarse`, « Commencer » est `position:sticky` en bas d'écran **tant qu'il est actif et seul allumé** (`body:not(.has-due) .start:enabled`) : la lampe reste à portée de pouce pendant le défilement, puis reprend sa place naturelle en fin de page (aucun recouvrement final). Il garde sa seule lueur d'or — pas d'ombre supplémentaire. L'indice de sélection vide se place au-dessus du bouton pour rester lisible quand il est collé, et porte `role="status"`.

**Le sticky suit la lampe, pas le bouton**. Épinglé alors que des cartes sont dues, « Commencer » resterait la seule action visible pendant que la carte de révision — la vraie lampe, en tête de panneau — défilerait hors de vue : la hiérarchie corrigée dans l'espace se réintroduirait dans le temps. Donc `static` à `due > 0`, `sticky` à `due === 0`. ⚠️ *Au banc, le test « défiler tout en bas » ne prouve rien ici* — à défilement maximal les deux états montrent le bouton ; c'est le relevé à mi-course qui tranche.

**Les trois registres de « Commencer ».** L'or n'est pas un attribut du bouton, c'est l'état « je suis la lampe » :

| Registre | Fond | Filet | Texte | Lueur | Collant |
| --- | --- | --- | --- | --- | --- |
| Lampe (`due === 0`, actif) | dégradé or | transparent | Encre sur or | oui | oui |
| Secondaire actif (`due > 0`) | `--card` plein | `--card-edge`, or au survol | `--ink` | non | non |
| Désactivé | `none` | `--line` | `--ink-dim` | non | non |

⚠️ **Ce qui sépare le secondaire actif du désactivé n'est PAS le filet.** `--card-edge` (#2c3844) et `--line` (#2a3440) diffèrent de deux points sur chaque canal : ils sont indiscernables à l'écran. La distinction repose entièrement sur **la surface** (peau pleine contre aucune) et **le texte** (parchemin plein contre estompé). Un renfort s'y ajoute : le libellé diffère toujours, l'état désactivé ne pouvant jamais porter de compte de cartes puisqu'il ne survient que faute de sélection. Le registre secondaire n'est pas un idiome inventé — c'est la peau de `.exit`.

**Désactivé, il n'est ni doré ni collant.** Corollaire de la règle de la lampe : `opacity:.4` sur un dégradé d'or ne *retire* pas l'or, il le rend translucide — et laisse le contenu transparaître au travers. Un état inerte prend une **peau pleine et opaque** (`background:none`, filet, texte estompé) et **abandonne le sticky** : il n'a rien à garder sous le pouce tant qu'on ne peut pas l'utiliser. Règle générale : ne jamais exprimer un état désactivé par une opacité posée sur une surface colorée — ni ici, ni sur la carte de révision (`.review-card:disabled` : peau pleine, texte **et icône** estompés, zéro or).

### Clavier hébreu (composant signature)
Disposition israélienne en RTL, touches sur nuit claire avec lettres Frank Ruhl Libre 1.35rem, lettres finales en or tendre, touche active en or plein. C'est un objet d'étude à part entière : il doit rester aussi lisible qu'une carte. **Bureau uniquement** : replié derrière le bouton « Clavier hébreu », et absent sur tactile (`pointer:coarse`) — l'iPhone a son clavier hébreu système, le virtuel n'existe que pour les claviers physiques AZERTY.

### Encadré « attention » (carnet)
`.attention` : filet plein `--line`, rayon 10px, texte parchemin plein. Il annonce un piège de langue (« ⚠️ ces 4 prépositions se collent au mot suivant »).

`.gram-title` : titre de sous-section de grammaire (« שֶׁל — possessif », « לְ — datif »…), voix display en or ancien, 1.05rem.

**Le pointillé ne dit qu'une chose : « rien ici ».** `border:1px dashed` est réservé à `.empty` (section vide après filtrage de la recherche). Un même trait ne peut pas porter deux sens opposés — « rien ici » et « important, à lire » —, ce serait l'inverse d'un signal : les encadrés d'avertissement et le soulignement des sous-thèmes prennent donc le filet plein. Les encadrés d'avertissement et le soulignement des sous-thèmes sont donc passés au filet plein. *`.empty` est réellement instancié* : la recherche à 0 résultat injecte un `p.empty` sous la barre.

### Rangs en cartes (carnet, tables de vocabulaire, ≤ 640 px)

Sous 640 px, les **tables de vocabulaire** — reconnues à leurs exemples embarqués (`.table-wrap:has(ul.exemples)`) — quittent la grille défilante : chaque rang devient une carte pleine largeur (rayon 11px « rang », filet) disposée en **flex-colonne réordonnable** — le mot-vedette d'abord, puis les formes courtes **sur une ligne**, chacune sous son étiquette mono (voix Label : GENRE/PLURIEL, MS/FS/MP/FP — les thead masqués), et **l'exemple EN DESSOUS** : l'ordre de lecture que Ruben attend, pas celui du DOM. Le geste qui le permet : la première cellule se **dissout** (`display:contents`) pour que ses enfants (`he`/`cursive`/`fr`/`ul.exemples`) deviennent les items flex du rang et se laissent replacer par `order` (vedette 1-3, formes 4, exemple 5), **sans toucher au markup dont dépend l'extraction**. Le nombre de colonnes signe toujours la catégorie (3 = Noms, 4 = Adjectifs, 5 = Verbes), donc les étiquettes tiennent en CSS pur. ⚠️ Nuance assumée : une ligne de formes qui déborde la carte **passe à la ligne** plutôt que de défiler — un vrai défilement de sous-ligne exigerait un conteneur d'enrobage que le couplage d'extraction interdit, et un défilement horizontal enfermé dans le vertical est le pire geste tactile. Les **tables de grammaire** (celles sans exemples) gardent leur grille : leur structure *est* la leçon. Le wrap est `direction:rtl` — l'origine de défilement suit la table (une table RTL dans un wrap LTR s'ouvre sur sa fin), pour les cartes comme pour les grilles conservées.

⚠️ **Le piège de `display:contents` : il supprime la boîte, pas l'héritage** (le versant CSS du piège n°16 de CLAUDE.md). La cellule dissoute laisse descendre le `white-space:nowrap` de la règle générique `th,td` vers `.he`, `.cursive`, `.fr` et le contenu de `ul.exemples` — du texte qui doit précisément pouvoir revenir à la ligne, et qui peint hors écran dès que la carte passe en `overflow-x:visible`. La cellule dissoute reçoit donc la même remise à zéro (`white-space:normal`) que ses voisines.

⚠️ **Un débordement de texte se mesure au `Range` sur les nœuds texte, jamais au `getBoundingClientRect()` des éléments** — sous flex, les boîtes rétrécissent comme demandé (`flex-shrink:1`, `min-width:0`) et seul le texte dépasse, sans agrandir le rect de son élément (piège n°16 de CLAUDE.md, versant mesure).

La **barre de recherche du carnet est opaque** (`--bg` plein, ni voile translucide ni `backdrop-filter`) : le glassmorphism est une anti-référence de PRODUCT.md. Le **sommaire est complet par contrat** : **une pilule par `<h2 id>`, sans exception**, en groupes de 3 à 8 — une pilule manquante est un mensonge par omission. Le contrat se contrôle, jamais ne se mémorise : `grep -c '<h2 id=' vocabulaire_hebreu.html` doit égaler `grep -o 'href="#sec-' vocabulaire_hebreu.html | wc -l`.

**La recherche montre des correspondances, pas des leçons** — d'une section retenue, elle garde le titre, les sous-thèmes et les blocs porteurs, et masque notes, encadrés et recettes. **Les titres de section sont indexés**, et cela ne dément pas la règle : un titre qui correspond *est* une correspondance — c'est même exactement ce que montrerait la pilule du sommaire, lequel est justement masqué pendant une recherche. Sans cela, une section cherchée par son nom devenait introuvable **des deux côtés à la fois**. Le cas critique est celui d'une section dont le nom ne vit que dans son titre et sa prose — « Le nikoud » : ses lignes de tableau (« qamats », « dagesh », « shva ») la font trouver, mais sans l'indexation du titre, « nikoud » ne la trouverait pas *et la masquerait*.

### Le palier « ordi » de l'app (≥ 900 px)

L'app est d'abord un objet de téléphone ; sans palier montant, un grand écran ne montre qu'une carte plafonnée et un hébreu perdu dans le vide — **la règle de la vedette énoncée mais non tenue**, faute de prendre la place disponible.

Le palier `min-width:900px` rend les deux choses que le plafond mobile retenait. **La largeur** : colonne 520 → 760 px, carte 420 → 640 px. **La rampe hébraïque**, d'environ +35 % — mot 3,6 → 4,8rem, inflexions 2 → 2,6rem, exemple 1,5 → 2rem, et surtout la translittération d'exemple 0,8 → 1rem, qui tombait à 12,8 px, moitié moins que la ligne française qu'elle accompagne. La correction du mode saisie suit (`.feedback .answer .he` 1,9 → 2,6rem) : c'est la réponse qu'on est venu lire, elle ne peut pas être le plus petit hébreu de l'écran.

**Les contrôles, eux, ne bougent pas.** Les agrandir avec l'hébreu reviendrait à ne rien avoir hiérarchisé : la règle de la vedette veut un écart, pas une homothétie.

**La hauteur de carte suit le contenu.** Au-delà de 900 px la carte prend ce qu'il lui faut (`height:auto`, `min-height:min(42vh,380px)`) : un plafond rigide réclamerait la moitié de l'écran à moitié vide et pousserait la correction sous la ligne de flottaison — le vide latéral et le débordement vertical sont le même défaut.

**Corollaire structurel, valable à toutes les tailles** : l'étiquette de catégorie et l'indice de la carte sont deux rangées de flux (`.face` en grille `auto 1fr auto`, `#face-content` seul à défiler), jamais des `position:absolute` — un padding qui « réserve leur place » ne vaut que tant que rien ne défile.

**`#face-content{overflow:visible}` au-delà de 900 px.** Là où la carte prend la hauteur de son contenu, il n'y a rien à faire défiler — et `clientHeight`/`scrollHeight` n'arrondissent pas la même fraction du même côté selon le moteur : un seul pixel d'écart fait apparaître une barre de défilement classique sous Windows, flèches comprises, qui vole 15 px au contenu (piège n°17). Le téléphone garde `overflow-y:auto` : son plafond `32vh` rogne pour de vrai.

⚠️ **Un override appartient au fichier de sa base.** Les six fragments CSS de l'app sont concaténés dans l'ordre de `src/app/ordre.json` : un palier écrit dans un fragment ne peut pas surcharger une règle de même sélecteur posée dans un fragment **suivant** — à sélecteur égal le dernier gagne, et une media query n'ajoute aucune spécificité. Une règle inerte est pire qu'une règle absente ; rien ne le mécanise, relire à l'assemblage. C'est le frère CSS de « un fichier ne fait qu'une chose ».

**Deux colonnes : la carte à gauche, ce qu'on en fait à droite.** Le bloc de correction est plus haut que la carte elle-même : empilé dessous, il ne peut pas tenir, quelle que soit la largeur disponible. Au-delà de 900 px, `.study.active` passe donc en grille : `.progress-wrap` enjambe les deux colonnes, `.stage` occupe la première, `.answer-col` la seconde. **420 px à droite**, parce que la translittération d'exemple dicte cette largeur et que 420 px couvre 96,8 % du corpus — au-delà le texte se replie, il n'est jamais tronqué. Pistes en `minmax(0, …fr)` et non en largeurs fixes : à 900 px les deux colonnes doivent se resserrer ensemble plutôt que déborder. ⚠️ Toute retouche de ce palier se confirme sur le navigateur réel du propriétaire, pas seulement au banc (piège n°17).

**Pas de panneau bordé à droite.** Les commandes restent posées sur le fond. La règle de la carte unique veut que la flashcard soit le seul objet à avoir de la présence ; lui opposer une seconde boîte encadrée la lui retirerait. Et les colonnes s'alignent **en haut** : la colonne de droite grandit vers le bas quand la correction apparaît, sans le saut symétrique qu'un centrage produirait.

### Le carnet : la note d'usage et la chasse des sous-titres

**La note d'usage a la voix qu'elle a déjà dans l'app.** Les notes (`note` dans `data/*.json` — « suit un infinitif », « toujours avec la négation ») se rendent en `.note-line` : corps, encre atténuée, italique, sur leur propre rangée du `<li>`, **avant** l'exemple — la règle, puis son illustration. Même nom de classe et même voix que dans l'app : un même contenu ne se lit pas de deux façons selon la page qui le porte. Et **sans surface** : la couche « carte » est déjà prise par l'exemple juste dessous, et une note n'est pas un objet posé sur la rangée, c'est une annotation de la rangée (règle des couches).

⚠️ **Une chasse conçue pour des capitales latines ne va pas à l'hébreu.** `.subtheme` partage la voix de `thead th` — capitales, `letter-spacing:0.12em`. Sept sous-titres commencent par une préposition hébraïque, et l'hébreu ne prend pas la chasse ajoutée : elle disjoint les lettres et décale le nikoud, qui se compose *sous* la ligne de base. Mesuré : la chasse ajoutée fait passer שֶׁל de 15,52 à 18,75 px — **21 % de plus**. La règle rend sa chasse normale au seul hébreu, sans toucher au français du même titre. Les capitales, elles, ne concernaient jamais l'hébreu — c'était déjà sans effet.

### Carte de révision (composant signature)
« Révision du jour » : la seule surface teintée d'or au repos (dégradé 135° d'or à 16 % → 5 %, bordure or). Elle a droit à cette exception parce qu'elle est *l'action* que le système veut encourager chaque jour.

**La règle de la lampe passe aussi à l'échelle de l'écran, pas seulement composant par composant.** Si cette carte **et** « Commencer » sont dorées en même temps quand des cartes sont dues, ce sont deux lumières d'égale intensité, donc aucune hiérarchie ; la voix display gagnée par « Révision du jour » règle la *typographie*, pas la *lumière*. Sous `pointer:coarse` le risque est pire : « Commencer » collé en pied et la carte siégeant en tête, les deux lampes seraient **simultanément à l'écran en permanence**.

**Une seule lampe allumée à la fois, choisie par l'état.** `refreshSrsUi()` connaît le compte des cartes dues et pose `body.has-due` ; le CSS en déduit tout — des cartes dues : la carte de révision est la lampe, « Commencer » cède la lumière (registre secondaire actif, voir « CTA sous le pouce ») et abandonne le sticky ; à `due === 0`, la carte est éteinte et « Commencer » reprend l'or plein.

## 6. Do's and Don'ts

### Do:
- **Do** modifier les tokens **dans `src/tokens.css`, et là seulement** : source unique injectée au build dans les trois pages déployées (carnet, app, portail). Rien à reporter à la main nulle part. Si `--bg`/`--gold` changent, régénérer les icônes et aligner `manifest.webmanifest`.
- **Do** poser **Encre sur or** (#1a1206) sur tout fond or — jamais de blanc sur or.
- **Do** écrire l'hébreu en Frank Ruhl Libre, en RTL, plus grand que tout le reste (règle de la vedette), nikoud net.
- **Do** réserver vert juste et rouge à revoir au seul feedback de réponse.
- **Do** garder les transitions à 120–350 ms, ease, et l'alternative `prefers-reduced-motion` globale — **dans les trois fichiers** : le carnet la porte, et sa garde doit inclure `scroll-behavior:auto` (le `transition:none` global ne couvre pas le défilement doux).
- **Do** énumérer les propriétés animées (`background, color, border-color, opacity`) — **jamais `transition:all`** : le raccourci capture les longhands `outline-*` et WebKit fige alors l'anneau de focus sur les valeurs UA, tout en matchant `:focus-visible`. Piège mesuré (cf. ARCHITECTURE.md § Accessibilité).
- **Do** utiliser JetBrains Mono (LTR) pour toute translittération, au standard maison (`kh`/`ch`/`ts`, `'` pour ayin).
- **Do** écrire les piles de polices **en entier**, jamais `'Frank Ruhl Libre',serif` : les polices Google sont la seule dépendance réseau, donc hors-ligne c'est le fallback qui rend le nikoud — et le `serif` générique le rend nettement moins bien que David Libre. Les **quatre piles normatives**, telles qu'elles s'écrivent dans le code :

  ```css
  'Frank Ruhl Libre','David Libre','Times New Roman',serif
  'Assistant','Arial Hebrew','Helvetica Neue',Arial,sans-serif
  'JetBrains Mono','Courier New',monospace
  'Playpen Sans Hebrew','Segoe Script','Comic Sans MS',cursive
  ```

  Corollaire direct du principe « ça marche dans l'avion ». **Les trois fichiers écrivent les quatre piles en entier** — un `font-family` qui n'a pas au moins deux replis est un défaut.

  ⚠️ Les piles normatives se relèvent **dans le code**, pas dans la charte — c'est le code qui les porte.
- **Do** poser l'anneau `:focus-visible` doré global dans **les trois fichiers** — le carnet le porte aussi (22 arrêts de tabulation mesurés, 0 sans anneau). Un indicateur maison qui contraste bien n'est pas une faute d'accessibilité, mais c'est une rupture de charte : l'anneau doit être le même partout.

### Don't:
- **Don't** introduire de gamification façon Duolingo : mascottes, confettis, XP, streaks culpabilisants (anti-référence PRODUCT.md).
- **Don't** glisser vers l'app SaaS générique : dégradés violets, cards partout, glassmorphism, esthétique start-up interchangeable (anti-référence PRODUCT.md).
- **Don't** retomber dans le manuel scolaire austère : pas d'écrans gris, secs, intimidants (anti-référence PRODUCT.md).
- **Don't** donner une ombre portée à autre chose que la flashcard (règle de la carte unique).
- **Don't** utiliser l'or en fond ambiant ou sur des états inactifs — la lampe éclaire, elle ne tapisse pas (règle de la lampe).
- **Don't** ajouter une quatrième famille de caractères, ni de sérif dans les boutons (règle des trois voix).
- **Don't** ajouter de nouvelle dépendance réseau (script, icône ou image distante) : chaque fichier doit marcher dans l'avion. Seule exception existante : les polices Google Fonts, qui dégradent proprement vers les fallbacks système hors-ligne.
- **Don't** utiliser `border-left` épais comme accent coloré, ni de texte en dégradé (`background-clip: text`).
