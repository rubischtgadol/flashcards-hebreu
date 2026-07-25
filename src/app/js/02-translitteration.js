// Expose : he2tr, trKey, normHe, editDist — Utilise : (rien — logique pure)
function normHe(s){ return (s||'').replace(/[\u0591-\u05C7]/g,'').replace(/\s+/g,' ').trim(); }
function editDist(a,b){
  const m=a.length,n=b.length; if(!m)return n; if(!n)return m;
  const d=Array.from({length:m+1},(_,i)=>[i,...Array(n).fill(0)]);
  for(let j=0;j<=n;j++)d[0][j]=j;
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
    d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  }
  return d[m][n];
}
// ---------- Translittération automatique depuis le nikud ----------
function he2tr(he){
  var V={}; V[0x05B7]='a'; V[0x05B8]='a'; V[0x05B2]='a'; V[0x05B5]='e'; V[0x05B6]='e'; V[0x05B1]='e';
  V[0x05B4]='i'; V[0x05B9]='o'; V[0x05BA]='o'; V[0x05B3]='o'; V[0x05BB]='u';
  var out='', s=(he||'').trim(), wordStart=true;
  for(var i=0;i<s.length;i++){
    var ch=s[i], code=s.charCodeAt(i);
    if(code>=0x0591&&code<=0x05C7) continue;
    var j=i+1, marks=[];
    while(j<s.length){ var c=s.charCodeAt(j); if(c>=0x0591&&c<=0x05C7){ marks.push(c); j++; } else break; }
    function has(m){ return marks.indexOf(m)!==-1; }
    // Le yod qui suit clôt-il le mot ? (sert au cas de l'alef muet : achra'i)
    var yodFinal=false;
    if(s[j]==='י'){
      yodFinal=true;
      for(var q=j+1;q<s.length;q++){
        var cq=s.charCodeAt(q);
        if(cq>=0x0591&&cq<=0x05C7) continue;
        yodFinal=(s[q]===' '); break;
      }
    }
    var hasVowel=marks.some(function(m){ return V[m]; });
    var isFinal=(j>=s.length || s[j]===' ');
    var cons='';
    switch(ch){
      // Standard de translittération (cf. carnet) : א = ' entre deux voyelles
      // seulement (tsme'a) ; ע = ' partout ('ivrit, be'er, rega').
      // א = ' entre deux voyelles (tsme'ah), et devant un yod FINAL porteur du
      // i, où l'alef s'entend également (achra'i, et non achray).
      case 'א': cons=(!wordStart && /[aeiou]$/.test(out) && (hasVowel || yodFinal))?"'":''; break;
      case 'ע': cons="'"; break;
      case 'ב': cons=has(0x05BC)?'b':'v'; break;
      case 'ג': cons='g'; break;
      case 'ד': cons='d'; break;
      case 'ה': cons='h'; break;
      case 'ו':
        if(has(0x05BC) && !hasVowel){ out+='u'; wordStart=false; continue; }
        if(has(0x05B9)||has(0x05BA)){ out+='o'; wordStart=false; continue; }
        cons='v'; break;
      case 'ז': cons='z'; break;
      case 'ח': cons='ch'; break;                    // standard : ח = ch
      case 'ט': cons='t'; break;
      case 'י': cons='y'; break;
      case 'כ': cons=has(0x05BC)?'k':'kh'; break;    // standard : כ sans daguech = kh
      case 'ך': cons='kh'; break;
      case 'ל': cons='l'; break;
      case 'מ': case 'ם': cons='m'; break;
      case 'נ': case 'ן': cons='n'; break;
      case 'ס': cons='s'; break;
      case 'פ': cons=has(0x05BC)?'p':'f'; break;
      case 'ף': cons='f'; break;
      case 'צ': case 'ץ': cons='ts'; break;          // standard : צ = ts
      case 'ק': cons='k'; break;
      case 'ר': cons='r'; break;
      case 'ש': cons=has(0x05C2)?'s':'sh'; break;
      case 'ת': cons='t'; break;
      default: cons=(ch===' ')?' ':(/[a-z]/i.test(ch)?ch:''); break;
    }
    // Patach furtif : la voyelle se lit avant la gutturale finale (koach, yode'a).
    if(isFinal && has(0x05B7)){
      if(ch==='ח'){ out+='ach'; wordStart=false; continue; }
      if(ch==='ע'){ out+="'a"; wordStart=false; continue; }
    }
    out+=cons;
    var emitted=false;
    for(var k=0;k<marks.length;k++){ if(V[marks[k]]){ out+=V[marks[k]]; emitted=true; } }
    // Shva vocalisé : sur la première consonne d'un mot, il se prononce "e" (ledaber, metayel).
    if(!emitted && wordStart && cons && cons!==' ' && has(0x05B0) && !(/[שסכצ]/.test(ch) && !/[אהחער]/.test(s[j]))) out+='e';
    // Shva entre deux consonnes IDENTIQUES : il s'entend toujours (bodedim, et
    // non boddim) — la gémination n'est pas prononçable, l'hébreu insère la
    // voyelle. s[j] est la lettre suivante, les signes ayant été consommés.
    else if(!emitted && cons && cons!==' ' && has(0x05B0) && s[j]===ch) out+='e';
    if(ch===' ') wordStart=true; else if(cons||emitted) wordStart=false;
  }
  out=out.replace(/iy(?![aeiou])/g,'i');
  out=out.replace(/ey(?![aeiou])/g,'ei');  // tsere/segol + yud → ei (beit, einayim)
  out=out.replace(/'y(?=\s|$)/g,"'i");     // alef + yod final : achra'i, et non achra'y
  // Le hé final se garde (standard : atah, zeh, morah).
  return out;
}
function trKey(s){
  s=(s||'').toLowerCase().replace(/[^a-z]/g,'');
  s=s.replace(/ph/g,'f').replace(/kh/g,'ch').replace(/q/g,'k').replace(/w/g,'v').replace(/tz/g,'ts');
  s=s.replace(/ou/g,'u').replace(/ch/g,'h');
  // Shva initial : il s'entend ou non selon le mot (shkufah mais ledaber, cf.
  // CLAUDE.md § Transliteration standard). he2tr tranche pour l'affichage ;
  // la SAISIE, elle, doit accepter les deux graphies — on replie donc le « e »
  // qui sépare les deux consonnes d'attaque. Sans ce pliage, corriger he2tr
  // rétrograderait « shekufah » de Correct à Presque.
  s=s.replace(/^([^aeiou]{1,2})e(?=[^aeiou])/,'$1');
  s=s.replace(/(.)\1+/g,'$1');
  return s;
}