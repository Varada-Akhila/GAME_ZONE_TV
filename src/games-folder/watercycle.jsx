import { useState, useEffect, useRef, useCallback } from "react";

const VIDEO_SRC = "https://games.vrplay.in/videos/Endless_Journey_of_Water.mp4";
const NUM_Q = 5;

const C = {
  accent:"#0891b2", accentLt:"#67e8f9",
  gold:"#f59e0b",
  correct:"#059669", correctBg:"rgba(5,150,105,0.14)",
  wrong:"#dc2626",   wrongBg:"rgba(220,38,38,0.12)",
  text:"#1a1a1a", muted:"#6b7280",
  card:"#ffffffed", border:"rgba(0,0,0,0.08)",
};

/* ─────────────────────────────────────────────────────────────────────────
   Endless Journey of Water Quiz — Questions grouped by topic
   Each session picks exactly ONE random question from each topic group,
   so you NEVER get two questions about the same thing in one quiz.
───────────────────────────────────────────────────────────────────────── */
const TOPICS = {

  earthWater: [
    {
      question: "భూమిపై నీటి గురించి ప్రత్యేకత ఏమిటి?",
      english:  "What is special about Earth's water?",
      options:  ["ప్రతిరోజు కొత్త నీరు సృష్టించబడుతుంది / New water is created every day", "అదే నీరు బిలియన్ల సంవత్సరాలుగా పునర్వినియోగం అవుతోంది / The same water has been recycled for billions of years", "ఉపయోగించిన తర్వాత నీరు శాశ్వతంగా అదృశ్యమవుతుంది / Water disappears forever once used", "సముద్రాలు మాత్రమే నీటిని పునర్వినియోగిస్తాయి / Only oceans recycle water"],
      correctIndex: 1,
      explanation: "సరైనది! డైనోసార్లు తాగిన అదే నీటి అణువులను నేడు మనం తాగుతున్నాం — Correct! We drink the very same water molecules dinosaurs once drank."
    },
    {
      question: "భూమిపై ఉన్న నీటిలో ఎంత శాతం ఉప్పునీరు (సముద్రాలు)?",
      english:  "What percentage of Earth's water is saltwater (oceans)?",
      options:  ["50%", "75%", "97%", "25%"],
      correctIndex: 2,
      explanation: "సరైనది! భూమిపై నీటిలో 97% ఉప్పునీరే — కేవలం 3% మాత్రమే మంచినీరు — Correct! 97% of Earth's water is saltwater; only about 3% is freshwater."
    },
    {
      question: "భూమిపై ఎక్కువ మంచినీరు ఎక్కడ లభిస్తుంది?",
      english:  "Where is most of Earth's freshwater found?",
      options:  ["నదులు మరియు సరస్సులు / Rivers and lakes", "హిమానీనదాలు మరియు భూగర్భజలాలు / Glaciers and groundwater", "మేఘాలు / Clouds", "సముద్రాలు / Oceans"],
      correctIndex: 1,
      explanation: "సరైనది! చాలా మంచినీరు హిమానీనదాలు మరియు భూగర్భజలాలలో నిల్వ ఉంటుంది — Correct! Most of Earth's freshwater is locked away in glaciers and groundwater."
    },
  ],

  evaporation: [
    {
      question: "బాష్పీభవనానికి (ఎవాపొరేషన్) కారణం ఏమిటి?",
      english:  "What causes evaporation?",
      options:  ["వెన్నెల / Moonlight", "సూర్యుని వేడి / The Sun's heat", "గాలి మాత్రమే / Wind alone", "వర్షం / Rain"],
      correctIndex: 1,
      explanation: "సరైనది! సూర్యుని వేడి ద్రవ నీటిని నీటి ఆవిరిగా మారుస్తుంది — Correct! The Sun's heat changes liquid water into water vapor."
    },
    {
      question: "బాష్పీభవన సమయంలో నీరు దేనిగా మారుతుంది?",
      english:  "During evaporation, water changes from a liquid into what?",
      options:  ["ఘన మంచు / Solid ice", "అదృశ్య వాయువు (నీటి ఆవిరి) / Invisible gas (water vapor)", "బురద / Mud", "మంచు రేణువులు / Snowflakes"],
      correctIndex: 1,
      explanation: "సరైనది! నీరు ఆవిరైనప్పుడు అది కంటికి కనిపించని నీటి ఆవిరి వాయువుగా మారుతుంది — Correct! Evaporated water becomes invisible water vapor gas."
    },
    {
      question: "కింది వాటిలో బాష్పీభవనానికి రోజువారీ ఉదాహరణ ఏది?",
      english:  "Which of these is an everyday example of evaporation?",
      options:  ["వర్షం తర్వాత మడుగు ఎండిపోవడం / A puddle drying up after rain", "ఫ్రీజర్‌లో మంచు ఏర్పడటం / Ice forming in a freezer", "నది కొండ దిగువకు ప్రవహించడం / A river flowing downhill", "మంచు కురవడం / Snow falling"],
      correctIndex: 0,
      explanation: "సరైనది! వర్షపు మడుగులు సూర్యుని వేడికి నెమ్మదిగా ఆవిరైపోతాయి — Correct! Puddles dry up because the Sun's heat evaporates them into the air."
    },
  ],

  condensation: [
    {
      question: "సాంద్రీకరణ (కండెన్సేషన్) అంటే ఏమిటి?",
      english:  "What is condensation?",
      options:  ["ద్రవ నీరు ఆవిరిగా మారడం / Liquid water turning into vapor", "నీటి ఆవిరి చల్లబడి తిరిగి ద్రవ బిందువులు లేదా మంచుగా మారడం / Water vapor cooling back into liquid droplets or ice", "నీరు భూగర్భంలో ప్రవహించడం / Water flowing underground", "పర్వతాలపై వర్షం పడటం / Rain falling on mountains"],
      correctIndex: 1,
      explanation: "సరైనది! చల్లబడిన నీటి ఆవిరి తిరిగి ద్రవ బిందువులుగా లేదా మంచుగా మారడమే సాంద్రీకరణ — Correct! Condensation is cooling water vapor changing back into liquid droplets or solid ice."
    },
    {
      question: "మేఘాలు నిజానికి దేనితో తయారవుతాయి?",
      english:  "What are clouds actually made of?",
      options:  ["అదృశ్య నీటి ఆవిరి / Invisible water vapor", "చిన్న ద్రవ బిందువులు లేదా మంచు స్ఫటికాలు / Tiny liquid droplets or ice crystals", "పొగ / Smoke", "కేవలం దుమ్ము / Dust only"],
      correctIndex: 1,
      explanation: "సరైనది! మేఘాలు నీటి ఆవిరితో కాదు, చిన్న ద్రవ బిందువులు లేదా మంచు స్ఫటికాలతో తయారవుతాయి — Correct! Clouds aren't made of water vapor — they're made of tiny visible droplets or ice crystals."
    },
    {
      question: "సాంద్రీకరణ సాధారణంగా ఎక్కడ జరుగుతుంది?",
      english:  "Where does condensation often take place?",
      options:  ["లోతైన భూగర్భంలో / Deep underground", "చల్లని గాలిలో ఎత్తులో, మేఘాలను ఏర్పరుస్తూ / High up in the cool air, forming clouds", "రాళ్ల లోపల / Inside rocks", "సముద్రం అడుగున / At the bottom of the ocean"],
      correctIndex: 1,
      explanation: "సరైనది! ఎత్తులో గాలి చల్లబడినప్పుడు నీటి ఆవిరి బిందువులుగా మారి మేఘాలను ఏర్పరుస్తుంది — Correct! High in the cool air, water vapor condenses into droplets that form clouds."
    },
  ],

  precipitation: [
    {
      question: "అవపాతం (ప్రెసిపిటేషన్) అంటే ఏమిటి?",
      english:  "What is precipitation?",
      options:  ["సముద్రం నుండి నీరు ఆవిరి కావడం / Water evaporating from the ocean", "సాంద్రీకరించిన నీరు వర్షం, మంచు, వడగళ్ళు లేదా సన్నని మంచుగా నేలపై పడటం / Condensed water falling to the ground as rain, snow, hail, or sleet", "నీరు మట్టిలోకి ఇంకడం / Water soaking into soil", "నదులు సముద్రంలో కలవడం / Rivers flowing into the sea"],
      correctIndex: 1,
      explanation: "సరైనది! సాంద్రీకరించిన నీటి ఆవిరి వర్షం, మంచు, వడగళ్ళు లేదా సన్నని మంచుగా నేలపై పడటమే అవపాతం — Correct! Precipitation is condensed water falling to the ground as rain, snow, hail, or sleet."
    },
    {
      question: "కింది వాటిలో అవపాత రూపం కానిది ఏది?",
      english:  "Which of these is NOT a form of precipitation?",
      options:  ["వర్షం / Rain", "వడగళ్ళు / Hail", "బాష్పీభవనం / Evaporation", "మంచు / Snow"],
      correctIndex: 2,
      explanation: "సరైనది! బాష్పీభవనం నీరు పైకి వెళ్ళే ప్రక్రియ, అవపాతం కాదు — Correct! Evaporation is water rising up into the air, not a form of precipitation."
    },
    {
      question: "మేఘాల నుండి అవపాతం పడటానికి కారణం ఏమిటి?",
      english:  "What causes precipitation to fall from clouds?",
      options:  ["మేఘాలలోని బిందువులు లేదా మంచు చాలా బరువుగా మారి గాలిలో నిలవలేకపోవడం / Droplets or ice in clouds become too heavy to stay airborne", "సూర్యుడు వాటిని కిందికి లాగుతాడు / The Sun pulls them down", "గాలి వాటిని బయటకు తోస్తుంది / Wind pushes them out", "అవి ఆకాశంలో నదులుగా మారతాయి / They turn into rivers in the sky"],
      correctIndex: 0,
      explanation: "సరైనది! బిందువులు లేదా మంచు స్ఫటికాలు పెద్దవై బరువుగా మారినప్పుడు గురుత్వాకర్షణ వాటిని కిందికి లాగుతుంది — Correct! When droplets or ice crystals grow too heavy, gravity pulls them down as precipitation."
    },
  ],

  groundwater: [
    {
      question: "భూగర్భజలం (గ్రౌండ్‌వాటర్) అంటే ఏమిటి?",
      english:  "What is groundwater?",
      options:  ["నదులలో ప్రవహించే నీరు / Water flowing in rivers", "భూగర్భ రాతి కణాల మధ్య రంధ్రాలు మరియు పగుళ్లలో నిల్వ ఉన్న ద్రవ నీరు / Liquid water stored in the pores and cracks between underground rock particles", "మేఘాలలోని నీరు / Water inside clouds", "హిమానీనదాలలోని గడ్డకట్టిన నీరు / Frozen water in glaciers"],
      correctIndex: 1,
      explanation: "సరైనది! భూగర్భజలం రాతి కణాల మధ్య రంధ్రాలు, పగుళ్లలో నిల్వ ఉన్న ద్రవ నీరు — ఒక 'పెద్ద దాగిన స్పాంజి'లా — Correct! Groundwater is liquid water stored in the pores and cracks of underground rock, like a giant hidden sponge."
    },
    {
      question: "'వాటర్ టేబుల్' (నీటి మట్టం) అంటే ఏమిటి?",
      english:  "What is the 'water table'?",
      options:  ["నీటితో నిండిన భూగర్భ మట్టి ఎగువ ఉపరితలం / The top surface of underground water-saturated ground", "నీటితో చేసిన బల్ల / A table made of water", "సముద్రం అడుగుభాగం / The bottom of the ocean", "ఒక రకమైన మేఘం / A type of cloud"],
      correctIndex: 0,
      explanation: "సరైనది! నీటితో నిండిన నేల పైభాగాన్ని వాటర్ టేబుల్ అంటారు — Correct! The water table is the upper level where the underground rock and soil become saturated with water."
    },
    {
      question: "ఒక బావి అధికంగా భూగర్భజలాన్ని తోడితే ఏమి జరగవచ్చు?",
      english:  "What can happen if a well pumps too much groundwater?",
      options:  ["ఏమీ మారదు / Nothing changes", "నీటి మట్టం చాలా దిగువకు పడిపోయి బావులు నీటిని ఇవ్వడం ఆపేయవచ్చు / The water table can drop so low that wells stop supplying water", "అది ఎక్కువ వర్షానికి కారణమవుతుంది / It causes more rain", "అది కొత్త సముద్రాలను సృష్టిస్తుంది / It creates new oceans"],
      correctIndex: 1,
      explanation: "సరైనది! అధికంగా తోడితే నీటి మట్టం పడిపోయి బావులు నీటిని ఇవ్వలేకపోవచ్చు — Correct! Excessive pumping can lower the water table so much that wells no longer supply water."
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
        background:"rgba(8,145,178,0.15)", color:C.accent, fontWeight:800,
        border:"1px solid rgba(8,145,178,0.3)", fontSize:"inherit" }}>{k}</kbd>
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

  const bg = "radial-gradient(ellipse at 0% 0%,#cffafe,transparent 50%),radial-gradient(ellipse at 100% 100%,#dbeafe,transparent 50%),#f5fdff";

  return (
    <div style={{ width:"100%", height:"100%", overflowY:"auto", background:bg,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(16px,3vh,40px) clamp(16px,3vw,48px)", gap:"clamp(12px,2vh,20px)",
      fontFamily:"'Nunito',sans-serif" }}>

      <div style={{ textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", margin:"0 0 6px",
          fontSize:"clamp(1.6rem,3.5vw,3rem)", fontWeight:600,
          background:"linear-gradient(135deg,#0891b2,#2563eb,#06b6d4)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          💧 Endless Journey of Water
        </h1>
        <p style={{ color:C.muted, fontSize:"clamp(.78rem,1.1vw,1rem)", fontWeight:600 }}>
          Watch the educational video, then take the quiz!
        </p>
      </div>

      <div style={{ width:"100%", maxWidth:820, position:"relative" }}>
        <div style={{ position:"absolute", inset:-3, borderRadius:22,
          background:"linear-gradient(135deg,#0891b2,#2563eb,#06b6d4)",
          opacity:playing?0.45:0.2, filter:"blur(14px)", zIndex:0, transition:"opacity .6s" }} />
        <div style={{ position:"relative", zIndex:1, borderRadius:18, overflow:"hidden",
          border:`2.5px solid ${playing?"rgba(8,145,178,.6)":"rgba(8,145,178,.18)"}`,
          background:"#000", boxShadow:"0 16px 60px rgba(0,0,0,.2)", transition:"border-color .4s" }}>
          {vidErr ? (
            <div style={{ width:"100%", height:220, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:10,
              background:"#ecfeff", color:C.muted, padding:24, textAlign:"center" }}>
              <span style={{ fontSize:"2.5rem" }}>📁</span>
              <div style={{ fontWeight:800, color:C.text }}>Video file not found</div>
              <div style={{ fontSize:"0.84rem", lineHeight:1.6, maxWidth:400 }}>
                Place your video at <code style={{ background:"rgba(8,145,178,.12)",
                  padding:"2px 8px", borderRadius:5, color:C.accent }}>
                  https://games.vrplay.in/videos/Endless_Journey_of_Water.mp4</code>
              </div>
            </div>
          ) : (
            <video ref={vidRef} src={VIDEO_SRC} controls controlsList="nodownload"
              style={{ width:"100%", display:"block", maxHeight:"52vh", background:"#000" }}
              playsInline preload="metadata" />
          )}
          <div style={{ height:5, background:"rgba(0,0,0,.08)" }}>
            <div style={{ height:"100%", width:`${pct*100}%`,
              background:"linear-gradient(90deg,#0891b2,#2563eb,#06b6d4)",
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
          background:watched?"linear-gradient(135deg,#0891b2,#2563eb)":"rgba(0,0,0,.08)",
          color:watched?"#fff":C.muted,
          boxShadow:watched?hover?`0 0 0 4px rgba(8,145,178,.35),0 8px 32px rgba(8,145,178,.45)`:`0 6px 24px rgba(8,145,178,.4)`:"none",
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
      background:"radial-gradient(ellipse at 50% 50%,#cffafe,#f5fdff)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSpin{to{transform:rotate(360deg)}}@keyframes vqPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ position:"relative", width:90, height:90 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ position:"absolute", inset:i*10, borderRadius:"50%",
            border:`2.5px solid ${C.accentLt}`, opacity:.4-i*.1,
            animation:`vqSpin ${1+i*.28}s linear infinite` }} />
        ))}
        <div style={{ position:"absolute", inset:28, borderRadius:"50%",
          background:"linear-gradient(135deg,#0891b2,#2563eb)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>💧</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:C.text,
          marginBottom:6, fontFamily:"'Fredoka One',cursive" }}>Loading Quiz{dots}</div>
        <div style={{ color:C.muted, fontSize:"0.9rem", fontWeight:600 }}>Preparing your water cycle questions…</div>
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
      background:"radial-gradient(ellipse at 0% 0%,#cffafe,transparent 50%),radial-gradient(ellipse at 100% 100%,#dbeafe,transparent 50%),#f5fdff",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(14px,2.5vh,36px) clamp(14px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}@keyframes vqPop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>

      <div style={{ width:"100%", maxWidth:680 }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:"clamp(10px,1.8vh,20px)", flexWrap:"wrap", gap:10 }}>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
            fontSize:"clamp(1.3rem,2.8vw,2rem)", fontWeight:700,
            background:"linear-gradient(135deg,#0891b2,#2563eb)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            💧 Quiz Time
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
              background:"linear-gradient(90deg,#0891b2,#2563eb)",
              transition:"width .5s ease", borderRadius:4 }} />
          </div>
          <span style={{ color:C.muted, fontSize:"clamp(.7rem,.9vw,.85rem)", fontWeight:700 }}>
            {Math.round(progPct)}%
          </span>
        </div>

        <div style={{ background:C.card, borderRadius:"clamp(14px,2vw,22px)",
          padding:"clamp(18px,2.8vh,28px) clamp(16px,2.5vw,26px) clamp(14px,2.2vh,22px)",
          border:"2px solid rgba(8,145,178,.12)", boxShadow:"0 6px 32px rgba(0,0,0,.1)",
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
                    background:st==="correct"?C.correctBg:st==="wrong"?C.wrongBg:st==="dim"?"rgba(0,0,0,.03)":isFoc?"rgba(8,145,178,.1)":"rgba(255,255,255,.7)",
                    color:st==="dim"?"#bbb":st==="correct"?C.correct:st==="wrong"?C.wrong:C.text,
                    display:"flex", alignItems:"center", gap:"clamp(8px,1vw,12px)",
                    fontSize:"clamp(.8rem,1.2vw,.95rem)", fontWeight:600,
                    fontFamily:"'Nunito',sans-serif", cursor:answered?"default":"pointer",
                    textAlign:"left", outline:"none", lineHeight:1.4,
                    transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                    transform:isFoc?"translateX(6px)":"none",
                    boxShadow:st==="correct"?"0 0 16px rgba(5,150,105,.2)":st==="wrong"?"0 0 10px rgba(220,38,38,.15)":isFoc?"0 0 0 2px rgba(8,145,178,.25)":"none",
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
      background:"radial-gradient(ellipse at 50% 0%,#cffafe,transparent 50%),#f5fdff",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(20px,3vh,48px) clamp(16px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif", gap:"clamp(14px,2vh,22px)" }}>
      <style>{`@keyframes vqBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      <div style={{ fontSize:"clamp(3.5rem,8vw,5.5rem)", filter:`drop-shadow(0 0 20px ${col})`,
        animation:"vqBounce 2s ease-in-out infinite" }}>{emoji}</div>

      <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
        fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700,
        background:"linear-gradient(135deg,#0891b2,#f59e0b)",
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
          background:"linear-gradient(135deg,#0891b2,#2563eb)",
          color:"#fff", fontWeight:800, fontFamily:"'Nunito',sans-serif",
          fontSize:"clamp(.9rem,1.4vw,1.15rem)",
          boxShadow:hover?`0 0 0 4px rgba(8,145,178,.3),0 10px 36px rgba(8,145,178,.5)`:`0 6px 28px rgba(8,145,178,.4)`,
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
export default function WaterJourneyQuizGame() {
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