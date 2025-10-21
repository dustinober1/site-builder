import React, { useState, useEffect, useRef } from 'react';
import './CollaborationPanel.css';

const CollaborationPanel = ({ project, onCollaborationUpdate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [collaborationLink, setCollaborationLink] = useState('');
  const [invitationMessage, setInvitationMessage] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  
  const wsRef = useRef(null);
  const userIdRef = useRef(null);

  // Generate unique user ID if not exists
  useEffect(() => {
    if (!userIdRef.current) {
      userIdRef.current = localStorage.getItem('collab_user_id') || 
                         `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('collab_user_id', userIdRef.current);
    }
  }, []);

  const connectToRoom = () => {
    if (!project?.id) return;

    const roomId = project.id.toString();
    const userId = userIdRef.current;
    const userName = localStorage.getItem('collab_user_name') || 'Anonymous';

    // In a real implementation, this would connect to a WebSocket server
    // For now, we'll simulate connection
    setConnectionStatus('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus('connected');
      
      // Add current user to users list
      setUsers([{
        id: userId,
        name: userName,
        color: '#4ECDC4',
        isOwner: true,
        connectedAt: new Date().toISOString()
      }]);
      
      // Generate collaboration link
      const link = `${window.location.origin}/collaborate?room=${roomId}&user=${userId}`;
      setCollaborationLink(link);
    }, 1000);
  };

  const disconnectFromRoom = () => {
    // Close WebSocket connection if exists
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setUsers([]);
    setCollaborationLink('');
  };

  const generateShareableLink = () => {
    if (collaborationLink) {
      setShowShareModal(true);
      setInvitationMessage(`Join our collaboration session for "${project.name}":\n\n${collaborationLink}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationMessage)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const openShareModal = () => {
    if (!collaborationLink) {
      generateShareableLink();
      return;
    }
    setShowShareModal(true);
    setInvitationMessage(`Join our collaboration session for "${project.name}":\n\n${collaborationLink}`);
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="collaboration-panel">
      <h3>Real-time Collaboration</h3>
      
      <div className="collaboration-status">
        <div className={`status-indicator ${connectionStatus}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
        
        <div className="collaboration-controls">
          {!isConnected ? (
            <button 
              className="connect-btn"
              onClick={connectToRoom}
              disabled={!project?.id}
            >
              Start Collaboration
            </button>
          ) : (
            <button 
              className="disconnect-btn"
              onClick={disconnectFromRoom}
            >
              Stop Collaboration
            </button>
          )}
          
          {isConnected && (
            <button 
              className="share-btn"
              onClick={openShareModal}
            >
              Share Session
            </button>
          )}
        </div>
      </div>

      {isConnected && (
        <div className="collaboration-info">
          <div className="users-list">
            <h4>Participants ({users.length})</h4>
            <div className="users-container">
              {users.map(user => (
                <div key={user.id} className="user-item">
                  <div 
                    className="user-color" 
                    style={{ backgroundColor: user.color }}
                  ></div>
                  <div className="user-details">
                    <span className="user-name">{user.name}</span>
                    {user.isOwner && <span className="user-role">Owner</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="session-details">
            <h4>Session Info</h4>
            <div className="session-item">
              <span className="label">Room ID:</span>
              <span className="value">{project?.id || 'N/A'}</span>
            </div>
            <div className="session-item">
              <span className="label">Your Role:</span>
              <span className="value">Editor</span>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Collaboration Session</h3>
              <button className="close-btn" onClick={() => setShowShareModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Share this link with collaborators to work together in real-time:</p>
              <textarea
                value={invitationMessage}
                onChange={(e) => setInvitationMessage(e.target.value)}
                rows={4}
                readOnly
              />
              <div className="modal-actions">
                <button onClick={copyToClipboard} className="copy-btn">
                  Copy to Clipboard
                </button>
                <button onClick={() => setShowShareModal(false)} className="close-modal-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationPanel;