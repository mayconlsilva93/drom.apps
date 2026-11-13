/* DROM Sync — planilha BASECLAUDE → GitHub (apps), a cada 5 min.
   Projeto Apps Script SEPARADO do "DROM Notificações".
   Propriedades do script (Configurações do projeto → Propriedades do script):
     GH_TOKEN  = token do GitHub (fine-grained, só o repositório "sistema", permissão Actions: Read and write)
     SHEET_KEY = a mesma chave cadastrada no segredo SHEET_KEY do GitHub
   Depois de colar: rode a função "instalar" uma vez (autoriza e cria o gatilho de 5 min) e publique como app da web. */
var SID = '1mVTNZVm44XGn5j7zB8EY6JorD5TpDRn4BvuOFwi2cq8';
var TABS = ['01-RAMONSTRO','02-BRINQUINHO','03-CARLOTO','04-SENA','05-CENOURA','06-LIQUINHO','07-MANEIRA','08-AMARO','09-JOSU','10-CADU VIEIRA'];
var WF = 'https://api.github.com/repos/mayconlsilva93/sistema/actions/workflows/sheet.yml/dispatches';
function P(k) { return PropertiesService.getScriptProperties().getProperty(k); }

/* GitHub busca aqui as linhas (valores como aparecem na planilha) */
function doGet(e) {
  if (!e || !e.parameter || e.parameter.k !== P('SHEET_KEY')) return out({err: 'chave'});
  var ss = SpreadsheetApp.openById(SID), r = {b2: ss.getSheetByName('CONTROLE').getRange('B2').getDisplayValue(), tabs: {}};
  TABS.forEach(function (t) {
    var sh = ss.getSheetByName(t); if (!sh) return;
    var n = sh.getLastRow(); if (n < 1) return;
    r.tabs[t] = sh.getRange(1, 1, n, 48).getDisplayValues().filter(function (v) { return /^\s*\d+\s*$/.test(v[0]); });
  });
  return out(r);
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* a cada 5 min: se a planilha mudou desde a última vez, chama o GitHub */
function verificar() {
  var u = String(DriveApp.getFileById(SID).getLastUpdated().getTime()), pr = PropertiesService.getScriptProperties();
  if (pr.getProperty('ULT') === u) return;
  var r = UrlFetchApp.fetch(WF, {method: 'post', muteHttpExceptions: true, contentType: 'application/json',
    headers: {Authorization: 'Bearer ' + P('GH_TOKEN'), Accept: 'application/vnd.github+json'},
    payload: JSON.stringify({ref: 'main'})});
  if (r.getResponseCode() === 204) pr.setProperty('ULT', u); else console.log('GitHub ' + r.getResponseCode() + ': ' + r.getContentText());
}

/* rodar uma vez */
function instalar() {
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'verificar') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('verificar').timeBased().everyMinutes(5).create();
  SpreadsheetApp.openById(SID).getName(); DriveApp.getFileById(SID).getName();
  verificar();
}
