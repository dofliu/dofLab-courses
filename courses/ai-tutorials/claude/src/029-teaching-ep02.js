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
/* 026-project-dev-ep08 — 用 API 打造 AI 應用
   Claude AI 應用動畫館｜專案開發 第 8 集
   依 Claude 開發者文件（Messages API：model、max_tokens、messages 必填，system 為頂層選填；Tool use：client tools 由應用程式執行，Claude 回 stop_reason tool_use，應用回傳 tool_result；Streaming：stream:true 以 SSE 逐段回傳；Prompt caching）與 Claude 支援文章（AI 驅動的 Artifact：使用量計入使用者自己的方案額度）查證，資訊截至 2026-10 */


/* 029-teaching-ep02 — 教材製作
   Claude AI 應用動畫館｜課程教學 第 2 集
   依 Claude 支援文章（Create and edit files with Claude：可在對話中產生 Excel、PowerPoint、Word、PDF 檔並下載或存到 Google Drive，是否可用依方案與設定而定；Artifacts：可產生互動內容並分享）查證，資訊截至 2026-10 */

const EP={no:2,slug:'teaching',t:'教材製作',en:'Creating Materials',
seriesName:'課程教學',total:8,
lede:'教學目標與評量定好之後，就要動手做教材。這一集用生活科技課、PLC 與感測器課、風機齒輪箱與葉片檢測課，示範怎麼請 Claude 把同一份內容改寫成不同程度的講義、整理成簡報與圖解、編出例題、做成互動教具，並提醒著作權與素材來源要自己把關。',
facts:[['講義分級','同一內容寫成基礎、標準、進階三版','依學生程度選用'],['簡報與圖解','Claude 可產生 PowerPoint、Word、PDF 檔','是否可用依方案與設定而定'],['例題','生活情境與產業情境各一，並附解答','解答由教師逐題驗算'],['互動教具','Artifacts 可做成可操作的網頁小工具','可分享給學生使用'],['著作權','引用圖文要註明出處','授權與來源由教師確認']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「Claude 可在對話中產生 Excel、PowerPoint、Word、PDF 檔，並可下載或存到 Google Drive，是否可用依方案與設定而定」依 Claude 支援文章整理；Artifacts 可產生互動內容並分享。資訊截至 2026-10，功能與方案仍在調整，請以官方最新說明為準。課程名稱、例題數值、梯形圖、感測器讀值與巡檢紀錄均為虛構的示意或典型範例，並非任何特定學校、課程或案場資料。AI 提供草案與建議；教材內容與解答、引用素材的著作權與授權，以及涉及設備操作的實習安全要求（例如上鎖掛牌、齒輪箱與葉片檢測的作業安全），一律由教師與現場人員確認。',
shots:[
/* 1 講義分級（生活，圖解） */
{t:'同一內容，三種難度',en:'One topic, three levels',dur:14,
 d:'同一個主題，學生程度不一樣，講義就該不一樣。把你的原始教材交給 Claude，請它依基礎、標準、進階寫成三個版本：基礎版多用生活例子和圖示，標準版是課本程度，進階版加入推導與延伸題。以國中生活科技的「電路與燈泡」為例，三版都由教師審閱後再發給學生。',
 s:[[0,'原始教材交給 Claude'],[.4,'寫成基礎、標準、進階三版'],[.76,'教師審閱後再發']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.22),()=>{slideBox(60,210,360,300,'原始教材',1,Y,['電路與燈泡','課本第三章']);});
  alphaDo(seg(u,.24,.4),()=>{arrow(440,360,520,360,Y,4);node(530,315,170,90,'Claude',Y,1);arrow(710,360,780,360,Y,4);});
  alphaDo(seg(u,.42,.7),()=>{
   [['基礎版',B,['生活例子與圖示','少公式']],['標準版',G,['課本程度','基本例題']],['進階版',P,['推導與延伸題','開放問題']]].forEach((r,i)=>{
    slideBox(790+i*250,210+(2-i)*0,230,300,r[0],1,r[1],r[2]);});});
  alphaDo(seg(u,.72,.9),()=>{wt(60,600,'示意：以「電路與燈泡」為例',20,SUBC,700);bar(60,640,700,16,.8,B);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'發給學生前，由教師審閱'));
 }},
/* 2 簡報與圖解（風能運維，圖解） */
{t:'簡報與圖解',en:'Slides and diagrams',dur:14,
 d:'講義之後是簡報。請 Claude 把教材拆成一頁一個重點，並建議每頁放什麼圖。Claude 可以在對話中直接產生 PowerPoint、Word 或 PDF 檔，再下載或存到 Google Drive；是否可用依你的方案與設定而定。以風機齒輪箱檢測課為例，先列出簡報大綱，再補上油液、振動與內視鏡檢查的示意圖，圖要自己再核對。',
 s:[[0,'教材拆成一頁一重點'],[.4,'每頁建議配圖'],[.76,'可產生檔案，圖由教師核對']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.3),()=>{wt(60,230,'簡報大綱（示意）',20,B,800);
   ['1 齒輪箱功能','2 常見異常','3 油液檢查','4 振動分析','5 作業安全'].forEach((s,i)=>{box(60,250+i*58,470,48,'rgba(255,255,255,.06)',B,1.5);wt(80,282+i*58,s,20,'#fff',700);});});
  alphaDo(seg(u,.34,.62),()=>{arrow(550,380,630,380,Y,4);
   slideBox(640,230,420,290,'油液檢查',1,Y,['取樣位置','顏色與金屬屑','送驗與趨勢']);
   slideBox(1090,230,450,290,'振動分析',1,G,['頻譜示意圖','與基準比較']);});
  alphaDo(seg(u,.66,.86),()=>{
   [['PowerPoint',Y],['Word',B],['PDF',O]].forEach((r,i)=>{fileTag(640+i*200,570,180,r[0],r[1]);});
   wt(640,640,'可下載或存到 Google Drive（依方案與設定）',19,SUBC,600);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'圖與數據由教師核對'));
 }},
