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

/* 031-teaching-ep04 — 差異化與適性教學
   Claude AI 應用動畫館｜課程教學 第 4 集
   依 Claude 支援文章（Projects 的專屬指令、個人化偏好與風格設定）查證，資訊截至 2026-11 */

const EP={no:4,slug:'teaching',t:'差異化與適性教學',en:'Differentiated Instruction',
seriesName:'課程教學',total:8,
lede:'同一份教材，學生程度與需求不同。這一集用分級閱讀、控制原理教材、風機運維教材，示範怎麼請 Claude 改寫成不同難度、翻成多語、調整給特殊需求學生、設計鷹架式提示並做成學習單，教師逐一確認後才使用。',
facts:[['分級改寫','同一內容，多種難度','保留核心概念不變'],['多語教材','中英對照與術語表','專有名詞由教師審閱'],['特殊需求','調整格式與步驟','與學生及專業人員討論'],['鷹架提示','由淺到深逐步提示','不直接給答案'],['專案指令','Projects 可存放專屬指令','只作用於該專案內的對話']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「Projects 可設定只作用於該專案的指令」依 Claude 支援文章整理，資訊截至 2026-11，功能與方案仍在調整，請以官方最新說明為準。教材內容、學生程度與數據均為虛構的示意或典型範例，並非任何特定學校、學生或案場資料。AI 提供草案與建議；教材正確性、學生分級與特殊需求安排、學生個資保護，以及涉及設備操作的安全程序（例如上鎖掛牌），一律由教師與現場人員確認。',
shots:[
{t:'分級閱讀改寫',en:'Leveled reading',dur:14,
 d:'同一篇文章，不同學生讀起來難易不同。請 Claude 保留核心概念，改寫成三個閱讀程度：句子更短、詞彙更簡單，或補上背景與延伸。以生活科普短文為例，改寫後教師要檢查概念有沒有被改錯。',
 s:[[0,'同一篇，三個程度'],[.4,'核心概念不能變'],[.76,'教師檢查改寫結果']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.2),()=>{card(60,200,1480,80,{bg:'rgba(242,194,48,.08)',st:Y,lw:2});wt(90,252,'原文：為什麼冰箱門打開後，冷氣會很快跑掉？（示意）',23,Y,800);});
  alphaDo(seg(u,.24,.66),()=>{
   [['基礎','短句、簡單詞彙','冷空氣比較重，門一開就流出來。',B],['標準','保留原文程度','冷空氣密度較大，開門後與室溫空氣交換。',G],['進階','補延伸','加入對流與熱傳導，延伸到冷鏈物流。',P]].forEach((r,i)=>{
    alphaDo(seg(u,.24+i*.1,.36+i*.1),()=>{card(60+i*500,310,480,250,{bg:'rgba(7,27,39,.85)',st:r[3],lw:2});tag(86+i*500,328,r[0],{size:18,bg:r[3]});wt(90+i*500,400,r[1],20,r[3],700);para(90+i*500,445,r[2],420,20,'#fff',600,30);});});});
  alphaDo(seg(u,.68,.88),()=>{card(60,600,1480,70,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,645,'三個版本的核心概念一致：冷熱空氣交換',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'概念正確性，由教師檢查'));
 }},
{t:'多語教材與術語表',en:'Multilingual materials',dur:14,
 d:'班上有外籍學生或要準備英文教材時，可以請 Claude 產生中英對照版本，並整理一份術語表。以控制原理為例，回授、誤差、設定值這些詞，要在兩種語言裡一致。專有名詞的譯法，請教師或專業人員審閱。',
 s:[[0,'中英對照教材'],[.4,'整理術語表'],[.76,'專有名詞由教師審閱']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.4),()=>{
   card(60,200,700,230,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,250,'中文教材',22,Y,800);para(90,296,'控制器比較設定值與回授，算出誤差再調整輸出。',640,21,'#fff',600,32);
   arrow(780,315,860,315,Y,4);
   card(880,200,660,230,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(910,250,'English version',22,B,800);['The controller compares the setpoint with','feedback and adjusts the output to','reduce the error.'].forEach((l,i)=>wt(910,296+i*32,l+'\u200b',21,'#fff',600));});
  alphaDo(seg(u,.42,.74),()=>{
   const cols=[260,260,260];
   cells(60,470,cols,['中文\u200b','English','說明'],48,true);
   [['設定值\u200b','Setpoint','目標'],['回授\u200b','Feedback','量測回傳'],['誤差\u200b','Error','差距']].forEach((r,i)=>{alphaDo(seg(u,.46+i*.08,.56+i*.08),()=>cells(60,518+i*52,cols,r,52,false));});
   wt(60,700,'術語表（示意）',19,SUBC,700);});
  alphaDo(seg(u,.9,.99),()=>human(60,750,1,'專有名詞譯法，由教師審閱'));
 }},
{t:'依對象改寫運維教材',en:'Different audiences',dur:14,
 d:'同一份風機運維內容，現場技師要的是重點與檢查順序，新進人員則需要名詞解釋和圖示。請 Claude 依對象分別改寫。但凡是涉及上鎖掛牌的安全程序，改寫只能調整表達方式，步驟內容必須由現場負責人確認。',
 s:[[0,'兩種讀者，兩種寫法'],[.4,'新進人員多補說明'],[.76,'安全步驟由人確認']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.5),()=>{
   card(60,200,730,300,{bg:'rgba(7,27,39,.85)',st:G,lw:2});tag(86,218,'現場技師',{size:18,bg:G});
   ['檢查順序一覽','異常判讀要點','工單填寫重點'].forEach((s,i)=>{circ(100,300+i*50,5,G,'none',0);wt(120,308+i*50,s,22,'#fff',700);});
   card(810,200,730,300,{bg:'rgba(7,27,39,.85)',st:B,lw:2});tag(836,218,'新進人員',{size:18,bg:B});
   ['名詞解釋','部件示意圖','為什麼要這樣做'].forEach((s,i)=>{circ(850,300+i*50,5,B,'none',0);wt(870,308+i*50,s,22,'#fff',700);});});
  alphaDo(seg(u,.52,.76),()=>{wt(60,550,'安全程序：上鎖掛牌（示意）',20,O,800);
   ['辨識能源','停機隔離','上鎖掛牌','確認零能量'].forEach((s,i)=>node(60+i*226,580,206,80,s,O,1,19));});
  alphaDo(seg(u,.8,.9),()=>{wt(60,710,'只改表達，不改步驟內容',22,O,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,750,1,'安全步驟，由現場負責人確認'));
 }},
{t:'特殊需求的調整',en:'Adjusting for special needs',dur:14,
 d:'有些學生需要不同的呈現方式，例如大字體、短段落、清楚的步驟編號，或加上圖示。請 Claude 依你描述的調整方向修改格式與步驟。學生的診斷與安排由專業人員和教師決定，不要把學生姓名或個人資料貼進對話。',
 s:[[0,'調整格式與步驟'],[.4,'由專業人員決定安排'],[.76,'不貼學生個資']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.5),()=>{
   [['原版','長段落，一次說完太多',KC.border],['調整版','短段落、步驟編號、重點加粗',G]].forEach((r,i)=>{
    card(60+i*760,200,720,280,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});wt(90+i*760,250,r[0],24,i?G:'#fff',800);
    if(!i){for(let k=0;k<5;k++)box(90,280+k*34,640-(k%2)*90,16,'rgba(255,255,255,.18)','none',0);}
    else{[['1','準備材料'],['2','依序加入'],['3','觀察並記錄']].forEach((s,k)=>{circ(110+760,310+k*56,16,G,'none',0);wt(110+760,316+k*56,s[0],18,'#13232e',800,'center');wt(145+760,318+k*56,s[1],24,'#fff',800);});}});
   arrow(790,340,840,340,Y,4);});
  alphaDo(seg(u,.52,.76),()=>{card(60,520,1480,76,{bg:'rgba(88,184,208,.1)',st:B,lw:2});wt(90,568,'學生姓名、診斷與個人資料，不要貼進對話',22,B,800);});
  alphaDo(seg(u,.8,.9),()=>{wt(60,650,'AI 只調整教材呈現方式',22,G,800);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'學生安排，由教師與專業人員決定'));
 }},
{t:'鷹架式提示與學習單',en:'Scaffolded hints and worksheets',dur:14,
 d:'遇到困難的學生，不要直接給答案。請 Claude 設計由淺到深的提示：先提醒觀念，再給方向，最後才給部分步驟。再把題目與提示整理成學習單。以開迴路與閉迴路為例，也可以把這些要求存成 Projects 的專屬指令，之後同一專案的對話都會遵守。',
 s:[[0,'提示由淺到深'],[.4,'整理成學習單'],[.76,'存成專案指令']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.4),()=>{
   wt(60,215,'題目：恆溫器為什麼要裝感測器？（示意）',22,Y,800);
   [['提示 1','想想：它怎麼知道現在幾度？',B],['提示 2','回授是把什麼送回控制器？',G],['提示 3','寫出比較設定值與量測值的步驟',P]].forEach((r,i)=>{
    alphaDo(seg(u,.08+i*.1,.2+i*.1),()=>{card(60+i*500,250,480,130,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,266,r[0],{size:17,bg:r[2]});para(90+i*500,340,r[1],420,20,'#fff',600,28);});});});
  alphaDo(seg(u,.42,.72),()=>{winFrame(60,420,720,260,'學習單（示意）');
   ['題目與提示卡','作答空白處','自我檢核'].forEach((s,i)=>{checkBox(100,472+i*62,seg(u,.5+i*.06,.58+i*.06));wt(150,498+i*62,s,22,'#fff',700);});
   card(820,450,720,170,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(850,504,'Projects 專屬指令',22,G,800);para(850,548,'先給提示，不直接給答案',660,21,'#fff',600,30);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'提示與學習單，由教師審閱'));
 }},
{t:'差異化教學回顧',en:'Recap',dur:13,
 d:'整理一下：分級改寫保留核心概念；多語教材搭配術語表；依對象調整寫法，安全步驟由人確認；特殊需求由專業人員決定；鷹架提示由淺到深，再整理成學習單。三個課程類型都適用。下一集是測驗關卡，再下一集是 AI 家教。',
 s:[[0,'差異化教學五步'],[.5,'三類課程都適用'],[.8,'下一集：測驗關卡']],
 draw(u){
  diagBG();floatParticles(8,81);
  alphaDo(seg(u,.02,.5),()=>{pipe(60,200,['分級','多語','對象','鷹架'],seg(u,.02,.5),[B,Y,G,P]);node(60+4*226,200,206,92,'學習單',O,seg(u,.4,.5),21);});
  alphaDo(seg(u,.5,.74),()=>{
   [['生活','分級科普短文',B],['智慧自動化','控制原理多層次',Y],['風能運維','技師與新進人員版本',G]].forEach((r,i)=>{card(60+i*500,380,480,120,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,398,r[0],{size:17,bg:r[2]});wt(86+i*500,472,r[1],22,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,600,'Claude 起草，教師確認內容與安排',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'教材、分級與安全程序，由教師負責'));
 }}
]};
