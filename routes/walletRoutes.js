import express from 'express';
import { getWalletBalance, depositMoney } from '../controllers/walletController.js';
import { protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Get balance route(Protected)
router.get('/', protect, getWalletBalance);

// Deposit money route(Protected)
router.post('/deposit', protect, depositMoney);

export default router;