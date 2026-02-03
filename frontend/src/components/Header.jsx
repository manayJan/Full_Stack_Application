import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Header({ user, onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="brand-section"
        >
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <h1 className="dashboard-title">
              Task<span className="gradient-text">Flow</span>
            </h1>
            <p className="dashboard-subtitle">Your productivity companion</p>
          </Link>
        </motion.div>

        <div className="header-controls">
          {user && (
            <motion.div 
              className="user-profile"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="user-name">{user.name || user.email}</span>
            </motion.div>
          )}

          <motion.button
            onClick={onLogout}
            className="logout-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Logout</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}