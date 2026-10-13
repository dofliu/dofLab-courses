// KITS: claude
/* 018-project-dev-overview — 從想法到上線：用 Claude 開發一個專案
   Claude AI 應用動畫館｜專案開發 總覽片
   依 code.claude.com（Claude Code 概觀、擴充功能）與 platform.claude.com 文件查證，資訊截至 2026-10 */


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
const EP={no:0,slug:'project-dev',seriesName:'專案開發系列・總覽片',t:'從想法到上線：用 Claude 開發一個專案',en:'Project Development: Overview',total:8,
lede:'一個專案從想法走到上線，Claude 能幫哪些忙？這支總覽片用家庭記帳網站、產線 OEE 看板與風機警報查詢工具，走過規格、Claude Code、計畫實作測試迴圈、審查、Git、擴充、部署到 API，每一步的決定與合併仍由你負責。',
facts:[['8','個主題','專案開發系列的八集：從規格到 API'],['先計畫','再動手','先在計畫模式看過方案，確認後才實作'],['迴圈','計畫→實作→測試','每一輪都用測試與你的檢查把關'],['5 類','擴充方式','CLAUDE.md、Skills、hooks、MCP、subagents'],['人合併','才上線','審查、合併與部署由人決定']],
note:'說明：本片為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。Claude Code 的計畫模式、CLAUDE.md、Skills、hooks、MCP、subagents 與 Claude API 依 code.claude.com 與 platform.claude.com 文件整理，資訊截至 2026-10，功能與介面仍在調整，請以官方最新說明為準。記帳資料、OEE 數值、風機警報與工單均為虛構的示意或典型範例，並非任何特定公司或案場資料；AI 提供分析與建議，停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 全景路線 */
{t:'專案開發全景',en:'The whole project path',dur:12,
 d:'一個專案從想法到上線，可以拆成八步：先把想法寫成規格，再用 Claude Code 在計畫、實作、測試之間反覆迴圈，接著審查與重構，用 Git 管理版本，擴充工具，部署上線，最後還能用 API 把 AI 放進你的應用。',
 s:[[0,'八步：想法到上線'],[.45,'中間是計畫→實作→測試迴圈'],[.8,'最後可用 API 加入 AI']],
 draw(u){
  sceneBG();
  const A=['想法','規格','計畫','實作','測試','審查','部署','API'],C=[B,Y,G,G,G,P,O,B];
  A.forEach((s,i)=>{const a=seg(u,.02+i*.06,.12+i*.06),x=60+(i%4)*380,y=190+Math.floor(i/4)*190;
   alphaDo(a,()=>{card(x,y,330,130,{bg:'rgba(7,27,39,.85)',st:C[i],lw:2});circ(x+44,y+65,24,C[i],'none',0);wt(x+44,y+73,String(i+1),24,'#0e2133',800,'center');wt(x+88,y+75,s,28,'#fff',800);if(i%4<3)arrow(x+332,y+65,x+376,y+65,Y,3);});});
  alphaDo(seg(u,.55,.7),()=>{card(60,560,1480,110,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,606,'計畫→實作→測試：每一輪都回頭檢查',26,G,800);wt(90,646,'小步前進，出錯時退回上一步',20,SUBC,600);});
  alphaDo(seg(u,.82,.94),()=>{caseTag(60,700,'life',1);caseTag(180,700,'auto',1);caseTag(340,700,'wind',1);});
  alphaDo(seg(u,.86,.97),()=>human(60,750,1,'每一步的決定與合併由你負責'));
 }},
/* 2 想法到規格（生活） */
{t:'從想法到規格',en:'From idea to spec',dur:13,
 d:'先從生活案例開始：你想做一個家庭記帳小網站。不要直接叫 Claude 寫程式，先把想法說清楚。請 Claude 反問你，再整理成一份規格：要記哪些資料、有哪些頁面、什麼算完成。規格寫得越清楚，後面越不會做歪。',
 s:[[0,'想法：家庭記帳網站'],[.4,'請 Claude 反問，補齊細節'],[.72,'整理成規格，定義完成標準']],
 draw(u){
  sceneBG();
  winFrame(60,150,760,650,'對話（示意）');caseTag(84,208,'life',1);
  alphaDo(seg(u,.02,.12),()=>{bub(90,250,700,'我想做家庭記帳網站，先別寫程式，幫我把需求問清楚','user',1);});
  alphaDo(seg(u,.3,.42),()=>{bub(90,420,700,'請問：幾個人共用？要分類嗎？要不要月報表？','ai',1);});
  alphaDo(seg(u,.5,.6),()=>{bub(90,600,700,'兩人共用，分類，要月報表','user',1);});
  arrow(830,480,870,480,Y,4);
  card(880,150,660,650,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(910,202,'規格草稿',24,G,800);
  alphaDo(seg(u,.62,.76),()=>{[['資料','日期、金額、分類、備註'],['頁面','新增、清單、月報表'],['完成標準','能新增與查詢；金額加總正確']].forEach((r,i)=>{card(910,230+i*130,600,110,{bg:'rgba(255,255,255,.05)',st:[B,Y,G][i]});wt(934,270+i*130,r[0],21,[B,Y,G][i],800);wt(934,308+i*130,r[1],19,KC.text,600);});});
  alphaDo(seg(u,.86,.97),()=>human(910,700,1,'需求與優先順序由你拍板'));
 }},
/* 3 Claude Code 與迴圈（智慧自動化） */
{t:'Claude Code 與計畫實作測試',en:'Claude Code and the plan–build–test loop',dur:14,
 d:'智慧自動化的例子：做一個產線看板，顯示 OEE。在終端機用 Claude Code 讀你的專案，先用計畫模式列出方案，不會動到檔案；你確認後才實作，接著跑測試。測試沒過就把錯誤交回去修，一輪一輪走到全部通過。',
 s:[[0,'計畫模式：先看方案，不改檔案'],[.4,'確認後實作，再跑測試'],[.74,'失敗就修，直到通過']],
 draw(u){
  sceneBG();
  winFrame(60,150,760,420,'claude（示意）');
  alphaDo(seg(u,.02,.1),()=>wt(90,226,'> 做產線 OEE 看板',21,G,700));
  ['計畫 1：讀入示意資料','計畫 2：OEE＝稼動×效能×良率','計畫 3：畫圖並加測試','確認後才動手，不先改檔案'].forEach((t,i)=>alphaDo(seg(u,.1+i*.07,.18+i*.07),()=>wt(90,276+i*50,t,21,i==3?Y:KC.text,i==3?800:600)));
  caseTag(84,600,'auto',1);
  const S=[['計畫',G],['實作',B],['測試',Y]];
  S.forEach((r,i)=>{const a=seg(u,.1+i*.16,.22+i*.16),x=870+i*226;alphaDo(a,()=>{card(x,200,206,100,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(x+103,262,r[0],26,'#fff',800,'center');if(i<2)arrow(x+208,250,x+224,250,Y,3);});});
  alphaDo(seg(u,.55,.68),()=>{arrow(1150,310,1150,350,O,3);arrow(1150,350,1000,350,O,3);arrow(1000,350,1000,310,O,3);wt(1180,342,'失敗就回去修',19,O,700);});
  alphaDo(seg(u,.5,.64),()=>{card(870,400,670,170,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(896,444,'OEE 看板（示意數值）',21,Y,800);[['稼動',.86],['效能',.92],['良率',.97]].forEach((r,i)=>{wt(896,486+i*34,r[0],18,KC.text,600);bar(1060,472+i*34,360,16,r[1],[B,G,Y][i]);wt(1430,486+i*34,Math.round(r[1]*100)+'%',18,KC.text,700);});});
  alphaDo(seg(u,.76,.88),()=>{card(60,650,760,70,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,696,'測試：全部通過 ✓',23,G,800);});
  alphaDo(seg(u,.86,.97),()=>human(870,640,1,'數字合理與否，由工程師判斷'));
 }},
/* 4 審查與 Git（風能） */
{t:'審查、重構與 Git',en:'Review, refactoring, and Git',dur:13,
 d:'風能運維的例子：做一個風機警報查詢與工單追蹤工具。程式寫好後，請 Claude 先審查：找出重複的程式與可能的錯誤，再小步重構。接著用 Git 開分支、提交、發出 Pull Request。最後由你看過差異，再決定合併。',
 s:[[0,'請 Claude 審查，找問題'],[.4,'開分支提交，發 Pull Request'],[.74,'人看過差異才合併']],
 draw(u){
  sceneBG();
  card(60,170,720,520,{bg:'rgba(7,27,39,.85)',st:P,lw:2});caseTag(84,190,'wind',1);wt(90,262,'審查意見（示意）',23,P,800);
  alphaDo(seg(u,.02,.14),()=>{[['警報時間格式重複處理','建議抽成函式'],['工單編號可能重複','加檢查與測試'],['查詢沒有限制筆數','加分頁']].forEach((r,i)=>{card(90,290+i*120,660,100,{bg:'rgba(255,255,255,.05)',st:P});wt(114,328+i*120,r[0],20,'#fff',800);wt(114,364+i*120,r[1],18,SUBC,600);});});
  arrow(790,430,830,430,Y,4);
  card(840,170,700,520,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(870,222,'Git 流程',24,G,800);
  alphaDo(seg(u,.4,.6),()=>{['main','fix/alarm-query','Pull Request','合併'].forEach((s,i)=>{const y=250+i*100;card(870,y,380,76,{bg:'rgba(255,255,255,.05)',st:[B,Y,G,O][i]});wt(896,y+46,s,21,[B,Y,G,O][i],700);if(i<3)arrow(1060,y+78,1060,y+98,Y,3);});});
  alphaDo(seg(u,.62,.76),()=>{card(1280,250,230,160,{bg:'rgba(125,255,196,.08)',st:G});para(1300,290,'變更：+42 −17，測試通過',190,19,KC.text,600,28);});
  alphaDo(seg(u,.86,.97),()=>human(60,730,1,'看過差異、按下合併的是你'));
 }},
/* 5 擴充 */
{t:'擴充 Claude Code',en:'Extending Claude Code',dur:12,
 d:'專案越做越大，就要讓 Claude 記住規矩、接上工具。CLAUDE.md 放專案慣例，Skills 打包流程，hooks 在特定時機自動執行檢查，MCP 連到外部資料與工具，subagents 讓另一個助手在獨立上下文裡處理支線工作。',
 s:[[0,'CLAUDE.md 與 Skills：記住規矩'],[.42,'hooks 與 MCP：自動檢查、接上工具'],[.76,'subagents：獨立處理支線']],
 draw(u){
  diagBG();floatParticles(10,29);
  const X=[['CLAUDE.md','專案慣例與指令',Y],['Skills','按需載入的流程',G],['hooks','事件觸發的檢查',O],['MCP','連接外部工具與資料',B],['subagents','獨立上下文的助手',P]];
  X.forEach((r,i)=>{const a=seg(u,.02+i*.16,.14+i*.16),x=60+i*300;alphaDo(a,()=>{card(x,200,280,300,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});box(x,200,280,6,r[2],'none',0);wt(x+20,270,r[0],26,'#fff',800);para(x+20,324,r[1],240,20,KC.text,600,30);});});
  alphaDo(seg(u,.8,.9),()=>{card(60,560,1480,90,{bg:'rgba(255,255,255,.05)',st:Y});wt(90,614,'先從 CLAUDE.md 開始，需要再逐項加',22,Y,700);});
  alphaDo(seg(u,.86,.97),()=>human(60,700,1,'設定與權限由你決定'));
 }},
/* 6 部署與 API（生活＋自動化） */
{t:'部署上線與 API',en:'Deploying and building with the API',dur:12,
 d:'做好的記帳網站可以放到 GitHub Pages：推到儲存庫，自動部署成網址。想讓網站也有 AI 功能，可以用 Claude API，由你的程式送出提示、拿到回覆。產線看板就能加一個「用白話描述今天的異常」的功能。金鑰要妥善保管。',
 s:[[0,'GitHub Pages：推送後自動部署'],[.42,'Claude API：程式送提示、取回覆'],[.76,'金鑰保管、結果要檢查']],
 draw(u){
  sceneBG();
  alphaDo(seg(u,.02,.14),()=>{card(60,170,720,540,{bg:'rgba(7,27,39,.85)',st:G,lw:2});caseTag(84,190,'life',1);wt(90,262,'GitHub Pages',24,G,800);
   ['推送到儲存庫','自動部署','得到網址'].forEach((s,i)=>{card(90,290+i*110,300,84,{bg:'rgba(255,255,255,.05)',st:G});wt(116,340+i*110,s,21,KC.text,700);if(i<2)arrow(240,376+i*110,240,396+i*110,Y,3);});
   winFrame(430,290,320,300,'family-budget.example');wt(590,400,'本月支出',21,KC.text,700,'center');bar(460,430,260,18,.62,G);bar(460,470,260,18,.38,B);bar(460,510,260,18,.2,Y);});
  alphaDo(seg(u,.4,.56),()=>{arrow(790,440,830,440,Y,4);card(840,170,700,540,{bg:'rgba(7,27,39,.85)',st:B,lw:2});caseTag(864,190,'auto',1);wt(870,262,'Claude API',24,B,800);
   card(870,290,640,90,{bg:'rgba(255,255,255,.05)',st:B});wt(896,344,'你的程式送出提示與資料',20,KC.text,700);arrow(1190,382,1190,410,Y,3);
   card(870,414,640,90,{bg:'rgba(255,255,255,.05)',st:Y});wt(896,468,'取回：今日異常白話摘要',20,KC.text,700);});
  alphaDo(seg(u,.74,.86),()=>{card(870,540,640,64,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(896,582,'金鑰不寫進網頁或公開儲存庫',19,O,700);});
  alphaDo(seg(u,.86,.97),()=>human(870,630,1,'AI 摘要需人員檢查再採用'));
 }},
/* 7 三案例與把關 */
{t:'三個專案，同一套做法',en:'Three projects, one way of working',dur:11,
 d:'不管是家庭記帳網站、產線看板，還是風機警報工具，做法都一樣：先寫規格，小步迭代，用測試把關，審查後才合併、部署。AI 負責加速與提出建議，哪些功能要做、能不能上線，由你決定。',
 s:[[0,'三種專案，同一套流程'],[.5,'AI 加速，你做決定']],
 draw(u){
  sceneBG();
  const R=[['life','家庭記帳網站','規格→實作→GitHub Pages',B],['auto','產線 OEE 看板','計畫→測試→API 摘要',Y],['wind','風機警報查詢與工單追蹤','審查→PR→合併',G]];
  R.forEach((r,i)=>{const a=seg(u,.04+i*.14,.16+i*.14),y=180+i*160;alphaDo(a,()=>{card(60,y,1480,136,{bg:'rgba(7,27,39,.85)',st:r[3],lw:2});caseTag(84,y+18,r[0],1);wt(90,y+84,r[1],28,'#fff',800);wt(1000,y+84,r[2],24,r[3],700);});});
  alphaDo(seg(u,.55,.72),()=>{card(60,680,1480,70,{bg:'rgba(255,255,255,.05)',st:Y});wt(90,726,'規格清楚、小步前進、測試把關、人合併上線',24,Y,800);});
  alphaDo(seg(u,.78,.94),()=>human(60,780,1,'功能取捨與上線時機由你決定'));
 }}
]};
