// KITS: claude
/* 002-claude-basics-ep01 — Claude 是什麼
   Claude AI 應用動畫館｜入門基礎 第 1 集
   分鏡：①預測下一個字（圖解）②一個模型多個入口 ③模型家族（圖解）④方案與用量（圖解）⑤第一段對話 ⑥三個好習慣（圖解） */

/* ── 共用小工具 ── */
function wrapT(x,y,text,size,col,maxW,lh,weight,align){
  const t=tr(text);const isEn=LANG==='en';
  const parts=isEn?t.split(' '):Array.from(t);
  let line='',yy=y,n=0;
  parts.forEach((p,i)=>{
    const test=line+(isEn&&line?' ':'')+p;
    if(wtw(test,size,weight)>maxW&&line&&!(!isEn&&'，。、；：）」？！'.includes(p))){wt(x,yy,line,size,col,weight,align);yy+=lh;n++;line=p;}
    else line=test;
  });
  if(line){wt(x,yy,line,size,col,weight,align);n++;}
  return n;
}
/* 示意對話視窗（自繪，文字會換行） */
function chatPane(x,y,w,h,msgs,u,o){
  o=o||{};
  card(x,y,w,h,{bg:'#131f2e',st:KC.border,r:14});
  rrp(x,y,w,46,14);ctx.fillStyle='#1a2d42';ctx.fill();box(x,y+30,w,16,'#1a2d42','none',0);
  ln([x,y+46,x+w,y+46],KC.border,1);
  [KC.orange,KC.accent,KC.green].forEach((c,i)=>circ(x+22+i*18,y+23,5,c,'none',0));
  wt(x+w/2,y+30,o.title||'新對話',17,KC.text,600,'center');
  // 輸入列＋模型選單
  const iy=y+h-62;
  rrp(x+18,iy,w-36,44,10);ctx.fillStyle='rgba(255,255,255,.05)';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1;ctx.stroke();
  wt(x+34,iy+28,o.input||'輸入訊息…',15,KC.sub,400);
  if(o.model){const mw=wtw(o.model,14,600)+26;rrp(x+w-80-mw,iy+9,mw,26,13);ctx.fillStyle='rgba(242,194,48,.14)';ctx.fill();ctx.strokeStyle=KC.accent;ctx.stroke();wt(x+w-80-mw/2,iy+27,o.model,14,KC.accent,600,'center');}
  circ(x+w-46,iy+22,14,KC.accent,'none',0);arrow(x+w-46,iy+29,x+w-46,iy+14,'#13232e',2.2,8);
  // 訊息
  let yy=y+70;
  msgs.forEach((m,i)=>{
    const a=seg(u,m.at,m.at+.05);if(a<=0)return;
    const isU=m.role==='user',bw=isU?w*.6:w*.78,size=25,lh=36;
    const full=tr(m.text);const k=isU?1:seg(u,m.at,m.at+(m.dur||.2));
    const shown=LANG==='en'?full.split(' ').slice(0,Math.ceil(full.split(' ').length*k)).join(' '):Array.from(full).slice(0,Math.ceil(Array.from(full).length*k)).join('');
    // 先量行數
    ctx.save();ctx.globalAlpha=0;const nl=wrapT(0,0,full,size,'#fff',bw-40,lh,400);ctx.restore();
    const bh=nl*lh+56,bx=isU?x+w-24-bw:x+24;
    alphaDo(ease(a),()=>{
      rrp(bx,yy,bw,bh,12);ctx.fillStyle=isU?KC.userBub:KC.aiBub;ctx.fill();
      wt(isU?bx+bw-20:bx+20,yy+26,isU?'你':'Claude',16,isU?'#7dc8dc':KC.accent,700,isU?'right':'left');
      wrapT(bx+20,yy+62,shown,size,KC.text,bw-40,lh,400);
      
    });
    yy+=bh+18;
  });
}
function device(x,y,w,h,kind,a){
  alphaDo(a,()=>{
    if(kind==='phone'){rrp(x,y,w,h,18);ctx.fillStyle='#0a1520';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=2;ctx.stroke();
      rrp(x+8,y+22,w-16,h-44,8);ctx.fillStyle='#131f2e';ctx.fill();box(x+w/2-18,y+9,36,5,KC.border,'none',0);
      rrp(x+16,y+40,w-40,22,8);ctx.fillStyle=KC.userBub;ctx.fill();rrp(x+16,y+72,w-32,34,8);ctx.fillStyle=KC.aiBub;ctx.fill();
      circ(x+w/2,y+h-60,14,'rgba(242,194,48,.2)',KC.accent,1.5);}
    else if(kind==='desk'){rrp(x,y,w,h,10);ctx.fillStyle='#131f2e';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=2;ctx.stroke();
      box(x,y,w,26,'#1a2d42','none',0);[KC.orange,KC.accent,KC.green].forEach((c,i)=>circ(x+14+i*14,y+13,4,c,'none',0));
      box(x+8,y+34,w*.26,h-42,'rgba(255,255,255,.04)','none',0);for(let i=0;i<4;i++)box(x+14,y+44+i*20,w*.26-14,8,'rgba(125,200,220,.25)','none',0);
      rrp(x+w*.33,y+42,w*.6,20,6);ctx.fillStyle=KC.userBub;ctx.fill();rrp(x+w*.33,y+70,w*.6,40,6);ctx.fillStyle=KC.aiBub;ctx.fill();
      box(x+w/2-30,y+h,60,14,'#1a2d42','none',0);box(x+w/2-60,y+h+14,120,6,'#1a2d42','none',0);}
  });
}
const PLAN_Y=[['Free',1],['Pro',5],['Max 5×',25],['Max 20×',100]];

