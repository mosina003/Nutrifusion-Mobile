import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getUser, setUser as saveUser, removeToken } from '../services/api';

interface User {
  _id: string;
  name?: string;
  email: string;
  role: 'user' | 'practitioner';
  verified?: boolean;
  hasCompletedAssessment?: boolean;
  preferredMedicalFramework?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from storage on app start
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthUser = async (userData: User | null) => {
    setUser(userData);
    if (userData) {
      await saveUser(userData);
    }
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setAuthUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
