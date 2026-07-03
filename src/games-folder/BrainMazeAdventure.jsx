import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ===================== HELPERS ===================== */

const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (arr) =>
  [...arr].sort(() => Math.random() - 0.5);

/* ===================== MASSIVE QUESTION GENERATOR ===================== */

const generateQuestion = (level = 1) => {
  const questionTypes = [
    "addition",
    "subtraction",
    "multiplication",
    "division",
    "algebra1",
    "algebra2",
    "brackets",
    "square",
    "fractions",
    "percentage",
    "roots",
    "quadratic",
    "timework",
    "probability",
    "geometry",
    "trigonometry",
    "logic",
    "memory",
  ];

  const type =
    questionTypes[
      Math.floor(
        Math.random() * questionTypes.length
      )
    ];

  let question = "";
  let answer = "";
  let options = [];

  /* ===================== ADDITION ===================== */

  if (type === "addition") {
    const a = random(10, 500);
    const b = random(10, 500);

    answer = String(a + b);

    question = `${a} + ${b} = ?`;

    options = [
      answer,
      String(a + b + random(1, 20)),
      String(a + b - random(1, 20)),
      String(a + b + random(21, 40)),
    ];
  }

  /* ===================== SUBTRACTION ===================== */

  else if (type === "subtraction") {
    const a = random(100, 700);
    const b = random(10, 90);

    answer = String(a - b);

    question = `${a} - ${b} = ?`;

    options = [
      answer,
      String(a - b + 12),
      String(a - b - 9),
      String(a - b + 21),
    ];
  }

  /* ===================== MULTIPLICATION ===================== */

  else if (type === "multiplication") {
    const a = random(5, 25);
    const b = random(2, 15);

    answer = String(a * b);

    question = `${a} × ${b} = ?`;

    options = [
      answer,
      String(a * b + 7),
      String(a * b - 6),
      String(a * b + 11),
    ];
  }

  /* ===================== DIVISION ===================== */

  else if (type === "division") {
    const b = random(2, 15);

    const ans = random(2, 20);

    const a = b * ans;

    answer = String(ans);

    question = `${a} ÷ ${b} = ?`;

    options = [
      answer,
      String(ans + 2),
      String(ans - 1),
      String(ans + 5),
    ];
  }

  /* ===================== ALGEBRA 1 ===================== */

  else if (type === "algebra1") {
    const x = random(2, 20);

    const a = random(2, 12);

    const b = random(1, 20);

    const total = a * x + b;

    answer = `x=${x}`;

    question = `${a}x + ${b} = ${total}`;

    options = [
      answer,
      `x=${x + 1}`,
      `x=${x - 1}`,
      `x=${x + 2}`,
    ];
  }

  /* ===================== ALGEBRA 2 ===================== */

  else if (type === "algebra2") {
    const x = random(2, 20);

    const a = random(2, 12);

    const b = random(1, 20);

    const total = a * x - b;

    answer = `x=${x}`;

    question = `${a}x - ${b} = ${total}`;

    options = [
      answer,
      `x=${x + 1}`,
      `x=${x - 2}`,
      `x=${x + 3}`,
    ];
  }

  /* ===================== BRACKETS ===================== */

  else if (type === "brackets") {
    const x = random(2, 12);

    const a = random(2, 8);

    const b = random(1, 10);

    const total = a * (x + b);

    answer = `x=${x}`;

    question = `${a}(x + ${b}) = ${total}`;

    options = [
      answer,
      `x=${x + 1}`,
      `x=${x - 1}`,
      `x=${x + 2}`,
    ];
  }

  /* ===================== SQUARE ===================== */

  else if (type === "square") {
    const n = random(5, 30);

    answer = String(n * n);

    question = `${n}² = ?`;

    options = [
      answer,
      String(n * n + 6),
      String(n * n - 4),
      String(n * n + 15),
    ];
  }

  /* ===================== FRACTIONS ===================== */

  else if (type === "fractions") {
    const a = random(1, 9);
    const b = random(2, 10);

    answer = `${a}/${b}`;

    question = `Simplify ${a * 2}/${b * 2}`;

    options = [
      answer,
      `${a + 1}/${b}`,
      `${a}/${b + 1}`,
      `${a + 2}/${b + 2}`,
    ];
  }

  /* ===================== PERCENTAGE ===================== */

  else if (type === "percentage") {
    const num = random(50, 500);

    const per = random(10, 50);

    answer = String((num * per) / 100);

    question = `${per}% of ${num} = ?`;

    options = [
      answer,
      String(random(10, 200)),
      String(random(10, 200)),
      String(random(10, 200)),
    ];
  }

  /* ===================== ROOTS ===================== */

  else if (type === "roots") {
    const n = random(2, 20);

    answer = String(n);

    question = `√${n * n} = ?`;

    options = [
      answer,
      String(n + 1),
      String(n - 1),
      String(n + 2),
    ];
  }

  /* ===================== QUADRATIC ===================== */

  else if (type === "quadratic") {
    const x = random(2, 8);

    answer = `x=${x}`;

    question = `x² - ${
      2 * x
    }x + ${x * x} = 0`;

    options = [
      answer,
      `x=${x + 1}`,
      `x=${x - 1}`,
      `x=${x + 2}`,
    ];
  }

  /* ===================== TIME & WORK ===================== */

  else if (type === "timework") {
    const days = random(2, 10);

    answer = String(days);

    question = `A work is completed in ${days} days. How many days needed?`;

    options = [
      answer,
      String(days + 2),
      String(days - 1),
      String(days + 4),
    ];
  }

  /* ===================== PROBABILITY ===================== */

  else if (type === "probability") {
    answer = "1/2";

    question =
      "Probability of getting Head in coin toss?";

    options = ["1/2", "1", "0", "1/4"];
  }

  /* ===================== GEOMETRY ===================== */

  else if (type === "geometry") {
    const side = random(2, 20);

    answer = String(side * side);

    question = `Area of square with side ${side}?`;

    options = [
      answer,
      String(side * 2),
      String(side * 3),
      String(side + 10),
    ];
  }

  /* ===================== TRIGONOMETRY ===================== */

  else if (type === "trigonometry") {
    answer = "1";

    question = "sin 90° = ?";

    options = ["1", "0", "-1", "1/2"];
  }

  /* ===================== LOGIC ===================== */

  else if (type === "logic") {
    answer = "8";

    question =
      "2, 4, 6, ?";

    options = ["7", "8", "9", "10"];
  }

  /* ===================== MEMORY ===================== */

  else if (type === "memory") {
    const n1 = random(1, 9);
    const n2 = random(1, 9);
    const n3 = random(1, 9);

    answer = `${n1}${n2}${n3}`;

    question = `Remember: ${n1} ${n2} ${n3}`;

    options = [
      answer,
      `${n1}${n3}${n2}`,
      `${n2}${n1}${n3}`,
      `${n3}${n2}${n1}`,
    ];
  }

  return {
    question,
    answer,
    options: shuffle(options),
  };
};

