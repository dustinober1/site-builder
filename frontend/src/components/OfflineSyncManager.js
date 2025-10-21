import React, { useState, useEffect } from 'react';
import './OfflineSyncManager.css';

const OfflineSyncManager = ({ project, onUpdateProject }) => {
  const [settings, setSettings] = useState({
    enabled: false,
    autoSync: true,
    syncInterval: 300, // seconds
    storageLimit: 100, // MB
    includeMedia: false
  });

  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, error
  const [lastSync, setLastSync] = useState(null);
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    if (project && project.offlineSync) {
      setSettings({
        ...settings,
        ...project.offlineSync
      });
    }

    // Load progress data from localStorage
    const savedProgress = localStorage.getItem(`offline_progress_${project.id}`);
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    }
  }, [project]);

  const handleChange = (field, value) => {
    const newSettings = {
      ...settings,
      [field]: value
    };
    setSettings(newSettings);

    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        offlineSync: newSettings
      });
    }
  };

  const toggleOfflineSync = (enabled) => {
    handleChange('enabled', enabled);
  };

  const handleSync = async () => {
    setSyncStatus('syncing');

    try {
      // Simulate sync process
      // In a real implementation, this would sync data to a server
      await new Promise(resolve => setTimeout(resolve, 1500));

      setLastSync(new Date().toISOString());
      setSyncStatus('synced');

      // Update localStorage with current progress
      const progressToSave = {
        ...progressData,
        lastSynced: new Date().toISOString(),
        syncedAt: Date.now()
      };
      localStorage.setItem(`offline_progress_${project.id}`, JSON.stringify(progressToSave));
    } catch (error) {
      setSyncStatus('error');
      console.error('Sync error:', error);
    }
  };

  const calculateStorageUsage = () => {
    // Calculate approximate storage used by this project's data
    const progressJson = JSON.stringify(progressData);
    const progressSize = new Blob([progressJson]).size / (1024 * 1024); // in MB
    
    return {
      used: progressSize.toFixed(2),
      limit: settings.storageLimit
    };
  };

  const storageUsage = calculateStorageUsage();

  return (
    <div className="offline-sync-manager">
      <h3>Offline Content Sync</h3>
      <p>Allow learners to access content offline and sync progress when online.</p>
      
      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => toggleOfflineSync(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
        <span className="toggle-label">Enable Offline Access</span>
      </div>

      {settings.enabled && (
        <div className="sync-settings">
          <div className="sync-controls">
            <div className="sync-status">
              <div className={`status-indicator ${syncStatus}`}>
                <span className="status-dot"></span>
                <span className="status-text">
                  {syncStatus === 'syncing' ? 'Syncing...' : 
                   syncStatus === 'synced' ? 'Synced' : 
                   syncStatus === 'error' ? 'Error' : 'Ready'}
                </span>
              </div>
              
              {lastSync && (
                <div className="last-sync">
                  Last sync: {new Date(lastSync).toLocaleString()}
                </div>
              )}
            </div>
            
            <button 
              className="sync-btn"
              onClick={handleSync}
              disabled={syncStatus === 'syncing'}
            >
              {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          <div className="settings-section">
            <h4>Sync Settings</h4>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.autoSync}
                  onChange={(e) => handleChange('autoSync', e.target.checked)}
                />
                Automatically sync progress
              </label>
            </div>
            
            <div className="form-group">
              <label>Sync Interval (seconds)</label>
              <input
                type="number"
                min="60"
                max="3600"
                value={settings.syncInterval}
                onChange={(e) => handleChange('syncInterval', parseInt(e.target.value) || 300)}
              />
            </div>
            
            <div className="form-group">
              <label>Storage Limit (MB)</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={settings.storageLimit}
                onChange={(e) => handleChange('storageLimit', parseInt(e.target.value) || 100)}
              />
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.includeMedia}
                  onChange={(e) => handleChange('includeMedia', e.target.checked)}
                />
                Include media files (images, videos) in offline sync
              </label>
            </div>
          </div>

          <div className="storage-info">
            <h4>Storage Usage</h4>
            <div className="storage-bar">
              <div 
                className="storage-fill"
                style={{ 
                  width: `${Math.min(100, (storageUsage.used / storageUsage.limit) * 100)}%`,
                  backgroundColor: storageUsage.used > storageUsage.limit * 0.8 ? '#dc3545' : '#1863d6'
                }}
              ></div>
            </div>
            <div className="storage-text">
              {storageUsage.used} MB of {storageUsage.limit} MB used
              {storageUsage.used > storageUsage.limit * 0.8 && (
                <span className="warning"> (limit approaching)</span>
              )}
            </div>
          </div>

          <div className="progress-data">
            <h4>Progress Tracking</h4>
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">Pages Completed:</span>
                <span className="stat-value">{progressData.pagesCompleted || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time Spent:</span>
                <span className="stat-value">{(progressData.totalTime || 0).toFixed(2)} min</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Assessments Taken:</span>
                <span className="stat-value">{progressData.assessmentsTaken || 0}</span>
              </div>
            </div>
          </div>

          <div className="offline-features">
            <h4>Available Offline:</h4>
            <ul>
              <li>All course content and navigation</li>
              <li>Progress tracking and completion status</li>
              <li>Assessment attempts (synced when online)</li>
              <li>Bookmarking and notes (if enabled)</li>
              {settings.includeMedia && <li>Images and videos (if selected)</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineSyncManager;