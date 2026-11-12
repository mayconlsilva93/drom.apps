
/*MAPNAV*/(function(){
function vbOf(s){return s.getAttribute("viewBox").split(" ").map(Number)}
function setVB(s,v){s.setAttribute("viewBox",v.map(function(x){return +x.toFixed(2)}).join(" "));var k=v[2]/(+s.dataset.w0);[].forEach.call(s.querySelectorAll("circle[data-r]"),function(c){c.setAttribute("r",(+c.dataset.r*Math.min(1.6,Math.max(.35,k))).toFixed(2))})}
function up(s,e){var m=s.createSVGPoint();m.x=e.clientX;m.y=e.clientY;return m.matrixTransform(s.getScreenCTM().inverse())}
function zoom(s,f,cx,cy){var v=vbOf(s),w0=+s.dataset.w0,nw=Math.min(w0*4,Math.max(w0/60,v[2]*f)),k=nw/v[2];setVB(s,[cx-(cx-v[0])*k,cy-(cy-v[1])*k,nw,v[3]*k])}
var P_={},drag=null,pinch=null;
document.addEventListener("wheel",function(e){var s=e.target.closest&&e.target.closest(".mp");if(!s)return;e.preventDefault();var p=up(s,e);zoom(s,e.deltaY<0?.8:1.25,p.x,p.y)},{passive:false});
function fsT(w,on){w.classList.toggle("fs",on);document.documentElement.style.overflow=on?"hidden":"";var b=w.querySelector("[data-mf]");b.textContent=on?"✕":"⛶";b.title=on?"Sair da tela cheia":"Tela cheia"}
document.addEventListener("keydown",function(e){if(e.key==="Escape"){var w=document.querySelector(".mw.fs");if(w)fsT(w,false)}});
document.addEventListener("click",function(e){var f=e.target.closest&&e.target.closest("[data-mf]");if(!f)return;var w=f.closest(".mw");fsT(w,!w.classList.contains("fs"))});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-mz]");if(!b)return;var s=b.closest(".mw").querySelector(".mp"),z=+b.dataset.mz;if(!z){s.setAttribute("viewBox",s.dataset.vb0);setVB(s,vbOf(s));return}var v=vbOf(s);zoom(s,z>0?.7:1.4,v[0]+v[2]/2,v[1]+v[3]/2)});
document.addEventListener("dblclick",function(e){var s=e.target.closest&&e.target.closest(".mp");if(!s)return;var p=up(s,e);zoom(s,.6,p.x,p.y)});
document.addEventListener("pointerdown",function(e){var s=e.target.closest&&e.target.closest(".mp");if(!s)return;P_[e.pointerId]=[e.clientX,e.clientY];var ids=Object.keys(P_);if(ids.length===2){var a=P_[ids[0]],b=P_[ids[1]];pinch={s:s,d:Math.hypot(a[0]-b[0],a[1]-b[1])};drag=null}else{drag={s:s,x:e.clientX,y:e.clientY,mv:0};}});
document.addEventListener("pointermove",function(e){
 var tip=document.querySelector(".mtip:not([hidden])");
 if(P_[e.pointerId])P_[e.pointerId]=[e.clientX,e.clientY];
 if(pinch){var ids=Object.keys(P_);if(ids.length>=2){var a=P_[ids[0]],b=P_[ids[1]],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch.d&&d){var s=pinch.s,p=up(s,{clientX:(a[0]+b[0])/2,clientY:(a[1]+b[1])/2});zoom(s,pinch.d/d,p.x,p.y);pinch.d=d}}return}
 if(drag){var s=drag.s,dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.mv+=Math.abs(dx)+Math.abs(dy);if(drag.mv>3){s.classList.add("dg");var m=s.getScreenCTM(),v=vbOf(s);setVB(s,[v[0]-dx/m.a,v[1]-dy/m.d,v[2],v[3]]);drag.x=e.clientX;drag.y=e.clientY;if(tip)tip.hidden=true}return}
 var c=e.target.closest&&e.target.closest(".mp circle[data-t]");var w=e.target.closest&&e.target.closest(".mw");
 document.querySelectorAll(".mtip").forEach(function(t){if(!c||!w||t.parentNode!==w)t.hidden=true});
 if(c&&w){var t=w.querySelector(".mtip"),r=w.getBoundingClientRect();t.textContent=c.dataset.t;t.hidden=false;var x=e.clientX-r.left+12,y=e.clientY-r.top-34;t.style.left=Math.min(x,r.width-t.offsetWidth-4)+"px";t.style.top=Math.max(2,y)+"px"}});
