# Design — la section « Hébreu parlé »

**Date** : 2026-07-27 · **État** : validé, à planifier

## Le besoin

Le carnet enseigne un hébreu correct mais écrit. Un francophone qui le maîtrise
entièrement ne comprend toujours pas une conversation israélienne ordinaire,
parce que celle-ci repose sur une trentaine de particules et d'interjections que
le carnet n'a jamais nommées : תַּכְלֶס, אֵין בְּעָיָה, כְּאִילּוּ, דַּוְקָא, סְתָם. Le
but déclaré du produit est « pouvoir tenir une conversation simple » (PRODUCT.md
§ objectif) ; ce vocabulaire en est le chaînon manquant.

Trois de ces mots sont déjà au carnet (סַבָּבָּה, יָאלְלָה, וַאלָה), noyés dans
« Expressions / Divers » sans marque de registre.

## La décision

Une **37ᵉ section, « Hébreu parlé »** (`עִבְרִית מְדוּבֶּרֶת`), en fin de
*Partie 3 · Au quotidien*, après « Phrases ». ~45 entrées, chacune avec une
phrase d'usage et une note de registre.

Trois arbitrages, tenus :

1. **Section dédiée plutôt que versement dans « Expressions / Divers »**. Le
   registre est l'information principale de ces mots : dire אַחְלָה à un ami et à
   un employeur n'est pas le même acte. Fondu dans la liste qui contient
   « bonjour / merci / s'il te plaît », le registre disparaît. La section dédiée
   le rend visible dans le carnet et donne à l'app une catégorie filtrable — on
   peut réviser l'oral seul, ou l'exclure.
2. **Familier courant, pas argot exhaustif.** אַשְׁכָּרָה, חוֹפֵר, בִּקְטַנָּה et les
   interjections pures sont écartés : ils vieillissent vite et se comprennent
   sans se produire. Aucune vulgarité.
3. **Une phrase d'usage par entrée.** Pour תַּכְלֶס, כְּאִילּוּ ou דַּוְקָא la
   traduction seule ne veut rien dire ; c'est l'exemple qui porte le sens. Les
   listes remontent bien `exemples` jusqu'aux cartes
   (`deriveCartes`, tools/build.js), donc la phrase est aussi sur la flashcard.

## Le câblage — 7 fichiers, un seul commit

`ajoute_mots.js` déclare la création de section **hors périmètre**
(docs/SPEC_AJOUTE_MOTS.md § 10) et récite la procédure. Elle est intégralement
manuelle :

| Fichier | Geste |
| --- | --- |
| `data/listes/hebreu-parle.json` | **neuf** — `section: "Hébreu parlé"`, les entrées, chacune avec son `groupe` |
| `src/carnet/sections/37-hebreu-parle.html` | **neuf** — `h2#sec-hebreu-parle` + `div.note` + 4 × (`h3.subtheme` + `ul.word-list` avec `@ENTREES:listes/hebreu-parle#<groupe>`) |
| `src/carnet/sections.json` | 1 ligne, en fin de tableau |
| `src/carnet/sections/00-preambule.html` | 1 lien de sommaire dans `Partie 3 · Au quotidien`, après « Phrases » |
| `tools/build.js` | `EXPECTED_CATS` += `'Hébreu parlé'` ; `listCats` += `'Hébreu parlé':'Hébreu parlé'` |
| `src/app/js/07-filtres.js` | `catOrder` += `'Hébreu parlé'` — sans quoi la puce n'apparaît jamais dans l'app, même avec des cartes |
| `docs/SPEC_AJOUTE_MOTS.md` § 3.5 | ajouter le label à l'énumération des `section` autorisées |

**Le câblage et les données atterrissent ensemble.** La garde `EXPECTED_CATS` de
`report()` fait échouer le build sur une section attendue tombée à zéro carte :
une constante ajoutée sans données casse la construction, et des données sans
constante sont silencieusement ignorées. Un seul commit, donc.

Deux fichiers créés → **flag `⚠️ GRAPHE À RECALER`** dans docs/TODO.md
« Reprendre ici », **sans recalage** (rituel § 5 : le flag ne déclenche rien).

Les libellés sont fixés ici pour qu'ils ne se négocient pas à l'implémentation :
titre hébreu `עִבְרִית מְדוּבֶּרֶת`, label français **`Hébreu parlé`** — identique
dans le `span.count`, dans le champ `section` du JSON, dans `listCats`, dans
`EXPECTED_CATS` et dans `catOrder`, sous peine de section silencieusement vide.
`div.note` de la section : « Le registre de la rue et des amis — à comprendre
partout, à placer avec discernement. »

## Le contenu

Quatre sous-thèmes, qui deviennent les quatre `groupe` de la liste et les quatre
`h3.subtheme` de la section. Inventaire cible ; l'arbitrage final peut faire
bouger le compte de quelques unités après passage au crible de la déduplication.

