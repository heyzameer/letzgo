const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const rideModel = require('../models/ride.model');
const adminModel = require('../models/admin.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HTTP_STATUS = require('../constants/httpstatus');


// Admin login
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email }).select('+password');
    if (!admin) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ _id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(HTTP_STATUS.OK).json({ message: 'Login successful', admin, token });
};

// Admin logout
exports.logoutAdmin = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        return res.status(HTTP_STATUS.OK).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed' });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    const users = await userModel.find();
    res.status(HTTP_STATUS.OK).json(users);
};

// Get all captains with pagination
exports.getCaptains = async (req, res) => {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
        const total = await captainModel.countDocuments();
        const captains = await captainModel.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            captains,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch captains' });
    }
};

// Get all rides with pagination
exports.getRides = async (req, res) => {
    // Parse page and limit from query, set defaults
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
        const total = await rideModel.countDocuments();
        const rides = await rideModel.find()
            .populate('user')
            .populate('captain')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            rides,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch rides' });
    }
};

// Block user
exports.blockUser = async (req, res) => {
    const { userId } = req.body;
    await userModel.findByIdAndUpdate(userId, { isBlocked: true });
    res.status(HTTP_STATUS.OK).json({ message: 'User blocked' });
};

// Unblock user
exports.unblockUser = async (req, res) => {
    const { userId } = req.body;
    await userModel.findByIdAndUpdate(userId, { isBlocked: false });
    res.status(HTTP_STATUS.OK).json({ message: 'User unblocked' });
};

// Block captain
exports.blockCaptain = async (req, res) => {
    const { captainId } = req.body;
    await captainModel.findByIdAndUpdate(captainId, { isBlocked: true });
    const rideCount = await rideModel.countDocuments({captain:captainId, status: 'completed'});
    const rideCancled = await rideModel.countDocuments({captain:captainId, status: 'cancled'});
    if(rideCount<5 & rideCancled== 0){
       res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Captain cannot be blocked as they have completed less 3 rides ' });
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Captain blocked' });
};

// Unblock captain
exports.unblockCaptain = async (req, res) => {
    const { captainId } = req.body;
    await captainModel.findByIdAndUpdate(captainId, { isBlocked: false });
    res.status(HTTP_STATUS.OK).json({ message: 'Captain unblocked' });
};


// Create a new admin
exports.createAdmin = async (req, res) => {
    const { email, password } = req.body;
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Admin with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new adminModel({
        email,
        password: hashedPassword
    });
    await newAdmin.save();
    res.status(HTTP_STATUS.CREATED).json({ message: 'Admin created successfully', admin: newAdmin });
}

// Delete user
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'User not found' });
        }
        res.status(HTTP_STATUS.OK).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete user' });
    }
};

// Delete captain
exports.deleteCaptain = async (req, res) => {
    const { captainId } = req.params;
    try {
        const captain = await captainModel.findByIdAndDelete(captainId);
        if (!captain) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Captain not found' });
        }
        res.status(HTTP_STATUS.OK).json({ message: 'Captain deleted successfully' });
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete captain' });
    }
};