import { useState, useEffect, useRef, useCallback } from "react";

const VIDEO_SRC = "https://games.vrplay.in/videos/Untitled_design_1.mp4";

const C = {
  accent:"#e85d04", accentLt:"#f48c06",
  gold:"#f59e0b",
  correct:"#059669", correctBg:"rgba(5,150,105,0.14)",
  wrong:"#dc2626",   wrongBg:"rgba(220,38,38,0.12)",
  text:"#1a1a1a", muted:"#6b7280",
  card:"#ffffffed", border:"rgba(0,0,0,0.08)",
};

/* ─────────────────────────────────────────────────────────────────────────
   Questions based on the Natural Disasters video content (Telugu + English)
   Topics: Earthquake, Earthquake Safety, Flood, Flood Safety, Volcano
───────────────────────────────────────────────────────────────────────── */
const TOPICS = {

  earthquake_basics: [
    {
      question: "భూకంపం అంటే ఏమిటి?",
      english:  "What is an earthquake?",
      options:  ["భూమి వణకడం / Ground shaking", "భారీ వర్షం / Heavy rain", "నీరు పొంగడం / Water overflowing", "అగ్ని రావడం / Fire coming"],
      correctIndex: 0,
      explanation: "భూకంపం అంటే భూమి వణకడం (అర్థ్వెక అంటే భూమి). An earthquake is the shaking of the ground."
    },
    {
      question: "భూకంపం ఎందుకు వస్తుంది?",
      english:  "Why does an earthquake happen?",
      options:  ["భారీ వర్షం వల్ల / Due to heavy rain", "భూమి పొరలు కదలడం వల్ల / Earth's plates moving", "అగ్నిపర్వతం వల్ల మాత్రమే / Only due to volcano", "మేఘాలు పగలడం వల్ల / Due to clouds bursting"],
      correctIndex: 1,
      explanation: "భూమి లోపల ఉన్న పొరలు కదలడం వల్ల భూకంపం వస్తుంది. Earthquakes happen when Earth's tectonic plates move."
    },
    {
      question: "భూకంపం వస్తే రోడ్లకు ఏమి జరుగుతుంది?",
      english:  "What happens to roads during an earthquake?",
      options:  ["రోడ్లు పెరుగుతాయి / Roads grow", "రోడ్లు పగిలిపోతాయి / Roads crack", "రోడ్లు మెత్తగా అవుతాయి / Roads become soft", "రోడ్లు కదలవు / Roads don't move"],
      correctIndex: 1,
      explanation: "భూకంపం వల్ల రోడ్ క్రాక్ అవుతుంది (Road Crack). Roads crack and break during earthquakes."
    },
  ],

  earthquake_safety: [
    {
      question: "భూకంపం వస్తే మనం ఏమి చేయాలి?",
      english:  "What should we do when an earthquake comes?",
      options:  ["పరిగెత్తాలి / Run outside", "కిటికీ దగ్గర నిలబడాలి / Stand near window", "టేబుల్ కింద వంగి పట్టుకోవాలి / Duck under table and hold", "పైకి చూడాలి / Look up"],
      correctIndex: 2,
      explanation: "Drop, Cover, Hold! టేబుల్ కింద వంగి పట్టుకోవాలి — Duck under the table, cover your head and hold on tight."
    },
    {
      question: "భూకంపం సమయంలో ఏమి చేయకూడదు?",
      english:  "What should NOT be done during an earthquake?",
      options:  ["టేబుల్ కింద దాక్కోవడం / Hide under a table", "తల చేత్తో కప్పుకోవడం / Cover head with hands", "అల్మారా, పుస్తకాల దగ్గర నిలబడడం / Stand near shelves/books", "నిశ్శబ్దంగా ఉండడం / Stay calm"],
      correctIndex: 2,
      explanation: "వీడియోలో చూపినట్టు అల్మారా, పుస్తకాల షెల్ఫ్ దగ్గర నిలబడడం ప్రమాదం. Never stand near bookshelves or heavy objects — they can fall!"
    },
    {
      question: "'Drop, Cover, Hold' అంటే తెలుగులో ఏమిటి?",
      english:  "What does 'Drop, Cover, Hold' mean?",
      options:  ["పరిగెత్తు, కూర్చో, అరువు / Run, Sit, Shout", "వంగు, కప్పుకో, పట్టుకో / Duck, Cover, Hold", "నిలబడు, నడువు, ఆగు / Stand, Walk, Stop", "ఎగురు, చూడు, వదులు / Jump, Look, Release"],
      correctIndex: 1,
      explanation: "Drop, Cover, Hold — వంగు (Drop), తల కప్పుకో (Cover), పట్టుకో (Hold). This is the key earthquake safety action."
    },
  ],

  flood_basics: [
    {
      question: "వరదలు ఎందుకు వస్తాయి?",
      english:  "Why do floods occur?",
      options:  ["భూమి వేడెక్కడం వల్ల / Earth heating", "భారీ వర్షం వల్ల నదులు పొంగడం / Rivers overflowing due to heavy rain", "అగ్నిపర్వతం వల్ల / Due to volcano", "భూమి పగలడం వల్ల / Earth cracking"],
      correctIndex: 1,
      explanation: "హెవీ రెయిన్‌ఫాల్ వల్ల రివర్స్ ఓవర్‌ఫ్లో అవుతాయి, అవడం వల్ల వరదలు వస్తాయి. Heavy rainfall causes rivers to overflow, leading to floods."
    },
    {
      question: "వరద నీటిలో వాహనాలు నడపవచ్చా?",
      english:  "Can vehicles be driven through flood water?",
      options:  ["అవును, సురక్షితంగా నడపవచ్చు / Yes, it's safe", "వేగంగా నడిపితే ఫర్వాలేదు / Okay if driving fast", "లేదు, అవాయిడ్ ఫ్లడ్ వాటర్ / No, Avoid Flood Water", "చిన్న కారులో ఫర్వాలేదు / Okay in small cars"],
      correctIndex: 2,
      explanation: "Avoid Flood Water! వరద నీటిలో డ్రైవ్ చేయడం అవాయిడ్ చేయాలి. Never drive through flood water — it is extremely dangerous."
    },
    {
      question: "వరద సమయంలో మనం ఎక్కడికి వెళ్ళాలి?",
      english:  "Where should we go during a flood?",
      options:  ["నది దగ్గరికి / Near the river", "ఎత్తైన ప్రదేశానికి / To a high place", "భూమి కింద / Underground", "చెట్టు ఎక్కాలి / Climb a tree"],
      correctIndex: 1,
      explanation: "వరద సమయంలో ఎత్తైన ప్రదేశానికి వెళ్ళాలి. During floods, move to higher ground for safety."
    },
  ],

  volcano_basics: [
    {
      question: "అగ్నిపర్వతం ఎలా పేలుతుంది?",
      english:  "How does a volcano erupt?",
      options:  ["వర్షం పడటం వల్ల / Due to rain", "భూమి లోపల ప్రెషర్ ఎక్కువ అయినప్పుడు / When pressure builds inside Earth", "చల్లగా అయినప్పుడు / When it gets cold", "గాలి వేగం వల్ల / Due to wind speed"],
      correctIndex: 1,
      explanation: "ప్రెషర్ ఎక్కువ ఆయినప్పుడు అగ్నిపర్వతం పేలుతుంది. Volcanoes erupt when pressure builds up inside the Earth and magma is released."
    },
    {
      question: "అగ్నిపర్వతం వద్ద సేఫ్టీ జోన్ అంటే ఏమిటి?",
      english:  "What is the Safety Zone near a volcano?",
      options:  ["అగ్నిపర్వతం పైన ఉండే జోన్ / Zone on top of volcano", "లావా ప్రవహించే ప్రదేశం / Where lava flows", "అగ్నిపర్వతం నుండి సురక్షిత దూరం / Safe distance from the volcano", "అడవి లోపల ప్రదేశం / Place inside forest"],
      correctIndex: 2,
      explanation: "సేఫ్టీ జోన్ అంటే అగ్నిపర్వతం నుండి తగినంత దూరంలో ఉండాల్సిన సురక్షిత ప్రాంతం. Safety Zone is the safe area at a sufficient distance from the volcano."
    },
    {
      question: "అగ్నిపర్వతం పేలిన తర్వాత ఏమి చేయాలి?",
      english:  "What should be worn for protection after a volcanic eruption?",
      options:  ["రెయిన్ కోట్ వేసుకోవాలి / Wear a raincoat", "సేఫ్టీ మాస్క్ వేసుకోవాలి / Wear a safety mask", "గొడుగు పట్టుకోవాలి / Hold an umbrella", "హెల్మెట్ వేసుకోవాలి / Wear a helmet"],
      correctIndex: 1,
      explanation: "Wear Safety Masks! అగ్నిపర్వతం పొగ నుండి ప్రొటెక్షన్ కోసం మాస్క్ వేసుకోవాలి. Wear safety masks to protect from volcanic ash and smoke."
    },
  ],

  disasters_general: [
    {
      question: "ఈ వీడియోలో ఏ ప్రకృతి వైపరీత్యాల గురించి నేర్చుకున్నాం?",
      english:  "Which natural disasters did we learn about in this video?",
      options:  ["టైఫూన్, తుఫాను, మంచు / Typhoon, Storm, Snow", "భూకంపం, వరదలు, అగ్నిపర్వతం / Earthquake, Flood, Volcano", "కరవు, మంట, మేఘపాతం / Drought, Fire, Thunderstorm", "సునామి మాత్రమే / Only Tsunami"],
      correctIndex: 1,
      explanation: "వీడియోలో భూకంపం (Earthquake), వరదలు (Flood), అగ్నిపర్వతం (Volcano) గురించి నేర్చుకున్నాం!"
    },
    {
      question: "ప్రకృతి వైపరీత్యాల సమయంలో అత్యంత ముఖ్యమైన విషయం ఏది?",
      english:  "What is most important during a natural disaster?",
      options:  ["ఫోన్ వీడియో తీయడం / Taking phone videos", "సురక్షితంగా ఉండడం / Staying safe", "వేగంగా పరిగెత్తడం / Running fast", "ఒంటరిగా ఉండడం / Staying alone"],
      correctIndex: 1,
      explanation: "ప్రకృతి వైపరీత్యాల సమయంలో మన సేఫ్టీ అత్యంత ముఖ్యం. During any natural disaster, staying safe is always the top priority!"
    },
    {
      question: "భూకంపం, వరద, అగ్నిపర్వతం ఇవన్నీ ఏమని పిలుస్తారు?",
      english:  "Earthquake, flood, and volcano are all called what?",
      options:  ["మానవ నిర్మిత విపత్తులు / Man-made disasters", "ప్రకృతి వైపరీత్యాలు / Natural disasters", "వాతావరణ మార్పులు / Climate changes", "సముద్ర పర్వాలు / Ocean festivals"],
      correctIndex: 1,
      explanation: "భూకంపం, వరదలు, అగ్నిపర్వతం అన్నీ ప్రకృతి వైపరీత్యాలు (Natural Disasters). These are all Natural Disasters!"
    },
  ],
};

