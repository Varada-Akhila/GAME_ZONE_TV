import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import VideoPage from "./VideoPage";

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

/* Helper to fetch JSON with timeout and content-type validation */
async function fetchJsonWithTimeout(url, timeoutMs = 2000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response content-type (not application/json)");
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
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
    if (!topicsObj || typeof topicsObj !== "object") return [];
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
      const data = await fetchJsonWithTimeout(`https://games.vrplay.in/api/get_questions.php?game=${gameFile}`, 2000);
      if (data && Array.isArray(data.questions)) {
        setQuestions(selectQuestions(data.questions));
        setPage("exam");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log("Production API not available or invalid format:", err.message);
    }

    try {
      // 2. Try the mock public JSON file
      const data = await fetchJsonWithTimeout(`https://games.vrplay.in/api/questions.json`, 2000);
      const gameTopics = data[gameFile];
      if (gameTopics) {
        setQuestions(selectQuestionsFromTopics(gameTopics));
        setPage("exam");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Mock API database load failed or invalid format:", err.message);
    }

    // 3. Fallback to local topics passed via props
    try {
      const localQ = selectQuestionsFromTopics(topics);
      if (localQ && localQ.length > 0) {
        setQuestions(localQ);
      } else {
        throw new Error("Local topics are empty or malformed");
      }
    } catch (err) {
      console.error("Local questions fallback failed:", err);
      // Fail-safe: populate with a generic mock question so the page can load and not get stuck
      setQuestions([{
        question: "Could not load exam questions. Please try again.",
        options: ["Restart"],
        correctIndex: 0,
        explanation: ""
      }]);
    }
    
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
