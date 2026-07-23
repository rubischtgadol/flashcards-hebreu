# SPEC — Économie de tokens sur tout le dépôt (chantier transversal)

Statut : **validée (23/07/2026)**. Déclencheur : l'inventaire du carnet par sous-agent du
23/07 — 56k tokens pour apprendre que 24 mots étaient absents, quand une
commande aurait répondu pour ~200.

## 0. Principe directeur

**Une question dont la réponse est mécanique — existence, comptage,
localisation — se paye en commande (~200 tokens), jamais en lecture de fichier
(~30–100k) ni en sous-agent (~30–56k).** Le sous-agent reste le bon canal pour
ce qui exige du jugement en volume (WebKit, audits éditoriaux) ; il cesse d'être
un canal de consultation. Deux conséquences : (1) le dépôt doit être outillé
pour que le canal cheap **existe toujours** ; (2) les règles doivent être
codifiées dans les fichiers du dépôt pour survivre au `/clear` — l'économie ne
doit plus dépendre de la vigilance du propriétaire.

## 1. Diagnostic mesuré (23/07/2026)

| Source de gaspillage | Taille | Coût d'une lecture complète | Fréquence |
| --- | --- | --- | --- |
| `vocabulaire_hebreu.html` | 9 591 lignes | ~100k tokens | chaque lot de contenu |
| Inventaire par sous-agent | — | 56k (mesuré 23/07) | chaque proposition de lot |
| **`TODO.md`** | **163 KB** (2 162 lignes) | **~40k tokens** | passe de doc de chaque rituel |
| `ARCHITECTURE.md` | 69 KB | ~17k tokens | passes de doc |
| `app.html` | 2 480 lignes | ~30k tokens | chantiers UI (le graphe couvre déjà) |
| `CLAUDE.md` | 21 KB | ~5k tokens **rechargés à chaque tour** | permanent |

TODO.md est devenu le plus gros document du dépôt — plus lourd
qu'ARCHITECTURE.md. Le trou d'outillage : le dry-run d'`ajoute_mots.js` détecte
les doublons (§7.A) mais exige la fiche complète (niqqud, formes, exemples)
avant de répondre — trop tard et trop cher pour un simple « existe-t-il ? ».
Aucune commande de consultation amont n'existait.

## 2. Chantier A — `cherche_mots.js`, la consultation par commande

