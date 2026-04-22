'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to home
      router.push('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Guest login failed');
      }

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to home
      router.push('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page">
        <div className="login-container">
          {/* Logo */}
          <div className="logo-section fade-in">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect width="60" height="60" rx="15" fill="url(#wipeGradientLarge)" />
              <path d="M16 24C16 21.7909 17.7909 20 20 20H40C42.2091 20 44 21.7909 44 24V34C44 36.2091 42.2091 38 40 38H32L24 43V38H20C17.7909 38 16 36.2091 16 34V24Z" fill="white" />
              <path d="M33 23L31.8 26.5L28.5 27.5L31.8 28.5L33 32L34.2 28.5L37.5 27.5L34.2 26.5L33 23Z" fill="#8B5CF6" />
              <defs>
                <linearGradient id="wipeGradientLarge" x1="0" y1="0" x2="60" y2="60">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="logo-title"><span className="white-text">Wipe</span>Chat</h1>
            <p className="logo-subtitle">Secure & Anonymous Messaging</p>
          </div>

          {/* Login/Signup Form */}
          <div className="form-card card slide-in">
            <div className="form-header">
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{isLogin ? 'Login to continue chatting' : 'Sign up to get started'}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="error-message fade-in">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  className="input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={20}
                  disabled={loading}
                />
                <span className="input-hint">3-20 characters</span>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
                <span className="input-hint">Minimum 6 characters</span>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Login' : 'Sign Up'
                )}
              </button>
            </form>

              <button
                type="button"
                className="btn btn-guest w-full"
                onClick={handleGuestLogin}
                disabled={loading}
              >
                Continue as Guest
              </button>

              <div className="form-footer">
                <p>
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    disabled={loading}
                  >
                    {isLogin ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>
          </div>

          {/* Features */}
          <div className="features-grid fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="feature-item">
              <div className="feature-icon" style={{ color: '#8b5cf6' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="feature-label">Encrypted</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ color: '#f59e0b' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="feature-label">24h Auto-Delete</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon" style={{ color: '#3b82f6' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="feature-label">Anonymous</div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .login-container {
            width: 100%;
            max-width: 340px;
          }

          .logo-section {
            text-align: center;
            margin-bottom: 24px;
          }

          .logo-section svg {
            margin-bottom: 16px;
          }

          .logo-title {
            font-size: 32px;
            font-weight: 800;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
            color: white;
          }

          .white-text {
            -webkit-text-fill-color: white;
            color: white;
          }

          .logo-subtitle {
            color: var(--text-secondary);
            font-size: 14px;
          }

          .form-card {
            margin-bottom: 24px;
          }

          .form-header {
            text-align: center;
            margin-bottom: 24px;
          }

          .form-header h2 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .form-header p {
            color: var(--text-secondary);
            font-size: 14px;
          }

          .auth-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-group label {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }

          .input-hint {
            font-size: 12px;
            color: var(--text-muted);
          }

          .error-message {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: var(--radius);
            color: #ef4444;
            font-size: 14px;
          }

          .btn-guest {
            margin-top: 12px;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-primary);
          }

          .btn-guest:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.05);
            border-color: var(--primary);
            color: var(--primary);
          }

          .form-footer {
            margin-top: 24px;
            border-top: 1px solid var(--border);
            padding-top: 20px;
            text-align: center;
          }

          .form-footer p {
            color: var(--text-secondary);
            font-size: 14px;
          }

          .link-button {
            background: none;
            border: none;
            color: var(--primary);
            font-weight: 600;
            cursor: pointer;
            margin-left: 4px;
            transition: color 0.3s ease;
          }

          .link-button:hover:not(:disabled) {
            color: var(--primary-light);
            text-decoration: underline;
          }

          .link-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .feature-item {
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

          .feature-item:hover {
            transform: translateY(-2px);
            border-color: var(--primary);
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
          }

          .feature-icon {
            font-size: 24px;
          }

          .feature-label {
            font-size: 12px;
            font-weight: 600;
            text-align: center;
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

          @media (max-width: 480px) {
            .login-page {
              padding: 0px;
              height: 100dvh;
              overflow: hidden;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            }

            .login-container {
               padding: 16px 12px;
            }

            .logo-section {
              margin-bottom: 16px;
            }

            .logo-title {
              font-size: 24px;
            }
            
            .logo-section svg {
              width: 40px;
              height: 40px;
              margin-bottom: 4px;
            }

            .form-header {
              margin-bottom: 16px;
            }

            .form-header h2 {
              font-size: 18px;
            }

            .form-card {
              padding: 16px 12px;
              margin-bottom: 16px;
            }

            .auth-form {
              gap: 12px;
            }

            .form-group {
              gap: 4px;
            }

            .input {
              padding: 10px 12px;
              font-size: 15px; 
            }

            .btn {
              padding: 10px;
              font-size: 14px;
            }

            .features-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 6px;
            }

            .feature-item {
              padding: 8px 2px;
            }

            .feature-icon {
              font-size: 16px;
            }

            .feature-label {
              font-size: 9px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
