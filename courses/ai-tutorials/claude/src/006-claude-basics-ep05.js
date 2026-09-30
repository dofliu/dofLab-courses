// KITS: claude
/* 006-claude-basics-ep05 — 搜尋與深度研究（Search & Research）
   Claude AI 應用動畫館｜入門基礎 第 5 集
   介面皆為示意圖重新繪製，不含官方 logo 或截圖。 */

/* ── 共用小工具（本集自寫，不修改 kit） ── */
function wrapL(text,x,y,maxW,size,col,weight,lh,align){
  const t=tr(text);lh=lh||size*1.45;
  ctx.font=`${weight||500} ${size}px ${FONT}`;
  const isEN=LI===0;const lines=[];let cur='';
  const units=isEN?t.split(/(\s+)/):Array.from(t);
  const noStart='，。、；：？！）」』%…,.;:?!)';
  for(const w of units){
    const test=cur+w;
    if(ctx.measureText(test).width>maxW&&cur.trim()){
      if(!isEN&&noStart.indexOf(w)>=0){cur=test;continue;}
      lines.push(cur.trim());cur=isEN?w.trimStart():w;
    }else cur=test;
  }
  if(cur.trim())lines.push(cur.trim());
  lines.forEach((l,i)=>wt(x,y+i*lh,l,size,col,weight,align));
  return lines.length*lh;
}
function winFrame(x,y,w,h,title){
  rrp(x,y,w,h,12);ctx.fillStyle=KC.winBg;ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1.5;ctx.stroke();
  rrp(x,y,w,44,12);ctx.fillStyle=KC.winBar;ctx.fill();box(x,y+30,w,14,KC.winBar);
  ln([x,y+44,x+w,y+44],KC.border,1);
  [KC.orange,KC.accent,KC.green].forEach((c,i)=>circ(x+22+i*18,y+22,5,c));
  wt(x+w/2,y+29,title,17,KC.text,600,'center');
}
function bub(x,y,w,text,role,a,size){
  size=size||18;
  alphaDo(a,()=>{
    ctx.font=`500 ${size}px ${FONT}`;
    const t=tr(text);const lines=Math.max(1,Math.ceil(ctx.measureText(t).width/(w-32)));
    const h=lines*size*1.45+28;
    rrp(x,y,w,h,12);ctx.fillStyle=role==='user'?KC.userBub:KC.aiBub;ctx.fill();
    wrapL(text,x+16,y+14+size,w-32,size,KC.text,500);
  });
}
function cite(x,y,n,a,hot){
  alphaDo(a,()=>{rrp(x,y-15,30,22,6);ctx.fillStyle=hot?KC.accent:'rgba(242,194,48,.22)';ctx.fill();
    wt(x+15,y+1,String(n),15,hot?'#0e2133':KC.accent,700,'center',COND);});
}
function srcCard(x,y,w,title,sub,n,a,hot){
  alphaDo(a,()=>{
    rrp(x,y,w,74,10);ctx.fillStyle=hot?'rgba(242,194,48,.14)':'rgba(30,58,85,.85)';ctx.fill();
    ctx.strokeStyle=hot?KC.accent:KC.border;ctx.lineWidth=hot?2:1;ctx.stroke();
    cite(x+14,y+30,n,1,hot);
    wt(x+58,y+31,title,18,KC.text,700);
    wt(x+58,y+58,sub,15,KC.sub,500);
  });
}
function numCircle(x,y,n,col){circ(x,y,22,col);wt(x,y+8,String(n),22,'#0e2133',800,'center',COND);}

