---
target: vocabulaire_hebreu.html (le carnet)
total_score: 26
p0_count: 1
p1_count: 2
timestamp: 2026-07-21T09-22-31Z
slug: vocabulaire-hebreu-html
---
Method: dual-agent (A : revue design WebKit iPhone + 5 largeurs desktop · B : détecteur + mesures déterministes)

# Critique impeccable — `vocabulaire_hebreu.html` (le carnet)

Phase 3 (présentation) de l'audit du carnet. Sidecar `.impeccable/design.json` rafraîchi AVANT l'audit (critère du plan). Chaque finding est rattaché à une règle nommée de DESIGN.md ou explicitement écarté comme hors-charte.

## Design Health Score — 26/40 (« Acceptable, améliorations significatives avant que les utilisateurs soient heureux »)

| # | Heuristique | Note | Constat clé |
|---|---|---|---|
| 1 | Visibilité de l'état | 2 | `#voc-search-count` sans `aria-live`/`role="status"` ; l'état « 0 résultat » affiche quand même des sections ; aucun repère de position sur 203 332 px (~300 écrans iPhone) |
| 2 | Correspondance monde réel | 4 | Français impeccable, tutoiement constant, notes « droite→gauche », RTL réel |
| 3 | Contrôle & liberté | 3 | × 44 px qui restaure et re-focalise ; mais aucun retour-sommaire sur 203k px |
| 4 | Cohérence & standards | 3 | Voix Title tenue (`thead th`, `.subtheme` conformes) ; mais `h2 .count` = 3ᵉ emploi mono hors inventaire, double anneau au focus du champ |
| 5 | Prévention des erreurs | 3 | `norm()` tolère accents et nikoud ; pas de repli lettres finales (ם/מ) |
| 6 | Reconnaissance > rappel | 1 | Sur iPhone chaque table s'ouvre sur sa FIN (mot-vedette hors-champ) ; 6 sections sur 28 absentes du sommaire |
| 7 | Flexibilité & efficacité | 3 | Recherche multi-champs + ancres + sticky ; rien pour naviguer en profondeur |
| 8 | Esthétique & minimalisme | 2 | Prose et word-lists superbes ; rangs de table ~274 px essentiellement vides |
| 9 | Réparation des erreurs | 2 | Bonne copie « 0 résultat » contredite par l'écran ; `.empty` jamais instancié (CSS mort) |
| 10 | Aide & documentation | 3 | Le carnet est sa propre doc ; la cursive dorée sans clé de lecture près des premières tables |
| **Total** | | **26/40** | |

## Verdict anti-patterns

**Pas de l'AI slop.** Aucun side-stripe, gradient text, hero-metric, marqueur 01/02/03 ; identité bilingue impossible à confondre avec une page générée. Réserves : la barre de recherche collante est du glassmorphism-lite (`rgba(…/.86)` + `backdrop-filter:blur(10px)` — motif des anti-références SaaS de PRODUCT.md), placeholder tronqué sur iPhone.

**Détecteur (B, déterministe)** : CLI = 2 findings — `design-system-radius` (ligne 337, `mark.hl` à 3px hors échelle : réel, P3) et `em-dash-overuse` (faux positif documenté, règle anglophone). Overlay headless = 156 signalements dont **123 `low-contrast` FAUX POSITIFS** (le détecteur calcule contre un fond blanc : il ne résout pas le dégradé nuit d'encre — contraste réel vérifié AA par l'audit du 19/07), 30 `cramped-padding` sur les `.table-wrap` (conteneurs de défilement sans padding propre : conception, pas défaut), 3 `all-caps-body` (voix Title licenciée — capitales espacées inventoriées §3).

**Convergences A/B** : 0 débordement horizontal du document aux 6 largeurs (1440/1280/992/900/768 + iPhone 16 Pro) — critère d'acceptation de la phase ATTEINT ; or ≤ 1,07 % de l'écran (plafond ~10 %) ; 0 cible tactile < 44 px ; anneau de focus doré présent au clavier ; 5234 nœuds `lang="he"`.

## Impression générale

