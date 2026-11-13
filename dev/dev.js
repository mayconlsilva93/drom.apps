/* DROM · DEV — aba Propostas (entre Calendário e Financeiro). Só na versão de teste (sistema/dev/<app>/). */
(function(){
var PR=(window.DROMDATA&&DROMDATA.PR)||[],BB=2023,DW=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],P2=n=>String(n).padStart(2,"0");
var LB={"Proposta emitida":"emitida","Em negociação":"em negociação","Data reservada":"reservada","Remarcar":"remarcar","Data indisponível":"indisponível","Proposta descartada":"descartada","Show cancelado":"cancelado","Show confirmado":"fechada","Show realizado":"realizada"};
var FECH={"Show confirmado":1,"Show realizado":1},RUIM={"Proposta descartada":1,"Show cancelado":1},FORA={"Show confirmado":1,"Show realizado":1,"Proposta descartada":1,"Show cancelado":1};
var es=t=>String(t||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
function dt(p){var d=new Date(BB,p[0]-1,p[1]),y=d.getFullYear(),a=new Date(Date.now()-216e5).getFullYear();return"<span>"+DW[d.getDay()]+"</span><span>"+P2(p[1])+"/"+P2(d.getMonth()+1)+(y!==a?"/"+String(y).slice(2):"")+"</span>"}
function nm(p){return p[3]&&p[4]&&p[3]!==p[4]?p[3]+" ("+p[4]+")":(p[3]||p[4]||"Local a definir")}
function ln(p,cls){return'<div class="prl'+(cls?" "+cls:"")+'"><div class="prd">'+dt(p)+'</div><div class="pri"><b>'+es(nm(p))+"</b><span>"+es(p[5]||"")+'</span></div><em class="prb">'+(LB[p[2]]||es(p[2]).toLowerCase())+"</em></div>"}
function view(){
 var hoje=new Date(Date.now()-216e5);hoje=new Date(hoje.getFullYear(),hoje.getMonth(),hoje.getDate());
 var ult=PR.filter(p=>p[6]).sort((a,b)=>a[6]<b[6]?1:a[6]>b[6]?-1:(+b[7])-(+a[7])).slice(0,10);
 var and=PR.filter(p=>!FECH[p[2]]&&new Date(BB,p[0]-1,p[1])>=hoje).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 return'<h3 class="prh">ÚLTIMAS PROPOSTAS</h3><div class="prc">'+(ult.length?ult.map(p=>ln(p,FECH[p[2]]?"ok":RUIM[p[2]]?"no":"")).join(""):'<p class="mu">Nenhuma proposta.</p>')+"</div>"+
  '<h3 class="prh">PROPOSTAS EM ANDAMENTO</h3><div class="prc">'+(and.length?and.map(p=>ln(p,RUIM[p[2]]?"no":"")).join(""):'<p class="mu">Nenhuma proposta em andamento.</p>')+"</div>"}
/* botão no menu, entre Calendário e Financeiro */
var nav=document.querySelector("nav"),f=nav&&nav.querySelector('button[data-t="f"]');
if(f&&!nav.querySelector('button[data-t="p"]')){var b=document.createElement("button");b.dataset.t="p";b.title="Propostas";b.setAttribute("aria-label","Propostas");
 b.innerHTML='<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M7 3.5h7l4.5 4.5v12.5H7z"/><path d="M14 3.5V8h4.5M9.8 12h6M9.8 15.5h6"/></svg>';nav.insertBefore(b,f)}
var st=document.createElement("style");st.textContent='nav{grid-template-columns:repeat(5,1fr)!important}nav button svg path{fill:none;stroke:currentColor;stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round}'+
 '.prh{text-align:center;font-size:15px;color:#0000FF;margin:18px 0 8px;letter-spacing:.03em}.prc{background:var(--cd);border:1px solid var(--bd);border-radius:14px;overflow:hidden}'+
 '.prl{display:flex;align-items:center;gap:10px;padding:9px 12px;border-top:1px solid var(--bd)}.prl:first-child{border-top:0}.prd{flex:none;width:46px;font-size:12.5px;font-weight:700;text-align:center;line-height:1.25}.prd span{display:block}.prd span:first-child{font-size:11px;text-transform:uppercase;letter-spacing:.03em}.prc{overflow-y:auto!important;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}'+
 '.pri{flex:1;min-width:0}.pri b{display:block;font-size:13.5px;font-weight:600;overflow-wrap:anywhere}.pri span{display:block;font-size:12px;color:var(--mu)}'+
 '.prb{flex:none;font-style:normal;font-size:11px;border:1px solid var(--bd);border-radius:20px;padding:2px 8px;color:var(--mu);white-space:nowrap}'+
 '.prl.ok .pri b,.prl.ok .prd{font-weight:800;color:#0a8a07}.prl.ok .prb{color:#0a8a07;border-color:#0a8a07;font-weight:700}.prl.no .pri b,.prl.no .prd{color:#c5221f}.prl.no .prb{color:#c5221f;border-color:#c5221f}'+
 'body.tp #sum,body.tp .ctl{display:none!important}';document.head.appendChild(st);
var d0=window.draw;window.draw=function(){d0.apply(this,arguments);document.body.classList.toggle("tp",tab==="p");if(tab==="p"){document.getElementById("app").innerHTML=view();var hs=[].map.call(document.querySelectorAll(".prl"),function(x){return x.offsetHeight}).sort(function(a,b){return a-b}),md=hs.length?hs[Math.floor(hs.length/2)]:56;document.querySelectorAll(".prc").forEach(function(c){c.style.height=(c.querySelectorAll(".prl").length>5?5*md:"")+(c.querySelectorAll(".prl").length>5?"px":"")});var a=document.getElementById("app");if(window.MutationObserver){}}};
try{draw()}catch(e){}
})();
