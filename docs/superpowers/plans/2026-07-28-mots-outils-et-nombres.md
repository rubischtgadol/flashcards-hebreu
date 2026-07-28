# Plan d'implémentation — « Mortier grammatical II » : mots-outils et nombres complets

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objectif :** combler les trous grammaticaux relevés par l'audit du 28/07/2026 (~280 cartes : prépositions fléchies, existence/possession, subordonnants, connecteurs, interrogatifs composés, heure et date, quantité, comparatif, tournures impersonnelles, impératif, abréviations, pragmatique) **et** rendre la couverture des nombres complète (cardinaux masculins ET féminins, grands nombres, ordinaux des deux genres, fractions et multiplicatifs).

**Architecture :** tout passe par le pipeline existant — `data/listes/*.json` (+ 1 nom dans `data/noms.json`) → `node tools/build.js` → les 5 artefacts. Six sections neuves, chacune avec **une seule responsabilité** (§ Le principe d'un fichier = une chose) ; deux sections de grammaire **existantes** gagnent enfin leurs listes de mots (`15-prepositions-flechies.html`, `08-l-imperatif.html`, aujourd'hui en prose sans aucun placeholder `@ENTREES` — vérifié) ; tout le reste étend un fichier en place sans le diluer. Le chantier commence par **poser la garde qui manque au 7ᵉ point de câblage** (`catOrder`), pour que les six sections neuves soient les premières dont la cascade s'applique sans geste manuel non gardé.

**Outillage :** Node zéro dépendance (`tools/ajoute_mots.js`, `tools/cherche_mots.js`, `tools/build.js`, `tools/verifie_exemples.js`) + un outil neuf de 30 lignes (`tools/controle_tr.js`, Tâche 1) + une garde neuve dans `build.js` (Tâche 2). Rédaction des lots par sous-agents **Sonnet 5**, arbitrage et insertion sur le fil principal (pipeline validé du lot-200, 22/07).

## Contraintes globales

Chaque tâche hérite de TOUTES ces lignes. Les trois premières ne sont écrites nulle part dans le dépôt : un sous-agent hérite de CLAUDE.md, **pas** des mémoires — elles sont donc répétées ici, et doivent être répétées dans chaque prompt de sous-agent.

