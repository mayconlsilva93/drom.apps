/* DROM · notificações no app (sino) + ativação das notificações no celular */
(function(){
var VAPID="BGH4ccixrVQN6Qmct71zljsKsyClz5k-Fk0dfzXhfWtIA7b_AAIwZjuWmCO-u8LVX0HswJ80GifqLCno7Wf04-k";
var B=2023,S=window.DROMDATA.S||[],ls={g:k=>{try{return JSON.parse(localStorage.getItem("mg_"+k))}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem("mg_"+k,JSON.stringify(v))}catch(e){}}};
var log=ls.g("log")||[],prev=ls.g("snap"),now=Date.now();
if(prev)dromDiff(prev,S,B).forEach(x=>log.unshift({t:x.t,b:x.b,ts:now,r:0}));
ls.s("snap",S);
/* lembrete: show começando nas próximas 24 h (uma vez por show) */
var rm=ls.g("rem")||{};S.forEach(s=>{var t=dromStart(s,B);if(t&&t>now&&t-now<864e5&&!rm[s[14]]){rm[s[14]]=1;var d=new Date(t);
 log.unshift({t:"Lembrete de show",b:(s[1]||s[2])+" — "+String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+" às "+s[4]+", "+s[2],ts:now,r:0})}});
ls.s("rem",rm);log=log.slice(0,60);ls.s("log",log);
var top=document.querySelector(".top"),bell=document.createElement("button");bell.className="bell";bell.title="Notificações";
bell.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><i></i>';
top.insertBefore(bell,document.getElementById("eye"));
var lo=document.createElement("button");lo.className="bell lo";lo.title="Sair";lo.setAttribute("aria-label","Sair");
lo.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>';
top.insertBefore(lo,bell);
lo.onclick=()=>{var m=document.createElement("div");m.className="lom";m.innerHTML='<div><b>Sair do app?</b><p>Para entrar de novo será preciso digitar o PIN.</p><div class="lob"><button class="loc">Cancelar</button><button class="loy">Sair</button></div></div>';
 document.body.appendChild(m);m.querySelector(".loc").onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()};
 m.querySelector(".loy").onclick=()=>{try{var r=indexedDB.open("drom",1);r.onsuccess=()=>{try{var tx=r.result.transaction("k","readwrite");tx.objectStore("k").delete("maneira");tx.oncomplete=()=>location.reload();tx.onerror=()=>location.reload()}catch(e){location.reload()}};r.onerror=()=>location.reload()}catch(e){location.reload()}}};
var pn=document.createElement("div");pn.className="npn";pn.hidden=true;document.body.appendChild(pn);
function badge(){var n=log.filter(x=>!x.r).length;bell.querySelector("i").textContent=n?n>9?"9+":n:"";bell.classList.toggle("on",n>0)}
var esc=t=>String(t).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[c]);
function fd(ts){var d=new Date(ts);return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+" "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")}
function pushOk(){return "serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window}
function draw(){pn.innerHTML='<div class="nh"><b>Notificações</b><button class="nx" aria-label="Fechar">✕</button></div>'+
 (log.length?log.slice(0,NV).map(x=>'<div class="ni'+(x.r&&!x.h?"":" nu")+'"><b>'+esc(x.t)+"</b><span>"+esc(x.b)+"</span><em>"+fd(x.ts)+"</em></div>").join("")+(log.length>NV?'<button class="np nm">Ver mais antigas</button>':""):'<p class="ne">Nenhuma notificação ainda.</p>')+
 '<div class="nf">'+(pushOk()?(Notification.permission==="granted"?'<button class="np">Código das notificações no celular</button>':'<button class="np">Ativar notificações no celular</button>'):'<p class="ne">Para receber notificações no celular, adicione este app à tela de início (Safari: Compartilhar → Adicionar à Tela de Início) e abra por lá.</p>')+
 (window.DROMUPD?'<p class="ne">Dados atualizados em '+window.DROMUPD+"</p>":"")+"</div>";
 pn.querySelector(".nx").onclick=cls;var nm=pn.querySelector(".nm");if(nm)nm.onclick=()=>{NV=log.length;draw()};var np=pn.querySelector(".np:not(.nm)");if(np)np.onclick=sub}
function u8(b){var p="=".repeat((4-b.length%4)%4),r=atob((b+p).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(r,c=>c.charCodeAt(0))}
async function sub(){var nf=pn.querySelector(".nf");try{
 if(await Notification.requestPermission()!=="granted"){nf.insertAdjacentHTML("beforeend",'<p class="ne">Permissão negada. Libere as notificações nas configurações do navegador.</p>');return}
 var reg=await navigator.serviceWorker.ready,s=await reg.pushManager.getSubscription()||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:u8(VAPID)});
 var code="DROM-MANEIRA:"+btoa(JSON.stringify(s));
 nf.innerHTML='<p class="ne">Último passo: envie este código para a DROM (uma vez por aparelho).</p><textarea readonly class="nc">'+code+'</textarea><button class="np" id="nsh">'+(navigator.share?"Enviar código":"Copiar código")+"</button>";
 document.getElementById("nsh").onclick=async()=>{try{if(navigator.share)await navigator.share({text:code});else{await navigator.clipboard.writeText(code);document.getElementById("nsh").textContent="Copiado ✓"}}catch(e){}};
 }catch(e){nf.insertAdjacentHTML("beforeend",'<p class="ne">Não foi possível ativar: '+(e.message||e)+"</p>")}}
var NV=10;function cls(){pn.hidden=true;log.forEach(x=>delete x.h);ls.s("log",log)}bell.onclick=()=>{if(pn.hidden){NV=10;log.forEach(x=>{x.h=!x.r;x.r=1});ls.s("log",log);draw();pn.hidden=false;badge()}else cls()};
var nv=document.querySelector("nav");if(nv)nv.addEventListener("click",()=>{if(!pn.hidden)cls()});
badge();
if(log.some(x=>!x.r&&x.ts===now)){var t=document.createElement("div");t.className="ntoast";var q=log.filter(x=>!x.r&&x.ts===now).length;t.textContent=(q===1?"1 novidade":q+" novidades")+" — toque no sino";document.body.appendChild(t);setTimeout(()=>t.remove(),5000)}
})();
