function FW(t){var d=new Date(t);for(var i=0;i<3;i++){var w=new Date(d.getFullYear(),d.getMonth()+i,1);w.setDate(1+(3-w.getDay()+7)%7);if(w.getTime()>t)return w.getTime()}return t}/* login vale até a 1ª quarta-feira do mês seguinte */
/* DROM Booker (GitHub) · mesmo login do Hub; dados e modelos criptografados (chave dentro do h.json do Hub) */
(function(){
(function(){var d=document.createElement("div");d.className="dbrand";d.innerHTML='<a href="https://instagram.com/dromentretenimento" target="_blank" rel="noopener" aria-label="Instagram @dromentretenimento"><img alt="DROM" src="ima2c04135ba.png"></a>';document.body.appendChild(d);requestAnimationFrame(function(){document.body.classList.add("ld")})})();/* rodapé primeiro, depois cabeçalho, depois dados */
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
 var r=await Promise.all([fetch("bk.json",{cache:"no-store"}).then(x=>x.json()),fetch("a1.json").then(x=>x.json())]);
 var D=await dec(K,r[0].iv,r[0].ct),A=await dec(K,r[1].iv,r[1].ct);window.DROMUPD=r[0].up||"";
 msg("");
 await js("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");await js("https://cdn.jsdelivr.net/npm/jspdf@3.0.1/dist/jspdf.umd.min.js");
 for(var f of ["data.js","b0.js","b1.js","b2.js","b3.js","b4.js","b5.js","b6.js","b7.js","b8.js","b9.js"])if(D[f]!==undefined)await js(null,D[f]);
 if(!window.claude)window.claude={use:async function(){return null}};/* busca com Claude só existe no artefato */
 await js("s2.js");await js(null,A["a1.js"]);await js("s3.js");var s4=document.createElement("script");s4.id="drom-home";s4.src="s4.js";document.body.appendChild(s4);await js("ui2.js");document.body.classList.remove("locked");sair()}
function sair(){var b=document.createElement("button");b.type="button";b.className="bklo";b.title="Sair";b.setAttribute("aria-label","Sair");
 b.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>';
 b.onclick=function(){var m=document.createElement("div");m.className="bklom";m.innerHTML='<div><b>Sair do Booker?</b><p>Sai do Booker e do Hub neste aparelho. Para entrar de novo será preciso digitar login e senha.</p><div class="bklob"><button type="button" class="c">Cancelar</button><button type="button" class="y">Sair</button></div></div>';
  document.body.appendChild(m);m.querySelector(".c").onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()};
  m.querySelector(".y").onclick=async()=>{await kdel("hub");try{if(window.top!==window){window.top.location.reload();return}}catch(e){}location.reload()}};
 var hd=document.querySelector(".hd");(hd||document.body).appendChild(b)}
async function start(){
 try{H=await (await fetch("../h.json",{cache:"no-store"})).json()}catch(e){msg("Sem conexão. Tente de novo.");return}
 var st=await kget("hub");
 if(st&&st.salt===H.salt&&Date.now()<FW(st.ts)){try{var c=await dec(st.key,H.iv,H.ct);if(c.bk){await go(c);return}}catch(e){}}
 if(st)await kdel("hub");$("lk").hidden=false;$("usr").focus()}
$("lkf").onsubmit=async e=>{e.preventDefault();var us=$("usr").value.trim().toLowerCase(),pw=$("pin").value;if(!us||!pw)return;$("lkm").textContent="Verificando…";
 try{var key=await derive(us+"\n"+pw,H.salt),c=await dec(key,H.iv,H.ct);await kput("hub",{key:key,salt:H.salt,ts:Date.now()});$("pin").value="";$("usr").value="";$("lkm").textContent="";await go(c)}
 catch(er){$("lkm").textContent="Login ou senha incorretos.";$("pin").value="";$("pin").focus()}};
start();
})();
