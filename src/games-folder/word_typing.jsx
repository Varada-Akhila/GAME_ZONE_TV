import { useState, useEffect, useRef, useCallback } from "react";

const FISH_COLORS = [
  { body: "#FF6B6B", fin: "#C0392B",  belly: "#FFB3B3", text: "#fff",    eye: "#fff",   glow: "#FF6B6B" },
  { body: "#FF9F43", fin: "#E67E22",  belly: "#FFD9A8", text: "#fff",    eye: "#fff",   glow: "#FF9F43" },
  { body: "#55EFC4", fin: "#00B894",  belly: "#AAFCE8", text: "#004D40", eye: "#004D40",glow: "#55EFC4" },
  { body: "#74B9FF", fin: "#0984E3",  belly: "#C0DCFF", text: "#003366", eye: "#003366",glow: "#74B9FF" },
  { body: "#A29BFE", fin: "#6C5CE7",  belly: "#D4D0FF", text: "#fff",    eye: "#fff",   glow: "#A29BFE" },
  { body: "#FD79A8", fin: "#E84393",  belly: "#FFB8D1", text: "#fff",    eye: "#fff",   glow: "#FD79A8" },
  { body: "#FFEAA7", fin: "#F9CA24",  belly: "#FFFACD", text: "#6C4A00", eye: "#6C4A00",glow: "#F9CA24" },
  { body: "#00CEC9", fin: "#00878A",  belly: "#A0F0EE", text: "#fff",    eye: "#fff",   glow: "#00CEC9" },
  { body: "#FDA7DF", fin: "#D980FA",  belly: "#FFD6F5", text: "#4A0060", eye: "#4A0060",glow: "#FDA7DF" },
  { body: "#6AB04C", fin: "#27AE60",  belly: "#B8E89A", text: "#fff",    eye: "#fff",   glow: "#6AB04C" },
];

const WORD_BANK = {
  easy: [
    "CAT","DOG","SUN","RUN","HAT","CUP","BIG","RED","FLY","MAP",
    "BUS","EGG","ANT","COW","BAT","FOX","HEN","PIG","OWL","BEE",
    "RAT","YAK","EMU","GNU","COD","EEL","KOI",
  ],
  medium: [
    "FISH","CRAB","FROG","DUCK","BEAR","LION","BIRD","WORM","SLUG","MOLE",
    "SEAL","DEER","WOLF","GOAT","SWAN","TOAD","MOTH","WASP","CARP","CLAM",
    "SNAIL","SHARK","WHALE","TIGER","BUNNY","PUPPY","KITTY","HORSE","MOUSE",
  ],
  hard: [
    "DOLPHIN","OCTOPUS","PENGUIN","LOBSTER","PARROT","TURTLE","RABBIT",
    "HAMSTER","GIRAFFE","LEOPARD","OSTRICH","PEACOCK","PUFFIN","TOUCAN",
    "WALRUS","BEAVER","BADGER","FALCON","LIZARD","MONKEY",
  ],
};

const ALL_WORDS = [...WORD_BANK.easy, ...WORD_BANK.medium, ...WORD_BANK.hard];

const GAME_W = 560;
const GAME_H = 620;
const LANE_COUNT = 4;
const LANE_W = GAME_W / LANE_COUNT;

let uid = 1;

function pickWord(score, activeWords) {
  const pool = score < 20
    ? WORD_BANK.easy
    : score < 50
    ? [...WORD_BANK.easy, ...WORD_BANK.medium]
    : ALL_WORDS;
  const available = activeWords ? pool.filter((w) => !activeWords.includes(w)) : pool;
  const source = available.length > 0 ? available : pool;
  return source[Math.floor(Math.random() * source.length)];
}

