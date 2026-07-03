import React, { useEffect, useState } from "react";
// import LabVideo from "../assets/LabIntroduction1.mp4";\
const LabVideo="https://games.vrplay.in/videos/magical.mp4";

const ingredients = [
  "🔴 Red Crystal",
  "🟢 Green Liquid",
  "🔵 Blue Gas",
  "🟡 Solar Dust",
  "⚪ Moon Powder",
  "🟣 Plasma Orb",
  "🟠 Fire Core",
  "🟤 Earth Stone",
  "💎 Diamond Particle",
  "🌊 Ocean Essence",
  "⚡ Electric Spark",
  "☄️ Meteor Fragment",
  "🌋 Lava Drop",
  "❄️ Ice Crystal",
  "🌩️ Storm Energy",
  "🌈 Rainbow Powder",
  "🌌 Galaxy Dust",
  "☢️ Nuclear Cell",
  "🧬 DNA Extract",
  "🦠 Micro Organism",
  "🌱 Nature Seed",
  "🌸 Flower Essence",
  "☀️ Sun Energy",
  "🌙 Lunar Crystal",
  "🧪 Chemical X",
  "🧲 Magnetic Stone",
  "✨ Space Particle",
  "💨 Wind Molecule",
  "🔥 Dragon Flame",
  "🧊 Frozen Core",
];

