#!/usr/bin/env node
'use strict';
/*
 * genere_carnet.js — Chantier 1, tâche 5. Orchestration JETABLE (absorbée par
 * build.js au Chantier 2) : assemble vocabulaire_hebreu.html à partir de
 * src/carnet/{tete,pied}.html + sections.json + src/carnet/sections/*.html,
 * en substituant les jetons de style/script (@TOKENS, @CSS:carnet, @JS:carnet)
 * et les placeholders de contenu (@ENTREES:…) par les fonctions PURES de
 * gabarits.js appliquées aux données validées de data/.
 *
 * Garde anti-perte silencieuse (obligatoire, brief §Step 2) : un placeholder
 * qui ne consomme aucune entrée, ou une entrée qu'aucun placeholder n'a
 * consommée, est une erreur bloquante nommée — jamais un carnet tronqué en
 * silence.
 *
 * Usage :
 *   node outils_migration/genere_carnet.js                → HTML sur stdout
 *   node outils_migration/genere_carnet.js <chemin>        → HTML écrit au chemin donné
 *   node outils_migration/genere_carnet.js --ecrire        → écrit en place sur
 *                                                             vocabulaire_hebreu.html
 *                                                             (racine du dépôt)
 *
 * L'en-tête « FICHIER GÉNÉRÉ » (tâche 6) est inséré juste après la première ligne
 * (<!DOCTYPE html>) dans TOUS les modes — stdout, chemin explicite ou --ecrire : c'est
 * un commentaire HTML, il documente l'origine du fichier quelle que soit la façon dont
 * il a été produit, et n'affecte aucun des 4 critères de compare_carnets.js (vérifié
 * task 6 : ni l'extraction de cartes ni la comparaison DOM normalisée ne considèrent
 * les commentaires).
 */
const fs = require('fs');
const path = require('path');
const gabarits = require('../src/carnet/gabarits.js');

const ENTETE_GENERE =
  '<!-- FICHIER GÉNÉRÉ — ne pas éditer. Source : data/ + src/carnet/. ' +
  'Regénération : node outils_migration/genere_carnet.js (chantier 2 : node build.js). -->';

// Insère l'en-tête juste après la première ligne du HTML (la ligne <!DOCTYPE html>).
function insereEntete(html) {
  const finLigne = html.indexOf('\n');
  if (finLigne === -1) {
    throw new Error('genereCarnet: HTML sans retour à la ligne après la première ligne — insertion de l\'en-tête impossible');
  }
  return html.slice(0, finLigne + 1) + ENTETE_GENERE + '\n' + html.slice(finLigne + 1);
}

// Extrait le "cle" d'un placeholder <!-- @ENTREES:cle --> ; non gourmand pour
// s'arrêter au premier « -->» rencontré.
const PLACEHOLDER_RE = /<!-- @ENTREES:(.*?) -->/g;

/**
 * genereCarnet(donnees, srcCarnet) → chaîne HTML complète du carnet.
 * `donnees`   : { noms, adjectifs, verbes, listes } — forme de
 *               valide_donnees.js:chargeDonnees().
 * `srcCarnet` : chemin absolu vers src/carnet (contient tete.html, pied.html,
 *               sections.json, sections/, carnet.css, carnet.js) ;
 *               src/tokens.css est lu un niveau au-dessus.
 */
