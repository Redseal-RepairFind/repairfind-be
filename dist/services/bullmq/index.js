"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
// queue.ts
var bullmq_1 = require("bullmq");
var ioredis_1 = __importDefault(require("ioredis"));
var config_1 = require("../../config");
var api_1 = require("@bull-board/api");
var bullAdapter_1 = require("@bull-board/api/bullAdapter");
var express_1 = require("@bull-board/express");
var JobQueue = /** @class */ (function () {
    function JobQueue() {
        var redisConfig = {
            port: Number(config_1.config.redis.port),
            host: config_1.config.redis.host,
            password: config_1.config.redis.password,
            username: config_1.config.redis.username,
            maxRetriesPerRequest: null,
            // uri: config.redis.uri,
        };
        // console.log(config)
        // @ts-ignore
        if (!(config_1.config.environment == 'development')) {
            console.log('not developement');
            redisConfig.tls = {};
        }
        ;
        // const redisConnection = createClient(redisConfig); // Create Redis client
        // this.repairFindQueue = new Queue('RepairFindQueue', { connection: redisConfig });
        var redisConnection = new ioredis_1.default(redisConfig);
        this.repairFindQueue = new bullmq_1.Queue('RepairFindQueue', { connection: redisConnection });
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
                every: 600000, // 600000 mili = 10 minutes
            },
        });
        app.use('/queues', this.serverAdapter.getRouter());
    };
    return JobQueue;
}());
// Export an instance of the JobQueue class
exports.QueueService = new JobQueue();
