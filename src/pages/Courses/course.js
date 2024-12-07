import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { auth } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import "../Courses/courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]); // All courses from Firebase
  const [userEnrolledCourses, setUserEnrolledCourses] = useState([]); // Enrolled courses
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch all courses from Firebase
  const fetchCourses = async () => {
    const db = getDatabase();
    const courseRef = ref(db, "courses");

    try {
      const snapshot = await get(courseRef);
      if (snapshot.exists()) {
        const coursesData = snapshot.val();

        // Convert object to array
        const coursesArray = Object.keys(coursesData).map((key) => ({
          id: key,
          ...coursesData[key],
        }));

        setCourses(coursesArray); // Update courses state
      } else {
        console.log("No courses found in database.");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrolled courses for the current user
  const fetchEnrolledCourses = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log("User not logged in");
      return;
    }

    const db = getDatabase();
    const enrolledCoursesRef = ref(db, `users/${user.uid}/enrolledCourses`);

    try {
      const snapshot = await get(enrolledCoursesRef);
      if (snapshot.exists()) {
        const enrolledCoursesData = snapshot.val();
        const enrolledCoursesArray = Object.keys(enrolledCoursesData).filter(
          (key) => enrolledCoursesData[key] === true
        );

        setUserEnrolledCourses(enrolledCoursesArray); // Update state
      } else {
        console.log("User has no enrolled courses.");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  // Enroll user in a course
  const handleEnroll = async (courseId) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to enroll in courses.");
      navigate("/login");
      return;
    }

    const db = getDatabase();
    const userRef = ref(db, `users/${user.uid}/enrolledCourses`);
    const updates = { [courseId]: true };

    try {
      await set(userRef, updates);
      setUserEnrolledCourses((prevCourses) => [...prevCourses, courseId]);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  // Fetch courses and enrolled courses on component mount
  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  // Filter courses not enrolled by the user
  const notEnrolledCourses = courses.filter(
    (course) => !userEnrolledCourses.includes(course.id)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="courses">
      <div className="header">
        <h2>Total Courses: {courses.length}</h2>
        <h3>Available Courses: {notEnrolledCourses.length}</h3>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search For Courses" />
        <button>Search</button>
      </div>

      <div className="course-list">
        {notEnrolledCourses.length === 0 ? (
          <div>No available courses</div>
        ) : (
          notEnrolledCourses.map((course) => (
            <div className="course-card" key={course.id}>
              <div className="course-icon"></div>
              <div className="course-details">
                <h4>{course.name}</h4>
                <p className="instructor">{course.instructorName}</p>
                <p className="description">{course.description}</p>
                <p className="course-id">Course Id - {course.id}</p>

                <button
                  className="enroll-btn"
                  onClick={() => handleEnroll(course.id)}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Courses;
