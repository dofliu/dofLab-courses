// KITS: claude
/* 021-project-dev-ep03 — 計畫→實作→測試迴圈
   Claude AI 應用動畫館｜專案開發 第 3 集
   依 code.claude.com（Best practices：探索、計畫、實作、提交；提供測試讓 Claude 自行驗證）查證，資訊截至 2026-10 */

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
const EP={no:3,slug:'project-dev',t:'計畫→實作→測試迴圈',en:'Plan–Build–Test Loop',
seriesName:'專案開發',total:8,
lede:'請 Claude Code 寫程式，最穩的做法是一個迴圈：先要計畫、再小步實作、寫測試、跑測試修錯，最後提交。出錯時，把完整錯誤訊息交給它，一起找根因。這一集用記帳計算函式、感測器單位換算與風速—功率曲線示範，預期值與門檻由你確認。',
facts:[['先計畫','再動手','複雜或不熟的修改，先用 Plan 模式看計畫'],['小步','一次一件事','每個可運作的階段就提交一次'],['寫測試','給它驗證的方法','邊界值與異常值都要有測試案例'],['跑測試','失敗就修','讓 Claude 自己跑、自己修，你看結果'],['找根因','貼完整錯誤','不只壓掉症狀，修好後補一個回歸測試']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。「探索、計畫、實作、提交」的流程、Plan 模式與「提供測試讓 Claude 自行驗證」的建議，依 Claude Code 文件（code.claude.com Best practices、Permission modes）整理，資訊截至 2026-10；功能與介面仍在調整，請以官方最新說明為準。記帳函式、4–20 mA 換算、風速—功率曲線（切入、額定、切出風速）、警報門檻與測試結果的程式碼和數字均為虛構的示意或典型範例，並非任何特定單位、公司、機組或案場資料；實際預期值請依設備規格與現場規範確認。AI 提供分析與建議，停機、上鎖掛牌與對 PLC 寫入或下指令等動作，一律由現場人員確認後執行。',
shots:[
/* 1 先要計畫（生活） */
{t:'先要計畫，再動手',en:'Ask for a plan before building',dur:14,
 d:'流程是四步：探索、計畫、實作、提交。拿記帳程式來說，想加一個每月總支出的功能，先別叫它寫，請它先給計畫。切到 Plan 模式，Claude 只讀取、不改檔，列出要改哪些檔案、怎麼驗證。你看過、核准之後才實作。如果一句話就能說完的小修改，不必先規劃。',
 s:[[0,'探索、計畫、實作、提交'],[.42,'Plan 模式：只讀取，不改檔'],[.78,'你核准計畫才實作']],
 draw(u){
  sceneBG();caseTag(60,150,'life',1);
  pipe(60,190,['探索','計畫','實作','提交'],seg(u,.02,.3),[B,Y,G,P]);
  alphaDo(seg(u,.3,.42),()=>{bub(60,320,900,'我想幫記帳程式加「每月總支出」，先別寫程式，先給我計畫。','user',1);});
  alphaDo(seg(u,.5,.7),()=>{card(60,430,900,330,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(90,480,'Claude 的計畫（示意）',23,Y,800);
   [['1','讀 expenses.py，找出資料格式'],['2','新增 monthly_total()，只動這個檔案'],['3','先寫測試，再實作，跑測試驗證']].forEach((r,i)=>{circ(104,530+i*70,16,[B,G,P][i],'none',0);wt(104,537+i*70,r[0],20,'#0d1b24',800,'center');wt(136,538+i*70,r[1],21,KC.text,600);});});
  alphaDo(seg(u,.42,.56),()=>{card(1000,320,540,190,{bg:'rgba(255,255,255,.05)',st:B,lw:2});wt(1030,370,'Plan 模式',24,B,800);para(1030,412,'只讀取與規劃，不改檔，核准後才實作',480,20,KC.text,600,30);});
  alphaDo(seg(u,.6,.72),()=>{card(1000,540,540,130,{bg:'rgba(255,255,255,.05)',st:'rgba(255,255,255,.3)',lw:1.5});para(1030,586,'一句話說得完的小修改，可以直接做',480,20,SUBC,600,30);});
  alphaDo(seg(u,.8,.95),()=>human(1000,700,1,'核准計畫，由你決定'));
 }},
/* 2 小步提交（圖解，生活） */
{t:'小步提交',en:'Commit in small steps',dur:13,
 d:'每完成一個可以運作的小階段，就請 Claude 提交一次，訊息寫清楚做了什麼。一次改一大包，審閱很累，出錯也很難找回。小步提交的每一筆都小、都能看懂，壞了就退回上一筆。檢查點能還原檔案，Git 提交才是長久的紀錄。',
 s:[[0,'每個小階段提交一次'],[.42,'一大包：難審閱、難回復'],[.78,'小步：每筆都看得懂']],
 draw(u){
  diagBG();floatParticles(8,41);caseTag(60,150,'life',1);
  ln([100,290,1500,290],'rgba(255,255,255,.25)',3);
  [['新增月總額函式',B],['加入測試',G],['修正空月份',Y],['更新說明',P]].forEach((r,i)=>alphaDo(seg(u,.04+i*.08,.16+i*.08),()=>{circ(200+i*400,290,16,r[1],'none',0);card(80+i*400,330,240,100,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});para(100+i*400,372,r[0],200,20,'#fff',800,28);wt(200+i*400,262,trf('提交 {n}',{n:i+1}),19,r[1],700,'center');}));
  alphaDo(seg(u,.42,.58),()=>{card(60,490,740,230,{bg:'rgba(232,87,42,.08)',st:O,lw:2});wt(90,540,'一次改一大包',24,O,800);para(90,584,'審閱很累，出錯不知道哪一步壞掉',660,21,KC.text,600,30);});
  alphaDo(seg(u,.62,.78),()=>{card(840,490,700,230,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(870,540,'小步提交',24,G,800);para(870,584,'每筆都小、都看得懂，壞了退回上一筆',640,21,KC.text,600,30);});
  alphaDo(seg(u,.82,.9),()=>{wt(60,770,'檢查點還原檔案，Git 提交才是長久的紀錄',22,SUBC,700);});
  alphaDo(seg(u,.88,.97),()=>human(1180,740,1,'提交訊息由你過目'));
 }},
/* 3 撰寫測試（智慧自動化） */
{t:'撰寫測試',en:'Write tests',dur:14,
 d:'測試是給 Claude 的驗證方法。感測器輸出四到二十毫安培，要換算成零到十巴的壓力。請 Claude 先寫測試：四毫安培是零，十二毫安培是五，二十毫安培是十，還有超出範圍就要報錯。邊界值與異常值一定要有。預期值對不對，要由你核對規格。',
 s:[[0,'測試是給 Claude 的驗證方法'],[.4,'一般值、邊界值、異常值'],[.78,'預期值由你核對規格']],
 draw(u){
  sceneBG();caseTag(60,150,'auto',1);
  alphaDo(seg(u,.02,.14),()=>{bub(60,200,900,'4–20 mA 對應 0–10 bar，請先為換算函式寫測試，含邊界與異常值。','user',1);});
  alphaDo(seg(u,.3,.5),()=>{const cols=[200,200,200,300];cells(60,320,cols,['輸入 (mA)','預期 (bar)','類型','說明'],52,true);
   [['4','0.0','邊界','量程下限'],['12','5.0','一般','中間值'],['20','10.0','邊界','量程上限'],['2','報錯','異常','斷線或超出範圍']].forEach((r,i)=>cells(60,372+i*52,cols,r,52,false,i===3?[null,[ 'rgba(232,87,42,.12)',O],null,null].map((c,j)=>j===1?['rgba(232,87,42,.12)',O]:null):null));});
  alphaDo(seg(u,.4,.56),()=>{winFrame(1000,200,540,330,'test_convert.py（示意）');
   ['def test_12ma_is_half():','    assert convert(12) == 5.0','def test_out_of_range():','    with raises(ValueError):','        convert(2)'].forEach((s,i)=>wt(1024,262+i*46,s,19,i%2?G:B,700));});
  alphaDo(seg(u,.56,.68),()=>{wt(60,630,'一般值、邊界值、異常值，三類都要有',22,Y,800);});
  alphaDo(seg(u,.78,.9),()=>{card(1000,560,540,110,{bg:'rgba(232,87,42,.08)',st:O,lw:1.5});para(1024,604,'AI 寫的預期值可能照抄錯誤的公式',490,19,O,700,28);});
  alphaDo(seg(u,.88,.97),()=>human(1000,700,1,'預期值依規格由你核對'));
 }},
/* 4 跑測試並修錯（風能） */
{t:'跑測試並修錯',en:'Run tests and fix failures',dur:14,
 d:'寫好測試，就讓 Claude 自己跑。風速功率曲線的函式，在二十五米每秒的切出風速應該輸出零，測試卻失敗了，實際輸出兩千千瓦。Claude 讀到失敗訊息，發現判斷式用了大於，應該是大於等於。修改後再跑一次，全部通過。你看差異與結果，再決定要不要提交。',
 s:[[0,'風速—功率曲線函式有測試'],[.4,'失敗訊息指出問題'],[.76,'修正後全部通過']],
 draw(u){
  sceneBG();caseTag(60,150,'wind',1);
  const pass=seg(u,.6,.7);
  winFrame(60,200,900,430,'pytest（示意）');
  alphaDo(seg(u,.02,.14),()=>{wt(90,276,'test_cut_in    ✓',21,G,700);wt(90,326,'test_rated     ✓',21,G,700);wt(90,376,'test_cut_out   '+(pass>.5?'✓':'✗'),21,pass>.5?G:O,700);});
  alphaDo(seg(u,.2,.3),()=>{wt(90,426,'test_below_cut_in ✓',21,G,700);});
  alphaDo(seg(u,.4,.54)*(pass>.5?0:1),()=>{box(80,456,860,110,'rgba(232,87,42,.15)','none',0);wt(100,498,'AssertionError: 預期 0 kW，實際 2000 kW',20,O,700);wt(100,538,'v = 25 m/s（切出風速）',19,SUBC,600);});
  alphaDo(pass,()=>{box(80,456,860,110,'rgba(125,255,196,.12)','none',0);wt(100,510,'4 passed',24,G,800);});
  alphaDo(seg(u,.5,.64),()=>{card(1000,200,540,260,{bg:'rgba(7,27,39,.85)',st:Y,lw:2});wt(1030,250,'Claude 找到的原因',22,Y,800);box(1020,280,500,56,'rgba(232,87,42,.18)','none',0);wt(1036,316,'-  if v > 25:',20,O,700);box(1020,336,500,56,'rgba(125,255,196,.15)','none',0);wt(1036,372,'+  if v >= 25:',20,G,700);wt(1030,432,'邊界條件寫成「大於」',19,SUBC,600);});
  alphaDo(seg(u,.78,.88),()=>{card(1000,490,540,100,{bg:'rgba(255,255,255,.05)',st:B,lw:1.5});para(1024,534,'曲線數字為示意，非特定機組規格',490,19,SUBC,600,28);});
  alphaDo(seg(u,.88,.97),()=>human(1000,620,1,'切出風速依機組規格確認'));
 }},
/* 5 除錯（風能，圖解） */
{t:'除錯：從錯誤訊息到根因',en:'Debugging: from error message to root cause',dur:14,
 d:'出錯時，把完整的錯誤訊息貼給 Claude，不要只說壞掉了。以風速警報規則為例，錯誤說字串不能和數字比大小。重現問題、找出根因：資料是從 CSV 讀進來的，風速還是文字。最小的修正是先轉成數字，最後補一個回歸測試，避免再犯。警報門檻與停機判斷，要由人員確認。',
 s:[[0,'貼上完整錯誤訊息'],[.42,'根因：CSV 讀進來是文字'],[.76,'最小修正，再補回歸測試']],
 draw(u){
  diagBG();floatParticles(8,43);caseTag(60,150,'wind',1);
  [['錯誤訊息',O],['重現',B],['根因',Y],['最小修正',G],['回歸測試',P]].forEach((r,i)=>alphaDo(seg(u,.02+i*.07,.14+i*.07),()=>{card(60+i*300,190,270,84,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(195+i*300,242,r[0],22,r[1],800,'center');if(i<4)arrow(332+i*300,232,358+i*300,232,Y,3);}));
  alphaDo(seg(u,.3,.46),()=>{winFrame(60,320,900,260,'錯誤訊息（示意）');
   wt(90,396,'File alarm_rule.py, line 12',19,SUBC,600);wt(90,440,'if wind > 20:',20,B,700);
   box(80,468,860,80,'rgba(232,87,42,.15)','none',0);para(100,500,"TypeError: '>' not supported between 'str' and 'int'",820,19,O,700,28);});
  alphaDo(seg(u,.42,.58),()=>{card(1000,320,540,260,{bg:'rgba(255,242,194,.06)',st:Y,lw:2});wt(1030,370,'根因',24,Y,800);para(1030,412,'風速從 CSV 讀進來還是文字，不是數字；只壓掉警告並未解決。',480,20,KC.text,600,30);});
  alphaDo(seg(u,.62,.76),()=>{card(60,610,900,100,{bg:'rgba(125,255,196,.08)',st:G,lw:2});wt(90,672,'wind = float(row["wind"])  再比較',22,G,800);});
  alphaDo(seg(u,.76,.88),()=>{card(1000,610,540,100,{bg:'rgba(179,124,255,.1)',st:P,lw:2});para(1030,654,'補測試：字串數值也要正確比較',480,20,KC.text,700,28);});
  alphaDo(seg(u,.88,.97),()=>human(60,740,1,'警報門檻與停機判斷由人員確認'));
 }},
/* 6 總結（三情境，圖解） */
{t:'迴圈與三個專案',en:'The loop across three projects',dur:13,
 d:'整個迴圈是：計畫、實作、測試、提交，出錯就找根因再回到測試。記帳函式、感測器換算、風速功率曲線，三個專案都一樣：先看計畫，小步實作，用測試驗證，由你核對預期值。下一集，我們讓 Claude 做程式碼審查與重構。',
 s:[[0,'計畫、實作、測試、提交'],[.46,'三個專案，同一個迴圈'],[.8,'下一集：程式碼審查與重構']],
 draw(u){
  diagBG();floatParticles(8,47);
  [['計畫',Y],['實作',B],['測試',G],['提交',P]].forEach((r,i)=>alphaDo(seg(u,.02+i*.08,.14+i*.08),()=>{card(60+i*380,180,340,110,{bg:'rgba(7,27,39,.85)',st:r[1],lw:2});wt(230+i*380,246,r[0],28,r[1],800,'center');if(i<3)arrow(402+i*380,235,436+i*380,235,Y,4);}));
  alphaDo(seg(u,.3,.44),()=>{ln([1400,300,1400,350,230,350,230,300],O,3);arrow(230,350,230,302,O,3);wt(815,392,'測試失敗：找根因，回到實作',21,O,700,'center');});
  alphaDo(seg(u,.46,.72),()=>{
   [['生活','記帳月總額',B],['智慧自動化','mA 換算測試',Y],['風能運維','功率曲線與警報',G]].forEach((r,i)=>{card(60+i*500,450,480,140,{bg:'rgba(7,27,39,.85)',st:r[2],lw:2});tag(86+i*500,468,r[0],{size:17,bg:r[2]});wt(86+i*500,562,r[1],25,'#fff',800);});});
  alphaDo(seg(u,.78,.88),()=>{wt(60,660,'先看計畫、小步實作、用測試驗證',24,G,800);});
  alphaDo(seg(u,.88,.97),()=>human(60,710,1,'預期值與門檻，由你核對'));
 }}
]};
