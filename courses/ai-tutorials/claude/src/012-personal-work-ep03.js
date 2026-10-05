// KITS: claude
/* 012-personal-work-ep03 — 文件寫作與改寫
   Claude AI 應用動畫館｜個人工作 第 3 集
   依 support.claude.com（Styles 風格、建立與編輯檔案）查證，資訊截至 2026-10 */

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

function strike(x,y,w,col){ln([x,y,x+w,y],col,2.5);}
const EP={no:3,slug:'personal-work',t:'文件寫作與改寫',en:'Writing & Rewriting',
seriesName:'個人工作',total:8,
lede:'先排大綱、再生成初稿，接著改寫成精簡、正式或易讀的版本，套用報告與公文結構，最後比較版本差異：這一集用活動企劃、設備 SOP 與風機巡檢報告，示範 Claude 怎麼陪你把文件寫好。',
facts:[['先大綱','再初稿','大綱定好方向，初稿才不會寫偏'],['3','種改寫方向','精簡、正式、易讀，同一段內容可各出一版'],['4','種預設風格','Normal、Concise、Formal、Explanatory，另可自訂'],['Word','與 PDF','Claude 可建立並下載常見文件檔'],['人核可','再發布','SOP 與報告內容由負責人核對後才定稿']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。風格（Styles）與建立檔案功能依 Claude 說明中心（support.claude.com）整理，資訊截至 2026-10，實際以官方最新說明為準。活動企劃、SOP 步驟、巡檢內容與公文範例均為虛構的示意範例，並非任何特定公司、機關或案場資料，格式以各單位範本與程序為準；停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* ── 1 大綱先行（生活） ── */
{t:'大綱先行',en:'Outline first',dur:13,
 d:'寫文件前，先請 Claude 排出大綱，而不是直接要整篇。以社區中秋聚會的活動企劃為例，你只要說明活動目的、人數與預算，Claude 會列出背景、活動流程、分工與經費等段落。大綱出來後，你可以調整順序、刪掉不需要的段落，確認方向再往下寫，比寫完整篇再整個重來省時間。大綱只是草稿，取捨由你決定。',
 s:[[0,'先說明目的、人數與預算'],[.36,'Claude 列出大綱段落'],[.7,'你調整順序，確認方向再往下寫']],
 draw(u){
  diagBG();floatParticles(10,5);
  card(60,150,520,650,{bg:'rgba(7,27,39,.78)',st:B,lw:1.5});
  caseTag(84,172,'life',1);
  wt(84,250,'你提供的資訊（示意）',21,'#fff',700);
  [['活動','社區中秋聚會'],['人數','約 40 人'],['預算','示意：每人 100 元內']].forEach((r,i)=>{const a=seg(u,.04+i*.06,.12+i*.06);
   alphaDo(a,()=>{card(84,284+i*120,470,100,{bg:'rgba(255,255,255,.06)',st:'rgba(255,255,255,.15)'});wt(104,320+i*120,r[0],17,SUBC,600);para(104,352+i*120,r[1],430,19,'#fff',700);});});
  arrow(590,450,650,450,Y,3);
  card(660,150,880,650,{bg:'rgba(7,27,39,.78)',st:Y,lw:1.5});
  wt(690,196,'Claude 列出的大綱（草稿）',22,Y,700);
  const A=[['活動目的與背景',B],['流程與時間',G],['人員分工',Y],['經費預估','#b37cff'],['場地與安全',O]];
  const order=u>.64?[0,1,3,2,4]:[0,1,2,3,4];
  order.forEach((k,i)=>{const r=A[k],a=seg(u,.34+k*.06,.44+k*.06),y=236+i*80;
   alphaDo(a,()=>{circ(710,y+22,16,r[1],'none',0);wt(710,y+29,String(i+1),18,'#0e2133',800,'center');wt(742,y+30,r[0],21,'#fff',700);});});
  alphaDo(seg(u,.62,.72),()=>{card(1120,396,390,60,{bg:'rgba(242,194,48,.1)',st:Y,lw:1.5});wt(1315,433,'經費提前到第 3 項',18,Y,700,'center');});
  alphaDo(seg(u,.8,.9),()=>human(690,690,1,'確認方向，再往下寫'));
 }},
/* ── 2 初稿生成（智慧自動化） ── */
{t:'初稿生成',en:'Generating the first draft',dur:13,
 d:'大綱確定後，把你手上的素材貼給 Claude，請它依大綱寫出初稿。以設備作業指導書（SOP）為例，你提供換模的口頭步驟與注意事項，Claude 能整理成編號步驟與注意事項。它只用你給的內容，缺少的資訊會標成待補，而不是自行編造。初稿的步驟與數值，必須由熟悉設備的技術人員核對後才能發布。',
 s:[[0,'貼上素材，請它依大綱寫初稿'],[.36,'整理成編號步驟與注意事項'],[.7,'缺少的資訊標成待補，技術人員核對']],
 draw(u){
  sceneBG();
  winFrame(60,150,820,650,'Claude');
  caseTag(84,206,'auto',1);
  bub(160,250,700,'這是換模的口頭步驟與注意事項，請依大綱寫成作業指導書初稿，缺的資訊請標出來。','user',seg(u,.02,.1));
  bub(90,420,740,'初稿完成：5 個步驟、2 項注意事項。扭力值你沒有提供，我標成待補，沒有自行填數字。','ai',seg(u,.14,.24),Y);
  alphaDo(seg(u,.3,.38),()=>{['步驟','注意事項','待補'].forEach((t,i)=>tag(94+i*150,640,t,{size:17,bg:[G,B,O][i]}));});
  card(920,150,620,650,{bg:'rgba(7,27,39,.8)'});
  wt(950,196,'作業指導書草稿（示意）',22,Y,700);
  const R=[['1','確認機台已停止，並依單位程序上鎖掛牌',G],['2','卸下舊模具，放置於指定台車',G],['3','安裝新模具，鎖固螺栓',G],['4','鎖固扭力：待補',O],['5','試作首件，確認尺寸後再量產',G]];
  R.forEach((r,i)=>{const a=seg(u,.36+i*.07,.46+i*.07),y=226+i*92;
   alphaDo(a,()=>{card(950,y,560,80,{bg:r[2]===O?'rgba(232,87,42,.1)':'rgba(255,255,255,.05)',st:r[2]===O?O:'rgba(255,255,255,.15)',lw:r[2]===O?2:1});
    circ(978,y+40,14,r[2],'none',0);wt(978,y+46,r[0],16,'#0e2133',800,'center');
    para(1004,y+(wrapL(r[1],480,18,600).length>1?32:46),r[1],480,18,r[2]===O?O:KC.text,600,24);});});
  alphaDo(seg(u,.84,.94),()=>human(950,700,1,'技術人員核對後才發布'));
 }},
/* ── 3 三種改寫（風能運維＋生活＋自動化） ── */
{t:'改寫：精簡、正式、易讀',en:'Rewriting: concise, formal, plain',dur:14,
 d:'同一段內容，常需要不同的讀者版本。把原文貼給 Claude，指定「精簡」「正式」或「易讀」，它會各出一版：精簡保留重點，正式用於報告與公文，易讀把術語換成白話，給現場同仁或社區居民看。以風機巡檢的一句發現為例，三個版本的事實一致，只有語氣與長度不同。改寫後請確認沒有改動事實。',
 s:[[0,'貼上原文，指定改寫方向'],[.36,'精簡、正式、易讀各出一版'],[.7,'改寫後，確認事實沒有被改動']],
 draw(u){
  diagBG();floatParticles(8,9);
  caseTag(60,150,'wind',1);
  card(60,196,1480,120,{bg:'rgba(7,27,39,.78)',st:SUBC,lw:1.2});
  wt(84,230,'原文（示意）',17,SUBC,700);
  para(84,266,'巡檢時在 T05 葉片前緣看到一道裂紋，原因還不清楚，需要再確認嚴重程度，並決定要不要處理。',1420,20,'#fff',600);
  const V=[['精簡',B,'T05 葉片前緣有裂紋，建議儘快複查。'],['正式',Y,'經巡檢，T05 葉片前緣發現裂紋，建請儘速安排複查評估。'],['易讀',G,'T05 的葉片邊緣有一道裂縫。請盡快再檢查一次，看看嚴不嚴重。']];
  V.forEach((v,i)=>{const a=seg(u,.2+i*.12,.32+i*.12),x=60+i*500;
   alphaDo(a,()=>{card(x,350,480,330,{bg:'rgba(7,27,39,.78)',st:v[1],lw:2});tag(x+24,372,v[0],{size:19,bg:v[1]});
    para(x+24,452,v[2],432,21,'#fff',600,32);});});
  alphaDo(seg(u,.6,.7),()=>{wt(60,730,'使用情境',17,SUBC,700);caseTag(150,712,'life',1);caseTag(260,712,'auto',1);caseTag(430,712,'wind',1);
   wt(560,730,'心得與自傳、SOP、報告：三種版本都用得到',17,SUBC,600);});
  alphaDo(seg(u,.8,.9),()=>human(60,750,1,'確認事實沒有被改動'));
 }},
/* ── 4 報告與公文格式（風能運維＋生活） ── */
{t:'報告與公文格式',en:'Report and official-letter formats',dur:14,
 d:'有固定格式的文件，先告訴 Claude 結構，它就能依結構填入內容。巡檢報告常見的結構是摘要、巡檢範圍、發現、原因分析、建議與待確認事項。公文則有主旨、說明、辦法等段落，例如社區向管理單位申請借用場地。各單位的格式與用語有自己的規定，請把範本貼給 Claude，並以範本為準。',
 s:[[0,'先說明結構，Claude 依結構填入'],[.38,'報告與公文各有固定段落'],[.7,'以單位範本為準，請貼給 Claude']],
 draw(u){
  diagBG();
  card(60,150,760,650,{bg:'rgba(7,27,39,.75)',st:G,lw:1.5});
  caseTag(84,172,'wind',1);
  wt(84,250,'巡檢報告結構（示意）',21,'#fff',700);
  const S=[['摘要','一段話說明結果',G],['巡檢範圍','機組與日期',B],['發現','附照片編號',Y],['原因分析','列出依據與不確定處','#b37cff'],['建議','分輕重緩急',O]];
  S.forEach((r,i)=>{const a=seg(u,.04+i*.07,.12+i*.07),y=280+i*100;
   alphaDo(a,()=>{card(84,y,712,86,{bg:'rgba(255,255,255,.05)',st:r[2]});box(84,y,8,86,r[2],'none',0);wt(112,y+36,r[0],21,'#fff',700);wt(112,y+66,r[1],17,SUBC,500);});});
  card(860,150,680,650,{bg:'rgba(7,27,39,.75)',st:Y,lw:1.5});
  caseTag(884,172,'life',seg(u,.4,.48));
  wt(884,250,'公文結構（示意）',21,'#fff',700);
  const D=[['主旨','申請借用社區活動中心',Y],['說明','時間、人數與需求',B],['辦法','維護場地整潔並恢復原狀',G]];
  D.forEach((r,i)=>{const a=seg(u,.42+i*.1,.52+i*.1),y=294+i*120;
   alphaDo(a,()=>{tag(884,y,r[0],{size:19,bg:r[2]});card(884,y+34,630,64,{bg:'rgba(255,255,255,.05)',st:r[2]});para(904,y+74,r[1],590,18,KC.text,600);});});
  alphaDo(seg(u,.72,.82),()=>{card(884,650,630,56,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(904,684,'格式與用語依各單位規定，貼上範本請它照做',590,18,O,700);});
  alphaDo(seg(u,.86,.95),()=>human(884,728,1,'報告內容由負責人核對'));
 }},
/* ── 5 版本比較（智慧自動化） ── */
{t:'版本比較',en:'Comparing versions',dur:13,
 d:'文件改了幾輪之後，把舊版與新版都貼給 Claude，請它列出差異：哪些步驟新增、哪些刪除、哪些措辭改變。以設備 SOP 第一版與第二版為例，Claude 可以標出新增了首件確認、上鎖掛牌的說明更明確。差異整理能幫審核者快速找到要看的地方，但最後的審核與簽核，仍由負責人完成。',
 s:[[0,'貼上舊版與新版，請它比對'],[.38,'標出新增、刪除與改寫'],[.7,'審核與簽核，由負責人完成']],
 draw(u){
  diagBG();
  caseTag(60,150,'auto',1);
  card(60,196,560,590,{bg:'rgba(7,27,39,.75)'});
  wt(84,240,'SOP 第 1 版',21,'#fff',700);
  card(660,196,560,590,{bg:'rgba(7,27,39,.75)',st:Y,lw:1.5});
  wt(684,240,'SOP 第 2 版',21,Y,700);
  const V1=[['確認機台已停止',0],['卸下舊模具',0],['安裝新模具',0],['量產',1]];
  const V2=[['確認機台已停止，並依程序上鎖掛牌',2],['卸下舊模具',0],['安裝新模具',0],['試作首件並確認尺寸',2],['量產',0]];
  V1.forEach((r,i)=>{const y=284+i*100;alphaDo(seg(u,.04+i*.05,.12+i*.05),()=>{card(84,y,512,76,{bg:r[1]?'rgba(232,87,42,.1)':'rgba(255,255,255,.05)',st:r[1]?O:'rgba(255,255,255,.15)'});wt(104,y+46,r[0],19,KC.text,600);});});
  V2.forEach((r,i)=>{const y=284+i*100,col=r[1]?G:'rgba(255,255,255,.15)';alphaDo(seg(u,.12+i*.05,.2+i*.05),()=>{card(684,y,512,76,{bg:r[1]?'rgba(125,255,196,.1)':'rgba(255,255,255,.05)',st:col,lw:r[1]?2:1});
   const L=wrapL(r[0],470,19,600);L.forEach((s,k)=>wt(704,y+(L.length>1?32:46)+k*24,s,19,KC.text,600));});});
  alphaDo(seg(u,.4,.5),()=>{card(1260,196,280,280,{bg:'rgba(7,27,39,.8)',st:Y,lw:1.5});wt(1284,240,'Claude 的差異摘要',19,Y,700);
   [['新增',G,2],['刪除',O,0],['改寫',B,1]].forEach((r,i)=>{tag(1284,266+i*64,r[0],{size:16,bg:r[1]});wt(1500,292+i*64,String(r[2]),30,r[1],800,'right',COND);});});
  alphaDo(seg(u,.56,.66),()=>{card(1260,500,280,150,{bg:'rgba(125,255,196,.08)',st:G,lw:1.5});para(1280,540,'新增首件確認、上鎖掛牌說明更明確',240,17,G,700);});
  alphaDo(seg(u,.8,.9),()=>human(660,722,1,'審核與簽核由負責人完成'));
 }},
/* ── 6 風格與輸出檔案（生活） ── */
{t:'風格與輸出檔案',en:'Styles and file output',dur:13,
 d:'依 Claude 說明中心，風格（Styles）有四種預設：Normal、Concise、Formal、Explanatory，也能貼上自己的寫作範例，建立自訂風格。切換風格後，新的回覆與重試都會依目前的風格調整。寫完以後，Claude 可以建立並讓你下載 Word、PDF、Excel 等檔案。以個人心得與自傳為例，風格讓語氣貼近你，但事實與經歷仍要自己查證。',
 s:[[0,'四種預設風格，可切換'],[.36,'貼上寫作範例，建立自訂風格'],[.7,'輸出檔案，事實由你查證']],
 draw(u){
  diagBG();
  card(60,150,740,650,{bg:'rgba(7,27,39,.78)',st:B,lw:1.5});
  caseTag(84,172,'life',1);
  wt(84,250,'風格（Styles）',22,B,800);
  const St=[['Normal','預設回覆'],['Concise','簡短直接'],['Formal','清楚、嚴謹'],['Explanatory','為學習而說明']];
  St.forEach((s,i)=>{const a=seg(u,.04+i*.06,.12+i*.06),x=84+(i%2)*350,y=280+Math.floor(i/2)*120,on=i===2&&u>.2;
   alphaDo(a,()=>{card(x,y,330,100,{bg:on?'rgba(242,194,48,.12)':'rgba(255,255,255,.06)',st:on?Y:'rgba(255,255,255,.15)',lw:on?2:1});wt(x+20,y+42,s[0],21,on?Y:'#fff',700);wt(x+20,y+74,s[1],17,SUBC,500);});});
  alphaDo(seg(u,.36,.46),()=>{card(84,540,672,100,{bg:'rgba(255,255,255,.06)',st:P,lw:2});wt(104,580,'自訂風格',20,P,700);wt(104,614,'貼上你的寫作範例，Claude 學習語氣',18,KC.text,500);});
  alphaDo(seg(u,.5,.6),()=>para(84,690,'風格讓語氣貼近你，經歷與數字仍要自己核對',660,18,O,700));
  card(840,150,700,650,{bg:'rgba(7,27,39,.78)',st:Y,lw:1.5});
  wt(870,196,'輸出檔案（示意）',22,Y,700);
  [['心得草稿','DOCX',B],['自傳定稿','PDF',O],['經費表','XLSX',G]].forEach((f,i)=>{const a=seg(u,.64+i*.07,.74+i*.07),y=240+i*120;
   alphaDo(a,()=>{card(870,y,640,100,{bg:'rgba(255,255,255,.06)',st:f[2]});tag(894,y+30,f[1],{size:18,bg:f[2]});wt(1000,y+62,f[0],22,'#fff',700);wt(1490,y+62,'下載',18,SUBC,600,'right');});});
  alphaDo(seg(u,.86,.95),()=>human(870,640,1,'事實與經歷由你查證'));
 }}
]};
