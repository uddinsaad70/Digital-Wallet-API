import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'purchase'],
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);