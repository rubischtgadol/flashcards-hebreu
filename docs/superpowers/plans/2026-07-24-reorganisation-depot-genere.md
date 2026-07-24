# Plan d'implémentation — Réorganisation « le dépôt généré »

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Objectif :** migrer la source de vérité du vocabulaire vers `data/*.json`, rendre le carnet entièrement généré, supprimer le double extracteur, découper `app.html` en modules et ranger le dépôt — en 4 chantiers iso-fonctionnels (un par session), le site restant déployable après chaque commit.

**Architecture :** `data/*.json + src/**` → `tools/build.js` → les 5 artefacts committés à la racine (URLs GitHub Pages inchangées). Spec de référence : `docs/superpowers/specs/2026-07-24-reorganisation-depot-genere-design.md` — ses 5 principes directeurs arbitrent chaque découpage.

**Outillage :** Node pur zéro dépendance pour tout ce qui est committé. jsdom et Playwright+WebKit (iPhone 16 Pro émulé) existent déjà comme outillage WSL hors dépôt (TODO.md § Outillage) — contrôles uniquement, via sous-agents Sonnet.

## Contraintes globales

- **Zéro dépendance committée** : pas de package.json, pas de npm. jsdom/WebKit = outillage de contrôle hors dépôt, jamais requis par le build.
- **Iso-fonctionnel strict** : mêmes URLs, même rendu, mêmes 1 220 cartes, même comportement PWA. Toute divergence visuelle ou de comptage est un échec du task en cours.
- **Les `.tr` du carnet sont autoritaires** : copiés tels quels vers le JSON, jamais régénérés par `he2tr`.
- **`lang="he"` sur chaque nœud hébreu** : posé par les gabarits, vérifié par comptage navigateur (jsdom, scripts exécutés — le carnet génère des `span.cursive` au chargement, le compte se mesure, ne se calcule pas).
- **Un chantier = une session**, `/clear` entre deux. Chaque task se termine par un commit (message en français, `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`).
- **`sw.js`** : bump `VERSION` à chaque chantier qui modifie un artefact déployé (C1 → `v31`, C2 → `v32`, C3 → `v33`, C4 → estampillage automatique).
- **Économie de tokens (CLAUDE.md)** : jamais de lecture > 30 KB sans `offset/limit` ; tout run WebKit/jsdom volumineux passe par un sous-agent Sonnet avec critères chiffrés dans le prompt (« PASS/FAIL par item, max N lignes, ni screenshot ni HTML dans la réponse ») ; `graphify explain <fonction>` pour localiser du code, jamais de lecture exploratoire d'`app.html`.
- **Régime d'exécution — le fil principal n'implémente pas** : chaque task est exécuté par un **sous-agent `model: 'sonnet'`** (règle du propriétaire, 22/07 : le mécanique → Sonnet ; tout ce plan est mécanique, les arbitrages de fond sont déjà pris dans la spec). Le prompt du sous-agent contient le texte intégral de SON task (steps, code, gates — il ne lit pas le plan entier) + le rappel « demande au graphe avant d'ouvrir un fichier » + les contraintes globales utiles. Le fil principal (modèle de la session) ne garde que : dispatch, lecture des verdicts (jamais des transcripts/logs/diffs bruts — un `git diff --stat` au plus), arbitrage en cas de FAIL, et les commits si le sous-agent ne les a pas faits. Réutiliser un sous-agent fini pour les questions de suivi dans son périmètre au lieu d'en payer un neuf.
- **Le graphe n'est jamais rafraîchi pendant ces chantiers** — flag seulement (Task 20).
- **Fin de chaque chantier** : mise à jour de TODO.md « Reprendre ici » (état + prochain task), puis push sur `main`.

## Faits d'ancrage (mesurés le 24/07, à re-vérifier d'un grep si un doute surgit)

- Carnet : 10 950 lignes, 37 sections `<h2>` (liste complète : `grep -n '<h2' vocabulaire_hebreu.html`). 1 220 cartes, `sw.js` en `v30`.
- `build.js` exporte déjà tout le nécessaire à l'extraction (l. 521) : `extractCards, NOTEBOOK, APP, parseSections, closeOf, lisOf, exemplesOf, firstSpanText, attrOf, tdsOf, stripNikud, decodeEntities, orthographeVoisine, EXPECTED_CATS, EXPECTED_LEVELS, EXPECTED_THEMES, THEMED_CATS, listCats` — et `if (require.main === module) main();` protège l'import.
- Tables : Verbes = `Infinitif|MS|FS|MP|FP` (formes étiquetées `['il','elle','ils','elles']` dans `extractCards`), Adjectifs = `MS|FS|MP|FP`, Noms = `Singulier|Genre|Pluriel`. Les trois portent `data-niveau` + `data-theme` par `<tr>`, des sous-thèmes `<h3 class="subtheme">`, et la cellule vedette est `<span class="he" lang="he">…</span><span class="fr">…</span>` + `<ul class="exemples">`.
- Listes : `<li data-niveau="…"><span class="word-main"><span class="he" lang="he">…</span></span><span class="meta"><span class="tr">…</span><span class="fr">…</span></span>` + exemples ; 7 occurrences de `data-fr-court`.
- Coutures `app.html` : `extractCards` l. 2317, `fetch('./vocabulaire_hebreu.html')` l. 2440 dans `init()` (l. 2435). 87 fonctions top-level (inventaire : `grep -n "^function \|^async function " app.html`).
- `sw.js` : `VERSION` l. 59, `ASSETS` l. 62–70 (ne contient pas encore `cards.json`).

---

## CHANTIER 1 — Extraction : le carnet devient généré (session 1)

À la fin : `data/` et `src/carnet/` existent, `vocabulaire_hebreu.html` est un artefact régénérable prouvé équivalent, `build.js` et `app.html` n'ont **pas** bougé (ils scrapent le carnet généré exactement comme avant).

### Task 1 : Schéma des données + validateur

**Files:**
- Create: `data/SCHEMA.md`
- Create: `outils_migration/valide_donnees.js`

**Interfaces:**
- Produces: `valideDonnees(donnees)` → jette `Error` au premier manquement, message nommant fichier + entrée ; `chargeDonnees(racine)` → `{noms, adjectifs, verbes, listes: {slug: {section, entries}}}`. Consommé par les Tasks 2, 4, 5 puis par `build.js` v2 (Task 7).

- [ ] **Step 1 : écrire `data/SCHEMA.md`** — le contrat, en français :

