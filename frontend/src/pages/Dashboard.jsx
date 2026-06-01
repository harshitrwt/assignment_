import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTasks();
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError('Failed to fetch tasks');
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/v1/tasks', 
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      setStatus('Pending');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (id) => {
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/v1/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div>
      <div className="header">
        <div className="brand">TaskManager</div>
        <div className="flex items-center gap-4">
          <span className="text-muted">Logged in as <strong>{username}</strong> ({role})</span>
          <button onClick={handleLogout} className="btn" style={{ border: '1px solid var(--border)', color: 'var(--text-main)', background: 'transparent' }}>Logout</button>
        </div>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}

        {role === 'user' && (
          <div className="card mb-8">
            <h2 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create New Task</h2>
            <form onSubmit={handleCreateTask} className="grid items-end" style={{ gridTemplateColumns: '1fr 2fr 1fr auto' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Title</label>
                <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <input type="text" className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status</label>
                <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Add Task</button>
            </form>
          </div>
        )}

        <div className="mb-4 flex justify-between items-center">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {role === 'admin' ? 'System Overview (All Tasks)' : 'Your Tasks'}
          </h2>
          <span className="text-muted">{tasks.length} tasks total</span>
        </div>

        <div className="grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-title">{task.title}</div>
              <div className="task-desc">{task.description}</div>
              <div className="task-footer">
                <span className="task-status">{task.status}</span>
                <div className="flex items-center gap-2">
                  {role === 'admin' && task.user && (
                    <span className="task-author">by @{task.user.username}</span>
                  )}
                  <button onClick={() => handleDeleteTask(task.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-muted" style={{ gridColumn: '1 / -1' }}>No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
