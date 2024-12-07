import React, { useState, useEffect } from "react";
import { auth } from "../Firebase/firebase";
import { getDatabase, ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";  // Add this import
import { useNavigate } from "react-router-dom";  // For navigation
import { logOut } from "../Firebase/firebase";  // Import the logOut function

// Function to fetch user role
const fetchUserRole = async (userId) => {
  try {
    const db = getDatabase();
    // Check instructor path
    const instructorRef = ref(db, `registrations/instructor/${userId}`);
    const instructorSnapshot = await get(instructorRef);
    if (instructorSnapshot.exists()) {
      return "instructor";
    }

    // Check student path
    const studentRef = ref(db, `registrations/student/${userId}`);
    const studentSnapshot = await get(studentRef);
    if (studentSnapshot.exists()) {
      return "student";
    }

    throw new Error("Role not found for user");
  } catch (error) {
    console.error("Error fetching user role:", error.message);
    throw error;
  }
};

const Profile = () => {
  const [user, setUser] = useState(null);  // State for user
  const [userData, setUserData] = useState(null);  // State for user data (registration data)
  const [role, setRole] = useState(null);  // State for user role (student/instructor)
  const [loading, setLoading] = useState(true);  // State for loading state
  const navigate = useNavigate();  // For navigation

  // Handle Firebase auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // Set user if logged in
        const userRole = await fetchUserRole(currentUser.uid);  // Fetch user role
        setRole(userRole);  // Set role
        // Fetch user registration data
        await fetchUserData(currentUser.uid, userRole);
      } else {
        setUser(null);  // Set user to null if logged out
        navigate("/login");  // Redirect to login page if not authenticated
      }

      setLoading(false);  // Set loading state to false after processing
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  // Function to fetch user data based on role
  const fetchUserData = async (userId, userRole) => {
    const db = getDatabase();
    const userRef = ref(db, `registrations/${userRole}/${userId}`);

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        setUserData(snapshot.val());  // Set user data if found
      } else {
        console.log("No user data found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await logOut(); // Call logOut function from Firebase
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display a message if no user data is found
  if (!userData) {
    return <div>No profile data found.</div>;
  }

  // Display profile information
  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {role}</p>
      {/* Display other user data */}
      {userData && (
        <div>
          <p>Full Name: {userData.fullName}</p>
          <p>Location: {userData.location}</p>
          {role === "student" && (
            <>
              <p>Branch: {userData.branch}</p>
              <p>Year of Study: {userData.yearOfStudy}</p>
            </>
          )}
          {role === "instructor" && (
            <>
              <p>Department: {userData.department}</p>
              <p>Subjects: {userData.subjects}</p>
            </>
          )}
        </div>
      )}
      
      {/* Log Out Button */}
      <button
        onClick={handleLogout}
        style={{
            padding: "8px 16px",    // Slightly bigger padding for a button look
            fontSize: "14px",       // Medium font size
            cursor: "pointer",     // Pointer cursor for better UX
            backgroundColor: "#f44336",  // Red background color for logout
            color: "white",         // White text color
            border: "none",         // Remove border
            borderRadius: "5px",    // Slightly rounded corners
            marginTop: "20px",      // Space between profile info and button
            transition: "background-color 0.3s ease", // Smooth background color transition
            width: "auto",          // Auto width based on content
            minWidth: "120px",      // Minimum width to prevent too small button
          }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#d32f2f"} // Darken on hover
        onMouseOut={(e) => e.target.style.backgroundColor = "#f44336"} // Reset color when not hovered
      >
        Log Out
      </button>
    </div>
  );
};

export default Profile;