import { useCallback, useEffect } from 'react';

/**
 * Custom hook for auto-save functionality
 */
export function useAutoSave(project, blocks, currentPage, onAutoSave) {
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (project && blocks.length > 0) {
        const updatedProject = {
          ...project,
          pages: project.pages.map(page =>
            page.id === currentPage.id ? { ...page, content: blocks } : page
          ),
          lastAutoSave: new Date().toISOString()
        };

        if (onAutoSave) {
          onAutoSave(updatedProject);
        }
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [project, blocks, currentPage, onAutoSave]);
}
