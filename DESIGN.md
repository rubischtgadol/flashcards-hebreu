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
    fontFamily: "JetBrains Mono, monospace"
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

**La règle des couches.** La profondeur se dit d'abord par la couleur : nuit d'encre → nuit claire → carte, chaque couche bordée d'un filet. On ne saute jamais une couche et on n'invente pas de cinquième gris.

## 3. Typography

**Display Font :** Frank Ruhl Libre (fallback David Libre, Times New Roman) — tout l'hébreu et les grands mots français des cartes.
**Body Font :** Assistant (fallback Arial Hebrew, Helvetica Neue) — toute l'interface.
**Label/Mono Font :** JetBrains Mono — translittérations, compteurs, raccourcis `kbd`.
**Cursive :** Playpen Sans Hebrew (300) — l'écriture manuscrite israélienne, toujours en or tendre.

**Character :** un sérif hébraïque solennel qui porte le contenu, un sans-serif discret qui porte l'outil, une mono qui porte la prononciation. Trois voix, trois rôles, aucune confusion.

### Hierarchy
- **Display** (3.6rem, lh 1.15, RTL) : le mot hébreu sur la carte — l'élément le plus grand de tout l'écran. Phrases : 2.15rem. Mobile ≤480px : 3.2rem.
- **Headline** (600, 2.4rem) : le mot français sur la carte. Phrases : 1.5rem.
- **Title** (700, 0.84rem, capitales, espacement 0.12em, or ancien) : les titres de sections du panneau (« Catégories », « Mode »…). Les capitales espacées sont la voix des *étiquettes de repère* — toujours en or, toujours minuscules face au contenu — et elle a exactement quatre emplois : les titres de sections du panneau, la catégorie au sommet de la carte (`.face .eyebrow`, 0.8rem/0.14em), la pilule de catégorie des résultats de recherche (`.sr-cat`, 0.76rem/0.08em) et le titre du tiroir de détail (`.srd-title`, 0.76rem/0.1em). Un système de repères nommé, pas un réflexe décoratif ; aucun cinquième emploi sans décision de charte. **Exception nommée (2026-07-19)** : « Révision du jour » a **quitté** cette voix pour la voix display (`.panel h2.lead` — Frank Ruhl Libre 1.5rem, pas de capitales, parchemin, pas d'or). Motif : les dix titres du panneau étaient typographiés à l'identique, si bien que l'action que toute la couche SRS existe pour encourager pesait exactement autant que « Écriture au recto ». Ce n'est pas un cinquième emploi de la voix Title, c'est un titre qui en sort — parce qu'il n'étiquette pas un réglage, il annonce une action. Aucun or ajouté : la carte de révision porte déjà la seule teinte dorée au repos.
- **Body** (22px de base, Assistant) : interface et contenus. Les contrôles descendent vers 0.9–1.1rem.
- **Label** (JetBrains Mono, 0.82–1.1rem, LTR, parchemin estompé) : translittérations, compteurs de session, étiquettes d'inflexions.

### Named Rules
**La règle des trois voix.** Frank Ruhl Libre pour l'hébreu et les grands mots, Assistant pour l'outil, JetBrains Mono pour la translittération. Aucune quatrième famille, jamais de sérif dans les boutons.

**La règle de la vedette.** À l'écran, l'hébreu est toujours plus grand que sa traduction et que tout élément d'interface. Si un contrôle rivalise visuellement avec le mot hébreu, le contrôle a tort.

## 4. Elevation

Le système est **plat, à une exception près**. La profondeur vient des couches tonales et des filets (règle des couches), pas des ombres. Une seule ombre portée existe : sous la flashcard, l'objet qu'on tient en main (`box-shadow: 0 20px 50px -22px #000, inset 0 1px 0 rgba(255,255,255,.03)`). Le bouton de démarrage porte une lueur d'or discrète (`0 6px 18px -8px` or ancien) — c'est une lumière, pas une élévation. Les dégradés de surface (radial du fond, linéaires très courts sur panneaux et carte) donnent le modelé de la lampe ; ils restent dans la même famille de teintes.

### Named Rules
**La règle de la carte unique.** Seule la flashcard a droit à une vraie ombre portée. Panneaux, chips, champs, choix de QCM restent plats : bordure + couche tonale. Ajouter une ombre à un deuxième objet, c'est retirer sa singularité au premier.

## 5. Components

Caractère commun : **discrets jusqu'à l'action**. Au repos, un contrôle est transparent ou posé sur sa couche, bordé d'un filet. Le survol amène la bordure à l'or ; la sélection et l'action principale remplissent d'or. Transitions courtes (120–150 ms, ease), `prefers-reduced-motion` respecté globalement.

### Buttons
- **Shape :** coins nets et amicaux (12px).
- **Primary** (Commencer, Vérifier, Suivant) : dégradé d'or vertical (or tendre → or ancien), texte Encre sur or 700, padding 14px, pleine largeur dans les panneaux.
- **Hover / Focus :** bordure vers l'or ancien ; champs : bordure or au focus, pas de glow.
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

### Pli « Réglages avancés »
Les réglages qu'on touche une fois (Ordre, Longueur, Prononciation) vivent dans un `<details>` natif : rangée posée sur la nuit claire, filet, rayon 12px, chevron qui pivote à l'ouverture, sous-titre estompé listant le contenu. Fermé par défaut — l'écran raccourcit, « Commencer » remonte. À l'intérieur, les titres gardent la voix Title : le pli range, il ne rétrograde pas.

### CTA sous le pouce (tactile)
Sous `pointer:coarse`, « Commencer » est `position:sticky` en bas d'écran **tant qu'il est actif** (`.start:enabled`) : la lampe reste à portée de pouce pendant le défilement, puis reprend sa place naturelle en fin de page (aucun recouvrement final). Il garde sa seule lueur d'or — pas d'ombre supplémentaire. L'indice de sélection vide se place au-dessus du bouton pour rester lisible quand il est collé, et porte `role="status"`.

**Désactivé, il n'est ni doré ni collant.** Corollaire de la règle de la lampe, appris à la mesure le 2026-07-19 : `opacity:.4` sur un dégradé d'or ne *retire* pas l'or, il le rend translucide — le bouton restait doré, laissait le contenu de la page transparaître au travers (libellé et texte d'aide superposés, les deux illisibles) et, collant au premier écran, recouvrait quatre chips de catégories en interceptant leurs taps. Un état inerte prend donc une **peau pleine et opaque** (`background:none`, filet, texte estompé) et **abandonne le sticky** : il n'a rien à garder sous le pouce tant qu'on ne peut pas l'utiliser. Règle générale : ne jamais exprimer un état désactivé par une opacité posée sur une surface colorée.

