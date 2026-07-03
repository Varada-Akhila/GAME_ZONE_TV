import React, {useState,useEffect} from "react";
// import TimeVideo from "../assets/time-teacher.mp4";
const TimeVideo="https://games.vrplay.in/videos/time.mp4";

/* =========================================
   ANALOG CLOCK
========================================= */

const AnalogClock = ({ hour, minute}) => {
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      style={{
        width: "clamp(180px,40vw,280px)",
        height: "clamp(180px,40vw,280px)",
        marginBottom: "20px",
      }}
    >
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="#ffffff"
        stroke="#0f172a"
        strokeWidth="5"
      />

      {[...Array(12)].map((_, i) => {
          const angle = ((i + 1) * 30 - 90) * (Math.PI / 180);
          const x = 100 + 72 * Math.cos(angle);
          const y = 100 + 72 * Math.sin(angle);

          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#111"
            >
              {i + 1}
            </text>
          );
        }
      )}

      {/* Hour Hand */}

      <line
        x1="100"
        y1="100"
        x2={ 100 + 45 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
        y2={ 100 + 45 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
        stroke="#2563eb"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Minute Hand */}

      <line
        x1="100"
        y1="100"
        x2={ 100 + 65 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
        y2={ 100 + 65 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
        stroke="#ef4444"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle
        cx="100"
        cy="100"
        r="5"
        fill="#111"
      />
    </svg>
  );
};

/* =========================================
   QUESTION GENERATOR
========================================= */

const generateQuestion = (hour,minute) => {

  const answer =`${hour}:${String(minute).padStart(2, "0")}`;
  let question ="What time is shown on the clock?";

  if (minute === 15) {
    question = `Quarter past ${hour} means?`;
  }

  if (minute === 30) {
    question = `Half past ${hour} means?`;
  }

  if (minute === 45) {
    const nextHour = hour === 12 ? 1 : hour + 1;
    question =`Quarter to ${nextHour} means?`;
  }

  const wrong1 =`${hour}:${String((minute + 15) % 60).padStart(2, "0")}`;
  const wrong2 =`${hour}:${String((minute + 30) % 60).padStart(2, "0")}`;
  const wrong3 =`${hour === 12 ? 1 : hour + 1}:${String(minute).padStart(2, "0")}`;

  const options = [ answer, wrong1, wrong2, wrong3,];
  return {
    hour,
    minute,
    question,
    answer,
    options: options.sort(() => Math.random() - 0.5),
  };
};

/* =========================================
   48 QUESTIONS
========================================= */

const TIME_QUESTIONS = [];

const minutes = [
  0,
  5,
  10,
  15,
  20,
  25,
  30,
  35,
  40,
  45,
  50,
  55
];

for (let h = 1; h <= 12; h++) {

  minutes.forEach((m) => {

    TIME_QUESTIONS.push(
      generateQuestion(h, m)
    );

  });

}

/* =========================================
   COMPONENT START
========================================= */

export default function TimeTeacherQuiz() {

  const [videoEnded,setVideoEnded,] = useState(false);
  const [startQuiz, setStartQuiz,] = useState(false);
  const [quizCompleted,setQuizCompleted,] = useState(false);
  const [questions,setQuestions,] = useState([]);
  const [currentQuestion,setCurrentQuestion,] = useState(0);
  const [score,setScore,] = useState(0);
  const [selectedOption,setSelectedOption,] = useState(0);
  const [options,setOptions,] = useState([]);
  const [message,setMessage,] = useState("");
  const [scoreHistory,setScoreHistory,] = useState(JSON.parse(localStorage.getItem("timeQuizHistory") || "[]"));
  
/* =========================================
   SHUFFLE ARRAY
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
   START QUIZ
========================================= */

const beginQuiz = () => {

  const shuffled =
    shuffleArray(
      TIME_QUESTIONS
    ).slice(0,25);

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
  const current = questions[currentQuestion];
  const isCorrect = selectedAnswer === current.answer;
  const updatedScore = isCorrect ? score + 1 : score;
  if (isCorrect) {
    setScore(updatedScore);
    setMessage("✅ Correct");
  } else {
    setMessage(`❌ Correct Answer: ${current.answer}`);
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
        localStorage.setItem("timeQuizHistory", JSON.stringify(history));
        setQuizCompleted(true);
        return;
      }
      const nextQuestion = questions[nextIndex];
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

const getPerformanceText = () => {

  const percentage =(score / questions.length) * 100;
  if (percentage >= 90) {
    return "🏆 Time Master!";
  }

  if (percentage >= 75) {
    return "⭐⭐⭐ Excellent!";
  }

  if (percentage >= 50) {
    return "⭐⭐ Good Job!";
  }

  return "⭐ Keep Practicing!";
};
/* =========================================
   TV REMOTE CONTROLS
========================================= */

useEffect(() => {

  const handleKey = (e) => {

    /* START SCREEN */

    if (videoEnded && !startQuiz && e.key === "Enter") {
      beginQuiz();
      return;
    }

    /* QUIZ SCREEN */

    if (startQuiz && !quizCompleted) {
      if (e.key === "ArrowUp") {
        setSelectedOption(
          (prev) => prev === 0 ? options.length - 1 : prev - 1);
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

  window.addEventListener("keydown", handleKey);

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
            background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
            borderRadius:"18px",
            color:"#fff",
            fontWeight:"700",
            cursor:"pointer",
            zIndex:"999",
            top:"max(15px,env(safe-area-inset-top))",
            right:"15px",
            padding:"10px 20px",
            fontSize:"clamp(14px,2vw,24px)",
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
        <source src={TimeVideo} type="video/mp4"/>
      </video>
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
        background:"linear-gradient(135deg,#1e293b,#0f172a)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        fontFamily:"Poppins,sans-serif",
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
          width:"min(95vw,900px)",
          // width:"100%",
        }}
      >
        <h1
          style={{
            fontSize:"clamp(30px,5vw,56px)",
            color:"#facc15",
            marginBottom:"20px",
          }}
        >
          ⏰ Time Teacher Quiz
        </h1>

        <p
          style={{
            fontSize:"clamp(16px,2.8vw,24px)",
            lineHeight:1.5,
            color:"#cbd5e1",
            marginBottom:"40px",
          }}
        >
          Learn to read clocks
          and become a
          Time Master.
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
            marginBottom:"20px",
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
          }}
        >
          🎥 Watch Video Again
        </div>

        <div
          style={{
            marginTop:"25px",
            color:"#94a3b8",
            fontSize:"18px",
          }}
        >
          Use TV Remote
          ↑ ↓ OK / Enter
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
        fontFamily: "Poppins,sans-serif",
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
        }}
      >
        {score}/{questions.length}
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

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "35px",
          flexWrap: "wrap",
        }}
      >
        <div
          onClick={beginQuiz}
          onTouchStart={beginQuiz}
          style={{
            padding: "18px 40px",
            borderRadius: "18px",
            background:"linear-gradient(135deg,#22c55e,#16a34a)",
            fontSize: "24px",
            fontWeight: "bold",
            cursor: "pointer",
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
            fontSize:"clamp(18px,3vw,24px)",
            padding:"14px 22px",
            borderRadius: "18px",
            background:"linear-gradient(135deg,#3b82f6,#2563eb)",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          🎥 Watch Video Again
        </div>
      </div>

      {/* HISTORY */}

      <div
        style={{
          width:"min(95vw,800px)",
          maxWidth: "95%",
          maxHeight: "300px",
          overflowY: "auto",
          background:"rgba(255,255,255,.08)",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            color: "#facc15",
            marginBottom: "20px",
          }}
        >
          📊 Quiz History
        </h3>

        {scoreHistory.length === 0 ? (

          <div
            style={{
              textAlign: "center",
            }}
          >
            No Previous Attempts
          </div>

        ) : (scoreHistory.map((item, index) => (
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
                  {scoreHistory.length - index}
                </div>

                <div
                  style={{
                    color: "#38bdf8",
                    fontWeight: "bold",
                  }}
                >
                  {item.score}/{item.total}
                </div>

                <div
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
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

if (!questions.length)
  return null;

const current =questions[currentQuestion];

return (

  <div
    style={{
      minHeight: "100vh",
      overflowY:"auto",
      background:"linear-gradient(135deg,#0f172a,#1e3a8a)",
      color: "white",
      fontFamily: "Poppins,sans-serif",
      padding: "12px",
    }}
  >
    <div
      style={{
        textAlign: "center",
        marginBottom: "30px",
      }}
    >

      <h2
        style={{
          color: "#60a5fa",
          marginTop: "15px",
        }}
      >
        Question {currentQuestion + 1}
        {" / "}
        {questions.length}
      </h2>
    </div>

    <div
      style={{
        width:"min(95vw,850px)",
        margin: "20px auto",
        background:"rgba(30,58,138,.92)",
        borderRadius: "24px",
        padding:"clamp(15px,3vw,30px)",
        textAlign: "center",
        paddingTop: "20px",
      }}
    >

      <h2
        style={{
          fontSize:"clamp(20px,4vw,30px)",
          lineHeight:1.4,
          marginBottom: "15px",
          color: "#facc15",
        }}
      >
        {current.question}
      </h2>

      <AnalogClock
        hour={current.hour}
        minute={current.minute}
      />

      {options.map(
        (option, index) => (

          <div
            key={index}
            onClick={() => {
                  setSelectedOption(index);
                  moveToNextQuestion(option);
              }}
            style={{
              padding:"14px",
              fontSize:"clamp(18px,4vw,30px)",
              wordBreak:"break-word",
              marginBottom: "14px",
              borderRadius: "16px",
              fontWeight: "700",
              background:selectedOption === index ? "#facc15" : "#2b4b7d",
              color:selectedOption === index ? "#111827" : "#ffffff",
              border:selectedOption === index ? "3px solid white" : "2px solid transparent",
              transition:"all .25s ease",
            }}
          >
            {selectedOption === index? "► " : ""}
            {option}
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
          marginTop: "20px",
          color: "#94a3b8",
        }}
      >
        ↑ ↓ Navigate • OK / Enter Select
      </div>

      <div
        style={{
          marginTop: "25px",
          fontSize:"clamp(18px,3vw,26px)",
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
