import React, { useMemo } from "react";
import VideoQuizTemplate from "./VideoQuizTemplate";

const StatesVideo = "https://games.vrplay.in/videos/states.mp4";

const STATES_DATA = [
  {
    "state": "Andhra Pradesh",
    "capital": "Amaravati"
  },
  {
    "state": "Arunachal Pradesh",
    "capital": "Itanagar"
  },
  {
    "state": "Assam",
    "capital": "Dispur"
  },
  {
    "state": "Bihar",
    "capital": "Patna"
  },
  {
    "state": "Chhattisgarh",
    "capital": "Raipur"
  },
  {
    "state": "Goa",
    "capital": "Panaji"
  },
  {
    "state": "Gujarat",
    "capital": "Gandhinagar"
  },
  {
    "state": "Haryana",
    "capital": "Chandigarh"
  },
  {
    "state": "Himachal Pradesh",
    "capital": "Shimla"
  },
  {
    "state": "Jharkhand",
    "capital": "Ranchi"
  },
  {
    "state": "Karnataka",
    "capital": "Bengaluru"
  },
  {
    "state": "Kerala",
    "capital": "Thiruvananthapuram"
  },
  {
    "state": "Madhya Pradesh",
    "capital": "Bhopal"
  },
  {
    "state": "Maharashtra",
    "capital": "Mumbai"
  },
  {
    "state": "Manipur",
    "capital": "Imphal"
  },
  {
    "state": "Meghalaya",
    "capital": "Shillong"
  },
  {
    "state": "Mizoram",
    "capital": "Aizawl"
  },
  {
    "state": "Nagaland",
    "capital": "Kohima"
  },
  {
    "state": "Odisha",
    "capital": "Bhubaneswar"
  },
  {
    "state": "Punjab",
    "capital": "Chandigarh"
  },
  {
    "state": "Rajasthan",
    "capital": "Jaipur"
  },
  {
    "state": "Sikkim",
    "capital": "Gangtok"
  },
  {
    "state": "Tamil Nadu",
    "capital": "Chennai"
  },
  {
    "state": "Telangana",
    "capital": "Hyderabad"
  },
  {
    "state": "Tripura",
    "capital": "Agartala"
  },
  {
    "state": "Uttar Pradesh",
    "capital": "Lucknow"
  },
  {
    "state": "Uttarakhand",
    "capital": "Dehradun"
  },
  {
    "state": "West Bengal",
    "capital": "Kolkata"
  }
];

const C = {
  accent: "#3b82f6",
  accentLt: "#93c5fd",
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

export const config = {
  videoSrc: StatesVideo,
  topics: (() => {
    const t = {};
    STATES_DATA.forEach((item, idx) => {
      // Pick 3 wrong capitals dynamically from other states
      const otherCapitals = STATES_DATA
        .filter(d => d.capital !== item.capital)
        .map(d => d.capital);
      const shuffledWrong = [...otherCapitals].sort(() => Math.random() - 0.5).slice(0, 3);
      
      const options = [item.capital, ...shuffledWrong].sort(() => Math.random() - 0.5);
      const correctIndex = options.indexOf(item.capital);

      t[`state-${idx}`] = [{
        question: `What is the capital of ${item.state}?`,
        english: `What is the capital of ${item.state}?`,
        options: options,
        correctIndex: correctIndex,
        explanation: `The capital of ${item.state} is ${item.capital}.`
      }];
    });
    return t;
  })(),
  theme: C,
  title: "🇮🇳 India States & Capitals",
  loadingIcon: "🇮🇳",
  loadingText: "Preparing capital questions",
  numQuestions: 5
};

export default function StatesCapitalTVQuiz() {
  return (
    <VideoQuizTemplate {...config} />
  );
}
