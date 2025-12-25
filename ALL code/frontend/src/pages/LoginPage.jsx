import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight, AlertCircle, Mail, Key, Check, Loader2, Shield, Chrome, Facebook } from 'lucide-react';
import WarpStarField from '../components/WarpStarField';

// Extracted InputField logic to prevent re-render focus loss
const InputField = ({ icon: Icon, error, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Icon size={18} className="text-gray-500 group-focus-within:text-cyber-cyan transition-colors" />
    </div>
    <input
      {...props}
      className={`input-futuristic w-full pl-12 pr-4 text-sm bg-cyber-black/40 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}
    />
    {error && <p className="text-red-400 text-xs mt-1.5 pl-1">{error}</p>}
  </div>
);

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { login, register, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';

    if (isRegistering) {
      if (!formData.email.trim()) errors.email = 'Email is required';
      else if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email';

      if (!validatePassword(formData.password)) errors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    } else {
      if (!formData.password) errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isRegistering) {
        register(formData.username, formData.email, formData.password);
        setSuccessMsg("Registration successful! Please login.");
        setIsRegistering(false);
        setFormData({ ...formData, password: '', confirmPassword: '' });
      } else {
        const user = login(formData.username, formData.password);
        navigate(user.role === 'ADMIN' ? '/admin' : '/home');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (providerName, loginFn) => {
    setIsLoading(true);
    setError('');
    try {
      await loginFn();
      navigate('/home'); // Redirect to user dashboard
    } catch (err) {
      setError(`Failed to connect with ${providerName}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccessMsg('');
    setValidationErrors({});
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="flex min-h-screen bg-cyber-black text-white relative items-center justify-center overflow-hidden">
      {/* 3D Warp Background */}
      <WarpStarField />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md px-4">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-cyan via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(0,255,255,0.4)] animate-pulse-glow">
              <Shield size={32} className="text-white fill-white/20" />
            </div>
          </div>
          <h1 className="text-5xl font-orbitron font-black tracking-wider drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            <span className="text-white">GAMER</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-purple-500">ZONE</span>
          </h1>
          <p className="text-cyber-cyan/80 mt-3 text-sm uppercase tracking-[0.4em] font-medium">
            {isRegistering ? 'Initialize Account' : 'Nexus Gate Access'}
          </p>
        </div>

        {/* Glass Form Card */}
        <div className="glass-card-premium p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl border border-white/10 relative overflow-hidden group">
          {/* Neon Border Effect */}
          <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-purple-600 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-1000"></div>

          <div className="mb-8 text-center relative z-10">
            <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
              {isRegistering ? 'Establish Connection' : 'Identify Yourself'}
            </h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent mx-auto shadow-[0_0_10px_#00ffff]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm animate-pulse-fast">
                <AlertCircle size={18} /> {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                <Check size={18} /> {successMsg}
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <InputField
                icon={User}
                type="text"
                name="username" // Important for handleChange
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                error={validationErrors.username}
                disabled={isLoading}
              />

              {isRegistering && (
                <InputField
                  icon={Mail}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  error={validationErrors.email}
                  disabled={isLoading}
                />
              )}

              <InputField
                icon={Lock}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isRegistering ? 'Password (min 8)' : 'Password'}
                error={validationErrors.password}
                disabled={isLoading}
              />

              {isRegistering && (
                <InputField
                  icon={Key}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  error={validationErrors.confirmPassword}
                  disabled={isLoading}
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-6 rounded-xl font-bold font-orbitron uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                bg-gradient-to-r from-cyber-cyan via-blue-500 to-purple-600 text-white shadow-[0_0_30px_rgba(0,255,255,0.3)]
                hover:shadow-[0_0_50px_rgba(0,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  {isRegistering ? 'INITIATE' : 'CONNECT'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Social Login */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] font-bold uppercase tracking-widest">Or Access Via</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google', loginWithGoogle)}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-gray-900 border border-white hover:bg-gray-100 transition-all font-bold text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Chrome size={20} className="text-gray-900 group-hover:scale-110 transition-transform" /> Google
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook', loginWithFacebook)}
                disabled={isLoading}
                className="flex items-center justify-center gap-3 py-3 rounded-xl bg-[#1877F2] text-white border border-[#1877F2] hover:bg-[#166fe5] transition-all font-bold text-sm hover:shadow-[0_0_20px_rgba(24,119,242,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Facebook size={20} fill="currentColor" className="text-white group-hover:scale-110 transition-transform" /> Facebook
              </button>
            </div>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center pt-6 border-t border-white/10 relative z-10">
            <p className="text-gray-400 text-sm">
              {isRegistering ? 'Already have an account?' : 'New to GamerZone?'}
              <button
                className="text-cyber-cyan font-semibold ml-2 hover:text-white hover:underline transition-colors"
                onClick={toggleMode}
                disabled={isLoading}
              >
                {isRegistering ? 'Sign In' : 'Register Here'}
              </button>
            </p>

            {/* Demo Credentials */}
            {!isRegistering && (
              <div className="mt-4 p-3 bg-cyber-black/50 rounded-lg border border-white/5 inline-block">
                <p className="text-xs text-gray-500 font-mono">
                  Demo: <span className="text-cyber-cyan/70">admin1</span> / <span className="text-cyber-cyan/70">password123</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/20 text-xs font-mono tracking-wider">
          SECURE CONNECTION v4.0 • QUANTUM ENCRYPTION
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
