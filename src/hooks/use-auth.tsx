import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { login as authLogin, logout as authLogout, isAuthenticated, getToken } from "@/services/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      try {
        const token = getToken();
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUsername(payload.username);
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (user: string, password: string) => {
    const data = await authLogin(user, password);
    setUsername(data.username);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUsername(null);
    authLogout();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit etre utilise dans un AuthProvider");
  }
  return context;
}
