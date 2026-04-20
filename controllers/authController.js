import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import bcrypt from 'bcryptjs';

const registerUser = async (req, res) => {
    try {
        // 1. Extract user data from request body
        const { name, email, password } = req.body;
        // 2. Check if the user exists already in the database
        const userExists = await User.findOne({ email });
        if(userExists) {
            console.warn(`Registration failed: Email ${email} already in use`);
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        // 3. Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //4. Create and save the new user to the database
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        console.log(`New user created successfully. User ID: ${newUser._id}, Email: ${newUser.email}`);

        // 5. Automatically create a zero balance wallet for the new user
        await Wallet.create({
            user : newUser._id,
            balance: 0
        });

        res.status(201).json({
            message: 'User registered successfully',
            user_id: newUser._id
        });

    } catch (error) {
        console.error(`Error during user registration: ${error.message}`);
        res.status(500).json({ message: 'Server error during user registration' });
    }
};

export { registerUser };