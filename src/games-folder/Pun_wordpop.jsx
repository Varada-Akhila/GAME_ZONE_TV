import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── Word Banks ──────────────────────────────────────────────────────────────
const ADJECTIVES  = ['big','tiny','red','blue','fast','slow','happy','silly','fluffy','shiny','loud','quiet','brave','magic','funny','cute','wild','sleepy','hungry','clever'];
const NOUNS       = ['cat','dog','bird','car','tree','book','apple','ball','bear','star','frog','fish','robot','dragon','lion','horse','monkey','flower','cloud','baby'];
const NOUNS2      = ['pond','park','sky','tree','cave','river','hill','school','garden','forest'];
const VERBS_PAST  = ['jumped','ran','flew','slept','fell','rolled','barked','sang','hid','played','danced','laughed','cried','swam','climbed','painted','shouted','smiled','skipped','hopped'];
const VERBS_ING   = ['jumping','running','flying','sleeping','rolling','barking','singing','playing','dancing','laughing','swimming','climbing','painting','shouting','smiling','skipping'];
const VERBS_BASE  = ['jump','run','fly','sleep','fall','roll','hide','play','sing','go','swim','climb','dance','shout','skip'];
const VERBS_3RD   = ['runs','jumps','flies','sleeps','falls','rolls','barks','sings','hides','plays','dances','laughs','swims','climbs','shouts','skips'];
const NAMES       = ['Tom','Amy','Sam','Mia','Leo','Zoe','Ben','Lily','Max','Nia'];
const PLACES      = ['the park','the pond','the sky','the garden','the forest','the river','the cave','the hill','the school','the tree'];
const COLORS      = ['red','blue','green','yellow','pink','purple','orange','white','black','brown'];
const PUNC_KEYS   = ['.', '?', '!'];

