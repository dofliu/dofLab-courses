// KITS: claude
/* 003-claude-basics-ep02 — 好提示詞的五個要素
   Claude AI 應用動畫館｜入門基礎 第 2 集
   介面皆為示意重繪，非官方畫面。 */

/* ── 文字工具：先翻譯再換行（中日文逐字、英文逐詞） ───────────── */
function _fnt(size,weight,mono){const k=fit*cam.s,sz=Math.max(size,9.5/k);ctx.font=`${weight||500} ${sz}px ${mono?"'Barlow Condensed',monospace":FONT}`;return sz;}
function wrapL(t,size,maxW,weight,mono){
  t=tr(t);_fnt(size,weight,mono);
  const cjk=/[぀-ヿ㐀-鿿]/.test(t);
  const parts=cjk?Array.from(t):t.split(/(\s+)/);
  const out=[];let cur='';
  const NOSTART='。、，．）」』！？：；…ー';
  for(const p of parts){const nx=cur+p;if(ctx.measureText(nx).width>maxW&&cur.trim()&&!(cjk&&NOSTART.includes(p))){out.push(cur.trim());cur=p.trim()?p:'';}else cur=nx;}
  if(cur.trim())out.push(cur.trim());return out;
}
function para(x,y,t,size,col,maxW,lh,weight,mono,align){
  const L=wrapL(t,size,maxW,weight,mono);_fnt(size,weight,mono);
  ctx.fillStyle=col||'#fff';ctx.textAlign=align||'left';ctx.textBaseline='top';
  L.forEach((s,i)=>ctx.fillText(s,x,y+i*lh));ctx.textAlign='left';ctx.textBaseline='alphabetic';
  return L.length*lh;
}
function paraH(t,size,maxW,lh,weight,mono){return wrapL(t,size,maxW,weight,mono).length*lh;}

/* ── 示意對話面板：msgs=[{r:'user'|'ai', seg:[{t,c,mono}], a:出現進度}] ── */
function chatPanel(x,y,w,h,title,msgs,u,o={}){
  card(x,y,w,h,{bg:KC.winBg,st:KC.border,r:12});
  rrp(x,y,w,44,12);ctx.fillStyle=KC.winBar;ctx.fill();ln([x,y+44,x+w,y+44],KC.border,1);
  [KC.orange,KC.accent,KC.green].forEach((c,i)=>circ(x+20+i*18,y+22,5,c));
  wt(x+w/2,y+29,title,17,KC.text,600,'center');
  let by=y+62;const bw=w*(o.bw||.8),pad=14,sz=o.size||17,lh=Math.round(sz*1.5);
  msgs.forEach(m=>{
    const a=ease(seg(u,m.a,m.a+.06));if(a<=0)return;
    const isU=m.r==='user';let hh=26;
    m.seg.forEach(s=>{hh+=paraH(s.t,s.size||sz,bw-pad*2,lh,s.w,s.mono)+4;});
    hh+=8;const bx=isU?x+w-16-bw:x+16;
    alphaDo(a,()=>{
      rrp(bx,by,bw,hh,10);ctx.fillStyle=isU?KC.userBub:KC.aiBub;ctx.fill();
      wt(isU?bx+bw-pad:bx+pad,by+19,isU?'你':'Claude',12,isU?'#7dc8dc':KC.accent,700,isU?'right':'left');
      let ty=by+28;
      m.seg.forEach(s=>{ty+=para(bx+pad,ty,s.t,s.size||sz,s.c||KC.text,bw-pad*2,lh,s.w,s.mono)+4;});
    });
    by+=hh+12;
  });
  return by;
}
const tick_=(x,y,ok,a)=>alphaDo(a,()=>{circ(x,y,13,ok?'#7dffc4':'#e8572a');wt(x,y+1,ok?'✓':'✕',16,'#0e2133',800,'center',FONT,'middle');});

