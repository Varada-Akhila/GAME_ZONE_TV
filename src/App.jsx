import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const BubbleGame           = React.lazy(() => import('./games-folder/bubble_game'));
const BubbleLetters        = React.lazy(() => import('./games-folder/bubble_letters'));
const Game2048             = React.lazy(() => import('./games-folder/game2048'));
const LinkPipePuzzle       = React.lazy(() => import('./games-folder/link_pipe_puzzle'));
const MathGame             = React.lazy(() => import('./games-folder/math_game'));
const SnakeGame            = React.lazy(() => import('./games-folder/snake_game'));
const SpaceWave            = React.lazy(() => import('./games-folder/space_wave'));
const WordGame             = React.lazy(() => import('./games-folder/word_game'));
const WordTyping           = React.lazy(() => import('./games-folder/word_typing'));
const NumberLineMatch      = React.lazy(() => import('./games-folder/numberlinematch.jsx'));
const BallShooterGame      = React.lazy(() => import('./games-folder/ballreduction.jsx'));
const TrigQuestWeb         = React.lazy(() => import('./games-folder/trigame.jsx'));
const Algebra_Quest        = React.lazy(() => import('./games-folder/Algebra_Quest.jsx'));
const PeriodicChallenge    = React.lazy(() => import('./games-folder/Periodic_table.jsx'));
const NumberJump           = React.lazy(() => import('./games-folder/number_jump.jsx'));
const PunctuationPop       = React.lazy(() => import('./games-folder/Pun_wordpop.jsx'));
const HarmonyQuest         = React.lazy(() => import('./games-folder/Harmony_Quest.jsx'));
const ChessGame            = React.lazy(() => import('./games-folder/Chess.jsx'));
const newquizgame          = React.lazy(() => import('./games-folder/newquizgame.jsx'));
const bodyparts            = React.lazy(() => import('./games-folder/bodyparts.jsx'));
const SolarSystemQuizGame  = React.lazy(() => import('./games-folder/solar.jsx'));
const WaterJourneyQuizGame = React.lazy(() => import('./games-folder/watercycle.jsx'));
const AnimalDietQuizGame   = React.lazy(() => import('./games-folder/animal.jsx'));
const SeasonsQuizGame      = React.lazy(() => import('./games-folder/seasons.jsx'));
const electric             = React.lazy(() => import('./games-folder/electric.jsx'));
const ColorLearningGame    = React.lazy(() => import('./games-folder/colurdrop.jsx'));
const natuarl              = React.lazy(() => import('./games-folder/natuarl.jsx'));
const BrainMazeAdventure   = React.lazy(() => import('./games-folder/BrainMazeAdventure'));
const TVCodingGame         = React.lazy(() => import('./games-folder/TVCodingGame'));
const AnimalRescueAdventure = React.lazy(() => import('./games-folder/AnimalRescueAdventure'));
const GeographyExplorerTV  = React.lazy(() => import('./games-folder/GeographyExplorerTv.jsx'));
const LabExperimentTV      = React.lazy(() => import('./games-folder/LabExperimentTV.jsx'));
const StatesCapitalTVQuiz  = React.lazy(() => import('./games-folder/StatesCapitalTVQuiz'));
const OddOneOut            = React.lazy(() => import('./games-folder/Odd-One-Out'));
const TimeTeacherQuiz      = React.lazy(() => import('./games-folder/TimeTeacherQuiz'));
const MountainsQuiz        = React.lazy(() => import('./games-folder/MountainsQuiz'));
const ScientistsQuiz       = React.lazy(() => import('./games-folder/ScientistsQuiz'));
const AnimalBabiesQuiz     = React.lazy(() => import('./games-folder/AnimalBabiesQuiz'));
const NumberSeriesQuiz     = React.lazy(() => import('./games-folder/NumberSeriesQuiz'));
const TypesOfEnergyTVQuiz  = React.lazy(() => import('./games-folder/TypesOfEnergyTVQuiz.jsx'));