/* 3 例題（生活＋智慧自動化，圖解） */
{t:'例題與生活情境',en:'Worked examples',dur:14,
 d:'好的例題要貼近學生。請 Claude 同一個概念各出一題：生活版和產業版。例如歐姆定律，生活版算手電筒電池的電流，產業版算感測器輸出電流。再請它附上解答步驟。解答一定要自己驗算，AI 的算術和單位有時會出錯。',
 s:[[0,'同一概念出兩種題'],[.4,'生活版與產業版'],[.76,'解答要驗算']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);caseTag(210,150,'auto',1);
  alphaDo(seg(u,.02,.22),()=>{card(60,200,420,90,{bg:'rgba(242,194,48,.08)',st:Y,lw:2});wt(90,255,'概念：歐姆定律',24,Y,800);});
  alphaDo(seg(u,.26,.5),()=>{
   card(60,330,720,230,{bg:'rgba(88,184,208,.08)',st:B,lw:2});wt(90,376,'生活版',20,B,800);para(90,414,'手電筒用 3 V 電池，燈泡電阻 6 Ω，電流是多少？',660,21,'#fff',700,32);
   card(820,330,720,230,{bg:'rgba(242,194,48,.08)',st:Y,lw:2});wt(850,376,'產業版',20,Y,800);para(850,414,'24 V 供電、負載電阻 1.2 kΩ，感測器迴路電流是多少？',660,21,'#fff',700,32);});
  alphaDo(seg(u,.56,.78),()=>{card(60,590,1480,90,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,646,'解答：I = V ÷ R，單位要換算（示意題目）',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'題目與解答，由教師逐題驗算'));
 }},
