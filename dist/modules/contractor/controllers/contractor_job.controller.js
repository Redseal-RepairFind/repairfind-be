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
exports.ContractorJobController = exports.removeJobFromSaved = exports.addJobToSaved = exports.getJobSingleEnquiry = exports.getJobEnquiries = exports.createJobEnquiry = exports.getJobHistory = exports.getMyJobs = exports.getJobListings = exports.updateJobQuotation = exports.getQuotation = exports.getQuotationForJob = exports.sendChangeOrderEstimate = exports.sendJobQuotation = exports.hideJobListing = exports.getJobListingById = exports.getJobRequestById = exports.rejectJobRequest = exports.acceptJobRequest = exports.getJobRequests = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var job_model_1 = require("../../../database/common/job.model");
var api_feature_1 = require("../../../utils/api.feature");
var custom_errors_1 = require("../../../utils/custom.errors");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var mongoose_1 = __importDefault(require("mongoose")); // Import Document type from mongoose
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var messages_schema_1 = require("../../../database/common/messages.schema");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var interface_dto_util_1 = require("../../../utils/interface_dto.util");
var stripe_1 = require("../../../services/stripe");
var events_1 = require("../../../events");
var job_enquiry_model_1 = require("../../../database/common/job_enquiry.model");
var contractor_saved_job_model_1 = __importDefault(require("../../../database/contractor/models/contractor_saved_job.model"));
var conversation_util_1 = require("../../../utils/conversation.util");
var job_util_1 = require("../../../utils/job.util");
var payment_schema_1 = require("../../../database/common/payment.schema");
var getJobRequests = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, customerId, status_1, startDate, endDate, date, contractorId, contractorProfile_1, filter, start, end, selectedDate, startOfDay, endOfDay, jobRequests, _b, data, error, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.query, customerId = _a.customerId, status_1 = _a.status, startDate = _a.startDate, endDate = _a.endDate, date = _a.date;
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })
                    // Construct filter object based on query parameters
                ];
            case 1:
                contractorProfile_1 = _c.sent();
                filter = {
                    type: job_model_1.JobType.REQUEST
                };
                if (customerId) {
                    filter.customer = customerId;
                }
                if (contractorId) {
                    filter.contractor = contractorId;
                }
                if (status_1) {
                    filter.status = status_1.toUpperCase();
                }
                if (startDate && endDate) {
                    start = new Date(startDate);
                    end = new Date(endDate);
                    // Ensure that end date is adjusted to include the entire day
                    end.setDate(end.getDate() + 1);
                    filter.createdAt = { $gte: start, $lt: end };
                }
                if (date) {
                    selectedDate = new Date(date);
                    startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
                    endOfDay = new Date(startOfDay);
                    endOfDay.setDate(startOfDay.getUTCDate() + 1);
                    filter.date = { $gte: startOfDay, $lt: endOfDay };
                }
                jobRequests = job_model_1.JobModel.find(filter);
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(jobRequests, req.query)];
            case 2:
                _b = _c.sent(), data = _b.data, error = _b.error;
                if (!data) return [3 /*break*/, 4];
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var lat, lng, _a;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (!contractorProfile_1) return [3 /*break*/, 2];
                                    lat = Number((_b = contractorProfile_1.location.latitude) !== null && _b !== void 0 ? _b : 0);
                                    lng = Number((_c = contractorProfile_1.location.longitude) !== null && _c !== void 0 ? _c : 0);
                                    _a = job;
                                    return [4 /*yield*/, job.getDistance(lat, lng)];
                                case 1:
                                    _a.distance = _d.sent();
                                    _d.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                res.status(200).json({
                    success: true, message: "Job requests retrieved",
                    data: data
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                console.error('Error retrieving job requests:', error_1);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getJobRequests = getJobRequests;
var acceptJobRequest = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, contractorId, contractor, job, customer, account, stripeAccount, jobEvent, conversation, message, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 11, , 12]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _c.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, contractor: contractorId, type: job_model_1.JobType.REQUEST })];
            case 2:
                job = _c.sent();
                // Check if the job request exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job request not found' })];
                }
                return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
            case 3:
                customer = _c.sent();
                // Check if the customer request exists
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer not found' })];
                }
                // Check if the job request belongs to the contractor
                if (job.contractor.toString() !== contractorId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to accept this job request' })];
                }
                // Check if the job request is pending
                if (job.status !== job_model_1.JOB_STATUS.PENDING) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job request is not pending' })];
                }
                if (!contractor.onboarding.hasStripeAccount) return [3 /*break*/, 6];
                return [4 /*yield*/, stripe_1.StripeService.account.getAccount(contractor.stripeAccount.id)];
            case 4:
                account = _c.sent();
                stripeAccount = (0, interface_dto_util_1.castPayloadToDTO)(account, account);
                contractor.stripeAccount = stripeAccount;
                return [4 /*yield*/, contractor.save()];
            case 5:
                _c.sent();
                if (!(((_a = contractor.stripeAccountStatus) === null || _a === void 0 ? void 0 : _a.card_payments_enabled) && ((_b = contractor.stripeAccountStatus) === null || _b === void 0 ? void 0 : _b.transfers_enabled))) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ success: false, message: "Kindly connect your bank account to receive payment" })];
                }
                return [3 /*break*/, 7];
            case 6: return [2 /*return*/, res
                    .status(400)
                    .json({ success: false, message: "Kindly connect your bank account to receive payment" })];
            case 7:
                // Update the status of the job request to "Accepted"
                job.status = job_model_1.JOB_STATUS.ACCEPTED;
                jobEvent = {
                    eventType: job_model_1.JOB_STATUS.ACCEPTED,
                    timestamp: new Date(),
                    payload: {
                        message: 'Contactor accepted this job'
                    },
                };
                // Push the rejection event to the job history array
                job.jobHistory.push(jobEvent);
                return [4 /*yield*/, job.save()];
            case 8:
                _c.sent();
                return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(job.customer, 'customers', contractorId, 'contractors')];
            case 9:
                conversation = _c.sent();
                message = new messages_schema_1.MessageModel({
                    conversation: conversation === null || conversation === void 0 ? void 0 : conversation._id,
                    sender: contractorId,
                    senderType: 'contractors',
                    receiver: job.customer,
                    message: "Job request accepted",
                    messageType: messages_schema_1.MessageType.ALERT,
                    entity: job.id,
                    entityType: 'jobs'
                });
                return [4 /*yield*/, message.save()];
            case 10:
                _c.sent();
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: message });
                events_1.JobEvent.emit('JOB_REQUEST_ACCEPTED', { job: job });
                // Return success response
                res.json({ success: true, message: 'Job request accepted successfully' });
                return [3 /*break*/, 12];
            case 11:
                error_2 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Something went wrong', error_2))];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.acceptJobRequest = acceptJobRequest;
var rejectJobRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, rejectionReason, contractorId, job, jobEvent, conversation, message, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                rejectionReason = req.body.rejectionReason;
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, contractor: contractorId, type: job_model_1.JobType.REQUEST })];
            case 1:
                job = _a.sent();
                // Check if the job request exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job request not found' })];
                }
                // Check if the job request belongs to the contractor
                if (job.contractor.toString() !== contractorId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Unauthorized: You do not have permission to reject this job request' })];
                }
                // Check if the job request is pending
                if (job.status !== job_model_1.JOB_STATUS.PENDING) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Job request is not pending' })];
                }
                // Update the status of the job request to "Rejected" and set the rejection reason
                job.status = job_model_1.JOB_STATUS.DECLINED;
                jobEvent = {
                    eventType: job_model_1.JOB_STATUS.DECLINED,
                    timestamp: new Date(),
                    payload: { reason: rejectionReason }, // Store the rejection reason
                };
                // Push the rejection event to the job history array
                job.jobHistory.push(jobEvent);
                return [4 /*yield*/, job.save()];
            case 2:
                _a.sent();
                return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(job.customer, 'customers', contractorId, 'contractors')
                    // Send a message to the customer
                ];
            case 3:
                conversation = _a.sent();
                message = new messages_schema_1.MessageModel({
                    conversation: conversation === null || conversation === void 0 ? void 0 : conversation._id,
                    sender: contractorId,
                    senderType: 'contractors',
                    receiver: job.customer,
                    message: "Job request rejected",
                    messageType: messages_schema_1.MessageType.ALERT,
                    entity: job.id,
                    entityType: 'jobs'
                });
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: message });
                events_1.JobEvent.emit('JOB_REQUEST_REJECTED', { job: job });
                res.json({ success: true, message: 'Job request rejected successfully' });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error('Error rejecting job request:', error_3);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.rejectJobRequest = rejectJobRequest;
var getJobRequestById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, contractorId, contractorProfile, options_1, job, _a, lat, lng, _b, _c, _d, _e, error_4;
    var _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 9, , 10]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
            case 1:
                contractorProfile = _h.sent();
                options_1 = {
                    contractorId: contractorId, // Define other options here if needed
                    //@ts-ignore
                    match: function () {
                        //@ts-ignore
                        return { _id: { $in: this.quotations }, contractor: options_1.contractorId };
                    }
                };
                return [4 /*yield*/, job_model_1.JobModel.findOne({
                        _id: jobId, $or: [
                            { contractor: contractorId },
                            { 'assignment.contractor': contractorId }
                        ], type: job_model_1.JobType.REQUEST
                    })
                        .populate(['contractor', 'customer', 'assignment.contractor'])
                        .exec()];
            case 2:
                job = _h.sent();
                if (!job) {
                    return [2 /*return*/, next(new custom_errors_1.NotFoundError('Job request not found'))];
                }
                _a = job;
                return [4 /*yield*/, job.getMyQuotation(contractorId)];
            case 3:
                _a.myQuotation = _h.sent();
                if (!contractorProfile) return [3 /*break*/, 5];
                lat = Number((_f = contractorProfile.location.latitude) !== null && _f !== void 0 ? _f : 0);
                lng = Number((_g = contractorProfile.location.longitude) !== null && _g !== void 0 ? _g : 0);
                _b = job;
                return [4 /*yield*/, job.getDistance(lat, lng)];
            case 4:
                _b.distance = _h.sent();
                _h.label = 5;
            case 5:
                _c = job;
                return [4 /*yield*/, job.getTotalEnquires()];
            case 6:
                _c.totalEnquires = (_h.sent());
                _d = job;
                return [4 /*yield*/, job.getHasUnrepliedEnquiry()];
            case 7:
                _d.hasUnrepliedEnquiry = (_h.sent());
                _e = job;
                return [4 /*yield*/, job.getIsSaved(contractorId)];
            case 8:
                _e.isSaved = (_h.sent());
                // Return the job request payload
                res.json({ success: true, data: job });
                return [3 /*break*/, 10];
            case 9:
                error_4 = _h.sent();
                console.error('Error retrieving job request:', error_4);
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Bad Request'))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.getJobRequestById = getJobRequestById;
var getJobListingById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, contractorId, contractorProfile, options_2, job, _a, lat, lng, _b, _c, _d, _e, error_5;
    var _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _j.trys.push([0, 9, , 10]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                contractorId = (_f = req === null || req === void 0 ? void 0 : req.contractor) === null || _f === void 0 ? void 0 : _f.id;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
            case 1:
                contractorProfile = _j.sent();
                options_2 = {
                    contractorId: contractorId, // Define other options here if needed
                    //@ts-ignore
                    match: function () {
                        //@ts-ignore
                        return { _id: { $in: this.quotations }, contractor: options_2.contractorId };
                    }
                };
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, type: job_model_1.JobType.LISTING })
                        .populate(['contractor', 'assignment.contractor', 'customer', { path: 'myQuotation', options: options_2 }])
                        .exec()];
            case 2:
                job = _j.sent();
                if (!job) {
                    return [2 /*return*/, next(new custom_errors_1.NotFoundError('Job listing not found'))];
                }
                _a = job;
                return [4 /*yield*/, job.getMyQuotation(contractorId)];
            case 3:
                _a.myQuotation = _j.sent();
                if (!contractorProfile) return [3 /*break*/, 5];
                lat = Number((_g = contractorProfile.location.latitude) !== null && _g !== void 0 ? _g : 0);
                lng = Number((_h = contractorProfile.location.longitude) !== null && _h !== void 0 ? _h : 0);
                _b = job;
                return [4 /*yield*/, job.getDistance(lat, lng)];
            case 4:
                _b.distance = _j.sent();
                _j.label = 5;
            case 5:
                _c = job;
                return [4 /*yield*/, job.getTotalEnquires()];
            case 6:
                _c.totalEnquires = (_j.sent());
                _d = job;
                return [4 /*yield*/, job.getHasUnrepliedEnquiry()];
            case 7:
                _d.hasUnrepliedEnquiry = (_j.sent());
                _e = job;
                return [4 /*yield*/, job.getIsSaved(contractorId)];
            case 8:
                _e.isSaved = (_j.sent());
                // Return the job request payload
                res.json({ success: true, data: job });
                return [3 /*break*/, 10];
            case 9:
                error_5 = _j.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Internal Server Error', error_5))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.getJobListingById = getJobListingById;
