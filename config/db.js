import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        //we use process.env to grab the secret URL from thr .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    }
    catch(error){
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process with an error code
    }
};

export default connectDB;