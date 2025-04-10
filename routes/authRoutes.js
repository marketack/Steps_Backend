import express from 'express';
import { register, login, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);

export default router;
