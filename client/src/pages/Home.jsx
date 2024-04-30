import React from 'react';
import { Link } from 'react-router-dom';
import wingImage from '../assets/wing-image.png';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">GatorFly</h1>
        <p className="home-subtitle">Traveling is easier than ever</p>
        <div className="home-buttons">
          <Link to="/login" className="home-buttonLogin">
            Login
          </Link>

          <Link to="/register" className="home-buttonRegister">
            Sign Up
          </Link>
          
        </div>
      </div>
      <img src={wingImage} alt="Wing" className="home-image" />
    </div>
  );
};

export default Home;