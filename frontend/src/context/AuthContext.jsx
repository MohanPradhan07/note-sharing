import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("adminToken"));

  const login = (t) => { localStorage.setItem("token", t); setToken(t); };
  const logout = () => { localStorage.removeItem("token"); setToken(null); };
  const adminLogin = (t) => { localStorage.setItem("adminToken", t); setAdminToken(t); };
  const adminLogout = () => { localStorage.removeItem("adminToken"); setAdminToken(null); };

  return (
    <AuthContext.Provider value={{ token, adminToken, login, logout, adminLogin, adminLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
