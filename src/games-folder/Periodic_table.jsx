import { useState, useEffect, useCallback, useRef } from "react";

const ELEMENTS = [
  // Period 1
  { s: "H",  n: "Hydrogen",     z: 1,   g: 1,  c: "nonmetal" },
  { s: "He", n: "Helium",       z: 2,   g: 18, c: "noble gas" },
  // Period 2
  { s: "Li", n: "Lithium",      z: 3,   g: 1,  c: "alkali metal" },
  { s: "Be", n: "Beryllium",    z: 4,   g: 2,  c: "alkaline earth" },
  { s: "B",  n: "Boron",        z: 5,   g: 13, c: "metalloid" },
  { s: "C",  n: "Carbon",       z: 6,   g: 14, c: "nonmetal" },
  { s: "N",  n: "Nitrogen",     z: 7,   g: 15, c: "nonmetal" },
  { s: "O",  n: "Oxygen",       z: 8,   g: 16, c: "nonmetal" },
  { s: "F",  n: "Fluorine",     z: 9,   g: 17, c: "halogen" },
  { s: "Ne", n: "Neon",         z: 10,  g: 18, c: "noble gas" },
  // Period 3
  { s: "Na", n: "Sodium",       z: 11,  g: 1,  c: "alkali metal" },
  { s: "Mg", n: "Magnesium",    z: 12,  g: 2,  c: "alkaline earth" },
  { s: "Al", n: "Aluminum",     z: 13,  g: 13, c: "metal" },
  { s: "Si", n: "Silicon",      z: 14,  g: 14, c: "metalloid" },
  { s: "P",  n: "Phosphorus",   z: 15,  g: 15, c: "nonmetal" },
  { s: "S",  n: "Sulfur",       z: 16,  g: 16, c: "nonmetal" },
  { s: "Cl", n: "Chlorine",     z: 17,  g: 17, c: "halogen" },
  { s: "Ar", n: "Argon",        z: 18,  g: 18, c: "noble gas" },
  // Period 4
  { s: "K",  n: "Potassium",    z: 19,  g: 1,  c: "alkali metal" },
  { s: "Ca", n: "Calcium",      z: 20,  g: 2,  c: "alkaline earth" },
  { s: "Sc", n: "Scandium",     z: 21,  g: 3,  c: "transition" },
  { s: "Ti", n: "Titanium",     z: 22,  g: 4,  c: "transition" },
  { s: "V",  n: "Vanadium",     z: 23,  g: 5,  c: "transition" },
  { s: "Cr", n: "Chromium",     z: 24,  g: 6,  c: "transition" },
  { s: "Mn", n: "Manganese",    z: 25,  g: 7,  c: "transition" },
  { s: "Fe", n: "Iron",         z: 26,  g: 8,  c: "transition" },
  { s: "Co", n: "Cobalt",       z: 27,  g: 9,  c: "transition" },
  { s: "Ni", n: "Nickel",       z: 28,  g: 10, c: "transition" },
  { s: "Cu", n: "Copper",       z: 29,  g: 11, c: "transition" },
  { s: "Zn", n: "Zinc",         z: 30,  g: 12, c: "transition" },
  { s: "Ga", n: "Gallium",      z: 31,  g: 13, c: "metal" },
  { s: "Ge", n: "Germanium",    z: 32,  g: 14, c: "metalloid" },
  { s: "As", n: "Arsenic",      z: 33,  g: 15, c: "metalloid" },
  { s: "Se", n: "Selenium",     z: 34,  g: 16, c: "nonmetal" },
  { s: "Br", n: "Bromine",      z: 35,  g: 17, c: "halogen" },
  { s: "Kr", n: "Krypton",      z: 36,  g: 18, c: "noble gas" },
  // Period 5
  { s: "Rb", n: "Rubidium",     z: 37,  g: 1,  c: "alkali metal" },
  { s: "Sr", n: "Strontium",    z: 38,  g: 2,  c: "alkaline earth" },
  { s: "Y",  n: "Yttrium",      z: 39,  g: 3,  c: "transition" },
  { s: "Zr", n: "Zirconium",    z: 40,  g: 4,  c: "transition" },
  { s: "Nb", n: "Niobium",      z: 41,  g: 5,  c: "transition" },
  { s: "Mo", n: "Molybdenum",   z: 42,  g: 6,  c: "transition" },
  { s: "Tc", n: "Technetium",   z: 43,  g: 7,  c: "transition" },
  { s: "Ru", n: "Ruthenium",    z: 44,  g: 8,  c: "transition" },
  { s: "Rh", n: "Rhodium",      z: 45,  g: 9,  c: "transition" },
  { s: "Pd", n: "Palladium",    z: 46,  g: 10, c: "transition" },
  { s: "Ag", n: "Silver",       z: 47,  g: 11, c: "transition" },
  { s: "Cd", n: "Cadmium",      z: 48,  g: 12, c: "transition" },
  { s: "In", n: "Indium",       z: 49,  g: 13, c: "metal" },
  { s: "Sn", n: "Tin",          z: 50,  g: 14, c: "metal" },
  { s: "Sb", n: "Antimony",     z: 51,  g: 15, c: "metalloid" },
  { s: "Te", n: "Tellurium",    z: 52,  g: 16, c: "metalloid" },
  { s: "I",  n: "Iodine",       z: 53,  g: 17, c: "halogen" },
  { s: "Xe", n: "Xenon",        z: 54,  g: 18, c: "noble gas" },
  // Period 6
  { s: "Cs", n: "Cesium",       z: 55,  g: 1,  c: "alkali metal" },
  { s: "Ba", n: "Barium",       z: 56,  g: 2,  c: "alkaline earth" },
  { s: "La", n: "Lanthanum",    z: 57,  g: 3,  c: "lanthanide" },
  { s: "Ce", n: "Cerium",       z: 58,  g: 3,  c: "lanthanide" },
  { s: "Pr", n: "Praseodymium", z: 59,  g: 3,  c: "lanthanide" },
  { s: "Nd", n: "Neodymium",    z: 60,  g: 3,  c: "lanthanide" },
  { s: "Pm", n: "Promethium",   z: 61,  g: 3,  c: "lanthanide" },
  { s: "Sm", n: "Samarium",     z: 62,  g: 3,  c: "lanthanide" },
  { s: "Eu", n: "Europium",     z: 63,  g: 3,  c: "lanthanide" },
  { s: "Gd", n: "Gadolinium",   z: 64,  g: 3,  c: "lanthanide" },
  { s: "Tb", n: "Terbium",      z: 65,  g: 3,  c: "lanthanide" },
  { s: "Dy", n: "Dysprosium",   z: 66,  g: 3,  c: "lanthanide" },
  { s: "Ho", n: "Holmium",      z: 67,  g: 3,  c: "lanthanide" },
  { s: "Er", n: "Erbium",       z: 68,  g: 3,  c: "lanthanide" },
  { s: "Tm", n: "Thulium",      z: 69,  g: 3,  c: "lanthanide" },
  { s: "Yb", n: "Ytterbium",    z: 70,  g: 3,  c: "lanthanide" },
  { s: "Lu", n: "Lutetium",     z: 71,  g: 3,  c: "lanthanide" },
  { s: "Hf", n: "Hafnium",      z: 72,  g: 4,  c: "transition" },
  { s: "Ta", n: "Tantalum",     z: 73,  g: 5,  c: "transition" },
  { s: "W",  n: "Tungsten",     z: 74,  g: 6,  c: "transition" },
  { s: "Re", n: "Rhenium",      z: 75,  g: 7,  c: "transition" },
  { s: "Os", n: "Osmium",       z: 76,  g: 8,  c: "transition" },
  { s: "Ir", n: "Iridium",      z: 77,  g: 9,  c: "transition" },
  { s: "Pt", n: "Platinum",     z: 78,  g: 10, c: "transition" },
  { s: "Au", n: "Gold",         z: 79,  g: 11, c: "transition" },
  { s: "Hg", n: "Mercury",      z: 80,  g: 12, c: "transition" },
  { s: "Tl", n: "Thallium",     z: 81,  g: 13, c: "metal" },
  { s: "Pb", n: "Lead",         z: 82,  g: 14, c: "metal" },
  { s: "Bi", n: "Bismuth",      z: 83,  g: 15, c: "metal" },
  { s: "Po", n: "Polonium",     z: 84,  g: 16, c: "metal" },
  { s: "At", n: "Astatine",     z: 85,  g: 17, c: "halogen" },
  { s: "Rn", n: "Radon",        z: 86,  g: 18, c: "noble gas" },
  // Period 7
  { s: "Fr", n: "Francium",     z: 87,  g: 1,  c: "alkali metal" },
  { s: "Ra", n: "Radium",       z: 88,  g: 2,  c: "alkaline earth" },
  { s: "Ac", n: "Actinium",     z: 89,  g: 3,  c: "actinide" },
  { s: "Th", n: "Thorium",      z: 90,  g: 3,  c: "actinide" },
  { s: "Pa", n: "Protactinium", z: 91,  g: 3,  c: "actinide" },
  { s: "U",  n: "Uranium",      z: 92,  g: 3,  c: "actinide" },
  { s: "Np", n: "Neptunium",    z: 93,  g: 3,  c: "actinide" },
  { s: "Pu", n: "Plutonium",    z: 94,  g: 3,  c: "actinide" },
  { s: "Am", n: "Americium",    z: 95,  g: 3,  c: "actinide" },
  { s: "Cm", n: "Curium",       z: 96,  g: 3,  c: "actinide" },
  { s: "Bk", n: "Berkelium",    z: 97,  g: 3,  c: "actinide" },
  { s: "Cf", n: "Californium",  z: 98,  g: 3,  c: "actinide" },
  { s: "Es", n: "Einsteinium",  z: 99,  g: 3,  c: "actinide" },
  { s: "Fm", n: "Fermium",      z: 100, g: 3,  c: "actinide" },
  { s: "Md", n: "Mendelevium",  z: 101, g: 3,  c: "actinide" },
  { s: "No", n: "Nobelium",     z: 102, g: 3,  c: "actinide" },
  { s: "Lr", n: "Lawrencium",   z: 103, g: 3,  c: "actinide" },
  { s: "Rf", n: "Rutherfordium",z: 104, g: 4,  c: "transition" },
  { s: "Db", n: "Dubnium",      z: 105, g: 5,  c: "transition" },
  { s: "Sg", n: "Seaborgium",   z: 106, g: 6,  c: "transition" },
  { s: "Bh", n: "Bohrium",      z: 107, g: 7,  c: "transition" },
  { s: "Hs", n: "Hassium",      z: 108, g: 8,  c: "transition" },
  { s: "Mt", n: "Meitnerium",   z: 109, g: 9,  c: "transition" },
  { s: "Ds", n: "Darmstadtium", z: 110, g: 10, c: "transition" },
  { s: "Rg", n: "Roentgenium",  z: 111, g: 11, c: "transition" },
  { s: "Cn", n: "Copernicium",  z: 112, g: 12, c: "transition" },
  { s: "Nh", n: "Nihonium",     z: 113, g: 13, c: "metal" },
  { s: "Fl", n: "Flerovium",    z: 114, g: 14, c: "metal" },
  { s: "Mc", n: "Moscovium",    z: 115, g: 15, c: "metal" },
  { s: "Lv", n: "Livermorium",  z: 116, g: 16, c: "metal" },
  { s: "Ts", n: "Tennessine",   z: 117, g: 17, c: "halogen" },
  { s: "Og", n: "Oganesson",    z: 118, g: 18, c: "noble gas" }
];

