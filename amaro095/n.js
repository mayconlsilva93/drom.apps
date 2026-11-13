/* DROM · notificações no app (sino) + ativação das notificações no celular */
(function(){
var VAPID="BGH4ccixrVQN6Qmct71zljsKsyClz5k-Fk0dfzXhfWtIA7b_AAIwZjuWmCO-u8LVX0HswJ80GifqLCno7Wf04-k";
var B=2023,S=window.DROMDATA.S||[],ls={g:k=>{try{return JSON.parse(localStorage.getItem("amaro095_"+k))}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem("amaro095_"+k,JSON.stringify(v))}catch(e){}}};
var log=ls.g("log")||[],prev=ls.g("snap"),now=Date.now();
if(prev)dromDiff(prev,S,B).forEach(x=>log.unshift({t:x.t,b:x.b,ts:now,r:0}));
ls.s("snap",S);
/* lembrete: show começando nas próximas 24 h (uma vez por show) */
var rm=ls.g("rem")||{};S.forEach(s=>{var t=dromStart(s,B);if(t&&t>now&&t-now<864e5&&!rm[s[14]]){rm[s[14]]=1;log.unshift({t:"Em breve",b:dromLn(s,B),ts:now,r:0})}});
ls.s("rem",rm);log=log.slice(0,50);ls.s("log",log);
var top=document.querySelector(".top"),bell=document.createElement("button");bell.className="bell";bell.title="Notificações";
bell.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><i></i>';
top.insertBefore(bell,document.getElementById("eye"));
var lo=document.createElement("button");lo.className="bell lo";lo.title="Sair";lo.setAttribute("aria-label","Sair");
lo.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>';
top.insertBefore(lo,bell);
lo.onclick=()=>{var m=document.createElement("div");m.className="lom";m.innerHTML='<div><b>Sair do app?</b><p>Para entrar de novo será preciso digitar o PIN.</p><div class="lob"><button class="loc">Cancelar</button><button class="loy">Sair</button></div></div>';
 document.body.appendChild(m);m.querySelector(".loc").onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()};
 m.querySelector(".loy").onclick=()=>{try{var r=indexedDB.open("drom",1);r.onsuccess=()=>{try{var tx=r.result.transaction("k","readwrite");tx.objectStore("k").delete("amaro095");tx.oncomplete=()=>location.reload();tx.onerror=()=>location.reload()}catch(e){location.reload()}};r.onerror=()=>location.reload()}catch(e){location.reload()}}};
