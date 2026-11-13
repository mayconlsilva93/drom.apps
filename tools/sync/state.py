#!/usr/bin/env python3
"""DROM · estado da sincronização (scripts + estado + cópia da planilha), criptografado no repo.
Uso: DROM_BKK=... python3 tools/sync/state.py unpack DIR   |   pack DIR
state.enc = AES-GCM(chave = sha256('drom-state:'+DROM_BKK)) de gzip(json {arquivo: texto}). state.sha = sha1 do conteúdo (evita commit sem mudança)."""
import os,sys,json,gzip,hashlib,base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
H=os.path.dirname(os.path.abspath(__file__));ENC=H+'/state.enc';SHA=H+'/state.sha'
F=['lean.py','relay.py','drom_data.py','convert.py','sheets_load.py','lib_apps.py','addr.json','dk.json','urls.json',
   'contracts.json','blocks.json','state.json','extras.json','log.json']+['m%02d.txt'%i for i in range(1,11)]
K=hashlib.sha256(('drom-state:'+os.environ['DROM_BKK']).encode()).digest()
def unpack(d):
    os.makedirs(d,exist_ok=True);b=open(ENC,'rb').read();X=json.loads(gzip.decompress(AESGCM(K).decrypt(b[:12],b[12:],None)))
    for k,v in X.items(): open(os.path.join(d,k),'w',encoding='utf8').write(v)
    print('unpack',len(X))
def pack(d):
    X={k:open(os.path.join(d,k),encoding='utf8').read() for k in F if os.path.exists(os.path.join(d,k))}
    raw=json.dumps(X,ensure_ascii=False,sort_keys=True).encode();h=hashlib.sha1(raw).hexdigest()
    if os.path.exists(SHA) and open(SHA).read().strip()==h: print('estado sem mudança');return
    iv=os.urandom(12);open(ENC,'wb').write(iv+AESGCM(K).encrypt(iv,gzip.compress(raw,9,mtime=0),None));open(SHA,'w').write(h);print('pack',len(X))
if __name__=='__main__':{'unpack':unpack,'pack':pack}[sys.argv[1]](sys.argv[2])
