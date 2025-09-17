import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import TeamLogin from './components/Login/TeamLogin';
import AdminLogin from './components/Login/AdminLogin';
import GameRound from './components/Game/GameRound';
import AdminDashboard from './components/Admin/AdminDashboard';
import RulesModal from './components/Game/RulesModal';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; userType: 'team' | 'admin' }> = ({ 
  children, 
  userType 
}) => {
  const { userType: currentUserType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (currentUserType !== userType) {
    return <Navigate to={userType === 'team' ? '/login' : '/admin/login'} replace />;
  }

  return <>{children}</>;
};

// Team Game Component
const TeamGame: React.FC = () => {
  const { user } = useAuth();
  const [showRules, setShowRules] = useState(true);

  const handleAcceptRules = () => {
    setShowRules(false);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <GameRound teamId={user.teamId} />
      <RulesModal isOpen={showRules} onAccept={handleAcceptRules} />
    </>
  );
};

// Main App Routes
const AppRoutes: React.FC = () => {
  const { userType, logout } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content header-grid">
          <div className="header-left">
            <img src="/logo1.jpg" alt="Logo 1" className="header-logo" />
          </div>
          <div className="header-center">
            <h1 className="header-title">Anveshipin Kandethum</h1>
          </div>
          <div className="header-right">
            <img src="/logo2.jpg" alt="Logo 2" className="header-logo" />
          </div>
        </div>
        {userType && (
          <div className="header-toolbar">
            <span className="user-info">
              {userType === 'team' ? 'Team Mode' : 'Admin Mode'}
            </span>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            userType === 'team' ? <Navigate to="/game" replace /> : <TeamLogin onLoginSuccess={() => {}} />
          } />
          <Route path="/admin/login" element={
            userType === 'admin' ? <Navigate to="/admin" replace /> : <AdminLogin onLoginSuccess={() => {}} />
          } />

          {/* Protected Team Routes */}
          <Route path="/game" element={
            <ProtectedRoute userType="team">
              <TeamGame />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute userType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Malayalam Literary Association, VIT Vellore.</p>
      </footer>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;