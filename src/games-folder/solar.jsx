import { useState, useEffect, useRef, useCallback } from "react";

// Updated to match your exact file name and path

const VIDEO_SRC = "https://games.vrplay.in/videos/Dulipudi%20Eekshitha%20Sai_s%20Video%20-%20Jun%2018,%202026.mp4";

const C = {
  accent:"#4338ca", accentLt:"#818cf8",
  gold:"#f59e0b",
  correct:"#059669", correctBg:"rgba(5,150,105,0.14)",
  wrong:"#dc2626",   wrongBg:"rgba(220,38,38,0.12)",
  text:"#1a1a1a", muted:"#6b7280",
  card:"#ffffffed", border:"rgba(0,0,0,0.08)",
};

/* ─────────────────────────────────────
────────────────────────────────────
   Solar System Quiz — Questions grouped by topic (Sun + each planet)
   Each session picks exactly ONE random question from each topic group,
   so you NEVER get two questions about the same body in one quiz.
───────────────────────────────────────────────────────────────────────── */
const TOPICS = {

  sun: [
    {
      question: "సౌర వ్యవస్థ మధ్యలో ఏది ఉంటుంది?",
      english:  "What is at the center of the Solar System?",
      options:  ["భూమి / Earth", "సూర్యుడు / Sun", "చంద్రుడు / Moon", "అంగారకుడు / Mars"],
      correctIndex: 1,
      explanation: "సరైనది! సూర్యుడు సౌర వ్యవస్థ మధ్యలో ఉంటాడు, అన్ని గ్రహాలు దాని చుట్టూ తిరుగుతాయి — Correct! The Sun sits at the center, and every planet orbits around it."
    },
    {
      question: "సూర్యుడు అసలు ఏమిటి?",
      english:  "What is the Sun, really?",
      options:  ["ఒక గ్రహం / A planet", "ఒక నక్షత్రం / A star", "ఒక ఉపగ్రహం / A moon", "ఒక తోకచుక్క / A comet"],
      correctIndex: 1,
      explanation: "సరైనది! సూర్యుడు వేడి గ్యాస్‌తో మండుతున్న నక్షత్రం — Correct! The Sun is a star made of hot, glowing gas."
    },
    {
      question: "సూర్యుడు వేడితో పాటు భూమికి ఇంకా ఏమి ఇస్తాడు?",
      english:  "Along with heat, what else does the Sun give Earth?",
      options:  ["నీరు / Water", "వెలుతురు / Light", "శబ్దం / Sound", "మంచు / Snow"],
      correctIndex: 1,
      explanation: "సరైనది! సూర్యుడి వెలుతురు, వేడి భూమిపై జీవానికి అవసరం — Correct! Sunlight and heat are essential for life on Earth."
    },
  ],

  mercury: [
    {
      question: "సూర్యుడికి అత్యంత దగ్గరగా ఉన్న గ్రహం ఏది?",
      english:  "Which planet is closest to the Sun?",
      options:  ["శుక్రుడు / Venus", "బుధుడు / Mercury", "భూమి / Earth", "అంగారకుడు / Mars"],
      correctIndex: 1,
      explanation: "సరైనది! బుధుడు సూర్యుడికి అత్యంత దగ్గరగా ఉన్న గ్రహం — Correct! Mercury is the closest planet to the Sun."
    },
    {
      question: "పరిమాణంలో బుధుడు ఎలా ఉంటుంది?",
      english:  "How does Mercury compare in size to other planets?",
      options:  ["అతిపెద్దది / The largest", "అతిచిన్నది / The smallest", "భూమి అంత పెద్దది / Same size as Earth", "రెండవ అతిపెద్దది / Second largest"],
      correctIndex: 1,
      explanation: "సరైనది! బుధుడు సౌర వ్యవస్థలో అతిచిన్న గ్రహం — Correct! Mercury is the smallest planet in the solar system."
    },
    {
      question: "బుధుడిపై వాతావరణం (గాలి పొర) ఎలా ఉంటుంది?",
      english:  "What is Mercury's atmosphere like?",
      options:  ["చాలా దట్టంగా / Very thick", "దాదాపు లేదు / Almost none", "మేఘాలతో నిండి / Full of clouds", "నీటి ఆవిరితో / Made of water vapor"],
      correctIndex: 1,
      explanation: "సరైనది! బుధుడికి వాతావరణం దాదాపు లేదు, అందుకే ఉష్ణోగ్రతలు తీవ్రంగా మారుతాయి — Correct! Mercury has almost no atmosphere, so its temperature swings wildly."
    },
  ],

  venus: [
    {
      question: "సౌర వ్యవస్థలో అత్యంత వేడిగా ఉండే గ్రహం ఏది?",
      english:  "Which is the hottest planet in the solar system?",
      options:  ["బుధుడు / Mercury", "శుక్రుడు / Venus", "అంగారకుడు / Mars", "బృహస్పతి / Jupiter"],
      correctIndex: 1,
      explanation: "సరైనది! శుక్రుడి దట్టమైన వాతావరణం వేడిని బంధించి దానిని అత్యంత వేడి గ్రహంగా చేస్తుంది — Correct! Venus's thick atmosphere traps heat, making it the hottest planet, even hotter than Mercury."
    },
    {
      question: "పరిమాణంలో పోలిక వల్ల శుక్రుడిని ఏమని పిలుస్తారు?",
      english:  "Because of its similar size, Venus is often called Earth's what?",
      options:  ["సోదరి గ్రహం / Sister planet", "శత్రు గ్రహం / Enemy planet", "ఉపగ్రహం / Moon", "నీడ గ్రహం / Shadow planet"],
      correctIndex: 0,
      explanation: "సరైనది! శుక్రుడు పరిమాణంలో భూమిని పోలి ఉండటం వల్ల దానిని 'సోదరి గ్రహం' అని పిలుస్తారు — Correct! Venus is similar in size to Earth, so it's nicknamed Earth's 'sister planet.'"
    },
    {
      question: "శుక్రుడి తిరుగుడులో విచిత్రమైనది ఏమిటి?",
      english:  "What's unusual about how Venus spins?",
      options:  ["వ్యతిరేక దిక్కులో తిరుగుతుంది / It spins backward", "అసలు తిరగదు / It doesn't spin at all", "అత్యంత వేగంగా తిరుగుతుంది / It spins the fastest", "దానికి అక్షమే లేదు / It has no axis"],
      correctIndex: 0,
      explanation: "సరైనది! శుక్రుడు చాలా గ్రహాల కంటే వ్యతిరేక దిక్కులో తిరుగుతుంది — Correct! Venus rotates in the opposite direction to most other planets."
    },
  ],

  earth: [
    {
      question: "మనం నివసించే గ్రహం ఏది?",
      english:  "Which planet do we live on?",
      options:  ["అంగారకుడు / Mars", "భూమి / Earth", "శుక్రుడు / Venus", "బృహస్పతి / Jupiter"],
      correctIndex: 1,
      explanation: "సరైనది! మనం భూమిపై నివసిస్తాము, ఇది జీవం ఉన్నట్లు తెలిసిన ఒకే ఒక గ్రహం — Correct! We live on Earth, the only known planet with life."
    },
    {
      question: "భూమిని 'నీలి గ్రహం' అని ఎందుకు పిలుస్తారు?",
      english:  "Why is Earth called the 'Blue Planet'?",
      options:  ["నీలి రాళ్ల వల్ల / Because of blue rocks", "సముద్రాలు/నీరు కప్పి ఉండటం వల్ల / Because oceans cover most of it", "చల్లగా ఉండటం వల్ల / Because it's cold", "నీలి ఆకాశం వల్ల మాత్రమే / Just because of the blue sky"],
      correctIndex: 1,
      explanation: "సరైనది! భూమిలో దాదాపు 71% నీరు ఉంది, అందుకే అది అంతరిక్షం నుండి నీలంగా కనిపిస్తుంది — Correct! About 71% of Earth is covered in water, making it look blue from space."
    },
    {
      question: "భూమికి ఎన్ని చంద్రులు (ఉపగ్రహాలు) ఉన్నాయి?",
      english:  "How many moons does Earth have?",
      options:  ["ఏదీ లేదు / None", "ఒకటి / One", "రెండు / Two", "చాలా / Many"],
      correctIndex: 1,
      explanation: "సరైనది! భూమికి ఒక సహజ చంద్రుడు ఉన్నాడు — Correct! Earth has one natural moon."
    },
  ],

  mars: [
    {
      question: "ఏ గ్రహాన్ని 'ఎరుపు గ్రహం' అని పిలుస్తారు?",
      english:  "Which planet is called the 'Red Planet'?",
      options:  ["శుక్రుడు / Venus", "అంగారకుడు / Mars", "బుధుడు / Mercury", "శని / Saturn"],
      correctIndex: 1,
      explanation: "సరైనది! అంగారకుడు ఎరుపు రంగులో కనిపిస్తాడు, అందుకే దానిని ఎరుపు గ్రహం అని పిలుస్తారు — Correct! Mars looks red, so it's nicknamed the Red Planet."
    },
    {
      question: "అంగారకుడు ఎరుపు రంగులో ఎందుకు కనిపిస్తాడు?",
      english:  "Why does Mars appear red?",
      options:  ["మట్టిలో ఐరన్ ఆక్సైడ్ (తుప్పు) వల్ల / Because of iron oxide (rust) in its soil", "ఎరుపు సముద్రాల వల్ల / Because of red oceans", "ఎరుపు మేఘాల వల్ల / Because of red clouds", "సూర్యకాంతి ప్రతిబింబం వల్ల / Because of reflected sunlight"],
      correctIndex: 0,
      explanation: "సరైనది! అంగారకుడి మట్టిలో ఉన్న ఐరన్ ఆక్సైడ్ (తుప్పు) దానికి ఎరుపు రంగును ఇస్తుంది — Correct! Iron oxide (rust) in Mars's soil gives it that red color."
    },
    {
      question: "శాస్త్రవేత్తలు మానవులను పంపాలని ఆలోచిస్తున్న గ్రహం ఏది?",
      english:  "Which planet are scientists hoping to send humans to explore?",
      options:  ["బృహస్పతి / Jupiter", "అంగారకుడు / Mars", "నెప్ట్యూన్ / Neptune", "శని / Saturn"],
      correctIndex: 1,
      explanation: "సరైనది! అంగారకుడు భూమిని కొంత పోలి ఉండటం వల్ల భవిష్యత్ మానవ యాత్రలకు ముఖ్య లక్ష్యంగా ఉంది — Correct! Mars is a top target for future human exploration because it's somewhat similar to Earth."
    },
  ],

  jupiter: [
    {
      question: "సౌర వ్యవస్థలో అతిపెద్ద గ్రహం ఏది?",
      english:  "Which is the biggest planet in the solar system?",
      options:  ["శని / Saturn", "బృహస్పతి / Jupiter", "భూమి / Earth", "నెప్ట్యూన్ / Neptune"],
      correctIndex: 1,
      explanation: "సరైనది! బృహస్పతి సౌర వ్యవస్థలో అతిపెద్ద గ్రహం — Correct! Jupiter is the biggest planet in the solar system."
    },
    {
      question: "బృహస్పతిపై ఉన్న పెద్ద తుఫానును ఏమని పిలుస్తారు?",
      english:  "What is the giant storm on Jupiter called?",
      options:  ["గ్రేట్ రెడ్ స్పాట్ / The Great Red Spot", "బ్లూ ఐ / The Blue Eye", "డార్క్ వోర్టెక్స్ / The Dark Vortex", "వైట్ రింగ్ / The White Ring"],
      correctIndex: 0,
      explanation: "సరైనది! గ్రేట్ రెడ్ స్పాట్ అనేది బృహస్పతిపై వందల ఏళ్లుగా కొనసాగుతున్న పెద్ద తుఫాను — Correct! The Great Red Spot is a giant storm that has been raging on Jupiter for centuries."
    },
    {
      question: "బృహస్పతికి దాదాపు ఎన్ని ఉపగ్రహాలు (చంద్రులు) ఉన్నాయి?",
      english:  "About how many moons does Jupiter have?",
      options:  ["ఒకటి / One", "నాలుగు / Four", "డజన్ల కొద్దీ (80+) / Dozens (80+)", "ఏదీ లేదు / None"],
      correctIndex: 2,
      explanation: "సరైనది! బృహస్పతికి 90 కంటే ఎక్కువ ఉపగ్రహాలు కనుగొనబడ్డాయి — Correct! Jupiter has more than 90 known moons."
    },
  ],

  saturn: [
    {
      question: "తన చుట్టూ అందమైన వలయాలు (రింగులు) కలిగిన గ్రహం ఏది?",
      english:  "Which planet is famous for its beautiful rings?",
      options:  ["బృహస్పతి / Jupiter", "శని / Saturn", "యురేనస్ / Uranus", "అంగారకుడు / Mars"],
      correctIndex: 1,
      explanation: "సరైనది! శని గ్రహం దాని విశాలమైన, అందమైన వలయాల వల్ల ప్రసిద్ధి చెందింది — Correct! Saturn is famous for its wide, beautiful rings."
    },
    {
      question: "శని వలయాలు ఎక్కువగా దేనితో తయారయ్యాయి?",
      english:  "What are Saturn's rings mostly made of?",
      options:  ["రాయి, లోహం / Rock and metal", "మంచు, రాయి కణాలు / Ice and rock particles", "ద్రవ నీరు / Liquid water", "గ్యాస్ మేఘాలు / Gas clouds"],
      correctIndex: 1,
      explanation: "సరైనది! శని వలయాలు మంచు మరియు రాయి కణాలతో తయారయ్యాయి — Correct! Saturn's rings are made mostly of ice and rock particles."
    },
    {
      question: "శని ఏ రకమైన గ్రహం?",
      english:  "What type of planet is Saturn?",
      options:  ["రాతి గ్రహం / Rocky planet", "వాయు గ్రహం (గ్యాస్ జెయింట్) / Gas giant", "మంచు గ్రహం / Ice planet", "మరుగుజ్జు గ్రహం / Dwarf planet"],
      correctIndex: 1,
      explanation: "సరైనది! శని ఒక వాయు గ్రహం, ఎక్కువగా హైడ్రోజన్, హీలియంతో తయారైనది — Correct! Saturn is a gas giant, made mostly of hydrogen and helium."
    },
  ],

  uranus: [
    {
      question: "ఏ గ్రహం దాని పక్కకు వాలి, దొర్లుతున్నట్టు తిరుగుతుంది?",
      english:  "Which planet rotates almost on its side, like it's tipped over?",
      options:  ["యురేనస్ / Uranus", "అంగారకుడు / Mars", "బుధుడు / Mercury", "భూమి / Earth"],
      correctIndex: 0,
      explanation: "సరైనది! యురేనస్ అక్షం దాదాపు 98 డిగ్రీలు వాలి ఉంటుంది, అందుకే అది పక్కకు దొర్లుతున్నట్టు తిరుగుతుంది — Correct! Uranus's axis is tilted about 98 degrees, so it rolls on its side as it spins."
    },
    {
      question: "యురేనస్ ఏ రంగులో కనిపిస్తుంది?",
      english:  "What color does Uranus appear?",
      options:  ["ఎరుపు / Red", "లేత నీలం-ఆకుపచ్చ / Pale blue-green", "పసుపు / Yellow", "నారింజ / Orange"],
      correctIndex: 1,
      explanation: "సరైనది! యురేనస్ వాతావరణంలోని మిథేన్ దానికి లేత నీలం-ఆకుపచ్చ రంగును ఇస్తుంది — Correct! Methane in Uranus's atmosphere gives it a pale blue-green color."
    },
    {
      question: "యురేనస్ ఏ గ్రహాల వర్గానికి చెందినది?",
      english:  "What category of planet is Uranus?",
      options:  ["రాతి గ్రహం / Rocky planet", "మంచు జెయింట్ / Ice giant", "మరుగుజ్జు గ్రహం / Dwarf planet", "నక్షత్రం / A star"],
      correctIndex: 1,
      explanation: "సరైనది! యురేనస్, నెప్ట్యూన్‌లను 'మంచు జెయింట్స్' అని పిలుస్తారు — Correct! Uranus and Neptune are known as 'ice giants.'"
    },
  ],

  neptune: [
    {
      question: "సూర్యుడికి అత్యంత దూరంలో ఉన్న గ్రహం ఏది?",
      english:  "Which planet is farthest from the Sun?",
      options:  ["యురేనస్ / Uranus", "నెప్ట్యూన్ / Neptune", "శని / Saturn", "ప్లూటో / Pluto"],
      correctIndex: 1,
      explanation: "సరైనది! నెప్ట్యూన్ సూర్యుడికి అత్యంత దూరంలో ఉన్న గ్రహం — Correct! Neptune is the farthest planet from the Sun."
    },
    {
      question: "నెప్ట్యూన్ ఏ రంగులో కనిపిస్తుంది?",
      english:  "What color is Neptune?",
      options:  ["లోతైన నీలం / Deep blue", "ప్రకాశవంతమైన ఎరుపు / Bright red", "ఆకుపచ్చ / Green", "పసుపు / Yellow"],
      correctIndex: 0,
      explanation: "సరైనది! వాతావరణంలోని మిథేన్ వల్ల నెప్ట్యూన్ లోతైన నీలం రంగులో కనిపిస్తుంది — Correct! Methane in its atmosphere gives Neptune its deep blue color."
    },
    {
      question: "నెప్ట్యూన్‌పై గాలులు ఎలా ఉంటాయి?",
      english:  "What are the winds like on Neptune?",
      options:  ["నెమ్మదిగా, శాంతంగా / Calm and slow", "సౌర వ్యవస్థలోనే అత్యంత వేగమైనవి / The fastest in the solar system", "గాలులే లేవు / No winds at all", "రాత్రి మాత్రమే వీస్తాయి / Only blow at night"],
      correctIndex: 1,
      explanation: "సరైనది! నెప్ట్యూన్‌పై గాలులు గంటకు 2000 కిమీ వేగంతో వీస్తాయి, ఇవి సౌర వ్యవస్థలోనే అత్యంత వేగమైనవి — Correct! Neptune's winds can reach 2,000 km/h, the fastest in the solar system."
    },
  ],
};

