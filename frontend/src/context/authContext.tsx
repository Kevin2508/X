import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData: AuthUser) => {
    setUserState(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const setUser = (userData: AuthUser) => {
    setUserState(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
