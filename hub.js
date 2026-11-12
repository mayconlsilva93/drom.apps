/* DROM Hub · PIN próprio, lista dos apps, abre cada app aqui dentro, junta as notificações de todos */
(function(){
var WEEK=7*864e5,B=2023,$=id=>document.getElementById(id),H=null,CFG=null,AK=null,DATA={};
var VAPID="BGH4ccixrVQN6Qmct71zljsKsyClz5k-Fk0dfzXhfWtIA7b_AAIwZjuWmCO-u8LVX0HswJ80GifqLCno7Wf04-k";
var SURL="https://script.google.com/macros/s/AKfycbzk5iksIZVvdK27taLTcpQbdPebxGjP7ilwNxiQDYwUuTSaMz80Hifmgr-5aazWhI0R/exec";
var b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),b6=u=>btoa(String.fromCharCode.apply(null,u));
var ls={g:k=>{try{return JSON.parse(localStorage.getItem("hb_"+k))}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem("hb_"+k,JSON.stringify(v))}catch(e){}}};
function db(){return new Promise((ok,er)=>{var r=indexedDB.open("drom",1);r.onupgradeneeded=()=>r.result.createObjectStore("k");r.onsuccess=()=>ok(r.result);r.onerror=()=>er(r.error)})}
async function kget(n){try{var d=await db();return await new Promise(ok=>{var q=d.transaction("k").objectStore("k").get(n);q.onsuccess=()=>ok(q.result||null);q.onerror=()=>ok(null)})}catch(e){return null}}
async function kput(n,v){try{var d=await db();await new Promise(ok=>{var t=d.transaction("k","readwrite");t.objectStore("k").put(v,n);t.oncomplete=ok;t.onerror=ok})}catch(e){}}
async function kdel(ns){try{var d=await db();await new Promise(ok=>{var t=d.transaction("k","readwrite"),o=t.objectStore("k");ns.forEach(n=>o.delete(n));t.oncomplete=ok;t.onerror=ok})}catch(e){}}
async function derive(pin,salt){var k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pin),"PBKDF2",false,["deriveKey"]);
 return crypto.subtle.deriveKey({name:"PBKDF2",salt:b64(salt),iterations:200000,hash:"SHA-256"},k,{name:"AES-GCM",length:256},false,["decrypt"])}
async function dec(key,iv,ct){var t=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64(iv)},key,b64(ct));return JSON.parse(new TextDecoder().decode(t))}
/* ---------- PIN ---------- */
async function start(){
 if(window.HUBCFG){/* versão artefato do Claude: sem PIN; dados em data.js */$("lk").remove();$("lo").remove();return goArt()}
 try{var r=await fetch("h.json",{cache:"no-store"});H=await r.json()}catch(e){$("lkm").textContent="Sem conexão. Tente de novo.";$("lk").hidden=false;return}
 var st=await kget("hub");
 if(st&&st.salt===H.salt&&Date.now()-st.ts<WEEK){try{await go(await dec(st.key,H.iv,H.ct));return}catch(e){}}
 if(st)await kdel(["hub"]);$("lk").hidden=false;$("usr").focus()}
$("lkf").onsubmit=async e=>{e.preventDefault();var us=$("usr").value.trim().toLowerCase(),pw=$("pin").value;if(!us||!pw)return;var pin=us+"\n"+pw;$("lkm").textContent="Verificando…";
 try{var key=await derive(pin,H.salt),c=await dec(key,H.iv,H.ct);await kput("hub",{key:key,salt:H.salt,ts:Date.now()});$("pin").value="";$("usr").value="";await go(c)}
 catch(er){$("lkm").textContent="Login ou senha incorretos.";$("pin").value="";$("pin").focus()}};
async function goArt(){CFG=window.HUBCFG;document.body.classList.remove("locked");var A=(window.DROMDATA||{}).A||{};
 var RR=(window.DROMDATA||{}).R||{};CFG.apps.forEach(a=>{DATA[a.f]={S:A[a.k]||[],R:RR[a.k],up:""}});icons();notif();draw();if(TAB!=="h")hview()}
