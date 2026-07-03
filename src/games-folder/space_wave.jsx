import { useState, useEffect, useRef, useCallback } from "react";

const LEVELS = [
  { name:"1",  diff:"easy",    emoji:"😊", color:"#22c55e", speed:2.0, gapH:220, wallFreq:0.018, length:4000 },
  { name:"2",  diff:"easy",    emoji:"😄", color:"#22c55e", speed:2.2, gapH:210, wallFreq:0.020, length:4200 },
  { name:"3",  diff:"easy",    emoji:"🙂", color:"#22c55e", speed:2.4, gapH:200, wallFreq:0.022, length:4400 },
  { name:"4",  diff:"easy",    emoji:"😎", color:"#22c55e", speed:2.6, gapH:195, wallFreq:0.024, length:4600 },
  { name:"5",  diff:"easy",    emoji:"🤔", color:"#22c55e", speed:2.8, gapH:190, wallFreq:0.026, length:4800 },
  { name:"6",  diff:"medium",  emoji:"😤", color:"#f59e0b", speed:3.0, gapH:180, wallFreq:0.028, length:5000 },
  { name:"7",  diff:"medium",  emoji:"😠", color:"#f59e0b", speed:3.2, gapH:175, wallFreq:0.030, length:5200 },
  { name:"8",  diff:"medium",  emoji:"😡", color:"#f59e0b", speed:3.4, gapH:170, wallFreq:0.032, length:5400 },
  { name:"9",  diff:"medium",  emoji:"🤬", color:"#f59e0b", speed:3.6, gapH:165, wallFreq:0.034, length:5600 },
  { name:"10", diff:"medium",  emoji:"😰", color:"#f59e0b", speed:3.8, gapH:160, wallFreq:0.036, length:5800 },
  { name:"11", diff:"hard",    emoji:"💀", color:"#ef4444", speed:4.2, gapH:155, wallFreq:0.038, length:6000 },
  { name:"12", diff:"hard",    emoji:"😱", color:"#ef4444", speed:4.5, gapH:150, wallFreq:0.040, length:6200 },
  { name:"13", diff:"hard",    emoji:"🔥", color:"#ef4444", speed:4.8, gapH:145, wallFreq:0.042, length:6500 },
  { name:"14", diff:"hard",    emoji:"⚡", color:"#ef4444", speed:5.0, gapH:140, wallFreq:0.044, length:6800 },
  { name:"15", diff:"hard",    emoji:"🌊", color:"#ef4444", speed:5.2, gapH:136, wallFreq:0.046, length:7000 },
  { name:"16", diff:"extreme", emoji:"👾", color:"#a855f7", speed:5.5, gapH:130, wallFreq:0.050, length:7500 },
  { name:"17", diff:"extreme", emoji:"🎃", color:"#a855f7", speed:6.0, gapH:125, wallFreq:0.054, length:8000 },
  { name:"18", diff:"extreme", emoji:"🤯", color:"#a855f7", speed:6.5, gapH:120, wallFreq:0.058, length:8500 },
];

const DIFF_STYLES = {
  easy:    { border: "#22c55e55", color: "#4ade80", glow: "#22c55e" },
  medium:  { border: "#f59e0b55", color: "#fbbf24", glow: "#f59e0b" },
  hard:    { border: "#ef444455", color: "#f87171", glow: "#ef4444" },
  extreme: { border: "#a855f755", color: "#c084fc", glow: "#a855f7" },
};

let seed = 0;
function rng() {
  seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;
  return (seed >>> 0) / 4294967296;
}

