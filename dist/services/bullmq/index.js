"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
var bullmq_1 = require("bullmq");
var ioredis_1 = __importDefault(require("ioredis"));
var config_1 = require("../../config");
var api_1 = require("@bull-board/api");
var bullAdapter_1 = require("@bull-board/api/bullAdapter");
var express_1 = require("@bull-board/express");
var logger_1 = require("../logger");
var JobQueue = /** @class */ (function () {
    function JobQueue() {
        this.serverAdapter = new express_1.ExpressAdapter();
        this.serverAdapter.setBasePath('/queues');
        this.queue = this.createQueue();
        this.setupBullBoard();
    }
    JobQueue.prototype.createQueue = function () {
        var redisConfig = this.getRedisConfig();
        var connection = new ioredis_1.default(redisConfig);
        connection.on('connect', function () {
            logger_1.Logger.info('Connected to Redis');
        });
        connection.on('error', function (error) {
            logger_1.Logger.error('Error connecting to Redis:', error);
        });
        return new bullmq_1.Queue(config_1.config.redis.queueName, { connection: connection });
    };
    JobQueue.prototype.getRedisConfig = function () {
        var redisConfig = {
            port: Number(config_1.config.redis.port),
            host: config_1.config.redis.host,
            password: config_1.config.redis.password,
            username: config_1.config.redis.username,
            maxRetriesPerRequest: null,
        };
        if (config_1.config.environment !== 'development') {
            // redisConfig.tls = {
            //   rejectUnauthorized: false, // Accept self-signed certificates
            //   minVersion: 'TLSv1.2', // Set minimum TLS version
            // };
        }
        return redisConfig;
    };
    JobQueue.prototype.setupBullBoard = function () {
        (0, api_1.createBullBoard)({
            queues: [new bullAdapter_1.BullAdapter(this.queue)],
            serverAdapter: this.serverAdapter,
        });
    };
    JobQueue.prototype.addJob = function (jobName, jobPayload, options) {
        var _a, _b, _c;
        var jobOptions = {
            jobId: options.jobId,
            attempts: (_a = options.attempts) !== null && _a !== void 0 ? _a : 2,
            priority: (_b = options.priority) !== null && _b !== void 0 ? _b : 10,
            repeat: (_c = options.repeat) !== null && _c !== void 0 ? _c : null,
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
    };
    JobQueue.prototype.attach = function (app) {
        this.addCronJobs();
        app.use('/queues', this.serverAdapter.getRouter());
    };
    JobQueue.prototype.addCronJobs = function () {
        //every: 600000 ms = 10 minutes, 86400000 ms = 24 hours, 7200000= 12hours
        // cron: '*/5 * * * * *' = Every 5 seconds, 
        // cron: 0 0 * * *'  = This cron expression triggers the job at midnight every day, 
        // this.addJob('CapturePayments', {}, { repeat: { every: 600000 } });
        this.addJob('handleJobRefunds', {}, { repeat: { every: 1000 } }); //14400000 every 4 hour
        this.addJob('syncCertnApplications', {}, { repeat: { every: 14400000 } }); // 4 hours
        this.addJob('expireJobs', {}, { repeat: { every: 7200000 } }); // 2 hours
        this.addJob('handleEscrowTransfer', {}, { repeat: { every: 3600000 } }); // 1 hour
        this.addJob('jobNotStartedScheduleCheck', {}, { repeat: { cron: '0 0 * * *', tz: 'America/Los_Angeles', } }); //midnight
        // this.addJob('jobDayScheduleCheck', {}, { repeat: { cron: '* * * * *' } }); //every minute
        this.addJob('jobDayScheduleCheck', {}, { repeat: { every: 3000000 } }); // 50 minutes (50 * 60 * 1000)
        this.addJob('quizReminderCheck', {}, { repeat: { cron: '0 0 */4 * *' } }); //4 days
    };
    JobQueue.prototype.getQueue = function (queueName) {
        return queueName === config_1.config.redis.queueName ? this.queue : undefined;
    };
    JobQueue.prototype.restartQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.queue = this.createQueue();
                this.setupBullBoard();
                this.addCronJobs();
                console.log("Queue ".concat(config_1.config.redis.queueName, " restarted successfully."));
                return [2 /*return*/];
            });
        });
    };
    return JobQueue;
}());
// Export an instance of the JobQueue class
exports.QueueService = new JobQueue();
