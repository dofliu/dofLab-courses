// KITS: claude
/* 009-personal-work-overview — Claude 如何融入你的一天工作
   Claude AI 應用動畫館｜個人工作 總覽片
   依 support.claude.com（連接器、Skills）查證，資訊截至 2026-09 */

const Y='#f2c230',O='#e8572a',G='#7dffc4',B='#58b8d0',P='#b37cff',SUBC='rgba(227,236,238,.8)';

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
function human(x,y,a,label){
  alphaDo(a,()=>{card(x,y,360,64,{bg:'rgba(125,255,196,.1)',st:G,lw:2});check(x+34,y+32,true,G);wt(x+62,y+39,label,19,G,700);});
}
function caseTag(x,y,kind,a){
  const M={life:['生活',B],auto:['智慧自動化',Y],wind:['風能運維',G]}[kind];
  alphaDo(a,()=>tag(x,y,M[0],{size:16,bg:M[1]}));
}
function check(x,y,on,col){ring(x,y,13,on?col:'rgba(255,255,255,.3)',2);if(on)ln([x-6,y,x-1,y+6,x+7,y-6],col,3);}
function toggle(x,y,on){
  rrp(x,y,64,32,16);ctx.fillStyle=on>.5?'rgba(125,255,196,.35)':'rgba(255,255,255,.12)';ctx.fill();
  ctx.strokeStyle=on>.5?G:KC.border;ctx.lineWidth=1.5;ctx.stroke();
  circ(lerp(x+16,x+48,on),y+16,11,on>.5?G:'#9fb4c2','none',0);
}

