import {EventEmitter} from 'events';
export const eventEmitter: EventEmitter = new EventEmitter();

export * from './auth.events'
export * from './booking.events'
export * from './conversation.events'
export * from './job.events'
export * from './profile.events'