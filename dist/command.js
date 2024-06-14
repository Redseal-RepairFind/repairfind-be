// cli.js

const { QueueService } = require("./dist/services/bullmq");

// Example command to obliterate a queue
async function obliterateQueue(queueName) {
  try {
    const queue = QueueService.getQueue(queueName);
    
    if (!queue) return;
    await queue.obliterate();
    console.log(`Queue ${queueName} obliterated successfully.`);
    
  } catch (error) {
    console.error('Error obliterating the queue:', error);
  } finally {
    process.exit(0); // Exit the process after completing the command
  }
}


// Parse CLI arguments and call the obliterateQueue function
const [, , command, queueName] = process.argv;
if (command === 'obliterate' && queueName) {
  obliterateQueue(queueName);
} else {
  console.log('Usage: node cli.js obliterate <queueName>');
}
