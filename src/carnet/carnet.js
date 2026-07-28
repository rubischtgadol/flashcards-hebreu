
  // ---------- Dynamic search / filter for the vocabulary notebook ----------
  document.addEventListener('DOMContentLoaded', function(){
    var input   = document.getElementById('voc-search');
    var clearBtn= document.getElementById('voc-search-clear');
    var countEl = document.getElementById('voc-search-count');
    if(!input) return;

    // L'état « rien ici », instancié pour de vrai : la copie du compteur
    // promettait un vide que l'écran ne montrait jamais — `.empty` était du
    // CSS mort depuis sa création (critique du 21/07, P1).
    var emptyEl = document.createElement('p');
    emptyEl.className = 'empty';
    emptyEl.hidden = true;
    emptyEl.textContent = 'Rien ici : aucun mot ne correspond. Essaie un autre terme, ou efface la recherche.';
    var searchWrap = document.querySelector('.search-wrap');
    if(searchWrap) searchWrap.insertAdjacentElement('afterend', emptyEl);

    function norm(s){
      return (s||'').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f\u0591-\u05C7]/g,'') // strip accents + nikud
        .replace(/\s+/g,' ').trim();
    }

    // Build the list of searchable entries (list items + table rows).
    var entries = [];
    document.querySelectorAll('ul.word-list > li, table tbody tr').forEach(function(el){
      // skip header rows (th only)
      if(el.tagName === 'TR' && !el.querySelector('td')) return;
      // gather text from .he (nikud-bearing), .fr, .tr, plus genre cells — but NOT .cursive
      var parts = [];
      el.querySelectorAll('.he, .fr, .tr').forEach(function(s){ parts.push(s.textContent); });
      // include plain cell text (e.g. genre m/f) that isn't in a span
      el.querySelectorAll('td').forEach(function(td){
        if(!td.querySelector('span')) parts.push(td.textContent);
      });
      entries.push({ el: el, hay: norm(parts.join(' ')) });
    });
    // Also index example sentence blocks so nothing is invisible to search.
    document.querySelectorAll('.example').forEach(function(el){
      var parts = [];
      el.querySelectorAll('.ex-he, .ex-tr, .ex-fr').forEach(function(s){ parts.push(s.textContent); });
      entries.push({ el: el, hay: norm(parts.join(' ')) });
    });

    // Section blocks = each <h2> and everything up to the next <h2>.
    var sections = [];
    var h2s = Array.prototype.slice.call(document.querySelectorAll('h2'));
    h2s.forEach(function(h2){
      var block = [h2];
      var n = h2.nextElementSibling;
      while(n && n.tagName !== 'H2'){ block.push(n); n = n.nextElementSibling; }
      sections.push({ h2: h2, block: block, hay: norm(h2.textContent) });
    });

    function clearHighlights(el){
      el.querySelectorAll('mark.hl').forEach(function(m){
        var t = document.createTextNode(m.textContent);
        m.parentNode.replaceChild(t, m);
        // merge adjacent text nodes
      });
    }
    function highlight(el, q){
      if(!q) return;
      // .ex-fr/.ex-tr : les exemples de grammaire aussi — une correspondance
      // qui n'est pas surlignée laisse deviner pourquoi la section est là.
      el.querySelectorAll('.fr, .tr, .ex-fr, .ex-tr').forEach(function(span){
        var txt = span.textContent;
        var i = norm(txt).indexOf(q);
        if(i < 0) return;
        // Map normalized index back is tricky with accents; do a simple case/accent-insensitive
        // highlight by re-matching on a normalized copy per character.
        var lower = txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        var pos = lower.indexOf(q);
        if(pos < 0) return;
        var before = txt.slice(0, pos), match = txt.slice(pos, pos+q.length), after = txt.slice(pos+q.length);
        span.innerHTML = '';
        span.appendChild(document.createTextNode(before));
        var mk = document.createElement('mark'); mk.className='hl'; mk.textContent = match;
        span.appendChild(mk);
        span.appendChild(document.createTextNode(after));
      });
    }

    function run(){
      var raw = input.value.trim();
      var q = norm(raw);
      clearBtn.hidden = raw.length === 0;
      var toc = document.querySelector('.toc');

      // reset
      entries.forEach(function(e){ e.el.classList.remove('search-hidden'); clearHighlights(e.el); });
      sections.forEach(function(s){ s.block.forEach(function(b){ b.classList.remove('search-hidden'); }); });
      document.querySelectorAll('.part').forEach(function(pt){ pt.classList.remove('search-hidden'); });

      if(!q){ countEl.textContent = ''; emptyEl.hidden = true; if(toc) toc.classList.remove('search-hidden'); return; }
      if(toc) toc.classList.add('search-hidden');  // hide the summary while filtering

      var shown = 0;
      entries.forEach(function(e){
        if(e.hay.indexOf(q) !== -1){ shown++; highlight(e.el, q); }
        else { e.el.classList.add('search-hidden'); }
      });

      // Hide sub-tables whose rows are all hidden, along with their subtheme heading.
      document.querySelectorAll('.table-wrap').forEach(function(w){
        var rows = w.querySelectorAll('tbody tr');
        if(!rows.length) return;
        var any = false;
        for(var k=0;k<rows.length;k++){
          if(!rows[k].classList.contains('search-hidden')){ any = true; break; }
        }
        if(!any){
          w.classList.add('search-hidden');
          var prev = w.previousElementSibling;
          if(prev && prev.classList && prev.classList.contains('subtheme')) prev.classList.add('search-hidden');
        }
      });
      // Hide the part separators while filtering.
      document.querySelectorAll('.part').forEach(function(pt){ pt.classList.add('search-hidden'); });

      // Hide sections whose entries are all hidden — and in the sections kept,
      // hide the prose: une recherche montre des correspondances, pas des leçons.
      sections.forEach(function(s){
        var visible = false;
        // Un TITRE qui correspond est une correspondance, pas une leçon : c'est
        // exactement ce que montrerait la pilule du sommaire — lequel est
        // justement masqué pendant une recherche (plus haut), si bien qu'une
        // section cherchée par son nom devenait introuvable des deux côtés à la
        // fois. Le cas se voyait sur « Le nikoud », section de référence dont le
        // nom ne vit que dans le titre et la prose : « qamats » ou « dagesh » la
        // trouvaient (ce sont des lignes de tableau, donc indexées), « nikoud »
        // ne la trouvait pas et la masquait. La règle « des correspondances, pas
        // des leçons » n'est PAS entamée : la branche ci-dessous continue de
        // masquer notes, encadrés et recettes des sections retenues — un titre
        // seul apparaît, jamais le cours qui le suit.
        if(s.hay.indexOf(q) !== -1){ visible = true; shown++; }
        s.block.forEach(function(b){
          if(visible) return;
          if(b.matches && b.matches('.example') && !b.classList.contains('search-hidden')){ visible = true; return; }
          if(b.matches && b.matches('ul.word-list')){
            // :scope — seuls les <li> de PREMIER niveau comptent : les <li>
            // d'exemples d'une entrée masquée gardaient toutes les sections
            // visibles sous « 0 résultat » (critique du 21/07, P1).
            if(b.querySelector(':scope > li:not(.search-hidden)')){ visible = true; }
            return;
          }
          if(b.matches && b.matches('table, .table-wrap')){
            var rows = b.querySelectorAll('tbody tr');
            for(var k=0;k<rows.length;k++){
              if(!rows[k].classList.contains('search-hidden')){ visible = true; break; }
            }
          }
        });
        if(!visible){
          s.block.forEach(function(b){ b.classList.add('search-hidden'); });
        } else {
          // La section est retenue par une correspondance : notes, recettes et
          // encadrés sont du bruit pendant une recherche — seuls restent le
          // titre, les sous-thèmes des tables visibles et les blocs porteurs.
          s.block.forEach(function(b){
            if(b === s.h2) return;
            if(b.matches && b.matches('.subtheme, ul.word-list, table, .table-wrap')) return;
            if(b.matches && b.matches('.example')) return; // déjà masqué s'il ne matche pas
            b.classList.add('search-hidden');
          });
        }
      });

      countEl.textContent = shown + ' résultat' + (shown>1?'s':'');
      emptyEl.hidden = shown !== 0;
    }

    // Debounce : run() re-scanne toutes les entrées, inutile de le faire à chaque frappe.
    var debounceTimer = null;
    input.addEventListener('input', function(){
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(run, 150);
    });
    clearBtn.addEventListener('click', function(){ clearTimeout(debounceTimer); input.value=''; run(); input.focus(); });
  });
