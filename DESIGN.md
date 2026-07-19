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

Le carnet (`vocabulaire_hebreu.html`) est la **référence visuelle** ; l'app (`app.html`) et le portail (`index.html`) en héritent. Le bloc `:root` doit rester strictement identique dans les trois fichiers. Le portail est une **porte**, pas un troisième univers, et il s'ouvre en deux temps : un accueil plein écran — le salut personnalisé très grand en or tendre (« Ruben vous souhaite la bienvenue ! » ou sa version hébraïque, voix display Frank Ruhl), le א de l'icône en glyphe vectoriel doré dessous, et **deux ménorahs à sept branches** (SVG inline, trait or ancien, flammes or tendre, halo qui respire) qui éclairent les côtés — la règle de la lampe prise au pied de la lettre ; un toucher pour entrer (sans JS, cet écran n'existe pas et les portes sont directement là). Puis le choix — deux portes **strictement égales** dans les couches de la nuit d'encre, aucune n'étant « sélectionnée » d'avance ; l'or n'arrive qu'au survol et sur les petits liens d'action, l'hébreu de chaque porte en Frank Ruhl vedette.

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

*Test pratique, appris à la mesure le 2026-07-19 sur le séparateur `.part` du carnet* : avant de teinter une surface d'or au repos, il faut pouvoir répondre « action, sélection ou identité ? ». Un séparateur de partie n'est aucun des trois — il était pourtant bordé et teinté d'or, et pesait à l'écran **plus lourd que le vrai bouton d'action situé juste au-dessus de lui**. C'est le symptôme exact de la règle enfreinte : la lampe éclairait le décor et laissait l'action dans l'ombre. Ramené à `--bg2` + `--card-edge`, l'or ne subsistant que sur le numéro de partie. La seule surface teintée d'or au repos que la charte licencie reste la carte « Révision du jour », et précisément parce qu'elle *est* l'action encouragée.

*Le même test appliqué à `.tip` (2026-07-19, décision de Ruben)* : l'encadré « 💡 point clé » du carnet était la **seconde** surface dorée au repos (bordure or à 55 %, dégradé d'or en fond). Il se défendait mieux que `.part` — un point clé est plausiblement ce que la lampe éclaire — mais il échoue au même test : un encadré pédagogique n'est ni une action, ni une sélection, ni l'identité. C'est du **contenu emphatique**, et l'emphase se dit par la position et le titre, pas par la lumière. Ramené lui aussi à `--bg2` + `--card-edge`, l'or ne subsistant que sur le texte de `.tip-title`. Conséquence à retenir : hors de la carte « Révision du jour », **aucune surface n'est teintée d'or au repos dans les trois fichiers**.

**La règle des couches.** La profondeur se dit d'abord par la couleur : nuit d'encre → nuit claire → carte, chaque couche bordée d'un filet. On ne saute jamais une couche et on n'invente pas de cinquième gris.

*Corollaire mesuré le 2026-07-19* : un élément **imbriqué** monte d'une couche, il ne se creuse pas d'un voile noir. Les blocs d'exemples du carnet étaient posés sur `rgba(0,0,0,.14)` — un cinquième gris inventé, qui de surcroît les rendait presque indiscernables de leur rangée. Passés à la couche `carte`, ils se lisent comme la surface posée qu'ils sont, et rejoignent l'encadré `.example` de la grammaire : les deux familles d'exemples du carnet ont enfin le même fond. Règle générale : pour assombrir ou éclaircir, on change de couche déclarée ; on ne superpose pas de noir transparent.

## 3. Typography

**Display Font :** Frank Ruhl Libre (fallback David Libre, Times New Roman) — tout l'hébreu et les grands mots français des cartes.
**Body Font :** Assistant (fallback Arial Hebrew, Helvetica Neue) — toute l'interface.
**Label/Mono Font :** JetBrains Mono — translittérations, compteurs, raccourcis `kbd`.
**Cursive :** Playpen Sans Hebrew (300) — l'écriture manuscrite israélienne, toujours en or tendre.

**Character :** un sérif hébraïque solennel qui porte le contenu, un sans-serif discret qui porte l'outil, une mono qui porte la prononciation. Trois voix, trois rôles, aucune confusion.

