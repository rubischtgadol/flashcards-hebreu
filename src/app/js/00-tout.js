let CARDS = [];

const state = {
  dir:'he2fr', script:'nikud', order:'shuffle', audio:'click', mode:'cards', len:'20',
  session:'normal', cats:new Set(), niveaux:new Set(), themes:new Set(),
  queue:[], origQueue:[], idx:0, flipped:false, missed:[], goodCount:0, total:0
};

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

// ================= Préférences de réglage (persistées) =================
// Les choix du panneau de réglages survivent d'une session à l'autre. Restaurés
// au boot par applyPrefs(), appelé depuis buildChips() → couvre les deux chemins
// (init() en ligne ET démarrage direct du fichier autonome).
const PREFS_KEY='prefs_v1';
const SEG_KEYS=['mode','dir','script','order','audio','len'];
function prefsLoad(){ try{ return JSON.parse(localStorage.getItem(PREFS_KEY))||null; }catch(e){ return null; } }
function savePrefs(){
  try{
    localStorage.setItem(PREFS_KEY, JSON.stringify({
      cats:[...state.cats], niveaux:[...state.niveaux], themes:[...state.themes], mode:state.mode, dir:state.dir,
      script:state.script, order:state.order, audio:state.audio, len:state.len
    }));
  }catch(e){}
}
// Aligne un groupe de chips segmentés sur la valeur courante de state[key].
function reflectSeg(key){
  const box=document.getElementById(key); if(!box) return;
  box.querySelectorAll('.chip').forEach(c=>
    c.setAttribute('aria-pressed', c.dataset[key]===state[key] ? 'true':'false'));
}
// Restaure réglages + catégories, puis reflète le tout dans l'UI. Au 1er lancement
// (aucune préférence) : aucune catégorie ni aucun niveau présélectionné — le choix
// appartient à l'utilisateur ; « Commencer » reste muet et #start-hint guide
// (décision du 19/07/2026). Les autres réglages gardent leurs valeurs initiales.
function applyPrefs(){
  const p=prefsLoad();
  state.cats.clear();
  state.niveaux.clear();
  state.themes.clear();
  if(p){
    SEG_KEYS.forEach(k=>{ if(typeof p[k]==='string') state[k]=p[k]; });
    (Array.isArray(p.cats)?p.cats:[]).forEach(cat=>{ if(catCounts[cat]) state.cats.add(cat); });
    // Niveaux : rétro-compatible — préférences d'avant le filtre (pas de champ
    // `niveaux`) → tout sélectionné, rien ne disparaît pour un profil existant.
    if(Array.isArray(p.niveaux)) p.niveaux.forEach(k=>{ if(nivCounts[k]) state.niveaux.add(k); });
    else Object.keys(nivCounts).forEach(k=>state.niveaux.add(k));
    // Thèmes : filtre optionnel — champ absent (préférences d'avant) = rien de
    // coché, c'est-à-dire « tous les thèmes ». Rien ne change pour l'existant.
    if(Array.isArray(p.themes)) p.themes.forEach(k=>{ if(themeCounts[k]) state.themes.add(k); });
  }
  SEG_KEYS.forEach(reflectSeg);
  catsEl.querySelectorAll('.chip').forEach(b=>
    b.setAttribute('aria-pressed', state.cats.has(b.dataset.cat) ? 'true':'false'));
  nivEl.querySelectorAll('.chip').forEach(b=>
    b.setAttribute('aria-pressed', state.niveaux.has(b.dataset.niv) ? 'true':'false'));
  themeEl.querySelectorAll('.chip').forEach(b=>
    b.setAttribute('aria-pressed', state.themes.has(b.dataset.theme) ? 'true':'false'));
  refreshAdvSub();
  refreshFoldSubs();
  applyFoldState();
}

// ================= Instantané de session (sessionStorage) =================
// Une session en cours survit à un rechargement ou à une éviction de l'onglet
// par iOS. Restauré au boot par sessRestore(), appelé depuis buildChips() → les
// deux chemins (en ligne et autonome). Les cartes sont référencées par leur id
// (cat|he_plain) ; si le vocabulaire a changé sous la session, on l'abandonne.
const SESS_KEY='sess_v1';
let bootResumed=false;
function sessSave(){
  if(!document.getElementById('study').classList.contains('active')) return;
  try{
    sessionStorage.setItem(SESS_KEY, JSON.stringify({
      queueIds: state.queue.map(cardId), origIds: state.origQueue.map(cardId),
      missedIds: state.missed.map(cardId), idx: state.idx, goodCount: state.goodCount,
      total: state.total, session: state.session, mode: state.mode, dir: state.dir, script: state.script
    }));
  }catch(e){}
}
function sessClear(){ try{ sessionStorage.removeItem(SESS_KEY); }catch(e){} }
function sessRestore(){
  let s; try{ s=JSON.parse(sessionStorage.getItem(SESS_KEY)); }catch(e){ return false; }
  if(!s || !Array.isArray(s.queueIds) || !s.queueIds.length) return false;
  const byId={}; CARDS.forEach(c=>{ byId[cardId(c)]=c; });
  const map=ids=>(ids||[]).map(id=>byId[id]).filter(Boolean);
  const queue=map(s.queueIds);
  if(queue.length!==s.queueIds.length || (s.idx|0)>=queue.length){ sessClear(); return false; }
  state.queue=queue;
  state.origQueue = s.origIds ? map(s.origIds) : queue.slice();
  state.missed = map(s.missedIds);
  state.idx=s.idx|0; state.goodCount=s.goodCount|0; state.total=s.total||queue.length;
  state.session=s.session||'normal';
  if(typeof s.mode==='string') state.mode=s.mode;
  if(typeof s.dir==='string') state.dir=s.dir;
  if(typeof s.script==='string') state.script=s.script;
  state.flipped=false; state.answered=false;
  document.getElementById('setup').classList.add('hidden');
  document.getElementById('done').classList.remove('active');
  document.getElementById('study').classList.add('active');
  bootResumed=true;
  render();
  return true;
}

// ================= Diagnostic de latence (dossier « lag iPhone », 20/07/2026) =================
// Trois temps par geste, affichés dans « Réglages avancés » : « attente » (dernier
// doigt levé → le gestionnaire démarre — c'est là que vivrait un délai de synthèse
// du clic ou un fil principal occupé), « travail » (le gestionnaire, décomposé),
// « affichage » (gestionnaire terminé → image peinte, via double
// requestAnimationFrame). L'écriture du texte se fait APRÈS la capture du temps
// de peinture, pour ne pas mesurer sa propre mise à jour.
let lastPointerUp=0;
document.addEventListener('pointerup', e=>{ lastPointerUp=e.timeStamp; }, {capture:true, passive:true});
function fmtMs(v){ return (v>=100 ? ''+Math.round(v) : v.toFixed(1).replace('.', ','))+'\u202fms'; }   // espace fine insécable avant l'unité (convention fr), en escape \u pour rester visible dans la source
function perfReport(label, segs, t0, tEnd){
  const base = (lastPointerUp && lastPointerUp<=t0) ? lastPointerUp : t0;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const tPaint=performance.now();
    const el=document.getElementById('perf-note'); if(!el) return;
    const detail = segs.map(s=>s[0]+' '+fmtMs(s[1])).join(' · ');
    el.textContent = label+' : attente '+fmtMs(t0-base)+' · travail '+fmtMs(tEnd-t0)
      + (detail ? ' ('+detail+')' : '')
      + ' · affichage '+fmtMs(tPaint-tEnd)+' · total '+fmtMs(tPaint-base);
  }));
}

