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
    const connection = new Redis(redisConfig);

  //   const connection = new Redis({
  //     host: 'repairfindrediscluster.hcr6d2.ng.0001.euw3.cache.amazonaws.com',
  //     port: 6379,
  //     maxRetriesPerRequest: null,
  //     connectTimeout: 10000,
  // });
  

  // const clusterOptions = {
  //   // enableReadyCheck: true,
  //   // retryDelayOnClusterDown: 300,
  //   // retryDelayOnFailover: 1000,
  //   // retryDelayOnTryAgain: 3000,
  //   // slotsRefreshTimeout: 200000000000000,
  //   // clusterRetryStrategy: (times:any) => Math.min(times * 1000, 10000),
  //   // dnsLookup: (address: any, callback: any) => callback(null, address),
  //   // scaleReads: 'slave',
  
  //   // showFriendlyErrorStack: true,
  //   redisOptions: {
  //       // keyPrefix: 'config.queue.prefix',
  //       autoResubscribe: true,
  //       autoResendUnfulfilledCommands: true,
  //       // tls: true 
  //   }
  // }
  
  
  // const connection = new Redis.Cluster([{ host: 'repairfindrediscluster.hcr6d2.ng.0001.euw3.cache.amazonaws.com:6379', port: 6379}], clusterOptions);
  
  
  
  
  connection.on('connect', () => {
    console.log('Connected to Redis');
  });
  
  connection.on('error', (error: any) => {
    console.error('Error connecting to Redis:', error);
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

    this.addJob('CapturePayments', {}, { repeat: { every: 600000 } });
    this.addJob('handleJobRefunds', {}, { repeat: { every: 600000 } });
    this.addJob('syncCertnApplications', {}, { repeat: { every: 600000 } });
    this.addJob('expireJobs', {}, { repeat: { every: 7200000 } });
    this.addJob('handleEscrowTransfer', {}, { repeat: { every: 600000 } });
    // this.addJob('jobDayScheduleCheck', {}, { repeat: { cron: '0 0 * * *', tz: 'America/Los_Angeles',} }); //America/Los_Angeles
    this.addJob('jobDayScheduleCheck', {}, { repeat: { cron: '* * * * *'} }); //every minute
    this.addJob('quizReminderCheck', {}, { repeat: { cron: '0 0 */4 * *'} }); //4 days
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
