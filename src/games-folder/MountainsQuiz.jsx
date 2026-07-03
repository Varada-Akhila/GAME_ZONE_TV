import React, { useState, useEffect } from "react";
// import MountainVideo from "../assets/mountains-video.mp4";
// import page1 from "../assets/mountains/page1.png";
// import page2 from "../assets/mountains/page2.png";
// import page3 from "../assets/mountains/page3.png";
// import page4 from "../assets/mountains/page4.png";
// import page5 from "../assets/mountains/page5.png";

const MountainVideo="https://games.vrplay.in/videos/mountains.mp4";
const page1="https://games.vrplay.in/images/image5.jpeg";
const page2="https://games.vrplay.in/images/image1.jpeg";
const page3="https://games.vrplay.in/images/image2.jpeg";
const page4="https://games.vrplay.in/images/image3.jpeg";
const page5="https://games.vrplay.in/images/image4.jpeg";


const ALL_QUESTIONS = [

/* EVEREST */

{
    question:"Which mountain is the highest in the world?",
    answer:"Mount Everest",
    options:["Mount Everest","K2","Makalu","Annapurna"]
},

{
    question:"Mount Everest is located in which country?",
    answer:"Nepal",
    options:["Nepal","India","Pakistan","China"]
},

{
    question:"Mount Everest belongs to which continent?",
    answer:"Asia",
    options:["Asia","Europe","Africa","Australia"
]
},

{
    question:"What is the height of Mount Everest?",
    answer:"8848 m",
    options:["8848 m","7611 m","6961 m","5895 m"]
},

{
    question:"Which mountain is known as the Roof of the World?",
    answer:"Mount Everest",
    options:["Mount Everest","K2","Makalu","Lhotse"]
},

/* K2 */

{
    question:"Which mountain is the second highest in the world?",
    answer:"K2",
    options:["K2","Makalu","Lhotse","Cho Oyu"]
},

{
    question:"K2 is located in which country?",
    answer:"Pakistan",
    options:["Pakistan","Nepal","India","China"]
},

{
    question:"K2 is also known as?",
    answer:"Savage Mountain",
    options:["Savage Mountain","Snow King","White Giant","Rock Peak"]
},

{
    question:"K2 belongs to which continent?",
    answer:"Asia",
    options:["Asia","Europe","Africa","Australia"]
},

{
    question:"Which mountain is harder to climb than Everest?",
    answer:"K2",
    options:["K2","Elbrus","Fuji","Annapurna"]
},

/* KANGCHENJUNGA */

{
    question:"Which mountain is the third highest in the world?",
    answer:"Kangchenjunga",
    options:["Kangchenjunga","Lhotse","Makalu","Annapurna"]
},

{
    question:"Kangchenjunga lies between India and which country?",
    answer:"Nepal",
    options:["Nepal","China","Pakistan","Bhutan"]
},

{
    question:"Kangchenjunga belongs to which continent?",
    answer:"Asia",
    options:["Asia","Europe","Africa","Australia"]
},

{
    question:"Kangchenjunga is part of which mountain range?",
    answer:"Himalayas",
    options:["Himalayas","Alps","Andes","Rockies"]
},

{
    question:"Which mountain is the third tallest on Earth?",
    answer:"Kangchenjunga",
    options:["Kangchenjunga","Lhotse","Makalu","K2"]
},

/* LHOTSE */

{
    question:"Which mountain shares the Everest massif?",
    answer:"Lhotse",
    options:["Lhotse","Makalu","K2","Cho Oyu"]
},

{
    question:"Lhotse belongs to which mountain range?",
    answer:"Himalayas",
    options:["Himalayas","Andes","Alps","Rockies"]
},

{
    question:"Lhotse belongs to which continent?",
    answer:"Asia",
    options:["Asia","Europe","Africa","Australia"]
},

{
    question:"Lhotse is located near which mountain?",
    answer:"Mount Everest",
    options:["Mount Everest","K2","Elbrus","Denali"]
},

{
    question:"Which mountain is the fourth highest in the world?",
    answer:"Lhotse",
    options:["Lhotse","Makalu","Cho Oyu","Annapurna"]
},

/* MAKALU */

{
    question:"Which mountain is famous for its pyramid shape?",
    answer:"Makalu",
    options:["Makalu","Everest","Fuji","Elbrus"]
},

{
    question:"Makalu is part of which range?",
    answer:"Himalayas",
    options:["Himalayas","Alps","Andes","Rockies"]
},

{
    question:"Makalu belongs to which continent?",
    answer:"Asia",
    options:["Asia","Europe","Africa","Australia"]
},

{
    question:"Which mountain is the fifth highest in the world?",
    answer:"Makalu",
    options:["Makalu","Lhotse","Cho Oyu","Annapurna"]
},

{
    question:"Makalu is located near which famous mountain?",
    answer:"Mount Everest",
    options:["Mount Everest","Kilimanjaro","Denali","Elbrus"]
},

/* CHO OYU */

{
    question:"Which mountain is considered easier among 8000m peaks?",
    answer:"Cho Oyu",
    options:["Cho Oyu","K2","Annapurna","Nanga Parbat"]
},

{
    question:"Cho Oyu lies between Nepal and which country?",
    answer:"China",
    options:["China","India","Pakistan","Japan"
]
},

{
    question:"Cho Oyu belongs to which continent?",
    answer:"Asia",
    options:["Asia","Europe","Africa","Australia"]
},

{
    question:"Which mountain is the sixth highest in the world?",
    answer:"Cho Oyu",
    options:["Cho Oyu","Makalu","Lhotse","K2"]
},

{
    question:"Cho Oyu is part of which mountain range?",
    answer:"Himalayas",
    options:["Himalayas","Andes","Alps","Rockies"]
},
/* NANGA PARBAT */

{
    question:"Which mountain is known as the Killer Mountain?",
    answer:"Nanga Parbat",
    options:["Nanga Parbat","Makalu","Everest","Cho Oyu"]
},

{
    question:"Nanga Parbat is located in which country?",
    answer:"Pakistan",
    options:["Pakistan","Nepal","India","China"]
},

{
    question:"Nanga Parbat belongs to which continent?",
    answer:"Asia",
    options:["Asia","Europe","Africa","Australia"]
},

{
    question:"Nanga Parbat is part of which mountain range?",
    answer:"Himalayas",
    options:["Himalayas","Alps","Andes","Rockies"]
},

{
    question:"Which mountain is famous for its dangerous climbing routes?",
    answer:"Nanga Parbat",
    options:["Nanga Parbat","Elbrus","Fuji","Kilimanjaro"]
},

/* ANNAPURNA */

{
    question:"Which mountain is famous for trekking circuits?",
    answer:"Annapurna",
    options:["Annapurna","K2","Makalu","Elbrus"]
},

{
    question:"Annapurna is located in which country?",
    answer:"Nepal",
    options:["Nepal","India","Pakistan","China"]
},

{
    question:"Annapurna belongs to which continent?",
    answer:"Asia",
    options:["Asia","Europe","Africa","Australia"]
},

{
    question:"Annapurna belongs to which mountain range?",
    answer:"Himalayas",
    options:["Himalayas","Andes","Alps","Rockies"]
},

{
    question:"Which mountain has one of the highest fatality rates among climbers?",
    answer:"Annapurna",
    options:["Annapurna","Everest","Fuji","Denali"]
},

/* MOUNT ELBRUS */

{
    question:"Which is the highest mountain in Europe?",
    answer:"Mount Elbrus",
    options:["Mount Elbrus","Everest","K2","Denali"]
},

{
    question:"Mount Elbrus is located in which country?",
    answer:"Russia",
    options:["Russia","Germany","Italy","France"]
},

{
    question:"Mount Elbrus belongs to which continent?",
    answer:"Europe",
    options:["Europe","Asia","Africa","Australia"]
},

{
    question:"Mount Elbrus is part of which mountain range?",
    answer:"Caucasus",
    options:["Caucasus","Himalayas","Andes","Alps"]
},

{
    question:"Which mountain is the highest peak in Europe?",
    answer:"Mount Elbrus",
    options:["Mount Elbrus","Mont Blanc","Everest","K2"]
},

/* VINSON MASSIF */

{
    question:"Which mountain is the highest peak in Antarctica?",
    answer:"Vinson Massif",
    options:["Vinson Massif","Denali","Elbrus","Puncak Jaya"]
},

{
    question:"Vinson Massif belongs to which continent?",
    answer:"Antarctica",
    options:["Antarctica","Europe","Asia","Africa"]
},

{
    question:"Vinson Massif is famous for being?",
    answer:"Extremely Cold",
    options:["Extremely Cold","Volcanic","Tropical","Desert"]
},

{
    question:"Which mountain is covered with snow throughout the year?",
    answer:"Vinson Massif",
    options:["Vinson Massif","Fuji","Elbrus","Kilimanjaro"]
},

{
    question:"Which continent contains Vinson Massif?",
    answer:"Antarctica",
    options:["Antarctica","Asia","Europe","Africa"]
},

/* PUNCAK JAYA */

{
    question:"Which mountain is located in Indonesia?",
    answer:"Puncak Jaya",
    options:["Puncak Jaya","K2","Makalu","Everest"]
},

{
    question:"Puncak Jaya belongs to which continent?",
    answer:"Oceania",
    options:["Oceania","Asia","Europe","Africa"]
},

{
    question:"Puncak Jaya is famous for having what near the equator?",
    answer:"Glaciers",
    options:["Glaciers","Volcanoes","Forests","Deserts"]
},

{
    question:"Which mountain is the highest peak in Oceania?",
    answer:"Puncak Jaya",
    options:["Puncak Jaya","Fuji","Kilimanjaro","Denali"]
},

{
    question:"Puncak Jaya is located on which island region?",
    answer:"New Guinea",
    options:["New Guinea","Borneo","Java","Sumatra"]
},

/* DENALI */

{
    question:"What is the highest mountain in North America?",
    answer:"Denali",
    options:["Denali","Everest","Elbrus","Kilimanjaro"]
},

{
    question:"Denali is located in which country?",
    answer:"USA",
    options:["USA","Canada","Mexico","Russia"]
},

{
    question:"Denali belongs to which continent?",
    answer:"North America",
    options:["North America","Europe","Asia","Africa"]
},

{
    question:"Denali was formerly known as?",
    answer:"Mount McKinley",
    options:["Mount McKinley","Mount Logan","Mount Cook","Mount Hood"]
},

{
    question:"Which mountain is the tallest in North America?",
    answer:"Denali",
    options:["Denali","Elbrus","K2","Fuji"]
},

/* MOUNT FUJI */

{
    question:"Which mountain is a famous volcano in Japan?",
    answer:"Mount Fuji",
    options:["Mount Fuji","K2","Everest","Elbrus"]
},

{
    question:"Mount Fuji is located in which country?",
    answer:"Japan",
    options:["Japan","China","India","Nepal"]
},

{
    question:"Mount Fuji belongs to which continent?",
    answer:"Asia",
    options:["Asia","Europe","Africa","Australia"]
},

{
    question:"Which mountain appears on many Japanese postcards and paintings?",
    answer:"Mount Fuji",
    options:["Mount Fuji","Denali","K2","Everest"]
},

{
question:"Mount Fuji is what type of mountain?",
answer:"Volcano",
options:["Volcano","Plateau","Hill","Canyon"]},

/* KILIMANJARO */

{
    question:"Which mountain is the highest in Africa?",
    answer:"Kilimanjaro",
    options:["Kilimanjaro","Everest","Elbrus","Denali"]
},

{
    question:"Kilimanjaro is located in which country?",
    answer:"Tanzania",
    options:["Tanzania","Kenya","Uganda","South Africa"]
},

{
    question:"Kilimanjaro belongs to which continent?",
    answer:"Africa",
    options:["Africa","Asia","Europe","Australia"]
},

{
    question:"Kilimanjaro is famous for being a?",
    answer:"Volcano",
    options:["Volcano","Desert","River","Valley"]
},

{
    question:"Which mountain is the tallest in Africa?",
    answer:"Kilimanjaro",
    options:["Kilimanjaro","Fuji","Denali","Elbrus"]
},

/* ACONCAGUA */

{
    question:"Which mountain is the highest in South America?",
    answer:"Aconcagua",
    options:["Aconcagua","Denali","Kilimanjaro","Elbrus"]
},

{
    question:"Aconcagua is located in which country?",
    answer:"Argentina",
    options:["Argentina","Brazil","Chile","Peru"]
},

{
    question:"Aconcagua belongs to which continent?",
    answer:"South America",
    options:["South America","North America","Europe","Africa"]
},

{
    question:"Aconcagua belongs to which mountain range?",
    answer:"Andes",
    options:["Andes","Himalayas","Alps","Caucasus"]
},

{
    question:"Which mountain is the tallest in South America?",
    answer:"Aconcagua",
    options:["Aconcagua","Everest","Denali","K2"]
}
];
/* =========================================
   COMPONENT START
========================================= */

