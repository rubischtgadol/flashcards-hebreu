# Flashcards Hébreu

Deux outils complémentaires pour apprendre l'hébreu moderne en débutant, en français : un **carnet de grammaire et de vocabulaire** à consulter, et une **application de flashcards** pour réviser.

## En ligne

- **Flashcards** : https://rubischtgadol.github.io/flashcards-hebreu/
- **Carnet grammaire + vocabulaire** : https://rubischtgadol.github.io/flashcards-hebreu/vocabulaire_hebreu.html

Les deux pages s'ajoutent facilement à l'écran d'accueil d'un téléphone (Safari → Partager → « Sur l'écran d'accueil ») pour un usage comme une application.

## Contenu du carnet

Le carnet est organisé en deux parties, avec un sommaire cliquable et une recherche instantanée (français, hébreu avec ou sans nikud, translittération) :

- **Partie 1 — Grammaire** : pronoms, démonstratifs, la racine (clé des verbes), le passé, le futur, patrons de conjugaison (binyanim), l'article défini, l'état construit, prépositions fléchies, existence & possession.
- **Partie 2 — Vocabulaire** : verbes et noms regroupés par thèmes, adjectifs, prépositions, conjonctions, mots interrogatifs, nombres, jours de la semaine, mots de quantité, expressions courantes.

Chaque mot hébreu est affiché avec nikud, sa translittération, sa traduction, et une ligne en écriture cursive.

## Mise à jour automatique

Les cartes ne sont **pas** figées dans l'application. Au chargement, `index.html` lit le carnet [`vocabulaire_hebreu.html`](./vocabulaire_hebreu.html) et en extrait tout le vocabulaire. Il suffit donc de modifier le carnet — ajouter un mot, une catégorie — pour que les flashcards se mettent à jour au prochain rechargement, sans toucher à l'application.

Fonctions des flashcards : cartes recto-verso, choix du sens (hébreu ↔ français), mode saisie avec tolérance aux fautes de frappe, affichage avec ou sans nikud (ou en cursif), audio (voix hébraïque du système), auto-évaluation et reprise des cartes ratées.

## Fichiers

- `index.html` — l'application de flashcards en ligne (reconstruit le vocabulaire depuis le carnet)
- `vocabulaire_hebreu.html` — le carnet de grammaire et vocabulaire (source unique de vérité)
- `flashcards_hebreu.html` — version autonome des flashcards (vocabulaire intégré au fichier, fonctionne hors ligne sans le carnet)

## Modifier le contenu

Pour ajouter ou corriger du vocabulaire, éditer `vocabulaire_hebreu.html` puis remplacer le fichier sur le dépôt (**Add file → Upload files → glisser le fichier → Commit changes**). GitHub Pages redéploie automatiquement en une à deux minutes, à la même adresse.

## Mise en ligne (GitHub Pages)

Dans **Settings → Pages**, choisir la source « Deploy from a branch », branche `main`, dossier `/ (root)`. L'application est alors servie aux adresses ci-dessus. GitHub Pages nécessite un dépôt public (ou un plan GitHub payant pour un dépôt privé).
