import React, { useState, useEffect } from 'react';

const SIZE = 240, CX = 120, CY = 120;
const R_FIELD    = 70;
const R_BOUND    = 72;
const R_STAND_IN = 76;
const R_STAND_OUT = 106;
const R_OUTER    = 112;

// Google brand colors for teams
const G_BLUE   = '#4285F4';
const G_YELLOW = '#FBBC05';

const FONT = '"Google Sans", Roboto, sans-serif';

const SECTORS = [
  { id: 'N',  label: 'North',  s: -89, e: -46, mid: -67.5 },
  { id: 'NE', label: 'N East', s: -44, e:  -1, mid: -22.5 },
  { id: 'E',  label: 'East',   s:   1, e:  44, mid:  22.5 },
  { id: 'SE', label: 'S East', s:  46, e:  89, mid:  67.5 },
  { id: 'S',  label: 'South',  s:  91, e: 134, mid: 112.5 },
  { id: 'SW', label: 'S West', s: 136, e: 179, mid: 157.5 },
  { id: 'W',  label: 'West',   s: 181, e: 224, mid: 202.5 },
  { id: 'NW', label: 'N West', s: 226, e: 269, mid: 247.5 },
];

const toRad = d => d * Math.PI / 180;
const pt    = (r, deg) => [CX + r * Math.cos(toRad(deg)), CY + r * Math.sin(toRad(deg))];
const f     = n => n.toFixed(2);

function donut(rIn, rOut, s, e) {
  const [ox1, oy1] = pt(rOut, s);
  const [ox2, oy2] = pt(rOut, e);
  const [ix2, iy2] = pt(rIn,  e);
  const [ix1, iy1] = pt(rIn,  s);
  return [
    `M${f(ox1)},${f(oy1)}`,
    `A${rOut},${rOut} 0 0,1 ${f(ox2)},${f(oy2)}`,
    `L${f(ix2)},${f(iy2)}`,
    `A${rIn},${rIn} 0 0,0 ${f(ix1)},${f(iy1)}`,
    'Z',
  ].join(' ');
}

