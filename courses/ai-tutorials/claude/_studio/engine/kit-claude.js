/* kit-claude.js — Claude AI 應用動畫館 專用繪圖函式庫
   建立日期：2026-09-28
   沿用 energy-animation-studio 引擎（core.js + engine.js）
   世界座標 1600×900；所有函式都是 draw 內部呼叫的純函式。
   ────────────────────────────────────────────────── */

// ─── Claude 品牌色（示意，非官方） ──────────────────────────────
const KC={
  bg:      '#0e2133',   // 深藍背景（對話底色）
  winBg:   '#131f2e',   // 視窗背景
  winBar:  '#1a2d42',   // 標題列
  userBub: '#2a5c8c',   // 使用者泡泡
  aiBub:   '#1e3a55',   // Claude 泡泡
  border:  '#2e4a66',   // 框線
  accent:  '#f2c230',   // 強調黃（引擎色）
  green:   '#7dffc4',   // 薄荷綠（引擎色）
  orange:  '#e8572a',   // 警示橘（引擎色）
  text:    '#e3ecee',   // 主要文字
  sub:     '#7a9bb0',   // 次要文字
  cursor:  '#f2c230',   // 閃爍游標
  toolBg:  '#0f2438',   // 工具面板底色
  nodeBg:  '#1a3048',   // 代理節點底色
  nodeAct: '#f2c230',   // 代理節點啟動色
};

/* ═══════════════════════════════════════════════════════════════
   1. 對話視窗：claudeWin(x, y, w, h, opts)
      opts.msgs = [{role:'user'|'ai', text:'...'}, ...]
      opts.u    = 進度 0–1（控制訊息出現）
      opts.typing = true 顯示打字游標
   ═══════════════════════════════════════════════════════════════ */
