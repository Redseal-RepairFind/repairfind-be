import cron from 'node-cron';

// Schedule a cron job to run daily tasks
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Running daily tasks...');
        // await processDailyTasks();
        console.log('Daily tasks completed.');
    } catch (error) {
        console.error('Error running daily tasks:', error);
        // Handle error gracefully, e.g., send error notification
    }
});


// Schedule a cron job to run evry 5 seconds tasks
cron.schedule('*/5 * * * * *', async () => {
    try {
        console.log('Running 5 seconds tasks...');
        // await processDailyTasks();
        console.log('5 seconds tasks completed.');
    } catch (error) {
        console.error('Error running daily tasks:', error);
        // Handle error gracefully, e.g., send error notification
    }
});

// Other cron jobs can be scheduled similarly
// cron.schedule('* * * * *', () => { ... });

console.log('Cron jobs scheduled.');
