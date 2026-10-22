// KITS: claude

const Y='#f2c230',O='#e8572a',G='#7dffc4',B='#58b8d0',P='#b37cff',SUBC='rgba(227,236,238,.8)';

/* 先翻譯再換行：英文以單字為單位，中日文以字為單位並避開行首標點 */
function wrapL(t,maxW,size,weight){
  t=tr(t);const out=[];
  const en=LANG==='en';
  const toks=en?t.split(/(\s+)/):[...t];
  let line='';
  const NOHEAD='，。、；：？！」』）〕】》,.;:?!)';
  for(const tk of toks){
    const test=line+tk;
    if(line&&wtw(test,size,weight)>maxW){
      if(!en&&NOHEAD.includes(tk)){line=test;continue;}
      out.push(line.trim());line=en?tk.trimStart():tk;
    }else line=test;
  }
  if(line.trim())out.push(line.trim());
  return out;
}
function para(x,y,t,maxW,size,col,weight,lh,align){
  const L=wrapL(t,maxW,size,weight);lh=lh||size*1.45;
  L.forEach((s,i)=>wt(x,y+i*lh,s,size,col,weight,align));
  return L.length;
}
function winFrame(x,y,w,h,title){
  rrp(x,y,w,h,12);ctx.fillStyle=KC.winBg;ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1.5;ctx.stroke();
  rrp(x,y,w,44,12);ctx.fillStyle=KC.winBar;ctx.fill();
  box(x,y+32,w,12,KC.winBar,'none',0);ln([x,y+44,x+w,y+44],KC.border,1);
  [KC.orange,KC.accent,KC.green].forEach((c,i)=>circ(x+20+i*18,y+22,5,c,'none',0));
  wt(x+w/2,y+29,title,17,KC.text,600,'center');
}
/* 對話泡泡：自動換行，回傳高度 */
function bub(x,y,w,text,role,a,hl){
  if(a<=0)return 0;
  const L=wrapL(text,w-36,18,500),h=48+L.length*27;
  alphaDo(ease(clamp(a,0,1)),()=>{
    rrp(x,y,w,h,12);ctx.fillStyle=role==='user'?KC.userBub:KC.aiBub;ctx.fill();
    if(hl){ctx.strokeStyle=hl;ctx.lineWidth=2;ctx.stroke();}
    wt(role==='user'?x+w-18:x+18,y+24,role==='user'?'你':'Claude',14,role==='user'?'#7dc8dc':Y,700,role==='user'?'right':'left');
    L.forEach((s,i)=>wt(x+18,y+52+i*27,s,18,KC.text,500));
  });
  return h;
}
function toggle(x,y,on){
  rrp(x,y,64,32,16);ctx.fillStyle=on>.5?'rgba(125,255,196,.35)':'rgba(255,255,255,.12)';ctx.fill();
  ctx.strokeStyle=on>.5?G:KC.border;ctx.lineWidth=1.5;ctx.stroke();
  circ(lerp(x+16,x+48,on),y+16,11,on>.5?G:'#9fb4c2','none',0);
}
function checkBox(x,y,a){
  rrp(x,y,34,34,7);ctx.fillStyle=a>0?'rgba(125,255,196,.15)':'rgba(255,255,255,.06)';ctx.fill();
  ctx.strokeStyle=a>0?G:KC.border;ctx.lineWidth=2;ctx.stroke();
  if(a>0)ln(partial([{x:x+8,y:y+18},{x:x+15,y:y+26},{x:x+27,y:y+9}],ease(a)).flatMap(p=>[p.x,p.y]),G,4);
}
function sceneBG(){diagBG();claudeBase();floatParticles(22,7);}


