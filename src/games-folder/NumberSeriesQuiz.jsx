import React, { useState, useEffect } from "react";
// import NumberSeriesVideo from "../assets/NumberSeriesLearning.mp4";
const NumberSeriesVideo="https://games.vrplay.in/videos/number%20series.mp4";

/* =========================================
   NUMBER SERIES QUIZ
========================================= */

const ALL_QUESTIONS = [

/* ADDITION SERIES */

{
  question:"2, 4, 6, 8, ?",
  answer:"10",
  options:["10","12","14","16"]
},

{
  question:"5, 10, 15, 20, ?",
  answer:"25",
  options:["25","30","35","40"]
},

{
  question:"11, 22, 33, 44, ?",
  answer:"55",
  options:["55","66","77","88"]
},

{
  question:"3, 6, 9, 12, ?",
  answer:"15",
  options:["15","18","21","24"]
},

{
  question:"7, 14, 21, 28, ?",
  answer:"35",
  options:["35","42","49","56"]
},

{
  question:"100, 110, 120, 130, ?",
  answer:"140",
  options:["140","150","160","170"]
},

{
  question:"8, 16, 24, 32, ?",
  answer:"40",
  options:["40","42","44","48"]
},

{
  question:"13, 18, 23, 28, ?",
  answer:"33",
  options:["33","35","38","40"]
},

{
  question:"21, 24, 27, 30, ?",
  answer:"33",
  options:["33","36","39","42"]
},

{
  question:"9, 18, 27, 36, ?",
  answer:"45",
  options:["45","54","63","72"]
},

/* SUBTRACTION SERIES */

{
  question:"20, 18, 16, 14, ?",
  answer:"12",
  options:["12","10","8","6"]
},

{
  question:"100, 90, 80, 70, ?",
  answer:"60",
  options:["60","50","40","30"]
},

{
  question:"50, 45, 40, 35, ?",
  answer:"30",
  options:["30","25","20","15"]
},

{
  question:"36, 33, 30, 27, ?",
  answer:"24",
  options:["24","21","18","15"]
},

{
  question:"75, 70, 65, 60, ?",
  answer:"55",
  options:["55","50","45","40"]
},

{
  question:"120, 110, 100, 90, ?",
  answer:"80",
  options:["80","70","60","50"]
},

{
  question:"44, 40, 36, 32, ?",
  answer:"28",
  options:["28","24","20","16"]
},

{
  question:"90, 85, 80, 75, ?",
  answer:"70",
  options:["70","65","60","55"]
},

{
  question:"32, 30, 28, 26, ?",
  answer:"24",
  options:["24","22","20","18"]
},

{
  question:"81, 72, 63, 54, ?",
  answer:"45",
  options:["45","36","27","18"]
},

/* MULTIPLICATION SERIES */

{
  question:"2, 4, 8, 16, ?",
  answer:"32",
  options:["32","24","28","36"]
},

{
  question:"3, 6, 12, 24, ?",
  answer:"48",
  options:["48","36","42","54"]
},

{
  question:"5, 10, 20, 40, ?",
  answer:"80",
  options:["80","60","100","120"]
},

{
  question:"1, 2, 4, 8, ?",
  answer:"16",
  options:["16","12","20","24"]
},

{
  question:"6, 12, 24, 48, ?",
  answer:"96",
  options:["96","72","84","108"]
},

{
  question:"4, 8, 16, 32, ?",
  answer:"64",
  options:["64","56","72","80"]
},

{
  question:"7, 14, 28, 56, ?",
  answer:"112",
  options:["112","98","126","140"]
},

{
  question:"9, 18, 36, 72, ?",
  answer:"144",
  options:["144","126","135","150"]
},

{
  question:"10, 20, 40, 80, ?",
  answer:"160",
  options:["160","140","180","200"]
},

{
  question:"11, 22, 44, 88, ?",
  answer:"176",
  options:["176","154","198","220"]
},

/* DIVISION SERIES */

{
  question:"64, 32, 16, 8, ?",
  answer:"4",
  options:["4","6","8","10"]
},

{
  question:"128, 64, 32, 16, ?",
  answer:"8",
  options:["8","10","12","14"]
},

{
  question:"96, 48, 24, 12, ?",
  answer:"6",
  options:["6","8","10","12"]
},

{
  question:"160, 80, 40, 20, ?",
  answer:"10",
  options:["10","5","15","20"]
},

{
  question:"72, 36, 18, 9, ?",
  answer:"4.5",
  options:["4.5","5","6","7"]
},

{
  question:"256, 128, 64, 32, ?",
  answer:"16",
  options:["16","18","20","24"]
},

{
  question:"200, 100, 50, 25, ?",
  answer:"12.5",
  options:["12.5","15","10","20"]
},

{
  question:"48, 24, 12, 6, ?",
  answer:"3",
  options:["3","4","5","6"]
},

{
  question:"144, 72, 36, 18, ?",
  answer:"9",
  options:["9","12","15","18"]
},

{
  question:"320, 160, 80, 40, ?",
  answer:"20",
  options:["20","25","30","35"]
},

/* SQUARE NUMBERS */

{
  question:"1, 4, 9, 16, ?",
  answer:"25",
  options:["25","20","30","36"]
},

{
  question:"4, 9, 16, 25, ?",
  answer:"36",
  options:["36","49","64","81"]
},

{
  question:"9, 16, 25, 36, ?",
  answer:"49",
  options:["49","64","81","100"]
},

{
  question:"16, 25, 36, 49, ?",
  answer:"64",
  options:["64","81","100","121"]
},

{
  question:"25, 36, 49, 64, ?",
  answer:"81",
  options:["81","100","121","144"]
},

{
  question:"36, 49, 64, 81, ?",
  answer:"100",
  options:["100","121","144","169"]
},

{
  question:"49, 64, 81, 100, ?",
  answer:"121",
  options:["121","144","169","196"]
},

{
  question:"64, 81, 100, 121, ?",
  answer:"144",
  options:["144","169","196","225"]
},

{
  question:"81, 100, 121, 144, ?",
  answer:"169",
  options:["169","196","225","256"]
},

{
  question:"100, 121, 144, 169, ?",
  answer:"196",
  options:["196","225","256","289"]
},/* CUBE NUMBERS */

{
  question:"1, 8, 27, ?",
  answer:"64",
  options:["64","81","125","216"]
},

{
  question:"8, 27, 64, ?",
  answer:"125",
  options:["125","216","343","512"]
},

{
  question:"1, 8, 27, 64, ?",
  answer:"125",
  options:["125","216","343","512"]
},

{
  question:"27, 64, 125, ?",
  answer:"216",
  options:["216","343","512","729"]
},

{
  question:"64, 125, 216, ?",
  answer:"343",
  options:["343","512","729","1000"]
},

{
  question:"125, 216, 343, ?",
  answer:"512",
  options:["512","729","1000","1331"]
},

{
  question:"216, 343, 512, ?",
  answer:"729",
  options:["729","1000","1331","1728"]
},

{
  question:"1, 8, 27, 64, 125, ?",
  answer:"216",
  options:["216","343","512","729"]
},

{
  question:"8, 27, 64, 125, ?",
  answer:"216",
  options:["216","343","512","729"]
},

{
  question:"64, 125, 216, 343, ?",
  answer:"512",
  options:["512","729","1000","1331"]
},

/* PRIME NUMBERS */

{
  question:"2, 3, 5, 7, ?",
  answer:"11",
  options:["11","9","13","15"]
},

{
  question:"3, 5, 7, 11, ?",
  answer:"13",
  options:["13","15","17","19"]
},

{
  question:"5, 7, 11, 13, ?",
  answer:"17",
  options:["17","15","19","21"]
},

{
  question:"7, 11, 13, 17, ?",
  answer:"19",
  options:["19","21","23","25"]
},

{
  question:"11, 13, 17, 19, ?",
  answer:"23",
  options:["23","21","25","27"]
},

{
  question:"13, 17, 19, 23, ?",
  answer:"29",
  options:["29","27","31","33"]
},

{
  question:"17, 19, 23, 29, ?",
  answer:"31",
  options:["31","33","35","37"]
},

{
  question:"19, 23, 29, 31, ?",
  answer:"37",
  options:["37","39","41","43"]
},

{
  question:"23, 29, 31, 37, ?",
  answer:"41",
  options:["41","43","45","47"]
},

{
  question:"29, 31, 37, 41, ?",
  answer:"43",
  options:["43","45","47","49"]
},

/* FIBONACCI SERIES */

{
  question:"1, 1, 2, 3, 5, ?",
  answer:"8",
  options:["8","7","9","10"]
},

{
  question:"1, 2, 3, 5, 8, ?",
  answer:"13",
  options:["13","12","15","18"]
},

{
  question:"2, 3, 5, 8, 13, ?",
  answer:"21",
  options:["21","20","24","26"]
},

{
  question:"3, 5, 8, 13, 21, ?",
  answer:"34",
  options:["34","32","36","38"]
},

{
  question:"5, 8, 13, 21, 34, ?",
  answer:"55",
  options:["55","54","56","57"]
},

{
  question:"8, 13, 21, 34, 55, ?",
  answer:"89",
  options:["89","90","91","92"]
},

{
  question:"13, 21, 34, 55, 89, ?",
  answer:"144",
  options:["144","145","146","147"]
},

{
  question:"21, 34, 55, 89, 144, ?",
  answer:"233",
  options:["233","234","235","236"]
},

{
  question:"34, 55, 89, 144, ?",
  answer:"233",
  options:["233","240","250","260"]
},

{
  question:"55, 89, 144, 233, ?",
  answer:"377",
  options:["377","366","388","399"]
},

/* INCREASING ADDITION */

{
  question:"1, 3, 6, 10, ?",
  answer:"15",
  options:["15","16","17","18"]
},

{
  question:"2, 5, 9, 14, ?",
  answer:"20",
  options:["20","19","21","22"]
},

{
  question:"3, 7, 12, 18, ?",
  answer:"25",
  options:["25","24","26","27"]
},

{
  question:"5, 8, 12, 17, ?",
  answer:"23",
  options:["23","24","25","26"]
},

{
  question:"10, 12, 15, 19, ?",
  answer:"24",
  options:["24","25","26","27"]
},

{
  question:"4, 7, 11, 16, ?",
  answer:"22",
  options:["22","21","23","24"]
},

{
  question:"6, 10, 15, 21, ?",
  answer:"28",
  options:["28","27","29","30"]
},

{
  question:"8, 13, 19, 26, ?",
  answer:"34",
  options:["34","35","36","37"]
},

{
  question:"1, 4, 8, 13, ?",
  answer:"19",
  options:["19","20","21","22"]
},

{
  question:"2, 6, 11, 17, ?",
  answer:"24",
  options:["24","25","26","27"]
},/* ALTERNATE SERIES */

{
  question:"2, 4, 6, 8, 10, ?",
  answer:"12",
  options:["12","14","16","18"]
},

{
  question:"1, 3, 5, 7, ?",
  answer:"9",
  options:["9","11","13","15"]
},

{
  question:"2, 5, 8, 11, ?",
  answer:"14",
  options:["14","15","16","17"]
},

{
  question:"10, 20, 30, 40, ?",
  answer:"50",
  options:["50","60","70","80"]
},

{
  question:"5, 10, 15, 20, ?",
  answer:"25",
  options:["25","30","35","40"]
},

{
  question:"1, 4, 7, 10, ?",
  answer:"13",
  options:["13","14","15","16"]
},

{
  question:"3, 8, 13, 18, ?",
  answer:"23",
  options:["23","24","25","26"]
},

{
  question:"100, 95, 90, 85, ?",
  answer:"80",
  options:["80","75","70","65"]
},

{
  question:"50, 45, 40, 35, ?",
  answer:"30",
  options:["30","25","20","15"]
},

{
  question:"12, 24, 36, 48, ?",
  answer:"60",
  options:["60","72","84","96"]
},

/* ODD NUMBER SERIES */

{
  question:"1, 3, 5, 7, 9, ?",
  answer:"11",
  options:["11","12","13","14"]
},

{
  question:"11, 13, 15, 17, ?",
  answer:"19",
  options:["19","20","21","22"]
},

{
  question:"21, 23, 25, 27, ?",
  answer:"29",
  options:["29","30","31","32"]
},

{
  question:"31, 33, 35, 37, ?",
  answer:"39",
  options:["39","40","41","42"]
},

{
  question:"41, 43, 45, 47, ?",
  answer:"49",
  options:["49","50","51","52"]
},

/* EVEN NUMBER SERIES */

{
  question:"2, 4, 6, 8, ?",
  answer:"10",
  options:["10","12","14","16"]
},

{
  question:"12, 14, 16, 18, ?",
  answer:"20",
  options:["20","22","24","26"]
},

{
  question:"22, 24, 26, 28, ?",
  answer:"30",
  options:["30","32","34","36"]
},

{
  question:"32, 34, 36, 38, ?",
  answer:"40",
  options:["40","42","44","46"]
},

{
  question:"42, 44, 46, 48, ?",
  answer:"50",
  options:["50","52","54","56"]
},

/* DOUBLE PATTERN */

{
  question:"2, 4, 8, 16, ?",
  answer:"32",
  options:["32","24","28","36"]
},

{
  question:"3, 6, 12, 24, ?",
  answer:"48",
  options:["48","36","60","72"]
},

{
  question:"5, 10, 20, 40, ?",
  answer:"80",
  options:["80","60","100","120"]
},

{
  question:"7, 14, 28, 56, ?",
  answer:"112",
  options:["112","98","126","140"]
},

{
  question:"9, 18, 36, 72, ?",
  answer:"144",
  options:["144","126","162","180"]
},

/* MISSING NUMBER SERIES */

{
  question:"2, 4, ?, 8, 10",
  answer:"6",
  options:["6","5","7","9"]
},

{
  question:"5, 10, ?, 20, 25",
  answer:"15",
  options:["15","12","18","22"]
},

{
  question:"1, 4, ?, 16, 25",
  answer:"9",
  options:["9","8","10","12"]
},

{
  question:"2, 3, 5, ?, 11",
  answer:"7",
  options:["7","8","9","10"]
},

{
  question:"1, 1, 2, ?, 5",
  answer:"3",
  options:["3","4","5","6"]
},

{
  question:"10, ?, 30, 40, 50",
  answer:"20",
  options:["20","15","25","35"]
},

{
  question:"100, 90, ?, 70, 60",
  answer:"80",
  options:["80","85","75","65"]
},

{
  question:"8, 16, ?, 32, 40",
  answer:"24",
  options:["24","20","28","30"]
},

{
  question:"3, 6, ?, 12, 15",
  answer:"9",
  options:["9","8","10","11"]
},

{
  question:"7, 14, ?, 28, 35",
  answer:"21",
  options:["21","18","24","27"]
},

/* MIXED LOGIC SERIES */

{
  question:"2, 5, 10, 17, ?",
  answer:"26",
  options:["26","25","27","28"]
},

{
  question:"1, 4, 9, 16, ?",
  answer:"25",
  options:["25","24","26","27"]
},

{
  question:"2, 6, 12, 20, ?",
  answer:"30",
  options:["30","28","32","34"]
},

{
  question:"3, 7, 13, 21, ?",
  answer:"31",
  options:["31","29","33","35"]
},

{
  question:"1, 2, 6, 24, ?",
  answer:"120",
  options:["120","100","140","160"]
},

{
  question:"5, 6, 8, 11, 15, ?",
  answer:"20",
  options:["20","18","22","24"]
},

{
  question:"10, 13, 17, 22, ?",
  answer:"28",
  options:["28","29","30","31"]
},

{
  question:"1, 3, 7, 15, ?",
  answer:"31",
  options:["31","29","33","35"]
},

{
  question:"4, 9, 16, 25, ?",
  answer:"36",
  options:["36","49","64","81"]
},

{
  question:"6, 12, 18, 24, ?",
  answer:"30",
  options:["30","36","42","48"]
},

/* ADVANCED NUMBER SERIES */

{
  question:"1, 2, 4, 7, 11, ?",
  answer:"16",
  options:["16","15","17","18"]
},

{
  question:"2, 5, 9, 14, 20, ?",
  answer:"27",
  options:["27","28","29","30"]
},

{
  question:"3, 6, 11, 18, 27, ?",
  answer:"38",
  options:["38","39","40","41"]
},

{
  question:"1, 5, 14, 30, ?",
  answer:"55",
  options:["55","50","60","65"]
},

{
  question:"2, 8, 18, 32, ?",
  answer:"50",
  options:["50","48","52","54"]
}

];
/* =========================================
   COMPONENT START
========================================= */

