import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

interface TeamLoginProps {
  onLoginSuccess: () => void;
}

const TeamLogin: React.FC<TeamLoginProps> = ({ onLoginSuccess }) => {
  const [teamId, setTeamId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teamId.trim()) {
      setError('Please enter your Team ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(teamId.trim());
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid Team ID. Please check and try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Team Login</h1>
          <p>Enter your Team ID to start the challenge</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="teamId">Team ID</label>
            <input
              type="text"
              id="teamId"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="Enter your Team ID"
              className={error ? 'error' : ''}
              disabled={isLoading}
              autoComplete="off"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Start Challenge'}
          </button>
        </form>

        <div className="login-footer">
          <p>Need help? Contact the event organizers.</p>
        </div>
      </div>
    </div>
  );
};

export default TeamLogin;
