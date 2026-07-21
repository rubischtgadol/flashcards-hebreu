# Le pilier oral — mode « Écoute » et lecteur « En continu »

**Date** : 2026-07-21
**Statut** : design validé, non implémenté
**Périmètre** : `app.html` uniquement (et `flashcards_hebreu.html` par génération)

---

## 1. Pourquoi

PRODUCT.md pose la finalité sans ambiguïté : « le vocabulaire est un moyen, l'aisance orale est la fin ». Le projet couvre aujourd'hui deux temps de l'apprentissage — **savoir** (le carnet) et **se souvenir** (les flashcards) — mais aucun outil ne fait travailler **comprendre à l'oreille** ni **produire une phrase**. Les deux manques nommés par le propriétaire sont exactement ceux-là.

Constat matériel : le carnet contient déjà **648 phrases complètes** (hébreu + translittération + français, réparties sur 638 blocs `<ul class="exemples">`), tenues par `verifie_exemples.js`, et une section « Phrases » de 26 expressions. Ce gisement n'est aujourd'hui qu'illustratif — il ne sert jamais à réviser. Le pilier oral lui donne son premier usage actif.

## 2. Décisions d'architecture

**Tout vit dans `app.html`.** Pas de quatrième fichier déployé. Un `oral.html` séparé aurait imposé un **troisième extracteur du carnet** — or le couplage entre les deux extracteurs existants (`extractCards()` en DOM, `build.js` en regex) est documenté comme le point le plus fragile du dépôt. Corollaires : l'implémentation ne crée aucun fichier, donc **pas de flag « GRAPHE À RECALER »** de son fait ; `build.js` propage les deux modes dans le standalone sans travail supplémentaire ; `sw.js` prend un bump de `VERSION`.

**Mais deux formes distinctes, pas deux modes jumeaux.** « Écoute » est une variante de carte et entre dans la coquille de séance. Le lecteur continu n'a ni score, ni fin, ni correction : le faire passer par la coquille de séance l'obligerait à simuler un bilan qu'il n'a pas. Il devient donc un **écran à part**, dans le même fichier.

## 3. Le mode « Écoute » (4ᵉ mode de carte)

S'ajoute au segmenté existant : **Cartes · Saisie · QCM · Écoute**. Hérite sans code supplémentaire des filtres de niveau, des chips de thème, des boîtes Leitner et de l'écran de bilan.

- **La carte ne montre rien, elle parle.** Face avant sans hébreu à l'écran : un grand bouton de relecture (cible ≥ 44 px), rien d'autre.
- **Ce qui est joué est la phrase d'exemple, pas le mot isolé.** Reconnaître un mot articulé seul n'est pas le blocage réel ; c'est le mot dans un débit normal. Les cartes portant un exemple jouent leur phrase ; les autres se rabattent sur le mot.
- **Réponse par auto-évaluation** (« je savais » / « à revoir »), comme le mode Cartes, alimentant le même SRS.

### Garde-fous

1. **Si aucune voix hébraïque n'est installée, le mode ne s'affiche pas.** `updateSpeaker()` et le diagnostic voix des réglages avancés portent déjà l'information. Un mode d'écoute muet passerait au vert sans rien prouver — le défaut que la garde de couverture de `build.js` a appris à interdire.
2. **Aucun effet ni récompense sonore.** Le son est le contenu ; règle de la vedette (DESIGN.md).

## 4. L'écran « En continu »

Un **lecteur**, pas une séance : on l'ouvre, on le lance, il déroule jusqu'à l'arrêt.

### Les deux sens

| Sens | Déroulé | Ce qu'il travaille |
| --- | --- | --- |
| Hébreu → français | phrase héb. → silence → français | **compréhension** : as-tu saisi avant la réponse ? |
| Français → hébreu | français → silence **plus long** → phrase héb. | **production** : le silence est l'exercice, l'hébreu est la correction |

Le sens français → hébreu est l'entraînement à la production, et il ne demande **ni micro ni réseau**.

