
var BASE=DD.BASE;
var TP_B64=BKA.TP;
var TC_B64=BKA.TC;
var CL=DD.CL;
var ORDER=["Amaro","Cadu Vieira","Carloto","Cenoura","Josu","Maneira","Ramonstro","Sena","Brinquinho","Liquinho"];
var STOK={"Show realizado":"ok","Show confirmado":"cf","Proposta emitida":"wr","Proposta descartada":"","Show cancelado":"er","Data indisponível":"","Data reservada":"wr","Remarcar":"wr"};
var $=function(i){return document.getElementById(i)};
var ADDR=DD.ADDR;
/* locais acrescentados à mão (somam ao que vem da base) */
var ADDR_X={"Grêmio do HU UFSC|Florianópolis/SC":"Rua Professora Maria Flora Pausewang, s/n, bairro Trindade"};
Object.keys(ADDR_X).forEach(function(k){if(!ADDR[k])ADDR[k]=ADDR_X[k]});
var FONTS={"Regular":BKA.FRegular,"Bold":BKA.FBold,"Italic":BKA.FItalic,"BoldItalic":BKA.FBoldItalic};
try{if(FONTS&&FONTS.BoldItalic&&window.FontFace){new FontFace("DROM Ivy","url(data:font/ttf;base64,"+FONTS.BoldItalic+")",{weight:"700",style:"italic"}).load().then(function(f){document.fonts.add(f)}).catch(function(){})}}catch(e){}

var OV={}, cur=null, wmode="c", tab="d";
var TODAY=new Date().toISOString().slice(0,10);

/* ---------- utilidades ---------- */
function pad(n,l){n=String(n);while(n.length<l)n="0"+n;return n}
function br(iso){if(!iso)return"";var p=String(iso).split("-");return p.length===3?p[2]+"/"+p[1]+"/"+p[0]:iso}
function brs(iso){if(!iso)return"";var p=String(iso).split("-");return p[2]+"/"+p[1]+"/"+p[0].slice(2)}
function money(v){if(v===undefined||v===null||v==="")return"";var n=Number(String(v).replace(/\./g,"").replace(",","."));if(isNaN(n))n=Number(v);if(isNaN(n))return String(v);return"R$ "+n.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}
function num(v){var n=Number(v);return isNaN(n)?0:n}
function durFmt(d){if(!d)return"";var m=/^(\d+):(\d+)$/.exec(d);if(!m)return d;var h=+m[1],mi=+m[2];var a=h>0?h+(h===1?" hora":" horas"):"",b=mi>0?mi+(mi===1?" minuto":" minutos"):"";return a&&b?a+" e "+b:(a||b||"0 minutos")}
function durCal(d){var m=/^(\d+):(\d+)$/.exec(d||"");return m?(+m[1]*60+ +m[2]):60}
function prodFmt(p){if(p===undefined||p===""||p===null)return"";var n=Number(p);if(isNaN(n))return String(p);return n===0?"não acordado":n===1?"1 pessoa":n+" pessoas"}
function nome(a){return a==="Cadu Vieira"?"Cadu Vieira DJ":(a==="Sena"||a==="Maneira")?a:"DJ "+a}
var CODE={"Ramonstro":1,"Brinquinho":2,"Carloto":3,"Sena":4,"Cenoura":5,"Liquinho":6,"Maneira":7,"Amaro":8,"Josu":9,"Cadu Vieira":10};
function ckey(r,a){a=a||(cur&&cur.a);return(CODE[a]||"")+pad(r.n,4)}
function numero(r,a){return ckey(r,a)+"/"+String(r.dprop||r.dt||"").slice(0,4)}
function key(a,n){return a+"|"+n}
function R(a,p){var o=OV[key(a,p.n)]||{};var r={};for(var k in p)r[k]=p[k];for(var k2 in o)r[k2]=o[k2];if(!r.end_local){var ad=addrFor(r);if(ad)r.end_local=ad}return r}
var _AI=null;
function nv(x){return String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\(.*?\)/g," ").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim()}
function addrIdx(){if(_AI)return _AI;_AI=[];Object.keys(ADDR).forEach(function(k){var q=k.split("|");_AI.push({n:nv(q[0]),c:nv((q[1]||"").split("/")[0]),s:ADDR[k]})});return _AI}
function addrFind(r){var k=String(r.loc||"").trim()+"|"+String(r.cid||"").trim();if(ADDR[k])return ADDR[k];
  var raw=String(r.loc||""),c=nv(String(r.cid||"").split("/")[0]),I=addrIdx(),cands=[nv(raw)];
  raw.split(/\s+[-–—·|]\s+|\s*·\s*|\s*\/\s*/).forEach(function(s){s=nv(s);if(s&&cands.indexOf(s)<0)cands.push(s)});
  cands=cands.filter(function(s){return s.length>=3});
  var same=I.filter(function(x){return x.c===c});
  for(var a=0;a<cands.length;a++){var e=same.filter(function(x){return x.n===cands[a]});if(e.length)return e[0].s}
  for(var a2=0;a2<cands.length;a2++){var e2=I.filter(function(x){return x.n===cands[a2]});if(e2.length&&e2.every(function(x){return x.s===e2[0].s}))return e2[0].s}
  for(var a3=0;a3<cands.length;a3++){var s=cands[a3];if(s.length<5)continue;var e3=same.filter(function(x){return x.n.length>=5&&(x.n.indexOf(s)===0||s.indexOf(x.n)===0||(" "+s+" ").indexOf(" "+x.n+" ")>=0||(" "+x.n+" ").indexOf(" "+s+" ")>=0)});if(e3.length===1)return e3[0].s}
  var best=null,bs=0;for(var a4=0;a4<cands.length;a4++){var w=cands[a4].split(" ").filter(function(z){return z.length>2});if(w.length<2)continue;
    same.forEach(function(x){var xw=x.n.split(" ").filter(function(z){return z.length>2}),h=w.filter(function(z){return xw.indexOf(z)>=0}).length,sc=h/Math.max(w.length,xw.length);if(sc>bs){bs=sc;best=x}})}
  return best&&bs>=0.6?best.s:""}
function addrFor(r){var s=addrFind(r);if(!s)return"";var m={"R.":"Rua","Av.":"Avenida","Rod.":"Rodovia","Al.":"Alameda","Estr.":"Estrada","Pref.":"Prefeito","Ver.":"Vereador","Cap.":"Capitão","Eng.":"Engenheiro","Cel.":"Coronel","Dr.":"Doutor"};return s.replace(/\b(R\.|Av\.|Rod\.|Al\.|Estr\.|Pref\.|Ver\.|Cap\.|Eng\.|Cel\.|Dr\.)(?=\s)/g,function(x){return m[x]})}
function cur_(){return cur?R(cur.a,cur.p):null}
function toast(t){var e=$("toast");e.textContent=t;e.className="on";clearTimeout(toast.t);toast.t=setTimeout(function(){e.className=""},1800)}
function copyEl(id){var e=$(id);var t=e.value;
  function fb(){e.removeAttribute("readonly");e.select();try{document.execCommand("copy");toast("Copiado")}catch(x){toast("Selecione e copie manualmente")}}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){toast("Copiado")},fb)}else fb()}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}

/* ---------- campos do formulário ---------- */
var GROUPS=[
 ["Evento",[["n","Nº da proposta","text",0,1],["_num","Número oficial","text",0,1],["st","Status","text"],["dt","Data do show","date"],["dow","Dia da semana","text"],["ev","Evento","text","w2"],["loc","Local","text","w2"],["cid","Cidade/UF","text"],["end_local","Endereço do local","text","w2"],["cat","Categoria","text"]]],
 ["Horários",[["hi","Início do evento","text"],["hf","Fim do evento","text"],["ini","Início do show","text"],["dur","Duração","text"]]],
 ["Produção",[["eq","Equipamento","text"],["rid","Rider de hospitalidade","text"],["hosp","Hospedagem","text"],["prod","Produção (pessoas)","text"],["obs","Observações","text","wf"]]],
 ["Contratante e venda",[["cont","Contratante","text","w2"],["tel","Contato","text"],["vend","Vendedor","text"],["dprop","Data da proposta","date"],["dapr","Data de aprovação","date"],["dsin","Vencimento do sinal","date"]]],
 ["Financeiro",[["cach","Cachê bruto (R$)","text"],["desp","Despesas (R$)","text"],["liq","Cachê líquido (R$)","text"],["com","Comissão (%)","text"],["_comr","Comissão (R$)","text",0,1],["pg_forma","Pagamento (agenda)","text"],["ctr","Contrato","text"],["nf","Nota fiscal","text"],["rec","Cachê recebido?","text"],["recpor","Recebido por","text"],["drec","Data do recebimento","text"]]]
];
function getVal(r,k){
  if(k==="_num")return numero(r,cur&&cur.a);
  if(k==="_comr"){var l=r.liq!==undefined?num(r.liq):num(r.cach)-num(r.desp);return l&&r.com?l*num(r.com):""}
  if(k==="com")return r.com!==undefined?String(Math.round(num(r.com)*1000)/10).replace(".",","):"";
  var v=r[k];return v===undefined||v===null?"":String(v)}
function setVal(k,v){var o=OV[key(cur.a,cur.p.n)]||(OV[key(cur.a,cur.p.n)]={});
  if(k==="com"){var n=Number(String(v).replace(",","."));o.com=isNaN(n)?0:n/100}
  else if(k==="prod"){o.prod=v===""?undefined:(isNaN(Number(v))?v:Number(v))}
  else o[k]=v;
  refreshDerived()}
function buildForms(){
  var r=cur_(),h="";
  GROUPS.forEach(function(g){
    h+='<div class="p"><h2>'+g[0]+'</h2><div class="fg">';
    g[1].forEach(function(f){var k=f[0],ro=f[4]?" readonly":"";var cl=f[3]?(' class="'+f[3]+'"'):"";
      h+='<label'+cl+'><span>'+f[1]+'</span><input id="f_'+k+'" data-k="'+k+'" type="'+(f[2]==="date"?"date":"text")+'" value="'+esc(getVal(r,k))+'"'+ro+'></label>'});
    h+='</div></div>'});
  $("forms").innerHTML=h;
  var fe=$("f_end_local");if(fe){var lb=fe.parentNode,bt=document.createElement("button"),ms=document.createElement("span");bt.type="button";bt.id="endb";bt.textContent="Buscar endereço com Claude";bt.style.cssText="font-size:12px;margin-top:3px;padding:3px 8px;align-self:flex-start";ms.id="endmsg";ms.style.cssText="font-size:12px;color:var(--mu)";bt.onclick=function(){autoEnd(1)};lb.appendChild(bt);lb.appendChild(ms)}
  $("forms").querySelectorAll("input:not([readonly])").forEach(function(i){i.addEventListener("input",function(){setVal(i.dataset.k,i.value)})});
  buildCForm()}
function refreshDerived(){
  var r=cur_();["_num","_comr"].forEach(function(k){var e=$("f_"+k);if(e)e.value=getVal(r,k)});
  renderSum();renderAll()}

/* campos do contrato */
var CF=[["ct_nome","Contratante (nome ou razão social)","w2"],["ct_doc","CPF/CNPJ do contratante"],["ct_end","Endereço (rua e número)","w2"],["ct_bairro","Bairro"],["ct_comp","Complemento (apto/sala, se houver)"],["ct_cid","Cidade/UF"],["ct_cep","CEP"],["ct_email","E-mail do contratante"],["ct_tel","Telefone do contratante"],["ct_rep","Nome do representante (assinatura)"],["ct_repdoc","CPF/CNPJ de quem assina"]];
function cget(k,r,g){return r[k]!==undefined?r[k]:(k==="ct_nome"?(r.cont||""):(k==="ct_tel"?(r.tel||""):""))}
function buildCForm(){var r=cur_(),h="";
  CF.forEach(function(f){var g=f[4];h+='<label'+(f[2]?' class="'+f[2]+'"':"")+'><span>'+f[1]+'</span><input type="text" id="c_'+f[0]+'" data-c="'+f[0]+'" data-g="'+(g?1:0)+'" value="'+esc(cget(f[0],r,g))+'"></label>'});
  $("cform").innerHTML=h;
  var cl=$("c_ct_cep"),ca=document.createElement("a");ca.id="cepq";ca.target="_blank";ca.rel="noopener";ca.textContent="Buscar CEP";ca.style.cssText="font-size:12px;margin-top:3px;display:none";if(cl)cl.parentNode.appendChild(ca);
  var cb=document.createElement("button");cb.type="button";cb.id="cepb";cb.textContent="Buscar CEP com Claude";cb.style.cssText="font-size:12px;margin-top:3px;display:none;padding:3px 8px";cb.onclick=function(){autoCep(0,1)};if(cl)cl.parentNode.appendChild(cb);
  function cepLink(){if(!cl)return;var g=function(k){var e=$("c_"+k);return e?e.value.trim():""};var q=[g("ct_end"),g("ct_bairro"),g("ct_cid")].filter(Boolean).join(", ");
    var show=!g("ct_cep")&&g("ct_end")&&g("ct_cid");ca.style.display=show?"":"none";cb.style.display=g("ct_end")&&g("ct_cid")?"":"none";cb.textContent=g("ct_cep")?"Rebuscar CEP com Claude":"Buscar CEP com Claude";if(show)ca.href="https://www.google.com/search?q="+encodeURIComponent("CEP "+q)}
  $("cform").addEventListener("input",cepLink);cepLink();
  $("cform").querySelectorAll("input").forEach(function(i){i.addEventListener("input",function(){
    if(i.dataset.g==="1"){(OV._g||(OV._g={}))[i.dataset.c]=i.value}else{var o=OV[key(cur.a,cur.p.n)]||(OV[key(cur.a,cur.p.n)]={});o[i.dataset.c]=i.value}
    renderAll()})})}


