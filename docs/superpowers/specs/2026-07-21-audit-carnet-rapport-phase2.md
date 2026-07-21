# Audit du carnet — Rapport de phase 2 : pédagogie et progression

**Date** : 2026-07-21 (session 6, Fable 5)
**Périmètre** : les cinq analyses de la phase 2 du plan
([`2026-07-20-audit-carnet-plan.md`](2026-07-20-audit-carnet-plan.md) § PHASE 2).
**Nature** : analyse pure — aucune modification du carnet, aucune correction, aucun
ajout. Les lots éventuels sont des chantiers séparés, à déclencher par Ruben.
**Instruments** : étage 0 mécanique (scripts à 0 token) + **5 agents Sonnet en
parallèle**, un par question fermée. Recherche externe déléguée pour la question 1
uniquement, conformément au plan.
**Coût mesuré** : ~479 k tokens de sous-agents (101 k + 111 k + 118 k + 70 k + 79 k),
contre ~300 k estimés au plan — écart publié, dans la ligne du dépassement de la
phase 1 (~1,80 M contre ~1,05 M).

---

## 0. Synthèse — les cinq verdicts

| # | Question | Verdict en une ligne | Chiffres clés |
| --- | --- | --- | --- |
| 1 | Trous de vocabulaire | **7 domaines troués sur 20**, deux nets : santé et sécurité/urgences | 13/20 domaines RAS ; proposition : **+45 mots** (P1 17, P2 20, P3 8) |
| 2 | Équilibre des catégories | **Statu quo défendable** — le ratio d'entrées ment, la charge réelle est presque équilibrée | 1:3,10 en entrées → **1:1,24 en formes** ; verbes = catégorie la mieux réemployée (61,9 %) |
| 3 | Ordre et prérequis | **0 violation d'ordre** ; une seule structure employée sans jamais être enseignée | 0 violation / 713 cartes ; **4 exemples** emploient la subordonnée en שֶׁ־, jamais introduite |
| 4 | Justesse des niveaux CECRL | **Aucun biais systématique** (A1→B1) ; reliquat local sur les 7 B2 | 2 désaccords / 134 échantillonnées (**1,5 %**, sous le bruit) ; 3/7 B2 surclassées d'un cran |
| 5 | Registre | **Carnet très bien registré** ; résidus concentrés sur les mots-outils | **8 signalées / 713 (1,1 %)** : 3 livresque-remplaçable, 4 formel-mais-utile, 1 registre double |

**Lecture d'ensemble** : le carnet est pédagogiquement sain. Aucune des cinq analyses
ne demande de refonte ; deux seulement débouchent sur un lot possible (l'ajout
santé/sécurité de l'analyse 1, le micro-lot registre/niveaux des analyses 4–5), et
toutes deux restent des recommandations chiffrées, pas des décisions.

**Convergences inter-analyses** (le même mot vu par deux instruments indépendants) :
- **תַּחַת « sous »** est signalé deux fois : par l'analyse 4 (B2 → B1, préposition
  spatiale basique) et par l'analyse 5 (livresque-remplaçable — l'oral dit מִתַּחַת לְ,
  déjà au carnet en __i 533). Deux angles, même carte : le signalement le plus solide
  de la phase.