// ----- Speech (Web Speech API) -----
const TTS_OK = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);
let voicesCache = [];
let heVoice = null;
function loadVoices(){
  if(!TTS_OK) return;
  voicesCache = window.speechSynthesis.getVoices() || [];
  // Voix hébraïques : le `lang` BCP-47 est le critère fiable ; le nom n'est qu'un
  // filet. ⚠️ `name` est LOCALISÉ par iOS (relevé le 19/07 sur l'iPhone de Ruben,
  // réglé en norvégien : « Carmit (forbedret) » dans les Réglages). Chercher
  // « hebrew » dans le nom ne marche donc que sur un appareil anglophone —
  // d'où l'ajout du `voiceURI`, qui est un identifiant technique jamais traduit.
  const heVoices = voicesCache.filter(v=>
    /^(he|iw)(-|$)/i.test(v.lang) || /hebrew|עברית|carmit/i.test(v.name || '') ||
    /(^|\.)(he|iw)([-_.]|$)|carmit/i.test(v.voiceURI || '')
  );
  // Classement : qualité décroissante (Premium > Enhanced > défaut), puis Carmit.
  // ⚠️ Le score se lit d'abord sur `voiceURI` et seulement ensuite sur `name`, pour
  // la même raison : sur un téléphone non anglophone, une voix améliorée ne contient
  // pas le mot « enhanced » dans son nom (norvégien : « forbedret ») et le classement
  // la manquerait en silence. L'identifiant, lui, reste « …enhanced… » partout.
  // (Aujourd'hui WebKit ne publie que les voix compactes, donc ces branches ne se
  // déclenchent pas sur iOS — c'est un filet pour le jour où son filtre changerait.)
  function score(v){
    const n = (v.name || '').toLowerCase();
    const u = (v.voiceURI || '').toLowerCase();
    let s = 0;
    if(/premium/.test(u) || /premium/.test(n)) s += 40;
    else if(/enhanced|neural|siri/.test(u) || /enhanced|neural|siri/.test(n)) s += 25;
    if(/carmit/.test(u) || /carmit/.test(n)) s += 10;
    if(v.localService) s += 3;      // on-device (Carmit) over remote fallback
    if(/^he(-|$)/i.test(v.lang)) s += 2;
    return s;
  }
  heVoice = heVoices.sort((a,b)=>score(b)-score(a))[0] || null;
  reflectVoiceUi();
}
// Sans voix : boutons haut-parleur masqués (CSS no-he-voice) et chips
// « Prononciation » désactivées — le réglage n'aurait aucun effet.
function reflectVoiceUi(){
  const off = !heVoice;
  document.body.classList.toggle('no-he-voice', off);
  document.querySelectorAll('#audio .chip').forEach(b=>b.disabled=off);
}
if(TTS_OK){ loadVoices(); window.speechSynthesis.onvoiceschanged = loadVoices; }
else reflectVoiceUi();
function speak(text){
  if(!TTS_OK || !heVoice || !text) return;
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = heVoice ? heVoice.lang : 'he-IL';
    if(heVoice) u.voice = heVoice;
    u.rate = 0.88;
    const btn = document.getElementById('speak-btn');
    u.onstart = ()=>{ if(btn) btn.classList.add('speaking'); };
    u.onend   = ()=>{ if(btn) btn.classList.remove('speaking'); };
    u.onerror = ()=>{ if(btn) btn.classList.remove('speaking'); };
    window.speechSynthesis.speak(u);
  }catch(e){}
}
function speakCurrent(){
  const c = state.queue[state.idx];
  // Prefer the vocalized form (with nikud) so the voice pronounces the exact vowels;
  // fall back to the plain form if no vocalized text is present.
  if(c) speak(c.he || c.he_plain);
}
function updateSpeaker(){
  const btn = document.getElementById('speak-btn');
  if(!btn) return;
  let hebrewVisible;
  if(state.mode==='input' || state.mode==='quiz'){
    hebrewVisible = (state.dir==='he2fr') || (state.dir==='fr2he' && state.answered);
  } else {
    hebrewVisible = state.flipped || state.dir==='he2fr';
  }
  btn.classList.toggle('hide', !(TTS_OK && hebrewVisible));
}

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
document.getElementById('search-input').addEventListener('input', runSearch);
document.getElementById('search-clear').addEventListener('click', ()=>{
  const input=document.getElementById('search-input');
  input.value=''; runSearch(); input.focus();
});

// ----- build category chips -----
let catCounts = {};
let nivCounts = {};
let themeCounts = {};
const catsEl = document.getElementById('cats');
const nivEl = document.getElementById('niv');
const themeEl = document.getElementById('theme');
const catOrder = ['Pronoms personnels','Démonstratifs','Verbes','Verbes modaux','Adjectifs','Noms',
  'Prépositions','Conjonctions','Mots interrogatifs','Existence','Nombres',
  'Jours de la semaine','Saisons & mois','Adverbes','Mots de quantité','Expressions','Phrases'];
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
SEG_KEYS.forEach(key=>{
  const box=document.getElementById(key);
  box.querySelectorAll('.chip').forEach(c=>c.onclick=()=>segPick(box,key,c));
});

document.getElementById('selall').onclick=()=>{
  const t0=performance.now();
  const allOn = state.cats.size===Object.keys(catCounts).length;
  catsEl.querySelectorAll('.chip').forEach(b=>{
    b.setAttribute('aria-pressed', allOn?'false':'true');
  });
  state.cats.clear();
  if(!allOn) Object.keys(catCounts).forEach(c=>state.cats.add(c));
  const t1=performance.now(); updateStart();
  const t2=performance.now(); savePrefs();
  const t3=performance.now();
  perfReport('« Tout (dé)sélectionner »', [['état',t1-t0],['bouton',t2-t1],['sauvegarde',t3-t2]], t0, t3);
};
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
updateStart();

(function(){
  const note = document.getElementById('audio-note');
  if(!note) return;
  function refresh(){
    if(!TTS_OK){ note.textContent = "Synthèse vocale non disponible sur ce navigateur."; return; }
    // Le nom réel de la voix retenue est le premier outil de diagnostic quand la
    // synthèse sonne robotique. Mais `name` ne dit jamais la qualité : sur iOS, seul
    // l'identifiant AVFoundation la porte (« …-compact » = voix compacte, plafond de
    // ce que WebKit publie ; « .enhanced. »/« .premium. » = le filtre a changé).
    // On l'affiche donc à côté — c'est la seule mesure possible depuis le web.
    if(!heVoice){
      note.textContent = "Aucune voix hébraïque installée sur l'appareil — le son peut être approximatif. (iOS : Réglages → Accessibilité → Contenu énoncé → Voix → Hébreu.)";
      return;
    }
    note.textContent = "Voix hébraïque détectée ✓ — " + heVoice.name;
    const id = document.createElement('span');
    id.className = 'voice-id';
    id.textContent = "identifiant : " + (heVoice.voiceURI || "non exposé par ce navigateur");
    note.appendChild(id);
  }
  refresh();
  if(TTS_OK) window.speechSynthesis.addEventListener('voiceschanged', refresh);
})();

// ----- start -----
document.getElementById('start').onclick=start;
// Transition setup/done → étude, commune à tous les points d'entrée (catégories,
// révision, rejeu). `origQueue` mémorise le jeu de la session pour « Recommencer ».
function beginSession(pool){
  state.queue=pool; state.idx=0; state.missed=[]; state.goodCount=0; state.total=pool.length; state.flipped=false;
  cardsUndo=null; lastRecord=null;   // rien d'annulable en début de session
  document.getElementById('exit-note').classList.add('hide');
  document.getElementById('setup').classList.add('hidden');
  document.getElementById('done').classList.remove('active');
  document.getElementById('study').classList.add('active');
  render();
}
// Tronque le jeu à la longueur choisie (« Longueur » du panneau). Appliqué après
// le mélange → en aléatoire, chaque session pioche N cartes différentes.
function limitPool(pool){
  return state.len==='all' ? pool : pool.slice(0, +state.len);
}
function start(){
  const t0=performance.now();
  state.session='normal';
  // Croisement catégories × niveau × thèmes. La révision du jour (startReview),
  // elle, les ignore : une carte apprise reste due.
  const pool = CARDS.filter(c=>state.cats.has(c.cat) && nivOk(c) && themeOk(c));
  const deck = limitPool(state.order==='shuffle' ? shuffle(pool.slice()) : pool.slice());
  state.origQueue = deck.slice();
  const t1=performance.now();
  beginSession(deck);
  const t2=performance.now();
  perfReport('Départ de session', [['préparation',t1-t0],['rendu',t2-t1]], t0, t2);
}
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