```markdown
# Schéma des données (source de vérité du vocabulaire)

Ordre des entrées = ordre d'affichage dans le carnet. Champs `tr` : copiés du
carnet, autoritaires, jamais régénérés par he2tr. `he` garde la vocalisation.

## data/noms.json — [{ he, fr, genre: "m"|"f", pluriel: {he, tr}|null,
     niveau, theme, groupe, exemples: [{he, tr, fr}], note? }]
## data/adjectifs.json — idem noms, sans genre/pluriel, avec
     formes: [{he, tr}] ×3 (FS, MP, FP)
## data/verbes.json — idem, formes ×4 (MS, FS, MP, FP), exemple présent requis
## data/listes/<slug>.json — { section: "<label exact du span.count>",
     entries: [{ he, tr, fr, fr_court?, niveau, exemples: [...], note? }] }

`groupe` = slug du <h3 class="subtheme"> englobant (tables uniquement).
Contraintes bloquantes : niveau ∈ {A1,A2,B1,B2} partout ; theme ∈ EXPECTED_THEMES
(build.js) pour noms/adjectifs/verbes ; ≥1 exemple pour noms/adjectifs/verbes ;
aucune section vide ; he/fr non vides.
```

- [ ] **Step 2 : écrire `outils_migration/valide_donnees.js`** :

```js
'use strict';
const fs = require('fs'), path = require('path');
const { EXPECTED_LEVELS, EXPECTED_THEMES } = require('../build.js');

function chargeDonnees(racine){
  const d = (f) => JSON.parse(fs.readFileSync(path.join(racine, 'data', f), 'utf8'));
  const listes = {};
  for (const f of fs.readdirSync(path.join(racine, 'data', 'listes')).sort())
    listes[f.replace(/\.json$/, '')] = d(path.join('listes', f));
  return { noms: d('noms.json'), adjectifs: d('adjectifs.json'), verbes: d('verbes.json'), listes };
}

function valideDonnees(donnees){
  const echec = (ou, e, msg) => { throw new Error(`${ou} — « ${e.he || '?'} / ${e.fr || '?'} » : ${msg}`); };
  const commun = (ou, e, theme) => {
    if (!e.he || !e.fr) echec(ou, e, 'he/fr manquant');
    if (!EXPECTED_LEVELS.includes(e.niveau)) echec(ou, e, `niveau « ${e.niveau} » invalide`);
    if (theme && !EXPECTED_THEMES.includes(e.theme)) echec(ou, e, `theme « ${e.theme} » invalide`);
    if (theme && !(e.exemples || []).length) echec(ou, e, 'aucun exemple');
    (e.exemples || []).forEach(x => { if (!x.he || !x.tr || !x.fr) echec(ou, e, 'exemple incomplet'); });
  };
  donnees.noms.forEach(e => { commun('noms', e, true);
    if (!['m','f'].includes(e.genre)) echec('noms', e, `genre « ${e.genre} »`); });
  donnees.adjectifs.forEach(e => { commun('adjectifs', e, true);
    if ((e.formes || []).length !== 3) echec('adjectifs', e, 'formes ≠ 3'); });
  donnees.verbes.forEach(e => { commun('verbes', e, true);
    if ((e.formes || []).length !== 4) echec('verbes', e, 'formes ≠ 4'); });
  for (const [slug, l] of Object.entries(donnees.listes)){
    if (!l.entries.length) throw new Error(`listes/${slug} : section vide`);
    l.entries.forEach(e => commun(`listes/${slug}`, e, false));
  }
  return true;
}
module.exports = { chargeDonnees, valideDonnees };
```

