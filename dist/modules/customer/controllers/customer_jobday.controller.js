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
exports.CustomerJobDayController = exports.rejectJobDayCompletion = exports.confirmJobDayCompletion = exports.createJobDispute = exports.createJobEmergency = exports.savePostJobQualityAssurance = exports.savePreJobJobQualityAssurance = exports.confirmContractorArrival = exports.initiateJobDay = void 0;
var express_validator_1 = require("express-validator");
var job_day_model_1 = require("../../../database/common/job_day.model");
var job_emergency_model_1 = require("../../../database/common/job_emergency.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var events_1 = require("../../../events");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var job_model_1 = require("../../../database/common/job.model");
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_dispute_model_1 = require("../../../database/common/job_dispute.model");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var initiateJobDay = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, customerId, job, jobDay, contractorId, findContractor, contractor, customer, contractorProfile, conversationMembers, conversation, contractorLocation, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                jobId = req.body.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, customer: customerId }).populate('customer', 'contractor')];
            case 1:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job  not found' })];
                }
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ job: jobId, type: job.schedule.type, status: { $nin: [job_day_model_1.JOB_DAY_STATUS.DISPUTED, job_day_model_1.JOB_DAY_STATUS.COMPLETED] } })];
            case 2:
                jobDay = _a.sent();
                if (!jobDay) {
                    // return res.status(400).json({ success: false, message: 'No job for the current schedule type' });
                }
                contractorId = job.contractor;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
            case 3:
                findContractor = _a.sent();
                if (!findContractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job Contractor not found' })];
                }
                contractor = findContractor === null || findContractor === void 0 ? void 0 : findContractor.toJSON();
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: job.customer })];
            case 4:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job Customer not found' })];
                }
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
            case 5:
                contractorProfile = _a.sent();
                if (!contractorProfile) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor profile not found' })];
                }
                conversationMembers = [
                    { memberType: 'customers', member: job.customer },
                    { memberType: 'contractors', member: contractorId }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        $and: [
                            { members: { $elemMatch: { member: job.customer } } }, // memberType: 'customers'
                            { members: { $elemMatch: { member: contractorId } } } // memberType: 'contractors'
                        ]
                    }, {
                        members: conversationMembers,
                        lastMessage: 'I have accepted your Job request', // Set the last message to the job description
                        lastMessageAt: new Date() // Set the last message timestamp to now
                    }, { new: true, upsert: true })];
            case 6:
                conversation = _a.sent();
                contractorLocation = contractorProfile.location;
                if (!job.isAssigned) return [3 /*break*/, 8];
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: job.assignment.contractor })];
            case 7:
                contractorProfile = _a.sent();
                if (contractorProfile)
                    contractorLocation = contractorProfile === null || contractorProfile === void 0 ? void 0 : contractorProfile.location;
                _a.label = 8;
            case 8:
                data = {
                    conversation: conversation.id,
                    customer: { id: customer.id, phoneNumber: customer.phoneNumber, name: customer.name, email: customer.email, profilePhoto: customer.profilePhoto },
                    contractor: { id: contractor.id, phoneNumber: contractor.phoneNumber, name: contractor.name, email: contractor.email, profilePhoto: contractor.profilePhoto },
                    job: { id: job.id, description: job.description, title: job.title, schedule: job.schedule, type: job.type, date: job.date, location: job.location },
                    contractorLocation: contractorLocation,
                    jobDay: jobDay
                };
                res.json({
                    success: true,
                    message: "JobDay successfully initiated",
                    data: data
                });
                return [3 /*break*/, 10];
            case 9:
                err_1 = _a.sent();
                console.log("error", err_1);
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.initiateJobDay = initiateJobDay;
var confirmContractorArrival = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobDayId, verificationCode, errors, customerId, jobDay, job, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                jobDayId = req.params.jobDayId;
                verificationCode = req.body.verificationCode;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ _id: jobDayId })];
            case 1:
                jobDay = _a.sent();
                if (!jobDay) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'JobDay not found' })];
                }
                if (jobDay.status != job_day_model_1.JOB_DAY_STATUS.ARRIVED) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Contractor has not arrived yet' })];
                }
                if (jobDay.verified) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'JobDay has already been verified' })];
                }
                if (jobDay.verificationCode !== verificationCode) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Incorrect verification code' })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findById(jobDay.job)];
            case 2:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job not found' })];
                }
                job.status = (job.schedule.type == job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT) ? job_model_1.JOB_STATUS.ONGOING_SITE_VISIT : job_model_1.JOB_STATUS.ONGOING;
                jobDay.status = job_day_model_1.JOB_DAY_STATUS.CONFIRMED;
                jobDay.verified = true;
                return [4 /*yield*/, jobDay.save()];
            case 3:
                _a.sent();
                return [4 /*yield*/, job.save()];
            case 4:
                _a.sent();
                events_1.JobEvent.emit('JOB_DAY_CONFIRMED', { jobDay: jobDay });
                return [2 /*return*/, res.json({
                        success: true,
                        message: "Contractor arrival successfully confirmed",
                        data: jobDay
                    })];
            case 5:
                err_2 = _a.sent();
                console.log("error", err_2);
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.confirmContractorArrival = confirmContractorArrival;
var savePreJobJobQualityAssurance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobDayId, _a, media, errors, customerId, jobDay, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                jobDayId = req.params.jobDayId;
                _a = req.body.media, media = _a === void 0 ? [] : _a;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ _id: jobDayId })];
            case 1:
                jobDay = _b.sent();
                if (!jobDay) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'jobDay not found' })];
                }
                if (jobDay.status != job_day_model_1.JOB_DAY_STATUS.CONFIRMED) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'contractor has not been confirmed yet' })];
                }
                jobDay.customerPreJobMedia = media;
                return [4 /*yield*/, jobDay.save()];
            case 2:
                _b.sent();
                res.json({
                    success: true,
                    message: "Pre Job Quality Assurance Media saved",
                    data: jobDay
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                console.log("error", err_3);
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.savePreJobJobQualityAssurance = savePreJobJobQualityAssurance;
var savePostJobQualityAssurance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobDayId, _a, media, errors, customerId, jobDay, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                jobDayId = req.params.jobDayId;
                _a = req.body.media, media = _a === void 0 ? [] : _a;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ _id: jobDayId })];
            case 1:
                jobDay = _b.sent();
                if (!jobDay) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'jobDay not found' })];
                }
                if (jobDay.status != job_day_model_1.JOB_DAY_STATUS.CONFIRMED) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'contractor has not been confirmed yet' })];
                }
                jobDay.customerPostJobMedia = media;
                return [4 /*yield*/, jobDay.save()];
            case 2:
                _b.sent();
                res.json({
                    success: true,
                    message: "Post Job Quality Assurance Media saved",
                    data: jobDay
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                console.log("error", err_4);
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.savePostJobQualityAssurance = savePostJobQualityAssurance;
var createJobEmergency = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, description, priority, date, media, customer, triggeredBy, jobDayId, jobDay, jobEmergency, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, description = _a.description, priority = _a.priority, date = _a.date, media = _a.media;
                customer = req.customer.id;
                triggeredBy = 'customer';
                jobDayId = req.params.jobDayId;
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ _id: jobDayId })];
            case 1:
                jobDay = _b.sent();
                if (!jobDay) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'jobDay not found' })];
                }
                return [4 /*yield*/, job_emergency_model_1.JobEmergencyModel.create({
                        job: jobDay.job,
                        customer: jobDay.customer,
                        contractor: jobDay.contractor,
                        description: description,
                        priority: priority,
                        date: new Date,
                        triggeredBy: triggeredBy,
                        media: media,
                    })];
            case 2:
                jobEmergency = _b.sent();
                events_1.JobEvent.emit('JOB_DAY_EMERGENCY', { jobEmergency: jobEmergency });
                return [2 /*return*/, res.status(201).json({ success: true, message: 'Job emergency created successfully', data: jobEmergency })];
            case 3:
                error_1 = _b.sent();
                next(new custom_errors_1.InternalServerError('Error creating job emergency:', error_1));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createJobEmergency = createJobEmergency;
