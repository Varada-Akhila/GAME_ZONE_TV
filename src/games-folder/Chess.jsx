import React, { useState, useEffect, useCallback, useRef } from 'react';

const INIT_BOARD = () => {
  const b = Array(8).fill(null).map(() => Array(8).fill(null));
  b[7] = ['R','N','B','Q','K','B','N','R'];
  b[6] = Array(8).fill('P');
  b[0] = ['r','n','b','q','k','b','n','r'];
  b[1] = Array(8).fill('p');
  return b;
};

const PIECE_UNICODE = { K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞',P:'♟',k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟' };
const PROMO_PIECES = ['Q','R','B','N'];
const PROMO_LABELS = ['Queen','Rook','Bishop','Knight'];

export default function ChessGame() {
  const [page, setPage] = useState('menu');
  const [gameMode, setGameMode] = useState('PvE');
  const [difficulty, setDifficulty] = useState('medium');
  const [isDark, setIsDark] = useState(new Date().getHours() > 18 || new Date().getHours() < 6);

  const [board, setBoard] = useState(INIT_BOARD());
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [whiteToMove, setWhiteToMove] = useState(true);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('playing');
  const [promoSquare, setPromoSquare] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [cursor, setCursor] = useState([6, 4]); // Array for board, String for buttons
  const [promoCursor, setPromoCursor] = useState(0);
  const [inCheck, setInCheck] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [menuCursor, setMenuCursor] = useState('PvE'); 

  const stateRef = useRef({});
  stateRef.current = { board, selected, validMoves, whiteToMove, history, status, promoSquare, thinking, cursor, promoCursor, inCheck, gameMode, difficulty, page, menuCursor };

  const isW = p => p && p === p.toUpperCase();
  const isB = p => p && p === p.toLowerCase();
  const inBounds = (r,c) => r>=0&&r<8&&c>=0&&c<8;

  const diagOk = (bd,fr,fc,tr,tc) => {
    const rd=Math.abs(tr-fr),cd=Math.abs(tc-fc);
    if(rd!==cd||rd===0) return false;
    const rs=tr>fr?1:-1,cs=tc>fc?1:-1;
    let r=fr+rs,c=fc+cs;
    while(r!==tr||c!==tc){if(bd[r][c])return false;r+=rs;c+=cs;}
    return true;
  };
  const rookOk = (bd,fr,fc,tr,tc) => {
    if(fr!==tr&&fc!==tc) return false;
    if(fr===tr&&fc===tc) return false;
    const rs=fr===tr?0:tr>fr?1:-1,cs=fc===tc?0:tc>fc?1:-1;
    let r=fr+rs,c=fc+cs;
    while(r!==tr||c!==tc){if(bd[r][c])return false;r+=rs;c+=cs;}
    return true;
  };
  const canAttack = (bd,fr,fc,tr,tc,piece) => {
    const pl=piece.toLowerCase(),wh=isW(piece);
    if(pl==='p') return tr===fr+(wh?-1:1)&&Math.abs(tc-fc)===1;
    if(pl==='n') return [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].some(([dr,dc])=>tr===fr+dr&&tc===fc+dc);
    if(pl==='b') return diagOk(bd,fr,fc,tr,tc);
    if(pl==='r') return rookOk(bd,fr,fc,tr,tc);
    if(pl==='q') return diagOk(bd,fr,fc,tr,tc)||rookOk(bd,fr,fc,tr,tc);
    if(pl==='k') return Math.abs(tr-fr)<=1&&Math.abs(tc-fc)<=1&&(tr!==fr||tc!==fc);
    return false;
  };
  const kingInCheck = (bd,white) => {
    let kr,kc;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){const p=bd[r][c];if(white&&p==='K'){kr=r;kc=c;}else if(!white&&p==='k'){kr=r;kc=c;}}
    if(kr===undefined) return false;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){const p=bd[r][c];if(p&&(white?isB(p):isW(p))&&canAttack(bd,r,c,kr,kc,p)) return true;}
    return false;
  };
  const getMoves = useCallback((row,col,bd) => {
    const piece=bd[row][col];
    if(!piece) return [];
    const wh=isW(piece),pl=piece.toLowerCase(),moves=[];
    const add=(r,c)=>{
      if(!inBounds(r,c)) return;
      const t=bd[r][c];
      if(t&&(wh?isW(t):isB(t))) return;
      const nb=bd.map(x=>[...x]);nb[r][c]=piece;nb[row][col]=null;
      if(!kingInCheck(nb,wh)) moves.push([r,c]);
    };
    if(pl==='p'){
      const d=wh?-1:1,sr=wh?6:1,oa=row+d;
      if(inBounds(oa,col)&&!bd[oa][col]){add(oa,col);if(row===sr){const ta=row+2*d;if(!bd[ta][col])add(ta,col);}}
      [col-1,col+1].forEach(c=>{if(bd[oa]?.[c]&&(wh?isB(bd[oa][c]):isW(bd[oa][c])))add(oa,c);});
    } else if(pl==='n'){
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>add(row+dr,col+dc));
    } else if(pl==='b'||pl==='r'||pl==='q'){
      const dirs=pl==='b'?[[1,1],[1,-1],[-1,1],[-1,-1]]:pl==='r'?[[0,1],[0,-1],[1,0],[-1,0]]:[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
      dirs.forEach(([dr,dc])=>{for(let i=1;i<8;i++){const r=row+dr*i,c=col+dc*i;if(!inBounds(r,c))break;if(bd[r][c]){if(wh?isB(bd[r][c]):isW(bd[r][c]))add(r,c);break;}add(r,c);}});
    } else if(pl==='k'){
      for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){if(dr===0&&dc===0)continue;add(row+dr,col+dc);}
    }
    return moves;
  }, []);

  const pieceVal = p => ({p:1,n:3,b:3,r:5,q:9,k:100}[p?.toLowerCase()]||0);

  const getAI = useCallback((bd,diff) => {
    const all=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){const p=bd[r][c];if(p&&isB(p)) getMoves(r,c,bd).forEach(([tr,tc])=>all.push({fr:r,fc:c,tr,tc}));}
    if(!all.length) return null;
    if(diff==='easy') return all[Math.floor(Math.random()*all.length)];
    if(diff==='medium'){
      all.forEach(m=>{m.s=(bd[m.tr][m.tc]?pieceVal(bd[m.tr][m.tc]):0)+Math.random();});
      return all.sort((a,b)=>b.s-a.s)[0];
    }
    const score=b=>{let s=0;for(let r=0;r<8;r++) for(let c=0;c<8;c++){const p=b[r][c];if(p) s+=isB(p)?pieceVal(p):-pieceVal(p);}return s;};
    let best=null,bs=-Infinity;
    all.forEach(m=>{
      const b1=bd.map(x=>[...x]);b1[m.tr][m.tc]=b1[m.fr][m.fc];b1[m.fr][m.fc]=null;
      let worst=Infinity;
      const wm=[];
      for(let r=0;r<8;r++) for(let c=0;c<8;c++){if(isW(b1[r][c])) getMoves(r,c,b1).forEach(([tr,tc])=>wm.push({fr:r,fc:c,tr,tc}));}
      if(!wm.length) worst=kingInCheck(b1,true)?1000:0;
      else wm.forEach(w=>{const b2=b1.map(x=>[...x]);b2[w.tr][w.tc]=b2[w.fr][w.fc];b2[w.fr][w.fc]=null;const s=score(b2);if(s<worst)worst=s;});
      worst+=Math.random()*0.1;
      if(worst>bs){bs=worst;best=m;}
    });
    return best||all[0];
  },[getMoves]);

  const checkStatus = useCallback((bd,wh) => {
    const ck=kingInCheck(bd,wh);
    setInCheck(ck);
    let hasMoves=false;
    outer: for(let r=0;r<8;r++) for(let c=0;c<8;c++){const p=bd[r][c];if(p&&(wh?isW(p):isB(p))&&getMoves(r,c,bd).length){hasMoves=true;break outer;}}
    setStatus(!hasMoves?(ck?'checkmate':'stalemate'):'playing');
  },[getMoves]);

  const applyMove = useCallback((bd,fr,fc,tr,tc,piece,hist) => {
    setBoard(bd);setSelected(null);setValidMoves([]);
    const note=`${String.fromCharCode(97+fc)}${8-fr}-${String.fromCharCode(97+tc)}${8-tr}`;
    const newHist=[...hist,{fr,fc,tr,tc,piece,note}];
    setHistory(newHist);setLastMove({fr,fc,tr,tc});
    checkStatus(bd,!stateRef.current.whiteToMove);
    return newHist;
  },[checkStatus]);

  const doMove = useCallback((fr,fc,tr,tc) => {
    const {board:bd,history:hist,whiteToMove:wtm,gameMode:gm}=stateRef.current;
    const nb=bd.map(r=>[...r]);
    const piece=nb[fr][fc];
    nb[tr][tc]=piece;nb[fr][fc]=null;
    if(piece.toLowerCase()==='p'&&(tr===0||tr===7)){
      setBoard(nb);setPromoSquare([tr,tc]);setPromoCursor(0);
      setHistory(prev=>[...prev,{fr,fc,tr,tc,piece}]);
      setLastMove({fr,fc,tr,tc});
      return;
    }
    applyMove(nb,fr,fc,tr,tc,piece,hist);
    if(gm==='PvE'&&wtm) setThinking(true);
    setWhiteToMove(w=>!w);
  },[applyMove]);

  const doProm = useCallback((newP) => {
    const {board:bd,promoSquare:ps,history:hist,whiteToMove:wtm,gameMode:gm}=stateRef.current;
    if(!ps) return;
    const nb=bd.map(r=>[...r]);
    const lm=hist[hist.length-1];
    nb[ps[0]][ps[1]]=newP;
    applyMove(nb,lm.fr,lm.fc,ps[0],ps[1],newP,hist.slice(0,-1));
    setPromoSquare(null);
    if(gm==='PvE'&&wtm) setThinking(true);
    setWhiteToMove(w=>!w);
  },[applyMove]);

  const clickSquare = useCallback((row,col) => {
    const {thinking:th,status:st,gameMode:gm,whiteToMove:wtm,board:bd,selected:sel}=stateRef.current;
    setCursor([row,col]);
    if(th||st!=='playing') return;
    if(gm==='PvE'&&!wtm) return;
    const piece=bd[row][col];
    const mine=wtm?isW(piece):isB(piece);
    if(piece&&mine){setSelected([row,col]);setValidMoves(getMoves(row,col,bd));return;}
    if(sel){
      const moves=getMoves(sel[0],sel[1],bd);
      if(moves.some(([mr,mc])=>mr===row&&mc===col)){doMove(sel[0],sel[1],row,col);return;}
    }
    setSelected(null);setValidMoves([]);
  },[getMoves, doMove]);

  useEffect(()=>{
    if(gameMode==='PvE'&&!whiteToMove&&thinking&&status==='playing'){
      const t=setTimeout(()=>{
        const {board:bd,history:hist,difficulty:diff}=stateRef.current;
        const mv=getAI(bd,diff);
        if(mv){
          const nb=bd.map(r=>[...r]);
          const piece=nb[mv.fr][mv.fc];
          nb[mv.tr][mv.tc]=piece;nb[mv.fr][mv.fc]=null;
          if(piece.toLowerCase()==='p'&&(mv.tr===0||mv.tr===7)) nb[mv.tr][mv.tc]='q';
          applyMove(nb,mv.fr,mv.fc,mv.tr,mv.tc,nb[mv.tr][mv.tc],hist);
          setWhiteToMove(true);
        } else {
          checkStatus(bd,false);
        }
        setThinking(false);
      },600);
      return ()=>clearTimeout(t);
    }
  },[whiteToMove,thinking,status,gameMode,difficulty,getAI,applyMove,checkStatus]);

  // Handle D-pad navigation across the massive board & top bar
  const handleDir = useCallback((dir) => {
    const { cursor: cur } = stateRef.current;
    if (dir === 'UP') {
      if (Array.isArray(cur)) {
        if (cur[0] > 0) setCursor([cur[0] - 1, cur[1]]);
        else {
          if (cur[1] <= 1) setCursor('btn_menu');
          else if (cur[1] <= 3) setCursor('btn_undo');
          else if (cur[1] <= 5) setCursor('btn_new');
          else setCursor('btn_theme');
        }
      }
    }
    if (dir === 'DOWN') {
      if (Array.isArray(cur)) {
        if (cur[0] < 7) setCursor([cur[0] + 1, cur[1]]);
      } else {
        if (cur === 'btn_menu') setCursor([0, 1]);
        else if (cur === 'btn_undo') setCursor([0, 3]);
        else if (cur === 'btn_new') setCursor([0, 5]);
        else if (cur === 'btn_theme') setCursor([0, 7]);
      }
    }
    if (dir === 'LEFT') {
      if (Array.isArray(cur)) {
        if (cur[1] > 0) setCursor([cur[0], cur[1] - 1]);
      } else {
        if (cur === 'btn_theme') setCursor('btn_new');
        else if (cur === 'btn_new') setCursor('btn_undo');
        else if (cur === 'btn_undo') setCursor('btn_menu');
      }
    }
    if (dir === 'RIGHT') {
      if (Array.isArray(cur)) {
        if (cur[1] < 7) setCursor([cur[0], cur[1] + 1]);
      } else {
        if (cur === 'btn_menu') setCursor('btn_undo');
        else if (cur === 'btn_undo') setCursor('btn_new');
        else if (cur === 'btn_new') setCursor('btn_theme');
      }
    }
  }, []);

  useEffect(() => {
    let rAF;
    let lastPress = 0;
    const poll = () => {
      const gp = navigator.getGamepads ? navigator.getGamepads()[0] : null;
      if (gp && Date.now() - lastPress > 180) {
        const up = gp.buttons[12]?.pressed || gp.axes[1] < -0.5;
        const down = gp.buttons[13]?.pressed || gp.axes[1] > 0.5;
        const left = gp.buttons[14]?.pressed || gp.axes[0] < -0.5;
        const right = gp.buttons[15]?.pressed || gp.axes[0] > 0.5;
        const ok = gp.buttons[0]?.pressed;
        const back = gp.buttons[1]?.pressed;

        let key = '';
        if (up) key = 'ArrowUp';
        else if (down) key = 'ArrowDown';
        else if (left) key = 'ArrowLeft';
        else if (right) key = 'ArrowRight';
        else if (ok) key = 'Enter';
        else if (back) key = 'Escape';

        if (key) {
          lastPress = Date.now();
          document.dispatchEvent(new KeyboardEvent('keydown', { key }));
        }
      }
      rAF = requestAnimationFrame(poll);
    };
    rAF = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rAF);
  }, []);

  const confirmAction=()=>{
    const {promoSquare:ps,promoCursor:pcc,cursor:cur,gameMode:gm,history:hist}=stateRef.current;
    if(ps){doProm(PROMO_PIECES[pcc]);return;}

    if (Array.isArray(cur)) clickSquare(cur[0], cur[1]);
    else if (cur === 'btn_menu') { resetGame(); setPage('menu'); }
    else if (cur === 'btn_theme') setIsDark(d => !d);
    else if (cur === 'btn_undo') { 
      const canUndoCheck = gm === 'PvE' ? hist.length >= 2 : hist.length >= 1;
      if (canUndoCheck) undoMove(); 
    }
    else if (cur === 'btn_new') resetGame();
  };

  const cancelAction=()=>{
    setSelected(null);setValidMoves([]);
    if (!Array.isArray(stateRef.current.cursor)) setCursor([6,4]);
  };

  useEffect(()=>{
    const handleKeyPress = (e) => {
      const key = e.key;
      const isUp = ['ArrowUp', 'Up', 'w', 'W'].includes(key);
      const isDown = ['ArrowDown', 'Down', 's', 'S'].includes(key);
      const isLeft = ['ArrowLeft', 'Left', 'a', 'A'].includes(key);
      const isRight = ['ArrowRight', 'Right', 'd', 'D'].includes(key);
      const isOK = ['Enter', ' ', 'Select'].includes(key);
      const isBack = ['Escape', 'Backspace', 'GoBack', 'Back'].includes(key);
      
      if(isUp || isDown || isLeft || isRight || isOK || isBack) e.preventDefault(); 
      else return;

      const { page: currPage, menuCursor: mCur, promoSquare, promoCursor, status, thinking } = stateRef.current;

      if (currPage === 'menu') {
        const navMap = {
          'theme':  { up: 'theme',  down: 'medium', left: 'theme',  right: 'theme' },
          'easy':   { up: 'theme',  down: 'PvE',    left: 'easy',   right: 'medium' },
          'medium': { up: 'theme',  down: 'PvE',    left: 'easy',   right: 'hard' },
          'hard':   { up: 'theme',  down: 'PvE',    left: 'medium', right: 'hard' },
          'PvE':    { up: 'medium', down: 'PvP',    left: 'PvE',    right: 'PvE' },
          'PvP':    { up: 'PvE',    down: 'PvP',    left: 'PvP',    right: 'PvP' },
        };
        if (isUp) setMenuCursor(navMap[mCur].up);
        if (isDown) setMenuCursor(navMap[mCur].down);
        if (isLeft) setMenuCursor(navMap[mCur].left);
        if (isRight) setMenuCursor(navMap[mCur].right);
        if (isOK) {
          if (mCur === 'theme') setIsDark(d => !d);
          else if (['easy', 'medium', 'hard'].includes(mCur)) setDifficulty(mCur);
          else if (['PvE', 'PvP'].includes(mCur)) {
            setGameMode(mCur);
            resetGame();
            setPage('game');
          }
        }
        return;
      }

      if (promoSquare) {
        if(isLeft) setPromoCursor(prev => Math.max(0, prev - 1));
        if(isRight) setPromoCursor(prev => Math.min(3, prev + 1));
        if(isOK) doProm(PROMO_PIECES[promoCursor]);
        return;
      }
      
      if (isBack) {
        cancelAction();
        return;
      }
      
      if (status !== 'playing' && !isOK) return;
      if (thinking && !isOK) return;
      
      if (isUp) handleDir('UP');
      if (isDown) handleDir('DOWN');
      if (isLeft) handleDir('LEFT');
      if (isRight) handleDir('RIGHT');
      if (isOK) confirmAction();
    };
    
    document.addEventListener('keydown', handleKeyPress, true);
    return () => { document.removeEventListener('keydown', handleKeyPress, true); };
  },[doProm, clickSquare, handleDir]);

  const resetGame = () => {
    setBoard(INIT_BOARD());setSelected(null);setValidMoves([]);
    setWhiteToMove(true);setHistory([]);setStatus('playing');
    setPromoSquare(null);setThinking(false);setCursor([6,4]);
    setInCheck(false);setLastMove(null);
  };

  const undoMove = () => {
    const steps=gameMode==='PvE'?2:1;
    if(history.length<steps) return;
    const newHist=history.slice(0,-steps);
    let tb=INIT_BOARD();
    newHist.forEach(m=>{tb[m.tr][m.tc]=m.piece;tb[m.fr][m.fc]=null;});
    setBoard(tb);setHistory(newHist);setSelected(null);setValidMoves([]);
    setWhiteToMove(steps===2?true:!whiteToMove);setStatus('playing');setThinking(false);
    setLastMove(newHist.length?newHist[newHist.length-1]:null);
    if (!Array.isArray(stateRef.current.cursor)) setCursor([6,4]);
  };

  const C = isDark ? {
    bg:'#0d1117',bg2:'#161b22',bg3:'#21262d',
    text:'#e6edf3',muted:'#8b949e',
    border:'rgba(255,255,255,0.1)',panel:'rgba(22,27,34,0.95)',
    btn1:'#1f6feb',dpadBtn:'rgba(255,255,255,0.12)',
    focus: '#58a6ff'
  } : {
    bg:'#f6f8fa',bg2:'#ffffff',bg3:'#eaeef2',
    text:'#1f2328',muted:'#656d76',
    border:'rgba(0,0,0,0.12)',panel:'rgba(255,255,255,0.95)',
    btn1:'#0969da',dpadBtn:'rgba(0,0,0,0.1)',
    focus: '#0969da'
  };

  const sqColor = (r,c) => {
    const light=(r+c)%2===0;
    return isDark?(light?'#b8956a':'#6b4226'):(light?'#f0d9b5':'#b58863');
  };

  if(page==='menu'){
    return (
      <div style={{
        position:'fixed',inset:0,background:C.bg,
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        gap:20,padding:20,fontFamily:'-apple-system,BlinkMacSystemFont,system-ui,sans-serif',
        color:C.text,overflowY:'auto',
      }}>
        <button onMouseDown={()=>setIsDark(d=>!d)} style={{
          position:'absolute',top:16,right:16,background:C.bg3,
          border:`1px solid ${C.border}`,borderRadius:'50%',width:44,height:44,
          fontSize:20,cursor:'pointer',color:C.text,
          outline: menuCursor === 'theme' ? `3px solid ${C.focus}` : 'none', outlineOffset: 2
        }}>{isDark?'☀️':'🌙'}</button>

        <div style={{textAlign:'center'}}>
          <div style={{fontSize:48,lineHeight:1,marginBottom:12}}>♟️</div>
          <div style={{display:'flex',justifyContent:'center',alignItems:'baseline',gap:0,marginTop:0,marginBottom:16}}>
            <span style={{fontSize:52,fontWeight:900,letterSpacing:-2,color:'#6366f1'}}>CHESS</span>
            <span style={{fontSize:52,fontWeight:900,letterSpacing:-2,color:'#ec4899'}}> PRO</span>
          </div>
          <div style={{height:3,width:80,margin:'0 auto',borderRadius:2,background:'linear-gradient(90deg,#6366f1,#ec4899)'}}/>
        </div>

        <p style={{margin:0,fontSize:15,color:C.muted}}>Select difficulty & game mode</p>

        <div style={{display:'flex',gap:10}}>
          {[['easy','🟢','#22c55e'],['medium','🟡','#f59e0b'],['hard','🔴','#ef4444']].map(([d,icon,col])=>(
            <button key={d} onMouseDown={()=>setDifficulty(d)} style={{
              padding:'10px 16px',borderRadius:24,border:'none',
              background:difficulty===d?col:'transparent',
              outline: menuCursor === d ? `3px solid ${C.focus}` : (difficulty===d?'none':`2px solid ${C.border}`),
              outlineOffset: menuCursor === d ? 2 : 0,
              color:difficulty===d?'#fff':C.muted,
              fontSize:14,fontWeight:700,cursor:'pointer',
              WebkitTapHighlightColor:'transparent',
            }}>{icon} {d}</button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:14,width:'100%',maxWidth:340}}>
          {[
            {label:'👤 vs 💻  Play vs Computer',mode:'PvE',bg:'linear-gradient(135deg,#4f46e5,#7c3aed)',sh:'rgba(79,70,229,0.35)'},
            {label:'👤 vs 👤  Play with Friend',mode:'PvP',bg:'linear-gradient(135deg,#ec4899,#f43f5e)',sh:'rgba(236,72,153,0.35)'},
          ].map(({label,mode,bg,sh})=>(
            <button key={mode} onMouseDown={()=>{setGameMode(mode);resetGame();setPage('game');}} style={{
              padding:20,background:bg,color:'#fff',border:'none',borderRadius:16,
              fontSize:18,fontWeight:700,cursor:'pointer',boxShadow:`0 8px 24px ${sh}`,
              WebkitTapHighlightColor:'transparent',
              outline: menuCursor === mode ? `4px solid ${isDark ? '#fff' : '#000'}` : 'none', outlineOffset: 2
            }}>{label}</button>
          ))}
        </div>

        <p style={{margin:0,fontSize:12,color:C.muted,textAlign:'center',maxWidth:300}}>
          💡 Use arrow keys / D-pad to navigate, OK / tap to select
        </p>
      </div>
    );
  }

  // GAME
  const canUndo=gameMode==='PvE'?history.length>=2:history.length>=1;
  const statusLabel=
    status==='checkmate'?(whiteToMove?'⚫ Black Wins! 🏆':'⚪ White Wins! 🏆'):
    status==='stalemate'?'🤝 Draw':
    thinking?'💭 Thinking...':
    inCheck?(whiteToMove?'⚪ CHECK ⚠️':'⚫ CHECK ⚠️'):
    (whiteToMove?'⚪ White to move':'⚫ Black to move');

  // Calculates the size of the massive board by subtracting the TopBar and Log spacing
  const maxBoardSize = 'min(calc(100vh - 120px), 95vw)';

  return (
    <div style={{
      position:'fixed',inset:0,background:C.bg,
      display:'flex',flexDirection:'column',
      fontFamily:'-apple-system,BlinkMacSystemFont,system-ui,sans-serif',
      color:C.text,overflow:'hidden',touchAction:'none',
    }}>
      {/* TOP BAR WITH CONTROLS */}
      <div style={{
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'10px 16px',background:C.bg2,borderBottom:`1px solid ${C.border}`,
        minHeight:48,flexShrink:0,gap:12, flexWrap: 'wrap'
      }}>
        <div style={{display:'flex', gap: 10, alignItems: 'center'}}>
          <button onMouseDown={()=>{resetGame();setPage('menu');}} style={{
            padding:'6px 14px',borderRadius:20,background:'transparent',
            border:`1px solid ${C.border}`,color:C.text,fontSize:13,cursor:'pointer',
            WebkitTapHighlightColor:'transparent',
            outline: cursor === 'btn_menu' ? `3px solid ${C.focus}` : 'none', outlineOffset: 2
          }}>← Menu</button>
          
          <button onMouseDown={()=>{if(canUndo)undoMove()}} disabled={!canUndo} style={{
            padding:'6px 14px',borderRadius:20,background:'transparent',
            border:`1px solid ${C.border}`,color:canUndo ? C.text : C.muted,fontSize:13,cursor:canUndo ? 'pointer' : 'not-allowed',
            WebkitTapHighlightColor:'transparent', opacity: canUndo ? 1 : 0.5,
            outline: cursor === 'btn_undo' ? `3px solid ${C.focus}` : 'none', outlineOffset: 2
          }}>↶ Undo</button>
        </div>

        <span style={{
          fontSize:15,fontWeight:800,textAlign:'center',flex:1,
          color:status!=='playing'?'#f59e0b':inCheck?'#ef4444':C.text,
        }}>{statusLabel}</span>

        <div style={{display:'flex', gap: 10, alignItems: 'center'}}>
          <button onMouseDown={()=>{resetGame()}} style={{
            padding:'6px 14px',borderRadius:20,background:'transparent',
            border:`1px solid ${C.border}`,color:C.text,fontSize:13,cursor:'pointer',
            WebkitTapHighlightColor:'transparent',
            outline: cursor === 'btn_new' ? `3px solid ${C.focus}` : 'none', outlineOffset: 2
          }}>⟳ New</button>

          <button onMouseDown={()=>setIsDark(d=>!d)} style={{
            background:'transparent',border:`1px solid ${C.border}`,borderRadius:'50%',
            width:36,height:36,fontSize:16,cursor:'pointer',color:C.text,
            WebkitTapHighlightColor:'transparent',
            outline: cursor === 'btn_theme' ? `3px solid ${C.focus}` : 'none', outlineOffset: 2
          }}>{isDark?'☀️':'🌙'}</button>
        </div>
      </div>

      {/* MASSIVE BOARD */}
      <div style={{
        flex:1,display:'flex',alignItems:'center',justifyContent:'center',
        padding:'8px',overflow:'hidden',
      }}>
        <div style={{
          flexShrink:0,
          width: maxBoardSize,
          height: maxBoardSize,
          background:isDark?'#3a2f20':'#8b5e3c',
          borderRadius:12,padding:6,
          boxShadow:`0 8px 32px rgba(0,0,0,${isDark?0.6:0.25})`,
        }}>
          <div style={{
            display:'grid',gridTemplateColumns:'repeat(8,1fr)',gridTemplateRows:'repeat(8,1fr)',
            width:'100%',height:'100%',borderRadius:8,overflow:'hidden',
          }}>
            {board.map((row,ri)=>row.map((piece,ci)=>{
              const isValid=validMoves.some(([mr,mc])=>mr===ri&&mc===ci);
              const isSel=selected&&selected[0]===ri&&selected[1]===ci;
              const isCur=Array.isArray(cursor)&&cursor[0]===ri&&cursor[1]===ci;
              const isCapt=isValid&&piece!==null;
              const isLast=lastMove&&((lastMove.fr===ri&&lastMove.fc===ci)||(lastMove.tr===ri&&lastMove.tc===ci));
              let bg=sqColor(ri,ci);
              if(isSel) bg=isDark?'#3d5a80':'#6b9ac4';
              else if(isLast&&!isSel) bg=isDark?'rgba(212,175,55,0.45)':'rgba(205,170,45,0.55)';
              return (
                <div key={`${ri}-${ci}`}
                  style={{
                    backgroundColor:bg,position:'relative',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    cursor:'pointer',userSelect:'none',
                    outline:isCur?`3px solid ${C.focus}`:'none',
                    outlineOffset:'-3px',zIndex:isCur?1:0,
                  }}
                  onMouseDown={e=>{e.preventDefault();clickSquare(ri,ci);}}
                  onTouchStart={e=>e.preventDefault()}
                  onTouchEnd={e=>{e.preventDefault();e.stopPropagation();clickSquare(ri,ci);}}
                >
                  {isValid&&(
                    <div style={{
                      position:'absolute',
                      width:isCapt?'88%':'32%',height:isCapt?'88%':'32%',
                      borderRadius:'50%',
                      background:isCapt?'transparent':'rgba(0,0,0,0.22)',
                      border:isCapt?'3px solid rgba(0,0,0,0.28)':'none',
                      pointerEvents:'none',zIndex:2,
                    }}/>
                  )}
                  {piece&&(
                    <span style={{
                      fontSize: `calc(${maxBoardSize} / 9)`, // Dynamically scales the piece correctly to the giant board size
                      lineHeight:1,zIndex:3,
                      color:isW(piece)?(isDark?'#ffe082':'#fdd835'):(isDark?'#c8c8c8':'#1a1a1a'),
                      textShadow:isW(piece)?'0 1px 3px rgba(0,0,0,0.6)':'0 1px 4px rgba(0,0,0,0.5)',
                      WebkitTextStroke:isW(piece)?`0.04em ${isDark?'#a06010':'#8b6200'}`:`0.05em ${isDark?'#000':'#000'}`,
                      filter:isW(piece)?'drop-shadow(0 2px 3px rgba(0,0,0,0.4))':'drop-shadow(0 2px 5px rgba(0,0,0,0.55))',
                      userSelect:'none',WebkitUserSelect:'none',
                    }}>{PIECE_UNICODE[piece]}</span>
                  )}
                </div>
              );
            }))}
          </div>
        </div>
      </div>

      {/* MOVE LOG */}
      {history.length>0&&(
        <div style={{
          padding:'4px 10px',background:C.bg2,borderTop:`1px solid ${C.border}`,
          fontSize:11,color:C.muted,display:'flex',gap:5,overflowX:'auto',
          flexShrink:0,minHeight:26,alignItems:'center',whiteSpace:'nowrap',
        }}>
          <span style={{fontWeight:700}}>moves:</span>
          {history.slice(-10).map((m,i)=>(
            <span key={i} style={{
              padding:'1px 5px',borderRadius:4,
              background:isDark?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.05)',
              color:C.text,fontFamily:'monospace',fontSize:11,
            }}>{m.note}</span>
          ))}
        </div>
      )}

      {/* PROMOTION MODAL */}
      {promoSquare&&(
        <div style={{
          position:'absolute',inset:0,background:'rgba(0,0,0,0.8)',
          display:'flex',alignItems:'center',justifyContent:'center',zIndex:999,
        }}>
          <div style={{
            background:C.bg2,padding:'28px 24px',borderRadius:20,textAlign:'center',
            border:`1px solid ${C.border}`,boxShadow:'0 16px 48px rgba(0,0,0,0.6)',
            minWidth:260,
          }}>
            <h3 style={{margin:'0 0 18px',fontSize:18,fontWeight:700,color:C.text}}>Promote Pawn</h3>
            <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:14}}>
              {PROMO_PIECES.map((p,i)=>(
                <button key={p}
                  onMouseDown={()=>doProm(p)}
                  onTouchStart={e=>e.preventDefault()}
                  onTouchEnd={e=>{e.preventDefault();e.stopPropagation();doProm(p);}}
                  style={{
                    width:58,height:68,borderRadius:12,
                    background:promoCursor===i?(isDark?'#1f6feb':'#0969da'):(isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.05)'),
                    border:promoCursor===i?`2px solid ${isDark?'#58a6ff':'#0969da'}`:`1px solid ${C.border}`,
                    display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                    cursor:'pointer',gap:3,
                    transform:promoCursor===i?'scale(1.1)':'scale(1)',transition:'all 0.15s',
                    WebkitTapHighlightColor:'transparent',
                  }}
                >
                  <span style={{
                    fontSize:30,color:'#fdd835',
                    WebkitTextStroke:'0.05em #9e6b00',
                    textShadow:'0 1px 4px rgba(0,0,0,0.5)',
                  }}>{PIECE_UNICODE[p]}</span>
                  <span style={{fontSize:9,color:promoCursor===i?'#fff':C.muted,fontWeight:700,textTransform:'uppercase'}}>{PROMO_LABELS[i]}</span>
                </button>
              ))}
            </div>
            <p style={{margin:0,fontSize:11,color:C.muted}}>Tap a piece  ·  or use ◄ ► + OK</p>
          </div>
        </div>
      )}
    </div>
  );
}