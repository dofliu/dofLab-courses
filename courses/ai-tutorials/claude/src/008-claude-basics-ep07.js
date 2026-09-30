// KITS: claude
/* 008-claude-basics-ep07 — 限制、查證與隱私
   Claude AI 應用動畫館｜入門基礎 第 7 集
   依 support.claude.com、privacy.claude.com、platform.claude.com 查證，資訊截至 2026-09 */

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

const EP={no:7,t:'限制、查證與隱私',en:'Limits, Verification & Privacy',
seriesName:'入門基礎',total:7,
lede:'Claude 很有用，但也會出錯。本集說明幻覺從哪裡來、知識截止的影響、敏感資料與保存期限，以及一份隨手可用的查證清單。',
facts:[['30','天','刪除的對話會在 30 天內從後端系統刪除'],
 ['5','年','開啟模型改善時，資料以去識別化形式最多保存 5 年'],
 ['5','年','透過讚／倒讚送出的回饋保存期限'],
 ['2','年','被標記違反使用政策的輸入與輸出最多保存期限'],
 ['無痕','對話','即使開啟模型改善，無痕對話也不會用於改善 Claude']],
note:'說明：本集為教育用途示意動畫，介面為重新繪製的示意圖，非官方畫面。保存期限依 Anthropic 隱私中心對消費者方案（Free、Pro、Max）的說明，Team、Enterprise 與 API 另有規定；燈塔年份、機率與租約內容為示例。資訊截至 2026-09。',
shots:[
/* ── 1 幻覺是什麼（圖解） ── */
{t:'幻覺是什麼',en:'What is a hallucination',dur:14,
 d:'幻覺（hallucination）指模型產生看似合理、實際上錯誤或誤導的內容。語言模型逐字預測下一個最可能的詞：常見知識的機率集中，答案通常可靠；冷門細節的機率分散，模型仍會挑一個候選，寫成語氣肯定的句子。官方說明提醒，這類回答可能包含看起來權威、卻沒有事實根據的引文，因此重要決定不要把 Claude 當成唯一的資訊來源。',
 s:[[0,'語言模型一次預測一個詞，每個候選都有機率'],[.3,'機率分散時，代表模型其實沒有把握'],[.55,'但它仍會選一個，寫出流暢的句子'],[.76,'看起來權威，不代表有事實根據']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});
  wt(90,196,'下一個詞的機率',22,Y,700);
  const sets=[
   {q:'問：水在 1 大氣壓下的沸點？',y:236,c:[['100 °C',.96],['90 °C',.02],['110 °C',.02]],col:G,note:'機率集中：模型有把握',a:seg(u,.04,.28)},
   {q:'問：某座小燈塔建於哪一年？',y:448,c:[['1883',.34],['1885',.29],['1890',.22],['1901',.15]],col:Y,note:'機率分散：其實不確定',a:seg(u,.3,.54)}];
  sets.forEach((S,k)=>{
   alphaDo(clamp(S.a*3,0,1),()=>{
    wt(90,S.y,S.q,18,'#fff',600);
    S.c.forEach((c,i)=>{const by=S.y+22+i*36;
     wt(96,by+21,c[0],18,SUBC,600,'left',COND);
     box(220,by+6,440,20,'rgba(255,255,255,.06)','none',0);
     box(220,by+6,440*c[1]*ease(S.a),20,S.col,'none',0);
     wt(672,by+22,Math.round(c[1]*100*ease(S.a))+'%',18,S.col,700,'left',COND);});
    wt(90,S.y+32+S.c.length*36,S.note,17,k?O:G,700);
   });
  });
  alphaDo(seg(u,.52,.6),()=>wt(90,750,'但模型仍會挑一個，流暢地寫成句子',17,SUBC,500));
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)'});
  wt(850,196,'看起來正確 ≠ 正確',22,Y,700);
  bub(850,226,660,trf('這座燈塔建於 {y} 年，由當時的港務局設計。',{y:1883}),'ai',seg(u,.55,.62),O);
  const mA=seg(u,.62,.76);
  alphaDo(clamp(mA*4,0,1),()=>{
   [['語句流暢度',.95,G],['事實依據',.3,O]].forEach((m,i)=>{const my=420+i*62;
    wt(850,my,m[0],18,'#fff',600);
    box(1070,my-18,380,22,'rgba(255,255,255,.06)','none',0);box(1070,my-18,380*m[1]*ease(mA),22,m[2],'none',0);
    wt(1462,my,Math.round(m[1]*100*ease(mA))+'%',18,m[2],700,'left',COND);});
  });
  const tA=seg(u,.76,.96);
  alphaDo(clamp(tA*4,0,1),()=>{
   wt(850,580,'常見的幻覺型態',19,SUBC,700);
   ['捏造的引文','錯誤的數字或日期','不存在的來源'].forEach((s,i)=>alphaDo(seg(tA,i*.25,i*.25+.3),()=>tag(850,626+i*54,s,{bg:'rgba(232,87,42,.18)',fg:'#ffb89c',size:18})));
  });
 }},