export default function MountainsQuiz() {

const [videoEnded,setVideoEnded] = useState(false);
const [startQuiz,setStartQuiz] = useState(false);
const [quizCompleted,setQuizCompleted] = useState(false);
const [questions,setQuestions] = useState([]);
const [currentQuestion,setCurrentQuestion] = useState(0);
const [score,setScore] = useState(0);
const [selectedOption,setSelectedOption] = useState(0);
const [options,setOptions] = useState([]);
const [message,setMessage] = useState("");
const [scoreHistory,setScoreHistory] = useState(JSON.parse(localStorage.getItem("mountainQuizHistory") || "[]"));
const [showImages, setShowImages] = useState(false);
const [currentImage, setCurrentImage] = useState(0);
const [selectedMenu, setSelectedMenu] = useState(0);
const mountainImages = [page1,page2,page3,page4,page5,];
const isMobile = window.innerWidth <= 768;

/* =========================================
   SHUFFLE ARRAY
========================================= */

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1;i > 0;i--) {
    const j =Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j],arr[i]];
  }
  return arr;
};

/* =========================================
   START QUIZ
========================================= */

const beginQuiz = () => {

  const shuffled =shuffleArray(ALL_QUESTIONS).slice(0,25).map(q => ({...q,options: shuffleArray(q.options)}));

  setQuestions(shuffled);
  setOptions(shuffled[0].options);
  setCurrentQuestion(0);
  setScore(0);
  setSelectedOption(0);
  setQuizCompleted(false);
  setStartQuiz(true);
  setMessage("");
};

