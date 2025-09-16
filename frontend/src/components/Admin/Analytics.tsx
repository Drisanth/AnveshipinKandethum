import React from 'react';
import { AdminTeam } from '../../types';
import './Analytics.css';

interface AnalyticsProps {
  teams: AdminTeam[];
}

const Analytics: React.FC<AnalyticsProps> = ({ teams }) => {
  const getTeamsByRound = () => {
    const roundStats = Array.from({ length: 6 }, (_, i) => ({
      round: i + 1,
      count: teams.filter(team => team.currentRound === i).length
    }));
    return roundStats;
  };

  const getCompletionStats = () => {
    const completed = teams.filter(team => team.currentRound >= 5).length;
    const inProgress = teams.filter(team => team.currentRound > 0 && team.currentRound < 5).length;
    const notStarted = teams.filter(team => team.currentRound === 0).length;
    
    return { completed, inProgress, notStarted };
  };

  const getAverageAttempts = () => {
    if (teams.length === 0) return 0;
    const totalAttempts = teams.reduce((sum, team) => sum + team.totalAttempts, 0);
    return Math.round(totalAttempts / teams.length);
  };

  const getTopPerformers = () => {
    return teams
      .sort((a, b) => {
        if (a.currentRound !== b.currentRound) {
          return b.currentRound - a.currentRound;
        }
        return a.totalAttempts - b.totalAttempts;
      })
      .slice(0, 5);
  };

  const roundStats = getTeamsByRound();
  const completionStats = getCompletionStats();
  const averageAttempts = getAverageAttempts();
  const topPerformers = getTopPerformers();

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <p>Overview of team performance and progress</p>
      </div>

      <div className="analytics-grid">
        <div className="stat-card total-teams">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{teams.length}</div>
            <div className="stat-label">Total Teams</div>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">{completionStats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-card in-progress">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{completionStats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card average-attempts">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{averageAttempts}</div>
            <div className="stat-label">Avg Attempts</div>
          </div>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-card">
          <h3>Teams by Round</h3>
          <div className="round-chart">
            {roundStats.map((stat) => (
              <div key={stat.round} className="round-bar">
                <div className="round-label">Round {stat.round}</div>
                <div className="bar-container">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${teams.length > 0 ? (stat.count / teams.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="round-count">{stat.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Completion Status</h3>
          <div className="completion-chart">
            <div className="completion-item completed">
              <div className="completion-bar">
                <div 
                  className="completion-fill"
                  style={{ 
                    width: `${teams.length > 0 ? (completionStats.completed / teams.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="completion-label">
                <span>Completed</span>
                <span>{completionStats.completed}</span>
              </div>
            </div>
            
            <div className="completion-item in-progress">
              <div className="completion-bar">
                <div 
                  className="completion-fill"
                  style={{ 
                    width: `${teams.length > 0 ? (completionStats.inProgress / teams.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="completion-label">
                <span>In Progress</span>
                <span>{completionStats.inProgress}</span>
              </div>
            </div>
            
            <div className="completion-item not-started">
              <div className="completion-bar">
                <div 
                  className="completion-fill"
                  style={{ 
                    width: `${teams.length > 0 ? (completionStats.notStarted / teams.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="completion-label">
                <span>Not Started</span>
                <span>{completionStats.notStarted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="top-performers">
        <h3>Top Performers</h3>
        <div className="performers-list">
          {topPerformers.map((team, index) => (
            <div key={team.teamId} className="performer-card">
              <div className="performer-rank">
                #{index + 1}
              </div>
              <div className="performer-info">
                <div className="performer-name">{team.teamName}</div>
                <div className="performer-id">{team.teamId}</div>
              </div>
              <div className="performer-stats">
                <div className="performer-round">Round {team.currentRound + 1}</div>
                <div className="performer-attempts">{team.totalAttempts} attempts</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
