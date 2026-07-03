import { useState, useEffect, useRef, useCallback } from "react";

const GAME_SIZE = 15;

const BANK = [
  { category: "Vegetables", odd: "🎸 Guitar", items: ["🥕 Carrot", "🥦 Broccoli", "🌽 Corn", "🍅 Tomato", "🥔 Potato", "🧅 Onion", "🥬 Lettuce", "🫑 Capsicum", "🎸 Guitar"] },
  { category: "Birds", odd: "🚗 Car", items: ["🦅 Eagle", "🦜 Parrot", "🦉 Owl", "🐦 Sparrow", "🦆 Duck", "🦢 Swan", "🐧 Penguin", "🦩 Flamingo", "🚗 Car"] },
  { category: "Fish & Sea", odd: "📱 Mobile", items: ["🐟 Goldfish", "🦈 Shark", "🐠 Clownfish", "🐡 Pufferfish", "🐬 Dolphin", "🐋 Whale", "🦑 Squid", "🦐 Shrimp", "📱 Mobile"] },
  { category: "Flowers", odd: "🏀 Basketball", items: ["🌹 Rose", "🌻 Sunflower", "🌷 Tulip", "🌺 Hibiscus", "🌼 Daisy", "🪷 Lotus", "💐 Bouquet", "🌸 Cherry Blossom", "🏀 Basketball"] },
  { category: "Trees", odd: "🍔 Burger", items: ["🌳 Oak", "🌴 Palm", "🎄 Pine", "🌲 Fir", "🌿 Neem", "🍁 Maple", "🌱 Bamboo", "🌵 Cactus", "🍔 Burger"] },
  { category: "Desserts", odd: "🚲 Cycle", items: ["🍰 Cake", "🧁 Cupcake", "🍩 Donut", "🍪 Cookie", "🍨 Ice Cream", "🍫 Chocolate", "🥧 Pie", "🍮 Pudding", "🚲 Cycle"] },
  { category: "Fast Food", odd: "🐘 Elephant", items: ["🍔 Burger", "🍕 Pizza", "🌭 Hot Dog", "🍟 Fries", "🌮 Taco", "🥪 Sandwich", "🌯 Burrito", "🥙 Wrap", "🐘 Elephant"] },
  { category: "Drinks", odd: "🚀 Rocket", items: ["☕ Coffee", "🍵 Tea", "🥤 Soda", "🧃 Juice", "🥛 Milk", "🍹 Cocktail", "🧋 Bubble Tea", "💧 Water", "🚀 Rocket"] },
  { category: "Superheroes", odd: "🍌 Banana", items: ["🦸 Superman", "🦇 Batman", "🕷️ Spider-Man", "⚡ Flash", "🛡️ Captain America", "🔨 Thor", "🟢 Hulk", "🖤 Black Panther", "🍌 Banana"] },
  { category: "Cartoons", odd: "🚂 Train", items: ["🐭 Mickey", "🧽 SpongeBob", "🐱 Tom", "🐭 Jerry", "🦆 Donald", "🐰 Bugs Bunny", "🐼 Po", "🐯 Tigger", "🚂 Train"] },
  { category: "Movies", odd: "🍎 Apple", items: ["🎬 Avatar", "🦖 Jurassic Park", "🚢 Titanic", "🦁 Lion King", "🚀 Interstellar", "🧙 Harry Potter", "🤖 Transformers", "🕷️ Spider-Man NWH", "🍎 Apple"] },
  { category: "Video Games", odd: "🍍 Pineapple", items: ["🎮 Minecraft", "⚔️ PUBG", "🏎️ Asphalt", "🔫 Valorant", "🧱 Tetris", "🧟 Resident Evil", "🏰 Clash Royale", "🐉 Pokémon", "🍍 Pineapple"] },
  { category: "Mobile Apps", odd: "🦁 Lion", items: ["📸 Instagram", "💬 WhatsApp", "🎵 Spotify", "📺 YouTube", "✉️ Gmail", "🎬 Netflix", "🗺️ Maps", "📘 Facebook", "🦁 Lion"] },
  { category: "Prog. Languages", odd: "🍕 Pizza", items: ["☕ Java", "🐍 Python", "📜 JavaScript", "💠 C++", "🔷 C#", "🐘 PHP", "💎 Ruby", "🦀 Rust", "🍕 Pizza"] },
  { category: "Databases", odd: "🐯 Tiger", items: ["🗄️ MySQL", "🐘 PostgreSQL", "🍃 MongoDB", "🔥 Firebase", "📊 Oracle", "💠 SQL Server", "🪶 SQLite", "🌐 Cassandra", "🐯 Tiger"] },
  { category: "Web Tech", odd: "🚢 Ship", items: ["🌐 HTML", "🎨 CSS", "⚡ JavaScript", "⚛️ React", "🟩 Node.js", "🔥 Angular", "💚 Vue", "🌱 Spring", "🚢 Ship"] },
  { category: "Cloud Platforms", odd: "🍇 Grapes", items: ["☁️ AWS", "☁️ Azure", "☁️ GCP", "☁️ Alibaba Cloud", "☁️ IBM Cloud", "☁️ DigitalOcean", "☁️ Heroku", "☁️ Vercel", "🍇 Grapes"] },
  { category: "AI Tools", odd: "🐵 Monkey", items: ["🤖 ChatGPT", "🎨 Midjourney", "📷 DALL-E", "🧠 Claude", "🔍 Perplexity", "🎬 Runway", "🎤 ElevenLabs", "📊 Gemini", "🐵 Monkey"] },
  { category: "Operating Systems", odd: "🍩 Donut", items: ["🪟 Windows", "🐧 Linux", "🍎 macOS", "🤖 Android", "📱 iOS", "🟠 Ubuntu", "🎩 Red Hat", "🐧 Debian", "🍩 Donut"] },
  { category: "Countries in Asia", odd: "🚲 Cycle", items: ["🇮🇳 India", "🇯🇵 Japan", "🇨🇳 China", "🇰🇷 Korea", "🇹🇭 Thailand", "🇮🇩 Indonesia", "🇸🇬 Singapore", "🇻🇳 Vietnam", "🚲 Cycle"] },
  { category: "World Capitals", odd: "🐘 Elephant", items: ["🏛️ New Delhi", "🗼 Tokyo", "🏰 Paris", "🎡 London", "🦘 Canberra", "🌉 Ottawa", "🕌 Ankara", "🏙️ Seoul", "🐘 Elephant"] },
  { category: "Major Rivers", odd: "📱 Phone", items: ["🌊 Ganga", "🌊 Nile", "🌊 Amazon", "🌊 Yangtze", "🌊 Mississippi", "🌊 Danube", "🌊 Volga", "🌊 Thames", "📱 Phone"] },
  { category: "Mountains", odd: "🍔 Burger", items: ["⛰️ Everest", "⛰️ K2", "⛰️ Kanchenjunga", "⛰️ Kilimanjaro", "⛰️ Denali", "⛰️ Elbrus", "⛰️ Annapurna", "⛰️ Fuji", "🍔 Burger"] },
  { category: "Oceans & Seas", odd: "⚽ Football", items: ["🌊 Pacific", "🌊 Atlantic", "🌊 Indian", "🌊 Arctic", "🌊 Southern", "🌊 Mediterranean", "🌊 Caribbean", "🌊 Coral Sea", "⚽ Football"] },
  { category: "Famous Scientists", odd: "🚗 Car", items: ["🧪 Einstein", "🍎 Newton", "⚡ Tesla", "🔬 Curie", "🌍 Galileo", "🧬 Darwin", "📡 Hawking", "⚛️ Bohr", "🚗 Car"] },
  { category: "Great Inventors", odd: "🍕 Pizza", items: ["💡 Edison", "📞 Bell", "✈️ Wright Brothers", "📻 Marconi", "🖥️ Babbage", "🎞️ Lumiere", "🧮 Pascal", "⚙️ Watt", "🍕 Pizza"] },
  { category: "Space Objects", odd: "🍔 Burger", items: ["🌍 Earth", "🌙 Moon", "☀️ Sun", "☄️ Comet", "🛰️ Satellite", "🌌 Galaxy", "🪐 Planet", "⭐ Star", "🍔 Burger"] },
  { category: "School Subjects", odd: "🐯 Tiger", items: ["➕ Math", "🔬 Science", "📚 English", "🌍 Geography", "🏺 History", "💻 Computer", "🎨 Art", "🎵 Music", "🐯 Tiger"] },
  { category: "Sports Equipment", odd: "🍎 Apple", items: ["🏏 Bat", "⚽ Ball", "🎾 Racket", "🏑 Stick", "🥊 Gloves", "🏀 Hoop", "🏸 Shuttle", "🏐 Net", "🍎 Apple"] },
  { category: "Music Instruments", odd: "🚂 Train", items: ["🎸 Guitar", "🥁 Drum", "🎹 Piano", "🎻 Violin", "🎷 Saxophone", "🎺 Trumpet", "🪈 Flute", "🪕 Banjo", "🚂 Train"] },
  { category: "Animals – Mammals", odd: "🚀 Rocket", items: ["🐘 Elephant", "🦁 Lion", "🐯 Tiger", "🦓 Zebra", "🦒 Giraffe", "🐻 Bear", "🦊 Fox", "🐺 Wolf", "🚀 Rocket"] },
  { category: "Reptiles", odd: "☕ Coffee", items: ["🐊 Crocodile", "🦎 Lizard", "🐍 Snake", "🐢 Turtle", "🦖 Komodo", "🐉 Dragon", "🦕 Iguana", "🐸 Gecko", "☕ Coffee"] },
  { category: "Insects", odd: "🚗 Car", items: ["🐝 Bee", "🦋 Butterfly", "🐞 Ladybug", "🐜 Ant", "🦗 Cricket", "🐛 Caterpillar", "🦟 Mosquito", "🪲 Beetle", "🚗 Car"] },
  { category: "Fruits", odd: "🎸 Guitar", items: ["🍎 Apple", "🍌 Banana", "🍇 Grapes", "🍊 Orange", "🍋 Lemon", "🍓 Strawberry", "🍑 Peach", "🍍 Pineapple", "🎸 Guitar"] },
  { category: "Kitchen Items", odd: "🐬 Dolphin", items: ["🍳 Pan", "🥄 Spoon", "🫕 Pot", "🔪 Knife", "🍽️ Plate", "🥢 Chopsticks", "🧂 Salt", "🫙 Jar", "🐬 Dolphin"] },
  { category: "Vehicles", odd: "🌹 Rose", items: ["🚗 Car", "🚌 Bus", "🚂 Train", "✈️ Plane", "🚢 Ship", "🚲 Bicycle", "🏍️ Bike", "🚁 Helicopter", "🌹 Rose"] },
  { category: "Space Missions", odd: "🍰 Cake", items: ["🚀 Apollo", "🛸 Voyager", "🛰️ Hubble", "🌍 ISS", "🪐 Cassini", "🔭 Webb", "🤖 Curiosity", "☀️ Parker", "🍰 Cake"] },
  { category: "Currencies", odd: "🐧 Penguin", items: ["💵 Dollar", "💶 Euro", "💷 Pound", "💴 Yen", "₹ Rupee", "₩ Won", "₿ Bitcoin", "🪙 Franc", "🐧 Penguin"] },
  { category: "Body Parts", odd: "🚌 Bus", items: ["🦷 Tooth", "👁️ Eye", "👂 Ear", "👃 Nose", "🧠 Brain", "❤️ Heart", "🦷 Bone", "💪 Muscle", "🚌 Bus"] },
  { category: "Planets", odd: "🍕 Pizza", items: ["🌍 Earth", "🔴 Mars", "⭕ Saturn", "🔵 Neptune", "🟤 Jupiter", "🌑 Mercury", "🟡 Venus", "⚪ Uranus", "🍕 Pizza"] },
  { category: "Indian Cities", odd: "🦈 Shark", items: ["🏙️ Mumbai", "🏛️ Delhi", "🌊 Chennai", "🌿 Bengaluru", "🌸 Kolkata", "🏰 Jaipur", "💧 Hyderabad", "🌅 Ahmedabad", "🦈 Shark"] },
  { category: "Festivals", odd: "🔬 Microscope", items: ["🪔 Diwali", "🎁 Christmas", "🌙 Eid", "🎋 Onam", "🌈 Holi", "🎉 Navratri", "🔥 Lohri", "🪷 Pongal", "🔬 Microscope"] },
  { category: "Musical Genres", odd: "🐊 Crocodile", items: ["🎸 Rock", "🎺 Jazz", "🎻 Classical", "🎤 Pop", "🎧 EDM", "🥁 Hip-Hop", "🎷 Blues", "🪗 Folk", "🐊 Crocodile"] },
  { category: "Dance Styles", odd: "🚀 Rocket", items: ["💃 Salsa", "🩰 Ballet", "🕺 Hip-Hop", "👘 Bharatanatyam", "🌹 Flamenco", "👑 Kathak", "🎭 Tap", "🪩 Disco", "🚀 Rocket"] },
  { category: "Colours", odd: "🍔 Burger", items: ["🔴 Red", "🔵 Blue", "🟢 Green", "🟡 Yellow", "🟠 Orange", "🟣 Purple", "⚫ Black", "⚪ White", "🍔 Burger"] },
  { category: "Shapes", odd: "🐝 Bee", items: ["🔵 Circle", "🔺 Triangle", "⬛ Square", "💠 Diamond", "🫘 Oval", "🟣 Pentagon", "⭐ Star", "♦️ Rhombus", "🐝 Bee"] },
  { category: "Indian States", odd: "🎸 Guitar", items: ["🌿 Kerala", "🏜️ Rajasthan", "🌊 Goa", "🌾 Punjab", "🏔️ Himachal", "🎋 Assam", "💎 Gujarat", "🌸 Maharashtra", "🎸 Guitar"] },
  { category: "Languages of India", odd: "🏀 Basketball", items: ["🇮🇳 Hindi", "🌊 Tamil", "🌿 Telugu", "🌸 Kannada", "💎 Gujarati", "🌾 Punjabi", "🎋 Bengali", "🏛️ Sanskrit", "🏀 Basketball"] },
  { category: "World Leaders", odd: "🍩 Donut", items: ["🇺🇸 Biden", "🇮🇳 Modi", "🇬🇧 Sunak", "🇫🇷 Macron", "🇨🇳 Xi", "🇩🇪 Scholz", "🇯🇵 Kishida", "🇨🇦 Trudeau", "🍩 Donut"] },
  { category: "Olympic Sports", odd: "🎹 Piano", items: ["🏊 Swimming", "🏃 Athletics", "🤸 Gymnastics", "🚴 Cycling", "🥊 Boxing", "🏋️ Weightlifting", "🤺 Fencing", "🎯 Archery", "🎹 Piano"] },
  { category: "Cricket Terms", odd: "🚗 Car", items: ["🏏 Century", "⚡ Yorker", "🎯 Googly", "🔥 Bouncer", "💨 Swing", "🧢 Maiden", "🏅 Hat-trick", "🎉 Duck", "🚗 Car"] },
  { category: "Social Media", odd: "🐯 Tiger", items: ["📸 Instagram", "🐦 Twitter/X", "📘 Facebook", "💼 LinkedIn", "🎵 TikTok", "📌 Pinterest", "👻 Snapchat", "▶️ YouTube", "🐯 Tiger"] },
  { category: "E-Commerce", odd: "🌻 Sunflower", items: ["🛒 Amazon", "🛍️ Flipkart", "🏷️ Meesho", "💛 Snapdeal", "🔵 Myntra", "🍊 Nykaa", "🛒 BigBasket", "🚀 Blinkit", "🌻 Sunflower"] },
  { category: "Payment Apps", odd: "🐺 Wolf", items: ["💸 GPay", "💳 PhonePe", "🔵 Paytm", "🏦 BHIM", "💰 Amazon Pay", "🟢 WhatsApp Pay", "🔴 Razorpay", "💴 MobiKwik", "🐺 Wolf"] },
  { category: "Famous Monuments", odd: "🎷 Saxophone", items: ["🗼 Eiffel Tower", "🏛️ Colosseum", "🕌 Taj Mahal", "🗽 Statue of Liberty", "🏰 Big Ben", "🌁 Golden Gate", "🧱 Great Wall", "🗿 Stonehenge", "🎷 Saxophone"] },
  { category: "Math Concepts", odd: "🍪 Cookie", items: ["➕ Addition", "✖️ Multiplication", "📐 Geometry", "📊 Statistics", "🔢 Algebra", "∞ Calculus", "🎲 Probability", "📏 Trigonometry", "🍪 Cookie"] },
  { category: "Physics Topics", odd: "🐸 Frog", items: ["⚡ Electricity", "🔊 Sound", "💡 Light", "🌡️ Heat", "🔭 Gravity", "🧲 Magnetism", "☢️ Nuclear", "⚛️ Quantum", "🐸 Frog"] },
  { category: "Chemical Elements", odd: "🚢 Ship", items: ["🥇 Gold", "🥈 Silver", "🔴 Iron", "⚪ Oxygen", "💧 Hydrogen", "☢️ Uranium", "💎 Carbon", "🟡 Sulphur", "🚢 Ship"] },
  { category: "Historical Events", odd: "🎵 Music", items: ["🗺️ Discovery of America", "⚡ Industrial Revolution", "🌍 World War II", "🚀 Moon Landing", "🔬 DNA Discovery", "🏛️ Fall of Rome", "🧱 Berlin Wall", "🌊 French Revolution", "🎵 Music"] },
  { category: "Ancient Civilisations", odd: "🚲 Cycle", items: ["🏛️ Roman", "🏺 Greek", "🐪 Egyptian", "🌊 Indus Valley", "🐉 Chinese", "🌿 Mayan", "🦁 Mesopotamian", "🌸 Persian", "🚲 Cycle"] },
  { category: "Types of Energy", odd: "🐝 Bee", items: ["☀️ Solar", "💨 Wind", "💧 Hydro", "⚛️ Nuclear", "🌋 Geothermal", "🌊 Tidal", "🔋 Battery", "🔥 Thermal", "🐝 Bee"] },
  { category: "Natural Disasters", odd: "🎮 Joystick", items: ["🌊 Tsunami", "🌋 Volcano", "🌀 Cyclone", "🔥 Wildfire", "⚡ Earthquake", "🌪️ Tornado", "❄️ Blizzard", "🏜️ Drought", "🎮 Joystick"] },
  { category: "Healthy Foods", odd: "🎸 Guitar", items: ["🥑 Avocado", "🥦 Broccoli", "🐟 Salmon", "🫐 Blueberry", "🥜 Almonds", "🥚 Eggs", "🌾 Oats", "🍇 Grapes", "🎸 Guitar"] },
  { category: "Junk Foods", odd: "📡 Satellite", items: ["🍔 Burger", "🍟 Fries", "🍕 Pizza", "🍩 Donut", "🌮 Taco", "🍫 Chocolate", "🥤 Soda", "🍿 Popcorn", "📡 Satellite"] },
  { category: "Emotions", odd: "🚌 Bus", items: ["😊 Happy", "😢 Sad", "😡 Angry", "😨 Fear", "😲 Surprise", "🥰 Love", "😎 Confident", "🤢 Disgust", "🚌 Bus"] },
  { category: "Types of Clouds", odd: "🎺 Trumpet", items: ["☁️ Cumulus", "🌫️ Stratus", "⛅ Cirrus", "🌧️ Nimbus", "🌤️ Altocumulus", "🌩️ Cumulonimbus", "🌥️ Cirrostratus", "☁️ Altostratus", "🎺 Trumpet"] },
  { category: "Programming Concepts", odd: "🍍 Pineapple", items: ["🔄 Loop", "🌿 Function", "📦 Array", "🏗️ Class", "🔁 Recursion", "💡 Variable", "⚡ API", "🧱 Algorithm", "🍍 Pineapple"] },
  { category: "Indian Dishes", odd: "🚀 Rocket", items: ["🍛 Biryani", "🥘 Butter Chicken", "🫓 Naan", "🥙 Paneer", "🍲 Dal Makhani", "🥗 Raita", "🫕 Sambar", "🥞 Dosa", "🚀 Rocket"] },
  { category: "Street Foods", odd: "🐊 Crocodile", items: ["🥟 Pani Puri", "🌯 Vada Pav", "🍢 Chaat", "🥙 Kathi Roll", "🌭 Pav Bhaji", "🥚 Egg Rolls", "🍡 Kebab", "🌮 Bhel Puri", "🐊 Crocodile"] },
  { category: "Breakfast Items", odd: "🦁 Lion", items: ["🥞 Pancakes", "🍳 Eggs", "🥣 Cereal", "🍞 Toast", "🥐 Croissant", "🥓 Bacon", "🫐 Muffin", "🥚 Omelette", "🦁 Lion"] },
  { category: "Office Items", odd: "🐝 Bee", items: ["📎 Paperclip", "✏️ Pencil", "📋 Clipboard", "📏 Ruler", "🖊️ Pen", "📌 Pin", "📝 Notepad", "🗂️ Folder", "🐝 Bee"] },
  { category: "Medical Tools", odd: "🎵 Music Note", items: ["💉 Syringe", "🩺 Stethoscope", "💊 Tablet", "🩹 Bandage", "🔬 Microscope", "🩻 X-Ray", "🌡️ Thermometer", "🩸 Blood Test", "🎵 Music Note"] },
  { category: "Pets", odd: "🚂 Train", items: ["🐕 Dog", "🐈 Cat", "🐇 Rabbit", "🐹 Hamster", "🦜 Parrot", "🐠 Fish", "🐢 Turtle", "🦎 Lizard", "🚂 Train"] },
  { category: "Tools & Hardware", odd: "🍩 Donut", items: ["🔨 Hammer", "🪛 Screwdriver", "🔧 Wrench", "⚙️ Gear", "🪚 Saw", "🔩 Bolt", "📐 Set Square", "🪝 Hook", "🍩 Donut"] },
  { category: "Indian Monuments", odd: "🎲 Dice", items: ["🕌 Taj Mahal", "🏰 Red Fort", "🕍 Qutub Minar", "🌉 Gateway of India", "🏛️ India Gate", "🕌 Hawa Mahal", "🌊 Konark Temple", "🏔️ Mysore Palace", "🎲 Dice"] },
  { category: "Types of Music", odd: "🛸 UFO", items: ["🎵 Classical", "🎸 Rock", "🎺 Jazz", "🎤 R&B", "🥁 Reggae", "🎻 Country", "🪗 Bhangra", "🎹 Soul", "🛸 UFO"] },
];

