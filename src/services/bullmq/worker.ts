import { RedisOptions, Worker } from 'bullmq';
import { config } from '../../config';
import Redis from 'ioredis';
import { captureStripePayments } from './jobs/capture_stripe_payments';
import { Logger } from '../../utils/logger';
import { syncCertnApplications } from './jobs/sync_certn_applications';
import { expireJobs } from './jobs/expire_jobs';
import { jobDayScheduleCheck } from './jobs/jobday_schedule';
import { handleJobRefunds } from './jobs/job_refunds';
import { handleEscrowTransfer } from './jobs/escrow_transfer';

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
      case 'handleJobRefunds':
        await handleJobRefunds();
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
  });
};

const redisConfig = getRedisConfig();
const redisConnection = new Redis(redisConfig);

export const RepairFindQueueWorker = new Worker(
  config.redis.queueName,
  processJob,
  { connection: redisConnection }
);

setupWorkerEventListeners(RepairFindQueueWorker);
