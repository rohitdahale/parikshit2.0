
import React, { useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "../components/header.css";

const Header = ({ userRole }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    console.log("Dropdown Toggled:", !isDropdownOpen); // Debugging line
  };

  // Logout function
  const handleLogout = () => {
    console.log("Logging out..."); // Debugging line
    localStorage.removeItem("role"); // Remove role from localStorage
    navigate("/login"); // Redirect to login page
  };

  // Close dropdown when a menu item is clicked
  const handleMenuClick = () => {
    setIsDropdownOpen(false); // Close the dropdown
  };

  // Direct logout function when clicked
  const handleDirectLogout = () => {
    console.log("Logout option clicked"); // Debugging line
    handleMenuClick(); // Close the dropdown
    handleLogout(); // Log out the user and navigate to login page
  };

  return (
    <header className="header">
      <div className="logo">Parikshit</div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          {userRole === "instructor" && (
            <li>
              <Link to="/create-course">Create Course</Link>
            </li>
          )}
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>
      <div className="icons">
        <FaBell className="bell-icon" />
        <div className="profile-menu">
          <FaUserCircle
            className="profile-icon"
            onClick={toggleDropdown} // Toggle dropdown on click
          />
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={handleMenuClick} // Close dropdown when profile is clicked
              >
                My Profile
              </Link>
              {/* Only show Logout if not on the Profile page */}
              {location.pathname !== "/profile" && (
                <div
                  className="dropdown-item logout-option"
                  onClick={handleDirectLogout} // Direct logout action
                >
                  Logout
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header> 
  );
};

export default Header;
