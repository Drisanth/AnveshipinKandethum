import React, { useState } from 'react';
import { adminAPI } from '../../services/api';
import { AdminTeam } from '../../types';
import './TeamList.css';

interface TeamListProps {
  teams: AdminTeam[];
  selectedTeam: string | null;
  onTeamSelect: (teamId: string) => void;
  onTeamUpdate: () => void;
}

const TeamList: React.FC<TeamListProps> = ({ teams, selectedTeam, onTeamSelect, onTeamUpdate }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamId, setNewTeamId] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTeamId.trim() || !newTeamName.trim()) {
      setError('Both Team ID and Team Name are required');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const response = await adminAPI.createTeam(newTeamId.trim(), newTeamName.trim());
      if (response.success) {
        setNewTeamId('');
        setNewTeamName('');
        setShowCreateForm(false);
        onTeamUpdate();
      } else {
        setError('Failed to create team');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create team');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!window.confirm(`Are you sure you want to delete team ${teamId}?`)) {
      return;
    }

    try {
      const response = await adminAPI.deleteTeam(teamId);
      if (response.success) {
        onTeamUpdate();
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const getProgressPercentage = (team: AdminTeam) => {
    return Math.round(((team.currentRound + 1) / 6) * 100);
  };

  const getStatusColor = (team: AdminTeam) => {
    if (team.currentRound >= 5) return '#28a745'; // Completed
    if (team.currentRound >= 3) return '#ffc107'; // In progress
    return '#6c757d'; // Not started
  };

  return (
    <div className="team-list">
      <div className="team-list-header">
        <h2>Teams ({teams.length})</h2>
        <button 
          className="create-team-button"
          onClick={() => setShowCreateForm(true)}
        >
          + Add Team
        </button>
      </div>

      {showCreateForm && (
        <div className="create-team-form">
          <h3>Create New Team</h3>
          <form onSubmit={handleCreateTeam}>
            <div className="form-group">
              <label htmlFor="newTeamId">Team ID</label>
              <input
                type="text"
                id="newTeamId"
                value={newTeamId}
                onChange={(e) => setNewTeamId(e.target.value)}
                placeholder="e.g., TEAM006"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newTeamName">Team Name</label>
              <input
                type="text"
                id="newTeamName"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g., Team Alpha"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="form-actions">
              <button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Team'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowCreateForm(false);
                  setError('');
                  setNewTeamId('');
                  setNewTeamName('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="teams-grid">
        {teams.map((team) => (
          <div 
            key={team.teamId}
            className={`team-card ${selectedTeam === team.teamId ? 'selected' : ''}`}
            onClick={() => onTeamSelect(team.teamId)}
          >
            <div className="team-card-header">
              <h3>{team.teamName}</h3>
              <span className="team-id">{team.teamId}</span>
            </div>
            
            <div className="team-progress">
              <div className="progress-info">
                <span className="round-info">
                  Round {team.currentRound + 1} of 6
                </span>
                <span className="attempts">
                  {team.totalAttempts} attempts
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${getProgressPercentage(team)}%`,
                    backgroundColor: getStatusColor(team)
                  }}
                ></div>
              </div>
            </div>

            <div className="team-actions">
              <button 
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTeam(team.teamId);
                }}
                title="Delete team"
              >
                🗑️
              </button>
            </div>

            <div className="team-status">
              <span 
                className="status-indicator"
                style={{ backgroundColor: getStatusColor(team) }}
              ></span>
              <span className="status-text">
                {team.currentRound >= 5 ? 'Completed' : 
                 team.currentRound > 0 ? 'In Progress' : 'Not Started'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="no-teams">
          <p>No teams found. Create your first team to get started.</p>
        </div>
      )}
    </div>
  );
};

export default TeamList;
