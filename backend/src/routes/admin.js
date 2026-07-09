import express from 'express';
import { authenticate, adminOnly } from '../middleware/auth.js';
import { getAllUsers, getUserById, updateUser, deleteUser, resetUserPassword, getDashboardStats } from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticate, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/reset-password', resetUserPassword);

export default router;
