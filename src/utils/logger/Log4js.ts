import log4js from 'log4js';
import { APP_NAME } from '../../constants';

// Configure Log4js with the configuration file
// Define your logging configuration
const config = {
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
         numBackups: 7, // Number of days to keep old log files
         compress: false,
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

log4js.configure(config);

// Create a logger instance
export const Logger = log4js.getLogger(APP_NAME);

// Optionally, export Log4js for use in other parts of your application
export default log4js;
