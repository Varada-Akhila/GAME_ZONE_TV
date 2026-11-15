import React, { useMemo } from "react";
import VideoQuizTemplate from "./VideoQuizTemplate";

const TimeVideo = "https://games.vrplay.in/videos/time.mp4";

const C = {
  accent: "#8b5cf6",
  accentLt: "#c084fc",
  gold: "#eab308",
  border: "rgba(0,0,0,0.08)",
  text: "#1e293b",
  muted: "#64748b",
  card: "#ffffffed",
  correct: "#10b981",
  correctBg: "#ecfdf5",
  wrong: "#ef4444",
  wrongBg: "#fef2f2"
};

const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const generateQuestion = (hour, minute) => {
  const answer = `${hour}:${String(minute).padStart(2, "0")}`;
  let question = "What time is shown on the clock?";

  if (minute === 15) {
    question = `Quarter past ${hour} means?`;
  } else if (minute === 30) {
    question = `Half past ${hour} means?`;
  } else if (minute === 45) {
    const nextHour = hour === 12 ? 1 : hour + 1;
    question = `Quarter to ${nextHour} means?`;
  }

  const wrong1 = `${hour}:&String((minute + 15) % 60).padStart(2, "0")}`.replace('&', '$');
  const wrong2 = `${hour}:&String((minute + 30) % 60).padStart(2, "0")}`.replace('&', '$');
  const wrong3 = `${hour === 12 ? 1 : hour + 1}:&String(minute).padStart(2, "0")}`.replace('&', '$');

  const options = [answer, wrong1, wrong2, wrong3];
  return {
    question,
    answer,
    options: options.sort(() => Math.random() - 0.5)
  };
};

export const config = {
  videoSrc: TimeVideo,
  topics: (() => {
    const t = {};
    let idx = 0;
    for (let h = 1; h <= 12; h++) {
      minutes.forEach(m => {
        const q = generateQuestion(h, m);
        const correctIndex = q.options.indexOf(q.answer);
        t[`time-${idx++}`] = [{
          question: q.question,
          english: q.question,
          options: q.options,
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
          explanation: `The clock shows ${q.answer}.`
        }];
      });
    }
    return t;
  })(),
  theme: C,
  title: "⏰ Time Teacher Quiz",
  loadingIcon: "⏰",
  loadingText: "Preparing time questions",
  numQuestions: 5
};

export default function TimeTeacherQuiz() {
  return (
    <VideoQuizTemplate {...config} />
  );
}
