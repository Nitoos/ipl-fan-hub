import React, { useState, useEffect, useRef } from 'react';

export default function PressureMeter({ heartCount = 0 }) {
  const [pressure, setPressure] = useState(45);
  const [bpm, setBpm] = useState(72);
  const canvasRef = useRef(null);

  const pointsRef = useRef([]);
  const xRef = useRef(0);

  // ECG Animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = pressure > 80 ? '#ff4b2b' : '#1a73e8';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      // Draw the line
      const points = pointsRef.current;
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }

      // Add new point
      xRef.current += 2;
      if (xRef.current > canvas.width) {
        points.shift();
        points.forEach(p => p.x -= 2);
        xRef.current -= 2;
      }

      // ECG pulse shape
      let y = canvas.height / 2;
      const t = Date.now() / (1000 * (60 / bpm));
      const phase = t % 1;
      
      if (phase > 0.1 && phase < 0.15) y -= 10;
      else if (phase >= 0.15 && phase < 0.25) y += 30;
      else if (phase >= 0.25 && phase < 0.3) y -= 20;
      
      points.push({ x: xRef.current, y });
      if (points.length > 150) points.shift();

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [bpm, pressure]);

  // Sync pressure and bpm
  useEffect(() => {
    setPressure(prev => Math.min(prev + 2, 100));
    setBpm(prev => Math.min(prev + 1, 160));

    let decay;
    const timeout = setTimeout(() => {
      decay = setInterval(() => {
        setPressure(prev => Math.max(40, prev - 0.2));
        setBpm(prev => Math.max(70, prev - 0.1));
      }, 500);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      clearInterval(decay);
    };
  }, [heartCount]);

  return (
    <div style={{
      background: pressure > 90 ? "linear-gradient(135deg, #fff 0%, #fff0f0 100%)" : "#fff",
      borderRadius: 24, padding: "20px 24px",
      minHeight: 180,
      boxShadow: pressure > 90 ? "0 10px 30px rgba(255, 75, 43, 0.2)" : "var(--shadow-sm)",
      border: pressure > 90 ? "2px solid #ff4b2b" : "1px solid var(--border)",
      transition: "all 0.3s ease",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column"
    }}>
      {/* Background Pulse Effect */}
      {pressure > 85 && (
        <div style={{
          position: "absolute", inset: 0,
          animation: "pulseRed 1s infinite alternate",
          pointerEvents: "none", opacity: 0.1
        }} />
      )}

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "var(--text-secondary)",
          letterSpacing: 1, textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>💓</span>
          Collective Heartbeat
        </div>
        <div style={{
          fontSize: 18, fontWeight: 800, color: pressure > 80 ? "#ff4b2b" : "var(--text-main)",
          display: "flex", alignItems: "baseline", gap: 4
        }}>
          {Math.round(bpm)} <span style={{ fontSize: 10, color: "var(--text-light)" }}>BPM</span>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={300} 
        height={60} 
        style={{ width: "100%", height: 60, marginBottom: 16, filter: pressure > 90 ? "drop-shadow(0 0 8px #ff4b2b)" : "none" }} 
      />

      <div style={{ position: "relative", height: 8, background: "#f1f3f4", borderRadius: 100, overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${pressure}%`, 
          background: pressure > 80 ? "linear-gradient(90deg, #ff4b2b, #ff416c)" : "var(--primary)",
          transition: "width 0.3s ease",
          boxShadow: pressure > 80 ? "0 0 10px #ff4b2b" : "none"
        }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-light)" }}>LOW TENSION</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: pressure > 80 ? "#ff4b2b" : "var(--text-light)" }}>EXTREME PRESSURE</span>
      </div>

      <style>{`
        @keyframes pulseRed {
          from { background: #ff4b2b; }
          to { background: transparent; }
        }
      `}</style>
    </div>
  );
}
