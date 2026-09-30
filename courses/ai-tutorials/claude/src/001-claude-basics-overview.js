// KITS: claude
/* ================= 001 入門基礎 總覽片：一分鐘認識 Claude ================= */
Object.assign(UI,{seriesOne:['{s}','{s}','{s}']});
/* chatWin：同 kit 的 claudeWin，修正使用者訊息文字對齊（kit 版本在 user 泡泡中沿用 right 對齊） */
function chatWin(x, y, w, h, opts={}){
  const {msgs=[], u=1, typing=false, title='Claude'} = opts;
  ctx.save();
  // 視窗外框
  rrp(x, y, w, h, 10); ctx.fillStyle=KC.winBg; ctx.fill();
  rrp(x, y, w, h, 10); ctx.strokeStyle=KC.border; ctx.lineWidth=1.5; ctx.stroke();
  // 標題列
  rrp(x, y, w, 40, 10);
  const gBar=ctx.createLinearGradient(x,y,x,y+40);
  gBar.addColorStop(0,KC.winBar); gBar.addColorStop(1,KC.winBg);
  ctx.fillStyle=gBar; ctx.fill();
  // 標題列分隔線
  ln([x,y+40,x+w,y+40], KC.border, 1);
  // 模型名稱
  ctx.font=`600 16px 'Noto Sans TC',sans-serif`;
  ctx.fillStyle=KC.text; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(tr(title), x+w/2, y+20);
  // 訊號燈
  [KC.orange, KC.accent, KC.green].forEach((c,i)=>{
    circ(x+16+i*18, y+20, 5, c, 'none', 0);
  });
  // 訊息區域：clip
  ctx.save();
  ctx.beginPath(); ctx.rect(x+2, y+41, w-4, h-42); ctx.clip();
  const pad=16, bh=56, gap=12;
  const shown=Math.ceil(msgs.length * clamp(u*1.2,0,1));
  msgs.slice(0,shown).forEach((m,i)=>{
    const isUser=m.role==='user';
    const by=y+56+i*(bh+gap);
    const bx=isUser? x+w-pad-260: x+pad;
    const bw=Math.min(260, w*0.6);
    // 泡泡
    rrp(bx,by,bw,bh-4,8);
    ctx.fillStyle=isUser? KC.userBub: KC.aiBub; ctx.fill();
    // 角色標籤
    ctx.font=`600 11px 'Noto Sans TC',sans-serif`;
    ctx.fillStyle=isUser? '#7dc8dc': KC.accent;
    ctx.textAlign=isUser? 'right': 'left';
    ctx.textBaseline='top';
    ctx.fillText(tr(isUser? '你': 'Claude'), bx+(isUser?bw-8:8), by+7);
    // 訊息文字（截斷顯示）
    ctx.font=`14px 'Noto Sans TC',sans-serif`;
    ctx.fillStyle=KC.text; ctx.textBaseline='top'; ctx.textAlign='left';
    const txt=tr(m.text); const maxC=Math.floor((bw-16)/8);
    ctx.fillText(txt.length>maxC? txt.slice(0,maxC)+'…': txt, bx+(isUser?8:8), by+24);
  });
  ctx.restore();
  // 打字游標
  if(typing && u<1){
    const ty=y+56+shown*(bh+gap)+12;
    claudeTypingDot(x+pad+24, ty);
  }
  ctx.restore();
}


