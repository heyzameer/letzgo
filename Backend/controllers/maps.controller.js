const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapsService.getAdressCoordinates(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        res.status(404).json({ message: 'Coordinates not found' });
    }
    };

module.exports.getDistanceAndTime = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;
    try {
        const distanceAndTime = await mapsService.getDistanceAndTime(origin, destination);
        res.status(200).json(distanceAndTime);
    } catch (error) {
        console.error('Error fetching distance and time:', error);
        res.status(404).json({ message: 'Distance and time not found' });
        }
    }