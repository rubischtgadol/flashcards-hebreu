# État du projet et travail restant

> **Ce fichier ne porte que ce qui change.** Scindé le 27/07/2026, après mesure : il faisait 460 lignes dont **77 % de procédures et de savoirs permanents**, si bien qu'une session en lisait 460 pour en utiliser 105. Ce qui ne bouge pas en est sorti :
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

**Où en est le dépôt (27/07/2026, tout poussé sur `main`).** La réorganisation
« le dépôt généré » est **CLOSE** : ses 21 tasks, chantiers 1 à 4, sont soldés,
contrôle de sortie compris (Task 21 — la preuve et sa procédure de rejeu sont
dans TODO_ARCHIVE.md § « Chantiers clos et dette soldée — archivés le
2026-07-27 »). **Aucun chantier n'est ouvert** sur `main` ; la dette ouverte
compte **une entrée**, rouverte le 27/07 (les notes d'usage que le carnet stocke
sans les afficher — voir § Dette ouverte).

**Le carnet compte 1428 cartes** (A1 429 · A2 573 · B1 390 · B2 26 · C1 10).
⚠️ Ce chiffre est le seul de ce fichier qui vaille recopie, et il périme au
prochain lot : l'autorité qui le recalcule est `node tools/cherche_mots.js
--stats`, jamais cette page.

⚠️ **GRAPHE À RECALER — 27/07/2026 : `data/listes/hebreu-parle.json`,
`src/carnet/sections/37-hebreu-parle.html` (créés) ; `docs/superpowers/**`
(4 fichiers supprimés au ménage documentaire).** Le graphe n'a jamais connu ces
quatre-là — il est antérieur à `docs/` —, donc il n'y a rien à en retirer : la
ligne est là pour que le prochain recalage n'aille pas les chercher. Le flag
enregistre la dette, il ne déclenche rien (`/graphify . --update` coûte ~235k tokens et ne se
lance que sur décision explicite).

### Deux branches latérales — aucune n'est le chantier courant

`main` n'en porte aucune trace : consigné ici pour qu'une session ne les
redécouvre pas par hasard. L'écart se relit à tout moment —
`git rev-list --count main..<branche>` (devant) et
`git rev-list --count <branche>..main` (derrière). Relevé du 27/07 :
`refonte-retrofuturiste` **48 devant / 63 derrière**, `pilier-oral`
**7 devant / 98 derrière**.

⚠️ **Consigne du propriétaire : « ne touche pas à la branche
retrofuturiste ».** Ni checkout, ni merge, ni rebase, ni écriture dans son
worktree. On peut la lire pour documenter l'écart — pas la modifier.

- **`refonte-retrofuturiste`** — la charte v2 « La console d'étude », **refonte
  purement visuelle**. ⚠️ **Rectification du 27/07 : la rédaction précédente
  annonçait qu'elle était « le chantier courant ».** C'est faux
  aujourd'hui — deux chantiers ont été livrés sur `main` le 27/07 (« Hébreu
  parlé », puis « Le mortier grammatical » et sa passe documentaire). `main` est
  bien le tronc actif ; cette branche est en attente, pas en cours. Elle est
  **sortie en worktree**
  (`git worktree list` → `/home/ruben/dev/flashcards-hebreu-refonte`), donc on
  ne la `checkout` pas depuis ce répertoire-ci. Intention déjà cadrée sur la
  branche (commit `92e7aa3`, spec §7) : les deux chartes coexisteront via un
  sélecteur à l'accueil.
- **`pilier-oral`** — verso des verbes en grille 2×2, accueil idiomatique,
  quelques points de vocabulaire. Pas d'échéance décidée.

⚠️ **Le coût du report n'est PAS le même pour les deux — vérifié le 25/07, après
une première rédaction qui les mettait à tort dans le même sac.** La commande qui
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
  à la **racine**, `main` les a déplacées dans `docs/` au Task 17), `data/`
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
séparée et explicite (règle du propriétaire, 21/07). Ces flags **consignent la
dette**, ils ne la soldent pas. Quand un recalage est décidé, les effacer dans
le même commit que `graphify-out/graph.json`.

⚠️ **État du graphe au 25/07 : il ne connaît ni `data/`, ni `src/carnet/`, ni
`src/app/`, ni `src/portail/`, ni `tools/`, ni `docs/`, ni `.githooks/`.** Il reste fiable sur ce
qui n'a pas bougé — la structure du carnet, les règles de design, les pièges.
Pour tout le reste, va directement au `grep -n` sur le module nommé par les
en-têtes `// Expose :` (listés dans ARCHITECTURE.md § Anatomie de l'app).

- **2026-07-23** — `SPEC_AJOUTE_MOTS.md`, `ajoute_mots.js`,
  `SPEC_ECONOMIE_TOKENS.md`, `cherche_mots.js`, `TODO_ARCHIVE.md` créés.
- **2026-07-24** — `data/**`, `src/carnet/**`, `src/tokens.css`,
  `outils_migration/**` créés ; carnet régénéré (chantier 1). Puis (chantier 2)
  `cards.json` créé ; `genere_carnet.js`, `valide_donnees.js` et
  `compare_carnets.js` supprimés d'`outils_migration/`.
- **2026-07-25 (chantier 3)** — `src/app/**` créé (coquille, `ordre.json`, 6
  fragments CSS, 14 modules JS), `outils_migration/decoupe_app.js` créé ;
  `app.html` devenu artefact. Le graphe situe encore les 83 fonctions de l'app
  **dans `app.html`**, à des lignes qui n'existent plus.
- **2026-07-25 (tripwires)** — `.githooks/pre-commit` créé.
- **2026-07-25** — `tools/` et `docs/` créés (11 fichiers déplacés),
  `audit_carnet_mecanique.js` **supprimé** : le graphe porte une **communauté
  morte de 39 nœuds** sur un fichier qui n'existe plus.
- **2026-07-25** — `src/portail/index.html` créé ; `index.html` devenu
  artefact généré. Le graphe le situe encore côté « source éditée à la main ».
- **2026-07-25 (dette ouverte)** — `tools/mesure_translitteration.js` **créé**
  (harnais de notation de `he2tr`). Le graphe ne l'a jamais connu ; la ligne est
  ici pour que le prochain recalage sache qu'il existe.
- **2026-07-25** — `outils_migration/` **supprimé** (ses trois scripts :
  `extrait_donnees.js`, `decoupe_carnet.js`, `decoupe_app.js`). Le graphe ne les a
  jamais connus (dossier créé après le dernier recalage), donc **rien à retirer de
  son côté** — la ligne est ici pour que le prochain recalage n'aille pas les
  chercher.

### Dette ouverte — une entrée, rouverte le 27/07/2026

Elle était vide (les quatre entrées soldées sont dans
TODO_ARCHIVE.md). La passe documentaire en a rouvert une, trouvée en répondant à
une question du propriétaire — « as-tu expliqué dans le carnet comment utiliser
*efshar* ? ».

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
   voit rien de tout cela. Le défaut est **antérieur au lot du 27/07** : יָכוֹל
   et צָרִיךְ portaient déjà leur note invisible.

   **Non bloquant** parce que l'exemple en situation, lui, s'affiche, et qu'il
   porte l'essentiel de l'usage. **Ce qui le résoudrait** : afficher la note sous
   la ligne du mot dans le carnet — c'est une décision de charte (voix, place
   dans la hiérarchie typographique, comportement en colonne étroite), pas une
   correction mécanique, d'où son inscription ici plutôt qu'un correctif
   improvisé.

*Si un nouveau défaut connu apparaît, c'est ici qu'il se note — avec ce qui le
rend non bloquant, faute de quoi il devient un chantier.*
