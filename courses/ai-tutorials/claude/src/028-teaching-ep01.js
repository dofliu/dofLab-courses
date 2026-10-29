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


/* 028-teaching-ep01 — 逆向課程設計
   Claude AI 應用動畫館｜課程教學 第 1 集
   逆向設計（Wiggins & McTighe「Understanding by Design」：先定學習成果、再定評量證據、最後規劃學習活動）與 Bloom 認知分類（記憶、理解、應用、分析、評鑑、創造）為教學設計通用框架；Claude 功能依 Claude 支援文章（Projects：專屬知識庫與專案指示，專案指示為付費方案功能；Artifacts）查證，資訊截至 2026-10 */

const EP={no:1,slug:'teaching',t:'逆向課程設計',en:'Backward Course Design',
seriesName:'課程教學',total:8,
lede:'備課常常從「要教什麼內容」開始，逆向設計則反過來：先想學生學完要能做到什麼，再決定怎麼證明他們做到，最後才安排教學活動。這一集用生活科技專題課、產線自動化課與風機維護課，示範怎麼和 Claude 一起寫學習目標、先設計評量、拆解單元，再產出教案與課程地圖。',
facts:[['逆向三步','目標 → 評量證據 → 學習活動','先決定終點，再鋪路'],['學習目標','用動詞寫成「能做到什麼」','對照 Bloom 的認知層次'],['評量先行','先想好怎麼證明學會了','再設計教材與活動'],['Projects','放課程大綱與規準，每次對話都看得到','專案指示為付費方案功能'],['教師把關','Claude 產出草案','目標、評分與安全要求由教師決定']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。逆向設計（先學習成果、再評量證據、最後學習活動）出自 Wiggins 與 McTighe 的《Understanding by Design》；Bloom 認知分類為通用教學框架，其層次名稱與動詞舉例為整理性示意。「Projects 可放入知識庫檔案並在專案內的對話中使用」「專案指示為付費方案功能」依 Claude 支援文章整理。資訊截至 2026-10，功能與方案仍在調整，請以官方最新說明為準。課程名稱、單元、時數、評量項目與分數均為虛構的示意或典型範例，並非任何特定學校、課程或案場資料。AI 提供草案與建議；學習目標、評分標準與成績，以及涉及設備操作的實習安全要求（例如上鎖掛牌），一律由教師與現場人員確認。',
shots:[
/* 1 為什麼逆向（生活，圖解） */
{t:'為什麼要逆向設計',en:'Why design backward',dur:14,
 d:'一般備課是從教材開始：要教什麼、教多少，最後才想怎麼考。逆向設計把順序倒過來，先問學生學完要能做到什麼，再決定用什麼證據證明，最後才安排活動。以國中生活科技的專題課為例，終點是「學生能做出一個解決生活問題的作品」，所有內容都往這個終點對齊。',
 s:[[0,'傳統：教材、活動、最後考試'],[.42,'逆向：目標、證據、活動'],[.76,'以生活科技專題為終點']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.3),()=>{wt(60,230,'傳統備課',22,O,800);
   [['教材',O],['活動',O],['考試',O]].forEach((r,i)=>{node(60+i*290,250,250,90,r[0],r[1],1);if(i<2)arrow(312+i*290,295,346+i*290,295,O,3);});});
  alphaDo(seg(u,.4,.7),()=>{wt(60,400,'逆向設計',22,G,800);
   [['1 學習目標',Y],['2 評量證據',B],['3 學習活動',G]].forEach((r,i)=>{node(60+i*290,420,250,90,r[0],r[1],1);if(i<2)arrow(312+i*290,465,346+i*290,465,Y,3);});});
  alphaDo(seg(u,.72,.9),()=>{card(960,230,580,280,{bg:'rgba(88,184,208,.08)',st:B,lw:2});wt(990,284,'生活科技專題（示意）',22,B,800);
   para(990,330,'終點：學生能做出一個解決生活問題的作品',520,22,'#fff',700,32);});
  alphaDo(seg(u,.88,.99),()=>human(60,730,1,'終點要定在哪，由教師決定'));
 }},
/* 2 學習目標 Bloom（智慧自動化，圖解） */
{t:'把學習目標寫成動詞',en:'Writing objectives as verbs',dur:14,
 d:'好的學習目標用動詞描述學生能做到什麼，而不是「了解 PLC」這種模糊說法。對照 Bloom 的認知層次，從記憶、理解、應用，到分析、評鑑、創造。以產線自動化課為例，可以請 Claude 把「了解 PLC」改寫成「能依 I/O 表繪出梯形圖並完成模擬測試」，再標出屬於哪個層次。',
 s:[[0,'模糊目標：了解 PLC'],[.4,'改寫成可觀察的動詞'],[.76,'對照 Bloom 層次']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.22),()=>{card(60,200,620,120,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,250,'模糊：了解 PLC',24,O,800);wt(90,292,'看不出學生做到了沒有',19,SUBC,600);});
  alphaDo(seg(u,.26,.44),()=>{arrow(700,260,770,260,Y,4);node(780,215,180,90,'Claude',Y,1);arrow(970,260,1040,260,Y,4);});
  alphaDo(seg(u,.44,.62),()=>{card(1050,200,490,150,{bg:'rgba(125,255,196,.08)',st:G,lw:2});para(1076,248,'能依 I/O 表繪出梯形圖並完成模擬測試',440,21,G,800,30);});
  alphaDo(seg(u,.62,.9),()=>{['記憶','理解','應用','分析','評鑑','創造'].forEach((s,i)=>{const on=i===2;
   box(60+i*250,420,230,70+i*28,on?'rgba(125,255,196,.2)':'rgba(88,184,208,.12)',on?G:B,on?3:1.5);wt(175+i*250,462,s,22,on?G:'#fff',800,'center');});
   wt(60,640,'示意：上例屬「應用」層次',20,SUBC,700);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'目標是否合適，由教師判斷'));
 }},