/* =========================================
   NEXT QUESTION
========================================= */

const moveToNextQuestion =(selectedAnswer) => {

  const current =questions[currentQuestion];
  const isCorrect =selectedAnswer ===current.answer;
  const updatedScore =isCorrect ? score + 1 : score;

  if (isCorrect) {
    setScore(updatedScore);
    setMessage("✅ Correct!");
  } else {
    setMessage(`❌ Correct Answer: ${current.answer}`);
  }

  setTimeout(() => {
      const nextIndex =currentQuestion + 1;
      if (nextIndex >=questions.length) {
        const history = [
          {
            score:updatedScore,
            total:questions.length,
            date:new Date().toLocaleString()
          },
          ...scoreHistory

        ];

        setScoreHistory(history);
        localStorage.setItem("mountainQuizHistory",JSON.stringify(history));
        setQuizCompleted(true);
        return;
      }

      const nextQuestion =questions[nextIndex];

      setCurrentQuestion(nextIndex);
      setOptions(nextQuestion.options);
      setSelectedOption(0);
      setMessage("");
    },
    1200
  );
};

/* =========================================
   PERFORMANCE TEXT
========================================= */

const getPerformanceText =() => {

  const percentage =(score / questions.length) * 100;

  if (percentage >= 90) {
    return "🏆 Mountain Legend";
  }

  if (percentage >= 75) {
    return "⭐⭐⭐ Peak Master";
  }

  if (percentage >= 50) {
    return "⭐⭐ Great Explorer";
  }

  return "⭐ Keep Learning";
};

