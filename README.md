# Flashcards Hébreu

Deux outils complémentaires pour apprendre l'hébreu moderne en débutant, en français : un **carnet de grammaire et de vocabulaire** à consulter, et une **application de flashcards** pour réviser.

## 🔗 Accès rapide (aucun téléchargement)

Ouvre ces liens sur n'importe quelle machine — ordinateur, téléphone, tablette :

**➡️ La porte d'entrée (le portail — « Bienvenue », puis choisir flashcards ou carnet) :**

    https://rubischtgadol.github.io/flashcards-hebreu/

**➡️ L'application de flashcards, directement :**

    https://rubischtgadol.github.io/flashcards-hebreu/app.html

**➡️ Le carnet de grammaire + vocabulaire, directement :**

    https://rubischtgadol.github.io/flashcards-hebreu/vocabulaire_hebreu.html

Depuis l'application, un bouton mène au carnet (et inversement), donc le premier lien suffit en pratique. Les liens ne changent jamais : après chaque mise à jour du contenu, la même adresse affiche la version à jour.

L'application est une **PWA installable** : sur iPhone, ouvrir un des liens dans Safari → Partager → « Sur l'écran d'accueil ». Elle s'installe avec son icône א dorée, s'ouvre en plein écran sur la page d'accueil (« Bienvenue », puis le choix flashcards ou carnet) et **fonctionne hors ligne** (app et vocabulaire mis en cache ; les mises à jour poussées sur `main` sont récupérées en arrière-plan et visibles au lancement suivant). Une icône déjà installée garde le comportement de son installation : la supprimer et la re-sauvegarder pour profiter des changements d'accueil.

## Contenu du carnet

Le carnet est organisé en trois parties, avec un sommaire cliquable et une recherche instantanée (français, hébreu avec ou sans nikud, translittération) :

- **Partie 1 — Lire l'hébreu, puis la grammaire** : elle s'ouvre sur **le nikoud** — les treize signes un par un, avec leur nom, leur prononciation et un exemple tiré du carnet, puis le shva, les chatafs des gutturales, le qamats katan, le dagesh et ses trois rôles, le point du shin, le patach furtif, et pourquoi les Israéliens écrivent sans nikoud au quotidien. Viennent ensuite pronoms, démonstratifs, la racine (clé des verbes), le passé, le futur, patrons de conjugaison (binyanim), l'article défini, l'état construit, prépositions fléchies, le hé directionnel, existence & possession.
- **Partie 2 — Vocabulaire, le dictionnaire** : verbes, noms et adjectifs, regroupés par thèmes.
- **Partie 3 — Mots-outils & expressions** : prépositions, conjonctions, mots interrogatifs, nombres, jours de la semaine, mots de quantité, adverbes (temps, lieu, degré, manière), pronoms réfléchis, expressions courantes, **phrases utiles du quotidien** (« Combien ça coûte ? », « L'addition, s'il te plaît »…) **les abréviations et sigles** — les רָאשֵׁי תֵּבוֹת qu'on croise sur les panneaux et les formulaires (צה"ל, עו"ד, וכו'), avec les trois façons de les lire à voix haute, et **l'hébreu parlé** — le registre familier qu'on entend sans le trouver dans les manuels (תַּכְלֶס, כְּאִילוּ, סַבָּבָּה), chaque entrée avec sa phrase d'usage.

Chaque mot hébreu est affiché avec nikud, sa translittération, sa traduction, et une ligne en écriture cursive.

Le carnet est lui aussi **accessible** : tout l'hébreu y est balisé `lang="he"` — y compris les mots glissés au fil d'une phrase française —, pour qu'un lecteur d'écran le prononce en hébreu et non à la française ; les cibles tactiles sont confortables au doigt, et l'animation de défilement du sommaire s'efface si le système demande un mouvement réduit.

## Translittération : le standard du carnet

Toutes les translittérations suivent la même convention, pensée pour une lecture à la française :

| Lettre hébraïque | Graphie | Exemple |
| --- | --- | --- |
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

