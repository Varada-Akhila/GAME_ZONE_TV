import React from "react";
import VideoQuizTemplate from "./VideoQuizTemplate";

const AnimalBabyVideo = "https://games.vrplay.in/videos/baby%20animal.mp4";

const TOPICS = {
  "General": [
    {
      "question": "What is a baby dog called?",
      "english": "What is a baby dog called?",
      "options": [
        "Puppy",
        "Kitten",
        "Cub",
        "Calf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Puppy."
    },
    {
      "question": "What is a baby cat called?",
      "english": "What is a baby cat called?",
      "options": [
        "Kitten",
        "Puppy",
        "Cub",
        "Lamb"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Kitten."
    },
    {
      "question": "What is a baby cow called?",
      "english": "What is a baby cow called?",
      "options": [
        "Calf",
        "Foal",
        "Kid",
        "Cub"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Calf."
    },
    {
      "question": "What is a baby horse called?",
      "english": "What is a baby horse called?",
      "options": [
        "Foal",
        "Calf",
        "Kid",
        "Puppy"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Foal."
    },
    {
      "question": "What is a baby goat called?",
      "english": "What is a baby goat called?",
      "options": [
        "Kid",
        "Lamb",
        "Calf",
        "Cub"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Kid."
    },
    {
      "question": "What is a baby sheep called?",
      "english": "What is a baby sheep called?",
      "options": [
        "Lamb",
        "Kid",
        "Foal",
        "Pup"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Lamb."
    },
    {
      "question": "What is a baby pig called?",
      "english": "What is a baby pig called?",
      "options": [
        "Piglet",
        "Cub",
        "Kid",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Piglet."
    },
    {
      "question": "What is a baby lion called?",
      "english": "What is a baby lion called?",
      "options": [
        "Cub",
        "Pup",
        "Calf",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Cub."
    },
    {
      "question": "What is a baby tiger called?",
      "english": "What is a baby tiger called?",
      "options": [
        "Cub",
        "Puppy",
        "Kid",
        "Lamb"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Cub."
    },
    {
      "question": "What is a baby elephant called?",
      "english": "What is a baby elephant called?",
      "options": [
        "Calf",
        "Cub",
        "Foal",
        "Kid"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Calf."
    },
    {
      "question": "What is a baby kangaroo called?",
      "english": "What is a baby kangaroo called?",
      "options": [
        "Joey",
        "Cub",
        "Calf",
        "Pup"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Joey."
    },
    {
      "question": "What is a baby deer called?",
      "english": "What is a baby deer called?",
      "options": [
        "Fawn",
        "Cub",
        "Kid",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Fawn."
    },
    {
      "question": "What is a baby rabbit called?",
      "english": "What is a baby rabbit called?",
      "options": [
        "Bunny",
        "Cub",
        "Pup",
        "Calf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Bunny."
    },
    {
      "question": "What is a baby fox called?",
      "english": "What is a baby fox called?",
      "options": [
        "Kit",
        "Cub",
        "Pup",
        "Calf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Kit."
    },
    {
      "question": "What is a baby wolf called?",
      "english": "What is a baby wolf called?",
      "options": [
        "Pup",
        "Cub",
        "Kid",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Pup."
    },
    {
      "question": "What is a baby chicken called?",
      "english": "What is a baby chicken called?",
      "options": [
        "Chick",
        "Duckling",
        "Cub",
        "Kit"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Chick."
    },
    {
      "question": "What is a baby duck called?",
      "english": "What is a baby duck called?",
      "options": [
        "Duckling",
        "Chick",
        "Cub",
        "Pup"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Duckling."
    },
    {
      "question": "What is a baby goose called?",
      "english": "What is a baby goose called?",
      "options": [
        "Gosling",
        "Duckling",
        "Chick",
        "Cub"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Gosling."
    },
    {
      "question": "What is a baby swan called?",
      "english": "What is a baby swan called?",
      "options": [
        "Cygnet",
        "Duckling",
        "Chick",
        "Pup"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Cygnet."
    },
    {
      "question": "What is a baby owl called?",
      "english": "What is a baby owl called?",
      "options": [
        "Owlet",
        "Chick",
        "Cub",
        "Kit"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Owlet."
    },
    {
      "question": "What is a baby eagle called?",
      "english": "What is a baby eagle called?",
      "options": [
        "Chick",
        "Cub",
        "Kit",
        "Pup"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Chick."
    },
    {
      "question": "What is a baby penguin called?",
      "english": "What is a baby penguin called?",
      "options": [
        "Chick",
        "Cub",
        "Pup",
        "Kit"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Chick."
    },
    {
      "question": "What is a baby frog called?",
      "english": "What is a baby frog called?",
      "options": [
        "Tadpole",
        "Fry",
        "Cub",
        "Pup"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Tadpole."
    },
    {
      "question": "What is a baby fish called?",
      "english": "What is a baby fish called?",
      "options": [
        "Fry",
        "Tadpole",
        "Cub",
        "Pup"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Fry."
    },
    {
      "question": "What is a baby shark called?",
      "english": "What is a baby shark called?",
      "options": [
        "Pup",
        "Cub",
        "Fry",
        "Calf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Pup."
    },
    {
      "question": "What is a baby whale called?",
      "english": "What is a baby whale called?",
      "options": [
        "Calf",
        "Cub",
        "Pup",
        "Kit"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Calf."
    },
    {
      "question": "What is a baby dolphin called?",
      "english": "What is a baby dolphin called?",
      "options": [
        "Calf",
        "Cub",
        "Pup",
        "Joey"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Calf."
    },
    {
      "question": "What is a baby turtle called?",
      "english": "What is a baby turtle called?",
      "options": [
        "Hatchling",
        "Cub",
        "Pup",
        "Fry"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Hatchling."
    },
    {
      "question": "What is a baby crocodile called?",
      "english": "What is a baby crocodile called?",
      "options": [
        "Hatchling",
        "Cub",
        "Pup",
        "Chick"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Hatchling."
    },
    {
      "question": "What is a baby alligator called?",
      "english": "What is a baby alligator called?",
      "options": [
        "Hatchling",
        "Cub",
        "Pup",
        "Kit"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Hatchling."
    },
    {
      "question": "What is a baby panda called?",
      "english": "What is a baby panda called?",
      "options": [
        "Cub",
        "Pup",
        "Calf",
        "Joey"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Cub."
    },
    {
      "question": "What is a baby bear called?",
      "english": "What is a baby bear called?",
      "options": [
        "Cub",
        "Kit",
        "Pup",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Cub."
    },
    {
      "question": "What is a baby zebra called?",
      "english": "What is a baby zebra called?",
      "options": [
        "Foal",
        "Calf",
        "Cub",
        "Kid"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Foal."
    },
    {
      "question": "What is a baby giraffe called?",
      "english": "What is a baby giraffe called?",
      "options": [
        "Calf",
        "Foal",
        "Cub",
        "Pup"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Calf."
    },
    {
      "question": "What is a baby camel called?",
      "english": "What is a baby camel called?",
      "options": [
        "Calf",
        "Cub",
        "Kid",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Calf."
    },
    {
      "question": "What is a baby monkey called?",
      "english": "What is a baby monkey called?",
      "options": [
        "Infant",
        "Cub",
        "Pup",
        "Calf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Infant."
    },
    {
      "question": "What is a baby seal called?",
      "english": "What is a baby seal called?",
      "options": [
        "Pup",
        "Cub",
        "Kit",
        "Calf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Pup."
    },
    {
      "question": "What is a baby bat called?",
      "english": "What is a baby bat called?",
      "options": [
        "Pup",
        "Cub",
        "Kit",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Pup."
    },
    {
      "question": "What is a baby pigeon called?",
      "english": "What is a baby pigeon called?",
      "options": [
        "Squab",
        "Chick",
        "Duckling",
        "Gosling"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Squab."
    },
    {
      "question": "What is a baby peacock called?",
      "english": "What is a baby peacock called?",
      "options": [
        "Peachick",
        "Chick",
        "Squab",
        "Kit"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Peachick."
    },
    {
      "question": "What is a baby turkey called?",
      "english": "What is a baby turkey called?",
      "options": [
        "Poult",
        "Chick",
        "Duckling",
        "Gosling"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Poult."
    },
    {
      "question": "What is a baby llama called?",
      "english": "What is a baby llama called?",
      "options": [
        "Cria",
        "Foal",
        "Kid",
        "Calf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Cria."
    },
    {
      "question": "What is a baby alpaca called?",
      "english": "What is a baby alpaca called?",
      "options": [
        "Cria",
        "Cub",
        "Pup",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Cria."
    },
    {
      "question": "What is a baby otter called?",
      "english": "What is a baby otter called?",
      "options": [
        "Kit",
        "Cub",
        "Pup",
        "Calf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Kit."
    },
    {
      "question": "What is a baby beaver called?",
      "english": "What is a baby beaver called?",
      "options": [
        "Kit",
        "Cub",
        "Pup",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Kit."
    },
    {
      "question": "What is a baby squirrel called?",
      "english": "What is a baby squirrel called?",
      "options": [
        "Kit",
        "Cub",
        "Pup",
        "Calf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Kit."
    },
    {
      "question": "What is a baby raccoon called?",
      "english": "What is a baby raccoon called?",
      "options": [
        "Kit",
        "Cub",
        "Pup",
        "Foal"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Kit."
    },
    {
      "question": "Which animal has a baby called a Joey?",
      "english": "Which animal has a baby called a Joey?",
      "options": [
        "Kangaroo",
        "Lion",
        "Elephant",
        "Tiger"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Kangaroo."
    },
    {
      "question": "Which animal has a baby called a Fawn?",
      "english": "Which animal has a baby called a Fawn?",
      "options": [
        "Deer",
        "Horse",
        "Goat",
        "Cow"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Deer."
    },
    {
      "question": "Which animal has a baby called a Piglet?",
      "english": "Which animal has a baby called a Piglet?",
      "options": [
        "Pig",
        "Goat",
        "Cow",
        "Sheep"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Pig."
    },
    {
      "question": "Which animal has a baby called a Cygnet?",
      "english": "Which animal has a baby called a Cygnet?",
      "options": [
        "Swan",
        "Duck",
        "Goose",
        "Owl"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Swan."
    },
    {
      "question": "Which animal has a baby called a Tadpole?",
      "english": "Which animal has a baby called a Tadpole?",
      "options": [
        "Frog",
        "Fish",
        "Snake",
        "Turtle"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Frog."
    },
    {
      "question": "Which animal has a baby called a Duckling?",
      "english": "Which animal has a baby called a Duckling?",
      "options": [
        "Duck",
        "Goose",
        "Swan",
        "Chicken"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Duck."
    },
    {
      "question": "Which animal has a baby called a Gosling?",
      "english": "Which animal has a baby called a Gosling?",
      "options": [
        "Goose",
        "Duck",
        "Swan",
        "Turkey"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Goose."
    },
    {
      "question": "Which animal has a baby called a Hatchling?",
      "english": "Which animal has a baby called a Hatchling?",
      "options": [
        "Turtle",
        "Cow",
        "Dog",
        "Horse"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Turtle."
    },
    {
      "question": "Which animal has a baby called a Calf?",
      "english": "Which animal has a baby called a Calf?",
      "options": [
        "Elephant",
        "Lion",
        "Tiger",
        "Wolf"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Elephant."
    },
    {
      "question": "Which animal has a baby called a Cub?",
      "english": "Which animal has a baby called a Cub?",
      "options": [
        "Lion",
        "Horse",
        "Goat",
        "Cow"
      ],
      "correctIndex": 0,
      "explanation": "The correct answer is Lion."
    }
  ]
};

const C = {
  accent: "#16a34a",
  accentLt: "#86efac",
  gold: "#eab308",
  border: "rgba(0,0,0,0.08)",
  text: "#1e293b",
  muted: "#64748b",
  card: "#ffffffed",
  correct: "#16a34a",
  correctBg: "#f0fdf4",
  wrong: "#dc2626",
  wrongBg: "#fef2f2"
};

export const config = {
  videoSrc: AnimalBabyVideo,
  topics: TOPICS,
  theme: C,
  title: "🐾 Animal Babies Quiz",
  loadingIcon: "🐾",
  loadingText: "Preparing animal baby questions",
  numQuestions: 5
};

export default function AnimalBabiesQuiz() {
  return (
    <VideoQuizTemplate {...config} />
  );
}