const CAT_STYLE = {
  "nonmetal":       { bg: "#e6f3e6", border: "#4a9e4a", text: "#1a5c1a", icon: "🌿" },
  "noble gas":      { bg: "#eeedfe", border: "#534ab7", text: "#26215c", icon: "✨" },
  "alkali metal":   { bg: "#fde8e8", border: "#d94f4f", text: "#7a1a1a", icon: "🔥" },
  "alkaline earth": { bg: "#fef3e2", border: "#d48a20", text: "#6b4000", icon: "🌍" },
  "metalloid":      { bg: "#e6f1fb", border: "#378add", text: "#042c53", icon: "💠" },
  "halogen":        { bg: "#eaf3de", border: "#639922", text: "#173404", icon: "🧪" },
  "transition":     { bg: "#e8edf8", border: "#4565b8", text: "#1a2f70", icon: "⚙️" },
  "metal":          { bg: "#f2edf8", border: "#8a5fc7", text: "#3a1a70", icon: "🪙" },
  "lanthanide":     { bg: "#e6fcff", border: "#3eb7c9", text: "#0d5c69", icon: "💎" },
  "actinide":       { bg: "#fce8f3", border: "#c74f9e", text: "#6b0044", icon: "☢️" },
};

const MODES = [
  { id: "symbol", icon: "🔤", label: "Name → Symbol",  desc: "What is the symbol?" },
  { id: "number", icon: "🔢", label: "Name → Number",  desc: "What is the atomic number?" },
  { id: "name",   icon: "📖", label: "Symbol → Name",  desc: "What is the name?" },
  { id: "group",  icon: "🗂️", label: "Name → Group",   desc: "What group is it in?" },
];

