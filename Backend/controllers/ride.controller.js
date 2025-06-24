const rideService = require('../services/ride.services');
const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const HTTP_STATUS = require('../constants/httpstatus');
const MSG = require('../constants/commanMsgs'); // <-- Import commanMsgs

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        });
        // Send socketId in response if available
        const userSocketId = req.user.socketId || null;
        res.status(HTTP_STATUS.CREATED).json({ ...ride._doc, socketId: userSocketId });

        // console.log('Ride Created org :', ride);
        const pickupCoordinates = await mapService.getAdressCoordinates(pickup);
        const destinationCoordinates = await mapService.getAdressCoordinates(destination);
        console.log('Pickup Coordinates:', pickupCoordinates);
        console.log('Destination Coordinates:', destinationCoordinates);
        // console.log('Pickup Coordinates org:', pickupCoordinates);
        const captainsInTheRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 20, vehicleType);
        ride.otp = "";
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
        // Send destination coordinates with rideWithUser
        captainsInTheRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: {
                    ...rideWithUser.toObject(),
                    destinationLocation: destinationCoordinates
                }
            })
        })
    }
    catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.INTERNAL_SERVER_ERROR });
    }
}

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(HTTP_STATUS.OK).json(fare);
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.INTERNAL_SERVER_ERROR });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }

    const { rideId,ride } = req.body;
    try {
        const ride = await rideService.confirmRide({
            rideId,
            captain: req.captain
        });

        // Notify the user that the ride is confirmed
        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });

        // Notify all other captains (except the one who accepted) to close their notification
        if (ride.captain && ride._id) {
            const captainModel = require('../models/captain.model');
            // Find all captains who have a socketId and are not the accepting captain
            const otherCaptains = await captainModel.find({
                _id: { $ne: ride.captain._id },
                socketId: { $exists: true, $ne: null }
            });
            otherCaptains.forEach(captain => {
                sendMessageToSocketId(captain.socketId, {
                    event: 'ride-closed',
                    data: { rideId: ride._id }
                });
            });
        }

        // console.log("req recived and ewvent sent to user");

        return res.status(HTTP_STATUS.OK).json(ride);
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.INTERNAL_SERVER_ERROR });
    }
}



module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });


        // console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(HTTP_STATUS.OK).json(ride);
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.INTERNAL_SERVER_ERROR });
    }
}


module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        // Update captain's earnings, ride count, and total distance
        if (ride.captain && ride.fare) {
            const captainModel = require('../models/captain.model');
            await captainModel.findByIdAndUpdate(
                ride.captain._id,
                {
                    $inc: {
                        totalEarnings: ride.fare,
                        totalRides: 1,
                        totalDistance: ride.distance || 0
                    }
                }
            );
        }

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })

        return res.status(HTTP_STATUS.OK).json(ride);
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.INTERNAL_SERVER_ERROR });
    }
}

module.exports.cancelRideByCaptain = async (req, res) => {
    const { rideId } = req.body;
    try {
        const ride = await rideModel.findOne({ _id: rideId, status: 'accepted' }).populate('user');
        if (!ride) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.RIDE_NOT_FOUND_OR_NOT_ACCEPTED });
        }

        // Defensive: ensure user is populated and has socketId
        const userSocketId = ride.user && ride.user.socketId ? ride.user.socketId : null;

        // console.log('Ride found for cancellation:', ride._id, 'User socketId:', userSocketId);
        // Notify user that captain cancelled and trigger frontend to go back to confirm ride panel
        if (userSocketId) {
            sendMessageToSocketId(userSocketId, {
                event: 'ride-cancelled-by-captain',
                data: { rideId: ride._id }
            });
        } else {
            console.warn('User socketId not found for ride:', ride._id);
        }

        // Optionally, update ride status to cancelled
        await rideModel.findByIdAndUpdate(rideId, { status: rideModel.StatusEnum.CANCELLED });

        return res.status(HTTP_STATUS.OK).json({ message: MSG.RIDE_CANCELLED_BY_CAPTAIN });
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.INTERNAL_SERVER_ERROR });
    }
}

module.exports.cancelRideByUser = async (req, res) => {
    const { rideId } = req.body;
    try {
        const ride = await rideModel.findOne({ _id: rideId, status: { $in: ['pending', 'accepted'] } }).populate('captain');
        if (!ride) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MSG.RIDE_NOT_FOUND_OR_NOT_CANCELLABLE });
        }

        // Defensive: ensure captain is populated and has socketId
        const captainSocketId = ride.captain && ride.captain.socketId ? ride.captain.socketId : null;

        // Notify captain that user cancelled and trigger frontend to close notification
        if (captainSocketId) {
            sendMessageToSocketId(captainSocketId, {
                event: 'ride-cancelled-by-user',
                data: { rideId: ride._id }
            });
        }

        // Optionally, update ride status to cancelled
        await rideModel.findByIdAndUpdate(rideId, { status: rideModel.StatusEnum.CANCELLED });

        return res.status(HTTP_STATUS.OK).json({ message: MSG.RIDE_CANCELLED_BY_USER });
    } catch (err) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.INTERNAL_SERVER_ERROR });
    }
}

// Controller for user ride history with pagination
module.exports.getUserRideHistory = async (req, res) => {
    // Pagination params
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
        const rideModel = require('../models/ride.model');
        const total = await rideModel.countDocuments({ user: req.user._id });
        const rides = await rideModel
            .find({ user: req.user._id })
            .populate('captain')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(HTTP_STATUS.OK).json({
            rides,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.FAILED_TO_FETCH_USER_RIDE_HISTORY, error: err.message });
    }
}

// Controller for captain ride history with pagination
module.exports.getCaptainRideHistory = async (req, res) => {
    // Pagination params
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    try {
        const total = await require('../models/ride.model').countDocuments({ captain: req.captain._id });
        const rides = await require('../models/ride.model')
            .find({ captain: req.captain._id })
            .populate('user')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(HTTP_STATUS.OK).json({
            rides,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MSG.FAILED_TO_FETCH_CAPTAIN_RIDE_HISTORY, error: err.message });
    }
}