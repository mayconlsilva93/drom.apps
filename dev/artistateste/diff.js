function dromSeg(s){var o=String(s[12]||""),k=o.search(/hor[áa]rios?\s*:/i);if(k<0)return null;var R=/(\d{1,2})(?:[:h](\d{2}))?\s*(?:às|as|à|até|a|-|–)\s*(\d{1,2})(?:[:h](\d{2}))?/gi,m,L=[],p=-1,t=o.slice(k);while(m=R.exec(t)){var a=+m[1]*60+(+m[2]||0),b=+m[3]*60+(+m[4]||0);if(a>=1440||b>1440)continue;if(p>=0)while(a<p)a+=1440;while(b<=a)b+=1440;L.push([a,b]);p=b}if(L.length<2)return null;var f=x=>{x%=1440;return String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0")};return{L:L,txt:L.map(x=>f(x[0])+" – "+f(x[1])).join(" · "),ini:f(L[0][0]),fim:f(L[L.length-1][1]),perm:L[L.length-1][1]-L[0][0],set:L.reduce((t,x)=>t+x[1]-x[0],0)}}
/* DROM · diferenças entre duas versões da agenda (usado no app e na Action de notificações) */
/* formato padrão: "Sex 13/11 00:00 • Evento (Local) • Cidade/UF" */
var DW=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],DP=n=>String(n).padStart(2,"0");
function dromDia(s,B){var d=new Date(B,s[19]-1,s[0]),y=d.getFullYear();return DW[d.getDay()]+" "+DP(d.getDate())+"/"+DP(d.getMonth()+1)+(y!==new Date(Date.now()-108e5).getFullYear()?"/"+y:"")}
function dromNome(s){return s[1]?(s[2]&&s[2]!==s[1]?s[1]+" ("+s[2]+")":s[1]):(s[2]||"")}
function dromIni(s){var m=/^(\d\d):(\d\d)/.exec(s[4]||"");return m?m[0]:""}
function dromFaixa(s){var g=dromSeg(s);if(g)return g.txt.replace(/ – /g,"-");var i=dromIni(s);if(!i)return"horário a definir";if(!s[5])return i;var t=(+i.slice(0,2))*60+(+i.slice(3))+s[5];t%=1440;return i+"-"+DP(Math.floor(t/60))+":"+DP(t%60)}
function dromLn(s,B,o){o=o||{};var a=o.faixa?dromFaixa(s):(o.dia===false?"":dromDia(s,B)+(o.hora&&dromIni(s)?" "+dromIni(s):""));return[a,dromNome(s),s[3]].filter(Boolean).join(" • ")}
function dromBRL(v){return"R$ "+Number(v||0).toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g,".")}
function dromDiff(A,Bn,B){
  var M=a=>{var m={};(a||[]).forEach(s=>{m[s[14]]=s});return m};
  var a=M(A),b=M(Bn),out=[];
  var F=[[4,"horário"],[5,"duração"],[2,"local"],[3,"cidade"]];
  var du=m=>!m?"a definir":m<60?m+" min":Math.floor(m/60)+"h"+(m%60?DP(m%60):"");
  var v=(i,x)=>i===5?du(x):(x===null||x===undefined||x==="")?"—":String(x);
  Object.keys(b).forEach(k=>{var s=b[k],o=a[k],L=dromLn(s,B);
    if(!o){out.push({k:"novo",t:"Novo show na agenda!",b:dromLn(s,B,{hora:1})});return}
    if(o[0]!==s[0]||o[19]!==s[19])out.push({k:"alt",t:"Show reagendado!",b:L+": "+dromDia(o,B)+" → "+dromDia(s,B)});
    var ch=F.filter(f=>String(o[f[0]]??"")!==String(s[f[0]]??"")).map(f=>f[1]+" "+v(f[0],o[f[0]])+" → "+v(f[0],s[f[0]]));
    if(ch.length)out.push({k:"alt",t:"Alteração em show!",b:L+": "+ch.join("; ")});
    if(!o[21]&&s[21]>0&&!s[18])out.push({k:"pag",t:"Sinal pago!",b:L+": "+s[21]+"% - "+dromBRL(s[15]*s[21]/100)});
    if(!o[18]&&s[18])out.push({k:"pag",t:"Cachê pago!",b:L+": "+(s[24]?"valor pendente":dromBRL(s[15]))+(s[18]!=="pago"?" - pago em "+s[18]:"")});
  });
  Object.keys(a).forEach(k=>{if(!b[k])out.push({k:"rem",t:"Show cancelado!",b:dromLn(a[k],B)})});
  return out;
}
/* início do show em ms (madrugada 00:00–05:59 = dia seguinte); null se "a definir" */
function dromStart(s,B){var m=/^(\d\d):(\d\d)/.exec(s[4]||"");if(!m)return null;var h=+m[1],d=new Date(B,s[19]-1,s[0]+(h<6?1:0),h,+m[2]);return d.getTime()}
if(typeof module!=="undefined")module.exports={dromDiff,dromStart,dromLn,dromDia,dromFaixa,dromNome};