/* ===================== MAZE GENERATOR ===================== */

const generateMaze = (size, level) => {
  const maze = Array.from({ length: size }, () =>
    Array(size).fill(0)
  );

  const correctPath = [];

  let x = 1;
  let y = 1;

  correctPath.push({ x, y });

  while (x < size - 2 || y < size - 2) {
    const moveRight =
      Math.random() > 0.5 && x < size - 2;

    if (moveRight) {
      x++;
    } else if (y < size - 2) {
      y++;
    } else {
      x++;
    }

    correctPath.push({ x, y });
  }

  maze[size - 2][size - 2] = 3;

  const hiddenWalls = [];

  const questionMap = {};

  for (let row = 1; row < size - 1; row++) {
    for (let col = 1; col < size - 1; col++) {
      const isPath = correctPath.some(
        (p) => p.x === col && p.y === row
      );

      if (!isPath && Math.random() > 0.75) {
        hiddenWalls.push({
          x: col,
          y: row,
        });

        questionMap[`${col}-${row}`] =
          generateQuestion(level);
      }
    }
  }

  const gap = Math.max(2, 5 - level);

  for (
    let i = 2;
    i < correctPath.length - 2;
    i += gap
  ) {
    const cell = correctPath[i];

    hiddenWalls.push({
      x: cell.x,
      y: cell.y,
    });

    questionMap[`${cell.x}-${cell.y}`] =
      generateQuestion(level);
  }

  return {
    maze,
    hiddenWalls,
    questionMap,
  };
};

