import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import CreateAccount from "./pages/CreateAccount/createaccount";
import Login from "./pages/login/login";
import Registration from "./pages/Registration/registration";
import Home from "./pages/Home/home";
import Courses from "./pages/Courses/course";
import CreateCourse from "./pages/CreateCourse/createcourse";
import InstructorPage from "./components/instructorpage";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import Profile from "./pages/Profile/profile";  // Import Profile component
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchUserRole } from "./pages/Firebase/firebase";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // 'student' or 'instructor'
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // New state to track if auth check is done

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch the user role after login
        fetchUserRole(user.uid)
          .then((role) => {
            setUserRole(role);  // Set role as instructor or student
            setIsLoggedIn(true);  // User is logged in
            setIsLoadingRole(false);  // Stop loading
          })
          .catch((error) => {
            console.error("Error fetching user role:", error);
            setIsLoggedIn(false);
            setIsLoadingRole(false);  // Stop loading on error
          });
      } else {
        setIsLoggedIn(false);
        setIsLoadingRole(false);  // Stop loading if no user is logged in
      }

      setIsAuthChecked(true); // Mark the auth check as done
    });

    // Cleanup subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  if (!isAuthChecked || isLoadingRole) {
    return <div className="loading">Loading...</div>; // Prevent rendering until auth state is determined
  }

  return (
    <Router>
      <div className="app">
        {isLoggedIn && <Header userRole={userRole} />}
        <div className="main-layout">
          {isLoggedIn && <Sidebar />}
          <div className="content">
            <LocationAwareContent isLoggedIn={isLoggedIn} userRole={userRole} />
          </div>
        </div>
        {isLoggedIn && <LocationAwareFooter />}
      </div>
    </Router>
  );
};

const LocationAwareContent = ({ isLoggedIn, userRole }) => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? (
          <Navigate to={userRole === "instructor" ? "/instructor-page" : "/courses"} />
        ) : (
          <CreateAccount />
        )}
      />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/registration" element={<Registration />} />
      <Route
        path="/login"
        element={isLoggedIn ? (
          userRole === "instructor" ? <Navigate to="/instructor-page" /> : <Navigate to="/courses" />
        ) : (
          <Login />
        )}
      />
      <Route path="/home" element={isLoggedIn ? <Home userRole={userRole} /> : <Navigate to="/login" />} />
      <Route path="/courses" element={isLoggedIn ? <Courses /> : <Navigate to="/login" />} />
      <Route path="/instructor-page" element={isLoggedIn && userRole === "instructor" ? <InstructorPage /> : <Navigate to="/courses" />} />
      <Route path="/create-course" element={isLoggedIn && userRole === "instructor" ? <CreateCourse /> : <Navigate to="/courses" />} />
      <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} /> {/* Add Profile route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

const LocationAwareFooter = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/home" || location.pathname === "/instructor-page";

  return showFooter ? <Footer /> : null;
};

export default App;
