import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { fetchUserRole } from "../Firebase/firebase";
import "../login/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "instructor") {
      navigate("/instructor-page");
    } else if (role === "student") {
      navigate("/courses");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    localStorage.removeItem("role");

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const role = await fetchUserRole(user.uid);

      localStorage.setItem("role", role);

      if (role === "instructor") {
        navigate("/instructor-page");
      } else if (role === "student") {
        navigate("/courses");
      } else {
        setError("Unauthorized user role");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else {
        setError("Login failed. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate("/createAccount");
  };

  return (
    <div className="login-container">
      <h1 className="form-title">Login</h1>
      <div className="form-wrapper">
        <div className="sign-in-container">
          <h2 className="sign-in">Login Page</h2>

          <p>or use your account</p>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
          <p className="forgot-password">Forgot your password?</p>
          <button
            className="btn sign-in-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>
        <div className="sign-up-container">
          <h2>Hello, Friend!</h2>
          <p>Enter your personal details and start your journey with us</p>
          <button className="btn sign-up-btn" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
