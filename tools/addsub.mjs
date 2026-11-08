// DROM · cadastra o aparelho enviado pelo app (issue "sub <app>"). Uso: DROM_PIN=x node tools/addsub.mjs <app> <arquivo com o corpo da issue>
import fs from "fs";import path from "path";import crypto from "crypto";
if(!process.env.DROM_PIN){console.error("Falta DROM_PIN");process.exit(1)}
const app=process.argv[2];if(!/^[a-z0-9]+$/.test(app)||!fs.existsSync(path.join(app,"d.json"))){console.error("app inválido");process.exit(1)}
const P=f=>path.join(app,f),D=JSON.parse(fs.readFileSync(P("d.json"))),key=crypto.pbkdf2Sync(process.env.DROM_PIN,Buffer.from(D.salt,"base64"),200000,32,"sha256");
const dec=(iv,ct)=>{ct=Buffer.from(ct,"base64");const d=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(iv,"base64"));d.setAuthTag(ct.subarray(-16));return JSON.parse(Buffer.concat([d.update(ct.subarray(0,-16)),d.final()]).toString())};
const put=(f,o)=>{const iv=crypto.randomBytes(12),c=crypto.createCipheriv("aes-256-gcm",key,iv),ct=Buffer.concat([c.update(JSON.stringify(o)),c.final(),c.getAuthTag()]);fs.writeFileSync(P(f),JSON.stringify({iv:iv.toString("base64"),ct:ct.toString("base64")}))};
const b=JSON.parse(fs.readFileSync(process.argv[3],"utf8")),s=dec(b.iv,b.ct);
if(!s.endpoint||!/^https:\/\//.test(s.endpoint)){console.error("inscrição inválida");process.exit(1)}
const x=fs.existsSync(P("subs.json"))?JSON.parse(fs.readFileSync(P("subs.json"))):null,L=(x?dec(x.iv,x.ct):[]).filter(z=>z.endpoint!==s.endpoint);
L.push(s);put("subs.json",L);console.log(L.length+" aparelho(s)");
