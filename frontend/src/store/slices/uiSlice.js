import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  sidebarOpen: true,
  rightPanelOpen: true,
  activePanel: 'properties', // 'properties', 'themes', 'accessibility', 'publishing'
  theme: 'light', // 'light', 'dark'
  fontSize: 'medium', // 'small', 'medium', 'large'
  language: 'en',
  notifications: [],
  modals: {
    welcome: false,
    help: false,
    shortcuts: false,
    about: false,
  },
  loading: {
    global: false,
    projects: false,
    editor: false,
  },
  errors: [],
  breadcrumbs: [],
  searchOpen: false,
  shortcuts: {
    show: false,
  },
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar controls
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Right panel controls
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setRightPanelOpen: (state, action) => {
      state.rightPanelOpen = action.payload;
    },
    
    // Active panel controls
    setActivePanel: (state, action) => {
      state.activePanel = action.payload;
    },
    
    // Theme controls
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    // Font size controls
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    
    // Language controls
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    
    // Notification controls
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(
        notification => notification.id !== notificationId
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Modal controls
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    // Loading controls
    setLoading: (state, action) => {
      const { key, loading } = action.payload;
      if (state.loading.hasOwnProperty(key)) {
        state.loading[key] = loading;
      }
    },
    
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    // Error controls
    addError: (state, action) => {
      const error = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.errors.push(error);
    },
    
    removeError: (state, action) => {
      const errorId = action.payload;
      state.errors = state.errors.filter(error => error.id !== errorId);
    },
    
    clearErrors: (state) => {
      state.errors = [];
    },
    
    // Breadcrumb controls
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    
    // Search controls
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    
    setSearchOpen: (state, action) => {
      state.searchOpen = action.payload;
    },
    
    // Shortcuts controls
    toggleShortcuts: (state) => {
      state.shortcuts.show = !state.shortcuts.show;
    },
    
    setShortcutsVisible: (state, action) => {
      state.shortcuts.show = action.payload;
    },
    
    // Reset UI state
    resetUI: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleRightPanel,
  setRightPanelOpen,
  setActivePanel,
  setTheme,
  toggleTheme,
  setFontSize,
  setLanguage,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
  setGlobalLoading,
  addError,
  removeError,
  clearErrors,
  setBreadcrumbs,
  addBreadcrumb,
  toggleSearch,
  setSearchOpen,
  toggleShortcuts,
  setShortcutsVisible,
  resetUI,
} = uiSlice.actions;

// Selectors
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectRightPanelOpen = (state) => state.ui.rightPanelOpen;
export const selectActivePanel = (state) => state.ui.activePanel;
export const selectTheme = (state) => state.ui.theme;
export const selectFontSize = (state) => state.ui.fontSize;
export const selectLanguage = (state) => state.ui.language;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectLoading = (state) => state.ui.loading;
export const selectGlobalLoading = (state) => state.ui.loading.global;
export const selectErrors = (state) => state.ui.errors;
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs;
export const selectSearchOpen = (state) => state.ui.searchOpen;
export const selectShortcutsVisible = (state) => state.ui.shortcuts.show;

// Memoized selectors for performance
export const selectVisibleNotifications = (state) => 
  state.ui.notifications.filter(notification => !notification.dismissed);

export const selectUnreadErrors = (state) => 
  state.ui.errors.filter(error => !error.read);

export const selectIsLoading = (state) => 
  Object.values(state.ui.loading).some(loading => loading);

export default uiSlice.reducer;
