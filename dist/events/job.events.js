"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var job_day_model_1 = require("../database/common/job_day.model");
var generic_email_1 = require("../templates/common/generic_email");
var job_quotation_model_1 = require("../database/common/job_quotation.model");
var transaction_model_1 = __importStar(require("../database/common/transaction.model"));
var expo_1 = require("../services/expo");
var contractor_profile_model_1 = require("../database/contractor/models/contractor_profile.model");
var contractor_devices_model_1 = __importDefault(require("../database/contractor/models/contractor_devices.model"));
var contractor_saved_job_model_1 = __importDefault(require("../database/contractor/models/contractor_saved_job.model"));
var job_enquiry_model_1 = require("../database/common/job_enquiry.model");
var logger_1 = require("../services/logger");
var conversation_util_1 = require("../utils/conversation.util");
var messages_schema_1 = require("../database/common/messages.schema");
exports.JobEvent = new events_1.EventEmitter();
exports.JobEvent.on('NEW_JOB_REQUEST', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, conversation, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling NEW_JOB_REQUEST event');
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
                            type: 'NEW_JOB_REQUEST', //
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
                            type: 'NEW_JOB_REQUEST', // Conversation, Conversation_Notification
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
                    logger_1.Logger.error("Error handling NEW_JOB_REQUEST event: ".concat(error_1));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_REQUEST_ACCEPTED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    logger_1.Logger.info('handling JOB_REQUEST_ACCEPTED event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _c.sent();
                    job = payload.job;
                    if (job && contractor && customer) {
                        services_1.NotificationService.sendNotification({
                            user: contractor.id,
                            userType: 'contractors',
                            title: 'New Job Request',
                            type: 'JOB_REQUEST_ACCEPTED', //
                            message: "You've accepted a job request from ".concat(customer.firstName),
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "You've accepted a job request from ".concat(customer.firstName),
                                contractor: contractor.id,
                                event: 'JOB_REQUEST_ACCEPTED',
                            }
                        }, { push: true, socket: true, database: true });
                        services_1.NotificationService.sendNotification({
                            user: customer.id,
                            userType: 'customers',
                            title: 'New Job Request',
                            type: 'JOB_REQUEST_ACCEPTED',
                            message: "Contractor has accepted your job request",
                            heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "Contractor has accepted your job request",
                                customer: customer.id,
                                event: 'JOB_REQUEST_ACCEPTED',
                            }
                        }, { database: true, push: true, socket: true });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _c.sent();
                    logger_1.Logger.error("Error handling JOB_REQUEST_ACCEPTED event: ".concat(error_2));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_REQUEST_REJECTED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, error_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    logger_1.Logger.info('handling JOB_REQUEST_REJECTED event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _c.sent();
                    job = payload.job;
                    if (job && contractor && customer) {
                        services_1.NotificationService.sendNotification({
                            user: contractor.id,
                            userType: 'contractors',
                            title: 'New Job Request',
                            type: 'JOB_REQUEST_ACCEPTED', //
                            message: "You've rejected a job request from ".concat(customer.firstName),
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "You've rejected a job request from ".concat(customer.firstName),
                                contractor: contractor.id,
                                event: 'JOB_REQUEST_ACCEPTED',
                            }
                        }, { push: true, socket: true, database: true });
                        services_1.NotificationService.sendNotification({
                            user: customer.id,
                            userType: 'customers',
                            title: 'New Job Request',
                            type: 'JOB_REQUEST_ACCEPTED',
                            message: "Contractor has rejected your job request",
                            heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "Contractor has rejected your job request",
                                customer: customer.id,
                                event: 'JOB_REQUEST_ACCEPTED',
                            }
                        }, { database: true, push: true, socket: true });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _c.sent();
                    logger_1.Logger.error("Error handling JOB_REQUEST_REJECTED event: ".concat(error_3));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('NEW_JOB_LISTING', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var job, contractorProfiles, contractorIds, devices, deviceTokens, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling alert NEW_JOB_LISTING event');
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobId)];
                case 1:
                    job = _a.sent();
                    if (!job) return [3 /*break*/, 4];
                    socket_1.SocketService.broadcastChannel('alerts', 'NEW_JOB_LISTING', {
                        type: 'NEW_JOB_LISTING',
                        message: 'A new Job listing has been added',
                        data: job
                    });
                    return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.find({ skill: job.category })];
                case 2:
                    contractorProfiles = _a.sent();
                    contractorIds = contractorProfiles.map(function (profile) { return profile.contractor; });
                    return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: { $in: contractorIds } })];
                case 3:
                    devices = _a.sent();
                    deviceTokens = devices.map(function (device) { return device.expoToken; });
                    (0, expo_1.sendPushNotifications)(deviceTokens, {
                        title: 'New job listing',
                        type: 'NEW_JOB_LISTING',
                        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                        body: 'There is a new job listing  that match your profile',
                        data: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "There is a new job listing  that match your profile",
                            event: 'NEW_JOB_LISTING',
                        }
                    });
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    logger_1.Logger.error("Error handling NEW_JOB_REQUEST event: ".concat(error_4));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_CANCELED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, html, html, error_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    logger_1.Logger.info('handling alert JOB_CANCELED event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _c.sent();
                    job = payload.job;
                    if (!customer || !contractor || !job || !payload.canceledBy)
                        return [2 /*return*/];
                    if (payload.canceledBy == 'contractor') {
                        logger_1.Logger.info('job cancelled by contractor');
                        html = (0, job_canceled_template_1.JobCanceledEmailTemplate)({ name: customer.name, canceledBy: payload.canceledBy, job: payload.job });
                        services_1.EmailService.send(customer.email, "Job Canceled", html);
                    }
                    if (payload.canceledBy == 'customer') {
                        logger_1.Logger.info('job cancelled by customer');
                        html = (0, job_canceled_template_1.JobCanceledEmailTemplate)({ name: contractor.name, canceledBy: 'customer', job: payload.job });
                        services_1.EmailService.send(contractor.email, "Job Canceled", html);
                    }
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Canceled',
                        type: 'JOB_CANCELED', //
                        message: "Your job on Repairfind has been canceled",
                        heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Your job on Repairfind has been canceled",
                            customer: customer.id,
                            event: 'JOB_CANCELED',
                        }
                    }, { push: true, socket: true, database: true });
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Canceled',
                        type: 'JOB_CANCELED', //
                        message: "Your job on Repairfind has been canceled",
                        heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Your job on Repairfind has been canceled",
                            customer: customer.id,
                            event: 'JOB_CANCELED',
                        }
                    }, { push: true, socket: true, database: true });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _c.sent();
                    logger_1.Logger.error("Error handling JOB_CANCELED event: ".concat(error_5));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_DISPUTE_REFUND_CREATED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var job, dispute, customer, contractor, error_6;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    logger_1.Logger.info('handling alert JOB_DISPUTE_REFUND_CREATED event');
                    job = payload.job;
                    dispute = payload.dispute;
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _c.sent();
                    if (job && contractor && customer) {
                        services_1.NotificationService.sendNotification({
                            user: contractor.id,
                            userType: 'contractors',
                            title: 'Job Dispute Refund Created',
                            type: 'JOB_DISPUTE_REFUND_CREATED', //
                            message: "Full refund of your disputed job has been approved  on Repairfind",
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                            payload: {
                                entity: dispute.id,
                                entityType: 'job_disputes',
                                message: "Full refund of your disputed job has been approved  on Repairfind",
                                contractor: contractor.id,
                                event: 'JOB_DISPUTE_REFUND_CREATED',
                            }
                        }, { push: true, socket: true, database: true });
                        services_1.NotificationService.sendNotification({
                            user: customer.id,
                            userType: 'customers',
                            title: 'Job Dispute Refund Created',
                            type: 'JOB_DISPUTE_REFUND_CREATED',
                            message: "Full refund of your disputed job has been approved  on Repairfind",
                            heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            payload: {
                                entity: dispute.id,
                                entityType: 'job_disputes',
                                jobType: job.type,
                                message: "Full refund of your disputed job has been approved  on Repairfind",
                                customer: customer.id,
                                event: 'JOB_DISPUTE_REFUND_CREATED',
                            }
                        }, { database: true, push: true, socket: true });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _c.sent();
                    logger_1.Logger.error("Error handling JOB_DISPUTE_REFUND_CREATED event: ".concat(error_6));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_REVISIT_ENABLED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var job, dispute, customer, contractor, conversation, error_7;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling alert JOB_REVISIT_ENABLED event');
                    job = payload.job;
                    dispute = payload.dispute;
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _c.sent();
                    if (!(job && contractor && customer)) return [3 /*break*/, 4];
                    return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(contractor.id, 'contractors', customer.id, 'customers')];
                case 3:
                    conversation = _c.sent();
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Revisit  Enabled',
                        type: 'JOB_REVISIT_ENABLED', //
                        message: "A revisit for your disputed job has been enabled on Repairfind",
                        heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "A revisit for your disputed job has been enabled on Repairfind",
                            contractor: contractor.id,
                            conversationId: conversation === null || conversation === void 0 ? void 0 : conversation.id,
                            event: 'JOB_REVISIT_ENABLED',
                        }
                    }, { push: true, socket: true, database: true });
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Revisit  Enabled',
                        type: 'JOB_REVISIT_ENABLED',
                        message: "A revisit for your disputed job has been enabled on Repairfind",
                        heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            jobType: job.type,
                            message: "A revisit for your disputed job has been enabled on Repairfind",
                            customer: customer.id,
                            conversationId: conversation === null || conversation === void 0 ? void 0 : conversation.id,
                            event: 'JOB_REVISIT_ENABLED',
                        }
                    }, { database: true, push: true, socket: true });
                    _c.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_7 = _c.sent();
                    logger_1.Logger.error("Error handling JOB_REVISIT_ENABLED event: ".concat(error_7));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_QUOTATION_DECLINED', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, emailSubject, emailContent, html, conversation, error_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    logger_1.Logger.info('handling alert JOB_QUOTATION_DECLINED event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.customerId)];
                case 1:
                    customer = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.contractorId)];
                case 2:
                    contractor = _b.sent();
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobId)];
                case 3:
                    job = _b.sent();
                    if (!contractor) return [3 /*break*/, 5];
                    emailSubject = 'Job Quotation Decline';
                    emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p>Hello ").concat(contractor.name, ",</p>\n                <p style=\"color: #333333;\">Your job  quotation for a job  on RepairFind was declined.</p>\n                <p>\n                    <strong>Job Title:</strong> ").concat(job.title, " </br>\n                    <strong>Customer:</strong> ").concat(customer.name, " </br>\n                    <strong>Reason:</strong> ").concat(payload.reason, "  </br>\n                </p>\n              \n                <p>Login to our app to follow up </p>\n                ");
                    html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                    services_1.EmailService.send(contractor.email, emailSubject, html);
                    return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')];
                case 4:
                    conversation = _b.sent();
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job quotation declined',
                        type: 'JOB_QUOTATION_DECLINED', // Conversation, Conversation_Notification
                        message: "Your job quotation for a job on RepairFind was declined",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Your job quotation for a job  on RepairFind was declined",
                            customerId: customer.id,
                            jobType: job.type,
                            conversationId: conversation.id,
                            event: 'JOB_QUOTATION_DECLINED',
                        }
                    }, { push: true, socket: true, database: true });
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_8 = _b.sent();
                    logger_1.Logger.error("Error handling JOB_QUOTATION_DECLINED event: ".concat(error_8));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_QUOTATION_ACCEPTED', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, emailSubject, emailContent, html, conversation, error_9;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    logger_1.Logger.info('handling alert JOB_QUOTATION_ACCEPTED event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.customerId)];
                case 1:
                    customer = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.contractorId)];
                case 2:
                    contractor = _b.sent();
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobId)];
                case 3:
                    job = _b.sent();
                    if (!contractor) return [3 /*break*/, 5];
                    emailSubject = 'Job Quotation Accepted';
                    emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p>Hello ").concat(contractor.name, ",</p>\n                <p style=\"color: #333333;\">Congratulations! your job quotation for a job  on RepairFind was accepted.</p>\n                <p>\n                    <strong>Job Title:</strong> ").concat(job.title, " </br>\n                    <strong>Customer:</strong> ").concat(customer.name, " </br>\n                </p>\n              \n                <p>Login to our app to follow up </p>\n                ");
                    html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                    services_1.EmailService.send(contractor.email, emailSubject, html);
                    return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')];
                case 4:
                    conversation = _b.sent();
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job quotation accepted',
                        type: 'JOB_QUOTATION_ACCEPTED', // Conversation, Conversation_Notification
                        message: "Your  quotation for a job on RepairFind was accepted",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Your job quotation for a job  on RepairFind was accepted",
                            customerId: customer.id,
                            conversationId: conversation.id,
                            event: 'JOB_QUOTATION_ACCEPTED',
                        }
                    }, { push: true, socket: true, database: true });
                    _b.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_9 = _b.sent();
                    logger_1.Logger.error("Error handling JOB_QUOTATION_ACCEPTED event: ".concat(error_9));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_DAY_EMERGENCY', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    logger_1.Logger.info('handling alert JOB_DAY_EMERGENCY event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.jobEmergency.customer)];
                case 1:
                    customer = _a.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.jobEmergency.contractor)];
                case 2:
                    contractor = _a.sent();
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobEmergency.job)];
                case 3:
                    job = _a.sent();
                    if (job && contractor && customer) {
                        if (payload.jobEmergency.triggeredBy == 'contractor') {
                            logger_1.Logger.info('job emergency triggered by contractor');
                            // if (customer) {
                            //     const html = JobEmergencyEmailTemplate({ name: customer.name, emergency: payload.jobEmergency, job })
                            //     EmailService.send(customer.email, "Job Emergency", html)
                            // }
                        }
                        if (payload.jobEmergency.triggeredBy == 'customer') {
                            logger_1.Logger.info('job emergency triggered by customer');
                            // if (contractor) {
                            //     const html = JobEmergencyEmailTemplate({ name: contractor.name, emergency: payload.jobEmergency, job })
                            //     EmailService.send(contractor.email, "Job Emergency", html)
                            // }
                        }
                        // send socket notification to general admins alert channel
                        socket_1.SocketService.broadcastChannel('admin_alerts', 'NEW_JOB_EMERGENCY', {
                            type: 'NEW_JOB_EMERGENCY',
                            message: 'A new Job emergency has been reported',
                            data: { emergency: payload.jobEmergency, job: job, customer: customer.toJSON(), contractor: contractor.toJSON() }
                        });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_10 = _a.sent();
                    logger_1.Logger.error("Error handling JOB_DAY_EMERGENCY event: ".concat(error_10));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_RESCHEDULE_DECLINED_ACCEPTED', function (payload) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, event_1, conversation, message, dateTimeOptions, rescheduleDate, emailSubject, emailContent, html, dateTimeOptions, rescheduleDate, emailSubject, emailContent, html, error_11;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 6, , 7]);
                    logger_1.Logger.info('handling alert JOB_RESCHEDULE_DECLINED_ACCEPTED event', payload.action);
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _e.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _e.sent();
                    job = payload.job;
                    event_1 = payload.action == 'accepted' ? 'JOB_RESCHEDULE_ACCEPTED' : 'JOB_RESCHEDULE_DECLINED';
                    if (!(contractor && customer)) return [3 /*break*/, 5];
                    return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')];
                case 3:
                    conversation = _e.sent();
                    message = new messages_schema_1.MessageModel({
                        conversation: conversation.id,
                        message: "Job reschedule request ".concat(payload.action),
                        messageType: messages_schema_1.MessageType.ALERT,
                        entity: job.id,
                        entityType: 'jobs'
                    });
                    if (((_a = payload.job.reschedule) === null || _a === void 0 ? void 0 : _a.createdBy) == 'contractor') { // send mail to contractor
                        dateTimeOptions = {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: contractor.currentTimezone,
                            timeZoneName: 'long'
                        };
                        rescheduleDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(payload.job.reschedule.date));
                        emailSubject = 'Job Reschedule Request';
                        emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p>Hello ").concat(contractor.name, ",</p>\n                <p style=\"color: #333333;\">Your Job reschedule request on Repairfind has been ").concat(payload.action, " by customer</p>\n                <p><strong>Job Title:</strong> ").concat(payload.job.description, "</p>\n                <p><strong>Proposed Date:</strong> ").concat(rescheduleDate, "</p>\n                ");
                        html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                        services_1.EmailService.send(contractor.email, emailSubject, html);
                        services_1.NotificationService.sendNotification({
                            user: contractor.id,
                            userType: 'contractors',
                            title: "Job Reschedule Request ".concat(payload.action),
                            type: event_1,
                            message: "Your Job reschedule request on Repairfind has been ".concat(payload.action, " by customer"),
                            heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "Your Job reschedule request on Repairfind has been ".concat(payload.action, " by customer"),
                                customer: customer.id,
                                contractor: contractor.id,
                                conversationId: conversation.id,
                                event: event_1,
                            }
                        }, { push: true, socket: true, database: true });
                        message.sender = customer.id;
                        message.senderType = 'customers';
                    }
                    if (((_c = payload.job.reschedule) === null || _c === void 0 ? void 0 : _c.createdBy) == 'customer') { // send mail to  customer
                        dateTimeOptions = {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: customer.currentTimezone,
                            timeZoneName: 'long'
                        };
                        rescheduleDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(payload.job.reschedule.date));
                        emailSubject = 'Job Reschedule Request';
                        emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p>Hello ").concat(customer.name, ",</p>\n                <p style=\"color: #333333;\">Your Job reschedule request on Repairfind has been ").concat(payload.action, "  by the contractor</p>\n                <p><strong>Job Title:</strong> ").concat(payload.job.description, "</p>\n                <p><strong>Proposed Date:</strong> ").concat(rescheduleDate, "</p>\n                ");
                        html = (0, generic_email_1.GenericEmailTemplate)({ name: customer.name, subject: emailSubject, content: emailContent });
                        services_1.EmailService.send(customer.email, emailSubject, html);
                        services_1.NotificationService.sendNotification({
                            user: customer.id,
                            userType: 'customers',
                            title: "Job Reschedule Request ".concat(payload.action),
                            type: event_1, //
                            message: "Your Job reschedule request on Repairfind has been ".concat(payload.action, " by contractor"),
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_d = customer.profilePhoto) === null || _d === void 0 ? void 0 : _d.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "Your Job reschedule request on Repairfind has been ".concat(payload.action, " by contractor"),
                                contractor: contractor.id,
                                customer: customer.id,
                                conversationId: conversation.id,
                                event: event_1,
                            }
                        }, { push: true, socket: true, database: true });
                        message.sender = contractor.id;
                        message.senderType = 'contractors';
                    }
                    return [4 /*yield*/, message.save()];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_11 = _e.sent();
                    logger_1.Logger.error("Error handling JOB_RESCHEDULE_DECLINED_ACCEPTED event: ".concat(error_11));
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('NEW_JOB_RESCHEDULE_REQUEST', function (payload) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, conversation, message, dateTimeOptions, rescheduleDate, emailSubject, emailContent, html, dateTimeOptions, rescheduleDate, emailSubject, emailContent, html, error_12;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 7, , 8]);
                    logger_1.Logger.info('handling alert NEW_JOB_RESCHEDULE_REQUEST event', payload.action);
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _e.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _e.sent();
                    job = payload.job;
                    if (!(contractor && customer)) return [3 /*break*/, 6];
                    return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')];
                case 3:
                    conversation = _e.sent();
                    message = new messages_schema_1.MessageModel({
                        conversation: conversation.id,
                        message: job.revisitEnabled ? "Job Revisit reschedule request" : "Job reschedule request",
                        messageType: messages_schema_1.MessageType.ALERT,
                        entity: job.id,
                        entityType: 'jobs'
                    });
                    if (((_a = payload.job.reschedule) === null || _a === void 0 ? void 0 : _a.createdBy) == 'contractor') { // send mail to contractor
                        dateTimeOptions = {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: contractor.currentTimezone,
                            timeZoneName: 'long'
                        };
                        rescheduleDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(payload.job.reschedule.date));
                        emailSubject = 'Job Schedule';
                        emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p>Hello ").concat(customer.name, ",</p>\n                <p style=\"color: #333333;\">Contractor has requested  to reschedule a job on RepairFind</p>\n                <p><strong>Job Title:</strong> ").concat(payload.job.description, "</p>\n                <p><strong>Proposed Date:</strong> ").concat(rescheduleDate, "</p>\n                ");
                        html = (0, generic_email_1.GenericEmailTemplate)({ name: customer.name, subject: emailSubject, content: emailContent });
                        services_1.EmailService.send(customer.email, emailSubject, html);
                        services_1.NotificationService.sendNotification({
                            user: customer.id,
                            userType: 'customers',
                            title: job.revisitEnabled ? "Job Revisit reschedule request" : "Job reschedule request",
                            type: 'NEW_JOB_RESCHEDULE_REQUEST', // Conversation, Conversation_Notification
                            message: "Contractor has requested  to reschedule a job on RepairFind",
                            heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "Contractor has requested  to reschedule a job on RepairFind",
                                customer: customer.id,
                                contractor: contractor.id,
                                event: 'NEW_JOB_RESCHEDULE_REQUEST',
                            }
                        }, { push: true, socket: true, database: true });
                        message.sender = contractor.id;
                        message.senderType = 'contractors';
                    }
                    if (((_c = payload.job.reschedule) === null || _c === void 0 ? void 0 : _c.createdBy) == 'customer') { // send mail to  customer
                        dateTimeOptions = {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: customer.currentTimezone,
                            timeZoneName: 'long'
                        };
                        rescheduleDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(payload.job.reschedule.date));
                        emailSubject = 'Job Schedule';
                        emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p>Hello ").concat(contractor.name, ",</p>\n                <p style=\"color: #333333;\">Customer has requested  to reschedule a job on RepairFind</p>\n                <p><strong>Job Title:</strong> ").concat(payload.job.description, "</p>\n                <p><strong>Proposed Date:</strong> ").concat(rescheduleDate, "</p>\n                ");
                        html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                        services_1.EmailService.send(contractor.email, emailSubject, html);
                        services_1.NotificationService.sendNotification({
                            user: contractor.id,
                            userType: 'contractors',
                            title: job.revisitEnabled ? "Job Revisit reschedule request" : "Job reschedule request",
                            type: 'NEW_JOB_RESCHEDULE_REQUEST', //
                            message: "Customer has requested to reschedule your job on RepairFind",
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_d = customer.profilePhoto) === null || _d === void 0 ? void 0 : _d.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "Customer has requested to reschedule your job on RepairFind",
                                contractor: contractor.id,
                                customer: customer.id,
                                event: 'NEW_JOB_RESCHEDULE_REQUEST',
                            }
                        }, { push: true, socket: true, database: true });
                        message.sender = customer.id;
                        message.senderType = 'customer';
                    }
                    return [4 /*yield*/, message.save()];
                case 4:
                    _e.sent();
                    conversation.lastMessageAt = new Date();
                    return [4 /*yield*/, conversation.save()];
                case 5:
                    _e.sent();
                    _e.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_12 = _e.sent();
                    logger_1.Logger.error("Error handling NEW_JOB_RESCHEDULE_REQUEST event: ".concat(error_12));
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_BOOKED', function (payload) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, job, quotation, charges, contractorProfile, dateTimeOptions, jobDateContractor, currentDate, emailSubject, emailContent, receipthtmlContent, html, receipthtml, dateTimeOptions, jobDateCustomer, currentDate, emailSubject, emailContent, receiptContent, html, receipthtml, error_13;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 8, , 9]);
                    logger_1.Logger.info('handling alert JOB_BOOKED event');
                    return [4 /*yield*/, customer_model_1.default.findById(payload.customerId)];
                case 1:
                    customer = _e.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.contractorId)];
                case 2:
                    contractor = _e.sent();
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobId)];
                case 3:
                    job = _e.sent();
                    return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findById(payload.quotationId)];
                case 4:
                    quotation = _e.sent();
                    if (!(job && contractor && customer && quotation)) return [3 /*break*/, 7];
                    return [4 /*yield*/, quotation.calculateCharges()];
                case 5:
                    charges = _e.sent();
                    return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractor.id })];
                case 6:
                    contractorProfile = _e.sent();
                    if (contractor && contractorProfile) {
                        dateTimeOptions = {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: contractor.currentTimezone,
                            timeZoneName: 'long'
                        };
                        jobDateContractor = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(job.schedule.startDate));
                        currentDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(new Date));
                        emailSubject = 'New Job Payment';
                        emailContent = "\n                    <h2>".concat(emailSubject, "</h2>\n                    <p style=\"color: #333333;\">Hello ").concat(contractor.name, ",</p>\n                    <p style=\"color: #333333;\">You have received payment for a job on RepairFind.</p>\n                    <p><strong>Job Title:</strong> ").concat(job.description, "</p>\n                    <p><strong>Scheduled Date:</strong>").concat(jobDateContractor, "</p>\n                    <hr>\n                    <p style=\"color: #333333;\">Thank you for your service!</p>\n                    <p style=\"color: #333333;\">Kindly open the App for more information.</p>\n                ");
                        receipthtmlContent = "\n                    <h3>Payment Receipt</h3>\n                    <p><strong>RepairFind</strong><br>\n                    Phone: (604) 568-6378<br>\n                    Email: info@repairfind.ca</p>\n                    <hr>\n\n                    <p>Date: ".concat(currentDate, "<br>\n                    Receipt Number: RFC").concat(quotation.payment, "</p>\n\n                    <p><strong>Contractor:</strong><br>\n                    ").concat(contractor.name, "<br>\n                    ").concat((_a = contractorProfile === null || contractorProfile === void 0 ? void 0 : contractorProfile.location) === null || _a === void 0 ? void 0 : _a.address, "<br>\n                    </p>\n\n                    <hr>\n                    <strong>Description:</strong>\n                    <strong>Job Title:</strong> ").concat(job.description, "<br>\n                    <strong>Scheduled Date:</strong> ").concat(jobDateContractor, "\n\n                    <p><strong>Invoice Items:</strong></p>\n                    <table style=\"width: 100%; border-collapse: collapse; border: 1px solid lightgray;\">\n                    ").concat(quotation.estimates.map(function (estimate) { return "\n                        <tr>\n                          <td style=\"border: 1px solid lightgray; padding: 8px;\"><strong>".concat(estimate.description, "</strong></td>\n                          <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\">$").concat((estimate.rate * estimate.quantity).toFixed(2), "</td>\n                        </tr>\n                      "); }).join(''), "   \n                        <tr>\n                            <td style=\"border: 1px solid lightgray; padding: 8px;\"><strong>Subtotal</strong></td>\n                            <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\">$").concat((charges.subtotal).toFixed(2), "</td>\n                        </tr>\n                    </table>\n                    <p><strong>Deduction/Charges:</strong></p>\n                    <table style=\"width: 100%; border-collapse: collapse; border: 1px solid lightgray;\">\n                        <tr>\n                            <td style=\"border: 1px solid lightgray; padding: 8px;\">Payment Processing Fee ($").concat(charges.customerProcessingFeeRate, "%)</td>\n                            <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\">$").concat(charges.contractorProcessingFee, "</td>\n                        </tr>\n                        <tr>\n                            <td style=\"border: 1px solid lightgray; padding: 8px;\">Service Fee (").concat(charges.repairfindServiceFeeRate, "%)</td>\n                            <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\">$").concat(charges.repairfindServiceFee, "</td>\n                        </tr>\n                        <tr>\n                            <td style=\"border: 1px solid lightgray; padding: 8px;\"><strong>Total Deducted</strong></td>\n                            <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\"><strong>$").concat(charges.repairfindServiceFee + charges.contractorProcessingFee, "</strong></td>\n                        </tr>\n                    </table>\n                    <p><strong>Net Amount to Contractor:</strong> $").concat(charges.subtotal, " + GST $").concat(charges.gstAmount, " - Total Deduction $").concat(charges.repairfindServiceFee + charges.contractorProcessingFee, " = $").concat(charges.contractorPayable, "</p>\n                    <p><strong>Payment Method:</strong> Card Payment<br>\n                    <strong>Transaction ID:</strong> RFT").concat(quotation.id, "</p>\n                ");
                        html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                        services_1.EmailService.send(contractor.email, emailSubject, html);
                        receipthtml = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: 'Payment Receipt', content: receipthtmlContent });
                        services_1.EmailService.send(contractor.email, 'Payment Receipt', receipthtml);
                    }
                    if (customer) {
                        dateTimeOptions = {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            timeZone: customer.currentTimezone,
                            timeZoneName: 'long'
                        };
                        jobDateCustomer = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(job.schedule.startDate));
                        currentDate = new Intl.DateTimeFormat('en-GB', dateTimeOptions).format(new Date(new Date));
                        emailSubject = 'New Job Payment';
                        emailContent = "\n                 <h2>".concat(emailSubject, "</h2>\n                  <p style=\"color: #333333;\">Hello ").concat(customer.name, ",</p>\n                  <p style=\"color: #333333;\">You have made a payment for a job on RepairFind.</p>\n                  <p><strong>Job Title:</strong> ").concat(job.description, "</p>\n                  <p><strong>Proposed Date:</strong>").concat(jobDateCustomer, "</p>\n                  <p style=\"color: #333333;\">Thank you for your payment!</p>\n                  <p style=\"color: #333333;\">If you did not initiate this payment, kindly reach out to us via support.</p>\n                ");
                        receiptContent = "\n                    <p><strong>RepairFind</strong><br>\n                    Phone: (604) 568-6378<br>\n                    Email: info@repairfind.ca</p>\n                    <hr>\n\n                    <p><strong>Receipt</strong></p>\n                    <p>Date: ".concat(currentDate, "<br>\n                    Receipt Number: RFC").concat(quotation.payment, "</p>\n                    <p><strong>Customer:</strong><br>\n                    ").concat(customer.name, "<br>\n                    ").concat((_b = customer === null || customer === void 0 ? void 0 : customer.location) === null || _b === void 0 ? void 0 : _b.address, "<br>\n\n                    <hr>\n                    <strong>Description:</strong>\n                    <strong>Job Title:</strong> ").concat(job.description, " <br>\n                    <strong>Scheduled Date:</strong> ").concat(jobDateCustomer, "\n\n                    <p><strong>Services/Charges:</strong></p>\n                    <table style=\"width: 100%; border-collapse: collapse; border: 1px solid lightgray; margin-bottom: 10px;\">\n                         ").concat(quotation.estimates.map(function (estimate) { return "\n                        <tr>\n                          <td style=\"border: 1px solid lightgray; padding: 8px;\"><strong>".concat(estimate.description, "</strong></td>\n                          <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\">$").concat((estimate.rate * estimate.quantity).toFixed(2), "</td>\n                        </tr>\n                      "); }).join(''), "   \n                        <tr>\n                            <td style=\"border: 1px solid lightgray; padding: 8px;\"><strong>Subtotal</strong></td>\n                            <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\"><strong>$").concat((charges.subtotal).toFixed(2), "</strong></td>\n                        </tr>\n                        <tr>\n                            <td style=\"border: 1px solid lightgray; padding: 8px;\">GST (").concat(charges.gstRate, "%)</td>\n                            <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\">$").concat(charges.gstAmount, "</td>\n                        </tr>\n                        <tr>\n                            <td style=\"border: 1px solid lightgray; padding: 8px;\">Payment Processing Fee (").concat(charges.customerProcessingFeeRate, "%)</td>\n                            <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\">$").concat(charges.customerProcessingFee, "</td>\n                        </tr>\n                       \n                        <tr>\n                            <td style=\"border: 1px solid lightgray; padding: 8px;\"><strong>Total Amount Due</strong></td>\n                            <td style=\"border: 1px solid lightgray; padding: 8px; text-align: right;\"><strong>$").concat(charges.customerPayable, "</strong></td>\n                        </tr>\n                    </table>\n                  <p><strong>Payment Method:</strong> Credit/Debit Card<br>\n                  <strong>Transaction ID:</strong> RPT").concat(quotation.id, "</p>\n                  <p style=\"color: #333333;\">Thank you for your payment!</p>\n                  <p style=\"color: #333333;\">If you did not initiate this payment, kindly reach out to us via support.</p>\n                ");
                        html = (0, generic_email_1.GenericEmailTemplate)({ name: customer.name, subject: emailSubject, content: emailContent });
                        services_1.EmailService.send(customer.email, emailSubject, html);
                        receipthtml = (0, generic_email_1.GenericEmailTemplate)({ name: customer.name, subject: 'Payment Receipt', content: receiptContent });
                        services_1.EmailService.send(customer.email, 'Payment Receipt', receipthtml);
                    }
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Booked',
                        type: 'JOB_BOOKED', // Conversation, Conversation_Notification
                        message: "You have booked a job on Repairfind",
                        heading: { name: "".concat(contractor.name), image: (_c = contractor.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "You have booked a job",
                            customer: customer.id,
                            contractor: contractor.id,
                            event: 'JOB_BOOKED',
                        }
                    }, { push: true, socket: true, database: true });
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Booked',
                        type: 'JOB_BOOKED', //
                        message: "You have a booked job on Repairfind",
                        heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_d = customer.profilePhoto) === null || _d === void 0 ? void 0 : _d.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "You have a booked job",
                            contractor: contractor.id,
                            customer: customer.id,
                            event: 'JOB_BOOKED',
                        }
                    }, { push: true, socket: true, database: true });
                    _e.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_13 = _e.sent();
                    logger_1.Logger.error("Error handling JOB_BOOKED event: ".concat(error_13));
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_DISPUTE_CREATED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var dispute, job, customer, contractor, error_14;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    logger_1.Logger.info('handling alert JOB_DISPUTE_CREATED event', payload.dispute);
                    dispute = payload.dispute;
                    return [4 /*yield*/, job_model_1.JobModel.findById(dispute.job)];
                case 1:
                    job = _c.sent();
                    if (!job) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 2:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 3:
                    contractor = _c.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Disputed',
                        type: 'JOB_DISPUTED',
                        message: "You have an open job dispute",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "You have an open job dispute",
                            customer: customer.id,
                            event: 'JOB_DISPUTED',
                        }
                    }, { database: true, push: true, socket: true });
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Disputed',
                        type: 'JOB_DISPUTED', //
                        message: "You have an open job dispute",
                        heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "You have an open job dispute",
                            contractor: contractor.id,
                            event: 'JOB_DISPUTED',
                        }
                    }, { database: true, push: true, socket: true });
                    // if (job.isAssigned) {
                    //     NotificationService.sendNotification({
                    //         user: job.assignment.contractor,
                    //         userType: 'contractors',
                    //         title: 'Job Disputed',
                    //         type: 'JOB_DISPUTED', //
                    //         message: `You have an open job dispute`,
                    //         heading: { name: `${customer.firstName} ${customer.lastName}`, image: customer.profilePhoto?.url },
                    //         payload: {
                    //             entity: dispute.id,
                    //             entityType: 'job_disputes',
                    //             message: `You have an open job dispute`,
                    //             contractor: contractor.id,
                    //             event: 'JOB_DISPUTED',
                    //         }
                    //     }, { database: true, push: true, socket: true })
                    // }
                    // send socket notification to general admins alert channel
                    socket_1.SocketService.broadcastChannel('admin_alerts', 'NEW_DISPUTED_JOB', {
                        type: 'NEW_DISPUTED_JOB',
                        message: 'A new Job dispute has been reported',
                        data: { dispute: dispute }
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_14 = _c.sent();
                    logger_1.Logger.error("Error handling JOB_DISPUTE_CREATED event: ".concat(error_14));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_MARKED_COMPLETE_BY_CONTRACTOR', function (payload) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var job, customer, contractor, event_2, error_15;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, , 5]);
                    logger_1.Logger.info('handling alert JOB_MARKED_COMPLETE_BY_CONTRACTOR event', payload.job.id);
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.job.id)];
                case 1:
                    job = _d.sent();
                    if (!job) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 2:
                    customer = _d.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 3:
                    contractor = _d.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    event_2 = (job.schedule.type == job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT) ? 'SITE_VISIT_MARKED_COMPLETE' : 'JOB_MARKED_COMPLETE';
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Marked Complete',
                        type: event_2,
                        message: "Contractor has marked job has completed",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Contractor has marked job has completed",
                            event: event_2,
                        }
                    }, { database: true, push: true, socket: true });
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Marked Complete',
                        type: event_2,
                        message: "Job marked as completed",
                        heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Job marked as completed",
                            event: event_2,
                        }
                    }, { database: true, push: true, socket: true });
                    if (job.isAssigned) {
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'Job Marked Complete',
                            type: event_2, //
                            message: "Job marked as completed",
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_c = customer.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "Job marked as completed",
                                contractor: contractor.id,
                                event: event_2,
                            }
                        }, { push: true, socket: true, database: true });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_15 = _d.sent();
                    logger_1.Logger.error("Error handling JOB_MARKED_COMPLETE_BY_CONTRACTOR event: ".concat(error_15));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_COMPLETED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var job, customer, contractor, event_3, transaction, metadata, error_16;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling alert JOB_COMPLETED event', payload.job.id);
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.job.id)];
                case 1:
                    job = _c.sent();
                    if (!job) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 2:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 3:
                    contractor = _c.sent();
                    event_3 = (job.schedule.type == job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT) ? 'COMPLETED_SITE_VISIT' : 'JOB_COMPLETED';
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Completed',
                        type: event_3, //
                        message: "Job completion confirmed by customer",
                        heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Job completion confirmed by customer",
                            contractor: contractor.id,
                            event: event_3,
                        }
                    }, { push: true, socket: true, database: true });
                    return [4 /*yield*/, transaction_model_1.default.findOne({ job: job.id, type: transaction_model_1.TRANSACTION_TYPE.ESCROW })];
                case 4:
                    transaction = _c.sent();
                    if (transaction) {
                        transaction.status = transaction_model_1.TRANSACTION_STATUS.APPROVED;
                        metadata = (_b = transaction.metadata) !== null && _b !== void 0 ? _b : {};
                        transaction.metadata = __assign(__assign({}, metadata), { event: event_3 });
                        transaction.save();
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_16 = _c.sent();
                    logger_1.Logger.error("Error handling JOB_COMPLETED event: ".concat(error_16));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_CHANGE_ORDER', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var job, jobDay, customer, contractor, state, event_4, error_17;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling JOB_CHANGE_ORDER event', payload.job.id);
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.job.id)];
                case 1:
                    job = _b.sent();
                    if (!job) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ job: job.id })];
                case 2:
                    jobDay = _b.sent();
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 3:
                    customer = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 4:
                    contractor = _b.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    state = job.isChangeOrder ? 'enabled' : 'disabled';
                    event_4 = job.isChangeOrder ? 'JOB_CHANGE_ORDER_ENABLED' : 'JOB_CHANGE_ORDER_DISABLED';
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Completed',
                        type: event_4, //
                        message: "Change order is ".concat(state, " for your job"),
                        heading: { name: "".concat(customer.name), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            jobId: job.id,
                            jobDayId: jobDay === null || jobDay === void 0 ? void 0 : jobDay.id,
                            message: "Change order is ".concat(state, " for your job"),
                            event: event_4,
                        }
                    }, { push: true, socket: true, database: true });
                    return [3 /*break*/, 6];
                case 5:
                    error_17 = _b.sent();
                    logger_1.Logger.error("Error handling JOB_CHANGE_ORDER event: ".concat(error_17));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('SITE_VISIT_ESTIMATE_SUBMITTED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var job, quotation, customer, contractor, jobDay, error_18;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling SITE_VISIT_ESTIMATE_SUBMITTED event', payload.job.id);
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.job.id)];
                case 1:
                    job = _c.sent();
                    quotation = payload.quotation;
                    if (!job) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 2:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 3:
                    contractor = _c.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ job: job.id })];
                case 4:
                    jobDay = _c.sent();
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Completed',
                        type: 'SITE_VISIT_ESTIMATE_SUBMITTED', //
                        message: "Site visit estimate has been submitted",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Site visit estimate has been submitted",
                            customer: customer.id,
                            event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                            jobDayId: jobDay === null || jobDay === void 0 ? void 0 : jobDay.id,
                            jobId: job.id,
                            quotationId: quotation.id,
                        }
                    }, { push: true, socket: true, database: true });
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Completed',
                        type: 'SITE_VISIT_ESTIMATE_SUBMITTED', //
                        message: "Site visit estimate has been submitted",
                        heading: { name: "".concat(customer.name), image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Site visit estimate has been submitted",
                            customer: customer.id,
                            event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                            jobDayId: jobDay === null || jobDay === void 0 ? void 0 : jobDay.id,
                            jobId: job.id,
                            quotationId: quotation.id,
                        }
                    }, { push: true, socket: true, database: true });
                    return [3 /*break*/, 6];
                case 5:
                    error_18 = _c.sent();
                    logger_1.Logger.error("Error handling SITE_VISIT_ESTIMATE_SUBMITTED event: ".concat(error_18));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('CHANGE_ORDER_ESTIMATE_SUBMITTED', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var job, quotation, customer, contractor, jobDay, error_19;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling CHANGE_ORDER_ESTIMATE_SUBMITTED event', payload.job.id);
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.job.id)];
                case 1:
                    job = _b.sent();
                    quotation = payload.quotation;
                    if (!job) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 2:
                    customer = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 3:
                    contractor = _b.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ job: job.id })];
                case 4:
                    jobDay = _b.sent();
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Change order estimate submitted',
                        type: 'CHANGE_ORDER_ESTIMATE_SUBMITTED', //
                        message: "Change order estimate has been submitted",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Change order estimate has been submitted",
                            customer: customer.id,
                            event: 'CHANGE_ORDER_ESTIMATE_SUBMITTED',
                            jobDayId: jobDay === null || jobDay === void 0 ? void 0 : jobDay.id,
                            jobId: job.id,
                            quotationId: quotation.id
                        }
                    }, { push: true, socket: true, database: true });
                    return [3 /*break*/, 6];
                case 5:
                    error_19 = _b.sent();
                    logger_1.Logger.error("Error handling CHANGE_ORDER_ESTIMATE_SUBMITTED event: ".concat(error_19));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('NEW_JOB_QUOTATION', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var job, quotation, customer, contractor, conversation, error_20;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    logger_1.Logger.info('handling NEW_JOB_QUOTATION event', payload.job.id);
                    job = payload.job;
                    quotation = payload.quotation;
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 1:
                    customer = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(quotation.contractor)];
                case 2:
                    contractor = _b.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(customer.id, 'customers', contractor.id, 'contractors')];
                case 3:
                    conversation = _b.sent();
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'New Job Bid',
                        type: 'NEW_JOB_QUOTATION', //
                        message: "Your job on Repairfind has received a new bid",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Your job on Repairfind has received a new bid",
                            customer: customer.id,
                            event: 'NEW_JOB_QUOTATION',
                            quotationId: quotation.id,
                            jobType: job.type,
                            conversation: conversation.id,
                        }
                    }, { push: true, socket: true, database: true });
                    return [3 /*break*/, 5];
                case 4:
                    error_20 = _b.sent();
                    logger_1.Logger.error("Error handling NEW_JOB_QUOTATION event: ".concat(error_20));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_QUOTATION_EDITED', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var job, quotation, customer, contractor, error_21;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    logger_1.Logger.info('handling JOB_QUOTATION_EDITED event', payload.job.id);
                    job = payload.job;
                    quotation = payload.quotation;
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 1:
                    customer = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(quotation.contractor)];
                case 2:
                    contractor = _b.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Bid Edited',
                        type: 'JOB_QUOTATION_EDITED', //
                        message: "Job estimate as been edited by contractor",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Job estimate as been edited by contractor",
                            customer: customer.id,
                            event: 'JOB_QUOTATION_EDITED',
                            quotationId: quotation.id,
                        }
                    }, { push: true, socket: true, database: true });
                    return [3 /*break*/, 4];
                case 3:
                    error_21 = _b.sent();
                    logger_1.Logger.error("Error handling JOB_QUOTATION_EDITED event: ".concat(error_21));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('CHANGE_ORDER_ESTIMATE_PAID', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var job, jobDay, customer, contractor, error_22;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    logger_1.Logger.info('handling CHANGE_ORDER_ESTIMATE_PAID event', payload.job.id);
                    job = payload.job;
                    if (!job)
                        return [2 /*return*/];
                    return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ job: job.id })];
                case 1:
                    jobDay = _b.sent();
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 2:
                    customer = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 3:
                    contractor = _b.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Change Order Estimate Paid',
                        type: 'CHANGE_ORDER_ESTIMATE_PAID', //
                        message: "Change order estimate has been paid",
                        heading: { name: "".concat(customer.name), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Change order estimate has been paid",
                            customer: customer.id,
                            event: 'CHANGE_ORDER_ESTIMATE_PAID',
                            jobId: job.id,
                            jobDayId: jobDay === null || jobDay === void 0 ? void 0 : jobDay.id
                        }
                    }, { push: true, socket: true, database: true });
                    return [3 /*break*/, 5];
                case 4:
                    error_22 = _b.sent();
                    logger_1.Logger.error("Error handling CHANGE_ORDER_ESTIMATE_PAID event: ".concat(error_22));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
