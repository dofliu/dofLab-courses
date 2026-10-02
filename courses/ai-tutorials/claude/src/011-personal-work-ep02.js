// KITS: claude
/* 011-personal-work-ep02 — 會議全流程
   Claude AI 應用動畫館｜個人工作 第 2 集
   依 support.claude.com（Google Calendar 連接器、Microsoft 365 連接器）查證，資訊截至 2026-10 */

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

const EP={no:2,slug:'personal-work',t:'會議全流程',en:'Meetings End to End',
seriesName:'個人工作',total:8,
lede:'會前排議程、會中整理筆記、把逐字稿濃縮成摘要、列出行動項目與負責人，再寫會後追蹤信：這一集用社區管委會、產線改善會議與風場晨會，示範 Claude 怎麼陪你走完一場會議。',
facts:[['30','分鐘議程','示例：開場、兩個討論、臨時動議，每項先訂好時間'],['3','段摘要','決議、風險與待確認，比逐字稿更好讀'],['4','欄行動項目','事項、負責人、期限與狀態，缺一不可'],['先同意','再錄音','錄音與逐字稿要先徵得與會者同意'],['人決定','不是 AI','決議、排班與出海與否由人確認']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。Google Calendar 與 Microsoft 365 連接器功能依 Claude 說明中心（support.claude.com）整理，資訊截至 2026-10，實際以官方最新說明為準。會議內容、OEE、停機原因、風速、浪高與限值均為虛構的示意範例，並非任何特定公司或案場資料，限值以各單位程序為準；停機、上鎖掛牌、出海排班與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* ── 1 會前：議程（圖解；生活） ── */
{t:'會前：議程',en:'Before: the agenda',dur:13,
 d:'開會前，先告訴 Claude 三件事：這場會要達成什麼、誰會參加、總共有多少時間。它能排出附時間分配的議程，把需要決定的事排在前面，並建議哪些資料請大家先讀。以社區管委會為例，三十分鐘要談停車位抽籤與活動經費，議程若沒有時間分配，常常第一題就談到超時。議程是草稿，主持人可以調整順序與時間。',
 s:[[0,'先交代目的、與會者與時間'],[.34,'Claude 排出附時間分配的議程'],[.7,'主持人調整順序，再發給大家']],
 draw(u){
  diagBG();floatParticles(10,5);
  card(60,150,520,650,{bg:'rgba(7,27,39,.78)',st:B,lw:1.5});
  caseTag(84,172,'life',1);
  wt(84,250,'你提供的資訊（示意）',21,'#fff',700);
  [['目的','決定抽籤規則與活動預算'],['與會者','管委會 7 人'],['時間','30 分鐘']].forEach((r,i)=>{const a=seg(u,.04+i*.06,.12+i*.06);
   alphaDo(a,()=>{card(84,284+i*120,470,100,{bg:'rgba(255,255,255,.06)',st:'rgba(255,255,255,.15)'});wt(104,320+i*120,r[0],17,SUBC,600);para(104,352+i*120,r[1],430,19,'#fff',700);});});
  arrow(590,450,650,450,Y,3);
  card(660,150,880,650,{bg:'rgba(7,27,39,.78)',st:Y,lw:1.5});
  wt(690,196,'Claude 排出的議程（草稿）',22,Y,700);
  const A=[['確認上次決議',5,B],['停車位抽籤規則',15,G],['活動經費',7,Y],['臨時動議',3,'#b37cff']];
  A.forEach((r,i)=>{const a=seg(u,.34+i*.08,.44+i*.08),y=236+i*84;
   alphaDo(a,()=>{circ(710,y+22,16,r[2],'none',0);wt(710,y+29,String(i+1),18,'#0e2133',800,'center');wt(742,y+30,r[0],21,'#fff',700);wt(1450,y+30,trf('{n} 分鐘',{n:r[1]}),20,r[2],700,'right',COND);});});
  alphaDo(seg(u,.62,.72),()=>{wt(690,606,'時間分配（共 30 分鐘）',17,SUBC,600);
   let x=690;A.forEach((r,i)=>{const w=r[1]/30*820*seg(u,.64,.74);box(x,624,w-3,34,r[2],'none',0);x+=w;});});
  alphaDo(seg(u,.78,.88),()=>{card(690,690,820,80,{bg:'rgba(242,194,48,.1)',st:Y,lw:1.5});para(714,726,'請 Claude 再列出：哪些資料請大家會前先讀',770,19,Y,700);});
 }},
/* ── 2 會中：紀錄重點（場景；智慧自動化） ── */
{t:'會中：紀錄重點',en:'During: capturing the key points',dur:13,
 d:'會議進行時，把零散的筆記貼給 Claude，請它整理成「決議」「待討論」「風險」三欄。以產線改善會議為例，大家講了很多，筆記只有片段：換模後要加做首件確認、停機原因要不要細分、備品交期不明。Claude 能依你給的內容分欄，並標出看不出結論的地方。示例中的數字為示意，紀錄內容由主持人核對。',
 s:[[0,'把零散的筆記貼給 Claude'],[.34,'整理成決議、待討論與風險三欄'],[.7,'紀錄由主持人核對，才算定稿']],
 draw(u){
  sceneBG();
  winFrame(60,150,880,650,'Claude');
  caseTag(84,206,'auto',1);
  bub(190,250,730,'筆記：3 號線換模後加做首件確認；停機原因要不要再細分？M3 備品交期還不確定。幫我整理成決議、待討論、風險','user',seg(u,.02,.1));
  bub(90,420,780,'整理好了：一項決議、一項待討論、一項風險。備品交期沒有日期，我標成待確認，沒有自行推測。','ai',seg(u,.14,.24),Y);
  alphaDo(seg(u,.3,.38),()=>{['決議','待討論','風險'].forEach((t,i)=>tag(94+i*130,640,t,{size:17,bg:[G,B,O][i]}));});
  card(980,150,560,650,{bg:'rgba(7,27,39,.8)'});
  wt(1010,196,'會議紀錄（示意）',22,Y,700);
  const R=[['決議',G,'3 號線換模後，加做首件確認'],['待討論',B,'停機原因是否再細分'],['風險',O,'M3 備品交期不明，待確認']];
  R.forEach((r,i)=>{const a=seg(u,.36+i*.1,.46+i*.1),y=226+i*140;
   alphaDo(a,()=>{tag(1010,y,r[0],{size:18,bg:r[1]});card(1010,y+44,500,78,{bg:'rgba(255,255,255,.05)',st:r[1]});para(1030,y+80,r[2],460,19,KC.text,500);});});
  alphaDo(seg(u,.7,.8),()=>{wt(1010,672,'OEE（示意）',17,SUBC,600);wt(1510,672,trf('{a}% → 目標 {b}%',{a:68,b:75}),19,Y,700,'right',COND);hbar(1010,688,500,.68,G);});
  human(1010,722,seg(u,.82,.92),'主持人核對後才定稿');
 }},
/* ── 3 逐字稿→摘要（圖解；風能運維） ── */
{t:'逐字稿轉成摘要',en:'From transcript to summary',dur:14,
 d:'會議有逐字稿時，貼給 Claude，請它濃縮成摘要。以風場晨會為例，對話裡有人提問、有人報預報、有人說出限值，最後排出當天任務。Claude 能抓出決議與依據，也能把沒講清楚的地方列為待確認。提醒兩件事：逐字稿本身可能有誤，數字與人名要回頭核對錄音；出海與否，由值班長依程序決定，不是由摘要決定。',
 s:[[0,'貼上晨會逐字稿，請 Claude 濃縮'],[.36,'抓出決議、依據與待確認'],[.7,'數字回頭核對；出海與否由值班長決定']],
 draw(u){
  diagBG();floatParticles(8,9);
  card(60,150,700,650,{bg:'rgba(7,27,39,.78)',st:G,lw:1.5});
  caseTag(84,172,'wind',1);
  wt(84,250,'晨會逐字稿（示意）',21,'#fff',700);
  const T=[['值班長','今天 T05 要不要出海？'],['氣象','下午風速升到 12 m/s，浪高 1.8 公尺。'],['領班','限值是浪高 1.5 公尺，上午先出。'],['值班長','T05 排上午，T08 改明天。']];
  T.forEach((r,i)=>{const a=seg(u,.04+i*.07,.12+i*.07),y=276+i*108;
   alphaDo(a,()=>{card(84,y,652,92,{bg:'rgba(255,255,255,.05)',st:'rgba(255,255,255,.15)'});tag(100,y+14,r[0],{size:15,bg:B});para(100,y+66,r[1],620,18,KC.text,500);});});
  alphaDo(seg(u,.26,.34),()=>arrow(776,450,840,450,Y,3));
  card(850,150,690,650,{bg:'rgba(7,27,39,.78)',st:Y,lw:1.5});
  wt(880,196,'Claude 的摘要',22,Y,700);
  const S=[['決議',G,'T05 排上午出海，T08 改隔日'],['依據',B,'示意限值：浪高 1.5 公尺（以程序為準）'],['待確認',O,'下午預報更新時間、備援窗口']];
  S.forEach((r,i)=>{const a=seg(u,.36+i*.1,.46+i*.1),y=226+i*116;
   alphaDo(a,()=>{tag(880,y,r[0],{size:18,bg:r[1]});card(880,y+42,630,62,{bg:'rgba(255,255,255,.05)',st:r[1]});para(900,y+82,r[2],590,19,KC.text,500);});});
  alphaDo(seg(u,.68,.78),()=>{card(880,584,630,70,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(900,616,'逐字稿可能有誤：數字與人名回頭核對錄音',590,18,O,700);});
  human(880,692,seg(u,.84,.94),'出海與否，由值班長依程序決定');
 }},
/* ── 4 行動項目與負責人（圖解；智慧自動化） ── */
{t:'行動項目與負責人',en:'Action items and owners',dur:13,
 d:'會議的價值在行動。請 Claude 從紀錄抽出行動項目，整理成事項、負責人、期限、狀態四欄。若紀錄沒有說誰負責，它應該標成「待確認」，而不是隨意指派。右邊以產線的停機原因為例，示意怎麼把資料變成優先順序：換模與待料占大半，所以先從換模首件確認開始。負責人與期限，仍由與會者在會中說定。',
 s:[[0,'從紀錄抽出事項、負責人、期限'],[.38,'沒說清楚的，標成待確認'],[.7,'停機原因示意，決定優先順序']],
 draw(u){
  diagBG();
  card(60,150,860,650,{bg:'rgba(7,27,39,.75)'});
  caseTag(84,172,'auto',1);
  wt(84,250,'行動項目（示意）',21,'#fff',700);
  ['事項','負責人','期限'].forEach((h,i)=>wt([100,500,700][i],290,h,16,SUBC,700));
  ln([84,302,896,302],KC.border,1);
  const R=[['整理停機原因分類表','生產技術','週五',1],['確認 M3 備品交期','採購','下週一',1],['換模首件確認試行','3 號線班長','下週三',1],['更新 OEE 看板','待確認','待確認',0]];
  R.forEach((r,i)=>{const a=seg(u,.06+i*.08,.14+i*.08),y=320+i*92;
   alphaDo(a,()=>{card(84,y,812,80,{bg:r[3]?'rgba(255,255,255,.05)':'rgba(232,87,42,.1)',st:r[3]?'rgba(255,255,255,.15)':O,lw:r[3]?1:2});
    const L=wrapL(r[0],340,19,600);L.forEach((s,k)=>wt(100,y+(L.length>1?32:46)+k*24,s,19,'#fff',600));
    wt(500,y+46,r[1],19,r[3]?G:O,700);wt(700,y+46,r[2],19,r[3]?B:O,700);});});
  alphaDo(seg(u,.46,.56),()=>para(100,712,'沒有指定負責人的項目，標「待確認」，不由 Claude 代為指派',780,18,O,700));
  card(960,150,580,650,{bg:'rgba(7,27,39,.75)',st:Y,lw:1.5});
  wt(990,196,'停機原因（示意，分鐘／班）',20,Y,700);
  const D=[['換模',42,Y],['待料',30,B],['小停機',18,G],['故障',10,O]];
  D.forEach((d,i)=>{const a=seg(u,.6+i*.07,.72+i*.07),y=250+i*104;
   wt(990,y+30,d[0],19,'#fff',700);box(1190,y+8,310*d[1]/42*ease(a),36,d[2],'none',0);
   wt(1190+310*d[1]/42*ease(a)-8,y+34,String(d[1]),20,'#0e2133',800,'right',COND);});
  human(990,690,seg(u,.84,.94),'負責人與期限由與會者說定');
 }},
/* ── 5 會後追蹤信（圖解；生活＋風能運維） ── */
{t:'會後追蹤信',en:'The follow-up message',dur:13,
 d:'會後二十四小時內寄出追蹤信，行動才不會被忘記。請 Claude 依紀錄草擬：決議放最前面，接著列出待辦、誰負責、何時到，最後是下次會議時間。同樣的結構，社區管委會可以用，風場晨會也可以用，換成當天的出海與工單分派。寄出前檢查人名、日期與數字，信由你或主持人寄出。',
 s:[[0,'決議放最前面，再列待辦與期限'],[.36,'同一個結構，社區與風場都適用'],[.7,'寄出前核對人名與日期']],
 draw(u){
  diagBG();
  winFrame(60,150,880,650,'草稿預覽（示意）');
  caseTag(84,224,'life',1);
  alphaDo(seg(u,.04,.12),()=>{wt(90,276,'主旨：10/8 管委會會議紀錄與待辦',20,'#fff',700);ln([90,298,910,298],KC.border,1);});
  const B1=[['決議','停車位改用抽籤，活動預算上限 8,000 元',G],['待辦','王小姐 10/15 前公告抽籤規則',Y],['下次','11/5 晚上 7:30',B]];
  B1.forEach((r,i)=>{const a=seg(u,.14+i*.08,.24+i*.08),y=330+i*100;
   alphaDo(a,()=>{tag(90,y,r[0],{size:17,bg:r[2]});para(90,y+56,r[1],800,19,KC.text,500);});});
  human(90,690,seg(u,.74,.84),'寄出前核對人名與日期');
  card(980,150,560,650,{bg:'rgba(7,27,39,.78)',st:G,lw:1.5});
  caseTag(1004,172,'wind',seg(u,.38,.46));
  wt(1004,250,'風場晨會版（示意）',21,'#fff',700);
  alphaDo(seg(u,.4,.5),()=>{wt(1004,296,'主旨：今日出海與工單分派',19,Y,700);});
  const W=[['決議','T05 上午出海，T08 改隔日',G],['工單','T05 葉片巡檢：領班負責',Y],['注意','出海與工單由值班長確認',O]];
  W.forEach((r,i)=>{const a=seg(u,.5+i*.08,.6+i*.08),y=330+i*150;
   alphaDo(a,()=>{tag(1004,y,r[0],{size:17,bg:r[2]});card(1004,y+44,510,84,{bg:'rgba(255,255,255,.05)',st:r[2]});para(1022,y+78,r[1],470,18,KC.text,500);});});
 }},
/* ── 6 連接日曆與會議資料（圖解；三類情境＋隱私） ── */
{t:'連接日曆與隱私提醒',en:'Calendars, connectors and privacy',dur:13,
 d:'依 Claude 說明中心，Google Calendar 連接器可以查看行程、找出與會者的共同空檔，並建立或更新活動；Microsoft 365 連接器能讀 Outlook 與 Teams 的行事曆與會議資訊，需要企業的 Microsoft Entra 租用戶，個人 Outlook.com 帳號不能連接。每個動作預設都先徵求你的核准。錄音與逐字稿要先徵得與會者同意，機密會議的內容依單位規範處理。',
 s:[[0,'連接日曆，查行程、找共同空檔'],[.36,'每個動作預設先徵求核准'],[.7,'錄音先徵得同意，機密內容依規範']],
 draw(u){
  diagBG();
  card(60,150,720,420,{bg:'rgba(7,27,39,.78)',st:B,lw:1.5});
  wt(90,196,'Google Calendar 連接器',22,B,800);
  ['查看行程與共享日曆','找出與會者的共同空檔','建立或更新會議活動'].forEach((s,i)=>{const a=seg(u,.04+i*.07,.12+i*.07);
   alphaDo(a,()=>{check(110,250+i*70,true,B);wt(140,258+i*70,s,20,KC.text,600);});});
  alphaDo(seg(u,.28,.36),()=>{caseTag(90,470,'life',1);caseTag(210,470,'auto',1);caseTag(440,470,'wind',1);});
  card(820,150,720,420,{bg:'rgba(7,27,39,.78)',st:Y,lw:1.5});
  wt(850,196,'Microsoft 365 連接器',22,Y,800);
  ['Outlook 與 Teams 行事曆','會議資訊與 Teams 聊天','需企業 Entra 租用戶，個人帳號不可'].forEach((s,i)=>{const a=seg(u,.14+i*.07,.22+i*.07);
   alphaDo(a,()=>{check(870,250+i*70,i<2,i<2?Y:O);wt(900,258+i*70,s,20,KC.text,600);});});
  alphaDo(seg(u,.4,.5),()=>{card(60,600,720,180,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,646,'Claude 想執行：建立會議活動',20,O,700);para(90,684,'11/5 19:30，邀請管委會成員。',660,18,KC.text,500);
   ['允許','拒絕'].forEach((t,i)=>tag(90+i*140,722,t,{size:18,bg:i===0?G:'rgba(255,255,255,.2)',fg:i===0?'#0e2133':'#fff'}));});
  alphaDo(seg(u,.66,.78),()=>{card(820,600,720,180,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(850,646,'隱私提醒',20,G,700);
   para(850,684,'錄音與逐字稿先徵得與會者同意；機密會議的內容依單位規範處理。',660,18,KC.text,600);});
 }}
]};
