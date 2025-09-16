import React from 'react';
import './Modal.css';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  onProceed?: () => void; // when provided, show "Go to Next Round" button
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, message, onProceed }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content success-modal">
        <div className="modal-header">
          <h2>🎉 Success!</h2>
        </div>
        
        <div className="modal-body">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <p>{message}</p>
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', gap: 12 }}>
          <button className="success-button" onClick={onProceed || onClose}>
            Go to Next Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
