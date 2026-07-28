# État du projet et travail restant

> **Ce fichier ne porte que ce qui change.** Les procédures et les savoirs permanents n'y vivent plus : ce qui ne bouge pas en est sorti :
>
> - le **rituel** et l'**outillage WSL** → [RITUEL.md](RITUEL.md) ;
> - les **règles de méthode** → [RITUEL.md § Règles de méthode](RITUEL.md) ;
> - les **chantiers clos** et l'historique des acquis → [TODO_ARCHIVE.md](TODO_ARCHIVE.md), à ne pas charger en session sauf grep ponctuel.
>
> **Aucun récit de chantier ne vit ici** : ce qui a été fait, quand, et par quelle
> décision est dans l'archive. Ce fichier répond à « où en est-on ? », jamais à
> « que s'est-il passé ? ».
>
> Reste ici l'état courant, la dette, et les branches — c'est-à-dire tout ce qui aura changé à la prochaine session. ⚠️ **Si une section de ce fichier cesse de changer d'un chantier à l'autre, elle n'est plus à sa place** : c'est le critère qui a présidé à la scission.

## Reprendre ici (prochaine session)

**Aucun chantier n'est ouvert sur `main`, et tout est poussé.** La dette ouverte
compte **quatre entrées** (voir § Dette ouverte) ; deux branches latérales
dorment (voir § Deux branches latérales), dont une à laquelle il ne faut pas
toucher.

**Ce que le dépôt contient**, en chiffres qui périment — aucun ne vaut recopie,
chacun a une commande qui le recalcule :

| Fait | Valeur | L'autorité qui la recalcule |
| --- | --- | --- |
| Cartes | 1728 (A1 490 · A2 669 · B1 503 · B2 47 · C1 19) | `node tools/cherche_mots.js --stats` |
| Sections du carnet | 45 (44 portent un `<h2>`, le préambule non) | `node -e` sur `src/carnet/sections.json` |
| Catégories de cartes | 25 | `catOrder` (07-filtres.js), gardé par `verifieCatOrder()` |
| Garde-fous anti-casse silencieuse | 11 | ARCHITECTURE.md § Garde-fous |
| Outils dev | 6 dans `tools/` | `ls tools/*.js` |
| Modules de l'app | 14 JS + 6 CSS dans `src/app/` | `src/app/ordre.json`, gardé par `verifieOrphelins()` |

⚠️ **Ce tableau est le seul endroit de ce fichier qui porte des chiffres**, et
c'est déjà un risque assumé : la colonne de droite existe pour qu'on ne le croie
jamais sur parole. Un chiffre sans sa commande est une dette.

**Ce qui s'est passé pour en arriver là ne vit pas ici** — les cinq derniers
chantiers (palier ordi, `.face` en flux, section nikoud, les deux défauts iPhone
du carnet, section abréviations) sont archivés dans
[TODO_ARCHIVE.md](TODO_ARCHIVE.md) § « Chantiers clos — archivés le 2026-07-28 ».
Ce fichier répond à « où en est-on ? », jamais à « que s'est-il passé ? ».

⚠️ **GRAPHE À RECALER** — le graphe est antérieur à `docs/` : il n'a jamais
connu ce qui suit, donc rien à en retirer, seulement à y ajouter au prochain
recalage. Le flag enregistre la dette, il ne déclenche rien
(`/graphify . --update` coûte ~235k tokens et ne se lance que sur décision
explicite) :

- **Outil créé** : `tools/controle_tr.js`.
- **Huit fichiers de `data/listes/` créés** : `prepositions-flechies.json`,
  `nombres-fractions.json`, `connecteurs-du-discours.json`,
  `heure-et-date.json`, `comparatif-et-superlatif.json`,
  `tournures-impersonnelles.json`, `imperatif.json`,
  `abreviations-et-sigles.json`.
- **Fichier supprimé** : `docs/lots-en-attente/abreviations-et-sigles.json`
  (bordereau consommé — son contenu vit désormais dans `data/listes/`, et
  garder les deux les aurait laissés diverger).
