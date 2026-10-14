// KITS: claude
/* 019-project-dev-ep01 — 從想法到規格
   Claude AI 應用動畫館｜專案開發 第 1 集
   依 code.claude.com（Best practices、Permission modes：plan mode 唯讀探索、核准後才實作）查證，資訊截至 2026-10 */

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
const EP={no:1,slug:'project-dev',t:'從想法到規格',en:'From Idea to Spec',
seriesName:'專案開發',total:8,
lede:'想法再好，直接叫 Claude 寫程式，常常做出來不是你要的。先請 Claude 用訪談的方式反問你，再整理成使用者故事、一份 PRD、範圍與優先順序，最後寫下驗收條件。這一集用社區活動報名網站、產線異常通報系統與風場運維 App 示範，規格由你確認。',
facts:[['先問','再動手','請 Claude 反問補齊需求，不急著寫程式'],['3 要素','誰、要什麼、為什麼','使用者故事的基本句型'],['砍範圍','先做最小版本','區分一定要做、之後再做、這次不做'],['可檢查','驗收條件','寫成「給定、當、則」，做完能逐條對照'],['人拍板','需求與優先順序','Claude 給草稿與建議，決定在你']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「請 Claude 先反問、先規劃再實作」的做法依 Claude Code 文件（code.claude.com Best practices 與 Permission modes：計畫模式為唯讀，探索與提出計畫，核准後才修改檔案）整理，資訊截至 2026-10；功能與介面仍在調整，請以官方最新說明為準。活動報名、產線異常通報與風場運維 App 的需求、欄位、數字均為虛構的示意或典型範例，並非任何特定單位、公司或案場資料；AI 提供分析與建議，停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 訪談（生活） */
{t:'訪談式提問釐清需求',en:'Interview-style questions',dur:14,
 d:'社區想辦活動，要做一個報名網站。如果直接說「幫我做報名網站」，Claude 只能猜。更好的做法是請它先反問你：活動有幾場？名額多少？要收費嗎？要不要候補？把問題一個個回答完，需求才會變清楚。',
 s:[[0,'直接要程式，Claude 只能猜'],[.4,'請 Claude 先反問你'],[.74,'回答完，需求才清楚']],
 draw(u){
  sceneBG();
  winFrame(60,150,900,650,'對話（示意）');caseTag(84,208,'life',1);
  alphaDo(seg(u,.02,.14),()=>{bub(90,250,840,'社區要辦活動，我想做報名網站。先別寫程式，請你一次問我一個問題。','user',1);});
  alphaDo(seg(u,.36,.5),()=>{bub(90,400,840,'活動有幾場？每場名額多少？','ai',1);});
  alphaDo(seg(u,.55,.66),()=>{bub(90,520,840,'三場，每場 30 人，額滿要候補','user',1);});
  alphaDo(seg(u,.68,.8),()=>{bub(90,640,840,'要收費嗎？要不要寄確認信？','ai',1);});
  card(1000,150,540,650,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(1030,202,'已釐清的需求',23,Y,800);
  [[.5,'3 場活動'],[.6,'每場 30 人'],[.66,'額滿候補'],[.84,'免費・寄確認信']].forEach((r,i)=>alphaDo(seg(u,r[0],r[0]+.1),()=>{card(1030,230+i*86,480,70,{bg:'rgba(255,255,255,.05)',st:G});check(1060,265+i*86,true,G);wt(1088,272+i*86,r[1],20,KC.text,600);}));
  alphaDo(seg(u,.88,.97),()=>human(1030,700,1,'答案由你決定'));
 }},
/* 2 使用者故事（智慧自動化） */
{t:'使用者故事',en:'User stories',dur:14,
 d:'接著把需求寫成使用者故事：身為誰，我想要什麼，好讓我達成什麼。以產線異常通報系統為例，操作員要快速通報，班長要看到優先順序，維修人員要知道哪台機、什麼現象。每個角色一句話，目標就不會互相打架。',
 s:[[0,'產線異常通報的三種角色'],[.4,'身為誰、想要什麼、為了什麼'],[.76,'Claude 起草，你修正']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  [['操作員','我想用手機三步內通報異常','好讓設備盡快被處理',B],['班長','我想看到依嚴重度排序的清單','好讓我先處理影響最大的',Y],['維修人員','我想看到機台編號與現象','好讓我帶對工具與備品',G]].forEach((r,i)=>alphaDo(seg(u,.02+i*.12,.14+i*.12),()=>{
   card(60,210+i*190,1000,170,{bg:'rgba(7,27,39,.85)',st:r[3],lw:2});tag(86,232+i*190,r[0],{size:18,bg:r[3]});
   wt(86,300+i*190,'身為'+r[0],18,SUBC,600);wt(86,336+i*190,r[1],22,'#fff',800);wt(86,368+i*190,r[2],19,r[3],700);}));
  alphaDo(seg(u,.4,.54),()=>{card(1100,210,440,330,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(1130,258,'句型',23,Y,800);['身為〔誰〕','我想要〔做什麼〕','好讓〔為什麼〕'].forEach((s,i)=>{card(1130,282+i*72,380,56,{bg:'rgba(255,255,255,.05)',st:[B,G,Y][i]});wt(1154,320+i*72,s,19,KC.text,700);});});
  alphaDo(seg(u,.76,.88),()=>{card(1100,570,440,100,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(1124,612,'草稿可能漏角色，請你補上',390,19,O,700,28);});
  alphaDo(seg(u,.86,.97),()=>human(1100,700,1,'角色與目標由你確認'));
 }},
/* 3 PRD 結構（風能，圖解） */
{t:'PRD 結構',en:'Structure of a PRD',dur:14,
 d:'故事夠多了，就整理成一份產品需求文件，簡稱 PRD。結構很固定：背景與目標、使用者與角色、功能需求、不做的事、成功指標。風場運維 App 的角色有技師、值班與主管，各自看到的畫面與權限都不同，寫進 PRD 後，Claude 才有依據。',
 s:[[0,'PRD 的五個區塊'],[.42,'風場運維 App 的三種角色'],[.78,'Claude 以 PRD 為依據']],
 draw(u){
  diagBG();floatParticles(8,31);caseTag(60,150,'wind',1);
  [['1 背景與目標',B],['2 使用者與角色',G],['3 功能需求',Y],['4 不做的事',O],['5 成功指標',P]].forEach((r,i)=>alphaDo(seg(u,.02+i*.06,.12+i*.06),()=>{card(60,200+i*100,560,84,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(88,252+i*100,r[0],23,r[1],800);}));
  alphaDo(seg(u,.42,.56),()=>{arrow(630,420,670,420,Y,4);
   [['技師','看今日工單、回報巡檢',B],['值班','看警報、指派工單',Y],['主管','看報表、核准排程',G]].forEach((r,i)=>{card(680+i*290,200,270,320,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(710+i*290,256,r[0],25,r[2],800);para(710+i*290,306,r[1],215,19,KC.text,600,28);});
   wt(680,570,'角色不同，畫面與權限也不同',21,Y,700);});
  alphaDo(seg(u,.78,.88),()=>{card(680,610,860,70,{bg:'rgba(255,255,255,.05)',st:B});wt(706,654,'PRD 寫好後，每個功能都能追溯到某個角色的需求',20,KC.text,600);});
  alphaDo(seg(u,.88,.97),()=>human(680,720,1,'PRD 內容由你審閱定稿'));
 }},
/* 4 範圍與優先順序（生活＋智慧自動化，圖解） */
{t:'範圍與優先順序',en:'Scope and priorities',dur:14,
 d:'功能永遠比時間多，所以要分類：這次一定要做、有空再做、這次不做。社區報名網站先做報名與確認信，候補名單放後面，線上付款不做。產線通報系統先做通報與清單，趨勢報表之後再說。最小可用版本先上線，比什麼都想做更快。',
 s:[[0,'三個箱子：必做、之後、不做'],[.42,'兩個專案各自分類'],[.78,'先做最小可用版本']],
 draw(u){
  sceneBG();
  [['這次必做',G],['之後再做',Y],['這次不做',O]].forEach((r,i)=>{card(60+i*500,170,480,60,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(90+i*500,210,r[0],23,r[1],800);});
  alphaDo(seg(u,.1,.5),()=>{
   caseTag(60,260,'life',1);
   [['報名表單、確認信',0,G],['候補名單',1,Y],['線上付款',2,O]].forEach(r=>{card(60+r[1]*500,300,480,70,{bg:'rgba(255,255,255,.05)',st:r[2]});wt(86+r[1]*500,345,r[0],21,KC.text,600);});});
  alphaDo(seg(u,.42,.7),()=>{
   caseTag(60,420,'auto',1);
   [['通報、異常清單',0,G],['趨勢報表',1,Y],['自動下指令給 PLC',2,O]].forEach(r=>{card(60+r[1]*500,460,480,70,{bg:'rgba(255,255,255,.05)',st:r[2]});wt(86+r[1]*500,505,r[0],21,KC.text,600);});});
  alphaDo(seg(u,.76,.88),()=>{card(60,590,1480,90,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,646,'最小可用版本先上線，再依使用情形加功能',23,'#fff',800);});
  alphaDo(seg(u,.88,.97),()=>human(60,730,1,'取捨由你決定；控制 PLC 要人員確認'));
 }},
/* 5 驗收條件（智慧自動化＋風能） */
{t:'驗收條件',en:'Acceptance criteria',dur:14,
 d:'規格最後要寫驗收條件，也就是做完怎麼檢查。寫法是：給定某個情況，當發生某件事，則應該出現什麼結果。產線通報：給定操作員已登入，當送出通報，則班長清單在十秒內出現。風場 App：當值班收到警報，則可一鍵建立工單。條件可檢查，才能交給測試。',
 s:[[0,'給定、當、則'],[.4,'產線通報的條件'],[.7,'風場 App 的條件']],
 draw(u){
  sceneBG();
  card(60,170,500,420,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,222,'驗收條件寫法',23,Y,800);
  [['給定','先決條件',B],['當','發生的動作',G],['則','可檢查的結果',O]].forEach((r,i)=>{card(90,250+i*100,440,84,{bg:'rgba(255,255,255,.05)',st:r[2]});wt(112,300+i*100,r[0],26,r[2],800);wt(200,300+i*100,r[1],20,KC.text,600);});
  alphaDo(seg(u,.4,.54),()=>{caseTag(600,170,'auto',1);card(600,210,940,170,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});
   [['給定','操作員已登入'],['當','送出一筆異常通報'],['則','班長清單於 10 秒內出現（示意）']].forEach((r,i)=>{wt(630,262+i*46,r[0],21,[B,G,O][i],800);wt(710,262+i*46,r[1],21,KC.text,600);});});
  alphaDo(seg(u,.7,.82),()=>{caseTag(600,410,'wind',1);card(600,450,940,170,{bg:'rgba(7,27,39,.85)',st:G,lw:2});
   [['給定','值班已收到高風速警報'],['當','按下「建立工單」'],['則','工單帶入機組編號與警報內容']].forEach((r,i)=>{wt(630,502+i*46,r[0],21,[B,G,O][i],800);wt(710,502+i*46,r[1],21,KC.text,600);});});
  alphaDo(seg(u,.84,.97),()=>{card(600,660,940,70,{bg:'rgba(255,255,255,.05)',st:B});wt(626,704,'每條都可檢查，才能交給測試',21,KC.text,600);human(60,640,1,'條件需你確認是否合理');});
 }},
/* 6 計畫模式與三情境（圖解） */
{t:'規格交給 Claude Code',en:'Handing the spec to Claude Code',dur:13,
 d:'規格寫好，就能交給 Claude Code。先用計畫模式，它只讀取與規劃、不改檔，提出方案讓你確認，核准後才開始實作。三個專案，同一套做法：先問、寫故事、整理 PRD、分範圍、定驗收。下一集，我們就進入 Claude Code。',
 s:[[0,'規格就緒，先進計畫模式'],[.42,'三個專案，同一套做法'],[.8,'下一集：Claude Code 入門']],
 draw(u){
  diagBG();floatParticles(8,37);
  pipe(60,170,['訪談','故事','PRD','範圍','驗收'],seg(u,.02,.3),[B,G,Y,P,O]);
  alphaDo(seg(u,.4,.54),()=>{
   [['生活','社區報名網站',B],['智慧自動化','產線異常通報',Y],['風能運維','風場運維 App',G]].forEach((r,i)=>{card(60+i*500,330,480,150,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,350,r[0],{size:17,bg:r[2]});wt(86+i*500,430,r[1],24,'#fff',800);});});
  alphaDo(seg(u,.6,.74),()=>{card(60,520,1480,130,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,568,'計畫模式：只讀取與規劃，核准後才實作',24,G,800);wt(90,612,'規格是給 Claude 的依據，也是你檢查成果的標尺',20,SUBC,600);});
  alphaDo(seg(u,.86,.97),()=>human(60,700,1,'核准計畫的人是你'));
 }}
]};
