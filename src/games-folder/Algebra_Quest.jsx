import React, { useState, useEffect, useCallback, useRef } from "react";

// ── Palette & Tokens ─────────────────────────────────────────────────────────
const C = {
  bg: "#0F0E17",
  surface: "#1A1927",
  surfaceLight: "#252436",
  accent: "#F4A261",
  accentSoft: "#F4A26122",
  green: "#2EC4B6",
  greenSoft: "#2EC4B622",
  red: "#E84855",
  redSoft: "#E8485522",
  purple: "#9B72CF",
  purpleSoft: "#9B72CF22",
  text: "#FFFAED",
  textMuted: "#8B89A0",
  border: "#2E2C42",
  gold: "#FFD166",
  focus: "#FFD166",
};

// ── Dynamic Equation Generators ───────────────────────────────────────────────
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateOneStep = () => {
  const x = rand(2, 12);
  const A = rand(2, 15);
  const type = rand(0, 2); 

  if (type === 0) {
    return {
      eq: `x + ${A} = ${x + A}`, answer: x, variable: "x",
      hint: `What do you subtract to cancel the +${A}?`,
      steps: [`Subtract ${A} from both sides`, `x = ${x + A} - ${A}`, `x = ${x}`]
    };
  } else if (type === 1) {
    return {
      eq: `y - ${A} = ${x - A}`, answer: x, variable: "y",
      hint: `What is the inverse of subtraction?`,
      steps: [`Add ${A} to both sides`, `y = ${x - A} + ${A}`, `y = ${x}`]
    };
  } else {
    return {
      eq: `${A}m = ${A * x}`, answer: x, variable: "m",
      hint: `m is multiplied by ${A} — what undoes multiplication?`,
      steps: [`Divide both sides by ${A}`, `m = ${A * x} ÷ ${A}`, `m = ${x}`]
    };
  }
};

const generateTwoStep = () => {
  const x = rand(2, 10);
  const A = rand(2, 6);
  const B = rand(1, 10);
  const C_val = (A * x) + B;
  
  return {
    eq: `${A}x + ${B} = ${C_val}`, answer: x, variable: "x",
    hint: `First remove the +${B}, then handle the ${A}×`,
    steps: [`Subtract ${B}: ${A}x = ${C_val - B}`, `Divide by ${A}: x = ${x}`]
  };
};

const generateVariablesBoth = () => {
  const x = rand(2, 8);
  const A = rand(4, 9);
  const C_coeff = rand(1, A - 1); 
  const B = rand(1, 10);
  const D = (A * x + B) - (C_coeff * x);

  return {
    eq: `${A}y + ${B} = ${C_coeff}y + ${D}`, answer: x, variable: "y",
    hint: `Subtract ${C_coeff}y from both sides first`,
    steps: [
      `Subtract ${C_coeff}y: ${A - C_coeff}y + ${B} = ${D}`,
      `Subtract ${B}: ${A - C_coeff}y = ${D - B}`,
      `Divide by ${A - C_coeff}: y = ${x}`
    ]
  };
};

