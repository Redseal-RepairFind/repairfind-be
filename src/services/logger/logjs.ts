import log4js from 'log4js';
import { APP_NAME } from '../../constants';
import { Logtail } from '@logtail/node';
const jsonLayout = require('log4js-json-layout')
import { config } from '../../config';

log4js.addLayout('json', jsonLayout);


// Create a Logtail instance
const token = config.logtail.token
const logtail = new Logtail(token); // Replace with your Logtail source token


// Create a custom appender for Logtail
function logtailAppender(layout:any, timezoneOffset:any) {
   return function(loggingEvent:any) {
     const logObject = {
       timestamp: loggingEvent.startTime,
       level: loggingEvent.level.levelStr,
       category: loggingEvent.categoryName,
       data: loggingEvent.data,
       context: loggingEvent.context,
     };
     logtail.log(JSON.stringify(logObject)); // Convert log object to JSON string
   };
 }
 



 function configure(config:any) {
   return logtailAppender(config.layout, config.timezoneOffset);
 }

 

// Configure Log4js with the configuration file
// Define your logging configuration
const Log4config = {
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
         type: {configure},
       }
   },
   categories: {
      default: { appenders: ['coloredConsole', 'dailyFile', 'logtail'], level: 'all', enableCallStack: true }
   },
   enableCallStack: true

};

log4js.configure(Log4config);

// Create a logger instance
export const Log = log4js.getLogger(APP_NAME);

// Optionally, export Log4js for use in other parts of your application
export default log4js;