var pn=document.createElement("div");pn.className="npn";pn.hidden=true;document.body.appendChild(pn);
function badge(){var n=log.filter(x=>!x.r).length;bell.querySelector("i").textContent=n?n>9?"9+":n:"";bell.classList.toggle("on",n>0)}
var esc=t=>String(t).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[c]);
function fd(ts){var d=new Date(ts);return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+" "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")}
function pushOk(){return "serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window}
function draw(){pn.innerHTML='<div class="nh"><b>Notificações</b><button class="nx" aria-label="Fechar">✕</button></div>'+
 (log.length?log.slice(0,NV).map(x=>'<div class="ni'+(x.r&&!x.h?"":" nu")+'"><b>'+esc(x.t)+"</b><span>"+esc(x.b).split("\n").map(l=>l.replace(/^((?:Dom|Seg|Ter|Qua|Qui|Sex|Sáb) \d\d\/\d\d(?: \d\d:\d\d)?|\d\d:\d\d(?:-\d\d:\d\d)?|horário a definir)/,"<b>$1</b>")).join("<br>")+"</span><em>"+fd(x.ts)+"</em></div>").join("")+(log.length>NV?'<button class="np nm">Ver mais antigas</button>':""):'<p class="ne">Nenhuma notificação ainda.</p>')+
 '<div class="nf">'+(pushOk()?(Notification.permission==="granted"&&ls.g("subok")?'<p class="ne">✓ Notificações ativadas neste aparelho.</p><button class="np">Ativar de novo</button>':'<button class="np">Ativar notificações</button>'):'<p class="ne">Para receber notificações no celular, adicione este app à tela de início (Safari: Compartilhar → Adicionar à Tela de Início) e abra por lá.</p>')+
 (window.DROMUPD?'<p class="ne">Dados atualizados em '+window.DROMUPD+"</p>":"")+"</div>";
 pn.querySelector(".nx").onclick=cls;var nm=pn.querySelector(".nm");if(nm)nm.onclick=()=>{NV=log.length;draw()};var np=pn.querySelector(".np:not(.nm)");if(np)np.onclick=sub}
function u8(b){var p="=".repeat((4-b.length%4)%4),r=atob((b+p).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(r,c=>c.charCodeAt(0))}
async function sub(){var nf=pn.querySelector(".nf");try{
 if(await Notification.requestPermission()!=="granted"){nf.insertAdjacentHTML("beforeend",'<p class="ne">Permissão negada. Libere as notificações nas configurações do navegador.</p>');return}
 var reg=await navigator.serviceWorker.ready,s=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(VAPID)});
 var K=window.DROMKEY;if(!K)throw new Error("saia do app e entre de novo com o PIN");
 var iv=crypto.getRandomValues(new Uint8Array(12)),ct=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:iv},K,new TextEncoder().encode(JSON.stringify(s)))),b6=u=>btoa(String.fromCharCode.apply(null,u));
 await fetch("https://script.google.com/macros/s/AKfycbzk5iksIZVvdK27taLTcpQbdPebxGjP7ilwNxiQDYwUuTSaMz80Hifmgr-5aazWhI0R/exec",{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify({app:location.pathname.split("/").filter(Boolean).pop(),iv:b6(iv),ct:b6(ct)})});
 ls.s("subok",s.endpoint);ls.s("subt",Date.now());try{var w0=new Date(),qa=new Date(w0.getFullYear(),w0.getMonth(),w0.getDate()+((3-w0.getDay()+7)%7||7),23,59).getTime(),nx=S.map(x=>[dromStart(x,B)||new Date(B,x[19]-1,x[0],23,59).getTime(),x]).filter(y=>y[0]>Date.now()&&y[0]<=qa+6*36e5).sort((p,q)=>p[0]-q[0]).map(y=>dromLn(y[1],B,{hora:1}));
 setTimeout(()=>reg.showNotification("Notificações ativadas!",{body:nx.length?"Próximos shows:\n"+nx.join("\n"):"Nenhum show até a próxima quarta.",icon:"icon-192.png",badge:"badge.png"}),1500)}catch(e){}nf.innerHTML='<p class="ne">✓ Notificações ativadas neste aparelho. Os avisos começam a chegar em até 1 hora.</p>';
 }catch(e){nf.insertAdjacentHTML("beforeend",'<p class="ne">Não foi possível ativar: '+(e.message||e)+"</p>")}}
var SURL="https://script.google.com/macros/s/AKfycbzk5iksIZVvdK27taLTcpQbdPebxGjP7ilwNxiQDYwUuTSaMz80Hifmgr-5aazWhI0R/exec";var NV=10;function cls(){pn.hidden=true;log.forEach(x=>delete x.h);ls.s("log",log)}bell.onclick=()=>{if(pn.hidden){NV=10;log.forEach(x=>{x.h=!x.r;x.r=1});ls.s("log",log);draw();pn.hidden=false;badge()}else cls()};
var nv=document.querySelector("nav");if(nv)nv.addEventListener("click",()=>{if(!pn.hidden)cls()});
badge();
if(log.some(x=>!x.r&&x.ts===now)){var t=document.createElement("div");t.className="ntoast";var q=log.filter(x=>!x.r&&x.ts===now).length;t.textContent=(q===1?"1 novidade":q+" novidades")+" — toque no sino";document.body.appendChild(t);setTimeout(()=>t.remove(),5000)}

/*KEEP*/ /* mantém a inscrição viva: ao abrir, se a permissão já foi dada, recria a inscrição se sumiu (ex.: após atualização do app) e reenvia ao servidor se mudou ou a cada 7 dias */
(async function(){try{if(!pushOk()||Notification.permission!=="granted"||!window.DROMKEY)return;
 var reg=await navigator.serviceWorker.ready,s=await reg.pushManager.getSubscription();if(!s)s=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(VAPID)});
 if(s.endpoint===ls.g("subok")&&Date.now()-(ls.g("subt")||0)<6048e5)return;
 var iv=crypto.getRandomValues(new Uint8Array(12)),ct=new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM",iv:iv},window.DROMKEY,new TextEncoder().encode(JSON.stringify(s)))),b6=u=>btoa(String.fromCharCode.apply(null,u));
 await fetch(SURL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify({app:location.pathname.split("/").filter(Boolean).pop(),iv:b6(iv),ct:b6(ct)})});
 ls.s("subok",s.endpoint);ls.s("subt",Date.now())}catch(e){}})();
})();