const EP={no:0,slug:'personal-work',seriesName:'個人工作系列・總覽片',t:'Claude 如何融入你的一天工作',en:'Personal Work: Overview',
lede:'從早上的郵件，到下班前的交班報告：這支總覽片跟著上班族、產線工程師與風場運維主管的一天，看 Claude 怎麼幫忙草擬、整理、分析、簡報，再進一步連接資料、排程與打包成 Skills。',
facts:[['8','個主題','個人工作系列的八集：從郵件、會議到 Skills'],['3','種連接器','Gmail、Google 日曆、Google 雲端硬碟可連接到 Claude'],['5','個步驟','一天的工作流：草擬、整理、分析、簡報、自動化'],['預覽','再送出','草稿與建議都由你確認，Claude 不會替你做最後決定'],['可重複','','把做得好的流程存成 Skill，下次直接套用']],
note:'說明：本片為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。連接器與 Skills 功能依 Claude 說明中心（support.claude.com）整理，資訊截至 2026-09，實際以官方最新說明為準。郵件、會議、警報紀錄、SCADA 數據與風速功率均為虛構的示意範例，並非任何特定公司或案場資料；停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 郵件（生活） */
{t:'早上 8:30：郵件與訊息草擬',en:'8:30 am: drafting emails and messages',dur:12,
 d:'一天從收件匣開始。貼上收到的信和你的重點，Claude 會依收件人與語氣草擬回覆，也能把長串訊息濃縮成三行摘要。草稿只是起點：你檢查事實、調整措辭，確認沒問題才按下送出。同一套做法也適合寫給客戶、同事或供應商的訊息，第一集會細講怎麼下指示。',
 s:[[0,'貼上來信與你的重點'],[.36,'Claude 依收件人與語氣草擬回覆'],[.7,'你檢查、修改，確認後才送出']],
 draw(u){
  diagBG();floatParticles(14,3);
  winFrame(70,170,560,560,'收件匣');
  const M=[['王經理','週五前可以給我報價嗎？'],['採購部','會議室改到 3 樓'],['林同學','老師，報告延期申請']];
  M.forEach((m,i)=>{const a=seg(u,.02+i*.04,.08+i*.04),y=236+i*110;alphaDo(a,()=>{card(94,y,512,92,{bg:i===0?'rgba(242,194,48,.12)':'rgba(7,27,39,.8)',st:i===0?Y:'rgba(255,255,255,.18)',lw:i===0?2:1.2});circ(134,y+46,22,B);wt(134,y+54,tr(m[0])[0],20,'#0e2133',800,'center');wt(174,y+38,m[0],19,'#fff',700);wt(174,y+68,m[1],17,SUBC,500);});});
  caseTag(94,590,'life',seg(u,.1,.16));
  para(94,650,'上班族的一天，從回信開始',500,18,SUBC,500);
  arrow(640,450,730,450,Y,3);
  winFrame(740,170,790,560,'Claude');
  bub(764,236,742,'幫我回王經理：週五下午 3 點前給報價，語氣客氣',   'user',seg(u,.24,.34));
  bub(764,370,742,'王經理您好，報價單預計週五下午 3 點前寄出；若需要調整項目，也請隨時告訴我。',  'ai',seg(u,.38,.5),Y);
  alphaDo(seg(u,.52,.6),()=>{['縮短一點','語氣更正式','加上附件說明'].forEach((t,i)=>tag(770+i*190,560,t,{size:16,bg:B}));});
  human(770,640,seg(u,.7,.8),'你確認後才送出');
 }},
/* 2 會議（生活＋智慧自動化） */
{t:'會議全流程：會前、會中、會後',en:'Meetings from prep to follow-up',dur:12,
 d:'會議前，讓 Claude 依主題整理議程與要問的問題；會議中，把逐字稿或你的筆記貼給它；會後，它能整理決議、待辦事項與負責人，再草擬追蹤信。產線工程師的交班會議也一樣：把當班的 PLC 警報紀錄貼上，Claude 依重複次數與時間整理重點，但要不要停機檢修，仍由值班人員判斷。',
 s:[[0,'會前：議程與要問的問題'],[.34,'會中：筆記或逐字稿貼給 Claude'],[.62,'會後：決議、待辦、負責人，一次整理好']],
 draw(u){
  diagBG();
  const cols=[['會前','議程','#58b8d0'],['會中','筆記','#f2c230'],['會後','待辦','#7dffc4']];
  cols.forEach((c,i)=>{const a=seg(u,.02+i*.04,.08+i*.04);alphaDo(a,()=>{card(60+i*250,170,230,64,{bg:'rgba(7,27,39,.8)',st:c[2],lw:2});wt(60+i*250+115,212,tr(c[0]),22,c[2],800,'center');if(i<2)arrow(60+i*250+234,202,60+i*250+246,202,'rgba(255,255,255,.5)',2.5);});});
  alphaDo(seg(u,.1,.2),()=>{card(60,260,730,430,{bg:'rgba(7,27,39,.75)'});caseTag(84,292,'life',1);
   wt(84,352,'週會（生活案例）',20,'#fff',700);
   ['本週三個進度','需要主管決定的一件事','下週的兩項待辦'].forEach((t,i)=>{const a=seg(u,.16+i*.05,.22+i*.05);alphaDo(a,()=>{check(104,400+i*52,true,G);wt(132,407+i*52,t,19,'#fff',500);});});
   alphaDo(seg(u,.32,.4),()=>{ln([84,568,766,568],'rgba(255,255,255,.2)',1.5);wt(84,606,'整理成：',18,SUBC,600);
    [['決議','#7dffc4'],['待辦','#f2c230'],['負責人','#58b8d0']].forEach((t,i)=>tag(84+wtw(tr('整理成：'),18,600)+24+i*130,592,t[0],{size:17,bg:t[1]}));});
  });
  alphaDo(seg(u,.5,.58),()=>{card(830,170,710,520,{bg:'rgba(7,27,39,.75)',st:Y,lw:1.5});caseTag(854,202,'auto',1);
   wt(854,262,'交班會議：當班 PLC 警報紀錄（示意）',20,'#fff',700);
   const R=[['02:14','馬達 M3 過載','×4'],['03:40','輸送帶 感測器偏移','×2'],['05:05','壓力低','×1']];
   R.forEach((r,i)=>{const a=seg(u,.54+i*.04,.6+i*.04);alphaDo(a,()=>{box(854,300+i*54,660,44,i===0?'rgba(232,87,42,.18)':'rgba(255,255,255,.06)');wt(872,330+i*54,r[0],18,SUBC,500,'left',COND);wt(960,330+i*54,r[1],19,'#fff',500);wt(1500,330+i*54,r[2],20,i===0?O:'#fff',700,'right',COND);});});
   alphaDo(seg(u,.68,.76),()=>{para(854,500,'Claude：M3 過載重複 4 次，建議交班時優先檢查負載與軸承',640,19,Y,600);});
   human(854,600,seg(u,.8,.9),'是否停機，由值班人員決定');
  });
 }},
/* 3 文件與資料（風能運維：圖解） */
{t:'文件與資料：寫作、改寫、試算表分析',en:'Documents and spreadsheets',dur:13,
 d:'寫文件時，Claude 可以起草大綱、改寫語氣、把冗長段落縮短。遇到試算表，把 CSV 或 Excel 拖進對話，用白話問問題，它會整理欄位、算出統計並畫圖。以風場運維主管為例：貼上一天的示意風速與功率資料，Claude 會畫出功率曲線，標出偏離典型曲線的時段，但原因仍要對照維修紀錄與現場檢查。',
 s:[[0,'文件：起草、改寫、縮短'],[.32,'試算表：用白話提問，Claude 算出來並畫圖'],[.66,'偏離曲線的點，交給人查原因']],
 draw(u){
  diagBG();
  card(60,170,470,540,{bg:'rgba(7,27,39,.75)'});caseTag(84,196,'life',1);wt(84,262,'文件寫作與改寫',21,'#fff',700);
  [['起草大綱','#58b8d0'],['改寫語氣','#f2c230'],['縮短段落','#7dffc4']].forEach((t,i)=>{const a=seg(u,.04+i*.05,.1+i*.05);alphaDo(a,()=>{card(84,296+i*88,420,70,{bg:'rgba(255,255,255,.05)',st:t[1]});wt(114,340+i*88,t[0],21,t[1],700);const w=[300,250,340][i];for(let k=0;k<2;k++)box(300,318+i*88+k*18,w*.45-k*40,8,'rgba(255,255,255,.22)');});});
  para(84,596,'貼上原文，說明讀者與篇幅，Claude 給出修改版',420,18,SUBC,500);
  card(560,170,980,540,{bg:'rgba(7,27,39,.75)',st:G,lw:1.5});caseTag(584,196,'wind',1);
  alphaDo(seg(u,.24,.3),()=>{wt(584,262,'一天的風速與功率（示意資料）',21,'#fff',700);
   const c=chartBox(584,280,900,380,{title:'',x0:0,x1:25,y0:0,y1:100,xt:[0,5,10,15,20,25],yt:[0,50,100],pl:60,pt:20,pb:56});
   wt(584+30,300+18,'功率 %',15,SUBC,600);wt(584+900-10,280+380-6,'風速 m/s',15,SUBC,600,'right');
   const f=v=>v<3?0:v>=12?100:Math.min(100,100*Math.pow((v-3)/9,3)*.6+ (v-3)/9*40);
   const k=seg(u,.3,.5);
   const pts=[];for(let v=3;v<=25;v+=.5)pts.push({x:c.X(v),y:c.Y(f(v))});
   const P2=partial(pts,k);ln(P2.flatMap(p=>[p.x,p.y]),G,4);
   const D=[[5,14],[7,27],[9,48],[10,62],[11,80],[12,96],[14,100],[8,33],[6,20]];
   D.forEach((d,i)=>{const a=seg(u,.36+i*.02,.42+i*.02);alphaDo(a,()=>circ(c.X(d[0]),c.Y(d[1]),6,'#fff'));});
   [[10,30],[13,62]].forEach((d,i)=>{const a=seg(u,.6+i*.05,.66+i*.05);alphaDo(a,()=>{circ(c.X(d[0]),c.Y(d[1]),9,'rgba(232,87,42,.25)',O,3);});});
   alphaDo(seg(u,.68,.76),()=>tag(c.X(15),c.Y(48),'偏離典型曲線',{size:17,bg:O,fg:'#fff'}));
  });
  human(1140,640,seg(u,.8,.9),'原因對照維修紀錄再判斷');
 }},
/* 4 簡報（生活＋智慧自動化，圖解） */
{t:'簡報製作：從內容到版面',en:'Building a slide deck',dur:12,
 d:'簡報最花時間的是整理思路。給 Claude 你的主題、聽眾與時間長度，它先提出每頁一個重點的大綱，再逐頁補上標題與講稿。做月會報告時，你可以貼上 OEE（設備綜合效率）的示意數字，請它整理成三頁：現況、原因、改善行動。版面與數字，最後由你逐頁檢查。',
 s:[[0,'先定主題、聽眾與時間'],[.34,'每頁一個重點的大綱'],[.66,'逐頁補上標題與講稿，你檢查數字']],
 draw(u){
  diagBG();
  card(60,170,420,250,{bg:'rgba(7,27,39,.75)'});caseTag(84,196,'life',1);
  para(84,262,'給我一份 10 分鐘的部門月會簡報大綱，聽眾是主管',372,20,'#fff',600);
  alphaDo(seg(u,.08,.14),()=>{['主題','聽眾','10 分鐘'].forEach((t,i)=>tag(84+i*120,370,t,{size:16,bg:B}));});
  arrow(490,300,560,300,Y,3);
  const S=[['現況','OEE 78%（示意）'],['原因','停機 42%、速度 33%、其他 25%（示意）'],['行動','三項改善與負責人'],['需要決定','預算與時程']];
  S.forEach((s,i)=>{const a=seg(u,.16+i*.07,.24+i*.07),x=580+(i%2)*490,y=170+Math.floor(i/2)*240;alphaDo(a,()=>{card(x,y,460,210,{bg:'rgba(255,255,255,.07)',st:i<3?Y:B,lw:2});wt(x+22,y+44,String(i+1),24,Y,800,'left',COND);wt(x+60,y+44,s[0],24,'#fff',800);para(x+24,y+96,s[1],410,19,SUBC,500);box(x+24,y+170,300,8,'rgba(255,255,255,.2)');});});
  alphaDo(seg(u,.16,.24),()=>caseTag(580,650,'auto',1));
  alphaDo(seg(u,.5,.58),()=>{card(60,450,420,240,{bg:'rgba(7,27,39,.75)'});wt(84,496,'每頁附上講稿',21,Y,700);para(84,540,'口語、兩到三句，照著念就能講',372,18,SUBC,500);});
  human(1100,660,seg(u,.78,.88),'數字與版面，由你逐頁檢查');
 }},
/* 5 連接器（三案例並列圖解） */
{t:'連接器：讓 Claude 讀到你的資料',en:'Connectors: let Claude reach your data',dur:13,
 d:'前面都是你把內容貼給 Claude。連接器讓它在你授權後，直接查詢你的資料來源。Gmail、Google 日曆與 Google 雲端硬碟都能連接：它可以搜尋郵件、找空檔、讀取文件。企業裡也能接到工單或知識庫。資料來源與權限由你決定，可以隨時在設定中管理，團隊版還要由管理員先啟用。',
 s:[[0,'連接器：授權後，Claude 才能查你的資料'],[.36,'郵件、日曆、雲端硬碟；企業還能接工單與知識庫'],[.7,'授權範圍由你決定，隨時可以管理']],
 draw(u){
  diagBG();
  const cx=800,cy=430;
  const N=[[280,230,'Gmail','搜尋、草擬郵件',B],[280,550,'Google 日曆','找空檔、排會議',Y],[1320,230,'雲端硬碟','讀取文件與試算表',G],[1320,550,'工單／知識庫','企業內部系統',P]];
  N.forEach((n,i)=>{const a=seg(u,.16+i*.07,.24+i*.07);connLine(n[0]+(n[0]<800?150:-150),n[1],cx,cy,{u:a,flow:a>=1,col:n[4]});});
  agentNode(cx,cy,64,'Claude',{u:seg(u,.02,.12),active:.6+.3*Math.sin(TT*2),icon:'✦'});
  N.forEach((n,i)=>{const a=seg(u,.16+i*.07,.24+i*.07);alphaDo(a,()=>{card(n[0]-150,n[1]-60,300,120,{bg:'rgba(7,27,39,.85)',st:n[4],lw:2});wt(n[0],n[1]-8,n[2],24,n[4],800,'center');wt(n[0],n[1]+28,n[3],18,SUBC,500,'center');});});
  alphaDo(seg(u,.44,.52),()=>{card(60,650,1480,120,{bg:'rgba(7,27,39,.8)'});
   const C=[['life','找出上週所有王經理的來信'],['auto','查本月同一台設備的工單'],['wind','讀取本週風場巡檢報告']];
   C.forEach((c,i)=>{caseTag(90+i*490,666,c[0],1);para(90+i*490,720,c[1],430,18,'#fff',500);});});
  alphaDo(seg(u,.72,.8),()=>{toggle(700,80,seg(u,.72,.84));wt(790,108,'授權與範圍：由你決定',21,G,700);});
 }},
/* 6 排程工作（時間軸圖解） */
{t:'排程工作：自動化例行事',en:'Scheduled tasks: automating routines',dur:12,
 d:'每天都要做的整理，可以交給排程工作：你寫好一次指示，設定時間，Claude 就依時間自己開始執行，完成後通知你。例如每天早上彙整前一晚的示意 SCADA 報表與新增工單，整理成一頁摘要；週五自動整理本週待辦。它負責整理，異常怎麼處理，仍由值班的人決定。',
 s:[[0,'寫好一次指示，設定時間'],[.34,'時間到了，Claude 自己開始整理'],[.68,'完成後通知你，處理由人決定']],
 draw(u){
  diagBG();
  const tx0=100,tx1=1500,ty=300;ln([tx0,ty,tx1,ty],'rgba(255,255,255,.35)',3);
  const T=[['06:30','抓取昨夜報表',B,'wind'],['07:00','整理成一頁摘要',Y,'wind'],['07:30','通知你',G,'wind']];
  T.forEach((t,i)=>{const x=340+i*400,a=seg(u,.04+i*.1,.12+i*.1);alphaDo(a,()=>{circ(x,ty,16,t[2],'none',0);wt(x,ty-34,t[0],28,t[2],800,'center',COND);wt(x,ty+58,t[1],20,'#fff',600,'center');});});
  alphaDo(seg(u,.02,.1),()=>caseTag(100,190,'wind',1));
  const p=clamp((u-.3)/.4);circ(lerp(340,1140,ease(p)),ty,9,'#fff');
  alphaDo(seg(u,.4,.5),()=>{card(100,420,660,290,{bg:'rgba(7,27,39,.8)',st:G,lw:1.5});wt(126,466,'每日一頁摘要（示意）',22,G,800);
   [['發電量','昨日 68% 容量因數'],['新工單','3 張，1 張標為緊急'],['天候窗口','明日 10:00 後風速下降']].forEach((r,i)=>{const a=seg(u,.44+i*.05,.5+i*.05);alphaDo(a,()=>{check(140,522+i*64,true,G);wt(168,530+i*64,r[0],19,SUBC,600);wt(360,530+i*64,r[1],19,'#fff',500);});});});
  alphaDo(seg(u,.56,.64),()=>{card(840,420,700,290,{bg:'rgba(7,27,39,.8)',st:B,lw:1.5});caseTag(866,446,'life',1);
   wt(866,516,'每週五 16:00',22,B,800);para(866,556,'整理本週完成事項與下週待辦，寄到你的草稿匣',630,19,SUBC,500);
   caseTag(866,630,'auto',seg(u,.62,.68));para(866,684,'PLC 警報週報：重複最多的三種警報',630,18,'#fff',500);});
  human(1100,760,seg(u,.78,.88),'異常處理，由值班人員決定');
 }},
/* 7 Skills（圖解＋一天總結） */
{t:'Skills：把好流程打包，下次直接用',en:'Skills: package your workflow',dur:12,
 d:'同一個流程做了幾次，就值得打包成 Skill：把步驟、格式與注意事項寫成一份說明，需要時 Claude 會自己載入，照你的標準做事。例如「週報格式」「交班紀錄格式」「風場日報模板」。它像一份給 Claude 的標準作業程序，也能分享給團隊，讓大家的成果格式一致。',
 s:[[0,'重複做的流程，寫成一份說明'],[.34,'Claude 需要時自動載入，照標準做事'],[.7,'團隊共用，成果格式一致']],
 draw(u){
  diagBG();
  card(60,170,460,540,{bg:'rgba(7,27,39,.8)',st:Y,lw:2});wt(90,222,'一個 Skill',24,Y,800);
  rrp(96,262,388,64,8);ctx.fillStyle='rgba(242,194,48,.14)';ctx.fill();wt(122,304,'📁',24,'#fff',500);wt(166,304,'shift-report',21,'#fff',700);
  ['步驟：先看警報，再看工單','格式：三欄表格','注意：不下停機結論'].forEach((t,i)=>{const a=seg(u,.06+i*.06,.14+i*.06);alphaDo(a,()=>{check(116,372+i*72,true,G);para(146,379+i*72,t,330,19,'#fff',500);});});
  arrow(540,440,640,440,Y,3);
  agentNode(800,440,60,'Claude',{u:seg(u,.24,.34),active:.6+.3*Math.sin(TT*2),icon:'✦'});
  alphaDo(seg(u,.3,.4),()=>{wt(800,548,'需要時自動載入',19,Y,700,'center');});
  const C=[['生活','週報格式','life',170],['智慧自動化','交班紀錄格式','auto',330],['風能運維','風場日報模板','wind',490]];
  C.forEach((c,i)=>{const a=seg(u,.42+i*.06,.5+i*.06);alphaDo(a,()=>{card(1000,c[3],540,130,{bg:'rgba(7,27,39,.8)',st:'rgba(255,255,255,.2)'});caseTag(1024,c[3]+20,c[2],1);wt(1024,c[3]+92,c[1],23,'#fff',700);});});
  alphaDo(seg(u,.42,.5),()=>connLine(880,440,1000,235,{u:1,flow:true,col:Y}));
  alphaDo(seg(u,.54,.6),()=>connLine(880,440,1000,395,{u:1,flow:true,col:Y}));
  alphaDo(seg(u,.6,.66),()=>connLine(880,440,1000,555,{u:1,flow:true,col:Y}));
  alphaDo(seg(u,.72,.8),()=>{card(560,740,720,84,{bg:'rgba(125,255,196,.1)',st:G,lw:2});para(590,776,'草擬 → 整理 → 分析 → 簡報 → 連接 → 排程 → 打包；決定權一直在你',660,20,G,700);});
 }}
]};
