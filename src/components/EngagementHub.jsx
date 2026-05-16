import React, { useState } from 'react';

const PREDICTIONS = [
  { label: "1 Run", value: "1run", icon: "1", xp: 5 },
  { label: "2 Runs", value: "2run", icon: "2", xp: 8 },
  { label: "4 Runs", value: "4run", icon: "4", xp: 15 },
  { label: "6 Runs", value: "6run", icon: "6", xp: 25 },
  { label: "Duck", value: "duck", icon: "🦆", xp: 30 },
  { label: "Wicket", value: "wicket", icon: "W", xp: 20 },
];

const TEAMS = {
  A: { short: "LSG", color: "#0057e2" },
  B: { short: "CSK", color: "#f9a825" },
};

export function VoteBar({ votes, onVote, userVote }) {
  const total = votes.A + votes.B;
  const pctA = total ? Math.round((votes.A / total) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 20,
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
      marginBottom: 12
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "var(--text-secondary)",
        letterSpacing: 1, textTransform: "uppercase", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13h-.68l-2 2h1.91L19 17H5l1.78-2h2.05l-2-2H6l-3 3v2c0 1.1.89 2 1.99 2H19c1.1 0 2-.89 2-2v-2l-3-3z"/></svg>
        Match Outcome Prediction
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {Object.entries(TEAMS).map(([key, team]) => (
          <button key={key} onClick={() => onVote(key)} style={{
            flex: 1, padding: "12px 0", borderRadius: 100,
            border: userVote === key ? `2px solid ${team.color}` : "1px solid var(--border)",
            background: userVote === key ? `${team.color}10` : "#fff",
            color: userVote === key ? team.color : "var(--text-main)",
            fontWeight: 600, fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: team.color }} />
            {team.short}
          </button>
        ))}
      </div>

      <div style={{ height: 10, borderRadius: 100, overflow: "hidden", display: "flex", background: "#f1f3f4" }}>
        <div style={{ width: `${pctA}%`, background: TEAMS.A.color, transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }} />
        <div style={{ width: 2, background: "#fff" }} />
        <div style={{ width: `${pctB}%`, background: TEAMS.B.color, transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <span style={{ fontSize: 14, color: TEAMS.A.color, fontWeight: 700 }}>{pctA}%</span>
        <span style={{ fontSize: 12, color: "var(--text-light)" }}>{total.toLocaleString()} votes</span>
        <span style={{ fontSize: 14, color: TEAMS.B.color, fontWeight: 700 }}>{pctB}%</span>
      </div>
    </div>
  );
}

export function PredictionPanel({ onPredict, activePrediction, xp }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 20,
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "var(--text-secondary)",
          letterSpacing: 1, textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          Ball-by-Ball XP
        </div>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "var(--primary)",
          background: "#e8f0fe", padding: "6px 14px", borderRadius: 100,
          display: "flex", alignItems: "center", gap: 4
        }}>
          <span>⚡</span> {xp} XP
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {PREDICTIONS.map(p => {
          const active = activePrediction?.value === p.value;
          return (
            <button key={p.value}
              onClick={() => onPredict(p)}
              onMouseEnter={() => setHovered(p.value)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "8px 4px", borderRadius: 12,
                border: active ? "2px solid var(--primary)" : "1px solid var(--border)",
                background: active ? "#e8f0fe" : hovered === p.value ? "#f8f9fa" : "#fff",
                color: active ? "var(--primary)" : "var(--text-main)",
                fontWeight: 600, fontSize: 12,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                boxShadow: (hovered === p.value && !active) ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              }}
            >
              <span style={{
                fontSize: 16, width: 32, height: 32, borderRadius: 100,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: active ? "var(--primary)" : "#f1f3f4",
                color: active ? "#fff" : "var(--text-main)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>{p.icon}</span>
              <span style={{ fontSize: 11 }}>{p.label}</span>
              <span style={{ fontSize: 10, color: active ? "var(--primary)" : "var(--text-light)" }}>+{p.xp} XP</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
