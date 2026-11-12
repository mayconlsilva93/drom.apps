
/*WK*/var WK=DD.WK;/*/WK*/
/*AG*/(function(){
var M0=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],AY=YF(CUR),AM=new Date(Date.now()-216e5).getMonth()+1,AS="P",AO={"Todos":1};
var st=document.createElement("style");st.textContent="#tg .ag{margin:0 0 10px}#tg details{background:var(--cd);border:1px solid var(--bd);border-radius:12px;margin:0 0 8px;padding:0 14px}#tg summary{cursor:pointer;padding:11px 0;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:8px}#tg summary::-webkit-details-marker{display:none}#tg summary span{color:var(--mu);font-weight:400;font-size:12px}#tg summary.gy b{color:var(--mu);font-weight:400}#tg .agbox{padding:2px 0 12px;font-size:14px;line-height:1.55;user-select:text}#tg .agl{padding:1px 0}#tg .ad{color:var(--ac);font-weight:700}#tg .agc{margin:0 0 10px}#tg .age{color:var(--mu);padding:6px 0 12px}#tg .wk{border-top:1px solid var(--bd);margin-top:4px;padding:10px 0 12px}#tg .wkh{display:flex;justify-content:space-between;gap:8px;align-items:baseline;margin:0 0 6px;font-size:14px}#tg .wkh span{color:var(--mu);font-size:12px}#tg .wks label{display:flex;gap:8px;align-items:flex-start;padding:3px 0;font-size:13px;line-height:1.35;cursor:pointer}#tg .wks input{margin-top:2px;flex:none}#tg .wkt{display:block;width:100%;box-sizing:border-box;margin:8px 0;padding:8px 10px;border-radius:8px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);font:13px/1.45 system-ui,sans-serif;resize:vertical}";document.head.appendChild(st);
function esc(x){return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function p2(n){return String(n).padStart(2,"0")}
function tk(s){var m=/^(\d\d):(\d\d)/.exec(s[4]);return m?(+m[1]<6?+m[1]+24:+m[1])*60+ +m[2]:9999}
function priv(x){var n=String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");if(/baile de formatura/.test(n))return"";if(/jantar.*formatura/.test(n))return"Jantar de Formatura";if(/casamento|bodas/.test(n))return"Casamento";if(/aniversario|\b15 anos\b/.test(n))return/\b15 anos\b/.test(n)?"Aniversário 15 Anos":"Aniversário";if(/\bformatura\b/.test(n))return"Formatura";return""}
function parts(s){var ev=s[21]||"",c=s[2]||"",loc=ev?(c!==ev?c.slice(0,c.length-ev.length-3):""):c;var pv=priv(c+" "+ev);if(pv){ev=pv;loc=""}if(!ev&&!loc)loc="Local não informado";var ci=s[3]||"";if(ci&&ci.indexOf("/")<0&&ci!=="Cidade não informada")ci+="/SC";return{ev:ev,loc:loc,ci:ci,d:p2(s[0])+"/"+p2((s[14]-1)%12+1)}}
function nm(i){return AR[i]==="Cadu Vieira"?"Cadu Vieira DJ":"DJ "+AR[i]}
function lineA(s){var q=parts(s),t=q.d+" ",h='<span class="ad">'+q.d+"</span> ",w=q.ev&&q.loc?[q.ev,q.loc]:null;
 if(w){t+=q.ev+" ("+q.loc+")";h+="<b>"+esc(q.ev)+"</b> (<b>"+esc(q.loc)+"</b>)"}else{var x=q.ev||q.loc;t+=x;h+="<b>"+esc(x)+"</b>"}
 if(q.ci){t+=" - "+q.ci;h+=" - "+esc(q.ci)}return{t:t,h:h}}
function lineT(s){var q=parts(s),n=nm(s[1]),t=q.d+" "+n,h='<span class="ad">'+q.d+"</span> <b>"+esc(n)+"</b>",m=[q.ev,q.loc].filter(Boolean).join(" - ");
 if(m){t+=" - "+m;h+=" - "+esc(m)}if(q.ci){t+=" ("+q.ci+")";h+=" ("+esc(q.ci)+")"}return{t:t,h:h}}
/* Datas da semana: hoje até a quarta da semana seguinte (semana de segunda a domingo) */
var WS={},WDN=["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
function wkEnd(){var n=new Date(Date.now()-216e5),t0=new Date(n.getFullYear(),n.getMonth(),n.getDate()),dw=(t0.getDay()+6)%7;return[t0,new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()+6),new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()+14)]}
function wkOn(s){var v=WS[s[20]];return v===undefined?wkDt(s)<=wkEnd()[1]:v}
function fd2(d){return p2(d.getDate())+"/"+p2(d.getMonth()+1)}
function wkDt(s){return new Date(YF(s[14]),(s[14]-1)%12,s[0])}
function wkRows(i){var r=wkEnd();return ALL.filter(function(s){if(s[1]!==i)return false;var d=wkDt(s);return d>=r[0]&&d<=r[2]}).sort(function(a,b){return a[14]-b[14]||a[0]-b[0]||tk(a)-tk(b)})}
function hmm(m){m=((m%1440)+1440)%1440;return p2(Math.floor(m/60))+":"+p2(m%60)}
function fTel(t){var d=String(t||"").trim().replace(/\.0$/,""),n=d.replace(/\D/g,"");if(/^\d{10,11}$/.test(n)&&/^[\d.]+$/.test(d))return"("+n.slice(0,2)+") "+n.slice(2,n.length-4)+"-"+n.slice(-4);return d}
function wkCid(s){var ci=s[3]||"";if(!ci||ci==="Cidade não informada")return"";return ci.indexOf("/")<0?ci+"/SC":ci}
function wkWhere(s){var ev=s[21]||"",lo=s[17]||"",ci=wkCid(s);if(lo==="Local não informado")lo="";if(ev&&lo&&ev!==lo)return ev+" ("+lo+(ci?", "+ci:"")+")";var x=ev||lo;return x+(ci?(x?" ("+ci+")":ci):"")}
function wkTime(s,w){var m=/^(\d\d):(\d\d)/.exec(s[4]||"");if(!m)return"a definir";var a=+m[1]*60+ +m[2],d=w?w[4]:s[15];return m[1]+":"+m[2]+" - "+(d>0?hmm(a+d):"a definir")}
function wkBlock(s){var w=(typeof WK!=="undefined"&&WK[s[20]])||null,d=wkDt(s),L=["*"+p2(s[0])+"/"+p2(d.getMonth()+1)+" - "+WDN[d.getDay()]+"*","📍 "+wkWhere(s),"🕒 "+wkTime(s,w)];
 if(w){var eq=w[0],rd=w[1],ob=w[2],pe=w[3],ct=w[5];
  if(eq)L.push("⚙️ "+(/^confirmar$/i.test(eq)?"aguardando confirmação":eq));
  if(rd&&!/^(\?|-|—)$/.test(rd))L.push("🍹 "+(/^confirmar$/i.test(rd)?"aguardando confirmação":rd));
  var co=[s[18],fTel(s[19])].filter(Boolean).join(" - ");if(co)L.push("📞 "+co);
  if(ob)L.push("⚠️ "+ob);
  if(pe>0)L.push("👤 "+p2(pe)+(pe===1?" pessoa":" pessoas"));
  var hs=String(w[6]||"").trim().toLowerCase();if(hs==="contratante"){var hp=(pe>0?pe:0)+1;L.push("🛏️ "+p2(hp)+(hp===1?" pessoa":" pessoas")+" (Contratante)")}else if(hs==="artista")L.push("🛏️ Responsabilidade artista");
  if(ct)L.push("✍🏻 https://drive.google.com/file/d/"+ct+"/view")}
 else{var co2=[s[18],fTel(s[19])].filter(Boolean).join(" - ");if(co2)L.push("📞 "+co2)}
 return L.join("\n")}
function wkText(i){var r=wkRows(i).filter(wkOn);return r.length?"*DATAS DA SEMANA*\n\n"+r.map(wkBlock).join("\n\n"):""}
function wkRows2(t){return Math.max(4,Math.min(16,t.split("\n").length+1))}
function wkBox(i){var r=wkRows(i),e=wkEnd(),fim=fd2(e[1]),fim2=fd2(e[2]),h='<div class="wk" data-i="'+i+'"><div class="wkh"><b>Datas da semana</b><span>selecionados os próximos 7 dias (até '+fim+") · lista até "+fim2+"</span></div>";
 if(!r.length)return h+'<div class="age" style="padding:0">Nenhum show confirmado até '+fim2+".</div></div>";
 h+='<div class="wks">'+r.map(function(s){var d=wkDt(s),w=(typeof WK!=="undefined"&&WK[s[20]])||null;return'<label><input type="checkbox" class="wkc" data-k="'+esc(s[20])+'"'+(wkOn(s)?" checked":"")+"><span><b>"+p2(s[0])+"/"+p2(d.getMonth()+1)+"</b> "+WDN[d.getDay()].slice(0,3)+" · "+esc(wkWhere(s))+" · "+esc(wkTime(s,w))+"</span></label>"}).join("")+"</div>";
 var t=wkText(i);return h+'<textarea class="wkt" rows="'+wkRows2(t)+'" spellcheck="false">'+esc(t)+'</textarea><button class="wkcp" type="button">Copiar</button></div>'}
function box(id,title,rows,fn,old,extra){var L=rows.map(fn),o=AO[id]?" open":"";
 return'<details data-id="'+esc(id)+'"'+o+"><summary"+(old?' class="gy"':"")+"><b>"+esc(title)+"</b><span>"+rows.length+(rows.length===1?" show":" shows")+"</span></summary>"+(rows.length?'<button class="agc" data-copy="'+esc(id)+'">Copiar</button><div class="agbox" data-t="'+esc(L.map(function(l){return l.t}).join("\n"))+'">'+L.map(function(l){return'<div class="agl">'+l.h+"</div>"}).join("")+"</div>":'<div class="age">Sem shows neste filtro.</div>')+(extra||"")+"</details>"}
var KM={"Florianópolis":0,"São José":12,"Palhoça":20,"Biguaçu":25,"Santo Amaro da Imperatriz":35,"Antônio Carlos":35,"Águas Mornas":45,"Governador Celso Ramos":45,"São João Batista":55,"Rancho Queimado":70,"Itapema":70,"Camboriú":75,"Balneário Camboriú":80,"Imbituba":90,"Itajaí":90,"Brusque":95,"Balneário Piçarras":100,"Laguna":115,"Gaspar":115,"Luiz Alves":130,"Capivari de Baixo":130,"Indaial":135,"Blumenau":140,"Tubarão":125,"Braço do Norte":150,"São Ludgero":160,"Urubici":170,"Joinville":180,"Presidente Getúlio":185,"Rio do Sul":190,"Criciúma":190,"Meleiro":205,"Içara":200,"Forquilhinha":205,"Siderópolis":210,"Nova Veneza":215,"Lages":220,"São Joaquim":220,"Araranguá":230,"Curitibanos":270,"Mafra":280,"Papanduva":280,"Monte Castelo":290,"Curitiba/PR":300,"Porto União":380,"União da Vitória/PR":385,"Joaçaba":390,"Concórdia":480,"Chapecó":560,"Guarapuava/PR":560,"Caxias do Sul/RS":570,"Pato Branco/PR":640,"Pelotas/RS":640,"Erechim/RS":650,"São Miguel do Oeste":690,"Itapiranga":690,"São José do Cedro":740,"Dionísio Cerqueira":770,"Barracão/PR":770,"Maringá/PR":840,"Santa Maria/RS":850,"Itaara/RS":860,"Astorga/PR":890,"Cianorte/PR":900,"Paranavaí/PR":970,"São Luiz Gonzaga/RS":1000,"Campo Grande/MS":1400};
function nz(x){return String(x||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").trim()}
function orderT(rows){var days={};rows.forEach(function(s){var k=s[14]*100+s[0];(days[k]=days[k]||[]).push(s)});
 return Object.keys(days).map(Number).sort(function(a,b){return a-b}).reduce(function(out,k){var G={};
  days[k].forEach(function(s){var q=parts(s),g=nz(q.loc!=="Local não informado"?q.loc:q.ev)+"|"+nz(s[3]);(G[g]=G[g]||[]).push(s)});
  var gs=Object.keys(G).map(function(g){var L=G[g],s0=L[0],km=KM[s0[3]];if(km===undefined)km=(s0[3]||"").indexOf("/")>0?500:60;
   var ag=L.some(function(s){return /drom/i.test(s[21]||"")||s[18]==="DROM"}),pv=L.some(function(s){return"PWA".indexOf(s[16])>-1}),
   big=L.some(function(s){var t=nz(s[17]+" "+s[21]);return s[16]==="L"||/music park|life club|atoa na joa|label propria/.test(t)}),n=new Set(L.map(function(s){return s[1]})).size,tier;
   if(ag)tier=0;else if(pv)tier=4;else if(km>=40)tier=1;else if(big)tier=2;else tier=3;
   L.sort(function(a,b){return AR[a[1]].localeCompare(AR[b[1]],"pt")});
   return{L:L,tier:tier,n:n,km:km,t:Math.min.apply(null,L.map(tk))}});
  gs.sort(function(a,b){return a.tier-b.tier||b.n-a.n||(a.tier===1?b.km-a.km:0)||a.t-b.t});
  gs.forEach(function(x){out=out.concat(x.L)});return out},[])}
window.renderG=function(){var rows=ALL.filter(function(s){var r=isR(s);return(AY===0||YF(s[14])===AY)&&(AM===0||(s[14]-1)%12+1===AM)&&(AS==="T"||(AS==="R")===r)});
 rows.sort(function(a,b){return a[14]-b[14]||a[0]-b[0]||tk(a)-tk(b)});
 var h='<div class="ag">'+box("Todos","Todos os artistas",orderT(rows),lineT,false);
 ARO().forEach(function(o){var i=+/value="(\d+)"/.exec(o)[1],r=rows.filter(function(s){return s[1]===i});h+=box(AR[i],AR[i],r,lineA,OLD.indexOf(AR[i])>-1,wkBox(i))});
 $("gout").innerHTML=h+"</div>"};
function init(){$("gy").innerHTML=opt(0,"Todos")+[...new Set(MS.map(YF))].sort().map(function(y){return opt(y,y)}).join("");$("gy").value=AY;
 $("gm").innerHTML=opt(0,"Todos")+M0.map(function(n,i){return opt(i+1,n)}).join("");$("gm").value=AM;$("gs").value=AS;
 $("gy").onchange=function(){AY=+$("gy").value;renderG()};$("gm").onchange=function(){AM=+$("gm").value;renderG()};$("gs").onchange=function(){AS=$("gs").value;renderG()};
 $("gout").addEventListener("change",function(e){var c=e.target;if(!c.classList||!c.classList.contains("wkc"))return;var w=c.closest(".wk"),i=+w.dataset.i;WS[c.dataset.k]=c.checked;var t=wkText(i),a=w.querySelector(".wkt");a.value=t;a.rows=wkRows2(t)});
 $("gout").addEventListener("click",function(e){var b=e.target.closest(".wkcp");if(!b)return;var a=b.parentNode.querySelector(".wkt"),t=a.value,ok=function(){b.textContent="Copiado!";setTimeout(function(){b.textContent="Copiar"},1500)};
  var fb=function(){a.select();try{document.execCommand("copy");ok()}catch(x){}};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,fb);else fb()});
 $("gout").addEventListener("toggle",function(e){var d=e.target;if(d.tagName==="DETAILS")AO[d.dataset.id]=d.open},true);
 $("gout").addEventListener("click",function(e){var b=e.target.closest("[data-copy]");if(!b)return;var t=b.nextElementSibling.dataset.t,ok=function(){b.textContent="Copiado!";setTimeout(function(){b.textContent="Copiar"},1500)};
  var fb=function(){var a=document.createElement("textarea");a.value=t;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(x){}document.body.removeChild(a)};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,fb);else fb()})}
init()})();/*/AG*/
