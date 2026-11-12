// DROM · busca inscrições novas no Google Apps Script (criptografadas com a chave do PIN) e junta às existentes
import fs from "fs";import path from "path";import crypto from "crypto";
export async function pull(app,key,subs){
  const url=fs.readFileSync(path.resolve("tools/suburl.txt"),"utf8").trim();
  let l=[];try{const r=await fetch(url+"?app="+encodeURIComponent(app));l=await r.json()}catch(e){console.log("subpull: falha",e.message);return subs}
  const seen=new Set(subs.map(s=>s.endpoint));let n=0;
  for(const x of l){try{const ct=Buffer.from(x.ct,"base64"),d=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(x.iv,"base64"));d.setAuthTag(ct.subarray(-16));
    const s=JSON.parse(Buffer.concat([d.update(ct.subarray(0,-16)),d.final()]).toString());if(s&&s.endpoint&&!seen.has(s.endpoint)){subs.push(s);seen.add(s.endpoint);n++}}catch(e){}}
  console.log("subpull: "+l.length+" recebida(s), "+n+" nova(s)");return subs}

/* Hub: inscrições do app "hub" (criptografadas com a mesma chave dos artistas); manda a mensagem com o nome do artista no título */
let HUBS=null;
export async function hubSubs(key){if(HUBS)return HUBS;HUBS=[];await pull("hub",key,HUBS);return HUBS}
export async function hubSend(webpush,app,key,m,opt){const subs=await hubSubs(key);if(!subs.length)return;
  let nm=app;try{nm=JSON.parse(fs.readFileSync(path.resolve("tools/names.json"),"utf8"))[app]||app}catch(e){}
  const x=Object.assign({},m,{t:"["+String(nm).replace(/^DJ /,"")+"] "+m.t});if(m.tag)x.tag="h-"+m.tag;if(m.close)x.close="h-"+m.close;
  for(const s of subs){try{await webpush.sendNotification(s,JSON.stringify(x),opt||{TTL:86400})}catch(e){console.log("hub erro",e.statusCode||e.message)}}}