/* Pick exactly ONE random question from each topic — totally different questions */
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

/* Returns one question per topic (Sun + 8 planets), never the same as last time */
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
        background:"rgba(67,56,202,0.15)", color:C.accent, fontWeight:800,
        border:"1px solid rgba(67,56,202,0.3)", fontSize:"inherit" }}>{k}</kbd>
      <span style={{ color:C.muted }}>{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE 1 — VIDEO
══════════════════════════════════════════════════════════════════════════ */
function VideoPage({ onDone }) {
  const vidRef = useRef(null);
  const [pct,     setPct]    = useState(0);
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

  const bg = "radial-gradient(ellipse at 0% 0%,#e0e7ff,transparent 50%),radial-gradient(ellipse at 100% 100%,#cffafe,transparent 50%),#f7f8ff";

  return (
    <div style={{ width:"100%", height:"100%", overflowY:"auto", background:bg,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(16px,3vh,40px) clamp(16px,3vw,48px)", gap:"clamp(12px,2vh,20px)",
      fontFamily:"'Nunito',sans-serif" }}>

      <div style={{ textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", margin:"0 0 6px",
          fontSize:"clamp(1.6rem,3.5vw,3rem)", fontWeight:600,
          background:"linear-gradient(135deg,#4338ca,#0891b2,#f59e0b)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          🪐 Solar System Adventure
        </h1>
        <p style={{ color:C.muted, fontSize:"clamp(.78rem,1.1vw,1rem)", fontWeight:600 }}>
          Watch the educational video, then take the quiz!
        </p>
      </div>

      <div style={{ width:"100%", maxWidth:820, position:"relative" }}>
        <div style={{ position:"absolute", inset:-3, borderRadius:22,
          background:"linear-gradient(135deg,#4338ca,#0891b2,#f59e0b)",
          opacity:playing?0.45:0.2, filter:"blur(14px)", zIndex:0, transition:"opacity .6s" }} />
        <div style={{ position:"relative", zIndex:1, borderRadius:18, overflow:"hidden",
          border:`2.5px solid ${playing?"rgba(67,56,202,.6)":"rgba(67,56,202,.18)"}`,
          background:"#000", boxShadow:"0 16px 60px rgba(0,0,0,.2)", transition:"border-color .4s" }}>
          {vidErr ? (
            <div style={{ width:"100%", height:220, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:10,
              background:"#eef2ff", color:C.muted, padding:24, textAlign:"center" }}>
              <span style={{ fontSize:"2.5rem" }}>📁</span>
              <div style={{ fontWeight:800, color:C.text }}>Video file not found</div>
              <div style={{ fontSize:"0.84rem", lineHeight:1.6, maxWidth:400 }}>
                Make sure the file exists at <code style={{ background:"rgba(67,56,202,.12)",
                  padding:"2px 8px", borderRadius:5, color:C.accent }}>
                 https://games.vrplay.in/videos/Dulipudi%20Eekshitha%20Sai_s%20Video%20-%20Jun%2018,%202026.mp4</code> and that the import path matches it.
              </div>
            </div>
          ) : (
            <video ref={vidRef} src={VIDEO_SRC} controls controlsList="nodownload"
              style={{ width:"100%", display:"block", maxHeight:"52vh", background:"#000" }}
              playsInline preload="metadata" />
          )}
          <div style={{ height:5, background:"rgba(0,0,0,.08)" }}>
            <div style={{ height:"100%", width:`${pct*100}%`,
              background:"linear-gradient(90deg,#4338ca,#0891b2,#f59e0b)",
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
          background:watched?"linear-gradient(135deg,#4338ca,#0891b2)":"rgba(0,0,0,.08)",
          color:watched?"#fff":C.muted,
          boxShadow:watched?hover?`0 0 0 4px rgba(67,56,202,.35),0 8px 32px rgba(67,56,202,.45)`:`0 6px 24px rgba(67,56,202,.4)`:"none",
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
      background:"radial-gradient(ellipse at 50% 50%,#e0e7ff,#f7f8ff)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSpin{to{transform:rotate(360deg)}}@keyframes vqPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ position:"relative", width:90, height:90 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ position:"absolute", inset:i*10, borderRadius:"50%",
            border:`2.5px solid ${C.accentLt}`, opacity:.4-i*.1,
            animation:`vqSpin ${1+i*.28}s linear infinite` }} />
        ))}
        <div style={{ position:"absolute", inset:28, borderRadius:"50%",
          background:"linear-gradient(135deg,#4338ca,#0891b2)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>🪐</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:C.text,
          marginBottom:6, fontFamily:"'Fredoka One',cursive" }}>Loading Quiz{dots}</div>
        <div style={{ color:C.muted, fontSize:"0.9rem", fontWeight:600 }}>Preparing your space questions…</div>
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
  const [qIdx,     setQIdx]    = useState(0);
  const [focused,  setFocused] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers,  setAnswers] = useState([]);
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
      background:"radial-gradient(ellipse at 0% 0%,#e0e7ff,transparent 50%),radial-gradient(ellipse at 100% 100%,#cffafe,transparent 50%),#f7f8ff",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(14px,2.5vh,36px) clamp(14px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}@keyframes vqPop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>

      <div style={{ width:"100%", maxWidth:680 }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:"clamp(10px,1.8vh,20px)", flexWrap:"wrap", gap:10 }}>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
            fontSize:"clamp(1.3rem,2.8vw,2rem)", fontWeight:700,
            background:"linear-gradient(135deg,#4338ca,#0891b2)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            🪐 Quiz Time
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
              background:"linear-gradient(90deg,#4338ca,#0891b2)",
              transition:"width .5s ease", borderRadius:4 }} />
          </div>
          <span style={{ color:C.muted, fontSize:"clamp(.7rem,.9vw,.85rem)", fontWeight:700 }}>
            {Math.round(progPct)}%
          </span>
        </div>

        <div style={{ background:C.card, borderRadius:"clamp(14px,2vw,22px)",
          padding:"clamp(18px,2.8vh,28px) clamp(16px,2.5vw,26px) clamp(14px,2.2vh,22px)",
          border:"2px solid rgba(67,56,202,.12)", boxShadow:"0 6px 32px rgba(0,0,0,.1)",
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
                    background:st==="correct"?C.correctBg:st==="wrong"?C.wrongBg:st==="dim"?"rgba(0,0,0,.03)":isFoc?"rgba(67,56,202,.1)":"rgba(255,255,255,.7)",
                    color:st==="dim"?"#bbb":st==="correct"?C.correct:st==="wrong"?C.wrong:C.text,
                    display:"flex", alignItems:"center", gap:"clamp(8px,1vw,12px)",
                    fontSize:"clamp(.8rem,1.2vw,.95rem)", fontWeight:600,
                    fontFamily:"'Nunito',sans-serif", cursor:answered?"default":"pointer",
                    textAlign:"left", outline:"none", lineHeight:1.4,
                    transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                    transform:isFoc?"translateX(6px)":"none",
                    boxShadow:st==="correct"?"0 0 16px rgba(5,150,105,.2)":st==="wrong"?"0 0 10px rgba(220,38,38,.15)":isFoc?"0 0 0 2px rgba(67,56,202,.25)":"none",
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
      background:"radial-gradient(ellipse at 50% 0%,#e0e7ff,transparent 50%),#f7f8ff",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(20px,3vh,48px) clamp(16px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif", gap:"clamp(14px,2vh,22px)" }}>
      <style>{`@keyframes vqBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      <div style={{ fontSize:"clamp(3.5rem,8vw,5.5rem)", filter:`drop-shadow(0 0 20px ${col})`,
        animation:"vqBounce 2s ease-in-out infinite" }}>{emoji}</div>

      <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
        fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700,
        background:"linear-gradient(135deg,#4338ca,#f59e0b)",
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
          background:"linear-gradient(135deg,#4338ca,#0891b2)",
          color:"#fff", fontWeight:800, fontFamily:"'Nunito',sans-serif",
          fontSize:"clamp(.9rem,1.4vw,1.15rem)",
          boxShadow:hover?`0 0 0 4px rgba(67,56,202,.3),0 10px 36px rgba(67,56,202,.5)`:`0 6px 28px rgba(67,56,202,.4)`,
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
export default function SolarSystemQuizGame() {
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