function devIcon(kind,cx,cy,col){
  col=col||'#7dc8dc';
  if(kind==='web'){rrp(cx-30,cy-22,60,44,5);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();ln([cx-30,cy-10,cx+30,cy-10],col,2);circ(cx-23,cy-16,2.5,col);}
  else if(kind==='desk'){rrp(cx-32,cy-24,64,40,4);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();ln([cx,cy+16,cx,cy+26,cx-14,cy+26,cx+14,cy+26],col,2.5);}
  else if(kind==='phone'){rrp(cx-15,cy-26,30,52,6);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();circ(cx,cy+19,2.5,col);}
  else {wt(cx,cy+2,'{ }',30,col,700,'center',COND,'middle');}
}
function entryCard(x,y,label,sub,kind,a,act){
  alphaDo(a,()=>{card(x,y,300,110,{bg:act?'rgba(242,194,48,.12)':'rgba(7,27,39,.8)',st:act?'#f2c230':'rgba(255,255,255,.18)',lw:act?2:1.4});
    devIcon(kind,x+52,y+55,act?'#f2c230':'#7dc8dc');
    wt(x+100,y+48,label,21,act?'#f2c230':'#fff',700);wt(x+100,y+80,sub,16,'rgba(227,236,238,.8)',500);});
}
function check(x,y,on,col){ring(x,y,13,on?col:'rgba(255,255,255,.3)',2);if(on)ln([x-6,y,x-1,y+6,x+7,y-6],col,3);}
function lock(x,y,open,col){rrp(x-11,y-4,22,17,3);ctx.fillStyle=col;ctx.fill();ctx.beginPath();ctx.arc(x+(open?8:0),y-5,7,Math.PI,0);ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();}

