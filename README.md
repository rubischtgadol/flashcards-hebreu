# Flashcards Hébreu

Application web pour réviser le vocabulaire hébreu : cartes recto-verso, choix du sens (hébreu ↔ français), affichage avec ou sans nikud (ou en cursif), et auto-évaluation avec reprise des cartes ratées.

## Mise à jour automatique

Les cartes ne sont **pas** figées dans l'application. Au chargement, `index.html` lit le carnet [`vocabulaire_hebreu.html`](./vocabulaire_hebreu.html) et en extrait tout le vocabulaire. Il suffit donc de modifier le carnet — ajouter un mot, une catégorie — pour que les flashcards se mettent à jour automatiquement au prochain rechargement, sans toucher à l'application.

## Fichiers

- `index.html` — l'application de flashcards
- `vocabulaire_hebreu.html` — le carnet de vocabulaire (source unique de vérité)

## Mise en ligne (GitHub Pages)

Dans **Settings → Pages**, choisir la source « Deploy from a branch », branche `main`, dossier `/ (root)`. L'application sera alors servie à l'adresse indiquée par GitHub. (GitHub Pages nécessite un dépôt public, ou un plan GitHub payant pour un dépôt privé.)
