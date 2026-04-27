// 1. Import necessary modules
import 'dotenv/config';
import express from 'express';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import walletRoutes from './routes/walletRoutes.js';

// 2. Initialize app and configure environment variables
const app = express();

// 3. Essential middlewares
// This line is crucial! It tells Express to parse incoming JSON data in request bodies.
app.use(express.json());


// 4. Routes 
// Mount the auth routes at the /api/auth path
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wallet', walletRoutes);

// Basic route to test if the server is running
app.get('/', (req, res) => {
    res.send('Digital Wallet API is running !');
});

//5. Boot Sequence: Connect to DB and then start the server
const PORT = process.env.PORT || 5000; 


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});