const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const HTTP_STATUS = require('../constants/httpstatus');
const MSG = require('../constants/commanMsgs');

// Role-based authentication middleware
exports.authRole = (role) => async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.NO_TOKEN_PROVIDED });

    // Blacklist check (optional, but recommended)
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.UNAUTHORIZED });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== role) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({ message: MSG.FORBIDDEN_INVALID_ROLE });
        }
        if (role === 'user') {
            const user = await userModel.findById(decoded._id);
            if (!user) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.USER_NOT_FOUND });
            if (user.isBlocked) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({ message: MSG.USER_BLOCKED });
            }
            req.user = user;
        } else if (role === 'captain') {
            const captain = await captainModel.findById(decoded._id);
            if (!captain) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.CAPTAIN_NOT_FOUND });
            if (captain.isBlocked) {
                return res.status(HTTP_STATUS.FORBIDDEN).json({ message: MSG.CAPTAIN_BLOCKED });
            }
            req.captain = captain;
        }
        next();
    } catch (err) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.INVALID_TOKEN });
    }
};

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token||req.header('Authorization')?.replace('Bearer ', '');

    // console.log(token);
    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({ error: MSG.PLEASE_AUTHENTICATE });
    }

    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({ error: MSG.UNAUTHORIZED });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ _id: decoded._id});
      
            
        req.user = user;

            // req.token = token;
            return next();
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).send({ error: MSG.PLEASE_AUTHENTICATE });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token||req.header('Authorization')?.replace('Bearer ', '');

    // console.log(token);
    if (!token) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({ error: MSG.PLEASE_AUTHENTICATE });
    }

    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).send({ error: MSG.UNAUTHORIZED });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findOne({ _id: decoded._id});
      
        
        req.captain = captain;
        // console.log("captain authenticated", captain);

        // req.token = token;
        return next();
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).send({ error: MSG.PLEASE_AUTHENTICATE });
    }
}