- **Sept fichiers de `src/carnet/sections/` créés** :
  `01-le-nikoud.html`, `23-tournures-impersonnelles.html`,
  `26-comparatif-et-superlatif.html`, `29-connecteurs-du-discours.html`,
  `34-nombres-fractions.html`, `36-heure-et-date.html`,
  `42-abreviations-et-sigles.html`.
  ⚠️ `01-le-nikoud.html` partage son préfixe avec `01-pronoms-personnels.html`
  (les deux ouvrent la Partie 1, et « le-nikoud » trie avant
  « pronoms-personnels ») : l'ordre qui fait foi est celui de `sections.json`,
  jamais le numéro.
- **Quinze sections de `src/carnet/sections/` renommées** (numérotation à
  trous ; la place 42, qui était réservée, est désormais occupée).
- **Dette antérieure, toujours ouverte** : `data/listes/hebreu-parle.json`,
  `src/carnet/sections/43-hebreu-parle.html` (créés, chantier précédent) ;
  `docs/superpowers/**` (4 fichiers supprimés au ménage documentaire).

### Deux branches latérales — aucune n'est le chantier courant

`main` n'en porte aucune trace : consigné ici pour qu'une session ne les
redécouvre pas par hasard. L'écart se relit à tout moment —
`git rev-list --count main..<branche>` (devant) et
`git rev-list --count <branche>..main` (derrière). Au dernier relevé :
`refonte-retrofuturiste` **48 devant / 63 derrière**, `pilier-oral`
**7 devant / 98 derrière**.

⚠️ **Consigne du propriétaire : « ne touche pas à la branche
retrofuturiste ».** Ni checkout, ni merge, ni rebase, ni écriture dans son
worktree. On peut la lire pour documenter l'écart — pas la modifier.

- **`refonte-retrofuturiste`** — la charte v2 « La console d'étude », **refonte
  purement visuelle**. `main` est
  bien le tronc actif ; cette branche est en attente, pas en cours. Elle est
  **sortie en worktree**
  (`git worktree list` → `/home/ruben/dev/flashcards-hebreu-refonte`), donc on
  ne la `checkout` pas depuis ce répertoire-ci. Intention déjà cadrée sur la
  branche (commit `92e7aa3`, spec §7) : les deux chartes coexisteront via un
  sélecteur à l'accueil.
- **`pilier-oral`** — verso des verbes en grille 2×2, accueil idiomatique,
  quelques points de vocabulaire. Pas d'échéance décidée.

⚠️ **Le coût du report n'est PAS le même pour les deux.** La commande qui
tranche, branche par branche :

```bash
git diff --name-only main...<branche> -- app.html index.html vocabulaire_hebreu.html flashcards_hebreu.html cards.json
```

- **`refonte-retrofuturiste`** — la sortie est **vide** : la branche n'a jamais
  touché un seul artefact déployé. C'est une
  branche d'**exploration de design** : prototypes autonomes (`prototype-*.html`,
  `specimen-*.html`, `test-crt-iphone.html`), polices dans `polices/`, la spec de
  la charte, et de la prose. Son résultat n'est donc pas un patch à fusionner
  mais une **spécification arbitrée à implémenter** — travail neuf, côté `src/`.
  Ce qui entrera vraiment en conflit à un merge : les docs (la branche les édite
  à la **racine**, `main` les a déplacées dans `docs/`), `data/`
  (doublon de commit ci-dessous) et `outils_migration/extrait_donnees.js`
  (supprimé sur `main`, modifié sur la branche) — trois conflits mécaniques,
  aucun sur du code d'application.
- **`pilier-oral`** — la sortie **n'est pas vide** : elle édite bel et bien
  `app.html`, `index.html`, `vocabulaire_hebreu.html` et `flashcards_hebreu.html`
  **à la main**, alors que ce sont désormais des artefacts régénérés. Là, un
  `git merge` produirait des conflits sur des fichiers **écrasés au prochain
  `node tools/build.js`** : le report se fait par **re-portage dans la source**
  (`src/app/`, `src/portail/`, `data/` + `src/carnet/`), en lisant le diff comme
  une spécification. Ce n'est pas un merge, c'est une réécriture guidée.

