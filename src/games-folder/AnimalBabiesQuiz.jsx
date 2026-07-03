import React, { useState, useEffect } from "react";
// import AnimalBabyVideo from "../assets/BabyAnimalNames.mp4";
const AnimalBabyVideo="https://games.vrplay.in/videos/baby%20animal.mp4"

/* =========================================
   ANIMAL BABIES QUIZ
========================================= */

const ALL_QUESTIONS = [

{
  question:"What is a baby dog called?",
  answer:"Puppy",
  options:["Puppy","Kitten","Cub","Calf"]
},

{
  question:"What is a baby cat called?",
  answer:"Kitten",
  options:["Kitten","Puppy","Cub","Lamb"]
},

{
  question:"What is a baby cow called?",
  answer:"Calf",
  options:["Calf","Foal","Kid","Cub"]
},

{
  question:"What is a baby horse called?",
  answer:"Foal",
  options:["Foal","Calf","Kid","Puppy"]
},

{
  question:"What is a baby goat called?",
  answer:"Kid",
  options:["Kid","Lamb","Calf","Cub"]
},

{
  question:"What is a baby sheep called?",
  answer:"Lamb",
  options:["Lamb","Kid","Foal","Pup"]
},

{
  question:"What is a baby pig called?",
  answer:"Piglet",
  options:["Piglet","Cub","Kid","Foal"]
},

{
  question:"What is a baby lion called?",
  answer:"Cub",
  options:["Cub","Pup","Calf","Foal"]
},

{
  question:"What is a baby tiger called?",
  answer:"Cub",
  options:["Cub","Puppy","Kid","Lamb"]
},

{
  question:"What is a baby elephant called?",
  answer:"Calf",
  options:["Calf","Cub","Foal","Kid"]
},

{
  question:"What is a baby kangaroo called?",
  answer:"Joey",
  options:["Joey","Cub","Calf","Pup"]
},

{
  question:"What is a baby deer called?",
  answer:"Fawn",
  options:["Fawn","Cub","Kid","Foal"]
},

{
  question:"What is a baby rabbit called?",
  answer:"Bunny",
  options:["Bunny","Cub","Pup","Calf"]
},

{
  question:"What is a baby fox called?",
  answer:"Kit",
  options:["Kit","Cub","Pup","Calf"]
},

{
  question:"What is a baby wolf called?",
  answer:"Pup",
  options:["Pup","Cub","Kid","Foal"]
},

{
  question:"What is a baby chicken called?",
  answer:"Chick",
  options:["Chick","Duckling","Cub","Kit"]
},

{
  question:"What is a baby duck called?",
  answer:"Duckling",
  options:["Duckling","Chick","Cub","Pup"]
},

{
  question:"What is a baby goose called?",
  answer:"Gosling",
  options:["Gosling","Duckling","Chick","Cub"]
},

{
  question:"What is a baby swan called?",
  answer:"Cygnet",
  options:["Cygnet","Duckling","Chick","Pup"]
},

{
  question:"What is a baby owl called?",
  answer:"Owlet",
  options:["Owlet","Chick","Cub","Kit"]
},

{
  question:"What is a baby eagle called?",
  answer:"Chick",
  options:["Chick","Cub","Kit","Pup"]
},

{
  question:"What is a baby penguin called?",
  answer:"Chick",
  options:["Chick","Cub","Pup","Kit"]
},

{
  question:"What is a baby frog called?",
  answer:"Tadpole",
  options:["Tadpole","Fry","Cub","Pup"]
},

{
  question:"What is a baby fish called?",
  answer:"Fry",
  options:["Fry","Tadpole","Cub","Pup"]
},

{
  question:"What is a baby shark called?",
  answer:"Pup",
  options:["Pup","Cub","Fry","Calf"]
},

{
  question:"What is a baby whale called?",
  answer:"Calf",
  options:["Calf","Cub","Pup","Kit"]
},

{
  question:"What is a baby dolphin called?",
  answer:"Calf",
  options:["Calf","Cub","Pup","Joey"]
},

{
  question:"What is a baby turtle called?",
  answer:"Hatchling",
  options:["Hatchling","Cub","Pup","Fry"]
},

{
  question:"What is a baby crocodile called?",
  answer:"Hatchling",
  options:["Hatchling","Cub","Pup","Chick"]
},

{
  question:"What is a baby alligator called?",
  answer:"Hatchling",
  options:["Hatchling","Cub","Pup","Kit"]
},

{
  question:"What is a baby panda called?",
  answer:"Cub",
  options:["Cub","Pup","Calf","Joey"]
},

{
  question:"What is a baby bear called?",
  answer:"Cub",
  options:["Cub","Kit","Pup","Foal"]
},

{
  question:"What is a baby zebra called?",
  answer:"Foal",
  options:["Foal","Calf","Cub","Kid"]
},

{
  question:"What is a baby giraffe called?",
  answer:"Calf",
  options:["Calf","Foal","Cub","Pup"]
},

{
  question:"What is a baby camel called?",
  answer:"Calf",
  options:["Calf","Cub","Kid","Foal"]
},

{
  question:"What is a baby monkey called?",
  answer:"Infant",
  options:["Infant","Cub","Pup","Calf"]
},

{
  question:"What is a baby seal called?",
  answer:"Pup",
  options:["Pup","Cub","Kit","Calf"]
},

{
  question:"What is a baby bat called?",
  answer:"Pup",
  options:["Pup","Cub","Kit","Foal"]
},

{
  question:"What is a baby pigeon called?",
  answer:"Squab",
  options:["Squab","Chick","Duckling","Gosling"]
},

{
  question:"What is a baby peacock called?",
  answer:"Peachick",
  options:["Peachick","Chick","Squab","Kit"]
},

{
  question:"What is a baby turkey called?",
  answer:"Poult",
  options:["Poult","Chick","Duckling","Gosling"]
},

{
  question:"What is a baby llama called?",
  answer:"Cria",
  options:["Cria","Foal","Kid","Calf"]
},

{
  question:"What is a baby alpaca called?",
  answer:"Cria",
  options:["Cria","Cub","Pup","Foal"]
},

{
  question:"What is a baby otter called?",
  answer:"Kit",
  options:["Kit","Cub","Pup","Calf"]
},

{
  question:"What is a baby beaver called?",
  answer:"Kit",
  options:["Kit","Cub","Pup","Foal"]
},

{
  question:"What is a baby squirrel called?",
  answer:"Kit",
  options:["Kit","Cub","Pup","Calf"]
},

{
  question:"What is a baby raccoon called?",
  answer:"Kit",
  options:["Kit","Cub","Pup","Foal"]
},{
  question:"Which animal has a baby called a Joey?",
  answer:"Kangaroo",
  options:["Kangaroo","Lion","Elephant","Tiger"]
},

{
  question:"Which animal has a baby called a Fawn?",
  answer:"Deer",
  options:["Deer","Horse","Goat","Cow"]
},

{
  question:"Which animal has a baby called a Piglet?",
  answer:"Pig",
  options:["Pig","Goat","Cow","Sheep"]
},

{
  question:"Which animal has a baby called a Cygnet?",
  answer:"Swan",
  options:["Swan","Duck","Goose","Owl"]
},

{
  question:"Which animal has a baby called a Tadpole?",
  answer:"Frog",
  options:["Frog","Fish","Snake","Turtle"]
},

{
  question:"Which animal has a baby called a Duckling?",
  answer:"Duck",
  options:["Duck","Goose","Swan","Chicken"]
},

{
  question:"Which animal has a baby called a Gosling?",
  answer:"Goose",
  options:["Goose","Duck","Swan","Turkey"]
},

{
  question:"Which animal has a baby called a Hatchling?",
  answer:"Turtle",
  options:["Turtle","Cow","Dog","Horse"]
},

{
  question:"Which animal has a baby called a Calf?",
  answer:"Elephant",
  options:["Elephant","Lion","Tiger","Wolf"]
},

{
  question:"Which animal has a baby called a Cub?",
  answer:"Lion",
  options:["Lion","Horse","Goat","Cow"]
}

];