/* 3 評量先行（風能運維，圖解） */
{t:'評量先行：想好怎麼證明',en:'Assessment first',dur:14,
 d:'目標定好之後，先別急著做教材，先想用什麼證據證明學生學會了。以風機維護課為例，目標是「能依巡檢報告判斷異常並寫出處置建議」，證據就是一份巡檢報告分析作業，加上一個情境判斷題。請 Claude 先草擬評量項目與規準，你再對照目標檢查有沒有對齊。涉及設備操作的實習，上鎖掛牌等安全要求一定要列進評量。',
 s:[[0,'目標：判斷異常、寫處置建議'],[.4,'證據：分析作業與情境題'],[.76,'安全要求列入評量']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.2),()=>{card(60,200,480,130,{bg:'rgba(242,194,48,.08)',st:Y,lw:2});wt(90,246,'目標',20,Y,800);para(90,284,'依巡檢報告判斷異常並寫出處置建議',420,20,'#fff',700,28);});
  alphaDo(seg(u,.24,.4),()=>arrow(560,265,640,265,Y,4));
  alphaDo(seg(u,.4,.62),()=>{winFrame(650,200,890,250,'評量項目（示意）');
   [['巡檢報告分析作業','40%',B],['情境判斷題','30%',P],['實習安全檢核','30%',G]].forEach((r,i)=>{box(676,262+i*58,838,48,'rgba(255,255,255,.06)',r[2],2);wt(694,294+i*58,r[0],20,r[2],800);wt(1490,294+i*58,r[1],20,r[2],800,'right');});});
  alphaDo(seg(u,.64,.84),()=>{card(60,480,1480,100,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,540,'實習含上鎖掛牌等安全要求：必須列入評量',22,G,800);});
  alphaDo(seg(u,.84,.92),()=>{wt(60,640,'數值為示意，非特定課程資料',19,SUBC,600);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'評分標準與安全要求，由教師確認'));
 }},