export default function StadiumHeatmap() {
  const [hype,  setHype]  = useState(() => SECTORS.reduce((a, s) => ({ ...a, [s.id]: 0 }), {}));
  const [team,  setTeam]  = useState(() => SECTORS.reduce((a, s) => ({ ...a, [s.id]: 'LSG' }), {}));
  const [flash, setFlash] = useState(() => SECTORS.reduce((a, s) => ({ ...a, [s.id]: 0 }), {}));

  useEffect(() => {
    const spike = setInterval(() => {
      const sec = SECTORS[Math.floor(Math.random() * SECTORS.length)];
      const t   = Math.random() > 0.5 ? 'LSG' : 'CSK';
      setHype(prev  => ({ ...prev,  [sec.id]: Math.min(prev[sec.id] + 45, 100) }));
      setTeam(prev  => ({ ...prev,  [sec.id]: t }));
      setFlash(prev => ({ ...prev,  [sec.id]: prev[sec.id] + 1 }));
    }, 1400);

    const decay = setInterval(() => {
      setHype(prev => {
        const next = { ...prev };
        SECTORS.forEach(s => { next[s.id] = Math.max(next[s.id] - 4, 0); });
        return next;
      });
    }, 300);

    return () => { clearInterval(spike); clearInterval(decay); };
  }, []);

  const lsgZones   = SECTORS.filter(s => hype[s.id] > 25 && team[s.id] === 'LSG').length;
  const cskZones   = SECTORS.filter(s => hype[s.id] > 25 && team[s.id] === 'CSK').length;
  const totalHype  = Object.values(hype).reduce((a, b) => a + b, 0);
  const overallPct = Math.round(totalHype / (SECTORS.length * 100) * 100);

  const hypeColor = overallPct > 60
    ? { bg: '#FCE8E6', color: '#EA4335' }
    : overallPct > 30
    ? { bg: '#FEF7E0', color: '#F9AB00' }
    : { bg: '#F1F3F4', color: '#5F6368' };

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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#EA4335">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Live Fan Presence
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
          background: hypeColor.bg, color: hypeColor.color,
          fontFamily: FONT,
        }}>
          {overallPct}% HYPE
        </div>
      </div>

      {/* SVG Stadium */}
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: "100%", overflow: "visible" }}>
        <defs>
          <radialGradient id="sh-field" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#81C995" />
            <stop offset="65%"  stopColor="#34A853" />
            <stop offset="100%" stopColor="#137333" />
          </radialGradient>
          <filter id="sh-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="sh-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer stadium ring */}
        <circle cx={CX} cy={CY} r={R_OUTER} fill="#202124" />

        {/* Stand sections */}
        {SECTORS.map(s => {
          const h     = hype[s.id];
          const color = team[s.id] === 'LSG' ? G_BLUE : G_YELLOW;
          const [mx, my] = pt((R_STAND_IN + R_STAND_OUT) / 2, s.mid);

          return (
            <g key={s.id}>
              {/* Base stand */}
              <path d={donut(R_STAND_IN, R_STAND_OUT, s.s, s.e)}
                fill="#3C4043" />

              {/* Seat-row texture */}
              {[0.3, 0.6, 0.9].map((t, i) => {
                const r = R_STAND_IN + t * (R_STAND_OUT - R_STAND_IN);
                const [ax1, ay1] = pt(r, s.s);
                const [ax2, ay2] = pt(r, s.e);
                return (
                  <path key={i}
                    d={`M${f(ax1)},${f(ay1)} A${r},${r} 0 0,1 ${f(ax2)},${f(ay2)}`}
                    fill="none" stroke="#202124" strokeWidth={0.6} opacity={0.5} />
                );
              })}

              {/* Hype overlay */}
              <path d={donut(R_STAND_IN, R_STAND_OUT, s.s, s.e)}
                fill={color}
                opacity={0.08 + (h / 100) * 0.74}
                style={{ transition: "opacity 0.35s ease" }}
              />

              {/* Glow for high intensity */}
              {h > 55 && (
                <path d={donut(R_STAND_IN, R_STAND_OUT, s.s, s.e)}
                  fill={color}
                  opacity={(h - 55) / 120}
                  filter="url(#sh-glow)"
                />
              )}

              {/* Flash ripple */}
              {flash[s.id] > 0 && (
                <circle
                  key={`${s.id}-${flash[s.id]}`}
                  cx={mx} cy={my} r={10}
                  fill={color}
                  style={{
                    transformBox: "fill-box", transformOrigin: "center",
                    animation: "sh-ripple 0.65s ease-out forwards",
                    opacity: 0,
                  }}
                />
              )}

              {/* Stand label */}
              <text x={mx} y={my}
                textAnchor="middle" dominantBaseline="middle"
                fill={h > 25
                  ? (team[s.id] === 'LSG' ? '#AECBFA' : '#FDE293')
                  : '#9AA0A6'}
                fontSize={7.5} fontWeight={600} fontFamily={FONT}
                style={{ transition: "fill 0.4s" }}
              >{s.label}</text>
            </g>
          );
        })}

        {/* Aisle dividers */}
        {[-90, -45, 0, 45, 90, 135, 180, 225].map(deg => {
          const [ox, oy] = pt(R_OUTER, deg);
          const [ix, iy] = pt(R_STAND_IN, deg);
          return (
            <line key={deg}
              x1={ix} y1={iy} x2={ox} y2={oy}
              stroke="#202124" strokeWidth={1.8} />
          );
        })}

        {/* Playing field */}
        <circle cx={CX} cy={CY} r={R_FIELD} fill="url(#sh-field)" />

        {/* Boundary rope */}
        <circle cx={CX} cy={CY} r={R_BOUND}
          fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />

        {/* 30-yard circle */}
        <circle cx={CX} cy={CY} r={R_FIELD * 0.55}
          fill="none" stroke="rgba(255,255,255,0.18)"
          strokeWidth={1} strokeDasharray="3 3" />

        {/* Pitch */}
        <rect x={CX - 6} y={CY - 20} width={12} height={40} rx={1.5}
          fill="#FFF8E1" stroke="#F9AB00" strokeWidth={0.5} opacity={0.9} />
        <line x1={CX - 10} y1={CY - 13} x2={CX + 10} y2={CY - 13}
          stroke="rgba(255,255,255,0.8)" strokeWidth={1} />
        <line x1={CX - 10} y1={CY + 13} x2={CX + 10} y2={CY + 13}
          stroke="rgba(255,255,255,0.8)" strokeWidth={1} />
        {[-3.5, 0, 3.5].map(ox => (
          <g key={ox}>
            <circle cx={CX + ox} cy={CY - 19} r={1.2} fill="#5F6368" />
            <circle cx={CX + ox} cy={CY + 19} r={1.2} fill="#5F6368" />
          </g>
        ))}

        {/* Centre pulse */}
        {overallPct > 30 && (
          <circle cx={CX} cy={CY} r={4}
            fill="white" opacity={0.55 + overallPct / 280}
            filter="url(#sh-soft)"
          />
        )}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {[
          { color: G_BLUE,   label: 'LSG Fans', bg: '#E8F0FE', count: lsgZones },
          { color: G_YELLOW, label: 'CSK Fans', bg: '#FEF7E0', count: cskZones },
        ].map(({ color, label, bg, count }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            <span style={{
              fontSize: 12, fontWeight: 600, color: "#202124", fontFamily: FONT,
            }}>{label}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color,
              background: bg, padding: "2px 8px", borderRadius: 100,
              fontFamily: FONT,
            }}>
              {count} zone{count !== 1 ? 's' : ''}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes sh-ripple {
          0%   { transform: scale(0.5); opacity: 0.7; }
          100% { transform: scale(4);   opacity: 0;   }
        }
      `}</style>
    </div>
  );
}
