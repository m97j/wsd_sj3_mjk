class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // 400: Bad Request
  class BadRequestError extends CustomError {
    constructor(message = 'Bad Request') {
      super(message, 400);
    }
  }
  
  // 401: Unauthorized
  class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized') {
      super(message, 401);
    }
  }
  
  // 403: Forbidden
  class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden') {
      super(message, 403);
    }
  }
  
  // 404: Not Found
  class NotFoundError extends CustomError {
    constructor(message = 'Not Found') {
      super(message, 404);
    }
  }
  
  // 409: Conflict
  class ConflictError extends CustomError {
    constructor(message = 'Conflict') {
      super(message, 409);
    }
  }
  
  // 500: Internal Server Error
  class InternalServerError extends CustomError {
    constructor(message = 'Internal Server Error') {
      super(message, 500);
    }
  }
  
  module.exports = {
    CustomError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    InternalServerError,
  };
  