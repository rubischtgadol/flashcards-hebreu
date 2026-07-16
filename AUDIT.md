# Audit — Charte graphique & organisation

Analyse préalable à la refonte de la direction artistique et de l'organisation du
carnet (`vocabulaire_hebreu.html`) et de l'app flashcards (`index.html` →
`flashcards_hebreu.html`).

- **Périmètre** : charte **unifiée carnet + app**.
- **Objectifs** : (1) esthétique / DA, (2) lisibilité, (3) organisation (IA).
- **Statut** : audit — aucune modification de design encore appliquée.

---

## 0. La chose à comprendre avant tout : le couplage d'extraction

Le carnet est la **source de vérité du contenu** ET son balisage nourrit les
flashcards via `extractCards()` (dans `index.html`, ré-implémenté dans
`build.js`). Une refonte n'est donc pas un simple restyle CSS : toucher à la
*structure* peut faire disparaître des cartes silencieusement.

D'où la règle qui gouverne tout le reste — **séparer le porteur du décoratif** :

| Catégorie | Éléments | Liberté |
|---|---|---|
| **PORTEUR** (ne pas toucher sans relancer `node build.js`) | Texte **exact** des `<span class="count">` (`Verbes`, `Noms`, `Adjectifs`, `Nombres (0–10)`…) · nombre et ordre des colonnes des `<table>` (Verbes ≥5, Adjectifs ≥4, Noms ≥3 avec col.2 = genre, col.3 = pluriel) · `<ul class="word-list"><li>` · spans `.he` / `.tr` / `.fr` · attributs `data-fr-court`, `data-note` | ❌ Structure figée |
| **DÉCORATIF** (libre) | Toutes les couleurs, polices, tailles, espacements, rayons, ombres · le style de `.part`, `.subtheme`, `.toc`, `.tip`, `.example`, `.search-*` · la classe `.cursive` (affichage seul) · les sections grammaire sans `.count` (racine, passé, futur, binyanim, article, smikhout…) | ✅ Libre |

> Filet de sécurité déjà en place : `node build.js` imprime le nombre de cartes
> par section et échoue si une section attendue tombe à 0 ; `init()` alerte aussi
> dans l'app. **Tout changement dans le carnet doit être suivi de `node build.js`
> puis d'un `--check`.**

---

## 1. Système visuel actuel

### 1.1 Couleurs — la seule vraie dérive carnet ↔ app

Les deux fichiers partagent la même *intention* (fond sombre, accent or) mais
avec des valeurs et des **noms de tokens différents** — c'est le principal point
à unifier.

| Rôle | Carnet (`vocabulaire`) | App (`index`) | Écart |
|---|---|---|---|
| Fond | `--bg #12181f` | `--bg #0f1620` | app plus sombre / bleutée |
| Fond secondaire | — | `--bg2 #151f2b` | absent du carnet |
| Carte | `--bg-card #1a222b` | `--card #1c2733` | proches, noms différents |
| Bord de carte | — | `--card-edge #26333f` | absent du carnet |
| Encre | `--ink #ece7dd` | `--ink #ece3d2` | quasi identique |
| Encre atténuée | `--ink-dim #9aa3ac` | `--ink-dim #8b96a3` | carnet plus clair |
| Or (accent) | `--gold #d4a24c` | `--gold #d9a441` | carnet plus ambré, app plus jaune |
| Or doux | — | `--gold-soft #e8c583` | absent du carnet |
| Ligne | `--line #2a3440` | `--line #28333f` | quasi identique |
| Vert / Rouge (sémantiques) | — | `--green #5bbd7a` / `--red #d96a5b` | propres à l'app (validation) |

**Constat** : le carnet n'a que 6 tokens, l'app 11. Aucune valeur n'est
identique alors qu'elles devraient l'être. Une charte unifiée = **un seul jeu de
tokens** (mêmes hex, mêmes noms) importé à l'identique dans les deux fichiers.

### 1.2 Typographie — déjà cohérente (bonne nouvelle)

Les deux fichiers chargent **exactement les mêmes 4 polices** et la **même base
de 22px** :

- **Frank Ruhl Libre** (serif) — hébreu ponctué + titres.
- **Assistant** (sans-serif) — texte français / UI.
- **JetBrains Mono** — translittérations, compteurs, labels.
- **Playpen Sans Hebrew** — écriture cursive hébraïque (`.cursive`).

La *fondation* typographique est donc déjà partagée. Reste à harmoniser
l'**échelle** (le carnet définit ses tailles à la main section par section — `.he`
1.6rem, `h2` 1.55rem, etc. — sans échelle nommée) et la **hiérarchie**
he / translittération / français.

### 1.3 Inventaire des composants (carnet)

Riche et globalement propre — peu d'inline-styles (15) :

- **Tables RTL** (`.table-wrap` + `table[dir=rtl]`) — verbes, adjectifs, noms.
- **Listes** (`.word-list`) — pronoms, prépositions, nombres, expressions…
- **Pédagogie** : `.example` (phrase modèle), `.tip` (encadré astuce), `.steps`
  (étapes numérotées), `.note`.