/* =========================================
   TV REMOTE CONTROLS
========================================= */

useEffect(() => {

  const handleKey =(e) => {

      /* START SCREEN */
      // if (videoEnded && !startQuiz && e.key === "Enter") {
      //   beginQuiz();
      //   return;
      // }
      /* START SCREEN */
      if (showImages) {
        if (e.key === "ArrowRight") {
          setCurrentImage(prev =>
            prev === mountainImages.length - 1 ? 0 : prev + 1);
        }

        if (e.key === "ArrowLeft") {
          setCurrentImage(prev =>
            prev === 0 ? mountainImages.length - 1 : prev - 1);
        }

        if (e.key === "Escape" || e.key === "Backspace") {
          setShowImages(false);
        }

        return;
      }
      if (videoEnded && !startQuiz && !showImages) {

        if (e.key === "ArrowUp") {
          setSelectedMenu(prev => prev === 0 ? 2 : prev - 1);
        }

        if (e.key === "ArrowDown") {
          setSelectedMenu(prev => prev === 2 ? 0 : prev + 1);
        }

        if (e.key === "Enter") {

          if (selectedMenu === 0) {
            beginQuiz();
          }

          if (selectedMenu === 1) {
            setShowImages(true);
          }

          if (selectedMenu === 2) {
            setVideoEnded(false);
          }
        }

        return;
      }

      /* QUIZ SCREEN */

      if (startQuiz && !quizCompleted) {
        if (e.key === "ArrowUp") {
          setSelectedOption((prev) =>
              prev === 0 ? options.length - 1 : prev - 1
          );
        }

        if (e.key === "ArrowDown") {
          setSelectedOption((prev) =>
              prev ===options.length - 1 ? 0 : prev + 1
          );
        }

        if (e.key ==="Enter") {
          moveToNextQuestion( options[selectedOption]);
        }
      }

      /* RESULT SCREEN */

      if (quizCompleted && e.key === "Enter") {
        beginQuiz();
      }

    };

  window.addEventListener("keydown",handleKey);
  return () =>
    window.removeEventListener("keydown",handleKey);

}, [videoEnded,startQuiz,quizCompleted,selectedOption,options,questions,currentQuestion,showImages,currentImage]);
/* =========================================
   VIDEO SCREEN
========================================= */

