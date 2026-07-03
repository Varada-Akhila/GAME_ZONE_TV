import { useState, useEffect, useCallback, useRef } from "react";



/* ═══════════════════════════════════════════════════════

   NUMBER LINE MATCH (3-Number Match & Rare 5s Edition)

   • 10-sums are common, identical matches (5s) are rare.

   • Select 2 OR 3 numbers that sum to 10.

   • Select exactly 2 identical numbers to match them.

   • STRICT LINES: Must be Horizontal, Vertical, or Diagonal.

   • Skips over empty cells.

   • AUTO-ADD: Duplicates remaining numbers for the FIRST MATCH ONLY.

   • CONTROLS: Arrow Keys + Enter

═══════════════════════════════════════════════════════ */



const COLS = 9;

const INIT_ROWS = 4;

const COLORS = [

  "#FF4D6D","#FF9F1C","#FFBF69","#2EC4B6","#3A86FF",

  "#8338EC","#FB5607","#06D6A0","#F72585","#ffffff",

];



const numColor = (n) => COLORS[(n - 1) % COLORS.length];



// Custom Pool: 1-4 and 6-9 appear twice as often as 5.

// This makes 10-sums common and identicals (like 5=5) rare!

const numPool = [1,1,2,2,3,3,4,4,6,6,7,7,8,8,9,9,5];



const makeRow = () => Array.from({ length: COLS }, () => numPool[Math.floor(Math.random() * numPool.length)]);

const makeGrid = () => Array.from({ length: INIT_ROWS }, makeRow);



// Check if two specific cells are unblocked and on a straight line

function isUnblockedAndCollinear(A, B, grid) {

  const [r1, c1] = A;

  const [r2, c2] = B;



  if (r1 > r2 || (r1 === r2 && c1 > c2)) return isUnblockedAndCollinear(B, A, grid);



  // Horizontal

  if (r1 === r2) {

    for (let c = c1 + 1; c < c2; c++) if (grid[r1][c] !== null) return false;

    return true;

  }

  // Vertical

  if (c1 === c2) {

    for (let r = r1 + 1; r < r2; r++) if (grid[r][c1] !== null) return false;

    return true;

  }

  // Diagonal

  if (Math.abs(r1 - r2) === Math.abs(c1 - c2)) {

    const dr = Math.sign(r2 - r1);

    const dc = Math.sign(c2 - c1);

    let r = r1 + dr, c = c1 + dc;

    while (r !== r2 && c !== c2) {

      if (grid[r][c] !== null) return false;

      r += dr; c += dc;

    }

    return true;

  }

  return false;

}



// Check if an array of 2 or 3 coordinates forms a valid, unblocked straight line sequence

function isValidLine(coords, grid) {

  if (coords.length < 2) return true;

 

  // Sort spatially (Top-Left to Bottom-Right reading order)

  const sorted = [...coords].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);



  const [r0, c0] = sorted[0];

  const [r1, c1] = sorted[1];

  const dr = Math.sign(r1 - r0);

  const dc = Math.sign(c1 - c0);



  // Verify full set is on the exact same trajectory

  for (let i = 1; i < sorted.length; i++) {

     const [ri, ci] = sorted[i];

     const [ri_prev, ci_prev] = sorted[i-1];

     const dr_i = Math.sign(ri - ri_prev);

     const dc_i = Math.sign(ci - ci_prev);

     

     if (dr_i !== dr || dc_i !== dc) return false; // Direction changed!

     if (dr !== 0 && dc !== 0) { // Diagonal consistency

        if (Math.abs(ri - ri_prev) !== Math.abs(ci - ci_prev)) return false;

     }

  }



  // Verify no unselected numbers exist between our selections

  for(let i = 0; i < sorted.length - 1; i++) {

    if (!isUnblockedAndCollinear(sorted[i], sorted[i+1], grid)) return false;

  }

 

  return true;

}



// Scans for 2-NUMBER OR 3-NUMBER valid moves

