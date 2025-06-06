const express = require('express');
const router = express.Router();

const {body}= require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
    body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullName.lastName').isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],userController.registerUser);


router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.loginUser);

router.get('/profile',
    authMiddleware.authUser,
    userController.getUserProfile
);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

router.put('/profile',
    authMiddleware.authUser,
    [
        body('fullName.firstName').optional().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
        body('fullName.lastName').optional().isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    userController.updateUserProfile
);

router.post('/forgot-password',
    body('email').isEmail().withMessage('Invalid email format'),
    userController.forgotPassword
);

router.post('/reset-password',
    body('email').isEmail().withMessage('Invalid email format'),
    body('otp').isLength({ min: 4, max: 8 }).withMessage('Invalid OTP'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    userController.resetPassword
);

module.exports = router;