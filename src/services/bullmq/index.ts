import { Queue, RedisOptions } from 'bullmq';
import Redis from 'ioredis';
import { config } from '../../config';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Logger } from '../logger';

class JobQueue {
  private queue: Queue;
  private serverAdapter: ExpressAdapter;

  constructor() {
    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath('/queues');

    this.queue = this.createQueue();
    this.setupBullBoard();
  }

  private createQueue(): Queue {
    const redisConfig = this.getRedisConfig();
    const connection = new Redis(redisConfig);
    connection.on('connect', () => {
      Logger.info('Connected to Redis');
    });

    connection.on('error', (error: any) => {
      Logger.error('Error connecting to Redis:', error);
    });


    return new Queue(config.redis.queueName, { connection: connection });
  }

  private getRedisConfig(): RedisOptions {
    const redisConfig: RedisOptions = {
      port: Number(config.redis.port),
      host: config.redis.host,
      password: config.redis.password,
      username: config.redis.username,
      maxRetriesPerRequest: null,
    };

    if (config.environment !== 'development') {
      // redisConfig.tls = {
      //   rejectUnauthorized: false, // Accept self-signed certificates
      //   minVersion: 'TLSv1.2', // Set minimum TLS version
      // };
    }

    return redisConfig;
  }

  private setupBullBoard(): void {
    createBullBoard({
      queues: [new BullAdapter(this.queue)],
      serverAdapter: this.serverAdapter,
    });
  }

  public addJob(jobName: string, jobPayload: any, options: any): void {
    const jobOptions = {
      jobId: options.jobId,
      attempts: options.attempts ?? 2,
      priority: options.priority ?? 10,
      repeat: options.repeat ?? null,
      removeOnComplete: {
        age: 3600, // keep up to 1 hour
        count: 50, // keep up to 50 jobs
      },
      removeOnFail: {
        age: 3600, // keep up to 1 hour
        count: 50, // keep up to 50 jobs
      },
    };
    this.queue.add(jobName, jobPayload, jobOptions);
  }

  public attach(app: any): void {
    this.addCronJobs();
    app.use('/queues', this.serverAdapter.getRouter());
  }

  private addCronJobs(): void {

    //every: 600000 ms = 10 minutes, 86400000 ms = 24 hours, 7200000= 12hours
    // cron: '*/5 * * * * *' = Every 5 seconds, 
    // cron: 0 0 * * *'  = This cron expression triggers the job at midnight every day, 

    // this.addJob('CapturePayments', {}, { repeat: { every: 600000 } });
    this.addJob('handleJobRefunds', {}, { repeat: { every: 1000 } }); //14400000 every 4 hour
    this.addJob('syncCertnApplications', {}, { repeat: { every: 14400000 } }); // 4 hours
    this.addJob('expireJobs', {}, { repeat: { every: 7200000 } }); // 2 hours
    this.addJob('handleEscrowTransfer', {}, { repeat: { every: 3600000 } }); // 1 hour
    this.addJob('jobNotStartedScheduleCheck', {}, { repeat: { cron: '0 0 * * *', tz: 'America/Los_Angeles',} }); //midnight
    // this.addJob('jobDayScheduleCheck', {}, { repeat: { cron: '* * * * *' } }); //every minute
    this.addJob('jobDayScheduleCheck', {}, { repeat: { every: 3000000 } }); // 50 minutes (50 * 60 * 1000)
    this.addJob('quizReminderCheck', {}, { repeat: { cron: '0 0 */4 * *' } }); //4 days
  }

  public getQueue(queueName: string): Queue | undefined {
    return queueName === config.redis.queueName ? this.queue : undefined;
  }

  public async restartQueue(): Promise<void> {
    this.queue = this.createQueue();
    this.setupBullBoard();
    this.addCronJobs();

    console.log(`Queue ${config.redis.queueName} restarted successfully.`);

  }
}

// Export an instance of the JobQueue class
export const QueueService = new JobQueue();
