import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import editorReducer from './slices/editorSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    editor: editorReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['project/loadProject/fulfilled'],
        // Ignore these paths in the state
        ignoredPaths: ['project.currentProject'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
