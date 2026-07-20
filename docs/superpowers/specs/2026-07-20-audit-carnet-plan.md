# Audit complet du carnet — plan d'exécution

**Date** : 2026-07-20 (plan écrit ; **exécution reportée à une session neuve**)
**Fichier visé** : `vocabulaire_hebreu.html` — 713 cartes, 564 exemples, 27 sections
**Origine** : demande de Ruben le 20/07 au soir. Angle retenu : **les trois, en
séquence** (justesse → pédagogie → présentation), méthode : **fan-out multi-agents**,
avec un **point d'arrêt entre chaque phase** pour validation.
**État** : ⏳ PLAN — rien n'a été exécuté. Les tranches de données ont été préparées
puis abandonnées avec la session ; l'étape 1.1 les régénère en une commande.

**Séquence décidée par Ruben — trois sessions distinctes, une par nature de travail** :

| Session | Rôle | S'arrête à |
| --- | --- | --- |
| 1 (20/07) | **Écriture du plan** — celle-ci | Le plan est écrit, rien n'est exécuté |
| 2 | **Review complète du plan, par Fable 5**, puis mise à jour du plan | ⛔ Après la mise à jour. **N'exécute rien** |
| 3 | **Exécution** de la phase 1, puis 2, puis 3 | Point d'arrêt à la fin de chaque phase |

⚠️ **La review de la session 2 se fait avec Fable 5 et ne se délègue pas.** Vérifier des
faits contre le dépôt (comptes, gardes, péremption) peut partir en sous-agent : c'est
mécanique. **Le jugement sur la méthode, non** — c'est exactement le genre de travail
que ce plan garde en haut de la pile, et le déléguer vers le bas contredirait sa propre
règle d'étagement.

---

## Pourquoi cet audit, et pourquoi maintenant

Les 713 mots et 564 exemples du carnet ont été écrits **en lots, sans relecture
humaine**, gardés uniquement par `verifie_exemples.js`. Or ce validateur vérifie des
propriétés *mécaniques* — chaque entrée a un exemple, le vocabulaire d'un exemple reste
dans +2 niveaux, la translittération ne s'écarte pas trop de `he2tr` — et **jamais la
justesse**. Un nikoud fautif, un genre inversé, un pluriel irrégulier mal formé, un
exemple qui ne se dit pas en israélien : tout cela passe au vert aujourd'hui.

C'est le seul angle du projet qui n'a jamais été audité, et c'est celui où une erreur
non vue **se mémorise** — le carnet est la source d'apprentissage, pas un rendu.

L'angle présentation, lui, est largement soldé (charte, rampe typographique de 8 pas,
colonne de lecture, `lang="he"` à 100 %, contraste AA). Il vient en dernier pour cette
raison.

---

## ⚠️ La contrainte qui commande tout le chantier

**Depuis `cb44367` (20/07), l'identité SRS d'une carte est `cat|he` — la forme
VOCALISÉE.** Corriger un nikoud change donc l'identité de la carte, et
**`srsMigrateIds()` ne rattrapera pas le coup** : elle ne connaît que l'ancienne clé
`cat|he_plain`, pas une correction orthographique. La progression Leitner de ce mot
repart à zéro, silencieusement.

Cela veut dire qu'un audit qui corrigerait 40 nikouds **effacerait la progression de 40
mots** sans que rien ne le signale. Trois issues, à trancher **avant** d'écrire la
première correction :

| Issue | Coût | Quand la choisir |
| --- | --- | --- |
| **Accepter la remise à zéro** | Ruben réapprend N mots | Si N est petit (< 15) et que les mots fautifs méritaient d'être revus de toute façon |
| **Table de migration ponctuelle** (recommandé) | ~30 lignes dans `app.html`, un bump SW | Dès que N dépasse la poignée. Une constante `SRS_RENAMES = {'Noms\|ancien': 'Noms\|nouveau', …}` appliquée par `srsMigrateIds()` avant la migration générique |
| **Grouper les corrections en un seul lot** | Aucun, c'est de l'hygiène | Toujours — un seul bump SW, une seule table, un seul commit |

➤ **À écrire dans le plan de correction, pas découvert en cours de route.** C'est
exactement le genre de coût qui, non anticipé, transforme un audit réussi en régression.

---

## L'architecture : quatre étages d'instrument, pas quatre modèles

La demande est « une armée de sous-agents, des modèles inférieurs, économiser sans
perdre en qualité ». La bonne réponse n'est pas seulement de descendre en gamme : c'est
de **ne jamais demander à un modèle ce qu'un script décide mieux et gratuitement**.

