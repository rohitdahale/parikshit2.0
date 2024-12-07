import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-title">LearnHub</h3>
          <p className="footer-description">
            Your comprehensive online learning platform. Empowering education through technology.
          </p>
        </div>

        <div className="footer-column">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-subtitle">Contact</h4>
          <ul className="footer-contact">
            <li>Email: support@learnhub.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Learning Lane, Tech City</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-subtitle">Follow Us</h4>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <Twitter size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <Instagram size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} LearnHub. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;