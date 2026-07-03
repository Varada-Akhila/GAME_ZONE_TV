import React, { useEffect, useState } from "react";

const countries = [
  {
    name: "India",
    flag: "🇮🇳",
    capital: "New Delhi",
    continent: "Asia",
    currency: "INR",
    population: "1.4B",
    landmark: "Taj Mahal",
  },
  {
    name: "Japan",
    flag: "🇯🇵",
    capital: "Tokyo",
    continent: "Asia",
    currency: "JPY",
    population: "125M",
    landmark: "Mount Fuji",
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    capital: "Canberra",
    continent: "Oceania",
    currency: "AUD",
    population: "26M",
    landmark: "Sydney Opera House",
  },
  {
    name: "Brazil",
    flag: "🇧🇷",
    capital: "Brasilia",
    continent: "South America",
    currency: "BRL",
    population: "215M",
    landmark: "Christ the Redeemer",
  },
  {
    name: "USA",
    flag: "🇺🇸",
    capital: "Washington D.C.",
    continent: "North America",
    currency: "USD",
    population: "333M",
    landmark: "Statue of Liberty",
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    capital: "Ottawa",
    continent: "North America",
    currency: "CAD",
    population: "40M",
    landmark: "Niagara Falls",
  },
  {
    name: "France",
    flag: "🇫🇷",
    capital: "Paris",
    continent: "Europe",
    currency: "EUR",
    population: "68M",
    landmark: "Eiffel Tower",
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    capital: "Berlin",
    continent: "Europe",
    currency: "EUR",
    population: "84M",
    landmark: "Brandenburg Gate",
  },
  {
    name: "Italy",
    flag: "🇮🇹",
    capital: "Rome",
    continent: "Europe",
    currency: "EUR",
    population: "59M",
    landmark: "Colosseum",
  },
  {
    name: "China",
    flag: "🇨🇳",
    capital: "Beijing",
    continent: "Asia",
    currency: "CNY",
    population: "1.4B",
    landmark: "Great Wall",
  },
];

