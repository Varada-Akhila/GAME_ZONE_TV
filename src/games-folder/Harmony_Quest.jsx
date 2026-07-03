import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function ConnectFourApp() {
  const [currentPage, setCurrentPage] = useState('rules');
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {currentPage === 'rules' && <RulesPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'game'  && <GamePage  setCurrentPage={setCurrentPage} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                        RULES PAGE
// ═══════════════════════════════════════════════════════════════
function RulesPage({ setCurrentPage }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Enter' || e.key === ' ') setCurrentPage('game'); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [setCurrentPage]);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'linear-gradient(180deg, #001a4d 0%, #003366 50%, #001a4d 100%)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'space-around', fontFamily: 'Arial, sans-serif'
    }}>
      <style>{`
        @keyframes glow {
          0%,100%{text-shadow:0 0 20px rgba(255,215,0,.8),0 0 40px rgba(255,165,0,.6);}
          50%{text-shadow:0 0 30px rgba(255,215,0,1),0 0 60px rgba(255,165,0,.8);}
        }
        .glow-title{animation:glow 2s ease-in-out infinite;}
      `}</style>

      <div style={{ textAlign: 'center' }}>
        <h1 className="glow-title" style={{ fontSize: '72px', fontWeight: 'bold', margin: 0, color: '#FFD700', letterSpacing: '4px', textTransform: 'uppercase' }}>
          CONNECT FOUR
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15, marginTop: 28 }}>
          <span style={{ fontSize: 36 }}>🎮</span>
          <h2 style={{ fontSize: 28, color: '#FFD700', margin: 0, fontWeight: 'bold' }}>Challenge The Computer</h2>
          <span style={{ fontSize: 36 }}>🎮</span>
        </div>
      </div>

      <div style={{ width: '88%', maxWidth: 1200, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { bg: 'rgba(30,60,100,.7)',  border: '#FFD700', icon: '🟨', title: 'YOU PLAY',   color: '#FFD700', text: 'Yellow Pieces\nClick Column\nPieces Fall Down' },
          { bg: 'rgba(30,80,60,.7)',   border: '#4CAF50', icon: '✨', title: 'HOW TO WIN', color: '#4CAF50', text: 'Connect 4 in a Row\nHorizontal · Vertical\nDiagonal · WIN!' },
          { bg: 'rgba(80,30,60,.7)',   border: '#FF5252', icon: '🤖', title: 'COMPUTER',   color: '#FF5252', text: 'Red Pieces 🔴\nSmart AI\nBeat It If You Can!' },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg, border: `4px solid ${c.border}`, borderRadius: 18, padding: '24px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: 44, margin: '0 0 10px' }}>{c.icon}</p>
            <h3 style={{ color: c.color, fontSize: 22, margin: '0 0 10px', fontWeight: 'bold' }}>{c.title}</h3>
            <p style={{ color: '#FFF', fontSize: 15, lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>{c.text}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCurrentPage('game')}
        style={{ padding: '16px 52px', fontSize: 30, fontWeight: 'bold', background: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#000', border: '3px solid #FFD700', borderRadius: 14, cursor: 'pointer', letterSpacing: 2 }}
      >
        ▶ START GAME
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//                         GAME PAGE
// ═══════════════════════════════════════════════════════════════
function GamePage({ setCurrentPage }) {
  const ROWS = 6, COLS = 7;
  const GAP = 10, FRAME_PAD = 16;
  
  // Adjusted multipliers and max size to make the board larger
  const maxByW = Math.floor((window.innerWidth  * 0.90 - (COLS - 1) * GAP - FRAME_PAD * 2) / COLS);
  const maxByH = Math.floor((window.innerHeight * 0.75 - (ROWS - 1) * GAP - FRAME_PAD * 2 - 28) / ROWS);
  const CELL = Math.min(110, maxByW, maxByH);

  const [board, setBoard]               = useState(Array(ROWS * COLS).fill(0));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver]         = useState(false);
  const [winner, setWinner]             = useState('');
  const [playerWins, setPlayerWins]     = useState(0);
  const [aiWins, setAiWins]             = useState(0);
  const [selectedCol, setSelectedCol]   = useState(3);
  const [winCells, setWinCells]         = useState([]);
  const [lastDrop, setLastDrop]         = useState(null);
  const [hoveredCol, setHoveredCol]     = useState(null);
  const [overlayFocus, setOverlayFocus] = useState('again');
  const [showOverlay, setShowOverlay]   = useState(false);

  const boardRef       = useRef(board);
  const isPlayerRef    = useRef(true);
  const gameOverRef    = useRef(false);
  const selColRef      = useRef(3);
  const overlayRef     = useRef('again');
  const showOverlayRef = useRef(false);
  
  boardRef.current       = board;
  isPlayerRef.current    = isPlayerTurn;
  gameOverRef.current    = gameOver;
  selColRef.current      = selectedCol;
  overlayRef.current     = overlayFocus;
  showOverlayRef.current = showOverlay;

  // ── Audio ─────────────────────────────────────────────────────
  const actxRef = useRef(null);
  const getCtx  = () => { if (!actxRef.current) actxRef.current = new (window.AudioContext || window.webkitAudioContext)(); return actxRef.current; };
  const beep = (freq, dur, type = 'sine', vol = 0.18) => {
    try {
      const ctx = getCtx(), o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq; g.gain.value = vol;
      o.connect(g); g.connect(ctx.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.stop(ctx.currentTime + dur);
    } catch (_) {}
  };
  const playDrop = (p) => beep(p === 1 ? 520 : 320, 0.12);
  const playWin  = ()  => [600,750,900,1100].forEach((f,i) => setTimeout(() => beep(f,0.18,'sine',0.22), i*100));
  const playDraw = ()  => beep(300, 0.4, 'triangle', 0.15);
  const playNav  = ()  => beep(440, 0.06, 'square', 0.08);

  // ── Game Logic ────────────────────────────────────────────────
  const dropPiece = (b, col, player) => {
    const nb = [...b];
    for (let r = ROWS-1; r >= 0; r--) {
      if (nb[r*COLS+col] === 0) { nb[r*COLS+col] = player; return { board: nb, row: r }; }
    }
    return null;
  };

  const checkWin = (b, player) => {
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS-3;c++) if ([0,1,2,3].every(i=>b[r*COLS+c+i]===player)) return [0,1,2,3].map(i=>r*COLS+c+i);
    for (let c=0;c<COLS;c++) for (let r=0;r<ROWS-3;r++) if ([0,1,2,3].every(i=>b[(r+i)*COLS+c]===player)) return [0,1,2,3].map(i=>(r+i)*COLS+c);
    for (let r=3;r<ROWS;r++) for (let c=0;c<COLS-3;c++) if ([0,1,2,3].every(i=>b[(r-i)*COLS+c+i]===player)) return [0,1,2,3].map(i=>(r-i)*COLS+c+i);
    for (let r=0;r<ROWS-3;r++) for (let c=0;c<COLS-3;c++) if ([0,1,2,3].every(i=>b[(r+i)*COLS+c+i]===player)) return [0,1,2,3].map(i=>(r+i)*COLS+c+i);
    return null;
  };

  const getValid = b => Array.from({length:COLS},(_,c)=>c).filter(c=>b[c]===0);

  const scoreW = (w,p) => {
    const o=p===2?1:2, pc=w.filter(x=>x===p).length, ec=w.filter(x=>x===0).length, oc=w.filter(x=>x===o).length;
    let s=0;
    if(pc===4)s+=100; else if(pc===3&&ec===1)s+=5; else if(pc===2&&ec===2)s+=2;
    if(oc===3&&ec===1)s-=4;
    return s;
  };
  const scoreB = (b,p) => {
    let s=0;
    s+=Array.from({length:ROWS},(_,r)=>b[r*COLS+3]).filter(x=>x===p).length*3;
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS-3;c++) s+=scoreW([0,1,2,3].map(i=>b[r*COLS+c+i]),p);
    for(let c=0;c<COLS;c++) for(let r=0;r<ROWS-3;r++) s+=scoreW([0,1,2,3].map(i=>b[(r+i)*COLS+c]),p);
    for(let r=3;r<ROWS;r++) for(let c=0;c<COLS-3;c++) s+=scoreW([0,1,2,3].map(i=>b[(r-i)*COLS+c+i]),p);
    for(let r=0;r<ROWS-3;r++) for(let c=0;c<COLS-3;c++) s+=scoreW([0,1,2,3].map(i=>b[(r+i)*COLS+c+i]),p);
    return s;
  };
  const mm = (b,d,a,be,mx) => {
    const vc=getValid(b);
    if(checkWin(b,2)) return {score:100000+d};
    if(checkWin(b,1)) return {score:-100000-d};
    if(!vc.length||d===0) return {score:scoreB(b,2)};
    if(mx){
      let best={score:-Infinity,col:vc[0]};
      for(const col of vc){const r2=dropPiece(b,col,2);if(!r2)continue;const res=mm(r2.board,d-1,a,be,false);if(res.score>best.score)best={score:res.score,col};a=Math.max(a,best.score);if(a>=be)break;}
      return best;
    } else {
      let best={score:Infinity,col:vc[0]};
      for(const col of vc){const r2=dropPiece(b,col,1);if(!r2)continue;const res=mm(r2.board,d-1,a,be,true);if(res.score<best.score)best={score:res.score,col};be=Math.min(be,best.score);if(a>=be)break;}
      return best;
    }
  };

  // ── End game: flash pieces first, overlay after 2.5s ─────────
  const endGame = useCallback((w, wc, incPlayer, incAI) => {
    gameOverRef.current = true;
    setGameOver(true);
    setWinner(w);
    if (wc) setWinCells(wc);
    if (incPlayer) setPlayerWins(v => v + 1);
    if (incAI)     setAiWins(v => v + 1);
    if (wc) playWin(); else playDraw();
    setOverlayFocus('again');
    setShowOverlay(false);
    setTimeout(() => setShowOverlay(true), 2500);
  }, []);

  // ── Move ──────────────────────────────────────────────────────
  const doMove = useCallback((col) => {
    if (gameOverRef.current || !isPlayerRef.current) return;
    const res = dropPiece(boardRef.current, col, 1);
    if (!res) return;
    isPlayerRef.current = false;
    setIsPlayerTurn(false);
    setBoard(res.board);
    setLastDrop({ row: res.row, col, player: 1 });
    playDrop(1);
    const wc = checkWin(res.board, 1);
    if (wc) { endGame('YOU', wc, true, false); return; }
    if (!getValid(res.board).length) { endGame('DRAW', null, false, false); return; }
    setTimeout(() => {
      const {col:ac} = mm(res.board, 4, -Infinity, Infinity, true);
      const ar = dropPiece(res.board, ac, 2); if (!ar) return;
      setBoard(ar.board);
      setLastDrop({ row: ar.row, col: ac, player: 2 });
      playDrop(2);
      const awc = checkWin(ar.board, 2);
      if (awc)                             { endGame('AI', awc, false, true); }
      else if (!getValid(ar.board).length) { endGame('DRAW', null, false, false); }
      else { isPlayerRef.current=true; setIsPlayerTurn(true); }
    }, 450);
  }, [endGame]);

  const reset = useCallback(() => {
    const f = Array(ROWS*COLS).fill(0);
    boardRef.current=f; isPlayerRef.current=true; gameOverRef.current=false;
    setBoard(f); setIsPlayerTurn(true); setGameOver(false); setWinner('');
    setSelectedCol(3); selColRef.current=3; setWinCells([]); setLastDrop(null);
    setOverlayFocus('again'); setShowOverlay(false);
  }, []);

  // ── D-pad keyboard ────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      const over = gameOverRef.current;
      if (over) {
        if (!showOverlayRef.current) return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          playNav();
          setOverlayFocus(f => f === 'again' ? 'menu' : 'again');
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (overlayRef.current === 'again') reset();
          else setCurrentPage('rules');
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault(); playNav();
        setSelectedCol(c => { const n=Math.max(0,c-1); selColRef.current=n; return n; });
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault(); playNav();
        setSelectedCol(c => { const n=Math.min(COLS-1,c+1); selColRef.current=n; return n; });
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        doMove(selColRef.current);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [doMove, reset, setCurrentPage]);

  // ── Derived display values ────────────────────────────────────
  const statusMsg = gameOver
    ? winner==='YOU' ? '🏆 You Win!' : winner==='AI' ? '🤖 AI Wins!' : '🤝 Draw!'
    : isPlayerTurn ? '🟡 Your Turn — Choose a Column' : '⏳ AI Thinking…';

  const statusColor = gameOver
    ? winner==='YOU' ? '#16a34a' : winner==='AI' ? '#dc2626' : '#6366f1'
    : isPlayerTurn ? '#0284c7' : '#ea580c';

  const activeCol = hoveredCol !== null ? hoveredCol : selectedCol;

  const overlayBg     = winner==='YOU' ? 'linear-gradient(135deg,#14532d,#166534)' : winner==='AI' ? 'linear-gradient(135deg,#7f1d1d,#991b1b)' : 'linear-gradient(135deg,#1e1b4b,#312e81)';
  const overlayBorder = winner==='YOU' ? '#4ade80' : winner==='AI' ? '#f87171' : '#a78bfa';
  const overlayEmoji  = winner==='YOU' ? '🏆' : winner==='AI' ? '🤖' : '🤝';
  const overlayTitle  = winner==='YOU' ? 'YOU WIN!' : winner==='AI' ? 'AI WINS!' : 'DRAW!';

  // ── Render ────────────────────────────────────────────────────
  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: '#f8fafc', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '30px', // Adjusted alignment 
      fontFamily: "'Segoe UI', Arial, sans-serif",
      padding: '14px 24px', boxSizing: 'border-box', position: 'relative'
    }}>
      <style>{`
        @keyframes dropIn   { from{transform:translateY(-300px);opacity:0.4} to{transform:translateY(0);opacity:1} }
        @keyframes winPulse { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.5) saturate(1.5)} }
        @keyframes overlayIn{ from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
        @keyframes bannerIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .drop-anim  { animation: dropIn   0.28s cubic-bezier(.175,.885,.32,1.2) forwards }
        .win-anim   { animation: winPulse 0.55s ease-in-out infinite }
        .overlay-in { animation: overlayIn 0.3s cubic-bezier(.175,.885,.32,1.2) forwards }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ width:'100%', maxWidth:860, display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
        <div style={{ background:'#fff', border:'2px solid #fef08a', borderRadius:12, padding:'8px 18px', minWidth:100, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize:10, color:'#ca8a04', fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>YOU</div>
          <div style={{ fontSize:32, fontWeight:700, color:'#ca8a04', lineHeight:1 }}>{playerWins}</div>
        </div>
        <div style={{ flex:1, textAlign:'center', background:'#fff', border:`2px solid ${statusColor}30`, borderRadius:12, padding:'10px 20px', fontSize:16, fontWeight:700, color:statusColor, boxShadow:'0 2px 8px rgba(0,0,0,0.07)', transition:'all 0.3s' }}>
          {statusMsg}
        </div>
        <div style={{ background:'#fff', border:'2px solid #fca5a5', borderRadius:12, padding:'8px 18px', minWidth:100, textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize:10, color:'#dc2626', fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>AI</div>
          <div style={{ fontSize:32, fontWeight:700, color:'#dc2626', lineHeight:1 }}>{aiWins}</div>
        </div>
      </div>

      {/* ── BOARD SECTION ── */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flexShrink:0 }}>

        {/* Column arrows */}
        <div style={{ display:'flex', gap:GAP }}>
          {Array.from({length:COLS},(_,c) => (
            <div key={c} style={{ width:CELL, height:22, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {activeCol===c && isPlayerTurn && !gameOver && (
                <div style={{ width:0, height:0, borderLeft:`${CELL*0.13}px solid transparent`, borderRight:`${CELL*0.13}px solid transparent`, borderTop:`${CELL*0.18}px solid #eab308`, filter:'drop-shadow(0 2px 4px rgba(234,179,8,0.6))' }} />
              )}
            </div>
          ))}
        </div>

        {/* Board frame */}
        <div style={{ background:'#1e293b', borderRadius:20, padding:FRAME_PAD, boxShadow:'0 16px 48px rgba(0,0,0,0.3), inset 0 2px 6px rgba(255,255,255,0.08)' }}>
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${COLS},${CELL}px)`, gap:GAP }}>
            {board.map((cell,idx) => {
              const col = idx % COLS, row = Math.floor(idx / COLS);
              const isNew      = lastDrop?.row===row && lastDrop?.col===col;
              const isWin      = winCells.includes(idx);
              const isColFocus = !gameOver && isPlayerTurn && activeCol===col;
              const tokenGrad  = cell===1
                ? 'radial-gradient(circle at 35% 28%,#fefce8 0%,#fef08a 22%,#facc15 55%,#b45309 100%)'
                : 'radial-gradient(circle at 35% 28%,#fff1f2 0%,#fca5a5 22%,#ef4444 55%,#7f1d1d 100%)';
              return (
                <div key={idx}
                  onClick={() => doMove(col)}
                  onMouseEnter={() => setHoveredCol(col)}
                  onMouseLeave={() => setHoveredCol(null)}
                  style={{
                    width:CELL, height:CELL, borderRadius:'50%',
                    background: cell===0 ? '#0f172a' : cell===1 ? '#facc15' : '#ef4444',
                    border:`${Math.max(2,CELL*0.035)}px solid ${cell===0 ? (isColFocus?'#0ea5e9':'#1e3a5f') : cell===1 ? '#b45309' : '#7f1d1d'}`,
                    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                    boxSizing:'border-box', position:'relative', overflow:'hidden',
                    boxShadow: cell===0 ? `inset 0 6px 14px rgba(0,0,0,0.7)${isColFocus?', 0 0 0 2px #0ea5e930':''}` : '0 4px 12px rgba(0,0,0,0.4)',
                    transition:'border-color 0.1s, box-shadow 0.1s'
                  }}
                >
                  {cell!==0 && (
                    <div className={`${isNew?'drop-anim':''} ${isWin?'win-anim':''}`} style={{
                      width:'90%', height:'90%', borderRadius:'50%', background:tokenGrad,
                      boxShadow:'inset 0 -5px 12px rgba(0,0,0,0.35), inset 0 5px 12px rgba(255,255,255,0.55)'
                    }} />
                  )}
                  {cell!==0 && (
                    <div style={{ position:'absolute', top:'11%', left:'14%', width:'28%', height:'13%', background:'rgba(255,255,255,0.45)', borderRadius:'50%', transform:'rotate(-15deg)', pointerEvents:'none' }} />
                  )}
                </div>
              );
            })}
          </div>
          {/* Column numbers */}
          <div style={{ display:'flex', gap:GAP, marginTop:8 }}>
            {Array.from({length:COLS},(_,c) => (
              <div key={c} style={{ width:CELL, textAlign:'center', color: activeCol===c && isPlayerTurn && !gameOver ? '#94a3b8' : 'rgba(255,255,255,0.18)', fontSize:Math.max(11,CELL*0.17), fontWeight:'bold', transition:'color 0.1s' }}>{c+1}</div>
            ))}
          </div>
        </div>{/* ← closes board frame */}

        {/* Win banner: visible for 2.5s before overlay appears */}
        {gameOver && !showOverlay && (
          <div style={{
            marginTop:8, padding:'10px 32px', borderRadius:14,
            background: winner==='YOU' ? '#14532d' : winner==='AI' ? '#7f1d1d' : '#1e1b4b',
            border:`2px solid ${winner==='YOU' ? '#4ade80' : winner==='AI' ? '#f87171' : '#a78bfa'}`,
            color:'#fff', fontSize:18, fontWeight:800, letterSpacing:2,
            textAlign:'center', animation:'bannerIn 0.35s ease forwards',
            boxShadow:'0 8px 24px rgba(0,0,0,0.35)'
          }}>
            {winner==='YOU' ? '🏆 YOU WIN — 4 in a row!' : winner==='AI' ? '🤖 AI WINS — 4 in a row!' : '🤝 DRAW — No more moves!'}
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:400, marginTop:3, letterSpacing:1 }}>
              Watch the winning pieces flash ↑ — result screen coming up…
            </div>
          </div>
        )}

      </div>{/* ← closes BOARD SECTION */}

      {/* ── GAME OVER OVERLAY ── */}
      {gameOver && showOverlay && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.72)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:100, backdropFilter:'blur(4px)'
        }}>
          <div className="overlay-in" style={{
            background:overlayBg, border:`3px solid ${overlayBorder}`,
            borderRadius:24, padding:'36px 48px', textAlign:'center',
            boxShadow:`0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px ${overlayBorder}44`,
            minWidth:340
          }}>
            <div style={{ fontSize:64, marginBottom:8 }}>{overlayEmoji}</div>
            <div style={{ fontSize:38, fontWeight:900, color:'#fff', letterSpacing:3, marginBottom:6 }}>{overlayTitle}</div>
            <div style={{ fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:28, letterSpacing:1 }}>
              Score — You <span style={{ color:'#fde047', fontWeight:700 }}>{playerWins}</span> &nbsp;·&nbsp; AI <span style={{ color:'#f87171', fontWeight:700 }}>{aiWins}</span>
            </div>

            <div style={{ display:'flex', gap:16, justifyContent:'center' }}>
              {/* PLAY AGAIN */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <button onClick={reset} style={{
                  width:130, height:60, borderRadius:14, fontSize:18, fontWeight:800, cursor:'pointer',
                  background: overlayFocus==='again' ? '#fde047' : 'rgba(255,255,255,0.1)',
                  border: overlayFocus==='again' ? '3px solid #a16207' : `2px solid ${overlayBorder}44`,
                  color: overlayFocus==='again' ? '#1c1917' : '#fff',
                  boxShadow: overlayFocus==='again' ? '0 5px 0 #a16207, 0 0 0 3px #fde04744' : '0 3px 0 rgba(0,0,0,0.4)',
                  transform: overlayFocus==='again' ? 'translateY(-2px) scale(1.04)' : 'none',
                  transition:'all 0.15s', letterSpacing:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8
                }}>↺ PLAY AGAIN</button>
                {overlayFocus==='again' && (
                  <div style={{ width:0, height:0, borderLeft:'8px solid transparent', borderRight:'8px solid transparent', borderBottom:`10px solid ${overlayBorder}` }} />
                )}
              </div>

              {/* MAIN MENU */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <button onClick={() => setCurrentPage('rules')} style={{
                  width:130, height:60, borderRadius:14, fontSize:18, fontWeight:800, cursor:'pointer',
                  background: overlayFocus==='menu' ? '#a78bfa' : 'rgba(255,255,255,0.1)',
                  border: overlayFocus==='menu' ? '3px solid #7c3aed' : `2px solid ${overlayBorder}44`,
                  color: overlayFocus==='menu' ? '#fff' : 'rgba(255,255,255,0.7)',
                  boxShadow: overlayFocus==='menu' ? '0 5px 0 #7c3aed, 0 0 0 3px #a78bfa44' : '0 3px 0 rgba(0,0,0,0.4)',
                  transform: overlayFocus==='menu' ? 'translateY(-2px) scale(1.04)' : 'none',
                  transition:'all 0.15s', letterSpacing:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8
                }}>⌂ MAIN MENU</button>
                {overlayFocus==='menu' && (
                  <div style={{ width:0, height:0, borderLeft:'8px solid transparent', borderRight:'8px solid transparent', borderBottom:`10px solid ${overlayBorder}` }} />
                )}
              </div>
            </div>

            <div style={{ marginTop:20, fontSize:12, color:'rgba(255,255,255,0.35)', letterSpacing:1 }}>
              ◀ ▶ to move &nbsp;·&nbsp; ENTER to select
            </div>
          </div>
        </div>
      )}

    </div>
  );
}