function claudeWin(x, y, w, h, opts={}){
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
    ctx.fillStyle=KC.text; ctx.textBaseline='top';
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

/* 打字指示器（三個跳動圓點） */
function claudeTypingDot(x, y){
  [0,1,2].forEach(i=>{
    const dy=-4*Math.sin(TT*4+i*1.2);
    circ(x+i*14, y+dy, 4, KC.sub, 'none', 0);
  });
}

/* ═══════════════════════════════════════════════════════════════
   2. 單一訊息泡泡：bubble(x, y, w, text, role, opts)
      role='user'|'ai'  opts.u=0–1（淡入）
   ═══════════════════════════════════════════════════════════════ */
function bubble(x, y, w, text, role='ai', opts={}){
  const {u=1, lines=1} = opts;
  const h=28+lines*22;
  alphaDo(ease(clamp(u,0,1)), ()=>{
    rrp(x,y,w,h,8);
    ctx.fillStyle=role==='user'? KC.userBub: KC.aiBub; ctx.fill();
    ctx.strokeStyle=KC.border; ctx.lineWidth=1; ctx.stroke();
    ctx.font=`14px 'Noto Sans TC',sans-serif`;
    ctx.fillStyle=KC.text; ctx.textAlign='left'; ctx.textBaseline='middle';
    const t=tr(text);
    ctx.fillText(t.length>Math.floor(w/9)? t.slice(0,Math.floor(w/9))+'…': t, x+12, y+h/2);
  });
}

/* ═══════════════════════════════════════════════════════════════
   3. 閃爍游標（模擬 Claude 打字中）
      typeCursor(x, y, u) — u 控制閃爍相位
   ═══════════════════════════════════════════════════════════════ */
function typeCursor(x, y, scale=1){
  const a=0.5+0.5*Math.sin(TT*4);
  alphaDo(a, ()=>{
    box(x, y-16*scale, 2.5*scale, 20*scale, KC.cursor, 'none', 0);
  });
}

/* ═══════════════════════════════════════════════════════════════
   4. 檔案卡：fileCard(x, y, w, label, ext, opts)
      ext='PDF'|'CSV'|'DOCX'|'PNG'|'JS'…
      opts.u=淡入進度  opts.preview='...' 預覽小字
   ═══════════════════════════════════════════════════════════════ */
function fileCard(x, y, w, label, ext='FILE', opts={}){
  const {u=1, preview=''} = opts;
  const h=72, iw=48;
  alphaDo(ease(clamp(u,0,1)), ()=>{
    // 卡片底
    rrp(x,y,w,h,6); ctx.fillStyle='rgba(30,58,85,.9)'; ctx.fill();
    ctx.strokeStyle=KC.border; ctx.lineWidth=1.2; ctx.stroke();
    // 檔案圖示（摺角矩形）
    const ix=x+10, iy=y+10;
    ctx.fillStyle=_extColor(ext);
    ctx.beginPath();
    ctx.moveTo(ix,iy); ctx.lineTo(ix+iw-12,iy); ctx.lineTo(ix+iw,iy+12);
    ctx.lineTo(ix+iw,iy+38); ctx.lineTo(ix,iy+38); ctx.closePath();
    ctx.fill();
    // 摺角
    ctx.fillStyle='rgba(0,0,0,.25)';
    ctx.beginPath(); ctx.moveTo(ix+iw-12,iy); ctx.lineTo(ix+iw-12,iy+12); ctx.lineTo(ix+iw,iy+12); ctx.closePath(); ctx.fill();
    // 副檔名文字
    ctx.font=`700 11px 'Barlow Condensed',sans-serif`;
    ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(ext, ix+iw/2, iy+27);
    // 檔名
    ctx.font=`600 14px 'Noto Sans TC',sans-serif`;
    ctx.fillStyle=KC.text; ctx.textAlign='left'; ctx.textBaseline='top';
    const lbl=tr(label);
    ctx.fillText(lbl.length>18? lbl.slice(0,17)+'…': lbl, x+iw+18, y+14);
    if(preview){
      ctx.font=`12px 'Noto Sans TC',sans-serif`;
      ctx.fillStyle=KC.sub;
      ctx.fillText(tr(preview).slice(0,22), x+iw+18, y+36);
    }
  });
}
function _extColor(ext){
  const m={'PDF':'#e8572a','CSV':'#7dffc4','DOCX':'#2a5c8c','PNG':'#b37cff',
           'JS':'#f2c230','PY':'#58b8d0','MD':'#7dc8dc','TXT':KC.sub};
  return m[ext]||KC.sub;
}

/* ═══════════════════════════════════════════════════════════════
   5. 終端機視窗：terminal(x, y, w, h, opts)
      opts.lines=[ 命令字串... ]  opts.u=進度
      opts.prompt='$ '
   ═══════════════════════════════════════════════════════════════ */
function terminal(x, y, w, h, opts={}){
  const {lines=[], u=1, prompt='$ ', title='Terminal'} = opts;
  ctx.save();
  // 外框
  rrp(x,y,w,h,8); ctx.fillStyle='#0a1520'; ctx.fill();
  ctx.strokeStyle=KC.border; ctx.lineWidth=1.5; ctx.stroke();
  // 標題列
  box(x+1,y+1,w-2,30,'#1a2d42','none',0);
  circ(x+14,y+15,5,'#e8572a','none',0);
  circ(x+30,y+15,5,KC.accent,'none',0);
  circ(x+46,y+15,5,KC.green,'none',0);
  ctx.font=`13px 'Barlow Condensed',monospace`;
  ctx.fillStyle=KC.sub; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(title, x+w/2, y+15);
  ln([x,y+30,x+w,y+30],KC.border,1);
  // 文字內容
  ctx.save(); ctx.beginPath(); ctx.rect(x+2,y+31,w-4,h-32); ctx.clip();
  const shown=Math.floor(lines.length*clamp(u*1.5,0,1));
  ctx.font=`14px 'Barlow Condensed',monospace`;
  ctx.textAlign='left'; ctx.textBaseline='top';
  lines.slice(0,shown).forEach((ln_,i)=>{
    const ty=y+38+i*20;
    const isCmd=ln_.startsWith(prompt)||ln_.startsWith('#');
    ctx.fillStyle=isCmd? KC.green: KC.text;
    ctx.fillText(tr(ln_), x+12, ty);
  });
  // 游標（最後一行末）
  if(shown<lines.length||u<0.9){
    const cy=y+38+shown*20;
    typeCursor(x+12+8*(prompt.length), cy);
  }
  ctx.restore();
  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════════
   6. 瀏覽器視窗：browserWin(x, y, w, h, opts)
      opts.url='claude.ai/...'  opts.u=0–1（頁面淡入）
      opts.drawContent=fn(innerX,innerY,innerW,innerH)
   ═══════════════════════════════════════════════════════════════ */
function browserWin(x, y, w, h, opts={}){
  const {url='claude.ai', u=1, drawContent=null} = opts;
  ctx.save();
  // 外框
  rrp(x,y,w,h,8); ctx.fillStyle='#12202f'; ctx.fill();
  ctx.strokeStyle=KC.border; ctx.lineWidth=1.5; ctx.stroke();
  // 工具列
  box(x+1,y+1,w-2,38,'#1d3040','none',0);
  // 返回 / 前進
  ctx.font=`16px 'Barlow Condensed',sans-serif`;
  ctx.fillStyle=KC.sub; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('‹', x+16, y+20); ctx.fillText('›', x+34, y+20);
  // 重新整理
  ctx.fillStyle=KC.sub; ctx.font=`14px sans-serif`;
  ctx.fillText('↻', x+50, y+20);
  // 網址列
  rrp(x+62,y+8,w-80,24,4);
  ctx.fillStyle='rgba(255,255,255,.06)'; ctx.fill();
  ctx.strokeStyle=KC.border; ctx.lineWidth=1; ctx.stroke();
  ctx.font=`13px 'Noto Sans TC',sans-serif`;
  ctx.fillStyle=KC.sub; ctx.textAlign='left'; ctx.textBaseline='middle';
  ctx.fillText(url.length>38? url.slice(0,37)+'…': url, x+70, y+20);
  // 鎖頭
  ctx.fillStyle=KC.green; ctx.font=`12px sans-serif`;
  ctx.fillText('⚿', x+66, y+20);
  ln([x,y+38,x+w,y+38],KC.border,1);
  // 頁面內容
  if(drawContent){
    ctx.save(); ctx.beginPath(); ctx.rect(x+2,y+39,w-4,h-40); ctx.clip();
    alphaDo(ease(u), ()=>drawContent(x+2,y+39,w-4,h-40));
    ctx.restore();
  } else {
    alphaDo(ease(u)*0.3, ()=>{ ctx.fillStyle='#fff'; ctx.fillRect(x+2,y+39,w-4,h-40); });
  }
  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════════
   7. 代理迴圈節點：agentNode(x, y, r, label, opts)
      opts.u=淡入  opts.active=0–1（啟動強度）  opts.icon='◎'
   ═══════════════════════════════════════════════════════════════ */
function agentNode(x, y, r, label, opts={}){
  const {u=1, active=0, icon=''} = opts;
  alphaDo(ease(clamp(u,0,1)), ()=>{
    if(active>0.01){
      const glowR=r+12+8*active;
      const g=ctx.createRadialGradient(x,y,r,x,y,glowR+6);
      g.addColorStop(0,`rgba(242,194,48,${0.35*active})`);
      g.addColorStop(1,'rgba(242,194,48,0)');
      circ(x,y,glowR+6,g,'none',0);
    }
    circ(x,y,r,KC.nodeBg, lerp(KC.border,KC.nodeAct,active), lerp(1.5,3,active));
    if(icon){
      ctx.font=`${r*0.9}px sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle=lerp('#7a9bb0','#f2c230',active);
      ctx.fillText(icon, x, y);
    }
    ctx.font=`600 14px 'Noto Sans TC',sans-serif`;
    ctx.fillStyle=active>0.5? KC.accent: KC.text;
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText(tr(label), x, y+r+8);
  });
}

function agentArrow(x0,y0,x1,y1,opts={}){
  const {u=1, active=0, col=KC.border} = opts;
  if(u<=0) return;
  alphaDo(0.5+0.3*active, ()=>arrow(x0,y0,x1,y1,col,1.5));
  if(active>0.1){
    const n=3;
    for(let i=0;i<n;i++){
      const t=((TT*0.5+i/n)%1);
      circ(lerp(x0,x1,t), lerp(y0,y1,t), 3, KC.accent, 'none', 0);
    }
  }
}

/* ═══════════════════════════════════════════════════════════════
   8. 工具圖示：toolIcon(x, y, name, opts)
   ═══════════════════════════════════════════════════════════════ */
const TOOL_ICONS={
  '搜尋':{sym:'◎',col:'#58b8d0'},'計算':{sym:'∑',col:'#f2c230'},
  '程式':{sym:'</>',col:'#7dffc4'},'檔案':{sym:'☰',col:'#b37cff'},
  '瀏覽':{sym:'⬡',col:'#7dc8dc'},'日曆':{sym:'▦',col:'#e8572a'},
  'search':{sym:'◎',col:'#58b8d0'},'code':{sym:'</>',col:'#7dffc4'},
  'file':{sym:'☰',col:'#b37cff'},'web':{sym:'⬡',col:'#7dc8dc'},
};
function toolIcon(x, y, name, opts={}){
  const {u=1, active=0, size=40} = opts;
  const info=TOOL_ICONS[name]||{sym:'✦',col:KC.sub};
  alphaDo(ease(clamp(u,0,1)), ()=>{
    const r=size/2;
    rrp(x-r,y-r,size,size,6);
    ctx.fillStyle=active>0.5? info.col+'33': KC.toolBg; ctx.fill();
    ctx.strokeStyle=active>0.5? info.col: KC.border;
    ctx.lineWidth=active>0.5?2:1; ctx.stroke();
    ctx.font=`700 ${Math.floor(size*0.45)}px 'Barlow Condensed',monospace`;
    ctx.fillStyle=active>0.5? info.col: KC.sub;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(info.sym, x, y);
    if(name){
      ctx.font=`11px 'Noto Sans TC',sans-serif`;
      ctx.fillStyle=KC.sub; ctx.textBaseline='top';
      ctx.fillText(tr(name), x, y+r+4);
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   9. 連線動畫：connLine(x0,y0,x1,y1,opts)
   ═══════════════════════════════════════════════════════════════ */
function connLine(x0,y0,x1,y1,opts={}){
  const {u=1, flow=false, col=KC.border, lw=2, dash=false} = opts;
  if(u<=0) return;
  ctx.save();
  ctx.strokeStyle=col; ctx.lineWidth=lw;
  if(dash) ctx.setLineDash([8,6]);
  ctx.globalAlpha=0.7;
  ctx.beginPath();
  ctx.moveTo(x0,y0); ctx.lineTo(lerp(x0,x1,u), lerp(y0,y1,u));
  ctx.stroke(); ctx.setLineDash([]);
  if(flow && u>=1){
    const n=4;
    for(let i=0;i<n;i++){
      const t=((TT*0.6+i/n)%1);
      circ(lerp(x0,x1,t), lerp(y0,y1,t), 3, col, 'none', 0);
    }
  }
  ctx.restore();
}

/* ═══════════════════════════════════════════════════════════════
   10. 上下文視窗圖解：contextDesk(x, y, w, h, opts)
   ═══════════════════════════════════════════════════════════════ */
function contextDesk(x, y, w, h, opts={}){
  const {tokens=0, maxTokens=200000, items=[], u=1} = opts;
  alphaDo(ease(clamp(u,0,1)), ()=>{
    rrp(x,y,w,h,8); ctx.fillStyle='rgba(15,36,56,.85)'; ctx.fill();
    ctx.strokeStyle=KC.border; ctx.lineWidth=1.2; ctx.stroke();
    const bx=x+16,by=y+h-30,bw=w-32,bh=12;
    box(bx,by,bw,bh,'rgba(255,255,255,.08)',KC.border,1);
    const ratio=Math.min(tokens/maxTokens,1);
    const barCol=ratio>0.8?KC.orange:ratio>0.5?KC.accent:KC.green;
    const drawn=bw*ratio*clamp(u*2,0,1);
    if(drawn>0) box(bx,by,drawn,bh,barCol,'none',0);
    ctx.font=`600 12px 'Barlow Condensed',sans-serif`;
    ctx.fillStyle=KC.sub; ctx.textAlign='right'; ctx.textBaseline='bottom';
    ctx.fillText(`${Math.round(tokens/1000)}K / ${Math.round(maxTokens/1000)}K tokens`, bx+bw, by-4);
    items.forEach((item,i)=>{
      const ix=x+16+i%(Math.floor((w-32)/90))*90;
      const iy=y+20+Math.floor(i/Math.floor((w-32)/90))*60;
      const a=seg(u, i/Math.max(items.length,1), (i+1)/Math.max(items.length,1));
      alphaDo(ease(a), ()=>{
        rrp(ix,iy,78,46,4); ctx.fillStyle='rgba(42,92,140,.6)'; ctx.fill();
        ctx.strokeStyle=KC.border; ctx.lineWidth=1; ctx.stroke();
        ctx.font=`12px 'Noto Sans TC',sans-serif`;
        ctx.fillStyle=KC.text; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(tr(item).slice(0,6), ix+39, iy+23);
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   11. 模型比較卡：modelCard(x, y, w, name, speed, quality, opts)
   ═══════════════════════════════════════════════════════════════ */
function modelCard(x, y, w, name, speed, quality, opts={}){
  const {u=1, highlight=false} = opts;
  const h=100;
  alphaDo(ease(clamp(u,0,1)), ()=>{
    rrp(x,y,w,h,8);
    ctx.fillStyle=highlight?'rgba(242,194,48,.12)':'rgba(30,58,85,.8)'; ctx.fill();
    ctx.strokeStyle=highlight? KC.accent: KC.border;
    ctx.lineWidth=highlight?2:1; ctx.stroke();
    ctx.font=`700 18px 'Noto Sans TC',sans-serif`;
    ctx.fillStyle=highlight? KC.accent: KC.text;
    ctx.textAlign='left'; ctx.textBaseline='top';
    ctx.fillText(tr(name), x+12, y+12);
    ctx.font=`12px 'Noto Sans TC',sans-serif`;
    ctx.fillStyle=KC.sub; ctx.textBaseline='top';
    ctx.fillText(tr('速度'), x+12, y+40);
    const sw=Math.floor((w-24)*0.6*speed);
    box(x+12,y+55,Math.floor((w-24)*0.6),8,'rgba(255,255,255,.08)',KC.border,1);
    if(sw>0) box(x+12,y+55,sw,8,KC.green,'none',0);
    ctx.fillStyle=KC.sub; ctx.textAlign='right';
    ctx.fillText(tr('推理'), x+w-12, y+40);
    const qw=Math.floor((w-24)*0.35*quality);
    const qx=x+w-12-Math.floor((w-24)*0.35);
    box(qx,y+55,Math.floor((w-24)*0.35),8,'rgba(255,255,255,.08)',KC.border,1);
    if(qw>0) box(qx,y+55,qw,8,KC.accent,'none',0);
  });
}

/* ═══════════════════════════════════════════════════════════════
   12. 步驟流程圖：flowSteps(steps, startX, y, stepW, u, col)
   ═══════════════════════════════════════════════════════════════ */
function flowSteps(steps, startX, y, stepW, u=1, col=KC.accent){
  const n=steps.length;
  steps.forEach((s,i)=>{
    const x=startX+i*stepW;
    const a=seg(u, i/n, (i+0.5)/n);
    if(i<n-1){
      const la=seg(u,(i+0.4)/n,(i+0.6)/n);
      alphaDo(la, ()=>ln([x+28,y,x+stepW-28,y],col,2));
    }
    const active=a>0.5;
    alphaDo(ease(a), ()=>{
      circ(x,y,24, active?col:'rgba(30,58,85,.8)', active?col:KC.border, active?0:1.5);
      ctx.font=`700 16px 'Barlow Condensed',sans-serif`;
      ctx.fillStyle=active?'#0e2133':KC.sub;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(s.icon||String(i+1), x, y);
      ctx.font=`600 13px 'Noto Sans TC',sans-serif`;
      ctx.fillStyle=active? col: KC.sub; ctx.textBaseline='top';
      ctx.fillText(tr(s.label), x, y+30);
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   13. 整集背景 claudeBase() 與浮動粒子 floatParticles()
   ═══════════════════════════════════════════════════════════════ */
function claudeBase(){
  const g=ctx.createLinearGradient(0,0,0,900);
  g.addColorStop(0,'#0d1c2a'); g.addColorStop(1,'#07111a');
  ctx.fillStyle=g; ctx.fillRect(0,0,1600,900);
  ctx.strokeStyle='rgba(46,74,102,.18)'; ctx.lineWidth=1;
  for(let gx=0;gx<=1600;gx+=80){ln([gx,0,gx,900],'rgba(46,74,102,.1)',0.5);}
  for(let gy=0;gy<=900;gy+=80){ln([0,gy,1600,gy],'rgba(46,74,102,.1)',0.5);}
}
function floatParticles(n=18, seed=42){
  const r=rng(seed);
  for(let i=0;i<n;i++){
    const px=r()*1600, py=(r()*900+(TT*12*(0.3+r()*0.5)))%900;
    circ(px,py,1.5,'rgba(125,200,220,'+(0.04+r()*0.08)+')','none',0);
  }
}

/* ═══════════════════════════════════════════════════════════════
   i18n 詞彙（英文 / 日文）
   ═══════════════════════════════════════════════════════════════ */
Object.assign(DICT,{
  'Claude':['Claude','Claude'],
  '你':['You','あなた'],
  '速度':['Speed','速度'],
  '推理':['Reasoning','推論'],
  '搜尋':['Search','検索'],
  '計算':['Calculate','計算'],
  '程式':['Code','コード'],
  '檔案':['Files','ファイル'],
  '瀏覽':['Browse','ブラウズ'],
  '日曆':['Calendar','カレンダー'],
  '終端機':['Terminal','ターミナル'],
  '瀏覽器':['Browser','ブラウザー'],
  '代理迴圈':['Agent Loop','エージェントループ'],
  '感知':['Perceive','知覚'],
  '規劃':['Plan','計画'],
  '行動':['Act','行動'],
  '觀察':['Observe','観察'],
  '工具':['Tool','ツール'],
  '連線':['Connect','接続'],
  '上下文視窗':['Context Window','コンテキストウィンドウ'],
  '打字中…':['Typing…','入力中…'],
  '資訊截至':['Info as of','情報の更新日'],
});
