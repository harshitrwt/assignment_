import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('userId', res.data.id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during login');
    }
  };

  return (
    <div className="full-yellow-screen slide-up">
      <div className="split-layout">
        <div className="split-left">
          <h1 className="text-hero mb-4">Access<br/>The Void.</h1>
          <p className="text-sub">Frictionless task management.</p>
        </div>
        
        <div className="split-right">
          <div className="glass-card auth-glass">
            <h2 className="text-sub mb-8" style={{ color: 'var(--bg-onyx)', opacity: 1, fontSize: '1.5rem', fontWeight: 900 }}>Sign In</h2>
            {error && <div className="alert-error">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-4 text-left">
                <label className="form-label">USERNAME</label>
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength="64"
                  autoComplete="username"
                  required
                  placeholder="Enter username (e.g., admin)"
                />
              </div>
              <div className="mb-8 text-left">
                <label className="form-label">PASSWORD</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                  maxLength="128"
                  autoComplete="current-password"
                  required
                  placeholder="Enter password"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full mb-4">ENTER SYSTEM</button>
            </form>
            <div className="text-center">
              <Link to="/register" className="link-text">Need an account? Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