function buildLevel(cfg, W, H) {
  seed = LEVELS.findIndex((l) => l.name === cfg.name) * 9999 + 1;
  const GAP = cfg.gapH, WW = 28;
  const obs = [];
  
  // Added a large buffer zone at the beginning of the level
  let x = W * 1.2 + 200, cy = H * 0.5; 
  
  while (x < cfg.length + W) {
    cy = Math.max(GAP / 2 + 60, Math.min(H - GAP / 2 - 60, cy + (rng() - 0.5) * 38));
    const topY = cy - GAP / 2, botY = cy + GAP / 2;
    obs.push({ type: "wall", x, y: 0,    w: WW, h: topY });
    obs.push({ type: "wall", x, y: botY, w: WW, h: H - botY });
    if (rng() < cfg.wallFreq * 2) {
      obs.push({ type: "cog", x: x + WW / 2, y: topY + GAP * (0.2 + rng() * 0.6), r: 18 + rng() * 10, angle: 0, spd: (rng() > 0.5 ? 1 : -1) * (0.02 + rng() * 0.03) });
    }
    if (rng() < cfg.wallFreq * 1.5) obs.push({ type: "spike", x: x + 4, y: topY - 16, w: 20, h: 22, dir: "down" });
    if (rng() < cfg.wallFreq * 1.5) obs.push({ type: "spike", x: x + 4, y: botY,      w: 20, h: 22, dir: "up" });
    x += WW + 2 + rng() * 4;
  }
  obs.push({ type: "portal", x: cfg.length - 60, y: H / 2, r: 36 });
  const stars = Array.from({ length: 120 }, () => ({
    x: rng() * W * 4, y: rng() * H,
    r: rng() * 1.8 + 0.3, spd: rng() * 0.3 + 0.1, alpha: rng() * 0.7 + 0.3,
  }));
  return { obs, stars };
}

function drawArrow(ctx, x, y, w, h, vy) {
  const a = Math.atan2(vy * 0.8, 8);
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  ctx.shadowColor = "#00f5ff"; ctx.shadowBlur = 18;
  const g = ctx.createLinearGradient(-w, 0, w, 0);
  g.addColorStop(0, "#0088cc"); g.addColorStop(1, "#00f5ff");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(w, 0); ctx.lineTo(-w*0.5,-h/2); ctx.lineTo(-w*0.2,0); ctx.lineTo(-w*0.5,h/2); ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.5)";
  ctx.beginPath(); ctx.moveTo(w*0.6,0); ctx.lineTo(-w*0.1,-h*0.22); ctx.lineTo(0,0); ctx.lineTo(-w*0.1,h*0.22); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawCog(ctx, x, y, r, angle, color) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.fillStyle = color + "22";
  ctx.shadowColor = color; ctx.shadowBlur = 10;
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, rad = i % 2 === 0 ? r : r * 0.72;
    i === 0 ? ctx.moveTo(Math.cos(a)*rad, Math.sin(a)*rad) : ctx.lineTo(Math.cos(a)*rad, Math.sin(a)*rad);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,0,r*0.3,0,Math.PI*2); ctx.fillStyle=color+"55"; ctx.fill(); ctx.strokeStyle=color; ctx.stroke();
  ctx.restore();
}

