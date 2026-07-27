// Expose : nivOfCard, nivOk, themeOk, searchNorm, runSearch, buildChips, buildNivChips, buildThemeChips, toggle, segPick, refreshAdvSub, foldSub, refreshFoldSubs, applyFoldState, refreshSelAll, updateStart, limitPool, THEMES, SPK_SVG, catCounts, nivCounts, themeCounts, catsEl, nivEl, themeEl, catOrder — Utilise : state (99), CARDS (05), escapeHtml (01), he2tr (02), speak/bindTap (06/11), savePrefs/sessRestore/srsMigrateIds (04), applyPrefs/perfReport (13), refreshSrsUi (08)

// ================= Niveaux de difficulté (CECRL) =================
// Le carnet stocke le CECRL fin (data-niveau="A1"…"C2") ; l'app l'affiche en
// quatre libellés. Un mot sans niveau ignore le filtre : il reste visible
// partout, le carnet peut donc s'annoter progressivement sans perdre de carte.
const NIVEAUX = [
  {key:'facile',    label:'Facile',        cecrl:['A1']},
  {key:'inter',     label:'Intermédiaire', cecrl:['A2','B1']},
  {key:'difficile', label:'Difficile',     cecrl:['B2','C1']},
  {key:'expert',    label:'Expert',        cecrl:['C2']}
];
function nivOfCard(c){ const g=NIVEAUX.find(g=>g.cecrl.includes(c.niveau)); return g ? g.key : null; }
function nivOk(c){ const k=nivOfCard(c); return !k || state.niveaux.has(k); }

// ================= Thèmes (champ sémantique) =================
// Le carnet annote les trois tables Noms/Adjectifs/Verbes (data-theme) ; les
// listes (nombres, jours…) n'en portent pas : déjà mono-thème par nature.
// Filtre OPTIONNEL, à l'inverse des catégories et du niveau : aucune puce
// cochée = tous les thèmes, rien n'est bloqué. Dès qu'un thème est coché,
// une carte sans thème sort du jeu — c'est le sens du choix.
// ⚠️ Les slugs doivent rester alignés sur EXPECTED_THEMES de build.js.
const THEMES = [
  {key:'famille-personnes',   label:'Famille & personnes'},
  {key:'corps-sante',         label:'Corps & santé'},
  {key:'nourriture',          label:'Nourriture & repas'},
  {key:'maison-objets',       label:'Maison & objets'},
  {key:'vetements-couleurs',  label:'Vêtements & couleurs'},
  {key:'ville-transport',     label:'Ville, lieux & transports'},
  {key:'nature',              label:'Nature & animaux'},
  {key:'temps-calendrier',    label:'Temps & calendrier'},
  {key:'travail-etudes',      label:'Travail & études'},
  {key:'vie-quotidienne',     label:'Vie quotidienne'},
  {key:'argent-achats',       label:'Argent & achats'},
  {key:'loisirs-culture',     label:'Loisirs & culture'},
  {key:'communication-pensee',label:'Parler & penser'},
  {key:'emotions-caractere',  label:'Émotions & caractère'},
  {key:'abstrait',            label:'Notions abstraites'}
];
function themeOk(c){ return state.themes.size===0 || (c.theme && state.themes.has(c.theme)); }

