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

/* 034-teaching-ep07 — 回饋與學習分析
   Claude AI 應用動畫館｜課程教學 第 7 集
   依 support.claude.com「Upload files to Claude」「Create and edit files with Claude」「What are projects?」整理，資訊截至 2026-11 */

const EP={no:7,slug:'teaching',t:'回饋與學習分析',en:'Feedback & Learning Analytics',
seriesName:'課程教學',total:8,
lede:'批改與回饋最耗時間。這一集用作文回饋、實作報告批次回饋、成績資料分析、運維實習紀錄的能力分析、親師溝通五個環節，示範怎麼把評分規準交給 Claude 產生回饋草稿與統計，再由教師逐份確認、保護學生個資。',
facts:[['回饋框架','優點、待改進、下一步','依評分規準給具體回饋'],['批次回饋','同一規準套用多份作業','教師逐份確認後才送出'],['成績分析','上傳 CSV，算答對率與分布','Claude 可分析上傳的資料檔'],['個別化建議','對照能力指標，給練習方向','建議只是起點'],['親師溝通','草稿、語氣、去識別化','學生個資不貼上去']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「Claude 可分析上傳的 CSV 等資料檔並產生圖表，單檔上限 30MB」「Projects 可保存規準等知識檔供多次對話使用」依 support.claude.com 說明整理，資訊截至 2026-11，細節以官方最新說明為準。作文、規準、分數、答對率、實習紀錄與家長訊息均為虛構的示意或典型範例，並非任何特定學校、學生、公司或案場資料。AI 提供回饋草稿與統計建議；評分、成績認定、與家長的溝通、學生個資保護，以及涉及設備操作的安全程序（例如停機與上鎖掛牌、對 PLC 下指令），一律由教師與現場人員確認。',
shots:[
{t:'作文回饋框架',en:'A feedback framework',dur:14,
 d:'好的回饋有固定結構：先說優點，再指出一到兩個最需要改的地方，最後給下一步怎麼做。把評分規準貼給 Claude，它就能照規準產生回饋草稿。以國中作文為例，回饋要具體到哪一段，而不是只寫「再加油」。',
 s:[[0,'優點、待改進、下一步'],[.4,'依規準產生回饋'],[.76,'具體到段落']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.36),()=>{
   [['優點','開頭用生活小事引入，很有畫面',G],['待改進','第三段的論點沒有舉例支持',Y],['下一步','補一個親身經驗，再寫結尾句',B]].forEach((r,i)=>{
    alphaDo(seg(u,.04+i*.1,.16+i*.1),()=>{card(60+i*500,200,480,190,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,218,r[0],{size:19,bg:r[2]});para(86+i*500,300,r[1],420,21,'#fff',800,30);});});});
  alphaDo(seg(u,.4,.72),()=>{
   const cols=[300,300,300,300];cells(60,430,cols,['規準','權重','學生 A','建議'],56,true);
   [['立意取材','30%','4 / 5','舉例'],['結構組織','30%','3 / 5','段落轉折'],['文字表達','40%','4 / 5','保持']].forEach((r,i)=>{
    alphaDo(seg(u,.42+i*.07,.52+i*.07),()=>cells(60,486+i*56,cols,r,56,false));});});
  alphaDo(seg(u,.76,.9),()=>{wt(60,700,'「再加油」不是回饋，「第三段補例子」才是',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,750,1,'評分與最終回饋，由教師確認'));
 }},
{t:'批次回饋',en:'Batch feedback',dur:14,
 d:'一次有四十份實作報告，怎麼辦？把同一份規準和範例回饋交給 Claude，一份份產生草稿。智慧自動化課程的 PLC 實作報告，可以檢查接線圖、時序圖與測試紀錄是否齊全。教師再逐份看過、修改，才發回給學生。',
 s:[[0,'同一份規準套用多份'],[.4,'檢查項目逐份產生草稿'],[.76,'教師逐份確認']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.3),()=>{
   fileTag(60,210,300,'規準與範例回饋',B);
   arrow(370,229,430,229,Y,3);
   for(let i=0;i<4;i++)alphaDo(seg(u,.06+i*.04,.16+i*.04),()=>fileTag(440+i*250,210,230,trf('實作報告 {n}',{n:i+1}),G));});
  alphaDo(seg(u,.32,.7),()=>{
   const cols=[240,260,260,260,460];cells(60,300,cols,['報告','接線圖','時序圖','測試紀錄','回饋草稿'],56,true);
   [['01','齊全','齊全','齊全','優：流程清楚'],['02','缺端子標示','齊全','缺','補端子與測試'],['03','齊全','與程式不符','齊全','核對時序圖']].forEach((r,i)=>{
    alphaDo(seg(u,.36+i*.09,.48+i*.09),()=>cells(60,356+i*56,cols,r,56,false,[null,r[1]==='齊全'?null:['rgba(242,194,48,.12)',Y],r[2]==='齊全'?null:['rgba(242,194,48,.12)',Y],r[3]==='齊全'?null:['rgba(242,194,48,.12)',Y],null]));});});
  alphaDo(seg(u,.72,.88),()=>{wt(60,590,'草稿加快初稿，品質把關仍在老師',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,650,1,'逐份確認後才發回學生'));
 }},
{t:'成績資料分析',en:'Analyzing score data',dur:14,
 d:'成績表可以直接上傳。Claude 可以分析 CSV 資料檔，算出每題答對率、分數分布，找出全班最常錯的題目。以段考為例，第七題答對率最低，代表這個觀念值得回頭再講。',
 s:[[0,'上傳 CSV'],[.4,'每題答對率'],[.76,'找出要回頭教的觀念']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.3),()=>{fileTag(60,200,320,'段考成績.csv（示意）',B);arrow(390,219,470,219,Y,3);node(480,196,300,46,'Claude 分析',Y,1,19);});
  alphaDo(seg(u,.34,.72),()=>{
   const vals=[.92,.85,.78,.88,.7,.64,.31,.8];
   vals.forEach((v,i)=>{alphaDo(seg(u,.36+i*.03,.5+i*.03),()=>{
    const x=100+i*170;box(x,640-300*v,110,300*v,i===6?O:B,'none',0);wt(x+55,630-300*v,Math.round(v*100)+'%',20,i===6?O:'#fff',800,'center');wt(x+55,672,trf('第 {n} 題',{n:i+1}),18,SUBC,700,'center');});});
   ln([80,640,1480,640],'rgba(255,255,255,.3)',2);});
  alphaDo(seg(u,.72,.88),()=>{wt(60,740,'第 7 題答對率最低，下週回頭複習',24,O,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,790,1,'分析結果由教師判讀與決策'));
 }},
{t:'個別化建議',en:'Individualized advice',dur:14,
 d:'有了資料，就能給個別建議。風能運維實習課，學生的實習紀錄對照能力指標，Claude 整理出誰在巡檢紀錄寫得很完整，誰的故障判讀還需要練習，並提出下一週的練習方向。涉及設備操作的安全程序，一律由現場人員確認。',
 s:[[0,'實習紀錄對照能力指標'],[.4,'找出強項與待加強'],[.76,'下週練習方向']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.5),()=>{
   card(60,200,760,420,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(90,246,'學生 B・實習能力指標（示意）',22,B,800);
   [['巡檢紀錄完整度',.9,G],['故障現象判讀',.45,O],['安全程序遵守',.85,G],['工單撰寫',.65,Y]].forEach((r,i)=>{
    alphaDo(seg(u,.08+i*.08,.2+i*.08),()=>{wt(90,310+i*80,r[0],20,'#fff',700);bar(90,328+i*80,520,22,r[1],r[2]);wt(630,347+i*80,Math.round(r[1]*100)+'%',20,r[2],800);});});});
  alphaDo(seg(u,.5,.74),()=>{
   card(860,200,680,420,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(890,246,'建議練習（草稿）',22,Y,800);
   ['用三個歷史警報練習判讀順序','對照風速與功率曲線找異常','寫一份示範工單，教師審閱'].forEach((s,i)=>{alphaDo(seg(u,.52+i*.07,.62+i*.07),()=>{circ(900,310+i*90,5,Y,'none',0);para(918,316+i*90,s,580,21,'#fff',700,30);});});});
  alphaDo(seg(u,.78,.9),()=>{wt(60,680,'建議是起點，不是標籤',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,740,1,'評量與現場安全程序，由教師與現場人員確認'));
 }},
{t:'親師溝通',en:'Parent communication',dur:14,
 d:'最後是溝通。要寫給家長一則說明孩子近況的訊息，Claude 可以幫忙擬稿、調整語氣，讓內容具體又友善。但學生姓名與成績等個資不要貼進對話，用代號去識別化，寄出前由老師看過並自行發送。',
 s:[[0,'擬稿與語氣'],[.4,'去識別化再貼上'],[.76,'老師確認後自己發送']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.5),()=>{
   winFrame(60,200,900,430,'Claude（示意）');
   bub(90,260,800,'請幫我寫給家長的訊息：學生 A 近兩週作業進步，但小考還需要練習。語氣友善。','user',seg(u,.06,.18));
   bub(90,420,800,'您好，這兩週 A 同學作業完成度明顯進步。接下來我們會多安排小考前的練習……','ai',seg(u,.2,.34));});
  alphaDo(seg(u,.5,.74),()=>{
   card(1000,200,540,200,{bg:'rgba(232,87,42,.1)',st:O,lw:2});wt(1030,250,'不要貼：姓名、成績單',22,O,800);
   card(1000,430,540,200,{bg:'rgba(125,255,196,.1)',st:G,lw:2});wt(1030,480,'用代號：學生 A',22,G,800);wt(1030,524,'去識別化再貼上',20,SUBC,700);});
  alphaDo(seg(u,.9,.99),()=>human(60,700,1,'確認內容並由老師自己發送'));
 }},
{t:'回饋與分析回顧',en:'Recap',dur:13,
 d:'整理一下：依規準給具體回饋；批次產生草稿再逐份確認；上傳資料找出要回頭教的觀念；對照能力指標給個別建議；親師溝通去識別化後由老師發送。下一集是這個系列的最後一集。',
 s:[[0,'回饋與分析五步'],[.5,'三類情境都適用'],[.8,'下一集：系列最終回']],
 draw(u){
  diagBG();floatParticles(8,83);
  alphaDo(seg(u,.02,.5),()=>{pipe(60,200,['規準回饋','批次草稿','資料分析','個別建議'],seg(u,.02,.5),[B,Y,G,P]);});
  alphaDo(seg(u,.5,.74),()=>{
   [['生活','作文回饋與成績分析',B],['智慧自動化','實作報告批次回饋',Y],['風能運維','實習紀錄能力分析',G]].forEach((r,i)=>{card(60+i*500,380,480,120,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,398,r[0],{size:17,bg:r[2]});wt(86+i*500,472,r[1],22,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,600,'Claude 加速草稿，評分與溝通由老師負責',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'評分、個資與安全程序，由教師負責'));
 }}
]};
