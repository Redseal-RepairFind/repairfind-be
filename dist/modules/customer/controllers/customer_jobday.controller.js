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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerJobDayController = exports.createJobEmergency = exports.uploadQualityAssurancePhotos = exports.confirmTrip = exports.initiateJobDay = void 0;
var express_validator_1 = require("express-validator");
var index_1 = require("../../../services/notifications/index");
var job_day_model_1 = require("../../../database/common/job_day.model");
var job_emergency_model_1 = require("../../../database/common/job_emergency.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var events_1 = require("../../../events");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var job_model_1 = require("../../../database/common/job.model");
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var initiateJobDay = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, errors, customerId, job, contractorId, contractorProfile, conversationMembers, conversation, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                jobId = req.body.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, customer: customerId, status: job_model_1.JOB_STATUS.BOOKED }).populate('customer', 'contractor')];
            case 1:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job  not found' })];
                }
                contractorId = job.contractor;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
            case 2:
                contractorProfile = _a.sent();
                if (!contractorProfile) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Contractor profile not found' })];
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
            case 3:
                conversation = _a.sent();
                data = {
                    jobLocation: job.location,
                    contractorLocation: contractorProfile.location,
                    conversation: conversation,
                    customer: job.customer,
                    contractor: job.contractor,
                    booking: job
                };
                res.json({
                    success: true,
                    message: "job day successfully initiated",
                    data: data
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
exports.initiateJobDay = initiateJobDay;
var confirmTrip = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobDayId, verificationCode, errors, customerId, jobDay, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
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
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'jobDay not found' })];
                }
                if (jobDay.status != job_day_model_1.JOB_DAY_STATUS.ARRIVED) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'contractor has not arrived yet' })];
                }
                if (jobDay.verified) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'site already visited' })];
                }
                if (jobDay.verificationCode !== verificationCode) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'incorrect verification code' })];
                }
                jobDay.status = job_day_model_1.JOB_DAY_STATUS.CONFIRMED;
                jobDay.verified = true;
                return [4 /*yield*/, jobDay.save()
                    // send notification to  contractor
                ];
            case 2:
                _a.sent();
                // send notification to  contractor
                index_1.NotificationService.sendNotification({
                    user: jobDay.contractor.toString(),
                    userType: 'contractors',
                    title: 'jobDay',
                    heading: {},
                    type: 'tripDayComfirmed',
                    message: 'Customer confirmed your arrival.',
                    payload: { jobDayId: jobDayId, verificationCode: verificationCode }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                // send notification to  customer
                index_1.NotificationService.sendNotification({
                    user: jobDay.customer,
                    userType: 'customers',
                    title: 'jobDay',
                    heading: {},
                    type: 'tripDayComfirmed',
                    message: "You successfully confirmed the contractor's arrival.",
                    payload: { jobDayId: jobDayId, verificationCode: verificationCode }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                res.json({
                    success: true,
                    message: "contractor arrival successfully comfirmed",
                    data: jobDay
                });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log("error", err_2);
                res.status(500).json({ message: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.confirmTrip = confirmTrip;
var uploadQualityAssurancePhotos = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobDayId, verificationCode, errors, customerId, jobDay, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
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
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'jobDay not found' })];
                }
                if (jobDay.status != job_day_model_1.JOB_DAY_STATUS.ARRIVED) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'contractor has not arrived yet' })];
                }
                if (jobDay.verified) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'site already visited' })];
                }
                if (jobDay.verificationCode !== verificationCode) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'incorrect verification code' })];
                }
                jobDay.status = job_day_model_1.JOB_DAY_STATUS.CONFIRMED;
                jobDay.verified = true;
                return [4 /*yield*/, jobDay.save()
                    // send notification to  contractor
                ];
            case 2:
                _a.sent();
                // send notification to  contractor
                index_1.NotificationService.sendNotification({
                    user: jobDay.contractor.toString(),
                    userType: 'contractors',
                    title: 'jobDay',
                    heading: {},
                    type: 'tripDayComfirmed',
                    message: 'Customer confirmed your arrival.',
                    payload: { jobDayId: jobDayId, verificationCode: verificationCode }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                // send notification to  customer
                index_1.NotificationService.sendNotification({
                    user: jobDay.customer,
                    userType: 'customers',
                    title: 'jobDay',
                    heading: {},
                    type: 'tripDayComfirmed',
                    message: "You successfully confirmed the contractor's arrival.",
                    payload: { jobDayId: jobDayId, verificationCode: verificationCode }
                }, {
                    push: true,
                    socket: true,
                    database: true
                });
                res.json({
                    success: true,
                    message: "contractor arrival successfully comfirmed",
                    data: jobDay
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log("error", err_3);
                res.status(500).json({ message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.uploadQualityAssurancePhotos = uploadQualityAssurancePhotos;
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
exports.CustomerJobDayController = {
    confirmTrip: exports.confirmTrip,
    uploadQualityAssurancePhotos: exports.uploadQualityAssurancePhotos,
    createJobEmergency: exports.createJobEmergency,
    initiateJobDay: exports.initiateJobDay
};
