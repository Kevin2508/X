import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  user_id: number;
  user_name: string;
  email: string;
  display_name: string;
  profile_image?: string;
  cover_image?:string;
  bio?:string,
  date_of_birth?:string
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider wrapper
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  // On app load, restore user from localStorage if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
        try {
            setTokenState(savedToken);
            setUserState(JSON.parse(savedUser));
        } catch (error) {
            console.warn('Clearing corrupted auth data');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.clear(); 
        }
    }
  }, []);

  const login = (user: User, token: string) => {
    setUserState(user);
    setTokenState(token);
    
    // Persist to localStorage (survive page refresh)
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  };

  const logout = () => {
    setUserState(null);
    setTokenState(null);
    
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const setUser = (user: User) => {
    setUserState(user);
    localStorage.setItem('auth_user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the context (easier than useContext)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}