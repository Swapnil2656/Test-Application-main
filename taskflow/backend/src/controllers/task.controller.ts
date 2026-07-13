import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/db';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, dueDate, assigneeId } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({ where: { id: projectId, userId: req.user!.id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'todo',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, taskId } = req.params;
    const { title, description, status, dueDate, assigneeId } = req.body;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({ where: { id: projectId, userId: req.user!.id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const existingTask = await prisma.task.findFirst({ where: { id: taskId, projectId } });
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId,
      },
    });

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, taskId } = req.params;

    // Verify project belongs to user
    const project = await prisma.project.findFirst({ where: { id: projectId, userId: req.user!.id } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const existingTask = await prisma.task.findFirst({ where: { id: taskId, projectId } });
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await prisma.task.delete({ where: { id: taskId } });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
