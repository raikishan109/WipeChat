'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => router.push('/')}>
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="url(#navGradient)" />
            <path d="M11 16C11 14.3431 12.3431 13 14 13H26C27.6569 13 29 14.3431 29 16V24C29 25.6569 27.6569 27 26 27H19L14 31V27H14C12.3431 27 11 25.6569 11 24V16Z" fill="white" />
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="40" y2="40">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-text">WipeChat</span>
        </div>

        {user && (
          <div className="user-section">
            <div className="profile-wrapper">
              <button 
                className={`profile-trigger ${showProfile ? 'active' : ''}`}
                onClick={() => setShowProfile(!showProfile)}
              >
                <div className="avatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="username-display">{user.username.split('@')[0]}</span>
                <svg className={`chevron ${showProfile ? 'rotate' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {showProfile && (
                <div className="profile-dropdown fade-in">
                  <div className="dropdown-header">
                    <div className="user-info">
                      <span className="user-label">Logged in as</span>
                      <span className="user-name">{user.username}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          max-width: 1000px;
          margin: 0 auto;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .nav-logo:hover {
          transform: scale(1.02);
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        .user-section {
          display: flex;
          align-items: center;
        }

        .profile-wrapper {
          position: relative;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border);
          padding: 6px 12px;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-primary);
        }

        .profile-trigger:hover, .profile-trigger.active {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--primary);
        }

        .avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .username-display {
          font-size: 14px;
          font-weight: 600;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chevron {
          transition: transform 0.3s ease;
          opacity: 0.5;
        }

        .chevron.rotate {
          transform: rotate(180deg);
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 220px;
          background: #0f172a;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-header {
          padding: 12px;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-label {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
          word-break: break-all;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border);
          margin: 4px 8px;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: none;
          background: none;
          color: var(--text-secondary);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 600;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .dropdown-item.logout {
          color: #ef4444;
        }

        .dropdown-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        @media (max-width: 640px) {
          .nav-container {
            padding: 0 16px;
          }
          
          .username-display {
            display: none;
          }
          
          .profile-trigger {
            padding: 4px;
          }
          
          .chevron {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
