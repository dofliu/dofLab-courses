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

const EP={no:8,slug:'project-dev',t:'用 API 打造 AI 應用',en:'Building Apps with the API',
seriesName:'專案開發',total:8,
lede:'聊天視窗之外，還能用 API 把 Claude 放進自己的應用。一次呼叫由模型、輸出上限與訊息組成，系統提示詞設定角色與規則，工具讓 Claude 請你的程式去查資料，串流讓使用者更快看到字，成本則看輸入與輸出的 token。這一集用食譜問答、設備手冊問答與警報碼助理示範，最後看 Artifact 內的 AI 小工具。',
facts:[['Messages API','model、max_tokens、messages 必填','system 放在最上層，選填'],['系統提示詞','設定角色、規則與輸出格式','手冊內容放進訊息，附上出處'],['工具使用','Claude 提出呼叫，你的程式執行','結果用 tool_result 回傳'],['串流與成本','stream 逐段顯示，按 token 計費','快取重複前綴可省時省錢'],['Artifact 內呼叫','分享後用量算在使用者自己的方案','不需要 API 金鑰']],
note:'說明：本集為教育用途示意動畫，介面與程式片段為重新繪製的示意圖，非官方畫面。「Messages API 的 model、max_tokens、messages 為必填，system 為頂層選填參數；金鑰放在 x-api-key 標頭並指定 anthropic-version」「自訂工具由你的應用程式執行，Claude 回傳 stop_reason 為 tool_use 的 tool_use 區塊，你再以 tool_result 送回」「stream 設為 true 以伺服器推送事件逐段回傳」依 Claude 開發者文件（Messages API、Tool use、Streaming）整理；「分享 AI 驅動的 Artifact 時，使用量計入使用者自己的 Claude 方案額度、不需 API 金鑰」依 Claude 支援文章整理。資訊截至 2026-10，模型名稱、價格與功能仍在調整，請以官方最新說明為準。程式片段、手冊內容、警報碼、數值與用量均為虛構的示意或典型範例，並非任何特定單位、公司、機組或案場資料；金鑰請存在伺服器端、不要放進前端或公開儲存庫。AI 提供分析與建議，停機、上鎖掛牌與對 PLC 寫入或下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 API 呼叫結構（生活，圖解） */
{t:'一次 API 呼叫長什麼樣',en:'Anatomy of one API call',dur:14,
 d:'用 API，就是讓你的程式替使用者向 Claude 發問。請求有三個必填欄位：模型、輸出上限，和訊息陣列；系統提示詞放在最上層，是選填。以食譜問答小工具為例，使用者的問題放進訊息，送出後回來的是內容區塊、停止原因，和用了多少 token。金鑰放在請求標頭，要留在伺服器端。',
 s:[[0,'請求：模型、上限、訊息'],[.42,'回應：內容、停止原因、用量'],[.76,'金鑰留在伺服器端']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.22),()=>{winFrame(60,200,560,360,'請求（示意）');
   [['model',Y],['max_tokens',B],['system（選填）',P],['messages',G]].forEach((r,i)=>{box(86,258+i*66,508,52,'rgba(255,255,255,.06)',r[1],2);wt(104,292+i*66,r[0],21,r[1],800);});});
  alphaDo(seg(u,.3,.44),()=>{arrow(640,380,720,380,Y,4);node(730,330,220,100,'Claude',Y,1);arrow(960,380,1030,380,Y,4);});
  alphaDo(seg(u,.44,.62),()=>{winFrame(1040,200,500,360,'回應（示意）');
   [['content 內容區塊',G],['stop_reason',B],['usage 用量',P]].forEach((r,i)=>{box(1066,258+i*76,448,56,'rgba(255,255,255,.06)',r[1],2);wt(1084,294+i*76,r[0],21,r[1],800);});});
  alphaDo(seg(u,.5,.68),()=>{card(60,590,740,90,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,646,'使用者的問題放進 messages',22,G,800);});
  alphaDo(seg(u,.76,.9),()=>{card(830,590,710,90,{bg:'rgba(232,87,42,.08)',st:O,lw:2});para(860,634,'金鑰放在伺服器端，不放前端或公開儲存庫',650,21,O,800,30);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'金鑰與費用，由專案負責人管理'));
 }},