export default function NumberSeriesQuiz() {

const [videoEnded,setVideoEnded] = useState(false);
const [startQuiz,setStartQuiz] = useState(false);
const [quizCompleted,setQuizCompleted] = useState(false);
const [questions,setQuestions] = useState([]);
const [currentQuestion,setCurrentQuestion] = useState(0);
const [score,setScore] = useState(0);
const [selectedOption,setSelectedOption] = useState(0);
const [options,setOptions] = useState([]);
const [message,setMessage] = useState("");
const [scoreHistory,setScoreHistory] =useState(JSON.parse(localStorage.getItem("numberSeriesQuizHistory") || "[]"));
const [selectedMenu,setSelectedMenu] = useState(0);
const isMobile = window.innerWidth <= 768;
const responsive = {
  title: isMobile ? "32px" : "58px",
  heading: isMobile ? "24px" : "34px",
  question: isMobile ? "24px" : "34px",
  option: isMobile ? "18px" : "28px",
  normal: isMobile ? "16px" : "22px",
  small: isMobile ? "14px" : "18px",
  padding: isMobile ? "18px" : "30px",
  buttonPadding: isMobile ? "18px" : "24px 60px",
  scoreCircle: isMobile ? "150px" : "230px",
  container: isMobile ? "95%" : "900px"
};

/* =========================================
   SHUFFLE
========================================= */

const shuffleArray = (array) => {
    const arr = [...array];
      for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i],arr[j]] = [arr[j],arr[i]];
      }
    return arr;
};

