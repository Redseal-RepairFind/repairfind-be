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
exports.RepairFindQueueWorker = void 0;
var bullmq_1 = require("bullmq");
var config_1 = require("../../config");
var ioredis_1 = __importDefault(require("ioredis"));
var capture_stripe_payments_1 = require("./jobs/capture_stripe_payments");
var logger_1 = require("../logger");
var sync_certn_applications_1 = require("./jobs/sync_certn_applications");
var expire_jobs_1 = require("./jobs/expire_jobs");
var jobday_schedule_1 = require("./jobs/jobday_schedule");
var job_refunds_1 = require("./jobs/job_refunds");
var escrow_transfer_1 = require("./jobs/escrow_transfer");
var send_email_1 = require("./jobs/send_email");
var training_reminder_1 = require("./jobs/training_reminder");
var getRedisConfig = function () {
    var redisConfig = {
        port: Number(config_1.config.redis.port),
        host: config_1.config.redis.host,
        password: config_1.config.redis.password,
        username: config_1.config.redis.username,
        maxRetriesPerRequest: null,
    };
    if (config_1.config.environment !== 'development') {
        redisConfig.tls = {};
    }
    return redisConfig;
};
var processJob = function (job) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 19, , 20]);
                _a = job.name;
                switch (_a) {
                    case 'CapturePayments': return [3 /*break*/, 1];
                    case 'expireJobs': return [3 /*break*/, 3];
                    case 'syncCertnApplications': return [3 /*break*/, 5];
                    case 'jobDayScheduleCheck': return [3 /*break*/, 7];
                    case 'quizReminderCheck': return [3 /*break*/, 9];
                    case 'handleJobRefunds': return [3 /*break*/, 11];
                    case 'sendEmail': return [3 /*break*/, 13];
                    case 'handleEscrowTransfer': return [3 /*break*/, 15];
                }
                return [3 /*break*/, 17];
            case 1: return [4 /*yield*/, (0, capture_stripe_payments_1.captureStripePayments)()];
            case 2:
                _b.sent();
                return [3 /*break*/, 18];
            case 3: return [4 /*yield*/, (0, expire_jobs_1.expireJobs)()];
            case 4:
                _b.sent();
                return [3 /*break*/, 18];
            case 5: return [4 /*yield*/, (0, sync_certn_applications_1.syncCertnApplications)()];
            case 6:
                _b.sent();
                return [3 /*break*/, 18];
            case 7: return [4 /*yield*/, (0, jobday_schedule_1.jobDayScheduleCheck)()];
            case 8:
                _b.sent();
                return [3 /*break*/, 18];
            case 9: return [4 /*yield*/, (0, training_reminder_1.quizReminderCheck)()];
            case 10:
                _b.sent();
                return [3 /*break*/, 18];
            case 11: return [4 /*yield*/, (0, job_refunds_1.handleJobRefunds)()];
            case 12:
                _b.sent();
                return [3 /*break*/, 18];
            case 13: return [4 /*yield*/, (0, send_email_1.sendEmail)(job)];
            case 14:
                _b.sent();
                return [3 /*break*/, 18];
            case 15: return [4 /*yield*/, (0, escrow_transfer_1.handleEscrowTransfer)()];
            case 16:
                _b.sent();
                return [3 /*break*/, 18];
            case 17:
                logger_1.Logger.warn("Unknown job name: ".concat(job.name));
                _b.label = 18;
            case 18: return [3 /*break*/, 20];
            case 19:
                error_1 = _b.sent();
                logger_1.Logger.error("Error processing job ".concat(job.name, ": ").concat(error_1));
                throw error_1;
            case 20: return [2 /*return*/];
        }
    });
}); };
var setupWorkerEventListeners = function (worker) {
    worker.on('error', function (error) {
        logger_1.Logger.error("Job Errored: ".concat(error));
    });
    worker.on('failed', function (job) {
        logger_1.Logger.error("Job Failed: ".concat(job === null || job === void 0 ? void 0 : job.name, " - ").concat(job === null || job === void 0 ? void 0 : job.id));
    });
    worker.on('completed', function (job) {
        logger_1.Logger.info("Job Completed: ".concat(job.name, " - ").concat(job.id, " has completed!"));
    });
};
var redisConfig = getRedisConfig();
var connection = new ioredis_1.default(redisConfig);
connection.on('connect', function () {
    logger_1.Logger.info('Connected to Redis');
});
connection.on('error', function (error) {
    logger_1.Logger.error('Error connecting to Redis:', error);
});
exports.RepairFindQueueWorker = new bullmq_1.Worker(config_1.config.redis.queueName, processJob, { connection: connection });
setupWorkerEventListeners(exports.RepairFindQueueWorker);