// JOB DAY
exports.JobEvent.on('JOB_DAY_STARTED', function (payload) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var job, jobDay, customer, contractor, error_23;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling alert JOB_DAY_STARTED event', payload.job.id);
                    return [4 /*yield*/, payload.job];
                case 1:
                    job = _d.sent();
                    return [4 /*yield*/, payload.jobDay];
                case 2:
                    jobDay = _d.sent();
                    if (!job) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 3:
                    customer = _d.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 4:
                    contractor = _d.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    // send notification to contractor or company
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'JobDay Trip Started',
                        heading: { name: contractor.name, image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        type: 'JOB_DAY_STARTED',
                        message: 'JobDay trip  started',
                        payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id, entityType: 'jobs', entity: job.id }
                    }, {
                        push: true,
                        socket: true,
                        database: true
                    });
                    if (job.isAssigned) {
                        // send notification to  assigned contractor
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'JobDay Trip Started',
                            heading: { name: contractor.name, image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            type: 'JOB_DAY_STARTED',
                            message: 'JobDay trip  started',
                            payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id, entityType: 'jobs', entity: job.id }
                        }, {
                            push: true,
                            socket: true,
                            database: true
                        });
                    }
                    // send notification to customer
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Day',
                        heading: { name: customer.name, image: (_c = customer.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                        type: 'JOB_DAY_STARTED',
                        message: 'Contractor is on his way',
                        payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id, entityType: 'jobs', entity: job.id }
                    }, {
                        push: true,
                        socket: true,
                        database: true
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_23 = _d.sent();
                    logger_1.Logger.error("Error handling JOB_MARKED_COMPLETE_BY_CONTRACTOR event: ".concat(error_23));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_DAY_ARRIVAL', function (payload) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var jobDay, job, verificationCode, customer, contractor, error_24;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling alert JOB_DAY_ARRIVAL event', payload.jobDay.id);
                    return [4 /*yield*/, payload.jobDay];
                case 1:
                    jobDay = _d.sent();
                    return [4 /*yield*/, job_model_1.JobModel.findById(jobDay.job)];
                case 2:
                    job = _d.sent();
                    verificationCode = payload.verificationCode;
                    if (!job || !jobDay)
                        return [2 /*return*/];
                    return [4 /*yield*/, customer_model_1.default.findById(jobDay.customer)];
                case 3:
                    customer = _d.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(jobDay.contractor)];
                case 4:
                    contractor = _d.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    // send notification to  customer
                    services_1.NotificationService.sendNotification({
                        user: jobDay.customer.toString(),
                        userType: 'customers',
                        title: 'JobDay',
                        heading: { name: contractor.name, image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        type: 'JOB_DAY_ARRIVAL',
                        message: 'Contractor is at your site.',
                        payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode: verificationCode, entityType: 'jobs', entity: job.id }
                    }, {
                        push: true,
                        socket: true,
                        database: true
                    });
                    // send notification to  contractor
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'JobDay',
                        heading: { name: customer.name, image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                        type: 'JOB_DAY_ARRIVAL',
                        message: 'Job Day arrival, waiting for confirmation from customer.',
                        payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode: verificationCode, entityType: 'jobs', entity: job.id }
                    }, {
                        push: true,
                        socket: true,
                        database: true
                    });
                    if (job.isAssigned) {
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'JobDay',
                            heading: { name: customer.name, image: (_c = customer.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                            type: 'JOB_DAY_ARRIVAL',
                            message: 'Job Day arrival, waiting for confirmation from customer.',
                            payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode: verificationCode, entityType: 'jobs', entity: job.id }
                        }, {
                            push: true,
                            socket: true,
                            database: true
                        });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_24 = _d.sent();
                    logger_1.Logger.error("Error handling JOB_DAY_ARRIVAL event: ".concat(error_24));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_DAY_CONFIRMED', function (payload) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var jobDay, job, customer, contractor, error_25;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    logger_1.Logger.info('handling alert JOB_DAY_CONFIRMED event', payload.jobDay.id);
                    return [4 /*yield*/, payload.jobDay];
                case 1:
                    jobDay = _d.sent();
                    return [4 /*yield*/, job_model_1.JobModel.findById(jobDay.job)];
                case 2:
                    job = _d.sent();
                    if (!job || !jobDay)
                        return [2 /*return*/];
                    return [4 /*yield*/, customer_model_1.default.findById(jobDay.customer)];
                case 3:
                    customer = _d.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(jobDay.contractor)];
                case 4:
                    contractor = _d.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    // send notification to  contractor
                    services_1.NotificationService.sendNotification({
                        user: job.contractor,
                        userType: 'contractors',
                        title: 'JobDay confirmation',
                        heading: { name: customer.name, image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        type: 'JOB_DAY_CONFIRMED',
                        message: 'Customer has confirmed your arrival.',
                        payload: { event: 'JOB_DAY_CONFIRMED', jobDayId: jobDay.id, entityType: 'jobs', entity: job.id }
                    }, {
                        push: true,
                        socket: true,
                        database: true
                    });
                    if (job.assignment) {
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'JobDay confirmation',
                            heading: { name: customer.name, image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            type: 'JOB_DAY_CONFIRMED',
                            message: 'Customer has confirmed your arrival.',
                            payload: { event: 'JOB_DAY_CONFIRMED', jobDayId: jobDay.id, entityType: 'jobs', entity: job.id }
                        }, {
                            push: true,
                            socket: true,
                            database: true
                        });
                    }
                    // send notification to  customer
                    services_1.NotificationService.sendNotification({
                        user: job.customer,
                        userType: 'customers',
                        title: 'JobDay confirmation',
                        heading: { name: contractor.name, image: (_c = contractor.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                        type: 'JOB_DAY_CONFIRMED',
                        message: "You successfully confirmed the contractor's arrival.",
                        payload: { event: 'JOB_DAY_CONFIRMED', jobDayId: jobDay.id, entityType: 'jobs', entity: job.id }
                    }, {
                        push: true,
                        socket: true,
                        database: true
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_25 = _d.sent();
                    logger_1.Logger.error("Error handling JOB_DAY_CONFIRMED event: ".concat(error_25));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_REFUND_REQUESTED', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var job, payment, refund, customer, contractor, emailSubject, emailContent, html, error_26;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    logger_1.Logger.info('handling alert JOB_REFUND_REQUESTED event', payload.payment.id);
                    job = payload.job;
                    payment = payload.payment;
                    refund = payload.refund;
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 1:
                    customer = _a.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 2:
                    contractor = _a.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    emailSubject = 'Job Refund Requested';
                    emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p>Hello ").concat(customer.name, ",</p>\n                <p style=\"color: #333333;\">A refund for your job on Repairfind has been requested </p>\n                <p style=\"color: #333333;\">The refund should be completed in 24 hours </p>\n                <p><strong>Job Title:</strong> ").concat(job.description, "</p>\n                <p><strong>Job Amount</strong> ").concat(payment.amount, "</p>\n                <p><strong>Refund Amount:</strong> ").concat(refund.refundAmount, "</p>\n                ");
                    html = (0, generic_email_1.GenericEmailTemplate)({ name: customer.name, subject: emailSubject, content: emailContent });
                    services_1.EmailService.send(customer.email, emailSubject, html);
                    // send notification to  contractor
                    emailSubject = 'Job Refund Requested';
                    emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p>Hello ").concat(contractor.name, ",</p>\n                <p style=\"color: #333333;\">A refund for your job on Repairfind has been requested </p>\n                <p style=\"color: #333333;\">The refund should be completed in 24 hours </p>\n                <p><strong>Job Title:</strong> ").concat(job.description, "</p>\n                <p><strong>Job Amount</strong> ").concat(payment.amount, "</p>\n                <p><strong>Refund Amount:</strong> ").concat(refund.refundAmount, "</p>\n                ");
                    html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                    services_1.EmailService.send(contractor.email, emailSubject, html);
                    return [3 /*break*/, 4];
                case 3:
                    error_26 = _a.sent();
                    logger_1.Logger.error("Error handling JOB_REFUND_REQUESTED event: ".concat(error_26));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('NEW_JOB_ENQUIRY', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var job_1, enquiry, customer_1, contractor, savedJobs, contractorIds, devices, emailSubject, emailContent, html, error_27;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    logger_1.Logger.info('handling alert NEW_JOB_ENQUIRY event', payload.jobId);
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobId)];
                case 1:
                    job_1 = _b.sent();
                    return [4 /*yield*/, job_enquiry_model_1.JobEnquiryModel.findById(payload.enquiryId)];
                case 2:
                    enquiry = _b.sent();
                    if (!job_1 || !enquiry)
                        return [2 /*return*/];
                    return [4 /*yield*/, customer_model_1.default.findOne({ _id: job_1.customer })];
                case 3:
                    customer_1 = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: enquiry.contractor })];
                case 4:
                    contractor = _b.sent();
                    if (!customer_1 || !contractor)
                        return [2 /*return*/];
                    return [4 /*yield*/, contractor_saved_job_model_1.default.find({ job: job_1.id })];
                case 5:
                    savedJobs = _b.sent();
                    contractorIds = savedJobs.map(function (savedJob) { return savedJob.contractor; });
                    return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: { $in: contractorIds } })];
                case 6:
                    devices = _b.sent();
                    devices.map(function (device) {
                        var _a;
                        services_1.NotificationService.sendNotification({
                            user: device.contractor.toString(),
                            userType: 'contractors',
                            title: 'New Job Enquiry',
                            type: 'NEW_JOB_ENQUIRY',
                            heading: { name: customer_1.name, image: (_a = customer_1.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                            message: 'A Job you  saved on Repairfind has a new enquiry',
                            payload: { event: 'NEW_JOB_ENQUIRY', entityType: 'jobs', entity: job_1.id }
                        }, {
                            push: true,
                            socket: true,
                            database: true
                        });
                    });
                    if (customer_1) {
                        services_1.NotificationService.sendNotification({
                            user: job_1.customer,
                            userType: 'customers',
                            title: 'New Job Enquiry',
                            heading: { name: contractor.name, image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                            type: 'NEW_JOB_ENQUIRY',
                            message: 'Your job on Repairfind has a new enquiry',
                            payload: { event: 'NEW_JOB_ENQUIRY', entityType: 'jobs', entity: job_1.id }
                        }, { push: true, socket: true, database: true });
                        emailSubject = 'New Job Enquiry ';
                        emailContent = "\n                <h2>".concat(emailSubject, "</h2>\n                <p>Hello ").concat(customer_1.name, ",</p>\n                <p style=\"color: #333333;\">Your Job on Repairfind has a new enquiry</p>\n                <div style=\"background: whitesmoke;padding: 10px; border-radius: 10px;\">\n                <p style=\"border-bottom: 1px solid lightgray; padding-bottom: 5px;\"><strong>Job Title:</strong> ").concat(job_1.description, "</p>\n                <p style=\"border-bottom: 1px solid lightgray; padding-bottom: 5px;\"><strong>Enquiry:</strong> ").concat(enquiry.enquiry, "</p>\n                </div>\n                <p style=\"color: #333333;\">Do well to check and follow up as soon as possible </p>\n                ");
                        html = (0, generic_email_1.GenericEmailTemplate)({ name: customer_1.name, subject: emailSubject, content: emailContent });
                        services_1.EmailService.send(customer_1.email, emailSubject, html);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    error_27 = _b.sent();
                    logger_1.Logger.error("Error handling NEW_JOB_ENQUIRY event: ".concat(error_27));
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('NEW_JOB_ENQUIRY_REPLY', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var job_2, enquiry, customer_2, contractor, savedJobs, contractorIds, devices, deviceTokens, emailSubject, emailContent, html, error_28;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    logger_1.Logger.info('handling alert NEW_JOB_ENQUIRY_REPLY event', payload.jobId);
                    return [4 /*yield*/, job_model_1.JobModel.findById(payload.jobId)];
                case 1:
                    job_2 = _a.sent();
                    return [4 /*yield*/, job_enquiry_model_1.JobEnquiryModel.findById(payload.enquiryId)];
                case 2:
                    enquiry = _a.sent();
                    if (!job_2 || !enquiry)
                        return [2 /*return*/];
                    return [4 /*yield*/, customer_model_1.default.findOne({ _id: job_2.customer })];
                case 3:
                    customer_2 = _a.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: enquiry.contractor })];
                case 4:
                    contractor = _a.sent();
                    if (!customer_2 || !contractor)
                        return [2 /*return*/];
                    return [4 /*yield*/, contractor_saved_job_model_1.default.find({ job: job_2.id })];
                case 5:
                    savedJobs = _a.sent();
                    contractorIds = savedJobs.map(function (savedJob) { return savedJob.contractor; });
                    return [4 /*yield*/, contractor_devices_model_1.default.find({ contractor: { $in: contractorIds } })];
                case 6:
                    devices = _a.sent();
                    deviceTokens = devices.map(function (device) { return device.expoToken; });
                    devices.map(function (device) {
                        var _a;
                        services_1.NotificationService.sendNotification({
                            user: device.contractor.toString(),
                            userType: 'contractors',
                            title: 'New Job Enquiry Reply',
                            type: 'NEW_JOB_ENQUIRY_REPLY',
                            heading: { name: customer_2.name, image: (_a = customer_2.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                            message: 'A job you are following on Repairfind has a new reply from the customer',
                            payload: { event: 'NEW_JOB_ENQUIRY_REPLY', entityType: 'jobs', entity: job_2.id }
                        }, {
                            push: true,
                            socket: true,
                            database: true
                        });
                    });
                    // sendPushNotifications(deviceTokens, {
                    //     title: 'New Job Enquiry Reply',
                    //     type: 'NEW_JOB_ENQUIRY_REPLY',
                    //     icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                    //     body: 'A job you are following on Repairfind has a new reply from the customer',
                    //     data: {
                    //         entity: job.id,
                    //         entityType: 'jobs',
                    //         message: `A job you are following on Repairfind has a new reply from the customer`,
                    //         event: 'NEW_JOB_QUESTION_REPLY',
                    //     }
                    // })
                    // send notification to  contractor  that asked the question
                    if (customer_2 && contractor) {
                        emailSubject = 'Job Enquiry Reply';
                        emailContent = "\n                    <h2>".concat(emailSubject, "</h2>\n                    <p>Hello ").concat(contractor.name, ",</p>\n                    <p style=\"color: #333333;\">Customer has replied to your enquiry on Repairfind</p>\n                    <p style=\"color: #333333;\">Do well to check and follow up </p>\n                    <p><strong>Job Title:</strong> ").concat(job_2.description, "</p>\n                    <p><strong>Your Enquiry</strong> ").concat(enquiry.enquiry, "</p>\n                    <p><strong>Reply</strong> ").concat(enquiry.replies ? enquiry.replies[0] : '', "</p>\n                    ");
                        html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                        services_1.EmailService.send(contractor.email, emailSubject, html);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    error_28 = _a.sent();
                    logger_1.Logger.error("Error handling NEW_JOB_ENQUIRY_REPLY event: ".concat(error_28));
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
});
