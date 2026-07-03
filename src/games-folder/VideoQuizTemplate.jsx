import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Reusable Video Quiz Template Component
   Encapsulates layout, remote control keyboard navigation, and video/quiz logic.
   Used to centralize duplicate code from all video-based quizzes.
───────────────────────────────────────────────────────────────────────── */
export default function VideoQuizTemplate({
  videoSrc,
  topics,
  theme,
  title,
  loadingIcon = "🎮",
  loadingText = "Preparing questions...",
  numQuestions = 5
}) {
  const [page, setPage] = useState("video");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  // Scoped queues to prevent question duplication across play-agains
  const queuesRef = useRef({});
  const lastQRef = useRef({});

  const shuffle = (arr) => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const getQuestions = useCallback(() => {
    return Object.keys(topics).map(key => {
      const pool = topics[key];
      if (!queuesRef.current[key] || queuesRef.current[key].length === 0) {
        let shuffled = shuffle(pool);
        if (lastQRef.current[key] && shuffled.length > 1) {
          while (shuffled[0] === lastQRef.current[key]) {
            shuffled = shuffle(pool);
          }
        }
        queuesRef.current[key] = shuffled;
      }
      const q = queuesRef.current[key].shift();
      lastQRef.current[key] = q;
      return q;
    });
  }, [topics]);

  const startQuiz = useCallback(() => {
    setPage("loading");
    setTimeout(() => {
      setQuestions(getQuestions());
      setPage("quiz");
    }, 800);
  }, [getQuestions]);

  const handleFinish = useCallback((ans) => {
    setAnswers(ans);
    setPage("results");
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers([]);
    setPage("loading");
    setTimeout(() => {
      setQuestions(getQuestions());
      setPage("quiz");
    }, 800);
  }, [getQuestions]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {page === "video" && (
        <VideoPage
          videoSrc={videoSrc}
          theme={theme}
          title={title}
          onDone={startQuiz}
        />
      )}
      {page === "loading" && (
        <LoadingPage
          theme={theme}
          loadingIcon={loadingIcon}
          loadingText={loadingText}
        />
      )}
      {page === "quiz" && questions.length > 0 && (
        <QuizPage
          questions={questions}
          theme={theme}
          onFinish={handleFinish}
        />
      )}
      {page === "results" && (
        <ResultsPage
          answers={answers}
          questions={questions}
          theme={theme}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

/* ── Key Hint Component ── */
function KeyHint({ k, label, theme }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 11px",
      borderRadius: 999,
      background: "#ffffff90",
      border: "1px solid rgba(0,0,0,0.08)",
      fontSize: "clamp(.6rem,.85vw,.82rem)",
      fontWeight: 700
    }}>
      <kbd style={{
        padding: "1px 7px",
        borderRadius: 5,
        fontFamily: "monospace",
        background: `${theme.accent}24`,
        color: theme.accent,
        fontWeight: 800,
        border: `1px solid ${theme.accent}4d`,
        fontSize: "inherit"
      }}>{k}</kbd>
      <span style={{ color: theme.muted }}>{label}</span>
    </div>
  );
}

/* ── Video Player Screen (Page 1) ── */
function VideoPage({ videoSrc, theme, title, onDone }) {
  const [playing, setPlaying] = useState(false);
  const [watched, setWatched] = useState(false);
  const [pct, setPct] = useState(0);
  const [hover, setHover] = useState(false);
  const [vidErr, setVidErr] = useState(false);

  const vidRef = useRef(null);

  useEffect(() => {
    const video = vidRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      if (!video.duration) return;
      const progress = video.currentTime / video.duration;
      setPct(progress);
      if (progress >= 0.9 || video.currentTime > video.duration - 15) {
        setWatched(true);
      }
    };
    const onEnd = () => {
      setPlaying(false);
      setWatched(true);
    };
    const onErr = () => setVidErr(true);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onEnd);
    video.addEventListener("error", onErr);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onEnd);
      video.removeEventListener("error", onErr);
    };
  }, []);

  // Keyboard navigation for TV Remotes
  useEffect(() => {
    const handleKeyDown = (e) => {
      const video = vidRef.current;
      if (!video) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (watched && !playing && video.ended) {
          onDone();
        } else {
          if (playing) video.pause();
          else video.play().catch(() => {});
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 10);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playing, watched, onDone]);

  // Fallback styling logic
  const bgGradient = `radial-gradient(ellipse at 0% 0%, ${theme.accent}24, transparent 45%), radial-gradient(ellipse at 100% 100%, #fde8f0, transparent 45%), #fffdf8`;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      overflowY: "auto",
      background: bgGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(12px,2vh,32px) 16px",
      fontFamily: "'Nunito',sans-serif",
      gap: "clamp(14px,2.2vh,24px)"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontFamily: "'Fredoka One',cursive",
          margin: "0 0 4px 0",
          fontSize: "clamp(1.4rem,3.2vw,2.6rem)",
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.gold}, ${theme.accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          {title}
        </h1>
        <p style={{ color: theme.muted, fontSize: "clamp(.78rem,1.1vw,1rem)", fontWeight: 600 }}>
          Watch the educational video, then take the quiz!
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 820, position: "relative" }}>
        <div style={{
          position: "absolute",
          inset: -3,
          borderRadius: 22,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.gold}, ${theme.accent})`,
          opacity: playing ? 0.45 : 0.2,
          filter: "blur(14px)",
          zIndex: 0,
          transition: "opacity .6s"
        }} />
        <div style={{
          position: "relative",
          zIndex: 1,
          borderRadius: 18,
          overflow: "hidden",
          border: `2.5px solid ${playing ? `${theme.accent}99` : `${theme.accent}2e`}`,
          background: "#000",
          boxShadow: "0 16px 60px rgba(0,0,0,.2)",
          transition: "border-color .4s"
        }}>
          {vidErr ? (
            <div style={{
              width: "100%",
              height: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#f8fafc",
              color: theme.muted,
              padding: 24,
              textAlign: "center"
            }}>
              <span style={{ fontSize: "2.5rem" }}>📁</span>
              <div style={{ fontWeight: 800, color: theme.text }}>Video file not found</div>
              <div style={{ fontSize: "0.84rem", lineHeight: 1.6, maxWidth: 400 }}>
                Video URL: <code style={{ background: `${theme.accent}1f`, padding: "2px 8px", borderRadius: 5, color: theme.accent }}>{videoSrc}</code>
              </div>
            </div>
          ) : (
            <video
              ref={vidRef}
              src={videoSrc}
              controls
              controlsList="nodownload"
              style={{ width: "100%", display: "block", maxHeight: "52vh", background: "#000" }}
              playsInline
              preload="metadata"
            />
          )}
          <div style={{ height: 5, background: "rgba(0,0,0,.08)" }}>
            <div style={{
              height: "100%",
              width: `${pct * 100}%`,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.gold}, ${theme.accent})`,
              transition: "width .4s ease"
            }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{
          padding: "8px 18px",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: "clamp(.72rem,1vw,.92rem)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "#ffffffdb",
          border: `1px solid ${theme.border}`,
          color: theme.muted
        }}>
          <span>{playing ? "▶️" : "⏸️"}</span><span>{Math.round(pct * 100)}% watched</span>
        </div>
        <div style={{
          padding: "8px 18px",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: "clamp(.72rem,1vw,.92rem)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: watched ? `${theme.correct}1f` : "#ffffffdb",
          border: `1px solid ${watched ? theme.correct : theme.border}`,
          color: watched ? theme.correct : theme.muted,
          boxShadow: watched ? `0 0 18px ${theme.correct}33` : "none",
          transition: "all .4s"
        }}>
          <span>{watched ? "✅" : "🔒"}</span><span>{watched ? "Quiz Unlocked!" : "Finish to unlock"}</span>
        </div>
      </div>

      <button
        disabled={!watched}
        onClick={() => watched && onDone()}
        onMouseEnter={() => watched && setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: "clamp(11px,1.6vh,18px) clamp(32px,5vw,64px)",
          fontSize: "clamp(.9rem,1.4vw,1.15rem)",
          fontWeight: 800,
          borderRadius: 999,
          border: "none",
          fontFamily: "'Nunito',sans-serif",
          cursor: watched ? "pointer" : "not-allowed",
          background: watched ? `linear-gradient(135deg, ${theme.accent}, ${theme.gold})` : "rgba(0,0,0,.08)",
          color: watched ? "#fff" : theme.muted,
          boxShadow: watched ? (hover ? `0 0 0 4px ${theme.accent}59,0 8px 32px ${theme.accent}73` : `0 6px 24px ${theme.accent}66`) : "none",
          transform: watched && hover ? "scale(1.06) translateY(-2px)" : "scale(1)",
          transition: "all .22s cubic-bezier(.34,1.56,.64,1)"
        }}
      >
        {watched ? "🚀 Start Quiz" : "⏳ Finish video first"}
      </button>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <KeyHint k="⏎ OK" label="Play / Pause" theme={theme} />
        <KeyHint k="Space" label="Play / Pause" theme={theme} />
        <KeyHint k="⏎ OK (end)" label="Start Quiz" theme={theme} />
      </div>
    </div>
  );
}

