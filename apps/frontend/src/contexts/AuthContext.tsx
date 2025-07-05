import React, { createContext, useContext, useEffect } from 'react';
import { useProfile } from '@/hooks/useAuth';
import { tokenManager } from '@/lib/api';
import { User } from '@novel-craft/shared';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useProfile();

  // Clear token if there's an auth error
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401) {
      tokenManager.remove();
    }
  }, [error]);

  const value: AuthContextType = {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
