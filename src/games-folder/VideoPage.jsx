import React, { useState, useEffect, useRef } from "react";

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

/* ── Reusable Video Player Component (Page 1) ── */
export default function VideoPage({ videoSrc, theme, title, onDone }) {
  const [playing, setPlaying] = useState(false);
  const [watched, setWatched] = useState(false);
  const [pct, setPct] = useState(0);
  const [hover, setHover] = useState(false);
  const [vidErr, setVidErr] = useState(false);

  const vidRef = useRef(null);

  useEffect(() => {
    const video = vidRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      if (!video.duration) return;
      const progress = video.currentTime / video.duration;
      setPct(progress);
      if (progress >= 0.9 || video.currentTime > video.duration - 15) {
        setWatched(true);
      }
    };
    const onEnd = () => {
      setPlaying(false);
      setWatched(true);
      onDone(); // Automatically launch the exam when the video ends
    };
    const onErr = () => setVidErr(true);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onEnd);
    video.addEventListener("error", onErr);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onEnd);
      video.removeEventListener("error", onErr);
    };
  }, [onDone]);

  // Keyboard navigation for TV Remotes
  useEffect(() => {
    const handleKeyDown = (e) => {
      const video = vidRef.current;
      if (!video) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (watched && !playing && video.ended) {
          onDone();
        } else {
          if (playing) video.pause();
          else video.play().catch(() => {});
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 10);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playing, watched, onDone]);

  const bgGradient = `radial-gradient(ellipse at 0% 0%, ${theme.accent}24, transparent 45%), radial-gradient(ellipse at 100% 100%, #fde8f0, transparent 45%), #fffdf8`;

  return (
    <div style={{
      width: "100%",
      height: "100%",
      overflowY: "auto",
      background: bgGradient,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "clamp(12px,2vh,32px) 16px",
      fontFamily: "'Nunito',sans-serif",
      gap: "clamp(14px,2.2vh,24px)"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{
          fontFamily: "'Fredoka One',cursive",
          margin: "0 0 4px 0",
          fontSize: "clamp(1.4rem,3.2vw,2.6rem)",
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.gold}, ${theme.accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          {title}
        </h1>
        <p style={{ color: theme.muted, fontSize: "clamp(.78rem,1.1vw,1rem)", fontWeight: 600 }}>
          Watch the educational video, then take the exam!
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: 820, position: "relative" }}>
        <div style={{
          position: "absolute",
          inset: -3,
          borderRadius: 22,
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.gold}, ${theme.accent})`,
          opacity: playing ? 0.45 : 0.2,
          filter: "blur(14px)",
          zIndex: 0,
          transition: "opacity .6s"
        }} />
        <div style={{
          position: "relative",
          zIndex: 1,
          borderRadius: 18,
          overflow: "hidden",
          border: `2.5px solid ${playing ? `${theme.accent}99` : `${theme.accent}2e`}`,
          background: "#000",
          boxShadow: "0 16px 60px rgba(0,0,0,.2)",
          transition: "border-color .4s"
        }}>
          {vidErr ? (
            <div style={{
              width: "100%",
              height: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#f8fafc",
              color: theme.muted,
              padding: 24,
              textAlign: "center"
            }}>
              <span style={{ fontSize: "2.5rem" }}>📁</span>
              <div style={{ fontWeight: 800, color: theme.text }}>Video file not found</div>
              <div style={{ fontSize: "0.84rem", lineHeight: 1.6, maxWidth: 400 }}>
                Video URL: <code style={{ background: `${theme.accent}1f`, padding: "2px 8px", borderRadius: 5, color: theme.accent }}>{videoSrc}</code>
              </div>
            </div>
          ) : (
            <video
              ref={vidRef}
              src={videoSrc}
              controls
              controlsList="nodownload"
              style={{ width: "100%", display: "block", maxHeight: "52vh", background: "#000" }}
              playsInline
              preload="metadata"
            />
          )}
          <div style={{ height: 5, background: "rgba(0,0,0,.08)" }}>
            <div style={{
              height: "100%",
              width: `${pct * 100}%`,
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.gold}, ${theme.accent})`,
              transition: "width .4s ease"
            }} />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{
          padding: "8px 18px",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: "clamp(.72rem,1vw,.92rem)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "#ffffffdb",
          border: `1px solid ${theme.border}`,
          color: theme.muted
        }}>
          <span>{playing ? "▶️" : "⏸️"}</span><span>{Math.round(pct * 100)}% watched</span>
        </div>
        <div style={{
          padding: "8px 18px",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: "clamp(.72rem,1vw,.92rem)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: watched ? `${theme.correct}1f` : "#ffffffdb",
          border: `1px solid ${watched ? theme.correct : theme.border}`,
          color: watched ? theme.correct : theme.muted,
          boxShadow: watched ? `0 0 18px ${theme.correct}33` : "none",
          transition: "all .4s"
        }}>
          <span>{watched ? "✅" : "🔒"}</span><span>{watched ? "Exam Unlocked!" : "Finish to unlock"}</span>
        </div>
      </div>

      <button
        disabled={!watched}
        onClick={() => watched && onDone()}
        onMouseEnter={() => watched && setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: "clamp(11px,1.6vh,18px) clamp(32px,5vw,64px)",
          fontSize: "clamp(.9rem,1.4vw,1.15rem)",
          fontWeight: 800,
          borderRadius: 999,
          border: "none",
          fontFamily: "'Nunito',sans-serif",
          cursor: watched ? "pointer" : "not-allowed",
          background: watched ? `linear-gradient(135deg, ${theme.accent}, ${theme.gold})` : "rgba(0,0,0,.08)",
          color: watched ? "#fff" : theme.muted,
          boxShadow: watched ? (hover ? `0 0 0 4px ${theme.accent}59,0 8px 32px ${theme.accent}73` : `0 6px 24px ${theme.accent}66`) : "none",
          transform: watched && hover ? "scale(1.06) translateY(-2px)" : "scale(1)",
          transition: "all .24s cubic-bezier(.34,1.56,.64,1)",
          outline: "none"
        }}
      >
        📝 Start Exam Form
      </button>

      {/* Navigation Help */}
      <div style={{ display: "flex", gap: 15, justifyContent: "center", opacity: 0.75 }}>
        <KeyHint k="◀ / ▶" label="Rewind / Fast Forward" theme={theme} />
        <KeyHint k="OK / Enter" label={playing ? "Pause" : "Play / Confirm"} theme={theme} />
      </div>
    </div>
  );
}
