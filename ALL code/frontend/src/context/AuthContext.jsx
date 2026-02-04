import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          // Optional: Verify token with profile call
          const { data } = await api.get('/auth/profile');
          setUser({ ...parsedUser, ...data });
        } catch (err) {
          console.error("Token verification failed:", err);
          localStorage.removeItem('currentUser');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      setUser(data);
      localStorage.setItem('currentUser', JSON.stringify(data));
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      // Depending on workflow, you might auto-login or wait for approval
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (updates) => {
    try {
      // In real app, you would have a PUT /api/auth/profile
      // For now, let's keep it local or implement if needed
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      updateProfile,
      loginWithGoogle: () => { throw new Error('Switch to real Google Auth requested') },
      loginWithFacebook: () => { throw new Error('Switch to real Facebook Auth requested') }
    }}>
      {children}
    </AuthContext.Provider>
  );
};
