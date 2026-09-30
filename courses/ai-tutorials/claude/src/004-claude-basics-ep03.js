// KITS: claude
/* 004-claude-basics-ep03 — 上下文與記憶（Claude AI 應用動畫館・入門基礎 第 3 集）
   介面皆為示意圖重新繪製，不含官方 logo 或截圖。 */

/* ── 本集輔助：先翻譯再換行（中日文逐字、英文逐詞，行首禁則） ── */
function fsz(size){return Math.max(size,9.5/(fit*cam.s));}
const NOSTART='、。，．・：；？！）」』】〉》ー…％,.;:!?)';
function wrapL(t,maxW,size,weight){
  t=tr(t);ctx.font=`${weight||500} ${fsz(size)}px ${FONT}`;
  const cjk=/[぀-ヿ㐀-鿿]/.test(t);
  const toks=cjk?(t.match(/[A-Za-z0-9.\-+×%\/]+|\s+|./g)||[]):t.split(/(\s+)/).filter(s=>s.length);
  const L=[];let cur='';
  for(const k of toks){
    const test=cur+k;
    if(ctx.measureText(test).width>maxW&&cur.trim().length){
      if(NOSTART.includes(k)){cur=test;continue;}
      L.push(cur.trimEnd());cur=k.trimStart();
    }else cur=test;
  }
  if(cur.trim().length)L.push(cur.trimEnd());
  return L;
}
function wtext(x,y,t,maxW,size,col,weight,lh,align){
  const L=wrapL(t,maxW,size,weight);
  ctx.font=`${weight||500} ${fsz(size)}px ${FONT}`;ctx.fillStyle=col||'#fff';
  ctx.textAlign=align||'left';ctx.textBaseline='alphabetic';
  L.forEach((l,i)=>ctx.fillText(l,x,y+i*(lh||size*1.4)));
  ctx.textAlign='left';return L.length;
}
/* 訊息泡泡：回傳高度 */
function bub(x,y,w,t,role,size){
  size=size||17;const L=wrapL(t,w-28,size,500),lh=size*1.4,h=L.length*lh+22;
  rrp(x,y,w,h,10);ctx.fillStyle=role==='user'?KC.userBub:KC.aiBub;ctx.fill();
  ctx.strokeStyle=KC.border;ctx.lineWidth=1;ctx.stroke();
  ctx.font=`500 ${fsz(size)}px ${FONT}`;ctx.fillStyle=KC.text;ctx.textBaseline='alphabetic';ctx.textAlign='left';
  L.forEach((l,i)=>ctx.fillText(l,x+14,y+11+size+i*lh));
  return h;
}
/* 視窗外框（示意） */
function winFrame(x,y,w,h,title){
  rrp(x,y,w,h,12);ctx.fillStyle=KC.winBg;ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1.5;ctx.stroke();
  rrp(x,y,w,44,12);ctx.fillStyle=KC.winBar;ctx.fill();ln([x,y+44,x+w,y+44],KC.border,1);
  [KC.orange,KC.accent,KC.green].forEach((c,i)=>circ(x+20+i*18,y+22,5,c,'none',0));
  wt(x+w/2,y+29,title,18,KC.text,600,'center');
}
function cursorAt(x,y){poly([x,y,x,y+26,x+7,y+20,x+12,y+31,x+17,y+29,x+12,y+18,x+21,y+18],'#fff','#13232e',1.5);}
function checkRow(x,y,t,ok,a,maxW){alphaDo(a,()=>{
  circ(x+12,y-7,12,ok?'rgba(125,255,196,.18)':'rgba(232,87,42,.18)',ok?KC.green:KC.orange,1.5);
  wt(x+12,y-1,ok?'✓':'×',17,ok?KC.green:KC.orange,700,'center');
  wtext(x+36,y,t,maxW||420,19,KC.text,500);
});}

