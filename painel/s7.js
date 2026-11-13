
/*NV*/(function(){
function mk(id,skip,pl,nl,E){var s=document.getElementById(id);if(!s||s.dataset.nv)return;s.dataset.nv=1;
 var w=document.createElement("span");w.className="nvw";s.parentNode.insertBefore(w,s);
 var p=document.createElement("button"),n=document.createElement("button");
 p.type=n.type="button";p.className="nv p";n.className="nv n";p.setAttribute("aria-label",pl);n.setAttribute("aria-label",nl);p.title=pl;n.title=nl;
 w.appendChild(p);w.appendChild(s);w.appendChild(n);
 function L(){return[].map.call(s.options,function(o){return o.value}).filter(function(v){return v!==skip})}
 function upd(){var l=L(),i=l.indexOf(s.value);p.disabled=!l.length||(i===0&&!(E&&E(-1,1)));n.disabled=!l.length||(i>=0&&i>=l.length-1&&!(E&&E(1,1)))}
 function go(d){var l=L(),i=l.indexOf(s.value),j=i<0?(d<0?l.length-1:0):i+d;if(j<0||j>=l.length){if(E&&E(d,1)){E(d);upd()}return}s.value=l[j];s.dispatchEvent(new Event("change",{bubbles:true}));upd()}
 p.onclick=function(){go(-1)};n.onclick=function(){go(1)};
 s.addEventListener("change",upd);document.addEventListener("click",function(){setTimeout(upd,0)});upd();return upd}
mk("yy","0","Ano anterior","Próximo ano");mk("fm","","Mês anterior","Próximo mês");mk("ra","0","Ano anterior","Próximo ano");mk("rm","","Mês anterior","Próximo mês",function(d,t){/* dezembro ▶ janeiro do ano seguinte; janeiro ◀ dezembro do ano anterior */var y=document.getElementById("ra"),m=document.getElementById("rm"),ys=[].map.call(y.options,function(o){return o.value}),k=ys.indexOf(y.value)+d;if(y.value==="0"||k<0||k>=ys.length||ys[k]==="0")return false;if(t)return true;y.value=ys[k];m.value=d>0?"1":"12";y.dispatchEvent(new Event("change",{bubbles:true}));m.dispatchEvent(new Event("change",{bubbles:true}));return true});function ROLL(yi,mi){return function(d,t){var y=document.getElementById(yi),m=document.getElementById(mi),ys=[].map.call(y.options,function(o){return o.value}),k=ys.indexOf(y.value)+d;if(y.value==="0"||k<0||k>=ys.length||ys[k]==="0")return false;if(t)return true;y.value=ys[k];m.value=d>0?"1":"12";y.dispatchEvent(new Event("change",{bubbles:true}));m.dispatchEvent(new Event("change",{bubbles:true}));return true}}
mk("gy","0","Ano anterior","Próximo ano");mk("gm","0","Mês anterior","Próximo mês",ROLL("gy","gm"));
(function(){var a=document.getElementById("gy"),m=document.getElementById("gm");if(!a||!m||!a.parentNode.classList.contains("nvw"))return;var A=a.parentNode,M=m.parentNode,g=document.createElement("span");g.className="ymg";A.parentNode.insertBefore(g,A);g.appendChild(A);g.appendChild(M)})();
(function(){var a=document.getElementById("ra"),m=document.getElementById("rm");if(!a||!m)return;var A=a.parentNode,M=m.parentNode,g=document.createElement("span");g.className="ymg";A.parentNode.insertBefore(g,A);g.appendChild(A);g.appendChild(M)})();
})();/*/NV*/