const EP={no:2,t:'好提示詞的五個要素',en:'Five Elements of a Good Prompt',
seriesName:'入門基礎',total:7,
lede:'同一個問題，問法不同，回答就差很多。本集拆解好提示詞的五個要素：角色、目標、脈絡、限制、格式與範例，並示範如何用具體的追問把回答修到剛好。',
facts:[
 ['5','個要素','角色、目標、脈絡、限制、格式與範例；缺什麼補什麼'],
 ['3–5','個範例','官方建議的範例數量，範例要貼近實際、彼此不同'],
 ['1','句','一句角色設定，就能改變回答的焦點與口吻'],
 ['30','%','長文件放前面、問題放最後，官方測試品質最多可提升約 30%'],
 ['1','位同事','黃金法則：沒有背景的同事看得懂，Claude 就看得懂']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，並非官方畫面；範例情境為虛構。提示技巧整理自 Anthropic 官方提示工程文件（platform.claude.com）、claude.com 部落格與 Claude Academy 課程。資訊截至 2026-09。',
shots:[
/* 1 ─ 模糊 vs 清楚（圖解：並排比較） */
{t:'模糊 vs 清楚的提問',en:'Vague vs clear',dur:14,
 d:'左邊只說「幫我寫一封信」，Claude 只能猜對象和用途，先給一份通用範本，再反問一連串問題。右邊一次說清楚身分、對象、目的、期限、語氣與字數，第一版就能直接使用。Anthropic 的官方文件把 Claude 比喻成「聰明但剛到職的新同事」：能力很好，但不知道你的背景與習慣。提供的資訊越明確，回答越貼近需求。',
 s:[[0,'同樣是請 Claude 寫信，只差在問法'],[.3,'模糊的提問，只能得到通用範本和反問'],[.55,'清楚的提問，第一版就接近可用'],[.78,'黃金法則：沒背景的同事看得懂，Claude 就看得懂']],
 draw(u){
  diagBG();
  chatPanel(60,150,700,440,'模糊的提問',[
   {r:'user',a:.04,seg:[{t:'幫我寫一封信。'}]},
   {r:'ai',a:.16,seg:[{t:'好的！以下是一封通用範本：「親愛的＿＿，您好……」'},{t:'請問收件人是誰？信件的目的與語氣是什麼？',c:KC.sub}]}],u);
  chatPanel(840,150,700,440,'清楚的提問',[
   {r:'user',a:.34,seg:[{t:'我是國中導師，要請家長在下週五前回覆校外教學同意書。語氣親切、200 字內，條列時間與地點。'}]},
   {r:'ai',a:.46,seg:[{t:'各位家長好：本班將於 10 月 17 日舉辦校外教學……'},{t:'• 時間：10/17（五）8:00–16:00',c:KC.green},{t:'• 地點：科學教育館',c:KC.green}]}],u);
  alphaDo(ease(seg(u,.24,.3)),()=>tag(410,630,'結果：通用範本＋反問',{align:'center',bg:'#e8572a',fg:'#fff',size:19}));
  alphaDo(ease(seg(u,.56,.62)),()=>tag(1190,630,'結果：第一版就接近可用',{align:'center',bg:'#7dffc4',size:19}));
  alphaDo(ease(seg(u,.76,.84)),()=>{card(220,690,1160,84,{bg:'rgba(242,194,48,.12)',st:'#f2c230'});
   wt(800,740,'黃金法則：把提示詞拿給不了解狀況的同事看，他看得懂，Claude 就看得懂',21,'#f2c230',700,'center');});
 }},

/* 2 ─ 五個要素的解剖（圖解：積木組合） */
{t:'提示詞的五塊積木',en:'Anatomy of a prompt',dur:13,
 d:'一個好提示詞可以拆成五塊：角色（你希望 Claude 以什麼身分回答）、目標（要交出什麼成果）、脈絡（對象、背景、用途）、限制（字數、語氣、不能做的事）、格式與範例（成品長什麼樣子）。五塊積木依序疊起，右邊就組成一段完整的提示詞。實際使用時不必每次都寫滿五項，簡單的問題一句就夠；結果不如預期時，先檢查少了哪一塊。',
 s:[[0,'把一段好提示詞拆開，是五塊積木'],[.22,'角色與目標：誰來回答、要交出什麼'],[.45,'脈絡與限制：背景資訊和邊界'],[.66,'格式與範例：讓成品長得像你要的樣子'],[.85,'不必每次寫滿，缺什麼補什麼']],
 draw(u){
  diagBG();
  const B=[['角色','你是國中導師的寫作助手','#f2c230'],['目標','寫一封請家長回覆同意書的信','#7dffc4'],['脈絡','家長多為上班族，常用手機閱讀','#58b8d0'],['限制','200 字內、語氣親切、不用術語','#e8572a'],['格式與範例','條列時間地點，參考附上的範例','#b37cff']];
  wt(80,190,'五個要素',22,'#f2c230',700);
  card(820,160,720,560,{bg:'rgba(7,27,39,.75)'});
  wt(850,202,'組合出來的提示詞',20,'#f2c230',700);
  let py=236;
  B.forEach((b,i)=>{
   const a0=.08+i*.14,k=ease(seg(u,a0,a0+.1));
   const y=230+i*96;
   alphaDo(k,()=>{
    const x=lerp(40,80,k);
    rrp(x,y,620,78,10);ctx.fillStyle=b[2]+'26';ctx.fill();ctx.strokeStyle=b[2];ctx.lineWidth=2;ctx.stroke();
    circ(x+36,y+39,20,b[2]);wt(x+36,y+40,String(i+1),20,'#0e2133',800,'center',COND,'middle');
    wt(x+72,y+32,b[0],21,b[2],700);
    para(x+72,y+44,b[1],17,'rgba(227,236,238,.85)',530,22);
   });
   const k2=ease(seg(u,a0+.06,a0+.14));
   if(k2>0)alphaDo(k2,()=>{connLine(700,y+39,840,py+14,{u:k2,col:b[2],lw:1.5,dash:true});
     rrp(850,py,6,Math.max(24,paraH(b[1],20,640,30)-4),3);ctx.fillStyle=b[2];ctx.fill();
     py+=para(866,py,b[1],20,KC.text,640,30)+18;});
   else py+=paraH(b[1],20,640,30)+18;
  });
  alphaDo(ease(seg(u,.84,.9)),()=>tag(1180,684,'缺什麼補什麼',{align:'center',size:19}));
 }},

/* 3 ─ 角色與目標（場景：示意對話） */
{t:'角色與目標',en:'Role and goal',dur:14,
 d:'角色決定回答的口吻與專業深度：同樣問「為什麼會下雨」，設定成國小自然老師，答案會用生活比喻和短句。目標則要寫成看得見的成果，例如「150 字」「給三年級學生」「最後出一題小問答」，而不是只說「解釋一下」。官方文件指出，即使只有一句角色設定也有明顯效果；在 Claude.ai 可以直接寫在訊息開頭，也可以放進專案指示裡重複使用。',
 s:[[0,'第一行先給角色：你是一位國小自然老師'],[.3,'第二行寫目標：字數、對象、要交出什麼'],[.55,'回答的口吻和深度，跟著角色改變'],[.8,'目標寫得越具體，越容易檢查成果']],
 draw(u){
  claudeBase();floatParticles(20,7);
  chatPanel(80,150,860,640,'Claude',[
   {r:'user',a:.03,seg:[{t:'【角色】你是一位國小自然老師。',c:'#f2c230',w:700},{t:'【目標】用 150 字向三年級學生解釋為什麼會下雨，最後出一題小問答。',c:'#7dffc4',w:700}]},
   {r:'ai',a:.4,seg:[{t:'小朋友，你有沒有看過媽媽煮湯時，鍋蓋上冒出小水珠？天空也一樣：太陽把海和河的水曬成看不見的水蒸氣，飄到高空變冷，又變回小水滴，聚成雲。水滴越聚越大、太重了，就掉下來變成雨。'},{t:'小問答：鍋蓋上的水珠，像天空裡的什麼？',c:'#f2c230'}]}],u,{bw:.84});
  const R=[[.2,'角色','決定口吻與專業深度','#f2c230'],[.34,'目標','說清楚要交出什麼成果','#7dffc4'],[.62,'可檢查','150 字？三年級？有小問答？','#58b8d0']];
  R.forEach(([a0,h,t,c],i)=>{const k=ease(seg(u,a0,a0+.08));alphaDo(k,()=>{
   const y=210+i*180;card(990,y,540,140,{bg:'rgba(7,27,39,.8)',st:c});
   wt(1020,y+46,h,24,c,800);para(1020,y+62,t,19,KC.text,480,28);});});
  alphaDo(ease(seg(u,.72,.8)),()=>{[['150 字',1040],['三年級',1200],['小問答',1360]].forEach(([s,x],i)=>{tick_(x,720,true,ease(seg(u,.74+i*.05,.8+i*.05)));wt(x+22,727,s,17,KC.text,600);});});
 }},

/* 4 ─ 脈絡與限制（圖解：漏斗） */
{t:'脈絡與限制條件',en:'Context and constraints',dur:14,
 d:'沒有脈絡時，Claude 面對的是一大片「可能的好答案」。補上對象、背景與用途，再加上字數、語氣、不能做的事等限制，可能的答案就像通過漏斗一樣被收斂。官方建議兩個小技巧：第一，說明原因，例如「這份說明要印給社區長輩看，所以避免英文縮寫」，比單說「不要用英文」更有效；第二，說清楚要做什麼，而不只是列出不要做什麼。',
 s:[[0,'沒有脈絡，可能的答案四散各處'],[.25,'補上對象、背景與用途，範圍開始收斂'],[.48,'再加上限制，只留下貼近需求的答案'],[.7,'附上原因，Claude 更懂得怎麼取捨']],
 draw(u){
  diagBG();
  const cx=420,top=200;
  // 漏斗
  const L1=ease(seg(u,.22,.32)),L2=ease(seg(u,.45,.55));
  poly([120,top,720,top,560,430,280,430],'rgba(88,184,208,.10)','rgba(88,184,208,.6)',1.6);
  poly([280,430,560,430,470,620,370,620],'rgba(232,87,42,.10)','rgba(232,87,42,.6)',1.6);
  box(370,620,100,60,'rgba(125,255,196,.14)','#7dffc4',1.6);
  wt(cx,184,'所有可能的回答',19,KC.sub,600,'center');
  alphaDo(L1,()=>tag(cx,352,'脈絡：對象・背景・用途',{bg:'#58b8d0',size:18,align:'center'}));
  alphaDo(L2,()=>tag(cx,470,'限制：字數・語氣・禁區',{bg:'#e8572a',fg:'#fff',size:18,align:'center'}));
  alphaDo(ease(seg(u,.6,.68)),()=>wt(cx,712,'貼近需求的回答',20,'#7dffc4',700,'center'));
  // 點點：依進度被過濾
  const r=rng(11);
  for(let i=0;i<46;i++){
   const px=140+r()*560,py=215+r()*50,keep1=r()<.45,keep2=r()<.5,ph=r();
   let x=px,y=py,a=1;
   const f1=L1,f2=L2;
   if(keep1){const tx=300+r()*240;x=lerp(px,tx,f1);y=lerp(py,300+ph*110,f1);
     if(keep2){x=lerp(x,380+r()*80,f2);y=lerp(y,500+ph*150,f2);} else {a=1-f2*.85;r();}}
   else {a=1-f1*.85;r();r();}
   alphaDo(a,()=>circ(x,y,5,keep1&&keep2&&f2>.5?'#7dffc4':'#7dc8dc'));
  }
  // 右卡：說明原因
  card(900,170,640,600,{bg:'rgba(7,27,39,.75)'});
  wt(930,214,'附上原因，效果更好',21,'#f2c230',700);
  const kA=ease(seg(u,.62,.7)),kB=ease(seg(u,.7,.78)),kC=ease(seg(u,.82,.9));
  alphaDo(kA,()=>{tick_(950,280,false,1);para(980,266,'不要用英文縮寫。',19,KC.text,520,28);});
  alphaDo(kB,()=>{tick_(950,372,true,1);para(980,358,'這份說明要印給社區長輩看，所以請避免英文縮寫，專有名詞用中文全稱。',19,KC.text,520,28);});
  alphaDo(kC,()=>{ln([930,520,1510,520],'rgba(255,255,255,.14)',1);
   wt(930,566,'說清楚「要做什麼」',20,'#7dffc4',700);
   para(930,584,'與其寫「不要用條列」，不如寫「請用流暢的段落敘述」。',18,'rgba(227,236,238,.85)',580,27);});
 }},

/* 5 ─ 輸出格式與範例（場景：示意對話） */
{t:'輸出格式與範例',en:'Format and examples',dur:14,
 d:'想要表格、條列或固定欄位，最可靠的方法是直接給一個範例。範例放在 <example> 標籤裡，能和指示清楚分開；官方建議提供 3 到 5 個、彼此不同而且貼近實際情境的範例。Claude 會模仿範例的欄位、順序與長度，所以範例本身也要檢查過。除了範例，也可以直接描述結構，例如「每段先寫粗體小標，再寫兩句說明」。',
 s:[[0,'直接告訴 Claude 成品的樣子'],[.25,'範例放進 <example> 標籤，和指示分開'],[.5,'回答照著範例的欄位與順序排好'],[.78,'官方建議 3–5 個範例，彼此不同、貼近實際']],
 draw(u){
  claudeBase();floatParticles(20,9);
  chatPanel(60,150,720,620,'Claude',[
   {r:'user',a:.03,seg:[{t:'把下面的行事曆整理成表格：日期 | 活動 | 負責人。'},
     {t:'<example>',c:'#b37cff',mono:true,size:19},{t:'10/3 | 家長日 | 王老師',c:'#b37cff',mono:false},{t:'</example>',c:'#b37cff',mono:true,size:19},
     {t:'（貼上的行事曆文字……）',c:KC.sub}]},
   {r:'ai',a:.42,seg:[{t:'已依範例整理如右表。'}]}],u,{bw:.86});
  // 右：輸出表格
  const k0=ease(seg(u,.44,.52));
  alphaDo(k0,()=>{
   card(840,170,700,420,{bg:'rgba(7,27,39,.82)',st:'#7dffc4'});
   wt(870,212,'輸出結果',20,'#7dffc4',700);
   const X=[870,1040,1300],HD=['日期','活動','負責人'];
   box(860,236,660,48,'rgba(125,255,196,.14)','none',0);
   HD.forEach((h,i)=>wt(X[i],268,h,19,'#7dffc4',700));
   const R=[['10/17','校外教學','陳老師'],['10/24','運動會','林老師'],['10/31','期中考','教務處']];
   R.forEach((r,j)=>{const a=ease(seg(u,.5+j*.07,.56+j*.07));alphaDo(a,()=>{
     const y=330+j*72;ln([860,y-26,1520,y-26],'rgba(255,255,255,.1)',1);
     wt(X[0],y+8,r[0],20,KC.text,600,'left',COND);wt(X[1],y+8,r[1],19,KC.text,500);wt(X[2],y+8,r[2],19,KC.text,500);});});
  });
  alphaDo(ease(seg(u,.76,.84)),()=>{card(840,620,700,150,{bg:'rgba(179,124,255,.12)',st:'#b37cff'});
   wt(870,664,'範例的三個原則',20,'#b37cff',700);
   [['貼近實際',880],['彼此不同',1100],['3–5 個',1320]].forEach(([s,x],i)=>{tick_(x,720,true,ease(seg(u,.8+i*.04,.86+i*.04)));wt(x+22,727,s,18,KC.text,600);});});
 }},

/* 6 ─ 迭代：追問與修正（圖解：迴圈） */
{t:'迭代：追問與修正',en:'Iterate: follow up and refine',dur:15,
 d:'第一版很少剛好完美，把它當成對話的起點。看完回答後給具體回饋：「再短一點」不如「刪掉前兩段，結尾改成一句行動呼籲」。每轉一圈，成品就更接近需求。如果對話已經偏離太遠，開一個新對話、把整理好的需求一次說清楚，通常比一直修補更快。重要的內容，可以請 Claude 附上來源或說明它有多確定。',
 s:[[0,'提問、看回答、給回饋、得到修正版'],[.3,'回饋要具體：指出哪裡改、改成什麼'],[.55,'每轉一圈，成品更接近需求'],[.8,'偏離太遠時，開新對話重新說清楚']],
 draw(u){
  diagBG();
  const cx=400,cy=470,R=190;
  const N=[['提問','?'],['看回答','◎'],['具體回饋','✎'],['修正版','✓']];
  const act=(TT*.5)%4;
  N.forEach((n,i)=>{
   const a=-Math.PI/2+i*Math.PI/2,x=cx+Math.cos(a)*R,y=cy+Math.sin(a)*R;
   const a2=a+Math.PI/2,x2=cx+Math.cos(a2)*R,y2=cy+Math.sin(a2)*R;
   const k=ease(seg(u,.02+i*.06,.1+i*.06));
   const on=Math.max(0,1-Math.abs(((act-i+4)%4)-.5)*1.4);
   if(k>0){const m=(p,q,t)=>lerp(p,q,t);const ang0=a+.34,ang1=a2-.34;
    agentArrow(cx+Math.cos(ang0)*R,cy+Math.sin(ang0)*R,cx+Math.cos(ang1)*R,cy+Math.sin(ang1)*R,{u:k,active:on*.8,col:'#f2c230'});}
   agentNode(x,y,46,n[0],{u:k,active:on,icon:n[1]});
  });
  wt(cx,cy+8,'迭代',28,'#f2c230',800,'center');
  // 右卡：回饋對照
  card(820,160,720,330,{bg:'rgba(7,27,39,.75)'});
  wt(850,202,'回饋要具體',21,'#f2c230',700);
  alphaDo(ease(seg(u,.28,.35)),()=>{tick_(870,256,false,1);para(900,242,'再短一點。',19,KC.text,600,28);});
  alphaDo(ease(seg(u,.36,.43)),()=>{tick_(870,334,true,1);para(900,320,'刪掉前兩段，結尾改成一句行動呼籲，全文 150 字內。',19,KC.text,600,28);});
  // 版本進度條
  const kB=ease(seg(u,.5,.58));
  alphaDo(kB,()=>{
   card(820,510,720,170,{bg:'rgba(7,27,39,.75)'});
   wt(850,550,'符合需求程度（示意）',19,'#f2c230',700);
   [['第 1 版',.45],['第 2 版',.72],['第 3 版',.92]].forEach(([s,v],i)=>{
    const f=ease(seg(u,.55+i*.07,.65+i*.07));const y=578+i*32;
    wt(850,y+17,s,17,KC.sub,600);box(960,y+3,540,16,'rgba(255,255,255,.08)','none',0);
    if(f>0)box(960,y+3,540*v*f,16,i===2?'#7dffc4':'#58b8d0','none',0);});
  });
  alphaDo(ease(seg(u,.8,.88)),()=>{tag(1180,730,'偏離太遠 → 開新對話',{align:'center',bg:'#e8572a',fg:'#fff',size:19});
   wt(1180,790,'重要內容：請 Claude 附上來源或說明確定程度',17,'rgba(227,236,238,.85)',500,'center');});
 }}
]};
