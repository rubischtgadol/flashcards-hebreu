# Flashcards Hébreu

Deux outils complémentaires pour apprendre l'hébreu moderne en débutant, en français : un **carnet de grammaire et de vocabulaire** à consulter, et une **application de flashcards** pour réviser.

## 🔗 Accès rapide (aucun téléchargement)

Ouvre ces liens sur n'importe quelle machine — ordinateur, téléphone, tablette :

**➡️ L'application (page principale) :**

    https://rubischtgadol.github.io/flashcards-hebreu/

**➡️ Le carnet de grammaire + vocabulaire :**

    https://rubischtgadol.github.io/flashcards-hebreu/vocabulaire_hebreu.html

Depuis l'application, un bouton mène au carnet (et inversement), donc le premier lien suffit en pratique. Les liens ne changent jamais : après chaque mise à jour du contenu, la même adresse affiche la version à jour.

L'application est une **PWA installable** : sur iPhone, ouvrir le premier lien dans Safari → Partager → « Sur l'écran d'accueil ». Elle s'installe avec son icône א dorée, s'ouvre en plein écran et **fonctionne hors ligne** (app et vocabulaire mis en cache ; les mises à jour poussées sur `main` sont récupérées en arrière-plan et visibles au lancement suivant).

## Contenu du carnet

Le carnet est organisé en trois parties, avec un sommaire cliquable et une recherche instantanée (français, hébreu avec ou sans nikud, translittération) :

- **Partie 1 — Grammaire** : pronoms, démonstratifs, la racine (clé des verbes), le passé, le futur, patrons de conjugaison (binyanim), l'article défini, l'état construit, prépositions fléchies, existence & possession.
- **Partie 2 — Vocabulaire, le dictionnaire** : verbes, noms et adjectifs, regroupés par thèmes.
- **Partie 3 — Mots-outils & expressions** : prépositions, conjonctions, mots interrogatifs, nombres, jours de la semaine, mots de quantité, expressions courantes et **phrases utiles du quotidien** (« Combien ça coûte ? », « L'addition, s'il te plaît »…).

Chaque mot hébreu est affiché avec nikud, sa translittération, sa traduction, et une ligne en écriture cursive.

## Translittération : le standard du carnet

Toutes les translittérations suivent la même convention, pensée pour une lecture à la française :

