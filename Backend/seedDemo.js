const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to DB');

        // Seed Demo User
        const demoUserEmail = 'user@demo.com';
        const existingUser = await userModel.findOne({ email: demoUserEmail });
        if (!existingUser) {
            const hashedPassword = await userModel.hashPassword('password123');
            await userModel.create({
                fullName: { firstName: 'Demo', lastName: 'User' },
                email: demoUserEmail,
                password: hashedPassword
            });
            console.log('Demo user created');
        } else {
            console.log('Demo user already exists');
        }

        // Seed Demo Captain
        const demoCaptainEmail = 'captain@demo.com';
        const existingCaptain = await captainModel.findOne({ email: demoCaptainEmail });
        if (!existingCaptain) {
            const hashedPassword = await captainModel.hashPassword('password123');
            await captainModel.create({
                fullname: { firstname: 'Demo', lastname: 'Captain' },
                email: demoCaptainEmail,
                password: hashedPassword,
                vehicle: {
                    color: 'Black',
                    plate: 'DEMO-123',
                    capacity: 4,
                    vehicleType: 'car'
                },
                status: 'active',
                isBlocked: false,
                totalRides: 124,
                totalEarnings: 15420,
                totalDistance: 840,
                todayEarnings: 1250,
                ridesCompleted: 12,
                onlineTime: '6h 45m',
                cancellationRate: '2%',
                acceptanceRate: '98%'
            });
            console.log('Demo captain created');
        } else {
            console.log('Demo captain already exists');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
