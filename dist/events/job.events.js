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
exports.JobEvent = void 0;
var events_1 = require("events");
var services_1 = require("../services");
var customer_model_1 = __importDefault(require("../database/customer/models/customer.model"));
var contractor_model_1 = require("../database/contractor/models/contractor.model");
var job_model_1 = require("../database/common/job.model");
var conversations_schema_1 = require("../database/common/conversations.schema");
var socket_1 = require("../services/socket");
var job_canceled_template_1 = require("../templates/common/job_canceled.template");
var job_emergency_email_1 = require("../templates/common/job_emergency_email");
exports.JobEvent = new events_1.EventEmitter();
exports.JobEvent.on('NEW_JOB_REQUEST', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, conversation, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    console.log('handling NEW_JOB_REQUEST event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.customerId)];
                case 1:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.contractorId)];
                case 2:
                    contractor = _c.sent();
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobId)];
                case 3:
                    job = _c.sent();
                    return [4 /*yield*/, conversations_schema_1.ConversationModel.findById(payload.conversationId)];
                case 4:
                    conversation = _c.sent();
                    if (job && contractor && customer) {
                        services_1.NotificationService.sendNotification({
                            user: contractor.id,
                            userType: 'contractors',
                            title: 'New Job Request',
                            type: 'Notification', //
                            message: "You've received a job request from ".concat(customer.firstName),
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "You've received a job request from ".concat(customer.firstName),
                                contractor: contractor.id,
                                event: 'NEW_JOB_REQUEST',
                            }
                        }, { database: true, push: true, socket: true });
                        services_1.NotificationService.sendNotification({
                            user: customer.id,
                            userType: 'customers',
                            title: 'New Job Request',
                            type: 'Notification', // Conversation, Conversation_Notification
                            //@ts-ignore
                            message: "You've  sent a job request to ".concat(contractor.name),
                            //@ts-ignore
                            heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                //@ts-ignore
                                message: "You've sent a job request to ".concat(contractor.name),
                                customer: customer.id,
                                event: 'NEW_JOB_REQUEST',
                            }
                        }, { database: true, push: true, socket: true });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _c.sent();
                    console.error("Error handling NEW_JOB_REQUEST event: ".concat(error_1));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('NEW_JOB_LISTING', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var job, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('handling alert NEW_JOB_LISTING event');
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobId)];
                case 1:
                    job = _a.sent();
                    if (job) {
                        socket_1.SocketService.broadcastChannel('alerts', 'NEW_JOB_LISTING', {
                            type: 'NEW_JOB_LISTING',
                            message: 'A new Job listing has been added',
                            data: job
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error handling NEW_JOB_REQUEST event: ".concat(error_2));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_CANCELED', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, html, html, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log('handling alert JOB_CANCELED event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _a.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _a.sent();
                    if (payload.canceledBy == 'contractor') {
                        console.log('job cancelled by contractor');
                        if (customer) {
                            html = (0, job_canceled_template_1.JobCanceledEmailTemplate)({ name: customer.name, canceledBy: 'contractor', job: payload.job });
                            services_1.EmailService.send(customer.email, "Job Canceled", html);
                        }
                    }
                    if (payload.canceledBy == 'customer') {
                        console.log('job cancelled by customer');
                        if (contractor) {
                            html = (0, job_canceled_template_1.JobCanceledEmailTemplate)({ name: contractor.name, canceledBy: 'customer', job: payload.job });
                            services_1.EmailService.send(contractor.email, "Job Canceled", html);
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error handling JOB_CANCELED event: ".concat(error_3));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_DAY_EMERGENCY', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, html, html, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    console.log('handling alert JOB_DAY_EMERGENCY event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.jobEmergency.customer)];
                case 1:
                    customer = _a.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.jobEmergency.contractor)];
                case 2:
                    contractor = _a.sent();
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobEmergency.job)];
                case 3:
                    job = _a.sent();
                    if (job) {
                        if (payload.jobEmergency.triggeredBy == 'contractor') {
                            console.log('job emergency triggered by contractor');
                            if (customer) {
                                html = (0, job_emergency_email_1.JobEmergencyEmailTemplate)({ name: customer.name, emergency: payload.jobEmergency, job: job });
                                services_1.EmailService.send(customer.email, "Job Emergency", html);
                            }
                        }
                        if (payload.jobEmergency.triggeredBy == 'customer') {
                            console.log('job emergency triggered by customer');
                            if (contractor) {
                                html = (0, job_emergency_email_1.JobEmergencyEmailTemplate)({ name: contractor.name, emergency: payload.jobEmergency, job: job });
                                services_1.EmailService.send(contractor.email, "Job Emergency", html);
                            }
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error("Error handling JOB_DAY_EMERGENCY event: ".concat(error_4));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
