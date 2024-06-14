import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';



// let infoTransport :DailyRotateFile = new DailyRotateFile({
//     level: 'info',
//     filename: 'logs/access-%DATE%.log',
//     datePattern: 'YYYY-MM-DD',
//     zippedArchive: false,
//     maxSize: '20m',
//     maxFiles: '14d'
// });

// let errorTransport:DailyRotateFile = new DailyRotateFile({
//     level: 'error',
//     filename: 'logs/error-error-%DATE%.log',
//     datePattern: 'YYYY-MM-DD',
//     zippedArchive: false,
//     maxSize: '20m',
//     maxFiles: '14d',
// });


export const Log = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // new winston.ßtransports.Console(),
        // errorTransport,
        // infoTransport
    ]
});



// Example usage
// Log.info('This is an info message');
// Log.error('This is an error message');