// ================= Révision espacée (système de Leitner) =================
// Chaque réponse (dans TOUS les modes) fait monter ou redescendre la carte d'une
// « boîte » ; l'intervalle avant réapparition croît avec la boîte. Persisté en
// localStorage → la progression survit entre les sessions et les jours.
const SRS_KEY='srs_v1';
const SRS_INTERVALS=[0,1,2,4,8,16,32];      // jours avant réapparition, par boîte
const SRS_MASTER=4;                          // boîte à partir de laquelle « maîtrisée »
function todayNum(){ return Math.floor(Date.now()/86400000); }
// ⚠️ La clé porte la forme VOCALISÉE : la forme plate créait trois collisions
// d'homographes consonantiques (לְסַפֵּר raconter / לִסְפֹּר compter,
// לְלַמֵּד enseigner / לִלְמֹד étudier, שלומך m. / f.) — deux cartes partageaient
// alors la même boîte de Leitner et une session restaurée substituait l'une à
// l'autre. `cat|he` est vérifié unique sur les 713 cartes (0 doublon).
function cardId(c){ return c.cat+'|'+c.he; }
function srsLoad(){ try{ return JSON.parse(localStorage.getItem(SRS_KEY))||{}; }catch(e){ return {}; } }
function srsSave(){ try{ localStorage.setItem(SRS_KEY, JSON.stringify(SRS)); }catch(e){} }
let SRS=srsLoad();
// Migration des profils d'avant le changement de clé : l'entrée `cat|he_plain`
// est recopiée sous `cat|he`, puis retirée. Les deux cartes d'une ancienne
// collision héritent chacune de l'entrée partagée — meilleure information
// disponible, et déterministe. Appelée depuis buildChips(), quand CARDS existe.
function srsMigrateIds(){
  let moved=0;
  CARDS.forEach(c=>{
    const oldId=c.cat+'|'+c.he_plain, newId=cardId(c);
    if(oldId!==newId && SRS[oldId] && !SRS[newId]){
      SRS[newId]=JSON.parse(JSON.stringify(SRS[oldId])); moved++;
    }
  });
  if(moved){
    const keep=new Set(CARDS.map(cardId));
    Object.keys(SRS).forEach(k=>{ if(!keep.has(k)) delete SRS[k]; });
    srsSave();
  }
}
// Mémorise l'état SRS d'avant la dernière écriture → le verdict reste annulable
// (« Corriger ») tant qu'aucune autre carte n'a été jouée.
let lastRecord=null;
// Mode Cartes : la carte suivante s'affiche sitôt répondu → on garde de quoi
// revenir en arrière (carte + verdict) tant que la suivante n'est pas jouée.
let cardsUndo=null;
function recordResult(card, good){
  if(!card) return;
  const id=cardId(card), t=todayNum();
  lastRecord={ id, prev: SRS[id] ? JSON.parse(JSON.stringify(SRS[id])) : null };
  const e=SRS[id]||{box:0,due:t,seen:0,lapses:0};
  e.seen++;
  if(good){ e.box=Math.min(e.box+1, SRS_INTERVALS.length-1); }
  else { if(e.box>0) e.lapses++; e.box=0; }
  e.due=t+SRS_INTERVALS[e.box];
  SRS[id]=e; srsSave();
}
function undoLastRecord(){
  if(!lastRecord) return;
  if(lastRecord.prev) SRS[lastRecord.id]=lastRecord.prev; else delete SRS[lastRecord.id];
  srsSave(); lastRecord=null;
}
function dueCards(){
  const t=todayNum();
  return CARDS.filter(c=>{ const e=SRS[cardId(c)]; return e && e.due<=t; });
}
function masteryStats(){
  let seen=0, mastered=0;
  for(const c of CARDS){ const e=SRS[cardId(c)]; if(e){ seen++; if(e.box>=SRS_MASTER) mastered++; } }
  return {seen, mastered, total:CARDS.length};
}
function refreshSrsUi(){
  const btn=document.getElementById('review-btn'); if(!btn) return;
  const due=dueCards().length;
  // Une seule lampe à la fois : ce drapeau est la source de vérité unique de
  // l'état d'éclairage de l'accueil, et le CSS fait le reste (voir `.start`).
  document.body.classList.toggle('has-due', due>0);
  const m=masteryStats();
  const title=document.getElementById('review-title');
  const sub=document.getElementById('review-sub');
  if(due>0){
    btn.disabled=false;
    title.textContent='Réviser '+due+' carte'+(due>1?'s':'')+' maintenant';
    sub.textContent = (state.len!=='all' && due>+state.len)
      ? 'Par séances de '+state.len+', les plus anciennes d’abord — le reste attendra ici.'
      : 'Cartes à revoir aujourd’hui, tous thèmes confondus.';
  } else {
    btn.disabled=true;
    title.textContent = m.seen ? 'À jour — rien à réviser ✓' : 'Rien à réviser pour l’instant';
    sub.textContent = m.seen ? 'Reviens plus tard : les cartes réapparaîtront à échéance.'
                             : 'Après ta première réponse, chaque carte revient ici juste avant l\'oubli : espacée quand tu la sais, vite si tu la rates.';
  }
  const mEl=document.getElementById('mastery');
  if(m.seen>0){
    mEl.classList.remove('hide');
    document.getElementById('mastery-txt').innerHTML='<b>'+m.mastered+'</b> maîtrisée'+(m.mastered>1?'s':'')
      +' · <b>'+m.seen+'</b> vue'+(m.seen>1?'s':'')+' sur '+m.total;
    document.getElementById('mastery-bar').style.transform='scaleX('+(m.total?m.mastered/m.total:0)+')';
  } else { mEl.classList.add('hide'); }
}
function startReview(){
  const t0=performance.now();
  const pool=dueCards(); if(!pool.length) return;
  state.session='review';
  // La limite de longueur s'applique aussi ici : les plus en retard d'abord,
  // le reste demeure dû et réapparaît aussitôt sur la carte de révision.
  pool.sort((a,b)=>SRS[cardId(a)].due - SRS[cardId(b)].due);
  const deck = limitPool(pool);
  state.origQueue = deck.slice();
  const t1=performance.now();
  beginSession(shuffle(deck.slice()));
  const t2=performance.now();
  perfReport('Révision du jour', [['préparation',t1-t0],['rendu',t2-t1]], t0, t2);
}
(function(){ const b=document.getElementById('review-btn'); if(b) b.onclick=startReview; })();

// ================= Remise à zéro du profil =================
// Efface TOUT le local (srs_v1, prefs_v1, sess_v1) et remet l'appli dans l'état
// du premier lancement, en place. Deux temps obligatoires : le bouton ouvre une
// confirmation qui nomme la perte (nombre de cartes suivies), « Annuler » est le
// défaut sûr et reçoit le focus.
(function(){
  const btn=document.getElementById('reset-btn'); if(!btn) return;
  const confirmBox=document.getElementById('reset-confirm');
  const done=document.getElementById('reset-done');
  function resetProfile(){
    try{ localStorage.removeItem(SRS_KEY); localStorage.removeItem(PREFS_KEY); }catch(e){}
    sessClear();
    SRS={}; lastRecord=null; cardsUndo=null;
    // applyPrefs() sans préférence ne touche pas ces clés : on les remet aux
    // valeurs de l'objet `state` initial (celles du premier lancement).
    Object.assign(state, {mode:'cards', dir:'he2fr', script:'nikud', order:'shuffle', audio:'click', len:'20'});
    applyPrefs();       // aucune catégorie ni niveau sélectionné (état 1er lancement), chips reflétées
    refreshSrsUi();     // barre de maîtrise masquée, révision du jour désactivée
    updateStart();
    document.getElementById('exit-note').classList.add('hide');
  }
  btn.onclick=()=>{
    const seen=masteryStats().seen;
    document.getElementById('reset-warn').textContent = seen
      ? 'Tout sera effacé : ta progression de révision ('+seen+' carte'+(seen>1?'s':'')
        +' suivie'+(seen>1?'s':'')+'), tes réglages et la session en cours. Aucun retour possible.'
      : 'Tes réglages et la session en cours seront effacés (aucune carte suivie pour l\'instant). Aucun retour possible.';
    btn.classList.add('hide');
    done.classList.add('hide');
    confirmBox.classList.remove('hide');
    document.getElementById('reset-cancel').focus();
  };
  function closeConfirm(){
    confirmBox.classList.add('hide');
    btn.classList.remove('hide');
    btn.focus();
  }
  document.getElementById('reset-cancel').onclick=closeConfirm;
  document.getElementById('reset-yes').onclick=()=>{
    resetProfile();
    closeConfirm();
    done.classList.remove('hide');
  };
})();

