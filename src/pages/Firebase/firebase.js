import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"; // Add signOut import
import { getDatabase, ref, set, get } from "firebase/database";
//import { getAuth, onAuthStateChanged } from "firebase/auth";
//import { ref, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX3--3EeGMllmLCsqvOoNZjH5YRmvFc3s",
  authDomain: "my-react-app-3a02f.firebaseapp.com",
  databaseURL: "https://my-react-app-3a02f-default-rtdb.firebaseio.com/",
  projectId: "my-react-app-3a02f",
  storageBucket: "my-react-app-3a02f.appspot.com",
  messagingSenderId: "258880983204",
  appId: "1:258880983204:web:5d03fede5d77cab66cd631",
  measurementId: "G-VQ57HBMF5W",
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Sign up function
export const signUp = async (email, password, userType, additionalData) => {
  try {
    // Create user with email and password in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up successfully:", userCredential);

    // After successful sign-up, save the user's additional data
    const userId = userCredential.user.uid;

    // Save additional user details (like userType, fullName, etc.) to Firebase Realtime Database
    await saveRegistrationData(userId, additionalData, userType);

    return userCredential; // Return userCredential after sign-up
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    throw new Error(error.message); // Propagate error to be handled in component
  }
};

// Log in function
export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully:", userCredential);
    return userCredential;
  } catch (error) {
    console.error("Error during login:", error.message);
    throw new Error(error.message); // Propagate error to be handled in component
  }
};

// Log out function
export const logOut = async () => {
  try {
    await signOut(auth); // Firebase sign-out
    localStorage.removeItem("role"); // Remove role from localStorage
  } catch (error) {
    console.error("Error during logout:", error);
    throw error; // Propagate error
  }
};

// Save registration data to Firebase Realtime Database
export const saveRegistrationData = async (userId, registrationData, userType) => {
  try {
    if (!userId || !registrationData || !userType) {
      throw new Error("Invalid input parameters to save registration data.");
    }

    const userRef = ref(database, `registrations/${userType.toLowerCase()}/${userId}`);
    console.log("Saving registration data for:", userId, "under", userType);
    await set(userRef, {
      ...registrationData,
      timestamp: new Date().toISOString(),
      userType,
    });
    console.log("Registration data saved successfully.");
  } catch (error) {
    console.error("Error saving registration data:", error.message);
    throw new Error("Failed to save registration data.");
  }
};

// Fetch user role based on userId (for redirecting users after login)
export const fetchUserRole = async (userId) => {
  try {
    const db = getDatabase();
    
    // Check for instructor role
    const instructorRef = ref(db, `registrations/instructor/${userId}`);
    const instructorSnapshot = await get(instructorRef);
    
    // If instructor data exists, return instructor role
    if (instructorSnapshot.exists()) {
      return "instructor";  
    }

    // Check for student role if no instructor data is found
    const studentRef = ref(db, `registrations/student/${userId}`);
    const studentSnapshot = await get(studentRef);

    // If student data exists, return student role
    if (studentSnapshot.exists()) {
      return "student";  
    }

    // If neither role found, throw an error
    throw new Error("User role not defined in both instructor and student paths.");
  } catch (error) {
    console.error("Error fetching user role:", error.message);
    throw error; // Propagate error to be handled by the caller
  }
}; 
// firebase.js (add this function for saving course data)

export const saveCreateCourseData = async (courseData, instructorId) => {
  try {
    const courseRef = ref(database, `courses/${courseData.courseId}`);
    
    // Log before saving
    console.log("Saving course data to Firebase:", courseData);

    await set(courseRef, {
      title: courseData.title,
      description: courseData.description,
      instructorId: instructorId,
      timestamp: new Date().toISOString(),
      units: courseData.units,
    });

    console.log("Course saved successfully:", courseData.courseId);
  } catch (error) {
    console.error("Error saving course data:", error.message);
    alert("Error saving course data. See console for details.");
    throw new Error("Failed to save course data.");
  }
};

// Fetch all courses from Firebase Realtime Database
export const fetchCourses = async () => {
  try {
    // Reference to the "courses" collection in Firebase Realtime Database
    const coursesRef = ref(database, "courses");
    const snapshot = await get(coursesRef);

    if (snapshot.exists()) {
      // Return all courses as an array
      const courses = [];
      snapshot.forEach((childSnapshot) => {
        courses.push({
          courseId: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      return courses;
    } else {
      console.log("No courses available.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    throw new Error("Failed to fetch courses.");
  }
};

// Firebase function to fetch user enrolled courses
export const fetchUserEnrolledCourses = async () => {
  const user = auth.currentUser;
  console.log("Current user:", user);
  if (user) {
    const userRef = ref(database, `users/${user.uid}/enrolledCourses`);
    try {
      const snapshot = await get(userRef);
      console.log("User enrolled courses snapshot:", snapshot.exists(), snapshot.val());
      if (snapshot.exists()) {
        return Object.keys(snapshot.val()); // Return array of enrolled course IDs
      } else {
        console.log("No enrolled courses found.");
        return []; // Empty array if no data exists
      }
    } catch (error) {
      console.error("Error fetching user enrolled courses:", error);
      throw new Error("Failed to fetch enrolled courses.");
    }
  } else {
    throw new Error("User is not authenticated.");
  }
};

export const LocationAwareContent = () => {
  // Your component logic here
  return (
    <div>
      Location Aware Content
    </div>
  );
};

// Export Firebase instances
export { auth, database };