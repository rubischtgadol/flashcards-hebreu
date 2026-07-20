# Audit complet du carnet — plan d'exécution

**Date** : 2026-07-20 (plan écrit ; **exécution reportée à une session neuve**)
**Fichier visé** : `vocabulaire_hebreu.html` — 713 cartes, 564 exemples, 27 sections
**Origine** : demande de Ruben le 20/07 au soir. Angle retenu : **les trois, en
séquence** (justesse → pédagogie → présentation), méthode : **fan-out multi-agents**,
avec un **point d'arrêt entre chaque phase** pour validation.
**État** : ⛔ **PHASE 1 TERMINÉE (session 4, 20/07) — en attente de validation de
Ruben.** Rappel d'étalonnage 17/20, 3 anomalies confirmées, 1 escalade, 18 réfutées
consignées, coût SRS N = 2. Rapport :
[`2026-07-20-audit-carnet-rapport-phase1.md`](2026-07-20-audit-carnet-rapport-phase1.md).
Aucune correction appliquée — le lot de correction et la phase 2 attendent le feu
vert. Le déroulé exact est dans le **« Journal d'exécution — session 4 »** juste
avant l'annexe.
**Review (session 2)** : ✅ faite le 20/07 par Fable 5. Les corrections sont marquées
**✎R2** dans le corps du texte ; le récapitulatif est dans la section « Révision de la
session 2 » ci-dessous.

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

## ✎R2 — Révision de la session 2 (20/07, Fable 5) : ce qui a changé et pourquoi

**Vérifié exact contre le dépôt** (trois sous-agents, rien à corriger) : 713 cartes,
564 exemples, 27 labels `.count` ; Noms 301 / Verbes 97 / Phrases 22 / A1 328 ;
0 doublon `cat|he` et exactement les 3 doublons `cat|he_plain` attendus (les
homographes) ; 0 carte sans nikoud ; `cardId = cat+'|'+he` (`app.html:1307`) et
`srsMigrateIds` (`app.html:1315-1328`) qui, mécanisme vérifié, **ne rattrape pas** une
correction de nikoud ; toutes les gardes de `build.js` (EXPECTED_CATS/LEVELS,
`data-niveau` nominatif, `--check` octet à octet) ; `verifie_exemples.js` (exemple
manquant bloquant, alerte niveau à +2, contrôle `he2tr` sur les exemples seuls) ; les
4 mots de `41cf08c` ; le sidecar impeccable réellement périmé (18/07 vs 20/07).

**Corrigé — chaque point est marqué ✎R2 à l'endroit du texte** :

1. **Contrainte SRS resserrée** : seule une correction du `he` **vedette** change
   l'identité — `forms`, `exemples`, `fr`, `genre`, `niveau` ne coûtent rien. Le N à
   chiffrer est le nombre d'anomalies confirmées avec `field: he`, pas le total.
2. **Étalonnage refondu** : 2 tranches × 10 erreurs (le seuil 8/10 sur un seul tirage
   de 10 est du bruit binomial), règles d'injection anti-biais, et surtout : un
   signalement sur la tranche originale n'est pas mécaniquement un faux positif — il
   doit être adjugé, car le carnet peut contenir de vraies erreurs (c'est la prémisse
   de l'audit).
3. **L'asymétrie de la contre-expertise était fausse** telle qu'énoncée : une anomalie
   réfutée à tort ne laisse pas « un mot correct », elle laisse **l'erreur en place**.
   Le défaut de réfutation est conservé, mais les réfutés de sévérité `bloquant`
   passent désormais devant Opus.
4. **L'étage 1 (Haiku) devient conditionnel** : Sonnet lit déjà chaque carte en 1.2 —
   par défaut les drapeaux sont injectés dans les tranches et tranchés là, à coût
   marginal nul. Haiku ne sert que si les drapeaux dépassent ~150.
5. **Contrôles 9, 10 et 12 opérationnalisés** — tels qu'écrits ils n'étaient pas
   décidables par script. Le contrôle 10 corrigé en profondeur : les quatre cas de
   `41cf08c` sont des variations de **lettre de lecture** (מאוד/מאד — le `he_plain`
   change aussi), pas du nikoud à consonnes égales ; le contrôle initial ne les aurait
   **pas vus**. Il faut deux filets, et une liste blanche pour les 3 homographes.
6. **Incohérence `tr` résolue** : le schéma de 1.2 offrait `tr` comme champ signalable
   et la table de sévérité citait « `.tr` divergent » en mineur, alors que le prompt
   l'interdit. `tr` retiré partout — c'est l'affaire du contrôle 11, étage 0.
7. **Phase 3** : le « hook qui signale le sidecar périmé » n'existe pas (aucun hook
   dans le dépôt) — la péremption est réelle mais silencieuse. Liste des règles
   nommées alignée sur DESIGN.md réel (« le pli » est un composant, pas une règle).
