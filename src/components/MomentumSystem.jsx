import React, { useState, useEffect, useRef } from 'react';

export default function MomentumSystem({ onWaveTriggered }) {
  const [momentum, setMomentum] = useState(30);
  const [isWaveActive, setIsWaveActive] = useState(false);
  const lastCheerTimeRef = useRef(0);
  const onWaveTriggeredRef = useRef(onWaveTriggered);
  onWaveTriggeredRef.current = onWaveTriggered;

  const handleCheer = () => {
    const now = Date.now();
    if (now - lastCheerTimeRef.current < 500) return;
    lastCheerTimeRef.current = now;
    setMomentum(prev => Math.min(prev + 5 + Math.random() * 5, 100));
  };

  // Detect when momentum hits 100 and trigger the wave as a side effect
  useEffect(() => {
    if (momentum >= 100) {
      setIsWaveActive(true);
      onWaveTriggeredRef.current(100);
      setMomentum(0);
      const t = setTimeout(() => setIsWaveActive(false), 4000);
      return () => clearTimeout(t);
    }
  }, [momentum]);

  // Natural decay of momentum
  useEffect(() => {
    const iv = setInterval(() => {
      setMomentum(prev => Math.max(10, prev - 0.5));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {/* Wave Animation Overlay */}
      {isWaveActive && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none",
          overflow: "hidden"
        }}>
          {/* Subtle bottom wave bars */}
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              position: "absolute", bottom: 0, height: "15%",
              width: "300px", background: "linear-gradient(90deg, transparent, rgba(26,115,232,0.15), transparent)",
              left: "-350px",
              animation: `waveMove 3s ease-in-out ${i * 0.4}s forwards`,
              transform: `skewX(-30deg)`,
              backdropFilter: "blur(2px)"
            }} />
          ))}

          {/* Premium Toast at Top */}
          <div style={{
            position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.9)", 
            padding: "10px 24px", borderRadius: 100,
            boxShadow: "0 10px 25px rgba(26,115,232,0.2)",
            border: "1px solid rgba(26,115,232,0.1)",
            display: "flex", alignItems: "center", gap: 12,
            animation: "slideInDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}>
            <span style={{ fontSize: 20 }}>🌊</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--primary)", textTransform: "uppercase", letterSpacing: 1 }}>Stadium Wave!</span>
              <span style={{ fontSize: 11, color: "var(--text-light)", fontWeight: 600 }}>Collective momentum reached 100%</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", background: "#e6f4ea", padding: "4px 10px", borderRadius: 100 }}>+100 XP</span>
          </div>
        </div>
      )}

      {/* Cheer Control */}
      <div style={{
        position: "absolute", bottom: 20, right: 20, display: "flex", flexDirection: "column",
        alignItems: "center", gap: 10, zIndex: 100
      }}>
        <div style={{
          width: 6, height: 120, background: "#f1f3f4", borderRadius: 100, position: "relative",
          overflow: "hidden", border: "1px solid var(--border)"
        }}>
          <div style={{
            position: "absolute", bottom: 0, width: "100%",
            height: `${momentum}%`, background: "linear-gradient(to top, var(--primary), var(--primary-hover))",
            transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 0 10px var(--primary)"
          }} />
        </div>
        
        <button onClick={handleCheer} style={{
          width: 56, height: 56, borderRadius: "50%", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "var(--shadow-md)", fontSize: 24,
          border: momentum > 80 ? "2px solid var(--primary)" : "2px solid transparent",
          animation: momentum > 80 ? "pulse 1s infinite" : "none"
        }}>
          🙌
        </button>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>Cheer</span>
      </div>
    </>
  );
}
