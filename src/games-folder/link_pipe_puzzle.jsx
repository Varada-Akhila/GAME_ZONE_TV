import { useReducer, useEffect } from "react";

/*
 2248 SMART TV EDITION (8x8 GRID) - STRICT 4-WAY D-PAD
 ─────────────────────────────────────────────────────
 • Controlled entirely via TV Remote (D-Pad Arrows + OK/Enter button).
 • NO DIAGONALS ALLOWED: Only Up, Down, Left, Right linking.
 • Free-roaming cursor allows routing to valid blocks.
*/

const COLS = 8;
const ROWS = 8;
const SPAWN = [2, 4, 8, 16];

const PALETTE = {
  2:    ["#FF9E4A", "#F4831F", "#9B3A00"],
  4:    ["#6FC3FF", "#4A9FE0", "#1A5A8A"],
  8:    ["#FF6FA8", "#F0306A", "#8A0035"],
  16:   ["#D4A8F0", "#9B59B6", "#5A1A80"],
  32:   ["#70E0A0", "#27AE60", "#0A6A30"],
  64:   ["#FFE566", "#F1C40F", "#8A6A00"],
  128:  ["#FFBA80", "#E67E22", "#8A4000"],
  256:  ["#80D4FF", "#2980B9", "#0A4A7A"],
  512:  ["#80FFB0", "#1ABC9C", "#007A50"],
  1024: ["#FFD080", "#F39C12", "#8A5000"],
  2048: ["#FF8080", "#E74C3C", "#8A1A00"],
};

function getCol(v) {
  const keys = Object.keys(PALETTE).map(Number).sort((a,b)=>a-b);
  for (const k of keys) if (v <= k) return PALETTE[k];
  return PALETTE[2048];
}

let uid = 0;
function mkCell(v) { return { value: v, id: ++uid }; }

function makeGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () =>
      mkCell(SPAWN[Math.floor(Math.random() * SPAWN.length)])
    )
  );
}

function gravity(grid) {
  const g = grid.map(r => r.map(c => c ? { ...c } : null));
  for (let c = 0; c < COLS; c++) {
    let w = ROWS - 1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (g[r][c]) { g[w][c] = g[r][c]; if (w !== r) g[r][c] = null; w--; }
    }
    while (w >= 0) {
      g[w][c] = mkCell(SPAWN[Math.floor(Math.random() * SPAWN.length)]);
      w--;
    }
  }
  return g;
}

// FIXED: STRICTLY 4-WAY MOVEMENT (No Diagonals)
function isAdj(a, b) {
  const dr = Math.abs(a.r - b.r);
  const dc = Math.abs(a.c - b.c);
  // Must be exactly 1 block away horizontally OR vertically, but not both
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

function canAdd(path, grid, r, c) {
  if (!grid[r] || !grid[r][c]) return false;
  if (path.length === 0) return true;
  
  const last = path[path.length - 1];
  if (!isAdj(last, { r, c })) return false;
  if (path.some(p => p.r === r && p.c === c)) return false;
  
  const cellVal = grid[r][c].value;
  const curTier = last.value;

  if (path.length === 1) return cellVal === curTier;
  return cellVal === curTier || cellVal === curTier * 2;
}

// FIXED: Only check 4 directions for glow highlights
function getReachable(path, grid) {
  if (path.length === 0) return new Set();
  const last = path[path.length - 1];
  const set = new Set();
  
  // Up, Down, Left, Right arrays
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  for (const [dr, dc] of dirs) {
    const nr = last.r + dr, nc = last.c + dc;
    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && canAdd(path, grid, nr, nc)) {
      set.add(`${nr},${nc}`);
    }
  }
  return set;
}

function calcResult(path) {
  if (path.length < 2) return null;
  const highest = Math.max(...path.map(p => p.value));
  return highest * 2;
}

