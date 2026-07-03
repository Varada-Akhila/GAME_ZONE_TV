import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 10, ROWS = 14;
const R = 21;
const COLORS = ['#e74c3c','#3498db','#f39c12','#2ecc71','#9b59b6'];
const EMOJI_LIST = ['😀','🐦','🤣'];

function lighten(hex, amt) {
  let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}
function darken(hex, amt) {
  let r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
}

// 💥 UPGRADED: Levels scale faster now
function getLevelParams(level) {
  return {
    numColors: Math.min(2 + Math.ceil(level / 2), 5), // Level 1-2: 3 colors, L3-4: 4 colors, L5+: 5 colors
    startRows: Math.min(3 + level, 10),               // Level 1: 4 rows, Level 2: 5 rows, etc.
    shots: Math.min(30 + level * 10, 80)
  };
}

function randColor(maxColors = 5) { return Math.floor(Math.random() * maxColors); }

function getAvailableColors(grid) {
  const colors = new Set();
  if (!grid) return [];
  for (let r=0; r<grid.length; r++) {
    if (!grid[r]) continue;
    for (let c=0; c<grid[r].length; c++) {
      if (grid[r][c]) colors.add(grid[r][c].color);
    }
  }
  return Array.from(colors);
}

function newBubble(grid, avoidColor = null, level = 1) {
  let color;
  const { numColors } = getLevelParams(level);
  
  if (grid) {
    let avail = getAvailableColors(grid);
    if (avail.length > 1 && avoidColor !== null) {
      avail = avail.filter(c => c !== avoidColor);
    }
    color = avail.length > 0 ? avail[Math.floor(Math.random() * avail.length)] : randColor(numColors);
  } else {
    color = randColor(numColors);
    while (avoidColor !== null && color === avoidColor) {
      color = randColor(numColors);
    }
  }
  return { color, emoji: Math.random()<0.08?Math.floor(Math.random()*3):-1 };
}

function initGrid(level) {
  const grid = [];
  const { numColors, startRows } = getLevelParams(level);
  
  for (let r=0;r<ROWS;r++) {
    grid[r]=[];
    for (let c=0;c<COLS;c++) {
      grid[r][c] = r < startRows ? { color: randColor(numColors), emoji: Math.random()<0.1?Math.floor(Math.random()*3):-1 } : null;
    }
  }
  return grid;
}

function getBubblePos(row, col, W) {
  const OFFSET_X = (W - COLS*R*2)/2 + R;
  const OFFSET_Y = R + 5;
  const offset = row%2===0 ? 0 : R;
  return { x: OFFSET_X + col*R*2 + offset, y: OFFSET_Y + row*(R*2-4) };
}

function getNeighbors(r, c) {
  const even = r%2===0;
  const dirs = even
    ? [[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]]
    : [[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]];
  return dirs.map(([dr,dc])=>[r+dr,c+dc])
    .filter(([nr,nc])=>nr>=0&&nr<ROWS&&nc>=0&&nc<COLS);
}

function findConnected(grid) {
  const connected = new Set();
  const queue = [];
  for (let c=0;c<COLS;c++) {
    if (grid[0]&&grid[0][c]) {
      const key=`0,${c}`;
      connected.add(key); queue.push([0,c]);
    }
  }
  while (queue.length) {
    const [r,c]=queue.shift();
    getNeighbors(r,c).forEach(([nr,nc])=>{
      const key=`${nr},${nc}`;
      if (!connected.has(key)&&grid[nr]&&grid[nr][nc]) {
        connected.add(key); queue.push([nr,nc]);
      }
    });
  }
  return connected;
}

function findDetached(grid) {
  const connected = findConnected(grid);
  const detached = [];
  for (let r=0;r<ROWS;r++) {
    for (let c=0;c<COLS;c++) {
      if (grid[r]&&grid[r][c]&&!connected.has(`${r},${c}`)) {
        detached.push({r,c});
      }
    }
  }
  return detached;
}

