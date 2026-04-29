import express from 'express';
import { purchaseProduct } from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Purchase route: User need to be logged in to purchase a product
router.post('/purchase/:productId', protect, purchaseProduct);

export default router;