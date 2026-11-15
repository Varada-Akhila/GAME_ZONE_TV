import React, { useState, useEffect } from "react";

const QUIZ_LOADERS = {
  'solar': () => import('./solar.jsx'),
  'Water Cycle': () => import('./watercycle.jsx'),
  'Animal chain': () => import('./animal.jsx'),
  'Seasons': () => import('./seasons.jsx'),
  'electric': () => import('./electric.jsx'),
  'quiz_game': () => import('./newquizgame.jsx'),
  'body_parts': () => import('./bodyparts.jsx'),
  'Natural': () => import('./natuarl.jsx'),
  'states_capitals_quiz': () => import('./StatesCapitalTVQuiz.jsx'),
  'time_teacher_quiz': () => import('./TimeTeacherQuiz.jsx'),
  'animal_babies_quiz': () => import('./AnimalBabiesQuiz.jsx'),
};

const QUIZ_LIST = [
  { id: 'solar', name: 'Explore the sky (Solar System)' },
  { id: 'Water Cycle', name: 'Water Cycle' },
  { id: 'Animal chain', name: 'Animal Chain' },
  { id: 'Seasons', name: 'Seasons' },
  { id: 'electric', name: 'electric' },
  { id: 'quiz_game', name: 'national india' },
  { id: 'body_parts', name: 'learn body parts' },
  { id: 'Natural', name: 'Natuarl' },
  { id: 'states_capitals_quiz', name: 'States & Capitals Quiz' },
  { id: 'time_teacher_quiz', name: 'Time Teacher Quiz' },
  { id: 'animal_babies_quiz', name: 'Animal Babies Quiz' },
];