const CORRECT_EMOJIS = ["🎉", "⭐", "🥳", "🎊", "🌟", "💪", "🔥", "👏", "🤩", "✅"];
const WRONG_EMOJIS   = ["😅", "💪", "🤔", "😬", "💡", "🧠", "📚"];

const TOTAL = 8;
const MAX_LIVES = 3;
const TIME_PER_Q = 20;

function gridNav(cur, key) {
  if (key === "ArrowRight") return cur % 2 === 0 ? cur + 1 : cur;
  if (key === "ArrowLeft")  return cur % 2 === 1 ? cur - 1 : cur;
  if (key === "ArrowDown")  return cur < 2 ? cur + 2 : cur;
  if (key === "ArrowUp")    return cur >= 2 ? cur - 2 : cur;
  return cur;
}

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

function getAnswer(el, mode) {
  if (mode === "symbol") return el.s;
  if (mode === "number") return String(el.z);
  if (mode === "name")   return el.n;
  if (mode === "group")  return String(el.g);
}

function makeChoices(el, mode) {
  const correct = getAnswer(el, mode);
  const pool = ELEMENTS.filter(e => e.s !== el.s);
  let wrongs = [];
  if (mode === "symbol") wrongs = shuffle(pool).slice(0, 3).map(e => e.s);
  else if (mode === "number") wrongs = shuffle(pool).slice(0, 3).map(e => String(e.z));
  else if (mode === "name") wrongs = shuffle(pool).slice(0, 3).map(e => e.n);
  else if (mode === "group") {
    const allGroups = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
    wrongs = shuffle(allGroups.filter(g => g !== el.g)).slice(0, 3).map(String);
  }
  return shuffle([correct, ...wrongs]);
}

