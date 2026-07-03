import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   MATH QUEST — Endless TV Edition
   - Starts at Level 1
   - 3 Lives (Survival Mode)
   - Levels up every 5 correct answers (dynamic difficulty)
═══════════════════════════════════════════════════════════ */

const OPS = ["add", "sub", "mul", "div", "mixed"];
const OP_META = {
  add:   { label:"Addition",       sym:"+",  emoji:"🌈", color:"#FF6B6B", glow:"#FF6B6B55", dark:"#C0392B" },
  sub:   { label:"Subtraction",    sym:"−",  emoji:"⚡", color:"#FFD93D", glow:"#FFD93D55", dark:"#B7950B" },
  mul:   { label:"Multiply",       sym:"×",  emoji:"🔥", color:"#6BCB77", glow:"#6BCB7755", dark:"#1E8449" },
  div:   { label:"Division",       sym:"÷",  emoji:"💎", color:"#4D96FF", glow:"#4D96FF55", dark:"#1A5276" },
  mixed: { label:"Mixed Ops",      sym:"∞",  emoji:"🎯", color:"#C77DFF", glow:"#C77DFF55", dark:"#7B2FBE" },
};

const OP_COLORS = { "+":"#FF6B6B", "−":"#FFD93D", "×":"#6BCB77", "÷":"#4D96FF" };

// Dynamic Level Generator (Scales Infinitely)
const getLevelConfig = (lvl) => ({
  name: `Level ${lvl}`,
  tag: lvl < 3 ? "🐣" : lvl < 6 ? "🦊" : lvl < 10 ? "🦁" : "🐉",
  max: 10 + (lvl - 1) * 5,       // Numbers get bigger (10, 15, 20...)
  mulMax: 5 + (lvl - 1) * 2,     // Multipliers grow slower (5, 7, 9...)
  time: Math.max(4, 18 - (lvl - 1) * 1.5), // Timer shrinks down to 4s minimum
  pts: 10 * lvl,                 // More points for higher levels
  mixedOps: Math.min(4, 2 + Math.floor((lvl - 1) / 3)), // Max 4 operators in mixed
});

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

/* ─────────────────────────────────────────────────────────
   QUESTION BUILDERS
───────────────────────────────────────────────────────── */
function buildSingleQ(op, level) {
  const c = getLevelConfig(level);
  let a, b, ans;
  if (op === "add") { a = rand(1,c.max); b = rand(1,c.max); ans = a+b; }
  else if (op === "sub") { a = rand(2,c.max); b = rand(1,a); ans = a-b; }
  else if (op === "mul") { a = rand(1,c.mulMax); b = rand(1,c.mulMax); ans = a*b; }
  else { b = rand(1,c.mulMax); a = b*rand(1,c.mulMax); ans = a/b; }
  const w = new Set();
  while (w.size < 3) {
    const d = rand(1, Math.max(3, Math.ceil(Math.abs(ans)*0.4)));
    const v = Math.random()<0.5 ? ans+d : ans-d;
    if (v >= 0 && v !== ans) w.add(v);
  }
  const opSym = op==="add"?"+" : op==="sub"?"−" : op==="mul"?"×" : "÷";
  return {
    expression: [{ num: a, sym: null }, { sym: opSym, num: b }],
    ans,
    choices: [...w, ans].sort(() => Math.random()-0.5),
    isMixed: false,
  };
}

function buildMixedQ(level) {
  const c = getLevelConfig(level);
  const numOps = c.mixedOps;
  const SYMS = ["+","−","×","÷"];

  let attempts = 0;
  while (attempts < 200) {
    attempts++;
    const ops = Array.from({length: numOps}, () => SYMS[rand(0,3)]);
    const nums = [rand(1, c.max)];
    let valid = true;
    
    for (let i = 0; i < numOps; i++) {
      const op = ops[i];
      if (op === "÷") {
        const divisors = [2,3,4,5,6];
        let found = false;
        for (const d of divisors.sort(()=>Math.random()-0.5)) {
          if (nums[nums.length-1] > 0 && nums[nums.length-1] % d === 0) {
            nums.push(d); found = true; break;
          }
        }
        if (!found) { valid = false; break; }
      } else if (op === "×") {
        nums.push(rand(1, Math.min(c.mulMax, 5)));
      } else {
        nums.push(rand(1, c.max));
      }
    }
    if (!valid) continue;

    const jsExpr = nums.reduce((acc, n, i) => {
      if (i === 0) return String(n);
      const o = ops[i-1];
      const jsOp = o==="÷"?"/" : o==="×"?"*" : o==="−"?"-" : "+";
      return acc + jsOp + n;
    }, "");

    let ans;
    try { ans = Function('"use strict"; return (' + jsExpr + ')')(); } catch { continue; }
    if (!Number.isInteger(ans) || ans <= 0 || ans > 500) continue;

    const expression = nums.map((n, i) => ({ num: n, sym: i === 0 ? null : ops[i-1] }));
    const w = new Set();
    let tries = 0;
    while (w.size < 3 && tries < 200) {
      tries++;
      const d = rand(1, Math.max(4, Math.ceil(ans * 0.3)));
      const v = Math.random()<0.5 ? ans+d : ans-d;
      if (v > 0 && Number.isInteger(v) && v !== ans) w.add(v);
    }
    if (w.size < 3) continue;

    return {
      expression, ans, choices: [...w, ans].sort(() => Math.random()-0.5),
      isMixed: true, jsExpr, 
    };
  }
  return buildSingleQ("add", level);
}

