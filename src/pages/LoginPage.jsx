import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    navigate('/dashboard');
  };

  return (
    <MainLayout>
      <div className="login-container">
        <div className="login-card glass-panel">
          <h2>WELCOME BACK</h2>
          <p>Login to access your GamerZone profile</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" required />
            </div>

            <button type="submit" className="login-btn">LOGIN</button>
          </form>

          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-btns">
              <button className="social-btn google">G</button>
              <button className="social-btn facebook">F</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
