const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./config/config');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');

console.log('Initializing Express...');
const app = express();

// Middleware
console.log('Applying middlewares...');
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('tiny', { stream: logger.stream }));

// Database Connection
console.log('Connecting to MongoDB...');
mongoose.connect(config.mongoUri)
.then(() => logger.info('MongoDB Connected'))
.catch(err => logger.error('MongoDB Connection Error:', err));
 
// Routes
console.log('Setting up routes...');
const authRoutes = require('./routes/authRoutes');
const communityRoutes = require('./routes/communityRoutes');
const memberRoutes = require('./routes/memberRoutes');
const roleRoutes = require('./routes/roleRoutes');


app.use('/v1/auth', authRoutes);
app.use('/v1/community', communityRoutes);
app.use('/v1/member', memberRoutes);
app.use('/v1/role', roleRoutes);

console.log('debug1');
// Error Handling Middleware
console.log('Configuring error handling middleware...');
app.use(errorHandler);

// Uncaught Exception Handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error.message);
    process.exit(1);
});

// Start Server
console.log('Starting server...');
app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
  console.log(`Server is up and running on port ${config.port}`);
});
