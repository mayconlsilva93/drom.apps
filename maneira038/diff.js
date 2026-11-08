/* DROM · diferenças entre duas versões da agenda (usado no app e na Action de notificações) */
function dromDiff(A,Bn,B){
  var W=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],p=n=>String(n).padStart(2,"0");
  var dt=s=>{var d=new Date(B,s[19]-1,s[0]);return W[d.getDay()]+" "+p(d.getDate())+"/"+p(d.getMonth()+1)};
  var nm=s=>dt(s)+" · "+(s[1]||s[2]);
  var M=a=>{var m={};(a||[]).forEach(s=>{m[s[14]]=s});return m};
  var a=M(A),b=M(Bn),out=[];
  var F=[[4,"horário"],[5,"duração"],[2,"local"],[3,"cidade"],[1,"evento"],[6,"equipamento"],[7,"rider"],[8,"hospitalidade"],[9,"produção"],[12,"observações"]];
  var du=m=>!m?"a definir":m<60?m+" min":Math.floor(m/60)+"h"+(m%60?p(m%60):"");
  var v=(i,x)=>i===5?du(x):(x===null||x===undefined||x==="")?"—":String(x);
  Object.keys(b).forEach(k=>{var s=b[k],o=a[k];
    if(!o){out.push({k:"novo",t:"Novo show confirmado",b:nm(s)+(s[4]&&s[4]!=="a definir"?" às "+s[4]:"")+" — "+s[2]+", "+s[3]});return}
    if(o[0]!==s[0]||o[19]!==s[19])out.push({k:"alt",t:"Show mudou de data",b:(o[1]||o[2])+": "+dt(o)+" → "+dt(s)});
    var ch=F.filter(f=>String(o[f[0]]??"")!==String(s[f[0]]??"")).map(f=>f[1]+": "+v(f[0],o[f[0]])+" → "+v(f[0],s[f[0]]));
    if(ch.length)out.push({k:"alt",t:"Show alterado",b:nm(s)+" — "+ch.join("; ")});
    if(!o[21]&&s[21]>0&&!s[18])out.push({k:"pag",t:"Sinal pago",b:nm(s)+" — sinal de "+s[21]+"% recebido"+(s[22]?" em "+s[22]:"")});
    if(!o[18]&&s[18])out.push({k:"pag",t:"Cachê pago",b:nm(s)+" — cachê recebido"+(s[18]!=="pago"?" em "+s[18]:"")});
  });
  Object.keys(a).forEach(k=>{if(!b[k])out.push({k:"rem",t:"Show saiu da agenda",b:nm(a[k])})});
  return out;
}
/* início do show em ms (madrugada 00:00–05:59 = dia seguinte); null se "a definir" */
function dromStart(s,B){var m=/^(\d\d):(\d\d)/.exec(s[4]||"");if(!m)return null;var h=+m[1],d=new Date(B,s[19]-1,s[0]+(h<6?1:0),h,+m[2]);return d.getTime()}
if(typeof module!=="undefined")module.exports={dromDiff,dromStart};