export default function AdminPortal({ onBack }) {
  const [selectedQuizId, setSelectedQuizId] = useState(QUIZ_LIST[0].id);
  const [quizConfig, setQuizConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load configuration for the selected quiz
  useEffect(() => {
    let active = true;
    const loadQuizData = async () => {
      setLoading(true);
      setSuccessMsg("");
      setErrorMsg("");

      // 1. Try to load from localStorage first
      const stored = localStorage.getItem(`quiz_config_${selectedQuizId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (active) {
            setQuizConfig(parsed);
            setLoading(false);
          }
          return;
        } catch (e) {
          console.error("Failed to parse stored quiz config", e);
        }
      }

      // 2. Fall back to importing codebase default config
      const loader = QUIZ_LOADERS[selectedQuizId];
      if (loader) {
        try {
          const module = await loader();
          if (active) {
            if (module.config) {
              // Deep copy the topics/questions to avoid mutating module cache
              const configCopy = JSON.parse(JSON.stringify(module.config));
              setQuizConfig(configCopy);
            } else {
              setErrorMsg("No default configuration exported from the file.");
            }
          }
        } catch (err) {
          console.error("Failed to import default quiz file", err);
          if (active) setErrorMsg("Failed to import original quiz module.");
        }
      } else {
        if (active) setErrorMsg("Quiz loader not found.");
      }
      if (active) setLoading(false);
    };

    loadQuizData();
    return () => {
      active = false;
    };
  }, [selectedQuizId]);

  const handleFieldChange = (field, value) => {
    setQuizConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Convert topics group back and forth if needed.
  // In our templates, topics is: { groupName: [ {question, options, correctIndex, explanation} ] }
  // We can edit it as a simple list of questions for convenience, then map it back to a grouped topics object.
  const getQuestionsList = () => {
    if (!quizConfig || !quizConfig.topics) return [];
    const list = [];
    Object.keys(quizConfig.topics).forEach(topicKey => {
      const qArray = quizConfig.topics[topicKey];
      if (Array.isArray(qArray)) {
        qArray.forEach((q, subIdx) => {
          list.push({
            topicKey,
            subIdx,
            ...q
          });
        });
      }
    });
    return list;
  };

  const updateQuestion = (index, field, value) => {
    const questions = getQuestionsList();
    questions[index][field] = value;
    rebuildTopicsFromList(questions);
  };

  const updateOption = (qIdx, optIdx, value) => {
    const questions = getQuestionsList();
    questions[qIdx].options[optIdx] = value;
    rebuildTopicsFromList(questions);
  };

  const addQuestion = () => {
    const questions = getQuestionsList();
    questions.push({
      topicKey: `topic_${Date.now()}`,
      subIdx: 0,
      question: "New Question Text?",
      english: "New Question English Translation?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctIndex: 0,
      explanation: "Explanation text for the correct option."
    });
    rebuildTopicsFromList(questions);
  };

  const deleteQuestion = (index) => {
    const questions = getQuestionsList();
    questions.splice(index, 1);
    rebuildTopicsFromList(questions);
  };

  const rebuildTopicsFromList = (list) => {
    const newTopics = {};
    list.forEach((q, idx) => {
      // Keep or generate the group key
      const key = q.topicKey || `q_group_${idx}`;
      newTopics[key] = [{
        question: q.question,
        english: q.english || q.question,
        options: q.options,
        correctIndex: parseInt(q.correctIndex) || 0,
        explanation: q.explanation || ""
      }];
    });
    setQuizConfig(prev => ({
      ...prev,
      topics: newTopics
    }));
  };

  const handleSaveChanges = () => {
    try {
      localStorage.setItem(`quiz_config_${selectedQuizId}`, JSON.stringify(quizConfig));
      setSuccessMsg(`Successfully saved quiz configuration for "${selectedQuizId}" in LocalStorage!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to save configuration to LocalStorage. Data might be too large.");
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm("Are you sure you want to discard your custom edits and restore the default video and questions?")) {
      localStorage.removeItem(`quiz_config_${selectedQuizId}`);
      // Re-trigger load by toggling ID or reloading
      const tempId = selectedQuizId;
      setSelectedQuizId("");
      setTimeout(() => setSelectedQuizId(tempId), 50);
      setSuccessMsg("Reset completed! Original file settings restored.");
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quizConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quiz_${selectedQuizId}_config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const questions = getQuestionsList();

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "#f1f5f9",
      color: "#0f172a",
      fontFamily: "'Nunito', sans-serif",
      padding: "24px 16px"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Top Header */}
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          padding: "16px 24px",
          borderRadius: 12,
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12
        }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "'Fredoka One', cursive", fontSize: "1.8rem", color: "#6366f1" }}>
              🛠️ GameZone Admin Panel
            </h1>
            <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "0.9rem" }}>
              Upload video links, change quiz titles, and add or edit questions.
            </p>
          </div>
          <button
            onClick={onBack}
            style={{
              padding: "10px 20px",
              background: "#475569",
              color: "#fff",
              fontWeight: 700,
              borderRadius: 8,
              cursor: "pointer",
              transition: "background 0.2s"
            }}
          >
            ← Back to Games
          </button>
        </header>

        {/* Success/Error Alerts */}
        {successMsg && (
          <div style={{ padding: "12px 18px", background: "#dcfce7", color: "#166534", borderRadius: 8, border: "1px solid #bbf7d0", marginBottom: 20, fontWeight: 700 }}>
            ✅ {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ padding: "12px 18px", background: "#fee2e2", color: "#991b1b", borderRadius: 8, border: "1px solid #fca5a5", marginBottom: 20, fontWeight: 700 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "start" }}>
          
          {/* Left panel: List of Quizzes */}
          <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}>
            <h3 style={{ margin: "0 0 10px 0", fontFamily: "'Fredoka One', cursive", color: "#334155" }}>Select a Quiz</h3>
            {QUIZ_LIST.map((q) => {
              const isSelected = q.id === selectedQuizId;
              const hasOverride = localStorage.getItem(`quiz_config_${q.id}`) !== null;
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuizId(q.id)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: isSelected ? "#6366f1" : "#f8fafc",
                    color: isSelected ? "#fff" : "#1f2937",
                    border: `1.5px solid ${isSelected ? "#6366f1" : "#e2e8f0"}`,
                    fontWeight: 700,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <span>{q.name}</span>
                  {hasOverride && (
                    <span style={{
                      fontSize: "0.7rem",
                      background: isSelected ? "#fff" : "#6366f1",
                      color: isSelected ? "#6366f1" : "#fff",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontWeight: 800
                    }}>Custom</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right panel: Editor */}
          <div style={{
            gridColumn: "span 2",
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
          }}>
            {loading ? (
              <div style={{ padding: "48px 0", textAlign: "center", color: "#64748b", fontSize: "1.1rem" }}>
                Loading configuration data...
              </div>
            ) : quizConfig ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                
                {/* Section 1: Video and Metadata */}
                <div>
                  <h3 style={{ margin: "0 0 16px 0", fontFamily: "'Fredoka One', cursive", borderBottom: "2px solid #f1f5f9", paddingBottom: 8, color: "#475569" }}>
                    🎥 Video & Page Settings
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#334155" }}>Video URL *</label>
                      <input
                        type="text"
                        value={quizConfig.videoSrc || ""}
                        onChange={(e) => handleFieldChange("videoSrc", e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: "1px solid #cbd5e1",
                          fontSize: "0.95rem"
                        }}
                      />
                      <small style={{ color: "#64748b" }}>Provide a direct link to a `.mp4` video file.</small>
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#334155" }}>Quiz Title</label>
                      <input
                        type="text"
                        value={quizConfig.title || ""}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: "1px solid #cbd5e1",
                          fontSize: "0.95rem"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#334155" }}>Emoji Icon</label>
                      <input
                        type="text"
                        value={quizConfig.loadingIcon || ""}
                        onChange={(e) => handleFieldChange("loadingIcon", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: "1px solid #cbd5e1",
                          fontSize: "0.95rem"
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: 700, color: "#334155" }}>Loading Screen Text</label>
                      <input
                        type="text"
                        value={quizConfig.loadingText || ""}
                        onChange={(e) => handleFieldChange("loadingText", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 8,
                          border: "1px solid #cbd5e1",
                          fontSize: "0.95rem"
                        }}
                      />
                    </div>

                  </div>
                </div>

                {/* Section 2: Questions */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #f1f5f9", paddingBottom: 8, marginBottom: 16 }}>
                    <h3 style={{ margin: 0, fontFamily: "'Fredoka One', cursive", color: "#475569" }}>
                      📝 Questions ({questions.length})
                    </h3>
                    <button
                      onClick={addQuestion}
                      style={{
                        padding: "8px 16px",
                        background: "#10b981",
                        color: "#fff",
                        fontWeight: 700,
                        borderRadius: 6,
                        cursor: "pointer",
                        border: "none",
                        fontSize: "0.85rem"
                      }}
                    >
                      ➕ Add Question
                    </button>
                  </div>

                  {questions.length === 0 ? (
                    <div style={{ padding: 24, textAlign: "center", border: "2px dashed #cbd5e1", borderRadius: 8, color: "#64748b" }}>
                      No questions configured. Click "Add Question" to create one.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {questions.map((q, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: 16,
                            position: "relative"
                          }}
                        >
                          <button
                            onClick={() => deleteQuestion(idx)}
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              background: "#ef4444",
                              color: "#fff",
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer"
                            }}
                          >
                            Delete
                          </button>

                          <div style={{ fontWeight: 800, color: "#6366f1", marginBottom: 12 }}>Question #{idx + 1}</div>

                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            
                            <div>
                              <label style={{ display: "block", marginBottom: 4, fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
                                Question Title (Primary)
                              </label>
                              <input
                                type="text"
                                value={q.question || ""}
                                onChange={(e) => updateQuestion(idx, "question", e.target.value)}
                                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                              />
                            </div>

                            <div>
                              <label style={{ display: "block", marginBottom: 4, fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
                                English Translation / Subtitle
                              </label>
                              <input
                                type="text"
                                value={q.english || ""}
                                onChange={(e) => updateQuestion(idx, "english", e.target.value)}
                                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                              />
                            </div>

                            <div>
                              <label style={{ display: "block", marginBottom: 6, fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
                                Answer Options
                              </label>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <input
                                      type="radio"
                                      name={`correct-opt-${idx}`}
                                      checked={parseInt(q.correctIndex) === oIdx}
                                      onChange={() => updateQuestion(idx, "correctIndex", oIdx)}
                                      title="Mark as correct answer"
                                    />
                                    <input
                                      type="text"
                                      value={opt || ""}
                                      onChange={(e) => updateOption(idx, oIdx, e.target.value)}
                                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                      style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: "0.88rem" }}
                                    />
                                  </div>
                                ))}
                              </div>
                              <small style={{ color: "#64748b", marginTop: 4, display: "block" }}>
                                Select the radio button next to the correct answer.
                              </small>
                            </div>

                            <div>
                              <label style={{ display: "block", marginBottom: 4, fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
                                Explanation block (Shown on feedback)
                              </label>
                              <textarea
                                value={q.explanation || ""}
                                onChange={(e) => updateQuestion(idx, "explanation", e.target.value)}
                                rows={2}
                                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", resize: "vertical", fontFamily: "inherit" }}
                              />
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 3: Action Buttons */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  borderTop: "2px solid #f1f5f9",
                  paddingTop: 20
                }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={handleSaveChanges}
                      style={{
                        padding: "12px 24px",
                        background: "#4f46e5",
                        color: "#fff",
                        fontWeight: 700,
                        borderRadius: 8,
                        cursor: "pointer",
                        border: "none"
                      }}
                    >
                      💾 Save to Local
                    </button>
                    <button
                      onClick={handleExportJSON}
                      style={{
                        padding: "12px 24px",
                        background: "#0ea5e9",
                        color: "#fff",
                        fontWeight: 700,
                        borderRadius: 8,
                        cursor: "pointer",
                        border: "none"
                      }}
                    >
                      📥 Export config.json
                    </button>
                  </div>

                  <button
                    onClick={handleResetToDefault}
                    style={{
                      padding: "12px 24px",
                      background: "#f1f5f9",
                      color: "#ef4444",
                      fontWeight: 700,
                      borderRadius: 8,
                      cursor: "pointer",
                      border: "1px solid #fca5a5"
                    }}
                  >
                    🗑️ Reset to Default
                  </button>
                </div>

              </div>
            ) : (
              <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
                Select a quiz from the left panel to begin editing.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