/* ── 2 知識截止與時效性（圖解） ── */
{t:'知識截止與時效性',en:'Knowledge cutoff and freshness',dur:14,
 d:'模型的知識來自訓練資料，資料收集到某個時間點就停止，稱為知識截止。之後發生的事件、改版的法規、更新的價格與新產品，模型都不知道，卻可能用舊資訊作答。官方說明指出，Claude 在談論時事時容易混淆。需要時效性的答案，可開啟網頁搜尋，讓回答附上引用與來源連結；再點開原始網頁，確認內容與發布日期，才算完成查證。',
 s:[[0,'模型的知識來自訓練資料，停在某個時間點'],[.28,'截止之後發生的事，模型無從得知'],[.45,'價格、法規、人事與產品版本最容易過時'],[.66,'需要最新資訊時，開啟網頁搜尋並核對來源']],
 draw(u){
  diagBG();
  card(60,150,1480,390,{bg:'rgba(7,27,39,.75)'});
  wt(90,196,'知識的時間軸',22,Y,700);
  const AY=320,X0=120,XC=980,XT=1440;
  const a1=ease(seg(u,.02,.26));
  box(X0,AY-10,(XC-X0)*a1,20,'rgba(125,255,196,.55)','none',0);
  for(let i=0;i<14;i++){const px=X0+30+i*60;if(px<X0+(XC-X0)*a1)box(px,AY-34,34,18,'rgba(125,255,196,.18)','rgba(125,255,196,.4)',1);}
  alphaDo(seg(u,.1,.26),()=>wt((X0+XC)/2,AY+48,'訓練資料',19,G,700,'center'));
  const a2=seg(u,.26,.44);
  alphaDo(a2,()=>{
   ctx.save();ctx.setLineDash([10,8]);ln([XC,AY,XC+(XT-XC)*ease(a2),AY],O,4);ctx.setLineDash([]);ctx.restore();
   box(XC,AY-60,(XT-XC)*ease(a2),110,'rgba(232,87,42,.07)','none',0);
   wt((XC+XT)/2,AY+48,'模型看不到這段期間',18,O,700,'center');
  });
  alphaDo(seg(u,.2,.28),()=>{ln([XC,AY-70,XC,AY+20],Y,3);tag(XC,AY-92,'知識截止',{align:'center',size:18});});
  alphaDo(seg(u,.36,.44),()=>{ln([XT,AY-70,XT,AY+20],G,3);tag(XT,AY-92,'今天',{align:'center',size:18,bg:G});});
  const items=['價格','法規','人事','產品版本'];
  items.forEach((s,i)=>{const a=seg(u,.45+i*.04,.5+i*.04);
   alphaDo(a,()=>tag(XC+30+(i%2)*225,AY+105+Math.floor(i/2)*50-(1-ease(a))*30,s,{size:17,bg:'rgba(232,87,42,.2)',fg:'#ffb89c'}));});
  card(60,570,1480,230,{bg:'rgba(7,27,39,.75)'});
  wt(90,616,'補救：讓 Claude 查最新資料',22,Y,700);
  const steps=['開啟網頁搜尋','回答附上引用連結','點開原網頁核對日期'];
  steps.forEach((s,i)=>{const a=seg(u,.64+i*.1,.72+i*.1),sx=110+i*480;
   alphaDo(a,()=>{const w=tag(sx,700,s,{size:21,bg:i===2?G:Y});if(i<2)arrow(sx+w+24,700,sx+456,700,Y,3);});});
  alphaDo(seg(u,.9,.97),()=>wt(110,775,'問近期事件時，先看回答有沒有附來源',17,SUBC,500));
 }},
