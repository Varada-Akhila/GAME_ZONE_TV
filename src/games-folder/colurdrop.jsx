import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ---- Color palette (name -> hex, plus a deeper shade used for gradients/shadows) --
const COLORS = {
  RED: { base: "#e54848", deep: "#a82d2d" },
  GREEN: { base: "#2fbf6a", deep: "#1c8a4a" },
  BLUE: { base: "#3a7bf0", deep: "#1f4fb0" },
  YELLOW: { base: "#eccb3a", deep: "#b89518" },
  ORANGE: { base: "#ef9332", deep: "#b8611a" },
  PINK: { base: "#ec5fa3", deep: "#b8336f" },
  BROWN: { base: "#9a6a3c", deep: "#6b4423" },
};
const ALL_COLOR_NAMES = Object.keys(COLORS);

// ---- Tiny Web Audio helper (replaces the missing success.wav / wrong.wav) --------
function useGameAudio() {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctxRef.current = new AudioCtx();
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (freq, duration, startDelay = 0, type = "sine") => {
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t0 = ctx.currentTime + startDelay;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    },
    [getCtx]
  );

  const playSuccess = useCallback(() => {
    tone(523.25, 0.16, 0);
    tone(783.99, 0.22, 0.1);
  }, [tone]);

  const playWrong = useCallback(() => {
    tone(180, 0.28, 0, "sawtooth");
  }, [tone]);

  const playWin = useCallback(() => {
    [523.25, 587.33, 659.25, 783.99].forEach((f, i) => tone(f, 0.2, i * 0.1));
  }, [tone]);

  return { playSuccess, playWrong, playWin };
}

