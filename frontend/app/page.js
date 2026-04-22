'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateChatCode } from '../lib/utils';

export default function HomePage() {
  const router = useRouter();
  const [chatCode, setChatCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest('.user-section')) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleCreateRoom = async () => {
    setIsCreating(true);
    const newCode = generateChatCode(12);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: newCode,
          username: user.username
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      router.push(`/chat/${newCode}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create chat room. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (chatCode.trim()) {
      router.push(`/chat/${chatCode.trim().toUpperCase()}`);
    }
  };

  if (!user) {
    return null; // Show nothing while redirecting
  }

  return (
    <div className="page-wrapper">
      <div className="landing-page">
        <div className="container">
          <div className="hero">
            {/* Header */}
            <div className="header fade-in">
              <div className="header-content">
                <div className="logo">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="10" fill="url(#wipeGradient)" />
                    <path d="M11 16C11 14.3431 12.3431 13 14 13H26C27.6569 13 29 14.3431 29 16V24C29 25.6569 27.6569 27 26 27H19L14 31V27H14C12.3431 27 11 25.6569 11 24V16Z" fill="white" />
                    <path d="M22 15L21.2 17.2L19 18L21.2 18.8L22 21L22.8 18.8L25 18L22.8 17.2L22 15Z" fill="#8B5CF6" />
                    <defs>
                      <linearGradient id="wipeGradient" x1="0" y1="0" x2="40" y2="40">
                        <stop stopColor="#8b5cf6" />
                        <stop offset="1" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="logo-text"><span className="white-text">Wipe</span>Chat</span>
                </div>
                <div className="user-section">
                  <div className="profile-wrapper">
                    <button 
                      className={`profile-trigger ${showProfile ? 'active' : ''}`}
                      onClick={() => setShowProfile(!showProfile)}
                      title="Profile Details"
                    >
                      <div className="avatar">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    </button>

                    {showProfile && (
                      <div className="profile-dropdown fade-in">
                        <div className="dropdown-header">
                          <div className="dropdown-avatar">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <div className="user-info">
                            <span className="user-label">Account</span>
                            <span className="user-name">{user.username.split('@')[0]}</span>
                          </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-details">
                          <div className="detail-item">
                            <span className="detail-label">Status</span>
                            <span className="detail-value text-green">Online</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Chat Limit</span>
                            <span className="detail-value">24 Hours</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button className="btn btn-secondary btn-logout" onClick={handleLogout} title="Logout">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="hero-content fade-in">
              <h1 className="hero-title">
                Anonymous, Encrypted, <span className="gradient-text">Temporary Chat</span>
              </h1>
              <p className="hero-subtitle">
                <span className="subtitle-line">Secure login. Real-time messaging.</span>
                <span className="subtitle-line">Auto-delete after 24 hours.</span>
                <span className="subtitle-line">Just create an account and start chatting!</span>
              </p>

              {/* Features */}
              <div className="features">
                <div className="feature">
                  <div className="feature-icon" style={{ color: '#3b82f6' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <div className="feature-text">Real-Time</div>
                </div>
                <div className="feature">
                  <div className="feature-icon" style={{ color: '#f59e0b' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="feature-text">24h Auto-Delete</div>
                </div>
                <div className="feature">
                  <div className="feature-icon" style={{ color: '#10b981' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3" />
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    </svg>
                  </div>
                  <div className="feature-text">MongoDB</div>
                </div>
                <div className="feature">
                  <div className="feature-icon" style={{ color: '#8b5cf6' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="feature-text">100% Private</div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="action-cards">
                {/* Create Room */}
                <div className="card action-card slide-in">
                  <h2 className="card-title">Create New Chat</h2>
                  <p className="card-description">
                    Generate a unique chat code and share it with others
                  </p>
                  <button
                    className="btn btn-primary w-full"
                    onClick={handleCreateRoom}
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <span className="spinner"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 5v10M5 10h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Create Chat Code
                      </>
                    )}
                  </button>
                </div>

                {/* Join Room */}
                <div className="card action-card slide-in" style={{ animationDelay: '0.1s' }}>
                  <h2 className="card-title">Join Existing Chat</h2>
                  <p className="card-description">
                    Enter a chat code to join an existing room
                  </p>
                  <form onSubmit={handleJoinRoom}>
                    <input
                      type="text"
                      className="input mb-2"
                      placeholder="Enter Chat Code"
                      value={chatCode}
                      onChange={(e) => setChatCode(e.target.value.toUpperCase())}
                      maxLength={20}
                    />
                    <button
                      type="submit"
                      className="btn btn-secondary w-full"
                      disabled={!chatCode.trim()}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" />
                      </svg>
                      Join Chat Room
                    </button>
                  </form>
                </div>
              </div>

              {/* Security Notice */}
              <div className="security-notice fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="notice-icon">🛡️</div>
                <div className="notice-content">
                  <h3>Privacy & Security</h3>
                  <p>
                    All messages are stored securely in MongoDB with 24-hour auto-delete.
                    Real-time messaging powered by Socket.io.
                    Your data is automatically deleted after 24 hours.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="footer-copyright fade-in" style={{ animationDelay: '0.3s' }}>
                <p>© 2026 WipeChat. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          width: 100%;
        }

        .header {
          margin-bottom: 60px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-text {
          font-size: 24px;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .white-text {
          -webkit-text-fill-color: white;
          color: white;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .profile-wrapper {
          position: relative;
        }

        .profile-trigger {
          background: none;
          border: 2px solid var(--border);
          padding: 4px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .profile-trigger:hover, .profile-trigger.active {
          border-color: var(--primary);
          transform: scale(1.05);
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          line-height: 1;
          padding: 0;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 240px;
          background: #0f172a;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          z-index: 1000;
          backdrop-filter: blur(20px);
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .dropdown-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          font-weight: 600;
        }

        .user-name {
          font-size: 16px;
          font-weight: 700;
          color: white;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border);
          margin: 12px 0;
          opacity: 0.5;
        }

        .dropdown-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          font-size: 13px;
          color: var(--text-muted);
        }

        .detail-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .text-green {
          color: #10b981;
        }

        .btn-logout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          transition: all 0.3s ease;
        }

        .btn-logout:hover {
          background: #ef4444 !important;
          color: white !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .btn-logout svg {
          stroke: currentColor;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 20px;
          text-align: center;
        }

        .gradient-text {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 900;
        }

        .hero-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 48px;
        }

        .feature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          transition: all 0.3s ease;
        }

        .feature:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
        }

        .feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }

        .feature-text {
          font-size: 14px;
          font-weight: 600;
          text-align: center;
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .action-card {
          transition: all 0.3s ease;
        }

        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.2);
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .card-description {
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .security-notice {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          gap: 20px;
          align-items: start;
        }

        .notice-icon {
          font-size: 40px;
          flex-shrink: 0;
        }

        .notice-content h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--primary-light);
        }

        .notice-content p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 14px;
        }

        .footer-copyright {
          margin-top: 80px;
          padding-top: 32px;
          text-align: center;
          border-top: 1px solid var(--border);
          opacity: 0.6;
        }

        .footer-copyright p {
          font-size: 14px;
          color: var(--text-muted);
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .landing-page {
            padding: 20px 0;
          }

          .header {
            margin-bottom: 30px;
          }

          .header-content {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            width: 100%;
            position: relative;
            z-index: 1001;
          }

          .user-section {
            width: auto;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .btn-logout span {
            display: none;
          }

          .btn-logout {
            padding: 8px;
            min-width: 40px;
            justify-content: center;
          }

          .profile-dropdown {
            position: fixed;
            top: 70px;
            left: 50%;
            margin-left: -120px; /* Centering without transform to avoid animation conflict */
            right: auto;
            bottom: auto;
            width: 240px;
            margin-top: 0;
            margin-bottom: 0;
            z-index: 1100;
          }

          .hero-title {
            font-size: 28px;
            font-weight: 900;
            margin-top: 10px;
            text-align: center;
            width: 100%;
            line-height: 1.2;
          }

          .gradient-text {
            font-weight: 900;
          }

          .hero-subtitle {
            font-size: 13px;
            margin-bottom: 24px;
            line-height: 1.5;
            padding: 0 10px;
          }

          .subtitle-line {
            display: block;
            margin-bottom: 4px;
          }

          .features {
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
            margin-bottom: 24px;
          }

          .feature {
            padding: 8px 4px;
            gap: 4px;
          }

          .feature-icon {
            width: 28px;
            height: 28px;
          }
          
          .feature-icon svg {
            width: 100%;
            height: 100%;
          }

          .feature-text {
            font-size: 10px;
            line-height: 1.2;
            white-space: nowrap;
          }

          .action-cards {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .action-card {
            padding: 20px 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .card-title {
            font-size: 18px;
            text-align: center;
            margin-bottom: 8px;
          }
          
          .card-description {
            font-size: 12px;
            text-align: center;
            margin-bottom: 16px;
            line-height: 1.4;
          }
          
          .input {
            padding: 10px 14px;
            font-size: 14px;
            text-align: center;
          }

          .btn {
            font-size: 15px;
            padding: 12px;
            justify-content: center;
          }

          .security-notice {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 16px;
            gap: 12px;
          }

          .notice-icon {
            margin: 0;
            font-size: 32px;
          }
          
          .notice-content h3 {
            font-size: 16px;
          }
          
          .notice-content p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
