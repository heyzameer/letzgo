const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const nodemailer = require('nodemailer');
const HTTP_STATUS = require('../constants/httpstatus');
const MSG = require('../constants/commanMsgs'); // <-- Import commanMsgs

// In-memory OTP store (for demo; use DB or cache in production)
const otpStore = {};

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    try {
        const {
            fullName: { firstName, lastName },
            email,
            password
        } = req.body;

        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MSG.USER_ALREADY_EXISTS });
        }
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000, userData: { firstName, lastName, email, password } };

        // Send OTP via email using nodemailer (same config as forgot password)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'LetzGo Registration OTP',
            text: `Your OTP for registration is: ${otp}`
        });

        return res.status(HTTP_STATUS.OK).json({ message: MSG.OTP_SENT });
    } catch (error) {
        next(error);
    }
}

// New: OTP verification endpoint for registration
module.exports.verifyUserOtp = async (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MSG.OTP_INVALID });
    }
    // Proceed with registration
    const { firstName, lastName, email: userEmail, password } = record.userData;
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({ firstName, lastName, email: userEmail, password: hashedPassword });
    const token = await user.generateAuthToken();

    // Remove OTP after use
    delete otpStore[email];

    return res.status(HTTP_STATUS.CREATED).json({ message: MSG.USER_CREATED, user, token });
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.INVALID_EMAIL_OR_PASSWORD });
        }
        if (user.isBlocked) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({ message: MSG.USER_BLOCKED });
        }
        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.INVALID_EMAIL_OR_PASSWORD });
        }
        const token = await user.generateAuthToken();
        res.cookie('token', token);
        return res.status(HTTP_STATUS.OK).json({ message: MSG.LOGIN_SUCCESS, user, token });
    }
    catch (error) {
        next(error);
    }
}


module.exports.getUserProfile = async (req, res, next) => {
    // If includePassword query param is true, select password (for demonstration only)
    // console.log('includePassword query param:', req.query.includePassword);
    if (req.query.includePassword === 'true') {
        const user = await require('../models/user.model')
            .findById(req.user._id)
            .select('+password');
        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.USER_NOT_FOUND });
        }
        return res.status(HTTP_STATUS.OK).json({ 
            user: {
                ...user.toObject(),
                password: ''
            }
        });
    }
    res.status(HTTP_STATUS.OK).json({ user: req.user });
}

module.exports.logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        return res.status(HTTP_STATUS.OK).json({ message: MSG.LOGOUT_SUCCESS });
    } catch (error) {
        next(error);
    }
}

module.exports.updateUserProfile = async (req, res, next) => {
    const { fullName, email } = req.body;
    const updates = {};
    if (fullName) {
        if (fullName.firstName) updates['fullName.firstName'] = fullName.firstName;
        if (fullName.lastName) updates['fullName.lastName'] = fullName.lastName;
    }
    if (email) updates.email = email;

    if (email && email !== req.user.email) {
        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MSG.EMAIL_ALREADY_EXISTS });
        }
    }

    try {
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        );
        res.status(HTTP_STATUS.OK).json({ user });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.FAILED_TO_UPDATE_PROFILE });
    }
}

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.USER_NOT_FOUND });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'User Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`
    });

    res.status(HTTP_STATUS.OK).json({ message: MSG.OTP_SENT });
};

module.exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const record = otpStore[email];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MSG.OTP_INVALID });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.USER_NOT_FOUND });
    }

    const hashedPassword = await userModel.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    delete otpStore[email];

    res.status(HTTP_STATUS.OK).json({ message: MSG.PASSWORD_UPDATED });
};