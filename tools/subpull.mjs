// DROM · busca inscrições novas no Google Apps Script (criptografadas com a chave do PIN) e junta às existentes
import fs from "fs";import path from "path";import crypto from "crypto";
export async function pull(app,key,subs){
  const url=fs.readFileSync(path.resolve("tools/suburl.txt"),"utf8").trim();
  let l=[];try{const r=await fetch(url+"?app="+encodeURIComponent(app));l=await r.json()}catch(e){console.log("subpull: falha",e.message);return subs}
  const seen=new Set(subs.map(s=>s.endpoint));let n=0;
  for(const x of l){try{const ct=Buffer.from(x.ct,"base64"),d=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(x.iv,"base64"));d.setAuthTag(ct.subarray(-16));
    const s=JSON.parse(Buffer.concat([d.update(ct.subarray(0,-16)),d.final()]).toString());if(s&&s.endpoint&&!seen.has(s.endpoint)){subs.push(s);seen.add(s.endpoint);n++}}catch(e){}}
  console.log("subpull: "+l.length+" recebida(s), "+n+" nova(s)");return subs}
