import mongoose from "mongoose";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";

// @desc Purchase a product
// @route POST /api/transactions/purchase/:productId
// @access Private
export const purchaseProduct = async (req, res) => {
    // 1. Starting a session
    const session = await mongoose.startSession();
    // 2. Starting a transaction
    session.startTransaction();
    try {
        const productId = req.params.productId;
        const userId = req.user._id;
        // 3. fetching product and check the stock
        const product = await Product.findById(productId).session(session);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.stock < 1) {
            throw new Error('Product out of stock');
        }
        // 4. to find the wallet and check the balance
        const wallet = await Wallet.findOne({ user: userId }).session(session);
        if (!wallet) {
            throw new Error('Wallet not found');
        }
        if (wallet.balance < product.price) {
            throw new Error('Insufficient balance');
        }
        // 5. to deduct the product price from the wallet balance and decrease the product stock
        wallet.balance -= product.price;
        await wallet.save({ session });

        product.stock -= 1;
        await product.save({ session });
        // 6. transaction history record
        const transaction = new Transaction([{
            user: userId,
            product: productId,
            amount: product.price,
            type: 'purchase',
            status: 'success' 
        }], {session} )

        // 7. confirm the transaction if all operations are successful
        await session.commitTransaction();
        session.endSession();

        console.log(`Purchase successful! User ID: ${userId} bought ${product.name} for $${product.price}`);
        res.status(200).json({ 
            message: 'Product purchased successfully' ,
            transaction: transaction[0],
            newBalance: wallet.balance
        });
    } catch (error) {
        // 8. if any operation fails, abort the transaction and rollback all changes
        await session.abortTransaction();
        session.endSession();

        console.error(`Purchase failed: ${error.message}`);
        res.status(400).json({ message: `Purchase failed: ${error.message}` });
    }
};