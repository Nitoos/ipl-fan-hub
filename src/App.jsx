import React, { useState, useEffect, useRef, useCallback } from 'react';
import Scoreboard from './components/Scoreboard';
import ReactionSystem, { ReactionBar } from './components/ReactionSystem';
import { VoteBar, PredictionPanel } from './components/EngagementHub';
import SocialPanel from './components/SocialPanel';
import { PrivateRoomModal } from './components/Modals';
import QuizSystem from './components/QuizSystem';
import MomentumSystem from './components/MomentumSystem';
import StadiumHeatmap from './components/StadiumHeatmap';
import PressureMeter from './components/PressureMeter';
import WagonWheel from './components/WagonWheel';
import PitchMap from './components/PitchMap';
import RivalryMeter from './components/RivalryMeter';

const MOCK_MESSAGES = [
  { id: 1, user: "CricketFan99", text: "Marsh is on FIRE tonight! 🔥", room: "global", time: "2m ago" },
  { id: 2, user: "BowlerKing", text: "Akash Singh 3 wickets, what a spell!", room: "global", time: "1m ago" },
  { id: 3, user: "SpinWizard", text: "86/0 in the powerplay is insane", room: "global", time: "45s ago" },
  { id: 4, user: "SixHitter", text: "Marsh 50 off just 21 balls! 💪", room: "global", time: "30s ago" },
];
const MSG_CAP = 50;

const MOCK_USERS = ["CricketFan99", "BowlerKing", "SixHitter", "SpinWizard", "PaceMaster", "SquareCut", "Googly_Guy", "CoverDrive"];

