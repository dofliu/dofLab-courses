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
/* 023-project-dev-ep05 — Git 與 GitHub 工作流程
   Claude AI 應用動畫館｜專案開發 第 5 集
   依 code.claude.com 文件（Common workflows：Create pull requests；Claude Code GitHub Actions：@claude、/install-github-app、需寫入權限、合併前審查 Claude 的變更、CLAUDE.md 定義規範）查證，資訊截至 2026-10 */

/* 分支線：lane 上的 commit 點 */
function dot(x,y,col,a){alphaDo(a===undefined?1:a,()=>{circ(x,y,11,col,'#0b1c26',3);});}
function lane(x0,x1,y,col,p){ln([x0,y,x0+(x1-x0)*p,y],col,5);}
function diffLine(x,y,w,sign,txt,col){box(x,y,w,30,sign==='+'?'rgba(125,255,196,.12)':'rgba(232,87,42,.12)','none',0);wt(x+10,y+22,sign+' '+txt,17,col,700);}
const EP={no:5,slug:'project-dev',t:'Git 與 GitHub 工作流程',en:'Git & GitHub Workflow',
seriesName:'專案開發',total:8,
lede:'Git 讓每次修改都有紀錄，GitHub 讓團隊在 PR 上討論再合併。Claude 可以幫你擬 commit 訊息與 PR 描述、依審查意見修改、協助解決衝突；分支怎麼切、能不能合併，由你和團隊決定。這一集用社團網站、產線程式版本控管與運維系統審查示範。',
facts:[['分支','一件事一條分支','主線保持穩定，新工作在分支上做'],['commit 訊息','說清楚改了什麼、為什麼','Claude 可看變更擬稿，你確認'],['PR 描述','摘要、原因、測試、風險','請 Claude 擬稿，送出前自己讀過'],['審查意見','小意見直接改','大意見先討論，改完再請審查者看'],['解決衝突','兩邊都要保留','請 Claude 提解法，你核對並跑測試']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「請 Claude 建立 PR（create a pr）、再要求補強 PR 描述」「送出前審查 Claude 產生的 PR」依 Claude Code 文件（Common workflows）整理；「在 PR 或 issue 留言 @claude 讓 Claude 分析、修改並推送」「/install-github-app 快速設定」「觸發者需有儲存庫寫入權限」「合併前要審查 Claude 的變更」「用 CLAUDE.md 定義規範」依 Claude Code GitHub Actions 文件整理。資訊截至 2026-10，功能與介面仍在調整，請以官方最新說明為準。分支名稱、commit 訊息、PR 內容、警報門檻與參數均為虛構的示意或典型範例，並非任何特定單位、公司、機組或案場資料；實際流程請依團隊規範與現場規定。AI 提供分析與建議，停機、上鎖掛牌與對 PLC 寫入或下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 分支策略（生活，圖解） */
{t:'分支策略',en:'Branching strategy',dur:14,
 d:'幾個人一起更新社團網站，如果大家都直接改主線，很容易互相蓋掉。比較穩的做法是：主線保持可用，每件事開一條分支。小美做活動頁、阿明修聯絡表單，各自在分支上提交，完成後經過審查才合併回主線。分支名稱要看得出做什麼。分支規則由團隊決定。',
 s:[[0,'主線保持穩定'],[.4,'一件事一條分支'],[.76,'審查後才合併']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  wt(60,230,'main',24,B,800);lane(150,1540,226,B,seg(u,.02,.16));
  wt(60,330,'feature/event-page',20,Y,800);
  alphaDo(seg(u,.2,.34),()=>{ln([330,226,390,326],Y,4);lane(390,1100,326,Y,1);[480,640,800,960].forEach((x,i)=>dot(x,326,Y,seg(u,.22+i*.04,.3+i*.04)));});
  wt(60,430,'fix/contact-form',20,P,800);
  alphaDo(seg(u,.32,.46),()=>{ln([520,226,580,426],P,4);lane(580,1180,426,P,1);[680,840,1000].forEach((x,i)=>dot(x,426,P,seg(u,.34+i*.04,.42+i*.04)));});
  alphaDo(seg(u,.5,.64),()=>{ln([1100,326,1160,226],Y,4);ln([1180,426,1240,226],P,4);dot(1160,226,Y);dot(1240,226,P);wt(1200,196,'審查後合併',19,G,800,'center');});
  alphaDo(seg(u,.4,.54),()=>{card(60,500,740,150,{bg:'rgba(255,255,255,.05)',st:Y,lw:2});wt(90,548,'一件事一條分支',24,Y,800);para(90,588,'名稱看得出做什麼，例如 feature/event-page',680,20,KC.text,600,30);});
  alphaDo(seg(u,.56,.7),()=>{card(840,500,700,150,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(870,548,'都直接改主線',24,O,800);para(870,588,'容易互相蓋掉，出錯也難退回',640,20,KC.text,600,30);});
  alphaDo(seg(u,.78,.88),()=>{wt(60,710,'主線保持可用，新工作在分支上做',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,740,1,'分支規則由團隊決定'));
 }},
/* 2 commit 訊息（智慧自動化） */
{t:'commit 訊息',en:'Commit messages',dur:13,
 d:'每個提交都該說清楚改了什麼、為什麼改。產線程式把掃描週期從一百毫秒調成五十毫秒，如果訊息只寫 update，半年後沒人看得懂。請 Claude 看變更內容擬一則訊息，先寫摘要，再補原因與影響。你確認內容正確，才提交。格式規則可以寫進 CLAUDE.md。調整參數前，現場人員要先確認。',
 s:[[0,'只寫 update，沒人看得懂'],[.42,'摘要、原因、影響'],[.76,'你確認後才提交']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.16),()=>{winFrame(60,190,720,240,'變更內容（示意）');diffLine(84,250,672,'-','scan_ms = 100',O);diffLine(84,290,672,'+','scan_ms = 50',G);wt(84,372,'產線程式：掃描週期',18,SUBC,600);wt(84,404,'100 ms 調成 50 ms',18,SUBC,600);});
  alphaDo(seg(u,.2,.36),()=>{card(820,190,720,110,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(850,240,'不好的訊息',22,O,800);wt(850,280,'update',24,SUBC,700);strike(850,272,80,O);});
  alphaDo(seg(u,.38,.58),()=>{card(820,320,720,240,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(850,368,'好的訊息',22,G,800);
   ['縮短掃描週期為 50 ms','原因：減少輸送帶訊號延遲','影響：CPU 負載上升，需觀察'].forEach((s,i)=>alphaDo(seg(u,.4+i*.05,.5+i*.05),()=>wt(850,420+i*48,s,20,KC.text,700)));});
  alphaDo(seg(u,.56,.7),()=>{bub(60,470,720,'請看這次的變更，擬一則 commit 訊息：先寫摘要，再補原因與影響。','user',1);});
  alphaDo(seg(u,.72,.84),()=>{card(820,590,720,100,{bg:'rgba(255,255,255,.05)',st:B,lw:1.5});para(850,632,'格式規則可寫進 CLAUDE.md',660,21,KC.text,700,30);});
  alphaDo(seg(u,.86,.97),()=>human(60,730,1,'訊息由你確認；參數調整由現場人員確認'));
 }},
/* 3 PR 描述（風能運維，圖解） */
{t:'PR 描述',en:'Pull request descriptions',dur:14,
 d:'PR 是請同事審查的邀請函。以運維系統的警報門檻調整為例，描述要有四塊：改了什麼、為什麼、怎麼測試、有什麼風險。你可以直接對 Claude 說，建立一個 PR，再要求它補強描述，寫清楚背景與風險。送出前，一定要自己把描述讀過一遍。警報門檻由人員確認。',
 s:[[0,'PR 是請人審查的邀請函'],[.42,'改了什麼、為什麼、測試、風險'],[.76,'送出前自己讀過']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.14),()=>{bub(60,200,760,'請建立一個 PR，說明這次調整振動警報門檻的內容。','user',1);});
  alphaDo(seg(u,.14,.26),()=>{bub(60,350,760,'我再補強描述：加入背景、測試結果與風險。','ai',1);});
  alphaDo(seg(u,.3,.46),()=>{card(860,190,680,520,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(890,240,'PR 描述（示意）',23,G,800);
   [['改了什麼','振動警報門檻 7.1 調為 6.5',Y],['為什麼','減少誤報，提早發現異常',B],['怎麼測試','舊資料重播，測試 12 passed',G],['風險','門檻變嚴，工單量可能增加',O]].forEach((r,i)=>alphaDo(seg(u,.32+i*.05,.44+i*.05),()=>{tag(890,272+i*104,r[0],{size:16,bg:r[2]});para(890,336+i*104,r[1],620,19,KC.text,600,28);}));});
  alphaDo(seg(u,.5,.64),()=>{card(60,520,760,120,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(90,568,'PR 是請同事審查的邀請函',23,B,800);wt(90,608,'寫給沒看過這段程式的人',19,SUBC,600);});
  alphaDo(seg(u,.76,.86),()=>{card(60,660,760,70,{bg:'rgba(255,255,255,.05)',st:Y,lw:1.5});wt(90,706,'送出前，自己把描述讀過一遍',22,Y,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,750,1,'警報門檻由人員確認'));
 }},
/* 4 回應審查意見（風能運維→生活，圖解） */
{t:'回應審查意見',en:'Responding to review comments',dur:14,
 d:'同事在 PR 留下審查意見。小意見，像改變數名稱、補一個測試，可以請 Claude 直接改好再推送。大意見，像改整個流程，先討論再動手。若團隊裝好 Claude Code GitHub Actions，在 PR 留言 at claude，Claude 就會分析並修改，觸發的人需要有儲存庫寫入權限。改完要請審查者再看一次，合併前仍要審查 Claude 的變更。',
 s:[[0,'小意見直接改'],[.42,'大意見先討論'],[.76,'改完請審查者再看']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.16),()=>{card(60,190,720,110,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,236,'審查者：變數名稱 th 看不懂',20,Y,800);wt(90,276,'小意見 → 直接改、補測試、推送',19,KC.text,600);});
  alphaDo(seg(u,.14,.28),()=>{card(60,320,720,110,{bg:'rgba(7,27,39,.85)',st:O,lw:2});wt(90,366,'審查者：整個警報流程要重新設計',20,O,800);wt(90,406,'大意見 → 先討論，再決定',19,KC.text,600);});
  alphaDo(seg(u,.3,.5),()=>{card(820,190,720,240,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(850,238,'在 PR 留言（需已設定）',22,B,800);
   para(850,284,'@claude 把 th 改名為 vib_threshold，並補上測試',660,21,G,700,31);});
  alphaDo(seg(u,.5,.66),()=>{card(820,450,720,130,{bg:'rgba(255,255,255,.05)',st:'rgba(255,255,255,.3)',lw:1.5});para(850,496,'觸發的人需要有儲存庫寫入權限',660,21,KC.text,700,31);});
  [['留言',B],['修改',Y],['推送',G],['再審查',P]].forEach((r,i)=>alphaDo(seg(u,.62+i*.05,.74+i*.05),()=>{card(60+i*380,620,340,76,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(230+i*380,668,r[0],22,r[1],800,'center');if(i<3)arrow(402+i*380,658,436+i*380,658,Y,3);}));
  alphaDo(seg(u,.86,.97),()=>human(60,730,1,'合併前，由人員審查變更'));
 }},
/* 5 解決衝突（智慧自動化） */
{t:'解決衝突',en:'Resolving conflicts',dur:14,
 d:'兩個人同時改同一份產線設定檔，合併時 Git 會標出衝突。標記裡，上半是你這邊的版本，下半是對方的版本。請 Claude 讀懂兩邊的用意，提出同時保留兩邊的解法，你再核對。解完要跑測試，確認行為正確，再提交。共用分支不要強制覆蓋。設定值由現場人員確認。',
 s:[[0,'兩個人改了同一處'],[.42,'請 Claude 提解法，你核對'],[.76,'跑測試，共用分支不強推']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.2),()=>{winFrame(60,190,820,320,'line_config.yaml（衝突，示意）');
   [['<<<<<<< 我的分支',O],['speed_mm_s: 400',B],['=======',O],['timeout_s: 30',P],['>>>>>>> 對方的分支',O]].forEach((r,i)=>wt(88,262+i*48,r[0],20,r[1],700));
   box(80,282,780,38,'rgba(88,184,208,.14)','none',0);box(80,378,780,38,'rgba(179,124,255,.14)','none',0);
   wt(88,482,'兩邊的修改不同，Git 不知道誰對',18,SUBC,600);});
  alphaDo(seg(u,.4,.56),()=>{card(920,190,620,150,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(950,238,'請 Claude 讀懂兩邊用意',22,B,800);para(950,278,'提出同時保留兩邊的解法',560,20,KC.text,600,30);});
  alphaDo(seg(u,.52,.68),()=>{winFrame(920,360,620,200,'解法（示意）');['speed_mm_s: 400','timeout_s: 30'].forEach((s,i)=>wt(948,430+i*44,s,20,G,700));});
  alphaDo(seg(u,.68,.8),()=>{card(60,540,820,100,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,600,'解完衝突：跑測試，8 passed',24,G,800);});
  alphaDo(seg(u,.76,.88),()=>{card(920,590,620,100,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(950,650,'共用分支不要強制覆蓋',22,O,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,730,1,'設定值由現場人員確認'));
 }},
/* 6 總結（三情境，圖解） */
{t:'分支、提交、審查、合併',en:'Branch, commit, review, merge',dur:13,
 d:'整個流程是：開分支，寫好提交訊息，建立 PR 並寫清楚描述，回應審查意見，解決衝突後合併。社團網站、產線程式、運維系統，做法都一樣：小步提交、清楚溝通、由人決定合併。下一集，我們來看怎麼擴充 Claude Code。',
 s:[[0,'分支、提交、PR、審查、合併'],[.46,'三個專案，同一套做法'],[.8,'下一集：擴充 Claude Code']],
 draw(u){
  diagBG();floatParticles(8,59);
  [['分支',B],['提交',Y],['PR',G],['審查',P]].forEach((r,i)=>alphaDo(seg(u,.02+i*.08,.14+i*.08),()=>{card(60+i*380,180,340,110,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(230+i*380,246,r[0],28,r[1],800,'center');if(i<3)arrow(402+i*380,235,436+i*380,235,Y,4);}));
  alphaDo(seg(u,.3,.44),()=>{wt(815,350,'合併與否，由人決定',22,O,700,'center');});
  alphaDo(seg(u,.46,.72),()=>{
   [['生活','社團網站多人分支合作',B],['智慧自動化','產線程式提交與衝突',Y],['風能運維','警報門檻 PR 與審查',G]].forEach((r,i)=>{card(60+i*500,430,480,140,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,448,r[0],{size:17,bg:r[2]});wt(86+i*500,542,r[1],24,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,660,'小步提交、清楚溝通、由人決定合併',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'合併前，由人員審查'));
 }}
]};