- **Navigation** : `.toc` groupée, `.search-wrap` collante + surlignage `mark.hl`.
- **Structure éditoriale** : `.part` (2 parties), `.subtheme` (17 sous-thèmes),
  `.app-link` (lien vers les flashcards).

L'app, elle, a ses propres composants (chips de réglage, carte flip, clavier
hébreu, barre de progression) — **aucun composant partagé** avec le carnet
aujourd'hui, seulement le vocabulaire de style.

---

## 2. Architecture de l'information (existant)

L'IA est **déjà structurée** — la refonte l'affinera, ne la créera pas :

- **Partie 1 · Grammaire — comprendre la langue** : pronoms, démonstratifs,
  racine, passé, futur, binyanim, article défini, état construit, prépositions
  fléchies, existence/possession.
- **Partie 2 · Vocabulaire — le dictionnaire** : verbes, noms, adjectifs,
  prépositions, conjonctions, interrogatifs, nombres, jours, quantité,
  expressions — les gros lexiques (verbes, noms) étant sous-découpés en
  **17 sous-thèmes sémantiques** (Mouvement, Vie quotidienne, Corps, Maison,
  Nourriture, Nature & animaux, Temps & calendrier…).

**Points à interroger en refonte IA :**
- La frontière Partie 1 / Partie 2 est-elle nette ? (les pronoms/démonstratifs
  sont du lexique classé en « grammaire ».)
- Les sous-thèmes ne concernent que verbes & noms — faut-il les étendre ?
- Le `.toc` reflète-t-il fidèlement l'ordre réel des sections ? (à vérifier.)
- Findabilité mobile : `.toc` long + recherche collante — hiérarchie à revoir sur
  petit écran.

---

## 3. Constats par objectif

**DA / esthétique.** Base saine (sombre + or, serif hébraïque élégante) mais
sous-exploitée : palette réduite à 6 teintes, pas d'échelle d'espacement ni de
rayons nommés, ombres/dégradés ponctuels et non systématisés. La dérive de tokens
avec l'app trahit l'absence de charte formelle. → Opportunité : formaliser un
**design system minimal** (tokens couleur + échelle typo + espacements + rayons)
partagé.

**Lisibilité.** Le nikoud en Frank Ruhl Libre 1.6rem est confortable ; la
translittération LTR sous l'hébreu RTL est bien gérée. À creuser : contrastes de
`--ink-dim` sur `--bg` (à mesurer, WCAG AA), tailles tactiles sur mobile,
comportement des tables `min-width:640px` (scroll horizontal sur téléphone).

**Organisation (IA).** Déjà bien pensée (parties + sous-thèmes). Le chantier est
d'**affiner** (frontière grammaire/lexique, extension des sous-thèmes, cohérence
toc↔sections) plus que de refondre.

---

## 4. Orientations — tranchées le 2026-07-16

> **Décisions** : (1) alignement de l'**app sur le carnet** (palette de référence :
> `#12181f` / or `#d4a24c`) ; (2) **raffiner le sombre+or** existant ;
> (3) réorganisation IA **cosmétique et éditoriale** (scission de la Partie 2 en
> « dictionnaire » et « mots-outils & expressions »). Le toc s'est révélé déjà
> synchrone avec l'ordre réel des sections. Questions initiales conservées
> ci-dessous pour mémoire :

1. **Un design system partagé** : extraire les tokens (couleur, typo, espace,
   rayon) dans un bloc `:root` **identique** copié dans les deux fichiers (pas de
   dépendance externe possible — contrainte « zéro dépendance, self-contained »).
   Décider : on aligne l'app sur le carnet, le carnet sur l'app, ou une nouvelle
   palette tierce ?
2. **Direction esthétique** : conserver « sombre + or ambré » et le raffiner, ou
   explorer une variante (ex. mode clair « papier » pour le carnet, thème plus
   contrasté) ? Impacte la lisibilité et l'ambiance « carnet d'étude ».
3. **Portée de la réorganisation IA** : cosmétique (styles de `.part`/`.toc`) ou
   éditoriale (revoir frontières et regroupements) — cette dernière touche des
   `<h2>` porteurs, donc `build.js` obligatoire.

---

## 5. Méthode d'exécution sûre (pour la phase suivante)

1. **Tokens d'abord** : définir le `:root` unifié, l'appliquer au carnet puis à
   l'app, sans toucher au balisage. Effet visuel maximal, risque nul côté
   extraction.
2. **Composants ensuite** : restyler `.part`, `.toc`, `.tip`, tables, listes —
   présentation uniquement.
3. **IA en dernier**, si retenue : tout changement de `<h2>`/`.count`/colonnes →
   `node build.js` + `--check` + vérif « N mots chargés » dans le navigateur.
4. **Garder l'enregistrement du service worker dans le bloc `BUILD:ONLINE-ONLY`**
   (déjà le cas) — ne pas l'en sortir en refactorant.
5. Vérifier chaque étape sous Node + jsdom (pas de Chrome headless sous WSL).
