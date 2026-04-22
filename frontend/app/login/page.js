'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Fetch total users count
    fetch(`${SERVER_URL}/api/stats/users`)
      .then(res => res.json())
      .then(data => setTotalUsers(data.totalUsers))
      .catch(err => console.error('Failed to fetch user count:', err));
  }, []);

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
          
          {/* User Count Stats */}
          {totalUsers > 0 && (
            <div className="user-stats fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="stats-badge">
                <span className="pulse-dot"></span>
                <span className="stats-text"><span className="count-highlight">{totalUsers.toLocaleString()}</span> users have used WipeChat</span>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .login-container {
            width: 100%;
            max-width: 380px;
            padding: 10px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            animation: fadeIn 0.8s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
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
            margin-bottom: 16px;
            padding: 24px;
          }

          .form-header {
            text-align: center;
            margin-bottom: 16px;
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

          .user-stats {
            margin-top: 32px;
            display: flex;
            justify-content: center;
          }

          .stats-badge {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 100px;
          }

          .pulse-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
            animation: pulse-green 2s infinite;
          }

          @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }

          .stats-text {
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 500;
          }

          .count-highlight {
            color: white;
            font-weight: 800;
            font-size: 14px;
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
          }
        `}</style>
      </div>
    </div>
  );
}