/* ===================== GAME ===================== */

export default function BrainMazeAdventure() {
  const [level, setLevel] = useState(1);

  const size = 8 + level;

  const [data, setData] = useState(() =>
    generateMaze(size, level)
  );

  const [maze, setMaze] = useState(data.maze);

  const [player, setPlayer] = useState({
    x: 1,
    y: 1,
  });

  const [question, setQuestion] =
    useState(null);

  const [selected, setSelected] =
    useState(0);

  const [showQ, setShowQ] =
    useState(false);

  const [activeWall, setActiveWall] =
    useState(null);

  const [openedWalls, setOpenedWalls] =
    useState([{ x: 1, y: 1 }]);

  const selectedRef = useRef(0);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  /* ===================== NEXT LEVEL ===================== */

  const nextLevel = () => {
    const next = level + 1;

    const newSize = 8 + next;

    const newData = generateMaze(
      newSize,
      next
    );

    setLevel(next);

    setData(newData);

    setMaze(newData.maze);

    setPlayer({
      x: 1,
      y: 1,
    });

    setOpenedWalls([{ x: 1, y: 1 }]);

    toast.success(
      `Level ${next} Started 🚀`
    );
  };

  /* ===================== MOVEMENT ===================== */

  useEffect(() => {
    const handle = (e) => {
      if (showQ && question) {
        if (e.key === "ArrowUp") {
          setSelected(
            (p) =>
              (p -
                1 +
                question.options.length) %
              question.options.length
          );
        }

        if (e.key === "ArrowDown") {
          setSelected(
            (p) =>
              (p + 1) %
              question.options.length
          );
        }

        if (e.key === "Enter") {
          checkAnswer();
        }

        return;
      }

      let nx = player.x;
      let ny = player.y;

      if (e.key === "ArrowUp") ny--;
      if (e.key === "ArrowDown") ny++;
      if (e.key === "ArrowLeft") nx--;
      if (e.key === "ArrowRight") nx++;

      if (
        nx < 0 ||
        ny < 0 ||
        nx >= maze.length ||
        ny >= maze.length
      ) {
        return;
      }

      if (maze[ny][nx] === 3) {
        toast.success(
          "Level Completed 🎉"
        );

        nextLevel();

        return;
      }

      const alreadyOpened =
        openedWalls.some(
          (o) => o.x === nx && o.y === ny
        );

      const isWall =
        data.hiddenWalls.some(
          (w) => w.x === nx && w.y === ny
        );

      if (isWall && !alreadyOpened) {
        const q =
          data.questionMap[`${nx}-${ny}`];

        setQuestion(q);

        setSelected(0);

        setActiveWall({
          x: nx,
          y: ny,
        });

        setShowQ(true);

        return;
      }

      setPlayer({
        x: nx,
        y: ny,
      });

      setOpenedWalls((prev) => {
        const exists = prev.some(
          (p) => p.x === nx && p.y === ny
        );

        if (exists) return prev;

        return [
          ...prev,
          {
            x: nx,
            y: ny,
          },
        ];
      });
    };

    window.addEventListener(
      "keydown",
      handle
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handle
      );
  }, [
    player,
    maze,
    showQ,
    question,
    openedWalls,
    data,
  ]);

  /* ===================== CHECK ANSWER ===================== */

  const checkAnswer = () => {
    if (!question || !activeWall) return;

    const selectedText =
      question.options[selectedRef.current];

    const isCorrect =
      selectedText.trim() ===
      question.answer.trim();

    if (isCorrect) {
      toast.success(
        "Correct ✔ Wall Opened"
      );

      setOpenedWalls((prev) => [
        ...prev,
        {
          x: activeWall.x,
          y: activeWall.y,
        },
      ]);

      setPlayer({
        x: activeWall.x,
        y: activeWall.y,
      });
    } else {
      toast.error(
        "Wrong Answer ❌ Back To Start"
      );

      setPlayer({
        x: 1,
        y: 1,
      });

      setOpenedWalls([{ x: 1, y: 1 }]);
    }

    setShowQ(false);

    setQuestion(null);

    setActiveWall(null);
  };

  /* ===================== UI ===================== */

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        background:
          "radial-gradient(circle at top,#0f1f4b,#071129)",
        color: "white",
        textAlign: "center",
        padding: "20px 10px 40px",
        fontFamily: "Poppins, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <ToastContainer />

      <h1
        style={{
          fontSize: "42px",
          fontWeight: "900",
          letterSpacing: 2,
          margin: 0,
        }}
      >
        🧠 FIND THE PATH
      </h1>

      <h2
        style={{
          color: "#93c5fd",
          marginTop: 10,
          fontSize: 30,
          fontWeight: "700",
        }}
      >
        Level : {level}
      </h2>

      <p
        style={{
          fontSize: 20,
          color: "#dbeafe",
          marginTop: 8,
          marginBottom: 25,
        }}
      >
        Solve questions and unlock walls
      </p>

      {/* ===================== GRID ===================== */}

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          paddingBottom: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${maze.length}, 46px)`,
            justifyContent: "center",
            gap: 4,
            width: "max-content",
            margin: "0 auto",
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer =
                player.x === x &&
                player.y === y;

              const opened =
                openedWalls.some(
                  (o) =>
                    o.x === x && o.y === y
                );

              return (
                <div
                  key={x + "-" + y}
                  style={{
                    width: 46,
                    height: 46,

                    border:
                      "2px solid #223a63",

                    background:
                      maze[y][x] === 3
                        ? "#166534"
                        : opened
                        ? "#243b5f"
                        : "#0d1b38",

                    borderRadius: 6,

                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems:
                      "center",

                    transition:
                      "0.3s ease",

                    boxShadow: opened
                      ? "0 0 12px rgba(96,165,250,0.4)"
                      : "0 0 4px rgba(0,0,0,0.3)",

                    fontSize: 22,

                    flexShrink: 0,
                  }}
                >
                  {isPlayer
                    ? "🙂"
                    : maze[y][x] === 3
                    ? "🏁"
                    : ""}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===================== QUESTION MODAL ===================== */}

      {showQ && question && (
        <div
          style={{
            position: "fixed",
            inset: 0,

            background:
              "rgba(0,0,0,0.88)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            padding: 20,

            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,

              background:
                "linear-gradient(to bottom,#0f172a,#111827)",

              padding: 25,

              borderRadius: 18,

              border:
                "2px solid #334155",

              boxShadow:
                "0 0 40px rgba(0,0,0,0.8)",

              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                marginBottom: 22,
                fontSize: 28,
                color: "#f8fafc",
              }}
            >
              {question.question}
            </h2>

            {question.options.map(
              (o, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setSelected(i)
                  }
                  style={{
                    padding: 13,

                    marginTop: 12,

                    cursor: "pointer",

                    borderRadius: 10,

                    fontSize: 18,

                    transition: "0.3s",

                    background:
                      selected === i
                        ? "#facc15"
                        : "#1e293b",

                    color:
                      selected === i
                        ? "black"
                        : "white",

                    fontWeight: "600",

                    border:
                      selected === i
                        ? "2px solid white"
                        : "2px solid transparent",
                  }}
                >
                  {o}
                </div>
              )
            )}

            <button
              onClick={checkAnswer}
              style={{
                marginTop: 24,

                padding:
                  "12px 24px",

                fontSize: 18,

                cursor: "pointer",

                border: "none",

                borderRadius: 10,

                background:
                  "linear-gradient(to right,#2563eb,#3b82f6)",

                color: "white",

                fontWeight: "bold",

                boxShadow:
                  "0 0 18px rgba(59,130,246,0.4)",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}