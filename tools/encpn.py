#!/usr/bin/env python3
"""DROM · criptografa os dados do Painel para o GitHub. Uso (raiz do repo): DROM_BKK=<chave> python3 tools/encpn.py <caminho do data.js>  → painel/pd.json"""
import os,sys,json,base64,datetime
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
k=base64.b64decode(os.environ['DROM_BKK']);b=lambda x:base64.b64encode(x).decode();iv=os.urandom(12)
d={'iv':b(iv),'ct':b(AESGCM(k).encrypt(iv,json.dumps({'data.js':open(sys.argv[1],encoding='utf8').read()},ensure_ascii=False).encode(),None)),'up':(datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(hours=3)).strftime('%d/%m/%Y %H:%M')}
json.dump(d,open('painel/pd.json','w'));print('painel/pd.json',os.path.getsize('painel/pd.json'))
