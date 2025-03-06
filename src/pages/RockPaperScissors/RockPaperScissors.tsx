import React from "react";
import "./RockPaperScissors.css";
import { useRockPaperScissors, choices, choiceEmojis } from "@/models/rps";

const RockPaperScissors: React.FC = () => {
  const {
    result,
    playerChoice,
    computerChoice,
    displayedComputerChoice,
    isAnimating,
    resultType,
    history,
    lastKeyPressed,
    playGame,
    clearHistory
  } = useRockPaperScissors();

  return (
    <div className="game2-container">
      <h1 className="game2-title">Oẳn Tù Tì</h1>
      
      <div className="keyboard-instructions">
        Bạn có thể sử dụng bàn phím: <kbd>1</kbd> = Kéo, <kbd>2</kbd> = Búa, <kbd>3</kbd> = Bao
      </div>
      
      <div className="game-layout">
        <div className="game-main-content">
          <div className="player-computer-row">
            <div className="game2-button">
              {choices.map((choice, index) => (
                <button
                  key={choice}
                  onClick={() => playGame(choice)}
                  className={`choice-button ${lastKeyPressed === (index + 1).toString() ? "key-pressed" : ""}`}
                  disabled={isAnimating}
                >
                  <span className="key-hint">{index + 1}</span> {choice} {choiceEmojis[choice]}
                </button>
              ))}
            </div>
            
            <div className="computer-choice-box">
              <div className="computer-choice-title">Lựa chọn của máy:</div>
              <div className="computer-choice-display">
                {isAnimating || displayedComputerChoice ? 
                  choiceEmojis[displayedComputerChoice || choices[0]] : 
                  <span className="empty-choice">?</span>}
              </div>
              {(isAnimating || displayedComputerChoice) && 
                <div className="computer-choice-name">{displayedComputerChoice}</div>}
            </div>
          </div>
          
          {result && !isAnimating && (
            <div className={`result ${resultType}`}>
              <div className="result-choices">
                <span className="player-choice">Bạn: {playerChoice} {choiceEmojis[playerChoice]}</span>
                <span> vs </span>
                <span className="computer-choice">Máy: {computerChoice} {choiceEmojis[computerChoice]}</span>
              </div>
              <div className="result-text">{result}</div>
            </div>
          )}
        </div>
        
        <div className="history-section">
          <div className="history-header">
            <h3 className="history-title">Lịch sử trận đấu:</h3>
            {history.length > 0 && (
              <button 
                className="clear-history-btn" 
                onClick={clearHistory}
                title="Xóa lịch sử"
              >
                <span>🗑️</span> Xóa lịch sử
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p>Chưa có trận đấu nào</p>
          ) : (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={index} className={`history-item ${item.resultType}`}>
                  Bạn: {item.player} {choiceEmojis[item.player]} - Máy: {item.computer} {choiceEmojis[item.computer]} ⟹ {item.result}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RockPaperScissors;