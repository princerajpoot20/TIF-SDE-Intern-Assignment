require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
    mongoUri: process.env.MONGODB_URI || 'mongodb+srv://prince:Password@cluster0.zetrrnm.mongodb.net/',
};

module.exports = config;