// ---- Level setup ------------------------------------------------------------------
function setupLevel(level) {
  const count = Math.min(level + 2, ALL_COLOR_NAMES.length);
  const selected = shuffle(ALL_COLOR_NAMES).slice(0, count);
  const poleOrder = shuffle(selected);

  const poles = poleOrder.map((name) => ({ color: name }));
  const rings = selected.map((name) => ({ color: name, placed: false }));

  return { poles, rings };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---- Main component ----------------------------------------------------------------
export default function ColorLearningGame() {
  const [level, setLevel] = useState(1);
  const [poles, setPoles] = useState(() => setupLevel(1).poles);
  const [rings, setRings] = useState(() => setupLevel(1).rings);
  const [selectedPoleIndex, setSelectedPoleIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const wrongTimeoutRef = useRef(null);

  const { playSuccess, playWrong, playWin } = useGameAudio();

  useEffect(() => {
    const setup = setupLevel(level);
    setPoles(setup.poles);
    setRings(setup.rings);
    setSelectedPoleIndex(0);
    setGameOver(false);
  }, [level]);

  const currentRingIndex = useMemo(() => {
    const idx = rings.findIndex((r) => !r.placed);
    return idx === -1 ? null : idx;
  }, [rings]);

  const placedCount = useMemo(
    () => rings.filter((r) => r.placed).length,
    [rings]
  );
  const totalCount = rings.length;
  const progressPct = totalCount ? (placedCount / totalCount) * 100 : 0;

  const placeOnPole = useCallback(
    (poleIndex) => {
      if (gameOver || currentRingIndex === null) return;
      const ring = rings[currentRingIndex];
      const pole = poles[poleIndex];

      if (ring.color === pole.color) {
        setRings((prev) => {
          const next = [...prev];
          next[currentRingIndex] = {
            ...next[currentRingIndex],
            placed: true,
            poleIndex,
          };
          return next;
        });
        playSuccess();
      } else {
        playWrong();
        setWrongFlash(true);
        clearTimeout(wrongTimeoutRef.current);
        wrongTimeoutRef.current = setTimeout(() => setWrongFlash(false), 650);
      }
    },
    [gameOver, currentRingIndex, rings, poles, playSuccess, playWrong]
  );

  useEffect(() => {
    if (rings.length > 0 && rings.every((r) => r.placed) && !gameOver) {
      setGameOver(true);
      playWin();
    }
  }, [rings, gameOver, playWin]);

  const nextLevel = useCallback(() => setLevel((l) => l + 1), []);

  useEffect(() => {
    function onKeyDown(e) {
      if (gameOver) {
        if (e.key === "Enter") nextLevel();
        return;
      }
      if (e.key === "ArrowLeft") {
        setSelectedPoleIndex((i) => (i - 1 + poles.length) % poles.length);
      } else if (e.key === "ArrowRight") {
        setSelectedPoleIndex((i) => (i + 1) % poles.length);
      } else if (e.key === "Enter") {
        placeOnPole(selectedPoleIndex);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameOver, poles.length, selectedPoleIndex, placeOnPole, nextLevel]);

  useEffect(() => () => clearTimeout(wrongTimeoutRef.current), []);

  const unplacedRings = rings
    .map((r, i) => ({ ...r, originalIndex: i }))
    .filter((r) => !r.placed);

  const RADIUS = 19;
  const CIRC = 2 * Math.PI * RADIUS;

  return (
    <div className="clg-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Outfit:wght@400;500;600;700&display=swap');

        .clg-page * { box-sizing: border-box; }

        .clg-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          font-family: 'Outfit', sans-serif;
          color: #f3eefb;
          padding: 40px 18px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 26px;
          overflow: hidden;
          background:
            radial-gradient(ellipse 80% 55% at 50% 0%, rgba(255,209,102,0.10), transparent 60%),
            radial-gradient(circle at 18% 18%, rgba(122,90,210,0.35), transparent 45%),
            radial-gradient(circle at 85% 30%, rgba(58,123,240,0.18), transparent 40%),
            linear-gradient(165deg, #1a1130 0%, #261a47 45%, #160f29 100%);
        }

        .clg-starfield {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1.5px),
            radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1.5px);
          background-size: 140px 140px, 90px 90px;
          background-position: 0 0, 45px 60px;
          opacity: 0.35;
          pointer-events: none;
        }

        .clg-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border: 1px solid rgba(255,209,102,0.4);
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #ffd166;
          text-transform: uppercase;
          background: rgba(255,209,102,0.07);
        }

        .clg-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ffd166;
          box-shadow: 0 0 8px 2px rgba(255,209,102,0.8);
        }

        .clg-title {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: clamp(30px, 5vw, 46px);
          margin: 10px 0 6px;
          letter-spacing: -0.01em;
          background: linear-gradient(180deg, #fff6e6 10%, #ffd166 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .clg-subtitle {
          font-size: 14.5px;
          color: #c4b6e8;
          margin: 0;
          font-weight: 400;
        }

        .clg-headrow {
          display: flex;
          align-items: center;
          gap: 18px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .clg-ringprogress { flex-shrink: 0; }
        .clg-ringprogress circle.track { stroke: rgba(255,255,255,0.12); }
        .clg-ringprogress circle.fill {
          stroke: #ffd166;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.5s ease;
        }
        .clg-ringprogress text {
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
        }

        .clg-toast {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          color: #fff;
          background: linear-gradient(135deg, #f0625a, #c83c3c);
          box-shadow: 0 8px 22px -6px rgba(200,60,60,0.7);
          animation: clg-toast-in 0.25s ease-out;
        }

        @keyframes clg-toast-in {
          from { transform: translateY(-8px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .clg-stage {
          position: relative;
          width: 100%;
          max-width: 1080px;
          padding: 56px 28px 38px;
          border-radius: 28px;
          background:
            radial-gradient(ellipse 70% 100% at 50% 0%, rgba(255,255,255,0.05), transparent 70%),
            rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -30px rgba(0,0,0,0.6);
        }

        .clg-board {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: flex-end;
          gap: 30px 36px;
          position: relative;
        }

        .clg-plinth {
          position: absolute;
          left: 4%;
          right: 4%;
          bottom: 18px;
          height: 22px;
          border-radius: 12px;
          background: linear-gradient(180deg, #7a4f2a 0%, #5c3a1e 100%);
          box-shadow: 0 10px 24px -6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
          z-index: 0;
        }

        .clg-pole-col {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 96px;
          cursor: pointer;
          z-index: 1;
          border-radius: 14px;
          padding: 4px;
          transition: transform 0.15s ease;
        }
        .clg-pole-col:hover { transform: translateY(-2px); }
        .clg-pole-col:focus-visible {
          outline: 2px solid #ffd166;
          outline-offset: 4px;
        }

        .clg-spotlight {
          position: absolute;
          top: -40px;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,209,102,0.32) 0%, rgba(255,209,102,0.08) 55%, transparent 75%);
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
          z-index: 0;
        }
        .clg-pole-col.selected .clg-spotlight { opacity: 1; animation: clg-pulse 1.8s ease-in-out infinite; }

        @keyframes clg-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        .clg-ground-shadow {
          position: absolute;
          bottom: 14px;
          width: 70px;
          height: 16px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 75%);
          z-index: 0;
        }

        .clg-cone {
          width: 0; height: 0;
          border-left: 27px solid transparent;
          border-right: 27px solid transparent;
          border-bottom: 32px solid;
          margin-bottom: -3px;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));
          position: relative;
          z-index: 2;
        }

        .clg-poletube {
          width: 24px;
          height: 138px;
          border-radius: 7px;
          position: relative;
          z-index: 2;
          box-shadow: inset -4px 0 8px rgba(0,0,0,0.3), inset 3px 0 6px rgba(255,255,255,0.25), 0 6px 14px -4px rgba(0,0,0,0.5);
        }

        .clg-pole-col.selected .clg-poletube {
          box-shadow: inset -4px 0 8px rgba(0,0,0,0.25), inset 3px 0 6px rgba(255,255,255,0.3),
            0 0 0 3px #ffd166, 0 0 22px 4px rgba(255,209,102,0.65);
        }

        .clg-label {
          margin-top: 12px;
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #e9def7;
          background: rgba(255,255,255,0.07);
          padding: 4px 12px;
          border-radius: 999px;
          z-index: 2;
        }

        .clg-ring {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .clg-ring::before {
          content: "";
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          background: radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), rgba(255,255,255,0) 45%);
          pointer-events: none;
        }
        .clg-ring-hole {
          border-radius: 50%;
          width: 46%;
          height: 46%;
          background: #211638;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.6);
        }

        .clg-ring-on-pole {
          position: absolute;
          top: 58px;
          width: 88px;
          height: 88px;
          z-index: 3;
          box-shadow: 0 10px 18px -6px rgba(0,0,0,0.55);
          animation: clg-drop 0.4s cubic-bezier(.22,1.4,.4,1);
        }

        @keyframes clg-drop {
          0% { transform: translateY(-50px) scale(0.6); opacity: 0; }
          70% { transform: translateY(4px) scale(1.06); opacity: 1; }
          100% { transform: translateY(0) scale(1); }
        }

        .clg-shake { animation: clg-shake 0.4s ease-in-out; }
        @keyframes clg-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-7px) rotate(-1.5deg); }
          50% { transform: translateX(7px) rotate(1.5deg); }
          80% { transform: translateX(-4px); }
        }

        .clg-dock {
          width: 100%;
          max-width: 920px;
          padding: 18px 20px;
          border-radius: 22px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .clg-dock-label {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #ffd166;
          margin: 0 0 12px;
          text-align: center;
        }

        .clg-dock-row {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          min-height: 64px;
        }

        .clg-dock-ring {
          width: 58px;
          height: 58px;
        }

        .clg-dock-ring.current {
          animation: clg-bob 1.6s ease-in-out infinite;
        }

        @keyframes clg-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .clg-kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 26px;
          height: 24px;
          padding: 0 7px;
          margin: 0 2px;
          font-size: 12px;
          font-weight: 600;
          color: #2d1b4e;
          background: linear-gradient(180deg, #fff8e8, #ffd166);
          border-radius: 6px;
          box-shadow: 0 2px 0 rgba(0,0,0,0.25);
          vertical-align: middle;
        }

        .clg-hint {
          font-size: 13px;
          color: #ad9fce;
          text-align: center;
        }

        .clg-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,9,28,0.78);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          animation: clg-fade 0.25s ease-out;
        }
        @keyframes clg-fade { from { opacity: 0; } to { opacity: 1; } }

        .clg-overlay-card {
          position: relative;
          background: linear-gradient(160deg, #fffaf0, #fdf0d8);
          color: #2d1b4e;
          border-radius: 26px;
          padding: 44px 56px;
          text-align: center;
          box-shadow: 0 30px 70px -20px rgba(0,0,0,0.55);
          animation: clg-pop 0.35s cubic-bezier(.22,1.4,.4,1);
          overflow: hidden;
        }
        @keyframes clg-pop {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .clg-confetti {
          position: absolute;
          border-radius: 3px;
          opacity: 0.85;
        }

        .clg-overlay-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #2a9d5c;
          margin: 0 0 6px;
        }

        .clg-overlay-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 34px;
          font-weight: 700;
          margin: 0 0 10px;
        }

        .clg-overlay-text {
          font-size: 16px;
          color: #5a4a72;
          margin: 0 0 24px;
        }

        .clg-next-btn {
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 16px;
          background: linear-gradient(180deg, #ffd166, #f0b13a);
          color: #2d1b4e;
          border: none;
          border-radius: 14px;
          padding: 13px 30px;
          cursor: pointer;
          box-shadow: 0 8px 18px -6px rgba(240,177,58,0.7);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .clg-next-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 22px -6px rgba(240,177,58,0.8); }
        .clg-next-btn:focus-visible { outline: 3px solid #2d1b4e; outline-offset: 3px; }

        @media (prefers-reduced-motion: reduce) {
          .clg-pole-col.selected .clg-spotlight,
          .clg-dock-ring.current,
          .clg-ring-on-pole,
          .clg-overlay,
          .clg-overlay-card,
          .clg-toast { animation: none !important; }
        }

        @media (max-width: 480px) {
          .clg-pole-col { width: 78px; }
          .clg-poletube { height: 110px; width: 20px; }
        }
      `}</style>

      <div className="clg-starfield" aria-hidden="true" />

      <div className="clg-headrow">
        <svg className="clg-ringprogress" width="56" height="56" viewBox="0 0 48 48">
          <circle className="track" cx="24" cy="24" r={RADIUS} fill="none" strokeWidth="5" />
          <circle
            className="fill"
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            strokeWidth="5"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC - (progressPct / 100) * CIRC}
            transform="rotate(-90 24 24)"
          />
          <text x="24" y="28" textAnchor="middle" fontSize="13" fill="#fff">
            {placedCount}/{totalCount}
          </text>
        </svg>

        <div style={{ textAlign: "center" }}>
          <span className="clg-eyebrow">
            <span className="clg-eyebrow-dot" />
            Color Academy &middot; Level {level}
          </span>
          <h1 className="clg-title">Ring Toss Color Match</h1>
          <p className="clg-subtitle">Drop each ring onto the pole of the same color.</p>
        </div>
      </div>

      <div style={{ minHeight: "40px", display: "flex", alignItems: "center" }}>
        {wrongFlash && (
          <div className="clg-toast" role="alert">
            ✕ Not quite — try again
          </div>
        )}
      </div>

      <div className="clg-stage">
        <div className="clg-board">
          <div className="clg-plinth" aria-hidden="true" />
          {poles.map((pole, i) => {
            const isSelected = i === selectedPoleIndex && !gameOver;
            const placedRing = rings.find((r) => r.placed && r.poleIndex === i);
            const c = COLORS[pole.color];
            return (
              <div
                key={i}
                className={`clg-pole-col ${isSelected ? "selected" : ""} ${
                  wrongFlash && isSelected ? "clg-shake" : ""
                }`}
                onClick={() => {
                  setSelectedPoleIndex(i);
                  placeOnPole(i);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Pole, color ${pole.color}${isSelected ? ", selected" : ""}`}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                    setSelectedPoleIndex(i);
                    placeOnPole(i);
                  }
                }}
              >
                <div className="clg-spotlight" aria-hidden="true" />
                <div className="clg-ground-shadow" aria-hidden="true" />

                {placedRing && (
                  <div
                    className="clg-ring clg-ring-on-pole"
                    style={{
                      background: `linear-gradient(160deg, ${COLORS[placedRing.color].base}, ${COLORS[placedRing.color].deep})`,
                    }}
                  >
                    <div className="clg-ring-hole" />
                  </div>
                )}

                <div className="clg-cone" style={{ borderBottomColor: c.base }} />
                <div
                  className="clg-poletube"
                  style={{ background: `linear-gradient(90deg, ${c.deep}, ${c.base} 55%, ${c.deep})` }}
                />
                <span className="clg-label">{pole.color}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="clg-dock">
        <p className="clg-dock-label">
          {currentRingIndex !== null
            ? `Up next — ${rings[currentRingIndex].color.toLowerCase()} ring`
            : "All rings placed!"}
        </p>
        <div className="clg-dock-row">
          {unplacedRings.map((r) => {
            const isCurrent = r.originalIndex === currentRingIndex;
            const c = COLORS[r.color];
            return (
              <div
                key={r.originalIndex}
                className={`clg-ring clg-dock-ring ${isCurrent ? "current" : ""}`}
                style={{
                  background: `linear-gradient(160deg, ${c.base}, ${c.deep})`,
                  boxShadow: isCurrent
                    ? "0 0 0 3px #ffd166, 0 0 16px 4px rgba(255,209,102,0.6)"
                    : "0 3px 8px rgba(0,0,0,0.4)",
                }}
                title={r.color}
              >
                <div className="clg-ring-hole" />
              </div>
            );
          })}
        </div>
      </div>

      <p className="clg-hint">
        <span className="clg-kbd">←</span>
        <span className="clg-kbd">→</span> choose a pole &nbsp;·&nbsp;
        <span className="clg-kbd">Enter</span> drop the ring &nbsp;·&nbsp; or click a pole
      </p>

      {gameOver && (
        <div className="clg-overlay">
          <div className="clg-overlay-card">
            {[...Array(10)].map((_, i) => {
              const colorsList = Object.values(COLORS);
              const c = colorsList[i % colorsList.length].base;
              const left = (i * 37) % 100;
              const top = (i * 53) % 100;
              const rot = (i * 29) % 360;
              return (
                <span
                  key={i}
                  className="clg-confetti"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: "9px",
                    height: "9px",
                    background: c,
                    transform: `rotate(${rot}deg)`,
                  }}
                  aria-hidden="true"
                />
              );
            })}
            <p className="clg-overlay-eyebrow">Level cleared</p>
            <h2 className="clg-overlay-title">Congratulations! 🎉</h2>
            <p className="clg-overlay-text">
              All {totalCount} rings matched correctly — level {level} complete.
            </p>
            <button className="clg-next-btn" onClick={nextLevel} autoFocus>
              Next Level →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}