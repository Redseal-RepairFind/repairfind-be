import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { config } from '../../config';


let fileLogTransport :DailyRotateFile = new DailyRotateFile({
    level: 'info',
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d'
});




// Create a Logtail client
const token = config.logtail.token
const logtail = new Logtail(token);

const { combine, timestamp, json, errors, colorize, splat } = winston.format;

export const Log = winston.createLogger({
    level: 'debug',
    format: combine(
        errors({ stack: true }),
        timestamp(),
        json(),
    ),
    transports: [
        new winston.transports.Console(),
        fileLogTransport,
        new LogtailTransport(logtail, {level: 'debug'})
    ]
});



// Example usage
// Log.info('This is an info message');
// Log.error('This is an error message');