const EP={no:0,slug:'claude-basics',seriesName:'入門基礎系列・總覽片',t:'一分鐘認識 Claude',en:'Claude Basics: Overview',
lede:'Claude 是 Anthropic 開發的 AI 助理，可以對話、閱讀檔案、搜尋網路，並把回答做成可分享的成果。這支總覽片用七個畫面，快速看完入門基礎系列的七個主題。',
facts:[['200K–1M','tokens','付費方案的上下文視窗大小，依模型而定'],['20','個檔案','每段對話最多可上傳的檔案數，單檔上限 500 MB'],['1,000','頁','PDF 上傳上限；100 頁以內會一併分析圖表與圖片'],['數分鐘','','研究（Research）完成多次搜尋並附上引用所需的時間'],['預設私人','','Artifacts 建立後只有自己看得到，主動分享後別人才能開啟']],
note:'說明：本片為教育用途示意動畫，介面為重新繪製的示意圖，並非官方畫面。功能、方案與數值依 Claude 說明中心（support.claude.com）整理，資訊截至 2026-09，實際以官方最新說明為準。',
shots:[
/* 1 */{t:'Claude 是什麼',en:'What is Claude',dur:12,
 d:'Claude 是 Anthropic 開發的 AI 助理，背後是一個大型語言模型：它讀懂你輸入的文字，再一個字一個字地產生回答。同一個 Claude 有好幾個入口：瀏覽器網頁、電腦桌面應用程式、手機 App，開發者則可以透過 API 把它接進自己的程式。不論從哪裡進來，對話的方式都一樣：你提出需求，Claude 回應，你再追問或修正。',
 s:[[0,'你用文字提出需求，Claude 逐字產生回答'],[.36,'同一個 Claude，有網頁、桌面、手機與 API 四個入口'],[.72,'不論從哪個入口，都是一來一往的對話']],
 draw(u){
  diagBG();floatParticles(20,7);
  chatWin(70,170,620,420,{u:seg(u,.02,.4),typing:true,msgs:[{role:'user',text:'幫我把這份報告整理成三個重點'},{role:'ai',text:'好的，以下是三個重點：'},{role:'user',text:'第二點可以再說明一點嗎？'},{role:'ai',text:'當然，第二點的背景是…'}]});
  const cx=1130,cy=470,na=seg(u,.3,.4);
  const E=[[800,190,'網頁','在瀏覽器使用','web'],[1160,190,'桌面應用程式','Windows／Mac','desk'],[800,640,'手機 App','iOS／Android','phone'],[1160,640,'API','開發者串接','api']];
  E.forEach((e,i)=>{const a=seg(u,.36+i*.06,.42+i*.06);connLine(e[0]+150,e[1]+(i<2?110:0),cx,cy,{u:a,flow:a>=1,col:'#58b8d0'});});
  agentNode(cx,cy,56,'Claude 模型',{u:na,active:.5+.5*Math.sin(TT*2)*.5+.25,icon:'✦'});
  E.forEach((e,i)=>entryCard(e[0],e[1],e[2],e[3],e[4],seg(u,.36+i*.06,.42+i*.06),Math.floor(TT/1.5)%4===i&&u>.62));
  alphaDo(band(u,.72,1),()=>{tag(380,640,'同樣的對話方式',{align:'center',size:20});});
 }},
/* 2 */{t:'好提示詞的五個要素',en:'Five elements of a good prompt',dur:13,
 d:'Claude 回答得好不好，很大一部分取決於你怎麼問。只說「幫我寫一篇文章」，Claude 只能猜你的讀者、長度與風格。把角色、目標、脈絡、限制與輸出格式講清楚，回答就會更貼近需要。第一次不滿意也沒關係，直接追問或指出要修改的地方，這種來回迭代本來就是使用 AI 的正常流程。',
 s:[[0,'只說「幫我寫一篇文章」，Claude 只能用猜的'],[.3,'補上角色、目標、脈絡、限制與格式'],[.7,'不滿意就追問修正，來回迭代是正常流程']],
 draw(u){
  diagBG();
  card(60,160,480,600,{bg:'rgba(7,27,39,.75)'});wt(84,202,'模糊的提問',22,'#e8572a',700);
  bubble(84,236,432,'幫我寫一篇文章','user',{u:seg(u,.02,.1)});
  alphaDo(seg(u,.1,.2),()=>{wt(84,340,'Claude 需要猜：',19,'rgba(227,236,238,.8)',600);
   ['寫給誰看？','要多長？','什麼語氣？','要什麼格式？'].forEach((q,i)=>{wt(110,384+i*40,'•',19,'#ff9d7a',700);wt(132,384+i*40,q,19,'#ff9d7a',500);});});
  alphaDo(seg(u,.2,.28),()=>{wt(84,600,'回答貼近需求',18,'rgba(227,236,238,.8)');box(84,616,432,14,'rgba(255,255,255,.08)');box(84,616,432*.3,14,'#ff8a60');wt(516,660,'30%（示意）',16,'#ff9d7a',600,'right');});
  card(580,160,960,600,{bg:'rgba(7,27,39,.75)'});wt(604,202,'清楚的提問',22,'#7dffc4',700);
  const R=[['角色','你是國中理化老師'],['目標','寫一篇 600 字的科普短文'],['脈絡','讀者是八年級學生，主題是颱風'],['限制','避免艱深術語，不用公式'],['格式','標題＋三段內文＋三題小測驗']];
  R.forEach((r,i)=>{const a=seg(u,.28+i*.07,.34+i*.07);alphaDo(a,()=>{tag(604,262+i*72,r[0],{size:19});wt(720,270+i*72,r[1],21,'#fff',500);});});
  alphaDo(seg(u,.64,.7),()=>{wt(604,640,'回答貼近需求',18,'rgba(227,236,238,.8)');box(604,656,900,14,'rgba(255,255,255,.08)');box(604,656,900*.3+900*.55*ease(seg(u,.64,.74)),14,'#7dffc4');wt(1504,700,'85%（示意）',16,'#7dffc4',600,'right');});
  alphaDo(band(u,.74,1),()=>{tag(1060,738,'不滿意 → 追問 → 修正',{align:'center',size:19,bg:'#58b8d0'});});
 }},
/* 3 */{t:'上下文與記憶',en:'Context and memory',dur:13,
 d:'上下文視窗就像 Claude 的工作桌，這段對話的訊息、上傳的檔案、指示與搜尋結果都要放在桌上才看得到。付費方案的視窗大小依模型約為 20 萬到 100 萬 tokens，接近上限時會自動摘要較早的內容。想讓知識跨對話保留，可以用專案（Projects）放固定的檔案與指示；記憶功能可在設定中檢視、編輯、暫停或重置，不想留紀錄時則可用無痕對話。',
 s:[[0,'對話、檔案與指示都放在上下文視窗這張工作桌上'],[.38,'接近上限時，較早的內容會被自動摘要'],[.62,'專案、記憶與無痕對話，控制什麼要被記住']],
 draw(u){
  diagBG();
  wt(80,200,'上下文視窗',24,'#f2c230',800);wt(80,232,'依模型約 200K–1M tokens',17,'rgba(227,236,238,.8)');
  const tk=u<.55?lerp(12000,176000,ease(seg(u,.05,.45))):lerp(176000,98000,ease(seg(u,.55,.66)));
  contextDesk(80,256,700,250,{u:seg(u,0,.06),tokens:tk,maxTokens:200000,items:['對話','檔案','指示','搜尋','對話','檔案','對話'].slice(0,1+Math.floor(6.99*seg(u,.05,.42)))});
  alphaDo(band(u,.40,.53),()=>{tag(430,556,'接近上限',{align:'center',size:19,bg:'#e8572a',fg:'#fff'});});
  alphaDo(seg(u,.56,.62),()=>{tag(430,556,'較早內容自動摘要',{align:'center',size:19,bg:'#7dffc4'});});
  alphaDo(seg(u,.2,.3),()=>{wt(80,640,'桌子愈滿，愈難找到重點：',18,'rgba(227,236,238,.8)',600);wt(80,676,'換新主題時，開一段新對話',18,'#fff',500);});
  const C=[['專案 Projects','固定的檔案與指示','每個專案有獨立的記憶空間','#58b8d0'],['記憶 Memory','設定 › 記憶','可檢視、編輯、暫停或重置','#f2c230'],['無痕對話','不存入記憶與對話紀錄','所有方案都能使用','#7dffc4']];
  C.forEach((c,i)=>{const a=seg(u,.58+i*.06,.64+i*.06);alphaDo(a,()=>{const y=180+i*196;card(860,y,660,170,{bg:'rgba(7,27,39,.8)',st:c[3]});box(860,y+14,6,142,c[3]);wt(892,y+52,c[0],23,c[3],800);wt(892,y+96,c[1],19,'#fff',500);wt(892,y+134,c[2],18,'rgba(227,236,238,.8)',500);});});
 }},
/* 4 */{t:'檔案與圖片',en:'Files and images',dur:12,
 d:'你可以把 PDF、Word、CSV、試算表或照片直接拖進對話，請 Claude 摘要、比較或回答問題。每段對話最多 20 個檔案，單檔上限 500 MB；PDF 最多 1,000 頁，其中 100 頁以內的部分會連圖表與圖片一起分析。照片也能看：圖表、手寫筆記、螢幕截圖都可以。重要內容可以請 Claude 標出引用的頁碼，方便回頭核對原文。',
 s:[[0,'把 PDF、試算表、照片直接拖進對話'],[.4,'Claude 摘要、比較，也看得懂圖表與手寫'],[.72,'請它標出頁碼，方便回頭核對原文']],
 draw(u){
  diagBG();floatParticles(14,3);
  const F=[['期末報告.pdf','PDF','共 86 頁'],['銷售數據.csv','CSV','1,240 列'],['手寫筆記.png','PNG','手機拍照'],['合約草案.docx','DOCX','12 頁']];
  F.forEach((f,i)=>{const t0=.04+i*.08,p=ease(seg(u,t0+.06,t0+.2)),x=lerp(80,860+(i%2)*330,p),y=lerp(180+i*120,370+Math.floor(i/2)*84,p);
   fileCard(x,y,p>.99?310:330,f[0],f[1],{u:seg(u,t0,t0+.05),preview:f[2]});});
  alphaDo(seg(u,.1,.2),()=>{arrow(460,450,800,450,'rgba(242,194,48,.6)',3);wt(630,430,'拖曳上傳',18,'#f2c230',700,'center');});
  chatWin(840,560,680,240,{u:seg(u,.38,.7),title:'Claude',msgs:[{role:'user',text:'比較報告和合約的交期'},{role:'ai',text:'報告寫 6 月（第 12 頁）'},]});
  alphaDo(seg(u,.42,.5),()=>{card(80,560,660,220,{bg:'rgba(7,27,39,.8)'});wt(108,604,'照片也看得懂',21,'#f2c230',700);
   ['圖表與統計圖','手寫筆記','螢幕截圖'].forEach((t,i)=>{const a=seg(u,.46+i*.05,.5+i*.05);alphaDo(a,()=>{check(122,654+i*40,true,'#7dffc4');wt(150,661+i*40,t,19,'#fff',500);});});});
  alphaDo(band(u,.72,1),()=>{tag(1180,540,'標出頁碼，方便核對',{align:'center',size:18,bg:'#7dffc4'});});
 },
 hud(u){hudPanel(250,160,'上傳上限',seg(u,.44,.5),w=>{hrow(52,'每段對話','20 個檔案',w);hrow(80,'單一檔案','500 MB',w);hrow(108,'PDF 頁數','1,000 頁',w);hrow(136,'圖表分析','前 100 頁',w,'#f2c230');});}},
/* 5 */{t:'搜尋與深度研究',en:'Search and research',dur:13,
 d:'語言模型的知識停在訓練資料的截止時間，最新的消息、價格或規定要靠網路搜尋補上。開啟網路搜尋後，Claude 會查詢、閱讀網頁，並在回答中附上可點開的引用來源。付費方案還有研究（Research）功能：Claude 會自己決定接下來查什麼，進行多次相互延伸的搜尋，通常幾分鐘內交出附有引用、方便查核的完整報告。',
 s:[[0,'模型知識有截止時間，最新資訊要靠搜尋'],[.34,'查詢、閱讀、再查詢，最後整理成附引用的回答'],[.7,'研究模式會自己規劃多次搜尋，幾分鐘內交出報告']],
 draw(u){
  diagBG();
  wt(80,200,'知識截止',22,'#f2c230',800);
  const tx0=80,tx1=760,ty=262;ln([tx0,ty,tx1,ty],'rgba(255,255,255,.4)',3);
  box(tx0,ty-9,(tx1-tx0)*.66*ease(seg(u,.02,.14)),18,'#58b8d0');
  alphaDo(seg(u,.1,.18),()=>{ln([tx0+(tx1-tx0)*.66,ty-26,tx0+(tx1-tx0)*.66,ty+26],'#f2c230',3);wt(tx0,ty+46,'訓練資料',17,'#7dc8dc',600);wt(tx0+(tx1-tx0)*.66,ty+46,'截止',17,'#f2c230',700,'center');wt(tx1,ty+46,'今天',17,'#fff',600,'right');});
  alphaDo(seg(u,.18,.28),()=>{box(tx0+(tx1-tx0)*.66,ty-9,(tx1-tx0)*.34*ease(seg(u,.18,.3)),18,'#7dffc4');wt(tx0+(tx1-tx0)*.83,ty-24,'靠搜尋補上',16,'#7dffc4',700,'center');});
  flowSteps([{label:'提問'},{label:'搜尋'},{label:'閱讀網頁'},{label:'再搜尋'},{label:'附引用回答'}],900,250,150,seg(u,.28,.58),'#f2c230');
  browserWin(80,380,680,400,{url:'claude.ai › search',u:seg(u,.32,.42),drawContent:(x,y,w,h)=>{
   for(let i=0;i<4;i++){const a=seg(u,.36+i*.05,.42+i*.05),yy=y+30+i*88;alphaDo(a,()=>{box(x+24,yy,200+i*30,14,'#7dc8dc');box(x+24,yy+26,w-80,9,'rgba(255,255,255,.25)');box(x+24,yy+44,w-160,9,'rgba(255,255,255,.18)');if(i<3&&u>.6){tag(x+w-40,yy+8,String(i+1),{size:15,align:'center',bg:'#f2c230'});}});}
  }});
  alphaDo(seg(u,.58,.64),()=>{card(840,400,680,380,{bg:'rgba(242,194,48,.08)',st:'#f2c230',lw:2});wt(870,450,'研究（Research）',24,'#f2c230',800);
   ['自己決定下一步要查什麼','多次相互延伸的搜尋','通常幾分鐘完成','附上方便查核的引用','付費方案可用'].forEach((t,i)=>{const a=seg(u,.62+i*.035,.66+i*.035);alphaDo(a,()=>{check(884,506+i*54,true,'#7dffc4');wt(912,513+i*54,t,20,'#fff',500);});});});
 }},
/* 6 */{t:'Artifacts 與可分享成果',en:'Artifacts and sharing',dur:12,
 d:'有些回答不只是一段文字，而是可以拿給別人看的成果：文件、簡報、設計稿、儀表板或互動小工具，這些稱為 Artifacts。它們在對話旁的獨立視窗打開，可以直接操作，也可以要求 Claude 繼續修改。Artifacts 建立後預設只有自己看得到，要主動發佈或分享給指定的人，別人才能開啟；若小工具本身會呼叫 Claude，使用者要用自己的 Claude 帳號登入。',
 s:[[0,'一句需求，回答變成可以操作的小工具'],[.4,'文件、簡報、設計、儀表板都是 Artifacts'],[.7,'預設只有自己看得到，分享後別人才能開啟']],
 draw(u){
  diagBG();
  chatWin(60,170,520,300,{u:seg(u,.02,.2),msgs:[{role:'user',text:'做一個單位換算小工具'},{role:'ai',text:'已建立：單位換算器'}]});
  const g=ease(seg(u,.16,.3));
  browserWin(640,170,880,440,{url:'claude.ai › artifact',u:g,drawContent:(x,y,w,h)=>{
   wt(x+40,y+60,'單位換算器',26,'#fff',800);
   const v=(10+8*Math.sin(TT*.8)).toFixed(1);
   card(x+40,y+100,320,70,{bg:'rgba(255,255,255,.06)'});wt(x+60,y+145,v,28,'#fff',700,'left',COND);wt(x+340,y+145,'公里',20,'rgba(227,236,238,.8)',600,'right');
   arrow(x+380,y+135,x+460,y+135,'#f2c230',3);
   card(x+480,y+100,320,70,{bg:'rgba(125,255,196,.1)',st:'#7dffc4'});wt(x+500,y+145,(v*0.6214).toFixed(2),28,'#7dffc4',700,'left',COND);wt(x+780,y+145,'英里',20,'rgba(227,236,238,.8)',600,'right');
   box(x+40,y+220,w-80,8,'rgba(255,255,255,.12)');circ(x+40+(w-80)*(.5+.4*Math.sin(TT*.8)),y+224,11,'#f2c230');
   wt(x+40,y+290,'拖曳滑桿，數值即時更新',17,'rgba(227,236,238,.7)');
  }});
  {let tx=60;['文件','簡報','設計','儀表板','互動工具'].forEach((t,i)=>{const a=seg(u,.4+i*.04,.46+i*.04),x0=tx;tx+=wtw(t,18,700)+18*1.1+12;alphaDo(a,()=>tag(x0,540,t,{size:18,bg:'#58b8d0'}));});}
  alphaDo(seg(u,.4,.44),()=>wt(60,510,'Artifacts 的類型',18,'rgba(227,236,238,.8)',600));
  const S=[['私人',false,'#e8572a'],['分享',true,'#f2c230'],['分享連結',true,'#7dffc4']];
  S.forEach((s,i)=>{const a=seg(u,.6+i*.06,.65+i*.06);alphaDo(a,()=>{const x=660+i*300;card(x,650,250,110,{bg:'rgba(7,27,39,.8)',st:s[2]});lock(x+50,708,s[1],s[2]);wt(x+90,716,s[0],22,s[2],700);if(i<2)arrow(x+256,705,x+294,705,'rgba(255,255,255,.5)',2.5);});});
  alphaDo(seg(u,.72,.78),()=>wt(60,700,'會呼叫 Claude 的小工具，使用者以自己的帳號登入',17,'rgba(227,236,238,.8)',500));
 }},
/* 7 */{t:'限制、查證與隱私',en:'Limits, checking and privacy',dur:13,
 d:'語言模型是依機率挑選下一個字。熟悉的問題，正確答案的機率明顯最高；冷門或細節的問題，各種候選答案的機率差不多，模型仍可能說得很流暢，卻是錯的，這就是「幻覺」。所以重要的數字與事實要回到原始來源查證，注意資訊的時效；不要貼上密碼或他人個資；最後的判斷與責任，仍然在使用的人身上。',
 s:[[0,'熟悉的問題，正確答案的機率明顯最高'],[.3,'冷門細節的機率很分散，可能說得流暢卻是錯的'],[.62,'重要內容要查證，最後判斷在你手上']],
 draw(u){
  diagBG();
  const bars=(x,y,title,q,D,col,a0)=>{
   const c=chartBox(x,y,700,290,{title,x0:0,x1:D.length,y0:0,y1:1,xt:[],yt:[0,.5,1],pl:60,pt:78,pb:50});
   wt(x+18,y+62,q,17,'rgba(227,236,238,.85)');
   D.forEach((d,i)=>{const k=ease(seg(u,a0+i*.03,a0+.1+i*.03)),bw=c.pw/D.length*.56,bx=c.X(i+.22);box(bx,c.Y(d[1]*k),bw,c.Y(0)-c.Y(d[1]*k),i===0?col:'rgba(125,200,220,.55)');
    wt(bx+bw/2,c.Y(0)+26,d[0],17,'#fff',600,'center');if(k>.95)wt(bx+bw/2,c.Y(d[1])-8,Math.round(d[1]*100)+'%',16,'#fff',600,'center',COND);});
   return c;};
  bars(60,160,'熟悉的問題：下一個詞的機率','「台灣最高的山是……」',[['玉山',.9],['雪山',.06],['合歡山',.04]],'#7dffc4',.02);
  alphaDo(seg(u,.28,.34),()=>{bars(60,480,'冷門的問題：機率很分散','「某小鎮 1923 年的人口是……」',[['3,200',.28],['4,100',.26],['2,800',.24],['5,000',.22]],'#ff8a60',.3);});
  alphaDo(band(u,.44,1),()=>tag(560,500,'可能是幻覺',{size:18,bg:'#e8572a',fg:'#fff'}));
  card(820,160,720,600,{bg:'rgba(7,27,39,.75)'});wt(848,210,'查證檢核清單',23,'#f2c230',800);
  const L=[['重要數字與事實，回到原始來源確認','#7dffc4'],['注意時效：知識截止之後的事要搜尋','#7dffc4'],['不貼上密碼、帳號或他人個資','#7dffc4'],['請 Claude 標示不確定的地方','#7dffc4'],['最後的判斷與責任在使用的人','#f2c230']];
  L.forEach((l,i)=>{const a=seg(u,.5+i*.055,.55+i*.055);check(870,282+i*96,a>.5,l[1]);alphaDo(.35+.65*a,()=>wt(900,290+i*96,l[0],20,a>.5?'#fff':'rgba(255,255,255,.5)',500));});
 }}
]};
