// KITS: claude
/* 014-personal-work-ep05 — 簡報製作
   Claude AI 應用動畫館｜個人工作 第 5 集
   依 claude.com/docs（Claude for PowerPoint）與 support.claude.com（建立與編輯檔案）查證，資訊截至 2026-10 */

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
const EP={no:5,slug:'personal-work',t:'簡報製作',en:'Building Presentations',
seriesName:'個人工作',total:8,
lede:'先定聽眾與故事線，再一頁一重點，接著用 Claude 產出 .pptx 或在 PowerPoint 裡協作，最後備講稿、預演問答：這一集用旅遊分享、智慧產線導入成果與風場季度運維檢討，示範 Claude 怎麼陪你做簡報。',
facts:[['1','頁一個重點','標題寫成結論，內文只留支撐它的東西'],['.pptx','可下載檔案','開啟程式碼執行與檔案建立後，可直接產出'],['PowerPoint','外掛','Claude for PowerPoint，適用 Pro、Max、Team、Enterprise'],['稿','＋預演','講者備忘稿與聽眾可能的提問，先演練一遍'],['人審閱','再交付','最終版由你審閱，設備相關結論由人員確認']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。檔案建立與 Claude for PowerPoint 外掛依 Claude 說明中心（support.claude.com）與 claude.com/docs 整理，資訊截至 2026-10，方案、支援版本與功能實際以官方最新說明為準。旅遊行程、產線成果、風場檢討數字均為虛構的示意或典型範例，並非任何特定公司、機關或案場資料；AI 提供分析與建議，停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 故事線（生活） */
{t:'先有故事線',en:'Start with the storyline',dur:14,
 d:'打開空白簡報之前，先告訴 Claude 三件事：聽眾是誰、要講多久、聽完希望他們做什麼。以社團旅遊分享為例，Claude 會先列出一條故事線：出發的原因、三個亮點、花費與心得、下次的邀請。你調整順序與取捨後，再往下做頁面，比直接要求「做十頁」更不容易失焦。',
 s:[[0,'先說聽眾、時間與目的'],[.36,'Claude 列出故事線'],[.7,'你調整順序再往下做']],
 draw(u){
  sceneBG();
  winFrame(60,150,760,650,'Claude');
  caseTag(84,206,'life',1);
  bub(110,250,690,'社團分享會 10 分鐘，講花蓮三日遊，希望大家想參加下次。','user',seg(u,.02,.1));
  card(840,150,700,650,{bg:'rgba(7,27,39,.8)',st:Y,lw:1.5});
  wt(866,196,'故事線（草稿）',22,Y,700);
  [['出發的原因',B],['三個亮點',Y],['花費與心得',G],['下次的邀請','#b37cff']].forEach((r,i)=>{const a=seg(u,.2+i*.09,.3+i*.09),y=226+i*100;
   alphaDo(a,()=>{card(866,y,650,82,{bg:'rgba(255,255,255,.05)',st:r[1]});circ(904,y+41,17,r[1],'none',0);wt(904,y+47,String(i+1),18,'#0e2133',800,'center');wt(940,y+49,r[0],22,'#fff',700);});});
  alphaDo(seg(u,.62,.72),()=>{wt(110,560,'想調整順序或取捨，直接告訴 Claude',19,SUBC,600);});
  alphaDo(seg(u,.8,.9),()=>human(866,660,1,'你決定取捨與順序'));
 }},
/* 2 一頁一重點（智慧自動化） */
{t:'一頁一重點',en:'One point per slide',dur:14,
 d:'一頁塞太多東西，聽眾只會讀字。請 Claude 把標題改寫成結論句，內文只留三個支撐項目，再建議放表格還是圖。以智慧產線導入成果為例：改前是一頁文字牆，改後標題直接寫出結論，並用前後對照圖呈現。數字為示意，簡報上的每個數字都應回到你的資料核對。',
 s:[[0,'改前：一頁擠滿文字'],[.36,'標題改成結論，內文留三點'],[.7,'前後對照，數字回頭核對']],
 draw(u){
  diagBG();floatParticles(8,5);
  caseTag(60,150,'auto',1);
  wt(60,230,'改前',20,O,700);
  alphaDo(1,()=>{box(60,250,640,420,'#f6f9f8','rgba(255,255,255,.4)',1.5);wt(80,292,'智慧產線導入專案說明',20,'#13232e',800);
   for(let i=0;i<9;i++){const a=seg(u,.02+i*.02,.08+i*.02);alphaDo(a,()=>{ln([84,326+i*32,84+(i%3===0?560:470),326+i*32],'rgba(79,100,112,.55)',9);});}});
  arrow(720,460,790,460,Y,3);
  wt(820,230,'改後',20,G,700);
  alphaDo(seg(u,.34,.44),()=>{box(820,250,720,420,'#f6f9f8','rgba(255,255,255,.4)',1.5);box(820,250,720,6,G,'none',0);
   wt(844,306,'導入後，換線時間縮短約三成（示意）',22,'#13232e',800);});
  alphaDo(seg(u,.5,.62),()=>{wt(850,356,'改前',16,'#4f6470',700);wt(1230,356,'改後',16,'#4f6470',700);
   const h1=ease(seg(u,.5,.62))*200,h2=ease(seg(u,.54,.66))*140;
   box(850,620-h1,150,h1,O,'none',0);box(1230,620-h2,150,h2,G,'none',0);
   wt(925,610-h1,'50 分',22,'#13232e',800,'center',COND);wt(1305,610-h2,'35 分',22,'#13232e',800,'center',COND);ln([830,620,1520,620],'#4f6470',2);});
  alphaDo(seg(u,.7,.78),()=>{['三個支撐重點','表格或圖，不用長句'].forEach((t,i)=>tag(60+i*260,700,t,{size:17,bg:[B,Y][i]}));});
  alphaDo(seg(u,.84,.94),()=>human(820,708,1,'回到資料核對每個數字'));
 }},
/* 3 檔案與外掛（生活＋智慧自動化） */
{t:'Slides 與 PowerPoint',en:'Slides and PowerPoint',dur:14,
 d:'做成實際檔案有兩條路。其一，在 Claude 開啟「程式碼執行與檔案建立」，直接請它產出 .pptx 並下載。其二，安裝 Claude for PowerPoint 外掛，在 PowerPoint 裡讀取你的範本，套用版面、字型與色彩，也能只修改選取的那一頁，並把條列轉成圖表。外掛適用 Pro、Max、Team 與 Enterprise 方案。',
 s:[[0,'路一：請 Claude 產出 .pptx'],[.36,'路二：PowerPoint 裡的外掛'],[.7,'讀範本、改單頁、轉圖表']],
 draw(u){
  diagBG();
  caseTag(60,150,'life',1);caseTag(170,150,'auto',1);
  card(60,196,720,600,{bg:'rgba(7,27,39,.78)',st:B,lw:2});
  wt(90,244,'路一　對話中產出檔案',22,B,700);
  alphaDo(seg(u,.02,.12),()=>{card(90,270,660,84,{bg:KC.userBub});wt(110,320,'幫我做旅遊分享簡報，存成 .pptx',19,'#fff',600);});
  alphaDo(seg(u,.14,.26),()=>{box(260,400,320,200,'#f6f9f8','rgba(255,255,255,.4)',1.5);box(260,400,320,6,Y,'none',0);wt(280,440,'花蓮三日遊',22,'#13232e',800);wt(280,480,'.pptx',34,O,800,'left',COND);});
  alphaDo(seg(u,.26,.36),()=>{tag(300,640,'下載後自行開啟審閱',{size:17,bg:G});wt(90,700,'設定：程式碼執行與檔案建立',18,SUBC,600);});
  card(820,196,720,600,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});
  wt(850,244,'路二　Claude for PowerPoint 外掛',22,Y,700);
  alphaDo(seg(u,.4,.5),()=>{slideBox(850,280,200,130,'範本版面',1,B,['字型','色彩']);slideBox(1080,280,200,130,'第 4 頁',1,Y,['只改這頁']);alphaDo(1,()=>wt(1300,350,'← 選取後修改',18,Y,700));});
  alphaDo(seg(u,.52,.64),()=>{wt(850,470,'條列 → 圖表與流程',20,'#fff',700);[['A',B],['B',Y],['C',G]].forEach((r,i)=>{circ(890+i*150,540,26,r[1],'none',0);wt(890+i*150,548,r[0],20,'#0e2133',800,'center');if(i<2)arrow(920+i*150,540,1010+i*150-26,540,SUBC,2.5);});});
  alphaDo(seg(u,.7,.8),()=>{['Pro','Max','Team','Enterprise'].forEach((t,i)=>tag(850+i*120,620,t,{size:16,bg:[B,Y,G,'#b37cff'][i]}));wt(850,690,'方案適用範圍依官方最新說明',17,SUBC,600);});
  alphaDo(seg(u,.86,.95),()=>human(820,716,1,'最終版由你審閱'));
 }},
/* 4 講者備忘稿（生活） */
{t:'講者備忘稿',en:'Speaker notes',dur:13,
 d:'簡報做好，還要準備怎麼講。把投影片內容貼給 Claude，請它依你的口氣與時間，替每一頁擬一段口說稿，並標出需要停頓、互動與轉場的地方。以旅遊分享為例，十分鐘約十頁，每頁一分鐘。口說稿的語氣和事實要由你修改，因為只有你知道旅途中真正發生了什麼。',
 s:[[0,'貼上簡報內容與時間'],[.36,'每頁一段口說稿'],[.7,'標出停頓與互動']],
 draw(u){
  sceneBG();
  caseTag(60,150,'life',1);
  slideBox(60,196,420,260,'第 3 頁　亮點二',seg(u,.02,.1),Y,['太魯閣步道','清晨最舒服','人少、風景好']);
  alphaDo(seg(u,.1,.18),()=>arrow(500,326,570,326,Y,3));
  card(590,196,950,500,{bg:'rgba(7,27,39,.82)',st:Y,lw:2});
  wt(620,244,'口說稿（約 1 分鐘）',22,Y,700);
  alphaDo(seg(u,.3,.42),()=>para(620,290,'第二個亮點是太魯閣。我們七點出發，人還不多。大家猜猜，這段步道走多久？',880,21,KC.text,600,32));
  alphaDo(seg(u,.46,.58),()=>{para(620,420,'（停頓，讓大家舉手）　接著說明：約 40 分鐘，適合新手。',880,21,KC.text,600,32);});
  alphaDo(seg(u,.62,.72),()=>{['停頓','互動提問','轉場'].forEach((t,i)=>tag(620+i*170,560,t,{size:17,bg:[B,O,G][i]}));});
  alphaDo(seg(u,.76,.86),()=>wt(620,640,'時間：10 頁 × 約 1 分鐘',18,SUBC,600));
  alphaDo(seg(u,.84,.94),()=>human(60,500,1,'事實與語氣由你改'));
 }},
/* 5 預演問答（風能運維） */
{t:'預演問答',en:'Rehearsing Q&A',dur:15,
 d:'簡報最怕現場被問倒。把風場季度運維檢討簡報交給 Claude，請它扮演主管，提出三個最可能被問的問題，並建議回答的方向：例如可利用率為何下降、備品是否足夠、下季出海的天候窗口。Claude 給的是預演題與方向，答案要由你用真實紀錄補上；涉及停機或上鎖掛牌的決定，由現場人員確認。',
 s:[[0,'請 Claude 扮演主管提問'],[.36,'三個最可能的問題'],[.7,'答案用真實紀錄補上']],
 draw(u){
  diagBG();floatParticles(8,13);
  caseTag(60,150,'wind',1);
  wt(60,230,'風場季度運維檢討（示意）',22,G,700);
  slideBox(60,250,460,280,'本季重點',seg(u,.02,.1),G,['可利用率 97 %（示意）','故障碼 F101 居首','備品與出海排程']);
  const Q=[['可利用率為什麼比上季低？','用停機時數與原因分類回答',B],['關鍵備品庫存夠嗎？','列出庫存量與交期',Y],['下季出海天候窗口？','東北季風期，彈性排程',O]];
  Q.forEach((r,i)=>{const a=seg(u,.3+i*.1,.42+i*.1),y=196+i*190;
   alphaDo(a,()=>{card(580,y,960,170,{bg:'rgba(7,27,39,.8)',st:r[2],lw:2});wt(606,y+44,'主管可能問',16,r[2],700);wt(606,y+84,r[0],23,'#fff',700);wt(606,y+130,r[1],18,SUBC,600);});});
  alphaDo(seg(u,.82,.92),()=>human(60,580,1,'停機、上鎖掛牌由人員確認'));
  alphaDo(seg(u,.86,.95),()=>wt(60,690,'答案要用真實紀錄補上',19,Y,700));
 }},
/* 6 交付前把關（三類） */
{t:'交付前把關',en:'Final checks before delivery',dur:14,
 d:'交出簡報之前，請 Claude 協助做最後檢查：標題是否寫成結論、單頁是否太擠、前後數字是否一致。說明中心提醒，不建議未經人工審閱就交出最終客戶版，也不建議放入高度敏感或受規範的資料；只使用可信任來源的檔案。三個情境各有一個把關重點。',
 s:[[0,'檢查標題、版面、數字'],[.4,'三個情境的把關重點'],[.74,'最終版由人審閱']],
 draw(u){
  diagBG();
  const H=[['life','生活','旅遊分享','照片與費用','別放他人的個資與臉部照片',B],['auto','智慧自動化','產線成果簡報','前後對照數字','每個數字回到原始資料核對',Y],['wind','風能運維','季度運維檢討','故障與備品','設備動作與決策由人員確認',G]];
  H.forEach((r,i)=>{const a=seg(u,.04+i*.14,.16+i*.14),x=60+i*500;
   alphaDo(a,()=>{card(x,170,480,470,{bg:'rgba(7,27,39,.78)',st:r[5],lw:2});caseTag(x+24,192,r[0],1);
    wt(x+24,270,r[2],23,'#fff',700);ln([x+24,300,x+456,300],KC.border,1);
    wt(x+24,344,'檢查項目',16,SUBC,700);para(x+24,380,r[3],432,21,KC.text,700,30);
    ln([x+24,450,x+456,450],KC.border,1);wt(x+24,490,'把關重點',16,SUBC,700);para(x+24,526,r[4],432,20,r[5],700,29);});});
  alphaDo(seg(u,.62,.72),()=>{card(60,670,1480,64,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(800,710,'不建議未經審閱直接交出最終版，也不建議放入高度敏感資料',20,O,700,'center');});
  alphaDo(seg(u,.82,.92),()=>human(60,760,1,'人審閱後再交付'));
 }}
]};
