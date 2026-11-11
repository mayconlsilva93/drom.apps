// DROM · avisos de agenda em horário fixo (GitHub Action)
// Uso: DROM_PIN=x node tools/agenda.mjs maneira038 hoje|semana
//  hoje   → "Hoje tem show!" às 9h (todos os shows do dia)
//  semana → "Shows da semana" quarta 21h (shows de quinta a domingo)
import fs from "fs";import path from "path";import crypto from "crypto";import webpush from "web-push";import {pull} from "./subpull.mjs";
if(!process.env.DROM_PIN){console.error("Falta o segredo DROM_PIN");process.exit(1)}
const app=process.argv[2],modo=process.argv[3],P=f=>path.join(app,f);
const D=JSON.parse(fs.readFileSync(P("d.json"))),key=crypto.pbkdf2Sync(process.env.DROM_PIN,Buffer.from(D.salt,"base64"),200000,32,"sha256");
const dec=(iv,ct)=>{ct=Buffer.from(ct,"base64");const d=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(iv,"base64"));d.setAuthTag(ct.subarray(-16));return JSON.parse(Buffer.concat([d.update(ct.subarray(0,-16)),d.final()]).toString())};
const get=f=>fs.existsSync(P(f))?(x=>dec(x.iv,x.ct))(JSON.parse(fs.readFileSync(P(f)))):null;
const S=dec(D.iv,D.ct).S,subs=get("subs.json")||[],vp=get("vp.json");await pull(app,key,subs);
const BR=-3*36e5,W=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],p2=n=>String(n).padStart(2,"0");
const br=t=>new Date(t+BR),dia=s=>Date.UTC(2023,s[19]-1,s[0]); // data da agenda (madrugada fica no dia da agenda)
const hj=br(Date.now()),hoje=Date.UTC(hj.getUTCFullYear(),hj.getUTCMonth(),hj.getUTCDate());
const nome=s=>(s[1]||s[2])+(s[1]&&s[2]&&s[1]!==s[2]?" ("+s[2]+")":"")+" — "+s[3];
const hr=s=>s[4]&&s[4]!=="a definir"?s[4]:"horário a definir";
const ord=(a,b)=>dia(a)-dia(b)||String(a[4]).localeCompare(String(b[4]));
let alvo,m;
if(modo==="hoje"){alvo=hoje+9*36e5-BR;const L=S.filter(s=>dia(s)===hoje).sort(ord);
  if(L.length)m={t:"Hoje tem show!",b:L.map(s=>hr(s)+" · "+nome(s)).join("\n")}}
else if(modo==="semana"){alvo=hoje+21*36e5-BR;const wd=new Date(hoje).getUTCDay(),qui=hoje+((4-wd+7)%7||7)*864e5,dom=qui+3*864e5;
  const L=S.filter(s=>dia(s)>=qui&&dia(s)<=dom).sort(ord);
  if(L.length)m={t:"Shows da semana",b:L.map(s=>{const d=new Date(dia(s));return W[d.getUTCDay()]+" "+p2(d.getUTCDate())+"/"+p2(d.getUTCMonth()+1)+" · "+hr(s)+" · "+nome(s)}).join("\n")}}
console.log(modo,m?m.b.split("\n").length+" show(s)":"sem shows",subs.length+" inscrição(ões)");
if(!m||!subs.length||!vp)process.exit(0);
const w=alvo-Date.now();if(!process.env.FORCE){if(w>36e5||w<-3*36e5){console.log("fora do horário, nada enviado");process.exit(0)}if(w>0)await new Promise(r=>setTimeout(r,w))}
webpush.setVapidDetails("https://instagram.com/dromentretenimento",vp.publicKey,vp.privateKey);
for(const sb of subs){try{await webpush.sendNotification(sb,JSON.stringify(m),{TTL:6*3600})}catch(e){console.log("erro",e.statusCode||e.message)}}
console.log("enviado",new Date().toISOString());