const GAMES = [
  { id:'bubble_game',    name:'Bubble Shooter',    component:BubbleGame,     category:'arcade',   emoji:'🫧', color:'#e74c3c', bg:'linear-gradient(135deg,#ffb3b3,#e74c3c)', desc:'Shoot & pop coloured bubbles' },
  { id:'bubble_letters', name:'Bubble Letters',    component:BubbleLetters,  category:'typing',   emoji:'🔤', color:'#f97316', bg:'linear-gradient(135deg,#fed7aa,#f97316)', desc:'Type letters to pop bubbles' },
  { id:'game2048',       name:'2048',              component:Game2048,       category:'puzzle',   emoji:'🔢', color:'#16a34a', bg:'linear-gradient(135deg,#bbf7d0,#16a34a)', desc:'Merge tiles to reach 2048' },
  { id:'link_pipe',      name:'Pipe Puzzle',       component:LinkPipePuzzle, category:'puzzle',   emoji:'🔗', color:'#2563eb', bg:'linear-gradient(135deg,#bfdbfe,#2563eb)', desc:'Connect the colour pipes' },
  { id:'math_game',      name:'Math Quest',        component:MathGame,       category:'learning', emoji:'🧮', color:'#7c3aed', bg:'linear-gradient(135deg,#ddd6fe,#7c3aed)', desc:'Addition, subtraction & more' },
  { id:'snake_game',     name:'Snake',             component:SnakeGame,      category:'arcade',   emoji:'🐍', color:'#0d9488', bg:'linear-gradient(135deg,#99f6e4,#0d9488)', desc:'Classic snake — eat & grow' },
  { id:'space_wave',     name:'Space Wave',        component:SpaceWave,      category:'arcade',   emoji:'🚀', color:'#db2777', bg:'linear-gradient(135deg,#fbcfe8,#db2777)', desc:'Navigate through space gaps' },
  { id:'word_game',      name:'Word Game',         component:WordGame,       category:'learning', emoji:'📝', color:'#059669', bg:'linear-gradient(135deg,#a7f3d0,#059669)', desc:'Guess words by topic' },
  { id:'word_typing',    name:'Underwater Typing', component:WordTyping,     category:'typing',   emoji:'🐟', color:'#0284c7', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'Type words to rescue fish' },
  { id:'NumberLineMatch',name:'Line Match',        component:NumberLineMatch,category:'learning', emoji:'➕', color:'#1cc702', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'Line the number to make 10 and match it' },
  { id:'ballreduction',  name:'Reducing Balls',    component:BallShooterGame,category:'arcade',   emoji:'🏐', color:'#c7029c', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'Shoot the balls to pop them' },
  { id:'trigame',  name:'learning trigonometry',    component:TrigQuestWeb,category:'Quiz',   emoji:'🎗️', color:'#505262', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'learn first and then play' },
  { id:'Algebra_Quest',  name:'Equational work',    component:Algebra_Quest,category:'Quiz',   emoji:'⚖️', color:'#deed36', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'Score, accuracy %, correct count' },
  { id:'Periodic_table',  name:'Chemical Equations',    component:PeriodicChallenge,category:'Quiz',   emoji:'🧪', color:'#9b626c', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'Periodic Table Challenge game!' },
  { id:'number_jump',  name:'Memory match',    component:NumberJump,category:'arcade',   emoji:'😺', color:'#3bc80c', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'memorize the cards to match' },
  { id:'Pun_wordpop',  name:'Punctuation & Word Pop',    component:PunctuationPop,category:'arcade',   emoji:'.?!', color:'#57c7d6', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'Punctuation & Word Pop' },
  { id:'Harmony_Quest',  name:'Harmony Quest',    component:HarmonyQuest,category:'learning',   emoji:'😊', color:'#dd2727', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'Harmony_Quest' },
  { id:'chess',  name:'Play Chess',    component:ChessGame,category:'learning',   emoji:'♟️', color:'#4a8817', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'valid moves highlight in gold' },
  { id:'quiz_game',  name:'national india ',    component:newquizgame,category:'Quiz',   emoji:'🐅', color:'#6e087b', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'India' },
  { id:'body_parts',  name:'learn body parts ',    component:bodyparts,category:'Quiz',   emoji:'🧍‍♀️', color:'#455a9f', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'learn body parts with me' },
  { id:'solar',  name:'Explore the sky ',    component:SolarSystemQuizGame,category:'Quiz',   emoji:'🌇', color:'#83dea1', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'explore the world' },
  { id:'Water Cycle',  name:'Water Cycle ',    component:WaterJourneyQuizGame,category:'Quiz',   emoji:'🫗', color:'#e93ee3', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'explore the water cycle' },
  { id:'Animal chain',  name:'Animal Chain ',    component:AnimalDietQuizGame,category:'Quiz',   emoji:'🐮', color:'#e9603e', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'explore the animal food plan' },
  { id:'Seasons',  name:'Seasons',    component:SeasonsQuizGame,category:'Quiz',   emoji:'🌦️', color:'#7a3ee9', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'explore the season plan' },
  { id:'electric',  name:'electric',    component:electric,category:'Quiz',   emoji:'🔌', color:'#f5f1fb', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'explore the electricity plan' },
  { id:'colour',  name:'Colour Drop',    component:ColorLearningGame,category:'Puzzle',   emoji:'🎨', color:'#e11cbd', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'Drop the ring at same color' },
  { id:'Natural',  name:'Natuarl',    component:natuarl,category:'Quiz',   emoji:'🌊', color:'#1ce130', bg:'linear-gradient(135deg,#bae6fd,#0284c7)', desc:'Learn and Be Safe' },
  { id:'brain_maze', name:'Brain Maze Adventure', component:BrainMazeAdventure, category:'learning', emoji:'🧠', color:'#facc15', bg:'linear-gradient(135deg,#fde68a,#facc15)',  desc:'Solve questions and escape the maze' },
  { id:'tv_coding_game', name:'TV Coding Game', component:TVCodingGame, category:'learning', emoji:'🤖', color:'#14b8a6', bg:'linear-gradient(135deg,#99f6e4,#14b8a6)', desc:'Control robot using TV remote commands' },
  { id: "animal_rescue", name: "Animal Rescue Adventure", component: AnimalRescueAdventure, category: "arcade", emoji: "🐾", color: "#22c55e", bg: "linear-gradient(135deg,#bbf7d0,#22c55e)", desc: "Rescue animals using TV remote controls" },
  { id:'geography_explorer', name:'Geography Explorer', component: GeographyExplorerTV, category:'Quiz', emoji:'🌍', color:'#0ea5e9', bg:'linear-gradient(135deg,#7dd3fc,#0ea5e9)', desc:'Explore countries, flags, capitals and landmarks' },
  { id:'lab_experiment', name:'Lab Experiment', component: LabExperimentTV, category:'learning', emoji:'🧪', color:'#06b6d4', bg:'linear-gradient(135deg,#67e8f9,#0284c7)', desc:'Memorize formulas and create scientific experiments' },
  { id:'states_capitals_quiz', name:'States & Capitals Quiz', component: StatesCapitalTVQuiz, category:'Quiz', emoji:'🇮🇳', color:'#8b5cf6', bg:'linear-gradient(135deg,#c4b5fd,#8b5cf6)', desc:'Learn and test Indian states and capitals' },
  { id:'odd_one_out', name:'Odd One Out', component: OddOneOut, category:'learning', emoji:'🎯', color:'#f59e0b', bg:'linear-gradient(135deg,#fde68a,#f59e0b)', desc:'Find the odd item from the given category' },
  { id:'time_teacher_quiz', name:'Time Teacher Quiz', component: TimeTeacherQuiz, category:'Quiz', emoji:'⏰', color:'#06b6d4', bg:'linear-gradient(135deg,#67e8f9,#0891b2)', desc:'Learn and identify time using analog clocks' },
  { id:'mountains_quiz', name:'Mountains Quiz', component: MountainsQuiz, category:'Quiz', emoji:'🏔️', color:'#3b82f6', bg:'linear-gradient(135deg,#bfdbfe,#3b82f6)', desc:'Learn world mountains, countries, continents and fun facts' },
  { id:'scientists_quiz',name:'Great Scientists Quiz', component: ScientistsQuiz, category:'Quiz', emoji:'🔬', color:'#8b5cf6', bg:'linear-gradient(135deg,#c4b5fd,#7c3aed)', desc:'Learn famous scientists, inventors and discoveries' },
  { id:'animal_babies_quiz', name:'Animal Babies Quiz', component: AnimalBabiesQuiz, category:'Quiz', emoji:'🐾', color:'#22c55e', bg:'linear-gradient(135deg,#bbf7d0,#22c55e)', desc:'Learn baby animal names and test your knowledge' },
  { id:'number_series_quiz', name:'Number Series Quiz', component:NumberSeriesQuiz, category:'Quiz', emoji:'🔢', color:'#14b8a6', bg:'linear-gradient(135deg,#99f6e4,#14b8a6)', desc:'Learn number patterns and solve series questions' },
  {id: 'types_of_energy_quiz',name: 'Types of Energy Quiz',component:TypesOfEnergyTVQuiz, category:'Quiz',emoji: '⚡',color: '#22c55e',bg: 'linear-gradient(135deg,#bbf7d0,#22c55e)',desc: 'Explore light, heat, sound, electrical, mechanical, chemical, solar, wind, and hydro energy through fun quizzes'},
];

