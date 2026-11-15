import React, { useState, useEffect } from "react";
import VideoPage from "./VideoPage";
const EnergyVideo = "https://games.vrplay.in/videos/types_of_energy.mp4";

export default function TypesOfEnergyTVQuiz() {

  const [videoEnded, setVideoEnded] = useState(false);
  const [startQuiz, setStartQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [scoreHistory, setScoreHistory] = useState(JSON.parse(localStorage.getItem("energyQuizHistory") || "[]"));
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

  const QUESTIONS_PER_ATTEMPT = 15;

  /* ==========================================================
                SHUFFLE ARRAY (FISHER-YATES)
  ========================================================== */

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const QUESTION_BANK = [
  {
    question: "What is energy?",
    answer: "The ability to do work",
    options: [
      "The ability to do work",
      "A type of food",
      "A machine",
      "A building"
    ]
  },

  {
    question: "Why do we need energy?",
    answer: "To do work and perform activities",
    options: [
      "To do work and perform activities",
      "To change our name",
      "To make clouds",
      "To stop the Sun"
    ]
  },

  {
    question: "Energy helps us to...",
    answer: "Move and work",
    options: [
      "Move and work",
      "Stop breathing",
      "Freeze water",
      "Make mountains"
    ]
  },

  {
    question: "Without energy, what could happen?",
    answer: "Nothing could work",
    options: [
      "Nothing could work",
      "Everything becomes faster",
      "The Earth stops spinning",
      "The Moon disappears"
    ]
  },

  {
    question: "Which is the biggest natural source of light?",
    answer: "The Sun",
    options: [
      "The Sun",
      "The Moon",
      "A candle",
      "A torch"
    ]
  },

  {
    question: "Which type of energy helps us see objects?",
    answer: "Light Energy",
    options: [
      "Light Energy",
      "Heat Energy",
      "Sound Energy",
      "Chemical Energy"
    ]
  },

  {
    question: "Plants use sunlight to make...",
    answer: "Food",
    options: [
      "Food",
      "Water",
      "Plastic",
      "Metal"
    ]
  },

  {
    question: "Which of these gives natural light?",
    answer: "Sun",
    options: [
      "Sun",
      "Flashlight",
      "Television",
      "Battery"
    ]
  },

  {
    question: "Which device produces light?",
    answer: "Light bulb",
    options: [
      "Light bulb",
      "Fan",
      "Chair",
      "Book"
    ]
  },

  {
    question: "Which energy makes things warm?",
    answer: "Heat Energy",
    options: [
      "Heat Energy",
      "Wind Energy",
      "Mechanical Energy",
      "Sound Energy"
    ]
  },

  {
    question: "What helps us cook food?",
    answer: "Heat Energy",
    options: [
      "Heat Energy",
      "Sound Energy",
      "Light Energy",
      "Wind Energy"
    ]
  },

  {
    question: "Which appliance uses heat to bake food?",
    answer: "Oven",
    options: [
      "Oven",
      "Fan",
      "Television",
      "Speaker"
    ]
  },

  {
    question: "Which season makes us use heaters?",
    answer: "Winter",
    options: [
      "Winter",
      "Summer",
      "Spring",
      "Rainy"
    ]
  },

  {
    question: "Heat can boil...",
    answer: "Water",
    options: [
      "Water",
      "Wood",
      "Stone",
      "Glass"
    ]
  },

  {
    question: "Sound is produced when objects...",
    answer: "Vibrate",
    options: [
      "Vibrate",
      "Freeze",
      "Sleep",
      "Float"
    ]
  },

  {
    question: "Which musical instrument produces sound?",
    answer: "Guitar",
    options: [
      "Guitar",
      "Table",
      "Bottle",
      "Book"
    ]
  },

  {
    question: "Birds produce...",
    answer: "Sound Energy",
    options: [
      "Sound Energy",
      "Solar Energy",
      "Mechanical Energy",
      "Chemical Energy"
    ]
  },

  {
    question: "Which device plays music?",
    answer: "Speaker",
    options: [
      "Speaker",
      "Mirror",
      "Cup",
      "Plate"
    ]
  },

  {
    question: "Talking is an example of...",
    answer: "Sound Energy",
    options: [
      "Sound Energy",
      "Heat Energy",
      "Light Energy",
      "Wind Energy"
    ]
  },

  {
    question: "We use sound mainly for...",
    answer: "Communication",
    options: [
      "Communication",
      "Swimming",
      "Painting",
      "Sleeping"
    ]
  },
    {
    question: "Which type of energy powers lights and fans?",
    answer: "Electrical Energy",
    options: [
      "Electrical Energy",
      "Heat Energy",
      "Sound Energy",
      "Mechanical Energy"
    ]
  },

  {
    question: "Electricity helps us use...",
    answer: "Electrical appliances",
    options: [
      "Electrical appliances",
      "Trees",
      "Mountains",
      "Clouds"
    ]
  },

  {
    question: "Which appliance keeps food fresh?",
    answer: "Refrigerator",
    options: [
      "Refrigerator",
      "Speaker",
      "Television",
      "Oven"
    ]
  },

  {
    question: "Which device helps us cool a room?",
    answer: "Fan",
    options: [
      "Fan",
      "Heater",
      "Book",
      "Table"
    ]
  },

  {
    question: "Which device is commonly used to watch cartoons?",
    answer: "Television",
    options: [
      "Television",
      "Washing Machine",
      "Microwave",
      "Mixer"
    ]
  },

  {
    question: "Mobile phones need ______ to charge.",
    answer: "Electricity",
    options: [
      "Electricity",
      "Wind",
      "Sand",
      "Paper"
    ]
  },

  {
    question: "Computers work using...",
    answer: "Electrical Energy",
    options: [
      "Electrical Energy",
      "Wind Energy",
      "Water Energy",
      "Heat Energy"
    ]
  },

  {
    question: "Which energy powers a washing machine?",
    answer: "Electrical Energy",
    options: [
      "Electrical Energy",
      "Mechanical Energy",
      "Sound Energy",
      "Solar Energy"
    ]
  },

  {
    question: "Electrical energy makes our life...",
    answer: "Easier",
    options: [
      "Easier",
      "Harder",
      "Slower",
      "Darker"
    ]
  },

  {
    question: "Which of these usually needs electricity?",
    answer: "Laptop",
    options: [
      "Laptop",
      "Tree",
      "Rock",
      "Flower"
    ]
  },

  {
    question: "Mechanical energy is the energy of...",
    answer: "Moving objects",
    options: [
      "Moving objects",
      "Sleeping animals",
      "Still water",
      "Clouds"
    ]
  },

  {
    question: "Which vehicle uses mechanical energy while moving?",
    answer: "Car",
    options: [
      "Car",
      "Tree",
      "Rock",
      "Mountain"
    ]
  },

  {
    question: "Which of these uses mechanical energy?",
    answer: "Bicycle",
    options: [
      "Bicycle",
      "Book",
      "Pencil",
      "Bottle"
    ]
  },

  {
    question: "An airplane moves using...",
    answer: "Mechanical Energy",
    options: [
      "Mechanical Energy",
      "Light Energy",
      "Chemical Energy",
      "Sound Energy"
    ]
  },

  {
    question: "A moving train has...",
    answer: "Mechanical Energy",
    options: [
      "Mechanical Energy",
      "Light Energy",
      "Heat Energy",
      "Wind Energy"
    ]
  },

  {
    question: "Factory machines mostly use...",
    answer: "Mechanical Energy",
    options: [
      "Mechanical Energy",
      "Sound Energy",
      "Light Energy",
      "Solar Energy"
    ]
  },

  {
    question: "Whenever something moves, it has...",
    answer: "Mechanical Energy",
    options: [
      "Mechanical Energy",
      "Water Energy",
      "Heat Energy",
      "Sound Energy"
    ]
  },

  {
    question: "A rotating fan blade is an example of...",
    answer: "Mechanical Energy",
    options: [
      "Mechanical Energy",
      "Chemical Energy",
      "Solar Energy",
      "Wind Energy"
    ]
  },

  {
    question: "Which of these is a moving object?",
    answer: "Bicycle",
    options: [
      "Bicycle",
      "Wall",
      "Chair",
      "Book"
    ]
  },

  {
    question: "Which energy is related to motion?",
    answer: "Mechanical Energy",
    options: [
      "Mechanical Energy",
      "Chemical Energy",
      "Light Energy",
      "Heat Energy"
    ]
  },
    {
    question: "Chemical energy is stored in...",
    answer: "Food, fuel, and batteries",
    options: [
      "Food, fuel, and batteries",
      "Clouds and rain",
      "Glass and paper",
      "Rocks and sand"
    ]
  },

  {
    question: "Our body gets energy from...",
    answer: "Food",
    options: [
      "Food",
      "Plastic",
      "Metal",
      "Glass"
    ]
  },

  {
    question: "Which food gives us chemical energy?",
    answer: "Fruits",
    options: [
      "Fruits",
      "Stone",
      "Water bottle",
      "Brick"
    ]
  },

  {
    question: "Batteries store which type of energy?",
    answer: "Chemical Energy",
    options: [
      "Chemical Energy",
      "Light Energy",
      "Wind Energy",
      "Sound Energy"
    ]
  },

  {
    question: "Cars get energy from...",
    answer: "Petrol and diesel",
    options: [
      "Petrol and diesel",
      "Leaves",
      "Paper",
      "Glass"
    ]
  },

  {
    question: "Firewood contains...",
    answer: "Chemical Energy",
    options: [
      "Chemical Energy",
      "Mechanical Energy",
      "Sound Energy",
      "Light Energy"
    ]
  },

  {
    question: "Coal stores...",
    answer: "Chemical Energy",
    options: [
      "Chemical Energy",
      "Heat Energy",
      "Light Energy",
      "Wind Energy"
    ]
  },

  {
    question: "When we eat food, our body gets...",
    answer: "Energy",
    options: [
      "Energy",
      "Plastic",
      "Wood",
      "Metal"
    ]
  },

  {
    question: "Which of these stores chemical energy?",
    answer: "Battery",
    options: [
      "Battery",
      "Mirror",
      "Chair",
      "Notebook"
    ]
  },

  {
    question: "Fuel is mainly used to produce...",
    answer: "Energy",
    options: [
      "Energy",
      "Ice",
      "Clouds",
      "Paper"
    ]
  },

  {
    question: "Solar energy comes from...",
    answer: "The Sun",
    options: [
      "The Sun",
      "The Moon",
      "Stars",
      "Clouds"
    ]
  },

  {
    question: "Solar panels convert sunlight into...",
    answer: "Electricity",
    options: [
      "Electricity",
      "Rain",
      "Wind",
      "Snow"
    ]
  },

  {
    question: "Solar energy is...",
    answer: "Renewable",
    options: [
      "Renewable",
      "Non-renewable",
      "Artificial",
      "Stored"
    ]
  },

  {
    question: "Solar energy helps reduce...",
    answer: "Pollution",
    options: [
      "Pollution",
      "Homework",
      "Rainfall",
      "Mountains"
    ]
  },

  {
    question: "Which device collects sunlight?",
    answer: "Solar Panel",
    options: [
      "Solar Panel",
      "Speaker",
      "Television",
      "Fan"
    ]
  },

  {
    question: "Solar energy is considered...",
    answer: "Clean energy",
    options: [
      "Clean energy",
      "Dirty energy",
      "Waste energy",
      "Stored energy"
    ]
  },

  {
    question: "Which house can use sunlight to make electricity?",
    answer: "House with solar panels",
    options: [
      "House with solar panels",
      "House with candles",
      "House with books",
      "House with trees"
    ]
  },

  {
    question: "The Sun provides us with...",
    answer: "Light and heat",
    options: [
      "Light and heat",
      "Snow and ice",
      "Coal and oil",
      "Wind and rain"
    ]
  },

  {
    question: "Solar energy is best available during...",
    answer: "Sunny days",
    options: [
      "Sunny days",
      "Midnight",
      "Heavy storms",
      "Earthquakes"
    ]
  },

  {
    question: "Using solar energy helps protect...",
    answer: "The environment",
    options: [
      "The environment",
      "Plastic waste",
      "Traffic",
      "Buildings"
    ]
  },
    {
    question: "Wind energy is produced by...",
    answer: "Moving air",
    options: [
      "Moving air",
      "Sunlight",
      "Flowing water",
      "Coal"
    ]
  },

  {
    question: "Large wind turbines are used to generate...",
    answer: "Electricity",
    options: [
      "Electricity",
      "Food",
      "Heat only",
      "Rain"
    ]
  },

  {
    question: "Which energy source uses the power of the wind?",
    answer: "Wind Energy",
    options: [
      "Wind Energy",
      "Heat Energy",
      "Chemical Energy",
      "Light Energy"
    ]
  },

  {
    question: "Wind energy is a ______ source of energy.",
    answer: "Renewable",
    options: [
      "Renewable",
      "Non-renewable",
      "Stored",
      "Artificial"
    ]
  },

  {
    question: "Which structure has large rotating blades?",
    answer: "Wind Turbine",
    options: [
      "Wind Turbine",
      "Solar Panel",
      "Battery",
      "Speaker"
    ]
  },

  {
    question: "Wind turbines work best in places with...",
    answer: "Strong winds",
    options: [
      "Strong winds",
      "Heavy traffic",
      "Tall buildings",
      "Snow"
    ]
  },

  {
    question: "Wind energy helps reduce...",
    answer: "Pollution",
    options: [
      "Pollution",
      "Homework",
      "Trees",
      "Mountains"
    ]
  },

  {
    question: "Wind is a form of...",
    answer: "Moving air",
    options: [
      "Moving air",
      "Moving water",
      "Stored heat",
      "Sunlight"
    ]
  },

  {
    question: "Which of these is an example of wind energy?",
    answer: "Wind Turbine",
    options: [
      "Wind Turbine",
      "Campfire",
      "Battery",
      "Torch"
    ]
  },

  {
    question: "Wind energy is considered...",
    answer: "Clean Energy",
    options: [
      "Clean Energy",
      "Dirty Energy",
      "Waste Energy",
      "Stored Energy"
    ]
  },

  {
    question: "Hydroelectric energy comes from...",
    answer: "Moving water",
    options: [
      "Moving water",
      "Moving air",
      "Sunlight",
      "Coal"
    ]
  },

  {
    question: "Which structure stores water to generate electricity?",
    answer: "Dam",
    options: [
      "Dam",
      "Bridge",
      "School",
      "Tunnel"
    ]
  },

  {
    question: "A waterfall can help produce...",
    answer: "Hydroelectric Energy",
    options: [
      "Hydroelectric Energy",
      "Chemical Energy",
      "Sound Energy",
      "Heat Energy"
    ]
  },

  {
    question: "Hydroelectric power stations use...",
    answer: "Flowing water",
    options: [
      "Flowing water",
      "Dry sand",
      "Sunlight only",
      "Coal"
    ]
  },

  {
    question: "Hydroelectric energy is...",
    answer: "Renewable",
    options: [
      "Renewable",
      "Non-renewable",
      "Artificial",
      "Stored"
    ]
  },

  {
    question: "Which river feature is useful for hydroelectric power?",
    answer: "Fast-moving water",
    options: [
      "Fast-moving water",
      "Dry riverbed",
      "Ice",
      "Sand"
    ]
  },

  {
    question: "Hydroelectric energy helps produce...",
    answer: "Electricity",
    options: [
      "Electricity",
      "Plastic",
      "Paper",
      "Glass"
    ]
  },

  {
    question: "Which is one of the cleanest sources of energy?",
    answer: "Hydroelectric Energy",
    options: [
      "Hydroelectric Energy",
      "Coal",
      "Oil",
      "Diesel"
    ]
  },

  {
    question: "Water flowing through a dam spins...",
    answer: "Turbines",
    options: [
      "Turbines",
      "Fans",
      "Bicycles",
      "Speakers"
    ]
  },

  {
    question: "Which natural resource is used in hydroelectric power?",
    answer: "Water",
    options: [
      "Water",
      "Coal",
      "Wood",
      "Sand"
    ]
  },
    {
    question: "Which of these is a renewable source of energy?",
    answer: "Solar Energy",
    options: [
      "Solar Energy",
      "Coal",
      "Petrol",
      "Natural Gas"
    ]
  },

  {
    question: "Renewable energy sources can...",
    answer: "Be used again and again",
    options: [
      "Be used again and again",
      "Be used only once",
      "Never produce electricity",
      "Only work at night"
    ]
  },

  {
    question: "Which three energy sources are renewable?",
    answer: "Solar, Wind, and Water",
    options: [
      "Solar, Wind, and Water",
      "Coal, Oil, and Gas",
      "Wood, Coal, and Petrol",
      "Diesel, Oil, and Gas"
    ]
  },

  {
    question: "Renewable energy helps protect...",
    answer: "The environment",
    options: [
      "The environment",
      "Plastic waste",
      "Traffic",
      "Noise"
    ]
  },

  {
    question: "Which renewable energy source works on sunny days?",
    answer: "Solar Energy",
    options: [
      "Solar Energy",
      "Coal",
      "Petrol",
      "Diesel"
    ]
  },

  {
    question: "Which renewable energy source depends on moving air?",
    answer: "Wind Energy",
    options: [
      "Wind Energy",
      "Chemical Energy",
      "Heat Energy",
      "Light Energy"
    ]
  },

  {
    question: "Which renewable energy source depends on flowing water?",
    answer: "Hydroelectric Energy",
    options: [
      "Hydroelectric Energy",
      "Heat Energy",
      "Sound Energy",
      "Chemical Energy"
    ]
  },

  {
    question: "Renewable energy helps reduce...",
    answer: "Pollution",
    options: [
      "Pollution",
      "Homework",
      "Buildings",
      "Books"
    ]
  },

  {
    question: "Which of these is NOT renewable?",
    answer: "Coal",
    options: [
      "Coal",
      "Wind",
      "Sunlight",
      "Water"
    ]
  },

  {
    question: "Renewable energy is important because it...",
    answer: "Will not run out quickly",
    options: [
      "Will not run out quickly",
      "Creates more pollution",
      "Stops electricity",
      "Only works indoors"
    ]
  },

  {
    question: "Coal is a ______ source of energy.",
    answer: "Non-renewable",
    options: [
      "Non-renewable",
      "Renewable",
      "Natural light",
      "Mechanical"
    ]
  },

  {
    question: "Oil is a...",
    answer: "Non-renewable resource",
    options: [
      "Non-renewable resource",
      "Renewable resource",
      "Solar resource",
      "Wind resource"
    ]
  },

  {
    question: "Natural gas is...",
    answer: "A non-renewable energy source",
    options: [
      "A non-renewable energy source",
      "A renewable energy source",
      "A type of solar panel",
      "A type of wind turbine"
    ]
  },

  {
    question: "Non-renewable resources take...",
    answer: "Millions of years to form",
    options: [
      "Millions of years to form",
      "One day to form",
      "One week to form",
      "One month to form"
    ]
  },

  {
    question: "We should use coal carefully because it...",
    answer: "Can run out",
    options: [
      "Can run out",
      "Grows on trees",
      "Comes from the Sun",
      "Is made every day"
    ]
  },

  {
    question: "Which of these is NOT mentioned as renewable in the lesson?",
    answer: "Natural Gas",
    options: [
      "Natural Gas",
      "Solar Energy",
      "Wind Energy",
      "Hydroelectric Energy"
    ]
  },

  {
    question: "Which energy source is better for the future?",
    answer: "Renewable Energy",
    options: [
      "Renewable Energy",
      "Coal",
      "Oil",
      "Natural Gas"
    ]
  },

  {
    question: "Using renewable energy helps save...",
    answer: "Natural resources",
    options: [
      "Natural resources",
      "Homework",
      "Televisions",
      "Buildings"
    ]
  },

  {
    question: "Which of these should be used carefully because it is limited?",
    answer: "Coal",
    options: [
      "Coal",
      "Sunlight",
      "Wind",
      "Water"
    ]
  },

  {
    question: "Which statement is TRUE?",
    answer: "Renewable energy can be replaced naturally",
    options: [
      "Renewable energy can be replaced naturally",
      "Coal is renewable",
      "The Sun is non-renewable",
      "Wind energy comes from batteries"
    ]
  },
    {
    question: "Why should we save energy?",
    answer: "To protect our planet",
    options: [
      "To protect our planet",
      "To make electricity disappear",
      "To stop the Sun from shining",
      "To make machines heavier"
    ]
  },

  {
    question: "What should you do before leaving a room?",
    answer: "Turn off the lights",
    options: [
      "Turn off the lights",
      "Turn on every light",
      "Open the refrigerator",
      "Leave the TV on"
    ]
  },

  {
    question: "Which bulb saves more electricity?",
    answer: "LED bulb",
    options: [
      "LED bulb",
      "Broken bulb",
      "Paper lamp",
      "Candle"
    ]
  },

  {
    question: "For short distances, it is better to...",
    answer: "Walk or ride a bicycle",
    options: [
      "Walk or ride a bicycle",
      "Use an airplane",
      "Drive a truck",
      "Use a ship"
    ]
  },

  {
    question: "Saving energy helps reduce...",
    answer: "Pollution",
    options: [
      "Pollution",
      "Homework",
      "Books",
      "Trees"
    ]
  },

  {
    question: "Which action wastes electricity?",
    answer: "Leaving lights on when not needed",
    options: [
      "Leaving lights on when not needed",
      "Switching off lights",
      "Using sunlight",
      "Walking to school"
    ]
  },

  {
    question: "Using renewable energy is good for...",
    answer: "The Earth",
    options: [
      "The Earth",
      "Pollution",
      "Traffic",
      "Garbage"
    ]
  },

  {
    question: "Which of these is an energy-saving habit?",
    answer: "Switching off unused appliances",
    options: [
      "Switching off unused appliances",
      "Leaving fans running",
      "Keeping every light on",
      "Charging phones all day"
    ]
  },

  {
    question: "Food gives our body which type of energy?",
    answer: "Chemical Energy",
    options: [
      "Chemical Energy",
      "Light Energy",
      "Wind Energy",
      "Sound Energy"
    ]
  },

  {
    question: "Every movement we make uses...",
    answer: "Energy",
    options: [
      "Energy",
      "Water",
      "Paper",
      "Plastic"
    ]
  },

  {
    question: "The Sun provides enough energy to power...",
    answer: "The Earth every day",
    options: [
      "The Earth every day",
      "Only one city",
      "Only one country",
      "Only one house"
    ]
  },

  {
    question: "Wind turbines generate electricity without creating much...",
    answer: "Pollution",
    options: [
      "Pollution",
      "Wind",
      "Rain",
      "Sunlight"
    ]
  },

  {
    question: "Hydroelectric power uses the force of...",
    answer: "Flowing water",
    options: [
      "Flowing water",
      "Hot air",
      "Sand",
      "Coal"
    ]
  },

  {
    question: "Which energy source is best for a windy area?",
    answer: "Wind Energy",
    options: [
      "Wind Energy",
      "Coal",
      "Petrol",
      "Wood"
    ]
  },

  {
    question: "Which energy source is best for a sunny place?",
    answer: "Solar Energy",
    options: [
      "Solar Energy",
      "Coal",
      "Diesel",
      "Natural Gas"
    ]
  },

  {
    question: "Which energy source is best near a large river?",
    answer: "Hydroelectric Energy",
    options: [
      "Hydroelectric Energy",
      "Coal",
      "Oil",
      "Petrol"
    ]
  },

  {
    question: "Which of these is the cleanest choice?",
    answer: "Renewable Energy",
    options: [
      "Renewable Energy",
      "Coal",
      "Oil",
      "Diesel"
    ]
  },

  {
    question: "What happens if there is no energy?",
    answer: "Many things stop working",
    options: [
      "Many things stop working",
      "Everything becomes faster",
      "The Earth becomes bigger",
      "Trees stop growing instantly"
    ]
  },

  {
    question: "Energy is important because it helps us...",
    answer: "Live, work, and play",
    options: [
      "Live, work, and play",
      "Change the weather",
      "Move mountains",
      "Stop time"
    ]
  },

  {
    question: "Which sentence is correct?",
    answer: "Energy is all around us",
    options: [
      "Energy is all around us",
      "Energy exists only in batteries",
      "Only the Sun has energy",
      "Only machines use energy"
    ]
  }

];

const generateQuestionOptions = (question) => {
  return shuffleArray([...question.options]);

};

const getRandomQuestions = () => {
  const shuffledQuestions = shuffleArray(QUESTION_BANK);
  return shuffledQuestions
    .slice(0, QUESTIONS_PER_ATTEMPT)
    .map((question) => ({
      ...question,
      options: generateQuestionOptions(question),
    }));

};

/* ==========================================================
                START NEW QUIZ
========================================================== */

const beginQuiz = () => {
  const randomQuestions = getRandomQuestions();
  setQuestions(randomQuestions);
  setCurrentQuestion(0);
  setOptions(randomQuestions[0].options);
  setSelectedOption(0);
  setScore(0);
  setMessage("");
  setQuizCompleted(false);
  setStartQuiz(true);

};

/* ==========================================================
          GO TO NEXT QUESTION
========================================================== */

const moveToNextQuestion = (selectedAnswer) => {
  const current = questions[currentQuestion];
  const isCorrect = selectedAnswer === current.answer;
  const updatedScore = isCorrect ? score + 1 : score;
  if (answered) return;
  setAnswered(true);

  if (isCorrect) {
    setScore(updatedScore);
    setMessage("✅ Correct!");
  } else {
    setMessage(`❌ Correct Answer: ${current.answer}`);
  }

  setTimeout(() => {
    const nextQuestion =
      currentQuestion + 1;
    if (nextQuestion >= QUESTIONS_PER_ATTEMPT) {
      const history = [
        {
          score: updatedScore,
          total: QUESTIONS_PER_ATTEMPT,
          date:new Date().toLocaleString(),
        },
        ...scoreHistory,
      ];
      setScoreHistory(history);
      localStorage.setItem("energyQuizHistory",JSON.stringify(history));
      setQuizCompleted(true);
      return;
    }

    setCurrentQuestion(nextQuestion);
    setOptions(questions[nextQuestion].options);
    setSelectedOption(0);
    setMessage("");
    setAnswered(false);
  }, 1200);

};

const getPerformanceText = () => {
  if (score === QUESTIONS_PER_ATTEMPT) {
    return "🏆 Energy Master!";
  }
  if (score >= 13) {
    return "⭐⭐⭐ Excellent!";
  }
  if (score >= 10) {
    return "⭐⭐ Very Good!";
  }
  if (score >= 7) {
    return "⭐ Good Job!";
  }
  return "💪 Keep Learning!";
};

useEffect(() => {
  const handleKeyDown = (event) => {
    if (videoEnded && !startQuiz && event.key === "Enter") {
      beginQuiz();
      return;
    }

    if (startQuiz && !quizCompleted) {
      if (event.key === "ArrowUp") {
        setSelectedOption((previous) => previous === 0 ? options.length - 1 : previous - 1);
      }

      if (event.key === "ArrowDown") {
        setSelectedOption((previous) => previous === options.length - 1 ? 0 : previous + 1);
      }

      if (event.key === "ArrowLeft") {
        setSelectedOption((previous) => previous === 0 ? options.length - 1 : previous - 1);
      }
      if (event.key === "ArrowRight") {
        setSelectedOption((previous) => previous === options.length - 1 ? 0 : previous + 1);
      }

      if (event.key === "Enter") {
        moveToNextQuestion(options[selectedOption]);
      }

    }

    /* =====================================
            RESULT SCREEN
    ===================================== */

    if (quizCompleted &&event.key === "Enter") {
      beginQuiz();
    }
  };

  window.addEventListener("keydown",handleKeyDown);
  return () =>
    window.removeEventListener("keydown",handleKeyDown);
}, [videoEnded,startQuiz,quizCompleted,selectedOption,options,questions,currentQuestion,score]);

/* ==========================================================
                    VIDEO SCREEN
========================================================== */

if (!videoEnded) {
  return (
    <VideoPage
      videoSrc={EnergyVideo}
      theme={{
        accent: "#0f766e",
        accentLt: "#14b8a6",
        gold: "#f59e0b",
        correct: "#22c55e",
        wrong: "#ef4444",
        text: "#f8fafc",
        muted: "#cbd5e1",
        border: "rgba(255,255,255,0.08)"
      }}
      title="Types of Energy Quiz"
      onDone={() => setVideoEnded(true)}
    />
  );
}

/* ==========================================================
                    START QUIZ SCREEN
========================================================== */

if (!startQuiz) {
  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:"linear-gradient(135deg,#020617,#0f172a,#1e3a8a,#065f46)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* ================= Background Glow ================= */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:"radial-gradient(circle at 20% 20%,rgba(251,191,36,.18),transparent 30%),radial-gradient(circle at 80% 30%,rgba(56,189,248,.18),transparent 35%),radial-gradient(circle at 50% 80%,rgba(34,197,94,.18),transparent 35%)"
        }}
      />

      {/* ================= Floating Icons ================= */}

      <div style={{
        position:"absolute",
        top:"8%",
        left:"8%",
        fontSize:"75px"
      }}>
        ☀️
      </div>

      <div style={{
        position:"absolute",
        top:"15%",
        right:"10%",
        fontSize:"70px"
      }}>
        ⚡
      </div>

      <div style={{
        position:"absolute",
        bottom:"12%",
        left:"10%",
        fontSize:"70px"
      }}>
        🌊
      </div>

      <div style={{
        position:"absolute",
        bottom:"14%",
        right:"8%",
        fontSize:"70px"
      }}>
        💨
      </div>

      <div style={{
        position:"absolute",
        top:"45%",
        left:"5%",
        fontSize:"60px"
      }}>
        🔋
      </div>

      <div style={{
        position:"absolute",
        top:"50%",
        right:"5%",
        fontSize:"60px"
      }}>
        💡
      </div>

      {/* ================= Main Card ================= */}

      <div
        style={{
          width:"1000px",
          maxWidth:"92%",
          maxHeight:"700px",
          background:"rgba(255,255,255,.08)",
          backdropFilter:"blur(18px)",
          borderRadius:"35px",
          border:"2px solid rgba(255,255,255,.15)",
          boxShadow:"0 0 45px rgba(59,130,246,.35)",
          padding:"60px",
          textAlign:"center",
          zIndex:5
        }}
      >

        <h1
          style={{
            fontSize:"62px",
            color:"#fde047",
            marginBottom:"20px",
            fontWeight:"900",
            textShadow:"0 0 25px rgba(250,204,21,.7)"
          }}
        >
          ⚡ Types of Energy Quiz
        </h1>

        <h2
          style={{
            color:"#bfdbfe",
            fontSize:"30px",
            marginBottom:"22px",
            fontWeight:"600"
          }}
        >
          Watch • Learn • Play • Master Energy
        </h2>

        <p
          style={{
            fontSize:"24px",
            color:"#e2e8f0",
            lineHeight:"42px",
            marginBottom:"45px"
          }}
        >
          ✅ 15 Random Questions Every Attempt
          <br/>
          ✅ Random Answer Options
          <br/>
          ✅ Learn While Playing
          <br/>
          ✅ Test Your Energy Knowledge
        </p>

        {/* ================= START BUTTON ================= */}

        <div
          onClick={beginQuiz}
          style={{
            width:"420px",
            margin:"0 auto",
            padding:"24px",
            borderRadius:"24px",
            background:"linear-gradient(135deg,#f59e0b,#ea580c)",
            fontSize:"36px",
            fontWeight:"900",
            cursor:"pointer",
            color:"#fff",
            boxShadow:"0 0 35px rgba(249,115,22,.7)",
            marginBottom:"30px",
            border:"3px solid rgba(255,255,255,.25)"
          }}
        >
          ▶ START QUIZ
        </div>

        {/* ================= WATCH VIDEO ================= */}

        <div
          onClick={() => {
            setVideoEnded(false);
            setStartQuiz(false);
          }}
          style={{
            width:"420px",
            margin:"0 auto",
            padding:"22px",
            borderRadius:"22px",
            background:"linear-gradient(135deg,#2563eb,#1d4ed8)",
            fontSize:"30px",
            fontWeight:"800",
            cursor:"pointer",
            color:"#fff",
            boxShadow:"0 0 30px rgba(37,99,235,.6)",
            border:"3px solid rgba(255,255,255,.2)"
          }}
        >
          🎥 WATCH VIDEO AGAIN
        </div>

        <div
          style={{
            marginTop:"45px",
            fontSize:"22px",
            color:"#cbd5e1"
          }}
        >
          🎮 TV Remote Controls
          <br/><br/>
          ⬆ ⬇ Select Option
          <br/>
          OK / ENTER = Confirm Answer
        </div>
      </div>
    </div>
  );
}
/* ==========================================================
                    RESULT SCREEN
========================================================== */

