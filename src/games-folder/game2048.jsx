import { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 4;

const TILE_COLORS = {
  0: { bg: "#1a1a2e", text: "#1a1a2e", border: "#16213e" },
  2: { bg: "#e0f7fa", text: "#006064", border: "#b2ebf2" },
  4: { bg: "#b3e5fc", text: "#01579b", border: "#81d4fa" },
  8: { bg: "#f48fb1", text: "#880e4f", border: "#f06292" },
  16: { bg: "#ff8a65", text: "#bf360c", border: "#ff7043" },
  32: { bg: "#ff7043", text: "#fff", border: "#f4511e" },
  64: { bg: "#ef5350", text: "#fff", border: "#e53935" },
  128: { bg: "#ab47bc", text: "#fff", border: "#9c27b0" },
  256: { bg: "#7e57c2", text: "#fff", border: "#673ab7" },
  512: { bg: "#42a5f5", text: "#fff", border: "#2196f3" },
  1024: { bg: "#26c6da", text: "#fff", border: "#00acc1" },
  2048: { bg: "#ffd600", text: "#5d4037", border: "#f9a825" },
};

function getColor(val) {
  return TILE_COLORS[val] || { bg: "#ff1744", text: "#fff", border: "#d50000" };
}

function createEmptyGrid() {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
}

function addRandomTile(grid) {
  const empty = [];
  grid.forEach((row, r) => row.forEach((val, c) => { if (!val) empty.push([r, c]); }));
  if (!empty.length) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = grid.map(row => [...row]);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function initGrid() {
  let g = createEmptyGrid();
  g = addRandomTile(g);
  g = addRandomTile(g);
  return g;
}

function slideRow(row) {
  let arr = row.filter(v => v !== 0);
  let score = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr.splice(i + 1, 1);
    }
  }
  while (arr.length < GRID_SIZE) arr.push(0);
  return { row: arr, score };
}

function moveLeft(grid) {
  let score = 0;
  let moved = false;
  const newGrid = grid.map(row => {
    const { row: newRow, score: s } = slideRow(row);
    score += s;
    if (newRow.some((v, i) => v !== row[i])) moved = true;
    return newRow;
  });
  return { grid: newGrid, score, moved };
}

function rotateGrid(grid) {
  return grid[0].map((_, c) => grid.map(row => row[c]).reverse());
}

function move(grid, direction) {
  let rotations = { left: 0, up: 3, right: 2, down: 1 }[direction];
  let g = grid;
  for (let i = 0; i < rotations; i++) g = rotateGrid(g);
  const { grid: moved, score, moved: didMove } = moveLeft(g);
  let result = moved;
  for (let i = 0; i < (4 - rotations) % 4; i++) result = rotateGrid(result);
  return { grid: result, score, moved: didMove };
}

function isGameOver(grid) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c]) return false;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
}

function hasWon(grid) {
  return grid.some(row => row.some(v => v >= 2048));
}