### Hierarchy
- **Display** (3.6rem, lh 1.15, RTL) : le mot hébreu sur la carte — l'élément le plus grand de tout l'écran. Phrases : 2.15rem. Mobile ≤480px : 3.2rem.
- **Headline** (600, 2.4rem) : le mot français sur la carte. Phrases : 1.5rem.
- **Title** (700, 0.84rem, capitales, espacement 0.12em, or ancien) : les titres de sections **dépliées** du panneau (« Mode », « Sens de la carte », « Écriture au recto », et à l'intérieur du pli avancé « Ordre », « Longueur », « Prononciation »). Les capitales espacées sont la voix des *étiquettes de repère* — toujours en or, toujours minuscules face au contenu. ⚠️ **Un titre qui devient la rangée d'un pli quitte cette voix** — voir « Le pli » ci-dessous ; c'est pourquoi « Catégories » et « Niveau » n'y figurent plus depuis le 2026-07-19. Emplois déclarés : les titres de sections dépliées du panneau, la catégorie au sommet de la carte (`.face .eyebrow`, 0.8rem/0.14em), la pilule de catégorie des résultats de recherche (`.sr-cat`, 0.76rem/0.08em), le titre du tiroir de détail (`.srd-title`, 0.76rem/0.1em) et — **décision de charte du 2026-07-19** — les deux étiquettes de repère du carnet : les en-têtes de colonnes des tables (`thead th`) et les sous-thèmes de section (`.subtheme`, ×21 : « Famille & personnes », « Corps »…). Un système de repères nommé, pas un réflexe décoratif ; aucun emploi supplémentaire sans décision de charte.

  *Pourquoi le carnet rejoint la liste plutôt que d'en sortir* : `.subtheme` et `thead th` étiquettent exactement ce que la voix Title étiquette — un repère petit, doré, qui nomme un groupe sans rivaliser avec lui. Ils avaient simplement dérivé sur leur propre spec (0.82rem/0.12em et 0.92rem/0.08em) parce que la charte n'avait jamais inventorié le carnet : les quatre emplois d'origine vivaient tous dans `app.html`. Ce n'était donc pas le code qui contredisait la charte, c'était la charte qui avait un angle mort. Les deux sont alignés sur la spec Title exacte.

- **Repère-mono** (JetBrains Mono 400, 0.7rem, capitales, espacement 0.14em) : le repère *structurel*, celui qui situe dans le document plutôt que d'étiqueter un contenu — les groupes du sommaire (`.toc-group-label`, parchemin estompé) et les numéros de partie (`.part-num`, or ancien). La couleur n'appartient pas à la voix : elle suit la règle de la lampe au cas par cas. Voix ajoutée le 2026-07-19 en remplacement de deux specs mono divergentes (0.66rem/0.10em et 0.7rem/0.16em). **Exception nommée (2026-07-19)** : « Révision du jour » a **quitté** cette voix pour la voix display (`.panel h2.lead` — Frank Ruhl Libre 1.5rem, pas de capitales, parchemin, pas d'or). Motif : les dix titres du panneau étaient typographiés à l'identique, si bien que l'action que toute la couche SRS existe pour encourager pesait exactement autant que « Écriture au recto ». Ce n'est pas un cinquième emploi de la voix Title, c'est un titre qui en sort — parce qu'il n'étiquette pas un réglage, il annonce une action. Aucun or ajouté : la carte de révision porte déjà la seule teinte dorée au repos.
- **Body** (22px de base, Assistant) : interface et contenus. Les contrôles descendent vers 0.9–1.1rem.
- **Label** (JetBrains Mono, 0.82–1.1rem, LTR, parchemin estompé) : translittérations, compteurs de session, étiquettes d'inflexions.

### Named Rules
**La règle des trois voix.** Frank Ruhl Libre pour l'hébreu et les grands mots, Assistant pour l'outil, JetBrains Mono pour la translittération. Aucune quatrième famille, jamais de sérif dans les boutons.

**La règle de la vedette.** À l'écran, l'hébreu est toujours plus grand que sa traduction et que tout élément d'interface. Si un contrôle rivalise visuellement avec le mot hébreu, le contrôle a tort.

**La rampe du carnet, et le socle qu'elle corrige (2026-07-19).** `vocabulaire_hebreu.html` déclarait **24 tailles distinctes pour 52 déclarations** (`1.12rem`, `0.92rem`, `0.82rem`, `1.35rem`…). Ce n'était pas de la négligence : c'était le symptôme d'un socle mal compris, et il faut connaître la cause avant de toucher aux valeurs.

⚠️ **`font-size:22px` est posé sur `body`, jamais sur `html` — dans les trois fichiers.** Il ne déplace donc **pas** la racine des `rem` : **1rem vaut 16px**, mesuré en WebKit. Le commentaire du carnet qui affirmait « tout le reste est en rem/em et suit » était faux, et c'est lui qui expliquait la dérive — chaque valeur avait été poussée un peu plus haut, à tâtons, contre une base qui ne réagissait pas comme annoncé. Seul le texte qui ne déclare **rien** hérite réellement des 22px (`.steps li`, `.tip p`, la prose nue).

**Ne pas « corriger » en déplaçant le 22px sur `html`** : cela multiplierait chaque `rem` par 1,375 ici *comme dans `app.html`*, dont les tailles sont réglées sur ce qu'elles rendent vraiment et validées par plusieurs critiques. C'est le commentaire qui était faux, pas le CSS.

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

*Deux corollaires appris en mesurant, le même jour* : (a) le carnet n'avait **aucun `line-height`** et héritait de `normal` (~1,2) — trop serré pour du nikoud, qui se compose **sous** la ligne de base ; `1.55` est passé sur `body`, valeur que `.steps li` et `.tip p` avaient déjà choisie chacun de son côté sans qu'elle remonte jamais à la racine. (b) `.part-name` (1.45rem) et `.part-he` (1.5rem) n'étaient séparés que de **1,1 px** : l'intention — la règle de la vedette — était écrite mais invisible. Les deux ont été **écartés d'un vrai pas** plutôt que fusionnés. Une hiérarchie qu'on ne voit pas n'est pas une hiérarchie.

## 4. Elevation

Le système est **plat, à une exception près**. La profondeur vient des couches tonales et des filets (règle des couches), pas des ombres. Une seule ombre portée existe : sous la flashcard, l'objet qu'on tient en main (`box-shadow: 0 20px 50px -22px #000, inset 0 1px 0 rgba(255,255,255,.03)`). Le bouton de démarrage porte une lueur d'or discrète (`0 6px 18px -8px` or ancien) — c'est une lumière, pas une élévation. Les dégradés de surface (radial du fond, linéaires très courts sur panneaux et carte) donnent le modelé de la lampe ; ils restent dans la même famille de teintes.

### Named Rules
**La règle de la carte unique.** Seule la flashcard a droit à une vraie ombre portée. Panneaux, chips, champs, choix de QCM restent plats : bordure + couche tonale. Ajouter une ombre à un deuxième objet, c'est retirer sa singularité au premier.

## 5. Components

Caractère commun : **discrets jusqu'à l'action**. Au repos, un contrôle est transparent ou posé sur sa couche, bordé d'un filet. Le survol amène la bordure à l'or ; la sélection et l'action principale remplissent d'or. Transitions courtes (120–150 ms, ease), `prefers-reduced-motion` respecté globalement.

### Buttons
- **Shape :** coins nets et amicaux (12px).
- **Primary** (Commencer, Vérifier, Suivant) : dégradé d'or vertical (or tendre → or ancien), texte Encre sur or 700, padding 14px, pleine largeur dans les panneaux.
- **Hover / Focus :** bordure vers l'or ancien ; champs : bordure or au focus, pas de glow. L'anneau global est `outline:2px solid var(--gold)` **et rien d'autre** : une règle `:focus-visible` ne doit **jamais** poser de `border-radius`, car ce rayon ne décore pas l'anneau — il redessine l'élément tant qu'il est focalisé, et le fait sauter d'une forme à l'autre. L'outline suit déjà le rayon propre de l'élément. (Le portail en portait un, supprimé le 2026-07-19 ; `app.html` est l'idiome de référence.)
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
Une forme unique, portée par un `<details>` natif : rangée posée sur la nuit claire, filet, rayon 12px, chevron qui pivote à l'ouverture, résumé estompé aligné à droite. **Trois emplois** (2026-07-19) : « Réglages avancés » (Ordre, Longueur, Prononciation — ce qu'on règle une fois), « Catégories » et « Niveau » (les deux plus gros points de décision de l'écran, 17 chips à eux deux). L'écran passe de 1278 à 874 px, et « Commencer » remonte.

**Un pli ne cache rien : il condense.** Le résumé de la rangée porte la sélection en cours (« Verbes, Noms », « Toutes (17) », « Aléatoire · 20 cartes · Au clic »). Au-delà de deux entrées on donne un compte plutôt qu'une liste — une liste coupée à l'ellipse en dirait moins que rien, elle mentirait. Corollaire : pas de pli sans résumé véridique.

**La voix suit la fonction, pas l'élément.** À l'*intérieur* d'un pli, les titres gardent la voix Title : le pli range, il ne rétrograde pas. Mais un titre qui **devient la rangée** du pli prend la voix du libellé de pli (Assistant 600, 0.95rem, parchemin, pas de capitales, pas d'or) : ce n'est plus une étiquette qui nomme un groupe visible, c'est la poignée qui l'ouvre. Un groupe replié se lit comme un pli, un groupe déplié comme une section — et l'écran gagne à ce que la différence s'entende. Le titre reste la cible de l'`aria-labelledby` du groupe, donc le nom accessible ne se dédouble pas.

⚠️ **Un pli ne se referme jamais sous le doigt de l'utilisateur.** L'état ouvert/replié se décide au chargement, jamais en réaction à un clic : ouvert tant que la sélection du groupe est vide (là où tout reste à faire), replié sinon. Refermer un groupe au moment où l'on vient d'y choisir quelque chose donne l'impression d'avoir été puni de son geste.

### CTA sous le pouce (tactile)
Sous `pointer:coarse`, « Commencer » est `position:sticky` en bas d'écran **tant qu'il est actif** (`.start:enabled`) : la lampe reste à portée de pouce pendant le défilement, puis reprend sa place naturelle en fin de page (aucun recouvrement final). Il garde sa seule lueur d'or — pas d'ombre supplémentaire. L'indice de sélection vide se place au-dessus du bouton pour rester lisible quand il est collé, et porte `role="status"`.

**Désactivé, il n'est ni doré ni collant.** Corollaire de la règle de la lampe, appris à la mesure le 2026-07-19 : `opacity:.4` sur un dégradé d'or ne *retire* pas l'or, il le rend translucide — le bouton restait doré, laissait le contenu de la page transparaître au travers (libellé et texte d'aide superposés, les deux illisibles) et, collant au premier écran, recouvrait quatre chips de catégories en interceptant leurs taps. Un état inerte prend donc une **peau pleine et opaque** (`background:none`, filet, texte estompé) et **abandonne le sticky** : il n'a rien à garder sous le pouce tant qu'on ne peut pas l'utiliser. Règle générale : ne jamais exprimer un état désactivé par une opacité posée sur une surface colorée.

### Clavier hébreu (composant signature)
Disposition israélienne en RTL, touches sur nuit claire avec lettres Frank Ruhl Libre 1.35rem, lettres finales en or tendre, touche active en or plein. C'est un objet d'étude à part entière : il doit rester aussi lisible qu'une carte. **Bureau uniquement** : replié derrière le bouton « Clavier hébreu », et absent sur tactile (`pointer:coarse`) — l'iPhone a son clavier hébreu système, le virtuel n'existe que pour les claviers physiques AZERTY.

### Encadré « attention » (carnet)
`.attention` : filet plein `--line`, rayon 10px, texte parchemin plein. Il annonce un piège de langue (« ⚠️ ces 4 prépositions se collent au mot suivant »). Il existait en quatre exemplaires d'un même `style=` inline avant le 2026-07-19 — un composant qui s'ignorait.

`.gram-title` : titre de sous-section de grammaire (« שֶׁל — possessif », « לְ — datif »…), voix display en or ancien, 1.05rem. Même histoire — 5 duplications d'un même `style=` inline, repérées le 2026-07-19 en relisant le diff, pas par l'audit.

**Le pointillé ne dit qu'une chose : « rien ici ».** `border:1px dashed` est réservé à `.empty` (section vide après filtrage de la recherche). Il portait auparavant deux sens opposés — « rien ici » et « important, à lire » — ce qui est exactement l'inverse d'un signal. Les encadrés d'avertissement et le soulignement des sous-thèmes sont donc passés au filet plein.

### Carte de révision (composant signature)
« Révision du jour » : la seule surface teintée d'or au repos (dégradé 135° d'or à 16 % → 5 %, bordure or). Elle a droit à cette exception parce qu'elle est *l'action* que le système veut encourager chaque jour.

