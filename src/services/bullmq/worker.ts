import { RedisOptions, Worker } from 'bullmq';
import { config } from '../../config';
import Redis from 'ioredis';
import { captureStripePayments } from './jobs/capture_stripe_payments';
import { Logger } from '../logger';
import { syncCertnApplications } from './jobs/sync_certn_applications';
import { expireJobs } from './jobs/expire_jobs';
import { jobDayScheduleCheck } from './jobs/jobday_schedule';
import { handleJobRefunds } from './jobs/job_refunds';
import { handleEscrowTransfer } from './jobs/escrow_transfer';
import { sendEmail } from './jobs/send_email';
import { quizReminderCheck } from './jobs/training_reminder';

const getRedisConfig = (): RedisOptions => {
  const redisConfig: RedisOptions = {
    port: Number(config.redis.port),
    host: config.redis.host,
    password: config.redis.password,
    username: config.redis.username,
    maxRetriesPerRequest: null,
  };

  if (config.environment !== 'development') {
    redisConfig.tls = {};
  }

  return redisConfig;
};

const processJob = async (job:any): Promise<void> => {
  try {
    switch (job.name) {
      case 'CapturePayments':
        await captureStripePayments();
        break;
      case 'expireJobs':
        await expireJobs();
        break;
      case 'syncCertnApplications':
        await syncCertnApplications();
        break;
      case 'jobDayScheduleCheck':
        await jobDayScheduleCheck();
        break;
      case 'quizReminderCheck':
        await quizReminderCheck();
        break;
      case 'handleJobRefunds':
        await handleJobRefunds();
        break;
      case 'sendEmail':
        await sendEmail(job);
        break;
      case 'handleEscrowTransfer':
        await handleEscrowTransfer();
        break;
      default:
        Logger.warn(`Unknown job name: ${job.name}`);
    }
  } catch (error) {
    Logger.error(`Error processing job ${job.name}: ${error}`);
    throw error;
  }
};

const setupWorkerEventListeners = (worker: Worker): void => {
  worker.on('error', error => {
    Logger.error(`Job Errored: ${error}`);
  });

  worker.on('failed', job => {
    Logger.error(`Job Failed: ${job?.name} - ${job?.id}`);
  });

  worker.on('completed', job => {
    Logger.info(`Job Completed: ${job.name} - ${job.id} has completed!`);
    // const mailOptions = job.data;
    // await EmailService.createTransport().sendMail(mailOptions);
    // console.log(`Email sent successfully to ${mailOptions.to} with CC to ${mailOptions.cc}`);
  });
};

const redisConfig = getRedisConfig();
const redisConnection = new Redis(redisConfig);


const connection = new Redis({
  host: 'repairfindelasticcacheredisoss-hcr6d2.serverless.euw3.cache.amazonaws.com',
  port: 6379,
  // If your Redis instance is password protected, uncomment the line below and replace with your password
  // password: 'your_redis_password'
  maxRetriesPerRequest: null,
  connectTimeout: 10000,


  tls: {},
  // password: process.env.REDIS_AUTH,
  retryStrategy: (times) => Math.min(times * 30, 1000),

});


connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export const RepairFindQueueWorker = new Worker(
  config.redis.queueName,
  processJob,
  { connection: connection }
);

setupWorkerEventListeners(RepairFindQueueWorker);
