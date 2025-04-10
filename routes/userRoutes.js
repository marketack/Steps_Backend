import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllUsers
} from '../controllers/userController.js';

const router = express.Router();

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUser);
router.delete('/me', auth, deleteUser);
router.get('/', auth, getAllUsers); // Admin only

export default router;