if (!videoEnded) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background:"linear-gradient(135deg,#dbeafe,#eff6ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding:isMobile ? "10px" : "20px",
      }}
    >
        <div
            onClick={() => setVideoEnded(true)}
            style={{
            position:"absolute",
            top:isMobile ? "15px":"50px",
            right:isMobile ? "15px":"25px",
            padding:isMobile ? "10px 20px":"15px 35px",
            fontSize:isMobile ? "16px":"24px",
            background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
            borderRadius:"18px",
            color:"#fff", 
            fontWeight:"700",
            cursor:"pointer",
            zIndex:"999"
            }}
            >
            ⏭ Skip Video
          </div>

      <video
        autoPlay
        controls
        onEnded={() =>setVideoEnded(true)}
        style={{
          width:"100%",
          maxHeight:isMobile ? "60vh":"90vh",
          borderRadius: "25px",
          boxShadow:"0 10px 40px rgba(37,99,235,.25)"
        }}
      >
        <source src={MountainVideo} type="video/mp4"/>
      </video>

    </div>

  );
}
    if (showImages) {

      return (

        <div
          style={{
            minHeight: "100vh",
            background: "#000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >

          <img
            src={mountainImages[currentImage]}
            alt=""
            style={{
              width:"95%",
              maxHeight:isMobile ? "55vh":"80vh",
              objectFit: "contain",
              borderRadius: "20px"
            }}
          />
          <div
            style={{
              display:"flex",
              gap:"20px",
              marginTop:"20px"
            }}
            >
            <button onClick={()=>setCurrentImage(prev=> prev===0 ? mountainImages.length-1 : prev-1)}>
            ⬅ Previous
            </button>
            <button onClick={()=>setCurrentImage(prev=>prev===mountainImages.length-1 ?0 :prev+1)}>
            Next ➡
            </button>
            </div>
            <div
              style={{
                color: "#fff",
                fontSize:isMobile ? "18px":"28px",
                marginTop: "20px"
              }}
            >
            ◀ LEFT | RIGHT ▶
            &nbsp;&nbsp;
            ({currentImage + 1}/{mountainImages.length})
          </div>
           <div
              onClick={() => setShowImages(false)}
              style={{
                marginTop: "25px",
                background:"linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "#fff",
                padding:isMobile ? "12px 20px":"18px 40px",
                fontSize:isMobile ? "18px":"24px",
                borderRadius: "18px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
          🔙 Back To Quiz Menu
        </div>

        </div>

      );
    }

/* =========================================
   START SCREEN
========================================= */

if (!startQuiz) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background:"linear-gradient(135deg,#dbeafe,#eff6ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding:isMobile ? "15px":"30px",
        fontFamily:"Poppins,sans-serif"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          background: "#ffffff",
          borderRadius: "35px",
          padding:isMobile ? "25px":"60px",
          textAlign: "center",
          boxShadow:"0 15px 40px rgba(0,0,0,.08)"
        }}
      >
        <div style={{fontSize:isMobile ? "55px":"90px",marginBottom: "15px"}}>🏔️</div>

        <h1 style={{fontSize:isMobile ? "32px":"58px",color: "#2563eb",marginBottom: "20px"}}>Mountains Of The World</h1>
        <p
          style={{
            fontSize:isMobile ? "18px":"26px",
            color: "#475569",
            lineHeight: "1.6",
            marginBottom: "40px"
          }}
        >
          Explore famous mountains,
          learn fun facts,
          discover continents,
          and become a
          Mountain Legend.
        </p>

        <div
          onClick={beginQuiz}
          style={{
            background:selectedMenu === 0 ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : "linear-gradient(135deg,#3b82f6,#2563eb)",
            color: "#fff",
            padding:isMobile ? "15px":"24px 60px",
            fontSize:isMobile ? "22px":"34px",
            borderRadius: "22px",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "25px",
            width:isMobile ? "100%" : "auto",
            maxWidth:isMobile ? "350px" : "none",
            margin:"0 auto 20px",
          }}
        >
          ▶ Start Quiz
        </div>
        <div
          onClick={() => setShowImages(true)}
          style={{
            background:selectedMenu === 1 ? "linear-gradient(135deg,#22c55e,#16a34a)": "linear-gradient(135deg,#4ade80,#22c55e)",
            color: "#fff",
            padding:isMobile ? "15px":"24px 60px",
            fontSize:isMobile ? "22px":"34px",
            borderRadius: "22px",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "25px",
            width:isMobile ? "100%" : "auto",
            maxWidth:isMobile ? "350px" : "none",
            margin:"0 auto 20px",
          }}
        >
          🖼 Mountains Description
        </div>

        <div
          onClick={() => {
            setVideoEnded(false);
            setStartQuiz(false);
          }}
          style={{
            background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
            color: "#fff",
            padding:isMobile ? "15px":"20px 55px",
            fontSize:isMobile ? "20px":"28px",
            borderRadius: "20px",
            fontWeight: "700",
            cursor: "pointer",
            width:isMobile ? "100%" : "auto",
            maxWidth:isMobile ? "350px" : "none",
            margin:"0 auto 20px",
          }}
        >
          🎥 Watch Video Again
        </div>

        <div
          style={{
            marginTop: "30px",
            color: "#64748b",
            fontSize:isMobile ? "14px":"20px",
            background:selectedMenu === 2 ? "linear-gradient(135deg,#d97706,#f59e0b)" : "linear-gradient(135deg,#f59e0b,#fbbf24)",
          }}
        >
          Use TV Remote
          ↑ ↓ Navigate • OK / Enter Select
        </div>

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap"
          }}
        >

          <div
            style={{
              background: "#eff6ff",
              padding:isMobile ? "10px 15px":"15px 25px",
              borderRadius: "15px",
              color: "#1e40af",
              fontWeight: "600"
            }}
          >
            🏔️ 50+ Questions
          </div>

          <div
            style={{
              background: "#eff6ff",
              padding:isMobile ? "10px 15px":"15px 25px",
              borderRadius: "15px",
              color: "#1e40af",
              fontWeight: "600"
            }}
          >
            🌍 World Mountains
          </div>

          <div
            style={{
              background: "#eff6ff",
              padding:isMobile ? "10px 15px":"15px 25px",
              borderRadius: "15px",
              color: "#1e40af",
              fontWeight: "600"
            }}
          >
            🏆 Become a Legend
          </div>

        </div>

      </div>

    </div>

  );
}
/* =========================================
   RESULT SCREEN
========================================= */

