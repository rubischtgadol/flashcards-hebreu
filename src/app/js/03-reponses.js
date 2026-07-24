// Expose : normFr, frVariants, checkAnswer, answerHtml — Utilise : he2tr/trKey/normHe/editDist (02), formsHtml (10), state (99)

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