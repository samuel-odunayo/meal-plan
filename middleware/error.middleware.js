const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(err.errors).map(error => ({
          field: error.path,
          message: error.message
        }))
      });
    }
  
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate Error',
        message: 'A resource with that unique identifier already exists'
      });
    }
  
    // Handle cast errors (invalid IDs)
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided ID is not valid'
      });
    }
  
    // Default error
    return res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message
    });
  };
  
  module.exports = errorMiddleware;