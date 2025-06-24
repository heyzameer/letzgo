const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const HTTP_STATUS = require('../constants/httpstatus');
const MSG = require('../constants/commanMsgs'); // Import commanMsgs

module.exports.getCoordinate = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapsService.getAdressCoordinates(address);
        res.status(HTTP_STATUS.OK).json(coordinates);
    } catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.COORDINATES_NOT_FOUND });
    }
};

module.exports.getDistanceAndTime = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    const { origin, destination } = req.query;
    try {
        const distanceAndTime = await mapsService.getDistanceAndTime(origin, destination);
        res.status(HTTP_STATUS.OK).json(distanceAndTime);
    } catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.DISTANCE_TIME_NOT_FOUND });
    }
};

module.exports.getAutoCompleteSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }

    const { input } = req.query;

    try {
        const suggestions = await mapsService.getAutoCompleteSuggestions(input);
        res.status(HTTP_STATUS.OK).json(suggestions);
    } catch (error) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.SUGGESTIONS_NOT_FOUND });
    }
};