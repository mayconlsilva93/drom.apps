
/*NV*/(function(){
function mk(id,skip,pl,nl){var s=document.getElementById(id);if(!s||s.dataset.nv)return;s.dataset.nv=1;
 var w=document.createElement("span");w.className="nvw";s.parentNode.insertBefore(w,s);
 var p=document.createElement("button"),n=document.createElement("button");
 p.type=n.type="button";p.className="nv p";n.className="nv n";p.setAttribute("aria-label",pl);n.setAttribute("aria-label",nl);p.title=pl;n.title=nl;
 w.appendChild(p);w.appendChild(s);w.appendChild(n);
 function L(){return[].map.call(s.options,function(o){return o.value}).filter(function(v){return v!==skip})}
 function upd(){var l=L(),i=l.indexOf(s.value);p.disabled=!l.length||i===0;n.disabled=!l.length||i<0||i>=l.length-1}
 function go(d){var l=L(),i=l.indexOf(s.value),j=i<0?(d<0?l.length-1:-1):i+d;if(j<0||j>=l.length)return;s.value=l[j];s.dispatchEvent(new Event("change",{bubbles:true}));upd()}
 p.onclick=function(){go(-1)};n.onclick=function(){go(1)};
 s.addEventListener("change",upd);document.addEventListener("click",function(){setTimeout(upd,0)});upd();return upd}
mk("yy","0","Ano anterior","Próximo ano");mk("fm","","Mês anterior","Próximo mês");mk("ra","0","Ano anterior","Próximo ano");
})();/*/NV*/
