import React, { useState, useEffect, useCallback, useRef } from 'react';

// ── Word pools by topic ───────────────────────────────────────────────────────
const TOPICS = {
  FRUITS:   ['APPLE','PEAR','MANGO','GRAPE','KIWI','PEACH','PLUM','LEMON','MELON','CHERRY'],
  PETS:     ['PUPPY','KITTEN','FISH','BIRD','SNAKE','RABBIT','TURTLE','MOUSE','HAMSTER','PARROT'],
  COLORS:   ['RED','BLUE','GREEN','YELLOW','PURPLE','ORANGE','PINK','BROWN','BLACK','WHITE'],
  NATURE:   ['TREE','RIVER','MOUNTAIN','OCEAN','FOREST','CLOUD','RAIN','SNOW','STAR','MOON'],
  ANIMALS:  ['TIGER','BEAR','LION','ZEBRA','PANDA','KOALA','SHARK','WHALE','EAGLE','FROG'],
  VEHICLES: ['CAR','TRUCK','TRAIN','PLANE','BOAT','SHIP','BIKE','ROCKET','BUS','MOPED'],
  SPACE:    ['ALIEN','COMET','EARTH','MARS','VENUS','STARS','ORBIT','SUN','GALAXY','PLUTO'],
  CLOTHES:  ['SHIRT','PANTS','SOCKS','SHOES','HAT','COAT','SCARF','GLOVES','DRESS','SKIRT'],
  FOOD:     ['PIZZA','BURGER','PASTA','SALAD','BREAD','STEAK','SOUP','TACO','SUSHI','CAKE'],
  SPORTS:   ['SOCCER','TENNIS','BOXING','GOLF','SWIM','RUGBY','CRICKET','HOCKEY','POLO','SKIING'],
};

const ROWS = 10;
const COLS = 10;
const DIRECTIONS = [
  [0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]
];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ── Place words into grid ─────────────────────────────────────────────────────
const buildGrid = (words) => {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
  const placed = []; // [{word, cells:[{r,c}]}]

  for (const word of words) {
    let success = false;
    for (let attempt = 0; attempt < 200 && !success; attempt++) {
      const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const startR   = Math.floor(Math.random() * ROWS);
      const startC   = Math.floor(Math.random() * COLS);
      const cells    = [];
      let fits = true;

      for (let i = 0; i < word.length; i++) {
        const r = startR + dr * i;
        const c = startC + dc * i;
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) { fits = false; break; }
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) { fits = false; break; }
        cells.push({ r, c });
      }

      if (fits) {
        cells.forEach(({ r, c }, i) => { grid[r][c] = word[i]; });
        placed.push({ word, cells });
        success = true;
      }
    }
  }

  // Fill blanks with random letters
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (grid[r][c] === '') grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];

  return { grid, placed };
};

// ── Generate a level ──────────────────────────────────────────────────────────
const generateLevel = (levelId) => {
  const topicKeys  = Object.keys(TOPICS);
  const topic      = topicKeys[Math.floor(Math.random() * topicKeys.length)];
  const pool       = [...TOPICS[topic]].sort(() => 0.5 - Math.random());

  // More words as levels increase, capped at 8
  const numWords   = Math.min(4 + Math.floor((levelId - 1) / 2), 8);
  const words      = pool.slice(0, numWords);

  const { grid, placed } = buildGrid(words);

  // Only keep words that were successfully placed
  const placedWords = placed.map(p => p.word);
  const wordCells   = {};
  placed.forEach(p => { wordCells[p.word] = p.cells; });

  return { id: levelId, topic, words: placedWords, grid, wordCells };
};

// ── Color for each word ───────────────────────────────────────────────────────
const WORD_COLORS = [
  '#FF4500','#FFD700','#1E90FF','#32CD32','#FF69B4',
  '#FF8C00','#00CED1','#9370DB','#FF6347','#20B2AA',
];