const EP={no:3,t:'上下文與記憶',en:'Context & Memory',
seriesName:'入門基礎',total:7,
lede:'Claude 一次能看到多少內容？對話太長會怎樣？專案與記憶又如何讓 Claude 記住你的工作背景？本集用「工作桌」的比喻，看懂上下文、專案、記憶與隱私控制。',
facts:[
 ['1M','tokens','付費方案最新模型的上下文視窗；其他模型為 500K 或 200K'],
 ['10×','','付費方案專案知識接近上限時，RAG 最多可擴充的容量'],
 ['5','個','免費帳號最多可建立的專案數'],
 ['3','種','記憶控制：檢視與編輯、暫停、重設'],
],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。功能與數字依 support.claude.com 的上下文視窗、用量與長度限制、專案、聊天搜尋與記憶、無痕對話等說明整理；方案與功能可能調整，資訊截至 2026-09。',
shots:[
/* 1 ── 圖解：上下文視窗＝工作桌 */
{t:'上下文視窗就像工作桌',en:'The context window is a desk',dur:14,
 d:'上下文視窗（context window）可以想成一張工作桌：Claude 每次回覆時，只能看見放在桌上的東西，包括專案指示、上傳的檔案、到目前為止的對話，以及搜尋或連接器帶回的結果。桌面大小以 token 計算，依支援頁說明，付費方案上最新的模型可達 100 萬 tokens，其他模型為 50 萬或 20 萬。桌子再大也有邊界，沒有放上桌的資訊，Claude 就無法參考。',
 s:[[0,'上下文視窗是 Claude 回答時能看到的全部內容'],[.35,'指示、檔案、對話與工具結果都佔用桌面'],[.7,'沒有放上桌的資訊，Claude 就看不到']],
 draw(u){
  diagBG();
  card(70,160,900,480,{bg:'rgba(7,27,39,.75)'});
  wt(96,200,'工作桌＝上下文視窗',22,'#f2c230',700);
  rrp(92,218,856,400,10);ctx.fillStyle='rgba(88,184,208,.06)';ctx.fill();
  const IT=[['專案指示','#f2c230',120,240,250,120,.04,.08],['上傳的檔案','#b37cff',395,240,260,120,.13,.18],['工具與搜尋結果','#7dffc4',680,240,245,120,.22,.07],
            ['對話紀錄','#58b8d0',120,378,535,130,.31,.30],['你的新問題','#ff8a60',680,378,245,130,.40,.03]];
  let used=0;
  IT.forEach(([t,c,x,y,w,h,at,wgt])=>{
   const k=ease(seg(u,at,at+.07));used+=k*wgt;if(k<=0)return;
   alphaDo(k,()=>{const yy=y-(1-k)*30;
    rrp(x,yy,w,h,8);ctx.fillStyle='rgba(19,31,46,.95)';ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=1.6;ctx.stroke();
    box(x,yy+8,5,h-16,c,'none',0);
    wt(x+18,yy+32,t,19,c,700);
    for(let i=0;i<(h>125?4:3);i++)box(x+18,yy+50+i*18,(w-40)*(i%2?.7:.9)*(t==='對話紀錄'&&i%2?.6:1),7,'rgba(227,236,238,.18)','none',0);
   });
  });
  wt(120,550,'桌面使用量',16,'rgba(227,236,238,.75)',500);
  box(120,562,800,20,'rgba(255,255,255,.08)',KC.border,1);
  const col=used>.8?KC.orange:used>.5?KC.accent:KC.green;
  if(used>0)box(120,562,800*used,20,col,'none',0);
  wt(920,550,trf('{n}% 已使用',{n:Math.round(used*100)}),16,col,700,'right',COND);
  alphaDo(ease(seg(u,.68,.76)),()=>{
   ctx.save();ctx.setLineDash([8,6]);rrp(70,668,900,104,12);ctx.strokeStyle=KC.orange;ctx.lineWidth=1.6;ctx.stroke();ctx.setLineDash([]);ctx.restore();
   wtext(100,712,'桌面以外：沒有上傳、沒有提到的資料',840,20,KC.orange,700);
   wtext(100,746,'Claude 看不到，也不會自動知道',840,18,'rgba(227,236,238,.85)',500);
  });
  card(1010,160,530,612,{bg:'rgba(7,27,39,.75)'});
  wt(1036,200,'桌面有多大？',22,'#f2c230',700);
  wtext(1036,236,'以 token 計算（依模型與方案而定）',470,16,'rgba(227,236,238,.7)',500);
  [['最新模型','1M',1,KC.accent],['部分模型','500K',.5,'#58b8d0'],['其他模型','200K',.2,'#b37cff']].forEach(([n,v,r,c],i)=>{
   const k=ease(seg(u,.12+i*.08,.24+i*.08)),y=300+i*92;
   wt(1036,y,n,19,KC.text,600);
   box(1036,y+14,460,22,'rgba(255,255,255,.06)',KC.border,1);
   if(k>0)box(1036,y+14,460*r*k,22,c,'none',0);
   wt(1496,y,v,22,c,700,'right',COND);
  });
  alphaDo(ease(seg(u,.5,.6)),()=>{
   card(1036,590,478,150,{bg:'rgba(242,194,48,.10)',st:KC.accent});
   wt(1060,628,'重點',18,KC.accent,700);
   wtext(1060,662,'Claude 只根據「桌上」的內容回答；桌子越滿，越需要取捨',430,19,KC.text,500);
  });
 }},

/* 2 ── 圖解：長對話的取捨 */
{t:'長對話的取捨',en:'The trade-off of long chats',dur:14,
 d:'對話每多一輪，前面的內容都還留在桌上，上下文因此一路累積。支援頁說明，當對話接近容量上限時，Claude 會自動管理上下文，把較早的訊息整理成摘要，讓多數對話可以繼續（需開啟程式碼執行功能）。代價是：早期的細節可能被濃縮，而觸發自動管理的長對話也會消耗更多用量。重要的規格、數字與決定，需要時最好再明確提供一次。',
 s:[[0,'每一輪對話都會累積在桌面上'],[.38,'接近上限時，Claude 會自動摘要較早的訊息'],[.7,'對話得以繼續，但早期細節可能被濃縮，也更耗用量']],
 draw(u){
  diagBG();
  const c=chartBox(70,160,860,612,{title:'每一輪之後的上下文大小（示意）',x0:.3,x1:12.7,y0:0,y1:100,xt:[1,4,8,12],yt:[0,50,100],xl:'對話輪數',yl:'%',pt:70,gx:4,gy:4});
  const Y90=c.Y(90);
  ctx.save();ctx.setLineDash([10,6]);ln([c.X(.3),Y90,c.X(12.7),Y90],KC.orange,2);ctx.setLineDash([]);ctx.restore();
  wt(c.X(12.6),Y90-10,'上下文上限',16,KC.orange,700,'right');
  const comp=ease(seg(u,.48,.58));
  for(let i=1;i<=12;i++){
   let at=i<=10?.03+(i-1)*.043:.6+(i-11)*.07;
   const k=ease(seg(u,at,at+.04));if(k<=0)continue;
   let raw,sum=0;
   if(i<=9){raw=9*i;}
   else if(i===10){raw=lerp(90,11,comp);sum=lerp(0,18,comp);}
   else{raw=(i-9)*9+2;sum=18;}
   const x=c.X(i)-17,base=c.Y(0);
   if(sum>0)box(x,c.Y(sum),34,base-c.Y(sum),'rgba(125,255,196,.85)','none',0);
   const top=c.Y(sum+raw*k);box(x,top,34,c.Y(sum)-top,raw+sum>80&&comp<.5?KC.orange:'#58b8d0','none',0);
  }
  alphaDo(band(u,.5,.99),()=>{
   const x=c.X(10);arrow(x,c.Y(58),x,c.Y(34),KC.green,2.5);
   tag(x,c.Y(64),'自動摘要',{size:16,bg:KC.green,align:'center'});
  });
  alphaDo(ease(seg(u,.12,.2)),()=>{
   const lx=915-wtw('較早訊息的摘要',15)-24;box(lx,204,18,14,'rgba(125,255,196,.85)','none',0);wt(lx+26,217,'較早訊息的摘要',15,'rgba(227,236,238,.8)',500);
   const lx2=lx-wtw('完整訊息',15)-50;box(lx2,204,18,14,'#58b8d0','none',0);wt(lx2+26,217,'完整訊息',15,'rgba(227,236,238,.8)',500);
  });
  card(970,160,570,612,{bg:'rgba(7,27,39,.75)'});
  wt(996,200,'長對話的取捨',22,'#f2c230',700);
  alphaDo(ease(seg(u,.08,.16)),()=>wtext(996,244,'每次回覆，桌上既有的對話都會一起被讀取',510,18,'rgba(227,236,238,.85)',500));
  alphaDo(ease(seg(u,.6,.68)),()=>{
   card(996,300,518,150,{bg:'rgba(125,255,196,.08)',st:KC.green});
   wt(1020,340,'好處',19,KC.green,700);
   checkRow(1020,384,'大多數對話可以繼續下去',true,1,450);
   checkRow(1020,424,'不必手動整理前文',true,1,450);
  });
  alphaDo(ease(seg(u,.72,.8)),()=>{
   card(996,470,518,170,{bg:'rgba(232,87,42,.08)',st:KC.orange});
   wt(1020,510,'代價',19,KC.orange,700);
   checkRow(1020,554,'早期細節可能被濃縮',false,1,450);
   checkRow(1020,594,'長對話消耗更多用量',false,1,450);
  });
  alphaDo(ease(seg(u,.84,.92)),()=>wtext(996,684,'重要的規格與數字，需要時再明確提供一次',510,18,KC.accent,600));
 }},

/* 3 ── 場景：專案 Projects */
{t:'專案：固定知識與指示',en:'Projects: standing knowledge & instructions',dur:14,side:true,
 base:()=>{claudeBase();floatParticles(22,7);},end:()=>{},
 d:'專案（Projects）是自成一區的工作空間，有自己的對話紀錄與知識庫。把課程大綱、規格書或參考資料上傳到專案知識，再寫下專案指示，例如語氣、格式或引用方式；之後在專案裡開的每段對話都能直接使用，不必每次重新上傳。免費帳號最多可建立 5 個專案；付費方案在專案知識接近上下文上限時，會自動啟用檢索增強生成（RAG），容量最多擴充約 10 倍。',
 s:[[0,'把常用資料放進專案知識'],[.33,'專案指示會套用到專案內的每段對話'],[.7,'知識接近上限時，付費方案會啟用 RAG 擴充容量']],
 draw(u){
  winFrame(80,170,1100,610,'專案：期末報告（示意）');
  ln([540,214,540,780],KC.border,1);
  wt(104,248,'專案指示',18,KC.accent,700);
  rrp(104,262,412,96,8);ctx.fillStyle='rgba(242,194,48,.08)';ctx.fill();ctx.strokeStyle='rgba(242,194,48,.5)';ctx.lineWidth=1.2;ctx.stroke();
  alphaDo(ease(seg(u,.3,.4)),()=>wtext(120,296,'以正式語氣回答；引用資料時標註頁碼',380,17,KC.text,500));
  wt(104,396,'專案知識',18,'#b37cff',700);
  [['課程大綱','PDF','12 頁'],['訪談紀錄','DOCX','8 份'],['問卷數據','CSV','320 筆']].forEach(([n,e,p],i)=>{
   const k=seg(u,.04+i*.07,.12+i*.07);if(k<=0)return;
   ctx.save();ctx.translate(0,(1-ease(k))*-24);fileCard(104,412+i*84,412,n,e,{u:k,preview:p});ctx.restore();
  });
  wt(564,248,'專案內的對話',18,'#58b8d0',700);
  const CH=['第 3 章摘要','訪談重點整理','結論段落草稿'];
  CH.forEach((t,i)=>{
   const k=ease(seg(u,.42+i*.08,.5+i*.08));if(k<=0)return;
   const y=272+i*96;
   alphaDo(k,()=>{rrp(564,y,592,76,8);ctx.fillStyle='rgba(42,92,140,.35)';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1;ctx.stroke();
    wt(588,y+32,t,18,KC.text,600);wt(588,y+58,'已套用指示與知識',14,KC.green,500);});
   connLine(516,310,564,y+38,{u:k,flow:true,col:KC.accent,lw:1.5});
   connLine(516,538,564,y+38,{u:k,flow:true,col:'#b37cff',lw:1.5});
  });
  lab(310,262,'每段對話都套用',{dx:40,dy:-44,st:'s',a:band(u,.36,.66)});
  lab(310,660,'只需上傳一次',{dx:60,dy:40,a:band(u,.2,.62)});
  alphaDo(ease(seg(u,.7,.78)),()=>{
   wt(564,600,'專案知識容量',16,'rgba(227,236,238,.8)',600);
   const f=ease(seg(u,.72,.84)),g=ease(seg(u,.84,.95));
   box(564,614,300,22,'rgba(255,255,255,.08)',KC.border,1);
   box(564,614,300*lerp(.2,.96,f),22,f>.9?KC.orange:KC.accent,'none',0);
   if(g>0){box(866,614,290*g,22,'rgba(125,255,196,.35)',KC.green,1);}
   alphaDo(g,()=>wtext(564,678,'RAG 模式：接近上限時自動啟用，容量最多約 10 倍（付費方案）',590,16,KC.green,600));
  });
  alphaDo(ease(seg(u,.55,.65)),()=>{
   card(1212,360,328,300,{bg:'rgba(7,27,39,.8)'});
   wt(1234,398,'和一般對話相比',18,KC.accent,700);
   checkRow(1234,448,'資料只上傳一次',true,1,270);
   checkRow(1234,508,'指示自動套用',true,1,270);
   checkRow(1234,568,'對話集中管理',true,1,270);
  });
 },
 hud(u){hudPanel(250,140,'專案重點',seg(u,.2,.28),w=>{hrow(58,'免費帳號','最多 5 個',w);hrow(88,'付費方案','RAG ≤10×',w,'#7dffc4');hrow(118,'團隊方案','可共享',w,'#f2c230');});}},

/* 4 ── 圖解：記憶 */
{t:'記憶：跨對話記住重點',en:'Memory across chats',dur:13,
 d:'記憶功能讓 Claude 跨對話記住與你工作相關的背景。依支援頁說明，Claude 會在聊天過程中把資訊存成一個個主題，而不是等對話結束才統一整理；每個專案另有獨立的記憶空間與摘要，彼此不會混在一起。記憶在 Free、Pro、Max 方案預設開啟；Team 與 Enterprise 預設關閉，需由擁有者為組織啟用。付費方案另可搜尋過去的對話。',
 s:[[0,'Claude 會在對話中把重點記成一個個主題'],[.4,'新對話可以沿用這些背景，不必從頭說明'],[.72,'每個專案有獨立的記憶空間，彼此不混用']],
 draw(u){
  diagBG();
  wt(80,196,'過去的對話',19,'#58b8d0',700);
  const PC=['「我在高中教物理」','「請用繁體中文回答」','「期末報告做到第 3 章」'];
  PC.forEach((t,i)=>{const k=ease(seg(u,.02+i*.08,.1+i*.08));alphaDo(k,()=>bub(80,214+i*96,330,t,'user',17));});
  card(500,176,470,354,{bg:'rgba(7,27,39,.8)',st:KC.accent});
  wt(526,216,'記憶（依主題保存）',20,KC.accent,700);
  const TP=['職業：高中物理老師','偏好：繁體中文回答','進行中：期末報告'];
  TP.forEach((t,i)=>{
   const k=ease(seg(u,.1+i*.08,.18+i*.08));
   agentArrow(412,250+i*96,500,262+i*80,{u:k,active:band(u,.08+i*.08,.3+i*.08)});
   alphaDo(k,()=>tag(526,272+i*80,t,{size:18,bg:'rgba(242,194,48,.9)'}));
  });
  const k2=ease(seg(u,.4,.48));
  agentArrow(970,352,1060,352,{u:k2,active:band(u,.4,.7)});
  alphaDo(k2,()=>{
   card(1060,176,480,354,{bg:'rgba(7,27,39,.8)'});
   wt(1084,216,'新的對話',19,'#58b8d0',700);
   const h=bub(1084,240,432,'幫我出一份段考複習題','user',17);
   alphaDo(ease(seg(u,.5,.58)),()=>bub(1084,256+h,432,'好的，以下是高中物理的複習題（繁體中文）…','ai',17));
  });
  alphaDo(ease(seg(u,.7,.78)),()=>{
   card(80,566,1460,210,{bg:'rgba(7,27,39,.75)'});
   wt(106,604,'記憶空間彼此分開',20,KC.accent,700);
   [['一般對話',['職業','偏好']],['專案 A：期末報告',['章節進度','引用格式']],['專案 B：社團活動',['成員名單','活動日期']]].forEach(([n,ch],i)=>{
    const x=106+i*478,kk=ease(seg(u,.72+i*.05,.8+i*.05));
    alphaDo(kk,()=>{rrp(x,622,450,136,10);ctx.fillStyle='rgba(88,184,208,.08)';ctx.fill();ctx.strokeStyle='#58b8d0';ctx.lineWidth=1.6;ctx.stroke();
     wt(x+20,656,n,18,KC.text,700);
     let cx=x+20;ch.forEach(c=>{cx+=tag(cx,712,c,{size:16,bg:'rgba(125,200,220,.85)'})+12;});});
   });
  });
 }},

/* 5 ── 場景：隱私控制 */
{t:'記憶的隱私控制',en:'Memory privacy controls',dur:13,side:true,
 base:()=>{claudeBase();floatParticles(22,11);},end:()=>{},
 d:'記憶的內容由使用者掌控。在「設定 > 記憶」可以看到 Claude 記住的主題，並逐項編輯或刪除；選擇「暫停」時，既有記憶會保留，但 Claude 不會使用記憶，也不會新增；選擇「重設」則會永久刪除所有記憶，包括專案記憶，而且無法復原。若某段對話不想留下紀錄，可以使用無痕對話：它不會存入聊天紀錄，也不會出現在記憶或過去對話的搜尋中（Team 與 Enterprise 仍依組織保留政策納入資料匯出）。',
 s:[[0,'在「設定 > 記憶」可檢視、編輯或刪除個別記憶'],[.33,'暫停：保留既有記憶，但不使用也不新增'],[.58,'重設：永久刪除全部記憶，無法復原'],[.8,'不想被記住的對話，可以改用無痕對話']],
 draw(u){
  winFrame(80,170,860,610,'設定 › 記憶（示意）');
  const TP=['職業：高中物理老師','偏好：繁體中文回答','進行中：期末報告','興趣：天文攝影'];
  const del=ease(seg(u,.24,.32));
  TP.forEach((t,i)=>{
   const y=236+i*62,a=i===3?1-del:1;
   alphaDo(a,()=>{rrp(106,y,808,50,8);ctx.fillStyle='rgba(42,92,140,.28)';ctx.fill();
    wt(126,y+32,t,18,KC.text,500);
    wt(836,y+33,'✎',20,KC.sub,500,'center');wt(882,y+33,'×',22,i===3&&u>.2?KC.orange:KC.sub,700,'center');
    if(i===3&&del>0)ln([126,y+26,126+wtw(t,18)*del,y+26],KC.orange,2);});
  });
  ln([106,500,914,500],KC.border,1);
  const on=u<.44;const sw=ease(seg(u,.42,.47));
  wt(126,548,'暫停記憶',19,KC.text,600);
  wtext(126,576,'保留既有記憶，但不使用、不新增',520,15,'rgba(227,236,238,.7)',500);
  rrp(820,522,70,34,17);ctx.fillStyle=sw>.5?'rgba(242,194,48,.9)':'rgba(255,255,255,.14)';ctx.fill();
  circ(lerp(838,872,sw),539,13,'#fff','none',0);
  const rs=band(u,.58,.97);
  wt(126,650,'重設記憶',19,KC.orange,700);
  rrp(740,622,150,40,8);ctx.fillStyle=rs>.5?'rgba(232,87,42,.85)':'rgba(232,87,42,.15)';ctx.fill();ctx.strokeStyle=KC.orange;ctx.lineWidth=1.5;ctx.stroke();
  wt(815,648,'重設',17,rs>.5?'#fff':KC.orange,700,'center');
  alphaDo(rs,()=>wtext(126,690,'永久刪除所有記憶（含專案記憶），無法復原',560,17,KC.orange,600));
  const P=kf(u,[[0,560,720],[.16,880,440],[.3,880,440],[.38,860,545],[.5,860,545],[.56,815,648],[.8,815,648],[.9,1240,400],[1,1240,400]]);
  cursorAt(P.x,P.y);
  alphaDo(ease(seg(u,.8,.88)),()=>{
   card(990,170,550,610,{bg:'rgba(7,27,39,.85)',st:'#b37cff'});
   circ(1050,236,26,'rgba(179,124,255,.18)','#b37cff',2);
   ctx.save();ctx.setLineDash([4,4]);ring(1050,236,36,'#b37cff',1.2);ctx.setLineDash([]);ctx.restore();
   wt(1092,246,'無痕對話',24,'#b37cff',700);
   checkRow(1016,330,'不存入聊天紀錄',false,1,460);
   checkRow(1016,392,'不寫入記憶',false,1,460);
   checkRow(1016,454,'不出現在過去對話搜尋',false,1,460);
   wtext(1016,540,'所有使用者皆可使用；Team 與 Enterprise 依組織保留政策納入資料匯出',490,16,'rgba(227,236,238,.75)',500);
  });
 }},

/* 6 ── 圖解：何時該開新對話 */
{t:'何時該開新對話',en:'When to start a new chat',dur:14,
 d:'開新對話等於換一張乾淨的桌子。換了新主題、對話拉得很長而回答開始偏離重點，或快要用完用量時，都適合重新開始；支援頁也建議，長對話接近用量上限時可以改開新對話，或用專案處理大量資料。開新對話前，可以先請 Claude 把目前的結論、決定與待辦整理成一段摘要，再貼到新對話；會反覆用到的資料則放進專案知識，讓每段對話都能取用。',
 s:[[0,'話題改變或回答開始偏離，就是開新對話的訊號'],[.36,'長對話接近用量上限時，新對話更省用量'],[.66,'先請 Claude 整理重點，再帶到新對話繼續']],
 draw(u){
  diagBG();
  card(70,160,760,612,{bg:'rgba(7,27,39,.75)'});
  wt(96,200,'開新對話的四個訊號',22,'#f2c230',700);
  ['換了一個新主題','對話很長，回答開始偏離','接近用量上限','想要不受前文影響的新起點'].forEach((t,i)=>{
   const k=ease(seg(u,.04+i*.1,.12+i*.1)),y=250+i*120;
   alphaDo(.25+.75*k,()=>{rrp(96,y,708,96,10);ctx.fillStyle=k>.5?'rgba(242,194,48,.10)':'rgba(255,255,255,.04)';ctx.fill();ctx.strokeStyle=k>.5?KC.accent:KC.border;ctx.lineWidth=1.4;ctx.stroke();
    circ(140,y+48,22,k>.5?KC.accent:'rgba(30,58,85,.9)',k>.5?KC.accent:KC.border,1.5);
    wt(140,y+56,String(i+1),22,k>.5?'#0e2133':KC.sub,700,'center',COND);
    wtext(182,y+56,t,600,20,KC.text,600);});
  });
  card(870,160,670,612,{bg:'rgba(7,27,39,.75)'});
  wt(896,200,'帶走重點，重新開始',22,'#f2c230',700);
  ['請 Claude 整理結論、決定與待辦','把常用資料放進專案知識','在新對話貼上摘要，繼續工作'].forEach((t,i)=>{
   const k=ease(seg(u,.46+i*.1,.54+i*.1)),y=240+i*92;
   alphaDo(k,()=>{tag(896,y+30,String(i+1),{size:18,r:8});wtext(944,y+38,t,560,20,KC.text,500);});
  });
  alphaDo(ease(seg(u,.76,.82)),()=>{
   const y=560;
   rrp(900,y,250,170,10);ctx.fillStyle='rgba(88,184,208,.08)';ctx.fill();ctx.strokeStyle=KC.orange;ctx.lineWidth=1.4;ctx.stroke();
   wt(1025,y+32,'舊對話',17,KC.orange,700,'center');
   for(let i=0;i<5;i++)box(918+(i%2)*12,y+50+i*22,190-(i%3)*30,12,'rgba(88,184,208,.45)','none',0);
   rrp(1260,y,250,170,10);ctx.fillStyle='rgba(88,184,208,.08)';ctx.fill();ctx.strokeStyle=KC.green;ctx.lineWidth=1.4;ctx.stroke();
   wt(1385,y+32,'新對話',17,KC.green,700,'center');
   arrow(1156,y+85,1254,y+85,KC.accent,2.5);
   const m=ease(seg(u,.84,.95));
   tag(lerp(960,1285,m),y+lerp(95,70,m),'重點摘要',{size:16,bg:KC.green});
  });
 }},
]};
