import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ─── CarboniX Auto-injected (do not remove) ───────────────────────────────
const { startTelemetry } = require('../carbonix-telemetry');
startTelemetry({
  instanceId:   process.env.INSTANCE_ID    || 'LAPTOP-PGMKJMT9',
  instanceType: process.env.INSTANCE_TYPE  || 't3.medium',
  provider:     process.env.CLOUD_PROVIDER || 'aws',
  region:       process.env.AWS_REGION     || 'ap-south-1',
  projectName:  process.env.APP_NAME       || 'backend',
});
// ───────────────────────────────────────────────────────────────────────────