if (quizCompleted) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background:"linear-gradient(135deg,#dbeafe,#f8fafc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "30px",
        fontFamily:"Poppins,sans-serif"
      }}
    >

      <h1
        style={{
          fontSize:isMobile ? "36px":"64px",
          color: "#2563eb",
          marginBottom: "20px"
        }}
      >
        🎉 Quiz Completed
      </h1>

      <div
        style={{
          width:isMobile ? "150px":"230px",
          height:isMobile ? "150px":"230px",
          fontSize:isMobile ? "38px":"58px",
          borderRadius: "50%",
          background:"linear-gradient(135deg,#3b82f6,#2563eb)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          fontWeight: "900",
          marginBottom: "25px",
          boxShadow:"0 15px 35px rgba(37,99,235,.35)"
        }}
      >
        {score}/{questions.length}
      </div>

      <h2
        style={{
          fontSize:isMobile ? "24px":"36px",
          color: "#0f172a",
          marginBottom: "30px"
        }}
      >
        {getPerformanceText()}
      </h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "35px"
        }}
      >

        <div
          onClick={beginQuiz}
          style={{
            background:"linear-gradient(135deg,#22c55e,#16a34a)",
            color: "#fff",
            padding:isMobile ? "15px":"20px 45px",
            fontSize:isMobile ? "18px":"24px",
            borderRadius: "20px",
            fontWeight: "700",
            cursor: "pointer",
            width:isMobile ? "100%" : "auto",
            maxWidth:isMobile ? "350px" : "none",
            margin:"0 auto 20px",
          }}
        >
          🔄 Play Again
        </div>

        <div
          onClick={() => {

            setVideoEnded(false);
            setStartQuiz(false);
            setQuizCompleted(false);

          }}
          style={{
            background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
            color: "#fff",
            padding:isMobile ? "15px":"20px 45px",
            fontSize:isMobile ? "18px":"24px",
            borderRadius: "20px",
            fontWeight: "700",
            cursor: "pointer",
            width:isMobile ? "100%" : "auto",
            maxWidth:isMobile ? "350px" : "none",
            margin:"0 auto 20px",
          }}
        >
          🎥 Watch Video Again
        </div>

      </div>

      {/* HISTORY */}

      <div
        style={{
          width:"100%",
          maxWidth: "95%",
          background: "#ffffff",
          borderRadius: "25px",
          padding: "25px",
          boxShadow:"0 10px 30px rgba(0,0,0,.08)",
          maxHeight: "350px",
          overflowY: "auto"
        }}
      >

        <h3
          style={{
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "20px"
          }}
        >
          📊 Quiz History
        </h3>

        {scoreHistory.length === 0 ?(<div style={{textAlign: "center",color: "#64748b"}}> No Previous Attempts</div>)
          :
          (scoreHistory.map((item,index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection:isMobile ? "column":"row",
                    gap:isMobile ? "8px":"0px",
                    justifyContent:"space-between",
                    padding: "14px",
                    borderBottom:"1px solid #e2e8f0"
                  }}
                >
                  <div>
                    Attempt #
                    {scoreHistory.length-index}
                  </div>
                  <div
                    style={{
                      fontWeight: "700",
                      color: "#2563eb"
                    }}
                  >
                    {item.score}/{item.total}
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "14px"
                    }}
                  >
                    {item.date}
                  </div>

                </div>

              )
            )
          )
        }

      </div>
    </div>
  );
}
/* =========================================
   QUIZ SCREEN
========================================= */