var hideJobListing = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, contractorId, job, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 1:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, next(new custom_errors_1.NotFoundError('Job listing not found'))];
                }
                if (!job.hideFrom.includes(contractorId)) {
                    job.hideFrom.push(contractorId);
                }
                return [4 /*yield*/, job.save()];
            case 2:
                _a.sent();
                // Return the job request payload
                res.json({ success: true, message: 'Job removed from listing successfully', data: job });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.error('Error retrieving job listing:', error_6);
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Bad Request'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.hideJobListing = hideJobListing;
var sendJobQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, contractorId, _a, startDate, endDate, siteVisit, estimatedDuration, _b, estimates, errors, _c, contractor, job, customer, previousQuotation, appliedQuotationsCount, quotation, _d, scheduleStartDate, scheduleEndDate, scheduleSiteVisitDate, jobQuotation_1, siteVisitEstimate, jobCreationTime, quotationTime, responseTimeJob, conversationMembers, conversation, message, err_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 12, , 13]);
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                _a = req.body, startDate = _a.startDate, endDate = _a.endDate, siteVisit = _a.siteVisit, estimatedDuration = _a.estimatedDuration, _b = _a.estimates, estimates = _b === void 0 ? [] : _b;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, Promise.all([
                        contractor_model_1.ContractorModel.findById(contractorId),
                        job_model_1.JobModel.findById(jobId).sort({ createdAt: -1 })
                    ])];
            case 1:
                _c = _e.sent(), contractor = _c[0], job = _c[1];
                if (!contractor || !job) {
                    return [2 /*return*/, res.status(401).json({ message: "Invalid credential or job does not exist" })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: job.customer })];
            case 2:
                customer = _e.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer Id" })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ job: jobId, contractor: contractorId })];
            case 3:
                previousQuotation = _e.sent();
                if (previousQuotation && previousQuotation.status === job_quotation_model_1.JOB_QUOTATION_STATUS.DECLINED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "You cannot apply again since your previous quotation was declined" })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.countDocuments({
                        job: jobId,
                        status: { $ne: job_quotation_model_1.JOB_QUOTATION_STATUS.DECLINED }
                    })];
            case 4:
                appliedQuotationsCount = _e.sent();
                if (appliedQuotationsCount >= 3) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Maximum number of contractors already applied for this job" })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ job: jobId, contractor: contractorId })];
            case 5:
                quotation = _e.sent();
                if (quotation) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "You have already submitted a quotation for this job" })];
                }
                // Check if contractor has a verified connected account
                _d = contractor;
                return [4 /*yield*/, contractor.getOnboarding()];
            case 6:
                // Check if contractor has a verified connected account
                _d.onboarding = _e.sent();
                if (!(contractor.onboarding.hasStripeIdentity)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Kindly complete your identity process" })];
                }
                if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus && contractor.stripeAccountStatus.card_payments_enabled && contractor.stripeAccountStatus.transfers_enabled)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Kindly connect your bank account to receive payment" })];
                }
                scheduleStartDate = startDate ? new Date(startDate) : new Date();
                scheduleEndDate = endDate ? new Date(startDate) : null;
                scheduleSiteVisitDate = siteVisit ? new Date(siteVisit) : null;
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOneAndUpdate({ job: jobId, contractor: contractorId }, { startDate: scheduleStartDate, endDate: scheduleEndDate, siteVisit: scheduleSiteVisitDate, estimates: estimates, jobId: jobId, contractorId: contractorId, estimatedDuration: estimatedDuration }, { new: true, upsert: true })];
            case 7:
                jobQuotation_1 = _e.sent();
                // Prepare estimates
                if (siteVisit) {
                    siteVisitEstimate = {
                        isPaid: false,
                        date: new Date(),
                        estimates: [{ description: 'Site Visit', amount: 100, rate: 100, quantity: 1 }]
                    };
                    jobQuotation_1.siteVisitEstimate = siteVisitEstimate;
                    jobQuotation_1.type = job_quotation_model_1.JOB_QUOTATION_TYPE.SITE_VISIT;
                }
                // Add job quotation to job's list of quotations
                if (!job.quotations.some(function (quotation) { return quotation.id === jobQuotation_1.id; })) {
                    job.quotations.push({ id: jobQuotation_1.id, status: jobQuotation_1.status, contractor: contractorId });
                }
                // Update job status and history if needed
                if (job.type === job_model_1.JobType.REQUEST) {
                    job.status = job_model_1.JOB_STATUS.SUBMITTED;
                    if (!job.jobHistory.some(function (jobEvent) { return jobEvent.eventType === job_model_1.JOB_STATUS.SUBMITTED; })) {
                        job.jobHistory.push({ eventType: job_model_1.JOB_STATUS.ACCEPTED, timestamp: new Date(), payload: { message: 'Contractor accepted this job' } });
                    }
                }
                jobCreationTime = new Date(job.createdAt);
                quotationTime = new Date();
                responseTimeJob = (quotationTime.getTime() - jobCreationTime.getTime()) / 1000;
                jobQuotation_1.responseTime = responseTimeJob;
                // Save changes to the job
                return [4 /*yield*/, job.save()];
            case 8:
                // Save changes to the job
                _e.sent();
                return [4 /*yield*/, jobQuotation_1.save()
                    // Do other actions such as sending emails or notifications...
                    // Create or update conversation
                ];
            case 9:
                _e.sent();
                conversationMembers = [
                    { memberType: 'customers', member: job.customer },
                    { memberType: 'contractors', member: contractorId }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        $and: [
                            { members: { $elemMatch: { member: job.customer } } },
                            { members: { $elemMatch: { member: contractorId } } }
                        ]
                    }, {
                        members: conversationMembers,
                    }, { new: true, upsert: true })];
            case 10:
                conversation = _e.sent();
                message = new messages_schema_1.MessageModel({
                    conversation: conversation === null || conversation === void 0 ? void 0 : conversation._id,
                    sender: contractorId,
                    senderType: 'contractors',
                    receiver: job.customer,
                    message: "Job estimate submitted",
                    messageType: messages_schema_1.MessageType.FILE,
                    entity: jobQuotation_1.id,
                    entityType: 'quotations',
                    payload: {
                        job: job.id,
                        quotation: jobQuotation_1.id,
                        quotationType: jobQuotation_1.type,
                        JobType: job.type
                    }
                });
                return [4 /*yield*/, message.save()];
            case 11:
                _e.sent();
                events_1.JobEvent.emit('NEW_JOB_QUOTATION', { job: job, quotation: jobQuotation_1 });
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: message });
                res.json({
                    success: true,
                    message: "Job quotation successfully sent",
                    data: jobQuotation_1
                });
                return [3 /*break*/, 13];
            case 12:
                err_1 = _e.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('Error sending job quotation', err_1))];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.sendJobQuotation = sendJobQuotation;
