import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;
    // 1. Check if the brearer token in present in the request header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract the token from the header
            token = req.headers.authorization.split(' ')[1];
            // 3. Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // 4. Find the user by ID from the token and attach it to the req.user
            // We use .select('-password') to exclude the password field the data
            req.user = await User.findById(decoded.id).select('-password');
            console.log(`Token verified for user ID: ${decoded.id}`);
            // 5. Token is valid, allow the user to proceed to the next function
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    // 6. If no token is found, return an error
    if(!token) {
        console.warn('Access denied: No token provided');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

//Admin Middleware: Checks if the logged 
export const admin = (req, res, next) => {
    //req.user is set by the protect middleware(Bouncer) 
    if(req.user && req.user.role === 'admin') {
        console.log(`Admin access granted for user ID: ${req.user._id}`);
        next();
    }
    else {
        console.warn(`Access denied: User Id ${req.user ?. email} tried to access an admin route`)
        //  403 Forbidden means the server understands the request but refuses to authorize it
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
}