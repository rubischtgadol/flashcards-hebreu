// Expose : prefsLoad, savePrefs, sessSave, sessClear, sessRestore, srsLoad, srsSave, srsMigrateIds, cardId, PREFS_KEY, SESS_KEY, bootResumed, SRS_KEY, SRS — Utilise : CARDS (05), render (10), state (99)

// ================= Préférences de réglage (persistées) =================
// Les choix du panneau de réglages survivent d'une session à l'autre. Restaurés
// au boot par applyPrefs(), appelé depuis buildChips() → couvre les deux chemins
// (init() en ligne ET démarrage direct du fichier autonome).
const PREFS_KEY='prefs_v1';
function prefsLoad(){ try{ return JSON.parse(localStorage.getItem(PREFS_KEY))||null; }catch(e){ return null; } }
function savePrefs(){
  try{
    localStorage.setItem(PREFS_KEY, JSON.stringify({
      cats:[...state.cats], niveaux:[...state.niveaux], themes:[...state.themes], mode:state.mode, dir:state.dir,
      script:state.script, order:state.order, audio:state.audio, len:state.len
    }));
  }catch(e){}
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

// ================= Révision espacée (système de Leitner) =================
// Chaque réponse (dans TOUS les modes) fait monter ou redescendre la carte d'une
// « boîte » ; l'intervalle avant réapparition croît avec la boîte. Persisté en
// localStorage → la progression survit entre les sessions et les jours.
const SRS_KEY='srs_v1';
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