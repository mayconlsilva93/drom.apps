#!/usr/bin/env python3
"""DROM · envia os dados dos apps ao GitHub sem acesso de escrita (tarefas agendadas).
Uso: DROM_BKK=... DROM_PIN=... python3 relay.py /home/claude/w/gh.json
Baixa apps.json e os d.json atuais (salt) do site, criptografa como enc.py/encbk.py/encpn.py e manda ao Apps Script
(tools/suburl.txt), assinado com HMAC (chave derivada do PIN). A Action relay.yml busca, confere e grava no repo."""
import os,sys,json,base64,datetime,hashlib,hmac,time,urllib.request
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
S='https://dromentretenimento.com/sistema/'
def get(p):
    with urllib.request.urlopen(S+p+'?t=%d'%time.time(),timeout=60) as r:return r.read()
b=lambda x:base64.b64encode(x).decode()
up=(datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(hours=3)).strftime('%d/%m/%Y %H:%M')
PIN=os.environ.get('DROM_PIN','123321').encode();BK=os.environ.get('DROM_BKK')
A=json.loads(get('apps.json'));G=json.load(open(sys.argv[1]));F={};ok=[]
def aes(k,obj):
    iv=os.urandom(12);return {'iv':b(iv),'ct':b(AESGCM(k).encrypt(iv,json.dumps(obj,ensure_ascii=False).encode(),None))}
for k,v in G.items():
    if k=='painel' and BK:
        d=aes(base64.b64decode(BK),{'data.js':open(v['path'],encoding='utf8').read()});d['up']=up;F['painel/pd.json']=json.dumps(d);ok.append(k);continue
    if k=='booker' and BK:
        fs=['data.js']+['b%d.js'%i for i in range(10)]
        d=aes(base64.b64decode(BK),{f:open(os.path.join(v['dir'],f),encoding='utf8').read() for f in fs if os.path.exists(os.path.join(v['dir'],f))});d['up']=up
        F['booker/bk.json']=json.dumps(d);ok.append(k);continue
    if k not in A:continue
    t=open(v['path'],encoding='utf8').read().strip();i=t.index('window.DROMDATA=');js=t[i+16:].rstrip(';').strip()
    data=json.dumps(json.loads(js),ensure_ascii=False,separators=(',',':')).encode()
    try:salt=base64.b64decode(json.loads(get(A[k]+'/d.json'))['salt'])
    except Exception:salt=os.urandom(16)
    key=PBKDF2HMAC(hashes.SHA256(),32,salt,200000).derive(PIN);iv=os.urandom(12)
    F[A[k]+'/d.json']=json.dumps({'salt':b(salt),'iv':b(iv),'ct':b(AESGCM(key).encrypt(iv,data,None)),'up':up});ok.append(A[k])
if not F:print('RELAY_OK nada');sys.exit()
ts=str(int(time.time()*1000));body=json.dumps(F,sort_keys=True,separators=(',',':'))
sig=hmac.new(hashlib.sha256(b'drom-relay:'+PIN).digest(),(ts+body).encode(),'sha256').hexdigest()
url=get('tools/suburl.txt').decode().strip()
req=urllib.request.Request(url,data=json.dumps({'gh':1,'ts':ts,'f':body,'sig':sig}).encode(),headers={'Content-Type':'text/plain'})
r=urllib.request.urlopen(req,timeout=120).read().decode()
if '"ok"' not in r:print('RELAY_FALHOU',r[:200]);sys.exit(1)
print('RELAY_OK',','.join(ok))
