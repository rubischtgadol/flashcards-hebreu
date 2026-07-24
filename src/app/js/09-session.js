// Expose : beginSession, start, finish — Utilise : state (99), CARDS (05), nivOk/themeOk/limitPool (07), shuffle (01), render (10), sessSave/sessClear (04), refreshSrsUi (08), perfReport (13)
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