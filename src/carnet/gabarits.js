'use strict';
// src/carnet/gabarits.js — Chantier 1, tâche 5.
// Fonctions PURES entrée (objet JSON de data/) → fragment HTML du carnet.
// Module PÉRENNE : rejoindra le build v2 (build.js n'en aura plus qu'à les
// appeler). Aucun accès disque, aucune variable globale, aucun effet de bord —
// seulement des chaînes de caractères en entrée et en sortie.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Convention du carnet (DESIGN.md §3, exception nommée de la rampe typo) : un
// fragment hébreu inséré dans une phrase française est entouré de
// <span lang="he">…</span> (taille 1.15em, un cran au-dessus du corps). Task 2
// (extrait_donnees.js) lit ces champs `.fr` avec `firstSpanText`, qui aplatit
// tout le HTML interne en texte — l'habillage est donc absent des données et
// doit être reconstitué ici, à partir des seuls caractères hébreux.
//
// Vérifié contre les 10 occurrences réelles du carnet (git show HEAD, 2026-07-24) :
// verbes « utiliser (avec בְּ) » ; listes existence-et-possession ×2 (yesh/ein),
// prepositions ×2 (tachat/min), mots-interrogatifs ×1 (me'ayin), mots-de-quantite
// ×1 (ktsat), expressions-divers ×3 (shalom/valah/afilu) — reconstruction
// identique au caractère près dans les 10 cas, y compris le double espacement
// interne d'un groupe de deux mots hébreux (« מִתַּחַת לְ » en un seul span).
const HEBREW_RUN = /[֑-״]+(?: [֑-״]+)*/g;
const escFr = (s) => esc(s).replace(HEBREW_RUN, (m) => `<span lang="he">${m}</span>`);

const heSpan = (o) => `<span class="he" lang="he">${o.he}</span>` + (o.tr ? `<span class="tr">${esc(o.tr)}</span>` : '');

function exemplesHtml(exs) {
  if (!exs || !exs.length) return '';
  const items = exs.map(x => `<li><span class="he" lang="he">${x.he}</span><span class="tr">${esc(x.tr)}</span><span class="fr">${escFr(x.fr)}</span></li>`).join('');
  return `\n      <ul class="exemples">${items}</ul>\n    `;
}

const vedette = (e) => `<td><span class="he" lang="he">${e.he}</span><span class="fr">${escFr(e.fr)}</span>${exemplesHtml(e.exemples)}</td>`;
const attrs = (e) => `data-niveau="${e.niveau}" data-theme="${e.theme}"`;

function ligneNom(e) {
  // Un nom sans pluriel (94/565, ex. אַבָּא) affiche un tiret cadratin — jamais
  // une cellule vide (vérifié : <td>—</td> dans le carnet de référence).
  const pl = e.pluriel ? heSpan(e.pluriel) : '—';
  return `    <tr ${attrs(e)}>\n      ${vedette(e)}\n      <td>${e.genre}</td>\n      <td>${pl}</td>\n    </tr>`;
}

function ligneAdjectif(e) {
  return `    <tr ${attrs(e)}>\n      ${vedette(e)}\n` + e.formes.map(f => `      <td>${heSpan(f)}</td>`).join('\n') + `\n    </tr>`;
}

const ligneVerbe = ligneAdjectif; // même motif, 4 formes au lieu de 3

function itemListe(e) {
  // Ordre des attributs observé dans le carnet : data-fr-court, data-note,
  // data-niveau (toujours en dernier) — sans effet sur les critères
  // d'équivalence (jsdom trie les attributs, build.js les lit par regex
  // nommée), gardé pour que le diff avec l'original reste minimal.
  const court = e.fr_court ? ` data-fr-court="${esc(e.fr_court)}"` : '';
  const note = e.note ? ` data-note="${esc(e.note)}"` : '';
  return `  <li${court}${note} data-niveau="${e.niveau}">\n    <span class="word-main"><span class="he" lang="he">${e.he}</span></span>\n    <span class="meta"><span class="tr">${esc(e.tr)}</span><span class="fr">${escFr(e.fr)}</span></span>\n  ${exemplesHtml(e.exemples)}</li>`;
}

// escFr exportée pour la garde de schéma de build.js:valideDonnees (aucun hébreu qui
// échapperait au wrappage — même motif HEBREW_RUN, une seule source, jamais dupliqué).
module.exports = { ligneNom, ligneAdjectif, ligneVerbe, itemListe, exemplesHtml, escFr };
