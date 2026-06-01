const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const ApiError = require('../utils/apiError');
const {
  validateCreateTaskInput,
  validateTaskId,
  validateUpdateTaskInput,
} = require('../utils/validation');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const allTasks = await prisma.task.findMany({
        include: { user: { select: { id: true, username: true, role: true } } },
      });
      return res.json(allTasks);
    } else {
      const userTasks = await prisma.task.findMany({ where: { userId: req.user.id } });
      return res.json(userTasks);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const taskInput = validateCreateTaskInput(req.body);

    const newTask = await prisma.task.create({
      data: {
        ...taskInput,
        userId: req.user.id,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const taskId = validateTaskId(req.params.id);
    const { data: updateData, hasContentEdit } = validateUpdateTaskInput(req.body);
    
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new ApiError(404, 'Task not found');
    
    const isOwner = task.userId === req.user.id;

    if (req.user.role !== 'admin' && !isOwner) {
      throw new ApiError(403, 'Access denied');
    }

    if (hasContentEdit && !isOwner) {
      throw new ApiError(403, 'You can edit only your own tasks');
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const taskId = validateTaskId(req.params.id);
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new ApiError(404, 'Task not found');

    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      throw new ApiError(403, 'Access denied');
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
