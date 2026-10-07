// KITS: claude
/* 015-personal-work-ep06 — 連接器
   Claude AI 應用動畫館｜個人工作 第 6 集
   依 claude.com/docs/connectors（Get started with connectors）與 support.claude.com（Use Google Workspace connectors）查證，資訊截至 2026-10 */

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
const EP={no:6,slug:'personal-work',t:'連接器：讓 Claude 讀到你的資料',en:'Connectors',
seriesName:'個人工作',total:8,
lede:'連接器讓 Claude 在你授權後，去雲端硬碟、日曆等服務找資料或代辦。這一集用家庭文件、設備手冊知識庫與出海天候窗口，示範怎麼連接、怎麼控制權限，以及跨工具彙整後仍由你確認。',
facts:[['連接','授權後才讀','在 Customize > Connectors 連接並登入該服務'],['每次','可開關','對話的 + 選單可決定這場對話用不用'],['3 種','工具權限','Always allow、Needs approval、Blocked'],['寫入','先經你同意','寄信、分享檔案等動作預設需核准'],['人確認','再行動','設備動作與排程決定由人員確認']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。連接器流程與 Google Workspace 連接器依 claude.com/docs/connectors 與 Claude 說明中心（support.claude.com）整理，資訊截至 2026-10，連接器清單、方案限制與權限選項以官方最新說明為準。家庭文件、設備手冊、工單與天候窗口數字均為虛構的示意或典型範例，並非任何特定公司、機關或案場資料；AI 提供分析與建議，停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 概念（圖解） */
{t:'連接器是什麼',en:'What is a connector?',dur:14,
 d:'平常 Claude 只看得到你貼進對話的內容。連接器是 Claude 與外部服務之間的一座橋：你登入並授權後，Claude 才能到雲端硬碟、日曆等地方查資料，也能在你同意下代辦事情。每個連接器各接一個服務，並由你決定要不要開。',
 s:[[0,'沒有連接器：只看得到貼進來的內容'],[.36,'授權後搭起橋樑'],[.7,'每個服務各一座，你決定開不開']],
 draw(u){
  sceneBG();
  card(60,260,360,300,{bg:'rgba(7,27,39,.82)',st:Y,lw:2});wt(240,320,'Claude',30,Y,800,'center');
  alphaDo(seg(u,.02,.1),()=>{box(130,360,220,70,'rgba(255,255,255,.08)',KC.border,1.5);wt(240,404,'你貼進來的文字',18,KC.text,600,'center');});
  alphaDo(seg(u,.02,.1),()=>wt(240,500,'只看得到對話內容',18,SUBC,600,'center'));
  const S=[['雲端硬碟',B,'文件、試算表、照片'],['日曆',Y,'行程與空檔'],['知識庫',G,'手冊、維修紀錄']];
  S.forEach((r,i)=>{const y=190+i*190,a=seg(u,.3+i*.1,.42+i*.1);
   alphaDo(a,()=>{
    ln([420,410,700,y+60],r[1],4);card(1020,y,520,150,{bg:'rgba(7,27,39,.8)',st:r[1],lw:2});wt(1050,y+60,r[0],26,'#fff',800);wt(1050,y+104,r[2],19,SUBC,600);
    box(700,y+30,120,60,r[1],'none',0);wt(760,y+68,'連接',20,'#0e2133',800,'center');ln([820,y+60,1020,y+60],r[1],4);});});
  alphaDo(seg(u,.72,.82),()=>{tag(60,640,'你登入並授權',{size:18,bg:G});tag(60,690,'每場對話可開關',{size:18,bg:B});});
  alphaDo(seg(u,.84,.94),()=>human(60,750,1,'要不要連、由你決定'));
 }},
/* 2 雲端硬碟（生活） */
{t:'在雲端硬碟找文件',en:'Finding files in Drive',dur:14,
 d:'連接雲端硬碟後，直接用日常說法問：「找去年報稅用的扶養親屬資料」。Claude 會搜尋、讀取符合的文件並整理重點，並說明它參考了哪些檔案。連接器預設只在你提問時才去讀資料；找到結果後，請自己點開原檔核對。',
 s:[[0,'用日常說法提問'],[.36,'Claude 搜尋並讀取文件'],[.7,'列出來源，原檔自己核對']],
 draw(u){
  sceneBG();
  winFrame(60,150,760,650,'Claude');
  caseTag(84,206,'life',1);
  bub(110,250,690,'幫我在雲端硬碟找去年家裡的保險單，整理到期日。','user',seg(u,.02,.1));
  alphaDo(seg(u,.2,.3),()=>{card(110,430,690,64,{bg:'rgba(88,184,208,.12)',st:B,lw:1.5});wt(140,470,'正在搜尋雲端硬碟…',20,B,700);});
  card(840,150,700,650,{bg:'rgba(7,27,39,.8)',st:B,lw:1.5});wt(866,196,'雲端硬碟（示意）',22,B,700);
  [['汽車保險單 2025.pdf','到期 3 月',Y],['住院醫療險.pdf','到期 8 月',G],['住宅火險.pdf','到期 11 月',O]].forEach((r,i)=>{const a=seg(u,.34+i*.1,.46+i*.1),y=226+i*110;
   alphaDo(a,()=>{card(866,y,650,92,{bg:'rgba(255,255,255,.05)',st:r[2]});wt(896,y+40,r[0],21,'#fff',700);wt(896,y+72,r[1],18,r[2],700);});});
  alphaDo(seg(u,.7,.8),()=>{card(110,540,690,64,{bg:'rgba(255,255,255,.05)',st:Y});wt(140,580,'來源：以上 3 個檔案',19,Y,700);});
  alphaDo(seg(u,.84,.94),()=>human(866,600,1,'到期日回原檔核對'));
 }},
/* 3 日曆（風能運維＋生活） */
{t:'在日曆找空檔',en:'Finding time in Calendar',dur:14,
 d:'日曆連接器可以查看行程、找出空檔，也能在你同意下建立或更新活動。風場排出海維修時，請 Claude 比對團隊日曆與天候預報，找出下週可行的天候窗口；生活裡同樣能用它找一個大家都有空的聚餐時間。窗口只是建議，是否出海由人員依現場天候與安全規定決定。',
 s:[[0,'連接日曆，查行程與空檔'],[.36,'比對天候窗口與團隊排程'],[.7,'窗口是建議，由人決定']],
 draw(u){
  diagBG();floatParticles(8,9);
  caseTag(60,150,'wind',1);caseTag(170,150,'life',1);
  card(60,196,860,600,{bg:'rgba(7,27,39,.8)',st:Y,lw:2});wt(90,244,'下週日曆（示意）',22,Y,700);
  const D=['一','二','三','四','五'];
  D.forEach((d,i)=>{wt(190+i*150,290,'週'+d,18,SUBC,700,'center');});
  const W=[0,0,1,1,0];
  alphaDo(seg(u,.02,.1),()=>{[[0,'會議',B],[1,'備品盤點',B],[4,'教育訓練',B]].forEach(r=>{box(120+r[0]*150,320,140,70,'rgba(88,184,208,.2)',r[2],1.5);wt(190+r[0]*150,362,r[1],17,r[2],700,'center');});});
  alphaDo(seg(u,.3,.5),()=>{[2,3].forEach(i=>{box(120+i*150,410,140,260,'rgba(125,255,196,.18)',G,2);});wt(490,500,'可出海',22,G,800,'center');wt(640,500,'可出海',22,G,800,'center');wt(565,690,'風速、浪高符合條件（示意）',16,SUBC,600,'center');});
  alphaDo(seg(u,.36,.5),()=>{[0,1,4].forEach(i=>{box(120+i*150,410,140,260,'rgba(232,87,42,.14)',O,1.5);wt(190+i*150,540,i===4?'天候不佳':'東北季風',17,O,700,'center');});});
  alphaDo(seg(u,.52,.62),()=>wt(90,730,'週三、週四為較佳窗口',20,G,700));
  card(960,196,580,300,{bg:'rgba(7,27,39,.82)',st:B,lw:2});wt(990,244,'同樣的做法，生活也能用',20,B,700);
  alphaDo(seg(u,.56,.68),()=>{para(990,290,'找出週末大家都有空的聚餐時間',520,21,KC.text,600,30);[['小美','六晚',G],['阿志','六晚',G],['媽媽','日午',Y]].forEach((r,i)=>{tag(990+i*165,390,r[0]+' '+r[1],{size:17,bg:r[2]});});});
  alphaDo(seg(u,.76,.86),()=>{card(960,530,580,100,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(990,576,'建立或更新活動前，Claude 會請你確認',520,20,O,700,28);});
  alphaDo(seg(u,.84,.94),()=>human(960,660,1,'是否出海由人員決定'));
 }},
/* 4 授權與權限（圖解） */
{t:'授權與權限',en:'Authorization and permissions',dur:14,
 d:'連接時，你會被帶到該服務的登入頁，看過它要求的存取範圍再同意。之後每個對話都有開關決定 Claude 能不能用；在連接器頁面還可以把每組工具設成「一律允許」、「需要核准」或「封鎖」。想收回權限，隨時可以中斷連接。Team 與 Enterprise 方案則由組織擁有者先決定開放哪些連接器。',
 s:[[0,'登入服務並看清楚存取範圍'],[.36,'每組工具三種權限'],[.7,'隨時中斷，團隊由擁有者管理']],
 draw(u){
  sceneBG();
  const st=[['1','登入該服務',B],['2','看範圍並同意',Y],['3','對話內開關',G]];
  st.forEach((r,i)=>{const a=seg(u,.02+i*.08,.12+i*.08),x=60+i*500;
   alphaDo(a,()=>{card(x,170,470,150,{bg:'rgba(7,27,39,.8)',st:r[2],lw:2});circ(x+44,245,24,r[2],'none',0);wt(x+44,253,r[0],24,'#0e2133',800,'center');wt(x+88,254,r[1],25,'#fff',700);if(i<2)arrow(x+475,245,x+495,245,r[2],3);});});
  alphaDo(seg(u,.34,.44),()=>wt(60,390,'每組工具可設定',22,Y,700));
  [['Always allow','一律允許',G,'唯讀查詢等低風險'],['Needs approval','需要核准',Y,'每次動作先問你'],['Blocked','封鎖',O,'完全不讓 Claude 用']].forEach((r,i)=>{const a=seg(u,.38+i*.08,.5+i*.08),x=60+i*500;
   alphaDo(a,()=>{card(x,420,470,230,{bg:'rgba(7,27,39,.82)',st:r[2],lw:2});wt(x+28,476,r[0],26,r[2],800);wt(x+28,520,r[1],21,'#fff',700);wt(x+28,572,r[3],19,SUBC,600);toggle(x+380,590,i===0?1:(i===1?.6:0));});});
  alphaDo(seg(u,.7,.8),()=>{tag(60,690,'隨時 Disconnect',{size:18,bg:B});tag(300,690,'團隊：擁有者先開放',{size:18,bg:'#b37cff'});});
  alphaDo(seg(u,.84,.94),()=>human(1000,680,1,'寫入類動作由你核准'));
 }},
/* 5 知識庫（智慧自動化） */
{t:'查設備手冊與維修紀錄',en:'Manuals and maintenance records',dur:14,
 d:'產線設備停機時，把手冊與維修紀錄所在的知識庫接給 Claude，再問：「包裝機出現伺服過載警報，手冊怎麼說？上次類似狀況怎麼處理？」Claude 會附上手冊章節與過去工單作為依據，讓你快速找到可能原因。是否停機、上鎖掛牌或下指令給 PLC，都由現場人員依 SOP 確認。',
 s:[[0,'連接知識庫並提問'],[.36,'手冊章節＋過去工單'],[.7,'處置由人員依 SOP 確認']],
 draw(u){
  diagBG();floatParticles(8,4);
  caseTag(60,150,'auto',1);
  winFrame(60,196,760,600,'Claude');
  bub(90,246,700,'包裝機伺服過載警報，手冊怎麼說？上次類似狀況怎麼處理？','user',seg(u,.02,.1));
  alphaDo(seg(u,.46,.58),()=>{card(90,470,700,170,{bg:KC.aiBub,st:Y,lw:1.5});wt(116,510,'Claude',15,Y,700);para(116,544,'可能原因：皮帶張力異常或負載卡滯。建議先檢查機械傳動，再看參數。',650,19,KC.text,500,28);});
  card(860,196,680,600,{bg:'rgba(7,27,39,.8)',st:G,lw:1.5});wt(886,244,'知識庫（示意）',22,G,700);
  alphaDo(seg(u,.2,.32),()=>{card(886,270,630,100,{bg:'rgba(255,255,255,.05)',st:B});wt(910,312,'設備手冊 第 7 章',20,B,700);wt(910,348,'伺服過載警報排除',18,SUBC,600);});
  alphaDo(seg(u,.3,.42),()=>{card(886,390,630,100,{bg:'rgba(255,255,255,.05)',st:Y});wt(910,432,'工單 WO-0412（示意）',20,Y,700);wt(910,468,'更換皮帶並重新校正',18,SUBC,600);});
  alphaDo(seg(u,.5,.6),()=>{tag(886,520,'引用手冊章節',{size:17,bg:B});tag(1086,520,'引用過去工單',{size:17,bg:Y});});
  alphaDo(seg(u,.8,.92),()=>human(886,640,1,'停機、上鎖掛牌由人員確認'));
 }},
/* 6 跨工具彙整 */
{t:'跨工具彙整',en:'Pulling it together',dur:15,
 d:'連接多個工具後，Claude 可以一次把資料彙整起來。生活例子：從雲端硬碟與日曆整理家庭年度行事。智慧自動化：把手冊與工單整理成交接摘要。風能運維：把歷史工單與天候窗口排成維修建議。彙整的結果仍然只是草稿，涉及設備與排程的決定由人員確認，也要留意不要連接不需要的資料。',
 s:[[0,'三種情境，各接不同工具'],[.4,'彙整成草稿'],[.74,'只連需要的，決定由人下']],
 draw(u){
  diagBG();
  const H=[['life','生活','雲端硬碟＋日曆','整理家庭年度到期事項','提醒與日期回原檔核對',B],['auto','智慧自動化','知識庫＋工單','整理設備交接摘要','處置由人員依 SOP 確認',Y],['wind','風能運維','歷史工單＋日曆','排出維修與出海建議','是否出海由人員決定',G]];
  H.forEach((r,i)=>{const a=seg(u,.04+i*.14,.16+i*.14),x=60+i*500;
   alphaDo(a,()=>{card(x,170,480,470,{bg:'rgba(7,27,39,.78)',st:r[5],lw:2});caseTag(x+24,192,r[0],1);
    wt(x+24,270,r[2],23,'#fff',700);ln([x+24,300,x+456,300],KC.border,1);
    wt(x+24,344,'彙整成果',16,SUBC,700);para(x+24,380,r[3],432,21,KC.text,700,30);
    ln([x+24,450,x+456,450],KC.border,1);wt(x+24,490,'把關重點',16,SUBC,700);para(x+24,526,r[4],432,20,r[5],700,29);});});
  alphaDo(seg(u,.62,.72),()=>{card(60,670,1480,64,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(800,710,'只連接需要的服務，並避免連接高度敏感的資料',20,O,700,'center');});
  alphaDo(seg(u,.82,.92),()=>human(60,760,1,'結果當草稿，人確認後再行動'));
 }}
]};
