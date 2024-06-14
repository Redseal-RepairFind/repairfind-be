"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
var winston_1 = __importDefault(require("winston"));
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
exports.Log = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
    // new winston.ßtransports.Console(),
    // errorTransport,
    // infoTransport
    ]
});
// Example usage
// Log.info('This is an info message');
// Log.error('This is an error message');
