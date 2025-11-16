import { useState, useCallback } from 'react';
import { getProjectVersions, restoreProjectVersion } from '../../utils/projectStorage';

/**
 * Custom hook for version history management
 */
export function useVersionHistory(project) {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [projectVersions, setProjectVersions] = useState([]);

  // Load version history when component mounts
  useEffect(() => {
    if (project) {
      setProjectVersions(getProjectVersions(project.id));
    }
  }, [project]);

  const handleRestoreVersion = useCallback((versionId) => {
    if (window.confirm('Are you sure you want to restore this version? This will replace your current project content.')) {
      const success = restoreProjectVersion(project.id, versionId);

      if (success) {
        setProjectVersions(getProjectVersions(project.id));
        return true;
      }
    }
    return false;
  }, [project]);

  const toggleVersionHistory = useCallback(() => {
    setShowVersionHistory(prev => !prev);
  }, []);

  return {
    showVersionHistory,
    projectVersions,
    handleRestoreVersion,
    toggleVersionHistory
  };
}