| Lettre hébraïque | Graphie | Exemple |
|---|---|---|
| כ khaf (sans daguech) | `kh` | *shelkha* (שֶׁלְּךָ) |
| ח het | `ch` | *anachnu*, *koach* |
| צ tsadi | `ts` | *ratsim* |
| ע ayin | `'` (partout, même à l'initiale) | *'ivrit*, *be'er*, *yode'a* |
| א alef entre deux voyelles | `'` | *tsme'ah* |
| ה hé final | `h` conservé | *atah*, *zeh*, *morah* |
| tsere/segol + yud | `ei` | *beit sefer* |

Le shva initial d'un groupe de consonnes n'est écrit que s'il s'entend (*gdolim*, *dvarim*, mais *ledaber*). Dans le mode saisie des flashcards, la correction reste tolérante : `ch`/`kh`, `ts`/`tz`, `ou`/`u`, avec ou sans apostrophe… toutes ces variantes sont acceptées.

## L'application de flashcards

Trois modes de travail, dans les deux sens (hébreu → français ou français → hébreu) :

- **Cartes** recto-verso, avec auto-évaluation (« Je savais » / « À revoir »).
- **Saisie** où l'on tape la réponse, avec navigation entièrement au clavier (Entrée pour vérifier, Entrée ou Espace pour passer à la suivante) et un bouton « Je ne sais pas ». Réponses en hébreu acceptées **soit en translittération** (graphie à la française tolérée : « chatoul », « khatul »…), **soit via un clavier hébreu virtuel** intégré (disposition israélienne standard). Une réponse à une petite faute près est comptée juste, avec un « Presque ! » qui montre la forme exacte à côté de la tienne.
- **QCM** : la bonne traduction à retrouver parmi quatre choix (distracteurs tirés de la même catégorie), sans clavier — idéal sur téléphone.

Autres réglages et fonctions :

- **Révision du jour** : une mémorisation par répétition espacée (système de Leitner). Chaque réponse, dans n'importe quel mode, fait « monter » ou « redescendre » la carte ; celles arrivées à échéance sont regroupées dans une session de révision, tous thèmes confondus. La progression est enregistrée dans le navigateur et **survit entre les sessions** ; une barre de maîtrise indique l'avancement global.
- **Longueur de session** : 10, 20 (par défaut), 50 cartes ou tout le paquet. En ordre aléatoire, chaque session pioche des cartes différentes ; la révision du jour respecte aussi cette limite (les cartes les plus en retard d'abord, le reste attend la prochaine séance). « Rejouer les ratées » n'est jamais limité.
- Affichage de l'hébreu avec nikud, sans nikud, ou en écriture cursive.
- Audio avec la voix hébraïque du système — « Au clic » (le bouton haut-parleur uniquement) ou « Automatique » (lecture à chaque carte et à chaque réponse révélée) ; sans voix hébraïque installée, le réglage se désactive au lieu de laisser une voix par défaut prononcer de travers. Ordre aléatoire ou linéaire.
- En fin de session, le bilan **liste les cartes ratées** (hébreu + français) avant de proposer de les rejouer.
- **Réglages mémorisés** : mode, direction, écriture, audio, longueur et catégories choisies sont restaurés d'une visite à l'autre. Une session interrompue (rechargement, onglet évincé par iOS) **reprend là où tu t'étais arrêté**.
- **Accessible** : navigation complète au clavier (anneau de focus doré, recherche incluse), verdicts annoncés aux lecteurs d'écran, hébreu balisé `lang="he"` pour une prononciation correcte, cibles tactiles confortables sur mobile.
- En mode saisie, le verdict se corrige dans les deux sens : **« J'avais juste »** si le correcteur t'a jugé à tort, **« En fait, je ne savais pas »** si tu as deviné — la progression suit.

## Mise à jour automatique

Les cartes ne sont **pas** figées dans l'application. Au chargement, `index.html` lit le carnet [`vocabulaire_hebreu.html`](./vocabulaire_hebreu.html) et en extrait tout le vocabulaire. Il suffit donc de modifier le carnet — ajouter un mot, une catégorie — pour que les flashcards se mettent à jour au prochain rechargement, sans toucher à l'application.

## Fichiers

- `index.html` — l'application de flashcards en ligne (reconstruit le vocabulaire depuis le carnet)
- `vocabulaire_hebreu.html` — le carnet de grammaire et vocabulaire (source unique de vérité)
- `flashcards_hebreu.html` — version autonome des flashcards, **générée par `build.js`, à ne pas éditer à la main** (vocabulaire intégré au fichier : s'ouvre en double-cliquant, sans serveur ni connexion — seules les polices décoratives viennent du web ; sans connexion l'hébreu s'affiche en police système)
- `build.js` — outil de développement (non déployé) : régénère `flashcards_hebreu.html` depuis les deux fichiers ci-dessus
- `manifest.webmanifest`, `sw.js`, `icons/` — la couche PWA : manifeste d'installation, service worker hors-ligne, icônes א aux couleurs de la charte

## Modifier le contenu

Pour ajouter ou corriger du vocabulaire, éditer `vocabulaire_hebreu.html` puis remplacer le fichier sur le dépôt (**Add file → Upload files → glisser le fichier → Commit changes**). GitHub Pages redéploie automatiquement en une à deux minutes, à la même adresse ; l'application en ligne se met à jour toute seule.

La version autonome, elle, ne se met pas à jour toute seule : après toute modification du carnet ou d'`index.html`, lancer

    node build.js

qui régénère `flashcards_hebreu.html` et affiche le compte de cartes par section (toute section tombée à zéro fait échouer le build — signe qu'un titre de section ou une table du carnet a été cassé). `node build.js --check` vérifie sans rien écrire.

## Mise en ligne (GitHub Pages)

Dans **Settings → Pages**, choisir la source « Deploy from a branch », branche `main`, dossier `/ (root)`. L'application est alors servie aux adresses ci-dessus. GitHub Pages nécessite un dépôt public (ou un plan GitHub payant pour un dépôt privé).