var sendChangeOrderEstimate = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, contractorId, _a, estimates, errors, _b, contractor, job, customer, quotation, changeOrderEstimate, _c, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 7, , 8]);
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                _a = req.body.estimates, estimates = _a === void 0 ? [] : _a;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, Promise.all([
                        contractor_model_1.ContractorModel.findById(contractorId),
                        job_model_1.JobModel.findById(jobId).sort({ createdAt: -1 })
                    ])];
            case 1:
                _b = _d.sent(), contractor = _b[0], job = _b[1];
                if (!contractor || !job) {
                    return [2 /*return*/, res.status(401).json({ message: "Invalid credential or job does not exist" })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: job.customer })];
            case 2:
                customer = _d.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(401).json({ message: "Invalid customer ID" })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ _id: job.contract, job: jobId })];
            case 3:
                quotation = _d.sent();
                if (!quotation) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "You don't have access to send extra job quotation" })];
                }
                if (!job.isChangeOrder) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Customer has not enabled change order" })];
                }
                changeOrderEstimate = {
                    estimates: estimates,
                    isPaid: false,
                    date: new Date()
                };
                quotation.changeOrderEstimate = changeOrderEstimate;
                _c = quotation;
                return [4 /*yield*/, quotation.calculateCharges()];
            case 4:
                _c.charges = _d.sent();
                job.jobHistory.push({ eventType: 'CHANGE_ORDER_ESTIMATE_SUBMITTED', timestamp: new Date(), payload: __assign({}, changeOrderEstimate) });
                job.isChangeOrder = false;
                return [4 /*yield*/, job.save()];
            case 5:
                _d.sent();
                return [4 /*yield*/, quotation.save()];
            case 6:
                _d.sent();
                events_1.JobEvent.emit('CHANGE_ORDER_ESTIMATE_SUBMITTED', { job: job, quotation: quotation });
                res.json({
                    success: true,
                    message: "Job change order quotation successfully sent",
                    data: quotation
                });
                return [3 /*break*/, 8];
            case 7:
                err_2 = _d.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', err_2))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.sendChangeOrderEstimate = sendChangeOrderEstimate;
var getQuotationForJob = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, contractorId, quotation, _a, _b, _c, error_7;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 7, , 8]);
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                // Check if the jobId and contractorId are provided
                if (!jobId) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job ID  are required' })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ job: jobId, contractor: contractorId })];
            case 1:
                quotation = _e.sent();
                // Check if the job application exists
                if (!quotation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'You have not submitted quotation for this job' })];
                }
                if (!quotation.changeOrderEstimate) return [3 /*break*/, 3];
                _a = quotation.changeOrderEstimate;
                return [4 /*yield*/, quotation.calculateCharges(payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)];
            case 2:
                _a.charges = (_d = _e.sent()) !== null && _d !== void 0 ? _d : {};
                _e.label = 3;
            case 3:
                if (!quotation.siteVisitEstimate) return [3 /*break*/, 5];
                _b = quotation.siteVisitEstimate;
                return [4 /*yield*/, quotation.calculateCharges(payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)];
            case 4:
                _b.charges = _e.sent();
                _e.label = 5;
            case 5:
                _c = quotation;
                return [4 /*yield*/, quotation.calculateCharges()];
            case 6:
                _c.charges = _e.sent();
                res.status(200).json({ success: true, message: 'Job quotation retrieved successfully', data: quotation });
                return [3 /*break*/, 8];
            case 7:
                error_7 = _e.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred ', error_7))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getQuotationForJob = getQuotationForJob;
var getQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var quotationId, contractorId, quotation, _a, _b, _c, error_8;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 7, , 8]);
                quotationId = req.params.quotationId;
                contractorId = req.contractor.id;
                // Check if the jobId and contractorId are provided
                if (!quotationId) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Quotation ID is required' })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findById(quotationId)];
            case 1:
                quotation = _e.sent();
                // Check if the job application exists
                if (!quotation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Quotation not found' })];
                }
                if (!quotation.changeOrderEstimate) return [3 /*break*/, 3];
                _a = quotation.changeOrderEstimate;
                return [4 /*yield*/, quotation.calculateCharges(payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)];
            case 2:
                _a.charges = (_d = _e.sent()) !== null && _d !== void 0 ? _d : {};
                _e.label = 3;
            case 3:
                if (!quotation.siteVisitEstimate) return [3 /*break*/, 5];
                _b = quotation.siteVisitEstimate;
                return [4 /*yield*/, quotation.calculateCharges(payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)];
            case 4:
                _b.charges = _e.sent();
                _e.label = 5;
            case 5:
                _c = quotation;
                return [4 /*yield*/, quotation.calculateCharges()];
            case 6:
                _c.charges = _e.sent();
                res.status(200).json({ success: true, message: 'Job quotation retrieved successfully', data: quotation });
                return [3 /*break*/, 8];
            case 7:
                error_8 = _e.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred ', error_8))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getQuotation = getQuotation;
var updateJobQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, contractorId, _a, startDate, endDate, siteVisit, estimatedDuration, estimates, errors, job, quotation, _b, _c, _d, _e, conversationMembers, conversation, message, error_9;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 12, , 13]);
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                // Check if the jobId and contractorId are provided
                if (!jobId) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job ID is missing from params' })];
                }
                _a = req.body, startDate = _a.startDate, endDate = _a.endDate, siteVisit = _a.siteVisit, estimatedDuration = _a.estimatedDuration, estimates = _a.estimates;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 1:
                job = _g.sent();
                // If the job application does not exist, create a new one
                if (!job) {
                    return [2 /*return*/, res.status(400).json({ status: false, message: 'Job not found' })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ job: jobId, contractor: contractorId })];
            case 2:
                quotation = _g.sent();
                // If the job application does not exist, create a new one
                if (!quotation) {
                    return [2 /*return*/, res.status(400).json({ status: false, message: 'Job quotation not found' })];
                }
                // Update the job application fields
                quotation.startDate = startDate;
                quotation.endDate = endDate;
                quotation.siteVisit = siteVisit;
                quotation.estimates = estimates;
                quotation.estimatedDuration = estimatedDuration;
                // Save the updated job application
                return [4 /*yield*/, quotation.save()];
            case 3:
                // Save the updated job application
                _g.sent();
                _b = quotation;
                return [4 /*yield*/, quotation.calculateCharges()];
            case 4:
                _b.charges = _g.sent();
                if (!quotation.changeOrderEstimate) return [3 /*break*/, 6];
                _c = quotation.changeOrderEstimate;
                return [4 /*yield*/, quotation.calculateCharges(payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)];
            case 5:
                _c.charges = (_f = _g.sent()) !== null && _f !== void 0 ? _f : {};
                _g.label = 6;
            case 6:
                if (!quotation.siteVisitEstimate) return [3 /*break*/, 8];
                _d = quotation.siteVisitEstimate;
                return [4 /*yield*/, quotation.calculateCharges(payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT)];
            case 7:
                _d.charges = _g.sent();
                _g.label = 8;
            case 8:
                _e = quotation;
                return [4 /*yield*/, quotation.calculateCharges()
                    // Create or update conversation
                ];
            case 9:
                _e.charges = _g.sent();
                conversationMembers = [
                    { memberType: 'customers', member: job.customer },
                    { memberType: 'contractors', member: contractorId }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        $and: [
                            { members: { $elemMatch: { member: job.customer } } },
                            { members: { $elemMatch: { member: contractorId } } }
                        ]
                    }, {
                        members: conversationMembers,
                    }, { new: true, upsert: true })];
            case 10:
                conversation = _g.sent();
                message = new messages_schema_1.MessageModel({
                    conversation: conversation === null || conversation === void 0 ? void 0 : conversation._id,
                    sender: contractorId,
                    senderType: 'contractors',
                    receiver: job.customer,
                    message: "Job estimate edited",
                    messageType: messages_schema_1.MessageType.FILE,
                    entity: quotation.id,
                    entityType: 'quotations',
                    payload: {
                        job: job.id,
                        quotation: quotation.id,
                        quotationType: quotation.type,
                        JobType: job.type
                    }
                });
                return [4 /*yield*/, message.save()];
            case 11:
                _g.sent();
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: message });
                events_1.JobEvent.emit('JOB_QUOTATION_EDITED', { job: job, quotation: quotation });
                res.status(200).json({ success: true, message: 'Job application updated successfully', data: quotation });
                return [3 /*break*/, 13];
            case 12:
                error_9 = _g.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred ', error_9))];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.updateJobQuotation = updateJobQuotation;