function buildQ(op, level) {
  if (op === "mixed") return buildMixedQ(level);
  return buildSingleQ(op, level);
}

/* ─── UI Components ─── */
function ExprDisplay({ expression, metaColor, isMixed }) {
  const numSize   = isMixed ? "clamp(28px,3.8vw,58px)" : "clamp(42px,6vw,88px)";
  const symSize   = isMixed ? "clamp(24px,3.2vw,48px)" : "clamp(38px,5.5vw,78px)";
  const eqSize    = isMixed ? "clamp(22px,3vw,44px)"  : "clamp(36px,5vw,72px)";
  const qSize     = isMixed ? "clamp(22px,3vw,44px)"  : "clamp(36px,5vw,72px)";

  return (
    <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:"clamp(4px,0.8vw,12px)", marginBottom:"clamp(10px,1.6vh,24px)", fontFamily:"'Fredoka One',cursive", fontWeight:900, lineHeight:1 }}>
      {expression.map((part, i) => (
        <span key={i} style={{ display:"flex", alignItems:"center", gap:"clamp(4px,0.6vw,10px)" }}>
          {part.sym && <span style={{ fontSize:symSize, color:OP_COLORS[part.sym]||metaColor, textShadow:`0 0 18px ${OP_COLORS[part.sym]||metaColor}`, margin:"0 clamp(2px,0.4vw,6px)" }}>{part.sym}</span>}
          <span style={{ fontSize:numSize, color:"#fff" }}>{part.num}</span>
        </span>
      ))}
      <span style={{ fontSize:eqSize, color:"#444", margin:"0 clamp(4px,0.5vw,8px)" }}>=</span>
      <span style={{ fontSize:qSize, color:"#333" }}>?</span>
    </div>
  );
}

function Burst({ color }) {
  const pts = Array.from({length:14},(_,i)=>{
    const ang=(i/14)*360, d=rand(55,110);
    return { x:Math.cos(ang*Math.PI/180)*d, y:Math.sin(ang*Math.PI/180)*d, c:[color,"#FFD93D","#fff","#FF6B6B"][i%4] };
  });
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:50}}>
      {pts.map((p,i)=><div key={i} style={{position:"absolute",top:"50%",left:"50%",width:13,height:13,borderRadius:"50%",background:p.c,animation:`bst${i} 0.7s ease-out forwards`}}/>)}
      <style>{pts.map((p,i)=>`@keyframes bst${i}{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(calc(-50% + ${p.x}px),calc(-50% + ${p.y}px)) scale(0);opacity:0}}`).join("")}</style>
    </div>
  );
}

