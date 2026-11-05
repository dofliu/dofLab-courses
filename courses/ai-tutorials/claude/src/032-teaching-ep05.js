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

/* 032-teaching-ep05 — AI 家教：蘇格拉底式引導
   Claude AI 應用動畫館｜課程教學 第 5 集
   依 Claude.ai「學習」風格（Learning style）與 Claude Code 輸出風格（Learning／Explanatory）的公開說明查證，資訊截至 2026-11 */

const EP={no:5,slug:'teaching',t:'AI 家教：蘇格拉底式引導',en:'AI Tutor: Socratic Guidance',
seriesName:'課程教學',total:8,
lede:'學生問「答案是什麼」，最快的做法是直接給，但學生也最容易什麼都沒學到。這一集用生活、PLC 程式除錯、風機警報推理三個情境，示範怎麼讓 Claude 當家教：用提問引導、診斷迷思概念，並逐步退場，培養學生自己想的能力。',
facts:[['直接給答案','快，但學生少了思考','適合查資料，不適合學概念'],['引導式提問','用問題帶學生往前走','答案由學生自己說出'],['學習風格','Claude.ai 有「學習」風格','可隨時切換，不需要時改回預設'],['迷思診斷','先問想法，再找出誤解','用反例幫學生自己修正'],['逐步退場','提示由多到少','目標是學生不再需要提示']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「Claude.ai 風格選單提供學習（Learning）風格，以提問引導而非直接給答案」與「Claude Code 有 Learning／Explanatory 輸出風格」依官方公開說明與媒體報導整理，資訊截至 2026-11，名稱、位置與方案可用性仍在調整，請以官方最新說明為準。對話內容、程式片段、警報與數據均為虛構的示意或典型範例，並非任何特定學校、學生或案場資料。AI 提供引導與建議；學習評量、學生個資保護，以及涉及設備操作的安全程序（例如停機與上鎖掛牌、對 PLC 下指令），一律由教師與現場人員確認。',
shots:[
{t:'給答案 vs 引導思考',en:'Answer vs guidance',dur:14,
 d:'學生問：為什麼天空是藍的？Claude 可以直接給答案，也可以反問：你看過夕陽嗎？它為什麼是紅的？前者很快，後者慢一點，但學生會自己把線索接起來。差別在於誰在思考。',
 s:[[0,'直接給答案：快'],[.4,'引導提問：學生在想'],[.76,'差別在誰思考']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.4),()=>{
   tag(60,200,'直接給答案',{size:18,bg:O});
   bub(60,240,720,'你問：為什麼天空是藍的？（示意）','user',1);
   bub(60,350,720,'Claude：因為大氣散射藍光比紅光更多。','ai',seg(u,.12,.3));
   wt(60,530,'學生抄下答案，下次還是不會',21,O,700);});
  alphaDo(seg(u,.42,.74),()=>{
   tag(820,200,'引導提問',{size:18,bg:G});
   bub(820,240,720,'Claude：你看過夕陽嗎？它為什麼是紅的？','ai',seg(u,.44,.56),G);
   bub(820,350,720,'學生：陽光走的路比較長……','user',seg(u,.54,.66));
   bub(820,460,720,'Claude：那光穿過大氣時，哪種顏色先被散開？','ai',seg(u,.62,.74),G);});
  alphaDo(seg(u,.78,.9),()=>{wt(60,650,'答案本身不是目標，想通的過程才是',23,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'何時給答案、何時引導，由教師決定'));
 }},
{t:'學習模式',en:'Learning mode',dur:14,
 d:'Claude.ai 的風格選單裡有「學習」風格：開啟後，Claude 傾向用問題引導，而不是直接交出答案，不需要時隨時切回預設。Claude Code 也有 Learning 與 Explanatory 兩種輸出風格，前者會請你自己寫一部分程式。',
 s:[[0,'風格選單：學習風格'],[.4,'Claude Code 輸出風格'],[.76,'隨時可切換']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.4),()=>{
   winFrame(60,200,700,320,'Claude.ai（示意）');
   wt(90,272,'風格',19,SUBC,700);
   [['預設','直接回答',KC.border],['學習','用提問引導',G]].forEach((r,i)=>{
    const on=i===1&&u>.2;
    card(90,292+i*84,640,70,{bg:on?'rgba(125,255,196,.12)':'rgba(7,27,39,.85)',st:on?G:r[2],lw:2});
    wt(116,336+i*84,r[0],23,on?G:'#fff',800);wt(260,336+i*84,r[1],21,SUBC,600);});});
  alphaDo(seg(u,.42,.74),()=>{
   winFrame(800,200,740,320,'Claude Code（示意）');
   wt(830,272,'輸出風格',19,SUBC,700);
   [['Explanatory','邊做邊解釋原因',B],['Learning','請你寫一部分程式',G]].forEach((r,i)=>{
    card(830,292+i*84,680,70,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});
    wt(856,336+i*84,r[0],23,r[2],800);wt(1070,336+i*84,r[1],21,SUBC,600);});});
  alphaDo(seg(u,.78,.9),()=>{wt(60,600,'學習風格會讓回應變長；趕時間查資料時，改回預設',22,Y,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,700,1,'何時開啟學習風格，由學生與教師討論'));
 }},
{t:'提示詞範本',en:'Prompt template',dur:14,
 d:'就算不用學習風格，也可以自己寫提示詞。以 PLC 梯形圖除錯為例：說明你是老師的角色、不要直接給答案、一次只問一個問題、學生卡住時才給提示。這樣 Claude 就會帶著學生一步步找出線路的問題。',
 s:[[0,'角色加規則'],[.4,'一次只問一題'],[.76,'卡住才給提示']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.4),()=>{
   winFrame(60,200,760,420,'提示詞範本（示意）');
   ['你是 PLC 課程的助教','不要直接給答案或完整程式','一次只問一個問題','學生卡住時，才給一級提示','最後請學生自己說出原因'].forEach((s,i)=>{
    alphaDo(seg(u,.06+i*.06,.14+i*.06),()=>{checkBox(94,262+i*66,1);wt(144,288+i*66,s,21,'#fff',700);});});});
  alphaDo(seg(u,.44,.8),()=>{
   bub(860,200,680,'學生：馬達不會自保持，為什麼？（示意）','user',seg(u,.44,.56));
   bub(860,320,680,'Claude：自保持靠哪個接點？它接在哪裡？','ai',seg(u,.54,.68),G);
   bub(860,440,680,'學生：應該是並聯在啟動鈕旁……','user',seg(u,.66,.78));});
  alphaDo(seg(u,.82,.92),()=>{wt(60,670,'提示詞也可以存成 Projects 專屬指令，整個專案的對話都套用',21,Y,700);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'涉及設備的操作，由教師與現場人員確認'));
 }},
{t:'迷思概念診斷',en:'Diagnosing misconceptions',dur:14,
 d:'學生看到風機溫度警報，就說：換感測器。先別急著糾正。請 Claude 問：還有哪些資料？溫度什麼時候開始上升？風速和功率有變化嗎？讓學生發現，可能是冷卻問題，不是感測器。診斷出迷思後，再用反例修正。',
 s:[[0,'先問學生怎麼想'],[.4,'用資料反問'],[.76,'反例修正迷思']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.3),()=>{
   card(60,200,1480,76,{bg:'rgba(242,194,48,.08)',st:Y,lw:2});wt(90,250,'學生：齒輪箱溫度高警報，直接換感測器吧（示意）',23,Y,800);});
  alphaDo(seg(u,.32,.66),()=>{
   [['溫度何時開始上升？','只在高負載時升高',0,B],['風速與功率有變化嗎？','風速大、功率高',0,G],['鄰近的測點呢？','也一起上升',0,P]].forEach((r,i)=>{
    alphaDo(seg(u,.32+i*.1,.44+i*.1),()=>{card(60+i*500,310,480,170,{bg:'rgba(7,27,39,.85)',st:r[3],lw:2});para(90+i*500,356,r[0],420,21,'#fff',800,30);wt(90+i*500,440,r[1],20,r[3],700);});});});
  alphaDo(seg(u,.68,.88),()=>{card(60,520,1480,80,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,570,'學生自己推理：多個測點一起升，可能是冷卻不足，不只是感測器',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,700,1,'停機與檢修決定，由現場人員確認'));
 }},
{t:'培養自主學習',en:'Building independent learners',dur:14,
 d:'好的家教會慢慢退場。一開始多給提示，之後只問一個問題，最後學生自己提出檢查清單，再請 Claude 當審閱者。教師也要看對話紀錄：學生是在思考，還是在套公式。',
 s:[[0,'提示由多到少'],[.4,'學生自己提檢查清單'],[.76,'教師看學習歷程']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.45),()=>{
   [['第 1 次','完整提示',1.0,B],['第 2 次','只問一個問題',.6,G],['第 3 次','學生自己提清單',.25,P]].forEach((r,i)=>{
    alphaDo(seg(u,.04+i*.1,.16+i*.1),()=>{wt(60,238+i*70,r[0],21,'#fff',800);wt(200,238+i*70,r[1],20,r[3],700);bar(500,220+i*70,600,24,r[2],r[3]);});});
   wt(1130,240,'Claude 提示量',19,SUBC,700);});
  alphaDo(seg(u,.5,.74),()=>{
   card(60,440,1480,130,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,490,'學生寫的檢查清單（示意）',21,Y,800);
   ['先看時序','再看負載','最後驗證'].forEach((s,i)=>{checkBox(90+i*300,512,seg(u,.56+i*.05,.64+i*.05));wt(138+i*300,538,s,20,'#fff',700);});});
  alphaDo(seg(u,.78,.9),()=>{wt(60,630,'教師檢視對話：學生在思考，還是在套公式？',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,700,1,'學習評量與回饋，由教師負責'));
 }},
{t:'AI 家教回顧',en:'Recap',dur:13,
 d:'整理一下：先決定要答案還是要理解；學習風格或自己寫提示詞，讓 Claude 用提問引導；先診斷迷思再修正；提示逐步減少。三個課程類型都適用。下一集談 AI 素養與學術誠信。',
 s:[[0,'AI 家教四步'],[.5,'三類課程都適用'],[.8,'下一集：AI 素養與學術誠信']],
 draw(u){
  diagBG();floatParticles(8,81);
  alphaDo(seg(u,.02,.5),()=>{pipe(60,200,['選目標','提問引導','診斷迷思','逐步退場'],seg(u,.02,.5),[B,Y,G,P]);});
  alphaDo(seg(u,.5,.74),()=>{
   [['生活','用提問帶學生想通',B],['智慧自動化','PLC 除錯不給答案',Y],['風能運維','從警報推理故障',G]].forEach((r,i)=>{card(60+i*500,380,480,120,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,398,r[0],{size:17,bg:r[2]});wt(86+i*500,472,r[1],22,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,600,'Claude 引導，教師決定何時給答案',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'評量、個資與安全程序，由教師負責'));
 }}
]};