💡 **Et la réorganisation a rendu la charte v2 nettement moins chère qu'à
l'époque où la branche a été ouverte.** La charte couleur tient maintenant dans
**`src/tokens.css` — 11 jetons, 4 lignes**, injectés au marqueur
`<!-- @TOKENS -->` dans les trois pages déployées (piège 5). Une seconde charte
est donc d'abord un **second jeu de jetons**, plus ce que la v2 ajoute au-delà
de la couleur (typographie, traitements) dans `src/app/css/` (6 fragments, ~536
lignes) et `src/portail/`. L'idée déjà cadrée sur la branche — les deux chartes
coexistant via un sélecteur à l'accueil — se pose donc en ces termes-là.

⚠️ **Un doublon de commit attend au croisement** : `bcf71d0` (sur
`refonte-retrofuturiste` seulement) et `ff25eec` (sur `main` seulement) portent
le **même changement** — l'extraction du vocabulaire vers `data/` — sous deux
hashes, parce qu'il a été appliqué des deux côtés. Vérifiable :
`git log --oneline -1 bcf71d0` et `git log --oneline -1 ff25eec` donnent le
même titre, et `git branch --contains` sur chacun ne renvoie qu'une branche.
Le traiter explicitement au report, sinon il ressort en conflit d'un travail
déjà fait.

### Dette de graphe — flags en attente, aucun ne déclenche rien

`/graphify . --update` coûte **~235 000 tokens** : c'est toujours une décision
séparée et explicite (règle du propriétaire). Ces flags **consignent la
dette**, ils ne la soldent pas. Quand un recalage est décidé, les effacer dans
le même commit que `graphify-out/graph.json`.

