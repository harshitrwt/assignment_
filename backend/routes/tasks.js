const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
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
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title || typeof title !== 'string') return res.status(400).json({ error: 'Valid title is required' });

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || '',
        status: status || 'Pending',
        userId: req.user.id,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, description, status } = req.body;
    
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    const isOwner = task.userId === req.user.id;
    const hasContentEdit = title !== undefined || description !== undefined;

    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (hasContentEdit && !isOwner) {
      return res.status(403).json({ error: 'You can edit only your own tasks' });
    }

    const updateData = {};
    if (title !== undefined) {
      if (!title || typeof title !== 'string') return res.status(400).json({ error: 'Valid title is required' });
      updateData.title = title;
    }
    if (description !== undefined) updateData.description = description || '';
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.user.role !== 'admin' && task.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
