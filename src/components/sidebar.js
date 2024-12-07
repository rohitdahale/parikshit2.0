import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Home, 
  Book, 
  User, 
  BookPlus, 
  Settings, 
  LogOut 
} from 'lucide-react';
import "./sidebar.css";

const Sidebar = () => {
  const [activeFilter, setActiveFilter] = useState({
    domain: "",
    provider: ""
  });
  const location = useLocation();

  const domains = [
    "Computer Science", 
    "Data Science", 
    "Business", 
    "Design", 
    "Marketing"
  ];

  const providers = [
    "Coursera", 
    "edX", 
    "Udacity", 
    "Udemy", 
    "LinkedIn Learning"
  ];

  const handleFilterChange = (type, value) => {
    setActiveFilter(prev => ({ ...prev, [type]: value }));
  };

  const resetFilters = () => {
    setActiveFilter({ domain: "", provider: "" });
  };

  const sidebarLinks = [
    { path: "/home", label: "Home", icon: <Home /> },
    { path: "/courses", label: "Courses", icon: <Book /> },
    { path: "/profile", label: "Profile", icon: <User /> },
    { path: "/create-course", label: "Create Course", icon: <BookPlus /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-navigation">
        {sidebarLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-filters">
        <h3>Course Filters</h3>
        <button className="close-filters" onClick={resetFilters}>Reset Filters</button>
        
        <label>
          Domain
          <select 
            value={activeFilter.domain} 
            onChange={(e) => handleFilterChange('domain', e.target.value)}
          >
            <option value="">All Domains</option>
            {domains.map(domain => (
              <option key={domain} value={domain}>{domain}</option>
            ))}
          </select>
        </label>
        
        <label>
          Provider
          <select 
            value={activeFilter.provider}
            onChange={(e) => handleFilterChange('provider', e.target.value)}
          >
            <option value="">All Providers</option>
            {providers.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </label>
        
        <button 
          className="apply-filters" 
          onClick={() => console.log("Applied Filters:", activeFilter)}
        >
          Apply Filters
        </button>
      </div>

      <div className="sidebar-footer">
        <Link to="/settings" className="sidebar-settings">
          <Settings /> Settings
        </Link>
        <Link to="/logout" className="sidebar-logout">
          <LogOut /> Logout
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;