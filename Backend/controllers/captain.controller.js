const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const HTTP_STATUS = require('../constants/httpstatus');
const MSG = require('../constants/commanMsgs'); // <-- Import commanMsgs

const otpStore = {}; // In-memory OTP store for demo

module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MSG.CAPTAIN_ALREADY_EXIST });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = {
        otp,
        expires: Date.now() + 10 * 60 * 1000,
        captainData: { fullname, email, password, vehicle }
    };

    // Send OTP via email using nodemailer (same config as forgot password)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'LetzGo Captain Registration OTP',
            text: `Your OTP for registration is: ${otp}`
        });
    } catch (mailError) {
        console.error('Mail delivery failed, logging OTP to console instead:', mailError.message);
        console.log('-----------------------------------------');
        console.log(`CAPTAIN REGISTRATION OTP FOR ${email}: ${otp}`);
        console.log('-----------------------------------------');
    }
    console.log(`OTP status logged for ${email}`);

    return res.status(HTTP_STATUS.OK).json({ message: MSG.OTP_SENT });
}

// New: OTP verification endpoint for captain registration
module.exports.verifyCaptainOtp = async (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MSG.OTP_INVALID });
    }
    // Proceed with registration
    const { fullname, email: captainEmail, password, vehicle } = record.captainData;
    const hashedPassword = await captainModel.hashPassword(password);
    const captain = await require('../services/captain.service').createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email: captainEmail,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });
    const token = captain.generateAuthToken();

    // Remove OTP after use
    delete otpStore[email];

    return res.status(HTTP_STATUS.CREATED).json({ message: MSG.CAPTAIN_CREATED, captain, token });
}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.CAPTAIN_NOT_FOUND });
    }

    if (captain.isBlocked) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ message: MSG.CAPTAIN_BLOCKED });
    }

    // Check if password is correct
    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MSG.INVALID_EMAIL_OR_PASSWORD });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    return res.status(HTTP_STATUS.OK).json({ message: MSG.LOGIN_SUCCESS, captain, token });

}

module.exports.getCaptainProfile = async (req, res, next) => {
    const captainObj = req.captain.toObject ? req.captain.toObject() : req.captain;
    res.status(HTTP_STATUS.OK).json({ captain: { ...captainObj, password: '' } });
}

module.exports.updateStatus = async (req, res, next) => {
    const { status } = req.body;
    if (![ 'active', 'inactive' ].includes(status)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MSG.INVALID_STATUS });
    }

    try {
        const captain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            { $set: { status } },
            { new: true }
        );
        res.status(HTTP_STATUS.OK).json({ status: captain.status, message: 'Status updated' });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update status' });
    }
}

module.exports.updateCaptainProfile = async (req, res, next) => {
    const { fullname, email, vehicle } = req.body;
    const updates = {};
    if (fullname) {
        if (fullname.firstname) updates['fullname.firstname'] = fullname.firstname;
        if (fullname.lastname) updates['fullname.lastname'] = fullname.lastname;
    }
    if (email) updates.email = email;
    if (vehicle) {
        if (vehicle.color) updates['vehicle.color'] = vehicle.color;
        if (vehicle.plate) updates['vehicle.plate'] = vehicle.plate;
        if (vehicle.capacity) updates['vehicle.capacity'] = vehicle.capacity;
        if (vehicle.vehicleType) updates['vehicle.vehicleType'] = vehicle.vehicleType;
    }

    // Only check for existing captain if the email is different from the current captain's email
    if (email && email !== req.captain.email) {
        const isCaptainAlreadyExist = await captainModel.findOne({ email });
        if (isCaptainAlreadyExist) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MSG.CAPTAIN_ALREADY_EXIST });
        }
    }

    try {
        const captain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            { $set: updates },
            { new: true }
        );
        // Always include password as empty string for frontend compatibility
        const captainObj = captain.toObject ? captain.toObject() : captain;
        res.status(HTTP_STATUS.OK).json({ captain: { ...captainObj, password: '' }, message: MSG.PROFILE_UPDATED });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.FAILED_TO_UPDATE_PROFILE });
    }
}

module.exports.logoutCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        return res.status(HTTP_STATUS.OK).json({ message: MSG.LOGOUT_SUCCESS });
    } catch (error) {
        next(error);
    }
}

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const captain = await captainModel.findOne({ email });
    if (!captain) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.CAPTAIN_NOT_FOUND });
    }
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Save OTP in memory (for demo; use DB or cache in production)
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 min expiry

    // Send OTP via email using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Captain Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        });
    } catch (mailError) {
        console.error('Mail delivery failed, logging OTP to console instead:', mailError.message);
        console.log('-----------------------------------------');
        console.log(`CAPTAIN FORGOT PASSWORD OTP FOR ${email}: ${otp}`);
        console.log('-----------------------------------------');
    }

    res.status(HTTP_STATUS.OK).json({ message: MSG.OTP_SENT });
};

module.exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const record = otpStore[email];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MSG.OTP_INVALID });
    }

    const captain = await captainModel.findOne({ email });
    if (!captain) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.CAPTAIN_NOT_FOUND });
    }

    const hashedPassword = await captainModel.hashPassword(newPassword);
    captain.password = hashedPassword;
    await captain.save();

    // Remove OTP after use
    delete otpStore[email];

    res.status(HTTP_STATUS.OK).json({ message: MSG.PASSWORD_UPDATED });
};