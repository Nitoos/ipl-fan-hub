import React, { useState, useRef, useEffect } from 'react';

const AVATAR_COLORS = ["#ea4335", "#4285f4", "#34a853", "#f9ab00", "#1a73e8", "#e37400", "#d93025", "#137333"];
function getAvatarColor(name) { return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]; }

export default function SocialPanel({ messages, onSend, chatRoom, onToggleRoom }) {
  const [msg, setMsg] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filtered = messages.filter(m => m.room === chatRoom);

  const handleSendMessage = () => {
    if (msg.trim()) {
      onSend(msg);
      setMsg("");
    }
  };

  return (
    <div style={{
      background: "#fff", borderRadius: 24, flex: 1, display: "flex", flexDirection: "column",
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
      overflow: "hidden", minHeight: 0
    }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
        {[
          { key: "global", label: "🌍 Global" },
          { key: "room", label: "🔒 Room" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => onToggleRoom(key)} style={{
            flex: 1, padding: "12px 0",
            border: "none",
            background: chatRoom === key ? "#fff" : "#f8f9fa",
            borderBottom: chatRoom === key ? "3px solid var(--primary)" : "3px solid transparent",
            color: chatRoom === key ? "var(--primary)" : "var(--text-secondary)",
            fontWeight: 800, fontSize: 13,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}>{label}</button>
        ))}
      </div>

      <div className="chat-scroll-area" style={{
        flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12,
        minHeight: 0, scrollbarWidth: "thin"
      }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-light)", fontSize: 14 }}>
            {chatRoom === "room" ? "Create a private room to chat with friends" : "Join the conversation!"}
          </div>
        )}
        {filtered.map((m) => (
          <div key={m.id} style={{ display: "flex", gap: 12, animation: "slideIn 0.3s ease-out" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: getAvatarColor(m.user),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>{m.user[0]}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>{m.user}</span>
                <span style={{ fontSize: 11, color: "var(--text-light)" }}>{m.time}</span>
              </div>
              <div style={{
                fontSize: 14, color: "var(--text-main)", lineHeight: 1.5,
                marginTop: 2, background: m.user === "You" ? "#f1f3f4" : "transparent",
                padding: m.user === "You" ? "6px 12px" : "0",
                borderRadius: "0 12px 12px 12px",
                display: "inline-block"
              }}>{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
          placeholder={chatRoom === "global" ? "Message everyone..." : "Message your room..."}
          style={{
            flex: 1, background: "#f1f3f4", border: "none", borderRadius: 100,
            padding: "12px 20px", color: "var(--text-main)", fontSize: 14,
          }}
        />
        <button onClick={handleSendMessage} style={{
          background: "var(--primary)", border: "none", borderRadius: 100,
          width: 44, height: 44, display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: "0 2px 6px rgba(26,115,232,0.3)",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  );
}