/* ---------- depois de entrar ---------- */
async function go(c){CFG=c;$("lk").remove();document.body.classList.remove("locked");
 AK=await crypto.subtle.importKey("raw",b64(c.ak),"AES-GCM",false,["decrypt","encrypt"]);
 /* libera os apps dos artistas neste aparelho (mesma chave do PIN deles), para abrirem aqui dentro sem pedir PIN */
 for(var a of c.apps)await kput(a.idb,{key:AK,salt:c.as,ts:Date.now(),v:2});
 draw();icons();
 await Promise.all(c.apps.map(async a=>{try{var r=await fetch(a.f+"/d.json",{cache:"no-store"}),d=await r.json();var dd=await dec(AK,d.iv,d.ct);DATA[a.f]={S:dd.S||[],OT:dd.OT||[],BK:dd.BK||[],up:d.up||""}}catch(e){DATA[a.f]={S:[],up:"",err:1}}}));
 notif();draw();if(TAB!=="h")hview()}
var HIDE=ls.g("hide")||false,fm=v=>Number(v||0).toFixed(2).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g,".");
var nm=a=>a.n.replace(/^DJ /,"");
function st(a){var d=DATA[a.f];if(!d)return null;var now=Date.now(),y=a.old?null:2026,A=d.S.filter(s=>a.old||(s[19]>=37&&s[19]<=48)),v=A.reduce((x,s)=>x+(+s[15]||0),0),
 rz=A.filter(s=>{var t=dromStart(s,B)||new Date(B,s[19]-1,s[0]+1,6).getTime();return t+(+s[5]||0)*6e4<now}).length,
 pr=d.S.map(s=>[dromStart(s,B)||new Date(B,s[19]-1,s[0],23,59).getTime(),s]).filter(x=>x[0]>now).sort((p,q)=>p[0]-q[0])[0],
 fin=s=>(dromStart(s,B)||new Date(B,s[19]-1,s[0]+1,6).getTime())+(+s[5]||0)*6e4<now,vr=A.filter(fin).reduce((x,s)=>x+(+s[15]||0),0),
 nx=d.S.map(s=>[dromStart(s,B)||new Date(B,s[19]-1,s[0],23,59).getTime(),s]).filter(x=>x[0]>now&&x[0]<=now+7*864e5).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
 return{n:A.length,v:v,vr:vr,va:v-vr,rz:rz,ar:A.length-rz,nx:nx,up:d.up}}
function draw(){var L=$("list");L.innerHTML="";var ups=[],so=0,g=null;
 CFG.apps.forEach(a=>{if(!g||(a.old&&!so)){if(a.old){so=1;L.insertAdjacentHTML("beforeend",'<div class="sh">Ex-artistas</div>')}else L.insertAdjacentHTML("beforeend",'<div class="sh">Casting atual</div>');g=document.createElement("div");g.className="hg";L.appendChild(g)}
  var d=DATA[a.f];if(d&&d.up)ups.push(d.up);var nn=(LOG||[]).filter(x=>!x.r&&x.f===a.f).length;
  var el=document.createElement("div");el.className="hi"+(a.old?" gy":"");
  el.innerHTML='<a href="'+(a.url||a.f+"/")+'" target="_blank" rel="noopener" class="hph" title="Abrir app"><img alt="'+nm(a)+'" src="'+a.img+'">'+(nn?'<i class="nb">'+nn+'</i>':"")+'</a><button type="button" class="hnm">'+nm(a)+'</button>';
  if(!a.url)el.querySelector(".hph").onclick=e=>{if(e.button||e.ctrlKey||e.metaKey||e.shiftKey)return;e.preventDefault();open(a)};el.querySelector(".hnm").onclick=()=>info(a);g.appendChild(el)});
 ups.sort((x,y)=>{var p=s=>s.replace(/(\d\d)\/(\d\d)\/(\d{4}) (.*)/,"$3$2$1 $4");return p(y)<p(x)?-1:1});
 $("upd").textContent=ups.length?"Dados atualizados em "+ups[0]:window.DROMUPD?"Dados atualizados em "+window.DROMUPD:""}
