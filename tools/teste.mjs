// DROM · notificação de teste. Uso: DROM_PIN=x node tools/teste.mjs hub|<pasta do app>
import fs from "fs";import crypto from "crypto";import webpush from "web-push";import {pull,hubSubs} from "./subpull.mjs";
const alvo=process.argv[2]||"hub",base=alvo==="hub"?"maneira038":alvo;
const D=JSON.parse(fs.readFileSync(base+"/d.json")),key=crypto.pbkdf2Sync(process.env.DROM_PIN,Buffer.from(D.salt,"base64"),200000,32,"sha256");
const dec=f=>{const x=JSON.parse(fs.readFileSync(f)),ct=Buffer.from(x.ct,"base64"),d=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(x.iv,"base64"));d.setAuthTag(ct.subarray(-16));return JSON.parse(Buffer.concat([d.update(ct.subarray(0,-16)),d.final()]).toString())};
const vp=dec(base+"/vp.json");webpush.setVapidDetails("https://instagram.com/dromentretenimento",vp.publicKey,vp.privateKey);
let subs;if(alvo==="hub")subs=await hubSubs(key);else{subs=fs.existsSync(alvo+"/subs.json")?dec(alvo+"/subs.json"):[];await pull(alvo,key,subs)}
const h=new Date(Date.now()-108e5).toISOString().slice(11,16);let ok=0;
for(const s of subs){try{await webpush.sendNotification(s,JSON.stringify({t:"Notificação de teste",b:"DROM "+(alvo==="hub"?"Hub":alvo)+" · enviada às "+h}),{TTL:3600});ok++}catch(e){console.log("falhou",e.statusCode||e.message)}}
console.log(alvo+": "+ok+" de "+subs.length+" aparelho(s)");
