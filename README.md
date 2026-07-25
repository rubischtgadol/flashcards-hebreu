# Flashcards Hébreu

Deux outils complémentaires pour apprendre l'hébreu moderne en débutant, en français : un **carnet de grammaire et de vocabulaire** à consulter, et une **application de flashcards** pour réviser.

> **🚧 Branche `refonte-retrofuturiste` — prototypes de la charte v2 « La console d'étude »**
>
> À juger sur téléphone (le soir, en conditions réelles d'étude) :
>
> **➡️ LA page à ouvrir — la page-témoin v0.6, charte complète et arbitrée**
> (A Observatoire, trois voix typo sans italique, 12 modules intégrés, écran Bilan).
> **Plus aucun effet de surface d'écran** : bruit, vignettage et scintillement ont été
> retirés le 24/07 après jugement sur iPhone réel — l'identité tient à la grille, aux
> graduations de bord, au glow et à la typographie :
>
>     https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/prototype-nerv.html
>
> **➡️ LA planche à juger maintenant — le mouvement** (25/07). Les **9 moments** de l'app
> qui appellent une animation (révélation recto/verso, verdict juste/faux, carte suivante,
> progression, radar, transition d'écran, chiffres du bilan, pilule voix, alerte), chacun
> rendu **deux fois côte à côte : `steps()` contre fluide**, à markup, durée et distance
> identiques. Un verdict attendu par moment — **A, B ou rien** ; « rien » est une réponse
> légitime. Aucun effet de surface d'écran ; le seul mouvement en boucle (la pilule voix)
> s'arrête tout seul :
>
>     https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/prototype-mouvement.html
>
> **➡️ La planche de l'âme** (25/07) — 9 propositions de **mouvement ambiant** : étoiles à la
> dérive, radar qui balaie à vide, orbites lentes, feed de veille, aiguille qui frémit, curseur
> qui bat, séquence d'allumage, croix de visée, halo qui respire (celui-là **signalé risqué**).
> Chacune isolée avec son interrupteur, puis un **écran cumulé** avec « tout couper » et un
> **compteur d'animations actives** — le chiffre qui dit si ça grouille. Verdict attendu par
> proposition : garder / jeter / garder mais moins :
>
>     https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/prototype-ame.html
>
> **➡️ La planche des parures** (25/07) — 13 propositions d'**ornement pour l'app**, chacune
> en bascule **sans / avec** : lettre fantôme, **nikoud teinté**, **racine en vedette**, réglure
> de cahier, épaisseur du paquet, cartouche poinçonné, filigrane de niveau, sceau de session,
> constellation des thèmes, quantième hébraïque, règle de bord qui suit le défilement, bouton
> qui s'enfonce, et **l'écho de saisie** (les lettres hébraïques s'allument à mesure qu'on tape).
> **11 sur 13 sont statiques et restent visibles en mouvement réduit.** Verdict attendu par
> proposition : prendre / jeter / prendre plus discret :
>
>     https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/prototype-parures.html
>
> **➡️ La planche du décor** (25/07) — **18 ornements entièrement gratuits** pour décorer tout
> le site, chacun en bascule **sans / avec**, étiqueté **discret / affirmé / spectaculaire**, avec
> sa surface visée et son coût. Cinq familles : **le châssis** (plaque constructeur, filet double,
> ruban perforé) · **l'alphabet comme ornement** (métier à tisser, rosace hébraïque, plotter qui
> dessine la lettre, pluie de caractères) · **les instruments qui ne mesurent rien** (onde
> porteuse, guématrie en marge, diodes de façade) · **la profondeur encadrée** (terrain filaire,
> globe filaire) · et **les 6 procédés prélevés** — passe-partout, halo par `backdrop-filter`,
> grille de points, bord gravé, fondu de panneau, jeu de glyphes. **11 sur 18 sont statiques.**
> La page finit sur une **scène cumulée** pilotée par les mêmes interrupteurs, avec un compteur
> d'animations actives : **le nombre d'ornements que tu retires de cette scène est le vrai
> verdict**. Verdict attendu par proposition : prendre / jeter / prendre plus discret / **statique
> seulement** :
>
>     https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/prototype-decor.html
>
> ⚠️ Seule la **famille E** porte une provenance mesurée sur la référence ; les douze autres sont
> **composés**, et la planche le dit au lieu de laisser croire le contraire. Elle a demandé une
> troisième règle de charte, la **règle du mobilier** (spec § 5 ter, **non arbitrée**).
>
> **➡️ La planche des polices hébraïques** — שָׁלוֹם dans les 62 familles Google Fonts qui
> couvrent l'hébreu, avec pour chacune un **verdict nikoud mesuré dans le fichier de fonte** :
>
>     https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/specimen-hebreu.html
>
> **Exploration typographique hébraïque — classée** (25/07). L'hébreu reste en
> **Frank Ruhl Libre**. Les planches sont conservées au cas où, pas pour être reprises :
> [les 62 familles Google Fonts](https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/specimen-hebreu.html) ·
> [les monospaces hébreux hors catalogue](https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/specimen-monospace-hebreu.html) ·
> [le duel Miriam / Unifont](https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/duel-miriam-unifont.html) ·
> [le nikoud d'Unifont réparé](https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/unifont-nikoud-repare.html)
>
> Archives d'arbitrage (déjà tranchées, à consulter seulement pour repêcher) :
>
> **➡️ Le protocole de test des calques sur device** (soldé : les trois effets ont été
> rejetés ; conservé pour un futur effet à juger) :
>
>     https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/test-crt-iphone.html
>
> **➡️ Les 21 effets candidats** (12 retenus et intégrés ; 9 écartés « pour l'instant » :
> halo, bloom, balayage, glitch, équerres, bande, lettre fantôme, ticker, réticule) :
>
>     https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/prototype-effets.html
>
> **➡️ La planche des variantes A/B/C/D + bancs d'essai typo :**
>
>     https://raw.githack.com/rubischtgadol/flashcards-hebreu/refonte-retrofuturiste/prototype-variantes.html
>
> **Référence fondatrice** : l'app SENTRY. Liens, méthode d'extraction et ce qui en a été
> prélevé : [REFERENCES_SENTRY.md](REFERENCES_SENTRY.md). ⚠️ **Le prélèvement du mouvement
> a été fait le 25/07 et le gisement est sec** — trois `@keyframes` en tout, dont les deux
> calques déjà rejetés et un keyframe mort : inutile de repiloter la référence pour ça.
> Elle garde son autorité sur les couleurs, la structure et les ornements.
>
> ⚠️ **Ne pas confondre avec la seconde passe.** Le même jour, une passe d'objet différent — le
> **mobilier décoratif statique**, pas le mouvement — a été menée sur les **deux** liens, dont la
> vue `app.fuser.studio` **jamais explorée** jusque-là. Celle-là **n'était pas sèche** :
> **17 trouvailles mesurées** au CSS calculé sur **2 833 nœuds**, dont **6 procédés** que la charte
> n'avait pas (famille E de la planche du décor). Deux angles restent d'ailleurs ouverts : le mode
> **bureau** du Studio, capturé en cours de chargement, et l'ombre portée des cartes de son board.
>
> ⚠️ **Le miroir raw.githack met en cache.** Il suit la branche, mais un fichier
> peut rester servi dans sa version précédente pendant un moment — sans rien qui le
> signale. Payé une fois le 24/07 : le test CRT a été passé sur une version périmée
> de l'outil, et les deux réponses de recette ont été perdues. **Après un push,
> ouvrir les liens avec un suffixe `?v=<n>` incrémenté** (`…/prototype-nerv.html?v=5`),
> ou remplacer le nom de branche par le SHA du commit — les deux servent la version
> fraîche immédiatement. Spec de la
> charte : [docs/superpowers/specs/2026-07-24-charte-retrofuturiste-design.md](docs/superpowers/specs/2026-07-24-charte-retrofuturiste-design.md).
> (Encart propre à cette branche — ne pas le fusionner dans `main`.)

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

- **Partie 1 — Grammaire** : pronoms, démonstratifs, la racine (clé des verbes), le passé, le futur, patrons de conjugaison (binyanim), l'article défini, l'état construit, prépositions fléchies, le hé directionnel, existence & possession.
- **Partie 2 — Vocabulaire, le dictionnaire** : verbes, noms et adjectifs, regroupés par thèmes.
- **Partie 3 — Mots-outils & expressions** : prépositions, conjonctions, mots interrogatifs, nombres, jours de la semaine, mots de quantité, expressions courantes et **phrases utiles du quotidien** (« Combien ça coûte ? », « L'addition, s'il te plaît »…).

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
- **Diagnostic de latence** (temporaire, dossier du 20/07) : les « Réglages avancés » affichent les millisecondes du chargement et du dernier geste (attente · travail · affichage) — la mesure se lit sur l'appareil même, sans inspecteur.
- **Réglages mémorisés** : mode, direction, écriture, audio, longueur, catégories, niveaux et thèmes choisis sont restaurés d'une visite à l'autre. L'écran de départ tient en quatre plis : « Catégories », « Niveau », « Thèmes » et « Réglages avancés » (ordre, longueur, prononciation). Chaque pli affiche sur sa rangée ce qui est sélectionné dessous — « Verbes, Noms », « Facile », « Aléatoire · 20 cartes · Au clic » — de sorte que replier condense sans rien cacher. Les groupes s'ouvrent d'eux-mêmes tant qu'ils sont vides, et ne se referment jamais tout seuls une fois qu'on y a touché. Sur mobile, le bouton « Commencer » reste sous le pouce pendant le défilement. Au tout premier lancement, aucune catégorie ni aucun niveau n'est présélectionné — tu choisis toi-même ce que tu veux réviser (un indice sous « Commencer » guide le premier choix). Une session interrompue (rechargement, onglet évincé par iOS) **reprend là où tu t'étais arrêté** ; « Quitter » précise combien de réponses sont déjà comptées dans ta révision.
- **Accessible** : navigation complète au clavier dans les trois modes (anneau de focus doré, recherche incluse, touche **P** pour écouter la carte), verdicts **et versos** annoncés aux lecteurs d'écran — y compris l'existence d'un exemple à déplier —, hébreu balisé `lang="he"` pour une prononciation correcte, cibles tactiles confortables sur mobile.
- Le verdict se corrige dans les trois modes : **« J'avais juste »** si le correcteur (ou le pouce) t'a joué un tour, **« En fait, je ne savais pas »** si tu as deviné — la progression suit, dans les deux sens. Au clavier : touche **C**.

## Mise à jour automatique

Les cartes ne sont **pas** figées dans l'application. Au chargement, `app.html` lit le carnet [`vocabulaire_hebreu.html`](./vocabulaire_hebreu.html) et en extrait tout le vocabulaire. Il suffit donc de modifier le carnet — ajouter un mot, une catégorie — pour que les flashcards se mettent à jour au prochain rechargement, sans toucher à l'application.

## Fichiers

- `index.html` — le portail : la porte d'entrée à la racine — un accueil plein écran (message de bienvenue en français ou en hébreu au hasard, le א doré de l'icône, deux ménorahs qui éclairent l'écran), puis le choix entre l'application et le carnet
- `app.html` — l'application de flashcards en ligne (reconstruit le vocabulaire depuis le carnet)
- `vocabulaire_hebreu.html` — le carnet de grammaire et vocabulaire (source unique de vérité ; hors connexion, l'hébreu retombe sur David Libre plutôt que sur une police système générique, qui rend mal le nikoud)
- `flashcards_hebreu.html` — version autonome des flashcards, **générée par `build.js`, à ne pas éditer à la main** (vocabulaire intégré au fichier : s'ouvre en double-cliquant, sans serveur ni connexion — seules les polices décoratives viennent du web ; sans connexion l'hébreu s'affiche en police système)
- `build.js` — outil de développement (non déployé) : régénère `flashcards_hebreu.html` depuis le carnet et `app.html`
- `verifie_exemples.js` — outil de développement (non déployé) : contrôle les exemples en situation du carnet (longueur, nikoud, translittération, niveau du vocabulaire) et exige qu'aucun nom, adjectif ou verbe ne reste sans exemple
- `ajoute_mots.js` — outil de développement (non déployé) : générateur de fiche — insère de nouveaux mots dans le carnet depuis un petit fichier JSON (balisage, translittération dérivée, placement et validation automatiques ; simulation par défaut, n'écrit qu'avec `--ecrire` après validation complète)
- `audit_carnet_mecanique.js` — outil de développement (non déployé) : pré-passe mécanique de l'audit du carnet (14 contrôles d'intégrité et de cohérence) et découpe du vocabulaire en tranches de travail dans `audit/` (dossier non versionné, régénérable)
- `cherche_mots.js` — outil de développement (non déployé) : consultation en lecture seule du carnet — `node cherche_mots.js MOT…` répond « ce mot existe-t-il, et où ? » (hébreu ou français), `--stats` montre la répartition par thème et par niveau ; pour vérifier un candidat à moindre coût, sans relire le carnet
- `manifest.webmanifest`, `sw.js`, `icons/` — la couche PWA : manifeste d'installation, service worker hors-ligne, icônes א aux couleurs de la charte
- `graphify-out/` — aide au développement (non déployée, sans effet sur le site) : une cartographie du dépôt qui permet à un assistant de code de retrouver une fonction ou une règle sans relire les gros fichiers. `graph.json` et `GRAPH_REPORT.md` sont versionnés ; le reste se régénère localement

## Modifier le contenu

Pour ajouter ou corriger du vocabulaire, éditer `vocabulaire_hebreu.html` puis remplacer le fichier sur le dépôt (**Add file → Upload files → glisser le fichier → Commit changes**). GitHub Pages redéploie automatiquement en une à deux minutes, à la même adresse ; l'application en ligne se met à jour toute seule.

La version autonome, elle, ne se met pas à jour toute seule : après toute modification du carnet ou d'`app.html`, lancer

    node build.js

qui régénère `flashcards_hebreu.html` et affiche le compte de cartes par section (toute section tombée à zéro fait échouer le build — signe qu'un titre de section ou une table du carnet a été cassé). `node build.js --check` vérifie sans rien écrire.

## Mise en ligne (GitHub Pages)

Dans **Settings → Pages**, choisir la source « Deploy from a branch », branche `main`, dossier `/ (root)`. L'application est alors servie aux adresses ci-dessus. GitHub Pages nécessite un dépôt public (ou un plan GitHub payant pour un dépôt privé).
