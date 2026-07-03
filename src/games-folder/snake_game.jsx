import React, { useState, useEffect, useCallback, useRef } from "react";

const CELL_SIZE = 30; // Grid square size
const INITIAL_SPEED = 110;
const MIN_SPEED = 40;

const DIR = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

const OPPOSITE = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

// Helper to spawn items safely on the grid
const getRandomPos = (snake, cols, rows) => {
  let p;
  while (true) {
    p = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    // eslint-disable-next-line no-loop-func
    if (!snake.some(s => s.x === p.x && s.y === p.y)) return p;
  }
};

export default function FullScreenNeonSnake() {
  const [screenSize, setScreenSize] = useState({ w: 800, h: 600 });
  const canvasRef = useRef(null);
  const loopRef = useRef(null);

  // Resize handler for full-screen flexibility
  useEffect(() => {
    const handleResize = () => setScreenSize({ w: window.innerWidth, h: window.innerHeight });
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cols = Math.max(10, Math.floor(screenSize.w / CELL_SIZE));
  const rows = Math.max(10, Math.floor(screenSize.h / CELL_SIZE));

  const INIT_STATE = useCallback((hs = 0) => {
    const startX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2);
    return {
      snake: [{ x: startX, y: startY }, { x: startX - 1, y: startY }, { x: startX - 2, y: startY }],
      dir: "RIGHT",
      nextDir: "RIGHT",
      food: { x: Math.floor(cols * 0.75), y: startY },
      bonusFood: null, 
      lastBonusTime: Date.now(), // Tracks when the last bonus ended/spawned
      score: 0,
      highScore: hs,
      speed: INITIAL_SPEED,
      status: "idle",
    };
  }, [cols, rows]);

  const [gameState, setGameState] = useState(() => INIT_STATE());

  // Prevent crashes if the screen is resized smaller than the snake's current position
  useEffect(() => {
    if (gameState.status === "playing" && (gameState.snake[0].x >= cols || gameState.snake[0].y >= rows)) {
       setGameState(prev => ({ ...INIT_STATE(prev.highScore), status: "dead" }));
    }
  }, [cols, rows, gameState.status, gameState.snake, INIT_STATE]);

  // --- GAME LOGIC ---
  const tick = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== "playing") return prev;

      const currentDir = DIR[prev.nextDir];
      const head = prev.snake[0];
      
      // 1. Screen Wrap-Around
      const nextHead = {
        x: (head.x + currentDir.x + cols) % cols,
        y: (head.y + currentDir.y + rows) % rows,
      };

      // 2. Self Collision
      if (prev.snake.some(s => s.x === nextHead.x && s.y === nextHead.y)) {
        return { ...prev, status: "dead", highScore: Math.max(prev.highScore, prev.score) };
      }

      let ateFood = nextHead.x === prev.food.x && nextHead.y === prev.food.y;
      let ateBonus = prev.bonusFood && nextHead.x === prev.bonusFood.x && nextHead.y === prev.bonusFood.y;

      let nextBonusFood = prev.bonusFood;
      let nextLastBonusTime = prev.lastBonusTime;

      // Bonus Timer Logic: Expires after exactly 30 seconds
      if (nextBonusFood && Date.now() > nextBonusFood.expiresAt) {
        nextBonusFood = null;
        nextLastBonusTime = Date.now(); // Reset timer to start waiting for the next spawn
      }

      // Bonus Spawn Logic: Spawns 30 seconds after the last one was eaten or expired
      if (!nextBonusFood && (Date.now() - nextLastBonusTime > 30000)) {
        nextBonusFood = { 
          ...getRandomPos(prev.snake, cols, rows), 
          expiresAt: Date.now() + 30000 // Exactly 30 seconds from now
        };
      }

      let nextScore = prev.score;
      let nextFood = prev.food;
      let nextSpeed = prev.speed;
      
      // Eating Standard Food
      if (ateFood) {
        nextScore += 10;
        nextFood = getRandomPos(prev.snake, cols, rows);
        nextSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(nextScore / 50) * 4); 
      }

      // Eating Bonus Star
      if (ateBonus) {
        nextScore += 100; // Large 100pt bonus
        nextBonusFood = null;
        nextLastBonusTime = Date.now(); // Reset the wait timer
      }

      const newSnake = (ateFood || ateBonus) ? [nextHead, ...prev.snake] : [nextHead, ...prev.snake.slice(0, -1)];

      return {
        ...prev, snake: newSnake, dir: prev.nextDir, food: nextFood, 
        bonusFood: nextBonusFood, lastBonusTime: nextLastBonusTime, 
        score: nextScore, speed: nextSpeed
      };
    });
  }, [cols, rows]);

  // --- GAME LOOP ---
  useEffect(() => {
    if (gameState.status === "playing") {
      loopRef.current = setInterval(tick, gameState.speed);
    } else {
      clearInterval(loopRef.current);
    }
    return () => clearInterval(loopRef.current);
  }, [gameState.status, gameState.speed, tick]);

  // --- KEYBOARD CONTROLS (Buttons removed) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        ArrowUp: "UP", w: "UP", W: "UP",
        ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT"
      };
      
      const newDir = keyMap[e.key];
      
      if (newDir) {
        e.preventDefault();
        setGameState(prev => {
          if (prev.status !== "playing") return prev;
          if (newDir === OPPOSITE[prev.dir]) return prev; 
          return { ...prev, nextDir: newDir };
        });
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setGameState(prev => prev.status === "playing" ? prev : { ...INIT_STATE(prev.highScore), status: "playing" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [INIT_STATE]);

  // --- RENDER CANVAS ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Clear background
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, screenSize.w, screenSize.h);

    // Draw Grid
    ctx.strokeStyle = "rgba(0, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL_SIZE, 0); ctx.lineTo(i * CELL_SIZE, screenSize.h); ctx.stroke();
    }
    for (let j = 0; j <= rows; j++) {
      ctx.beginPath(); ctx.moveTo(0, j * CELL_SIZE); ctx.lineTo(screenSize.w, j * CELL_SIZE); ctx.stroke();
    }

    const offsetX = (screenSize.w - (cols * CELL_SIZE)) / 2;
    const offsetY = (screenSize.h - (rows * CELL_SIZE)) / 2;
    ctx.translate(offsetX, offsetY);

    // 1. Draw Normal Food
    const fx = gameState.food.x * CELL_SIZE + CELL_SIZE / 2;
    const fy = gameState.food.y * CELL_SIZE + CELL_SIZE / 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff007f";
    ctx.fillStyle = "#ff007f";
    ctx.beginPath(); ctx.arc(fx, fy, CELL_SIZE * 0.4, 0, Math.PI * 2); ctx.fill();

    // 2. Draw Bonus Star (30s Timer)
    if (gameState.bonusFood) {
      const bx = gameState.bonusFood.x * CELL_SIZE + CELL_SIZE / 2;
      const by = gameState.bonusFood.y * CELL_SIZE + CELL_SIZE / 2;
      
      const timeLeftMs = gameState.bonusFood.expiresAt - Date.now();
      const timeLeftSecs = Math.max(0, Math.ceil(timeLeftMs / 1000));
      
      // Pulse gets faster as time runs out
      const pulseSpeed = timeLeftSecs < 10 ? 50 : 150;
      const pulse = Math.abs(Math.sin(Date.now() / pulseSpeed)); 
      
      ctx.shadowBlur = 20 + (pulse * 10);
      ctx.shadowColor = "#ffd700";
      ctx.fillStyle = `rgba(255, 215, 0, ${0.7 + pulse * 0.3})`;
      
      // Star Shape
      ctx.beginPath();
      ctx.moveTo(bx, by - CELL_SIZE * 0.5);
      ctx.lineTo(bx + CELL_SIZE * 0.2, by - CELL_SIZE * 0.2);
      ctx.lineTo(bx + CELL_SIZE * 0.5, by);
      ctx.lineTo(bx + CELL_SIZE * 0.2, by + CELL_SIZE * 0.2);
      ctx.lineTo(bx, by + CELL_SIZE * 0.5);
      ctx.lineTo(bx - CELL_SIZE * 0.2, by + CELL_SIZE * 0.2);
      ctx.lineTo(bx - CELL_SIZE * 0.5, by);
      ctx.lineTo(bx - CELL_SIZE * 0.2, by - CELL_SIZE * 0.2);
      ctx.fill();

      // Draw the Countdown Timer above the star
      ctx.shadowBlur = 0;
      ctx.fillStyle = timeLeftSecs <= 10 ? "#ff007f" : "#ffffff"; // Turns red in last 10s
      ctx.font = "bold 14px 'Courier New'";
      ctx.textAlign = "center";
      ctx.fillText(`${timeLeftSecs}s`, bx, by - CELL_SIZE * 0.8);
    }

    // 3. Draw Snake
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffff"; 
    
    gameState.snake.forEach((seg, index) => {
      const sx = seg.x * CELL_SIZE;
      const sy = seg.y * CELL_SIZE;
      
      if (index === 0) {
        ctx.fillStyle = "#ffffff"; 
        ctx.shadowBlur = 20;
      } else {
        ctx.fillStyle = `rgba(0, 255, 255, ${1 - (index / gameState.snake.length) * 0.6})`;
        ctx.shadowBlur = 5;
      }

      ctx.beginPath();
      ctx.roundRect(sx + 2, sy + 2, CELL_SIZE - 4, CELL_SIZE - 4, 6);
      ctx.fill();
    });

    ctx.resetTransform(); 
  }, [gameState, screenSize, cols, rows]);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "#050510", color: "#00ffff", fontFamily: "'Courier New', Courier, monospace",
      overflow: "hidden", userSelect: "none"
    }}>
      <style>{`
        @keyframes textGlow { 0%, 100% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; } 50% { text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff; } }
      `}</style>

      {/* HEADER SCORE OVERLAY */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between",
        padding: "20px 40px", zIndex: 30, pointerEvents: "none"
      }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "16px", color: "#ff007f", letterSpacing: "3px", fontWeight: "bold", textShadow: "0 0 5px #ff007f" }}>SCORE</span>
          <span style={{ fontSize: "40px", fontWeight: "900", animation: "textGlow 2s infinite" }}>
            {String(gameState.score).padStart(4, '0')}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: "16px", color: "#ffd700", letterSpacing: "3px", fontWeight: "bold", textShadow: "0 0 5px #ffd700" }}>HI-SCORE</span>
          <span style={{ fontSize: "40px", fontWeight: "900", color: "#ffd700", textShadow: "0 0 10px #ffd700" }}>
            {String(gameState.highScore).padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* CANVAS */}
      <canvas ref={canvasRef} width={screenSize.w} height={screenSize.h} style={{ display: "block" }} />

      {/* SCANLINE EFFECT */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10,
        background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
        backgroundSize: "100% 4px"
      }}/>

      {/* GAME OVER / START MENU */}
      {gameState.status !== "playing" && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", background: "rgba(2, 2, 5, 0.85)", zIndex: 20
        }}>
          <h1 style={{ 
            fontSize: "clamp(40px, 8vw, 80px)", margin: "0 0 20px 0", 
            color: gameState.status === "dead" ? "#ff007f" : "#00ffff",
            textShadow: gameState.status === "dead" ? "0 0 20px #ff007f" : "0 0 20px #00ffff",
            letterSpacing: "5px", textAlign: "center"
          }}>
            {gameState.status === "dead" ? "Game Over" : "SNAKE.EXE"}
          </h1>
          
          <p style={{ color: "#ffffff", marginBottom: "40px", letterSpacing: "2px", fontSize: "16px", textShadow: "0 0 5px #fff", textAlign: "center", lineHeight: "1.8" }}>
            [ ARROWS OR WASD ] TO MOVE <br/>
            [ WALLS WRAP AROUND ] <br/>
            <span style={{color: "#ffd700"}}>CATCH STARS FOR BONUS (+100)</span>
          </p>
          
          <button
            onClick={() => setGameState(prev => ({ ...INIT_STATE(prev.highScore), status: "playing" }))}
            style={{
              background: "transparent", color: "#00ffff", border: "2px solid #00ffff", 
              padding: "15px 50px", fontSize: "24px", fontWeight: "bold", cursor: "pointer",
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 15px rgba(0, 255, 255, 0.3)",
              textShadow: "0 0 5px #00ffff", fontFamily: "inherit", letterSpacing: "3px",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#00ffff"; e.currentTarget.style.color = "#000"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00ffff"; }}
          >
            {gameState.status === "dead" ? "INSERT COIN" : "START"}
          </button>
        </div>
      )}
    </div>
  );
}