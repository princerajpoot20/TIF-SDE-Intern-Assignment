const errorHandler = (err, req, res, next) => {
    // Define a default status code and message
    let statusCode = 500;
    let message = "Internal Server Error";

    // Check if it's a known error and adjust the status code and message accordingly
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    } else if (err.name === "UnauthorizedError") {
        statusCode = 401;
        message = "Unauthorized Access";
    }

    console.error(err);

    res.status(statusCode).json({
        error: {
            status: statusCode,
            message: message
        }
    });
};

module.exports = errorHandler;
