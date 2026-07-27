# Plan d'implémentation — la section « Hébreu parlé »

> **Pour les agents :** SOUS-SKILL REQUISE — `superpowers:subagent-driven-development` (recommandé) ou
> `superpowers:executing-plans` pour exécuter tâche par tâche. Les étapes sont en cases à cocher (`- [ ]`).

**But** : ajouter au carnet une 37ᵉ section « Hébreu parlé », 45 entrées de registre familier, chacune avec sa phrase d'usage — le chaînon qui manque entre l'hébreu correct du carnet et une conversation israélienne réelle.

**Architecture** : `data/listes/hebreu-parle.json` (source unique du contenu) + `src/carnet/sections/37-hebreu-parle.html` (gabarit à 4 sous-thèmes) ; le reste n'est que du câblage de constantes dans `tools/build.js` et `src/app/js/07-filtres.js`. Aucun code neuf : la section réutilise les gabarits `word-list` / `subtheme` existants. `node tools/build.js` régénère les cinq artefacts et tamponne `sw.js`.

**Outillage** : Node ≥ 18, zéro dépendance, zéro framework de test. Le cycle rouge/vert de ce dépôt est `node tools/build.js` (gardes structurelles) + `node tools/verifie_exemples.js` (contrôle éditorial) + `node tools/build.js --check` (artefacts en phase + tampon `sw.js`).

**Spec** : docs/superpowers/specs/2026-07-27-hebreu-parle-design.md

## Contraintes globales

Elles s'appliquent à **toutes** les tâches, sans être répétées à chaque fois.

- **Jamais d'édition d'un artefact.** `vocabulaire_hebreu.html`, `cards.json`, `app.html`, `flashcards_hebreu.html`, `index.html` sont générés ; toute retouche à la main est effacée au build suivant et invisible de tout outil. On édite `data/`, `src/`, `tools/`.
- **Le libellé de section est `Hébreu parlé`, à l'octet près**, dans cinq endroits : le champ `section` du JSON, le `span.count` du gabarit, `EXPECTED_CATS`, `listCats`, `catOrder`. Un écart et la section est silencieusement vide.
- **`niveau` obligatoire sur chaque entrée**, dans `{A1, A2, B1, B2}`. Pas de `theme` : les listes sont mono-thème par nature, en poser un est une erreur.
- **Contraintes bloquantes sur chaque exemple** (`tools/verifie_exemples.js`) : `he`/`tr`/`fr` non vides ; **3 à 8 mots** ; **nikoud sur chaque mot** de plus d'une lettre ; `.tr` à distance d'édition **≤ 3** de `he2tr` (au-delà de 1 c'est un avertissement toléré). Tout le contenu de ce plan a été passé au crible avant rédaction : **0 erreur, 1 avertissement** (`yallah` vs `he2tr` « yalelah », qui vient de la valeur autoritaire existante et n'est pas à corriger).
- **Standard de translittération** : `kh` = khaf sans dagesh, `ch` = het, `ts` = tsadi, `'` = ayin partout (initial `'al`, final `rega'`), alef entre deux voyelles `'`, hey final conservé, `ei` pour tsere+youd, jamais `ou`/`ph`/`q`/`w`. `אֵין` s'écrit **`ein`**, pas `eyn`. Les `.tr` sont autoritaires : jamais régénérés depuis `he2tr`.
- **Commits en français**, un par tâche. Le hook `pre-commit` (`.githooks`) lance `--check` et `verifie_exemples.js` : il doit passer sans `--no-verify`. Vérifier une fois par machine : `git config core.hooksPath` doit imprimer `.githooks`.

---

## Structure des fichiers

| Fichier | Responsabilité | Tâche |
| --- | --- | --- |
| `data/listes/hebreu-parle.json` | **créé** — la totalité du contenu, 4 `groupe` | 1, puis étendu en 2, 3, 4 |
| `src/carnet/sections/37-hebreu-parle.html` | **créé** — titre, note, un `h3.subtheme` + un `ul.word-list` par sous-thème | 1, puis étendu en 2, 3, 4 |
| `src/carnet/sections.json` | ordre des sections du carnet | 1 |
| `src/carnet/sections/00-preambule.html` | le lien de sommaire | 1 |
| `tools/build.js` | `EXPECTED_CATS` (garde anti-disparition) + `listCats` (routage section → catégorie de carte) | 1 |
| `src/app/js/07-filtres.js` | `catOrder` — l'ordre des puces de catégorie dans l'app | 1 |
| `data/listes/expressions-divers.json` | **modifié** — trois entrées en partent | 3 et 4 |
| `docs/SPEC_AJOUTE_MOTS.md` | l'énumération des `section` autorisées | 5 |
| `docs/ARCHITECTURE.md`, `docs/TODO.md`, `README.md` | prose + flag graphe | 5 |

---

## Tâche 1 : le câblage et le sous-thème `particules`

Faire exister la section de bout en bout avec sa famille la plus difficile (les particules du discours, celles dont la traduction seule ne veut rien dire). À la fin de la tâche, le carnet a 37 sections, l'app a une puce de plus, et le build est vert.

**Fichiers :**
- Créer : `data/listes/hebreu-parle.json`
- Créer : `src/carnet/sections/37-hebreu-parle.html`
- Modifier : `src/carnet/sections.json` (fin du tableau)
- Modifier : `src/carnet/sections/00-preambule.html` (groupe « Partie 3 · Au quotidien »)
- Modifier : `tools/build.js` (`EXPECTED_CATS`, `listCats`)
- Modifier : `src/app/js/07-filtres.js` (`catOrder`)

