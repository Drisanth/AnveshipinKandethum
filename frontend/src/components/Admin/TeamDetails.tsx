import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { TeamRoundData } from '../../types';
import './TeamDetails.css';

interface TeamDetailsProps {
  teamId: string;
  onUpdate: () => void;
}

interface TeamData {
  teamId: string;
  teamName: string;
  currentRound: number;
  currentStep: number;
  totalAttempts: number;
  completedSteps: Array<{
    roundNumber: number;
    stepNumber: number;
    completedAt: string;
  }>;
  lastActivity: string;
}

const TeamDetails: React.FC<TeamDetailsProps> = ({ teamId, onUpdate }) => {
  const [team, setTeam] = useState<TeamData | null>(null);
  const [rounds, setRounds] = useState<TeamRoundData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editRound, setEditRound] = useState<TeamRoundData | null>(null);

  useEffect(() => {
    loadTeamDetails();
  }, [teamId]);

  const loadTeamDetails = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getTeamDetails(teamId);
      if (response.success) {
        setTeam(response.team);
        setRounds(response.rounds);
      }
    } catch (error) {
      setError('Failed to load team details');
      console.error('Error loading team details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetProgress = async () => {
    if (!window.confirm('Are you sure you want to reset this team\'s progress?')) {
      return;
    }

    try {
      const response = await adminAPI.updateTeamProgress(teamId, undefined, undefined, true);
      if (response.success) {
        loadTeamDetails();
        onUpdate();
      }
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const handleUpdateProgress = async (currentRound: number, currentStep: number) => {
    try {
      const response = await adminAPI.updateTeamProgress(teamId, currentRound, currentStep);
      if (response.success) {
        loadTeamDetails();
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleEditRound = (round: TeamRoundData) => {
    setEditRound(round);
    setShowEditForm(true);
  };

  const handleSaveRound = async (roundData: Partial<TeamRoundData>) => {
    try {
      const response = await adminAPI.updateTeamRounds(teamId, roundData);
      if (response.success) {
        setShowEditForm(false);
        setEditRound(null);
        loadTeamDetails();
      }
    } catch (error) {
      console.error('Error saving round:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="team-details">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="team-details">
        <div className="error-state">
          <h3>Error</h3>
          <p>{error || 'Team not found'}</p>
          <button onClick={loadTeamDetails}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="team-details">
      <div className="team-details-header">
        <h2>{team.teamName}</h2>
        <span className="team-id">{team.teamId}</span>
      </div>

      <div className="team-stats">
        <div className="stat-card">
          <div className="stat-value">{team.currentRound + 1}</div>
          <div className="stat-label">Current Round</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{team.currentStep + 1}</div>
          <div className="stat-label">Current Step</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{team.totalAttempts}</div>
          <div className="stat-label">Total Attempts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{team.completedSteps.length}</div>
          <div className="stat-label">Completed Steps</div>
        </div>
      </div>

      <div className="team-actions">
        <button 
          className="reset-button"
          onClick={handleResetProgress}
        >
          Reset Progress
        </button>
        <button 
          className="update-button"
          onClick={() => handleUpdateProgress(0, 0)}
        >
          Set to Round 1
        </button>
      </div>

      <div className="rounds-section">
        <h3>Rounds Data</h3>
        <div className="rounds-list">
          {rounds.map((round) => (
            <div key={round.roundNumber} className="round-card">
              <div className="round-header">
                <h4>Round {round.roundNumber + 1}</h4>
                <div className="round-status">
                  {team.currentRound > round.roundNumber ? (
                    <span className="status completed">Completed</span>
                  ) : team.currentRound === round.roundNumber ? (
                    <span className="status current">Current</span>
                  ) : (
                    <span className="status pending">Pending</span>
                  )}
                </div>
              </div>
              
              <div className="round-content">
                <div className="clue-preview">
                  <strong>Clue:</strong> 
                  {round.clueType === 'image' ? (
                    <img src={round.clueContent} alt="Clue" className="clue-thumbnail" />
                  ) : (
                    <span>{round.clueContent.substring(0, 100)}...</span>
                  )}
                </div>
                
                <div className="validation-steps">
                  <strong>Validation Steps:</strong> {round.validationSteps.length}
                </div>
                
                <div className="hint-preview">
                  <strong>Hint:</strong> {round.hint.substring(0, 80)}...
                </div>
              </div>
              
              <div className="round-actions">
                <button 
                  className="edit-button"
                  onClick={() => handleEditRound(round)}
                >
                  Edit Round
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditForm && editRound && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Round {editRound.roundNumber + 1}</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditRound(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <EditRoundForm 
                round={editRound}
                onSave={handleSaveRound}
                onCancel={() => {
                  setShowEditForm(false);
                  setEditRound(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Round Form Component
interface EditRoundFormProps {
  round: TeamRoundData;
  onSave: (roundData: Partial<TeamRoundData>) => void;
  onCancel: () => void;
}

const EditRoundForm: React.FC<EditRoundFormProps> = ({ round, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    clueContent: round.clueContent,
    hint: round.hint,
    validationSteps: JSON.stringify(round.validationSteps, null, 2)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validationSteps = JSON.parse(formData.validationSteps);
      onSave({
        ...round,
        clueContent: formData.clueContent,
        hint: formData.hint,
        validationSteps: validationSteps
      });
    } catch (error) {
      alert('Invalid JSON format for validation steps');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="form-group">
        <label>Clue Content</label>
        <textarea
          value={formData.clueContent}
          onChange={(e) => setFormData({ ...formData, clueContent: e.target.value })}
          rows={4}
        />
      </div>
      
      <div className="form-group">
        <label>Hint</label>
        <textarea
          value={formData.hint}
          onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
          rows={3}
        />
      </div>
      
      <div className="form-group">
        <label>Validation Steps (JSON)</label>
        <textarea
          value={formData.validationSteps}
          onChange={(e) => setFormData({ ...formData, validationSteps: e.target.value })}
          rows={8}
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
      </div>
    </form>
  );
};

export default TeamDetails;
