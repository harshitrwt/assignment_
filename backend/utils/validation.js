const ApiError = require('./apiError');

const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'];

const cleanString = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim();
};

const validateUsername = (value) => {
  const username = cleanString(value);
  if (!username || typeof username !== 'string') {
    throw new ApiError(400, 'Valid username is required');
  }
  if (username.length < 3 || username.length > 64) {
    throw new ApiError(400, 'Username must be between 3 and 64 characters');
  }
  if (!/^[a-zA-Z0-9._@-]+$/.test(username)) {
    throw new ApiError(400, 'Username can contain letters, numbers, dots, underscores, @, and hyphens only');
  }
  return username;
};

const validatePassword = (value) => {
  if (!value || typeof value !== 'string') {
    throw new ApiError(400, 'Valid password is required');
  }
  if (value.length < 6 || value.length > 128) {
    throw new ApiError(400, 'Password must be between 6 and 128 characters');
  }
  return value;
};

const validateAuthInput = (body) => ({
  username: validateUsername(body.username),
  password: validatePassword(body.password),
});

const validateTaskStatus = (value) => {
  const status = cleanString(value || 'Pending');
  if (!TASK_STATUSES.includes(status)) {
    throw new ApiError(400, `Status must be one of: ${TASK_STATUSES.join(', ')}`);
  }
  return status;
};

const validateTaskTitle = (value) => {
  const title = cleanString(value);
  if (!title || typeof title !== 'string') {
    throw new ApiError(400, 'Valid title is required');
  }
  if (title.length > 120) {
    throw new ApiError(400, 'Title must be 120 characters or fewer');
  }
  return title;
};

const validateTaskDescription = (value) => {
  if (value === undefined || value === null) return '';
  const description = cleanString(value);
  if (typeof description !== 'string') {
    throw new ApiError(400, 'Description must be a string');
  }
  if (description.length > 2000) {
    throw new ApiError(400, 'Description must be 2000 characters or fewer');
  }
  return description;
};

const validateCreateTaskInput = (body) => ({
  title: validateTaskTitle(body.title),
  description: validateTaskDescription(body.description),
  status: validateTaskStatus(body.status),
});

const validateUpdateTaskInput = (body) => {
  const data = {};
  const hasTitle = Object.prototype.hasOwnProperty.call(body, 'title');
  const hasDescription = Object.prototype.hasOwnProperty.call(body, 'description');
  const hasStatus = Object.prototype.hasOwnProperty.call(body, 'status');

  if (hasTitle) data.title = validateTaskTitle(body.title);
  if (hasDescription) data.description = validateTaskDescription(body.description);
  if (hasStatus) data.status = validateTaskStatus(body.status);

  if (!hasTitle && !hasDescription && !hasStatus) {
    throw new ApiError(400, 'No updates provided');
  }

  return {
    data,
    hasContentEdit: hasTitle || hasDescription,
  };
};

const validateTaskId = (value) => {
  const taskId = Number.parseInt(value, 10);
  if (!Number.isInteger(taskId) || taskId <= 0) {
    throw new ApiError(400, 'Valid task id is required');
  }
  return taskId;
};

module.exports = {
  TASK_STATUSES,
  validateAuthInput,
  validateCreateTaskInput,
  validateTaskId,
  validateUpdateTaskInput,
};