/* =========================================
   COMPONENT START
========================================= */

export default function AnimalBabiesQuiz() {

const [videoEnded,setVideoEnded] = useState(false);
const [startQuiz,setStartQuiz] = useState(false);
const [quizCompleted,setQuizCompleted] = useState(false);

const [questions,setQuestions] = useState([]);
const [currentQuestion,setCurrentQuestion] = useState(0);

const [score,setScore] = useState(0);

const [selectedOption,setSelectedOption] = useState(0);
const [options,setOptions] = useState([]);

const [message,setMessage] = useState("");

const [scoreHistory,setScoreHistory] =useState(JSON.parse(localStorage.getItem("animalBabyQuizHistory") || "[]"));

const [selectedMenu,setSelectedMenu] = useState(0);

/* =========================================
   SHUFFLE ARRAY
========================================= */

const shuffleArray = (array) => {

    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
};

/* =========================================
   START QUIZ
========================================= */

const beginQuiz = () => {

    const shuffled =shuffleArray(ALL_QUESTIONS).slice(0,15).map(q => ({...q,options: shuffleArray(q.options)}));

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

    if (isCorrect) {
        setScore(updatedScore);
        setMessage("✅ Correct!");
    } else {
        setMessage(`❌ Correct Answer: ${current.answer}`);
    }

    setTimeout(() => {

    const nextIndex = currentQuestion + 1;

    if (nextIndex >= questions.length) {

    const history = [
    {
    score: updatedScore,
    total: questions.length,
    date: new Date().toLocaleString()
    },
    ...scoreHistory

    ];

    setScoreHistory(history);
    localStorage.setItem("animalBabyQuizHistory",JSON.stringify(history));
    setQuizCompleted(true);
    return;
}

    const nextQuestion =questions[nextIndex];
    setCurrentQuestion(nextIndex);
    setOptions(nextQuestion.options);
    setSelectedOption(0);
    setMessage("");
    },1200);

};

/* =========================================
   PERFORMANCE TEXT
========================================= */

const getPerformanceText = () => {

    const percentage =(score / questions.length) * 100;

        if (percentage >= 90)
        return "🏆 Animal Expert";

        if (percentage >= 75)
        return "⭐⭐⭐ Animal Master";

        if (percentage >= 50)
        return "⭐⭐ Animal Learner";

        return "⭐ Keep Learning";
};

/* =========================================
   TV REMOTE CONTROLS
========================================= */

useEffect(() => {

    const handleKey = (e) => {

    if (videoEnded && !startQuiz &&e.key === "ArrowUp") {
        setSelectedMenu(prev =>prev === 0 ? 1 : prev - 1);
        return;
    }

    if (videoEnded && !startQuiz &&e.key === "ArrowDown") {
        setSelectedMenu(prev =>prev === 1 ? 0 : prev + 1);
        return;
    }

    if (videoEnded && !startQuiz && e.key === "Enter") {

    if (selectedMenu === 0)
        beginQuiz();

    if (selectedMenu === 1)
        setVideoEnded(false);
        return;
    }
    if (startQuiz && !quizCompleted) {

    if (e.key === "ArrowUp") {
        setSelectedOption(prev =>prev === 0 ? options.length - 1 : prev - 1);
    }

    if (e.key === "ArrowDown") {
        setSelectedOption(prev =>prev === options.length - 1? 0 : prev + 1);
    }

    if (e.key === "Enter") {
    moveToNextQuestion(options[selectedOption]);
    }

}

    if (quizCompleted &&e.key === "Enter") {
    beginQuiz();
    }
};

    window.addEventListener("keydown",handleKey);

    return () =>
    window.removeEventListener("keydown",handleKey);
},[videoEnded,startQuiz,quizCompleted,selectedOption,options,questions,currentQuestion,selectedMenu]);

/* =========================================
   VIDEO SCREEN
========================================= */

    if (!videoEnded) {

    return (

        <div
        style={{
        minHeight:"100vh",
        background:"linear-gradient(135deg,#dcfce7,#ecfccb)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:"20px"
        }}
        >
          <div
            onClick={() => setVideoEnded(true)}
            style={{
            position:"absolute",
            top:"50px",
            right:"25px",
            background:
            "linear-gradient(135deg,#f59e0b,#fbbf24)",
            padding:"15px 35px",
            borderRadius:"18px",
            color:"#fff",
            fontSize:"24px",
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
            width:"95%",
            maxHeight:"90vh",
            borderRadius:"25px",
            boxShadow:"0 10px 40px rgba(0,0,0,.25)"
          }}
          >

        <source src={AnimalBabyVideo} type="video/mp4"/>
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
        minHeight:"100vh",
        background:"linear-gradient(135deg,#dcfce7,#f0fdf4)",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:"30px",
        fontFamily:"Poppins,sans-serif"
        }}
        >

        <div
        style={{
        width:"100%",
        maxWidth:"1000px",
        background:"#fff",
        borderRadius:"35px",
        padding:"60px",
        textAlign:"center",
        boxShadow:"0 15px 40px rgba(0,0,0,.08)"
        }}
        >

        <div
        style={{
        fontSize:"90px",
        marginBottom:"15px"
        }}
        >
        🐾
        </div>

        <h1
        style={{
        fontSize:"58px",
        color:"#16a34a",
        marginBottom:"20px"
        }}
        >
        Animal Babies Quiz
        </h1>

        <p
        style={{
        fontSize:"26px",
        color:"#475569",
        lineHeight:"1.6",
        marginBottom:"40px"
        }}
        >
        Learn baby animal names,
        test your knowledge,
        and become an
        Animal Expert.
        </p>

        <div
        onClick={beginQuiz}
        style={{
        background:selectedMenu === 0 ? "linear-gradient(135deg,#15803d,#16a34a)": "linear-gradient(135deg,#22c55e,#16a34a)",
        color:"#fff",
        padding:"24px 60px",
        borderRadius:"22px",
        fontSize:"34px",
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
        background: selectedMenu === 1? "linear-gradient(135deg,#d97706,#f59e0b)": "linear-gradient(135deg,#f59e0b,#fbbf24)",
        color:"#fff",
        padding:"24px 60px",
        borderRadius:"22px",
        fontSize:"34px",
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
        background:"#dcfce7",
        padding:"15px 25px",
        borderRadius:"15px",
        fontWeight:"600",
        color:"#166534"
        }}
        >
        🐶 50+ Questions
        </div>

        <div
        style={{
        background:"#dcfce7",
        padding:"15px 25px",
        borderRadius:"15px",
        fontWeight:"600",
        color:"#166534"
        }}
        >
        🐘 Baby Animals
        </div>

        <div
        style={{
        background:"#dcfce7",
        padding:"15px 25px",
        borderRadius:"15px",
        fontWeight:"600",
        color:"#166534"
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

if (quizCompleted) {

return (

        <div
        style={{
        minHeight:"100vh",
        background:"linear-gradient(135deg,#dcfce7,#f0fdf4)",
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
            fontSize: "64px",
            color: "#16a34a",
            marginBottom: "20px"
          }}
      >
        🎉 Quiz Completed
      </h1>

      <div
        style={{
          width: "230px",
          height: "230px",
          borderRadius: "50%",
          background:"linear-gradient(135deg,#22c55e,#16a34a)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          fontSize: "58px",
          fontWeight: "900",
          marginBottom: "25px"
        }}
      >
        {score}/{questions.length}
      </div>

      <h2
        style={{
          fontSize: "36px",
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
            padding: "20px 45px",
            borderRadius: "20px",
            fontSize: "24px",
            fontWeight: "700",
            cursor: "pointer"
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
            padding: "20px 45px",
            borderRadius: "20px",
            fontSize: "24px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          🎥 Watch Video Again
        </div>

      </div>

      <div
        style={{
          width: "900px",
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
            color: "#16a34a",
            marginBottom: "20px"
          }}
        >
          📊 Quiz History
        </h3>

        {
          scoreHistory.length === 0 ?

          (
            <div
              style={{
                textAlign: "center",
                color: "#64748b"
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
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "14px",
                  borderBottom:"1px solid #e2e8f0"
                }}
              >
                <div>
                  Attempt #
                  {scoreHistory.length - index}
                </div>

                <div
                  style={{
                    fontWeight: "700",
                    color: "#16a34a"
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

if (!questions.length)
  return null;

const current = questions[currentQuestion];

return (

  <div
    style={{
      minHeight: "100vh",
      background:"linear-gradient(135deg,#dcfce7,#f0fdf4)",
      padding: "25px",
      fontFamily: "Poppins,sans-serif",
      overflowY: "auto"
    }}
  >

    <div
      style={{
        textAlign: "center",
        marginBottom: "20px"
      }}
    >

      <h1
        style={{
          color: "#16a34a",
          fontSize: "48px",
          marginBottom: "10px"
        }}
      >
        🐾 Animal Babies Quiz
      </h1>

      <h2
        style={{
          color: "#475569"
        }}
      >
        Question {currentQuestion + 1}
        {" / "}
        {questions.length}
      </h2>

    </div>

    <div
      style={{
        maxWidth: "950px",
        margin: "0 auto",
        background: "#ffffff",
        borderRadius: "30px",
        padding: "30px",
        boxShadow:"0 15px 40px rgba(0,0,0,.08)"
      }}
    >

      <h2
        style={{
          textAlign: "center",
          color: "#0f172a",
          fontSize: "34px",
          marginBottom: "30px"
        }}
      >
        {current.question}
      </h2>

      {
        options.map((option,index) => (

          <div
            key={index}
            style={{
              padding: "18px",
              marginBottom: "15px",
              borderRadius: "18px",
              fontSize: "28px",
              fontWeight: "700",
              cursor: "pointer",
              background:selectedOption === index ? "#16a34a" : "#e2e8f0",
              color: selectedOption === index ? "#fff" : "#0f172a",
              border:selectedOption === index ? "4px solid #86efac" : "2px solid transparent"
            }}
          >
            {selectedOption === index ? "► " : "" }{option}
          </div>

        ))
      }

      <div
        style={{
          minHeight: "50px",
          marginTop: "15px",
          textAlign: "center",
          fontSize: "26px",
          fontWeight: "700",
          color: "#16a34a"
        }}
      >
        {message}
      </div>

      <div
        style={{
          marginTop: "25px",
          textAlign: "center",
          color: "#64748b",
          fontSize: "18px"
        }}
      >
        ↑ ↓ Navigate • OK / Enter Select
      </div>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "700",
          color: "#16a34a"
        }}
      >
        Score: {score}
      </div>

    </div>

  </div>

);

}