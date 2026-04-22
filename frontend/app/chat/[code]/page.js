'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';
import MessageList from '../../../components/MessageList';
import FileUpload from '../../../components/FileUpload';
import Timer from '../../../components/Timer';

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatCode = params.code;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60 * 1000);
  const [username, setUsername] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get username from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUsername(userData.username);
    
    if (!socketRef.current) {
      initializeChat(userData.username);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [chatCode]);

  const initializeChat = async (currentUsername) => {
    if (socketRef.current) return;
    
    try {
      // Fetch room info to check for admin
      const roomResponse = await fetch(`${SERVER_URL}/api/rooms/${chatCode}`);
      if (roomResponse.ok) {
        const roomData = await roomResponse.json();
        if (roomData && roomData.admin === (currentUsername || username)) {
          setIsAdmin(true);
        }
      }

      // Fetch existing messages
      const response = await fetch(`${SERVER_URL}/api/rooms/${chatCode}/messages`);
      if (response.ok) {
        const existingMessages = await response.json();
        setMessages(existingMessages);
      }

      // Connect to Socket.io
      const newSocket = io(SERVER_URL, {
        transports: ['websocket'],
        reconnection: true
      });

      socketRef.current = newSocket;

      newSocket.on('connect', () => {
        console.log('Connected to server');

        // Join room
        newSocket.emit('join-room', {
          roomCode: chatCode,
          username: currentUsername || username
        });
      });

      newSocket.on('room-joined', (data) => {
        console.log('Joined room:', data);
        setIsConnecting(false);
        if (data.isAdmin) {
          setIsAdmin(true);
        }
      });

      newSocket.on('new-message', (message) => {
        setMessages(prev => {
          // Check for duplicate message (based on _id or ID)
          const isDuplicate = prev.some(m => (m._id && m._id === message._id) || (m.id && m.id === message.id));
          if (isDuplicate) return prev;
          return [...prev, message];
        });
      });

      newSocket.on('user-count', (count) => {
        setUserCount(count);
      });

      newSocket.on('user-typing', (data) => {
        setTypingUsers(prev => new Set([...prev, data.username]));
      });

      newSocket.on('user-stop-typing', (data) => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.username);
          return newSet;
        });
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
        setError(error.message);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      setSocket(newSocket);

    } catch (err) {
      console.error('Failed to initialize chat:', err);
      setError('Failed to connect to chat. Please try again.');
      setIsConnecting(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    socket.emit('send-message', {
      roomCode: chatCode,
      username,
      text: inputMessage.trim(),
      type: 'text'
    });

    setInputMessage('');

    // Stop typing indicator
    socket.emit('stop-typing', { roomCode: chatCode, username });
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    if (!socket) return;

    // Send typing indicator
    socket.emit('typing', { roomCode: chatCode, username });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { roomCode: chatCode, username });
    }, 2000);
  };

  const handleFileUpload = async (file) => {
    if (!socket) return;

    try {
      // Check file size (max 10MB for MongoDB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Maximum 10MB allowed.');
        return;
      }

      // Read file as base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;

        socket.emit('send-file', {
          roomCode: chatCode,
          username,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileData: base64Data
        });
      };
      reader.readAsDataURL(file);

    } catch (err) {
      console.error('Failed to send file:', err);
      alert('Failed to send file.');
    }
  };

  const downloadFile = (message) => {
    try {
      // Create blob from base64
      const link = document.createElement('a');
      link.href = message.fileData;
      link.download = message.fileName;
      link.click();
    } catch (err) {
      console.error('Failed to download file:', err);
      alert('Failed to download file');
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(chatCode);
    alert('Chat code copied to clipboard!');
  };

  const handleDeleteRoom = async () => {
    try {
      console.log('API call to delete room:', chatCode);
      const response = await fetch(`${SERVER_URL}/api/rooms/${chatCode}?username=${username}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('Room deleted successfully');
        alert('✅ Room deleted successfully!');
        router.push('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert(`❌ Failed to delete room: ${error.message}`);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (error) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h1>❌ Connection Error</h1>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => router.push('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const typingUsersArray = Array.from(typingUsers).filter(u => u !== username);

  return (
    <div className="chat-page-wrapper">
      <div className="chat-page">
        {/* Header */}
        <div className="chat-header glass">
          <div className="header-left">
            <button className="btn-back" onClick={() => router.push('/')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <div className="room-info">
              <h2 className="room-code" onClick={copyCodeToClipboard} title="Click to copy">
                🔒 {chatCode}
              </h2>
              <p className="room-status">
                {isConnecting ? (
                  <span className="connecting">Connecting...</span>
                ) : (
                  <span className="connected">
                    <span className="status-dot"></span>
                    {userCount} {userCount === 1 ? 'user' : 'users'} online
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="header-right">
            <Timer timeRemaining={timeRemaining} />
            {isAdmin && (
              <button className="btn-delete" onClick={() => setShowDeleteModal(true)} title="Delete Room">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Delete Room</span>
              </button>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-backdrop fade-in">
            <div className="modal-content scale-in glass">
              <div className="modal-header">
                <div className="modal-icon">⚠️</div>
                <h2>Delete Room?</h2>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this room and all its messages permanently?</p>
                <div className="warning-box">
                  This action cannot be undone.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteRoom}>
                  Yes, Delete Room
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages">
          <MessageList messages={messages} currentUsername={username} onDownloadFile={downloadFile} />

          {/* Typing Indicator */}
          {typingUsersArray.length > 0 && (
            <div className="typing-indicator">
              <span className="typing-text">
                {typingUsersArray.join(', ')} {typingUsersArray.length === 1 ? 'is' : 'are'} typing
                <span className="typing-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input glass">
          <FileUpload onFileSelect={handleFileUpload} disabled={isConnecting} />
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              className="input message-input"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={handleInputChange}
              disabled={isConnecting}
            />
            <button type="submit" className="btn btn-primary send-btn" disabled={isConnecting || !inputMessage.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .chat-header {
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          color: var(--text-primary);
          cursor: pointer;
          padding: 10px 16px;
          border-radius: var(--radius);
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 600;
        }

        .btn-back:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          transform: translateX(-2px);
        }

        .btn-back svg {
          flex-shrink: 0;
        }

        .btn-delete {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          cursor: pointer;
          padding: 10px 16px;
          border-radius: var(--radius);
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 600;
        }

        .btn-delete:hover {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
          transform: scale(1.02);
        }

        .btn-delete svg {
          flex-shrink: 0;
        }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 400px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 32px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .modal-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .modal-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: white;
        }

        .modal-body {
          margin-bottom: 32px;
          text-align: center;
        }

        .modal-body p {
          color: var(--text-secondary);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .warning-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 12px;
          border-radius: var(--radius);
          font-size: 14px;
          font-weight: 600;
        }

        .modal-footer {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
          border: none;
          padding: 12px;
          border-radius: var(--radius);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-danger:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .btn-secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border);
          padding: 12px;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: var(--bg-glass);
        }

        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        .btn-icon {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-sm);
          transition: all 0.3s ease;
        }

        .btn-icon:hover {
          background: var(--bg-tertiary);
          color: var(--primary);
        }

        .room-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .room-code {
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .room-code:hover {
          color: var(--primary);
        }

        .room-status {
          font-size: 14px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .connecting {
          color: var(--warning);
        }

        .connected {
          color: var(--success);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--success);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .typing-indicator {
          padding: 8px 16px;
          margin-top: 8px;
        }

        .typing-text {
          font-size: 13px;
          color: var(--text-muted);
          font-style: italic;
        }

        .typing-dots {
          display: inline-block;
        }

        .typing-dots span {
          animation: blink 1.4s infinite;
          animation-fill-mode: both;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }

        .chat-input {
          padding: 12px 16px;
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(20px);
        }

        .message-form {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .message-input {
          flex: 1;
          margin: 0;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 10px 16px;
        }

        .send-btn {
          width: 42px;
          height: 42px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
          background: var(--primary);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .send-btn svg {
          /* Centered arrow icon */
        }

        .error-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-content {
          text-align: center;
          max-width: 400px;
        }

        .error-content h1 {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .error-content p {
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid var(--border);
          }

          .header-left {
            gap: 12px;
          }

          .room-info {
            text-align: left;
          }

          .header-right {
            flex-shrink: 0;
            justify-content: flex-end;
            gap: 8px;
          }

          .header-right {
            gap: 8px;
          }

          .btn-delete span,
          .btn-back span {
            display: none;
          }

          .btn-delete,
          .btn-back {
            padding: 8px;
            min-width: 40px;
            justify-content: center;
          }

          .room-info {
            gap: 2px;
            text-align: center;
            overflow: hidden;
          }

          .room-code {
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 120px;
            margin: 0 auto;
          }

          .room-status {
            font-size: 11px;
            justify-content: center;
          }

          .status-dot {
            width: 6px;
            height: 6px;
          }

          .chat-messages {
            padding: 12px;
          }

          .chat-input {
            padding: 10px 12px;
            gap: 8px;
          }

          .message-form {
            gap: 8px;
          }

          .message-input {
            font-size: 16px; /* Prevents iOS zoom */
            padding: 10px 12px;
          }

          .send-btn {
            padding: 10px;
            min-width: 44px;
          }
        }

        /* Extremely small screens */
        @media (max-width: 360px) {
          .room-code {
            max-width: 80px;
          }
          
          .header-right :global(.timer-text) {
             font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