/* 2 系統提示詞（智慧自動化，RAG，圖解） */
{t:'系統提示詞：角色與規則',en:'System prompt: role and rules',dur:14,
 d:'系統提示詞決定這個應用「是誰、守什麼規則」。以設備手冊問答助理為例：系統提示詞寫明只依據提供的手冊段落回答，附上出處，找不到就說找不到。程式先從手冊裡找出相關段落，放進訊息裡，Claude 再回答，這就是檢索增強，也就是 RAG。有了規則，答案才有依據，不會憑空編造。',
 s:[[0,'系統提示詞：角色與規則'],[.4,'先檢索手冊段落，放進訊息'],[.76,'答案附出處，找不到就說找不到']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.2),()=>{winFrame(60,200,520,250,'system（示意）');
   ['你是設備手冊問答助理','只依據提供的段落回答','附上出處；找不到就說找不到'].forEach((s,i)=>wt(86,272+i*52,s,20,i==0?P:KC.text,700));});
  alphaDo(seg(u,.22,.4),()=>{fileTag(60,480,320,'手冊 §4.2 潤滑週期（示意）',B);fileTag(60,528,320,'手冊 §7.1 異常處置（示意）',B);arrow(400,520,470,520,Y,4);node(480,470,180,100,'檢索',Y,1);arrow(670,520,740,520,Y,4);});
  alphaDo(seg(u,.4,.58),()=>{winFrame(750,200,790,250,'messages（示意）');
   ['段落：§4.2 潤滑週期……','問題：這個軸承多久潤滑一次？'].forEach((s,i)=>wt(776,282+i*60,s,20,i?G:KC.text,700));});
  alphaDo(seg(u,.58,.76),()=>{arrow(1145,460,1145,500,Y,4);node(1000,510,290,90,'Claude',Y,1);});
  alphaDo(seg(u,.72,.88),()=>{card(750,620,790,80,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(776,672,'答案：依 §4.2 週期（示意），附出處',21,G,800);});
  alphaDo(seg(u,.88,.99),()=>human(60,730,1,'維護週期與作業，以現行手冊與現場規定為準'));
 }},
/* 3 工具使用（風能運維，圖解） */
{t:'工具使用：讓 Claude 請你查資料',en:'Tool use: Claude asks, your code runs',dur:14,
 d:'工具使用的重點是：Claude 提出呼叫，你的程式負責執行。以警報碼助理為例，你先定義一個查警報紀錄的工具，包含名稱、說明和輸入格式。使用者問起某個警報碼，Claude 回傳停止原因為 tool_use 的呼叫；你的程式去資料庫查，再把結果用 tool_result 送回，Claude 才整理成說明與建議。真正的停機與處置，由現場人員確認。',
 s:[[0,'定義工具：名稱、說明、輸入格式'],[.4,'Claude 提出呼叫，你的程式執行'],[.74,'tool_result 送回，整理成建議']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.18),()=>{winFrame(60,200,440,230,'tools（示意）');
   ['name: get_alarm_history','description: 查警報紀錄','input_schema: 警報碼'].forEach((s,i)=>codeLine(84,268+i*48,s,i?KC.text:B));});
  alphaDo(seg(u,.2,.36),()=>{card(60,460,440,70,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(84,505,'問：警報碼 E-17 是什麼？',20,'#fff',700);});
  alphaDo(seg(u,.36,.5),()=>{arrow(520,330,590,330,Y,4);node(600,280,200,100,'Claude',Y,1);arrow(820,330,890,330,Y,4);card(900,270,640,120,{bg:'rgba(179,124,255,.1)',st:P,lw:2});wt(926,316,'stop_reason: tool_use',21,P,800);wt(926,358,'請查 E-17 的紀錄',20,SUBC,600);});
  alphaDo(seg(u,.5,.64),()=>{arrow(1220,400,1220,450,Y,4);node(1000,460,440,90,'你的程式查資料庫',B,1);});
  alphaDo(seg(u,.64,.78),()=>{arrow(1000,505,940,505,Y,4);card(560,460,370,90,{bg:'rgba(125,255,196,.1)',st:G,lw:2});wt(580,512,'tool_result：紀錄（示意）',20,G,800);});
  alphaDo(seg(u,.78,.9),()=>{card(60,590,1480,100,{bg:'rgba(255,255,255,.05)',st:Y,lw:2});para(90,634,'Claude 整理成說明與建議；停機、上鎖掛牌與下指令給 PLC 不由 AI 執行',1420,22,Y,800,32);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'處置動作，由現場人員確認後執行'));
 }},
