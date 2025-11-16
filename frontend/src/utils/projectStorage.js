/**
 * Project Storage Manager
 * Handles saving, loading, and managing projects with localStorage and templates
 */

export const STORAGE_KEY = 'siteBuilder_projects';
export const TEMPLATES_KEY = 'siteBuilder_templates';

// Template definitions
export const AVAILABLE_TEMPLATES = {
  blank: {
    id: 'template-blank',
    name: 'Blank Course',
    description: 'Start with a blank course and build from scratch',
    category: 'basic',
    pages: [
      {
        id: 1,
        title: 'Welcome',
        slug: 'welcome',
        content: []
      }
    ]
  },
  difficultConservation: {
    id: 'template-difficult-conservation',
    name: 'Difficult Conservation',
    description: 'Learn about environmental challenges and conservation solutions',
    category: 'environmental',
    pages: [
      {
        id: 1,
        title: 'Welcome',
        slug: 'welcome',
        content: [
          {
            id: Date.now() + 1,
            type: 'heading',
            content: 'Welcome to Difficult Conservation',
            title: ''
          },
          {
            id: Date.now() + 2,
            type: 'text',
            content: 'This course explores the most pressing environmental challenges facing our planet today. Through comprehensive modules, you\'ll learn about conservation strategies, stakeholder management, and sustainable solutions.',
            title: ''
          }
        ]
      },
      {
        id: 2,
        title: 'Module 1: Foundations',
        slug: 'module-1-foundations',
        content: [
          {
            id: Date.now() + 3,
            type: 'heading',
            content: 'Foundations of Difficult Conservation',
            title: ''
          },
          {
            id: Date.now() + 4,
            type: 'text',
            content: 'Difficult conservation refers to environmental protection efforts that involve complex stakeholder dynamics, scientific uncertainty, or significant socioeconomic tradeoffs.',
            title: ''
          }
        ]
      },
      {
        id: 3,
        title: 'Module 2: Challenges',
        slug: 'module-2-challenges',
        content: [
          {
            id: Date.now() + 5,
            type: 'heading',
            content: 'Major Conservation Challenges',
            title: ''
          },
          {
            id: Date.now() + 6,
            type: 'text',
            content: 'Key challenges include habitat fragmentation, human-wildlife conflict, invasive species, climate change, and limited resources.',
            title: ''
          }
        ]
      },
      {
        id: 4,
        title: 'Module 3: Solutions',
        slug: 'module-3-solutions',
        content: [
          {
            id: Date.now() + 7,
            type: 'heading',
            content: 'Innovative Solutions',
            title: ''
          },
          {
            id: Date.now() + 8,
            type: 'text',
            content: 'Effective solutions include payment for ecosystem services, coexistence strategies, ecological restoration, and community-based conservation.',
            title: ''
          }
        ]
      }
    ]
  },
  businessTraining: {
    id: 'template-business-training',
    name: 'Business Training Course',
    description: 'Professional training program for corporate development',
    category: 'business',
    pages: [
      {
        id: 1,
        title: 'Course Overview',
        slug: 'overview',
        content: [
          {
            id: Date.now() + 1,
            type: 'heading',
            content: 'Professional Development Training',
            title: ''
          },
          {
            id: Date.now() + 2,
            type: 'text',
            content: 'This course covers essential skills for professional success in modern business environments.',
            title: ''
          }
        ]
      },
      {
        id: 2,
        title: 'Module 1: Fundamentals',
        slug: 'module-1',
        content: []
      },
      {
        id: 3,
        title: 'Module 2: Advanced Topics',
        slug: 'module-2',
        content: []
      }
    ]
  },
  technicalDocumentation: {
    id: 'template-tech-docs',
    name: 'Technical Documentation',
    description: 'Template for creating technical training and documentation',
    category: 'technical',
    pages: [
      {
        id: 1,
        title: 'Getting Started',
        slug: 'getting-started',
        content: [
          {
            id: Date.now() + 1,
            type: 'heading',
            content: 'Getting Started Guide',
            title: ''
          }
        ]
      },
      {
        id: 2,
        title: 'Installation',
        slug: 'installation',
        content: []
      },
      {
        id: 3,
        title: 'Usage Guide',
        slug: 'usage-guide',
        content: []
      },
      {
        id: 4,
        title: 'Troubleshooting',
        slug: 'troubleshooting',
        content: []
      }
    ]
  }
};

/**
 * Get all saved projects from localStorage
 */
export const getAllProjects = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

/**
 * Save a single project
 */