function ShakeBox({ shake, children, style }) { return <div style={{...style, animation: shake?"shakeAnim 0.4s ease":"none"}}>{children}</div>; }
function PanelStat({ label, value, color, glow }) {
  return (
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:"clamp(10px,.9vw,13px)",fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>{label}</div>
      <div style={{fontSize:"clamp(24px,2.8vw,40px)",fontWeight:900,fontFamily:"'Fredoka One',cursive",color,lineHeight:1,textShadow:glow?`0 0 20px ${glow}`:"none"}}>{value}</div>
    </div>
  );
}
function Divider() { return <div style={{height:1,background:"#ffffff0f",margin:"clamp(8px,1.2vh,16px) 0"}}/>; }
const focusRing = (color,w=3) => `0 0 0 ${w}px ${color}, 0 0 20px ${color}66`;

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function MathGameTV() {
  const [phase,    setPhase]    = useState("intro");
  const [opIdx,    setOpIdx]    = useState(0);
  const [focusRow, setFocusRow] = useState("op");
  
  // Endless State
  const [level,    setLevel]    = useState(1);
  const [lives,    setLives]    = useState(3);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const [q,        setQ]        = useState(null);
  const [score,    setScore]    = useState(0);
  const [correct,  setCorrect]  = useState(0);
  const [streak,   setStreak]   = useState(0);
  const [best,     setBest]     = useState(0);
  const [picked,   setPicked]   = useState(null);
  const [frac,     setFrac]     = useState(1);
  const [burst,    setBurst]    = useState(false);
  const [popPts,   setPopPts]   = useState(null);
  const [cardAnim, setCardAnim] = useState("enter");
  const [focusAns, setFocusAns] = useState(0);
  const [resFocus, setResFocus] = useState(0);
  const [shake,    setShake]    = useState(false);

  const timerRef = useRef(null);
  const answered = useRef(false);

  const op    = OPS[opIdx];
  const meta  = OP_META[op];
  const lcfg  = getLevelConfig(level);

  /* ── timer ── */
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setFrac(1);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const f = Math.max(0, 1 - (Date.now()-start) / (lcfg.time*1000));
      setFrac(f);
      if (f === 0 && !answered.current) {
        clearInterval(timerRef.current);
        answered.current = true;
        
        const newLives = lives - 1;
        setLives(newLives);
        setStreak(0);
        setPicked({ chosen:null, ans:null, isCorrect:false, timeout:true });
        setTimeout(() => advance(false, newLives), 2200);
      }
    }, 80);
  }, [lcfg.time, lives]);

  /* ── advance ── */
  const advance = useCallback((isCorrect, currentLives) => {
    if (currentLives <= 0) {
      setTimeout(() => setPhase("result"), 300);
      return;
    }

    let nextLevel = level;
    // Level up every 5 correct answers
    if (isCorrect && (correct + 1) % 5 === 0) {
      nextLevel = level + 1;
      setLevel(nextLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 1800);
    }

    setCardAnim("exit");
    setTimeout(() => {
      answered.current = false;
      setPicked(null); setBurst(false); setPopPts(null); setShake(false);
      setQ(buildQ(op, nextLevel));
      setCardAnim("enter"); setFocusAns(0);
    }, 380);
  }, [op, level, correct]);

  /* ── pick answer ── */
  const pickAns = useCallback((chosen) => {
    if (answered.current || picked || !q) return;
    answered.current = true;
    clearInterval(timerRef.current);
    const isCorrect = chosen === q.ans;
    setPicked({ chosen, ans: q.ans, isCorrect, timeout: false });
    
    if (isCorrect) {
      setScore(s => s + lcfg.pts);
      setCorrect(c => c + 1);
      setStreak(s => s + 1);
      setBurst(true); setPopPts(lcfg.pts);
      setTimeout(() => { setBurst(false); setPopPts(null); }, 1000);
      setTimeout(() => advance(true, lives), 1400);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      setShake(true); setTimeout(() => setShake(false), 450);
      setTimeout(() => advance(false, newLives), 2500);
    }
  }, [q, lcfg, picked, lives, advance]);

  /* ── start game ── */
  const startGame = useCallback(() => {
    answered.current = false;
    setScore(0); setCorrect(0); setStreak(0); setLevel(1); setLives(3);
    setBurst(false); setPopPts(null); setPicked(null); setShake(false); setShowLevelUp(false);
    setQ(buildQ(op, 1));
    setCardAnim("enter"); setFocusAns(0);
    setPhase("game");
  }, [op]);

  useEffect(() => {
    if (phase === "game" && q && !showLevelUp) startTimer();
    return () => clearInterval(timerRef.current);
  }, [q, phase, showLevelUp, startTimer]);

  useEffect(() => {
    if (phase === "result") setBest(b => Math.max(b, score));
  }, [phase, score]);

  /* ── keyboard ── */
  useEffect(() => {
    const onKey = (e) => {
      /* INTRO */
      if (phase === "intro") {
        if (e.key === "ArrowLeft" && focusRow==="op")  setOpIdx(i=>(i+4)%5);
        if (e.key === "ArrowRight" && focusRow==="op") setOpIdx(i=>(i+1)%5);
        if (e.key === "ArrowUp" || e.key === "ArrowDown") setFocusRow(r=>r==="play"?"op":"play");
        if ((e.key==="Enter"||e.key===" ") && focusRow==="play") startGame();
        e.preventDefault();
      }
      /* GAME */
      if (phase === "game" && !showLevelUp) {
        if (focusAns === "back") {
          if (e.key === "ArrowUp" || e.key === "ArrowRight") { setFocusAns(2); e.preventDefault(); }
          if (e.key === "Enter" || e.key === " ") {
            clearInterval(timerRef.current); setPhase("intro"); e.preventDefault();
          }
        } else {
          if (e.key==="ArrowRight") { setFocusAns(i => [1,1,3,3][i]); e.preventDefault(); }
          if (e.key==="ArrowLeft")  { setFocusAns(i => (i === 0 || i === 2) ? "back" : [0,0,2,2][i]); e.preventDefault(); }
          if (e.key==="ArrowDown")  { setFocusAns(i => (i === 2 || i === 3) ? "back" : i + 2); e.preventDefault(); }
          if (e.key==="ArrowUp")    { setFocusAns(i => i >= 2 ? i - 2 : i); e.preventDefault(); }
          if ((e.key==="Enter"||e.key===" ") && !picked && q) {
            pickAns(q.choices[focusAns]); e.preventDefault();
          }
        }
      }
      /* RESULT */
      if (phase === "result") {
        if (e.key==="ArrowLeft"||e.key==="ArrowRight") setResFocus(i=>1-i);
        if (e.key==="Enter"||e.key===" ") { if (resFocus===0) startGame(); else setPhase("intro"); }
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, focusRow, focusAns, resFocus, picked, q, showLevelUp, pickAns, startGame]);

  /* ── derived ── */
  const tColor   = frac>0.5?"#6BCB77":frac>0.25?"#FFD93D":"#FF6B6B";
  const resEmoji = level>=10?"👑":level>=5?"🔥":"💪";
  const resMsg   = level>=10?"Legendary Run!":level>=5?"Awesome Score!":"Good effort, keep practising!";

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div style={S.root}>
      <div style={S.bgBase}/>
      <div style={{...S.bgGlow, background:`radial-gradient(ellipse 55% 55% at 10% 90%,${meta.color}22,transparent),radial-gradient(ellipse 45% 45% at 90% 10%,${meta.glow},transparent)`}}/>
      {[120,80,160,90,110,70].map((sz,i)=>(
        <div key={i} style={{position:"fixed",width:sz,height:sz,borderRadius:"50%",
          background:[meta.color,"#FFD93D","#C77DFF","#6BCB77","#4D96FF","#FF9F43"][i],
          opacity:.05,top:[`8%`,`75%`,`55%`,`20%`,`85%`,`40%`][i],left:[`4%`,`8%`,`88%`,`88%`,`75%`,`45%`][i],
          animation:`blob ${[8,11,7,9,10,6][i]}s ${i*.9}s ease-in-out infinite alternate`,filter:"blur(1px)",zIndex:0}}/>
      ))}

      {/* ════ INTRO ════ */}
      {phase==="intro" && (
        <div style={S.introWrap}>
          <div style={{textAlign:"center",lineHeight:1}}>
            <div style={{fontSize:"clamp(30px,4.5vw,66px)",fontWeight:900,fontFamily:"'Fredoka One',cursive",
              background:`linear-gradient(135deg,${meta.color},#C77DFF)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              🧮 Math Quest
            </div>
            <div style={{fontSize:"clamp(12px,1.2vw,18px)",fontWeight:700,color:"#FFD93D",marginTop:8,letterSpacing:2,textTransform:"uppercase"}}>
              Endless Survival Mode
            </div>
          </div>

          {/* ── Operation selector ── */}
          <div style={{width:"100%",maxWidth:"min(1100px,96vw)"}}>
            <div style={{fontSize:"clamp(10px,.9vw,13px)",fontWeight:800,color:focusRow==="op"?meta.color:"#555",textTransform:"uppercase",letterSpacing:2,marginBottom:"1vh"}}>
              ⚡ Operation &nbsp;{focusRow==="op"&&<span style={{color:meta.color}}>◀ ▶</span>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"clamp(6px,.8vw,12px)"}}>
              {OPS.map((key,i)=>{
                const m=OP_META[key], active=opIdx===i, focused=focusRow==="op"&&active;
                return (
                  <button key={key} onClick={()=>{setOpIdx(i);setFocusRow("op");}} style={{
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    gap:"clamp(3px,.5vh,7px)",padding:"clamp(8px,1.3vh,18px) 6px",borderRadius:16,cursor:"pointer",
                    fontFamily:"'Nunito',sans-serif",transition:"all .22s cubic-bezier(.34,1.56,.64,1)",
                    background:active?m.color:"#ffffff0c",
                    border:focused?"3px solid #fff":`2px solid ${active?m.dark+"88":"#ffffff12"}`,
                    boxShadow:focused?focusRing("#fff",3)+`, 0 0 28px ${m.glow}`:active?`0 0 20px ${m.glow}`:"none",
                    transform:active?"scale(1.06) translateY(-3px)":"scale(1)",color:active?"#fff":"#aaa",
                  }}>
                    <span style={{fontSize:"clamp(18px,2.2vw,32px)"}}>{m.emoji}</span>
                    <span style={{fontSize:"clamp(18px,2vw,28px)",fontWeight:900}}>{m.sym}</span>
                    <span style={{fontSize:"clamp(10px,1vw,14px)",fontWeight:700}}>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={startGame} style={{
            width:"min(380px,80vw)",padding:"clamp(11px,1.7vh,19px) 32px",
            border:focusRow==="play"?"3px solid #fff":"2px solid transparent",
            borderRadius:20,color:"#fff",fontSize:"clamp(17px,1.9vw,24px)",fontWeight:900,cursor:"pointer",
            fontFamily:"'Fredoka One',cursive",letterSpacing:1,transition:"all .2s",
            background:`linear-gradient(135deg,${meta.color},${meta.dark})`,
            boxShadow:focusRow==="play"?focusRing("#fff",4)+`, 0 0 40px ${meta.glow}`:`0 0 28px ${meta.glow}`,
            transform:focusRow==="play"?"scale(1.04)":"scale(1)",
            marginTop:"2vh"
          }}>🚀 Start Arcade!</button>
        </div>
      )}

      {/* ════ GAME ════ */}
      {phase==="game" && q && (
        <div style={S.gameWrap}>
          
          {/* LEVEL UP OVERLAY */}
          {showLevelUp && (
            <div style={{position:"absolute",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",background:"#00000088",backdropFilter:"blur(4px)",borderRadius:24}}>
              <div style={{textAlign:"center",animation:"levelUpAnim 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"}}>
                <div style={{fontSize:"clamp(40px,6vw,90px)",fontWeight:900,fontFamily:"'Fredoka One',cursive",color:"#FFD93D",textShadow:"0 10px 30px #FFD93D66",lineHeight:1}}>LEVEL UP!</div>
                <div style={{fontSize:"clamp(18px,2.5vw,36px)",fontWeight:800,color:"#fff",marginTop:8}}>Welcome to {lcfg.name}</div>
              </div>
            </div>
          )}

          {/* LEFT PANEL */}
          <div style={S.sidePanel}>
            <PanelStat label="Stage" value={lcfg.name} color="#fff"/>
            <Divider/>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"clamp(10px,.9vw,13px)",fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Lives</div>
              <div style={{fontSize:"clamp(18px,2vw,28px)",letterSpacing:4}}>
                {Array.from({length:3}).map((_,i) => (
                  <span key={i} style={{opacity: i < lives ? 1 : 0.2, filter: i < lives ? "drop-shadow(0 0 8px #FF6B6B)" : "grayscale(1)"}}>❤️</span>
                ))}
              </div>
            </div>
            <Divider/>
            <PanelStat label="Score" value={score} color={meta.color} glow={meta.glow}/>
            <Divider/>
            <div style={{display:"flex",alignItems:"center",gap:8,background:`${meta.color}18`,border:`1.5px solid ${meta.color}44`,borderRadius:12,padding:"clamp(7px,.9vh,11px) 10px"}}>
              <span style={{fontSize:"clamp(16px,1.8vw,24px)"}}>{meta.emoji}</span>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:"clamp(8px,.7vw,11px)",color:"#555",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Mode</div>
                <div style={{fontSize:"clamp(11px,1vw,15px)",fontWeight:800,color:meta.color}}>{meta.label}</div>
              </div>
            </div>
            
            {/* BACK BUTTON (Bottom of Left Panel) */}
            <div style={{ marginTop: "auto", paddingTop: 10 }}>
              <button 
                onClick={() => { clearInterval(timerRef.current); setPhase("intro"); }}
                style={{
                  width: "100%", padding: "clamp(8px, 1.2vh, 14px)",
                  background: focusAns === "back" ? "#ffffff22" : "#ffffff08",
                  border: focusAns === "back" ? "3px solid #fff" : "2px solid #ffffff15",
                  borderRadius: 14, color: focusAns === "back" ? "#fff" : "#aaa",
                  fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "clamp(12px, 1vw, 16px)",
                  cursor: "pointer", boxShadow: focusAns === "back" ? focusRing("#fff", 3) + `, 0 0 20px #ffffff44` : "none",
                  transform: focusAns === "back" ? "scale(1.05)" : "scale(1)", transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                }}
              >
                ← Give Up
              </button>
            </div>
          </div>

          {/* CENTER */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"clamp(7px,1vh,14px)"}}>

            {/* Timer */}
            <div style={{width:"100%",maxWidth:"min(680px,100%)"}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"clamp(10px,.85vw,13px)",fontWeight:700,color:"#666",marginBottom:4}}>
                <span>⏱ Time ({lcfg.time}s max)</span>
                <span style={{color:tColor,transition:"color .4s"}}>{Math.ceil(frac*lcfg.time)}s</span>
              </div>
              <div style={{height:"clamp(7px,.7vh,11px)",background:"#ffffff0f",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${frac*100}%`,background:tColor,borderRadius:99,transition:"width .1s linear,background .4s",boxShadow:`0 0 8px ${tColor}`}}/>
              </div>
            </div>

            {/* Question Card */}
            <ShakeBox shake={shake} style={{
              ...S.qCard,
              animation: cardAnim==="enter"?"cardEnter .4s cubic-bezier(.34,1.56,.64,1) both":"cardExit .3s ease-in both",
              boxShadow: picked?.isCorrect ? `0 0 0 3px #6BCB7799,0 16px 50px #0009` : picked&&!picked.isCorrect&&!picked.timeout ? `0 0 0 3px #FF6B6B99,0 16px 50px #0009` : `0 0 0 2px ${meta.color}33,0 16px 50px #0009`,
              position:"relative", transition:"box-shadow .3s",
            }}>
              {burst && <Burst color={meta.color}/>}
              {popPts && (
                <div style={{position:"absolute",top:"5%",right:"6%",fontSize:"clamp(26px,3.2vw,44px)",fontWeight:900,color:"#6BCB77",
                  fontFamily:"'Fredoka One',cursive",animation:"scorePop 1s ease-out forwards",pointerEvents:"none",textShadow:"0 0 16px #6BCB77"}}>
                  +{popPts}
                </div>
              )}

              {/* Expression */}
              <ExprDisplay expression={q.expression} metaColor={meta.color} isMixed={q.isMixed}/>

              {/* Answer choices */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(7px,.9vw,13px)"}}>
                {q.choices.map((c,i)=>{
                  const labels=["A","B","C","D"];
                  const isFocused=!picked&&focusAns===i;
                  let bg="#1a1a2e",border=`2px solid ${meta.color}33`,col="#ddd",sh="none",icon=null,scl="scale(1)";

                  if (isFocused){ border="3px solid #fff"; sh=focusRing("#fff",3); bg="#ffffff12"; scl="scale(1.03)"; }

                  if (picked) {
                    const isChosen = c===picked.chosen;
                    const isCorrectA = c===picked.ans;

                    if (picked.isCorrect && isCorrectA) {
                      bg="#1A5C2A"; border="3px solid #6BCB77"; col="#fff"; sh="0 0 24px #6BCB7799";
                      icon=<span style={{marginLeft:8,fontSize:"clamp(16px,2vw,26px)"}}>✅</span>;
                      scl="scale(1.05)";
                    } else if (!picked.isCorrect && isChosen) {
                      bg="#5C1A1A"; border="3px solid #FF6B6B"; col="#fff"; sh="0 0 24px #FF6B6B99";
                      icon=<span style={{marginLeft:8,fontSize:"clamp(16px,2vw,26px)"}}>❌</span>;
                    } else {
                      bg="#0d0d1a"; col="#1a1a2e"; border="2px solid #ffffff04";
                    }
                  }

                  return (
                    <button key={i} disabled={!!picked} onClick={()=>{setFocusAns(i);pickAns(c);}} style={{
                      display:"flex",alignItems:"center",justifyContent:"center",
                      padding:"clamp(9px,1.4vh,18px) 10px",borderRadius:14,
                      fontFamily:"'Nunito',sans-serif",transition:"all .2s ease",
                      cursor:picked?"default":"pointer",
                      background:bg,border,color:col,boxShadow:sh,transform:scl,
                    }}>
                      <span style={{fontSize:"clamp(12px,1.2vw,17px)",fontWeight:700,opacity:.45,marginRight:7}}>{labels[i]}</span>
                      <span style={{fontSize:"clamp(26px,3.5vw,46px)",fontWeight:900,fontFamily:"'Fredoka One',cursive"}}>{c}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* Feedback message */}
              <div style={{minHeight:"clamp(26px,3.2vh,42px)",marginTop:"clamp(7px,1vh,14px)",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {picked?.isCorrect && (
                  <div style={{fontSize:"clamp(15px,1.7vw,22px)",fontWeight:800,color:"#6BCB77",animation:"fadeInUp .3s ease",fontFamily:"'Fredoka One',cursive"}}>
                    {["🌟 Brilliant!","🎉 Correct!","💪 Well done!","🔥 Awesome!","⭐ Perfect!"][rand(0,4)]}
                  </div>
                )}
                {picked && !picked.isCorrect && !picked.timeout && (
                  <div style={{fontSize:"clamp(13px,1.4vw,19px)",fontWeight:800,color:"#FF6B6B",animation:"fadeInUp .3s ease",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                    <span>❌ Wrong! -1 Life</span>
                    <span style={{color:"#888"}}>Answer:</span>
                    <span style={{color:"#FFD93D",fontFamily:"'Fredoka One',cursive",fontSize:"clamp(18px,2.2vw,28px)",fontWeight:900,textShadow:"0 0 12px #FFD93D"}}>{picked.ans}</span>
                  </div>
                )}
                {picked?.timeout && (
                  <div style={{fontSize:"clamp(13px,1.4vw,19px)",fontWeight:800,color:"#FFD93D",animation:"fadeInUp .3s ease",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",justifyContent:"center"}}>
                    <span>⏰ Time's up! -1 Life</span>
                    <span style={{color:"#888"}}>Answer:</span>
                    <span style={{color:"#FFD93D",fontFamily:"'Fredoka One',cursive",fontSize:"clamp(18px,2.2vw,28px)",fontWeight:900}}>{q.ans}</span>
                  </div>
                )}
              </div>
            </ShakeBox>

            {/* Progress to next level dots */}
            <div style={{display:"flex",gap:"clamp(4px,.5vw,8px)"}}>
              {[...Array(5)].map((_,i)=>{
                const prog = correct % 5;
                return (
                  <div key={i} style={{width:"clamp(8px,.9vw,12px)",height:"clamp(8px,.9vw,12px)",borderRadius:"50%",
                    background:i<prog?meta.color:i===prog?"#fff":"#ffffff18",
                    boxShadow:i===prog?"0 0 7px #fff":i<prog?`0 0 5px ${meta.color}`:"none",transition:"all .3s"}}/>
                );
              })}
            </div>
            <div style={{fontSize:"10px",color:"#666",fontWeight:700,marginTop:4}}>TO NEXT LEVEL</div>
          </div>

          {/* RIGHT PANEL */}
          <div style={S.sidePanel}>
            <PanelStat label="Correct" value={correct} color="#6BCB77"/>
            <Divider/>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"clamp(10px,.9vw,12px)",fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Streak</div>
              <div style={{fontSize:"clamp(24px,2.8vw,40px)",fontWeight:900,fontFamily:"'Fredoka One',cursive",color:"#FF9F43"}}>{streak}🔥</div>
            </div>
            <Divider/>
            <PanelStat label="All-Time Best" value={`🏅 ${best}`} color="#FFD93D" glow="#FFD93D55"/>
            <Divider/>
            {op==="mixed" ? (
              <div style={{background:"#ffffff08",border:"1px solid #ffffff0f",borderRadius:12,padding:"clamp(8px,1.1vh,13px) 10px",textAlign:"center"}}>
                <div style={{fontSize:"clamp(9px,.7vw,11px)",color:"#555",fontWeight:700,textTransform:"uppercase",marginBottom:8,letterSpacing:1}}>Order of Ops</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {[["1st","× ÷","#6BCB77"],["2nd","+ −","#FF6B6B"]].map(([step,ops,col])=>(
                    <div key={step} style={{display:"flex",alignItems:"center",gap:6,background:"#ffffff06",borderRadius:8,padding:"6px 8px"}}>
                      <span style={{fontSize:"clamp(9px,.75vw,11px)",color:"#555",fontWeight:700}}>{step}</span>
                      <span style={{fontSize:"clamp(14px,1.5vw,20px)",color:col,fontWeight:900,fontFamily:"'Fredoka One',cursive"}}>{ops}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{background:"#ffffff07",border:"1px solid #ffffff0f",borderRadius:12,padding:"clamp(8px,1.1vh,13px) 10px",textAlign:"center"}}>
                <div style={{fontSize:"clamp(9px,.7vw,11px)",color:"#555",fontWeight:700,textTransform:"uppercase",marginBottom:8,letterSpacing:1}}>TV Remote</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                  {[["◀▶","Move"],["▲▼","Move"],["OK","Select"]].map(([k,v])=>(
                    <div key={k} style={{background:"#ffffff08",borderRadius:8,padding:"clamp(4px,.5vh,7px) 4px"}}>
                      <div style={{fontSize:"clamp(10px,.9vw,13px)",color:"#aaa",fontWeight:800}}>{k}</div>
                      <div style={{fontSize:"clamp(8px,.65vw,10px)",color:"#555"}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ RESULT ════ */}
      {phase==="result" && (
        <div style={{position:"relative",zIndex:2,flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5vh 2vw"}}>
          <div style={{width:"100%",maxWidth:"min(960px,95vw)",background:"#0e0e22",border:"1px solid #ffffff0a",borderRadius:28,
            padding:"clamp(16px,2.5vh,34px) clamp(16px,2.5vw,34px)",textAlign:"center",animation:"cardEnter .5s ease both"}}>
            <div style={{fontSize:"clamp(44px,6.5vh,76px)",animation:"pop .6s ease both",lineHeight:1}}>💀 GAME OVER</div>
            <div style={{fontSize:"clamp(26px,3.8vw,46px)",fontWeight:900,fontFamily:"'Fredoka One',cursive",
              background:`linear-gradient(135deg,${meta.color},#FFD93D)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4,marginTop:12}}>
              {resMsg}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"clamp(7px,.9vw,13px)",marginBottom:"clamp(12px,2vh,22px)",marginTop:"2vh"}}>
              {[["🏅","Final Score",score,meta.color],["⭐","Level Reached",level,"#C77DFF"],["✅","Total Correct",correct,"#6BCB77"],["🏆","Best Score",best,"#FFD93D"]].map(([ic,label,val,col])=>(
                <div key={label} style={{background:"#ffffff06",border:`2px solid ${col}44`,borderRadius:14,padding:"clamp(9px,1.4vh,16px) 8px",display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <span style={{fontSize:"clamp(18px,2.3vw,28px)"}}>{ic}</span>
                  <div style={{fontSize:"clamp(8px,.75vw,11px)",fontWeight:700,color:"#666",textTransform:"uppercase",letterSpacing:.5,marginTop:4}}>{label}</div>
                  <div style={{fontSize:"clamp(22px,3vw,38px)",fontWeight:900,fontFamily:"'Fredoka One',cursive",color:col}}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{display:"flex",gap:"clamp(8px,1vw,14px)"}}>
              {[["🔁 Play Again",()=>startGame(),meta.color,meta.dark,resFocus===0],
                ["🏠 Main Menu",()=>setPhase("intro"),"#555","#333",resFocus===1]].map(([label,fn,c1,c2,focused],i)=>(
                <button key={i} onClick={fn} style={{
                  flex:1,padding:"clamp(11px,1.7vh,17px)",
                  border:focused?"3px solid #fff":"2px solid transparent",
                  borderRadius:18,color:"#fff",fontSize:"clamp(15px,1.7vw,21px)",fontWeight:900,cursor:"pointer",
                  fontFamily:"'Fredoka One',cursive",
                  background:`linear-gradient(135deg,${c1},${c2})`,
                  boxShadow:focused?focusRing("#fff",3)+`, 0 0 28px ${meta.glow}`:`0 0 16px ${meta.glow}`,
                  transform:focused?"scale(1.04)":"scale(1)",transition:"all .2s",
                }}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800;900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body,#root{width:100%;height:100%;overflow:hidden;background:#0a0a14;}
        @keyframes blob      {0%{transform:translate(0,0)scale(1)}100%{transform:translate(18px,28px)scale(1.1)}}
        @keyframes pop       {0%{transform:scale(0)}70%{transform:scale(1.15)}100%{transform:scale(1)}}
        @keyframes cardEnter {from{opacity:0;transform:scale(.93)translateY(22px)}to{opacity:1;transform:scale(1)translateY(0)}}
        @keyframes cardExit  {from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.9)translateY(-14px)}}
        @keyframes scorePop  {0%{opacity:1;transform:translateY(0)scale(1)}100%{opacity:0;transform:translateY(-60px)scale(1.2)}}
        @keyframes shakeAnim {0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-8px)}80%{transform:translateX(8px)}}
        @keyframes fadeInUp  {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes levelUpAnim {0%{opacity:0;transform:scale(0.5) translateY(40px)}20%{opacity:1;transform:scale(1.1) translateY(0)}30%{transform:scale(1)}80%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.5) translateY(-40px)}}
        button:hover:not(:disabled){filter:brightness(1.1);}
        button:active:not(:disabled){transform:scale(.96)!important;}
        button:focus{outline:none;}
      `}</style>
    </div>
  );
}

const S = {
  root:      {position:"fixed",top:0,left:0,width:"100vw",height:"100vh",background:"#0a0a14",fontFamily:"'Nunito',sans-serif",color:"#fff",overflow:"hidden",display:"flex",flexDirection:"column"},
  bgBase:    {position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 50% 0%,#1a1040 0%,transparent 70%),radial-gradient(ellipse 60% 40% at 50% 100%,#0a1828 0%,transparent 70%)",zIndex:0},
  bgGlow:    {position:"absolute",inset:0,zIndex:0,transition:"background .8s"},
  introWrap: {position:"relative",zIndex:2,flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"clamp(6px,1.2vh,18px) clamp(14px,1.8vw,36px)",gap:"clamp(8px,1.5vh,20px)"},
  gameWrap:  {position:"relative",zIndex:2,flex:1,display:"grid",gridTemplateColumns:"clamp(150px,15vw,218px) 1fr clamp(150px,15vw,218px)",gap:"clamp(7px,1.1vw,18px)",padding:"clamp(7px,.9vh,14px) clamp(8px,1.1vw,18px)",alignItems:"stretch"},
  sidePanel: {display:"flex",flexDirection:"column",background:"#ffffff06",border:"1px solid #ffffff0a",borderRadius:20,padding:"clamp(9px,1.3vh,16px) clamp(9px,1vw,14px)",textAlign:"center",gap:0},
  qCard:     {width:"100%",maxWidth:"min(660px,100%)",background:"#12122a",border:"1px solid #ffffff0a",borderRadius:24,padding:"clamp(12px,2vh,28px) clamp(10px,1.6vw,24px)"},
};