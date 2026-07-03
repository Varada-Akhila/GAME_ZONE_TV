import VideoQuizTemplate from "./VideoQuizTemplate";

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

export default function NaturalDisastersQuiz() {
  return (
    <VideoQuizTemplate
      videoSrc={VIDEO_SRC}
      topics={TOPICS}
      theme={C}
      title="🌋 ప్రకృతి వైపరీత్యాలు — Natural Disasters"
      loadingIcon="🌋"
      loadingText="Preparing your natural disaster safety questions…"
    />
  );
}
