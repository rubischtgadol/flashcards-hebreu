# Audit du carnet — rapport de phase 3 (présentation), 2026-07-21 (session 9)

Phase 3 du plan [`2026-07-20-audit-carnet-plan.md`](2026-07-20-audit-carnet-plan.md),
déclenchée sur feu vert de Ruben (21/07, session 9). Analyse pure : **aucune
correction écrite** — les lots attendent ses décisions (§ 5). La critique complète
vit dans le snapshot
[`.impeccable/critique/2026-07-21T09-22-31Z__vocabulaire-hebreu-html.md`](../../../.impeccable/critique/2026-07-21T09-22-31Z__vocabulaire-hebreu-html.md) ;
ce rapport n'en répète que les verdicts.

## 1. Méthode et critères d'acceptation

Protocole de la critique impeccable, **dual-agent** : Assessment A (revue design,
WebKit réel, iPhone 16 Pro émulé + 5 largeurs desktop 1440/1280/992/900/768,
18 captures dont 14 relues) et Assessment B (détecteur CLI + overlay + mesures
déterministes aux 6 configurations), isolés l'un de l'autre, synthèse au fil
principal. Le sidecar `.impeccable/design.json` (périmé du 18/07) a été régénéré
depuis DESIGN.md **avant** l'audit, comme le plan l'exige.

Les trois critères du plan :

