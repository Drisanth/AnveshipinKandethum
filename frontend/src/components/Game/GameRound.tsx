import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gameAPI } from '../../services/api';
import { Round, ValidationResponse } from '../../types';
import HintModal from './HintModal';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import './GameRound.css';

interface GameRoundProps {
  teamId: string;
}

const GameRound: React.FC<GameRoundProps> = ({ teamId }) => {
  const { user } = useAuth();
  const [round, setRound] = useState<Round | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [nextClue, setNextClue] = useState('');
  const [nextClueType, setNextClueType] = useState<'text' | 'image'>('text');
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    loadCurrentRound();
  }, [teamId]);

  // No countdown; proceed button appears immediately after success

  const loadCurrentRound = async () => {
    try {
      setIsLoading(true);
      const response = await gameAPI.getCurrentRound(teamId);
      if (response.success) {
        setRound(response.round);
      }
    } catch (error) {
      console.error('Error loading round:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim() || !round) return;

    setIsValidating(true);
    try {
      const response: ValidationResponse = await gameAPI.validateInput(
        teamId,
        round.roundNumber,
        round.currentStep.stepNumber,
        userInput.trim()
      );

      if (response.success) {
        // If final round (round 5) last step is correct, redirect to external link immediately
        if (response.isLastStep && round.roundNumber === 5) {
          window.location.href = 'https://example.org/completed';
          return;
        }

        // Only show success popup for last step, and provide Next Round CTA
        if (response.isLastStep) {
          setSuccessMessage('You are good to go!');
          setCanProceed(true);
          setShowSuccess(true);
        } else {
          // For intermediate steps, just reveal additional clue without opening success popup
          setNextClue(response.nextClue || '');
          setNextClueType(response.nextClueType || 'text');
        }
        setUserInput('');
      } else {
        setErrorMessage(response.message);
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage('Validation failed. Please try again.');
      setShowError(true);
    } finally {
      setIsValidating(false);
    }
  };

  const handleNextRound = async () => {
    // Backend already advanced round on final step success. Just refresh UI.
    setShowSuccess(false);
    setCanProceed(false);
    await loadCurrentRound();
  };

  const handleHintClick = () => {
    setShowHint(true);
  };

  if (isLoading) {
    return (
      <div className="game-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading round...</p>
        </div>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="game-container">
        <div className="error-state">
          <h2>Round not found</h2>
          <p>Unable to load the current round. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="team-info">
          <h1>{user?.teamName}</h1>
          <p>Team ID: {user?.teamId}</p>
        </div>
        <div className="progress-info">
          <div className="round-indicator">
            Round {round.roundNumber + 1} of 6
          </div>
          <div className="step-indicator">
            Step {round.currentStep.stepNumber + 1} of {round.totalSteps}
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((round.roundNumber + 1) / 6) * 100}%` }}
        ></div>
      </div>

      <div className="round-content">
        <div className="clue-section">
          <div className="clue-header">
            <h2>Clue</h2>
            <button 
              className="hint-button"
              onClick={handleHintClick}
              title="Get hint"
            >
              ℹ️
            </button>
          </div>
          
          <div className="clue-content">
            {round.clueType === 'image' ? (
              <img 
                src={round.clueContent} 
                alt="Clue" 
                className="clue-image"
              />
            ) : (
              <p className="clue-text">{round.clueContent}</p>
            )}
          </div>
        </div>

        {nextClue && (
          <div className="additional-clue">
            <h3>Additional Information</h3>
            {nextClueType === 'image' ? (
              <img 
                src={nextClue} 
                alt="Additional clue" 
                className="clue-image"
              />
            ) : (
              <p className="clue-text">{nextClue}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="input-section">
          <div className="input-group">
            <label htmlFor="answer">
              Your Answer ({round.currentStep.inputType})
            </label>
            <input
              type="text"
              id="answer"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={`Enter your ${round.currentStep.inputType} answer`}
              disabled={isValidating || round.currentStep.isCompleted}
              className={round.currentStep.isCompleted ? 'completed' : ''}
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={!userInput.trim() || isValidating || round.currentStep.isCompleted}
          >
            {isValidating ? 'Validating...' : 
             round.currentStep.isCompleted ? 'Completed' : 
             'Submit Answer'}
          </button>
        </form>

        {/* Next-round inline section removed; action moved to success modal */}
      </div>

      <HintModal 
        isOpen={showHint}
        onClose={() => setShowHint(false)}
        teamId={teamId}
        roundNumber={round.roundNumber}
      />

      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message={successMessage}
        onProceed={canProceed ? handleNextRound : undefined}
      />

      <ErrorModal 
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
    </div>
  );
};

export default GameRound;
