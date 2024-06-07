// queue.ts
import { Queue, RedisOptions, Worker, } from 'bullmq';

import Redis from 'ioredis';
import { config } from '../../config';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

class JobQueue {
  private Queue: Queue;
  private serverAdapter: ExpressAdapter;

  constructor() {
    const redisConfig = {
      port: Number(config.redis.port),
      host: config.redis.host,
      password: config.redis.password,
      username: config.redis.username,
      maxRetriesPerRequest: null,
      // uri: config.redis.uri,
    } as RedisOptions;

    // console.log(config)
    // @ts-ignore
    if (!(config.environment == 'development')) {
      console.log('not developement')
      redisConfig.tls = {
      }
    };

    // const redisConnection = createClient(redisConfig); // Create Redis client
    // this.Queue = new Queue('RepairFindQueue', { connection: redisConfig });


    const redisConnection = new Redis(redisConfig);
    this.Queue = new Queue(config.redis.queueName, { connection: redisConnection });


    // TODO: Make the obliterate to used via a cli command
    // this.Queue.obliterate()

    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: [new BullAdapter(this.Queue)],
      serverAdapter: this.serverAdapter,
    });

  }

  public addJob(jobName: string, jobPayload: any, options: any) {
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
    this.Queue.add(jobName, jobPayload, jobOptions);
  }

  public attach(app: any) {

    // add cron jobs here
    QueueService.addJob('CapturePayments', {}, {
      repeat: {
        // pattern: '* * * * *',
        // cron: '*/5 * * * * *', // Every 5 seconds
        // offset: new Date().getTimezoneOffset(), 
        // tz: 'Europe/Berlin',
        // limit: 1,
        every: 600000, // 600000 mili = 10 minutes
      },
      jobId: 'CapturePayments'
    })

    
    QueueService.addJob('handleJobRefunds', {}, {
      repeat: {
        every: 6000, // 600000 mili = 10 minutes
      }
    })

    QueueService.addJob('syncCertnApplications', {}, {
      repeat: {
        every: 600000, // 600000 mili = 10 minutes
      },
      jobId: "syncCertnApplications"
    })

    QueueService.addJob('expireJobs', {}, {
      repeat: {
        every: 7200000 , // 86400000 ms = 24 hours, 7200000= 12hours
      }
    })


    QueueService.addJob('jobDayScheduleCheck', {}, {
      repeat: {
          cron: '0 0 * * *' // This cron expression triggers the job at midnight every day
      }
  });

    app.use('/queues', this.serverAdapter.getRouter());
  }

  public getQueue(queueName: string): Queue | undefined {
    if (config.redis.queueName) {
      return this.Queue;
    }
    // Add more logic for other queues if needed
    return undefined;
  }


}





// Export an instance of the JobQueue class
export const QueueService = new JobQueue();

