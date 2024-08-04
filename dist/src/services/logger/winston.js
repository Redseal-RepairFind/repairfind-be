"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
var winston_1 = __importDefault(require("winston"));
var winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
var node_1 = require("@logtail/node");
var winston_2 = require("@logtail/winston");
var config_1 = require("../../config");
var fileLogTransport = new winston_daily_rotate_file_1.default({
    level: 'info',
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d'
});
// Create a Logtail client
var token = config_1.config.logtail.token;
var logtail = new node_1.Logtail(token);
var _a = winston_1.default.format, combine = _a.combine, timestamp = _a.timestamp, json = _a.json, errors = _a.errors, colorize = _a.colorize, splat = _a.splat;
exports.Log = winston_1.default.createLogger({
    level: 'debug',
    format: combine(errors({ stack: true }), timestamp(), json()),
    transports: [
        new winston_1.default.transports.Console(),
        fileLogTransport,
        new winston_2.LogtailTransport(logtail, { level: 'debug' })
    ]
});
// Example usage
// Log.info('This is an info message');
// Log.error('This is an error message');
