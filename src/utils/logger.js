const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    // Default logging level
    level: process.env.LOG_LEVEL || 'info',

    // Format of logs
    format: combine(
        colorize(),
        timestamp(),
        logFormat
    ),

    // Transport methods define where your logs will be stored
    transports: [
        // Console transport for development
        new winston.transports.Console(),

        // File transports for production
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],

    // Exception handling
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ]
});

// Stream for morgan logging middleware
logger.stream = {
    write: (message) => logger.info(message.trim())
};

module.exports = logger;
