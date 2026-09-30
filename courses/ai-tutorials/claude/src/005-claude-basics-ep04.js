// KITS: claude
/* 005-claude-basics-ep04 — 檔案與圖片（Claude AI 應用動畫館・入門基礎 第 4 集）
   資訊查證：support.claude.com〈Upload files to Claude〉〈Create and edit files with Claude〉、
   platform.claude.com〈PDF support〉，資訊截至 2026-09。介面皆為示意圖。 */
const C4={y:'#f2c230',o:'#e8572a',g:'#7dffc4',b:'#58b8d0',c:'#7dc8dc',p:'#b37cff',t:'#ffffff',s:'rgba(227,236,238,.8)',card:'rgba(7,27,39,.75)'};
/* 先翻譯再換行；中日文避免句讀落在行首 */
function wrapL(t,maxW,size,wg){
  t=tr(t);const toks=t.match(/[A-Za-z0-9'’.,:;%\-\/()+×≤≥]+\s*|\s+|./gu)||[];
  const lines=[];let cur='';
  for(const k of toks){
    const test=cur+k;
    if(cur&&wtw(test.trimEnd(),size,wg)>maxW){
      if(/^[。、，．：；）」』！？ー・%]/.test(k)){cur+=k;continue;}
      lines.push(cur.trimEnd());cur=k.trimStart();
    }else cur=test;
  }
  if(cur.trim())lines.push(cur.trimEnd());
  return lines;
}
function para(x,y,t,maxW,size,col,wg,lh){const L=wrapL(t,maxW,size,wg);L.forEach((s,i)=>wt(x,y+i*(lh||size*1.45),s,size,col,wg));return L.length;}
function winFrame(x,y,w,h,title){
  rrp(x,y,w,h,12);ctx.fillStyle=KC.winBg;ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1.5;ctx.stroke();
  box(x+1,y+1,w-2,40,KC.winBar,'none',0);ln([x,y+41,x+w,y+41],KC.border,1);
  [KC.orange,KC.accent,KC.green].forEach((c,i)=>circ(x+20+i*18,y+21,5,c,'none',0));
  wt(x+w/2,y+27,title,17,KC.text,600,'center');
}
function bub(x,y,w,t,role,a,size){
  size=size||19;const L=wrapL(t,w-32,size,500),h=L.length*size*1.45+26;
  alphaDo(a,()=>{rrp(x,y,w,h,12);ctx.fillStyle=role==='user'?KC.userBub:KC.aiBub;ctx.fill();
    L.forEach((s,i)=>wt(x+16,y+13+size+i*size*1.45-3,s,size,KC.text,500));});
  return h;
}
function check(x,y,col,a){alphaDo(a,()=>{circ(x,y,13,'rgba(125,255,196,.14)',col,2);ln([x-6,y,x-1.5,y+5,x+7,y-5],col,3);});}
function pageThumb(x,y,w,h,n,hl,chart){
  rrp(x,y,w,h,4);ctx.fillStyle=hl?'rgba(242,194,48,.22)':'rgba(227,236,238,.92)';ctx.fill();
  ctx.strokeStyle=hl?C4.y:'rgba(255,255,255,.3)';ctx.lineWidth=hl?3:1;ctx.stroke();
  for(let i=0;i<5;i++)box(x+8,y+12+i*(h-34)/6,(w-16)*(i%3===2?.6:.9),3,hl?'rgba(242,194,48,.8)':'rgba(19,35,46,.35)','none',0);
  if(chart){[.4,.7,.55,.9].forEach((v,i)=>box(x+10+i*(w-20)/4,y+h-22-v*(h*.28),(w-20)/4-4,v*(h*.28),i===3?C4.o:C4.b,'none',0));}
  wt(x+w/2,y+h+18,'p.'+n,14,hl?C4.y:C4.s,700,'center',COND);
}
const EP={no:4,t:'檔案與圖片',en:'Files & Images',
seriesName:'入門基礎',total:7,
lede:'把 PDF、照片和試算表直接交給 Claude：它怎麼讀、能讀多少、怎麼讓答案可以回頭核對。',
facts:[['20','個','每個對話最多可上傳的檔案數'],['500','MB','單一檔案的大小上限'],['1,000','頁','PDF 可上傳的頁數上限'],['100','頁','PDF 在這個頁數以內，圖表等視覺內容也會分析'],['8000×8000','px','圖片的最大尺寸']],
note:'說明：本集為教育用途示意動畫，介面皆為重新繪製的示意圖，非官方截圖。規格依 support.claude.com〈Upload files to Claude〉〈Create and edit files with Claude〉與 Claude 平台文件〈PDF support〉整理，資訊截至 2026-09，實際以官方最新說明為準。',
base:()=>{claudeBase();floatParticles(22,7);},
shots:[
{t:'上傳 PDF 並摘要',en:'Upload a PDF and summarize',dur:14,side:true,
 d:'最常見的用法：把檔案拖進對話框或按迴紋針上傳，再說明你要什麼。每個對話最多可放 20 個檔案、單檔 500 MB，PDF 最多 1,000 頁。提問時講清楚讀者與格式，例如「給主管看的五點摘要」，比單純說「幫我摘要」得到更好用的結果。',
 s:[[0,'把 PDF 拖進對話框，檔案卡出現在輸入區'],[.33,'說明用途與格式：五點摘要、給主管看'],[.62,'Claude 讀完全文，依要求整理出重點']],
 draw(u){
  const X=90,Y=150,W=1040,H=650;winFrame(X,Y,W,H,'Claude');
  // 輸入框
  rrp(X+30,Y+H-92,W-60,66,12);ctx.fillStyle='rgba(255,255,255,.05)';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1.2;ctx.stroke();
  // 檔案卡飛入
  const f=ease(seg(u,.03,.2)),fx=lerp(-240,X+50,f),fy=lerp(Y+H-260,Y+H-176,f);
  const sent=seg(u,.3,.36);
  if(sent<1)alphaDo(1-sent,()=>fileCard(fx,fy,270,'年度報告.pdf','PDF',{u:f,preview:'48 頁'}));
  alphaDo(band(u,.12,.3),()=>{wt(X+320,Y+H-51,'用五點摘要這份報告，給主管看',19,C4.s,500);typeCursor(X+320+wtw('用五點摘要這份報告，給主管看',19,500)+6,Y+H-46);});
  // 送出後的訊息
  const a1=ease(seg(u,.33,.4));
  alphaDo(a1,()=>{fileCard(X+W-330,Y+64,290,'年度報告.pdf','PDF',{preview:'48 頁'});});
  bub(X+W-500,Y+148,460,'用五點摘要這份報告，給主管看','user',a1,18);
  const pts=['營收成長 12%，主要來自海外市場','毛利率下滑 2 個百分點','研發投入增加三成','第四季現金流轉正','明年最大風險：原料價格'];
  const a2=seg(u,.45,.5);
  alphaDo(ease(a2),()=>{rrp(X+40,Y+240,640,300,12);ctx.fillStyle=KC.aiBub;ctx.fill();wt(X+60,Y+278,'五點摘要',19,C4.y,700);});
  if(a2>0&&u<.52)claudeTypingDot(X+70,Y+310);
  pts.forEach((p,i)=>{const a=ease(seg(u,.52+i*.06,.58+i*.06));alphaDo(a,()=>{circ(X+68,Y+318+i*46,5,C4.y,'none',0);wt(X+86,Y+325+i*46,p,18,KC.text,500);});});
  lab(fx+30,fy+36,'拖放或按迴紋針上傳',{dx:90,dy:-60,a:band(u,.06,.3)});
  lab(X+W-190,Y+100,'檔案附在訊息上',{dx:-40,dy:80,st:'s',a:band(u,.38,.6),minor:true});
 },
 hud(u){hudPanel(300,176,'上傳規格',seg(u,.08,.16),w=>{hrow(56,'每個對話','20 個',w,C4.y);hrow(90,'單一檔案','500 MB',w);hrow(124,'PDF 頁數','≤ 1,000 頁',w);htext(12,160,'資訊截至 2026-09',13,C4.s);});}},

{t:'Claude 怎麼讀 PDF',en:'How Claude reads a PDF',dur:14,
 d:'PDF 的每一頁都會同時變成兩種材料：擷取出的文字，以及整頁的影像。文字讓 Claude 讀懂內容，影像讓它看得懂圖表、示意圖與版面。100 頁以內的 PDF 兩者都用；101 到 1,000 頁的長文件只處理文字、不分析圖表。Word 等其他文件格式只擷取文字，內嵌的圖片不會被解讀。',
 s:[[0,'每一頁都拆成「文字」與「頁面影像」兩條路'],[.36,'兩者一起送進 Claude，所以看得懂圖表'],[.66,'超過 100 頁時，只讀文字、不分析圖表']],
 draw(u){
  diagBG();
  // 左：頁面拆成兩條
  card(60,160,800,620,{bg:C4.card});wt(90,204,'一頁 PDF 的兩條路',21,C4.y,700);
  const a0=ease(seg(u,0,.12));
  alphaDo(a0,()=>pageThumb(110,300,150,200,7,false,true));
  const a1=seg(u,.1,.32);
  // 文字路徑
  alphaDo(ease(a1),()=>{
    arrow(275,360,430,300,C4.g,3);arrow(275,450,430,520,C4.b,3);
    card(440,250,190,100,{bg:'rgba(125,255,196,.1)',st:C4.g});wt(535,290,'擷取文字',20,C4.g,700,'center');wt(535,322,'內容、數字、表格文字',14,C4.s,500,'center');
    card(440,470,190,100,{bg:'rgba(88,184,208,.12)',st:C4.b});wt(535,510,'頁面影像',20,C4.b,700,'center');wt(535,542,'圖表、示意圖、版面',14,C4.s,500,'center');
  });
  const a2=seg(u,.3,.45);
  alphaDo(ease(a2),()=>{arrow(640,300,730,395,C4.g,3);arrow(640,520,730,425,C4.b,3);});
  agentNode(775,410,40,'Claude',{u:ease(a2),active:0.5+0.5*Math.sin(TT*2)*a2,icon:'◎'});
  alphaDo(band(u,.42,1),()=>para(90,650,'兩者一起分析，才能回答「這張圖表的趨勢是什麼」。',740,18,C4.s,500));
  // 右：頁數與模式
  card(900,160,640,620,{bg:C4.card});wt(930,204,'頁數決定讀法',21,C4.y,700);
  const bx=940,by=330,bw=560,bh=44,x100=bx+bw*0.18;
  const a3=ease(seg(u,.5,.62));
  alphaDo(a3,()=>{
    box(bx,by,x100-bx,bh,'rgba(125,255,196,.35)',C4.g,1.5);box(x100,by,bx+bw-x100,bh,'rgba(88,184,208,.18)',C4.b,1.5);
    wt(bx,by-32,'1',15,C4.s,600,'left',COND);wt(x100,by-32,'100',15,C4.s,600,'center',COND);wt(bx+bw,by-32,'1,000 頁',15,C4.s,600,'right',COND);
    wt(bx,by+84,'文字＋圖表',19,C4.g,700);wt(bx,by+112,'視覺內容也會分析',15,C4.s,500);
    wt(bx+bw,by+84,'只讀文字',19,C4.b,700,'right');wt(bx+bw,by+112,'圖表不分析',15,C4.s,500,'right');
  });
  // 指標滑動
  const pg=seg(u,.62,.9),px=lerp(bx+20,bx+bw-30,ease(pg));
  alphaDo(seg(u,.6,.64),()=>{poly([px,by-2,px-10,by-22,px+10,by-22],C4.y);ln([px,by,px,by+bh],C4.y,3);});
  const pages=Math.round(pg<=0?1:lerp(1,1000,Math.pow(ease(pg),1.6)));
  alphaDo(seg(u,.62,.66),()=>{
    const vis=pages<=100;
    tag(1220,560,trf('{n} 頁的 PDF',{n:pages.toLocaleString('en-US')}),{size:22,bg:vis?C4.g:C4.b,fg:'#0e2a3b',align:'center'});
    wt(1220,640,vis?'文字與頁面影像都用上':'只處理文字',20,vis?C4.g:C4.b,700,'center');
  });
  alphaDo(band(u,.78,1),()=>para(930,700,'Word、TXT 等其他格式只擷取文字，內嵌圖片不會解讀。',580,16,C4.s,500));
 }},

{t:'拍照看圖：圖表、手寫、截圖',en:'Photos: charts, handwriting, screenshots',dur:14,
 d:'圖片也能直接提問。一張圖表可以請 Claude 讀出趨勢與關鍵數值；手寫筆記可以轉成可編輯的文字；錯誤畫面的截圖可以請它解釋原因與下一步。支援 JPEG、PNG、GIF、WebP，單張最大 8000×8000 像素；官方建議圖片至少 1000×1000 像素，字跡與數字會更清楚。',
 s:[[0,'圖表照片：讀出趨勢與關鍵數值'],[.33,'手寫筆記：轉成可編輯的文字'],[.64,'錯誤截圖：解釋原因與下一步']],
 draw(u){
  diagBG();
  const cols=[{x:70,t:'圖表',out:'讀出趨勢與數值',col:C4.b},{x:560,t:'手寫筆記',out:'轉成可編輯文字',col:C4.p},{x:1050,t:'截圖',out:'解釋錯誤與下一步',col:C4.o}];
  cols.forEach((c,i)=>{
    const a=ease(seg(u,i*.3,i*.3+.1));
    alphaDo(a,()=>{
      card(c.x,160,480,470,{bg:C4.card,st:c.col});wt(c.x+24,202,c.t,22,c.col,700);
      const ix=c.x+40,iy=230,iw=400,ih=230;
      rrp(ix,iy,iw,ih,6);ctx.fillStyle='rgba(227,236,238,.92)';ctx.fill();
      if(i===0){[.35,.5,.45,.7,.85].forEach((v,k)=>box(ix+30+k*72,iy+ih-20-v*170,48,v*170,k===4?C4.o:'#1f7f99','none',0));ln([ix+20,iy+ih-20,ix+iw-20,iy+ih-20],'#13232e',2);}
      if(i===1){ctx.save();ctx.strokeStyle='#2b3a55';ctx.lineWidth=2.5;for(let r=0;r<5;r++){ctx.beginPath();for(let q=0;q<=60;q++){const xx=ix+24+q*5.6*(r===4?.6:1),yy=iy+40+r*40+Math.sin(q*.9+r)*6+nz(q*.3+r*7)*4;q?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}ctx.restore();}
      if(i===2){box(ix+14,iy+14,iw-28,30,'#1a2d42','none',0);rrp(ix+60,iy+70,iw-120,120,8);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle=C4.o;ctx.lineWidth=3;ctx.stroke();circ(ix+100,iy+130,18,C4.o,'none',0);wt(ix+100,iy+138,'!',24,'#fff',800,'center');box(ix+135,iy+112,180,10,'#9aa8b0','none',0);box(ix+135,iy+138,130,10,'#c3cdd2','none',0);}
      // 掃描線
      const sc=seg(u,i*.3+.06,i*.3+.2);
      if(sc>0&&sc<1)alphaDo(.8,()=>{box(ix,iy+ih*sc-2,iw,4,C4.y,'none',0);});
    });
    const ao=ease(seg(u,i*.3+.18,i*.3+.26));
    alphaDo(ao,()=>{arrow(c.x+240,475,c.x+240,515,c.col,3);tag(c.x+240,560,c.out,{size:21,bg:c.col,fg:'#0e2a3b',align:'center'});});
  });
  const af=ease(seg(u,.86,.94));
  alphaDo(af,()=>{card(70,660,1460,120,{bg:'rgba(242,194,48,.08)',st:C4.y});
    wt(110,708,'支援格式',17,C4.s,600);wt(110,746,'JPEG / PNG / GIF / WebP',22,C4.t,700,'left',COND);
    wt(620,708,'最大尺寸',17,C4.s,600);wt(620,746,'8000×8000 px',24,C4.y,700,'left',COND);
    wt(1030,708,'建議解析度',17,C4.s,600);wt(1030,746,'≥ 1000×1000 px',24,C4.g,700,'left',COND);});
 }},

{t:'試算表分析',en:'Spreadsheet analysis',dur:14,side:true,
 d:'上傳 CSV 或 Excel 後，Claude 可以在安全的程式執行環境中寫 Python 讀取資料、加總、找異常並畫出圖表，還能輸出新的 Excel 檔。上傳 XLSX 需要先在「設定 > 功能」開啟「程式碼執行與檔案建立」；個人方案預設已開啟。答案附上計算步驟，就能自己驗算。',
 s:[[0,'上傳銷售資料，請 Claude 依月份分析'],[.3,'它在沙盒裡寫 Python，實際計算'],[.62,'畫出圖表、輸出新的 Excel，並附上步驟']],
 draw(u){
  const a0=ease(seg(u,0,.1));
  alphaDo(a0,()=>{fileCard(80,190,300,'sales.xlsx','XLSX',{preview:'1,248 列'});fileCard(80,290,300,'regions.csv','CSV',{preview:'12 列'});});
  alphaDo(band(u,.05,1),()=>{tag(560,184,'設定 > 功能：程式碼執行與檔案建立',{size:18,bg:'rgba(242,194,48,.18)',fg:C4.y,align:'center'});});
  const a1=seg(u,.2,.3);
  alphaDo(ease(a1),()=>{arrow(390,280,450,330,C4.y,3);});
  terminal(450,230,560,300,{u:seg(u,.28,.62),title:'Python sandbox',lines:['$ python analyze.py','讀取 sales.xlsx：1,248 列','依月份加總營收…','找出異常：3 月退貨偏高','輸出 chart.png、summary.xlsx']});
  // 圖表
  const a2=seg(u,.58,.8);
  alphaDo(ease(seg(u,.55,.6)),()=>{
    card(1060,190,480,340,{bg:C4.card});wt(1084,230,'月營收（示例）',19,C4.y,700);
    const vals=[.45,.52,.3,.6,.72,.8],bw=52;
    vals.forEach((v,i)=>{const hh=v*220*ease(clamp(a2*1.4-i*.08,0,1));box(1100+i*70,500-hh,bw,hh,i===2?C4.o:C4.b,'none',0);wt(1100+i*70+bw/2,522,trf('{n}月',{n:i+1}),14,C4.s,500,'center');});
  });
  alphaDo(ease(seg(u,.72,.82)),()=>{fileCard(1100,580,300,'summary.xlsx','XLSX',{preview:'新檔案，可下載'});});
  alphaDo(band(u,.8,1),()=>{bub(160,580,720,'每一步的公式與程式都列出來，方便你自己驗算。','ai',1,19);});
  lab(1100+2*70+26,420,'異常月份',{dx:-70,dy:-70,st:'w',a:band(u,.66,.95)});
 }},

{t:'多份文件比較',en:'Comparing several documents',dur:14,
 d:'同一個對話可以一次放進多份檔案，請 Claude 並排比較。先指定要比的項目，例如價格、交期與保固，它就能整理成表格，並標出最有利與需要留意的條款。一次最多 20 個檔案；文件越多、越長，越要把問題問得具體。',
 s:[[0,'三份報價單一起上傳'],[.3,'先指定比較項目：價格、交期、保固'],[.62,'整理成對照表，標出優勢與風險']],
 draw(u){
  diagBG();
  const docs=['報價單 A','報價單 B','報價單 C'];
  docs.forEach((d,i)=>{const a=ease(seg(u,i*.06,i*.06+.1));alphaDo(a,()=>fileCard(260+i*400,165,300,trf('{d}.pdf',{d:tr(d)}),'PDF',{preview:trf('{n} 頁',{n:[6,9,4][i]})}));});
  alphaDo(ease(seg(u,.18,.28)),()=>{tag(1280,712,'一次最多 20 個檔案',{size:18,bg:'rgba(125,255,196,.16)',fg:C4.g,align:'center'});});
  alphaDo(ease(seg(u,.25,.35)),()=>{[410,810,1210].forEach(x=>arrow(x,245,x,298,C4.y,2.5));});
  // 表格
  const tx=240,ty=310,cw=[260,300,300,300],rh=78;
  const rows=[['項目','方案 A','方案 B','方案 C'],['價格','NT$ 120 萬','NT$ 98 萬','NT$ 105 萬'],['交期','6 週','10 週','4 週'],['保固','1 年','2 年','3 年']];
  const hi={'1,2':C4.g,'2,3':C4.g,'3,3':C4.g,'2,2':C4.o};
  const at=ease(seg(u,.3,.4));
  alphaDo(at,()=>{card(tx-20,ty-10,cw.reduce((a,b)=>a+b)+40,rh*4+30,{bg:C4.card});});
  rows.forEach((r,ri)=>{let cx=tx;r.forEach((cell,ci)=>{
    const a=ri===0?at:ease(seg(u,.4+ri*.08+ci*.02,.46+ri*.08+ci*.02));
    const col=hi[ri+','+ci];
    alphaDo(a,()=>{
      if(col){rrp(cx+6,ty+ri*rh+8,cw[ci]-12,rh-16,8);ctx.fillStyle=col===C4.g?'rgba(125,255,196,.16)':'rgba(232,87,42,.2)';ctx.fill();}
      wt(cx+cw[ci]/2,ty+ri*rh+rh/2+8,cell,ri===0||ci===0?20:22,ri===0?C4.y:ci===0?C4.s:(col||C4.t),ri===0||ci===0?700:600,'center');
    });
    cx+=cw[ci];});});
  alphaDo(at,()=>{for(let k=1;k<4;k++)ln([tx,ty+k*rh,tx+cw.reduce((a,b)=>a+b),ty+k*rh],'rgba(255,255,255,.12)',1);});
  alphaDo(ease(seg(u,.78,.88)),()=>{
    rrp(260,700,24,24,5);ctx.fillStyle='rgba(125,255,196,.3)';ctx.fill();wt(296,719,'最有利',18,C4.g,600);
    rrp(460,700,24,24,5);ctx.fillStyle='rgba(232,87,42,.35)';ctx.fill();wt(496,719,'需留意',18,C4.o,600);
    wt(680,719,'數值為示例',16,C4.s,500);
  });
 }},

{t:'要求標註出處頁碼',en:'Ask for page citations',dur:14,
 d:'長文件的摘要再好，也要能回頭核對。提問時加一句「每個重點請標註出處頁碼」，Claude 會在答案後面附上頁碼，你就能翻到那一頁比對原文。頁碼請以 PDF 閱讀器顯示的頁數為準；重要數字與表格一定要親自確認，找不到對應內容就直接追問。',
 s:[[0,'提問時加一句：每個重點請標註頁碼'],[.34,'答案附上頁碼，對應到原文那一頁'],[.66,'翻到該頁核對，找不到就追問']],
 draw(u){
  diagBG();
  card(60,160,860,620,{bg:C4.card});
  const hq=bub(90,190,800,'摘要這份報告的三個重點，每點標註出處頁碼（例如 p.12）。','user',ease(seg(u,0,.1)),19);
  const ans=[['營收成長 12%','3'],['第四季現金流轉正','12'],['明年主要風險為原料價格','27']];
  const ay=190+hq+30;
  alphaDo(ease(seg(u,.28,.34)),()=>{rrp(90,ay,800,250,12);ctx.fillStyle=KC.aiBub;ctx.fill();});
  const tagX=[];
  ans.forEach((a,i)=>{const al=ease(seg(u,.34+i*.07,.4+i*.07));const yy=ay+56+i*68;
    alphaDo(al,()=>{circ(118,yy-6,5,C4.y,'none',0);wt(136,yy,a[0],20,KC.text,500);const w=wtw(a[0],20,500);tag(136+w+50,yy-7,'p.'+a[1],{size:17,bg:C4.y,fg:'#0e2a3b',align:'center'});tagX.push([136+w+50,yy-7]);});
  });
  // 右：頁面縮圖
  card(960,160,580,620,{bg:C4.card});wt(990,204,'原文 PDF',20,C4.y,700);
  const pgs=[1,3,5,12,18,27];
  const lit=[3,12,27];
  pgs.forEach((n,i)=>{const px=1000+(i%3)*175,py=240+Math.floor(i/3)*200;
    const hl=lit.includes(n)&&u>.42+lit.indexOf(n)*.07;
    alphaDo(ease(seg(u,.05+i*.02,.12+i*.02)),()=>pageThumb(px,py,130,160,n,hl,n===12));});
  // 連線
  ans.forEach((a,i)=>{const n=+a[1],k=pgs.indexOf(n),px=1000+(k%3)*175,py=240+Math.floor(k/3)*200;const yy=ay+56+i*68;
    const al=seg(u,.4+i*.07,.46+i*.07);
    if(al>0)connLine(890,yy-7,px,py+80,{u:ease(al),col:C4.y,lw:2,dash:true,flow:u>.6});});
  // 檢核清單
  const chk=['翻到該頁核對原文','重要數字與表格再確認','找不到出處就追問'];
  chk.forEach((c,i)=>{const al=ease(seg(u,.68+i*.07,.74+i*.07));const yy=ay+290+i*40;
    if(yy<770){check(110,yy-6,C4.g,al);alphaDo(al,()=>wt(136,yy,c,18,C4.t,500));}});
  alphaDo(band(u,.7,1),()=>para(990,700,'頁碼以 PDF 閱讀器顯示的頁數為準',520,16,C4.s,500));
 }}
]};
