const userModel = require('../models/user.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
