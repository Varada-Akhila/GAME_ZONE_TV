import { useState, useEffect, useRef, useCallback } from "react";

const VIDEO_SRC = "https://games.vrplay.in/videos/bodyparts.mp4";
const NUM_Q = 5;

const C = {
  accent:"#7c3aed", accentLt:"#a78bfa",
  gold:"#f59e0b",
  correct:"#059669", correctBg:"rgba(5,150,105,0.14)",
  wrong:"#dc2626",   wrongBg:"rgba(220,38,38,0.12)",
  text:"#1a1a1a", muted:"#6b7280",
  card:"#ffffffed", border:"rgba(0,0,0,0.08)",
};

/* ─────────────────────────────────────────────────────────────────────────
   Body Parts Quiz — Questions grouped by topic (organ system)
   Each session picks exactly ONE random question from each topic group,
   so you NEVER get two questions about the same thing in one quiz.
───────────────────────────────────────────────────────────────────────── */
const TOPICS = {

  heart: [
    {
      question: "గుండె యొక్క ప్రాథమిక కార్యం ఏమిటి?",
      english:  "What is the primary function of the heart?",
      options:  ["ఆహారాన్ని జీర్ణం చేయడం / Digest food", "రక్తం పంపడం / Pump blood", "శ్వాస ప్రక్రియ / Breathing", "ఆలోచన చేయడం / Thinking"],
      correctIndex: 1,
      explanation: "అది సరైనది! గుండె రక్తాన్ని శరీరం అంతటా పంపుతుంది — Correct! The heart pumps blood throughout the body."
    },
    {
      question: "గుండెకు ఎన్ని గదులు ఉన్నాయి?",
      english:  "How many chambers does the human heart have?",
      options:  ["రెండు / Two", "మూడు / Three", "నాలుగు / Four", "ఐదు / Five"],
      correctIndex: 2,
      explanation: "అది సరైనది! గుండెకు నాలుగు గదులు ఉన్నాయి — నిమ్న గుండె, ఉచ్చ గుండె — Correct! Four chambers: two upper atria, two lower ventricles."
    },
    {
      question: "ఆక్సిజన్ సమృద్ధ రక్తం గుండె నుండి ఎక్కడికి వెళుతుంది?",
      english:  "What carries oxygen-rich blood from the heart?",
      options:  ["సిరలు / Veins", "ధమనులు / Arteries", "కేశనాళికలు / Capillaries", "లిమ్ఫ / Lymph"],
      correctIndex: 1,
      explanation: "అది సరైనది! ధమనులు ఆక్సిజన్ సమృద్ధ రక్తాన్ని గుండె నుండి వెళ్ళవేస్తాయి — Correct! Arteries carry oxygen-rich blood away from the heart."
    },
  ],

  brain: [
    {
      question: "మెదడు ఏమీ నియంత్రిస్తుంది?",
      english:  "What does the brain control?",
      options:  ["జీర్ణక్రియ మాత్రమే / Only digestion", "కండరాల కదలిక మరియు ఆలోచన / Muscle movement and thought", "రక్త ప్రసరణ మాత్రమే / Only blood circulation", "శ్వాస ప్రక్రియ మాత్రమే / Only breathing"],
      correctIndex: 1,
      explanation: "సరైనది! మెదడు మన ఆలోచన, కదలిక, భావాలు సమస్తాన్ని నియంత్రిస్తుంది — Correct! The brain controls all thoughts, movements, and emotions."
    },
    {
      question: "మెదడు శరీరంలో ఎక్కడ ఉంటుంది?",
      english:  "Where is the brain located in the body?",
      options:  ["కడుపులో / In the stomach", "గుండెలో / In the heart", "నుండు / In the skull", "వెన్నెముకలో / In the spine"],
      correctIndex: 2,
      explanation: "సరైనది! మెదడు నుండులో (నలుపటిలో) ఉంటుంది, అది సుরక్షితం ఉంటుంది — Correct! The brain is inside the skull, where it is well protected."
    },
    {
      question: "మెదడు ఎందుకు అవసరమైనది?",
      english:  "Why is the brain necessary?",
      options:  ["కేవలం శరీర బరువుకు / Just for body weight", "ఆలోచన, జ్ఞాపకశక్తి, నిర్ణయాలు / Thinking, memory, and decisions", "కేవలం నిద్ర కోసం / Just for sleep", "రక్తం ఉత్పత్తి కోసం / For blood production"],
      correctIndex: 1,
      explanation: "సరైనది! మెదడు ఆలోచన, జ్ఞాపకం, ఇంద్రియ ప్రక్రియలను నియంత్రిస్తుంది — Correct! The brain handles all thinking, memory, and sensory processing."
    },
  ],

  lungs: [
    {
      question: "ఫుఫ్ఫుసాల యొక్క ప్రధాన కార్యం ఏమిటి?",
      english:  "What is the main function of the lungs?",
      options:  ["రక్తం ఫిల్టర్ చేయడం / Filter blood", "ఆక్సిజన్ మరియు కార్బన్ డయాక్సైడ్ మార్పిడి / Exchange oxygen and carbon dioxide", "ఆహారాన్ని జీర్ణం చేయడం / Digest food", "శరీర ఉష్ణోగ్రత నియంత్రణ / Regulate body temperature"],
      correctIndex: 1,
      explanation: "సరైనది! ఫుఫ్ఫుసాలు ఆక్సిజన్‌ను గ్రహించుకుంటాయి మరియు కార్బన్ డయాక్సైడ్‌ను విడుదల చేస్తాయి — Correct! Lungs exchange oxygen for carbon dioxide."
    },
    {
      question: "మనకు ఎన్ని ఫుఫ్ఫుసాలు ఉన్నాయి?",
      english:  "How many lungs do we have?",
      options:  ["ఒకటి / One", "రెండు / Two", "మూడు / Three", "నాలుగు / Four"],
      correctIndex: 1,
      explanation: "సరైనది! మానవులకు రెండు ఫుఫ్ఫుసాలు ఉన్నాయి — ఎడమ మరియు కుడి — Correct! We have two lungs: left and right."
    },
    {
      question: "ఫుఫ్ఫుసాలు శ్వాస ప్రక్రియకు ఎలా సహాయం చేస్తాయి?",
      english:  "How do the lungs help us breathe?",
      options:  ["రక్తాన్ని సవతి చేస్తాయి / They purify blood", "గాలిని లోపలికి తీసుకుంటాయి మరియు విషపదార్థాన్ని వెలికితీస్తాయి / They draw air in and release waste", "కండరాలను సంకోచం చేస్తాయి / They contract muscles", "ఉష్ణశక్తిని ఉత్పత్తి చేస్తాయి / They produce heat"],
      correctIndex: 1,
      explanation: "సరైనది! ఫుఫ్ఫుసాలు ఆక్సిజన్‌ను గ్రహించుకుంటాయి, కార్బన్ డయాక్సైడ్‌ను విడుదల చేస్తాయి — Correct! Lungs take in oxygen and release carbon dioxide."
    },
  ],

  bones: [
    {
      question: "పూర్తిగా ఉన్న మానవ కంకాళంలో ఎన్ని ఎముకలు ఉన్నాయి?",
      english:  "How many bones are in the adult human skeleton?",
      options:  ["176", "186", "206", "226"],
      correctIndex: 2,
      explanation: "సరైనది! పూర్తిగా మానవులకు 206 ఎముకలు ఉన్నాయి — Correct! Adult humans have 206 bones."
    },
    {
      question: "మానవ శరీరంలో చిన్నమైన ఎముక ఏది?",
      english:  "What is the smallest bone in the human body?",
      options:  ["ఫిబులా / Fibula", "స్టేపెస్ (చెవిలో) / Stapes (in the ear)", "రేడియస్ / Radius", "కోకిక్స్ / Coccyx"],
      correctIndex: 1,
      explanation: "సరైనది! స్టేపెస్ చెవిలో ఉండే చిన్నమైన ఎముక — కేవలం 2.8 మిమీ — Correct! The stapes in the ear is the smallest bone, only 2.8mm long."
    },
    {
      question: "ఎముక యొక్క ప్రధాన కార్యం ఏమిటి?",
      english:  "What is the main function of bones?",
      options:  ["శక్తి నిల్వ / Store energy", "శరీర నిర్మాణం మరియు రక్త కణాల ఉత్పత్తి / Support body structure and produce blood cells", "కండరాల చలనం మాత్రమే / Just muscle movement", "ఆహారాన్ని జీర్ణం చేయడం / Digest food"],
      correctIndex: 1,
      explanation: "సరైనది! ఎముకలు శరీరానికి నిర్మాణం ఇస్తాయి, కాపర్ కణాలను ఉత్పత్తి చేస్తాయి — Correct! Bones provide structure and produce blood cells."
    },
  ],

  kidneys: [
    {
      question: "మూత్రపిండాలు (కిడనీలు) ఏ కార్యాన్ని చేస్తాయి?",
      english:  "What function do the kidneys perform?",
      options:  ["రక్తం పంపడం / Pump blood", "రక్తం నుండి వ్యర్థాలను ఫిల్టర్ చేయడం / Filter waste from blood", "ఆహారాన్ని జీర్ణం చేయడం / Digest food", "శ్వాసను నియంత్రించడం / Control breathing"],
      correctIndex: 1,
      explanation: "సరైనది! మూత్రపిండాలు రక్తాన్ని ఫిల్టర్ చేస్తాయి మరియు వ్యర్థాన్ని విడుదల చేస్తాయి — Correct! Kidneys filter blood and remove waste as urine."
    },
    {
      question: "మనకు ఎన్ని మూత్రపిండాలు ఉన్నాయి?",
      english:  "How many kidneys do we have?",
      options:  ["ఒకటి / One", "రెండు / Two", "మూడు / Three", "నాలుగు / Four"],
      correctIndex: 1,
      explanation: "సరైనది! మనకు రెండు మూత్రపిండాలు ఉన్నాయి — ఎడమ మరియు కుడి — Correct! We have two kidneys: left and right."
    },
    {
      question: "మూత్రపిండాలు ఎక్కడ ఉంటాయి?",
      english:  "Where are the kidneys located?",
      options:  ["గుండెలో / In the heart", "నుండుకు వెనుక (వెన్నెముకకు వెంట) / Behind the spine", "కడుపులో సమక్షం / Below the stomach", "ఫుఫ్ఫుసాలకు వెంట / Next to the lungs"],
      correctIndex: 1,
      explanation: "సరైనది! మూత్రపిండాలు వెన్నెముక యొక్క రెండు వైపులా, కడుపుకు వెనుకవైపు ఉంటాయి — Correct! Kidneys are on both sides of the spine, in the back of the abdomen."
    },
  ],
};

