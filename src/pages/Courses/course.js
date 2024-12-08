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
    <>
      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="content-wrapper">
            <aside className="filters">
              <h3>Course Filters</h3>
              <button className="close-btn"><i className="fas fa-times"></i> Close Filters</button>

              <div className="filter-group">
                <label htmlFor="domain">Domain</label>
                <select id="domain" className="custom-select">
                  <option value="">All Domains</option>
                  <option value="engineering">Engineering</option>
                  <option value="science">Science</option>
                  <option value="technology">Technology</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="provider">Provider</label>
                <select id="provider" className="custom-select">
                  <option value="">All Providers</option>
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="difficulty">Difficulty</label>
                <select id="difficulty" className="custom-select">
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <button className="apply-filter">
                <i className="fas fa-filter"></i> Apply Filters
              </button>
            </aside>

            <section className="course-section">
              <div className="search-container">
                <input type="text" placeholder="Search for courses..." className="search-input" />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>

              <div className="course-list">
                {notEnrolledCourses.length === 0 ? (
                  <div>No available courses</div>
                ) : (
                  notEnrolledCourses.map((course) => (
                    <div className="course-card" key={course.id}>
                      <div className="course-header">
                        <h4>{course.name}</h4>
                        <span className={`course-level ${course.level ? course.level.toLowerCase() : "unknown"}`}>
                          {course.level || "Unknown Level"}
                        </span>
                      </div>

                      <p className="course-instructor">by {course.instructorName}</p>
                      <p className="course-description">{course.description}</p>
                      <div className="course-meta">
                        <span className="course-id">Course ID: {course.id}</span>
                        <span className="course-duration">
                          <i className="fas fa-clock"></i> {course.duration}
                        </span>
                      </div>
                      <button className="enroll-btn" onClick={() => handleEnroll(course.id)}>
                        <i className="fas fa-graduation-cap"></i> Enroll Now
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section about">
              <h3>Parikshit</h3>
              <p>Transforming education through innovative online learning solutions.</p>
              <div className="social-links">
                <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
            <div className="footer-section links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Terms of Use</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-section contact">
              <h4>Contact Us</h4>
              <ul>
                <li><i className="fas fa-map-marker-alt"></i> 123 Main Street, City</li>
                <li><i className="fas fa-phone"></i> +1 123-456-7890</li>
                <li><i className="fas fa-envelope"></i> info@example.com</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Courses;
