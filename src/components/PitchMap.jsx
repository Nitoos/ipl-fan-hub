import React, { useState } from 'react';

// Google brand colors per zone
const W = 120, H = 360;
const PX = 20, PY = 42, PW = 80, PH = 268;
const PCX = PX + PW / 2;
const ZH = PH / 5;

const FONT = '"Google Sans", Roboto, sans-serif';

const ZONES = [
  { id: 'short',       label: 'Short / Bouncer',   sub: 'Head-high territory', color: '#EA4335', tonal: '#FCE8E6', row: 0 },
  { id: 'back-length', label: 'Back of Length',     sub: 'Awkward length',      color: '#FBBC05', tonal: '#FEF7E0', row: 1 },
  { id: 'good',        label: 'Good Length',        sub: 'Classic wicket zone', color: '#34A853', tonal: '#E6F4EA', row: 2, prime: true },
  { id: 'full',        label: 'Full / Half Volley', sub: 'Driving territory',   color: '#4285F4', tonal: '#E8F0FE', row: 3 },
  { id: 'yorker',      label: 'Yorker',             sub: 'Death-over weapon',   color: '#A142F4', tonal: '#F3E8FD', row: 4 },
];

const zy = row => PY + row * ZH;

export default function PitchMap() {
  const [selected, setSelected] = useState(null);
  const [votes, setVotes] = useState(() =>
    ZONES.reduce((a, z) => ({ ...a, [z.id]: Math.floor(Math.random() * 50) + 10 }), {})
  );
  const [ballMark, setBallMark] = useState(null);
  const [hovered, setHovered]   = useState(null);

  const maxVotes = Math.max(...Object.values(votes));
  const total    = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = (zone) => {
    if (selected) return;
    setSelected(zone.id);
    setVotes(prev => ({ ...prev, [zone.id]: prev[zone.id] + 1 }));
    setBallMark({
      x: PX + 12 + Math.random() * (PW - 24),
      y: zy(zone.row) + 10 + Math.random() * (ZH - 20),
      color: zone.color,
    });
  };

  const selectedZone = ZONES.find(z => z.id === selected);

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "20px",
      boxShadow: "0 1px 3px rgba(60,64,67,0.15), 0 1px 2px rgba(60,64,67,0.3)",
      border: "1px solid #DADCE0",
      display: "flex", flexDirection: "column", gap: 14,
      fontFamily: FONT,
    }}>
      {/* Title */}
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#5F6368",
        letterSpacing: 1, textTransform: "uppercase",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: FONT,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#34A853">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          Pitch Pressure Zone
        </div>
        {selected && (
          <div style={{
            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
            background: "#E6F4EA", color: "#137333", fontFamily: FONT,
          }}>✓ VOTED</div>
        )}
      </div>

      {/* Layout */}
      <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>

        {/* SVG Pitch */}
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: 120, flexShrink: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id="pm-grass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#A8D5B5" />
              <stop offset="38%"  stopColor="#C8E6C9" />
              <stop offset="62%"  stopColor="#C8E6C9" />
              <stop offset="100%" stopColor="#A8D5B5" />
            </linearGradient>
            <linearGradient id="pm-clay" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#FFF3E0" />
              <stop offset="50%"  stopColor="#FFFDE7" />
              <stop offset="100%" stopColor="#FFF3E0" />
            </linearGradient>
          </defs>

          {/* Grass field */}
          <rect x={0} y={PY - 24} width={W} height={PH + 48}
            fill="url(#pm-grass)" rx={8} />

          {/* Clay pitch */}
          <rect x={PX} y={PY} width={PW} height={PH}
            fill="url(#pm-clay)" />

          {/* Zone heat fills */}
          {ZONES.map(z => {
            const intensity = votes[z.id] / maxVotes;
            const isSel = selected === z.id;
            const isHov = hovered === z.id && !selected;
            return (
              <rect key={z.id}
                x={PX} y={zy(z.row)} width={PW} height={ZH}
                fill={z.color}
                opacity={isSel ? 0.55 : isHov ? 0.38 : 0.04 + intensity * 0.22}
                onClick={() => handleVote(z)}
                onMouseEnter={() => !selected && setHovered(z.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: selected ? "default" : "pointer", transition: "opacity 0.2s" }}
              />
            );
          })}

          {/* Zone dividers */}
          {ZONES.slice(1).map(z => (
            <line key={z.id + '-div'}
              x1={PX} y1={zy(z.row)} x2={PX + PW} y2={zy(z.row)}
              stroke="rgba(0,0,0,0.07)" strokeWidth={0.8} />
          ))}

          {/* Pitch border */}
          <rect x={PX} y={PY} width={PW} height={PH}
            fill="none" stroke="#DADCE0" strokeWidth={1} />

          {/* Bowling crease (top) */}
          <line x1={PX - 10} y1={PY + 20} x2={PX + PW + 10} y2={PY + 20}
            stroke="white" strokeWidth={1.5} opacity={0.9} />
          <line x1={PX + 20} y1={PY + 6}  x2={PX + 20} y2={PY + 20}
            stroke="white" strokeWidth={1} opacity={0.8} />
          <line x1={PX + PW - 20} y1={PY + 6} x2={PX + PW - 20} y2={PY + 20}
            stroke="white" strokeWidth={1} opacity={0.8} />

          {/* Popping crease (bottom) */}
          <line x1={PX - 10} y1={PY + PH - 20} x2={PX + PW + 10} y2={PY + PH - 20}
            stroke="white" strokeWidth={1.5} opacity={0.9} />
          <line x1={PX + 20} y1={PY + PH - 20} x2={PX + 20} y2={PY + PH - 6}
            stroke="white" strokeWidth={1} opacity={0.8} />
          <line x1={PX + PW - 20} y1={PY + PH - 20} x2={PX + PW - 20} y2={PY + PH - 6}
            stroke="white" strokeWidth={1} opacity={0.8} />

          {/* Stumps top */}
          {[-8, 0, 8].map(ox => (
            <line key={'t' + ox}
              x1={PCX + ox} y1={PY - 16} x2={PCX + ox} y2={PY}
              stroke="#5F6368" strokeWidth={3} strokeLinecap="round" />
          ))}
          <line x1={PCX - 10} y1={PY - 16} x2={PCX + 10} y2={PY - 16}
            stroke="#5F6368" strokeWidth={2} strokeLinecap="round" />

          {/* Stumps bottom */}
          {[-8, 0, 8].map(ox => (
            <line key={'b' + ox}
              x1={PCX + ox} y1={PY + PH} x2={PCX + ox} y2={PY + PH + 16}
              stroke="#9AA0A6" strokeWidth={3} strokeLinecap="round" />
          ))}
          <line x1={PCX - 10} y1={PY + PH + 16} x2={PCX + 10} y2={PY + PH + 16}
            stroke="#9AA0A6" strokeWidth={2} strokeLinecap="round" />

          {/* End labels */}
          <text x={PCX} y={PY - 22} textAnchor="middle" dominantBaseline="middle"
            fill="#5F6368" fontSize={7} fontWeight={700} fontFamily={FONT}
            letterSpacing={0.5}>BOWLER</text>
          <text x={PCX} y={PY + PH + 30} textAnchor="middle" dominantBaseline="middle"
            fill="#5F6368" fontSize={7} fontWeight={700} fontFamily={FONT}
            letterSpacing={0.5}>BATSMAN</text>

          {/* Zone numbers / checkmark */}
          {ZONES.map(z => {
            const isSel = selected === z.id;
            return (
              <text key={z.id + '-n'}
                x={PCX} y={zy(z.row) + ZH / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill={isSel ? "#fff" : "rgba(0,0,0,0.18)"}
                fontSize={10} fontWeight={700} fontFamily={FONT}
              >
                {isSel ? "✓" : z.row + 1}
              </text>
            );
          })}

          {/* Ball mark */}
          {ballMark && (
            <g>
              <circle cx={ballMark.x} cy={ballMark.y} r={6}
                fill={ballMark.color}
                style={{
                  transformBox: "fill-box", transformOrigin: "center",
                  animation: "pm-ball 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards",
                  opacity: 0,
                }}
              />
              <line
                x1={ballMark.x - 4} y1={ballMark.y - 1}
                x2={ballMark.x + 4} y2={ballMark.y + 1}
                stroke="rgba(255,255,255,0.75)" strokeWidth={1} strokeLinecap="round"
                style={{ animation: "pm-ball 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards", opacity: 0 }}
              />
              <circle cx={ballMark.x} cy={ballMark.y} r={7}
                fill="none" stroke={ballMark.color} strokeWidth={1.5}
                style={{
                  transformBox: "fill-box", transformOrigin: "center",
                  animation: "pm-ripple 0.8s ease-out 0.2s forwards",
                  opacity: 0,
                }}
              />
            </g>
          )}
        </svg>

        {/* Zone list */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3, justifyContent: "center" }}>
          {ZONES.map(z => {
            const isSel = selected === z.id;
            const isHov = hovered === z.id && !selected;
            const pct  = Math.round((votes[z.id] / total) * 100);
            const barW = (votes[z.id] / maxVotes) * 100;

            return (
              <div key={z.id}
                onClick={() => !selected && handleVote(z)}
                onMouseEnter={() => !selected && setHovered(z.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "7px 9px", borderRadius: 8,
                  background: isSel ? z.tonal : isHov ? z.tonal + "99" : "transparent",
                  border: `1px solid ${isSel ? z.color + "55" : isHov ? z.color + "33" : "transparent"}`,
                  cursor: selected ? "default" : "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: z.color, flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, flex: 1, lineHeight: 1.2,
                    color: isSel ? z.color : "#202124", fontFamily: FONT,
                  }}>
                    {z.label}
                    {z.prime && <span style={{ marginLeft: 3, fontSize: 9 }}>⭐</span>}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, flexShrink: 0,
                    color: isSel ? z.color : "#9AA0A6", fontFamily: FONT,
                  }}>{pct}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 100, background: "#F1F3F4", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${barW}%`, borderRadius: 100,
                    background: z.color, opacity: isSel ? 1 : 0.5,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{
        fontSize: 12, textAlign: "center", color: "#5F6368",
        fontWeight: 500, fontFamily: FONT, margin: 0,
      }}>
        {selected
          ? `You predicted: ${selectedZone?.label}! 🎯`
          : "Vote where the next wicket-taking delivery will pitch"}
      </p>

      <style>{`
        @keyframes pm-ball {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.6); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes pm-ripple {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(4); opacity: 0;   }
        }
      `}</style>
    </div>
  );
}
