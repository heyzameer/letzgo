const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const rideModel = require('../models/ride.model');
const adminModel = require('../models/admin.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email }).select('+password');
    if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ _id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ message: 'Login successful', admin, token });
};

// Admin logout
exports.logoutAdmin = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed' });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    const users = await userModel.find();
    res.status(200).json(users);
};

// Get all captains
exports.getCaptains = async (req, res) => {
    const captains = await captainModel.find();
    res.status(200).json(captains);
};

// Get all rides
exports.getRides = async (req, res) => {
    const rides = await rideModel.find().populate('user').populate('captain');
    res.status(200).json(rides);
};

// Block user
exports.blockUser = async (req, res) => {
    const { userId } = req.body;
    await userModel.findByIdAndUpdate(userId, { isBlocked: true });
    res.status(200).json({ message: 'User blocked' });
};

// Unblock user
exports.unblockUser = async (req, res) => {
    const { userId } = req.body;
    await userModel.findByIdAndUpdate(userId, { isBlocked: false });
    res.status(200).json({ message: 'User unblocked' });
};

// Block captain
exports.blockCaptain = async (req, res) => {
    const { captainId } = req.body;
    await captainModel.findByIdAndUpdate(captainId, { isBlocked: true });
    res.status(200).json({ message: 'Captain blocked' });
};

// Unblock captain
exports.unblockCaptain = async (req, res) => {
    const { captainId } = req.body;
    await captainModel.findByIdAndUpdate(captainId, { isBlocked: false });
    res.status(200).json({ message: 'Captain unblocked' });
};


// Create a new admin
exports.createAdmin = async (req, res) => {
    const { email, password } = req.body;
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ message: 'Admin with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new adminModel({
        email,
        password: hashedPassword
    });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
}

// Delete user
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete user' });
    }
};

// Delete captain
exports.deleteCaptain = async (req, res) => {
    const { captainId } = req.params;
    try {
        const captain = await captainModel.findByIdAndDelete(captainId);
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        res.status(200).json({ message: 'Captain deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete captain' });
    }
};