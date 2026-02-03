import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaHeart, 
  FaCode,
  FaShieldAlt,
  FaRocket,
  FaEnvelope,
  FaArrowUp
} from "react-icons/fa";
import { SiReact, SiNodedotjs, SiMongodb, SiExpress } from "react-icons/si";
import "./Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const techStack = [
    { icon: <SiReact />, name: "React", color: "#61DAFB" },
    { icon: <SiNodedotjs />, name: "Node.js", color: "#339933" },
    { icon: <SiExpress />, name: "Express", color: "#000000" },
    { icon: <SiMongodb />, name: "MongoDB", color: "#47A248" },
  ];

  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/features", label: "Features" },
    { path: "/pricing", label: "Pricing" },
    { path: "/docs", label: "Documentation" },
  ];

  const legalLinks = [
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms of Service" },
    { path: "/cookies", label: "Cookie Policy" },
    { path: "/security", label: "Security" },
  ];

  const socialLinks = [
    { icon: <FaGithub />, url: "https://github.com", label: "GitHub" },
    { icon: <FaTwitter />, url: "https://twitter.com", label: "Twitter" },
    { icon: <FaLinkedin />, url: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="footer">
      {/* Back to Top Button */}
      <motion.button
        className="back-to-top"
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FaArrowUp />
      </motion.button>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-primary">MERN</span>
              <span className="logo-secondary">Auth</span>
              <div className="logo-badge">PRO</div>
            </div>
            <p className="footer-tagline">
              Secure, scalable authentication solution for modern web applications
            </p>
            
            <div className="tech-stack">
              <span className="tech-label">Powered by:</span>
              <div className="tech-icons">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    className="tech-icon"
                    title={tech.name}
                    whileHover={{ y: -5, scale: 1.2 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {tech.icon}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="footer-social">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="footer-heading">
              <FaCode className="heading-icon" />
              Quick Links
            </h3>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <motion.li
                  key={link.path}
                  whileHover={{ x: 5 }}
                >
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="footer-column">
            <h3 className="footer-heading">
              <FaShieldAlt className="heading-icon" />
              Legal
            </h3>
            <ul className="footer-links">
              {legalLinks.map((link) => (
                <motion.li
                  key={link.path}
                  whileHover={{ x: 5 }}
                >
                  <Link to={link.path} className="footer-link">
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="footer-column">
            <h3 className="footer-heading">
              <FaRocket className="heading-icon" />
              Stay Updated
            </h3>
            <p className="newsletter-text">
              Subscribe to our newsletter for the latest updates and security tips
            </p>
            
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="subscribe-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>

            <AnimatePresence>
              {isSubscribed && (
                <motion.div
                  className="success-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  Thanks for subscribing! 🎉
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="copyright">
            © {new Date().getFullYear()} MERN Auth Dashboard. All rights reserved.
          </div>
          
          <div className="made-with">
            Made with <FaHeart className="heart-icon" /> using the MERN stack
          </div>
          
          <div className="footer-stats">
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
            <div className="stat-divider">•</div>
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat-divider">•</div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Add AnimatePresence import at the top
import { AnimatePresence } from "framer-motion";