function genereCarnet(donnees, srcCarnet) {
  const lire = (f) => fs.readFileSync(path.join(srcCarnet, f), 'utf8');
  const tete = lire('tete.html');
  const pied = lire('pied.html');
  const sectionsListees = JSON.parse(lire('sections.json'));
  const tokens = fs.readFileSync(path.join(srcCarnet, '..', 'tokens.css'), 'utf8');
  const cssCarnet = lire('carnet.css');
  const jsCarnet = lire('carnet.js');

  const corps = sectionsListees
    .map(f => fs.readFileSync(path.join(srcCarnet, 'sections', f), 'utf8'))
    .join('');

  let html = tete + corps + pied;
  // Remplacement par fonction (jamais par chaîne) : le contenu de tokens.css /
  // carnet.css / carnet.js peut contenir des séquences "$&", "$1"… que
  // String.prototype.replace interpréterait comme des motifs de substitution
  // si on lui passait une chaîne — la fonction insère le résultat au mot près.
  html = html.replace('<!-- @TOKENS -->', () => tokens);
  html = html.replace('<!-- @CSS:carnet -->', () => cssCarnet);
  html = html.replace('<!-- @JS:carnet -->', () => jsCarnet);

  // ---------- substitution des placeholders @ENTREES + garde anti-perte ----------

  const TABLES = {
    noms: { arr: donnees.noms, gabarit: gabarits.ligneNom },
    adjectifs: { arr: donnees.adjectifs, gabarit: gabarits.ligneAdjectif },
    verbes: { arr: donnees.verbes, gabarit: gabarits.ligneVerbe },
  };
  // indices consommés, par table / par slug de liste — sert la garde anti-perte
  const consommeesTable = { noms: new Set(), adjectifs: new Set(), verbes: new Set() };
  const consommeesListe = {}; // slug -> Set(indices)

  const vusPlaceholders = new Set();

  html = html.replace(PLACEHOLDER_RE, (m, cle) => {
    if (vusPlaceholders.has(cle)) {
      throw new Error(`placeholder @ENTREES:${cle} apparaît plus d'une fois — cible ambiguë`);
    }
    vusPlaceholders.add(cle);

    if (cle.startsWith('listes/')) {
      const reste = cle.slice('listes/'.length);
      const sepIdx = reste.indexOf('#');
      const slug = sepIdx === -1 ? reste : reste.slice(0, sepIdx);
      const groupe = sepIdx === -1 ? undefined : reste.slice(sepIdx + 1);

      const liste = donnees.listes[slug];
      if (!liste) throw new Error(`placeholder @ENTREES:${cle} — liste "${slug}" introuvable dans data/listes/`);
      if (!consommeesListe[slug]) consommeesListe[slug] = new Set();

      const indices = [];
      liste.entries.forEach((e, i) => {
        const consomme = groupe === undefined ? true : (e.groupe || '') === groupe;
        if (consomme) indices.push(i);
      });
      if (!indices.length) {
        throw new Error(`placeholder @ENTREES:${cle} ne consomme aucune entrée (garde anti-perte) — vérifier le "groupe" attendu`);
      }
      indices.forEach(i => consommeesListe[slug].add(i));
      return indices.map(i => gabarits.itemListe(liste.entries[i])).join('\n');
    }

    const sepIdx = cle.indexOf('#');
    if (sepIdx === -1) throw new Error(`placeholder @ENTREES:${cle} — forme inconnue (attendu "table#groupe" ou "listes/slug[#groupe]")`);
    const table = cle.slice(0, sepIdx);
    const groupe = cle.slice(sepIdx + 1);

    const def = TABLES[table];
    if (!def) throw new Error(`placeholder @ENTREES:${cle} — table "${table}" inconnue (attendu noms/adjectifs/verbes)`);

    const indices = [];
    def.arr.forEach((e, i) => { if ((e.groupe || '') === groupe) indices.push(i); });
    if (!indices.length) {
      throw new Error(`placeholder @ENTREES:${cle} ne consomme aucune entrée (garde anti-perte) — groupe "${groupe}" absent de data/${table}.json`);
    }
    indices.forEach(i => consommeesTable[table].add(i));
    return indices.map(i => def.gabarit(def.arr[i])).join('\n');
  });

  // Toute entrée qu'aucun placeholder n'a consommée = erreur bloquante nommée.
  for (const table of Object.keys(TABLES)) {
    const arr = TABLES[table].arr;
    const vus = consommeesTable[table];
    if (vus.size !== arr.length) {
      const idx = arr.findIndex((_, i) => !vus.has(i));
      const e = arr[idx];
      throw new Error(`garde anti-perte : ${vus.size}/${arr.length} entrées de data/${table}.json consommées par un placeholder — première orpheline #${idx} (« ${e.he} / ${e.fr} », groupe "${e.groupe}")`);
    }
  }
  for (const slug of Object.keys(donnees.listes)) {
    const entries = donnees.listes[slug].entries;
    const vus = consommeesListe[slug] || new Set();
    if (vus.size !== entries.length) {
      const idx = entries.findIndex((_, i) => !vus.has(i));
      const e = entries[idx];
      throw new Error(`garde anti-perte : ${vus.size}/${entries.length} entrées de data/listes/${slug}.json consommées par un placeholder — première orpheline #${idx} (« ${e.he} / ${e.fr} »)`);
    }
  }

  return insereEntete(html);
}

if (require.main === module) {
  const ROOT = path.join(__dirname, '..');
  const { chargeDonnees, valideDonnees } = require('./valide_donnees.js');

  let donnees;
  try {
    donnees = chargeDonnees(ROOT);
    valideDonnees(donnees);
  } catch (e) {
    console.error('✗ données invalides (data/) : ' + e.message);
    process.exit(1);
  }

  const html = genereCarnet(donnees, path.join(ROOT, 'src', 'carnet'));

  const argv = process.argv.slice(2);
  const ecrire = argv.includes('--ecrire');
  const sortie = ecrire
    ? path.join(ROOT, 'vocabulaire_hebreu.html')
    : argv.find(a => a !== '--ecrire');

  if (sortie) {
    fs.writeFileSync(sortie, html);
    console.error(`Carnet généré → ${sortie} (${html.length} octets)`);
  } else {
    process.stdout.write(html);
  }
}

module.exports = { genereCarnet };
