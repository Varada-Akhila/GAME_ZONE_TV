import React, { useState, useEffect } from 'react';

// --- EXACT MATH ENGINE ---
const EXACT_VALUES = {
  0:   { sin: "0",    cos: "1",    tan: "0",    csc: "Undefined", sec: "1",    cot: "Undefined" },
  30:  { sin: "1/2",  cos: "√3/2", tan: "1/√3", csc: "2",         sec: "2/√3", cot: "√3" },
  45:  { sin: "1/√2", cos: "1/√2", tan: "1",    csc: "√2",        sec: "√2",   cot: "1" },
  60:  { sin: "√3/2", cos: "1/2",  tan: "√3",   csc: "2/√3",      sec: "2",    cot: "1/√3" },
  90:  { sin: "1",    cos: "0",    tan: "Undefined", csc: "1",    sec: "Undefined", cot: "0" },
  120: { sin: "√3/2", cos: "-1/2", tan: "-√3",  csc: "2/√3",      sec: "-2",   cot: "-1/√3" },
  135: { sin: "1/√2", cos: "-1/√2",tan: "-1",   csc: "√2",        sec: "-√2",  cot: "-1" },
  150: { sin: "1/2",  cos: "-√3/2",tan: "-1/√3",csc: "2",         sec: "-2/√3",cot: "-√3" },
  180: { sin: "0",    cos: "-1",   tan: "0",    csc: "Undefined", sec: "-1",   cot: "Undefined" },
  210: { sin: "-1/2", cos: "-√3/2",tan: "1/√3", csc: "-2",        sec: "-2/√3",cot: "√3" },
  225: { sin: "-1/√2",cos: "-1/√2",tan: "1",    csc: "-√2",       sec: "-√2",  cot: "1" },
  240: { sin: "-√3/2",cos: "-1/2", tan: "√3",   csc: "-2/√3",     sec: "-2",   cot: "1/√3" },
  270: { sin: "-1",   cos: "0",    tan: "Undefined", csc: "-1",   sec: "Undefined", cot: "0" },
  300: { sin: "-√3/2",cos: "1/2",  tan: "-√3",  csc: "-2/√3",     sec: "2",    cot: "-1/√3" },
  315: { sin: "-1/√2",cos: "1/√2", tan: "-1",   csc: "-√2",       sec: "√2",   cot: "-1" },
  330: { sin: "-1/2", cos: "√3/2", tan: "-1/√3",csc: "-2",        sec: "2/√3", cot: "-√3" },
  360: { sin: "0",    cos: "1",    tan: "0",    csc: "Undefined", sec: "1",    cot: "Undefined" }
};

const STANDARD_ANGLES = Object.keys(EXACT_VALUES).map(Number).sort((a, b) => a - b);
const ALL_POSSIBLE_ANSWERS = ["0", "1/2", "1/√2", "√3/2", "1", "1/√3", "√3", "2/√3", "√2", "2", "Undefined", "-1/2", "-1/√2", "-√3/2", "-1", "-1/√3", "-√3", "-2/√3", "-√2", "-2"];

function generateDynamicQuestions(numQuestions = 5) {
  const testAngles = [0, 30, 45, 60, 90, 120, 135, 180, 270];
  const functions = [
    { key: "sin", label: "Sine (sin)" },
    { key: "cos", label: "Cosine (cos)" },
    { key: "tan", label: "Tangent (tan)" },
    { key: "csc", label: "Cosecant (csc)" },
    { key: "sec", label: "Secant (sec)" },
    { key: "cot", label: "Cotangent (cot)" }
  ];

  let questions = [];
  for (let i = 0; i < numQuestions; i++) {
    const randomAngle = testAngles[Math.floor(Math.random() * testAngles.length)];
    const randomFunc = functions[Math.floor(Math.random() * functions.length)];
    const correctAnswer = EXACT_VALUES[randomAngle][randomFunc.key];

    let wrongAnswers = ALL_POSSIBLE_ANSWERS.filter(ans => ans !== correctAnswer);
    wrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 3);
    let options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

    questions.push({
      question: `What is the ${randomFunc.label} of ${randomAngle}°?`,
      options: options,
      answer: correctAnswer
    });
  }
  return questions;
}

// --- TV NAVIGATION MAP ---
const NAV_MAP = {
  'tab-learn': { right: 'tab-table', down: 'slider' },
  'tab-table': { left: 'tab-learn', right: 'tab-play', down: null },
  'tab-play': { left: 'tab-table', down: 'opt-0' },
  'slider': { up: 'tab-learn' },
  'opt-0': { up: 'tab-play', right: 'opt-1', down: 'opt-2' },
  'opt-1': { up: 'tab-play', left: 'opt-0', down: 'opt-3' },
  'opt-2': { up: 'opt-0', right: 'opt-3' },
  'opt-3': { up: 'opt-1', left: 'opt-2' },
  'restart': { up: 'tab-play' }
};

