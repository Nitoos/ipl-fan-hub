import React, { useState, useEffect, useCallback } from 'react';

const QUIZZES = [
  {
    id: 1,
    question: "Who holds the record for the most centuries in IPL history?",
    options: ["Virat Kohli", "Chris Gayle", "Jos Buttler"],
    correct: 0,
    xp: 50
  },
  {
    id: 2,
    question: "Which team has won the most IPL titles?",
    options: ["CSK", "MI", "KKR"],
    correct: 1,
    xp: 50
  },
  {
    id: 3,
    question: "Who is known as the 'Universe Boss' in cricket?",
    options: ["MS Dhoni", "Chris Gayle", "AB de Villiers"],
    correct: 1,
    xp: 50
  }
];

export default function QuizSystem({ onComplete }) {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  // Trigger quiz randomly every 30-60 seconds for demo
  useEffect(() => {
    const trigger = () => {
      const quiz = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];
      setActiveQuiz(quiz);
      setSelectedOption(null);
      setShowResult(false);
      setTimeLeft(15);
    };

    const timer = setTimeout(trigger, 15000); // First quiz after 15s
    return () => clearTimeout(timer);
  }, []);

  const handleOptionSelect = useCallback((index) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);

    const isCorrect = index === activeQuiz?.correct;

    setTimeout(() => {
      if (isCorrect) onComplete(activeQuiz?.xp ?? 0);
      setActiveQuiz(null);
      setTimeout(() => {
        const nextQuiz = QUIZZES[Math.floor(Math.random() * QUIZZES.length)];
        setActiveQuiz(nextQuiz);
        setSelectedOption(null);
        setShowResult(false);
        setTimeLeft(15);
      }, 45000);
    }, 3000);
  }, [showResult, activeQuiz, onComplete]);

  useEffect(() => {
    if (activeQuiz && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (activeQuiz && timeLeft === 0 && !showResult) {
      handleOptionSelect(-1);
    }
  }, [activeQuiz, timeLeft, showResult, handleOptionSelect]);

  if (!activeQuiz) return null;

  return (
    <div style={{
      position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
      width: 380, background: "rgba(255,255,255,0.95)", borderRadius: 24,
      boxShadow: "var(--shadow-lg)", padding: "20px", border: "1px solid var(--primary)",
      zIndex: 1000, animation: "modalSlide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      backdropFilter: "blur(8px)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{
          background: "var(--primary)", color: "#fff", padding: "4px 12px",
          borderRadius: 100, fontSize: 11, fontWeight: 700, letterSpacing: 0.5
        }}>FLASH QUIZ</span>
        <span style={{ fontSize: 12, color: timeLeft < 5 ? "var(--error)" : "var(--text-secondary)", fontWeight: 700 }}>
          ⏱️ {timeLeft}s
        </span>
      </div>
      
      <h4 style={{ margin: "0 0 16px", fontSize: 15, color: "var(--text-main)", lineHeight: 1.4 }}>
        {activeQuiz.question}
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {activeQuiz.options.map((option, i) => {
          const isCorrect = i === activeQuiz.correct;
          const isSelected = i === selectedOption;
          let bgColor = "#f1f3f4";
          let borderColor = "transparent";
          let textColor = "var(--text-main)";

          if (showResult) {
            if (isCorrect) {
              bgColor = "#e6f4ea";
              borderColor = "var(--success)";
              textColor = "var(--success)";
            } else if (isSelected) {
              bgColor = "#fce8e6";
              borderColor = "var(--error)";
              textColor = "var(--error)";
            }
          } else if (isSelected) {
            borderColor = "var(--primary)";
            bgColor = "#e8f0fe";
          }

          return (
            <button
              key={i}
              onClick={() => handleOptionSelect(i)}
              disabled={showResult}
              style={{
                padding: "12px 16px", borderRadius: 12, textAlign: "left",
                background: bgColor, border: `2px solid ${borderColor}`,
                fontSize: 14, fontWeight: 500, color: textColor,
                transition: "all 0.2s"
              }}
            >
              {option}
              {showResult && isCorrect && <span style={{ float: "right" }}>✅</span>}
              {showResult && isSelected && !isCorrect && <span style={{ float: "right" }}>❌</span>}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div style={{
          marginTop: 16, textAlign: "center", fontSize: 13, fontWeight: 700,
          color: selectedOption === activeQuiz.correct ? "var(--success)" : "var(--error)",
          animation: "fadeIn 0.3s"
        }}>
          {selectedOption === activeQuiz.correct 
            ? `Correct! +${activeQuiz.xp} XP Earned ⚡` 
            : "Oops! Better luck next time."}
        </div>
      )}
    </div>
  );
}