/* 4 串流、延遲與成本（生活，圖解） */
{t:'串流、延遲與成本',en:'Streaming, latency and cost',dur:14,
 d:'整段答案生成完才顯示，使用者會等得不耐煩。把串流打開，答案就會一段一段送來，字很快就出現。成本則是看輸入和輸出的 token：提示詞越長、答案越長，費用越高。要省，就設定合理的輸出上限，簡單的問題用小一點的模型，重複的長前綴可以用提示詞快取，省時間也省費用。',
 s:[[0,'串流：一段一段送來'],[.42,'成本看輸入與輸出 token'],[.76,'上限、模型、快取']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.2),()=>{card(60,200,700,100,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,248,'不串流：等整段完成才顯示',21,O,800);bar(90,268,640,14,0.3,O);});
  alphaDo(seg(u,.18,.4),()=>{card(60,320,700,150,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,368,'串流：stream 設為 true',21,G,800);
   const n=Math.floor(clamp((u-.2)/.2,0,1)*5);['先','把','洋','蔥','炒香'].slice(0,n).forEach((c,i)=>box(90+i*84,390,74,52,'rgba(255,255,255,.1)',G,2));
   ['先','把','洋','蔥','炒香'].slice(0,n).forEach((c,i)=>wt(127+i*84,426,c,21,'#fff',800,'center'));});
  alphaDo(seg(u,.42,.62),()=>{winFrame(800,200,740,270,'用量（示意）');
   [['輸入 token','提示詞＋對話',B],['輸出 token','答案長度',Y]].forEach((r,i)=>{box(826,262+i*80,688,64,'rgba(255,255,255,.06)',r[2],2);wt(846,290+i*80,r[0],21,r[2],800);wt(846,320+i*80,r[1],17,SUBC,600);});});
  alphaDo(seg(u,.62,.78),()=>{[['輸出上限',Y],['簡單問題用小模型',B],['提示詞快取',P]].forEach((r,i)=>{card(60+i*500,510,480,90,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(300+i*500,566,r[0],23,r[1],800,'center');});});
  alphaDo(seg(u,.78,.9),()=>{card(60,620,1480,70,{bg:'rgba(255,255,255,.05)',st:B,lw:1.5});wt(90,666,'快取重複的長前綴，可減少處理時間與費用',21,SUBC,700);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'預算與用量上限，由專案負責人設定'));
 }},