// ================= Mode QCM (choix multiple) =================
function frShort(card){ return card.fr.split(/[\/,]| ou /)[0].replace(/\([^)]*\)/g,'').trim() || card.fr; }
function quizPrompt(card){
  return state.dir==='he2fr' ? heFront(card) : bigFr(card);
}
function quizChoiceHtml(opt){
  if(state.dir==='he2fr') return '<span>'+(opt.cat==='Phrases'?opt.fr:frShort(opt))+'</span>';
  const he = (state.script==='nikud') ? opt.he : opt.he_plain;
  return '<span class="qc-he" lang="he">'+he+'</span><span class="qc-tr">'+(opt.tr||he2tr(opt.he))+'</span>';
}
function pickDistractors(card, n){
  const key = state.dir==='he2fr' ? (c=>frShort(c).toLowerCase()) : (c=>c.he_plain);
  const answer=key(card), seen=new Set([answer]), out=[];
  // Deux options au français quasi identique (« content »/« contente ») ou au
  // synonyme partagé rendraient le choix ambigu — en fr→he, un distracteur
  // synonyme de la carte serait même une deuxième bonne réponse. On écarte tout
  // candidat dont une variante française frôle celles déjà retenues.
  const kept=[frVariants(card.fr)];
  const tooClose=c=>{
    const vs=frVariants(c.fr);
    return kept.some(ks=>ks.some(k=>vs.some(v=>v===k || (k.length>4 && editDist(v,k)<=1))));
  };
  const take=list=>{ for(const c of list){ if(out.length>=n) break; const k=key(c); if(!seen.has(k) && !tooClose(c)){ seen.add(k); kept.push(frVariants(c.fr)); out.push(c); } } };
  // Des distracteurs hors sujet rendent le QCM résoluble par élimination, sans
  // reconnaître le mot : on sert d'abord le thème de la carte. Seules les cartes
  // des 3 tables portent `theme` — pour les listes (theme absent) l'étage se
  // saute entièrement, sinon tous les sans-thème s'apparieraient entre eux.
  if(card.theme){
    take(shuffle(CARDS.filter(c=>c!==card && c.theme===card.theme && c.cat===card.cat)));
    if(out.length<n) take(shuffle(CARDS.filter(c=>c!==card && c.theme===card.theme && c.cat!==card.cat)));
  }
  if(out.length<n) take(shuffle(CARDS.filter(c=>c!==card && c.cat===card.cat)));
  if(out.length<n) take(shuffle(CARDS.filter(c=>c!==card && c.cat!==card.cat)));
  // Dernier recours (pool minuscule) : mieux vaut un voisin proche que < 4 options.
  if(out.length<n){
    for(const c of shuffle(CARDS.filter(c=>c!==card))){
      if(out.length>=n) break;
      const k=key(c); if(!seen.has(k)){ seen.add(k); out.push(c); }
    }
  }
  return out;
}
function setupQuizCard(card){
  document.body.classList.add('quiz-mode');
  document.body.classList.remove('input-mode');
  document.getElementById('controls-cards').classList.add('hide');
  document.getElementById('undo-card').classList.add('hide');
  document.getElementById('input-zone').classList.add('hide');
  document.getElementById('quiz-zone').classList.remove('hide');
  const kh=document.getElementById('kbd-hint');
  kh.innerHTML='<kbd>1</kbd>–<kbd>4</kbd> choisir · <kbd>entrée</kbd> suivant · <kbd>c</kbd> corriger<span class="spk-hint"> · <kbd>p</kbd> écouter</span>';
  kh.classList.remove('hide');
  document.getElementById('face-hint').textContent = state.dir==='he2fr' ? 'choisis la traduction' : 'choisis le mot hébreu';
  document.getElementById('quiz-next').classList.add('hide');
  const qf=document.getElementById('quiz-fix'); qf.classList.add('hide'); qf.disabled=false;
  document.getElementById('quiz-ex').innerHTML='';
  document.getElementById('quiz-live').textContent='';
  const box=document.getElementById('quiz-choices'); box.innerHTML='';
  const options=shuffle([card, ...pickDistractors(card,3)]);
  state.quizOptions=options;
  options.forEach(opt=>{
    const b=document.createElement('button'); b.className='qc'; b.type='button';
    if(opt.cat==='Phrases') b.classList.add('ph');
    b.innerHTML=quizChoiceHtml(opt);
    bindTap(b, ()=>quizPick(b, opt, card));
    box.appendChild(b);
  });
}
function quizPick(btn, chosen, card){
  if(state.answered) return;
  state.answered=true;
  const correct = chosen===card;
  const opts=state.quizOptions;
  const btns=[...document.getElementById('quiz-choices').querySelectorAll('.qc')];
  btns.forEach((b,i)=>{ b.disabled=true;
    if(opts[i]===card) b.classList.add('ok');
    else if(b===btn) b.classList.add('no');
    else b.classList.add('dim');
  });
  recordResult(card, correct);
  if(correct) state.goodCount++; else state.missed.push(card);
  // Verdict du QCM : annoncé aussi aux lecteurs d'écran (les couleurs ne suffisent pas).
  const goodTxt = state.dir==='he2fr' ? (card.cat==='Phrases'?card.fr:frShort(card))
                                      : card.he_plain+' ('+(card.tr||he2tr(card.he))+')';
  document.getElementById('quiz-live').textContent =
    correct ? 'Exact !' : 'Raté — la bonne réponse était : '+goodTxt;
  // Même correction du verdict qu'en mode saisie : un pouce qui glisse s'annule.
  const fix=document.getElementById('quiz-fix');
  fix.textContent = correct ? 'En fait, je ne savais pas' : 'J’avais juste →';
  fix.classList.remove('hide');
  fix.onclick=()=>quizFixVerdict(card, correct, fix);
  document.getElementById('quiz-ex').innerHTML = exHtml(card);
  document.getElementById('quiz-next').classList.remove('hide');
  updateSpeaker();
  // « Automatique » seulement : en « Au clic », le bouton haut-parleur reste le seul déclencheur.
  if(state.audio==='auto') speakCurrent();
  sessSave();
}
// Inverse le dernier verdict du QCM (pendant que la carte est encore affichée) :
// SRS annulé puis réécrit, compteurs de session réalignés, bouton figé en confirmation.
function quizFixVerdict(card, wasCorrect, btn){
  undoLastRecord();
  const nowGood=!wasCorrect;
  recordResult(card, nowGood);
  if(nowGood){
    state.goodCount++;
    const i=state.missed.lastIndexOf(card); if(i!==-1) state.missed.splice(i,1);
  } else {
    state.goodCount=Math.max(0,state.goodCount-1);
    state.missed.push(card);
  }
  btn.textContent = nowGood ? '✓ Compté comme réussi' : '✗ À revoir';
  btn.disabled=true;
  document.getElementById('quiz-live').textContent = nowGood ? 'Compté comme réussi.' : 'Compté à revoir.';
  sessSave();
}
// Passage à la carte suivante : identique au mode saisie → on réutilise nextAfterInput.
bindTap(document.getElementById('quiz-next'), nextAfterInput);

function heFront(card){
  const ph = card.cat==='Phrases' ? ' phrase' : '';
  if(state.script==='plain') return '<div class="big-he'+ph+'" lang="he">'+card.he_plain+'</div>';
  if(state.script==='cursive') return '<div class="big-he cursive'+ph+'" lang="he">'+card.he_plain+'</div>';
  return '<div class="big-he'+ph+'" lang="he">'+card.he+'</div>';
}
function bigFr(card){ return '<div class="big-fr'+(card.cat==='Phrases'?' phrase':'')+'">'+card.fr+'</div>'; }
function formsHtml(card){
  if(!card.forms) return '';
  // Les verbes (4 formes il/elle/ils/elles) passent en grille 2×2 ; noms et
  // adjectifs (1 et 3 formes) gardent la ligne souple.
  const grid = card.cat==='Verbes' ? ' forms-grid' : '';
  let h='<div class="forms'+grid+'">';
  card.forms.forEach(f=>{ h+='<div class="form-cell"><span class="f-he" lang="he">'+f.he+'</span><span class="f-lbl">'+f.label+(f.tr?' · '+f.tr:'')+'</span></div>'; });
  return h+'</div>';
}
// Exemples en situation : pli « Voir un exemple », uniquement là où la réponse est
// déjà visible (verso des Cartes, feedback de Saisie, verdict du QCM) — jamais
// côté recto en fr→he, l'exemple contient le mot. Texte toujours affiché ;
// l'audio (phrase entière) n'est qu'un complément, masqué sous no-he-voice.
function exHtml(card){
  if(!card.exemples || !card.exemples.length) return '';
  const n=card.exemples.length;
  let h='<div class="ex-wrap"><button class="ex-toggle" type="button" aria-expanded="false">'
    +(n>1 ? 'Voir les '+n+' exemples' : 'Voir un exemple')+'</button><div class="ex-box hide">';
  card.exemples.forEach(ex=>{
    h+='<div class="ex-item"><button class="ex-speak" type="button" data-he="'+escapeHtml(ex.he)+'" aria-label="Écouter l\'exemple">'+SPK_SVG+'</button>'
     +'<div class="ex-body"><div class="ex-he" lang="he">'+ex.he+'</div>'
     +'<div class="ex-tr">'+ex.tr+'</div>'
     +'<div class="ex-fr">'+ex.fr+'</div></div></div>';
  });
  return h+'</div></div>';
}
function exActivate(t){
  if(t.classList.contains('ex-toggle')){
    const open=t.getAttribute('aria-expanded')==='true';
    t.setAttribute('aria-expanded', open?'false':'true');
    const box=t.nextElementSibling;
    if(box){
      box.classList.toggle('hide', open);
      // Le libellé suit l'état : un pli ouvert propose de se refermer.
      const n=box.querySelectorAll('.ex-item').length;
      t.textContent = open
        ? (n>1 ? 'Voir les '+n+' exemples' : 'Voir un exemple')
        : (n>1 ? 'Masquer les exemples' : 'Masquer l’exemple');
      // La face de carte défile (.face en overflow-y) : l'exemple déplié doit
      // entrer dans le champ, sinon le tap semble ne rien faire sur mobile.
      if(!open){ try{ box.scrollIntoView({block:'nearest'}); }catch(e){} }
    }
  } else speak(t.dataset.he);
}
// Délégation façon bindTap (les zones sont réinjectées en innerHTML à chaque carte) :
// pointerup d'abord avec stopPropagation — sinon le tap remonterait jusqu'au
// bindTap de #flip et retournerait la carte — puis click en filet (clavier inclus).
function exBind(el){
  if(!el) return;
  let handled=false;
  const hit=e=>(e.target.closest ? e.target.closest('.ex-toggle,.ex-speak') : null);
  el.addEventListener('pointerup', e=>{ const t=hit(e); if(!t) return; e.preventDefault(); e.stopPropagation(); handled=true; exActivate(t); setTimeout(()=>handled=false,50); });
  el.addEventListener('click', e=>{ const t=hit(e); if(!t) return; e.preventDefault(); e.stopPropagation(); if(!handled) exActivate(t); });
}
exBind(document.getElementById('face-content'));
exBind(document.getElementById('feedback'));
exBind(document.getElementById('quiz-ex'));
exBind(document.getElementById('search-results'));