// ----- Dynamic search over the word bank -----
const SPK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19.5 5a9 9 0 0 1 0 14"/></svg>';
function searchNorm(s){
  return (s||'').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f\u0591-\u05C7]/g,'')
    .replace(/\s+/g,' ').trim();
}
function runSearch(){
  const input = document.getElementById('search-input');
  const box = document.getElementById('search-results');
  const clear = document.getElementById('search-clear');
  const raw = input.value.trim();
  clear.classList.toggle('hide', raw.length===0);
  const q = searchNorm(raw);
  if(!q){ box.innerHTML=''; box.classList.add('hide'); return; }
  box.classList.remove('hide');
  const hits=[];
  for(const c of CARDS){
    const hay=[c.fr, c.he, c.he_plain, c.tr];
    if(c.forms) c.forms.forEach(f=>{ hay.push(f.he, f.tr); });
    if(searchNorm(hay.join(' ')).includes(q)) hits.push(c);
    if(hits.length>=80) break;
  }
  if(!hits.length){ box.innerHTML='<div class="search-empty">Aucun résultat pour « '+escapeHtml(raw)+' ».</div>'; return; }
  let html = '<div class="sr-count">'+hits.length+(hits.length>=80?'+':'')+' résultat'+(hits.length>1?'s':'')+'</div>';
  html += hits.map((c,i)=>{
    const tr = '<span class="sr-tr">'+(c.tr||he2tr(c.he))+'</span>';
    const expandable = !!(c.forms || c.note || c.exemples);
    const chevron = expandable ? '<span class="sr-chev" aria-hidden="true">\u203a</span>' : '';
    let detail = '';
    if(expandable){
      detail = '<div class="sr-detail hide" id="srd-'+i+'">';
      if(c.forms){
        const lbl = c.cat==='Verbes' ? 'Présent' : (c.cat==='Noms' ? 'Pluriel' : 'Autres formes');
        detail += '<div class="srd-title">'+lbl+'</div><div class="srd-forms">';
        c.forms.forEach(f=>{
          detail += '<div class="srd-f"><span class="srd-he" lang="he">'+f.he+'</span>'
                 +  '<span class="srd-lbl">'+f.label+(f.tr?' · '+f.tr:'')+'</span></div>';
        });
        detail += '</div>';
      }
      if(c.note) detail += '<div class="srd-note">'+c.note+'</div>';
      if(c.exemples){
        detail += '<div class="srd-title">Exemple'+(c.exemples.length>1?'s':'')+'</div>';
        c.exemples.forEach(ex=>{
          detail += '<div class="srd-ex"><button class="ex-speak" type="button" data-he="'+escapeHtml(ex.he)+'" aria-label="Écouter l\'exemple">'+SPK_SVG+'</button>'
                 +  '<div class="ex-body"><div class="ex-he" lang="he">'+ex.he+'</div>'
                 +  '<div class="ex-tr">'+ex.tr+'</div><div class="ex-fr">'+ex.fr+'</div></div></div>';
        });
      }
      detail += '</div>';
    }
    // Un vrai <button> est impossible ici (il contient déjà le bouton Écouter,
    // et les boutons imbriqués sont invalides) → role="button" + tabindex + keydown.
    return '<div class="sr-item"'+(expandable?' data-exp="1"':'')+' id="sri-'+i+'">'
      + '<div class="sr-row" id="sr-'+i+'" role="button" tabindex="0"'
      + (expandable?' aria-expanded="false"':'')+'>'
      + '<button class="sr-speak" tabindex="-1" aria-label="Écouter">'+SPK_SVG+'</button>'
      + '<div class="sr-body"><span class="sr-he" lang="he">'+c.he+'</span>'+tr+'<div class="sr-fr">'+c.fr+'</div></div>'
      + '<span class="sr-cat">'+c.cat+'</span>'+chevron
      + '</div>'+detail+'</div>';
  }).join('');
  box.innerHTML = html;
  hits.forEach((c,i)=>{
    const speakBtn=document.querySelector('#sr-'+i+' .sr-speak');
    if(speakBtn) bindTap(speakBtn, ()=>speak(c.he||c.he_plain));
    const row=document.getElementById('sr-'+i);
    const item=document.getElementById('sri-'+i);
    const detail=document.getElementById('srd-'+i);
    if(row){
      // Une action par geste : la rangée dépliable se contente de (dé)plier —
      // l'audio reste sur le bouton Écouter. Une rangée sans détail, elle,
      // n'a que l'audio à offrir : le tap prononce.
      const activate=()=>{
        if(detail){
          const hidden=detail.classList.toggle('hide');
          item.classList.toggle('open', !hidden);
          row.setAttribute('aria-expanded', String(!hidden));
        } else speak(c.he||c.he_plain);
      };
      bindTap(row, activate);
      row.addEventListener('keydown', e=>{
        if(e.key==='Enter' || e.key===' '){ e.preventDefault(); activate(); }
      });
    }
  });
}

// ----- build category chips -----
let catCounts = {};
let nivCounts = {};
let themeCounts = {};
const catsEl = document.getElementById('cats');
const nivEl = document.getElementById('niv');
const themeEl = document.getElementById('theme');
const catOrder = ['Pronoms personnels','Démonstratifs','Verbes','Verbes modaux','Adjectifs','Noms',
  'Prépositions','Conjonctions','Mots interrogatifs','Existence','Nombres',
  'Jours de la semaine','Saisons & mois','Adverbes','Mots de quantité','Expressions','Phrases','Hébreu parlé'];
