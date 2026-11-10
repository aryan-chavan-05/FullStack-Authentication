const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  console.error(`[${req.method}] ${req.originalUrl} - Error: ${err.message}`);

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err.statusCode = 400;
    err.message = message;
  }

  if (err.name === "JsonWebTokenError") {
    err.message = "JSON Web Token is invalid. Try again.";
    err.statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    err.message = "JSON Web Token is expired. Try again.";
    err.statusCode = 401;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

export default errorMiddleware;[[]]