// DROM · lembrete pontual "falta 1 hora" (GitHub Action, roda às :20 e cobre a hora cheia seguinte).
// Uso: DROM_PIN=x node tools/lembrete.mjs maneira038
import fs from "fs";import path from "path";import crypto from "crypto";import webpush from "web-push";import {createRequire} from "module";import {pull,hubSend,hubSubs} from "./subpull.mjs";
if(!process.env.DROM_PIN){console.error("Falta o segredo DROM_PIN");process.exit(1)}
const require=createRequire(import.meta.url),app=process.argv[2],P=f=>path.join(app,f);
const {dromStart,dromLn}=require(path.resolve(app,"diff.js"));
const D=JSON.parse(fs.readFileSync(P("d.json"))),key=crypto.pbkdf2Sync(process.env.DROM_PIN,Buffer.from(D.salt,"base64"),200000,32,"sha256");
const dec=(iv,ct)=>{ct=Buffer.from(ct,"base64");const d=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(iv,"base64"));d.setAuthTag(ct.subarray(-16));return JSON.parse(Buffer.concat([d.update(ct.subarray(0,-16)),d.final()]).toString())};
const get=f=>fs.existsSync(P(f))?(x=>dec(x.iv,x.ct))(JSON.parse(fs.readFileSync(P(f)))):null;
const S=dec(D.iv,D.ct).S,subs=get("subs.json")||[],vp=get("vp.json"),H=36e5;
/* Programação antecipada: cada rodada cobre do fim da anterior (lem.json) até agora + 3 h, espera e envia na hora exata.
   O GitHub atrasa/pula o cron; com 3 h de folga não há buraco. Aviso que passou da hora há até 30 min sai na hora (atrasado), mais que isso é descartado. */
const LF=P("lem.json"),now=Date.now();let L={};try{L=JSON.parse(fs.readFileSync(LF))}catch(e){}
if(process.env.PLAN){const s0=Math.max(L.e||now,now-30*60e3),e0=Math.max(now+3*H,L.e||0);fs.writeFileSync(LF,JSON.stringify({s:s0,e:e0}));console.log(app,"janela",new Date(s0).toISOString(),"→",new Date(e0).toISOString());process.exit(0)}
const slot=L.s||now,end=L.e||now+H;
await pull(app,key,subs);
const due=S.map(s=>({s,t:dromStart(s,2023)})).filter(x=>x.t&&x.t-H>=slot&&x.t-H<end).sort((a,b)=>a.t-b.t);
console.log(due.length+" lembrete(s) entre "+new Date(slot).toISOString()+" e "+new Date(end).toISOString()+", "+subs.length+" inscrição(ões)");
const hs=await hubSubs(key);
if((!subs.length&&!hs.length)||!vp)process.exit(0);
webpush.setVapidDetails("https://instagram.com/dromentretenimento",vp.publicKey,vp.privateKey);
for(const {s,t} of due){const w=t-H-Date.now();if(w>0)await new Promise(r=>setTimeout(r,w));
  const tag="f1h-"+s[14],m={t:"Falta 1 hora!",b:dromLn(s,2023,{faixa:1}),tag};
  for(const sb of subs){try{await webpush.sendNotification(sb,JSON.stringify(m),{TTL:3600,urgency:"high"})}catch(e){console.log("erro",e.statusCode||e.message)}}
  await hubSend(webpush,app,key,m,{TTL:3600,urgency:"high"});
  console.log("enviado",new Date().toISOString())}
/* fechamentos (Android; no iPhone a Apple não permite apagar): "Falta 1 hora!" 15 min após o início; "Hoje tem show!" às 14h (5 h depois das 9h) */
const BRd=t=>new Date(t-3*H),cl=[];
for(const s of S){const t=dromStart(s,2023);if(t&&t+15*60e3>=slot&&t+15*60e3<end)cl.push({t:t+15*60e3,tag:"f1h-"+s[14]})}
{const d0=BRd(slot),ini=Date.UTC(d0.getUTCFullYear(),d0.getUTCMonth(),d0.getUTCDate())+3*H;for(const d of [ini,ini+24*H]){const t=d+14*H;if(t>=slot&&t<end&&S.some(s=>Date.UTC(2023,s[19]-1,s[0])+3*H===d))cl.push({t,tag:"hoje-"+new Date(d-3*H).toISOString().slice(0,10)})}}
cl.sort((a,b)=>a.t-b.t);
for(const c of cl){const w=c.t-Date.now();if(w>0)await new Promise(r=>setTimeout(r,w));
  for(const sb of subs){if(/apple\.com/.test(sb.endpoint))continue;try{await webpush.sendNotification(sb,JSON.stringify({close:c.tag}),{TTL:1800})}catch(e){}}
  for(const sb of hs){if(/apple\.com/.test(sb.endpoint))continue;try{await webpush.sendNotification(sb,JSON.stringify({close:"h-"+c.tag}),{TTL:1800})}catch(e){}}}