/* Pick exactly ONE random question from each topic — 5 totally different questions */
/* ─────────────────────────────────────────────────────────────────────────
   Per-topic queues — guarantees no question repeats until every question
   in that topic has been shown at least once. Works across Play Again too.
───────────────────────────────────────────────────────────────────────── */
const _queues = {};
const _lastQ  = {};

function _shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function _nextFromTopic(topicKey) {
  const pool = TOPICS[topicKey];
  // Refill queue when empty
  if (!_queues[topicKey] || _queues[topicKey].length === 0) {
    let shuffled = _shuffle(pool);
    // Ensure first item after reshuffle is not the same as last given
    if (_lastQ[topicKey] && shuffled.length > 1) {
      while (shuffled[0] === _lastQ[topicKey]) {
        shuffled = _shuffle(pool);
      }
    }
    _queues[topicKey] = shuffled;
  }
  const q = _queues[topicKey].shift();
  _lastQ[topicKey] = q;
  return q;
}

/* Returns 5 questions — one from each topic, never the same as last time */
function getQuestions() {
  return Object.keys(TOPICS).map(key => _nextFromTopic(key));
}

/* ── Key hint pill ── */
function KeyHint({ k, label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 11px",
      borderRadius:999, background:"#ffffff90", border:"1px solid rgba(0,0,0,0.08)",
      fontSize:"clamp(.6rem,.85vw,.82rem)", fontWeight:700 }}>
      <kbd style={{ padding:"1px 7px", borderRadius:5, fontFamily:"monospace",
        background:"rgba(124,58,237,0.15)", color:C.accent, fontWeight:800,
        border:"1px solid rgba(124,58,237,0.3)", fontSize:"inherit" }}>{k}</kbd>
      <span style={{ color:C.muted }}>{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 1 — VIDEO
══════════════════════════════════════════════════════════════════════════ */
function VideoPage({ onDone }) {
  const vidRef = useRef(null);
  const [pct,     setPct]     = useState(0);
  const [watched, setWatched] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hover,   setHover]   = useState(false);
  const [vidErr,  setVidErr]  = useState(false);

  useEffect(() => {
    const v = vidRef.current; if (!v) return;
    const onT  = () => setPct(v.duration ? v.currentTime / v.duration : 0);
    const onE  = () => { setWatched(true); setPlaying(false); };
    const onPl = () => setPlaying(true);
    const onPa = () => setPlaying(false);
    const onEr = () => setVidErr(true);
    v.addEventListener("timeupdate", onT); v.addEventListener("ended", onE);
    v.addEventListener("play", onPl);      v.addEventListener("pause", onPa);
    v.addEventListener("error", onEr);
    return () => {
      v.removeEventListener("timeupdate", onT); v.removeEventListener("ended", onE);
      v.removeEventListener("play", onPl);      v.removeEventListener("pause", onPa);
      v.removeEventListener("error", onEr);
    };
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Enter" || e.key === "Return") {
        e.preventDefault();
        if (watched) { onDone(); return; }
        // OK/Enter also plays/pauses the video
        const v = vidRef.current;
        if (v) v.paused ? v.play() : v.pause();
      }
      // Space also plays/pauses
      if (e.key === " ") {
        e.preventDefault();
        const v = vidRef.current;
        if (v) v.paused ? v.play() : v.pause();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [watched, onDone]);

  const bg = "radial-gradient(ellipse at 0% 0%,#ede9fe,transparent 50%),radial-gradient(ellipse at 100% 100%,#fce7f3,transparent 50%),#faf8ff";

  return (
    <div style={{ width:"100%", height:"100%", overflowY:"auto", background:bg,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(16px,3vh,40px) clamp(16px,3vw,48px)", gap:"clamp(12px,2vh,20px)",
      fontFamily:"'Nunito',sans-serif" }}>

      <div style={{ textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", margin:"0 0 6px",
          fontSize:"clamp(1.6rem,3.5vw,3rem)", fontWeight:600,
          background:"linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          🫀 Body Parts & Health
        </h1>
        <p style={{ color:C.muted, fontSize:"clamp(.78rem,1.1vw,1rem)", fontWeight:600 }}>
          Watch the educational video, then take the quiz!
        </p>
      </div>

      <div style={{ width:"100%", maxWidth:820, position:"relative" }}>
        <div style={{ position:"absolute", inset:-3, borderRadius:22,
          background:"linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)",
          opacity:playing?0.45:0.2, filter:"blur(14px)", zIndex:0, transition:"opacity .6s" }} />
        <div style={{ position:"relative", zIndex:1, borderRadius:18, overflow:"hidden",
          border:`2.5px solid ${playing?"rgba(124,58,237,.6)":"rgba(124,58,237,.18)"}`,
          background:"#000", boxShadow:"0 16px 60px rgba(0,0,0,.2)", transition:"border-color .4s" }}>
          {vidErr ? (
            <div style={{ width:"100%", height:220, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:10,
              background:"#f5f3ff", color:C.muted, padding:24, textAlign:"center" }}>
              <span style={{ fontSize:"2.5rem" }}>📁</span>
              <div style={{ fontWeight:800, color:C.text }}>Video file not found</div>
              <div style={{ fontSize:"0.84rem", lineHeight:1.6, maxWidth:400 }}>
                Place your video at <code style={{ background:"rgba(124,58,237,.12)",
                  padding:"2px 8px", borderRadius:5, color:C.accent }}>
                 https://games.vrplay.in/videos/bodyparts.mp4</code>
              </div>
            </div>
          ) : (
            <video ref={vidRef} src={VIDEO_SRC} controls controlsList="nodownload"
              style={{ width:"100%", display:"block", maxHeight:"52vh", background:"#000" }}
              playsInline preload="metadata" />
          )}
          <div style={{ height:5, background:"rgba(0,0,0,.08)" }}>
            <div style={{ height:"100%", width:`${pct*100}%`,
              background:"linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b)",
              transition:"width .4s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
        <div style={{ padding:"8px 18px", borderRadius:999, fontWeight:700,
          fontSize:"clamp(.72rem,1vw,.92rem)", display:"flex", alignItems:"center", gap:6,
          background:"#ffffffdb", border:`1px solid ${C.border}`, color:C.muted }}>
          <span>{playing?"▶️":"⏸️"}</span><span>{Math.round(pct*100)}% watched</span>
        </div>
        <div style={{ padding:"8px 18px", borderRadius:999, fontWeight:700,
          fontSize:"clamp(.72rem,1vw,.92rem)", display:"flex", alignItems:"center", gap:6,
          background:watched?"rgba(5,150,105,.12)":"#ffffffdb",
          border:`1px solid ${watched?C.correct:C.border}`,
          color:watched?C.correct:C.muted,
          boxShadow:watched?"0 0 18px rgba(5,150,105,.2)":"none", transition:"all .4s" }}>
          <span>{watched?"✅":"🔒"}</span><span>{watched?"Quiz Unlocked!":"Finish to unlock"}</span>
        </div>
      </div>

      <button disabled={!watched} onClick={() => watched && onDone()}
        onMouseEnter={() => watched && setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ padding:"clamp(11px,1.6vh,18px) clamp(32px,5vw,64px)",
          fontSize:"clamp(.9rem,1.4vw,1.15rem)", fontWeight:800, borderRadius:999,
          border:"none", fontFamily:"'Nunito',sans-serif",
          cursor:watched?"pointer":"not-allowed",
          background:watched?"linear-gradient(135deg,#7c3aed,#ec4899)":"rgba(0,0,0,.08)",
          color:watched?"#fff":C.muted,
          boxShadow:watched?hover?`0 0 0 4px rgba(124,58,237,.35),0 8px 32px rgba(124,58,237,.45)`:`0 6px 24px rgba(124,58,237,.4)`:"none",
          transform:watched&&hover?"scale(1.06) translateY(-2px)":"scale(1)",
          transition:"all .22s cubic-bezier(.34,1.56,.64,1)" }}>
        {watched ? "🚀 Start Quiz" : "⏳ Finish video first"}
      </button>

      <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
        <KeyHint k="⏎ OK" label="Play / Pause" />
        <KeyHint k="Space" label="Play / Pause" />
        <KeyHint k="⏎ OK (end)" label="Start Quiz" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 2 — LOADING
══════════════════════════════════════════════════════════════════════════ */
function LoadingPage() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const t = setInterval(() => setDots((d) => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:28,
      background:"radial-gradient(ellipse at 50% 50%,#ede9fe,#faf8ff)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSpin{to{transform:rotate(360deg)}}@keyframes vqPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ position:"relative", width:90, height:90 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ position:"absolute", inset:i*10, borderRadius:"50%",
            border:`2.5px solid ${C.accentLt}`, opacity:.4-i*.1,
            animation:`vqSpin ${1+i*.28}s linear infinite` }} />
        ))}
        <div style={{ position:"absolute", inset:28, borderRadius:"50%",
          background:"linear-gradient(135deg,#7c3aed,#ec4899)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>🫀</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:C.text,
          marginBottom:6, fontFamily:"'Fredoka One',cursive" }}>Loading Quiz{dots}</div>
        <div style={{ color:C.muted, fontSize:"0.9rem", fontWeight:600 }}>Preparing your health questions…</div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:C.accentLt,
            animation:`vqPulse 1.2s ease infinite`, animationDelay:`${i*0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 3 — QUIZ
══════════════════════════════════════════════════════════════════════════ */
function QuizPage({ questions, onFinish }) {
  const [qIdx,     setQIdx]     = useState(0);
  const [focused,  setFocused]  = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers,  setAnswers]  = useState([]);
  const [countdown, setCountdown] = useState(null);

  const q        = questions[qIdx];
  const answered = selected !== null;
  const score    = answers.filter(a => a.chosen === a.correct).length;

  const goNext = useCallback((snap) => {
    if (qIdx + 1 >= questions.length) { onFinish(snap); return; }
    setQIdx(i => i+1); setFocused(0); setSelected(null); setCountdown(null);
  }, [qIdx, questions.length, onFinish]);

  const pick = useCallback((i) => {
    if (answered) return;
    const newAnswer = { chosen:i, correct:q.correctIndex,
      explanation:q.explanation, options:q.options, question:q.question, english:q.english };
    const snap = [...answers, newAnswer];
    setSelected(i);
    setAnswers(snap);
    setCountdown(5);
    const t1 = setTimeout(() => setCountdown(4), 1000);
    const t2 = setTimeout(() => setCountdown(3), 2000);
    const t3 = setTimeout(() => setCountdown(2), 3000);
    const t4 = setTimeout(() => setCountdown(1), 4000);
    const t5 = setTimeout(() => goNext(snap), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [answered, q, answers, goNext]);

  useEffect(() => {
    const h = (e) => {
      if (!answered) {
        if      (e.key==="ArrowDown") { e.preventDefault(); setFocused(f=>Math.min(f+1,q.options.length-1)); }
        else if (e.key==="ArrowUp")   { e.preventDefault(); setFocused(f=>Math.max(f-1,0)); }
        else if (e.key==="Enter"||e.key===" ") { e.preventDefault(); pick(focused); }
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [answered, focused, pick, q]);

  const getState = (i) => {
    if (!answered) return focused===i ? "focused" : "idle";
    if (i===q.correctIndex) return "correct";
    if (i===selected)       return "wrong";
    return "dim";
  };

  const isCorrect  = answered && selected === q.correctIndex;
  const lastAnswer = answers[answers.length-1];
  const progPct    = ((qIdx+(answered?1:0))/questions.length)*100;

  return (
    <div style={{ width:"100%", height:"100%", overflowY:"auto",
      background:"radial-gradient(ellipse at 0% 0%,#ede9fe,transparent 50%),radial-gradient(ellipse at 100% 100%,#fce7f3,transparent 50%),#faf8ff",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(14px,2.5vh,36px) clamp(14px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}@keyframes vqPop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>

      <div style={{ width:"100%", maxWidth:680 }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:"clamp(10px,1.8vh,20px)", flexWrap:"wrap", gap:10 }}>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
            fontSize:"clamp(1.3rem,2.8vw,2rem)", fontWeight:700,
            background:"linear-gradient(135deg,#7c3aed,#ec4899)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            🫀 Quiz Time
          </h2>
          <div style={{ padding:"7px 18px", borderRadius:999, background:"#ffffffdb",
            border:`1px solid ${C.border}`, fontWeight:800, color:C.gold,
            fontSize:"clamp(.75rem,1vw,.95rem)" }}>
            ⭐ {score} / {questions.length}
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10,
          marginBottom:"clamp(10px,1.8vh,20px)" }}>
          <span style={{ color:C.muted, fontSize:"clamp(.7rem,.9vw,.85rem)", fontWeight:700, whiteSpace:"nowrap" }}>
            Q {qIdx+1}/{questions.length}
          </span>
          <div style={{ flex:1, height:7, borderRadius:4, background:"rgba(0,0,0,.08)", overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progPct}%`,
              background:"linear-gradient(90deg,#7c3aed,#ec4899)",
              transition:"width .5s ease", borderRadius:4 }} />
          </div>
          <span style={{ color:C.muted, fontSize:"clamp(.7rem,.9vw,.85rem)", fontWeight:700 }}>
            {Math.round(progPct)}%
          </span>
        </div>

        <div style={{ background:C.card, borderRadius:"clamp(14px,2vw,22px)",
          padding:"clamp(18px,2.8vh,28px) clamp(16px,2.5vw,26px) clamp(14px,2.2vh,22px)",
          border:"2px solid rgba(124,58,237,.12)", boxShadow:"0 6px 32px rgba(0,0,0,.1)",
          marginBottom:12, animation:"vqPop .3s ease" }}>

          <p style={{ fontSize:"clamp(.95rem,1.8vw,1.1rem)", fontWeight:800, lineHeight:1.6,
            color:C.text, margin:"0 0 4px 0" }}>{q.question}</p>
          <p style={{ fontSize:"clamp(.78rem,1.3vw,.92rem)", fontWeight:600, color:C.muted,
            margin:"0 0 clamp(14px,2vh,20px) 0", fontStyle:"italic" }}>{q.english}</p>

          <div style={{ display:"flex", flexDirection:"column", gap:"clamp(7px,1vh,10px)" }}>
            {q.options.map((opt, i) => {
              const st   = getState(i);
              const isFoc = st === "focused";
              return (
                <button key={i}
                  onClick={() => !answered && pick(i)}
                  onMouseEnter={() => !answered && setFocused(i)}
                  style={{
                    width:"100%", padding:"clamp(10px,1.5vh,13px) clamp(12px,1.5vw,16px)",
                    borderRadius:"clamp(10px,1.2vw,14px)",
                    border:`1.5px solid ${st==="correct"?C.correct:st==="wrong"?C.wrong:isFoc?C.accent:C.border}`,
                    background:st==="correct"?C.correctBg:st==="wrong"?C.wrongBg:st==="dim"?"rgba(0,0,0,.03)":isFoc?"rgba(124,58,237,.1)":"rgba(255,255,255,.7)",
                    color:st==="dim"?"#bbb":st==="correct"?C.correct:st==="wrong"?C.wrong:C.text,
                    display:"flex", alignItems:"center", gap:"clamp(8px,1vw,12px)",
                    fontSize:"clamp(.8rem,1.2vw,.95rem)", fontWeight:600,
                    fontFamily:"'Nunito',sans-serif", cursor:answered?"default":"pointer",
                    textAlign:"left", outline:"none", lineHeight:1.4,
                    transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                    transform:isFoc?"translateX(6px)":"none",
                    boxShadow:st==="correct"?"0 0 16px rgba(5,150,105,.2)":st==="wrong"?"0 0 10px rgba(220,38,38,.15)":isFoc?"0 0 0 2px rgba(124,58,237,.25)":"none",
                    opacity:st==="dim"?0.4:1,
                  }}>
                  <span style={{ minWidth:26, height:26, borderRadius:7, flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:".76rem", fontWeight:900, color:"#fff",
                    background:st==="correct"?C.correct:st==="wrong"?C.wrong:isFoc?C.accent:"rgba(0,0,0,.15)" }}>
                    {st==="correct"?"✓":st==="wrong"?"✗":String.fromCharCode(65+i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {answered && lastAnswer && (
          <div style={{ padding:"clamp(10px,1.5vh,14px) clamp(14px,2vw,18px)",
            borderRadius:"clamp(10px,1.2vw,14px)",
            background:isCorrect?C.correctBg:C.wrongBg,
            border:`1px solid ${isCorrect?C.correct:C.wrong}`,
            display:"flex", gap:10, alignItems:"center",
            marginBottom:12, animation:"vqSlide .25s ease" }}>
            <span style={{ fontSize:"1.4rem", flexShrink:0 }}>{isCorrect?"🎉":"💡"}</span>
            <div style={{ flex:1, fontSize:"clamp(.78rem,1.1vw,.9rem)", lineHeight:1.55, color:C.muted, fontWeight:600 }}>
              <span style={{ fontWeight:800, color:isCorrect?C.correct:C.wrong, marginRight:6 }}>
                {isCorrect?"Correct!":"Wrong!"}
              </span>
              {lastAnswer.explanation}
            </div>
            <div style={{ minWidth:36, height:36, borderRadius:"50%",
              background:isCorrect?C.correct:C.wrong,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontWeight:900, fontSize:"1rem", flexShrink:0 }}>
              {countdown}
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
          <KeyHint k="↑↓" label="Navigate" />
          <KeyHint k="⏎ OK" label="Select answer" />
          {answered && <KeyHint k="⏳" label="Auto next in 5s" />}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 4 — RESULTS
══════════════════════════════════════════════════════════════════════════ */
function ResultsPage({ answers, questions, onRestart }) {
  const [hover, setHover] = useState(false);
  const score = answers.filter(a => a.chosen===a.correct).length;
  const pct   = Math.round((score/answers.length)*100);
  const emoji = pct===100?"🏆":pct>=80?"🌟":pct>=60?"👏":pct>=40?"📚":"💪";
  const msg   = pct===100?"Perfect Score!":pct>=80?"Excellent!":pct>=60?"Good Job!":pct>=40?"Keep Learning!":"Nice Try!";
  const col   = pct>=80?C.correct:pct>=50?C.gold:C.wrong;

  useEffect(() => {
    const h=e=>{ if(e.key==="Enter"||e.key===" "){e.preventDefault();onRestart();} };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[onRestart]);

  return (
    <div style={{ width:"100%", height:"100%", overflowY:"auto",
      background:"radial-gradient(ellipse at 50% 0%,#ede9fe,transparent 50%),#faf8ff",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(20px,3vh,48px) clamp(16px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif", gap:"clamp(14px,2vh,22px)" }}>
      <style>{`@keyframes vqBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      <div style={{ fontSize:"clamp(3.5rem,8vw,5.5rem)", filter:`drop-shadow(0 0 20px ${col})`,
        animation:"vqBounce 2s ease-in-out infinite" }}>{emoji}</div>

      <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
        fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700,
        background:"linear-gradient(135deg,#7c3aed,#f59e0b)",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{msg}</h2>

      <div style={{ display:"inline-flex", alignItems:"baseline", gap:8,
        padding:"clamp(12px,2vh,18px) clamp(28px,4vw,48px)", borderRadius:20,
        background:C.card, border:`2.5px solid ${col}44`,
        boxShadow:`0 0 32px ${col}18,0 6px 24px rgba(0,0,0,.08)` }}>
        <span style={{ fontSize:"clamp(2.5rem,7vw,4rem)", fontWeight:900, color:col }}>{score}</span>
        <span style={{ fontSize:"clamp(1.3rem,3vw,2rem)", color:C.muted }}>/ {answers.length}</span>
        <span style={{ fontSize:"clamp(.88rem,1.2vw,1rem)", color:C.muted, marginLeft:4 }}>({pct}%)</span>
      </div>

      <div style={{ width:"100%", maxWidth:600, display:"flex", flexDirection:"column",
        gap:8, maxHeight:"30vh", overflowY:"auto", paddingRight:4 }}>
        {answers.map((a,i) => {
          const ok = a.chosen===a.correct;
          return (
            <div key={i} style={{ padding:"clamp(9px,1.3vh,13px) clamp(13px,1.8vw,16px)",
              borderRadius:"clamp(10px,1.2vw,14px)",
              background:ok?C.correctBg:C.wrongBg,
              border:`1px solid ${ok?C.correct+"44":C.wrong+"44"}`,
              display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ flexShrink:0, marginTop:1 }}>{ok?"✅":"❌"}</span>
              <div style={{ fontSize:"clamp(.76rem,1vw,.88rem)", lineHeight:1.5 }}>
                <div style={{ fontWeight:700, color:C.text, marginBottom:ok?0:3 }}>
                  {questions[i]?.english}
                </div>
                {!ok && (
                  <div style={{ color:C.muted, fontWeight:600 }}>
                    Your answer: <span style={{ color:C.wrong, fontWeight:800 }}>{questions[i]?.options[a.chosen]}</span>
                    {" · "}Correct: <span style={{ color:C.correct, fontWeight:800 }}>{questions[i]?.options[a.correct]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onRestart}
        onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
        style={{ padding:"clamp(12px,1.8vh,18px) clamp(40px,6vw,72px)",
          borderRadius:999, border:"none", cursor:"pointer",
          background:"linear-gradient(135deg,#7c3aed,#ec4899)",
          color:"#fff", fontWeight:800, fontFamily:"'Nunito',sans-serif",
          fontSize:"clamp(.9rem,1.4vw,1.15rem)",
          boxShadow:hover?`0 0 0 4px rgba(124,58,237,.3),0 10px 36px rgba(124,58,237,.5)`:`0 6px 28px rgba(124,58,237,.4)`,
          transform:hover?"scale(1.07) translateY(-2px)":"scale(1)",
          transition:"all .22s cubic-bezier(.34,1.56,.64,1)", outline:"none" }}>
        🔄 Play Again
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════════════ */
export default function VideoQuizGame() {
  const [page,      setPage]      = useState("video");
  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState([]);

  const startQuiz = useCallback(() => {
    setPage("loading");
    setTimeout(() => {
      setQuestions(getQuestions());
      setPage("quiz");
    }, 800);
  }, []);

  const handleFinish  = useCallback((ans) => { setAnswers(ans); setPage("results"); }, []);

  const handleRestart = useCallback(() => {
    setAnswers([]);
    setPage("loading");
    setTimeout(() => {
      setQuestions(getQuestions());
      setPage("quiz");
    }, 800);
  }, []);

  return (
    <div style={{ width:"100%", height:"100%" }}>
      {page==="video"   && <VideoPage   onDone={startQuiz} />}
      {page==="loading" && <LoadingPage />}
      {page==="quiz"    && questions.length>0 && <QuizPage questions={questions} onFinish={handleFinish} />}
      {page==="results" && <ResultsPage answers={answers} questions={questions} onRestart={handleRestart} />}
    </div>
  );
}