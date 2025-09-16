import React, { useState, useEffect } from 'react';
import { gameAPI } from '../../services/api';
import './Modal.css';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  roundNumber: number;
}

const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, teamId, roundNumber }) => {
  const [hint, setHint] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHint();
    }
  }, [isOpen, teamId, roundNumber]);

  const loadHint = async () => {
    try {
      setIsLoading(true);
      const response = await gameAPI.getHint(teamId, roundNumber);
      if (response.success) {
        setHint(response.hint);
      }
    } catch (error) {
      console.error('Error loading hint:', error);
      setHint('Unable to load hint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>💡 Hint for Round {roundNumber + 1}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading hint...</p>
            </div>
          ) : (
            <div className="hint-content">
              <p>{hint}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="close-modal-button" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HintModal;