- [ ] **Step 3 : vérifier que le validateur échoue proprement à vide** — `node -e "require('./outils_migration/valide_donnees.js').chargeDonnees('.')"` → attendu : `ENOENT … data/noms.json` (le harnais est en place avant les données : c'est le cycle rouge).
- [ ] **Step 4 : commit** — `git add data/SCHEMA.md outils_migration/valide_donnees.js && git commit` : « Chantier 1 : schéma des données et validateur (harnais avant extraction) ».

### Task 2 : Extraction des données (`extrait_donnees.js`)

**Files:**
- Create: `outils_migration/extrait_donnees.js`
- Create (générés) : `data/noms.json`, `data/adjectifs.json`, `data/verbes.json`, `data/listes/*.json`

**Interfaces:**
- Consumes: exports de `build.js` (`parseSections`, `tdsOf`, `firstSpanText`, `exemplesOf`, `attrOf`, `lisOf`, `listCats`, `NOTEBOOK`) et `valide_donnees.js`.
- Produces: les fichiers `data/` conformes à `data/SCHEMA.md`, en ordre document.

- [ ] **Step 1 : écrire le script.** Ossature complète (le cœur ; les trois variantes de table suivent le même motif) :

```js
'use strict';
const fs = require('fs'), path = require('path');
const B = require('../build.js');
const html = fs.readFileSync(B.NOTEBOOK, 'utf8');
const sections = B.parseSections(html);

// rowsOf n'est pas exporté : réimplémentation locale (script jetable),
// même regex que build.js — <tr> du tbody de la section, dans l'ordre.
function rowsOf(sec){ const m = []; const re = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/g;
  let r; while ((r = re.exec(sec))) if (/data-niveau=/.test(r[1])) m.push(r[0]); return m; }
// groupe = dernier <h3 class="subtheme"> avant la ligne (slugifié)
function slug(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function groupesOf(sec){ // [{groupe, corps}] découpé aux <h3 class="subtheme">
  const parts = sec.split(/<h3 class="subtheme">([\s\S]*?)<\/h3>/);
  const out = [{ groupe: '', corps: parts[0] }];
  for (let i = 1; i < parts.length; i += 2)
    out.push({ groupe: slug(B.decodeEntities(parts[i].replace(/<[^>]*>/g,''))), corps: parts[i+1] });
  return out;
}
function exemples(td){ return B.exemplesOf(td).map(x => ({ he: x.he, tr: x.tr, fr: x.fr })); }
function celluleVedette(td){ return { he: B.firstSpanText(td, 'he'), fr: B.firstSpanText(td, 'fr') }; }
function heTr(td){ const he = B.firstSpanText(td, 'he');
  return he ? { he, tr: B.firstSpanText(td, 'tr') } : null; }

function extraisTable(nom, mappe){ const out = [];
  for (const g of groupesOf(sections[nom]))
    for (const tr of rowsOf(g.corps)){
      const tds = B.tdsOf(tr);
      const e = mappe(tds, tr);
      e.niveau = B.attrOf(tr, 'data-niveau'); e.theme = B.attrOf(tr, 'data-theme');
      e.groupe = g.groupe; e.exemples = exemples(tds[0]);
      out.push(e);
    }
  return out; }

const noms = extraisTable('Noms', (tds) => ({ ...celluleVedette(tds[0]),
  genre: tds[1].replace(/<[^>]*>/g,'').trim(), pluriel: heTr(tds[2]) }));
const adjectifs = extraisTable('Adjectifs', (tds) => ({ ...celluleVedette(tds[0]),
  formes: [heTr(tds[1]), heTr(tds[2]), heTr(tds[3])] }));
const verbes = extraisTable('Verbes', (tds) => ({ ...celluleVedette(tds[0]),
  formes: [1,2,3,4].map(i => heTr(tds[i])) }));

const listes = {};
for (const label of Object.keys(B.listCats)){
  const entries = B.lisOf(sections, label).map(li => {
    const e = { he: B.firstSpanText(li, 'he'), tr: B.firstSpanText(li, 'tr'),
      fr: B.firstSpanText(li, 'fr'), niveau: B.attrOf(li, 'data-niveau'),
      exemples: B.exemplesOf(li).map(x => ({ he: x.he, tr: x.tr, fr: x.fr })) };
    const court = B.attrOf(li, 'data-fr-court'); if (court) e.fr_court = court;
    return e; });
  listes[slug(label)] = { section: label, entries };
}
// écriture : JSON.stringify(v, null, 2), un fichier par table + data/listes/<slug>.json
```

⚠️ Trois points à caler pendant l'exécution, avec `graphify explain "extractCards"` comme référence (jamais en relisant tout `build.js`) : (a) le champ `note` — reprendre la même source qu'`extractCards` (attribut ou span) pour les tables ET les listes ; (b) la signature exacte de retour d'`exemplesOf` (adapter le mapping si elle diffère de `{he,tr,fr}`) ; (c) `lisOf` retourne les `<li>` de premier niveau seulement — ne pas le réimplémenter.

⚠️ **Unicité des groupes** : le script échoue (erreur nommée) si deux `<h3 class="subtheme">` d'une même section produisent le même slug — sinon deux groupes fusionneraient et le filtre `e.groupe === groupe` du générateur dupliquerait leurs entrées dans les deux emplacements. Même règle au Task 3 côté placeholders.

- [ ] **Step 2 : générer et valider** — `mkdir -p data/listes && node outils_migration/extrait_donnees.js && node -e "const v=require('./outils_migration/valide_donnees.js'); v.valideDonnees(v.chargeDonnees('.')); console.log('OK')"` → attendu : `OK`.
- [ ] **Step 3 : contrôle de comptage contre l'extracteur existant** (le juge de paix du task) :

```bash
node -e "
const B = require('./build.js'); const fs = require('fs');
const cards = B.extractCards(fs.readFileSync(B.NOTEBOOK, 'utf8'));
const v = require('./outils_migration/valide_donnees.js'); const d = v.chargeDonnees('.');
const nListes = Object.values(d.listes).reduce((s,l) => s + l.entries.length, 0);
const nData = d.noms.length + d.adjectifs.length + d.verbes.length + nListes;
console.log('cartes extractCards:', cards.length, '— entrées data/:', nData);
if (cards.length !== nData) { console.error('ÉCART'); process.exit(1); }"
```

Attendu : `cartes extractCards: 1220 — entrées data/: 1220` (⚠️ vérifier d'abord au `node build.js` que le compte courant est bien 1 220 ; si le carnet a grandi depuis ce plan, le bon chiffre est celui du build du jour — l'égalité des deux comptes est le critère, pas le chiffre absolu). Un écart se diagnostique section par section (imprimer les comptes par catégorie des deux côtés), jamais en devinant.

- [ ] **Step 4 : commit** — `git add outils_migration/extrait_donnees.js data/ && git commit` : « Chantier 1 : extraction du vocabulaire vers data/ (1220 entrées, comptes égaux à extractCards) ».

### Task 3 : Découpage du carnet en fragments (`src/carnet/`)

**Files:**
- Create: `outils_migration/decoupe_carnet.js`
- Create (générés) : `src/tokens.css`, `src/carnet/carnet.css`, `src/carnet/carnet.js`, `src/carnet/tete.html`, `src/carnet/pied.html`, `src/carnet/sections/NN-<slug>.html` (~37 fichiers), `src/carnet/sections.json`

**Interfaces:**
- Produces: les fragments + `sections.json` (tableau ordonné des noms de fichiers) consommés par `genere_carnet.js` (Task 5). Convention de placeholder, **le seul contrat entre fragments et gabarits** : `<!-- @ENTREES:verbes#<groupe> -->` (resp. `adjectifs`, `noms`) à la place des `<tr>` de données d'un `<tbody>` ; `<!-- @ENTREES:listes/<slug> -->` à la place des `<li>` d'un `<ul class="word-list">`.

- [ ] **Step 1 : écrire le script.** Logique : (1) scinder le fichier en tête (jusqu'à la fin du `</style>` + ouverture du corps), corps, pied (à partir du `<script>` final) ; (2) extraire du `<style>` le premier bloc `:root` (tokens partagés, byte-identique — piège 5) vers `src/tokens.css`, le reste vers `src/carnet/carnet.css`, et poser dans `tete.html` les marqueurs `<!-- @TOKENS -->` / `<!-- @CSS:carnet -->` à leurs places exactes ; (3) scinder le corps aux `<h2>` (mêmes offsets que `parseSections`) → un fichier par section, nommé `NN-<slug du label>.html` — **le préambule du corps** (tout ce qui précède le premier `<h2>` : titre, chapeau, sommaire éventuel) devient `00-preambule.html`, premier de `sections.json` ; (4) dans les sections de vocabulaire (les 3 tables + les 16 listes de `listCats`), remplacer les `<tr data-niveau…>` de chaque tbody par le placeholder du groupe courant, et les `<li data-niveau…>` de chaque `ul.word-list` par le placeholder de liste — **tout le reste (h2, notes, h3, thead, prose) reste tel quel dans le fragment** ; (5) le `<script>` du carnet part dans `carnet.js`, remplacé par `<!-- @JS:carnet -->` dans `pied.html` ; (6) écrire `sections.json`. Le slugifieur est le même `slug()` que Task 2 (copié — script jetable).
- [ ] **Step 2 : exécuter** — `node outils_migration/decoupe_carnet.js` puis contrôles : `ls src/carnet/sections | wc -l` → 37 ; `grep -c '@ENTREES' src/carnet/sections/*.html | grep -v ':0' | wc -l` → 19 fichiers porteurs (3 tables + 16 listes) ; `grep -c 'data-niveau' src/carnet/sections/*.html` → 0 partout (aucune entrée résiduelle dans les fragments) ; `head -1 src/tokens.css` → `:root{`.
- [ ] **Step 3 : contrôle d'inversibilité brute** — la concaténation `tete + sections (dans l'ordre de sections.json) + pied`, marqueurs et placeholders réinjectés avec les contenus originaux, doit être **byte-identique** au carnet actuel. Écrire ce test à la fin de `decoupe_carnet.js` (mode `--verifie`) : il reconstruit et compare `Buffer.compare === 0`. Attendu : `RECONSTRUCTION BYTE-IDENTIQUE : OK`. C'est lui qui prouve que le découpage n'a rien mangé.
- [ ] **Step 4 : commit** — « Chantier 1 : carnet découpé en fragments src/carnet/ (reconstruction byte-identique prouvée) ».

### Task 4 : Le contrôle d'équivalence (`compare_carnets.js`) — écrit AVANT le générateur

**Files:**
- Create: `outils_migration/compare_carnets.js`

**Interfaces:**
- Consumes: `vocabulaire_hebreu.html` (référence = `git show HEAD:vocabulaire_hebreu.html`) et un candidat (chemin en argument). jsdom via l'outillage WSL existant (recette : ARCHITECTURE.md § « Flux de données », `resources:'usable'`, scripts exécutés).
- Produces: verdict PASS/FAIL sur 4 critères, code retour ≠ 0 si FAIL.

- [ ] **Step 1 : écrire le script.** Les 4 critères, dans l'ordre du moins cher au plus cher :
  1. **Cartes identiques** : `JSON.stringify(extractCards(reference)) === JSON.stringify(extractCards(candidat))` — 1 220 cartes, champs et ordre compris. C'est le critère roi : il prouve que `build.js` et `app.html` verront exactement le même monde.
  2. **DOM normalisé équivalent** : via jsdom **sans** scripts, sérialiser chaque section (`h2` + corps) en normalisant les blancs entre balises et l'ordre des attributs, et diff section par section — tout écart imprime `SECTION <label> : DIFF` + la première ligne divergente (et rien d'autre : pas de dump).
  3. **Comptes navigateur** : via jsdom **avec** scripts, `document.querySelectorAll('[lang=he]').length` et `span.cursive` identiques entre référence et candidat (piège 6 : mesuré, pas calculé).
  4. **Le build passe sur le candidat** : `node build.js` imprime les mêmes comptes par section que sur la référence. Mécanique : sauvegarder `vocabulaire_hebreu.html` dans le scratchpad, copier le candidat à sa place, builder, puis restaurer (`git checkout -- vocabulaire_hebreu.html flashcards_hebreu.html`) — le dépôt ressort intact même si le critère échoue.
- [ ] **Step 2 : le voir échouer** — `node outils_migration/compare_carnets.js /dev/null` → attendu : FAIL immédiat (candidat illisible). Le harnais existe avant le générateur.
- [ ] **Step 3 : commit** — « Chantier 1 : contrôle d'équivalence des carnets (4 critères, avant le générateur) ».

### Task 5 : Gabarits + générateur (`gabarits.js`, `genere_carnet.js`)

**Files:**
- Create: `src/carnet/gabarits.js` (module Node **pérenne** — il partira dans le build v2)
- Create: `outils_migration/genere_carnet.js` (orchestration jetable, absorbée par `build.js` au Chantier 2)

**Interfaces:**
- Produces: `gabarits.ligneNom(e)`, `gabarits.ligneAdjectif(e)`, `gabarits.ligneVerbe(e)`, `gabarits.itemListe(e)`, `gabarits.exemplesHtml(exemples)` — fonctions **pures** entrée → chaîne HTML (principe 4). `genereCarnet(donnees, srcCarnet)` → HTML complet du carnet.

- [ ] **Step 1 : écrire `gabarits.js`** d'après le markup échantillonné (indentation comprise — on vise l'équivalence normalisée, mais coller aux bytes réduit le diff à néant) :

```js
'use strict';
const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const heSpan = (o) => `<span class="he" lang="he">${o.he}</span>` + (o.tr ? `<span class="tr">${esc(o.tr)}</span>` : '');
function exemplesHtml(exs){
  if (!exs || !exs.length) return '';
  const items = exs.map(x => `<li><span class="he" lang="he">${x.he}</span><span class="tr">${esc(x.tr)}</span><span class="fr">${esc(x.fr)}</span></li>`).join('');
  return `\n      <ul class="exemples">${items}</ul>\n    `;
}
const vedette = (e) => `<td><span class="he" lang="he">${e.he}</span><span class="fr">${esc(e.fr)}</span>${exemplesHtml(e.exemples)}</td>`;
const attrs = (e) => `data-niveau="${e.niveau}" data-theme="${e.theme}"`;
function ligneNom(e){
  const pl = e.pluriel ? heSpan(e.pluriel) : '';
  return `    <tr ${attrs(e)}>\n      ${vedette(e)}\n      <td>${e.genre}</td>\n      <td>${pl}</td>\n    </tr>`;
}
function ligneAdjectif(e){
  return `    <tr ${attrs(e)}>\n      ${vedette(e)}\n` + e.formes.map(f => `      <td>${heSpan(f)}</td>`).join('\n') + `\n    </tr>`;
}
const ligneVerbe = ligneAdjectif;   // même motif, 4 formes au lieu de 3
function itemListe(e){
  const court = e.fr_court ? ` data-fr-court="${esc(e.fr_court)}"` : '';
  return `  <li data-niveau="${e.niveau}"${court}>\n    <span class="word-main"><span class="he" lang="he">${e.he}</span></span>\n    <span class="meta"><span class="tr">${esc(e.tr)}</span><span class="fr">${esc(e.fr)}</span></span>\n  ${exemplesHtml(e.exemples)}</li>`;
}
module.exports = { ligneNom, ligneAdjectif, ligneVerbe, itemListe, exemplesHtml };
```

(Le traitement du champ `note` s'ajoute ici en miroir de ce que Task 2 a extrait.)

- [ ] **Step 2 : écrire `genere_carnet.js`** — lit `sections.json`, concatène `tete.html` (avec `@TOKENS` ← `src/tokens.css`, `@CSS:carnet` ← `carnet.css`) + fragments + `pied.html` (`@JS:carnet` ← `carnet.js`), et remplace chaque `<!-- @ENTREES:… -->` : `verbes#<groupe>` → `donnees.verbes.filter(e => e.groupe === groupe).map(ligneVerbe).join('\n')` (idem noms/adjectifs), `listes/<slug>` → `donnees.listes[slug].entries.map(itemListe).join('\n')`. Un placeholder qui ne consomme aucune entrée, ou une entrée qu'aucun placeholder ne consomme = erreur bloquante nommée (le garde anti-perte silencieuse).
- [ ] **Step 3 : boucle rouge→vert** — `node outils_migration/genere_carnet.js > /tmp/claude-1000/-home-ruben-dev-flashcards-hebreu/714a5422-6faf-4e25-82a6-8d3a42e9f2e3/scratchpad/carnet_candidat.html && node outils_migration/compare_carnets.js <ce chemin>`. Itérer sur les gabarits jusqu'à `4/4 PASS`. Les critères 2–3 (jsdom) se lancent via un sous-agent Sonnet : « exécute ces deux commandes, rapporte PASS/FAIL par critère et la première divergence nommée, max 10 lignes ».
- [ ] **Step 4 : commit** — « Chantier 1 : gabarits purs + générateur, équivalence 4/4 contre le carnet actuel ».

### Task 6 : Bascule — le carnet déployé devient l'artefact généré

**Files:**
- Modify: `vocabulaire_hebreu.html` (remplacé par la sortie du générateur, + en-tête)
- Modify: `sw.js:59` (`v30` → `v31`)
- Modify: `TODO.md` (« Reprendre ici »)

- [ ] **Step 1 :** ajouter l'en-tête au générateur — première ligne après `<!doctype html>` : `<!-- FICHIER GÉNÉRÉ — ne pas éditer. Source : data/ + src/carnet/. Regénération : node outils_migration/genere_carnet.js (chantier 2 : node build.js). -->` — puis régénérer **en place** : `node outils_migration/genere_carnet.js --ecrire`.
- [ ] **Step 2 : rituel complet** — `node build.js` (comptes identiques à avant, aucune section à 0) puis `node verifie_exemples.js` (0 erreur). `build.js --check` doit passer (le standalone régénéré reste en phase).
- [ ] **Step 3 :** bump `sw.js` → `const VERSION = 'v31';`.
- [ ] **Step 4 :** TODO.md « Reprendre ici » : chantier 1 soldé, état (« carnet généré depuis data/ + src/carnet/, build/app inchangés »), prochain task = 7. Commit + push : « Chantier 1 soldé : le carnet est un artefact généré (équivalence 4/4), sw v31 ».

---

## CHANTIER 2 — Bascule des consommateurs sur les données (session 2)

À la fin : `build.js` v2 génère carnet + `cards.json` + standalone depuis `data/`, le parseur regex et `extractCards` (app) sont supprimés, les outils lisent le JSON.

### Task 7 : `build.js` v2 — les données deviennent l'entrée du build

**Files:**
- Modify: `build.js` (remplacement du pipeline d'extraction ; la génération du standalone et l'injection dans la coquille `app.html` restent)
- Move: `outils_migration/valide_donnees.js` → intégré (fonctions reprises dans `build.js`) ; `src/carnet/gabarits.js` requis tel quel ; logique de `genere_carnet.js` absorbée.

**Interfaces:**
- Produces: `deriveCartes(donnees)` → tableau de cartes au **schéma actuel exact** `{cat, he, tr, fr, note?, niveau?, theme?, exemples:[{he,tr,fr,he_plain}], he_plain, forms?:[{he,tr,label}], genre?}` (tables : `tr:''`, labels verbes `['il','elle','ils','elles']`, labels adjectifs identiques à ceux d'`extractCards` — les lire via `graphify explain "extractCards"` côté app avant d'écrire) ; `he_plain` via `stripNikud` au build. Écrit `cards.json` : `{"version": "<AAAA-MM-JJ du jour du build>", "cartes": [...]}`.

- [ ] **Step 1 — le verrou avant la clé :** ajouter à `build.js` `deriveCartes(donnees)` et un mode `--verrou` qui imprime `VERROU OK` si `JSON.stringify(deriveCartes(chargeDonnees()))` === `JSON.stringify(extractCards(carnetGénéré))`. Tant que ce verrou n'est pas vert, **interdiction de supprimer le parseur regex**.
- [ ] **Step 2 :** exécuter `node build.js --verrou` → itérer sur `deriveCartes` jusqu'à `VERROU OK` (l'ancien extracteur sert d'oracle une dernière fois).
- [ ] **Step 3 :** basculer `main()` : `chargeDonnees` → `valideDonnees` (mêmes messages d'échec nommés qu'aujourd'hui : sections vides, niveaux, thèmes — les gardes actuels l. 298–405 se reformulent sur les données) → `genereCarnet` (en-tête « FICHIER GÉNÉRÉ » : « Regénération : node build.js ») → `deriveCartes` → écrit `vocabulaire_hebreu.html`, `cards.json`, `flashcards_hebreu.html` (cartes injectées par le mécanisme d'injection existant, inchangé). Supprimer alors : le parseur regex d'extraction (fonctions devenues orphelines : `extractCards` locale, `rowsOf`, `lisOf`, `closeOf`… — les helpers encore utiles aux autres scripts restent exportés jusqu'au Task 10), la comparaison de taxonomie avec `app.html` (l. 376–405) restant en place jusqu'à la mort d'`extractCards` app (Task 8). `--check` compare désormais les **trois** artefacts régénérés aux committés.
- [ ] **Step 4 :** supprimer d'`outils_migration/` les fichiers absorbés (`valide_donnees.js`, `genere_carnet.js`) **dans le même commit** — aucune copie de logique ne reste vivante en double (principe 2) ; `extrait_donnees.js` et `decoupe_carnet.js` restent jusqu'au Task 20. `compare_carnets.js` a en fait été retiré par anticipation à la tâche 11 (round de revue 1/5) : sa mission — prouver l'équivalence entre le carnet généré et l'ancien carnet écrit à la main — était remplie et archivée dans git (commit `603474e`), et son critère 1 est devenu structurellement irréparable une fois le dernier extracteur HTML supprimé.
- [ ] **Step 5 :** `node build.js` → mêmes comptes ; `node build.js --check` → OK ; `git diff --stat vocabulaire_hebreu.html flashcards_hebreu.html` → diff nul ou limité à l'en-tête. Commit : « Chantier 2 : build v2 — data/ en entrée, cards.json en sortie, verrou deriveCartes=extractCards prouvé avant suppression ».

