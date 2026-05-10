'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AuthState, Role } from '@/types';

interface AuthContextValue extends AuthState {
  login: (token: string, username: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const initialState: AuthState = {
  token: null,
  username: null,
  role: null,
  isAuthenticated: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialState);

  const login = useCallback((token: string, username: string, role: Role) => {
    setAuth({ token, username, role, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    setAuth(initialState);
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
