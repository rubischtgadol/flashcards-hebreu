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

**Un chantier est ouvert sur `main` : le système de chartes graphiques.** La
spec est validée et amendée
([superpowers/specs/2026-07-29-systeme-de-chartes-design.md](superpowers/specs/2026-07-29-systeme-de-chartes-design.md) —
amendements du 29/07 : triplets RGB plutôt qu'alphas nommés, migration du décor
au lot 2), et **le plan d'implémentation est écrit**
([superpowers/plans/2026-07-29-systeme-de-chartes.md](superpowers/plans/2026-07-29-systeme-de-chartes.md)) :
20 tâches en 3 phases — désincrustation (invisible, banc A/B 24 paires),
mécanisme + 4 gardes (chacune à voir échouer), sélecteur. **Rien n'est
implémenté : l'exécution attend la décision du propriétaire.** Décisions qui
cadrent le chantier : la direction v2 n'est pas figée (le système précède la
direction) ; périmètre app + portail, carnet hors périmètre ; le système se
nomme « charte » (`data-charte`, `src/chartes/`), jamais « thème » — collision
avec les thèmes de vocabulaire. Tout le reste est poussé. La dette ouverte
compte **trois entrées** (voir § Dette ouverte) ; deux branches latérales
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

⚠️ **GRAPHE À RECALER** — le graphe est antérieur à `docs/` : il n'a jamais
connu ce qui suit, donc rien à en retirer, seulement à y ajouter au prochain
recalage. Le flag enregistre la dette, il ne déclenche rien
(`/graphify . --update` coûte ~235k tokens et ne se lance que sur décision
explicite) :

- **Outil créé** : `tools/controle_tr.js`.
- **Fichiers créés** : `docs/superpowers/specs/2026-07-29-systeme-de-chartes-design.md`
  et `docs/superpowers/plans/2026-07-29-systeme-de-chartes.md`
  (premières entrées de `docs/superpowers/` sur `main`).
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
  `docs/superpowers/**` (5 fichiers supprimés, répertoire disparu — le dernier était le plan d'implémentation d'un chantier clos, dont le récit vit dans TODO_ARCHIVE.md et le contenu dans git).

### Deux branches latérales — aucune n'est le chantier courant

`main` n'en porte aucune trace : consigné ici pour qu'une session ne les
redécouvre pas par hasard. ⚠️ **L'écart ne s'écrit pas ici** — il change à chaque
commit sur `main`, donc tout chiffre recopié serait faux le lendemain. Il se
relit :

```bash
git rev-list --count main..<branche>   # ce que la branche a en propre
git rev-list --count <branche>..main   # ce qu'elle a manqué
```

⚠️ **Consigne du propriétaire : « ne touche pas à la branche
retrofuturiste ».** Ni checkout, ni merge, ni rebase, ni écriture dans son
worktree. On peut la lire pour documenter l'écart — pas la modifier.

- **`refonte-retrofuturiste`** — la charte v2 « La console d'étude », **refonte
  purement visuelle**. `main` est
  bien le tronc actif ; cette branche est en attente, pas en cours. Elle est
  **sortie en worktree**
  (`git worktree list` → `/home/ruben/dev/flashcards-hebreu-refonte`), donc on
  ne la `checkout` pas depuis ce répertoire-ci. ⚠️ **Décision du propriétaire
  (29/07) : la direction v2 actuelle ne le satisfait pas et sera retravaillée**
  — les planches de jugement de la branche se lisent en le sachant. Le véhicule
  du portage est désormais le **système de chartes de `main`** (spec + plan dans
  `docs/superpowers/`) : la v2 deviendra un dossier `src/chartes/<slug>/` quand
  sa direction sera arrêtée.
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

💡 **Le portage de la v2 a son véhicule : le système de chartes** (spec et plan
du 29/07 dans `docs/superpowers/`, non implémenté — voir « Reprendre ici »).
Une fois ce chantier exécuté, une charte est un dossier `src/chartes/<slug>/`
(jetons + règles + identité) : la v2 s'y versera comme un jeu de valeurs et son
décor, sans toucher aux surfaces.

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

