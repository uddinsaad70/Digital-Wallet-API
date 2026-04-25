import express from 'express';
import { createProduct, getProducts } from '../controllers/productController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

//Public routes : Anyone can see the products, No Bouncer needed
router.get('/', getProducts);

// Protected & Admin Route: Two middlewares: 1. protect (Bouncer) to check if the user is logged in(using token), 2. admin to check if the user is an admin role
router.post('/', protect, admin, createProduct);

export default router;