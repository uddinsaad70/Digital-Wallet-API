import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { get } from 'mongoose';
const router = express.Router();


//Route: POST /api/auth/register
//Description: Register a new user
router.post('/register', registerUser);

//Route: POST /api/auth/login
//Description: Authenticate user and return token
router.post('/login', loginUser);

//Protected Route: GET /api/auth/profile
//Description: Get user profile (requires authentication)
router.get('/profile', protect, getUserProfile);

export default router;