import React, { useState, useEffect } from 'react';
import './CollaborationAndReview.css';

function CollaborationAndReview({ project, onBack, onUpdateProject, onClose }) {
  const [collaborators, setCollaborators] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Subject Matter Expert',
      status: 'invited',
      permissions: ['view', 'comment']
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Editor',
      status: 'active',
      permissions: ['view', 'edit', 'comment']
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Reviewer',
      status: 'active',
      permissions: ['view', 'comment', 'review']
    }
  ]);
  
  const [newCollaborator, setNewCollaborator] = useState({
    email: '',
    name: '',
    role: 'reviewer',
    permissions: ['view', 'comment']
  });
  
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Jane Smith',
      content: 'This section needs more visual aids to help learners understand the concept better.',
      timestamp: '2025-01-15T10:30:00Z',
      status: 'open',
      blockId: 123,
      blockTitle: 'Introduction to Concepts'
    },
    {
      id: 2,
      author: 'Bob Johnson',
      content: 'The assessment question seems too difficult for the beginner level. Consider simplifying.',
      timestamp: '2025-01-15T14:22:00Z',
      status: 'resolved',
      blockId: 124,
      blockTitle: 'Knowledge Check'
    },
    {
      id: 3,
      author: 'John Doe',
      content: 'Please review the compliance section for accuracy.',
      timestamp: '2025-01-16T09:15:00Z',
      status: 'open',
      blockId: 125,
      blockTitle: 'Compliance Requirements'
    }
  ]);
  
  const [newComment, setNewComment] = useState({
    author: '',
    content: '',
    blockId: null,
    blockTitle: ''
  });
  
  const [activeTab, setActiveTab] = useState('collaborators');
  const [newCommentBlock, setNewCommentBlock] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // In a real implementation, this would come from props/DB
  const availableBlocks = [
    { id: 123, title: 'Introduction to Concepts', type: 'text' },
    { id: 124, title: 'Knowledge Check', type: 'knowledge-check' },
    { id: 125, title: 'Compliance Requirements', type: 'text' },
    { id: 126, title: 'Training Video', type: 'video' },
    { id: 127, title: 'Final Assessment', type: 'knowledge-check' }
  ];

  const handleAddCollaborator = (e) => {
    e.preventDefault();
    
    const collaborator = {
      id: Date.now(),
      ...newCollaborator,
      status: 'invited'
    };
    
    setCollaborators([...collaborators, collaborator]);
    setNewCollaborator({
      email: '',
      name: '',
      role: 'reviewer',
      permissions: ['view', 'comment']
    });
    setShowInviteModal(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    
    const comment = {
      id: Date.now(),
      ...newComment,
      timestamp: new Date().toISOString(),
      status: 'open'
    };
    
    setComments([...comments, comment]);
    setNewComment({
      author: '',
      content: '',
      blockId: null,
      blockTitle: ''
    });
    setNewCommentBlock(null);
  };

  const updateCommentStatus = (commentId, newStatus) => {
    setComments(comments.map(comment => 
      comment.id === commentId ? { ...comment, status: newStatus } : comment
    ));
  };

  const getCommentsByStatus = (status) => {
    return comments.filter(comment => comment.status === status);
  };

  const getCommentsByBlock = (blockId) => {
    return comments.filter(comment => comment.blockId === blockId);
  };

  const assignPermission = (permission) => {
    if (!newCollaborator.permissions.includes(permission)) {
      setNewCollaborator({
        ...newCollaborator,
        permissions: [...newCollaborator.permissions, permission]
      });
    }
  };

  const removePermission = (permission) => {
    setNewCollaborator({
      ...newCollaborator,
      permissions: newCollaborator.permissions.filter(p => p !== permission)
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="collaboration-and-review">
      <div className="collab-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Editor
        </button>
        <h1>Collaboration & Review Workflow</h1>
        <button className="close-button" onClick={onClose}>
          × Close
        </button>
      </div>

      <div className="collab-tabs">
        <button 
          className={`tab ${activeTab === 'collaborators' ? 'active' : ''}`}
          onClick={() => setActiveTab('collaborators')}
        >
          Collaborators
        </button>
        <button 
          className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          Comments ({comments.length})
        </button>
        <button 
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button 
          className={`tab ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflow')}
        >
          Workflow
        </button>
      </div>

      <div className="collab-content">
        {activeTab === 'collaborators' && (
          <div className="collaborators-tab">
            <div className="collab-actions">
              <button 
                className="invite-button" 
                onClick={() => setShowInviteModal(true)}
              >
                + Invite Collaborator
              </button>
            </div>

            <div className="collaborators-grid">
              {collaborators.map(collab => (
                <div key={collab.id} className="collaborator-card">
                  <div className="collab-info">
                    <h3>{collab.name}</h3>
                    <p className="collab-email">{collab.email}</p>
                    <p className="collab-role">{collab.role}</p>
                    <span className={`status-badge ${collab.status}`}>
                      {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                    </span>
                  </div>
                  <div className="collab-permissions">
                    <h4>Permissions:</h4>
                    <div className="permissions-list">
                      {collab.permissions.map(perm => (
                        <span key={perm} className="permission-tag">{perm}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="comments-tab">
            <div className="add-comment-section">
              <h3>Add a Comment</h3>
              <form onSubmit={handleAddComment} className="comment-form">
                <div className="form-group">
                  <label htmlFor="author">Your Name</label>
                  <input
                    type="text"
                    id="author"
                    value={newComment.author}
                    onChange={(e) => setNewComment({...newComment, author: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="block">Related to Block</label>
                  <select
                    id="block"
                    value={newComment.blockId || ''}
                    onChange={(e) => {
                      const block = availableBlocks.find(b => b.id === parseInt(e.target.value));
                      setNewComment({
                        ...newComment,
                        blockId: block ? block.id : null,
                        blockTitle: block ? block.title : ''
                      });
                    }}
                  >
                    <option value="">Select a block</option>
                    {availableBlocks.map(block => (
                      <option key={block.id} value={block.id}>
                        {block.title} ({block.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="content">Comment</label>
                  <textarea
                    id="content"
                    value={newComment.content}
                    onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                    placeholder="Enter your comment or feedback here..."
                    required
                    rows="4"
                  />
                </div>

                <button type="submit" className="submit-comment-btn">
                  Add Comment
                </button>
              </form>
            </div>

            <div className="comments-list">
              <h3>Open Comments ({getCommentsByStatus('open').length})</h3>
              {getCommentsByStatus('open').map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-author">{comment.author}</div>
                    <div className="comment-timestamp">{formatDate(comment.timestamp)}</div>
                    <div className="comment-block">{comment.blockTitle}</div>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-actions">
                    <button 
                      className="resolve-btn"
                      onClick={() => updateCommentStatus(comment.id, 'resolved')}
                    >
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              ))}

              <h3>Resolved Comments ({getCommentsByStatus('resolved').length})</h3>
              {getCommentsByStatus('resolved').map(comment => (
                <div key={comment.id} className="comment-item resolved">
                  <div className="comment-header">
                    <div className="comment-author">{comment.author}</div>
                    <div className="comment-timestamp">{formatDate(comment.timestamp)}</div>
                    <div className="comment-block">{comment.blockTitle}</div>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-actions">
                    <button 
                      className="reopen-btn"
                      onClick={() => updateCommentStatus(comment.id, 'open')}
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-tab">
            <div className="review-status">
              <div className="status-card">
                <h3>Content Status</h3>
                <div className="status-grid">
                  <div className="status-item draft">
                    <span className="count">2</span>
                    <span className="label">Draft</span>
                  </div>
                  <div className="status-item review">
                    <span className="count">1</span>
                    <span className="label">Under Review</span>
                  </div>
                  <div className="status-item approved">
                    <span className="count">3</span>
                    <span className="label">Approved</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="review-process">
              <h3>Review Process</h3>
              <div className="review-steps">
                <div className="review-step completed">
                  <div className="step-icon">✓</div>
                  <div className="step-info">
                    <h4>Content Creation</h4>
                    <p>Author creates initial content</p>
                  </div>
                </div>
                <div className="review-step active">
                  <div className="step-icon">2</div>
                  <div className="step-info">
                    <h4>Review by SME</h4>
                    <p>Subject Matter Expert reviews for accuracy</p>
                  </div>
                </div>
                <div className="review-step pending">
                  <div className="step-icon">3</div>
                  <div className="step-info">
                    <h4>Editor Review</h4>
                    <p>Editor reviews for quality and consistency</p>
                  </div>
                </div>
                <div className="review-step pending">
                  <div className="step-icon">4</div>
                  <div className="step-info">
                    <h4>Final Approval</h4>
                    <p>Project manager approves for publication</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="workflow-tab">
            <h3>Project Workflow</h3>
            <div className="workflow-visual">
              <div className="workflow-step">
                <div className="step-content">
                  <div className="step-number">1</div>
                  <h4>Content Creation</h4>
                  <p>Authors create initial course content</p>
                </div>
                <div className="step-assignee">
                  <span>Assigned to: Course Creator</span>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="step-content">
                  <div className="step-number">2</div>
                  <h4>SME Review</h4>
                  <p>Subject Matter Expert reviews for accuracy</p>
                </div>
                <div className="step-assignee">
                  <span>Assigned to: John Doe</span>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="step-content">
                  <div className="step-number">3</div>
                  <h4>Editor Review</h4>
                  <p>Editor reviews for quality and consistency</p>
                </div>
                <div className="step-assignee">
                  <span>Assigned to: Jane Smith</span>
                </div>
              </div>
              <div className="workflow-arrow">→</div>
              <div className="workflow-step">
                <div className="step-content">
                  <div className="step-number">4</div>
                  <h4>Final Approval</h4>
                  <p>Project manager approves for publication</p>
                </div>
                <div className="step-assignee">
                  <span>Assigned to: Project Manager</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showInviteModal && (
        <div className="invite-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Invite Collaborator</h3>
              <button className="close-modal" onClick={() => setShowInviteModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddCollaborator} className="invite-form">
              <div className="form-group">
                <label htmlFor="invite-name">Name</label>
                <input
                  type="text"
                  id="invite-name"
                  value={newCollaborator.name}
                  onChange={(e) => setNewCollaborator({...newCollaborator, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="invite-email">Email</label>
                <input
                  type="email"
                  id="invite-email"
                  value={newCollaborator.email}
                  onChange={(e) => setNewCollaborator({...newCollaborator, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="invite-role">Role</label>
                <select
                  id="invite-role"
                  value={newCollaborator.role}
                  onChange={(e) => setNewCollaborator({...newCollaborator, role: e.target.value})}
                >
                  <option value="reviewer">Reviewer</option>
                  <option value="editor">Editor</option>
                  <option value="sme">Subject Matter Expert</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-selection">
                  <label className="permission-option">
                    <input
                      type="checkbox"
                      checked={newCollaborator.permissions.includes('view')}
                      onChange={(e) => 
                        e.target.checked ? assignPermission('view') : removePermission('view')
                      }
                    />
                    View
                  </label>
                  <label className="permission-option">
                    <input
                      type="checkbox"
                      checked={newCollaborator.permissions.includes('edit')}
                      onChange={(e) => 
                        e.target.checked ? assignPermission('edit') : removePermission('edit')
                      }
                    />
                    Edit
                  </label>
                  <label className="permission-option">
                    <input
                      type="checkbox"
                      checked={newCollaborator.permissions.includes('comment')}
                      onChange={(e) => 
                        e.target.checked ? assignPermission('comment') : removePermission('comment')
                      }
                    />
                    Comment
                  </label>
                  <label className="permission-option">
                    <input
                      type="checkbox"
                      checked={newCollaborator.permissions.includes('review')}
                      onChange={(e) => 
                        e.target.checked ? assignPermission('review') : removePermission('review')
                      }
                    />
                    Review
                  </label>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="send-invite-btn">
                  Send Invitation
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CollaborationAndReview;