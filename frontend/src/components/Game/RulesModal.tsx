import React from 'react';
import './RulesModal.css';

interface RulesModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Challenge Rules</h2>
        </div>
        
        <div className="modal-body">
          <div className="rules-section">
            <h3>🎯 Objective</h3>
            <p>Complete all 6 rounds of puzzles to finish the challenge. Each round contains clues and validation steps.</p>
          </div>

          <div className="rules-section">
            <h3>📋 How to Play</h3>
            <ul>
              <li>Read each clue carefully</li>
              <li>Enter your answer in the input field</li>
              <li>Multiple correct answers may be accepted</li>
              <li>Use the hint button (ℹ️) if you need help</li>
              <li>Complete all steps in a round to proceed</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>⏱️ Timing</h3>
            <ul>
              <li>Take your time - there's no time limit</li>
              <li>After correct answers, wait 10 seconds before proceeding</li>
              <li>Your progress is automatically saved</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>🔍 Tips</h3>
            <ul>
              <li>Answers are case-insensitive</li>
              <li>Check for typos if your answer isn't accepted</li>
              <li>Some rounds have multiple steps - complete them all</li>
              <li>Round 5 requires a final code from volunteers</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>🏆 Final Round</h3>
            <p>Round 5 is the final challenge. Complete it to finish the game and be redirected to the completion page!</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="accept-button" onClick={onAccept}>
            I Understand - Start Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