function UserProfile({ xp }) {
  const level = Math.floor(xp / 100) + 1;
  const pct = xp % 100;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, padding: "6px 16px 6px 6px",
      background: "#fff", borderRadius: 100,
      boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "var(--primary)", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff",
        boxShadow: "0 2px 4px rgba(26,115,232,0.3)"
      }}>You</div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main)" }}>Lvl {level}</span>
          <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 700 }}>⚡{xp} XP</span>
        </div>
        <div style={{ width: 80, height: 5, borderRadius: 100, background: "#f1f3f4", marginTop: 4 }}>
          <div style={{
            width: `${pct}%`, height: "100%", borderRadius: 100, background: "var(--primary)",
            transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [votes, setVotes] = useState({ A: 312, B: 189 });
  const [userVote, setUserVote] = useState(null);
  const [activePrediction, setActivePrediction] = useState(null);
  const [xp, setXp] = useState(145);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const nextMsgId = useRef(MOCK_MESSAGES.length + 1);
  const [chatRoom, setChatRoom] = useState("global");
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState("play");
  const [heartCount, setHeartCount] = useState(0);
  const [rivalryPoints, setRivalryPoints] = useState({ LSG: 1450, CSK: 1320 });
  const screenRef = useRef(null);

  const handleReaction = useCallback((emojiData) => {
    if (emojiData.emoji === '❤️') setHeartCount(prev => prev + 1);
    const rect = screenRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = 60 + Math.random() * (rect.width - 120);
    const y = 60 + Math.random() * (rect.height - 120);
    const id = Date.now() + Math.random();
    setFloatingEmojis(prev => [...prev, { ...emojiData, x, y, id }]);
  }, []);

  const removeEmoji = useCallback((id) => {
    setFloatingEmojis(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleVote = (team) => {
    if (userVote === team) return;
    setVotes(v => {
      const newVotes = { ...v };
      if (userVote) newVotes[userVote] -= 1;
      newVotes[team] += 1;
      return newVotes;
    });
    setUserVote(team);
  };

  const handlePredict = (p) => {
    setActivePrediction(p);
    setXp(x => x + p.xp);
    if (userVote) {
      const teamKey = userVote === 'A' ? 'LSG' : 'CSK';
      setRivalryPoints(prev => ({ ...prev, [teamKey]: prev[teamKey] + 20 }));
    }
  };

  const handleSendMessage = (text) => {
    setMessages(m => {
      const next = [...m, { id: nextMsgId.current++, user: "You", text, room: chatRoom, time: "Just now" }];
      return next.length > MSG_CAP ? next.slice(-MSG_CAP) : next;
    });
  };

  const handleCreateRoom = (name, friends) => {
    setActiveRoom({ name: name || "Match Room", friends });
    setMessages(m => {
      const next = [...m, {
        id: nextMsgId.current++, user: "System",
        text: `Room "${name || "Match Room"}" created with ${friends.length} friends!`,
        room: "room", time: "Just now",
      }];
      return next.length > MSG_CAP ? next.slice(-MSG_CAP) : next;
    });
    setChatRoom("room");
  };

  // Simulated live reactions
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.7) {
        const reactions = ["❤️", "🔥", "👏", "😮", "🎉", "💪"];
        const colors = ["#ea4335", "#f9ab00", "#fbbc04", "#4285f4", "#34a853", "#1a73e8"];
        const idx = Math.floor(Math.random() * reactions.length);
        handleReaction({ emoji: reactions[idx], burstColor: colors[idx] });
      }
    }, 4000);
    return () => clearInterval(iv);
  }, [handleReaction]);

  // Simulated live messages
  useEffect(() => {
    const phrases = [
      "Marsh is unstoppable! 🏏", "What a chase!", "Pooran is cooking 👨‍🍳",
      "Akash Singh is the GOAT today", "CSK need a wicket NOW", "Classic IPL thriller!",
      "Ekana is buzzing tonight!", "That boundary was pure class."
    ];
    const iv = setInterval(() => {
      if (Math.random() > 0.6) {
        setMessages(m => {
          const next = [...m, {
            id: nextMsgId.current++,
            user: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)],
            text: phrases[Math.floor(Math.random() * phrases.length)],
            room: "global", time: "Just now",
          }];
          return next.length > MSG_CAP ? next.slice(-MSG_CAP) : next;
        });
      }
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Top Bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px", background: "#fff", borderBottom: "1px solid var(--border)",
        flexShrink: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text-main)", letterSpacing: "-0.5px" }}>WatchParty</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
            background: "#fce8e6", borderRadius: 100,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--error)", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--error)" }}>LIVE</span>
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
            LSG vs CSK • Match 59
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <UserProfile xp={xp} />
          <button onClick={() => setShowRoomModal(true)} style={{
            background: "var(--primary)", borderRadius: 100,
            padding: "10px 24px", color: "#fff",
            fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 2px 8px rgba(26,115,232,0.3)",
            whiteSpace: "nowrap"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--primary-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create Room
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            width: 40, height: 40, borderRadius: 100, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#f1f3f4"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><polyline points={sidebarOpen ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}></polyline></svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Video & Score Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", background: "#f8f9fa" }}>
          {/* Stadium Background Pattern */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
            backgroundImage: "radial-gradient(#1a73e8 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }} />
          
          <div ref={screenRef} style={{
            flex: 1, margin: "16px 16px 0", borderRadius: 32, position: "relative",
            background: "#fff", border: "1px solid var(--border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.03)",
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Scoreboard />
            
            <ReactionSystem floatingEmojis={floatingEmojis} removeEmoji={removeEmoji} />

            <QuizSystem onComplete={(bonusXp) => setXp(prev => prev + bonusXp)} />

            <MomentumSystem onWaveTriggered={(bonusXp) => setXp(prev => prev + bonusXp)} />

            {/* Room Info Overlays */}
            {activeRoom && (
              <div style={{
                position: "absolute", top: 24, left: 24,
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 24px", background: "rgba(255,255,255,0.95)", borderRadius: 100,
                boxShadow: "var(--shadow-md)", border: "1px solid rgba(26,115,232,0.1)",
                backdropFilter: "blur(8px)",
                animation: "slideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--primary)" }}>{activeRoom.name}</span>
                <span style={{ width: 1, height: 16, background: "rgba(26,115,232,0.1)" }} />
                <span style={{ fontSize: 13, color: "var(--text-light)", fontWeight: 600 }}>{activeRoom.friends.length + 1} watching</span>
              </div>
            )}

            <div style={{
              position: "absolute", top: 24, right: 24,
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 20px", background: "rgba(255,255,255,0.95)", borderRadius: 100,
              boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)",
              backdropFilter: "blur(8px)"
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-main)" }}>24,316 watching</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 24px" }}>
            <ReactionBar onReact={handleReaction} />
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside style={{
            width: 360, borderLeft: "1px solid var(--border)", background: "var(--bg-main)",
            display: "flex", flexDirection: "column", animation: "fadeIn 0.3s ease-out",
            height: "100%", overflow: "hidden"
          }}>
            {/* Sidebar Tabs */}
            <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
              {[
                { key: "play", label: "🎮 Play", icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
                { key: "social", label: "💬 Chat", icon: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSidebarTab(tab.key)}
                  style={{
                    flex: 1, padding: "16px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    border: "none", background: "transparent",
                    borderBottom: sidebarTab === tab.key ? "3px solid var(--primary)" : "3px solid transparent",
                    color: sidebarTab === tab.key ? "var(--primary)" : "var(--text-secondary)",
                    fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={tab.icon}/></svg>
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
              {sidebarTab === "play" ? (
                <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ flexShrink: 0 }}><StadiumHeatmap /></div>
                  <div style={{ flexShrink: 0 }}><PressureMeter heartCount={heartCount} /></div>
                  <div style={{ flexShrink: 0 }}><WagonWheel /></div>
                  <div style={{ flexShrink: 0 }}><PitchMap /></div>
                  <div style={{ flexShrink: 0 }}><RivalryMeter lsgPoints={rivalryPoints.LSG} cskPoints={rivalryPoints.CSK} /></div>
                  <div style={{ flexShrink: 0 }}><PredictionPanel onPredict={handlePredict} activePrediction={activePrediction} xp={xp} /></div>
                  <div style={{ flexShrink: 0 }}><VoteBar votes={votes} onVote={handleVote} userVote={userVote} /></div>
                </div>
              ) : (
                <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <SocialPanel
                    messages={messages}
                    onSend={handleSendMessage}
                    chatRoom={chatRoom}
                    onToggleRoom={setChatRoom}
                  />
                </div>
              )}
            </div>
          </aside>
        )}
      </main>

      {showRoomModal && (
        <PrivateRoomModal
          onClose={() => setShowRoomModal(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}
    </div>
  );
}
