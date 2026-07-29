
  // ---------- La ligne en écriture cursive ----------
  // Sous chaque mot hébreu du dictionnaire, une seconde ligne dans la fonte
  // cursive israélienne, SANS nikoud (décision du propriétaire) : à la main,
  // on n'écrit pas les points.
  //
  // ⚠️ Ce fichier existe parce que ce comportement vivait dans
  // `sections/41-phrases.html` — un comportement GLOBAL du carnet logé dans un
  // fichier de section, que rien n'annonçait et que rien ne gardait. La section
  // renommée, retirée ou déplacée, les 5573 cursives disparaissaient d'un coup,
  // en silence, `--check` restant vert (le carnet régénéré est cohérent avec
  // son registre : il est seulement amputé). Le même fichier portait aussi le
  // `</main>`, et comme deux sections le suivent au registre, elles se
  // rendaient HORS de `<main>` — donc sans la colonne de lecture posée par
  // `main > *` (carnet.css). Voir la garde `verifieStructureCarnet()`.
  //
  // Le dénudage vient de `normHe` (module de translittération injecté avant ce
  // fichier), et non d'une quatrième copie locale du même `replace`.
  document.addEventListener('DOMContentLoaded', function(){
    // Cursive uniquement sous les entrées de dictionnaire (cellules de tableau,
    // listes de mots) — jamais dans le texte courant des notes et des recettes,
    // où une ligne en display:block fragmenterait la phrase.
    document.querySelectorAll('td .he, .word-main .he').forEach(function(el){
      var cursive = document.createElement('span');
      cursive.className = 'cursive';
      cursive.lang = 'he';
      cursive.textContent = normHe(el.textContent);
      el.insertAdjacentElement('afterend', cursive);
    });
  });
