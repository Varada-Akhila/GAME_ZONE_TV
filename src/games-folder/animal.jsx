import VideoQuizTemplate from "./VideoQuizTemplate";

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

export default function AnimalDietQuizGame() {
  return (
    <VideoQuizTemplate
      videoSrc={VIDEO_SRC}
      topics={TOPICS}
      theme={C}
      title="🦁 జంతువులు ఏమి తింటాయి? — What Do Animals Eat?"
      loadingIcon="🦁"
      loadingText="Preparing your animal eating habits questions…"
    />
  );
}