function info(a){var s=st(a),m=$("inf"),R=v=>'<span class="nw">'+(HIDE?"R$ ••••••":"R$ "+fm(v))+"</span>";
 m.innerHTML='<div class="hif"><img alt="" src="'+a.img+'"><b>'+nm(a)+'</b>'+(a.old?'<small>ex-artista</small>':"")+(s?'<dl>'+
  '<dt>'+(a.old?"Shows no histórico":"Shows em 2026")+'</dt><dd>'+s.n+(a.old||!s.ar?"":'<br><small class="hsm">realizados '+s.rz+' · a realizar '+s.ar+'</small>')+'</dd>'+
  '<dt>'+(a.old?"Cachês no histórico":"Cachês em 2026")+'</dt><dd>'+R(s.v)+(a.old||!s.va?"":'<br><small class="hsm">realizados '+R(s.vr)+' · a realizar '+R(s.va)+'</small>')+'</dd>'+
  (a.old?"":'<dt>Próximos shows (7 dias)</dt><dd>'+(s.nx.length?s.nx.map(x=>dromLn(x,B,{hora:1})).join("<br>"):"nenhum nos próximos 7 dias")+'</dd>')+
  '</dl>':'<p>carregando…</p>')+'<div class="lob"><button class="loc">Fechar</button>'+(a.url?'<a class="loy hop" href="'+a.url+'" target="_blank" rel="noopener">Abrir app</a>':'<button class="loy hop">Abrir app</button>')+'</div></div>';
 m.hidden=false;m.onclick=e=>{if(e.target===m)m.hidden=true};m.querySelector(".loc").onclick=()=>m.hidden=true;
 var o=m.querySelector(".hop");o.onclick=()=>{m.hidden=true;if(!a.url)open(a)}}
/* ---------- abrir app dentro do hub ---------- */
function open(a){$("frn").textContent=nm(a);$("frx").href=a.f+"/";$("ifr").src=a.f+"/?h="+Date.now();$("fr").hidden=false;history.pushState({fr:1},"")}
function close(){$("fr").hidden=true;$("ifr").src="about:blank"}
$("bk").onclick=()=>{close();if(history.state&&history.state.fr)history.back()};
addEventListener("popstate",()=>{if(!$("fr").hidden)close()});
/* ---------- ícones do topo ---------- */
var SV=p=>'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+"</svg>";
function icons(){
 if($("lo"))$("lo").innerHTML=SV('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>');
 $("bell").innerHTML=SV('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>')+"<i></i>";
 eye()}
function eye(){$("eye").innerHTML=SV('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'+(HIDE?'<path d="M4 4l16 16"/>':""));$("eye").title=HIDE?"Mostrar valores em R$":"Ocultar valores em R$"}
$("eye").onclick=()=>{HIDE=!HIDE;ls.s("hide",HIDE);eye();draw()};
if($("lo"))$("lo").onclick=()=>{var m=document.createElement("div");m.className="lom";m.innerHTML='<div><b>Sair do Hub?</b><p>Sai do Hub e dos apps dos artistas neste aparelho. Para entrar de novo será preciso digitar o PIN.</p><div class="lob"><button class="loc">Cancelar</button><button class="loy">Sair</button></div></div>';
 document.body.appendChild(m);m.querySelector(".loc").onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()};
 m.querySelector(".loy").onclick=async()=>{await kdel(["hub"].concat(CFG.apps.map(a=>a.idb)));location.reload()}};
/* ---------- notificações (todos os artistas) ---------- */
var LOG=null,NV=10,pn=$("npn");
function notif(){var now=Date.now(),snap=ls.g("snap")||{},rm=ls.g("rem")||{};LOG=ls.g("log")||[];
 CFG.apps.forEach(a=>{var d=DATA[a.f];if(!d||d.err)return;var S=d.S;
  if(snap[a.f])dromDiff(snap[a.f],S,B).forEach(x=>LOG.unshift({f:a.f,t:"["+nm(a)+"] "+x.t,b:x.b,ts:now,r:0}));snap[a.f]=S;
  S.forEach(s=>{var t=dromStart(s,B),k=a.f+s[14];if(t&&t>now&&t-now<864e5&&!rm[k]){rm[k]=1;LOG.unshift({f:a.f,t:"["+nm(a)+"] Em breve",b:dromLn(s,B),ts:now,r:0})}})});
 LOG=LOG.slice(0,50);ls.s("snap",snap);ls.s("rem",rm);ls.s("log",LOG);badge();
 var q=LOG.filter(x=>!x.r&&x.ts===now).length;if(q){var t=document.createElement("div");t.className="ntoast";t.textContent=(q===1?"1 novidade":q+" novidades")+" — toque no sino";document.body.appendChild(t);setTimeout(()=>t.remove(),5000)}}
