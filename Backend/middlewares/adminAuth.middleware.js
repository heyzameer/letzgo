const jwt = require('jsonwebtoken');
const adminModel = require('../models/admin.model');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    // Check blacklist
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Invalid role' });
        }
        req.admin = await adminModel.findById(decoded._id);
        if (!req.admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }
        console.log('Admin authenticated:', req.admin.email);
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
