import mongoose from "mongoose";
import Product from "../models/Product.js";
import Transaction from "../models/Transaction.js";
import Wallet from "../models/Wallet.js";
import User from "../models/User.js";

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
        const transaction = await Transaction.create([{
            user: userId,
            product: productId,
            amount: product.price,
            type: 'purchase',
            status: 'success' 
        }], {session} );


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

// @desc Get logged in user's transaction history
// @route GET /api/transactions
// @access Private

export const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .populate('product', 'name price')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            count: transactions.length,
            transactions
        });
    } catch (error) {
        console.error(`Error fetching transactions: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// @desc Transfer money to another user
// @route POST /api/transactions/transfer
// @access Private
export const transferMoney = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const senderId = req.user._id;
        const { receiverEmail, amount } = req.body;

        if ( amount <= 0) {
            throw new Error('Transfer amount must be greater than zero');
        }

        // 1. Check the sender wallet and balance
        const senderWallet = await Wallet.findOne({ user: senderId }).session(session);
        if (!senderWallet || senderWallet.balance < amount) {
            throw new Error('Insufficient balance to transfer');
        }

        const receiver = await User.findOne({ email: receiverEmail }).session(session);
        if (!receiver) {
            throw new Error('Recipient user not found');
        }
        // 2. sender can not transfer money to himself
        if (senderId.toString() === receiver._id.toString()) {
            throw new Error('You cannot transfer money to yourself');
        }

        // 3. Check the recipient wallet
        const receiverWallet = await Wallet.findOne({ user: receiver._id }).session(session);
        if (!receiverWallet) {
            throw new Error('Recipient wallet not found');
        }

        // 4. Deduct the amount from sender wallet and add to receiver wallet
        senderWallet.balance -= amount;
        await senderWallet.save({ session });
        receiverWallet.balance += amount;
        await receiverWallet.save({ session });

        // 5. Create transaction records for both sender and receiver
        const senderTx = new Transaction({
            user: senderId,
            amount: amount,
            type: 'transfer_out',
            status: 'success'
        });
        await senderTx.save({ session });

        const receiverTx = new Transaction({
            user: receiver._id,
            amount: amount,
            type: 'transfer_in',
            status: 'success'
        });
        await receiverTx.save({ session });

        // 6. Commit the transaction if all operations are successful
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: `Successfully transferred ${amount} to ${receiver.name} (${receiver.email})`,
            newBalance: senderWallet.balance
        });
    }
    catch (error) {
        // 7. If any operation fails, abort the transaction and rollback all changes
        await session.abortTransaction();
        session.endSession();
        console.error(`Transfer failed: ${error.message}`);
        res.status(400).json({ message: `Transfer failed: ${error.message}` });
    }
};