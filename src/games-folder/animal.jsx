import { useState, useEffect, useRef, useCallback } from "react";

const VIDEO_SRC = "https://games.vrplay.in/videos/%E0%B0%9C%E0%B0%82%E0%B0%A4%E0%B1%81%E0%B0%B5%E0%B1%81%E0%B0%B2%E0%B1%81_%E0%B0%8F%E0%B0%AE%E0%B0%BF_%E0%B0%A4%E0%B0%BF%E0%B0%82%E0%B0%9F%E0%B0%BE%E0%B0%AF%E0%B0%BF_.mp4";
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
   What Do Animals Eat? Quiz — Questions grouped by topic
   Each session picks exactly ONE random question from each topic group,
   so you NEVER get two questions about the same thing in one quiz.
───────────────────────────────────────────────────────────────────────── */
const TOPICS = {

  energySource: [
    {
      question: "జంతువులకు కావాల్సిన శక్తి ఎక్కడి నుండి వస్తుంది?",
      english:  "Where does the energy that animals need come from?",
      options:  ["జంతువులు మొక్కల్లా తమ ఆహారాన్ని తామే తయారు చేసుకుంటాయి / Animals make their own food like plants", "జంతువులు ఆహారం తినడం ద్వారానే శక్తిని పొందుతాయి / Animals get energy by eating food, since they cannot make their own", "జంతువులు నేరుగా సూర్యకాంతి నుండి శక్తిని పొందుతాయి / Animals get energy directly from sunlight", "జంతువులకు శక్తి అవసరం లేదు / Animals never need energy"],
      correctIndex: 1,
      explanation: "సరైనది! మొక్కలు తమ ఆహారాన్ని తామే తయారు చేసుకుంటాయి, కానీ జంతువులు ఆహారం తినడం ద్వారానే శక్తిని పొందుతాయి — Correct! Unlike plants, animals cannot make their own food — they get energy only by eating."
    },
    {
      question: "తినే ఆహారాన్ని బట్టి జంతువులను ఎన్ని రకాలుగా విభజిస్తారు?",
      english:  "Based on what they eat, into how many kinds are animals divided?",
      options:  ["రెండు / Two", "మూడు — శాకాహారులు, మాంసాహారులు, సర్వభక్షకులు / Three — herbivores, carnivores, omnivores", "ఐదు / Five", "పది / Ten"],
      correctIndex: 1,
      explanation: "సరైనది! జంతువులను శాకాహారులు, మాంసాహారులు, సర్వభక్షకులు అనే మూడు రకాలుగా విభజిస్తారు — Correct! Animals are grouped into three kinds: herbivores, carnivores, and omnivores."
    },
    {
      question: "జీవులకు ఆహారం ఎందుకు అవసరం?",
      english:  "Why do living things need food?",
      options:  ["అందంగా కనిపించడానికి మాత్రమే / Only to look beautiful", "ఇది శరీర పనులకు శక్తినిచ్చి ఆరోగ్యంగా ఉంచుతుంది / It gives energy for body functions and keeps them healthy", "శబ్దం చేయడానికి మాత్రమే / Only to make noise", "ఆహారానికి నిజమైన ప్రయోజనం లేదు / Food has no real purpose"],
      correctIndex: 1,
      explanation: "సరైనది! ఆహారం శరీర పనులకు శక్తినిచ్చి జీవులను ఆరోగ్యంగా, చురుకుగా ఉంచుతుంది — Correct! Food provides energy for body functions and keeps living things healthy."
    },
  ],

  herbivores: [
    {
      question: "శాకాహార జంతువులు (హెర్బివోర్స్) ఏమి తింటాయి?",
      english:  "What do herbivores eat?",
      options:  ["మాంసం మాత్రమే / Only meat", "కేవలం మొక్కలు, గడ్డి మరియు ఆకులు మాత్రమే / Only plants, grass, and leaves", "కేవలం కీటకాలు మాత్రమే / Only insects", "కేవలం చేపలు మాత్రమే / Only fish"],
      correctIndex: 1,
      explanation: "సరైనది! శాకాహారులు మొక్కలు, గడ్డి మరియు ఆకులను మాత్రమే తింటాయి — Correct! Herbivores eat only plants, grass, and leaves."
    },
    {
      question: "ఆహారాన్ని నమలడానికి, రుబ్బడానికి సహాయపడే హెర్బివోర్ల వెనుక భాగంలోని వెడల్పాటి, చదునైన దంతాలను ఏమంటారు?",
      english:  "What are the broad, flat back teeth of herbivores called, which help them chew and grind food?",
      options:  ["కెనైన్స్ / Canines", "మోలార్స్ / Molars", "టాలన్స్ / Talons", "దంతపు కొమ్ములు / Tusks"],
      correctIndex: 1,
      explanation: "సరైనది! మోలార్స్ అనే చదునైన దంతాలు ఆహారాన్ని నమలడానికి, రుబ్బడానికి సహాయపడతాయి — Correct! Flat molars at the back of the mouth help herbivores chew and grind their food."
    },
    {
      question: "కొన్ని హెర్బివోర్లు ఆహారాన్ని నమలకుండా మింగేసి, దానిని తిరిగి నోటికి తీసుకువచ్చి నమలడాన్ని ఏమంటారు?",
      english:  "What is it called when some herbivores swallow food without chewing, then bring it back to the mouth to chew again?",
      options:  ["గ్నాయింగ్ / Gnawing", "చ్యూయింగ్ ది కడ్ (రుమినేషన్) / Chewing the cud (rumination)", "లాపింగ్ / Lapping", "స్కావెంజింగ్ / Scavenging"],
      correctIndex: 1,
      explanation: "సరైనది! ఈ ఆహారాన్ని 'కడ్' అని, దానిని తిరిగి నమలడాన్ని చ్యూయింగ్ ది కడ్ లేదా రుమినేషన్ అని అంటారు — Correct! This food is called cud, and bringing it back to chew again is called chewing the cud, or rumination."
    },
  ],

  carnivores: [
    {
      question: "మాంసాహార జంతువులు (కార్నివోర్స్) ఏమి తింటాయి?",
      english:  "What do carnivores eat?",
      options:  ["ఇతర జంతువుల మాంసాన్ని మాత్రమే / Only the flesh of other animals", "కేవలం పండ్లు మాత్రమే / Only fruits", "కేవలం గడ్డి మాత్రమే / Only grass", "కేవలం మకరందం మాత్రమే / Only nectar"],
      correctIndex: 0,
      explanation: "సరైనది! మాంసాహారులు ఇతర జంతువుల మాంసాన్ని మాత్రమే తింటాయి — Correct! Carnivores eat only the flesh of other animals."
    },
    {
      question: "మాంసాన్ని చీల్చడానికి సహాయపడే మాంసాహారుల పదునైన, వంపు తిరిగిన ముందు దంతాలను ఏమంటారు?",
      english:  "What are the sharp, pointed, curved front teeth of carnivores called, which help them tear flesh?",
      options:  ["మోలార్స్ / Molars", "కెనైన్స్ / Canines", "ప్రీమోలార్స్ / Premolars", "ముక్కులు / Beaks"],
      correctIndex: 1,
      explanation: "సరైనది! కెనైన్స్ అనే పదునైన దంతాలు మాంసాన్ని చీల్చడానికి సహాయపడతాయి — Correct! Sharp, curved canine teeth help carnivores tear the flesh of their prey."
    },
    {
      question: "గుడ్లగూబలు, డేగల వంటి వేటాడే పక్షులు తమ ఎరను ఎలా పట్టుకుని చీలుస్తాయి?",
      english:  "How do hunting birds like owls and hawks catch and tear apart their prey?",
      options:  ["మోలార్స్ తో మాత్రమే / With molars only", "టాలన్స్ అనే వాడి గోళ్లు మరియు వంపు ముక్కులతో / With sharp claws called talons and curved beaks", "దానిని పూర్తిగా మింగడం ద్వారా మాత్రమే / By swallowing it whole only", "దానిని నాకడం ద్వారా / By licking it"],
      correctIndex: 1,
      explanation: "సరైనది! టాలన్స్ (వాడి గోళ్లు) ఎరను పట్టుకోవడానికి, వంపు ముక్కులు మాంసాన్ని చీల్చడానికి సహాయపడతాయి — Correct! Sharp claws called talons help them grip prey, and curved beaks help tear the flesh apart."
    },
  ],

  omnivores: [
    {
      question: "సర్వభక్షక జంతువులు (ఆమ్నివోర్స్) ఏమి తింటాయి?",
      english:  "What do omnivores eat?",
      options:  ["కేవలం మొక్కలు మాత్రమే / Only plants", "మొక్కలు మరియు ఇతర జంతువుల మాంసం రెండూ / Both plants and the flesh of other animals", "కేవలం మాంసం మాత్రమే / Only meat", "ఏమీ తినవు / Nothing at all"],
      correctIndex: 1,
      explanation: "సరైనది! సర్వభక్షకులు మొక్కలు మరియు ఇతర జంతువుల మాంసం రెండింటినీ తింటాయి — Correct! Omnivores eat both plants and the flesh of other animals."
    },
    {
      question: "సర్వభక్షకులకు పదునైన దంతాలు మరియు చదునైన దంతాలు రెండూ ఎందుకు ఉంటాయి?",
      english:  "Why do omnivores have both sharp teeth and flat teeth?",
      options:  ["పదునైన దంతాలు మాంసాన్ని చీల్చడానికి, చదునైన దంతాలు మొక్కల ఆహారాన్ని నమలడానికి / Sharp teeth tear meat, flat teeth chew plant food", "రెండు రకాల దంతాలూ పనికిరానివి / Both kinds of teeth are useless", "అవి పదునైన దంతాలను మాత్రమే ఉపయోగిస్తాయి / They only use sharp teeth", "వాటికి దంతాలే ఉండవు / They have no teeth at all"],
      correctIndex: 0,
      explanation: "సరైనది! ముందు పదునైన దంతాలు మాంసాన్ని చీల్చడానికి, వెనుక చదునైన దంతాలు మొక్కల ఆహారాన్ని నమలడానికి సహాయపడతాయి — Correct! Sharp front teeth tear meat like a carnivore's, while flat back teeth chew plant food like a herbivore's."
    },
    {
      question: "కింది వాటిలో సర్వభక్షక జంతువుకు ఉదాహరణ ఏది?",
      english:  "Which of these animals is an example of an omnivore?",
      options:  ["సింహం / Lion", "ఆవు / Cow", "ఎలుగుబంటు / Bear", "జిరాఫీ / Giraffe"],
      correctIndex: 2,
      explanation: "సరైనది! ఎలుగుబంటు మొక్కలు మరియు మాంసం రెండింటినీ తినే సర్వభక్షక జంతువు — Correct! Bears are omnivores — they eat both plant foods like berries and meat like fish."
    },
  ],

  foodChain: [
    {
      question: "ప్రతి ఆహారపు గొలుసు ప్రారంభంలో ఉండే ప్రధాన శక్తి మూలం ఏది?",
      english:  "What is the primary source of energy at the start of every food chain?",
      options:  ["చంద్రుడు / The Moon", "సూర్యుడు / The Sun", "నీరు / Water", "మట్టి / Soil"],
      correctIndex: 1,
      explanation: "సరైనది! ప్రతి ఆహారపు గొలుసు సూర్యుడు అనే ప్రధాన శక్తి మూలంతో మొదలవుతుంది — Correct! Every food chain starts with the Sun, the primary source of energy."
    },
    {
      question: "సూర్యుడు → గడ్డి → జింక → సింహం అనే ఆహారపు గొలుసులో గడ్డి పాత్ర ఏమిటి?",
      english:  "In the food chain Sun → Grass → Deer → Lion, what role does the grass play?",
      options:  ["మాంసాహారి / Carnivore", "ఉత్పత్తిదారు, కిరణజన్య సంయోగక్రియ ద్వారా తన ఆహారాన్ని తానే తయారు చేసుకుంటుంది / Producer, which makes its own food by photosynthesis", "స్కావెంజర్ / Scavenger", "సర్వభక్షకుడు / Omnivore"],
      correctIndex: 1,
      explanation: "సరైనది! గడ్డి వంటి ఆకుపచ్చ మొక్కలు కిరణజన్య సంయోగక్రియ ద్వారా తమ ఆహారాన్ని తామే తయారు చేసుకుంటాయి కాబట్టి వాటిని ఉత్పత్తిదారులు లేదా ఆటోట్రాఫ్‌లు అంటారు — Correct! Green plants like grass make their own food through photosynthesis, so they're called producers, or autotrophs."
    },
    {
      question: "ఆహారపు గొలుసులో ఒక్క లింక్ తెగిపోయినా ప్రకృతి సమతుల్యతకు ఏమవుతుంది?",
      english:  "What happens to the balance of nature if even one link in a food chain is broken?",
      options:  ["ఏమీ మారదు / Nothing changes at all", "అది మొత్తం గొలుసును, ప్రకృతి సమతుల్యతను దెబ్బతీస్తుంది / It disturbs the whole chain and upsets the balance of nature", "తక్షణమే మరింత శక్తి సృష్టించబడుతుంది / More energy is created instantly", "సూర్యుడు ప్రకాశించడం ఆగిపోతుంది / The Sun stops shining"],
      correctIndex: 1,
      explanation: "సరైనది! ఒక్క లింక్ తెగిపోయినా అది మొత్తం ఆహారపు గొలుసును, ప్రకృతి సమతుల్యతను దెబ్బతీస్తుంది — Correct! Breaking even one link disrupts the whole chain and upsets the balance of nature."
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
          🦁 జంతువులు ఏమి తింటాయి? — What Do Animals Eat?
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
                  https://games.vrplay.in/videos/%E0%B0%9C%E0%B0%82%E0%B0%A4%E0%B1%81%E0%B0%B5%E0%B1%81%E0%B0%B2%E0%B1%81_%E0%B0%8F%E0%B0%AE%E0%B0%BF_%E0%B0%A4%E0%B0%BF%E0%B0%82%E0%B0%9F%E0%B0%BE%E0%B0%AF%E0%B0%BF_.mp4</code>
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
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem" }}>🦁</div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"clamp(1.2rem,2vw,1.6rem)", fontWeight:900, color:C.text,
          marginBottom:6, fontFamily:"'Fredoka One',cursive" }}>Loading Quiz{dots}</div>
        <div style={{ color:C.muted, fontSize:"0.9rem", fontWeight:600 }}>Preparing your animal diet questions…</div>
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
            🦁 Quiz Time
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
export default function AnimalDietQuizGame() {
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