const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const captainController = require('../controllers/captain.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'moto', 'auto' ]).withMessage('Invalid vehicle type')
],
    captainController.registerCaptain
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], captainController.loginCaptain);

router.get('/profile',auth.authCaptain, captainController.getCaptainProfile);

router.put('/profile',
    auth.authCaptain,
    [
        body('fullname.firstname').optional().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
        body('fullname.lastname').optional().isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('vehicle.color').optional().isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
        body('vehicle.plate').optional().isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
        body('vehicle.capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
        body('vehicle.vehicleType').optional().isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')
    ],
    captainController.updateCaptainProfile
);

router.get('/logout', auth.authCaptain, captainController.logoutCaptain);

router.post('/forgot-password',
    body('email').isEmail().withMessage('Invalid Email'),
    captainController.forgotPassword
);

router.post('/reset-password',
    body('email').isEmail().withMessage('Invalid Email'),
    body('otp').isLength({ min: 4, max: 8 }).withMessage('Invalid OTP'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    captainController.resetPassword
);

module.exports = router;