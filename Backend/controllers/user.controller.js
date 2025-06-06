const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const nodemailer = require('nodemailer');

// In-memory OTP store (for demo; use DB or cache in production)
const otpStore = {};

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    try {
        const {
            fullName: { firstName, lastName },
            email,
            password
        } = req.body;

        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({ firstName, lastName, email, password: hashedPassword });
        const token = await user.generateAuthToken();
        return res.status(201).json({ message: 'User created successfully', user, token });
    } catch (error) {
        next(error);
    }
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = await user.generateAuthToken();
        res.cookie('token', token);
        return res.status(200).json({ message: 'Login successful', user, token });
    }
    catch (error) {
        next(error);
    }
}


module.exports.getUserProfile = async (req, res, next) => {
    // If includePassword query param is true, select password (for demonstration only)
    console.log('includePassword query param:', req.query.includePassword);
    if (req.query.includePassword === 'true') {
        const user = await require('../models/user.model')
            .findById(req.user._id)
            .select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return password as plain text (not recommended for production)
        // WARNING: This is not possible if you only store hashed passwords.
        // You cannot retrieve the original password from the hash.
        // Instead, you can return a placeholder or an empty string.
        return res.status(200).json({ 
            user: {
                ...user.toObject(),
                password: '' // Cannot show real password, only possible to reset
            }
        });
    }
    res.status(200).json({ user: req.user });
}

module.exports.logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        // await userService.blacklistToken(token);
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
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

    // Only check for existing user if the email is different from the current user's email
    if (email && email !== req.user.email) {
        const isUserAlreadyExist = await userModel.findOne({ email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: 'Email already exists' });
        }
    }

    try {
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        );
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile.' });
    }
}

module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log('Sending OTP to:', email);
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in memory (for demo; use DB or cache for production)
    otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 min expiry

    console.log('Generated OTP:', otp);
    // Send OTP via email using nodemailer
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

    res.status(200).json({ message: 'OTP sent to your email.' });
};

module.exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const record = otpStore[email];
    if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await userModel.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    // Remove OTP after use
    delete otpStore[email];

    res.status(200).json({ message: 'Password updated successfully.' });
};