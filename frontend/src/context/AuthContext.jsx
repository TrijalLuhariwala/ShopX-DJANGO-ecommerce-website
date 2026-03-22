import React, { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiSignup, apiLogout } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(undefined);

function getUserFromToken(token) {
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.user_id,
      username: decoded.username,
      email: decoded.email || "",
      isSeller: decoded.is_seller || false,
    };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const u = getUserFromToken(token);
      if (u) setUser(u);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const { data } = await apiLogin({ username, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    // Normalize to camelCase to match token decode shape
    const user = { ...data.user, isSeller: data.user.is_seller };
    setUser(user);
    return user;
  };

  const register = async (username, email, password, isSeller) => {
    const { data } = await apiSignup({ username, email, password, is_seller: isSeller });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    // Normalize to camelCase to match token decode shape
    const user = { ...data.user, isSeller: data.user.is_seller };
    setUser(user);
    return user;
  };

  const logout = async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};