function makeFish(score, activeWords, startCy) {
  const word = pickWord(score, activeWords);
  const color = FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];
  const lane = Math.floor(Math.random() * LANE_COUNT);
  const cx = lane * LANE_W + LANE_W / 2 + (Math.random() - 0.5) * 24;
  const bodyW = Math.max(100, word.length * 13 + 50);
  const bodyH = 54;
  const speed = 0.18 + Math.random() * 0.12 + Math.min(score * 0.004, 0.38);
  const facingLeft = Math.random() > 0.5;
  const cy = startCy !== undefined ? startCy : GAME_H + bodyH + 20;
  return {
    id: uid++,
    word,
    color,
    cx,
    cy,
    bodyW,
    bodyH,
    speed,
    wobble: Math.random() * Math.PI * 2,
    scale: startCy !== undefined ? 1 : 0,
    popping: false,
    popT: 0,
    facingLeft,
    tailWag: Math.random() * Math.PI * 2,
  };
}

function FishShape({ fish, isMatching, typed, ts }) {
  const { color, bodyW, bodyH, facingLeft, word } = fish;
  const typedPart = isMatching ? typed.toUpperCase() : "";
  const restPart = word.slice(typedPart.length);
  const totalW = bodyW + bodyH * 0.55;
  const totalH = bodyH + 20;
  const tailWag = Math.sin((ts || 0) / 300 + fish.tailWag) * 10;

  const bx = facingLeft ? bodyH * 0.55 : 0;
  const tx = facingLeft ? 0 : bodyW;

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      style={{ overflow: "visible", filter: isMatching ? `drop-shadow(0 0 10px ${color.glow}) drop-shadow(0 0 20px ${color.glow}88)` : `drop-shadow(0 4px 10px ${color.glow}55)` }}
    >
      <defs>
        <radialGradient id={"bg" + fish.id} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={color.belly} />
          <stop offset="100%" stopColor={color.body} />
        </radialGradient>
        <radialGradient id={"fg" + fish.id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color.fin} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color.fin} />
        </radialGradient>
      </defs>

      {/* Tail */}
      <g transform={`translate(${tx}, ${totalH / 2}) rotate(${facingLeft ? tailWag : -tailWag})`}>
        <polygon
          points={facingLeft
            ? `0,0 ${-bodyH * 0.55},${-bodyH * 0.42} ${-bodyH * 0.55},${bodyH * 0.42}`
            : `0,0 ${bodyH * 0.55},${-bodyH * 0.42} ${bodyH * 0.55},${bodyH * 0.42}`
          }
          fill={color.fin}
          stroke={color.fin}
          strokeWidth="1"
          opacity="0.9"
        />
      </g>

      {/* Body */}
      <ellipse
        cx={bx + bodyW / 2}
        cy={totalH / 2}
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={"url(#bg" + fish.id + ")"}
        stroke={color.fin}
        strokeWidth="2.5"
      />

      {/* Top fin */}
      <ellipse
        cx={bx + bodyW * (facingLeft ? 0.55 : 0.45)}
        cy={totalH / 2 - bodyH / 2}
        rx={bodyW * 0.18}
        ry={bodyH * 0.28}
        fill={"url(#fg" + fish.id + ")"}
        transform={`rotate(${facingLeft ? -15 : 15}, ${bx + bodyW * 0.5}, ${totalH / 2 - bodyH / 2})`}
      />

      {/* Shine */}
      <ellipse
        cx={bx + bodyW * (facingLeft ? 0.62 : 0.38)}
        cy={totalH / 2 - bodyH * 0.18}
        rx={bodyW * 0.1}
        ry={bodyH * 0.13}
        fill="rgba(255,255,255,0.45)"
        transform={`rotate(${facingLeft ? -20 : 20}, ${bx + bodyW * 0.5}, ${totalH / 2})`}
      />

      {/* Scales line */}
      <path
        d={`M ${bx + bodyW * 0.3} ${totalH / 2 + bodyH * 0.05} Q ${bx + bodyW * 0.5} ${totalH / 2 - bodyH * 0.08} ${bx + bodyW * 0.7} ${totalH / 2 + bodyH * 0.05}`}
        fill="none"
        stroke={color.fin}
        strokeWidth="1.2"
        opacity="0.4"
      />

      {/* Eye */}
      <circle
        cx={bx + (facingLeft ? bodyW * 0.82 : bodyW * 0.18)}
        cy={totalH / 2 - bodyH * 0.1}
        r={bodyH * 0.13}
        fill="white"
        stroke={color.fin}
        strokeWidth="1.5"
      />
      <circle
        cx={bx + (facingLeft ? bodyW * 0.82 + 1.5 : bodyW * 0.18 - 1.5)}
        cy={totalH / 2 - bodyH * 0.1}
        r={bodyH * 0.07}
        fill={color.eye === "#fff" ? "#333" : color.eye}
      />
      <circle
        cx={bx + (facingLeft ? bodyW * 0.84 : bodyW * 0.16)}
        cy={totalH / 2 - bodyH * 0.14}
        r={bodyH * 0.025}
        fill="white"
        opacity="0.8"
      />

      {/* Mouth */}
      <path
        d={`M ${bx + (facingLeft ? bodyW * 0.96 : bodyW * 0.04)} ${totalH / 2 + bodyH * 0.05} Q ${bx + (facingLeft ? bodyW * 0.99 : bodyW * 0.01)} ${totalH / 2 + bodyH * 0.12} ${bx + (facingLeft ? bodyW * 0.96 : bodyW * 0.04)} ${totalH / 2 + bodyH * 0.18}`}
        fill="none"
        stroke={color.fin}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Word label */}
      <rect
        x={bx + bodyW * 0.12}
        y={totalH / 2 - 10}
        width={bodyW * 0.76}
        height={20}
        rx={10}
        fill="rgba(0,0,0,0.22)"
      />
      <text
        x={bx + bodyW * 0.5}
        y={totalH / 2 + 5}
        textAnchor="middle"
        fontSize={13}
        fontWeight="900"
        fontFamily="'Segoe UI', system-ui, sans-serif"
        letterSpacing="2"
      >
        {typedPart && (
          <tspan fill="#fff" textDecoration="underline">{typedPart}</tspan>
        )}
        <tspan fill={color.text}>{restPart}</tspan>
      </text>
    </svg>
  );
}

