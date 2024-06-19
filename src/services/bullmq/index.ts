import { Queue, RedisOptions } from 'bullmq';
import Redis from 'ioredis';
import { config } from '../../config';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

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
    const redisConnection = new Redis(redisConfig);
    return new Queue(config.redis.queueName, { connection: redisConnection });
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
      redisConfig.tls = {};
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

    this.addJob('CapturePayments', {}, { repeat: { every: 600000 }, jobId: 'CapturePayments' });
    this.addJob('handleJobRefunds', {}, { repeat: { every: 600000 } });
    this.addJob('syncCertnApplications', {}, { repeat: { every: 600000 }, jobId: 'syncCertnApplications' });
    this.addJob('expireJobs', {}, { repeat: { every: 7200000 } });
    this.addJob('handleEscrowTransfer', {}, { repeat: { every: 60000 } });
    this.addJob('jobDayScheduleCheck', {}, { repeat: { cron: '0 0 * * *', tz: 'Europe/Berlin',} });
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
