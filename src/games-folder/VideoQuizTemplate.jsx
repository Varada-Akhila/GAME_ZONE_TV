import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

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
      onDone(); // Automatically launch the exam when the video ends!
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
  }, [onDone]);

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
          Watch the educational video, then take the exam!
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
          <span>{watched ? "✅" : "🔒"}</span><span>{watched ? "Exam Unlocked!" : "Finish to unlock"}</span>
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
        {watched ? "📝 Open Exam Form" : "⏳ Finish video first"}
      </button>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        <KeyHint k="⏎ OK" label="Play / Pause" theme={theme} />
        <KeyHint k="Space" label="Play / Pause" theme={theme} />
        <KeyHint k="⏎ OK (end)" label="Open Exam" theme={theme} />
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
          {loadingText}{dots}
        </div>
        <div style={{ color: theme.muted, fontSize: "0.9rem", fontWeight: 600 }}>Fetching latest questions from API...</div>
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

/* ── Google Forms style Exam Screen ── */
function GoogleFormExamPage({ questions, theme, title, onRestart }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Create list of focusable items for remote control
  const focusableItems = useMemo(() => {
    const items = [];
    questions.forEach((q, qIdx) => {
      q.options.forEach((opt, optIdx) => {
        items.push({
          type: 'option',
          qIdx,
          optIdx,
          id: `q-${qIdx}-opt-${optIdx}`
        });
      });
    });
    items.push({
      type: 'button',
      id: 'submit-btn'
    });
    return items;
  }, [questions]);

  // Handle remote arrow keys / keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusIndex(prev => {
          const next = Math.min(prev + 1, focusableItems.length - 1);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusIndex(prev => {
          const next = Math.max(prev - 1, 0);
          return next;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const currentItem = focusableItems[focusIndex];
        if (currentItem.type === 'option') {
          if (!submitted) {
            setSelectedAnswers(prev => ({
              ...prev,
              [currentItem.qIdx]: currentItem.optIdx
            }));
            setErrorMsg("");
          }
        } else if (currentItem.type === 'button') {
          if (!submitted) {
            handleSubmit();
          } else {
            onRestart();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusIndex, selectedAnswers, submitted, focusableItems, onRestart]);

  // Auto-scroll focused elements into view
  useEffect(() => {
    const activeItem = focusableItems[focusIndex];
    if (activeItem) {
      const el = document.getElementById(activeItem.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [focusIndex, focusableItems]);

  const handleSubmit = () => {
    const unanswered = [];
    questions.forEach((_, idx) => {
      if (selectedAnswers[idx] === undefined) {
        unanswered.push(idx + 1);
      }
    });

    if (unanswered.length > 0) {
      setErrorMsg(`Please answer all questions before submitting. Unanswered: Question ${unanswered.join(", ")}`);
      // Scroll to the first unanswered question
      const firstUnansweredIdx = unanswered[0] - 1;
      const firstOptionFocusIdx = firstUnansweredIdx * questions[0].options.length;
      setFocusIndex(firstOptionFocusIdx);
      return;
    }

    setSubmitted(true);
    // Move focus to Action Button
    setFocusIndex(focusableItems.length - 1);
  };

  const score = Object.keys(selectedAnswers).filter(
    qIdx => selectedAnswers[qIdx] === questions[qIdx].correctIndex
  ).length;
  const pct = Math.round((score / questions.length) * 100);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      overflowY: "auto",
      background: "#f0f4f9",
      fontFamily: "'Outfit', 'Nunito', sans-serif",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{ width: "100%", maxWidth: "770px" }}>
        
        {/* Google Form Header Card */}
        <div style={{
          background: "#fff",
          borderTop: `10px solid ${theme.accent}`,
          borderRadius: "8px",
          padding: "22px 28px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          marginBottom: "16px",
          position: "relative"
        }}>
          <h1 style={{
            margin: "0 0 10px 0",
            fontSize: "2rem",
            fontWeight: "700",
            color: "#202124"
          }}>
            {title} — Exam Form
          </h1>
          <p style={{ margin: "0 0 16px 0", color: "#5f6368", fontSize: "0.95rem", lineHeight: 1.5 }}>
            This quiz is formatted as a Google Forms exam. All questions are required. Use Arrow Keys to navigate and Enter/Space to select options or submit.
          </p>
          <div style={{ color: "#d93025", fontSize: "0.85rem", fontWeight: "600" }}>* Indicates required question</div>

          {submitted && (
            <div style={{
              marginTop: "20px",
              padding: "16px 20px",
              background: pct >= 80 ? `${theme.correct}15` : pct >= 50 ? `${theme.gold}15` : `${theme.wrong}15`,
              borderRadius: "8px",
              border: `1.5px solid ${pct >= 80 ? theme.correct : pct >= 50 ? theme.gold : theme.wrong}`,
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "800", color: pct >= 80 ? theme.correct : pct >= 50 ? theme.gold : theme.wrong }}>
                🎉 Score Released: {score} / {questions.length} ({pct}%)
              </div>
              <div style={{ height: "6px", background: "rgba(0,0,0,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct >= 80 ? theme.correct : pct >= 50 ? theme.gold : theme.wrong, transition: "width .5s ease" }} />
              </div>
              <div style={{ fontSize: "0.88rem", color: "#5f6368", fontWeight: "600" }}>
                {pct === 100 ? "Perfect score! Outstanding job!" : pct >= 80 ? "Excellent understanding!" : "Keep learning and try again."}
              </div>
            </div>
          )}
        </div>

        {/* Questions List */}
        {questions.map((q, qIdx) => {
          const selectedOpt = selectedAnswers[qIdx];
          const isQCorrect = selectedOpt === q.correctIndex;
          const showQFeedback = submitted;

          return (
            <div
              key={qIdx}
              style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "24px 28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
                marginBottom: "16px",
                border: showQFeedback
                  ? `1px solid ${isQCorrect ? theme.correct : theme.wrong}`
                  : "1px solid #dadce0",
                transition: "border-color 0.3s"
              }}
            >
              {/* Question Text */}
              <div style={{ display: "flex", gap: 6, marginBottom: "4px" }}>
                <span style={{ fontSize: "1.05rem", fontWeight: "700", color: "#202124" }}>
                  {qIdx + 1}. {q.question}
                </span>
                <span style={{ color: "#d93025", fontSize: "1rem" }}>*</span>
              </div>
              <p style={{ margin: "0 0 20px 0", color: "#5f6368", fontSize: "0.9rem", fontStyle: "italic" }}>
                {q.english}
              </p>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {q.options.map((opt, optIdx) => {
                  const isFocused = focusableItems[focusIndex]?.id === `q-${qIdx}-opt-${optIdx}`;
                  const isSelected = selectedAnswers[qIdx] === optIdx;
                  const isCorrectOpt = optIdx === q.correctIndex;

                  let optBg = "#fff";
                  let optBorder = "1px solid #dadce0";
                  let optColor = "#202124";
                  let optOpacity = 1;

                  if (isFocused) {
                    optBorder = `1.5px solid ${theme.accent}`;
                    optBg = `${theme.accent}0a`;
                  } else if (isSelected) {
                    optBorder = `1.5px solid ${theme.accent}`;
                    optBg = `${theme.accent}14`;
                  }

                  if (showQFeedback) {
                    if (isCorrectOpt) {
                      optBorder = `1.5px solid ${theme.correct}`;
                      optBg = theme.correctBg;
                      optColor = theme.correct;
                    } else if (isSelected) {
                      optBorder = `1.5px solid ${theme.wrong}`;
                      optBg = theme.wrongBg;
                      optColor = theme.wrong;
                    } else {
                      optOpacity = 0.55;
                    }
                  }

                  return (
                    <button
                      id={`q-${qIdx}-opt-${optIdx}`}
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => {
                        setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                        setErrorMsg("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: optBorder,
                        background: optBg,
                        color: optColor,
                        opacity: optOpacity,
                        fontSize: "0.98rem",
                        fontWeight: "600",
                        fontFamily: "inherit",
                        cursor: submitted ? "default" : "pointer",
                        textAlign: "left",
                        outline: "none",
                        transition: "all 0.15s ease",
                        boxShadow: isFocused ? `0 0 0 3px ${theme.accent}33` : "none"
                      }}
                    >
                      {/* Radio Circle Icon or Checkmark/Cross */}
                      {showQFeedback ? (
                        isCorrectOpt ? (
                          <span style={{ color: theme.correct, marginRight: "12px", fontSize: "1.2rem", fontWeight: "900" }}>✓</span>
                        ) : isSelected ? (
                          <span style={{ color: theme.wrong, marginRight: "12px", fontSize: "1.2rem", fontWeight: "900" }}>✗</span>
                        ) : (
                          <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #ccc", marginRight: "12px", flexShrink: 0 }} />
                        )
                      ) : (
                        <div style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? theme.accent : "#dadce0"}`,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "12px",
                          flexShrink: 0,
                          background: "#fff"
                        }}>
                          {isSelected && (
                            <div style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: theme.accent
                            }} />
                          )}
                        </div>
                      )}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Block (Submitted only) */}
              {showQFeedback && (
                <div style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "6px",
                  borderLeft: `4px solid ${isQCorrect ? theme.correct : theme.wrong}`,
                  fontSize: "0.88rem",
                  color: "#5f6368",
                  lineHeight: 1.55
                }}>
                  <div style={{ fontWeight: "700", color: isQCorrect ? theme.correct : theme.wrong, marginBottom: "4px" }}>
                    {isQCorrect ? "✓ Correct Feedback" : "✗ Incorrect Feedback"}
                  </div>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {/* Validation Error Message */}
        {errorMsg && (
          <div style={{
            background: "#fdf2f2",
            border: "1px solid #f8b4b4",
            color: "#9b1c1c",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "0.92rem",
            fontWeight: "700",
            textAlign: "center"
          }}>
            {errorMsg}
          </div>
        )}

        {/* Submit / Action Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", marginBottom: "48px" }}>
          <div>
            <KeyHint k="↑↓" label="Navigate form" theme={theme} />
            <KeyHint k="⏎ OK" label="Choose / Submit" theme={theme} />
          </div>
          <button
            id="submit-btn"
            onClick={submitted ? onRestart : handleSubmit}
            style={{
              padding: "12px 36px",
              background: submitted ? `linear-gradient(135deg, ${theme.accent}, ${theme.gold})` : theme.accent,
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "1.05rem",
              fontWeight: "700",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: focusableItems[focusIndex]?.id === 'submit-btn'
                ? `0 0 0 4px ${theme.accent}66, 0 4px 12px rgba(0,0,0,0.15)`
                : "0 1px 3px rgba(0,0,0,0.15)",
              outline: "none",
              transform: focusableItems[focusIndex]?.id === 'submit-btn' ? "scale(1.05)" : "scale(1)",
              transition: "all 0.2s ease"
            }}
          >
            {submitted ? "🔄 Play Again" : "Submit Exam"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* Helper to map game title to JSON database filename key */
const getGameFileFromTitle = (title) => {
  const t = title.toLowerCase();
  if (t.includes("seasons") || t.includes("రుతువుల")) return "seasons.jsx";
  if (t.includes("solar") || t.includes("సౌర")) return "solar.jsx";
  if (t.includes("symbols") || t.includes("national") || t.includes("watch")) return "newquizgame.jsx";
  if (t.includes("water") || t.includes("journey") || t.includes("💧")) return "watercycle.jsx";
  if (t.includes("disasters") || t.includes("వైపరీత్యాలు")) return "natuarl.jsx";
  if (t.includes("animal") || t.includes("జంతువులు")) return "animal.jsx";
  if (t.includes("body") || t.includes("health") || t.includes("🫀")) return "bodyparts.jsx";
  if (t.includes("electric") || t.includes("tech") || t.includes("⚡")) return "electric.jsx";
  return "seasons.jsx";
};

/* ── Main Template Root ── */
export default function VideoQuizTemplate({
  videoSrc,
  topics,
  theme,
  title,
  loadingIcon = "🎮",
  loadingText = "Preparing exam form",
  numQuestions = 5
}) {
  const [page, setPage] = useState("video");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pick exactly 1 question per topic group
  const selectQuestionsFromTopics = useCallback((topicsObj) => {
    return Object.keys(topicsObj).map(key => {
      const pool = topicsObj[key];
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return shuffled[0];
    });
  }, []);

  const selectQuestions = useCallback((questionsArray) => {
    return [...questionsArray]
      .sort(() => Math.random() - 0.5)
      .slice(0, numQuestions);
  }, [numQuestions]);

  // Load questions dynamically from API or fallbacks
  const startQuiz = useCallback(async () => {
    setPage("loading");
    setLoading(true);
    const gameFile = getGameFileFromTitle(title);

    try {
      // 1. Try production PHP endpoint
      const response = await fetch(`/api/get_questions.php?game=${gameFile}`);
      if (!response.ok) throw new Error("Production API endpoint not available");
      const data = await response.json();
      
      if (data && Array.isArray(data.questions)) {
        setQuestions(selectQuestions(data.questions));
        setPage("exam");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log("Production API not available, trying mock questions.json...");
    }

    try {
      // 2. Try the mock public JSON file
      const response = await fetch(`/api/questions.json`);
      if (!response.ok) throw new Error("Mock questions database not available");
      const data = await response.json();
      
      const gameTopics = data[gameFile];
      if (gameTopics) {
        setQuestions(selectQuestionsFromTopics(gameTopics));
        setPage("exam");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Mock API database load failed, falling back to local questions:", err);
    }

    // 3. Fallback to local topics passed via props
    const localQ = selectQuestionsFromTopics(topics);
    setQuestions(localQ);
    setPage("exam");
    setLoading(false);
  }, [title, topics, selectQuestionsFromTopics, selectQuestions]);

  const handleRestart = useCallback(() => {
    setPage("video");
  }, []);

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
      {page === "exam" && questions.length > 0 && (
        <GoogleFormExamPage
          questions={questions}
          theme={theme}
          title={title}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
