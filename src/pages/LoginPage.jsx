import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import './LoginPage.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = 'Invalid email address';
    }
    if (name === 'password') {
      if (value.length < 6) error = 'Password must be at least 6 characters';
    }
    if (name === 'confirmPassword') {
      if (value !== formData.password) error = 'Passwords do not match';
    }
    if (name === 'name' && !isLogin) {
      if (value.length < 3) error = 'Name must be at least 3 characters';
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Final validation check
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email received is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrors({ form: 'Authentication failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <MainLayout>
      <div className="login-container">
        <div className={`login-card glass-panel ${isLogin ? 'login-mode' : 'register-mode'}`}>
          <div className="auth-header">
            <h2>{isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h2>
            <p>{isLogin ? 'Login to access your GamerZone profile' : 'Join the elite gaming community'}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group fade-in">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error-input' : ''}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error-input' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error-input' : ''}
              />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group fade-in">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error-input' : ''}
                />
                {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'REGISTER')}
            </button>
          </form>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={toggleMode} className="toggle-btn">
                {isLogin ? 'Register Here' : 'Login Here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