/* ── 3 敏感資料怎麼處理（場景） ── */
{t:'敏感資料怎麼處理',en:'Handling sensitive data',dur:15,
 d:'官方建議謹慎分享高度敏感的個人資料，例如身分證字號、信用卡號、病歷、密碼與公司機密文件。多數任務其實不需要真實資料：改用遮蔽或佔位符，寄出前再自行填入即可。消費者方案（Free、Pro、Max）可隨時在隱私設定調整「模型改善」，關閉後新的對話不會用於未來的模型訓練。無痕對話則不會用於改善 Claude，即使模型改善是開啟的。',
 s:[[0,'貼上資料前，先想想哪些不該給'],[.18,'身分證字號、卡號與密碼改成遮蔽或佔位符'],[.52,'隱私設定可關閉「模型改善」'],[.74,'無痕對話不會用於改善 Claude']],
 draw(u){
  sceneBG();
  winFrame(60,150,820,650,'Claude');
  bub(360,214,500,'幫我寫一封申訴信，以下是我的資料：','user',seg(u,.02,.08));
  alphaDo(seg(u,.06,.12),()=>{
   rrp(90,316,760,250,10);ctx.fillStyle='rgba(15,36,56,.9)';ctx.fill();ctx.strokeStyle=KC.border;ctx.lineWidth=1;ctx.stroke();
   wt(110,346,'貼上前先檢查',15,SUBC,700);
   const rows=[['姓名','王小明','〔姓名〕'],['身分證字號','A123456789','A1********'],['信用卡號','4111 1111 1111 1111','（不需提供）'],['帳號密碼','abc12345','（絕不貼上）']];
   rows.forEach((r,i)=>{const ry=392+i*46,a=seg(u,.16+i*.08,.22+i*.08);
    wt(110,ry,r[0],18,SUBC,600);
    const vx=300;
    if(a<1)alphaDo(1-ease(a),()=>{wt(vx,ry,r[1],18,'#ffb89c',600,'left',COND);const w=wtw(r[1],18,600,COND);ln([vx-4,ry-6,vx+w*clamp(a*3,0,1)+4,ry-6],O,2);});
    if(a>0)alphaDo(ease(a),()=>wt(vx,ry,r[2],18,G,700));
   });
  });
  bub(90,594,640,'好的，我會先用〔姓名〕等佔位符撰寫，寄出前再由你填入。','ai',seg(u,.5,.56));
  alphaDo(seg(u,.56,.62),()=>tag(90,776,'用佔位符取代真實資料',{size:17,bg:G}));
  const R=seg(u,.44,.52);
  alphaDo(R,()=>{
   winFrame(920,150,620,650,'隱私設定（示意）');
   wt(950,236,'模型改善',20,'#fff',700);
   const off=ease(seg(u,.58,.64));toggle(1440,212,1-off);
   para(950,272,'關閉後，新的對話不會用於未來的模型訓練',470,16,SUBC,500);
   ln([950,318,1510,318],KC.border,1);
   alphaDo(seg(u,.72,.8),()=>{
    wt(950,362,'無痕對話',20,'#fff',700);
    para(950,398,'不會用於改善 Claude，即使開啟模型改善',540,16,G,600);
   });
   ln([950,446,1510,446],KC.border,1);
   alphaDo(seg(u,.82,.92),()=>{
    wt(950,490,'避免貼上',20,O,700);
    ['身分證字號、信用卡號','病歷、密碼','公司機密文件'].forEach((s,i)=>{circ(962,528+i*44,5,O,'none',0);wt(980,535+i*44,s,18,KC.text,500);});
   });
  });
 }},
