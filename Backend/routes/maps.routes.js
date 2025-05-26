const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const mapsController = require('../controllers/maps.controller.js');
const {query } = require('express-validator');

router.get('/get-coordinate',
    query('address').isLength({ min: 3 }).withMessage('Address is required'),
    auth.authUser, mapsController.getCoordinate
);

router.get('/get-distance-time',
    query('origin').isLength({ min: 3 }).withMessage('Origin is required'),
    query('destination').isLength({ min: 3 }).withMessage('Destination is required'),
    auth.authUser, mapsController.getDistanceAndTime);


router.get('/get-suggestions',
    query('input').isLength({ min: 3 }).withMessage('Input is required'),
    auth.authUser, mapsController.getAutoCompleteSuggestions
);
module.exports = router;