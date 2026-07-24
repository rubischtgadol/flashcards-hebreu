# Schéma des données (source de vérité du vocabulaire)

Ordre des entrées = ordre d'affichage dans le carnet. Champs `tr` : copiés du
carnet, autoritaires, jamais régénérés par he2tr. `he` garde la vocalisation.

## data/noms.json — [{ he, fr, genre: "m"|"f", pluriel: {he, tr}|null,
     niveau, theme, groupe, exemples: [{he, tr, fr}], note? }]
## data/adjectifs.json — idem noms, sans genre/pluriel, avec
     formes: [{he, tr}] ×3 (FS, MP, FP)
## data/verbes.json — idem, formes ×4 (MS, FS, MP, FP), exemple présent requis
## data/listes/<slug>.json — { section: "<label exact du span.count>",
     entries: [{ he, tr, fr, fr_court?, niveau, groupe?, exemples: [...], note? }] }

`groupe` = slug du <h3 class="subtheme"> englobant, sur les tables toujours et sur
les listes seulement quand la section comporte des sous-thèmes (ex. Adverbes,
Saisons & mois) — absent partout ailleurs.
Contraintes bloquantes : niveau ∈ {A1,A2,B1,B2} partout ; theme ∈ EXPECTED_THEMES
(build.js) pour noms/adjectifs/verbes ; ≥1 exemple pour noms/adjectifs/verbes ;
aucune section vide ; he/fr non vides.
