// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const STORAGE_KEY = "cs_token";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [user, setUser] = useState(null);

  // derive user from token (our own backend token) if you encode user info there
  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, token);
    // If your backend JWT includes name/email, decode it here.
    try {
      const decoded = jwtDecode(token);
      // Fallbacks to handle different payload shapes
      setUser({
        id: decoded?.id || decoded?._id || decoded?.sub || "",
        name: decoded?.name || decoded?.user?.name || "User",
        email: decoded?.email || decoded?.user?.email || "",
        picture: decoded?.picture || "",
      });
    } catch {
      // Non-JWT tokens: keep token only
      setUser((u) => u ?? { name: "User" });
    }
  }, [token]);

  const login = (backendToken) => setToken(backendToken);
  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Google One-Tap / Button credential
  const loginWithGoogle = (googleCredential) => {
    try {
      const payload = jwtDecode(googleCredential);
      setUser({
        id: payload?.sub,
        name: payload?.name,
        email: payload?.email,
        picture: payload?.picture,
      });
      // Optional: exchange googleCredential with your backend => app token
      // Example:
      // axios.post('/api/auth/google', { credential: googleCredential }).then(res => setToken(res.data.token))
    } catch (e) {
      console.error("Failed to decode Google credential", e);
    }
  };

  const value = useMemo(
    () => ({ user, token, isLoggedIn: !!(user || token), login, logout, loginWithGoogle }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