function human(x,y,a,label){
  alphaDo(a,()=>{card(x,y,360,64,{bg:'rgba(125,255,196,.1)',st:G,lw:2});checkRing(x+34,y+32,G);wt(x+62,y+39,label,19,G,700);});
}
function check(x,y,on,col){ring(x,y,13,on?col:'rgba(255,255,255,.3)',2);if(on)ln([x-6,y,x-1,y+6,x+7,y-6],col,3);}
function checkRing(x,y,col){ring(x,y,13,col,2);ln([x-6,y,x-1,y+6,x+7,y-6],col,3);}
function caseTag(x,y,kind,a){
  const M={life:['生活',B],auto:['智慧自動化',Y],wind:['風能運維',G]}[kind];
  alphaDo(a,()=>tag(x,y,M[0],{size:16,bg:M[1]}));
}

function slideBox(x,y,w,h,title,a,col,lines){
  alphaDo(a,()=>{box(x,y,w,h,'#f6f9f8','rgba(255,255,255,.4)',1.5);box(x,y,w,6,col||Y,'none',0);
    wt(x+14,y+34,title,Math.min(22,Math.max(15,h/6)),'#13232e',800);
    (lines||[]).forEach((l,i)=>{circ(x+22,y+h*.5+i*h*.17-2,3.5,col||Y,'none',0);wt(x+34,y+h*.5+i*h*.17+2,l,Math.min(18,Math.max(14,h/9)),'#4f6470',600);});});
}
function strike(x,y,w,col){ln([x,y,x+w,y],col,2.5);}
/* 表格輔助：畫一列儲存格 */
function cells(x,y,cols,vals,h,hdr,colors){
  let cx=x;
  cols.forEach((w,i)=>{
    const c=colors&&colors[i];
    box(cx,y,w,h,hdr?'rgba(88,184,208,.18)':(c?c[0]:'rgba(255,255,255,.05)'),c?c[1]:'rgba(255,255,255,.15)',c?2:1);
    wt(cx+10,y+h/2+6,vals[i],hdr?17:18,hdr?B:(c?c[1]:KC.text),hdr?700:600);
    cx+=w;
  });
}
function clock(x,y,r,a,col){
  ring(x,y,r,col,3);
  const ang=-Math.PI/2+a*Math.PI*2;
  ln([x,y,x+Math.cos(ang)*r*.75,y+Math.sin(ang)*r*.75],col,4);
  ln([x,y,x,y-r*.5],col,3);circ(x,y,4,col,'none',0);
}
function bar(x,y,w,h,v,col){box(x,y,w,h,'rgba(255,255,255,.08)','none',0);box(x,y,w*v,h,col,'none',0);}
function pipe(x,y,steps,a,cols){
  steps.forEach((s,i)=>{const aa=clamp(a*steps.length-i,0,1);if(aa<=0)return;
    alphaDo(aa,()=>{card(x+i*226,y,206,92,{bg:'rgba(7,27,39,.85)',st:cols[i%cols.length],lw:2});wt(x+i*226+103,y+54,s,21,'#fff',800,'center');if(i<steps.length-1)arrow(x+i*226+208,y+46,x+i*226+224,y+46,Y,3);});});
}
/* 024-project-dev-ep06 — 擴充 Claude Code
   Claude AI 應用動畫館｜專案開發 第 6 集
   依 code.claude.com 文件（Memory：CLAUDE.md 位置、/init、建議少於 200 行、CLAUDE.md 是上下文而非強制設定；Subagents：.claude/agents、name／description／tools、獨立上下文；Slash commands／Skills：.claude/commands、$ARGUMENTS；MCP：claude mcp add、.mcp.json、專案伺服器需核准、只連線可信伺服器；Hooks：settings.json、PostToolUse、PreToolUse、exit code 2 擋下動作）查證，資訊截至 2026-10 */