Chaque contrôle déplacé vers l'étage 0 économise **100 %** de ses tokens *et* gagne en
fiabilité — un script ne se trompe pas deux fois différemment.

| Étage | Instrument | Ce qu'il traite | Ce qu'il ne doit JAMAIS traiter |
| --- | --- | --- | --- |
| **0** | Script Node, 0 dépendance, **0 token** | Tout ce qui est décidable : intégrité, cardinalité, doublons, accords réguliers, cohérence intra-famille, écarts `he2tr` | — |
| **1** | **Haiku** | Tri de masse des drapeaux de l'étage 0 : « cette exception au genre est-elle connue ? », plausibilité brute d'une traduction | ⚠️ **Aucun jugement de nikoud ni de morphologie.** Haiku hallucine sur la vocalisation |
| **2** | **Sonnet** (effort moyen→haut) | L'audit réel : nikoud, morphologie, conjugaison, naturel des exemples, registre parlé | La synthèse, l'arbitrage, la décision de corriger |
| **3** | **Sonnet** (effort haut, prompts à *lentilles* distinctes) | Contre-expertise adversariale de chaque anomalie, **par défaut réfutée** | — |
| **3b** | **Opus** | Uniquement les anomalies *contestées* (1 réfutation sur 2), qui sont une minorité | Le volume — c'est un arbitre, pas un auditeur |
| **4** | **Fable 5**, fil principal | Orchestration, synthèse, priorisation, voix du projet, rédaction des docs et des commits | Lire les tranches — c'est précisément ce qu'on délègue |

**Règle de qualité non négociable** : le passage à un modèle inférieur se justifie par la
*nature mécanique* de la tâche, jamais par son volume. Un jugement de nikoud reste en
Sonnet même s'il y en a 713.

---

## Étape 0 — Étalonnage : mesurer l'instrument avant de s'en servir

