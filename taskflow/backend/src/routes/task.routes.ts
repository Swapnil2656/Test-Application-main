import { Router } from 'express';
import { createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true }); // mergeParams to access projectId from parent router

router.use(authenticate);

router.post('/', createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

export default router;