function hasAnyMoves(grid) {

  const R = grid.length;

  if (R === 0) return false;

  const C = grid[0].length;



  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]]; // Right, Down, Down-Right, Down-Left



  for (let r = 0; r < R; r++) {

    for (let c = 0; c < C; c++) {

      const valA = grid[r][c];

      if (valA === null) continue;



      for (let [dr, dc] of dirs) {

        let r2 = r + dr, c2 = c + dc;

        let valB = null, rB = -1, cB = -1;



        // Find next block (B)

        while (r2 >= 0 && r2 < R && c2 >= 0 && c2 < C) {

          if (grid[r2][c2] !== null) {

            valB = grid[r2][c2];

            rB = r2; cB = c2;

            break;

          }

          r2 += dr; c2 += dc;

        }



        if (valB !== null) {

          if (valA === valB || valA + valB === 10) return true; // Found 2-number match



          if (valA + valB < 10) {

             // Look further for a 3rd block (C)

             let r3 = rB + dr, c3 = cB + dc;

             let valC = null;

             while (r3 >= 0 && r3 < R && c3 >= 0 && c3 < C) {

               if (grid[r3][c3] !== null) {

                 valC = grid[r3][c3];

                 break;

               }

               r3 += dr; c3 += dc;

             }

             if (valC !== null && valA + valB + valC === 10) return true; // Found 3-number match!

          }

        }

      }

    }

  }

  return false;

}



function removeEmptyRows(grid) {

  return grid.filter(row => row.some(cell => cell !== null));

}