const CATEGORIES = [
  { id:'all',      label:'All', emoji:'🎮', color:'#f97316' },
  { id:'learning', label:'Learning',  emoji:'🎓', color:'#16a34a' },
  { id:'typing',   label:'Typing',    emoji:'⌨️',  color:'#0284c7' },
  { id:'puzzle',   label:'Puzzle',    emoji:'🧩', color:'#7c3aed' },
  { id:'arcade',   label:'Arcade',    emoji:'👾', color:'#e74c3c' },
  { id:'Quiz',   label:'Quiz',    emoji:'📚', color:'#ca1cb0' },
];

const CAT_BG = {
  all:      'radial-gradient(ellipse at 0% 0%,#fff3cd,transparent 45%),radial-gradient(ellipse at 100% 100%,#fde8f0,transparent 45%),#fffdf8',
  learning: 'radial-gradient(ellipse at 0% 0%,#dcfce7,transparent 50%),radial-gradient(ellipse at 100% 100%,#f0fdf4,transparent 50%),#f6fff8',
  typing:   'radial-gradient(ellipse at 0% 0%,#dbeafe,transparent 50%),radial-gradient(ellipse at 100% 100%,#eff6ff,transparent 50%),#f5faff',
  puzzle:   'radial-gradient(ellipse at 0% 0%,#ede9fe,transparent 50%),radial-gradient(ellipse at 100% 100%,#f5f3ff,transparent 50%),#faf8ff',
  arcade:   'radial-gradient(ellipse at 0% 0%,#fee2e2,transparent 50%),radial-gradient(ellipse at 100% 100%,#fff1f2,transparent 50%),#fff6f6',
};