- **Cartes** recto-verso, avec auto-évaluation (« Je savais » / « À revoir ») — et un discret « Annuler la dernière réponse » si le pouce a glissé.
- **Saisie** où l'on tape la réponse, avec navigation entièrement au clavier (Entrée pour vérifier, Entrée ou Espace pour passer à la suivante) et un bouton « Je ne sais pas » (valider un champ vide ne compte rien). Réponses en hébreu acceptées **soit en translittération** (graphie à la française tolérée : « chatoul », « khatul »…), **soit en vrai hébreu** — sur ordinateur, un clavier hébreu virtuel intégré (disposition israélienne standard) se déplie à la demande ; sur téléphone, il s'efface : le clavier hébreu du système fait l'affaire. Une réponse à une petite faute près est comptée juste, avec un « Presque ! » qui montre la forme exacte à côté de la tienne.
- **QCM** : la bonne traduction à retrouver parmi quatre choix — les distracteurs sont tirés **du même thème que le mot interrogé** (et de sa catégorie quand le vivier le permet), pour qu'on ne puisse pas répondre par élimination sans reconnaître le mot ; jamais deux quasi-synonymes entre les options. Idéal sur téléphone, et jouable au clavier (touches 1–4, Entrée pour la suivante).

Autres réglages et fonctions :