État : **brouillon sur disque** (écrit avant l'arrêt demandé, non commité),
à ajuster à cette spec une fois validée.

Frère de `verifie_exemples.js` : dev-only, zéro dépendance, non déployé,
consultation pure (n'écrit jamais rien). Réutilise `extractCards`, `stripNikud`,
`NOTEBOOK` et les constantes exportés par `build.js` — pas de troisième parseur
(doctrine SPEC_AJOUTE_MOTS §1).

```text
node cherche_mots.js TERME [TERME…]   # existe-t-il ? où ?
node cherche_mots.js --stats          # répartition du corpus
```

### 2.1 Sémantique de recherche

- **Terme hébreu** (contient un caractère de la plage hébraïque) : comparaison
  **exacte** sur `he_plain` (niqqud retiré) — headwords, puis formes
  (pluriel/MS/FS/MP/FP), puis présence dans les exemples (**mot exact**, pas
  sous-chaîne : « חי » ne matche pas « מחיר »). Tout le corpus, tables et
  listes.
- **Terme latin** : sous-chaîne **à frontière de mot en tête**, insensible à la
  casse et aux accents, dans `.fr`, puis `note`, puis `exemples[].fr`.
  La frontière de mot est obligatoire : la sous-chaîne nue fait 173 faux
  positifs sur « fin » — `build.js` préfixe le `fr` de chaque verbe par
  `(infinitif)` + espace (L190), que « fin » matche en sous-chaîne. Mesuré sur le
  brouillon. « fin » trouve « fin », « fine », « finir » ; pas « enfin » ni
  « infinitif ».
- **Sortie** : une ligne par occurrence — `SECTION Lnnnn · hébreu — français`
  (le n° de ligne, approximatif, sert d'ancre de lecture fenêtrée, §5.1) ;
  `ABSENT` sinon. Bornée à 8 occurrences par terme, le surplus est **compté**
  (« … +165 autres ») — jamais de troncature silencieuse.

### 2.2 `--stats` (l'arbitrage « quel thème/niveau est sous-doté ? »)

Total de cartes ; répartition par section ; par niveau (ordre
`EXPECTED_LEVELS`) ; par thème (les 15 `EXPECTED_THEMES`, triés du moins doté
au plus doté, avec ventilation par niveau, `⚠ vide` si 0) ; signaux
éditoriaux : nombre d'entrées de tables à 1 seul exemple, nombre d'items de
listes sans exemple (licite). Sortie bornée ~40 lignes.

### 2.3 Validation du chantier A

1. Les 24 candidats du lot en cours, côté **sens français** : les quatre
   chevauchements connus sortent nommés (langue → לָשׁוֹן ; mince → רָזֶה ;
   frais → רַעֲנָן ; vrai → נָכוֹן). Des hits **sans conflit** sont attendus et
   licites (gloses : « couleur » matche `orange (couleur)`, « rond » matche
   `rond-point`, « perdre » matche `perdre (un match)`…) — le critère n'est pas
   « ABSENT partout », c'est « aucun chevauchement de sens non identifié ».
2. Les 24 candidats côté **hébreu** : aucun présent comme headword. Une seule
   présence comme *forme*, attendue et réelle : חי (candidat « vivant ») est la
   forme MS de לִחְיוֹת — chevauchement légitime à arbitrer, que l'inventaire
   par sous-agent du 23/07 n'avait pas vu (il n'extrayait que les headwords) :
   la commande à ~200 tokens détecte ce que les 56k tokens rataient. Les
   présences en mot exact dans des *exemples* sont informatives, pas des
   collisions. Contre-test positif : `לשון` → présent (Noms).
3. Anti-régression : « fin » ne matche plus « (infinitif) ».
4. Total `--stats` == compteur imprimé par `node build.js`.
5. `node build.js` et `node verifie_exemples.js` restent verts (aucune
   modification de `build.js` — tout est déjà exporté).

## 3. Chantier B — TODO.md : archiver les chantiers clos

- Créer **`TODO_ARCHIVE.md`** ; y déplacer les sections de chantiers **clos /
  soldés** (marqués TERMINÉ, CLOS, SOLDÉ, ou dont la mémoire/le git montre
  qu'ils sont finis : refonte 5 étapes, audit C1–C12, lag iPhone, lots
  d'exemples passés…) et les historiques de mesures datées.
- **Pur couper-coller** : zéro réécriture de contenu, blocs entiers déplacés —
  le diff se relit comme un déplacement, rien ne se perd.
- Restent dans TODO.md : état courant, « Reprendre ici », chantiers **ouverts**,
  § Outillage, § Rituel. Cible : ≤ ~15 KB (économie ~35k tokens par passe de
  doc — la plus grosse du plan).
- En tête de TODO.md, une ligne pointe l'archive : « chantiers clos →
  TODO_ARCHIVE.md (ne pas charger en session sauf besoin explicite) ».
- TODO_ARCHIVE.md n'est **jamais lu en session courante** ; il existe pour
  l'histoire et le grep ponctuel.

## 4. Chantier C — CLAUDE.md : compression (arbitrage par diff)

~21 KB rechargés à chaque tour. Méthode, sur validation du propriétaire
**ligne à ligne** (livrable = un diff, rien d'appliqué sans arbitrage) :

- **Toutes les règles restent.** Aucune règle, aucun piège, aucun invariant
  supprimé.
- Migre : la **narration d'historique** — dates de mesures répétées, genèses
  (« payé le 20/07 par… »), chiffres d'anecdotes déjà consignés en mémoire ou
  dans ARCHITECTURE. Chaque piège garde sa règle sèche + une ligne de pourquoi
  au maximum.
- Destination : faits durables → ARCHITECTURE.md ; leçons d'agent → mémoire
  (fichiers existants, pas de doublon).
- Cible : −30 à 40 %, soit ~1,5–2k tokens économisés **à chaque tour de chaque
  session future**.

## 5. Chantier D — règles de conduite (codifiées, plus jamais orales)

### 5.1 Le piège n°15 de CLAUDE.md (texte proposé, verbatim)

> 15\. ⚠️ **A question of existence, count or location is NEVER paid for by
> reading a file or dispatching a subagent — a command answers it directly**:
> `node cherche_mots.js` (notebook: words, French senses, line anchors,
> `--stats` for theme/level gaps), `graphify explain` (code), `grep -n` (the
> rest). Corollaries: (a) never `Read` a file over ~30 KB without
> `offset/limit` — the notebook, `app.html`, `flashcards_hebreu.html`,
> `ARCHITECTURE.md`, `DESIGN.md`, `TODO_ARCHIVE.md` all qualify. Get the target
> line from a command first (`cherche_mots.js` for content, `graphify explain`
> for code, `grep -n` on a section title for `.md` docs), then read ±30 lines
> around it — this includes the ritual's documentation pass, which edits
> sections, never re-reads whole files; (b) never paste a list, log or
> inventory longer than ~20 lines into a reply — named verdicts and `file:line`
> references only; (c) the paid-for counter-example: 2026-07-23, a subagent
> inventory of the notebook cost 56k tokens to learn that 24 words were
> absent — ~200 tokens by command.

### 5.2 Où chaque règle s'écrit (récapitulatif de codification)

| Fichier | Modification |
| --- | --- |
| `CLAUDE.md` | piège n°15 (§5.1) ; + `cherche_mots.js` dans la liste d'outillage de « What this is » |
| `TODO.md` | § Outillage : les deux commandes documentées ; « Reprendre ici » : flag `⚠️ GRAPHE À RECALER — 23/07 : cherche_mots.js, TODO_ARCHIVE.md, SPEC_ECONOMIE_TOKENS.md créés` (flag seulement, jamais d'update auto — règle du 21/07) |
| `README.md` | 1 ligne outillage |
| `ARCHITECTURE.md` | 1 ligne outillage (+ receveur des faits migrés du chantier C) |
| Mémoire agent | `dedup-mots-sans-lire-la-liste.md` mise à jour → pointer `cherche_mots.js` au lieu du one-liner grep |

### 5.3 Le déroulé standard d'un lot de vocabulaire (gravé par le piège 15)

1. Proposition de N candidats — **`he` + `fr` seulement**, tableau court (~1k).
2. `node cherche_mots.js` sur les N (~200) — seules les collisions remontent.
3. Arbitrage humain sur les collisions + le choix des mots.
4. Rédaction du JSON complet (niqqud, formes, exemples).
5. `node ajoute_mots.js lot.json` — dry-run, validation profonde, doublons §7.A
   en filet.
6. Relecture : tableau des `tr` dérivés + diff ciblé.
7. `--ecrire`, puis rituel (build, verifie, docs, commit).

## 6. Ce qui ne change pas (déjà optimal)

Graphe en rung 1 pour le code ; `build.js --check` / `verifie_exemples.js` /
`--parite` / `audit_carnet_mecanique.js` ; WebKit par sous-agents ; flag graphe
sans update automatique ; dry-run + diff ciblé d'`ajoute_mots.js` ;
ARCHITECTURE/DESIGN non coupés — ce sont des références, la règle de lecture
fenêtrée par taille (§5.1, corollaire a, qui les nomme explicitement) suffit.

## 7. Écartés, et pourquoi

- **Flag `--existe` dans `ajoute_mots.js`** : sa spec v2 est figée ; l'entrée
  de la consultation amont est différente (chaînes nues, pas un JSON de
  fiches). Un script, une responsabilité.
- **Hook bloquant les sous-agents d'inventaire** : un hook ne juge pas
  l'intention d'un prompt ; le piège 15 + la mémoire suffisent.
- **Recalage du graphe** : flag seulement, conformément à la règle du 21/07.
- **Étage 2 d'`ajoute_mots.js`** (pré-remplissage des fiches) : déjà spec'é
  hors périmètre (SPEC_AJOUTE_MOTS §10), inchangé.

## 8. Ordre d'exécution et commits

1. **Commit 1** — cette spec, une fois validée ; la ligne « Statut » d'en-tête
   passe à « validée (JJ/MM/AAAA) » dans le même commit (on ne commite pas un
   document qui se déclare en arbitrage).
2. **Commit 2** — outillage : `cherche_mots.js` ajusté + validation §2.3.
3. **Commit 3** — docs : TODO archivé (§3) + codification (§5.2).
4. **Chantier C** — diff proposé à part, commit séparé après arbitrage ligne à
   ligne. Peut être refusé sans affecter le reste.
5. Reprise du lot des 24 mots à l'étape 4 du déroulé §5.3 (les étapes 1–3 sont
   déjà faites).

## 9. Critères de succès du chantier entier

- Un « ce mot existe-t-il ? » coûte ~200 tokens, prouvé par l'usage sur le lot
  en cours.
- `wc -c TODO.md` ≤ ~15 Ko ; le diff d'archivage est un pur déplacement.
- Plus aucune règle d'économie qui ne vive que dans la conversation : tout est
  dans CLAUDE.md, TODO.md ou la mémoire.
- Le rituel et tous les gardes existants restent verts.

## 10. Correctifs post-livraison (relecture du 23/07, à appliquer)

La relecture par commandes du chantier livré a trouvé **un vrai défaut d'outil
et une promesse fausse**. Le carnet n'a rien subi : le bug était latent (§10.5).
Statut : **plan validé, exécution à faire.**

### 10.1 Correctif 1 — `cherche_mots.js` : faux « ABSENT » sur ktiv male/haser

**Symptôme mesuré** : sur les 24 mots du lot fraîchement insérés, **6 ressortent
`ABSENT`** — עיתון, דוגמה, עמוק, עגול, לזרוק, להרוויח.

**Cause** : un mot vocalisé s'écrit en **ktiv haser** (עִתּוֹן → `עתון` une fois
le niqqud retiré), mais on le cherche naturellement en **ktiv male** (`עיתון`).
La comparaison exacte sur `he_plain` rate le couple. Le sens de l'échec est le
dangereux : « absent » d'un mot présent ⇒ on insère un doublon. Taux réel :
**6/24 = 25 %**.

**Règle retenue** — après échec de la comparaison exacte, tenter la variante
orthographique : *A ~ B si l'un s'obtient de l'autre en n'**insérant** que des
ו/י*, avec deux garde-fous — forme courte **≥ 3 lettres**, **≤ 2 insertions**.
Les occurrences ainsi trouvées sortent dans une rubrique **« orthographe
voisine »**, jamais mêlées aux exactes.

**Réglage mesuré sur les 1053 `he_plain` distincts du carnet :**

| Réglage | Paires sur tout le corpus | Rattrape les 6 ? |
| --- | --- | --- |
| retrait naïf de tous les ו/י | 60 groupes / 132 mots — **écarté** | oui |
| MIN 3 / MAX 1 | 27 | oui |
| **MIN 3 / MAX 2 — retenu** | **37 (3,5 %)** | **oui** |
| MIN 4 / MAX 2 | 8 | **non** (rate עמק, עגל) |

Le retrait naïf est écarté par la mesure : il apparie לישן (dormir) ~ לשון
(langue) et יפה (beau) ~ פה (bouche). Les 37 paires de la règle retenue sont au
contraire **utiles** — מלוח~מלח (salé/sel), עצוב~עצב, רחב~רחוב : les
quasi-homographes qu'un éditeur veut voir signalés.

**Emplacement** : le helper va dans `build.js` + son `module.exports` (doctrine
« jamais de logique dupliquée »), parce que §10.2 le consomme aussi.

### 10.2 Correctif 2 — `ajoute_mots.js` partage l'angle mort

Le garde doublons §7.A de SPEC_AJOUTE_MOTS compare `he_plain` **exactement**. Il
passe aujourd'hui parce que tout candidat porte le niqqud, donc s'écrit défectif
comme le carnet — mais une fiche future écrite en ktiv male vocalisé (עִיתּוֹן)
glisserait à travers.

**Correctif à risque maîtrisé** : signal « orthographe voisine » en
**informatif non bloquant uniquement**, via le helper de §10.1. Le comportement
bloquant ne change pas ⇒ les 12 cas d'erreur validés le 23/07 restent verts.

### 10.3 Correctif 3 — documentaire : cette spec affirme deux choses fausses

- **§2.1** annonce « comparaison **exacte** sur `he_plain` » — c'est exactement
  ce qui a produit le bug. Réécrire avec la tolérance §10.1 et ses garde-fous.
- **§2.3** n'a aucun critère orthographique. Ajouter : les 6 mots retrouvés,
  **et** les contre-tests négatifs (לישן ne doit pas matcher לשון ; יפה ne doit
  pas matcher פה).
- **§4** promet « ~1,5–2k tokens économisés à chaque tour de chaque session
  future ». **Faux** : CLAUDE.md est passé de 21 014 o à 22 330 o (piège n°15,
  +1 316) puis à 21 026 o (compression, −1 304) — résultat net **+12 o**. La
  compression a exactement payé le nouveau piège. Consigner le résultat réel et
  la leçon : le fichier est ~94 % de règles, que §4 interdit de retirer ; **la
  cible était irréaliste dès l'écriture de la spec**. Le vrai gain du chantier
  est ailleurs et il est acquis : TODO.md 163 → 16 Ko, et l'inventaire à 56k
  tokens remplacé par une commande à ~200.

### 10.4 Correctif 4 — propagation

`TODO.md` § Outillage et la mémoire agent `dedup-mots-sans-lire-la-liste.md`
décrivent tous deux « hébreu → `he_plain` exact » : à corriger. Le piège n°15 de
CLAUDE.md ne détaille pas l'appariement — rien à y changer, vérifier au passage.

### 10.5 Validation des correctifs

1. Les 6 mots ressortent trouvés (rubrique « orthographe voisine »).
2. Contre-tests **négatifs** : `לישן` ne remonte pas לשון ; `יפה` ne remonte
   pas פה.
3. `node build.js --check` vert ; `verifie_exemples.js` à **14** avertissements
   (pas 15).
4. `ajoute_mots.js` : rejouer le lot des 24 déjà inséré donne toujours « Rien à
   insérer » (idempotence intacte), et les 12 cas d'erreur du §8 de
   SPEC_AJOUTE_MOTS restent verts.

### 10.6 Ce que la mesure a aussi prouvé

**Aucune des 37 paires n'est un doublon réel** — ce sont toutes des entrées
légitimement distinctes. Le carnet ne contient donc **aucun doublon caché** par
ce défaut : on corrige un piège avant qu'il ne morde, pas après.

### 10.7 Ordre d'exécution

Deux commits, **aucun contenu touché** ⇒ pas de bump `sw.js`, pas de flag graphe
(aucun fichier créé/supprimé/renommé) :

1. **Commit A** — outillage : helper dans `build.js` + export, consommation dans
   `cherche_mots.js` (rubrique dédiée) et `ajoute_mots.js` (informatif), puis la
   validation §10.5 en entier.
2. **Commit B** — docs : §2.1, §2.3 et §4 de cette spec ; TODO.md § Outillage et
   « Reprendre ici » ; mémoire agent.
