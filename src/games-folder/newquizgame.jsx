import VideoQuizTemplate from "./VideoQuizTemplate";

const VIDEO_SRC = "https://games.vrplay.in/videos/Untitled_design.mp4";
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
   Questions from the video — grouped by topic.
   Each session picks exactly ONE random question from each topic group,
   so you NEVER get two questions about the same thing in one quiz.
───────────────────────────────────────────────────────────────────────── */
const TOPICS = {

  banyan: [
    {
      question: "భారతదేశ జాతీయ వృక్షం ఏది?",
      english:  "What is the national tree of India?",
      options:  ["మామిడి చెట్టు / Mango", "వేప చెట్టు / Neem", "మర్రి చెట్టు / Banyan", "నేరేడు చెట్టు / Jamun"],
      correctIndex: 2,
      explanation: "Teacher said: భారతదేశ జాతీయ వృక్షం మర్రి చెట్టు — The national tree of India is the Banyan tree."
    },
    {
      question: "మర్రి చెట్టు కొమ్మల నుండి ఏమి కిందికి పెరుగుతాయి?",
      english:  "What grows downward from the Banyan tree's branches?",
      options:  ["పూలు / Flowers", "ఆకులు / Leaves", "కాయలు / Fruits", "వేర్లు / Roots"],
      correctIndex: 3,
      explanation: "Teacher said: దీని కొమ్మలనుండి వేర్లు కిందికి పెరుగుతాయ్ — Roots grow downward from its branches."
    },
    {
      question: "మర్రి చెట్టు గురించి టీచర్ ఏమి చెప్పింది?",
      english:  "What did the teacher say about the Banyan tree?",
      options:  ["చిన్నగా ఉంటుంది / It is small", "తొందరగా పెరుగుతుంది / It grows fast", "చాలా సంవత్సరాలు జీవిస్తుంది / Lives for many years", "పూలు వస్తాయి / It gives flowers"],
      correctIndex: 2,
      explanation: "Teacher said: చాలా సంవత్సరాలు జీవిస్తుంది — The Banyan tree lives for many years."
    },
  ],

  tiger: [
    {
      question: "భారతదేశ జాతీయ జంతువు ఏది?",
      english:  "What is the national animal of India?",
      options:  ["సింహం / Lion", "రాయల్ బెంగాల్ పులి / Royal Bengal Tiger", "ఏనుగు / Elephant", "చిరుత / Cheetah"],
      correctIndex: 1,
      explanation: "Teacher said: భారతదేశ జాతీయ జంతువు రాయల్ బెంగాల్ పులి — The national animal is the Royal Bengal Tiger."
    },
    {
      question: "పులి చాలా ______ మరియు ______ అని టీచర్ చెప్పింది.",
      english:  "The teacher said the Tiger is very ______ and ______.",
      options:  ["అందంగా మరియు పెద్దగా / Beautiful and Big", "శక్తివంతంగా మరియు వేగంగా / Strong and Fast", "నిద్రపోయేది మరియు శాంతంగా / Sleepy and Calm", "తెలివిగా మరియు చిన్నగా / Smart and Small"],
      correctIndex: 1,
      explanation: "Teacher said: చాలా శక్తివంతమైనది మరియు వేగవంతమైనది — Very strong and very fast."
    },
    {
      question: "రాయల్ బెంగాల్ పులి గురించి టీచర్ ఏ గుణాలు చెప్పింది?",
      english:  "What qualities did the teacher mention about the Royal Bengal Tiger?",
      options:  ["అందం మరియు తెలివి / Beauty & Intelligence", "శబ్దం మరియు భయం / Sound & Fear", "పరిమాణం మరియు రంగు / Size & Color", "శక్తి మరియు వేగం / Strength & Speed"],
      correctIndex: 3,
      explanation: "Teacher said: చాలా శక్తివంతమైనది మరియు వేగవంతమైనది — Very strong and very fast."
    },
  ],

  mango: [
    {
      question: "భారతదేశ జాతీయ పండు ఏది?",
      english:  "What is the national fruit of India?",
      options:  ["అరటి / Banana", "మామిడి / Mango", "జామ / Guava", "నిమ్మ / Lemon"],
      correctIndex: 1,
      explanation: "Teacher said: భారతదేశ జాతీయ ఫలం మామిడి — The national fruit of India is Mango."
    },
    {
      question: "టీచర్ మామిడిని ఏమని పిలిచింది?",
      english:  "What did the teacher call the Mango?",
      options:  ["మధుర పండు / Sweet fruit", "పసుపు పండు / Yellow fruit", "పండ్ల రాజు / King of Fruits", "అడవి పండు / Forest fruit"],
      correctIndex: 2,
      explanation: "Teacher said: దీనిని పండ్లరాజు అని కూడా అంటారు — It is also called the King of Fruits."
    },
    {
      question: "మామిడి పండు రుచి ఎలా ఉంటుందని టీచర్ చెప్పింది?",
      english:  "How did the teacher describe the taste of Mango?",
      options:  ["చేదుగా / Bitter", "కారంగా / Spicy", "పులుపుగా / Sour", "తీయగా మరియు రుచిగా / Sweet and Tasty"],
      correctIndex: 3,
      explanation: "Teacher said: పండు చాలా తీయగా మరియు రుచిగా ఉంటుంది — Very sweet and tasty."
    },
  ],

  lotus: [
    {
      question: "భారతదేశ జాతీయ పుష్పం ఏది?",
      english:  "What is the national flower of India?",
      options:  ["కమలం / Lotus", "గులాబీ / Rose", "మల్లె / Jasmine", "చేమంతి / Chrysanthemum"],
      correctIndex: 0,
      explanation: "Teacher said: భారతదేశ జాతీయ పుష్పం కమలం — The national flower of India is Lotus."
    },
    {
      question: "కమలం దేనికి ప్రతీక అని టీచర్ చెప్పింది?",
      english:  "What is the Lotus a symbol of, as the teacher said?",
      options:  ["శక్తి మరియు ధైర్యం / Strength & Courage", "వేగం మరియు తెలివి / Speed & Intelligence", "అందం మరియు పవిత్రత / Beauty and Purity", "సంతోషం మరియు సంపద / Happiness & Wealth"],
      correctIndex: 2,
      explanation: "Teacher said: ఇది అందమ్ మరియు పవిత్రతకు ప్రతీక — It is a symbol of beauty and purity."
    },
    {
      question: "టీచర్ కమలం గురించి చెప్పిన మాటలు ఏవి?",
      english:  "Which words did the teacher use to describe the Lotus?",
      options:  ["వేగంగా పెరుగుతుంది / Grows fast", "అందం మరియు పవిత్రత / Beauty and Purity", "అడవిలో పెరుగుతుంది / Grows in forest", "ఎర్రగా ఉంటుంది / It is red"],
      correctIndex: 1,
      explanation: "Teacher said: ఇది అందమ్ మరియు పవిత్రతకు ప్రతీక — Symbol of beauty and purity."
    },
  ],

  peacock: [
    {
      question: "భారతదేశ జాతీయ పక్షి ఏది?",
      english:  "What is the national bird of India?",
      options:  ["చిలుక / Parrot", "కాకి / Crow", "గువ్వ / Pigeon", "నెమలి / Peacock"],
      correctIndex: 3,
      explanation: "Teacher said: భారతదేశ జాతీయ పక్షి నెమలి — The national bird of India is the Peacock."
    },
    {
      question: "నెమలి ఏ కాలంలో నృత్యం చేస్తుంది అని టీచర్ చెప్పింది?",
      english:  "In which season does the Peacock dance, as the teacher said?",
      options:  ["వర్షా కాలం / Rainy season", "వేసవి కాలం / Summer", "వసంత కాలం / Spring", "శీతాకాలం / Winter"],
      correctIndex: 0,
      explanation: "Teacher said: వర్షా కాలం లో నెమలి నృత్యం చేస్తుంది — Peacock dances in the rainy season."
    },
    {
      question: "వర్షా కాలంలో నెమలి ఏమి చేస్తుంది?",
      english:  "What does the Peacock do in the rainy season?",
      options:  ["నిద్రపోతుంది / Sleeps", "నృత్యం చేస్తుంది / Dances", "పాటలు పాడుతుంది / Sings", "ఆహారం వెతుకుతుంది / Searches for food"],
      correctIndex: 1,
      explanation: "Teacher said: వర్షా కాలం లో నెమలి నృత్యం చేస్తుంది — The Peacock dances in the rainy season."
    },
  ],
};

/* Pick exactly ONE random question from each topic — 5 totally different questions */
/* ─────────────────────────────────────────────────────────────────────────
   Per-topic queues — guarantees no question repeats until every question
   in that topic has been shown at least once. Works across Play Again too.
───────────────────────────────────────────────────────────────────────── */

export default function VideoQuizGame() {
  return (
    <VideoQuizTemplate
      videoSrc={VIDEO_SRC}
      topics={TOPICS}
      theme={C}
      title="🎬 Watch & Learn"
      loadingIcon="🐅"
      loadingText="Preparing your national symbols questions…"
    />
  );
}
