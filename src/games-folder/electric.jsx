import VideoQuizTemplate from "./VideoQuizTemplate";

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

export const config = {
  videoSrc: VIDEO_SRC,
  topics: TOPICS,
  theme: C,
  title: "⚡ Invisible to Visible Tech",
  loadingIcon: "⚡",
  loadingText: "Preparing your electricity questions…",
  numQuestions: 5
};

export default function VideoQuizGame() {
  return (
    <VideoQuizTemplate {...config} />
  );
}
