#!/usr/bin/env python3
"""DROM · estado da sincronização (scripts + estado + cópia da planilha), criptografado no repo.
Uso: DROM_BKK=... python3 tools/sync/state.py unpack DIR   |   pack DIR
state.enc = AES-GCM(chave = sha256('drom-state:'+DROM_BKK)) de gzip(json {arquivo: texto}). state.sha = sha1 do conteúdo (evita commit sem mudança)."""
import os,sys,json,gzip,hashlib,base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
H=os.path.dirname(os.path.abspath(__file__));ENC=H+'/state.enc';SHA=H+'/state.sha'
F=['lean.py','relay.py','drom_data.py','convert.py','sheets_load.py','lib_apps.py','addr.json','dk.json','urls.json',
   'contracts.json','blocks.json','state.json','extras.json','log.json']+['m%02d.txt'%i for i in range(1,11)]
BK=os.environ.get('DROM_BKK','').strip()
if not BK: sys.exit('falta o segredo DROM_BKK')
K=hashlib.sha256(('drom-state:'+BK).encode()).digest()
def unpack(d):
    os.makedirs(d,exist_ok=True);b=open(ENC,'rb').read()
    try: X=json.loads(gzip.decompress(AESGCM(K).decrypt(b[:12],b[12:],None)))
    except Exception: sys.exit('DROM_BKK incorreto (tamanho %d, começa com %s)'%(len(BK),BK[:4]))
    for k,v in X.items(): open(os.path.join(d,k),'w',encoding='utf8').write(v)
    print('unpack',len(X))
def pack(d):
    X={k:open(os.path.join(d,k),encoding='utf8').read() for k in F if os.path.exists(os.path.join(d,k))}
    raw=json.dumps(X,ensure_ascii=False,sort_keys=True).encode();h=hashlib.sha1(raw).hexdigest()
    if os.path.exists(SHA) and open(SHA).read().strip()==h: print('estado sem mudança');return
    iv=os.urandom(12);open(ENC,'wb').write(iv+AESGCM(K).encrypt(iv,gzip.compress(raw,9,mtime=0),None));open(SHA,'w').write(h);print('pack',len(X))
INBOX=H+'/inbox/upd.json'
IN_F=['contracts.json','extras.json']
def send(d):
    """(tarefa do Claude, sem escrita no GitHub) manda contracts.json/extras.json de DIR pela ponte do Apps Script -> tools/sync/inbox/upd.json"""
    import time,hmac,urllib.request
    X={k:open(os.path.join(d,k),encoding='utf8').read() for k in IN_F if os.path.exists(os.path.join(d,k))}
    iv=os.urandom(12);c=json.dumps({'iv':base64.b64encode(iv).decode(),'ct':base64.b64encode(AESGCM(K).encrypt(iv,json.dumps(X,ensure_ascii=False).encode(),None)).decode()})
    F={'tools/sync/inbox/upd.json':c};PIN=os.environ.get('DROM_PIN','123321').encode()
    ts=str(int(time.time()*1000));body=json.dumps(F,sort_keys=True,separators=(',',':'))
    sig=hmac.new(hashlib.sha256(b'drom-relay:'+PIN).digest(),(ts+body).encode(),'sha256').hexdigest()
    url=urllib.request.urlopen('https://dromentretenimento.com/sistema/tools/suburl.txt?t=%d'%time.time(),timeout=60).read().decode().strip()
    r=urllib.request.urlopen(urllib.request.Request(url,data=json.dumps({'gh':1,'ts':ts,'f':body,'sig':sig}).encode(),headers={'Content-Type':'text/plain'}),timeout=120).read().decode()
    print('ENVIO_OK' if '"ok"' in r else 'ENVIO_FALHOU '+r[:200])
def merge(d):
    """(Action) aplica tools/sync/inbox/upd.json em DIR: contratos somados (nunca remove), extras substituídos por artista. Só aceita o que decifra com a chave."""
    if not os.path.exists(INBOX): print('inbox vazio');return
    try:
        o=json.load(open(INBOX));X=json.loads(AESGCM(K).decrypt(base64.b64decode(o['iv']),base64.b64decode(o['ct']),None))
    except Exception: print('inbox inválido (ignorado)');os.remove(INBOX);return
    if 'contracts.json' in X:
        C=json.load(open(os.path.join(d,'contracts.json'))) if os.path.exists(os.path.join(d,'contracts.json')) else {}
        for a,m in json.loads(X['contracts.json']).items(): C.setdefault(a,{}).update(m)
        json.dump(C,open(os.path.join(d,'contracts.json'),'w'),ensure_ascii=False)
    if 'extras.json' in X:
        E=json.load(open(os.path.join(d,'extras.json'),encoding='utf8')) if os.path.exists(os.path.join(d,'extras.json')) else {}
        E.update(json.loads(X['extras.json']));json.dump(E,open(os.path.join(d,'extras.json'),'w',encoding='utf8'),ensure_ascii=False)
    os.remove(INBOX);print('inbox aplicado:',', '.join(X))
if __name__=='__main__':{'unpack':unpack,'pack':pack,'send':send,'merge':merge}[sys.argv[1]](sys.argv[2])
