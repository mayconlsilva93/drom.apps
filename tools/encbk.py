#!/usr/bin/env python3
"""DROM · criptografa os dados do Booker para o GitHub. Uso (raiz do repo): DROM_BKK=<chave base64> python3 tools/encbk.py <pasta com data.js e b0..b9.js> [a1.js]
Gera booker/bk.json (dados) e, se receber a1.js, booker/a1.json (modelos e fontes). Chave AES-GCM de 32 bytes guardada só no h.json (protegido pelo login do Hub)."""
import os,sys,json,base64,datetime
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
k=base64.b64decode(os.environ['DROM_BKK']);b=lambda x:base64.b64encode(x).decode()
def enc(obj,out,up=True):
    iv=os.urandom(12);d={'iv':b(iv),'ct':b(AESGCM(k).encrypt(iv,json.dumps(obj,ensure_ascii=False).encode(),None))}
    if up:d['up']=(datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(hours=3)).strftime('%d/%m/%Y %H:%M')
    json.dump(d,open(out,'w'));print(out,os.path.getsize(out))
src=sys.argv[1];F=['data.js']+['b%d.js'%i for i in range(10)]
enc({f:open(os.path.join(src,f),encoding='utf8').read() for f in F if os.path.exists(os.path.join(src,f))},'booker/bk.json')
if len(sys.argv)>2:enc({'a1.js':open(sys.argv[2],encoding='utf8').read()},'booker/a1.json',False)
