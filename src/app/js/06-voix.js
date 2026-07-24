// Expose : loadVoices, reflectVoiceUi, speak, speakCurrent, updateSpeaker, TTS_OK, heVoice — Utilise : state (99)

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