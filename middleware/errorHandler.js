const errorHandler = (err, req, res, next ) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Unknown error occured";
    res.status(statusCode).json({
        "success": false,
        "message": message
    })
}

export default errorHandler;