import { Log, Logger } from "./logger";


import { Request, Response, NextFunction } from 'express';
// import { Logger } from './logger';


export default class CustomError extends Error {
    code: number;
    message: string;
    // annotate it with type true
    isOperational: true;
 
    constructor(message: string, code: number, name?: string) {
       super(message);
       Object.setPrototypeOf(this, CustomError.prototype);
       this.code = code;
       this.isOperational = true;
       this.message = message;
       this.name = name || 'error';


    }
 }
 
 export class BadRequestError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'BadRequestError', 400);
       this.name = 'BadRequestError';
    }
 }
 
 export class UnAuthorizedError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'UnAuthorized', 401);
       this.name = 'UnAuthorizedError';
    }
 }
 
 export class ForbiddenError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'Forbidden', 403);
       this.name = 'ForbiddenError';
    }
 }
 
 export class ServiceUnavailableError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'Service Unavailable', 503);
       this.name = 'ServiceUnavailableError';
    }
 }
 
 export class NotFoundError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'NotFoundError', 404);
       this.name = 'NotFoundError';
    }
 }

 export class InternalServerError extends CustomError {
    constructor(msg?: string) {
       super(msg || 'InternalServerError', 500);
       this.name = 'InternalServerError';
    }
 }


 export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {


   Logger.error(err.message);
 
   // Default status code and error message
   let statusCode = err.code || 500;
   let errorMessage = err.message || 'Internal Server Error';
 

   if(err.name == 'InternalServerError'){
      statusCode = 500
      errorMessage = 'Internal Server Error';
   }

   if(err.name == 'BadRequestError'){
      statusCode = 400
      errorMessage = 'BadRequest  Error';
   }
 
   // Send JSON response with error details
   return res.status(statusCode).json({success:false, message: errorMessage });
 }