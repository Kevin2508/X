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
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider wrapper
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, restore user from localStorage if token exists
  useEffect(() => {
    const restoreAuth = () => {
      try {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        console.log('Restoring auth...', { savedToken: !!savedToken, savedUser: !!savedUser });

        if (savedToken && savedUser) {
          setTokenState(savedToken);
          setUserState(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to restore auth:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        // Mark loading as complete AFTER trying to restore
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []); // Run only once on mount

  const login = (newUser: User, newToken: string) => {
    setUserState(newUser);
    setTokenState(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUserState(null);
    setTokenState(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const setUser = (updatedUser: User) => {
    setUserState(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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