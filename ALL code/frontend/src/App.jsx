import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import GamesPage from './pages/GamesPage';
import NewsPage from './pages/NewsPage';
import TransactionPage from './pages/TransactionPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import GameDetailsPage from './pages/GameDetailsPage';
import TopUpPage from './pages/TopUpPage';
import SuccessPage from './pages/SuccessPage'; // Imported SuccessPage
// ... (existing imports)




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

  // Admins have superuser access to all routes
  if (user.role === 'ADMIN') {
    return children;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
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
                    <Route
                      path="/game/:id"
                      element={
                        <ProtectedRoute allowedRole="USER">
                          <GameDetailsPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Transaction / TopUp Routes */}
                    <Route
                      path="/topup"
                      element={
                        <ProtectedRoute allowedRole="USER">
                          <TopUpPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/topup/:gameId"
                      element={
                        <ProtectedRoute allowedRole="USER">
                          <TopUpPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/success"
                      element={
                        <ProtectedRoute allowedRole="USER">
                          <SuccessPage />
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