function init() {
  return {
    grid: makeGrid(),
    cursor: { r: Math.floor(ROWS/2), c: Math.floor(COLS/2) },
    path: [],
    selecting: false,
    score: 0,
    moves: 0,
    flash: null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "MOVE": {
      const { dr, dc } = action;
      
      const nr = Math.max(0, Math.min(ROWS - 1, state.cursor.r + dr));
      const nc = Math.max(0, Math.min(COLS - 1, state.cursor.c + dc));

      if (!state.selecting) {
        return { ...state, cursor: { r: nr, c: nc } };
      }

      let newPath = [...state.path];

      if (newPath.length >= 2) {
        const prev = newPath[newPath.length - 2];
        if (prev.r === nr && prev.c === nc) {
          newPath.pop();
          return { ...state, cursor: { r: nr, c: nc }, path: newPath };
        }
      }

      if (canAdd(newPath, state.grid, nr, nc)) {
        newPath.push({ r: nr, c: nc, value: state.grid[nr][nc].value });
      }

      return { ...state, cursor: { r: nr, c: nc }, path: newPath };
    }

    case "ENTER": {
      if (!state.selecting) {
        const { r, c } = state.cursor;
        return {
          ...state,
          selecting: true,
          path: [{ r, c, value: state.grid[r][c].value }],
        };
      } else {
        if (state.path.length < 2) {
          return { ...state, selecting: false, path: [] };
        }

        const result = calcResult(state.path);
        const path = state.path;
        const g = state.grid.map(r => r.map(c => c ? { ...c } : null));

        path.slice(0,-1).forEach(p => { g[p.r][p.c] = null; });
        const last = path[path.length - 1];
        
        const mergedCell = mkCell(result);
        g[last.r][last.c] = mergedCell;

        const newGrid = gravity(g);
        
        let flashNode = null;
        for (let r=0; r<ROWS; r++) {
          for (let c=0; c<COLS; c++) {
            if (newGrid[r][c]?.id === mergedCell.id) flashNode = { r, c };
          }
        }

        return {
          ...state,
          grid: newGrid,
          score: state.score + result,
          moves: state.moves + 1,
          selecting: false,
          path: [],
          cursor: { r: flashNode.r, c: flashNode.c }, 
          flash: flashNode,
        };
      }
    }

    case "CANCEL":
      return { ...state, selecting: false, path: [] };

    case "CLEAR_FLASH":
      return { ...state, flash: null };

    case "NEW_GAME":
      return init();

    default:
      return state;
  }
}

const CELL = 54, GAP = 8, PAD = 12;
function cxy(r, c) {
  return { x: c*(CELL+GAP)+CELL/2+PAD, y: r*(CELL+GAP)+CELL/2+PAD };
}