var getJobListings = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, contractorId, _a, data, error, profile, _b, radius, _c, latitude, _d, longitude, emergency, _e, category, city, country, address, startDate, endDate, _f, page, _g, limit, sort, _h, showHidden, _j, onlySavedJobs, toRadians, pipeline, contractor, quotations, jobIdsWithQuotations, _k, sortField, sortOrder, sortStage, skip, result, jobs, metadata, error_10;
    var _l;
    var _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, errors: errors.array() })];
                }
                contractorId = (_m = req === null || req === void 0 ? void 0 : req.contractor) === null || _m === void 0 ? void 0 : _m.id;
                if (!!contractorId) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(), req.query)];
            case 1:
                _a = _o.sent(), data = _a.data, error = _a.error;
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Jobs retrieved successfully', data: data })];
            case 2: return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
            case 3:
                profile = _o.sent();
                if (!profile) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor profile not found' })];
                }
                _o.label = 4;
            case 4:
                _o.trys.push([4, 8, , 9]);
                _b = req.query, radius = _b.radius, _c = _b.latitude, latitude = _c === void 0 ? Number(profile.location.latitude) : _c, _d = _b.longitude, longitude = _d === void 0 ? Number(profile.location.longitude) : _d, emergency = _b.emergency, _e = _b.category, category = _e === void 0 ? profile === null || profile === void 0 ? void 0 : profile.skill : _e, city = _b.city, country = _b.country, address = _b.address, startDate = _b.startDate, endDate = _b.endDate, _f = _b.page, page = _f === void 0 ? 1 : _f, _g = _b.limit, limit = _g === void 0 ? 10 : _g, sort = _b.sort, _h = _b.showHidden, showHidden = _h === void 0 ? false : _h, _j = _b.onlySavedJobs, onlySavedJobs = _j === void 0 ? false : _j;
                limit = limit > 0 ? parseInt(limit) : 10; // Handle null limit
                toRadians = function (degrees) { return degrees * (Math.PI / 180); };
                pipeline = [
                    {
                        $lookup: {
                            from: "job_quotations",
                            localField: "_id",
                            foreignField: "job",
                            as: "totalQuotations"
                        }
                    },
                    {
                        $lookup: {
                            from: "contractor_saved_jobs",
                            localField: "_id",
                            foreignField: "job",
                            as: "savedJobs"
                        }
                    },
                    {
                        $lookup: {
                            from: "job_enquires",
                            localField: "_id",
                            foreignField: "job",
                            as: "enquires"
                        }
                    },
                    {
                        $addFields: {
                            totalQuotations: { $size: "$totalQuotations" },
                            totalEnquiries: { $size: "$enquires" },
                            hasUnrepliedEnquiry: {
                                $gt: [
                                    {
                                        $size: {
                                            $filter: {
                                                input: "$enquires",
                                                as: "enquiry",
                                                cond: { $eq: [{ $size: "$$enquiry.replies" }, 0] }
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                            isSaved: { $gt: [{ $size: "$savedJobs" }, 0] },
                            expiresIn: {
                                $dateDiff: {
                                    unit: "day", // Change to "hour", "minute", etc. if needed
                                    startDate: "$createdAt",
                                    endDate: "$expiryDate",
                                },
                            },
                            distance: {
                                $round: [
                                    {
                                        $multiply: [
                                            6371, // Earth's radius in km
                                            {
                                                $acos: {
                                                    $add: [
                                                        {
                                                            $multiply: [
                                                                { $sin: toRadians(latitude) },
                                                                { $sin: { $toDouble: { $multiply: [{ $toDouble: "$location.latitude" }, (Math.PI / 180)] } } }
                                                            ]
                                                        },
                                                        {
                                                            $multiply: [
                                                                { $cos: toRadians(latitude) },
                                                                { $cos: { $toDouble: { $multiply: [{ $toDouble: "$location.latitude" }, (Math.PI / 180)] } } },
                                                                { $cos: { $subtract: [{ $toDouble: { $multiply: [{ $toDouble: "$location.longitude" }, (Math.PI / 180)] } }, toRadians(longitude)] } }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                    4
                                ]
                            },
                        }
                    },
                ];
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 5:
                contractor = _o.sent();
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ contractor: contractorId }, { job: 1 })];
            case 6:
                quotations = _o.sent();
                jobIdsWithQuotations = quotations.map(function (quotation) { return quotation.job; });
                pipeline.push({ $match: { _id: { $nin: jobIdsWithQuotations } } });
                pipeline.push({ $match: { type: job_model_1.JobType.LISTING } });
                pipeline.push({ $match: { category: category } });
                pipeline.push({ $match: { status: job_model_1.JOB_STATUS.PENDING } });
                pipeline.push({ $match: { "expiresIn": { $gt: 0 } } });
                if (!showHidden) {
                    // Add a new $match stage to filter out jobs with contractorId in hideFrom array
                    pipeline.push({ $match: { hideFrom: { $nin: [contractorId] } } });
                }
                if (category) {
                    pipeline.push({ $match: { category: { $regex: new RegExp(category, 'i') } } });
                }
                if (country) {
                    pipeline.push({ $match: { 'location.country': { $regex: new RegExp(country, 'i') } } });
                }
                if (city) {
                    pipeline.push({ $match: { 'location.city': { $regex: new RegExp(city, 'i') } } });
                }
                if (address) {
                    pipeline.push({ $match: { 'location.address': { $regex: new RegExp(address, 'i') } } });
                }
                if (emergency !== undefined) {
                    pipeline.push({ $match: { emergency: emergency === "true" } });
                }
                if (startDate && endDate) {
                    pipeline.push({
                        $match: {
                            date: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            }
                        }
                    });
                }
                if (radius) {
                    pipeline.push({ $match: { "distance": { $lte: parseInt(radius) } } });
                }
                if (onlySavedJobs) {
                    pipeline.push({ $match: { "savedJobs": { $ne: [] } } });
                }
                // Add sorting stage if specified
                if (sort) {
                    _k = sort.startsWith('-') ? [sort.slice(1), -1] : [sort, 1], sortField = _k[0], sortOrder = _k[1];
                    sortStage = {
                        //@ts-ignore
                        $sort: (_l = {}, _l[sortField] = sortOrder, _l)
                    };
                    pipeline.push(sortStage);
                }
                skip = (parseInt(page) - 1) * parseInt(limit);
                // Add $facet stage for pagination
                pipeline.push({
                    $facet: {
                        metadata: [
                            { $count: "totalItems" },
                            { $addFields: { page: page, limit: limit, currentPage: parseInt(page), lastPage: { $ceil: { $divide: ["$totalItems", parseInt(limit)] } } } }
                        ],
                        data: [{ $skip: skip }, { $limit: parseInt(limit) }]
                    }
                });
                return [4 /*yield*/, job_model_1.JobModel.aggregate(pipeline)];
            case 7:
                result = _o.sent();
                jobs = result[0].data;
                if (jobs) {
                    //NO longer neccessary since applied jobs don't show up again
                    // Map through each job and attach myQuotation if contractor has applied 
                    // await Promise.all(jobs.map(async (job: any) => {
                    //    job.myQuotation = await JobQuotationModel.findOne({ job: job._id, contractor: contractorId })
                    // }));
                }
                metadata = result[0].metadata[0];
                // Send response with job listings data
                res.status(200).json({ success: true, data: __assign(__assign({}, metadata), { data: jobs }) });
                return [3 /*break*/, 9];
            case 8:
                error_10 = _o.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred ', error_10))];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.getJobListings = getJobListings;
var getMyJobs = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, _a, type, _b, page, _c, limit, sort, customerId, quotations, jobIds, _d, data, error, error_11;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                contractorId = req.contractor.id;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, , 7]);
                _a = req.query, type = _a.type, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, sort = _a.sort, customerId = _a.customerId;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ contractor: contractorId }).select('job').lean()];
            case 2:
                quotations = _e.sent();
                jobIds = quotations.map(function (quotation) { return quotation.job; });
                if (customerId) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid customer id' })];
                    }
                    req.query.customer = customerId;
                    delete req.query.customerId;
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find({
                        $or: [
                            { _id: { $in: jobIds } }, // Match jobs specified in jobIds
                            { contractor: contractorId }, // Match jobs with contractorId
                            { 'assignment.contractor': contractorId }
                        ]
                    }).distinct('_id'), req.query)];
            case 3:
                _d = _e.sent(), data = _d.data, error = _d.error;
                if (!data) return [3 /*break*/, 5];
                // Map through each job and attach myQuotation if contractor has applied 
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute, myQuotation;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, job_util_1.JobUtil.populate(job, {
                                        contract: true,
                                        dispute: true,
                                        jobDay: true,
                                        totalEnquires: true,
                                        hasUnrepliedEnquiry: true,
                                        myQuotation: contractorId
                                    })];
                                case 1:
                                    _a = _b.sent(), contract = _a.contract, totalEnquires = _a.totalEnquires, hasUnrepliedEnquiry = _a.hasUnrepliedEnquiry, jobDay = _a.jobDay, dispute = _a.dispute, myQuotation = _a.myQuotation;
                                    job.myQuotation = myQuotation;
                                    job.contract = contract;
                                    job.jobDay = jobDay;
                                    job.dispute = dispute;
                                    job.totalEnquires = totalEnquires;
                                    job.hasUnrepliedEnquiry = hasUnrepliedEnquiry;
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 4:
                // Map through each job and attach myQuotation if contractor has applied 
                _e.sent();
                _e.label = 5;
            case 5:
                if (error) {
                    return [2 /*return*/, next(new custom_errors_1.BadRequestError('Unknown error occurred'))];
                }
                // Send response with job listings data
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 7];
            case 6:
                error_11 = _e.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_11))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getMyJobs = getMyJobs;
