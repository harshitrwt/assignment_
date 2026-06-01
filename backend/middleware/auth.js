const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const [scheme, token] = authHeader?.split(' ') || [];

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Bearer token is required'));
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'Access denied. Admin only.'));
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
