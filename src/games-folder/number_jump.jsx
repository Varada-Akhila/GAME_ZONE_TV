import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 30 Animals for 10 Levels
const ALL_ICONS = [
  '🐶', '🐱', '🦁', '🐯', '🐰', '🐼', '🐵', '🐨', '🦊', '🐷', 
  '🐸', '🐒', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', 
  '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐢'
];
const TOTAL_LEVELS = 10;

export default function TVMemoryMatch() {
  const [currentScreen, setCurrentScreen] = useState('menu'); 
  const [highestUnlocked, setHighestUnlocked] = useState(1);
  const [level, setLevel] = useState(1);
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(0); 
  const [disabled, setDisabled] = useState(false);
  const [gameState, setGameState] = useState('playing'); 
  
  // NEW: Tracks if the user is tapping (mobile) or using arrows (TV)
  const [inputMode, setInputMode] = useState('tv'); 

  const gameRef = useRef(null);

  // Load Saved Levels
  useEffect(() => {
    const savedLevel = localStorage.getItem('tv_memory_unlocked');
    if (savedLevel) setHighestUnlocked(Number(savedLevel));
    if (gameRef.current) gameRef.current.focus();
  }, []);

  // Save Levels
  useEffect(() => {
    localStorage.setItem('tv_memory_unlocked', highestUnlocked);
  }, [highestUnlocked]);

  // Setup Board
  useEffect(() => {
    if (currentScreen === 'menu') return;

    const pairCount = level * 3; 
    const selected = ALL_ICONS.slice(0, pairCount);
    let deck = [...selected, ...selected].map((icon, index) => ({ id: index, icon }));
    
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    setCards(deck);
    setSolved([]);
    setFlipped([]);
    setFocusedIndex(0); 
    setGameState('playing');
    setDisabled(false);
  }, [level, currentScreen]);

  // Unified Flip Logic (Works for both Touch and TV Remote)
  const handleFlip = useCallback((idx) => {
    if (disabled || flipped.includes(idx) || solved.includes(idx)) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setDisabled(true);
      setTimeout(() => {
        const [id1, id2] = newFlipped;
        if (cards[id1].icon === cards[id2].icon) {
          const newSolved = [...solved, id1, id2];
          setSolved(newSolved);
          
          if (newSolved.length === cards.length && cards.length > 0) {
            setTimeout(() => {
              if (level === highestUnlocked && level < TOTAL_LEVELS) {
                setHighestUnlocked(level + 1);
              }
              if (level >= TOTAL_LEVELS) setGameState('game_over');
              else setGameState('level_complete');
            }, 600);
          }
        }
        setFlipped([]);
        setDisabled(false);
      }, 800);
    }
  }, [disabled, flipped, solved, cards, level, highestUnlocked]);

  // TV Remote Controls
  const handleKeyDown = useCallback((e) => {
    if (disabled) return;
    
    setInputMode('tv'); // Wake up TV mode when keys are pressed

    if (currentScreen === 'menu') {
      const cols = 5; 
      switch (e.key) {
        case 'ArrowRight': setFocusedIndex(p => (p + 1) % TOTAL_LEVELS); break;
        case 'ArrowLeft': setFocusedIndex(p => (p - 1 + TOTAL_LEVELS) % TOTAL_LEVELS); break;
        case 'ArrowDown': setFocusedIndex(p => (p + cols) % TOTAL_LEVELS); break;
        case 'ArrowUp': setFocusedIndex(p => (p - cols + TOTAL_LEVELS) % TOTAL_LEVELS); break;
        case 'Enter': 
          if (focusedIndex + 1 <= highestUnlocked) {
            setLevel(focusedIndex + 1);
            setCurrentScreen('playing');
            setFocusedIndex(0); 
          }
          break;
        default: break;
      }
      return;
    }

    if (gameState === 'level_complete' && e.key === 'Enter') {
      if (level < TOTAL_LEVELS) setLevel(prev => prev + 1);
      else { setCurrentScreen('menu'); setFocusedIndex(0); }
      return;
    }
    if (gameState === 'game_over' && e.key === 'Enter') {
      setCurrentScreen('menu');
      setFocusedIndex(0);
      return;
    }

    if (gameState !== 'playing') return;

    const cols = level * 2; 

    switch (e.key) {
      case 'ArrowRight': setFocusedIndex(p => (p + 1) % cards.length); break;
      case 'ArrowLeft': setFocusedIndex(p => (p - 1 + cards.length) % cards.length); break;
      case 'ArrowDown': setFocusedIndex(p => (p + cols) % cards.length); break;
      case 'ArrowUp': setFocusedIndex(p => (p - cols + cards.length) % cards.length); break;
      case 'Enter': 
        handleFlip(focusedIndex);
        break;
      case 'Escape':
      case 'Backspace':
        setCurrentScreen('menu');
        setFocusedIndex(0);
        break;
      default: break;
    }
  }, [currentScreen, focusedIndex, highestUnlocked, gameState, disabled, level, cards, handleFlip]);

  // Keep app focused for TV remote if user taps the screen
  const ensureFocus = () => {
    if (gameRef.current) gameRef.current.focus();
  };

  // --- MENU SCREEN ---
  if (currentScreen === 'menu') {
    return (
      <div style={styles.container} tabIndex={0} onKeyDown={handleKeyDown} ref={gameRef} onClick={ensureFocus}>
        <h1 style={styles.title}>Memory Match! 🧠</h1>
        <br></br><br></br>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 140px)', gap: '30px', marginTop: '40px' }}>
          {Array.from({ length: TOTAL_LEVELS }).map((_, i) => {
            const levelNum = i + 1;
            const isUnlocked = levelNum <= highestUnlocked;
            // Only show focus effect if in TV mode
            const isFocused = inputMode === 'tv' && focusedIndex === i; 

            return (
              <motion.div
                key={i}
                onClick={() => {
                  setInputMode('touch'); // Hide TV cursor
                  if (isUnlocked) {
                    setLevel(levelNum);
                    setCurrentScreen('playing');
                    setFocusedIndex(0);
                  }
                }}
                animate={{ 
                  scale: isFocused ? 1.15 : 1,
                  y: isFocused ? -10 : 0 
                }}
                style={{
                  ...styles.menuCard,
                  background: isUnlocked ? '#06D6A0' : '#BDC3C7',
                  border: isFocused ? '6px solid #FFFFFF' : '6px solid rgba(0,0,0,0.1)',
                  boxShadow: isFocused 
                    ? '0 15px 0 #02805E, 0 25px 30px rgba(0,0,0,0.3)' 
                    : `0 8px 0 ${isUnlocked ? '#02805E' : '#7F8C8D'}`,
                  color: isUnlocked ? '#ffffff' : '#7F8C8D',
                  textShadow: isUnlocked ? '2px 2px 0 rgba(0,0,0,0.2)' : 'none',
                  cursor: isUnlocked ? 'pointer' : 'default'
                }}
              >
                {isUnlocked ? `Lv ${levelNum}` : '🔒'}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- GAME SCREEN (CARTOON UI) ---
  return (
    <div style={styles.container} tabIndex={0} onKeyDown={handleKeyDown} ref={gameRef} onClick={ensureFocus}>
      <div style={styles.headerBar}>
        <h1 style={styles.levelTitle}>Level {level} 🐾</h1>
        <span style={styles.scoreBoard}>Pairs: {solved.length / 2} / {cards.length / 2}</span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${level * 2}, 120px)`, 
        gridTemplateRows: 'repeat(3, 120px)', 
        gap: '25px', 
      }}>
        {cards.map((card, idx) => {
          const isCardFlipped = flipped.includes(idx) || solved.includes(idx);
          // Only show focus ring if using TV remote
          const isFocused = inputMode === 'tv' && focusedIndex === idx;

          return (
            <motion.div
              key={card.id}
              onClick={() => {
                setInputMode('touch'); // Instantly switch to touch mode
                setFocusedIndex(idx);
                handleFlip(idx);       // Standard pure onClick for instant mobile response
              }}
              animate={{ 
                scale: isFocused ? 1.1 : 1, 
                rotateY: isCardFlipped ? 180 : 0,
                y: isFocused && !isCardFlipped ? -8 : 0, 
                zIndex: isFocused ? 5 : 1
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{
                width: '100%', height: '100%',
                background: isCardFlipped ? '#ffffff' : '#12fa39', 
                border: isFocused ? '6px solid #b43da0' : '6px solid #7fe512',
                boxShadow: isFocused 
                  ? '0 12px 0 #cb4498, 0 15px 20px rgba(0,0,0,0.3)' 
                  : '0 8px 0 #90e83e',
                borderRadius: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '5rem',
                color: '#EF476F',
                fontWeight: '900',
                cursor: 'pointer' // Important for mobile browsers
              }}
            >
              {isCardFlipped ? (
                <span style={{ transform: 'rotateY(180deg)', display: 'inline-block' }}>{card.icon}</span>
              ) : (
                <span style={{ fontSize: '4rem', opacity: 0.8 }}>?</span>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {gameState !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            style={styles.overlay}
          >
            <div style={styles.modalBox}>
              <h2 style={styles.modalText}>
                {gameState === 'game_over' ? 'All Levels Cleared! 🏆' : 'Great Job! 🎉'}
              </h2>
              
              <div 
                style={styles.actionButton}
                onClick={() => {
                  setInputMode('touch');
                  if (gameState === 'level_complete' && level < TOTAL_LEVELS) {
                    setLevel(prev => prev + 1);
                    setGameState('playing');
                  } else {
                    setCurrentScreen('menu');
                    setFocusedIndex(0);
                  }
                }}
              >
                {gameState === 'level_complete' ? 'Play Next Level' : 'Main Menu'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Playful "Cartoon Arcade" Styles
const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    background: 'linear-gradient(180deg, #5e31b8 0%, #00f2fe 100%)',
    minHeight: '100vh',
    color: '#ffffff',
    fontFamily: '"Nunito", "Comic Sans MS", "Fredoka One", sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    touchAction: 'manipulation', // Prevents 300ms double-tap delay on mobile
    outline: 'none'
  },
  title: { 
    fontSize: '4.5rem', 
    margin: '0 0 10px 0', 
    textShadow: '4px 4px 0 #118AB2', 
    fontWeight: '900',
    letterSpacing: '2px'
  },
  subtitle: { 
    fontSize: '1.5rem', 
    backgroundColor: '#118AB2', 
    padding: '12px 30px', 
    borderRadius: '30px', 
    margin: '0 0 30px 0',
    border: '4px solid #0B5A75',
    fontWeight: 'bold',
    boxShadow: '0 4px 0 #0B5A75'
  },
  menuCard: {
    height: '140px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: '900',
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    maxWidth: '1200px',
    marginBottom: '40px',
    padding: '0 20px'
  },
  levelTitle: {
    fontSize: '3.5rem',
    margin: 0,
    textShadow: '3px 3px 0 #118AB2',
    fontWeight: '900'
  },
  backButton: {
    backgroundColor: '#EF476F',
    padding: '10px 20px',
    borderRadius: '15px',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    border: '3px solid #C1121F',
    boxShadow: '0 4px 0 #C1121F'
  },
  scoreBoard: {
    backgroundColor: '#06D6A0',
    padding: '10px 20px',
    borderRadius: '15px',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    border: '3px solid #02805E',
    boxShadow: '0 4px 0 #02805E'
  },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    zIndex: 10
  },
  modalBox: {
    backgroundColor: '#ffffff', 
    padding: '40px 60px',
    borderRadius: '20px',
    border: 'none', 
    boxShadow: '0 10px 40px rgba(0,0,0,0.4)', 
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  modalText: {
    fontSize: '3.5rem',
    color: '#333333', 
    margin: '0 0 30px 0',
    fontWeight: 'bold',
    textShadow: 'none' 
  },
  actionButton: {
    padding: '15px 40px', 
    backgroundColor: '#333333', 
    borderRadius: '10px', 
    fontSize: '2rem', 
    fontWeight: 'bold', 
    color: '#ffffff',
    border: 'none', 
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    cursor: 'pointer' // Ensures touch registers natively as a button press
  }
};