**`particules` — les mots du discours (B1).** Ce sont eux qui font qu'une phrase
sonne israélienne, et ce sont les plus intraduisibles hors contexte :
תַּכְלֶס, כְּאִילּוּ, דַּוְקָא, סְתָם, בְּעֶצֶם, פָּשׁוּט (sens adverbial), בְּקִיצוּר,
בִּכְלָל, אַגַּב, יַחֲסִית.

**`reagir` — apprécier, déprécier (A2).**
אֵין בְּעָיָה, סַבָּבָּה\*, אַחְלָה, מַגְנִיב, חֲבָל עַל הַזְּמַן, עַל הַפָּנִים,
בָּאסָה, פַדִיחָה, כָּל הַכָּבוֹד, אֵין מַצָּב, בְּסֵדֶר גָּמוּר, שָׁוֶה, לֹא נוֹרָא.

**`conversation` — relancer, couper, conclure (A1–A2).**
מָה נִשְׁמַע, מָה קוֹרֶה, מָה פִּתְאוֹם, עֲזֹב, דַּי, נוּ, זֶהוּ, לֹא מְשַׁנֶּה,
תֵּכֶף, בְּטַח, בָּרוּר, בֶּאֱמֶת, בְּחַיַּי, שֶׁיִּהְיֶה, תַּעֲשֶׂה טוֹבָה.

**`emprunts` — installés dans l'hébreu courant (A2).**
יָאלְלָה\*, וַאלָה\*, כַּפָּרָה, נְשָׁמָה, יָא חַבִּיבִּי, סוֹף הַדֶּרֶךְ, חָלָס, מַבְסוּט.

\* **Les trois marqués sont déplacés**, pas dupliqués : ils quittent
`data/listes/expressions-divers.json` (qui passe de 35 à 32 entrées) pour la
nouvelle section, avec leurs `tr` et `fr` existants intacts — ce sont des valeurs
autoritaires, on ne les rejoue pas.

**Lemmes déjà présents dans un autre rôle grammatical.** פָּשׁוּט existe comme
adjectif (« simple », data/adjectifs.json) et רֶגַע comme nom (« moment »). Une
entrée n'est créée dans la nouvelle section que si le sens parlé est **réellement
distinct** du sens déjà couvert — פָּשׁוּט particule (« tout simplement,
carrément ») oui, רֶגַע non, puisque le sens « un instant / attends » est déjà
servi. Chaque entrée est passée à `node tools/cherche_mots.js` avant rédaction, et
la rubrique « orthographe voisine » est lue — un `ABSENT` seul ne conclut rien
(ktiv male/haser).

## Le point délicat — les `tr`

Le standard du projet n'est pas la romanisation d'usage, et les mots d'argot sont
précisément ceux que l'on a l'habitude de voir écrits autrement :

- תַּכְלֶס → **`takhles`**, pas « tachles » : `kh` note le khaf sans dagesh, `ch`
  est réservé au het.
- חֲבָל עַל הַזְּמַן → `chaval al hazman` (het, donc `ch`).
- כְּאִילּוּ → `ke'ilu` : alef entre deux voyelles s'écrit `'`.
- אֵין בְּעָיָה → `eyn be'ayah` : ayin partout `'`, hey final conservé.

Les `.tr` sont **autoritaires** : rédigés à la main contre le standard, copiés
verbatim dans les cartes, jamais régénérés depuis `he2tr`. L'utilisateur qui tape
« tachles » reste accepté — c'est `trKey` qui replie les variantes, pas
l'orthographe affichée.

## Ce qui prouve

1. `node tools/build.js` — les comptages, la garde `EXPECTED_CATS` (la nouvelle
   section doit apparaître avec son décompte), la garde `niveau` sur chaque
   entrée, la garde anti-perte des `@ENTREES` (chaque `groupe` doit consommer au
   moins une entrée, et toutes les entrées doivent être consommées).
2. `node tools/verifie_exemples.js` — **0 erreur**, ~45 exemples neufs.
3. `node tools/build.js --check` — les cinq artefacts en phase et le tampon
   `VERSION` de `sw.js` recalculé.

**Pas de WebKit.** Aucun CSS n'est touché, aucun chemin de rendu non plus : la
section réutilise les gabarits `word-list` et `subtheme` existants, et le 37ᵉ lien
de sommaire hérite de `.toc-links a`. Booter un navigateur pour reconfirmer ce que
`--check` vient de prouver serait du confort, pas de la preuve (rituel § 3).

## Hors périmètre

- Aucun nouveau `theme` : les listes sont mono-thème par nature et n'en portent
  pas.
- Aucun niveau au-delà de B2.
- Aucune modification de `he2tr` ni de `trKey` — le harnais de mesure de la
  translittération n'est pas rejoué, puisque la règle du shva initial n'est pas
  touchée.
- Aucun recalage du graphe (flag seulement).

## Dette laissée derrière

Après ce chantier, toute addition future à « Hébreu parlé » via
`tools/ajoute_mots.js` devra porter un `sous_theme` — la section a des `groupe`,
et le script l'exige alors (SPEC_AJOUTE_MOTS § 3.5). C'est dérivé mécaniquement de
la donnée, donc rien à câbler : la contrainte apparaîtra d'elle-même.
