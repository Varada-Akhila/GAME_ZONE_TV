import React, {
  useEffect,
  useState,
  useRef,
} from "react";

/* =========================================
   ADVANCED TV CODING GAME PRO
   RANDOM MAZES + TRAPS + LAVA
========================================= */

const TOTAL_LEVELS = 8;

const CONTROLS = [
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
  "RUN",
  "UNDO",
  "RESTART",
  "CLEAR",
];

/* =========================================
   RANDOM MAZE GENERATOR
========================================= */

const generateMaze = (
  size,
  wallChance = 0.35
) => {
  const robot = {
    x: 0,
    y: 0,
  };

  const goal = {
    x: size - 1,
    y: size - 1,
  };

  const safePath = new Set();

  let x = 0;
  let y = 0;

  safePath.add("0-0");

  while (
    x < size - 1 ||
    y < size - 1
  ) {
    if (
      x < size - 1 &&
      y < size - 1
    ) {
      if (Math.random() > 0.5) {
        x++;
      } else {
        y++;
      }
    } else if (
      x < size - 1
    ) {
      x++;
    } else {
      y++;
    }

    safePath.add(`${x}-${y}`);
  }

  /* =====================
     FAKE PATHS
  ===================== */

  for (
    let i = 1;
    i < size - 2;
    i++
  ) {
    safePath.add(
      `${Math.floor(size / 2)}-${i}`
    );
  }

  const walls = [];

  for (
    let row = 0;
    row < size;
    row++
  ) {
    for (
      let col = 0;
      col < size;
      col++
    ) {
      const key =
        `${col}-${row}`;

      if (
        !safePath.has(key) &&
        Math.random() <
          wallChance
      ) {
        walls.push({
          x: col,
          y: row,
        });
      }
    }
  }

  /* =====================
     GOAL TRAP ZONE
  ===================== */

  for (
    let i = 0;
    i < size / 2;
    i++
  ) {
    const gx =
      goal.x -
      Math.floor(
        Math.random() * 3
      );

    const gy =
      goal.y -
      Math.floor(
        Math.random() * 3
      );

    if (
      gx > 0 &&
      gy > 0 &&
      !(
        gx === goal.x &&
        gy === goal.y
      )
    ) {
      walls.push({
        x: gx,
        y: gy,
      });
    }
  }

  /* =====================
     LAVA BLOCKS
  ===================== */

  const lavaBlocks = [];

  for (
    let i = 0;
    i < size / 3;
    i++
  ) {
    const lx =
      Math.floor(
        Math.random() * size
      );

    const ly =
      Math.floor(
        Math.random() * size
      );

    const key =
      `${lx}-${ly}`;

    if (
      !safePath.has(key) &&
      !(
        lx === goal.x &&
        ly === goal.y
      )
    ) {
      lavaBlocks.push({
        x: lx,
        y: ly,
      });
    }
  }

  return {
    grid: size,
    robot,
    goal,
    walls,
    lavaBlocks,
  };
};

/* =========================================
   LEVELS
========================================= */

const createLevels = () => [
  generateMaze(6, 0.30),
  generateMaze(7, 0.35),
  generateMaze(8, 0.40),
  generateMaze(9, 0.45),
  generateMaze(10, 0.50),
  generateMaze(11, 0.55),
  generateMaze(12, 0.58),
  generateMaze(13, 0.60),
];

/* =========================================
   MAIN COMPONENT
========================================= */

