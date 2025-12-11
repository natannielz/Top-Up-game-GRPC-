import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, facebookProvider } from '../config/firebase'; // Import Firebase
import { signInWithPopup, signOut } from "firebase/auth";

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

      // Check for active session
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

  // --- MANUAL AUTH ---
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

  // --- FIREBASE SOCIAL LOGIN ---
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      // Check if user exists in our local DB, if not, create one
      let existingUser = users.find(u => u.email === fbUser.email);

      if (!existingUser) {
        // Create new user from Social Data
        const newUser = {
          id: fbUser.uid,
          username: fbUser.displayName || fbUser.email.split('@')[0],
          email: fbUser.email,
          role: 'USER',
          status: 'Active', // Auto-approve social logins
          avatar: fbUser.photoURL,
          points: 100, // Bonus for social login
          rank: 'Bronze'
        };
        setUsers(prev => [...prev, newUser]); // Update state
        existingUser = newUser;
      }

      setUser(existingUser);
      localStorage.setItem('currentUser', JSON.stringify(existingUser));
      return existingUser;
    } catch (error) {
      console.error("Google Login Error:", error);
      throw new Error(error.message);
    }
  };

  const loginWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const fbUser = result.user;
      // Similar logic to Google
      let existingUser = users.find(u => u.email === fbUser.email);
      if (!existingUser) {
        const newUser = {
          id: fbUser.uid,
          username: fbUser.displayName || 'Facebook User',
          email: fbUser.email,
          role: 'USER',
          status: 'Active',
          avatar: fbUser.photoURL,
          points: 100,
          rank: 'Bronze'
        };
        setUsers(prev => [...prev, newUser]);
        existingUser = newUser;
      }
      setUser(existingUser);
      localStorage.setItem('currentUser', JSON.stringify(existingUser));
      return existingUser;
    } catch (error) {
      console.error("Facebook Login Error:", error);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth).catch(e => console.log("Firebase signout error (harmless if not fb user)", e));
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
