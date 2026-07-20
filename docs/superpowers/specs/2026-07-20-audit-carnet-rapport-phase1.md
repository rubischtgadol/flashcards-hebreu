# Audit du carnet — Rapport de phase 1 (justesse de l'hébreu)

**Date** : 2026-07-20 (session 4 — reprise et achèvement de la phase 1)
**Périmètre** : `vocabulaire_hebreu.html` via les 713 cartes extraites — 28 tranches, somme vérifiée 713 (661 sur les 26 tranches du fan-out + 28 de s12 + 24 de s03, auditées à l'étalonnage avec le même prompt/modèle/effort et réutilisées — écart au plan publié en § Méthode).
**Statut** : ✅ **phase 1 validée par Ruben le 21/07 ; lot de correction appliqué (session 5)** — les 3 corrections du § 2 sont dans le carnet, גַּב (§ 3) est tranché « pas d'erreur » (גַּבּוֹת attesté par l'Académie pour le sens « dos » — sources au journal de la session 5 du plan), remise à zéro SRS acceptée (§ 4), note ktiv malé documentée sans chantier (§ 5).

---

## Verdict d'ensemble

**Le carnet est sain.** Sur 713 cartes écrites en lots sans relecture humaine, l'audit
complet (auditeurs Sonnet + contre-expertise adversariale à 2 lentilles + arbitrage
Opus) ne confirme que **3 anomalies**, dont 2 seulement touchent le champ `he` d'une
vedette. 1 cas est escaladé à Ruben. Les 18 autres signalements ont été réfutés et
sont consignés ci-dessous.

---

## 1. L'instrument : étalonnage publié

| Mesure | Résultat | Seuil |
| --- | --- | --- |
| **Rappel** | **17/20** | ≥ 16/20 → fan-out tel quel |
| **Faux positifs adjugés** | **0** (aucun signalement sur les originales s12/s03) | ≤ 6 → 2 lentilles suffisent |

Les 3 injections ratées (toutes dans s30, Verbes) sont **purement vocaliques et
subtiles** : לַחְשֹׁב→לִחְשֹׁב (patah/hirik du préfixe), לֶאֱהֹב→לַאֲהֹב (segol/patah
devant gutturale), יוֹדַעַת→יוֹדֶעֶת (patah/segol de la forme *elle*). **Angle mort
assumé de l'audit** : une erreur de voyelle fine sur un préfixe ou autour d'une
gutturale, qui ne change ni le squelette consonantique ni la lecture évidente, peut
échapper à l'instrument (3 ratés sur 8 injections de cette nature ; les 12 injections
de toute autre nature — genre, pluriel, forme, traduction, exemple — ont été
retrouvées 12/12). Un audit qui ne sait pas ce qu'il rate annonce une exhaustivité
qu'il n'a pas : celui-ci rate environ une erreur vocalique subtile sur trois.

---

## 2. Anomalies confirmées — le lot de correction proposé (3)

Confirmées = aucune des 2 lentilles ne réfute, et l'arbitrage de cohérence (cf. § 5)
ne les requalifie pas. Par sévérité :

| # | Carte (`__i`) | Champ | Sévérité | Erreur | Correction |
| --- | --- | --- | --- | --- | --- |
| 1 | **מְלוֹן** « hôtel » (360, Noms) | `he` | **bloquant** | Shva sous le mem : se lit « melon ». La carte se contredit : son `tr` d'exemple donne « hamelon » mais le mot se dit *malon* (kamats) ; l'article dans l'exemple aurait dû donner הַמָּלוֹן. | **מָלוֹן** (+ l'occurrence הַמְּלוֹן → הַמָּלוֹן dans l'exemple) |
| 2 | **סַכָּנָה** « danger » (494, Noms) | `genre` | **bloquant** | Genre déclaré `m`. Féminin standard sans exception (־ָה accentué ; הסכנה גדולה, jamais גדול). Issu d'un drapeau C7 converti. | `f` |
| 3 | **סְפְרִיָּה** « bibliothèque » (366, Noms) | `he` | majeur | Shva sous le samekh : se lit « sfriya ». La carte se contredit : ses propres `tr` donnent « basifriyah » / « sifriyot ». Le pluriel porte la même faute. | **סִפְרִיָּה**, pluriel **סִפְרִיּוֹת** (hirik) |

## 3. Escalade à Ruben (1)

**גַּב « dos » (237, Noms), pluriel donné גַּבּוֹת** — sévérité déclarée bloquant,
verdict CONTESTÉ puis **escalade** par Opus. Le différend est factuel et binaire :

- L'auditeur : le pluriel de גב « dos » est גַּבִּים ; גַּבּוֹת est le pluriel d'un
  autre lexème (גַּבָּה « sourcil »).
