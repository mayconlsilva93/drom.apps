#!/usr/bin/env python3
"""DROM · sincronização planilha → apps (GitHub Action, a cada 10 min via Apps Script).
Busca todas as linhas das abas de artista (valores exibidos) no web app 'DROM Sync' do Apps Script, roda o lean.py apply
com o estado do repo, criptografa os dados dos apps que mudaram (ghpush) e regrava o estado. DRY=1: só mostra o que mudaria."""
import os,sys,json,subprocess,urllib.request,urllib.parse,re
R=os.getcwd();W='/tmp/w';E=dict(os.environ)
def sh(*a,**k): print('$',' '.join(a[0]) if isinstance(a[0],list) else a[0]);return subprocess.run(*a,check=True,**k)
sh(['python3','tools/sync/state.py','unpack',W])
if E.get('DRY')!='1': sh(['python3','tools/sync/state.py','merge',W])
u=E['SHEET_URL']+('&' if '?' in E['SHEET_URL'] else '?')+urllib.parse.urlencode({'k':E['SHEET_KEY']})
X=json.load(urllib.request.urlopen(u,timeout=300))
if X.get('err'): sys.exit('web app: '+X['err'])
rows=[{'tab':t,'v':[str(c).replace('\r\n','\n').replace('\r','\n') for c in v]} for t,L in X['tabs'].items() for v in L if v and re.match(r'^\s*\d+\s*$',str(v[0]))]
json.dump(rows,open(W+'/rows.json','w',encoding='utf8'),ensure_ascii=False);print(len(rows),'linhas')
b2=X.get('b2') or '-'
if not re.match(r'^\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}$',b2): b2='-'
sh(['python3','-I','lean.py','mark'],cwd=W)
sh(['python3','-I','lean.py','apply',b2,'rows.json'],cwd=W,env=dict(E,DROM_NODEFER='1',DROM_DIFF='1' if E.get('DRY')=='1' else '0'),stdout=subprocess.DEVNULL)
gh=json.load(open(W+'/gh.json'));print('mudaram:',', '.join(sorted(gh)) or 'nada')
rep=open(W+'/report.txt',encoding='utf8').read();print(rep)
if E.get('GITHUB_STEP_SUMMARY'): open(E['GITHUB_STEP_SUMMARY'],'a').write('```\n'+rep+'\nGitHub: '+(', '.join(sorted(gh)) or 'nada')+'\n```\n')
if E.get('DRY')=='1': sys.exit(0)
if gh: sh(['python3','tools/ghpush.py',W+'/gh.json'])
sh(['python3','-I','lean.py','fin','-'],cwd=W,stdout=subprocess.DEVNULL)
sh(['python3','tools/sync/state.py','pack',W])