Le système visuel tient : la lampe, la vedette, la rampe et les deux colonnes sont visibles à la mesure, pas seulement écrites. Le défaut central est UN composant : **la table de vocabulaire n'a jamais été conçue pour 402 px** — elle s'ouvre sur sa fin, montre le pluriel d'un mot invisible, et impose le pire geste du tactile (scroll horizontal dans du scroll vertical) sur les 31 tables. La plus grande opportunité : rendre les rangs de table en cartes empilées sous ~640 px.

## Ce qui marche

1. **La typographie tient à la mesure** : h1 36,8 px (= `--pas-titre`), body 22 px/lh 1,55, hébreu plus grand que sa traduction dans chaque composant observé — règle de la vedette visible.
2. **La lampe est disciplinée en pixels** : or mesuré à 1,07 % / 0,65 % / 0,48 % de trois écrans ; un seul CTA doré.
3. **La règle des deux colonnes fonctionne aux cinq largeurs desktop** : prose 410 px, tables plafonnées à 894 px, zéro défilement de page.

## Problèmes prioritaires

1. **[P0] Toutes les tables s'ouvrent sur leur fin en mobile.** `.table-wrap` (LTR) contient `table{direction:rtl}` : scrollLeft initial = bord gauche = FIN de la table RTL. Le mot-vedette (`.he`, x=609 pour 402 px de viewport) est hors-champ ; l'écran montre pluriel + genre + boîte vide. B corrobore : 31/31 tables défilent en interne sur iPhone (wrap 364, contenu 640–890). **Règle de la vedette** — l'hébreu principal est hors-scène pendant que son pluriel occupe la lumière. *Fix* : `direction:rtl` sur `.table-wrap` (l'origine de scroll passe à droite) ou `scrollLeft` initial ; correctif de fond commun avec le P2 n°5 (rangs en cartes < 640 px). Vérif A/B émulé + mobile identique au pixel ailleurs + confirmation on-device.
2. **[P1] L'état « 0 résultat » est cassé et `.empty` est du CSS mort.** Le test de visibilité (`b.querySelector('li:not(.search-hidden)')`, ~ligne 6476) attrape les `ul.exemples > li` des tables, jamais marqués cachés → sections affichées sous « 0 résultat », et le pointillé `.empty` — licencié pour ce cas précis — n'est jamais instancié. **Règle : le pointillé réservé au vide** (la règle existe, son objet n'existe pas). *Fix* : scoper à `ul.word-list > li:not(.search-hidden)` + instancier `.empty` quand `shown === 0`.
3. **[P1] La recherche renvoie des leçons, pas des mots.** Une section reste entièrement visible dès qu'un `.example` matche (prose et recette comprises) et `highlight()` ignore `.ex-fr`/`.ex-tr` : la correspondance n'est même pas surlignée. « maison » → 18 résultats dont toute la leçon du passé en tête. **Aucune règle nommée — défaut d'architecture d'information et de feedback** (pas une préférence personnelle : Nielsen 1 et 6 le portent). *Fix* : ne montrer que le bloc matché (ou masquer la prose des sections retenues par un exemple) + étendre le surlignage aux `.ex-*`.
4. **[P2] Le sommaire ment par omission : 6 sections sur 28 sans pilule** — `sec-adverbes`, `sec-nombres-11-plus`, `sec-nombres-ordinaux`, `sec-phrases`, `sec-saisons-mois`, `sec-verbes-modaux` (vérifié au grep). « Phrases » est le contenu que PRODUCT.md désigne comme la fin. **Aucune règle nommée — architecture d'information.** *Fix* : compléter le sommaire ; en profiter pour scinder le groupe de 13 pilules de la Partie 1 (charge cognitive).
5. **[P2] Rangs de table ~274 px, essentiellement vides.** `th,td{white-space:nowrap}` + bloc d'exemples logé dans la seule cellule Singulier : pluriel et genre flottent dans du vide, à toutes les largeurs. **Aucune règle nommée — composition.** *Fix mobile* : rangs en cartes empilées (he → cursive → tr → fr → exemple) sous ~640 px — c'est aussi le vrai correctif du P0.

## Findings de charte annexes (à trancher)

- **Pastilles `.steps li::before` : disques or PLEINS au repos** (26 px, `background:var(--gold)`). Ni action, ni sélection, ni identité — après `.part` (19/07) et `.tip` (19/07), ce sont les dernières surfaces dorées au repos du carnet. **Règle de la lampe**, P2. *Fix candidat* : filet or, fond transparent, chiffre or.
- **`h2 .count` en JetBrains Mono bas-de-casse** : 3ᵉ emploi mono hors des deux voix inventoriées (Label = translittérations/compteurs ; Repère-mono = repère structurel). **Inventaire des voix**, P3 — à trancher : le déclarer (c'est un libellé-clé d'extraction) ou le retyper.
- **Double anneau au focus du champ de recherche** (bordure or + outline or). **Idiome de l'anneau** (app.html référence), P3.
- **Barre de recherche : `backdrop-filter:blur(10px)`** — glassmorphism-lite, anti-référence SaaS de PRODUCT.md ; fonctionnellement, du texte fantôme transparaît au scroll. P3 — alternative : fond opaque `--bg2`.
- **`tbody tr:hover` teinté d'or** sur un rang non interactif — la lampe éclaire un non-geste. P3.
- **`mark.hl` radius 3px** hors échelle des rayons (détecteur). P3 — passer à 4px (`kbd`) ou déclarer l'exception.

## Red flags par persona

**Jordan (débutant, iPhone)** : première table = « אֲנָשִׁים · m » + boîte vide → conclut à une page cassée ; « maison » → leçon du passé sans surlignage ; « Phrases » introuvable au sommaire ; 3 graphies sans légende à proximité.
**Sam (lecteur d'écran/clavier/zoom 200 %)** : compteur de résultats muet (pas d'`aria-live`) ; pas de skip-link (CTA → champ → × → 22 pilules avant le contenu) ; `<th>` sans `scope` sur 31 tables ; cellule Singulier lue d'une traite (mot + exemple + translittération). Points forts réels : `lang` exhaustif, hiérarchie h1→h2→h3 propre, zoom 200 % sain.
**Casey (une main, interrompu)** : scroll horizontal obligatoire dans chaque table, retour d'interruption sur la colonne pluriel ; recherche collante = 14 % du viewport en permanence ; perdu à 150k px sans retour-sommaire.

## Observations mineures

- Placeholder de recherche 55 caractères, tronqué ~44 sur iPhone — raccourcir (l'`aria-label` porte le détail).
- Fin de page : le document s'arrête sur le filet du dernier rang (« je suis perdu (m.) ») — pas de clôture, pas de retour sommaire. Un carnet « qu'on aime rouvrir » mérite un colophon d'une ligne.
- Le clear de la recherche restaure le sommaire sans re-scroll : après un clear en profondeur, on reste perdu.
- 🎴 et 💡 en tofu dans WebKit headless — artefact d'émulation, à revérifier on-device seulement si les polices bougent.
- Dérive documentaire (pas un défaut de la page) : les docs disent « 29 tables » — il y en a 31 depuis les lots 3–4 du 21/07 ; à 768 px, 8 tables défilent en interne (les docs disent 7). `lang="he"` : 5234 mesurés (docs : 5015).
- Caractères par ligne : médiane ~43 (lignes pleines) sur les 5 paragraphes de grammaire mesurés à 1440, sous la cible 45–75 — MAIS ces blocs sont truffés d'hébreu en 1.15em, plus large que l'avance du français pur sur laquelle `--colonne` est calibrée (6,63 px/car). Pas une violation de la règle des deux colonnes ; à garder en tête si la prose s'enrichit encore en hébreu.

## Questions à considérer

1. Le carnet se lit « surtout sur iPhone » — pourquoi son composant central, la table, est-il le seul jamais conçu pour 402 px ?
2. La recherche veut-elle filtrer un document ou trouver un mot ? Une liste de résultats (comme dans l'app) serait-elle plus honnête que la chirurgie d'affichage sur 203k px ?
3. Que coûterait un colophon d'une ligne + retour sommaire pour que la dernière impression ne soit pas une bordure de table ?