8. **Annexe étoffée** : exemple calibrant « champ exemple » ajouté au gabarit A (les
   points 4-5 de sa liste n'en avaient aucun), exemple de réfutation type ajouté au
   gabarit B (לַיְלָה), garde « un oui doit nommer son exception » au gabarit D, et
   gabarit E (l'arbitre Opus, qui n'avait pas de prompt).
9. **Précisions** : la garde « toute entrée exige un exemple » ne couvre que
   Noms/Adjectifs/Verbes (`CATS_COUVERTES`) ; les petites catégories (Existence,
   2 cartes) se regroupent en tranche mixte ; cardinalités des `forms` resserrées sur
   la distribution mesurée (Adjectifs : exactement 3, pas ≤ 3).

**Jugé et laissé tel quel** : le grain de 28 tranches (~25 cartes/agent, bon
équilibre attention/amorçage), les deux lentilles de contre-expertise (suffisantes une
fois le filet Opus ajouté), le verdict à trois niveaux, la séquence des trois phases,
le budget (~1,5 M).

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

✎R2 — **Périmètre précisé après lecture du code** (`cardId`, `app.html:1307`) : la clé
ne lit que `cat` et `he`. Donc **seule une correction du `he` de la carte vedette change
l'identité** — corriger une forme fléchie, un exemple, une traduction, un genre ou un
niveau ne coûte rien au SRS. Le N à chiffrer en 1.4 est exactement le nombre d'anomalies
confirmées portant `field: he`, pas le total des corrections. Deux détails pour l'issue
« table de migration » : `sess_v1` (la session en cours, sessionStorage) référence aussi
`cardId`, mais il est volatile — la session est simplement abandonnée au rechargement,
rien à migrer ; et la purge des clés orphelines de `srsMigrateIds` ne tourne que si
`moved > 0`, donc `SRS_RENAMES` doit s'appliquer avant ce comptage (ou purger
elle-même), sinon l'ancienne entrée traîne dans `localStorage`.

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
| **1** | **Haiku** (✎R2 : **conditionnel** — voir le routage des drapeaux en 1.0) | Tri de masse des drapeaux de l'étage 0, **seulement s'ils dépassent ~150**. En deçà, les drapeaux partent dans les tranches de l'étage 2, qui les tranche pour zéro token de plus | ⚠️ **Aucun jugement de nikoud ni de morphologie.** Haiku hallucine sur la vocalisation. Un « oui » sans exception nommée vaut « incertain » |
| **2** | **Sonnet** (effort moyen→haut) | L'audit réel : nikoud, morphologie, conjugaison, naturel des exemples, registre parlé | La synthèse, l'arbitrage, la décision de corriger |
| **3** | **Sonnet** (effort haut, prompts à *lentilles* distinctes) | Contre-expertise adversariale de chaque anomalie, **par défaut réfutée** | — |
| **3b** | **Opus** | Les anomalies *contestées* (1 réfutation sur 2) **et, ✎R2, les réfutées de sévérité `bloquant`** — deux minorités | Le volume — c'est un arbitre, pas un auditeur |
| **4** | **Fable 5**, fil principal | Orchestration, synthèse, priorisation, voix du projet, rédaction des docs et des commits | Lire les tranches — c'est précisément ce qu'on délègue |

**Règle de qualité non négociable** : le passage à un modèle inférieur se justifie par la
*nature mécanique* de la tâche, jamais par son volume. Un jugement de nikoud reste en
Sonnet même s'il y en a 713.

---

## Étape 0 — Étalonnage : mesurer l'instrument avant de s'en servir

