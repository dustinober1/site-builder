import React, { useState } from 'react';
import './ProjectList.css';

function ProjectList({ onCreateProject, onOpenProject, onBack }) {
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreateProject(projectName);
      setProjectName('');
      setShowForm(false);
    }
  };

  return (
    <div className="project-list">
      <header className="project-header" role="banner">
        <div className="project-container">
          <h1>Your Courses</h1>
          <button 
            className="back-button"
            onClick={onBack}
            aria-label="Go back to home"
          >
            ← Home
          </button>
        </div>
      </header>

      <main className="project-main" role="main">
        <div className="project-container">
          {!showForm && (
            <button 
              className="create-button"
              onClick={() => setShowForm(true)}
              aria-label="Create a new course"
            >
              + Create New Course
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="project-form" role="form">
              <h2>Create New Course</h2>
              <div className="form-group">
                <label htmlFor="project-name">Course Name</label>
                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter course name"
                  autoFocus
                  aria-required="true"
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-button">Create Course</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setShowForm(false);
                    setProjectName('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {projects.length > 0 && (
            <section aria-labelledby="projects-heading">
              <h2 id="projects-heading">Your Courses</h2>
              <div className="projects-grid">
                {projects.map(project => (
                  <div key={project.id} className="project-card">
                    <h3>{project.name}</h3>
                    <p className="project-date">Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                    <button 
                      onClick={() => onOpenProject(project)}
                      className="open-button"
                      aria-label={`Open ${project.name} course`}
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length === 0 && !showForm && (
            <div className="empty-state" role="status" aria-live="polite">
              <p>No courses yet. Create your first one to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProjectList;
