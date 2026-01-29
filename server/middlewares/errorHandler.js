const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    const titles = {
        400: "Validation failed", 
        401: "Unauthorized", 
        403: "Forbidden", 
        404: "Not Found", 
        500: "Server Error"
    }; 

    const title = titles[statusCode] || "Unexpected Error";

    console.error(err);

    res.status(statusCode).json({
        title, 
        message: err.message || "Something went wrong", 
        stackTrace: err.stack,
    });
};

export default errorHandler;