// ── 30+ sentence templates ──────────────────────────────────────────────────
// Each entry: { build: (words) => string, punc: '.', '?', or '!' }
const TEMPLATES = [
  // ── STATEMENTS (.)  ─────────────────────────────────────────────
  { punc:'.', build:(w)=>`The ${w.adj} ${w.noun} ${w.vPast}` },
  { punc:'.', build:(w)=>`My ${w.noun} is very ${w.adj}` },
  { punc:'.', build:(w)=>`I saw a ${w.adj} ${w.noun}` },
  { punc:'.', build:(w)=>`${w.name} has a ${w.adj} ${w.noun}` },
  { punc:'.', build:(w)=>`The ${w.noun} ${w.vPast} in ${w.place}` },
  { punc:'.', build:(w)=>`${w.name} ${w.vPast} all day long` },
  { punc:'.', build:(w)=>`A ${w.adj} ${w.noun} lives in ${w.place}` },
  { punc:'.', build:(w)=>`She loves the ${w.color} ${w.noun}` },
  { punc:'.', build:(w)=>`He found a ${w.adj} ${w.noun} in ${w.place}` },
  { punc:'.', build:(w)=>`The ${w.noun} is ${w.ving} near ${w.place}` },
  { punc:'.', build:(w)=>`${w.name} and I found a ${w.adj} ${w.noun}` },
  { punc:'.', build:(w)=>`The ${w.color} ${w.noun} ${w.v3rd} every day` },
  { punc:'.', build:(w)=>`We saw the ${w.noun} ${w.ving} slowly` },
  { punc:'.', build:(w)=>`The ${w.adj} ${w.noun} slept under the ${w.noun2}` },
  { punc:'.', build:(w)=>`${w.name} painted a ${w.color} ${w.noun}` },
  { punc:'.', build:(w)=>`A little ${w.noun} was ${w.ving} in ${w.place}` },
  { punc:'.', build:(w)=>`My friend has a very ${w.adj} ${w.noun}` },
  { punc:'.', build:(w)=>`The ${w.noun} ${w.v3rd} near the ${w.noun2}` },

  // ── QUESTIONS (?)  ──────────────────────────────────────────────
  { punc:'?', build:(w)=>`Can you see the ${w.adj} ${w.noun}` },
  { punc:'?', build:(w)=>`Where did the ${w.noun} ${w.vBase}` },
  { punc:'?', build:(w)=>`Do you want a ${w.adj} ${w.noun}` },
  { punc:'?', build:(w)=>`Is the ${w.noun} ${w.ving} in ${w.place}` },
  { punc:'?', build:(w)=>`Why is the ${w.noun} so ${w.adj}` },
  { punc:'?', build:(w)=>`Who took the ${w.color} ${w.noun}` },
  { punc:'?', build:(w)=>`Have you seen the ${w.adj} ${w.noun}` },
  { punc:'?', build:(w)=>`Did ${w.name} ${w.vBase} in ${w.place}` },
  { punc:'?', build:(w)=>`How did the ${w.noun} get so ${w.adj}` },
  { punc:'?', build:(w)=>`Can the ${w.adj} ${w.noun} really ${w.vBase}` },
  { punc:'?', build:(w)=>`What is the ${w.noun} doing in ${w.place}` },
  { punc:'?', build:(w)=>`Will ${w.name} ${w.vBase} with the ${w.noun}` },
  { punc:'?', build:(w)=>`Is that a ${w.color} ${w.noun} over there` },
  { punc:'?', build:(w)=>`Why did the ${w.adj} ${w.noun} ${w.vBase}` },
  { punc:'?', build:(w)=>`When did ${w.name} find the ${w.noun}` },
  { punc:'?', build:(w)=>`Are you afraid of the ${w.adj} ${w.noun}` },

  // ── EXCLAMATIONS (!)  ───────────────────────────────────────────
  { punc:'!', build:(w)=>`Look at that ${w.adj} ${w.noun}` },
  { punc:'!', build:(w)=>`The ${w.noun} is so ${w.adj}` },
  { punc:'!', build:(w)=>`What a ${w.adj} ${w.noun}` },
  { punc:'!', build:(w)=>`How ${w.adj} the ${w.noun} is` },
  { punc:'!', build:(w)=>`Oh no, the ${w.noun} is ${w.ving}` },
  { punc:'!', build:(w)=>`Wow, ${w.name} found a ${w.adj} ${w.noun}` },
  { punc:'!', build:(w)=>`Run, the ${w.adj} ${w.noun} is coming` },
  { punc:'!', build:(w)=>`That ${w.noun} is really ${w.adj}` },
  { punc:'!', build:(w)=>`I can't believe the ${w.noun} ${w.vPast}` },
  { punc:'!', build:(w)=>`How fast the ${w.adj} ${w.noun} ${w.v3rd}` },
  { punc:'!', build:(w)=>`The ${w.color} ${w.noun} is ${w.ving} again` },
  { punc:'!', build:(w)=>`Watch out for the ${w.adj} ${w.noun}` },
  { punc:'!', build:(w)=>`${w.name} just caught a ${w.adj} ${w.noun}` },
  { punc:'!', build:(w)=>`What a lovely ${w.color} ${w.noun}` },
  { punc:'!', build:(w)=>`The ${w.adj} ${w.noun} jumped so high` },
];

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function genQuestion() {
  const tmpl = rnd(TEMPLATES);
  const words = {
    adj:   rnd(ADJECTIVES),
    noun:  rnd(NOUNS),
    noun2: rnd(NOUNS2),
    vPast: rnd(VERBS_PAST),
    vBase: rnd(VERBS_BASE),
    v3rd:  rnd(VERBS_3RD),
    ving:  rnd(VERBS_ING),
    name:  rnd(NAMES),
    place: rnd(PLACES),
    color: rnd(COLORS),
  };
  const raw = tmpl.build(words);
  return { text: raw.charAt(0).toUpperCase() + raw.slice(1), punc: tmpl.punc };
}

