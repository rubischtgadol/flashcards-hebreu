// Expose : escapeHtml, shuffle, todayNum, fmtMs — Utilise : (rien — utilitaires purs)
function fmtMs(v){ return (v>=100 ? ''+Math.round(v) : v.toFixed(1).replace('.', ','))+'\u202fms'; }   // espace fine insécable avant l'unité (convention fr), en escape \u pour rester visible dans la source
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function todayNum(){ return Math.floor(Date.now()/86400000); }
function escapeHtml(s){ return (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }