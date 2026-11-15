import VideoQuizTemplate from "./VideoQuizTemplate";

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

export const config = {
  videoSrc: VIDEO_SRC,
  topics: TOPICS,
  theme: C,
  title: "🫀 Body Parts & Health",
  loadingIcon: "🫀",
  loadingText: "Preparing your body parts & health questions…",
  numQuestions: 5
};

export default function VideoQuizGame() {
  return (
    <VideoQuizTemplate {...config} />
  );
}
