import React, { useState } from 'react';

const W = 280, H = 280, CX = 140, CY = 140, R = 108, R_MID = 65;
const toRad = d => d * Math.PI / 180;
const FONT = '"Google Sans", Roboto, sans-serif';

// Google Blue spectrum for sectors
const SECTORS = [
  { id: 'third-man',  label: ['Third', 'Man'],  s: -90,  e: -45,  color: '#4285F4', light: '#C5D9FC' },
  { id: 'point',      label: ['Point'],          s: -45,  e:   0,  color: '#1A73E8', light: '#AECBFA' },
  { id: 'covers',     label: ['Covers'],         s:   0,  e:  45,  color: '#185ABC', light: '#8BB8F8' },
  { id: 'long-off',   label: ['Long', 'Off'],    s:  45,  e:  90,  color: '#0D47A1', light: '#669DF6' },
  { id: 'long-on',    label: ['Long', 'On'],     s:  90,  e: 135,  color: '#0D47A1', light: '#669DF6' },
  { id: 'mid-wicket', label: ['Mid', 'Wicket'],  s: 135,  e: 180,  color: '#185ABC', light: '#8BB8F8' },
  { id: 'fine-leg',   label: ['Fine', 'Leg'],    s: 180,  e: 225,  color: '#1A73E8', light: '#AECBFA' },
  { id: 'sq-leg',     label: ['Sq.', 'Leg'],     s: 225,  e: 270,  color: '#4285F4', light: '#C5D9FC' },
];

function arcPath(r, s, e) {
  const x1 = CX + r * Math.cos(toRad(s)), y1 = CY + r * Math.sin(toRad(s));
  const x2 = CX + r * Math.cos(toRad(e)), y2 = CY + r * Math.sin(toRad(e));
  return `M${CX},${CY} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 0,1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
}

function arcEdge(r, s, e) {
  const x1 = CX + r * Math.cos(toRad(s)), y1 = CY + r * Math.sin(toRad(s));
  const x2 = CX + r * Math.cos(toRad(e)), y2 = CY + r * Math.sin(toRad(e));
  return `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 0,1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
}

function pt(r, deg) {
  return [CX + r * Math.cos(toRad(deg)), CY + r * Math.sin(toRad(deg))];
}