/* 5 在 Artifact 中呼叫 Claude（生活＋風能運維，圖解） */
{t:'在 Artifact 中呼叫 Claude',en:'Calling Claude inside an Artifact',dur:14,
 d:'不想自己架伺服器，也可以讓 Artifact 直接呼叫 Claude，做成 AI 驅動的小工具。例如食譜問答，或風場運維筆記整理器。分享給別人之後，大家直接就能用，不需要 API 金鑰，用量算在每位使用者自己的 Claude 方案額度，不是你的。適合做原型與小工具；要整合進公司系統、控制資料與費用，再改用 API。',
 s:[[0,'Artifact 直接呼叫 Claude'],[.42,'用量算在使用者自己的額度'],[.76,'原型用 Artifact，系統整合用 API']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);caseTag(210,150,'wind',1);
  alphaDo(seg(u,.02,.22),()=>{winFrame(60,200,560,300,'AI 小工具（示意）');
   wt(90,272,'食譜問答',24,Y,800);box(90,296,500,52,'rgba(255,255,255,.08)','rgba(255,255,255,.25)',1.5);wt(106,330,'冰箱只剩蛋和番茄，能做什麼？',19,'#fff',600);
   box(90,372,500,100,'rgba(125,255,196,.08)',G,2);wt(106,410,'番茄炒蛋，十分鐘完成（示意）',19,G,700);});
  alphaDo(seg(u,.28,.44),()=>{arrow(640,350,720,350,Y,4);card(730,300,300,100,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(880,360,'分享連結',23,Y,800,'center');arrow(1040,350,1110,350,Y,4);});
  alphaDo(seg(u,.44,.62),()=>{[0,1,2].forEach(i=>{circ(1160+i*120,330,34,'rgba(88,184,208,.18)',B,2);wt(1160+i*120,340,['用戶A','用戶B','用戶C'][i],16,'#fff',700,'center');});
   wt(1340,420,'各自登入使用',19,SUBC,700,'center');});
  alphaDo(seg(u,.46,.66),()=>{card(730,450,810,100,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(760,500,'不需要 API 金鑰',22,G,800);wt(760,536,'用量算在使用者自己的方案額度',19,SUBC,600);});
  alphaDo(seg(u,.76,.9),()=>{[['原型、小工具','Artifact',Y],['整合進系統、控管資料與費用','API',B]].forEach((r,i)=>{card(60+i*760,590,720,100,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(86+i*760,636,r[0],21,'#fff',700);wt(86+i*760,672,'→ '+r[1],20,r[2],800);});});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'要不要分享出去、給誰用，由你決定'));
 }},
/* 6 總結 */
{t:'把 Claude 放進你的應用',en:'Putting Claude into your app',dur:13,
 d:'整理一下：一次呼叫由模型、上限和訊息組成，系統提示詞設定規則，工具讓 Claude 請你的程式查資料，串流改善等待，成本看 token。食譜問答、設備手冊問答、警報碼助理，用的是同一套積木；要快速試作，也可以放進 Artifact。下一集是專案開發的測驗。',
 s:[[0,'呼叫、規則、工具、串流、成本'],[.46,'三個應用，同一套積木'],[.8,'下一集：專案開發測驗']],
 draw(u){
  diagBG();floatParticles(8,81);
  [['API 呼叫',Y],['系統提示詞',P],['工具使用',B],['串流與成本',G],['Artifact',O]].forEach((r,i)=>alphaDo(seg(u,.02+i*.06,.14+i*.06),()=>{card(60+i*300,180,270,110,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(195+i*300,246,r[0],26,r[1],800,'center');}));
  alphaDo(seg(u,.34,.44),()=>{wt(60,350,'AI 給建議，你的程式與人員負責執行與把關',22,O,700);});
  alphaDo(seg(u,.46,.72),()=>{
   [['生活','食譜問答：串流顯示',B],['智慧自動化','手冊問答：規則加出處',Y],['風能運維','警報碼助理：工具查紀錄',G]].forEach((r,i)=>{card(60+i*500,430,480,140,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,448,r[0],{size:17,bg:r[2]});para(86+i*500,520,r[1],430,21,'#fff',800,28);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,660,'小積木組合起來，就是你自己的 AI 應用',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'上線前的把關，由人員決定'));
 }}
]};
