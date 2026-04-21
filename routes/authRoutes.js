import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
const router = express.Router();


//Route: POST /api/auth/register
//Description: Register a new user
router.post('/register', registerUser);

//Route: POST /api/auth/login
//Description: Authenticate user and return token
console.log('Going to set up login route');
router.post('/login', loginUser);
console.log('Getting out of login route setup');

export default router;