import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

function StatusDropdown({ value, onChange, style }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div
      className="status-select"
      style={style}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        type="button"
        className="form-input form-input-dark mb-0 status-select-trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{value}</span>
        <span className="status-select-caret" aria-hidden="true"></span>
      </button>

      {isOpen && (
        <div className="status-select-menu" role="listbox">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`status-select-option ${option === value ? 'is-active' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(option)}
              role="option"
              aria-selected={option === value}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('Pending');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const isAdmin = role === 'admin';

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  }, [navigate]);

  const isTaskOwner = useCallback((task) => {
    if (!isAdmin) return true;
    if (userId && task.userId !== undefined) return String(task.userId) === String(userId);
    return task.user?.username === username;
  }, [isAdmin, userId, username]);

  const isAdminOwnedTask = useCallback((task) => {
    return task.user?.role === 'admin' || isTaskOwner(task);
  }, [isTaskOwner]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        showToast('Failed to fetch tasks');
      }
    }
  }, [handleLogout, showToast, token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks, navigate, token]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/tasks',
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Task created successfully.');
      setTitle('');
      setDescription('');
      setStatus('Pending');
      await fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (editingTaskId === id) setEditingTaskId(null);
      showToast('Task deleted successfully.');
      await fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/tasks/${task.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Task status updated successfully.');
      await fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleStartEdit = (task) => {
    if (!isTaskOwner(task)) {
      showToast('You can edit only your own tasks.');
      return;
    }
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditStatus(task.status);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
    setEditStatus('Pending');
  };

  const handleUpdateTask = async (e, taskId) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/v1/tasks/${taskId}`,
        { title: editTitle, description: editDescription, status: editStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Task updated successfully.');
      handleCancelEdit();
      await fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update task');
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

  const adminTasks = isAdmin ? tasks.filter(isAdminOwnedTask) : [];
  const userTasks = isAdmin ? tasks.filter((task) => !isAdminOwnedTask(task)) : [];

  const renderTaskCards = (sectionTasks, emptyText) => (
    <div className="grid-cards">
      {sectionTasks.map((task) => {
        const canEditTask = isTaskOwner(task);
        const isEditing = editingTaskId === task.id && canEditTask;
        const cardStatus = isEditing ? editStatus : task.status;

        return (
          <div key={task.id} className="glass-card flex-col task-card" style={{ padding: '2rem' }}>
            <div className={`status-badge ${getStatusClass(cardStatus)}`}>
              {cardStatus}
            </div>

            {isEditing ? (
              <form onSubmit={(e) => handleUpdateTask(e, task.id)} className="task-edit-form flex-col">
                <input
                  type="text"
                  className="form-input form-input-dark mb-0"
                  placeholder="Task Title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
                <textarea
                  className="form-input form-input-dark form-textarea task-edit-textarea mb-0"
                  placeholder="Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="3"
                />
                <StatusDropdown value={editStatus} onChange={setEditStatus} />

                <div className="task-card-footer flex justify-between items-center">
                  {isAdmin && task.user ? (
                    <span className="text-label" style={{ color: 'white', opacity: 0.8 }}>BY -{task.user.username}</span>
                  ) : <span></span>}

                  <div className="flex gap-2 task-card-actions">
                    <button type="submit" className="btn btn-yellow btn-small">
                      SAVE
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn btn-outline-light btn-small"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <h3 className="mb-2 task-card-title" style={{ fontSize: '1.5rem', fontWeight: 700, paddingRight: '4rem' }}>{task.title}</h3>
                <p className="text-body mb-4 task-description" style={{ color: 'rgba(255,255,255,0.7)', flexGrow: 1 }}>{task.description}</p>

                <div className="task-card-footer flex justify-between items-center">
                  {isAdmin && task.user ? (
                    <span className="text-label" style={{ color: 'white', opacity: 0.8 }}>BY - {task.user.username}</span>
                  ) : <span></span>}

                  <div className="flex gap-2 task-card-actions">
                    <button
                      onClick={() => handleStatusChange(task, getNextStatus(task.status))}
                      className="btn btn-yellow btn-small"
                    >
                      {task.status === 'Completed' ? 'REOPEN' : 'NEXT'}
                    </button>
                    {canEditTask && (
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="btn btn-outline-light btn-small"
                      >
                        EDIT
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn btn-outline-light btn-small"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
      {sectionTasks.length === 0 && (
        <div className="glass-card empty-task-card" style={{ gridColumn: '1 / -1' }}>
          <p className="text-body text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>{emptyText}</p>
        </div>
      )}
    </div>
  );

  const renderTaskSection = (heading, sectionTasks, emptyText) => (
    <section className="task-section">
      <div className="mb-4 flex justify-between items-center task-section-header">
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
          {heading}
        </h2>
        <span className="text-label" style={{ color: 'white', opacity: 0.5, fontSize: '0.875rem' }}>
          {sectionTasks.length} TASKS TOTAL
        </span>
      </div>
      {renderTaskCards(sectionTasks, emptyText)}
    </section>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-onyx)' }}>
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

      <div className="dashboard-content slide-up">
        <div className="glass-card mb-8 create-task-card">
          <h2 className="mb-4" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>Create Tasks</h2>
          <form onSubmit={handleCreateTask} className="task-create-form flex gap-4" style={{ flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input form-input-dark mb-0"
              style={{ flex: 1, minWidth: '200px' }}
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="form-input form-input-dark form-textarea mb-0"
              style={{ flex: 2, minWidth: '250px' }}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="1"
            />
            <StatusDropdown
              value={status}
              onChange={setStatus}
              style={{ flex: 1, minWidth: '150px' }}
            />
            <button type="submit" className="btn btn-yellow" style={{ whiteSpace: 'nowrap' }}>
              ADD TASK
            </button>
          </form>
        </div>

        {isAdmin ? (
          <>
            {renderTaskSection('Admin Tasks', adminTasks, 'No admin tasks found.')}
            {renderTaskSection('User Tasks', userTasks, 'No user tasks found.')}
          </>
        ) : (
          renderTaskSection('Your Tasks', tasks, 'No tasks found in the void.')
        )}
      </div>

      {toast && <div className="toast-notice">{toast}</div>}
    </div>
  );
}
