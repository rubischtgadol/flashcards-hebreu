# Lots en attente

**Ce dossier est vide de bordereaux, et c'est son état normal.** Il n'existe pas pour stocker : il existe pour donner une destination à un lot de vocabulaire **prêt mais bloqué**, plutôt que de le laisser pourrir dans une branche ou dans un message.

Un lot atterrit ici quand son contenu est validé mais qu'il échoue à un contrôle **pour une raison de fond**, qui demande donc un arbitrage — pas quand il contient une faute de saisie, auquel cas on corrige la faute. La distinction est tout l'intérêt du dossier : on ne désarme jamais un contrôle dans l'urgence d'insérer un lot.

Le dossier est **hors de `data/`** : `node tools/build.js` ne le lit jamais, et rien ici n'entre dans le carnet, les cartes ou l'app tant qu'un arbitrage n'a pas déplacé le contenu vers `data/`. Un bordereau inséré est **supprimé d'ici** dans le même commit — garder les deux copies les laisse diverger.

## Le précédent, pour savoir à quoi ressemble un arbitrage réussi

`abreviations-et-sigles.json` a occupé ce dossier le temps d'un chantier, avec 11 entrées que `verifie_exemples.js` refusait par **13 erreurs bloquantes**. Le contenu n'y était pour rien : le validateur exigeait du nikoud sur chaque mot, or un sigle ne se vocalise pas, et sa translittération est sa **forme lue à voix haute** (ז"א se lit *zot omeret*), que `he2tr` ne peut pas dériver — l'écart dépassait donc forcément le seuil.

Trois voies avaient été notées : exempter la catégorie, renoncer à la section, ou définir un contrat propre à cette classe. **C'est la troisième qui a été retenue**, et le détour valait la peine : un « contrat de sigle » typographique (gershayim, apostrophe finale, points) vaut partout dans le corpus, là où une exemption de catégorie aurait ouvert un trou par lequel n'importe quel mot non vocalisé serait passé. Le lot est désormais dans `data/listes/`, la section au carnet, et le contrat décrit dans [ARCHITECTURE.md](../ARCHITECTURE.md) § « Les exemples en situation ».

La leçon à retenir de ce dossier : **un contrôle qui refuse un bon contenu signale souvent un contrat manquant, pas un contrôle trop sévère.**
