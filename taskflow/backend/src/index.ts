import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import os from 'os';
import prisma from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
// Nest task routes under projects
app.use('/api/projects/:projectId/tasks', taskRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Debug: check env vars and DB connection
app.get('/debug/env', (req, res) => {
  res.json({
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
    DATABASE_URL_PREFIX: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT SET',
    JWT_SECRET_SET: !!process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
});

app.get('/debug/db', async (req, res) => {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    res.json({ status: 'db connected', result });
  } catch (err: any) {
    res.status(500).json({ status: 'db error', error: err.message });
  }
});

app.post('/debug/load', (req, res) => {
  const ms = parseInt(req.query.ms as string) || 2000;
  const start = Date.now();
  // Bounded synthetic CPU work
  while (Date.now() - start < ms) {
    Math.random() * Math.random();
  }
  res.status(200).json({ status: 'ok', loadDurationMs: ms });
});

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