export default function Game2048() {
  const [grid, setGrid] = useState(initGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => parseInt(localStorage.getItem("2048best") || "0"));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleMove = useCallback((direction) => {
    if (gameOver || (won && !keepPlaying)) return;
    setGrid(prev => {
      const { grid: newGrid, score: gained, moved } = move(prev, direction);
      if (!moved) return prev;
      const withNew = addRandomTile(newGrid);
      setScore(s => {
        const ns = s + gained;
        setBest(b => {
          const nb = Math.max(b, ns);
          localStorage.setItem("2048best", nb);
          return nb;
        });
        return ns;
      });
      if (isGameOver(withNew)) setGameOver(true);
      if (!won && hasWon(withNew)) setWon(true);
      setAnimKey(k => k + 1);
      return withNew;
    });
  }, [gameOver, won, keepPlaying]);

  useEffect(() => {
    const onKey = (e) => {
      const map = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

  // Touch support
  const [touchStart, setTouchStart] = useState(null);
  const onTouchStart = (e) => setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  const onTouchEnd = (e) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > Math.abs(dy)) handleMove(dx > 0 ? "right" : "left");
    else handleMove(dy > 0 ? "down" : "up");
    setTouchStart(null);
  };

  const restart = () => {
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
    setAnimKey(k => k + 1);
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0f23; }
        @keyframes popIn {
          0% { transform: scale(0.4); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse2048 {
          0%, 100% { box-shadow: 0 0 20px #ffd600, 0 0 40px #ffd600; }
          50% { box-shadow: 0 0 40px #ffd600, 0 0 80px #f9a825; }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tile-new { animation: popIn 0.18s ease forwards; }
      `}</style>

      <div style={styles.container}>
        
        {/* Side Panel for Info and Controls */}
        <div style={styles.sidePanel}>
          <div>
            <h1 style={styles.title}>2048</h1>
            <p style={styles.subtitle}>Join tiles, reach <span style={{ color: "#ffd600" }}>2048!</span></p>
          </div>
          
          <div style={styles.scoreArea}>
            <ScoreBox label="SCORE" value={score} />
            <ScoreBox label="BEST" value={best} />
          </div>
          
          <button style={styles.newBtn} onClick={restart}>New Game</button>
          
          <div style={styles.controlsBlock}>
            <p style={styles.hint}>↑ ↓ ← → or swipe</p>
            <div style={styles.arrowPad}>
              <button style={styles.arrowBtn} onClick={() => handleMove("up")}>▲</button>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={styles.arrowBtn} onClick={() => handleMove("left")}>◀</button>
                <button style={styles.arrowBtn} onClick={() => handleMove("down")}>▼</button>
                <button style={styles.arrowBtn} onClick={() => handleMove("right")}>▶</button>
              </div>
            </div>
          </div>

          <p style={styles.credit}>Original game by Gabriele Cirulli</p>
        </div>

        {/* Board */}
        <div style={styles.boardContainer}>
          <div
            style={styles.board}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Background cells */}
            {Array(GRID_SIZE * GRID_SIZE).fill(0).map((_, i) => (
              <div key={i} style={styles.emptyCell} />
            ))}

            {/* Tiles */}
            {grid.map((row, r) =>
              row.map((val, c) => {
                if (!val) return null;
                const color = getColor(val);
                const is2048 = val >= 2048;
                return (
                  <div
                    key={`${r}-${c}-${animKey}`}
                    className="tile-new"
                    style={{
                      ...styles.tile,
                      gridRow: r + 1,
                      gridColumn: c + 1,
                      background: color.bg,
                      color: color.text,
                      border: `3px solid ${color.border}`,
                      fontSize: val >= 1024 ? "1.4rem" : val >= 128 ? "1.7rem" : "2rem",
                      animation: is2048 ? "popIn 0.18s ease forwards, pulse2048 2s ease-in-out infinite" : "popIn 0.18s ease forwards",
                    }}
                  >
                    {val}
                  </div>
                );
              })
            )}

            {/* Overlay: Game Over */}
            {gameOver && (
              <div style={styles.overlay}>
                <div style={styles.overlayBox}>
                  <p style={styles.overlayTitle}>Game Over! 😢</p>
                  <p style={styles.overlayScore}>Score: {score}</p>
                  <button style={styles.overlayBtn} onClick={restart}>Try Again</button>
                </div>
              </div>
            )}

            {/* Overlay: Won */}
            {won && !keepPlaying && (
              <div style={styles.overlay}>
                <div style={{ ...styles.overlayBox, background: "rgba(255,214,0,0.15)", border: "2px solid #ffd600" }}>
                  <p style={{ ...styles.overlayTitle, color: "#ffd600" }}>You Win! 🎉</p>
                  <p style={styles.overlayScore}>Score: {score}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ ...styles.overlayBtn, background: "#ffd600", color: "#333" }} onClick={() => setKeepPlaying(true)}>Keep Going</button>
                    <button style={styles.overlayBtn} onClick={restart}>New Game</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function ScoreBox({ label, value }) {
  return (
    <div style={styles.scoreBox}>
      <span style={styles.scoreLabel}>{label}</span>
      <span style={styles.scoreValue}>{value}</span>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f1a2e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Nunito', sans-serif",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: 900, // Widened to allow side-by-side
    display: "flex",
    flexDirection: "row", // Changed from column to row
    flexWrap: "wrap", // Wraps to column on smaller screens
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  sidePanel: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    minWidth: 260,
    alignItems: "flex-start",
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: 900,
    color: "#ffd600",
    textShadow: "0 0 30px rgba(255,214,0,0.5)",
    lineHeight: 1,
  },
  subtitle: {
    color: "#7c8db5",
    fontSize: "0.95rem",
    marginTop: 6,
  },
  scoreArea: {
    display: "flex",
    gap: 12,
    width: "100%",
  },
  scoreBox: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: "10px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1, // Let boxes share equal space
    backdropFilter: "blur(10px)",
  },
  scoreLabel: {
    fontSize: "0.7rem",
    color: "#7c8db5",
    fontWeight: 700,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: "1.3rem",
    fontWeight: 900,
    color: "#fff",
  },
  newBtn: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "14px 0",
    width: "100%",
    fontSize: "1rem",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
    transition: "transform 0.1s",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  controlsBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
    background: "rgba(255,255,255,0.03)",
    padding: "20px",
    borderRadius: 16,
    width: "100%",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  hint: {
    color: "#7c8db5",
    fontSize: "0.85rem",
    fontWeight: 700,
  },
  arrowPad: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  arrowBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    borderRadius: 10,
    width: 48,
    height: 48,
    fontSize: "1.1rem",
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    transition: "background 0.15s",
  },
  credit: {
    color: "#4a5568",
    fontSize: "0.75rem",
    marginTop: "auto",
  },
  boardContainer: {
    flex: "1 1 320px", // Allows the board to grow but stay contained
    maxWidth: 480,
    width: "100%",
  },
  board: {
    position: "relative",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 12,
    display: "grid",
    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
    gap: 10,
    aspectRatio: "1",
    border: "2px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
  },
  emptyCell: {
    background: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.06)",
  },
  tile: {
    position: "relative", // Ensures it stays in the grid layout nicely
    width: "auto",
    height: "auto",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    cursor: "default",
    userSelect: "none",
    zIndex: 2,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(10,10,30,0.85)",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    backdropFilter: "blur(6px)",
    animation: "fadeSlide 0.3s ease",
  },
  overlayBox: {
    background: "rgba(255,255,255,0.08)",
    border: "2px solid rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: "30px 40px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  overlayTitle: {
    fontSize: "2rem",
    fontWeight: 900,
    color: "#fff",
  },
  overlayScore: {
    color: "#7c8db5",
    fontSize: "1rem",
  },
  overlayBtn: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 24px",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
  },
};