import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Async thunks
export const generateSite = createAsyncThunk(
  'editor/generateSite',
  async ({ projectName, pages }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/generate/site`, {
        projectName,
        pages,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const uploadImage = createAsyncThunk(
  'editor/uploadImage',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_URL}/api/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'editor/uploadVideo',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('video', file);
      
      const response = await axios.post(`${API_URL}/api/upload/video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const generateSCORMPackage = createAsyncThunk(
  'editor/generateSCORMPackage',
  async ({ projectName, pages, version }, { rejectWithValue }) => {
    try {
      const endpoint = version === '2004' ? '/api/generate/scorm-2004' : '/api/generate/scorm-12';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        projectName,
        pages,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const publishCourse = createAsyncThunk(
  'editor/publishCourse',
  async (publishData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/publish/hosted`, publishData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Initial state
const initialState = {
  currentPage: null,
  blocks: [],
  selectedBlockId: null,
  isGenerating: false,
  isUploading: false,
  message: '',
  messageType: '', // 'success' or 'error'
  autoSaveStatus: '',
  isPreviewOpen: false,
  activeTab: 'properties',
  showTemplateLibrary: false,
  showPublishingPanel: false,
  showLearningObjectRepo: false,
  showQuestionBank: false,
  history: [], // For undo/redo functionality
  historyIndex: -1,
  clipboard: null, // For copy/paste functionality
};

// Slice
const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      state.blocks = action.payload.content || [];
      state.selectedBlockId = null;
    },
    
    setBlocks: (state, action) => {
      state.blocks = action.payload;
    },
    
    addBlock: (state, action) => {
      const newBlock = {
        id: Date.now(),
        type: action.payload.type,
        content: '',
        alt: '',
        title: '',
        url: '',
        ...action.payload,
      };
      state.blocks.push(newBlock);
      state.selectedBlockId = newBlock.id;
    },
    
    updateBlock: (state, action) => {
      const { blockId, updates } = action.payload;
      const blockIndex = state.blocks.findIndex(block => block.id === blockId);
      if (blockIndex !== -1) {
        state.blocks[blockIndex] = { ...state.blocks[blockIndex], ...updates };
      }
    },
    
    deleteBlock: (state, action) => {
      const blockId = action.payload;
      state.blocks = state.blocks.filter(block => block.id !== blockId);
      if (state.selectedBlockId === blockId) {
        state.selectedBlockId = null;
      }
    },
    
    moveBlock: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedBlock] = state.blocks.splice(fromIndex, 1);
      state.blocks.splice(toIndex, 0, movedBlock);
    },
    
    setSelectedBlockId: (state, action) => {
      state.selectedBlockId = action.payload;
    },
    
    clearSelectedBlock: (state) => {
      state.selectedBlockId = null;
    },
    
    setMessage: (state, action) => {
      const { message, type } = action.payload;
      state.message = message;
      state.messageType = type;
    },
    
    clearMessage: (state) => {
      state.message = '';
      state.messageType = '';
    },
    
    setAutoSaveStatus: (state, action) => {
      state.autoSaveStatus = action.payload;
    },
    
    setPreviewOpen: (state, action) => {
      state.isPreviewOpen = action.payload;
    },
    
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    toggleTemplateLibrary: (state) => {
      state.showTemplateLibrary = !state.showTemplateLibrary;
    },
    
    togglePublishingPanel: (state) => {
      state.showPublishingPanel = !state.showPublishingPanel;
    },
    
    toggleLearningObjectRepo: (state) => {
      state.showLearningObjectRepo = !state.showLearningObjectRepo;
    },
    
    toggleQuestionBank: (state) => {
      state.showQuestionBank = !state.showQuestionBank;
    },
    
    // History management for undo/redo
    saveToHistory: (state) => {
      // Remove any states after current index
      state.history = state.history.slice(0, state.historyIndex + 1);
      // Add current state to history
      state.history.push({
        blocks: JSON.parse(JSON.stringify(state.blocks)),
        timestamp: Date.now(),
      });
      state.historyIndex++;
      
      // Limit history size
      if (state.history.length > 50) {
        state.history.shift();
        state.historyIndex--;
      }
    },
    
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        const previousState = state.history[state.historyIndex];
        state.blocks = JSON.parse(JSON.stringify(previousState.blocks));
      }
    },
    
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        const nextState = state.history[state.historyIndex];
        state.blocks = JSON.parse(JSON.stringify(nextState.blocks));
      }
    },
    
    // Clipboard functionality
    copyBlock: (state, action) => {
      const blockId = action.payload;
      const block = state.blocks.find(b => b.id === blockId);
      if (block) {
        state.clipboard = JSON.parse(JSON.stringify(block));
      }
    },
    
    pasteBlock: (state) => {
      if (state.clipboard) {
        const newBlock = {
          ...state.clipboard,
          id: Date.now(),
        };
        state.blocks.push(newBlock);
        state.selectedBlockId = newBlock.id;
      }
    },
    
    duplicateBlock: (state, action) => {
      const blockId = action.payload;
      const blockIndex = state.blocks.findIndex(b => b.id === blockId);
      if (blockIndex !== -1) {
        const originalBlock = state.blocks[blockIndex];
        const duplicatedBlock = {
          ...originalBlock,
          id: Date.now(),
        };
        state.blocks.splice(blockIndex + 1, 0, duplicatedBlock);
        state.selectedBlockId = duplicatedBlock.id;
      }
    },
  },
  extraReducers: (builder) => {
    // Generate site
    builder
      .addCase(generateSite.pending, (state) => {
        state.isGenerating = true;
        state.message = '';
        state.messageType = '';
      })
      .addCase(generateSite.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.message = `✓ Site generated successfully! View at: ${action.payload.path}`;
        state.messageType = 'success';
      })
      .addCase(generateSite.rejected, (state, action) => {
        state.isGenerating = false;
        state.message = `✗ Error: ${action.payload}`;
        state.messageType = 'error';
      });

    // Upload image
    builder
      .addCase(uploadImage.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.message = `✓ Image uploaded successfully`;
        state.messageType = 'success';
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.isUploading = false;
        state.message = `✗ Error uploading image: ${action.payload}`;
        state.messageType = 'error';
      });

    // Upload video
    builder
      .addCase(uploadVideo.pending, (state) => {
        state.isUploading = true;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.isUploading = false;
        state.message = `✓ Video uploaded successfully`;
        state.messageType = 'success';
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.isUploading = false;
        state.message = `✗ Error uploading video: ${action.payload}`;
        state.messageType = 'error';
      });

    // Generate SCORM package
    builder
      .addCase(generateSCORMPackage.pending, (state) => {
        state.isGenerating = true;
        state.message = '';
        state.messageType = '';
      })
      .addCase(generateSCORMPackage.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.message = `✓ SCORM ${action.payload.scormVersion} package generated successfully!`;
        state.messageType = 'success';
      })
      .addCase(generateSCORMPackage.rejected, (state, action) => {
        state.isGenerating = false;
        state.message = `✗ Error generating SCORM package: ${action.payload}`;
        state.messageType = 'error';
      });

    // Publish course
    builder
      .addCase(publishCourse.pending, (state) => {
        state.isGenerating = true;
        state.message = '';
        state.messageType = '';
      })
      .addCase(publishCourse.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.message = `✓ Course published successfully! URL: ${action.payload.url}`;
        state.messageType = 'success';
      })
      .addCase(publishCourse.rejected, (state, action) => {
        state.isGenerating = false;
        state.message = `✗ Error publishing course: ${action.payload}`;
        state.messageType = 'error';
      });
  },
});

export const {
  setCurrentPage,
  setBlocks,
  addBlock,
  updateBlock,
  deleteBlock,
  moveBlock,
  setSelectedBlockId,
  clearSelectedBlock,
  setMessage,
  clearMessage,
  setAutoSaveStatus,
  setPreviewOpen,
  setActiveTab,
  toggleTemplateLibrary,
  togglePublishingPanel,
  toggleLearningObjectRepo,
  toggleQuestionBank,
  saveToHistory,
  undo,
  redo,
  copyBlock,
  pasteBlock,
  duplicateBlock,
} = editorSlice.actions;

// Selectors
export const selectCurrentPage = (state) => state.editor.currentPage;
export const selectBlocks = (state) => state.editor.blocks;
export const selectSelectedBlockId = (state) => state.editor.selectedBlockId;
export const selectSelectedBlock = (state) => {
  const blocks = state.editor.blocks;
  const selectedId = state.editor.selectedBlockId;
  return blocks.find(block => block.id === selectedId);
};
export const selectIsGenerating = (state) => state.editor.isGenerating;
export const selectIsUploading = (state) => state.editor.isUploading;
export const selectMessage = (state) => state.editor.message;
export const selectMessageType = (state) => state.editor.messageType;
export const selectAutoSaveStatus = (state) => state.editor.autoSaveStatus;
export const selectIsPreviewOpen = (state) => state.editor.isPreviewOpen;
export const selectActiveTab = (state) => state.editor.activeTab;
export const selectShowTemplateLibrary = (state) => state.editor.showTemplateLibrary;
export const selectShowPublishingPanel = (state) => state.editor.showPublishingPanel;
export const selectShowLearningObjectRepo = (state) => state.editor.showLearningObjectRepo;
export const selectShowQuestionBank = (state) => state.editor.showQuestionBank;
export const selectCanUndo = (state) => state.editor.historyIndex > 0;
export const selectCanRedo = (state) => state.editor.historyIndex < state.editor.history.length - 1;
export const selectClipboard = (state) => state.editor.clipboard;

export default editorSlice.reducer;