function buildChips(){
  catCounts = {};
  CARDS.forEach(c=>{ catCounts[c.cat]=(catCounts[c.cat]||0)+1; });
  catsEl.innerHTML='';
  catOrder.filter(c=>catCounts[c]).forEach(cat=>{
    const b=document.createElement('button');
    b.className='chip'; b.setAttribute('aria-pressed','false'); b.dataset.cat=cat;
    b.innerHTML=cat+' <span class="n">'+catCounts[cat]+'</span>';
    b.onclick=()=>{
      const t0=performance.now();
      toggle(b); if(b.getAttribute('aria-pressed')==='true') state.cats.add(cat); else state.cats.delete(cat);
      const t1=performance.now(); updateStart();
      const t2=performance.now(); savePrefs();
      const t3=performance.now();
      perfReport('Chip « '+cat+' »', [['état',t1-t0],['bouton',t2-t1],['sauvegarde',t3-t2]], t0, t3);
    };
    catsEl.appendChild(b);
  });
  buildNivChips();
  buildThemeChips();
  applyPrefs();
  srsMigrateIds();   // avant tout lecteur de SRS (révision du jour, maîtrise)
  refreshSrsUi();
  sessRestore();
}
// Chips « Niveau » : seuls les niveaux non vides s'affichent (le carnet n'a pas
// encore de C2 → pas de chip « Expert » fantôme) ; groupe entier masqué si le
// carnet n'a aucun data-niveau.
function buildNivChips(){
  nivCounts = {};
  CARDS.forEach(c=>{ const k=nivOfCard(c); if(k) nivCounts[k]=(nivCounts[k]||0)+1; });
  nivEl.innerHTML='';
  NIVEAUX.filter(g=>nivCounts[g.key]).forEach(g=>{
    const b=document.createElement('button');
    b.className='chip'; b.setAttribute('aria-pressed','false'); b.dataset.niv=g.key;
    b.innerHTML=g.label+' <span class="n">'+nivCounts[g.key]+'</span>';
    b.onclick=()=>{
      const t0=performance.now();
      toggle(b); if(b.getAttribute('aria-pressed')==='true') state.niveaux.add(g.key); else state.niveaux.delete(g.key);
      const t1=performance.now(); updateStart();
      const t2=performance.now(); savePrefs();
      const t3=performance.now();
      perfReport('Chip « '+g.label+' »', [['état',t1-t0],['bouton',t2-t1],['sauvegarde',t3-t2]], t0, t3);
    };
    nivEl.appendChild(b);
  });
  // Carnet sans aucun data-niveau : c'est le pli entier qui disparaît, titre compris.
  const any = Object.keys(nivCounts).length>0;
  document.getElementById('fold-niv').classList.toggle('hide', !any);
}
// Chips « Thèmes » : seuls les thèmes non vides s'affichent, dans l'ordre de
// THEMES. Un slug du carnet absent de THEMES s'affiche quand même (libellé =
// slug) : un thème ajouté côté carnet reste filtrable en attendant son libellé.
function buildThemeChips(){
  themeCounts = {};
  CARDS.forEach(c=>{ if(c.theme) themeCounts[c.theme]=(themeCounts[c.theme]||0)+1; });
  const known = THEMES.filter(t=>themeCounts[t.key]);
  const unknown = Object.keys(themeCounts).filter(k=>!THEMES.some(t=>t.key===k))
    .sort().map(k=>({key:k, label:k}));
  themeEl.innerHTML='';
  known.concat(unknown).forEach(t=>{
    const b=document.createElement('button');
    b.className='chip'; b.setAttribute('aria-pressed','false'); b.dataset.theme=t.key;
    b.innerHTML=t.label+' <span class="n">'+themeCounts[t.key]+'</span>';
    b.onclick=()=>{
      const t0=performance.now();
      toggle(b); if(b.getAttribute('aria-pressed')==='true') state.themes.add(t.key); else state.themes.delete(t.key);
      const t1=performance.now(); updateStart();
      const t2=performance.now(); savePrefs();
      const t3=performance.now();
      perfReport('Chip « '+t.label+' »', [['état',t1-t0],['bouton',t2-t1],['sauvegarde',t3-t2]], t0, t3);
    };
    themeEl.appendChild(b);
  });
  // Carnet sans aucun data-theme : le pli entier disparaît, comme pour le niveau.
  document.getElementById('fold-theme').classList.toggle('hide', Object.keys(themeCounts).length===0);
}

