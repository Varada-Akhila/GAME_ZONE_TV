import VideoQuizTemplate from "./VideoQuizTemplate";

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

export const config = {
  videoSrc: VIDEO_SRC,
  topics: TOPICS,
  theme: C,
  title: "💧 Endless Journey of Water",
  loadingIcon: "💧",
  loadingText: "Preparing your water cycle questions…",
  numQuestions: 5
};

export default function WaterJourneyQuizGame() {
  return (
    <VideoQuizTemplate {...config} />
  );
}
