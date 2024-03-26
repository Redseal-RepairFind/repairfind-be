"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var log4js_1 = __importDefault(require("log4js"));
var constants_1 = require("../../constants");
// Configure Log4js with the configuration file
// Define your logging configuration
var config = {
    appenders: {
        coloredConsole: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}]%] %[[%p]%] %[[%f{1}:%l]%] - %m' // Include filename and line number
            }
        },
        dailyFile: {
            type: 'dateFile',
            filename: 'logs/app.log',
            pattern: 'yyyy-MM-dd.log', // Include date in the file name
            daysToKeep: 7, // Number of days to keep old log files
            compress: true,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] %f{1}:%l - %m' // Include filename and line number
            }
        }
    },
    categories: {
        default: { appenders: ['coloredConsole', 'dailyFile'], level: 'all', enableCallStack: true }
    },
    enableCallStack: true
};
log4js_1.default.configure(config);
// Create a logger instance
exports.Logger = log4js_1.default.getLogger(constants_1.APP_NAME);
// Optionally, export Log4js for use in other parts of your application
exports.default = log4js_1.default;
