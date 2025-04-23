import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import a CSS file for styling

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/timesheet" className="navbar-link">TimeSheet</Link>
        <Link to="/signup" className="navbar-link">Sign Up</Link>
        <Link to="/signin" className="navbar-link">Sign In</Link>
      </div>
    </nav>
  );
}

export default Navbar; 