/* ── Loading Transition Screen (Page 2) ── */
function LoadingPage({ theme, loadingIcon, loadingText }) {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const t = setInterval(() => setDots((d) => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
      background: `radial-gradient(ellipse at 50% 50%, ${theme.accent}1f, #f7fdf8)`,
      fontFamily: "'Nunito',sans-serif"
    }}>
      <style>{`@keyframes vqSpin{to{transform:rotate(360deg)}}@keyframes vqPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={{ position: "relative", width: 90, height: 90 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: "absolute",
            inset: i * 10,
            borderRadius: "50%",
            border: `2.5px solid ${theme.accentLt || theme.accent}`,
            opacity: .4 - i * .1,
            animation: `vqSpin ${1 + i * .28}s linear infinite`
          }} />
        ))}
        <div style={{
          position: "absolute",
          inset: 28,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.gold})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem"
        }}>
          {loadingIcon}
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: "clamp(1.2rem,2vw,1.6rem)",
          fontWeight: 900,
          color: theme.text,
          marginBottom: 6,
          fontFamily: "'Fredoka One',cursive"
        }}>
          Loading Quiz{dots}
        </div>
        <div style={{ color: theme.muted, fontSize: "0.9rem", fontWeight: 600 }}>{loadingText}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: theme.accentLt || theme.accent,
            animation: `vqPulse 1.2s ease infinite`,
            animationDelay: `${i * 0.15}s`
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── Interactive Quiz Screen (Page 3) ── */
function QuizPage({ questions, theme, onFinish }) {
  const [qIdx, setQIdx] = useState(0);
  const [focused, setFocused] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [countdown, setCountdown] = useState(null);

  const q = questions[qIdx];
  const answered = selected !== null;
  const score = answers.filter(a => a.chosen === a.correct).length;

  const goNext = useCallback((snap) => {
    if (qIdx + 1 >= questions.length) {
      onFinish(snap);
      return;
    }
    setQIdx(i => i + 1);
    setFocused(0);
    setSelected(null);
    setCountdown(null);
  }, [qIdx, questions.length, onFinish]);

  const pick = useCallback((i) => {
    if (answered) return;
    const newAnswer = {
      chosen: i,
      correct: q.correctIndex,
      explanation: q.explanation,
      options: q.options,
      question: q.question,
      english: q.english
    };
    const snap = [...answers, newAnswer];
    setSelected(i);
    setAnswers(snap);
    setCountdown(5);

    const t1 = setTimeout(() => setCountdown(4), 1000);
    const t2 = setTimeout(() => setCountdown(3), 2000);
    const t3 = setTimeout(() => setCountdown(2), 3000);
    const t4 = setTimeout(() => setCountdown(1), 4000);
    const t5 = setTimeout(() => goNext(snap), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [answered, q, answers, goNext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!answered) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setFocused(f => Math.min(f + 1, q.options.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setFocused(f => Math.max(f - 1, 0));
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          pick(focused);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answered, focused, pick, q]);

  const getState = (i) => {
    if (!answered) return focused === i ? "focused" : "idle";
    if (i === q.correctIndex) return "correct";
    if (i === selected) return "wrong";
    return "dim";
  };

  const isCorrect = answered && selected === q.correctIndex;
  const lastAnswer = answers[answers.length - 1];
  const progPct = ((qIdx + (answered ? 1 : 0)) / questions.length) * 100;

  const bgGradient = `radial-gradient(ellipse at 0% 0%, ${theme.accent}1f, transparent 50%), radial-gradient(ellipse at 100% 100%, #fef3c7, transparent 50%), #f7fdf8`;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      overflowY: "auto",
      background: bgGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(14px,2.5vh,36px) clamp(14px,3vw,48px)",
      fontFamily: "'Nunito',sans-serif"
    }}>
      <style>{`@keyframes vqSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}@keyframes vqPop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>

      <div style={{ width: "100%", maxWidth: 680 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "clamp(10px,1.8vh,20px)",
          flexWrap: "wrap",
          gap: 10
        }}>
          <h2 style={{
            fontFamily: "'Fredoka One',cursive",
            margin: 0,
            fontSize: "clamp(1.3rem,2.8vw,2rem)",
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.gold})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Quiz Time
          </h2>
          <div style={{
            padding: "7px 18px",
            borderRadius: 999,
            background: "#ffffffdb",
            border: `1px solid ${theme.border}`,
            fontWeight: 800,
            color: theme.gold,
            fontSize: "clamp(.75rem,1vw,.95rem)"
          }}>
            ⭐ {score} / {questions.length}
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: "clamp(10px,1.8vh,20px)"
        }}>
          <span style={{ color: theme.muted, fontSize: "clamp(.7rem,.9vw,.85rem)", fontWeight: 700, whiteSpace: "nowrap" }}>
            Q {qIdx + 1}/{questions.length}
          </span>
          <div style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(0,0,0,.08)", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${progPct}%`,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.gold})`,
              transition: "width .5s ease",
              borderRadius: 4
            }} />
          </div>
          <span style={{ color: theme.muted, fontSize: "clamp(.7rem,.9vw,.85rem)", fontWeight: 700 }}>
            {Math.round(progPct)}%
          </span>
        </div>

        <div style={{
          background: theme.card,
          borderRadius: "clamp(14px,2vw,22px)",
          padding: "clamp(18px,2.8vh,28px) clamp(16px,2.5vw,26px) clamp(14px,2.2vh,22px)",
          border: `2px solid ${theme.accent}1f`,
          boxShadow: "0 6px 32px rgba(0,0,0,.1)",
          marginBottom: 12,
          animation: "vqPop .3s ease"
        }}>
          <p style={{
            fontSize: "clamp(.95rem,1.8vw,1.1rem)",
            fontWeight: 800,
            lineHeight: 1.6,
            color: theme.text,
            margin: "0 0 4px 0"
          }}>{q.question}</p>
          <p style={{
            fontSize: "clamp(.78rem,1.3vw,.92rem)",
            fontWeight: 600,
            color: theme.muted,
            margin: "0 0 clamp(14px,2vh,20px) 0",
            fontStyle: "italic"
          }}>{q.english}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(7px,1vh,10px)" }}>
            {q.options.map((opt, i) => {
              const st = getState(i);
              const isFoc = st === "focused";
              return (
                <button
                  key={i}
                  onClick={() => !answered && pick(i)}
                  onMouseEnter={() => !answered && setFocused(i)}
                  style={{
                    width: "100%",
                    padding: "clamp(10px,1.5vh,13px) clamp(12px,1.5vw,16px)",
                    borderRadius: "clamp(10px,1.2vw,14px)",
                    border: `1.5px solid ${st === "correct" ? theme.correct : st === "wrong" ? theme.wrong : isFoc ? theme.accent : theme.border}`,
                    background: st === "correct" ? theme.correctBg : st === "wrong" ? theme.wrongBg : st === "dim" ? "rgba(0,0,0,.03)" : isFoc ? `${theme.accent}1a` : "rgba(255,255,255,.7)",
                    color: st === "dim" ? "#bbb" : st === "correct" ? theme.correct : st === "wrong" ? theme.wrong : theme.text,
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(8px,1vw,12px)",
                    fontSize: "clamp(.8rem,1.2vw,.95rem)",
                    fontWeight: 600,
                    fontFamily: "'Nunito',sans-serif",
                    cursor: answered ? "default" : "pointer",
                    textAlign: "left",
                    outline: "none",
                    lineHeight: 1.4,
                    transition: "all .2s cubic-bezier(.34,1.56,.64,1)",
                    transform: isFoc ? "translateX(6px)" : "none",
                    boxShadow: st === "correct" ? `0 0 16px ${theme.correct}33` : st === "wrong" ? `0 0 10px ${theme.wrong}26` : isFoc ? `0 0 0 2px ${theme.accent}40` : "none",
                    opacity: st === "dim" ? 0.4 : 1
                  }}
                >
                  <span style={{
                    minWidth: 26,
                    height: 26,
                    borderRadius: 7,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: ".76rem",
                    fontWeight: 900,
                    color: "#fff",
                    background: st === "correct" ? theme.correct : st === "wrong" ? theme.wrong : isFoc ? theme.accent : "rgba(0,0,0,.15)"
                  }}>
                    {st === "correct" ? "✓" : st === "wrong" ? "✗" : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {answered && lastAnswer && (
          <div style={{
            padding: "clamp(10px,1.5vh,14px) clamp(14px,2vw,18px)",
            borderRadius: "clamp(10px,1.2vw,14px)",
            background: isCorrect ? theme.correctBg : theme.wrongBg,
            border: `1px solid ${isCorrect ? theme.correct : theme.wrong}`,
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 12,
            animation: "vqSlide .25s ease"
          }}>
            <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{isCorrect ? "🎉" : "💡"}</span>
            <div style={{ flex: 1, fontSize: "clamp(.78rem,1.1vw,.9rem)", lineHeight: 1.55, color: theme.muted, fontWeight: 600 }}>
              <span style={{ fontWeight: 800, color: isCorrect ? theme.correct : theme.wrong, marginRight: 6 }}>
                {isCorrect ? "Correct!" : "Wrong!"}
              </span>
              {lastAnswer.explanation}
            </div>
            <div style={{
              minWidth: 36,
              height: 36,
              borderRadius: "50%",
              background: isCorrect ? theme.correct : theme.wrong,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: "1rem",
              flexShrink: 0
            }}>
              {countdown}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <KeyHint k="↑↓" label="Navigate" theme={theme} />
          <KeyHint k="⏎ OK" label="Select answer" theme={theme} />
          {answered && <KeyHint k="⏳" label="Auto next in 5s" theme={theme} />}
        </div>
      </div>
    </div>
  );
}

/* ── Summary / Scoreboard Screen (Page 4) ── */
function ResultsPage({ answers, questions, theme, onRestart }) {
  const [hover, setHover] = useState(false);
  const score = answers.filter(a => a.chosen === a.correct).length;
  const pct = Math.round((score / answers.length) * 100);
  const emoji = pct === 100 ? "🏆" : pct >= 80 ? "🌟" : pct >= 60 ? "👏" : pct >= 40 ? "📚" : "💪";
  const msg = pct === 100 ? "Perfect Score!" : pct >= 80 ? "Excellent!" : pct >= 60 ? "Good Job!" : pct >= 40 ? "Keep Learning!" : "Nice Try!";
  const col = pct >= 80 ? theme.correct : pct >= 50 ? theme.gold : theme.wrong;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRestart]);

  const bgGradient = `radial-gradient(ellipse at 50% 0%, ${theme.accent}1f, transparent 50%), #f7fdf8`;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      overflowY: "auto",
      background: bgGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(20px,3vh,48px) clamp(16px,3vw,48px)",
      fontFamily: "'Nunito',sans-serif",
      gap: "clamp(14px,2vh,22px)"
    }}>
      <style>{`@keyframes vqBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      <div style={{
        fontSize: "clamp(3.5rem,8vw,5.5rem)",
        filter: `drop-shadow(0 0 20px ${col})`,
        animation: "vqBounce 2s ease-in-out infinite"
      }}>{emoji}</div>

      <h2 style={{
        fontFamily: "'Fredoka One',cursive",
        margin: 0,
        fontSize: "clamp(1.8rem,4vw,2.8rem)",
        fontWeight: 700,
        background: `linear-gradient(135deg, ${theme.accent}, ${theme.gold})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>{msg}</h2>

      <div style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 8,
        padding: "clamp(12px,2vh,18px) clamp(28px,4vw,48px)",
        borderRadius: 20,
        background: theme.card,
        border: `2.5px solid ${col}44`,
        boxShadow: `0 0 32px ${col}18,0 6px 24px rgba(0,0,0,.08)`
      }}>
        <span style={{ fontSize: "clamp(2.5rem,7vw,4rem)", fontWeight: 900, color: col }}>{score}</span>
        <span style={{ fontSize: "clamp(1.3rem,3vw,2rem)", color: theme.muted }}>/ {answers.length}</span>
        <span style={{ fontSize: "clamp(.88rem,1.2vw,1rem)", color: theme.muted, marginLeft: 4 }}>({pct}%)</span>
      </div>

      <div style={{
        width: "100%",
        maxWidth: 600,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxHeight: "30vh",
        overflowY: "auto",
        paddingRight: 4
      }}>
        {answers.map((a, i) => {
          const ok = a.chosen === a.correct;
          return (
            <div
              key={i}
              style={{
                padding: "clamp(9px,1.3vh,13px) clamp(13px,1.8vw,16px)",
                borderRadius: "clamp(10px,1.2vw,14px)",
                background: ok ? theme.correctBg : theme.wrongBg,
                border: `1px solid ${ok ? `${theme.correct}44` : `${theme.wrong}44`}`,
                display: "flex",
                gap: 10,
                alignItems: "flex-start"
              }}
            >
              <span style={{ flexShrink: 0, marginTop: 1 }}>{ok ? "✅" : "❌"}</span>
              <div style={{ fontSize: "clamp(.76rem,1vw,.88rem)", lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, color: theme.text, marginBottom: ok ? 0 : 3 }}>
                  {questions[i]?.english}
                </div>
                {!ok && (
                  <div style={{ color: theme.muted, fontWeight: 600 }}>
                    Your answer: <span style={{ color: theme.wrong, fontWeight: 800 }}>{questions[i]?.options[a.chosen]}</span>
                    {" · "}Correct: <span style={{ color: theme.correct, fontWeight: 800 }}>{questions[i]?.options[a.correct]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onRestart}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: "clamp(12px,1.8vh,18px) clamp(40px,6vw,72px)",
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.gold})`,
          color: "#fff",
          fontWeight: 800,
          fontFamily: "'Nunito',sans-serif",
          fontSize: "clamp(.9rem,1.4vw,1.15rem)",
          boxShadow: hover ? `0 0 0 4px ${theme.accent}4d,0 10px 36px ${theme.accent}80` : `0 6px 28px ${theme.accent}66`,
          transform: hover ? "scale(1.07) translateY(-2px)" : "scale(1)",
          transition: "all .22s cubic-bezier(.34,1.56,.64,1)",
          outline: "none"
        }}
      >
        🔄 Play Again
      </button>
    </div>
  );
}
