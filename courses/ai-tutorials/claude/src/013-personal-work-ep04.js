// KITS: claude
/* 013-personal-work-ep04 — 試算表與資料分析
   Claude AI 應用動畫館｜個人工作 第 4 集
   依 support.claude.com（Claude in Excel、分析工具與建立檔案）查證，資訊截至 2026-10 */

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
const EP={no:4,slug:'personal-work',t:'試算表與資料分析',en:'Spreadsheets & Data',
seriesName:'個人工作',total:8,
lede:'先清理雜亂資料、讓 Claude 解釋公式，再做樞紐分析與圖表，接著認識 Claude in Excel，最後把數字變成洞察：這一集用家庭水電費、產線稼動率與風機 SCADA 資料，示範 Claude 怎麼陪你處理試算表。',
facts:[['4','類常見髒資料','日期格式、空白、重複、單位不一致'],['公式','逐步解說','讓 Claude 說明每一段在算什麼'],['樞紐','與圖表','彙總、分組後再畫成圖'],['Excel','附加元件','Claude in Excel 可回答問題並附儲存格引用'],['人核對','再採用','數字與結論由你抽查，設備動作由人員確認']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。Claude in Excel、分析工具與建立檔案功能依 Claude 說明中心（support.claude.com）整理，資訊截至 2026-10，方案與功能實際以官方最新說明為準。水電費、感測資料、稼動率、功率曲線與故障碼統計均為虛構的示意或典型範例，並非任何特定公司、機關或案場資料；AI 提供分析與建議，停機、上鎖掛牌與對 PLC 下指令等動作，一律由現場人員確認後執行。',
shots:[
/* ── 1 清理雜亂資料（智慧自動化） ── */
{t:'清理雜亂資料',en:'Cleaning messy data',dur:14,
 d:'拿到產線感測資料匯出檔，常見的問題是日期格式不一、有空白欄位、重複的列，還有單位混用。把檔案交給 Claude，請它先檢查再清理：它會列出發現的問題，說明打算怎麼處理，清理後也會告訴你改了幾列。原始檔請另外保留，清理規則由你確認。',
 s:[[0,'匯出的感測資料，格式不一'],[.36,'Claude 列出問題與處理方式'],[.7,'清理完成，原始檔另外保留']],
 draw(u){
  diagBG();floatParticles(8,3);
  caseTag(60,150,'auto',1);
  wt(60,230,'清理前（示意）',20,O,700);
  const C=[200,140,110];
  cells(60,250,C,['時間','溫度','狀態'],44,true);
  const raw=[['2026/10/01 08:00','72.5 ℃','RUN'],['10-01 08:05','72.9','run'],['2026/10/01 08:10','','RUN'],['10-01 08:05','72.9','run'],['2026/10/01 08:15','163 ℉','RUN']];
  raw.forEach((r,i)=>{const bad=[null,null,['rgba(232,87,42,.14)',O],['rgba(232,87,42,.14)',O],['rgba(232,87,42,.14)',O]][i];
   alphaDo(seg(u,.02+i*.03,.1+i*.03),()=>cells(60,294+i*52,C,r,52,false,bad?[bad,bad,bad]:null));});
  arrow(660,430,740,430,Y,3);
  card(770,150,770,650,{bg:'rgba(7,27,39,.78)',st:Y,lw:1.5});
  wt(796,196,'Claude 發現的問題',22,Y,700);
  const P=[['日期格式不一','統一成 年-月-日 時:分',B],['有空白','標記為缺值，不自行填數',O],['重複的列','保留一列，其餘移除','#b37cff'],['單位混用','℉ 換算成 ℃，並標註',G]];
  P.forEach((r,i)=>{const a=seg(u,.34+i*.07,.44+i*.07),y=226+i*100;
   alphaDo(a,()=>{card(796,y,720,86,{bg:'rgba(255,255,255,.05)',st:r[2]});circ(830,y+43,16,r[2],'none',0);wt(830,y+49,String(i+1),17,'#0e2133',800,'center');wt(862,y+38,r[0],21,'#fff',700);wt(862,y+68,r[1],17,SUBC,500);});});
  alphaDo(seg(u,.72,.8),()=>{card(796,640,720,56,{bg:'rgba(125,255,196,.08)',st:G,lw:1.5});wt(816,676,'清理後：5 列 → 4 列，1 列缺值已標記',19,G,700);});
  alphaDo(seg(u,.84,.94),()=>human(796,716,1,'確認規則，原始檔另存'));
 }},
/* ── 2 公式解說（生活） ── */
{t:'公式解說',en:'Explaining formulas',dur:13,
 d:'看不懂別人留下的公式，貼給 Claude 請它逐段解釋。以家庭水電費表為例，Claude 會說明這段公式是把「類別」欄等於「電費」的金額加總，再說明每個符號的作用。你也可以描述需求，請它幫你寫公式，並用幾筆示範資料驗算，確認結果和你預期的一致。',
 s:[[0,'貼上看不懂的公式'],[.36,'Claude 逐段說明'],[.7,'用示範資料驗算']],
 draw(u){
  sceneBG();
  winFrame(60,150,860,650,'Claude');
  caseTag(84,206,'life',1);
  bub(130,250,770,'這個公式在算什麼？ =SUMIF(B:B,"電費",C:C)','user',seg(u,.02,.1));
  bub(90,410,810,'它把 B 欄是「電費」的列挑出來，再把對應 C 欄的金額加總，結果就是這段期間的電費總額。','ai',seg(u,.14,.24),Y);
  alphaDo(seg(u,.3,.4),()=>{[['B:B','比對的欄',B],['"電費"','條件',Y],['C:C','加總的欄',G]].forEach((r,i)=>{tag(94+i*250,640,r[0],{size:18,bg:r[2]});wt(94+i*250,696,r[1],17,SUBC,600);});});
  card(960,150,580,650,{bg:'rgba(7,27,39,.8)'});
  wt(990,196,'家庭水電費（示意）',22,Y,700);
  const C=[130,170,170];
  cells(990,226,C,['月份','類別','金額'],44,true);
  const R=[['1 月','電費','1,280'],['1 月','水費','320'],['2 月','電費','1,150'],['2 月','水費','300']];
  R.forEach((r,i)=>{const hit=r[1]==='電費'&&u>.4;alphaDo(seg(u,.02+i*.03,.1+i*.03),()=>cells(990,270+i*48,C,r,48,false,hit?[[ 'rgba(242,194,48,.14)',Y],['rgba(242,194,48,.14)',Y],['rgba(242,194,48,.14)',Y]]:null));});
  alphaDo(seg(u,.66,.76),()=>{card(990,500,470,100,{bg:'rgba(125,255,196,.08)',st:G,lw:1.5});wt(1010,540,'驗算：1,280 + 1,150',19,KC.text,600);wt(1010,576,'= 2,430（與公式結果一致）',20,G,700);});
  alphaDo(seg(u,.84,.94),()=>human(990,640,1,'用示範資料驗算再採用'));
 }},
/* ── 3 樞紐分析與圖表（智慧自動化） ── */
{t:'樞紐分析與圖表',en:'Pivot tables and charts',dur:14,
 d:'一長串紀錄看不出重點，就用樞紐分析彙總。以三台機台、三個班別的稼動率示範資料為例，請 Claude 依機台與班別分組、算平均，再畫成長條圖。Claude 可以說明為什麼選這個欄位當分組、為什麼用平均。數字是示意，實際要以你的資料與計算定義為準。',
 s:[[0,'長串紀錄，看不出重點'],[.36,'依機台與班別分組、彙總'],[.7,'畫成長條圖，找出落差']],
 draw(u){
  diagBG();
  caseTag(60,150,'auto',1);
  card(60,196,520,590,{bg:'rgba(7,27,39,.75)'});
  wt(84,240,'原始紀錄（示意，節錄）',20,'#fff',700);
  for(let i=0;i<9;i++){const a=seg(u,.02+i*.02,.08+i*.02),y=262+i*52,m=['A','B','C'][i%3],s=['早','中','晚'][Math.floor(i/3)];
   alphaDo(a,()=>cells(84,y,[140,150,140],[m+' 機',s+'班',String(78+((i*7)%15))+' %'],44,false));}
  arrow(600,480,670,480,Y,3);
  card(690,196,420,590,{bg:'rgba(7,27,39,.8)',st:Y,lw:1.5});
  wt(714,240,'樞紐表：平均稼動率',20,Y,700);
  const D=[[88,81,76],[91,85,79],[84,70,72]];
  cells(714,262,[116,92,92,92],['','早','中','晚'],44,true);
  ['A','B','C'].forEach((m,i)=>{const a=seg(u,.38+i*.07,.48+i*.07);alphaDo(a,()=>{
    const warn=i===2;cells(714,306+i*60,[116,92,92,92],[m+' 機',...D[i].map(v=>v+' %')],60,false,warn?[null,null,['rgba(232,87,42,.14)',O],null]:null);});});
  card(1150,196,390,590,{bg:'rgba(7,27,39,.78)',st:G,lw:1.5});
  wt(1174,240,'長條圖：中班平均',20,G,700);
  ln([1190,700,1510,700],KC.border,2);
  [[81,B],[85,B],[70,O]].forEach((r,i)=>{const a=seg(u,.66+i*.07,.78+i*.07),h=ease(a)*(r[0]-50)*7,x=1220+i*100;
   box(x,700-h,64,h,r[1],'none',0);if(a>.6)wt(x+32,690-h,r[0]+'%',17,'#fff',700,'center');wt(x+32,730,['A','B','C'][i],18,SUBC,600,'center');});
  alphaDo(seg(u,.88,.96),()=>wt(1174,764,'C 機中班偏低，值得查原因',18,O,700));
 }},
/* ── 4 Claude in Excel（生活＋智慧自動化） ── */
{t:'Claude in Excel',en:'Claude in Excel',dur:14,
 d:'依 Claude 說明中心，Claude in Excel 是 Excel 的附加元件，適用於 Pro、Max、Team 與 Enterprise 方案。你可以在側邊欄對活頁簿提問，答案附上儲存格引用，方便回頭核對；也能更新假設、除錯，以及編輯樞紐表、圖表與條件式格式。它改動的範圍，請在套用前先看過。',
 s:[[0,'Excel 側邊欄，直接對活頁簿提問'],[.36,'答案附儲存格引用，能除錯與編輯'],[.7,'改動前先檢視']],
 draw(u){
  diagBG();
  caseTag(60,150,'life',1);caseTag(170,150,'auto',1);
  winFrame(60,196,1000,600,'Excel（示意）');
  const C=[160,160,160,160,160];
  cells(80,262,C,['A','B','C','D','E'],40,true);
  const R=[['月份','電費','水費','瓦斯','合計'],['1 月','1,280','320','410','2,010'],['2 月','1,150','300','380','1,830'],['3 月','1,320','#REF!','395','—']];
  R.forEach((r,i)=>{const err=r[2]==='#REF!';alphaDo(seg(u,.02+i*.03,.1+i*.03),()=>cells(80,302+i*54,C,r,54,false,err&&u>.5?[null,null,['rgba(232,87,42,.18)',O],null,null]:null));});
  alphaDo(seg(u,.12,.2),()=>wt(80,560,'儲存格 C4 出現錯誤',18,O,700));
  card(1100,196,440,600,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});
  wt(1124,238,'Claude 側邊欄',20,Y,700);
  alphaDo(seg(u,.2,.3),()=>{card(1124,260,392,100,{bg:KC.userBub});para(1140,292,'這份表哪裡出錯？',360,18,'#fff',600);});
  alphaDo(seg(u,.38,.5),()=>{card(1124,376,392,200,{bg:KC.aiBub,st:Y,lw:2});para(1140,408,'C4 的 #REF! 是因為公式引用的欄位被刪除。建議改成引用 C3 的格式（見儲存格 C3、E3）。',360,18,KC.text,600,26);});
  alphaDo(seg(u,.54,.64),()=>{['附儲存格引用','除錯','編輯樞紐表與圖表'].forEach((t,i)=>tag(1124,596+i*50,t,{size:17,bg:[B,O,G][i]}));});
  alphaDo(seg(u,.78,.88),()=>wt(80,770,'方案：Pro、Max、Team、Enterprise',18,SUBC,600));
  alphaDo(seg(u,.86,.95),()=>human(1100,740,1,'套用前先檢視改動'));
 }},
/* ── 5 風機 SCADA（風能運維） ── */
{t:'風機資料：功率曲線與故障碼',en:'Turbine data: power curve and fault codes',dur:14,
 d:'風機 SCADA 匯出的資料量大，可請 Claude 整理三件事：畫出風速與功率的散點圖，比較典型功率曲線找出偏低的點；用公式算可利用率；再統計故障碼次數排行。數字為示意，真正的判讀要看機型與現場條件。Claude 提供分析與建議，停機與上鎖掛牌由現場人員確認。',
 s:[[0,'風速與功率散點，對照典型曲線'],[.36,'算可利用率、統計故障碼'],[.7,'分析與建議，停機由人員確認']],
 draw(u){
  diagBG();floatParticles(8,11);
  caseTag(60,150,'wind',1);
  card(60,196,820,590,{bg:'rgba(7,27,39,.78)',st:G,lw:1.5});
  wt(84,240,'風速—功率（示意）',21,G,700);
  const X0=130,Y0=720,W=720,H=420;
  ln([X0,Y0,X0+W,Y0],KC.border,2);ln([X0,Y0,X0,Y0-H],KC.border,2);
  wt(X0+W,Y0+34,'風速 (m/s)',16,SUBC,600,'right');wt(X0-8,Y0-H-12,'功率',16,SUBC,600,'left');
  const f=v=>v<3?0:v>=12?1:Math.pow((v-3)/9,2.6);
  const cur=[];for(let i=0;i<=40;i++){const v=i*14/40;cur.push(X0+v/14*W,Y0-f(v)*H);}
  const pc=Math.floor(cur.length/2*ease(seg(u,.02,.2)));
  if(pc>1)ln(cur.slice(0,pc*2),Y,3);
  for(let i=0;i<26;i++){const v=3+i*0.42,low=(i===17||i===19||i===21),y=f(v)*(low?.55:(0.95+((i*37)%10)/100));
   const a=seg(u,.12+i*.008,.2+i*.008);alphaDo(a,()=>circ(X0+v/14*W,Y0-Math.min(1,y)*H,7,low?O:B,'none',0));}
  alphaDo(seg(u,.3,.4),()=>wt(X0+500,Y0-360,'偏低的點（示意）',17,O,700));
  card(920,196,620,280,{bg:'rgba(7,27,39,.78)',st:Y,lw:1.5});
  wt(944,240,'可利用率（示意）',21,Y,700);
  alphaDo(seg(u,.36,.46),()=>{wt(944,300,'可用時數 ÷ 總時數',18,SUBC,600);wt(944,350,'=(720−18)/720',24,KC.text,700,'left',COND);wt(944,420,'≈ 97.5 %',40,G,800,'left',COND);});
  card(920,500,620,286,{bg:'rgba(7,27,39,.78)',st:O,lw:1.5});
  wt(944,544,'故障碼次數排行（示意）',21,O,700);
  [['F101',9,B],['F230',5,Y],['F418',2,'#b37cff']].forEach((r,i)=>{const a=seg(u,.48+i*.07,.58+i*.07),w=ease(a)*r[1]*34;
   alphaDo(a,()=>{wt(944,590+i*52,r[0],18,KC.text,700);box(1030,570+i*52,w,28,r[2],'none',0);wt(1040+w,592+i*52,String(r[1]),17,'#fff',700);});});
  alphaDo(seg(u,.82,.92),()=>human(920,716,1,'停機與上鎖掛牌由人員確認'));
 }},
/* ── 6 把數字變成洞察（三類） ── */
{t:'把數字變成洞察',en:'Turning numbers into insight',dur:14,
 d:'整理出數字只是第一步，重點是回答「所以呢」。請 Claude 先說趨勢，再列出可能原因，最後提出下一步要驗證什麼。三個例子：水電費冬天偏高、C 機中班稼動率偏低、F101 故障碼集中在某幾台機組。Claude 給的是假設與建議，是否成立，要靠你抽查原始資料與現場確認。',
 s:[[0,'先說趨勢，再列可能原因'],[.4,'三個情境的洞察與下一步'],[.74,'假設由你查證，現場確認']],
 draw(u){
  diagBG();
  const H=[['life','生活','電費 1、2 月高於其他月份','可能原因：冬季暖氣用電','下一步：比對電表與用電習慣',B],['auto','智慧自動化','C 機中班稼動率偏低','可能原因：換線時間拉長','下一步：查換線紀錄與停機原因',Y],['wind','風能運維','F101 集中在 3 台機組','可能原因：同批零件或感測器','下一步：查維修紀錄，由人員現場確認',G]];
  H.forEach((r,i)=>{const a=seg(u,.04+i*.14,.16+i*.14),x=60+i*500;
   alphaDo(a,()=>{card(x,170,480,470,{bg:'rgba(7,27,39,.78)',st:r[5],lw:2});caseTag(x+24,192,r[0],1);
    wt(x+24,270,'趨勢',16,SUBC,700);para(x+24,306,r[2],432,21,'#fff',700,30);
    ln([x+24,380,x+456,380],KC.border,1);
    para(x+24,410,r[3],432,19,KC.text,600,28);
    ln([x+24,520,x+456,520],KC.border,1);
    para(x+24,550,r[4],432,19,r[5],700,28);});});
  alphaDo(seg(u,.62,.72),()=>{card(60,670,1480,64,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});wt(800,710,'Claude 給的是假設與建議，是否成立要回到原始資料與現場驗證',20,O,700,'center');});
  alphaDo(seg(u,.82,.92),()=>human(60,760,1,'抽查資料，再決定行動'));
 }}
]};
