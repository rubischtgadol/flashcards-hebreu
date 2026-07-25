// Expose : recordResult, undoLastRecord, dueCards, masteryStats, refreshSrsUi, startReview, lastRecord — Utilise : CARDS (05), cardId/SRS/srsSave (04), state (99), limitPool (07), shuffle (01), beginSession (09), perfReport (13)
const SRS_INTERVALS=[0,1,2,4,8,16,32];      // jours avant réapparition, par boîte
const SRS_MASTER=4;                          // boîte à partir de laquelle « maîtrisée »
// Mémorise l'état SRS d'avant la dernière écriture → le verdict reste annulable
// (« Corriger ») tant qu'aucune autre carte n'a été jouée.
let lastRecord=null;
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