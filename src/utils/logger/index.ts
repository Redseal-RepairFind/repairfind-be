import { APP_NAME } from '../../constants';
import { LoggerFactory } from './LoggerFactory';
import { Log } from './winston';

const Logger = LoggerFactory.configure({
   id: APP_NAME,
   level: 'all'
});

export { Logger, Log };
