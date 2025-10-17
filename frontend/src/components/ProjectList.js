import React, { useState, useEffect } from 'react';
import './ProjectList.css';
import TemplateGallery from './TemplateGallery';
import {
  getAllProjects,
  saveProject,
  deleteProject,
  exportProject,
  importProject,
  createProjectFromTemplate,
  duplicateProject
} from '../utils/projectStorage';

function ProjectList({ onCreateProject, onOpenProject, onBack }) {
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const saved = getAllProjects();
    setProjects(saved);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      const newProject = {
        id: Date.now(),
        name: projectName,
        pages: [
          {
            id: 1,
            title: 'Welcome',
            slug: 'welcome',
            content: []
          }
        ],
        createdAt: new Date().toISOString()
      };
      
      saveProject(newProject);
      onCreateProject(projectName);
      setProjectName('');
      setShowForm(false);
      showMessage('Course created successfully!', 'success');
    }
  };

  const handleTemplateSelect = (templateId, name) => {
    try {
      const project = createProjectFromTemplate(templateId, name);
      onOpenProject(project);
      setShowTemplates(false);
      showMessage(`Created "${name}" from template!`, 'success');
    } catch (error) {
      showMessage('Error creating project from template: ' + error.message, 'error');
    }
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this course? This cannot be undone.')) {
      deleteProject(projectId);
      loadProjects();
      showMessage('Course deleted successfully', 'success');
    }
  };

  const handleExportProject = (project) => {
    try {
      exportProject(project);
      showMessage(`Exported "${project.name}" successfully!`, 'success');
    } catch (error) {
      showMessage('Error exporting project: ' + error.message, 'error');
    }
  };

  const handleImportProject = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const project = await importProject(file);
      loadProjects();
      showMessage(`Imported "${project.name}" successfully!`, 'success');
    } catch (error) {
      showMessage('Error importing project: ' + error.message, 'error');
    }

    // Reset file input
    e.target.value = '';
  };

  const handleDuplicateProject = (project) => {
    try {
      const duplicate = duplicateProject(project.id);
      loadProjects();
      showMessage(`Duplicated "${project.name}" successfully!`, 'success');
    } catch (error) {
      showMessage('Error duplicating project: ' + error.message, 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  const filteredProjects = projects
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (selectedSort) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="project-list">
      <header className="project-header" role="banner">
        <div className="project-container">
          <div className="header-left">
            <h1>Your Courses</h1>
            <span className="course-count" aria-label={`${projects.length} courses`}>
              {projects.length}
            </span>
          </div>
          <button 
            className="back-button"
            onClick={onBack}
            aria-label="Go back to home"
          >
            ← Home
          </button>
        </div>
      </header>

      {message && (
        <div 
          className={`message ${messageType}`}
          role="alert"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      <main className="project-main" role="main">
        <div className="project-container">
          <div className="toolbar">
            <div className="toolbar-left">
              <button 
                className="create-button"
                onClick={() => setShowForm(true)}
                aria-label="Create a new blank course"
              >
                + New Blank Course
              </button>
              <button 
                className="template-button"
                onClick={() => setShowTemplates(true)}
                aria-label="Create course from template"
              >
                📋 From Template
              </button>
            </div>

            <div className="toolbar-right">
              <div className="search-group">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  aria-label="Search courses"
                />
              </div>

              {projects.length > 0 && (
                <select 
                  value={selectedSort} 
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="sort-select"
                  aria-label="Sort courses by"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">By Name</option>
                </select>
              )}

              <label className="import-label">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportProject}
                  style={{ display: 'none' }}
                  aria-label="Import course file"
                />
                📥 Import
              </label>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="project-form" role="form">
              <h2>Create New Blank Course</h2>
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

          {filteredProjects.length > 0 && (
            <section aria-labelledby="projects-heading">
              <h2 id="projects-heading" className="projects-heading">
                {searchQuery ? 'Search Results' : 'Your Courses'} ({filteredProjects.length})
              </h2>
              <div className="projects-grid">
                {filteredProjects.map(project => (
                  <div key={project.id} className="project-card">
                    <div className="card-header">
                      <h3>{project.name}</h3>
                      {project.templateId && (
                        <span className="template-badge" title="Created from template">📋</span>
                      )}
                    </div>
                    <p className="project-info">
                      <span className="pages-count">{project.pages?.length || 0} pages</span>
                      <span className="date">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                    <div className="card-actions">
                      <button 
                        onClick={() => onOpenProject(project)}
                        className="open-button"
                        aria-label={`Open ${project.name} course`}
                      >
                        Open
                      </button>
                      <button 
                        onClick={() => handleDuplicateProject(project)}
                        className="duplicate-button"
                        title="Duplicate this course"
                        aria-label={`Duplicate ${project.name}`}
                      >
                        📋
                      </button>
                      <button 
                        onClick={() => handleExportProject(project)}
                        className="export-button"
                        title="Export as JSON"
                        aria-label={`Export ${project.name}`}
                      >
                        📥
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="delete-button"
                        title="Delete course"
                        aria-label={`Delete ${project.name}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length === 0 && !showForm && (
            <div className="empty-state" role="status" aria-live="polite">
              <div className="empty-icon">📚</div>
              <h2>No courses yet</h2>
              <p>Create your first course to get started!</p>
              <button 
                onClick={() => setShowForm(true)}
                className="empty-state-button"
              >
                + Create Blank Course
              </button>
              <button 
                onClick={() => setShowTemplates(true)}
                className="empty-state-button template-btn"
              >
                📋 Or Choose a Template
              </button>
            </div>
          )}

          {searchQuery && filteredProjects.length === 0 && (
            <div className="empty-state" role="status" aria-live="polite">
              <p>No courses found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      {showTemplates && (
        <TemplateGallery 
          onSelectTemplate={handleTemplateSelect}
          onCancel={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}

export default ProjectList;
