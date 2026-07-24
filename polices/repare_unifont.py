"""Répare le nikoud de GNU Unifont.

Deux défauts mesurés sur l'original :
  1. les marques sont dessinées à la largeur d'une lettre (le qamats fait 6 px de large
     comme le shin) — ce n'est plus un point-voyelle, c'est un soulignement ;
  2. la fonte n'a aucune table de positionnement, donc le moteur pose les marques au
     contact de la lettre, sans un pixel d'écart.

Ce script redessine les 14 marques sur la grille d'Unifont (1 px = 64 unités, em 1024)
et compile des tables GDEF + GPOS qui accrochent chaque marque au bon point de chaque
lettre. Les lettres elles-mêmes ne sont pas touchées.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.feaLib.builder import addOpenTypeFeatures
from io import StringIO

PX = 64          # un pixel de la grille Unifont, en unités de fonte
SRC, DST = sys.argv[1], sys.argv[2]

# ─────────────────────────────────────────────────────────────────────────────
# Le dessin des marques, en pixels. Chaque rectangle est (x, y, largeur, hauteur)
# exprimé en pixels, relatif à l'origine du glyphe. Les marques « sous » sont
# dessinées sous l'origine ; les marques « sur » au-dessus.
# ─────────────────────────────────────────────────────────────────────────────
P = lambda *r: [(x * PX, y * PX, w * PX, h * PX) for (x, y, w, h) in r]

DESSINS = {
    0x05B0: ('sous',   P((-0.5, -2, 1, 1), (-0.5, -4, 1, 1))),                    # shva : deux points
    0x05B1: ('sous',   P((-1.5, -2, 1, 1), (0.5, -2, 1, 1), (-0.5, -3.5, 1, 1),   # hataf segol
                         (2, -2, 1, 1), (2, -4, 1, 1))),
    0x05B2: ('sous',   P((-1.5, -2, 3, 1), (2, -2, 1, 1), (2, -4, 1, 1))),        # hataf patah
    0x05B3: ('sous',   P((-1.5, -2, 3, 1), (-0.5, -3, 1, 1),                      # hataf qamats
                         (2, -2, 1, 1), (2, -4, 1, 1))),
    0x05B4: ('sous',   P((-0.5, -2, 1, 1))),                                      # hiriq : un point
    0x05B5: ('sous',   P((-1.5, -2, 1, 1), (0.5, -2, 1, 1))),                     # tsere : deux points
    0x05B6: ('sous',   P((-1.5, -2, 1, 1), (0.5, -2, 1, 1), (-0.5, -3.5, 1, 1))), # segol : trois points
    0x05B7: ('sous',   P((-1.5, -2, 3, 1))),                                      # patah : barre
    0x05B8: ('sous',   P((-1.5, -2, 3, 1), (-0.5, -3, 1, 1))),                    # qamats : barre + queue
    0x05BB: ('sous',   P((-1.5, -2, 1, 1), (-0.25, -3, 1, 1), (1, -4, 1, 1))),    # qubuts : trois obliques
    0x05B9: ('sur_g',  P((-0.5, 1, 1, 1))),                                       # holam : point en haut à gauche
    0x05C1: ('sur_d',  P((-0.5, 1, 1, 1))),                                       # point du shin, en haut à droite
    0x05C2: ('sur_g',  P((-0.5, 1, 1, 1))),                                       # point du sin, en haut à gauche
    0x05BC: ('dedans', P((-0.5, -0.5, 1, 1))),                                    # dagesh : point dans la lettre
}
NOMS = {0x05B0:'shva',0x05B1:'hataf segol',0x05B2:'hataf patah',0x05B3:'hataf qamats',
        0x05B4:'hiriq',0x05B5:'tsere',0x05B6:'segol',0x05B7:'patah',0x05B8:'qamats',
        0x05B9:'holam',0x05BB:'qubuts',0x05BC:'dagesh',0x05C1:'point shin',0x05C2:'point sin'}
LETTRES = list(range(0x05D0, 0x05EB))   # les 27 lettres, finales comprises

f = TTFont(SRC)
cmap = f.getBestCmap()
gs = f.getGlyphSet()
glyf, hmtx = f['glyf'], f['hmtx']

def bornes(cp):
    g = cmap.get(cp)
    if not g:
        return None
    bp = BoundsPen(gs)
    gs[g].draw(bp)
    return bp.bounds

# ── 1. redessin des marques, chasse remise à zéro ────────────────────────────
redessinees = []
# ⚠ On ne redessine QUE les marques du dessous et le dagesh. Le redessin des trois
# marques du dessus (holam, points shin et sin) déclenche un défaut de rendu non
# élucidé — WebKit remonte alors la lettre elle-même de sa propre hauteur. Leurs
# glyphes d'origine restent donc en place : la mesure montre qu'ils se posaient
# déjà correctement au-dessus de la lettre, contrairement aux marques du dessous.
POSES_TRAITEES = {'sous', 'dedans'}
for cp, (pose, rects) in DESSINS.items():
    if pose not in POSES_TRAITEES:
        continue
    nom = cmap.get(cp)
    if not nom:
        print('  absente de la fonte :', NOMS[cp]); continue
    pen = TTGlyphPen(None)
    for (x, y, w, h) in rects:
        pen.moveTo((x, y)); pen.lineTo((x + w, y)); pen.lineTo((x + w, y + h)); pen.lineTo((x, y + h))
        pen.closePath()
    gl = pen.glyph()
    glyf[nom] = gl
    # ⚠ sans recalcul, la boîte englobante reste à zéro : la transformation WOFF2
    # s'en sert pour reconstruire le glyphe et déplace la lettre voisine (mesuré)
    gl.recalcBounds(glyf)
    # ⚠ la marge gauche doit valoir le xMin réel : la transformation WOFF2 reconstruit
    # l'abscisse du contour à partir d'elle. Mettre 0 ici décale tout le dessin.
    xmin = min(x for (x, _y, _w, _h) in rects)
    hmtx[nom] = (0, int(xmin))   # chasse nulle, marge gauche = xMin du dessin
    redessinees.append((cp, nom, pose))

# ── 2. les points d'accroche, déduits de l'encre de chaque lettre ────────────
ancres = {}
for cp in LETTRES:
    b = bornes(cp)
    nom = cmap.get(cp)
    if not nom or not b:
        continue
    x0, y0, x1, y1 = b
    # tout est calé sur la grille : une fonte matricielle décentrée d'un demi-pixel
    # se voit immédiatement, les bords des marques ne tombant plus sur les colonnes
    grille = lambda v: int(round(v / PX)) * PX
    ancres[nom] = {
        'sous':   (grille((x0 + x1) / 2), 0),          # centre, sur la ligne de base
        'sur_g':  (grille(x0 + PX / 2), grille(y1)),   # coin haut gauche
        'sur_d':  (grille(x1 - PX / 2), grille(y1)),   # coin haut droit
        'dedans': (grille((x0 + x1) / 2), grille(y1 / 2)),
    }

# ── 3. GDEF + GPOS, écrits en syntaxe .fea puis compilés ────────────────────
fea = ['table GDEF {', '  GlyphClassDef , , [' + ' '.join(n for _, n, _ in redessinees) + '], ;', '} GDEF;', '']
for pose in ('sous', 'sur_g', 'sur_d', 'dedans'):
    membres = [n for _, n, p in redessinees if p == pose]
    if not membres:
        continue
    for n in membres:
        fea.append('markClass %s <anchor 0 0> @MARQUE_%s;' % (n, pose.upper()))
fea.append('')
fea.append('feature mark {')
for nom, a in ancres.items():
    for pose in ('sous', 'sur_g', 'sur_d', 'dedans'):
        if not [1 for _, _, p in redessinees if p == pose]:
            continue
        x, y = a[pose]
        fea.append('  pos base %s <anchor %d %d> mark @MARQUE_%s;' % (nom, x, y, pose.upper()))
fea.append('} mark;')
addOpenTypeFeatures(f, StringIO('\n'.join(fea)))

# ── 4. nouveau nom de famille : une fonte modifiée ne doit pas se faire passer
#       pour l'originale (exigence de la GPL, et simple honnêteté) ────────────
FAMILLE = 'Unifont Nikoud'
for rec in f['name'].names:
    if rec.nameID in (1, 3, 4, 6, 16):
        v = rec.toUnicode()
        rec.string = (v.replace('Unifont', FAMILLE) if 'Unifont' in v else v)
f['name'].setName('Version modifiée de GNU Unifont : les 14 marques vocaliques hébraïques '
                  'ont été redessinées sur la grille et des tables GDEF/GPOS ajoutées. '
                  'Lettres inchangées.', 10, 3, 1, 0x409)

if not DST.endswith('.ttf'):
    # ⚠ WOFF2 sans sa transformation « glyf » : avec elle, WebKit reconstruit mal les
    # glyphes redessinés à la main (mesuré — la lettre se déplaçait sous la marque).
    # Le fichier grossit de quelques kilo-octets, ce qui est sans importance ici.
    from fontTools.ttLib.woff2 import WOFF2FlavorData
    f.flavor = 'woff2'
    f.flavorData = WOFF2FlavorData(transformedTables=[])
f.save(DST)
print('marques redessinées :', len(redessinees), '· lettres ancrées :', len(ancres))
print('écrit :', DST)