/* 4 單元拆解（生活＋智慧自動化，圖解） */
{t:'拆解單元與先備知識',en:'Breaking down units',dur:14,
 d:'有了目標和評量，就能倒推需要哪些單元。把課程交給 Claude，請它列出每個單元要先會什麼，找出前後依賴。例如生活科技專題課，要先學構想發想，才能畫草圖和做原型；產線自動化課，先有感測器與輸入輸出，才學得到梯形圖。你再依學生程度刪減和調整順序。',
 s:[[0,'從目標倒推單元'],[.42,'列出先備知識與依賴'],[.76,'依學生程度調整順序']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);caseTag(210,150,'auto',1);
  alphaDo(seg(u,.02,.4),()=>{wt(60,230,'生活科技專題（示意）',20,B,800);pipe(60,250,['發想','草圖','原型','測試'],seg(u,.02,.4),[B,Y,G,P]);});
  alphaDo(seg(u,.42,.7),()=>{wt(60,420,'產線自動化（示意）',20,Y,800);pipe(60,440,['感測器','I/O 表','梯形圖','模擬測試'],seg(u,.42,.7),[Y,B,G,P]);});
  alphaDo(seg(u,.72,.9),()=>{card(60,580,1480,100,{bg:'rgba(255,255,255,.05)',st:Y,lw:2});wt(90,640,'先備知識：前一步是後一步的基礎，順序可再調整',22,Y,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'單元取捨與順序，由教師決定'));
 }},
/* 5 產出教案（風能運維，圖解） */
{t:'產出教案草案',en:'Drafting the lesson plan',dur:14,
 d:'單元確定後，請 Claude 產出教案草案：目標、教學活動、時間分配和評量方式。你可以把課程大綱與評量規準放進 Projects 的知識庫，並在專案指示裡寫好課程名稱與學生程度，之後每次對話都不必重講。以風機維護課為例，草案可包含巡檢報告讀圖活動，並附上安全提醒。草案要再依現場調整。',
 s:[[0,'把大綱與規準放進 Projects'],[.42,'產出教案草案'],[.76,'附安全提醒，教師審閱']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.22),()=>{winFrame(60,200,500,330,'Projects（示意）');
   fileTag(86,262,440,'課程大綱（示意）',B);fileTag(86,314,440,'評量規準（示意）',B);
   box(86,370,440,100,'rgba(179,124,255,.1)',P,2);wt(104,404,'專案指示：',18,P,800);wt(104,440,'風機維護課，學生為技職生',18,SUBC,600);});
  alphaDo(seg(u,.3,.46),()=>{arrow(580,365,660,365,Y,4);node(670,320,180,90,'Claude',Y,1);arrow(860,365,930,365,Y,4);});
  alphaDo(seg(u,.46,.72),()=>{slideBox(940,200,600,330,'教案草案（示意）',1,G,['目標：判斷異常、寫建議','活動：巡檢報告讀圖 30 分','評量與安全提醒']);});
  alphaDo(seg(u,.76,.9),()=>{card(60,570,1480,100,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,630,'草案是起點：時間與難度，依現場再調整',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'教案內容與時數，由教師審閱'));
 }},
/* 6 課程地圖與總結 */
{t:'課程地圖與回顧',en:'Course map and recap',dur:13,
 d:'最後把目標、評量和單元對照成一張課程地圖，一眼看出每個目標都有評量，也有活動支撐。缺了哪一格，就補哪一格。整理一下：先定學習成果，再設計評量證據，最後安排活動，生活科技、產線自動化和風機維護課都適用。下一集是教材製作。',
 s:[[0,'課程地圖：目標、評量、單元'],[.46,'每個目標都對得上'],[.8,'下一集：教材製作']],
 draw(u){
  diagBG();floatParticles(8,81);
  alphaDo(seg(u,.02,.4),()=>{winFrame(60,170,1480,260,'課程地圖（示意）');
   cells(86,230,[300,380,380,320],['學習目標','評量證據','學習活動','狀態'],44,true);
   [['目標 1','作業','活動 A','已對齊'],['目標 2','情境題','活動 B','已對齊'],['目標 3','（缺）','活動 C','待補']].forEach((r,i)=>{
    const miss=i===2;cells(86,274+i*44,[300,380,380,320],r,44,false,miss?[null,[ 'rgba(232,87,42,.15)',O],null,['rgba(232,87,42,.15)',O]]:null);});});
  alphaDo(seg(u,.46,.72),()=>{
   [['生活','生活科技專題',B],['智慧自動化','產線自動化課',Y],['風能運維','風機維護課',G]].forEach((r,i)=>{card(60+i*500,470,480,120,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,488,r[0],{size:17,bg:r[2]});wt(86+i*500,562,r[1],22,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,650,'先定目標，再定證據，最後才排活動',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'最終的課程設計，由教師負責'));
 }}
]};
Object.assign(DICT,{});
