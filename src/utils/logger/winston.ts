import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';



let infoTransport :DailyRotateFile = new DailyRotateFile({
    level: 'info',
    filename: 'logs/access-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

let errorTransport:DailyRotateFile = new DailyRotateFile({
    level: 'error',
    filename: 'logs/error-error-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

infoTransport.on('error', error => {
    // log or handle errors here
});


errorTransport.on('error', error => {
    // log or handle errors here
});


export const Log = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // new winston.transports.Console(),
        errorTransport,
        infoTransport
    ]
});

