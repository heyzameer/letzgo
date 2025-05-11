const userModel = require('../models/user.model');

module.exports.createUser = async ({ firstName, lastName, email, password }) => {
    // Check if user already exists
    if (!firstName || !email || !password) {
        throw new Error('All fields are required');
    }
    const user = await userModel.create({
        fullName: {
            firstName: firstName,
            lastName: lastName
        },
        email,
        password
    });
    return user;
};