/* ---------- colar dados do contratante (nada é armazenado) ---------- */
function hhmm(s){var m=/(\d{1,2})\s*(?:h|:)\s*(\d{2})?/i.exec(s||"");return m?(+m[1])+":"+pad(+(m[2]||0),2):""}
function hhmm2(s){var m=String(s||"").match(/(\d{1,2})\s*(?:h|:)\s*(\d{2})?/gi);if(!m)return[];return m.slice(0,2).map(hhmm)}
var UFS="AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
var SMALLW={de:1,da:1,do:1,das:1,dos:1,e:1,di:1,du:1,del:1};
function smartCase(s){s=String(s||"").trim().replace(/\s+/g," ");if(!s)return s;if(s!==s.toUpperCase()&&s!==s.toLowerCase())return s.split(" ").map(function(w,i){return(i>0&&SMALLW[w])||!/^[a-zà-ÿ]/.test(w)?w:w.charAt(0).toUpperCase()+w.slice(1)}).join(" ");
  return s.toLowerCase().split(" ").map(function(w,i){if(/^(ltda|me|epp|mei|eireli|s\/a|sa|cia|ss)\.?$/.test(w))return w.toUpperCase();if(i>0&&SMALLW[w])return w;return w.replace(/(^|[\-'(])([a-zà-ÿ])/g,function(_,a,b){return a+b.toUpperCase()})}).join(" ")}
function fmtDoc(s){var d=String(s||"").replace(/\D/g,"");if(d.length===11)return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4");if(d.length===14)return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,"$1.$2.$3/$4-$5");return String(s||"").trim()}
function fmtTel(s){var raw=String(s||"").trim();var d=raw.replace(/\D/g,"");if(d.length>11&&d.slice(0,2)==="55")d=d.slice(2);
  if(d.length===11)return"("+d.slice(0,2)+") "+d.slice(2,7)+"-"+d.slice(7);if(d.length===10)return"("+d.slice(0,2)+") "+d.slice(2,6)+"-"+d.slice(6);
  if(d.length===9)return d.slice(0,5)+"-"+d.slice(5);if(d.length===8)return d.slice(0,4)+"-"+d.slice(4);return raw}
function cityUF(c){var n=String(c||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();if(!n||/\//.test(c))return c;try{var f="";Object.keys(BASE).forEach(function(k){(BASE[k].p||[]).forEach(function(p){var q=String(p.cid||"").split("/");if(!f&&q[1]&&q[0].normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()===n)f=q[0]+"/"+q[1]})});if(f)return f}catch(e){}return knownCities()[n]?c+"/SC":c}
function fmtCidUF(s){s=String(s||"").trim().replace(/[.,;]+$/,"");var m=/^(.*?)[\s,\/\-–]+([A-Za-z]{2})$/.exec(s);if(m&&UFS.indexOf(m[2].toUpperCase())>=0)return m[1].trim().replace(/[,\-–\s]+$/,"")+"/"+m[2].toUpperCase();return s}
function knownCities(){if(window._kc)return window._kc;var m={};try{Object.keys(BASE).forEach(function(k){(BASE[k].p||[]).forEach(function(p){var c=String(p.cid||"").split("/")[0];if(c)m[c.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase()]=1})});
  "florianopolis sao jose palhoca biguacu joinville blumenau itajai balneario camboriu camboriu criciuma chapeco lages tubarao curitiba porto alegre sao paulo rio de janeiro".split("|");
  ["florianopolis","sao jose","palhoca","biguacu","joinville","blumenau","itajai","balneario camboriu","camboriu","criciuma","chapeco","lages","tubarao","curitiba","porto alegre","sao paulo","rio de janeiro","itapema","navegantes","jaragua do sul","brusque","imbituba","laguna","garopaba","santo amaro da imperatriz","governador celso ramos","sao francisco do sul","gaspar","indaial","rio do sul"].forEach(function(c){m[c]=1})}catch(e){}window._kc=m;return m}
function splitEnd(s,cidHint){var o={};s=String(s||"").replace(/\s+/g," ").trim();
  s=s.replace(/\b(?:n[º°]|n[uú]m(?:ero)?\.?)\s*(?=\d)/gi,"").replace(/\bn\s+(?=\d)/g,"");
  var cm=/(?:CEP\s*:?\s*)?\b(\d{2})\.?(\d{3})[-.]?(\d{3})\b/i.exec(s);if(cm){o.cep=cm[1]+cm[2]+"-"+cm[3];s=s.replace(cm[0],"|")}
  s=s.replace(/\bCEP\s*:?\s*\|?/gi,"|").replace(/\|/g,",");
  s=s.replace(/(\d)\s*[-–—]\s+(?=[A-Za-zÀ-ÿ])/g,"$1, ").replace(/\s+[-–—]\s+/g,", ").replace(/\s*,\s*/g,", ").replace(/(,\s*)+$/,"").replace(/^(,\s*)+/,"");
  var toks=s.split(/,\s*/).map(function(x){return x.trim()}).filter(Boolean);
  /* cidade/UF no final */
  var uf=-1;
  for(var k=toks.length-1;k>=0&&k>=toks.length-3;k--){var q=toks[k];var m=/^(.*?)\s*\/\s*([A-Za-z]{2})$/.exec(q);
    if(m&&UFS.indexOf(m[2].toUpperCase())>=0){o.cid=(m[1]?m[1]:(toks[k-1]||""))+"/"+m[2].toUpperCase();if(!m[1]&&toks[k-1])toks.splice(k-1,2);else toks.splice(k,1);uf=1;break}
    if(/^[A-Za-z]{2}$/.test(q)&&UFS.indexOf(q.toUpperCase())>=0&&k>0){o.cid=toks[k-1]+"/"+q.toUpperCase();toks.splice(k-1,2);uf=1;break}}
  if(uf<0&&toks.length>=3){var last=toks[toks.length-1];var m2=/^(.+?)\s+([A-Za-z]{2})$/.exec(last);if(m2&&UFS.indexOf(m2[2].toUpperCase())>=0){o.cid=m2[1]+"/"+m2[2].toUpperCase();toks.pop()}}
  if(toks.length===1){var w=toks[0].split(" "),cities=knownCities(),ci=-1,ncity=0;
    var nn=function(x){return String(x).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()};
    if(!o.cid&&w.length>1&&UFS.indexOf(w[w.length-1].toUpperCase())>=0){var ufx=w.pop().toUpperCase();var best=0;
      for(var L=Math.min(3,w.length-1);L>=1;L--){var cand=nn(w.slice(w.length-L).join(" "));if(cities[cand]){best=L;break}}
      if(!best)best=1;o.cid=w.slice(w.length-best).join(" ")+"/"+ufx;w=w.slice(0,w.length-best)}
    var ni=-1;for(var z=1;z<w.length;z++){if(/^(n[º°o]?\.?)?\d+[A-Za-z]?$/i.test(w[z])||/^s\/?n$/i.test(w[z])){ni=z;break}}
    if(ni>0){var cn=w[ni].replace(/^n[º°o]?\.?/i,"");var rest=w.slice(ni+1),cp=[];
      while(rest.length&&/^(apto?\.?|apartamento|ap\.?|sala|bloco|bl\.?|casa|cj\.?|conjunto|loja|andar|torre)$/i.test(rest[0])&&rest.length>1){cp.push(rest[0]+" "+rest[1]);rest=rest.slice(2)}
      toks=[w.slice(0,ni).join(" "),cn].concat(cp.length?cp:[]);if(rest.length)toks.push(rest.join(" "))}
    else toks=[w.join(" ")]}
  var CMP=/^(apto?\.?|apartamento|ap\.?|sala|bloco|bl\.?|casa|cj\.?|conjunto|loja|andar|torre|unidade|box|fundos)\b\s*(.*)$/i;
  var logr=[],bairro="",comp=[];
  toks.forEach(function(q,i){var cmp=CMP.exec(q);
    if(i===0){logr.push(q);return}
    var nc=/^(?:n[º°o]?\.?\s*)?(\d+[A-Za-z]?|s\/?n)\s+((?:apto?\.?|apartamento|ap\.?|sala|bloco|bl\.?|casa|cj\.?|conjunto|loja|andar|torre|unidade|box|fundos)\b.*)$/i.exec(q);
    if(nc&&logr.length===1){logr.push(nc[1]);comp.push(nc[2]);return}
    if(cmp){comp.push(q);return}
    if(/^(bairro|b\.)\s*:?\s*/i.test(q)){bairro=q.replace(/^(bairro|b\.)\s*:?\s*/i,"");return}
    if(/^(n[º°o]?\.?\s*)?\d+[A-Za-z]?$/i.test(q)||/^s\/?n$/i.test(q)||/^n[º°]\s*\S+$/i.test(q)){if(logr.length===1)logr.push(q.replace(/^n[º°o]?\.?\s*/i,""));else comp.push(q);return}
    if(!bairro)bairro=q;else if(!o.cid&&/^[A-Za-zÀ-ÿ' ]+$/.test(q))o.cid=q;else comp.push(q)});
  var l0=logr[0]||"";var nm=/^(.*\D)\s+(?:n[º°o]?\.?\s*)?(\d+[A-Za-z]?)$/i.exec(l0);if(logr.length===1&&nm){logr=[nm[1].replace(/[,\s]+$/,""),nm[2]]}
  o.end=logr.join(", ");if(bairro)o.bairro=bairro;if(comp.length)o.comp=comp.join(", ");
  if(!o.cid&&cidHint)o.cid=cidHint;return o}
function parseDados(txt){var L=String(txt).replace(/ /g," ").replace(/[*_~]/g,"").split(/\r?\n/),o={},sec="e",unl=[];
 var EV=[["ev",/^evento\b/i],["loc",/^local\b/i],["end_local",/^endere[cç]o do evento\b/i],["cid",/^cidade\b/i],["data",/^data\b/i],["hev",/^hor[aá]rio do evento/i],
 ["art",/^artista\b/i],["hap",/^hor[aá]rio da apresenta/i],["dur",/^dura[cç][aã]o/i],["eqp",/^equipamento/i],["eqq",/^se sim/i]];
 var CT=[["ct_nome",/^(contratante|raz[aã]o social|nome(?: completo)?|nome\/raz[aã]o social)\b/i],["ct_doc",/^(cpf\s*\/?\s*cnpj|cnpj\s*\/?\s*cpf|cpf|cnpj)\b/i],["ct_rep",/^(representante|respons[aá]vel|quem assina|signat[aá]rio)/i],
  ["ct_end",/^(endere[cç]o|logradouro|rua)\b/i],["ct_num",/^(n[uú]mero|n[º°]|num)\b/i],["ct_comp",/^(complemento|apto?|apartamento|sala|bloco)\b/i],["ct_bairro",/^bairro\b/i],["ct_cid",/^(cidade|munic[ií]pio)\b/i],["ct_uf",/^(estado|uf)\b/i],["ct_cep",/^cep\b/i],["ct_email",/^e-?mail\b/i],["ct_tel",/^(telefone|celular|whats(?:app)?|fone|tel)\b/i]];
 function lab(l,list){for(var i=0;i<list.length;i++){var m=list[i][1].exec(l);if(m){var rest=l.slice(m[0].length);var mm=/^[^:]*:\s*(.*)$/.exec(rest);if(mm)return[list[i][0],mm[1].trim(),true];if(/^\s*[-–]\s*\S/.test(rest))return[list[i][0],rest.replace(/^\s*[-–]\s*/,"").trim(),true];if(!rest.trim())return[list[i][0],"",true]}}return null}
 var pend=null;
 L.forEach(function(l0){var l=l0.trim().replace(/^[\-•●▪•\s]+/,"");if(!l)return;
   if(/^dados do contratante/i.test(l)||/^contratante\s*$/i.test(l)&&!/:/.test(l)){sec="c";return}
   if(/^dados do evento/i.test(l)){sec="e";return}
   if(/^dados para elabora/i.test(l))return;
   var r=/^endere[cç]o do evento/i.test(l)?lab(l,EV):lab(l,sec==="c"?CT.concat(EV):EV.concat(CT));
   if(r){if(r[0]==="ct_end"&&sec==="e"&&!/^endere[cç]o completo/i.test(l))r=null;
     else if(r[0]==="ct_cid"&&sec==="e")r[0]="cid";
     else if(r[0]==="ct_nome"&&sec==="e"&&!/^contratante/i.test(l))r=null}
   if(r){pend=null;if(r[1]){if(o[r[0]]===undefined)o[r[0]]=r[1]}else pend=r[0];return}
   if(pend){if(o[pend]===undefined)o[pend]=l;pend=null;return}
   unl.push(l)});
 /* linhas sem rótulo: classifica pelo conteúdo */
 var nd=function(x){return String(x).replace(/\D/g,"")},cpfOk=function(x){x=nd(x);if(x.length!==11||/^(\d)\1+$/.test(x))return false;for(var t=9;t<11;t++){var s=0;for(var i=0;i<t;i++)s+=+x[i]*(t+1-i);if((s*10%11)%10!==+x[t])return false}return true};
 unl.forEach(function(l){var d=nd(l),only=!/[A-Za-zÀ-ÿ]/.test(l);
   if(/@/.test(l)){var em=/[\w.+\-]+@[\w\-]+(?:\.[\w\-]+)+/.exec(l);if(em&&!o.ct_email)o.ct_email=em[0];return}
   if(only&&(d.length===14||(d.length===11&&(cpfOk(d)||/[.\-]/.test(l)&&!/\(/.test(l)))&&!o.ct_doc)){if(!o.ct_doc){o.ct_doc=l;return}}
   if(only&&d.length>=10&&d.length<=13&&!o.ct_tel){o.ct_tel=l;return}
   if(only&&d.length===8&&!o.ct_cep&&/^\d{5}-?\d{3}$/.test(l.trim())){o.ct_cep=l.trim();return}
   if(!only&&!o.ct_end&&(/\d/.test(l)||/^(r\.?|av\.?|rua|avenida|travessa|tv\.?|rodovia|rod\.?|estrada|servid[aã]o|alameda|al\.?|beco|largo|pra[cç]a)\s/i.test(l))&&/\s/.test(l)){o.ct_end=l;return}
   if(!only&&!o.ct_nome&&!/\d/.test(l)&&/^[A-Za-zÀ-ÿ&.'\- ]+$/.test(l)&&l.split(/\s+/).length>=2&&l.length<80){o.ct_nome=l}});
 /* campos soltos: CPF/CNPJ, e-mail, telefone, CEP em qualquer lugar do texto */
 var all=String(txt);
 if(!o.ct_doc){var dm=/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/.exec(all)||/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/.exec(all);if(dm)o.ct_doc=dm[0]}
 if(!o.ct_email){var em=/[\w.+\-]+@[\w\-]+(?:\.[\w\-]+)+/.exec(all);if(em)o.ct_email=em[0]}
 return o}
function applyDados(){if(!cur)return;var d=parseDados($("cpaste").value),ov=OV[key(cur.a,cur.p.n)]||(OV[key(cur.a,cur.p.n)]={}),n=0;
  function put(k,v){if(v!==undefined&&v!==""){ov[k]=v;n++}}
  ["ev","loc","end_local"].forEach(function(k){put(k,d[k])});
  if(d.cid)put("cid",fmtCidUF(d.cid));
  if(d.ct_nome)put("ct_nome",smartCase(d.ct_nome));
  if(d.ct_doc)put("ct_doc",fmtDoc(d.ct_doc));
  var kd=kindDoc(d.ct_doc);
  if(d.ct_rep&&kd!=="cpf"&&repOk(d.ct_rep))put("ct_rep",smartCase(d.ct_rep));else if(kd==="cpf")ov.ct_rep="";
  if(d.ct_email)put("ct_email",String(d.ct_email).trim().toLowerCase().replace(/[,.;]+$/,""));
  if(d.ct_tel)put("ct_tel",fmtTel(d.ct_tel));
  /* endereço: separa logradouro, bairro, complemento, cidade e CEP */
  var ad=d.ct_end;if(ad&&d.ct_num&&!/\d/.test(ad))ad+=", "+d.ct_num;
  var extra=[];if(d.ct_comp)extra.push(d.ct_comp);if(d.ct_bairro)extra.push("bairro "+d.ct_bairro);
  var cidx=d.ct_cid?(d.ct_uf&&!/\/|\b[A-Z]{2}$/.test(d.ct_cid)?d.ct_cid+"/"+d.ct_uf:d.ct_cid):"";
  var rawAd=[d.ct_end,d.ct_num,d.ct_comp,d.ct_bairro,d.ct_cid,d.ct_uf,d.ct_cep].filter(Boolean).join(" | ");
  if(ad||extra.length||cidx||d.ct_cep){
    var sp=splitEnd([ad].concat(extra).concat(cidx?[cidx]:[]).concat(d.ct_cep?["CEP "+d.ct_cep]:[]).filter(Boolean).join(", "));
    ov.ct_end=expandTipo(smartCase(sp.end||""));ov.ct_bairro=smartCase(sp.bairro||"");ov.ct_comp=sp.comp||"";ov.ct_cid=sp.cid?(function(c){var q=fmtCidUF(c).split("/");return cityUF(smartCase(q[0])+(q[1]?"/"+q[1].toUpperCase():""))})(sp.cid):"";ov.ct_cep=sp.cep||"";n++}
  var hv=hhmm2(d.hev);if(hv.length){put("hi",hv[0]);if(hv[1])put("hf",hv[1])}
  var ha=hhmm2(d.hap);if(ha.length){put("ini",ha[0]);if(ha[1])put("ini_fim",ha[1])}
  if(d.dur){var m=/(\d+)\s*h(?:oras?)?\s*(?:e\s*)?(\d+)?/i.exec(d.dur)||/(\d+)[,.]5\s*h/i.exec(d.dur);if(m){var hh=+m[1],mm=m[2]?+m[2]:(/[,.]5/.test(d.dur)?30:0);put("dur",hh+":"+pad(mm,2))}}
  if(/n[aã]o/i.test(d.eqp||"")===false&&/sim/i.test(d.eqp||"")&&d.eqq)ov.o_obs_eq=d.eqq;
  buildForms();buildCForm();renderSum();renderAll();$("cpmsg").textContent=n?n+" campos preenchidos. Confira antes de baixar.":"Nenhum campo reconhecido no texto.";if(n){autoAddr(n,rawAd);autoEnd(0)}}
/* abreviações de logradouro → por extenso */
function expandTipo(s){s=String(s||"").trim();var M=[[/^(r|r\.)\s+/i,"Rua "],[/^(av|av\.|avda\.?|avd\.?)\s+/i,"Avenida "],[/^(rod|rod\.)\s+/i,"Rodovia "],[/^(tv|tv\.|trav|trav\.)\s+/i,"Travessa "],[/^(al|al\.)\s+/i,"Alameda "],[/^(est|est\.|estr|estr\.)\s+/i,"Estrada "],[/^(pr[cç]a?|pr[cç]\.|p[cç]a?\.)\s+/i,"Praça "],[/^(serv|serv\.|srv\.?)\s+/i,"Servidão "],[/^(lgo|lgo\.)\s+/i,"Largo "],[/^(cam|cam\.)\s+/i,"Caminho "],[/^(prof|prof\.)\s+/i,"Professor "]];
  for(var i=0;i<M.length;i++){if(M[i][0].test(s)){s=s.replace(M[i][0],M[i][1]);break}}
  s=s.replace(/\b(Prof|Profa|Dr|Dra|Eng|Pres|Gov|Cel|Cap|Min|Dep|Des)\.?\s+(?=[A-ZÀ-Ý])/g,function(m,k){var x={Prof:"Professor",Profa:"Professora",Dr:"Doutor",Dra:"Doutora",Eng:"Engenheiro",Pres:"Presidente",Gov:"Governador",Cel:"Coronel",Cap:"Capitão",Min:"Ministro",Dep:"Deputado",Des:"Desembargador"};return x[k]+" "});
  return s.replace(/,\s*(?:n[º°o]?\.?\s*)?(s\/?n|sem n[uú]mero)\s*$/i,", s/n").replace(/,\s*n[º°o]\.?\s*(\d)/i,", $1")}
var _adBusy=0;
function autoAddr(n,raw){var r=cur_();if(!r||!raw||_adBusy||!cur){autoCep(n);return}
  var a=cur.a,pn=cur.p.n,msg=$("cpmsg"),base=n+" campos preenchidos. Confira antes de baixar. ",hadCep=!!r.ct_cep;
  _adBusy=1;msg.textContent=base+"Interpretando endereço e buscando CEP…";
  (async function(){var ok=0;try{var sm=await claude.use("sample");if(!sm)return;
    var q="Você é um assistente de cadastro de endereços brasileiros. Abaixo está o endereço do CONTRATANTE exatamente como ele enviou (pode estar bagunçado, com abreviações, ordem trocada, sem rótulos, tudo numa linha, com CEP faltando ou errado).\n\nTEXTO ORIGINAL:\n"+raw+"\n\nCidade do evento (apenas pista caso o texto não traga cidade): "+(r.cid||"não informada")+"\nCEP informado pelo contratante: "+(r.ct_cep||"nenhum")+"\n\nTarefa: interprete, normalize e complete. Regras: tipo do logradouro por extenso (Rua, Avenida, Rodovia, Travessa, Servidão...); nomes em Caixa Alta e Baixa corretos (Professor, de, da, dos em minúsculas); número separado do logradouro (use \"s/n\" se for sem número); complemento (apto, bloco, sala, casa, condomínio, referência) separado; bairro; cidade com acentos corretos; UF com 2 letras (se faltar, deduza pela cidade). CEP: se o contratante informou um CEP válido de 8 dígitos, mantenha-o; senão dê o CEP exato que você conhece para a rua/número; se só souber o da rua, dê o geral da rua; se a rua for desconhecida, o mais provável do bairro; null só se não houver estimativa razoável. Nunca invente rua ou número que não esteja no texto.\nResponda SOMENTE JSON: {\"logradouro\":\"Rua Exemplo\",\"numero\":\"123\",\"complemento\":\"Apto 4\" ou \"\",\"bairro\":\"Centro\" ou \"\",\"cidade\":\"Florianópolis\",\"uf\":\"SC\",\"cep\":\"00000-000\" ou null,\"cep_origem\":\"informado\"|\"exato\"|\"da rua\"|\"do bairro\",\"confianca\":\"alta\"|\"media\"|\"baixa\"}";
    var res=await sm.json(q,{modelTier:"default",cache:false});
    if(!res||!res.logradouro)return;
    if(!(cur&&cur.a===a&&cur.p.n===pn)){ok=1;return}
    var o=OV[key(a,pn)]||(OV[key(a,pn)]={});
    var lg=expandTipo(String(res.logradouro).trim()),nu=String(res.numero||"").replace(/^n[º°o]?\.?\s*/i,"").trim();
    o.ct_end=lg+(nu?", "+nu:"");
    o.ct_bairro=String(res.bairro||"").trim();
    o.ct_comp=String(res.complemento||"").trim();
    if(res.cidade){o.ct_cid=fmtCidUF(String(res.cidade).trim()+(res.uf?"/"+String(res.uf).trim().toUpperCase():""))}
    var c=String(res.cep||"").replace(/\D/g,""),kc=cepLookup({ct_end:o.ct_end,ct_cid:o.ct_cid||r.cid}),how="";
    if(hadCep){how="CEP informado pelo contratante"}
    else if(kc){o.ct_cep=kc;how="CEP "+kc+" (base do Booker)"}
    else if(c.length===8){o.ct_cep=c.slice(0,5)+"-"+c.slice(5);how="CEP "+o.ct_cep+" estimado pelo Claude ("+(res.cep_origem||"estimado")+", confiança "+(res.confianca||"média")+")"}
    else how="CEP não localizado: use o link Buscar CEP";
    buildCForm();renderSum();renderAll();
    msg.textContent=base+"Endereço interpretado e organizado. "+how+". Confira antes de baixar.";ok=1;
  }catch(e){}finally{_adBusy=0;if(!ok)autoCep(n)}})()}
/* CEPs conferidos (cidade|logradouro sem acento e sem prefixo → CEP); [CEP, nº inicial, nº final] opcionais */
var CEPDB={"florianopolis|goiabas":["88052-800"],"florianopolis|professora maria flora pausewang":["88036-800"],"florianopolis|sebastiao laurentino da silva":["88037-400"]};
function cepKey(c,s){var n=function(x){return String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim()};
  s=n(s).replace(/^(rua|r|avenida|av|travessa|tv|rodovia|rod|estrada|est|servidao|alameda|al|beco|largo|praca|pca|caminho|cam|acesso|marginal)\s+/,"");return n(String(c).split("/")[0])+"|"+s}
function cepLookup(r){var m=/^(.*?)(?:,\s*(\d+))?\s*$/.exec(String(r.ct_end||"")),k=cepKey(r.ct_cid,m[1]),e=CEPDB[k];if(!e)return"";
  var num=m[2]?+m[2]:null,L=Array.isArray(e[0])?e:[e];for(var i=0;i<L.length;i++){var x=L[i];if(!x[1]||num===null||(num>=x[1]&&num<=(x[2]||99999)))return x[0]}return""}
var _endBusy=0;
function autoEnd(force){var r=cur_();if(!r||!r.loc||_endBusy||(!force&&r.end_local))return;var a=cur.a,pn=cur.p.n,ms=$("endmsg");
  function say(x){if($("endmsg"))$("endmsg").textContent=x;else if($("cpmsg"))$("cpmsg").textContent=x}
  _endBusy=1;say("Buscando endereço…");
  (async function(){try{var sm=await claude.use("sample");if(!sm){say("Busca indisponível.");return}
    var q="Qual é o endereço do local de eventos \""+r.loc+"\""+(r.ev&&r.ev!==r.loc?" (evento: "+r.ev+")":"")+" em "+(r.cid||"cidade não informada")+", Brasil? Responda somente com JSON {\"end\":\"Logradouro, número, bairro NOME DO BAIRRO\" ou null,\"confianca\":\"alta\"|\"media\"|\"baixa\"}. Escreva o tipo do logradouro por extenso (Rua, Avenida, Rodovia). Use null se não conhecer o local; nunca invente.";
    var res=await sm.json(q,{modelTier:"default",cache:false});var e=res&&String(res.end||"").trim();
    if(cur&&cur.a===a&&cur.p.n===pn){if(e&&e!=="null"){var o=OV[key(a,pn)]||(OV[key(a,pn)]={});o.end_local=e;var f=$("f_end_local");if(f)f.value=e;renderSum();renderAll();say("Endereço sugerido pelo Claude (confiança "+(res.confianca||"média")+"): confira antes de baixar.")}
      else say("O Claude não conhece esse local: preencha manualmente.")}
  }catch(er){say("Endereço não preenchido ("+((er&&(er.code||er.message))||"erro")+").")}finally{_endBusy=0}})()}
var _cepBusy=0;
function autoCep(n,force){var r=cur_();if(!r||(!force&&r.ct_cep)||!r.ct_end||!r.ct_cid||_cepBusy)return;var a=cur.a,pn=cur.p.n,msg=$("cpmsg"),base=n?n+" campos preenchidos. Confira antes de baixar. ":"";
  var kc=cepLookup(r);if(kc){var o0=OV[key(a,pn)]||(OV[key(a,pn)]={});o0.ct_cep=kc;buildCForm();renderSum();renderAll();msg.textContent=base+"CEP "+kc+" encontrado na base do Booker.";return}
  _cepBusy=1;msg.textContent=base+"Buscando CEP…";
  (async function(){try{var sm=await claude.use("sample");if(!sm){/* GitHub: busca nos Correios (ViaCEP) */
      var cc=String(r.ct_cid||"").split(/\s*[\/\-]\s*/),cid=cc[0]||"",uf=(cc[1]||"").trim().toUpperCase(),rua=String(r.ct_end||"").split(",")[0].replace(/^\s+|\s+$/g,"").replace(/\s+n[ºo°.]?\s*\d.*$/i,"");
      if(!cid||uf.length!==2||rua.length<3){msg.textContent=base+"CEP não preenchido (endereço incompleto para buscar nos Correios).";return}
      var L=await (await fetch("https://viacep.com.br/ws/"+uf+"/"+encodeURIComponent(cid)+"/"+encodeURIComponent(rua)+"/json/")).json();
      var nb=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),bz=nb(r.ct_bairro),hit=Array.isArray(L)&&L.length?(bz&&L.find(x=>nb(x.bairro)===bz))||L[0]:null;
      if(cur&&cur.a===a&&cur.p.n===pn){if(hit&&hit.cep){var o2=OV[key(a,pn)]||(OV[key(a,pn)]={});o2.ct_cep=hit.cep;buildCForm();renderSum();renderAll();msg.textContent=base+"CEP "+hit.cep+" encontrado nos Correios ("+hit.logradouro+(hit.bairro?", "+hit.bairro:"")+(L.length>1?"; "+L.length+" CEPs nessa rua — confira o número":"")+")."}
        else msg.textContent=base+"Correios não encontraram o CEP dessa rua: use o link Buscar CEP."}
      return}
    var q="Qual é o CEP deste endereço brasileiro? Endereço: "+[r.ct_end,r.ct_comp,r.ct_bairro,r.ct_cid].filter(Boolean).join(", ")+". Dê o CEP exato se souber; se não souber o do número, dê o CEP geral da rua; se a rua for desconhecida, o CEP mais provável do bairro. Responda somente com JSON no formato {\"cep\":\"00000-000\" ou null,\"confianca\":\"alta\"|\"media\"|\"baixa\"}. Use null apenas se não houver nenhuma estimativa razoável.";
    var res=await sm.json(q,{modelTier:"default",cache:false});var c=res&&String(res.cep||"").replace(/\D/g,"");
    if(cur&&cur.a===a&&cur.p.n===pn){if(c&&c.length===8){var o=OV[key(a,pn)]||(OV[key(a,pn)]={});o.ct_cep=c.slice(0,5)+"-"+c.slice(5);buildCForm();renderSum();renderAll();msg.textContent=base+"CEP "+o.ct_cep+" sugerido pelo Claude (confiança "+(res.confianca||"média")+"): confira antes de baixar."}
      else msg.textContent=base+"O Claude não soube estimar o CEP: use o link Buscar CEP."}
  }catch(e){msg.textContent=base+"CEP não preenchido ("+((e&&(e.code||e.message))||"erro")+")."}finally{_cepBusy=0}})()}

/* ---------- textos ---------- */
var CAL={"Cadu Vieira":"Cadu Vieira DJ | DROM","Brinquinho":"DJ Brinquinho SC | DROM"};
function calName(a){return CAL[a]||("DJ "+a+" | DROM")}
function agendaTitulo(r,a){var ev=(r.ev||"").trim(),lo=(r.loc||"").trim(),m=[];if(ev)m.push(ev);if(lo&&lo.toLowerCase()!==ev.toLowerCase())m.push(lo);return a+" - "+m.join(" - ")+(r.cid?" ("+r.cid+")":"")}
function agendaDesc(r,a){
  var l=r.liq!==undefined?num(r.liq):num(r.cach)-num(r.desp);
  var c=r.com!==undefined?Math.round(num(r.com)*1000)/10:"";
  return["Cachê: "+money(r.cach),"Comissão: "+(c===""?"-":c+"%"),"Duração: "+(r.dur||"-"),"Rider Hospitalidade: "+(r.rid||"-"),"Equipamento: "+(r.eq||"-"),"Hospedagem: "+(r.hosp||"-")+(r.hosp&&!/^(n[aã]o|-)$/i.test(String(r.hosp).trim())&&Number(r.prod)>0?" ("+(Number(r.prod)+1)+" pessoas)":""),"Produção: "+(prodFmt(r.prod)||"-"),"Pagamento: "+(r.pg_forma||"PREENCHER"),"Contratante: "+(r.cont||"-"),"Contato: "+(r.tel||"-"),"Contrato: "+(r.ctr||"-"),"Número da proposta: "+numero(r,a),"Obs.: "+(r.obs||"-")].join("\n")}
function dataExt(r){return br(r.dt)+(r.dow?", "+r.dow:"")}
function evHorario(r){return r.hi&&r.hf?r.hi+" "+asH(r.hf)+" "+r.hf:"a definir"}
function riderTxt(r,a){var t=opt(r,a,"rt"),c=parLines(parGet(a,"Rider Técnico"));
  if(t==="A"||t==="B"){var q=parLines(String(((BASE[a]||{}).par||{})._equip_comum||"").replace(/^Caso o evento[^\n]*\n/,"").replace(/^Mínimo recomendado:\n/,""));if(q.length)return q.join("\n")}
  return c.length?c.join("\n"):"Sonorização para atendimento ao público\n01 Caixa de retorno\n01 Microfone sem fio\n01 Telão em proporção 16:9 (recomendado)\n02 Cabos XLR\n01 Mesa/Praticável\n02 Tomadas de energia elétrica"}
function fxTxt(a){return parLines(parGet(a,"Rider de efeitos")).join("\n")}
function rhTxt(r,a){var l=rhLines(r,a);return l?l.join("\n"):"Sem exigências, bastando o acesso às mesmas opções de alimentação e bebidas do evento."}
function waProposta(r,a){var X=ctxOf(r,a),d=opt(r,a,"desp"),pay=opt(r,a,"pag"),n=prodN(r),o=[],p1=opt(r,a,"p1pct")||String(splitPct(pay)||50);
  o.push("*"+nome(a)+" - Proposta Nº "+numero(r,a)+"*","");
  if(X.ev&&X.ev!==(r.loc||"").trim())o.push("Evento: "+X.ev);
  if(r.loc)o.push("Local: "+r.loc);
  o.push("Cidade: "+(r.cid||""),"Data: "+dataExt(r),"","Horário de início da apresentação: "+X.ini,"Duração da apresentação: "+X.dur,"","*Investimento:* "+X.valor);
  if(splitPct(pay))o.push("Pagamento conforme o seguinte cronograma:","● "+p1+"% até "+(opt(r,a,"dias")||"7")+" dias após a aprovação da proposta;","● "+(100-p1)+"% até 12 horas antes da apresentação.");
  else o.push("_Pagamento integral "+{int12:"até 12 horas antes da apresentação",inicio:"no dia do evento",pos:"em até um dia útil após a apresentação"}[pay]+"._");
  if(d!=="inc")o.push("*Hospedagem:* necessária para "+pad(n,2)+" pessoas"+(d==="terr_aereo"?" (e deslocamento aéreo)":""));
  o.push(d==="inc"?"_Despesas de transporte e hospedagem inclusas._":d==="sem_hosp"?"_Despesas de transporte inclusas._":"_Despesas de deslocamento terrestre inclusas._","");
  if(opt(r,a,"rt")!=="N")o.push("*Rider Técnico (responsabilidade do contratante):*",riderTxt(r,a),"");
  if(opt(r,a,"fx")==="sim"&&fxTxt(a))o.push("*Rider de Efeitos (responsabilidade do contratante):*",fxTxt(a),"");
  o.push("*Rider de Hospitalidade:*",rhTxt(r,a),"","*Validade da proposta: "+(opt(r,a,"vwa")||"7")+" dias.*");
  return o.join("\n")}
function waArtista(r,a){var B=BASE[a]||{};
  return["*✅ Show Confirmado - "+a+"*","Local: "+(r.loc||""),"Data: "+dataExt(r),"Horário de início: "+(r.ini||"a definir"),"Duração: "+durFmt(r.dur),"Cachê: "+money(r.cach),"Rider: "+(r.rid||"-"),"Chave PIX: "+(B.pix||"-"),"Presskit: "+(B.pk||"-")].join("\n")}
function calLink(r,a){
  var t=agendaTitulo(r,a),d=agendaDesc(r,a),loc=[r.loc,r.cid].filter(Boolean).join(", ");
  var dates="",m=/^(\d+):(\d+)$/.exec(r.ini||"");
  if(r.dt&&m){var h=+m[1],mi=+m[2];var dt=new Date(r.dt+"T00:00:00Z");if(h<12)dt.setUTCDate(dt.getUTCDate()+1);dt.setUTCHours(h,mi,0,0);
    var en=new Date(dt.getTime()+durCal(r.dur)*60000);
    var f=function(x){return x.getUTCFullYear()+pad(x.getUTCMonth()+1,2)+pad(x.getUTCDate(),2)+"T"+pad(x.getUTCHours(),2)+pad(x.getUTCMinutes(),2)+"00"};
    dates=f(dt)+"/"+f(en);$("ag-i").textContent="Início "+br(dt.toISOString().slice(0,10))+" "+pad(h,2)+":"+pad(mi,2)+", duração "+durFmt(r.dur)}
  else if(r.dt){var d1=r.dt.replace(/-/g,""),n=new Date(r.dt+"T00:00:00Z");n.setUTCDate(n.getUTCDate()+1);dates=d1+"/"+n.toISOString().slice(0,10).replace(/-/g,"");$("ag-i").textContent="Horário a definir: evento de dia inteiro"}
  return"https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(t)+"&details="+encodeURIComponent(d)+"&location="+encodeURIComponent(loc)+"&dates="+dates+"&ctz=America%2FSao_Paulo"}

/*ENGINE*/
/* ================= Motor dos modelos .docx ================= */
var WNS="http://schemas.openxmlformats.org/wordprocessingml/2006/main";
var RNS="http://schemas.openxmlformats.org/officeDocument/2006/relationships";
var ANS="http://schemas.openxmlformats.org/drawingml/2006/main";
var WPNS="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing";
var MESES=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
var UN=["zero","um","dois","três","quatro","cinco","seis","sete","oito","nove","dez","onze","doze","treze","quatorze","quinze","dezesseis","dezessete","dezoito","dezenove"];
var DZ=["","","vinte","trinta","quarenta","cinquenta","sessenta","setenta","oitenta","noventa"];
var CT=["","cento","duzentos","trezentos","quatrocentos","quinhentos","seiscentos","setecentos","oitocentos","novecentos"];
function asH(h){return /^\s*(0?[01]|24)\s*(:|h|$)/i.test(String(h||""))?"à":"às"}
function e999(n){if(n===100)return"cem";var c=Math.floor(n/100),r=n%100,p=[];if(c)p.push(CT[c]);if(r){if(r<20)p.push(UN[r]);else{var d=Math.floor(r/10),u=r%10;p.push(DZ[d]+(u?" e "+UN[u]:""))}}return p.join(" e ")}
function eN(n){if(n===0)return"zero";var mi=Math.floor(n/1e6),m=Math.floor(n/1000)%1000,u=n%1000,p=[];
  if(mi)p.push(e999(mi)+(mi===1?" milhão":" milhões"));if(m)p.push(m===1?"mil":e999(m)+" mil");
  if(u){var last=e999(u);if(p.length&&(u<100||u%100===0))p.push("e "+last);else p.push(last)}
  return p.join(" ")}
function extReais(v){var n=Math.round(num(v)*100),re=Math.floor(n/100),ce=n%100;var s=eN(re)+(re===1?" real":(re%1e6===0&&re>0?" de reais":" reais"));if(ce)s+=" e "+eN(ce)+(ce===1?" centavo":" centavos");return s}
function numP(n){n=Number(n);return pad(n,2)+" ("+eN(n)+")"}
function dataLonga(iso){var p=String(iso).split("-");return(+p[2])+" de "+MESES[+p[1]-1]+" de "+p[0]}

function ELs(n,t){return Array.prototype.slice.call(n.getElementsByTagNameNS(WNS,t))}
function kid(n,t){for(var c=n.firstElementChild;c;c=c.nextElementSibling)if(c.localName===t)return c;return null}
function ptxt(p){return ELs(p,"t").map(function(t){return t.textContent}).join("")}
function isBlank(p){return p.localName==="p"&&!ptxt(p).trim()&&!p.getElementsByTagNameNS(WNS,"drawing").length&&!p.getElementsByTagNameNS(WNS,"sectPr").length}
function fp(root,starts){var ps=ELs(root,"p");for(var i=0;i<ps.length;i++)if(ptxt(ps[i]).replace(/^\s+/,"").indexOf(starts)===0)return ps[i];return null}
function mkRun(doc,o){var r=doc.createElementNS(WNS,"w:r"),rp=doc.createElementNS(WNS,"w:rPr");
  if(o.b)rp.appendChild(doc.createElementNS(WNS,"w:b"));if(o.i)rp.appendChild(doc.createElementNS(WNS,"w:i"));
  if(o.hl){var h=doc.createElementNS(WNS,"w:highlight");h.setAttributeNS(WNS,"w:val","yellow");rp.appendChild(h)}
  if(rp.firstChild)r.appendChild(rp);
  var t=doc.createElementNS(WNS,"w:t");t.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:space","preserve");t.textContent=o.t;r.appendChild(t);return r}
function setRuns(p,parts){var doc=p.ownerDocument;Array.prototype.slice.call(p.childNodes).forEach(function(c){if(c.localName!=="pPr")p.removeChild(c)});
  parts.forEach(function(o){if(o.t!==""&&o.t!==undefined)p.appendChild(mkRun(doc,o))})}
function ph(){return{t:"[PREENCHER]",hl:1}}
function vp(v,o){v=v===undefined||v===null?"":String(v).trim();if(!v)return ph();var x={t:v};if(o)for(var k in o)x[k]=o[k];return x}
function rmP(p){if(!p||!p.parentNode)return;var n=p.nextElementSibling;var par=p.parentNode;par.removeChild(p);if(n&&isBlank(n)&&n.parentNode===par&&n.localName==="p")par.removeChild(n)}
function rmOnly(p){if(p&&p.parentNode)p.parentNode.removeChild(p)}
function repIn(p,re,to){var s=ptxt(p);if(!re.test(s))return false;var rr=ELs(p,"r").filter(function(r){return kid(r,"t")})[0];var rp=rr&&kid(rr,"rPr");
  var n=s.replace(re,to);Array.prototype.slice.call(p.childNodes).forEach(function(c){if(c.localName!=="pPr")p.removeChild(c)});
  var r=p.ownerDocument.createElementNS(WNS,"w:r");if(rp)r.appendChild(rp.cloneNode(true));var t=p.ownerDocument.createElementNS(WNS,"w:t");t.setAttributeNS("http://www.w3.org/XML/1998/namespace","xml:space","preserve");t.textContent=n;r.appendChild(t);p.appendChild(r);return true}
function stripRed(root){ELs(root,"color").forEach(function(c){var v=(c.getAttributeNS(WNS,"val")||"").toUpperCase();if(v&&v!=="000000"&&v!=="AUTO"){var rp=c.parentNode;rp.removeChild(c);["b","bCs"].forEach(function(t){var e=kid(rp,t);if(e)rp.removeChild(e)})}})}
function cloneAfter(p,parts){var n=p.cloneNode(true);p.parentNode.insertBefore(n,p.nextSibling);setRuns(n,parts);return n}

/* ---------- opções do documento ---------- */
function splitPct(p){return p==="5050"?50:p==="3070"?30:0}
function opt(r,a,k){var o=r["o_"+k];if(o!==undefined&&o!=="")return o;
  var h=r.hosp||"",eq=r.eq||"";
  switch(k){case"pag":return r.dsin?"5050":"int12";case"desp":return h==="Contratante"?"sem_hosp":"inc";
   case"rt":return eq==="2CDJ+Mixer"?"A":eq==="LEVAR"?"C":"B";
   case"rh":return/completo/i.test(r.rid||"")?"completo":"padrao";
   case"payee":return"artista";case"fx":return"nao";case"dias":return"7";case"vform":return"30";case"vwa":return"7";
   case"docdata":return TODAY;case"p1data":return r.dsin||"";case"rhtxt":return r.rid||"";}
  return""}
function parGet(a,pre,i){var P=(BASE[a]||{}).par||{};for(var k in P)if(k.indexOf(pre)===0){var v=P[k][i||0];if(v)return String(v)}return""}
function parLines(s){return String(s||"").split("\n").map(function(x){return x.trim()}).filter(Boolean)}
function rhLines(r,a,o){var B=BASE[a]||{},m=opt(r,a,"rh");
  if(m==="univ")return parLines(parGet(a,"Rider de Hospitalidade",1).replace(/^Universit[^\n]*\n/i,""));
  if(m==="social")return parLines(parGet(a,"Eventos Sociais"));
  if(m==="completo")return parLines(parGet(a,"Rider de Hospitalidade")||B.rh);
  if(m==="local")return String(B.rl||"").split("\n").filter(Boolean);
  if(m==="custom")return String(opt(r,a,"rhtxt")).split("\n").filter(Boolean);
  return null}
function iniC(r){if(!r.ini)return"a definir";var m=/^(\d{1,2}):(\d{2})$/.exec(String(r.ini).trim()),fim=r.ini_fim;
  if(!fim&&m&&r.dur){var d=/^(\d+):(\d+)$/.exec(r.dur);if(d){var tot=((+m[1])*60+ +m[2]+(+d[1])*60+ +d[2])%1440;fim=String(Math.floor(tot/60)).padStart(2,"0")+":"+String(tot%60).padStart(2,"0")}}
  var s=r.ini+(fim?" "+asH(fim)+" "+fim:"");
  if(!r.hi&&!r.hf&&m&&+m[1]<12&&r.dt){var x=new Date(r.dt+"T00:00:00Z");x.setUTCDate(x.getUTCDate()+1);s+=" ("+String(x.getUTCDate()).padStart(2,"0")+"/"+String(x.getUTCMonth()+1).padStart(2,"0")+")"}
  return s}
function prodN(r){var n=Number(r.prod);return n>0?n+1:3}
function ctxOf(r,a){var B=BASE[a]||{},c=B.cad||{};
  return{ev:(r.ev||r.loc||"").trim(),loc:r.loc,cid:r.cid,data:br(r.dt)+(r.dow?", "+r.dow:""),hev:evHorario(r),
   ini:r.ini?r.ini+(r.ini_fim?" "+asH(r.ini_fim)+" "+r.ini_fim:""):"a definir",iniC:iniC(r),semHev:!r.hi&&!r.hf,dur:durFmt(r.dur),end:r.end_local,valor:money(r.cach),ext:"("+extReais(r.cach)+")",n:prodN(r),
   dd:opt(r,a,"docdata")}}

/* ---------- Proposta ---------- */
function fillProposta(doc,r,a){var X=ctxOf(r,a),root=doc.documentElement,B=BASE[a]||{};
  stripRed(root);femin(root,a);
  function lab(st,l,v){var p=fp(root,st);if(p)setRuns(p,[{t:l,b:1},vp(v)])}
  var bodyEl=root.getElementsByTagNameNS(WNS,"body")[0],kids=Array.prototype.slice.call(bodyEl.children),lg=[];
  for(var qi=0;qi<kids.length;qi++){var q=kids[qi];if(q.localName==="p"&&ptxt(q).indexOf("PROPOSTA DE APRESENTA")===0)break;if(q.localName==="p"&&q.getElementsByTagNameNS(WNS,"drawing").length)lg.push(q)}
  var li=["Ramonstro","Carloto","Sena","Cenoura","Maneira","Amaro","Josu","Cadu Vieira"].indexOf(a);lg.forEach(function(q,i){if(i!==li)rmOnly(q)});
  var p0=fp(root,"Nome do evento");if(p0)setRuns(p0,[vp(X.ev,{b:1})]);
  lab("Local:","Local: ",X.loc);lab("Endereço:","Endereço: ",X.end);lab("Cidade:","Cidade: ",X.cid);lab("Data:","Data: ",X.data);lab("Horário do evento:","Horário do evento: ",X.hev);
  lab("Horário da apresentação:","Horário da apresentação: ",X.ini);lab("Duração da apresentação:","Duração da apresentação: ",X.dur);
  var d=opt(r,a,"desp"),intro=fp(root,"Para o presente evento");
  if(intro){var t={inc:"Para o presente evento é proposto o seguinte cachê, já incluindo as despesas com transporte e hospedagem do artista e equipe:",
     sem_hosp:"Para o presente evento é proposto o seguinte cachê, já incluindo as despesas com transporte do artista e equipe:",
     terr_aereo:"Para o presente evento é proposto o seguinte cachê, já incluindo as despesas com deslocamento terrestre do artista e equipe:"}[d];setRuns(intro,[{t:t}])}
  var pr=fp(root,"R$");if(pr)setRuns(pr,[{t:X.valor+" "+X.ext,b:1}]);
  if(pr&&d!=="inc"){var txt=d==="sem_hosp"?"A hospedagem para "+numP(X.n)+" pessoas (artista e equipe) é de responsabilidade do contratante.":"A hospedagem e o deslocamento aéreo (passagens e despacho de bagagem) para "+numP(X.n)+" pessoas (artista e equipe) são de responsabilidade do contratante.";
    var np=cloneAfter(pr,[{t:txt}]);var pPr=kid(np,"pPr");if(pPr){var jc=kid(pPr,"jc");if(jc)pPr.removeChild(jc)}}
  var pay=opt(r,a,"pag"),pi=fp(root,"O pagamento deverá"),p1=fp(root,"Primeira parcela"),p2=fp(root,"Segunda parcela");
  if(splitPct(pay)){var sp=splitPct(pay);if(p1)setRuns(p1,[{t:"Primeira parcela, no valor de "+sp+"% do cachê, acertada em até "+(opt(r,a,"dias")||"7")+" dias após a aprovação da proposta;"}]);if(p2)setRuns(p2,[{t:"Segunda parcela, no valor de "+(100-sp)+"% do cachê, até 12 horas antes do início da apresentação."}])}
  else{var tx={int12:"até 12 horas antes do início da apresentação.",inicio:"até o momento do início da apresentação.",pos:"em até um dia útil após a realização da apresentação."}[pay];
    if(pi)setRuns(pi,[{t:"O pagamento deverá ser realizado integralmente, através de transferência bancária, "+tx}]);rmOnly(p1);rmOnly(p2)}
  var rt=opt(r,a,"rt");rider(root,rt);
  var hl=rhLines(r,a);var rhp=fp(root,"Sem exigência");
  if(hl&&rhp){var last=rhp;hl.forEach(function(l,i){if(i===0)setRuns(rhp,[{t:l}]);else last=cloneAfter(last,[{t:l}])})}
  var vv=fp(root,"A presente proposta é válida");if(vv){var n=Number(opt(r,a,"vform"))||30;setRuns(vv,[{t:"A presente proposta é válida por "+pad(n,2)+" ("+eN(n)+") dias, contados a partir da presente data."}])}
  var dp=fp(root,"Florianópolis,");if(dp)setRuns(dp,[{t:"Florianópolis, "+dataLonga(X.dd)+"."}]);
  return root}
function footerFill(xml,r,a,kind){var d=new DOMParser().parseFromString(xml,"application/xml"),root=d.documentElement;stripRed(root);
  var rs=ELs(root,"r"),k=-1;rs.forEach(function(x,i){if(k<0&&/N[º°] N/.test(ptxt(x)))k=i});
  if(k>=0){var run=rs[k];var tn=ELs(run,"t")[0];tn.textContent="Nº "+numero(r,a);for(var i=k+1;i<rs.length;i++)rs[i].parentNode.removeChild(rs[i])}
  ELs(root,"r").forEach(function(x){var rp=kid(x,"rPr");if(!rp){rp=x.ownerDocument.createElementNS(WNS,"w:rPr");x.insertBefore(rp,x.firstChild)}if(!kid(rp,"b")){rp.insertBefore(x.ownerDocument.createElementNS(WNS,"w:b"),rp.firstChild)}});
  return new XMLSerializer().serializeToString(d)}

/* riders técnicos: mantém só o grupo A/B/C */
function rider(root,rt,keepObs){var tbls=ELs(root,"tbl"),cell=null;
  tbls.forEach(function(t){if(ptxt(t).indexOf("02 CDJ Pioneer")>=0)cell=ELs(t,"tc")[0]});
  if(!cell)return;var ps=Array.prototype.slice.call(cell.children).filter(function(c){return c.localName==="p"});
  var g="H",grp=[];ps.forEach(function(p){var t=ptxt(p).trim(),dr=p.getElementsByTagNameNS(WNS,"drawing").length;
    if(t.indexOf("Sonorização para")===0)g="C";
    else if(dr){g=g==="H"?"A":(g==="A"?"B":g)}
    else if(t.indexOf("Obs.: O CONTRATANTE")===0)g="Z";
    grp.push([p,g])});
  grp.forEach(function(x){var gg=x[1];if(gg==="A"||gg==="B"||gg==="C"){if(gg!==rt)rmOnly(x[0])}else if(gg==="Z"&&!keepObs)rmOnly(x[0])});
  /* limpa parágrafos em branco duplicados */
  var cs=Array.prototype.slice.call(cell.children).filter(function(c){return c.localName==="p"}),prev=false;
  cs.forEach(function(p){var b=isBlank(p);if(b&&prev)rmOnly(p);prev=b})}

/* artista feminina (Maneira) */
var FEM=[[/\bdo referido artista\b/g,"da referida artista"],[/\bdo artista\b/g,"da artista"],[/\bao artista\b/g,"à artista"],[/\bpelo artista\b/g,"pela artista"],[/\bdeste artista\b/g,"desta artista"],[/\bO artista\b/g,"A artista"],[/\bo artista\b/g,"a artista"],[/\bum artista\b/g,"uma artista"]];
function femin(root,a){if(a!=="Maneira")return;
  ELs(root,"p").forEach(function(p){var t=ptxt(p),n=t;FEM.forEach(function(f){n=n.replace(f[0],f[1])});if(n===t)return;
    var ts=ELs(p,"t");ts.forEach(function(x){var s=x.textContent;FEM.forEach(function(f){s=s.replace(f[0],f[1])});x.textContent=s});
    if(ptxt(p)!==n){var f0=true;ts.forEach(function(x){if(f0){x.textContent=n;f0=false}else x.textContent=""})}})}
/* ---------- Contrato ---------- */
function kindDoc(d){var n=String(d||"").replace(/\D/g,"").length;return n===14?"cnpj":n===11?"cpf":""}
function repOk(v){v=String(v||"").trim();return v&&!/^(-+|n\/?a|n[aã]o se aplica|n[aã]o|nenhum|x+)$/i.test(v)?v:""}
function ctPartes(r,a){var nm=r.ct_nome!==undefined?r.ct_nome:r.cont;return{nm:nm,doc:r.ct_doc,end:r.ct_end,bairro:r.ct_bairro,comp:r.ct_comp,cid:r.ct_cid,cep:r.ct_cep,email:r.ct_email,tel:r.ct_tel!==undefined?r.ct_tel:r.tel,rep:r.ct_rep,repdoc:r.ct_repdoc}}
function fillContrato(doc,r,a){var X=ctxOf(r,a),root=doc.documentElement,B=BASE[a]||{},c=B.cad||{},P=ctPartes(r,a);
  stripRed(root);
  /* artista */
  ELs(root,"p").forEach(function(p){var tx=ptxt(p),m=/Z{4,}/.exec(tx);if(!m)return;var par=p.parentNode,pPr=kid(p,"pPr");
    var segs=[];var bold=ELs(p,"r").some(function(r){return/Z/.test(ptxt(r))&&kid(r,"rPr")&&kid(kid(r,"rPr"),"b")});
    var bf=[];ELs(p,"r").forEach(function(r){var rp=kid(r,"rPr"),bb=!!(rp&&kid(rp,"b"));var s=ptxt(r);for(var q=0;q<s.length;q++)bf.push(bb)});
    if(bf.length!==tx.length)bf=tx.split("").map(function(){return false});
    var out=[],E=m.index+m[0].length;function seg(a0,b0){var cur="",cb=null;for(var q=a0;q<b0;q++){if(cb!==null&&bf[q]!==cb){out.push(cb?{t:cur,b:1}:{t:cur});cur=""}cb=bf[q];cur+=tx[q]}if(cur)out.push(cb?{t:cur,b:1}:{t:cur})}
    seg(0,m.index);out.push({t:nome(a),b:1});seg(E,tx.length);setRuns(p,out)});
  /* contratante */
  var cp=fp(root,"NOME, CPF/CNPJ");
  var KD=kindDoc(P.doc),REP=repOk(P.rep);
  if(cp){var full=P.end&&!P.bairro&&!P.cid;
    var fem=/^(r\.?|rua|av\.?|avenida|rod\.?|rodovia|al\.?|alameda|tv\.?|travessa|estrada|pra[cç]a|servid[aã]o|ladeira|beco|vila|via|marginal|linha|quadra)\b/i.test(String(P.end||""));
    var pj=KD==="cnpj"||(KD===""&&REP),pf=KD==="cpf";
    var cmp=String(P.comp||"").trim();if(cmp&&/^[\w\-\/]{1,6}$/.test(cmp))cmp=(pj?"sala ":"apto ")+cmp;
    var rr=[vp(P.nm,{b:1}),{t:", "+(pf?"CPF ":pj?"CNPJ ":"CPF/CNPJ ")},vp(P.doc)];
    if(pj&&REP)rr.push({t:", representada por "+REP});
    rr.push({t:", "+(pf?"residente ":"com sede ")+(fem?"na ":"no ")},vp(P.end));
    if(cmp)rr.push({t:", "+cmp});if(!full){rr.push({t:", bairro "},vp(P.bairro));rr.push({t:", "},vp(P.cid))}
    rr.push({t:", CEP "},vp(P.cep),{t:". E-mail: "},vp(P.email),{t:". Telefone: "},vp(P.tel),{t:"."});setRuns(cp,rr)}
  /* quadro do evento */
  var ev=[["EVENTO",X.ev],["LOCAL",X.loc],["ENDEREÇO",X.end],["CIDADE",X.cid],["DATA",X.data],["HORÁRIO DO EVENTO",X.hev],["HORÁRIO DA APRESENTAÇÃO",X.iniC],["DURAÇÃO DA APRESENTAÇÃO",X.dur]];
  var t0=ELs(root,"tbl").filter(function(t){return ptxt(t).indexOf("EVENTO:")===0||ptxt(t).indexOf("EVENTO")===0&&ptxt(t).indexOf("ENDEREÇO")>0})[0];
  if(t0){var ps=ELs(t0,"p");ev.forEach(function(e,i){var p=ps[i];if(!p)return;var v=e[1]===undefined||e[1]===""||e[1]===null?ph():{t:String(e[1])};setRuns(p,[{t:e[0]+": ",b:1},v])});
    if(X.semHev){var pe=ps[5];if(pe&&ptxt(pe).indexOf("HORÁRIO DO EVENTO")===0&&pe.parentNode)pe.parentNode.removeChild(pe)}}
  /* valor */
  var vp_=ELs(root,"p").filter(function(p){return/^R\$ ?0,00/.test(ptxt(p).trim())})[0];
  if(vp_)setRuns(vp_,[{t:X.valor+" "+X.ext,b:1}]);
  /* pagamento */
  var pt=ELs(root,"tbl").filter(function(t){return ptxt(t).indexOf("Integralmente")>=0})[0];
  if(pt){var cell=ELs(pt,"tc")[0];var all=Array.prototype.slice.call(cell.children).filter(function(c){return c.localName==="p"});
    var I=all.filter(function(p){return/^Integralmente/.test(ptxt(p))}),L=all.filter(function(p){return/^50%/.test(ptxt(p))});
    var pay=opt(r,a,"pag"),sp=splitPct(pay),m={inicio:0,int12:1,pos:2};
    I.forEach(function(p,i){if(sp||m[pay]!==i)rmOnly(p)});
    if(!sp)L.forEach(rmOnly);
    else{var v1=Math.round(num(r.cach)*sp)/100,v2=Math.round((num(r.cach)-v1)*100)/100,dt=opt(r,a,"p1data");
      setRuns(L[0],[{t:sp+"% ("+money(v1)+") através de transferência bancária, até o dia "},dt?{t:br(dt)}:ph(),{t:";"}]);
      setRuns(L[1],[{t:(100-sp)+"% ("+money(v2)+") até 12 horas antes do início da apresentação, conforme data e horário indicados no item 1.2."}])}
    /* PIX */
    var pk=all.filter(function(p){return/^Chave PIX/.test(ptxt(p))}),keep=null;
    if(opt(r,a,"payee")==="drom")keep=0;
    else if(!B.pix){var nm=c.nome||"";pk.forEach(function(p,i){var nx=all[all.indexOf(p)+1];if(nm&&nx&&ptxt(nx).indexOf(nm)>=0)keep=i})}
    if(keep!==null)pk.forEach(function(p,i){if(i!==keep){rmOnly(all[all.indexOf(p)+1]);rmOnly(p)}});
    else{ /* sem correspondência no modelo: usa a chave da base */
      pk.slice(1).forEach(function(p){rmOnly(all[all.indexOf(p)+1]);rmOnly(p)});
      var raw=String(B.pix||"").match(/^(.*?)\s*\((.*)\)\s*$/);var p0=pk[0],n0=all[all.indexOf(p0)+1];
      if(raw){setRuns(p0,[{t:"Chave PIX "+raw[1].replace(/^(CPF|CNPJ|e-mail|Celular):?\s+/,"$1: ")}]);setRuns(n0,[{t:"("+raw[2]+")"}])}else{setRuns(p0,[{t:"Chave PIX: "},ph()]);setRuns(n0,[{t:""}])}}
    /* blanks em excesso */
    var cs=Array.prototype.slice.call(cell.children).filter(function(c){return c.localName==="p"}),prev=true;
    cs.forEach(function(p){var b=isBlank(p);if(b&&prev)rmOnly(p);prev=b});
    var lastp=cell.lastElementChild;while(lastp&&lastp.localName==="p"&&isBlank(lastp)&&cell.children.length>1){rmOnly(lastp);lastp=cell.lastElementChild}}
  /* despesas */
  var d=opt(r,a,"desp"),ds={a:fp(root,"As despesas referentes ao deslocamento e hospedagem"),b:fp(root,"As despesas referentes ao deslocamento do artista e equipe"),c:fp(root,"As despesas referentes à hospedagem não"),d:fp(root,"As despesas referentes ao deslocamento terrestre"),e:fp(root,"As despesas referentes à hospedagem e ao deslocamento aéreo")};
  var keepD=d==="inc"?["a"]:d==="sem_hosp"?["b","c"]:["d","e"];
  Object.keys(ds).forEach(function(k){if(keepD.indexOf(k)<0)rmP(ds[k])});
  /* equipamentos */
  rider(root,opt(r,a,"rt"),opt(r,a,"rt")==="C"&&r.eq==="LEVAR");
  /* hospitalidade */
  var ht=ELs(root,"tbl").filter(function(t){return ptxt(t).indexOf("RIDER DE HOSPITALIDADE")>=0})[0];
  if(ht){var hl=rhLines(r,a);if(hl){var h1=fp(ht,"Sem exigência"),h2=fp(ht,"O CONTRATANTE deverá fornecer ao artista");
      if(h1){var last=h1;hl.forEach(function(l,i){if(i===0)setRuns(h1,[{t:l}]);else last=cloneAfter(last,[{t:l}])})}
      if(h2)rmP(h2)}}
  if(/open/i.test(r.rid||""))rmP(fp(root,"Observação: Todos os itens"));
  /* hospedagem e aéreo (cláusula 4) */
  var hs=["As despesas referentes à hospedagem para um total","O CONTRATANTE compromete-se a providenciar a hospedagem","O CONTRATANTE deve informar com antecedência de 01"];
  var as=["As despesas referentes às passagens aéreas","O CONTRATANTE compromete-se a providenciar as passagens","O CONTRATANTE arcará com os custos de despacho","O CONTRATANTE deve informar com antecedência de 05"];
  if(d==="inc"){hs.concat(as).forEach(function(s){rmP(fp(root,s))})}
  else if(d==="sem_hosp"){as.forEach(function(s){rmP(fp(root,s))})}
  var nn=numP(X.n),qe=Number(r.prod)>0?Number(r.prod):X.n-1,ne=numP(qe);ELs(root,"p").forEach(function(p){var e=/composta por 0?3 \(três\)/.test(ptxt(p));repIn(p,/0?3 \(três\)/g,e?ne:nn);if((e?qe:X.n)===1)repIn(p,/\(um\) pessoas/g,"(um) pessoa")});
  femin(root,a);
  /* caixas (cachê, pagamento, riders): todo o texto em negrito, como no modelo */
  ELs(root,"tbl").forEach(function(tb){var tx=ptxt(tb);if(/^\s*EVENTO/.test(tx))return;
    ELs(tb,"r").forEach(function(x){var rp=kid(x,"rPr");if(!rp){rp=x.ownerDocument.createElementNS(WNS,"w:rPr");x.insertBefore(rp,x.firstChild)}
      if(!kid(rp,"b"))rp.insertBefore(x.ownerDocument.createElementNS(WNS,"w:b"),rp.firstChild)})});
  /* data e assinatura */
  var dp=fp(root,"Florianópolis,");if(dp)setRuns(dp,[{t:"Florianópolis, "+dataLonga(X.dd)+"."}]);
  var sn=ELs(root,"p");
  var up=function(v){return v===undefined||v===null||!String(v).trim()?"":String(v).trim().toUpperCase()};
  sn.forEach(function(p){var t=ptxt(p).trim();
    if(t==="NOME")setRuns(p,[vp(up(P.nm),{b:1,i:1})]);
    else if(t==="Nome Completo"){if(KD==="cpf")rmOnly(p);else setRuns(p,[vp(REP?String(P.rep).trim():"",{})])}
    else if(t==="CPF/CNPJ NÚMERO")setRuns(p,[{t:(KD==="cpf"?"CPF ":KD==="cnpj"?"CNPJ ":"CPF/CNPJ ")},vp(P.doc)])});
  return root}

/* ---------- carregar modelos ---------- */
var TPLC={};
async function loadTpl(k){if(TPLC[k])return TPLC[k];
  var z=await JSZip.loadAsync(k==="p"?TP_B64:TC_B64,{base64:true});
  var T={b64:k==="p"?TP_B64:TC_B64,doc:await z.file("word/document.xml").async("string"),foot:await z.file("word/footer1.xml").async("string"),
   num:await z.file("word/numbering.xml").async("string"),rels:await z.file("word/_rels/document.xml.rels").async("string"),hrels:await z.file("word/_rels/header1.xml.rels").async("string"),media:{}};
  var names=Object.keys(z.files).filter(function(n){return/^word\/media\//.test(n)});
  for(var i=0;i<names.length;i++){T.media[names[i]]="data:image/png;base64,"+await z.file(names[i]).async("base64")}
  TPLC[k]=T;return T}
async function buildDoc(k,r,a){var T=await loadTpl(k);
  var d=new DOMParser().parseFromString(T.doc,"application/xml");
  (k==="p"?fillProposta:fillContrato)(d,r,a);
  var doc=new XMLSerializer().serializeToString(d),foot=footerFill(T.foot,r,a,k);
  return{T:T,dom:d,docXml:doc,footXml:foot}}
async function makeDocx(k,r,a){var B=await buildDoc(k,r,a);
  var z=await JSZip.loadAsync(B.T.b64,{base64:true});z.file("word/document.xml",B.docXml);z.file("word/footer1.xml",B.footXml);
  try{await embedFonts(z)}catch(e){console.error(e)}
  return z.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",compression:"DEFLATE"})}
async function embedFonts(z){if(typeof FONTS==="undefined"||!FONTS)return;
  var names=[["Regular","embedRegular"],["Bold","embedBold"],["Italic","embedItalic"],["BoldItalic","embedBoldItalic"]],rels="",emb="";
  names.forEach(function(n,i){var bin=atob(FONTS[n[0]]),u=new Uint8Array(bin.length);for(var j=0;j<bin.length;j++)u[j]=bin.charCodeAt(j);
    var hx="";for(var q=0;q<32;q++)hx+="0123456789ABCDEF"[Math.floor(Math.random()*16)];
    var key=[];for(q=0;q<16;q++)key.push(parseInt(hx.substr(q*2,2),16));key.reverse();
    for(q=0;q<32;q++)u[q]^=key[q%16];
    var guid="{"+hx.substr(0,8)+"-"+hx.substr(8,4)+"-"+hx.substr(12,4)+"-"+hx.substr(16,4)+"-"+hx.substr(20,12)+"}";
    z.file("word/fonts/font"+(i+1)+".odttf",u);
    rels+='<Relationship Id="rIdIvy'+(i+1)+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font'+(i+1)+'.odttf"/>';
    emb+='<w:'+n[1]+' r:id="rIdIvy'+(i+1)+'" w:fontKey="'+guid+'"/>'});
  var ft=await z.file("word/fontTable.xml").async("string");
  var m=ft.match(/<w:font w:name="IvyEpic">[\s\S]*?<\/w:font>/);if(!m)return;
  var nf=m[0].replace(/<w:notTrueType\/>/,"").replace("</w:font>",emb+"</w:font>");
  z.file("word/fontTable.xml",ft.replace(m[0],nf));
  z.file("word/_rels/fontTable.xml.rels",'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+rels+'</Relationships>');
  var ct=await z.file("[Content_Types].xml").async("string");
  if(ct.indexOf('Extension="odttf"')<0)ct=ct.replace(/(<Types[^>]*>)/,'$1<Default Extension="odttf" ContentType="application/vnd.openxmlformats-officedocument.obfuscatedFont"/>');
  z.file("[Content_Types].xml",ct);
  var st=await z.file("word/settings.xml").async("string");
  if(st.indexOf("embedTrueTypeFonts")<0){var zm=st.match(/<w:zoom[^>]*\/>/);
    st=zm?st.replace(zm[0],zm[0]+"<w:embedTrueTypeFonts/>"):st.replace(/(<w:settings[^>]*>)/,"$1<w:embedTrueTypeFonts/>");z.file("word/settings.xml",st)}}

/* ---------- layout (para prévia e PDF) ---------- */
var STY={Normal:{sz:10,jc:"both",after:2,before:0},Ttulo:{sz:16,b:1,jc:"center",after:0,line:1.5},Ttulo1:{sz:16,b:1,before:12,after:0,line:1.5,jc:"left"},Ttulo2:{sz:12,b:1,before:2,after:0,line:1.5,jc:"left"},PargrafodaLista:{left:36},SemEspaamento:{after:0}};
function attr(n,t,a){var e=kid(n,t);return e?e.getAttributeNS(WNS,a):null}
function parseNum(xml){var d=new DOMParser().parseFromString(xml,"application/xml"),abs={},nums={};
  ELs(d.documentElement,"abstractNum").forEach(function(an){var id=an.getAttributeNS(WNS,"abstractNumId"),lv={};
    ELs(an,"lvl").forEach(function(l){var il=+l.getAttributeNS(WNS,"ilvl"),pp=kid(l,"pPr"),ind=pp&&kid(pp,"ind");
      lv[il]={start:+(attr(l,"start","val")||1),fmt:attr(l,"numFmt","val")||"decimal",txt:attr(l,"lvlText","val")||"",left:ind?(+ind.getAttributeNS(WNS,"left")||0)/20:0,hang:ind?(+ind.getAttributeNS(WNS,"hanging")||0)/20:0}});abs[id]=lv});
  ELs(d.documentElement,"num").forEach(function(n){var id=n.getAttributeNS(WNS,"numId"),a=attr(n,"abstractNumId","val"),ov={};
    ELs(n,"lvlOverride").forEach(function(o){var so=kid(o,"startOverride");if(so)ov[+o.getAttributeNS(WNS,"ilvl")]=+so.getAttributeNS(WNS,"val")});nums[id]={abs:a,ov:ov}});
  return{abs:abs,nums:nums}}
function fmtN(n,f){if(f==="lowerLetter")return String.fromCharCode(96+((n-1)%26)+1);if(f==="upperLetter")return String.fromCharCode(64+((n-1)%26)+1);if(f==="lowerRoman"||f==="upperRoman"){var s="",v=[[10,"x"],[9,"ix"],[5,"v"],[4,"iv"],[1,"i"]];v.forEach(function(x){while(n>=x[0]){s+=x[1];n-=x[0]}});return f==="upperRoman"?s.toUpperCase():s}return String(n)}
function relMap(xml){var m={},d=new DOMParser().parseFromString(xml,"application/xml");Array.prototype.slice.call(d.getElementsByTagName("Relationship")).forEach(function(x){m[x.getAttribute("Id")]=x.getAttribute("Target")});return m}
function runOf(r,inherit){var rp=kid(r,"rPr"),o={b:inherit.b,i:inherit.i,sz:inherit.sz,col:null,hl:false};
  if(rp){if(kid(rp,"b"))o.b=attr(rp,"b","val")!=="0";if(kid(rp,"i"))o.i=attr(rp,"i","val")!=="0";var sz=attr(rp,"sz","val");if(sz)o.sz=+sz/2;var c=attr(rp,"color","val");if(c&&c!=="auto")o.col=c;if(kid(rp,"highlight"))o.hl=true}
  return o}
function layout(B,k){var T=B.T,NUM=parseNum(T.num),rels=relMap(T.rels),cnt={},items=[],clause=0,sub=0;
  var body=B.dom.getElementsByTagNameNS(WNS,"body")[0];
  function para(p){var pPr=kid(p,"pPr"),sid=pPr&&attr(pPr,"pStyle","val")||"Normal",S=STY[sid]||{},N=STY.Normal;
    var mk=pPr&&kid(pPr,"rPr");if(mk&&kid(mk,"vanish")&&!ptxt(p).trim())return;
    if(sid==="Ttulo2"&&/^CL[ÁA]USULA/.test(ptxt(p).trim())){clause++;sub=0}
    var o={k:"p",head:/^Ttulo/.test(sid),jc:S.jc||N.jc,left:S.left||0,first:0,before:S.before||0,after:S.after!==undefined?S.after:N.after,sz:S.sz||N.sz,b:S.b,line:S.line||1,runs:[],label:null};
    if(pPr){var jc=attr(pPr,"jc","val");if(jc)o.jc=jc==="both"?"both":(jc==="center"?"center":(jc==="right"||jc==="end"?"right":"left"));
      var ind=kid(pPr,"ind");if(ind){var l=ind.getAttributeNS(WNS,"left"),f=ind.getAttributeNS(WNS,"firstLine"),h=ind.getAttributeNS(WNS,"hanging");if(l)o.left=+l/20;if(f)o.first=+f/20;if(h)o.first=-(+h/20)}
      var sp=kid(pPr,"spacing");if(sp){var b=sp.getAttributeNS(WNS,"before"),af=sp.getAttributeNS(WNS,"after");if(b)o.before=+b/20;if(af)o.after=+af/20}
      var np=kid(pPr,"numPr");if(np){var nid=attr(np,"numId","val"),il=+(attr(np,"ilvl","val")||0),def=NUM.nums[nid];
        if(def&&nid!=="0"){var lv=NUM.abs[def.abs][il]||{},cc=cnt[def.abs]||(cnt[def.abs]={});
          cc[il]=cc[il]===undefined?((def.ov[il]||lv.start)):cc[il]+1;Object.keys(cc).forEach(function(x){if(+x>il)delete cc[x]});
          var txt=lv.txt;if(lv.fmt==="bullet"||!txt.match(/%/))txt="•";else if(clause>0&&/%1.*%2/.test(txt)&&il===1){sub++;txt=clause+"."+sub+"."}else if(clause>0&&il===0&&/^%1\.?$/.test(txt)){txt=""}else{txt=txt.replace(/%(\d)/g,function(_,d){var j=+d-1,L=NUM.abs[def.abs][j]||{},v=cc[j]===undefined?(def.ov[j]||L.start||1):cc[j];return fmtN(v,L.fmt)})}
          o.label=txt;o.left=lv.left||o.left;o.first=-(lv.hang||0)}}}
    Array.prototype.slice.call(p.children).forEach(function(c){
      if(c.localName==="r"){var dr=c.getElementsByTagNameNS(WNS,"drawing")[0];
        if(dr){var ex=dr.getElementsByTagNameNS(WPNS,"extent")[0],bl=dr.getElementsByTagNameNS(ANS,"blip")[0];
          if(ex&&bl){var rid=bl.getAttributeNS(RNS,"embed"),tg=rels[rid];if(tg)items.push({k:"img",src:T.media["word/"+tg],w:+ex.getAttribute("cx")/36000,h:+ex.getAttribute("cy")/36000,jc:o.jc})}}
        else{var ro=runOf(c,{b:o.b,sz:o.sz}),tx="";Array.prototype.slice.call(c.children).forEach(function(x){if(x.localName==="t")tx+=x.textContent;else if(x.localName==="tab")tx+="    ";else if(x.localName==="br"||x.localName==="cr")tx+="\n"});
          if(tx){ro.t=tx;o.runs.push(ro)}}}});
    if(o.runs.length||!items.length||items[items.length-1].k!=="img"||true){if(o.runs.length||!(p.getElementsByTagNameNS(WNS,"drawing").length))items.push(o)}}
  function walk(n){Array.prototype.slice.call(n.children).forEach(function(c){
    if(c.localName==="p")para(c);
    else if(c.localName==="tbl"){var tbo={k:"tbs"};items.push(tbo);var n0=items.length;Array.prototype.slice.call(c.getElementsByTagNameNS(WNS,"tc")).forEach(function(tc){walk(tc)});tbo.img=items.slice(n0).some(function(q){return q.k==="img"});items.push({k:"tbe"})}})}
  walk(body);while(items.length&&items[items.length-1].k==="p"&&!items[items.length-1].runs.length)items.pop();
  if(k==="c"){var us=[];items.forEach(function(q,i){if(q.k==="p"&&/^_{10,}$/.test((q.runs.map(function(r){return r.t}).join("")).trim()))us.push(i)});
    if(us.length>=2){var s0=us[us.length-2],s1=us[us.length-1],A=items.slice(s0,s1),Bq=items.slice(s1);
      while(A.length&&A[A.length-1].k==="p"&&!A[A.length-1].runs.length)A.pop();
      items=items.slice(0,s0);var nb=0,j=items.length;while(j>0&&items[j-1].k==="p"&&!items[j-1].runs.length){nb++;j--}if(nb>3)items.splice(j,nb-3);items.push({k:"cols",a:A,b:Bq})}}
  return items}

/* header / footer logo recortado */
async function headerLogo(B){var src=B.T.media["word/media/"+(B.T===TPLC.p?"image11.png":"image3.png")];
  return new Promise(function(res){var im=new Image();im.onload=function(){var cv=document.createElement("canvas"),t=.3185*im.height,b=.27199*im.height,h=im.height-t-b;cv.width=im.width;cv.height=h;cv.getContext("2d").drawImage(im,0,t,im.width,h,0,0,im.width,h);res({src:cv.toDataURL("image/png"),w:22.8,h:22.8*h/im.width})};im.onerror=function(){res(null)};im.src=src})}
function footText(B){var d=new DOMParser().parseFromString(B.footXml,"application/xml");var ps=ELs(d.documentElement,"p");return ps.map(ptxt).join(" ").trim()}

/* ---------- prévia HTML ---------- */
function esc2(s){return esc(s)}
async function previewHTML(B,k){var it=layout(B,k),lg=await headerLogo(B),h='<div class="pg"><div class="ph">'+(lg?'<img src="'+lg.src+'" alt="DROM" style="height:14px;width:auto">':"")+'</div>';
  function R(it){var h="";it.forEach(function(x){
    if(x.k==="cols"){h+='<div style="display:flex;gap:8mm;margin-top:10px"><div style="flex:1">'+R(x.a)+'</div><div style="flex:1">'+R(x.b)+'</div></div>';return}
    if(x.k==="tbs")h+='<div class="tb">';else if(x.k==="tbe")h+="</div>";
    else if(x.k==="img")h+='<div style="text-align:'+(x.jc==="center"?"center":"left")+'"><img src="'+x.src+'" style="max-width:100%;width:'+Math.min(x.w*3.78,520)+'px;height:auto" alt=""></div>';
    else{var st="margin:"+(x.before||0)+"pt 0 "+(x.after||0)+"pt;padding-left:"+Math.max(0,x.left+(x.first<0?0:x.first))+"pt;text-align:"+(x.jc==="both"?"justify":x.jc)+";font-size:"+(x.sz||10)*1.25+"px;"+(x.first<0?"text-indent:"+x.first+"pt;padding-left:"+x.left+"pt;":"");
      var inner=x.runs.map(function(r){var s="";if(r.b)s+="font-weight:700;";if(r.i)s+="font-style:italic;";if(r.sz&&r.sz!==x.sz)s+="font-size:"+r.sz*1.25+"px;";if(r.col)s+="color:#"+r.col+";";var t=esc2(r.t).replace(/\n/g,"<br>");return r.hl?'<mark style="'+s+'">'+t+"</mark>":(s?'<span style="'+s+'">'+t+"</span>":t)}).join("");
      if(x.label)inner='<span style="display:inline-block;min-width:'+(-x.first)+'pt;text-indent:0">'+esc2(x.label)+"</span>"+inner;
      h+='<p style="'+st+(x.runs.length?"":"min-height:1.1em")+'">'+(inner||"&nbsp;")+"</p>"}});return h}
  h+=R(it);
  h+='<div class="pf">'+esc2(footText(B))+"</div></div>";return h}

/* ---------- PDF ---------- */
function toJpg(src){return new Promise(function(res){var im=new Image();im.onload=function(){var cv=document.createElement("canvas");cv.width=im.width;cv.height=im.height;var c=cv.getContext("2d");c.fillStyle="#fff";c.fillRect(0,0,cv.width,cv.height);c.drawImage(im,0,0);res(cv.toDataURL("image/jpeg",.86))};im.onerror=function(){res(src)};im.src=src})}
async function makePdf(k,r,a){var B=await buildDoc(k,r,a),it=layout(B,k),lg=await headerLogo(B);
  for(var ii=0;ii<it.length;ii++){if(it[ii].k==="img"&&it[ii].src.length>60000){it[ii].src=await toJpg(it[ii].src);it[ii].fmt="JPEG"}}
  var D=new jspdf.jsPDF({unit:"mm",format:"a4",compress:true}),W=210,H=297,ML=20,MR=20,TOP=24,BOT=273,CW=W-ML-MR,PT=.3528,FONT="helvetica";
  if(typeof FONTS!=="undefined"){try{[["normal","Regular"],["bold","Bold"],["italic","Italic"],["bolditalic","BoldItalic"]].forEach(function(s){D.addFileToVFS("IvyEpic-"+s[1]+".ttf",FONTS[s[1]]);D.addFont("IvyEpic-"+s[1]+".ttf","IvyEpic",s[0])});FONT="IvyEpic"}catch(x){console.error(x)}}
  var y=TOP,pageStart=TOP,tb=0,tbX=0;
  function sanit(s){return s.replace(/[\u00a0\u2000-\u200a\u202f\u205f]/g," ").replace(/₂/g,"2").replace(/[^\u0000-\u00ff\u2013\u2014\u2022\u2018\u2019\u201c\u201d\u2026]/g,"")}
  function chrome(){if(lg)D.addImage(lg.src,"PNG",ML,12,lg.w,lg.h);D.setDrawColor(0).setLineWidth(.35);D.line(ML,17,W-MR,17);D.line(ML,282,W-MR,282);
    D.setFont(FONT,"bold").setFontSize(9).setTextColor(0);var ft=D.splitTextToSize(sanit(footText(B)),CW);D.text(ft,W/2,286,{align:"center"})}
  function boxEnd(){if(tb&&y-pageStart>4){D.setDrawColor(0).setLineWidth(.25);D.rect(ML,pageStart-1.5,CW,y-pageStart+1,"S")}}
  function newPage(){if(tb)boxEnd();D.addPage();chrome();y=TOP;pageStart=TOP}
  chrome();
  function setF(r){D.setFont(FONT,r.b&&r.i?"bolditalic":r.b?"bold":r.i?"italic":"normal");D.setFontSize(r.sz)}
  function drawPara(x){var sz=x.sz||10,lh=sz*PT*1.18*(x.line||1),inX=ML+(tb?3:0),avail=CW-(tb?6:0);
    if(!x.runs.length){if(y+lh>BOT)newPage();y+=lh+(x.after||0)*PT*0.9;return}
    y+=(x.before||0)*PT;
    var chars=[];x.runs.forEach(function(r){var rr={b:r.b,i:r.i,sz:r.sz||sz,col:r.col,hl:r.hl};sanit(r.t).split("").forEach(function(ch){chars.push([ch,rr])})});
    var words=[],cur=null;chars.forEach(function(c){if(c[0]===" "||c[0]==="\n"){cur=null;words.push({sp:c[0]});}else{if(!cur){cur={segs:[]};words.push(cur)}var l=cur.segs[cur.segs.length-1];if(l&&l.st===c[1])l.t+=c[0];else cur.segs.push({t:c[0],st:c[1]})}});
    function ww(w){if(w.sp)return 0;var s=0;w.segs.forEach(function(g){setF(g.st);s+=D.getTextWidth(g.t)});return s}
    var left=x.left*PT+inX-ML,lines=[],ln=[],lw=0;var first=x.first*PT;var spw;setF({sz:sz});spw=D.getTextWidth(" ");
    var lim=function(){return avail-left-(lines.length===0&&!x.label?first:0)};
    words.forEach(function(w){if(w.sp==="\n"){lines.push({w:ln,hard:true});ln=[];lw=0;return}if(w.sp){return}
      var wd=ww(w),need=lw+(ln.length?spw:0)+wd;if(ln.length&&need>lim()){lines.push({w:ln});ln=[];lw=0;need=wd}ln.push({w:w,wd:wd});lw=need});
    lines.push({w:ln,last:true});
    var lbl=x.label;
    lines.forEach(function(L,li){if(y+lh>BOT)newPage();var xs=inX+left-(inX-ML)+(li===0?first:0)+(0);
      xs=ML+(tb?3:0)+x.left*PT+(li===0?first:0)+(x.first<0&&li>0?0:0);
      if(x.first<0&&li===0){xs=ML+(tb?3:0)+x.left*PT+first;}
      var base=y+sz*PT*0.9,tot=L.w.reduce(function(s,q){return s+q.wd},0),gaps=Math.max(0,L.w.length-1),sp=spw;
      var avl=avail-(x.left*PT)-(li===0&&!lbl?first:0);
      if(li===0&&lbl){D.setFont(FONT,"normal").setFontSize(sz);D.text(sanit(lbl),xs,base)}
      var tx=(li===0&&lbl&&x.first<0)?ML+(tb?3:0)+x.left*PT:xs;
      if(x.jc==="both"&&!L.last&&!L.hard&&gaps>0)sp=(avl-tot)/gaps;
      else if(x.jc==="center")tx=ML+(tb?3:0)+x.left*PT+(avl-(tot+gaps*spw))/2;
      else if(x.jc==="right")tx=ML+(tb?3:0)+avail-(tot+gaps*spw);
      L.w.forEach(function(q,qi){q.w.segs.forEach(function(g){setF(g.st);var wdt=D.getTextWidth(g.t);
        if(g.st.hl){D.setFillColor(255,240,128);D.rect(tx,base-sz*PT*0.85,wdt,sz*PT*1.1,"F")}
        D.setTextColor(g.st.col?parseInt(g.st.col.slice(0,2),16):0,g.st.col?parseInt(g.st.col.slice(2,4),16):0,g.st.col?parseInt(g.st.col.slice(4,6),16):0);D.text(g.t,tx,base);tx+=wdt});tx+=sp});
      y+=lh});
    y+=(x.after||0)*PT*0.9}
  it.forEach(function(x){
    if(x.k==="tbs"){var ti=it.indexOf(x),th=0;for(var q=ti+1;q<it.length&&it[q].k!=="tbe";q++){var z=it[q];if(z.k==="p"){var cl=Math.max(1,Math.ceil(((z.runs||[]).reduce(function(s,r){return s+(r.t||"").length},0))/88));th+=cl*(z.sz||10)*PT*1.18+(z.after||0)*PT*.9}else if(z.k==="img")th+=z.h}if(x.img?y>BOT-100:(th<90&&y+th>BOT))newPage();tb++;pageStart=y+1.5;y+=1.5}
    else if(x.k==="tbe"){boxEnd();tb--;y+=3;pageStart=y}
    else if(x.k==="cols"){if(y>BOT-42)newPage();var ML0=ML,CW0=CW,y0=y,gap=8,cw=(CW0-gap)/2,y1;
      [x.a,x.b].forEach(function(L){L.forEach(function(q){if(q.runs&&q.runs.length&&/^_{10,}$/.test(q.runs[0].t.trim()))q.runs[0].t="_".repeat(36)})});CW=cw;x.a.forEach(drawPara);y1=y;y=y0;ML=ML0+cw+gap;x.b.forEach(drawPara);y=Math.max(y,y1);ML=ML0;CW=CW0}
    else if(x.k==="img"){var w=Math.min(x.w,CW-(tb?6:0)),h=x.h*(w/x.w);if(y+h>BOT)newPage();var xx=x.jc==="center"?ML+(CW-w)/2:ML+(tb?3:0);
      try{D.addImage(x.src,x.fmt||"PNG",xx,y,w,h)}catch(e){}y+=h+2}
    else{if(x.runs&&x.runs.length&&/^_{10,}/.test(x.runs[0].t)&&y>BOT-42)newPage();if(x.head&&x.runs&&x.runs.length&&y>BOT-32)newPage();if(x.runs&&x.runs.length&&/:\s*$/.test(x.runs[x.runs.length-1].t)&&(function(){var q=it.indexOf(x)+1;while(it[q]&&it[q].k==="p"&&!it[q].runs.length)q++;return it[q]&&it[q].k==="tbs"})()&&y>BOT-46)newPage();drawPara(x)}});
  return D.output("blob")}

/*/ENGINE*/

/* ---------- download ---------- */
var PFX={Ramonstro:"DJ Ramonstro",Carloto:"DJ Carloto",Sena:"Sena",Cenoura:"DJ Cenoura",Maneira:"Maneira",Amaro:"DJ Amaro",Josu:"DJ Josu","Cadu Vieira":"Cadu Vieira DJ",Brinquinho:"DJ Brinquinho",Liquinho:"DJ Liquinho"};
function fname(kind,r,a,ext){var ev=String(r.ev||"").trim(),lc=String(r.loc||"").trim(),cd=String(r.cid||"").replace(/\/.*$/,"").trim(),nm=ev||lc;
  if(nm&&lc&&nm.toLowerCase().indexOf(lc.toLowerCase())<0)nm+=" "+lc;else if(!nm)nm=cd;
  if(nm&&cd&&!lc&&nm.toLowerCase().indexOf(cd.toLowerCase())<0)nm+=" "+cd;
  nm=nm.replace(/[\\\/:*?"<>|]/g," ").replace(/\s+/g," ").trim();
  return(PFX[a]||a)+" - "+kind+" "+numero(r,a).replace("/","-")+(nm?" - "+nm:"")+"."+ext}
async function dl(kind,doc){
  if(!cur)return;var r=cur_(),a=cur.a,blob;toast("Gerando arquivo...");
  try{blob=kind==="docx"?await makeDocx(doc,r,a):await makePdf(doc,r,a)}catch(e){toast("Não foi possível gerar o arquivo");console.error(e);return}
  var name=fname(doc==="p"?"Proposta":"Contrato",r,a,kind);
  var D=null;try{D=window.claude&&await claude.use("downloads")}catch(e){}
  if(!D){try{var u=URL.createObjectURL(blob),l=document.createElement("a");l.href=u;l.download=name;document.body.appendChild(l);l.click();setTimeout(function(){URL.revokeObjectURL(u);l.remove()},4000);toast("Arquivo pronto")}catch(e){toast("Não foi possível salvar o arquivo")}return}
  try{await D.save({filename:name,data:blob});toast("Arquivo pronto")}catch(e){if(!e||e.code!=="declined")toast("Não foi possível salvar o arquivo")}}

/* ---------- seleção ---------- */
function okOpen(p){return p.st==="Proposta emitida"||p.st==="Show confirmado"||(p.dt>=TODAY&&p.st!=="Proposta descartada"&&p.st!=="Show cancelado")}
function listFor(a){
  var open=$("flt").value==="open",L=[];
  if(a)(BASE[a].p||[]).forEach(function(p){if(open&&!okOpen(p))return;L.push({a:a,p:p})});
  L.sort(function(x,y){return open?(x.p.dt<y.p.dt?-1:1):(x.p.dt<y.p.dt?1:-1)});
  return L}
function nrm(s){return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function searchAll(q){var tk=nrm(q).split(/\s+/).filter(Boolean),L=[];if(!tk.length)return L;
  ORDER.forEach(function(ar){if(!BASE[ar])return;BASE[ar].p.forEach(function(p){
    var s=nrm([ar,nome(ar),p.n,numero(p,ar),p.ev,p.loc,p.cid,p.cont,p.tel,p.st,p.dt,brs(p.dt),p.dow,p.cat,p.vend].join(" "));
    for(var k=0;k<tk.length;k++)if(s.indexOf(tk[k])<0)return;L.push({a:ar,p:p})})});
  L.sort(function(x,y){var fx=x.p.dt>=TODAY,fy=y.p.dt>=TODAY;if(fx!==fy)return fx?-1:1;return fx?(x.p.dt<y.p.dt?-1:1):(x.p.dt<y.p.dt?1:-1)});
  return L}
var SR=[],SI=0;
function showRes(){var q=$("q").value.trim(),box=$("sres");if(!q){box.hidden=true;return}
  SR=searchAll(q);SI=0;
  box.innerHTML=SR.length?SR.slice(0,60).map(function(x,i){var p=x.p;return'<button type="button" data-i="'+i+'"><b>'+esc(x.a)+"</b> · "+brs(p.dt)+" · "+esc((p.ev||p.loc||"(sem evento)").trim())+"<small>"+esc([p.loc,p.cid].filter(Boolean).join(" · "))+" · "+esc(p.st||"")+" · #"+p.n+"</small></button>"}).join("")+(SR.length>60?'<div class="none">Mais '+(SR.length-60)+" resultados: refine a busca.</div>":""):'<div class="none">Nenhuma proposta encontrada.</div>';
  box.hidden=false;
  box.querySelectorAll("button").forEach(function(b){b.onclick=function(){chooseRes(+b.dataset.i)}})}
function chooseRes(i){var x=SR[i];if(!x)return;$("sres").hidden=true;$("q").value="";$("art").value=x.a;
  if(listFor(x.a).filter(function(y){return y.p===x.p}).length===0)$("flt").value="all";
  fillProps(ovk(x.a,x.p.n))}
function ovk(a,n){return a+"|"+n}
function fillProps(keep){
  var L=listFor($("art").value);
  $("prop").innerHTML=L.map(function(x){var p=x.p;return'<option value="'+esc(ovk(x.a,p.n))+'">'+brs(p.dt)+" · "+esc((p.ev||p.loc||"(sem evento)").trim()).slice(0,60)+" · "+esc(p.cid||"")+" · "+p.st+" · #"+p.n+"</option>"}).join("");
  var has=L.length>0;
  $("empty").textContent=!$("art").value?"Selecione um artista ou busque por artista, evento, local, cidade ou nº da proposta.":"Nenhuma proposta com esse filtro.";
  $("empty").hidden=has;$("app").hidden=!has;
  if(!has){cur=null;return}
  var sel=keep&&L.some(function(x){return ovk(x.a,x.p.n)===keep})?keep:ovk(L[0].a,L[0].p.n);
  $("prop").value=sel;pick()}
function pick(){var v=$("prop").value.split("|"),a=v[0],n=v.slice(1).join("|");if(!BASE[a])return;var p=(BASE[a].p).filter(function(x){return String(x.n)===n})[0];if(!p)return;
  if($("art").value!==a)$("art").value=a;
  cur={a:a,p:p};
  if($("cpaste"))$("cpaste").value="";if($("cpmsg"))$("cpmsg").textContent="";
  buildForms();buildOpts();renderSum();renderAll();$("agout").hidden=true}
function renderSum(){var r=cur_(),a=cur.a;
  $("sum").innerHTML='<h1>'+esc((r.ev||r.loc||"(sem evento)").trim())+'</h1><span class="bd '+(STOK[r.st]||"")+'">'+esc(r.st||"")+'</span><span>'+esc(nome(a))+'</span><span>'+esc(dataExt(r))+'</span><span>'+esc([r.loc,r.cid].filter(Boolean).join(" · "))+'</span><span>'+esc(money(r.cach))+'</span><span>Proposta '+numero(r,a)+'</span>'}
var RT=0,RD;
function dadosPedido(r,a){var nd=function(v){return v&&v!=="a definir"?v:""},ini=iniC(r),dd=r.dt?(br(r.dt)+(r.dow?", "+r.dow:"")):"";
  return["*Dados para elaboração de contrato*","","*_Dados do evento_*",
   "Evento: "+(r.ev||r.loc||""),"Local: "+(r.ev&&r.loc&&r.ev!==r.loc?r.loc:(r.loc||"")),"Cidade: "+(r.cid||""),"Data: "+dd,"Horário do evento (início e término): "+nd(evHorario(r)),"",
   "Artista: "+nome(a),"Horário da apresentação (início e término): "+nd(ini),"Duração da apresentação: "+nd(durFmt(r.dur)),
   "Equipamento XDJ/CDJ de uso comum disponível? ( ) Sim / ( ) Não","Se sim, qual?","",
   "*_Dados do contratante_*","Contratante:","CPF/CNPJ:","Representante (para CNPJ):","Endereço completo (logradouro, número, bairro, cidade, CEP):","E-mail:","Telefone:"].join("\n")}
function renderAll(){if(!cur)return;var r=cur_(),a=cur.a;if($("cdd"))$("cdd").value=dadosPedido(r,a);
  $("wa").value=wmode==="c"?waProposta(r,a):waArtista(r,a);
  var id=(CL[a]||{})[ckey(r,a)];var sg=$("signed");
  if(id){sg.href="https://drive.google.com/file/d/"+id+"/view";sg.hidden=false}else sg.hidden=true;
  $("cal").textContent="Agenda do Google: "+calName(a)+" (e GERAL | DROM)";
  clearTimeout(RD);RD=setTimeout(renderDocs,250)}
async function renderDocs(){var tk=++RT,r=cur_(),a=cur.a;
  try{var hp=await previewHTML(await buildDoc("p",r,a),"p");var hc=await previewHTML(await buildDoc("c",r,a),"c");if(tk!==RT)return;$("pv-p").innerHTML=hp;$("pv-c").innerHTML=hc}
  catch(e){$("pv-p").textContent="Não foi possível montar a prévia ("+(e&&e.message)+")";$("pv-c").textContent=""}}
var OPTS=[["pag","Pagamento","sel",[["5050","Sinal de 50% e 50% antes do show"],["3070","Sinal de 30% e 70% antes do show"],["int12","Integral até 12 h antes"],["inicio","Integral até o início da apresentação"],["pos","Integral em até 1 dia útil após"]]],
 ["p1pct","% da 1ª parcela (WhatsApp)","txt"],["dias","Prazo da 1ª parcela na proposta (dias)","txt"],["p1data","1ª parcela do contrato até (data)","date"],
 ["desp","Deslocamento e hospedagem","sel",[["inc","Transporte e hospedagem inclusos no cachê"],["sem_hosp","Transporte incluso, hospedagem do contratante"],["terr_aereo","Terrestre incluso, hospedagem e aéreo do contratante"]]],
 ["rt","Rider técnico","sel",[["A","Equipamento comum do evento (2 CDJ + mixer ou XDJ)"],["B","Equipamento comum (XDJ)"],["C","Sonorização (artista leva equipamento)"],["N","Sem rider técnico (só WhatsApp)"]]],
 ["rh","Rider de hospitalidade","sel",[["padrao","Padrão do modelo (sem exigência de lista)"],["completo","Rider completo do artista"],["univ","Rider universitário"],["social","Rider eventos sociais (se houver)"],["local","Rider local (combo da casa)"],["custom","Personalizado"]]],
 ["rhtxt","Texto do rider personalizado (um item por linha)","area"],
 ["fx","Incluir rider de efeitos (WhatsApp)","sel",[["nao","Não"],["sim","Sim"]]],
 ["payee","Chave PIX no contrato","sel",[["artista","Chave do artista"],["drom","Chave da DROM"]]],
 ["vform","Validade da proposta formal (dias)","txt"],["vwa","Validade da proposta no WhatsApp (dias)","txt"],["docdata","Data do documento","date"]];
function buildOpts(){var r=cur_(),a=cur.a,h="";
  OPTS.forEach(function(o){var v=opt(r,a,o[0]),w=o[2]==="area"?"wf":"";
    h+='<label class="'+w+'" id="ol_'+o[0]+'"><span>'+o[1]+'</span>';
    if(o[2]==="sel")h+='<select data-o="'+o[0]+'" id="o_'+o[0]+'">'+o[3].map(function(x){return'<option value="'+x[0]+'"'+(x[0]===v?" selected":"")+">"+x[1]+"</option>"}).join("")+"</select>";
    else if(o[2]==="area")h+='<textarea rows="3" data-o="'+o[0]+'" id="o_'+o[0]+'">'+esc(v)+"</textarea>";
    else h+='<input type="'+(o[2]==="date"?"date":"text")+'" data-o="'+o[0]+'" id="o_'+o[0]+'" value="'+esc(v)+'">';
    h+="</label>"});
  $("optg").innerHTML=h;
  $("optg").querySelectorAll("[data-o]").forEach(function(e){e.addEventListener("input",function(){var o=OV[key(cur.a,cur.p.n)]||(OV[key(cur.a,cur.p.n)]={});o["o_"+e.dataset.o]=e.value;optVis();renderAll()})});optVis()}
function optVis(){var r=cur_(),a=cur.a;$("ol_rhtxt").hidden=opt(r,a,"rh")!=="custom"}
function setTab(t){tab=t;$("opt").hidden=!(t==="p"||t==="c");if(t==="p"||t==="c")$("t-"+t).insertBefore($("opt"),$("t-"+t).firstChild);["d","p","c"].forEach(function(k){$("t-"+k).hidden=k!==t});document.querySelectorAll(".tabs button").forEach(function(b){b.classList.toggle("on",b.dataset.t===t)})}

/* ---------- init ---------- */
(function(){
  var arts=ORDER.filter(function(a){return BASE[a]&&BASE[a].p.length});
  $("art").innerHTML='<option value="">Selecionar</option>'+arts.map(function(a){return'<option value="'+a+'">'+esc(a)+"</option>"}).join("");
  $("art").value="";fillProps();
  $("art").onchange=function(){$("q").value="";$("sres").hidden=true;fillProps()};
  $("prop").onchange=pick;$("flt").onchange=function(){fillProps($("prop").value)};
  var qt;$("q").oninput=function(){clearTimeout(qt);qt=setTimeout(showRes,120)};
  $("q").onfocus=function(){if($("q").value.trim())showRes()};
  $("q").onkeydown=function(e){var bs=$("sres").querySelectorAll("button");if(e.key==="Escape"){$("sres").hidden=true}else if(e.key==="Enter"){e.preventDefault();if(!$("sres").hidden&&SR.length)chooseRes(SI)}else if((e.key==="ArrowDown"||e.key==="ArrowUp")&&bs.length){e.preventDefault();SI=Math.max(0,Math.min(bs.length-1,SI+(e.key==="ArrowDown"?1:-1)));bs.forEach(function(b,i){b.classList.toggle("on",i===SI)});bs[SI].scrollIntoView({block:"nearest"})}};
  document.addEventListener("click",function(e){if(!e.target.closest||!e.target.closest(".sq"))$("sres").hidden=true});
  document.querySelectorAll(".tabs button").forEach(function(b){b.onclick=function(){setTab(b.dataset.t)}});
  document.querySelectorAll("[data-copy]").forEach(function(b){b.onclick=function(){copyEl(b.dataset.copy)}});
  document.querySelectorAll("[data-dl]").forEach(function(b){b.onclick=function(){dl(b.dataset.dl,b.dataset.doc)}});
  document.querySelectorAll("#wseg button").forEach(function(b){b.onclick=function(){wmode=b.dataset.w;document.querySelectorAll("#wseg button").forEach(function(x){x.classList.toggle("on",x===b)});renderAll()}});
  $("gen").onclick=function(){var r=cur_(),a=cur.a;$("ag-t").value=agendaTitulo(r,a);$("ag-d").value=agendaDesc(r,a);$("ag-l").href=calLink(r,a);$("agout").hidden=false;$("agout").scrollIntoView({block:"nearest"})};
  $("cpbtn").onclick=applyDados;$("rst").onclick=function(){delete OV[key(cur.a,cur.p.n)];buildForms();buildOpts();renderSum();renderAll();toast("Dados restaurados da base")};
})();
