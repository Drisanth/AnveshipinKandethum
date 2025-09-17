import axios from 'axios';
import { AuthResponse, Round, ValidationResponse, Progress, AdminTeam, TeamRoundData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://anveshipinkandethum.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  teamLogin: async (teamId: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { teamId });
    return response.data;
  },

  adminLogin: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/admin/login', { username, password });
    return response.data;
  },

  verifyToken: async (): Promise<any> => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Game API
export const gameAPI = {
  getCurrentRound: async (teamId: string): Promise<{ success: boolean; round: Round }> => {
    const response = await api.get(`/game/round/${teamId}`);
    return response.data;
  },

  validateInput: async (
    teamId: string,
    roundNumber: number,
    stepNumber: number,
    userInput: string
  ): Promise<ValidationResponse> => {
    const response = await api.post('/game/validate', {
      teamId,
      roundNumber,
      stepNumber,
      userInput,
    });
    return response.data;
  },

  moveToNextRound: async (teamId: string): Promise<{ success: boolean; message: string; isGameComplete: boolean }> => {
    const response = await api.post('/game/next', { teamId });
    return response.data;
  },

  getHint: async (teamId: string, roundNumber: number): Promise<{ success: boolean; hint: string }> => {
    const response = await api.get(`/game/hint/${teamId}/${roundNumber}`);
    return response.data;
  },

  getProgress: async (teamId: string): Promise<{ success: boolean; progress: Progress }> => {
    const response = await api.get(`/game/progress/${teamId}`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getAllTeams: async (): Promise<{ success: boolean; teams: AdminTeam[] }> => {
    const response = await api.get('/admin/teams');
    return response.data;
  },

  getTeamDetails: async (teamId: string): Promise<{ success: boolean; team: any; rounds: TeamRoundData[] }> => {
    const response = await api.get(`/admin/team/${teamId}`);
    return response.data;
  },

  updateTeamProgress: async (
    teamId: string,
    currentRound?: number,
    currentStep?: number,
    resetProgress?: boolean
  ): Promise<{ success: boolean; message: string; team: any }> => {
    const response = await api.post(`/admin/team/${teamId}/update`, {
      currentRound,
      currentStep,
      resetProgress,
    });
    return response.data;
  },

  updateTeamRounds: async (teamId: string, roundData: Partial<TeamRoundData>): Promise<{ success: boolean; message: string; round: TeamRoundData }> => {
    const response = await api.post(`/admin/team/${teamId}/rounds`, roundData);
    return response.data;
  },

  createTeam: async (teamId: string, teamName: string): Promise<{ success: boolean; message: string; team: any }> => {
    const response = await api.post('/admin/teams', { teamId, teamName });
    return response.data;
  },

  deleteTeam: async (teamId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/admin/team/${teamId}`);
    return response.data;
  },

  getAnalytics: async (): Promise<{ success: boolean; analytics: any }> => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },
};

export default api;
