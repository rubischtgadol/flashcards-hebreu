# Réorganisation profonde : « le dépôt généré »

**Date** : 2026-07-24 · **Statut** : validé (design approuvé en session, spec en relecture)

## Motivation

Quatre douleurs nommées par le propriétaire, toutes retenues : `app.html` monolithe
(2 488 lignes, CSS+JS inline, tous les modes dans un script), la racine en vrac
(25+ fichiers à plat), le double extracteur (`extractCards` dans `app.html` +
parseur regex dans `build.js`, jamais comparés mécaniquement), et le carnet géant
(`vocabulaire_hebreu.html`, 10 950 lignes mêlant contenu, prose, CSS).

## Décisions structurantes (actées en session)

1. **La source de vérité du vocabulaire migre vers des données structurées**
   (JSON par section). Le carnet HTML et les cartes de l'app sont générés.
2. **Outillage : Node pur, zéro dépendance.** Pas de package manager, pas de
   devDependencies. Le build reste un script Node autonome.
3. **Le carnet devient entièrement généré.** La prose grammaticale vit dans des
   fragments HTML rédigés à la main sous `src/carnet/` ; les tables et listes de
   vocabulaire sont générées depuis `data/`. Personne n'édite plus
   `vocabulaire_hebreu.html` : c'est un artefact de build, comme
   `flashcards_hebreu.html` aujourd'hui. (L'option hybride à marqueurs a été
   examinée et écartée : un fichier mi-écrit mi-généré recrée l'ambiguïté
   qu'on cherche à éliminer.)

## Arborescence cible

La racine reste le site déployé : **les URLs GitHub Pages ne changent pas**, la
PWA installée survit. Tout le reste descend dans des dossiers.

```
/                    ← uniquement le site déployé + README.md + CLAUDE.md
  index.html  app.html  vocabulaire_hebreu.html  flashcards_hebreu.html   [générés, committés]
  cards.json                                                              [généré — cartes à plat]
  sw.js  manifest.webmanifest  icons/                                     [maintenus à la main]
data/                ← SOURCE DE VÉRITÉ du vocabulaire
  noms.json  adjectifs.json  verbes.json  listes/*.json
src/                 ← SOURCE DE VÉRITÉ du code et de la prose
  tokens.css         (le bloc :root partagé — copie unique, injectée partout au build ;
                      remplace la règle « byte-identique » maintenue à la main, piège 5)
  app/               (JS découpé par module — cartes, QCM, SRS, phrases, translittération,
                      stockage, réglages — + CSS ; le module d'extraction disparaît)
  carnet/            (fragments de prose grammaticale + CSS du carnet + gabarits tables/listes)
  portail/           (source d'index.html)
tools/               ← scripts dev : build.js, verifie_exemples.js, ajoute_mots.js, cherche_mots.js
docs/                ← ARCHITECTURE.md, DESIGN.md, PRODUCT.md, TODO.md, TODO_ARCHIVE.md, SPEC_*
```

Les artefacts générés de la racine restent **committés** (GitHub Pages sert la
branche telle quelle ; pas de CI de build, doctrine zéro-dépendance).
`audit_carnet_mecanique.js` est supprimé ou réduit : son objet (auditer le HTML
du carnet) disparaît avec le parsing.

## Flux de données — un seul sens, zéro parsing

```
data/*.json + src/**  →  tools/build.js  →  les 5 artefacts de la racine
```

- Le carnet est **assemblé** : fragments de prose dans l'ordre déclaré + tables
  et listes générées depuis les JSON par des gabarits.
- `app.html` charge `cards.json` en `fetch()` (il fetche déjà le carnet
  aujourd'hui — même contrainte HTTP, moins d'octets, zéro parsing DOM).
- Le standalone embarque `cards.json` inline (équivalent du snapshot actuel).
- **Suppressions définitives** : `extractCards` (app), le parseur regex (build),
  les labels `<span class="count">` porteurs de sens, l'extraction positionnelle
  des colonnes, la règle « les spans du mot d'abord », l'ordre d'insertion des
  propriétés à garder identique entre deux extracteurs. Toute la section
  « extraction coupling » de CLAUDE.md devient caduque.
- `lang="he"` est posé par les gabarits sur chaque nœud hébreu : garanti
  mécaniquement, plus une discipline (piège 6 devient une propriété du build).

## Schéma de données

Reprend le schéma de carte actuel. Par entrée :

