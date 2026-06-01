import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/v1/auth/register', { username, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during registration');
    }
  };

  return (
    <div className="full-yellow-screen slide-up">
      <div className="split-layout">
        <div className="split-left">
          <h1 className="text-hero mb-4">Join<br/>The Void.</h1>
          <p className="text-sub">Start your frictionless journey here.</p>
        </div>
        
        <div className="split-right">
          <div className="glass-card auth-glass">
            <h2 className="text-sub mb-8" style={{ color: 'var(--bg-onyx)', opacity: 1, fontSize: '1.5rem', fontWeight: 900 }}>Create Account</h2>
            {error && <div className="alert-error">{error}</div>}
            {success && <div className="alert-success">{success}</div>}
            <form onSubmit={handleRegister}>
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
                  autoComplete="new-password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full mb-4">REGISTER NOW</button>
            </form>
            <div className="text-center">
              <Link to="/login" className="link-text">Already a member? Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
