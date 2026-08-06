import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import os from 'os';

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

app.post('/debug/load', (req, res) => {
  const ms = parseInt(req.query.ms as string) || 2000;
  const start = Date.now();
  // Bounded synthetic CPU work
  while (Date.now() - start < ms) {
    Math.random() * Math.random();
  }
  res.status(200).json({ status: 'ok', loadDurationMs: ms });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

