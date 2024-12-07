import React, { useState } from "react";
import { signUp } from "../Firebase/firebase"; // Import Firebase signup function
import { useNavigate } from "react-router-dom";
import thImage from '../../assets/login.png';  // Adjust path as per your folder structure
import "../CreateAccount/createAccount.css";

const CreateAccount = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // State for user type
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userType) {
      setError("Please select a user type.");
      return;
    }

    if (!fullName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      // Sign up the user using Firebase Auth (assuming signUp handles email/password authentication)
      const userCredential = await signUp(email, password);

      // After successful signup, store additional user information like fullName and userType
      const user = userCredential.user;
      await user.updateProfile({ displayName: fullName });

      // Assuming you have a user database to store the additional info (fullName, userType)
      // Example of saving user info to Firestore or Realtime Database (Firebase):
      // await saveUserInfo(user.uid, fullName, userType);

      navigate("/registration"); // Navigate to Registration page after account creation
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Create Account</h1>
      <div className="form-wrapper">
        {/* Left section for the form */}
        <div className="sign-in-container">
          <h2>Create Your Account</h2>

          {error && <p className="error-message">{error}</p>}

          {/* User Type Selection */}
          <div className="user-type-container">
            <h4>Select User Type</h4>
            <div className="user-type">
              <label>
                <input
                  type="radio"
                  value="Student"
                  checked={userType === "Student"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  value="Instructor"
                  checked={userType === "Instructor"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Instructor
              </label>
            </div>
          </div>

          {/* Form Input Fields */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="form-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
          />

          {/* Sign up Button */}
          <button className="btn" onClick={handleSubmit}>
            Sign Up
          </button>
        </div>

        {/* Right section for the Image and Proceed Button */}
        <div className="sign-up-container">
          <img src={thImage} alt="Create Account" className="form-image" />
          <button
            className="proceed-button"
            onClick={() => navigate("/registration")}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
