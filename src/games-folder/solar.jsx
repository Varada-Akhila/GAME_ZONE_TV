import VideoQuizTemplate from "./VideoQuizTemplate";

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

export default function SolarSystemQuizGame() {
  return (
    <VideoQuizTemplate
      videoSrc={VIDEO_SRC}
      topics={TOPICS}
      theme={C}
      title="🪐 Solar System Adventure"
      loadingIcon="🪐"
      loadingText="Preparing your space questions…"
    />
  );
}