function fileTag(x,y,w,txt,col){rrp(x,y,w,38,8);ctx.fillStyle='rgba(7,27,39,.9)';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();wt(x+14,y+26,txt,18,col,700);}
function node(x,y,w,h,txt,col,a,sz){alphaDo(a===undefined?1:a,()=>{card(x,y,w,h,{bg:'rgba(7,27,39,.85)',st:col,lw:2});wt(x+w/2,y+h/2+8,txt,sz||21,'#fff',800,'center');});}
function codeLine(x,y,txt,col){wt(x,y,txt,19,col||KC.text,600);}
const EP={no:6,slug:'project-dev',t:'擴充 Claude Code',en:'Extending Claude Code',
seriesName:'專案開發',total:8,
lede:'Claude Code 預設已經很能幹，但你可以把專案規則寫進 CLAUDE.md、把常用流程做成斜線指令、把專門工作交給子代理、用 MCP 接上外部資料、用 hooks 讓規則一定執行。這一集用社團網站、產線程式與運維系統示範；每一種擴充，都要先確認來源可信、權限夠小。',
facts:[['CLAUDE.md','專案規則與慣例','每次開工都會載入，建議精簡'],['斜線指令','常用流程一鍵重複','存成 Markdown，可用 $ARGUMENTS'],['子代理','專門角色、獨立上下文','只把結論帶回主對話'],['MCP','接上外部工具與資料','只連可信伺服器，優先唯讀'],['Hooks','在固定時機自動執行','要「一定做到」的規則交給它']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「CLAUDE.md 可放在專案根目錄或 .claude/ 資料夾、/init 可產生起始檔、建議每份少於 200 行、CLAUDE.md 是上下文而非強制設定，要擋下動作請用 PreToolUse hook」依 Claude Code 文件（Memory）整理；「子代理是 .claude/agents/ 下的 Markdown 檔，需 name 與 description，可限制 tools，使用獨立上下文並只回傳摘要」依 Subagents 文件整理；「自訂斜線指令放在 .claude/commands/，可用 $ARGUMENTS，並已與 skills 整合」依 Slash commands 文件整理；「claude mcp add、.mcp.json（專案範圍）、專案伺服器首次需核准、只連線可信伺服器以避免提示注入」依 MCP 文件整理；「hooks 設定在 settings.json，PostToolUse 可於編輯後格式化，PreToolUse 以 exit code 2 擋下動作」依 Hooks 文件整理。資訊截至 2026-10，功能與介面仍在調整，請以官方最新說明為準。檔名、規則、指令、工單與感測數值均為虛構的示意或典型範例，並非任何特定單位、公司、機組或案場資料；實際流程請依團隊規範與現場規定。AI 提供分析與建議，停機、上鎖掛牌與對 PLC 寫入或下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 CLAUDE.md（生活＋智慧自動化，圖解） */
{t:'CLAUDE.md：專案記憶',en:'CLAUDE.md: project memory',dur:14,
 d:'每次開新對話，Claude 都是從零開始。把專案的規則寫進 CLAUDE.md，放在專案根目錄，每次開工都會自動載入。社團網站可以寫：文章用口語、標題不超過十五個字。產線專案可以寫：設備代號用大寫加數字、壓力一律用 kPa。要寫具體、精簡，建議少於兩百行。可以用 init 指令產生起始檔。',
 s:[[0,'每次開新對話都從零開始'],[.4,'規則寫進 CLAUDE.md'],[.76,'具體、精簡、少於 200 行']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);caseTag(210,150,'auto',1);
  alphaDo(seg(u,.02,.14),()=>{card(60,200,420,120,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,250,'沒有 CLAUDE.md',22,O,800);wt(90,290,'每次都要重講規則',19,SUBC,600);});
  alphaDo(seg(u,.16,.3),()=>{arrow(490,260,560,260,Y,4);fileTag(570,242,250,'CLAUDE.md',Y);wt(570,306,'放在專案根目錄',18,SUBC,600);});
  alphaDo(seg(u,.3,.5),()=>{winFrame(860,190,680,250,'CLAUDE.md（社團網站，示意）');
   ['# 寫作風格','- 文章用口語，不用艱深詞','- 標題不超過 15 個字','- 活動日期寫「月／日」'].forEach((s,i)=>codeLine(888,262+i*44,s,i?KC.text:Y));});
  alphaDo(seg(u,.46,.64),()=>{winFrame(860,460,680,230,'CLAUDE.md（產線專案，示意）');
   ['# 命名與單位','- 設備代號：大寫加數字','- 壓力一律用 kPa'].forEach((s,i)=>codeLine(888,532+i*44,s,i?KC.text:Y));});
  alphaDo(seg(u,.5,.66),()=>{card(60,350,760,130,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(90,398,'每次開工自動載入',23,B,800);para(90,436,'第一次可用 /init 產生起始檔，再自己修改',700,19,SUBC,600,28);});
  alphaDo(seg(u,.72,.84),()=>{card(60,510,760,120,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,558,'具體、精簡、少於 200 行',23,G,800);wt(90,598,'寫太長，遵守度反而下降',19,SUBC,600);});
  alphaDo(seg(u,.86,.97),()=>human(60,730,1,'規則由你撰寫並定期檢查'));
 }},
/* 2 斜線指令（生活，圖解） */
{t:'斜線指令：常用流程一鍵重複',en:'Slash commands: repeat a routine',dur:13,
 d:'同一件事一直重複，就做成斜線指令。在專案的 claude 資料夾下，commands 目錄裡放一個 Markdown 檔，檔名就是指令名稱。例如社團網站的每週活動預告，存成 weekly 檔，之後輸入斜線 weekly 加上日期，就能照同樣的流程產出。指令內容裡用 ARGUMENTS 代表你輸入的參數。放進專案，隊友也能用。現在 skills 也能做同樣的事。',
 s:[[0,'重複的流程'],[.4,'存成 Markdown 檔'],[.76,'輸入指令加參數']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.16),()=>{card(60,200,520,120,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,250,'每週都要重講一遍',22,O,800);wt(90,290,'整理活動、改語氣、排版',19,SUBC,600);});
  alphaDo(seg(u,.2,.4),()=>{fileTag(60,360,520,'.claude/commands/weekly.md',Y);winFrame(60,410,520,260,'weekly.md（示意）');
   ['---','description: 每週活動預告','---','整理 $ARGUMENTS 這週的活動，','用口語、標題不超過 15 字。'].forEach((s,i)=>codeLine(86,480+i*36,s,i<3?B:KC.text));});
  alphaDo(seg(u,.42,.6),()=>{arrow(600,430,660,430,Y,4);card(670,200,870,170,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(700,250,'輸入指令',22,G,800);wt(700,306,'/weekly 10/21 到 10/27',27,'#fff',800);});
  alphaDo(seg(u,.56,.72),()=>{card(670,390,870,150,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(700,440,'照同樣的流程產出',22,B,800);para(700,482,'檔名就是指令名稱，$ARGUMENTS 代表你輸入的內容',810,19,SUBC,600,28);});
  alphaDo(seg(u,.72,.84),()=>{card(670,560,870,110,{bg:'rgba(255,255,255,.05)',st:Y,lw:1.5});para(700,606,'放進專案就能和隊友共用；新功能建議用 skills',810,20,KC.text,700,30);});
  alphaDo(seg(u,.86,.97),()=>human(60,730,1,'產出的活動預告，發布前由你看過'));
 }},
/* 3 子代理（智慧自動化，圖解） */
{t:'子代理：專門角色',en:'Subagents: specialist roles',dur:14,
 d:'子代理是專門做某件事的助手，用 Markdown 檔定義，放在 claude 資料夾的 agents 目錄。檔頭要有名稱和說明，還可以限制能用的工具。它在自己的上下文裡工作，只把結論帶回主對話，不會把你的主對話塞滿。例如產線專案，可以建一個審查代理，只開放讀取與搜尋，專門檢查程式有沒有缺漏。結果由你判斷。',
 s:[[0,'專門角色的助手'],[.42,'自己的上下文，只回結論'],[.76,'只給需要的工具']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.2),()=>{fileTag(60,200,560,'.claude/agents/line-reviewer.md',Y);winFrame(60,250,560,300,'line-reviewer.md（示意）');
   ['---','name: line-reviewer','description: 檢查產線程式','tools: Read, Glob, Grep','---','你是嚴謹的審查員，列出缺漏。'].forEach((s,i)=>codeLine(86,320+i*38,s,i%4===0&&i<5?B:KC.text));});
  node(700,220,300,90,'主對話',B,seg(u,.22,.34));
  alphaDo(seg(u,.3,.46),()=>{arrow(1010,265,1080,265,Y,4);node(1090,220,330,90,'子代理（獨立上下文）',P,1);});
  alphaDo(seg(u,.44,.6),()=>{
   ['讀取 12 個檔案','搜尋 PLC 程式片段'].forEach((s,i)=>wt(1110,350+i*34,s,18,SUBC,600));
   arrow(1250,420,1250,470,G,4);card(1090,480,330,90,{bg:'rgba(125,255,196,.1)',st:G,lw:2});wt(1255,534,'只回傳結論',22,G,800,'center');
   arrow(1080,525,1010,525,G,4);alphaDo(1,()=>{});});
  alphaDo(seg(u,.5,.66),()=>{card(700,350,330,120,{bg:'rgba(255,255,255,.05)',st:'rgba(255,255,255,.3)',lw:1.5});para(720,396,'主對話不會被塞滿',290,20,KC.text,700,30);});
  alphaDo(seg(u,.76,.86),()=>{card(60,590,960,100,{bg:'rgba(255,255,255,.05)',st:Y,lw:2});wt(90,648,'tools 只開 Read、Glob、Grep：可讀，不可改',23,Y,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,730,1,'審查結論由人員判斷，程式修改由人員確認'));
 }},
/* 4 MCP（風能運維，圖解） */
{t:'MCP：連接外部資料',en:'MCP: connect outside data',dur:14,
 d:'MCP 讓 Claude Code 連到外部工具與資料。用 claude mcp add 加入伺服器，範圍選專案，設定會寫在專案根目錄的 mcp.json，團隊共用。以運維為例，接上工單系統，讓 Claude 查詢歷史工單、整理重複故障。專案伺服器第一次使用要你核准。只連你信任的伺服器，並且優先用唯讀的帳號，因為外部內容可能夾帶惡意指令。',
 s:[[0,'連到外部工具與資料'],[.42,'專案範圍，團隊共用'],[.76,'只連可信、優先唯讀']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.2),()=>{card(60,200,780,100,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(90,258,'claude mcp add --scope project cmms …',20,G,700);wt(90,288,'（示意：工單系統的唯讀 MCP 伺服器）',16,SUBC,600);});
  alphaDo(seg(u,.2,.4),()=>{fileTag(60,330,300,'.mcp.json',Y);winFrame(60,380,780,200,'.mcp.json（示意）');
   ['{ "mcpServers": {','  "cmms": { "type": "http", "url": "…" }','} }'].forEach((s,i)=>codeLine(86,450+i*38,s,KC.text));});
  alphaDo(seg(u,.4,.58),()=>{node(900,220,200,84,'Claude Code',B,1);arrow(1110,262,1190,262,Y,4);node(1200,220,200,84,'MCP 伺服器',P,1);arrow(1300,312,1300,360,Y,4);node(1200,370,200,84,'工單系統',G,1);});
  alphaDo(seg(u,.54,.7),()=>{card(900,480,640,120,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(930,528,'查歷史工單、整理重複故障',22,B,800);wt(930,568,'只讀取，不修改工單',19,SUBC,600);});
  alphaDo(seg(u,.62,.78),()=>{card(60,610,780,90,{bg:'rgba(255,255,255,.05)',st:Y,lw:1.5});wt(90,664,'專案伺服器第一次使用，需要你核准',21,Y,800);});
  alphaDo(seg(u,.78,.9),()=>{card(900,620,640,80,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(930,670,'只連可信伺服器，防提示注入',21,O,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'工單處理與設備動作，由人員確認'));
 }},
/* 5 Hooks（智慧自動化＋風能運維，圖解） */
{t:'Hooks：一定做到的規則',en:'Hooks: rules that always run',dur:14,
 d:'CLAUDE.md 是建議，Claude 通常會遵守，但不是強制。要一定做到的事，交給 hooks。hooks 是在固定時機自動執行的指令，設定在 settings 檔。像編輯後自動格式化，用 PostToolUse。更重要的是 PreToolUse：在動作執行前檢查，若是要改受保護的設定檔，例如 PLC 參數，腳本回傳結束碼二，就直接擋下，並告訴 Claude 原因。',
 s:[[0,'CLAUDE.md 是建議'],[.4,'hooks 在固定時機自動執行'],[.74,'PreToolUse 結束碼 2 擋下']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);caseTag(260,150,'wind',1);
  alphaDo(seg(u,.02,.14),()=>{card(60,200,560,100,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(90,248,'CLAUDE.md：建議',22,B,800);wt(90,284,'通常遵守，但不是強制',19,SUBC,600);});
  alphaDo(seg(u,.14,.28),()=>{card(60,320,560,100,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,368,'hooks：確定執行',22,G,800);wt(90,404,'在固定時機自動跑你的指令',19,SUBC,600);});
  alphaDo(seg(u,.3,.46),()=>{[['PostToolUse','編輯後 → 自動格式化',Y],['PreToolUse','動作前 → 檢查，可擋下',O]].forEach((r,i)=>{card(60,450+i*100,560,86,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(86,490+i*100,r[0],21,r[2],800);wt(86,520+i*100,r[1],18,SUBC,600);});});
  alphaDo(seg(u,.42,.6),()=>{winFrame(680,190,860,200,'.claude/settings.json（示意）');
   ['"PreToolUse": [{ "matcher": "Edit|Write",','  "hooks": [{ "type": "command",','  "command": "check-protected.sh" }] }]'].forEach((s,i)=>codeLine(708,262+i*40,s,KC.text));});
  alphaDo(seg(u,.6,.78),()=>{node(680,420,340,84,'要改 plc_params.yaml',B,1,19);arrow(1030,462,1070,462,Y,4);node(1080,420,180,84,'檢查腳本',Y,1,19);arrow(1270,462,1310,462,O,4);node(1320,420,220,84,'結束碼 2：擋下',O,1,19);});
  alphaDo(seg(u,.72,.86),()=>{card(680,530,860,100,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(710,590,'Claude 收到原因，改用別的做法',21,O,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,730,1,'PLC 參數與上鎖掛牌，永遠由人員確認'));
 }},
/* 6 總結（三情境，圖解） */
{t:'五種擴充，各司其職',en:'Five extensions, five jobs',dur:13,
 d:'整理一下：CLAUDE.md 放專案規則，斜線指令重複流程，子代理負責專門工作，MCP 接外部資料，hooks 確保規則一定執行。社團網站、產線專案、運維系統都能用。原則是來源可信、權限夠小、由人決定。下一集，我們把成果部署上線。',
 s:[[0,'五種擴充，各司其職'],[.46,'三個專案，同一套做法'],[.8,'下一集：部署上線']],
 draw(u){
  diagBG();floatParticles(8,61);
  [['CLAUDE.md',Y],['斜線指令',B],['子代理',P],['MCP',G],['Hooks',O]].forEach((r,i)=>alphaDo(seg(u,.02+i*.06,.14+i*.06),()=>{card(60+i*300,180,270,110,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(195+i*300,246,r[0],27,r[1],800,'center');}));
  alphaDo(seg(u,.34,.44),()=>{wt(60,350,'來源可信、權限夠小、由人決定',22,O,700);});
  alphaDo(seg(u,.46,.72),()=>{
   [['生活','社團網站：寫作風格與每週預告',B],['智慧自動化','產線專案：命名規則與檔案保護',Y],['風能運維','運維系統：唯讀工單查詢',G]].forEach((r,i)=>{card(60+i*500,430,480,140,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,448,r[0],{size:17,bg:r[2]});para(86+i*500,520,r[1],430,21,'#fff',800,28);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,660,'把常用的做法固定下來，讓 Claude 更貼近你的專案',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'擴充的來源與權限，由人員決定'));
 }}
]};