export default function GeographyExplorerTV() {
  const menuItems = [
    "🌍 Explore World",
    "📝 Start Quiz",
  ];

  const [screen, setScreen] = useState("menu");
  const [focus, setFocus] = useState(0);
  const [countryIndex, setCountryIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [history,setHistory]=useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false); 
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] =useState(0);
  const [popup,setPopup]=useState(null);
  const currentCountry = countries[countryIndex];
  const isMobile = window.innerWidth <= 768;
  const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

  const createQuestion = () => {
    const types = [
      "flag",
      "capital",
      "currency",
      "continent",
      "landmark",
    ];

    const type = types[Math.floor(Math.random() * types.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    let prompt = "";
    let answer = "";
    let options = [];
    if (type === "flag") {
      prompt = `Which country owns this flag ${country.flag}?`;
      answer = country.name;
      options = shuffleArray(countries.map((c) => c.name)).slice(0, 4);
    }
    if (type === "capital") {
      prompt = `What is the capital of ${country.name}?`;
      answer = country.capital;
      options = shuffleArray(countries.map((c) => c.capital)).slice(0, 4);
    }
    if (type === "currency") {
      prompt = `What currency is used in ${country.name}?`;
      answer = country.currency;
      options = shuffleArray(countries.map((c) => c.currency)).slice(0, 4);
    }

    if (type === "continent") {
      prompt = `Which continent is ${country.name} in?`;
      answer = country.continent;
      options = [
        "Asia",
        "Europe",
        "Africa",
        "North America",
        "South America",
        "Oceania",
      ];
      options = shuffleArray(options).slice(0, 4);
    }

    if (type === "landmark") {
      prompt = `${country.landmark} belongs to which country?`;
      answer = country.name;
      options = shuffleArray(countries.map((c) => c.name)).slice(0, 4);
    }

    if (!options.includes(answer)) {
      options[0] = answer;
    }
    options = shuffleArray(options);
    return {
      prompt,
      answer,
      options,
    };
  };
 const [allQuestions] = useState(() => Array.from({ length: 100 }, () => createQuestion()));

  const showPopup = (type, text) => {
    setPopup({type,text,});
    setTimeout(() => {
      setPopup(null);
    }, 2200);
  };

  const checkAnswer = () => {
   const current = questions[currentQuestion];
   const correct =current.options[selectedOption] === current.answer;
   let newScore = score;
   if(correct){
      newScore++;
      setScore(newScore);
      showPopup("success","Correct");
      setHistory(prev=>[
      ...prev,
      {
      question:current.prompt,
      yourAnswer:current.options[selectedOption],
      correctAnswer:current.answer,
      correct:true
      }
      ]);
   }
   else{
      showPopup("error","Wrong");
      setHistory(prev=>[
      ...prev,
      {
      question:current.prompt,
      yourAnswer:current.options[selectedOption],
      correctAnswer:current.answer,
      correct:false
      }
      ]);
   }
   setTimeout(()=>{
      const next=currentQuestion+1;
      if(next>=15){
         setQuizCompleted(true);
         return;
      }
      setCurrentQuestion(next);
      setQuestion(questions[next]);
      setSelectedOption(0);
   },2300);

}

 const beginQuiz = () => {
   const shuffled =shuffleArray(allQuestions).slice(0,15);
  console.log("Quiz Started");
   console.log(shuffled);
   setQuestions(shuffled);
   setCurrentQuestion(0);
   setScore(0);
   setQuizCompleted(false);
   setQuestion(shuffled[0]);
   setSelectedOption(0);
   setScreen("quiz");
};

  useEffect(() => {
    const handleKey = (e) => {
      if (screen === "menu") {
        if (e.key === "ArrowDown") {
          setFocus((p) => (p + 1) % 2);
        }
        if (e.key === "ArrowUp") {
          setFocus((p) => (p - 1 + 2) % 2);
        }
        if (e.key === "Enter") {
          if (focus === 0) {
            setScreen("explore");
          }
          if (focus === 1) {
            beginQuiz();
          }
        }
      }

      if (screen === "explore") {
        if (e.key === "ArrowRight") {
          setCountryIndex((p) => (p + 1) % countries.length);
        }
        if (e.key === "ArrowLeft") {
          setCountryIndex((p) => (p - 1 + countries.length) % countries.length);
        }
        if (e.key === "Escape") {
          setScreen("menu");
        }
      }
      if (screen === "quiz" && question) {
        if (e.key === "ArrowDown") {
          setSelectedOption(
            (p) => (p + 1) % question.options.length);
        }
        if (e.key === "ArrowUp") {
          setSelectedOption((p) => (p - 1 + question.options.length) % question.options.length);
        }
        if (e.key === "Enter") {
          checkAnswer();
        }
        if (e.key === "Escape") {
          setScreen("menu");
        }
      }
    };

    window.addEventListener("keydown",handleKey);
    return () => window.removeEventListener("keydown",handleKey);
  }, [screen,focus,question,selectedOption,countryIndex,currentQuestion,questions]);
  if (quizCompleted) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h1
       style={{
        fontSize:isMobile?36:70,
        color:"#22c55e",
        textShadow:"0 0 20px #22c55e"
      }}
      >
       🎉 Quiz Completed</h1>

      <h2
      style={{
        fontSize:isMobile?30:55,
        color:"#facc15",
        fontWeight:"900"
      }}
      >
        Score : {score} / 15
      </h2>

      <button
        onClick={beginQuiz}
        style={{
          padding: "15px 35px",
          marginTop: 20,
          fontSize: 20,
        }}
      >
        Play Again
      </button>

      <button
        onClick={() => {
          setQuizCompleted(false);
          setScreen("explore");
        }}
        style={{
          padding: "15px 35px",
          marginTop: 15,
          fontSize: 20,
        }}
      >
        Explore World Again
      </button>
      <div
        style={{
        marginTop:30,
        width:isMobile?"95%":"80%",
        maxHeight:300,
        overflowY:"auto",
        padding:20,
        background:"#1e293b",
        borderRadius:20
        }}
        >
        <h2>Quiz History</h2>
        {
        history.map((item,index)=>
        <div
        key={index}
        style={{
        padding:10,
        marginBottom:10,
        background:item.correct?"#14532d":"#7f1d1d",
        borderRadius:10
        }}
        >
        <div>{item.question}</div>
        <div>Your Answer : {item.yourAnswer}</div>
        <div>Correct : {item.correctAnswer}</div>
        </div>
        )}
        </div>
    </div>
  );
}
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background:"radial-gradient(circle at top,#0ea5e9,#0f172a 40%,#020617 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily:"Poppins,sans-serif",
      }}
    >
      <div
        style={{
          height: isMobile ? 70 : 90,
          display: "flex",
          justifyContent:"space-between",
          alignItems: "center",
          padding: isMobile ? "0 15px" : "0 40px",
          background:"rgba(255,255,255,.05)",
          borderBottom:"2px solid rgba(255,255,255,.08)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize:isMobile ? 24 : 40,
            fontWeight: 900,
            color: "#38bdf8",
          }}
        >
          🌍 Geography Explorer
        </h1>
      </div>

      {screen === "menu" && (
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns:isMobile ? "1fr" : "repeat(2,1fr)",
            gap:isMobile ? 15 : 30,
            padding:isMobile ? 15 : 40,
          }}
        >
          {menuItems.map(
            (item, index) => (
              <div
                key={index}
                onClick={()=>{
                  if(index===0)setScreen("explore");
                  if(index===1){
                    beginQuiz();
                  }
                }}
                style={{
                  padding:isMobile ? 15 : 10,
                  minHeight:isMobile ? 70 : 120,
                  display: "flex",
                  justifyContent:"center",
                  alignItems:"center",
                 fontSize:isMobile ? 18 : 28,
                  fontWeight: 800,
                  borderRadius: 20,
                  transition:".25s",
                  background:focus === index ? "linear-gradient(135deg,#38bdf8,#0284c7)" : "linear-gradient(135deg,#1e293b,#334155)",
                  border:focus === index ? "4px solid white" : "2px solid #475569",
                  transform:focus === index ? "scale(1.05)" : "scale(1)",
                  boxShadow:focus === index ? "0 0 35px rgba(56,189,248,.8)" : "none",
                }}
              >
                {item}
              </div>
            )
          )}
        </div>

      )}

     {screen === "explore" && (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop:isMobile ? 20 : 50,
          position: "relative",
          
        }}
      >

    {/* Background Glow */}
    <div
      style={{
        position: "absolute",
        top: 100,
        width:isMobile ? 300 : 700,
        height:isMobile ? 300 : 700,
        borderRadius: "50%",
        background: "rgba(14,165,233,.15)",
        filter: "blur(120px)",
        zIndex: 0,
      }}
    />

    {/* Country Icon */}
    <div
      style={{
        fontSize:isMobile ? 80 : 130,
        marginBottom: 10,
        zIndex: 1,
        filter:"drop-shadow(0px 0px 20px rgba(255,255,255,.5))",
      }}
    >
      🌍
    </div>

    {/* Country Name */}
    <h1
      style={{
        margin: 0,
        fontSize:isMobile ? 34 : 62,
        fontWeight: 900,
        color: "#ffffff",
        zIndex: 1,
        textShadow:"0px 0px 20px rgba(56,189,248,.8)",
      }}
    >
      {currentCountry.name}
    </h1>

    {/* Info Card */}
    <div
      style={{
        width:isMobile ? "95%" : 1050,
        marginTop: 25,
        padding:isMobile ? 20 : 40,
        borderRadius: 30,
        background:"linear-gradient(135deg,rgba(15,23,42,.95),rgba(30,41,59,.95))",
        border:"2px solid rgba(56,189,248,.35)",
        boxShadow:"0 0 50px rgba(14,165,233,.25)",
        zIndex: 1,
      }}
    >

      <div
        style={{
          display: "grid",
          gridTemplateColumns:isMobile ? "1fr" : "repeat(2,1fr)",
          gap: 30,
        }}
      >

        <div style={{textAlign: "center",}}>
          <div style={{fontSize:isMobile ? 16 : 22,color: "#cbd5e1",}}>🏛 Capital</div>
          <div
            style={{
              fontSize:isMobile ? 22 : 34,
              color: "#38bdf8",
              fontWeight: 800,
            }}
          >
            {currentCountry.capital}
          </div>
        </div>

        <div style={{textAlign: "center",}}>
          <div style={{fontSize:isMobile ? 16 : 22,color: "#cbd5e1",}}>💰 Currency</div>
          <div
            style={{
              fontSize:isMobile ? 22 : 34,
              color: "#38bdf8",
              fontWeight: 800,
            }}
          >
            {currentCountry.currency}
          </div>
        </div>

        <div style={{textAlign: "center",}}>
          <div style={{fontSize:isMobile ? 16 : 22,color: "#cbd5e1",}}> 🌎 Continent</div>
          <div
            style={{
              fontSize:isMobile ? 22 : 34,
              color: "#38bdf8",
              fontWeight: 800,
            }}
          >
            {currentCountry.continent}
          </div>
        </div>

        <div style={{textAlign: "center",}}>
          <div style={{fontSize:isMobile ? 16 : 22,color: "#cbd5e1",}}> 👥 Population</div>
          <div
            style={{
              fontSize:isMobile ? 22 : 34,
              color: "#38bdf8",
              fontWeight: 800,
            }}
          >
            {currentCountry.population}
          </div>
        </div>

      </div>
      <div style={{marginTop: 40,textAlign: "center",}}>
        <div style={{fontSize: 24,color: "#cbd5e1",}}> 🗺 Landmark</div>
        <div
          style={{
            fontSize:isMobile ? 28 : 42,
            color: "#facc15",
            fontWeight: 900,
            textShadow:"0px 0px 15px rgba(250,204,21,.5)",
          }}
        >
          {currentCountry.landmark}
        </div>
      </div>
      {isMobile && (
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button onClick={() => setCountryIndex((countryIndex - 1 + countries.length) % countries.length)}>
          ◀ Previous
        </button>

        {/* <button onClick={visitCountry}>
          Visit
        </button> */}
        <button onClick={() => setCountryIndex((countryIndex + 1) % countries.length)}>
          Next ▶
        </button>
        <button
          onClick={()=>{
          setScreen("menu");
          }}
          style={{
          padding:"12px 20px",
          fontSize:16,
          borderRadius:10,
          border:"none",
          background:"#ef4444",
          color:"white",
          cursor:"pointer"
          }}
          >
          ⬅ Back
          </button>
      </div>
    )}

    </div>

    {/* Footer Controls */}
    <div
      style={{
        marginTop: 30,
        fontSize:isMobile ? 16 : 26,
        fontWeight: 700,
        color: "#e2e8f0",
        letterSpacing: 1,
        zIndex: 1,
      }}
    >
      ESC Back
    </div>

  </div>
)}
      {screen === "quiz" && question && (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent:"center",
            alignItems:"center",
            padding:isMobile ? 15 : 30,
          }}
        >
          <div
            style={{
              width:isMobile ? "95%" : "80%",
              maxWidth: 1000,
              padding:isMobile ? 20 : 40,
              borderRadius: 30,
              background:"linear-gradient(180deg,#1e293b,#0f172a)",
              border:"3px solid #38bdf8",
            }}
          >
            <h1
              style={{
                textAlign:"center",
                fontSize:isMobile ? 26 : 46,
                marginBottom: 40,
                color:"#ffffff",
                textShadow:"0 0 12px #38bdf8",
                fontWeight:"900",
              }}
            >
              {question.prompt}
            </h1>
            <h2
                style={{
                textAlign:"center",
                marginBottom:20
                }}>
                Question {currentQuestion+1} / 15
            </h2>

            {question.options.map((option,index) => (
                <div
                  key={index}
                  onClick={()=>{
                  setSelectedOption(index);
                  setTimeout(checkAnswer,200);
                  }}
                  style={{
                    padding:isMobile ? 15 : 22,
                    marginBottom: 18,
                    borderRadius: 18,
                    textAlign:"center",
                    fontSize:isMobile ? 18 : 28,
                    fontWeight: 800,
                    background: selectedOption === index ? "linear-gradient(90deg,#facc15,#f59e0b)" : "linear-gradient(90deg,#334155,#1e293b)",
                    color:selectedOption === index ? "#111827" : "#ffffff",
                    border:selectedOption === index ? "3px solid white" : "2px solid #475569",
                  }}
                >
                  {option}
                </div>
              )
            )}
            <div
                style={{
                textAlign:"center",
                marginTop:20,
                fontSize:isMobile?20:30,
                fontWeight:"bold",
                color:"#facc15",
                textShadow:"0 0 10px #facc15"
                }}
                >
                Score : {score}
            </div>
          </div>
        </div>

      )}

      {popup && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent:"center",
            alignItems:"center",
            background:"rgba(0,0,0,.5)",
          }}
        >
          <div
            style={{
              padding:isMobile ? "20px 30px" : "40px 80px",
              fontSize:isMobile ? 22 : 38,
              borderRadius: 25,
              fontWeight: 900,
              background: popup.type === "success" ? "linear-gradient(135deg,#22c55e,#15803d)":"linear-gradient(135deg,#ef4444,#991b1b)"
            }}
          >
            {popup.text}
          </div>
        </div>

      )}

    </div>
  );
}