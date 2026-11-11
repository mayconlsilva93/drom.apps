// DROM · lembrete pontual "falta 1 hora" (GitHub Action, roda às :50 e cobre a hora cheia seguinte).
// Uso: DROM_PIN=x node tools/lembrete.mjs maneira038
import fs from "fs";import path from "path";import crypto from "crypto";import webpush from "web-push";import {createRequire} from "module";
if(!process.env.DROM_PIN){console.error("Falta o segredo DROM_PIN");process.exit(1)}
const require=createRequire(import.meta.url),app=process.argv[2],P=f=>path.join(app,f);
const {dromStart}=require(path.resolve(app,"diff.js"));
const D=JSON.parse(fs.readFileSync(P("d.json"))),key=crypto.pbkdf2Sync(process.env.DROM_PIN,Buffer.from(D.salt,"base64"),200000,32,"sha256");
const dec=(iv,ct)=>{ct=Buffer.from(ct,"base64");const d=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(iv,"base64"));d.setAuthTag(ct.subarray(-16));return JSON.parse(Buffer.concat([d.update(ct.subarray(0,-16)),d.final()]).toString())};
const get=f=>fs.existsSync(P(f))?(x=>dec(x.iv,x.ct))(JSON.parse(fs.readFileSync(P(f)))):null;
const S=dec(D.iv,D.ct).S,subs=get("subs.json")||[],vp=get("vp.json"),H=36e5;
const now=Date.now(),slot=Math.floor((now+15*60e3)/H)*H,end=slot+H; // hora cheia coberta por esta rodada
const due=S.map(s=>({s,t:dromStart(s,2023)})).filter(x=>x.t&&x.t-H>=slot&&x.t-H<end).sort((a,b)=>a.t-b.t);
console.log(due.length+" lembrete(s) entre "+new Date(slot).toISOString()+" e "+new Date(end).toISOString()+", "+subs.length+" inscrição(ões)");
if(!due.length||!subs.length||!vp)process.exit(0);
webpush.setVapidDetails("https://instagram.com/dromentretenimento",vp.publicKey,vp.privateKey);
for(const {s,t} of due){const w=t-H-Date.now();if(w>0)await new Promise(r=>setTimeout(r,w));
  const m={t:"Falta 1 hora para o seu show",b:(s[1]||s[2])+" às "+s[4]+" — "+s[2]+" ("+s[3]+")"};
  for(const sb of subs){try{await webpush.sendNotification(sb,JSON.stringify(m),{TTL:3600,urgency:"high"})}catch(e){console.log("erro",e.statusCode||e.message)}}
  console.log("enviado",new Date().toISOString())}