/* ── 4 資料保存多久（圖解） ── */
{t:'資料保存多久',en:'How long data is kept',dur:14,
 d:'依 Anthropic 隱私中心對消費者方案的說明：刪除的對話會立即從聊天紀錄移除，並在 30 天內從後端系統刪除；開啟模型改善時，資料可能以去識別化形式在訓練流程中最多保存 5 年；按讚或倒讚送出的回饋保存 5 年；被標記違反使用政策的輸入與輸出最多保存 2 年。Team、Enterprise 與 API 屬商業方案，另有不同規定。',
 s:[[0,'刪除的對話立即從紀錄移除，後端 30 天內刪除'],[.3,'被標記違反政策的內容，最多保存 2 年'],[.5,'開啟模型改善時，去識別化資料最多保存 5 年'],[.78,'無痕對話不會用於改善 Claude']],
 draw(u){
  diagBG();
  card(60,150,1480,650,{bg:'rgba(7,27,39,.75)'});
  wt(90,196,'資料保存多久（消費者方案）',22,Y,700);
  const X0=500,PX=180;
  const rows=[['刪除的對話',30/365,G,'30 天內從後端刪除'],['被標記違反政策',2,O,'輸入與輸出最多 2 年'],['讚／倒讚回饋',5,B,'保存 5 年'],['開啟模型改善',5,Y,'去識別化，最多 5 年']];
  alphaDo(seg(u,.02,.08),()=>{
   ln([X0,560,X0+5*PX,560],KC.border,1.5);
   for(let k=0;k<=5;k++){ln([X0+k*PX,560,X0+k*PX,568],KC.border,1.5);wt(X0+k*PX,592,trf('{n} 年',{n:k}),16,SUBC,600,'center',COND);}
  });
  rows.forEach((r,i)=>{const ry=262+i*76,a=seg(u,.06+i*.16,.2+i*.16);
   alphaDo(clamp(a*4,0,1),()=>{
    wt(100,ry+8,r[0],19,'#fff',600);
    box(X0,ry-10,Math.max(6,r[1]*PX*ease(a)),24,r[2],'none',0);
    wt(X0+Math.max(6,r[1]*PX*ease(a))+14,ry+8,r[3],17,r[2],700);
   });
  });
  ln([90,630,1510,630],KC.border,1);
  alphaDo(seg(u,.76,.84),()=>{wt(100,688,'無痕對話',20,'#fff',700);tag(X0,682,'不用於改善 Claude',{size:18,bg:G});});
  alphaDo(seg(u,.86,.94),()=>wt(100,760,'Team、Enterprise 與 API 屬商業方案，另有規定',16,SUBC,500));
 }},
