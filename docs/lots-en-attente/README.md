# Lots en attente

**Ce dossier est vide de bordereaux, et c'est son état normal.** Il n'existe pas pour stocker : il existe pour donner une destination à un lot de vocabulaire **prêt mais bloqué**, plutôt que de le laisser pourrir dans une branche ou dans un message.

Un lot atterrit ici quand son contenu est validé mais qu'il échoue à un contrôle **pour une raison de fond**, qui demande donc un arbitrage — pas quand il contient une faute de saisie, auquel cas on corrige la faute. La distinction est tout l'intérêt du dossier : on ne désarme jamais un contrôle dans l'urgence d'insérer un lot.

Le dossier est **hors de `data/`** : `node tools/build.js` ne le lit jamais, et rien ici n'entre dans le carnet, les cartes ou l'app tant qu'un arbitrage n'a pas déplacé le contenu vers `data/`. Un bordereau inséré est **supprimé d'ici** dans le même commit — garder les deux copies les laisse diverger.

## La règle d'arbitrage

**Un contrôle qui refuse un bon contenu signale souvent un contrat manquant, pas un contrôle trop sévère.** Devant un lot bloqué, trois voies s'ouvrent toujours : exempter la catégorie, renoncer au lot, ou **définir un contrat propre à sa classe**. La troisième est la bonne quand la classe est réelle : le contrat vaut ensuite partout dans le corpus, là où une exemption ouvre un trou par lequel tout passera.

Le contrat des sigles — gershayim, apostrophe finale, points — est né de ce raisonnement et vit dans [ARCHITECTURE.md](../ARCHITECTURE.md) § « Les exemples en situation ». Le récit de cet arbitrage est dans [TODO_ARCHIVE.md](../TODO_ARCHIVE.md).