function drawSpike(ctx, x, y, w, h, dir, color) {
  ctx.save(); ctx.fillStyle = color + "cc"; ctx.shadowColor = color; ctx.shadowBlur = 8;
  ctx.beginPath();
  if (dir === "down") { ctx.moveTo(x,y); ctx.lineTo(x+w/2,y+h); ctx.lineTo(x+w,y); }
  else { ctx.moveTo(x,y+h); ctx.lineTo(x+w/2,y); ctx.lineTo(x+w,y+h); }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawPortal(ctx, x, y, r) {
  const t = Date.now() * 0.003;
  ctx.save(); ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 30;
  for (let i = 3; i >= 0; i--) {
    const g = ctx.createRadialGradient(x,y,0,x,y,r-i*6);
    g.addColorStop(0, `rgba(74,222,128,${0.15-i*0.03})`); g.addColorStop(1,"rgba(74,222,128,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r-i*3+Math.sin(t+i)*4,0,Math.PI*2); ctx.fill();
  }
  ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(x,y,r+Math.sin(t)*4,0,Math.PI*2); ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = t+(i/6)*Math.PI*2, ir = r*0.55;
    ctx.fillStyle = "#4ade80"; ctx.beginPath(); ctx.arc(x+Math.cos(a)*ir,y+Math.sin(a)*ir,3,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

export default function SpaceWaves() {
  const canvasRef = useRef(null);
  const rootRef   = useRef(null);
  const gs = useRef({
    screen: "menu", lvl: 0, attempts: 0,
    held: false, vy: 0, scrollX: 0,
    player: null, obs: [], stars: [], particles: [],
    cfg: LEVELS[0], animId: null,
  });
  const [ui, setUi] = useState({ screen: "menu", lvl: 0, progress: 0, attempts: 0 });
  const selRef = useRef(0);

  const cW = () => rootRef.current ? rootRef.current.clientWidth  : window.innerWidth;
  const cH = () => rootRef.current ? rootRef.current.clientHeight : window.innerHeight;

  const initLvl = useCallback(() => {
    const s = gs.current;
    s.cfg = LEVELS[s.lvl];
    const { obs, stars } = buildLevel(s.cfg, cW(), cH());
    s.obs = obs; s.stars = stars; s.particles = [];
    s.scrollX = 0; s.vy = 0;
    s.player = { x: cW() * 0.18, y: cH() * 0.5, w: 22, h: 14 };
  }, []);

  const startGame = useCallback((idx) => {
    const s = gs.current;
    s.lvl = idx; selRef.current = idx;
    s.attempts++; s.screen = "playing"; s.held = false;
    initLvl();
    setUi({ screen: "playing", lvl: idx, progress: 0, attempts: s.attempts });
  }, [initLvl]);

  const retry = useCallback(() => {
    const s = gs.current;
    s.attempts++; s.screen = "playing"; s.held = false;
    initLvl();
    setUi((u) => ({ ...u, screen: "playing", attempts: s.attempts, progress: 0 }));
  }, [initLvl]);

  const nextLvl = useCallback(() => {
    const s = gs.current;
    s.attempts = 0;
    startGame(Math.min(s.lvl + 1, LEVELS.length - 1));
  }, [startGame]);

  const toMenu = useCallback(() => {
    gs.current.screen = "menu";
    setUi((u) => ({ ...u, screen: "menu" }));
  }, []);

  const [focusedBtn, setFocusedBtn] = useState(0);

  useEffect(() => {
    const kd = (e) => {
      const screen = gs.current.screen;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Enter"," "].includes(e.key)) {
        if (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
      }

      if (screen === "playing") {
        if ([" ", "w", "W", "ArrowUp"].includes(e.key)) gs.current.held = true;
        if (e.key.toLowerCase() === "p") {
          gs.current.screen = "paused";
          setUi((u) => ({ ...u, screen: "paused" }));
        }
        return;
      }

      if (screen === "paused") {
        if (e.key.toLowerCase() === "p") {
          gs.current.screen = "playing";
          setUi((u) => ({ ...u, screen: "playing" }));
        }
        return;
      }

      if (screen === "menu") {
        if (e.key === "ArrowRight") {
          const next = Math.min(selRef.current + 1, LEVELS.length - 1);
          selRef.current = next; gs.current.lvl = next;
          setUi(u => ({ ...u }));
        }
        if (e.key === "ArrowLeft") {
          const prev = Math.max(selRef.current - 1, 0);
          selRef.current = prev; gs.current.lvl = prev;
          setUi(u => ({ ...u }));
        }
        if (e.key === "Enter") startGame(selRef.current);
        return;
      }

      if (screen === "dead") {
        if (e.key === "ArrowLeft"  || e.key === "ArrowRight") setFocusedBtn(b => b === 0 ? 1 : 0);
        if (e.key === "Enter") {
          setFocusedBtn(b => { if (b === 0) retry(); else toMenu(); return b; });
        }
        return;
      }

      if (screen === "win") {
        if (e.key === "ArrowLeft"  || e.key === "ArrowRight") setFocusedBtn(b => b === 0 ? 1 : 0);
        if (e.key === "Enter") {
          setFocusedBtn(b => {
            const lvl = gs.current.lvl;
            if (b === 0 && lvl < LEVELS.length - 1) nextLvl();
            else toMenu();
            return b;
          });
        }
        return;
      }
    };

    const ku = (e) => {
      if ([" ", "w", "W", "ArrowUp"].includes(e.key)) gs.current.held = false;
    };

    window.addEventListener("keydown", kd);
    window.addEventListener("keyup",   ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup",   ku);
    };
  }, [startGame, retry, toMenu, nextLvl]);

  useEffect(() => {
    const fn = () => {
      canvasRef.current.width  = cW();
      canvasRef.current.height = cH();
      if (gs.current.screen === "playing") initLvl();
    };
    window.addEventListener("resize", fn);
    setTimeout(() => {
      canvasRef.current.width  = cW();
      canvasRef.current.height = cH();
    }, 0);
    return () => window.removeEventListener("resize", fn);
  }, [initLvl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Softened Physics for a gentler float
    const G = 0.22, L = -0.28, MV = 6;

    function loop() {
      const s = gs.current;
      const W = canvas.width, H = canvas.height;

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      const hue = 210 + s.lvl * 8;
      bg.addColorStop(0, `hsl(${hue},60%,4%)`); bg.addColorStop(1, `hsl(${hue+30},50%,2%)`);
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      for (const st of s.stars) {
        const sx = ((st.x - s.scrollX * st.spd) % (W * 4) + W * 4) % (W * 4);
        if (sx > W + 4) continue;
        ctx.save(); ctx.globalAlpha = st.alpha; ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(sx, st.y, st.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }

      if (s.screen === "playing") {
        s.vy += s.held ? L : G;
        s.vy = Math.max(-MV, Math.min(MV, s.vy));
        s.player.y += s.vy; s.scrollX += s.cfg.speed;

        if (Math.random() < 0.4) s.particles.push({
          x: s.player.x - 6, y: s.player.y + (Math.random() - 0.5) * 6,
          vx: -(Math.random() * 2 + 1), vy: (Math.random() - 0.5) * 1.5,
          life: 1, color: s.cfg.color,
        });
        s.particles = s.particles.filter((p) => { p.x += p.vx; p.y += p.vy; p.life -= 0.06; return p.life > 0; });

        for (const o of s.obs) {
          const ox = o.x - s.scrollX;
          if (ox > W + 100 || ox + (o.w || 80) < -100) continue;
          if (o.type === "wall") {
            const wg = ctx.createLinearGradient(ox, 0, ox + o.w, 0);
            wg.addColorStop(0, "#0a1a3a"); wg.addColorStop(1, "#152856");
            ctx.fillStyle = wg; ctx.fillRect(ox, o.y, o.w, o.h);
            ctx.strokeStyle = s.cfg.color + "66"; ctx.lineWidth = 1.5;
            ctx.beginPath();
            if (o.y === 0) { ctx.moveTo(ox, o.h); ctx.lineTo(ox + o.w, o.h); }
            else { ctx.moveTo(ox, o.y); ctx.lineTo(ox + o.w, o.y); }
            ctx.stroke();
          }
          if (o.type === "cog") { o.angle += o.spd; drawCog(ctx, ox, o.y, o.r, o.angle, s.cfg.color); }
          if (o.type === "spike") drawSpike(ctx, ox, o.y, o.w, o.h, o.dir, s.cfg.color);
          if (o.type === "portal") drawPortal(ctx, ox, o.y, o.r);
        }

        for (const p of s.particles) {
          ctx.save(); ctx.globalAlpha = p.life * 0.8; ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.life * 3.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }

        drawArrow(ctx, s.player.x, s.player.y, s.player.w, s.player.h, s.vy);

        const px = s.player.x, py = s.player.y, pw = s.player.w / 2, ph = s.player.h / 2;
        let hit = false, won = false;
        if (py - ph < 0 || py + ph > H) hit = true;
        if (!hit) {
          for (const o of s.obs) {
            const ox = o.x - s.scrollX;
            if (ox > px + pw + 60 || ox + (o.w || 80) < px - pw - 20) continue;
            if (o.type === "wall" && px+pw>ox && px-pw<ox+o.w && py+ph>o.y && py-ph<o.y+o.h) { hit=true; break; }
            if (o.type === "spike" && px+pw>ox+4 && px-pw<ox+o.w-4 && py+ph>o.y && py-ph<o.y+o.h) { hit=true; break; }
            if (o.type === "cog") { const dx=px-ox,dy=py-o.y; if(Math.sqrt(dx*dx+dy*dy)<o.r+10){hit=true;break;} }
            if (o.type === "portal") { const dx=px-ox,dy=py-o.y; if(Math.sqrt(dx*dx+dy*dy)<o.r+8){won=true;break;} }
          }
        }

        const prog = Math.floor(Math.min(1, s.scrollX / (s.cfg.length - W)) * 100);
        if (won) { s.screen="win"; setUi({ screen:"win", lvl:s.lvl, progress:100, attempts:s.attempts }); }
        else if (hit) { s.screen="dead"; setUi({ screen:"dead", lvl:s.lvl, progress:prog, attempts:s.attempts }); }
        else setUi({ screen:"playing", lvl:s.lvl, progress:prog, attempts:s.attempts });
      }
      
      if (s.screen === "paused") {
        for (const o of s.obs) {
          const ox = o.x - s.scrollX;
          if (ox > W + 100 || ox + (o.w || 80) < -100) continue;
          if (o.type === "wall") {
            ctx.fillStyle = "#152856"; ctx.fillRect(ox, o.y, o.w, o.h);
          }
          if (o.type === "cog") drawCog(ctx, ox, o.y, o.r, o.angle, s.cfg.color);
          if (o.type === "spike") drawSpike(ctx, ox, o.y, o.w, o.h, o.dir, s.cfg.color);
          if (o.type === "portal") drawPortal(ctx, ox, o.y, o.r);
        }
        drawArrow(ctx, s.player.x, s.player.y, s.player.w, s.player.h, s.vy);

        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 40px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText("PAUSED", W / 2, H / 2);
        ctx.font = "16px Orbitron";
        ctx.fillStyle = "#aaa";
        ctx.fillText("PRESS 'P' TO RESUME", W / 2, H / 2 + 40);
      }

      s.animId = requestAnimationFrame(loop);
    }

    gs.current.animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gs.current.animId);
  }, []);

  const s = ui;

  const btnStyle = (color, focused) => ({
    padding: "14px 36px", fontFamily: "Orbitron, sans-serif", fontSize: 13,
    fontWeight: 700, letterSpacing: 3, borderRadius: 8,
    background: focused ? color : "#1a1a2e",
    border: `2px solid ${color}`, color: focused ? "#000" : color,
    boxShadow: focused ? `0 0 24px ${color}` : "none",
    transform: focused ? "scale(1.1)" : "scale(1)",
    transition: "all 0.15s", outline: "none", cursor: "default",
  });

  const overlayStyle = {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 16,
  };

  const handlePress = () => { if (gs.current.screen === "playing") gs.current.held = true; };
  const handleRelease = () => { gs.current.held = false; };

  return (
    <div 
      ref={rootRef} 
      onMouseDown={handlePress} 
      onMouseUp={handleRelease} 
      onMouseLeave={handleRelease} 
      onTouchStart={handlePress} 
      onTouchEnd={handleRelease} 
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#000", fontFamily: "'Orbitron', sans-serif", userSelect: "none" }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

      {/* ── PLAYING HUD ── */}
      {(s.screen === "playing" || s.screen === "paused") && (
        <>
          <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 24, pointerEvents: "none" }}>
            {[["LEVEL", LEVELS[s.lvl]?.name], ["PROGRESS", s.progress + "%"], ["ATTEMPTS", s.attempts]].map(([l, v]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ color: "#7af", fontSize: 9, letterSpacing: 2 }}>{l}</div>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, background: LEVELS[s.lvl]?.color, width: s.progress + "%", transition: "width 0.1s", boxShadow: `0 0 8px ${LEVELS[s.lvl]?.color}` }} />
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: 2, pointerEvents: "none", textAlign: "center", lineHeight: "1.5" }}>
            HOLD MOUSE/SPACE TO FLY UP · RELEASE TO GLIDE DOWN <br/> PRESS 'P' TO PAUSE
          </div>
        </>
      )}

      {/* ── MENU ── */}
      {s.screen === "menu" && (
        <div style={overlayStyle}>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: 6, color: "#fff", textShadow: "0 0 30px #7af" }}>SPACE WAVES</div>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#7af" }}>DODGE · SURVIVE · CONQUER</div>

          {/* Level grid */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, maxWidth: 560, padding: "0 16px" }}>
            {LEVELS.map((l, i) => {
              const ds = DIFF_STYLES[l.diff];
              const selected = selRef.current === i;
              return (
                <div key={i} style={{
                  width: 52, height: 52, borderRadius: 8, background: "#0d1117",
                  border: `2px solid ${selected ? ds.glow : ds.border}`,
                  color: ds.color,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                  transform: selected ? "scale(1.15)" : "scale(1)", transition: "all 0.15s",
                  boxShadow: selected ? `0 0 18px ${ds.glow}` : "none",
                }}>
                  <span style={{ fontSize: 18 }}>{l.emoji}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>{l.name}</span>
                </div>
              );
            })}
          </div>

          {/* Launch button */}
          <div style={{ marginTop: 8, padding: "14px 52px", fontFamily: "inherit", fontSize: 14, fontWeight: 700, letterSpacing: 4, borderRadius: 8, background: "#4ade80", border: "2px solid #4ade80", color: "#000", boxShadow: "0 0 24px #4ade80", transition: "all 0.15s" }}>
            PRESS ENTER TO LAUNCH
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>
            ◄ ► to select level
          </div>
        </div>
      )}

      {/* ── DEAD ── */}
      {s.screen === "dead" && (
        <div style={overlayStyle}>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#f87171", textShadow: "0 0 30px #f87171" }}>CRASHED</div>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#aaa", marginBottom: 8 }}>YOU HIT AN OBSTACLE</div>
          <div style={{ display: "flex", gap: 20 }}>
            <div style={btnStyle("#f87171", focusedBtn === 0)}>RETRY</div>
            <div style={btnStyle("#7af",    focusedBtn === 1)}>MENU</div>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginTop: 4 }}>
            ◄ ► to choose  ·  ENTER to confirm
          </div>
        </div>
      )}

      {/* ── WIN ── */}
      {s.screen === "win" && (
        <div style={overlayStyle}>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#4ade80", textShadow: "0 0 30px #4ade80" }}>CLEARED!</div>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#aaa", marginBottom: 8 }}>
            {s.lvl < LEVELS.length - 1 ? `LEVEL ${LEVELS[s.lvl]?.name} COMPLETE!` : "ALL LEVELS CLEARED! 🏆"}
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {s.lvl < LEVELS.length - 1 && <div style={btnStyle("#4ade80", focusedBtn === 0)}>NEXT LEVEL</div>}
            <div style={btnStyle("#7af", s.lvl < LEVELS.length - 1 ? focusedBtn === 1 : focusedBtn === 0)}>MENU</div>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginTop: 4 }}>
            ◄ ► to choose  ·  ENTER to confirm
          </div>
        </div>
      )}
    </div>
  );
}