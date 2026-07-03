import React, { useState, useEffect } from "react";
// import StatesVideo from "../assets/states and capitals.mp4";

const StatesVideo="https://games.vrplay.in/videos/states.mp4";

/* =========================================
   STATES & CAPITALS TV QUIZ
   PART 1
========================================= */

const STATES_DATA = [
  { state: "Andhra Pradesh", capital: "Amaravati" },
  { state: "Arunachal Pradesh", capital: "Itanagar" },
  { state: "Assam", capital: "Dispur" },
  { state: "Bihar", capital: "Patna" },
  { state: "Chhattisgarh", capital: "Raipur" },
  { state: "Goa", capital: "Panaji" },
  { state: "Gujarat", capital: "Gandhinagar" },
  { state: "Haryana", capital: "Chandigarh" },
  { state: "Himachal Pradesh", capital: "Shimla" },
  { state: "Jharkhand", capital: "Ranchi" },
  { state: "Karnataka", capital: "Bengaluru" },
  { state: "Kerala", capital: "Thiruvananthapuram" },
  { state: "Madhya Pradesh", capital: "Bhopal" },
  { state: "Maharashtra", capital: "Mumbai" },
  { state: "Manipur", capital: "Imphal" },
  { state: "Meghalaya", capital: "Shillong" },
  { state: "Mizoram", capital: "Aizawl" },
  { state: "Nagaland", capital: "Kohima" },
  { state: "Odisha", capital: "Bhubaneswar" },
  { state: "Punjab", capital: "Chandigarh" },
  { state: "Rajasthan", capital: "Jaipur" },
  { state: "Sikkim", capital: "Gangtok" },
  { state: "Tamil Nadu", capital: "Chennai" },
  { state: "Telangana", capital: "Hyderabad" },
  { state: "Tripura", capital: "Agartala" },
  { state: "Uttar Pradesh", capital: "Lucknow" },
  { state: "Uttarakhand", capital: "Dehradun" },
  { state: "West Bengal", capital: "Kolkata" },
];

export default function StatesCapitalTVQuiz() {
  /* =========================================
     SCREEN STATES
  ========================================= */

  const [videoEnded, setVideoEnded] = useState(false);
  const [startQuiz, setStartQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] =useState(false);

  /* =========================================
     QUIZ DATA
  ========================================= */

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [scoreHistory, setScoreHistory] = useState(JSON.parse(localStorage.getItem("statesQuizHistory") || "[]"));
  /* =========================================
     SHUFFLE QUESTIONS
  ========================================= */

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1;i > 0;i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j],arr[i],];
    }
    return arr;
  };

  /* =========================================
     GENERATE OPTIONS
  ========================================= */

  const generateOptions = (correctCapital) => {const optionsList = [correctCapital,];
    while (optionsList.length < 4) {
      const randomCapital =STATES_DATA[Math.floor(Math.random() * STATES_DATA.length)].capital;
      if (!optionsList.includes(randomCapital)) {
          optionsList.push(randomCapital);
      }
    }
    return shuffleArray(optionsList);
  };

  /* =========================================
     START QUIZ
  ========================================= */

  const beginQuiz = () => {
    const shuffled =shuffleArray(STATES_DATA);
    setQuestions(shuffled);
    const firstOptions =generateOptions(shuffled[0].capital);
    setOptions(firstOptions);
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
    const current = questions[currentQuestion];
    const isCorrect = selectedAnswer === current.capital;
    const updatedScore = isCorrect ? score + 1 : score;
    if (isCorrect) {
      setScore(updatedScore);
      setMessage("✅ Correct");
    } else {
      setMessage(`❌ Correct Answer: ${current.capital}`);
    }

    setTimeout(() => {

      const nextIndex = currentQuestion + 1;
      if (nextIndex >= questions.length) {
        const history = [
          {
            score:updatedScore,
            total:questions.length,
            date:new Date().toLocaleString(),
          },
          ...scoreHistory,
        ];
        setScoreHistory(history);
        localStorage.setItem("statesQuizHistory",JSON.stringify(history));
        setQuizCompleted(true);
        return;
      }

      const nextQuestion = questions[nextIndex];
      setCurrentQuestion(nextIndex);
      setOptions(generateOptions(nextQuestion.capital));
      setSelectedOption(0);
      setMessage("");
    }, 1200);
  };

  /* =========================================
     PERFORMANCE TEXT
  ========================================= */

  const getPerformanceText =() => {
      if (score === 28) {
        return "🏆 Genius!";
      }
      if (score >= 24) {
        return "⭐⭐⭐ Excellent!";
      }
      if (score >= 18) {
        return "⭐⭐ Good Job!";
      }
      return "⭐ Keep Practicing!";
    };

  /* =========================================
     PART 2 CONTINUES BELOW
  ========================================= */
    /* =========================================
     TV REMOTE CONTROLS
  ========================================= */

  useEffect(() => {
    const handleKey = (e) => {

      /* START BUTTON SCREEN */

      if (videoEnded && !startQuiz && e.key === "Enter") {
        beginQuiz();
        return;
      }
      /* QUIZ SCREEN */
      if (startQuiz && !quizCompleted) {
        if (e.key === "ArrowUp") {
          setSelectedOption((prev) => prev === 0 ? options.length - 1 : prev - 1);
        }
        if (e.key === "ArrowDown") {
          setSelectedOption((prev) => prev === options.length - 1 ? 0 : prev + 1);
        }

        if (e.key === "Enter") {
           moveToNextQuestion(options[selectedOption]);
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
  }, [videoEnded,startQuiz,quizCompleted,selectedOption,options,questions,currentQuestion,]);

  /* =========================================
     VIDEO SCREEN
  ========================================= */

  if (!videoEnded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "12px",
        }}
      >
        <div
            onClick={() => setVideoEnded(true)}
            style={{
            position:"absolute",
            top:"max(15px,env(safe-area-inset-top))",
            right:"15px",
            padding:"10px 20px",
            fontSize:"clamp(14px,2vw,24px)",
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
           maxWidth:"1100px",
           maxHeight:"85vh",
           objectFit:"contain",
           borderRadius: "20px",
           boxShadow:"0 0 40px rgba(255,255,255,.2)",
          }}
        >
          <source src={StatesVideo} type="video/mp4"/>
        </video>
      </div>
    );
  }
