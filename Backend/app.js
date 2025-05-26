const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const rideRoutes = require('./routes/rides.routes');
const cookieParser = require('cookie-parser');

const mapsRoutes = require('./routes/maps.routes');


app.use(cors());
connectToDb();
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/captains', captainRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/ride', rideRoutes);

module.exports = app;