function render(){
  const card=state.queue[state.idx];
  state.flipped=false;
  state.answered=false;

  const note = card.note ? '<div class="note-line">'+card.note+'</div>' : '';

  if(state.mode==='quiz'){
    state.frontHtml = quizPrompt(card);   // pas de verso en QCM : la carte ne se retourne pas
  } else if(state.dir==='he2fr'){
    state.frontHtml = heFront(card);
    // En mode saisie, inflexions visibles directement sous le mot : elles sont en
    // hébreu et ne révèlent donc pas la traduction française demandée.
    if(state.mode==='input') state.frontHtml += formsHtml(card);
    let b = bigFr(card);
    b += '<div class="translit">'+(card.tr||he2tr(card.he))+'</div>';
    if(state.script!=='nikud') b += '<div class="sub-he" lang="he">'+card.he+'</div>';
    b += formsHtml(card) + note + exHtml(card);
    state.backHtml = b;
  } else {
    state.frontHtml = bigFr(card) + (card.tr?'<div class="translit">'+card.tr+'</div>':'');
    let b = '<div class="big-he" lang="he">'+card.he+'</div>';
    b += '<div class="cursive-line" lang="he">'+card.he_plain+'</div>';
    b += '<div class="translit">'+(card.tr||he2tr(card.he))+'</div>';
    b += formsHtml(card) + note + exHtml(card);
    state.backHtml = b;
  }

  document.getElementById('face-cat').textContent = card.cat;
  document.getElementById('face-content').innerHTML = state.frontHtml;
  animateFace();

  document.getElementById('counter').textContent=(state.idx+1)+' / '+state.total;
  document.getElementById('barfill').style.transform='scaleX('+(state.idx/state.total)+')';
  const bar=document.querySelector('.bar');
  bar.setAttribute('aria-valuemax', state.total);
  bar.setAttribute('aria-valuenow', state.idx);

  if(state.mode==='input') setupInputCard(card);
  else if(state.mode==='quiz') setupQuizCard(card);
  else setupCardsMode();

  updateSpeaker();
  if(state.audio==='auto' && state.dir==='he2fr') speakCurrent();
  sessSave();
}

function setupCardsMode(){
  document.body.classList.remove('input-mode','quiz-mode');
  document.getElementById('controls-cards').classList.remove('hide');
  document.getElementById('undo-card').classList.toggle('hide', !cardsUndo);
  document.getElementById('input-zone').classList.add('hide');
  document.getElementById('quiz-zone').classList.add('hide');
  const kh=document.getElementById('kbd-hint');
  kh.innerHTML='<kbd>espace</kbd> retourner · <kbd>&larr;</kbd> à revoir · <kbd>&rarr;</kbd> je savais · <kbd>c</kbd> annuler<span class="spk-hint"> · <kbd>p</kbd> écouter</span>';
  kh.classList.remove('hide');
  document.getElementById('flip-live').textContent='';
  document.getElementById('face-hint').textContent = 'touche la carte pour la retourner';
  document.getElementById('btn-flip').classList.remove('hide');
  document.getElementById('btn-again').classList.add('hide');
  document.getElementById('btn-good').classList.add('hide');
}

function setupInputCard(card){
  document.body.classList.add('input-mode');
  document.body.classList.remove('quiz-mode');
  document.getElementById('controls-cards').classList.add('hide');
  document.getElementById('undo-card').classList.add('hide');
  document.getElementById('input-zone').classList.remove('hide');
  document.getElementById('quiz-zone').classList.add('hide');
  document.getElementById('kbd-hint').classList.add('hide');
  document.getElementById('face-hint').textContent = state.dir==='he2fr' ? 'traduis en français' : 'écris en hébreu';
  const inp=document.getElementById('answer-input');
  inp.value=''; inp.className=''; inp.disabled=false;
  inp.placeholder = state.dir==='he2fr' ? 'Traduction en français…' : 'En hébreu ou en translittération (ex. shalom, chaver)…';
  document.getElementById('input-row').classList.remove('hide');
  document.getElementById('btn-check').classList.remove('hide');
  document.getElementById('feedback').innerHTML='';
  document.getElementById('btn-next').classList.add('hide');
  // Actions secondaires : passer + clavier hébreu (fr→he uniquement)
  document.getElementById('input-actions').classList.remove('hide');
  const kbT=document.getElementById('kb-toggle');
  const heIn = state.dir==='fr2he';
  kbT.classList.toggle('hide', !heIn);
  kbT.textContent = state.kbOpen ? 'Masquer le clavier' : 'Clavier hébreu';
  document.getElementById('hebkb').classList.toggle('hide', !(heIn && state.kbOpen));
  setTimeout(()=>{ try{ inp.focus(); }catch(e){} }, 60);
}

function animateFace(){
  const face=document.getElementById('face');
  face.classList.remove('flip-anim'); void face.offsetWidth; face.classList.add('flip-anim');
  face.scrollTop=0;
}

function doFlip(){
  state.flipped=!state.flipped;
  document.getElementById('face-content').innerHTML = state.flipped ? state.backHtml : state.frontHtml;
  document.getElementById('face-hint').textContent = state.flipped ? 'touche pour revenir au recto' : 'touche la carte pour la retourner';
  // Le verso change par innerHTML, invisible aux lecteurs d'écran sans région
  // live : on annonce la réponse (français + translittération prononçable).
  const card=state.queue[state.idx];
  const live=document.getElementById('flip-live');
  if(state.flipped && card){
    const tr=card.tr||he2tr(card.he);
    let txt = state.dir==='he2fr' ? card.fr+' — '+tr : tr+' — '+card.fr;
    // Le pli « Voir un exemple » est invisible à l'oreille : l'annoncer,
    // sinon un lecteur d'écran ignore que le verso a plus à offrir.
    if(card.exemples && card.exemples.length){
      txt += card.exemples.length>1
        ? '. '+card.exemples.length+' exemples disponibles sur la carte.'
        : '. Un exemple disponible sur la carte.';
    }
    live.textContent = txt;
  } else live.textContent='';
  animateFace();
  if(state.flipped){
    document.getElementById('btn-flip').classList.add('hide');
    document.getElementById('btn-again').classList.remove('hide');
    document.getElementById('btn-good').classList.remove('hide');
  } else {
    document.getElementById('btn-flip').classList.remove('hide');
    document.getElementById('btn-again').classList.add('hide');
    document.getElementById('btn-good').classList.add('hide');
  }
  updateSpeaker();
  if(state.audio==='auto' && state.flipped && state.dir==='fr2he') speakCurrent();
}
function bindTap(el, fn){
  let handled=false;
  el.addEventListener('pointerup', (e)=>{ e.preventDefault(); e.stopPropagation(); handled=true; fn(); setTimeout(()=>handled=false,50); });
  el.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); if(!handled) fn(); });
}
bindTap(document.getElementById('flip'), ()=>{ if(state.mode==='cards') doFlip(); });
bindTap(document.getElementById('btn-flip'), doFlip);

function answer(good){
  const card=state.queue[state.idx];
  recordResult(card, good);
  cardsUndo={ card, good };
  if(good) state.goodCount++; else state.missed.push(card);
  state.idx++;
  if(state.idx>=state.queue.length) finish();
  else render();
}
// Revient à la carte précédente en défaisant tout ce que la réponse a écrit :
// SRS (undoLastRecord), compteurs de session et position dans la file.
function undoCardAnswer(){
  if(!cardsUndo || state.mode!=='cards') return;
  undoLastRecord();
  if(cardsUndo.good) state.goodCount=Math.max(0,state.goodCount-1);
  else { const i=state.missed.lastIndexOf(cardsUndo.card); if(i!==-1) state.missed.splice(i,1); }
  state.idx=Math.max(0,state.idx-1);
  cardsUndo=null;
  render();
}
bindTap(document.getElementById('undo-card'), undoCardAnswer);
bindTap(document.getElementById('btn-good'), ()=>answer(true));
bindTap(document.getElementById('btn-again'), ()=>answer(false));
bindTap(document.getElementById('speak-btn'), speakCurrent);

