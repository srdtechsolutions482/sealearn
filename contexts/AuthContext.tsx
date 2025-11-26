import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role, Vendor } from '../types';
import { allUsers } from '../data';

type CurrentUser = User | Vendor | null;

interface AuthContextType {
  user: CurrentUser;
  role: Role | null;
  isAuthenticated: boolean;
  login: (email: string, password_param: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);

  const login = (email: string, password_param: string): boolean => {
    const foundUser = allUsers.find(u => u.email === email && u.password === password_param);
    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    user: currentUser,
    role: currentUser?.role || null,
    isAuthenticated: !!currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};