var createJobDispute = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, description, evidence, jobDayId, customerId, errors, jobDay, job, dispute, contractorId, conversationMembers, conversation, disputeEvidence, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                _a = req.body, description = _a.description, evidence = _a.evidence;
                jobDayId = req.params.jobDayId;
                customerId = req.customer.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, job_day_model_1.JobDayModel.findById(jobDayId)];
            case 1:
                jobDay = _c.sent();
                if (!jobDay) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findById(jobDay.job)];
            case 2:
                job = _c.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if user is customer or contractor for the job
                if (!(job.customer == customerId) && !(job.contractor == customerId)) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Unauthorized to create dispute for this job' })];
                }
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOneAndUpdate({
                        job: job.id
                    }, {
                        description: description,
                        job: job._id,
                        customer: job.customer,
                        contractor: job.contractor,
                        disputer: job.customer,
                        disputerType: 'customers',
                        status: job_dispute_model_1.JOB_DISPUTE_STATUS.OPEN,
                    }, { new: true, upsert: true })];
            case 3:
                dispute = _c.sent();
                contractorId = job.contractor;
                conversationMembers = [
                    { memberType: 'customers', member: customerId },
                    { memberType: 'contractors', member: contractorId }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        type: conversations_schema_1.CONVERSATION_TYPE.GROUP_CHAT,
                        entity: dispute.id,
                        entityType: 'job_disputes',
                        $and: [
                            { members: { $elemMatch: { member: customerId } } }, // memberType: 'customers'
                            { members: { $elemMatch: { member: contractorId } } } // memberType: 'contractors'
                        ]
                    }, {
                        members: conversationMembers,
                        lastMessage: "New Dispute Created: ".concat(description), // Set the last message to the job description
                        lastMessageAt: new Date() // Set the last message timestamp to now
                    }, { new: true, upsert: true })];
            case 4:
                conversation = _c.sent();
                if (evidence) {
                    disputeEvidence = evidence.map(function (url) { return ({
                        url: url,
                        addedBy: 'customer',
                        addedAt: new Date(),
                    }); });
                    (_b = dispute.evidence).push.apply(_b, disputeEvidence);
                }
                dispute.conversation = conversation.id;
                return [4 /*yield*/, dispute.save()];
            case 5:
                _c.sent();
                job.status = job_model_1.JOB_STATUS.DISPUTED;
                job.statusUpdate = {
                    isContractorAccept: true,
                    isCustomerAccept: false,
                    awaitingConfirmation: false,
                    status: 'REJECTED',
                };
                return [4 /*yield*/, job.save()];
            case 6:
                _c.sent();
                events_1.JobEvent.emit('JOB_DISPUTE_CREATED', { dispute: dispute });
                return [2 /*return*/, res.status(201).json({ success: true, message: 'Job dispute created successfully', data: dispute })];
            case 7:
                error_2 = _c.sent();
                next(new custom_errors_1.InternalServerError('Error creating job dispute:', error_2));
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createJobDispute = createJobDispute;
var confirmJobDayCompletion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, jobDayId, jobDay, customer, job, quotation, jobStatus, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                customerId = req.customer.id;
                jobDayId = req.params.jobDayId;
                return [4 /*yield*/, job_day_model_1.JobDayModel.findById(jobDayId)];
            case 1:
                jobDay = _a.sent();
                if (!jobDay) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job Day not found' })];
                }
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 2:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer not found' })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findById(jobDay.job)];
            case 3:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findById(job.contract)];
            case 4:
                quotation = _a.sent();
                if (!quotation)
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job quotation not found' })];
                // Check if the contractor is the owner of the job
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to mark  this booking as complete' })];
                }
                if (!job.statusUpdate) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor has not yet created a status update' })];
                }
                if (!job.statusUpdate.awaitingConfirmation) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor has not requested for a status update' })];
                }
                jobStatus = (job.schedule.type == job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT) ? job_model_1.JOB_STATUS.COMPLETED_SITE_VISIT : job_model_1.JOB_STATUS.COMPLETED;
                job.statusUpdate = __assign(__assign({}, job.statusUpdate), { status: jobStatus, isCustomerAccept: true, awaitingConfirmation: false });
                // if schedul was a site visit
                //change job to pending and quotation type to jobday
                if (job.schedule.type == job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT) {
                    job.status = job_model_1.JOB_STATUS.PENDING;
                    quotation.type = job_quotation_model_1.JOB_QUOTATION_TYPE.JOB_DAY;
                }
                job.status = jobStatus; // since its customer accepting job completion
                jobDay.status = job_day_model_1.JOB_DAY_STATUS.COMPLETED;
                job.jobHistory.push({
                    eventType: 'JOB_MARKED_COMPLETE_BY_CUSTOMER',
                    timestamp: new Date(),
                    payload: {}
                });
                //TODO: Set job ended date on job.schedule
                job.schedule.endDate = new Date();
                events_1.JobEvent.emit('JOB_COMPLETED', { job: job });
                return [4 /*yield*/, job.save()];
            case 5:
                _a.sent();
                return [4 /*yield*/, jobDay.save()];
            case 6:
                _a.sent();
                res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
                return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_3))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.confirmJobDayCompletion = confirmJobDayCompletion;