var getJobHistory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, _a, type, _b, page, _c, limit, _d, sort, customerId, quotations, jobIds, _e, data, error, error_12;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                contractorId = req.contractor.id;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 6, , 7]);
                _a = req.query, type = _a.type, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, customerId = _a.customerId;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ contractor: contractorId }).select('job').lean()];
            case 2:
                quotations = _f.sent();
                jobIds = quotations.map(function (quotation) { return quotation.job; });
                if (customerId) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid customer id' })];
                    }
                    req.query.customer = customerId;
                    delete req.query.customerId;
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find({
                        $or: [
                            { _id: { $in: jobIds } }, // Match jobs specified in jobIds
                            { contractor: contractorId }, // Match jobs with contractorId
                            { 'assignment.contractor': contractorId }
                        ]
                    }).distinct('_id'), req.query)];
            case 3:
                _e = _f.sent(), data = _e.data, error = _e.error;
                if (!data) return [3 /*break*/, 5];
                // Map through each job and attach myQuotation if contractor has applied 
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute, myQuotation;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, job_util_1.JobUtil.populate(job, {
                                        contract: true,
                                        dispute: true,
                                        jobDay: true,
                                        totalEnquires: true,
                                        hasUnrepliedEnquiry: true,
                                        myQuotation: contractorId
                                    })];
                                case 1:
                                    _a = _b.sent(), contract = _a.contract, totalEnquires = _a.totalEnquires, hasUnrepliedEnquiry = _a.hasUnrepliedEnquiry, jobDay = _a.jobDay, dispute = _a.dispute, myQuotation = _a.myQuotation;
                                    job.myQuotation = myQuotation;
                                    job.contract = contract;
                                    job.jobDay = jobDay;
                                    job.dispute = dispute;
                                    job.totalEnquires = totalEnquires;
                                    job.hasUnrepliedEnquiry = hasUnrepliedEnquiry;
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 4:
                // Map through each job and attach myQuotation if contractor has applied 
                _f.sent();
                _f.label = 5;
            case 5:
                if (error) {
                    return [2 /*return*/, next(new custom_errors_1.BadRequestError('Unknown error occurred'))];
                }
                // Send response with job listings data
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 7];
            case 6:
                error_12 = _f.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_12))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getJobHistory = getJobHistory;