/* =========================================
   START QUIZ
========================================= */

const beginQuiz = () => {
    const shuffled = shuffleArray(ALL_QUESTIONS).slice(0,20).map(q => ({...q,options: shuffleArray(q.options)}));
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

const moveToNextQuestion = (selectedAnswer) => {
    const current = questions[currentQuestion];
    const isCorrect =selectedAnswer === current.answer;
    const updatedScore =isCorrect ? score + 1 : score;
    if(isCorrect){
      setScore(updatedScore);
      setMessage("✅ Correct!");
    }else{
      setMessage(`❌ Correct Answer: ${current.answer}`);
    }
    setTimeout(() => {
    const nextIndex = currentQuestion + 1;
    if(nextIndex >= questions.length){
    const history = [
    {
      score: updatedScore,
      total: questions.length,
      date: new Date().toLocaleString()
    },
    ...scoreHistory
    ];
    setScoreHistory(history);
    localStorage.setItem("numberSeriesQuizHistory",JSON.stringify(history));
    setQuizCompleted(true);
    return;
    }

    const nextQuestion = questions[nextIndex];
    setCurrentQuestion(nextIndex);
    setOptions(nextQuestion.options);
    setSelectedOption(0);
    setMessage("");
    },1200);

    };

/* =========================================
   PERFORMANCE
========================================= */

const getPerformanceText = () => {

    const percentage = (score / questions.length) * 100;

    if(percentage >= 90)
    return "🏆 Number Series Champion";

    if(percentage >= 75)
    return "⭐⭐⭐ Pattern Master";

    if(percentage >= 50)
    return "⭐⭐ Number Learner";

    return "⭐ Keep Practicing";
};

/* =========================================
   TV REMOTE
========================================= */

useEffect(() => {

const handleKey = (e) => {

    if(videoEnded && !startQuiz && e.key==="ArrowUp"){
       setSelectedMenu(prev => prev === 0 ? 1 : prev - 1);
       return;
    }
    if(videoEnded && !startQuiz && e.key==="ArrowDown"){
       setSelectedMenu(prev =>prev === 1 ? 0 : prev + 1);
       return;
    }
    if(videoEnded && !startQuiz && e.key==="Enter"){
      if(selectedMenu === 0)
        beginQuiz();
      if(selectedMenu === 1)
        setVideoEnded(false);
      return;
    }

    /* QUIZ SCREEN */

    if(startQuiz && !quizCompleted){
      if(e.key === "ArrowUp"){
        setSelectedOption(prev =>prev === 0 ? options.length - 1 : prev - 1);
      }

    if(e.key === "ArrowDown"){
      setSelectedOption(prev =>mprev === options.length - 1 ? 0 : prev + 1);
    }

    if(e.key === "Enter"){
      moveToNextQuestion(options[selectedOption]);
    }

  }
    /* RESULT SCREEN */
    if(quizCompleted && e.key==="Enter"){
      beginQuiz();
    }
};
window.addEventListener("keydown",handleKey);
return () => window.removeEventListener("keydown",handleKey);
},[videoEnded,startQuiz,quizCompleted,selectedOption,options,questions,currentQuestion,selectedMenu]);

const selectOption = (index) => {
  setSelectedOption(index);
};
const submitAnswer = (answer) => {
  moveToNextQuestion(answer);
};

/* =========================================
   VIDEO SCREEN
========================================= */

if(!videoEnded){

      return(

      <div
      style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      padding:isMobile ? "10px" : "20px",
      position:"relative"
      }}
      >

      <div
      onClick={() => setVideoEnded(true)}
      style={{
      position:"absolute",
      top:isMobile ? "10px" : "20px",
      right:isMobile ? "10px" : "20px",
      fontSize:isMobile ? "14px" : "24px",
      padding:isMobile ? "10px 20px" : "15px 35px",
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
      onEnded={() => setVideoEnded(true)}
      style={{
      width:"95%",
      maxHeight:"90vh",
      borderRadius:"25px",
      boxShadow:"0 10px 40px rgba(0,0,0,.25)"
      }}
      >
      <source src={NumberSeriesVideo} type="video/mp4"/>
      </video>
      </div>
      );

}
/* =========================================
   START SCREEN
========================================= */

if(!startQuiz){
    return(
    <div
    style={{
    minHeight:"100vh",
    background:"linear-gradient(135deg,#dbeafe,#bfdbfe,#93c5fd)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    padding:responsive.padding,
    fontFamily:"Poppins,sans-serif"
    }}
    >

    <div
    style={{
    width:"100%",
    maxWidth:"1000px",
    background:"#fff",
    borderRadius:"35px",
    padding:responsive.padding,
    textAlign:"center",
    boxShadow:"0 15px 40px rgba(0,0,0,.08)"
    }}
    >

    <div
    style={{
    fontSize:isMobile ? "60px" : "90px",
    marginBottom:"15px"
    }}
    >
    🔢
    </div>

    <h1
    style={{
    fontSize:responsive.title,
    color:"#2563eb",
    marginBottom:"20px"
    }}
    >
    Number Series Quiz
    </h1>

    <p
    style={{
    fontSize:responsive.normal,
    color:"#475569",
    lineHeight:"1.6",
    marginBottom:"40px"
    }}
    >
    Learn Number Series Patterns,
    Improve Logical Thinking,
    And Become A Number Series Expert.
    </p>

    <div
    onClick={beginQuiz}
    style={{
    background:selectedMenu === 0 ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : "linear-gradient(135deg,#3b82f6,#2563eb)",
    color:"#fff",
    padding:responsive.buttonPadding,
    fontSize:responsive.heading,
    borderRadius:"22px",
    fontWeight:"700",
    cursor:"pointer",
    marginBottom:"25px"
    }}
    >
    ▶ Start Quiz
    </div>

    <div
    onClick={() => {
    setVideoEnded(false);
    setStartQuiz(false);
    }}
    style={{
    background:selectedMenu === 1 ? "linear-gradient(135deg,#d97706,#f59e0b)" : "linear-gradient(135deg,#f59e0b,#fbbf24)",
    color:"#fff",
    borderRadius:"22px",
    padding:responsive.buttonPadding,
    fontSize:responsive.heading,
    fontWeight:"700",
    cursor:"pointer"
    }}
    >
    🎥 Watch Video Again
    </div>

    <div
    style={{
    marginTop:"30px",
    fontSize:"20px",
    color:"#64748b"
    }}
    >
    Use TV Remote
    ↑ ↓ Navigate • OK / Enter Select
    </div>

    <div
    style={{
    marginTop:"25px",
    display:"flex",
    justifyContent:"center",
    gap:"20px",
    flexWrap:"wrap"
    }}
    >

    <div
    style={{
    background:"#dbeafe",
    padding:isMobile ?"10px 16px" : "15px 25px",
    borderRadius:"15px",
    fontWeight:"600",
    color:"#1d4ed8"
    }}
    >
    🔢 165+ Questions
    </div>

    <div
    style={{
    background:"#dbeafe",
    padding:"15px 25px",
    borderRadius:"15px",
    fontWeight:"600",
    fontSize:isMobile?"14px":"18px",
    color:"#1d4ed8"
    }}
    >
    📈 All Number Patterns
    </div>

    <div
    style={{
    background:"#dbeafe",
    padding:"15px 25px",
    borderRadius:"15px",
    fontWeight:"600",
    color:"#1d4ed8"
    }}
    >
    🏆 Become Expert
    </div>

    </div>

    </div>

    </div>

    );

}

/* =========================================
   RESULT SCREEN
========================================= */

if(quizCompleted){

      return(

      <div
      style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#dbeafe,#bfdbfe)",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      flexDirection:"column",
      padding:"30px",
      fontFamily:"Poppins,sans-serif"
      }}
      >

      <h1
      style={{
      fontSize:isMobile?"36px":"64px",
      color:"#2563eb",
      marginBottom:"20px"
      }}
      >
      🎉 Quiz Completed
      </h1>

      <div
      style={{
      width:responsive.scoreCircle,
      height:responsive.scoreCircle,
      borderRadius:"50%",
      background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      color:"#fff",
      fontSize:isMobile?"40px":"58px",
      fontWeight:"900",
      marginBottom:"25px"
      }}
      >
      {score}/{questions.length}
      </div>

      <h2
      style={{
      fontSize:responsive.heading,
      color:"#0f172a",
      marginBottom:"30px"
      }}
      >
      {getPerformanceText()}
      </h2>

      <div
      style={{
      display:"flex",
      gap:"20px",
      flexWrap:"wrap",
      marginBottom:"35px"
      }}
      >

      <div
      onClick={beginQuiz}
      style={{
      background:"linear-gradient(135deg,#2563eb,#3b82f6)",
      color:"#fff",
      padding:"20px 45px",
      borderRadius:"20px",
      fontSize:"24px",
      fontWeight:"700",
      cursor:"pointer"
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
      color:"#fff",
      padding:"20px 45px",
      borderRadius:"20px",
      fontSize:"24px",
      fontWeight:"700",
      cursor:"pointer"
      }}
      >
      🎥 Watch Video Again
      </div>

      </div>



      <div
      style={{
      width:responsive.container,
      maxWidth:"95%",
      background:"#ffffff",
      borderRadius:"25px",
      padding:responsive.padding,
      boxShadow:"0 10px 30px rgba(0,0,0,.08)",
      maxHeight:"350px",
      overflowY:"auto"
      }}
      >

      <h3
      style={{
      textAlign:"center",
      color:"#2563eb",
      marginBottom:"20px"
      }}
      >
      📊 Quiz History
      </h3>

      {
      scoreHistory.length === 0 ?

      (
      <div
      style={{
      textAlign:"center",
      color:"#64748b"
      }}
      >
      No Previous Attempts
      </div>
      )

      :

      (
      scoreHistory.map((item,index) => (

      <div
      key={index}
      style={{
      display:"flex",
      flexDirection:isMobile?"column":"row",
      gap:isMobile?"6px":"0px",
      justifyContent:"space-between",
      padding:"14px",
      borderBottom:"1px solid #e2e8f0"
      }}
      >

      <div>
      Attempt #{scoreHistory.length - index}
      </div>

      <div
      style={{
      fontWeight:"700",
      color:"#2563eb"
      }}
      >
      {item.score}/{item.total}
      </div>

      <div
      style={{
      color:"#64748b",
      fontSize:"14px"
      }}
      >
      {item.date}
      </div>

      </div>

      ))
      )

      }

      </div>

      </div>

      );

}