⚠️ **Obligatoire, et à ne pas sauter sous prétexte que ça retarde le vrai travail.**
Le projet a déjà payé cette leçon deux fois (« un contrôle muet passe toujours au vert »
pour la couverture des niveaux ; l'émulation qui a inventé un défaut de 329 ms).

**Protocole** (✎R2 : 4 passes d'agent, ~50k tokens — passé de 1 tranche × 10 erreurs à
**2 tranches × 10**. Un instrument à 80 % de rappel réel ne franchit un seuil de 8/10
qu'environ 2 fois sur 3 : sur dix tirages, le bruit binomial mange la mesure. À 20
injections, le seuil discrimine vraiment, pour deux passes d'agent de plus) :

1. Prendre **deux** tranches (✎R2 : une de Noms — genre + pluriel, les contrôles les
   plus riches — et une de Verbes) et en fabriquer des copies **fautées** : y injecter
   **10 erreurs chacune, de nature connue et documentée** — par tranche : 2 nikouds,
   2 genres, 2 pluriels irréguliers mal formés, 2 formes verbales, 1 traduction
   française fausse, 1 exemple agrammatical.

   ✎R2 — **trois règles d'injection, sans lesquelles la mesure est biaisée** :
   - les erreurs sont **écrites par le fil principal**, et le corrigé ne figure nulle
     part dans le contexte de l'auditeur — qui ne sait pas qu'il est testé ;
   - **aucune erreur ne décalque un exemple calibrant de l'annexe** (le genre de
     יַלְדָּה et le participe de לְלַמֵּד sont déjà dans le prompt : les retrouver
     prouverait le pattern-matching, pas le rappel) ;
   - **subtiles et réalistes** : un patah pour un kamats, un participe du binyan
     voisin, un pluriel plausible mais faux — pas des corruptions visibles à l'œil nu.
2. Lancer le prompt d'audit de l'étage 2 (gabarit A, tel quel) sur les copies fautées
   **et** sur les originales.
3. Relever :
   - **rappel** = erreurs injectées retrouvées / 20 ;
   - **précision** — ✎R2 : un signalement sur l'originale n'est **pas** mécaniquement
     un faux positif. Le carnet n'a jamais été relu : il peut contenir de vraies
     erreurs, c'est la prémisse même de l'audit. Chaque signalement sur l'originale
     est donc **adjugé** (fil principal, Opus si besoin) : vraie erreur → découverte
     anticipée, versée à la phase 1 ; fausse → compte comme faux positif.

**Seuils de décision** (✎R2 : recalés sur 20 injections et des faux positifs *adjugés*) :

| Résultat | Décision |
| --- | --- |
| Rappel ≥ 16/20 **et** ≤ 6 faux positifs adjugés | Lancer le fan-out tel quel |
| Rappel ≥ 16/20 mais > 6 faux positifs | Lancer, mais **durcir la contre-expertise** (3 lentilles au lieu de 2) |
| Rappel 12–15/20 | Réécrire le prompt, réétalonner **une** fois ; sous 16 au second essai, remonter à Ruben avant de brûler 1 M de tokens |
| Rappel < 12/20 | **Ne pas lancer.** Le prompt ne voit pas ce qu'on cherche : le réécrire et réétalonner |

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
4. Cardinalité des formes — ✎R2 : resserrée sur la distribution mesurée le 20/07
   (0 écart) : Verbes **exactement 4** (`il`/`elle`/`ils`/`elles`), Adjectifs
   **exactement 3** (`f. sing.`/`m. plur.`/`f. plur.`), Noms **0 ou 1** (`pluriel`).
5. Pluriel identique au singulier.
6. Lettres finales (ך ם ן ף ץ) en position non finale ; nikoud doublé ; maqaf U+05BE
   confondu avec un trait d'union ASCII.

**Accords réguliers — drapeaux, car l'hébreu est plein d'exceptions légitimes**

7. Nom marqué `m` finissant par ־ָה / ־ת, ou marqué `f` ne finissant pas ainsi.
8. Nom `m` dont le pluriel ne finit pas par ־ִים, nom `f` dont le pluriel ne finit pas
   par ־וֹת (שולחנות, נשים… sont des exceptions vraies : c'est l'étage 1 qui tranche).
9. Adjectif dont les trois formes ne portent pas les terminaisons attendues — ✎R2,
   opérationnalisé : heuristique de suffixe et rien de plus (f. sing. en ־ָה ou ־ת,
   m. plur. en ־ִים, f. plur. en ־וֹת) ; tout écart est un drapeau, jamais une erreur.

**Cohérence et translittération**

10. **Cohérence intra-famille** — ✎R2, entièrement réécrit : « reconnaître un lemme
    sous ses flexions » n'est pas décidable par script, et le contrôle tel qu'il était
    pensé (même consonnes, nikoud divergent) **n'aurait pas vu les quatre cas de
    `41cf08c`** — vérification faite au diff (מְאוֹד→מְאֹד, עַכְשָׁיו→עַכְשָׁו,
    שָׁחֹר→שָׁחוֹר, בַּחֹרֶף→בַּחוֹרֶף), ce sont des variations de **lettre de
    lecture** : le ו/י change, donc le `he_plain` change aussi. Deux filets décidables,
    sur l'ensemble du carnet (entrées, formes, exemples) :
    - **a.** un même `he_plain` porté par ≥ 2 vocalisations distinctes — ⚠️ liste
      blanche obligatoire pour les 3 homographes, qui sont *voulus* et matcheraient ;
    - **b.** deux tokens dont les `he_plain` ne diffèrent que par l'insertion d'un ו
      ou d'un י (ktiv malé vs ktiv haser) — c'est le filet qui attrape les quatre cas
      historiques. Drapeau, pas erreur : deux mots réellement différents peuvent ne
      différer que d'un vav.

    **Limite assumée, à écrire dans le rapport** (règle « aucun plafond silencieux ») :
    une vraie flexion — pluriel, participe, conjugaison — échappe aux deux filets ;
    c'est l'étage 2 qui la voit. Reste le meilleur rapport valeur/coût du plan.
11. Écart `tr` ↔ `he2tr` par distance d'édition, sur les **entrées et les formes**
    (`verifie_exemples.js` ne le fait que sur les exemples). Distance > 2 = drapeau.
    ⚠️ Sévérité **basse par principe** : le carnet fait foi sur les `.tr` écrits à la
    main, `trKey` replie les variantes, l'affichage seul est concerné.
12. L'exemple contient-il réellement le mot vedette ? ✎R2, opérationnalisé —
    « une variante partageant sa racine consonantique » n'est pas extractible par
    script (lettres faibles, préfixes de binyan) : le contrôle réel est une recherche
    de sous-chaîne sur le `he_plain` de l'entrée **et de chacune de ses `forms`**,
    après retrait des préfixes agglutinés (ו, ה, ב, ל, כ, מ, ש) et normalisation des
    lettres finales. Aucune correspondance → drapeau, tranché par l'auditeur de
    l'étage 2 (qui lit la tranche de toute façon), pas par Haiku.
13. Exemple sans traduction française, ou ratio de longueur hébreu/français aberrant.
14. Vocabulaire d'un exemple absent du carnet **à +1 niveau** (le validateur n'alerte
    qu'à +2) — donnée, pas erreur.

**Sortie** : `audit/mecanique.json` — `{erreurs:[], drapeaux:[]}`, chaque entrée portant
l'index de carte, la catégorie, le mot, le contrôle déclencheur.

✎R2 — **Routage des drapeaux (remplace l'étage 1 systématique)** : Sonnet lit déjà
chaque carte en 1.2 — un étage de tri séparé est donc largement redondant, et c'est un
endroit de plus où perdre un drapeau. Par défaut, chaque drapeau est **injecté dans la
tranche `sNN.json` de sa carte** (champ `flags`), et le gabarit A exige un verdict
explicite par drapeau : le tri coûte zéro token de plus. L'étage 1 (Haiku, gabarit D)
ne se déclenche **que si les drapeaux dépassent ~150** — à ce volume, les faire tous
trancher dans les tranches diluerait l'attention de l'audit ; on fait alors dégrossir
Haiku d'abord, et seuls les « non » et « incertain » entrent dans les tranches.

### 1.1 — Préparation des tranches (0 token)

Extraire `CARDS` de `flashcards_hebreu.html` (il porte déjà les 713 cartes avec formes,
notes et exemples — inutile de faire lire 450 Ko de HTML à 28 agents) et découper en
**28 tranches équilibrées de 17 à 28 cartes**, une catégorie par tranche, index de carte
`__i` conservé pour la traçabilité. Écrire `audit/sNN.json` + `audit/_index.json`.
✎R2 : `audit/` est **ignoré par git** (ligne posée le 20/07) — ce sont des pièces de
travail régénérables, pas un livrable, et le dépôt est public. Le script qui les produit,
lui, se versionne à la racine.
✎R2 : « une catégorie par tranche » vaut pour les grandes catégories ; les petites
(Existence : 2 cartes, Démonstratifs : 3, Verbes modaux : 5…) se **regroupent en
tranches mixtes** plutôt que de payer l'amorçage d'un agent pour deux cartes — chaque
carte gardant son `cat`, l'auditeur n'y perd rien.

*(Le script de découpe a été écrit et validé le 20/07 — 28 tranches, 713 cartes
couvertes, vérifié — mais vit dans un scratchpad de session. Le réécrire prend deux
minutes ; le critère est : la somme des tranches vaut 713, sans recouvrement.)*

### 1.2 — Audit en fan-out (étage 2 — Sonnet × 28)

Un agent par tranche. **Sortie structurée obligatoire** (`schema`), pas de prose :

```json
{ "checked": 25,
  "findings": [{
    "card_index": 412, "he": "מִלָּה", "cat": "Noms",
    "field": "genre|he|fr|forms|exemple|niveau|note",
    "severity": "bloquant|majeur|mineur",
    "claim": "…ce qui est faux, en français",
    "correction": "…la valeur juste proposée",
    "rule": "…la règle grammaticale précise qui est violée"
  }] }
```

**Le champ `rule` est le garde-fou anti-hallucination** : un auditeur incapable de nommer
la règle violée n'a pas trouvé d'erreur, il a eu une impression. À exiger explicitement
dans le prompt — *« si tu ne peux pas énoncer la règle, ne signale rien »*.

✎R2 — `tr` a été **retiré** de l'énumération `field` : le prompt interdit de signaler
les écarts de translittération (le carnet fait foi), l'annexe l'excluait déjà, et le
corps du plan se contredisait. Les écarts `tr` sont l'affaire du contrôle 11, étage 0.
Si la tranche porte un champ `flags` (drapeaux du script mécanique — cf. 1.0), la
sortie comprend aussi un verdict par drapeau (`flags_cleared`).

Échelle de sévérité, à fixer dans le prompt :

| Sévérité | Définition | Exemple |
| --- | --- | --- |
| **bloquant** | Ruben apprendrait quelque chose de faux | genre inversé, pluriel inexistant, forme verbale d'un autre binyan, traduction fausse |
| **majeur** | Juste mais trompeur ou non idiomatique | tournure livresque là où l'oral dit autre chose, nikoud d'un registre différent |
| **mineur** | Cosmétique ou éditorial | ponctuation, niveau CECRL discutable d'un cran, note ambiguë (✎R2 : « `.tr` divergent » retiré — hors périmètre de l'auditeur) |

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

**Consigne par défaut : réfuter** — parce que le mode de défaillance dominant d'un
auditeur LLM est le faux positif plausible, pas l'aveuglement.

✎R2 — **l'asymétrie telle que ce plan la formulait était fausse.** « Une anomalie
réfutée à tort ne coûte qu'un mot resté correct » suppose que l'original est correct —
or la prémisse de l'audit est l'inverse : le carnet a été écrit sans relecture. Une
réfutation à tort laisse **l'erreur en place**, c'est-à-dire exactement ce que l'audit
existe pour empêcher. L'asymétrie honnête : une confirmation à tort **écrit une faute
neuve** dans la source (plus le coût SRS, plus le risque d'édition) ; une réfutation à
tort **conserve une faute existante**, redécouvrable grâce au registre des réfutées. Le
défaut de réfutation reste le bon choix, mais il exige le filet du tableau ci-dessous
(réfutés bloquants → Opus) — sans lui, deux relecteurs biaisés vers le refus peuvent
tuer les vraies erreurs les plus graves.

**Économie** : vérifier par **lots de 8 anomalies** par agent plutôt qu'une par agent —
même indépendance de jugement, ~4× moins de tokens d'amorçage. Deux passes de lots, une
par lentille.

**Verdict à trois niveaux** — c'est ce qui rend le rapport utilisable :

| Verdict | Condition | Suite |
| --- | --- | --- |
| **CONFIRMÉ** | aucune des 2 lentilles ne réfute | entre dans le lot de correction |
| **CONTESTÉ** | 1 réfutation sur 2 | monte à l'étage 3b (Opus), puis à Ruben si Opus hésite |
| **RÉFUTÉ** | les 2 réfutent | écarté et **consigné** — ✎R2 : **sauf sévérité `bloquant`, qui passe quand même devant Opus.** Une vraie erreur bloquante est ce qu'on ne peut pas se permettre de perdre, et les réfutés bloquants sont peu nombreux par construction |

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
- [ ] Rappel d'étalonnage **≥ 16/20** (✎R2), chiffre publié dans le rapport.
- [ ] 100 % des anomalies portent une `rule` nommée ; celles sans règle sont écartées
      **avant** la contre-expertise (elles ne méritent pas son coût).
- [ ] Chaque anomalie retenue a **deux verdicts** de lentilles distinctes.
- [ ] ✎R2 : chaque drapeau de l'étage 0 a un **verdict explicite** (devenu finding, ou
      levé dans `flags_cleared` avec sa raison) — le compte des drapeaux émis doit
      égaler le compte des verdicts rendus.
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

1. **Rafraîchir le sidecar** : `.impeccable/design.json` est **périmé** face à DESIGN.md.
   ✎R2 — vérifié au git : sidecar commité le 18/07 15:53, DESIGN.md modifié le 20/07
   12:40. En revanche **le « hook qui le signale » n'existe pas** (aucun hook dans le
   dépôt — l'affirmation venait de mémoire) : la péremption est réelle mais
   *silencieuse*, raison de plus pour ne pas sauter l'étape. `/impeccable document`
   d'abord — sinon l'audit juge le carnet contre une charte qui n'est plus la sienne.
2. **Passe impeccable** sur `vocabulaire_hebreu.html`, comme celle qu'a reçue le portail
   le 18/07 (le carnet n'a jamais eu d'équivalent aussi poussé).
3. **Vérification aux deux bouts** — ⚠️ **piège n°13** : nos contrôles sont
   iPhone-émulés, un défaut desktop y est structurellement invisible ; c'est ainsi que
   les 158 caractères par ligne ont traversé toutes les critiques du projet. Mesurer à
   **1440/1280/992/900/768 + iPhone 16 Pro**, et prouver que le mobile reste identique.
4. **Contrôle des règles nommées de DESIGN.md** — ✎R2, liste alignée sur le fichier
   réel : la lampe, les couches, les trois voix, la vedette, les deux colonnes, la
   carte unique, les trois registres de « Commencer », le sticky qui suit la lampe, le
   pointillé réservé au vide. (« Le pli » est un *composant* de DESIGN.md, pas une
   règle nommée — il se contrôle à travers la règle des couches.)

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
| Étalonnage | Sonnet × 4 (✎R2 : 2 tranches × fautée+originale) | ~50k |
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
- Arrêt si le rappel d'étalonnage est sous 12/20 (✎R2) : on répare l'instrument, on ne produit
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
6. **Toute entrée ajoutée aux tables Noms/Adjectifs/Verbes exige un exemple** (verbes :
   au présent), sinon `verifie_exemples.js` bloque. ✎R2 : la garde ne couvre que ces
   trois catégories (`CATS_COUVERTES`), pas les listes — une entrée de liste sans
   exemple passe au vert.
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

## Journal d'exécution — session 3 (20/07, Fable 5) : interrompue pendant l'étalonnage

**Contexte de l'arrêt** : Ruben a demandé un arrêt propre en cours de route. Les
4 auditeurs d'étalonnage (lancés en Workflow) ont été **stoppés avant tout résultat** :
**aucun chiffre de rappel n'existe**. Rien du carnet n'a été modifié ; aucun sous-agent
n'a écrit quoi que ce soit.

### Fait, et vérifié

- **1.0 — `audit_carnet_mecanique.js`** écrit (racine, versionné — il produit AUSSI les
  tranches de 1.1) et exécuté : **0 erreur d'intégrité, 209 drapeaux distincts**
  (C7 : 33, C8 : 62, C10 : 108, C11 : 1, C12 : 5), 17 données C14, dans
  `audit/mecanique.json`.
- **Contrôle 10 raffiné en cours de route** (à publier au rapport — règle « aucun
  plafond silencieux ») : la version écrite au plan produisait **1073 drapeaux-cartes**
  de bruit structurel (participes m/f d'une même carte, tokens d'exemples préfixés,
  flexions ־וֹת/־ת). Trois restrictions **décidables**, commentées dans le script :
  filet a limité aux vedettes+formes ; constat mono-carte exclu (paradigme il/elle) ;
  filet b limité aux insertions intérieures hors alternances flexionnelles. Les 4 cas
  de `41cf08c` passent tous les filtres (vérifié). Limite assumée inchangée : une vraie
  flexion échappe aux filets, c'est l'étage 2 qui la voit.
- **1.1 — Découpe** : 28 tranches `audit/sNN.json`, **somme = 713 vérifiée par le
  script** (échec sinon), 0 recouvrement, bornes 17–28. s01–s04 Verbes, s05–s08
  Adjectifs, s09–s19 Noms, s20–s21 Nombres, s22–s23 Expressions, s24–s28 mixtes
  (empaquetage first-fit-decreasing des 12 petites catégories).
- **Routage des drapeaux** : injectés dans les tranches (champ `flags` ; un constat
  C10 multi-cartes est injecté dans la tranche de CHAQUE carte impliquée). **Étage 1
  Haiku non déclenché**, décision motivée : 209 > ~150, mais 114 drapeaux (C10/C11/C12)
  portent sur du nikoud/de la morphologie **interdits à Haiku par ce plan**, et la
  charge réelle par tranche est digeste (médiane ~11, max 33 sur s10). À publier au
  rapport.
- **Étape 0 — étalonnage, moitié faite** : les **20 fautes sont injectées** — copies
  fautées `audit/s29.json` (← s12, Noms) et `audit/s30.json` (← s03, Verbes). Le
  mélange du plan est **adapté par catégorie** (une tranche Noms n'a pas de formes
  verbales, une tranche Verbes n'a ni genre ni pluriel) : s29 = 2 nikoud, 3 genres,
  3 pluriels, 1 traduction, 1 exemple ; s30 = 3 nikoud, 4 formes, 1 traduction,
  2 exemples. Les trois règles d'injection ✎R2 sont respectées (fil principal, pas de
  décalque des calibrants, subtiles) + une quatrième apprise en route : **aucune
  injection sur une carte dont un drapeau existant contredirait la valeur retouchée**
  (le drapeau trahirait la retouche). Corrigé : `audit/_etalonnage_corrige.json` ;
  script : `audit/_injecte_etalonnage.js` (tous deux gitignorés, hors du contexte des
  auditeurs).

### À faire à la reprise (dans cet ordre)

1. **Relancer l'étalonnage tel quel** : 4 auditeurs Sonnet (effort haut), gabarit A
   littéral, sortie contrainte par schéma, sur s29 + s30 (fautées) et s12 + s03
   (originales). Dépouiller : rappel /20 contre le corrigé ; chaque signalement sur
   les originales est **adjugé** (fil principal, Opus si besoin), pas compté faux
   positif d'office. Appliquer la table de seuils (≥ 16/20 → fan-out).
2. Fan-out 28 auditeurs (1.2), contre-expertise 2 lentilles par lots de 8 (1.3),
   arbitrage Opus des contestés ET des réfutés bloquants (1.3/3b), rapport (1.4).
3. S'arrêter au ⛔ point d'arrêt — les corrections sont un lot séparé, déclenché par
   Ruben.

**Pièges de reprise** :

- `node audit_carnet_mecanique.js` régénère `audit/` mais **efface s29/s30** (purge
  `sNN.json`) ; les refabriquer par `node audit/_injecte_etalonnage.js` (ses assertions
  échouent si s12/s03 ont changé entre-temps — c'est voulu).
- Le fil principal ne lit jamais les tranches ; s12 et s03 ont déjà été consommées
  pour écrire les injections (licencié par le protocole), ne pas en relire d'autres.
  Le corrigé, lui, se lit librement au dépouillement.
- `/graphify . --update` est **dû** (script racine ajouté = structurel) mais **différé
  volontairement** : à payer une seule fois, avec le lot de correction (décision notée
  dans `.gitignore`).

---

## Journal d'exécution — session 4 (20/07, Fable 5) : phase 1 achevée, point d'arrêt atteint

Reprise exactement où le journal de la session 3 s'arrêtait. Tout le détail est dans
le rapport ([`2026-07-20-audit-carnet-rapport-phase1.md`](2026-07-20-audit-carnet-rapport-phase1.md)) ;
ici, le déroulé et ce qui ne se rejoue pas :

1. **Étalonnage relancé et dépouillé** : 4 auditeurs Sonnet (gabarit A littéral,
   schéma contraint, effort haut) sur s29/s30/s12/s03. **Rappel 17/20, 0 signalement
   sur les originales** (donc 0 faux positif à adjuger) → fan-out tel quel, 2
   lentilles. Les 3 ratés sont tous des injections vocaliques subtiles de s30 —
   l'angle mort est publié au rapport § 1.
2. **Fan-out 26 tranches** (s12/s03 réutilisées de l'étalonnage — écart publié),
   26/26 rendues, 713 cartes couvertes, **22 anomalies brutes**, toutes avec `rule`.
3. **Contre-expertise 2 lentilles par lots de 8** (id de jointure ajouté aux schémas
   B/C/E — écart publié) : 12 confirmés, 10 contestés, 0 réfuté direct.
4. **Arbitrage Opus** : les 10 contestés → 9 réfutés, 1 escalade (גַּב). Puis un
   **second lot Opus non prévu au plan** (écart publié) : 9 « confirmés » reposant
   sur le même mécanisme que des jumeaux réfutés (classe ktiv haser du `he_plain`)
   → 9 réfutés, règle concordante.
5. **Bilan** : 3 confirmées (מְלוֹן nikoud, סְפְרִיָּה nikoud, סַכָּנָה genre),
   1 escalade (pluriel de גַּב), 18 réfutées consignées, 320/320 drapeaux couverts.
   **Coût SRS : N = 2** (les deux `field: he`) — recommandation : accepter la remise
   à zéro. Coût réel de la phase : ~1,80 M tokens de sous-agents (estimé : ~1,05 M).
6. ⛔ **Arrêt au point d'arrêt.** En attente de Ruben : valider les 3 corrections,
   trancher גַּב, choisir l'issue SRS, statuer sur la note systémique ktiv malé.
   Le lot de correction paiera aussi le `/graphify . --update` différé.

**Pièges pour la suite** (inchangés) : `node audit_carnet_mecanique.js` efface
s29/s30 (refabriquer par `node audit/_injecte_etalonnage.js`) ; le fil principal ne
lit jamais les tranches ; toute écriture reste dans le fil principal.

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

SI LE FICHIER CONTIENT UN TABLEAU `flags` (drapeaux d'un contrôle mécanique) :
rends un verdict EXPLICITE pour chacun — soit il devient une anomalie (→ findings),
soit tu le lèves en une phrase (→ flags_cleared, avec la raison : exception attestée,
faux positif du script…). Un drapeau sans verdict est une faute de sortie.

Retourne : le nombre de cartes examinées, la liste des anomalies, et le verdict de
chaque drapeau.
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

*À SIGNALER (bon signalement — champ exemple ; ✎R2, ajouté : les points 4-5 de la
liste n'avaient aucun calibrant)* :

> Carte `Noms` — סֵפֶר « livre » ; exemple : הַסֵּפֶר הַזֹּאת מְעַנְיֶנֶת
> → `field`: exemple · `severity`: bloquant · `correction`: הַסֵּפֶר הַזֶּה מְעַנְיֵן
> `rule`: « סֵפֶר est masculin : le démonstratif et l'adjectif attribut s'accordent au
> masculin (הַזֶּה, מְעַנְיֵן). L'exemple accorde les deux au féminin. »

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
    "claim": "…", "correction": "…", "rule": "…" }],
  "flags_cleared": [{ "card_index": 88, "check": "…", "reason": "…" }] }
```

✎R2 : `flags_cleared` ajouté — il porte le verdict des drapeaux mécaniques levés
(cf. routage des drapeaux, 1.0). Vide si la tranche n'a pas de `flags`.

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

**Exemple calibrant — la réfutation type (✎R2, ajouté ; à inclure dans le prompt)** :

> Anomalie soumise : « לַיְלָה est marqué `m` ; les noms en ־ָה sont féminins → corriger
> le genre en "f" ». → `refuted`: **true**.
> `reason`: « Règle énoncée trop largement : לַיְלָה est un masculin attesté et
> parfaitement courant (לַיְלָה טוֹב, pluriel לֵילוֹת mais accord masculin). L'auditeur
> a appliqué une heuristique de terminaison, pas une règle. »

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

## D — Étage 1 : trieur de drapeaux (Haiku) — ✎R2 : gabarit CONDITIONNEL

✎R2 — Ne sert que si les drapeaux de l'étage 0 dépassent ~150 (cf. routage des
drapeaux, 1.0). En deçà, les drapeaux vont directement dans les tranches de l'étage 2.

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

✎R2 — **Un « oui » sans exception nommée vaut « incertain ».** C'est le même garde-fou
que la `rule` de l'étage 2 : pas de nom, pas de savoir. Le collecteur applique la
requalification mécaniquement (`answer === "oui" && !exception → "incertain"`) — c'est
le « oui » confiant et faux qui fait tomber un drapeau à tort, et Haiku sur la
morphologie hébraïque est exactement le modèle dont il faut se méfier là-dessus.

---

## E — Étage 3b : arbitre des contestés et des réfutés-bloquants (Opus) — ✎R2, ajouté

✎R2 — Le corps du plan donnait un rôle à Opus sans lui écrire de prompt.

```
Tu es l'ARBITRE FINAL d'un différend sur une carte d'un carnet d'hébreu moderne
(cible : l'hébreu parlé en Israël aujourd'hui ; but : l'aisance orale d'un
apprenant francophone).

Tu reçois : l'anomalie signalée par un auditeur (avec la règle qu'il invoque) et
le ou les verdicts de réfutation (avec leurs raisons). Les deux camps peuvent se
tromper : l'auditeur sur-signale, et les relecteurs ont pour consigne de réfuter
par défaut — leur réfutation n'est donc pas une preuve.

Tranche : "confirme", "refute", ou "escalade" si l'incertitude est réelle — la
décision revient alors à l'humain, et tu dis exactement quoi vérifier et où
(dictionnaire, corpus, locuteur natif).

Ta décision doit REDIRE la règle en jeu dans tes propres termes et donner la forme
correcte. Une décision sans règle énoncée est une escalade déguisée : choisis
"escalade" franchement à la place.

Cas à arbitrer ({N}) : {LOT_JSON}
```

**Schéma** : `{ "decisions": [{ "card_index": 412,
"decision": "confirme|refute|escalade", "rule": "…", "correct_form": "…",
"a_verifier": "… (si escalade, sinon null)" }] }`
