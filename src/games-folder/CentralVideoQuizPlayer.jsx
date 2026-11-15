import React, { useState, useEffect } from "react";
import VideoQuizTemplate from "./VideoQuizTemplate";

// Map of game IDs to their respective dynamic loaders
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

export default function CentralVideoQuizPlayer({ gameId }) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const loadQuiz = async () => {
      // 1. Try to load from LocalStorage first (custom uploads via Admin Portal)
      const stored = localStorage.getItem(`quiz_config_${gameId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (active) {
            setConfig(parsed);
            return;
          }
        } catch (e) {
          console.error("Failed to parse custom local quiz config", e);
        }
      }

      // 2. Fall back to static imports
      const loader = QUIZ_LOADERS[gameId];
      if (!loader) {
        if (active) setError(`Quiz with ID "${gameId}" is not registered in the centralized system.`);
        return;
      }

      try {
        const module = await loader();
        if (active) {
          if (module.config) {
            setConfig(module.config);
          } else {
            setError(`Configuration not found for quiz "${gameId}".`);
          }
        }
      } catch (err) {
        console.error("Error loading quiz configuration:", err);
        if (active) setError(`Failed to load quiz data for "${gameId}". Please try again.`);
      }
    };

    setConfig(null);
    setError(null);
    loadQuiz();

    return () => {
      active = false;
    };
  }, [gameId]);

  if (error) {
    return (
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        color: "#0f172a",
        flexDirection: "column",
        gap: 16,
        fontFamily: "'Nunito', sans-serif",
        padding: 24,
        textAlign: "center"
      }}>
        <span style={{ fontSize: "3rem" }}>⚠️</span>
        <h2 style={{ margin: 0, fontFamily: "'Fredoka One', cursive" }}>Quiz Configuration Error</h2>
        <p style={{ margin: 0, color: "#64748b", maxWidth: 450, lineHeight: 1.6 }}>{error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 50%, rgba(99, 102, 241, 0.12), #f8fafc)",
        color: "#1e1b4b",
        fontSize: "1.5rem",
        fontFamily: "'Fredoka One', cursive",
        flexDirection: "column",
        gap: 16
      }}>
        <div style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          border: "4px solid #6366f1",
          borderTopColor: "transparent",
          animation: "vqSpin 1s linear infinite"
        }} />
        <style>{`@keyframes vqSpin{to{transform:rotate(360deg)}}`}</style>
        <span>Loading Quiz Configuration...</span>
      </div>
    );
  }

  return (
    <VideoQuizTemplate
      videoSrc={config.videoSrc}
      topics={config.topics}
      theme={config.theme}
      title={config.title}
      loadingIcon={config.loadingIcon || "🎮"}
      loadingText={config.loadingText || "Preparing quiz..."}
      numQuestions={config.numQuestions || 5}
    />
  );
}
