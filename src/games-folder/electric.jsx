import { useState, useEffect, useRef, useCallback } from "react";

const VIDEO_SRC = "https://games.vrplay.in/videos/invisible_to_visible_tech.mp4";
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
   Invisible to Visible Tech Quiz — Questions grouped by topic (video section)
   Each session picks exactly ONE random question from each topic group,
   so you NEVER get two questions about the same thing in one quiz.

   Topics map 1:1 to the video's 5 sections:
     1. The Power of Electrons
     2. Magnets & Invisible Force
     3. Controlling the Current
     4. The SPACE Approach to Learning
     5. IoT & Smart Classrooms
───────────────────────────────────────────────────────────────────────── */
const TOPICS = {

  electrons: [
    {
      question: "ఎలక్ట్రాన్ అంటే ఏమిటి?",
      english:  "What is an electron?",
      options:  ["అణువు లోపల ఉండే చిన్న ఛార్జ్ కణం, కణం మరియు తరంగం రెండూ గా ప్రవర్తిస్తుంది / A tiny charged entity inside an atom, acting as both a particle and a wave", "ఒక రకమైన అయస్కాంతం / A type of magnet", "ఒక స్విచ్ / A switch", "ఒక వైరు ముక్క / A piece of wire"],
      correctIndex: 0,
      explanation: "సరైనది! ఎలక్ట్రాన్ అణువు లోపల ఉండే చిన్న ఛార్జ్‌గల ఎంటిటీ, ఇది కణం మరియు తరంగం రెండింటిలాగా ప్రవర్తిస్తుంది — Correct! An electron is a tiny charged entity inside an atom that behaves as both a particle and a wave."
    },
    {
      question: "వైరు ద్వారా ఎలక్ట్రాన్ల ప్రవాహాన్ని ఏమని పిలుస్తారు?",
      english:  "What do we call the flow of electrons through a wire?",
      options:  ["నీటి ప్రవాహం / Water flow", "విద్యుత్ ప్రవాహం (కరెంట్) / Electric current", "శబ్ద తరంగం / A sound wave", "వెలుతురు కిరణం / A light beam"],
      correctIndex: 1,
      explanation: "సరైనది! ఎలక్ట్రాన్లు వైరు ద్వారా ప్రవహించడాన్నే విద్యుత్ ప్రవాహం (కరెంట్) అంటారు — Correct! The flow of electrons through a wire is called electric current."
    },
    {
      question: "మన ఇంట్లో ఉపకరణాలు పనిచేయడానికి దైనందిన విద్యుత్ ఏమి శక్తినిస్తుంది?",
      english:  "What does everyday electricity power in our homes?",
      options:  ["వాషింగ్ మెషీన్లు మరియు లైట్ల వంటి ఉపకరణాలు / Appliances like washing machines and lights", "కేవలం కంప్యూటర్లు మాత్రమే / Only computers", "కేవలం ఫోన్లు మాత్రమే / Only phones", "ఇంట్లో ఏదీ లేదు / Nothing in the house"],
      correctIndex: 0,
      explanation: "సరైనది! దైనందిన విద్యుత్ వాషింగ్ మెషీన్లు, వాక్యూమ్‌లు, లైట్ల వంటి ఉపకరణాలకు శక్తినిస్తుంది — Correct! Everyday electricity powers appliances like washing machines, vacuums, and lights."
    },
  ],

  magnets: [
    {
      question: "అయస్కాంతం పేపర్ క్లిప్‌ల వంటి వస్తువులను ఎలా ఆకర్షిస్తుంది?",
      english:  "How does a magnet attract objects like paperclips?",
      options:  ["తాకకుండానే అదృశ్య శక్తితో / With an invisible force, without touching them", "వాటిని వేడి చేయడం ద్వారా / By heating them", "వాటిని తేలికగా చేయడం ద్వారా / By making them lighter", "శబ్దం ఉత్పత్తి చేయడం ద్వారా / By producing sound"],
      correctIndex: 0,
      explanation: "సరైనది! అయస్కాంతాలు తాకకుండానే లోహ వస్తువులను ఆకర్షించే అదృశ్య శక్తిని ఉత్పత్తి చేస్తాయి — Correct! Magnets exert an invisible force that attracts metal objects without touching them."
    },
    {
      question: "విద్యుదయస్కాంతం (ఎలక్ట్రోమాగ్నెట్) అంటే ఏమిటి?",
      english:  "What is an electromagnet?",
      options:  ["సహజంగా దొరికే రాయి / A naturally occurring rock", "ఇనుప మేకు చుట్టూ ఉన్న కాయిల్ ద్వారా విద్యుత్ ప్రవాహాన్ని పంపడం ద్వారా సృష్టించబడిన అయస్కాంతం / A magnet created by passing electric current through a wire coil, often around an iron nail", "ఒక రకమైన బ్యాటరీ / A type of battery", "ఒక గాజు వస్తువు / A glass object"],
      correctIndex: 1,
      explanation: "సరైనది! విద్యుదయస్కాంతం అనేది ఇనుప మేకు చుట్టూ ఉన్న వైరు కాయిల్ ద్వారా విద్యుత్ ప్రవాహాన్ని పంపడం వలన సృష్టించబడిన అయస్కాంతం — Correct! An electromagnet is a magnet created by passing electric current through a wire coil, often wrapped around an iron nail."
    },
    {
      question: "వైరు గుండా ఎలక్ట్రాన్లు కదిలినప్పుడు ఏమి ఏర్పడుతుంది?",
      english:  "What is created around a wire when electrons move through it?",
      options:  ["ఒక అయస్కాంత క్షేత్రం / A magnetic field", "ఒక శబ్ద తరంగం / A sound wave", "ఒక రసాయన చర్య / A chemical reaction", "ఒక కాంతి కిరణం / A light beam"],
      correctIndex: 0,
      explanation: "సరైనది! కదులుతున్న ఎలక్ట్రాన్లు వైరు చుట్టూ ఒక అయస్కాంత క్షేత్రాన్ని సృష్టిస్తాయి — ఇది అయస్కాంతత్వం మరియు విద్యుత్ ఎంత దగ్గరగా అనుసంధానమై ఉన్నాయో చూపిస్తుంది — Correct! Moving electrons create a magnetic field around the wire, showing how deeply connected magnetism and electricity are."
    },
  ],

  circuits: [
    {
      question: "సర్క్యూట్‌లో స్విచ్‌లు ఏమి పని చేస్తాయి?",
      english:  "What role do switches play in a circuit?",
      options:  ["అవి కరెంట్‌ను నియంత్రిస్తూ సర్క్యూట్‌ను పూర్తి చేస్తాయి లేదా విచ్ఛిన్నం చేస్తాయి / They act as gatekeepers that complete or break the circuit, controlling the current", "అవి విద్యుత్‌ను ఉత్పత్తి చేస్తాయి / They generate electricity", "అవి వేడిని తగ్గిస్తాయి మాత్రమే / They only reduce heat", "అవి ధ్వనిని నియంత్రిస్తాయి / They control sound"],
      correctIndex: 0,
      explanation: "సరైనది! స్విచ్‌లు గేట్‌కీపర్‌లలాగా పనిచేస్తాయి, సర్క్యూట్‌ను పూర్తి చేయడం లేదా విచ్ఛిన్నం చేయడం ద్వారా కరెంట్‌ను నియంత్రిస్తాయి — Correct! Switches act as gatekeepers, completing or breaking the circuit to control the current."
    },
    {
      question: "స్విచ్‌ను ఆన్ చేసినప్పుడు సర్క్యూట్‌లో ఏమి జరుగుతుంది?",
      english:  "What happens to the circuit when a switch is turned ON?",
      options:  ["సర్క్యూట్ పూర్తవుతుంది, కరెంట్ ప్రవహించడానికి అనుమతిస్తుంది / The circuit is completed, allowing current to flow", "సర్క్యూట్ విచ్ఛిన్నమవుతుంది / The circuit breaks", "ఏమీ జరగదు / Nothing happens", "విద్యుత్ నిల్వ అవుతుంది / Electricity gets stored"],
      correctIndex: 0,
      explanation: "సరైనది! స్విచ్ ఆన్‌లో ఉన్నప్పుడు సర్క్యూట్ పూర్తవుతుంది, దీని వలన కరెంట్ ప్రవహిస్తుంది — Correct! When the switch is ON, the circuit is completed and current can flow through it."
    },
    {
      question: "స్విచ్‌ను ఆఫ్ చేసినప్పుడు (సర్క్యూట్ తెరిచినప్పుడు) ఏమి జరుగుతుంది?",
      english:  "What happens when a switch is turned OFF (the circuit is open)?",
      options:  ["కరెంట్ ప్రవాహం ఆగిపోతుంది / The flow of current stops", "కరెంట్ రెట్టింపు అవుతుంది / The current doubles", "అయస్కాంతత్వం పెరుగుతుంది / Magnetism increases", "వైరు వేడెక్కిపోతుంది మాత్రమే / The wire just heats up"],
      correctIndex: 0,
      explanation: "సరైనది! స్విచ్ ఆఫ్‌లో ఉన్నప్పుడు సర్క్యూట్ విచ్ఛిన్నమవుతుంది, దీని వలన కరెంట్ ప్రవాహం ఆగిపోతుంది — Correct! When the switch is OFF, the circuit breaks and the flow of current stops."
    },
  ],

  spaceApproach: [
    {
      question: "SPACE పద్ధతిలో 'Explore' (అన్వేషించడం) అంటే ఏమిటి?",
      english:  "In the SPACE approach, what does 'Explore' mean?",
      options:  ["పిల్లల ప్రారంభ ఆలోచనలను అన్వేషించడం / Exploring children's initial ideas about a topic", "పరీక్ష పేపర్లను తయారు చేయడం / Preparing exam papers", "పాఠశాల భవనాన్ని అన్వేషించడం / Exploring the school building", "కొత్త పుస్తకాలను కొనడం / Buying new books"],
      correctIndex: 0,
      explanation: "సరైనది! SPACE పద్ధతిలో 'Explore' అంటే డ్రాయింగ్ లేదా చర్చ ద్వారా పిల్లల ప్రారంభ ఆలోచనలను అన్వేషించడం — Correct! 'Explore' means drawing out and exploring children's initial ideas through drawing or discussion."
    },
    {
      question: "SPACE పద్ధతిలో 'Test' (పరీక్షించడం) అంటే ఏమిటి?",
      english:  "In the SPACE approach, what does 'Test' mean?",
      options:  ["ఉపాధ్యాయులు మాత్రమే మాట్లాడటం / Only the teacher talking", "ఫెయిర్ టెస్ట్‌లు మరియు పరిశీలన ద్వారా పిల్లలు తమ ఆలోచనలను పరీక్షించడం / Letting children test their own ideas through fair tests and observation", "పిల్లలను ఇంటికి పంపడం / Sending children home", "పుస్తకాలను మాత్రమే చదవడం / Just reading books"],
      correctIndex: 1,
      explanation: "సరైనది! 'Test' దశలో పిల్లలు ఫెయిర్ టెస్ట్‌లు మరియు పరిశీలన ద్వారా తమ ఆలోచనలను స్వయంగా పరీక్షించుకుంటారు — Correct! In the 'Test' stage, children test their own ideas through fair tests and observation."
    },
    {
      question: "SPACE పద్ధతిలో 'Generalize' (సాధారణీకరించడం) అంటే ఏమిటి?",
      english:  "In the SPACE approach, what does 'Generalize' mean?",
      options:  ["నేర్చుకున్న ఆలోచనలను కొత్త సందర్భాలకు వర్తింపజేయడం / Encouraging children to apply their ideas to new contexts", "పరీక్షను రద్దు చేయడం / Cancelling the test", "మళ్లీ అదే పాఠాన్ని చదవడం / Reading the same lesson again", "పాఠశాల మారడం / Changing schools"],
      correctIndex: 0,
      explanation: "సరైనది! 'Generalize' దశలో పిల్లలు తమ ఆలోచనలను కొత్త సందర్భాలకు విస్తరించి వర్తింపజేస్తారు — Correct! In the 'Generalize' stage, children extend and apply their ideas to new contexts."
    },
  ],

  iotSmart: [
    {
      question: "1995 నుండి 2024 వరకు తరగతి గది నియంత్రణ ఎలా మారింది?",
      english:  "How has classroom control evolved from 1995 to 2024?",
      options:  ["మాన్యువల్ స్విచ్‌ల నుండి IoT ఆధారిత మైక్రోకంట్రోలర్ సిస్టమ్‌లకు / From manual switches to automated, IoT-based microcontroller systems", "ఎలాంటి మార్పు లేకుండా అలాగే ఉంది / It stayed exactly the same", "కంప్యూటర్లు పూర్తిగా తీసివేయబడ్డాయి / Computers were removed entirely", "మరింత మాన్యువల్‌గా మారింది / It became more manual"],
      correctIndex: 0,
      explanation: "సరైనది! లాజిక్ నియంత్రణ మాన్యువల్ స్విచ్‌ల నుండి సెన్సార్లు, మైక్రోకంట్రోలర్లు మరియు IoT ఆధారిత ఆటోమేటెడ్ సిస్టమ్‌లకు పరిణామం చెందింది — Correct! Logic control has evolved from manual switches to automated, sensor-and-microcontroller-driven IoT systems."
    },
    {
      question: "స్మార్ట్ క్లాస్‌రూమ్‌లో ఒక సెన్సార్ ఒక వ్యక్తి నడుచుకుంటూ వస్తున్నట్లు గుర్తించినప్పుడు ఏమి జరుగుతుంది?",
      english:  "In a smart classroom, what happens when a sensor detects a person walking in?",
      options:  ["ఏమీ జరగదు / Nothing happens at all", "మైక్రోకంట్రోలర్ స్వయంచాలకంగా లైట్లు మరియు ఫ్యాన్‌లను ఆన్ చేస్తుంది / The microcontroller automatically turns on lights and fans", "తరగతి గది తాళం వేయబడుతుంది / The classroom gets locked", "ఇంటర్నెట్ ఆగిపోతుంది / The internet shuts down"],
      correctIndex: 1,
      explanation: "సరైనది! సెన్సార్ సంకేతాన్ని మైక్రోకంట్రోలర్‌కు పంపుతుంది, అది లైట్లు మరియు ఫ్యాన్‌లను స్వయంచాలకంగా ఆన్ చేస్తుంది — Correct! The sensor sends a signal to the microcontroller, which automatically switches on lights and fans."
    },
    {
      question: "సాంప్రదాయ తరగతి గదితో పోలిస్తే స్మార్ట్ తరగతి గది యొక్క ముఖ్య ప్రయోజనం ఏమిటి?",
      english:  "Compared to a traditional classroom, what is a key benefit of a smart classroom?",
      options:  ["ఇది శక్తిని ఆదా చేస్తుంది మరియు అభ్యాసాన్ని వ్యక్తిగతీకరిస్తుంది / It saves energy and personalizes learning, instead of wasting power with generic lessons", "ఇది మరింత మాన్యువల్ నియంత్రణను ఉపయోగిస్తుంది / It uses more manual control", "ఇది ఎక్కువ విద్యుత్‌ను వృథా చేస్తుంది / It wastes more electricity", "ఇది పుస్తకాలను నిషేధిస్తుంది / It bans books"],
      correctIndex: 0,
      explanation: "సరైనది! సాంప్రదాయ తరగతి గదులు మాన్యువల్‌గా, వృథాగా ఉంటే, స్మార్ట్ తరగతి గదులు ఆటోమేటెడ్, శక్తిని ఆదా చేసేలా, వ్యక్తిగతీకరించిన అభ్యాసాన్ని అందిస్తాయి — Correct! While traditional classrooms are manual and wasteful, smart classrooms are automated, energy-saving, and offer personalized learning."
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
          ⚡ Invisible to Visible Tech
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
                  https://games.vrplay.in/videos/invisible_to_visible_tech.mp4</code>
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
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>⚡</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:C.text,
          marginBottom:6, fontFamily:"'Fredoka One',cursive" }}>Loading Quiz{dots}</div>
        <div style={{ color:C.muted, fontSize:"0.9rem", fontWeight:600 }}>Preparing your tech questions…</div>
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
            ⚡ Quiz Time
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