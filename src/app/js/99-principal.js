// Expose : init, showLoaderError, state — Utilise : tout ce qui précède (01 à 13)

const state = {
  dir:'he2fr', script:'nikud', order:'shuffle', audio:'click', mode:'cards', len:'20',
  session:'normal', cats:new Set(), niveaux:new Set(), themes:new Set(),
  queue:[], origQueue:[], idx:0, flipped:false, missed:[], goodCount:0, total:0
};
document.addEventListener('pointerup', e=>{ lastPointerUp=e.timeStamp; }, {capture:true, passive:true});
if(TTS_OK){ loadVoices(); window.speechSynthesis.onvoiceschanged = loadVoices; }
else reflectVoiceUi();
document.getElementById('search-input').addEventListener('input', runSearch);
document.getElementById('search-clear').addEventListener('click', ()=>{
  const input=document.getElementById('search-input');
  input.value=''; runSearch(); input.focus();
});
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
// Passage à la carte suivante : identique au mode saisie → on réutilise nextAfterInput.
bindTap(document.getElementById('quiz-next'), nextAfterInput);
exBind(document.getElementById('face-content'));
exBind(document.getElementById('feedback'));
exBind(document.getElementById('quiz-ex'));
exBind(document.getElementById('search-results'));
bindTap(document.getElementById('flip'), ()=>{ if(state.mode==='cards') doFlip(); });
bindTap(document.getElementById('btn-flip'), doFlip);
bindTap(document.getElementById('undo-card'), undoCardAnswer);
bindTap(document.getElementById('btn-good'), ()=>answer(true));
bindTap(document.getElementById('btn-again'), ()=>answer(false));
bindTap(document.getElementById('speak-btn'), speakCurrent);
bindTap(document.getElementById('btn-check'), submitAnswer);
bindTap(document.getElementById('btn-next'), nextAfterInput);
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

