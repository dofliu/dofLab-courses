// KITS: claude
/* 010-personal-work-ep01 — 郵件與訊息草擬
   Claude AI 應用動畫館｜個人工作 第 1 集
   依 support.claude.com（Google Workspace 連接器、Microsoft 365 連接器）查證，資訊截至 2026-10 */

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

const EP={no:1,slug:'personal-work',t:'郵件與訊息草擬',en:'Email & Messages',
seriesName:'個人工作',total:8,
lede:'從分類收件匣、選定回覆策略、調整語氣，到連接 Gmail 或 Outlook 與寄出前檢查：這一集用家長信、設備廠商回覆與給業主的停機通知，示範怎麼請 Claude 草擬郵件與訊息。',
facts:[['3','種回覆策略','同一封信可以簡短確認、詳細說明或婉拒改期'],['3','項指示','收件人、目的與語氣，是草擬前最該交代的資訊'],['先預覽','再寄出','連接器預設在寄出前徵求你的核准'],['5','項檢查','收件人、事實、附件、敏感資料與語氣'],['草稿','不是定稿','內容與寄出的責任仍在你']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。Gmail 與 Microsoft 365（Outlook）連接器功能依 Claude 說明中心（support.claude.com）整理，資訊截至 2026-10，實際以官方最新說明為準。郵件內容、設備警報與風速、停機時段均為虛構的示意範例，並非任何特定公司或案場資料；停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* ── 1 收件匣分類（圖解；生活＋智慧自動化） ── */
{t:'收件匣分類',en:'Sorting the inbox',dur:12,
 d:'一早打開收件匣，信件混在一起。把信件內容貼給 Claude，請它分成「今天要回覆」「要轉成待辦」「只需知悉」三堆，並說明理由。生活裡，家長來信與朋友邀約需要回覆；工作上，設備廠商的技術回覆可以請 Claude 整理成待辦清單，標出負責人與期限，但要不要照廠商建議施作，由工程師判斷。',
 s:[[0,'把收件匣的信貼給 Claude，請它分類'],[.32,'分成要回覆、要轉待辦、只需知悉'],[.62,'廠商的技術回覆，整理成有期限的待辦']],
 draw(u){
  diagBG();floatParticles(10,5);
  card(60,150,520,650,{bg:'rgba(7,27,39,.75)'});
  wt(90,196,'收件匣（示意）',22,Y,700);
  const M=[['家長','請問明天的繳費截止嗎？','a'],['朋友','週六聚餐你來嗎？','a'],['設備廠商','M3 馬達過載：建議檢查軸承','t'],['總務','停車證更新公告','i'],['訂閱電子報','本週精選','i']];
  M.forEach((m,i)=>{const a=seg(u,.02+i*.03,.08+i*.03),y=226+i*110;
   alphaDo(a,()=>{card(90,y,460,94,{bg:'rgba(255,255,255,.05)',st:'rgba(255,255,255,.18)'});circ(130,y+47,22,B);wt(130,y+55,tr(m[0])[0],20,'#0e2133',800,'center');wt(170,y+40,m[0],19,'#fff',700);
    const L=wrapL(m[1],350,16,500);L.slice(0,2).forEach((s,k)=>wt(170,y+66+k*20,s,16,SUBC,500));});});
  arrow(590,480,650,480,Y,3);
  const cols=[['今天要回覆',B,'家長、朋友的信'],['轉成待辦',Y,'廠商的技術回覆'],['只需知悉',SUBC,'公告與電子報']];
  cols.forEach((c,i)=>{const a=seg(u,.3+i*.06,.4+i*.06),cy=150+i*140;
   alphaDo(a,()=>{card(660,cy,450,124,{bg:'rgba(7,27,39,.8)',st:c[1],lw:2});wt(686,cy+44,c[0],22,c[1],800);para(686,cy+80,c[2],400,18,SUBC,500);});});
  caseTag(660,580,'life',seg(u,.3,.36));caseTag(780,580,'auto',seg(u,.4,.46));
  alphaDo(seg(u,.5,.58),()=>{card(1150,150,390,650,{bg:'rgba(7,27,39,.8)',st:Y,lw:1.5});
   wt(1176,196,'待辦清單（示意）',21,'#fff',700);
   [['檢查 M3 軸承與負載','工程師','本週五'],['向廠商確認備品交期','採購','下週一'],['更新點檢表','班長','下週三']].forEach((r,i)=>{const a=seg(u,.6+i*.08,.68+i*.08);
    alphaDo(a,()=>{check(1186,262+i*118,false,G);const L=wrapL(r[0],290,19,600);L.forEach((s,k)=>wt(1214,268+i*118+k*24,s,19,'#fff',600));tag(1214,300+i*118+(L.length-1)*24,tr(r[1])+'・'+tr(r[2]),{size:15,bg:B});});});
   human(1160,716,seg(u,.84,.92),'要不要施作，由工程師決定');
  });
 }},
/* ── 2 同一封信的三種回覆策略（圖解；生活） ── */
{t:'同一封信的三種回覆策略',en:'Three ways to answer one email',dur:13,
 d:'同一封信，可以有不同的回法。以家長來信「孩子想請假一天」為例：簡短確認，一兩句話說好；詳細說明，補上補課安排與注意事項；婉拒或改期，客氣說明原因並提出替代方案。下指示時先說明你想採哪一種，再給重點，Claude 就能寫出方向一致的草稿。你也可以請它三種都寫，比較後再挑。',
 s:[[0,'先看來信，想清楚要回什麼'],[.26,'簡短確認、詳細說明、婉拒改期，三種方向'],[.7,'下指示時說明方向，或三種都請它寫']],
 draw(u){
  diagBG();
  card(60,150,1480,150,{bg:'rgba(7,27,39,.8)',st:B,lw:1.5});
  caseTag(84,172,'life',1);
  wt(84,248,'來信：老師您好，孩子下週三想請假一天，可以嗎？',22,'#fff',700);
  alphaDo(seg(u,.04,.12),()=>wt(84,282,'（家長來信・示意）',16,SUBC,500));
  const C=[['簡短確認',G,'好的，請假沒問題，也請孩子補上當天作業。','一兩句話，快速回覆'],['詳細說明',Y,'可以請假。當天的課堂內容與作業我會整理給孩子，並請他週四前補交。','補上安排與注意事項'],['婉拒或改期',O,'當天有小考，建議改到週四請假；若確有必要，我們再另約補考時間。','客氣說明並提供替代方案']];
  C.forEach((c,i)=>{const a=seg(u,.26+i*.14,.38+i*.14),x=60+i*500;
   alphaDo(clamp(a*3,0,1),()=>{
    const yy=330+(1-ease(a))*30;
    card(x,yy,480,380,{bg:'rgba(7,27,39,.8)',st:c[1],lw:2});
    tag(x+24,yy+22,c[0],{size:20,bg:c[1]});
    rrp(x+24,yy+84,432,170,12);ctx.fillStyle=KC.aiBub;ctx.fill();
    para(x+42,yy+122,c[2],396,19,KC.text,500);
    para(x+24,yy+290,c[3],432,18,c[1],700);
   });});
  alphaDo(seg(u,.72,.82),()=>{card(300,732,1000,52,{bg:'rgba(242,194,48,.12)',st:Y,lw:1.5});wt(800,767,'指示範例：「用婉拒改期的方向回信，語氣客氣，附上替代時段」',19,Y,700,'center');});
 }},
/* ── 3 語氣調整（場景；生活） ── */
{t:'語氣調整',en:'Adjusting the tone',dur:12,
 d:'同樣的內容，對老師、朋友和客戶，用字要不一樣。草稿出來後，不必重寫，直接下指令：語氣更正式、更親切、縮短一點、加上感謝。Claude 會保留原意，只調整措辭與長度。如果你有慣用的寫法，也可以貼一封自己寫過的信，請它參考你的口吻。',
 s:[[0,'同一份內容，對不同的人用字不同'],[.34,'直接下指令微調：更正式、更親切、縮短'],[.7,'貼上自己寫過的信，讓它學你的口吻']],
 draw(u){
  sceneBG();
  winFrame(60,150,900,650,'Claude');
  bub(300,214,640,'幫我回朋友：週六聚餐我可以，但要晚一點到','user',seg(u,.02,.1));
  bub(90,320,780,'好呀！週六聚餐我會去，不過可能晚半小時到，你們先點餐，不用等我。','ai',seg(u,.12,.22),Y);
  alphaDo(seg(u,.3,.38),()=>{['更正式','更親切','縮短一點','加上感謝'].forEach((t,i)=>tag(94+i*150,540,t,{size:17,bg:i===0?Y:B}));});
  bub(300,590,640,'改成更正式，要寄給客戶','user',seg(u,.4,.48));
  card(990,150,550,650,{bg:'rgba(7,27,39,.8)'});
  wt(1020,196,'同一件事，不同的口吻',22,Y,700);
  const V=[['朋友','週六我會去，晚半小時到，你們先吃！',G],['客戶','週六的餐敘我會準時出席，預計晚半小時抵達，敬請見諒。',B]];
  V.forEach((v,i)=>{const a=seg(u,.46+i*.1,.56+i*.1),vy=234+i*210;
   alphaDo(a,()=>{tag(1020,vy,v[0],{size:17,bg:v[2]});card(1020,vy+44,490,130,{bg:'rgba(255,255,255,.05)',st:v[2]});para(1040,vy+84,v[1],450,18,KC.text,500);});});
  alphaDo(seg(u,.72,.82),()=>{card(1020,680,490,90,{bg:'rgba(242,194,48,.12)',st:Y,lw:1.5});para(1040,716,'貼上你寫過的信，請 Claude 參考你的口吻',450,18,Y,700);});
 }},
/* ── 4 給業主的停機通知與安全提醒（場景；風能運維） ── */
{t:'風場：停機通知與安全提醒',en:'Wind farm: outage notice and safety reminder',dur:14,
 d:'風場運維常需要寫信通知業主與承包商。給 Claude 排程資訊與重點：哪幾台機組、預計停機時段、原因與安全注意事項，它能草擬一封條理清楚的通知，並用條列標出時間與聯絡窗口。這些時段與機組均為示意。停機的決定與上鎖掛牌，一律由現場人員依程序確認，Claude 只負責把訊息寫清楚，寄出前由主管核對。',
 s:[[0,'提供機組、時段、原因與聯絡窗口'],[.34,'Claude 草擬條列清楚的通知'],[.66,'停機與上鎖掛牌由人員決定，信由主管核對']],
 draw(u){
  sceneBG();
  card(60,150,520,650,{bg:'rgba(7,27,39,.8)',st:G,lw:1.5});
  caseTag(84,174,'wind',1);
  wt(84,250,'你提供的重點（示意）',21,'#fff',700);
  [['機組','T05、T06'],['時段','週三 08:00–16:00'],['原因','定期保養與葉片檢查'],['聯絡','運維值班室']].forEach((r,i)=>{const a=seg(u,.04+i*.05,.1+i*.05);
   alphaDo(a,()=>{box(84,284+i*74,470,58,'rgba(255,255,255,.06)');wt(104,322+i*74,r[0],17,SUBC,600);{const L=wrapL(r[1],270,18,700);L.forEach((x,k)=>wt(260,(L.length>1?314:322)+i*74+k*22,x,18,'#fff',700));}});});
  alphaDo(seg(u,.26,.34),()=>para(84,606,'天候窗口與工作許可仍由現場人員確認',450,18,SUBC,500));
  arrow(590,450,650,450,Y,3);
  winFrame(660,150,880,650,'草稿預覽（示意）');
  alphaDo(seg(u,.34,.42),()=>{
   wt(690,230,'主旨：週三 T05、T06 保養停機通知',20,'#fff',700);
   ln([690,252,1510,252],KC.border,1);
   para(690,290,'各位好，下週三將進行 T05、T06 的定期保養與葉片檢查，相關安排如下：',800,19,KC.text,500);
  });
  [['停機時段','週三 08:00–16:00'],['影響範圍','T05、T06 暫停發電'],['安全提醒','作業期間禁止進入機艙，需先聯絡值班室']].forEach((r,i)=>{const a=seg(u,.44+i*.07,.52+i*.07);
   alphaDo(a,()=>{circ(706,396+i*66,6,G,'none',0);wt(726,402+i*66,r[0],18,G,700);para(1000,402+i*66,r[1],500,18,KC.text,500);});});
  human(690,640,seg(u,.7,.8),'主管核對時段後才寄出');
  human(1130,640,seg(u,.8,.9),'上鎖掛牌由人員確認');
 }},
/* ── 5 連接 Gmail／Outlook（圖解） ── */
{t:'連接 Gmail 與 Outlook',en:'Connecting Gmail and Outlook',dur:13,
 d:'不想來回複製貼上，可以把信箱連接到 Claude。依 Claude 說明中心，Gmail 連接器可以用白話搜尋與閱讀郵件、草擬信件，也能回覆與轉寄；Microsoft 365 也有對應的連接器。預設情況下，Claude 在執行每個動作之前會徵求你的核准。連接後，你只需說「找出上週廠商的回信」，再請它依內容草擬回覆。',
 s:[[0,'連接信箱，不必再複製貼上'],[.34,'用白話搜尋郵件，依內容草擬回覆'],[.7,'每個動作預設都先徵求你的核准']],
 draw(u){
  diagBG();
  card(60,150,1480,650,{bg:'rgba(7,27,39,.75)'});
  wt(90,196,'連接信箱的流程',22,Y,700);
  const N=[['連接','在設定中連接你的信箱',B],['搜尋','用白話找出相關郵件',Y],['草擬','依郵件內容寫出回覆草稿',G],['核准','你確認後才執行寄出',O]];
  N.forEach((n,i)=>{const a=seg(u,.04+i*.1,.14+i*.1),x=90+i*360;
   alphaDo(a,()=>{card(x,250,320,210,{bg:'rgba(255,255,255,.05)',st:n[2],lw:2});circ(x+44,296,22,n[2],'none',0);wt(x+44,304,String(i+1),22,'#0e2133',800,'center');wt(x+80,304,n[0],24,n[2],800);para(x+24,356,n[1],272,18,KC.text,500);
    if(i<3)arrow(x+326,355,x+354,355,'rgba(255,255,255,.5)',2.5);});});
  alphaDo(seg(u,.5,.58),()=>{card(90,500,700,260,{bg:'rgba(7,27,39,.85)',st:B});
   wt(114,544,'你說：',17,SUBC,600);para(114,578,'找出上週廠商關於 M3 馬達的回信，幫我草擬確認備品交期的回覆',640,19,'#fff',600);
   alphaDo(seg(u,.58,.66),()=>{caseTag(114,680,'auto',1);caseTag(240,680,'life',1);});});
  alphaDo(seg(u,.68,.78),()=>{card(830,500,680,260,{bg:'rgba(232,87,42,.08)',st:O,lw:2});
   wt(860,544,'Claude 想執行：寄出郵件',20,O,700);
   para(860,584,'收件人：廠商窗口。內容：確認備品交期。',620,18,KC.text,500);
   ['允許','拒絕'].forEach((t,i)=>tag(860+i*140,670,t,{size:19,bg:i===0?G:'rgba(255,255,255,.2)',fg:i===0?'#0e2133':'#fff'}));});
  alphaDo(seg(u,.86,.94),()=>wt(90,788,'Team 與 Enterprise 方案的管理員可決定成員能否免核准執行動作',16,SUBC,500));
 }},
/* ── 6 寄出前檢查（圖解） ── */
{t:'寄出前檢查',en:'Check before you send',dur:13,
 d:'草稿由 Claude 寫，寄出的責任在你。按下送出前，快速過一遍五件事：收件人與副本是否正確；日期、金額與名稱等事實是否無誤；附件有沒有附上；有沒有不該寫進去的敏感資料；語氣是否適合這位收件人。重要的信，可以請 Claude 再讀一次，列出可能的誤解或遺漏，再由你定稿。',
 s:[[0,'草稿是起點，你是最後一道關卡'],[.24,'收件人、事實、附件、敏感資料、語氣'],[.7,'重要的信，請 Claude 再讀一遍找遺漏']],
 draw(u){
  diagBG();
  card(60,150,960,650,{bg:'rgba(7,27,39,.75)'});
  wt(90,196,'寄出前五項檢查',22,Y,700);
  const C=[['收件人與副本','有沒有寄錯人、漏掉誰'],['事實與數字','日期、金額、機組編號都核對'],['附件','附件有附上，檔案正確'],['敏感資料','沒有身分證字號、密碼或機密'],['語氣','適合這位收件人']];
  C.forEach((c,i)=>{const ry=230+i*112,a=seg(u,.06+i*.1,.14+i*.1);
   alphaDo(clamp(.35+a*3,0,1),()=>{checkBox(96,ry,a);wt(150,ry+22,c[0],21,a>0?'#fff':SUBC,700);wt(150,ry+58,c[1],17,SUBC,500);});});
  card(1060,150,480,650,{bg:'rgba(7,27,39,.8)',st:Y,lw:1.5});
  wt(1090,196,'請 Claude 再讀一遍',22,Y,700);
  alphaDo(seg(u,.66,.74),()=>{para(1090,246,'指示：「這封信寄給客戶，請列出可能被誤解或遺漏的地方」',410,18,SUBC,600);});
  ['停機時段沒有寫時區或日期','聯絡窗口缺少電話'].forEach((s,i)=>{const a=seg(u,.74+i*.07,.82+i*.07);
   alphaDo(a,()=>{card(1090,350+i*120,420,100,{bg:'rgba(242,194,48,.1)',st:Y});para(1110,392+i*120,s,380,18,KC.text,600);});});
  human(1090,700,seg(u,.9,.96),'定稿與寄出由你決定');
 }}
]};
