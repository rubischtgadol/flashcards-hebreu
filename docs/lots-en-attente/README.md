# Lots en attente

Ce dossier conserve les bordereaux de vocabulaire prêts mais non insérés dans `data/`, faute d'un arbitrage tranché sur la façon de les faire passer les contrôles existants. `abreviations-et-sigles.json` en est le premier exemple : 11 entrées bloquées par `verifie_exemples.js` pour une raison structurelle (un sigle n'est pas vocalisé, sa translittération est la forme lue à voix haute) — détail et voies possibles dans docs/TODO.md § Dette ouverte.

Ce dossier est **hors de `data/`** : `node tools/build.js` ne le lit jamais, et rien ici n'entre dans le carnet, les cartes ou l'app tant qu'un arbitrage n'a pas déplacé le contenu vers `data/`.