function badge(){var n=(LOG||[]).filter(x=>!x.r).length,b=$("bell");b.querySelector("i").textContent=n?n>9?"9+":n:"";b.classList.toggle("on",n>0)}
var esc=t=>String(t).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[c]);
function fd(ts){var d=new Date(ts),p=n=>String(n).padStart(2,"0");return p(d.getDate())+"/"+p(d.getMonth()+1)+" "+p(d.getHours())+":"+p(d.getMinutes())}
function pushOk(){return "serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window}
function pdraw(){pn.innerHTML='<div class="nh"><b>Notificações</b><button class="nx" aria-label="Fechar">✕</button></div>'+
 (LOG.length?LOG.slice(0,NV).map(x=>'<div class="ni'+(x.h?" nu":"")+'"><b>'+esc(x.t)+"</b><span>"+esc(x.b).split("\n").map(l=>l.replace(/^((?:Dom|Seg|Ter|Qua|Qui|Sex|Sáb) \d\d\/\d\d(?: \d\d:\d\d)?|\d\d:\d\d(?:-\d\d:\d\d)?|horário a definir)/,"<b>$1</b>")).join("<br>")+"</span><em>"+fd(x.ts)+"</em></div>").join("")+(LOG.length>NV?'<button class="np nm">Ver mais antigas</button>':""):'<p class="ne">Nenhuma notificação ainda.</p>')+
 '<div class="nf">'+(window.HUBCFG?'<p class="ne">Notificações no celular: use o DROM Hub do GitHub (dromentretenimento.com/sistema).</p>':pushOk()?(Notification.permission==="granted"&&ls.g("subok")?'<p class="ne">✓ Notificações de todos os artistas ativadas neste aparelho.</p><button class="np">Ativar de novo</button>':'<button class="np">Ativar notificações no celular (todos os artistas)</button>'):'<p class="ne">Para receber notificações no celular, adicione o Hub à tela de início (Safari: Compartilhar → Adicionar à Tela de Início) e abra por lá.</p>')+"</div>";
 pn.querySelector(".nx").onclick=pcls;var nm=pn.querySelector(".nm");if(nm)nm.onclick=()=>{NV=LOG.length;pdraw()};var np=pn.querySelector(".np:not(.nm)");if(np)np.onclick=sub}
function pcls(){pn.hidden=true;LOG.forEach(x=>delete x.h);ls.s("log",LOG);draw()}
$("bell").onclick=()=>{if(!LOG)return;if(pn.hidden){NV=10;LOG.forEach(x=>{x.h=!x.r;x.r=1});ls.s("log",LOG);pdraw();pn.hidden=false;badge()}else pcls()};
function u8(b){var p="=".repeat((4-b.length%4)%4),r=atob((b+p).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(r,c=>c.charCodeAt(0))}
async function sub(){var nf=pn.querySelector(".nf");try{
 if(await Notification.requestPermission()!=="granted"){nf.insertAdjacentHTML("beforeend",'<p class="ne">Permissão negada. Libere as notificações nas configurações do navegador.</p>');return}
 var reg=await navigator.serviceWorker.ready,s=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(VAPID)});
 var iv=crypto.getRandomValues(new Uint8Array(12)),ct=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:iv},AK,new TextEncoder().encode(JSON.stringify(s))));
 await fetch(SURL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify({app:"hub",iv:b6(iv),ct:b6(ct)})});
 ls.s("subok",s.endpoint);setTimeout(()=>reg.showNotification("Notificações ativadas!",{body:"Você vai receber aqui os avisos de todos os artistas.",icon:"icon-192.png",badge:"badge.png"}),1500);
 nf.innerHTML='<p class="ne">✓ Notificações ativadas neste aparelho. Os avisos começam a chegar em até 1 hora.</p>'}
 catch(e){nf.insertAdjacentHTML("beforeend",'<p class="ne">Não foi possível ativar: '+(e.message||e)+"</p>")}}

