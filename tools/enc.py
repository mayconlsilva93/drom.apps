#!/usr/bin/env python3
"""DROM · criptografa o data.js de um app de artista para o GitHub Pages.
Uso: DROM_PIN=xxxxxx python3 tools/enc.py caminho/data.js maneira
Gera <app>/d.json = {salt, iv, ct, up}; mantém o salt existente (o app reaproveita a chave salva)."""
import os,sys,json,base64,datetime
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
src,app=sys.argv[1],sys.argv[2]
pin=os.environ['DROM_PIN'].encode()
t=open(src,encoding='utf8').read().strip()
i=t.index('window.DROMDATA=');js=t[i+len('window.DROMDATA='):].rstrip(';').strip()
data=json.dumps(json.loads(js),ensure_ascii=False,separators=(',',':')).encode()
out=os.path.join(app,'d.json');b=lambda x:base64.b64encode(x).decode()
salt=None
if os.path.exists(out):
    try: salt=base64.b64decode(json.load(open(out))['salt'])
    except Exception: pass
salt=salt or os.urandom(16)
key=PBKDF2HMAC(hashes.SHA256(),32,salt,200000).derive(pin)
iv=os.urandom(12)
up=(datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(hours=3)).strftime('%d/%m/%Y %H:%M')
json.dump({'salt':b(salt),'iv':b(iv),'ct':b(AESGCM(key).encrypt(iv,data,None)),'up':up},open(out,'w'))
print(out,len(data))