// ── Lesson Content ────────────────────────────────────────────────────────────
const LESSONS = [
  {
    id: "one-step", title: "One-Step Equations", emoji: "1️⃣", color: C.green, colorSoft: C.greenSoft, generator: generateOneStep,
    tagline: "Add, subtract, multiply or divide — one move to solve",
    concepts: [
      { heading: "What is an Equation?", body: "An equation is like a weighing scale — both sides must always be equal.", needsExample: true },
      { heading: "The Golden Rule", body: "Whatever you do to one side, you MUST do to the other side.", highlight: "Same operation on BOTH sides" },
      { heading: "Inverse Operations", body: "To undo an operation, use its opposite:", table: [["Operation", "Inverse"], ["+ Addition", "− Subtraction"], ["− Subtraction", "+ Addition"], ["× Multiplication", "÷ Division"], ["÷ Division", "× Multiplication"]] }
    ]
  },
  {
    id: "two-step", title: "Two-Step Equations", emoji: "2️⃣", color: C.accent, colorSoft: C.accentSoft, generator: generateTwoStep,
    tagline: "Two operations, two undos — always work backwards",
    concepts: [
      { heading: "Work in Reverse Order", body: "Think of BODMAS in reverse. The last operation applied to x is the first one you undo.", needsExample: true },
      { heading: "Strategy: Isolate the Variable", body: "Move numbers (constants) first by adding or subtracting. Then deal with the coefficient.", highlight: "Constants first → then coefficients" },
      { heading: "Check Your Answer", body: "Always substitute your answer back into the original equation to verify both sides are equal.", needsExample: true }
    ]
  },
  {
    id: "variables-both", title: "Variables on Both Sides", emoji: "⚖️", color: C.purple, colorSoft: C.purpleSoft, generator: generateVariablesBoth,
    tagline: "Collect like terms — group x's on one side",
    concepts: [
      { heading: "Collecting Like Terms", body: "When x appears on both sides, move all x-terms to one side and all numbers to the other.", needsExample: true },
      { heading: "Tip: Move Smaller x", body: "Move the smaller x-coefficient to the other side to avoid negative numbers.", highlight: "Move the smaller x-term across" },
      { heading: "Always Verify", body: "Substitute back into BOTH sides of the original equation to confirm they're equal.", needsExample: true }
    ]
  }
];

// ── Shared TV Styles ──────────────────────────────────────────────────────────
const base = {
  fontFamily: "'Georgia', 'Times New Roman', serif",
  background: C.bg, color: C.text,
  height: "100vh", width: "100vw",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxSizing: "border-box", overflow: "hidden",
};

const tvContainer = {
  width: "85vw", maxWidth: "1200px", height: "85vh",
  display: "flex", flexDirection: "column", position: "relative"
};

// ── Back Button Component ──────────────────────────────────────────────────────
function BackButton({ onClick, isFocused, onMouseEnter }) {
  return (
    <button 
      onClick={onClick} 
      onMouseEnter={onMouseEnter}
      style={{
        position: "absolute", top: 0, left: 0, zIndex: 10,
        background: isFocused ? C.focus : C.surfaceLight, 
        border: `2px solid ${isFocused ? C.focus : C.border}`,
        color: isFocused ? C.bg : C.textMuted, 
        padding: "1vh 2vw", borderRadius: 8,
        fontSize: "2vh", cursor: "pointer", fontWeight: "bold",
        transition: "all 0.2s"
      }}
    >
      ← Back
    </button>
  );
}

