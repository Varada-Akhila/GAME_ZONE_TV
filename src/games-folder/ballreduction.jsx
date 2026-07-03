import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Perfected Layout Engine ─────────────────────────────────────────────────
function getLayout() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const COLS = 7;
  const ROWS = 10; 
  
  // UI chrome
  const HUD_H  = Math.max(40, Math.round(vh * 0.06));
  const BTN_H  = Math.max(60, Math.round(vh * 0.10));
  const HINT_H = Math.max(20, Math.round(vh * 0.03));
  const availH = vh - HUD_H - BTN_H - HINT_H - 10; 

  const maxCellW = Math.min(vw * 0.95, 500) / COLS; 
  const maxCellH = availH / (ROWS + 1.5); 
  const CELL = Math.floor(Math.min(maxCellW, maxCellH));

  const W = CELL * COLS;
  const H = availH;

  const BALL_R     = Math.round(CELL * 0.42);
  const PROJ_R     = Math.max(4, Math.round(CELL * 0.12));
  
  // SLOWED DOWN: Projectile speed reduced from 0.22 to 0.15
  const PROJ_SPEED = Math.max(4, Math.round(CELL * 0.15)); 
  
  const PLAY_TOP   = CELL * 0.8;
  const PLAY_BOT   = H - (CELL * 0.5);
  const SHOOTER_Y  = PLAY_BOT - Math.round(CELL * 0.2);
  const SHOOTER_X  = W / 2;

  return { COLS, ROWS, CELL, W, H, BALL_R, PROJ_R, PROJ_SPEED,
           PLAY_TOP, PLAY_BOT, SHOOTER_Y, SHOOTER_X,
           HUD_H, BTN_H, HINT_H };
}

const AIM_MIN = -Math.PI + 0.08, AIM_MAX = -0.08, AIM_STEP = 0.035;

// SLOWED DOWN: Delay between shots increased from 110ms to 160ms
const SHOOT_INTERVAL = 160; 
let _uid = 1;
const uid = () => _uid++;

function hpColor(hp, maxHp) {
  const r = hp / Math.max(maxHp, 1);
  if (r > 0.66) return { bg:"#e74c3c", border:"#ff6b6b", text:"#fff" };
  if (r > 0.33) return { bg:"#e67e22", border:"#f39c12", text:"#fff" };
  return { bg:"#c0392b", border:"#e74c3c", text:"#ffe" };
}

function makeRow(turn, COLS) {
  const row = [];
  for (let c = 0; c < COLS; c++) {
    if (Math.random() < 0.72) {
      const hp = Math.max(1, Math.floor(turn * (0.7 + Math.random() * 0.8)));
      row.push({ id: uid(), col: c, hp, maxHp: hp });
    } else row.push(null);
  }
  if (row.every(c => c === null)) {
    const c = Math.floor(Math.random() * COLS);
    row[c] = { id: uid(), col: c, hp: Math.max(1, turn), maxHp: Math.max(1, turn) };
  }
  return row;
}

function makeBonuses(existingCols, COLS) {
  const free = [];
  for (let c = 0; c < COLS; c++) if (!existingCols.has(c)) free.push(c);
  if (free.length > 0 && Math.random() < 0.65) {
    const c = free[Math.floor(Math.random() * free.length)];
    return [{ id: uid(), col: c }];
  }
  return [];
}

function initGrid(COLS) {
  const rows = [];
  for (let r = 0; r < 3; r++) {
    const row = makeRow(Math.max(1, r), COLS);
    row.forEach(b => b && (b.row = r));
    rows.push(...row.filter(Boolean));
  }
  return rows;
}

