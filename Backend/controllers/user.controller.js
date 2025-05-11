const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');


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
        return res.status(200).json({ message: 'Login successful', user, token });
    }
    catch (error) {
        next(error);
    }
}
