import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("mantra_token");
    const savedUsername = localStorage.getItem("mantra_username");
    const savedRole = localStorage.getItem("mantra_role");
    if (savedToken && savedUsername && savedRole) {
      setToken(savedToken);
      setUser({ username: savedUsername, role: savedRole });
    }
  }, []);

  const login = (token: string, username: string, role: string) => {
    localStorage.setItem("mantra_token", token);
    localStorage.setItem("mantra_username", username);
    localStorage.setItem("mantra_role", role);
    setToken(token);
    setUser({ username, role });
  };

  const logout = () => {
    localStorage.removeItem("mantra_token");
    localStorage.removeItem("mantra_username");
    localStorage.removeItem("mantra_role");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
