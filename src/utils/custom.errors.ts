import { NextFunction, Request, Response } from "express";
import { Logger } from "./logger";

export default class CustomError extends Error {
   code: number;
   message: string;
   // annotate it with type true
   isOperational: true;

   constructor(message: string, code: number, name?: string, error?: Error) {
      super(message);
      Object.setPrototypeOf(this, CustomError.prototype);
      this.code = code;
      this.isOperational = true;
      this.message = message;
      this.name = name || 'error';

      if (error) {
          Logger.error(error);
      }
   }
}

export class BadRequestError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Bad Request', 400, 'BadRequestError', error);
   }
}

export class UnAuthorizedError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Unauthorized', 401, 'UnAuthorizedError', error);
   }
}

export class ForbiddenError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Forbidden', 403, 'ForbiddenError', error);
   }
}

export class ServiceUnavailableError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Service Unavailable', 503, 'ServiceUnavailableError', error);
   }
}

export class NotFoundError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Not Found', 404, 'NotFoundError', error);
   }
}

export class InternalServerError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Internal Server Error', 500, 'InternalServerError', error);
   }
}

export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
   Logger.error(err.message);

   // Default status code and error message
   let statusCode = err.code || 500;
   let errorMessage = err.message || 'Internal Server Error';

   if (err.name === 'InternalServerError') {
       statusCode = 500;
       errorMessage = 'Internal Server Error';
   }

   // Send JSON response with error details
   return res.status(statusCode).json({ success: false, message: errorMessage });
}
