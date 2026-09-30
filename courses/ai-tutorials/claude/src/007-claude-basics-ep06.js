// KITS: claude
/* 007-claude-basics-ep06 — Artifacts 與可分享成果
   Claude AI 應用動畫館｜入門基礎 第 6 集
   介面皆為重新繪製的示意圖，不是官方畫面。 */
const CY='#f2c230',CO='#e8572a',CG='#7dffc4',CB='#58b8d0',CP='#b37cff',CT='rgba(227,236,238,.8)';
const PUNC='，。、：；）」』！？・ー…,.:;)';
function wrapLines(t,size,maxW,weight){
  t=tr(t);const out=[];let cur='';
  if(LANG==='en'){
    for(const w of t.split(' ')){const n=cur?cur+' '+w:w;if(cur&&wtw(n,size,weight)>maxW){out.push(cur);cur=w;}else cur=n;}
  }else{
    for(const ch of (t.match(/[A-Za-z0-9.$,'’\-]+|[\s\S]/gu)||[])){const n=cur+ch;if(cur&&wtw(n,size,weight)>maxW&&PUNC.indexOf(ch)<0){out.push(cur);cur=ch;}else cur=n;}
  }
  if(cur)out.push(cur);return out;
}
function wrapL(x,y,t,size,col,maxW,lh,weight,align){
  const L=wrapLines(t,size,maxW,weight);L.forEach((l,i)=>wt(x,y+i*lh,l,size,col,weight,align));return L.length;
}
function winFrame(x,y,w,h,title,o){
  o=o||{};rrp(x,y,w,h,12);ctx.fillStyle=KC.winBg;ctx.fill();ctx.strokeStyle=o.st||KC.border;ctx.lineWidth=o.lw||1.6;ctx.stroke();
  ctx.save();rrp(x,y,w,44,12);ctx.clip();box(x,y,w,44,KC.winBar);ctx.restore();
  ln([x,y+44,x+w,y+44],KC.border,1);
  [CO,CY,CG].forEach((c,i)=>circ(x+20+i*18,y+22,5,c));
  if(title)wt(x+w/2,y+29,title,17,KC.text,700,'center');
}
function bub(x,y,w,t,role,a){
  if(a<=.001)return 0;const L=wrapLines(t,17,w-28,500),h=20+L.length*26;
  alphaDo(a,()=>{rrp(x,y,w,h,10);ctx.fillStyle=role==='user'?KC.userBub:KC.aiBub;ctx.fill();
    L.forEach((l,i)=>wt(x+14,y+30+i*26,l,17,KC.text,500));});
  return h;
}
function check(x,y,t,a,col,w){
  alphaDo(a,()=>{circ(x+13,y-7,13,col||CG);ln([x+6,y-7,x+11,y-1,x+20,y-13],'#0e2a3b',3);wrapL(x+38,y,t,19,'#fff',w||600,26,600);});
}
function pointer(x,y,a){
  alphaDo(a,()=>{poly([x,y,x,y+26,x+7,y+20,x+12,y+31,x+17,y+29,x+12,y+18,x+21,y+18],'#fff','#0e2a3b',1.5);});
}
function lockIcon(x,y,col){
  ctx.beginPath();ctx.arc(x,y-8,8,Math.PI,0);ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();
  rrp(x-12,y-8,24,19,4);ctx.fillStyle=col;ctx.fill();
}
const CATS=[['房租',12000,CB],['餐飲',8000,CY],['交通',3000,CG],['娛樂',2000,CP]];
function nt(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
function miniTool(x,y,w,h,ver,a){
  alphaDo(a,()=>{
    box(x,y,w,h,'rgba(255,255,255,.04)');
    const vals=[12000,8000,3000,2000],tot=25000;
    vals.forEach((v,i)=>{const yy=y+30+i*38,bw=(w-130)*v/12000;
      wt(x+14,yy+6,CATS[i][0],14,CT,500);
      box(x+100,yy-8,bw,18,ver>=2?CATS[i][2]:'#5b7489');});
    if(ver>=2)wt(x+w-14,y+h-16,trf('總計 NT$ {n}',{n:nt(tot)}),16,CY,700,'right');
    if(ver>=3){rrp(x+14,y+h-36,120,28,6);ctx.fillStyle=CG;ctx.fill();wt(x+74,y+h-16,'匯出 CSV',14,'#0e2a3b',700,'center');}
  });
}

const EP={no:6,t:'Artifacts 與可分享成果',en:'Artifacts & Sharing',
seriesName:'入門基礎',total:7,
lede:'當回答不只是一段文字，而是一個網頁、小工具、文件或簡報時，Claude 會把它放進 Artifact：在對話旁邊打開、可以反覆修改，完成後再決定要不要分享。',
facts:[
 ['15','行','內容較大且獨立（通常超過 15 行）、可能會再編輯或重用時，Claude 會建立 Artifact'],
 ['3','種範本','文件、簡報、設計；Pro、Max、Team、Enterprise 方案可用'],
 ['20','MB','每個 Artifact 的資料儲存上限，只接受文字'],
 ['0','把 API 金鑰','AI 驅動的 Artifact 直接呼叫 Claude，用量計入使用者自己的方案'],
 ['4','個步驟','分享：按「分享」→選擇對象→選擇版本→複製連結'],
],
note:'說明：本集為教育用途示意動畫，畫面中的介面為重新繪製的示意圖，並非官方截圖。功能、方案與限制依 support.claude.com〈What are artifacts and how do I use them?〉〈Share artifacts〉與 Claude Academy〈Creating with artifacts〉查證，資訊截至 2026-09；介面名稱與各方案可用功能可能調整，請以官方說明為準。',
shots:[
/* 1 ─ 回答變成網頁或工具（圖解） */
{t:'回答變成網頁或工具',en:'When an answer becomes a page',dur:14,
 d:'Artifact 是 Claude 為你做出、可以拿給別人看的成品：一份文件、一個單頁網站、一張流程圖、一個儀表板或互動小工具。當內容夠大而且獨立（官方說明通常超過 15 行），又是你可能會再編輯、反覆修改或拿到對話外使用的東西，Claude 就會把它放進對話旁的 Artifact 視窗，而不是塞在一長串回答裡。',
 s:[[0,'你請 Claude 做一個番茄鐘計時器'],[.3,'回答越寫越長，已經不只是幾句話'],[.5,'內容獨立又夠大，就在旁邊打開成 Artifact'],[.75,'可以直接預覽、操作，也能切換看程式碼']],
 draw(u){
  diagBG();
  card(60,160,680,620,{bg:'rgba(7,27,39,.75)'});wt(90,202,'在對話中',20,CY,700);
  bub(330,226,380,'幫我做一個番茄鐘計時器','user',band(u,.02,1.2));
  const n=Math.floor(lerp(0,38,easeOut(seg(u,.1,.55))));
  alphaDo(seg(u,.08,.14),()=>{
   wt(90,318,'Claude',15,CY,700);
   const r=rng(7),rows=[];for(let i=0;i<38;i++)rows.push([r()*3|0,40+r()*300,r()*80]);
   const vis=Math.min(n,15),st=Math.max(0,n-15);
   for(let i=0;i<vis;i++){const q=rows[st+i],yy=338+i*22;box(90+q[2]*.5+20,yy,q[1],10,[CB,CG,'#9fb6c4'][q[0]]);wt(96,yy+10,String(st+i+1),11,'#5b7489',500,'left',COND);}
  });
  // 行數量尺
  const sx=90,sw=600,sy=720,X=v=>sx+sw*v/40;
  box(sx,sy,sw,14,'rgba(255,255,255,.08)');box(sx,sy,X(n)-sx,14,n>15?CG:CB);
  ln([X(15),sy-12,X(15),sy+26],CO,2.5);wt(X(15),sy+46,'15 行',16,CO,700,'center');
  wt(sx+sw,sy-12,trf('{n} 行',{n}),22,n>15?CG:'#fff',700,'right',COND);
  // Artifact 面板
  const k=easeOut(seg(u,.42,.6));
  if(k>0){
   const px=lerp(1600,800,k);
   alphaDo(k,()=>{arrow(746,470,792,470,CY,3);});
   winFrame(px,160,740,620,'Artifact',{st:CY,lw:2});
   const tw=tag(px+24,228,'預覽',{size:16});tag(px+36+tw,228,'程式碼',{size:16,bg:'rgba(255,255,255,.12)',fg:'#fff'});
   const cx=px+370,cy=390,ang=((TT*.15)%1)*TAU;
   circ(cx,cy,100,null,'rgba(255,255,255,.12)',14);
   ctx.beginPath();ctx.arc(cx,cy,100,-Math.PI/2,-Math.PI/2+ang);ctx.strokeStyle=CY;ctx.lineWidth=14;ctx.stroke();
   const sec=1500-Math.floor((TT*.15%1)*1500);
   wt(cx,cy+18,String(sec/60|0).padStart(2,'0')+':'+String(sec%60).padStart(2,'0'),52,'#fff',700,'center',COND);
   tag(cx-12,540,'開始',{size:18,align:'right',bg:CG});tag(cx+12,540,'重設',{size:18,bg:'rgba(255,255,255,.14)',fg:'#fff'});
   check(px+40,630,'內容夠大：通常超過 15 行',seg(u,.6,.66),CG,640);
   check(px+40,690,'獨立完整，可能會再修改或重用',seg(u,.7,.76),CG,640);
  }
 }},
/* 2 ─ 互動小工具示範（場景） */
{t:'互動小工具示範',en:'An interactive tool',dur:15,
 d:'Artifact 不只能看，也能操作。這裡請 Claude 做一個輸入每月支出、看分類占比的小工具：它寫好程式後，右側立刻出現可以輸入數字的表單與長條圖。改動任何一格，占比與總計都會跟著重新計算。想換顏色、加欄位或改版面，不必自己寫程式，在對話中說出需求就好。',
 s:[[0,'用一句話描述想要的小工具'],[.2,'Claude 寫好程式，右側出現可操作的畫面'],[.45,'逐格輸入支出，長條圖跟著長出來'],[.78,'把餐飲改成 6,000，占比立刻重算']],
 draw(u){
  claudeBase();floatParticles(16,6);
  winFrame(60,160,560,620,'Claude');
  let y=190+34;
  y+=bub(200,y,390,'做一個小工具：輸入每月支出，看各分類占比','user',seg(u,.02,.08))+18;
  y+=bub(84,y,440,'已建立「支出分析」小工具，右側可以直接操作。','ai',seg(u,.16,.22))+18;
  bub(84,y,440,'想調整顏色或欄位，直接在對話裡告訴我。','ai',seg(u,.6,.66));
  const k=easeOut(seg(u,.14,.26));
  if(k<=0)return;
  alphaDo(k,()=>{
   winFrame(660,160,880,620,'支出分析',{st:CY,lw:2});
   tag(1520,228,'Artifact',{size:14,align:'right',bg:'rgba(242,194,48,.18)',fg:CY});
   wt(690,262,'每月支出',19,CY,700);wt(1110,262,'各分類占比',19,CY,700);
   const vals=CATS.map((c,i)=>{let v=c[1]*easeOut(seg(u,.3+i*.1,.38+i*.1));if(i===1)v=lerp(v,6000,ease(seg(u,.8,.88)));return Math.round(v/100)*100;});
   const tot=vals.reduce((a,b)=>a+b,0);
   CATS.forEach((c,i)=>{const yy=320+i*86;
    wt(690,yy+8,c[0],19,'#fff',600);
    const act=(u>.3+i*.1&&u<.4+i*.1)||(i===1&&u>.78&&u<.9);
    rrp(790,yy-22,250,44,8);ctx.fillStyle='rgba(255,255,255,.06)';ctx.fill();ctx.strokeStyle=act?CY:KC.border;ctx.lineWidth=act?2:1;ctx.stroke();
    wt(1024,yy+9,nt(vals[i]),22,'#fff',600,'right',COND);
    const sh=tot?vals[i]/tot:0;
    box(1110,yy-14,300*sh,28,c[2]);
    wt(1110+300*sh+10,yy+8,Math.round(sh*100)+'%',20,'#fff',700,'left',COND);
   });
   ln([690,672,1510,672],KC.border,1);
   wt(690,716,'總計',20,CT,600);wt(1510,718,'NT$ '+nt(tot),30,CY,700,'right',COND);
   // 游標
   let px=1060,py=360;
   for(let i=0;i<4;i++){if(u>.28+i*.1){px=1000;py=320+i*86;}}
   if(u>.76){px=1000;py=406;}
   pointer(px,py,band(u,.28,.95));
  });
  lab(915,600,'直接輸入數字',{dx:0,dy:50,a:band(u,.32,.6)});
  lab(1300,406,'即時重算',{dx:60,dy:-60,st:'g',a:band(u,.82,1)});
 }},
/* 3 ─ 文件、簡報、設計類型（圖解） */
{t:'文件、簡報、設計類型',en:'Docs, Slides and Design',dur:13,
 d:'除了網頁與小工具，Artifact 也有三種範本：文件、簡報與設計。範本類型可以直接在畫面上編輯：在文件裡打字、選取段落請 Claude 局部修改；逐張調整投影片；在設計畫布上拖曳與縮放元素。完成後可匯出成常用格式，例如文件轉 Word、PDF 或 Markdown，簡報轉 PowerPoint 或 PDF。範本類型需 Pro 以上方案。',
 s:[[0,'三種範本：文件、簡報、設計'],[.3,'都能直接在畫面上動手修改'],[.6,'完成後匯出成熟悉的檔案格式'],[.82,'其他成果：網頁、SVG 圖、流程圖、儀表板']],
 draw(u){
  diagBG();
  const C=[
   ['文件','Docs',CB,'直接輸入文字；選取段落，用「Edit with Claude」局部修改',['Word','PDF','Markdown']],
   ['簡報','Slides',CY,'直接編輯任一張投影片，或留言請 Claude 修改',['PowerPoint','PDF']],
   ['設計','Design',CP,'在畫布上拖曳、縮放元素，調整版面',['.zip','HTML']]];
  C.forEach((c,i)=>{
   const x=60+i*503,a=easeOut(seg(u,.02+i*.08,.12+i*.08));
   alphaDo(a,()=>{
    card(x,160,474,500,{bg:'rgba(7,27,39,.75)',st:c[2]});
    // 圖示
    const ix=x+32,iy=190;
    if(i===0){rrp(ix,iy,78,100,6);ctx.fillStyle='#e3ecee';ctx.fill();for(let k=0;k<5;k++)box(ix+12,iy+18+k*15,k===2?36:54,6,k===2?CY:'#8aa1b1');
      box(ix+12,iy+44,54,10,'rgba(242,194,48,.35)');}
    if(i===1){rrp(ix,iy+14,120,70,6);ctx.fillStyle='#e3ecee';ctx.fill();box(ix+12,iy+26,60,10,CO);box(ix+12,iy+46,90,6,'#8aa1b1');box(ix+12,iy+58,70,6,'#8aa1b1');
      [0,1,2].forEach(k=>{rrp(ix+132,iy+10+k*28,40,22,3);ctx.fillStyle=k===0?CY:'#5b7489';ctx.fill();});}
    if(i===2){rrp(ix,iy,150,100,6);ctx.fillStyle='rgba(255,255,255,.06)';ctx.fill();ctx.strokeStyle='#5b7489';ctx.lineWidth=1;ctx.stroke();
      const dx=18*Math.sin(TT*1.4);circ(ix+50+dx,iy+50,22,CP);box(ix+90,iy+24,40,50,CB);
      ctx.setLineDash([4,3]);ctx.strokeStyle=CY;ctx.lineWidth=1.5;ctx.strokeRect(ix+26+dx,iy+26,48,48);ctx.setLineDash([]);}
    wt(x+474-32,232,c[0],30,c[2],800,'right');if(LANG!=='en')wt(x+474-32,262,c[1],18,CT,600,'right',COND);
    alphaDo(seg(u,.28+i*.06,.36+i*.06),()=>{
     wt(x+32,338,'怎麼改',17,CT,700);
     wrapL(x+32,374,c[3],19,'#fff',410,28,500);
    });
    alphaDo(seg(u,.55+i*.06,.63+i*.06),()=>{
     wt(x+32,528,'匯出成',17,CT,700);
     let tx=x+32;c[4].forEach(f=>{tx+=tag(tx,570,f,{size:17,bg:c[2]})+10;});
    });
   });
  });
  alphaDo(seg(u,.78,.86),()=>{
   card(60,684,1480,104,{bg:'rgba(255,255,255,.05)'});
   tag(84,736,'範本需 Pro 以上方案',{size:17,bg:'rgba(242,194,48,.2)',fg:CY});
   wrapL(430,745,'其他 Artifact：單頁網站、SVG 圖、流程圖、儀表板、程式碼與互動工具',20,'#fff',1080,28,500);
  });
 }},
/* 4 ─ AI 驅動與資料儲存（圖解） */
{t:'會思考、會記住的 Artifact',en:'AI-powered and stateful',dur:14,
 d:'Artifact 裡的程式也可以直接呼叫 Claude，做出會回答問題、會產生內容的小應用，而且不需要自己申請 API 金鑰。別人使用你分享的 AI 小工具時，用量計入他自己的方案額度，不會算在你身上。付費方案的 Artifact 還能在不同工作階段之間保存資料，分成只有自己看得到的個人資料與所有人共用的共享資料，每個 Artifact 上限 20 MB，只能存文字。',
 s:[[0,'Artifact 裡的程式可以直接呼叫 Claude'],[.28,'不需要 API 金鑰，用量計入使用者自己的方案'],[.55,'資料可以保存下來，下次打開還在'],[.78,'個人資料與共享資料，上限 20 MB']],
 draw(u){
  diagBG();
  // Artifact
  alphaDo(seg(u,0,.08),()=>{
   winFrame(80,190,420,300,'你的 Artifact',{st:CY});
   rrp(104,262,372,44,8);ctx.fillStyle='rgba(255,255,255,.06)';ctx.fill();wt(120,291,'幫我把這段話翻成英文',17,CT,500);
   rrp(104,322,372,120,8);ctx.fillStyle=KC.aiBub;ctx.fill();
   const r=rng(3);for(let k=0;k<3;k++)box(122,344+k*26,(200+r()*140)*easeOut(seg(u,.22+k*.04,.3+k*.04)),10,CG);
  });
  // Claude 節點
  const cx=800,cy=340;
  alphaDo(seg(u,.06,.14),()=>{
   circ(cx,cy,74,KC.nodeBg,CY,3);wt(cx,cy+10,'Claude',28,CY,700,'center');
   connLine(500,318,726,318,{u:1,flow:true,col:CY,lw:3});
   connLine(726,362,500,362,{u:1,flow:u>.2,col:CG,lw:3});
   wt(613,300,'請求',16,CY,600,'center');wt(613,392,'回應',16,CG,600,'center');
  });
  alphaDo(seg(u,.26,.32),()=>{tag(cx,450,'不需 API 金鑰',{size:18,align:'center'});});
  // 使用者與用量
  alphaDo(seg(u,.3,.38),()=>{
   card(1000,190,540,300,{bg:'rgba(7,27,39,.75)'});
   wt(1030,232,'誰在用，就計入誰的方案',19,CY,700);
   [['你',.35,CB],['同事',.6,CG]].forEach((p,i)=>{const yy=300+i*90;
    person(1060,yy+34,p[2],1.1);wt(1100,yy,p[0],19,'#fff',600);
    box(1100,yy+16,380,16,'rgba(255,255,255,.08)');box(1100,yy+16,380*p[1]*easeOut(seg(u,.34+i*.05,.5+i*.05)),16,p[2]);
    wt(1480,yy,'用量',15,CT,500,'right');});
  });
  // 儲存
  alphaDo(seg(u,.52,.6),()=>{
   card(80,530,1460,250,{bg:'rgba(255,255,255,.04)'});
   wt(110,572,'跨工作階段保存資料（付費方案）',20,CY,700);
   [['個人資料','只有自己看得到',CB,260],['共享資料','所有檢視者共用',CG,700]].forEach((s,i)=>{
    const x=s[3],y=630,a=seg(u,.58+i*.08,.66+i*.08);
    alphaDo(a,()=>{
     ctx.beginPath();ctx.ellipse(x,y,70,16,0,0,TAU);ctx.fillStyle=s[2];ctx.fill();
     box(x-70,y,140,80,s[2]);ctx.beginPath();ctx.ellipse(x,y+80,70,16,0,0,TAU);ctx.fill();
     ctx.beginPath();ctx.ellipse(x,y,70,16,0,0,TAU);ctx.fillStyle='rgba(255,255,255,.35)';ctx.fill();
     wt(x+92,y+30,s[0],21,'#fff',700);wt(x+92,y+62,s[1],17,CT,500);
    });
   });
   alphaDo(seg(u,.78,.86),()=>{
    wt(1500,660,'20 MB',52,CY,700,'right',COND);wt(1500,700,'每個 Artifact 上限，只存文字',18,CT,500,'right');
   });
  });
 }},
/* 5 ─ 發佈與分享連結（圖解） */
{t:'發佈與分享連結',en:'Publishing and share links',dur:15,
 d:'每個 Artifact 一開始都只有你看得到。要給別人看時，按「分享」，選擇對象與要分享的版本，再複製連結。Pro 與 Max 方案可以選「只有你」或「知道連結的任何人」，Team 與 Enterprise 還能限定在組織內；檢視者需要有 Claude 帳號。Free、Pro、Max 的聊天 Artifact 另可「發佈」，沒有帳號的人也能看，還能取得嵌入碼；一旦取消發佈，連結立刻失效，也無法再重新發佈同一個 Artifact。',
 s:[[0,'每個 Artifact 預設只有你看得到'],[.2,'分享四步驟：分享、選對象、選版本、複製連結'],[.5,'依方案決定可以分享給誰'],[.75,'發佈後不需帳號也能看，取消發佈無法復原']],
 draw(u){
  diagBG();
  alphaDo(seg(u,0,.06),()=>{lockIcon(640,196,CG);wt(664,203,'預設：只有你看得到',20,CG,700);});
  const ST=['按「分享」','選擇對象','選擇版本','複製連結'];
  ST.forEach((s,i)=>{const x=260+i*360,a=seg(u,.18+i*.07,.24+i*.07),on=a>.5;
   if(i<3)alphaDo(seg(u,.22+i*.07,.27+i*.07),()=>arrow(x+36,262,x+324,262,CY,2.5));
   alphaDo(Math.max(.25,a),()=>{circ(x,262,30,on?CY:'rgba(30,58,85,.9)',on?null:KC.border,1.5);
    wt(x,272,String(i+1),26,on?'#0e2a3b':CT,700,'center',COND);wt(x,324,s,19,on?CY:CT,700,'center');});
  });
  // 分享範圍
  alphaDo(seg(u,.45,.52),()=>{
   card(60,370,720,410,{bg:'rgba(7,27,39,.75)'});
   wt(90,412,'可以分享給誰',20,CY,700);
   wt(90,462,'Pro／Max',19,'#fff',700,'left',COND);
   let tx=260;['只有你','知道連結的任何人'].forEach(t=>{tx+=tag(tx,456,t,{size:16,bg:'rgba(88,184,208,.25)',fg:'#fff'})+10;});
   wt(90,532,'Team／Enterprise',19,'#fff',700,'left',COND);
   tx=90;['有權限的人','整個組織','知道連結的任何人'].forEach(t=>{tx+=tag(tx,574,t,{size:16,bg:'rgba(125,255,196,.2)',fg:'#fff'})+10;});
   wrapL(90,628,'對組織外分享需由管理員在組織設定中開啟',16,CT,660,24,500);
   ln([90,664,750,664],'rgba(255,255,255,.12)',1);
   wrapL(90,700,'檢視者都需要 Claude 帳號；權限可設為檢視、編輯，簡報與設計另可留言',18,'#fff',660,28,500);
  });
  // 發佈
  alphaDo(seg(u,.68,.75),()=>{
   card(820,370,720,410,{bg:'rgba(7,27,39,.75)',st:CY});
   wt(850,412,'發佈（Free／Pro／Max 的聊天 Artifact）',20,CY,700);
   check(850,480,'沒有 Claude 帳號也能檢視',seg(u,.7,.76),CG,640);
   check(850,560,'取得嵌入碼：需先設定允許的網域',seg(u,.76,.82),CB,640);
   alphaDo(seg(u,.84,.9),()=>{circ(863,633,13,CO);wt(863,640,'!',20,'#0e2a3b',800,'center');
    wrapL(888,640,'取消發佈：連結立即失效，而且無法重新發佈同一個 Artifact',19,'#fff',620,28,600);});
  });
 }},
/* 6 ─ 反覆修改到完成（場景） */
{t:'反覆修改到完成',en:'Iterate until it is done',dur:14,
 d:'好的成品通常不是一次完成。每提出一次修改，Artifact 就更新一版，先前的版本仍保留下來，可以比較或回頭使用。修改的方式有三種：在對話中說明要改什麼、在範本類型的畫面上直接編輯，或在文件中選取段落，用「Edit with Claude」只改那一段。分享時可以選擇分享最新版，或指定某一個版本。',
 s:[[0,'第一版：先把功能做出來'],[.3,'說一句話，第二版加上顏色與總計'],[.58,'再加一個匯出 CSV 按鈕，成為第三版'],[.8,'分享時選擇最新版或特定版本']],
 draw(u){
  claudeBase();floatParticles(14,11);
  const M=['在對話中提出修改','直接在畫面上編輯','選取段落，用 Edit with Claude'];
  alphaDo(seg(u,0,.06),()=>{wt(800,196,'三種修改方式',18,CT,700,'center');
   const ws=M.map(m=>wtw(m,17,700)+20),totW=ws.reduce((a,b)=>a+b,0)+40;let tx=800-totW/2;
   M.forEach((m,i)=>{tag(tx,236,m,{size:17,bg:['rgba(88,184,208,.3)','rgba(125,255,196,.25)','rgba(179,124,255,.3)'][i],fg:'#fff'});tx+=ws[i]+20;});});
  const V=[[120,.04,1],[610,.3,2],[1100,.58,3]];
  const R=['圖表加上顏色與總計','加一個匯出 CSV 按鈕'];
  V.forEach((v,i)=>{const x=v[0],a=easeOut(seg(u,v[1],v[1]+.1));
   if(i>0){alphaDo(seg(u,v[1]-.08,v[1]),()=>{arrow(x-100,480,x-12,480,CY,3);
     bub(x-230,310,210,R[i-1],'user',1);});}
   alphaDo(a,()=>{
    const latest=(i===2&&u>.68)||(i===1&&u>.4&&u<.58)||(i===0&&u<.3);
    winFrame(x,380,380,300,trf('第 {n} 版',{n:v[2]}),{st:latest?CY:KC.border,lw:latest?2.5:1.4});
    miniTool(x+16,440,348,224,v[2],1);
   });
  });
  alphaDo(seg(u,.8,.86),()=>{
   rrp(520,720,560,64,12);ctx.fillStyle='rgba(7,27,39,.85)';ctx.fill();ctx.strokeStyle=CY;ctx.lineWidth=1.5;ctx.stroke();
   wt(548,760,'分享版本：',19,CT,600);
   let tx=548+wtw('分享版本：',19,600)+12;
   tx+=tag(tx,752,'最新版',{size:17})+10;tag(tx,752,'第 2 版',{size:17,bg:'rgba(255,255,255,.14)',fg:'#fff'});
  });
  lab(1290,380,'最新版',{dx:90,dy:-50,st:'s',a:band(u,.7,.8)});
 }}
]};