const CAT_DESCRIPTIONS = {
  all:      'All 12 games in one place',
  learning: 'Letters, words & math games',
  typing:   'Improve your typing speed',
  puzzle:   'Brain-teasing puzzle games',
  arcade:   'Fast & fun action games',
};

/* ── PAGE 1: Home — category tiles only ─────────────────────────── */
function HomePage({ onSelectCategory }) {
  const [idx, setIdx] = useState(0);

  const gameCounts = Object.fromEntries(
    CATEGORIES.map(c => [c.id, c.id === 'all' ? GAMES.length : GAMES.filter(g => g.category === c.id).length])
  );

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') { setIdx(i => (i+1) % CATEGORIES.length); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { setIdx(i => (i-1+CATEGORIES.length) % CATEGORIES.length); e.preventDefault(); }
      if (e.key === 'Enter' || e.key === ' ') {
        onSelectCategory(CATEGORIES[idx].id, null);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [idx, onSelectCategory]);

  return (
    <div className="tv-home">
      <header className="tv-header">
        <div className="tv-logo">
          <span className="tv-logo-icon">🎮</span>
          <span className="tv-logo-text">GameZone TV</span>
        </div>
        <span className="tv-nav-hint">⬅ ➡ Navigate &nbsp;·&nbsp; OK to Select</span>
      </header>

      <div className="tv-home-body">
        <div className="tv-home-title">Choose a Category</div>
        <div className="tv-cat-tiles">
          {CATEGORIES.map((cat, i) => {
            const focused = idx === i;
            return (
              <div key={cat.id}
                className={`tv-cat-tile${focused ? ' focused' : ''}`}
                style={{ '--cat-color': cat.color }}
                onClick={() => { setIdx(i); onSelectCategory(cat.id, null); }}>
                <div className="tv-cat-tile-emoji">{cat.emoji}</div>
                <div className="tv-cat-tile-label">{cat.label}</div>
                <div className="tv-cat-tile-count">{gameCounts[cat.id]} games</div>
                <div className="tv-cat-tile-desc">{CAT_DESCRIPTIONS[cat.id]}</div>
                {focused && <div className="tv-cat-tile-bar" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── PAGE 2: Category — Updated for auto-scrolling ── */
function CategoryPage({ categoryId, highlightId, onBack, onPlayGame }) {
  const cat = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const games = categoryId === 'all' ? GAMES : GAMES.filter(g => g.category === categoryId);
  const [idx, setIdx] = useState(() => Math.max(0, games.findIndex(g => g.id === highlightId)));
  
  const gridRef = useRef(null);

  const getCols = () => {
    const w = window.innerWidth;
    if (w > 1024) return 4;
    if (w > 768) return 3;
    if (w > 480) return 2;
    return 1;
  };

  useEffect(() => {
    if (gridRef.current && gridRef.current.children[idx]) {
      gridRef.current.children[idx].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [idx]);

  useEffect(() => {
    const h = (e) => {
      const COLS = getCols();
      const rows = Math.ceil(games.length / COLS);
      const row = Math.floor(idx / COLS);
      const col = idx % COLS;

      if (e.key === 'ArrowRight') {
        setIdx(i => (i + 1) % games.length);
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') {
        if (col === 0) onBack();
        else setIdx(i => i - 1);
        e.preventDefault();
      }
      if (e.key === 'ArrowDown' && row < rows - 1) {
        setIdx(i => Math.min(games.length - 1, i + COLS));
        e.preventDefault();
      }
      if (e.key === 'ArrowUp') {
        if (row === 0) onBack();
        else setIdx(i => i - COLS);
        e.preventDefault();
      }
      if (e.key === 'Enter' || e.key === ' ') {
        if (games[idx]) onPlayGame(games[idx].id);
        e.preventDefault();
      }
      if (e.key === 'GoBack' || e.key === 'XF86Back' || e.key === 'BrowserBack') {
        onBack();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [idx, games, onBack, onPlayGame]);

  return (
    <div className="tv-cat-page" style={{ '--cat-color': cat.color, background: CAT_BG[categoryId] || CAT_BG.all }}>
      <div className="tv-cat-topbar">
        <button className="tv-back-btn" onClick={onBack}>← Back</button>
        <h1 className="tv-cat-title">{cat.emoji} {cat.label} Games</h1>
        <span className="tv-cat-subtitle">{games.length} games</span>
      </div>

      <div className="tv-cat-grid-wrapper">
        <div className="tv-cat-grid" ref={gridRef}>
          {games.map((game, i) => {
            const focused = idx === i;
            return (
              <div key={game.id}
                className={`tv-game-tile${focused ? ' focused' : ''}`}
                style={{ '--game-color': game.color }}
                onClick={() => { setIdx(i); onPlayGame(game.id); }}>
                <div className="tv-tile-img" style={{ background: game.bg }}>{game.emoji}</div>
                <div className="tv-tile-body">
                  <div className="tv-tile-name">{game.name}</div>
                  <div className="tv-tile-desc">{game.desc}</div>
                </div>
                <div className="tv-tile-play">{focused ? '▶ Play Now' : 'Select'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── PAGE 3: Game Player — double-press Enter or hold Enter to exit ─ */
function GamePage({ gameId, onBack }) {
  const game = GAMES.find(g => g.id === gameId);
  const GameComponent = game?.component;

  const [showBackOverlay, setShowBackOverlay] = useState(false);
  const [overlayBtn,      setOverlayBtn]      = useState(0); // 0=YES 1=NO
  const lastEnterRef = useRef(0);
  const holdTimerRef = useRef(null);

  useEffect(() => {
    const kd = (e) => {
      // TV remote Back keys
      if (e.key === 'GoBack' || e.key === 'XF86Back' || e.key === 'BrowserBack') {
        setShowBackOverlay(true);
        setOverlayBtn(0);
        e.preventDefault();
        return;
      }

      if (showBackOverlay) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          setOverlayBtn(b => b === 0 ? 1 : 0);
          e.preventDefault();
        }
        if (e.key === 'Enter' || e.key === ' ') {
          if (overlayBtn === 0) onBack();
          else setShowBackOverlay(false);
          e.preventDefault();
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          setShowBackOverlay(false);
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'Enter') {
        const now = Date.now();
        if (now - lastEnterRef.current < 600) {
          setShowBackOverlay(true);
          setOverlayBtn(0);
          e.preventDefault();
        }
        lastEnterRef.current = now;
      }
    };

    const kd_hold = (e) => {
      if (e.key === 'Enter' && !showBackOverlay) {
        holdTimerRef.current = setTimeout(() => {
          setShowBackOverlay(true);
          setOverlayBtn(0);
        }, 1500);
      }
    };
    const ku_hold = (e) => {
      if (e.key === 'Enter') clearTimeout(holdTimerRef.current);
    };

    window.addEventListener('keydown', kd);
    window.addEventListener('keydown', kd_hold);
    window.addEventListener('keyup',   ku_hold);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keydown', kd_hold);
      window.removeEventListener('keyup',   ku_hold);
      clearTimeout(holdTimerRef.current);
    };
  }, [onBack, showBackOverlay, overlayBtn]);

  if (!game || !GameComponent) return null;

  return (
    <div className="tv-play-page" style={{ position: 'relative' }}>
      <button 
        className="mobile-exit-btn" 
        onClick={() => {
          setShowBackOverlay(true);
          setOverlayBtn(0);
        }}
        title="Exit Game"
        aria-label="Exit Game"
      >
        ←
      </button>

      <div className="tv-play-frame">
        <React.Suspense fallback={
          <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontSize: '1.5rem', fontFamily: "'Fredoka One', cursive" }}>
            Loading Game...
          </div>
        }>
          <GameComponent />
        </React.Suspense>
      </div>

      {showBackOverlay && (
        <div className="tv-back-overlay">
          <div className="tv-back-dialog">
            <div className="tv-back-dialog-title">⏸ Exit Game?</div>
            <div className="tv-back-dialog-sub">Your progress will be lost</div>
            <div className="tv-back-dialog-btns">
              <div
                className={`tv-back-dialog-btn yes${overlayBtn === 0 ? ' focused' : ''}`}
                onClick={onBack}>
                ✓ Yes, Exit
              </div>
              <div
                className={`tv-back-dialog-btn no${overlayBtn === 1 ? ' focused' : ''}`}
                onClick={() => setShowBackOverlay(false)}>
                ✕ Keep Playing
              </div>
            </div>
            <div className="tv-back-dialog-hint">◄ ► to choose &nbsp;·&nbsp; OK to confirm</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Root ─────────────────────────────────────────────────────────── */
export default function App() {
  const [page,          setPage]        = useState('home');
  const [currentCat,    setCurrentCat]  = useState('all');
  const [highlightId,   setHighlightId] = useState(null);
  const [currentGame,   setCurrentGame] = useState(null);

  // Use URL Hash (#) to force the browser to respect the back button
  useEffect(() => {
    const syncStateWithHash = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (!hash || hash === 'home') {
        setPage('home');
      } else if (hash.startsWith('category/')) {
        const parts = hash.split('/').map(decodeURIComponent);
        setPage('category');
        setCurrentCat(parts[1] || 'all');
      } else if (hash.startsWith('game/')) {
        const parts = hash.split('/').map(decodeURIComponent);
        setPage('game');
        setCurrentGame(parts[1]);
        if (parts[2]) setCurrentCat(parts[2]); // Remember the category we came from
      }
    };

    // 1. If there's no hash on first load, set it to #home silently
    if (!window.location.hash) {
      window.history.replaceState(null, null, '#home');
    }
    
    // 2. Read the initial hash
    syncStateWithHash();

    // 3. Listen for ALL back/forward button presses in the browser or TV remote
    window.addEventListener('hashchange', syncStateWithHash);
    return () => window.removeEventListener('hashchange', syncStateWithHash);
  }, []);

  const goCat = (catId, gameId = null) => {
    setHighlightId(gameId);
    // This actively changes the URL to /#category/...
    window.location.hash = `category/${catId}`;
  };

  const goGame = (gameId) => {
    setHighlightId(gameId); // Remember this game for when we go back
    // This actively changes the URL to /#game/...
    window.location.hash = `game/${gameId}/${currentCat}`;
  };

  const handleBackNavigation = () => {
    // Calling this triggers the browser's physical back behavior, 
    // which automatically updates our hash and triggers 'hashchange'!
    window.history.back();
  };

  return (
    <>
      {page === 'home'     && <HomePage     onSelectCategory={goCat} />}
      {page === 'category' && <CategoryPage categoryId={currentCat} highlightId={highlightId} onBack={handleBackNavigation} onPlayGame={goGame} />}
      {page === 'game'     && <GamePage     gameId={currentGame} onBack={handleBackNavigation} />}
    </>
  );
}