**Interfaces :**
- Produit : le libellé de section `Hébreu parlé`, la catégorie de carte `Hébreu parlé`, le slug de fichier `hebreu-parle`, et les 4 slugs de `groupe` — `particules`, `conversation`, `reagir`, `emprunts` — que les tâches 2 à 4 réutilisent tels quels.
- Consomme : rien.

- [ ] **Étape 1 : faire échouer le build (la garde doit prouver qu'elle existe)**

Dans `tools/build.js`, ajouter la catégorie à `EXPECTED_CATS` **et à elle seule** — pas encore à `listCats`, pas encore de données :

```js
const EXPECTED_CATS = ['Verbes','Verbes modaux','Adjectifs','Noms','Pronoms personnels','Démonstratifs',
  'Prépositions','Conjonctions','Mots interrogatifs','Nombres','Jours de la semaine','Adverbes','Saisons & mois',
  'Mots de quantité','Expressions','Existence','Phrases','Hébreu parlé'];
```

- [ ] **Étape 2 : lancer le build et vérifier qu'il échoue en nommant la section**

Commande : `node tools/build.js`
Attendu : **ÉCHEC**, avec un message de `report()` du type « Sections attendues sans aucune carte : Hébreu parlé ». Si le build passe au vert, la garde ne protège rien et il faut comprendre pourquoi avant d'aller plus loin.

- [ ] **Étape 3 : créer le fichier de données avec les 10 particules**

Créer `data/listes/hebreu-parle.json` :

```json
{
  "section": "Hébreu parlé",
  "entries": [
    { "he": "תַּכְלֶ'ס", "tr": "takhles", "fr": "concrètement / au fond, en vrai", "niveau": "B1", "groupe": "particules",
      "note": "de l'hébreu תַּכְלִית par le yiddish ; s'écrit souvent תכל'ס",
      "exemples": [{ "he": "תַּכְלֶ'ס, אֲנִי לֹא רוֹצֶה לָלֶכֶת", "tr": "takhles, ani lo rotseh lalekhet", "fr": "Franchement, je n'ai pas envie d'y aller." }] },

    { "he": "כְּאִילּוּ", "tr": "ke'ilu", "fr": "genre / comme si", "niveau": "B1", "groupe": "particules",
      "note": "tic de langage omniprésent ; sert aussi à rapporter des paroles",
      "exemples": [{ "he": "הוּא כְּאִילּוּ לֹא רוֹאֶה אוֹתִי", "tr": "hu ke'ilu lo ro'eh oti", "fr": "Il fait genre qu'il ne me voit pas." }] },

    { "he": "דַּוְקָא", "tr": "davka", "fr": "justement / au contraire / exprès", "niveau": "B1", "groupe": "particules",
      "note": "renverse l'attente de l'interlocuteur — intraduisible mot à mot",
      "exemples": [{ "he": "דַּוְקָא אָהַבְתִּי אֶת הַסֶּרֶט", "tr": "davka ahavti et haseret", "fr": "En fait si, j'ai bien aimé le film." }] },

    { "he": "סְתָם", "tr": "stam", "fr": "juste comme ça / pour rien", "niveau": "A2", "groupe": "particules",
      "note": "aussi « n'importe quoi » : סְתָם דִּבּוּרִים",
      "exemples": [{ "he": "סְתָם שָׁאַלְתִּי, בְּלִי סִבָּה", "tr": "stam sha'alti, beli sibah", "fr": "Je demandais juste comme ça, sans raison." }] },

    { "he": "בְּעֶצֶם", "tr": "be'etsem", "fr": "en fait, au fond", "niveau": "B1", "groupe": "particules",
      "exemples": [{ "he": "בְּעֶצֶם, אַתָּה צוֹדֵק", "tr": "be'etsem, atah tsodek", "fr": "Au fond, tu as raison." }] },

    { "he": "פָּשׁוּט", "tr": "pashut", "fr": "tout simplement, carrément", "niveau": "A2", "groupe": "particules",
      "note": "emploi adverbial — l'adjectif פָּשׁוּט « simple » est aux Adjectifs",
      "exemples": [{ "he": "פָּשׁוּט שָׁכַחְתִּי אֶת הַמַּפְתֵּחַ", "tr": "pashut shakhachti et hamafteach", "fr": "J'ai tout simplement oublié la clé." }] },

    { "he": "בְּקִיצוּר", "tr": "bekitsur", "fr": "bref", "niveau": "B1", "groupe": "particules",
      "exemples": [{ "he": "בְּקִיצוּר, זֶה לֹא עָבַד", "tr": "bekitsur, zeh lo 'avad", "fr": "Bref, ça n'a pas marché." }] },

    { "he": "בִּכְלָל", "tr": "bikhlal", "fr": "du tout / en général", "niveau": "B1", "groupe": "particules",
      "note": "négatif : « pas du tout » ; positif : « d'ailleurs, en général »",
      "exemples": [{ "he": "לֹא הֵבַנְתִּי בִּכְלָל", "tr": "lo hevanti bikhlal", "fr": "Je n'ai pas compris du tout." }] },

    { "he": "אַגַּב", "tr": "agav", "fr": "au fait, à propos", "niveau": "B1", "groupe": "particules",
      "exemples": [{ "he": "אַגַּב, רָאִיתִי אוֹתוֹ אֶתְמוֹל", "tr": "agav, ra'iti oto etmol", "fr": "Au fait, je l'ai vu hier." }] },

    { "he": "יַחֲסִית", "tr": "yachasit", "fr": "relativement, plutôt", "niveau": "B2", "groupe": "particules",
      "exemples": [{ "he": "זֶה יַחֲסִית זוֹל", "tr": "zeh yachasit zol", "fr": "C'est relativement bon marché." }] }
  ]
}
```

- [ ] **Étape 4 : créer le gabarit de section**

Créer `src/carnet/sections/37-hebreu-parle.html` :

```html
<h2 id="sec-hebreu-parle"><span lang="he">עִבְרִית מְדוּבֶּרֶת</span> <span class="count">Hébreu parlé</span></h2>
<div class="note">Le registre de la rue et des amis — à comprendre partout, à placer avec discernement.</div>
<h3 class="subtheme">Les mots du discours</h3>
<ul class="word-list"><!-- @ENTREES:listes/hebreu-parle#particules --></ul>
```

- [ ] **Étape 5 : déclarer la section dans l'ordre du carnet**

Dans `src/carnet/sections.json`, remplacer la fin du tableau :

```json
  "35-expressions-divers.html",
  "36-phrases.html",
  "37-hebreu-parle.html"
]
```

- [ ] **Étape 6 : ajouter le lien de sommaire**

Dans `src/carnet/sections/00-preambule.html`, dans le groupe `Partie 3 · Au quotidien`, après la ligne du lien « Phrases » :

```html
      <a href="#sec-hebreu-parle"><span class="toc-he" lang="he">עִבְרִית מְדוּבֶּרֶת</span> Hébreu parlé</a>
```

- [ ] **Étape 7 : router la section vers une catégorie de carte**

Dans `tools/build.js`, dans `listCats`, remplacer la dernière ligne de l'objet :

```js
  'Existence et possession':'Existence', 'Phrases':'Phrases', 'Hébreu parlé':'Hébreu parlé' };
```

- [ ] **Étape 8 : donner sa puce à la catégorie dans l'app**

Dans `src/app/js/07-filtres.js`, remplacer la dernière ligne de `catOrder` :

```js
  'Jours de la semaine','Saisons & mois','Adverbes','Mots de quantité','Expressions','Phrases','Hébreu parlé'];
```

Sans cette ligne la catégorie existe dans les cartes mais **aucune puce ne s'affiche** : `buildChips()` n'itère que sur `catOrder`.

- [ ] **Étape 9 : lancer le build et vérifier qu'il passe**

Commande : `node tools/build.js`
Attendu : **succès**, avec « Hébreu parlé » et son décompte **10** dans les comptages imprimés, et le total de cartes augmenté de 10.

- [ ] **Étape 10 : contrôler les exemples**

Commande : `node tools/verifie_exemples.js`
Attendu : **`✓ Exemples conformes`**, **0 erreur**. Des avertissements « mot hors carnet » sont normaux et tolérés (signal éditorial, pas un défaut). Si une **erreur** sort, elle nomme l'entrée et la règle enfreinte — la corriger dans `data/listes/hebreu-parle.json`, jamais dans un artefact. En particulier, sur une erreur de distance `.tr`, corriger le mot hébreu ou reformuler la phrase : ne jamais tordre le standard de translittération pour satisfaire `he2tr`.

- [ ] **Étape 11 : contrôler que les cinq artefacts sont en phase**

Commande : `node tools/build.js --check`
Attendu : **succès** — les cinq artefacts identiques à ce que la source produit, et le `VERSION` de `sw.js` recalculé au bon hash.

- [ ] **Étape 12 : commit**

```bash
git add data/listes/hebreu-parle.json src/carnet/sections/37-hebreu-parle.html \
  src/carnet/sections.json src/carnet/sections/00-preambule.html \
  tools/build.js src/app/js/07-filtres.js \
  vocabulaire_hebreu.html cards.json app.html flashcards_hebreu.html index.html sw.js
git commit -m "Carnet : une 37e section, « Hébreu parlé », ouverte sur les mots du discours

Le carnet enseignait un hébreu correct mais écrit : qui le maîtrisait
entièrement ne comprenait toujours pas une conversation israélienne, faute
des particules qui la portent. La section s'ouvre avec les dix plus dures —
תכלס, כאילו, דווקא, סתם — celles dont la traduction seule ne veut rien dire,
d'où la phrase d'usage attachée à chacune.

Le câblage est manuel de bout en bout : ajoute_mots.js déclare la création de
section hors périmètre. Constantes et données atterrissent ensemble, la garde
EXPECTED_CATS refusant une section attendue à zéro carte — elle a d'ailleurs
été vue échouer avant d'être satisfaite."
```

---

## Tâche 2 : le sous-thème `conversation`

Les treize mots qui ouvrent, relancent, coupent et concluent un échange.

**Fichiers :**
- Modifier : `data/listes/hebreu-parle.json` (entrées ajoutées en fin de tableau `entries`)
- Modifier : `src/carnet/sections/37-hebreu-parle.html` (un `h3` + un `ul` de plus)

**Interfaces :**
- Consomme : le slug de groupe `conversation` et le fichier créés en tâche 1.
- Produit : rien de nouveau pour les tâches suivantes.

- [ ] **Étape 1 : ajouter le placeholder avant les données (il doit échouer)**

Ajouter à la fin de `src/carnet/sections/37-hebreu-parle.html` :

```html
<h3 class="subtheme">Ouvrir, relancer, couper</h3>
<ul class="word-list"><!-- @ENTREES:listes/hebreu-parle#conversation --></ul>
```

- [ ] **Étape 2 : lancer le build et vérifier qu'il échoue**

Commande : `node tools/build.js`
Attendu : **ÉCHEC** — « placeholder @ENTREES:listes/hebreu-parle#conversation ne consomme aucune entrée (garde anti-perte) ». C'est la garde qui prouve qu'un sous-thème vide ne peut pas passer inaperçu.

- [ ] **Étape 3 : ajouter les 13 entrées**

Dans `data/listes/hebreu-parle.json`, à la fin du tableau `entries` (virgule après la dernière entrée existante) :

```json
    { "he": "מָה קוֹרֶה", "tr": "mah koreh", "fr": "quoi de neuf ? / ça roule ?", "niveau": "A2", "groupe": "conversation",
      "note": "plus familier que מָה נִשְׁמָע",
      "exemples": [{ "he": "מָה קוֹרֶה, אָח שֶׁלִּי?", "tr": "mah koreh, ach sheli?", "fr": "Quoi de neuf, mon frère ?" }] },

    { "he": "מָה פִּתְאוֹם", "tr": "mah pit'om", "fr": "et puis quoi encore ! / pas du tout", "niveau": "B1", "groupe": "conversation",
      "exemples": [{ "he": "מָה פִּתְאוֹם? אֲנִי מְשַׁלֵּם", "tr": "mah pit'om? ani meshalem", "fr": "Et puis quoi encore ? C'est moi qui paie." }] },

    { "he": "עֲזֹב", "tr": "'azov", "fr": "laisse tomber", "niveau": "A2", "groupe": "conversation",
      "note": "à une femme : עִזְבִי, 'izvi",
      "exemples": [{ "he": "עֲזֹב, זֶה לֹא חָשׁוּב", "tr": "'azov, zeh lo chashuv", "fr": "Laisse tomber, ce n'est pas important." }] },

    { "he": "דַּי", "tr": "dai", "fr": "ça suffit ! / arrête", "niveau": "A1", "groupe": "conversation",
      "exemples": [{ "he": "דַּי, מַסְפִּיק לְהַיּוֹם", "tr": "dai, maspik lehayom", "fr": "Ça suffit, assez pour aujourd'hui." }] },

    { "he": "נוּ", "tr": "nu", "fr": "alors ? / allez", "niveau": "A1", "groupe": "conversation",
      "note": "presse ou relance — du yiddish",
      "exemples": [{ "he": "נוּ, מָה אָמְרוּ לְךָ?", "tr": "nu, mah amru lekha?", "fr": "Alors, qu'est-ce qu'ils t'ont dit ?" }] },

    { "he": "זֶהוּ", "tr": "zehu", "fr": "voilà, c'est tout", "niveau": "A2", "groupe": "conversation",
      "exemples": [{ "he": "זֶהוּ, סִיַּמְנוּ אֶת הָעֲבוֹדָה", "tr": "zehu, siyamnu et ha'avodah", "fr": "Voilà, on a fini le travail." }] },

    { "he": "לֹא מְשַׁנֶּה", "tr": "lo meshaneh", "fr": "peu importe", "niveau": "A2", "groupe": "conversation",
      "exemples": [{ "he": "לֹא מְשַׁנֶּה, נִפָּגֵשׁ מָחָר", "tr": "lo meshaneh, nipagesh machar", "fr": "Peu importe, on se voit demain." }] },

    { "he": "תֵּכֶף", "tr": "tekhef", "fr": "tout de suite, dans une minute", "niveau": "A2", "groupe": "conversation",
      "exemples": [{ "he": "תֵּכֶף אֲנִי מַגִּיעַ", "tr": "tekhef ani magi'a", "fr": "J'arrive tout de suite." }] },

    { "he": "בְּטַח", "tr": "betach", "fr": "bien sûr, évidemment", "niveau": "A2", "groupe": "conversation",
      "exemples": [{ "he": "בְּטַח שֶׁאֲנִי בָּא", "tr": "betach she'ani ba", "fr": "Bien sûr que je viens." }] },

    { "he": "בֶּאֱמֶת", "tr": "be'emet", "fr": "vraiment ? / sérieusement", "niveau": "A2", "groupe": "conversation",
      "exemples": [{ "he": "בֶּאֱמֶת? לֹא יָדַעְתִּי", "tr": "be'emet? lo yada'ti", "fr": "Vraiment ? Je ne savais pas." }] },

    { "he": "בְּחַיַּי", "tr": "bechayai", "fr": "je te jure", "niveau": "B1", "groupe": "conversation",
      "exemples": [{ "he": "בְּחַיַּי שֶׁלֹּא סִפַּרְתִּי לָהּ", "tr": "bechayai shelo siparti lah", "fr": "Je te jure que je ne lui ai rien dit." }] },

    { "he": "שֶׁיִּהְיֶה", "tr": "sheyihyeh", "fr": "soit / admettons", "niveau": "B2", "groupe": "conversation",
      "note": "concession un peu résignée : « bon, d'accord »",
      "exemples": [{ "he": "אַתָּה לֹא מַסְכִּים? שֶׁיִּהְיֶה", "tr": "atah lo maskim? sheyihyeh", "fr": "Tu n'es pas d'accord ? Soit." }] },

    { "he": "תַּעֲשֶׂה טוֹבָה", "tr": "ta'aseh tovah", "fr": "fais-moi plaisir / arrête un peu", "niveau": "B1", "groupe": "conversation",
      "note": "à une femme : תַּעֲשִׂי טוֹבָה",
      "exemples": [{ "he": "תַּעֲשֶׂה טוֹבָה, תַּפְסִיק כְּבָר", "tr": "ta'aseh tovah, tafsik kvar", "fr": "Fais-moi plaisir, arrête un peu." }] }
```

- [ ] **Étape 4 : rebuild, contrôles, commit**

```bash
node tools/build.js && node tools/verifie_exemples.js && node tools/build.js --check
```

Attendu : « Hébreu parlé » à **23** cartes, `✓ Exemples conformes` avec **0 erreur**, `--check` vert.

```bash
git add data/listes/hebreu-parle.json src/carnet/sections/37-hebreu-parle.html \
  vocabulaire_hebreu.html cards.json app.html flashcards_hebreu.html index.html sw.js
git commit -m "Hébreu parlé : ouvrir, relancer, couper — treize mots de conversation

מה קורה, נו, עזוב, די, זהו, תכף : les mots qui ne portent aucun contenu et
tiennent pourtant tout l'échange. Aucun n'était au carnet.

Le sous-thème a été câblé avant ses données pour voir la garde anti-perte
refuser un placeholder @ENTREES qui ne consomme rien."
```

---

## Tâche 3 : le sous-thème `reagir`

Apprécier et déprécier — quatorze entrées, dont **סַבָּבָּה déplacé** depuis « Expressions / Divers ».

**Fichiers :**
- Modifier : `data/listes/hebreu-parle.json`
- Modifier : `src/carnet/sections/37-hebreu-parle.html`
- Modifier : `data/listes/expressions-divers.json` (suppression de l'entrée סַבָּבָּה)

**Interfaces :**
- Consomme : le slug `reagir`.
- Produit : `expressions-divers.json` descendu à 34 entrées, à ne pas re-compter en tâche 4 sans tenir compte des deux suivantes.

- [ ] **Étape 1 : ajouter le placeholder**

À la fin de `src/carnet/sections/37-hebreu-parle.html` :

```html
<h3 class="subtheme">Apprécier, déprécier</h3>
<ul class="word-list"><!-- @ENTREES:listes/hebreu-parle#reagir --></ul>
```

- [ ] **Étape 2 : vérifier l'échec**

Commande : `node tools/build.js`
Attendu : **ÉCHEC** — « @ENTREES:listes/hebreu-parle#reagir ne consomme aucune entrée ».

- [ ] **Étape 3 : retirer סַבָּבָּה de « Expressions / Divers »**

Dans `data/listes/expressions-divers.json`, supprimer entièrement cet objet (et la virgule qui le sépare de son voisin) :

```json
    {
      "he": "סַבָּבָּה",
      "tr": "sababah",
      "fr": "cool / ça va (familier)",
      "niveau": "B1",
      "exemples": []
    },
```

- [ ] **Étape 4 : ajouter les 14 entrées**

Dans `data/listes/hebreu-parle.json`, à la fin du tableau `entries` :

```json
    { "he": "אַחְלָה", "tr": "achlah", "fr": "super, génial", "niveau": "A2", "groupe": "reagir",
      "note": "de l'arabe ; invariable, se place avant le nom",
      "exemples": [{ "he": "אַחְלָה מִסְעָדָה מָצָאתָ", "tr": "achlah mis'adah matsata", "fr": "Tu as trouvé un super restaurant." }] },

    { "he": "מַגְנִיב", "tr": "magniv", "fr": "cool, top", "niveau": "A2", "groupe": "reagir",
      "exemples": [{ "he": "הַשִּׁיר הַזֶּה מַגְנִיב", "tr": "hashir hazeh magniv", "fr": "Cette chanson est top." }] },

    { "he": "חֲבָל עַל הַזְּמַן", "tr": "chaval 'al hazman", "fr": "incroyable, une tuerie", "niveau": "B1", "groupe": "reagir",
      "note": "littéralement « dommage pour le temps » ; le ton décide du sens, presque toujours élogieux",
      "exemples": [{ "he": "הָאֹכֶל שָׁם חֲבָל עַל הַזְּמַן", "tr": "ha'okhel sham chaval 'al hazman", "fr": "La nourriture là-bas, c'est une tuerie." }] },

    { "he": "עַל הַפָּנִים", "tr": "'al hapanim", "fr": "nul, catastrophique", "niveau": "B1", "groupe": "reagir",
      "exemples": [{ "he": "הַשֵּׁרוּת פֹּה עַל הַפָּנִים", "tr": "hasherut poh 'al hapanim", "fr": "Le service ici est catastrophique." }] },

    { "he": "בָּאסָה", "tr": "basah", "fr": "la loose, quelle déception", "niveau": "A2", "groupe": "reagir",
      "exemples": [{ "he": "אֵיזוֹ בָּאסָה שֶׁלֹּא בָּאתָ", "tr": "eizo basah shelo bata", "fr": "Quelle loose que tu ne sois pas venu." }] },

    { "he": "פַדִיחָה", "tr": "fadichah", "fr": "la honte, le malaise", "niveau": "B1", "groupe": "reagir",
      "exemples": [{ "he": "אֵיזוֹ פַדִיחָה הָיְתָה לִי אֶתְמוֹל", "tr": "eizo fadichah haytah li etmol", "fr": "J'ai eu tellement honte hier." }] },

    { "he": "כָּל הַכָּבוֹד", "tr": "kol hakavod", "fr": "bravo, chapeau", "niveau": "A2", "groupe": "reagir",
      "exemples": [{ "he": "כָּל הַכָּבוֹד, עָבַדְתָּ קָשֶׁה", "tr": "kol hakavod, 'avadta kasheh", "fr": "Bravo, tu as travaillé dur." }] },

    { "he": "אֵין מַצָּב", "tr": "ein matsav", "fr": "pas question ! / c'est pas possible", "niveau": "A2", "groupe": "reagir",
      "exemples": [{ "he": "אֵין מַצָּב שֶׁהוּא אָמַר אֶת זֶה", "tr": "ein matsav shehu amar et zeh", "fr": "Pas possible qu'il ait dit ça." }] },

    { "he": "בְּסֵדֶר גָּמוּר", "tr": "beseder gamur", "fr": "parfait, très bien", "niveau": "A1", "groupe": "reagir",
      "exemples": [{ "he": "בְּסֵדֶר גָּמוּר, נִפָּגֵשׁ בְּשֶׁבַע", "tr": "beseder gamur, nipagesh besheva'", "fr": "Parfait, on se voit à sept heures." }] },

    { "he": "שָׁוֶה", "tr": "shaveh", "fr": "ça vaut le coup", "niveau": "A2", "groupe": "reagir",
      "note": "emploi familier — l'adjectif שָׁוֶה « égal » est aux Adjectifs",
      "exemples": [{ "he": "הַמְּחִיר יָקָר אֲבָל זֶה שָׁוֶה", "tr": "hamechir yakar aval zeh shaveh", "fr": "Le prix est cher mais ça vaut le coup." }] },

    { "he": "לֹא נוֹרָא", "tr": "lo nora", "fr": "ce n'est pas grave", "niveau": "A2", "groupe": "reagir",
      "exemples": [{ "he": "אִחַרְתָּ? לֹא נוֹרָא", "tr": "icharta? lo nora", "fr": "Tu es en retard ? Ce n'est pas grave." }] },

    { "he": "אֵיזֶה קֶטַע", "tr": "eizeh keta'", "fr": "c'est dingue / quel truc", "niveau": "B1", "groupe": "reagir",
      "exemples": [{ "he": "אֵיזֶה קֶטַע, פָּגַשְׁתִּי אוֹתוֹ שׁוּב", "tr": "eizeh keta', pagashti oto shuv", "fr": "C'est dingue, je suis retombé sur lui." }] },

    { "he": "עַל הַכֵּיפַק", "tr": "'al hakeifak", "fr": "au poil, nickel", "niveau": "B2", "groupe": "reagir",
      "note": "de l'arabe kayf ; se dit d'un moment réussi",
      "exemples": [{ "he": "הַחֻפְשָׁה הָיְתָה עַל הַכֵּיפַק", "tr": "hachufshah haytah 'al hakeifak", "fr": "Les vacances étaient au poil." }] },

    { "he": "סַבָּבָּה", "tr": "sababah", "fr": "cool / ça va (familier)", "niveau": "B1", "groupe": "reagir",
      "exemples": [{ "he": "הַכֹּל סַבָּבָּה, אַל תִּדְאַג", "tr": "hakol sababah, al tid'ag", "fr": "Tout va bien, ne t'inquiète pas." }] }
```

- [ ] **Étape 5 : rebuild, contrôles, commit**

```bash
node tools/build.js && node tools/verifie_exemples.js && node tools/build.js --check
```

Attendu : « Hébreu parlé » à **37** cartes, « Expressions » descendu de 1 carte, `0 erreur`, `--check` vert. Le total général de cartes ne bouge que de +13 : סַבָּבָּה est déplacé, pas dupliqué.

```bash
git add data/listes/hebreu-parle.json data/listes/expressions-divers.json \
  src/carnet/sections/37-hebreu-parle.html \
  vocabulaire_hebreu.html cards.json app.html flashcards_hebreu.html index.html sw.js
git commit -m "Hébreu parlé : apprécier et déprécier — et סבבה rejoint sa vraie place

אחלה, מגניב, חבל על הזמן, על הפנים, באסה, פדיחה : l'axe sur lequel un
Israélien juge à peu près tout. סבבה quitte « Expressions / Divers », où le
registre familier se perdait au milieu des politesses, et gagne au passage la
phrase d'usage qui lui manquait — déplacé, jamais dupliqué."
```

---

## Tâche 4 : le sous-thème `emprunts`

Huit entrées, dont **יָאלְלָה et וַאלָה déplacés**. ⚠️ Le `fr` de וַאלָה renvoie explicitement à « יָאלְלָה **ci-dessus** » : יָאלְלָה doit rester **avant** וַאלָה dans le tableau, sinon la glose ment.

**Fichiers :**
- Modifier : `data/listes/hebreu-parle.json`
- Modifier : `src/carnet/sections/37-hebreu-parle.html`
- Modifier : `data/listes/expressions-divers.json` (suppression de יָאלְלָה et וַאלָה)

**Interfaces :**
- Consomme : le slug `emprunts`.
- Produit : la liste complète — 45 entrées, `expressions-divers.json` à 32.

- [ ] **Étape 1 : ajouter le placeholder**

À la fin de `src/carnet/sections/37-hebreu-parle.html` :

```html
<h3 class="subtheme">Emprunts installés</h3>
<ul class="word-list"><!-- @ENTREES:listes/hebreu-parle#emprunts --></ul>
```

- [ ] **Étape 2 : vérifier l'échec**

Commande : `node tools/build.js`
Attendu : **ÉCHEC** — « @ENTREES:listes/hebreu-parle#emprunts ne consomme aucune entrée ».

- [ ] **Étape 3 : retirer יָאלְלָה et וַאלָה de « Expressions / Divers »**

Dans `data/listes/expressions-divers.json`, supprimer ces deux objets :

```json
    {
      "he": "יָאלְלָה",
      "tr": "yallah",
      "fr": "allez / on y va (familier)",
      "niveau": "B1",
      "exemples": []
    },
```

```json
    {
      "he": "וַאלָה",
      "tr": "valah",
      "fr": "vraiment ?! (étonnement — à ne pas confondre avec יָאלְלָה ci-dessus, qui veut dire \"allez\")",
      "niveau": "B2",
      "exemples": []
    },
```

- [ ] **Étape 4 : ajouter les 8 entrées, יָאלְלָה avant וַאלָה**

Dans `data/listes/hebreu-parle.json`, à la fin du tableau `entries` :

```json
    { "he": "יָאלְלָה", "tr": "yallah", "fr": "allez / on y va (familier)", "niveau": "B1", "groupe": "emprunts",
      "exemples": [{ "he": "יָאלְלָה, אֲנַחְנוּ מְאַחֲרִים", "tr": "yallah, anachnu me'acharim", "fr": "Allez, on est en retard." }] },

    { "he": "וַאלָה", "tr": "valah", "fr": "vraiment ?! (étonnement — à ne pas confondre avec יָאלְלָה ci-dessus, qui veut dire \"allez\")", "niveau": "B2", "groupe": "emprunts",
      "fr_court": "vraiment ?! (étonnement)",
      "exemples": [{ "he": "וַאלָה? לֹא הֶאֱמַנְתִּי", "tr": "valah? lo he'emanti", "fr": "Sérieux ? Je n'y croyais pas." }] },

    { "he": "כַּפָּרָה", "tr": "kaparah", "fr": "mon chou, mon trésor", "niveau": "B2", "groupe": "emprunts",
      "note": "affectueux ; souvent כַּפָּרָה עָלֶיךָ",
      "exemples": [{ "he": "תּוֹדָה, כַּפָּרָה עָלֶיךָ", "tr": "todah, kaparah 'alekha", "fr": "Merci, tu es un amour." }] },

    { "he": "נְשָׁמָה", "tr": "neshamah", "fr": "mon cœur, mon âme (affectueux)", "niveau": "B1", "groupe": "emprunts",
      "fr_court": "mon cœur (affectueux)",
      "exemples": [{ "he": "בּוֹאִי, נְשָׁמָה, נֵלֵךְ הַבַּיְתָה", "tr": "bo'i, neshamah, nelekh habaytah", "fr": "Viens, mon cœur, on rentre." }] },

    { "he": "יָא חַבִּיבִּי", "tr": "ya chabibi", "fr": "eh mon vieux, mon pote", "niveau": "B2", "groupe": "emprunts",
      "exemples": [{ "he": "יָא חַבִּיבִּי, אֵיזֶה יוֹם", "tr": "ya chabibi, eizeh yom", "fr": "Eh mon vieux, quelle journée !" }] },

    { "he": "סוֹף הַדֶּרֶךְ", "tr": "sof haderekh", "fr": "le top du top", "niveau": "B1", "groupe": "emprunts",
      "exemples": [{ "he": "הַהוֹפָעָה הָיְתָה סוֹף הַדֶּרֶךְ", "tr": "hahofa'ah haytah sof haderekh", "fr": "Le concert était le top du top." }] },

    { "he": "חָלָס", "tr": "chalas", "fr": "ça suffit, terminé", "niveau": "B1", "groupe": "emprunts",
      "note": "de l'arabe ; plus sec que דַּי",
      "exemples": [{ "he": "חָלָס עִם הַוִּיכּוּחִים", "tr": "chalas 'im havikuchim", "fr": "Ça suffit avec les disputes." }] },

    { "he": "מַבְסוּט", "tr": "mabsut", "fr": "content, satisfait", "niveau": "B2", "groupe": "emprunts",
      "exemples": [{ "he": "הוּא יָצָא מַבְסוּט מֵהַפְּגִישָׁה", "tr": "hu yatsa mabsut mehapgishah", "fr": "Il est sorti content du rendez-vous." }] }
```

- [ ] **Étape 5 : rebuild, contrôles, commit**

```bash
node tools/build.js && node tools/verifie_exemples.js && node tools/build.js --check
```

Attendu : « Hébreu parlé » à **45** cartes, « Expressions » descendu de 3 au total depuis le début, `0 erreur`. Un unique avertissement attendu sur l'exemple de יָאלְלָה (`.tr` « yallah… » à distance 2 de `he2tr` « yalelah… ») : il vient de la valeur autoritaire existante, **il ne faut pas le corriger**.

```bash
git add data/listes/hebreu-parle.json data/listes/expressions-divers.json \
  src/carnet/sections/37-hebreu-parle.html \
  vocabulaire_hebreu.html cards.json app.html flashcards_hebreu.html index.html sw.js
git commit -m "Hébreu parlé : les emprunts installés — la section est complète à 45 entrées

כפרה, נשמה, יא חביבי, סוף הדרך, חלאס, מבסוט : l'arabe et le yiddish que
l'hébreu courant a digérés. יאללה et ואלה les rejoignent depuis
« Expressions / Divers » — dans cet ordre, la glose de ואלה renvoyant à
יאללה « ci-dessus »."
```

---

## Tâche 5 : la documentation et le flag de graphe

Le rituel du dépôt ne s'arrête pas au vert : la prose et la dette de graphe font partie du chantier.

**Fichiers :**
- Modifier : `docs/SPEC_AJOUTE_MOTS.md` (§ 3.5, l'énumération des `section`)
- Modifier : `docs/ARCHITECTURE.md` (le décompte des sections du carnet)
- Modifier : `docs/TODO.md` (« Reprendre ici » + le flag graphe)
- Modifier : `README.md` (si le contenu du carnet y est décrit)

**Interfaces :**
- Consomme : la section complète des tâches 1 à 4.
- Produit : rien de technique.

- [ ] **Étape 1 : ouvrir la section « Hébreu parlé » à `ajoute_mots.js`**

Dans `docs/SPEC_AJOUTE_MOTS.md` § 3.5, ajouter le label à l'énumération des `section` autorisées, après `Phrases`, et noter que cette section porte des `groupe` — donc que `sous_theme` y est **requis** (valeurs : `particules`, `conversation`, `reagir`, `emprunts`). Cette contrainte est dérivée mécaniquement de la donnée par le script, il n'y a rien à câbler.

- [ ] **Étape 2 : mettre la prose à jour**

Repérer d'abord les passages à toucher **par commande**, sans relire les fichiers en entier (ce sont tous des fichiers > 30 Ko) :

```bash
grep -n "36 sections\|36-phrases\|Expressions / Divers" docs/ARCHITECTURE.md README.md docs/TODO.md
```

Puis n'ouvrir que ±30 lignes autour de chaque résultat et corriger : le carnet compte désormais **37 sections**, et « Hébreu parlé » est la dernière de *Partie 3 · Au quotidien*.

- [ ] **Étape 3 : poser le flag de graphe et « Reprendre ici »**

Dans `docs/TODO.md`, section « Reprendre ici », ajouter :

```markdown
⚠️ GRAPHE À RECALER — 2026-07-27 : data/listes/hebreu-parle.json, src/carnet/sections/37-hebreu-parle.html (créés)
```

Le flag **enregistre la dette, il ne déclenche rien** : `/graphify . --update` coûte ~235k tokens et ne se lance que sur décision explicite.

- [ ] **Étape 4 : commit et push**

```bash
git add docs/SPEC_AJOUTE_MOTS.md docs/ARCHITECTURE.md docs/TODO.md README.md
git commit -m "Doc : « Hébreu parlé » ouverte à ajoute_mots.js, et la dette de graphe consignée

La section porte des groupe, donc sous_theme y devient requis — le script le
déduit seul de la donnée, la spec ne fait que le dire. Deux fichiers créés :
le flag de recalage est posé, sans recalage (il enregistre la dette, il ne
déclenche rien)."
git push origin main
```

---

## Auto-relecture

**Couverture de la spec** — les sept points de câblage sont en tâche 1 sauf `SPEC_AJOUTE_MOTS.md` (tâche 5, avec le reste de la prose) ; les quatre familles sont en tâches 1 à 4 ; les trois déplacements en tâches 3 et 4 ; les trois preuves (`build`, `verifie_exemples`, `--check`) à chaque tâche ; le flag graphe en tâche 5 ; l'absence de WebKit est justifiée dans la spec et aucune tâche n'en demande.

**Écart assumé avec la spec** — l'inventaire de la spec listait אֵין בְּעָיָה et מָה נִשְׁמָע : le crible multi-mots (que `cherche_mots.js` ne sait pas faire) les a trouvés **déjà présents** dans `expressions-divers.json`, et אֵין בְּעָיָה l'est même deux fois, aussi dans `phrases.json`. Tous deux sont donc écartés, comme רֶגַע et בָּרוּר, par la règle « une entrée n'est créée que si le sens parlé est réellement distinct ». Deux entrées les remplacent, אֵיזֶה קֶטַע et עַל הַכֵּיפַק, et le total reste 45. La spec a été corrigée en conséquence.

**Types et libellés** — le libellé `Hébreu parlé`, le slug de fichier `hebreu-parle`, l'ancre `sec-hebreu-parle` et les quatre `groupe` (`particules`, `conversation`, `reagir`, `emprunts`) sont identiques partout où ils apparaissent dans ce plan.

**Pré-vérification du contenu** — les 45 entrées et leurs 45 exemples ont été passés aux quatre gardes bloquantes de `verifie_exemples.js` (champs, 3–8 mots, nikoud, distance `.tr`/`he2tr`) avant rédaction du plan : **0 erreur, 1 avertissement**, celui de יָאלְלָה, documenté en tâche 4 comme à ne pas corriger.
