#!/usr/bin/env python3
"""DROM · (Action relay.yml) busca os lotes no Apps Script, confere a assinatura e grava os arquivos permitidos. Imprime o maior ts aplicado."""
import os,sys,json,hashlib,hmac,re,urllib.request
url=open('tools/suburl.txt').read().strip();PIN=os.environ['DROM_PIN'].encode()
K=hashlib.sha256(b'drom-relay:'+PIN).digest()
L=json.loads(urllib.request.urlopen(url+'?gh=1',timeout=120).read()).get('b',[])
ok=re.compile(r'^([a-z0-9-]+/d\.json|painel/pd\.json|booker/bk\.json)$');mx='';n=0
for x in sorted(L,key=lambda x:int(x['ts'])):
    if not hmac.compare_digest(hmac.new(K,(x['ts']+x['f']).encode(),'sha256').hexdigest(),x.get('sig','')):print('assinatura inválida',x['ts']);continue
    for p,c in json.loads(x['f']).items():
        if not ok.match(p) or not os.path.isdir(p.split('/')[0]):print('ignorado',p);continue
        json.loads(c);open(p,'w').write(c);n+=1
    mx=max(mx,x['ts'],key=lambda s:int(s or 0))
print('arquivos',n,file=sys.stderr);print(mx)
