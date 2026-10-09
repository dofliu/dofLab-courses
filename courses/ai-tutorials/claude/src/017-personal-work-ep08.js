// KITS: claude
/* 017-personal-work-ep08 — Skills：把工作流程打包
   Claude AI 應用動畫館｜個人工作 第 8 集
   依 support.claude.com（What are Skills / How to create custom Skills；platform.claude.com Agent Skills overview）查證，資訊截至 2026-10 */

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
const EP={no:8,slug:'personal-work',t:'Skills：把工作流程打包',en:'Skills',
seriesName:'個人工作',total:8,
lede:'每次都要重新交代一次的做事方法，可以寫成 Skill：一個資料夾加上一份 SKILL.md，Claude 遇到相關任務時才讀進來照做。這一集用家庭採買清單、設備異常 8D 報告與風機巡檢報告示範怎麼打包、怎麼觸發、怎麼分享，把關仍由你負責。',
facts:[['1 份','SKILL.md','資料夾裡的核心檔案，開頭是名稱與描述'],['2 欄','名稱與描述','Claude 先靠描述判斷這個技能何時該用'],['按需','才載入內容','平常只帶簡短描述，用到時才讀完整指示'],['ZIP','上傳自訂技能','把技能資料夾壓縮後上傳，開關可自行控制'],['人檢查','再採用成果','8D 結論與巡檢判定由工程師確認']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。Skills 的結構、載入方式、上傳與分享規則依 Claude 說明中心（support.claude.com「What are Skills」「How to create custom Skills」）與 platform.claude.com Agent Skills 文件整理，資訊截至 2026-10；方案、介面與分享權限仍在調整，請以官方最新說明為準。採買清單、警報、8D、巡檢與工單內容均為虛構的示意或典型範例，並非任何特定公司、機關或案場資料；AI 提供分析與建議，停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 什麼是 Skill（生活） */
{t:'什麼是 Skill',en:'What is a Skill',dur:14,
 d:'你是不是常常每次都重新交代同一套做法？例如家庭採買清單：依賣場動線分類、已有的食材先扣掉、最後附預估預算。把這套做法寫成一個 Skill，Claude 遇到相關任務就自動照著做，不用每次貼一長串說明。Skill 就像一份放進資料夾的工作說明書。',
 s:[[0,'每次重新交代，很費力'],[.4,'寫成 Skill，一次打包'],[.74,'相關任務自動照做']],
 draw(u){
  sceneBG();
  card(60,170,720,560,{bg:'rgba(7,27,39,.82)',st:O,lw:2});caseTag(84,192,'life',1);wt(90,262,'沒有 Skill：每次都要說',24,O,800);
  alphaDo(seg(u,.02,.14),()=>{['依賣場動線分類','已有的食材先扣掉','最後附預估預算','不要品牌，只列品項'].forEach((s,i)=>{card(90,290+i*76,640,62,{bg:'rgba(255,255,255,.05)',st:O});wt(116,330+i*76,s,20,KC.text,600);});});
  alphaDo(seg(u,.2,.3),()=>{tag(90,620,'每週都要貼一次',{size:18,bg:O});});
  arrow(790,450,830,450,Y,4);
  card(840,170,700,560,{bg:'rgba(7,27,39,.82)',st:G,lw:2});wt(870,262,'有 Skill：一次打包',24,G,800);
  alphaDo(seg(u,.42,.54),()=>{card(870,290,640,140,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(896,336,'家庭採買清單',26,'#fff',800);wt(896,376,'SKILL.md ＋ 範例清單',19,SUBC,600);tag(1380,310,'資料夾',{size:15,bg:G});});
  alphaDo(seg(u,.62,.74),()=>{bub(870,460,640,'幫我整理這週採買清單','user',1);});
  alphaDo(seg(u,.76,.88),()=>{para(870,640,'Claude 自動套用技能：分類、扣庫存、附預算。',620,20,KC.text,600,30);});
  alphaDo(seg(u,.86,.96),()=>human(60,770,1,'清單內容出門前由你確認'));
 }},
/* 2 SKILL.md 結構（圖解） */
{t:'SKILL.md 的結構',en:'Anatomy of SKILL.md',dur:14,
 d:'一個 Skill 就是一個資料夾，核心是 SKILL.md。檔案開頭是名稱與描述，用來讓 Claude 判斷何時使用；下面是正文，寫清楚步驟、格式與注意事項。需要的話，資料夾裡還能放範例、範本或腳本，正文裡指出什麼時候去讀它們。',
 s:[[0,'一個 Skill ＝ 一個資料夾'],[.4,'開頭：名稱與描述'],[.72,'正文：步驟與格式；可附範例']],
 draw(u){
  sceneBG();
  card(60,170,520,560,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,222,'資料夾結構',22,Y,800);
  alphaDo(seg(u,.02,.12),()=>{[['8d-report/',0,Y],['SKILL.md',1,G],['examples/',1,B],['template.md',2,B]].forEach((r,i)=>{card(90+r[1]*34,256+i*84,400-r[1]*34,64,{bg:'rgba(255,255,255,.05)',st:r[2]});wt(116+r[1]*34,298+i*84,r[0],20,r[2],700);});});
  alphaDo(seg(u,.4,.5),()=>{box(640,170,900,200,'#f6f9f8',Y,2);box(640,170,900,6,Y,'none',0);wt(666,214,'開頭：給 Claude 判斷「何時用」',20,'#13232e',800);
   wt(666,258,'name: 8d-report',20,'#4f6470',700);para(666,298,'description: 設備異常時，整理成 8D 報告草稿',860,20,'#4f6470',700,28);tag(1330,196,'名稱＋描述',{size:16,bg:Y});});
  alphaDo(seg(u,.56,.7),()=>{box(640,400,900,330,'#f6f9f8',G,2);box(640,400,900,6,G,'none',0);wt(666,444,'正文：怎麼做',20,'#13232e',800);
   ['先確認異常現象與時間','列出臨時對策與可能原因','依範本輸出 D1–D8 草稿','標出需人員判斷的項目'].forEach((s,i)=>{circ(676,484+i*46,4,G,'none',0);wt(694,490+i*46,s,19,'#4f6470',600);});});
  alphaDo(seg(u,.8,.92),()=>{tag(1100,688,'附件按需才讀',{size:17,bg:B});});
  alphaDo(seg(u,.86,.96),()=>human(60,770,1,'步驟與判斷準則由你寫、你改'));
 }},
/* 3 觸發與載入（圖解） */
{t:'觸發與載入',en:'How a Skill is triggered and loaded',dur:15,
 d:'Skill 分層載入，省下上下文。第一層：平常只帶每個技能的名稱與簡短描述。第二層：當你的任務符合描述，Claude 才讀進完整的 SKILL.md 指示。第三層：只有需要時才打開範例、範本或腳本。所以描述寫得清楚，決定它會不會在對的時候被用到。',
 s:[[0,'第一層：只帶名稱與描述'],[.38,'第二層：符合任務才讀正文'],[.7,'第三層：需要才開附件']],
 draw(u){
  diagBG();floatParticles(10,17);
  const L=[['第一層','名稱與描述','每個技能都帶，內容很短',B],['第二層','SKILL.md 正文','任務符合描述時才載入',G],['第三層','範例、範本、腳本','指示提到時才開',Y]];
  L.forEach((r,i)=>{const a=seg(u,.02+i*.3,.14+i*.3),x=60+i*500;
   alphaDo(a,()=>{card(x,180,470,330,{bg:'rgba(7,27,39,.85)',st:r[3],lw:2});tag(x+24,200,r[0],{size:17,bg:r[3]});wt(x+24,282,r[1],26,'#fff',800);para(x+24,330,r[2],420,20,KC.text,600,30);if(i<2)arrow(x+474,345,x+496,345,r[3],3);});});
  alphaDo(seg(u,.1,.2),()=>{[0,1,2,3].forEach(i=>{box(110+i*100,420,80,30,'rgba(88,184,208,.25)',B,1.5);});wt(110,478,'短短幾行，成本很低',17,B,700);});
  alphaDo(seg(u,.5,.62),()=>{bub(580,560,600,'設備停機了，幫我整理成 8D','user',1);});
  alphaDo(seg(u,.64,.76),()=>{tag(1220,590,'符合描述 → 載入',{size:18,bg:G});});
  alphaDo(seg(u,.8,.9),()=>{card(60,740,1000,64,{bg:'rgba(255,255,255,.05)',st:Y});wt(86,782,'描述寫得越具體，越容易在對的時候被用到',20,Y,700);});
  alphaDo(seg(u,.86,.96),()=>human(1100,740,1,'輸出結果先由你檢查'));
 }},
/* 4 建立自己的技能（智慧自動化） */
{t:'建立自己的技能',en:'Building your own Skill',dur:15,
 d:'做法很單純：挑一件常做、格式固定的事，把你的做法寫成 SKILL.md，加上一份範例，壓縮成 ZIP 上傳。以設備異常 8D 報告為例：寫下步驟與報告格式，附一份示意範例。上傳後用幾句話測試，不準就回頭改描述，慢慢調整。',
 s:[[0,'挑一件固定的事，寫成 SKILL.md'],[.4,'壓縮成 ZIP 上傳並開啟'],[.72,'測試、調整描述']],
 draw(u){
  sceneBG();
  const S=[['1','寫 SKILL.md','步驟與格式',Y],['2','附範例','一份示意 8D',B],['3','壓縮 ZIP','資料夾在最外層',P],['4','上傳並開啟','在 Skills 設定頁',G],['5','測試調整','不準就改描述',O]];
  S.forEach((r,i)=>{const a=seg(u,.02+i*.08,.12+i*.08),x=60+i*300;
   alphaDo(a,()=>{card(x,170,280,220,{bg:'rgba(7,27,39,.85)',st:r[3],lw:2});circ(x+44,220,22,r[3],'none',0);wt(x+44,228,r[0],22,'#0e2133',800,'center');para(x+24,290,r[1],240,23,'#fff',800,30);para(x+24,356,r[2],240,18,SUBC,600,26);if(i<4)arrow(x+282,280,x+298,280,r[3],3);});});
  alphaDo(seg(u,.46,.58),()=>{card(60,430,740,300,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});caseTag(84,450,'auto',1);wt(90,520,'8D 報告技能（示意）',24,'#fff',800);
   ['D1 組成小組　D2 描述問題','D3 臨時對策　D4 找出根因','D5–D6 矯正與驗證','D7–D8 預防與結案'].forEach((s,i)=>{circ(104,560+i*40,4,Y,'none',0);wt(122,566+i*40,s,19,KC.text,600);});});
  alphaDo(seg(u,.74,.86),()=>{card(840,430,700,300,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(870,478,'測試時可以問',22,G,800);bub(870,500,640,'伺服過載停機，幫我起草 8D','user',1);});
  alphaDo(seg(u,.88,.97),()=>human(60,770,1,'根因與矯正措施由工程師確認'));
 }},
/* 5 風機巡檢報告技能（風能） */
{t:'巡檢報告技能',en:'An inspection-report Skill',dur:14,
 d:'風能運維的例子：把巡檢報告的格式與檢核項目寫成技能。你只要貼上這次的巡檢紀錄，Claude 就依固定格式整理：機組編號、檢查項目、發現、建議工單。報告的版面一致，主管看起來也省力。判定是否可繼續運轉，仍由工程師決定。',
 s:[[0,'貼上巡檢紀錄，套用固定格式'],[.42,'檢核項目逐項整理'],[.76,'可否運轉由工程師判定']],
 draw(u){
  sceneBG();
  winFrame(60,150,720,650,'巡檢紀錄（示意）');caseTag(84,208,'wind',1);
  alphaDo(seg(u,.02,.14),()=>{['T07 葉片前緣：輕微砂蝕','T07 齒輪箱：振動偏高','T12 偏航：角度偏差 6°（示意）','T03 塔筒螺栓：外觀正常'].forEach((s,i)=>{card(90,260+i*92,660,76,{bg:'rgba(255,255,255,.05)',st:B});wt(116,306+i*92,s,19,KC.text,600);});});
  arrow(790,480,830,480,Y,4);
  card(840,150,700,650,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(870,200,'固定格式的報告草稿',23,G,800);
  alphaDo(seg(u,.42,.58),()=>{cells(870,230,[90,150,160,240],['機組','項目','發現','建議'],46,true);[['T07','葉片','前緣砂蝕','排修補'],['T07','齒輪箱','振動偏高','排檢查'],['T12','偏航','偏差 6°','排校正']].forEach((r,i)=>cells(870,276+i*50,[90,150,160,240],r,50,false));});
  alphaDo(seg(u,.62,.74),()=>{card(870,470,640,100,{bg:'rgba(255,255,255,.05)',st:Y});wt(896,512,'建議工單',18,Y,700);wt(896,548,'WO-0511、WO-0512（示意）',19,KC.text,600);});
  alphaDo(seg(u,.78,.9),()=>{card(870,600,640,64,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(900,642,'草稿，需補上現場判斷',20,O,700);});
  alphaDo(seg(u,.84,.96),()=>human(870,700,1,'是否停機、排程由工程師決定'));
 }},
/* 6 團隊共享（圖解） */
{t:'團隊共享與注意事項',en:'Sharing with your team',dur:13,
 d:'你上傳的自訂技能，預設只有自己用得到。在團隊或企業方案，擁有者開啟分享功能後，才能把技能分享給同事、群組或整個組織。分享前先檢查：內容有沒有機密資料、描述是否清楚、範例是不是示意資料。技能內容也要定期更新，避免照著過時的做法。',
 s:[[0,'預設只有你能用'],[.4,'團隊方案：擁有者開啟後可分享'],[.72,'分享前的檢查清單']],
 draw(u){
  diagBG();floatParticles(8,23);
  alphaDo(seg(u,.02,.14),()=>{card(60,180,440,300,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(90,232,'個人',24,'#fff',800);para(90,282,'自己上傳的技能，預設只有自己使用',380,20,KC.text,600,30);tag(90,420,'預設私人',{size:17,bg:B});});
  alphaDo(seg(u,.4,.54),()=>{arrow(510,330,550,330,Y,4);card(560,180,980,300,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(590,232,'團隊／企業方案',24,'#fff',800);
   [['同事',B],['群組',G],['整個組織',P]].forEach((r,i)=>{card(590+i*310,270,290,80,{bg:'rgba(255,255,255,.05)',st:r[1]});wt(616+i*310,320,r[0],21,r[1],700);});
   wt(590,410,'需先由擁有者在組織設定開啟分享',20,Y,700);});
  alphaDo(seg(u,.72,.86),()=>{card(60,520,1480,200,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(90,568,'分享前檢查',22,G,800);['沒有機密或個資','描述清楚，何時該用','範例都是示意資料','有人負責定期更新'].forEach((s,i)=>{check(104+(i%2)*700,606+Math.floor(i/2)*44,true,G);wt(130+(i%2)*700,612+Math.floor(i/2)*44,s,19,KC.text,600);});});
  alphaDo(seg(u,.88,.97),()=>human(60,760,1,'分享範圍與內容由你決定'));
 }}
]};