// ── Theme / Config ──────────────────────────────────────────────────────────
const BALLOON_THEMES = [
  { bg:'#FF6B6B', shine:'#FFB3B3', knot:'#C0392B', border:'#FF4444', text:'#5A0000', bubbleBg:'#FFF0F0', bubbleBorder:'#FF6B6B' },
  { bg:'#FFD93D', shine:'#FFF3A3', knot:'#D4A000', border:'#FFB700', text:'#5A3C00', bubbleBg:'#FFFDE8', bubbleBorder:'#FFD93D' },
  { bg:'#6BCB77', shine:'#B8EDBD', knot:'#2E8B57', border:'#4CAF50', text:'#0A3D1A', bubbleBg:'#EDFFF0', bubbleBorder:'#6BCB77' },
  { bg:'#4D96FF', shine:'#A8CCFF', knot:'#1565C0', border:'#2196F3', text:'#002060', bubbleBg:'#EEF5FF', bubbleBorder:'#4D96FF' },
  { bg:'#FF9FF3', shine:'#FFCEF9', knot:'#C2185B', border:'#E91E8C', text:'#5A0040', bubbleBg:'#FFF0FB', bubbleBorder:'#FF9FF3' },
  { bg:'#A78BFA', shine:'#D4BFFE', knot:'#6D28D9', border:'#7C3AED', text:'#2D1060', bubbleBg:'#F5EEFF', bubbleBorder:'#A78BFA' },
];

const PUNC_CONFIG = {
  '.': { label:'Full Stop', bg:'#FF6B6B', shadow:'rgba(180,50,0,0.4)' },
  '?': { label:'Question',  bg:'#FFD93D', shadow:'rgba(180,130,0,0.4)' },
  '!': { label:'Exclaim!',  bg:'#6BCB77', shadow:'rgba(30,120,50,0.4)' },
};

const STAR_DECOS = [
  { top:'5%',  left:'10%', delay:'0s',   size:16, icon:'⭐' },
  { top:'10%', left:'82%', delay:'1s',   size:12, icon:'✨' },
  { top:'3%',  left:'55%', delay:'2s',   size:14, icon:'🌟' },
  { top:'15%', left:'30%', delay:'0.5s', size:11, icon:'⭐' },
  { top:'7%',  left:'68%', delay:'1.5s', size:13, icon:'✨' },
];

const GROUND_DECOS = [
  { left:'12%', size:28, delay:'0s',   dur:'2s',   icon:'🌼' },
  { left:'28%', size:22, delay:'0.4s', dur:'2.3s', icon:'🌻' },
  { left:'48%', size:26, delay:'0.8s', dur:'1.9s', icon:'🌸' },
  { left:'66%', size:24, delay:'0.2s', dur:'2.1s', icon:'🦋' },
  { left:'80%', size:20, delay:'1s',   dur:'2.5s', icon:'🐝' },
  { left:'5%',  size:18, delay:'0.6s', dur:'2.2s', icon:'🌷' },
  { left:'90%', size:22, delay:'0.3s', dur:'2.4s', icon:'🌺' },
];

// ── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bubblegum+Sans&family=Nunito:wght@700;800;900&display=swap');
.pp-wrap { width:100vw; height:100vh; position:relative; overflow:hidden; font-family:'Nunito',sans-serif; }