// ── Component ─────────────────────────────────────────────────────────────────
const WordGame = () => {
  const [levelData,     setLevelData]     = useState(() => generateLevel(1));
  const [levelNum,      setLevelNum]      = useState(1);
  const [grid,          setGrid]          = useState(null);
  const [cursor,        setCursor]        = useState({ r: 0, c: 0 });
  const [selection,     setSelection]     = useState([]); // [{r,c}]
  const [isSelecting,   setIsSelecting]   = useState(false);
  const [solvedWords,   setSolvedWords]   = useState([]); // word strings
  const [solvedCells,   setSolvedCells]   = useState([]); // [{r,c,color}]
  const [statusMsg,     setStatusMsg]     = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const [celebrate,     setCelebrate]     = useState(false);

  useEffect(() => {
    setGrid(levelData.grid.map(r => [...r]));
    setCursor({ r: 0, c: 0 });
    setSelection([]);
    setIsSelecting(false);
    setSolvedWords([]);
    setSolvedCells([]);
    setStatusMsg('');
    setCelebrate(false);
  }, [levelData]);

  const S = useRef({});
  S.current = { grid, cursor, isSelecting, selection, solvedWords, solvedCells, levelData, levelNum, transitioning };

  const showStatus = (msg, ms = 1200) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), ms);
  };

  // ── Confirm selection ───────────────────────────────────────────────────────
  const confirmSelection = useCallback(() => {
    const { selection, solvedWords, solvedCells, levelData, levelNum, transitioning } = S.current;
    if (transitioning || selection.length < 2) return;

    const forwardWord  = selection.map(p => levelData.grid[p.r][p.c]).join('');
    const backwardWord = [...forwardWord].reverse().join('');
    const matchWord    = levelData.words.includes(forwardWord)  ? forwardWord
                       : levelData.words.includes(backwardWord) ? backwardWord
                       : null;

    if (matchWord && !solvedWords.includes(matchWord)) {
      const wordIdx  = levelData.words.indexOf(matchWord);
      const color    = WORD_COLORS[wordIdx % WORD_COLORS.length];
      const newCells = selection.map(p => ({ r: p.r, c: p.c, color }));
      const ns       = [...solvedWords, matchWord];
      const nc       = [...solvedCells, ...newCells];
      setSolvedWords(ns);
      setSolvedCells(nc);
      showStatus('✓  ' + matchWord + '!', 1300);

      if (ns.length === levelData.words.length) {
        setTransitioning(true);
        setCelebrate(true);
        setStatusMsg('🎉  All words found!');
        setTimeout(() => {
          const next = levelNum + 1;
          setLevelNum(next);
          setLevelData(generateLevel(next));
          setTransitioning(false);
        }, 2000);
      }
    } else if (matchWord) {
      showStatus('Already found!', 900);
    } else {
      showStatus('✗  Try again', 900);
    }

    setSelection([]);
    setIsSelecting(false);
  }, []);

  // ── Keyboard handler ────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      const { cursor, isSelecting, selection, transitioning } = S.current;
      if (transitioning) return;

      const nav = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
      if ([...nav,'Enter',' ','Escape','Backspace'].includes(e.key)) e.preventDefault();

      // Cancel
      if (e.key === 'Escape' || e.key === 'Backspace' || e.key === 'GoBack') {
        if (isSelecting) {
          if (selection.length > 1) {
            const ns = selection.slice(0, -1);
            setSelection(ns);
            setCursor(ns[ns.length - 1]);
          } else {
            setSelection([]); setIsSelecting(false);
          }
        }
        return;
      }

      // Confirm
      if (e.key === 'Enter' || e.key === ' ') {
        if (!isSelecting) {
          setIsSelecting(true);
          setSelection([{ r: cursor.r, c: cursor.c }]);
        } else {
          confirmSelection();
        }
        return;
      }

      // Move
      if (nav.includes(e.key)) {
        let nr = cursor.r, nc = cursor.c;
        if (e.key === 'ArrowUp')    nr = Math.max(0, nr - 1);
        if (e.key === 'ArrowDown')  nr = Math.min(ROWS - 1, nr + 1);
        if (e.key === 'ArrowLeft')  nc = Math.max(0, nc - 1);
        if (e.key === 'ArrowRight') nc = Math.min(COLS - 1, nc + 1);

        setCursor({ r: nr, c: nc });

        if (isSelecting) {
          const ai = selection.findIndex(p => p.r === nr && p.c === nc);
          if (ai !== -1) {
            setSelection(selection.slice(0, ai + 1));
          } else {
            // Only allow straight lines (horizontal, vertical, diagonal)
            const first = selection[0];
            const dr    = nr - first.r;
            const dc    = nc - first.c;
            const len   = Math.max(Math.abs(dr), Math.abs(dc));
            const stepR = len === 0 ? 0 : dr / len;
            const stepC = len === 0 ? 0 : dc / len;
            const isStraight = Number.isInteger(stepR) && Number.isInteger(stepC) &&
                               Math.abs(stepR) <= 1 && Math.abs(stepC) <= 1;
            if (isStraight) {
              const newSel = [];
              for (let i = 0; i <= len; i++)
                newSel.push({ r: first.r + stepR * i, c: first.c + stepC * i });
              setSelection(newSel);
            }
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmSelection]);

  // ── Tile click ──────────────────────────────────────────────────────────────
  const handleTileClick = (r, c) => {
    if (transitioning) return;
    setCursor({ r, c });
    if (!isSelecting) {
      setIsSelecting(true);
      setSelection([{ r, c }]);
    } else {
      const ai = selection.findIndex(p => p.r === r && p.c === c);
      if (ai !== -1) {
        if (ai === selection.length - 1) { confirmSelection(); return; }
        setSelection(selection.slice(0, ai + 1));
      } else {
        const first  = selection[0];
        const dr     = r - first.r;
        const dc     = c - first.c;
        const len    = Math.max(Math.abs(dr), Math.abs(dc));
        const stepR  = len === 0 ? 0 : dr / len;
        const stepC  = len === 0 ? 0 : dc / len;
        const isStraight = Number.isInteger(stepR) && Number.isInteger(stepC) &&
                           Math.abs(stepR) <= 1 && Math.abs(stepC) <= 1;
        if (isStraight) {
          const newSel = [];
          for (let i = 0; i <= len; i++)
            newSel.push({ r: first.r + stepR * i, c: first.c + stepC * i });
          setSelection(newSel);
        }
      }
    }
  };

  if (!grid) return null;

  const selText = selection.map(p => grid[p.r]?.[p.c] ?? '').join('');

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {celebrate && (
        <div style={styles.celebrateOverlay}>
          <div style={styles.celebrateBox}>
            <div style={styles.celebrateEmojis}>🎉🌟🎊✨</div>
            <div style={styles.celebrateTitle}>WELL DONE!</div>
            <div style={styles.celebrateSub}>All words found!</div>
            <div style={styles.celebrateLevel}>Level {levelData.id} Complete</div>
            <div style={styles.celebrateEmojis}>✨🎊🌟🎉</div>
            <div style={styles.celebrateHint}>Next level loading...</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.levelBadge}>LEVEL {levelData.id}</span>
        <h1 style={styles.topicText}>{levelData.topic}</h1>
      </div>

      {/* Word list */}
      <div style={styles.wordList}>
        {levelData.words.map((word, i) => {
          const solved = solvedWords.includes(word);
          const color  = WORD_COLORS[i % WORD_COLORS.length];
          return (
            <div
              key={word}
              style={{
                ...styles.wordChip,
                backgroundColor: solved ? color : 'rgba(255,255,255,0.15)',
                color:           solved ? '#fff' : 'rgba(255,255,255,0.7)',
                textDecoration:  solved ? 'line-through' : 'none',
                border:          solved ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.3)',
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      {/* Selection bubble */}
      <div style={styles.selectionArea}>
        {isSelecting && selection.length > 0 && (
          <div style={styles.selectionBubble}>{selText}</div>
        )}
      </div>

      {/* Grid */}
      <div style={styles.gridWrapper}>
        {grid.map((row, r) => (
          <div key={r} style={styles.row}>
            {row.map((letter, c) => {
              const isSelected = selection.some(p => p.r === r && p.c === c);
              const isCursor   = cursor.r === r && cursor.c === c;
              const solvedCell = solvedCells.find(p => p.r === r && p.c === c);
              const isSolved   = !!solvedCell;

              let bg = 'rgba(255,255,255,0.15)';
              if (isSolved)   bg = solvedCell.color;
              if (isSelected) bg = '#FF1493';

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleTileClick(r, c)}
                  style={{
                    ...styles.tile,
                    backgroundColor: bg,
                    color:           isSelected || isSolved ? '#fff' : '#fff',
                    border:          isCursor ? '3px solid #00FFFF' : '3px solid transparent',
                    transform:       isCursor ? 'scale(1.18)' : 'scale(1)',
                    zIndex:          isCursor ? 10 : 1,
                    fontWeight:      isSolved  ? 'bold' : '600',
                    boxShadow:       isCursor ? '0 0 12px #00FFFF' : isSelected ? '0 0 8px #FF1493' : 'none',
                  }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Status */}
      <div style={styles.statusMsg}>{statusMsg}</div>

      {/* Progress */}
      <div style={styles.progress}>
        {solvedWords.length} / {levelData.words.length} words found
      </div>

      {/* Instructions */}
      <div style={styles.instructions}>
        ▲▼◀▶ Move &nbsp;|&nbsp; OK/Enter = Start/Confirm &nbsp;|&nbsp; Back/Esc = Undo
      </div>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  container: {
    fontFamily: '"Fredoka One", "Comic Sans MS", cursive',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    // Calculates full screen height minus roughly the size of your top bar
    minHeight: 'calc(100vh - 60px)', 
    display: 'flex', flexDirection: 'column', alignItems: 'center', 
    justifyContent: 'center', // This centers the game vertically in the available space
    padding: '10px 0',
    userSelect: 'none', overflow: 'hidden',
    color: '#fff',
  },
  celebrateOverlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  },
  celebrateBox: {
    width: 300, height: 300,
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    border: '4px solid #FFD700',
    borderRadius: 22,
    boxShadow: '0 0 50px rgba(255,215,0,0.5)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 10,
  },
  celebrateEmojis: { fontSize: 36, letterSpacing: 5 },
  celebrateTitle: {
    fontSize: 36, fontWeight: 'bold',
    color: '#FFD700', letterSpacing: 3,
    textShadow: '0 0 18px rgba(255,215,0,0.8)',
  },
  celebrateSub: { fontSize: 18, color: '#fff', letterSpacing: 1 },
  celebrateLevel: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  celebrateHint: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 },
  
  header: { textAlign: 'center', marginBottom: 6 },
  levelBadge: {
    backgroundColor: '#FFD700', color: '#1a1a2e',
    borderRadius: 20, padding: '3px 12px',
    fontSize: 14, fontWeight: 'bold', letterSpacing: 1,
  },
  topicText: {
    margin: '4px 0 0', fontSize: 26, letterSpacing: 2,
    textTransform: 'uppercase', color: '#fff',
    textShadow: '0 0 15px rgba(255,215,0,0.5)',
  },
  wordList: {
    display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
    gap: 6, maxWidth: 520, marginBottom: 6, padding: '0 10px',
  },
  wordChip: {
    padding: '4px 12px', borderRadius: 16,
    fontSize: 12, fontWeight: 'bold', letterSpacing: 1,
    textTransform: 'uppercase', transition: 'all 0.3s ease',
  },
  selectionArea: {
    height: 32, marginBottom: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  selectionBubble: {
    backgroundColor: '#FF1493', color: '#fff',
    padding: '4px 16px', borderRadius: 24,
    fontSize: 16, fontWeight: 'bold',
    boxShadow: '0 0 12px rgba(255,20,147,0.7)',
    textTransform: 'uppercase', letterSpacing: 2,
  },
  gridWrapper: {
    display: 'flex', flexDirection: 'column', gap: 3,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
  },
  row: { display: 'flex', gap: 3 },
  tile: {
    width: 40, height: 40, // Increased size for better visibility
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, borderRadius: 8,
    transition: 'all 0.12s ease',
    cursor: 'pointer',
  },
  statusMsg: {
    marginTop: 8, fontSize: 18, fontWeight: 'bold',
    color: '#FFD700', height: 22, textAlign: 'center',
    textShadow: '0 0 8px rgba(255,215,0,0.6)',
  },
  progress: {
    marginTop: 4, fontSize: 14,
    color: 'rgba(255,255,255,0.6)', textAlign: 'center',
  },
  instructions: {
    marginTop: 4, color: 'rgba(255,255,255,0.4)',
    fontSize: 11, textAlign: 'center',
  },
};
export default WordGame;