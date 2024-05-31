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
var job_day_model_1 = require("../database/common/job_day.model");
var job_emergency_email_1 = require("../templates/common/job_emergency_email");
var generic_email_1 = require("../templates/common/generic_email");
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
                        // TODO: apply the guidline below and create cancelationData
                        // Cancel jobs: Customers have the option to cancel jobs based on the following guidelines:
                        // Free cancellation up to 48 hours before the scheduled job time..
                        // For cancellations made within 24 hours, regardless of the job's cost, a $50 cancellation fee is applied. 80% of this fee is directed to the contractor, while the remaining 20% is retained by us.
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
                    if (job && contractor && customer) {
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
                        // send socket notification to general admins alert channel
                        socket_1.SocketService.broadcastChannel('admin_alerts', 'NEW_JOB_EMERGENCY', {
                            type: 'NEW_JOB_EMERGENCY',
                            message: 'A new Job emergenc has been reported',
                            data: { emergency: payload.jobEmergency, job: job, customer: customer.toJSON(), contractor: contractor.toJSON() }
                        });
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
exports.JobEvent.on('JOB_RESHEDULE_DECLINED_ACCEPTED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, emailSubject, emailContent, html, emailSubject, emailContent, html, error_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    console.log('handling alert JOB_RESHEDULE_DECLINED_ACCEPTED event', payload.action);
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _c.sent();
                    if (contractor && customer) {
                        if (((_a = payload.job.reschedule) === null || _a === void 0 ? void 0 : _a.createdBy) == 'contractor') { // send mail to contractor
                            emailSubject = 'Job Schedule';
                            emailContent = "\n                <p style=\"color: #333333;\">Your Job reschedule request on Repairfind has been ".concat(payload.action, " by customer</p>\n                <p><strong>Job Title:</strong> ").concat(payload.job.description, "</p>\n                <p><strong>Proposed Date:</strong> ").concat(payload.job.reschedule.date, "</p>\n                ");
                            html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                            services_1.EmailService.send(contractor.email, emailSubject, html);
                        }
                        if (((_b = payload.job.reschedule) === null || _b === void 0 ? void 0 : _b.createdBy) == 'customer') { // send mail to  customer
                            emailSubject = 'Job Schedule';
                            emailContent = "\n                <p style=\"color: #333333;\">Your Job reschedule request on Repairfind has been ".concat(payload.action, "  by the contractor</p>\n                <p><strong>Job Title:</strong> ").concat(payload.job.description, "</p>\n                <p><strong>Proposed Date:</strong> ").concat(payload.job.reschedule.date, "</p>\n                ");
                            html = (0, generic_email_1.GenericEmailTemplate)({ name: customer.name, subject: emailSubject, content: emailContent });
                            services_1.EmailService.send(customer.email, emailSubject, html);
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _c.sent();
                    console.error("Error handling JOB_RESHEDULE_DECLINED_ACCEPTED event: ".concat(error_5));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('NEW_JOB_RESHEDULE_REQUEST', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var customer, contractor, emailSubject, emailContent, html, emailSubject, emailContent, html, error_6;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    console.log('handling alert NEW_JOB_RESHEDULE_REQUEST event', payload.action);
                    return [4 /*yield*/, customer_model_1.default.findById(payload.job.customer)];
                case 1:
                    customer = _c.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(payload.job.contractor)];
                case 2:
                    contractor = _c.sent();
                    if (contractor && customer) {
                        if (((_a = payload.job.reschedule) === null || _a === void 0 ? void 0 : _a.createdBy) == 'contractor') { // send mail to contractor
                            emailSubject = 'Job Schedule';
                            emailContent = "\n                <p style=\"color: #333333;\">Contractor has requested  to reschedule a job on RepairFind</p>\n                <p><strong>Job Title:</strong> ".concat(payload.job.description, "</p>\n                <p><strong>Proposed Date:</strong> ").concat(payload.job.reschedule.date, "</p>\n                ");
                            html = (0, generic_email_1.GenericEmailTemplate)({ name: customer.name, subject: emailSubject, content: emailContent });
                            services_1.EmailService.send(customer.email, emailSubject, html);
                        }
                        if (((_b = payload.job.reschedule) === null || _b === void 0 ? void 0 : _b.createdBy) == 'customer') { // send mail to  customer
                            emailSubject = 'Job Schedule';
                            emailContent = "\n                <p style=\"color: #333333;\">Customer has requested  to reschedule a job on RepairFind</p>\n                <p><strong>Job Title:</strong> ".concat(payload.job.description, "</p>\n                <p><strong>Proposed Date:</strong> ").concat(payload.job.reschedule.date, "</p>\n                ");
                            html = (0, generic_email_1.GenericEmailTemplate)({ name: contractor.name, subject: emailSubject, content: emailContent });
                            services_1.EmailService.send(contractor.email, emailSubject, html);
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _c.sent();
                    console.error("Error handling NEW_JOB_RESHEDULE_REQUEST event: ".concat(error_6));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_DISPUTE_CREATED', function (payload) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var dispute, job, customer, contractor, error_7;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, , 5]);
                    console.log('handling alert JOB_DISPUTE_CREATED event', payload.dispute);
                    dispute = payload.dispute;
                    return [4 /*yield*/, job_model_1.JobModel.findById(dispute.job)];
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
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Disputed',
                        type: 'JOB_DISPUTE', // Conversation, Conversation_Notification
                        //@ts-ignore
                        message: "You have an open job dispute",
                        //@ts-ignore
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "You have an open job dispute",
                            customer: customer.id,
                            event: 'JOB_DISPUTE',
                        }
                    }, { database: true, push: true, socket: true });
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Disputed',
                        type: 'JOB_DISPUTE', //
                        message: "You have an open job dispute",
                        heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                        payload: {
                            entity: dispute.id,
                            entityType: 'disputes',
                            message: "You have an open job dispute",
                            contractor: contractor.id,
                            event: 'JOB_DISPUTE',
                        }
                    }, { database: true, push: true, socket: true });
                    if (job.isAssigned) {
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'Job Disputed',
                            type: 'JOB_DISPUTE', //
                            message: "You have an open job dispute",
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_c = customer.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                            payload: {
                                entity: dispute.id,
                                entityType: 'disputes',
                                message: "You have an open job dispute",
                                contractor: contractor.id,
                                event: 'JOB_DISPUTE',
                            }
                        }, { database: true, push: true, socket: true });
                    }
                    // send socket notification to general admins alert channel
                    socket_1.SocketService.broadcastChannel('admin_alerts', 'NEW_JOB_DISPUTE', {
                        type: 'NEW_JOB_EMERGENCY',
                        message: 'A new Job emergenc has been reported',
                        data: { dispute: dispute }
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_7 = _d.sent();
                    console.error("Error handling JOB_DISPUTE_CREATED event: ".concat(error_7));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_MARKED_COMPLETE_BY_CONTRACTOR', function (payload) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var job, customer, contractor, event_1, error_8;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 4, , 5]);
                    console.log('handling alert JOB_MARKED_COMPLETE_BY_CONTRACTOR event', payload.job.id);
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
                    event_1 = (job.schedule.type == job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT) ? 'SITE_VISIT_MARKED_COMPLETE' : 'JOB_MARKED_COMPLETE';
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Job Marked Complete',
                        type: event_1,
                        message: "contractor has marked job has completed",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "contractor has marked job has completed",
                            event: event_1,
                        }
                    }, { database: true, push: true, socket: true });
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Marked Complete',
                        type: event_1,
                        message: "Job marked as completed",
                        heading: { name: "".concat(contractor.name), image: (_b = contractor.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Job marked as completed",
                            event: event_1,
                        }
                    }, { database: true, push: true, socket: true });
                    if (job.isAssigned) {
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'Job Disputed',
                            type: 'JOB_DISPUTE', //
                            message: "You have an open job dispute",
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_c = customer.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "You have an open job dispute",
                                contractor: contractor.id,
                                event: 'JOB_DISPUTE',
                            }
                        }, { database: true, push: true, socket: true });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_8 = _d.sent();
                    console.error("Error handling JOB_MARKED_COMPLETE_BY_CONTRACTOR event: ".concat(error_8));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_COMPLETED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var job, customer, contractor, event_2, error_9;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    console.log('handling alert JOB_COMPLETED event', payload.job.id);
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
                    event_2 = (job.schedule.type == job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT) ? 'COMPLETED_SITE_VISIT' : 'JOB_COMPLETED';
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Completed',
                        type: event_2, //
                        message: "Job completion confirmed by customer",
                        heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "Job completion confirmed by customer",
                            contractor: contractor.id,
                            event: event_2,
                        }
                    }, { push: true, socket: true });
                    if (job.isAssigned) {
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'Job Completed',
                            type: event_2,
                            message: "Job completion confirmed by customer",
                            heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "Job completion confirmed by customer",
                                contractor: contractor.id,
                                event: event_2,
                            }
                        }, { push: true, socket: true });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_9 = _c.sent();
                    console.error("Error handling JOB_COMPLETED event: ".concat(error_9));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_CHANGE_ORDER', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var job, customer, contractor, state, event_3, error_10;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 4, , 5]);
                    console.log('handling JOB_CHANGE_ORDER event', payload.job.id);
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
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    state = job.isChangeOrder ? 'enabled' : 'disabled';
                    event_3 = job.isChangeOrder ? 'JOB_CHANGE_ORDER_ENABLED' : 'JOB_CHANGE_ORDER_DISABLED';
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Completed',
                        type: event_3, //
                        message: "change order is ".concat(state, " for your job"),
                        heading: { name: "".concat(customer.name), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "change order is ".concat(state, " for your job"),
                            event: event_3,
                        }
                    }, { push: true, socket: true });
                    if (job.isAssigned) {
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'Job Completed',
                            type: event_3, //
                            message: "Change order is ".concat(state),
                            heading: { name: "".concat(customer.name), image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "Change order is ".concat(state),
                                event: event_3,
                            }
                        }, { push: true, socket: true });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_10 = _c.sent();
                    console.error("Error handling JOB_CHANGE_ORDER event: ".concat(error_10));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('SITE_VISIT_ESTIMATE_SUBMITTED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var job, customer, contractor, jobDay, error_11;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    console.log('handling SITE_VISIT_ESTIMATE_SUBMITTED event', payload.job.id);
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
                        message: "change order estimate has been submitted",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "site visit estimate has been submitted",
                            customer: customer.id,
                            event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                            jobDayId: jobDay === null || jobDay === void 0 ? void 0 : jobDay.id,
                            jobId: job.id,
                        }
                    }, { push: true, socket: true });
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Job Completed',
                        type: 'SITE_VISIT_ESTIMATE_SUBMITTED', //
                        message: "change order estimate has been submitted",
                        heading: { name: "".concat(customer.name), image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "site visit estimate has been submitted",
                            customer: customer.id,
                            event: 'SITE_VISIT_ESTIMATE_SUBMITTED',
                            jobDayId: jobDay === null || jobDay === void 0 ? void 0 : jobDay.id,
                            jobId: job.id,
                        }
                    }, { push: true, socket: true });
                    return [3 /*break*/, 6];
                case 5:
                    error_11 = _c.sent();
                    console.error("Error handling SITE_VISIT_ESTIMATE_SUBMITTED event: ".concat(error_11));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('CHANGE_ORDER_ESTIMATE_SUBMITTED', function (payload) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var job, customer, contractor, jobDay, error_12;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 5, , 6]);
                    console.log('handling CHANGE_ORDER_ESTIMATE_SUBMITTED event', payload.job.id);
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
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ job: job.id })];
                case 4:
                    jobDay = _c.sent();
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'Change order estimate submitted',
                        type: 'CHANGE_ORDER_ESTIMATE_SUBMITTED', //
                        message: "change order estimate has been submitted",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "change order estimate has been submitted",
                            customer: customer.id,
                            event: 'CHANGE_ORDER_ESTIMATE_SUBMITTED',
                            jobDayId: jobDay === null || jobDay === void 0 ? void 0 : jobDay.id,
                            jobId: job.id,
                            extraEstimate: payload.quotation
                        }
                    }, { push: true, socket: true });
                    if (job.isAssigned) {
                        services_1.NotificationService.sendNotification({
                            user: contractor.id,
                            userType: 'contractors',
                            title: 'Change order estimate submitted',
                            type: 'CHANGE_ORDER_ESTIMATE_SUBMITTED', //
                            message: "change order estimate has been submitted",
                            heading: { name: "".concat(customer.name), image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                            payload: {
                                entity: job.id,
                                entityType: 'jobs',
                                message: "change order estimate has been submitted",
                                customer: customer.id,
                                event: 'CHANGE_ORDER_ESTIMATE_SUBMITTED',
                                jobDayId: jobDay === null || jobDay === void 0 ? void 0 : jobDay.id,
                                jobId: job.id,
                                extraEstimate: payload.quotation
                            }
                        }, { push: true, socket: true });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_12 = _c.sent();
                    console.error("Error handling CHANGE_ORDER_ESTIMATE_SUBMITTED event: ".concat(error_12));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('CHANGE_ORDER_ESTIMATE_PAID', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var job, customer, contractor, error_13;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    console.log('handling CHANGE_ORDER_ESTIMATE_PAID event', payload.job.id);
                    job = payload.job;
                    if (!job)
                        return [2 /*return*/];
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 1:
                    customer = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 2:
                    contractor = _b.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'Change Order Estimate Paid',
                        type: 'CHANGE_ORDER_ESTIMATE_PAID', //
                        message: "change order estimate has been paid",
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: "change order estimate has been paid",
                            customer: customer.id,
                            event: 'CHANGE_ORDER_ESTIMATE_PAID',
                            extraEstimate: payload.extraEstimate,
                            jobId: job.id
                        }
                    }, { push: true, socket: true });
                    return [3 /*break*/, 4];
                case 3:
                    error_13 = _b.sent();
                    console.error("Error handling CHANGE_ORDER_ESTIMATE_PAID event: ".concat(error_13));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
