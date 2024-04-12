// cli.js

const { QueueService } = require("./src/services/bullmq");

// Example command to obliterate a queue
async function obliterateQueue(queueName) {
  try {
    // Get the queue instance from the QueueService
    const queue = QueueService.getQueue(queueName);

    // Perform the obliteration
    if (!queue) return;
    await queue.obliterate();
    console.log(`Queue ${queueName} obliterated successfully.`);
  } catch (error) {
    console.error('Error obliterating the queue:', error);
  }
}

// Parse CLI arguments and call the obliterateQueue function
const [, , command, queueName] = process.argv;
if (command === 'obliterate' && queueName) {
  obliterateQueue(queueName);
} else {
  console.log('Usage: node cli.js obliterate <queueName>');
}
