/* DROM · PIN semanal + dados criptografados (AES-GCM, chave PBKDF2 do PIN) */
(function(){
function FW(t){var d=new Date(t);for(var i=0;i<3;i++){var w=new Date(d.getFullYear(),d.getMonth()+i,1);w.setDate(1+(3-w.getDay()+7)%7);if(w.getTime()>t)return w.getTime()}return t}/* PIN vale até a 1ª quarta-feira do mês seguinte */
var WEEK=7*864e5,lk=document.getElementById("lk"),inp=document.getElementById("pin"),msg=document.getElementById("lkm"),D=null;
var b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
function db(){return new Promise((ok,er)=>{var r=indexedDB.open("drom",1);r.onupgradeneeded=()=>r.result.createObjectStore("k");r.onsuccess=()=>ok(r.result);r.onerror=()=>er(r.error)})}
async function kget(){try{var d=await db();return await new Promise(ok=>{var q=d.transaction("k").objectStore("k").get("josu185");q.onsuccess=()=>ok(q.result||null);q.onerror=()=>ok(null)})}catch(e){return null}}
async function kput(v){try{var d=await db();d.transaction("k","readwrite").objectStore("k").put(v,"josu185")}catch(e){}}
async function kdel(){try{var d=await db();d.transaction("k","readwrite").objectStore("k").delete("josu185")}catch(e){}}
async function derive(pin,salt){var k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pin),"PBKDF2",false,["deriveKey"]);
 return crypto.subtle.deriveKey({name:"PBKDF2",salt:b64(salt),iterations:200000,hash:"SHA-256"},k,{name:"AES-GCM",length:256},false,["decrypt","encrypt"])}
async function dec(key){var t=await crypto.subtle.decrypt({name:"AES-GCM",iv:b64(D.iv)},key,b64(D.ct));return JSON.parse(new TextDecoder().decode(t))}
async function load(){var r=await fetch("d.json",{cache:"no-store"});if(!r.ok)throw new Error("d.json");D=await r.json()}
function go(data){window.DROMDATA=data;window.DROMUPD=D.up||"";lk.remove();document.body.classList.remove("locked");
 ["s2.js","s3.js","s4.js","diff.js","n.js","p.js"].reduce((p,f)=>p.then(()=>new Promise(ok=>{var s=document.createElement("script");s.src=f;s.onload=s.onerror=ok;document.body.appendChild(s)})),Promise.resolve())}
async function start(){
 try{await load()}catch(e){msg.textContent="Sem conexão. Tente de novo.";return}
 var st=await kget();
 if(st&&st.v===2&&st.salt===D.salt&&Date.now()<FW(st.ts)){try{var dd=await dec(st.key);window.DROMKEY=st.key;go(dd);return}catch(e){}}
 if(st)await kdel();
 lk.hidden=false;inp.focus();
}
document.getElementById("lkf").onsubmit=async function(e){e.preventDefault();var pin=inp.value.trim();if(!pin)return;msg.textContent="Verificando…";
 try{var key=await derive(pin,D.salt),data=await dec(key);await kput({key:key,salt:D.salt,ts:Date.now(),v:2});window.DROMKEY=key;go(data)}
 catch(er){msg.textContent="PIN incorreto.";inp.value="";inp.focus()}};
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
start();
})();

/*KB*/(function(){var v=window.visualViewport;function fit(){var l=document.getElementById("lk");if(!l||!v)return;l.style.position="fixed";l.style.top=v.offsetTop+"px";l.style.height=v.height+"px";l.style.bottom="auto";l.style.inset="auto 0 auto 0";l.style.top=v.offsetTop+"px"}if(v){v.addEventListener("resize",fit);v.addEventListener("scroll",fit);fit()}document.addEventListener("focusin",function(e){if(e.target&&e.target.closest&&e.target.closest("#lk"))setTimeout(function(){fit();window.scrollTo(0,0)},60)})})();

/*SWU*/(function(){if(!("serviceWorker" in navigator))return;var had=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener("controllerchange",function(){if(had&&!sessionStorage.getItem("swr")){sessionStorage.setItem("swr","1");location.reload()}});navigator.serviceWorker.getRegistration().then(function(r){if(r)r.update()}).catch(function(){});document.addEventListener("visibilitychange",function(){if(!document.hidden)navigator.serviceWorker.getRegistration().then(function(r){if(r)r.update()}).catch(function(){})})})();

/*LOAD*/(function(){function a(){document.body.classList.add("ld")}if(document.body)requestAnimationFrame(a);else document.addEventListener("DOMContentLoaded",a)})();