var rejectJobDayCompletion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, jobDayId, jobDay, customer, job, quotation, jobStatus, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                customerId = req.customer.id;
                jobDayId = req.params.jobDayId;
                return [4 /*yield*/, job_day_model_1.JobDayModel.findById(jobDayId)];
            case 1:
                jobDay = _a.sent();
                if (!jobDay) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job Day not found' })];
                }
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 2:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer not found' })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findById(jobDay.job)];
            case 3:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findById(job.contract)];
            case 4:
                quotation = _a.sent();
                if (!quotation)
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job quotation not found' })];
                // Check if the contractor is the owner of the job
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to mark  this booking as complete' })];
                }
                if (!job.statusUpdate.awaitingConfirmation) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor has not requested for a status update' })];
                }
                jobStatus = (job.schedule.type == job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT) ? job_model_1.JOB_STATUS.DISPUTED : job_model_1.JOB_STATUS.DISPUTED;
                job.statusUpdate = __assign(__assign({}, job.statusUpdate), { status: 'REJECTED', isCustomerAccept: true, awaitingConfirmation: false });
                job.status = jobStatus; // since its customer accepting job completion
                jobDay.status = job_day_model_1.JOB_DAY_STATUS.COMPLETED;
                job.jobHistory.push({
                    eventType: 'JOB_MARKED_COMPLETE_BY_CUSTOMER',
                    timestamp: new Date(),
                    payload: {}
                });
                events_1.JobEvent.emit('JOB_COMPLETED', { job: job });
                return [4 /*yield*/, job.save()];
            case 5:
                _a.sent();
                return [4 /*yield*/, jobDay.save()];
            case 6:
                _a.sent();
                res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
                return [3 /*break*/, 8];
            case 7:
                error_4 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_4))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.rejectJobDayCompletion = rejectJobDayCompletion;
exports.CustomerJobDayController = {
    confirmContractorArrival: exports.confirmContractorArrival,
    savePostJobQualityAssurance: exports.savePostJobQualityAssurance,
    savePreJobJobQualityAssurance: exports.savePreJobJobQualityAssurance,
    createJobEmergency: exports.createJobEmergency,
    initiateJobDay: exports.initiateJobDay,
    createJobDispute: exports.createJobDispute,
    confirmJobDayCompletion: exports.confirmJobDayCompletion,
};