const EP={no:1,t:'Claude 是什麼',en:'What Is Claude',
seriesName:'入門基礎',total:7,
lede:'Claude 是 Anthropic 開發的 AI 助理。本集說明語言模型怎麼一個字一個字產生回答、可以從哪些地方使用 Claude、不同模型與方案的差別，最後示範第一段對話。',
facts:[
 ['4','個入口','網頁、桌面 App、手機 App，以及給開發者的 API'],
 ['1M','tokens','Opus 5.5 與 Sonnet 5.5 的上下文視窗'],
 ['4','個模型','目前最新模型：Haiku、Sonnet、Opus、Fable'],
 ['5×','以上','Pro 方案相對 Free 的用量'],
 ['5× / 20×','','Max 方案相對 Pro 的用量選項'],
],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，並非官方畫面或標誌。模型、方案與用量說明依 support.claude.com、platform.claude.com 與 claude.com/pricing 查證，各方案實際內容與用量依官方公告為準。資訊截至 2026-09。',
base:()=>{claudeBase();floatParticles(22,7);},
shots:[
/* ① 預測下一個字 */
{t:'語言模型如何預測下一個字',en:'Predicting the next word',dur:15,
 d:'Claude 是一個大型語言模型。它在訓練時讀過大量文字，學會詞與詞之間的規律；回答時，它根據前面所有的內容，估計下一個詞元（token）出現的機率，挑出一個，再接著預測下一個。整段回答就是這樣一小段一小段接出來的。因為是依機率產生，同樣的問題換個說法，答案也可能略有不同。',
 s:[[0,'輸入一句話：「今天天氣很」'],[.25,'模型估計每個候選詞的機率'],[.55,'選出「好」，接到句子後面'],[.78,'再根據新的句子預測下一個詞']],
 draw(u){
  diagBG();
  card(60,170,900,600,{bg:'rgba(7,27,39,.75)'});
  wt(90,215,'下一個詞元的機率',22,'#f2c230',700);
  // 句子
  const pick=seg(u,.52,.6),step2=seg(u,.75,.82);
  const base=tr('今天天氣很');
  wt(90,285,base,34,'#fff',700);
  const bw=wtw(base,34,700);
  alphaDo(ease(pick),()=>{wt(90+bw+(LANG==='en'?10:4),285,'好',34,'#7dffc4',800);});
  const bw2=bw+wtw('好',34,800)+(LANG==='en'?10:4);
  alphaDo(ease(step2),()=>{wt(90+bw2+(LANG==='en'?10:0),285,'，適合',34,'#7dc8dc',700);});
  typeCursor(90+(step2>0?bw2+wtw('，適合',34,700)+14:pick>0?bw2+6:bw+6),290,1.6);
  // 機率長條
  const C=step2>.5?[['出門',.48],['散步',.27],['曬衣服',.14],['睡覺',.06]]:[['好',.62],['熱',.21],['冷',.09],['悶',.05]];
  const grow=step2>.5?seg(u,.76,.9):seg(u,.18,.45);
  C.forEach(([w,p],i)=>{
    const y=360+i*96,top=i===0;
    wt(120,y+34,w,26,top?'#f2c230':'#e3ecee',700);
    box(260,y+10,600,34,'rgba(255,255,255,.06)','none',0);
    box(260,y+10,600*p*ease(grow),34,top?'#f2c230':'#58b8d0','none',0);
    wt(870,y+36,Math.round(p*100*ease(grow))+'%',22,top?'#f2c230':'rgba(227,236,238,.8)',700,'right',COND);
  });
  alphaDo(band(u,.52,.74),()=>tag(870,232,'選出機率最高的一個',{size:17,bg:'#7dffc4',align:'right'}));
  // 右側說明
  card(1000,170,540,600,{bg:'rgba(7,27,39,.75)'});
  wt(1030,215,'兩個階段',22,'#f2c230',700);
  const st=[['訓練','讀過大量文字，學會語言的規律'],['回答','一次產生一個詞元，逐步接成句子']];
  st.forEach(([h,b],i)=>{const a=seg(u,.05+i*.3,.15+i*.3);alphaDo(ease(a),()=>{
    const y=260+i*230;card(1030,y,480,190,{bg:'rgba(255,255,255,.05)'});
    tag(1050,y+40,h,{size:20});wrapT(1050,y+100,b,20,'#e3ecee',440,30,500);});});
  alphaDo(band(u,.8,1),()=>wrapT(1030,735,'依機率產生，所以每次回答可能略有不同',17,'rgba(227,236,238,.8)',490,26,500));
 }},
/* ② 一個模型、多個入口 */
{t:'一個 Claude，多個入口',en:'One Claude, many doors',dur:13,side:true,
 d:'同一個 Claude 可以從好幾個地方使用：在瀏覽器打開 claude.ai 的網頁版、安裝在電腦上的桌面 App、手機上的 iOS 與 Android App，以及讓開發者把 Claude 接進自己程式的 API。個人方案的用量在網頁、桌面與 Claude Code 之間共同計算，換裝置也能延續同一份對話紀錄。',
 s:[[0,'中間是同一個 Claude'],[.2,'網頁版：打開瀏覽器就能用'],[.42,'桌面 App 與手機 App'],[.68,'開發者透過 API 接進自己的程式']],
 draw(u){
  const cx=800,cy=470;
  // 核心
  const pulse=.5+.5*Math.sin(TT*2);
  circ(cx,cy,92+6*pulse,'rgba(242,194,48,.08)','none',0);
  circ(cx,cy,78,'#1a3048',KC.accent,3);
  wt(cx,cy+10,'Claude',32,KC.accent,800,'center');
  const P=[{x:330,y:300,ax:490,ay:305,a:seg(u,.15,.25),t:'網頁版'},{x:1270,y:300,ax:1130,ay:300,a:seg(u,.38,.46),t:'桌面 App'},{x:335,y:665,ax:390,ay:665,a:seg(u,.46,.54),t:'手機 App'},{x:1275,y:675,ax:1110,ay:675,a:seg(u,.64,.72),t:'API'}];
  P.forEach(p=>{
    connLine(p.ax,p.ay,cx+(p.x<cx?-62:62),cy+(p.y<cy?-48:48),{u:ease(p.a),flow:true,col:'#58b8d0',lw:2});
  });
  // 網頁
  browserWin(170,220,320,170,{url:'claude.ai',u:ease(P[0].a),drawContent:(ix,iy,iw,ih)=>{box(ix,iy,iw,ih,'#131f2e','none',0);rrp(ix+iw*.35,iy+20,iw*.58,22,6);ctx.fillStyle=KC.userBub;ctx.fill();rrp(ix+16,iy+54,iw*.7,44,6);ctx.fillStyle=KC.aiBub;ctx.fill();}});
  device(1130,225,280,150,'desk',ease(P[1].a));
  device(285,560,100,210,'phone',ease(P[2].a));
  alphaDo(ease(P[3].a),()=>terminal(1110,590,330,170,{lines:['$ curl …/v1/messages','{ "model": "claude-…",','  "messages": [ … ] }','→ 200 OK'],u:seg(u,.66,.9),title:'API'}));
  [[330,400],[1270,400],[335,780],[1275,775]].forEach(([lx,ly],i)=>{alphaDo(band(u,[.2,.42,.48,.68][i],1),()=>tag(lx,ly+22,P[i].t,{size:20,align:'center',bg:i===3?'#f2c230':'#1e3a55',fg:i===3?'#13232e':'#fff'}));});
  alphaDo(band(u,.8,1),()=>tag(cx,cy+130,'個人用量共同計算',{size:20,align:'center',bg:'#7dffc4'}));
 }},
/* ③ 模型家族 */
{t:'模型家族：快速與深入',en:'The model family',dur:15,
 d:'Claude 不只一個模型。目前最新的有四種：Haiku 4.5 速度最快、成本最低；Sonnet 5.5 兼顧速度與能力；Opus 5.5 是多數工作的建議預設；Fable 5.1 能力最強，適合最困難的推理與長時間任務，但回應較慢。在付費方案中，可以從傳送鍵旁的選單切換模型、調整「投入程度（effort）」，並看到 Claude 回答前的思考過程。',
 s:[[0,'四個模型，各有擅長'],[.3,'越往右推理越深，回應也越慢'],[.6,'傳送鍵旁的選單可以切換模型'],[.8,'投入程度決定每次回答要多仔細']],
 draw(u){
  diagBG();
  const M=[['Haiku 4.5','最快速',1,.45,'200K'],['Sonnet 5.5','速度與能力兼顧',.78,.7,'1M'],['Opus 5.5','多數工作的預設',.55,.88,'1M'],['Fable 5.1','能力最強',.3,1,'1M']];
  M.forEach(([n,d,sp,q,cw],i)=>{
    const x=70+i*372,y=170,a=seg(u,.03+i*.07,.1+i*.07),hi=i===2;
    alphaDo(ease(a),()=>{
      card(x,y,340,380,{bg:hi?'rgba(242,194,48,.10)':'rgba(7,27,39,.75)',st:hi?'#f2c230':'rgba(255,255,255,.16)',lw:hi?2.4:1.4});
      wt(x+24,y+52,n,30,hi?'#f2c230':'#fff',800,'left',COND);
      wt(x+24,y+92,d,18,'rgba(227,236,238,.8)',500);
      wt(x+24,y+150,'速度',17,'#7dffc4',600);box(x+24,y+162,292,14,'rgba(255,255,255,.08)','none',0);box(x+24,y+162,292*sp*ease(seg(u,.12+i*.06,.4)),14,'#7dffc4','none',0);
      wt(x+24,y+215,'推理深度',17,'#f2c230',600);box(x+24,y+227,292,14,'rgba(255,255,255,.08)','none',0);box(x+24,y+227,292*q*ease(seg(u,.12+i*.06,.4)),14,'#f2c230','none',0);
      wt(x+24,y+290,'上下文視窗',16,'rgba(227,236,238,.8)',500);
      wt(x+24,y+340,cw,36,'#fff',700,'left',COND);wt(x+24+wtw(cw,36,700,COND)+8,y+340,'tokens',18,'rgba(227,236,238,.8)',500,'left',COND);
    });
  });
  arrow(90,590,1520,590,'rgba(255,255,255,.35)',2);
  wt(90,620,'較快、較省',16,'#7dffc4',600);wt(1520,620,'較深入、較慢',16,'#f2c230',600,'right');
  // 選單示意
  const a2=seg(u,.58,.66);
  alphaDo(ease(a2),()=>{
    card(70,660,1460,130,{bg:'rgba(7,27,39,.85)'});
    wt(100,705,'傳送鍵旁的選單',19,'#f2c230',700);
    tag(100,750,'Opus 5.5',{size:18,bg:'#1e3a55',fg:'#fff'});
    wt(330,757,'思考：開',18,'#7dffc4',600);
    wt(560,705,'投入程度（effort）',19,'#f2c230',700);
    const L=['低','中','高','最高'];const lv=Math.min(3,Math.floor(seg(u,.8,.95)*4));
    L.forEach((l,i)=>{const on=i<=lv&&u>.8;rrp(560+i*230,730,210,40,20);ctx.fillStyle=on?'#f2c230':'rgba(255,255,255,.06)';ctx.fill();wt(665+i*230,757,l,18,on?'#13232e':'rgba(227,236,238,.8)',700,'center');});
  });
 }},
/* ④ 方案與用量 */
{t:'方案與用量的概念',en:'Plans and usage',dur:14,
 d:'Claude 有免費的 Free 方案，也有付費的 Pro、Max，以及給團隊與企業的 Team、Enterprise。方案之間最大的差別是可用的量：Pro 約為 Free 的五倍以上，Max 可選 Pro 的五倍或二十倍。用量會在一段時間內累計、時間到就重置；對話越長、附加的檔案越大、選用的模型越強、投入程度越高，每則訊息用掉的量就越多。',
 s:[[0,'方案不同，可用的量不同'],[.3,'Max 可選 Pro 的五倍或二十倍'],[.55,'長對話、大檔案、強模型用量較多'],[.8,'用量會在一段時間後重置']],
 draw(u){
  diagBG();
  const c=chartBox(60,170,820,600,{title:'相對用量（示意）',x0:0,x1:4,y0:0,y1:100,xt:[],yt:[0,25,50,75,100],pl:70,pt:70,pb:80,gx:4,gy:4});
  PLAN_Y.forEach(([n,v],i)=>{
    const g=ease(seg(u,.05+i*.08,.2+i*.08));
    const x0=c.X(i+.2),x1=c.X(i+.8),h=Math.max(4,(c.Y(0)-c.Y(v))*g);
    box(x0,c.Y(0)-h,x1-x0,h,i===0?'#58b8d0':i===1?'#7dffc4':'#f2c230','none',0);
    wt((x0+x1)/2,c.Y(0)+34,n,20,'#fff',700,'center',COND);
    const lbl=i===0?'基準':i===1?'Free ×5 以上':i===2?'Pro ×5':'Pro ×20';
    alphaDo(g,()=>wt((x0+x1)/2,c.Y(0)-h-14,lbl,17,'rgba(227,236,238,.9)',600,'center'));
  });
  alphaDo(band(u,.05,1),()=>wt(80,745,'Team、Enterprise 另有團隊方案',16,'rgba(227,236,238,.7)',500));
  // 右：用量表
  card(920,170,620,600,{bg:'rgba(7,27,39,.75)'});
  wt(950,215,'什麼會用掉比較多',22,'#f2c230',700);
  const F=[['長對話','每次回覆都要重讀前文'],['大檔案','檔案內容也算進上下文'],['較強的模型','例如 Opus、Fable'],['較高的投入程度','思考越久，用量越多']];
  F.forEach(([h,b],i)=>{const a=seg(u,.5+i*.05,.56+i*.05);alphaDo(ease(a),()=>{const y=250+i*84;tag(950,y+20,h,{size:18,bg:'#e8572a',fg:'#fff'});wt(950,y+64,b,17,'rgba(227,236,238,.85)',500);});});
  // 量表
  const fill=u<.8?seg(u,.5,.78)*.86:.86*(1-ease(seg(u,.82,.92)));
  const my=620;wt(950,my,'本期用量',17,'#fff',600);
  box(950,my+14,560,22,'rgba(255,255,255,.08)','rgba(255,255,255,.2)',1);
  box(950,my+14,560*fill,22,fill>.7?'#e8572a':'#7dffc4','none',0);
  alphaDo(band(u,.84,1),()=>tag(950,my+80,'時間到自動重置',{size:17,bg:'#7dffc4'}));
 },
 hud(u){hudPanel(230,104,'用量（示意）',seg(u,.5,.56),w=>{const f=u<.8?seg(u,.5,.78)*.86:.86*(1-ease(seg(u,.82,.92)));hrow(56,'已使用',Math.round(f*100)+'%',w,f>.7?'#e8572a':'#7dffc4');hbar(14,76,w-28,f,f>.7?'#e8572a':'#7dffc4');});}},
/* ⑤ 第一段對話 */
{t:'第一段對話示範',en:'Your first conversation',dur:16,side:true,
 d:'開始使用時，像對一位能幹的同事說話即可：說清楚想要什麼、給誰看、希望多長。這裡請 Claude 用三句話向國中生解釋光合作用；拿到回答後，再追問一個生活中的例子。Claude 會記得同一段對話前面說過的內容，所以追問時不必重講一次背景。回答若有不確定的地方，可以要求它說明依據。',
 s:[[0,'說清楚：主題、對象、長度'],[.25,'Claude 一段一段地產生回答'],[.55,'追問時不用重講背景'],[.8,'同一段對話會記得前面的內容']],
 draw(u){
  const M=[
   {role:'user',text:'用三句話向國中生解釋光合作用',at:.04},
   {role:'ai',text:'植物用葉子吸收陽光，把水和二氧化碳變成養分（葡萄糖），同時放出氧氣。',at:.14,dur:.28},
   {role:'user',text:'再舉一個生活中的例子',at:.5},
   {role:'ai',text:'窗邊的盆栽會朝向陽光生長，因為它需要光來製造養分。',at:.6,dur:.22},
  ];
  chatPane(250,120,1100,690,M,u,{title:'光合作用說明',model:'Opus 5.5',input:u<.46&&u>.4?'再舉一個…':'輸入訊息…'});
  lab(1290,764,'模型選單',{dx:40,dy:-60,st:'s',a:band(u,.02,.2)});
 }},
/* ⑥ 三個好習慣 */
{t:'用好 Claude 的三個習慣',en:'Three good habits',dur:12,
 d:'剛開始使用 Claude，記住三件事就很夠用：第一，說清楚目標、對象與格式；第二，把回答當作草稿，重要的事實、數字與引用要自己查證；第三，不滿意就追問或請它修改，通常兩三輪就會更貼近需求。後面幾集會分別深入提示詞、上下文、檔案、搜尋、Artifacts 與查證。',
 s:[[0,'第一：說清楚目標、對象與格式'],[.33,'第二：重要內容自己查證'],[.63,'第三：不滿意就追問修改']],
 draw(u){
  diagBG();
  const H=[['1','說清楚','目標、對象、格式與長度','#f2c230'],['2','查證','事實、數字與引用要核對','#e8572a'],['3','追問','請它修改，兩三輪更貼近需求','#7dffc4']];
  H.forEach(([n,h,b,col],i)=>{
    const x=70+i*500,a=seg(u,.02+i*.31,.12+i*.31);
    alphaDo(ease(a),()=>{
      card(x,200,460,440,{bg:'rgba(7,27,39,.8)',st:col,lw:2});
      circ(x+230,300,54,col,'none',0);wt(x+230,322,n,60,'#13232e',800,'center',COND);
      wt(x+230,420,h,34,col,800,'center');
      wrapT(x+230,480,b,20,'#e3ecee',380,30,500,'center');
    });
    if(i<2)alphaDo(seg(u,.28+i*.31,.34+i*.31),()=>arrow(x+470,420,x+492,420,'#fff',3));
  });
  alphaDo(band(u,.8,1),()=>{card(260,690,1080,90,{bg:'rgba(255,255,255,.06)'});wt(800,745,'下一集：好提示詞的五個要素',24,'#f2c230',700,'center');});
 }}
]};
