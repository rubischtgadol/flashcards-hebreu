# Prompt de reprise — branche `refonte-retrofuturiste`

Le texte ci-dessous se copie tel quel dans une session neuve. Il est **autoportant** : il ne
suppose aucune mémoire de la session précédente, et il porte l'état arrêté au 2026-07-25.

> ⚠️ **À tenir à jour** : ce prompt vaut ce que vaut son bloc ÉTAT. À la fin de chaque session qui
> arbitre quelque chose, le mettre à jour ici — sinon la session suivante voudra « réparer » des
> décisions prises exprès. Les décisions elles-mêmes vivent dans `TODO.md` « Reprendre ici » et
> dans le spec ; ce fichier n'en est que le résumé de passation.

---

```
Chantier : la charte graphique v2 « La console d'étude » (direction artistique).

BRANCHE DE TRAVAIL : refonte-retrofuturiste
RÉPERTOIRE DE TRAVAIL : ~/dev/flashcards-hebreu-refonte  (worktree lié)
DISTANT : origin/refonte-retrofuturiste

Premier geste, avant toute autre chose — vérifie que tu es au bon endroit :
    git -C ~/dev/flashcards-hebreu-refonte branch --show-current
Ça doit afficher exactement « refonte-retrofuturiste ». Si le répertoire n'existe
pas, recrée le worktree :
    git -C ~/dev/flashcards-hebreu worktree add ~/dev/flashcards-hebreu-refonte refonte-retrofuturiste

Tous les chemins, lectures, éditions, git add/commit/push de cette session se font
dans ~/dev/flashcards-hebreu-refonte. Utilise « git -C ~/dev/flashcards-hebreu-refonte … »
ou place-toi dedans : le shell se réinitialise sur ~/dev/flashcards-hebreu entre les
commandes, c'est un piège avéré.

INTERDIT : toucher à la branche main, au checkout principal ~/dev/flashcards-hebreu,
ou à quoi que ce soit hors de ce worktree. Ne merge pas, ne rebase pas, ne
cherry-pick pas depuis main sans me le demander — la branche porte un doublon
périmé de data/ (voir le PIÈGE AU MERGE dans TODO.md ; divergence mesurée le
25/07 : 30 commits de retard, 28 d'avance).

Commence par lire le « Reprendre ici » de TODO.md dans ce worktree : il est
autoportant et s'ouvre sur un état de fin de session daté du 25/07.

ÉTAT — la direction artistique est SOLDÉE en v0.6, ne la remets pas en question :
  - les trois calques CRT (bruit, vignettage, scintillement) ont été jugés sur
    iPhone réel et TOUS retirés ; la charte n'a plus aucun effet de surface
    d'écran. Le tableau des deux passations est au spec § 5 — leur absence n'est
    pas un oubli ;
  - l'hébreu reste en Frank Ruhl Libre. L'exploration typographique (4 planches +
    une fonte Unifont réparée) est CLASSÉE, conservée au cas où : ne pas rouvrir ;
  - la page-témoin prototype-nerv.html FAIT FOI en cas d'écart avec le spec
    (docs/superpowers/specs/2026-07-24-charte-retrofuturiste-design.md).

CE QUI RESTE, dans l'ordre du TODO :
  2. prélever les ANIMATIONS et éléments graphiques de SENTRY — la charte est
     aujourd'hui entièrement statique (une seule animation subsiste, le bandeau de
     boot). Les deux liens de la référence, la méthode d'extraction et l'inventaire
     du déjà-prélevé sont dans REFERENCES_SENTRY.md ;
  3. concevoir le système de thèmes (deux chartes coexistantes + sélecteur à
     l'accueil, spec § 7) — idée cadrée, rien de planifié ;
  4. le portage sur les vraies surfaces, qui attend la fin de la réorganisation du
     dépôt sur main.

OUTILLAGE : Playwright + WebKit en émulant l'iPhone 16 Pro (jamais Chrome headless,
il pend en WSL2). Piège payé : une fonte ou une page déclarée mais non utilisée
n'est jamais chargée — vérifier que la mesure porte bien sur la bonne cible avant
d'en tirer une conclusion. Autre piège payé : le miroir raw.githack met en cache
par fichier et sans le signaler ; après un push, ouvrir les liens avec un suffixe
?v=<n> incrémenté, ou le SHA du commit à la place du nom de branche.

Aujourd'hui je veux : <écris ici ce que tu veux faire>
```

---

## Pourquoi le bloc ÉTAT existe

Trois décisions de cette branche ressemblent à du travail inachevé quand on arrive sans contexte :

1. **Aucun effet de surface d'écran** — les trois calques CRT ont été prélevés sur la référence,
   validés en émulation, puis rejetés sur l'appareil. Une session neuve les verrait manquer et
   voudrait les remettre.
2. **Le nikoud de GNU Unifont réparé mais non retenu** — le travail est là, versionné et
   reproductible ; il a été jugé insuffisant. Ce n'est pas un chantier à finir.
3. **L'hébreu en Frank Ruhl Libre** — la question a été rouverte le 25/07, tout le catalogue
   passé en revue, puis refermée sur le même choix.

## Une péremption à connaître

Le chantier des **animations** dépend de deux adresses de service tiers (`REFERENCES_SENTRY.md`).
Elles peuvent tomber. Ce qui a déjà été prélevé est à l'abri dans le spec et les prototypes, mais
le gisement restant, lui, disparaîtrait avec elles — d'où l'intérêt d'attaquer ce chantier-là
avant les deux autres, alors même que le portage semble plus urgent.
