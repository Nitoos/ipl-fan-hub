import React, { useState } from 'react';

const FRIENDS = [
  { name: "Arjun", avatar: "A", online: true },
  { name: "Priya", avatar: "P", online: true },
  { name: "Rahul", avatar: "R", online: true },
  { name: "Sneha", avatar: "S", online: false },
  { name: "Vikram", avatar: "V", online: true },
];

const AVATAR_COLORS = ["#ea4335", "#4285f4", "#34a853", "#f9ab00", "#1a73e8", "#e37400", "#d93025", "#137333"];
function getAvatarColor(name) { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]; }

export function PrivateRoomModal({ onClose, onCreateRoom }) {
  const [roomName, setRoomName] = useState("");
  const [selected, setSelected] = useState([]);
  const [meetOn, setMeetOn] = useState(true);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 10000,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.25s ease-out", backdropFilter: "blur(4px)"
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 32, width: 440, overflow: "hidden",
        boxShadow: "var(--shadow-lg)",
        animation: "modalSlide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}>
        <div style={{ padding: "32px 32px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 500, color: "var(--text-main)" }}>Create watch room</h3>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--text-secondary)" }}>Invite friends to watch and chat live</p>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", width: 40, height: 40, borderRadius: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#f1f3f4"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={{ padding: "24px 32px" }}>
          <input
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            placeholder="Room Name (e.g. LSG Superfans)"
            style={{
              width: "100%", background: "#f8f9fa",
              border: "1px solid var(--border)", borderRadius: 12,
              padding: "16px 20px", color: "var(--text-main)", fontSize: 15,
            }}
          />

          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: 0.5, marginTop: 24, marginBottom: 12, textTransform: "uppercase" }}>Invite Friends</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 220, overflowY: "auto" }}>
            {FRIENDS.map(f => {
              const isSel = selected.includes(f.name);
              return (
                <div key={f.name}
                  onClick={() => setSelected(s => isSel ? s.filter(n => n !== f.name) : [...s, f.name])}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "10px 14px", borderRadius: 16, cursor: "pointer",
                    background: isSel ? "#e8f0fe" : "transparent",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = "#f8f9fa"; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: getAvatarColor(f.name),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 16, fontWeight: 700,
                  }}>{f.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "var(--text-main)", fontSize: 15, fontWeight: 500 }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: f.online ? "var(--success)" : "var(--text-light)", fontWeight: 500 }}>
                      {f.online ? "● Online" : "Offline"}
                    </div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    border: isSel ? "none" : "2px solid var(--border)",
                    background: isSel ? "var(--primary)" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}>
                    {isSel && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 24, padding: "16px", borderRadius: 20,
            background: "#f8f9fa", display: "flex", alignItems: "center", gap: 16,
            border: "1px solid var(--border)"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "var(--shadow-sm)",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <rect x="2" y="6" width="12" height="12" rx="2" fill="#1a73e8"/>
                <path d="M16 9.5l4-3v11l-4-3v-5z" fill="#34a853"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: "var(--text-main)", fontWeight: 700 }}>Google Meet</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Enable voice chat for room</div>
            </div>
            <div onClick={() => setMeetOn(!meetOn)} style={{
              width: 48, height: 26, borderRadius: 100, cursor: "pointer",
              background: meetOn ? "var(--primary)" : "#dadce0",
              position: "relative", transition: "background 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 3,
                left: meetOn ? 25 : 3,
                transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }} />
            </div>
          </div>
        </div>

        <div style={{ padding: "0 32px 32px", display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose} style={{
            padding: "12px 28px", borderRadius: 100,
            color: "var(--primary)", fontWeight: 700, fontSize: 15,
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#e8f0fe"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >Cancel</button>
          <button onClick={() => { onCreateRoom(roomName, selected); onClose(); }} style={{
            padding: "12px 32px", borderRadius: 100,
            background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: 15,
            boxShadow: "0 4px 12px rgba(26,115,232,0.4)",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--primary-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
          >Create Room</button>
        </div>
      </div>
    </div>
  );
}
