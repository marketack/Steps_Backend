import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserProStatus
} from '../controllers/userController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUser);
router.delete('/me', auth, deleteUser);
router.get('/', auth, getAllUsers); // Admin only
router.put('/:id/pro', auth, adminMiddleware, updateUserProStatus);

export default router;