function shuffle(a) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const ROUND_TIME = 30;

const ConfettiPiece = ({ style }) => (
  <div style={{
    position: "fixed", width: 10, height: 10, borderRadius: 2,
    animation: "confettiFall 2s ease-in forwards", ...style
  }} />
);

export default function OddOneOut() {
  const [screen, setScreen] = useState("intro");
  const [deck, setDeck] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [focus, setFocus] = useState(4);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("oot_hs")) || 0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [lives, setLives] = useState(3);
  const [lifelines, setLifelines] = useState({ fiftyFifty: true, extraTime: true, skip: true });
  const [eliminated, setEliminated] = useState([]);
  const [confettiBits, setConfettiBits] = useState([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [showLifeline, setShowLifeline] = useState(null);
  const advancingRef = useRef(false);
  const current = deck[qIndex];

  const colors = ["#FF6B6B","#FFD93D","#6BCB77","#4D96FF","#C77DFF","#FF9F1C","#2EC4B6","#E71D36","#FF9ECA"];

  const fireConfetti = () => {
    const bits = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      style: {
        left: Math.random() * 100 + "vw",
        top: "-20px",
        background: colors[i % colors.length],
        transform: `rotate(${Math.random() * 360}deg)`,
        animationDelay: Math.random() * 0.5 + "s",
        animationDuration: (1.5 + Math.random()) + "s",
      }
    }));
    setConfettiBits(bits);
    setTimeout(() => setConfettiBits([]), 2500);
  };

  const startGame = () => {
    const qs = [];
    const shuffledBank = shuffle(BANK);
    while (qs.length < GAME_SIZE) {
      for (const q of shuffledBank) {
        if (qs.length >= GAME_SIZE) break;
        qs.push({ ...q, items: shuffle(q.items) });
      }
    }
    setDeck(qs.slice(0, GAME_SIZE));
    setQIndex(0); setScore(0); setFocus(4); setStreak(0);
    setBestStreak(0); setFeedback(null); setLives(3);
    setLifelines({ fiftyFifty: true, extraTime: true, skip: true });
    setEliminated([]); setTotalCorrect(0); setConfettiBits([]);
    setTimeLeft(ROUND_TIME);
    advancingRef.current = false;
    setScreen("game");
  };

  const finishGame = useCallback((finalScore, correct) => {
    if (finalScore > highScore) {
      localStorage.setItem("oot_hs", finalScore);
      setHighScore(finalScore);
    }
    setTotalCorrect(correct);
    setScreen("result");
  }, [highScore]);

  const advance = useCallback((correct, curScore, curStreak, curCorrect, curLives) => {
    if (advancingRef.current) return;
    advancingRef.current = true;

    let newScore = curScore;
    let newStreak = curStreak;
    let newLives = curLives;
    let newCorrect = curCorrect;

    if (correct) {
      newStreak = curStreak + 1;
      const bonus = newStreak >= 5 ? 50 : newStreak >= 3 ? 20 : 0;
      newScore = curScore + timeLeft * 3 + bonus;
      newCorrect = curCorrect + 1;
      setScore(newScore);
      setStreak(newStreak);
      setBestStreak(v => Math.max(v, newStreak));
      setTotalCorrect(newCorrect);
      fireConfetti();
    } else {
      newLives = curLives - 1;
      newStreak = 0;
      setLives(newLives);
      setStreak(0);
    }

    setTimeout(() => {
    setQIndex(prev => {
    const next = prev + 1;

    if (next >= GAME_SIZE || newLives <= 0) {
        finishGame(newScore, newCorrect);
        return prev;
    }

    return next;
    });

    setFocus(4);
    setFeedback(null);
    setEliminated([]);
    setTimeLeft(ROUND_TIME);
    advancingRef.current = false;
    }, 1600);
  }, [qIndex, timeLeft, finishGame]);

  useEffect(() => {
    if (screen !== "game" || feedback) return;
    const t = setInterval(() => {
      setTimeLeft(v => {
        if (v <= 1) {
          setFeedback("timeout");
          advance(false, score, streak, totalCorrect, lives);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [screen, feedback, advance, score, streak, totalCorrect, lives]);

  const handleSelect = useCallback((idx) => {
    if (feedback || advancingRef.current || !current) return;
    if (eliminated.includes(idx)) return;
    const selected = current.items[idx];
    const correct = selected === current.odd;
    setFeedback(correct ? "correct" : "wrong");
    advance(correct, score, streak, totalCorrect, lives);
  }, [feedback, current, eliminated, advance, score, streak, totalCorrect, lives]);

  const useLifeline = (type) => {
    if (!lifelines[type] || feedback) return;
    setLifelines(l => ({ ...l, [type]: false }));
    setShowLifeline(type);
    setTimeout(() => setShowLifeline(null), 1500);

    if (type === "fiftyFifty") {
      const oddIdx = current.items.indexOf(current.odd);
      const others = current.items.map((_, i) => i).filter(i => i !== oddIdx);
      const toElim = shuffle(others).slice(0, 4);
      setEliminated(toElim);
    } else if (type === "extraTime") {
      setTimeLeft(v => Math.min(v + 15, 45));
    } else if (type === "skip") {
      setFeedback("skip");
      advance(false, score, streak, totalCorrect, lives);
    }
  };

  useEffect(() => {
    const key = (e) => {
         e.preventDefault();
         e.stopPropagation();
      if (screen !== "game") return;
      if (feedback || advancingRef.current) return;

      const row = Math.floor(focus / 3);
      const col = focus % 3;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        let next = row * 3 + ((col + 1) % 3);
        while (eliminated.includes(next)) next = Math.floor(next / 3) * 3 + ((next % 3 + 1) % 3);
        setFocus(next);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        let next = row * 3 + ((col + 2) % 3);
        while (eliminated.includes(next)) next = Math.floor(next / 3) * 3 + ((next % 3 + 2) % 3);
        setFocus(next);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        let next = ((row + 1) % 3) * 3 + col;
        while (eliminated.includes(next)) next = ((Math.floor(next / 3) + 1) % 3) * 3 + (next % 3);
        setFocus(next);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        let next = ((row + 2) % 3) * 3 + col;
        while (eliminated.includes(next)) next = ((Math.floor(next / 3) + 2) % 3) * 3 + (next % 3);
        setFocus(next);
      }
      if (e.key === "Enter" || e.key === " " || e.key === "OK" || e.key === "Select" || e.keyCode === 13 || e.keyCode === 23) {
        e.preventDefault();
        e.stopPropagation();
        handleSelect(focus);
        return;
        }
      if (e.key === "1") useLifeline("fiftyFifty");
      if (e.key === "2") useLifeline("extraTime");
      if (e.key === "3") useLifeline("skip");
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, [screen, focus, feedback, current, eliminated, handleSelect]);

  const stars = score >= 800 ? 5 : score >= 600 ? 4 : score >= 400 ? 3 : score >= 200 ? 2 : 1;
  const timerColor = timeLeft <= 10 ? "#ef4444" : timeLeft <= 20 ? "#f59e0b" : "#22c55e";
  const timerPct = (timeLeft / ROUND_TIME) * 100;

  const style = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Nunito', sans-serif; }
    .screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .tv-title { font-family: 'Bebas Neue', cursive; letter-spacing: 3px; }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
    @keyframes confettiFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
    @keyframes slideIn { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes flashGreen { 0%,100%{background:#16a34a} 50%{background:#4ade80} }
    @keyframes flashRed { 0%,100%{background:#dc2626} 50%{background:#f87171} }
    @keyframes streakBounce { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }
    .card-correct { animation: flashGreen 0.4s ease 3; }
    .card-wrong { animation: flashRed 0.4s ease 3; }
    .card-focused { box-shadow: 0 0 0 5px #f59e0b, 0 0 20px rgba(245,158,11,0.6) !important; transform: scale(1.05); }
    .streak-fire { animation: streakBounce 0.3s ease; }
    .lifeline-toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: rgba(0,0,0,0.85); color: #fff; padding: 16px 32px; border-radius: 16px; font-size: 24px; font-weight: 800; z-index: 999; }
  `;

  if (screen === "intro") {
    return (
      <>
        <style>{style}</style>
        <div className="screen" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
          <div style={{ textAlign: "center", animation: "slideIn 0.6s ease" }}>
            <div style={{ fontSize: 80, marginBottom: 8 }}>🎯</div>
            <h1 className="tv-title" style={{ fontSize: 72, color: "#FFD700", textShadow: "0 0 30px rgba(255,215,0,0.5)", lineHeight: 1 }}>
              ODD ONE OUT
            </h1>
            <p className="tv-title" style={{ fontSize: 28, color: "#94a3b8", letterSpacing: 6, marginBottom: 40 }}>TV GAME SHOW</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 40, maxWidth: 440, margin: "0 auto 40px" }}>
              {[["🎯", "15 Rounds", "3 lifelines"], ["❤️", "3 Lives", "Don't lose them!"], ["🔥", "Streaks", "Earn bonus pts"]].map(([icon, t, s]) => (
                <div key={t} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px 8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: 28 }}>{icon}</div>
                  <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 14, marginTop: 4 }}>{t}</div>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>{s}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 20, marginBottom: 32, border: "1px solid rgba(255,255,255,0.1)", maxWidth: 400, margin: "0 auto 32px" }}>
              <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 8 }}>🎮 TV REMOTE CONTROLS</p>
              <p style={{ color: "#e2e8f0", fontSize: 13 }}>Arrow keys to move • OK/Enter to select</p>
              <p style={{ color: "#e2e8f0", fontSize: 13 }}>1 = 50/50 • 2 = +15s • 3 = Skip</p>
            </div>

            <button onClick={startGame} style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#fff",
              border: "none", padding: "20px 64px", borderRadius: 50, fontSize: 24,
              fontWeight: 900, cursor: "pointer", fontFamily: "Nunito, sans-serif",
              boxShadow: "0 8px 32px rgba(245,158,11,0.4)", letterSpacing: 1,
              transition: "transform 0.2s"
            }} onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}>
              ▶ START GAME
            </button>

            {highScore > 0 && <p style={{ color: "#FFD700", marginTop: 16, fontWeight: 700 }}>🏆 Best: {highScore} pts</p>}
          </div>
        </div>
      </>
    );
  }

  if (screen === "result") {
    const starArr = Array.from({ length: 5 }, (_, i) => i < stars ? "⭐" : "☆");
    return (
      <>
        <style>{style}</style>
        <div className="screen" style={{ background: "linear-gradient(135deg, #1a1a2e, #0f3460)" }}>
          {confettiBits.map(c => <ConfettiPiece key={c.id} style={c.style} />)}
          <div style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", borderRadius: 32, padding: "40px 48px", border: "1px solid rgba(255,255,255,0.1)", maxWidth: 420, animation: "slideIn 0.5s ease" }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🏆</div>
            <h1 className="tv-title" style={{ fontSize: 52, color: "#FFD700", letterSpacing: 3 }}>GAME OVER</h1>
            <div style={{ fontSize: 36, margin: "12px 0" }}>{starArr.join(" ")}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "24px 0" }}>
              {[["🎯 Score", score], ["🏅 Best", highScore], ["✅ Correct", `${totalCorrect}/15`], ["🔥 Streak", bestStreak]].map(([label, val]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 8px" }}>
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>{label}</div>
                  <div style={{ color: "#FFD700", fontSize: 28, fontWeight: 900 }}>{val}</div>
                </div>
              ))}
            </div>

            {score >= highScore && score > 0 && <p style={{ color: "#4ade80", fontWeight: 800, marginBottom: 16 }}>🎉 NEW HIGH SCORE!</p>}

            <button onClick={startGame} style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#fff",
              border: "none", padding: "16px 48px", borderRadius: 50, fontSize: 20,
              fontWeight: 900, cursor: "pointer", fontFamily: "Nunito, sans-serif",
              boxShadow: "0 8px 24px rgba(245,158,11,0.4)"
            }}>▶ PLAY AGAIN</button>
          </div>
        </div>
      </>
    );
  }

  // GAME SCREEN
  const oddIdx = current ? current.items.indexOf(current.odd) : -1;

  return (
    <>
      <style>{style}</style>
      {confettiBits.map(c => <ConfettiPiece key={c.id} style={c.style} />)}
      {showLifeline && (
        <div className="lifeline-toast">
          {showLifeline === "fiftyFifty" && "✂️ 50/50 Used!"}
          {showLifeline === "extraTime" && "⏱️ +15 Seconds!"}
          {showLifeline === "skip" && "⏭️ Skipped!"}
        </div>
      )}

      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "16px 12px", display: "flex", flexDirection: "column" }}>

        {/* Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[...Array(3)].map((_, i) => (
              <span key={i} style={{ fontSize: 22, opacity: i < lives ? 1 : 0.25 }}>❤️</span>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#FFD700", fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>ROUND</div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>{qIndex + 1} / {GAME_SIZE}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>SCORE</div>
            <div style={{ color: "#FFD700", fontWeight: 900, fontSize: 20 }}>{score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((qIndex + 1) / GAME_SIZE) * 100}%`, background: "linear-gradient(90deg,#f59e0b,#ef4444)", borderRadius: 99, transition: "width 0.5s ease" }} />
        </div>

        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>⏱️</span>
          <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${timerPct}%`, background: timerColor, borderRadius: 99,
              transition: "width 1s linear, background 0.5s",
              animation: timeLeft <= 10 ? "pulse 1s ease infinite" : "none"
            }} />
          </div>
          <span style={{ color: timerColor, fontWeight: 900, fontSize: 22, minWidth: 32, textAlign: "right" }}>{timeLeft}</span>
        </div>

        {/* Streak */}
        {streak >= 2 && (
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <span className={streak >= 3 ? "streak-fire" : ""} style={{ display: "inline-block", background: "rgba(245,158,11,0.2)", border: "1px solid #f59e0b", borderRadius: 20, padding: "4px 14px", color: "#FFD700", fontWeight: 800, fontSize: 14 }}>
              🔥 {streak} STREAK! {streak >= 5 ? "+50 BONUS" : streak >= 3 ? "+20 BONUS" : ""}
            </span>
          </div>
        )}

        {/* Category */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 4 }}>FIND THE ODD ONE OUT</div>
          <h2 className="tv-title" style={{ fontSize: 42, color: "#fff", letterSpacing: 2 }}>{current?.category}</h2>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, flex: 1 }}>
          {current?.items.map((item, i) => {
            const parts = item.split(" ");
            const emoji = parts[0];
            const text = parts.slice(1).join(" ");
            const isElim = eliminated.includes(i);
            const isFocused = focus === i && !feedback;
            const isOdd = item === current.odd;
            const isCorrect = feedback && isOdd;
            const isWrong = feedback === "wrong" && i === current.items.indexOf(current.items.find((_, j) => j === focus && !isOdd));

            return (
              <button key={i} onClick={() => handleSelect(i)}
                className={isCorrect ? "card-correct" : feedback === "wrong" && focus === i ? "card-wrong" : ""}
                style={{
                  background: isElim ? "rgba(255,255,255,0.03)" : isCorrect ? "#16a34a" : (feedback === "wrong" && focus === i) ? "#dc2626" : isFocused ? "#1e3a5f" : "rgba(255,255,255,0.07)",
                  border: `2px solid ${isElim ? "rgba(255,255,255,0.05)" : isFocused ? "#f59e0b" : isCorrect ? "#4ade80" : (feedback === "wrong" && focus === i) ? "#f87171" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: 20, padding: "14px 8px", cursor: "pointer",
                  opacity: isElim ? 0.25 : 1,
                  transition: "all 0.2s",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  boxShadow: isFocused ? "0 0 0 3px #f59e0b, 0 0 20px rgba(245,158,11,0.4)" : "none",
                  transform: isFocused ? "scale(1.05)" : "scale(1)",
                  minHeight: 90,
                }}>
                <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 4, filter: isElim ? "grayscale(100%)" : "none" }}>{emoji}</div>
                <div style={{ color: isElim ? "#555" : "#e2e8f0", fontWeight: 700, fontSize: 12, textAlign: "center", lineHeight: 1.2 }}>{text}</div>
              </button>
            );
          })}
        </div>

        {/* Lifelines */}
        <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center" }}>
          {[
            { key: "fiftyFifty", icon: "✂️", label: "50/50", shortcut: "1" },
            { key: "extraTime", icon: "⏱️", label: "+15s", shortcut: "2" },
            { key: "skip", icon: "⏭️", label: "Skip", shortcut: "3" },
          ].map(({ key, icon, label, shortcut }) => (
            <button key={key} onClick={() => useLifeline(key)} disabled={!lifelines[key] || !!feedback}
              style={{
                background: lifelines[key] ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${lifelines[key] ? "#f59e0b" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 14, padding: "8px 16px", cursor: lifelines[key] ? "pointer" : "default",
                opacity: lifelines[key] ? 1 : 0.35, transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                fontFamily: "Nunito, sans-serif",
              }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ color: lifelines[key] ? "#FFD700" : "#666", fontWeight: 700, fontSize: 11 }}>{label}</span>
              <span style={{ color: "#555", fontSize: 10 }}>[{shortcut}]</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}