- La lentille grammaire (réfute) : le Wiktionnaire hébreu, entrée גב sens « dos »,
  donne explicitement « ר׳ גַּבִּים גם גַּבּוֹת » — les deux pluriels attestés.
- La lentille usage (confirme) : גַּבִּים est la forme réellement employée (כאבי גב,
  גבים חזקים).

**À vérifier (protocole d'Opus)** : l'entrée גב au sens « dos du corps » dans un
dictionnaire de référence (Even-Shoshan, Rav-Milim, ou le site de l'Académie de la
langue hébraïque) — liste-t-elle גבות comme pluriel de CE lexème, ou seulement
גבים ? À défaut, demander à un locuteur natif. Si גבות n'est pas attesté pour
« dos » : corriger en גַּבִּים (champ `forms` → pas de coût SRS).

---

## 4. Coût SRS chiffré, et l'issue recommandée

Anomalies confirmées portant `field: he` (les seules qui changent `cardId = cat|he`,
donc l'identité SRS de la carte) : **N = 2** — מְלוֹן et סְפְרִיָּה. La correction de
סַכָּנָה (`genre`) et l'éventuelle correction de גַּב (`forms`) ne coûtent rien au SRS.

**Issue recommandée (table du plan)** : **accepter la remise à zéro** — N = 2 < 15,
et ces deux mots-là méritent d'être revus de toute façon puisque leur vocalisation
apprise était fausse. La table de migration (`SRS_RENAMES`) reste disponible si Ruben
préfère ; à N = 2 elle coûte plus qu'elle ne rapporte. Dans tous les cas : **un seul
lot de correction, un seul bump SW, un seul commit** (règle du plan).

---

## 5. Réfutées — consignées (18)

Aucun réfuté n'a été perdu en silence ; les réfutés de sévérité bloquante sont passés
devant Opus comme l'exige le plan, et un **arbitrage de cohérence supplémentaire**
(non prévu au plan, publié ici) a soumis à Opus 9 anomalies *confirmées* par les deux
lentilles parce qu'elles reposaient sur le même mécanisme que des cas jumeaux
qu'Opus venait de réfuter — les confirmer aurait été incohérent sans arbitrage.

**La classe « ktiv haser du he_plain » (16 cas : 14 dans s01, 1 dans s16, 1 dans
s19)** — réfutée en bloc. Les auditeurs de s01/s16/s19 ont signalé que les
`he_plain` du type למכר, לעמד, מטילים, טעיות ne portent pas le ו/י du ktiv malé.
Règle d'arbitrage (Opus, deux lots concordants) : en écriture **pointée**, le
holam/kubuts haser se note par le point, jamais par une lettre — le champ `he`
vocalisé, qui est ce que l'apprenant étudie, est **correct** ; `he_plain` est la
sortie mécanique de `stripNikud(he)` (invariant vérifié par script, 0 écart), pas un
contenu rédigé, et « corriger » ces cas exigerait soit d'hybrider le `he` pointé,
soit de casser l'invariant. **Note systémique à instruire séparément (hors lot de
correction)** : si un mode d'affichage sans nikoud fondé sur `he_plain` devait un
jour être montré à l'apprenant, il faudrait un vrai ktiv malé calculé, pas
`stripNikud` — Opus relève que le `he_plain` des exemples est aujourd'hui une donnée
morte (l'app affiche toujours `ex.he` vocalisé).

**Les 2 autres réfutées** :

- **לֵב, pluriel לִבּוֹת** (s10, majeur) — réfuté : les deux pluriels לִבּוֹת et
  לְבָבוֹת sont réels ; une variante lexicalisée attestée n'est pas une erreur.
- **מִן non contracté** (s24, mineur) — réfuté : forme soutenue réelle, et
  l'alternative orale מֵ־ est déjà signalée dans le préambule de la section.

Aucune anomalie n'a été écartée pour absence de règle (22/22 portaient une `rule`
nommée) ; aucun signalement n'est resté sans ses deux verdicts de lentilles.

## 6. Drapeaux de l'étage 0 : tous les verdicts rendus

- **320 instances de drapeaux** injectées dans les tranches (les 209 constats
  distincts, un constat C10 multi-cartes étant injecté dans la tranche de chaque
  carte impliquée) : **320/320 couvertes par un verdict explicite**.
- Mode de comptage publié : la couverture est vérifiée **par carte** — certains
  auditeurs regroupent en un verdict les drapeaux multiples d'une même carte
  (310 entrées `flags_cleared` sur les 28 tranches, + les conversions en anomalies :
  les 2 pluriels de s10 et le genre de סכנה proviennent de drapeaux C8/C7).
- L'immense majorité des drapeaux sont des faux positifs *attendus* du script
  (homographes consonantiques de mots distincts, exceptions de pluriel attestées
  comme ביצים/פירות/יינות, féminins cachés comme כוס/כף) — c'est le fonctionnement
  prévu : le script sur-signale à coût nul, l'étage 2 tranche.

## 7. Décisions prises en cours de route (déjà documentées au journal, publiées ici)

1. **Contrôle 10 raffiné** (règle « aucun plafond silencieux ») : la version écrite au
   plan produisait 1073 drapeaux-cartes de bruit structurel. Trois restrictions
   décidables, commentées dans `audit_carnet_mecanique.js` : filet a limité aux
   vedettes+formes ; constat mono-carte exclu (paradigme il/elle) ; filet b limité aux
   insertions intérieures hors alternances flexionnelles. Les 4 cas historiques de
   `41cf08c` passent tous les filtres (vérifié). Limite assumée inchangée : une vraie
   flexion échappe aux filets — c'est l'étage 2 qui la voit.
2. **Étage 1 (Haiku) non déclenché**, décision motivée : 209 drapeaux > ~150, mais
   114 (C10/C11/C12) portent sur du nikoud/de la morphologie que le plan interdit à
   Haiku, et la charge réelle par tranche était digeste (médiane ~11, max 33 sur s10).

## 8. Méthode : écarts au plan, tous publiés (aucun plafond silencieux)

1. **s12 et s03 non re-lancées au fan-out** : elles venaient d'être auditées à
   l'étalonnage avec exactement le même prompt (gabarit A), le même modèle et le même
   effort — leurs résultats (0 anomalie, 17+8 drapeaux tous levés) sont versés à la
   phase 1, conformément à la clause « découverte anticipée » du protocole. 26 agents
   lancés + 2 réutilisés = 28 tranches, 713 cartes couvertes.
2. **Champ `id` ajouté aux schémas des gabarits B/C/E** (jointure) : le schéma du plan
   joignait les verdicts par `card_index`, ambigu quand une carte porte plusieurs
   anomalies (cas réel : לְטַיֵּל en porte trois). Chaque anomalie reçoit un id
   `tranche-n`, recopié tel quel par les vérificateurs. Aucun verdict manquant.
3. **Arbitrage de cohérence supplémentaire** (§ 5) : un lot Opus non prévu au plan,
   pour ne pas laisser coexister des confirmations et des réfutations du même
   mécanisme. C'est le seul écart de fond ; il ajoute un étage de scepticisme, il
   n'en retire pas.
4. **Comptage des verdicts de drapeaux par carte** (§ 6).
5. **Le fil principal n'a lu aucune tranche** (seul le corrigé de l'étalonnage, prévu
   pour ça) ; aucun sous-agent n'a écrit dans le dépôt ni commité.
