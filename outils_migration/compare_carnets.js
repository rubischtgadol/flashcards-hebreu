#!/usr/bin/env node
'use strict';
/*
 * compare_carnets.js — contrôle d'équivalence entre deux carnets, AVANT le générateur
 * (chantier 1, réorganisation du dépôt, tâche 4).
 *
 * Référence : `git show HEAD:vocabulaire_hebreu.html` (jamais le fichier sur disque —
 * insensible à un état de travail en cours).
 * Candidat  : chemin passé en argument.
 *
 * 4 critères, du moins cher au plus cher, on s'arrête au premier FAIL :
 *   1. Cartes identiques      — extractCards(build.js), JSON strictement égal (Node pur).
 *   2. DOM normalisé égal     — jsdom SANS scripts, section par section (h2 + corps).
 *   3. Comptes navigateur     — jsdom AVEC scripts, [lang=he] et span.cursive (piège 6 :
 *                               mesuré après exécution du script du carnet, pas calculé).
 *   4. `node build.js` égal   — mêmes comptes par section sur le candidat qu'en référence ;
 *                               sauvegarde/restauration du dépôt même si le critère échoue.
 *
 * Usage : node outils_migration/compare_carnets.js <chemin-candidat>
 * Sortie : une ligne « CRITÈRE n : PASS/FAIL — <détail> » par critère franchi, puis un
 * verdict final « 4/4 PASS » ou « ÉCHEC AU CRITÈRE n ». Code retour 0 si 4/4 PASS, 1 sinon.
 *
 * jsdom n'est PAS une dépendance du dépôt (zéro dépendance, CLAUDE.md) : il est requis à
 * l'exécution depuis son installation externe (scratchpad de session — TODO.md § Outillage,
 * `npm i jsdom` — puis lancer ce script avec `NODE_PATH=<scratchpad>/node_modules` dans
 * l'environnement, ou depuis un cwd où `require('jsdom')` se résout). Absent, les critères
 * 2 et 3 échouent avec un message nommé ; le critère 1 (Node pur) tourne quoi qu'il arrive.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const NOTEBOOK_NAME = 'vocabulaire_hebreu.html';
const STANDALONE_NAME = 'flashcards_hebreu.html';

function passLine(n, detail) {
  console.log(`CRITÈRE ${n} : PASS — ${detail}`);
}

function fail(n, detail) {
  console.log(`CRITÈRE ${n} : FAIL — ${detail}`);
  console.log(`ÉCHEC AU CRITÈRE ${n}`);
  process.exit(1);
}

function truncate(s, max) {
  s = String(s == null ? '' : s);
  return s.length > max ? s.slice(0, max) + '…' : s;
}

// ---------- Critère 1 : cartes identiques ----------

function critere1(B, refHtml, candHtml) {
  let refCards, candCards;
  try {
    refCards = B.extractCards(refHtml);
  } catch (e) {
    fail(1, `extractCards(référence) a levé — ${e.message.split('\n')[0]}`);
  }
  try {
    candCards = B.extractCards(candHtml);
  } catch (e) {
    fail(1, `extractCards(candidat) a levé — ${e.message.split('\n')[0]}`);
  }
  const refJSON = JSON.stringify(refCards);
  const candJSON = JSON.stringify(candCards);
  if (refJSON !== candJSON) {
    let detail;
    if (refCards.length !== candCards.length) {
      detail = `${candCards.length} carte(s) au candidat contre ${refCards.length} en référence`;
    } else {
      let i = 0;
      while (i < refCards.length && JSON.stringify(refCards[i]) === JSON.stringify(candCards[i])) i++;
      const c = refCards[i] || {};
      detail = `carte #${i} diverge (${c.cat || '?'} / ${c.he_plain || '?'})`;
    }
    fail(1, detail);
  }
  passLine(1, `${refCards.length} cartes identiques (champs et ordre)`);
}

// ---------- Critère 2 : DOM normalisé équivalent (jsdom sans scripts) ----------

function sectionsOf(html) {
  // { label -> html de la section (h2 complet + corps jusqu'au h2 suivant) }, dans l'ordre
  // d'apparition — même clé d'extraction que build.js:parseSections (span.count du h2).
  const sections = {};
  const order = [];
  const h2re = /<h2\b[^>]*>[\s\S]*?<\/h2>/g;
  const marks = [];
  let m;
  while ((m = h2re.exec(html))) marks.push({ full: m[0], start: m.index, end: m.index + m[0].length });
  marks.forEach((mk, i) => {
    const c = /<span\b[^>]*\bclass="count"[^>]*>([\s\S]*?)<\/span>/.exec(mk.full);
    if (!c) return;
    const label = c[1].replace(/<[^>]+>/g, '').trim();
    const bodyEnd = i + 1 < marks.length ? marks[i + 1].start : html.length;
    sections[label] = mk.full + html.slice(mk.end, bodyEnd);
    order.push(label);
  });
  return { sections, order };
}

function canonicalLines(fragmentHtml, JSDOM) {
  const dom = new JSDOM(`<!DOCTYPE html><body>${fragmentHtml}</body>`);
  const lines = [];
  (function walk(node, depth) {
    if (node.nodeType === 3) {
      const t = node.textContent.replace(/\s+/g, ' ').trim();
      if (t) lines.push('  '.repeat(depth) + 'TXT ' + t);
      return;
    }
    if (node.nodeType !== 1) return;
    const attrs = Array.from(node.attributes)
      .map(a => `${a.name}="${a.value}"`)
      .sort();
    lines.push('  '.repeat(depth) + '<' + node.tagName.toLowerCase() +
      (attrs.length ? ' ' + attrs.join(' ') : '') + '>');
    Array.from(node.childNodes).forEach(c => walk(c, depth + 1));
  })(dom.window.document.body, 0);
  return lines;
}

function critere2(JSDOM, refHtml, candHtml) {
  const ref = sectionsOf(refHtml);
  const cand = sectionsOf(candHtml);
  const candSet = new Set(cand.order);
  const refSet = new Set(ref.order);

  const missing = ref.order.find(l => !candSet.has(l));
  if (missing) fail(2, `section absente du candidat : ${missing}`);
  const extra = cand.order.find(l => !refSet.has(l));
  if (extra) fail(2, `section en trop dans le candidat : ${extra}`);

  for (const label of ref.order) {
    const refLines = canonicalLines(ref.sections[label], JSDOM);
    const candLines = canonicalLines(cand.sections[label], JSDOM);
    const same = refLines.length === candLines.length && refLines.every((l, i) => l === candLines[i]);
    if (!same) {
      let i = 0;
      while (i < refLines.length && i < candLines.length && refLines[i] === candLines[i]) i++;
      const divergent = candLines[i] !== undefined ? candLines[i] : (refLines[i] || '(fin de section)');
      fail(2, `SECTION ${label} : DIFF — ${truncate(divergent.trim(), 160)}`);
    }
  }
  passLine(2, `${ref.order.length} sections identiques (DOM normalisé)`);
}

// ---------- Critère 3 : comptes navigateur (jsdom avec scripts) ----------

function browserCounts(JSDOM, html) {
  return new Promise((resolve, reject) => {
    let dom;
    try {
      dom = new JSDOM(html, { runScripts: 'dangerously' });
    } catch (e) {
      return reject(e);
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const doc = dom.window.document;
      resolve({
        langHe: doc.querySelectorAll('[lang=he]').length,
        cursive: doc.querySelectorAll('span.cursive').length,
      });
    };
    dom.window.document.addEventListener('DOMContentLoaded', finish);
    setTimeout(finish, 5000); // filet de sécurité si l'évènement ne se déclenche pas
  });
}

async function critere3(JSDOM, refHtml, candHtml) {
  let refCounts, candCounts;
  try {
    refCounts = await browserCounts(JSDOM, refHtml);
    candCounts = await browserCounts(JSDOM, candHtml);
  } catch (e) {
    fail(3, `jsdom (runScripts) a levé — ${e.message.split('\n')[0]}`);
  }
  if (refCounts.langHe !== candCounts.langHe) {
    fail(3, `[lang=he] : ${candCounts.langHe} au candidat contre ${refCounts.langHe} en référence`);
  }
  if (refCounts.cursive !== candCounts.cursive) {
    fail(3, `span.cursive : ${candCounts.cursive} au candidat contre ${refCounts.cursive} en référence`);
  }
  passLine(3, `[lang=he] ${refCounts.langHe}, span.cursive ${refCounts.cursive} (identiques)`);
}

// ---------- Critère 4 : node build.js imprime les mêmes comptes ----------
//
// ⚠️ Portée réduite depuis le chantier 2 (build.js v2, Task 7) — round 1 de revue (I2) :
// build.js ne lit PLUS vocabulaire_hebreu.html en entrée, il lit data/*.json. Écraser
// vocabulaire_hebreu.html par le candidat (ci-dessous) n'a donc plus aucun effet sur ce
// que `node build.js` calcule : référence et candidat produisent des comptes strictement
// identiques quel que soit le contenu du candidat. Ce critère ne peut plus distinguer un
// carnet candidat d'un carnet de référence — il ne prouve plus que « le build tourne et
// ses comptes sont lisibles », pas leur égalité au sens du critère original (chantier 1).
// Hors périmètre de la tâche 7 de redessiner ce critère (compare_carnets.js reste tel
// quel jusqu'à la tâche 20) ; ce commentaire documente la limite pour qui le relit.
function countsBlock(output) {
  const marker = `Cartes dérivées de data/ :`;
  const idx = output.indexOf(marker);
  if (idx === -1) return null;
  const rest = output.slice(idx + marker.length);
  const blankIdx = rest.indexOf('\n\n');
  return (blankIdx === -1 ? rest : rest.slice(0, blankIdx)).trim();
}

function firstDivergentLine(a, b) {
  const al = (a || '').split('\n');
  const bl = (b || '').split('\n');
  let i = 0;
  while (i < al.length && i < bl.length && al[i] === bl[i]) i++;
  const line = bl[i] !== undefined ? bl[i] : (al[i] || '(bloc vide)');
  return line.trim();
}

function runBuild() {
  try {
    return execFileSync('node', ['build.js'], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    return (e.stdout || '') + (e.stderr || '');
  }
}

function critere4(candidatPath) {
  const notebookLive = path.join(ROOT, NOTEBOOK_NAME);
  const standaloneLive = path.join(ROOT, STANDALONE_NAME);

  const dirty = execFileSync(
    'git', ['status', '--porcelain', '--', NOTEBOOK_NAME, STANDALONE_NAME],
    { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
  ).trim();
  if (dirty) {
    fail(4, `dépôt non propre sur ces fichiers avant le critère (${dirty.split('\n')[0]}) — commit/annulation requis d'abord`);
  }

  const refOut = runBuild();
  const refBlock = countsBlock(refOut);

  // Sauvegarde explicite AVANT d'écraser le carnet vivant (brief : « sauvegarder
  // vocabulaire_hebreu.html dans le scratchpad ») — filet de secours si `git checkout --`
  // lui-même échoue (verrou, permissions) : on restaure depuis cette copie plutôt que de
  // laisser une pile Node brute s'échapper avec le dépôt dans un état incertain. Le
  // standalone est sauvegardé au même titre : build.js peut le réécrire, et un `git
  // checkout` qui échoue le laisserait sans filet sinon.
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'compare-carnets-'));
  const notebookBackup = path.join(backupDir, NOTEBOOK_NAME);
  const standaloneBackup = path.join(backupDir, STANDALONE_NAME);
  fs.copyFileSync(notebookLive, notebookBackup);
  const hadStandalone = fs.existsSync(standaloneLive);
  if (hadStandalone) fs.copyFileSync(standaloneLive, standaloneBackup);

  // buildErr (panne pendant la copie/le build) et gitErr (panne du git checkout de
  // restauration) sont deux pannes DISTINCTES, qui peuvent survenir toutes les deux (la
  // seconde pendant la restauration après la première) — gardées séparées pour que le
  // message final nomme la bonne. Bogue corrigé en absorbant genere_carnet.js/
  // valide_donnees.js dans build.js (chantier 2, watch-item de revue de branche) :
  // l'ancien code fusionnait les deux dans une seule variable `caught` via
  // `caught = caught || gitErr`, donc en cas de double panne le message annonçait
  // « git checkout a échoué » mais affichait le texte de la PREMIÈRE panne (buildErr),
  // jamais celui de gitErr — étiquette et détail ne correspondaient plus.
  let ok, detail, buildErr, gitErr, gitCheckoutOk = true;
  try {
    fs.copyFileSync(candidatPath, notebookLive);
    const candOut = runBuild();
    const candBlock = countsBlock(candOut);
    if (refBlock === null) {
      ok = false; detail = 'comptes illisibles dans la sortie de build.js (référence)';
    } else if (candBlock === null) {
      ok = false; detail = 'comptes illisibles dans la sortie de build.js (candidat)';
    } else if (refBlock !== candBlock) {
      ok = false; detail = `ligne divergente : ${truncate(firstDivergentLine(refBlock, candBlock), 160)}`;
    } else {
      ok = true;
    }
  } catch (e) {
    // Toute panne pendant la copie/le build (permissions, build.js qui lève…) doit rester
    // un FAIL propre — jamais une pile Node brute — et le dépôt doit quand même être restauré.
    buildErr = e;
  } finally {
    try {
      execFileSync('git', ['checkout', '--', NOTEBOOK_NAME, STANDALONE_NAME],
        { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
      // git checkout lui-même a échoué : repli sur la sauvegarde prise avant l'écrasement.
      gitCheckoutOk = false;
      gitErr = e;
      try {
        fs.copyFileSync(notebookBackup, notebookLive);
        if (hadStandalone) fs.copyFileSync(standaloneBackup, standaloneLive);
      } catch (copyErr) {
        fs.rmSync(backupDir, { recursive: true, force: true });
        fail(4, `restauration impossible (git ET repli scratchpad ont échoué) — ${truncate(copyErr.message.split('\n')[0], 140)}`);
      }
    }
    const after = execFileSync(
      'git', ['status', '--porcelain', '--', NOTEBOOK_NAME, STANDALONE_NAME],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    ).trim();
    // Dossier scratchpad nettoyé sur CE chemin (succès) et sur chacun des `fail(4, …)`
    // ci-dessous (bogue corrigé : il n'était jamais supprimé, un dossier `compare-carnets-*`
    // s'accumulait dans $TMPDIR à chaque exécution du critère 4).
    fs.rmSync(backupDir, { recursive: true, force: true });
    if (after) {
      fail(4, `restauration incomplète (${truncate(after.split('\n')[0], 120)})`);
    }
    if (!gitCheckoutOk) {
      const etAussi = buildErr ? ` (après une panne pendant la copie/le build : ${truncate(buildErr.message.split('\n')[0], 100)})` : '';
      fail(4, `git checkout de restauration a échoué, repli scratchpad utilisé — ${truncate(gitErr.message.split('\n')[0], 140)}${etAussi}`);
    }
    if (buildErr) {
      fail(4, `panne pendant la copie/le build — ${truncate(buildErr.message.split('\n')[0], 160)}`);
    }
  }
  if (!ok) fail(4, detail);
  passLine(4, 'comptes par section identiques (node build.js, dépôt restauré)');
}

// ---------- orchestration ----------

async function main() {
  const candidatArg = process.argv[2];
  if (!candidatArg) {
    console.log('Usage : node outils_migration/compare_carnets.js <chemin-candidat>');
    process.exit(1);
  }
  const candidatPath = path.resolve(candidatArg);

  let refHtml;
  try {
    refHtml = execFileSync(
      'git', ['show', `HEAD:${NOTEBOOK_NAME}`],
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }
    );
  } catch (e) {
    fail(1, `référence illisible (git show HEAD:${NOTEBOOK_NAME}) — ${e.message.split('\n')[0]}`);
  }

  let candHtml;
  try {
    candHtml = fs.readFileSync(candidatPath, 'utf8');
  } catch (e) {
    fail(1, `candidat illisible (${candidatArg}) — ${e.code || e.message}`);
  }

  let B;
  try {
    B = require(path.join(ROOT, 'build.js'));
  } catch (e) {
    fail(1, `build.js illisible — ${e.message.split('\n')[0]}`);
  }

  critere1(B, refHtml, candHtml);

  let JSDOM;
  try {
    ({ JSDOM } = require('jsdom'));
  } catch (e) {
    fail(2, `jsdom introuvable (require) — installer hors dépôt (npm i jsdom, TODO.md § Outillage) et exposer via NODE_PATH`);
  }

  critere2(JSDOM, refHtml, candHtml);
  await critere3(JSDOM, refHtml, candHtml);
  critere4(candidatPath);

  console.log('4/4 PASS');
  process.exit(0);
}

main();
