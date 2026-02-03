import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaSignInAlt,
  FaGithub,
  FaGoogle,
  FaUser,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import "./Login.css";

export default function Login({ onLogin }) {  // Accept onLogin prop
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      
      // Call the onLogin prop with user data and token
      onLogin(res.data.user, res.data.token);
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", form.email);
      }
      
      setLoginSuccess(true);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ 
          general: "Invalid email or password. Please try again." 
        });
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    if (errors.general) {
      setErrors({ ...errors, general: "" });
    }
  };

  const handleSocialLogin = (provider) => {
    // In a real app, this would redirect to OAuth endpoint
    console.log(`Logging in with ${provider}`);
    // For demo purposes, show a message
    setErrors({ general: `${provider} login is not configured yet. Use email/password.` });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-page">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-container">
        {/* Left Panel - Illustration & Info */}
        <motion.div 
          className="login-left-panel"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="left-content">
            <motion.div 
              className="logo-container"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="logo-circle">
                <FaUser className="logo-icon" />
              </div>
              <h1 className="app-logo">
                Task<span className="logo-accent">Flow</span>
              </h1>
            </motion.div>

            <motion.h2 
              className="welcome-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome Back!
            </motion.h2>

            <motion.p 
              className="welcome-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Sign in to access your personalized dashboard and manage your tasks.
            </motion.p>

            <motion.div 
              className="features-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Secure authentication</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Task management</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Real-time updates</span>
              </div>
            </motion.div>

            <motion.div 
              className="security-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <FaShieldAlt className="security-icon" />
              <div>
                <p className="security-title">Bank-level Security</p>
                <p className="security-subtitle">Your data is encrypted</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Login Form */}
        <motion.div 
          className="login-right-panel"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="login-form-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="form-header"
            >
              <h2 className="form-title">Sign In</h2>
              <p className="form-subtitle">Enter your credentials to continue</p>
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div 
              className="social-login-buttons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="button"
                className="social-btn google-btn"
                onClick={() => handleSocialLogin("Google")}
              >
                <FaGoogle className="social-icon" />
                Continue with Google
              </button>
              <button
                type="button"
                className="social-btn github-btn"
                onClick={() => handleSocialLogin("GitHub")}
              >
                <FaGithub className="social-icon" />
                Continue with GitHub
              </button>
            </motion.div>

            <div className="divider">
              <span className="divider-text">or continue with email</span>
            </div>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="login-form"
              onSubmit={handleSubmit}
            >
              <AnimatePresence>
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="error-message"
                  >
                    <FaExclamationCircle className="error-icon" />
                    <span>{errors.general}</span>
                  </motion.div>
                )}
                
                {loginSuccess && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="success-message"
                  >
                    <FaCheckCircle className="success-icon" />
                    <span>Login successful! Redirecting...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-group">
                <label className="form-label">
                  <FaEnvelope className="label-icon" />
                  Email Address
                </label>
                <input
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                  disabled={isLoading || loginSuccess}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="field-error"
                    >
                      {errors.email}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label className="form-label">
                    <FaLock className="label-icon" />
                    Password
                  </label>
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={handleForgotPassword}
                    disabled={isLoading || loginSuccess}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="password-input-wrapper">
                  <input
                    className={`form-input ${errors.password ? "input-error" : ""}`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleInputChange}
                    disabled={isLoading || loginSuccess}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || loginSuccess}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="field-error"
                    >
                      {errors.password}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    disabled={isLoading || loginSuccess}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Remember me</span>
                </label>
              </div>

              <motion.button
                className="login-button"
                type="submit"
                disabled={isLoading || loginSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Signing in...
                  </>
                ) : loginSuccess ? (
                  <>
                    <FaCheckCircle />
                    Success! Redirecting...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Sign In
                  </>
                )}
              </motion.button>

              <div className="form-footer">
                <p className="signup-text">
                  Don't have an account?{" "}
                  <Link 
                    to="/register" 
                    className="signup-link"
                    onClick={(e) => {
                      if (isLoading || loginSuccess) e.preventDefault();
                    }}
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </motion.form>

            <motion.div 
              className="demo-credentials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="demo-title">Demo Credentials</p>
              <p className="demo-text">Email: demo@example.com</p>
              <p className="demo-text">Password: demo123</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}