- ⚠️ **UN FICHIER NE FAIT QU'UNE SEULE CHOSE. Règle permanente du propriétaire, elle vaut pour tout et toujours.** Deux exigences : (1) une responsabilité par fichier — avant d'ajouter une entrée, demander « quelle est la chose unique de ce fichier ? » ; si la réponse contient « et », créer la section qui manque plutôt que diluer ; (2) **la cascade doit s'appliquer automatiquement sans rien casser** — un fichier neuf se déclare dans son manifeste (`src/carnet/sections.json`, `listCats`/`EXPECTED_CATS`, `catOrder`), et une garde de build doit refuser une déclaration incomplète. Un point de câblage sans garde est un défaut à corriger, pas une fatalité.
- ⚠️ **Les sous-agents mécaniques tournent sur Sonnet 5** (`model: 'sonnet'`) : rédaction de bordereau, grep en volume, comptages, pilotage WebKit. Le modèle du fil principal (Opus) est réservé aux arbitrages de contenu et de charte — ce que le fil principal garde de toute façon.
- ⚠️ **Aucun sous-agent n'ouvre `vocabulaire_hebreu.html`, `app.html`, `flashcards_hebreu.html`, `cards.json` ni `index.html`** : ce sont des artefacts générés. Une question d'existence/compte/emplacement se paie par une commande (`node tools/cherche_mots.js`, `graphify explain`, `grep -n`), jamais par une lecture de fichier ni par un inventaire délégué. Ne jamais coller dans une réponse une liste ou un log de plus de ~20 lignes.
- **Branche : `main` directement** (décision du 28/07 — le rituel du projet le prescrit, docs/RITUEL.md), un commit par tâche, push à la clôture. ⚠️ **Ne jamais toucher à la branche `refonte-retrofuturiste` ni à son worktree `~/dev/flashcards-hebreu-refonte`** : ni checkout, ni merge, ni lecture.
- **Une fois par machine avant tout** : `git config core.hooksPath` doit imprimer `.githooks` ; sinon `git config core.hooksPath .githooks`. C'est lui qui exécute `build.js --check` et `verifie_exemples.js` à chaque commit — le filet, puisqu'on travaille sur `main`.
- **Ce dépôt n'a ni tests, ni framework de test, ni gestionnaire de paquets** (par conception). Le contrat de vérification est : `node tools/build.js` (comptes + gardes), `node tools/verifie_exemples.js` (0 erreur), `node tools/build.js --check` (les 5 artefacts en phase + l'estampille `sw.js`). **L'absence de tests unitaires n'est pas un défaut à signaler** — la preuve exigée est la sortie réelle de ces commandes.
- **Jamais d'édition d'artefact** : les cinq fichiers ci-dessus sont 100 % générés par `node tools/build.js`. Une édition à la main est perdue au build suivant *et* invisible à tout l'outillage.
- **`niveau` obligatoire** sur chaque entrée (A1/A2/B1/B2/C1). **Jamais de `theme` sur une entrée de liste** (mono-thème par nature — en poser un = erreur de build). Le seul ajout en table (גיל, Tâche 13b) porte `theme` ET ≥ 1 exemple.
- **Translittération** : standard du CLAUDE.md § Transliteration standard — `kh` = khaf sans daguech, `ch` = het (patach furtif final → `ach`), `ts` = tsadi, `'` = ayin et alef intervocalique, hé final gardé, `ei` pour tséré+youd, `u`/`f`/`k`/`v`, chva initial écrit seulement s'il s'entend. ⚠️ Les sous-agents confondent systématiquement `ch`/`kh` : **chaque bordereau passe par `tools/controle_tr.js` avant insertion**, et le `he` des bordereaux est **vocalisé** (une niqqud fausse se trahit par un désaccord tr).
- ⚠️ **La colonne `tr` des inventaires de ce plan est INDICATIVE, pas normative** (corrigé le 28/07 après la tâche 3, qui a pris le plan en défaut sur deux points systématiques : hé final omis, apostrophe d'ayin manquante). Les autorités, dans cet ordre : (1) le standard ci-dessus — **hé final gardé** (`atah`, `zeh`, donc `shloshah` et non `shlosha`) et **`'` pour l'ayin partout, y compris initial et final** (`'eser`, `'asarah`, `reva'`, `arba'`) ; (2) le corpus déjà écrit, vérifiable par `node tools/cherche_mots.js <mot>` ; (3) `he2tr`, consulté mécaniquement par `controle_tr.js`. Les `fr` et les `niveau` du plan, eux, **restent imposés**. Un rédacteur qui corrige un `tr` du plan vers la forme du corpus fait son travail — il doit le dire dans son rapport.
- **On ne touche PAS à `he2tr`/`trKey`** : ce chantier n'ajoute que des données. Un désaccord brut s'arbitre dans le bordereau (le `.tr` rédigé est souverain), jamais en « corrigeant » la règle du chva (piège mesuré).
- **Dédoublonnage sans lire l'inventaire** : `cherche_mots.js` par lots de 15-25 termes + rubrique « orthographe voisine » obligatoire (ktiv malé/haser) ; la commande est **aveugle aux expressions multi-mots** → pour chacune, chercher le premier mot seul PUIS `grep` du multi-mot dans `data/`.
- **Label de section identique à l'octet près dans 5 endroits** : champ `section` du JSON, `span.count` du gabarit, `EXPECTED_CATS` et `listCats` (tools/build.js), `catOrder` (src/app/js/07-filtres.js).
- **Chaque entrée nouvelle porte 1 exemple** (`{he, tr, fr}`, ≤ 8 mots). `node tools/verifie_exemples.js` : **0 erreur** exigé après chaque lot.
- **Rituel par tâche** : `node tools/build.js` (comptes vérifiés contre la baseline de la Tâche 1) → `verifie_exemples.js` → commit en **français**, `sw.js` DANS le commit (le build vient de le retimbrer), mention « graphe laissé en l'état ».
- **Graphe : jamais de recalage** (~235k tokens, décision explicite seulement). Fichier créé ⇒ étendre le flag `⚠️ GRAPHE À RECALER : …` dans docs/TODO.md « Reprendre ici » dans le commit de la tâche. Lot de contenu pur ⇒ ni recalage ni flag.
- **UI et documentation en français.**

## Le principe d'un fichier = une chose, appliqué

Ce que la règle a changé par rapport à la première version du plan — trois dilutions supprimées et une garde ajoutée :

| Première version (rejetée) | Corrigé en |
|---|---|
| `mots-de-quantite.json` recevait quantifieurs **+** fractions **+** constructions comparatives | Trois choses ⇒ trois fichiers : les quantifieurs restent (T14), les fractions rejoignent la famille des nombres (T5), le comparatif devient sa section (T15) |
| `verbes-modaux.json` recevait בא לי, נמאס לי, אין לי כוח | Ce ne sont pas des verbes modaux mais des **tournures impersonnelles** (classe grammaticale réelle en hébreu, bâtie sur les fléchies) ⇒ section propre (T17), enrichie à 12 entrées |
| La tâche « Heure et date » insérait aussi un nom dans `data/noms.json` | Deux régimes de garde (liste vs table) dans un commit ⇒ T13 (liste) et T13b (table) séparés |
| `catOrder` restait le point de câblage manuel et muet | **T2 pose `verifieCatOrder()`** : le build refuse une catégorie absente de `catOrder`. La cascade devient automatique *avant* que le chantier crée six sections |

**La famille des nombres devient quatre fichiers, chacun une chose** — cardinaux 0–10 (m/f), cardinaux 11 et plus (m/f, centaines, milliers), ordinaux (m/f), fractions et multiplicatifs. Elle répond à la demande « une section entière sur les nombres » par la couverture, pas par la fusion : `listCats` route déjà les trois fichiers existants vers l'unique catégorie app **Nombres**, donc le 4ᵉ n'ajoute **ni** entrée dans `EXPECTED_CATS` **ni** dans `catOrder` — 5 points de câblage au lieu de 7.

## Arbitrages retenus (réversibles, chacun d'un mot)

1. **Nombres : quatre fichiers, pas de fusion.** Fusionner supprimerait/renommerait 3 fichiers pour zéro gain d'usage (l'app les montre déjà comme une seule puce).
2. **Le doublet m/f cohabite dans le fichier de sa tranche** (les masculins intercalés derrière leurs féminins par `apres`). C'est le seul endroit où la règle se lit dans deux sens ; retenu : la chose unique de `nombres-0-10.json` est « compter de 0 à 10 », et les deux genres sont deux colonnes d'un même paradigme — les séparer forcerait à tenir deux fichiers pour un seul geste d'apprentissage.
3. **Les fléchies : un fichier, huit `groupe`** (une série par groupe). Sa chose unique est « la préposition fléchie » ; le `groupe` porte la sous-structure, idiome déjà en place dans `adverbes.json`.
4. **8 formes par série** (je, tu m., tu f., il, elle, nous, vous m., ils) ; les féminins pluriels ־כן/־הן restent dans la prose du gabarit 15 (+18 cartes pour un rendement faible).
5. **Sections neuves insérées à leur place logique de lecture** (décision du 28/07), l'invariant « préfixe numérique ≡ position » préservé — donc **15 renommages** de sections existantes. Rendus inoffensifs par la Tâche 2b : la renumérotation se fait **à trous, sans aucun contenu neuf**, et sa preuve est que les cinq artefacts restent **byte-identiques** (`sections.json` garde le même ordre de contenu, seuls les noms de fichiers changent). Numéros réservés : 23 tournures-impersonnelles · 26 comparatif-et-superlatif · 29 connecteurs-du-discours · 34 nombres-fractions · 36 heure-et-date · 42 abreviations-et-sigles. Carnet final : 44 sections (00–43).
6. **Les connecteurs déjà au carnet restent où ils sont** (לכן, אחרת, בכל זאת…) : la section neuve n'accueille que les absents.
7. **בע"ה et אי"ה inclus** dans les abréviations (décision du 28/07) : traités comme graphie de l'écrit courant, au même titre que בע"מ ou נ.ב., et non comme contenu religieux — la section compte donc 11 entrées, sans conditionnel.
8. **Hors périmètre, dit explicitement** : la semikhout (déjà couverte par la section 13), les binyanim et le passé/futur des verbes (changement de schéma de `data/verbes.json` = chantier séparé), toute retouche de `he2tr`.

## Cycle standard d'un lot (chaque tâche reste autoportante sur ses commandes)

1. **Dédoublonnage** : `cherche_mots.js` par lots + grep des multi-mots ; chaque exclusion NOMMÉE avec sa raison.
2. **Bordereau** : sous-agent **Sonnet** (gabarit de prompt en annexe de la Tâche 1). Arbitrage sur le fil principal : gloses, niveaux, registre.
3. **Contrôle tr** : `node tools/controle_tr.js <bordereau>` — zéro `✘ BRUT` non arbitré.
4. **Insertion** : `node tools/ajoute_mots.js <bordereau>` (contrôle à blanc, lire le rapport) puis `--ecrire`. Sections neuves : le bordereau EST le fichier de liste.
5. **Preuve** : `node tools/build.js` (comptes = baseline + N attendu), `node tools/verifie_exemples.js` (0 erreur).
6. **Commit** (français, `sw.js` inclus, graphe : mention).

---

### Tâche 1 : Outillage — `controle_tr.js`, baseline, garde-fou vu échouer

**Fichiers :**
- Créer : `tools/controle_tr.js`
- Créer (hors dépôt) : `<scratchpad>/baseline.txt`
- Modifier : `docs/TODO.md` (flag graphe : fichier créé)

**Une chose :** ce fichier ne fait que comparer `he2tr(he)` au `tr` rédigé d'un bordereau. Il n'insère rien, ne valide aucun schéma, ne touche aucune donnée.

**Interfaces :**
- Consomme : `fonctionsApp(names)` exporté par `tools/build.js` (vérifier la signature exacte à l'étape 1).
- Produit : `node tools/controle_tr.js <bordereau.json>` → une ligne par désaccord (`✔ replié` si `trKey` les confond, `✘ BRUT` sinon), code retour 1 si ≥ 1 brut. Consommé par les tâches 3 à 20.

- [ ] **Étape 1 : vérifier la signature** — `grep -n "fonctionsApp" tools/build.js | head -5`. Attendu : une exportation `fonctionsApp` évaluant `src/app/js/02-translitteration.js` en sandbox `vm`. Adapter l'appel si l'ordre des paramètres diffère.
- [ ] **Étape 2 : écrire `tools/controle_tr.js`** :

```js
#!/usr/bin/env node
// controle_tr.js — contrôle d'un bordereau avant insertion : he2tr(he) vs tr rédigé.
// Une seule responsabilité : dire où la translittération rédigée s'écarte de la
// translittération dérivée. Aucune écriture, aucune validation de schéma.
// Usage : node tools/controle_tr.js <bordereau.json>
// Bordereau accepté : [{he, tr, …}] ou {entries:[…]} ou {mots:[…]} — seuls he
// (vocalisé) et tr sont lus.
// ✔ replié  = trKey confond les deux graphies : divergence d'affichage seulement.
// ✘ BRUT    = désaccord réel → arbitrage humain (le tr rédigé est souverain : un
//             BRUT n'est pas forcément une faute — cf. chva morphologique).
// Code retour 1 s'il reste au moins un ✘ BRUT.
const fs = require('fs'), path = require('path');
const { fonctionsApp } = require(path.join(__dirname, 'build.js'));
const { he2tr, trKey } = fonctionsApp(['he2tr', 'trKey']);
const j = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const entries = Array.isArray(j) ? j : (j.entries || j.mots);
let bruts = 0;
for (const e of entries) {
  const auto = he2tr(e.he);
  if (auto === e.tr) continue;
  const replie = trKey(auto) === trKey(e.tr);
  if (!replie) bruts++;
  console.log(`${replie ? '✔ replié' : '✘ BRUT  '}  ${e.he}  rédigé=${e.tr}  he2tr=${auto}`);
}
console.log(`${entries.length} entrées, ${bruts} désaccord(s) brut(s)`);
process.exit(bruts ? 1 : 0);
```

- [ ] **Étape 3 : voir l'outil échouer** (une garde qu'on n'a pas vue échouer n'a rien prouvé). Bordereau fabriqué dans le scratchpad : `[{"he":"שָׁלוֹם","tr":"chalom"}]` (faute ch/kh volontaire : shin ≠ het) → attendu `✘ BRUT`, exit 1. Puis `[{"he":"שָׁלוֹם","tr":"shalom"}]` → attendu 0 désaccord, exit 0.
- [ ] **Étape 4 : baseline** — `node tools/build.js | tee <scratchpad>/baseline.txt`. Noter les comptes par section, en particulier : les 3 fichiers Nombres et leur total (41), Prépositions 41, Conjonctions 19, Mots interrogatifs 14, Démonstratifs 7, Existence 2, Pronoms personnels 19, Adverbes 61, Mots de quantité 34, Verbes modaux 9, Hébreu parlé 45, **total 1440**.
- [ ] **Étape 5 : vérifier le hook** — `git config core.hooksPath` imprime `.githooks`.
- [ ] **Étape 6 : flag graphe** — docs/TODO.md « Reprendre ici » : `⚠️ GRAPHE À RECALER : tools/controle_tr.js`.
- [ ] **Étape 7 : commit** — `git status` (les artefacts ne doivent pas avoir bougé), puis `git add tools/controle_tr.js docs/TODO.md && git commit -m "Outil controle_tr : le bordereau prouvé contre he2tr avant insertion"`.

**Annexe — gabarit de prompt du sous-agent rédacteur (Sonnet), à répéter à chaque lot :**

> Tu rédiges un bordereau JSON pour un carnet d'hébreu. Tu ne lis AUCUN fichier : tout est dans ce prompt. Entrées à produire : <liste he | fr | niveau imposés>. Critères : (1) sortie = UN objet JSON et rien d'autre, format `[{"he":…,"tr":…,"fr":…,"niveau":…,"exemples":[{"he":…,"tr":…,"fr":…}]}]` ; (2) `he` VOCALISÉ (niqqud complète), exemples compris ; (3) translittération : `kh`=khaf sans daguech, `ch`=het (patach furtif final → `ach`), `ts`=tsadi, `'`=ayin et alef intervocalique, hé final gardé (`atah`), `ei`=tséré+youd, `u`/`f`/`k`/`v` (jamais `ou`/`ph`/`q`/`w`), chva initial écrit seulement s'il s'entend (`ledaber` mais `gdolim`) — **la confusion ch/kh est la faute n°1, vérifie chaque het et chaque khaf** ; (4) 1 exemple par entrée, ≤ 8 mots, vocabulaire courant ; (5) les `fr` et `niveau` sont IMPOSÉS, ne les modifie pas ; (6) champs supplémentaires indiqués (`groupe`, `note`) recopiés tels quels. Max <N> entrées.

---

### Tâche 2 : La cascade rendue automatique — garde `verifieCatOrder()`

**Fichiers :**
- Modifier : `tools/build.js` (fonction neuve + son appel)

**Une chose :** cette garde ne vérifie qu'une implication — toute catégorie de carte attendue possède sa puce dans l'app. Elle ne valide ni donnée, ni charte, ni doc.

**Pourquoi elle passe en premier :** `catOrder` est le seul des 7 points de câblage que rien ne surveille. Oublié, les cartes existent, `--check` passe, le carnet est juste — et **aucune puce n'apparaît dans l'app**, parce que `buildChips()` n'itère que sur `catOrder`. Le chantier crée six sections : sans cette garde, six occasions d'un échec muet.

**Interfaces :**
- Consomme : les constantes `EXPECTED_CATS` et `listCats` (tools/build.js:67 et :90), et `src/app/js/07-filtres.js:137` (`const catOrder = [...]`).
- Produit : `verifieCatOrder(racine)`, appelée dans la phase de vérification du build. Toutes les tâches créant une catégorie (T6, T15, T17, T19, T20) s'y appuient.

- [ ] **Étape 1 : repérer le site d'appel et le précédent** — `grep -n "verifieDoc(\|verifieCharte(" tools/build.js`. `verifieDoc()` lit déjà `src/app/js/` pour comparer les symboles à ARCHITECTURE.md : c'est le précédent de garde qui parse un module source. Noter où les deux sont appelées, y placer l'appel neuf.
- [ ] **Étape 2 : écrire la garde** dans `tools/build.js`, juste avant `verifieDoc` :

```js
/**
 * verifieCatOrder(racine) — le 7e point de câblage, enfin gardé.
 *
 * `catOrder` (src/app/js/07-filtres.js) est la seule liste dont dépend l'affichage
 * des puces de catégorie : buildChips() n'itère que sur elle. Une section neuve
 * complète et correcte mais absente de catOrder produit un carnet juste, un
 * --check vert et une app SANS sa puce — un échec parfaitement muet, le seul des
 * sept points de câblage que rien ne surveillait.
 *
 * Sens fatal : toute catégorie attendue (EXPECTED_CATS ∪ valeurs de listCats)
 * doit figurer dans catOrder. Sens inverse (une entrée de catOrder qui ne
 * correspond à aucune catégorie) : simple avertissement — buildChips() filtre
 * déjà sur catCounts, une entrée morte n'affiche rien et ne casse rien.
 *
 * Le bac à sable d'ajoute_mots.js recopie src/ : la garde y fonctionne (contrairement
 * à verifieDoc, qui doit tolérer l'absence de docs/).
 */
function verifieCatOrder(racine){
  const f = path.join(racine, 'src', 'app', 'js', '07-filtres.js');
  const src = fs.readFileSync(f, 'utf8');
  const m = src.match(/const\s+catOrder\s*=\s*\[([\s\S]*?)\]/);
  if (!m) throw new Error('verifieCatOrder : const catOrder introuvable dans 07-filtres.js');
  const ordre = (m[1].match(/'([^']+)'/g) || []).map(s => s.slice(1, -1));
  const attendues = [...new Set([...EXPECTED_CATS, ...Object.values(listCats)])];
  const absentes = attendues.filter(c => !ordre.includes(c));
  if (absentes.length) {
    throw new Error('catOrder (07-filtres.js) : catégorie(s) sans puce dans l\'app : '
      + absentes.join(', ') + ' — ajoute-les à catOrder.');
  }
  const mortes = ordre.filter(c => !attendues.includes(c));
  if (mortes.length) console.log('  ⚠ catOrder : entrée(s) sans catégorie : ' + mortes.join(', '));
}
```

- [ ] **Étape 3 : brancher l'appel** — à côté de l'appel de `verifieDoc(racine)` relevé à l'étape 1, de sorte que `node tools/build.js` ET `--check` l'exécutent tous les deux.
- [ ] **Étape 4 : voir la garde échouer** (obligatoire — les deux ensembles sont identiques aujourd'hui, la garde est donc muette par construction). Retirer temporairement `'Phrases'` de `catOrder` (src/app/js/07-filtres.js:137) → `node tools/build.js` doit **ÉCHOUER** en nommant `Phrases`. Coller les 2 lignes de sortie réelle dans le message de commit. **Restaurer** `'Phrases'`, relancer → vert.
- [ ] **Étape 5 : preuve du sens inverse** — ajouter temporairement `'Truc'` à `catOrder` → le build passe en imprimant `⚠ catOrder : entrée(s) sans catégorie : Truc`. Retirer.
- [ ] **Étape 6 : `node tools/build.js --check`** → vert (aucun artefact n'a changé : la garde ne produit rien).
- [ ] **Étape 7 : commit** — `git commit -m "Garde catOrder : une catégorie sans puce fait échouer le build (7e point de câblage)"` (aucun fichier créé ⇒ pas de flag graphe ; mention « graphe laissé en l'état »).

---

### Tâche 2b : Renumérotation à trous des sections du carnet (zéro contenu)

**Fichiers :**
- Renommer : 15 fichiers de `src/carnet/sections/`
- Modifier : `src/carnet/sections.json` (les 15 noms, **ordre de contenu inchangé**), `docs/TODO.md` (flag graphe : 15 renommages)

**Une chose :** cette tâche ne fait que déplacer des noms de fichiers pour réserver la place des six sections neuves à leur position de lecture (arbitrage 5). **Aucune entrée, aucun gabarit, aucune constante, aucun contenu.**

**La preuve qui rend l'opération sûre :** `sections.json` conserve exactement le même ordre de contenu, donc **les cinq artefacts doivent rester byte-identiques**. Si `git status` montre un artefact modifié après le build, un renommage a été mal reporté — le contrôle est binaire.

**Table cible** (les six numéros manquants sont les trous réservés) :

| Actuel | Devient |
|---|---|
| `23-noms.html` | `24-noms.html` |
| `24-adjectifs.html` | `25-adjectifs.html` |
| `25-prepositions.html` | `27-prepositions.html` |
| `26-conjonctions.html` | `28-conjonctions.html` |
| `27-mots-interrogatifs.html` | `30-mots-interrogatifs.html` |
| `28-nombres-0-10.html` | `31-nombres-0-10.html` |
| `29-nombres-11-et-plus.html` | `32-nombres-11-et-plus.html` |
| `30-nombres-ordinaux.html` | `33-nombres-ordinaux.html` |
| `31-jours-de-la-semaine.html` | `35-jours-de-la-semaine.html` |
| `32-mots-de-quantite.html` | `37-mots-de-quantite.html` |
| `33-adverbes.html` | `38-adverbes.html` |
| `34-saisons-mois.html` | `39-saisons-mois.html` |
| `35-expressions-divers.html` | `40-expressions-divers.html` |
| `36-phrases.html` | `41-phrases.html` |
| `37-hebreu-parle.html` | `43-hebreu-parle.html` |

Trous réservés : **23** tournures-impersonnelles (T17) · **26** comparatif-et-superlatif (T15) · **29** connecteurs-du-discours (T11) · **34** nombres-fractions (T5) · **36** heure-et-date (T13) · **42** abreviations-et-sigles (T20). Les sections 00–22 ne bougent pas (dont `08-l-imperatif.html` et `15-prepositions-flechies.html`, hôtes de T19 et T6).

- [ ] **Étape 1 : vérifier qu'aucun autre fichier ne nomme ces sections** — `grep -rn "33-adverbes\|31-jours\|37-hebreu-parle" --include="*.js" --include="*.json" --include="*.html" --include="*.md" . | grep -v "^./graphify-out" | grep -v "^./docs/superpowers"`. Attendu : **uniquement `src/carnet/sections.json`**. Si un autre fichier apparaît (un script, la doc), il entre dans le périmètre de la tâche — le noter avant de renommer. ⚠️ Les liens du sommaire de `00-preambule.html` pointent des ancres `#sec-<slug>`, pas des noms de fichiers : vérifier que c'est bien le cas (`grep -c 'href="#sec-' src/carnet/sections/00-preambule.html`) et donc qu'ils ne bougent pas.
- [ ] **Étape 2 : renommer en une passe `git mv`**, du plus haut numéro vers le plus bas pour ne jamais écraser une cible occupée (37→43, 36→41, 35→40, 34→39, 33→38, 32→37, 31→35, 30→33, 29→32, 28→31, 27→30, 26→28, 25→27, 24→25, 23→24) :

```bash
cd src/carnet/sections
git mv 37-hebreu-parle.html 43-hebreu-parle.html
git mv 36-phrases.html 41-phrases.html
git mv 35-expressions-divers.html 40-expressions-divers.html
git mv 34-saisons-mois.html 39-saisons-mois.html
git mv 33-adverbes.html 38-adverbes.html
git mv 32-mots-de-quantite.html 37-mots-de-quantite.html
git mv 31-jours-de-la-semaine.html 35-jours-de-la-semaine.html
git mv 30-nombres-ordinaux.html 33-nombres-ordinaux.html
git mv 29-nombres-11-et-plus.html 32-nombres-11-et-plus.html
git mv 28-nombres-0-10.html 31-nombres-0-10.html
git mv 27-mots-interrogatifs.html 30-mots-interrogatifs.html
git mv 26-conjonctions.html 28-conjonctions.html
git mv 25-prepositions.html 27-prepositions.html
git mv 24-adjectifs.html 25-adjectifs.html
git mv 23-noms.html 24-noms.html
```

- [ ] **Étape 3 : reporter les 15 noms dans `src/carnet/sections.json`** — même position dans le tableau, nom neuf. **Ne réordonner aucune ligne.**
- [ ] **Étape 4 : la preuve byte-identique** — `node tools/build.js` puis `git status --short`. **Attendu : uniquement les 15 renommages (`R`) et `src/carnet/sections.json` (`M`). AUCUN artefact modifié** — ni `vocabulaire_hebreu.html`, ni `cards.json`, ni `app.html`, ni `flashcards_hebreu.html`, ni `index.html`, ni `sw.js`. Si un artefact bouge, un nom est faux : corriger avant de continuer. Coller la sortie réelle de `git status --short` dans le message de commit.
- [ ] **Étape 5 : `node tools/build.js --check`** → vert (corollaire de l'étape 4 : rien n'a changé, donc l'estampille `sw.js` tient).
- [ ] **Étape 6 : flag graphe** — étendre le flag TODO : `⚠️ GRAPHE À RECALER : 15 sections de src/carnet/sections/ renommées` (renommages ⇒ flag obligatoire, **sans recalage**).
- [ ] **Étape 7 : commit** — `git commit -m "Renumérotation à trous des sections du carnet : six places réservées, artefacts inchangés"`.

---

### Tâche 3 : Nombres — cardinaux masculins (1–10 et 11–19)

**Fichiers :** Modifier `data/listes/nombres-0-10.json` (+10), `data/listes/nombres-11-et-plus.json` (+9)

**Une chose par fichier :** « compter de 0 à 10 », « compter de 11 et au-delà » — les deux genres sont deux colonnes du même paradigme (arbitrage 2).

- [ ] **Étape 1 : dédoublonnage** — `node tools/cherche_mots.js אחד שניים שלושה ארבעה חמישה שישה שבעה תשעה עשרה` puis les composés 11–19 par leur premier mot + grep. ⚠️ **Piège spécifique** : שמונה masculin (שְׁמוֹנָה, shmona) est **homographe non vocalisé** du féminin déjà présent (שְׁמוֹנֶה, shmone) — un « présent » de `cherche_mots` ne prouve PAS le masculin ; trancher sur la niqqud dans le JSON. Même vigilance pour אחד/אחת.
- [ ] **Étape 2 : bordereau** (sous-agent **Sonnet**, gabarit T1) :

| he | tr attendu | fr | niveau |
|---|---|---|---|
| אֶחָד | echad | un (avec un nom masculin) | A1 |
| שְׁנַיִם | shnayim | deux (masculin ; devant un nom : שְׁנֵי) | A1 |
| שְׁלוֹשָׁה | shlosha | trois (avec un nom masculin) | A2 |
| אַרְבָּעָה | arba'a | quatre (avec un nom masculin) | A2 |
| חֲמִישָּׁה | chamisha | cinq (avec un nom masculin) | A2 |
| שִׁישָּׁה | shisha | six (avec un nom masculin) | A2 |
| שִׁבְעָה | shiv'a | sept (avec un nom masculin) | A2 |
| שְׁמוֹנָה | shmona | huit (avec un nom masculin) | A2 |
| תִּשְׁעָה | tish'a | neuf (avec un nom masculin) | A2 |
| עֲשָׂרָה | asara | dix (avec un nom masculin) | A2 |
| אַחַד עָשָׂר | achad asar | onze (masculin) | B1 |
| שְׁנֵים עָשָׂר | shneim asar | douze (masculin) | B1 |
| שְׁלוֹשָׁה עָשָׂר | shlosha asar | treize (masculin) | B1 |
| אַרְבָּעָה עָשָׂר | arba'a asar | quatorze (masculin) | B1 |
| חֲמִישָּׁה עָשָׂר | chamisha asar | quinze (masculin) | B1 |
| שִׁישָּׁה עָשָׂר | shisha asar | seize (masculin) | B1 |
| שִׁבְעָה עָשָׂר | shiv'a asar | dix-sept (masculin) | B1 |
| שְׁמוֹנָה עָשָׂר | shmona asar | dix-huit (masculin) | B1 |
| תִּשְׁעָה עָשָׂר | tish'a asar | dix-neuf (masculin) | B1 |

  `note` sur אֶחָד : « Le féminin (אַחַת…) est la série de comptage par défaut ; le masculin s'accorde : שְׁלוֹשָׁה יְלָדִים. » Pièges tr du lot : chamisha (het → `ch`), pas de `e` après le shin de shnayim/shlosha (chva non entendu).
- [ ] **Étape 3 : contrôle** — `node tools/controle_tr.js <bordereau>` : 0 brut non arbitré.
- [ ] **Étape 4 : insertion** — bordereau au format `ajoute_mots` (`type:"liste"`) avec **`apres`** pour intercaler chaque masculin derrière son féminin (אֶחָד après אַחַת…) : le carnet se lit alors en paires m/f. Contrôle à blanc, lire le rapport (il attrape ce que le grep rate), puis `--ecrire`.
- [ ] **Étape 5 : preuve** — `node tools/build.js` : « Nombres » = 41 + 19 = **60** ; `verifie_exemples` : 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Nombres : la série masculine 1–19 en paires avec la féminine (+19)"` (contenu pur : ni flag ni recalage de graphe).

---

### Tâche 4 : Nombres — grands nombres et ordinaux féminins

**Fichiers :** Modifier `data/listes/nombres-11-et-plus.json` (+5), `data/listes/nombres-ordinaux.json` (+10, plus si l'étape 1 révèle des masculins absents)

- [ ] **Étape 1 : dédoublonnage** — `node tools/cherche_mots.js מאתיים אלפיים מיליארד ראשונה שנייה שלישית רביעית חמישית שישית שביעית שמינית תשיעית עשירית שישי שביעי שמיני תשיעי` + grep des multi-mots (שלוש מאות, שלושת אלפים). ⚠️ שנייה « deuxième » : le carnet a déjà שנייה « seconde (de temps) » — homographes de sens distincts, les deux coexistent. ⚠️ L'audit n'a testé que 6 ordinaux masculins sur 10 : si שישי/שביעי/שמיני/תשיעי manquent **comme ordinaux** (יום שישי « vendredi » ne compte pas), les ajouter au lot ici.
- [ ] **Étape 2 : bordereau** (Sonnet, gabarit T1) :

| he | tr attendu | fr | niveau |
|---|---|---|---|
| מָאתַיִם | matayim | deux cents | A2 |
| שְׁלוֹשׁ מֵאוֹת | shlosh me'ot | trois cents (modèle de 300 à 900) | A2 |
| אַלְפַּיִם | alpayim | deux mille | A2 |
| שְׁלוֹשֶׁת אֲלָפִים | shloshet alafim | trois mille (modèle de 3000 à 10 000) | B1 |
| מִילְיַארְד | milyard | milliard | A2 |
| רִאשׁוֹנָה | rishona | première | A2 |
| שְׁנִיָּה | shniya | deuxième (aussi « seconde » de temps : autre entrée) | A2 |
| שְׁלִישִׁית | shlishit | troisième (féminin) | A2 |
| רְבִיעִית | revi'it | quatrième (féminin) | A2 |
| חֲמִישִׁית | chamishit | cinquième (féminin) | A2 |
| שִׁישִּׁית | shishit | sixième (féminin) | B1 |
| שְׁבִיעִית | shvi'it | septième (féminin) | B1 |
| שְׁמִינִית | shminit | huitième (féminin) | B1 |
| תְּשִׁיעִית | tshi'it | neuvième (féminin) | B1 |
| עֲשִׂירִית | asirit | dixième (féminin) | B1 |

  Pièges tr : chamishit (het), revi'it/shvi'it/tshi'it (ayin `'`), me'ot (alef intervocalique).
- [ ] **Étape 3 : contrôle** — `controle_tr.js` : 0 brut non arbitré.
- [ ] **Étape 4 : insertion** — `ajoute_mots` avec `apres` (chaque ordinal féminin derrière son masculin ; grands nombres en fin de `nombres-11-et-plus`). À blanc, puis `--ecrire`.
- [ ] **Étape 5 : preuve** — build : « Nombres » = 60 + 15 = **75** (+ les masculins révélés à l'étape 1, comptés nommément) ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Nombres : grands nombres et ordinaux féminins (+15)"`.

---

### Tâche 5 : Section neuve « Nombres — fractions et multiplicatifs »

**Fichiers :**
- Créer : `data/listes/nombres-fractions.json` (8 entrées), `src/carnet/sections/34-nombres-fractions.html`
- Modifier : `src/carnet/sections.json`, `src/carnet/sections/00-preambule.html` (sommaire), `tools/build.js` (`listCats` **seul**)

**Une chose :** dire une partie d'un tout et une multiplication. Ni un quantifieur indéfini (רוב, קצת → T14), ni un cardinal.

**Le câblage le plus léger du chantier :** `listCats` mappe `'Nombres — fractions et multiplicatifs'` → `'Nombres'`, catégorie **déjà** présente dans `EXPECTED_CATS` et `catOrder`. Donc 5 points, pas 7 : JSON, gabarit, `sections.json`, sommaire, `listCats`. La garde de T2 le confirmera d'elle-même.

- [ ] **Étape 1 : dédoublonnage** — `node tools/cherche_mots.js חצי רבע שליש אחוז כפול פעמיים זוג` + grep des multi-mots (שלושה רבעים, פי שניים). ⚠️ Connus de l'audit : חצי n'apparaît que **dans l'exemple** חצי שעה (pas d'entrée propre) ; זוג existe au sens « couple ». Exclusions nommées.
- [ ] **Étape 2 : bordereau = fichier** (Sonnet, gabarit T1). `{"section": "Nombres — fractions et multiplicatifs", "entries": [...]}` :

  חֵצִי chetsi « demi, moitié » A1 · רֶבַע reva « quart » A1 · שְׁלִישׁ shlish « tiers » A2 · שְׁלוֹשָׁה רְבָעִים shlosha reva'im « trois quarts » B1 · אָחוּז achuz « pour cent, pourcentage » A2 · פַּעֲמַיִם pa'amayim « deux fois » A1 · פִּי שְׁנַיִם pi shnayim « le double, deux fois plus » B1 · כָּפוּל kaful « multiplié par, double » A2
  ⚠️ חצי → `chetsi` (het) : l'oreille dit « khetsi », la graphie dit het. C'est LE piège ch/kh du chantier.
- [ ] **Étape 3 : contrôle** — `controle_tr.js` : 0 brut non arbitré.
- [ ] **Étape 4 : câblage + gabarit** — `listCats` (tools/build.js:90) : `'Nombres — fractions et multiplicatifs':'Nombres'`. `34-nombres-fractions.html` sur le patron de `18-existence-et-possession.html` : `h2 id="sec-nombres-fractions"` + `<span lang="he">חֲצִי וְרֶבַע</span>` + `<span class="count">Nombres — fractions et multiplicatifs</span>` ; `div.note` (2 phrases : la fraction se dit avec le nom du rang ; פִּי multiplie) ; `<ul class="word-list"><!-- @ENTREES:listes/nombres-fractions --></ul>`. Puis `"34-nombres-fractions.html"` dans `sections.json` **à son index réservé par T2b** — juste après `"33-nombres-ordinaux.html"`, jamais en fin de tableau — et le lien de sommaire dans `00-preambule.html` (patron des liens existants, ancre `#sec-nombres-fractions`).
- [ ] **Étape 5 : preuve** — `node tools/build.js` : PASSE, « Nombres » = 75 + 8 = **83** ; la garde T2 ne réclame rien (catégorie inchangée) ; identité du label : `grep -c "Nombres — fractions et multiplicatifs" data/listes/nombres-fractions.json src/carnet/sections/34-nombres-fractions.html tools/build.js` → ≥ 1 chacun ; `verifie_exemples` 0 erreur. **La demande « une section entière sur les nombres » est soldée ici** : cardinaux m/f 0–19, dizaines, centaines, milliers, million/milliard, ordinaux m/f, fractions et multiplicatifs — quatre fichiers, une chose chacun.
- [ ] **Étape 6 : flag + commit** — flag TODO (2 fichiers créés) ; `git commit -m "Section neuve Nombres — fractions et multiplicatifs : la famille des nombres complète (+8)"`.

---

### Tâche 6 : Section « Prépositions fléchies » — câblage + séries שֶׁל, לְ, אֶת

**Fichiers :**
- Créer : `data/listes/prepositions-flechies.json` (24 entrées, `groupe` par série)
- Modifier : `src/carnet/sections/15-prepositions-flechies.html` (blocs `@ENTREES`, prose intacte), `tools/build.js` (`EXPECTED_CATS` + `listCats`), `src/app/js/07-filtres.js` (`catOrder`), `docs/TODO.md`

**Une chose :** le pronom accroché à une préposition. La section de grammaire 15 existe déjà en prose — elle enseigne le paradigme sans qu'aucune carte ne le fasse réviser.

**Interfaces :** label exact « Prépositions fléchies » (5 endroits, octet près) ; slugs de `groupe` `shel` / `le` / `et` (T7 ajoutera `im`, `al`, `min`, `be`, `autres`).

- [ ] **Étape 1 : lire le gabarit hôte** — `Read src/carnet/sections/15-prepositions-flechies.html` (106 lignes, lecture entière licite : on l'édite). Si le `h2` n'a pas la structure `h2#sec-… > span.count` du patron 18, l'y aligner avec `span.count` = `Prépositions fléchies`. La prose (paradigmes, féminins pluriels) ne bouge pas d'un octet.
- [ ] **Étape 2 : câblage constantes D'ABORD, pour voir les deux gardes échouer** — ajouter `'Prépositions fléchies'` dans `EXPECTED_CATS` (tools/build.js:67, après `'Prépositions'`) et dans `listCats` (`'Prépositions fléchies':'Prépositions fléchies'`), **sans** toucher `catOrder`. `node tools/build.js` → **attendu : ÉCHEC de `verifieCatOrder` (T2) nommant « Prépositions fléchies »**. C'est la garde neuve qui fait son travail sur son premier cas réel. Ajouter alors la catégorie à `catOrder` (07-filtres.js:137, après `'Prépositions'`) → relancer → **attendu : ÉCHEC de la garde `EXPECTED_CATS`** (section attendue à 0 carte). Les deux échecs prouvent la cascade complète.
- [ ] **Étape 3 : bordereau = fichier** (Sonnet, gabarit T1, champ `groupe` imposé). `{"section": "Prépositions fléchies", "entries": [...]}` — 24 entrées :

  **groupe `shel`** — שֶׁלִּי sheli « à moi / mon, ma » A1 · שֶׁלְּךָ shelcha « à toi (à un homme) » A1 · שֶׁלָּךְ shelach « à toi (à une femme) » A1 · שֶׁלּוֹ shelo « à lui / son, sa » A1 · שֶׁלָּהּ shela « à elle » A1 · שֶׁלָּנוּ shelanu « à nous / notre » A1 · שֶׁלָּכֶם shelachem « à vous » A1 · שֶׁלָּהֶם shelahem « à eux / leur » A1
  **groupe `le`** — לִי li « à moi, me » A1 · לְךָ lecha « à toi, te (h.) » A1 · לָךְ lach « à toi, te (f.) » A1 · לוֹ lo « à lui, lui » A1 · לָהּ la « à elle, lui » A1 · לָנוּ lanu « à nous, nous » A1 · לָכֶם lachem « à vous, vous » A1 · לָהֶם lahem « à eux, leur » A1
  **groupe `et`** — אוֹתִי oti « moi (complément direct) » A1 · אוֹתְךָ otcha « toi (h., COD) » A1 · אוֹתָךְ otach « toi (f., COD) » A1 · אוֹתוֹ oto « le, lui (COD) » A1 · אוֹתָהּ ota « la, elle (COD) » A1 · אוֹתָנוּ otanu « nous (COD) » A2 · אֶתְכֶם etchem « vous (COD ; normé, familier אותכם) » A2 · אוֹתָם otam « les, eux (COD) » A2

  ⚠️ שלך/לך/אותך m. et f. ont le même `he_plain` : la niqqud et le `tr` les distinguent, une carte chacun — c'est voulu. Exemples courts type זֶה שֶׁלִּי / יֵשׁ לִי סֵפֶר / אֲנִי אוֹהֵב אוֹתָךְ.
- [ ] **Étape 4 : contrôle** — `controle_tr.js` sur le fichier : 0 brut non arbitré.
- [ ] **Étape 5 : gabarit** — vérifier d'abord la syntaxe exacte du placeholder à groupe sur le précédent du dépôt (`grep -n "@ENTREES" src/carnet/sections/38-adverbes.html`), puis en fin de `15-prepositions-flechies.html` :

```html
<h3 class="subtheme">שֶׁל — la possession (à moi, à toi…)</h3>
<ul class="word-list"><!-- @ENTREES:listes/prepositions-flechies#shel --></ul>
<h3 class="subtheme">לְ — à, pour (me, te, lui…)</h3>
<ul class="word-list"><!-- @ENTREES:listes/prepositions-flechies#le --></ul>
<h3 class="subtheme">אֶת — le complément direct (moi, toi, le…)</h3>
<ul class="word-list"><!-- @ENTREES:listes/prepositions-flechies#et --></ul>
```

- [ ] **Étape 6 : preuve** — `node tools/build.js` : PASSE, « Prépositions fléchies » = 24 ; identité du label : `grep -c "Prépositions fléchies" data/listes/prepositions-flechies.json src/carnet/sections/15-prepositions-flechies.html tools/build.js src/app/js/07-filtres.js` → ≥ 1 chacun ; `verifie_exemples` 0 erreur.
- [ ] **Étape 7 : flag + commit** — flag TODO (1 fichier créé) ; `git commit -m "Prépositions fléchies : la section gagne ses cartes — séries de שֶׁל, לְ, אֶת (+24)"`.

---

### Tâche 7 : « Prépositions fléchies » — séries עִם, עַל, מִן, בְּ + autres

**Fichiers :** Modifier `data/listes/prepositions-flechies.json` (+41), `src/carnet/sections/15-prepositions-flechies.html` (5 blocs `@ENTREES` de plus)

- [ ] **Étape 1 : dédoublonnage ciblé** — `node tools/cherche_mots.js עצמי עצמך עצמו אצלי בשבילי כמוני` : עַצְמִי/עַצְמְךָ/עַצְמוֹ **existent déjà** en « Pronoms personnels » — ne PAS les dupliquer ici (T9 y complète la série).
- [ ] **Étape 2 : bordereau** (Sonnet, gabarit T1) — 41 entrées :

  **groupe `im`** (A2) — אִיתִּי iti « avec moi » · אִיתְּךָ itcha (h.) · אִיתָּךְ itach (f.) · אִיתּוֹ ito · אִיתָּהּ ita · אִיתָּנוּ itanu · אִיתְּכֶם itchem · אִיתָּם itam
  **groupe `al`** (B1) — עָלַיי alai « sur moi / à mon sujet » · עָלֶיךָ alecha · עָלַיִךְ alayich · עָלָיו alav · עָלֶיהָ aleha · עָלֵינוּ aleinu · עֲלֵיכֶם aleichem · עֲלֵיהֶם aleihem
  **groupe `min`** (B1) — מִמֶּנִּי mimeni « de moi / que moi (comparaison) » · מִמְּךָ mimcha · מִמֵּךְ mimech · מִמֶּנּוּ mimenu (note : aussi « de nous », homographe assumé) · מִמֶּנָּה mimena · מֵאִיתָּנוּ me'itanu · מִכֶּם mikem · מֵהֶם mehem
  **groupe `be`** (B1) — בִּי bi « en moi » · בְּךָ becha · בָּךְ bach · בּוֹ bo « en lui, y » · בָּהּ ba · בָּנוּ banu · בָּכֶם bachem · בָּהֶם bahem
  **groupe `autres`** — אֶצְלִי etsli « chez moi » A2 · בִּשְׁבִילִי bishvili « pour moi » A2 · לְיָדִי leyadi « à côté de moi » B1 · מוּלִי muli « en face de moi » B1 · לְפָנַיי lefanai « devant/avant moi » B1 · אַחֲרַיי acharai « après/derrière moi » B1 · בֵּינֵינוּ beineinu « entre nous » B1 · כָּמוֹנִי kamoni « comme moi » B1 · בִּגְלָלִי biglali « à cause de moi » B1

  ⚠️ Traitement de l'ayin initial (עָלַיי…) : **le corpus tranche, pas ce plan** — `grep '"tr"' data/listes/prepositions.json | head -20` pour voir comment les entrées en ayin déjà présentes sont translittérées, et suivre. L'arbitre mécanique reste `controle_tr.js`.
- [ ] **Étape 3 : contrôle** — `controle_tr.js` : 0 brut non arbitré.
- [ ] **Étape 4 : gabarit** — 5 blocs `h3.subtheme` + `ul` : `עִם — avec`, `עַל — sur`, `מִן — de, depuis`, `בְּ — dans, en`, `Autres prépositions (chez moi, pour moi…)`, slugs `#im #al #min #be #autres`.
- [ ] **Étape 5 : preuve** — build : « Prépositions fléchies » = **65** ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Prépositions fléchies : les sept séries au complet (+41, section à 65)"`.

---

### Tâche 8 : Existence et possession — « avoir », et le passé de « être »

**Fichiers :** Modifier `data/listes/existence-et-possession.json` (2 → 16)

**Une chose :** dire qu'une chose est là, ou qu'on l'a. La `div.note` du gabarit 18 annonce déjà יש לי — les cartes rejoignent enfin la prose.

- [ ] **Étape 1 : dédoublonnage** — `grep -rn "יש לי\|אין לי\|היה לי" data/` : l'audit les a vus dans 32 exemples, JAMAIS en entrée ; confirmer. Puis `node tools/cherche_mots.js היה היו יהיה הייתי נמצא קיים ישנו`.
- [ ] **Étape 2 : bordereau** (Sonnet) — 14 entrées :

  יֵשׁ לִי yesh li « j'ai » A1 · אֵין לִי ein li « je n'ai pas » A1 · יֵשׁ לְךָ yesh lecha « tu as (la série suit לְ fléchi) » A1 · הָיָה haya « il était / il y avait » A1 · הָיְתָה hayta « elle était » A2 · הָיוּ hayu « ils étaient / il y avait (pl.) » A2 · יִהְיֶה yihye « il sera / il y aura » A2 · הָיִיתִי hayiti « j'étais » A2 · הָיָה לִי haya li « j'avais » A2 · יִהְיֶה לִי yihye li « j'aurai » B1 · לֹא הָיָה lo haya « il n'y avait pas » A2 · נִמְצָא nimtsa « se trouve » B1 · קַיָּם kayam « existe, existant » B1 · יֶשְׁנוֹ yeshno « il existe (soutenu) » B2
- [ ] **Étape 3 : contrôle** — `controle_tr.js` : 0 brut non arbitré (yihye et hayta sont les candidats à désaccord — arbitrer sur le corpus).
- [ ] **Étape 4 : insertion** — `ajoute_mots` à blanc puis `--ecrire` (section existante, câblage nul).
- [ ] **Étape 5 : preuve** — build : « Existence » = **16** ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Existence et possession : avoir, ne pas avoir, et le passé de être (+14)"`.

---

### Tâche 9 : Le noyau — prépositions simples, démonstratifs, réfléchis

**Fichiers :** Modifier `data/listes/prepositions.json` (+5), `data/listes/demonstratifs.json` (+7), `data/listes/pronoms-personnels.json` (+5)

**Trois fichiers, trois choses** : la préposition nue, le désignateur, le pronom. Aucune entrée ne change de fichier.

- [ ] **Étape 1 : dédoublonnage** — `node tools/cherche_mots.js זו אלו פה שמה ללא אודות כלשהו בעצמי עצמה עצמנו עצמם` + grep. ⚠️ Voisines connues (audit) : פה existe comme « bouche » ; אלו a la voisine אֵילוּ « quels » ; אֶת la préposition COD n'existe que comme homographe אַתְּ « tu (f.) » — les trois ajouts restent dus (sens distincts).
- [ ] **Étape 2 : bordereau** (Sonnet) — 17 entrées :

  **prepositions.json** : אֶת et « (marque du complément d'objet direct défini) » A1, note « אֲנִי רוֹאֶה אֶת הַבַּיִת ; cf. section 16 du carnet » · בְּ־ be- « dans, en, à (préfixe collé au mot) » A1 · לְ־ le- « à, pour, vers (préfixe collé au mot) » A1 · לְלֹא lelo « sans (soutenu) » B2 · אוֹדוֹת odot « au sujet de (soutenu) » C1
  **demonstratifs.json** : זוֹ zo « cette, celle-ci (variante de זאת) » A2 · אֵלּוּ elu « ces, ceux-ci (variante de אלה) » B1 · הַזֶּה haze « ce …-ci (après le nom : הַסֵּפֶר הַזֶּה) » A1 · הַזֹּאת hazot « cette …-ci » A1 · הָאֵלֶּה ha'ele « ces …-ci » A2 · פֹּה po « ici (courant) » A1 · שָׁמָּה shama « là-bas (familier) » B1
  **pronoms-personnels.json** : עַצְמָהּ atsma « elle-même » A2 · עַצְמֵנוּ atsmenu « nous-mêmes » B1 · עַצְמָם atsmam « eux-mêmes » B1 · בְּעַצְמִי be'atsmi « moi-même, tout seul » A2 · כָּלְשֶׁהוּ kolshehu « quelconque » B2
- [ ] **Étape 3 : contrôle** — `controle_tr.js` : 0 brut non arbitré. ⚠️ בְּ־/לְ־ portent un maqaf : désaccord he2tr **attendu**, arbitrage manuel (le tr rédigé fait foi).
- [ ] **Étape 4 : insertion** — `ajoute_mots` à blanc puis `--ecrire`, les 3 fichiers.
- [ ] **Étape 5 : preuve** — build : Prépositions = **46**, Démonstratifs = **14**, Pronoms personnels = **24** ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Noyau grammatical : la particule את, les démonstratifs à article, les réfléchis complets (+17)"`.

---

### Tâche 10 : Conjonctions et subordonnants en ־שֶׁ

**Fichiers :** Modifier `data/listes/conjonctions.json` (19 → 45)

**Une chose :** relier deux propositions. Les connecteurs de *discours* (« c'est-à-dire », « par exemple ») ne sont pas des conjonctions et vont en T11.

- [ ] **Étape 1 : dédoublonnage** — l'audit donne 26 absents sur 34 ; re-vérifier les têtes simples (`node tools/cherche_mots.js כאשר אשר אלא`) + grep des « X ש ». בגלל ש et למרות ש existent déjà — exclusions nommées.
- [ ] **Étape 2 : bordereau** (Sonnet) — 26 entrées :

  וְ־ ve- « et (préfixe ; cf. section 12) » A1 · שֶׁ־ she- « que, qui (cf. section 20) » A1 · כְּשֶׁ־ kshe- « quand (préfixe) » A2 · כַּאֲשֶׁר ka'asher « quand, lorsque (soutenu) » B1 · אֲשֶׁר asher « qui, que (soutenu) » B2 · אֶלָּא ela « mais plutôt, sinon » B1 · אַחֲרֵי שֶׁ acharei she « après que » A2 · לִפְנֵי שֶׁ lifnei she « avant que » A2 · עַד שֶׁ ad she « jusqu'à ce que » A2 · מֵאָז שֶׁ me'az she « depuis que » B1 · כְּדֵי שֶׁ kedei she « pour que » A2 · מִכֵּיוָן שֶׁ mikeivan she « étant donné que » B1 · כָּךְ שֶׁ kach she « de sorte que » B1 · בְּעוֹד שֶׁ be'od she « tandis que » B2 · אַף שֶׁ af she « bien que » B2 · עַל מְנָת שֶׁ al menat she « afin que (soutenu) » B2 · בִּתְנַאי שֶׁ bitnai she « à condition que » B1 · בְּמִקְרֶה שֶׁ bemikre she « au cas où » B1 · כְּפִי שֶׁ kefi she « comme, ainsi que » B1 · כְּמוֹ שֶׁ kmo she « comme (+ proposition) » A2 · כְּכֹל שֶׁ kekhol she « plus… (plus…) » B2 · אוֹ שֶׁ o she « ou bien (+ proposition) » A2 · בֵּין אִם bein im « que… ou que… » B2 · גַּם … וְגַם gam… vegam « et… et… » A2 · אוֹ … אוֹ o… o « ou… ou… » A2 · לֹא … אֶלָּא lo… ela « non pas… mais » B1

  Pièges tr : kekhol (2ᵉ kaf sans daguech → `kh`) ; כָּךְ שֶׁ — le corpus tranche (`node tools/cherche_mots.js כך` donne son `tr` existant). Les 3 entrées à points de suspension mettront `he2tr` en échec : désaccord **attendu**.
- [ ] **Étape 3 : contrôle** — `controle_tr.js` : 0 brut non arbitré hors « … » et préfixes à maqaf.
- [ ] **Étape 4 : insertion** — `ajoute_mots` à blanc puis `--ecrire`.
- [ ] **Étape 5 : preuve** — build : Conjonctions = **45** ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Conjonctions : שֶׁ־ et les subordonnants composés — la phrase complexe outillée (+26)"`.

---

### Tâche 11 : Section neuve « Connecteurs du discours »

**Fichiers :**
- Créer : `data/listes/connecteurs-du-discours.json` (23 entrées), `src/carnet/sections/29-connecteurs-du-discours.html`
- Modifier : `sections.json`, `00-preambule.html`, `tools/build.js` (2 constantes), `src/app/js/07-filtres.js` (`catOrder`, après `'Conjonctions'`), `docs/TODO.md`

**Une chose :** articuler un raisonnement (pas relier deux propositions — c'est T10). C'est le matériau B2-C1 : le carnet compte 26 cartes B2 et 10 C1 sur 1440.

- [ ] **Étape 1 : câblage, gardes vues échouer** — `'Connecteurs du discours'` dans `EXPECTED_CATS` + `listCats`, **sans** `catOrder` → build **ÉCHOUE** sur `verifieCatOrder`. Ajouter à `catOrder` → build **ÉCHOUE** sur `EXPECTED_CATS` (0 carte). Les deux sorties dans le message de commit.
- [ ] **Étape 2 : bordereau = fichier** (Sonnet) — 23 entrées, niveau B1 sauf mention :

  כְּלוֹמַר kelomar « c'est-à-dire » · לְמָשָׁל lemashal « par exemple » A2 · לְדֻגְמָה ledugma « par exemple (à l'écrit) » · בְּנוֹסָף benosaf « en outre, de plus » · מִצַּד אֶחָד mitsad echad « d'un côté » · מִצַּד שֵׁנִי mitsad sheni « de l'autre côté » · עִם זֹאת im zot « cela dit, toutefois » B2 · לְפִיכָךְ lefichakh « par conséquent (soutenu) » C1 · אָמְנָם omnam « certes » B2 · אַף עַל פִּי כֵן af al pi khen « malgré tout (soutenu) » C1 · יֶתֶר עַל כֵּן yeter al ken « qui plus est (soutenu) » C1 · לְסִכּוּם lesikum « en résumé » · כָּאָמוּר ka'amur « comme dit plus haut (écrit) » C1 · רֵאשִׁית reshit « premièrement » · שֵׁנִית shenit « deuxièmement » · לְבַסּוֹף levasof « finalement » · וְכֵן vekhen « ainsi que, de même » · כְּמוֹ כֵן kmo khen « de même (soutenu) » · דְּהַיְנוּ dehainu « à savoir (soutenu) » C1 · וּבְכֵן uvekhen « eh bien » B2 · בְּהֶתְאֵם behetem « en conséquence (adminis.) » B2 · כְּתוֹצָאָה מִכָּךְ ketotsa'a mikakh « en conséquence de quoi » B2 · בְּעִקְבוֹת be'ikvot « à la suite de »

  ⚠️ **Pièges tr au cœur du lot** : כן après voyelle/chva perd son daguech → `khen` (vekhen, kmo khen, af al pi khen), mais כֵּן initial = `ken` (yeter al ken) ; lefichakh/mikakh (khaf final `kh`). C'est le lot le plus piégeux du chantier — `controle_tr.js` arbitre entrée par entrée.
- [ ] **Étape 3 : contrôle** — `controle_tr.js` : 0 brut non arbitré.
- [ ] **Étape 4 : gabarit** — `29-connecteurs-du-discours.html` sur le patron 18 : `h2 id="sec-connecteurs-du-discours"` + `<span lang="he">מִלּוֹת קִשּׁוּר</span>` + `<span class="count">Connecteurs du discours</span>` ; `div.note` (2 phrases : à quoi sert un connecteur ; לכן, אחרת et בכל זאת vivent dans Conjonctions/Adverbes) ; `@ENTREES:listes/connecteurs-du-discours`. Puis `sections.json` **à l'index réservé par T2b** (juste après `"28-conjonctions.html"`) et le sommaire.
- [ ] **Étape 5 : preuve** — build PASSE, « Connecteurs du discours » = **23** ; identité du label sur les 5 fichiers ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : flag + commit** — flag TODO (2 fichiers créés) ; `git commit -m "Section neuve Connecteurs du discours : le matériau B2-C1 de l'argumentation (+23)"`.

---

### Tâche 12 : Interrogatifs composés

**Fichiers :** Modifier `data/listes/mots-interrogatifs.json` (14 → 26)

- [ ] **Étape 1 : dédoublonnage** — grep des multi-mots (של מי, את מי, עם מי, כמה זמן, מה זה, מה קרה — tous invisibles à `cherche_mots`) + `node tools/cherche_mots.js מדוע כיצד מניין`. ⚠️ מה קרה a la voisine מה קורה (présent) déjà au carnet — temps distincts, l'ajout reste dû.
- [ ] **Étape 2 : bordereau** (Sonnet) — 12 entrées :

  מַדּוּעַ madua « pourquoi (soutenu) » B1 · כֵּיצַד keitsad « comment (soutenu) » B1 · מִנַּיִן minayin « d'où (soutenu) » B2 · שֶׁל מִי shel mi « à qui (possession) » A1 · אֶת מִי et mi « qui (COD) » A2 · עִם מִי im mi « avec qui » A2 · בַּמֶּה bame « en quoi, avec quoi » B1 · מִמָּה mima « de quoi » B1 · לְשֵׁם מָה leshem ma « dans quel but » B2 · כַּמָּה זְמַן kama zman « combien de temps » A1 · מַה זֶּה ma ze « qu'est-ce que c'est » A1 · מָה קָרָה ma kara « que s'est-il passé » A1

  Piège tr : madua (patach furtif sous ayin final → `a`, pas `ach` — la règle `ach` ne vaut que pour het).
- [ ] **Étape 3-4 : contrôle puis insertion** — `controle_tr.js` 0 brut ; `ajoute_mots` à blanc puis `--ecrire`.
- [ ] **Étape 5 : preuve** — build : Mots interrogatifs = **26** ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Interrogatifs : les composés (à qui, avec qui, combien de temps…) et le registre soutenu (+12)"`.

---

### Tâche 13 : Section neuve « Heure et date »

**Fichiers :**
- Créer : `data/listes/heure-et-date.json` (22 entrées), `src/carnet/sections/36-heure-et-date.html`
- Modifier : `sections.json`, `00-preambule.html`, `tools/build.js`, `07-filtres.js` (`catOrder`, après `'Jours de la semaine'`), `docs/TODO.md`

**Une chose :** situer dans le temps. Les noms nus du temps (שעה, דקה, חודש) restent dans `data/noms.json` : cette section ne contient que des **compléments de temps** (בַּבֹּקֶר, לִפְנֵי שָׁבוּעַ) — c'est ce qui manquait, l'audit l'a montré.

- [ ] **Étape 1 : câblage, gardes vues échouer** — `'Heure et date'` dans `EXPECTED_CATS` + `listCats` sans `catOrder` → **ÉCHEC `verifieCatOrder`** ; puis `catOrder` → **ÉCHEC `EXPECTED_CATS`**.
- [ ] **Étape 2 : dédoublonnage** — presque tout est multi-mots : grep systématique (chercher בוקר/ערב seuls PUIS le composé בבוקר/בערב). מה השעה et שעה/דקה/שנייה existent — exclusions nommées.
- [ ] **Étape 3 : bordereau = fichier** (Sonnet) — 22 entrées :

  בַּבֹּקֶר baboker « le matin (complément de temps) » A1 · בַּצָּהֳרַיִם batsohorayim « à midi » A1 · אַחַר הַצָּהֳרַיִם achar hatsohorayim « l'après-midi » A2 · בָּעֶרֶב ba'erev « le soir » A1 · בַּלַּיְלָה balaila « la nuit » A1 · לִפְנוֹת בֹּקֶר lifnot boker « au petit matin » B1 · חֲצוֹת chatsot « minuit » B1 · וָחֵצִי vachetsi « et demie (שָׁלוֹשׁ וָחֵצִי) » A1 · וָרֶבַע vareva « et quart » A2 · בְּשָׁעָה besha'a « à … heure(s) » A2 · בְּאֵיזוֹ שָׁעָה be'eizo sha'a « à quelle heure » A2 · עֶשְׂרִים לְ־ esrim le- « … moins vingt » B1 · שִׁלְשׁוֹם shilshom « avant-hier » B1 · אֶתְמוֹל בָּעֶרֶב etmol ba'erev « hier soir » A2 · הַשָּׁבוּעַ hashavua « cette semaine » A1 · בַּשָּׁבוּעַ הַבָּא bashavua haba « la semaine prochaine » A2 · בַּשָּׁבוּעַ שֶׁעָבַר bashavua she'avar « la semaine dernière » A2 · בַּחֹדֶשׁ שֶׁעָבַר bachodesh she'avar « le mois dernier » A2 · לִפְנֵי שָׁבוּעַ lifnei shavua « il y a une semaine » A2 · בְּעוֹד שָׁבוּעַ be'od shavua « dans une semaine » B1 · בֶּן כַּמָּה ben kama « quel âge (à un homme) » A1 · בַּת כַּמָּה bat kama « quel âge (à une femme) » A1

  Pièges tr : tsohorayim, chatsot, vachetsi (het → `ch` partout).
- [ ] **Étape 4 : contrôle + gabarit** — `controle_tr.js` 0 brut ; `36-heure-et-date.html` patron 18 (`h2 id="sec-heure-et-date"`, `<span lang="he">מָה הַשָּׁעָה?</span>`, `span.count` = `Heure et date`, `div.note` 2 phrases : le ב־ des compléments de temps ; שעה/דקה restent des noms) + `@ENTREES:listes/heure-et-date` ; `sections.json` + sommaire.
- [ ] **Étape 5 : preuve** — build PASSE : « Heure et date » = **22** ; identité du label ×5 ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : flag + commit** — flag TODO (2 fichiers créés) ; `git commit -m "Section neuve Heure et date : dire l'heure, situer la semaine, demander l'âge (+22)"`.

---

### Tâche 13b : Le nom גִּיל dans la table des noms

**Fichiers :** Modifier `data/noms.json` (+1)

**Pourquoi séparée de T13 :** une entrée de table subit d'autres gardes qu'une entrée de liste (`theme` dans `EXPECTED_THEMES` obligatoire, ≥ 1 exemple sous peine d'erreur bloquante de `verifie_exemples.js`). Mêlée au commit de T13, une de ces gardes bloquerait les deux livraisons.

- [ ] **Étape 1 : dédoublonnage** — `node tools/cherche_mots.js גיל`.
- [ ] **Étape 2 : insertion** — `ajoute_mots` `type:"nom"` : גִּיל gil « âge » `niveau:"A2"`, `theme:"temps-calendrier"`, `genre` masculin, 1 exemple (« בֶּן כַּמָּה אַתָּה? » est déjà en T13 — en choisir un autre, type מָה הַגִּיל שֶׁלְּךָ?). Placement machine. À blanc, puis `--ecrire`.
- [ ] **Étape 3 : preuve** — build : Noms = baseline + 1 ; thème `temps-calendrier` = 37 + 1 = **38** ; `verifie_exemples` 0 erreur (l'exemple obligatoire y passe).
- [ ] **Étape 4 : commit** — `git commit -m "Nom גיל (âge), thème temps-calendrier (+1)"`.

---

### Tâche 14 : Quantifieurs — la section rendue à sa seule chose

**Fichiers :** Modifier `data/listes/mots-de-quantite.json` (34 → 41)

**Une chose :** la quantité **indéterminée**. Les fractions (quantité déterminée) sont en T5, le comparatif (construction) en T15 — ce fichier n'en reçoit aucun.

- [ ] **Étape 1 : dédoublonnage** — `node tools/cherche_mots.js רוב כמות טיפה חלק` + grep des multi-mots (כל כך הרבה, אין ספור, כמה שיותר). ⚠️ Voisines connues (audit) : חלק existe comme adjectif « lisse » (chalak) — le nom « partie » (chelek) est un homographe légitime, l'ajout reste dû ; בסך הכול existe déjà ; אף (« nez ») et שום (« ail ») existent comme noms — les particules restent dues **mais** vont en T16 avec la négation, pas ici.
- [ ] **Étape 2 : bordereau** (Sonnet) — 7 entrées :

  רֹב rov « la plupart de » A2 · כַּמּוּת kamut « quantité » B1 · טִיפָּה tipa « une goutte, un chouïa (fam.) » A2 · חֵלֶק chelek « partie, part » A2 · כָּל כָּךְ הַרְבֵּה kol kakh harbe « tellement de » A2 · אֵין סְפוֹר ein sfor « d'innombrables » B2 · כַּמָּה שֶׁיּוֹתֵר kama sheyoter « le plus possible » B1
- [ ] **Étape 3-4 : contrôle puis insertion** — `controle_tr.js` 0 brut (chelek : het → `ch`) ; `ajoute_mots` à blanc puis `--ecrire`.
- [ ] **Étape 5 : preuve** — build : Mots de quantité = **41** ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Quantifieurs indéfinis : la plupart, quantité, partie, tellement de (+7)"`.

---

### Tâche 15 : Section neuve « Comparatif et superlatif »

**Fichiers :**
- Créer : `data/listes/comparatif-et-superlatif.json` (6 entrées), `src/carnet/sections/26-comparatif-et-superlatif.html`
- Modifier : `sections.json`, `00-preambule.html`, `tools/build.js`, `07-filtres.js` (`catOrder`, après `'Adjectifs'`), `docs/TODO.md`

**Une chose :** comparer. L'audit l'a nommé : les atomes existent (יותר, פחות, הכי, גדול) mais **aucune construction comparative n'est enseignée** — et les 20 sections de grammaire du carnet n'en ont pas. Ce n'est ni un quantifieur ni un adverbe : c'est un patron.

- [ ] **Étape 1 : câblage, gardes vues échouer** — `'Comparatif et superlatif'` dans `EXPECTED_CATS` + `listCats` sans `catOrder` → **ÉCHEC `verifieCatOrder`** ; puis `catOrder` → **ÉCHEC `EXPECTED_CATS`**.
- [ ] **Étape 2 : dédoublonnage** — `node tools/cherche_mots.js ביותר` + grep des multi-mots (יותר מ, פחות מ, הרבה יותר, ככל ש). הכי, יותר, פחות, מדי, כמו, אותו דבר existent — exclusions nommées, la section les **cite dans sa prose** sans les dupliquer en cartes.
- [ ] **Étape 3 : bordereau = fichier** (Sonnet) — 6 entrées :

  יוֹתֵר מִ־ yoter mi- « plus que » A1 · פָּחוֹת מִ־ pachot mi- « moins que » A1 · בְּיוֹתֵר beyoter « le plus (après l'adjectif : הַטּוֹב בְּיוֹתֵר) » B1 · הַרְבֵּה יוֹתֵר harbe yoter « beaucoup plus » A2 · כְּכֹל שֶׁ… כָּךְ kekhol she… kakh « plus…, plus… » B2 · אוֹתוֹ דָּבָר כְּמוֹ oto davar kmo « la même chose que » A2

  ⚠️ Maqaf sur יותר מ־/פחות מ־ et les points de suspension : désaccords `he2tr` **attendus**, arbitrage manuel.
- [ ] **Étape 4 : contrôle + gabarit** — `controle_tr.js` (les 3 cas ci-dessus arbitrés, aucun autre brut) ; `26-comparatif-et-superlatif.html` patron 18 : `h2 id="sec-comparatif-et-superlatif"`, `<span lang="he">יוֹתֵר וּפָחוֹת</span>`, `span.count` = `Comparatif et superlatif`, `div.note` **3 phrases** portant la construction (comparatif = adjectif + יוֹתֵר מִ־ ; superlatif courant = הַכִּי + adjectif ; superlatif soutenu = article + adjectif + בְּיוֹתֵר), avec un exemple de chaque ; `@ENTREES:listes/comparatif-et-superlatif` ; `sections.json` + sommaire.
- [ ] **Étape 5 : preuve** — build PASSE : « Comparatif et superlatif » = **6** ; identité du label ×5 ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : flag + commit** — flag TODO (2 fichiers créés) ; `git commit -m "Section neuve Comparatif et superlatif : la construction, pas seulement ses mots (+6)"`.

---

### Tâche 16 : Adverbes et négation

**Fichiers :** Modifier `data/listes/adverbes.json` (+11), `data/listes/mots-de-quantite.json` (+2 : les particules אף et שום)

- [ ] **Étape 1 : dédoublonnage** — `node tools/cherche_mots.js מהר לאט בעיקר בהחלט מזמן פתאום לעולם כנראה` + grep (סוף סוף, שוב פעם, גם כן). ⚠️ אף et שום : leurs homographes-noms (« nez », « ail ») existent — les particules sont dues ; elles rejoignent `mots-de-quantite.json` (« aucun » est une quantité nulle : c'est bien la chose de ce fichier).
- [ ] **Étape 2 : bordereau** (Sonnet). ⚠️ `adverbes.json` porte des `groupe` : relever les groupes existants (`grep '"groupe"' data/listes/adverbes.json | sort -u`) et fournir `sous_theme` à `ajoute_mots` (SPEC §3.5) — l'affectation de chaque entrée à son groupe est un arbitrage du fil principal. 13 entrées :

  **adverbes** : מַהֵר maher « vite » A1 · לְאַט le'at « lentement » A1 · בְּעִיקָר be'ikar « surtout, principalement » B1 · בְּהֶחְלֵט behechlet « absolument » B1 · מִזְּמַן mizman « depuis longtemps » A2 · פִּתְאוֹם pit'om « soudain » A2 · סוֹף סוֹף sof sof « enfin ! » A2 · לְעוֹלָם le'olam « (à) jamais (au futur : לְעוֹלָם לֹא) » B1 · שׁוּב פַּעַם shuv pa'am « encore une fois (fam.) » B1 · גַּם כֵּן gam ken « aussi, également » B1 · כַּנִּרְאֶה kanir'e « apparemment, sans doute » A2
  **mots-de-quantite** : אַף af « aucun (אַף אֶחָד לֹא) » A2 · שׁוּם shum « aucun (שׁוּם דָּבָר) » A2
- [ ] **Étape 3-4 : contrôle puis insertion** — `controle_tr.js` 0 brut (behechlet : het → `ch`) ; `ajoute_mots` à blanc puis `--ecrire`.
- [ ] **Étape 5 : preuve** — build : Adverbes = **72**, Mots de quantité = **43** ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Adverbes courants et particules de négation : vite, soudain, aucun (+13)"`.

---

### Tâche 17 : Section neuve « Tournures impersonnelles »

**Fichiers :**
- Créer : `data/listes/tournures-impersonnelles.json` (12 entrées), `src/carnet/sections/23-tournures-impersonnelles.html`
- Modifier : `sections.json`, `00-preambule.html`, `tools/build.js`, `07-filtres.js` (`catOrder`, après `'Verbes modaux'`), `data/listes/verbes-modaux.json` (+1 : מוּטָב), `docs/TODO.md`

**Une chose :** ce qui arrive à quelqu'un sans qu'il en soit le sujet — קַר לִי, בָּא לִי, נִמְאַס לִי. Ce ne sont **pas** des verbes modaux (יכול, צריך, אסור) : les mettre dans `verbes-modaux.json` diluerait deux classes dans un fichier. Seul מוּטָב (« il vaut mieux »), jumeau exact de כְּדַאי déjà présent, rejoint les modaux.

**Dépendance :** après T6/T7 — les séries fléchies sont en place, les exemples peuvent conjuguer (בָּא לְךָ?).

- [ ] **Étape 1 : câblage, gardes vues échouer** — `'Tournures impersonnelles'` dans `EXPECTED_CATS` + `listCats` sans `catOrder` → **ÉCHEC `verifieCatOrder`** ; puis `catOrder` → **ÉCHEC `EXPECTED_CATS`**.
- [ ] **Étape 2 : dédoublonnage** — grep des multi-mots (בא לי, נמאס לי, אכפת לי, אין לי כוח, קר לי, כאב לי, נדמה לי, מגיע לי, מתחשק לי, קשה לי, נעים לי, מוטב). ⚠️ Connus de l'audit : לא אכפת לי existe (forme négative), נִדְמֶה existe **dans `verbes-modaux.json`** — décision : נדמה לי n'est PAS dupliqué, la prose de la section neuve y renvoie. נמאס est totalement absent.
- [ ] **Étape 3 : bordereau = fichier** (Sonnet) — 12 entrées :

  קַר לִי kar li « j'ai froid » A1 · חַם לִי cham li « j'ai chaud » A1 · כּוֹאֵב לִי koev li « j'ai mal » A2 · נָעִים לִי na'im li « je me sens bien » B1 · קָשֶׁה לִי kashe li « c'est dur pour moi » A2 · בָּא לִי ba li « j'ai envie (fam.) » A2 · מִתְחַשֵּׁק לִי mitchashek li « j'ai envie de » B1 · נִמְאַס לִי nim'as li « j'en ai assez » B1 · אִכְפַּת לִי ichpat li « ça m'importe » B1 · אֵין לִי כֹּחַ ein li koach « j'ai la flemme (fam.) » B1 · מַגִּיעַ לִי magia li « je le mérite / j'y ai droit » B1 · מַסְפִּיק לִי maspik li « ça me suffit » A2
  **verbes-modaux.json** : מוּטָב mutav « il vaut mieux (soutenu) » C1
  ⚠️ Pièges tr : cham (het → `ch`), koach (patach furtif het final → `ach`), mitchashek (het médian).
- [ ] **Étape 4 : contrôle + gabarit** — `controle_tr.js` 0 brut ; `23-tournures-impersonnelles.html` patron 18 : `h2 id="sec-tournures-impersonnelles"`, `<span lang="he">קַר לִי</span>`, `span.count` = `Tournures impersonnelles`, `div.note` **3 phrases** : le français met un sujet (« j'ai froid »), l'hébreu met la préposition fléchie (« froid à-moi ») ; la série de לְ est à la section 15 ; נִדְמֶה et כְּדַאי sont chez les verbes modaux ; `@ENTREES:listes/tournures-impersonnelles` ; `sections.json` + sommaire.
- [ ] **Étape 5 : preuve** — build PASSE : « Tournures impersonnelles » = **12**, Verbes modaux = **10** ; identité du label ×5 ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : flag + commit** — flag TODO (2 fichiers créés) ; `git commit -m "Section neuve Tournures impersonnelles : j'ai froid, j'ai envie, j'en ai assez (+13)"`.

---

### Tâche 18 : Hébreu parlé — les formules manquantes

**Fichiers :** Modifier `data/listes/hebreu-parle.json` (45 → 51)

- [ ] **Étape 1 : dédoublonnage** — `node tools/cherche_mots.js בהצלחה תתחדש ביי אוקיי` + grep (איך הולך, מה אכפת לי).
- [ ] **Étape 2 : bordereau** (Sonnet) — 6 entrées : בְּהַצְלָחָה behatslacha « bonne chance ! » A1 · תִּתְחַדֵּשׁ titchadesh « profite bien ! (à qui étrenne du neuf) » B1 · אֵיךְ הוֹלֵךְ eikh holekh « comment ça va ? (fam.) » A2 · בַּיי bai « salut ! (au revoir) » A1 · אוֹקֵיי okei « OK » A1 · מָה אִכְפַּת לִי ma ichpat li « qu'est-ce que ça peut me faire (fam.) » B2
  ⚠️ eikh/holekh : deux khaf finaux sans daguech → `kh`. **Le corpus tranche** : איך existe déjà, `node tools/cherche_mots.js איך` donne son `tr` — le suivre.
- [ ] **Étape 3-4 : contrôle puis insertion** — `controle_tr.js` 0 brut ; `ajoute_mots` à blanc puis `--ecrire`.
- [ ] **Étape 5 : preuve** — build : Hébreu parlé = **51** ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : commit** — `git commit -m "Hébreu parlé : bonne chance, profite bien, comment ça va (+6)"`.

---

### Tâche 19 : L'impératif entre au carnet (section 08 câblée)

**Fichiers :**
- Créer : `data/listes/imperatif.json` (~15 entrées, le dédoublonnage tranche)
- Modifier : `src/carnet/sections/08-l-imperatif.html` (+ `@ENTREES`), `tools/build.js`, `07-filtres.js` (`catOrder`, après `'Verbes modaux'`), `docs/TODO.md`

**Une chose :** l'ordre et la demande. `data/verbes.json` ne stocke que l'infinitif + 4 formes du présent (`data/SCHEMA.md:10`) : l'impératif n'a **aucun** endroit dans la table — d'où un fichier de liste, et non une extension de schéma (hors périmètre, arbitrage 8).

- [ ] **Étape 1 : lire le gabarit hôte** — `Read src/carnet/sections/08-l-imperatif.html` (104 lignes) ; aligner le `h2` sur le patron 18, `span.count` = `Impératif` ; prose intacte.
- [ ] **Étape 2 : câblage, gardes vues échouer** — `'Impératif'` dans `EXPECTED_CATS` + `listCats` sans `catOrder` → **ÉCHEC `verifieCatOrder`** ; puis `catOrder` → **ÉCHEC `EXPECTED_CATS`**.
- [ ] **Étape 3 : dédoublonnage** — `node tools/cherche_mots.js בוא תן קח חכה שב סע תשמע תגיד תראה עזוב זוז קדימה די`. ⚠️ קדימה et די sont probablement déjà dans Expressions ; בוא peut exister via le verbe לָבוֹא — l'impératif reste dû (forme distincte). Exclusions nommées.
- [ ] **Étape 4 : bordereau = fichier** (Sonnet) — candidats (~15, moins les exclusions de l'étape 3) :

  בּוֹא bo « viens ! » A1 · בּוֹאִי bo'i « viens ! (à une femme) » A1 · בּוֹאוּ bo'u « venez ! » A2 · תֵּן ten « donne ! » A2 · קַח kach « prends ! » A2 · חַכֵּה chake « attends ! » A2 · שֵׁב shev « assieds-toi ! » A2 · סַע sa « roule ! / vas-y (en véhicule) » B1 · תִּשְׁמַע tishma « écoute ! (futur-impératif, le courant) » A2 · תַּגִּיד tagid « dis ! » A2 · תִּרְאֶה tir'e « regarde ! » A2 · עֲזֹב azov « laisse tomber ! » B1 · תֵּירָגַע teraga « calme-toi ! » B1 · תַּעֲצֹר ta'atsor « arrête ! » B1 · זוּז zuz « bouge ! (fam.) » B1
  ⚠️ Piège tr : chake (het), kach (khaf final → `kh` ? **le corpus tranche**).
- [ ] **Étape 5 : gabarit + preuve** — `@ENTREES:listes/imperatif` en fin de section 08 ; `div.note` complémentaire d'**une** phrase (l'hébreu parlé préfère le futur comme impératif : תשמע, תגיד — la prose de la section le détaille déjà) ; build PASSE : « Impératif » = N retenu (nommé) ; identité du label ×5 ; `verifie_exemples` 0 erreur.
- [ ] **Étape 6 : flag + commit** — flag TODO (1 fichier créé) ; `git commit -m "Impératif : la section de grammaire gagne ses cartes (+N)"`.

---

### Tâche 20 : Section neuve « Abréviations et sigles »

**Fichiers :**
- Créer : `data/listes/abreviations-et-sigles.json` (11 entrées), `src/carnet/sections/42-abreviations-et-sigles.html`
- Modifier : `sections.json`, `00-preambule.html`, `tools/build.js`, `07-filtres.js` (`catOrder`, avant `'Hébreu parlé'`), `docs/TODO.md`

**Une chose :** lire ce que l'écrit abrège. Classe entièrement absente (0/12 à l'audit).

- [ ] **Étape 1 : câblage, gardes vues échouer** — `'Abréviations et sigles'` dans `EXPECTED_CATS` + `listCats` sans `catOrder` → **ÉCHEC `verifieCatOrder`** ; puis `catOrder` → **ÉCHEC `EXPECTED_CATS`**.
- [ ] **Étape 2 : bordereau = fichier** (Sonnet). Le `tr` est la forme **lue à voix haute** — c'est la valeur pédagogique de la section. 11 entrées :

  וְכוּ' vechule « etc. » B1 · ז"א zot omeret « c.-à-d. (זֹאת אוֹמֶרֶת) » B1 · וְכַדּוֹמֶה vechadome « et similaires » B2 · ד"ר doktor « Dr (docteur) » A2 · עו"ד orekh din « Maître (avocat, עוֹרֵךְ דִּין) » B1 · ת"א tel aviv « Tel-Aviv » A2 · נ.ב. nun bet « P.-S. » B2 · חוּ"ל chul « l'étranger (חוּץ לָאָרֶץ) » B1 · צה"ל tsahal « Tsahal (l'armée) » B1 · בע"ה be'ezrat hashem « avec l'aide de Dieu (à l'écrit) » C1 · אי"ה im yirtse hashem « si Dieu veut (à l'écrit) » C1

  ⚠️ **Lot spécial** : les gershayim (״) mettront `he2tr` en échec sur presque chaque entrée — désaccords **attendus**, arbitrage entrée par entrée, le `tr` rédigé fait foi (cas typique du « `.tr` du carnet est souverain »). Le `note` de chaque sigle porte sa forme développée vocalisée.
- [ ] **Étape 3 : gabarit** — `42-abreviations-et-sigles.html` patron 18 : `h2 id="sec-abreviations-et-sigles"`, `<span lang="he">רָאשֵׁי תֵּבוֹת</span>`, `span.count` = `Abréviations et sigles`, `div.note` (2 phrases : les gershayim ״ signalent un sigle ; on lit la forme développée) + `@ENTREES:listes/abreviations-et-sigles` ; `sections.json` + sommaire.
- [ ] **Étape 4 : preuve** — build PASSE : « Abréviations et sigles » = **11** ; identité du label ×5 ; `verifie_exemples` 0 erreur.
- [ ] **Étape 5 : flag + commit** — flag TODO (2 fichiers créés) ; `git commit -m "Section neuve Abréviations et sigles : lire ce que l'écrit abrège (+11)"`.

---

### Tâche 21 : Clôture — contre-audit, WebKit, documentation, push

**Fichiers :** Modifier `docs/TODO.md`, `docs/ARCHITECTURE.md`, `README.md` (si les comptes y figurent)

- [ ] **Étape 1 : contre-audit mécanique** (un audit délégué a des trous : re-tester la liste de départ APRÈS insertion). Sous-agent **Sonnet**, critères : « Repasse `node tools/cherche_mots.js` sur l'intégralité des ~285 candidats de docs/superpowers/plans/2026-07-28-mots-outils-et-nombres.md (lots de 20) + grep des multi-mots. PRÉSENT/ABSENT par terme. Tout ABSENT non couvert par une exclusion nommée dans un commit = FAIL nommé. N'ouvre aucun artefact généré. Max 30 lignes, aucun listing de fichier. »
- [ ] **Étape 2 : vérification visuelle WebKit** (l'UI a bougé : 5 catégories app neuves, 6 sections carnet neuves). Sous-agent **Sonnet**, Playwright + WebKit `devices['iPhone 16 Pro']`, serveur local : « (1) puces présentes avec compte non nul pour Prépositions fléchies, Connecteurs du discours, Heure et date, Comparatif et superlatif, Tournures impersonnelles, Impératif, Abréviations et sigles — PASS/FAIL chacune ; (2) « Nombres » compte bien 83 (les fractions ont rejoint la puce existante) ; (3) une carte jouée dans 3 catégories neuves (recto/verso, `lang=he` présent sur le nœud hébreu) ; (4) carnet : les 6 sections neuves + les blocs des sections 15 et 08 rendus (les 8 `h3.subtheme` des séries fléchies visibles) ; (5) carnet à 1280 px — la colonne tient (piège 13). Verdict ≤ 15 lignes, AUCUNE capture dans la réponse. »
- [ ] **Étape 3 : `node tools/build.js --check`** — les 5 artefacts en phase, stamp `sw.js` compris, `verifieCatOrder` verte. Total attendu ≈ **1725 cartes** (1440 + ~285, aux exclusions de dédoublonnage près — le chiffre exact est celui du build, le noter).
- [ ] **Étape 4 : documentation** (éditer par ancre `grep`, jamais en relisant un fichier entier) — **TODO.md** : « Reprendre ici » réécrit, flag graphe consolidé listant tous les fichiers créés **et renommés** (`tools/controle_tr.js`, 7 `data/listes/*.json`, 6 `src/carnet/sections/*.html` créés, **15 sections renommées par T2b**, ce plan) ; **ARCHITECTURE.md** : § anatomie (44 sections), § outils (6ᵉ outil `controle_tr.js`, une ligne), **et la garde `verifieCatOrder` ajoutée à la liste des gardes anti-casse silencieuse** (elle y a sa place : c'est la 9ᵉ) ; DESIGN/PRODUCT : rien (aucune règle visuelle touchée).
- [ ] **Étape 5 : commit + push** — `git commit -m "Clôture du chantier mots-outils : contre-audit, WebKit et docs" && git push origin main`.

---

## Auto-revue du plan

**1. Couverture de l'audit du 28/07** — prépositions fléchies (T6-T7) · existence/possession (T8) · את, préfixes, ללא, אודות (T9) · démonstratifs à article (T9) · réfléchis et indéfinis (T9) · subordonnants + ו/ש (T10) · connecteurs de discours (T11) · interrogatifs composés (T12) · heure et date (T13) · גיל (T13b) · quantifieurs (T14) · fractions (T5) · comparatif (T15) · adverbes + particules de négation (T16) · tournures impersonnelles (T17) · pragmatique (T18) · impératif (T19) · abréviations (T20) · nombres masculins, grands nombres, ordinaux féminins (T3-T4). Exclusions assumées et nommées : semikhout (section 13 existante), binyanim/temps verbaux (schéma), retouche `he2tr`.

**2. Respect de « un fichier = une chose »** — chaque tâche déclare la chose unique de son fichier. Trois dilutions de la v1 corrigées (§ Le principe appliqué). Deux endroits où la règle se lit dans deux sens sont arbitrés explicitement plutôt que tranchés en silence : le doublet m/f dans un fichier de tranche (arbitrage 2) et les 8 séries dans un fichier de fléchies (arbitrage 3). Une garde ajoutée pour l'exigence « cascade automatique » (T2).

**3. Cohérence des types et des noms** — labels de catégorie identiques entre leur tâche de création, la garde T2 et le contrôle T21 : Prépositions fléchies, Connecteurs du discours, Heure et date, Comparatif et superlatif, Tournures impersonnelles, Impératif, Abréviations et sigles, `Nombres — fractions et multiplicatifs` → `Nombres`. Slugs de `groupe` T6 = T7 (`shel le et im al min be autres`). `controle_tr.js` (T1) consommé par T3→T20 sous la même signature. Numérotation des sections 38→43 sans trou ni collision. Chaînage des comptes vérifiable : Nombres 41→60→75→83 · Prépositions fléchies 24→65 · Mots de quantité 34→41→43 · Verbes modaux 9→10.

**4. Points laissés au terrain — vérifications d'exécution avec leur commande, pas des placeholders** : signature exacte de `fonctionsApp` (T1-1) · site d'appel des gardes dans `build.js` (T2-1) · syntaxe exacte du placeholder à groupe (T6-5, précédent `33-adverbes.html`) · translittération de l'ayin initial et du khaf final, tranchée par le corpus (T7-2, T18-2, T19-4) · groupes existants d'`adverbes.json` (T16-2) · nombre final d'entrées d'impératif après dédoublonnage (T19-3).
