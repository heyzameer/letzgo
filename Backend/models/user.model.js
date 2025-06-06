const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 2 characters long'],
            maxlength: [20, 'First name must be at most 20 characters long'],
        },
        lastName: {
            type: String,
            required: false,
            minlength: [3, 'Last name must be at least 2 characters long'],
            maxlength: [20, 'Last name must be at most 20 characters long'],
        },
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
        default: null,
    },
});

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    })
    return token;
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;