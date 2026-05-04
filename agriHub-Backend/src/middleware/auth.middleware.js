const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const verifyToken = async (req, res, next) => {
    try {
        let token;
        
        // Check cookie
        if (req.headers.cookie) {
            const cookies = req.headers.cookie.split(';');
            const tokenCookie = cookies.find(c => c.trim().startsWith('token='));
            if (tokenCookie) {
                token = tokenCookie.split('=')[1];
            }
        }
        
        // Check Auth header fallback
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized, user not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
};

const isSeller = (req, res, next) => {
    if (req.user && req.user.role === 'seller') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden, requires seller role' });
    }
};

module.exports = { verifyToken, isSeller };