6. **Coût réel** : ~1,80 M tokens de sous-agents pour la phase 1 seule (étalonnage
   207 k ; fan-out + contre-expertise + arbitrage 1 528 k ; arbitrage de cohérence
   70 k), contre ~1,05 M estimés au plan pour l'équivalent. L'écart vient surtout des
   drapeaux (320 verdicts motivés non chiffrés au budget d'origine).

## 9. Critères d'acceptation de la phase 1 — état

- [x] 713 cartes couvertes, somme des tranches vérifiée (661 + 28 + 24 = 713).
- [x] Rappel d'étalonnage ≥ 16/20 : **17/20**, publié (§ 1).
- [x] 100 % des anomalies portent une `rule` nommée (22/22, 0 écartée).
- [x] Chaque anomalie retenue a deux verdicts de lentilles distinctes (22/22).
- [x] Chaque drapeau de l'étage 0 a un verdict explicite (320/320, mode de comptage § 6).
- [x] Les 3 homographes connus toujours exactement 3 (contrôle 3 de l'étage 0 : 0 erreur).
- [x] Coût SRS chiffré : **N = 2**, issue recommandée « accepter la remise à zéro » (§ 4).
- [ ] Rituel post-corrections (`build.js` vert, `verifie_exemples.js` 0 erreur,
      `--check` en phase) : **sans objet à ce stade** — aucune correction appliquée ;
      à exécuter avec le lot de correction.

---

## Ce que Ruben doit trancher pour déclencher le lot de correction

1. **Valider les 3 corrections** du § 2 (ou en écarter).
2. **Trancher גַּב** (§ 3) — ou déléguer la vérification dictionnaire.
3. **Choisir l'issue SRS** (§ 4 — recommandation : remise à zéro, N = 2).
4. Décider si la **note systémique ktiv malé** (§ 5) devient un chantier ou reste
   documentée.

Le lot de correction suivra alors la règle du plan : une seule source de vérité
(`vocabulaire_hebreu.html`), un seul lot, un bump SW, le rituel complet, et le
`/graphify . --update` différé payé à ce moment-là.