if (quizCompleted) {

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background:"linear-gradient(135deg,#020617,#0f172a,#1d4ed8,#065f46)",
        fontFamily: "Poppins, sans-serif",
        color: "#fff",
        padding: "30px"
      }}
    >
      {/* ================= Background Glow ================= */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:"radial-gradient(circle at 20% 20%,rgba(250,204,21,.15),transparent 35%),radial-gradient(circle at 80% 30%,rgba(59,130,246,.18),transparent 35%),radial-gradient(circle at 50% 90%,rgba(34,197,94,.15),transparent 40%)"
        }}
      />
      {/* ================= Floating Icons ================= */}

      <div style={{
        position:"absolute",
        top:"6%",
        left:"8%",
        fontSize:"70px"
      }}>
        ⚡
      </div>

      <div style={{
        position:"absolute",
        top:"12%",
        right:"10%",
        fontSize:"70px"
      }}>
        ☀️
      </div>

      <div style={{
        position:"absolute",
        bottom:"12%",
        left:"8%",
        fontSize:"65px"
      }}>
        🌊
      </div>

      <div style={{
        position:"absolute",
        bottom:"12%",
        right:"10%",
        fontSize:"65px"
      }}>
        💨
      </div>

      {/* ================= Main Card ================= */}

      <div
        style={{
          width:"900px",
          maxWidth:"95%",
          background:"rgba(255,255,255,.08)",
          backdropFilter:"blur(18px)",
          borderRadius:"35px",
          border:"2px solid rgba(255,255,255,.15)",
          padding:"45px",
          textAlign:"center",
          boxShadow:"0 0 45px rgba(59,130,246,.35)",
          zIndex:10
        }}
      >
        <h1
          style={{
            fontSize:"62px",
            color:"#fde047",
            marginBottom:"20px",
            fontWeight:"900",
            textShadow:"0 0 25px rgba(250,204,21,.7)"
          }}
        >
          🎉 Quiz Completed
        </h1>

        {/* ================= SCORE CIRCLE ================= */}

        <div
          style={{
            width:"230px",
            height:"230px",
            margin:"25px auto",
            borderRadius:"50%",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            background:"linear-gradient(135deg,#22c55e,#15803d)",
            border:"8px solid rgba(255,255,255,.25)",
            fontSize:"58px",
            fontWeight:"900",
            color:"#fff",
            boxShadow:"0 0 45px rgba(34,197,94,.8)"
          }}
        >
          {score}/{QUESTIONS_PER_ATTEMPT}
        </div>

        {/* ================= PERFORMANCE ================= */}

        <div
          style={{
            fontSize:"40px",
            color:"#38bdf8",
            fontWeight:"800",
            marginBottom:"35px"
          }}
        >
          {getPerformanceText()}
        </div>

        {/* ================= BUTTONS ================= */}

        <div
          style={{
            display:"flex",
            justifyContent:"center",
            gap:"25px",
            flexWrap:"wrap"
          }}
        >
          {/* PLAY AGAIN */}
          <div
            onClick={beginQuiz}
            style={{
              padding:"20px 42px",
              borderRadius:"22px",
              background:"linear-gradient(135deg,#22c55e,#16a34a)",
              fontSize:"28px",
              fontWeight:"800",
              cursor:"pointer",
              boxShadow:"0 0 30px rgba(34,197,94,.7)",
              border:"3px solid rgba(255,255,255,.2)"
            }}
          >
            🔄 PLAY AGAIN
          </div>

          {/* WATCH VIDEO */}

          <div
            onClick={() => {
              setVideoEnded(false);
              setStartQuiz(false);
              setQuizCompleted(false);
            }}

            style={{
              padding:"20px 42px",
              borderRadius:"22px",
              background:"linear-gradient(135deg,#2563eb,#1d4ed8)",
              fontSize:"28px",
              fontWeight:"800",
              cursor:"pointer",
              boxShadow:"0 0 30px rgba(37,99,235,.7)",
              border:"3px solid rgba(255,255,255,.2)"
            }}
          >
            🎥 WATCH VIDEO AGAIN
          </div>
        </div>
      </div>
    </div>
  );
}

      {/* =====================================================
                      QUIZ HISTORY
      ===================================================== */}

      <div
        style={{
          width: "900px",
          maxWidth: "95%",
          marginTop: "35px",
          background: "rgba(255,255,255,.08)",
          backdropFilter: "blur(16px)",
          borderRadius: "30px",
          border: "2px solid rgba(255,255,255,.15)",
          padding: "25px",
          boxShadow: "0 0 30px rgba(59,130,246,.25)",
          zIndex: 10,
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#fde047",
            fontSize: "36px",
            marginBottom: "25px",
            fontWeight: "800",
          }}
        >
          📊 Quiz History
        </h2>

        {scoreHistory.length === 0 ? (

          <div
            style={{
              textAlign: "center",
              fontSize: "24px",
              color: "#cbd5e1",
              padding: "25px",
            }}
          >
            No previous quiz attempts.
          </div>

        ) : (

          <div
            style={{
              maxHeight: "320px",
              overflowY: "auto",
              paddingRight: "8px",
            }}
          >

            {scoreHistory.map((item, index) => (

              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 22px",
                  marginBottom: "14px",
                  borderRadius: "18px",
                  background:"linear-gradient(135deg,rgba(37,99,235,.22),rgba(34,197,94,.18))",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
              >

                {/* Attempt */}

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#ffffff",
                    width: "180px",
                  }}
                >
                  Attempt #{scoreHistory.length - index}
                </div>

                {/* Score */}

                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: "900",
                    color:item.score >= 13 ? "#4ade80" : item.score >= 10 ? "#facc15" : "#fb7185",
                    width: "130px",
                    textAlign: "center",
                  }}
                >
                  {item.score}/{item.total}
                </div>

                {/* Percentage */}

                <div
                  style={{
                    width: "130px",
                    textAlign: "center",
                    color: "#93c5fd",
                    fontWeight: "700",
                    fontSize: "22px",
                  }}
                >
                  {Math.round(
                    (item.score / item.total) * 100
                  )}
                  %
                </div>

                {/* Date */}

                <div
                  style={{
                    width: "260px",
                    textAlign: "right",
                    color: "#cbd5e1",
                    fontSize: "17px",
                  }}
                >
                  {item.date}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>
/* ==========================================================
                    QUIZ SCREEN
                    PART 3C-1A
========================================================== */

const current = questions[currentQuestion];
return (
<div
  style={{
    minHeight: "100vh",
    position: "relative",
    // overflow: "hidden",
    overflowY: "auto",
    overflowX: "hidden",
    background:"linear-gradient(135deg,#020617,#0f172a,#1e3a8a,#065f46)",
    fontFamily: "Poppins, sans-serif",
    color: "#ffffff",
    padding: "30px"
  }}
>

  {/* ==========================================
            Animated Background Glow
  ========================================== */}

  <div
    style={{
      position: "absolute",
      inset: 0,
      background:"radial-gradient(circle at 15% 20%,rgba(250,204,21,.15),transparent 35%),radial-gradient(circle at 85% 20%,rgba(59,130,246,.18),transparent 35%),radial-gradient(circle at 50% 80%,rgba(34,197,94,.18),transparent 40%)"
    }}
  />

  {/* ==========================================
            Floating Energy Icons
  ========================================== */}

  <div
    style={{
      position:"absolute",
      top:"4%",
      left:"4%",
      fontSize:"70px",
      opacity:.9
    }}
  >
    ☀️
  </div>

  <div
    style={{
      position:"absolute",
      top:"8%",
      right:"6%",
      fontSize:"70px",
      opacity:.9
    }}
  >
    ⚡
  </div>
  <div
    style={{
      position:"absolute",
      bottom:"8%",
      left:"5%",
      fontSize:"65px",
      opacity:.9
    }}
  >
    🌊
  </div>

  <div
    style={{
      position:"absolute",
      bottom:"10%",
      right:"6%",
      fontSize:"65px",
      opacity:.9
    }}
  >
    💨
  </div>

  <div
    style={{
      position:"absolute",
      top:"42%",
      left:"3%",
      fontSize:"55px",
      opacity:.75
    }}
  >
    🔋
  </div>

  <div
    style={{
      position:"absolute",
      top:"45%",
      right:"3%",
      fontSize:"55px",
      opacity:.75
    }}
  >
    💡
  </div>

  {/* ==========================================
                  HEADER
  ========================================== */}

  <div
    style={{
      position:"relative",
      zIndex:5,
      textAlign:"center",
      marginBottom:"25px"
    }}
  >
    <h1
      style={{
        margin:0,
        fontSize: isMobile ? "30px" : "55px",
        fontWeight:"900",
        color:"#fde047",
        textShadow:"0 0 20px rgba(250,204,21,.7)"
      }}
    >
      ⚡ Types of Energy Quiz
    </h1>

    <div
      style={{
        marginTop:"15px",
        fontSize: isMobile ? "18px" : "26px",
        color:"#bfdbfe",
        fontWeight:"600"
      }}
    >
      Question {currentQuestion + 1}
      {" / "}
      {QUESTIONS_PER_ATTEMPT}
    </div>

  </div>

  {/* ==========================================
            MAIN QUIZ CARD
  ========================================== */}

  <div
    style={{
      position: "relative",
      zIndex: 5,
      width: "100%",
      height:"650px",
      maxWidth: isMobile ? "100%" : "980px",
      minHeight: isMobile ? "auto" : "70vh",
      padding: isMobile ? "15px" : "20px",
      boxSizing: "border-box",
      overflowY:"hidden",
      margin: "0 auto",
      background: "rgba(255,255,255,.08)",
      backdropFilter: "blur(18px)",
      borderRadius: "30px",
      border: "2px solid rgba(255,255,255,.15)",
      boxShadow:"0 0 40px rgba(59,130,246,.35)",
    }}
  >
    {/* =====================================
              Progress Bar
    ===================================== */}

    <div style={{marginBottom: "35px"}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px"
        }}
      >
        <span
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#cbd5e1"
          }}
        >
          Quiz Progress
        </span>

        <span
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#fde047"
          }}
        >
          {Math.round(((currentQuestion + 1) / QUESTIONS_PER_ATTEMPT) * 100)}
          %
        </span>

      </div>

      {/* Progress Background */}

      <div
        style={{
          width: "100%",
          height: "18px",
          borderRadius: "20px",
          background:"rgba(255,255,255,.15)",
          overflow: "hidden"
        }}
      >
        {/* Progress Fill */}
        <div
          style={{
            width: `${((currentQuestion + 1) / QUESTIONS_PER_ATTEMPT) * 100}%`,
            height: "100%",
            borderRadius: "20px",
            background:"linear-gradient(90deg,#22c55e,#facc15,#3b82f6)",
            transition:"width .4s ease"
          }}
        />
      </div>
    </div>
    {/* =====================================
          Question Container
    ===================================== */}
    <div
      style={{
        background:"rgba(15,23,42,.55)",
        borderRadius: "25px",
        padding: "20px",
        border:"1px solid rgba(255,255,255,.12)",
        marginBottom: "18px",
      }}
    >
      {/* =====================================
              QUESTION
      ===================================== */}

      <h2
        style={{
          fontSize: isMobile ? "18px" : "26px",
          marginBottom: "15px",
          fontWeight: "800",
          lineHeight: "1.3",
          textAlign: "center",
          color: "#ffffff",
          textShadow: "0 0 12px rgba(255,255,255,.2)"
        }}
      >
        {current.question}
      </h2>
      {/* =====================================
                OPTIONS
      ===================================== */}
      <div>
        {options.map((option, index) => (
          <div
            key={index}    
              onClick={() => {
              setSelectedOption(index);
              moveToNextQuestion(option);
            }}
            style={{
              padding: isMobile ? "12px" : "14px 18px",
              fontSize: isMobile ? "15px" : "20px",
              gap: isMobile ? "10px" : "5px",
              marginBottom: "10px",
              borderRadius: "20px",
              fontWeight: "700",
              cursor: "pointer",
              userSelect: "none",
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
              transition: "all .25s ease",
              background: selectedOption === index ? "linear-gradient(135deg,#facc15,#f59e0b)" : "rgba(255,255,255,.08)",
              color: selectedOption === index ? "#111827" : "#ffffff",
              border: selectedOption === index ? "3px solid #ffffff" : "2px solid rgba(255,255,255,.12)",
              transform: selectedOption === index ? "scale(1.03)" : "scale(1)",
              boxShadow: selectedOption === index ? "0 0 25px rgba(250,204,21,.7)" : "none",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: isMobile ? "30px" : "30px",
                height: isMobile ? "30px" : "15px",
                fontSize: isMobile ? "14px" : "18px",
                borderRadius: "50%",
                background: selectedOption === index ? "#ffffff" : "rgba(255,255,255,.15)",
                color: selectedOption === index ? "#111827" : "#ffffff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "900",
                flexShrink: 0
              }}
            >
              {String.fromCharCode(65 + index)}
            </div>
           <div style={{flex: 1}}>{option}</div>
            {selectedOption === index && (
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "900"
                }}
              >
                ►
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    {/* =====================================
            FEEDBACK MESSAGE
    ===================================== */}

    <div
      style={{
        minHeight: "45px",
        textAlign: "center",
        fontSize: isMobile ? "18px" : "28px",
        fontWeight: "800",
        color: message.startsWith("✅") ? "#4ade80" : "#f87171",
        marginBottom: "20px",
        transition: "all .3s ease"
      }}
    >
      {message}
    </div>
    </div>
</div>
);
}
