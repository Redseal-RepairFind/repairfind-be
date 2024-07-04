// cli.js

const { QueueService } = require("./dist/services/bullmq");
const dotenv  =  require("dotenv");


dotenv.config();

async function obliterateQueue() {
  try {
    const queueName = process.env.REDIS_QUEUE_NAME
    const queue = QueueService.getQueue(queueName);
    
    if (!queue) return;
    await queue.obliterate();
    console.log(`Queue ${queueName} cleared successfully.`);
    
  } catch (error) {
    console.error('Error clearing the queue:', error);
  } finally {
    process.exit(0); // Exit the process after completing the command
  }
}


// Parse CLI arguments and call the obliterateQueue function
const [, , command] = process.argv;
if (command === 'clear-queue') {
  obliterateQueue();
} else {
  console.log('Usage: node cli.js clear queue');
}