export default function BubbleShooter() {
  const canvasRef = useRef(null);
  const playAgainBtnRef = useRef(null);
  const nextLevelBtnRef = useRef(null);

  const stateRef = useRef({
    level: 1,
    grid: null,
    currentBubble: null,
    nextBubble: null,
    flying: null,
    aimAngle: -Math.PI/2,
    particles: [],
    fallingBubbles: [],
    score: 0,
    shotsLeft: 35,
    gameRunning: true,
    gameOver: false,
    levelComplete: false
  });

  const [uiLevel, setUiLevel] = useState(1);
  const [uiScore, setUiScore] = useState(0);
  const [uiShots, setUiShots] = useState(35);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [btnFocused, setBtnFocused] = useState(false);
  const rafRef = useRef(null);

  const W = 480, H = 620;

  useEffect(() => {
    const s = stateRef.current;
    if (!s.grid) {
      s.grid = initGrid(s.level);
      s.shotsLeft = getLevelParams(s.level).shots;
      setUiShots(s.shotsLeft);
      s.currentBubble = newBubble(s.grid, null, s.level);
      s.nextBubble = newBubble(s.grid, s.currentBubble.color, s.level);
    }
  }, []);

  useEffect(() => {
    if ((gameOver || levelComplete) && (playAgainBtnRef.current || nextLevelBtnRef.current)) {
      setTimeout(() => {
        if (gameOver) playAgainBtnRef.current?.focus();
        if (levelComplete) nextLevelBtnRef.current?.focus();
        setBtnFocused(true);
      }, 100);
    }
  }, [gameOver, levelComplete]);

  // ─── Drawing helpers ─────────────────────────────────────────────────────────
  function drawBubble(ctx, x, y, colorIdx, emojiIdx, alpha=1, scale=1) {
    const color = COLORS[colorIdx];
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x,y); ctx.scale(scale,scale);
    ctx.beginPath(); ctx.arc(2,4,R,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.fill();
    const grad=ctx.createRadialGradient(-R*0.3,-R*0.3,R*0.05,0,0,R);
    grad.addColorStop(0,lighten(color,65));
    grad.addColorStop(0.45,color);
    grad.addColorStop(1,darken(color,45));
    ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2);
    ctx.fillStyle=grad; ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(-R*0.3,-R*0.3,R*0.27,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.fill();
    if (emojiIdx>=0) {
      ctx.font=`${R}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(EMOJI_LIST[emojiIdx],0,2);
    }
    ctx.restore();
  }

  function drawTree(ctx, x, y, scale) {
    ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
    ctx.fillStyle='#5a3010'; ctx.fillRect(-6,0,12,30);
    [0,-22,-42].forEach((yy,i)=>{
      ctx.fillStyle=i===0?'#236523':i===1?'#2d7a2d':'#3d8a3d';
      ctx.beginPath(); ctx.moveTo(0,yy-55); ctx.lineTo(-32+i*5,yy+12); ctx.lineTo(32-i*5,yy+12);
      ctx.closePath(); ctx.fill();
    });
    ctx.restore();
  }

  function drawBackground(ctx, currentLevel) {
    // 💥 UPGRADED: Dynamic sky themes based on level!
    const themes = [
      ['#1a0a2e', '#4a154b'], // Level 1 - Purple Dusk
      ['#0d0d2b', '#1a3a5c'], // Level 2 - Night
      ['#3b8d99', '#6b6b83'], // Level 3 - Gloomy Day
      ['#FF7E5F', '#FEB47B'], // Level 4 - Sunset
      ['#2E1437', '#943855']  // Level 5 - Twilight
    ];
    
    // Cycle through themes
    const skyColors = themes[(currentLevel - 1) % themes.length];
    
    const sky=ctx.createLinearGradient(0,0,0,H*0.62);
    sky.addColorStop(0, skyColors[0]); sky.addColorStop(1, skyColors[1]);
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,H*0.62);
    
    const gnd=ctx.createLinearGradient(0,H*0.62,0,H);
    gnd.addColorStop(0,'#2d6a2d'); gnd.addColorStop(1,'#1a3d1a');
    ctx.fillStyle=gnd; ctx.fillRect(0,H*0.62,W,H*0.38);
    
    [[100,H*0.62,175,H*0.38,250,H*0.62],[220,H*0.62,275,H*0.42,330,H*0.62]].forEach(pts=>{
      ctx.fillStyle='rgba(80,110,180,0.35)';
      ctx.beginPath(); ctx.moveTo(pts[0],pts[1]); ctx.lineTo(pts[2],pts[3]);
      ctx.lineTo(pts[4],pts[5]); ctx.closePath(); ctx.fill();
    });
    [[55,H*0.67,0.55],[115,H*0.71,0.38],[350,H*0.66,0.6],[415,H*0.7,0.42],[240,H*0.72,0.33]]
      .forEach(([x,y,s])=>drawTree(ctx,x,y,s));
    ctx.fillStyle='#7a5a14';
    ctx.beginPath(); ctx.ellipse(W/2,H,90,45,0,Math.PI,0); ctx.fill();
  }

  function drawAimLine(ctx, aimAngle, sx, sy) {
    ctx.save();
    ctx.setLineDash([10,10]);
    ctx.strokeStyle='rgba(220,200,0,0.8)'; ctx.lineWidth=2.5;
    ctx.shadowColor='#FFD700'; ctx.shadowBlur=6;
    ctx.beginPath(); ctx.moveTo(sx,sy);
    let bx=sx,by=sy,dx=Math.cos(aimAngle)*7,dy=Math.sin(aimAngle)*7;
    for (let i=0;i<90;i++){
      bx+=dx; by+=dy;
      if(bx<R){bx=R;dx=-dx;} else if(bx>W-R){bx=W-R;dx=-dx;}
      if(by<0) break;
      ctx.lineTo(bx,by);
    }
    ctx.stroke(); ctx.restore();
  }

  function spawnParticles(particles, x, y, color, count=10) {
    for(let i=0;i<count;i++){
      const angle=Math.random()*Math.PI*2, speed=Math.random()*4+1;
      particles.push({x,y,color,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
        size:Math.random()*6+3,life:30+Math.random()*20,maxLife:50});
    }
  }

  function findAndPop(grid, row, col, color, particles) {
    const visited=new Set(), stack=[[row,col]];
    while(stack.length){
      const [r,c]=stack.pop(), key=`${r},${c}`;
      if(visited.has(key)) continue;
      if(!grid[r]||!grid[r][c]||grid[r][c].color!==color) continue;
      visited.add(key);
      getNeighbors(r,c).forEach(([nr,nc])=>{
        if(grid[nr]&&grid[nr][nc]&&grid[nr][nc].color===color) stack.push([nr,nc]);
      });
    }
    if(visited.size>=3){
      visited.forEach(key=>{
        const [r,c]=key.split(',').map(Number);
        const pos=getBubblePos(r,c,W);
        spawnParticles(particles,pos.x,pos.y,color,8);
        grid[r][c]=null;
      });
      return visited.size;
    }
    return 0;
  }

  function dropDetached(grid, fallingBubbles) {
    const detached=findDetached(grid);
    detached.forEach(({r,c})=>{
      const pos=getBubblePos(r,c,W);
      fallingBubbles.push({
        x:pos.x, y:pos.y,
        vx:(Math.random()-0.5)*2,
        vy:-0.5,
        color:grid[r][c].color,
        emoji:grid[r][c].emoji,
        life:80
      });
      grid[r][c]=null;
    });
    return detached.length;
  }

  const handleRestart = useCallback((isNextLevel = false) => {
    const s = stateRef.current;
    
    if (isNextLevel) {
      s.level += 1;
    } else {
      s.level = 1;
      s.score = 0;
    }

    s.grid = initGrid(s.level); 
    s.currentBubble = newBubble(s.grid, null, s.level); 
    s.nextBubble = newBubble(s.grid, s.currentBubble.color, s.level);
    
    s.flying = null; s.aimAngle = -Math.PI/2; s.particles = []; s.fallingBubbles = [];
    s.shotsLeft = getLevelParams(s.level).shots; 
    s.gameRunning = true; s.gameOver = false; s.levelComplete = false;
    
    setUiLevel(s.level);
    setUiScore(s.score); 
    setUiShots(s.shotsLeft); 
    setGameOver(false); 
    setLevelComplete(false); 
    setProgress(0);
    setBtnFocused(false);
    
    setTimeout(()=>{ canvasRef.current?.focus(); }, 50);
  }, []);

  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas.getContext('2d');
    const sx=W/2, sy=H-75;

    function shoot(){
      const s=stateRef.current;
      if(s.flying||!s.gameRunning||!s.currentBubble) return;
      s.flying={x:sx,y:sy,dx:Math.cos(s.aimAngle)*13,dy:Math.sin(s.aimAngle)*13,
        color:s.currentBubble.color,emoji:s.currentBubble.emoji};
      s.shotsLeft--; 
      
      s.currentBubble=s.nextBubble; 
      // 💥 Note: This determines the new next bubble from what is CURRENTLY on the board.
      s.nextBubble=newBubble(s.grid, s.currentBubble.color, s.level);
      
      setUiShots(s.shotsLeft);
    }

    function landBubble(){
      const s=stateRef.current;
      if(!s.flying) return;
      let bestR=-1,bestC=-1,bestDist=Infinity;
      
      for(let r=0;r<ROWS;r++){
        if(!s.grid[r]) s.grid[r]=[];
        for(let c=0;c<COLS;c++){
          if(s.grid[r][c]) continue;
          const pos=getBubblePos(r,c,W);
          const dist=Math.hypot(s.flying.x-pos.x,s.flying.y-pos.y);
          if(dist<bestDist){bestDist=dist;bestR=r;bestC=c;}
        }
      }
      
      if(bestR<0){s.flying=null;return;}
      if(!s.grid[bestR]) s.grid[bestR]=[];
      s.grid[bestR][bestC]={color:s.flying.color,emoji:s.flying.emoji};
      spawnParticles(s.particles,s.flying.x,s.flying.y,s.flying.color,5);
      
      const popped=findAndPop(s.grid,bestR,bestC,s.flying.color,s.particles);
      s.flying=null;
      const dropped=dropDetached(s.grid,s.fallingBubbles);
      
      if(popped>=3){
        s.score+=popped*10+(dropped*5);
        setUiScore(s.score);
        setProgress(Math.min(100,(s.score % 500)/5)); 
      }

      const isEmpty = !s.grid.some(row => row && row.some(b => b !== null));
      const anyLow = s.grid.some((row,r)=>r>=10&&row&&row.some(b=>b));

      if(isEmpty) {
        s.gameRunning=false; s.levelComplete=true;
        setLevelComplete(true);
      } else if (anyLow || s.shotsLeft<=0) {
        s.gameRunning=false; s.gameOver=true;
        setGameOver(true);
      } 
      
      // 💥 Removed the glitchy code here! 
      // It will no longer force your current bubble to change colors mid-aim. 
      // If you clear a color entirely, you just have to shoot away any leftover ones in your cannon.
    }

    function updateFlying(){
      const s=stateRef.current;
      if(!s.flying) return;
      s.flying.x+=s.flying.dx; s.flying.y+=s.flying.dy;
      if(s.flying.x<R){s.flying.x=R;s.flying.dx=-s.flying.dx;}
      if(s.flying.x>W-R){s.flying.x=W-R;s.flying.dx=-s.flying.dx;}
      if(s.flying.y<R){landBubble();return;}
      for(let r=0;r<s.grid.length;r++){
        if(!s.grid[r]) continue;
        for(let c=0;c<COLS;c++){
          if(!s.grid[r][c]) continue;
          const pos=getBubblePos(r,c,W);
          if(Math.hypot(s.flying.x-pos.x,s.flying.y-pos.y)<R*1.85){landBubble();return;}
        }
      }
    }

    function updateFalling(){
      const s=stateRef.current;
      s.fallingBubbles=s.fallingBubbles.filter(fb=>fb.life>0&&fb.y<H+60);
      s.fallingBubbles.forEach(fb=>{
        fb.x+=fb.vx; fb.y+=fb.vy;
        fb.vy+=0.5;
        fb.life--;
      });
    }

    function loop(){
      const s=stateRef.current;
      ctx.clearRect(0,0,W,H);
      
      // Pass the current level so the background changes
      drawBackground(ctx, s.level);
      
      if(!s.flying&&s.gameRunning) drawAimLine(ctx,s.aimAngle,sx,sy);
      if(s.grid) {
        for(let r=0;r<s.grid.length;r++){
          if(!s.grid[r]) continue;
          for(let c=0;c<COLS;c++){
            const b=s.grid[r][c];
            if(b){const pos=getBubblePos(r,c,W);drawBubble(ctx,pos.x,pos.y,b.color,b.emoji);}
          }
        }
      }
      s.fallingBubbles.forEach(fb=>{
        drawBubble(ctx,fb.x,fb.y,fb.color,fb.emoji,Math.min(1,fb.life/40));
      });
      if(s.flying) drawBubble(ctx,s.flying.x,s.flying.y,s.flying.color,s.flying.emoji);
      s.particles=s.particles.filter(p=>p.life>0);
      s.particles.forEach(p=>{
        ctx.save(); ctx.globalAlpha=p.life/p.maxLife;
        ctx.fillStyle=COLORS[p.color];
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size*(p.life/p.maxLife),0,Math.PI*2); ctx.fill();
        ctx.restore();
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.2; p.life--;
      });
      const sg=ctx.createRadialGradient(sx,sy,5,sx,sy,30);
      sg.addColorStop(0,'#6a4500'); sg.addColorStop(1,'#2a1a00');
      ctx.beginPath(); ctx.arc(sx,sy,30,0,Math.PI*2);
      ctx.fillStyle=sg; ctx.fill();
      ctx.strokeStyle='#d4922a'; ctx.lineWidth=3; ctx.stroke();
      
      if(s.currentBubble) drawBubble(ctx,sx,sy,s.currentBubble.color,s.currentBubble.emoji);
      if(s.nextBubble){
        ctx.save(); ctx.font='10px sans-serif'; ctx.fillStyle='rgba(255,255,255,0.6)';
        ctx.textAlign='center'; ctx.fillText('NEXT',sx+62,sy+5); ctx.restore();
        drawBubble(ctx,sx+62,sy,s.nextBubble.color,s.nextBubble.emoji,0.9,0.72);
      }
      const bg2=ctx.createRadialGradient(sx,H-30,4,sx,H-30,20);
      bg2.addColorStop(0,'#5a3a00'); bg2.addColorStop(1,'#2a1a00');
      ctx.beginPath(); ctx.arc(sx,H-30,20,0,Math.PI*2);
      ctx.fillStyle=bg2; ctx.fill(); ctx.strokeStyle='#d4922a'; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle='#FFD700'; ctx.font='bold 13px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(s.shotsLeft,sx,H-30);
      ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font='10px sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='alphabetic';
      ctx.fillText('← → Aim  |  OK/Enter Shoot  |  ↑ Swap',W/2,H-8);
      if(s.gameRunning){updateFlying();updateFalling();}
      rafRef.current=requestAnimationFrame(loop);
    }

    rafRef.current=requestAnimationFrame(loop);

    const handleKey=(e)=>{
      const s=stateRef.current;

      if(s.gameOver || s.levelComplete){
        if(e.key==='Enter'||e.key===' '||e.key==='Return'||e.key==='Accept'){
          e.preventDefault();
          if (s.levelComplete) nextLevelBtnRef.current?.click();
          else playAgainBtnRef.current?.click();
        }
        return; 
      }

      if(!s.gameRunning) return;
      const step=0.06;
      if(e.key==='ArrowLeft'){s.aimAngle=Math.max(s.aimAngle-step,-Math.PI+0.12);e.preventDefault();}
      if(e.key==='ArrowRight'){s.aimAngle=Math.min(s.aimAngle+step,-0.12);e.preventDefault();}
      
      if(e.key==='ArrowUp' || e.key==='ArrowDown'){
        [s.currentBubble,s.nextBubble]=[s.nextBubble,s.currentBubble];
        e.preventDefault();
      }
      
      if(e.key==='Enter' || e.key===' ' || e.key==='Accept' || e.key==='Return'){
        shoot();
        e.preventDefault();
      }
    };

    const handleMouseMove=(e)=>{
      const s=stateRef.current; if(!s.gameRunning||s.flying) return;
      const rect=canvas.getBoundingClientRect();
      const scaleX=W/rect.width,scaleY=H/rect.height;
      const mx=(e.clientX-rect.left)*scaleX,my=(e.clientY-rect.top)*scaleY;
      let angle=Math.atan2(my-sy,mx-sx);
      s.aimAngle=Math.max(-Math.PI+0.12,Math.min(-0.12,angle));
    };

    const handleClick=()=>{if(stateRef.current.gameRunning) shoot();};

    window.addEventListener('keydown',handleKey);
    canvas.addEventListener('mousemove',handleMouseMove);
    canvas.addEventListener('click',handleClick);
    return ()=>{
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown',handleKey);
      canvas.removeEventListener('mousemove',handleMouseMove);
      canvas.removeEventListener('click',handleClick);
    };
  },[handleRestart]);

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const st={
    page:{
      display:'flex',gap:20,alignItems:'center',justifyContent:'center',
      minHeight:'100vh',background:'#1a0a2e',fontFamily:"'Fredoka One',cursive"
    },
    leftPanel:{display:'flex',flexDirection:'column',gap:14,alignItems:'center'},
    iconBtn:{
      width:54,height:54,borderRadius:'50%',
      background:'radial-gradient(circle at 35% 35%,#b8763a,#7a4a1a)',
      border:'3px solid #d4922a',display:'flex',alignItems:'center',
      justifyContent:'center',fontSize:22,cursor:'pointer',
      boxShadow:'0 4px 14px rgba(0,0,0,0.5)',userSelect:'none'
    },
    canvasWrap:{position:'relative'},
    canvas:{
      border:'4px solid #8B4513',borderRadius:10,
      boxShadow:'0 0 40px rgba(255,130,40,0.35)',cursor:'crosshair',
      display:'block',maxWidth:'100%',outline:'none'
    },
    rightPanel:{display:'flex',flexDirection:'column',alignItems:'center',gap:14},
    infoBox:{
      background:'linear-gradient(135deg,#c0392b,#7b241c)',border:'2px solid #e74c3c',
      borderRadius:22,padding:'7px 18px',color:'white',fontSize:15,
      display:'flex',alignItems:'center',gap:7,
      boxShadow:'0 4px 12px rgba(0,0,0,0.4)',whiteSpace:'nowrap'
    },
    boosterIcon:{
      width:54,height:54,borderRadius:'50%',
      background:'radial-gradient(circle,#fff 15%,#ff6600 55%,#cc3300 100%)',
      border:'3px solid #ffaa44',display:'flex',alignItems:'center',
      justifyContent:'center',fontSize:24,boxShadow:'0 0 18px rgba(255,120,0,0.65)'
    },
    progressWrap:{
      width:30,height:180,background:'linear-gradient(to bottom,#4a2800,#2a1400)',
      border:'3px solid #8B5a2B',borderRadius:15,overflow:'hidden',position:'relative',
      boxShadow:'inset 0 0 10px rgba(0,0,0,0.5)'
    },
    progressFill:{
      position:'absolute',bottom:0,width:'100%',
      background:'linear-gradient(to top,#f39c12,#f1c40f)',
      borderRadius:'0 0 12px 12px',transition:'height 0.3s'
    },
    scoreBox:{
      background:'linear-gradient(135deg,#3a2200,#6a4200)',border:'2px solid #d4922a',
      borderRadius:22,padding:'6px 16px',color:'#FFD700',fontSize:16,
      display:'flex',alignItems:'center',gap:7,boxShadow:'0 2px 10px rgba(0,0,0,0.4)'
    },
    powerBtn:{
      width:54,height:54,borderRadius:'50%',
      background:'radial-gradient(circle at 35% 35%,#e74c3c,#7b241c)',
      border:'3px solid #ff6b6b',display:'flex',alignItems:'center',
      justifyContent:'center',fontSize:22,cursor:'pointer',
      boxShadow:'0 4px 14px rgba(0,0,0,0.5)'
    },
    overlay:{
      position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
      background:'rgba(10,5,30,0.95)',border:'3px solid #f39c12',borderRadius:22,
      padding:'36px 48px',textAlign:'center',color:'white',zIndex:10,
      boxShadow:'0 0 60px rgba(243,156,18,0.5)',minWidth:260
    },
    actionBtn:(focused, isSuccess)=>({
      background: focused
        ? (isSuccess ? 'linear-gradient(135deg,#2ecc71,#27ae60)' : 'linear-gradient(135deg,#ffe040,#f39c12)')
        : (isSuccess ? 'linear-gradient(135deg,#27ae60,#1e8449)' : 'linear-gradient(135deg,#f39c12,#d68910)'),
      border: focused ? '4px solid #fff' : '4px solid transparent',
      borderRadius:30,padding:'13px 38px',color:'white',fontSize:20,
      fontFamily:"'Fredoka One',cursive",cursor:'pointer',
      boxShadow: focused
        ? (isSuccess ? '0 0 0 4px #27ae60, 0 0 30px #2ecc71, 0 4px 14px rgba(0,0,0,0.4)' : '0 0 0 4px #f39c12, 0 0 30px #ffe040, 0 4px 14px rgba(0,0,0,0.4)')
        : '0 4px 14px rgba(0,0,0,0.4)',
      marginTop:16,
      outline:'none',
      transform: focused ? 'scale(1.07)' : 'scale(1)',
      transition:'all 0.15s ease',
      display:'block', width:'100%',
    }),
  };

  return (
    <div style={st.page}>
      {/* Left panel */}
      <div style={st.leftPanel}>
        <div style={st.iconBtn}>🎵</div>
      </div>

      {/* Canvas */}
      <div style={st.canvasWrap}>
        <canvas ref={canvasRef} width={W} height={H} style={st.canvas} tabIndex={0} />

        {/* Level Complete Overlay */}
        {levelComplete && (
          <div style={st.overlay}>
            <div style={{fontSize:44,marginBottom:4}}>🏆</div>
            <h2 style={{fontSize:34,color:'#2ecc71',margin:'0 0 8px'}}>Level {uiLevel} Cleared!</h2>
            <p style={{fontSize:22,color:'#FFD700',margin:'0 0 4px'}}>Score: {uiScore}</p>
            <button
              ref={nextLevelBtnRef}
              style={st.actionBtn(btnFocused, true)}
              onClick={() => handleRestart(true)}
              onFocus={()=>setBtnFocused(true)}
              onBlur={()=>setBtnFocused(false)}
            >
              ▶ Next Level
            </button>
          </div>
        )}

        {/* Game Over overlay */}
        {gameOver && (
          <div style={st.overlay}>
            <div style={{fontSize:44,marginBottom:4}}>🎯</div>
            <h2 style={{fontSize:34,color:'#f39c12',margin:'0 0 8px'}}>Game Over!</h2>
            <p style={{fontSize:16,color:'rgba(255,255,255,0.7)',margin:'0 0 2px'}}>Reached Level: {uiLevel}</p>
            <p style={{fontSize:22,color:'#FFD700',margin:'0 0 4px'}}>Final Score: {uiScore}</p>
            <button
              ref={playAgainBtnRef}
              style={st.actionBtn(btnFocused, false)}
              onClick={() => handleRestart(false)}
              onFocus={()=>setBtnFocused(true)}
              onBlur={()=>setBtnFocused(false)}
            >
              ▶ Play Again
            </button>
          </div>
        )}
      </div>

      {/* Right panel */}
      <div style={st.rightPanel}>
        <div style={{...st.infoBox, background:'linear-gradient(135deg,#8e44ad,#5b2c6f)', border:'2px solid #9b59b6'}}>
           🌟 Level {uiLevel}
        </div>
        <div style={st.boosterIcon}>🌈</div>
        <div style={{fontSize:24}}>⭐</div>
        <div style={st.progressWrap}>
          <div style={{...st.progressFill,height:`${progress}%`}}/>
        </div>
        <div style={st.scoreBox}>🏆 {uiScore}</div>
        <div style={st.powerBtn} onClick={() => handleRestart(false)}>⏻</div>
      </div>
    </div>
  );
}