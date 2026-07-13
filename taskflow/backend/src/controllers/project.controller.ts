import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/db';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
      include: {
        _count: {
          select: { tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findFirst({
      where: { id, userId: req.user!.id },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        userId: req.user!.id,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const existingProject = await prisma.project.findFirst({ where: { id, userId: req.user!.id } });
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const project = await prisma.project.update({
      where: { id },
      data: { title, description },
    });

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingProject = await prisma.project.findFirst({ where: { id, userId: req.user!.id } });
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete related tasks first
    await prisma.task.deleteMany({ where: { projectId: id } });
    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
