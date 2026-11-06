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
function fileTag(x,y,w,txt,col){rrp(x,y,w,38,8);ctx.fillStyle='rgba(7,27,39,.9)';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();wt(x+14,y+26,txt,18,col,700);}
function node(x,y,w,h,txt,col,a,sz){alphaDo(a===undefined?1:a,()=>{card(x,y,w,h,{bg:'rgba(7,27,39,.85)',st:col,lw:2});wt(x+w/2,y+h/2+8,txt,sz||21,'#fff',800,'center');});}
function codeLine(x,y,txt,col){wt(x,y,txt,19,col||KC.text,600);}

/* 033-teaching-ep06 — AI 素養與學術誠信
   Claude AI 應用動畫館｜課程教學 第 6 集
   依 support.claude.com 年齡規定與年齡確認說明、各校 AI 使用政策公開做法整理，資訊截至 2026-11 */

const EP={no:6,slug:'teaching',t:'AI 素養與學術誠信',en:'AI Literacy & Integrity',
seriesName:'課程教學',total:8,
lede:'學生都在用 AI，禁止不了，也不必假裝沒發生。這一集用作業標示、專題報告揭露、實習報告數據查證三個情境，說明怎麼訂出清楚的課堂政策、讓學生標示 AI 的用法、用過程性評量看到思考，並提醒隱私與未成年的界線。',
facts:[['課堂政策','寫清楚可用、限用、不可用','各課程、各作業可以不同'],['標示用法','說明用在哪、怎麼改','像引用文獻一樣誠實交代'],['過程性評量','看草稿、對話與口頭說明','比只看成品更看得到思考'],['查證練習','數字與來源要回頭核對','AI 可能寫錯，責任在作者'],['隱私與年齡','Claude.ai 限 18 歲以上','學生個資與機密資料不貼上去']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「Claude 消費者產品僅限 18 歲以上，註冊時需確認，偵測到可能未成年訊號時會要求年齡驗證」依 support.claude.com 年齡規定與年齡確認說明整理，資訊截至 2026-11，細節以官方最新說明為準；未成年學生的使用方式須依學校、機構與當地法規另行規劃。課堂政策、揭露聲明、對話、數據與警報均為虛構的示意或典型範例，並非任何特定學校、學生、公司或案場資料。AI 提供建議；學術誠信的認定、成績評量、學生個資保護，以及涉及設備操作的安全程序（例如停機與上鎖掛牌、對 PLC 下指令），一律由教師與現場人員確認。',
shots:[
{t:'課堂 AI 使用政策',en:'Classroom AI policy',dur:14,
 d:'第一步是把規則寫清楚。同一門課裡，查資料可以用，批改前的語法檢查可以用，但期末個人心得要自己寫。三個等級：可用、限用並標示、不可用。寫在課程大綱上，學生才知道界線在哪裡。',
 s:[[0,'三個等級'],[.4,'逐項對照作業'],[.76,'寫進課程大綱']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.4),()=>{
   [['可用','查資料、整理筆記、檢查語法',G],['限用並標示','產生初稿、翻譯、改寫段落',Y],['不可用','個人心得、小考、口試',O]].forEach((r,i)=>{
    alphaDo(seg(u,.04+i*.1,.16+i*.1),()=>{card(60+i*500,200,480,190,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,218,r[0],{size:19,bg:r[2]});para(86+i*500,300,r[1],420,21,'#fff',800,30);});});});
  alphaDo(seg(u,.44,.74),()=>{
   const cols=[260,400,400,420];cells(60,430,cols,['作業','查資料','寫初稿','交成品'],56,true);
   [['每週心得','可用','不可用','自己寫'],['分組報告','可用','限用並標示','附揭露'],['期末口試','不可用','不可用','現場說明']].forEach((r,i)=>{
    alphaDo(seg(u,.46+i*.07,.56+i*.07),()=>cells(60,486+i*56,cols,r,56,false,[null,r[1]==='不可用'?['rgba(232,87,42,.15)',O]:['rgba(125,255,196,.12)',G],r[2]==='不可用'?['rgba(232,87,42,.15)',O]:['rgba(242,194,48,.12)',Y],null]));});});
  alphaDo(seg(u,.78,.9),()=>{wt(60,700,'規則寫進課程大綱，比事後抓違規有效',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,750,1,'政策內容由教師與學校制定'));
 }},
{t:'標示 AI 使用方式',en:'Disclosing AI use',dur:14,
 d:'標示要具體。不是只寫「我有用 AI」，而是說明：用了什麼工具、問了什麼、哪些採用、哪些改掉。以智慧自動化專題為例，學生交一份揭露聲明，教師才能判斷哪些是學生自己的貢獻。',
 s:[[0,'標示要具體'],[.4,'專題揭露聲明'],[.76,'對照：哪些是自己做的']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.2),()=>{
   card(60,200,700,76,{bg:'rgba(232,87,42,.1)',st:O,lw:2});wt(90,250,'太籠統：「本報告有使用 AI」',22,O,800);
   card(800,200,740,76,{bg:'rgba(125,255,196,.1)',st:G,lw:2});wt(830,250,'具體：工具、用途、採用與修改',22,G,800);});
  alphaDo(seg(u,.22,.74),()=>{
   winFrame(60,310,1480,380,'專題報告・AI 使用揭露（示意）');
   [['工具','Claude（對話）'],['用途','協助整理 PLC 輸出入點表格式'],['我採用','表格欄位設計，已逐項對照圖面'],['我修改','刪掉錯誤的地址，補上實測時序'],['我自己做','接線、程式撰寫、現場測試']].forEach((r,i)=>{
    alphaDo(seg(u,.26+i*.08,.36+i*.08),()=>{wt(96,386+i*56,r[0],21,Y,800);wt(260,386+i*56,r[1],21,'#fff',700);if(i===4)ln([90,365+i*56,1500,365+i*56],'rgba(255,255,255,.15)',1);});});});
  alphaDo(seg(u,.78,.9),()=>{wt(60,730,'揭露是誠實交代，不是自首',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,780,1,'是否構成違規，由教師依政策判斷'));
 }},
{t:'過程性評量',en:'Process-based assessment',dur:14,
 d:'只看成品，分不出是學生自己想的，還是 AI 寫的。改看過程：要求交出草稿版本、和 Claude 的對話紀錄、再加三分鐘口頭說明。以作業為例，學生能講出為什麼這樣改，就是真的學到。',
 s:[[0,'只看成品的盲點'],[.4,'看過程：草稿、對話、說明'],[.76,'會講理由才算學到']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.3),()=>{
   node(60,210,260,92,'成品',O,1);wt(350,264,'？ 是誰想的 ？',26,O,800);});
  alphaDo(seg(u,.32,.66),()=>{
   pipe(60,350,['草稿 v1','對話紀錄','草稿 v2','口頭說明'],seg(u,.32,.62),[B,Y,G,P]);
   alphaDo(seg(u,.5,.66),()=>{wt(60,490,'每個階段都留下思考痕跡',22,SUBC,700);});});
  alphaDo(seg(u,.68,.88),()=>{
   alphaDo(seg(u,.68,.78),()=>{card(60,530,760,80,{bg:'rgba(242,194,48,.1)',st:Y,lw:2});wt(86,580,'老師：這一段你為什麼改成這樣？',21,Y,800);});
   alphaDo(seg(u,.78,.88),()=>{card(840,530,700,80,{bg:'rgba(88,184,208,.1)',st:B,lw:2});wt(866,580,'學生：因為原本的例子和作業題目不符……',21,'#fff',700);});});
  alphaDo(seg(u,.9,.99),()=>human(60,750,1,'成績與認定，由教師依規準評量'));
 }},
{t:'查證練習',en:'Verification practice',dur:14,
 d:'AI 會寫得很流暢，也可能寫錯。以實習報告為例：Claude 幫忙整理風機運維紀錄，卻把某個數字寫成了典型值。學生要回頭核對原始資料：數字出自哪裡、單位對不對、有沒有自己編的來源。報告署名的是作者，責任也在作者。',
 s:[[0,'AI 草稿的數字'],[.4,'回頭核對原始資料'],[.76,'責任在作者']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.36),()=>{
   winFrame(60,200,700,300,'實習報告草稿（示意）');
   para(94,276,'本季機組可利用率約 98%，故障停機 3 次（示意）',630,21,'#fff',700,32);
   alphaDo(seg(u,.14,.3),()=>{ring(400,372,60,Y,3);wt(94,452,'這個數字從哪來？',20,Y,800);});});
  alphaDo(seg(u,.38,.7),()=>{
   [['原始 SCADA 匯出','可利用率 96.4%（示意）',B],['維修工單','停機 4 次（示意）',G],['來源是否存在','報告引用的文件找不到',O]].forEach((r,i)=>{
    alphaDo(seg(u,.4+i*.09,.52+i*.09),()=>{card(800,200+i*104,740,88,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(826,240+i*104,r[0],20,r[2],800);wt(826,274+i*104,r[1],21,'#fff',700);});});});
  alphaDo(seg(u,.72,.9),()=>{wt(60,590,'數字、單位、來源三項核對，再署名',23,G,800);wt(60,634,'Claude 能協助對照與提醒，但原始資料要自己打開看',21,SUBC,700);});
  alphaDo(seg(u,.9,.99),()=>human(60,720,1,'資料真實性與運維判斷，由作者與現場人員確認'));
 }},
{t:'隱私與未成年保護',en:'Privacy and minors',dur:14,
 d:'最後是界線。Claude 的消費者產品限 18 歲以上，註冊時要確認，偵測到可能未成年的訊號，還會要求年齡驗證。所以未成年學生怎麼使用，要由學校另外規劃。另外，學生姓名、成績、現場機密資料，不要貼進對話。',
 s:[[0,'18 歲以上'],[.4,'個資與機密不貼上去'],[.76,'學校另行規劃']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);caseTag(210,150,'auto',1);
  alphaDo(seg(u,.02,.36),()=>{
   card(60,200,700,230,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(90,252,'Claude.ai 年齡規定',23,B,800);
   wt(90,365,'18+',64,Y,800);
   para(250,335,'註冊時確認年滿 18 歲；偵測到可能未成年訊號，會要求年齡驗證',480,20,'#fff',700,30);});
  alphaDo(seg(u,.4,.7),()=>{
   card(800,200,740,230,{bg:'rgba(7,27,39,.85)',st:O,lw:2});wt(830,252,'不要貼進對話',23,O,800);
   ['學生姓名與成績','未公開的設備圖面與參數','客戶與廠商機密'].forEach((s,i)=>{alphaDo(seg(u,.42+i*.07,.52+i*.07),()=>{ln([830,300+i*40,850,320+i*40],O,3);ln([850,300+i*40,830,320+i*40],O,3);wt(870,318+i*40,s,21,'#fff',700);});});});
  alphaDo(seg(u,.72,.9),()=>{card(60,470,1480,92,{bg:'rgba(242,194,48,.08)',st:Y,lw:2});wt(90,528,'未成年學生：由學校依規定與法規另外規劃，不要自行用個人帳號',22,Y,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,640,1,'個資保護與使用規劃，由學校與教師決定'));
 }},
{t:'AI 素養回顧',en:'Recap',dur:13,
 d:'整理一下：先訂政策，再要求具體標示；用過程性評量看見思考；數字與來源一定回頭查證；個資與年齡界線要守住。三種課程情境都適用。下一集談回饋與學習分析。',
 s:[[0,'AI 素養四步'],[.5,'三類情境都適用'],[.8,'下一集：回饋與學習分析']],
 draw(u){
  diagBG();floatParticles(8,83);
  alphaDo(seg(u,.02,.5),()=>{pipe(60,200,['訂政策','具體標示','看過程','查證與守界'],seg(u,.02,.5),[B,Y,G,P]);});
  alphaDo(seg(u,.5,.74),()=>{
   [['生活','作業標示 AI 使用',B],['智慧自動化','專題揭露聲明',Y],['風能運維','報告數據要查證',G]].forEach((r,i)=>{card(60+i*500,380,480,120,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,398,r[0],{size:17,bg:r[2]});wt(86+i*500,472,r[1],22,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,600,'Claude 協助，誠信與判斷由人負責',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'誠信認定、個資與安全程序，由教師負責'));
 }}
]};
