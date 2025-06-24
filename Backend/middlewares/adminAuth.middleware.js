const jwt = require('jsonwebtoken');
const adminModel = require('../models/admin.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const HTTP_STATUS = require('../constants/httpstatus');
const MSG = require('../constants/commanMsgs');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.NO_TOKEN_PROVIDED });

    // Check blacklist
    const blacklistedToken = await blacklistTokenModel.findOne({ token });
    if (blacklistedToken) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.UNAUTHORIZED });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(HTTP_STATUS.FORBIDDEN).json({ message: MSG.FORBIDDEN_INVALID_ROLE });
        }
        req.admin = await adminModel.findById(decoded._id);
        if (!req.admin) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.ADMIN_NOT_FOUND });
        }
        console.log('Admin authenticated:', req.admin.email);
        next();
    } catch (err) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.INVALID_TOKEN });
    }
};
