import { createContext, useContext, useEffect, useState } from 'react';
import { api, login as loginRequest, register as registerRequest, getProfile } from '../data/Api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session on app load
  const [error, setError] = useState(null);

  // On mount: if a token exists, try to restore the session by fetching
  // the current user's profile. If it fails (expired/invalid token),
  // clear the token and fall back to logged-out state.
  useEffect(() => {
    const restoreSession = async () => {
      const token = api.getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getProfile();
        const profile = res?.data?.data || res?.data;
        setUser(profile);
      } catch (err) {
        api.clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    setError(null);
    const res = await loginRequest(email, password);
    // ASSUMPTION: backend returns { success, data: { token, user } }.
    // If your authController responds differently, this will throw below —
    // send me authController.js and I'll correct it.
    const payload = res?.data?.data || res?.data;
    const token = payload?.token;
    const loggedInUser = payload?.user || payload;

    if (!token) {
      throw new Error('Login response did not include a token — check authController.js response shape');
    }

    api.setToken(token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (name, email, password, phone) => {
    setError(null);
    const res = await registerRequest(name, email, password, phone);
    const payload = res?.data?.data || res?.data;
    const token = payload?.token;
    const newUser = payload?.user || payload;

    if (token) {
      api.setToken(token);
      setUser(newUser);
    }
    return newUser;
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, error, login, register, logout, isAuthenticated, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);