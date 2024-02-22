import {EventEmitter} from 'events';

export const ProfileEvent: EventEmitter = new EventEmitter();


ProfileEvent.on('TestEvent', async function (params) {
    try {
        console.log(`Notifications sent to participants of challenge`);
    } catch (error) {
        console.error(`Error handling TestEvent event: ${error}`);
    }
});

