// Expose : quizPrompt, quizChoiceHtml, pickDistractors, setupQuizCard, quizPick, quizFixVerdict — Utilise : state (99), heFront/bigFr/frShort/exHtml (10), he2tr (02), shuffle (01), editDist (02), frVariants (03), bindTap/nextAfterInput (11), recordResult/undoLastRecord (08), sessSave (04), updateSpeaker/speakCurrent (06)
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