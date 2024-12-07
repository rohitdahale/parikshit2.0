import React, { useState } from "react";
import { saveRegistrationData } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { 
  User, 
  Lock, 
  Mail, 
  Calendar, 
  Building2, 
  GraduationCap, 
  BookOpen 
} from "lucide-react";
import '../Registration/Registration.css';

const Registration = () => {
  const [userType, setUserType] = useState("Student");
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    collegeCode: "",
    location: "",
    branch: "",
    yearOfStudy: "",
    department: "",
    subjects: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredCommonFields = ["fullName", "dob", "collegeCode", "location"];
    const studentFields = ["branch", "yearOfStudy"];
    const instructorFields = ["department", "subjects"];

    // Check common required fields
    const missingCommonFields = requiredCommonFields.filter(field => !formData[field]);
    if (missingCommonFields.length > 0) {
      setError("Please fill in all required fields.");
      return false;
    }

    // Check user-type specific fields
    if (userType === "Student") {
      const missingStudentFields = studentFields.filter(field => !formData[field]);
      if (missingStudentFields.length > 0) {
        setError("Please fill in all student-specific fields.");
        return false;
      }
    }

    if (userType === "Instructor") {
      const missingInstructorFields = instructorFields.filter(field => !formData[field]);
      if (missingInstructorFields.length > 0) {
        setError("Please fill in all instructor-specific fields.");
        return false;
      }
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form before submission
    if (!validateForm()) return;

    // Prepare registration data
    const registrationData = {
      fullName: formData.fullName,
      userType,
      ...(userType === "Student" && { 
        location: formData.location, 
        branch: formData.branch, 
        yearOfStudy: formData.yearOfStudy 
      }),
      ...(userType === "Instructor" && { 
        location: formData.location, 
        department: formData.department, 
        subjects: formData.subjects 
      }),
    };

    // Firebase authentication check
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("No user is logged in. Please log in first.");
      return;
    }

    try {
      await saveRegistrationData(user.uid, registrationData, userType);
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-wrapper">
        <div className="registration-header">
          <h1>Create Your Account</h1>
          <p>Join our educational platform and start your learning journey</p>
        </div>

        <div className="user-type-selector">
          {['Student', 'Instructor'].map(type => (
            <div 
              key={type}
              className={`user-type-option ${userType === type ? 'active' : ''}`}
              onClick={() => setUserType(type)}
            >
              {type === 'Student' ? <GraduationCap /> : <BookOpen />}
              <span>{type}</span>
            </div>
          ))}
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleRegister} className="registration-form">
          {/* Common Fields */}
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <Calendar className="input-icon" />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <Building2 className="input-icon" />
            <input
              type="text"
              name="collegeCode"
              placeholder="College Code"
              value={formData.collegeCode}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Student-specific Fields */}
          {userType === "Student" && (
            <>
              <div className="input-group">
                <GraduationCap className="input-icon" />
                <input
                  type="text"
                  name="branch"
                  placeholder="Branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <Calendar className="input-icon" />
                <input
                  type="text"
                  name="yearOfStudy"
                  placeholder="Year of Study"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          {/* Instructor-specific Fields */}
          {userType === "Instructor" && (
            <>
              <div className="input-group">
                <BookOpen className="input-icon" />
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  type="text"
                  name="subjects"
                  placeholder="Subjects"
                  value={formData.subjects}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="register-button">
            Create Account
          </button>
        </form>

        <div className="login-redirect">
          <span>Already have an account? </span>
          <a href="/login" className="login-link">Log In</a>
        </div>
      </div>
    </div>
  );
};

export default Registration;