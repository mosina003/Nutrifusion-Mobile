import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getUser, setUser as saveUser, removeToken, getCurrentUser, getToken } from '../services/api';

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
      const token = await getToken();
      
      // If we have a token but incomplete user data, fetch from server
      if (token && storedUser && (!storedUser.email || !storedUser.name)) {
        console.log('⚠️ Incomplete user data detected, fetching from server...');
        try {
          const freshUser = await getCurrentUser();
          console.log('👤 Logged in user (refreshed):', {
            email: freshUser.email,
            name: freshUser.name,
            framework: freshUser.preferredMedicalFramework,
            hasCompletedAssessment: freshUser.hasCompletedAssessment,
          });
          setUser(freshUser);
          return;
        } catch (refreshError) {
          console.error('Failed to refresh user data:', refreshError);
          // Token might be invalid, clear it
          await removeToken();
          setUser(null);
          return;
        }
      }
      
      if (storedUser) {
        console.log('👤 Logged in user:', {
          email: storedUser.email,
          name: storedUser.name,
          framework: storedUser.preferredMedicalFramework,
          hasCompletedAssessment: storedUser.hasCompletedAssessment,
        });
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
