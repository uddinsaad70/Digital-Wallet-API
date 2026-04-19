// 1. import the installed tools
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// 2. create an instance of express
const app = express();

// 3. Essential middlewares
// This line is crucial! It tells Express to parse incoming JSON data in request bodies.
app.use(express.json());

//4. Connect to MongoDB using Mongoose
const connectDB = async () => {
    try {
        //we use process.env to grab the secret URL from thr .env file
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with an error code
    }
};

//5. Basic route to test if the server is running
app.get('/', (req, res) => {
    res.send('Digital Wallet API is running !');
});

//6. Boot Sequence: Connect to DB and then start the server
const PORT = process.env.PORT || 5000; 
conntectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});