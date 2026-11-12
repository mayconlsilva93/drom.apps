#!/usr/bin/env python3
"""DROM · grava no repo os dados dos apps que mudaram. Uso (na raiz do repo): python3 tools/ghpush.py /home/claude/w/gh.json
Criptografa cada data.js (tools/enc.py, PIN dos artistas) e faz git add do d.json. Imprime as pastas atualizadas."""
import json,subprocess,os,sys
A=json.load(open('apps.json'));G=json.load(open(sys.argv[1]));env=dict(os.environ,DROM_PIN=os.environ.get('DROM_PIN','123321'));ok=[]
for k,v in G.items():
    if k=='booker':
        if not os.environ.get('DROM_BKK'):print('booker: falta DROM_BKK');continue
        subprocess.run(['python3','tools/encbk.py',v['dir']],check=True,stdout=subprocess.DEVNULL);subprocess.run(['git','add','booker/bk.json'],check=True);ok.append('booker');continue
    if k not in A: continue
    subprocess.run(['python3','tools/enc.py',v['path'],A[k]],env=env,check=True,stdout=subprocess.DEVNULL)
    subprocess.run(['git','add',A[k]+'/d.json'],check=True);ok.append(A[k])
print('GH atualizados:',','.join(ok) or 'nenhum')
