'use strict';
// Chantier 3, tâche 13 : découpe app.html en fragments statiques sous src/app/
// (coquille.html, app.css, js/00-tout.js, ordre.json), pour qu'app.html devienne
// à son tour un artefact généré par build.js (assembleApp()), au même titre que
// vocabulaire_hebreu.html l'est déjà depuis src/carnet/. Script JETABLE — comme
// ajoute_mots.js : dry-run par défaut, n'écrit qu'avec --ecrire. Un lancement
// accidentel a déjà écrasé un fichier source pendant le chantier 2 ; ici le risque
// est symétrique (écraser src/app/ avant d'avoir vérifié la reconstruction).
//
// Découpage (structure figée au 25/07, HEAD df5ccfc — un seul <style>, un seul
// <script>, cf. task-13-brief.md § Arbitrages) :
//   - src/app/coquille.html : tout app.html, <style> et <script> vidés de leur
//     contenu et remplacés par <!-- @TOKENS -->, <!-- @CSS:app --> et <!-- @JS:app -->.
//   - src/app/app.css : le CSS du <style>, MOINS le premier bloc :root (déjà
//     porté par src/tokens.css — piège 5, un seul jeu de jetons partagé).
//   - src/app/js/00-tout.js : la totalité du <script> (y compris la fence
//     BUILD:ONLINE-ONLY, qui vit À L'INTÉRIEUR du <script>, pas dans la coquille).
//   - src/app/ordre.json : ["00-tout.js"] — ordre de concaténation pour assembleApp().
//
// Piège d'indentation (résolu ici, PAS en éditant app.html) : le :root d'app.html
// est imbriqué dans <style> avec 2 espaces de plus que src/tokens.css (qui, lui,
// pose ":root{" à la racine — cf. vocabulaire_hebreu.html, où ça matche tel quel).
// assembleApp() réindente donc tokens.css de 2 espaces à l'assemblage ; ce script
// se contente de vérifier ci-dessous que rootBlockRaw == indent(tokensRaw), pour
// que l'écriture échoue tôt si l'hypothèse structurelle a bougé.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APP = path.join(ROOT, 'app.html');
const SRC_APP = path.join(ROOT, 'src', 'app');
const JS_DIR = path.join(SRC_APP, 'js');
const TOKENS = path.join(ROOT, 'src', 'tokens.css');

const ECRIRE = process.argv.includes('--ecrire');

function mustFind(hay, needle, from, label){
  const i = hay.indexOf(needle, from || 0);
  if (i === -1) throw new Error('decoupe_app: motif introuvable dans app.html — ' + label);
  return i;
}

function indente(texte){
  return texte.split('\n').map(l => l ? '  ' + l : l).join('\n');
}

function decoupe(){
  const src = fs.readFileSync(APP, 'utf8');
  const tokensRaw = fs.readFileSync(TOKENS, 'utf8');

  // ---- <style> ... :root ... </style> ----
  const styleOpenTag = mustFind(src, '<style>\n', 0, '<style>');
  const styleContentStart = styleOpenTag + '<style>\n'.length;
  const styleCloseTag = mustFind(src, '</style>\n', styleContentStart, '</style>');

  const rootOpen = mustFind(src, '  :root{\n', styleContentStart, ':root{ (ouverture)');
  const preRoot = src.slice(styleContentStart, rootOpen); // le commentaire « Charte unifiée »

  const rootCloseAt = mustFind(src, '\n  }\n', rootOpen, ':root } (fermeture)');
  const rootBlockEnd = rootCloseAt + 4; // juste après "}" (sans le \n qui suit — il part avec app.css, cf. carnet.css)
  const rootBlockRaw = src.slice(rootOpen, rootBlockEnd); // "  :root{\n    --bg...;\n  }"

  const attendu = indente(tokensRaw);
  if (rootBlockRaw !== attendu){
    throw new Error(
      'decoupe_app: le bloc :root d\'app.html ne correspond plus à indent(src/tokens.css) — ' +
      'ne PAS forcer : vérifier lequel des deux fichiers a bougé avant de continuer.\n' +
      '  :root (app.html)  = ' + JSON.stringify(rootBlockRaw) + '\n' +
      '  attendu (tokens)  = ' + JSON.stringify(attendu));
  }

  const cssApp = src.slice(rootBlockEnd, styleCloseTag); // commence par "\n*{...}", finit juste avant "</style>"

  // ---- entre </style> et <script> (loader, body, panneaux...) : reste dans la coquille ----
  const scriptOpenTag = mustFind(src, '<script>\n', styleCloseTag, '<script>');
  const scriptContentStart = scriptOpenTag + '<script>\n'.length;
  const betweenStyleAndScript = src.slice(styleCloseTag, scriptContentStart);

  // ---- <script> ... </script> (fence BUILD:ONLINE-ONLY comprise) ----
  const scriptCloseAt = mustFind(src, '\n</script>\n', scriptContentStart, '</script>');
  const jsApp = src.slice(scriptContentStart, scriptCloseAt + 1);
  const afterScript = src.slice(scriptCloseAt + 1); // "</script>\n</body>\n</html>"

  const head = src.slice(0, styleContentStart); // début du fichier jusqu'à "<style>\n" inclus

  const coquille = head + preRoot
    + '<!-- @TOKENS --><!-- @CSS:app -->'
    + betweenStyleAndScript
    + '<!-- @JS:app -->'
    + afterScript;

  return { src, coquille, cssApp, jsApp };
}

function verifie(d){
  // Réassemblage à blanc avec la même logique que build.js:assembleApp() — preuve
  // d'inversibilité avant toute écriture (même esprit que decoupe_carnet.js --verifie).
  const tokensRaw = fs.readFileSync(TOKENS, 'utf8');
  let out = d.coquille;
  out = out.replace('<!-- @TOKENS -->', () => indente(tokensRaw));
  out = out.replace('<!-- @CSS:app -->', () => d.cssApp);
  out = out.replace('<!-- @JS:app -->', () => d.jsApp);
  if (out !== d.src){
    let i = 0; const n = Math.min(out.length, d.src.length);
    while (i < n && out[i] === d.src[i]) i++;
    throw new Error('decoupe_app: reconstruction NON byte-identique à app.html — première divergence à l\'octet ' + i +
      '\n  reconstruit = ' + JSON.stringify(out.slice(Math.max(0, i - 30), i + 30)) +
      '\n  app.html    = ' + JSON.stringify(d.src.slice(Math.max(0, i - 30), i + 30)));
  }
  console.log('RECONSTRUCTION BYTE-IDENTIQUE : OK (' + out.length + ' caractères)');
}

const d = decoupe();
verifie(d);

if (ECRIRE){
  fs.mkdirSync(JS_DIR, { recursive: true });
  fs.writeFileSync(path.join(SRC_APP, 'coquille.html'), d.coquille);
  fs.writeFileSync(path.join(SRC_APP, 'app.css'), d.cssApp);
  fs.writeFileSync(path.join(JS_DIR, '00-tout.js'), d.jsApp);
  fs.writeFileSync(path.join(SRC_APP, 'ordre.json'), JSON.stringify(['00-tout.js'], null, 2) + '\n');
  console.log('écrit : src/app/coquille.html, src/app/app.css, src/app/js/00-tout.js, src/app/ordre.json');
} else {
  console.log('Dry-run : rien n\'est écrit. Relancer avec --ecrire pour écrire src/app/.');
  console.log('  coquille.html : ' + d.coquille.length + ' caractères');
  console.log('  app.css       : ' + d.cssApp.length + ' caractères');
  console.log('  js/00-tout.js : ' + d.jsApp.length + ' caractères');
}
