# Prompt de reprise — branche `refonte-retrofuturiste`

Le texte ci-dessous se copie tel quel dans une session neuve. Il est **autoportant** : il ne
suppose aucune mémoire de la session précédente, et il porte l'état arrêté au 2026-07-25 (soir).

> ⚠️ **À tenir à jour** : ce prompt vaut ce que vaut son bloc ÉTAT. À la fin de chaque session qui
> arbitre quelque chose, le mettre à jour ici — sinon la session suivante voudra « réparer » des
> décisions prises exprès. **Mis à jour au 2026-07-25 (nuit), commit `899cc98`** : quatre planches
> en attente de verdict, la règle du mobilier au spec § 5 ter, et la distinction entre les deux
> passes SENTRY. Les décisions elles-mêmes vivent dans `TODO.md` « Reprendre ici » et
> dans le spec ; ce fichier n'en est que le résumé de passation.

---

```
Chantier : la charte graphique v2 « La console d'étude » (direction artistique).

BRANCHE DE TRAVAIL : refonte-retrofuturiste
RÉPERTOIRE DE TRAVAIL : ~/dev/flashcards-hebreu-refonte  (worktree lié)
DISTANT : origin/refonte-retrofuturiste
DERNIER COMMIT DE LA SESSION PRÉCÉDENTE : 899cc98 (2026-07-25, nuit)

Premier geste, avant toute autre chose — vérifie que tu es au bon endroit :
    git -C ~/dev/flashcards-hebreu-refonte branch --show-current
Ça doit afficher exactement « refonte-retrofuturiste ». Si le répertoire n'existe
pas, recrée le worktree :
    git -C ~/dev/flashcards-hebreu worktree add ~/dev/flashcards-hebreu-refonte refonte-retrofuturiste

Tous les chemins, lectures, éditions, git add/commit/push de cette session se font
dans ~/dev/flashcards-hebreu-refonte. Utilise « git -C ~/dev/flashcards-hebreu-refonte … »
ou place-toi dedans : le shell se réinitialise sur ~/dev/flashcards-hebreu entre les
commandes, c'est un piège avéré.

INTERDIT : toucher à la branche main, au checkout principal ~/dev/flashcards-hebreu,
ou à quoi que ce soit hors de ce worktree. Ne merge pas, ne rebase pas, ne
cherry-pick pas depuis main sans me le demander — la branche porte un doublon
périmé de data/ (voir le PIÈGE AU MERGE dans TODO.md).

Commence par lire le « Reprendre ici » de TODO.md dans ce worktree : il est
autoportant et s'ouvre sur un état de fin de session daté du 25/07 au soir.

════════ ÉTAT — DÉCISIONS PRISES EXPRÈS, NE LES « RÉPARE » PAS ════════

La direction artistique est SOLDÉE en v0.6 :
  - les trois calques CRT (bruit, vignettage, scintillement) ont été jugés sur
    iPhone réel et TOUS retirés ; la charte n'a plus aucun effet de surface
    d'écran. Le tableau des deux passations est au spec § 5 — leur absence n'est
    pas un oubli ;
  - l'hébreu reste en Frank Ruhl Libre. L'exploration typographique (4 planches +
    une fonte Unifont réparée) est CLASSÉE, conservée au cas où : ne pas rouvrir ;
  - la page-témoin prototype-nerv.html FAIT FOI en cas d'écart avec le spec
    (docs/superpowers/specs/2026-07-24-charte-retrofuturiste-design.md).

Le prélèvement du MOUVEMENT sur SENTRY est FAIT, et son résultat est NÉGATIF :
NE REFAIS PAS CETTE PASSE. Mesuré en WebKit puis contre-vérifié à la source hors
navigateur, le mouvement propre à la référence tient en trois @keyframes :
noiseShift et flick (les deux calques déjà rejetés) et satspin, keyframe MORT
jamais monté dans le DOM. Zéro animation d'état, zéro transition d'écran, zéro
comportement au défilement, zéro SVG. Le survol y vient des classes Tailwind
transition-colors, un défaut de framework. Détail : REFERENCES_SENTRY.md
§ « le gisement est sec ». Conséquence : le mouvement ne peut plus être prélevé,
il doit être COMPOSÉ.

⚠️ MAIS le gisement DÉCORATIF, lui, n'était pas sec — ne confonds pas les deux.
Une seconde passe, d'objet différent (mobilier décoratif STATIQUE, pas le
mouvement), a eu lieu le 25/07 sur les DEUX liens, dont app.fuser.studio JAMAIS
exploré jusque-là. Elle a rendu 17 trouvailles mesurées sur 2 833 nœuds, dont
6 PROCÉDÉS neufs que la charte n'avait pas : passe-partout (outline à décalage
négatif), halo par backdrop-filter, grille de POINTS au lieu de lignes, bord
gravé (double inset), fondu de panneau, jeu de glyphes (la référence n'a AUCUN
<svg>, ses icônes sont des caractères). C'est la famille E de
prototype-decor.html, la seule à porter une provenance mesurée. Deux limites
connues, donc gisement non épuisé : le mode BUREAU du Studio a été capturé en
cours de chargement, et l'ombre des cartes du board n'a pas pu être isolée.
Détail et valeurs exactes : REFERENCES_SENTRY.md § « le mobilier décoratif ».

⚠️ Piège de méthode, payé : la transition à rebond et les keyframes
f-shimmer/f-spark qu'une première lecture avait pris pour des trouvailles
appartiennent au badge « Made with Fuser » — du mobilier d'hébergeur injecté sur
toutes les apps de la plateforme (préfixe de classe f-, id
__fuser_made_with_badge). Sur une référence hébergée, sépare toujours l'app du
chrome du fournisseur.

⚠️ La règle « tout mouvement en steps() » (spec § 5) N'A PAS DE FONDEMENT MESURÉ :
ses deux seules occurrences dans toute la référence sont les deux calques
rejetés. Elle n'est pas annulée, elle est MISE AU JUGEMENT — un rectificatif daté
est au spec § 5, il sera remplacé par le verdict du propriétaire.

RÉGLAGE DE L'APPAREIL DU PROPRIÉTAIRE — QUESTION SOLDÉE le 25/07, ne la repose
pas. « Réduire les animations » n'est PAS permanent chez lui : il peut le couper
pour juger. Le chantier du mouvement et du décor le concerne donc bien en usage
réel. Historique, pour que le symptôme soit reconnu s'il revient : une planche
d'animations ouverte chez lui n'avait RIEN joué (fichier pourtant byte-identique,
53 390 octets, vérifié au cmp) — c'était le réglage, pas un bug. Règle qui en
découle et qui est désormais appliquée aux QUATRE planches, et qu'il faut garder :
une page de jugement DOIT annoncer quand un réglage d'accessibilité la neutralise,
et offrir une dérogation locale (encart #alarme + bouton #forcer qui pose
body.force-anim).

════════ LES QUATRE PLANCHES EN ATTENTE DE VERDICT ════════

Elles ne se recouvrent pas et se tranchent séparément. Aucune n'a encore reçu de
verdict du propriétaire — c'est le premier sujet à reprendre.

  A. prototype-mouvement.html — « qu'est-ce qui bouge quand il se passe quelque
     chose ». Les 9 moments de l'app (révélation recto/verso, verdict juste/faux,
     carte suivante, progression, radar, transition d'écran, chiffres du bilan,
     pilule voix, alerte), chacun rendu DEUX FOIS côte à côte, steps() contre
     fluide, à markup, durée et distance identiques. Verdict attendu par moment :
     A (steps), B (fluide) ou RIEN — « rien » est légitime sur plusieurs lignes.

  B. prototype-ame.html — « qu'est-ce qui vit quand rien ne se passe ». 9
     propositions de mouvement ambiant, isolées puis cumulées sur un écran
     d'accueil, avec « tout couper » et un compteur d'animations actives. La
     bascule steps()/fluide s'y applique aussi : l'ambiant est le cas où la règle
     steps() risque le plus de casser. Le halo qui respire (09) est signalé RISQUÉ
     et non recommandé — c'est le plus proche du scintillement rejeté. Verdict
     attendu : garder / jeter / garder mais moins.
     ⚠️ Cette planche a demandé une règle neuve, la RÈGLE DE LA VEILLEUSE
     (spec § 5 bis), parce que le cosmétique contredit frontalement la règle de la
     lampe. Proposition NON ARBITRÉE : la charte confond les signaux (soumis à la
     lampe) et la vie ambiante (qui ne signale rien mais distingue un instrument
     allumé d'un instrument débranché). Précédent déjà admis sans être nommé : le
     module 16, champ d'étoiles, retenu « écrans calmes seulement ».

  C. prototype-parures.html — « de quoi l'app est-elle faite ». 13 ornements,
     chacun en bascule SANS / AVEC, en quatre familles : vedette hébraïque,
     matière de la carte, ornements de données, geste qui enseigne. 11 sur 13 sont
     STATIQUES et survivent au mouvement réduit. Verdict attendu : prendre /
     jeter / prendre plus discret.
     ⚠️ Deux réserves déjà consignées, ne les redécouvre pas : la RACINE EN VEDETTE
     (03) demande un champ « racine » dans data/*.json — seule proposition à coût
     de contenu, c'est un lot à part entière ; le CARTOUCHE (06) et le FILIGRANE
     (07) font double emploi avec l'insigne hexagonal de niveau, à choisir sans
     cumuler.

  D. prototype-decor.html — « de quoi le site est-il décoré ». Le décor
     ENTIÈREMENT GRATUIT, demandé le 25/07 : 18 ornements en 5 familles, chacun en
     bascule sans / avec, étiqueté discret / affirmé / spectaculaire, avec sa
     surface visée et son coût. 11 sur 18 sont statiques. Plus une SCÈNE CUMULÉE
     pilotée par les mêmes interrupteurs et un compteur d'animations actives — le
     nombre d'ornements que le propriétaire RETIRE de la scène est le vrai verdict.
     Verdict attendu : prendre / jeter / prendre plus discret / « statique
     seulement », ce dernier étant un verdict à part entière.
     Les 5 familles : A le châssis (statique) · B l'alphabet comme ornement ·
     C les instruments qui ne mesurent rien · D la profondeur (encadrée) ·
     E les 6 PROCÉDÉS PRÉLEVÉS, seuls à porter une provenance mesurée.
     ⚠️ Cette planche a demandé une troisième règle, la RÈGLE DU MOBILIER
     (spec § 5 ter), NON ARBITRÉE : la lampe régit ce qui signale, la veilleuse ce
     qui dit que l'instrument est allumé, le mobilier dit DE QUOI L'OBJET EST FAIT.
     Elle tient par trois contraintes — objet nommé et ENCADRÉ (jamais la surface
     entière, ce qui respecte par construction le verdict du 24/07 sur les calques
     CRT), interdiction de MIMER UN SIGNAL, et préférence pour le STATIQUE.
     ⚠️ Réserves déjà consignées, ne les redécouvre pas : les DIODES DE FAÇADE (10)
     miment un signal et sont signalées comme le plus contestable des 18 ; la
     PLUIE DE CARACTÈRES (07) est un cliché daté au-delà de sa gouttière ; la
     GUÉMATRIE (09) est un usage religieux, arbitrage du propriétaire et pas d'un
     agent ; le PLOTTER (06) demanderait 22 tracés SVG à la main, lot à part
     entière ; la GRILLE DE POINTS (15) REMPLACE la grille de lignes au lieu de
     s'y ajouter, donc touche le § 4 ; le HALO PAR BACKDROP-FILTER (14) et le
     GLOBE (12) sont les deux seuls à coûter réellement en composition, à juger
     sur l'appareil et jamais en émulation (piège n°14).

════════ CE QUI RESTE, DANS L'ORDRE DU TODO ════════

  1. recueillir les VERDICTS sur les quatre planches ci-dessus, puis inscrire les
     décisions dans le spec (le § 5 bis, le § 5 ter et le rectificatif steps()
     attendent tous les trois d'être remplacés par des arbitrages). Deux réponses
     TRANSVERSALES sont attendues en plus des verdicts par ornement : le REGISTRE
     (steps() ou fluide sur du décor — les quatre planches portent le sélecteur), et
     la GRILLE DE POINTS, seule proposition qui remplace un acquis de charte ;
  2. concevoir le système de thèmes (deux chartes coexistantes + sélecteur à
     l'accueil, spec § 7) — idée cadrée, rien de planifié ;
  3. le portage sur les vraies surfaces, qui attend la fin de la réorganisation du
     dépôt sur main.

════════ QUATRE DÉFAUTS RELEVÉS SUR MAIN, NON CORRIGÉS ════════

Audit d'animation du site déployé, 25/07. Cette branche n'y touche pas ; à
reprendre dans une session main. Le plus sérieux est un vrai défaut
d'accessibilité : sur le portail, .menorah::before continue de pulser sous
prefers-reduced-motion, parce que le sélecteur * NE CIBLE PAS les
pseudo-éléments. Il faut *,*::before,*::after. Les trois autres et le détail
sont dans TODO.md. Ce même bug est apparu TROIS fois dans le dépôt le même jour :
il mérite d'entrer dans les pièges de CLAUDE.md.

════════ OUTILLAGE ════════

Playwright + WebKit en émulant l'iPhone 16 Pro (jamais Chrome headless, il pend en
WSL2), piloté DEPUIS UN SOUS-AGENT, jamais depuis le fil principal.
Pièges payés :
  - une fonte ou une page déclarée mais non utilisée n'est jamais chargée —
    vérifier que la mesure porte sur un nœud réellement visible ;
  - la forme CHAÎNE d'evaluate() attend une expression : envelopper dans (()=>{…})() ;
  - le miroir raw.githack met en cache par fichier, sans le signaler. Après un
    push, donner les liens avec le SHA du commit à la place du nom de branche
    (le plus sûr), ou un suffixe ?v=<n> incrémenté ;
  - avant de conclure « la page est cassée » : comparer le fichier SERVI au fichier
    local (curl + cmp), puis vérifier les réglages d'accessibilité, et seulement
    ensuite chercher un bug.
Le hook impeccable remonte des dizaines de constats sur toutes les pages de cette
branche : ce sont des FAUX POSITIFS: il compare à DESIGN.md, qui documente la
charte v1, alors que ces pages sont la v2. Ne pas « corriger » les jetons.

Aujourd'hui je veux : <écris ici ce que tu veux faire>
```