@keyframes ppFloatUp  { 0%{bottom:-220px;opacity:0} 5%{opacity:1} 100%{bottom:102%;opacity:1} }
@keyframes ppWobble   { 0%,100%{transform:rotate(-4deg) scale(1)} 50%{transform:rotate(4deg) scale(1.06)} }
@keyframes ppBounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes ppPop      { 0%{transform:scale(1);opacity:1} 40%{transform:scale(2.2);opacity:0.8} 100%{transform:scale(3.5);opacity:0} }
@keyframes ppStarSpin { 0%,100%{transform:scale(1) rotate(0deg);opacity:1} 50%{transform:scale(1.4) rotate(180deg);opacity:0.6} }
@keyframes ppCloud    { 0%{left:-160px} 100%{left:110%} }
@keyframes ppRainbow  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes ppBtnJump  { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.08) translateY(-6px)} }
@keyframes ppHeartPop { 0%{transform:scale(0) rotate(-20deg);opacity:1} 60%{transform:scale(1.5) rotate(10deg)} 100%{transform:scale(1) rotate(0);opacity:0} }
@keyframes ppGlow     { 0%,100%{box-shadow:0 0 24px rgba(255,215,0,0.8),0 0 0 4px #FFD700} 50%{box-shadow:0 0 40px rgba(255,215,0,1),0 0 0 6px #FFD700} }
@keyframes ppEscape   { 0%{opacity:1;transform:translateY(0) scale(1)} 70%{opacity:0.6;transform:translateY(-28px) scale(1.1)} 100%{opacity:0;transform:translateY(-55px) scale(0.7)} }

.pp-balloon  { position:absolute; display:flex; flex-direction:column; align-items:center; animation:ppFloatUp linear forwards; width:180px; }
.pp-bshape   { border-radius:50% 50% 50% 50%/40% 40% 60% 60%; position:relative; display:flex; align-items:center; justify-content:center; transition:transform 0.15s,box-shadow 0.15s; }
.pp-bshape.target { animation:ppGlow 1.5s ease-in-out infinite; transform:scale(1.1); }
.pp-shine    { position:absolute; top:12%; left:18%; width:28%; height:20%; background:rgba(255,255,255,0.55); border-radius:50%; transform:rotate(-30deg); filter:blur(2px); pointer-events:none; }
.pp-knot     { width:13px; height:13px; border-radius:50%; position:absolute; bottom:-7px; left:50%; transform:translateX(-50%); }
.pp-crown    { font-size:11px; font-weight:900; padding:3px 10px; border-radius:20px; margin-bottom:5px; text-transform:uppercase; letter-spacing:1px; background:#FFD700; color:#7B3800; animation:ppBounce 0.8s ease-in-out infinite; white-space:nowrap; }
.pp-bubble   { background:#fff; border-radius:18px; padding:8px 14px; font-size:13px; font-weight:800; text-align:center; line-height:1.4; margin-top:3px; border:3px solid transparent; max-width:210px; word-wrap:break-word; }
.pp-cloud    { position:absolute; opacity:0.2; pointer-events:none; animation:ppCloud linear infinite; }
.pp-star     { position:absolute; pointer-events:none; animation:ppStarSpin 3s ease-in-out infinite; }
.pp-burst    { position:absolute; pointer-events:none; z-index:50; border-radius:50%; animation:ppPop 0.6s ease forwards; }
.pp-fpts     { position:absolute; pointer-events:none; z-index:60; font-family:'Bubblegum Sans',cursive; font-size:26px; animation:ppHeartPop 0.9s ease forwards; text-shadow:0 2px 8px rgba(0,0,0,0.3); }
.pp-escape   { position:absolute; pointer-events:none; z-index:60; font-family:'Bubblegum Sans',cursive; font-size:20px; animation:ppEscape 1s ease forwards; color:#FF4444; }

.pp-tool-btn  { display:flex; flex-direction:column; align-items:center; gap:5px; cursor:pointer; user-select:none; -webkit-user-select:none; transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.pp-tool-btn.active { transform:translateY(-16px) scale(1.25); }
.pp-tool-inner { border-radius:22px; display:flex; align-items:center; justify-content:center; border:4px solid rgba(255,255,255,0.5); transition:box-shadow 0.2s; width:84px; height:84px; }
.pp-tool-label { font-size:11px; font-weight:900; letter-spacing:1px; color:rgba(255,255,255,0.85); text-transform:uppercase; }
`;

// ── Sub-components ──────────────────────────────────────────────────────────
function StarDecos() {
  return <>{STAR_DECOS.map((s,i)=>(
    <div key={i} className="pp-star" style={{top:s.top,left:s.left,animationDelay:s.delay,fontSize:s.size}}>{s.icon}</div>
  ))}</>;
}

function Clouds() {
  return <>{[{top:'8%',dur:'22s',delay:'0s'},{top:'18%',dur:'30s',delay:'-8s'},{top:'5%',dur:'26s',delay:'-14s'}].map((c,i)=>(
    <div key={i} className="pp-cloud" style={{top:c.top,animationDuration:c.dur,animationDelay:c.delay}}>
      <svg width="130" height="55"><ellipse cx="65" cy="38" rx="58" ry="20" fill="white"/><ellipse cx="45" cy="30" rx="30" ry="22" fill="white"/><ellipse cx="82" cy="28" rx="24" ry="20" fill="white"/></svg>
    </div>
  ))}</>;
}

function Ground() {
  return (
    <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,zIndex:12,pointerEvents:'none'}}>
      <svg width="100%" height="120" preserveAspectRatio="none" viewBox="0 0 700 120">
        <rect x="0" y="72" width="700" height="48" fill="#4CAF50"/>
        <path d="M0,68 Q35,45 70,68 Q105,48 140,68 Q175,44 210,68 Q245,46 280,68 Q315,45 350,68 Q385,46 420,68 Q455,44 490,68 Q525,46 560,68 Q595,44 630,68 Q665,46 700,68 L700,120 L0,120Z" fill="#66BB6A"/>
        <path d="M0,82 Q25,66 50,82 Q75,64 100,82 Q125,66 150,82 Q175,64 200,82 Q225,66 250,82 Q275,64 300,82 Q325,66 350,82 Q375,64 400,82 Q425,66 450,82 Q475,64 500,82 Q525,66 550,82 Q575,64 600,82 Q625,66 650,82 Q675,64 700,82 L700,120 L0,120Z" fill="#43A047"/>
      </svg>
      {GROUND_DECOS.map((d,i)=>(
        <div key={i} style={{position:'absolute',bottom:d.size*0.3,left:d.left,fontSize:d.size,animation:`ppBounce ${d.dur} ${d.delay} ease-in-out infinite`}}>{d.icon}</div>
      ))}
    </div>
  );
}

function Balloon({ balloon, isTarget, onEscaped }) {
  const t = balloon.theme;
  return (
    <div className="pp-balloon" style={{left:`${balloon.left}%`,animationDuration:`${balloon.duration}s`}} onAnimationEnd={(e)=>{ e.stopPropagation(); if(e.animationName==='ppFloatUp') onEscaped(); }}>
      {isTarget && <div className="pp-crown">🎯 Shoot me!</div>}
      <div className={`pp-bshape${isTarget?' target':''}`} style={{width:105,height:132,background:t.bg,border:`3px solid ${t.border}`,opacity:isTarget?1:0.65}} onAnimationEnd={e=>e.stopPropagation()}>
        <div className="pp-shine"/>
        <div className="pp-knot" style={{background:t.knot}}/>
      </div>
      <svg width="18" height="50" viewBox="0 0 18 50" style={{marginTop:-3}}>
        <path d="M9,0 Q14,18 6,35 Q2,44 9,50" fill="none" stroke={t.knot} strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
      </svg>
      <div className="pp-bubble" style={{background:t.bubbleBg,borderColor:t.bubbleBorder,color:t.text,opacity:isTarget?1:0.55}}>
        {balloon.text}{' '}
        <span style={{display:'inline-block',width:20,height:3,background:t.bg,borderRadius:3,verticalAlign:'middle'}}/>
      </div>
    </div>
  );
}

function StartScreen({ onStart }) {
  return (
    <div style={{position:'absolute',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#FF9FF3 0%,#FFD93D 25%,#6BCB77 50%,#4D96FF 75%,#FF6B6B 100%)',backgroundSize:'300% 300%',animation:'ppRainbow 5s ease infinite'}}>
      <div style={{background:'rgba(255,255,255,0.93)',borderRadius:32,padding:'28px 32px',textAlign:'center',maxWidth:420,width:'90%',border:'5px solid #fff',boxShadow:'0 20px 50px rgba(0,0,0,0.25)'}}>
        <div style={{fontSize:48,animation:'ppWobble 1.5s ease-in-out infinite'}}>🎈</div>
        <div style={{fontFamily:"'Bubblegum Sans',cursive",fontSize:'clamp(26px,7vw,42px)',background:'linear-gradient(135deg,#FF6B6B,#FFD93D,#6BCB77,#4D96FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',lineHeight:1,margin:'6px 0'}}>
          Punctuation<br/>POP!
        </div>
        <p style={{fontSize:14,fontWeight:800,color:'#555',margin:'10px 0 12px'}}>Pop the balloon with the right mark! 🎯</p>
        <div style={{background:'#FFF8E1',border:'3px solid #FFD93D',borderRadius:14,padding:'9px 14px',marginBottom:14,fontSize:13,fontWeight:800,color:'#7B5800'}}>
          💡 If a balloon <strong>escapes to the top</strong>, you lose a ❤️
        </div>
        <div style={{display:'flex',gap:10,justifyContent:'center',marginBottom:16,flexWrap:'wrap'}}>
          {[{punc:'.',label:'FULL STOP',bg:'#FFE8E8',border:'#FF6B6B',color:'#FF6B6B',tc:'#CC3333'},
            {punc:'?',label:'QUESTION', bg:'#FFFDE8',border:'#FFD93D',color:'#D4A000',tc:'#9A7000'},
            {punc:'!',label:'EXCLAIM',  bg:'#E8FFE8',border:'#6BCB77',color:'#2E8B57',tc:'#1A6B3A'}].map(p=>(
            <div key={p.punc} style={{background:p.bg,border:`3px solid ${p.border}`,borderRadius:14,padding:'10px 14px',textAlign:'center'}}>
              <div style={{fontFamily:"'Bubblegum Sans',cursive",fontSize:30,color:p.color}}>{p.punc}</div>
              <div style={{fontSize:10,fontWeight:900,color:p.tc,letterSpacing:1}}>{p.label}</div>
            </div>
          ))}
        </div>
        <button onClick={onStart} autoFocus style={{background:'linear-gradient(135deg,#FF6B6B,#FF8E53)',color:'#fff',border:'4px solid #fff',borderRadius:50,padding:'13px 42px',fontFamily:"'Bubblegum Sans',cursive",fontSize:22,cursor:'pointer',boxShadow:'0 8px 0 rgba(180,50,0,0.35)',animation:'ppBtnJump 1.5s ease-in-out infinite',letterSpacing:1,outline:'none'}}>
          Let's Play! 🚀
        </button>
      </div>
    </div>
  );
}

function GameOverScreen({ score, onReplay }) {
  let emoji='💪', msg='Keep trying — you will get it!';
  if(score>=200){emoji='🏆';msg='Amazing! You are a punctuation star!';}
  else if(score>=100){emoji='🌟';msg='Great job! Keep practising!';}
  else if(score>=50){emoji='👍';msg='Good try! You can do better!';}
  return (
    <div style={{position:'absolute',inset:0,zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.6)'}}>
      <div style={{background:'#fff',borderRadius:32,padding:'36px 40px',textAlign:'center',maxWidth:380,width:'90%',border:'5px solid #FFD700',boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
        <div style={{fontSize:60}}>{emoji}</div>
        <div style={{fontFamily:"'Bubblegum Sans',cursive",fontSize:36,color:'#FF6B6B',margin:'8px 0'}}>Game Over!</div>
        <div style={{fontSize:16,fontWeight:800,color:'#555',marginBottom:6}}>Your Score</div>
        <div style={{fontFamily:"'Bubblegum Sans',cursive",fontSize:52,color:'#FFD93D',textShadow:'0 3px 0 rgba(180,130,0,0.4)'}}>{score}</div>
        <div style={{fontSize:15,fontWeight:700,color:'#888',margin:'10px 0 24px'}}>{msg}</div>
        <button onClick={onReplay} autoFocus style={{background:'linear-gradient(135deg,#6BCB77,#4CAF50)',color:'#fff',border:'4px solid #fff',borderRadius:50,padding:'13px 40px',fontFamily:"'Bubblegum Sans',cursive",fontSize:22,cursor:'pointer',boxShadow:'0 6px 0 rgba(30,120,50,0.4)',letterSpacing:1,outline:'none'}}>
          Play Again! 🎈
        </button>
      </div>
    </div>
  );
}

// ── Main Game ───────────────────────────────────────────────────────────────
export default function PunctuationPopClass3() {
  const [gameState,    setGameState]    = useState('START');
  const [balloons,     setBalloons]     = useState([]);
  const [score,        setScore]        = useState(0);
  const [lives,        setLives]        = useState(3);
  const [combo,        setCombo]        = useState(0);
  const [focused,      setFocused]      = useState(1);
  const [bursts,       setBursts]       = useState([]);
  const [floatingPts,  setFloatingPts]  = useState([]);
  const [escapeMsgs,   setEscapeMsgs]   = useState([]);

  const focusedRef   = useRef(1);
  const balloonIdRef = useRef(0);
  const livesRef     = useRef(3);
  const playingRef   = useRef(false);
  const comboRef     = useRef(0);
  const scoreRef     = useRef(0);
  const escapedIds   = useRef(new Set()); // guard: each balloon can only escape once

  const setFocusedBoth = useCallback((i)=>{ setFocused(i); focusedRef.current=i; },[]);

  // balloon escapes to top → lose exactly ONE life
  const handleEscaped = useCallback((id, left) => {
    // strict guard: each balloon id can only trigger this once ever
    if (escapedIds.current.has(id)) return;
    escapedIds.current.add(id);

    // subtract life OUTSIDE setBalloons so it only runs once
    const newLives = Math.max(0, livesRef.current - 1);
    livesRef.current = newLives;
    setLives(newLives);
    comboRef.current = 0;
    setCombo(0);

    // remove balloon from list
    setBalloons(prev => prev.filter(b => b.id !== id));

    // show escaped message
    const msgId = Date.now();
    setEscapeMsgs(m => [...m, { id: msgId, left }]);
    setTimeout(() => setEscapeMsgs(m => m.filter(x => x.id !== msgId)), 1000);

    if (newLives <= 0) {
      playingRef.current = false;
      setTimeout(() => setGameState('GAMEOVER'), 400);
    }
  }, []);

  // shoot a punctuation button
  const shoot = useCallback((punc) => {
    if (!playingRef.current) return;
    setBalloons(prev => {
      if (prev.length === 0) return prev;
      const target = prev[0];
      if (punc === target.punc) {
        comboRef.current += 1;
        const pts = comboRef.current >= 5 ? 30 : comboRef.current >= 3 ? 20 : 10;
        scoreRef.current += pts;
        setScore(scoreRef.current);
        setCombo(comboRef.current);

        const burstId = Date.now();
        setBursts(b => [...b, { id:burstId, left:target.left, color:target.theme.bg }]);
        setTimeout(() => setBursts(b => b.filter(x => x.id !== burstId)), 700);

        const ptId = Date.now() + 1;
        const col = comboRef.current >= 5 ? '#FF6B6B' : comboRef.current >= 3 ? '#FFD93D' : '#6BCB77';
        setFloatingPts(f => [...f, { id:ptId, left:target.left, pts, col, extra:comboRef.current >= 3 ? ' 🔥':'' }]);
        setTimeout(() => setFloatingPts(f => f.filter(x => x.id !== ptId)), 900);

        return prev.slice(1);
      } else {
        // wrong answer — combo reset only, no life lost
        comboRef.current = 0;
        setCombo(0);
        return prev;
      }
    });
  }, []);

  // spawn loop
  const spawnBalloon = useCallback(() => {
    if (!playingRef.current) return;
    const q = genQuestion();
    const theme = rnd(BALLOON_THEMES);
    const id = balloonIdRef.current++;
    setBalloons(prev => [...prev, {
      id, text:q.text, punc:q.punc, theme,
      left:     Math.floor(Math.random() * 58) + 6,
      duration: Math.random() * 4 + 11,
    }]);
  }, []);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    spawnBalloon();
    const timer = setInterval(spawnBalloon, 4000);
    return () => clearInterval(timer);
  }, [gameState, spawnBalloon]);

  // keyboard
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    const handler = (e) => {
      if ([32,37,38,39,40,13].includes(e.keyCode)) e.preventDefault();
      if (e.key==='ArrowLeft'  || e.keyCode===37) setFocusedBoth(Math.max(focusedRef.current-1,0));
      if (e.key==='ArrowRight' || e.keyCode===39) setFocusedBoth(Math.min(focusedRef.current+1,2));
      if (e.key==='Enter'||e.key===' '||e.keyCode===13||e.keyCode===32) shoot(PUNC_KEYS[focusedRef.current]);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [gameState, shoot, setFocusedBoth]);

  const startGame = useCallback(() => {
    setBalloons([]); setScore(0); scoreRef.current=0;
    setLives(3);     livesRef.current=3;
    setCombo(0);     comboRef.current=0;
    setFocusedBoth(1); setBursts([]); setFloatingPts([]); setEscapeMsgs([]);
    balloonIdRef.current=0; playingRef.current=true; escapedIds.current=new Set();
    setGameState('PLAYING');
  }, [setFocusedBoth]);

  const hearts = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);

  return (
    <>
      <style>{CSS}</style>
      <div className="pp-wrap">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#1ecbe1 0%,#74d7e8 40%,#b5eef8 70%,#d4f5fd 100%)'}}/>
        <Clouds/><StarDecos/><Ground/>

        {gameState === 'PLAYING' && <>
          {/* HUD */}
          <div style={{position:'absolute',top:0,left:0,right:0,zIndex:30,padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'linear-gradient(180deg,rgba(0,100,150,0.35) 0%,transparent 100%)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{background:'#FF6B6B',borderRadius:50,padding:'6px 18px',display:'flex',alignItems:'center',gap:6,border:'3px solid #fff',boxShadow:'0 4px 0 rgba(180,0,0,0.35)'}}>
                <span style={{fontSize:18}}>⭐</span>
                <span style={{fontFamily:"'Bubblegum Sans',cursive",fontSize:24,color:'#fff'}}>{score}</span>
              </div>
              {combo>=2&&<div style={{background:'#FFD700',borderRadius:50,padding:'5px 12px',border:'3px solid #fff',boxShadow:'0 3px 0 rgba(180,130,0,0.4)'}}>
                <span style={{fontFamily:"'Bubblegum Sans',cursive",fontSize:16,color:'#7B3800'}}>🔥 x{combo} Combo!</span>
              </div>}
            </div>
            <div style={{fontFamily:"'Bubblegum Sans',cursive",fontSize:'clamp(14px,3vw,22px)',color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,0.3)',letterSpacing:1}}>🎈 Punctuation Pop!</div>
            <div style={{fontSize:22}}>{hearts}</div>
          </div>

          {/* Play area */}
          <div style={{position:'absolute',inset:0,zIndex:10}}>
            {balloons.map((b,i)=>(
              <Balloon key={b.id} balloon={b} isTarget={i===0} onEscaped={()=>handleEscaped(b.id,b.left)}/>
            ))}
            {bursts.map(bst=>(
              <div key={bst.id} className="pp-burst" style={{left:`calc(${bst.left}% - 45px)`,top:'35%',width:90,height:90,background:`radial-gradient(circle,#fff 0%,${bst.color} 55%,transparent 100%)`}}/>
            ))}
            {floatingPts.map(fp=>(
              <div key={fp.id} className="pp-fpts" style={{left:`calc(${fp.left}% - 20px)`,top:'30%',color:fp.col}}>+{fp.pts}{fp.extra}</div>
            ))}
            {escapeMsgs.map(em=>(
              <div key={em.id} className="pp-escape" style={{left:`calc(${em.left}% - 40px)`,top:'10%'}}>Escaped! 💔</div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:25,height:150,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,background:'linear-gradient(to top,rgba(0,80,120,0.88) 0%,rgba(0,80,120,0.45) 80%,transparent 100%)'}}>
            <div style={{display:'flex',gap:'clamp(20px,5vw,48px)',alignItems:'flex-end'}}>
              {PUNC_KEYS.map((p,i)=>{
                const cfg=PUNC_CONFIG[p]; const isActive=i===focused;
                return (
                  <div key={p} className={`pp-tool-btn${isActive?' active':''}`}
                    onClick={()=>{setFocusedBoth(i);shoot(p);}}
                    onTouchStart={(e)=>{e.preventDefault();setFocusedBoth(i);shoot(p);}}>
                    <div className="pp-tool-label">{cfg.label}</div>
                    <div className="pp-tool-inner" style={{background:cfg.bg,boxShadow:isActive?`0 8px 0 ${cfg.shadow},0 0 0 10px rgba(255,255,255,0.4),0 0 30px ${cfg.shadow}`:`0 8px 0 ${cfg.shadow},0 0 0 4px rgba(255,255,255,0.4)`}}>
                      <span style={{fontFamily:"'Bubblegum Sans',cursive",fontSize:42,color:'#fff',lineHeight:1}}>{p}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.5)',fontWeight:800,letterSpacing:2,marginTop:2}}>TAP A BUTTON OR USE ◀ ▶ + ENTER</div>
          </div>
        </>}

        {gameState==='START'    && <StartScreen onStart={startGame}/>}
        {gameState==='GAMEOVER' && <GameOverScreen score={score} onReplay={startGame}/>}
      </div>
    </>
  );
}