export default function LabExperimentTV() {

  const menuItems = [
    "🧪 Start Experiment",
    "♾ Endless Mode",
    "🏆 Achievements",
    "📖 How To Play",
  ];

  // Video starts first
  const [screen, setScreen] = useState("video");
  const [focus, setFocus] = useState(0);


  // Player Stats
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);


  // Experiment Data
  const [formula, setFormula] = useState([]);
  const [visibleIngredients, setVisibleIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [gridFocus, setGridFocus] = useState(0);


  // Formula Screen
  const [showFormula, setShowFormula] = useState(false);


  // Game Mode
  const [isEndless, setIsEndless] = useState(false);


  // Popup Message
  const [popup, setPopup] = useState(null);


  // =========================
  // Popup Function
  // =========================

  const showPopupMessage = (text,type = "success") => {
    setPopup({text,type});
    setTimeout(() => {
      setPopup(null);
      if (isEndless) {
        startExperiment();
      } else {
        setScreen("menu");
      }
    }, 1500);

  };  
  // =========================
  // Start New Experiment
  // =========================

  const startExperiment = () => {

    // Show only 4 ingredients on TV
    const randomIngredients = [...ingredients]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    // Formula contains only 2 ingredients
    const randomFormula = [...randomIngredients]
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    setVisibleIngredients(randomIngredients);
    setFormula(randomFormula);
    setSelectedIngredients([]);
    setGridFocus(0);

    // Show formula first
    setShowFormula(true);

    setTimeout(() => {
      setShowFormula(false);
      setScreen("experiment");

    }, 4000);

  };
  // =========================
  // Select Ingredient
  // =========================

  const toggleIngredient = (item) => {

    setSelectedIngredients((prev) => {

      // Remove if already selected
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      }

      // Maximum selection = Formula length
      if (prev.length >= formula.length) {
        return prev;
      }

      // Add new ingredient
      return [...prev,item];
    });

  };
  // =========================
  // Check Experiment Result
  // =========================
  const checkExperiment = () => {
    const correct =
      formula.length === selectedIngredients.length &&
      formula.every((item) =>
        selectedIngredients.includes(item)
      );
    if (correct) {
      const earnedXP = 100;
      setXp((prev) => {
        const newXP = prev + earnedXP;
        // Level Up
        if (newXP >= level * 500) {
          setLevel((old) => old + 1);
        }
        return newXP;
      });
      setStreak((prev) => prev + 1);
      showPopupMessage("✅ Perfect Experiment! +100 XP");
    } else {
      setStreak(0);

      showPopupMessage(
        "❌ Wrong Chemical Combination",
        "error"
      );
    }
  };
  // =========================
  // TV Remote Controls
  // =========================

  useEffect(() => {
    const handleKey = (e) => {      
      // =========================
      // MENU CONTROLS
      // =========================
      if (screen === "menu") {
        if (e.key === "ArrowRight") {
        setFocus((prev) =>(prev + 1) % menuItems.length);}

        if (e.key === "ArrowLeft") {

          setFocus((prev) =>
            (prev - 1 + menuItems.length) % menuItems.length);

        }
        if (e.key === "Enter") {
          // Normal Mode
          if (focus === 0) {
            setIsEndless(false);
            startExperiment();
          }
          // Endless Mode
          if (focus === 1) {
            setIsEndless(true);
            startExperiment();
          }
          // Achievements
          if (focus === 2) {
            setScreen("achievements");
          }
          // How To Play
          if (focus === 3) {
            setScreen("help");
          }
        }
      }
      // =========================
      // EXPERIMENT CONTROLS
      // =========================

      if (screen === "experiment") {
        // Move Right
        if (e.key === "ArrowRight") {
          setGridFocus((prev) =>
            (prev + 1) % visibleIngredients.length);
        }
        // Move Left
        if (e.key === "ArrowLeft") {
          setGridFocus((prev) =>
            (prev - 1 + visibleIngredients.length) % visibleIngredients.length);
        }
        // Select Ingredient
        if (e.key === "Enter") {
          toggleIngredient(visibleIngredients[gridFocus]);
        }
        // Submit Formula
        if (e.key === "ArrowDown") {
          checkExperiment();
        }
        // Exit Experiment
        if (e.key === "Escape") {
          setScreen("menu");
        }
      }

      // =========================
      // ACHIEVEMENTS & HELP
      // =========================

      if (screen === "achievements" || screen === "help") {
        if (e.key === "Escape") {
          setScreen("menu");
        }
      }
    };
    window.addEventListener("keydown",handleKey);
    return () =>
      window.removeEventListener("keydown",handleKey);
  }, [screen,focus,gridFocus,selectedIngredients,formula,visibleIngredients,xp,level,isEndless]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background:"linear-gradient(135deg,#020617 0%,#0f172a 35%,#1e3a8a 70%,#06b6d4 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins, sans-serif",
      }}
    >      {/* =========================
            INTRO VIDEO SCREEN
          ========================= */}
      {screen === "video" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "#000",
              zIndex: 1000,
            }}
          >
            <video
              width="100%"
              height="100%"
              autoPlay
              controls={false}
              onEnded={() => setScreen("menu")}
              style={{objectFit: "cover",}}
            >
              <source src={LabVideo} type="video/mp4" />
            </video>
            {/* Skip Button */}
            <button
              onClick={() =>
                setScreen("menu")
              }
              style={{
                position: "absolute",
                top: 25,
                right: 25,
                padding: "15px 30px",
                fontSize: 22,
                fontWeight: 800,
                borderRadius: 15,
                border: "none",
                cursor: "pointer",
                color: "white",
                background:"linear-gradient(135deg,#ef4444,#b91c1c)",
                boxShadow:"0 0 20px #ef4444",
              }}
            >
              ⏭ Skip
            </button>
          </div>
        )
      }
      {/* ================= HEADER ================= */}
      <div
        style={{
          height: 90,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          background: "rgba(0,0,0,.25)",
          borderBottom:"2px solid rgba(255,255,255,.15)",
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: 42,
            color: "#67e8f9",
            fontWeight: 900,
          }}
        >
          🧪 Lab Experiment
        </h1>
        <div
          style={{
            display: "flex",
            gap: 25,
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          <span>
            ⭐ XP: {xp}
          </span>

          <span>
            🏆 Level {level}
          </span>

          <span>
            🔥 Streak {streak}
          </span>

          <span
            style={{
              color:
                isEndless
                  ? "#facc15"
                  : "#86efac",
            }}
          >
            {
              isEndless
                ? "♾ Endless"
                : "🧪 Normal"
            }
          </span>

        </div>

      </div>


      {/* ================= FORMULA SCREEN ================= */}

      {showFormula && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 25,
            }}
          >
            <h1
              style={{
                fontSize: 60,
                color: "#facc15",
                margin: 0,
              }}
            >
              🧠 Memorize Formula
            </h1>
            <div
              style={{
                width: "60%",
                padding: 40,
                borderRadius: 30,
                background:"rgba(15,23,42,.9)",
                border:"3px solid #38bdf8",
                textAlign: "center",
                boxShadow:"0 0 40px #38bdf8",
              }}
            >
              {formula.map(
                  (item,index)=>(
                    <div
                      key={index}
                      style={{
                        fontSize: 34,
                        marginBottom: 20,
                        fontWeight: 800,
                      }}
                    >
                      {item}
                    </div>
                  )
                )
              }

            </div>
            <h2 style={{color:"#cbd5e1",}}>Remember these ingredients!</h2>
          </div>
        )
      }

      {/* ================= MENU SCREEN ================= */}
      {screen === "menu" && !showFormula && (
          <div
            style={{
              flex:1,
              display:"grid",
              gridTemplateColumns:"repeat(2,1fr)",
              gap:30,
              padding:40,
            }}
          >
            {menuItems.map((item,index)=>(
                  <div
                    key={index}
                    style={{
                      display:"flex",
                      justifyContent:"center",
                      alignItems:"center",
                      borderRadius:35,
                      fontSize:34,
                      fontWeight:800,
                      background:focus === index ? "linear-gradient(135deg,#06b6d4,#2563eb)" : "linear-gradient(135deg,#1e293b,#334155)",
                      border:focus === index ? "4px solid white" : "2px solid #475569",
                      transform: focus === index ? "scale(1.05)" : "scale(1)",
                      transition:".25s",
                      boxShadow:focus === index ? "0 0 35px #38bdf8" : "none",
                    }}
                  >
                    {item}

                  </div>

                )
              )
            }

          </div>

        )
      }      
      {/* ================= EXPERIMENT SCREEN ================= */}
      {screen === "experiment" && !showFormula && (
          <div
            style={{
              flex:1,
              display:"flex",
              flexDirection:"column",
              padding:30,
            }}
          >
            <h1
              style={{
                textAlign:"center",
                color:"#facc15",
                fontSize:50,
                marginBottom:25,
              }}
            >
              Select Correct Ingredients
            </h1>
            <div
              style={{
                flex:1,
                display:"grid",
                gridTemplateColumns:
                  "repeat(2,1fr)",
                gap:25,
              }}
            >
              {
                visibleIngredients.map(
                  (item, index) => (
                    <div
                      key={index}
                      style={{
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        textAlign:"center",
                        borderRadius:35,
                        fontSize:32,
                        fontWeight:800,
                        padding:35,
                        background:
                          selectedIngredients.includes(item)
                            ? "linear-gradient(135deg,#22c55e,#15803d)"
                            : gridFocus === index
                            ? "linear-gradient(135deg,#06b6d4,#2563eb)"
                            : "linear-gradient(135deg,#1e293b,#334155)",

                        border:
                          gridFocus === index
                            ? "5px solid white"
                            : "3px solid #475569",

                        transform:
                          gridFocus === index
                            ? "scale(1.05)"
                            : "scale(1)",

                        transition:".25s",

                        boxShadow:
                          gridFocus === index
                            ? "0 0 35px #38bdf8"
                            : "none",
                      }}
                    >

                      {item}

                    </div>

                  )
                )
              }

            </div>


            <h2
              style={{
                textAlign:"center",
                color:"#cbd5e1",
                marginTop:20,
              }}
            >
              OK = Select Ingredient | ⬇ Submit Formula | ESC = Exit
            </h2>


          </div>

        )
      }


      {/* ================= ACHIEVEMENTS ================= */}

      {
        screen === "achievements" && (

          <div
            style={{
              flex:1,
              display:"flex",
              flexDirection:"column",
              justifyContent:"center",
              alignItems:"center",
              gap:25,
            }}
          >

            <h1
              style={{
                fontSize:60,
                color:"#facc15",
              }}
            >
              🏆 Achievements
            </h1>


            <h2>
              ⭐ Total XP : {xp}
            </h2>


            <h2>
              🧪 Current Level : {level}
            </h2>


            <h2>
              🔥 Best Streak : {streak}
            </h2>


            <p
              style={{
                color:"#cbd5e1",
                fontSize:20,
              }}
            >
              Press ESC to return
            </p>


          </div>

        )
      }


      {/* ================= HOW TO PLAY ================= */}

      {
        screen === "help" && (

          <div
            style={{
              flex:1,
              display:"flex",
              flexDirection:"column",
              justifyContent:"center",
              alignItems:"center",
              textAlign:"center",
              gap:25,
              padding:50,
            }}
          >

            <h1
              style={{
                fontSize:60,
                color:"#facc15",
              }}
            >
              📖 How To Play
            </h1>


            <h2>
              🧠 Memorize the chemical formula.
            </h2>


            <h2>
              🎮 Use Arrow Keys to move.
            </h2>


            <h2>
              ✔ Press OK to select ingredients.
            </h2>


            <h2>
              ⬇ Press Down Arrow to submit.
            </h2>


            <h2>
              ⭐ Earn XP and increase your level.
            </h2>


            <p
              style={{
                color:"#cbd5e1",
                fontSize:20,
              }}
            >
              Press ESC to return
            </p>


          </div>

        )
      }


      {/* ================= POPUP MESSAGE ================= */}

      {
        popup && (

          <div
            style={{
              position:"fixed",
              top:120,
              left:"50%",
              transform:"translateX(-50%)",
              padding:"20px 40px",
              borderRadius:20,
              fontSize:28,
              fontWeight:800,
              color:"white",

              background:
                popup.type === "error"
                  ? "linear-gradient(135deg,#dc2626,#991b1b)"
                  : "linear-gradient(135deg,#22c55e,#166534)",

              boxShadow:
                popup.type === "error"
                  ? "0 0 30px #ef4444"
                  : "0 0 30px #22c55e",

              zIndex:999,
            }}
          >

            {popup.text}

          </div>

        )
      }


    </div>

  );

}