"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
var log4js_1 = __importDefault(require("log4js"));
var constants_1 = require("../../constants");
var node_1 = require("@logtail/node");
var jsonLayout = require('log4js-json-layout');
var config_1 = require("../../config");
log4js_1.default.addLayout('json', jsonLayout);
// Create a Logtail instance
var token = config_1.config.logtail.token;
var logtail = new node_1.Logtail(token); // Replace with your Logtail source token
// Create a custom appender for Logtail
function logtailAppender(layout, timezoneOffset) {
    return function (loggingEvent) {
        var logObject = {
            timestamp: loggingEvent.startTime,
            level: loggingEvent.level.levelStr,
            category: loggingEvent.categoryName,
            data: loggingEvent.data,
            context: loggingEvent.context,
        };
        logtail.log(JSON.stringify(logObject)); // Convert log object to JSON string
    };
}
function configure(config) {
    return logtailAppender(config.layout, config.timezoneOffset);
}
// Configure Log4js with the configuration file
// Define your logging configuration
var Log4config = {
    appenders: {
        coloredConsole: {
            type: 'console',
            level: 'info',
            layout: {
                // type: 'pattern',
                // pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}]%] %[[%p]%] %[[%f{1}:%l]%] - %m' // Include filename and line number
                type: "json",
                includeFileName: true,
                includeFunctionName: true,
            }
        },
        dailyFile: {
            type: 'dateFile',
            filename: 'logs/app.log',
            pattern: 'yyyy-MM-dd.log', // Include date in the file name
            numBackups: 7, // Number of days to keep old log files
            compress: false,
            layout: {
                // type: 'pattern',
                // pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] %f{1}:%l - %m' // Include filename and line number
                type: "json",
                includeFileName: true,
                includeFunctionName: true,
            }
        },
        logtail: {
            type: { configure: configure },
        }
    },
    categories: {
        default: { appenders: ['coloredConsole', 'dailyFile', 'logtail'], level: 'all', enableCallStack: true }
    },
    enableCallStack: true
};
log4js_1.default.configure(Log4config);
// Create a logger instance
exports.Log = log4js_1.default.getLogger(constants_1.APP_NAME);
// Optionally, export Log4js for use in other parts of your application
exports.default = log4js_1.default;