function toggle(b){ b.setAttribute('aria-pressed', b.getAttribute('aria-pressed')==='true'?'false':'true'); }
function segPick(container, key, btn){
  const t0=performance.now();
  container.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed','false'));
  btn.setAttribute('aria-pressed','true');
  state[key]=btn.dataset[key];
  savePrefs();
  if(key==='len'){ refreshSrsUi(); updateStart(); }   // le compte du bouton dépend de la Longueur
  refreshAdvSub();
  perfReport('Réglage', [], t0, performance.now());
}
// Le pli fermé dit ce qu'il contient ET les valeurs mémorisées — la Longueur
// par défaut (20) ne doit pas être un réglage invisible.
function refreshAdvSub(){
  const el=document.getElementById('adv-sub'); if(!el) return;
  const order = state.order==='shuffle' ? 'Aléatoire' : 'Dans l\'ordre';
  const len = state.len==='all' ? 'Tout le paquet' : state.len+' cartes';
  const audio = state.audio==='auto' ? 'Automatique' : 'Au clic';
  el.textContent = order+' · '+len+' · '+audio;
}
// Résumé d'un pli de sélection multiple. Au-delà de deux entrées la liste ne tient
// pas sur la rangée (elle serait coupée à l'ellipse, donc mensongère) : on compte.
function foldSub(sel, entries, none, allWord, plural){
  if(sel.size===0) return none;
  if(sel.size===entries.length) return allWord+' ('+entries.length+')';
  const names = entries.filter(e=>sel.has(e.key)).map(e=>e.label);
  return names.length<=2 ? names.join(', ') : names.length+' '+plural;
}
function refreshFoldSubs(){
  const cs=document.getElementById('cats-sub');
  if(cs) cs.textContent = foldSub(state.cats,
    catOrder.filter(c=>catCounts[c]).map(c=>({key:c,label:c})),
    'Aucune — à choisir', 'Toutes', 'catégories');
  const ns=document.getElementById('niv-sub');
  if(ns) ns.textContent = foldSub(state.niveaux,
    NIVEAUX.filter(g=>nivCounts[g.key]),
    'Aucun — à choisir', 'Tous', 'niveaux');
  // Thèmes : la sélection vide n'est pas un manque, c'est « tout passe ».
  const ts=document.getElementById('theme-sub');
  if(ts) ts.textContent = foldSub(state.themes,
    THEMES.filter(t=>themeCounts[t.key]),
    'Tous', 'Tous', 'thèmes');
}
// Décidé au chargement seulement (et après une remise à zéro, qui repasse par
// applyPrefs) : un groupe dont la sélection est vide s'ouvre, puisque c'est là que
// tout reste à faire. Ensuite le pli n'obéit qu'à l'utilisateur.
function applyFoldState(){
  const fc=document.getElementById('fold-cats'); if(fc) fc.open = state.cats.size===0;
  const fn=document.getElementById('fold-niv');  if(fn) fn.open = state.niveaux.size===0;
}
// Le libellé dit l'action que le clic fera vraiment : « tout désélectionner »
// quand tout est déjà coché, « tout sélectionner » sinon.
function refreshSelAll(){
  const b=document.getElementById('selall'); if(!b) return;
  const nCats=Object.keys(catCounts).length;
  b.textContent = (nCats>0 && state.cats.size===nCats) ? 'tout désélectionner' : 'tout sélectionner';
}
function updateStart(){
  refreshSelAll();
  refreshFoldSubs();   // toute voie qui change la sélection passe ici
  const noCat = state.cats.size===0;
  // Le filtre niveau n'existe que si le carnet est annoté ; sinon il est inerte.
  const noNiv = Object.keys(nivCounts).length>0 && state.niveaux.size===0;
  const poolSize = (noCat || noNiv) ? 0 : CARDS.filter(c=>state.cats.has(c.cat) && nivOk(c) && themeOk(c)).length;
  const noMatch = !noCat && !noNiv && poolSize===0;
  const empty = noCat || noNiv || noMatch;
  const btn=document.getElementById('start');
  btn.disabled = empty;
  // Le volume réel de la session (croisement catégories × niveau, borné par la
  // Longueur) se lit sur le bouton — pas de surprise au premier compteur.
  const n = state.len==='all' ? poolSize : Math.min(+state.len, poolSize);
  btn.textContent = (empty || !CARDS.length) ? 'Commencer' : 'Commencer — '+n+' carte'+(n>1?'s':'');
  const hint=document.getElementById('start-hint');
  if(hint){
    if(noCat) hint.textContent='Choisis au moins une catégorie pour commencer.';
    else if(noNiv) hint.textContent='Choisis au moins un niveau pour commencer.';
    else if(noMatch) hint.textContent = state.themes.size>0
      ? 'Aucune carte ne croise catégories, niveau et thèmes cochés — élargis l\'un d\'eux.'
      : 'Aucune carte de ce niveau dans les catégories cochées — élargis l\'un ou l\'autre.';
    hint.classList.toggle('hide', !empty);
  }
}
// Tronque le jeu à la longueur choisie (« Longueur » du panneau). Appliqué après
// le mélange → en aléatoire, chaque session pioche N cartes différentes.
function limitPool(pool){
  return state.len==='all' ? pool : pool.slice(0, +state.len);
}