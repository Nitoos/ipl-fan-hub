import React from 'react';

// Google brand colors
const G_BLUE_DARK  = '#1A73E8';
const G_BLUE_MID   = '#4285F4';
const G_YELLOW_DARK = '#F9AB00';
const G_YELLOW_MID  = '#FBBC05';

// Arc geometry: 200° → 340° clockwise (140° upward arch)
const CX = 140, CY = 86, R = 72;
const ARC_START = 200, ARC_END = 340, ARC_SPAN = 140;

const toRad = d => d * Math.PI / 180;
const ARC_LEN = R * toRad(ARC_SPAN);

function ptOnArc(deg) {
  return [CX + R * Math.cos(toRad(deg)), CY + R * Math.sin(toRad(deg))];
}

function arcD(fromDeg, toDeg, sweep = 1) {
  const [x1, y1] = ptOnArc(fromDeg);
  const [x2, y2] = ptOnArc(toDeg);
  const span = Math.abs(toDeg - fromDeg);
  const large = span > 180 ? 1 : 0;
  return `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large} ${sweep} ${x2.toFixed(2)},${y2.toFixed(2)}`;
}

const CW_PATH  = arcD(ARC_START, ARC_END, 1);
const CCW_PATH = arcD(ARC_END, ARC_START, 0);

const FONT = '"Google Sans", Roboto, sans-serif';

