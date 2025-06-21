const rideService = require('../services/ride.services');
const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');
const HTTP_STATUS = require('../constants/httpstatus');

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
        // console.error('Error creating ride:', error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
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
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }

    const { rideId,ride } = req.body;
    // console.log(ride);

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
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
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
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
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
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

module.exports.cancelRideByCaptain = async (req, res) => {
    const { rideId } = req.body;
    try {
        // Find the ride and check if it exists and is accepted, and populate user to get socketId
        const ride = await rideModel.findOne({ _id: rideId, status: 'accepted' }).populate('user');
        if (!ride) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Ride not found or not in accepted state' });
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

        return res.status(HTTP_STATUS.OK).json({ message: 'Ride cancelled by captain and user notified.' });
    } catch (err) {
        // console.error('Error in cancelRideByCaptain:', err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

module.exports.cancelRideByUser = async (req, res) => {
    const { rideId } = req.body;
    // console.log('Received request to cancel ride by user:', rideId);
    try {
        // Find the ride and check if it exists and is pending or accepted, and populate captain to get socketId
        const ride = await rideModel.findOne({ _id: rideId, status: { $in: ['pending', 'accepted'] } }).populate('captain');
        if (!ride) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Ride not found or not in cancellable state' });
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

        return res.status(HTTP_STATUS.OK).json({ message: 'Ride cancelled by user and captain notified.' });
    } catch (err) {
        // console.error('Error in cancelRideByUser:', err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
}

// Controller for user ride history
module.exports.getUserRideHistory = async (req, res) => {
    try {
        const rides = await require('../models/ride.model')
            .find({ user: req.user._id })
            .populate('captain')
            .sort({ createdAt: -1 });
        res.status(HTTP_STATUS.OK).json(rides);
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch user ride history', error: err.message });
    }
}

// Controller for captain ride history
module.exports.getCaptainRideHistory = async (req, res) => {
    try {
        const rides = await require('../models/ride.model')
            .find({ captain: req.captain._id })
            .populate('user')
            .sort({ createdAt: -1 });
        res.status(HTTP_STATUS.OK).json(rides);
    } catch (err) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch captain ride history', error: err.message });
    }
}