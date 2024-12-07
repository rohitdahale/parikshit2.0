// Home.js
import React from "react";
import { Link } from "react-router-dom";
import "../Home/home.css"

const Home = ({ userRole }) => {
  return (
    <div className="home-container">
      <h1>Welcome to the Learning Platform</h1>
      <nav className="navigation">
        <Link to="/courses" className="nav-link">View Courses</Link>
      </nav>
      <div className="home-content">
        <h2>Available Courses</h2>
        <p>Explore the courses available on the platform. Click on 'View Courses' to see more.</p>
      </div>
    </div>
  );
};

export default Home;