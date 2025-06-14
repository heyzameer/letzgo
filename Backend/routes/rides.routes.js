const express = require('express');
const router = express.Router();
const {body, query} = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const Razorpay = require('razorpay');
const crypto = require('crypto');

router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
);

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 4, max: 4 }).withMessage('Invalid OTP'),
    rideController.startRide
)


router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)

router.post('/create-order',
    authMiddleware.authUser,
    body('amount').isNumeric().withMessage('Amount is required'),
    async (req, res) => {
        try {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            });

            const options = {
                amount: req.body.amount * 100, // amount in paise
                currency: "INR",
                receipt: `receipt_order_${Date.now()}`
            };

            const order = await razorpay.orders.create(options);
            res.status(200).json(order);
        } catch (err) {
            res.status(500).json({ message: 'Failed to create order', error: err.message });
        }
    }
);

router.post('/verify-payment',
    authMiddleware.authUser,
    async (req, res) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rideId } = req.body;
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest("hex");

            console.log("Expected Signature:", expectedSignature);
            console.log("Received Signature:", razorpay_signature);
            if (expectedSignature === razorpay_signature) {
                // Save payment info to ride
                const rideModel = require('../models/ride.model');
                await rideModel.findByIdAndUpdate(rideId, {
                    paymentID: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    signature: razorpay_signature
                });
                // Notify user and captain via socket.io (optional)
                res.status(200).json({ message: "Payment verified successfully" });
            } else {
                res.status(400).json({ message: "Invalid signature" });
            }
        } catch (err) {
            res.status(500).json({ message: 'Failed to verify payment', error: err.message });
        }
    }
);

module.exports = router;