/* 4 互動教具（智慧自動化，圖解） */
{t:'動畫與互動教具',en:'Interactive teaching aids',dur:14,
 d:'有些概念用靜態圖講不清楚。請 Claude 用 Artifacts 做一個可以操作的小工具：例如 PLC 的輸入輸出模擬，學生按下按鈕，就看到輸出燈和梯形圖的接點跟著變。做好後可以分享連結給學生。要把它當練習工具，而不是控制真實設備。',
 s:[[0,'描述想要的教具'],[.4,'Artifacts 做出可操作工具'],[.76,'分享給學生，只用於模擬']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.22),()=>{bub(60,200,520,'做一個 PLC 輸入輸出模擬器：按下按鈕，輸出燈要亮','user',1);});
  alphaDo(seg(u,.26,.4),()=>{arrow(600,270,680,270,Y,4);});
  alphaDo(seg(u,.4,.72),()=>{winFrame(690,190,850,390,'互動教具（示意）');
   const on=seg(u,.52,.62)>.5?1:0;
   wt(730,262,'輸入 X0',19,SUBC,700);toggle(850,236,on);
   ln([740,330,1010,330],B,3);box(1010,306,10,48,B,'none',0);ln([1030,330,1260,330],B,3);
   wt(740,308,'X0',18,B,700);wt(1100,308,'Y0',18,G,700);
   circ(1330,330,26,on?G:'rgba(255,255,255,.12)',on?G:KC.border,2);
   wt(1330,400,on?'輸出亮':'輸出滅',20,on?G:SUBC,800,'center');
   wt(730,520,'梯形圖與燈號同步（示意）',19,SUBC,600);});
  alphaDo(seg(u,.76,.9),()=>{card(60,610,1480,80,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,662,'分享連結給學生練習；僅用於模擬，不連接真實設備',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'教具內容與使用方式，由教師確認'));
 }},
/* 5 著作權（風能運維，圖解） */
{t:'著作權與素材來源',en:'Copyright and sources',dur:14,
 d:'做教材最容易忽略的是著作權。課本、論文和網路圖片不能直接整段貼進教材；引用要註明出處，圖片要確認授權。Claude 產生的內容可能和既有資料相似，也可能出現不存在的來源，所以引用的文獻與圖片一定要自己查證。以風機葉片檢測教材為例，現場巡檢照片要去除廠商與案場資訊再使用。',
 s:[[0,'引用要註明出處'],[.4,'來源與授權自己查證'],[.76,'現場照片先去識別']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.32),()=>{
   [['引用文字','註明作者與出處',B],['網路圖片','確認授權範圍',Y],['AI 給的文獻','自己查證是否存在',O]].forEach((r,i)=>{
    card(60+i*500,210,480,150,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(90+i*500,262,r[0],24,r[2],800);wt(90+i*500,312,r[1],20,'#fff',600);});});
  alphaDo(seg(u,.4,.7),()=>{card(60,410,1480,200,{bg:'rgba(125,255,196,.06)',st:G,lw:2});wt(90,456,'葉片檢測教材：現場照片（示意）',22,G,800);
   box(90,480,260,110,'rgba(255,255,255,.08)',KC.border,1.5);wt(220,542,'原始照片',18,SUBC,700,'center');arrow(370,535,450,535,Y,4);
   box(460,480,260,110,'rgba(255,255,255,.08)',G,2);wt(590,542,'去除標示',18,G,700,'center');
   para(780,520,'移除廠商、案場、人員與座標資訊，再放進教材',700,21,'#fff',700,32);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'授權與來源，由教師確認'));
 }},
/* 6 回顧 */
{t:'教材製作回顧',en:'Recap',dur:13,
 d:'整理一下：同一份內容可以寫成三個難度；簡報與圖解、例題、互動教具都能請 Claude 起草；教師負責驗算、核對圖表、確認授權與安全。三個課程類型都適用。下一集是測驗與評量規準。',
 s:[[0,'教材製作五步'],[.5,'都能請 Claude 起草'],[.8,'下一集：測驗與評量規準']],
 draw(u){
  diagBG();floatParticles(8,81);
  alphaDo(seg(u,.02,.5),()=>{pipe(60,200,['講義分級','簡報圖解','例題','互動教具'],seg(u,.02,.5),[B,Y,G,P]);node(60+4*226,200,206,92,'著作權',O,seg(u,.4,.5),21);});
  alphaDo(seg(u,.5,.74),()=>{
   [['生活','電路與燈泡',B],['智慧自動化','PLC 與感測器課',Y],['風能運維','齒輪箱與葉片檢測課',G]].forEach((r,i)=>{card(60+i*500,380,480,120,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,398,r[0],{size:17,bg:r[2]});wt(86+i*500,472,r[1],22,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,600,'Claude 起草，教師驗算與把關',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'教材的正確性與授權，由教師負責'));
 }}
]};
