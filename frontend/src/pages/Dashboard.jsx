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

  const getStatusClass = (status) => {
    if (status === 'Pending') return 'status-pending';
    if (status === 'In Progress') return 'status-progress';
    if (status === 'Completed') return 'status-completed';
    return 'status-pending';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-onyx)' }}>
      {/* Big Yellow Header Section */}
      <header className="dashboard-header">
        <div className="header-container">
          <div>
            <h1 className="nav-brand">Task<br/>Void.</h1>
            <p style={{ color: 'var(--bg-onyx)', opacity: 0.8, marginTop: '0.5rem', fontWeight: 500 }}>
              Welcome, {username} ({role})
            </p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>LOGOUT</button>
        </div>
      </header>

      {/* Main Content Area - Compressed towards center */}
      <div className="dashboard-content slide-up">
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        {/* Removed role check so Admin can create tasks too */}
        <div className="glass-card mb-8">
          <h2 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Create New Task</h2>
          <form onSubmit={handleCreateTask} className="flex gap-4 items-center" style={{ flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input form-input-dark mb-0"
              style={{ flex: 1, minWidth: '200px' }}
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="text"
              className="form-input form-input-dark mb-0"
              style={{ flex: 2, minWidth: '250px' }}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="form-input form-input-dark mb-0"
              style={{ flex: 1, minWidth: '150px' }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button type="submit" className="btn btn-yellow" style={{ whiteSpace: 'nowrap' }}>
              ADD TASK
            </button>
          </form>
        </div>

        <div className="mb-4 flex justify-between items-center mt-8">
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
            {role === 'admin' ? 'System Overview (All Tasks)' : 'Your Tasks'}
          </h2>
          <span className="text-label" style={{ color: 'white', opacity: 0.5, fontSize: '0.875rem' }}>
            {tasks.length} TASKS TOTAL
          </span>
        </div>

        <div className="grid-cards">
          {tasks.map(task => (
            <div key={task.id} className="glass-card flex-col" style={{ padding: '2rem' }}>
              <div className={`status-badge ${getStatusClass(task.status)}`}>{task.status}</div>
              <h3 className="mb-2" style={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '4rem' }}>{task.title}</h3>
              <p className="text-body mb-4" style={{ color: 'rgba(255,255,255,0.7)', flexGrow: 1 }}>{task.description}</p>
              
              <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {role === 'admin' && task.user ? (
                  <span className="text-label" style={{ color: 'white', opacity: 0.8 }}>BY @{task.user.username}</span>
                ) : <span></span>}
                
                <div className="flex gap-2" style={{ marginLeft: 'auto' }}>
                  <button 
                    onClick={() => handleStatusChange(task, getNextStatus(task.status))} 
                    className="btn btn-yellow btn-small"
                  >
                    {task.status === 'Completed' ? 'REOPEN' : 'NEXT'}
                  </button>
                  <button 
                    onClick={() => handleDeleteTask(task.id)} 
                    className="btn btn-outline-light btn-small"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
              <p className="text-body text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>No tasks found in the void.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
