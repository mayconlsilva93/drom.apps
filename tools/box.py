#!/usr/bin/env python3
"""DROM · arquivos criptografados extras do app (mesma chave do d.json).
  DROM_PIN=x python3 tools/box.py put maneira vp.json '<json>'
  DROM_PIN=x python3 tools/box.py get maneira subs.json
  DROM_PIN=x python3 tools/box.py addsub maneira 'DROM-MANEIRA:...'   (código enviado pelo app)"""
import os,sys,json,base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
cmd,app=sys.argv[1],sys.argv[2]
salt=base64.b64decode(json.load(open(os.path.join(app,'d.json')))['salt'])
key=AESGCM(PBKDF2HMAC(hashes.SHA256(),32,salt,200000).derive(os.environ['DROM_PIN'].encode()))
def get(f):
    p=os.path.join(app,f)
    if not os.path.exists(p): return None
    d=json.load(open(p));return json.loads(key.decrypt(base64.b64decode(d['iv']),base64.b64decode(d['ct']),None))
def put(f,obj):
    iv=os.urandom(12);ct=key.encrypt(iv,json.dumps(obj,separators=(',',':')).encode(),None)
    json.dump({'iv':base64.b64encode(iv).decode(),'ct':base64.b64encode(ct).decode()},open(os.path.join(app,f),'w'))
if cmd=='put': put(sys.argv[3],json.loads(sys.argv[4]))
elif cmd=='get': print(json.dumps(get(sys.argv[3]),ensure_ascii=False))
elif cmd=='addsub':
    c=sys.argv[3].strip();c=c.split(':',1)[1] if c.startswith('DROM-') else c
    s=json.loads(base64.b64decode(c));L=get('subs.json') or []
    L=[x for x in L if x.get('endpoint')!=s['endpoint']]+[s];put('subs.json',L);print(len(L),'inscrição(ões)')
