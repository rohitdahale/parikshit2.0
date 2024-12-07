import React, { useState, useRef } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { Edit, Save, Trash2, Plus, FileText, Video, Link, File } from 'lucide-react';
import "../CreateCourse/createcourse.css"

const CreateCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [isDescriptionEditable, setIsDescriptionEditable] = useState(false);
  const descriptionRef = useRef(null);

  const [units, setUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState({
    name: "",
    description: "",
    videos: [],
    pdfs: [],
    hyperlinks: []
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e, fileType) => {
    const files = Array.from(e.target.files);
    setCurrentUnit(prev => ({
      ...prev,
      [fileType]: [...prev[fileType], ...files]
    }));
  };

  const handleAddHyperlink = (link) => {
    if (link.trim()) {
      setCurrentUnit(prev => ({
        ...prev,
        hyperlinks: [...prev.hyperlinks, link.trim()]
      }));
    }
  };

  const handleAddUnit = () => {
    const { name, description, videos, pdfs, hyperlinks } = currentUnit;
    
    if (!name || !description) {
      setErrorMessage("Unit name and description are required.");
      return;
    }

    setUnits(prev => [...prev, {
      ...currentUnit,
      videos: videos.map(file => file.name),
      pdfs: pdfs.map(file => file.name)
    }]);

    // Reset current unit
    setCurrentUnit({
      name: "",
      description: "",
      videos: [],
      pdfs: [],
      hyperlinks: []
    });
    setErrorMessage("");
  };

  const handleRemoveUnit = (indexToRemove) => {
    setUnits(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDescriptionEdit = () => {
    setIsDescriptionEditable(true);
    setTimeout(() => descriptionRef.current?.focus(), 100);
  };

  const handleDescriptionSave = () => {
    setIsDescriptionEditable(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (units.length === 0) {
      setErrorMessage("You must add at least one unit.");
      return;
    }

    try {
      const user = getAuth().currentUser;
      if (!user) {
        setErrorMessage("You must be logged in to create a course.");
        return;
      }

      const db = getDatabase();
      const instructorName = user.displayName || "Unknown Instructor";
      const courseData = {
        name: courseName,
        description,
        units,
        instructorName,
        createdAt: new Date().toISOString(),
      };

      const coursesRef = ref(db, "courses");
      await push(coursesRef, courseData);

      // Reset form
      setCourseName("");
      setDescription("");
      setUnits([]);
      setCurrentUnit({
        name: "",
        description: "",
        videos: [],
        pdfs: [],
        hyperlinks: []
      });

      setSuccessMessage("Course created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      setErrorMessage("Error creating course. Please try again.");
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="create-course-container">
      <div className="create-course-header">
        <h1>Create New Course</h1>
      </div>

      {successMessage && (
        <div className="alert success-message">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert error-message">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-section course-details">
          <div className="input-group">
            <label>Course Name</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              placeholder="Enter course name"
            />
          </div>

          <div className="input-group description-group">
            <label>
              Course Description
              {!isDescriptionEditable && (
                <button 
                  type="button" 
                  className="edit-button"
                  onClick={handleDescriptionEdit}
                >
                  <Edit size={16} />
                </button>
              )}
            </label>
            {isDescriptionEditable ? (
              <div className="description-edit-group">
                <textarea
                  ref={descriptionRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe your course in detail"
                  onBlur={handleDescriptionSave}
                />
                <button 
                  type="button" 
                  className="save-button"
                  onClick={handleDescriptionSave}
                >
                  <Save size={16} /> Save
                </button>
              </div>
            ) : (
              <div className="description-preview">
                {description || "No description yet"}
              </div>
            )}
          </div>
        </div>

        <div className="course-units-section">
          <h2>Course Units</h2>
          
          <div className="current-unit-form">
            <div className="input-group">
              <label>Unit Name</label>
              <input
                type="text"
                value={currentUnit.name}
                onChange={(e) => setCurrentUnit(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Enter unit name"
              />
            </div>

            <div className="input-group">
              <label>Unit Description</label>
              <textarea
                value={currentUnit.description}
                onChange={(e) => setCurrentUnit(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Describe this unit"
              />
            </div>

            <div className="file-upload-group">
              <div className="input-group">
                <label>
                  <Video size={16} /> Videos
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, 'videos')}
                  />
                </label>
                <div className="file-list">
                  {currentUnit.videos.map((file, index) => (
                    <span key={index}>{file.name}</span>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>
                  <FileText size={16} /> PDFs
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, 'pdfs')}
                  />
                </label>
                <div className="file-list">
                  {currentUnit.pdfs.map((file, index) => (
                    <span key={index}>{file.name}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="input-group hyperlink-group">
              <label>
                <Link size={16} /> Hyperlinks
              </label>
              <div className="hyperlink-input">
                <input
                  type="url"
                  placeholder="Add hyperlink"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHyperlink(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    handleAddHyperlink(input.value);
                    input.value = '';
                  }}
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="hyperlink-list">
                {currentUnit.hyperlinks.map((link, index) => (
                  <span key={index}>{link}</span>
                ))}
              </div>
            </div>

            <button 
              type="button" 
              className="add-unit-button"
              onClick={handleAddUnit}
            >
              <Plus size={16} /> Add Unit
            </button>
          </div>

          {units.length > 0 && (
            <div className="units-list">
              <h3>Added Units</h3>
              {units.map((unit, index) => (
                <div key={index} className="unit-item">
                  <div className="unit-header">
                    <h4>{unit.name}</h4>
                    <button 
                      type="button" 
                      className="remove-unit-button"
                      onClick={() => handleRemoveUnit(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p>{unit.description}</p>
                  <div className="unit-details">
                    <span>{unit.videos.length} Videos</span>
                    <span>{unit.pdfs.length} PDFs</span>
                    <span>{unit.hyperlinks.length} Links</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="submit-course-button">
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;