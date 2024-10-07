const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
    // console.log(req.header());
    const token = req.header('Authorization').split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;