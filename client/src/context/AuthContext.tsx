import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";

type User = {
  _id: string;
  name: string;
  email: string;
  token: string;
  refreshToken?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const stored = localStorage.getItem("userInfo");

      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(stored);

        // Verify token via backend
        const res = await api.get("/auth/me"); // token auto-attached

        setUser({ ...res.data, token: parsedUser.token });
      } catch (err) {
        localStorage.removeItem("userInfo");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    window.location.href = "/login"; // optional redirect
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};