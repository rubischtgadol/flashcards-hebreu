// Expose : applyPrefs, reflectSeg, perfReport, SEG_KEYS, lastPointerUp — Utilise : state (99), catCounts/nivCounts/themeCounts/catsEl/nivEl/themeEl/refreshAdvSub/refreshFoldSubs/applyFoldState (07)
const SEG_KEYS=['mode','dir','script','order','audio','len'];
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

// ================= Diagnostic de latence (dossier « lag iPhone », 20/07/2026) =================
// Trois temps par geste, affichés dans « Réglages avancés » : « attente » (dernier
// doigt levé → le gestionnaire démarre — c'est là que vivrait un délai de synthèse
// du clic ou un fil principal occupé), « travail » (le gestionnaire, décomposé),
// « affichage » (gestionnaire terminé → image peinte, via double
// requestAnimationFrame). L'écriture du texte se fait APRÈS la capture du temps
// de peinture, pour ne pas mesurer sa propre mise à jour.
let lastPointerUp=0;
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