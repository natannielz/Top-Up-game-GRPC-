import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('gamerzone_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    // Simulate API call
    const mockUser = {
      name: 'GamerOne',
      email,
      rank: 'Diamond',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GamerOne',
      points: 2450
    };
    setUser(mockUser);
    localStorage.setItem('gamerzone_user', JSON.stringify(mockUser));
    return true;
  };

  const register = (name, email, password) => {
    // Simulate API Register
    const newUser = {
      name,
      email,
      rank: 'Bronze',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      points: 0
    };
    setUser(newUser);
    localStorage.setItem('gamerzone_user', JSON.stringify(newUser));
    return true;
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('gamerzone_user', JSON.stringify(updatedUser));
  };

  const deleteAccount = () => {
    setUser(null);
    localStorage.removeItem('gamerzone_user');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gamerzone_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