export default function NumberLineMatch() {

  const [grid,           setGrid]           = useState(makeGrid);

  const [selected,       setSelected]       = useState([]); // Now an Array of coordinates

  const [score,          setScore]          = useState(0);

  const [matches,        setMatches]        = useState(0);

  const [flash,          setFlash]          = useState([]);

  const [shake,          setShake]          = useState(false);

  const [gameOver,       setGameOver]       = useState(false);

  const [gameOverReason, setGameOverReason] = useState("");

  const [gameWon,        setGameWon]        = useState(false);

 

  const [cursor,         setCursor]         = useState([0, 0]);

 

  const rootRef = useRef(null);

  const matchCountRef = useRef(0);



  useEffect(() => {

    if (rootRef.current) rootRef.current.focus();

  }, []);



  useEffect(() => {

    if (grid.length === 0) return;

    if (grid.length >= 100) {

      setGameOver(true);

      setGameOverReason("Board Full!");

      return;

    }

    if (!hasAnyMoves(grid)) {

      setGameOver(true);

      setGameOverReason("No More Moves!");

    }

  }, [grid]);



  useEffect(() => {

    if (cursor[0] > grid.length && grid.length > 0) {

      setCursor([grid.length, Math.min(2, cursor[1])]);

    }

  }, [grid.length, cursor]);



  const restart = () => {

    setGrid(makeGrid());

    setSelected([]);

    setScore(0);

    setMatches(0);

    matchCountRef.current = 0;

    setFlash([]);

    setShake(false);

    setGameOver(false);

    setGameOverReason("");

    setGameWon(false);

    setCursor([0, 0]);

    setTimeout(() => rootRef.current?.focus(), 100);

  };



  const manualAddLines = () => {

    setGrid(prev => duplicateRemaining(prev));

    rootRef.current?.focus();

  };



  const duplicateRemaining = (currentGrid) => {

    const remaining = [];

    currentGrid.forEach(row => row.forEach(val => {

      if (val !== null) remaining.push(val);

    }));



    if (remaining.length === 0) return currentGrid;



    let newGrid = [...currentGrid];

    let newRow = [];

   

    for(let i=0; i < remaining.length; i++) {

      newRow.push(remaining[i]);

      if (newRow.length === COLS) {

        newGrid.push(newRow);

        newRow = [];

      }

    }

    if (newRow.length > 0) {

      while(newRow.length < COLS) newRow.push(null);

      newGrid.push(newRow);

    }

    return newGrid;

  };



  const isSelected = (r, c) => selected.some(([sr,sc]) => sr===r && sc===c);

  const isFlashing = (r, c) => flash.some(([fr,fc]) => fr===r && fc===c);

  const isCursor = (r, c) => cursor[0] === r && cursor[1] === c;

 

  const isBtnFocused = (btnIndex) => cursor[0] === grid.length && cursor[1] === btnIndex;



  const handleCell = useCallback((r, c) => {

    if (gameOver || gameWon) return;

    if (grid[r] === undefined || grid[r][c] === null) return;



    // Deselect if already clicked

    if (isSelected(r, c)) {

      setSelected(selected.filter(([sr,sc]) => sr!==r || sc!==c));

      return;

    }



    const newSel = [...selected, [r, c]];



    if (newSel.length === 1) {

      setSelected(newSel); // First pick

      return;

    }



    const isValid = isValidLine(newSel, grid);

    const sum = newSel.reduce((acc, [sr, sc]) => acc + grid[sr][sc], 0);

    const allSame = newSel.every(([sr, sc]) => grid[sr][sc] === grid[newSel[0][0]][newSel[0][1]]);



    const executeMatch = () => {

      setFlash(newSel);

      setSelected([]);

     

      matchCountRef.current += 1;

      const currentMatches = matchCountRef.current;

      const shouldAutoAdd = currentMatches === 1;



      setTimeout(() => {

        setGrid(prev => {

          const g = prev.map(row => [...row]);

          newSel.forEach(([fr, fc]) => { g[fr][fc] = null; });

         

          let finalGrid = removeEmptyRows(g);

          if (shouldAutoAdd) {

            finalGrid = duplicateRemaining(finalGrid);

          }

          if (finalGrid.length === 0) {

            setGameWon(true);

          }

          return finalGrid;

        });

       

        setScore(s => s + (newSel.length * 10)); // 20 for pair, 30 for trio

        setMatches(currentMatches);

        setFlash([]);

      }, 350);

    };



    if (newSel.length === 2) {

      if (isValid && (sum === 10 || allSame)) {

        executeMatch();

      } else if (isValid && sum < 10 && !allSame) {

        setSelected(newSel); // Valid sequence but needs 3rd number!

      } else {

        setShake(true);

        setSelected([[r, c]]); // Reset to only this new block

        setTimeout(() => setShake(false), 300);

      }

    }

    else if (newSel.length === 3) {

      if (isValid && sum === 10) {

        executeMatch();

      } else {

        setShake(true);

        setSelected([[r, c]]); // Reset to only this new block

        setTimeout(() => setShake(false), 300);

      }

    }

  }, [grid, selected, gameOver, gameWon]);



  const handleKeyDown = (e) => {

    if (gameOver || gameWon) return;

    const [r, c] = cursor;

    const isMenuRow = r === grid.length;



    switch (e.key) {

      case 'ArrowUp':

        e.preventDefault();

        if (isMenuRow) setCursor([grid.length - 1, Math.floor(COLS / 2)]);

        else setCursor([Math.max(0, r - 1), c]);

        break;

      case 'ArrowDown':

        e.preventDefault();

        if (r < grid.length - 1) setCursor([r + 1, c]);

        else if (r === grid.length - 1) setCursor([grid.length, 1]);

        break;

      case 'ArrowLeft':

        e.preventDefault();

        if (isMenuRow) setCursor([r, Math.max(0, c - 1)]);

        else setCursor([r, Math.max(0, c - 1)]);

        break;

      case 'ArrowRight':

        e.preventDefault();

        if (isMenuRow) setCursor([r, Math.min(2, c + 1)]);

        else setCursor([r, Math.min(COLS - 1, c + 1)]);

        break;

      case 'Enter':

      case ' ':

        e.preventDefault();

        if (isMenuRow) {

          if (c === 0) setSelected([]);

          else if (c === 1) manualAddLines();

          else if (c === 2) restart();

        } else {

          handleCell(r, c);

        }

        break;

      case 'Escape':

        e.preventDefault(); setSelected([]); break;

      default: break;

    }

  };



  const totalCells  = grid.reduce((a,r) => a + r.filter(c=>c!==null).length, 0);

  const rowCount    = grid.length;



  return (

    <div ref={rootRef} style={styles.root} tabIndex={0} onKeyDown={handleKeyDown}>

      <div style={styles.bgPattern} />



      <div style={styles.header}>

        <div style={styles.logoArea}>

          <span style={styles.logoIcon}>🔢</span>

          <span style={styles.logoText}>NumMatch</span>

        </div>

        <div style={styles.scoreBox}>

          <div style={styles.scoreLabel}>SCORE</div>

          <div style={styles.scoreVal}>{score}</div>

        </div>

      </div>



      <div style={styles.statsBar}>

        <div style={styles.stat}>

          <span style={styles.statLabel}>ROWS</span>

          <span style={{ ...styles.statVal, color: '#aaa' }}>{rowCount}</span>

        </div>

        <div style={styles.stat}>

          <span style={styles.statLabel}>MATCHES</span>

          <span style={styles.statVal}>{matches}</span>

        </div>

        <div style={styles.stat}>

          <span style={styles.statLabel}>CELLS LEFT</span>

          <span style={{ ...styles.statVal, color: totalCells < 10 ? '#06D6A0' : '#aaa' }}>{totalCells}</span>

        </div>

      </div>



      <div style={{ ...styles.gridWrap, animation: shake ? 'shakeX 0.3s ease' : 'none' }}>

        {grid.map((row, r) => (

          <div key={r} style={styles.row}>

            {row.map((val, c) => {

              const sel   = isSelected(r, c);

              const flas  = isFlashing(r, c);

              const curs  = isCursor(r, c);

              const empty = val === null;

              return (

                <div

                  key={c}

                  onClick={() => !empty && handleCell(r, c)}

                  onMouseEnter={() => setCursor([r, c])}

                  style={{

                    ...styles.cell,

                    ...(empty ? styles.cellEmpty : {}),

                    ...(curs  ? styles.cellCursor : {}),

                    ...(sel   ? { ...styles.cellSelected, '--nc': numColor(val) } : {}),

                    ...(flas  ? styles.cellFlash : {}),

                    cursor: empty ? 'default' : 'pointer',

                  }}

                >

                  {!empty && (

                    <span style={{

                      ...styles.cellNum,

                      color: sel || flas ? '#fff' : numColor(val),

                      transform: sel || curs ? 'scale(1.2)' : 'scale(1)',

                      transition: 'transform 0.15s',

                    }}>

                      {val}

                    </span>

                  )}

                </div>

              );

            })}

          </div>

        ))}

      </div>



      <div style={styles.hint}>

        Select <b>2 or 3</b> numbers that sum to 10 in a straight line.<br/>

        Use <b>Arrow Keys</b> to navigate.

      </div>



      <div style={styles.controls} onMouseLeave={() => cursor[0] === grid.length && setCursor([grid.length - 1, 4])}>

        <button

          onClick={() => setSelected([])}

          onMouseEnter={() => setCursor([grid.length, 0])}

          style={{ ...styles.btnClear, ...(isBtnFocused(0) ? styles.btnFocused : {}) }}

        >

          ✕ Clear Pick

        </button>

        <button

          onClick={manualAddLines}

          onMouseEnter={() => setCursor([grid.length, 1])}

          style={{ ...styles.btnAdd, ...(isBtnFocused(1) ? styles.btnFocused : {}) }}

        >

          ➕ Add Lines

        </button>

        <button

          onClick={restart}

          onMouseEnter={() => setCursor([grid.length, 2])}

          style={{ ...styles.btnRestart, ...(isBtnFocused(2) ? styles.btnFocused : {}) }}

        >

          ↺ Restart

        </button>

      </div>



      {gameWon && (

        <div style={styles.overlay}>

          <div style={styles.dialog}>

            <div style={styles.dialogEmoji}>🏆</div>

            <div style={{ ...styles.dialogTitle, color: '#06D6A0' }}>You Win!</div>

            <div style={styles.dialogSub}>Board cleared completely!</div>

            <div style={styles.dialogScore}>{score}</div>

            <div style={styles.dialogScoreLabel}>Final Score</div>

            <button onClick={restart} style={{ ...styles.dialogBtn, background: 'linear-gradient(135deg,#06D6A0,#2EC4B6)' }}>Play Again</button>

          </div>

        </div>

      )}



      {gameOver && !gameWon && (

        <div style={styles.overlay}>

          <div style={styles.dialog}>

            <div style={styles.dialogEmoji}>🛑</div>

            <div style={styles.dialogTitle}>{gameOverReason}</div>

            <div style={styles.dialogSub}>Try adding lines earlier next time!</div>

            <div style={styles.dialogScore}>{score}</div>

            <div style={styles.dialogScoreLabel}>points</div>

            <button onClick={restart} style={styles.dialogBtn}>Play Again</button>

          </div>

        </div>

      )}



      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&family=Syne+Mono&display=swap');

        @keyframes shakeX { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }

        @keyframes flashCell { 0%,100%{background:#fff2} 50%{background:#ffdd00cc} }

        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        div[tabIndex="0"]:focus { outline: none; }

      `}</style>

    </div>

  );

}



const styles = {

  root: { minHeight: '100vh', background: '#111116', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Space Grotesk', sans-serif", userSelect: 'none', padding: '0 0 24px', position: 'relative', overflow: 'hidden' },

  bgPattern: { position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 20% 20%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 80% 80%, #0d1b2a 0%, transparent 50%)' },

  header: { width: '100%', maxWidth: 440, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 10px', position: 'relative', zIndex: 2 },

  logoArea: { display: 'flex', alignItems: 'center', gap: 8 }, logoIcon: { fontSize: 28 },

  logoText: { fontFamily: "'Syne Mono', monospace", fontSize: 22, fontWeight: 700, background: 'linear-gradient(90deg,#3a86ff,#8338ec,#ff4d6d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: 1 },

  scoreBox: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '6px 16px', textAlign: 'center' },

  scoreLabel: { fontSize: 9, color: '#666', fontWeight: 700, letterSpacing: 2 }, scoreVal: { fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Syne Mono', monospace" },

  statsBar: { width: '100%', maxWidth: 440, display: 'flex', justifyContent: 'space-around', padding: '6px 20px 10px', position: 'relative', zIndex: 2 },

  stat: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }, statLabel: { fontSize: 9, color: '#444', fontWeight: 700, letterSpacing: 2 }, statVal: { fontSize: 16, fontWeight: 800, color: '#aaa', fontFamily: "'Syne Mono', monospace", transition: 'color 0.3s' },

  gridWrap: { width: '100%', maxWidth: 440, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 5, position: 'relative', zIndex: 2 },

  row: { display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 5 },

  cell: { aspectRatio: '1', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s ease-in-out', position: 'relative' },

  cellEmpty: { background: 'rgba(255,255,255,0.01)', border: '1.5px solid rgba(255,255,255,0.02)' },

  cellCursor: { border: '2px solid #ffffff', background: 'rgba(255,255,255,0.15)', boxShadow: '0 0 10px rgba(255,255,255,0.4)', transform: 'scale(1.08)', zIndex: 3 },

  cellSelected: { background: 'rgba(58,134,255,0.25)', border: '2px solid #3a86ff', boxShadow: '0 0 14px rgba(58,134,255,0.4)', transform: 'scale(1.06)', zIndex: 2 },

  cellFlash: { background: 'rgba(255,221,0,0.3)', border: '2px solid #ffdd00', boxShadow: '0 0 20px rgba(255,221,0,0.5)', animation: 'flashCell 0.35s ease' },

  cellNum: { fontSize: 'clamp(13px, 3.2vw, 18px)', fontWeight: 800, fontFamily: "'Syne Mono', monospace", lineHeight: 1, transition: 'color 0.15s, transform 0.15s' },

  hint: { fontSize: 12, color: '#888', marginTop: 12, padding: '0 20px', textAlign: 'center', lineHeight: 1.5, position: 'relative', zIndex: 2 },

  controls: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 16, position: 'relative', zIndex: 2, width: '100%', maxWidth: 440, padding: '0 20px' },

  btnClear: { flex: 1, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#888', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, padding: '12px 0', cursor: 'pointer', transition: 'all 0.15s' },

  btnAdd: { flex: 1.4, background: 'linear-gradient(135deg,#2ec4b6,#3a86ff)', border: 'none', borderRadius: 14, color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 14, padding: '12px 0', cursor: 'pointer', boxShadow: '0 6px 20px rgba(46,196,182,0.3)', transition: 'all 0.15s' },

  btnRestart: { flex: 1, background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#888', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, padding: '12px 0', cursor: 'pointer', transition: 'all 0.15s' },

  btnFocused: { border: '2px solid #fff', transform: 'scale(1.05)', boxShadow: '0 0 15px rgba(255,255,255,0.5)', zIndex: 5 },

  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(6px)' },

  dialog: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 28, padding: '40px 48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: 'fadeIn 0.3s ease', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' },

  dialogEmoji: { fontSize: 52 }, dialogTitle: { fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }, dialogSub: { fontSize: 14, color: '#555', fontWeight: 600 },

  dialogScore: { fontSize: 52, fontWeight: 800, fontFamily: "'Syne Mono', monospace", background: 'linear-gradient(90deg,#3a86ff,#8338ec,#ff4d6d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 8, lineHeight: 1 },

  dialogScoreLabel: { fontSize: 11, color: '#555', letterSpacing: 3, fontWeight: 700, marginBottom: 8 },

  dialogBtn: { marginTop: 8, background: 'linear-gradient(135deg,#3a86ff,#8338ec)', border: 'none', borderRadius: 14, color: '#fff', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 16, padding: '14px 40px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(58,134,255,0.35)' }

};