// KITS: claude
/* 016-personal-work-ep07 — 排程工作
   Claude AI 應用動畫館｜個人工作 第 7 集
   依 support.claude.com（Schedule recurring tasks in Claude Cowork）查證，資訊截至 2026-10 */

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
const EP={no:7,slug:'personal-work',t:'排程工作：自動化例行事',en:'Scheduled Tasks',
seriesName:'個人工作',total:8,
lede:'每天、每週都要重做的整理，可以交給排程工作：你把指示寫一次、選好頻率，Claude 就依時間自己開始，完成後留下成果讓你檢查。這一集用每日天氣提醒、產線警報摘要與風場日報示範設定與檢查，決定仍由你下。',
facts:[['1 次','寫好指示','描述任務與頻率，確認後按 Schedule'],['5 種','頻率選項','每小時、每天、平日、每週、手動執行'],['雲端','依時間執行','電腦休眠、桌面 App 關閉也會跑；需本機檔案或 App 的任務只在本機執行'],['每次','獨立工作階段','在 Scheduled 頁面檢查過去與下次執行'],['人確認','再行動','異常處置與設備動作由人員決定']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。排程工作的建立方式、頻率選項與管理功能依 Claude 說明中心（support.claude.com）「Schedule recurring tasks in Claude Cowork」整理，資訊截至 2026-10；方案與介面仍在調整，請以官方最新說明為準。天氣、警報、發電量、OEE 等數字均為虛構的示意或典型範例，並非任何特定公司、機關或案場資料；AI 提供分析與建議，停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 盤點例行事務（圖解） */
{t:'盤點例行事務',en:'Listing your routines',dur:14,
 d:'先別急著設定，先盤點哪些事情每次都做、格式差不多、產出一份固定的整理。每天早上的天氣與行程提醒、每班交接前的警報摘要、風場每日的發電量與待處理警報，都是這種事。需要現場判斷或高風險的決定，則不適合交給排程，留給人。',
 s:[[0,'三種每天都在做的例行事'],[.4,'適合排程：固定、重複、格式一致'],[.74,'需要判斷的留給人']],
 draw(u){
  sceneBG();
  const R=[['life','每天早上','天氣與行程提醒','今天會下雨嗎？有哪些行程？',B],['auto','每班交接前','產線警報摘要','本班警報次數與前三名',Y],['wind','每天清晨','風場日報','發電量與待處理警報',G]];
  R.forEach((r,i)=>{const a=seg(u,.03+i*.1,.15+i*.1),x=60+i*500;
   alphaDo(a,()=>{card(x,170,480,330,{bg:'rgba(7,27,39,.8)',st:r[4],lw:2});caseTag(x+24,190,r[0],1);clock(x+420,250,34,[.3,.6,.2][i],r[4]);
    wt(x+24,290,r[1],20,SUBC,700);wt(x+24,336,r[2],27,'#fff',800);para(x+24,386,r[3],430,20,KC.text,600,29);
    tag(x+24,450,'每次都一樣',{size:16,bg:r[4]});});});
  alphaDo(seg(u,.4,.5),()=>{card(60,540,740,180,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,590,'適合排程',24,G,800);
   ['固定時間、重複發生','輸入資料來源固定','產出格式大致一樣'].forEach((s,i)=>{check(104,626+i*34,true,G);wt(130,632+i*34,s,19,KC.text,600);});});
  alphaDo(seg(u,.56,.66),()=>{card(840,540,700,180,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(870,590,'留給人',24,O,800);
   ['現場安全與停機決定','每次情況都不同的判斷','對外承諾與核准'].forEach((s,i)=>{ln([870,626+i*34-8,886,626+i*34+8],O,3);ln([886,626+i*34-8,870,626+i*34+8],O,3);wt(902,632+i*34,s,19,KC.text,600);});});
  alphaDo(seg(u,.8,.92),()=>human(60,760,1,'排程只負責整理，決定由人'));
 }},
/* 2 設定排程（圖解） */
{t:'在 Cowork 設定排程',en:'Setting up a schedule',dur:14,
 d:'最簡單的做法是直接告訴 Claude：「每個工作日早上八點，幫我整理…」，Claude 會問幾個問題，提出名稱、時間與指示讓你確認，按下 Schedule 就完成。也能在 Scheduled 頁面手動設定：名稱、指示、核准模式、頻率，可選模型與工作資料夾。頻率有每小時、每天、平日、每週，或手動執行。',
 s:[[0,'用說的：描述任務與頻率'],[.36,'或手動填寫五個欄位'],[.7,'頻率：每小時到每週']],
 draw(u){
  sceneBG();
  const st=[['1','描述任務與頻率',B],['2','回答 Claude 的問題',Y],['3','確認名稱、時間、指示',G]];
  st.forEach((r,i)=>{const a=seg(u,.02+i*.07,.12+i*.07),x=60+i*500;
   alphaDo(a,()=>{card(x,170,470,130,{bg:'rgba(7,27,39,.8)',st:r[2],lw:2});circ(x+44,235,24,r[2],'none',0);wt(x+44,243,r[0],24,'#0e2133',800,'center');para(x+86,230,r[1],360,23,'#fff',700,30);if(i<2)arrow(x+475,235,x+495,235,r[2],3);});});
  alphaDo(seg(u,.26,.34),()=>{box(60,330,1480,80,'rgba(125,255,196,.12)',G,2);wt(800,382,'按下 Schedule，完成',26,G,800,'center');});
  alphaDo(seg(u,.36,.44),()=>wt(60,462,'手動設定欄位（示意）',22,Y,700));
  [['名稱','產線警報週報'],['指示','整理本週警報…'],['核准模式','動作先問我'],['頻率','每週'],['工作資料夾','（選填）']].forEach((r,i)=>{const a=seg(u,.4+i*.04,.5+i*.04),x=60+i*300;
   alphaDo(a,()=>{card(x,490,285,130,{bg:'rgba(7,27,39,.82)',st:B,lw:1.5});wt(x+18,536,r[0],20,B,700);wt(x+18,584,r[1],17,KC.text,600);});});
  alphaDo(seg(u,.68,.78),()=>{wt(60,670,'頻率選項',22,Y,700);['每小時','每天','平日','每週','手動'].forEach((s,i)=>{tag(60+i*190,696,s,{size:19,bg:i===2?G:B});});});
  alphaDo(seg(u,.84,.94),()=>human(60,770,1,'核准模式由你選'));
  alphaDo(seg(u,.84,.94),()=>{tag(560,786,'在雲端執行，電腦休眠也會跑',{size:18,bg:P});});
 }},
/* 3 每日簡報（生活＋風能） */
{t:'每日簡報範例',en:'A daily briefing',dur:14,
 d:'每日簡報最適合排程。生活版：每天早上七點半，整理今天的天氣與行程，提醒帶傘、出門時間。風場版：每天清晨把前一天的示意發電量、待處理警報與今天的風速預報排成一頁，值班主管上班就能看到。簡報負責整理，哪個警報先處理、要不要出海，由主管決定。',
 s:[[0,'生活：天氣與行程提醒'],[.4,'風場：日報一頁看完'],[.76,'警報優先順序由主管決定']],
 draw(u){
  diagBG();floatParticles(8,13);
  card(60,170,720,620,{bg:'rgba(7,27,39,.82)',st:B,lw:2});caseTag(84,192,'life',1);clock(700,250,30,.31,B);
  wt(90,290,'每個工作日 07:30',20,SUBC,700);wt(90,336,'今日提醒',28,'#fff',800);
  alphaDo(seg(u,.02,.12),()=>{[['天氣','下午有雨，記得帶傘（示意）',B],['行程','10:00 週會、15:00 牙醫',Y],['出門','建議 09:20 出發',G]].forEach((r,i)=>{card(90,370+i*110,660,96,{bg:'rgba(255,255,255,.05)',st:r[2]});wt(116,412+i*110,r[0],20,r[2],700);wt(116,446+i*110,r[1],19,KC.text,600);});});
  card(820,170,720,620,{bg:'rgba(7,27,39,.82)',st:G,lw:2});caseTag(844,192,'wind',1);clock(1460,250,30,.25,G);
  wt(850,290,'每天 06:00',20,SUBC,700);wt(850,336,'風場日報（示意）',28,'#fff',800);
  alphaDo(seg(u,.4,.54),()=>{wt(850,392,'昨日發電量',19,SUBC,700);bar(850,408,500,22,.78,G);wt(1370,426,'78 % 目標（示意）',18,G,700);
   wt(850,478,'待處理警報',19,SUBC,700);[['T07 振動偏高','待查',O],['T12 偏航角偏差','待查',Y],['T03 溫度警示','已排工單',G]].forEach((r,i)=>{card(850,494+i*68,660,56,{bg:'rgba(255,255,255,.05)',st:r[2]});wt(874,530+i*68,r[0],19,KC.text,600);wt(1490,530+i*68,r[1],18,r[2],700,'right');});});
  alphaDo(seg(u,.62,.72),()=>{tag(850,710,'今日風速預報',{size:17,bg:B});tag(1030,710,'出海窗口參考',{size:17,bg:Y});});
  alphaDo(seg(u,.8,.92),()=>human(1000,730,1,'先處理哪個警報由主管決定'));
 }},
/* 4 每週報告（智慧自動化） */
{t:'每週報告範例',en:'A weekly report',dur:14,
 d:'每週報告也一樣。每週五下午，Claude 彙整本週產線的示意警報紀錄：警報次數、前三名警報、和上週的差異，並附上對應工單與稼動率的變化，整理成一頁草稿。工程師看過、補上現場觀察，再決定下週要不要安排保養。頻率若需要每班一份，也可以改成每天或每小時。',
 s:[[0,'每週五自動彙整警報紀錄'],[.4,'前三名＋與上週比較'],[.74,'草稿：工程師補充後決定']],
 draw(u){
  diagBG();floatParticles(8,21);
  caseTag(60,150,'auto',1);
  card(60,196,760,600,{bg:'rgba(7,27,39,.82)',st:Y,lw:2});wt(90,244,'每週五 16:00 · 產線警報週報',22,Y,700);
  const A=[['伺服過載',46,O],['氣壓偏低',31,Y],['感測逾時',18,B]];
  A.forEach((r,i)=>{const a=seg(u,.3+i*.1,.42+i*.1),y=290+i*110;alphaDo(a,()=>{wt(90,y+30,r[0],21,'#fff',700);bar(90,y+46,520,26,r[1]/50,r[2]);wt(630,y+68,r[1]+' 次（示意）',19,r[2],700);});});
  alphaDo(seg(u,.5,.6),()=>{card(90,630,700,120,{bg:'rgba(255,255,255,.05)',st:B});wt(116,676,'與上週比',19,B,700);wt(116,716,'伺服過載 −12 次，稼動率 OEE 82 → 84 %（示意）',19,KC.text,600);});
  card(860,196,680,600,{bg:'rgba(7,27,39,.8)',st:G,lw:1.5});wt(886,244,'本週摘要草稿',22,G,700);
  alphaDo(seg(u,.04,.2),()=>{para(886,290,'本週警報共 95 次，伺服過載居首，主要集中在夜班。',620,21,KC.text,600,32);});
  alphaDo(seg(u,.2,.3),()=>{card(886,410,620,100,{bg:'rgba(255,255,255,.05)',st:Y});wt(910,452,'對應工單',18,Y,700);wt(910,488,'WO-0412、WO-0419（示意）',19,KC.text,600);});
  alphaDo(seg(u,.66,.76),()=>{tag(886,540,'每班一份：改成每天或每小時',{size:17,bg:P});});
  alphaDo(seg(u,.78,.9),()=>{card(886,590,620,64,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(916,632,'草稿，需補上現場觀察',20,O,700);});
  alphaDo(seg(u,.84,.94),()=>human(886,690,1,'保養排程由工程師決定'));
 }},
/* 5 檢查與調整（圖解） */
{t:'檢查與調整',en:'Reviewing and adjusting',dur:14,
 d:'排程不是設定完就不管。在左側的 Scheduled 頁面，可以看所有任務、下次執行時間與過去的執行；每次執行都是一個獨立的工作階段，成果都能打開檢查。內容不對就修改指示或頻率，也能暫停、繼續、刪除，或馬上手動執行一次測試。',
 s:[[0,'Scheduled 頁面：全部任務一覽'],[.4,'每次執行都能打開檢查'],[.72,'修改、暫停、刪除、立即執行']],
 draw(u){
  sceneBG();
  winFrame(60,150,1000,650,'Scheduled');
  const T=[['每日天氣提醒','每個工作日 07:30',B,'下次 明天'],['風場日報','每天 06:00',G,'下次 明天'],['產線警報週報','每週五 16:00',Y,'下次 週五']];
  T.forEach((r,i)=>{const a=seg(u,.03+i*.08,.13+i*.08),y=212+i*126;alphaDo(a,()=>{card(90,y,940,108,{bg:'rgba(255,255,255,.05)',st:r[2]});wt(116,y+44,r[0],23,'#fff',800);wt(116,y+82,r[1],18,SUBC,600);tag(780,y+36,r[3],{size:17,bg:r[2]});toggle(940,y+38,1);});});
  alphaDo(seg(u,.4,.5),()=>{wt(90,620,'過去的執行',20,Y,700);[['昨天','完成'],['前天','完成'],['週三','需修改']].forEach((r,i)=>{card(90+i*310,640,290,70,{bg:'rgba(255,255,255,.05)',st:i===2?O:G});wt(110+i*310,682,r[0]+'　'+r[1],19,i===2?O:G,700);});});
  card(1100,150,440,650,{bg:'rgba(7,27,39,.82)',st:Y,lw:2});wt(1130,198,'可以調整的事',22,Y,700);
  [['修改指示或頻率',B],['暫停／繼續',G],['刪除',O],['立即執行一次',P]].forEach((r,i)=>{const a=seg(u,.7+i*.04,.8+i*.04);alphaDo(a,()=>{card(1130,230+i*92,380,76,{bg:'rgba(255,255,255,.05)',st:r[1]});wt(1156,276+i*92,r[0],21,'#fff',700);});});
  alphaDo(seg(u,.88,.96),()=>human(1130,630,1,'成果先由你檢查'));
 }},
/* 6 本動畫館 */
{t:'本動畫館也是這樣做的',en:'This course is built the same way',dur:15,
 d:'這個課程網站就是用排程做的：每次排程時間一到，Claude 讀取進度表、挑出下一個單元、查證功能、製作動畫、檢查中英文版本、更新目錄並發佈。每一步都留下紀錄，內容由作者事後檢視。你的排程也可以這樣設計：進度表決定做什麼，每次只做一件，出了狀況就標記並通知你。',
 s:[[0,'讀進度表，選下一個單元'],[.4,'查證、製作、檢查、發佈'],[.76,'出錯就標記並通知你']],
 draw(u){
  diagBG();floatParticles(10,31);
  const S=[['讀進度表','選下一個單元',B],['查證功能','以官方說明為準',Y],['製作動畫','中英雙語',G],['檢查','文字不重疊、無錯誤',P],['發佈並記錄','更新目錄與進度',O]];
  S.forEach((r,i)=>{const a=seg(u,.02+i*.07,.12+i*.07),x=60+i*300;alphaDo(a,()=>{card(x,200,280,230,{bg:'rgba(7,27,39,.82)',st:r[2],lw:2});circ(x+44,250,22,r[2],'none',0);wt(x+44,258,String(i+1),22,'#0e2133',800,'center');para(x+24,320,r[0],240,25,'#fff',800,32);para(x+24,398,r[1],240,18,SUBC,600,26);if(i<4)arrow(x+282,315,x+298,315,r[2],3);});});
  alphaDo(seg(u,.42,.54),()=>{card(60,480,740,200,{bg:'rgba(7,27,39,.82)',st:Y,lw:2});wt(90,528,'設計排程的三個習慣',22,Y,800);['進度表決定今天做什麼','每次只做一件，做小一點','留下紀錄，方便回頭檢查'].forEach((s,i)=>{check(104,566+i*38,true,Y);wt(130,572+i*38,s,19,KC.text,600);});});
  alphaDo(seg(u,.6,.7),()=>{card(840,480,700,200,{bg:'rgba(7,27,39,.82)',st:O,lw:2});wt(870,528,'出錯時',22,O,800);['標記狀態並寫下原因','通知負責人，不硬撐','需要判斷時停下來問人'].forEach((s,i)=>{ln([870,566+i*38-8,886,566+i*38+8],O,3);ln([886,566+i*38-8,870,566+i*38+8],O,3);wt(902,572+i*38,s,19,KC.text,600);});});
  alphaDo(seg(u,.8,.92),()=>human(60,730,1,'成果由作者事後檢視'));
 }}
]};
