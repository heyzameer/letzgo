const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

const captainService = require('../services/captain.service');
const { body, validationResult } = require('express-validator');

module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    return res.status(200).json({ message: 'Login successful', captain, token });

}

module.exports.getCaptainProfile = async (req, res, next) => {
    // Always include password as empty string for frontend compatibility
    const captainObj = req.captain.toObject ? req.captain.toObject() : req.captain;
    res.status(200).json({ captain: { ...captainObj, password: '' } });
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

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }

    try {
        const captain = await captainModel.findByIdAndUpdate(
            req.captain._id,
            { $set: updates },
            { new: true }
        );
        // Always include password as empty string for frontend compatibility
        const captainObj = captain.toObject ? captain.toObject() : captain;
        res.status(200).json({ captain: { ...captainObj, password: '' } });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile.' });
    }
}

module.exports.logoutCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blacklistTokenModel.create({token});
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
}