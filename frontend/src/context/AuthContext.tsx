import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: Team | null;
  userType: 'team' | 'admin' | null;
  token: string | null;
  login: (teamId: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Team | null>(null);
  const [userType, setUserType] = useState<'team' | 'admin' | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUserType && storedUser) {
      setToken(storedToken);
      setUserType(storedUserType as 'team' | 'admin');
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (teamId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authAPI.teamLogin(teamId);
      
      if (response.success) {
        setToken(response.token);
        setUserType('team');
        setUser(response.team || null);
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'team');
        localStorage.setItem('user', JSON.stringify(response.team));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authAPI.adminLogin(username, password);
      
      if (response.success) {
        setToken(response.token);
        setUserType('admin');
        setUser(response.admin as any);
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('user', JSON.stringify(response.admin));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    userType,
    token,
    login,
    adminLogin,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