```json
{
  "he": "…", "tr": "…", "fr": "…",
  "niveau": "A1", "theme": "famille",
  "exemples": [{ "he": "…", "tr": "…", "fr": "…" }],
  "forms": [{ "he": "…", "tr": "…", "label": "…" }],
  "genre": "m", "note": "…"
}
```

- `niveau` **requis partout**, `theme` **requis** pour noms/adjectifs/verbes —
  validés au build (échec nommé), plus forts que les `data-*` actuels.
- `exemples` : ≥ 1 requis pour noms/adjectifs/verbes (verbes : une phrase au
  présent) — la règle de `verifie_exemples.js` devient une validation de build.
- `he_plain` **calculé au build**, jamais stocké.
- ⚠️ Les `.tr` du carnet sont **autoritaires** : ils migrent tels quels dans le
  JSON et ne sont jamais régénérés par `he2tr` (piège de la translittération).
- Le `span.cursive` généré aujourd'hui côté carnet est produit par le gabarit.

## Outils après bascule

- `tools/build.js` : générateur unique + validateur (niveaux, thèmes, exemples,
  sections non vides) + `--check` (régénère et byte-compare les artefacts committés).
- `tools/verifie_exemples.js` : lit le JSON — conserve ses contrôles éditoriaux
  (avertissements, `--strict`) ; sa partie « parsing » disparaît.
- `tools/cherche_mots.js` : lit le JSON (existence, doublons, `--stats`) —
  le canal de consultation du piège 15 reste, en plus simple.
- `tools/ajoute_mots.js` : se réduit à « valider + insérer un objet JSON » ;
  **SPEC_AJOUTE_MOTS.md sera révisée** (l'étape de composition HTML disparaît).

## Migration en 4 chantiers — un par session (doctrine du projet)

1. **Extraction** — script jetable qui parse le carnet actuel une dernière fois
   → `data/*.json` + fragments de prose découpés. Critères d'acceptation
   chiffrés : le carnet régénéré est équivalent DOM-normalisé à l'actuel ;
   mêmes comptes **mesurés en navigateur** (1 220 cartes, nombre d'exemples,
   nombre de nœuds `lang="he"` — le compte se mesure, ne se calcule pas).
2. **Bascule des consommateurs** — `build.js` v2 produit carnet + `cards.json` ;
   `app.html` consomme `cards.json` (mort d'`extractCards`) ; standalone inline ;
   `verifie_exemples`/`cherche_mots`/`ajoute_mots` basculés sur JSON.
   Bump `VERSION` de `sw.js` (+ `cards.json` entre dans la stratégie de cache).
3. **Découpage d'`app.html`** — CSS et JS éclatés en `src/app/*`, assemblés au
   build. Contrôle A/B WebKit iPhone **et** largeurs desktop
   (1440/1280/992/900/768 — piège 13) : iso-visuel exigé, via sous-agents.
4. **Rangement final** — `tools/`, `docs/`, portail et tokens générés depuis
   `src/` ; révision de tous les .md (ARCHITECTURE réécrite autour du nouveau
   flux, pièges caducs retirés de CLAUDE.md, rituel mis à jour) ; flag
   `⚠️ GRAPHE À RECALER` dans TODO.md — le refresh du graphe est une décision
   séparée, en fin de refonte, jamais automatique.

Chaque chantier finit vert (build + validations + contrôle adapté), committe,
et laisse le site **déployable à tout moment**.

## Ce qui ne change pas

Iso-fonctionnel strict : mêmes URLs, même rendu, même charte (DESIGN.md
intouché), même standard de translittération, même comportement PWA/offline,
mêmes 1 220 cartes. C'est une réorganisation, pas une évolution produit.

## Risques nommés

- **Perte silencieuse de contenu au chantier 1** — le risque dominant. Parade :
  diff DOM-normalisé ancien/nouveau carnet + comptes navigateur comme critères
  d'acceptation ; le script d'extraction est jetable mais ses contrôles sont
  bloquants.
- **`.tr` manuels écrasés** par une régénération `he2tr` : interdit, contrôlé
  au diff du chantier 1.
- **Stale-while-revalidate** : chaque chantier qui touche un artefact déployé
  bumpe `VERSION` (piège 10).
- **Le graphe** devient massivement faux (fichiers créés/supprimés/renommés) :
  flag posé au chantier 4, refresh explicitement décidé ensuite (~235k tokens).
- **`file://`** : `app.html` fetche déjà — la contrainte serveur HTTP local
  existe et demeure ; `cards.json` n'ajoute rien.
