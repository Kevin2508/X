import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  user_id: number;
  user_name: string;
  email: string;
  display_name: string;
  profile_image?: string;
  cover_image?: string;
  bio?: string;
  date_of_birth?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string, rememberMe?: boolean) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = () => {
      try {
        const savedToken = localStorage.getItem('token') ?? sessionStorage.getItem('token');
        const savedUser = localStorage.getItem('user') ?? sessionStorage.getItem('user');

        console.log('Restoring auth...', { savedToken: !!savedToken, savedUser: !!savedUser });

        if (savedToken && savedUser) {
          setTokenState(savedToken);
          setUserState(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to restore auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []); // Run only once on mount

  const login = (newUser: User, newToken: string, rememberMe = true) => {
    setUserState(newUser);
    setTokenState(newToken);
    const primaryStorage = rememberMe ? localStorage : sessionStorage;
    const secondaryStorage = rememberMe ? sessionStorage : localStorage;

    secondaryStorage.removeItem('token');
    secondaryStorage.removeItem('user');
    primaryStorage.setItem('token', newToken);
    primaryStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUserState(null);
    setTokenState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const setUser = (updatedUser: User) => {
    setUserState(updatedUser);
    const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