/* ---------- menu inferior: Início, Agenda, Calendário (Painel e Booker ainda não habilitados) ---------- */
var TAB="h",HV="m",HM=null,HY=null,HF="P",HSD=null,MNS=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],WD=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
function ALL(){var r=[];CFG.apps.forEach(a=>{var d=DATA[a.f];if(d)d.S.forEach(s=>r.push([s,a]))});return r}
function ini(s){return dromStart(s,B)||new Date(B,s[19]-1,s[0],23,59).getTime()}
function fim(s){var t=dromStart(s,B);return t?t+(+s[5]||0)*6e4:new Date(B,s[19]-1,s[0]+1,6,0).getTime()}
var p2=n=>String(n).padStart(2,"0"),hmF=s=>{var i=s[4];if(!i||i==="a definir")return"horário a definir";if(!s[5])return i;var t=+i.slice(0,2)*60+ +i.slice(3)+s[5];return i+" – "+p2(Math.floor(t/60)%24)+":"+p2(t%60)};
function fal(ms){var m=Math.max(1,Math.ceil(ms/6e4)),h=Math.floor(m/60);m=m%60;return((h||m)===1?"Falta ":"Faltam ")+(h?h+"h"+(m?" "+m+"min":""):m+"min")}
function hcard(x){var s=x[0],a=x[1],c='<div class="cd hcd"><div class="hd"><div class="dt"><small>'+WD[new Date(B,s[19]-1,s[0]).getDay()]+"</small><b>"+s[0]+'</b></div><div class="in"><b>'+esc(s[1]||s[2]||"")+"</b><span>"+esc([s[1]?s[2]:"",s[3]].filter(Boolean).join(" · "))+"</span><span>"+hmF(s)+"</span></div></div></div>",t=dromStart(s,B),n=Date.now();
 if(t){var e=fim(s);if(n>=t&&n<e)c='<div class="ag now hag"><div class="agl" data-en="'+e+'">Agora</div>'+c+"</div>";else if(t>n&&t-n<=864e5)c='<div class="ag soon hag"><div class="agl" data-st="'+t+'">'+fal(t-n)+"</div>"+c+"</div>"}
 return'<div class="hrw"><img class="hav" alt="'+nm(a)+'" title="'+nm(a)+'" src="'+a.img+'">'+c+"</div>"}
setInterval(function(){if(TAB==="h")return;var n=Date.now(),rd=0;document.querySelectorAll(".hag.soon .agl[data-st]").forEach(x=>{var a=+x.dataset.st;if(a<=n)rd=1;else x.textContent=fal(a-n)});document.querySelectorAll(".hag.now .agl[data-en]").forEach(x=>{if(+x.dataset.en<=n)rd=1});if(rd)hview()},30000);
var curM=()=>{var n=new Date(Date.now()-216e5);return(n.getFullYear()-B)*12+n.getMonth()+1},mLab=m=>MNS[(m-1)%12]+" "+(B+Math.floor((m-1)/12)),YF=m=>B+Math.floor((m-1)/12);
var HMQ=window.matchMedia("(max-width:600px)");
function hsel(){var A=ALL(),L=[];CFG.apps.forEach(a=>{var d=DATA[a.f];if(!d)return;if(d.R)L.push(d.R[0],d.R[1]);else{d.S.forEach(s=>L.push(s[19]));(d.OT||[]).forEach(o=>L.push(o[0]));(d.BK||[]).forEach(z=>L.push(z[0]))}});var lo=Math.min(...L),hi=Math.max(...L),o="";
 if(HV==="m"){for(var m=lo;m<=hi;m++){var c=A.filter(x=>x[0][19]===m).length,n=MNS[(m-1)%12]+" "+YF(m);o+='<option value="'+m+'">'+(HMQ.matches?n.replace(/^(\S{3})\S*/,"$1"):n)+(c?" ("+c+")":"")+"</option>"}$("hms").innerHTML=o;$("hms").value=HM}
 else{for(var y=YF(lo);y<=YF(hi);y++)o+='<option value="'+y+'">'+y+"</option>";$("hms").innerHTML=o+'<option value="0">Todos</option>';$("hms").value=HY}
 document.querySelectorAll("#hbar .seg button").forEach(b=>b.classList.toggle("on",b.dataset.v===HV));document.querySelectorAll("#hpl button").forEach(b=>b.classList.toggle("on",b.dataset.f===HF))}
HMQ.addEventListener&&HMQ.addEventListener("change",()=>{if(TAB!=="h")hsel()});
function tab(t){if(t==="p"||t==="b")return;TAB=t;document.querySelectorAll("#hnav button").forEach(b=>b.classList.toggle("on",b.dataset.t===t));$("list").hidden=t!=="h";$("hv").hidden=t==="h";$("hbar").hidden=t==="h";$("hpl").hidden=t!=="a";
 if(HM===null){HM=curM();HY=YF(HM)}if(t!=="h"){hsel();hview()}window.scrollTo(0,0)}
