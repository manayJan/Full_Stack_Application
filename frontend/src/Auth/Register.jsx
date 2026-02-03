import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaUserPlus,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaShieldAlt
} from "react-icons/fa";
import "./Login.css";

export default function Register() {
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password
      });
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.message && error.response.data.message.includes("email")) {
            errorMessage = "Email already exists. Please use a different email.";
          } else {
            errorMessage = error.response.data.message || "Invalid registration data.";
          }
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setErrors({ general: errorMessage });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }));
    }
  };

  return (
    <div className="login-page">
      <div className="background-elements">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-container">
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
              Join Our Community!
            </motion.h2>

            <motion.p 
              className="welcome-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Create your account and start managing your tasks efficiently with our powerful tools.
            </motion.p>

            <motion.div 
              className="features-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Unlimited task management</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Priority-based organization</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Real-time collaboration</span>
              </div>
              <div className="feature-item">
                <FaCheckCircle className="feature-icon" />
                <span>Cross-device synchronization</span>
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
                <p className="security-subtitle">Your data is encrypted & protected</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

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
              <button 
                type="button"
                onClick={() => navigate("/")} 
                className="back-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease',
                  marginBottom: '1rem'
                }}
              >
                <FaArrowLeft /> Back to Login
              </button>
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">Fill in your details to get started</p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="login-form"
              onSubmit={handleSubmit}
              noValidate
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
                
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="success-message"
                  >
                    <FaCheckCircle className="success-icon" />
                    <span>Registration successful! Redirecting to login...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <FaUser className="label-icon" />
                  Username
                </label>
                <input
                  id="username"
                  className={`form-input ${errors.username ? "input-error" : ""}`}
                  name="username"
                  type="text"
                  placeholder="john_doe"
                  value={form.username}
                  onChange={handleInputChange}
                  disabled={isLoading || success}
                  autoComplete="username"
                />
                <AnimatePresence>
                  {errors.username && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="field-error"
                    >
                      {errors.username}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <FaEnvelope className="label-icon" />
                  Email Address
                </label>
                <input
                  id="email"
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                  disabled={isLoading || success}
                  autoComplete="email"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="field-error"
                    >
                      {errors.email}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <FaLock className="label-icon" />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    className={`form-input ${errors.password ? "input-error" : ""}`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleInputChange}
                    disabled={isLoading || success}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || success}
                    tabIndex="-1"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="field-error"
                    >
                      {errors.password}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <FaLock className="label-icon" />
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? "input-error" : ""}`}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    disabled={isLoading || success}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading || success}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="field-error"
                    >
                      {errors.confirmPassword}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                className="login-button"
                type="submit"
                disabled={isLoading || success}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Creating Account...
                  </>
                ) : success ? (
                  <>
                    <FaCheckCircle />
                    Success! Redirecting...
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Create Account
                  </>
                )}
              </motion.button>

              <div className="form-footer">
                <p className="signup-text">
                  Already have an account?{" "}
                  <Link 
                    to="/" 
                    className="signup-link"
                    onClick={(e) => {
                      if (isLoading || success) e.preventDefault();
                    }}
                  >
                    Login here
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
              <p className="demo-title">Demo Account Available</p>
              <p className="demo-text">Use the Login page to try with demo credentials</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}