// JOB DAY
exports.JobEvent.on('JOB_DAY_STARTED', function (payload) {
    return __awaiter(this, void 0, void 0, function () {
        var job, jobDay, customer, contractor, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    console.log('handling alert JOB_DAY_STARTED event', payload.job.id);
                    return [4 /*yield*/, payload.job];
                case 1:
                    job = _a.sent();
                    return [4 /*yield*/, payload.jobDay];
                case 2:
                    jobDay = _a.sent();
                    if (!job) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
                case 3:
                    customer = _a.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
                case 4:
                    contractor = _a.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    // send notification to contractor or company
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'jobDay',
                        heading: {},
                        type: 'JOB_DAY_STARTED',
                        message: 'jobday tripe successfully started',
                        payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id }
                    }, {
                        push: true,
                        socket: true,
                        // database: true
                    });
                    if (job.isAssigned) {
                        // send notification to  assigned contractor
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'jobDay',
                            heading: {},
                            type: 'JOB_DAY_STARTED',
                            message: 'jobday tripe successfully started',
                            payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id }
                        }, {
                            push: true,
                            socket: true,
                            // database: true
                        });
                    }
                    // send notification to customer
                    services_1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: 'jobDay',
                        heading: {},
                        type: 'JOB_DAY_STARTED',
                        message: 'Contractor starts jobDay to your site.',
                        payload: { event: 'JOB_DAY_STARTED', jobDayId: jobDay._id }
                    }, {
                        push: true,
                        socket: true,
                        // database: true
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_14 = _a.sent();
                    console.error("Error handling JOB_MARKED_COMPLETE_BY_CONTRACTOR event: ".concat(error_14));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
exports.JobEvent.on('JOB_DAY_ARRIVAL', function (payload) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var jobDay, job, verificationCode, customer, contractor, error_15;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    console.log('handling alert JOB_DAY_STARTED event', payload.jobDay.id);
                    return [4 /*yield*/, payload.jobDay];
                case 1:
                    jobDay = _b.sent();
                    return [4 /*yield*/, job_model_1.JobModel.findById(jobDay.id)];
                case 2:
                    job = _b.sent();
                    verificationCode = payload.verificationCode;
                    if (!job || !jobDay)
                        return [2 /*return*/];
                    return [4 /*yield*/, customer_model_1.default.findById(jobDay.customer)];
                case 3:
                    customer = _b.sent();
                    return [4 /*yield*/, contractor_model_1.ContractorModel.findById(jobDay.contractor)];
                case 4:
                    contractor = _b.sent();
                    if (!customer || !contractor)
                        return [2 /*return*/];
                    // send notification to  customer
                    services_1.NotificationService.sendNotification({
                        user: jobDay.customer.toString(),
                        userType: 'customers',
                        title: 'jobDay',
                        heading: { name: contractor.name, image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        type: 'JOB_DAY_ARRIVAL',
                        message: 'Contractor is at your site.',
                        payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode: verificationCode }
                    }, {
                        push: true,
                        socket: true,
                    });
                    // send notification to  contractor
                    services_1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: 'jobDay',
                        heading: {},
                        type: 'JOB_DAY_ARRIVAL',
                        message: 'Job Day arrival, waiting for comfirmation from customer.',
                        payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode: verificationCode }
                    }, {
                        push: true,
                        socket: true,
                    });
                    if (job.isAssigned) {
                        services_1.NotificationService.sendNotification({
                            user: job.assignment.contractor,
                            userType: 'contractors',
                            title: 'jobDay',
                            heading: {},
                            type: 'JOB_DAY_ARRIVAL',
                            message: 'Job Day arrival, waiting for comfirmation from customer.',
                            payload: { event: 'JOB_DAY_ARRIVAL', jobDayId: jobDay.id, verificationCode: verificationCode }
                        }, {
                            push: true,
                            socket: true,
                        });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_15 = _b.sent();
                    console.error("Error handling JOB_MARKED_COMPLETE_BY_CONTRACTOR event: ".concat(error_15));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