function tap(s,e){var w=s.closest(".mw"),t=w.querySelector(".mtip"),best=null,bd=1e9;[].forEach.call(s.querySelectorAll("circle[data-t]"),function(c){var r=c.getBoundingClientRect(),d=Math.hypot(r.left+r.width/2-e.clientX,r.top+r.height/2-e.clientY)-r.width/2;if(d<bd){bd=d;best=c}});
 if(best&&bd<=18){var rr=w.getBoundingClientRect(),cb=best.getBoundingClientRect();t.textContent=best.dataset.t;t.hidden=false;var x=cb.left+cb.width/2-rr.left-t.offsetWidth/2,y=cb.top-rr.top-t.offsetHeight-8;t.style.left=Math.max(4,Math.min(x,rr.width-t.offsetWidth-4))+"px";t.style.top=Math.max(4,y<4?cb.bottom-rr.top+8:y)+"px"}else t.hidden=true}
function end(e){delete P_[e.pointerId];if(Object.keys(P_).length<2)pinch=null;if(drag&&!Object.keys(P_).length){drag.s.classList.remove("dg");if(drag.mv<=3&&e.type==="pointerup")tap(drag.s,e);drag=null}}
document.addEventListener("pointerup",end);document.addEventListener("pointercancel",end);
})();/*/MAPNAV*/
/*FRZ*/(function(){
var CSS=".frz td:first-child,.frz th:first-child{position:sticky;left:0;z-index:3;background:var(--cd);box-shadow:inset -1px 0 var(--bd)}.frz th:first-child{z-index:4}.sx{cursor:pointer;user-select:none;white-space:nowrap}.sx i{font-style:normal;opacity:.55;margin-left:3px}";
var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);
function nm(t){var s=(t||"").replace(/[▲▼↕]/g,"").trim();return s}
function val(td){var t=(td.textContent||"").trim();if(/\d\d\/\d\d/.test(t))return {n:t.split(",").length,t:t};var s=t.replace(/R\$|%|\s/g,"").replace(/\./g,"").replace(",",".");var f=parseFloat(s);if(!isNaN(f)&&/^[-+]?[\d.,]+[^a-zA-Z]*$/.test(t.replace(/R\$|%|\s/g,"")))return {n:f,t:t};return {n:null,t:t}}
function sortT(tb,ci,dir){var rows=[].slice.call(tb.rows).filter(function(r){return r.querySelector("td")});if(!rows.length)return;var par=rows[0].parentNode;
 var tot=rows.filter(function(r){return /^total/i.test(r.cells[0].textContent.trim())}),body=rows.filter(function(r){return tot.indexOf(r)<0});
 var vs=body.map(function(r){return val(r.cells[ci]||r.cells[0])});var num=vs.filter(function(v){return v.n!==null||v.t===""||v.t==="-"||v.t==="–"}).length>=vs.length*.6;
 var idx=body.map(function(r,i){return i});idx.sort(function(a,b){var x=vs[a],y=vs[b],c;if(num){c=(x.n===null?-1e18:x.n)-(y.n===null?-1e18:y.n)}else c=x.t.localeCompare(y.t,"pt",{sensitivity:"base",numeric:true});return (c||a-b)*dir});
 idx.forEach(function(i){par.appendChild(body[i])});tot.forEach(function(r){par.appendChild(r)})}
function enh(){["ta","tm","tr"].forEach(function(id){var root=document.getElementById(id);if(!root)return;[].forEach.call(root.querySelectorAll("table"),function(tb){
 var h=tb.rows[0];if(!h)return;var f=nm(h.cells[0].textContent);if(f!=="Artista"&&f!=="")return;if(f===""&&!tb.querySelector("td"))return;
 if(!tb.dataset.frz){tb.dataset.frz=1;tb.classList.add("frz")}
 [].forEach.call(h.cells,function(th,ci){if(tb.classList.contains("nsx")||th.dataset.k!==undefined||th.dataset.yk!==undefined||th.dataset.ck!==undefined||th.dataset.sx)return;
  th.dataset.sx=1;th.classList.add("sx");th.setAttribute("tabindex","0");var i=document.createElement("i");i.textContent="↕";th.appendChild(i);var d=-1;
  var go=function(){d=-d;sortT(tb,ci,d);[].forEach.call(h.cells,function(x){var q=x.querySelector("i");if(q)q.textContent="↕"});i.textContent=d>0?"▲":"▼"};
  th.addEventListener("click",go);th.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go()}})})})})}
var q=0;function sched(){if(q)return;q=requestAnimationFrame(function(){q=0;try{enh()}catch(e){}})}
new MutationObserver(sched).observe(document.body,{childList:true,subtree:true});sched()})();/*/FRZ*/