// ── TV Table Component ────────────────────────────────────────────────────────
function TVTable({ rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "2.5vh", marginTop: "2vh" }}>
      <thead>
        <tr>
          {rows[0].map((h, i) => (
            <th key={i} style={{ padding: "1.5vh 2vw", textAlign: "left", background: C.surfaceLight, color: C.textMuted, borderBottom: `2px solid ${C.border}` }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.slice(1).map((row, ri) => (
          <tr key={ri} style={{ background: ri % 2 === 0 ? "transparent" : C.surfaceLight + "55" }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ padding: "1.5vh 2vw", color: C.text, borderBottom: `1px solid ${C.border}44` }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Home Screen ───────────────────────────────────────────────────────────────
function HomeScreen({ onSelect, tvEvent }) {
  const [focusIdx, setFocusIdx] = useState(0);
  const lastEventId = useRef(tvEvent ? tvEvent.timestamp : null); 

  useEffect(() => {
    if (!tvEvent || tvEvent.timestamp === lastEventId.current) return;
    lastEventId.current = tvEvent.timestamp;

    const { key } = tvEvent;
    if (key === "ArrowDown") setFocusIdx(i => Math.min(i + 1, LESSONS.length - 1));
    if (key === "ArrowUp") setFocusIdx(i => Math.max(i - 1, 0));
    if (key === "Enter") onSelect(focusIdx);
  }, [tvEvent, focusIdx, onSelect]);

  return (
    <div style={base}>
      <div style={tvContainer}>
        <div style={{ textAlign: "center", marginBottom: "4vh", marginTop: "4vh" }}>
          <div style={{ fontSize: "6vh" }}>⚖️</div>
          <h1 style={{ fontSize: "5vh", margin: "1vh 0", color: C.text }}>Algebra Quest</h1>
          <p style={{ fontSize: "2.5vh", color: C.textMuted }}>Select a topic using remote arrows, press OK to start.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2vh", alignItems: "center" }}>
          {LESSONS.map((lesson, i) => {
            const isFocused = focusIdx === i;
            return (
              <div 
                key={lesson.id} 
                onClick={() => onSelect(i)} 
                onMouseEnter={() => setFocusIdx(i)}
                style={{
                  background: isFocused ? C.surfaceLight : C.surface,
                  border: `3px solid ${isFocused ? C.focus : lesson.color + "44"}`,
                  borderRadius: 20, padding: "2vh 3vw", width: "60%",
                  display: "flex", alignItems: "center", gap: "2vw",
                  transform: isFocused ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.2s", cursor: "pointer" 
              }}>
                <div style={{ fontSize: "5vh", background: lesson.colorSoft, padding: "1.5vh", borderRadius: 16 }}>{lesson.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "3vh", color: lesson.color }}>{lesson.title}</div>
                  <div style={{ fontSize: "2vh", color: C.textMuted }}>{lesson.tagline}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Lesson Screen ─────────────────────────────────────────────────────────────
function LessonScreen({ lesson, onStart, onBack, tvEvent }) {
  const [step, setStep] = useState(0);
  const [focusIdx, setFocusIdx] = useState(1); // 0 = Back, 1 = Next Button
  const isLast = step === lesson.concepts.length - 1;
  const [dynamicExamples, setDynamicExamples] = useState({});
  const lastEventId = useRef(tvEvent ? tvEvent.timestamp : null);

  useEffect(() => {
    const examples = {};
    lesson.concepts.forEach((c, i) => {
      if (c.needsExample) examples[i] = lesson.generator();
    });
    setDynamicExamples(examples);
  }, [lesson]);

  useEffect(() => {
    if (!tvEvent || tvEvent.timestamp === lastEventId.current) return;
    lastEventId.current = tvEvent.timestamp;

    const { key } = tvEvent;
    if (key === "Escape") onBack();
    if (key === "ArrowUp") setFocusIdx(0);
    if (key === "ArrowDown") setFocusIdx(1);
    if (key === "ArrowLeft") {
      if (step > 0) setStep(s => s - 1);
    }
    if (key === "ArrowRight") {
      setFocusIdx(1); 
      isLast ? onStart() : setStep(s => s + 1);
    }
    if (key === "Enter") {
      if (focusIdx === 0) onBack();
      else { isLast ? onStart() : setStep(s => s + 1); }
    }
  }, [tvEvent, isLast, step, focusIdx, onStart, onBack]);

  const concept = lesson.concepts[step];
  const example = dynamicExamples[step]; 

  return (
    <div style={base}>
      <div style={tvContainer}>
        <BackButton 
          onClick={onBack} 
          isFocused={focusIdx === 0} 
          onMouseEnter={() => setFocusIdx(0)} 
        />
        
        <div style={{ display: "flex", alignItems: "center", gap: "2vw", marginBottom: "3vh", marginTop: "6vh" }}>
          <div style={{ fontSize: "6vh" }}>{lesson.emoji}</div>
          <div>
            <h2 style={{ fontSize: "4vh", margin: 0, color: lesson.color }}>{lesson.title}</h2>
            <p style={{ fontSize: "2vh", color: C.textMuted, margin: 0 }}>Use Left/Right arrows to navigate</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1vw", marginBottom: "3vh" }}>
          {lesson.concepts.map((_, i) => (
            <div key={i} style={{ flex: 1, height: "1vh", borderRadius: "0.5vh", background: i <= step ? lesson.color : C.border, transition: "background 0.3s" }} />
          ))}
        </div>

        <div style={{ background: C.surface, border: `2px solid ${lesson.color}55`, borderRadius: 24, padding: "4vh 4vw", flex: 1, overflowY: "auto" }}>
          <h3 style={{ fontSize: "4vh", color: lesson.color, margin: "0 0 2vh" }}>{concept.heading}</h3>
          <p style={{ fontSize: "3vh", color: C.textMuted, lineHeight: 1.6, margin: 0 }}>{concept.body}</p>
          
          {example && (
            <div style={{ background: C.surfaceLight, borderRadius: 16, padding: "3vh", marginTop: "3vh", border: `1px solid ${C.border}` }}>
              <p style={{ margin: "0 0 1vh", fontSize: "2vh", color: C.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Example</p>
              <p style={{ margin: "0 0 2vh", fontSize: "4.5vh", fontWeight: 700, color: C.gold, fontFamily: "monospace" }}>{example.eq}</p>
              {example.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1vw", marginBottom: "1vh" }}>
                  <span style={{ color: lesson.color, fontSize: "3vh", fontFamily: "monospace" }}>→</span>
                  <span style={{ fontSize: "2.5vh", color: C.text, fontFamily: "monospace" }}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {concept.highlight && (
            <div style={{ background: lesson.colorSoft, borderRadius: 16, padding: "3vh", textAlign: "center", marginTop: "4vh", border: `2px solid ${lesson.color}` }}>
              <span style={{ fontSize: "3.5vh", fontWeight: 700, color: lesson.color }}>{concept.highlight}</span>
            </div>
          )}

          {concept.table && <TVTable rows={concept.table} />}
        </div>

        <div style={{ textAlign: "center", marginTop: "3vh" }}>
          <span 
            onClick={() => isLast ? onStart() : setStep(s => s + 1)}
            onMouseEnter={() => setFocusIdx(1)}
            style={{ 
              display: "inline-block",
              fontSize: "2.5vh", 
              background: focusIdx === 1 ? C.focus : C.surfaceLight, 
              color: focusIdx === 1 ? C.bg : C.text, 
              padding: "1vh 2vw", 
              borderRadius: 12, 
              fontWeight: 'bold', 
              cursor: "pointer",
              border: `2px solid ${focusIdx === 1 ? C.focus : C.border}`,
              transition: "all 0.2s"
            }}>
            {isLast ? "Press OK to Start Quiz" : "Press OK / Right to Continue"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Quiz Screen ───────────────────────────────────────────────────────────────
function QuizScreen({ lesson, onFinish, onBack, tvEvent }) {
  const [qIdx, setQIdx] = useState(0);
  const [q, setQ] = useState(() => lesson.generator());
  const [currentVal, setCurrentVal] = useState("");
  const [status, setStatus] = useState(null); 
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  
  // Focus Index Mapping for Numpad:
  // 0: Back Button
  // 1-9: Numbers 1 through 9
  // 10: Clear ('C'), 11: '0', 12: Delete ('⌫')
  // 13: Submit Button
  // 14: Continue Button (Only active when status !== null)
  const [focusIdx, setFocusIdx] = useState(5); // Start focus on number '5'
  const lastEventId = useRef(tvEvent ? tvEvent.timestamp : null);

  const appendNum = useCallback((num) => {
    setCurrentVal(prev => {
      if (prev === "0") return String(num); // prevent multiple leading zeros
      if (prev.length > 5) return prev;     // limit length
      return prev + num;
    });
  }, []);

  const handleCheck = useCallback(() => {
    if (currentVal === "") return;
    const numericVal = parseInt(currentVal, 10);
    const isCorrect = numericVal === q.answer;
    
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(s => s + 10);
    setResults(r => [...r, { eq: q.eq, answer: q.answer, given: numericVal, correct: isCorrect }]);
    setFocusIdx(14); // Jump focus automatically to the "Continue" button
  }, [currentVal, q]);

  const nextQuestion = useCallback(() => {
    if (qIdx + 1 >= 5) { 
      onFinish({ score, results, total: 5 });
    } else {
      setQIdx(i => i + 1);
      setQ(lesson.generator());
      setCurrentVal("");
      setStatus(null);
      setFocusIdx(5); // Return focus to the center of the numpad ('5')
    }
  }, [qIdx, lesson, onFinish, score, results]);

  useEffect(() => {
    if (!tvEvent || tvEvent.timestamp === lastEventId.current) return;
    lastEventId.current = tvEvent.timestamp;
    
    const { key } = tvEvent;

    if (key === "Escape") {
      onBack();
      return;
    }

    // --- State: Answer has been submitted ---
    if (status) {
      if (key === "ArrowUp") setFocusIdx(0); // Jump to Back
      else if (key === "ArrowDown") setFocusIdx(14); // Jump to Continue
      else if (key === "Enter") {
        if (focusIdx === 0) onBack();
        else if (focusIdx === 14) nextQuestion();
      }
      return;
    }

    // --- State: Typing Answer on Numpad ---
    if (key === "Enter") {
      if (focusIdx === 0) onBack();
      else if (focusIdx >= 1 && focusIdx <= 9) appendNum(focusIdx);
      else if (focusIdx === 10) setCurrentVal(""); // C
      else if (focusIdx === 11) appendNum(0);      // 0
      else if (focusIdx === 12) setCurrentVal(prev => prev.slice(0, -1)); // ⌫
      else if (focusIdx === 13) handleCheck();     // Submit
      return;
    }

    // Numpad 2D Grid Movement
    if (key === "ArrowUp") {
      if (focusIdx === 13) setFocusIdx(11); // Submit -> 0
      else if (focusIdx >= 1 && focusIdx <= 3) setFocusIdx(0); // Top row -> Back
      else if (focusIdx >= 4 && focusIdx <= 12) setFocusIdx(focusIdx - 3); // Move up a row
    } 
    else if (key === "ArrowDown") {
      if (focusIdx === 0) setFocusIdx(2); // Back -> 2
      else if (focusIdx >= 10 && focusIdx <= 12) setFocusIdx(13); // Bottom row -> Submit
      else if (focusIdx >= 1 && focusIdx <= 9) setFocusIdx(focusIdx + 3); // Move down a row
    } 
    else if (key === "ArrowLeft") {
      // Don't wrap around left edge
      if (focusIdx >= 1 && focusIdx <= 12 && (focusIdx - 1) % 3 !== 0) {
        setFocusIdx(focusIdx - 1);
      }
    } 
    else if (key === "ArrowRight") {
      // Don't wrap around right edge
      if (focusIdx >= 1 && focusIdx <= 12 && focusIdx % 3 !== 0) {
        setFocusIdx(focusIdx + 1);
      }
    }
  }, [tvEvent, status, focusIdx, onBack, appendNum, handleCheck, nextQuestion]);

  return (
    <div style={base}>
      <div style={tvContainer}>
        <BackButton 
          onClick={onBack} 
          isFocused={focusIdx === 0} 
          onMouseEnter={() => setFocusIdx(0)} 
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1vh", marginTop: "6vh" }}>
          <span style={{ fontSize: "3vh", color: lesson.color, fontWeight: 700 }}>Question {qIdx + 1} of 5</span>
          <span style={{ fontSize: "3vh", color: C.gold, fontWeight: 700 }}>Score: {score}</span>
        </div>

        <div style={{ background: C.surface, border: `2px solid ${lesson.color}44`, borderRadius: 24, padding: "2vh 5vw", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflowY: "auto" }}>
          <p style={{ fontSize: "2vh", color: C.textMuted, margin: "0 0 1vh" }}>Solve for {q.variable}</p>
          <p style={{ fontSize: "5vh", fontWeight: 700, color: C.text, margin: "0 0 2vh", fontFamily: "monospace" }}>{q.eq}</p>

          <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
            <span style={{ fontSize: "4vh", color: lesson.color, fontFamily: "monospace" }}>{q.variable} = </span>
            
            {/* Visual Box Replaces the native <input> */}
            <div
              style={{ 
                background: C.surfaceLight, 
                border: `3px solid ${status ? (status === "correct" ? C.green : C.red) : C.border}`, 
                borderRadius: 16, 
                padding: "1.5vh 2vw", 
                width: "15vw",
                height: "5vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4.5vh", 
                fontWeight: 700, 
                color: currentVal ? C.text : C.textMuted,
                fontFamily: "monospace",
                transition: "all 0.2s"
              }}
            >
              {currentVal || "?"}
            </div>
          </div>

          {/* D-Pad Number Keyboard */}
          {!status && (
            <div style={{ marginTop: "3vh", display: "flex", flexDirection: "column", gap: "1vh", width: "100%", maxWidth: "300px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1vh" }}>
                {[
                  { id: 1, val: "1" }, { id: 2, val: "2" }, { id: 3, val: "3" },
                  { id: 4, val: "4" }, { id: 5, val: "5" }, { id: 6, val: "6" },
                  { id: 7, val: "7" }, { id: 8, val: "8" }, { id: 9, val: "9" },
                  { id: 10, val: "C", color: C.red }, 
                  { id: 11, val: "0" }, 
                  { id: 12, val: "⌫", color: C.accent }
                ].map(k => (
                  <button
                    key={k.id}
                    onClick={() => {
                      if (k.id <= 9) appendNum(k.id);
                      else if (k.id === 10) setCurrentVal("");
                      else if (k.id === 11) appendNum(0);
                      else if (k.id === 12) setCurrentVal(prev => prev.slice(0, -1));
                      setFocusIdx(k.id);
                    }}
                    onMouseEnter={() => setFocusIdx(k.id)}
                    style={{
                      padding: "1.5vh 0",
                      fontSize: "3vh",
                      fontWeight: "bold",
                      fontFamily: "monospace",
                      borderRadius: 8,
                      border: `2px solid ${focusIdx === k.id ? C.focus : C.border}`,
                      background: focusIdx === k.id ? C.focus : C.surfaceLight,
                      color: focusIdx === k.id ? C.bg : (k.color || C.text),
                      cursor: "pointer",
                      transition: "all 0.1s"
                    }}
                  >
                    {k.val}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => { setFocusIdx(13); handleCheck(); }}
                onMouseEnter={() => setFocusIdx(13)}
                style={{ 
                  width: "100%",
                  marginTop: "1vh", 
                  fontSize: "3vh", 
                  background: focusIdx === 13 ? C.focus : lesson.color, 
                  color: focusIdx === 13 ? C.bg : C.bg, 
                  border: `2px solid ${focusIdx === 13 ? C.focus : "transparent"}`, 
                  padding: "1.5vh 0", 
                  borderRadius: 8, 
                  fontWeight: 'bold', 
                  cursor: "pointer",
                  transition: "all 0.1s"
                }}>
                Submit Answer
              </button>
            </div>
          )}

          {/* Correct/Incorrect Explanation Box */}
          {status && (
            <div style={{ marginTop: "3vh", background: status === "correct" ? C.greenSoft : C.redSoft, padding: "2vh 3vw", borderRadius: 12, border: `2px solid ${status === "correct" ? C.green : C.red}`, width: "100%", maxWidth: "600px" }}>
              <p style={{ fontSize: "3vh", fontWeight: "bold", margin: "0 0 1vh", color: status === "correct" ? C.green : C.red, fontFamily: "monospace" }}>
                {status === "correct" ? "✓ Correct!" : "✗ Incorrect!"}
              </p>
              
              {status === "wrong" && (
                <p style={{ fontSize: "2.5vh", fontWeight: "bold", color: C.text, margin: "0 0 1vh", fontFamily: "monospace" }}>
                  The correct answer is {q.variable} = {q.answer}
                </p>
              )}

              {status === "wrong" && (
                 <div style={{ fontSize: "2.2vh", color: C.textMuted, fontFamily: "monospace", lineHeight: 1.5 }}>
                   Steps: {q.steps.join(" → ")}
                 </div>
              )}
            </div>
          )}

          {status && (
            <button 
              onClick={() => { setFocusIdx(14); nextQuestion(); }} 
              onMouseEnter={() => setFocusIdx(14)}
              style={{ 
                marginTop: "3vh", 
                fontSize: "2.5vh", 
                background: focusIdx === 14 ? C.focus : C.surfaceLight, 
                color: focusIdx === 14 ? C.bg : C.text, 
                border: `2px solid ${focusIdx === 14 ? C.focus : C.border}`, 
                padding: "1.5vh 3vw", 
                borderRadius: 12, 
                fontWeight: 'bold', 
                cursor: "pointer",
                transition: "all 0.2s"
              }}>
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ lesson, result, onRetry, onHome, tvEvent }) {
  const [focusIdx, setFocusIdx] = useState(0);
  const lastEventId = useRef(tvEvent ? tvEvent.timestamp : null);

  useEffect(() => {
    if (!tvEvent || tvEvent.timestamp === lastEventId.current) return;
    lastEventId.current = tvEvent.timestamp;

    const { key } = tvEvent;
    
    if (key === "Escape") onHome();
    if (key === "ArrowDown") setFocusIdx(1);
    if (key === "ArrowUp") setFocusIdx(0);
    if (key === "Enter") {
      if (focusIdx === 0) onRetry();
      else onHome();
    }
  }, [tvEvent, focusIdx, onRetry, onHome]);

  return (
    <div style={base}>
      <div style={{ ...tvContainer, alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ fontSize: "6vh", color: C.text, margin: "0 0 2vh" }}>Quiz Complete!</h1>
        <div style={{ fontSize: "4vh", color: C.gold, marginBottom: "5vh" }}>Score: {result.score} / {result.total * 10}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2vh", width: "50%" }}>
          <button 
            onClick={onRetry}
            onMouseEnter={() => setFocusIdx(0)}
            style={{
              background: focusIdx === 0 ? C.focus : C.surface, color: focusIdx === 0 ? C.bg : C.text,
              border: `2px solid ${C.focus}`, borderRadius: 16, padding: "2.5vh", fontSize: "3vh", fontWeight: 'bold', cursor: "pointer",
              transition: "all 0.2s"
          }}>
            🔄 Play Again
          </button>
          <button 
            onClick={onHome}
            onMouseEnter={() => setFocusIdx(1)}
            style={{
              background: focusIdx === 1 ? C.focus : C.surface, color: focusIdx === 1 ? C.bg : C.text,
              border: `2px solid ${C.border}`, borderRadius: 16, padding: "2.5vh", fontSize: "3vh", fontWeight: 'bold', cursor: "pointer",
              transition: "all 0.2s"
          }}>
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [topicIdx, setTopicIdx] = useState(0);
  const [result, setResult] = useState(null);
  
  const [tvEvent, setTvEvent] = useState(null);

  const handleRemotePress = useCallback((key) => {
    setTvEvent({ key, timestamp: Date.now() });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // The native input is completely gone, so we don't need to check for it!
      const validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape", "Backspace"];

      if (validKeys.includes(e.key)) {
        e.preventDefault(); 
        
        if (e.key === "Backspace") {
          // Remotes often map "Back" to backspace
          handleRemotePress("Escape");
        } else {
          handleRemotePress(e.key);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRemotePress]);

  const lesson = LESSONS[topicIdx];

  return (
    <>
      {screen === "home" && <HomeScreen onSelect={i => { setTopicIdx(i); setScreen("lesson"); }} tvEvent={tvEvent} />}
      
      {screen === "lesson" && <LessonScreen lesson={lesson} onStart={() => setScreen("quiz")} onBack={() => setScreen("home")} tvEvent={tvEvent} />}
      
      {screen === "quiz" && <QuizScreen lesson={lesson} onFinish={r => { setResult(r); setScreen("result"); }} onBack={() => setScreen("lesson")} tvEvent={tvEvent} />}
      
      {screen === "result" && <ResultScreen lesson={lesson} result={result} onRetry={() => setScreen("quiz")} onHome={() => setScreen("home")} tvEvent={tvEvent} />}
    </>
  );
}