"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
var winston_1 = __importDefault(require("winston"));
var winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
var infoTransport = new winston_daily_rotate_file_1.default({
    level: 'info',
    filename: 'logs/access-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});
var errorTransport = new winston_daily_rotate_file_1.default({
    level: 'error',
    filename: 'logs/error-error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});
infoTransport.on('error', function (error) {
    // log or handle errors here
});
errorTransport.on('error', function (error) {
    // log or handle errors here
});
exports.Log = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        // new winston.transports.Console(),
        errorTransport,
        infoTransport
    ]
});
