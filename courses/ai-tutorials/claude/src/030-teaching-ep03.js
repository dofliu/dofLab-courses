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

/* 030-teaching-ep03 — 測驗與評量規準
   Claude AI 應用動畫館｜課程教學 第 3 集
   依 Claude 支援文章（Artifacts：描述測驗等互動頁面，Claude 會在對話旁產生可操作版本並可修改、分享；Create and edit files with Claude）查證，資訊截至 2026-11 */

const EP={no:3,slug:'teaching',t:'測驗與評量規準',en:'Quizzes & Rubrics',
seriesName:'課程教學',total:8,
lede:'教材做好之後，要確認學生學會了沒有。這一集用生活科學小測驗、自動控制概念與實作評分規準、上鎖掛牌情境題，示範怎麼請 Claude 設計題型、編誘答選項、寫評分規準、做成互動測驗，並說明自動批改的界線與題庫管理。',
facts:[['題型','選擇、簡答、情境題搭配','依學習目標選用'],['誘答選項','根據常見迷思設計','每個錯誤要有原因'],['評分規準','向度、等級、描述語三者齊備','教師調整後才使用'],['互動測驗','Artifacts 可做成可操作的測驗頁面','可修改、可分享'],['題庫','分單元、難度、日期管理','教師逐題審題']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「描述測驗等互動頁面，Claude 會在對話旁產生可操作版本，並可再修改與分享」依 Claude 支援文章整理，資訊截至 2026-11，功能與方案仍在調整，請以官方最新說明為準。題目、評分規準、分數與作答紀錄均為虛構的示意或典型範例，並非任何特定學校、課程或案場資料。AI 提供草案與建議；題目與標準答案、評分與申訴處理、學生資料保護，以及涉及設備操作的安全程序（例如上鎖掛牌）內容，一律由教師與現場人員確認。',
shots:[
/* 1 題型與鑑別度（生活，圖解） */
{t:'題型與鑑別度',en:'Question types',dur:14,
 d:'先想清楚要測什麼，再選題型。選擇題適合快速檢查概念，簡答題看得出推理過程，情境題測試能不能應用。請 Claude 依你的學習目標，建議各題型的比例，並為每一題標出對應的目標。以生活科學小測驗為例，題目由教師審閱後才使用。',
 s:[[0,'先定學習目標'],[.4,'選擇、簡答、情境題搭配'],[.76,'每題對應一個目標']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.22),()=>{card(60,200,520,90,{bg:'rgba(242,194,48,.08)',st:Y,lw:2});wt(90,256,'學習目標：認識電與安全',23,Y,800);});
  alphaDo(seg(u,.26,.62),()=>{
   [['選擇題','快速檢查概念',B,.5],['簡答題','看見推理過程',G,.3],['情境題','測試能否應用',P,.2]].forEach((r,i)=>{
    card(60+i*500,330,480,170,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(90+i*500,382,r[0],26,r[2],800);wt(90+i*500,428,r[1],20,'#fff',600);bar(90+i*500,455,400,16,r[3]*1.6,r[2]);});
   wt(60,540,'建議比例（示意）',19,SUBC,700);});
  alphaDo(seg(u,.66,.88),()=>{card(60,570,1480,90,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,626,'示範題：燈泡不亮時，先檢查哪裡？對應目標：電路迴路',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'題目與目標，由教師審閱'));
 }},
/* 2 誘答選項（智慧自動化，圖解） */
{t:'誘答選項設計',en:'Designing distractors',dur:14,
 d:'好的選擇題，錯誤選項要有道理。請 Claude 根據學生常見的迷思來寫誘答選項，並說明每個錯誤選項代表哪一種誤解。以自動控制概念為例，問開迴路與閉迴路的差別，誘答選項會對應學生常搞混的觀念。選項長度要接近，避免讓人猜出答案。',
 s:[[0,'出一題概念題'],[.4,'錯誤選項對應迷思'],[.76,'選項長度要接近']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.2),()=>{card(60,200,1480,90,{bg:'rgba(242,194,48,.08)',st:Y,lw:2});wt(90,256,'閉迴路控制與開迴路控制的主要差別是什麼？（示意題）',23,Y,800);});
  alphaDo(seg(u,.24,.62),()=>{
   [['A 閉迴路會把輸出回饋給控制器','正解',G],['B 閉迴路一定比較便宜','迷思：功能等於成本',O],['C 開迴路一定不能控制','迷思：開迴路無效',O],['D 兩者只差在感測器顏色','迷思：看外觀',O]].forEach((r,i)=>{
    const a=seg(u,.24+i*.08,.34+i*.08);alphaDo(a,()=>{card(60,320+i*84,880,70,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(84,364+i*84,r[0],21,'#fff',700);
     tag(1000,336+i*84,r[1],{size:17,bg:r[2]});});});});
  alphaDo(seg(u,.68,.9),()=>{card(60,670,1480,64,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,712,'選項長度接近，避免用長度暗示答案',21,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,760,1,'標準答案，由教師確認'));
 }},
/* 3 評分規準（智慧自動化，圖解） */
{t:'評分規準 rubric',en:'Writing rubrics',dur:14,
 d:'實作作業不能只靠對錯，需要評分規準。請 Claude 依作業目標列出向度，例如接線正確、程式邏輯、安全與紀錄，再為每個向度寫出三到四個等級的描述。以 PLC 實作為例，規準寫清楚，學生就知道努力的方向。草案出來後，教師依課堂實際情形調整。',
 s:[[0,'列出評分向度'],[.4,'每個等級寫描述語'],[.76,'教師調整後公布']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.6),()=>{
   const cols=[260,300,300,300,300];
   cells(60,200,cols,['向度','優（4）','佳（3）','待加強（2）','未達（1）'],52,true);
   [['接線正確','全部正確','1 處小錯','多處錯誤','無法運作'],['程式邏輯','邏輯完整','小瑕疵','部分可動','不符需求'],['安全與紀錄','完整且清楚','略有遺漏','紀錄不全','未做']].forEach((r,i)=>{
    alphaDo(seg(u,.1+i*.14,.22+i*.14),()=>cells(60,252+i*62,cols,r,62,false));});
   wt(60,490,'PLC 實作評分規準（示意）',19,SUBC,700);});
  alphaDo(seg(u,.64,.88),()=>{card(60,540,1480,110,{bg:'rgba(125,255,196,.08)',st:G,lw:2});para(90,590,'每個等級有具體描述，學生知道怎麼做到「優」；教師依實際課堂調整',1400,22,G,800,32);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'規準與配分，由教師決定'));
 }},
/* 4 自動批改界線（生活＋風能運維，圖解） */
{t:'自動批改的界線',en:'Limits of auto-grading',dur:14,
 d:'Claude 可以幫你初步批改，但有界線。客觀題和有明確答案的題目，可以請它對照標準答案、列出理由；開放式作答，它能依規準給出建議分數和評語，但最後分數由教師決定。上鎖掛牌這類安全情境題，漏掉任何一步都可能出事，必須由人逐步確認。學生姓名等個資不要貼進對話。',
 s:[[0,'客觀題可初步批改'],[.4,'開放題只給建議，分數由教師定'],[.76,'安全題逐步確認，個資不貼']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);caseTag(210,150,'wind',1);
  alphaDo(seg(u,.02,.3),()=>{
   [['客觀題','對照標準答案，列出理由','可初步批改',G],['開放作答','依規準給建議分數與評語','教師決定分數',Y],['上鎖掛牌情境題','每一步都不能漏','人逐步確認',O]].forEach((r,i)=>{
    card(60+i*500,210,480,230,{bg:'rgba(7,27,39,.85)',st:r[3],lw:2});wt(90+i*500,262,r[0],25,r[3],800);para(90+i*500,308,r[1],420,20,'#fff',600,30);tag(90+i*500,380,r[2],{size:18,bg:r[3]});});});
  alphaDo(seg(u,.4,.66),()=>{wt(60,500,'安全題範例：標準步驟（示意）',20,O,800);
   ['辨識能源','通知相關人員','停機與隔離','上鎖掛牌','確認零能量'].forEach((s,i)=>node(60+i*226,530,206,80,s,O,1,19));});
  alphaDo(seg(u,.7,.88),()=>{card(60,640,1480,64,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(90,682,'學生姓名、學號等個資，不要貼進對話',21,B,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,740,1,'最終成績與申訴處理，由教師負責'));
 }},
/* 5 題庫管理與互動測驗（生活＋智慧自動化，圖解） */
{t:'題庫與互動測驗',en:'Item banks and interactive quizzes',dur:14,
 d:'題目多了就要管理。請 Claude 把題目整理成表格，標上單元、難度、對應目標和使用日期，方便挑選與換題。也可以用 Artifacts 把題目做成可操作的互動測驗，作答後立刻看到回饋，再修改題目或分享給學生。題庫由教師逐題審題後才放入。',
 s:[[0,'題目整理成題庫表'],[.4,'做成互動測驗頁面'],[.76,'審題後才入庫']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);caseTag(210,150,'auto',1);
  alphaDo(seg(u,.02,.4),()=>{
   const cols=[110,190,130,170];
   cells(60,200,cols,['編號','單元','難度','最近使用'],48,true);
   [['Q01','電路與安全','易','10 月'],['Q02','開迴路／閉迴路','中','10 月'],['Q03','PLC 輸入輸出','中','11 月'],['Q04','感測器訊號','難','未使用']].forEach((r,i)=>{
    alphaDo(seg(u,.08+i*.07,.18+i*.07),()=>cells(60,248+i*54,cols,r,54,false));});
   wt(60,500,'題庫表（示意）',19,SUBC,700);});
  alphaDo(seg(u,.44,.76),()=>{arrow(640,340,720,340,Y,4);winFrame(730,190,810,330,'互動測驗（示意）');
   wt(770,262,'Q02：閉迴路的特徵是？',22,'#fff',800);
   [['回饋輸出給控制器',G],['不需要感測器',B]].forEach((r,i)=>{card(770,290+i*60,520,50,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(790,324+i*60,r[0],20,'#fff',700);});
   const ok=seg(u,.6,.7)>.5;if(ok)wt(1320,324,'答對了 ✓',21,G,800);});
  alphaDo(seg(u,.8,.9),()=>{card(60,560,1480,80,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,612,'作答後立即回饋，可再修改題目或分享給學生',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,720,1,'每一題入庫前，由教師審題'));
 }},
/* 6 回顧 */
{t:'測驗與評量回顧',en:'Recap',dur:13,
 d:'整理一下：先定學習目標再選題型；誘答選項對應常見迷思；評分規準寫清楚向度和等級；自動批改只做初步檢查，最終分數與安全程序由人確認；題庫要持續整理。三個課程類型都適用。下一集是差異化與適性教學。',
 s:[[0,'測驗與評量五步'],[.5,'三類課程都適用'],[.8,'下一集：差異化與適性教學']],
 draw(u){
  diagBG();floatParticles(8,81);
  alphaDo(seg(u,.02,.5),()=>{pipe(60,200,['題型','誘答選項','評分規準','自動批改'],seg(u,.02,.5),[B,Y,G,P]);node(60+4*226,200,206,92,'題庫',O,seg(u,.4,.5),21);});
  alphaDo(seg(u,.5,.74),()=>{
   [['生活','科學小測驗',B],['智慧自動化','概念題與實作規準',Y],['風能運維','上鎖掛牌情境題',G]].forEach((r,i)=>{card(60+i*500,380,480,120,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,398,r[0],{size:17,bg:r[2]});wt(86+i*500,472,r[1],22,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,600,'Claude 起草，教師審題與決定成績',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'題目、成績與安全程序，由教師負責'));
 }}
]};
