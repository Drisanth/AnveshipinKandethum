import React from 'react';
import './Modal.css';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content error-modal">
        <div className="modal-header">
          <h2>❌ Try Again</h2>
        </div>
        
        <div className="modal-body">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <p>{message}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="error-button" onClick={onClose}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
