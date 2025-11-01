import React, { useState, useEffect } from 'react';

export const AuthContext = React.createContext(null);

const AUTH_KEY = 'auth';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) setUser(parsed);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const login = ({ email, password }) => {
    // basic client-side check (no server) - hardcoded admin credentials
    if (email === 'admin@gmail.com' && password === 'admin') {
      const u = { email };
      setUser(u);
      try { localStorage.setItem(AUTH_KEY, JSON.stringify(u)); } catch (e) {}
      return { ok: true };
    }
    return { ok: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