- **Niveau de difficulté** : chaque mot du carnet est classé sur l'échelle européenne des langues (CECRL, de A1 à C2), repliée en quatre paliers — Facile (A1), Intermédiaire (A2–B1), Difficile (B2–C1), Expert (C2). On coche un ou plusieurs niveaux, qui se croisent avec les catégories ; la révision du jour, elle, n'est pas filtrée (une carte apprise reste due).
- **Thèmes** : les noms, adjectifs et verbes sont aussi classés en quinze champs sémantiques — famille & personnes, corps & santé, nourriture & repas, maison & objets, vêtements & couleurs, ville, lieux & transports, nature & animaux, temps & calendrier, travail & études, vie quotidienne, argent & achats, loisirs & culture, parler & penser, émotions & caractère, notions abstraites. Filtre optionnel : sans thème coché, tout le vocabulaire est retenu ; en cocher un ou plusieurs restreint la session à ces champs, croisés avec les catégories et le niveau (les listes — nombres, jours… — restent accessibles par leurs catégories). Comme le niveau, la révision du jour n'en tient pas compte.
- **Exemples en situation** : les mots du carnet peuvent porter des phrases d'exemple (hébreu avec nikud, translittération, français). Sur la carte, un discret « Voir un exemple » les déplie une fois la réponse visible — jamais avant, il révélerait la réponse — avec un bouton Écouter par phrase ; la recherche les montre aussi dans son tiroir. **Tous les noms, adjectifs et verbes du carnet ont leur exemple** (les verbes avec une phrase conjuguée au présent) — et c'est une règle : un mot ajouté à ces trois familles sans exemple est refusé par l'outillage.
- **Révision du jour** : une mémorisation par répétition espacée (système de Leitner). Chaque réponse, dans n'importe quel mode, fait « monter » ou « redescendre » la carte ; celles arrivées à échéance sont regroupées dans une session de révision, tous thèmes confondus. La progression est enregistrée dans le navigateur et **survit entre les sessions** ; une barre de maîtrise indique l'avancement global.
- **Longueur de session** : 10, 20 (par défaut), 50 cartes ou tout le paquet. En ordre aléatoire, chaque session pioche des cartes différentes ; la révision du jour respecte aussi cette limite (les cartes les plus en retard d'abord, le reste attend la prochaine séance). « Rejouer les ratées » n'est jamais limité.
- Affichage de l'hébreu avec nikud, sans nikud, ou en écriture cursive.
- Audio avec la voix hébraïque du système — « Au clic » (le bouton haut-parleur uniquement) ou « Automatique » (lecture à chaque carte et à chaque réponse révélée) ; la note du réglage **nomme la voix retenue** par l'appareil, et sans voix hébraïque installée, le réglage se désactive au lieu de laisser une voix par défaut prononcer de travers. Sur iPhone, c'est la voix hébraïque **fournie avec le système** (Carmit) : installer une variante « Enhanced » depuis les Réglages ne changera rien, Safari ne donne pas accès aux voix téléchargeables. Ordre aléatoire ou linéaire.
- En fin de session, le bilan **liste les cartes ratées** (hébreu + français) avant de proposer de les rejouer — « Rejouer ces N cartes » relance exactement le même tirage. Après une révision, une ligne rappelle que les ratées redeviennent dues aussitôt : c'est la méthode, pas un bug.
- **Repartir de zéro** : tout en bas des « Réglages avancés », une action efface entièrement le profil local — progression de révision, réglages, session en cours — après une confirmation explicite qui annonce combien de cartes suivies seront perdues. L'appli revient à son état de premier lancement.
- **Diagnostic de latence** (temporaire) : les « Réglages avancés » affichent les millisecondes du chargement et du dernier geste (attente · travail · affichage) — la mesure se lit sur l'appareil même, sans inspecteur.
- **Réglages mémorisés** : mode, direction, écriture, audio, longueur, catégories, niveaux et thèmes choisis sont restaurés d'une visite à l'autre. L'écran de départ tient en quatre plis : « Catégories », « Niveau », « Thèmes » et « Réglages avancés » (ordre, longueur, prononciation). Chaque pli affiche sur sa rangée ce qui est sélectionné dessous — « Verbes, Noms », « Facile », « Aléatoire · 20 cartes · Au clic » — de sorte que replier condense sans rien cacher. Les groupes s'ouvrent d'eux-mêmes tant qu'ils sont vides, et ne se referment jamais tout seuls une fois qu'on y a touché. Sur mobile, le bouton « Commencer » reste sous le pouce pendant le défilement. Au tout premier lancement, aucune catégorie ni aucun niveau n'est présélectionné — tu choisis toi-même ce que tu veux réviser (un indice sous « Commencer » guide le premier choix). Une session interrompue (rechargement, onglet évincé par iOS) **reprend là où tu t'étais arrêté** ; « Quitter » précise combien de réponses sont déjà comptées dans ta révision.
- **Accessible** : navigation complète au clavier dans les trois modes (anneau de focus doré, recherche incluse, touche **P** pour écouter la carte), verdicts **et versos** annoncés aux lecteurs d'écran — y compris l'existence d'un exemple à déplier —, hébreu balisé `lang="he"` pour une prononciation correcte, cibles tactiles confortables sur mobile.
- Le verdict se corrige dans les trois modes : **« J'avais juste »** si le correcteur (ou le pouce) t'a joué un tour, **« En fait, je ne savais pas »** si tu as deviné — la progression suit, dans les deux sens. Au clavier : touche **C**.

## Mise à jour automatique

Les cartes ne sont **pas** figées dans l'application. Au chargement, `app.html` charge [`cards.json`](./cards.json), généré depuis `data/*.json` par `node tools/build.js`. Il suffit donc de régénérer `cards.json` — après avoir modifié le vocabulaire — pour que les flashcards se mettent à jour au prochain rechargement, sans toucher à l'application.

## Fichiers

- `index.html` — le portail : la porte d'entrée à la racine — un accueil plein écran (message de bienvenue en français ou en hébreu au hasard, le א doré de l'icône, deux ménorahs qui éclairent l'écran), puis le choix entre l'application et le carnet. **Généré par `tools/build.js` depuis `src/portail/`, à ne pas éditer à la main**
- `app.html` — l'application de flashcards en ligne (charge le vocabulaire depuis `cards.json` au démarrage), **générée par `tools/build.js` depuis `src/app/`, à ne pas éditer à la main**
- `vocabulaire_hebreu.html` — le carnet de grammaire et vocabulaire, **généré par `tools/build.js` depuis `data/*.json`, à ne pas éditer à la main** (hors connexion, l'hébreu retombe sur David Libre plutôt que sur une police système générique, qui rend mal le nikoud)
- `data/` — le vocabulaire et la grammaire, **source unique de vérité** (`noms.json`, `adjectifs.json`, `verbes.json`, `listes/*.json`) ; `node tools/build.js` en dérive le carnet, `cards.json`, l'application et la version autonome (le portail, lui, ne dépend que de `src/`)
- `src/` — les sources des fichiers générés : `src/carnet/` (gabarits du carnet), `src/app/` (la coquille HTML de l'application, ses fragments de style et ses 14 modules de code), `src/portail/` (la page d'accueil) et `src/tokens.css` (les couleurs de la charte, injectées dans les trois pages au build). **C'est ici qu'on modifie l'application et le portail**, jamais dans `app.html` ni `index.html`
- `cards.json` — le vocabulaire au format que l'application charge, **généré par `tools/build.js`, à ne pas éditer à la main**
- `flashcards_hebreu.html` — version autonome des flashcards, **générée par `tools/build.js`, à ne pas éditer à la main** (vocabulaire intégré au fichier : s'ouvre en double-cliquant, sans serveur ni connexion — seules les polices décoratives viennent du web ; sans connexion l'hébreu s'affiche en police système)
- `tools/` — les six outils de développement (non déployés, zéro dépendance ; se lancent **depuis la racine du dépôt**, jamais depuis `tools/`) :
  - `tools/build.js` — régénère `vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html` et `index.html` depuis `data/` et `src/`
  - `tools/verifie_exemples.js` — contrôle les exemples en situation du carnet (longueur, nikoud, translittération, niveau du vocabulaire) et exige qu'aucun nom, adjectif ou verbe ne reste sans exemple
  - `tools/ajoute_mots.js` — générateur de fiche : insère de nouveaux mots dans le carnet depuis un petit fichier JSON (balisage, translittération dérivée, placement et validation automatiques ; simulation par défaut, n'écrit qu'avec `--ecrire` après validation complète)
  - `tools/mesure_translitteration.js` — note la translittération automatique (`he2tr`) face aux translittérations écrites à la main, qui font foi : accord exact, accord après pliage de saisie, distance d'édition. `--top` montre les plus gros écarts, `--shva` tabule le shva initial. C'est le garde-fou de la règle du shva : on ne la retouche pas sans que les trois nombres s'améliorent
  - `tools/cherche_mots.js` — consultation en lecture seule du carnet : `node tools/cherche_mots.js MOT…` répond « ce mot existe-t-il, et où ? » (hébreu ou français), `--stats` montre la répartition par thème et par niveau ; pour vérifier un candidat à moindre coût, sans relire le carnet
  - `tools/controle_tr.js` — contrôle une fiche de mots entrée par entrée (vedettes, exemples et formes) en comparant chaque `tr` écrit à la main à ce que produit `he2tr`, et distingue le simple écart d'affichage — que le pliage de saisie absorbe — du vrai désaccord, qui sort en échec. Toute fiche y passe avant insertion
- `docs/` — la prose du projet (non déployée) : `ARCHITECTURE.md` (flux de données et contrats), `DESIGN.md` (la charte visuelle), `PRODUCT.md` (registre et intentions), `RITUEL.md` (le rituel après une modification, et l'outillage), `TODO.md` (état courant seulement), `SPEC_AJOUTE_MOTS.md` (le contrat du générateur de fiches) et `TODO_ARCHIVE.md` (l'archive — tout le récit du projet y vit, et lui seul)
- `manifest.webmanifest`, `sw.js`, `icons/` — la couche PWA : manifeste d'installation, service worker hors-ligne, icônes א aux couleurs de la charte
- `graphify-out/` — aide au développement (non déployée, sans effet sur le site) : une cartographie du dépôt qui permet à un assistant de code de retrouver une fonction ou une règle sans relire les gros fichiers. `graph.json` et `GRAPH_REPORT.md` sont versionnés ; le reste se régénère localement

## Modifier le contenu

Pour ajouter ou corriger du vocabulaire, éditer les fichiers `data/*.json` (à la main, ou via `node tools/ajoute_mots.js` pour l'ajout de mots), puis lancer, **depuis la racine du dépôt** :

    node tools/build.js

Il régénère les cinq artefacts — `vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html` et `index.html` — depuis `data/` et `src/`, et affiche le compte de cartes par section (toute section tombée à zéro fait échouer le build : signe qu'une section a disparu de `data/` ou qu'une entrée est mal formée). Il **estampille** ensuite la ligne `const VERSION` de `sw.js` avec un hash du contenu servi : le cache de la PWA se renomme tout seul dès qu'un fichier servi change, il n'y a plus de bump manuel à ne pas oublier. `node tools/build.js --check` vérifie sans rien écrire — artefacts en phase **et** estampille à jour.

Ce sont les fichiers régénérés qu'on commite, avec les sources qui les ont produits — `git add`, `git commit`, `git push` sur `main`. GitHub Pages redéploie automatiquement en une à deux minutes, à la même adresse ; l'application en ligne se met à jour toute seule. La version autonome, elle, ne se met à jour qu'en la retéléchargeant.

⚠️ **Une fois par machine, activer les garde-fous au commit** :

    git config core.hooksPath .githooks

Sans cette commande, le hook `pre-commit` versionné ne s'exécute pas — et rien ne le signale : on peut alors commiter un artefact périmé (y compris un artefact sans son estampille `VERSION`, que `--check` recalcule) ou une erreur d'exemple bloquante.

## Mise en ligne (GitHub Pages)

Dans **Settings → Pages**, choisir la source « Deploy from a branch », branche `main`, dossier `/ (root)`. L'application est alors servie aux adresses ci-dessus. GitHub Pages nécessite un dépôt public (ou un plan GitHub payant pour un dépôt privé).
