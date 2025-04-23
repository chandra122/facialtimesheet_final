import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css'; // Import a CSS file for styling

function Home() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleGetStarted = () => {
    navigate('/signup'); // Navigate to Sign-Up page
  };

  const handleLearnMore = () => {
    navigate('/learn-more'); // Navigate to Learn More page (you'll need to create this route)
  };

  const handleGoToTimesheet = () => {
    navigate('/timesheet'); // Navigate to Timesheet page
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Facial TimeSheet</h1>
      <p className="home-description">Track your time with facial recognition</p>
      <div className="home-buttons">
        <button className="home-button" onClick={handleGetStarted}>Get Started</button>
        <button className="home-button" onClick={handleLearnMore}>Learn More</button>
        <button className="home-button" onClick={handleGoToTimesheet}>Go to Timesheet</button>
      </div>
    </div>
  );
}

export default Home; 