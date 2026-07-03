import VideoQuizTemplate from "./VideoQuizTemplate";

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
      explanation: "సరైనది! వంగి ఉన్న భూమి సూర్యుని చుట్టూ తిరుగుతున్నప్పుడు వేర్వేరు భాగలు ఎక్కువ లేదా తక్కువ సూర్యకాంతిని పొందటం వలన రుతువులు వస్తాయి — Correct! Because Earth is tilted while it revolves around the Sun, different parts get more or less sunlight, creating the seasons."
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
      options:  ["రాత్రి పగటి కంటే చాలా పెద్దదిగా ఉంటుంది / The night is much longer than the day", "పగలు మరియు రాత్రి సమానంగా ఉంటాయి / Day and night are equal in length", "సూర్యుడు అసలు కనిపించడు / The Sun does not appear at all", "ఆ రోజు మంచు తప్పక куруస్తుంది / It is bound to snow that day"],
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
      question: "మన దేశంలో సాధారణంగా నైరుతి రుతుపవనాల వల్ల వర్షాలు కురిసే కాలం ఏది?",
      english:  "In India, which season typically brings rain due to Southwest Monsoon?",
      options:  ["శీతాకాలం / Winter", "వేసవికాలం / Summer", "వర్షాకాలం (మాన్సూన్) / Monsoon (Rainy Season)", "వసంతకాలం / Spring"],
      correctIndex: 2,
      explanation: "సరైనది! భారతదేశంలో జూన్ నుండి సెప్టెంబర్ వరకు వర్షాకాలం ఉంటుంది, దీనినే మాన్సూన్ అంటారు — Correct! Monsoon brings heavy rain to India, lasting from June to September."
    },
    {
      question: "శీతాకాలంలో లడఖ్ లేదా హిమాలయాల్లో వాతావరణం ఎలా ఉంటుంది?",
      english:  "What is the weather like in Ladakh or Himalayas during winter?",
      options:  ["విపరీతమైన వేడి / Blazing hot", "చాలా చల్లగా మరియు మంచు కురుస్తుంది / Extremely cold and snowy", "ధూళి తుఫాను వస్తుంది / Dust storm comes", "సముద్రపు గాలులు వీస్తాయి / Sea breeze blows"],
      correctIndex: 1,
      explanation: "సరైనది! హిమాలయ ప్రాంతాలలో శీతాకాలం చాలా చల్లగా, మంచుతో కప్పబడి ఉంటుంది — Correct! Winters in the Himalayas are freezing cold and covered in thick snow."
    },
  ],

  wildlifeBehavior: [
    {
      question: "శీతాకాలంలో పక్షులు వెచ్చని ప్రాంతాలకు వలస వెళ్ళడాన్ని ఏమంటారు?",
      english:  "What is it called when birds fly to warmer places during winter?",
      options:  ["వలసపోవడం (మైగ్రేషన్) / Migration", "ఈత కొట్టడం / Swimming", "హైబర్నేషన్ / Hibernation", "ఆటలు ఆడటం / Playing"],
      correctIndex: 0,
      explanation: "సరైనది! శీతాకాలంలో ఆహారం, వెచ్చదనం కోసం పక్షులు వేలాది కిలోమీటర్లు ప్రయాణించడాన్ని వలసపోవడం (మైగ్రేషన్) అంటారు — Correct! When birds travel long distances in winter for food and warmth, it's called migration."
    },
    {
      question: "చెట్లు ఏ రుతువులో తమ ఆకులను రాల్చి చలికాలానికి సిద్ధమవుతాయి?",
      english:  "During which season do trees drop their leaves to prepare for winter?",
      options:  ["వసంతకాలం / Spring", "వేసవికాలం / Summer", "శరద్రుతువు (ఆటమ్) / Autumn", "వర్షాకాలం / Monsoon"],
      correctIndex: 2,
      explanation: "సరైనది! శరద్రుతువులో ఆకులు రాల్చడం ద్వారా చెట్లు నీటిని ఆదా చేసుకుని చలికాలాన్ని తట్టుకుంటాయి — Correct! In autumn, trees drop leaves to save water and energy for the upcoming cold."
    },
    {
      question: "శీతాకాలంలో కొన్ని జంతువులు గుహల్లోకి వెళ్లి గాఢ నిద్రపోవడాన్ని ఏమంటారు?",
      english:  "What do some animals do inside caves during winter?",
      options:  ["గాఢ నిద్రపోతాయి, దీనిని హైబర్నేషన్ అంటారు / They go into a deep sleep called hibernation", "ఎండలో బయట ఆడుకుంటాయి / They play outside in the hot sun", "విమానంలో ఎగురుతూ ఉంటాయి / They keep flying around in an airplane", "check నాటుతూ ఉంటాయి / They spend their time planting trees"],
      correctIndex: 0,
      explanation: "సరైనది! చలి, మంచుతో నిండిన శీతాకాలంలో కొన్ని జంతువులు గుహల్లో గాఢ నిద్రపోతాయి, దీనినే హైబర్నేషన్ అంటారు — Correct! During the cold, snowy winter, some animals go into a deep sleep in their caves, called hibernation."
    },
  ],
};

export default function SeasonsQuizGame() {
  return (
    <VideoQuizTemplate
      videoSrc={VIDEO_SRC}
      topics={TOPICS}
      theme={C}
      title="🌦️ రుతువుల మాయాజాలం! — The Magic of Seasons!"
      loadingIcon="🌦️"
      loadingText="Preparing your seasons questions…"
      numQuestions={NUM_Q}
    />
  );
}