/* ── 5 人類保有最終判斷（場景） ── */
{t:'人類保有最終判斷',en:'Humans make the final call',dur:13,
 d:'官方說明建議，不要把 Claude 當成高風險決定的唯一依據，並仔細檢視它提供的任何重要建議。實務上可依風險分級：腦力激盪與初稿快速看過即可；工作報告與數據要核對數字與來源；醫療、法律與財務決定，則要對照原始文件並請教醫師、律師或財務顧問等專業人士。Claude 是協助思考的夥伴，最後的判斷與責任仍在使用者身上。',
 s:[[0,'Claude 能提供分析，但不替你做決定'],[.3,'涉及法律、醫療或財務時，會建議請教專業人士'],[.52,'風險越高，需要的查證越多'],[.8,'最終判斷與責任，留在人的手上']],
 draw(u){
  sceneBG();
  winFrame(60,150,760,650,'Claude');
  bub(300,214,500,'這份租約的第 5 條合理嗎？','user',seg(u,.02,.1));
  bub(90,330,680,'第 5 條的違約金約為三個月租金，高於常見的約定。這不是法律意見，簽約前建議請律師確認。','ai',seg(u,.14,.24),Y);
  alphaDo(seg(u,.3,.4),()=>{
   rrp(90,580,680,170,12);ctx.fillStyle='rgba(15,36,56,.9)';ctx.fill();ctx.strokeStyle='#7dc8dc';ctx.lineWidth=1.5;ctx.stroke();
   circ(140,640,30,'rgba(125,200,220,.2)','#7dc8dc',2);{const fs=Math.min(20,20*46/wtw('你',20,700));wt(140,640+fs*.35,'你',fs,'#7dc8dc',700,'center');}
   para(190,634,'讀完分析，對照原文，再決定要不要簽',540,19,KC.text,600);
  });
  card(860,150,680,650,{bg:'rgba(7,27,39,.8)'});
  wt(890,196,'風險越高，查證越多',22,Y,700);
  const L=[['腦力激盪、初稿','快速看過',.25,G],['工作報告、數據','核對數字與來源',.6,Y],['醫療、法律、財務','對照原始資料並請教專業人士',1,O]];
  L.forEach((r,i)=>{const ry=270+i*150,a=seg(u,.48+i*.1,.58+i*.1);
   alphaDo(clamp(a*3,0,1),()=>{
    wt(890,ry,r[0],20,'#fff',700);
    box(890,ry+20,600,16,'rgba(255,255,255,.06)','none',0);box(890,ry+20,600*r[2]*ease(a),16,r[3],'none',0);
    para(890,ry+72,r[1],600,18,r[3],600);
   });
  });
  alphaDo(seg(u,.82,.9),()=>tag(890,740,'最終決定由你負責',{size:19,bg:'#7dc8dc'}));
 }},
/* ── 6 查證檢核清單（圖解） ── */
{t:'查證檢核清單',en:'A verification checklist',dur:14,
 d:'Anthropic 開發者文件列出幾個降低幻覺的方法：明確允許 Claude 說不知道；處理長文件時先請它摘錄原文句子，再根據引文作答；要求每項說法附上引用，找不到依據就撤回。一般使用者也能照做：點開來源核對原始頁面、換個問法再問一次比對是否一致，高風險決定請教專業人士。發現錯誤時，可以用倒讚按鈕回報。',
 s:[[0,'給 Claude 說「不知道」的空間'],[.22,'要求附上原文或來源，再親自點開核對'],[.52,'換個問法再問一次，比對答案'],[.8,'看到紅旗訊號，就放慢腳步查證']],
 draw(u){
  diagBG();
  card(60,150,960,650,{bg:'rgba(7,27,39,.75)'});
  wt(90,196,'查證檢核清單',22,Y,700);
  const C=[['允許說「不知道」','在提示中寫明：不確定時直接說不知道'],['要求引用原文','請它附上文件原句或來源連結'],['點開來源核對','確認原網頁的內容與發布日期'],['換個問法再問','比對多次回答是否一致'],['高風險找專業人士','醫療、法律、財務決定不只靠 AI']];
  C.forEach((c,i)=>{const ry=230+i*112,a=seg(u,.04+i*.15,.12+i*.15);
   alphaDo(clamp(.35+a*3,0,1),()=>{
    checkBox(96,ry,a);
    wt(150,ry+22,c[0],21,a>0?'#fff':SUBC,700);
    wt(150,ry+58,c[1],17,SUBC,500);
   });
  });
  card(1060,150,480,650,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.5)'});
  wt(1090,196,'紅旗訊號',22,O,700);
  let yy=250;
  ['過於精確、卻沒有出處的數字','找不到原文的引用','近期事件卻沒有附來源','與常識或你的經驗矛盾'].forEach((s,i)=>{const a=seg(u,.6+i*.06,.66+i*.06);
   const L=wrapL(s,380,18,600);
   alphaDo(a,()=>{circ(1102,yy+6,6,O,'none',0);L.forEach((l,k)=>wt(1122,yy+12+k*26,l,18,KC.text,600));});
   yy+=L.length*26+38;
  });
  alphaDo(seg(u,.88,.95),()=>{wt(1090,700,'發現錯誤時',17,SUBC,600);tag(1090,744,'按倒讚回報',{size:18,bg:G});});
 }}
]};
