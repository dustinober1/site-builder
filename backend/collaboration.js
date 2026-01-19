const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

class CollaborationServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.rooms = new Map(); // Map of room ID to { clients: Set, projectState: Object }
    
    this.wss.on('connection', (ws, req) => {
      console.log(`[COLLAB] New client connected: ${req.url}`);
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(ws, message);
        } catch (err) {
          console.error('[COLLAB] Error parsing message:', err);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });
      
      ws.on('close', () => {
        console.log('[COLLAB] Client disconnected');
        this.handleClientDisconnect(ws);
      });
      
      ws.on('error', (err) => {
        console.error('[COLLAB] WebSocket error:', err);
      });
    });
  }
  
  handleMessage(ws, message) {
    switch (message.type) {
      case 'join-room':
        this.handleJoinRoom(ws, message);
        break;
      case 'leave-room':
        this.handleLeaveRoom(ws, message);
        break;
      case 'update-content':
        this.handleUpdateContent(ws, message);
        break;
      case 'cursor-position':
        this.handleCursorPosition(ws, message);
        break;
      case 'user-info':
        this.handleUserInfo(ws, message);
        break;
      case 'review-action':
        this.handleReviewAction(ws, message);
        break;
      case 'add-comment':
        this.handleAddComment(ws, message);
        break;
      case 'resolve-comment':
        this.handleResolveComment(ws, message);
        break;
      default:
        console.warn(`[COLLAB] Unknown message type: ${message.type}`);
    }
  }

  handleReviewAction(ws, message) {
    const { roomId, action, stage, userId, comments } = message;
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (!room.reviewState) {
      room.reviewState = {
        currentStage: 'Draft',
        history: [],
        approvals: {}
      };
    }

    const stages = ['Draft', 'Expert', 'Accessibility', 'Legal', 'Final'];
    const currentIndex = stages.indexOf(room.reviewState.currentStage);

    if (action === 'approve') {
      room.reviewState.approvals[stage] = { userId, timestamp: new Date().toISOString() };
      if (currentIndex < stages.length - 1 && stage === room.reviewState.currentStage) {
        room.reviewState.currentStage = stages[currentIndex + 1];
      }
    } else if (action === 'reject') {
      room.reviewState.currentStage = 'Draft'; // Reset to draft on rejection
      room.reviewState.approvals = {};
    }

    room.reviewState.history.push({
      stage,
      action,
      userId,
      comments,
      timestamp: new Date().toISOString()
    });

    this.broadcastToRoom(roomId, {
      type: 'review-state-update',
      reviewState: room.reviewState
    });
  }

  handleAddComment(ws, message) {
    const { roomId, comment } = message;
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (!room.comments) room.comments = [];
    
    const newComment = {
      id: Date.now().toString(),
      ...comment,
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: []
    };

    room.comments.push(newComment);
    this.broadcastToRoom(roomId, {
      type: 'comment-added',
      comment: newComment
    });
  }

  handleResolveComment(ws, message) {
    const { roomId, commentId, userId } = message;
    const room = this.rooms.get(roomId);
    if (!room) return;

    const comment = room.comments?.find(c => c.id === commentId);
    if (comment) {
      comment.resolved = true;
      comment.resolvedBy = userId;
      comment.resolvedAt = new Date().toISOString();

      this.broadcastToRoom(roomId, {
        type: 'comment-resolved',
        commentId,
        userId
      });
    }
  }
  
  handleJoinRoom(ws, message) {
    const { roomId, userId, userName = 'Anonymous' } = message;
    
    if (!roomId || !userId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'roomId and userId are required'
      }));
      return;
    }
    
    // Create room if it doesn't exist
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        clients: new Set(),
        projectState: null,
        users: new Map() // userId -> userInfo
      });
    }
    
    const room = this.rooms.get(roomId);
    
    // Store user info
    room.users.set(userId, {
      id: userId,
      name: userName,
      color: this.generateUserColor(userId),
      connectedAt: new Date().toISOString()
    });
    
    ws.roomId = roomId;
    ws.userId = userId;
    room.clients.add(ws);
    
    // Broadcast user joined
    this.broadcastToRoom(roomId, {
      type: 'user-joined',
      user: {
        id: userId,
        name: userName,
        color: this.generateUserColor(userId)
      }
    }, ws);
    
    // Send current project state to new user
    if (room.projectState) {
      ws.send(JSON.stringify({
        type: 'project-state',
        state: room.projectState
      }));
    }
    
    // Send current users in room
    const users = Array.from(room.users.values());
    ws.send(JSON.stringify({
      type: 'users-in-room',
      users: users
    }));
    
    console.log(`[COLLAB] User ${userName} joined room ${roomId}`);
  }
  
  handleLeaveRoom(ws, message) {
    const roomId = ws.roomId;
    const userId = ws.userId;
    
    if (roomId && userId) {
      const room = this.rooms.get(roomId);
      if (room) {
        room.users.delete(userId);
        room.clients.delete(ws);
        
        // Broadcast user left
        this.broadcastToRoom(roomId, {
          type: 'user-left',
          userId: userId
        }, ws);
        
        // Clean up room if empty
        if (room.clients.size === 0) {
          this.rooms.delete(roomId);
          console.log(`[COLLAB] Room ${roomId} cleaned up`);
        }
      }
    }
    
    console.log(`[COLLAB] User ${userId} left room ${roomId}`);
  }
  
  handleUpdateContent(ws, message) {
    const { roomId, contentUpdate, userId } = message;
    
    if (!roomId || !userId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'roomId and userId are required for content update'
      }));
      return;
    }
    
    const room = this.rooms.get(roomId);
    if (room) {
      // Store or update the project state
      room.projectState = {
        ...room.projectState,
        ...contentUpdate
      };
      
      // Broadcast update to other clients in the room
      this.broadcastToRoom(roomId, {
        type: 'content-update',
        contentUpdate: contentUpdate,
        userId: userId
      }, ws);
    }
  }
  
  handleCursorPosition(ws, message) {
    const { roomId, pageId, blockId, position, userId } = message;
    
    if (!roomId || !userId) {
      return;
    }
    
    const room = this.rooms.get(roomId);
    if (room) {
      // Broadcast cursor position to other users in the room
      this.broadcastToRoom(roomId, {
        type: 'cursor-position',
        pageId,
        blockId,
        position,
        userId,
        user: room.users.get(userId)
      }, ws);
    }
  }
  
  handleUserInfo(ws, message) {
    const { roomId, userId, userInfo } = message;
    
    if (!roomId || !userId) {
      return;
    }
    
    const room = this.rooms.get(roomId);
    if (room && room.users.has(userId)) {
      const existingUser = room.users.get(userId);
      const updatedUser = { ...existingUser, ...userInfo };
      room.users.set(userId, updatedUser);
      
      // Broadcast updated user info
      this.broadcastToRoom(roomId, {
        type: 'user-updated',
        user: updatedUser
      }, ws);
    }
  }
  
  handleClientDisconnect(ws) {
    const roomId = ws.roomId;
    const userId = ws.userId;
    
    if (roomId && userId) {
      const room = this.rooms.get(roomId);
      if (room) {
        room.users.delete(userId);
        room.clients.delete(ws);
        
        if (room.clients.size === 0) {
          this.rooms.delete(roomId);
          console.log(`[COLLAB] Room ${roomId} cleaned up`);
        } else {
          // Broadcast user left
          this.broadcastToRoom(roomId, {
            type: 'user-left',
            userId: userId
          }, ws);
        }
      }
    }
  }
  
  broadcastToRoom(roomId, message, excludeClient = null) {
    const room = this.rooms.get(roomId);
    if (room) {
      const messageStr = JSON.stringify(message);
      room.clients.forEach(client => {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
          try {
            client.send(messageStr);
          } catch (err) {
            console.error('[COLLAB] Error broadcasting to client:', err);
          }
        }
      });
    }
  }
  
  generateUserColor(userId) {
    // Generate a consistent color based on the user ID
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }
  
  // Save collaboration state to file
  saveRoomState(roomId) {
    const room = this.rooms.get(roomId);
    if (room && room.projectState) {
      const dataDir = path.join(process.env.DATA_DIR || './data', 'collaboration');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      const filePath = path.join(dataDir, `${roomId}.json`);
      fs.writeFileSync(filePath, JSON.stringify({
        roomId,
        projectState: room.projectState,
        savedAt: new Date().toISOString(),
        activeUsers: Array.from(room.users.values())
      }, null, 2));
    }
  }
  
  // Load collaboration state from file
  loadRoomState(roomId) {
    const dataDir = path.join(process.env.DATA_DIR || './data', 'collaboration');
    const filePath = path.join(dataDir, `${roomId}.json`);
    
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data.projectState;
      } catch (err) {
        console.error(`[COLLAB] Error loading state for room ${roomId}:`, err);
        return null;
      }
    }
    return null;
  }
  
  getRoomInfo(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    
    return {
      roomId,
      userCount: room.users.size,
      users: Array.from(room.users.values()),
      hasProjectState: !!room.projectState
    };
  }
}

module.exports = CollaborationServer;