// ---------- Input mode: answer checking ----------
function normFr(s){
  return (s||'')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\([^)]*\)/g,' ')
    .replace(/[.!?;:«»"']/g,' ')
    .replace(/\s+/g,' ')
    .trim()
    .replace(/^(le|la|les|l|un|une|des|du|de|d|a|au|aux|se|s|to)\s+/,'');
}
function frVariants(fr){
  return fr.split(/[\/,]| ou /).map(normFr).filter(Boolean);
}
function normHe(s){ return (s||'').replace(/[\u0591-\u05C7]/g,'').replace(/\s+/g,' ').trim(); }
function editDist(a,b){
  const m=a.length,n=b.length; if(!m)return n; if(!n)return m;
  const d=Array.from({length:m+1},(_,i)=>[i,...Array(n).fill(0)]);
  for(let j=0;j<=n;j++)d[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
    d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  }
  return d[m][n];
}
// ---------- Translittération automatique depuis le nikud ----------
function he2tr(he){
  var V={}; V[0x05B7]='a'; V[0x05B8]='a'; V[0x05B2]='a'; V[0x05B5]='e'; V[0x05B6]='e'; V[0x05B1]='e';
  V[0x05B4]='i'; V[0x05B9]='o'; V[0x05BA]='o'; V[0x05B3]='o'; V[0x05BB]='u';
  var out='', s=(he||'').trim(), wordStart=true;
  for(var i=0;i<s.length;i++){
    var ch=s[i], code=s.charCodeAt(i);
    if(code>=0x0591&&code<=0x05C7) continue;
    var j=i+1, marks=[];
    while(j<s.length){ var c=s.charCodeAt(j); if(c>=0x0591&&c<=0x05C7){ marks.push(c); j++; } else break; }
    function has(m){ return marks.indexOf(m)!==-1; }
    var hasVowel=marks.some(function(m){ return V[m]; });
    var isFinal=(j>=s.length || s[j]===' ');
    var cons='';
    switch(ch){
      // Standard de translittération (cf. carnet) : א = ' entre deux voyelles
      // seulement (tsme'a) ; ע = ' partout ('ivrit, be'er, rega').
      case 'א': cons=(hasVowel && !wordStart && /[aeiou]$/.test(out))?"'":''; break;
      case 'ע': cons="'"; break;
      case 'ב': cons=has(0x05BC)?'b':'v'; break;
      case 'ג': cons='g'; break;
      case 'ד': cons='d'; break;
      case 'ה': cons='h'; break;
      case 'ו':
        if(has(0x05BC) && !hasVowel){ out+='u'; wordStart=false; continue; }
        if(has(0x05B9)||has(0x05BA)){ out+='o'; wordStart=false; continue; }
        cons='v'; break;
      case 'ז': cons='z'; break;
      case 'ח': cons='ch'; break;                    // standard : ח = ch
      case 'ט': cons='t'; break;
      case 'י': cons='y'; break;
      case 'כ': cons=has(0x05BC)?'k':'kh'; break;    // standard : כ sans daguech = kh
      case 'ך': cons='kh'; break;
      case 'ל': cons='l'; break;
      case 'מ': case 'ם': cons='m'; break;
      case 'נ': case 'ן': cons='n'; break;
      case 'ס': cons='s'; break;
      case 'פ': cons=has(0x05BC)?'p':'f'; break;
      case 'ף': cons='f'; break;
      case 'צ': case 'ץ': cons='ts'; break;          // standard : צ = ts
      case 'ק': cons='k'; break;
      case 'ר': cons='r'; break;
      case 'ש': cons=has(0x05C2)?'s':'sh'; break;
      case 'ת': cons='t'; break;
      default: cons=(ch===' ')?' ':(/[a-z]/i.test(ch)?ch:''); break;
    }
    // Patach furtif : la voyelle se lit avant la gutturale finale (koach, yode'a).
    if(isFinal && has(0x05B7)){
      if(ch==='ח'){ out+='ach'; wordStart=false; continue; }
      if(ch==='ע'){ out+="'a"; wordStart=false; continue; }
    }
    out+=cons;
    var emitted=false;
    for(var k=0;k<marks.length;k++){ if(V[marks[k]]){ out+=V[marks[k]]; emitted=true; } }
    // Shva vocalisé : sur la première consonne d'un mot, il se prononce "e" (ledaber, metayel).
    if(!emitted && wordStart && cons && cons!==' ' && has(0x05B0)) out+='e';
    if(ch===' ') wordStart=true; else if(cons||emitted) wordStart=false;
  }
  out=out.replace(/iy(?![aeiou])/g,'i');
  out=out.replace(/ey/g,'ei');  // tsere/segol + yud → ei (beit, einayim)
  // Le hé final se garde (standard : atah, zeh, morah).
  return out;
}
function trKey(s){
  s=(s||'').toLowerCase().replace(/[^a-z]/g,'');
  s=s.replace(/ph/g,'f').replace(/kh/g,'ch').replace(/q/g,'k').replace(/w/g,'v').replace(/tz/g,'ts');
  s=s.replace(/ou/g,'u').replace(/ch/g,'h');
  s=s.replace(/(.)\1+/g,'$1');
  return s;
}
// Renvoie 'exact', 'almost' (accepté par tolérance orthographique) ou false.
function checkAnswer(card, raw){
  const user = (raw||'').trim();
  if(!user) return false;
  if(state.dir==='he2fr'){
    const u = normFr(user);
    const variants = frVariants(card.fr);
    let almost=false;
    for(const v of variants){
      if(!v) continue;
      if(u===v) return 'exact';
      if(v.length>4 && editDist(u,v)<=1) almost=true;
    }
    return almost ? 'almost' : false;
  } else {
    const uHe = normHe(user);
    if(uHe && uHe===normHe(card.he)) return 'exact';
    // Translittération : celle du carnet si présente, sinon générée depuis le nikud
    const uTr = trKey(user);
    let almost=false;
    if(uTr){
      const cands = [];
      if(card.tr) cands.push(trKey(card.tr));
      cands.push(trKey(he2tr(card.he)));
      for(const c of cands){
        if(!c) continue;
        if(uTr===c) return 'exact';
        const tol = c.length>=8 ? 2 : (c.length>=4 ? 1 : 0);
        if(tol && editDist(uTr,c)<=tol) almost=true;
      }
    }
    return almost ? 'almost' : false;
  }
}
function answerHtml(card){
  let h = '<div class="answer">';
  if(state.dir==='he2fr'){
    h += '<span class="he" lang="he">'+card.he+'</span>';
    h += '<div>'+card.fr+'</div>';
    h += '<div class="tr">'+(card.tr||he2tr(card.he))+'</div>';
  } else {
    h += '<div>'+card.fr+'</div>';
    h += '<span class="he" lang="he">'+card.he+'</span>';
    h += '<div class="tr">'+(card.tr||he2tr(card.he))+'</div>';
  }
  h += '</div>';
  // Inflexions : en français→hébreu elles n'apparaissent qu'ici (les montrer avant
  // révélerait la réponse) ; en hébreu→français elles sont déjà sur la carte.
  if(state.dir==='fr2he') h += formsHtml(card);
  if(card.note) h += '<div class="note-line">'+card.note+'</div>';
  return h;
}
function escapeHtml(s){ return (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
// Retour du mode saisie : verdict, tentative barrée si ratée, correction, et un
// bouton « Corriger » qui inverse le dernier verdict (faux négatif du correcteur
// indulgent, ou aveu d'une bonne réponse devinée). kind : 'ok' | 'almost' | 'no' | 'skip'.
function showInputFeedback(card, kind, attempt){
  const fb=document.getElementById('feedback');
  const verdict = kind==='ok'     ? '<div class="verdict ok">✓ Correct</div>'
                : kind==='almost' ? '<div class="verdict ok">✓ Presque ! La forme exacte&nbsp;:</div>'
                : kind==='no'     ? '<div class="verdict no">✗ Pas tout à fait — la réponse&nbsp;:</div>'
                :                   '<div class="verdict">La réponse&nbsp;:</div>';
  const tried = (kind==='no' && attempt)
    ? '<div class="your-answer">Ta réponse : <s>'+escapeHtml(attempt)+'</s></div>'
    : (kind==='almost' && attempt)
    ? '<div class="your-answer">Ta réponse : '+escapeHtml(attempt)+'</div>' : '';
  const fixLabel = (kind==='ok'||kind==='almost') ? 'En fait, je ne savais pas' : 'J’avais juste →';
  fb.innerHTML = verdict + tried + answerHtml(card) + exHtml(card)
    + '<button class="fix-btn" type="button" id="fix-verdict">'+fixLabel+'</button>';
  const btn=document.getElementById('fix-verdict');
  if(btn) btn.onclick=()=>fixVerdict(card, kind, btn);
}
function fixVerdict(card, kind, btn){
  undoLastRecord();
  const nowGood = (kind!=='ok' && kind!=='almost');   // ok/almost→raté ; no/skip→réussi
  recordResult(card, nowGood);
  if(nowGood){
    state.goodCount++;
    const i=state.missed.lastIndexOf(card); if(i!==-1) state.missed.splice(i,1);
  } else {
    state.goodCount=Math.max(0,state.goodCount-1);
    state.missed.push(card);
  }
  const fb=document.getElementById('feedback');
  const v=fb.querySelector('.verdict');
  if(v){ v.className='verdict '+(nowGood?'ok':'no'); v.innerHTML = nowGood ? '✓ Compté comme réussi' : '✗ À revoir'; }
  const ya=fb.querySelector('.your-answer'); if(ya && nowGood) ya.remove();
  btn.remove();
  sessSave();
}
function submitAnswer(){
  if(state.answered) return;
  const card=state.queue[state.idx];
  const inp=document.getElementById('answer-input');
  const attempt=inp.value.trim();
  // Champ vide (Entrée réflexe, pouce qui glisse) : ni raté compté, ni écriture
  // SRS — « Je ne sais pas » est là pour révéler la réponse volontairement.
  if(!attempt){ try{ inp.focus(); }catch(e){} return; }
  const res=checkAnswer(card, inp.value);
  const correct=!!res;
  state.answered=true;
  inp.disabled=true;
  inp.classList.add(correct?'ok':'no');
  document.getElementById('input-row').classList.add('hide');
  document.getElementById('input-actions').classList.add('hide');
  document.getElementById('hebkb').classList.add('hide');
  recordResult(card, correct);
  showInputFeedback(card, correct?(res==='almost'?'almost':'ok'):'no', attempt);
  document.getElementById('btn-next').classList.remove('hide');
  if(correct) state.goodCount++; else state.missed.push(card);
  updateSpeaker();
  if(state.audio==='auto') speakCurrent();
  sessSave();
}
function nextAfterInput(){
  state.idx++;
  if(state.idx>=state.queue.length) finish();
  else render();
}
bindTap(document.getElementById('btn-check'), submitAnswer);
bindTap(document.getElementById('btn-next'), nextAfterInput);

// ---------- « Je ne sais pas » : révèle la réponse et compte la carte à revoir ----------
function skipAnswer(){
  if(state.answered) return;
  const card=state.queue[state.idx];
  state.answered=true;
  const inp=document.getElementById('answer-input');
  inp.disabled=true;
  document.getElementById('input-row').classList.add('hide');
  document.getElementById('input-actions').classList.add('hide');
  document.getElementById('hebkb').classList.add('hide');
  recordResult(card, false);
  showInputFeedback(card, 'skip', null);
  document.getElementById('btn-next').classList.remove('hide');
  state.missed.push(card);
  updateSpeaker();
  if(state.audio==='auto') speakCurrent();
  sessSave();
}
bindTap(document.getElementById('btn-skip'), skipAnswer);

// ---------- Clavier hébreu virtuel (ordre alphabétique) ----------
(function(){
  const kb=document.getElementById('hebkb'); if(!kb) return;
  // Disposition standard israélienne (3 rangées) ; lettres finales en doré.
  const ROWS=['קראטוןםפ','שדגכעיחלךף','זסבהנמצתץ'];
  const FINALS='ךםןףץ';
  ROWS.forEach(function(row){
    const r=document.createElement('div'); r.className='kb-row';
    row.split('').forEach(function(ch){
      const b=document.createElement('button'); b.type='button';
      if(FINALS.indexOf(ch)!==-1) b.className='kb-final';
      b.textContent=ch; b.dataset.ch=ch; r.appendChild(b);
    });
    kb.appendChild(r);
  });
  const ctl=document.createElement('div'); ctl.className='kb-row';
  const bsp=document.createElement('button'); bsp.type='button'; bsp.className='kb-ctl'; bsp.dataset.act='bsp'; bsp.textContent='\u232B'; ctl.appendChild(bsp);
  const spc=document.createElement('button'); spc.type='button'; spc.className='kb-ctl kb-space'; spc.dataset.act='space'; spc.textContent='espace'; ctl.appendChild(spc);
  kb.appendChild(ctl);
  kb.addEventListener('pointerdown', function(e){ e.preventDefault(); });
  kb.addEventListener('click', function(e){
    const b=e.target.closest('button'); if(!b) return;
    const inp=document.getElementById('answer-input'); if(inp.disabled) return;
    let s=inp.selectionStart, en=inp.selectionEnd;
    if(s==null){ s=inp.value.length; } if(en==null){ en=s; }
    if(b.dataset.act==='bsp'){
      if(s===en && s>0){ inp.value=inp.value.slice(0,s-1)+inp.value.slice(en); s=s-1; }
      else { inp.value=inp.value.slice(0,s)+inp.value.slice(en); }
    } else {
      const ch=b.dataset.act==='space'?' ':(b.dataset.ch||'');
      inp.value=inp.value.slice(0,s)+ch+inp.value.slice(en); s=s+ch.length;
    }
    inp.focus(); try{ inp.setSelectionRange(s,s); }catch(err){}
  });
})();
document.getElementById('kb-toggle').addEventListener('click', function(){
  state.kbOpen=!state.kbOpen;
  document.getElementById('hebkb').classList.toggle('hide', !state.kbOpen);
  this.textContent = state.kbOpen ? 'Masquer le clavier' : 'Clavier hébreu';
});
document.getElementById('answer-input').addEventListener('keydown', e=>{
  if(e.key==='Enter'){
    e.preventDefault(); e.stopPropagation();  // ne pas laisser l'événement atteindre le handler global
    if(state.answered) nextAfterInput(); else submitAnswer();
  }
});
// Après la réponse (le champ est désactivé et ne capte plus rien), Entrée ou Espace
// passent à la carte suivante depuis n'importe où sur la page.
document.addEventListener('keydown', e=>{
  if(!document.getElementById('study').classList.contains('active')) return;
  if(state.mode!=='input' || !state.answered) return;
  if(e.target && e.target.id==='answer-input') return;  // le champ gère son propre Enter
  // Un bouton focalisé (Corriger, Voir un exemple, Écouter…) gère Entrée/Espace
  // lui-même — même garde que le QCM, sinon le bouton devient inatteignable au clavier.
  if(e.target && e.target.tagName==='BUTTON') return;
  if(e.key==='Enter' || e.code==='Space'){ e.preventDefault(); nextAfterInput(); }
});

function finish(){
  sessClear();
  document.body.classList.remove('input-mode','quiz-mode');
  refreshSrsUi();
  document.getElementById('study').classList.remove('active');
  document.getElementById('done').classList.add('active');
  document.getElementById('barfill').style.transform='scaleX(1)';
  document.querySelector('.bar').setAttribute('aria-valuenow', state.total);
  const el=document.getElementById('score');
  el.innerHTML=state.goodCount+'<small>/'+state.total+'</small>';
  const pct=Math.round(state.goodCount/state.total*100);
  let msg;
  if(pct===100) msg='Sans faute. כָּל הַכָּבוֹד !';
  else if(pct>=70) msg='Bien joué ! Plus que '+state.missed.length+' carte'+(state.missed.length>1?'s':'')+' à revoir avant le sans-faute.';
  else msg='Encore un peu d\'entraînement — '+state.missed.length+' à revoir.';
  // Fin de révision : les ratées sont retombées en boîte 0, donc dues aussitôt —
  // l'expliquer, sinon le compteur qui ne descend pas ressemble à un bug.
  if(state.session==='review' && state.missed.length){
    msg+=' Les ratées sont aussitôt redevenues dues : la révision du jour les repropose jusqu’à ce qu’elles tiennent.';
  }
  document.getElementById('done-msg').textContent=msg;
  // « Rejouer ces N cartes » : même tirage (origQueue), le libellé l'explicite.
  const nOrig=state.origQueue.length;
  document.getElementById('retry-all').textContent =
    nOrig===1 ? 'Rejouer cette carte' : 'Rejouer ces '+nOrig+' cartes';
  // Les ratées, listées avant de rejouer : on sait quoi retravailler sans relancer à l'aveugle.
  const list=document.getElementById('missed-list');
  list.classList.toggle('hide', !state.missed.length);
  list.innerHTML = state.missed.map(c=>
    '<li><span class="m-he" lang="he">'+c.he+'</span><span class="m-fr">'+c.fr+'</span></li>').join('');
  document.getElementById('retry-missed').classList.toggle('hide', !state.missed.length);
}

document.getElementById('retry-missed').onclick=()=>{
  beginSession(state.order==='shuffle' ? shuffle(state.missed.slice()) : state.missed.slice());
};
// « Recommencer » rejoue les cartes de la session (catégories OU révision), jamais
// un re-filtrage des catégories — sinon une session de révision repartirait à vide.
document.getElementById('retry-all').onclick=()=>{
  const pool = state.origQueue.slice();
  beginSession(state.order==='shuffle' ? shuffle(pool) : pool);
};
document.getElementById('back-setup').onclick=()=>{
  sessClear();
  refreshSrsUi();
  document.getElementById('done').classList.remove('active');
  document.getElementById('study').classList.remove('active');
  document.getElementById('setup').classList.remove('hidden');
};
document.getElementById('exit').onclick=()=>{
  // Chaque réponse donnée est déjà écrite dans la révision (recordResult à
  // chaque carte) : l'accueil le dit, pour que « Quitter » ne semble pas tout jeter.
  const n = state.idx + (state.answered?1:0);
  const note=document.getElementById('exit-note');
  if(n>0){
    note.textContent='Session interrompue — '+n+' réponse'+(n>1?'s':'')+' sur '
      +state.total+' déjà comptée'+(n>1?'s':'')+' dans ta révision.';
    note.classList.remove('hide');
  }
  sessClear();
  document.body.classList.remove('input-mode','quiz-mode');
  refreshSrsUi();
  document.getElementById('study').classList.remove('active');
  document.getElementById('setup').classList.remove('hidden');
};

// keyboard
document.addEventListener('keydown', e=>{
  if(!document.getElementById('study').classList.contains('active')) return;
  if(state.mode!=='cards') return;
  if(e.code==='Space'){
    // Même garde que le QCM : Espace sur un bouton du verso (Voir un exemple,
    // Écouter) doit activer le bouton, pas re-retourner la carte. Les flèches,
    // elles, jugent depuis n'importe où.
    if(e.target && e.target.tagName==='BUTTON') return;
    e.preventDefault(); doFlip();
  }
  else if(state.flipped && e.code==='ArrowRight'){ answer(true); }
  else if(state.flipped && e.code==='ArrowLeft'){ answer(false); }
});
// Clavier du QCM : 1–4 choisissent une option, Entrée/Espace passent à la
// suivante — le mode saisie avait déjà son équivalent, pas le QCM.
document.addEventListener('keydown', e=>{
  if(!document.getElementById('study').classList.contains('active')) return;
  if(state.mode!=='quiz') return;
  if(!state.answered && e.key>='1' && e.key<='4'){
    const b=document.querySelectorAll('#quiz-choices .qc')[+e.key-1];
    if(b){ e.preventDefault(); b.click(); }
  } else if(state.answered && (e.key==='Enter' || e.code==='Space')){
    // Un bouton focalisé (Corriger, Suivant…) gère Entrée/Espace lui-même.
    if(e.target && e.target.tagName==='BUTTON') return;
    e.preventDefault(); nextAfterInput();
  }
});
// P comme « prononcer » : rejoue l'audio de la carte courante dans tous les
// modes, uniquement quand le haut-parleur est visible (mêmes règles que lui —
// jamais avant la réponse en fr→he, jamais sans voix hébraïque).
document.addEventListener('keydown', e=>{
  if(!document.getElementById('study').classList.contains('active')) return;
  if(e.key!=='p' && e.key!=='P') return;
  if(e.ctrlKey || e.metaKey || e.altKey) return;         // Ctrl+P (imprimer) reste au navigateur
  if(e.target && e.target.id==='answer-input') return;   // on est en train de taper
  const spk=document.getElementById('speak-btn');
  if(spk && !spk.classList.contains('hide') && !document.body.classList.contains('no-he-voice')){
    e.preventDefault(); speakCurrent();
  }
});
// C comme « corriger » : active le bouton de correction du mode courant —
// « Corriger » en Saisie, en QCM, « Annuler la dernière réponse » en Cartes.
// Uniquement quand ce bouton est visible et actif : mêmes règles que lui.
document.addEventListener('keydown', e=>{
  if(!document.getElementById('study').classList.contains('active')) return;
  if(e.key!=='c' && e.key!=='C') return;
  if(e.ctrlKey || e.metaKey || e.altKey) return;         // Ctrl+C (copier) reste au navigateur
  if(e.target && (e.target.tagName==='INPUT' || e.target.tagName==='TEXTAREA')) return;
  const btn = state.mode==='cards' ? document.getElementById('undo-card')
            : state.mode==='input' ? document.getElementById('fix-verdict')
            :                        document.getElementById('quiz-fix');
  if(btn && !btn.classList.contains('hide') && !btn.disabled){ e.preventDefault(); btn.click(); }
});

// ===== BUILD:ONLINE-ONLY : bloc remplace par build.js dans le fichier autonome =====
// ---------- Chargement runtime des cartes (cards.json, généré par build.js) ----------

function showLoaderError(reason){
  const loader=document.getElementById('loader');
  const spin=loader.querySelector('.spin');
  if(spin) spin.style.display='none';
  const isFile = location.protocol==='file:';
  const isOffline = ('onLine' in navigator) && navigator.onLine===false;
  let title, detail;
  if(isFile){
    title="Cette page a besoin d'un petit serveur.";
    detail="Ouverte directement depuis un fichier, elle ne peut pas charger le carnet. "
      + "Passe par son adresse en ligne, ou lance un serveur local (par ex. <code>python3 -m http.server</code>).";
  } else if(isOffline){
    title="Connexion perdue.";
    detail="Le carnet n'a pas pu être récupéré — vérifie ta connexion, puis réessaie.";
  } else {
    title="Le vocabulaire n'a pas pu être chargé.";
    detail="Le carnet est peut-être momentanément indisponible. Réessaie dans un instant.";
  }
  loader.innerHTML='<p class="loader-title">'+title+'</p>'
    + '<p class="loader-detail">'+detail+'</p>'
    + (isFile ? '' : '<button class="retry" type="button" id="loader-retry">Réessayer</button>');
  const btn=document.getElementById('loader-retry');
  if(btn) btn.onclick=()=>{
    loader.innerHTML='<div class="spin"></div><p id="loader-msg">Chargement du vocabulaire…</p>';
    init();
  };
}
async function init(){
  const loader=document.getElementById('loader');
  const msg=document.getElementById('loader-msg');
  try{
    const tB0=performance.now();
    const res = await fetch('./cards.json', {cache:'no-store'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const tB1=performance.now();
    CARDS = (await res.json()).cartes;
    const tB2=performance.now();
    if(!CARDS.length) throw new Error('empty');
    buildChips();
    updateStart();
    const tB3=performance.now();
    // Décomposition du démarrage pour le diagnostic de latence : c'est ici que
    // vivrait un boot lent (H3 du dossier — le carnet, pas l'app).
    const pb=document.getElementById('perf-boot');
    if(pb) pb.textContent='Chargement : carnet (réseau) '+fmtMs(tB1-tB0)
      +' · extraction '+fmtMs(tB2-tB1)+' · construction '+fmtMs(tB3-tB2)
      +' · total '+fmtMs(tB3-tB0);
    loader.style.display='none';
    if(!bootResumed) document.getElementById('setup').classList.remove('hidden');
    const note=document.getElementById('count-note');
    note.textContent = CARDS.length + ' mots chargés';
    // Garde-fou : une catégorie disparue de data/ ou un décalage de listCats entre
    // build.js et app.html fait disparaître ses cartes de cards.json sans erreur —
    // signaler toute catégorie vide.
    const counts={};
    CARDS.forEach(c=>{ counts[c.cat]=(counts[c.cat]||0)+1; });
    console.log('Cartes par catégorie :', counts);
    const missing = catOrder.filter(c=>!counts[c]);
    if(missing.length){
      console.warn('Catégories attendues sans carte :', missing);
      note.innerHTML += '<br><span style="color:var(--red)">Aucune carte dans : '
        + missing.join(', ') + ' — vocabulaire manquant dans data/ ?</span>';
    }
  }catch(err){
    showLoaderError(err);
  }
}
init();

// ---------- PWA : service worker (hors-ligne) ----------
// Dans le bloc ONLINE-ONLY : le standalone n'a pas besoin de cache et un
// enregistrement en file:// échouerait de toute façon.
if ('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js')
    .catch(err => console.warn('Service worker non enregistré :', err));
}
// ===== /BUILD:ONLINE-ONLY =====