export default function App() {
  const [st, dispatch] = useReducer(reducer, null, init);
  const { grid, cursor, path, selecting, score, moves, flash } = st;

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => dispatch({ type:"CLEAR_FLASH" }), 600);
    return () => clearTimeout(t);
  }, [flash]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowUp")    { e.preventDefault(); dispatch({ type:"MOVE", dr:-1, dc: 0 }); }
      if (e.key === "ArrowDown")  { e.preventDefault(); dispatch({ type:"MOVE", dr: 1, dc: 0 }); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); dispatch({ type:"MOVE", dr: 0, dc:-1 }); }
      if (e.key === "ArrowRight") { e.preventDefault(); dispatch({ type:"MOVE", dr: 0, dc: 1 }); }
      
      if (e.key === "Enter" || e.key === " ") { 
        e.preventDefault(); 
        dispatch({ type:"ENTER" }); 
      }
      if (e.key === "Escape" || e.key === "Backspace") { 
        e.preventDefault();
        dispatch({ type:"CANCEL" }); 
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pathMap = new Map(path.map((p,i) => [`${p.r},${p.c}`, i]));
  const reach = selecting ? getReachable(path, grid) : new Set();
  const result = calcResult(path);
  const highest = path.length > 0 ? Math.max(...path.map(p=>p.value)) : null;

  const lines = [];
  for (let i = 0; i < path.length-1; i++) {
    const a = cxy(path[i].r, path[i].c);
    const b = cxy(path[i+1].r, path[i+1].c);
    const upgrade = path[i+1].value > path[i].value;
    const [top] = getCol(path[i].value);
    lines.push(
      <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={upgrade ? "#FFD700" : top} strokeWidth={upgrade ? 8 : 6}
        strokeLinecap="round" opacity={0.95}
      />
    );
  }

  const gW = COLS*(CELL+GAP)-GAP+PAD*2;
  const gH = ROWS*(CELL+GAP)-GAP+PAD*2;

  return (
    <div style={{
      minHeight:"100vh", background:"#0a0f1a",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      fontFamily:"'Fredoka One',cursive", userSelect:"none", overflow:"hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
        * { box-sizing: border-box; }
        @keyframes tvPulse {
          0% { box-shadow: 0 0 0 4px #fff, 0 0 15px rgba(255,255,255,0.5); transform: scale(1.1); }
          50% { box-shadow: 0 0 0 7px #fff, 0 0 25px rgba(255,255,255,0.8); transform: scale(1.15); }
          100% { box-shadow: 0 0 0 4px #fff, 0 0 15px rgba(255,255,255,0.5); transform: scale(1.1); }
        }
        .tv-cursor { animation: tvPulse 1.2s infinite ease-in-out; z-index: 10; }
      `}</style>

      <h1 style={{ color:"#fff", fontSize:44, margin:"0 0 4px", letterSpacing:6, textShadow:"0 0 28px #F0306A" }}>
        2248 TV
      </h1>

      <div style={{ display:"flex", gap:16, marginBottom:10 }}>
        {[["SCORE",score,"#FFD700"],["MOVES",moves,"#fff"]].map(([lbl,val,clr])=>(
          <div key={lbl} style={{ background:"rgba(255,255,255,0.08)", borderRadius:16, padding:"6px 36px", textAlign:"center" }}>
            <div style={{ fontSize:10, color:"#888", letterSpacing:3 }}>{lbl}</div>
            <div style={{ color:clr, fontSize:22, fontWeight:700 }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 36, marginBottom: 10, display:"flex", alignItems:"center" }}>
        {selecting && result && (
          <div style={{
            padding:"4px 24px", borderRadius:20, background:"rgba(255,215,0,0.2)",
            border:"2px solid #FFD700", color:"#FFD700", fontSize:18, display:"flex", gap:10,
          }}>
            <span style={{ color:"#ccc", fontSize:14, alignSelf:"center" }}>Result:</span>
            <span>{highest} × 2 = {result}</span>
          </div>
        )}
      </div>

      <div style={{ position:"relative" }}>
        <svg width={gW} height={gH} style={{ position:"absolute", top:0, left:0, pointerEvents:"none", zIndex:10 }}>
          {lines}
        </svg>

        <div style={{
          background:"#121b2e", borderRadius:24, padding:PAD,
          boxShadow:"0 30px 80px rgba(0,0,0,0.9)", display:"grid",
          gridTemplateColumns:`repeat(${COLS}, ${CELL}px)`,
          gridTemplateRows:`repeat(${ROWS}, ${CELL}px)`, gap:GAP,
        }}>
          {grid.map((row,r) => row.map((cell,c) => {
            if (!cell) return <div key={`e${r}${c}`} />;
            
            const key = `${r},${c}`;
            const step = pathMap.has(key) ? pathMap.get(key) : -1;
            const inPath = step >= 0;
            const isFlash = flash?.r===r && flash?.c===c;
            const isCur = cursor.r===r && cursor.c===c;
            const isReach = reach.has(key);
            
            const isDim = selecting && !inPath && !isCur && !isReach;
            const isFirst = step === 0;
            const isLast = inPath && step === path.length-1;
            
            const [top,mid,bot] = getCol(cell.value);
            const fs = cell.value>=1000?14:cell.value>=100?18:cell.value>=10?22:26;

            return (
              <div key={cell.id} className={isCur ? "tv-cursor" : ""}
                style={{
                  width:CELL, height:CELL, borderRadius:"50%",
                  background:`radial-gradient(circle at 36% 28%, ${top} 0%, ${mid} 52%, ${bot} 100%)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:fs, fontWeight:900, color:"#fff", textShadow:"0 3px 6px rgba(0,0,0,0.7)",
                  position:"relative",
                  transition:"transform 0.15s, box-shadow 0.15s, opacity 0.15s",
                  transform: isFlash ? "scale(1.4)" : inPath && !isCur ? "scale(1.1) translateY(-4px)" : "scale(1)",
                  boxShadow: isFlash ? "0 0 0 8px #fff, 0 0 50px #fff"
                           : inPath && !isCur ? "0 0 0 4px #FFD700, 0 0 20px rgba(255,215,0,0.6)"
                           : isReach && !isCur ? `0 0 0 4px ${top}, 0 0 20px ${top}AA` 
                           : `0 4px 0 ${bot}`,
                  opacity: isDim ? 0.25 : 1, zIndex: inPath || isCur ? 4 : 1,
                }}
              >
                {cell.value}
                {inPath && (
                  <span style={{
                    position:"absolute", top:isFirst?"auto":-5, bottom:isFirst?-5:"auto", right:-5,
                    background:isFirst?"#4A9FE0":isLast?"#27AE60":"#FFD700", color:"#000",
                    borderRadius:"50%", width:18, height:18, fontSize:10, fontWeight:900,
                    display:"flex", alignItems:"center", justifyContent:"center", zIndex:6,
                  }}>{step+1}</span>
                )}
              </div>
            );
          }))}
        </div>
      </div>

      <div style={{
        marginTop:20, padding:"10px 30px", borderRadius:24, minWidth:500, textAlign:"center",
        background:selecting?"rgba(255,215,0,0.1)":"rgba(255,255,255,0.05)",
        border:`2px solid ${selecting?"rgba(255,215,0,0.4)":"rgba(255,255,255,0.1)"}`,
        color:selecting?"#FFD700":"#aaa", fontSize:14, fontWeight:selecting?700:400,
      }}>
        {!selecting && "Use D-PAD (Up/Down/Left/Right) · Press OK to Select"}
        {selecting && path.length < 2 && `Move to a glowing ${path[0]?.value} to link (No Diagonals)`}
        {selecting && path.length >= 2 && "Press OK again to Merge!"}
      </div>

    </div>
  );
}