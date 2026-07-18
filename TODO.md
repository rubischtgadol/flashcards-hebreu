# État du projet et travail restant

État au 2026-07-18. Le plan d'amélioration UX est **terminé** : intégrité du verdict,
accessibilité des trois modes, allègement de l'accueil, niveaux de difficulté (CECRL),
exemples en situation, puis re-mesure UX finale à **34/40** (progression 28 → 33 → 34,
détecteur de qualité à 0 finding — snapshots dans `.impeccable/critique/`). Ce qui reste
relève du contenu (relectures éditoriales, lots d'exemples) et de quelques pistes de design
non tranchées.

## Fait (historique compact — détail dans les messages de commit)

- **[x] Intégrité du verdict** (`b727bd3`) : verdict annulable dans les trois modes
  (« Corriger » en QCM, « Annuler la dernière réponse » en Cartes avec restauration
  SRS/compteurs/position), Entrée sur champ vide = no-op, requête de recherche échappée.
- **[x] Égalité des trois modes** (`66b3264`) : verso annoncé aux lecteurs d'écran
  (`#flip-live`), clavier QCM (1–4, Entrée/Espace), `role="group"` sur les `.seg`,
  touche P « prononcer ».
- **[x] Accueil allégé** (`83c5a0c`) : pli « Réglages avancés » (details natif :
  Ordre/Longueur/Prononciation), « Commencer » collant sous le pouce en tactile,
  premier lancement tout sélectionné sauf Phrases, note pédagogique sous le Mode.
- **[x] Mineures** (`f4bb468`) : ligne « Session interrompue — X/Y déjà comptées »,
  « Rejouer ces N cartes », effet Sisyphe expliqué en fin de révision, distracteurs QCM
  sans quasi-synonymes.
- **[x] Niveaux de difficulté (CECRL)** (`80bb861`) : les 709 mots du carnet classés via
  `data-niveau` (A1 327 · A2 268 · B1 107 · B2 7 — méthode dans ARCHITECTURE.md §4),
  mappés en quatre paliers dans l'app (Facile = A1, Intermédiaire = A2–B1,
  Difficile = B2–C1, Expert = C2). Chips multi-sélection sous les catégories, construites
  depuis les données (un niveau vide n'affiche pas de chip), filtre croisé
  catégories × niveau dans `start()`, révision du jour volontairement non filtrée,
  préférences rétro-compatibles, garde-fou `EXPECTED_LEVELS` dans build.js.
- **[x] Exemples en situation** (`38c9261`) : sous-listes `<ul class="exemples">` dans le
  carnet (hébreu nikud + translittération + français), extraites en `card.exemples` dans
  les deux implémentations, pli « Voir un exemple » sur le verso des Cartes, le feedback
  de Saisie et le verdict du QCM (jamais côté question en fr→he), exemples dans le tiroir
  de la recherche, bouton Écouter par phrase. Lot pilote : 77 exemples sur les mots A1.
- **[x] Re-mesure UX + correctifs** (`ed9e51b`) : score 34/40. Le problème majeur trouvé
  (Entrée/Espace sur un bouton du feedback de Saisie avançaient la carte au lieu d'activer
  le bouton) est corrigé — garde « bouton focalisé » aligné sur celui du QCM, en Saisie et
  en Cartes. Avec lui : « Commencer — N cartes » vivant (croisement catégories × niveau,
  borné par la Longueur), note « mot non classé reste visible » sous le groupe Niveau,
  l'exemple déplié entre dans le champ (`scrollIntoView`), le pli « Réglages avancés »
  affiche ses valeurs mémorisées.

Décisions actées (ne pas re-débattre sans nouvelle demande) :
- L'écran de réglages reste le premier écran ; la hiérarchie de l'accueil est tranchée.
- La révision du jour ignore le filtre Niveau : une carte apprise reste due.
- Un mot sans `data-niveau` reste visible quel que soit le filtre (le carnet s'annote
  progressivement sans jamais perdre une carte) — et l'interface le dit.

## Ce qui reste

### Relectures éditoriales (contenu, par échantillons)
- **Classement CECRL** : relire des échantillons par section et corriger les
  `data-niveau` directement dans `vocabulaire_hebreu.html`, puis `node build.js`.
  Les cas limites ont été tranchés « vers le bas » (mieux vaut découvrir un mot trop tôt).
- **Lot pilote d'exemples (77)** : relire nikud, ton et translittération (standard maison,
  cf. README) directement dans le carnet.
- **Lots d'exemples suivants** : d'abord les mots A1 restants (noms, expressions,
  interrogatifs…), puis A2 — ligne éditoriale dans ARCHITECTURE.md §5 (phrases de
  4–8 mots, présent, vocabulaire de l'exemple ≤ niveau du mot, une situation concrète
  du quotidien par phrase).

### Contrôle visuel navigateur (mobile)
Rien n'a été vérifié dans un vrai navigateur depuis la refonte (les vérifications ont été
faites en DOM simulé). À regarder en priorité : le pli et le bouton collant de l'accueil,
et la frontière défilement/tap de la carte (`#flip`) sur iOS quand la face déborde
(`bindTap` + `preventDefault()` sur `pointerup`).

### Pistes de design ouvertes (non tranchées — demandent une décision produit)
- **Deux « lampes » sur l'accueil** : la carte « Révision du jour » (l'action quotidienne
  que le système veut encourager) rivalise avec « Commencer », qui reste le bouton le plus
  doré et le plus accessible au pouce. Faut-il inverser la hiérarchie ?
- **« Facile » comme vrai contrat** : masquer les mots non classés quand un niveau est
  coché, plutôt que les laisser passer ? (Théorique tant que tout le carnet est classé.)
- **La place de la recherche** : le dictionnaire trône en tête de l'écran de réglages —
  est-ce le bon premier écran pour lui ?

### Backlog mineur (issu de la dernière revue UX)
- Le libellé « tout sélectionner » (`#selall`) ne change pas quand tout est déjà coché.
- « Voir un exemple » (`.ex-toggle`) ne devient pas « Masquer l'exemple » une fois ouvert.
- Taper une rangée de résultat de recherche déclenche à la fois l'audio et le dépliage.
- Pas de raccourci clavier pour « Corriger » / « Annuler la dernière réponse ».
- `#flip-live` n'annonce pas l'existence d'un exemple à déplier aux lecteurs d'écran.
- En QCM avec « Phrases » cochée, quatre phrases empilées font des boutons très hauts
  sur petit écran.

## Rituel à chaque modification

1. `node build.js` — régénère `flashcards_hebreu.html` ; échec si une section ou un
   niveau attendu tombe à 0 ; vérifier les comptes affichés (sections, niveaux, exemples).
2. Vérifier le comportement : dans un navigateur (`python3 -m http.server` puis
   `http://localhost:8000/`), ou sans navigateur avec un script Node + jsdom jetable qui
   boote `flashcards_hebreu.html` (cf. ARCHITECTURE.md « Développement et déploiement »).
3. Si `sw.js`, la liste d'assets ou les icônes changent : incrémenter `VERSION` dans `sw.js`.
4. Commit par changement, messages en français (comme l'historique), puis push sur `main`
   (GitHub Pages redéploie automatiquement).
5. Documentation à jour : README, ARCHITECTURE, CLAUDE.md, DESIGN.md, et ce fichier.
