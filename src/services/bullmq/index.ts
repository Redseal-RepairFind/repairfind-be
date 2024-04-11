// queue.ts
import { Queue, RedisOptions, Worker,  } from 'bullmq';

import Redis from 'ioredis';
import { config } from '../../config';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { createClient } from 'redis';

class JobQueue {
  private repairFindQueue: Queue;
  private serverAdapter: ExpressAdapter;

  constructor() {
    const redisConfig = {
      port: Number(config.redis.port),
      host: config.redis.host,
      password: config.redis.password,
      username: config.redis.username,
      uri: config.redis.uri,
      tls: {}
    } as RedisOptions ;

    // console.log(config)
    // @ts-ignore
    if( !(config.environment == 'development') ) {redisConfig.tls = {}};

    // const redisConnection = createClient(redisConfig); // Create Redis client
    // this.repairFindQueue = new Queue('RepairFindQueue', { connection: redisConfig });


    const redisConnection = new Redis(redisConfig);
    this.repairFindQueue = new Queue('RepairFindQueue', { connection: redisConnection });



    this.serverAdapter = new ExpressAdapter();
    this.serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: [new BullAdapter(this.repairFindQueue)],
      serverAdapter: this.serverAdapter,
    });
	
  }

  public addJob(jobName: string, jobPayload: any, options: any) {
    const jobOptions = {
      attempts: options.attempts ?? 2,
      priority: options.priority ?? 10,
      repeat: options.repeat ?? null,
      removeOnComplete: true, 
      removeOnFail: true
    };
    this.repairFindQueue.add(jobName, jobPayload, jobOptions);
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
      every: 5000, // 5000 mili = 5 seconds
		},
	})


    app.use('/queues', this.serverAdapter.getRouter());
  }
}



// Export an instance of the JobQueue class
export const QueueService = new JobQueue();

