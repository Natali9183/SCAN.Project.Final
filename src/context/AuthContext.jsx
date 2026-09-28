/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import { isAuthenticated as hasToken, login as loginRequest, logout as logoutRequest } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(hasToken());

  const login = async (loginValue, password) => {
    await loginRequest(loginValue, password);
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutRequest();
    setIsAuthenticated(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
