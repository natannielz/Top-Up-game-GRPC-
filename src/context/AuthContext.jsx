import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Initialize with seed data if empty
  useEffect(() => {
    const initAuth = async () => {
      // Load local "database" of users
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        const seedUsers = [
          {
            id: '1',
            username: 'admin1',
            email: 'admin@gamerzone.com',
            password: 'password123',
            role: 'ADMIN',
            status: 'Active',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin1'
          },
          {
            id: '2',
            username: 'user1',
            email: 'user1@example.com',
            password: 'password123',
            role: 'USER',
            status: 'Active',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
          }
        ];
        setUsers(seedUsers);
        localStorage.setItem('users', JSON.stringify(seedUsers));
      }

      // Check for active session from LocalStorage
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Sync users to localStorage
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  // --- MANUAL AUTH (Keep for Admin/Mock) ---
  const login = (username, password) => {
    const foundUser = users.find(u => (u.username === username || u.email === username) && u.password === password);
    if (foundUser) {
      if (foundUser.status === 'Banned') throw new Error('Account is BANNED. Contact support.');
      if (foundUser.status === 'Pending') throw new Error('Account is PENDING approval by Admin.');

      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return foundUser;
    } else {
      throw new Error('Access Denied: Invalid Credentials');
    }
  };

  const register = (username, email, password) => {
    if (users.find(u => u.username === username || u.email === email)) {
      throw new Error('Username or Email already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In a real app, hash this!
      role: 'USER',
      status: 'Pending', // New users need approval
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      points: 0,
      rank: 'Bronze'
    };

    setUsers([...users, newUser]);
    return newUser;
  };

  // --- MOCK SOCIAL LOGIN (Replaced Supabase) ---
  const loginWithGoogle = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock successful Google Login
    const mockGoogleUser = {
      id: 'google-' + Date.now(),
      username: 'Google User',
      email: 'user@gmail.com',
      role: 'USER',
      status: 'Active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
      points: 100,
      rank: 'Bronze'
    };

    setUser(mockGoogleUser);
    localStorage.setItem('currentUser', JSON.stringify(mockGoogleUser));
    return { user: mockGoogleUser };
  };

  const loginWithFacebook = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock successful Facebook Login
    const mockFBUser = {
      id: 'fb-' + Date.now(),
      username: 'Facebook User',
      email: 'user@facebook.com',
      role: 'USER',
      status: 'Active',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=facebook',
      points: 100,
      rank: 'Bronze'
    };

    setUser(mockFBUser);
    localStorage.setItem('currentUser', JSON.stringify(mockFBUser));
    return { user: mockFBUser };
  };

  const logout = async () => {
    // await supabase.auth.signOut(); // Removed
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // --- ADMIN UTILS ---
  const updateUserStatus = (userId, newStatus) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const updateProfile = (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setUsers(users.map(u => u.id === user.id ? updatedUser : u));
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const deleteAccount = () => {
    if (!user) return;
    setUsers(users.filter(u => u.id !== user.id));
    logout();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading, // Exposed
      users,
      login,
      logout,
      register,
      loginWithGoogle,
      loginWithFacebook,
      updateUserStatus,
      updateProfile,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
};