---

## Pourquoi le bloc ÉTAT existe

Cinq décisions de cette branche ressemblent à du travail inachevé quand on arrive sans contexte :

1. **Aucun effet de surface d'écran** — les trois calques CRT ont été prélevés sur la référence,
   validés en émulation, puis rejetés sur l'appareil. Une session neuve les verrait manquer et
   voudrait les remettre.
2. **Le nikoud de GNU Unifont réparé mais non retenu** — le travail est là, versionné et
   reproductible ; il a été jugé insuffisant. Ce n'est pas un chantier à finir.
3. **L'hébreu en Frank Ruhl Libre** — la question a été rouverte le 25/07, tout le catalogue
   passé en revue, puis refermée sur le même choix.
4. **La charte est presque immobile** — ce n'est pas un oubli mais un constat mesuré : la
   référence n'avait rien à donner sur le mouvement. Une session neuve croirait le chantier
   d'extraction inachevé et le referait pour rien.
5. **La règle `steps()` porte un rectificatif qui la contredit** — c'est voulu. La règle tient
   jusqu'au verdict ; le rectificatif dit seulement que sa justification écrite est fausse.
6. **Deux passes SENTRY existent, avec des résultats opposés, et ce n'est pas une contradiction.**
   Celle du **mouvement** est sèche et interdite à rejouer ; celle du **mobilier décoratif** a
   rendu six procédés. Une session neuve risque l'erreur dans les deux sens : repiloter la
   référence pour ses animations (déjà payé, rien à trouver), ou croire qu'il est inutile d'y
   retourner pour du décor (faux — il reste le mode bureau du Studio et l'ombre des cartes).
7. **La charte porte trois règles de mouvement, dont deux ne sont pas arbitrées** — la lampe (§ 5,
   acquise), la veilleuse (§ 5 bis, proposée) et le mobilier (§ 5 ter, proposée). Les deux
   dernières sont écrites pour être **remplacées par un arbitrage**, pas pour être appliquées
   telles quelles. Ne les traite pas comme du définitif, et ne les supprime pas non plus.

## La péremption qui n'en est plus une — mais qui n'est pas nulle non plus

Le chantier des animations dépendait de deux adresses de service tiers (`REFERENCES_SENTRY.md`)
qui pouvaient tomber. **Ce risque est très largement éteint** : deux passes ont eu lieu le 25/07,
l'une sur le mouvement (qui n'a rien rendu, et c'est acquis) et l'autre sur le mobilier décoratif
(qui a rendu 17 trouvailles mesurées, dont 6 procédés neufs). Tout est transposé et versionné dans
`prototype-decor.html`, avec les valeurs mesurées en commentaire à côté de leur transposition : si
les adresses disparaissent, ces six procédés restent utilisables sans elles.

⚠️ **Ce qui serait tout de même perdu**, et c'est la seule raison de ne pas classer la référence :
deux angles restent inexplorés, tous deux nommés à `REFERENCES_SENTRY.md` § « le mobilier
décoratif » — le **mode bureau de `app.fuser.studio`**, capturé en cours de chargement donc non
stabilisé, et **l'ombre portée des cartes du board**, visible à l'écran mais dont le nœud porteur
n'a pas été isolé. Petit gisement, mais gisement.
