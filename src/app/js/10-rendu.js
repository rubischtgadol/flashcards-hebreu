// Expose : render, heFront, bigFr, formsHtml, exHtml, exActivate, exBind, frShort — Utilise : state (99), he2tr (02), speak/updateSpeaker/speakCurrent (06), setupCardsMode/setupInputCard (11), setupQuizCard (12), sessSave (04), escapeHtml (01)

// ================= Mode QCM (choix multiple) =================
function frShort(card){ return card.fr.split(/[\/,]| ou /)[0].replace(/\([^)]*\)/g,'').trim() || card.fr; }

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
      // L'exemple déplié doit entrer dans le champ, sinon le tap semble ne rien
      // faire. Ce qui bouge dépend du palier : sur téléphone c'est l'intérieur de
      // la carte (#face-content y garde overflow-y:auto) ; au-dessus de 900px la
      // carte n'a plus de dedans à cacher — elle grandit — et c'est la page qui
      // se replace. `block:'nearest'` couvre les deux sans distinction.
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