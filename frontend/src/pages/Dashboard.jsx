import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/v1/tasks', 
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Task added successfully.');
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
    setSuccess('');
    try {
      await axios.delete(`http://localhost:5000/api/v1/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await axios.put(`http://localhost:5000/api/v1/tasks/${task.id}`, 
        { title: task.title, description: task.description, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const getNextStatus = (current) => {
    if (current === 'Pending') return 'In Progress';
    if (current === 'In Progress') return 'Completed';
    return 'Pending';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="auth-wrapper">
      <div className="liquid-section slide-up" style={{ paddingBottom: '12rem' }}>
        <div className="container flex justify-between items-center w-full">
          <div>
            <h1 className="text-hero">Task<br/>Manager.</h1>
            <p className="text-sub">Welcome back, {username} ({role})</p>
          </div>
          <button onClick={handleLogout} className="btn btn-primary">LOGOUT</button>
        </div>
      </div>

      <div className="void-section flex-1">
        <div className="container" style={{ marginTop: '-10rem' }}>
          
          {error && <div className="alert-error slide-up">{error}</div>}
          {success && <div className="alert-success slide-up">{success}</div>}

          {role === 'user' && (
            <div className="glass-card slide-up mb-8" style={{ padding: '2rem' }}>
              <h2 className="text-sub dark-text mb-4" style={{ color: 'white', fontWeight: 700 }}>Create New Task</h2>
              <form onSubmit={handleCreateTask} className="flex gap-4 items-center">
                <input
                  type="text"
                  className="form-input mb-0"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="form-input mb-0"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <select
                  className="form-input mb-0"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending" style={{color: 'black'}}>Pending</option>
                  <option value="In Progress" style={{color: 'black'}}>In Progress</option>
                  <option value="Completed" style={{color: 'black'}}>Completed</option>
                </select>
                <button type="submit" className="btn btn-yellow" style={{ whiteSpace: 'nowrap' }}>
                  ADD TASK
                </button>
              </form>
            </div>
          )}

          <div className="mb-4 flex justify-between items-center slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
              {role === 'admin' ? 'System Overview (All Tasks)' : 'Your Tasks'}
            </h2>
            <span className="text-label" style={{ color: 'white' }}>{tasks.length} tasks total</span>
          </div>

          <div className="grid-cards slide-up" style={{ animationDelay: '0.2s' }}>
            {tasks.map(task => (
              <div key={task.id} className="glass-card glass-float" style={{ animationDelay: `${Math.random() * 2}s`, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                <div className="pill-badge">{task.status}</div>
                <h3 className="mb-2" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{task.title}</h3>
                <p className="text-body mb-4" style={{ color: 'rgba(255,255,255,0.7)', flexGrow: 1 }}>{task.description}</p>
                
                <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  {role === 'admin' && task.user ? (
                    <span className="text-label" style={{ color: 'white' }}>by @{task.user.username}</span>
                  ) : <span></span>}
                  
                  <div className="flex gap-2">
                    {role === 'user' && (
                      <button 
                        onClick={() => handleStatusChange(task, getNextStatus(task.status))} 
                        className="btn btn-yellow btn-small"
                      >
                        {task.status === 'Completed' ? 'REOPEN' : 'NEXT STATUS'}
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteTask(task.id)} 
                      className="btn btn-outline btn-small"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="glass-card">
                <p className="text-body text-center">No tasks found in the void.</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-8 slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-label" style={{ opacity: 0.5 }}>TaskManager | 2026</p>
          </div>

        </div>
      </div>
    </div>
  );
}