⚠️ **Obligatoire, et à ne pas sauter sous prétexte que ça retarde le vrai travail.**
Le projet a déjà payé cette leçon deux fois (« un contrôle muet passe toujours au vert »
pour la couverture des niveaux ; l'émulation qui a inventé un défaut de 329 ms).

**Protocole** (1 à 2 agents, ~30k tokens) :

1. Prendre une tranche de 25 cartes et en fabriquer une copie **fautée** : y injecter
   **10 erreurs de nature connue et documentée** — 2 nikouds, 2 genres, 2 pluriels
   irréguliers, 2 formes verbales, 1 traduction française fausse, 1 exemple
   agrammatical.
2. Lancer le prompt d'audit de l'étage 2 sur la copie fautée **et** sur l'originale.
3. Relever :
   - **rappel** = erreurs injectées retrouvées / 10 ;
   - **précision** = anomalies signalées sur l'originale qui sont de vraies anomalies.

**Seuils de décision** :

| Résultat | Décision |
| --- | --- |
| Rappel ≥ 8/10 **et** ≤ 3 faux positifs sur l'originale | Lancer le fan-out tel quel |
| Rappel ≥ 8/10 mais > 3 faux positifs | Lancer, mais **durcir la contre-expertise** (3 lentilles au lieu de 2) |
| Rappel < 6/10 | **Ne pas lancer.** Le prompt ne voit pas ce qu'on cherche : le réécrire et réétalonner |

Ce chiffre de rappel doit **figurer dans le rapport final**. Un audit qui ne sait pas ce
qu'il rate annonce une exhaustivité qu'il n'a pas.

---

## PHASE 1 — Justesse de l'hébreu

### 1.0 — Pré-passe déterministe (`audit_carnet_mecanique.js`, 0 token)

Script de dev, zéro dépendance, sur le modèle de `verifie_exemples.js`. Il lit le carnet
(ou le `CARDS` embarqué) et sort deux listes : **erreurs** (certaines) et **drapeaux** (à
trier par l'étage 1). Quatorze contrôles :

**Intégrité — toute anomalie ici est une erreur, pas un drapeau**

1. `he_plain === stripNikud(he)` sur chaque carte, chaque forme, chaque exemple.
2. Cartes sans aucun nikoud (`he === he_plain`) — le carnet promet de l'hébreu vocalisé.
3. Doublons de `cat|he` (doit rester **0**) et de `cat|he_plain` (doit rester
   **exactement les 3 homographes connus** : לספר, ללמד, מה שלומך — toute quatrième
   collision est une nouveauté à instruire).
4. Cardinalité des formes : Verbes exactement 4 (`il`/`elle`/`ils`/`elles`), Adjectifs
   ≤ 3 (`f. sing.`/`m. plur.`/`f. plur.`), Noms 0 ou 1 (`pluriel`).
5. Pluriel identique au singulier.
6. Lettres finales (ך ם ן ף ץ) en position non finale ; nikoud doublé ; maqaf U+05BE
   confondu avec un trait d'union ASCII.

**Accords réguliers — drapeaux, car l'hébreu est plein d'exceptions légitimes**

7. Nom marqué `m` finissant par ־ָה / ־ת, ou marqué `f` ne finissant pas ainsi.
8. Nom `m` dont le pluriel ne finit pas par ־ִים, nom `f` dont le pluriel ne finit pas
   par ־וֹת (שולחנות, נשים… sont des exceptions vraies : c'est l'étage 1 qui tranche).
9. Adjectif dont les trois formes ne suivent pas le schéma d'accord attendu.

**Cohérence et translittération**

10. **Cohérence intra-famille** : un même lemme écrit différemment entre son entrée et
    un exemple, ou entre deux exemples. ⚠️ C'est *exactement* le défaut qui avait produit
    les quatre corrections orthographiques de `41cf08c` (מְאוֹד/מְאֹד, עַכְשָׁו/עַכְשָׁיו…),
    trouvées à la main. **L'automatiser est le meilleur rapport valeur/coût du plan.**
11. Écart `tr` ↔ `he2tr` par distance d'édition, sur les **entrées et les formes**
    (`verifie_exemples.js` ne le fait que sur les exemples). Distance > 2 = drapeau.
    ⚠️ Sévérité **basse par principe** : le carnet fait foi sur les `.tr` écrits à la
    main, `trKey` replie les variantes, l'affichage seul est concerné.
12. L'exemple contient-il réellement le mot vedette (ou une variante partageant sa
    racine consonantique) ? Sinon, drapeau.
13. Exemple sans traduction française, ou ratio de longueur hébreu/français aberrant.
14. Vocabulaire d'un exemple absent du carnet **à +1 niveau** (le validateur n'alerte
    qu'à +2) — donnée, pas erreur.

**Sortie** : `audit/mecanique.json` — `{erreurs:[], drapeaux:[]}`, chaque entrée portant
l'index de carte, la catégorie, le mot, le contrôle déclencheur.

### 1.1 — Préparation des tranches (0 token)

Extraire `CARDS` de `flashcards_hebreu.html` (il porte déjà les 713 cartes avec formes,
notes et exemples — inutile de faire lire 450 Ko de HTML à 28 agents) et découper en
**28 tranches équilibrées de 17 à 28 cartes**, une catégorie par tranche, index de carte
`__i` conservé pour la traçabilité. Écrire `audit/sNN.json` + `audit/_index.json`.

*(Le script de découpe a été écrit et validé le 20/07 — 28 tranches, 713 cartes
couvertes, vérifié — mais vit dans un scratchpad de session. Le réécrire prend deux
minutes ; le critère est : la somme des tranches vaut 713, sans recouvrement.)*

### 1.2 — Audit en fan-out (étage 2 — Sonnet × 28)

Un agent par tranche. **Sortie structurée obligatoire** (`schema`), pas de prose :

```json
{ "checked": 25,
  "findings": [{
    "card_index": 412, "he": "מִלָּה", "cat": "Noms",
    "field": "genre|he|fr|forms|exemple|niveau|tr|note",
    "severity": "bloquant|majeur|mineur",
    "claim": "…ce qui est faux, en français",
    "correction": "…la valeur juste proposée",
    "rule": "…la règle grammaticale précise qui est violée"
  }] }
```

**Le champ `rule` est le garde-fou anti-hallucination** : un auditeur incapable de nommer
la règle violée n'a pas trouvé d'erreur, il a eu une impression. À exiger explicitement
dans le prompt — *« si tu ne peux pas énoncer la règle, ne signale rien »*.

Échelle de sévérité, à fixer dans le prompt :

| Sévérité | Définition | Exemple |
| --- | --- | --- |
| **bloquant** | Ruben apprendrait quelque chose de faux | genre inversé, pluriel inexistant, forme verbale d'un autre binyan, traduction fausse |
| **majeur** | Juste mais trompeur ou non idiomatique | tournure livresque là où l'oral dit autre chose, nikoud d'un registre différent |
| **mineur** | Cosmétique ou éditorial | `.tr` divergent, ponctuation, niveau CECRL discutable d'un cran |

**À dire au prompt, sinon on récolte du bruit** :
- le standard de translittération du projet (CLAUDE.md § Transliteration standard) ;
- que le carnet **fait foi** sur les `.tr` — un écart n'est pas une erreur ;
- que la cible est **l'hébreu moderne parlé en Israël**, pas l'hébreu biblique ni le
  registre littéraire (PRODUCT.md : le but est l'aisance orale) ;
- la structure des cartes selon la catégorie (Verbes = infinitif + 4 formes du présent ;
  Adjectifs = 3 accords ; Noms = genre + pluriel) ;
- **de ne pas proposer de réécriture de style** — l'audit cherche le faux, pas le
  perfectible. Hors périmètre explicite.

### 1.3 — Contre-expertise adversariale (étage 3 — Sonnet × ~30, par lots)

Chaque anomalie passe devant **deux relecteurs indépendants aux lentilles distinctes** :

- **lentille grammaire** : « la règle invoquée existe-t-elle, et s'applique-t-elle
  vraiment à ce mot ? »
- **lentille usage** : « un Israélien dirait-il cela ? la correction proposée est-elle
  meilleure que l'original, ou seulement différente ? »

**Consigne par défaut : réfuter.** *« En cas de doute, réfute. Une anomalie confirmée à
tort coûte une correction fausse dans la source de vérité ; une anomalie réfutée à tort
ne coûte qu'un mot resté correct. »* L'asymétrie est réelle et doit être dite.

**Économie** : vérifier par **lots de 8 anomalies** par agent plutôt qu'une par agent —
même indépendance de jugement, ~4× moins de tokens d'amorçage. Deux passes de lots, une
par lentille.

**Verdict à trois niveaux** — c'est ce qui rend le rapport utilisable :

| Verdict | Condition | Suite |
| --- | --- | --- |
| **CONFIRMÉ** | aucune des 2 lentilles ne réfute | entre dans le lot de correction |
| **CONTESTÉ** | 1 réfutation sur 2 | monte à l'étage 3b (Opus), puis à Ruben si Opus hésite |
| **RÉFUTÉ** | les 2 réfutent | écarté — **mais consigné**, pour ne pas le retrouver au prochain audit |

### 1.4 — Arbitrage et rapport (étage 4 — fil principal, Fable)

Le fil principal ne lit **jamais** les tranches : il reçoit les anomalies structurées,
arbitre les contestées avec l'avis d'Opus, priorise, et rédige — c'est la « passe de
documentation » que CLAUDE.md garde en session principale, parce qu'elle demande la voix
du projet.

**Livrables** : un rapport priorisé par sévérité et par catégorie ; le taux de rappel de
l'étalonnage ; la liste des réfutées ; **et le plan de correction chiffré avec le coût
SRS** (combien de cartes changent d'identité — cf. la contrainte en tête de document).

### Critère d'acceptation — Phase 1

- [ ] 713 cartes couvertes, **somme des tranches vérifiée** (pas « ~toutes »).
- [ ] Rappel d'étalonnage **≥ 8/10**, chiffre publié dans le rapport.
- [ ] 100 % des anomalies portent une `rule` nommée ; celles sans règle sont écartées
      **avant** la contre-expertise (elles ne méritent pas son coût).
- [ ] Chaque anomalie retenue a **deux verdicts** de lentilles distinctes.
- [ ] Les 3 homographes connus sont toujours exactement 3 (garde de non-régression).
- [ ] Le coût SRS du lot de correction est **chiffré**, et l'issue choisie parmi les
      trois de la table.
- [ ] Après corrections : `node build.js` vert, `node verifie_exemples.js` **0 erreur**,
      `build.js --check` en phase, comptes de cartes et d'exemples inchangés **sauf
      variation expliquée**.

### ⛔ Point d'arrêt — validation de Ruben avant la phase 2

---

## PHASE 2 — Pédagogie et progression

Questions différentes, donc instruments différents. Ici on ne cherche plus le **faux**
mais le **manquant** et le **mal ordonné**. Le fan-out par tranches de cartes ne convient
pas : il faut la vue d'ensemble, et **le carnet lui-même** (sections, ordre, grammaire),
pas seulement le JSON des cartes.

**Cinq analyses, une par agent (Sonnet), chacune sur une question fermée** :

1. **Trous de vocabulaire.** Qu'est-ce qu'un francophone A1/A2 doit pouvoir dire et que
   le carnet ne permet pas ? Sortie : liste priorisée par fréquence d'usage réel.
2. **Équilibre des catégories.** 301 noms pour 97 verbes et 22 phrases : est-ce la forme
   d'un carnet qui vise **l'aisance orale** (PRODUCT.md) ? Un nom se reconnaît, un verbe
   se parle. Sortie : ratio observé vs. ratio défendable, argumenté.
3. **Ordre et prérequis.** Un exemple emploie-t-il une structure grammaticale enseignée
   *plus loin* dans le carnet (smikhout, passé, prépositions fléchies) ? C'est le défaut
   qui avait motivé la section du hé directionnel — **systématiser la recherche**.
4. **Justesse des niveaux CECRL.** Les 328 A1 sont-ils vraiment A1 ? Échantillon
   statistique, pas exhaustif : on cherche un **biais systématique**, pas des cas.
5. **Registre.** Le vocabulaire est-il celui qu'on parle, ou celui qu'on lit ? Repérer
   les entrées littéraires là où l'oral dit autre chose.

**Étage 0 également mobilisable ici** : distribution des niveaux par catégorie, longueur
moyenne des exemples par niveau, couverture des racines les plus productives, mots du
carnet jamais réemployés dans aucun exemple (un mot enseigné mais jamais remontré).

**Recherche externe** : autorisée et utile pour la question 1 (listes de fréquence de
l'hébreu moderne, référentiels CECRL). À déléguer, jamais en session principale.

### Critère d'acceptation — Phase 2

- [ ] Les cinq analyses rendues, chacune avec **des nombres** et non des impressions.
- [ ] Toute proposition d'ajout est **chiffrée** (combien de mots, quelles catégories) et
      confrontée au coût : chaque entrée ajoutée exige un exemple (règle `verifie_exemples.js`).
- [ ] Aucune recommandation qui contredise une décision déjà actée dans PRODUCT.md ou
      TODO.md sans **la nommer et l'argumenter**.

### ⛔ Point d'arrêt — validation de Ruben avant la phase 3

---

## PHASE 3 — Présentation (impeccable)

L'angle le plus abouti : on cherche le reliquat, pas la refonte.

1. **Rafraîchir le sidecar** : `.impeccable/design.json` est **périmé** face à DESIGN.md
   (le hook le signale à chaque édition). `/impeccable document` d'abord — sinon
   l'audit juge le carnet contre une charte qui n'est plus la sienne.
2. **Passe impeccable** sur `vocabulaire_hebreu.html`, comme celle qu'a reçue le portail
   le 18/07 (le carnet n'a jamais eu d'équivalent aussi poussé).
3. **Vérification aux deux bouts** — ⚠️ **piège n°13** : nos contrôles sont
   iPhone-émulés, un défaut desktop y est structurellement invisible ; c'est ainsi que
   les 158 caractères par ligne ont traversé toutes les critiques du projet. Mesurer à
   **1440/1280/992/900/768 + iPhone 16 Pro**, et prouver que le mobile reste identique.
4. **Contrôle des règles nommées de DESIGN.md** : règle de la lampe, les couches, la
   vedette, la carte unique, le pli, les deux voix de micro-titre, le pointillé réservé
   au vide.

### Critère d'acceptation — Phase 3

- [ ] Sidecar rafraîchi **avant** l'audit.
- [ ] 0 débordement horizontal aux six largeurs ; mobile identique au pixel.
- [ ] Chaque finding rattaché à une règle nommée de DESIGN.md, ou écarté comme
      préférence personnelle.

---

## Comment les corrections entrent (les trois phases)

1. **Une seule source de vérité** : toute correction s'écrit dans
   `vocabulaire_hebreu.html`. Ne **jamais** toucher `flashcards_hebreu.html` (généré).
2. **Une incohérence entre un exemple et son entrée se corrige dans l'exemple**, jamais
   dans l'entrée — sauf vraie faute de sens, et en le disant (règle TODO.md, durcie
   depuis que l'identité est sensible au nikoud).
3. **Un lot, un bump SW, une table de migration SRS** — pas de corrections au fil de
   l'eau.
4. **Rituel complet** après chaque lot : `build.js`, `verifie_exemples.js` à 0 erreur,
   `--check` en phase, docs, commit en français.
5. **Graphe** : contenu seul → *pas* de `/graphify --update` (~235k tokens pour rien).
   Seulement si un script d'audit est ajouté au dépôt — là, c'est structurel.

---

## Budget estimé et garde-fous

| Poste | Modèle | Estimation |
| --- | --- | --- |
| Étage 0 (scripts) | — | **0 token**, quelques secondes |
| Étalonnage | Sonnet × 2 | ~30k |
| Phase 1 audit | Sonnet × 28 | ~600k |
| Phase 1 contre-expertise | Sonnet × ~30 (lots de 8) | ~350k |
| Phase 1 arbitrage contestés | Opus × quelques-uns | ~50k |
| Phase 2 | Sonnet × 5 + recherche | ~300k |
| Phase 3 | impeccable + WebKit délégué | ~200k |
| **Total** | | **~1,5 M tokens**, hors corrections |

**Garde-fous** :
- ⚠️ **Aucun plafond silencieux.** Si une limite est posée (top-N anomalies,
  échantillonnage), elle doit être **écrite dans le rapport**. Une troncature muette se
  lit comme une couverture complète — c'est la même faute que le contrôle muet.
- Arrêt si le rappel d'étalonnage est sous 6/10 : on répare l'instrument, on ne produit
  pas un rapport dont on sait qu'il ment par omission.
- Les sous-agents ne commitent pas et ne modifient pas le carnet : ils **rapportent**.
  L'écriture reste au fil principal.

---

## Les pièges de cet audit (déjà payés ailleurs)

1. **Un sous-agent qui répond « c'est bon » a coûté sa fenêtre et n'a rien prouvé.**
   Exiger des comptes et les anomalies nommées, jamais un verdict global.
2. **Ne pas régénérer les `.tr` depuis `he2tr`.** Le carnet fait foi ; `trKey` replie les
   variantes ; la conformité au standard est un signal éditorial, pas une erreur.
3. **Ne pas « corriger » un homographe en le dévocalisant** pour éviter un doublon : les
   trois collisions connues sont *voulues* et distinguées par le nikoud depuis `cb44367`.
4. **Ne pas renommer un label `.count` de section** : c'est la clé d'extraction des deux
   parseurs, une section renommée perd toutes ses cartes en silence.
5. **`data-niveau` est obligatoire** sur chaque `<li>` et chaque `<tr>` — `build.js`
   échoue en nommant le mot fautif. Un ajout de vocabulaire sans niveau bloque le build.
6. **Toute entrée ajoutée exige un exemple** (verbes : au présent), sinon
   `verifie_exemples.js` bloque.
7. **L'ordre d'insertion des propriétés** des objets carte doit rester identique entre
   les deux extracteurs — `build.js --check` compare octet à octet.

---

## Hors périmètre — signalé, pas passé sous silence

- **La réécriture stylistique** des exemples corrects : l'audit cherche le faux et le
  manquant, pas le perfectible. Un exemple juste et un peu plat reste.
- **L'ajout massif de vocabulaire** : la phase 2 peut *recommander* des ajouts chiffrés,
  mais les écrire est un autre chantier, avec son propre lot d'exemples et sa relecture.
- **Le chantier du premier affichage** (lenteur à l'ouverture du portail puis de l'app,
  signalée le 20/07) : sans rapport, instruit séparément — voir TODO.md « Reprendre ici ».

---

# ANNEXE — Gabarits de prompts (à utiliser littéralement)

⚠️ **Pourquoi cette annexe existe.** Le corps du plan *décrit* ce que les prompts doivent
contenir. Cela suffit à un modèle fort, qui comble les trous ; **cela ne suffit pas à un
modèle de gamme inférieure**, et c'est précisément là que le plan les envoie. Un critère
flou produit une anomalie floue, et une anomalie floue coûte le double : la fenêtre de
l'auditeur, puis celle du vérificateur qui la réfute.

Les gabarits ci-dessous sont donc **à copier tels quels**, en substituant les
`{PLACEHOLDERS}`. Trois propriétés les rendent robustes :

1. **La sortie est contrainte par `schema`**, pas par la politesse — la validation se
   fait à la couche outil, le modèle re-tente jusqu'à se conformer. Le format ne peut
   pas dériver, quel que soit le modèle.
2. **Les exemples calibrants font le gros du travail.** Sur un modèle faible, deux
   bons cas et trois mauvais valent plus que dix lignes de consignes.
3. **Chaque tâche a une porte de sortie explicite** (« si tu ne peux pas nommer la
   règle, ne signale rien »). Sans elle, un modèle sous pression invente plutôt que
   de rendre une liste vide.

---

## A — Étage 2 : auditeur d'une tranche (Sonnet)

```
Tu audites la JUSTESSE d'une tranche du carnet de vocabulaire hébreu d'un
apprenant francophone. Tu ne corriges rien : tu signales.

Lis UNIQUEMENT ce fichier : {CHEMIN_TRANCHE}
N'ouvre aucun autre fichier du dépôt. Tout ce dont tu as besoin y est.

Chaque carte est un objet : cat (catégorie), he (hébreu VOCALISÉ, avec nikoud),
he_plain (sans nikoud), tr (translittération), fr (français), niveau (CECRL),
genre (m/f, noms uniquement), forms (formes fléchies), exemples, __i (index
stable — à reporter tel quel dans tes signalements).

Structure attendue selon la catégorie :
- Verbes : `he` est l'INFINITIF, `forms` = 4 formes du PRÉSENT (il, elle, ils, elles)
- Adjectifs : `forms` = 3 accords (f. sing., m. plur., f. plur.)
- Noms : `genre` (m/f) + `forms` = le pluriel

CE QUE TU CHERCHES (par ordre d'importance) :
1. Hébreu faux : nikoud fautif, orthographe consonantique fautive, forme verbale
   d'un autre binyan, pluriel inexistant, accord d'adjectif faux
2. Genre déclaré faux
3. Traduction française fausse ou trompeuse
4. Exemple agrammatical, ou dont le français ne correspond pas à l'hébreu, ou qui
   n'emploie pas le mot vedette
5. Exemple juste mais qu'un Israélien ne dirait pas (registre livresque)

LA CIBLE EST L'HÉBREU MODERNE PARLÉ EN ISRAËL. Ni biblique, ni littéraire.
Le but du carnet est l'aisance orale.

CE QUE TU NE SIGNALES JAMAIS :
- Les écarts de translittération (`tr`). Le carnet FAIT FOI sur ces valeurs, elles
  sont écrites à la main et l'appli replie toutes les variantes à la saisie. Un `tr`
  qui s'écarte d'une norme n'est pas une erreur.
- Le style. Un exemple juste et un peu plat reste. Tu cherches le FAUX, pas le
  perfectible. Aucune proposition de réécriture.
- Une préférence personnelle de vocabulaire ou de nikoud quand les deux formes
  existent réellement.

RÈGLE ANTI-INVENTION, LA PLUS IMPORTANTE :
Chaque signalement doit nommer la RÈGLE grammaticale précise qui est violée.
Si tu ne peux pas l'énoncer, tu n'as pas trouvé d'erreur : tu as eu une impression.
Ne la signale pas. Une tranche sans anomalie est un résultat normal et attendu —
rends une liste vide sans t'excuser et sans meubler.

Retourne : le nombre de cartes examinées et la liste des anomalies.
```

**Exemples calibrants — à inclure dans le prompt tels quels.**

*À SIGNALER (bon signalement)* :

> Carte `Noms` — `he`: יַלְדָּה, `fr`: « fille », `genre`: **"m"**, pluriel: יְלָדוֹת
> → `field`: genre · `severity`: bloquant · `correction`: "f"
> `rule`: « Nom à terminaison ־ָה accentuée, féminin sans exception ici ; le pluriel
> יְלָדוֹת en ־וֹת le confirme. **La carte se contredit elle-même** : son pluriel est
> féminin et son genre déclaré masculin. »

*À SIGNALER (bon signalement)* :

> Carte `Verbes` — `he`: לְלַמֵּד « enseigner », forme *il* : **לוֹמֵד**
> → `field`: forms · `severity`: bloquant · `correction`: מְלַמֵּד
> `rule`: « לְלַמֵּד est au binyan piel : son participe présent prend le préfixe מ־
> (מְלַמֵּד). לוֹמֵד est le présent de לִלְמֹד (paal, "étudier") — c'est la forme de
> l'autre membre de la paire d'homographes consonantiques. »

*À NE PAS SIGNALER (faux positif classique)* :

> Carte `Noms` — שֻׁלְחָן « table », `genre`: "m", pluriel: שֻׁלְחָנוֹת
> ✗ Ne signale PAS « pluriel en ־וֹת pour un masculin ». שולחן est un masculin à
> pluriel en ־ות parfaitement régulier dans l'usage. **La règle m→־ִים a des
> exceptions nombreuses et attestées** ; ne signaler que si le mot n'en est pas une.

*À NE PAS SIGNALER* :

> `tr`: « yesh ktsat chalav bamekarer » là où une norme donnerait « ketsat ».
> ✗ Hors périmètre : le carnet fait foi sur les `tr`.

*À NE PAS SIGNALER* :

> Un exemple correct et banal (« אֲנִי אוֹכֵל לֶחֶם » — « je mange du pain »).
> ✗ Il est juste. Le manque de relief n'est pas une anomalie.

**Schéma de sortie** (contraint par l'outil) :

```json
{ "checked": 25,
  "findings": [{ "card_index": 412, "he": "…", "cat": "…",
    "field": "he|fr|genre|forms|exemple|niveau|note",
    "severity": "bloquant|majeur|mineur",
    "claim": "…", "correction": "…", "rule": "…" }] }
```

---

## B — Étage 3 : vérificateur, lentille GRAMMAIRE (Sonnet)

```
Tu es un RELECTEUR ADVERSARIAL. On te soumet des anomalies signalées par un
auditeur dans un carnet d'hébreu. Ton rôle n'est pas de les confirmer : c'est
d'essayer de les RÉFUTER.

Pour chacune, une seule question : la règle grammaticale invoquée existe-t-elle
vraiment, et s'applique-t-elle vraiment à CE mot ?

Motifs de réfutation les plus fréquents, à chercher activement :
- la règle est inventée, ou énoncée trop largement
- la règle existe mais le mot en est une exception attestée
- les deux formes existent réellement en hébreu moderne
- l'auditeur a confondu deux lemmes (racines consonantiques homographes)
- la « correction » proposée est fausse, ou pas meilleure que l'original

⚠️ PAR DÉFAUT, RÉFUTE. En cas de doute, réfute.
L'asymétrie est réelle et voulue : une anomalie confirmée à tort fait entrer une
correction FAUSSE dans la source de vérité d'un apprenant ; une anomalie réfutée à
tort laisse seulement un mot correct en place. Le second coût est très inférieur.

Ne confirme que si tu peux redire la règle toi-même, dans tes propres termes,
et montrer qu'elle s'applique.

Anomalies à examiner ({N}) : {LOT_JSON}
```

**Schéma** : `{ "verdicts": [{ "card_index": 412, "refuted": true,
"reason": "…", "confidence": 0.0-1.0 }] }`

---

## C — Étage 3 : vérificateur, lentille USAGE (Sonnet)

Même ossature que B, **question différente** — c'est la diversité des lentilles qui
attrape ce que la redondance manque :

```
Ton angle n'est PAS la règle grammaticale : c'est l'usage réel en Israël aujourd'hui.

Pour chaque anomalie, deux questions :
1. Un Israélien dirait-il ce que dit le carnet ? (si oui → réfute : ce n'est pas
   une erreur, même si une autre forme est plus « correcte » sur le papier)
2. La correction proposée est-elle réellement MEILLEURE, ou seulement différente ?
   (si seulement différente → réfute)

⚠️ Le carnet vise l'aisance ORALE. Une forme parlée courante n'est jamais une
erreur, même si la grammaire prescriptive préfère autre chose. Une correction qui
rend le carnet plus livresque est une régression, pas un correctif.

PAR DÉFAUT, RÉFUTE.
```

---

## D — Étage 1 : trieur de drapeaux (Haiku)

⚠️ **La tâche de Haiku doit être une question FERMÉE.** Aucun jugement de nikoud,
aucune morphologie ouverte — c'est écrit comme interdit dans le corps du plan.

```
Un script a signalé des noms hébreux dont l'accord genre/pluriel s'écarte du schéma
régulier (masculin → ־ִים, féminin → ־וֹת).

Pour chacun, réponds à UNE question fermée : ce mot est-il une exception CONNUE et
courante de l'hébreu moderne ?

- "oui"      → c'est une irrégularité attestée (ex. שולחן/שולחנות, אישה/נשים,
               שנה/שנים). Le drapeau tombe.
- "non"      → aucune irrégularité connue, l'écart est suspect. Le drapeau monte
               à l'auditeur Sonnet.
- "incertain" → tu n'en es pas sûr. DIS-LE. Ne devine pas, ne raisonne pas sur la
               morphologie : "incertain" est une réponse juste et utile, elle fait
               monter le drapeau d'un étage.

Tu ne juges NI le nikoud, NI la traduction, NI l'exemple. Uniquement : exception
connue, oui / non / incertain.

Mots à trier ({N}) : {LOT_JSON}
```

**Schéma** : `{ "answers": [{ "card_index": 412, "answer": "oui|non|incertain",
"exception": "nom de l'irrégularité si connue, sinon null" }] }`

⚠️ **Un « incertain » ne se jette pas : il escalade.** Un trieur bon marché qui
n'aurait pas le droit d'hésiter mentirait pour se conformer — et un drapeau perdu à
cet étage ne sera jamais rattrapé aux étages suivants, puisqu'ils ne le verront pas.