export const saveProject = (project) => {
  try {
    const projects = getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = {
        ...project,
        updatedAt: new Date().toISOString()
      };
    } else {
      projects.push({
        ...project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    return false;
  }
};

/**
 * Delete a project
 */
export const deleteProject = (projectId) => {
  try {
    const projects = getAllProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

/**
 * Export a project as JSON
 */
export const exportProject = (project) => {
  try {
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error exporting project:', error);
    return false;
  }
};

/**
 * Import a project from JSON file
 */
export const importProject = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const project = JSON.parse(e.target.result);
        
        // Validate project structure
        if (!project.name || !project.pages) {
          reject(new Error('Invalid project file format'));
          return;
        }
        
        // Generate new ID to avoid conflicts
        project.id = Date.now();
        project.importedAt = new Date().toISOString();
        
        saveProject(project);
        resolve(project);
      } catch (error) {
        reject(new Error('Failed to parse project file: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Create a new project from a template
 */
export const createProjectFromTemplate = (templateId, projectName) => {
  const template = AVAILABLE_TEMPLATES[templateId];
  
  if (!template) {
    throw new Error('Template not found');
  }
  
  const newProject = {
    id: Date.now(),
    name: projectName || template.name,
    description: template.description,
    templateId: templateId,
    pages: template.pages.map(page => ({
      ...page,
      id: Date.now() + Math.random() // Ensure unique IDs
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  saveProject(newProject);
  return newProject;
};

/**
 * Get all available templates
 */
export const getAvailableTemplates = () => {
  return Object.entries(AVAILABLE_TEMPLATES).map(([key, template]) => ({
    ...template,
    templateId: key
  }));
};

/**
 * Duplicate a project
 */
export const duplicateProject = (projectId) => {
  const projects = getAllProjects();
  const original = projects.find(p => p.id === projectId);
  
  if (!original) {
    throw new Error('Project not found');
  }
  
  const duplicate = {
    ...original,
    id: Date.now(),
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  saveProject(duplicate);
  return duplicate;
};

/**
 * Search projects by name or description
 */
export const searchProjects = (query) => {
  const projects = getAllProjects();
  const lowerQuery = query.toLowerCase();
  
  return projects.filter(project => 
    project.name.toLowerCase().includes(lowerQuery) ||
    (project.description && project.description.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Get project statistics
 */
export const getProjectStats = (projectId) => {
  const projects = getAllProjects();
  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return null;
  }
  
  const totalPages = project.pages.length;
  const totalBlocks = project.pages.reduce((sum, page) => 
    sum + (page.content ? page.content.length : 0), 0
  );
  
  return {
    projectId,
    name: project.name,
    totalPages,
    totalBlocks,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    templateUsed: project.templateId
  };
};

/**
 * Auto-save project (typically called periodically)
 */
export const autoSaveProject = (project) => {
  return saveProject({
    ...project,
    lastAutoSave: new Date().toISOString()
  });
};

/**
 * Save a version of a project for version history
 */
export const saveProjectVersion = (project) => {
  try {
    // Get existing versions
    const storageKey = `${STORAGE_KEY}_versions_${project.id}`;
    const existingVersions = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Create a version snapshot
    const version = {
      id: Date.now(),
      projectId: project.id,
      name: project.name,
      version: existingVersions.length + 1,
      createdAt: new Date().toISOString(),
      projectData: { ...project }
    };
    
    // Add the new version
    existingVersions.push(version);
    
    // Keep only last 10 versions to prevent localStorage bloat
    if (existingVersions.length > 10) {
      existingVersions.shift();
    }
    
    localStorage.setItem(storageKey, JSON.stringify(existingVersions));
    return true;
  } catch (error) {
    console.error('Error saving project version:', error);
    return false;
  }
};

/**
 * Get version history for a project
 */
export const getProjectVersions = (projectId) => {
  try {
    const storageKey = `${STORAGE_KEY}_versions_${projectId}`;
    const versions = localStorage.getItem(storageKey);
    return versions ? JSON.parse(versions) : [];
  } catch (error) {
    console.error('Error loading project versions:', error);
    return [];
  }
};

/**
 * Restore project from a specific version
 */
export const restoreProjectVersion = (projectId, versionId) => {
  try {
    const versions = getProjectVersions(projectId);
    const versionToRestore = versions.find(v => v.id === versionId);
    
    if (!versionToRestore) {
      throw new Error('Version not found');
    }
    
    // Save current version before restoring (to preserve history)
    const currentProjects = getAllProjects();
    const currentProject = currentProjects.find(p => p.id === projectId);
    if (currentProject) {
      saveProjectVersion(currentProject);
    }
    
    // Update the project with the restored version
    const restoredProject = {
      ...versionToRestore.projectData,
      updatedAt: new Date().toISOString(),
      restoredFromVersion: versionId
    };
    
    return saveProject(restoredProject);
  } catch (error) {
    console.error('Error restoring project version:', error);
    return false;
  }
};

/**
 * Auto-save project (typically called periodically) with version history
 */
export const autoSaveProject = (project) => {
  // Create a version only if there have been significant changes (e.g., 5 minutes apart)
  const result = saveProject({
    ...project,
    lastAutoSave: new Date().toISOString()
  });
  
  // Save version if at least 5 minutes have passed since last version was saved
  if (result) {
    const storageKey = `${STORAGE_KEY}_versions_${project.id}`;
    const versions = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Only save if it's been at least 5 minutes since the last version was saved
    const now = new Date().getTime();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (versions.length === 0 || (now - new Date(versions[versions.length - 1].createdAt).getTime()) > fiveMinutes) {
      saveProjectVersion({
        ...project,
        lastAutoSave: new Date().toISOString()
      });
    }
  }
  
  return result;
};

export default {
  getAllProjects,
  saveProject,
  deleteProject,
  exportProject,
  importProject,
  createProjectFromTemplate,
  getAvailableTemplates,
  duplicateProject,
  searchProjects,
  getProjectStats,
  autoSaveProject,
  saveProjectVersion,
  getProjectVersions,
  restoreProjectVersion
};
