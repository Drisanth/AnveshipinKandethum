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
              <li>Only one member from a team can be logged in. Multiple login may cause disqualification</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>⏱️ Timing</h3>
            <ul>
              <li>Take your time - You should complete all the round by 12:30 PM</li>
              <li>Your progress is automatically saved</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>🔍 Tips</h3>
            <ul>
              <li>Answers are case-insensitive</li>
              <li>Check for typos if your answer isn't accepted</li>
              <li>Some rounds have multiple steps - complete them all</li>
              <li>Save your answers somewhere before proceeding to resume in case of errors.</li>
              <li>If your answers are not accepted, try all lower case and upper case</li>
              <li>Most of the answers are in manglish😉</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>🏆 Final Round</h3>
            <p>Finally you will get a destination, treassure lays there awaiting you.</p>
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
