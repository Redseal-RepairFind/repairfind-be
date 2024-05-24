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
exports.ContractorJobDayController = exports.savePostJobQualityAssurance = exports.savePreJobJobQualityAssurance = exports.createJobDispute = exports.createJobEmergency = exports.confirmArrival = exports.initiateJobDay = exports.startTrip = void 0;
var express_validator_1 = require("express-validator");
var job_model_1 = require("../../../database/common/job.model");
var otpGenerator_1 = require("../../../utils/otpGenerator");
var index_1 = require("../../../services/notifications/index");
var job_day_model_1 = require("../../../database/common/job_day.model");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var events_1 = require("../../../events");
var job_emergency_model_1 = require("../../../database/common/job_emergency.model");
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_dispute_model_1 = require("../../../database/common/job_dispute.model");
var startTrip = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, contractorId, job, activeTrip, trip, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                jobId = req.body.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, contractor: contractorId, status: job_model_1.JOB_STATUS.BOOKED })];
            case 1:
                job = _a.sent();
                // Check if the job request exists
                if (!job) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job request not found' })];
                }
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ job: jobId, status: job_day_model_1.JOB_DAY_STATUS.STARTED })];
            case 2:
                activeTrip = _a.sent();
                if (activeTrip) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'An active trip already exists for this job' })];
                }
                return [4 /*yield*/, job_day_model_1.JobDayModel.create({
                        customer: job.customer,
                        contractor: contractorId,
                        job: jobId,
                        status: job_day_model_1.JOB_DAY_STATUS.STARTED,
                        type: job.schedule.type
                    })
                    // send notification to contractor
                ];
            case 3:
                trip = _a.sent();
                // send notification to contractor
                index_1.NotificationService.sendNotification({
                    user: contractorId,
                    userType: 'contractors',
                    title: 'trip',
                    heading: {},
                    type: 'JOB_DAY_STARTED',
                    message: 'trip successfully started',
                    payload: { jobDayId: trip._id }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                // send notification to customer
                index_1.NotificationService.sendNotification({
                    user: job.customer.toString(),
                    userType: 'customers',
                    title: 'trip',
                    heading: {},
                    type: 'JOB_DAY_STARTED',
                    message: 'Contractor starts trip to your site.',
                    payload: { jobDayId: trip._id }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                res.json({
                    success: true,
                    message: "trip successfully started",
                    data: { jobLocation: job.location, trip: trip }
                });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.log("error", err_1);
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.startTrip = startTrip;
var initiateJobDay = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, contractorId, contractorProfile, contractor, job, customer, activeTrip, conversationMembers, conversation, data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                jobId = req.body.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
            case 1:
                contractorProfile = _a.sent();
                if (!contractorProfile) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Contractor profile not found' })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 2:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job Contractor not found' })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, contractor: contractorId, status: job_model_1.JOB_STATUS.BOOKED })];
            case 3:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job booking not found' })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: job.customer })];
            case 4:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job Customer not found' })];
                }
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ job: jobId, status: { $in: ['STARTED', 'ARRIVED', 'CONFIRMED', 'PENDING'] } })];
            case 5:
                activeTrip = _a.sent();
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
                data = {
                    jobLocation: job.location,
                    contractorLocation: contractorProfile.location,
                    conversation: conversation,
                    customer: customer,
                    contractor: contractor,
                    booking: job,
                    trip: activeTrip
                };
                res.json({
                    success: true,
                    message: "job day successfully initiated",
                    data: data
                });
                return [3 /*break*/, 8];
            case 7:
                err_2 = _a.sent();
                console.log("error", err_2);
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.initiateJobDay = initiateJobDay;
var confirmArrival = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobDayId, errors, contractorId, contractor, trip, verificationCode, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                jobDayId = req.params.jobDayId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _a.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ _id: jobDayId })];
            case 2:
                trip = _a.sent();
                if (!trip) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'trip not found' })];
                }
                if (!(trip.status === job_day_model_1.JOB_DAY_STATUS.STARTED || trip.status === job_day_model_1.JOB_DAY_STATUS.ARRIVED)) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Trip not started yet' })];
                }
                if (trip.verified) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Trio already visited' })];
                }
                verificationCode = (0, otpGenerator_1.generateOTP)();
                trip.verificationCode = parseInt(verificationCode);
                trip.status = job_day_model_1.JOB_DAY_STATUS.ARRIVED;
                return [4 /*yield*/, trip.save()
                    // send notification to  contractor
                ];
            case 3:
                _a.sent();
                // send notification to  contractor
                index_1.NotificationService.sendNotification({
                    user: contractorId,
                    userType: 'contractors',
                    title: 'trip',
                    heading: {},
                    type: 'JOB_DAY_ARRIVAL',
                    message: 'you successfully arrrived at site, wait for comfirmation from customer.',
                    payload: { jobDayId: jobDayId, verificationCode: verificationCode }
                }, {
                    push: true,
                    socket: true,
                });
                // send notification to  customer
                index_1.NotificationService.sendNotification({
                    user: trip.customer.toString(),
                    userType: 'customers',
                    title: 'trip',
                    heading: { name: contractorId, image: contractorId },
                    type: 'JOB_DAY_ARRIVAL',
                    message: 'Contractor is at your site.',
                    payload: { jobDayId: jobDayId, verificationCode: verificationCode }
                }, {
                    push: true,
                    socket: true,
                });
                res.json({
                    success: true,
                    message: "you successfully arrrived at site, wait for comfirmation from customer",
                    data: { verificationCode: verificationCode }
                });
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                console.log("error", err_3);
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.confirmArrival = confirmArrival;
var createJobEmergency = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, description, priority, date, media, contractorId, triggeredBy, jobDayId, jobDay, jobEmergency, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, description = _a.description, priority = _a.priority, date = _a.date, media = _a.media;
                contractorId = req.contractor.id;
                triggeredBy = 'contractor';
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
    var _a, description, reason, evidence, jobDayId, contractorId, errors, jobDay, job, filedBy, dispute, customerId, conversationMembers, conversation, disputeEvidence, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                _a = req.body, description = _a.description, reason = _a.reason, evidence = _a.evidence;
                jobDayId = req.params.jobDayId;
                contractorId = req.contractor.id;
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
                if (!(job.contractor == contractorId)) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Unauthorized to create dispute for this job' })];
                }
                filedBy = 'contractor';
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOneAndUpdate({
                        job: job.id
                    }, {
                        description: description,
                        job: job._id,
                        customer: job.customer,
                        contractor: job.contractor,
                        filedBy: filedBy,
                        status: job_dispute_model_1.JOB_DISPUTE_STATUS.OPEN,
                    }, { new: true, upsert: true })];
            case 3:
                dispute = _c.sent();
                customerId = job.customer;
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
                disputeEvidence = evidence.map(function (url) { return ({
                    url: url,
                    addedBy: 'customer',
                    addedAt: new Date(),
                }); });
                (_b = dispute.evidence).push.apply(_b, disputeEvidence);
                dispute.conversation = conversation.id;
                return [4 /*yield*/, dispute.save()];
            case 5:
                _c.sent();
                events_1.JobEvent.emit('JOB_DISPUTE_CREATED', { dispute: dispute });
                return [2 /*return*/, res.status(201).json({ success: true, message: 'Job dispute created successfully', data: dispute })];
            case 6:
                error_2 = _c.sent();
                next(new custom_errors_1.InternalServerError('Error creating job dispute:', error_2));
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createJobDispute = createJobDispute;
var savePreJobJobQualityAssurance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobDayId, _a, media, errors, jobDay, err_4;
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
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ _id: jobDayId })];
            case 1:
                jobDay = _b.sent();
                if (!jobDay) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'jobDay not found' })];
                }
                if (jobDay.status != job_day_model_1.JOB_DAY_STATUS.CONFIRMED) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'contractor has not  yet been confirmed yet' })];
                }
                jobDay.contractorPreJobMedia = media;
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
                err_4 = _b.sent();
                console.log("error", err_4);
                res.status(500).json({ message: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.savePreJobJobQualityAssurance = savePreJobJobQualityAssurance;
var savePostJobQualityAssurance = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobDayId, _a, media, errors, jobDay, err_5;
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
                return [4 /*yield*/, job_day_model_1.JobDayModel.findOne({ _id: jobDayId })];
            case 1:
                jobDay = _b.sent();
                if (!jobDay) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'jobDay not found' })];
                }
                if (jobDay.status != job_day_model_1.JOB_DAY_STATUS.CONFIRMED) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'contractor has not  yet been confirmed yet' })];
                }
                jobDay.contractorPostJobMedia = media;
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
                err_5 = _b.sent();
                console.log("error", err_5);
                res.status(500).json({ message: err_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.savePostJobQualityAssurance = savePostJobQualityAssurance;
exports.ContractorJobDayController = {
    startTrip: exports.startTrip,
    confirmArrival: exports.confirmArrival,
    createJobEmergency: exports.createJobEmergency,
    initiateJobDay: exports.initiateJobDay,
    savePostJobQualityAssurance: exports.savePostJobQualityAssurance,
    savePreJobJobQualityAssurance: exports.savePreJobJobQualityAssurance,
    createJobDispute: exports.createJobDispute
};