function grid(m,X,td){var y=YF(m),mo=(m-1)%12,F1=new Date(y,mo,1).getDay(),N=new Date(y,mo+1,0).getDate(),h="<h3>"+mLab(m)+'</h3><div class="cal hcal">'+["D","S","T","Q","Q","S","S"].map(x=>"<b>"+x+"</b>").join("")+"<span></span>".repeat(F1);
 for(var d=1;d<=N;d++){var c=X.filter(x=>x[0][19]===m&&x[0][0]===d).length;h+='<button type="button" data-m="'+m+'" data-d="'+d+'" class="'+(c?"hsd ":"")+(HSD&&HSD[0]===m&&HSD[1]===d?"on ":"")+(m===td[0]&&d===td[1]?"td":"")+'">'+d+(c?"<small>"+c+(c===1?" show":" shows")+"</small>":"")+"</button>"}
 h+="</div>";if(HSD&&HSD[0]===m){var sd=X.filter(x=>x[0][19]===m&&x[0][0]===HSD[1]);h+="<h3>"+WD[new Date(y,mo,HSD[1]).getDay()]+" "+p2(HSD[1])+"/"+p2(mo+1)+"</h3>"+(sd.length?sd.map(hcard).join(""):'<p class="mu">Sem shows neste dia.</p>')}return h}
function hview(){var A=ALL(),X=(HV==="m"?A.filter(x=>x[0][19]===HM):A.filter(x=>HY===0||YF(x[0][19])===HY)).sort((p,q)=>ini(p[0])-ini(q[0])),h="",n=Date.now();
 if(TAB==="a"){var l=X.filter(x=>HF==="T"||(HF==="R")===(fim(x[0])<=n)),cm=0;
  l.forEach(x=>{if(x[0][19]!==cm){cm=x[0][19];var q=l.filter(z=>z[0][19]===cm).length;h+="<h3>"+mLab(cm)+" · "+q+(q===1?" show":" shows")+"</h3>"}h+=hcard(x)});if(!l.length)h='<p class="mu">Sem shows confirmados nesse período.</p>'}
 else{var nn=new Date(Date.now()-216e5),td=[(nn.getFullYear()-B)*12+nn.getMonth()+1,nn.getDate()];if(!HSD&&HV==="m"&&HM===td[0])HSD=td.slice();
  h=HV==="m"?grid(HM,X,td):HY===0?'<p class="mu">Escolha um ano específico para ver o calendário.</p>':[...Array(12).keys()].map(i=>grid((HY-B)*12+i+1,X,td)).join("")}
 $("hvb").innerHTML=h;if(TAB==="c")$("hvb").querySelectorAll(".hcal button").forEach(b=>b.onclick=()=>{HSD=[+b.dataset.m,+b.dataset.d];hview()})}
document.querySelectorAll("#hnav button").forEach(b=>b.onclick=()=>tab(b.dataset.t));
document.querySelectorAll("#hbar .seg button").forEach(b=>b.onclick=()=>{HV=b.dataset.v;if(HV==="y")HY=YF(HM);HSD=null;hsel();hview()});
document.querySelectorAll("#hpl button").forEach(b=>b.onclick=()=>{HF=b.dataset.f;hsel();hview()});
$("hms").onchange=()=>{if(HV==="m")HM=+$("hms").value;else HY=+$("hms").value;HSD=null;hview()};
function step(d){var o=[...$("hms").options].map(x=>+x.value),v=+$("hms").value,nv=v+d;if(o.indexOf(nv)<0)return;if(HV==="m")HM=nv;else HY=nv;HSD=null;$("hms").value=nv;hview()}
$("hpv").onclick=()=>step(-1);$("hnx").onclick=()=>step(1);$("hcu").onclick=()=>{HM=curM();HY=YF(HM);HSD=null;hsel();hview()};
if(!window.HUBCFG&&"serviceWorker" in navigator)navigator.serviceWorker.register("sw.js",{scope:"./"}).catch(()=>{});
start();
})();

/*KB*/(function(){var v=window.visualViewport;function fit(){var l=document.getElementById("lk");if(!l||!v)return;l.style.position="fixed";l.style.top=v.offsetTop+"px";l.style.height=v.height+"px";l.style.bottom="auto";l.style.inset="auto 0 auto 0";l.style.top=v.offsetTop+"px"}if(v){v.addEventListener("resize",fit);v.addEventListener("scroll",fit);fit()}document.addEventListener("focusin",function(e){if(e.target&&e.target.closest&&e.target.closest("#lk"))setTimeout(function(){fit();window.scrollTo(0,0)},60)})})();

/*SWU*/(function(){if(!("serviceWorker" in navigator))return;var had=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener("controllerchange",function(){if(had&&!sessionStorage.getItem("swr")){sessionStorage.setItem("swr","1");location.reload()}});navigator.serviceWorker.getRegistration().then(function(r){if(r)r.update()}).catch(function(){});document.addEventListener("visibilitychange",function(){if(!document.hidden)navigator.serviceWorker.getRegistration().then(function(r){if(r)r.update()}).catch(function(){})})})();
