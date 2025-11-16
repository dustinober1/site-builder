import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import Editor from './components/Editor';
import ProjectList from './components/ProjectList';
import WelcomeScreen from './components/WelcomeScreen';
import TemplateLibrary from './components/TemplateLibrary';
import ErrorBoundary from './components/ErrorBoundary';
import { getAllProjects } from './utils/projectStorage';

function App() {
  const [currentView, setCurrentView] = useState('welcome'); // welcome, projects, editor
  const [currentProject, setCurrentProject] = useState(null);
  const [hasProjects, setHasProjects] = useState(false);

  // Check if there are saved projects on component mount
  useEffect(() => {
    const projects = getAllProjects();
    setHasProjects(projects.length > 0);
  }, []);

  const handleCreateProject = useCallback((projectName) => {
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
    setCurrentProject(newProject);
    setCurrentView('editor');
  }, []);

  const handleOpenProject = useCallback((project) => {
    setCurrentProject(project);
    setCurrentView('editor');
  }, []);

  const handleBackToProjects = useCallback(() => {
    setCurrentView('projects');
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setCurrentView('welcome');
    setCurrentProject(null);
  }, []);

  return (
    <ErrorBoundary>
      <div className="app">
        {currentView === 'welcome' && (
          <WelcomeScreen onGetStarted={() => setCurrentView('projects')} />
        )}
        {currentView === 'projects' && (
          <ProjectList
            onCreateProject={handleCreateProject}
            onOpenProject={handleOpenProject}
            onBack={handleBackToWelcome}
          />
        )}
        {currentView === 'editor' && currentProject && (
          <ErrorBoundary>
            <Editor
              project={currentProject}
              onBack={handleBackToProjects}
            />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