const BUBBLE_POSITIONS = Array.from({ length: 18 }).map((_, i) => ({
  left: ((i * 43 + 11) % 90) + 5,
  size: (i % 3) * 6 + 6,
  delay: ((i * 0.37) % 3).toFixed(2),
  dur: ((i % 4) * 0.8 + 2.2).toFixed(1),
  bottom: ((i * 29) % 80),
}));

export default function UnderwaterWordGame() {
  const [phase, setPhase] = useState("idle");
  const [fishes, setFishes] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [particles, setParticles] = useState([]);
  const [typed, setTyped] = useState("");
  const [inputFlash, setInputFlash] = useState(null);
  const [ts, setTs] = useState(0);

  const animRef = useRef(null);
  const lastTsRef = useRef(null);
  const spawnRef = useRef(null);
  const stateRef = useRef({ score: 0, combo: 0, bestCombo: 0 });
  const phaseRef = useRef("idle");
  const gameOverFired = useRef(false);
  const inputRef = useRef(null);

  phaseRef.current = phase;

  const spawnMs = () => Math.max(2200 - stateRef.current.score * 22, 750);

  const triggerParticles = useCallback((cx, cy, color) => {
    const id = uid++;
    const pts = Array.from({ length: 14 }).map((_, i) => {
      const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 28 + Math.random() * 38;
      return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist, color: [color.body, color.belly, color.fin][i % 3] };
    });
    setParticles((p) => [...p, { id, cx, cy, pts }]);
    setTimeout(() => setParticles((p) => p.filter((x) => x.id !== id)), 700);
  }, []);

  const tryPop = useCallback((val) => {
    setFishes((prev) => {
      const match = prev.find((f) => !f.popping && f.word === val.toUpperCase());
      if (!match) return prev;
      const newCombo = stateRef.current.combo + 1;
      const pts = match.word.length + Math.floor(newCombo / 3);
      stateRef.current.combo = newCombo;
      stateRef.current.score += pts;
      if (newCombo > stateRef.current.bestCombo) stateRef.current.bestCombo = newCombo;
      setScore(stateRef.current.score);
      setCombo(newCombo);
      setBestCombo(stateRef.current.bestCombo);
      triggerParticles(match.cx, match.cy, match.color);
      setInputFlash("hit");
      setTimeout(() => { setInputFlash(null); setTyped(""); if (inputRef.current) inputRef.current.value = ""; }, 220);
      return prev.map((f) => f.id === match.id ? { ...f, popping: true, popT: 0 } : f);
    });
  }, [triggerParticles]);

  const handleInput = useCallback((e) => {
    const val = e.target.value.replace(/\s/g, "").toUpperCase();
    setTyped(val);
    tryPop(val);
  }, [tryPop]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      const val = typed.trim();
      if (val) {
        const found = fishes.find((f) => !f.popping && f.word === val.toUpperCase());
        if (!found) {
          stateRef.current.combo = 0;
          setCombo(0);
          setInputFlash("miss");
          setTimeout(() => setInputFlash(null), 400);
        }
        setTyped("");
        if (inputRef.current) inputRef.current.value = "";
      }
    }
  }, [typed, fishes]);

  useEffect(() => {
    if (phase !== "playing") { cancelAnimationFrame(animRef.current); return; }
    gameOverFired.current = false;

    const tick = (timestamp) => {
      if (!lastTsRef.current) lastTsRef.current = timestamp;
      const dt = Math.min(timestamp - lastTsRef.current, 50);
      lastTsRef.current = timestamp;

      setTs(timestamp);

      if (!spawnRef.current) spawnRef.current = 0;
      spawnRef.current += dt;
      if (spawnRef.current >= spawnMs()) {
        spawnRef.current = 0;
        setFishes((prev) => {
          const active = prev.filter((f) => !f.popping);
          if (active.length >= 7) return prev;
          const activeWords = active.map((f) => f.word);
          return [...prev, makeFish(stateRef.current.score, activeWords)];
        });
      }

      setFishes((prev) => {
        let hit = false;
        const next = prev.map((f) => {
          if (f.popping) {
            const pt = f.popT + dt / 240;
            if (pt >= 1) return null;
            return { ...f, popT: pt, scale: 1 + pt * 0.5 };
          }
          const newCy = f.cy - f.speed * dt * 0.05;
          const wx = Math.sin(timestamp / 1000 + f.wobble) * 3;
          const halfW = (f.bodyW + f.bodyH * 0.55) / 2;
          const newCx = Math.max(halfW + 6, Math.min(GAME_W - halfW - 6, f.cx + wx * 0.02));
          const newScale = f.scale < 1 ? Math.min(1, f.scale + 0.055) : 1;
          const th = f.bodyH + 20;
          if (newCy - th / 2 <= 8) {
            hit = true;
            return { ...f, cy: th / 2 + 8, cx: newCx };
          }
          return { ...f, cy: newCy, cx: newCx, scale: newScale };
        }).filter(Boolean);

        if (hit && !gameOverFired.current) {
          gameOverFired.current = true;
          setTimeout(() => setPhase("over"), 120);
        }
        return next;
      });

      animRef.current = requestAnimationFrame(tick);
    };

    lastTsRef.current = null;
    spawnRef.current = 0;
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase]);

  const startGame = () => {
    uid = 1;
    const initialFishes = [];
    const usedWords = [];
    const startPositions = [GAME_H * 0.75, GAME_H * 0.55, GAME_H * 0.38];
    for (let i = 0; i < 3; i++) {
      const f = makeFish(0, usedWords, startPositions[i]);
      usedWords.push(f.word);
      initialFishes.push(f);
    }
    setFishes(initialFishes);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setParticles([]);
    setTyped("");
    stateRef.current = { score: 0, combo: 0, bestCombo: 0 };
    gameOverFired.current = false;
    setPhase("playing");
    setTimeout(() => inputRef.current && inputRef.current.focus(), 80);
  };

  const matchingFish = fishes.find((f) => !f.popping && typed && f.word.startsWith(typed.toUpperCase()));

  const IDLE_FISHES = [
    { word: "DIVE",    color: FISH_COLORS[0], cx: "12%",  cy: "18%", facingLeft: false, delay: "0s",   dur: "3.2s" },
    { word: "OCEAN",   color: FISH_COLORS[3], cx: "58%",  cy: "12%", facingLeft: true,  delay: "0.5s", dur: "2.9s" },
    { word: "CORAL",   color: FISH_COLORS[4], cx: "80%",  cy: "30%", facingLeft: true,  delay: "0.2s", dur: "3.7s" },
    { word: "FISH",    color: FISH_COLORS[1], cx: "20%",  cy: "52%", facingLeft: false, delay: "0.8s", dur: "3s"   },
    { word: "WHALE",   color: FISH_COLORS[5], cx: "55%",  cy: "60%", facingLeft: true,  delay: "0.4s", dur: "4.1s" },
    { word: "REEF",    color: FISH_COLORS[6], cx: "78%",  cy: "65%", facingLeft: false, delay: "1s",   dur: "2.7s" },
    { word: "PEARL",   color: FISH_COLORS[2], cx: "36%",  cy: "78%", facingLeft: true,  delay: "0.6s", dur: "3.4s" },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 12px", background: "transparent" }}>

      {phase === "idle" && (
        <div style={{ position: "relative", width: GAME_W, maxWidth: "100%", height: GAME_H, borderRadius: 28, overflow: "hidden", border: "3px solid #0984E3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#001a33 0%,#003366 40%,#006994 70%,#0099aa 100%)", zIndex: 0 }} />

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, zIndex: 1 }}>
            <svg viewBox={`0 0 ${GAME_W} 60`} width={GAME_W} height={60} preserveAspectRatio="none">
              <path d={`M0,30 Q${GAME_W*0.15},5 ${GAME_W*0.3},25 Q${GAME_W*0.45},45 ${GAME_W*0.6},20 Q${GAME_W*0.75},0 ${GAME_W*0.9},28 Q${GAME_W},40 ${GAME_W},30 L${GAME_W},60 L0,60 Z`} fill="#1a4a1a" />
              <path d={`M0,40 Q${GAME_W*0.2},20 ${GAME_W*0.4},35 Q${GAME_W*0.6},50 ${GAME_W*0.8},30 Q${GAME_W*0.9},22 ${GAME_W},35 L${GAME_W},60 L0,60 Z`} fill="#2d5a1b" opacity="0.7" />
            </svg>
          </div>

          {BUBBLE_POSITIONS.slice(0, 12).map((b, i) => (
            <div key={i} style={{
              position: "absolute",
              left: b.left + "%",
              bottom: b.bottom + "%",
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.08)",
              zIndex: 2,
              animation: `riseBubble ${b.dur}s ease-in ${b.delay}s infinite`,
            }} />
          ))}

          {IDLE_FISHES.map((f, i) => {
            const bw = Math.max(100, f.word.length * 13 + 50);
            const bh = 52;
            return (
              <div key={i} style={{
                position: "absolute",
                left: f.cx, top: f.cy,
                transform: "translate(-50%,-50%)",
                animation: `floatFish ${f.dur} ease-in-out ${f.delay} infinite alternate`,
                zIndex: 4,
              }}>
                <FishShape
                  fish={{ id: "idle" + i, word: f.word, color: f.color, bodyW: bw, bodyH: bh, facingLeft: f.facingLeft, wobble: i, tailWag: i * 1.2 }}
                  isMatching={false}
                  typed=""
                  ts={0}
                />
              </div>
            );
          })}

          <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 28px" }}>
            <div style={{ fontSize: 52, marginBottom: 4, animation: "bounceLogo 1.6s ease-in-out infinite alternate" }}>🌊</div>
            <h1 style={{ fontSize: 44, fontWeight: 900, margin: "0 0 8px", letterSpacing: 2, background: "linear-gradient(135deg,#74B9FF,#55EFC4,#FFEAA7,#FD79A8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>
              DEEP SEA WORDS
            </h1>
            <p style={{ color: "rgba(180,230,255,0.85)", fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
              Type the word to catch each fish before it swims to the surface!
            </p>
            <button onClick={startGame} style={{ fontSize: 22, padding: "15px 52px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#0984E3,#55EFC4,#74B9FF)", color: "#fff", cursor: "pointer", fontWeight: 900, boxShadow: "0 0 36px rgba(9,132,227,0.6), 0 6px 20px rgba(0,0,0,0.3)", animation: "pulseBtn 2s ease-in-out infinite", letterSpacing: 1 }}>
              🌊 DIVE IN
            </button>
          </div>
        </div>
      )}

      {phase === "playing" && (
        <div style={{ width: GAME_W, maxWidth: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
            <div style={{ background: "#e8f4fd", border: "1.5px solid #74B9FF", borderRadius: 14, padding: "7px 18px", fontSize: 16, fontWeight: 700, color: "#0984E3" }}>
              🐟 Score: {score}
            </div>
            <div style={{ background: combo >= 3 ? "#e8fff8" : "#f5f5f5", border: combo >= 3 ? "1.5px solid #55EFC4" : "1.5px solid #eee", borderRadius: 14, padding: "7px 18px", fontSize: 15, fontWeight: 700, color: combo >= 3 ? "#00785a" : "#bbb", transition: "all 0.2s" }}>
              {combo >= 2 ? ("🌊 x" + combo) : "Combo: 0"}
            </div>
          </div>

          <div style={{ position: "relative", width: GAME_W, height: GAME_H, borderRadius: 28, overflow: "hidden", border: "3px solid #0984E3" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#001a33 0%,#003366 40%,#006994 70%,#0099aa 100%)", zIndex: 0 }} />

            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                position: "absolute",
                left: ((i * 13 + 5) % 92) + "%",
                bottom: ((i * 23 + 5) % 88) + "%",
                width: (i % 3) * 5 + 6,
                height: (i % 3) * 5 + 6,
                borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.07)",
                zIndex: 1,
                animation: `riseBubble ${(i % 4) * 0.8 + 2.2}s ease-in ${(i * 0.4).toFixed(1)}s infinite`,
              }} />
            ))}

            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 50, zIndex: 2 }}>
              <svg viewBox={`0 0 ${GAME_W} 50`} width={GAME_W} height={50} preserveAspectRatio="none">
                <path d={`M0,25 Q${GAME_W*0.15},5 ${GAME_W*0.3},20 Q${GAME_W*0.45},38 ${GAME_W*0.6},15 Q${GAME_W*0.75},0 ${GAME_W*0.9},22 Q${GAME_W},32 ${GAME_W},25 L${GAME_W},50 L0,50 Z`} fill="#1a4a1a" />
              </svg>
            </div>

            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, zIndex: 20, background: "linear-gradient(90deg,#74B9FF,#55EFC4,#FFEAA7,#FD79A8,#A29BFE,#74B9FF)" }} />

            {fishes.map((f) => {
              const isMatching = !f.popping && typed && f.word.startsWith(typed.toUpperCase());
              const tw = f.bodyW + f.bodyH * 0.55;
              const th = f.bodyH + 20;
              const opacity = f.popping ? Math.max(0, 1 - f.popT) : 1;
              const sc = f.popping ? 1 + f.popT * 0.5 : f.scale;
              return (
                <div key={f.id} style={{
                  position: "absolute",
                  left: f.cx - tw / 2,
                  top: f.cy - th / 2,
                  width: tw, height: th,
                  transform: `scale(${sc})`,
                  transformOrigin: "center center",
                  opacity,
                  zIndex: f.popping ? 5 : (isMatching ? 4 : 2),
                  userSelect: "none",
                }}>
                  <FishShape fish={f} isMatching={isMatching} typed={typed} ts={ts} />
                </div>
              );
            })}

            {particles.map((p) =>
              p.pts.map((pt, i) => (
                <div key={p.id + "-" + i} style={{
                  position: "absolute", width: 9, height: 9, borderRadius: "50%",
                  background: pt.color,
                  left: p.cx - 4, top: p.cy - 4,
                  pointerEvents: "none", zIndex: 15,
                  animation: "popOut 0.6s ease-out forwards",
                  animationDelay: (i * 0.018) + "s",
                  "--dx": pt.dx + "px", "--dy": pt.dy + "px",
                }} />
              ))
            )}

            <div style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", zIndex: 25, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: "80%" }}>
              {matchingFish && (
                <div style={{ fontSize: 12, color: "rgba(180,230,255,0.9)", letterSpacing: 1, fontWeight: 700 }}>
                  Catching: <span style={{ color: "#55EFC4" }}>{matchingFish.word}</span>
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                placeholder="Type to catch a fish..."
                style={{
                  width: "100%",
                  fontSize: 22,
                  fontWeight: 700,
                  textAlign: "center",
                  padding: "10px 20px",
                  borderRadius: 50,
                  border: inputFlash === "hit"
                    ? "3px solid #55EFC4"
                    : inputFlash === "miss"
                    ? "3px solid #FF6B6B"
                    : "2px solid rgba(116,185,255,0.5)",
                  background: "rgba(0,20,50,0.75)",
                  color: inputFlash === "hit" ? "#55EFC4" : inputFlash === "miss" ? "#FF6B6B" : "#74B9FF",
                  outline: "none",
                  letterSpacing: 3,
                  transition: "border 0.15s, color 0.15s",
                  boxSizing: "border-box",
                  animation: inputFlash === "miss" ? "shakeInput 0.32s ease" : "none",
                }}
              />
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#aaa", marginTop: 8 }}>
            Type the word — auto-catches when complete! Don't let fish reach the surface!
          </p>
        </div>
      )}

      {phase === "over" && (
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 60, marginBottom: 6 }}>🐟</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 6px", background: "linear-gradient(135deg,#74B9FF,#55EFC4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Fish Got Away!
          </h2>
          <p style={{ color: "#888", marginBottom: 24, fontSize: 15 }}>A fish swam to the surface! Try again?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            {[
              { label: "Final Score", val: score, color: "#0984E3" },
              { label: "Best Combo", val: "x" + bestCombo, color: "#E17055" },
              { label: "Fish Caught", val: score, color: "#00B894" },
              { label: "Rating", val: score >= 80 ? "S+" : score >= 50 ? "A" : score >= 25 ? "B" : "C", color: score >= 80 ? "#F9CA24" : "#A29BFE" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: "#e8f4fd", borderRadius: 16, padding: "18px 12px" }}>
                <div style={{ fontSize: 12, color: "#bbb", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 16, color: "#555", marginBottom: 24 }}>
            {score >= 80 ? "🏆 Master fisherman!" : score >= 50 ? "🌊 Great diving skills!" : score >= 25 ? "🐟 Keep fishing!" : "🎣 The ocean awaits!"}
          </div>
          <button onClick={startGame} style={{ fontSize: 20, padding: "13px 44px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#0984E3,#55EFC4)", color: "#fff", cursor: "pointer", fontWeight: 900, boxShadow: "0 6px 24px rgba(9,132,227,0.4)" }}>
            Dive Again 🌊
          </button>
        </div>
      )}

      <style>{`
        @keyframes popOut {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        @keyframes floatFish {
          0%   { transform: translate(-50%,-50%) translateY(0px); }
          100% { transform: translate(-50%,-50%) translateY(-22px); }
        }
        @keyframes riseBubble {
          0%   { transform: translateY(0) scale(1); opacity: 0.7; }
          100% { transform: translateY(-${GAME_H}px) scale(1.3); opacity: 0; }
        }
        @keyframes bounceLogo {
          0%   { transform: scale(1) rotate(-5deg); }
          100% { transform: scale(1.18) rotate(5deg); }
        }
        @keyframes pulseBtn {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.05); }
        }
        @keyframes shakeInput {
          0%,100% { transform: translateX(-50%); }
          25%      { transform: translateX(calc(-50% - 8px)); }
          75%      { transform: translateX(calc(-50% + 8px)); }
        }
      `}</style>
    </div>
  );
}