const EP={no:5,t:'搜尋與深度研究',en:'Search & Research',
seriesName:'入門基礎',total:7,
lede:'模型的知識停在訓練截止的那一刻。本集說明何時該讓 Claude 上網搜尋、搜尋與「研究」功能各自怎麼運作，以及拿到附引用的答案後，怎麼用三個問題查證來源。',
facts:[
 ['1–2','次','網頁搜尋適合的問題：一兩次搜尋就能回答的事實查詢'],
 ['5+','次','研究功能適合的問題：需要五次以上工具呼叫的綜合蒐集'],
 ['1–3','分鐘','官方說明中研究任務的典型進行時間'],
 ['5','小時','免費方案用量每 5 小時重置，搜尋與讀取網頁都會計入'],
 ['4','種方案','研究功能開放 Pro、Max、Team、Enterprise 付費方案'],
],
note:'說明：本集介面為示意圖，非官方畫面；範例問題、來源與報告內容皆為虛構示例。功能與方案依 support.claude.com〈Enable and use web search〉〈Use research on Claude〉〈When should I use web search, extended thinking, and research?〉整理，資訊截至 2026-09，實際以官方最新說明為準。',
shots:[
/* 1 ─ 知識截止（圖解） */
{t:'何時需要搜尋：知識截止',en:'When to search: the knowledge cutoff',dur:14,
 d:'語言模型從大量文字中學習，但訓練資料有一個截止時間點，之後發生的事模型並不知道。原理、定義、歷史背景這類不太變動的知識，模型本身就能回答；價格、最新版本、今天的新聞、現任負責人這類會變的資訊，就應該讓 Claude 上網搜尋，並附上來源讓你確認。判斷方法很簡單：答案會不會隨時間改變。',
 s:[[0,'模型的知識來自訓練資料'],[.3,'資料在某個時間點截止，之後是空白'],[.55,'不會變的知識，模型本身就能回答'],[.78,'會變的資訊，就該上網搜尋']],
 draw(u){
  diagBG();
  const X0=120,X1=1480,CUT=1010,Y=380;
  const g=ease(seg(u,.02,.3));
  // 訓練資料區：文件塊逐漸累積
  const R=rng(7);
  for(let i=0;i<46;i++){
    const px=X0+10+R()*(CUT-X0-30),py=Y-30-R()*110,a=seg(g,i/46*.9,i/46*.9+.1);
    alphaDo(a*.9,()=>{rrp(px,py,22,28,3);ctx.fillStyle=i%5===0?'rgba(125,255,196,.55)':'rgba(88,184,208,.5)';ctx.fill();});
  }
  ln([X0,Y,X0+(X1-X0)*g,Y],'rgba(227,236,238,.7)',3);
  alphaDo(band(u,.06,1),()=>wt((X0+CUT)/2,Y+44,'訓練資料',22,KC.green,700,'center'));
  // 截止線
  const c=ease(seg(u,.28,.4));
  alphaDo(c,()=>{
    ctx.setLineDash([10,8]);ln([CUT,Y-170,CUT,Y+70],KC.orange,3);ctx.setLineDash([]);
    tag(CUT,Y-196,'知識截止',{bg:KC.orange,fg:'#fff',size:20,align:'center'});
    // 空白區
    ctx.fillStyle='rgba(232,87,42,.08)';ctx.fillRect(CUT+4,Y-150,X1-CUT-4,150);
    wt((CUT+X1)/2,Y+44,'之後發生的事',22,KC.orange,700,'center');
    for(let i=0;i<5;i++)wt(CUT+60+i*92,Y-60+Math.sin(TT*2+i)*8,'?',40,'rgba(232,87,42,.55)',800,'center',COND);
  });
  alphaDo(ease(seg(u,.36,.46)),()=>{circ(1420,Y,10,KC.accent);wt(1420,Y-22,'今天',18,KC.accent,700,'center');});
  // 兩張問題卡
  const q=[
   {x:120,a:seg(u,.5,.6),q:'光合作用的原理是什麼？',r:'不太變動的知識',ans:'模型本身即可回答',col:KC.green},
   {x:820,a:seg(u,.72,.82),q:'這支手機現在的售價？',r:'會隨時間改變的資訊',ans:'開啟網頁搜尋並附上來源',col:KC.accent},
  ];
  q.forEach(o=>alphaDo(ease(o.a),()=>{
    card(o.x,520,660,250,{bg:'rgba(7,27,39,.75)',st:o.col});
    wt(o.x+30,570,o.r,18,o.col,700);
    bub(o.x+30,592,600,o.q,'user',1,20);
    arrow(o.x+60,690,o.x+60,736,o.col,3);
    wt(o.x+90,730,o.ans,22,o.col,800);
  }));
 }},
/* 2 ─ 開啟網頁搜尋（場景示意） */
{t:'開啟網頁搜尋',en:'Turning on web search',dur:14,
 d:'在對話輸入框左下角的「＋」選單中可以開啟或關閉網頁搜尋，每個對話可以分別設定；使用新版介面時則沒有開關，Claude 會在有幫助時自動搜尋。搜尋後的回答會附上引用標記與來源連結，方便你點開核對。Team 與 Enterprise 方案需由擁有者先在「組織設定 > 功能」為整個工作區開啟。搜尋也會計入用量。',
 s:[[0,'在輸入框的「＋」選單開啟網頁搜尋'],[.3,'提出需要最新資訊的問題'],[.55,'回答中的數字標記對應右側來源'],[.8,'團隊方案需管理員先開啟此功能']],
 draw(u){
  diagBG();claudeBase();floatParticles(16,11);
  const X=150,Y=150,W=900,H=640;
  winFrame(X,Y,W,H,'對話');
  // 輸入列
  rrp(X+24,Y+H-84,W-48,60,14);ctx.fillStyle='rgba(255,255,255,.06)';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1.2;ctx.stroke();
  const plusHot=band(u,.02,.3);
  circ(X+58,Y+H-54,18,plusHot>.5?KC.accent:'rgba(255,255,255,.1)',KC.border,1.2);
  wt(X+58,Y+H-46,'+',26,plusHot>.5?'#0e2133':KC.text,700,'center',COND);
  wt(X+92,Y+H-47,'輸入訊息…',17,KC.sub,500);
  // 選單
  const m=ease(seg(u,.05,.12))*(1-ease(seg(u,.28,.33)));
  alphaDo(m,()=>{
    const mx=X+40,my=Y+H-250;
    rrp(mx,my,330,150,12);ctx.fillStyle='#1d3350';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1.2;ctx.stroke();
    wt(mx+24,my+48,'網頁搜尋',19,KC.text,600);
    const on=seg(u,.14,.2);
    rrp(mx+240,my+28,62,30,15);ctx.fillStyle=on>.5?KC.green:'rgba(255,255,255,.18)';ctx.fill();
    circ(mx+255+32*ease(on),my+43,11,'#fff');
    wt(mx+24,my+112,'研究',19,KC.sub,600);
    rrp(mx+240,my+92,62,30,15);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fill();circ(mx+255,my+107,11,'#fff');
  });
  // 對話
  bub(X+W-500,Y+80,470,'幫我查這週颱風的最新路徑預測','user',ease(seg(u,.3,.36)),19);
  const typ=seg(u,.38,.5);
  if(typ>0&&typ<1){alphaDo(1,()=>{wt(X+40,Y+200,'正在搜尋網路…',17,KC.accent,600);claudeTypingDot(X+190,Y+195);});}
  const ans=ease(seg(u,.5,.58));
  alphaDo(ans,()=>{
    rrp(X+30,Y+180,640,230,12);ctx.fillStyle=KC.aiBub;ctx.fill();
    const h1=wrapL('根據氣象機關今天上午的公告，颱風預計往西北方向移動，週四接近陸地。',X+50,Y+220,500,19,KC.text,500);
    cite(X+600,Y+232,1,1,band(u,.6,.8)>.5);
    const y2=Y+220+h1+22;
    wrapL('多家媒體引述的預報圖也顯示相同趨勢，但路徑仍可能調整。',X+50,y2,500,19,KC.text,500);
    cite(X+600,y2+12,2,1,false);
  });
  // 來源側欄
  alphaDo(ease(seg(u,.55,.63)),()=>{
    wt(1120,200,'來源',20,KC.accent,700);
    srcCard(1110,220,420,'氣象機關颱風警報','發布於今天 09:30',1,1,band(u,.6,.8)>.5);
    srcCard(1110,310,420,'新聞報導：颱風動態','發布於今天 10:05',2,1,false);
  });
  if(band(u,.6,.8)>.3){alphaDo(band(u,.6,.8),()=>{ctx.setLineDash([6,5]);ln([X+630,Y+228,1110,257],KC.accent,2);ctx.setLineDash([]);});}
  lab(X+58,Y+H-54,'「＋」選單',{dx:-10,dy:-70,st:'s',a:band(u,.02,.28)});
  lab(1320,420,'新版介面：需要時自動搜尋',{dx:0,dy:60,st:'l',a:band(u,.66,1)});
  lab(1320,540,'團隊方案：管理員先開啟',{dx:0,dy:80,st:'w',a:band(u,.8,1)});
 }},
/* 3 ─ 搜尋→閱讀→引用（圖解） */
{t:'搜尋→閱讀→引用',en:'Search → read → cite',dur:14,
 d:'開啟網頁搜尋後，Claude 會先理解問題，自己決定要搜尋哪些關鍵字，瀏覽搜尋結果，再打開合適的網頁閱讀內容，最後把資訊整合成回答，並在句子旁標上對應的來源。如果你直接貼上網址，Claude 也能讀取該頁的完整內容（web fetch）。不過一篇很長的文章會佔用較多上下文視窗，只需要重點時可以先說明想知道什麼。',
 s:[[0,'Claude 先理解問題並決定搜尋關鍵字'],[.3,'瀏覽搜尋結果，挑選合適的網頁'],[.55,'讀取網頁內容，整合成回答'],[.78,'每句重點都能對回原始來源']],
 draw(u){
  diagBG();
  const steps=['理解問題','搜尋關鍵字','瀏覽結果','讀取網頁','整合並引用'];
  const sx=180,sw=310,sy=250;
  steps.forEach((s,i)=>{
    const a=seg(u,.03+i*.1,.1+i*.1),act=a>.5;
    if(i<steps.length-1)alphaDo(seg(u,.08+i*.1,.13+i*.1),()=>arrow(sx+i*sw+42,sy,sx+(i+1)*sw-42,sy,KC.accent,3));
    alphaDo(ease(a),()=>{
      circ(sx+i*sw,sy,36,act?KC.accent:'rgba(30,58,85,.8)',KC.accent,2);
      wt(sx+i*sw,sy+10,String(i+1),28,act?'#0e2133':KC.accent,800,'center',COND);
      wt(sx+i*sw,sy+72,s,20,KC.text,700,'center');
    });
  });
  // 下方：關鍵字與結果示意
  const k=ease(seg(u,.14,.24));
  alphaDo(k,()=>{
    card(80,390,440,380,{bg:'rgba(7,27,39,.75)'});
    wt(104,428,'搜尋關鍵字（示例）',18,KC.accent,700);
    ['捷運 票價 調整 公告','票價 新制 生效日期','交通局 新聞稿'].forEach((q,i)=>{
      alphaDo(seg(u,.18+i*.04,.22+i*.04),()=>{rrp(104,452+i*62,392,46,23);ctx.fillStyle='rgba(88,184,208,.18)';ctx.fill();
        wt(126,482+i*62,'⌕',20,'#58b8d0',700,'left',COND);wt(152,482+i*62,q,17,KC.text,500);});
    });
    wrapL('給網址時，也可直接讀取該頁（web fetch）',104,680,392,16,KC.sub,500);
  });
  // 中：網頁閱讀
  const r=ease(seg(u,.4,.52));
  alphaDo(r,()=>{
    card(580,390,440,380,{bg:'rgba(7,27,39,.75)'});
    wt(604,428,'讀取網頁',18,KC.accent,700);
    rrp(604,448,392,250,8);ctx.fillStyle='rgba(255,255,255,.05)';ctx.fill();
    for(let i=0;i<9;i++){const lw=[360,330,350,280,360,340,300,350,220][i];const hi=(i===3||i===6)&&seg(u,.5,.58)>.5;
      box(620,468+i*25,lw,10,hi?'rgba(242,194,48,.8)':'rgba(227,236,238,.25)');}
    const sc=(TT*40)%60;alphaDo(.6,()=>ln([604,468+sc*3,996,468+sc*3],'rgba(125,255,196,.6)',2));
    wrapL('長文章會佔用較多上下文',604,735,392,16,KC.orange,600);
  });
  // 右：回答與引用
  const c=ease(seg(u,.62,.72));
  alphaDo(c,()=>{
    card(1080,390,440,380,{bg:'rgba(7,27,39,.75)'});
    wt(1104,428,'回答（附引用）',18,KC.accent,700);
    wrapL('新票價預計下個月生效。',1104,480,330,18,KC.text,500);cite(1450,470,1,1,band(u,.8,1)>.5);
    wrapL('學生票優惠維持不變。',1104,560,330,18,KC.text,500);cite(1450,550,2,1,false);
    alphaDo(seg(u,.78,.86),()=>{
      srcCard(1104,620,392,'交通局新聞稿','官方公告',1,1,true);
    });
  });
 }},
/* 4 ─ 深度研究的多步驟（圖解） */
{t:'深度研究的多步驟',en:'Research: many steps, many angles',dur:15,
 d:'「研究」功能適合需要全面蒐集的問題。Claude 會以代理方式從多個角度反覆搜尋，一步步延伸問題，再把大量來源整合成附引用的完整回答，通常在幾分鐘內完成。官方建議：一兩次搜尋就能回答的事實用網頁搜尋；需要五次以上工具呼叫、約一到三分鐘的綜合整理才用研究。研究需先開啟網頁搜尋，開放給付費方案；連接 Gmail、Google 日曆與 Google 文件後，也會一併搜尋這些內部資料。',
 s:[[0,'簡單事實：一兩次搜尋就夠'],[.3,'研究：從多個角度反覆搜尋'],[.6,'網路與已連接的工作資料一起納入'],[.82,'整合成附引用的完整回答']],
 draw(u){
  diagBG();
  // 左：工具呼叫次數比較
  card(60,160,700,610,{bg:'rgba(7,27,39,.75)'});
  wt(90,204,'工具呼叫次數（官方建議）',20,KC.accent,700);
  const rows=[
   {n:'網頁搜尋',v:2,lbl:'1–2 次',ex:'天氣、公司資訊、近期新聞',col:'#58b8d0',a:seg(u,.02,.16)},
   {n:'研究',v:8,lbl:'5 次以上',ex:'約 1–3 分鐘，產出深入報告',col:KC.accent,a:seg(u,.2,.4)},
  ];
  const BX=220,BW=480;
  rows.forEach((r,i)=>{
    const y=280+i*210;
    alphaDo(ease(seg(r.a,0,.3)),()=>{
      wt(90,y+26,r.n,22,KC.text,800);
      const f=ease(r.a);
      for(let k=0;k<10;k++){const on=k<r.v*f;rrp(BX+k*48,y,40,40,8);ctx.fillStyle=on?r.col:'rgba(255,255,255,.07)';ctx.fill();}
      wt(BX,y+84,r.lbl,24,r.col,800,'left',COND);
      wt(BX+130,y+83,r.ex,17,KC.sub,500);
    });
  });
  alphaDo(band(u,.45,1),()=>wrapL('需先開啟網頁搜尋；限 Pro、Max、Team、Enterprise',90,720,640,17,KC.orange,600));
  // 右：代理式多角度展開
  const RX=880,RY=500;
  alphaDo(ease(seg(u,.22,.3)),()=>{rrp(RX-78,RY-34,156,68,14);ctx.fillStyle=KC.accent;ctx.fill();wt(RX,RY+8,'你的問題',18,'#0e2133',800,'center');});
  const ang=['市場規模','主要做法','成本比較','風險與爭議'];
  ang.forEach((s,i)=>{
    const y=350+i*100,a=seg(u,.3+i*.05,.36+i*.05);
    alphaDo(ease(a),()=>{
      connLine(RX+78,RY,1070,y,{u:1,flow:true,col:'rgba(242,194,48,.7)'});
      rrp(1070,y-26,170,52,10);ctx.fillStyle='rgba(30,58,85,.9)';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1;ctx.stroke();
      wt(1155,y+7,s,17,KC.text,600,'center');
    });
    // 每個角度找到的來源點
    for(let j=0;j<3;j++){const b=seg(u,.42+i*.04+j*.03,.46+i*.04+j*.03);
      alphaDo(ease(b),()=>{ln([1240,y,1290+j*34,y-18+j*18],'rgba(125,255,196,.5)',1.5);rrp(1280+j*34,y-30+j*18,22,26,3);ctx.fillStyle='rgba(125,255,196,.7)';ctx.fill();});}
  });
  // 資料來源圖示
  alphaDo(ease(seg(u,.58,.68)),()=>{
    wt(1410,352,'資料來源',16,KC.sub,700,'center');
    [['網路','#58b8d0'],['Gmail','#e8572a'],['日曆','#b37cff'],['文件','#7dffc4']].forEach(([n,c],i)=>{
      rrp(1370,370+i*62,80,46,8);ctx.fillStyle='rgba(15,36,56,.9)';ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=1.5;ctx.stroke();
      wt(1410,399+i*62,n,15,c,700,'center');
    });
    wt(1410,640,'（已連接時）',14,KC.sub,500,'center');
  });
  // 報告
  alphaDo(ease(seg(u,.8,.9)),()=>{
    rrp(1080,680,450,90,12);ctx.fillStyle='rgba(242,194,48,.14)';ctx.fill();ctx.strokeStyle=KC.accent;ctx.lineWidth=2;ctx.stroke();
    wt(1110,718,'附引用的完整回答',20,KC.accent,800);
    wt(1110,750,'通常幾分鐘內完成',16,KC.sub,500);
    [1,2,3].forEach(k=>cite(1400+(k-1)*38,730,k,1,false));
  });
 },
 hud(u){
  hudPanel(230,120,'研究進度（示例）',seg(u,.3,.36),w=>{
   const n=Math.round(lerp(0,14,ease(seg(u,.3,.85))));
   const sec=Math.round(lerp(0,150,seg(u,.3,.85)));
   hrow(56,'工具呼叫',trf('{n} 次',{n}),w,KC.accent);
   hrow(86,'經過時間',`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`,w,KC.green);
   hbar(14,100,w-28,seg(u,.3,.85),KC.accent);
  });
 }},
/* 5 ─ 查證來源的三個問題（圖解） */
{t:'查證來源的三個問題',en:'Three questions for checking sources',dur:14,
 d:'附上引用讓查證變得容易，但不代表內容一定正確：網頁可能過時、轉述可能失真，模型也可能把兩個來源的說法混在一起。拿到答案後，針對重要的數字或結論問三個問題：資訊是誰說的，是官方機關、原始研究還是二手轉述？是什麼時候發布或更新的？點開引用後，原文真的是這樣寫嗎？三項都通過，再拿去用。',
 s:[[0,'第一問：這是誰說的？'],[.32,'第二問：什麼時候發布的？'],[.6,'第三問：原文真的這樣寫嗎？'],[.84,'引用讓查證容易，但仍要自己確認']],
 draw(u){
  diagBG();
  const C=[
   {t:'誰說的？',b:'官方機關、原始研究、當事人的第一手說法，比二手轉述可靠',a:seg(u,.02,.12),ic:'who'},
   {t:'什麼時候？',b:'看發布與更新日期；價格、規定、版本這類時效性資訊尤其重要',a:seg(u,.3,.4),ic:'when'},
   {t:'原文真的這樣寫？',b:'點開引用，對照原句與數字，確認沒有被誤讀或混用',a:seg(u,.58,.68),ic:'what'},
  ];
  C.forEach((c,i)=>{
    const x=80+i*490;
    alphaDo(ease(c.a),()=>{
      card(x,170,450,520,{bg:'rgba(7,27,39,.75)',st:KC.border});
      numCircle(x+50,222,i+1,KC.accent);
      wt(x+90,232,c.t,26,KC.accent,800);
      // 圖示區
      const cx=x+225,cy=370;
      if(c.ic==='who'){
        circ(cx-70,cy-20,26,'rgba(125,255,196,.8)');rrp(cx-110,cy+10,80,60,24);ctx.fillStyle='rgba(125,255,196,.8)';ctx.fill();
        wt(cx-70,cy+100,'第一手',16,KC.green,700,'center');
        arrow(cx-20,cy+20,cx+30,cy+20,'rgba(227,236,238,.5)',2);
        circ(cx+80,cy-20,22,'rgba(227,236,238,.35)');rrp(cx+46,cy+8,68,54,22);ctx.fillStyle='rgba(227,236,238,.35)';ctx.fill();
        wt(cx+80,cy+100,'轉述',16,KC.sub,700,'center');
      }else if(c.ic==='when'){
        rrp(cx-80,cy-70,160,150,12);ctx.fillStyle='rgba(255,255,255,.08)';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1.5;ctx.stroke();
        box(cx-80,cy-70,160,36,'rgba(232,87,42,.8)');
        for(let r=0;r<3;r++)for(let q=0;q<5;q++)box(cx-66+q*28,cy-20+r*30,18,18,(r===1&&q===3)?KC.accent:'rgba(227,236,238,.25)');
        wt(cx,cy+110,'發布／更新日期',16,KC.accent,700,'center');
      }else{
        rrp(cx-120,cy-60,150,140,8);ctx.fillStyle='rgba(255,255,255,.07)';ctx.fill();
        for(let r=0;r<6;r++)box(cx-106,cy-44+r*20,r===2?120:100,8,r===2?'rgba(242,194,48,.85)':'rgba(227,236,238,.25)');
        const mg=seg(u,.66,.8);
        const mx=lerp(cx+40,cx-50,ease(mg)),my=cy-4;
        ring(mx,my,30,KC.green,5);ln([mx+21,my+21,mx+50,my+50],KC.green,7);
        wt(cx,cy+110,'原句與數字',16,KC.green,700,'center');
      }
      wrapL(c.b,x+30,540,390,18,'rgba(227,236,238,.9)',500);
      const ok=seg(u,[.22,.5,.8][i],[.26,.54,.84][i]);
      alphaDo(ok,()=>tag(x+225,660,'✓ 通過',{bg:KC.green,fg:'#0e2133',size:18,align:'center'}));
    });
  });
  alphaDo(ease(seg(u,.86,.94)),()=>tag(800,748,'有引用 ≠ 一定正確',{bg:KC.orange,fg:'#fff',size:22,align:'center'}));
 }},
/* 6 ─ 產出研究摘要（場景示意） */
{t:'產出研究摘要',en:'Producing a research summary',dur:13,
 d:'研究完成後，好的摘要應該先給結論，再列出主要發現與對應引用，並把仍有爭議或資料不足之處分開寫。提問時先說明範圍與用途、指定想要的格式，並要求把事實與推論分開，產出會更好用。研究會讀取多個來源、寫出完整回答，因此比一般對話更快消耗用量；問題不大時，用一般搜尋就好。',
 s:[[0,'研究完成，產出附引用的摘要'],[.3,'先給結論，再列主要發現'],[.55,'爭議與資料不足之處分開寫'],[.8,'研究較耗用量，小問題用一般搜尋即可']],
 draw(u){
  diagBG();claudeBase();floatParticles(14,23);
  const X=120,Y=150,W=880,H=640;
  winFrame(X,Y,W,H,'研究摘要（示例）');
  const sec=[
   {h:'重點結論',b:'遠距與混合工作讓每週通勤次數明顯減少，但影響因產業而異。',c:[1,2],col:KC.accent,a:seg(u,.08,.2)},
   {h:'主要發現',b:'多項調查顯示，每週通勤天數平均減少一到兩天；交通尖峰時段也隨之分散。',c:[3,4],col:KC.green,a:seg(u,.3,.42)},
   {h:'仍有爭議',b:'對整體碳排放的影響，各研究的估算方法不同，結論尚不一致。',c:[5],col:KC.orange,a:seg(u,.55,.66)},
  ];
  sec.forEach((s,i)=>{
    const y=Y+80+i*170;
    alphaDo(ease(s.a),()=>{
      box(X+40,y,6,130,s.col);
      wt(X+64,y+26,s.h,22,s.col,800);
      wrapL(s.b,X+64,y+66,700,18,KC.text,500);
      s.c.forEach((n,k)=>cite(X+W-110+k*40,y+18,n,1,false));
    });
  });
  // 右側：提問技巧清單
  alphaDo(ease(seg(u,.05,.15)),()=>{
    card(1060,150,460,470,{bg:'rgba(7,27,39,.8)'});
    wt(1090,196,'讓研究更好用的提問',20,KC.accent,700);
  });
  ['說明範圍與用途','指定想要的格式','要求分開事實與推論','逐一點開重要引用'].forEach((t,i)=>{
    const a=seg(u,.15+i*.12,.22+i*.12);
    alphaDo(ease(a),()=>{
      rrp(1090,236+i*90,34,34,8);ctx.fillStyle=a>.8?KC.green:'rgba(255,255,255,.1)';ctx.fill();
      if(a>.8)wt(1107,262+i*90,'✓',22,'#0e2133',800,'center');
      wrapL(t,1140,262+i*90,350,19,KC.text,600);
    });
  });
  alphaDo(ease(seg(u,.78,.88)),()=>{
    rrp(1060,650,460,120,12);ctx.fillStyle='rgba(232,87,42,.14)';ctx.fill();ctx.strokeStyle=KC.orange;ctx.lineWidth=1.5;ctx.stroke();
    wt(1090,690,'用量提醒',18,KC.orange,800);
    wrapL('研究讀取多個來源，比一般對話更快消耗用量',1090,724,400,17,KC.text,500);
  });
 }}
]};
