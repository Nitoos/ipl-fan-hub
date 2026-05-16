import React, { useState, useEffect, useCallback } from 'react';

const EMOJIS = [
  { emoji: "❤️", name: "heart", burstColor: "#ea4335" },
  { emoji: "🔥", name: "fire", burstColor: "#f9ab00" },
  { emoji: "👏", name: "clap", burstColor: "#fbbc04" },
  { emoji: "😮", name: "wow", burstColor: "#4285f4" },
  { emoji: "🎉", name: "party", burstColor: "#34a853" },
  { emoji: "💪", name: "strong", burstColor: "#1a73e8" },
];

function FloatingEmoji({ emoji, x, y, onDone, burstColor }) {
  const [particles] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i, angle: (i / 8) * 360,
      distance: 35 + Math.random() * 30,
      size: 6 + Math.random() * 6,
      delay: Math.random() * 0.1,
    }))
  );

  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      position: "absolute", left: x, top: y, pointerEvents: "none",
      transform: "translate(-50%, -50%)", zIndex: 9999
    }}>
      <div style={{ fontSize: 42, animation: "emojiPop 1.4s ease-out forwards" }}>{emoji}</div>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: "50%", top: "50%",
          width: p.size, height: p.size, borderRadius: "50%",
          background: burstColor, opacity: 0,
          animation: `particleBurst 0.8s ease-out ${p.delay}s forwards`,
          "--px": `${Math.cos(p.angle * Math.PI / 180) * p.distance}px`,
          "--py": `${Math.sin(p.angle * Math.PI / 180) * p.distance}px`,
        }} />
      ))}
    </div>
  );
}

export function ReactionBar({ onReact }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      display: "flex", gap: 6, padding: "8px 16px",
      background: "#fff", borderRadius: 100,
      boxShadow: "var(--shadow-md)", border: "1px solid var(--border)",
    }}>
      {EMOJIS.map(e => (
        <button key={e.name}
          onClick={() => onReact(e)}
          onMouseEnter={() => setHovered(e.name)}
          onMouseLeave={() => setHovered(null)}
          style={{
            padding: "8px 10px", borderRadius: 100,
            fontSize: 24,
            background: hovered === e.name ? "#f1f3f4" : "transparent",
            transform: hovered === e.name ? "scale(1.3) translateY(-4px)" : "scale(1)",
            transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        >{e.emoji}</button>
      ))}
    </div>
  );
}

export default function ReactionSystem({ floatingEmojis, removeEmoji }) {
  return (
    <>
      {floatingEmojis.map(e => (
        <FloatingEmoji
          key={e.id}
          emoji={e.emoji}
          x={e.x}
          y={e.y}
          burstColor={e.burstColor}
          onDone={() => removeEmoji(e.id)}
        />
      ))}
    </>
  );
}
