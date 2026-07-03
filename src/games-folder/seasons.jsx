import { useState, useEffect, useRef, useCallback } from "react";

const VIDEO_SRC = "https://games.vrplay.in/videos/%E0%B0%B0%E0%B1%81%E0%B0%A4%E0%B1%81%E0%B0%B5%E0%B1%81%E0%B0%B2_%E0%B0%AE%E0%B0%BE%E0%B0%AF%E0%B0%BE%E0%B0%9C%E0%B0%BE%E0%B0%B2%E0%B0%82!.mp4";
const NUM_Q = 5;

const C = {
  accent:"#16a34a", accentLt:"#86efac",
  gold:"#f59e0b",
  correct:"#059669", correctBg:"rgba(5,150,105,0.14)",
  wrong:"#dc2626",   wrongBg:"rgba(220,38,38,0.12)",
  text:"#1a1a1a", muted:"#6b7280",
  card:"#ffffffed", border:"rgba(0,0,0,0.08)",
};

/* ─────────────────────────────────────────────────────────────────────────
   The Magic of Seasons! Quiz — Questions grouped by topic
   Each session picks exactly ONE random question from each topic group,
   so you NEVER get two questions about the same thing in one quiz.
───────────────────────────────────────────────────────────────────────── */
const TOPICS = {

  causeOfSeasons: [
    {
      question: "భూమి తన అక్షంపై ఎంత కోణంలో వంగి ఉంటుంది?",
      english:  "At what angle is Earth tilted on its axis?",
      options:  ["23.4 డిగ్రీలు / 23.4 degrees", "90 డిగ్రీలు / 90 degrees", "45 డిగ్రీలు / 45 degrees", "0 డిగ్రీలు / 0 degrees"],
      correctIndex: 0,
      explanation: "సరైనది! భూమి తన అక్షానికి 23.4 డిగ్రీల కోణంలో వంగి ఉంటుంది, దీనినే అక్షాంశ వంపు అంటారు — Correct! Earth's axis is tilted at 23.4 degrees, which is called the axial tilt."
    },
    {
      question: "ఏడాది పొడవునా వాతావరణం వేడిగా, చల్లగా మారడానికి ముఖ్య కారణం ఏమిటి?",
      english:  "What is the main reason the weather turns hot and cold through the year?",
      options:  ["భూమి సూర్యుని నుండి దూరం మారడం వల్ల మాత్రమే / Only because Earth's distance from the Sun changes", "భూమి యొక్క అక్షాంశ వంపు, సూర్యుని చుట్టూ తిరగడం వలన / Because of Earth's axial tilt and its revolution around the Sun", "చంద్రుని ప్రభావం వల్ల / Because of the Moon's influence", "సముద్రాల ప్రభావం వల్ల మాత్రమే / Only because of the oceans"],
      correctIndex: 1,
      explanation: "సరైనది! వంగి ఉన్న భూమి సూర్యుని చుట్టూ తిరుగుతున్నప్పుడు వేర్వేరు భాగాలు ఎక్కువ లేదా తక్కువ సూర్యకాంతిని పొందటం వలన రుతువులు వస్తాయి — Correct! Because Earth is tilted while it revolves around the Sun, different parts get more or less sunlight, creating the seasons."
    },
    {
      question: "భూమి సూర్యుని చుట్టూ ఒక చుట్టు తిరగడానికి (పరిభ్రమణానికి) ఎంత సమయం పడుతుంది?",
      english:  "How long does Earth take to complete one revolution around the Sun?",
      options:  ["24 గంటలు / 24 hours", "30 రోజులు / 30 days", "365.25 రోజులు / 365.25 days", "7 రోజులు / 7 days"],
      correctIndex: 2,
      explanation: "సరైనది! భూమి సూర్యుని చుట్టూ తిరగడానికి 365.25 రోజులు పడుతుంది, అందుకే ప్రతి నాలుగు సంవత్సరాలకు ఒకసారి ఫిబ్రవరి 29 (లీప్ ఇయర్) వస్తుంది — Correct! Earth takes 365.25 days to revolve around the Sun, which is why we get an extra day, February 29, every four years (a leap year)."
    },
  ],

  equinox: [
    {
      question: "విషువత్తు (ఈక్వినాక్స్) రోజున ఏమి జరుగుతుంది?",
      english:  "What happens on an equinox day?",
      options:  ["రాత్రి పగటి కంటే చాలా పెద్దదిగా ఉంటుంది / The night is much longer than the day", "పగలు మరియు రాత్రి సమానంగా ఉంటాయి / Day and night are equal in length", "సూర్యుడు అసలు కనిపించడు / The Sun does not appear at all", "ఆ రోజు మంచు తప్పక కురుస్తుంది / It is bound to snow that day"],
      correctIndex: 1,
      explanation: "సరైనది! విషువత్తు రోజున సూర్యకిరణాలు భూమధ్యరేఖపై నేరుగా పడటం వలన పగలు, రాత్రి సమానంగా ఉండే అద్భుత సమయం ఇది — Correct! On an equinox, the Sun's rays fall directly on the equator, making day and night equal — a wonderful moment."
    },
    {
      question: "విషువత్తు సమయంలో సూర్యకిరణాలు భూమి మీద నేరుగా ఎక్కడ పడతాయి?",
      english:  "During an equinox, where do the Sun's rays fall directly on Earth?",
      options:  ["ఉత్తర ధ్రువం మీద / On the North Pole", "దక్షిణ ధ్రువం మీద / On the South Pole", "భూమధ్యరేఖ మీద / On the equator", "హిమాలయాల మీద మాత్రమే / Only on the Himalayas"],
      correctIndex: 2,
      explanation: "సరైనది! విషువత్తు సమయంలో సూర్యకిరణాలు భూమధ్యరేఖపై నేరుగా పడతాయి — Correct! During an equinox, the Sun's rays fall directly on the equator."
    },
    {
      question: "కింది వాటిలో విషువత్తు (ఈక్వినాక్స్) జరిగే నెల ఏది?",
      english:  "Which of these is a month when an equinox occurs?",
      options:  ["జనవరి / January", "మార్చి / March", "మే / May", "ఆగస్టు / August"],
      correctIndex: 1,
      explanation: "సరైనది! మార్చి 21న ఒక విషువత్తు జరుగుతుంది, అప్పుడు పగలు రాత్రి దాదాపు సమానంగా ఉంటాయి — Correct! An equinox occurs around March 21, when day and night are nearly equal."
    },
  ],

  seasonCharacteristics: [
    {
      question: "వసంతకాలం (స్ప్రింగ్) యొక్క ముఖ్య లక్షణం ఏమిటి?",
      english:  "What is the main feature of Spring?",
      options:  ["రంగురంగుల పూలు వికసించడం, ముద్దులొలికే పసి జంతువులు పుట్టడం / Colorful flowers bloom and cute baby animals are born", "విపరీతమైన మంచు కురవడం / Heavy snow falls everywhere", "చెట్ల ఆకులన్నీ రాలిపోవడం / All the leaves fall from the trees", "విపరీతమైన ఎండ వేడిమి / Extreme blazing heat"],
      correctIndex: 0,
      explanation: "సరైనది! వసంతకాలంలో రంగురంగుల పూలు వికసిస్తాయి, పసి జంతువులు పుట్టి కొత్త ప్రపంచాన్ని అన్వేషిస్తాయి — Correct! In spring, colorful flowers bloom and baby animals are born to explore their new world."
    },
    {
      question: "వేసవికాలం (సమ్మర్) యొక్క ముఖ్య లక్షణం ఏది?",
      english:  "What characterizes Summer?",
      options:  ["వేడిగా, ప్రకాశవంతమైన ఎండలు ఉండే కాలం / A hot season full of bright, sunny days", "విపరీతమైన చలి, మంచుతో నిండిన కాలం / An extremely cold, snow-filled season", "ఆకులు రాలిపోయే కాలం / The season when leaves fall", "పగలు, రాత్రి సరిగ్గా సమానంగా ఉండే కాలం / The season when day and night are exactly equal"],
      correctIndex: 0,
      explanation: "సరైనది! వేసవికాలం వేడిగా ఉండే ప్రకాశవంతమైన ఎండల కాలం — Correct! Summer is a hot season filled with bright, sunny days."
    },
    {
      question: "శరద్రుతువు (ఆటమ్)లో సాధారణంగా ఏమి జరుగుతుంది?",
      english:  "What typically happens during Autumn?",
      options:  ["పూలు మొదటిసారి వికసించడం మొదలవుతాయి / Flowers begin blooming for the first time", "చలిగాలులు వీస్తూ చెట్ల ఆకులు రాలిపోతాయి / Cold winds blow and leaves fall from the trees", "సముద్రాలు పూర్తిగా ఎండిపోతాయి / Oceans dry up completely", "ప్రతిరోజూ పగలు పొడవైనదిగా మారుతుంది / Every day becomes the longest day"],
      correctIndex: 1,
      explanation: "సరైనది! శరద్రుతువులో చల్లని వాతావరణం వచ్చి, చెట్ల నుండి ఆకులు రాలిపోతాయి — Correct! In autumn, the weather turns cool and leaves fall from the trees."
    },
  ],

  seasonsInIndia: [
    {
      question: "భారతదేశంలో మకర సంక్రాంతి పండుగ ఏ రుతువులో జరుగుతుంది?",
      english:  "In India, during which season is the Makara Sankranti festival celebrated?",
      options:  ["శీతాకాలం / Winter", "వేసవికాలం / Summer", "వర్షాకాలం / Rainy season", "శరద్రుతువు / Autumn"],
      correctIndex: 0,
      explanation: "సరైనది! శీతాకాలంలో చల్లని ఉదయాలతో పాటు మకర సంక్రాంతి పండుగ వస్తుంది — Correct! Winter brings cold mornings along with the festival of Makara Sankranti."
    },
    {
      question: "భారతదేశంలో వేసవికాలంలో ఏ తీయని పండు పుష్కలంగా లభిస్తుంది?",
      english:  "Which sweet fruit is abundantly available in India during summer?",
      options:  ["మామిడి పండ్లు / Mangoes", "ఆపిల్‌లు / Apples", "ద్రాక్షలు / Grapes", "నారింజలు / Oranges"],
      correctIndex: 0,
      explanation: "సరైనది! వేసవికాలంలో వేడి రోజులతో పాటు తీయని మామిడి పండ్లు పుష్కలంగా లభిస్తాయి — Correct! Summer brings hot days along with plenty of sweet mango fruits."
    },
    {
      question: "భారతదేశంలో వర్షాకాలంలో పిల్లలు ఏమి చేస్తూ ఆడుకుంటారు?",
      english:  "What do children in India enjoy doing during the rainy season?",
      options:  ["మంచులో స్కేటింగ్ చేస్తారు / They go ice skating in the snow", "వానలో కాగితపు పడవలు చేసి ఆడుకుంటారు / They make paper boats and play in the rain", "ఎండలో స్విమ్మింగ్ చేస్తారు / They go swimming under the hot sun", "చెట్ల ఆకులను ఏరుకుంటారు / They collect fallen leaves"],
      correctIndex: 1,
      explanation: "సరైనది! వర్షాకాలంలో వానలో పడవలు చేస్తూ ఆడుకోవడం పిల్లలకు ఎంతో సరదాగా ఉంటుంది — Correct! During the rainy season, making paper boats and playing in the puddles is great fun for children."
    },
  ],

  animalsAndSeasons: [
    {
      question: "వసంతకాలంలో జంతువుల విషయంలో సాధారణంగా ఏమి జరుగుతుంది?",
      english:  "What typically happens with animals during spring?",
      options:  ["ముద్దులొలికే పసి జంతువులు పుడతాయి / Cute baby animals are born", "జంతువులు గుహల్లో గాఢ నిద్రలోకి వెళతాయి / Animals go into deep hibernation in caves", "జంతువులు ఆహారం లేకుండా ఉండిపోతాయి / Animals are left without any food", "జంతువులు శాశ్వతంగా దేశాంతరం వెళతాయి / Animals migrate away permanently"],
      correctIndex: 0,
      explanation: "సరైనది! వసంతకాలంలో పసి జంతువులు పుట్టి, ఆడుకుంటూ కొత్త ప్రపంచాన్ని అన్వేషిస్తాయి — Correct! In spring, baby animals are born and explore their new world by playing."
    },
    {
      question: "శరద్రుతువులో జంతువులు చలికాలం కోసం ఏమి చేసుకుంటాయి?",
      english:  "What do animals do during autumn to prepare for winter?",
      options:  ["వెచ్చని దట్టమైన బొచ్చు పెంచుకుని, ఆహారాన్ని దాచుకుంటాయి / They grow a thick, warm fur coat and store food away", "ఈకలు పూర్తిగా రాల్చేసుకుంటాయి / They shed all of their feathers completely", "సముద్రంలో మాత్రమే జీవించడం మొదలుపెడతాయి / They start living only in the ocean", "గుడ్లు పెట్టడం పూర్తిగా ఆపేస్తాయి / They stop laying eggs entirely"],
      correctIndex: 0,
      explanation: "సరైనది! శరద్రుతువులో జంతువులు వెచ్చని దట్టమైన బొచ్చు పెంచుకుని, చలికాలం కోసం రుచికరమైన ఆహారాన్ని దాచుకుంటాయి — Correct! In autumn, animals grow a thick warm coat and store tasty food away for the cold winter ahead."
    },
    {
      question: "శీతాకాలంలో కొన్ని జంతువులు గుహల్లో ఏమి చేస్తాయి?",
      english:  "What do some animals do inside caves during winter?",
      options:  ["గాఢ నిద్రపోతాయి, దీనిని హైబర్నేషన్ అంటారు / They go into a deep sleep called hibernation", "ఎండలో బయట ఆడుకుంటాయి / They play outside in the hot sun", "విమానంలో ఎగురుతూ ఉంటాయి / They keep flying around in an airplane", "చెట్లను నాటుతూ ఉంటాయి / They spend their time planting trees"],
      correctIndex: 0,
      explanation: "సరైనది! చలి, మంచుతో నిండిన శీతాకాలంలో కొన్ని జంతువులు గుహల్లో గాఢ నిద్రపోతాయి, దీనినే హైబర్నేషన్ అంటారు — Correct! During the cold, snowy winter, some animals go into a deep sleep in their caves, called hibernation."
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
        background:"rgba(22,163,74,0.15)", color:C.accent, fontWeight:800,
        border:"1px solid rgba(22,163,74,0.3)", fontSize:"inherit" }}>{k}</kbd>
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

  const bg = "radial-gradient(ellipse at 0% 0%,#dcfce7,transparent 50%),radial-gradient(ellipse at 100% 100%,#fef3c7,transparent 50%),#f7fdf8";

  return (
    <div style={{ width:"100%", height:"100%", overflowY:"auto", background:bg,
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(16px,3vh,40px) clamp(16px,3vw,48px)", gap:"clamp(12px,2vh,20px)",
      fontFamily:"'Nunito',sans-serif" }}>

      <div style={{ textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", margin:"0 0 6px",
          fontSize:"clamp(1.4rem,3.2vw,2.6rem)", fontWeight:600,
          background:"linear-gradient(135deg,#16a34a,#f59e0b,#16a34a)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          🌦️ రుతువుల మాయాజాలం! — The Magic of Seasons!
        </h1>
        <p style={{ color:C.muted, fontSize:"clamp(.78rem,1.1vw,1rem)", fontWeight:600 }}>
          Watch the educational video, then take the quiz!
        </p>
      </div>

      <div style={{ width:"100%", maxWidth:820, position:"relative" }}>
        <div style={{ position:"absolute", inset:-3, borderRadius:22,
          background:"linear-gradient(135deg,#16a34a,#f59e0b,#16a34a)",
          opacity:playing?0.45:0.2, filter:"blur(14px)", zIndex:0, transition:"opacity .6s" }} />
        <div style={{ position:"relative", zIndex:1, borderRadius:18, overflow:"hidden",
          border:`2.5px solid ${playing?"rgba(22,163,74,.6)":"rgba(22,163,74,.18)"}`,
          background:"#000", boxShadow:"0 16px 60px rgba(0,0,0,.2)", transition:"border-color .4s" }}>
          {vidErr ? (
            <div style={{ width:"100%", height:220, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:10,
              background:"#f0fdf4", color:C.muted, padding:24, textAlign:"center" }}>
              <span style={{ fontSize:"2.5rem" }}>📁</span>
              <div style={{ fontWeight:800, color:C.text }}>Video file not found</div>
              <div style={{ fontSize:"0.84rem", lineHeight:1.6, maxWidth:400 }}>
                Place your video at <code style={{ background:"rgba(22,163,74,.12)",
                  padding:"2px 8px", borderRadius:5, color:C.accent }}>
                  https://games.vrplay.in/videos/%E0%B0%B0%E0%B1%81%E0%B0%A4%E0%B1%81%E0%B0%B5%E0%B1%81%E0%B0%B2_%E0%B0%AE%E0%B0%BE%E0%B0%AF%E0%B0%BE%E0%B0%9C%E0%B0%BE%E0%B0%B2%E0%B0%82!.mp4</code>
              </div>
            </div>
          ) : (
            <video ref={vidRef} src={VIDEO_SRC} controls controlsList="nodownload"
              style={{ width:"100%", display:"block", maxHeight:"52vh", background:"#000" }}
              playsInline preload="metadata" />
          )}
          <div style={{ height:5, background:"rgba(0,0,0,.08)" }}>
            <div style={{ height:"100%", width:`${pct*100}%`,
              background:"linear-gradient(90deg,#16a34a,#f59e0b,#16a34a)",
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
          background:watched?"linear-gradient(135deg,#16a34a,#f59e0b)":"rgba(0,0,0,.08)",
          color:watched?"#fff":C.muted,
          boxShadow:watched?hover?`0 0 0 4px rgba(22,163,74,.35),0 8px 32px rgba(22,163,74,.45)`:`0 6px 24px rgba(22,163,74,.4)`:"none",
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
      background:"radial-gradient(ellipse at 50% 50%,#dcfce7,#f7fdf8)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSpin{to{transform:rotate(360deg)}}@keyframes vqPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ position:"relative", width:90, height:90 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ position:"absolute", inset:i*10, borderRadius:"50%",
            border:`2.5px solid ${C.accentLt}`, opacity:.4-i*.1,
            animation:`vqSpin ${1+i*.28}s linear infinite` }} />
        ))}
        <div style={{ position:"absolute", inset:28, borderRadius:"50%",
          background:"linear-gradient(135deg,#16a34a,#f59e0b)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>🌦️</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:C.text,
          marginBottom:6, fontFamily:"'Fredoka One',cursive" }}>Loading Quiz{dots}</div>
        <div style={{ color:C.muted, fontSize:"0.9rem", fontWeight:600 }}>Preparing your seasons questions…</div>
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
      background:"radial-gradient(ellipse at 0% 0%,#dcfce7,transparent 50%),radial-gradient(ellipse at 100% 100%,#fef3c7,transparent 50%),#f7fdf8",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(14px,2.5vh,36px) clamp(14px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes vqSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}@keyframes vqPop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>

      <div style={{ width:"100%", maxWidth:680 }}>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginBottom:"clamp(10px,1.8vh,20px)", flexWrap:"wrap", gap:10 }}>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
            fontSize:"clamp(1.3rem,2.8vw,2rem)", fontWeight:700,
            background:"linear-gradient(135deg,#16a34a,#f59e0b)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            🌦️ Quiz Time
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
              background:"linear-gradient(90deg,#16a34a,#f59e0b)",
              transition:"width .5s ease", borderRadius:4 }} />
          </div>
          <span style={{ color:C.muted, fontSize:"clamp(.7rem,.9vw,.85rem)", fontWeight:700 }}>
            {Math.round(progPct)}%
          </span>
        </div>

        <div style={{ background:C.card, borderRadius:"clamp(14px,2vw,22px)",
          padding:"clamp(18px,2.8vh,28px) clamp(16px,2.5vw,26px) clamp(14px,2.2vh,22px)",
          border:"2px solid rgba(22,163,74,.12)", boxShadow:"0 6px 32px rgba(0,0,0,.1)",
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
                    background:st==="correct"?C.correctBg:st==="wrong"?C.wrongBg:st==="dim"?"rgba(0,0,0,.03)":isFoc?"rgba(22,163,74,.1)":"rgba(255,255,255,.7)",
                    color:st==="dim"?"#bbb":st==="correct"?C.correct:st==="wrong"?C.wrong:C.text,
                    display:"flex", alignItems:"center", gap:"clamp(8px,1vw,12px)",
                    fontSize:"clamp(.8rem,1.2vw,.95rem)", fontWeight:600,
                    fontFamily:"'Nunito',sans-serif", cursor:answered?"default":"pointer",
                    textAlign:"left", outline:"none", lineHeight:1.4,
                    transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                    transform:isFoc?"translateX(6px)":"none",
                    boxShadow:st==="correct"?"0 0 16px rgba(5,150,105,.2)":st==="wrong"?"0 0 10px rgba(220,38,38,.15)":isFoc?"0 0 0 2px rgba(22,163,74,.25)":"none",
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
      background:"radial-gradient(ellipse at 50% 0%,#dcfce7,transparent 50%),#f7fdf8",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"clamp(20px,3vh,48px) clamp(16px,3vw,48px)",
      fontFamily:"'Nunito',sans-serif", gap:"clamp(14px,2vh,22px)" }}>
      <style>{`@keyframes vqBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      <div style={{ fontSize:"clamp(3.5rem,8vw,5.5rem)", filter:`drop-shadow(0 0 20px ${col})`,
        animation:"vqBounce 2s ease-in-out infinite" }}>{emoji}</div>

      <h2 style={{ fontFamily:"'Fredoka One',cursive", margin:0,
        fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:700,
        background:"linear-gradient(135deg,#16a34a,#f59e0b)",
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
          background:"linear-gradient(135deg,#16a34a,#f59e0b)",
          color:"#fff", fontWeight:800, fontFamily:"'Nunito',sans-serif",
          fontSize:"clamp(.9rem,1.4vw,1.15rem)",
          boxShadow:hover?`0 0 0 4px rgba(22,163,74,.3),0 10px 36px rgba(22,163,74,.5)`:`0 6px 28px rgba(22,163,74,.4)`,
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
export default function SeasonsQuizGame() {
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