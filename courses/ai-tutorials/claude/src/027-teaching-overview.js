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
const EP={no:0,slug:'teaching',seriesName:'課程教學系列・總覽片',t:'AI 時代的備課與教學',en:'Teaching: Overview',total:8,
lede:'備課、做教材、出測驗、因材施教，教學工作有很多環節能和 Claude 搭配。這支總覽片用國中小生活科技、PLC 實習與風機維護課程，走過逆向設計、教材、評量規準、差異化、AI 家教、學術誠信到學習分析，教學目標與成績判斷仍由老師負責。',
facts:[['7','個主題','課程教學系列的七集：從備課到學習分析'],['先目標','再教材','逆向設計：先定學習成果與評量證據'],['規準','先公開','評量規準事先給學生，評分更透明'],['引導','不給答案','AI 家教以提問引導學生自己想'],['老師','定成績','評分與學術誠信判斷由老師負責']],
note:'說明：本片為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。Claude 的學習模式（風格選單）、Projects、Artifacts 與 Claude for Education 依 Anthropic 公開說明與媒體報導整理，資訊截至 2026-10，功能與介面仍在調整，請以 support.claude.com 與 anthropic.com 最新說明為準。課程大綱、測驗題、評量規準、PLC 練習與風機維護課內容均為虛構的示意或典型範例，並非任何特定學校、班級、學生或案場資料；AI 提供分析與建議，成績評定、停機、上鎖掛牌與對 PLC 下指令等動作，一律由老師或現場人員確認後執行。',
shots:[
/* 1 全景 */
{t:'備課到學習分析全景',en:'From lesson planning to learning analytics',dur:12,
 d:'教學工作可以拆成七件事：先用逆向設計定目標，再做教材、設計測驗與評量規準，接著照學生程度調整，用 AI 家教引導練習，談 AI 素養與學術誠信，最後用回饋與學習分析持續改進。',
 s:[[0,'七個教學環節'],[.5,'從備課一路到改進'],[.8,'老師始終是決定者']],
 draw(u){
  sceneBG();
  const A=['逆向設計','教材製作','測驗與規準','差異化','AI 家教','學術誠信','回饋分析'],C=[B,Y,G,P,O,B,Y];
  A.forEach((s,i)=>{const a=seg(u,.02+i*.07,.12+i*.07),x=60+(i%4)*380,y=190+Math.floor(i/4)*190;
   alphaDo(a,()=>{card(x,y,330,130,{bg:'rgba(7,27,39,.85)',st:C[i],lw:2});circ(x+44,y+65,24,C[i],'none',0);wt(x+44,y+73,String(i+1),24,'#0e2133',800,'center');wt(x+88,y+75,s,26,'#fff',800);if(i!==3&&i!==6)arrow(x+332,y+65,x+376,y+65,Y,3);});});
  alphaDo(seg(u,.6,.74),()=>{card(1200,380,340,130,{bg:'rgba(125,255,196,.08)',st:G,lw:2});para(1224,424,'每一環節都由老師把關',290,22,G,800,32);});
  alphaDo(seg(u,.78,.92),()=>{caseTag(60,580,'life',1);caseTag(180,580,'auto',1);caseTag(340,580,'wind',1);});
  alphaDo(seg(u,.84,.97),()=>human(60,650,1,'教學目標與成績由老師決定'));
 }},
/* 2 逆向設計（風能） */
{t:'逆向課程設計',en:'Backward course design',dur:13,
 d:'風能運維課程的例子：老師想開一門風機維護入門課。先用逆向設計，從期末要學生做到什麼開始想，再決定用什麼證據看出學生學會，最後才排活動。請 Claude 提出幾種目標寫法，老師挑選並修改。',
 s:[[0,'先定學習成果'],[.4,'再定評量證據'],[.74,'最後才排活動']],
 draw(u){
  sceneBG();
  caseTag(60,170,'wind',1);
  const S=[['1 學習成果','能說明齒輪箱例行巡檢的重點',G],['2 評量證據','巡檢紀錄表與口頭說明',Y],['3 學習活動','模型機觀察與紀錄表演練',B]];
  S.forEach((r,i)=>{const a=seg(u,.04+i*.2,.2+i*.2),y=220+i*150;alphaDo(a,()=>{card(60,y,900,126,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(90,y+50,r[0],26,r[2],800);wt(90,y+94,r[1],22,KC.text,600);if(i<2)arrow(510,y+128,510,y+148,Y,3);});});
  alphaDo(seg(u,.3,.5),()=>{winFrame(1000,220,540,330,'Claude（示意）');bub(1020,274,500,'列出三種寫法：能說明、能辨識、能完成巡檢紀錄','ai',1);});
  alphaDo(seg(u,.7,.84),()=>{card(1000,580,540,90,{bg:'rgba(255,255,255,.05)',st:Y});wt(1024,634,'目標由老師挑選與修改',22,Y,800);});
  alphaDo(seg(u,.86,.97),()=>human(1000,700,1,'課程目標由老師確認'));
 }},
/* 3 教材製作（智慧自動化） */
{t:'一份大綱，多種教材',en:'One outline, many materials',dur:13,
 d:'智慧自動化課程的例子：PLC 實習單元。老師給 Claude 一份大綱，請它產出講義草稿、投影片重點與分級練習題。從同一份大綱出發，教材前後一致。草稿要老師用現場經驗修改，並實際操作驗證。',
 s:[[0,'同一份大綱出發'],[.45,'講義、簡報、練習題'],[.78,'老師修改並實測']],
 draw(u){
  sceneBG();
  caseTag(60,170,'auto',1);
  card(60,230,360,320,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,280,'單元大綱',24,Y,800);
  ['PLC 輸入輸出','自保持迴路','計時器應用'].forEach((t,i)=>wt(90,334+i*54,'• '+tr(t),22,KC.text,600));
  const M=[['講義草稿',B],['投影片重點',G],['分級練習題',P]];
  M.forEach((r,i)=>{const a=seg(u,.2+i*.16,.34+i*.16),y=210+i*130;alphaDo(a,()=>{arrow(430,390,500,y+50,Y,3);card(510,y,420,104,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(540,y+62,r[0],26,'#fff',800);});});
  alphaDo(seg(u,.55,.7),()=>{slideBox(980,210,300,200,'自保持迴路',1,G,['啟動與停止','輸出線圈']);slideBox(1300,210,240,200,'練習 A／B／C',1,P,['基礎','進階']);});
  alphaDo(seg(u,.74,.86),()=>{card(980,440,560,100,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(1004,484,'草稿要用實機操作驗證，接線與動作以現場為準',510,20,O,700,30);});
  alphaDo(seg(u,.86,.97),()=>human(980,590,1,'教材內容由老師審定'));
 }},
/* 4 測驗與評量規準（生活） */
{t:'測驗題與評量規準',en:'Quiz items and rubrics',dur:13,
 d:'生活科技課的例子：國中小學生做一個紙橋承重作品。老師請 Claude 起草評量規準：結構、創意、紀錄三個向度，各分三個等級，並出幾題概念題。規準事先公開給學生，題目要老師檢查答案與難度。',
 s:[[0,'規準：向度與等級'],[.45,'概念題草稿'],[.78,'規準先公開，題目老師檢查']],
 draw(u){
  sceneBG();
  caseTag(60,170,'life',1);wt(130,196,'紙橋承重作品',24,'#fff',800);
  alphaDo(seg(u,.04,.2),()=>{const C=[210,250,250,250];cells(60,230,C,['向度','需努力','達成','優良'],56,true);
   [['結構','橋面不穩','能承重','承重且省料'],['創意','照範例做','有調整','提出新設計'],['紀錄','缺步驟','有步驟','有測試數據']].forEach((r,i)=>cells(60,286+i*70,C,r,70,false,[[ 'rgba(255,255,255,.05)',KC.text],['rgba(232,87,42,.1)',O],['rgba(242,194,48,.1)',Y],['rgba(125,255,196,.1)',G]]));});
  alphaDo(seg(u,.46,.62),()=>{card(1080,230,460,280,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(1106,278,'概念題草稿',23,B,800);para(1106,324,'紙折成三角形為什麼比平板更能承重？',410,21,KC.text,600,32);['A 受力分散','B 紙變厚','C 顏色不同'].forEach((t,i)=>wt(1106,430+i*28,t,19,SUBC,600));});
  alphaDo(seg(u,.76,.86),()=>{card(60,590,980,70,{bg:'rgba(255,255,255,.05)',st:Y});wt(90,636,'規準先給學生，學生知道怎樣算做好',22,Y,800);});
  alphaDo(seg(u,.86,.97),()=>human(60,690,1,'題目答案與分數由老師確認'));
 }},
/* 5 差異化與 AI 家教（生活＋自動化） */
{t:'差異化與 AI 家教',en:'Differentiation and the AI tutor',dur:14,
 d:'同一個概念，學生程度不同，說明方式也不同。生活科技課的小朋友，用日常例子說明；PLC 課的學生，用接線與梯形圖說明。Claude 的學習模式不直接給答案，而是用提問引導學生自己想，老師可以看到學生卡在哪裡。',
 s:[[0,'同一概念，不同說法'],[.45,'學習模式：用提問引導'],[.78,'老師掌握卡關處']],
 draw(u){
  sceneBG();
  alphaDo(seg(u,.02,.16),()=>{['life','auto'].forEach((k,i)=>{const x=60+i*380;card(x,170,350,170,{bg:'rgba(7,27,39,.85)',st:[B,Y][i],lw:2});caseTag(x+20,186,k,1);para(x+20,252,['電流像水流，開關像水龍頭','輸出線圈得電，接點才會動作'][i],310,20,KC.text,600,30);});});
  winFrame(60,380,760,360,'學習模式（示意）');
  alphaDo(seg(u,.4,.54),()=>bub(86,430,700,'為什麼橋面折起來更穩？先說說你的猜想','ai',1));
  alphaDo(seg(u,.55,.68),()=>bub(86,540,700,'因為力量分到不同的邊？','user',1));
  alphaDo(seg(u,.68,.8),()=>{wt(86,700,'不直接給答案，一步步追問',20,Y,700);});
  alphaDo(seg(u,.5,.64),()=>{card(870,200,670,300,{bg:'rgba(7,27,39,.85)',st:P,lw:2});wt(900,250,'給老師的觀察（示意）',23,P,800);['多數人能說出受力方向','兩位混淆接點與線圈','下週補一次接線示範'].forEach((t,i)=>wt(900,306+i*54,'• '+tr(t),21,KC.text,600));});
  alphaDo(seg(u,.84,.97),()=>human(870,540,1,'下一步教學由老師決定'));
 }},
/* 6 學術誠信與回饋（風能） */
{t:'AI 素養、誠信與回饋',en:'AI literacy, integrity, and feedback',dur:13,
 d:'風能運維課學生交了維護報告。先講好規則：哪些用途可以用 AI、要怎麼註明。老師請 Claude 對照規準，列出回饋草稿，也整理全班常見錯誤。AI 偵測工具不可靠，判斷學生是否違規，要靠對話與過程證據，由老師決定。',
 s:[[0,'先約定 AI 使用規則'],[.4,'對照規準，產出回饋草稿'],[.74,'誠信判斷由老師與學生對話']],
 draw(u){
  sceneBG();
  caseTag(60,170,'wind',1);
  card(60,220,700,230,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(90,268,'AI 使用規則（示意）',23,G,800);
  alphaDo(seg(u,.04,.2),()=>{[['可以：整理想法、檢查文法',G],['要註明：用 AI 做了什麼',Y],['不可：代寫整份報告',O]].forEach((r,i)=>{circ(100,314+i*50,8,r[1],'none',0);wt(124,322+i*50,r[0],21,KC.text,600);});});
  alphaDo(seg(u,.4,.56),()=>{card(800,220,740,230,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(830,268,'回饋草稿（示意）',23,Y,800);['優點：巡檢步驟完整','待改進：缺振動數據來源','建議：補上量測日期與儀器'].forEach((t,i)=>wt(830,318+i*46,'• '+tr(t),21,KC.text,600));});
  alphaDo(seg(u,.6,.74),()=>{bar(60,500,700,18,.7,B);wt(60,550,'全班常見錯誤：未註明數據來源',20,SUBC,600);});
  alphaDo(seg(u,.74,.86),()=>{card(800,490,740,110,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(824,534,'AI 偵測工具會誤判，不能單獨當證據',690,20,O,700,30);});
  alphaDo(seg(u,.86,.97),()=>human(60,640,1,'成績與誠信判斷由老師負責'));
 }},
/* 7 三案例 */
{t:'三門課，同一套做法',en:'Three courses, one way of working',dur:10,
 d:'不管是生活科技課、PLC 實習，還是風機維護課，做法都一樣：先定目標與證據，再做教材；規準事先公開，AI 家教引導而不代答；老師用回饋持續改進，成績與誠信判斷始終由老師負責。',
 s:[[0,'三門課，同一套做法'],[.5,'AI 輔助，老師負責']],
 draw(u){
  sceneBG();
  const R=[['life','國中小生活科技','規準公開→AI 家教引導',B],['auto','PLC 實習','大綱→教材→分級練習',Y],['wind','風機維護入門','逆向設計→回饋與誠信',G]];
  R.forEach((r,i)=>{const a=seg(u,.04+i*.14,.16+i*.14),y=180+i*160;alphaDo(a,()=>{card(60,y,1480,136,{bg:'rgba(7,27,39,.85)',st:r[3],lw:2});caseTag(84,y+18,r[0],1);wt(90,y+84,r[1],28,'#fff',800);wt(900,y+84,r[2],24,r[3],700);});});
  alphaDo(seg(u,.55,.72),()=>{card(60,680,1480,70,{bg:'rgba(255,255,255,.05)',st:Y});wt(90,726,'先定目標、規準公開、引導不代答、老師把關',24,Y,800);});
  alphaDo(seg(u,.78,.94),()=>human(60,780,1,'教學判斷永遠由老師做出'));
 }}
]};
