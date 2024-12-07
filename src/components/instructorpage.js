import React from "react";
import { useNavigate } from "react-router-dom";
import "./instructor.css";

const InstructorPage = () => {
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate("/create-course"); // Navigate to the Create Course page
  };

  return (
    <div className="instructor-page">
      <button className="create-course-button" onClick={handleCreateCourse}>
        Create Course
      </button>
      <h1>Welcome, Instructor!</h1>
      <p>This is your dashboard. You can create and manage your courses here.</p>
    </div>
  );
};

export default InstructorPage;