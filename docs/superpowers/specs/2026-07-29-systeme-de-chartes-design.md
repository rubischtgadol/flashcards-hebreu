# Système de chartes graphiques — spec de design

Date : 2026-07-29. Statut : conception validée en conversation, **en attente de relecture
du propriétaire sur pièce**. Prochaine étape après relecture : plan d'implémentation
(writing-plans), puis les lots du § 10.

## 1. Objectif : un banc d'essai, pas une cohabitation

Trois décisions du propriétaire (29/07) cadrent tout :

- **La direction de la charte v2 « console d'étude » n'est pas figée** — elle ne le
  satisfait pas et sera retravaillée, peut-être remplacée. Le système se conçoit donc
  **avant** la direction, et sans aucune hypothèse sur elle.
- **Le critère de réussite est le coût d'essai d'une direction** : créer une charte, la
  regarder, la jeter — sans qu'une ligne de `src/app/` ou `src/portail/` ne bouge. La
  cible n'est pas « deux chartes qui cohabitent » mais « des surfaces indifférentes à la
  direction ».
- **Périmètre : l'app et le portail.** Le carnet reste « carnet d'étude du soir » en
  toutes circonstances : c'est un document de lecture dont la gamme typographique et la
  colonne sont des valeurs mesurées (piège n°4) — un thème qui le passe en capitales
  condensées ne le décore pas, il le rend moins lisible.

## 2. Le nom : « charte », jamais « thème »

`theme` est **déjà pris** dans ce dépôt : les thèmes de *vocabulaire*
(`EXPECTED_THEMES`, `tools/build.js:81` ; `THEMES`, `src/app/js/07-filtres.js` ;
champ `theme` obligatoire de `data/*.json`, piège n°8). Un système homonyme fabriquerait
de l'ambiguïté dans chaque doc, chaque garde et chaque grep. Le système visuel s'appelle
donc **charte** : attribut `data-charte`, répertoire `src/chartes/` — en phase avec le
`data-charte` déjà proposé au § 7 du spec de la branche `refonte-retrofuturiste`.

## 3. Anatomie d'une charte

Un dossier `src/chartes/<slug>/`, trois fichiers, un rôle chacun :

- **`jetons.css`** — le bloc de custom properties. **C'est le contrat** : toutes les
  chartes définissent exactement les mêmes noms, avec d'autres valeurs.