- [x] **Sidecar rafraîchi avant l'audit** — schemaVersion 2, 16 couleurs, 22 jetons
  typo, 11 règles nommées, 10 composants (le pli et l'encadré attention ajoutés).
- [x] **0 débordement horizontal aux six largeurs** — mesuré par B :
  `scrollWidth == clientWidth` aux 6 configurations. (« Mobile identique au
  pixel » : sans objet en analyse pure ; le critère s'appliquera au lot de
  correction.)
- [x] **Chaque finding rattaché à une règle nommée ou écarté** — voir snapshot ;
  les P1 n°3 et P2 n°4–5 sont explicitement « aucune règle nommée » (défauts
  d'architecture d'information et de composition, pas des préférences).

## 2. Ce qui est au vert (mesuré)

- **Règles nommées, contrôle mécanique au fil principal** : aucune
  `transition:all` (seule occurrence = le commentaire qui l'interdit) ; pointillé
  réservé à `.empty` ; 100 % des `font-size` sur la rampe de 8 pas + exception
  nommée `1.15em` (×3) ; or en fond uniquement sur survol/sélection
  (`::selection`, `tr:hover` 6 %, `mark.hl`) ; `:focus-visible` doré global sans
  `border-radius` ; 4 piles de polices complètes ; `prefers-reduced-motion` avec
  `scroll-behavior:auto` ; **bloc `:root` partagé identique au octet dans les
  trois fichiers** (diff vide).
- **Règles nommées, contrôle visuel (A)** : lampe à 1,07 / 0,65 / 0,48 % d'or sur
  trois écrans (plafond ~10 %) ; vedette tenue dans chaque composant observé ;
  deux colonnes : prose 410 px, tables plafonnées 894 px, zéro défilement de page
  aux 5 largeurs desktop.
- **Mesures B** : 0 cible tactile < 44 px sur iPhone (24 éléments interactifs) ;
  **5234 nœuds `lang="he"`** ; détecteur CLI quasi muet (1 advisory réel).

## 3. Les findings (résumé — détail et fixes au snapshot)

**Score : 26/40** (le portail était à 30/40 le 18/07, l'app à 30/40 le 19/07).
1 P0, 2 P1, 2 P2 + micro-findings de charte :

| Sév. | Finding | Règle nommée |
|---|---|---|
| P0 | Les 31 tables s'ouvrent sur leur FIN en mobile (`table{direction:rtl}` dans un wrap LTR : le mot-vedette est hors-champ, l'écran montre pluriel+genre d'un mot invisible) | La vedette |
| P1 | État « 0 résultat » cassé (le test de visibilité attrape les `li` d'exemples des tables) et `.empty` jamais instancié — CSS mort | Le pointillé réservé au vide |
| P1 | La recherche renvoie des leçons entières, pas des mots ; `highlight()` ignore `.ex-fr`/`.ex-tr` | Aucune — architecture d'information |
| P2 | Sommaire : 6 sections sur 28 sans pilule (dont **Phrases**) ; Partie 1 = 13 pilules d'un bloc | Aucune — architecture d'information |
| P2 | Rangs de table ~274 px essentiellement vides (`nowrap` + exemples logés dans la cellule Singulier) | Aucune — composition |
| P2 | Pastilles `.steps li::before` : disques **or pleins au repos** (26 px) — les dernières surfaces dorées au repos du carnet après `.part` et `.tip` | La lampe |
| P3 | `h2 .count` en mono bas-de-casse : 3ᵉ emploi hors des deux voix inventoriées | Inventaire des voix |
| P3 | Double anneau au focus du champ de recherche ; barre collante en `backdrop-filter:blur` (anti-référence SaaS) ; `tr:hover` doré sur rang non interactif ; `mark.hl` radius 3px hors échelle ; placeholder tronqué iPhone ; fin de page sans clôture | Diverses (au snapshot) |
| P2 (a11y) | `#voc-search-count` sans `aria-live` ; pas de skip-link ; `<th>` sans `scope` | Aucune — accessibilité |

**Faux positifs consignés** : 123 `low-contrast` de l'overlay (le détecteur calcule
contre un fond blanc — il ne résout pas le dégradé nuit d'encre ; le contraste réel
a été vérifié AA le 19/07) ; `em-dash-overuse` (règle anglophone, documenté) ;
30 `cramped-padding` sur les `.table-wrap` (conteneurs de défilement, conception) ;
3 `all-caps-body` (voix Title licenciée).

## 4. Dérives documentaires relevées (à recaler, pas des défauts de la page)

- **31 `.table-wrap`, pas 29** : les tables de la note שֶׁ־ (lot 3) et du
  sous-thème « Santé & urgences » (lot 4) s'y sont ajoutées le 21/07 — vérifié aux
  commits `27cc300` et `98f5cad`. Les « 7 tables sur 29 » de DESIGN.md §3 et de
  CLAUDE.md (piège n°4) datent de la mesure du 20/07 sur 29 tables ; B mesure
  aujourd'hui **8 tables sur 31** en défilement interne à 768 px (3 à 900 px,
  0 à 992+). Le chiffre historique de l'expérience « 44rem » n'a pas été remesuré.
- **`lang="he"` : 5234 nœuds** (les docs disaient 5015, d'avant le lot santé) —
  CLAUDE.md recalé dans ce commit.
- **Caractères par ligne** : médiane ~43 (lignes pleines) sur les 5 paragraphes de
  grammaire mesurables à 1440 — sous la cible 45–75, mais ces blocs sont truffés
  d'hébreu en `1.15em`, plus large que l'avance du français pur (6,63 px/car) sur
  laquelle `--colonne` est calibrée. Pas une violation ; signal à surveiller.

## 5. Les lots possibles (décisions de Ruben)

Aucun n'écrit dans le carnet sans feu vert ; tous passent le rituel complet
(`build.js` + `--check`, WebKit A/B, mobile prouvé identique là où il doit
l'être, bump SW, docs). Contenu inchangé partout → **coût SRS : zéro** pour les
quatre.

1. **Lot tables mobiles** (le P0 + sa vraie solution) : origine de défilement
   corrigée (`direction:rtl` sur `.table-wrap` ou `scrollLeft` initial) et, au
   choix, rangs en cartes empilées sous ~640 px (P2 n°5 — soigne aussi les
   274 px de vide). Le plus gros gain utilisateur ; à valider on-device.
2. **Lot recherche** (les deux P1) : état « 0 résultat » réparé + `.empty`
   instancié ; sections retenues par un exemple sans leur prose + surlignage
   étendu aux `.ex-*` ; `aria-live` sur le compteur au passage.
3. **Lot sommaire** : les 6 pilules manquantes (dont Phrases) + scission du
   groupe de 13.
4. **Micro-lot charte** : pastilles `.steps` (filet or au lieu du plein),
   double anneau du champ, `mark.hl` 4px, placeholder raccourci, `h2 .count` à
   trancher (déclarer ou retyper), `backdrop-filter` à trancher.

## 6. Coût publié

~201k tokens de sous-agents (A : 138,6k ; B : 62,2k) — dans l'estimation du plan
(~200k). Fil principal : synthèse, greps de contre-vérification, aucune lecture
de fichier volumineux. Aucun plafond silencieux : les troncatures de A (11
captures non relues, redondantes aux mesures) et de B (bouton × non mesuré actif,
corpus CPL limité à 7 paragraphes par le fichier lui-même) sont écrites dans
leurs rapports respectifs, repris au snapshot.

## 7. Graphe et SW

Aucun changement structurel (sidecar, snapshot et rapports sont des données,
pas des nœuds du graphe) → pas de `/graphify --update`. Aucun fichier déployé
modifié → pas de bump SW.
