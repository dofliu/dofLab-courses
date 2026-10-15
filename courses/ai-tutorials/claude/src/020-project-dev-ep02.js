// KITS: claude
/* 020-project-dev-ep02 — Claude Code 入門
   Claude AI 應用動畫館｜專案開發 第 2 集
   依 code.claude.com（Overview、Permission modes、Checkpointing）查證，資訊截至 2026-10 */

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
const EP={no:2,slug:'project-dev',t:'Claude Code 入門',en:'Getting Started with Claude Code',
seriesName:'專案開發',total:8,
lede:'Claude Code 能讀你的專案、改檔案、跑指令。第一次使用，先學四件事：從哪裡開始、怎麼讓它讀懂既有專案、用哪種權限模式、改錯了怎麼回復。這一集用待辦清單小專案、PLC 資料收集腳本與 SCADA 資料匯入程式示範，修改一律由你審閱後才採用。',
facts:[['多入口','同一個引擎','終端機、VS Code、JetBrains、桌面版與網頁'],['先讀懂','再改','請 Claude 說明專案結構與每個檔案的用途'],['4 種模式','Manual、Accept edits、Plan、Auto','決定哪些動作不用問你'],['看 diff','審閱每個修改','紅色刪除、綠色新增，同意後才寫入'],['可回復','/rewind','檢查點可還原程式與對話，但不取代 Git']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。入口、權限模式（Manual 即 default、Accept edits、Plan、Auto）與 /rewind 檢查點的說明依 Claude Code 文件（code.claude.com Overview、Permission modes、Checkpointing）整理，資訊截至 2026-10；功能、預設模式與介面仍在調整，請以官方最新說明為準。待辦清單、PLC 資料收集腳本與 SCADA 匯入程式的檔名、程式碼、數字均為虛構的示意或典型範例，並非任何特定單位、公司或案場資料；AI 提供分析與建議，停機、上鎖掛牌與對 PLC 寫入或下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 入口（生活） */
{t:'終端機、桌面、IDE 入口',en:'Terminal, desktop and IDE entry points',dur:14,
 d:'Claude Code 有好幾個入口：終端機、VS Code 與 JetBrains 外掛、桌面版，還有網頁版。底層是同一個引擎，專案裡的 CLAUDE.md 與設定可以共用。以終端機為例，安裝後走進專案資料夾、輸入 claude，登入就能開始。我們先拿一個待辦清單的小專案來試。',
 s:[[0,'同一個引擎，多個入口'],[.4,'進專案資料夾，輸入 claude'],[.76,'先拿待辦清單小專案練習']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  [['終端機',B],['VS Code',G],['JetBrains',P],['桌面版',Y],['網頁版',O]].forEach((r,i)=>alphaDo(seg(u,.02+i*.06,.12+i*.06),()=>{card(60+i*190,200,176,110,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(148+i*190,262,r[0],22,r[1],800,'center');}));
  alphaDo(seg(u,.3,.42),()=>{arrow(500,320,500,360,Y,4);card(60,370,900,80,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,420,'同一個 Claude Code 引擎・CLAUDE.md 與設定共用',22,G,800);});
  alphaDo(seg(u,.4,.56),()=>{winFrame(60,490,900,310,'終端機（示意）');
   wt(90,590,'$ cd todo-app',22,'#7dffc4',700);wt(90,640,'$ claude',22,'#7dffc4',700);wt(90,700,'首次使用會提示登入',19,SUBC,600);});
  alphaDo(seg(u,.74,.86),()=>{card(1000,200,540,330,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(1030,250,'待辦清單小專案',24,B,800);
   ['index.html','app.js','style.css','README.md'].forEach((f,i)=>{card(1030,280+i*58,480,46,{bg:'rgba(255,255,255,.05)',st:'rgba(255,255,255,.2)'});wt(1054,311+i*58,f,19,KC.text,600);});});
  alphaDo(seg(u,.88,.97),()=>human(1000,570,1,'要在哪個專案用，由你決定'));
 }},
/* 2 讀懂既有專案（生活） */
{t:'讀懂既有專案',en:'Understand an existing project',dur:14,
 d:'拿到別人寫的專案，第一步不是改，而是先讀懂。請 Claude 說明這個專案做什麼、有哪些檔案、資料存在哪裡。它會自己讀檔案、搜尋程式碼，再整理成白話說明。你能一邊對照檔案，一邊確認它有沒有誤解。',
 s:[[0,'先讀懂，再動手'],[.4,'Claude 讀檔案、搜尋程式碼'],[.76,'你對照檔案確認說明']],
 draw(u){
  sceneBG();
  winFrame(60,150,900,650,'Claude Code（示意）');caseTag(84,208,'life',1);
  alphaDo(seg(u,.02,.14),()=>{bub(90,250,840,'這個待辦清單專案做什麼？資料存在哪裡？先不要改任何檔案。','user',1);});
  alphaDo(seg(u,.4,.54),()=>{card(90,400,840,60,{bg:'rgba(88,184,208,.1)',st:B,lw:1.5});wt(116,438,'讀取 index.html、app.js …',20,B,700);});
  alphaDo(seg(u,.56,.72),()=>{bub(90,490,840,'這是純前端待辦清單：app.js 管新增與勾選，資料存在瀏覽器的 localStorage。','ai',1);});
  card(1000,150,540,650,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(1030,202,'專案地圖',23,Y,800);
  [['index.html','頁面結構',.46],['app.js','新增、勾選、儲存',.5],['style.css','外觀',.54],['localStorage','資料存放處',.6]].forEach((r,i)=>alphaDo(seg(u,r[2],r[2]+.1),()=>{card(1030,230+i*96,480,80,{bg:'rgba(255,255,255,.05)',st:[B,G,P,Y][i]});wt(1054,268+i*96,r[0],21,[B,G,P,Y][i],800);wt(1054,298+i*96,r[1],18,KC.text,600);}));
  alphaDo(seg(u,.82,.95),()=>human(1000,650,1,'說明對不對，由你比對'));
 }},
/* 3 讀懂 PLC 腳本（智慧自動化，圖解） */
{t:'讀懂 PLC 資料收集腳本',en:'Understand a PLC data-collection script',dur:14,
 d:'智慧自動化現場常有前人留下的 Python 腳本，每隔幾秒向 PLC 讀暫存器，轉成數值再存成 CSV。請 Claude 逐段說明，它能標出讀取位址、換算公式與存檔位置。這個階段只讀程式，不連線、不寫入 PLC，更不會碰到設備。',
 s:[[0,'腳本把 PLC 數值存成 CSV'],[.42,'Claude 逐段說明，不連線'],[.78,'寫入 PLC 的事由人員確認']],
 draw(u){
  diagBG();floatParticles(8,31);caseTag(60,150,'auto',1);
  [['PLC 暫存器',B],['poll_plc.py',Y],['data.csv',G]].forEach((r,i)=>alphaDo(seg(u,.02+i*.08,.14+i*.08),()=>{card(60+i*340,210,300,120,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(210+i*340,282,r[0],24,r[1],800,'center');if(i<2)arrow(362+i*340,270,396+i*340,270,Y,4);}));
  alphaDo(seg(u,.18,.3),()=>{wt(60,370,'每 5 秒讀一次，示意',20,SUBC,600);});
  alphaDo(seg(u,.42,.58),()=>{card(60,410,1000,300,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,458,'Claude 的逐段說明（示意）',22,Y,800);
   [['讀取','每 5 秒讀取 2 個暫存器'],['換算','原始值除以 10 得到溫度'],['存檔','附上時間，加入 data.csv']].forEach((r,i)=>{wt(90,516+i*60,r[0],21,[B,G,O][i],800);wt(190,516+i*60,r[1],21,KC.text,600);});});
  alphaDo(seg(u,.5,.64),()=>{card(1100,210,440,230,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(1130,258,'本階段只做',23,G,800);para(1130,300,'讀程式、說明邏輯，不連線、不寫入',380,20,KC.text,600,30);});
  alphaDo(seg(u,.78,.88),()=>{card(1100,470,440,110,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(1124,512,'寫入 PLC 會動到設備，不在此交給 AI',390,19,O,700,28);});
  alphaDo(seg(u,.88,.97),()=>human(1100,610,1,'下指令給 PLC 由人員確認'));
 }},
/* 4 權限模式（圖解） */
{t:'權限模式',en:'Permission modes',dur:14,
 d:'Claude Code 的權限模式，決定哪些動作可以不先問你。Manual 只有讀取不用問，改檔與跑指令都要同意。Accept edits 會自動接受改檔。Plan 只讀取與規劃，不改檔。Auto 由另一個模型檢查動作，適合長任務。在終端機按 Shift 加 Tab 就能切換。第一次建議用 Manual 或 Plan。',
 s:[[0,'模式決定哪些動作不用問'],[.46,'Shift+Tab 切換模式'],[.78,'新手先用 Manual 或 Plan']],
 draw(u){
  diagBG();floatParticles(8,33);
  [['Manual','只有讀取不用問','改檔、跑指令都要你同意',B],['Accept edits','自動接受改檔','改動仍由你事後審閱',G],['Plan','只讀取與規劃','不改檔，核准計畫才實作',Y],['Auto','另一個模型檢查動作','適合長任務，仍需留意',P]].forEach((r,i)=>alphaDo(seg(u,.02+i*.1,.14+i*.1),()=>{card(60+i*380,170,360,330,{bg:'rgba(7,27,39,.85)',st:r[3],lw:2});wt(90+i*380,224,r[0],26,r[3],800);para(90+i*380,290,r[1],300,21,'#fff',800,30);para(90+i*380,390,r[2],300,19,SUBC,600,28);}));
  alphaDo(seg(u,.46,.6),()=>{card(60,540,760,90,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(90,596,'Shift + Tab：在終端機切換模式',23,KC.text,800);});
  alphaDo(seg(u,.52,.66),()=>{card(850,540,690,90,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(876,596,'規則可另外加：拒絕規則任何模式都生效',20,O,700);});
  alphaDo(seg(u,.78,.88),()=>{card(60,660,1480,70,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,704,'第一次使用，先用 Manual 或 Plan，熟悉後再放寬',22,'#fff',800);});
  alphaDo(seg(u,.88,.97),()=>human(60,750,1,'放寬多少權限，由你決定'));
 }},
/* 5 第一個修改（風能） */
{t:'第一個修改',en:'Your first change',dur:14,
 d:'讀懂之後，試第一個小修改。SCADA 資料匯入程式遇到空白列就會當掉，請 Claude 加上略過空白列的判斷。它會先顯示差異：紅色是刪除，綠色是新增，你看過、同意之後才寫入檔案。改完請它用範例檔跑一次檢查。',
 s:[[0,'風場 SCADA 匯入遇到空白列'],[.42,'紅色刪除，綠色新增'],[.76,'同意後才寫入，再跑一次檢查']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.14),()=>{bub(60,200,760,'import_scada.py 遇到空白列會當掉，請加上略過空白列的判斷。','user',1);});
  alphaDo(seg(u,.4,.54),()=>{winFrame(60,330,900,350,'差異 import_scada.py（示意）');
   box(80,390,860,56,'rgba(232,87,42,.18)','none',0);wt(100,426,'-   row = parse(line)',20,O,700);
   box(80,446,860,56,'rgba(125,255,196,.15)','none',0);wt(100,482,'+   if not line.strip(): continue',20,G,700);
   box(80,502,860,56,'rgba(125,255,196,.15)','none',0);wt(100,538,'+   row = parse(line)',20,G,700);
   wt(100,610,'讀取風速與功率的示意資料',19,SUBC,600);});
  alphaDo(seg(u,.5,.62),()=>{card(1000,200,540,130,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(1030,252,'要套用這個修改嗎？',22,Y,800);wt(1030,298,'1 是　2 否',21,KC.text,700);});
  alphaDo(seg(u,.76,.88),()=>{card(1000,360,540,150,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(1030,410,'再跑一次檢查',23,G,800);wt(1030,456,'用範例檔確認不再當掉',20,KC.text,600);});
  alphaDo(seg(u,.88,.97),()=>human(1000,550,1,'審閱 diff 後才同意'));
 }},
/* 6 回復變更與三情境（圖解） */
{t:'回復變更',en:'Undoing changes',dur:13,
 d:'改壞了怎麼辦？Claude Code 會在每次提問前記錄檢查點。輸入 rewind，或在輸入框空白時連按兩次 Esc，就能還原程式、對話，或兩者。但是用指令刪除或搬移的檔案不會被追蹤，所以仍要靠 Git。三個專案都先讀懂、再小步修改、可回復。下一集，我們進入計畫、實作、測試的迴圈。',
 s:[[0,'每次提問前都有檢查點'],[.42,'/rewind 還原，但不取代 Git'],[.8,'下一集：計畫、實作、測試']],
 draw(u){
  diagBG();floatParticles(8,37);
  [['還原程式與對話',B],['只還原對話',G],['只還原程式',Y]].forEach((r,i)=>alphaDo(seg(u,.02+i*.08,.14+i*.08),()=>{card(60+i*500,170,480,100,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(90+i*500,232,r[0],24,r[1],800);}));
  alphaDo(seg(u,.2,.3),()=>{wt(60,320,'/rewind，或輸入框空白時連按兩次 Esc',21,SUBC,600);});
  alphaDo(seg(u,.42,.56),()=>{card(60,360,1480,110,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,408,'限制：用指令刪除或搬移的檔案不會被追蹤',22,O,800);wt(90,448,'檢查點不取代 Git，重要的修改仍要提交',20,SUBC,600);});
  alphaDo(seg(u,.6,.74),()=>{
   [['生活','待辦清單',B],['智慧自動化','PLC 腳本',Y],['風能運維','SCADA 匯入',G]].forEach((r,i)=>{card(60+i*500,510,480,120,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,528,r[0],{size:17,bg:r[2]});wt(86+i*500,602,r[1],24,'#fff',800);});});
  alphaDo(seg(u,.8,.9),()=>{wt(60,680,'先讀懂、小步修改、可回復',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,720,1,'保留或還原，由你決定'));
 }}
]};
