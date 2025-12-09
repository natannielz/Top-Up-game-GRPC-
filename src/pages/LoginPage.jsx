import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import './LoginPage.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup/login delay
    setTimeout(() => {
        login(email);
        navigate('/dashboard');
    }, 800);
  };

  return (
    <MainLayout>
      <div className="login-container">
        <div className="login-card glass-panel">
          <h2>{isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h2>
          <p>{isLogin ? 'Login to access your GamerZone profile' : 'Join the ultimate gaming community'}</p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
               <div className="form-group">
                 <input type="text" placeholder="Username" required />
               </div>
            )}
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
            {!isLogin && (
               <div className="form-group">
                 <input type="password" placeholder="Confirm Password" required />
               </div>
            )}

            <button type="submit" className="login-btn">
                {isLogin ? 'LOGIN' : 'SIGN UP'}
            </button>
          </form>

          <div className="toggle-auth">
             <p>
               {isLogin ? "Don't have an account? " : "Already have an account? "}
               <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
                 {isLogin ? 'Sign Up' : 'Login'}
               </button>
             </p>
          </div>

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