### Réglages (volontairement peu nombreux)

Le sens · la source (tout / un thème / un niveau / seulement ce qui est dû) · la longueur du silence · la vitesse de diction. Rien d'autre.

### Écran et énergie

La phrase en cours s'affiche en grand, hébreu vedette, pour les moments où l'on regarde. Un **`wakeLock`** empêche le verrouillage, sans quoi iOS coupe la voix. Coût assumé et à annoncer : la batterie descend plus vite qu'avec un lecteur audio ordinaire.

### Ce que le lecteur n'écrit pas

**Aucune écriture dans le SRS.** On ne peut pas savoir si la réponse formulée mentalement était juste ; enregistrer une réussite non prouvée corromprait les boîtes Leitner, seule mesure honnête de progression du projet.

## 5. Hors périmètre (explicite)

- **Aucun micro, aucune reconnaissance vocale** — la reconnaissance de l'hébreu exige le réseau sur iPhone et casserait « ça marche dans l'avion » (PRODUCT.md, principe 4).
- **Aucun contenu neuf** aux étapes 1 et 2.
- **Aucune mécanique de rétention** (streak, XP, célébration) — anti-référence Duolingo.

## 6. Plan d'exécution

### Étape 0 — la mesure on-device, **bloquante**

Sur l'iPhone réel, écran allumé, téléphone en poche : vérifier que `speechSynthesis` enchaîne une dizaine de phrases sans coupure et que `wakeLock` tient sur la durée.

> ⚠️ **L'émulation ne peut rien dire ici** : le comportement en cause est une politique iOS, pas un fait de rendu. Le projet a déjà payé une fois pour avoir cru une mesure émulée (piège n°14).

**Si la mesure échoue, l'étape 2 tombe** et on ne livre que le mode « Écoute », qui ne dépend d'aucun arrière-plan.

### Étape 1 — le mode « Écoute »

Autonome et utile seul. Valide au passage que la voix hébraïque tient le volume.

### Étape 2 — le lecteur « En continu »

Conditionnée à l'étape 0.

### Étape 3 — **hors de ce chantier** : la section « Conversations » du carnet

Vrais mini-dialogues situationnels (se présenter, au café, demander son chemin…), 2 à 6 répliques. C'est de la rédaction, pas du code : sa propre session. Si l'extraction est faite proprement, elle tombe dans les deux modes sans travail supplémentaire.

## 7. Risques

| Risque | Nature | Traitement |
| --- | --- | --- |
| iOS coupe la voix en poche | bloquant pour l'étape 2 | étape 0, mesure on-device préalable |
| Voix hébraïque absente sur l'appareil | dégrade le mode Écoute | le mode ne s'affiche pas ; jamais de contrôle muet |
| **Troisième entrée sur l'accueil** | **charte** | l'accueil porte deux « lampes », équilibre arbitré délibérément le 20/07. Y poser une troisième entrée peut défaire ce gain : **à traiter comme une question de design à part entière**, pas comme un détail d'intégration. |
| `app.html` grossit (~2466 lignes) | lisibilité | accepté : le coût d'un fichier de plus (troisième extracteur) est jugé supérieur |

## 8. Rituel applicable

1. `node build.js` — vérifier les compteurs.
2. `node verifie_exemples.js` — inutile aux étapes 1-2 (aucun contenu modifié) ; **obligatoire à l'étape 3**.
3. UI touchée → contrôle WebKit/Playwright **depuis un sous-agent**, aux largeurs desktop **et** iPhone (pièges n°12 et n°13).
4. **Bump de `VERSION` dans `sw.js`** — obligatoire.
5. Graphe : **ni recalage ni flag** (aucun fichier créé, supprimé ou renommé).
6. Docs : ARCHITECTURE.md (les modes, le lecteur), DESIGN.md si l'accueil bouge, PRODUCT.md, TODO.md « Reprendre ici ».
7. Commit par changement, messages en français.
