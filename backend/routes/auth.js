const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const ApiError = require('../utils/apiError');
const { validateAuthInput } = require('../utils/validation');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = validateAuthInput(req.body);

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) throw new ApiError(409, 'User already exists');

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: 'user',
      },
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = validateAuthInput(req.body);

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new ApiError(401, 'Invalid credentials');

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) throw new ApiError(401, 'Invalid credentials');

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, 'JWT secret is not configured');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      expiresIn: '1h',
      id: user.id,
      username: user.username,
      role: user.role,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
