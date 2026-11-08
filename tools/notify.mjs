// DROM · notificações push (GitHub Action). Uso: DROM_PIN=x node tools/notify.mjs maneira
import fs from "fs";import path from "path";import crypto from "crypto";import webpush from "web-push";import {createRequire} from "module";
if(!process.env.DROM_PIN){console.error("Falta o segredo DROM_PIN (Settings → Secrets and variables → Actions).");process.exit(1)}
const require=createRequire(import.meta.url),app=process.argv[2],P=f=>path.join(app,f);
const {dromDiff,dromStart}=require(path.resolve(app,"diff.js"));
const D=JSON.parse(fs.readFileSync(P("d.json"))),salt=Buffer.from(D.salt,"base64");
const key=crypto.pbkdf2Sync(process.env.DROM_PIN,salt,200000,32,"sha256");
const dec=(iv,ct)=>{ct=Buffer.from(ct,"base64");const d=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(iv,"base64"));d.setAuthTag(ct.subarray(-16));return JSON.parse(Buffer.concat([d.update(ct.subarray(0,-16)),d.final()]).toString())};
const get=f=>fs.existsSync(P(f))?(x=>dec(x.iv,x.ct))(JSON.parse(fs.readFileSync(P(f)))):null;
const put=(f,o)=>{const iv=crypto.randomBytes(12),c=crypto.createCipheriv("aes-256-gcm",key,iv),ct=Buffer.concat([c.update(JSON.stringify(o)),c.final(),c.getAuthTag()]);fs.writeFileSync(P(f),JSON.stringify({iv:iv.toString("base64"),ct:ct.toString("base64")}))};
const B=2023,S=dec(D.iv,D.ct).S,st=get("st.json")||{},subs=get("subs.json")||[],vp=get("vp.json"),now=Date.now(),msgs=[];
if(st.S)dromDiff(st.S,S,B).forEach(x=>msgs.push({t:x.t,b:x.b}));
st.rem=st.rem||{};
const p2=n=>String(n).padStart(2,"0");
for(const s of S){const t=dromStart(s,B);if(!t)continue;const h=(t-now)/36e5,k=s[14];
  if(h>0&&h<=24&&!st.rem[k+"d"]){st.rem[k+"d"]=1;const d=new Date(t);msgs.push({t:"Show amanhã/hoje",b:(s[1]||s[2])+" — "+p2(d.getDate())+"/"+p2(d.getMonth()+1)+" às "+s[4]+", "+s[2]+" ("+s[3]+")"})}
  if(h>0&&h<=3&&!st.rem[k+"h"]){st.rem[k+"h"]=1;msgs.push({t:"Seu show começa em breve",b:(s[1]||s[2])+" às "+s[4]+" — "+s[2]})}}
const first=!st.S;st.S=S;
for(const k of Object.keys(st.rem))if(!S.some(s=>k.startsWith(s[14])))delete st.rem[k];
put("st.json",st);
console.log((first?"estado inicial; ":"")+msgs.length+" mensagem(ns), "+subs.length+" inscrição(ões)");
if(first||!msgs.length||!subs.length||!vp)process.exit(0);
webpush.setVapidDetails("https://instagram.com/dromentretenimento",vp.publicKey,vp.privateKey);
let alive=[];
for(const s of subs){let ok=true;
  for(const m of msgs.slice(0,8)){try{await webpush.sendNotification(s,JSON.stringify(m),{TTL:86400})}catch(e){if(e.statusCode===404||e.statusCode===410){ok=false;break}console.log("erro",e.statusCode||e.message)}}
  if(ok)alive.push(s)}
if(alive.length!==subs.length)put("subs.json",alive);
