# Flashcards Hébreu

Apprentissage de l'hébreu moderne en français : un carnet de grammaire et de
vocabulaire, une application de flashcards, et un lexique imprimable.
Tout s'ouvre dans un navigateur, sans installation ni téléchargement.

## Adresses

| | |
| --- | --- |
| Portail | <https://rubischtgadol.github.io/flashcards-hebreu/> |
| Flashcards | <https://rubischtgadol.github.io/flashcards-hebreu/app.html> |
| Carnet | <https://rubischtgadol.github.io/flashcards-hebreu/vocabulaire_hebreu.html> |
| Lexique PDF | <https://rubischtgadol.github.io/flashcards-hebreu/lexique.pdf> |

Ces adresses ne changent pas. Chaque page mène aux autres.

## Le carnet

Sommaire cliquable, recherche instantanée en français, en hébreu (avec ou sans
nikoud, graphie pleine ou défective) et en translittération.

**Partie 1 — Lire et conjuguer.** Les signes du nikoud un par un, avec leur nom,
leur prononciation et un exemple ; le shva, les chatafs des gutturales, le
qamats katan, le dagesh et ses trois rôles, le point du shin, le patach furtif.
Puis pronoms, démonstratifs, racine, les sept binyanim, passé, futur, patrons de
conjugaison, hitpa'el et sa métathèse, article défini, état construit,
prépositions fléchies, hé directionnel, existence et possession, négation,
subordination par שֶׁ־ et כְּשֶׁ־.

**Partie 2 — Vocabulaire.** Noms, adjectifs et verbes, groupés par thèmes.

**Partie 3 — Mots-outils et expressions.** Prépositions, conjonctions, mots
interrogatifs, nombres, jours de la semaine, mots de quantité, adverbes,
pronoms réfléchis, expressions courantes, phrases du quotidien, abréviations et
sigles (צה"ל, עו"ד, וכו') avec leurs trois façons de se lire, hébreu parlé
(תַּכְלֶס, כְּאִילוּ, סַבָּבָּה) et hébreu biblique en section séparée.

Chaque mot porte son nikoud, sa translittération, sa traduction et une ligne en
écriture cursive. Chaque nom, adjectif et verbe porte une phrase d'exemple, les
verbes conjugués au présent.

Tout l'hébreu est balisé `lang="he"`, y compris au fil d'une phrase française.

## Les flashcards

Trois modes, dans les deux sens (hébreu → français, français → hébreu) :

- **Cartes** recto-verso avec auto-évaluation, et annulation de la dernière
  réponse.
- **Saisie** au clavier. Les réponses en hébreu sont acceptées en
  translittération ou en caractères hébreux ; un clavier hébreu virtuel
  (disposition israélienne) se déplie sur ordinateur. Une réponse à une faute
  près est comptée juste et la forme exacte s'affiche.
- **QCM** à quatre choix. Les distracteurs viennent du même thème que le mot
  interrogé ; jamais deux quasi-synonymes parmi les options.

Réglages :

- **Niveaux** — chaque mot est classé sur l'échelle CECRL, repliée en paliers de
  difficulté.
- **Thèmes** — famille et personnes, corps et santé, nourriture et repas, maison
  et objets, vêtements et couleurs, ville, lieux et transports, nature et
  animaux, temps et calendrier, travail et études, vie quotidienne, argent et
  achats, loisirs et culture, parler et penser, émotions et caractère, notions
  abstraites. Niveaux, thèmes et catégories se croisent.
- **Révision du jour** — répétition espacée par système de Leitner. Chaque
  réponse fait monter ou descendre la carte ; les cartes échues forment une
  session à part, sans filtre de niveau ni de thème. La progression est
  enregistrée dans le navigateur.
- **Longueur de session** — de quelques cartes au paquet entier.
- **Écriture** — hébreu avec nikoud, sans nikoud, ou cursive.
- **Audio** — voix hébraïque du système, au clic ou à chaque carte. Le réglage
  nomme la voix retenue, et se désactive faute de voix hébraïque installée.
- **Exemples** — dépliables une fois la réponse visible, avec lecture audio.

En fin de session, le bilan liste les cartes ratées et permet de les rejouer.
Les réglages, la session en cours et la progression sont restaurés d'une visite
à l'autre. Une action de remise à zéro efface le profil local après
confirmation.

Navigation complète au clavier dans les trois modes : **P** pour écouter,
**C** pour corriger le verdict, **1**–**4** en QCM, Entrée pour valider.
Verdicts et versos sont annoncés aux lecteurs d'écran.

## Le lexique imprimable

`lexique.pdf` — le vocabulaire en deux colonnes sur A4, classé dans l'ordre
alphabétique hébreu, sans translittération. Chaque entrée porte sa vedette
vocalisée et, entre parenthèses, le pluriel d'un nom, le féminin d'un adjectif
ou les deux formes du présent d'un verbe. Les verbes portent en plus leur
binyan, leur racine et la préposition qu'ils régissent, en code couleur ; les
adjectifs, la préposition qu'ils régissent quand ils en imposent une.

## Translittération

| Lettre | Graphie | Exemple |
| --- | --- | --- |
| כ khaf sans daguech | `kh` | *shelkha* (שֶׁלְּךָ) |
| ח het | `ch` | *anachnu*, *koach* |
| צ tsadi | `ts` | *ratsim* |
| ע ayin, à toute position | `'` | *'ivrit*, *be'er*, *yode'a* |
| א alef entre deux voyelles | `'` | *tsme'ah* |
| ה hé final | `h` conservé | *atah*, *zeh*, *morah* |
| tsere ou segol + yud | `ei` | *beit sefer* |

Le shva initial d'un groupe de consonnes s'écrit lorsqu'il s'entend : *gdolim*,
*dvarim*, mais *ledaber*. En mode saisie, les variantes `ch`/`kh`, `ts`/`tz`,
`ou`/`u` et l'apostrophe facultative sont toutes acceptées.

## Hors ligne

L'application est une PWA installable. Sur iPhone : ouvrir un lien dans Safari,
Partager, « Sur l'écran d'accueil ». Elle s'ouvre en plein écran et fonctionne
sans réseau ; les mises à jour sont récupérées en arrière-plan et visibles au
lancement suivant.

`flashcards_hebreu.html` est une version autonome : vocabulaire intégré au
fichier, s'ouvre en double-cliquant, sans serveur ni connexion.

---

La documentation technique est dans `docs/`.
