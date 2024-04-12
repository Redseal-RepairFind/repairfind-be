import { RedisOptions, Worker } from 'bullmq';
import { config } from '../../config';
import Redis from 'ioredis';
import { captureStripePayments } from './jobs/capture_stripe_payments';

const redisConfig = {
    port: Number(config.redis.port),
    host: config.redis.host,
    password: config.redis.password,
    username: config.redis.username,
    maxRetriesPerRequest: null,
    // uri: config.redis.uri,
  } as RedisOptions ;

  // console.log(config)
  // @ts-ignore
  if( !(config.environment == 'development') ) {
    console.log('not developement')
    redisConfig.tls = {
  }};

  // const redisConnection = createClient(redisConfig); // Create Redis client
  // this.repairFindQueue = new Queue('RepairFindQueue', { connection: redisConfig });


  const redisConnection = new Redis(redisConfig);

export const RepairFindQueueWorker = new Worker('RepairFindQueue', async job => {
    // Job processing logic here
    console.log(`Processing job: ${job.name} - ${job.id}`);
    
    // CapturePayments
    if(job.name =='CapturePayments'){
        await captureStripePayments()
    }
}, { connection: redisConnection });



RepairFindQueueWorker.on('completed', job => {
    console.log(`${job.name} - ${job.id} has completed!`);
});