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
/* 025-project-dev-ep07 — 部署上線：GitHub Pages
   Claude AI 應用動畫館｜專案開發 第 7 集
   依 GitHub Docs（Pages：發佈來源可為分支或 GitHub Actions 自訂工作流程；自訂網域：頂級網域用 A／ALIAS／ANAME 記錄、www 子網域用 CNAME 記錄；用 Actions 發佈時 GitHub 不會建立 CNAME 檔；Enforce HTTPS 為選用，設定網域後可能需等待才出現）查證，資訊截至 2026-10 */

const EP={no:7,slug:'project-dev',t:'部署上線：GitHub Pages',en:'Deploying to GitHub Pages',
seriesName:'專案開發',total:8,
lede:'專案做好了，下一步是讓別人看得到。GitHub Pages 能把靜態網站免費放上網：資料夾結構要單純，內容用資料檔驅動，push 之後自動部署，需要時再綁自訂網域。這一集用個人作品集、產線成果頁與運維知識庫示範，最後別忘了上線檢查，因為公開網站的內容全世界都看得到。',
facts:[['靜態網站','HTML、CSS、JavaScript 與圖片','沒有後端程式，入口是 index.html'],['資料驅動','內容放 JSON，頁面讀取顯示','新增內容只改資料檔'],['push 自動部署','推上主分支就更新','可用分支或 Actions 發佈'],['自訂網域','DNS 記錄加網域設定','HTTPS 為選用，可能要等待'],['上線檢查','連結、手機版、敏感資料','公開網站人人看得到']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「GitHub Pages 適合靜態網站、發佈來源可選分支或 GitHub Actions 自訂工作流程」依 GitHub Docs（Pages）整理；「頂級網域用 A、ALIAS 或 ANAME 記錄，www 子網域用 CNAME 記錄，Enforce HTTPS 為選用且設定網域後可能需等待才出現，以 Actions 發佈時 GitHub 不會建立 CNAME 檔」依 GitHub Docs（自訂網域）整理。資訊截至 2026-10，功能與介面仍在調整，請以官方最新說明為準。網址、帳號、檔名、網域與資料均為虛構的示意或典型範例，並非任何特定單位、公司、機組或案場資料；公開網站請勿放入內部或個資資料，實際流程請依團隊規範與現場規定。AI 提供分析與建議，停機、上鎖掛牌與對 PLC 寫入或下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 靜態網站結構（生活，圖解） */
{t:'靜態網站長什麼樣',en:'What a static site looks like',dur:14,
 d:'GitHub Pages 放的是靜態網站：HTML、樣式、腳本和圖片，沒有後端程式。以個人作品集為例，資料夾裡有 index 檔、css 目錄和 images 目錄。index 檔是入口，瀏覽器打開網址，先讀它。網址通常是帳號加 github.io，再加專案名稱。結構單純、路徑清楚，Claude 改起來不容易出錯。',
 s:[[0,'靜態：沒有後端程式'],[.42,'index.html 是入口'],[.76,'結構單純，路徑清楚']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  alphaDo(seg(u,.02,.2),()=>{winFrame(60,200,560,360,'my-portfolio/（示意）');
   [['index.html',Y],['css/style.css',B],['images/hero.jpg',P],['images/project1.png',P],['about.html',B]].forEach((r,i)=>codeLine(90,272+i*52,r[0],r[1]));});
  alphaDo(seg(u,.24,.42),()=>{arrow(640,380,720,380,Y,4);card(730,200,400,110,{bg:'rgba(7,27,39,.85)',st:G,lw:2});wt(760,252,'靜態網站',23,G,800);wt(760,290,'HTML、CSS、JS、圖片',19,SUBC,600);});
  alphaDo(seg(u,.4,.58),()=>{card(1150,200,390,110,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(1180,252,'沒有後端程式',23,O,800);wt(1180,290,'不能跑資料庫',19,SUBC,600);});
  alphaDo(seg(u,.44,.64),()=>{card(730,340,810,100,{bg:'rgba(255,255,255,.05)',st:Y,lw:2});wt(760,404,'瀏覽器先讀 index.html',24,Y,800);});
  alphaDo(seg(u,.6,.76),()=>{card(730,470,810,90,{bg:'rgba(7,27,39,.85)',st:B,lw:2});wt(760,525,'https://帳號.github.io/my-portfolio/',21,'#fff',700);});
  alphaDo(seg(u,.76,.88),()=>{card(60,590,1480,90,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,646,'結構單純、路徑清楚，Claude 改起來不容易出錯',23,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,730,1,'放什麼內容上網，由你決定'));
 }},
/* 2 資料驅動 catalog（智慧自動化，圖解） */
{t:'資料驅動：catalog.json',en:'Data-driven: catalog.json',dur:14,
 d:'內容會越來越多時，不要每次都改網頁。把項目寫進一個 JSON 資料檔，頁面載入後讀取，自動畫出卡片。以產線改善成果展示頁為例，每個改善案是資料檔裡的一筆：標題、日期、示意指標。新增一個案子，只要多加一筆資料，頁面程式不必動。讓 Claude 幫你檢查資料格式，也很方便。',
 s:[[0,'內容越多，越不要改網頁'],[.42,'資料檔 → 自動畫卡片'],[.76,'新增只加一筆']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.18),()=>{card(60,200,520,100,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,248,'每次都改 HTML',22,O,800);wt(90,284,'內容一多就容易漏改',19,SUBC,600);});
  alphaDo(seg(u,.2,.4),()=>{fileTag(60,330,300,'data/catalog.json',Y);winFrame(60,380,520,290,'catalog.json（示意）');
   ['[ { "title": "換線時間縮短",','    "date": "2026-09",','    "metric": "-18%（示意）" },','  { … } ]'].forEach((s,i)=>codeLine(86,452+i*44,s,KC.text));});
  alphaDo(seg(u,.4,.56),()=>{arrow(600,430,680,430,Y,4);node(690,380,240,100,'頁面程式',B,1);arrow(940,430,1010,430,Y,4);});
  alphaDo(seg(u,.52,.7),()=>{[0,1,2].forEach(i=>{card(1020+i*170,380,155,200,{bg:'rgba(7,27,39,.85)',st:[Y,B,G][i],lw:2});wt(1097+i*170,430,['改善案一','改善案二','改善案三'][i],17,'#fff',700,'center');box(1036+i*170,450,123,60,'rgba(255,255,255,.1)','none',0);wt(1097+i*170,556,'示意指標',16,SUBC,600,'center');});});
  alphaDo(seg(u,.72,.86),()=>{card(690,610,850,80,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(720,662,'新增案子：多加一筆資料，頁面程式不動',22,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,730,1,'改善成效的數字，由現場人員確認後才公開'));
 }},
/* 3 push 自動部署（生活＋風能運維，圖解） */
{t:'push 之後自動部署',en:'Deploy automatically after a push',dur:14,
 d:'部署的重點是：推上去就更新。在儲存庫設定的 Pages 頁面，可以選擇從某個分支發佈，或用 GitHub Actions 自訂流程。以風場運維知識庫為例，你修改一篇維護筆記，commit、push 到主分支，GitHub 就會建置並更新網站，通常幾分鐘內生效。到 Actions 頁籤可以看部署成功還是失敗。',
 s:[[0,'push 到主分支'],[.4,'GitHub 建置並發佈'],[.74,'到 Actions 看結果']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);caseTag(260,150,'life',1);
  alphaDo(seg(u,.02,.2),()=>{pipe(60,200,['修改筆記','commit','push 主分支'],1,[Y,B,G]);});
  alphaDo(seg(u,.3,.48),()=>{arrow(400,300,400,350,Y,4);card(60,360,860,100,{bg:'rgba(7,27,39,.85)',st:P,lw:2});wt(90,412,'GitHub：建置 → 發佈到 github.io',23,P,800);wt(90,446,'通常幾分鐘內生效',18,SUBC,600);});
  alphaDo(seg(u,.46,.66),()=>{winFrame(60,490,860,200,'Settings › Pages（示意）');
   wt(90,562,'發佈來源',19,SUBC,700);
   ['從分支發佈','GitHub Actions 自訂流程'].forEach((s,i)=>{circ(100,602+i*40,8,i?'rgba(255,255,255,.3)':G,'none',0);wt(124,609+i*40,s,19,KC.text,600);});});
  alphaDo(seg(u,.62,.8),()=>{winFrame(980,200,560,250,'Actions（示意）');
   [['更新維護筆記',G,'成功'],['調整首頁版面',G,'成功'],['移動圖片資料夾',O,'失敗']].forEach((r,i)=>{circ(1010,278+i*52,8,r[1],'none',0);wt(1032,285+i*52,r[0],19,KC.text,600);wt(1500,285+i*52,r[2],18,r[1],700,'right');});});
  alphaDo(seg(u,.74,.86),()=>{card(980,480,560,100,{bg:'rgba(232,87,42,.08)',st:O,lw:2});para(1010,524,'失敗時把錯誤訊息貼給 Claude，一起找原因',500,20,KC.text,700,30);});
  alphaDo(seg(u,.88,.97),()=>human(60,730,1,'發佈前先看過差異，再推上主分支'));
 }},
/* 4 自訂網域（風能運維，圖解） */
{t:'自訂網域',en:'Custom domain',dur:14,
 d:'預設網址是帳號加 github.io。想用自己的網域，分兩邊設定：在網域服務商加 DNS 記錄，頂級網域用 A 或 ALIAS 記錄，www 子網域用 CNAME 記錄；再到 Pages 設定填入網域。HTTPS 建議開啟，但設定後選項可能要等一陣子才出現。如果用 Actions 發佈，GitHub 不會幫你建立 CNAME 檔，要以設定頁為準。',
 s:[[0,'DNS 加記錄'],[.4,'Pages 填入網域'],[.74,'HTTPS 可能要等']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  alphaDo(seg(u,.02,.2),()=>{card(60,200,740,100,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(90,248,'預設：帳號.github.io/專案名',22,B,800);wt(90,284,'想換成 kb.example.com（示意網域）',19,SUBC,600);});
  alphaDo(seg(u,.2,.4),()=>{winFrame(60,330,740,260,'網域服務商 DNS（示意）');
   [['A / ALIAS','頂級網域','指向 GitHub Pages'],['CNAME','www 子網域','指向你的 github.io']].forEach((r,i)=>cells(86,400+i*70,[170,200,284],r,56,false));
   wt(86,572,'記錄生效可能需要時間',18,SUBC,600);});
  alphaDo(seg(u,.4,.6),()=>{arrow(820,430,880,430,Y,4);winFrame(890,330,650,260,'Settings › Pages（示意）');
   wt(920,410,'Custom domain',19,SUBC,700);box(920,424,590,50,'rgba(255,255,255,.08)','rgba(255,255,255,.25)',1.5);wt(938,457,'kb.example.com',21,'#fff',700);
   check(930,520,true,G);wt(954,527,'Enforce HTTPS（選用，建議開啟）',19,KC.text,600);});
  alphaDo(seg(u,.62,.78),()=>{card(60,610,740,90,{bg:'rgba(255,255,255,.05)',st:Y,lw:2});wt(90,664,'HTTPS 選項設定後可能要等一陣子',21,Y,800);});
  alphaDo(seg(u,.74,.88),()=>{card(890,610,650,90,{bg:'rgba(232,87,42,.08)',st:O,lw:2});para(920,654,'用 Actions 發佈時，GitHub 不建立 CNAME 檔',590,20,O,800,30);});
  alphaDo(seg(u,.9,.99),()=>human(60,730,1,'DNS 與網域屬於組織資產，由管理者設定'));
 }},
/* 5 上線檢查（三情境，圖解） */
{t:'上線前的檢查清單',en:'The pre-launch checklist',dur:14,
 d:'上線前走一遍清單。連結和圖片路徑，在專案子路徑下是否正常？手機打開版面有沒有跑掉？最重要的是內容：公開網站全世界都看得到，不能放密碼、金鑰、個資，也不能放真實的案場與設備資料。個人作品集檢查照片與聯絡方式；產線成果頁檢查數字是否可以公開；運維知識庫只放通用知識。讓 Claude 協助檢查，最後由你按下發佈。',
 s:[[0,'路徑與手機版'],[.4,'敏感資料不上網'],[.74,'最後由你按發佈']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);caseTag(210,150,'auto',1);caseTag(420,150,'wind',1);
  [['連結與圖片路徑都能打開',B],['手機版面沒有跑掉',B],['沒有密碼、金鑰與個資',O],['沒有真實案場或設備資料',O]].forEach((r,i)=>alphaDo(seg(u,.04+i*.08,.16+i*.08),()=>{card(60,200+i*80,760,66,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});checkRing(100,233+i*80,r[1]);wt(140,241+i*80,r[0],21,KC.text,700);}));
  alphaDo(seg(u,.4,.58),()=>{
   [['生活','作品集：照片與聯絡方式',B],['智慧自動化','成果頁：數字可否公開',Y],['風能運維','知識庫：只放通用知識',G]].forEach((r,i)=>{card(870,200+i*110,670,94,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(896,214+i*110,r[0],{size:16,bg:r[2]});wt(896,274+i*110,r[1],21,'#fff',700);});});
  alphaDo(seg(u,.62,.74),()=>{card(60,540,1480,90,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,596,'公開網站：任何人都看得到，推上去就等於公開',23,O,800);});
  alphaDo(seg(u,.74,.86),()=>{card(60,650,1480,60,{bg:'rgba(255,255,255,.05)',st:B,lw:1.5});wt(90,690,'可請 Claude 掃描敏感字串與壞連結，再由你判斷',20,SUBC,700);});
  alphaDo(seg(u,.88,.97),()=>human(60,730,1,'最後的發佈決定，由你按下'));
 }},
/* 6 總結 */
{t:'從推上去到上線',en:'From push to live',dur:13,
 d:'整理一下：靜態網站結構要單純，內容用資料檔驅動，push 之後自動部署，需要時綁自訂網域，上線前走完檢查清單。作品集、成果頁、知識庫都適用，這個動畫館本身也是這樣上線的。下一集，我們用 API 打造自己的 AI 應用。',
 s:[[0,'結構、資料、部署、網域、檢查'],[.46,'三個專案，同一套流程'],[.8,'下一集：用 API 打造應用']],
 draw(u){
  diagBG();floatParticles(8,71);
  [['靜態結構',Y],['資料驅動',B],['push 部署',P],['自訂網域',G],['上線檢查',O]].forEach((r,i)=>alphaDo(seg(u,.02+i*.06,.14+i*.06),()=>{card(60+i*300,180,270,110,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(195+i*300,246,r[0],27,r[1],800,'center');}));
  alphaDo(seg(u,.34,.44),()=>{wt(60,350,'推上去就更新，推之前先檢查',22,O,700);});
  alphaDo(seg(u,.46,.72),()=>{
   [['生活','作品集網站：照片與專案',B],['智慧自動化','成果頁：資料檔驅動卡片',Y],['風能運維','知識庫：通用知識與自訂網域',G]].forEach((r,i)=>{card(60+i*500,430,480,140,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,448,r[0],{size:17,bg:r[2]});para(86+i*500,520,r[1],430,21,'#fff',800,28);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,660,'讓成果被看見，也守住不該公開的內容',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'公開什麼內容，由人員決定'));
 }}
]};
