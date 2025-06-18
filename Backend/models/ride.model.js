const mongoose = require('mongoose');


const RideStatusEnum = Object.freeze({
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
});

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: Object.values(RideStatusEnum),
        default: RideStatusEnum.PENDING,
    },

    duration: {
        type: Number,
    }, // seconds

    distance: {
        type: Number,
    }, // meters

    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },

    otp: {
        type: String,
        select: false,
        required: false,
    },
    rideDate: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

rideSchema.statics.StatusEnum = RideStatusEnum;

module.exports = mongoose.model('ride', rideSchema);