export default function TVCodingGame() {
  const [levels] =
    useState(createLevels());

  const [levelIndex, setLevelIndex] =
    useState(0);

  const currentLevel =
    levels[levelIndex];

  const GRID_SIZE =
    currentLevel.grid;

  /* =====================
     MEDIUM GRID SIZE
  ===================== */

  const CELL_SIZE =
    GRID_SIZE >= 13
      ? 52
      : GRID_SIZE >= 11
      ? 58
      : GRID_SIZE >= 9
      ? 64
      : 76;

  const [robot, setRobot] =
    useState(
      currentLevel.robot
    );

  const [
    selectedButton,
    setSelectedButton,
  ] = useState(0);

  const [commands, setCommands] =
    useState([]);

  const [running, setRunning] =
    useState(false);

  const [message, setMessage] =
    useState(
      "Program the Robot"
    );

  const [moves, setMoves] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [stars, setStars] =
    useState(3);

  const [seconds, setSeconds] =
    useState(0);

  const timerRef =
    useRef(null);

  /* =====================
     LEVEL RESET
  ===================== */

  useEffect(() => {
    setRobot(
      currentLevel.robot
    );

    setCommands([]);

    setMoves(0);

    setStars(3);

    setSeconds(0);

    setMessage(
      `Level ${
        levelIndex + 1
      } Started`
    );
  }, [levelIndex]);
    /* =========================================
     TIMER
  ========================================= */

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () =>
      clearInterval(timerRef.current);
  }, []);

  /* =========================================
     STAR SYSTEM
  ========================================= */

  useEffect(() => {
    if (moves > 40) {
      setStars(1);
    } else if (moves > 20) {
      setStars(2);
    } else {
      setStars(3);
    }
  }, [moves]);

  /* =========================================
     UNDO
  ========================================= */

  const undoLastCommand = () => {
    setCommands((prev) =>
      prev.slice(0, prev.length - 1)
    );

    setMessage("↩ Command Removed");
  };

  /* =========================================
     RESTART LEVEL
  ========================================= */

  const restartLevel = () => {
    setRobot(currentLevel.robot);

    setCommands([]);

    setMoves(0);

    setSeconds(0);

    setStars(3);

    setMessage(
      "🔄 Level Restarted"
    );
  };

  /* =========================================
     STAR DISPLAY
  ========================================= */

  const renderStars = () =>
    "⭐".repeat(stars);

  /* =========================================
     RUN COMMANDS
  ========================================= */

  const runCommands = async () => {
    if (running) return;

    if (commands.length === 0) {
      setMessage(
        "⚠ Add Commands First"
      );
      return;
    }

    setRunning(true);

    setMessage(
      "▶ Running Program..."
    );

    let currentX = robot.x;
    let currentY = robot.y;

    for (let cmd of commands) {
      await new Promise((res) =>
        setTimeout(res, 300)
      );

      let nx = currentX;
      let ny = currentY;

      if (cmd === "UP") ny--;
      if (cmd === "DOWN") ny++;
      if (cmd === "LEFT") nx--;
      if (cmd === "RIGHT") nx++;

      /* ==========================
         OUTSIDE GRID
      ========================== */

      if (
        nx < 0 ||
        ny < 0 ||
        nx >= GRID_SIZE ||
        ny >= GRID_SIZE
      ) {
        setMessage(
          "❌ Outside Grid"
        );

        setRunning(false);

        return;
      }

      /* ==========================
         WALL COLLISION
      ========================== */

      const hitWall =
        currentLevel.walls.some(
          (wall) =>
            wall.x === nx &&
            wall.y === ny
        );

      if (hitWall) {
        setMessage(
          "🚫 Hit Wall"
        );

        setRunning(false);

        return;
      }

      /* ==========================
         LAVA COLLISION
      ========================== */

      const hitLava =
        currentLevel.lavaBlocks.some(
          (lava) =>
            lava.x === nx &&
            lava.y === ny
        );

      if (hitLava) {
        setMessage(
          "🔥 Fell Into Lava"
        );

        setRunning(false);

        return;
      }

      currentX = nx;
      currentY = ny;

      setRobot({
        x: currentX,
        y: currentY,
      });

      setMoves(
        (prev) => prev + 1
      );

      /* ==========================
         GOAL CHECK
      ========================== */

      if (
        currentX ===
          currentLevel.goal.x &&
        currentY ===
          currentLevel.goal.y
      ) {
        const levelBonus =
          (levelIndex + 1) *
          100;

        const starBonus =
          stars * 75;

        const timeBonus =
          Math.max(
            0,
            180 - seconds
          );

        const earned =
          levelBonus +
          starBonus +
          timeBonus;

        setScore(
          (prev) =>
            prev + earned
        );

        if (
          levelIndex ===
          TOTAL_LEVELS - 1
        ) {
          setMessage(
            "🏆 ALL LEVELS COMPLETED!"
          );
        } else {
          setMessage(
            `🎉 Level ${
              levelIndex + 1
            } Complete`
          );

          setTimeout(() => {
            setLevelIndex(
              (prev) =>
                prev + 1
            );
          }, 1800);
        }

        setRunning(false);

        return;
      }
    }

    setRunning(false);

    setMessage(
      "⚠ Program Finished"
    );
  };

  /* =========================================
     TV REMOTE CONTROLS
  ========================================= */

  useEffect(() => {
    const handleKey = (e) => {
      if (running) return;

      if (
        e.key === "ArrowUp"
      ) {
        setSelectedButton(
          (prev) =>
            prev === 0
              ? CONTROLS.length -
                1
              : prev - 1
        );
      }

      if (
        e.key ===
        "ArrowDown"
      ) {
        setSelectedButton(
          (prev) =>
            prev ===
            CONTROLS.length -
              1
              ? 0
              : prev + 1
        );
      }

      if (
        e.key === "Enter"
      ) {
        const action =
          CONTROLS[
            selectedButton
          ];

        /* RUN */

        if (
          action === "RUN"
        ) {
          runCommands();
          return;
        }

        /* UNDO */

        if (
          action === "UNDO"
        ) {
          undoLastCommand();
          return;
        }

        /* RESTART */

        if (
          action ===
          "RESTART"
        ) {
          restartLevel();
          return;
        }

        /* CLEAR */

        if (
          action ===
          "CLEAR"
        ) {
          setCommands([]);

          setMessage(
            "🧹 Commands Cleared"
          );

          return;
        }

        /* ADD COMMAND */

        setCommands(
          (prev) => [
            ...prev,
            action,
          ]
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  }, [
    selectedButton,
    running,
    commands,
    currentLevel,
    stars,
    seconds,
  ]);  /* =========================================
     UI
  ========================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#1e3a8a,#020617 70%)",
        color: "white",
        padding: 16,
        fontFamily:
          "Poppins, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize:
              "clamp(28px,5vw,58px)",
            fontWeight: 900,
          }}
        >
          🤖 TV Coding Game PRO
        </h1>

        <h2
          style={{
            color: "#facc15",
            marginTop: 10,
          }}
        >
          Level {levelIndex + 1} /{" "}
          {TOTAL_LEVELS}
        </h2>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
          gap: 14,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {[
          {
            title: "🏆 Score",
            value: score,
          },
          {
            title: "⏱ Time",
            value: `${seconds}s`,
          },
          {
            title: "🚶 Moves",
            value: moves,
          },
          {
            title: "⭐ Stars",
            value:
              renderStars(),
          },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              minWidth: 120,
              background:
                "rgba(255,255,255,.08)",
              backdropFilter:
                "blur(12px)",
              padding: 12,
              borderRadius: 16,
              textAlign: "center",
              border:
                "1px solid rgba(255,255,255,.15)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#94a3b8",
              }}
            >
              {item.title}
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN AREA */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "center",
          alignItems:
            "flex-start",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        {/* CONTROLS */}

        <div
          style={{
            width: 220,
            background:
              "rgba(15,23,42,.95)",
            border:
              "1px solid rgba(255,255,255,.15)",
            borderRadius: 22,
            padding: 16,
            backdropFilter:
              "blur(10px)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            🎮 Controls
          </h2>

          {CONTROLS.map(
            (btn, i) => (
              <div
                key={i}
                style={{
                  padding: 10,
                  marginBottom: 10,
                  borderRadius: 12,
                  textAlign:
                    "center",
                  fontWeight: 800,
                  fontSize: 16,

                  background:
                    selectedButton ===
                    i
                      ? "linear-gradient(135deg,#facc15,#f59e0b)"
                      : "#1e293b",

                  color:
                    selectedButton ===
                    i
                      ? "#000"
                      : "#fff",

                  transform:
                    selectedButton ===
                    i
                      ? "scale(1.04)"
                      : "scale(1)",

                  transition:
                    ".2s",

                  boxShadow:
                    selectedButton ===
                    i
                      ? "0 0 15px rgba(250,204,21,.8)"
                      : "none",
                }}
              >
                {btn}
              </div>
            )
          )}
        </div>

        {/* GRID + QUEUE */}

        <div>
          {/* GRID */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,

              gap: 5,

              background:
                "rgba(2,6,23,.8)",

              padding: 18,

              borderRadius: 24,

              boxShadow:
                "0 15px 40px rgba(0,0,0,.45)",

              maxWidth:
                "95vw",

              overflow: "auto",
            }}
          >
            {Array.from({
              length: GRID_SIZE,
            }).map((_, y) =>
              Array.from({
                length: GRID_SIZE,
              }).map((_, x) => {
                const isRobot =
                  robot.x === x &&
                  robot.y === y;

                const isGoal =
                  currentLevel.goal
                    .x === x &&
                  currentLevel.goal
                    .y === y;

                const isWall =
                  currentLevel.walls.some(
                    (
                      wall
                    ) =>
                      wall.x ===
                        x &&
                      wall.y === y
                  );

                const isLava =
                  currentLevel.lavaBlocks.some(
                    (
                      lava
                    ) =>
                      lava.x ===
                        x &&
                      lava.y === y
                  );

                return (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      width:
                        CELL_SIZE,
                      height:
                        CELL_SIZE,

                      borderRadius: 12,

                      display:
                        "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      fontSize:
                        CELL_SIZE *
                        0.42,

                      border:
                        "1px solid rgba(255,255,255,.08)",

                      background:
                        isRobot
                          ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                          : isGoal
                          ? "linear-gradient(135deg,#fde047,#ca8a04)"
                          : isWall
                          ? "linear-gradient(135deg,#ef4444,#7f1d1d)"
                          : isLava
                          ? "linear-gradient(135deg,#fb923c,#dc2626)"
                          : "#0f172a",

                      boxShadow:
                        isRobot
                          ? "0 0 18px #3b82f6"
                          : isGoal
                          ? "0 0 18px #fde047"
                          : isLava
                          ? "0 0 14px #f97316"
                          : "none",
                    }}
                  >
                    {isRobot
                      ? "🤖"
                      : isGoal
                      ? "⭐"
                      : isLava
                      ? "🔥"
                      : ""}
                  </div>
                );
              })
            )}
          </div>

          {/* COMMAND QUEUE */}

          <div
            style={{
              marginTop: 14,
              background:
                "rgba(15,23,42,.9)",
              borderRadius: 20,
              padding: 16,
            }}
          >
            <h3>
              📜 Commands Queue
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap:
                  "wrap",
                gap: 8,
              }}
            >
              {commands.length ===
                0 && (
                <span
                  style={{
                    color:
                      "#94a3b8",
                  }}
                >
                  No Commands Added
                </span>
              )}

              {commands.map(
                (
                  cmd,
                  index
                ) => (
                  <div
                    key={
                      index
                    }
                    style={{
                      padding:
                        "8px 12px",
                      borderRadius: 10,
                      background:
                        "#2563eb",
                      fontWeight: 700,
                    }}
                  >
                    {cmd}
                  </div>
                )
              )}
            </div>
          </div>

          {/* STATUS */}

          <div
            style={{
              textAlign:
                "center",
              marginTop: 16,
              fontSize: 24,
              fontWeight: 800,
              color: "#facc15",
            }}
          >
            {message}
          </div>

          <div
            style={{
              textAlign:
                "center",
              color: "#cbd5e1",
              marginTop: 8,
              fontSize: 14,
            }}
          >
            ↑ ↓ Select
            Controls • Enter
            = OK
          </div>
        </div>
      </div>
    </div>
  );
}