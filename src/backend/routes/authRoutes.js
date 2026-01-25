import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateLogin } from '../middlewares/validate.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;