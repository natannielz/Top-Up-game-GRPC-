import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import GamesPage from './pages/GamesPage';
import NewsPage from './pages/NewsPage';
import TransactionPage from './pages/TransactionPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import GameIntelligencePage from './pages/GameIntelligencePage';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ChatProvider } from './context/ChatContext';
import { ToastProvider } from './context/ToastContext';
import ChatWidget from './components/ChatWidget';
import LoadingScreen from './components/LoadingScreen';
import { useState, useEffect, Suspense } from 'react';
// Hero3D.css was cleared and migrated to Tailwind
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or return null

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/home'} replace />;
  }

  return children;
};

// Redirect Root to Login or Dashboard
const RootRedirect = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/home'} replace />;
  }
  return <Navigate to="/login" replace />;
};

// Navbar Wrapper to hide on Login/Admin pages
const ConditionalNavbar = () => {
  const location = useLocation();
  const hidePaths = ['/login', '/admin'];
  // Also hide if path starts with /admin/ (though exact match handles current route)
  if (hidePaths.includes(location.pathname) || location.pathname.startsWith('/admin')) {
    return null;
  }
  return <Navbar />;
};


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial asset loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <ChatProvider>
          <ToastProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <div className="app-container">
                {loading && <LoadingScreen />}
                <ConditionalNavbar />
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute allowedRole="ADMIN">
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* User Routes */}
                    <Route
                      path="/home"
                      element={
                        <ProtectedRoute allowedRole="USER">
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/games"
                      element={
                        <ProtectedRoute allowedRole="USER">
                          <GamesPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/news"
                      element={
                        <ProtectedRoute allowedRole="USER">
                          <NewsPage />
                        </ProtectedRoute>
                      }
                    />
                    {/* Updated Route to point to TransactionPage */}
                    <Route
                      path="/topup/:gameId"
                      element={
                        <ProtectedRoute allowedRole="USER">
                          <TransactionPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute allowedRole="USER">
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Game Intelligence Hub */}
                    <Route
                      path="/game-intel"
                      element={<GameIntelligencePage />}
                    />
                    <Route
                      path="/game-intel/:id"
                      element={<GameIntelligencePage />}
                    />
                  </Routes>
                </Suspense>

                {/* Chat Widget (Handles its own visibility) */}
                <ChatWidget />
              </div>
            </Router>
          </ToastProvider>
        </ChatProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
