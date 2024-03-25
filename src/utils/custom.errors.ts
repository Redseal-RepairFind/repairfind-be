import { Logger } from "./logger";


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


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  // Log the error using your logger
//   Logger.error(err.message);

  // Send a generic error response to the client
  return res.status(500).json({ error: 'Internal Server Error' });
}