⚠️ **État du graphe : il ne connaît ni `data/`, ni `src/carnet/`, ni
`src/app/`, ni `src/portail/`, ni `tools/`, ni `docs/`, ni `.githooks/`.** Il reste fiable sur ce
qui n'a pas bougé — la structure du carnet, les règles de design, les pièges.
Pour tout le reste, va directement au `grep -n` sur le module nommé par les
en-têtes `// Expose :` (listés dans ARCHITECTURE.md § Anatomie de l'app).

- `SPEC_AJOUTE_MOTS.md`, `ajoute_mots.js`, `cherche_mots.js`, `TODO_ARCHIVE.md` créés.
- `SPEC_ECONOMIE_TOKENS.md` créée puis **supprimée** (versée à l'archive) : le graphe
  ne l'a jamais connue, rien à en retirer.
- `data/**`, `src/carnet/**`, `src/tokens.css`,
  `outils_migration/**` créés ; carnet régénéré.
  Puis : `cards.json` créé ; `genere_carnet.js`, `valide_donnees.js` et
  `compare_carnets.js` supprimés d'`outils_migration/`.
- `src/app/**` créé (coquille, `ordre.json`, 6
  fragments CSS, 14 modules JS) ;
  `app.html` devenu artefact. Le graphe situe encore les 83 fonctions de l'app
  **dans `app.html`**, à des lignes qui n'existent plus.
- `.githooks/pre-commit` créé.
- `tools/` et `docs/` créés (11 fichiers déplacés),
  `audit_carnet_mecanique.js` **supprimé** : le graphe porte une **communauté
  morte de 39 nœuds** sur un fichier qui n'existe plus.
- `src/portail/index.html` créé ; `index.html` devenu
  artefact généré. Le graphe le situe encore côté « source éditée à la main ».
- `tools/mesure_translitteration.js` **créé**
  (harnais de notation de `he2tr`). Le graphe ne l'a jamais connu ; la ligne est
  ici pour que le prochain recalage sache qu'il existe.
- `outils_migration/` **supprimé** (ses trois scripts :
  `extrait_donnees.js`, `decoupe_carnet.js`, `decoupe_app.js`). Le graphe ne les a
  jamais connus (dossier créé après le dernier recalage), donc **rien à retirer de
  son côté** — la ligne est ici pour que le prochain recalage n'aille pas les
  chercher.

### Dette ouverte — quatre entrées

Elle était vide (les quatre entrées soldées sont dans
TODO_ARCHIVE.md). Une passe documentaire l'a rouverte une première fois, en
répondant à une question du propriétaire — « as-tu expliqué dans le carnet
comment utiliser *efshar* ? ». Le chantier « mots-outils et nombres » en
ajoute quatre : une section reportée et trois limites connues de
l'outillage.

1. ⚠️ **Le carnet stocke 49 notes d'usage qu'il n'affiche pas.** `gabarits.js`
   émet le champ `note` de `data/` en attribut `data-note` sur le `<li>`
   ([src/carnet/gabarits.js](../src/carnet/gabarits.js), `itemListe`), et
   **rien ne le lit** : aucun `attr(data-note)` dans `src/carnet/carnet.css`,
   aucune lecture dans `src/carnet/carnet.js`. Vérifiable :
   `grep -c data-note vocabulaire_hebreu.html` → 49, et le même compte d'entrées
   portant une `note` dans `data/`. Ces notes ne s'affichent **que dans l'app**,
   au dos de la carte (`.note-line`, `src/app/js/10-rendu.js`).

   Ce qui est perdu, ce n'est pas de la décoration : c'est le mode d'emploi des
   mots-outils. `אֶפְשָׁר` « impersonnel, invariable : suit un infinitif »,
   `כְּשֶׁ` « préfixe soudé au verbe », `אַף אֶחָד` « toujours avec la
   négation », `יָכוֹל` et `צָרִיךְ` et leur accord — un lecteur du carnet ne
   voit rien de tout cela. Le défaut n'est pas nouveau : יָכוֹל
   et צָרִיךְ portaient déjà leur note invisible.

   **Non bloquant** parce que l'exemple en situation, lui, s'affiche, et qu'il
   porte l'essentiel de l'usage. **Ce qui le résoudrait** : afficher la note sous
   la ligne du mot dans le carnet — c'est une décision de charte (voix, place
   dans la hiérarchie typographique, comportement en colonne étroite), pas une
   correction mécanique, d'où son inscription ici plutôt qu'un correctif
   improvisé.

2. ⚠️ **286 désaccords bruts préexistants**, révélés dans tout le corpus par
   `controle_tr.js` maintenant qu'il descend dans les exemples et les
   formes : chva après ל/מ/כ ~109, כָּל rendu `kal` au lieu de `kol` (kamats
   katan) ~36, diphtongue -ay/-ayy ~24, hé final/mappiq ~22. Ce sont les
   limites connues de `he2tr`. ⚠️ **Ne pas y toucher** : la règle du chva
   initial est morphologique et calibrée sur tout le corpus ; sa retouche
   exige de rejouer le harnais de mesure (`node tools/mesure_translitteration.js`)
   et d'améliorer strictement les trois métriques (accord exact, accord
   replié, distance d'édition).

3. **`controle_tr.js` ignore en silence un `tr` manquant** sur
   `formes[]`/`pluriel` (`tools/controle_tr.js`, garde
   `if (!he || !tr) return;`) : aucun autre outil du pipeline ne le
   contrôle. Conforme à sa responsabilité déclarée (pas de validation de
   schéma), mais c'est un silence dans une garde — à décider plus tard.

4. **Deux revues de lot n'ont pas été faites** (sections neuves des lots C et
   D) et **le contrôle WebKit n'a pas été passé**, le chantier ayant été clos
   sur demande. Tolérable : `verifieCatOrder` garde désormais
   **mécaniquement** l'existence des puces, qui était précisément le risque
   muet que le contrôle visuel servait à attraper ; et `build.js --check`
   prouve les cinq artefacts en phase. Ce qu'un WebKit apporterait encore :
   le rendu des blocs `h3.subtheme` des huit séries fléchies, et un contrôle
   aux largeurs desktop.

*Si un nouveau défaut connu apparaît, c'est ici qu'il se note — avec ce qui le
rend non bloquant, faute de quoi il devient un chantier.*
