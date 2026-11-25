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
const EP={no:0,slug:'daily-life',seriesName:'生活應用系列・總覽片',t:'生活裡的 AI 小幫手',en:'Daily Life: Overview',total:8,
lede:'旅遊、煮飯、記帳、問健康、學語言、整理家務文件，日常小事都能和 Claude 搭配。這支總覽片走過七個生活主題，並用家中智慧家電設定與參觀風場規劃，示範同一套做法；重要決定與安全設定仍由你自己確認。',
facts:[['7','個主題','生活應用系列的七集'],['先說','情境','告訴 Claude 時間、預算與偏好，建議更貼切'],['查證','再決定','價格、營業時間與法規請回官方來源確認'],['健康','問醫師','Claude 可整理問題，不能取代診斷'],['手機','隨手問','語音、拍照與文字，隨時切換']],
note:'說明：本片為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。Claude 手機版的語音模式（beta，支援多種語言）、拍照與上傳檔案依 support.claude.com 公開說明整理，資訊截至 2026-11，功能與介面仍在調整，請以官方最新說明為準。行程、食譜、預算、健康提問、智慧家電設定與風場參觀內容均為虛構的示意或典型範例，並非任何特定店家、個人、設備或案場資料；價格與法規請以官方公告為準。AI 提供分析與建議，健康診斷、重大財務決定、家電安全設定、停機與上鎖掛牌等動作，一律由本人或專業人員確認後執行。',
shots:[
/* 1 全景 */
{t:'七個生活小幫手',en:'Seven everyday helpers',dur:12,
 d:'日常生活可以拆成七件事：規劃旅遊、決定煮什麼、看懂收支、整理健康問題、學新技能與語言、處理家務與文件，最後把這些放進手機隨手問。每一件事，最後的決定都在你手上。',
 s:[[0,'七個生活主題'],[.5,'說清楚情境，建議更貼切'],[.8,'決定權始終在你']],
 draw(u){
  sceneBG();
  const A=['旅遊規劃','料理與飲食','個人理財','健康資訊','學習與語言','家務與文件','手機上的 Claude'],C=[B,Y,G,P,O,B,Y];
  A.forEach((s,i)=>{const a=seg(u,.02+i*.07,.12+i*.07),x=60+(i%4)*380,y=190+Math.floor(i/4)*190;
   alphaDo(a,()=>{card(x,y,330,130,{bg:'rgba(7,27,39,.85)',st:C[i],lw:2});circ(x+44,y+65,24,C[i],'none',0);wt(x+44,y+73,String(i+1),24,'#0e2133',800,'center');wt(x+88,y+75,s,i>=5?(LANG==='en'?19:23):25,'#fff',800);});});
  alphaDo(seg(u,.6,.74),()=>{card(1200,380,340,130,{bg:'rgba(125,255,196,.08)',st:G,lw:2});para(1224,424,'每件事都由你做決定',290,22,G,800,32);});
  alphaDo(seg(u,.78,.92),()=>{caseTag(60,580,'life',1);caseTag(180,580,'auto',1);caseTag(340,580,'wind',1);});
  alphaDo(seg(u,.84,.97),()=>human(60,650,1,'重要決定由你確認'));
 }},
/* 2 旅遊＋料理（生活） */
{t:'旅遊與料理',en:'Travel and cooking',dur:13,
 d:'生活的例子：週末兩天一夜小旅行，告訴 Claude 預算、交通方式和同行長輩，它能排出行程草稿。晚餐不知道煮什麼，列出冰箱剩下的食材，它能提出幾道菜。營業時間與價格，出發前要再查證。',
 s:[[0,'行程：說清楚條件'],[.45,'食譜：從現有食材出發'],[.78,'營業時間與價格再查證']],
 draw(u){
  sceneBG();
  caseTag(60,170,'life',1);
  alphaDo(seg(u,.04,.2),()=>{card(60,220,720,330,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(90,268,'兩天一夜行程草稿（示意）',23,B,800);
   [['第 1 天','老街散步、午餐、海邊日落'],['第 2 天','早市、博物館、回程']].forEach((r,i)=>{wt(90,330+i*80,r[0],22,Y,800);wt(210,330+i*80,r[1],21,KC.text,600);});
   wt(90,500,'條件：預算 3,000 元、搭火車、同行長輩',19,SUBC,600);});
  alphaDo(seg(u,.46,.62),()=>{card(820,220,720,330,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(850,268,'冰箱剩下：雞蛋、番茄、豆腐',23,Y,800);
   ['番茄炒蛋','麻婆豆腐（少辣）','番茄豆腐湯'].forEach((t,i)=>{circ(870,330+i*56,8,G,'none',0);wt(894,338+i*56,t,22,KC.text,600);});});
  alphaDo(seg(u,.72,.84),()=>{card(60,590,1480,80,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(90,640,'營業時間、價格與過敏原，出發或下廚前請再確認',22,O,700);});
  alphaDo(seg(u,.86,.97),()=>human(60,700,1,'行程與用餐由你決定'));
 }},
/* 3 理財＋健康（生活） */
{t:'理財與健康資訊',en:'Money and health questions',dur:13,
 d:'理財與健康都要小心。把一個月的收支貼給 Claude，它能分類、畫出比例，提醒哪一類花得多。健康方面，請它幫你整理看診前要問醫師的問題與症狀時間表。它不能診斷，也不能取代理財顧問。',
 s:[[0,'收支分類看比例'],[.45,'整理看診前的問題'],[.78,'不能取代診斷與專業建議']],
 draw(u){
  sceneBG();
  caseTag(60,170,'life',1);
  alphaDo(seg(u,.04,.2),()=>{card(60,220,720,300,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(90,268,'本月支出（示意）',23,G,800);
   [['飲食',.42,Y],['交通',.2,B],['娛樂',.25,P],['其他',.13,O]].forEach((r,i)=>{wt(90,322+i*48,r[0],20,KC.text,600);bar(220,305+i*48,500,22,r[1]*seg(u,.1,.3),r[2]);});});
  alphaDo(seg(u,.46,.62),()=>{card(820,220,720,300,{bg:'rgba(7,27,39,.85)',st:P,lw:2});wt(850,268,'看診前整理（示意）',23,P,800);
   ['症狀：三天前開始','目前用藥：記錄清楚','想問：需要檢查嗎？'].forEach((t,i)=>wt(850,322+i*52,'• '+tr(t),21,KC.text,600));});
  alphaDo(seg(u,.72,.84),()=>{card(60,560,1480,80,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(90,610,'健康診斷與投資決定：請洽醫師或合格專業人員',22,O,700);});
  alphaDo(seg(u,.86,.97),()=>human(60,680,1,'診斷與財務決定由專業人員協助你'));
 }},
/* 4 學習語言（生活） */
{t:'學新技能與語言',en:'Learning skills and languages',dur:12,
 d:'學語言時，可以請 Claude 當對話夥伴：先設定程度，再用情境練習，最後整理成單字卡。學新技能也一樣，請它排出四週練習計畫。它可能說錯，重要內容請對照教材或老師。',
 s:[[0,'設定程度，情境對話'],[.5,'整理成單字卡與計畫'],[.8,'重要內容對照教材']],
 draw(u){
  sceneBG();
  caseTag(60,170,'life',1);
  winFrame(60,220,760,340,'語言練習（示意）');
  alphaDo(seg(u,.06,.22),()=>bub(86,274,700,'我們在咖啡店點餐，用簡單英文練習','ai',1));
  alphaDo(seg(u,.24,.4),()=>bub(86,390,700,'Can I have a latte, please?','user',1));
  alphaDo(seg(u,.5,.66),()=>{[['latte','拿鐵',Y],['to go','外帶',G],['receipt','收據',B]].forEach((r,i)=>{const x=870+i*225;card(x,240,205,130,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(x+102,300,r[0],26,'#fff',800,'center');wt(x+102,342,r[1],20,r[2],700,'center');});
   card(870,400,655,160,{bg:'rgba(7,27,39,.85)',st:P,lw:2});wt(900,448,'四週練習計畫（示意）',22,P,800);wt(900,494,'每週 3 次、每次 15 分鐘',20,KC.text,600);wt(900,534,'第 4 週：完整點餐對話',20,KC.text,600);});
  alphaDo(seg(u,.74,.86),()=>{card(60,600,1465,80,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(90,650,'AI 可能說錯用法，重要內容請對照教材或老師',22,O,700);});
  alphaDo(seg(u,.86,.97),()=>human(60,710,1,'學習進度由你掌握'));
 }},
/* 5 家務文件＋智慧家電（智慧自動化） */
{t:'家務文件與智慧家電',en:'Household paperwork and smart-home routines',dur:13,
 d:'家務的例子：看不懂的繳費通知，貼給 Claude 請它整理成重點與期限。智慧自動化的例子：家裡的智慧插座與冷氣，請 Claude 幫你想一個晚上回家的情境設定。設定寫成草稿，涉及用電與安全的部分，由你自己檢查再啟用。',
 s:[[0,'文件：重點與期限'],[.45,'智慧家電：情境設定草稿'],[.78,'用電安全由你檢查']],
 draw(u){
  sceneBG();
  caseTag(60,170,'life',1);caseTag(60,420,'auto',1);
  alphaDo(seg(u,.04,.2),()=>{card(60,215,900,170,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(90,262,'繳費通知重點（示意）',23,B,800);
   ['金額：1,200 元','期限：本月 25 日','方式：超商或轉帳'].forEach((t,i)=>wt([90,300,560][i],320,t,18,KC.text,600));});
  alphaDo(seg(u,.44,.62),()=>{card(60,465,900,200,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,512,'晚上到家情境（示意）',23,Y,800);
   [['18:30 抵達附近','冷氣開 26 度'],['18:45 到家','玄關燈亮起']].forEach((r,i)=>{wt(90,566+i*50,r[0],20,KC.text,600);arrow(330,560+i*50,380,560+i*50,Y,3);wt(400,566+i*50,r[1],20,G,700);});});
  alphaDo(seg(u,.5,.64),()=>{card(1000,215,540,170,{bg:'rgba(255,255,255,.05)',st:B});para(1024,262,'文件日期與金額，請對照原件確認',490,21,KC.text,600,32);});
  alphaDo(seg(u,.72,.84),()=>{card(1000,465,540,110,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(1024,510,'電熱類電器不設自動啟動，由你確認',490,21,O,700,32);});
  alphaDo(seg(u,.86,.97),()=>human(1000,610,1,'啟用與安全設定由你確認'));
 }},
/* 6 風場參觀（風能） */
{t:'規劃參觀風場',en:'Planning a wind-farm visit',dur:13,
 d:'風能的例子：學校想安排能源教育參訪。請 Claude 整理行前準備：交通與時間、備案、學習單與安全提醒。台灣東北季風期間海邊風大、容易調整行程，要預留備案。實際開放與安全規定，以主辦單位通知為準。',
 s:[[0,'行前準備清單'],[.45,'天候備案與學習單'],[.78,'規定以主辦單位為準']],
 draw(u){
  sceneBG();
  caseTag(60,170,'wind',1);
  alphaDo(seg(u,.04,.2),()=>{card(60,220,720,320,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(90,268,'參訪行前清單（示意）',23,G,800);
   ['確認主辦單位開放日期','交通與集合時間','學習單：風速與發電量','備案：室內導覽'].forEach((t,i)=>{checkBox(90,296+i*54,seg(u,.12+i*.05,.2+i*.05));wt(142,322+i*54,t,20,KC.text,600);});});
  alphaDo(seg(u,.46,.62),()=>{card(820,220,720,320,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(850,268,'風大時的備案（示意）',23,Y,800);
   ['東北季風期風力較強','預留彈性行程與雨具','現場依工作人員指示'].forEach((t,i)=>wt(850,322+i*54,'• '+tr(t),20,KC.text,600));});
  alphaDo(seg(u,.72,.84),()=>{card(60,580,1480,80,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(90,630,'安全帽、動線與禁入區域，一律聽從現場人員指示',22,O,700);});
  alphaDo(seg(u,.86,.97),()=>human(60,700,1,'參訪安排由帶隊老師確認'));
 }},
/* 7 手機上的 Claude */
{t:'手機上的 Claude',en:'Claude on your phone',dur:12,
 d:'手機版的 Claude 讓這些事隨手就能問：可以打字，也可以按語音模式用說的，或是拍照、上傳檔案請它看。語音和文字可以在同一段對話中切換。個人資料與證件，貼上前先想一想是否必要。',
 s:[[0,'打字、語音、拍照'],[.5,'語音與文字可切換'],[.8,'個人資料先想再貼']],
 draw(u){
  sceneBG();
  caseTag(60,170,'life',1);
  card(80,210,300,520,{bg:'rgba(7,27,39,.9)',st:KC.border,lw:3});
  alphaDo(seg(u,.04,.2),()=>{bub(98,250,264,'這張收據怎麼報帳？','user',1);});
  alphaDo(seg(u,.2,.36),()=>{box(98,420,264,60,'rgba(125,255,196,.12)',G,1.5);wt(230,458,'🎙 語音模式',21,G,800,'center');});
  const M=[['打字','寫下問題與條件',B],['語音','邊走邊說，對話式',G],['拍照','拍收據、菜單、標示',Y]];
  M.forEach((r,i)=>{alphaDo(seg(u,.3+i*.12,.44+i*.12),()=>{card(460,230+i*120,520,100,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(490,284+i*120,r[0],26,r[2],800);wt(580,284+i*120,r[1],18,KC.text,600);});});
  alphaDo(seg(u,.66,.8),()=>{card(1020,230,520,200,{bg:'rgba(255,255,255,.05)',st:Y});para(1044,280,'語音和文字可在同一段對話切換',470,22,Y,800,34);});
  alphaDo(seg(u,.78,.9),()=>{card(1020,460,520,130,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(1044,506,'證件與帳號密碼不要隨意貼上',470,21,O,700,32);});
  alphaDo(seg(u,.86,.97),()=>human(1020,630,1,'貼什麼資料由你決定'));
 }}
]};