export default function NeonBlaster() {
  const [layout, setLayout] = useState(getLayout);
  const layoutRef = useRef(layout);

  useEffect(() => {
    const onResize = () => {
      const l = getLayout();
      layoutRef.current = l;
      setLayout(l);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { COLS, CELL, W, H, BALL_R, PROJ_R,
          PLAY_TOP, PLAY_BOT, SHOOTER_Y, SHOOTER_X,
          HUD_H, BTN_H, HINT_H } = layout;

  const [phase, setPhase] = useState("start");
  const [turn, setTurn] = useState(1);
  const [ammo, setAmmo] = useState(1);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState(() => initGrid(layout.COLS));
  const [bonuses, setBonuses] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [particles, setParticles] = useState([]);
  const [aimAngle, setAimAngle] = useState(-Math.PI / 2);
  const [shooterX, setShooterX] = useState(SHOOTER_X);
  const [nextShooterX, setNextShooterX] = useState(SHOOTER_X);
  const [floatingTexts, setFloatingTexts] = useState([]);

  const rafRef = useRef();
  const lastRef = useRef(null);
  const phaseRef = useRef(phase);
  const projRef = useRef([]);
  const gridRef = useRef(grid);
  const bonusRef = useRef([]);
  const particleRef = useRef([]);
  const shooterXRef = useRef(SHOOTER_X);
  const nextShooterXRef = useRef(nextShooterX);
  const ammoRef = useRef(1);
  const scoreRef = useRef(0);
  const turnRef = useRef(1);
  const floatRef = useRef([]);
  const aimAngleRef = useRef(-Math.PI / 2);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { projRef.current = projectiles; }, [projectiles]);
  useEffect(() => { gridRef.current = grid; }, [grid]);
  useEffect(() => { bonusRef.current = bonuses; }, [bonuses]);
  useEffect(() => { particleRef.current = particles; }, [particles]);
  useEffect(() => { shooterXRef.current = shooterX; }, [shooterX]);
  useEffect(() => { nextShooterXRef.current = nextShooterX; }, [nextShooterX]);
  useEffect(() => { ammoRef.current = ammo; }, [ammo]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { turnRef.current = turn; }, [turn]);
  useEffect(() => { floatRef.current = floatingTexts; }, [floatingTexts]);
  useEffect(() => { aimAngleRef.current = aimAngle; }, [aimAngle]);

  const spawnParticles = useCallback((x, y) => {
    const ps = Array.from({ length: 8 }, () => ({
      id: uid(), x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 5 - 1,
      life: 1, r: 3 + Math.random() * 4,
      color: ["#ff6b35","#ffd93d","#ff4757","#ff6348"][Math.floor(Math.random()*4)],
    }));
    particleRef.current = [...particleRef.current, ...ps];
    setParticles([...particleRef.current]);
  }, []);

  const addFloat = useCallback((x, y, text) => {
    const ft = { id: uid(), x, y, text, life: 1 };
    floatRef.current = [...floatRef.current, ft];
    setFloatingTexts([...floatRef.current]);
  }, []);

  const endTurn = useCallback(() => {
    const L = layoutRef.current;
    const newTurn = turnRef.current + 1;
    setTurn(newTurn);
    setShooterX(nextShooterXRef.current);
    shooterXRef.current = nextShooterXRef.current;

    const descended = gridRef.current.map(b => ({ ...b, row: b.row + 1 }));
    if (descended.some(b => b.row >= L.ROWS - 1)) {
      setGrid(descended);
      setPhase("gameover");
      phaseRef.current = "gameover";
      return;
    }

    const newRowBlocks = makeRow(newTurn, L.COLS);
    newRowBlocks.forEach(b => b && (b.row = 0));
    const added = newRowBlocks.filter(Boolean);

    const descendedBonuses = bonusRef.current
      .filter(b => !b.collected)
      .map(b => ({ ...b, row: b.row + 1 }))
      .filter(b => b.row < L.ROWS);

    const occupiedCols = new Set(added.map(b => b.col));
    const newBonuses = makeBonuses(occupiedCols, L.COLS).map(b => ({ ...b, row: 0 }));

    gridRef.current = [...descended, ...added];
    bonusRef.current = [...descendedBonuses, ...newBonuses];
    setGrid(gridRef.current);
    setBonuses(bonusRef.current);
    setPhase("aim");
    phaseRef.current = "aim";
  }, []);

  const fireShots = useCallback((angle) => {
    if (phaseRef.current !== "aim") return;
    const L = layoutRef.current;
    setPhase("shooting");
    phaseRef.current = "shooting";
    const vx = Math.cos(angle) * L.PROJ_SPEED;
    const vy = Math.sin(angle) * L.PROJ_SPEED;
    const count = ammoRef.current;
    
    const launch = (i) => {
      if (i >= count) return;
      const p = { id: uid(), x: shooterXRef.current, y: L.SHOOTER_Y, vx, vy, done: false, cooldowns: {} };
      projRef.current = [...projRef.current, p];
      setProjectiles([...projRef.current]);
      if (i + 1 < count) setTimeout(() => launch(i + 1), SHOOT_INTERVAL);
    };
    launch(0);
  }, []);

  // ─── Keyboard & Remote Inputs ────────────────────────────────────────────────
  useEffect(() => {
    const held = { left: false, right: false };
    let rafId = null;
    const loop = () => {
      if (!held.left && !held.right) { rafId = null; return; }
      if (phaseRef.current === "aim") {
        setAimAngle(prev => {
          const next = held.left ? Math.max(AIM_MIN, prev - AIM_STEP) : Math.min(AIM_MAX, prev + AIM_STEP);
          aimAngleRef.current = next;
          return next;
        });
      }
      rafId = requestAnimationFrame(loop);
    };
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft")  { e.preventDefault(); if (!held.left)  { held.left  = true; if (!rafId) rafId = requestAnimationFrame(loop); } }
      if (e.key === "ArrowRight") { e.preventDefault(); if (!held.right) { held.right = true; if (!rafId) rafId = requestAnimationFrame(loop); } }
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowUp") { e.preventDefault(); fireShots(aimAngleRef.current); }
    };
    const onKeyUp = (e) => {
      if (e.key === "ArrowLeft")  held.left  = false;
      if (e.key === "ArrowRight") held.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [fireShots]);

  // ─── Core Game Physics Loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "shooting") return;
    const L = layoutRef.current;

    const loop = (ts) => {
      if (lastRef.current === null) lastRef.current = ts;
      lastRef.current = ts;

      const alreadyGranted = projRef.current.some(p => p.grantedBonus);
      let firstLandThisFrame = false;

      let projs = [...projRef.current];
      let currentGrid = [...gridRef.current];
      let scoreGain = 0;
      let bonusCollected = false;
      const currentBonuses = [...bonusRef.current];

      projs = projs.map(p => {
        if (p.done) return p;
        let { x, y, vx, vy, cooldowns = {} } = p;
        const cd = {};
        for (const [k, v] of Object.entries(cooldowns)) { if (v > 1) cd[k] = v - 1; }

        x += vx; y += vy;

        if (x - L.PROJ_R < 0)    { x = L.PROJ_R; vx = Math.abs(vx); }
        if (x + L.PROJ_R > L.W)  { x = L.W - L.PROJ_R; vx = -Math.abs(vx); }
        if (y - L.PROJ_R < L.PLAY_TOP) { y = L.PLAY_TOP + L.PROJ_R; vy = Math.abs(vy); }
        
        if (y + L.PROJ_R >= L.PLAY_BOT) {
          const isFirst = !alreadyGranted && !firstLandThisFrame;
          if (isFirst) firstLandThisFrame = true;
          return { ...p, x, y: L.PLAY_BOT - L.PROJ_R, done: true, landX: x, grantedBonus: isFirst };
        }

        for (let i = 0; i < currentGrid.length; i++) {
          const b = currentGrid[i];
          if (!b) continue;
          const key = String(b.id);
          if (cd[key]) continue;
          
          const bx = b.col * L.CELL + L.CELL / 2;
          const by = L.PLAY_TOP + b.row * L.CELL + L.CELL / 2;
          const dx = x - bx, dy = y - by;
          const dist = Math.sqrt(dx*dx + dy*dy) || 0.001;
          const minDist = L.PROJ_R + L.BALL_R;
          
          if (dist < minDist) {
            const nx = dx/dist, ny = dy/dist;
            x += nx * (minDist - dist + 1.5);
            y += ny * (minDist - dist + 1.5);
            const dot = vx*nx + vy*ny;
            if (dot < 0) { vx -= 2*dot*nx; vy -= 2*dot*ny; }
            cd[key] = 8; 
            
            const newHp = b.hp - 1;
            scoreGain += 5;
            if (newHp <= 0) {
              spawnParticles(bx, by);
              addFloat(bx, by - L.CELL * 0.35, "+" + (b.maxHp * 10));
              scoreGain += b.maxHp * 10;
              currentGrid[i] = null;
            } else {
              currentGrid[i] = { ...b, hp: newHp };
            }
            break;
          }
        }

        for (let i = 0; i < currentBonuses.length; i++) {
          const bon = currentBonuses[i];
          if (bon.collected) continue;
          const bx = bon.col * L.CELL + L.CELL / 2;
          const by = L.PLAY_TOP + bon.row * L.CELL + L.CELL / 2;
          if (Math.sqrt((x-bx)**2 + (y-by)**2) < L.PROJ_R + L.CELL * 0.18) {
            currentBonuses[i] = { ...bon, collected: true };
            ammoRef.current += 1;
            setAmmo(ammoRef.current);
            addFloat(bx, by - L.CELL * 0.35, "+1 BALL");
            bonusCollected = true;
          }
        }
        return { ...p, x, y, vx, vy, cooldowns: cd };
      });

      if (firstLandThisFrame) {
        ammoRef.current += 1;
        setAmmo(ammoRef.current);
        addFloat(shooterXRef.current, L.SHOOTER_Y - L.CELL * 0.5, "+1 BALL");
      }

      currentGrid = currentGrid.filter(Boolean);
      if (scoreGain > 0) { scoreRef.current += scoreGain; setScore(scoreRef.current); }
      if (bonusCollected) { bonusRef.current = currentBonuses; setBonuses([...currentBonuses]); }
      
      gridRef.current = currentGrid;
      setGrid([...currentGrid]);

      particleRef.current = particleRef.current
        .map(p => ({ ...p, x: p.x+p.vx, y: p.y+p.vy, vy: p.vy+0.2, life: p.life-0.035 }))
        .filter(p => p.life > 0);
      setParticles([...particleRef.current]);

      floatRef.current = floatRef.current
        .map(f => ({ ...f, y: f.y-1.5, life: f.life-0.025 }))
        .filter(f => f.life > 0);
      setFloatingTexts([...floatRef.current]);

      projRef.current = projs;
      setProjectiles([...projs]);

      if (projs.length > 0 && projs.every(p => p.done)) {
        const firstLand = projs.find(p => p.landX !== undefined);
        if (firstLand) {
          nextShooterXRef.current = Math.max(L.PROJ_R+2, Math.min(L.W-L.PROJ_R-2, firstLand.landX));
          setNextShooterX(nextShooterXRef.current);
        }
        projRef.current = [];
        setProjectiles([]);
        lastRef.current = null;
        endTurn();
        return;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, spawnParticles, addFloat, endTurn]);

  const svgRef = useRef();
  const getAngle = (clientX, clientY) => {
    const L = layoutRef.current;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = (clientX - rect.left) * (L.W / rect.width);
    const my = (clientY - rect.top) * (L.H / rect.height);
    const angle = Math.atan2(my - L.SHOOTER_Y, mx - shooterXRef.current);
    if (angle > AIM_MAX || angle < AIM_MIN) return null;
    return angle;
  };

  const guideDots = [];
  if (phase === "aim") {
    let x = shooterX, y = SHOOTER_Y;
    let vx = Math.cos(aimAngle), vy = Math.sin(aimAngle);
    const step = CELL * 0.22;
    for (let i = 0; i < 26; i++) {
      x += vx * step; y += vy * step;
      if (x - 3 < 0) { x = 3; vx = Math.abs(vx); }
      if (x + 3 > W) { x = W - 3; vx = -Math.abs(vx); }
      if (y - 3 < PLAY_TOP) { y = PLAY_TOP + 3; vy = Math.abs(vy); }
      if (y + 3 >= PLAY_BOT) break;
      guideDots.push({ x, y, i });
    }
  }

  const blockX = col => col * CELL + CELL / 2;
  const blockY = row => PLAY_TOP + row * CELL + CELL / 2;
  const isShooting = phase === "shooting";
  const fontSize = { big: Math.max(14, CELL * 0.38), mid: Math.max(11, CELL * 0.28), sm: Math.max(9, CELL * 0.22) };

  const resetGame = useCallback(() => {
    _uid = 1;
    const L = layoutRef.current;
    const g = initGrid(L.COLS);
    gridRef.current = g; bonusRef.current = []; projRef.current = [];
    ammoRef.current = 1; scoreRef.current = 0; turnRef.current = 1;
    aimAngleRef.current = -Math.PI / 2;
    setPhase("aim"); setTurn(1); setAmmo(1); setScore(0);
    setShooterX(L.SHOOTER_X); setNextShooterX(L.SHOOTER_X);
    setProjectiles([]); setParticles([]); setFloatingTexts([]);
    setBonuses([]); setGrid(g); setAimAngle(-Math.PI / 2);
  }, []);

  useEffect(() => {
    if (phase !== "start" && phase !== "gameover") return;
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault(); 
        if (phase === "start") setPhase("aim");
        if (phase === "gameover") resetGame();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, resetGame]);

  if (phase === "start") {
    return (
      <div style={{ width:"100vw", height:"100vh", background:"#0d0d1a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Rajdhani',sans-serif", overflow:"hidden" }}>
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet"/>
        <div style={{ textAlign:"center", color:"#fff", padding:"20px", width:"100%", maxWidth:"600px" }}>
          
          {/* TITLE FIX: Cleaner font handling, no overlaps, new name */}
          <div style={{ fontFamily:"'Orbitron', sans-serif", fontSize:"clamp(28px, 6vw, 54px)", fontWeight:900, background:"linear-gradient(135deg,#ff6b35,#ffd93d)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:2, marginBottom:"15px", lineHeight: 1.2 }}>
            NEON BLASTER
          </div>

          <div style={{ color:"#555", fontSize:"18px", marginBottom:"30px", letterSpacing:3 }}>BREAK · BOUNCE · SURVIVE</div>
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"25px", marginBottom:"30px", textAlign:"left", fontSize:"16px", color:"#aaa", lineHeight:2.2 }}>
            🎯 Aim & shoot numbered balls upward<br/>
            🔴 Each hit reduces the ball's number<br/>
            💥 Reach 0 to destroy the ball<br/>
            ⚪ Collect white circles for extra ammo<br/>
            ⚠️ Don't let balls reach the bottom!<br/>
            <span style={{ color:"#ffd93d" }}>◀ ▶ Arrow keys to aim · OK / Enter to fire</span>
          </div>
          <button autoFocus onClick={() => setPhase("aim")}
            style={{ background:"linear-gradient(135deg,#ff6b35,#ffd93d)", border:"none", borderRadius:"50px", padding:"16px 60px", fontFamily:"'Orbitron'", fontSize:"24px", fontWeight:700, color:"#0d0d1a", cursor:"pointer", letterSpacing:3, boxShadow:"0 4px 40px rgba(255,107,53,0.55)", outline:"none" }}>
            ▶ START
          </button>
        </div>
      </div>
    );
  }

  if (phase === "gameover") {
    return (
      <div style={{ width:"100vw", height:"100vh", background:"#0d0d1a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Rajdhani',sans-serif", overflow:"hidden" }}>
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet"/>
        <div style={{ textAlign:"center", color:"#fff" }}>
          <div style={{ fontFamily:"'Orbitron'", fontSize:"60px", color:"#ff4757", fontWeight:900, marginBottom:"10px" }}>GAME OVER</div>
          <div style={{ color:"#555", marginBottom:"10px", fontSize:"20px", letterSpacing:2 }}>SURVIVED {turn - 1} TURNS</div>
          <div style={{ fontFamily:"'Orbitron'", fontSize:"80px", color:"#ffd93d", fontWeight:900, marginBottom:"40px" }}>{score}</div>
          <button autoFocus onClick={resetGame}
            style={{ background:"linear-gradient(135deg,#ff6b35,#ffd93d)", border:"none", borderRadius:"50px", padding:"16px 60px", fontFamily:"'Orbitron'", fontSize:"24px", fontWeight:700, color:"#0d0d1a", cursor:"pointer", letterSpacing:3, boxShadow:"0 4px 40px rgba(255,107,53,0.55)", outline:"none" }}>
            ▶ PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  const btnSize = Math.max(52, BTN_H * 0.82);
  const fireBtnW = btnSize * 1.8;

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#0d0d1a", display:"flex", justifyContent:"center", fontFamily:"'Rajdhani',sans-serif", userSelect:"none", overflow:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet"/>
      
      <div style={{ width: W, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
        
        {/* ── HUD ── */}
        <div style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 15px", height:HUD_H, flexShrink:0 }}>
          <div style={{ fontFamily:"'Orbitron'", color:"#ffd93d", fontWeight:700, fontSize:Math.max(14, HUD_H*0.38) }}>{String(score).padStart(7,"0")}</div>
          <div style={{ color:"#444", fontSize:Math.max(10, HUD_H*0.26), fontFamily:"'Orbitron'", letterSpacing:2 }}>TURN {turn}</div>
          <div style={{ background:"rgba(255,107,53,0.15)", border:"1.5px solid #ff6b35", borderRadius:99, padding:`2px ${Math.round(HUD_H*0.3)}px`, fontFamily:"'Orbitron'", color:"#ff6b35", fontWeight:700, fontSize:Math.max(12, HUD_H*0.32) }}>×{ammo}</div>
        </div>

        {/* ── Game SVG ── */}
        <svg ref={svgRef} width="100%" height={H} viewBox={`0 0 ${W} ${H}`}
          style={{ background:"linear-gradient(180deg,#12121f 0%,#0d0d1a 100%)", borderRadius:Math.round(CELL*0.18), cursor:phase==="aim"?"crosshair":"default", touchAction:"none", boxShadow:"0 0 60px rgba(255,71,87,0.1), inset 0 0 60px rgba(0,0,0,0.4)", display:"block", flexShrink:0 }}
          onMouseMove={e => { if(phase==="aim"){ const a=getAngle(e.clientX,e.clientY); if(a!==null){ setAimAngle(a); aimAngleRef.current=a; }}}}
          onMouseUp={e => { if(phase==="aim"){ const a=getAngle(e.clientX,e.clientY); if(a!==null) fireShots(a); }}}
          onTouchMove={e => { e.preventDefault(); if(phase==="aim"){ const a=getAngle(e.touches[0].clientX,e.touches[0].clientY); if(a!==null){ setAimAngle(a); aimAngleRef.current=a; }}}}
          onTouchEnd={e => { e.preventDefault(); if(phase==="aim"){ const t=e.changedTouches[0]; const a=getAngle(t.clientX,t.clientY); if(a!==null) fireShots(a); }}}
        >
          {Array.from({length:COLS+1},(_,i)=>(<line key={`v${i}`} x1={i*CELL} y1={PLAY_TOP} x2={i*CELL} y2={PLAY_BOT} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>))}
          {Array.from({length:11},(_,i)=>(<line key={`h${i}`} x1={0} y1={PLAY_TOP+i*CELL} x2={W} y2={PLAY_TOP+i*CELL} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>))}
          <line x1={0} y1={PLAY_TOP+(layout.ROWS-1)*CELL} x2={W} y2={PLAY_TOP+(layout.ROWS-1)*CELL} stroke="rgba(255,71,87,0.25)" strokeWidth="1.5" strokeDasharray="6,4"/>

          {grid.map(b => {
            const cx=blockX(b.col), cy=blockY(b.row), col=hpColor(b.hp,b.maxHp), ratio=b.hp/b.maxHp;
            const fs = b.hp>=100 ? fontSize.sm : b.hp>=10 ? fontSize.mid : fontSize.big;
            return (
              <g key={b.id}>
                <circle cx={cx} cy={cy} r={BALL_R} fill={col.bg} stroke={col.border} strokeWidth={Math.max(1.5, CELL*0.035)} style={{filter:`drop-shadow(0 0 ${CELL*0.1}px ${col.border}66)`}}/>
                <circle cx={cx} cy={cy} r={BALL_R - CELL*0.055} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={CELL*0.05}/>
                <circle cx={cx} cy={cy} r={BALL_R - CELL*0.055} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={CELL*0.05}
                  strokeDasharray={`${ratio*2*Math.PI*(BALL_R-CELL*0.055)} 999`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
                <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" fill={col.text} fontSize={fs} fontWeight="700" fontFamily="'Orbitron',monospace" style={{pointerEvents:"none"}}>{b.hp}</text>
              </g>
            );
          })}

          {bonuses.filter(b=>!b.collected).map(b => {
            const cx=blockX(b.col), cy=blockY(b.row);
            return (
              <g key={b.id}>
                <circle cx={cx} cy={cy} r={CELL*0.18} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.85)" strokeWidth={CELL*0.04} style={{filter:`drop-shadow(0 0 ${CELL*0.1}px rgba(255,255,255,0.6))`}}/>
                <circle cx={cx} cy={cy} r={CELL*0.07} fill="rgba(255,255,255,0.9)"/>
              </g>
            );
          })}

          {particles.map(p=>(<circle key={p.id} cx={p.x} cy={p.y} r={p.r*p.life} fill={p.color} opacity={p.life*0.9}/>))}
          {floatingTexts.map(f=>(<text key={f.id} x={f.x} y={f.y} textAnchor="middle" fill="#ffd93d" fontSize={Math.max(11,CELL*0.24)} fontWeight="700" fontFamily="'Orbitron',monospace" opacity={f.life}>{f.text}</text>))}
          {guideDots.map((d,i)=>(<circle key={i} cx={d.x} cy={d.y} r={Math.max(2, CELL*0.06 - i*0.1)} fill="rgba(255,220,100,0.75)" opacity={(26-d.i)/26}/>))}

          {projectiles.filter(p=>!p.done).map(p=>(
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r={PROJ_R} fill="#ffd93d" style={{filter:`drop-shadow(0 0 ${PROJ_R*0.8}px rgba(255,217,61,0.9))`}}/>
              <circle cx={p.x} cy={p.y} r={PROJ_R*0.6} fill="rgba(255,255,255,0.4)"/>
            </g>
          ))}

          <circle cx={shooterX} cy={SHOOTER_Y} r={CELL*0.25} fill="rgba(255,107,53,0.15)" stroke="#ff6b35" strokeWidth={Math.max(2, CELL*0.04)}/>
          <circle cx={shooterX} cy={SHOOTER_Y} r={CELL*0.11} fill="#ff6b35" style={{filter:`drop-shadow(0 0 ${CELL*0.14}px rgba(255,107,53,0.9))`}}/>

          {phase==="aim" && (
            <line x1={shooterX} y1={SHOOTER_Y}
              x2={shooterX + Math.cos(aimAngle)*CELL*0.46}
              y2={SHOOTER_Y + Math.sin(aimAngle)*CELL*0.46}
              stroke="#ff6b35" strokeWidth={Math.max(2, CELL*0.05)} strokeLinecap="round"/>
          )}

          <line x1={0} y1={PLAY_BOT} x2={W} y2={PLAY_BOT} stroke="rgba(255,107,53,0.4)" strokeWidth="1.5"/>
          <rect x={0} y={0} width={W} height={PLAY_TOP} fill="rgba(13,13,26,0.95)"/>
          <text x={W/2} y={PLAY_TOP*0.58} textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize={Math.max(9,PLAY_TOP*0.28)} fontFamily="'Orbitron'" letterSpacing={3}>
            {isShooting ? "● SHOOTING" : "● AIM & FIRE"}
          </text>
        </svg>

        {/* ── Arrow + Fire Buttons ── */}
        <div style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:`0 ${Math.round(W*0.06)}px`, height:BTN_H, flexShrink:0 }}>
          <button
            onPointerDown={() => { if(!isShooting){ setAimAngle(a => { const n=Math.max(AIM_MIN,a-AIM_STEP*2); aimAngleRef.current=n; return n; }); }}}
            style={{ width:btnSize, height:btnSize, borderRadius:"50%", background:isShooting?"rgba(255,107,53,0.05)":"rgba(255,107,53,0.18)", border:`${Math.max(2,btnSize*0.04)}px solid ${isShooting?"rgba(255,107,53,0.2)":"#ff6b35"}`, color:isShooting?"rgba(255,107,53,0.25)":"#ff6b35", fontSize:Math.round(btnSize*0.42), fontWeight:900, cursor:isShooting?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:isShooting?"none":`0 0 ${btnSize*0.25}px rgba(255,107,53,0.35)`, transition:"all 0.15s", flexShrink:0 }}>◀</button>

          <button
            onPointerDown={() => { if(!isShooting) fireShots(aimAngleRef.current); }}
            style={{ width:fireBtnW, height:btnSize, borderRadius:btnSize*0.5, background:isShooting?"rgba(255,255,255,0.04)":"linear-gradient(135deg,#ff6b35,#ffd93d)", border:isShooting?"2px solid rgba(255,255,255,0.08)":"none", color:isShooting?"#333":"#0d0d1a", fontFamily:"'Orbitron'", fontSize:Math.round(btnSize*0.26), fontWeight:700, cursor:isShooting?"default":"pointer", letterSpacing:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:2, boxShadow:isShooting?"none":`0 0 ${btnSize*0.4}px rgba(255,107,53,0.5)`, transition:"all 0.15s", flexShrink:0 }}>
            <span style={{fontSize:Math.round(btnSize*0.36), lineHeight:1}}>🔥</span>
            <span>FIRE</span>
          </button>

          <button
            onPointerDown={() => { if(!isShooting){ setAimAngle(a => { const n=Math.min(AIM_MAX,a+AIM_STEP*2); aimAngleRef.current=n; return n; }); }}}
            style={{ width:btnSize, height:btnSize, borderRadius:"50%", background:isShooting?"rgba(255,107,53,0.05)":"rgba(255,107,53,0.18)", border:`${Math.max(2,btnSize*0.04)}px solid ${isShooting?"rgba(255,107,53,0.2)":"#ff6b35"}`, color:isShooting?"rgba(255,107,53,0.25)":"#ff6b35", fontSize:Math.round(btnSize*0.42), fontWeight:900, cursor:isShooting?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:isShooting?"none":`0 0 ${btnSize*0.25}px rgba(255,107,53,0.35)`, transition:"all 0.15s", flexShrink:0 }}>▶</button>
        </div>

        {/* ── Hint ── */}
        <div style={{ color:"#252535", fontSize:Math.max(10, HINT_H*0.5), fontFamily:"'Rajdhani'", letterSpacing:2, height:HINT_H, display:"flex", alignItems:"center", flexShrink:0 }}>
          ◀ ▶ ARROW KEYS TO AIM · ENTER TO FIRE
        </div>
      </div>
    </div>
  );
}