- **Les adjectifs** ressortent deux fois : 63/102 jamais réemployés (étage 0, lu par
  l'analyse 2) et les 2 seuls désaccords de niveau de l'échantillon stratifié dont un
  adjectif (analyse 4). Signal faible mais cohérent : la catégorie la moins irriguée.

---

## 1. Étage 0 mécanique — les chiffres de base de la phase

Régénéré en début de session (`node audit_carnet_mecanique.js`, puis calculs
complémentaires dans `audit/phase2_stats.json` et `audit/inventaire.tsv`, gitignorés
comme le reste de `audit/`).

**Distribution par niveau** : A1 328 · A2 271 · B1 107 · B2 7 (total 713).

**Distribution par catégorie** : Noms 301 · Adjectifs 102 · Verbes 97 · Nombres 41 ·
Expressions 35 · Prépositions 23 · Phrases 22 · Adverbes 19 · Saisons & mois 16 ·
Mots interrogatifs 12 · Mots de quantité 12 · Pronoms personnels 10 · Jours 7 ·
Conjonctions 6 · Verbes modaux 5 · Démonstratifs 3 · Existence 2.

**Exemples** : 564 cartes avec exemple, 149 sans (Nombres, Expressions, Phrases,
Pronoms, Démonstratifs… — chantier délibérément clos par Ruben le 20/07, cf. TODO.md).
Longueur moyenne des exemples quasi constante d'un niveau à l'autre : **4,04 mots en
A1, 4,18 en A2, 4,02 en B1** (4,33 en B2, n = 6). La difficulté des exemples ne
progresse donc pas avec le niveau — constat neutre ici, versé au dossier de la
phase 3 (présentation) si utile.

**Réemploi** : **364 mots sur 713 (51,1 %) ne sont jamais réemployés dans l'exemple
d'une autre carte** (méthode : correspondance sur `he_plain` du mot ou de ses formes,
préfixes clitiques ה/ב/ל/ו/מ/ש/כ tolérés). L'analyse 2 montre que ce chiffre global
est dominé par des catégories où l'absence de réemploi est structurelle (Phrases
100 %, Expressions 80 %, Nombres 78 %…) ; le seul écart interrogeant est
**Adjectifs : 61,8 % jamais réemployés**, contre 38,1 % pour les Verbes à charge de
formes égale. ⚠️ Limite d'instrument : la méthode par sous-chaîne sous-détecte
mécaniquement les adjectifs (qui doivent s'accorder pour apparaître) — une partie de
l'écart est un artefact, l'ordre de grandeur reste parlant.

**Drapeaux mécaniques** : 207 drapeaux (C7/C8/C10/C11/C12) — déjà couverts par les
verdicts de la phase 1, non rejoués. Les **17 cas C14** (« mot d'exemple à +1
niveau ») sont repris par l'analyse 3 comme variante lexicale du problème d'ordre.

---

## 2. Analyse 1 — Trous de vocabulaire

**Verdict.** Sur 20 domaines fonctionnels A1/A2, **13 sont bien couverts** (familles,
corps, vêtements, couleurs, temps/calendrier, météo, émotions, loisirs, politesse,
nombres : tous ≥ 11 entrées, souvent > 20) et **7 présentent des trous mesurables**,
concentrés sur deux points nets : **Santé & urgences médicales** (6 entrées, aucune
pour douleur/fièvre/médicament/pharmacie) et **Sécurité & urgences** (4 entrées, rien
pour police/accident/perdu). Deux thèmes classiques du référentiel Threshold, alors
que PRODUCT.md vise l'aisance orale en contexte réel.

**Grille de couverture** (extrait — domaines troués uniquement ; les 13 RAS sont dans
la grille complète de l'agent, conservée ci-dessous) :

| Domaine | Entrées carnet | Manques haute fréquence |
| --- | --- | --- |
| **Santé & urgences médicales** | **6** | 8 — médicament, pharmacie, « j'ai mal », fièvre, rhume, allergie, dentiste, ordonnance |
| **Sécurité & urgences** | **4** | 4 — police, accident, perdu(e), ambulance |
| **Communication & téléphone** | **3** | 4 — appeler, internet, wifi, batterie/chargeur |
| Travail & études | 15 | 4 — salaire, collègue, réunion, entretien d'embauche |
| Quantités & mesures | 19 | 3 — kilo, litre, gramme (aucune unité de mesure) |
| Identification personnelle | 16 | 3 — adresse, célibataire/marié(e) |
| Logement | 29 | 3 — adresse, loyer, voisin(e) |
| Nourriture & restaurant | 71 | 1 — réserver/commander (aucun verbe pour ces actes) |
| Achats & argent | 20 | 2 — carte de crédit, billet/ticket |
| Directions & transport | 38 | 1 — conduire (verbe) |

Méthode : les 713 lignes de `audit/inventaire.tsv` lues intégralement, recherches
exactes pour chaque mot ciblé (0 résultat = absence confirmée, pas une impression).

**Liste priorisée** (détail complet dans la sortie de l'agent, résumé) :

- **Priorité 1 — indispensable A1, 17 mots** : 9 noms (תּוֹר rendez-vous, כְּתֹבֶת
  adresse, כַּרְטִיס billet, תְּרוּפָה médicament, בֵּית מִרְקַחַת pharmacie,
  מִשְׁטָרָה police, תְּאוּנָה accident, קִילוֹ kilo, כְּאֵב douleur), 2 adjectifs
  (אָבוּד/אֲבוּדָה perdu·e), 3 verbes (לְהַזְמִין réserver/commander,
  לְהִתְקַשֵּׁר appeler, לִנְהֹג conduire), 3 phrases (כּוֹאֵב לִי « j'ai mal »,
  יֵשׁ לִי חוֹם « j'ai de la fièvre », אֲנִי אָבוּד/אֲבוּדָה « je suis perdu·e »).
- **Priorité 2 — utile A2, 20 mots** : 17 noms (carte de crédit, voisin/voisine,
  loyer, assurance, dentiste, rhume, allergie, internet, wifi, batterie, chargeur,
  salaire, collègue, réunion, litre, gramme…), 3 adjectifs (allergique, célibataire,
  marié).
- **Priorité 3 — confort, 8 mots** : 6 noms (ordonnance, vaccin, entretien
  d'embauche, permis de conduire, essence, abonnement), 2 verbes (signer, remplir).

**Proposition chiffrée : +45 mots (32 Noms, 5 Adjectifs, 5 Verbes, 3 Phrases).**
Coût confronté à la garde : **42 des 45** iraient dans les tables couvertes par
`verifie_exemples.js` → **42 exemples à rédiger** (une phrase au présent pour chacun
des 5 verbes), avec `data-niveau` obligatoire sur chaque entrée (`build.js` bloque
sinon). Les 3 Phrases échappent à la garde mais suivent la même logique éditoriale.
Pur contenu : pas de `/graphify --update`, pas de refonte d'extracteur.

**Sources** (fournies par l'agent, avec leur rendement réel) : liste de fréquence
teachmehebrew.com (~5 M mots, corpus écrit — a confirmé la bonne couverture des mots
grammaticaux, pas de trou de ce côté) ; hebrewglot.com (guide d'urgence — base des
priorités 1–2 santé/sécurité) ; hebrewpod101 Core 100 (récupéré partiellement,
25/100 mots — signalé) ; le référentiel Threshold (Van Ek & Trim) n'a **pas** pu être
lu à la source primaire (PDF inaccessible) — la grille de domaines s'appuie sur sa
structure documentée, écart publié.

⚠️ **Garde-fou avant tout lot d'ajout** : la liste des 45 est un **matériau brut,
non audité**. Ses nikoud/translittérations n'ont pas subi la rigueur de la phase 1 —
et au moins deux entrées appellent déjà l'œil : le `tr` proposé « mit'an » pour
מַטְעֵן (attendu : *mat'en*), et עָמִית « collègue », plus formel que l'oral courant
(קוֹלֵגָה) — ironique au regard de l'analyse 5. Un lot d'ajout devra vérifier chaque
entrée comme la phase 1 a vérifié l'existant, sinon il injecte ce que l'audit vient
de nettoyer.

---

## 3. Analyse 2 — Équilibre des catégories

**Verdict.** Le ratio brut (301 noms pour 97 verbes, 1:3,10) est **défendable tel
quel** ; aucun rééquilibrage recommandé. Trois mesures le fondent :

1. **La charge d'apprentissage réelle est presque équilibrée.** Un verbe du carnet
   porte 5 formes (infinitif + 4 présents), un nom 2 (singulier + pluriel), un
   adjectif 4. En formes à mémoriser : Verbes 97×5 = **485**, Noms 301×2 = **602**,
   Adjectifs 102×4 = **408**. Ratio de charge noms:verbes = **1:1,24**, pas 1:3,10.
2. **Les verbes sont déjà la catégorie la mieux réemployée** (60/97 = 61,9 %, contre
   58,8 % pour les noms) : leur rôle de « générateur de structure » est mesuré, pas
   postulé.
3. **Le lexique verbal couvre le cœur fonctionnel A1–B1** (mouvement, quotidien,
   communication, cognition, + 5 modaux) sans lacune structurelle — l'absence de
   « être/avoir » n'en est pas une (pas de copule au présent ; possession par
   יש ל־, couverte par « Existence »).

De plus, la progression par niveau est parallèle entre catégories : 43,3 % des verbes
et 43,5 % des noms sont A1 — les verbes ne sont pas relégués aux niveaux tardifs.

**Phrases et expressions** : 22 + 35 = 8,0 % du carnet, poids brut qui sous-évalue
leur rôle (seules entrées à coût de montage nul). Constat d'hygiène chiffré :
**7 des 22 « Phrases » dupliquent exactement une « Expression »** (אין בעיה,
נעים מאד, אני לא מבין, אני לא יודע, כמה זה עולה, איפה השרותים, בתאבון) — 31,8 % de
la catégorie ; le contenu net des deux réunies est ~50 unités, pas 57. Pas
nécessairement un défaut (renforcement mot isolé → mot en situation), mais à savoir
avant d'écrire du contenu neuf dans « Phrases ». L'agent nomme explicitement la
décision actée qu'il ne remet pas en cause : le chantier des exemples des listes est
**clos** (TODO.md, décision de Ruben du 20/07) — toute recommandation d'étoffer
Phrases/Expressions devrait l'argumenter contre elle, et il ne le fait pas, faute de
besoin mesuré.

**Le réemploi comme symptôme** : le 51,1 % global est dominé par des catégories où
l'absence de réemploi est structurelle. Le seul signal défendable est **Adjectifs**
(63/102 jamais réemployés, 61,8 %, contre 38,1 % pour les verbes à charge égale) —
avec la réserve d'artefact méthodologique déjà notée au § 1. Piste (non chiffrée, non
décidée) : un futur lot d'exemples pourrait viser l'interconnexion des adjectifs
existants (intégrer un adjectif déjà enseigné dans des exemples de noms) plutôt que
des ajouts — noter qu'elle toucherait des exemples existants corrects, donc hors de
la règle « une incohérence se corrige dans l'exemple » et à arbitrer contre la
décision « la question des exemples est close » si elle devait devenir un lot.

---

## 4. Analyse 3 — Ordre et prérequis

**Verdict. 0 violation d'ordre sur les 713 cartes** : aucun exemple n'emploie une
structure grammaticale (passé, futur, article défini, smikhout, prépositions
fléchies, hé directionnel, existence/possession) avant la section qui l'enseigne.
Le résultat est **structurel, pas seulement observé** : les 8 sections de grammaire
sont groupées en tête de carnet (lignes 663–1178), immédiatement après Pronoms
personnels et Démonstratifs — et ces 13 cartes-là, les seules physiquement avant le
bloc de grammaire, **ne portent aucun exemple**. Le défaut qui avait motivé la
section du hé directionnel ne peut plus se produire par construction, tant que la
grammaire reste groupée en tête.

**Un cas « jamais enseignée »** (à distinguer d'une violation d'ordre) : la
**subordonnée en שֶׁ־** est employée dans **4 exemples** (cartes __i 59 לַחְשֹׁב,
63 לְהַאֲמִין, 64 לְקַוּוֹת, 163 בָּטוּחַ — « je pense/crois/espère/suis sûr
que… ») sans qu'aucune section ne l'introduise. Lot possible et minuscule : une
courte section de grammaire (sur le modèle du hé directionnel, qui est né exactement
ainsi), ou une note — à décider par Ruben, rien d'urgent : la structure est
transparente pour un francophone (« que » se calque).

**Contrôles positifs** : hé directionnel 1 occurrence (après sa section) ;
prépositions fléchies/possession 17 occurrences réelles, toutes après les sections
concernées ; impératif 0 occurrence.

**Les 17 cas C14** (variante lexicale : mot A2 dans l'exemple d'une carte A1) sont
repris au bilan tels que détectés mécaniquement : 15 cartes distinctes, concentrées
sur Verbes (6) et Adjectifs (7) + בשביל et קצת. C'est un frottement, pas une faute :
l'app affiche l'exemple entier avec traduction. À verser au dossier d'un éventuel
lot d'exemples, pas un chantier en soi.

**⚠️ Découverte méthodologique, versée aux annales du dépôt** : la consigne de la
mission (héritée du fil principal) affirmait que « les cartes sont extraites dans
l'ordre du document » et que `__i` mesure la position. **C'est faux** : l'extraction
traite les 3 tables d'abord (`__i` 0–499) puis les listes dans l'ordre câblé de
`listCats`, alors que Pronoms personnels et Démonstratifs ouvrent le document.
L'agent l'a vérifié empiriquement et a substitué le numéro de ligne HTML — un audit
qui aurait suivi la consigne à la lettre aurait rapporté des violations fictives.
(Conséquence pratique pour tout futur raisonnement d'ordre : `__i` est un ordre
d'extraction, pas un ordre de lecture.)

**Plafonds déclarés, non silencieux** : passé/futur/article/smikhout n'ont pas été
balayés par regex sur les 564 exemples — l'argument structurel ci-dessus rend le
verdict d'ordre nul quel que soit le résultat d'un balayage, et une détection
morphologique par regex sur de l'hébreu vocalisé produirait trop de faux verdicts.
Binyanim exclu (catégorisation, pas structure instanciable). Les phrases
illustratives internes aux sections de grammaire (hors `audit/`) n'ont pas été
balayées.

---

## 5. Analyse 4 — Justesse des niveaux CECRL

**Verdict. Aucun biais systématique sur le corps A1→B1 du carnet.** Échantillon
stratifié systématique déclaré (tirage à pas constant sur `__i`, reproductible) :
66 A1 (pas de 5), 46 A2 (pas de 6), 22 B1 (pas de 5) = **134 cartes**, plus le
**recensement complet des 7 B2** (hors quota, trop petites pour un tirage).

| Strate | n | Plausibles | À monter | À descendre | Désaccord | Direction |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | 66 | 65 | 1 | 0 | 1,5 % | aucune (bruit) |
| A2 | 46 | 45 | 1 | 0 | 2,2 % | aucune (bruit) |
| B1 | 22 | 22 | 0 | 0 | 0 % | — |
| **Total** | **134** | **132** | **2** | **0** | **1,5 %** | **aucune** |
| B2 (census) | 7 | 4 | 0 | 3 | 42,9 % | surclassement (n trop petit pour inférer) |

Les 2 désaccords de l'échantillon (bruit, pas biais) : מְעַנְיֵן « intéressant »
(A1 → A2, ses voisins sémantiques מְשַׁעֲמֵם et חָשׁוּב sont A2) et אֱמֶת « vérité »
(A2 → B1, son antonyme שֶׁקֶר est B1). Le recensement B2 documente 3 mots précis,
pas une tendance : סַקְרָן « curieux » et חָרוּץ « travailleur » (B2 → B1, isolés un
cran au-dessus de leurs pairs de trait de caractère, tous B1) et תַּחַת « sous »
(B2 → B1 — voir la convergence avec l'analyse 5 au § 0).

La cohérence interne est jugée remarquable : les gradients vérifiés (couleurs,
nombres, verbes physiques/mentaux, parties du corps, adjectifs) forment tous des
échelles sans rupture. La forme globale 328/271/107/7 (46/38/15/1 %) est cohérente
avec le périmètre déclaré (oulpan alef ≈ A1–A2, oulpan bet ≈ B1, ARCHITECTURE.md) ;
les 7 B2 sont un reliquat naturel, pas un choix éditorial.

**Limites déclarées** : jugement sur le mot isolé (`he_plain`/`fr`), méthode aveugle
à un biais qui décalerait une catégorie entière uniformément (aucun indice en ce
sens), juge unique sans contradicteur, pas de liste de fréquence externe (exclue par
consigne pour cette analyse).

---

## 6. Analyse 5 — Registre

**Verdict. 8 entrées signalées sur 713 (1,1 %)** — le carnet est très
majoritairement bien registré, et inclut déjà du familier assumé (יאללה, סבבה,
ואלה), preuve d'un contrat oral tenu. Les résidus se concentrent sur les
**mots-outils** (prépositions, interrogatifs), angle mort typique d'un carnet
construit par catégories grammaticales complètes. Balayage : les 713 entrées lues
intégralement, exemples vérifiés pour les 8 retenues.

**Livresque-remplaçable (3)** — l'oral dit nettement autre chose :

| __i | Entrée | Alternative orale | Nœud du problème |
| --- | --- | --- | --- |
| 523 | תַּחַת « sous » | מִתַּחַת לְ (déjà au carnet, __i 533) | registre biblique/soutenu + sens argotique parasite ; son propre exemple se dirait avec מתחת |
| 557 | מֵאַיִן « d'où » | מֵאֵיפֹה | quasi absent de l'oral ; איפה est déjà en A1 dans la même catégorie |
| 531 | מִן « de/depuis » | מ־ préfixé (מֵהָעֲבוֹדָה) | מן autonome est écrit/soutenu ; personne ne prononce « מן העבודה » |

**Formel-mais-utile (4)** — défendables, signalés sans recommandation de
remplacement : שָׁגוּי « erroné » (omniprésent à l'écran ; l'oral dit לא נכון/טעות),
זֶהֶה « identique » (contexte technique ; l'oral dit אותו דבר), מְעַט « peu »
(l'oral dit קצת, déjà en A1), מִכְשׁוֹל « obstacle » (l'oral dit בעיה/קושי).

**Registre double manquant (1)** : שָׁלוֹם — juste et nécessaire, mais le carnet est
muet sur **הַיי**, salutation informelle dominante entre pairs ; une note suffirait,
pas un remplacement.

**Douteuse (1, à part)** : אֵין דָּבָר (__i 671) — fréquence relative vs אֵין
בְּעָיָה incertaine, l'agent refuse de trancher sans corpus.

**Ce que le registre observé dit du contrat** (PRODUCT.md) : le vocabulaire
thématique (corps, maison, nourriture, famille, verbes) est irréprochablement
courant ; le résidu de 1,1 % confirme que le carnet a été construit avec le contrat
oral en tête. Limites déclarées : jugement d'un seul locuteur-modèle sans corpus
fréquentiel (recherche web exclue par consigne), registre « adulte urbain générique »
sans trancher les nuances générationnelles.

---

## 7. Critères d'acceptation de la phase — vérifiés

- ✅ **Cinq analyses rendues, chacune chiffrée** : 20 domaines / 45 mots (1) ;
  ratios 1:3,10 → 1:1,24, 7/22 doublons (2) ; 0 violation + 4 שֶׁ־ / 713 (3) ;
  2/134 = 1,5 %, 3/7 B2 (4) ; 8/713 = 1,1 % (5). Aucun verdict « c'est bon » sans
  compte.
- ✅ **Toute proposition d'ajout chiffrée et confrontée au coût** : +45 mots →
  42 exemples exigés par `verifie_exemples.js` (verbes : phrase au présent) +
  `data-niveau` obligatoire partout ; les 3 Phrases hors garde, dit explicitement.
- ✅ **Aucune recommandation ne contredit PRODUCT.md ou TODO.md sans le nommer** :
  la seule décision actée approchée est « la question des exemples est close »
  (TODO.md, 20/07) — nommée par l'analyse 2, qui s'abstient précisément de
  recommander contre elle ; la piste « interconnexion des adjectifs » est signalée
  comme devant être arbitrée contre cette décision si elle devenait un lot. La
  proposition des 45 mots ne la contredit pas : le plan classe l'ajout massif de
  vocabulaire « hors périmètre — chantier séparé », ce que ce rapport respecte.
- ✅ **Aucun plafond silencieux** : chaque analyse porte sa section « Limites »
  (échantillonnage déclaré avec pas de tirage, structures non balayées et pourquoi,
  sources inaccessibles nommées, artefact de la méthode de réemploi).

---

## 8. Les lots possibles — à déclencher par Ruben, aucun décidé ici

Par taille croissante de décision :

1. **Micro-lot niveaux** (~5 cartes) : מְעַנְיֵן A1→A2, אֱמֶת A2→B1, סַקְרָן et
   חָרוּץ B2→B1, תַּחַת B2→B1. Coût SRS **nul** (le niveau ne fait pas partie de
   l'identité `cardId` — seul `he` la porte) ; un bump SW suffit.
2. **Micro-lot registre** (3 entrées + 1 note) : arbitrer תַּחַת/מֵאַיִן/מִן
   (remplacer, ou garder avec note de registre — les alternatives orales sont déjà
   partiellement au carnet), et la note הַיי sous שָׁלוֹם. ⚠️ Remplacer un `he`
   change l'identité SRS de la carte (N = 3 max).
3. **Note de grammaire שֶׁ־** : une courte section « que » (sur le modèle du hé
   directionnel), soldant les 4 emplois jamais enseignés. Pur contenu ; si elle
   devient une vraie section, vérifier qu'elle ne crée pas de cartes par accident
   (pas de label `.count` → intentionnellement exclue de l'extraction).
4. **Lot d'ajout santé/sécurité** (le vrai chantier) : commencer par la **priorité 1
   seule (17 mots, 14 exemples sous garde)** avant de juger les priorités 2–3.
   Conditions écrites au § 2 : vérification de chaque entrée à la rigueur de la
   phase 1 (le matériau de l'agent est brut, deux suspects déjà nommés), lot
   d'exemples relu, `data-niveau` partout, bump SW, et — pur contenu — pas de
   `/graphify --update`.

La phase 3 (présentation, impeccable) reste un chantier séparé, non entamé,
conformément au point d'arrêt du plan.

---

## 9. Écarts au plan et enseignements de la session

- **Écart de coût publié** : ~479 k tokens de sous-agents contre ~300 k estimés.
  Même direction que la phase 1 ; les estimations du plan sous-évaluent d'un
  facteur ~1,6.
- **La prémisse « `__i` = ordre du document » était fausse** (voir § 4). Corrigée
  par l'agent en cours de mission ; consignée ici pour que le prochain raisonnement
  d'ordre parte du numéro de ligne, pas de l'index d'extraction.
- **L'étage 0 s'est enrichi** de deux pièces recalculables à volonté
  (`phase2_stats.json`, `inventaire.tsv`) — produites par un script de session, non
  commité, conformément à la règle « `audit/` est un atelier, pas une archive ».
- **s29/s30 (étalonnage)** ont été effacées par la régénération de l'étage 0, comme
  prévu et sans conséquence pour cette phase ; `node audit/_injecte_etalonnage.js`
  les refabrique au besoin.