// Global CSS including touch optimizations
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
  @keyframes kBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes kPop    { 0%{transform:scale(0.4);opacity:0} 70%{transform:scale(1.12)} 100%{transform:scale(1);opacity:1} }
  @keyframes kShake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 50%{transform:translateX(7px)} 80%{transform:translateX(-4px)} }
  @keyframes kFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes kPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
  @keyframes kFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes kGlow   { 0%,100%{box-shadow:0 0 0 3px #f9c74f} 50%{box-shadow:0 0 0 6px #f9c74f} }
  * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
      touch-action: manipulation; 
      -webkit-tap-highlight-color: transparent; 
  }
  body { font-family: 'Nunito', 'Comic Sans MS', cursive; }
`;

function injectStyles() {
  if (!document.getElementById("ptc-styles")) {
    const style = document.createElement("style");
    style.id = "ptc-styles";
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }
}

// ─── TimerRing ────────────────────────────────────────────────────────────────
function TimerRing({ timeLeft, total }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  const dash = circ * (timeLeft / total);
  const color = timeLeft > 10 ? "#4a9e4a" : timeLeft > 5 ? "#d48a20" : "#d94f4f";
  return (
    <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
      <svg width="60" height="60" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="30" cy="30" r={r} fill="none" stroke="#e8e8e8" strokeWidth="5" />
        <circle cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 20, fontWeight: 900,
        color, fontFamily: "'Fredoka One', cursive"
      }}>{timeLeft}</div>
    </div>
  );
}

// ─── Hearts ───────────────────────────────────────────────────────────────────
function Hearts({ lives, max }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", fontSize: 24, marginBottom: 10 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{
          transition: "transform 0.2s",
          transform: i < lives ? "scale(1)" : "scale(0.8)",
          filter: i < lives ? "none" : "grayscale(1) opacity(0.4)"
        }}>❤️</span>
      ))}
    </div>
  );
}

// ─── ChoiceButton ─────────────────────────────────────────────────────────────
function ChoiceButton({ label, state, onClick, index }) {
  const isFocused = state === "focused";
  const bg     = state === "correct" ? "#b8f0c0"
               : state === "wrong"   ? "#ffd0d0"
               : isFocused           ? "#fffbe6"
               : "#fff";
  const border = state === "correct" ? "3px solid #4a9e4a"
               : state === "wrong"   ? "3px solid #d94f4f"
               : isFocused           ? "3px solid #f9c74f"
               : "3px solid #d3d1c7";
  const color  = state === "correct" ? "#1a5c1a"
               : state === "wrong"   ? "#7a1a1a"
               : "#26215c";
  const anim   = state === "wrong"   ? "kShake 0.4s"
               : state === "correct" ? "kPop 0.35s"
               : isFocused           ? "kGlow 1.2s ease-in-out infinite"
               : "none";

  const numLabel = ["1","2","3","4"][index];

  return (
    <button
      onClick={onClick}
      disabled={state === "correct" || state === "wrong" || state === "dim"}
      style={{
        cursor: (state === "idle" || state === "focused") ? "pointer" : "default",
        padding: "14px 10px 14px 10px",
        borderRadius: 18,
        border,
        background: bg,
        fontSize: 18,
        fontWeight: 900,
        color,
        fontFamily: "'Nunito', cursive",
        transition: "transform 0.1s, background 0.2s, border-color 0.2s",
        animation: anim,
        textAlign: "center",
        width: "100%",
        position: "relative",
        transform: isFocused ? "scale(1.04)" : "scale(1)",
      }}
    >
      <span style={{
        position: "absolute", top: 6, left: 8,
        fontSize: 10, fontWeight: 900,
        background: isFocused ? "#f9c74f" : "#f1efe8",
        color: isFocused ? "#6b4000" : "#aaa",
        borderRadius: 6, padding: "1px 5px",
        fontFamily: "'Nunito', cursive",
        transition: "background 0.2s, color 0.2s",
      }}>{numLabel}</span>
      {label}
    </button>
  );
}

// ─── KeyboardHint ─────────────────────────────────────────────────────────────
function KeyboardHint() {
  const key = (label, wide) => (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      background: "#f1efe8", border: "1.5px solid #d3d1c7", borderRadius: 6,
      padding: wide ? "3px 10px" : "3px 7px", fontSize: 12, fontWeight: 900,
      color: "#5f5e5a", fontFamily: "'Nunito', cursive", minWidth: wide ? 48 : 28,
    }}>{label}</span>
  );
  return (
    <div style={{
      display: "flex", gap: 6, alignItems: "center", justifyContent: "center",
      flexWrap: "wrap", marginTop: 10, fontSize: 12, color: "#aaa", fontWeight: 700,
    }}>
      {key("↑")} {key("↓")} {key("←")} {key("→")} <span>move</span>
      <span style={{ margin: "0 4px" }}>·</span>
      {key("Enter", true)} {key("Space", true)} <span>confirm</span>
      <span style={{ margin: "0 4px" }}>·</span>
      {key("1")} {key("2")} {key("3")} {key("4")} <span>quick pick</span>
    </div>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
function ConfirmModal({ onYes, onNo }) {
  const [focus, setFocus] = useState(1); // 0 = Yes, 1 = No

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setFocus(f => f === 0 ? 1 : 0);
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        focus === 0 ? onYes() : onNo();
      }
      if (e.key === "Escape" || e.key === "Backspace") {
        e.preventDefault();
        onNo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focus, onYes, onNo]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
    }}>
      <div style={{
        background: "#fff", padding: 24, borderRadius: 20, textAlign: "center",
        border: "4px solid #d3d1c7", animation: "kPop 0.3s ease", maxWidth: 300, width: "90%"
      }}>
        <h2 style={{ color: "#1a2f70", marginBottom: 16, fontFamily: "'Fredoka One', cursive" }}>Exit Game?</h2>
        <p style={{ color: "#5f5e5a", marginBottom: 20, fontWeight: "bold" }}>Your current progress will be lost!</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button 
            onClick={onYes} 
            style={{ flex: 1, padding: "12px", borderRadius: 12, border: focus === 0 ? "3px solid #d94f4f" : "3px solid #ccc", background: focus === 0 ? "#fde8e8" : "#fff", color: focus === 0 ? "#d94f4f" : "#aaa", fontWeight: "bold", fontSize: 18, cursor: "pointer", transition: "all 0.2s" }}
          >Yes</button>
          <button 
            onClick={onNo} 
            style={{ flex: 1, padding: "12px", borderRadius: 12, border: focus === 1 ? "3px solid #4a9e4a" : "3px solid #ccc", background: focus === 1 ? "#b8f0c0" : "#fff", color: focus === 1 ? "#4a9e4a" : "#aaa", fontWeight: "bold", fontSize: 18, cursor: "pointer", transition: "all 0.2s" }}
          >No</button>
        </div>
      </div>
    </div>
  );
}

// ─── MenuScreen ───────────────────────────────────────────────────────────────
function MenuScreen({ mode, setMode, onStart }) {
  useEffect(() => {
    const modeIds = MODES.map(m => m.id);
    const handler = (e) => {
      // FIX: Ensure we use the current mode state when pressing Enter
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onStart(mode); return; }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setMode(prev => { const i = modeIds.indexOf(prev); return modeIds[(i + 1) % modeIds.length]; });
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setMode(prev => { const i = modeIds.indexOf(prev); return modeIds[(i - 1 + modeIds.length) % modeIds.length]; });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, onStart, setMode]); // Ensure mode dependency is up to date

  return (
    <div style={{ padding: "20px 16px", maxWidth: 580, margin: "0 auto", animation: "kFadeIn 0.4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 72, animation: "kFloat 3s ease-in-out infinite" }}>⚗️</div>
        <div style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 36, color: "#d85a30",
          letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 6
        }}>Element Explorer!</div>
        <div style={{ fontSize: 15, color: "#534ab7", fontWeight: 700 }}>
          Learn the Periodic Table — it's FUN! 🚀
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 900, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
        Choose your challenge
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {MODES.map((m, index) => (
          <div
            key={m.id}
            // FIX: Pass the specific mode directly to onStart when clicked
            onClick={() => { onStart(m.id); }} 
            style={{
              cursor: "pointer",
              border: mode === m.id ? "3px solid #d85a30" : "3px solid #d3d1c7",
              borderRadius: 18,
              padding: "14px 12px",
              textAlign: "center",
              background: mode === m.id ? "#faece7" : "#fff",
              transform: mode === m.id ? "scale(1.04)" : "scale(1)",
              transition: "all 0.18s",
              animation: mode === m.id ? "kGlow 1.5s ease-in-out infinite" : "none",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#3c3489" }}>{m.label}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", flexWrap: "wrap", marginTop: 10, fontSize: 12, color: "#bbb", fontWeight: 700 }}>
        {["←","→"].map(k => (
          <span key={k} style={{ background: "#f1efe8", border: "1.5px solid #d3d1c7", borderRadius: 6, padding: "2px 8px", fontSize: 12, color: "#5f5e5a" }}>{k}</span>
        ))}
        <span>change mode</span>
        <span style={{ margin: "0 4px" }}>·</span>
        <span style={{ background: "#f1efe8", border: "1.5px solid #d3d1c7", borderRadius: 6, padding: "2px 10px", fontSize: 12, color: "#5f5e5a" }}>Enter</span>
        <span>start</span>
      </div>
    </div>
  );
}

// ─── GameScreen ───────────────────────────────────────────────────────────────
function GameScreen({ queue, qi, mode, lives, score, streak, timeLeft, choices, feedback, chosen, onAnswer, onBack, isPaused }) {
  const el = queue[qi];
  const [focusIdx, setFocusIdx] = useState(0);

  useEffect(() => { setFocusIdx(0); }, [qi]);

  useEffect(() => {
    const handler = (e) => {
      if (isPaused) return; 

      if (e.key === "Escape" || e.key === "Backspace" || e.keyCode === 10009 || e.keyCode === 461) { 
        e.preventDefault(); 
        onBack(); 
        return; 
      }

      if (feedback) return; 

      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
        setFocusIdx(prev => gridNav(prev, e.key));
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onAnswer(choices[focusIdx]);
        return;
      }

      if (["1","2","3","4"].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        setFocusIdx(idx);
        onAnswer(choices[idx]);
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [feedback, focusIdx, choices, onAnswer, onBack, isPaused]);

  if (!el) return null;
  const cs = CAT_STYLE[el.c] || CAT_STYLE["nonmetal"];
  const correct = getAnswer(el, mode);
  const isSymbolMode = mode === "name";
  const prompt = isSymbolMode ? el.s : el.n;
  const promptLabel = isSymbolMode ? "element symbol" : "element name";

  return (
    <div style={{ padding: "16px", maxWidth: 580, margin: "0 auto" }}>
      
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
        <button
          onClick={onBack}
          disabled={isPaused} 
          style={{
            background: "#f1efe8", border: "2px solid #d3d1c7", borderRadius: 12,
            padding: "6px 14px", fontSize: 14, fontWeight: 900, color: "#5f5e5a",
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "'Nunito', cursive", transition: "transform 0.1s"
          }}
        >
          ⬅️ Menu (Press Back)
        </button>
      </div>

      {/* Top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#eeedfe", borderRadius: 16, padding: "10px 16px",
        border: "2px solid #afa9ec", marginBottom: 10
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#3c3489", lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 11, color: "#534ab7", fontWeight: 700 }}>⭐ score</div>
        </div>
        <TimerRing timeLeft={timeLeft} total={TIME_PER_Q} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#3c3489", lineHeight: 1 }}>🔥{streak}</div>
          <div style={{ fontSize: 11, color: "#534ab7", fontWeight: 700 }}>streak</div>
        </div>
      </div>

      <Hearts lives={lives} max={MAX_LIVES} />

      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, height: 12, background: "#f1efe8", borderRadius: 20, overflow: "hidden", border: "2px solid #d3d1c7" }}>
          <div style={{
            height: "100%", borderRadius: 20, background: "#4a9e4a",
            width: `${Math.round(qi / TOTAL * 100)}%`, transition: "width 0.4s"
          }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#534ab7", whiteSpace: "nowrap" }}>{qi + 1}/{TOTAL}</div>
      </div>

      {/* Question card */}
      <div style={{
        background: "#fff", border: "3px solid #d3d1c7", borderRadius: 22,
        padding: "20px 18px", textAlign: "center", marginBottom: 14,
        animation: "kPop 0.35s ease"
      }}>
        <div style={{
          display: "inline-block", padding: "4px 14px", borderRadius: 30,
          fontSize: 12, fontWeight: 900, marginBottom: 10,
          background: cs.bg, border: `2px solid ${cs.border}`, color: cs.text
        }}>{cs.icon} {el.c}</div>
        <div style={{ fontSize: 13, color: "#aaa", fontWeight: 700, marginBottom: 4 }}>{promptLabel}</div>
        <div style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: isSymbolMode ? 60 : 32,
          color: "#1a2f70", letterSpacing: isSymbolMode ? 4 : 0,
          lineHeight: 1.1, marginBottom: 8
        }}>{prompt}</div>
        <div style={{ fontSize: 13, color: "#bbb", fontWeight: 700 }}>
          {mode === "symbol" ? "Pick the symbol!" :
           mode === "number" ? "Pick the atomic number!" :
           mode === "name"   ? "Pick the name!" :
                               "Pick the group number!"}
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div style={{
          textAlign: "center", padding: "12px 16px", borderRadius: 16,
          fontSize: 18, fontWeight: 900, marginBottom: 10,
          background: feedback.correct ? "#b8f0c0" : "#fde8e8",
          border: `2px solid ${feedback.correct ? "#4a9e4a" : "#d94f4f"}`,
          color: feedback.correct ? "#1a5c1a" : "#7a1a1a",
          animation: "kPop 0.3s ease"
        }}>
          {feedback.emoji}{" "}
          {feedback.timeout ? `Too slow! It was: ${feedback.answer}` :
           feedback.correct ? "Correct! Amazing!" :
           `Oops! It was: ${feedback.answer}`}
          {feedback.correct && feedback.streak > 1 ? ` · ${feedback.streak}× streak! 🔥` : ""}
        </div>
      )}

      {/* 2×2 Choices grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {choices.map((ch, idx) => {
          let state = feedback
            ? ch === correct ? "correct"
            : ch === chosen && ch !== correct ? "wrong"
            : "dim"
            : idx === focusIdx ? "focused" : "idle";
          return (
            <ChoiceButton
              key={ch}
              index={idx}
              label={ch}
              state={state}
              onClick={() => {
                if (!feedback && !isPaused) {
                  setFocusIdx(idx); 
                  onAnswer(ch);
                }
              }} 
            />
          );
        })}
      </div>

      {/* Keyboard hint strip */}
      {!feedback && <KeyboardHint />}
    </div>
  );
}

// ─── ResultsScreen ────────────────────────────────────────────────────────────
function ResultsScreen({ results, score, best, onPlayAgain, onMenu }) {
  const [focus, setFocus] = useState(0); 

  useEffect(() => {
    const handler = (e) => {
      if (["ArrowUp", "ArrowDown"].includes(e.key)) { e.preventDefault(); setFocus(prev => prev === 0 ? 1 : 0); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); focus === 0 ? onPlayAgain() : onMenu(); }
      else if (e.key === "Escape" || e.key === "Backspace" || e.keyCode === 10009 || e.keyCode === 461) onMenu();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focus, onPlayAgain, onMenu]);

  const correct = results.filter(r => r.correct).length;
  const pct = Math.round(correct / TOTAL * 100);
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
  const trophy = pct >= 90 ? "🏆" : pct >= 60 ? "🥈" : pct >= 30 ? "🥉" : "🌱";
  const msg = pct >= 90 ? "You're a chemistry superstar!" :
              pct >= 60 ? "Great job, keep it up!" :
              pct >= 30 ? "Good try! Practice makes perfect!" :
                          "Keep learning, you've got this!";
  const gradeColor = pct >= 90 ? "#4a9e4a" : pct >= 60 ? "#534ab7" : pct >= 30 ? "#d48a20" : "#d94f4f";

  return (
    <div style={{ padding: "16px", maxWidth: 580, margin: "0 auto", animation: "kFadeIn 0.4s ease" }}>
      {/* Score Header */}
      <div style={{ textAlign: "center", paddingBottom: 16 }}>
        <div style={{ fontSize: 80, animation: "kBounce 1.5s ease-in-out infinite" }}>{trophy}</div>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 64, color: gradeColor, lineHeight: 1 }}>{correct}/{TOTAL}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, fontSize: 30, margin: "8px 0" }}>
          {Array.from({ length: 3 }, (_, i) => i < stars ? "⭐" : "☆")}
        </div>
        <div style={{ fontSize: 17, fontWeight: 900, color: gradeColor }}>{msg}</div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { n: `${correct}/${TOTAL}`, l: "✅ correct",      c: "#4a9e4a" },
          { n: score,                 l: "⭐ points",       c: "#534ab7" },
          { n: `${best}×`,            l: "🔥 best streak", c: "#d48a20" },
        ].map(({ n, l, c }) => (
          <div key={l} style={{ background: "#eeedfe", borderRadius: 14, padding: "12px 8px", textAlign: "center", border: "2px solid #afa9ec" }}>
            <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: c }}>{n}</div>
            <div style={{ fontSize: 12, color: "#534ab7", fontWeight: 700 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <button
        onClick={() => { setFocus(0); onPlayAgain(); }}
        style={{
          display: "block", width: "100%", padding: "18px",
          fontFamily: "'Fredoka One', cursive", fontSize: 22, border: "none", borderRadius: 20,
          background: "#4a9e4a", color: "#fff", cursor: "pointer", marginBottom: 10,
          transition: "all 0.15s", transform: focus === 0 ? "scale(1.04)" : "scale(1)",
          boxShadow: focus === 0 ? "0 0 0 4px #b8f0c0" : "none"
        }}
      >
        🎮 Play Again!
      </button>

      <button
        onClick={() => { setFocus(1); onMenu(); }}
        style={{
          display: "block", width: "100%", padding: "13px", fontSize: 16, fontWeight: 900,
          fontFamily: "'Nunito', cursive", borderRadius: 16, cursor: "pointer", transition: "all 0.15s",
          background: focus === 1 ? "#f1efe8" : "transparent",
          border: focus === 1 ? "2px solid #aaa" : "2px solid #d3d1c7",
          color: focus === 1 ? "#333" : "#5f5e5a",
          transform: focus === 1 ? "scale(1.04)" : "scale(1)"
        }}
      >
        🏠 Back to menu
      </button>
    </div>
  );
}

// ─── Main Application Logic ───────────────────────────────────────────────────
export default function KidsPeriodicChallenge() {
  useEffect(() => { injectStyles(); }, []);

  const [screen,      setScreen]      = useState("menu");
  const [mode,        setMode]        = useState("symbol");
  const [queue,       setQueue]       = useState([]);
  const [qi,          setQi]          = useState(0);
  const [lives,       setLives]       = useState(MAX_LIVES);
  const [score,       setScore]       = useState(0);
  const [streak,      setStreak]      = useState(0);
  const [best,        setBest]        = useState(0);
  const [timeLeft,    setTimeLeft]    = useState(TIME_PER_Q);
  const [choices,     setChoices]     = useState([]);
  const [feedback,    setFeedback]    = useState(null);
  const [chosen,      setChosen]      = useState(null);
  const [results,     setResults]     = useState([]);
  
  const [showConfirm, setShowConfirm] = useState(false); 

  const timerRef = useRef(null);
  const feedRef  = useRef(null);

  const currentEl = queue[qi];

  const clearTimers = () => {
    clearInterval(timerRef.current);
    clearTimeout(feedRef.current);
  };

  const advance = useCallback((nextQi, nextLives, newResults) => {
    if (nextLives <= 0 || nextQi >= TOTAL) {
      setScreen("results");
      return;
    }
    const nextEl = queue[nextQi];
    setQi(nextQi);
    setFeedback(null);
    setChosen(null);
    setTimeLeft(TIME_PER_Q);
    setChoices(makeChoices(nextEl, mode));
  }, [queue, mode]);

  const handleAnswer = useCallback((picked) => {
    if (feedback || !currentEl || showConfirm) return; 
    clearTimers();

    const correct = getAnswer(currentEl, mode);
    const isCorrect = picked === correct;
    const newStreak  = isCorrect ? streak + 1 : 0;
    const newBest    = Math.max(newStreak, best);
    const newLives   = isCorrect ? lives : lives - 1;
    const newScore   = isCorrect ? score + Math.ceil(timeLeft * 15) : score;
    const newResults = [...results, { el: currentEl, correct: isCorrect, chosen: picked, answer: correct, mode }];

    setChosen(picked);
    setStreak(newStreak);
    setBest(newBest);
    setLives(newLives);
    setScore(newScore);
    setResults(newResults);
    setFeedback({
      correct: isCorrect,
      answer: correct,
      streak: newStreak,
      timeout: false,
      emoji: rand(isCorrect ? CORRECT_EMOJIS : WRONG_EMOJIS),
    });

    feedRef.current = setTimeout(() => advance(qi + 1, newLives, newResults), 1400);
  }, [feedback, currentEl, mode, streak, best, lives, score, timeLeft, results, qi, advance, showConfirm]);

  useEffect(() => {
    if (screen !== "game" || feedback || showConfirm) return; 
    
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          const correct = getAnswer(currentEl, mode);
          const newLives = lives - 1;
          const newResults = [...results, { el: currentEl, correct: false, chosen: null, answer: correct, mode }];
          setLives(newLives);
          setStreak(0);
          setResults(newResults);
          setFeedback({ correct: false, answer: correct, timeout: true, emoji: rand(WRONG_EMOJIS), streak: 0 });
          feedRef.current = setTimeout(() => advance(qi + 1, newLives, newResults), 1400);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, feedback, showConfirm, currentEl, mode, lives, results, qi, advance]);

  // FIX: Force `startGame` to use the EXACT mode that was clicked/passed!
  const startGame = (selectedMode = mode) => {
    setMode(selectedMode);
    clearTimers();
    const q = shuffle(ELEMENTS).slice(0, TOTAL);
    setQueue(q);
    setQi(0);
    setLives(MAX_LIVES);
    setScore(0);
    setStreak(0);
    setBest(0);
    setTimeLeft(TIME_PER_Q);
    setResults([]);
    setFeedback(null);
    setChosen(null);
    setShowConfirm(false);
    
    // Instantly generate the right choices based on selectedMode
    setChoices(makeChoices(q[0], selectedMode)); 
    setScreen("game");
  };

  const goMenu = () => { clearTimers(); setScreen("menu"); };

  const handleRequestBack = () => setShowConfirm(true);
  const handleConfirmYes  = () => { setShowConfirm(false); goMenu(); };
  const handleConfirmNo   = () => setShowConfirm(false);

  if (screen === "menu") return <MenuScreen mode={mode} setMode={setMode} onStart={startGame} />;
  
  if (screen === "game") return (
    <>
      <GameScreen
        queue={queue} qi={qi} mode={mode}
        lives={lives} score={score} streak={streak}
        timeLeft={timeLeft} choices={choices}
        feedback={feedback} chosen={chosen}
        onAnswer={handleAnswer}
        onBack={handleRequestBack}  
        isPaused={showConfirm}      
      />
      {showConfirm && (
        <ConfirmModal 
          onYes={handleConfirmYes} 
          onNo={handleConfirmNo} 
        />
      )}
    </>
  );

  return <ResultsScreen results={results} score={score} best={best} onPlayAgain={() => startGame(mode)} onMenu={goMenu} />;
}