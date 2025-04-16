import express from 'express';
import cookieParser from 'cookie-parser';
import {
  register,
  login,
  verifyEmail,
  refreshToken
} from '../controllers/authController.js';

import { verifyToken } from '../middleware/authMiddleware.js'; // ✅ Add this

const router = express.Router();
router.use(cookieParser());

router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.get('/refresh-token', refreshToken);

// ✅ Add this route to check token validity
router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({ isAdmin: req.user.isAdmin, userId: req.user.id });
});

export default router;
