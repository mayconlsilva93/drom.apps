/* DROM Painel (GitHub) · mesmo login do Hub; dados criptografados com a chave do Booker (dentro do h.json do Hub) */
(function(){
try{history.scrollRestoration="manual"}catch(e){}scrollTo(0,0);/* recarregar abre no topo, sem encolher */
requestAnimationFrame(function(){document.body.classList.add("ld")});/* rodapé e cabeçalho primeiro, dados depois */
var WEEK=7*864e5,$=id=>document.getElementById(id),H=null;
var b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
function db(){return new Promise((ok,er)=>{var r=indexedDB.open("drom",1);r.onupgradeneeded=()=>r.result.createObjectStore("k");r.onsuccess=()=>ok(r.result);r.onerror=()=>er(r.error)})}
async function kget(n){try{var d=await db();return await new Promise(ok=>{var q=d.transaction("k").objectStore("k").get(n);q.onsuccess=()=>ok(q.result||null);q.onerror=()=>ok(null)})}catch(e){return null}}
async function kput(n,v){try{var d=await db();await new Promise(ok=>{var t=d.transaction("k","readwrite");t.objectStore("k").put(v,n);t.oncomplete=ok;t.onerror=ok})}catch(e){}}
async function kdel(n){try{var d=await db();await new Promise(ok=>{var t=d.transaction("k","readwrite");t.objectStore("k").delete(n);t.oncomplete=ok;t.onerror=ok})}catch(e){}}
async function derive(pin,salt){var k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pin),"PBKDF2",false,["deriveKey"]);
 return crypto.subtle.deriveKey({name:"PBKDF2",salt:b64(salt),iterations:200000,hash:"SHA-256"},k,{name:"AES-GCM",length:256},false,["decrypt"])}
async function dec(key,iv,ct){var t=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64(iv)},key,b64(ct));return JSON.parse(new TextDecoder().decode(t))}
function msg(t){var l=$("bkl");if(!l){l=document.createElement("div");l.id="bkl";document.body.appendChild(l)}l.textContent=t;l.hidden=!t}
function js(src,text){return new Promise(ok=>{var s=document.createElement("script");if(text!==undefined){s.src=URL.createObjectURL(new Blob([text],{type:"text/javascript"}))}else s.src=src;s.onload=s.onerror=ok;document.body.appendChild(s)})}
async function go(cfg){$("lk").remove();msg("Carregando…");
 var K=await crypto.subtle.importKey("raw",b64(cfg.bk),"AES-GCM",false,["decrypt"]);
 var r=await (await fetch("pd.json",{cache:"no-store"})).json(),D=await dec(K,r.iv,r.ct);window.DROMUPD=r.up||"";msg("");
 await js(null,D["data.js"]);for(var f of ["s3.js","s4.js","s5.js","s6.js","s7.js"])await js(f);var s8=document.createElement("script");s8.id="drom-home";s8.src="s8.js";document.body.appendChild(s8);
 document.body.classList.remove("locked");scrollTo(0,0);sair();setTimeout(sair,400);setTimeout(sair,1500)}
function sair(){var e=document.getElementById("eye");if(!e||document.getElementById("lo"))return;var b=e.cloneNode(false);b.id="lo";b.removeAttribute("aria-pressed");b.title="Sair";b.setAttribute("aria-label","Sair");
 b.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>';
 b.onclick=function(){var m=document.createElement("div");m.className="pnlom";m.innerHTML='<div><b>Sair do Painel?</b><p>Sai do Painel e do Hub neste aparelho. Para entrar de novo será preciso digitar login e senha.</p><div class="pnlob"><button type="button" class="c">Cancelar</button><button type="button" class="y">Sair</button></div></div>';
  document.body.appendChild(m);m.querySelector(".c").onclick=()=>m.remove();m.onclick=ev=>{if(ev.target===m)m.remove()};
  m.querySelector(".y").onclick=async()=>{await kdel("hub");try{if(window.top!==window){window.top.location.reload();return}}catch(x){}location.reload()}};
 var hd=document.querySelector(".hd2"),L=hd&&hd.querySelector(".hdl");if(hd&&!L){L=document.createElement("span");L.className="hdl";hd.insertBefore(L,hd.firstChild)}
 if(L){L.appendChild(b);var r=document.createElement("button");r.id="rf";r.type="button";r.className=e.className.replace(/\beyt\b/,"");r.title="Atualizar";r.setAttribute("aria-label","Atualizar");r.onclick=function(){location.reload()};
  r.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-14.2 5M4 12a8 8 0 0 1 14.2-5"/><path d="M18.5 3v4.2h-4.2M5.5 21v-4.2h4.2"/></svg>';L.appendChild(r);
  e.classList.remove("eyt");hd.appendChild(e)}else e.parentNode.insertBefore(b,e);
 }
async function start(){
 try{H=await (await fetch("../h.json",{cache:"no-store"})).json()}catch(e){msg("Sem conexão. Tente de novo.");return}
 var st=await kget("hub");
 if(st&&st.salt===H.salt&&Date.now()-st.ts<WEEK){try{var c=await dec(st.key,H.iv,H.ct);if(c.bk){await go(c);return}}catch(e){}}
 if(st)await kdel("hub");$("lk").hidden=false;$("usr").focus()}
$("lkf").onsubmit=async e=>{e.preventDefault();var us=$("usr").value.trim().toLowerCase(),pw=$("pin").value;if(!us||!pw)return;$("lkm").textContent="Verificando…";
 try{var key=await derive(us+"\n"+pw,H.salt),c=await dec(key,H.iv,H.ct);await kput("hub",{key:key,salt:H.salt,ts:Date.now()});$("pin").value="";$("usr").value="";$("lkm").textContent="";await go(c)}
 catch(er){$("lkm").textContent="Login ou senha incorretos.";$("pin").value="";$("pin").focus()}};
start();
})();
