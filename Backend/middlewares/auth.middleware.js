const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const bcrypt = require('bcrypt');

// Role-based authentication middleware
exports.authRole = (role) => async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    // Blacklist check (optional, but recommended)
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Invalid role' });
        }
        if (role === 'user') {
            const user = await userModel.findById(decoded._id);
            if (!user) return res.status(401).json({ message: 'User not found' });
            if (user.isBlocked) {
                return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
            }
            req.user = user;
        } else if (role === 'captain') {
            const captain = await captainModel.findById(decoded._id);
            if (!captain) return res.status(401).json({ message: 'Captain not found' });
            if (captain.isBlocked) {
                return res.status(403).json({ message: 'Your profile may not be verified or has been blocked. Please contact support.' });
            }
            req.captain = captain;
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports.authUser = async (req, res, next) => {
  
        const token = req.cookies.token||req.header('Authorization')?.replace('Bearer ', '');

        // console.log(token);
        if (!token) {
            return res.status(401).send({ error: 'Please authenticate.' });
        }

        const blacklistedToken = await blacklistTokenModel.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).send({ error: 'Unautherized' });
        }
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findOne({ _id: decoded._id});
          
            
            req.user = user;

            // req.token = token;
            return next();
        }catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}


module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token||req.header('Authorization')?.replace('Bearer ', '');

    // console.log(token);
    if (!token) {
        return res.status(401).send({ error: 'Please authenticate.' });
    }

    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(401).send({ error: 'Unautherized' });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findOne({ _id: decoded._id});
      
        
        req.captain = captain;
        // console.log("captain authenticated", captain);

        // req.token = token;
        return next();
    }catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
}
}