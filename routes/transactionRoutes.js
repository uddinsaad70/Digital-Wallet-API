import express from 'express';
import { getMyTransactions, purchaseProduct } from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Purchase route: User need to be logged in to purchase a product
router.post('/purchase/:productId', protect, purchaseProduct);

// Get route : to see the transaction history of the logged in user
router.get('/', protect, getMyTransactions);

export default router;