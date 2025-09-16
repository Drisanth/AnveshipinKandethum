import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { AdminTeam } from '../../types';
import TeamList from './TeamList';
import TeamDetails from './TeamDetails';
import Analytics from './Analytics';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'teams' | 'analytics'>('teams');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getAllTeams();
      if (response.success) {
        setTeams(response.teams);
      }
    } catch (error) {
      setError('Failed to load teams');
      console.error('Error loading teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  const handleTeamUpdate = () => {
    loadTeams(); // Refresh teams list
    if (selectedTeam) {
      // Optionally refresh team details
    }
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-tabs">
          <button 
            className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            Teams Management
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={loadTeams}>Retry</button>
        </div>
      )}

      <div className="admin-content">
        {activeTab === 'teams' && (
          <div className="teams-section">
            <div className="teams-layout">
              <div className="teams-list-panel">
                <TeamList 
                  teams={teams}
                  selectedTeam={selectedTeam}
                  onTeamSelect={handleTeamSelect}
                  onTeamUpdate={handleTeamUpdate}
                />
              </div>
              
              <div className="team-details-panel">
                {selectedTeam ? (
                  <TeamDetails 
                    teamId={selectedTeam}
                    onUpdate={handleTeamUpdate}
                  />
                ) : (
                  <div className="no-selection">
                    <h3>Select a team to view details</h3>
                    <p>Choose a team from the list to view and manage their progress.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <Analytics teams={teams} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