if (!questions.length)
  return null;

const current = questions[currentQuestion];

return (

  <div
    style={{
      minHeight: "100vh",
      background:"linear-gradient(135deg,#dbeafe,#eff6ff)",
      padding:isMobile ? "12px":"25px",
      fontFamily:"Poppins,sans-serif",
      overflowY: "auto"
    }}
  >

    {/* HEADER */}

    <div
      style={{
        textAlign: "center",
        marginBottom: "20px"
      }}
    >

      <h1
        style={{
          color: "#2563eb",
          fontSize:isMobile ? "30px":"48px",
          marginBottom: "10px"
        }}
      >
        🏔️ Mountains Quiz
      </h1>

      <h2
        style={{
          color: "#475569"
        }}
      >
        Question
        {" "}
        {currentQuestion + 1}
        {" / "}
        {questions.length}
      </h2>

    </div>

    {/* MAIN CARD */}

    <div
      style={{
        maxWidth: "950px",
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: "30px",
        padding:isMobile ? "15px":"30px",
        boxShadow:"0 15px 40px rgba(0,0,0,.08)"
      }}
    >

      {/* IMAGE */}

      <img
        src={current.image}
        alt="Mountain"
        style={{
          width: "100%",
          height:isMobile ? "220px":"350px",
          objectFit: "cover",
          borderRadius: "20px",
          marginBottom: "25px"
        }}
      />

      {/* QUESTION */}

      <h2
        style={{
          textAlign: "center",
          color: "#0f172a",
          fontSize:isMobile ? "22px":"34px",
          marginBottom: "30px"
        }}
      >
        {current.question}
      </h2>

      {/* OPTIONS */}

      {
        options.map((option,index) => (
            <div
              key={index}
              onClick={() => moveToNextQuestion(option)}
              style={{
                padding:isMobile ? "14px":"18px",
                fontSize:isMobile ? "18px":"28px",
                marginBottom: "15px",
                borderRadius: "18px",
                fontWeight: "700",
                cursor: "pointer",
                transition:"all .25s ease",
                background:selectedOption === index ? "#2563eb" : "#e2e8f0",
                color: selectedOption === index ? "#ffffff" : "#0f172a",
                border:selectedOption === index ? "4px solid #93c5fd" : "2px solid transparent"
              }}
            >

              {
                selectedOption === index ? "► ": ""
              }

              {option}

            </div>

          )
        )
      }

      {/* MESSAGE */}

      <div
        style={{
          minHeight: "50px",
          marginTop: "15px",
          textAlign: "center",
          fontSize:isMobile ? "18px":"26px",
          fontWeight: "700",
          color: "#16a34a"
        }}
      >
        {message}
      </div>

      {/* FOOTER */}

      <div
        style={{
          marginTop: "25px",
          textAlign: "center",
          color: "#64748b",
          fontSize:isMobile ? "14px":"18px",
        }}
      >
        ↑ ↓ Navigate • OK / Enter Select
      </div>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize:isMobile ? "22px":"28px",
          fontWeight: "700",
          color: "#2563eb"
        }}
      >
        Score: {score}
      </div>

    </div>

  </div>

);

}