var createJobEnquiry = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, question, contractorId, job, contractor, _a, _b, isRestricted, errorMessage, enquiry, error_13;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 8, , 9]);
                jobId = req.params.jobId;
                question = req.body.question;
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 1:
                job = _c.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Job not found" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 2:
                contractor = _c.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Contractor not found" })];
                }
                // Check if contractor has a verified connected account
                _a = contractor;
                return [4 /*yield*/, contractor.getOnboarding()];
            case 3:
                // Check if contractor has a verified connected account
                _a.onboarding = _c.sent();
                if (!(contractor.onboarding.hasStripeIdentity)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Kindly complete your identity process" })];
                }
                if (!contractor.onboarding.hasStripeAccount || !(contractor.stripeAccountStatus && contractor.stripeAccountStatus.card_payments_enabled && contractor.stripeAccountStatus.transfers_enabled)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Kindly connect your bank account to receive payment" })];
                }
                return [4 /*yield*/, conversation_util_1.ConversationUtil.containsRestrictedMessageContent(question)];
            case 4:
                _b = _c.sent(), isRestricted = _b.isRestricted, errorMessage = _b.errorMessage;
                if (isRestricted) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "You are not allowed to send restricted contents such as email, phone number or other personal information" })];
                }
                enquiry = new job_enquiry_model_1.JobEnquiryModel({
                    job: job.id,
                    contractor: contractorId,
                    customer: job.customer,
                    enquiry: question,
                    createdAt: new Date()
                });
                return [4 /*yield*/, enquiry.save()];
            case 5:
                _c.sent();
                job.enquiries.push(enquiry.id);
                return [4 /*yield*/, job.save()];
            case 6:
                _c.sent();
                return [4 /*yield*/, contractor_saved_job_model_1.default.findOneAndUpdate({ job: job.id, contractor: contractorId }, { job: job.id, contractor: contractorId }, { new: true, upsert: true })];
            case 7:
                _c.sent();
                events_1.JobEvent.emit('NEW_JOB_ENQUIRY', { jobId: jobId, enquiryId: enquiry.id });
                return [2 /*return*/, res.status(200).json({ success: true, message: "Question added", question: question })];
            case 8:
                error_13 = _c.sent();
                next(error_13);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createJobEnquiry = createJobEnquiry;
var getJobEnquiries = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, job, enquiries, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                jobId = req.params.jobId;
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 1:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Job not found" })];
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_enquiry_model_1.JobEnquiryModel.find({ job: jobId }).populate([
                        { path: 'customer', select: "firstName lastName name profilePhoto _id" },
                        { path: 'contractor', select: "firstName lastName name profilePhoto _id" },
                    ]), req.query)];
            case 2:
                enquiries = _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "Enquiries retrieved", data: enquiries })];
            case 3:
                error_14 = _a.sent();
                next(error_14);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getJobEnquiries = getJobEnquiries;
var getJobSingleEnquiry = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, enquiryId, job, enquiry, error_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.params, jobId = _a.jobId, enquiryId = _a.enquiryId;
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 1:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Job not found" })];
                }
                return [4 /*yield*/, job_enquiry_model_1.JobEnquiryModel.findById(enquiryId).populate([
                        { path: 'customer', select: "firstName lastName name profilePhoto _id" },
                        { path: 'contractor', select: "firstName lastName name profilePhoto _id" },
                    ])];
            case 2:
                enquiry = _b.sent();
                if (!enquiry) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Enquiry not found" })];
                }
                return [4 /*yield*/, Promise.all(enquiry.replies.map(function (reply) { return __awaiter(void 0, void 0, void 0, function () {
                        var user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, customer_model_1.default.findById(reply.userId).select('id firstName lastName profilePhoto')];
                                case 1:
                                    user = _a.sent();
                                    reply.user = user;
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _b.sent();
                res.json({ success: true, message: 'Reply added', enquiry: enquiry });
                return [3 /*break*/, 5];
            case 4:
                error_15 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_15))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getJobSingleEnquiry = getJobSingleEnquiry;
var addJobToSaved = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, contractorId, job, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 1:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Job not found" })];
                }
                return [4 /*yield*/, contractor_saved_job_model_1.default.findOneAndUpdate({ job: job.id, contractor: contractorId }, { job: job.id, contractor: contractorId }, { new: true, upsert: true })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "Job added to saved list" })];
            case 3:
                error_16 = _a.sent();
                next(error_16);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addJobToSaved = addJobToSaved;
var removeJobFromSaved = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, contractorId, job, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 1:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: "Job not found" })];
                }
                return [4 /*yield*/, contractor_saved_job_model_1.default.findOneAndDelete({ job: job.id, contractor: contractorId })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: "Job removed from saved list" })];
            case 3:
                error_17 = _a.sent();
                next(error_17);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.removeJobFromSaved = removeJobFromSaved;
exports.ContractorJobController = {
    getJobRequests: exports.getJobRequests,
    getJobListings: exports.getJobListings,
    getJobRequestById: exports.getJobRequestById,
    rejectJobRequest: exports.rejectJobRequest,
    acceptJobRequest: exports.acceptJobRequest,
    sendJobQuotation: exports.sendJobQuotation,
    getQuotationForJob: exports.getQuotationForJob,
    getQuotation: exports.getQuotation,
    updateJobQuotation: exports.updateJobQuotation,
    getJobListingById: exports.getJobListingById,
    getMyJobs: exports.getMyJobs,
    getJobHistory: exports.getJobHistory,
    sendChangeOrderEstimate: exports.sendChangeOrderEstimate,
    hideJobListing: exports.hideJobListing,
    createJobEnquiry: exports.createJobEnquiry,
    getJobEnquiries: exports.getJobEnquiries,
    getJobSingleEnquiry: exports.getJobSingleEnquiry,
    addJobToSaved: exports.addJobToSaved,
    removeJobFromSaved: exports.removeJobFromSaved
};
