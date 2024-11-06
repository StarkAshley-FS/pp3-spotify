const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const jwtAuth = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ spotifyId: decoded.id });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;

        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: "Authentication failed", error: error.message });
    }
};

module.exports = jwtAuth;