export default function WagonWheel() {
  const [selected, setSelected] = useState(null);
  const [votes, setVotes] = useState(() =>
    SECTORS.reduce((a, s) => ({ ...a, [s.id]: Math.floor(Math.random() * 35) + 5 }), {})
  );
  const [shotLines, setShotLines] = useState({});
  const [hovered, setHovered]     = useState(null);

  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  const selectedSector = SECTORS.find(s => s.id === selected);

  const handleSelect = (sec) => {
    if (selected) return;
    setSelected(sec.id);
    setVotes(prev => ({ ...prev, [sec.id]: prev[sec.id] + 1 }));

    const lines = Array.from({ length: 8 }, (_, i) => {
      const spread = sec.e - sec.s - 10;
      const angle = sec.s + 5 + (i / 7) * spread + (Math.random() - 0.5) * 4;
      const isSix = Math.random() > 0.45;
      const r = isSix ? R - 4 + Math.random() * 4 : R_MID + 6 + Math.random() * 28;
      const [x, y] = pt(r, angle);
      return { x, y, isSix, delay: i * 55 };
    });
    setShotLines(prev => ({ ...prev, [sec.id]: lines }));
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "20px",
      boxShadow: "0 1px 3px rgba(60,64,67,0.15), 0 1px 2px rgba(60,64,67,0.3)",
      border: "1px solid #DADCE0",
      display: "flex", flexDirection: "column", gap: 14,
      fontFamily: FONT,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#5F6368",
        letterSpacing: 1, textTransform: "uppercase",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontFamily: FONT,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#4285F4">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
          Boundary Wagon Wheel
        </div>
        {selected && (
          <div style={{
            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
            background: "#E8F0FE", color: "#1A73E8", fontFamily: FONT,
          }}>✓ LOCKED</div>
        )}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ display: "block", width: "100%", overflow: "visible" }}>
        <defs>
          <radialGradient id="ww-outer" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#E8F5E9" />
            <stop offset="100%" stopColor="#C8E6C9" />
          </radialGradient>
          <radialGradient id="ww-inner" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#F1F8E9" />
            <stop offset="100%" stopColor="#DCEDC8" />
          </radialGradient>
          <filter id="ww-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ww-shot-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Field */}
        <circle cx={CX} cy={CY} r={R} fill="url(#ww-outer)" />
        <circle cx={CX} cy={CY} r={R_MID} fill="url(#ww-inner)" />

        {/* Sector vote fills */}
        {SECTORS.map(s => {
          const votePct = votes[s.id] / total;
          const isSel   = selected === s.id;
          const isHov   = hovered === s.id && !selected;
          return (
            <path key={s.id}
              d={arcPath(R, s.s, s.e)}
              fill={s.color}
              opacity={isSel ? 0.5 : isHov ? 0.32 : 0.04 + votePct * 0.24}
              onClick={() => handleSelect(s)}
              onMouseEnter={() => !selected && setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: selected ? 'default' : 'pointer', transition: 'opacity 0.2s' }}
            />
          );
        })}

        {/* Radial dividers */}
        {SECTORS.map(s => {
          const [x, y] = pt(R, s.s);
          return (
            <line key={s.id + '-d'} x1={CX} y1={CY} x2={x} y2={y}
              stroke="#DADCE0" strokeWidth={0.8} />
          );
        })}

        {/* 30-yard circle */}
        <circle cx={CX} cy={CY} r={R_MID} fill="none"
          stroke="#BDC1C6" strokeWidth={1} strokeDasharray="4 3" />

        {/* Boundary ring */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#9AA0A6" strokeWidth={1.5} />

        {/* Shot lines */}
        {Object.entries(shotLines).map(([id, lines]) =>
          lines.map((ln, i) => (
            <line key={`${id}-${i}`}
              x1={CX} y1={CY} x2={ln.x} y2={ln.y}
              stroke={ln.isSix ? '#FBBC05' : '#4285F4'}
              strokeWidth={ln.isSix ? 2.5 : 1.8}
              strokeLinecap="round"
              filter={ln.isSix ? 'url(#ww-shot-glow)' : 'none'}
              opacity={0}
              style={{ animation: `ww-draw 0.4s ease-out ${ln.delay}ms forwards` }}
            />
          ))
        )}

        {/* Selected arc glow */}
        {selected && selectedSector && (
          <path
            d={arcEdge(R, selectedSector.s, selectedSector.e)}
            fill="none" stroke={selectedSector.color} strokeWidth={4}
            filter="url(#ww-glow)" opacity={0.85}
          />
        )}

        {/* Hover arc hint */}
        {hovered && !selected && (() => {
          const sec = SECTORS.find(s => s.id === hovered);
          return sec ? (
            <path d={arcEdge(R, sec.s, sec.e)}
              fill="none" stroke={sec.color} strokeWidth={3} opacity={0.5} />
          ) : null;
        })()}

        {/* Pitch */}
        <rect x={CX - 8} y={CY - 22} width={16} height={44} rx={2}
          fill="#FFF8E1" stroke="#F9AB00" strokeWidth={0.8} />
        <line x1={CX - 13} y1={CY - 15} x2={CX + 13} y2={CY - 15}
          stroke="#F9AB00" strokeWidth={1} />
        <line x1={CX - 13} y1={CY + 15} x2={CX + 13} y2={CY + 15}
          stroke="#F9AB00" strokeWidth={1} />
        {[-4, 0, 4].map(ox => (
          <circle key={ox} cx={CX + ox} cy={CY - 21} r={1.5} fill="#5F6368" />
        ))}
        {[-4, 0, 4].map(ox => (
          <circle key={'b' + ox} cx={CX + ox} cy={CY + 21} r={1.5} fill="#5F6368" />
        ))}

        {/* Vote % after selection */}
        {selected && SECTORS.map(s => {
          const mid = (s.s + s.e) / 2;
          const [lx, ly] = pt(R - 14, mid);
          const pct = Math.round((votes[s.id] / total) * 100);
          return (
            <text key={s.id + '-pct'} x={lx} y={ly}
              textAnchor="middle" dominantBaseline="middle"
              fill={selected === s.id ? s.color : '#9AA0A6'}
              fontSize={8.5} fontWeight={selected === s.id ? 700 : 500}
              fontFamily={FONT}
            >{pct}%</text>
          );
        })}

        {/* Outer labels */}
        {SECTORS.map(s => {
          const mid = (s.s + s.e) / 2;
          const [lx, ly] = pt(R + 20, mid);
          const isSel = selected === s.id;
          return (
            <text key={s.id + '-lbl'} x={lx} y={ly}
              textAnchor="middle" dominantBaseline="middle"
              fill={isSel ? s.color : '#5F6368'}
              fontSize={9} fontWeight={isSel ? 700 : 500}
              fontFamily={FONT}
            >
              {s.label.map((w, wi) => (
                <tspan key={wi} x={lx} dy={wi === 0 ? (s.label.length > 1 ? -5 : 0) : 11}>
                  {w}
                </tspan>
              ))}
            </text>
          );
        })}
      </svg>

      {/* Shot legend */}
      {selected && (
        <div style={{
          display: "flex", justifyContent: "center", gap: 24,
          animation: "fadeIn 0.4s",
        }}>
          {[
            { color: '#4285F4', bg: '#E8F0FE', label: 'Four' },
            { color: '#FBBC05', bg: '#FEF7E0', label: 'Six' },
          ].map(({ color, bg, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 22, height: 3, background: color, borderRadius: 2 }} />
              <span style={{
                fontSize: 11, color: "#5F6368", fontWeight: 500, fontFamily: FONT,
              }}>{label}</span>
              <div style={{
                fontSize: 10, fontWeight: 700, color,
                background: bg, padding: "2px 8px", borderRadius: 100,
                fontFamily: FONT,
              }}>{label === 'Four' ? '4' : '6'}</div>
            </div>
          ))}
        </div>
      )}

      <p style={{
        fontSize: 12, textAlign: "center", color: "#5F6368",
        fontWeight: 500, fontFamily: FONT, margin: 0,
      }}>
        {selected
          ? `Locked in: ${selectedSector?.label.join(' ')} 🏏`
          : "Tap a zone — predict the next boundary direction"}
      </p>

      <style>{`
        @keyframes ww-draw {
          from { stroke-dasharray: 200; stroke-dashoffset: 200; opacity: 0; }
          to   { stroke-dasharray: 200; stroke-dashoffset: 0;   opacity: 1; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