### Task 8 : `app.html` consomme `cards.json` — mort du second extracteur

**Files:**
- Modify: `app.html` : `init()` (l. ~2435) et suppression d'`extractCards` (l. 2317), `stripNikud`/`firstText` (l. 2314–2315) si plus référencés (`grep -n 'stripNikud\|firstText' app.html` pour trancher).

- [ ] **Step 1 :** dans `init()`, remplacer le bloc fetch+parse :

```js
// AVANT (l. ~2440)
const res = await fetch('./vocabulaire_hebreu.html', {cache:'no-store'});
/* … DOMParser + extractCards(doc) … */
// APRÈS
const res = await fetch('./cards.json', {cache:'no-store'});
if (!res.ok) throw new Error('HTTP ' + res.status);
CARDS = (await res.json()).cartes;
```

(Garder tel quel tout ce qui suit l'affectation de `CARDS` — tolérance aux cartes non classées comprise. `showLoaderError` inchangé.)

⚠️ **Avant d'éditer** : repérer comment la version autonome court-circuite le fetch aujourd'hui (`grep -n 'BUILD:' app.html` pour les fences + `graphify explain "init"`) — `build.js` neutralise le chargement réseau du standalone par un mécanisme existant (fence ou remplacement exact, cf. « Version autonome : pas de chargement réseau » build.js l. ~451). Le nouveau bloc fetch doit rester **dans la même couture**, sinon le standalone embarquerait un fetch mort ou `build.js` ne trouverait plus sa cible de remplacement.

- [ ] **Step 2 :** `node build.js && node build.js --check` (la coquille a changé → le standalone se régénère). Contrôle jsdom via sous-agent Sonnet, recette d'ARCHITECTURE.md § Flux de données : serveur local + app chargée → « nombre de cartes chargées, erreurs console ; attendu 1220 / 0 ; réponds PASS/FAIL + les chiffres, max 5 lignes ».
- [ ] **Step 3 :** supprimer de `build.js` la comparaison de taxonomie build/app devenue sans objet (THEMES reste dans `app.html` pour l'UI ; le build valide contre `EXPECTED_THEMES`, seule source). Commit : « Chantier 2 : app.html sur cards.json, extractCards supprimé — plus aucun parsing du carnet nulle part ».

### Task 9 : PWA — `cards.json` entre dans le cache

**Files:**
- Modify: `sw.js` (`ASSETS` l. 62–70 : ajouter `'./cards.json',` après `'./app.html',` ; `VERSION` → `'v32'`)

- [ ] **Step 1 :** faire les deux édits ci-dessus.
- [ ] **Step 2 :** contrôle : `grep -n "cards.json\|VERSION = " sw.js` → les deux lignes attendues. Commit : « Chantier 2 : cards.json en cache SW, v32 ».

### Task 10 : `verifie_exemples.js` et `cherche_mots.js` sur JSON

**Files:**
- Modify: `verifie_exemples.js`, `cherche_mots.js`

- [ ] **Step 1 :** relever la surface CLI exacte des deux scripts (`node verifie_exemples.js --help` ou en-tête du fichier ; idem `cherche_mots.js`, spec courte dans CLAUDE.md piège 15) — **la surface ne change pas**, seule la source des entrées passe de l'extraction HTML à `chargeDonnees()` (désormais exportée par `build.js`). Les contrôles éditoriaux (avertissements, `--strict`, lexique du validateur, `orthographeVoisine`) sont conservés à l'identique.
- [ ] **Step 2 :** avant/après sur les deux : `node verifie_exemples.js` → même sortie que pré-bascule (0 erreur, mêmes avertissements au mot près) ; `node cherche_mots.js שלום` et `node cherche_mots.js --stats` → mêmes réponses, les ancres de ligne pointant désormais vers `data/*.json` (le canal de consultation du piège 15 survit tel quel).
- [ ] **Step 3 :** commit : « Chantier 2 : verifie_exemples et cherche_mots lisent data/ (surface CLI inchangée) ».

### Task 11 : `ajoute_mots.js` v2 + révision de sa spec

**Files:**
- Modify: `ajoute_mots.js`, `SPEC_AJOUTE_MOTS.md`

- [ ] **Step 1 :** lire SPEC_AJOUTE_MOTS.md par sections (grep des titres puis ±30 lignes) pour inventorier le contrat : entrée JSON petite, validation sandbox, `--ecrire`. Le pipeline v2 : entrée inchangée → validation (mêmes contrôles + `valideDonnees` sur la cible) → insertion dans le bon `data/*.json` (tri/position selon les règles existantes de la spec) → `node build.js` en sandbox (dossier temporaire du scratchpad) → n'écrit qu'avec `--ecrire`. Toute l'étape « composer le HTML de la fiche » disparaît.
- [ ] **Step 2 :** dry-run de non-régression : rejouer l'exemple canonique de la spec (sans `--ecrire`) → même verdict qu'avant la bascule.
- [ ] **Step 3 :** réviser SPEC_AJOUTE_MOTS.md : les sections de composition HTML remplacées par le contrat JSON (cible = `data/`, gabarits = affaire du build), le reste (validation, sandbox, CLI) mis à jour à la marge. Commit : « Chantier 2 : ajoute_mots insère dans data/ — spec révisée, composition HTML supprimée ».

### Task 12 : Contrôle de sortie du chantier 2

- [ ] **Step 1 :** rituel : `node build.js && node build.js --check && node verifie_exemples.js` → tout vert. `grep -c 'extractCards' app.html build.js` → `0` et `0`.
- [ ] **Step 2 :** sous-agent Sonnet WebKit (l'UI de chargement a bougé : fetch différent) : iPhone émulé, ouvrir l'app servie localement, lancer une session de 3 cartes, « PASS/FAIL : app chargée, 1220 cartes, une carte retournée, zéro erreur console — max 6 lignes ».
- [ ] **Step 3 :** TODO.md « Reprendre ici » (chantier 2 soldé, prochain = Task 13) ; commit + push : « Chantier 2 soldé : plus aucun extracteur, données seules sources, sw v32 ».

---

## CHANTIER 3 — Découpage d'`app.html` en modules (session 3)

Stratégie en deux temps pour ne jamais sauter sans filet : (a) **éclatement byte-identique** — les sources sont découpées telles quelles et le build les concatène à l'identique, prouvé au byte ; (b) **regroupement par responsabilité** — les fonctions rejoignent leur module, prouvé par contrôle comportemental A/B.

### Task 13 : Coquille + assemblage byte-identique

**Files:**
- Create: `src/app/coquille.html`, `src/app/app.css`, `src/app/js/00-tout.js` (temporaire), `src/app/ordre.json`
- Modify: `build.js` (fonction `assembleApp()`)
- Delete: `app.html` de la racine n'est plus une source — il devient le 5ᵉ artefact généré.

- [ ] **Step 1 :** script jetable `outils_migration/decoupe_app.js` : extrait d'`app.html` le `<style>` complet → `src/app/app.css`, le `<script>` principal → `src/app/js/00-tout.js`, le reste → `src/app/coquille.html` avec `<!-- @TOKENS -->` (premier bloc `:root`, servi par `src/tokens.css` — piège 5 résolu par construction), `<!-- @CSS:app -->`, `<!-- @JS:app -->`. ⚠️ La fence `BUILD:ONLINE-ONLY` (enregistrement du SW) et la ligne du loader restent dans la coquille — le mécanisme actuel de `build.js` pour le standalone continue de s'y appliquer sans modification.
- [ ] **Step 2 :** `assembleApp()` dans `build.js` : coquille + tokens + CSS + concaténation des `src/app/js/*.js` dans l'ordre de `src/app/ordre.json` (`["00-tout.js"]` pour l'instant). ⚠️ Ordre dans `main()` : `assembleApp()` s'exécute **avant** la génération du standalone — celui-ci se dérive de l'`app.html` fraîchement assemblé, jamais de l'ancien. Gate : l'`app.html` régénéré est **byte-identique** à l'actuel (`git diff --exit-code app.html`), en-tête « FICHIER GÉNÉRÉ » excepté (l'ajouter aussi au diff attendu). `node build.js --check` couvre désormais les 5 artefacts.
- [ ] **Step 3 :** commit : « Chantier 3a : app.html généré depuis src/app/, assemblage byte-identique prouvé ».

### Task 14 : Découpage du CSS

**Files:**
- Create: `src/app/css/{10-base,20-selection,30-cartes,40-qcm,50-revision,60-reglages}.css` (bornes exactes = les commentaires de section du CSS actuel ; adapter les noms aux sections réellement trouvées)
- Delete: `src/app/app.css` — Modify: `ordre.json` (clé `css` ajoutée : ordre d'origine impérativement conservé, la cascade est une sémantique)

- [ ] **Step 1 :** scinder aux frontières de commentaires existantes, sans changer une ligne. Gate byte-identique : `cat src/app/css/*.css` (dans l'ordre) `=== app.css` d'origine, puis `node build.js && git diff --exit-code app.html`.
- [ ] **Step 2 :** commit : « Chantier 3a : CSS de l'app en 6 fichiers, concaténation byte-identique ».

### Task 15 : Découpage du JS par responsabilité — la carte des modules

**Files:**
- Create: `src/app/js/` (remplace `00-tout.js`) :

| Fichier | Contenu (fonctions relevées le 24/07) |
|---|---|
| `01-util.js` | `escapeHtml, shuffle, todayNum, fmtMs` |
| `02-translitteration.js` | `he2tr, trKey, normHe, editDist` |
| `03-reponses.js` | `normFr, frVariants, checkAnswer, answerHtml` |
| `04-stockage.js` | `prefsLoad, savePrefs, sessSave, sessClear, sessRestore, srsLoad, srsSave, srsMigrateIds, cardId` |
| `05-donnees.js` | `init, showLoaderError` + la constante `CARDS` |
| `06-voix.js` | `loadVoices, reflectVoiceUi, speak, speakCurrent, updateSpeaker` |
| `07-filtres.js` | `nivOfCard, nivOk, themeOk, searchNorm, runSearch, buildChips, buildNivChips, buildThemeChips, toggle, segPick, refreshAdvSub, foldSub, refreshFoldSubs, applyFoldState, refreshSelAll, updateStart, limitPool` + `THEMES` |
| `08-srs.js` | `recordResult, undoLastRecord, dueCards, masteryStats, refreshSrsUi, startReview` |
| `09-session.js` | `beginSession, start, finish` |
| `10-rendu.js` | `render, heFront, bigFr, formsHtml, exHtml, exActivate, exBind, frShort` |
| `11-cartes.js` | `setupCardsMode, setupInputCard, animateFace, doFlip, bindTap, answer, undoCardAnswer, showInputFeedback, fixVerdict, submitAnswer, nextAfterInput, skipAnswer` |
| `12-qcm.js` | `quizPrompt, quizChoiceHtml, pickDistractors, setupQuizCard, quizPick, quizFixVerdict` |
| `13-reglages.js` | `applyPrefs, reflectSeg, perfReport` |
| `99-principal.js` | état top-level (refs DOM, variables de session), branchements d'événements, appel d'`init()` |

- [ ] **Step 1 :** déplacer les fonctions une famille à la fois (l'ordre du tableau = l'ordre de concaténation = l'ordre des dépendances). Règles : le scope top-level partagé est **conservé** (concaténation, aucun changement d'exécution) ; chaque fichier s'ouvre par un en-tête `// Expose : … — Utilise : …` (l'interface explicite du principe 1, documentée à défaut d'être outillée) ; toute variable top-level rejoint le module qui l'écrit ; `graphify explain <fonction>` tranche les cas ambigus (appelants/appelés), jamais une relecture intégrale. ⚠️ Les déclarations `function` sont hoistées (l'ordre est libre) mais les `const/let` top-level **doivent** précéder leur premier usage à l'exécution : `99-principal.js` porte tout ce qui s'exécute au chargement.
- [ ] **Step 2 :** gate intermédiaire : après chaque groupe de 3–4 familles déplacées, `node build.js` puis smoke test jsdom en sous-agent (app chargée, une carte jouée, 0 erreur console, « PASS/FAIL + chiffres, max 5 lignes ») — une erreur de portée `const/let` se voit ici immédiatement, tant que le déplacement fautif est encore frais.
- [ ] **Step 3 :** contrôle de complétude : la concaténation triée des fonctions extraites == inventaire des 87 fonctions d'origine (`grep -h "^function \|^async function " src/app/js/*.js | sort` vs le même grep sur `git show HEAD~1:app.html`) — aucune fonction perdue, aucune dupliquée.
- [ ] **Step 4 :** commit : « Chantier 3b : app.html en 14 modules par responsabilité, scope d'exécution inchangé ».

### Task 16 : Contrôle A/B et sortie du chantier 3

- [ ] **Step 1 :** rituel (`build`, `--check`, `verifie_exemples`) puis bump `sw.js` → `v33`.
- [ ] **Step 2 :** deux sous-agents Sonnet en parallèle, prompts avec critères chiffrés : (1) WebKit iPhone 16 Pro — captures A/B (HEAD~n avant chantier vs HEAD) des écrans accueil/sélection/carte/QCM/révision, « identiques oui/non par écran, max 8 lignes, aucune image en réponse » ; (2) desktop 1440/1280/992/900/768 (piège 13) — même protocole. Tout écart = retour au Task 15.
- [ ] **Step 3 :** TODO.md, commit + push : « Chantier 3 soldé : app.html artefact assemblé depuis src/app/, iso-visuel prouvé mobile+desktop, sw v33 ».

---

## CHANTIER 4 — Rangement final (session 4)

### Task 17 : `tools/` et `docs/`

**Files:**
- Move (`git mv`) : `build.js`, `verifie_exemples.js`, `ajoute_mots.js`, `cherche_mots.js` → `tools/` ; `audit_carnet_mecanique.js` → **supprimé** (son objet — auditer le HTML du carnet — n'existe plus ; l'historique git le garde) ; `ARCHITECTURE.md`, `DESIGN.md`, `PRODUCT.md`, `TODO.md`, `TODO_ARCHIVE.md`, `SPEC_AJOUTE_MOTS.md`, `SPEC_ECONOMIE_TOKENS.md` → `docs/`. `README.md` et `CLAUDE.md` restent à la racine.
- Modify: chemins internes — dans `tools/build.js` : `const ROOT = path.join(__dirname, '..')` ; vérifier les `require('./build.js')` des trois autres scripts → `require('./build.js')` reste juste (même dossier) ; `inbox/` et `.impeccable/` inchangés.

- [ ] **Step 1 :** `git mv`, ajuster `ROOT`, puis `node tools/build.js && node tools/build.js --check && node tools/verifie_exemples.js && node tools/cherche_mots.js --stats` → tout vert.
- [ ] **Step 2 :** `grep -rn "node build.js\|node verifie\|node ajoute\|node cherche\|ARCHITECTURE.md\|DESIGN.md\|TODO.md" README.md CLAUDE.md docs/ --include=*.md -l` → corriger chaque référence de chemin (commandes `node tools/…`, liens `docs/…`).
- [ ] **Step 3 :** commit : « Chantier 4 : tools/ et docs/, chemins recalés, audit_carnet_mecanique supprimé ».

### Task 18 : Portail et tokens générés

**Files:**
- Create: `src/portail/index.html` (source, avec `<!-- @TOKENS -->` à la place de son premier bloc `:root`)
- Modify: `tools/build.js` (génère `index.html` racine : tokens injectés + en-tête « FICHIER GÉNÉRÉ »)

- [ ] **Step 1 :** créer la source depuis l'`index.html` actuel (252 lignes — lisible en entier), brancher dans `build.js`. Gate : `index.html` régénéré byte-identique à l'actuel (en-tête excepté) ; le bloc tokens des **trois** artefacts provient désormais du seul `src/tokens.css` — le piège 5 (« byte-identique maintenu à la main ») est clos par construction. `--check` couvre 6 artefacts (5 + cards.json).
- [ ] **Step 2 :** commit : « Chantier 4 : portail généré, tokens :root en source unique ».

### Task 19 : `VERSION` de `sw.js` estampillée par le build

**Files:**
- Modify: `tools/build.js`, `sw.js:59`

- [ ] **Step 1 :** dans `build.js`, après écriture des artefacts :

```js
const crypto = require('crypto');
const h = crypto.createHash('sha256');
for (const f of ['index.html','app.html','vocabulaire_hebreu.html','flashcards_hebreu.html','cards.json','manifest.webmanifest'])
  h.update(fs.readFileSync(path.join(ROOT, f)));
const version = 'v-' + h.digest('hex').slice(0, 8);
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
fs.writeFileSync(path.join(ROOT, 'sw.js'),
  sw.replace(/const VERSION = '[^']+';/, `const VERSION = '${version}';`));
```

`sw.js` reste écrit à la main ; **cette seule ligne** est estampillée (couture déclarée en commentaire au-dessus de la ligne : `/* ligne estampillée par tools/build.js — ne pas éditer la valeur */`). Le piège 10 (bump oublié) meurt : tout `node tools/build.js` qui change un artefact change la version, et un build sans changement la laisse stable (hash identique).

- [ ] **Step 2 :** `--check` vérifie aussi la version : la `VERSION` committée dans `sw.js` doit égaler le hash recalculé (sinon FAIL nommé) — un artefact committé sans son estampille ne peut plus passer.
- [ ] **Step 3 :** `node tools/build.js` deux fois → la version ne bouge qu'à la première (stabilité) ; modifier un JSON de `data/`, rebuild → elle bouge ; restaurer (`git checkout -- data/`), rebuild → elle revient. Commit : « Chantier 4 : VERSION du SW dérivée du contenu — bump manuel aboli ».

### Task 20 : Nettoyage, documentation, flag graphe

**Files:**
- Delete: `outils_migration/` — ce qu'il en reste après le Task 7 Step 4 et le retrait anticipé de `compare_carnets.js` à la tâche 11 : `extrait_donnees.js`, `decoupe_carnet.js` (le contrôle d'équivalence vit désormais dans `--check` de `build.js` ; l'historique git garde les scripts jetables)
- Modify: `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/TODO.md`, `README.md`

- [ ] **Step 1 :** `rm -r outils_migration && node tools/build.js --check` → vert.
- [ ] **Step 2 :** passe de documentation, par sections (grep du titre puis édition ± 30 lignes, jamais de relecture intégrale) :
  ⚠️ **Allégé depuis** : une passe d'**exactitude** a été faite le 24/07 à la clôture du chantier 2 (commit `6f12f51`) — CLAUDE.md et ARCHITECTURE.md ne contiennent plus d'affirmation fausse sur le flux de données (section « extraction coupling » remplacée en place, pièges 1/6/8 et rituel recalés, contrat gabarits/données côté ARCHITECTURE). Ne reste ici que l'**éditorial** : version définitive de la section pipeline, renumérotation des pièges, et les chemins `tools/` — qui, eux, ne pouvaient pas être écrits avant le déménagement.
  - **CLAUDE.md** : la section « The extraction coupling » disparaît, remplacée par ~10 lignes « The data pipeline » (data/ + src/ → tools/build.js → artefacts ; toute édition de contenu passe par data/, toute édition de prose par src/carnet/) ; pièges recalés — 1 (généralisé : *aucun* artefact racine ne s'édite à la main), 5 (clos : tokens générés), 6 (posé par gabarits — le contrôle reste), 8–9 (validation JSON au build), 10 (clos : hash) ; piège 15 et chemins d'outils recalés sur `tools/`.
  - **ARCHITECTURE.md** : § « Flux de données » réécrit (le schéma ci-dessus), § extracteurs remplacé par le contrat gabarits/placeholders, § carte schema inchangé sur le fond (source = `deriveCartes`).
  - **TODO.md** : rituel recalé (chemins, disparition du bump manuel), « Reprendre ici » : refonte soldée + **flag** `⚠️ GRAPHE À RECALER — 2026-07-XX : data/, src/, tools/, docs/ créés ; app.html/vocabulaire_hebreu.html devenus artefacts ; outils_migration supprimé` (le flag ne déclenche rien — règle du propriétaire).
  - **README.md** : arborescence et commandes.
- [ ] **Step 3 :** commit : « Chantier 4 : documentation recalée sur le dépôt généré, flag graphe posé ».

### Task 21 : Contrôle final global + livraison

- [ ] **Step 1 :** rituel complet : `node tools/build.js && node tools/build.js --check && node tools/verifie_exemples.js` → vert ; `node tools/cherche_mots.js שלום` → répond ; `node tools/ajoute_mots.js` dry-run canonique → même verdict qu'au Task 11.
- [ ] **Step 2 :** sous-agent Sonnet WebKit : parcours complet PWA en local (portail → app → une session de chaque mode → carnet), « PASS/FAIL par étape + erreurs console, max 10 lignes ».
- [ ] **Step 3 :** push sur `main`. Vérifier ensuite sur l'URL publique (un fetch de `https://rubischtgadol.github.io/flashcards-hebreu/cards.json` doit répondre 200 après le redéploiement Pages). Signaler à Ruben : première ouverture sur l'iPhone = 2 lancements pour voir la nouvelle version (stale-while-revalidate), comme d'habitude.

---

## Auto-revue du plan (faite à la rédaction)

- **Couverture spec** : source JSON (T2), carnet généré + prose en fragments (T3–T6), suppression du double extracteur (T7–T8), cards.json + PWA (T8–T9), outils simplifiés + spec ajoute_mots révisée (T10–T11), découpage app (T13–T15), assemblage déterministe sans bundler (T13), contrôles mobile+desktop (T16), tools/+docs/+portail+tokens (T17–T18), VERSION par hash (T19), docs+flag graphe (T20), critères chiffrés du chantier 1 (T2 step 3, T4, T5) — chaque exigence de la spec a son task.
- **Points laissés à l'exécution, assumés et bornés** : champ `note` (T2/T5, miroir d'`extractCards` via graphe), labels de formes adjectifs (T7, lus via graphe), noms exacts des fichiers CSS (T14, selon les commentaires réels) — trois inconnues locales, chacune avec sa méthode de résolution nommée et son gate.
- **Cohérence des types** : `chargeDonnees/valideDonnees` (T1) consommés en T2, T5, T7, T10 sous la même signature ; `gabarits.*` (T5) requis en T7 ; le schéma de carte de T7 est celui du § schéma de la spec et de l'app actuelle.
- **Seconde passe (relecture du 24/07)** : sept correctifs intégrés — unicité des slugs de groupe (T2/T3, sinon duplication silencieuse d'entrées aux placeholders jumeaux) ; préambule du corps → `00-preambule.html` (T3, zone avant le premier `<h2>` non couverte) ; mécanique sauvegarde/restauration du critère 4 (T4) ; suppression des scripts de migration absorbés dans le commit qui les absorbe (T7, pas de logique en double vivante) ; le nouveau fetch de l'app doit rester dans la couture existante du standalone (T8, mécanisme « pas de chargement réseau » de build.js) ; `assembleApp()` avant la génération du standalone (T13) ; `--check` contrôle aussi l'estampille `VERSION` + test d'aller-retour du hash (T19).
