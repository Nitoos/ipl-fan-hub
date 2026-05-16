import React from 'react';

const TEAMS = {
  A: { name: "Lucknow Super Giants", short: "LSG", color: "#0057e2", accent: "#29b6f6" },
  B: { name: "Chennai Super Kings", short: "CSK", color: "#f9a825", accent: "#ffca28" },
};

export default function Scoreboard() {
  return (
    <div className="scoreboard-container" style={{
      textAlign: "center", padding: "60px 20px", width: "100%", maxWidth: 1000, margin: "0 auto",
      position: "relative", zIndex: 1
    }}>
      {/* Dynamic Background Elements */}
      <div style={{
        position: "absolute", top: "50%", left: "10%", width: 300, height: 300,
        background: `${TEAMS.A.color}11`, filter: "blur(100px)", borderRadius: "50%", zIndex: -1, transform: "translate(-50%, -50%)"
      }} />
      <div style={{
        position: "absolute", top: "50%", right: "10%", width: 300, height: 300,
        background: `${TEAMS.B.color}11`, filter: "blur(100px)", borderRadius: "50%", zIndex: -1, transform: "translate(50%, -50%)"
      }} />

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px",
        background: "rgba(26,115,232,0.08)", borderRadius: 100, marginBottom: 12,
        fontSize: 13, color: "var(--primary)", fontWeight: 700, letterSpacing: 1
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)" }} />
        TATA IPL 2026
      </div>
      <div style={{ fontSize: 13, color: "var(--text-light)", fontWeight: 500, marginBottom: 40 }}>
        Match 59 • Ekana Stadium, Lucknow • 15 May 2026
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
        {/* LSG */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{
            width: 100, height: 100, borderRadius: 28, margin: "0 auto 20px",
            background: `linear-gradient(135deg, ${TEAMS.A.color}, ${TEAMS.A.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 28, fontWeight: 900,
            boxShadow: `0 12px 32px ${TEAMS.A.color}33`,
            transform: "rotate(-4deg)"
          }}>LSG</div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text-main)", opacity: 0.8 }}>{TEAMS.A.name}</div>
          <div style={{ fontWeight: 900, fontSize: 64, color: "var(--text-main)", marginTop: 8, letterSpacing: "-2px" }}>188/3</div>
          <div style={{ fontSize: 14, color: "var(--text-light)", fontWeight: 500 }}>16.4 overs</div>
        </div>

        {/* VS Divider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 1, height: 60, background: "linear-gradient(to bottom, transparent, #dadce0, transparent)"
          }} />
          <div style={{
            fontSize: 14, fontWeight: 800, color: "var(--text-light)",
            width: 44, height: 44, borderRadius: "50%", border: "1px solid #dadce0",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#fff", boxShadow: "var(--shadow-sm)"
          }}>VS</div>
          <div style={{
            fontSize: 12, color: "#34a853", fontWeight: 800,
            background: "#e6f4ea", padding: "6px 16px", borderRadius: 100,
            border: "1px solid rgba(52,168,83,0.2)"
          }}>TARGET: 188</div>
          <div style={{
            width: 1, height: 60, background: "linear-gradient(to bottom, transparent, #dadce0, transparent)"
          }} />
        </div>

        {/* CSK */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{
            width: 100, height: 100, borderRadius: 28, margin: "0 auto 20px",
            background: `linear-gradient(135deg, ${TEAMS.B.color}, ${TEAMS.B.accent})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 28, fontWeight: 900,
            boxShadow: `0 12px 32px ${TEAMS.B.color}33`,
            transform: "rotate(4deg)"
          }}>CSK</div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "var(--text-main)", opacity: 0.8 }}>{TEAMS.B.name}</div>
          <div style={{ fontWeight: 900, fontSize: 64, color: "var(--text-main)", marginTop: 8, letterSpacing: "-2px" }}>187/5</div>
          <div style={{ fontSize: 14, color: "var(--text-light)", fontWeight: 500 }}>20.0 overs</div>
        </div>
      </div>

      {/* Key Performer */}
      <div style={{
        marginTop: 50, display: "inline-flex", alignItems: "center", gap: 12,
        padding: "12px 32px", background: "#fff", borderRadius: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #f1f3f4"
      }}>
        <span style={{ fontSize: 20 }}>⭐</span>
        <span style={{ fontSize: 15, color: "var(--text-main)", fontWeight: 700 }}>
          Mitchell Marsh <span style={{ color: "var(--text-light)", fontWeight: 500 }}>— 90 off 38 balls</span>
        </span>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24 }}>
        {[
          { label: "M. Marsh", stat: "90 (38)", team: "LSG" },
          { label: "Kartik S.", stat: "71 (42)", team: "CSK" },
          { label: "Akash S.", stat: "3/26", team: "LSG" },
        ].map((p, i) => (
          <div key={i} style={{
            padding: "14px 24px", background: "rgba(255,255,255,0.7)", borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.8)", textAlign: "center", minWidth: 140,
            backdropFilter: "blur(10px)", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
          }}>
            <div style={{ fontSize: 12, color: "var(--text-light)", fontWeight: 600, textTransform: "uppercase" }}>{p.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)", marginTop: 4 }}>{p.stat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
