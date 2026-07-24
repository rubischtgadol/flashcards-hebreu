// Expose : setupCardsMode, setupInputCard, animateFace, doFlip, bindTap, answer, undoCardAnswer, showInputFeedback, fixVerdict, submitAnswer, nextAfterInput, skipAnswer, cardsUndo — Utilise : state (99), recordResult/undoLastRecord (08), finish (09), checkAnswer/answerHtml (03), exHtml (10), updateSpeaker/speakCurrent (06), he2tr (02), sessSave (04)
// Mode Cartes : la carte suivante s'affiche sitôt répondu → on garde de quoi
// revenir en arrière (carte + verdict) tant que la suivante n'est pas jouée.
let cardsUndo=null;

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