- **`regles.css`** — *facultatif*. Le décor libre propre à la charte (§ 6).
- **`charte.json`** — l'identité : nom affiché, description d'une ligne, et les
  **polices** requises, familles *et graisses* (§ 7). Un champ `visible:false` retire
  la charte du sélecteur sans la retirer du build (pour la charte d'essai du lot 2).

Le registre `src/chartes/chartes.json` liste les slugs dans l'ordre et nomme la charte
**par défaut**. Il se garde par le motif de `verifieOrphelins()` (`tools/build.js:646`),
déjà éprouvé sur `ordre.json` et `sections.json`, étendu aux répertoires.

**La charte fondatrice est `carnet`** — la v1 « carnet d'étude du soir », charte par
défaut. `src/tokens.css` déménage en `src/chartes/carnet/jetons.css` (la constante
`TOKENS` de `build.js` suit). Rien n'est dupliqué : le bloc actuel *devient* la charte.

## 4. Le contrat de jetons

Cinq familles, ~40 noms (11 aujourd'hui) :

- **Couleur** — les 11 existants, plus les **triplets par teinte** (`--gold-rgb:
  212,162,76`, consommés en `rgba(var(--gold-rgb),.30)`) qui remplacent les alphas
  dupliqués en dur, les **encres de contraste** (`--sur-or` : l'encre posée sur un
  fond or, aujourd'hui `#1a1206` en dur ×8) et les **ombres et voiles**
  (`--ombre-carte`, `--voile-sombre`) — une charte à fond clair veut d'autres ombres
  qu'une charte sombre. Choix (précisé à l'écriture du plan, 29/07) : des triplets
  plutôt que des alphas nommés un par un — l'inventaire montre 8 alphas pour le seul
  or, soit ~14 jetons de plus que chaque charte neuve devrait remplir ; et plutôt que
  `color-mix()` — zéro pari de compatibilité. L'alpha est un dosage de surface, la
  teinte est un choix de charte ; une charte qui veut un halo d'une autre teinte que
  son accent le fait par `regles.css`.
- **Typographie** — les familles par voix (`--fonte-hebreu`, `--fonte-ui`,
  `--fonte-mono`, `--fonte-cursive`) et les graisses (`--graisse-titre`,
  `--graisse-vedette`…).
- **Forme** — les rayons (`--rayon-carte`, `--rayon-bouton`, `--rayon-pilule`…).
- **Rythme** — les interlettrages (`--interlettre-titre`, `--interlettre-label`…).
- **Casse** — `--casse-titre`, `--casse-label` (`text-transform` accepte `var()`).

**Règle d'admission : un jeton existe si une charte pourrait vouloir en changer la
valeur ; sinon la valeur reste littérale.** Les *tailles* de police restent hors
contrat : elles relèvent de la mise en page, pas de l'identité — et si une direction
future en a besoin, le contrat s'étend (la garde 2a du § 8 force alors toutes les
chartes à suivre).

La liste exacte se fige au lot 1, à mesure de la désincrustation. Ordres de grandeur
mesurés le 29/07 dans `src/app/css/` + le `<style>` du portail (à recompter au grep,
jamais à recopier) : ~30 littéraux de palette, ~59 piles `font-family` réelles,
58 `border-radius`, 43 `font-weight`, 15 `letter-spacing`, 10 `text-transform` —
tous littéraux, zéro variable aujourd'hui.

## 5. Application, repli, PWA

- **Le build stampe `data-charte="carnet"`** (le défaut du registre) sur le `<html>` de
  l'app et du portail. Le carnet n'a pas d'attribut. Sans JS, la page rend donc la
  charte par défaut **intégralement**, décor compris.
- **Un script inline en tête**, avant le `<style>`, lit la clé `localStorage` et
  remplace le slug s'il est connu — avant le premier paint, donc sans flash. La CSP
  autorise déjà `script-src 'unsafe-inline'` sur les trois pages (mesuré).
- **Émission des jetons** : un bloc `:root[data-charte="<slug>"]` par charte, **plus un
  `:root` nu portant la charte par défaut**. Ce doublon est le **repli CSS** — règle
  payée sur `prototype-ouvertures.html` : une variable sans repli casse en silence.
  Slug inconnu, stockage vide ou JS mort → les sélecteurs portés ne matchent pas → le
  repli rend la charte par défaut. Jamais de page blanche.
- **Le carnet** reçoit le bloc nu du défaut, comme aujourd'hui : ses 3 `:root` sont
  intacts.
- **PWA** : `manifest.webmanifest` et les `<meta name="theme-color">` portent le `--bg`
  de la charte **par défaut** (un manifeste n'existe qu'en un exemplaire). Au changement
  de charte, le JS met la meta à jour depuis `getComputedStyle`. `verifieCharte()` est
  recalée sur cette règle (§ 8.3) — sans quoi elle bloque au premier ajout de charte.
- **Le choix vit dans sa propre clé `localStorage`** (constante dans
  `src/app/js/04-stockage.js`, comme `PREFS_KEY` et `SRS_KEY` ; le portail lit/écrit la
  même clé dans son snippet). Il **survit à la réinitialisation de la progression**
  (`99-principal.js` ne le touche pas) : une préférence d'apparence n'est pas une
  progression.

## 6. `regles.css` — le décor, vérifié plutôt que transformé

- Chaque sélecteur est écrit **déjà porté**, à la main :
  `:root[data-charte="console"] .carte{…}`. Le build **vérifie** (échec nommé sur un
  sélecteur non porté), il ne préfixe pas. Deux raisons : préfixer du CSS arbitraire
  (`@media`, `@keyframes`, listes de sélecteurs) exige un vrai analyseur dans un dépôt
  à zéro dépendance ; et un fichier en sélecteurs littéraux se colle tel quel dans les
  devtools pour être essayé — le geste même du banc d'essai.
- `transition:…all` y est interdit — extension de la garde existante (piège n°2).
- **Le décor propre à la v1 migre vers `src/chartes/carnet/regles.css`** (la menorah du
  portail, et ce que le lot 1 identifiera) : une charte neuve ne doit pas hériter du
  décor d'une autre. Le HTML des surfaces garde des **points d'accroche neutres** (des
  éléments de décor nommés) ; chaque charte décide de ce qu'elle y dessine — y compris
  rien.

## 7. Les polices

- **Déclarées dans `charte.json`** (`{famille: [graisses]}`), jamais déduites du CSS :
  une déduction rate les graisses et échoue en silence — la pile retombe sur la fonte
  suivante sans que rien ne le dise.
- **Le build émet l'union** des familles de toutes les chartes dans le `<link>` Google
  Fonts de l'app et du portail (le carnet garde le sien). Coût : des fontes chargées
  pour rien — accepté, et payé une fois : `sw.js:85` les met en cache *cache-first*.
  L'alternative (basculer des `<link>` au changement) achèterait ces kilo-octets au
  prix d'un flash de police : mauvais échange.
- **Contrainte actée** : la CSP restreint `font-src` à `fonts.gstatic.com` (mesuré sur
  les trois pages) — une charte ne peut charger **que** Google Fonts. L'élargir
  (`@font-face`, fontes locales) serait un chantier à part, CSP et hors-ligne compris.
- **Dette existante, non traitée ici** : le standalone garde les `<link>` CDN
  (`generateStandalone()` ne touche pas aux polices — mesuré), donc dépend du réseau
  pour ses fontes en `file://`. Chaque charte ajoutée grossit cette dette. À consigner,
  pas à corriger dans ce chantier.

## 8. Les gardes — ce qui empêche le système de pourrir

1. **`verifieDesincrustation()`** (neuve) : échec du build si un littéral de couleur ou
   une pile `font-family` réapparaît dans `src/app/css/` ou le `<style>` du portail.
   Seuls `transparent` et `currentColor` restent admis en littéral — les ombres et
   voiles passent par leurs jetons (§ 4). Forme, rythme et casse : gardés aussi, avec
   une **liste d'exceptions nommées et justifiées** dans `build.js` — pas de tolérance
   floue. Le carnet est exclu (hors
   périmètre). Sans cette garde, la désincrustation se défait au premier ajout de
   fonctionnalité.
2. **`verifieRegistreChartes()`** (neuve) : (a) chaque charte définit **exactement**
   les noms du contrat, ni manquant ni surplus — la référence est la charte par
   défaut ; (b) tout sélecteur de `regles.css` porte `[data-charte="<son-slug>"]` ;
   (c) `transition:…all` interdit dans `regles.css` ; (d) toute famille citée dans le
   CSS d'une charte est déclarée dans son `charte.json`, et réciproquement.
3. **`verifieCharte()` recalée** : le verbatim devient *par charte* (le corps de chaque
   `jetons.css` présent tel quel dans l'app et le portail ; celui du défaut aussi dans
   le carnet — le piège n°5 devient « corps byte-identique par charte, sélecteur
   variable ») ; le compte des `:root` distingue les **`:root` nus** (constante
   actuelle inchangée : app 1, carnet 3, portail 1 — un nu de plus reste une charte
   réécrite en dur qui gagne par cascade) des **`:root[data-charte]`**, dont chacun
   doit correspondre à une charte du registre ; manifeste et `theme-color` se comparent
   au `--bg` **du défaut**.
4. **`verifieOrphelins()`** réutilisé : `src/chartes/` ↔ `chartes.json`, bidirectionnel,
   échec nommé dans les deux sens.

**Recette commune, leçon payée (24/07)** : chaque garde neuve doit être **vue échouer**
sur un cas fabriqué, sortie réelle à l'appui, avant d'être crue — une garde muette
passe toujours au vert.

## 9. Le sélecteur

- **Au portail** (décision du 24/07), avec des vignettes **rendues depuis les jetons**
  de chaque charte (fond, encre, accent, la fonte du titre) — jamais des captures : une
  capture périme en silence.
- **Dans les Réglages avancés de l'app aussi** : le standalone n'a pas de portail —
  sans ce second accès il n'aurait aucun sélecteur. Le code de sélection vit **hors**
  de la fence `BUILD:ONLINE-ONLY` (piège n°11).
- Le changement s'applique **sans rechargement** : `dataset.charte` sur `<html>`, puis
  mise à jour de la meta `theme-color`. Les chartes `visible:false` n'apparaissent pas.

## 10. Les lots

**Lot 1 — la désincrustation.** Le gros du travail, et il est invisible : les littéraux
de couleur, typo, forme, rythme et casse de `src/app/css/` et du portail deviennent des
`var()` ; `src/tokens.css` devient `src/chartes/carnet/jetons.css` étendu au contrat
complet. `verifieDesincrustation()` se pose **en fin de lot** — elle doit échouer tant
que le lot n'est pas fini, c'est sa recette. (Précisé à l'écriture du plan, 29/07 : la
migration du décor v1 vers `carnet/regles.css` part au lot 2 — un sélecteur porté ne
matche rien tant que l'attribut n'existe pas, la menorah disparaîtrait et le rendu A/B
casserait. Le lot 1 reste strictement invisible.)
*Recette du lot* : rendu A/B WebKit avant/après **strictement identique** — téléphone
(iPhone 16 Pro émulé) **et** 1440/1280/992/900/768 (piège n°13) — diff de captures à
zéro pixel, verdict nommé par largeur, piloté en sous-agent.

**Lot 2 — le mécanisme.** Registre, émission multi-chartes, attribut stampé + script
inline, les gardes 2 à 4, et une **charte d'essai volontairement criarde**
(`visible:false` : fond clair inversé, sans-empattement, angles droits) — un second jeu
de valeurs qui ressemble au premier ne prouve rien ; le criard rend toute fuite
immédiatement visible. Elle est versionnée et **reste** : c'est le canari du banc.
*Recette* : app et portail basculés sur la criarde en WebKit, **zéro trace v1 à
l'écran** (toute fuite = un littéral survivant → retour au lot 1) ; les quatre gardes
vues échouer chacune sur un cas fabriqué.

**Lot 3 — le sélecteur.** Portail + réglages app, persistance, `theme-color` dynamique,
vignettes depuis les jetons.
*Recette WebKit* : choisir (s'applique sans rechargement), recharger (persiste),
saboter le slug en `localStorage` (retombe sur le défaut), couper le JS (défaut
intégral), le standalone (sélecteur présent, fence intacte, `--check` vert).

**Lot 4 — hors spec.** Les directions réelles : la console v2 retravaillée, ou autre
chose. Chacune n'est plus qu'un dossier. Les verdicts des six planches de la branche
`refonte-retrofuturiste` gardent leur régime — au propriétaire, sur pièces.

## 11. Ce que ce chantier ne fait pas

- Il ne juge aucune planche et ne retravaille pas la v2 : elle deviendra une charte
  *quand sa direction sera arrêtée*.
- Il ne touche ni au carnet (gamme, colonne, 3 `:root` — piège n°4), ni à la branche
  `refonte-retrofuturiste` (consigne du 27/07), ni à la CSP, et n'inline aucune police.

## 12. Les pièges de CLAUDE.md, mappés

- **n°2** (`transition:all`) → étendu à `regles.css` (garde 2c).
- **n°3** (`font-size:22px` sur `body`) → inchangé ; les tailles restent hors contrat.
- **n°4** (les 3 `:root` du carnet, valeurs mesurées) → carnet hors périmètre.
- **n°5** (tokens byte-identiques) → devient « corps identique par charte, sélecteur
  variable », garde 3.
- **n°8** (`theme` de vocabulaire) → collision évitée par le nom « charte » (§ 2).
- **n°10/11** (stamp `sw.js`, fence `ONLINE-ONLY`) → inchangés ; le sélecteur vit hors
  fence.
- **n°13** (défauts invisibles au banc téléphone) → la recette du lot 1 impose les cinq
  largeurs bureau.
