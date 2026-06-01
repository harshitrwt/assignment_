import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during login');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h1 className="brand text-center mb-8">TaskManager</h1>
        <h2 className="text-center mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Sign in to your account</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mb-4">Sign In</button>
        </form>
        
        <div className="text-center">
          <Link to="/register" className="link">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
}
