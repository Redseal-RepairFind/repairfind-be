"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
// queue.ts
var bullmq_1 = require("bullmq");
var config_1 = require("../../config");
var api_1 = require("@bull-board/api");
var bullAdapter_1 = require("@bull-board/api/bullAdapter");
var express_1 = require("@bull-board/express");
var redis_1 = require("redis");
var JobQueue = /** @class */ (function () {
    function JobQueue() {
        var redisConfig = {
            port: Number(config_1.config.redis.port),
            host: config_1.config.redis.host,
            password: config_1.config.redis.password,
            // username: config.redis.username,
        };
        console.log(config_1.config);
        // @ts-ignore
        // if( !(config.environment == 'development') ) {redisConfig.tls = {}};
        var redisConnection = (0, redis_1.createClient)(redisConfig); // Create Redis client
        this.repairFindQueue = new bullmq_1.Queue('RepairFindQueue', { connection: redisConfig });
        // const redisConnection = new Redis(redisConfig);
        // this.repairFindQueue = new Queue('RepairFindQueue', { connection: redisConnection });
        this.serverAdapter = new express_1.ExpressAdapter();
        this.serverAdapter.setBasePath('/queues');
        (0, api_1.createBullBoard)({
            queues: [new bullAdapter_1.BullAdapter(this.repairFindQueue)],
            serverAdapter: this.serverAdapter,
        });
    }
    JobQueue.prototype.addJob = function (jobName, jobPayload, options) {
        var _a, _b, _c;
        var jobOptions = {
            attempts: (_a = options.attempts) !== null && _a !== void 0 ? _a : 2,
            priority: (_b = options.priority) !== null && _b !== void 0 ? _b : 10,
            repeat: (_c = options.repeat) !== null && _c !== void 0 ? _c : null,
            removeOnComplete: true,
            removeOnFail: true
        };
        this.repairFindQueue.add(jobName, jobPayload, jobOptions);
    };
    JobQueue.prototype.attach = function (app) {
        // add cron jobs here
        exports.QueueService.addJob('CapturePayments', {}, {
            repeat: {
                // pattern: '* * * * *',
                // cron: '*/5 * * * * *', // Every 5 seconds
                // offset: new Date().getTimezoneOffset(), 
                // tz: 'Europe/Berlin',
                // limit: 1,
                every: 5000, // 5000 mili = 5 seconds
            },
        });
        app.use('/queues', this.serverAdapter.getRouter());
    };
    return JobQueue;
}());
// Export an instance of the JobQueue class
exports.QueueService = new JobQueue();
