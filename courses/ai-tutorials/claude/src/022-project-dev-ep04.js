// KITS: claude
/* 022-project-dev-ep04 — 程式碼審查與重構
   Claude AI 應用動畫館｜專案開發 第 4 集
   依 support.claude.com（Automated Security Reviews in Claude Code：/security-review 與 GitHub Actions，輔助而非取代人工審查）與 code.claude.com 最佳實務（提供測試讓 Claude 自行驗證）查證，資訊截至 2026-10 */

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
const EP={no:4,slug:'project-dev',t:'程式碼審查與重構',en:'Code Review & Refactoring',
seriesName:'專案開發',total:8,
lede:'讓 Claude 當第二雙眼睛：先給它具體的審查清單，找出重複與難讀的壞味道，再在測試保護下小步重構。要優化效能，先量測再動手；最後補齊說明文件。這一集用購物車網頁、Modbus 讀取程式與警報分級示範，採用與否由你決定。',
facts:[['審查清單','說清楚要看什麼','正確性、安全、可讀性、測試、效能，逐項要求'],['壞味道','重複、過長、神秘數字','先列出問題，再決定改哪幾個'],['安全重構','先有測試','小步修改，每一步都跑測試，行為不變'],['先量測','再優化','有數據才知道瓶頸，改完要再量一次'],['補文件','寫為什麼','說明由你核對，過期的文件比沒有更糟']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。Claude Code 的 /security-review 指令與 GitHub Actions 自動審查 PR 的功能，以及「安全審查輔助而非取代人工審查」的說法，依 Anthropic 說明中心（support.claude.com，Automated Security Reviews in Claude Code）整理；「提供測試讓 Claude 自行驗證」依 Claude Code 文件的最佳實務整理。資訊截至 2026-10，功能與介面仍在調整，請以官方最新說明為準。購物車程式、Modbus 暫存器讀取、警報分級與耗時數字均為虛構的示意或典型範例，並非任何特定單位、公司、機組或案場資料；實際暫存器位址與警報門檻請依設備手冊與現場規範確認。AI 提供分析與建議，停機、上鎖掛牌與對 PLC 寫入或下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 審查清單（生活） */
{t:'審查清單',en:'The review checklist',dur:14,
 d:'請 Claude 審查程式，別只說幫我看看。拿購物車網頁來說，具體告訴它要看五件事：正確性、安全、可讀性、測試、效能，先列問題與建議，不要改檔。有改動安全相關的程式，還可以用斜線 security-review 指令做安全審查，它輔助人工審查，不能取代。建議採用與否，由你決定。',
 s:[[0,'具體的審查清單'],[.42,'先列問題，不改檔'],[.76,'安全審查輔助人工審查']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.14),()=>{bub(60,200,900,'請審查這段購物車網頁程式：正確性、安全、可讀性、測試、效能，各列問題與建議，先不要改檔。','user',1);});
  alphaDo(seg(u,.3,.46),()=>{card(60,380,900,380,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,430,'審查結果（示意）',23,Y,800);
   [['正確性','折扣算了兩次',O],['安全','輸入沒有檢查',O],['可讀性','函式太長',Y],['測試','缺少空購物車案例',Y],['效能','每次重算全部',B]].forEach((r,i)=>{alphaDo(seg(u,.32+i*.03,.42+i*.03),()=>{checkBox(90,452+i*58,seg(u,.5+i*.02,.58+i*.02));tag(142,458+i*58,r[0],{size:16,bg:r[2]});wt(310,484+i*58,r[1],20,KC.text,600);});});});
  alphaDo(seg(u,.42,.56),()=>{card(1000,380,540,150,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(1030,428,'先列問題，不改檔',24,B,800);para(1030,468,'看過、挑過，再決定改哪幾項',480,20,KC.text,600,30);});
  alphaDo(seg(u,.7,.84),()=>{card(1000,560,540,130,{bg:'rgba(255,255,255,.05)',st:'rgba(255,255,255,.3)',lw:1.5});wt(1030,606,'/security-review',22,G,800);para(1030,640,'安全審查輔助人工審查，不能取代',480,19,SUBC,600,28);});
  alphaDo(seg(u,.86,.97),()=>human(1000,710,1,'採用與否，由你決定'));
 }},
/* 2 壞味道（智慧自動化，圖解） */
{t:'找出程式碼壞味道',en:'Spotting code smells',dur:13,
 d:'壞味道是程式碼的警訊。感測器讀取程式裡，讀溫度、讀壓力、讀流量三個函式幾乎一模一樣，只差暫存器位址與換算比例，這是重複程式。其他常見的還有：函式太長、神秘數字、命名不清。請 Claude 先列出清單並排優先順序，再由你決定改哪幾個。暫存器位址依設備手冊確認。',
 s:[[0,'三個函式幾乎一模一樣'],[.42,'重複、過長、神秘數字、命名不清'],[.76,'先排優先順序，再決定改哪個']],
 draw(u){
  diagBG();floatParticles(8,51);caseTag(60,150,'auto',1);
  [['read_temp()',B],['read_pressure()',G],['read_flow()',P]].forEach((r,i)=>alphaDo(seg(u,.02+i*.07,.14+i*.07),()=>{winFrame(60+i*330,190,310,250,r[0]);
   ['connect()','read(addr)','x * scale','return value'].forEach((s,j)=>wt(84+i*330,262+j*38,s,18,j===1||j===2?O:SUBC,700));
   box(76+i*330,326,278,34,'rgba(232,87,42,.15)','none',0);box(76+i*330,364,278,34,'rgba(232,87,42,.15)','none',0);wt(220+i*330,420,'addr / scale 不同',15,r[1],700,'center');}));
  alphaDo(seg(u,.3,.44),()=>{card(1060,190,480,250,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(1090,240,'重複程式',26,O,800);para(1090,282,'同一段邏輯貼了三次，改一處要改三處',420,20,KC.text,600,30);});
  alphaDo(seg(u,.42,.6),()=>{[['重複程式',O],['函式太長',Y],['神秘數字',B],['命名不清',P]].forEach((r,i)=>{card(60+i*380,490,350,84,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(235+i*380,542,r[0],24,r[1],800,'center');});});
  alphaDo(seg(u,.62,.76),()=>{card(60,610,1480,100,{bg:'rgba(255,255,255,.05)',st:B,lw:1.5});wt(90,670,'請 Claude 列出清單、排優先順序，再由你決定改哪幾個',23,KC.text,700);});
  alphaDo(seg(u,.86,.97),()=>human(60,740,1,'暫存器位址依設備手冊確認'));
 }},
/* 3 安全地重構（風能） */
{t:'安全地重構',en:'Refactoring safely',dur:14,
 d:'重構是不改變行為、只讓程式更好維護。以警報分級為例，原本一長串 if 判斷，改成查表。安全的做法是：先有測試，小步修改，每一步都跑測試，全部通過才進下一步，最後提交。行為不變，才叫重構。分級門檻由人員確認。',
 s:[[0,'長串 if 改成查表'],[.4,'先有測試，每一步都跑'],[.76,'行為不變才叫重構']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  pipe(60,190,['先有測試','小步修改','跑測試','提交'],seg(u,.02,.26),[B,Y,G,P]);
  alphaDo(seg(u,.28,.46),()=>{winFrame(60,320,720,300,'重構前（示意）');
   ['if level == 1: ...','elif level == 2: ...','elif level == 3: ...','elif level == 4: ...'].forEach((s,i)=>wt(86,392+i*44,s,19,O,700));wt(86,590,'每加一級就多一段',18,SUBC,600);});
  alphaDo(seg(u,.46,.62),()=>{winFrame(820,320,720,300,'重構後（示意）');
   ['LEVELS = {','  1: "注意", 2: "警告",','  3: "嚴重", 4: "緊急"}','return LEVELS[level]'].forEach((s,i)=>wt(846,392+i*44,s,19,G,700));wt(846,590,'新增一級只加一行',18,SUBC,600);});
  alphaDo(seg(u,.62,.72),()=>{arrow(780,470,820,470,Y,4);});
  alphaDo(seg(u,.68,.8),()=>{card(60,650,720,86,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,706,'重構前後：8 passed',24,G,800);});
  alphaDo(seg(u,.74,.86),()=>{card(820,650,720,86,{bg:'rgba(255,255,255,.05)',st:B,lw:1.5});wt(850,706,'行為不變，才叫重構',22,B,800);});
  alphaDo(seg(u,.86,.97),()=>human(60,760,1,'分級門檻由人員確認'));
 }},
/* 4 效能分析（智慧自動化，圖解） */
{t:'效能分析',en:'Performance analysis',dur:14,
 d:'覺得程式很慢，先量測，不要猜。例如讀兩百個感測點，一點一點讀要三點二秒，量測後發現時間都花在逐點通訊。請 Claude 改成分批讀取，只改這一處，再量一次，降到零點四秒。有數據才知道瓶頸，也能證明改善。通訊設定由現場人員確認。',
 s:[[0,'先量測，不要猜'],[.42,'瓶頸：逐點通訊'],[.76,'改一處，再量一次']],
 draw(u){
  diagBG();floatParticles(8,53);caseTag(60,150,'auto',1);
  [['量測',B],['找瓶頸',Y],['改一處',G],['再量測',P]].forEach((r,i)=>alphaDo(seg(u,.02+i*.07,.14+i*.07),()=>{card(60+i*380,190,340,84,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(230+i*380,242,r[0],24,r[1],800,'center');if(i<3)arrow(402+i*380,232,436+i*380,232,Y,3);}));
  alphaDo(seg(u,.3,.5),()=>{card(60,320,900,360,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(90,370,'讀取 200 個感測點的耗時（示意）',22,B,800);
   wt(90,440,'逐點讀取',20,KC.text,700);bar(250,418,520,34,seg(u,.32,.48),O);wt(870,444,'3.2 秒',20,O,800,'right');
   wt(90,520,'分批讀取',20,KC.text,700);bar(250,498,520,34,seg(u,.7,.84)*.125,G);alphaDo(seg(u,.7,.84),()=>wt(870,524,'0.4 秒',20,G,800,'right'));
   wt(90,620,'時間花在：每點一次來回通訊',20,SUBC,600);});
  alphaDo(seg(u,.42,.58),()=>{card(1000,320,540,170,{bg:'rgba(255,242,194,.06)',st:Y,lw:2});wt(1030,370,'瓶頸',24,Y,800);para(1030,410,'逐點通訊，不是計算',480,20,KC.text,600,30);});
  alphaDo(seg(u,.76,.88),()=>{card(1000,520,540,160,{bg:'rgba(125,255,196,.08)',st:G,lw:2});para(1030,566,'只改這一處，改完再量一次，確認真的變快',480,20,KC.text,700,30);});
  alphaDo(seg(u,.88,.97),()=>human(60,720,1,'通訊設定由現場人員確認'));
 }},
/* 5 補齊說明文件（生活，圖解） */
{t:'補齊說明文件',en:'Filling in the docs',dur:13,
 d:'重構完，請 Claude 補說明文件。函式的說明字串，寫清楚輸入、輸出與例外；README 寫怎麼安裝、怎麼執行；註解寫為什麼這樣做，而不是重複程式在做什麼。以購物車程式為例。它寫的內容要由你核對，過期的文件比沒有更糟。',
 s:[[0,'函式說明、README、註解'],[.46,'註解寫為什麼'],[.78,'內容由你核對']],
 draw(u){
  diagBG();floatParticles(8,55);caseTag(60,150,'life',1);
  alphaDo(seg(u,.04,.2),()=>{winFrame(60,190,760,300,'cart.py（示意）');
   ['def total(items, coupon=None):','    """計算購物車總額。','    items: 品項清單；coupon: 折扣碼。','    空購物車回傳 0；折扣碼無效則報錯。"""'].forEach((s,i)=>wt(84,262+i*44,s,19,i===0?B:G,700));});
  alphaDo(seg(u,.22,.38),()=>{winFrame(860,190,680,300,'README（示意）');
   ['安裝：pip install -r requirements.txt','執行：python cart.py','測試：pytest'].forEach((s,i)=>wt(884,262+i*52,s,19,KC.text,700));});
  alphaDo(seg(u,.46,.64),()=>{card(60,530,760,170,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,576,'不好的註解',22,O,800);wt(90,624,'# 把價格加起來',20,SUBC,700);
   wt(90,664,'只重複程式在做什麼',19,SUBC,600);});
  alphaDo(seg(u,.52,.68),()=>{card(860,530,680,170,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(890,576,'好的註解',22,G,800);wt(890,624,'# 折扣先於稅金計算',20,KC.text,700);
   wt(890,664,'說明為什麼這樣做',19,KC.text,600);});
  alphaDo(seg(u,.78,.88),()=>{wt(60,750,'過期的文件比沒有更糟',23,Y,800);});
  alphaDo(seg(u,.88,.97),()=>human(1000,725,1,'說明內容由你核對'));
 }},
/* 6 總結（三情境，圖解） */
{t:'審查、重構、驗證',en:'Review, refactor, verify',dur:13,
 d:'整個流程是：先審查、列出問題，再重構、跑測試，量測效能，補齊文件。購物車網頁、感測器讀取程式、警報分級，三個專案都一樣：具體要求、小步修改、用測試驗證，由你做決定。下一集，我們來看 Git 與 GitHub 的工作流程。',
 s:[[0,'審查、重構、量測、補文件'],[.46,'三個專案，同一套做法'],[.8,'下一集：Git 與 GitHub 工作流程']],
 draw(u){
  diagBG();floatParticles(8,57);
  [['審查',Y],['重構',B],['測試',G],['文件',P]].forEach((r,i)=>alphaDo(seg(u,.02+i*.08,.14+i*.08),()=>{card(60+i*380,180,340,110,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(230+i*380,246,r[0],28,r[1],800,'center');if(i<3)arrow(402+i*380,235,436+i*380,235,Y,4);}));
  alphaDo(seg(u,.3,.44),()=>{wt(815,350,'每一步都由你決定採用與否',22,O,700,'center');});
  alphaDo(seg(u,.46,.72),()=>{
   [['生活','購物車程式審查與文件',B],['智慧自動化','重複讀取與批次讀取',Y],['風能運維','警報分級查表重構',G]].forEach((r,i)=>{card(60+i*500,430,480,140,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,448,r[0],{size:17,bg:r[2]});wt(86+i*500,542,r[1],24,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,660,'具體要求、小步修改、用測試驗證',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'採用與否，由你決定'));
 }}
]};
