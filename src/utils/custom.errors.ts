import { NextFunction, Request, Response } from "express";
import { Logger } from "./logger";

export default class CustomError extends Error {
   code: number;
   message: string;
   type: string;
   isOperational: true;
   error: any;

   constructor(message: string, code: number,  type?: string, error?: Error) {
      super(message);
      Object.setPrototypeOf(this, CustomError.prototype);
      this.code = code;
      this.isOperational = true;
      this.message = message;
      this.type = type || 'error';
      this.error = error || new Error;
      Error.captureStackTrace(this, this.constructor);
   }
}

export class BadRequestError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Bad Request', 400, 'BadRequestError',   error);
   }
}

export class UnAuthorizedError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Unauthorized', 401, 'UnAuthorizedError',  error);
   }
}

export class ForbiddenError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Forbidden', 403, 'ForbiddenError',  error);
   }
}

export class ServiceUnavailableError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Service Unavailable', 503, 'ServiceUnavailableError',  error);
   }
}

export class NotFoundError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Not Found', 404, 'NotFoundError',   error);
   }
}

export class InternalServerError extends CustomError {
   constructor(message?: string, error?: Error) {
      super(message || 'Internal Server Error', 500, 'InternalServerError',  error);
   }
}

export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
   Logger.error(err);

   // Default status code and error message
   let statusCode = err.code || 500;
   let errorMessage = err.message || 'Internal Server Error';

   // Send JSON response with error details
   if (process.env.APN_ENV === "development") {

      return res.status(statusCode).json({ success: false, message: errorMessage, ...err.error,  stack: err.stack, });

   } else {
      if (err.error.name === "CastError") errorMessage = `Invalid ${err.error.path}: ${ JSON.stringify(err.error.value)}.`
      
      if(err.error.code === 11000){
         const value = err.error.message.match(/(["'])(\\?.)*?\1/)[0];
          errorMessage = `field value:${value} aleady exist. please use another`;
      }

      if (err.error.name === "ValidationError"){
         const errors = Object.values(err.error.errors).map((el:any) => el.message);
         errorMessage = `Invalid input data. ${errors.join(". ")}`;
      }

     
      if (err && err.error.code === 'EBADCSRFTOKEN') {
         errorMessage ='Invalid CSRF token';
       }

      return res.status(statusCode).json({ success: false, message: errorMessage });

   }
   return res.status(statusCode).json({ success: false, message: errorMessage });


}