**Défaut connu, non corrigé (relevé le 2026-07-19)** : quand des cartes sont dues, cette carte **et** « Commencer » sont dorées en même temps — deux lumières d'égale intensité sur le même écran, donc aucune hiérarchie. C'est la règle de la lampe prise en défaut à l'échelle de l'écran, là où on l'a jusqu'ici appliquée composant par composant. La voix display gagnée par « Révision du jour » a réglé la *typographie*, pas la *lumière*. Correctif proposé et ses pièges : TODO.md, « Pistes de design ouvertes », piste A. Principe visé : **une seule lampe allumée à la fois, choisie par l'état** (des cartes dues → la révision ; sinon « Commencer »).

Second défaut au même endroit : `.review-card:disabled` porte encore un `opacity:.55`, alors que la charte interdit désormais d'exprimer un état inerte par une opacité. Le cas est moins grave que celui de « Commencer » en juillet — le fond doré *est* remplacé par `--bg2`, donc pas d'or translucide — mais le texte et l'icône pâlissent au lieu de prendre une peau pleine.

## 6. Do's and Don'ts

### Do:
- **Do** garder le bloc `:root` strictement identique entre `vocabulaire_hebreu.html`, `app.html` et `index.html` (le portail) — le carnet est la référence ; si `--bg`/`--gold` changent, régénérer les icônes et `manifest.webmanifest`.
- **Do** poser **Encre sur or** (#1a1206) sur tout fond or — jamais de blanc sur or.
- **Do** écrire l'hébreu en Frank Ruhl Libre, en RTL, plus grand que tout le reste (règle de la vedette), nikoud net.
- **Do** réserver vert juste et rouge à revoir au seul feedback de réponse.
- **Do** garder les transitions à 120–350 ms, ease, et l'alternative `prefers-reduced-motion` globale — **dans les trois fichiers** : le carnet l'a reçue le 2026-07-19, et sa garde doit inclure `scroll-behavior:auto` (le `transition:none` global ne couvre pas le défilement doux).
- **Do** énumérer les propriétés animées (`background, color, border-color, opacity`) — **jamais `transition:all`** : le raccourci capture les longhands `outline-*` et WebKit fige alors l'anneau de focus sur les valeurs UA, tout en matchant `:focus-visible`. Piège mesuré le 2026-07-19 (cf. ARCHITECTURE.md § Accessibilité).
- **Do** utiliser JetBrains Mono (LTR) pour toute translittération, au standard maison (`kh`/`ch`/`ts`, `'` pour ayin).
- **Do** écrire les piles de polices **en entier**, jamais `'Frank Ruhl Libre',serif` : les polices Google sont la seule dépendance réseau, donc hors-ligne c'est le fallback qui rend le nikoud — et le `serif` générique le rend nettement moins bien que David Libre. Les **quatre piles normatives**, telles qu'elles s'écrivent dans le code :

  ```css
  'Frank Ruhl Libre','David Libre','Times New Roman',serif
  'Assistant','Arial Hebrew','Helvetica Neue',Arial,sans-serif
  'JetBrains Mono','Courier New',monospace
  'Playpen Sans Hebrew','Segoe Script','Comic Sans MS',cursive
  ```

  Corollaire direct du principe « ça marche dans l'avion ». Le carnet a été recalé le 2026-07-19, **et `app.html` le même jour** : ses 11 déclarations tronquées (9 mono, 2 Assistant) sont complétées. **Les trois fichiers écrivent désormais les quatre piles en entier** — un `font-family` qui n'a pas au moins deux replis est un défaut.

  ⚠️ *Leçon de la même journée* : la première rédaction de cette règle a été écrite d'après la prose du §3 ci-dessus et s'est révélée fausse sur deux piles (`Arial` manquant dans Assistant, Playpen absente). Les piles normatives se relèvent **dans le code**, pas dans la charte — c'est le code qui les porte.
- **Do** poser l'anneau `:focus-visible` doré global dans **les trois fichiers** — le carnet l'a reçu le 2026-07-19 (22 arrêts de tabulation mesurés, 0 sans anneau). Un indicateur maison qui contraste bien n'est pas une faute d'accessibilité, mais c'est une rupture de charte : l'anneau doit être le même partout.

### Don't:
- **Don't** introduire de gamification façon Duolingo : mascottes, confettis, XP, streaks culpabilisants (anti-référence PRODUCT.md).
- **Don't** glisser vers l'app SaaS générique : dégradés violets, cards partout, glassmorphism, esthétique start-up interchangeable (anti-référence PRODUCT.md).
- **Don't** retomber dans le manuel scolaire austère : pas d'écrans gris, secs, intimidants (anti-référence PRODUCT.md).
- **Don't** donner une ombre portée à autre chose que la flashcard (règle de la carte unique).
- **Don't** utiliser l'or en fond ambiant ou sur des états inactifs — la lampe éclaire, elle ne tapisse pas (règle de la lampe).
- **Don't** ajouter une quatrième famille de caractères, ni de sérif dans les boutons (règle des trois voix).
- **Don't** ajouter de nouvelle dépendance réseau (script, icône ou image distante) : chaque fichier doit marcher dans l'avion. Seule exception existante : les polices Google Fonts, qui dégradent proprement vers les fallbacks système hors-ligne.
- **Don't** utiliser `border-left` épais comme accent coloré, ni de texte en dégradé (`background-clip: text`).
