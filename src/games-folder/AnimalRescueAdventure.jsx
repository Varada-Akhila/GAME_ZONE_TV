import React, { useEffect, useState } from "react";

const LEVELS = [
  {
    level: 1,
    name: "Puppy Rescue",
    animal: "🐶",
    target: 3,
    time: 60,
    bg: "linear-gradient(180deg,#86efac,#22c55e)"
  },
  {
    level: 2,
    name: "Kitten Rescue",
    animal: "🐱",
    target: 4,
    time: 70,
    bg: "linear-gradient(180deg,#93c5fd,#3b82f6)"
  },
  {
    level: 3,
    name: "Rabbit Rescue",
    animal: "🐰",
    target: 5,
    time: 80,
    bg: "linear-gradient(180deg,#fde68a,#f59e0b)"
  },
  {
    level: 4,
    name: "Monkey Rescue",
    animal: "🐵",
    target: 6,
    time: 90,
    bg: "linear-gradient(180deg,#fdba74,#ea580c)"
  },
  {
    level: 5,
    name: "Elephant Rescue",
    animal: "🐘",
    target: 7,
    time: 100,
    bg: "linear-gradient(180deg,#c4b5fd,#8b5cf6)"
  }
];

export default function AnimalRescueAdventure() {
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = LEVELS[levelIndex];
  const [fieldWidth, setFieldWidth] = useState(Math.min(window.innerWidth - 30, 900));

  const FIELD_HEIGHT = 420;

  const [player, setPlayer] = useState({
    x: 80,
    y: 250
  });

  const [animals, setAnimals] = useState([]);
  const [rescued, setRescued] = useState(0);
  const [stars, setStars] = useState(0);
  const [timer, setTimer] = useState(currentLevel.time);
  const [message, setMessage] = useState("Find the animals!");
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [effect, setEffect] = useState(null);
  useEffect(() => {
    const resize = () => {
      setFieldWidth(Math.min(window.innerWidth - 30, 900));
    };

    window.addEventListener("resize",resize);
    return () =>
      window.removeEventListener("resize",resize);
  }, []);

  const generateAnimals = () => {
    const list = [];

    while (list.length <currentLevel.target) {
      const x =Math.random() * (fieldWidth - 180) + 90;
      const y =Math.random() * 320 + 80;
      const overlap = list.some((a) => {
          const dx = a.x - x;
          const dy = a.y - y;
          return (Math.sqrt(dx * dx + dy * dy) < 120);
        }
      );

      if (!overlap) {
        list.push({id: list.length,x,y,rescued: false});
      }
    }

    return list;
  };

  useEffect(() => {
    setPlayer({
      x: 80,
      y: 250
    });

    setAnimals(generateAnimals());
    setRescued(0);
    setTimer(currentLevel.time);
    setMessage(`Level ${currentLevel.level} - ${currentLevel.name}`);
    setGameWon(false);
    setGameOver(false);
  }, [levelIndex]);

  useEffect(() => {
    if (gameWon || gameOver)
      return;

    const interval =
      setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(
              interval
            );

            setGameOver(true);

            return 0;
          }

          return prev - 1;
        });
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [gameWon, gameOver]); 
  
  /* =========================================
      PLAYER MOVEMENT
  ========================================= */

  const movePlayer = (dx, dy) => {
    if (gameWon || gameOver) return;

    setPlayer((prev) => {
      let nx = prev.x + dx;
      let ny = prev.y + dy;

      nx = Math.max(20,Math.min(fieldWidth - 70, nx));
      ny = Math.max(20, Math.min(FIELD_HEIGHT - 70, ny));

      return {
        x: nx,
        y: ny};
    });
  };

  /* =========================================
      RESCUE ANIMAL
  ========================================= */

  const rescueAnimal = () => {
    if (gameWon || gameOver) return;

    let rescuedOne = false;
    let rescuedPosition = null;

    const updatedAnimals = animals.map((animal) => {
        if (animal.rescued) 
          return animal;

        const dx =player.x - animal.x;
        const dy =player.y - animal.y;
        const distance =Math.sqrt(dx * dx + dy * dy);
        if (distance < 80 &&!rescuedOne) {
          rescuedOne = true;
          rescuedPosition = {
            x: animal.x,
            y: animal.y
          };
          return {
            ...animal, rescued: true
          };
        }

        return animal;
      }
    );

    if (!rescuedOne) {
      setMessage(
        "Move closer to an animal!"
      );
      return;
    }

    setAnimals(updatedAnimals);

    const total = updatedAnimals.filter((a) => a.rescued).length;
    setRescued(total);

    setStars((prev) => prev + 10);
    setMessage("⭐ Animal Rescued!");

    setEffect({
      x: rescuedPosition.x,
      y: rescuedPosition.y,
      id: Date.now()
    });

    setTimeout(() => {
      setEffect(null);
    }, 900);

    if (total >=currentLevel.target) {
      if (levelIndex === LEVELS.length - 1) {
        setStars((prev) => prev + 100);
        setGameWon(true);
        setMessage("🏆 You Saved All Animals!");
      } else {
        setStars((prev) => prev + 50);
        setMessage("🎉 Level Complete!");

        setTimeout(() => {
          setLevelIndex((prev) => prev + 1);
        }, 2500);
      }
    }
  };

  /* =========================================
      TV REMOTE / KEYBOARD
  ========================================= */

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          movePlayer(0, -25);
          break;

        case "ArrowDown":
          movePlayer(0, 25);
          break;

        case "ArrowLeft":
          movePlayer(-25, 0);
          break;

        case "ArrowRight":
          movePlayer(25, 0);
          break;

        case "Enter":
          rescueAnimal();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown",handleKey);
    return () =>
      window.removeEventListener("keydown",handleKey);
  }, [player,animals,gameWon,gameOver]);

  /* =========================================
      RESTART GAME
  ========================================= */

  const restartGame = () => {
    setLevelIndex(0);
    setStars(0);
    setRescued(0);
    setGameWon(false);
    setGameOver(false);
    setPlayer({x: 80,y: 250});
    setAnimals(generateAnimals());
    setTimer(LEVELS[0].time);
    setMessage("Find the animals!");
  };  
  return (
    <div
      style={{
        minHeight: "100vh",
        background: currentLevel.bg,
        fontFamily: "Poppins, sans-serif",
        overflowX: "hidden",
        overflowY: "auto",
        paddingBottom: 40
      }}
    >
      {/* HUD */}

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(12px)",
          padding: "8px 12px"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "white",
            fontWeight: 700,
            fontSize: 15,
            flexWrap: "wrap",
            gap: 10
          }}
        >
          <div>🎯 Level {currentLevel.level}</div>

          <div>⭐ {stars}</div>

          <div>⏰ {timer}s</div>

          <div>
            🐾 {rescued}/{currentLevel.target}
          </div>
        </div>

        {/* Progress */}

        <div
          style={{
            width: "100%",
            height: 14,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 50,
            marginTop: 10,
            overflow: "hidden"
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${
                (rescued /
                  currentLevel.target) *
                100
              }%`,
              background:"linear-gradient(90deg,#22c55e,#16a34a)",
              borderRadius: 50,
              transition: ".4s"
            }}
          />
        </div>
      </div>

      {/* TITLE */}

      <div
        style={{
          textAlign: "center",
          color: "white",
          paddingTop: 20
        }}
      >
        <h1
          style={{
            fontSize: 28,
            margin: 0,
            textShadow:"0 4px 10px rgba(0,0,0,0.3)"
          }}
        >
          🐾 Animal Rescue Adventure
        </h1>

        <p
          style={{
            fontSize: 16,
            fontWeight: 700
          }}
        >
          {currentLevel.name}
        </p>
      </div>

      {/* GAME FIELD */}

      <div
        style={{
          position: "relative",
          width: fieldWidth,
          // height: FIELD_HEIGHT,
          height:window.innerWidth < 768? 350 : 420,
          margin: "20px auto",
          borderRadius: 35,
          overflow: "hidden",
          boxShadow:"0 25px 50px rgba(0,0,0,0.25)",
          background:"linear-gradient(180deg,#4ade80,#16a34a)"
        }}
      >
        {/* Trees */}

        <div
          style={{
            position: "absolute",
            left: 20,
            top: 20,
            fontSize: 40
          }}
        >
          🌴
        </div>

        <div
          style={{
            position: "absolute",
            right: 30,
            top: 30,
            fontSize: 40
          }}
        >
          🌴
        </div>

        <div
          style={{
            position: "absolute",
            left: 50,
            bottom: 20,
            fontSize: 40
          }}
        >
          🌴
        </div>

        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: 20,
            fontSize: 40
          }}
        >
          🌴
        </div>

        <div
          style={{
            position: "absolute",
            left: 180,
            top: 120,
            fontSize: 28
          }}
        >
          🌿
        </div>

        <div
          style={{
            position: "absolute",
            right: 180,
            bottom: 140,
            fontSize: 28
          }}
        >
          🌿
        </div>

        <div
          style={{
            position: "absolute",
            left: 120,
            bottom: 90,
            fontSize: 24
          }}
        >
          🍄
        </div>

        {/* River */}

        <div
          style={{
            position: "absolute",
            left: fieldWidth / 2 - 60,
            top: 0,
            width: 70,
            height: "100%",
            background:"rgba(59,130,246,0.55)"
          }}
        />

        {/* Bridge */}

        <div
          style={{
            position: "absolute",
            left: fieldWidth / 2 - 85,
            top: 230,
            width: 110,
            height: 40,
            borderRadius: 12,
            background:"linear-gradient(180deg,#8b5a2b,#5b3714)"
          }}
        />

        {/* Animals */}

        {animals.map(
          (animal) =>
            !animal.rescued && (
              <div
                key={animal.id}
                style={{
                  position: "absolute",
                  left: animal.x,
                  top: animal.y,
                  fontSize: 40,
                  animation:"float 2s infinite",
                  filter:"drop-shadow(0 0 10px rgba(255,255,255,.6))"
                }}
              >
                {currentLevel.animal}
              </div>
            )
        )}

        {/* Player */}

        <div
          style={{
            position: "absolute",
            left: player.x,
            top: player.y,
            fontSize: 48,
            transition: ".15s",
            filter:"drop-shadow(0 0 15px gold)"
          }}
        >
          🧑‍🚒
        </div>

        {/* Rescue Effect */}

        {effect && (
          <div
            style={{
              position: "absolute",
              left: effect.x,
              top: effect.y,
              color: "gold",
              fontSize: 40,
              fontWeight: 900,
              animation:"pop 1s forwards"
            }}
          >
            ⭐ +10
          </div>
        )}
      </div>

      {/* MESSAGE */}

      <div
        style={{
          textAlign: "center",
          color: "white",
          fontSize: 24,
          fontWeight: 800,
          marginBottom: 20
        }}
      >
        {message}
      </div>

      {/* MOBILE CONTROLS */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          // position: "sticky",
          // bottom: 10,
          marginTop: 10,
          marginBottom: 20,
          // width: 48,
          // height: 48,
          // fontSize: 22
        }}
      >
        <button
          onClick={() =>
            movePlayer(0, -25)
          }
          style={controlStyle}
        >
          ⬆
        </button>

        <div
          style={{
            display: "flex",
            gap: 10
          }}
        >
          <button
            onClick={() =>
              movePlayer(-25, 0)
            }
            style={controlStyle}
          >
            ⬅
          </button>

          <button
            onClick={rescueAnimal}
            style={{
              ...controlStyle,
              background:"#facc15",
              color: "#000"
            }}
          >
            OK
          </button>

          <button
            onClick={() =>
              movePlayer(25, 0)
            }
            style={controlStyle}
          >
            ➡
          </button>
        </div>

        <button
          onClick={() =>
            movePlayer(0, 25)
          }
          style={controlStyle}
        >
          ⬇
        </button>
      </div>

      {/* WIN SCREEN */}

      {gameWon && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h1>
              🏆 YOU SAVED ALL ANIMALS!
            </h1>

            <h2>
              ⭐ Total Stars: {stars}
            </h2>

            <button
              onClick={restartGame}
              style={restartBtn}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER */}

      {gameOver && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h1>⌛ Time Over</h1>

            <h2>
              Rescued {rescued}/
              {currentLevel.target}
            </h2>

            <button
              onClick={restartGame}
              style={restartBtn}
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {/* ANIMATIONS */}

      <style>
        {`
        @keyframes float{
          0%,100%{
            transform:translateY(0);
          }
          50%{
            transform:translateY(-10px);
          }
        }

        @keyframes pop{
          0%{
            opacity:0;
            transform:scale(.5);
          }

          50%{
            opacity:1;
            transform:scale(1.3);
          }

          100%{
            opacity:0;
            transform:translateY(-50px);
          }
        }
      `}
      </style>
    </div>
  );
}

/* =======================================
    STYLES
======================================= */

const controlStyle = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  border: "none",
  background: "#1f2937",
  color: "white",
  fontSize: 28,
  cursor: "pointer",
  fontWeight: 700
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

const dialogStyle = {
  background: "white",
  padding: 40,
  borderRadius: 24,
  textAlign: "center",
  minWidth: 320
};

const restartBtn = {
  marginTop: 15,
  padding: "12px 24px",
  border: "none",
  borderRadius: 12,
  fontSize: 18,
  cursor: "pointer",
  background: "#22c55e",
  color: "white",
  fontWeight: 700
};