export default function RivalryMeter({ lsgPoints = 1450, cskPoints = 1320 }) {
  const total   = lsgPoints + cskPoints;
  const lsgPct  = (lsgPoints / total) * 100;
  const cskPct  = 100 - lsgPct;
  const diff    = lsgPoints - cskPoints;
  const leading = diff >= 0 ? 'LSG' : 'CSK';
  const absDiff = Math.abs(diff);

  const lsgOffset = ARC_LEN * (1 - lsgPct / 100);
  const cskOffset = ARC_LEN * (1 - cskPct / 100);

  const splitDeg = ARC_START + (lsgPct / 100) * ARC_SPAN;
  const [spx, spy] = ptOnArc(splitDeg);

  const [tick50x, tick50y] = ptOnArc(ARC_START + ARC_SPAN / 2);
  const [lx, ly] = ptOnArc(ARC_START);
  const [rx, ry] = ptOnArc(ARC_END);

  const isDominating = Math.max(lsgPct, cskPct) > 60;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "20px",
      boxShadow: "0 1px 3px rgba(60,64,67,0.15), 0 1px 2px rgba(60,64,67,0.3)",
      border: "1px solid #DADCE0",
      display: "flex", flexDirection: "column", gap: 12,
      fontFamily: FONT,
    }}>
      {/* ── Title ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "#5F6368",
          letterSpacing: 1, textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: FONT,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#EA4335">
            <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.28L13 17v5l5-2.28C21.39 17.83 23 14.89 23 12c0-5.35-3.93-9.76-9-10.18zM11 2.06C5.95 2.5 2 6.81 2 12c0 2.89 1.61 5.83 4 7.72L11 22v-5l-2.28-2.28C7.81 13.6 7 11.88 7 10c0-3.73 2.58-6.86 6-7.95V2.05z"/>
          </svg>
          Fan Power Battle
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
          background: "#FCE8E6", color: "#EA4335",
          fontFamily: FONT, letterSpacing: 0.5,
        }}>● LIVE</div>
      </div>

      {/* ── Team cards ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* LSG */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12, flexShrink: 0,
              background: leading === 'LSG'
                ? `linear-gradient(135deg, ${G_BLUE_DARK}, ${G_BLUE_MID})`
                : "#F1F3F4",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: leading === 'LSG' ? "#fff" : "#5F6368",
              fontWeight: 700, fontSize: 13, fontFamily: FONT,
              boxShadow: leading === 'LSG'
                ? `0 0 0 3px ${G_BLUE_MID}33, 0 4px 12px ${G_BLUE_MID}55`
                : "none",
              animation: leading === 'LSG' ? "rm-pulse-lsg 2.4s ease-in-out infinite" : "none",
            }}>LSG</div>
            <div>
              <div style={{
                fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px",
                color: leading === 'LSG' ? G_BLUE_DARK : "#202124",
                display: "flex", alignItems: "baseline", gap: 4,
                fontFamily: FONT,
              }}>
                {lsgPoints.toLocaleString()}
                {leading === 'LSG' && (
                  <span style={{ fontSize: 11, color: G_BLUE_MID, fontWeight: 700 }}>▲</span>
                )}
              </div>
              <div style={{
                fontSize: 9, color: "#9AA0A6", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: 0.5, fontFamily: FONT,
              }}>Fan Power</div>
            </div>
          </div>
        </div>

        {/* VS pill */}
        <div style={{
          flexShrink: 0, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 2,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "#F1F3F4",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#5F6368", fontFamily: FONT,
          }}>VS</div>
          <div style={{ fontSize: 9, fontWeight: 600, color: "#9AA0A6", fontFamily: FONT }}>
            {absDiff > 0 ? `+${absDiff.toLocaleString()}` : 'TIED'}
          </div>
        </div>

        {/* CSK */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse" }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12, flexShrink: 0,
              background: leading === 'CSK'
                ? `linear-gradient(135deg, ${G_YELLOW_DARK}, ${G_YELLOW_MID})`
                : "#F1F3F4",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: leading === 'CSK' ? "#fff" : "#5F6368",
              fontWeight: 700, fontSize: 13, fontFamily: FONT,
              boxShadow: leading === 'CSK'
                ? `0 0 0 3px ${G_YELLOW_MID}55, 0 4px 12px ${G_YELLOW_MID}77`
                : "none",
              animation: leading === 'CSK' ? "rm-pulse-csk 2.4s ease-in-out infinite" : "none",
            }}>CSK</div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px",
                color: leading === 'CSK' ? G_YELLOW_DARK : "#202124",
                display: "flex", alignItems: "baseline", gap: 4,
                justifyContent: "flex-end", fontFamily: FONT,
              }}>
                {leading === 'CSK' && (
                  <span style={{ fontSize: 11, color: G_YELLOW_MID, fontWeight: 700 }}>▲</span>
                )}
                {cskPoints.toLocaleString()}
              </div>
              <div style={{
                fontSize: 9, color: "#9AA0A6", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: 0.5, fontFamily: FONT,
              }}>Fan Power</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Arc gauge ── */}
      <div style={{ position: "relative" }}>
        <svg viewBox="0 0 280 90" style={{ width: "100%", overflow: "visible" }}>
          <defs>
            <linearGradient id="rm-lsg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={G_BLUE_DARK} />
              <stop offset="100%" stopColor={G_BLUE_MID} />
            </linearGradient>
            <linearGradient id="rm-csk-grad" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={G_YELLOW_DARK} />
              <stop offset="100%" stopColor={G_YELLOW_MID} />
            </linearGradient>
            <filter id="rm-split-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="rm-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <path d={CW_PATH} fill="none" stroke="#E8EAED" strokeWidth={18} strokeLinecap="round" />

          {/* LSG fill */}
          <path d={CW_PATH} fill="none"
            stroke="url(#rm-lsg-grad)" strokeWidth={16} strokeLinecap="butt"
            strokeDasharray={ARC_LEN}
            strokeDashoffset={lsgOffset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
          />

          {/* CSK fill */}
          <path d={CCW_PATH} fill="none"
            stroke="url(#rm-csk-grad)" strokeWidth={16} strokeLinecap="butt"
            strokeDasharray={ARC_LEN}
            strokeDashoffset={cskOffset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
          />

          {/* 50% tick */}
          <circle cx={tick50x} cy={tick50y} r={3}
            fill="#BDC1C6" stroke="#E8EAED" strokeWidth={1} />

          {/* Split glow halo */}
          <circle cx={spx} cy={spy} r={11}
            fill="white" opacity={0.4}
            filter="url(#rm-soft-glow)"
            style={{ transition: "cx 1s cubic-bezier(0.4,0,0.2,1), cy 1s cubic-bezier(0.4,0,0.2,1)" }}
          />
          {/* Split marker */}
          <circle cx={spx} cy={spy} r={7}
            fill="white" stroke="#DADCE0" strokeWidth={1}
            filter="url(#rm-split-glow)"
            style={{ transition: "cx 1s cubic-bezier(0.4,0,0.2,1), cy 1s cubic-bezier(0.4,0,0.2,1)" }}
          />
          <circle cx={spx} cy={spy} r={3.5}
            fill={leading === 'LSG' ? G_BLUE_MID : G_YELLOW_MID}
            style={{ transition: "cx 1s cubic-bezier(0.4,0,0.2,1), cy 1s cubic-bezier(0.4,0,0.2,1), fill 0.5s" }}
          />

          {/* LSG % label */}
          <text x={lx - 4} y={ly + 16}
            textAnchor="middle" fill={G_BLUE_MID}
            fontSize={11} fontWeight={700} fontFamily={FONT}
          >{Math.round(lsgPct)}%</text>

          {/* CSK % label */}
          <text x={rx + 4} y={ry + 16}
            textAnchor="middle" fill={G_YELLOW_DARK}
            fontSize={11} fontWeight={700} fontFamily={FONT}
          >{Math.round(cskPct)}%</text>
        </svg>
      </div>

      {/* ── Status banner ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        padding: "10px 16px", borderRadius: 12,
        background: leading === 'LSG' ? "#E8F0FE" : "#FEF7E0",
        border: `1px solid ${leading === 'LSG' ? '#C5D9FC' : '#FDEAAD'}`,
      }}>
        <span style={{ fontSize: 15 }}>
          {isDominating ? (leading === 'LSG' ? '🔵' : '🟡') : '⚡'}
        </span>
        <span style={{
          fontSize: 13, fontWeight: 700, fontFamily: FONT,
          color: leading === 'LSG' ? G_BLUE_DARK : G_YELLOW_DARK,
        }}>
          {leading === 'LSG' ? 'LSG Army' : 'CSK Yellows'}
          {isDominating ? ' dominating!' : ' leading'}
        </span>
        <div style={{
          fontSize: 11, fontWeight: 700, fontFamily: FONT,
          padding: "3px 10px", borderRadius: 100,
          background: leading === 'LSG' ? G_BLUE_MID : G_YELLOW_MID,
          color: "#fff",
        }}>+{absDiff.toLocaleString()}</div>
      </div>

      <style>{`
        @keyframes rm-pulse-lsg {
          0%, 100% { box-shadow: 0 0 0 3px #4285F433, 0 4px 12px #4285F455; }
          50%       { box-shadow: 0 0 0 6px #4285F422, 0 4px 20px #4285F477; }
        }
        @keyframes rm-pulse-csk {
          0%, 100% { box-shadow: 0 0 0 3px #FBBC0555, 0 4px 12px #FBBC0577; }
          50%       { box-shadow: 0 0 0 6px #FBBC0533, 0 4px 20px #FBBC0599; }
        }
      `}</style>
    </div>
  );
}
