import { useState, useEffect, useRef, useCallback } from "react";

const BUBBLE_COLORS = [
  { bg: "#FF6B6B", border: "#C0392B", text: "#fff", shine: "rgba(255,255,255,0.45)" },
  { bg: "#FF9F43", border: "#E67E22", text: "#fff", shine: "rgba(255,255,255,0.45)" },
  { bg: "#FFEAA7", border: "#F9CA24", text: "#6C4A00", shine: "rgba(255,255,255,0.6)" },
  { bg: "#55EFC4", border: "#00B894", text: "#004D40", shine: "rgba(255,255,255,0.5)" },
  { bg: "#74B9FF", border: "#0984E3", text: "#003366", shine: "rgba(255,255,255,0.5)" },
  { bg: "#A29BFE", border: "#6C5CE7", text: "#fff", shine: "rgba(255,255,255,0.4)" },
  { bg: "#FD79A8", border: "#E84393", text: "#fff", shine: "rgba(255,255,255,0.4)" },
  { bg: "#00CEC9", border: "#00878A", text: "#fff", shine: "rgba(255,255,255,0.4)" },
  { bg: "#6AB04C", border: "#27AE60", text: "#fff", shine: "rgba(255,255,255,0.4)" },
  { bg: "#FDA7DF", border: "#D980FA", text: "#4A0060", shine: "rgba(255,255,255,0.5)" },
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BUBBLE_R = 38;
const GAME_W = 500;
const GAME_H = 580;
const LANE_COUNT = 6;
const LANE_W = GAME_W / LANE_COUNT;

let uid = 1;

// UPDATE: Added currentBubbles parameter to check for existing letters
function makeBubble(score, currentBubbles = []) {
  const lane = Math.floor(Math.random() * LANE_COUNT);
  const cx = lane * LANE_W + LANE_W / 2 + (Math.random() - 0.5) * 16;
  
  // Find all letters currently on screen
  const activeLetters = currentBubbles.filter((b) => !b.popping).map((b) => b.letter);
  
  // Filter them out of the available letters
  const availableLetters = LETTERS.split("").filter((l) => !activeLetters.includes(l));
  
  // Fallback to all letters just in case the screen is completely full (preventing a crash)
  const letterPool = availableLetters.length > 0 ? availableLetters : LETTERS.split("");
  const letter = letterPool[Math.floor(Math.random() * letterPool.length)];
  
  const color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
  const speed = 0.28 + Math.random() * 0.18 + Math.min(score * 0.003, 0.5);
  
  return {
    id: uid++,
    cx,
    cy: GAME_H + BUBBLE_R + 10,
    letter,
    color,
    speed,
    wobble: Math.random() * Math.PI * 2,
    scale: 0,
    popping: false,
    popT: 0,
  };
}

export default function BubbleTypingGame() {
  const [phase, setPhase] = useState("idle");
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [particles, setParticles] = useState([]);

  const animRef = useRef(null);
  const lastTsRef = useRef(null);
  const spawnRef = useRef(0);
  const stateRef = useRef({ score: 0, combo: 0, bestCombo: 0 });
  const phaseRef = useRef("idle");
  const gameOverFired = useRef(false);

  phaseRef.current = phase;

  const spawnMs = useCallback(() => {
    return Math.max(1400 - stateRef.current.score * 12, 500);
  }, []);

  const triggerParticles = useCallback((cx, cy, color) => {
    const id = uid++;
    const pts = Array.from({ length: 10 }).map((_, i) => {
      const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 30 + Math.random() * 30;
      return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
    });
    setParticles((p) => [...p, { id, cx, cy, color, pts }]);
    setTimeout(() => setParticles((p) => p.filter((x) => x.id !== id)), 600);
  }, []);

  const popBubble = useCallback((id) => {
    setBubbles((prev) => {
      const b = prev.find((b) => b.id === id);
      if (!b || b.popping) return prev;
      const newCombo = stateRef.current.combo + 1;
      const pts = 1 + Math.floor(newCombo / 4);
      stateRef.current.combo = newCombo;
      stateRef.current.score += pts;
      if (newCombo > stateRef.current.bestCombo) stateRef.current.bestCombo = newCombo;
      setScore(stateRef.current.score);
      setCombo(newCombo);
      setBestCombo(stateRef.current.bestCombo);
      triggerParticles(b.cx, b.cy, b.color);
      return prev.map((bb) => bb.id === id ? { ...bb, popping: true, popT: 0 } : bb);
    });
  }, [triggerParticles]);

  useEffect(() => {
    const onKey = (e) => {
      if (phaseRef.current !== "playing") return;
      const letter = e.key.toUpperCase();
      if (!LETTERS.includes(letter) || letter.length !== 1) return;
      setBubbles((prev) => {
        const matches = prev.filter((b) => b.letter === letter && !b.popping);
        if (matches.length === 0) {
          stateRef.current.combo = 0;
          setCombo(0);
          return prev;
        }
        const target = matches.sort((a, b) => a.cy - b.cy)[0];
        popBubble(target.id);
        return prev;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [popBubble]);

  useEffect(() => {
    if (phase !== "playing") {
      cancelAnimationFrame(animRef.current);
      return;
    }

    gameOverFired.current = false;

    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min(ts - lastTsRef.current, 50);
      lastTsRef.current = ts;

      spawnRef.current += dt;
      if (spawnRef.current >= spawnMs()) {
        spawnRef.current = 0;
        setBubbles((prev) => {
          if (prev.filter((b) => !b.popping).length >= 14) return prev;
          // UPDATE: Pass 'prev' to makeBubble so it knows which letters are active
          return [...prev, makeBubble(stateRef.current.score, prev)];
        });
      }

      setBubbles((prev) => {
        let hit = false;
        const next = prev.map((b) => {
          if (b.popping) {
            const pt = b.popT + dt / 200;
            if (pt >= 1) return null;
            return { ...b, popT: pt, scale: 1 + pt * 0.6 };
          }
          const newCy = b.cy - b.speed * dt * 0.055;
          const wx = Math.sin(ts / 700 + b.wobble) * 5;
          const newCx = Math.max(BUBBLE_R + 4, Math.min(GAME_W - BUBBLE_R - 4, b.cx + wx * 0.035));
          const newScale = b.scale < 1 ? Math.min(1, b.scale + 0.07) : 1;
          if (newCy - BUBBLE_R <= 2) {
            hit = true;
            return { ...b, cy: BUBBLE_R + 2, cx: newCx };
          }
          return { ...b, cy: newCy, cx: newCx, scale: newScale };
        }).filter(Boolean);

        if (hit && !gameOverFired.current) {
          gameOverFired.current = true;
          setTimeout(() => setPhase("over"), 100);
        }
        return next;
      });

      animRef.current = requestAnimationFrame(tick);
    };

    lastTsRef.current = null;
    spawnRef.current = 0;
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, spawnMs]);

  const startGame = () => {
    uid = 1;
    setBubbles([]);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setParticles([]);
    stateRef.current = { score: 0, combo: 0, bestCombo: 0 };
    gameOverFired.current = false;
    setPhase("playing");
  };

  const bgStyle = {
    position: "relative",
    width: GAME_W,
    height: GAME_H,
    borderRadius: 24,
    overflow: "hidden",
    border: "3px solid #6C5CE7",
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 12px", background: "transparent" }}>

      {phase === "idle" && (
        <div style={{ position: "relative", width: GAME_W, maxWidth: "100%", height: GAME_H, borderRadius: 24, overflow: "hidden", border: "3px solid #6C5CE7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", zIndex: 0 }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg,#FF6B6B,#FFEAA7,#55EFC4,#74B9FF,#A29BFE,#FD79A8,#FF6B6B)", zIndex: 5 }} />

          {[
            { left: "12%", top: "18%", size: 58, color: "#FF6B6B", border: "#C0392B", text: "#fff", letter: "A", delay: "0s", dur: "3.2s" },
            { left: "30%", top: "30%", size: 52, color: "#A29BFE", border: "#6C5CE7", text: "#fff", letter: "Z", delay: "0.4s", dur: "2.8s" },
            { left: "55%", top: "15%", size: 62, color: "#55EFC4", border: "#00B894", text: "#004D40", letter: "B", delay: "0.8s", dur: "3.5s" },
            { left: "72%", top: "35%", size: 50, color: "#FFEAA7", border: "#F9CA24", text: "#6C4A00", letter: "X", delay: "0.2s", dur: "4s" },
            { left: "20%", top: "60%", size: 56, color: "#FD79A8", border: "#E84393", text: "#fff", letter: "Q", delay: "1s", dur: "3s" },
            { left: "45%", top: "68%", size: 48, color: "#74B9FF", border: "#0984E3", text: "#003366", letter: "K", delay: "0.6s", dur: "3.8s" },
            { left: "78%", top: "62%", size: 54, color: "#FF9F43", border: "#E67E22", text: "#fff", letter: "M", delay: "1.2s", dur: "2.6s" },
            { left: "5%", top: "72%", size: 44, color: "#00CEC9", border: "#00878A", text: "#fff", letter: "P", delay: "0.3s", dur: "3.4s" },
          ].map((b, i) => (
            <div key={i} style={{
              position: "absolute", left: b.left, top: b.top,
              width: b.size, height: b.size, borderRadius: "50%",
              background: b.color, border: "3px solid " + b.border,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: b.size * 0.42, fontWeight: 900, color: b.text,
              boxShadow: "0 0 22px " + b.color + "99, inset 0 4px 10px rgba(255,255,255,0.45)",
              animation: "floatBubble " + b.dur + " ease-in-out " + b.delay + " infinite alternate",
              zIndex: 2,
            }}>
              {b.letter}
              <div style={{ position: "absolute", top: "18%", left: "22%", width: "28%", height: "16%", borderRadius: "50%", background: "rgba(255,255,255,0.5)", transform: "rotate(-30deg)" }} />
            </div>
          ))}

          <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 2, animation: "bounceLogo 1.5s ease-in-out infinite alternate" }}>🫧</div>
            <h1 style={{
              fontSize: 52, fontWeight: 900, margin: "0 0 10px", letterSpacing: 2,
              background: "linear-gradient(135deg,#FF6B6B,#FFEAA7,#55EFC4,#A29BFE,#FD79A8)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              textShadow: "none", lineHeight: 1.1,
            }}>
              BUBBLE POP
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
              Pop every bubble before it hits the top!
            </p>
            <button
              onClick={startGame}
              style={{
                fontSize: 22, padding: "15px 52px", borderRadius: 50, border: "none",
                background: "linear-gradient(135deg,#FF6B6B,#A29BFE,#55EFC4)",
                color: "#fff", cursor: "pointer", fontWeight: 800,
                boxShadow: "0 0 32px rgba(162,155,254,0.6), 0 6px 20px rgba(0,0,0,0.3)",
                animation: "pulseBtn 2s ease-in-out infinite",
                letterSpacing: 1,
              }}
            >
              🫧 PLAY NOW
            </button>
          </div>
        </div>
      )}

      {phase === "playing" && (
        <div style={{ width: GAME_W, maxWidth: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
            <div style={{ background: "#ede9fe", border: "1.5px solid #a29bfe", borderRadius: 14, padding: "7px 18px", fontSize: 16, fontWeight: 700, color: "#534AB7" }}>
              Score: {score}
            </div>
            <div style={{ background: combo >= 3 ? "#fff3e0" : "#f5f5f5", border: combo >= 3 ? "1.5px solid #FF9F43" : "1.5px solid #eee", borderRadius: 14, padding: "7px 18px", fontSize: 15, fontWeight: 700, color: combo >= 3 ? "#C0392B" : "#bbb", transition: "all 0.2s" }}>
              {combo >= 2 ? ("🔥 x" + combo) : "Combo: 0"}
            </div>
          </div>

          <div style={bgStyle}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", zIndex: 0 }} />

            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} style={{
                position: "absolute", borderRadius: "50%",
                background: "rgba(255,255,255,0.55)",
                width: (i % 3) + 1.5, height: (i % 3) + 1.5,
                left: ((i * 41 + 17) % 97) + "%",
                top: ((i * 59 + 11) % 97) + "%",
                zIndex: 0,
              }} />
            ))}

            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg,#FF6B6B,#FFEAA7,#55EFC4,#74B9FF,#A29BFE,#FD79A8,#FF6B6B)", zIndex: 20 }} />

            {bubbles.map((b) => {
              const opacity = b.popping ? Math.max(0, 1 - b.popT) : 1;
              const sc = b.popping ? 1 + b.popT * 0.7 : b.scale;
              return (
                <div
                  key={b.id}
                  onClick={() => !b.popping && popBubble(b.id)}
                  style={{
                    position: "absolute",
                    left: b.cx - BUBBLE_R,
                    top: b.cy - BUBBLE_R,
                    width: BUBBLE_R * 2,
                    height: BUBBLE_R * 2,
                    borderRadius: "50%",
                    background: b.color.bg,
                    border: "3px solid " + b.color.border,
                    boxShadow: b.popping ? "none" : ("0 0 20px " + b.color.bg + "99, inset 0 4px 10px " + b.color.shine + ", inset 0 -4px 8px rgba(0,0,0,0.15)"),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    fontWeight: 900,
                    color: b.color.text,
                    cursor: b.popping ? "default" : "pointer",
                    transform: "scale(" + sc + ")",
                    opacity,
                    userSelect: "none",
                    zIndex: b.popping ? 5 : 2,
                  }}
                >
                  {b.letter}
                  <div style={{ position: "absolute", top: 9, left: 11, width: 13, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.5)", transform: "rotate(-30deg)" }} />
                </div>
              );
            })}

            {particles.map((p) =>
              p.pts.map((pt, i) => (
                <div key={p.id + "-" + i} style={{
                  position: "absolute",
                  width: 11, height: 11, borderRadius: "50%",
                  background: p.color.bg,
                  border: "2px solid " + p.color.border,
                  left: p.cx - 5,
                  top: p.cy - 5,
                  pointerEvents: "none",
                  zIndex: 15,
                  animation: "popOut 0.55s ease-out forwards",
                  animationDelay: (i * 0.015) + "s",
                  "--dx": pt.dx + "px",
                  "--dy": pt.dy + "px",
                }} />
              ))
            )}
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "#aaa", marginTop: 8 }}>
            Press letter keys or click bubbles — don't let them reach the rainbow bar!
          </p>
        </div>
      )}

      {phase === "over" && (
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 60, marginBottom: 6 }}>💥</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 6px", background: "linear-gradient(135deg,#FF6B6B,#A29BFE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            A bubble escaped!
          </h2>
          <p style={{ color: "#888", marginBottom: 24, fontSize: 15 }}>Better luck next time!</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Final Score", val: score, color: "#6C5CE7" },
              { label: "Best Combo", val: "x" + bestCombo, color: "#E17055" },
              { label: "Bubbles Popped", val: score, color: "#00B894" },
              { label: "Rating", val: score >= 50 ? "S+" : score >= 30 ? "A" : score >= 15 ? "B" : "C", color: score >= 50 ? "#F9CA24" : "#74B9FF" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: "#f8f6ff", borderRadius: 16, padding: "18px 12px" }}>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 16, color: "#555", marginBottom: 24 }}>
            {score >= 50 ? "🏆 Legendary! You're unstoppable!" : score >= 30 ? "🌟 Amazing reflexes!" : score >= 15 ? "👍 Good job! Keep practising!" : "💪 Try again — you can do better!"}
          </div>
          <button onClick={startGame} style={{ fontSize: 20, padding: "13px 44px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#667eea,#f953c6)", color: "#fff", cursor: "pointer", fontWeight: 700, boxShadow: "0 6px 24px rgba(102,126,234,0.4)" }}>
            Play Again 🫧
          </button>
        </div>
      )}

      <style>{`
        @keyframes popOut {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        @keyframes floatBubble {
          0%   { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-18px) scale(1.06); }
        }
        @keyframes bounceLogo {
          0%   { transform: scale(1) rotate(-4deg); }
          100% { transform: scale(1.15) rotate(4deg); }
        }
        @keyframes pulseBtn {
          0%,100% { box-shadow: 0 0 32px rgba(162,155,254,0.6), 0 6px 20px rgba(0,0,0,0.3); transform: scale(1); }
          50%      { box-shadow: 0 0 48px rgba(255,107,107,0.7), 0 8px 28px rgba(0,0,0,0.35); transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
}