const mongoose = require('mongoose');
const captainModel = require('./models/captain.model');
const dotenv = require('dotenv');
dotenv.config();

const updateDemo = async () => {
    await mongoose.connect(process.env.DB_CONNECT);
    await captainModel.findOneAndUpdate(
        { email: 'captain@demo.com' },
        {
            $set: {
                totalRides: 124,
                totalEarnings: 15420,
                totalDistance: 840,
                todayEarnings: 1250,
                ridesCompleted: 12,
                onlineTime: '6h 45m',
                cancellationRate: '2%',
                acceptanceRate: '98%',
                status: 'active',
                isBlocked: false
            }
        }
    );
    console.log('Demo captain updated');
    process.exit(0);
};

updateDemo();