### Clavier hébreu (composant signature)
Disposition israélienne en RTL, touches sur nuit claire avec lettres Frank Ruhl Libre 1.35rem, lettres finales en or tendre, touche active en or plein. C'est un objet d'étude à part entière : il doit rester aussi lisible qu'une carte. **Bureau uniquement** : replié derrière le bouton « Clavier hébreu », et absent sur tactile (`pointer:coarse`) — l'iPhone a son clavier hébreu système, le virtuel n'existe que pour les claviers physiques AZERTY.

### Carte de révision (composant signature)
« Révision du jour » : la seule surface teintée d'or au repos (dégradé 135° d'or à 16 % → 5 %, bordure or). Elle a droit à cette exception parce qu'elle est *l'action* que le système veut encourager chaque jour.

## 6. Do's and Don'ts

### Do:
- **Do** garder le bloc `:root` strictement identique entre `vocabulaire_hebreu.html`, `app.html` et `index.html` (le portail) — le carnet est la référence ; si `--bg`/`--gold` changent, régénérer les icônes et `manifest.webmanifest`.
- **Do** poser **Encre sur or** (#1a1206) sur tout fond or — jamais de blanc sur or.
- **Do** écrire l'hébreu en Frank Ruhl Libre, en RTL, plus grand que tout le reste (règle de la vedette), nikoud net.
- **Do** réserver vert juste et rouge à revoir au seul feedback de réponse.
- **Do** garder les transitions à 120–350 ms, ease, et l'alternative `prefers-reduced-motion` globale — **dans les trois fichiers** : le carnet l'a reçue le 2026-07-19, et sa garde doit inclure `scroll-behavior:auto` (le `transition:none` global ne couvre pas le défilement doux).
- **Do** énumérer les propriétés animées (`background, color, border-color, opacity`) — **jamais `transition:all`** : le raccourci capture les longhands `outline-*` et WebKit fige alors l'anneau de focus sur les valeurs UA, tout en matchant `:focus-visible`. Piège mesuré le 2026-07-19 (cf. ARCHITECTURE.md § Accessibilité).
- **Do** utiliser JetBrains Mono (LTR) pour toute translittération, au standard maison (`kh`/`ch`/`ts`, `'` pour ayin).

### Don't:
- **Don't** introduire de gamification façon Duolingo : mascottes, confettis, XP, streaks culpabilisants (anti-référence PRODUCT.md).
- **Don't** glisser vers l'app SaaS générique : dégradés violets, cards partout, glassmorphism, esthétique start-up interchangeable (anti-référence PRODUCT.md).
- **Don't** retomber dans le manuel scolaire austère : pas d'écrans gris, secs, intimidants (anti-référence PRODUCT.md).
- **Don't** donner une ombre portée à autre chose que la flashcard (règle de la carte unique).
- **Don't** utiliser l'or en fond ambiant ou sur des états inactifs — la lampe éclaire, elle ne tapisse pas (règle de la lampe).
- **Don't** ajouter une quatrième famille de caractères, ni de sérif dans les boutons (règle des trois voix).
- **Don't** ajouter de nouvelle dépendance réseau (script, icône ou image distante) : chaque fichier doit marcher dans l'avion. Seule exception existante : les polices Google Fonts, qui dégradent proprement vers les fallbacks système hors-ligne.
- **Don't** utiliser `border-left` épais comme accent coloré, ni de texte en dégradé (`background-clip: text`).