/* Per-topic queues — no repeat until all questions in a topic are shown */
const _queues = {};
const _lastQ  = {};

function _shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function _nextFromTopic(topicKey) {
  const pool = TOPICS[topicKey];
  if (!_queues[topicKey] || _queues[topicKey].length === 0) {
    let shuffled = _shuffle(pool);
    if (_lastQ[topicKey] && shuffled.length > 1) {
      while (shuffled[0] === _lastQ[topicKey]) shuffled = _shuffle(pool);
    }
    _queues[topicKey] = shuffled;
  }
  const q = _queues[topicKey].shift();
  _lastQ[topicKey] = q;
  return q;
}

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
        background:"rgba(232,93,4,0.15)", color:C.accent, fontWeight:800,
        border:"1px solid rgba(232,93,4,0.3)", fontSize:"inherit" }}>{k}</kbd>
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
        const v = vidRef.current;
        if (v) v.paused ? v.play() : v.pause();
      }
      if (e.key === " ") {
        e.preventDefault();
        const v = vidRef.current;
        if (v) v.paused ? v.play() : v.pause();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [watched, onDone]);

  const bg = "radial-gradient(ellipse at 0% 0%,#fff3e0,transparent 50%),radial-gradient(ellipse at 100% 100%,#fce4ec,transparent 50%),#fff8f0";

  return (
    <div style={{ width:"100%", height:"100%", overflowY:"auto", background:bg,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(16px,3vh,40px) clamp(16px,3vw,48px)", gap:"clamp(12px,2vh,20px)",
      fontFamily:"'Nunito',sans-serif" }}>

      <div style={{ textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:6 }}>
          <span style={{ fontSize:"clamp(1.6rem,3vw,2.5rem)" }}>🌋</span>
          <span style={{ fontSize:"clamp(1.6rem,3vw,2.5rem)" }}>🌊</span>
          <span style={{ fontSize:"clamp(1.6rem,3vw,2.5rem)" }}>🏔️</span>
        </div>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", margin:"0 0 6px",
          fontSize:"clamp(1.5rem,3.2vw,2.8rem)", fontWeight:700,
          background:"linear-gradient(135deg,#e85d04,#dc2626,#f59e0b)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          ప్రకృతి వైపరీత్యాలు
        </h1>
        <p style={{ color:"#e85d04", fontSize:"clamp(.75rem,1.1vw,.95rem)", fontWeight:700,
          letterSpacing:".5px", margin:"0 0 4px" }}>Natural Disasters — Watch & Learn</p>
        <p style={{ color:C.muted, fontSize:"clamp(.72rem,1vw,.88rem)", fontWeight:600 }}>
          Watch the full video, then take the quiz! • వీడియో చూసి క్విజ్ తీసుకోండి!
        </p>
      </div>

      <div style={{ width:"100%", maxWidth:820, position:"relative" }}>
        <div style={{ position:"absolute", inset:-3, borderRadius:22,
          background:"linear-gradient(135deg,#e85d04,#dc2626,#f59e0b)",
          opacity:playing?0.45:0.2, filter:"blur(14px)", zIndex:0, transition:"opacity .6s" }} />
        <div style={{ position:"relative", zIndex:1, borderRadius:18, overflow:"hidden",
          border:`2.5px solid ${playing?"rgba(232,93,4,.6)":"rgba(232,93,4,.2)"}`,
          background:"#000", boxShadow:"0 16px 60px rgba(0,0,0,.2)", transition:"border-color .4s" }}>
          {vidErr ? (
            <div style={{ width:"100%", height:220, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:10,
              background:"#fff8f0", color:C.muted, padding:24, textAlign:"center" }}>
              <span style={{ fontSize:"2.5rem" }}>🌋</span>
              <div style={{ fontWeight:800, color:C.text }}>Video file not found</div>
              <div style={{ fontSize:"0.84rem", lineHeight:1.6, maxWidth:400 }}>
                Place your video at <code style={{ background:"rgba(232,93,4,.12)",
                  padding:"2px 8px", borderRadius:5, color:C.accent }}>
                  {VIDEO_SRC}</code>
              </div>
            </div>
          ) : (
            <video ref={vidRef} src={VIDEO_SRC} controls controlsList="nodownload"
              style={{ width:"100%", display:"block", maxHeight:"52vh", background:"#000" }}
              playsInline preload="metadata" />
          )}
          <div style={{ height:5, background:"rgba(0,0,0,.08)" }}>
            <div style={{ height:"100%", width:`${pct*100}%`,
              background:"linear-gradient(90deg,#e85d04,#dc2626,#f59e0b)",
              transition:"width .4s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
        <div style={{ padding:"8px 18px", borderRadius:999, fontWeight:700,
          fontSize:"clamp(.72rem,1vw,.92rem)", display:"flex", alignItems:"center", gap:6,
          background:"#ffffffdb", border:`1px solid ${C.border}`, color:C.muted }}>
          <span>{playing?"▶️":"⏸️"}</span><span>{Math.round(pct*100)}% చూశారు / watched</span>
        </div>
        <div style={{ padding:"8px 18px", borderRadius:999, fontWeight:700,
          fontSize:"clamp(.72rem,1vw,.92rem)", display:"flex", alignItems:"center", gap:6,
          background:watched?"rgba(5,150,105,.12)":"#ffffffdb",
          border:`1px solid ${watched?C.correct:C.border}`,
          color:watched?C.correct:C.muted,
          boxShadow:watched?"0 0 18px rgba(5,150,105,.2)":"none", transition:"all .4s" }}>
          <span>{watched?"✅":"🔒"}</span>
          <span>{watched?"క్విజ్ అన్‌లాక్! Quiz Unlocked!":"పూర్తి చేయండి / Finish to unlock"}</span>
        </div>
      </div>

      <button disabled={!watched} onClick={() => watched && onDone()}
        onMouseEnter={() => watched && setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ padding:"clamp(11px,1.6vh,18px) clamp(32px,5vw,64px)",
          fontSize:"clamp(.9rem,1.4vw,1.15rem)", fontWeight:800, borderRadius:999,
          border:"none", fontFamily:"'Nunito',sans-serif",
          cursor:watched?"pointer":"not-allowed",
          background:watched?"linear-gradient(135deg,#e85d04,#dc2626)":"rgba(0,0,0,.08)",
          color:watched?"#fff":C.muted,
          boxShadow:watched?hover?`0 0 0 4px rgba(232,93,4,.35),0 8px 32px rgba(232,93,4,.45)`:`0 6px 24px rgba(232,93,4,.4)`:"none",
          transform:watched&&hover?"scale(1.06) translateY(-2px)":"scale(1)",
          transition:"all .22s cubic-bezier(.34,1.56,.64,1)" }}>
        {watched ? "🚀 క్విజ్ ప్రారంభించండి / Start Quiz" : "⏳ వీడియో చూడండి / Watch Video First"}
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
      background:"radial-gradient(ellipse at 50% 50%,#fff3e0,#fff8f0)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSpin{to{transform:rotate(360deg)}}@keyframes vqPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ position:"relative", width:90, height:90 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ position:"absolute", inset:i*10, borderRadius:"50%",
            border:`2.5px solid ${C.accentLt}`, opacity:.4-i*.1,
            animation:`vqSpin ${1+i*.28}s linear infinite` }} />
        ))}
        <div style={{ position:"absolute", inset:28, borderRadius:"50%",
          background:"linear-gradient(135deg,#e85d04,#dc2626)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>🌋</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:C.text,
          marginBottom:6, fontFamily:"'Fredoka One',cursive" }}>క్విజ్ లోడ్ అవుతోంది{dots}</div>
        <div style={{ color:C.muted, fontSize:"0.9rem", fontWeight:600 }}>ప్రశ్నలు సిద్ధం చేస్తున్నాం… / Preparing your questions…</div>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {["🌋","🌊","🏔️","⚡","🔥"].map((em,i) => (
          <div key={i} style={{ fontSize:"1.3rem",
            animation:`vqPulse 1.2s ease infinite`, animationDelay:`${i*0.15}s` }}>{em}</div>
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

  // Topic icons for each question
  const topicKeys = Object.keys(TOPICS);
  const topicIcons = ["🏔️","🪨","🌊","🚗","🌋","🎓","🌍"];
  const currentIcon = topicIcons[qIdx] || "❓";

  return (
    <div style={{ width:"100%", height:"100%", overflowY:"auto",
      background:"radial-gradient(ellipse at 0% 0%,#fff3e0,transparent 50%),radial-gradient(ellipse at 100% 100%,#fce4ec,transparent 50%),#fff8f0",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(14px,2.5vh,36px) clamp(14px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}@keyframes vqPop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>

      <div style={{ width:"100%", maxWidth:680 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:"clamp(10px,1.8vh,20px)", flexWrap:"wrap", gap:10 }}>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
            fontSize:"clamp(1.2rem,2.5vw,1.8rem)", fontWeight:700,
            background:"linear-gradient(135deg,#e85d04,#dc2626)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {currentIcon} ప్రకృతి వైపరీత్యాలు క్విజ్
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
              background:"linear-gradient(90deg,#e85d04,#dc2626)",
              transition:"width .5s ease", borderRadius:4 }} />
          </div>
          <span style={{ color:C.muted, fontSize:"clamp(.7rem,.9vw,.85rem)", fontWeight:700 }}>
            {Math.round(progPct)}%
          </span>
        </div>

        <div style={{ background:C.card, borderRadius:"clamp(14px,2vw,22px)",
          padding:"clamp(18px,2.8vh,28px) clamp(16px,2.5vw,26px) clamp(14px,2.2vh,22px)",
          border:"2px solid rgba(232,93,4,.12)", boxShadow:"0 6px 32px rgba(0,0,0,.1)",
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
                    background:st==="correct"?C.correctBg:st==="wrong"?C.wrongBg:st==="dim"?"rgba(0,0,0,.03)":isFoc?"rgba(232,93,4,.1)":"rgba(255,255,255,.7)",
                    color:st==="dim"?"#bbb":st==="correct"?C.correct:st==="wrong"?C.wrong:C.text,
                    display:"flex", alignItems:"center", gap:"clamp(8px,1vw,12px)",
                    fontSize:"clamp(.8rem,1.2vw,.95rem)", fontWeight:600,
                    fontFamily:"'Nunito',sans-serif", cursor:answered?"default":"pointer",
                    textAlign:"left", outline:"none", lineHeight:1.4,
                    transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                    transform:isFoc?"translateX(6px)":"none",
                    boxShadow:st==="correct"?"0 0 16px rgba(5,150,105,.2)":st==="wrong"?"0 0 10px rgba(220,38,38,.15)":isFoc?"0 0 0 2px rgba(232,93,4,.25)":"none",
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
                {isCorrect?"శభాష్! Correct!":"తప్పు! Wrong!"}
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
  const msg   = pct===100?"పర్ఫెక్ట్! / Perfect!":pct>=80?"అద్భుతం! / Excellent!":pct>=60?"శభాష్! / Good Job!":pct>=40?"మళ్ళీ చదవండి! / Keep Learning!":"ప్రయత్నించండి! / Nice Try!";
  const col   = pct>=80?C.correct:pct>=50?C.gold:C.wrong;

  useEffect(() => {
    const h=e=>{ if(e.key==="Enter"||e.key===" "){e.preventDefault();onRestart();} };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[onRestart]);

  return (
    <div style={{ width:"100%", height:"100%", overflowY:"auto",
      background:"radial-gradient(ellipse at 50% 0%,#fff3e0,transparent 50%),#fff8f0",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(20px,3vh,48px) clamp(16px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif", gap:"clamp(14px,2vh,22px)" }}>
      <style>{`@keyframes vqBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      <div style={{ fontSize:"clamp(3.5rem,8vw,5.5rem)", filter:`drop-shadow(0 0 20px ${col})`,
        animation:"vqBounce 2s ease-in-out infinite" }}>{emoji}</div>

      <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
        fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700,
        background:"linear-gradient(135deg,#e85d04,#f59e0b)",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{msg}</h2>

      <div style={{ display:"inline-flex", alignItems:"baseline", gap:8,
        padding:"clamp(12px,2vh,18px) clamp(28px,4vw,48px)", borderRadius:20,
        background:C.card, border:`2.5px solid ${col}44`,
        boxShadow:`0 0 32px ${col}18,0 6px 24px rgba(0,0,0,.08)` }}>
        <span style={{ fontSize:"clamp(2.5rem,7vw,4rem)", fontWeight:900, color:col }}>{score}</span>
        <span style={{ fontSize:"clamp(1.3rem,3vw,2rem)", color:C.muted }}>/ {answers.length}</span>
        <span style={{ fontSize:"clamp(.88rem,1.2vw,1rem)", color:C.muted, marginLeft:4 }}>({pct}%)</span>
      </div>

      {/* Disaster safety reminder */}
      <div style={{ padding:"12px 20px", borderRadius:14, background:"rgba(232,93,4,.08)",
        border:"1px solid rgba(232,93,4,.2)", maxWidth:520, textAlign:"center",
        fontSize:"clamp(.75rem,1vw,.88rem)", color:"#b45309", fontWeight:700, lineHeight:1.6 }}>
        🛡️ గుర్తుంచుకో: Drop, Cover, Hold 🏔️ | వరద నీటిలో నడవకు 🌊 | సేఫ్టీ జోన్ లో ఉండు 🌋
      </div>

      <div style={{ width:"100%", maxWidth:600, display:"flex", flexDirection:"column",
        gap:8, maxHeight:"28vh", overflowY:"auto", paddingRight:4 }}>
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
          background:"linear-gradient(135deg,#e85d04,#dc2626)",
          color:"#fff", fontWeight:800, fontFamily:"'Nunito',sans-serif",
          fontSize:"clamp(.9rem,1.4vw,1.15rem)",
          boxShadow:hover?`0 0 0 4px rgba(232,93,4,.3),0 10px 36px rgba(232,93,4,.5)`:`0 6px 28px rgba(232,93,4,.4)`,
          transform:hover?"scale(1.07) translateY(-2px)":"scale(1)",
          transition:"all .22s cubic-bezier(.34,1.56,.64,1)", outline:"none" }}>
        🔄 మళ్ళీ ఆడండి / Play Again
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════════════ */
export default function NaturalDisastersQuiz() {
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