### Dette ouverte — trois entrées

Ce qui reste connu, non corrigé, et pourquoi chacun est tolérable. Une entrée
sans sa raison d'être tolérée n'est pas une dette : c'est un chantier.

1. ⚠️ **259 désaccords entre `he2tr` et les `tr` rédigés à la main** que `trKey`
   ne replie pas, sur 4229 paires — le nombre que rend `node
   tools/mesure_translitteration.js` (4229 moins les 3970 accords repliés). Ce qui reste tient à trois causes, toutes documentées, et
   **aucune n'est un défaut du moteur** : le chva initial, morphologique et
   délibérément approximé (CLAUDE.md § Transliteration standard) ; le hé final,
   où les écarts sont des `tr` rédigés qui s'écartent du standard — une règle
   « hé muet » coûterait 903 accords exacts, mesuré ; et les phrases
   multi-mots, où `trKey` n'ancre son pliage qu'en tête de chaîne.

   **Non bloquant, et c'est prouvé et non supposé : aucun de ces désaccords
   n'est visible.** Le harnais ne compare jamais un champ sans `tr` rédigé, donc
   `he2tr` n'est jamais ce qui s'affiche pour ces paires ; et `checkAnswer`
   accepte **toujours** `trKey(card.tr)` ET `trKey(he2tr(card.he))` — un brut
   ajoute une graphie tolérée, il n'en retire jamais.

   ⚠️ **Ne pas y toucher sans le protocole complet** : `node
   tools/mesure_translitteration.js` doit améliorer strictement les trois
   métriques, **et** le contrôle paire par paire (ancienne `he2tr` contre
   nouvelle, en bacs à sable `vm`) doit rendre **zéro perte**. La moyenne qui
   monte ne prouve rien : c'est ce contrôle-là qui a attrapé une sur-application
   sur `כַּלְכָּלִי` alors que le harnais était déjà au vert.

2. **Trois cellules de déficit vertical sur une fenêtre d'ordinateur très
   basse.** Sur 42 combinaisons mesurées (7 gabarits × 6 situations), trois
   demandent encore de faire défiler la page : 1536×620 en saisie fr→hébreu
   exemple déplié (+66 px), 1536×620 en mode Cartes sur le verso d'un verbe à
   4 formes exemple déplié (+59 px, et c'est la carte elle-même qui dépasse),
   et 900×700 en saisie fr→hébreu exemple déplié (+59 px).

   **Tolérable** : il faut cumuler une fenêtre de 700 px de haut ou moins, le
   contenu le plus dense du corpus et l'exemple déplié. Les 39 autres cellules
   sont à zéro. Le resserrer exigerait de replafonner la hauteur de carte, donc
   de rouvrir le rognage que l'entrée 3 vient de fermer — le compromis se paie
   d'un côté ou de l'autre.

3. **Le téléphone défile de 60 px après une réponse sur un verbe à 4 formes.**
   Conséquence assumée d'avoir rendu la hauteur de carte élastique en mode
   saisie (`height:auto; max-height:min(46vh,340px)`) : le rognage des
   inflexions a disparu — `#face-content` passe de 151/179 à 179/179 — mais la
   carte occupe la place qu'elle réclamait. Sur un adjectif à 3 formes le
   résidu tombe à 4 px.

   **Tolérable** : 60 px sur un viewport de 681 px, après réponse seulement, et
   sur la carte la plus haute du corpus. Resserrer le plafond à 40vh rognerait
   à nouveau les exemples longs — c'est le même arbitrage que l'entrée 2, vu
   depuis le téléphone.


*Si un nouveau défaut connu apparaît, c'est ici qu'il se note — avec ce qui le
rend non bloquant, faute de quoi il devient un chantier.*
