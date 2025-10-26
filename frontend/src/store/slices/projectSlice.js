import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAllProjects, 
  saveProject, 
  deleteProject, 
  exportProject, 
  importProject,
  createProjectFromTemplate,
  duplicateProject,
  searchProjects,
  getProjectStats
} from '../../utils/projectStorage';

// Async thunks
export const loadProjects = createAsyncThunk(
  'project/loadProjects',
  async (_, { rejectWithValue }) => {
    try {
      const projects = getAllProjects();
      return { projects };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveCurrentProject = createAsyncThunk(
  'project/saveCurrentProject',
  async (project, { rejectWithValue }) => {
    try {
      const success = saveProject(project);
      if (!success) {
        throw new Error('Failed to save project');
      }
      return { project };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProjectById = createAsyncThunk(
  'project/deleteProjectById',
  async (projectId, { rejectWithValue }) => {
    try {
      const success = deleteProject(projectId);
      if (!success) {
        throw new Error('Failed to delete project');
      }
      return { projectId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const exportProjectById = createAsyncThunk(
  'project/exportProjectById',
  async (project, { rejectWithValue }) => {
    try {
      const success = exportProject(project);
      if (!success) {
        throw new Error('Failed to export project');
      }
      return { project };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const importProjectFromFile = createAsyncThunk(
  'project/importProjectFromFile',
  async (file, { rejectWithValue }) => {
    try {
      const project = await importProject(file);
      return { project };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async ({ templateId, projectName }, { rejectWithValue }) => {
    try {
      const project = createProjectFromTemplate(templateId, projectName);
      return { project };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const duplicateProjectById = createAsyncThunk(
  'project/duplicateProjectById',
  async (projectId, { rejectWithValue }) => {
    try {
      const duplicate = duplicateProject(projectId);
      return { project: duplicate };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchProjectsQuery = createAsyncThunk(
  'project/searchProjects',
  async (query, { rejectWithValue }) => {
    try {
      const results = searchProjects(query);
      return { results, query };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProjectStatistics = createAsyncThunk(
  'project/getProjectStatistics',
  async (projectId, { rejectWithValue }) => {
    try {
      const stats = getProjectStats(projectId);
      return { projectId, stats };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  searchResults: [],
  searchQuery: '',
  statistics: {},
  lastSaved: null,
};

// Slice
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    updateCurrentProject: (state, action) => {
      if (state.currentProject) {
        state.currentProject = { ...state.currentProject, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    setLastSaved: (state, action) => {
      state.lastSaved = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Load projects
    builder
      .addCase(loadProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.projects;
      })
      .addCase(loadProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Save project
    builder
      .addCase(saveCurrentProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveCurrentProject.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSaved = new Date().toISOString();
        
        // Update project in list if it exists
        const index = state.projects.findIndex(p => p.id === action.payload.project.id);
        if (index >= 0) {
          state.projects[index] = action.payload.project;
        } else {
          state.projects.push(action.payload.project);
        }
        
        // Update current project if it matches
        if (state.currentProject && state.currentProject.id === action.payload.project.id) {
          state.currentProject = action.payload.project;
        }
      })
      .addCase(saveCurrentProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete project
    builder
      .addCase(deleteProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload.projectId);
        
        // Clear current project if it was deleted
        if (state.currentProject && state.currentProject.id === action.payload.projectId) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Export project
    builder
      .addCase(exportProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportProjectById.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Import project
    builder
      .addCase(importProjectFromFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importProjectFromFile.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload.project);
      })
      .addCase(importProjectFromFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload.project);
        state.currentProject = action.payload.project;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Duplicate project
    builder
      .addCase(duplicateProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(duplicateProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload.project);
      })
      .addCase(duplicateProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search projects
    builder
      .addCase(searchProjectsQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProjectsQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.results;
        state.searchQuery = action.payload.query;
      })
      .addCase(searchProjectsQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get project statistics
    builder
      .addCase(getProjectStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics[action.payload.projectId] = action.payload.stats;
      })
      .addCase(getProjectStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentProject,
  clearCurrentProject,
  updateCurrentProject,
  clearError,
  clearSearchResults,
  setLastSaved,
} = projectSlice.actions;

// Selectors
export const selectProjects = (state) => state.project.projects;
export const selectCurrentProject = (state) => state.project.currentProject;
export const selectProjectLoading = (state) => state.project.loading;
export const selectProjectError = (state) => state.project.error;
export const selectSearchResults = (state) => state.project.searchResults;
export const selectSearchQuery = (state) => state.project.searchQuery;
export const selectProjectStatistics = (state) => state.project.statistics;
export const selectLastSaved = (state) => state.project.lastSaved;

export default projectSlice.reducer;
