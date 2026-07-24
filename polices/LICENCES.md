# Polices embarquées — sous-ensembles et licences

Ces fichiers sont des **sous-ensembles** (quelques glyphes : שָׁלוֹם שלום ▸ CARTE 0421 · SHALOM)
des polices d'origine, produits avec `fontTools.subset` pour la planche
[specimen-monospace-hebreu.html](../specimen-monospace-hebreu.html). Ce sont donc des versions
**modifiées**, redistribuées sous la licence de l'original, exception d'incorporation comprise et
étendue à ces versions comme la licence l'autorise explicitement.

| Fichier | Police d'origine | Licence | Source |
|---|---|---|---|
| `MiriamMonoCLM.woff2`, `MiriamMonoCLM-Bold.woff2` | Miriam Mono CLM (projet Culmus 0.140) | GNU GPL v2 **avec exception d'incorporation dans un document** | `deb.debian.org/debian/pool/main/c/culmus/` · culmus.sourceforge.net |
| `FreeMono.woff2` | GNU FreeFont FreeMono (20120503) | GNU GPL v3 avec exception de fonte | `ftp.gnu.org/gnu/freefont/` |
| `Unifont.woff2` | GNU Unifont 14.0.04 | GNU GPL v2+ avec exception de fonte (double licence OFL pour certaines parties) | `unifoundry.com/pub/unifont/` |
| `UnifontNikoud.woff2` | GNU Unifont 14.0.04, **modifiée** (voir ci-dessous) | idem — la GPL autorise la modification, à condition de la signaler | idem |
| `TerminusTTF.woff2` | Terminus TTF 4.49.3 | SIL Open Font License 1.1 | `files.ax86.net/terminus-ttf/` |

Les originaux non modifiés restent disponibles aux sources ci-dessus. Terminus figure sur la
planche comme **contre-exemple** : elle ne porte aucune marque vocalique.


## `UnifontNikoud.woff2` — ce qui a été modifié

Version modifiée de GNU Unifont, produite par [`repare_unifont.py`](repare_unifont.py) (versionné
ici, donc reproductible). Le nom de famille est changé en **« Unifont Nikoud »** pour qu'elle ne se
fasse pas passer pour l'originale, et la nature des changements est inscrite dans ses métadonnées
(champ `name` 10).

Modifications, mesurées avant/après sur [unifont-nikoud-repare.html](../unifont-nikoud-repare.html) :

- **Onze marques vocaliques du dessous et le dagesh redessinés** en rectangles alignés sur la
  grille d'Unifont (1 px = 64 unités, em 1024), à chasse nulle. Dans l'original elles faisaient la
  largeur d'une lettre — le qamats mesurait 42 px là où la lettre en fait 42 ; il en fait 18 après.
- **Tables `GDEF` et `GPOS` ajoutées** : les marques sont déclarées comme telles et chacune des
  27 lettres reçoit un point d'accroche calculé sur son encre, calé sur la grille. L'écart sous la
  lettre passe de 0 à 6 px, et la lettre n'est plus repoussée vers le bas par le moteur.
- **Les lettres ne sont pas touchées.** Les trois marques du dessus (holam, points shin et sin)
  gardent les glyphes d'origine : leur redessin déclenche un défaut de rendu non élucidé, et la
  mesure montre qu'elles se posaient déjà correctement.