export default function TrigQuestTV() {
  const [activeTab, setActiveTab] = useState('play'); 
  const [focusedId, setFocusedId] = useState('tab-play');
  
  const [angleIndex, setAngleIndex] = useState(2); 
  const angle = STANDARD_ANGLES[angleIndex];

  const [quizQuestions, setQuizQuestions] = useState(() => generateDynamicQuestions(5));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null); 

  // --- HARDWARE KEYBOARD / REMOTE LOGIC ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'Enter') {
        handleEnterPress(focusedId);
        return;
      }

      if (focusedId === 'slider') {
        if (e.key === 'ArrowLeft') setAngleIndex(prev => Math.max(0, prev - 1));
        if (e.key === 'ArrowRight') setAngleIndex(prev => Math.min(STANDARD_ANGLES.length - 1, prev + 1));
        if (e.key === 'ArrowUp') setFocusedId('tab-learn');
        return;
      }

      let direction;
      if (e.key === 'ArrowUp') direction = 'up';
      if (e.key === 'ArrowDown') direction = 'down';
      if (e.key === 'ArrowLeft') direction = 'left';
      if (e.key === 'ArrowRight') direction = 'right';

      if (direction && NAV_MAP[focusedId] && NAV_MAP[focusedId][direction]) {
        setFocusedId(NAV_MAP[focusedId][direction]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedId, activeTab, currentQuestion, quizQuestions, angleIndex]);

  // Unified execution for both Remote 'Enter' and Touch 'Clicks'
  const handleEnterPress = (id) => {
    if (id === 'tab-learn') { setActiveTab('learn'); setFocusedId('tab-learn'); }
    if (id === 'tab-table') { setActiveTab('table'); setFocusedId('tab-table'); }
    if (id === 'tab-play') { setActiveTab('play'); setFocusedId('tab-play'); }
    
    if (id.startsWith('opt-') && feedback === null) {
      const index = parseInt(id.split('-')[1]);
      handleAnswerSubmit(quizQuestions[currentQuestion].options[index]);
    }
    if (id === 'restart') restartGame();
  };

  const handleAnswerSubmit = (selectedAnswer) => {
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].answer;
    
    setSelectedOption(selectedAnswer); 
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizQuestions.length) {
        setCurrentQuestion(nextQuestion);
        setFocusedId('opt-0'); 
      } else {
        setShowScore(true);
        setFocusedId('restart'); 
      }
    }, 2000); 
  };

  const restartGame = () => {
    setQuizQuestions(generateDynamicQuestions(5));
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setFeedback(null);
    setSelectedOption(null);
    setFocusedId('tab-play');
  };

  // --- TOUCH HANDLERS ---
  const handleTouchAnswer = (id, option) => {
    if (feedback !== null) return; // Prevent double clicking
    setFocusedId(id); // Sync the yellow TV ring
    handleAnswerSubmit(option);
  };

  const handlePrevAngleTouch = (e) => {
    e.stopPropagation();
    setFocusedId('slider');
    setAngleIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextAngleTouch = (e) => {
    e.stopPropagation();
    setFocusedId('slider');
    setAngleIndex(prev => Math.min(STANDARD_ANGLES.length - 1, prev + 1));
  };

  const getStyle = (baseStyle, id) => ({
    ...baseStyle,
    ...(focusedId === id ? styles.tvFocus : {})
  });

  return (
    <div style={styles.tvScreen}>
      <div style={styles.appContainer}>
        
        <div style={styles.tabContainer}>
          <div 
            onClick={() => handleEnterPress('tab-learn')} 
            style={getStyle(activeTab === 'learn' ? styles.activeTab : styles.tab, 'tab-learn')}
          >
            1. Circle
          </div>
          <div 
            onClick={() => handleEnterPress('tab-table')}
            style={getStyle(activeTab === 'table' ? styles.activeTab : styles.tab, 'tab-table')}
          >
            2. Value Table
          </div>
          <div 
            onClick={() => handleEnterPress('tab-play')}
            style={getStyle(activeTab === 'play' ? styles.activeTab : styles.tab, 'tab-play')}
          >
            3. TV Quiz
          </div>
        </div>

        <div style={styles.contentArea}>
          {activeTab === 'learn' && (
            <LearnMode 
              angle={angle} 
              focusedId={focusedId} 
              getStyle={getStyle} 
              onPrevAngle={handlePrevAngleTouch}
              onNextAngle={handleNextAngleTouch}
              onSvgClick={() => setFocusedId('slider')}
            />
          )}
          {activeTab === 'table' && <TableMode />}
          {activeTab === 'play' && (
            <PlayMode 
              questions={quizQuestions}
              currentQuestion={currentQuestion} 
              score={score} 
              showScore={showScore} 
              feedback={feedback}
              selectedOption={selectedOption}
              getStyle={getStyle}
              onAnswerClick={handleTouchAnswer}
              onRestartClick={() => { setFocusedId('restart'); restartGame(); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// --- LEARN MODE ---
function LearnMode({ angle, focusedId, getStyle, onPrevAngle, onNextAngle, onSvgClick }) {
  const radians = angle * (Math.PI / 180);
  
  const center = 200;
  const radius = 140; 
  const coords = {
    x: center + radius * Math.cos(radians),
    y: center - radius * Math.sin(radians)
  };

  const exactStats = EXACT_VALUES[angle];

  const cosTextX = center + (coords.x - center) / 2;
  const cosTextY = center + (angle > 180 ? -15 : 25); 
  
  const sinTextX = coords.x + (angle > 90 && angle < 270 ? -15 : 15); 
  const sinTextY = center + (coords.y - center) / 2;

  return (
    <div style={styles.learnLayout}>
      <div 
        style={getStyle(styles.flexibleSvgWrapper, 'slider')}
        onClick={onSvgClick}
      >
        {/* NEW TOUCH ARROWS */}
        <div style={styles.angleControlWrapper}>
          <div onClick={onPrevAngle} style={styles.touchArrow}>◀</div>
          <div style={styles.angleIndicator}>Angle: {angle}°</div>
          <div onClick={onNextAngle} style={styles.touchArrow}>▶</div>
        </div>
        
        <svg viewBox="0 0 400 400" style={styles.svg}>
          <text x="360" y="205" fill="#94a3b8" fontSize="16" fontWeight="bold">0°</text>
          <text x="190" y="25" fill="#94a3b8" fontSize="16" fontWeight="bold">90°</text>
          <text x="10" y="205" fill="#94a3b8" fontSize="16" fontWeight="bold">180°</text>
          <text x="185" y="385" fill="#94a3b8" fontSize="16" fontWeight="bold">270°</text>

          <line x1="40" y1={center} x2="360" y2={center} stroke="#475569" strokeWidth="2" />
          <line x1={center} y1="40" x2={center} y2="360" stroke="#475569" strokeWidth="2" />
          
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#94a3b8" strokeWidth="3" />
          
          <polygon points={`${center},${center} ${coords.x},${center} ${coords.x},${coords.y}`} fill="rgba(59, 130, 246, 0.3)" />
          
          <line x1={center} y1={center} x2={coords.x} y2={coords.y} stroke="#60a5fa" strokeWidth="4" />
          <line x1={coords.x} y1={center} x2={coords.x} y2={coords.y} stroke="#f87171" strokeWidth="5" /> 
          <line x1={center} y1={center} x2={coords.x} y2={center} stroke="#4ade80" strokeWidth="5" /> 
          <circle cx={coords.x} cy={coords.y} r="8" fill="#ffffff" />

          <text x={cosTextX} y={cosTextY} fill="#4ade80" fontSize="20" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
            {exactStats.cos}
          </text>
          <text x={sinTextX} y={sinTextY} fill="#f87171" fontSize="20" fontWeight="bold" textAnchor={angle > 90 && angle < 270 ? "end" : "start"} dominantBaseline="middle">
            {exactStats.sin}
          </text>
        </svg>
      </div>

      <div style={styles.sidePanel}>
        <div style={{...styles.statBox, borderColor: '#f87171'}}>
          <div style={styles.statLabel}>Sine (sin)</div>
          <div style={styles.statValue}>{exactStats.sin}</div>
        </div>
        <div style={{...styles.statBox, borderColor: '#4ade80'}}>
          <div style={styles.statLabel}>Cosine (cos)</div>
          <div style={styles.statValue}>{exactStats.cos}</div>
        </div>
        <div style={{...styles.statBox, borderColor: '#fbbf24'}}>
          <div style={styles.statLabel}>Tangent (tan)</div>
          <div style={styles.statValue}>{exactStats.tan}</div>
        </div>
        <div style={{...styles.statBox, borderColor: '#c084fc'}}>
          <div style={styles.statLabel}>Cosecant (csc)</div>
          <div style={styles.statValue}>{exactStats.csc}</div>
        </div>
        <div style={{...styles.statBox, borderColor: '#38bdf8'}}>
          <div style={styles.statLabel}>Secant (sec)</div>
          <div style={styles.statValue}>{exactStats.sec}</div>
        </div>
        <div style={{...styles.statBox, borderColor: '#f472b6'}}>
          <div style={styles.statLabel}>Cotangent (cot)</div>
          <div style={styles.statValue}>{exactStats.cot}</div>
        </div>
      </div>
    </div>
  );
}

// --- TABLE MODE ---
function TableMode() {
  const tableData = [
    { ratio: 'sin', cols: ['0', '1/2', '1/√2', '√3/2', '1'] },
    { ratio: 'cos', cols: ['1', '√3/2', '1/√2', '1/2', '0'] },
    { ratio: 'tan', cols: ['0', '1/√3', '1', '√3', 'undefined'] },
    { ratio: 'csc', cols: ['undefined', '2', '√2', '2/√3', '1'] },
    { ratio: 'sec', cols: ['1', '2/√3', '√2', '2', 'undefined'] },
    { ratio: 'cot', cols: ['undefined', '√3', '1', '1/√3', '0'] },
  ];

  return (
    <div style={styles.modeContainer}>
      <h2 style={styles.subtitle}>Trigonometric Ratio Table</h2>
      <div style={styles.brightTableWrapper}>
        <table style={styles.classicTable}>
          <thead>
            <tr>
              <th style={styles.thTopLeft}>
                <div style={{textAlign: 'right'}}>Angle</div>
                <div style={{textAlign: 'left'}}>T. Ratio</div>
              </th>
              <th style={styles.thPink}>0°</th>
              <th style={styles.thPink}>30°</th>
              <th style={styles.thPink}>45°</th>
              <th style={styles.thPink}>60°</th>
              <th style={styles.thPink}>90°</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td style={styles.tdBlue}><strong>{row.ratio}</strong></td>
                {row.cols.map((val, i) => (
                  <td key={i} style={styles.tdGreen}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- PLAY MODE ---
function PlayMode({ questions, currentQuestion, score, showScore, feedback, selectedOption, getStyle, onAnswerClick, onRestartClick }) {
  if (showScore) {
    return (
      <div style={styles.scoreContainer}>
        <h2 style={{...styles.subtitle, fontSize: '2.5rem'}}>Quiz Complete! 🎉</h2>
        <p style={styles.scoreText}>You scored {score} out of {questions.length}</p>
        <div 
          onClick={onRestartClick} 
          style={{...getStyle(styles.primaryButton, 'restart'), cursor: 'pointer'}}
        >
          Press OK to Play Again
        </div>
      </div>
    );
  }

  const activeQ = questions[currentQuestion];

  return (
    <div style={styles.modeContainer}>
      <div style={styles.quizHeader}>
        <span style={styles.questionCount}>Question {currentQuestion + 1}/{questions.length}</span>
        <span style={styles.scoreCount}>Score: {score}</span>
      </div>
      
      <div style={styles.questionPanel}>
        <h3 style={styles.questionText}>{activeQ.question}</h3> 
      </div>

      <div style={styles.optionsGrid}>
        {activeQ.options.map((option, index) => {
          const id = `opt-${index}`;
          const isCorrectAnswer = option === activeQ.answer;
          
          let bgColor = '#334155'; 
          
          if (feedback !== null) {
            if (isCorrectAnswer) {
              bgColor = '#16a34a'; 
            } 
            else if (option === selectedOption) {
              bgColor = '#dc2626'; 
            }
          }

          return (
            <div 
              key={index} 
              onClick={() => onAnswerClick(id, option)}
              style={{...getStyle(styles.optionButton, id), backgroundColor: bgColor, cursor: 'pointer'}}
            >
              {option}
            </div>
          );
        })}
      </div>
      
      {feedback && (
        <div style={{...styles.feedback, color: feedback === 'correct' ? '#4ade80' : '#f87171'}}>
          {feedback === 'correct' ? 'Correct! ✅' : `Incorrect ❌ The correct answer is ${activeQ.answer}`}
        </div>
      )}
    </div>
  );
}

// --- STRICT TV UI STYLES ---
const styles = {
  tvScreen: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#0f172a', 
    color: '#f8fafc',
    height: '100vh', 
    width: '100vw',
    overflow: 'hidden', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    boxSizing: 'border-box'
  },
  appContainer: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
    width: '100%',
    maxWidth: '1200px', 
    height: '95vh', 
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  tvFocus: {
    outline: '5px solid #fbbf24', 
    outlineOffset: '2px',
    transform: 'scale(1.02)',
    zIndex: 10,
    backgroundColor: '#3b82f6', 
    color: 'white'
  },
  tabContainer: { 
    display: 'flex', borderBottom: '2px solid #334155', backgroundColor: '#1e293b', padding: '0.75rem' 
  },
  tab: {
    flex: 1, padding: '1rem', margin: '0 0.5rem', borderRadius: '8px',
    textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold',
    color: '#94a3b8', backgroundColor: '#334155', transition: 'all 0.2s',
    cursor: 'pointer' // Shows hand icon for mouse users
  },
  activeTab: {
    flex: 1, padding: '1rem', margin: '0 0.5rem', borderRadius: '8px',
    textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold',
    color: '#ffffff', backgroundColor: '#3b82f6', transition: 'all 0.2s',
    cursor: 'pointer'
  },
  contentArea: { 
    padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' 
  },
  modeContainer: { 
    display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%',
    justifyContent: 'center' 
  },
  
  // --- LAYOUT 1: CIRCLE ---
  learnLayout: { display: 'flex', flexDirection: 'row', width: '100%', height: '100%', gap: '2rem', alignItems: 'center', justifyContent: 'center' },
  flexibleSvgWrapper: { flex: 1, backgroundColor: '#0f172a', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', height: '100%' },
  svg: { width: '100%', maxWidth: '450px', maxHeight: '450px', height: 'auto' },
  
  // New Touch Arrow Controls
  angleControlWrapper: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' },
  touchArrow: { 
    fontSize: '1.5rem', color: '#f8fafc', backgroundColor: '#3b82f6', width: '45px', height: '45px', 
    display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', cursor: 'pointer', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)', userSelect: 'none' // Prevents text selection on rapid tapping
  },
  angleIndicator: { fontSize: '1.8rem', fontWeight: 'bold', color: '#f8fafc', backgroundColor: '#334155', padding: '0.5rem 2rem', borderRadius: '999px', userSelect: 'none' },
  
  sidePanel: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)', gap: '1rem', width: '40%', height: '100%' },
  statLabel: { fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '0.25rem', fontWeight: 'bold' },
  statBox: { padding: '1rem', borderRadius: '12px', borderBottom: '5px solid', backgroundColor: '#334155', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  statValue: { fontSize: '1.8rem', fontWeight: 'bold', color: '#ffffff' },
  
  // --- LAYOUT 2: TABLE ---
  subtitle: { fontSize: '2rem', color: '#f8fafc', marginBottom: '1rem' },
  brightTableWrapper: { backgroundColor: 'white', padding: '1rem', borderRadius: '12px', width: '100%', maxWidth: '900px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
  classicTable: { width: '100%', borderCollapse: 'collapse', fontSize: '1.4rem', color: 'black', border: '3px solid black' },
  thTopLeft: { backgroundColor: '#e6e6fa', border: '2px solid black', padding: '0.5rem', fontSize: '1.2rem' },
  thPink: { backgroundColor: '#ffb6c1', border: '2px solid black', padding: '0.75rem', textAlign: 'center', fontSize: '1.5rem' },
  tdBlue: { backgroundColor: '#add8e6', border: '2px solid black', padding: '0.75rem', textAlign: 'center', fontSize: '1.5rem' },
  tdGreen: { backgroundColor: '#9acd32', border: '2px solid black', padding: '0.75rem', textAlign: 'center', fontWeight: '500' },

  // --- LAYOUT 3: QUIZ ---
  quizHeader: { display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '800px', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: '#94a3b8' },
  questionPanel: { backgroundColor: '#3b82f6', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '800px', textAlign: 'center', marginBottom: '2rem' },
  questionText: { color: '#ffffff', margin: 0, fontSize: '2.2rem', lineHeight: '1.4', userSelect: 'none' },
  optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%', maxWidth: '800px' },
  optionButton: { padding: '1.5rem', fontSize: '1.8rem', fontWeight: 'bold', borderRadius: '12px', textAlign: 'center', color: '#ffffff', transition: 'all 0.2s', userSelect: 'none' },
  
  feedback: { marginTop: '1.5rem', fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' }, 
  
  scoreContainer: { textAlign: 'center', padding: '2rem 0' },
  scoreText: { fontSize: '2rem', margin: '1.5rem 0', color: '#cbd5e1' },
  primaryButton: { display: 'inline-block', padding: '1.5rem 3rem', fontSize: '1.8rem', fontWeight: 'bold', color: 'white', backgroundColor: '#3b82f6', borderRadius: '12px', transition: 'all 0.2s' }
};