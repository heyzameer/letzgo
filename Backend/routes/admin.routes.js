const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middlewares/adminAuth.middleware');

// Admin login
router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], adminController.loginAdmin);

// Admin logout
router.post('/logout', adminAuth, adminController.logoutAdmin);

// Get all users
router.get('/users', adminAuth, adminController.getUsers);

// Get all captains
router.get('/captains', adminAuth, adminController.getCaptains);

// Get all rides
router.get('/rides', adminAuth, adminController.getRides);

// Block/unblock user
router.post('/block-user', adminAuth, adminController.blockUser);
router.post('/unblock-user', adminAuth, adminController.unblockUser);

// Block/unblock captain
router.post('/block-captain', adminAuth, adminController.blockCaptain);
router.post('/unblock-captain', adminAuth, adminController.unblockCaptain);

// Delete user
router.delete('/delete-user/:userId', adminAuth, adminController.deleteUser);

// Delete captain
router.delete('/delete-captain/:captainId', adminAuth, adminController.deleteCaptain);

//route to create a new admin
router.post('/create-admin', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], adminController.createAdmin);




module.exports = router;