/* =========================================
   QUIZ SCREEN
========================================= */

if(!questions.length)
return null;

const current = questions[currentQuestion];

    return(

    <div
    style={{
    minHeight:"100vh",
    background:"linear-gradient(135deg,#eff6ff,#dbeafe,#bfdbfe)",
    padding:responsive.padding,
    fontFamily:"Poppins,sans-serif",
    overflowY:"auto"
    }}
    >

    <div
    style={{
    textAlign:"center",
    marginBottom:"20px"
    }}
    >

    <h1
    style={{
    color:"#2563eb",
    fontSize:responsive.title,
    marginBottom:"10px"
    }}
    >
    🔢 Number Series Quiz
    </h1>

    <h2
    style={{
    color:"#475569"
    }}
    >
    Question {currentQuestion + 1}
    {" / "}
    {questions.length}
    </h2>

    </div>

    <div
    style={{
    maxWidth:"950px",
    margin:"0 auto",
    background:"#ffffff",
    borderRadius:"30px",
    padding:responsive.padding,
    boxShadow:"0 15px 40px rgba(0,0,0,.08)"
    }}
    >

    <h2
    style={{
    textAlign:"center",
    color:"#0f172a",
    fontSize:responsive.question,
    marginBottom:"30px"
    }}
    >
    {current.question}
    </h2>

    {options.map((option,index) => (
    <div
    key={index}
    onClick={() => {
      selectOption(index);
      submitAnswer(option);
    }}
    style={{
    padding:isMobile?"14px":"18px",
    fontSize:responsive.option,
    marginBottom:"15px",
    borderRadius:"18px",
    fontWeight:"700",
    cursor:"pointer",
    background:selectedOption === index ? "#2563eb" : "#e2e8f0",
    color:selectedOption === index ? "#fff" : "#0f172a",
    border:selectedOption === index ? "4px solid #93c5fd" : "2px solid transparent"
    }}
    >

    {selectedOption === index ? "► " : ""}
    {option}
    </div>
    ))
  }

    <div
    style={{
    minHeight:"50px",
    marginTop:"15px",
    textAlign:"center",
    fontSize:responsive.heading,
    fontWeight:"700",
    color:"#2563eb"
    }}
    >
    {message}
    </div>

    <div
    style={{
    marginTop:"25px",
    textAlign:"center",
    color:"#64748b",
    fontSize:"18px"
    }}
    >
    ↑ ↓ Navigate • OK / Enter Select
    </div>

    <div
    style={{
    marginTop:"20px",
    textAlign:"center",
    fontSize:responsive.heading,
    fontWeight:"700",
    color:"#2563eb"
    }}
    >
    Score: {score}
    </div>

    </div>

    </div>

    );

}