/* =========================================
   START QUIZ SCREEN
========================================= */

if (!startQuiz) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:"linear-gradient(135deg,#1e293b,#0f172a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        fontFamily:"Poppins, sans-serif",
        padding: "15px",
      }}
    >
      <div
        style={{
          background:"rgba(255,255,255,.08)",
          backdropFilter:"blur(12px)",
          padding:"clamp(20px,4vw,60px)",
          borderRadius:"30px",
          textAlign:"center",
          boxShadow:"0 0 40px rgba(0,0,0,.4)",
          width:"min(95vw,900px)",
        }}
      >
        <h1
          style={{
            fontSize:"clamp(30px,5vw,56px)",
            marginBottom: "20px",
            color: "#facc15",
          }}
        >
          🇮🇳 States & Capitals Quiz
        </h1>

        <p
          style={{
            fontSize:"clamp(16px,2.8vw,24px)",
            lineHeight:1.5,
            color: "#cbd5e1",
            marginBottom: "40px",
          }}
        >
          Learn all Indian States and Capitals
          before taking the quiz.
        </p>

        <div
          onClick={beginQuiz}
          onTouchStart={beginQuiz}
          style={{
            padding:"16px 25px",
            fontSize:"clamp(20px,4vw,34px)",
            borderRadius:"20px",
            background:"linear-gradient(135deg,#f59e0b,#f97316)",
            fontWeight:"bold",
            cursor:"pointer",
            border:"3px solid rgba(255,255,255,.2)",
            boxShadow:"0 0 35px rgba(249,115,22,.6)",
            marginBottom:"20px",
            transition:"all .3s ease",
          }}
        >
          ▶ Start Quiz
        </div>

        <div
          onClick={() => {
            setVideoEnded(false);
            setStartQuiz(false);
          }}
          onTouchStart={()=>{
            setVideoEnded(false);
            setStartQuiz(false);
          }}
          style={{
            padding:"15px 22px",
            fontSize:"clamp(18px,3vw,28px)",
            borderRadius:"18px",
            background:"linear-gradient(135deg,#3b82f6,#2563eb)",
            fontWeight:"bold",
            cursor:"pointer",
            boxShadow:"0 0 25px rgba(59,130,246,.5)",
            marginBottom:"25px",
          }}
        >
          🎥 Watch Video Again
        </div>

        <div style={{fontSize:"20px",color:"#94a3b8",}}>
          Use TV Remote OK / Enter
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
        background:"linear-gradient(135deg,#0f172a,#1e293b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        fontFamily:"Poppins, sans-serif",
        padding: "15px",
      }}
    >
      <h1
        style={{
          fontSize:"clamp(32px,6vw,64px)",
          marginBottom: "15px",
          color: "#facc15",
        }}
      >
        🎉 Quiz Completed
      </h1>

      <div
        style={{
          width:"clamp(140px,28vw,220px)",
          height:"clamp(140px,28vw,220px)",
          fontSize:"clamp(30px,5vw,56px)",
          borderRadius: "50%",
          background:"linear-gradient(135deg,#22c55e,#15803d)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "900",
          marginBottom: "25px",
          boxShadow:"0 0 35px rgba(34,197,94,.8)",
        }}
      >
        {score}/28
      </div>

      <h2
        style={{
          fontSize:"clamp(22px,4vw,36px)",
          color: "#38bdf8",
          marginBottom: "25px",
        }}
      >
        {getPerformanceText()}
      </h2>

      {/* Buttons */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "35px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div
          onClick={beginQuiz}
          onTouchStart={beginQuiz}
          style={{
            padding:"14px 22px",
            fontSize:"clamp(18px,3vw,24px)",
            borderRadius: "18px",
            background:"linear-gradient(135deg,#22c55e,#16a34a)",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow:"0 0 25px rgba(34,197,94,.5)",
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
            // padding: "18px 40px",
            padding:"14px 22px",
            fontSize:"clamp(18px,3vw,24px)",
            borderRadius: "18px",
            background:"linear-gradient(135deg,#3b82f6,#2563eb)",
            // fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow:"0 0 25px rgba(59,130,246,.5)",
          }}
        >
          🎥 Watch Video Again
        </div>
      </div>

      {/* History Section */}

      <div
        style={{
          width:"min(95vw,800px)",
          maxWidth: "95%",
          maxHeight: "300px",
          overflowY: "auto",
          background:"rgba(255,255,255,.08)",
          backdropFilter:"blur(10px)",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            color: "#facc15",
            marginBottom: "20px",
            fontSize: "28px",
          }}
        >
          📊 Quiz History
        </h3>

        {scoreHistory.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#cbd5e1",
              fontSize: "18px",
            }}
          >
            No previous attempts
          </div>
        ) : (scoreHistory.map((item,index) => (
              <div
                key={index}
                style={{
                  padding: "12px",
                  borderBottom:"1px solid rgba(255,255,255,.1)",
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center",
                  flexWrap:"wrap",
                  gap:"10px",
                }}
              >
                <div>
                  Attempt #
                  {scoreHistory.length -
                    index}
                </div>

                <div
                  style={{
                    color:"#38bdf8",
                    fontWeight:"bold",
                  }}
                >
                  {item.score}/
                  {item.total}
                </div>

                <div
                  style={{
                    color:"#94a3b8",
                    fontSize:"14px",
                  }}
                >
                  {item.date}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

  /* =========================================
     QUIZ SCREEN
  ========================================= */

  const current = questions[currentQuestion];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:"#183153",
        color: "white",
        fontFamily:"Poppins, sans-serif",
        padding: "12px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
       <h1
        style={{
           fontSize:"clamp(26px,5vw,42px)",
           margin: 0,
           fontWeight: "900",
           color: "#ffffff",
            }}
        >
          🇮🇳 States & Capitals Quiz
        </h1>

        <h2
          style={{
            color: "#60a5fa",
            marginTop: "15px",
          }}
        >
          Question {currentQuestion + 1} / 28
        </h2>
      </div>

      <div
        style={{
          width:"min(95vw,820px)",
          margin: "0 auto",
          background:"rgba(255,255,255,.08)",
          backdropFilter:"blur(10px)",
          borderRadius: "20px",
          padding:"clamp(15px,3vw,30px)",
          textAlign: "center",
         background:"#203a61",
        }}
      >
        <h2
          style={{
            fontSize:"clamp(20px,4vw,34px)",
            lineHeight:1.5,
            marginBottom: "40px",
          }}
        >
          What is the capital of{" "}
          <span style={{color: "#38bdf8",}}>{current.state}</span>
          ?
        </h2>

        {options.map((option, index) => (
            <div
              key={index}
              onClick={()=>{
                  setSelectedOption(index);
                  moveToNextQuestion(option);
              }}
              style={{
                padding:"14px",
                fontSize:"clamp(18px,3.8vw,24px)",
                wordBreak:"break-word",
                marginBottom: "14px",
                borderRadius: "16px",
                fontWeight: "700",
                background: selectedOption === index ? "#facc15" : "#2b4b7d",
                color: selectedOption === index ? "#111827" : "#ffffff",
                border: selectedOption === index ? "3px solid white" : "2px solid transparent",
                transform:selectedOption === index ? "scale(1.02)" : "scale(1)",
                transition:"all .25s ease",
                boxShadow: selectedOption === index ? "0 0 15px rgba(250,204,21,.5)" : "none",
                cursor: "pointer",
                }}
            >
              {selectedOption === index ? "► " : ""}{option}
            </div>
          )
        )}

        <div
          style={{
            marginTop: "20px",
            fontSize:"clamp(18px,3vw,24px)",
            color: "#4ade80",
            fontWeight: "bold",
            minHeight: "40px",
          }}
        >
          {message}
        </div>

        <div
          style={{
            marginTop: "25px",
            fontSize:"clamp(13px,2vw,16px)",
            color: "#94a3b8",
          }}
        >
          ↑ ↓ Navigate • OK / Enter Select Answer
        </div>

        <div
          style={{
            marginTop: "20px",
            fontSize:"clamp(18px,3vw,24px)",
            color: "#38bdf8",
            fontWeight: "bold",
          }}
        >
          Score: {score}
        </div>
      </div>
    </div>
  );
} 