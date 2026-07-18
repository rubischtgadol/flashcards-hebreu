# Product

## Register

product

## Platform

web

## Users

Ruben d'abord, et ses proches (famille, amis) qui apprennent aussi l'hébreu moderne. Contexte d'usage : sessions de révision courtes, souvent sur iPhone (PWA installée), parfois hors connexion. Le travail à accomplir : réviser le vocabulaire et les phrases du carnet jusqu'à ce qu'ils tiennent en conversation. Public francophone exclusivement — toute l'interface est en français.

## Product Purpose

Une boîte à outils d'apprentissage de l'hébreu moderne : un carnet de grammaire et de vocabulaire (source unique du contenu) couplé à une app de flashcards qui en extrait les cartes (flip, saisie tolérante, QCM, révision espacée Leitner). Le succès n'est pas la maîtrise du carnet pour elle-même : c'est de pouvoir tenir une conversation simple en hébreu. Le vocabulaire est un moyen, l'aisance orale est la fin — d'où l'audio (synthèse vocale hébreu), les phrases complètes et la translittération pensée pour un francophone.

## Positioning

Une app de révision complète qui marche dans l'avion : hors-ligne, sans compte, sans abonnement, sans dépendance — des fichiers HTML autonomes qu'on possède vraiment.

## Brand Personality

Calme, chaleureux, studieux. L'ambiance d'un carnet d'étude du soir : fond sombre, or doux, sérénité. L'interface encourage sans s'agiter ; le contenu hébreu (grands caractères, nikoud) est la vedette, l'UI l'écrin.

## Anti-references

- **Duolingo et la gamification** : pas de mascotte, pas de streaks culpabilisants, pas de confettis ni d'XP. La motivation vient du contenu et de la progression réelle (boîtes Leitner), pas de mécaniques de rétention.
- **L'app SaaS générique** : pas de dégradés violets, pas de cards partout, pas d'esthétique start-up interchangeable.
- **Le manuel scolaire austère** : éviter le côté Bescherelle — sec, gris, intimidant. La grammaire doit donner envie.

## Design Principles

1. **L'hébreu est la vedette** — les caractères hébreux et le nikoud priment sur tout le reste : grands, nets, contrastés. L'UI s'efface devant le contenu.
2. **Le calme soutient l'étude** — pas d'agitation visuelle ni de célébrations bruyantes ; le feedback est net (vert/rouge) mais serein.
3. **Taillé pour un francophone** — translittération au standard maison, correction tolérante, clavier israélien intégré : rien n'est traduit de l'anglais, tout est pensé en français.
4. **Ça marche dans l'avion** — chaque choix de design doit survivre au hors-ligne total : pas de ressource distante, pas de compte, pas de dépendance.
5. **Carnet et app, une seule charte** — le carnet est la référence visuelle ; l'app en hérite (`:root` identique) pour que réviser et consulter soient un même lieu.

## Accessibility & Inclusion

Pas d'exigence WCAG formelle, mais une priorité absolue : la lisibilité de l'hébreu et du nikoud (grands caractères — base 22px, contraste élevé sur fond sombre). Les bonnes pratiques standard s'appliquent : `prefers-reduced-motion` déjà respecté globalement, cibles tactiles confortables sur mobile, contraste AA quand c'est naturel.
