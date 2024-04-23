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
exports.ContractorJobController = exports.getMyJobs = exports.getJobListings = exports.updateJobQuotation = exports.getQuotationForJob = exports.sendJobQuotation = exports.getJobListingById = exports.getJobRequestById = exports.rejectJobRequest = exports.acceptJobRequest = exports.getJobRequests = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var jobQoutationTemplate_1 = require("../../../templates/customerEmail/jobQoutationTemplate");
var job_model_1 = require("../../../database/common/job.model");
var api_feature_1 = require("../../../utils/api.feature");
var custom_errors_1 = require("../../../utils/custom.errors");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var mongoose_1 = __importDefault(require("mongoose")); // Import Document type from mongoose
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var messages_schema_1 = require("../../../database/common/messages.schema");
var services_1 = require("../../../services");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var getJobRequests = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, customerId, status_1, startDate, endDate, date, contractorId, filter, start, end, selectedDate, startOfDay, endOfDay, jobRequests, _b, data, error_2, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.query, customerId = _a.customerId, status_1 = _a.status, startDate = _a.startDate, endDate = _a.endDate, date = _a.date;
                contractorId = req.contractor.id;
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
            case 1:
                _b = _c.sent(), data = _b.data, error_2 = _b.error;
                res.status(200).json({
                    success: true, message: "Job requests retrieved",
                    data: data
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error('Error retrieving job requests:', error_1);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getJobRequests = getJobRequests;
var acceptJobRequest = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, contractorId, job, customer, jobEvent, quotation, conversationMembers, conversation, message, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, contractor: contractorId, type: job_model_1.JobType.REQUEST })];
            case 1:
                job = _a.sent();
                // Check if the job request exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job request not found' })];
                }
                return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
            case 2:
                customer = _a.sent();
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
                // Update the status of the job request to "Accepted"
                job.status = job_model_1.JOB_STATUS.ACCEPTED;
                jobEvent = {
                    eventType: job_model_1.JOB_STATUS.ACCEPTED,
                    timestamp: new Date(),
                    details: {
                        message: 'Contactor accepted this job'
                    },
                };
                // Push the rejection event to the job history array
                job.jobHistory.push(jobEvent);
                quotation = new job_quotation_model_1.JobQoutationModel({
                    contractor: contractorId,
                    job: jobId,
                    status: job_quotation_model_1.JOB_QUOTATION_STATUS.PENDING, // Assuming initial status is pending
                    estimate: [], // You may need to adjust this based on your application schema
                    startDate: job.startDate,
                    endDate: job.endDate,
                    siteVerification: false, // Example value, adjust as needed
                    processingFee: 0 // Example value, adjust as needed
                });
                // Save the initial job application
                return [4 /*yield*/, quotation.save()];
            case 3:
                // Save the initial job application
                _a.sent();
                // Associate the job application with the job request
                if (!job.quotations.includes(quotation.id)) {
                    job.quotations.push(quotation.id);
                }
                return [4 /*yield*/, job.save()];
            case 4:
                _a.sent();
                conversationMembers = [
                    { memberType: 'customers', member: job.customer },
                    { memberType: 'contractors', member: quotation.contractor }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        $and: [
                            { members: { $elemMatch: { member: job.customer } } }, // memberType: 'customers'
                            { members: { $elemMatch: { member: quotation.contractor } } } // memberType: 'contractors'
                        ]
                    }, {
                        members: conversationMembers,
                        lastMessage: 'I have accepted your Job request', // Set the last message to the job description
                        lastMessageAt: new Date() // Set the last message timestamp to now
                    }, { new: true, upsert: true })];
            case 5:
                conversation = _a.sent();
                message = new messages_schema_1.MessageModel({
                    conversation: conversation === null || conversation === void 0 ? void 0 : conversation._id,
                    sender: contractorId,
                    receiver: job.customer,
                    message: "Contractor has accepted this job request",
                    messageType: messages_schema_1.MessageType.ALERT,
                });
                return [4 /*yield*/, message.save()];
            case 6:
                _a.sent();
                // Return success response
                res.json({ success: true, message: 'Job request accepted successfully' });
                return [3 /*break*/, 8];
            case 7:
                error_3 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Something went wrong', error_3))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.acceptJobRequest = acceptJobRequest;
var rejectJobRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, rejectionReason, contractorId, job, jobEvent, conversationMembers, conversation, message, error_4;
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
                    details: { reason: rejectionReason }, // Store the rejection reason
                };
                // Push the rejection event to the job history array
                job.jobHistory.push(jobEvent);
                return [4 /*yield*/, job.save()];
            case 2:
                _a.sent();
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
                        entity: jobId,
                        entityType: conversations_schema_1.ConversationEntityType.JOB,
                        members: conversationMembers
                    }, { new: true, upsert: true })];
            case 3:
                conversation = _a.sent();
                message = new messages_schema_1.MessageModel({
                    conversation: conversation === null || conversation === void 0 ? void 0 : conversation._id,
                    sender: contractorId,
                    receiver: job.customer,
                    message: "Contractor has rejected this job request",
                    messageType: messages_schema_1.MessageType.ALERT,
                });
                // Return success response
                res.json({ success: true, message: 'Job request rejected successfully' });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error('Error rejecting job request:', error_4);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.rejectJobRequest = rejectJobRequest;
var getJobRequestById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, contractorId, options_1, job, _a, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                options_1 = {
                    contractorId: contractorId, // Define other options here if needed
                    //@ts-ignore
                    match: function () {
                        //@ts-ignore
                        return { _id: { $in: this.quotations }, contractor: options_1.contractorId };
                    }
                };
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, contractor: contractorId, type: job_model_1.JobType.REQUEST })
                        .populate(['contractor', 'customer'])
                        .exec()];
            case 1:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, next(new custom_errors_1.NotFoundError('Job request not found'))];
                }
                _a = job;
                return [4 /*yield*/, job.getMyQoutation(contractorId)];
            case 2:
                _a.myQuotation = _b.sent();
                // Return the job request details
                res.json({ success: true, data: job });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error('Error retrieving job request:', error_5);
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Bad Request'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getJobRequestById = getJobRequestById;
var getJobListingById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, jobId, contractorId, options_2, job, _a, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                options_2 = {
                    contractorId: contractorId, // Define other options here if needed
                    //@ts-ignore
                    match: function () {
                        //@ts-ignore
                        return { _id: { $in: this.quotations }, contractor: options_2.contractorId };
                    }
                };
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId, type: job_model_1.JobType.LISTING })
                        .populate(['contractor', 'customer', { path: 'myQuotation', options: options_2 }])
                        .exec()];
            case 1:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, next(new custom_errors_1.NotFoundError('Job listing not found'))];
                }
                _a = job;
                return [4 /*yield*/, job.getMyQoutation(contractorId)];
            case 2:
                _a.myQuotation = _b.sent();
                // Return the job request details
                res.json({ success: true, data: job });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                console.error('Error retrieving job listing:', error_6);
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Bad Request'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getJobListingById = getJobListingById;
var sendJobQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startDate, endDate, siteVisit, estimates, jobId, contractorId, errors, contractor, job, customer, jobQuotation, _b, jobEvent, html, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                _a = req.body, startDate = _a.startDate, endDate = _a.endDate, siteVisit = _a.siteVisit, estimates = _a.estimates;
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: contractorId })];
            case 1:
                contractor = _c.sent();
                if (!contractor) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid credential" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId }).sort({ createdAt: -1 })];
            case 2:
                job = _c.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job does not exist" })];
                }
                if (estimates && estimates.length < 1) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid estimate format" })];
                }
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: job.customer })];
            case 3:
                customer = _c.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "invalid customer Id" })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOneAndUpdate({ job: jobId, contractor: contractorId }, {
                        startDate: new Date(startDate),
                        endDate: endDate ? new Date(startDate) : null,
                        siteVisit: siteVisit ? new Date(siteVisit) : null,
                        estimates: estimates,
                        jobId: jobId,
                        contractorId: contractorId
                    }, { new: true, upsert: true })];
            case 4:
                jobQuotation = _c.sent();
                _b = jobQuotation;
                return [4 /*yield*/, jobQuotation.calculateCharges()];
            case 5:
                _b.charges = _c.sent();
                if (!job.quotations.includes(jobQuotation.id)) {
                    job.quotations.push({
                        id: jobQuotation.id,
                        status: jobQuotation.status
                    });
                }
                if (job.type == job_model_1.JobType.REQUEST) {
                    // Update the status of the job request to "Accepted"
                    job.status = job_model_1.JOB_STATUS.ACCEPTED;
                    jobEvent = {
                        eventType: job_model_1.JOB_STATUS.ACCEPTED,
                        timestamp: new Date(),
                        details: {
                            message: 'Contactor accepted this job'
                        },
                    };
                    // Push the acceptance event to the job history array
                    if (!job.jobHistory.some(function (jobEvent) { return jobEvent.eventType == job_model_1.JOB_STATUS.ACCEPTED; })) {
                        job.jobHistory.push(jobEvent);
                    }
                }
                return [4 /*yield*/, job.save()
                    // DO OTHER THINGS HERE
                ];
            case 6:
                _c.sent();
                // DO OTHER THINGS HERE
                if (estimates) {
                    html = (0, jobQoutationTemplate_1.htmlJobQoutationTemplate)(customer.firstName, contractor.name);
                    services_1.EmailService.send(customer.email, 'Job quotation from contractor', html);
                    // if (conversation) {
                    //   // send push notification
                    // }
                }
                if (siteVisit) {
                    //send message alert indicating that contractor has requested for site visit
                    // if (conversation) {
                    //  // send notification
                    // }
                }
                res.json({
                    success: true,
                    message: "job quotation sucessfully sent",
                    data: jobQuotation
                });
                return [3 /*break*/, 8];
            case 7:
                err_1 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', err_1))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.sendJobQuotation = sendJobQuotation;
var getQuotationForJob = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, contractorId, jobQuotation, _a, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                // Check if the jobId and contractorId are provided
                if (!jobId) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job ID  are required' })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOne({ job: jobId, contractor: contractorId })];
            case 1:
                jobQuotation = _b.sent();
                // Check if the job application exists
                if (!jobQuotation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job quotation not found' })];
                }
                _a = jobQuotation;
                return [4 /*yield*/, jobQuotation.calculateCharges()];
            case 2:
                _a.charges = _b.sent();
                res.status(200).json({ success: true, message: 'Job quotation retrieved successfully', data: jobQuotation });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_7))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getQuotationForJob = getQuotationForJob;
var updateJobQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, contractorId, _a, startDate, endDate, siteVisit, estimates, errors, job, jobQuotation, _b, conversationMembers, conversation, message, error_8;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                jobId = req.params.jobId;
                contractorId = req.contractor.id;
                // Check if the jobId and contractorId are provided
                if (!jobId) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job ID is missing from params' })];
                }
                _a = req.body, startDate = _a.startDate, endDate = _a.endDate, siteVisit = _a.siteVisit, estimates = _a.estimates;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 1:
                job = _c.sent();
                // If the job application does not exist, create a new one
                if (!job) {
                    return [2 /*return*/, res.status(400).json({ status: false, message: 'Job not found' })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOne({ job: jobId, contractor: contractorId })];
            case 2:
                jobQuotation = _c.sent();
                // If the job application does not exist, create a new one
                if (!jobQuotation) {
                    return [2 /*return*/, res.status(400).json({ status: false, message: 'Job quotation not found' })];
                }
                // Update the job application fields
                jobQuotation.startDate = startDate;
                jobQuotation.endDate = endDate;
                jobQuotation.siteVisit = siteVisit;
                jobQuotation.estimates = estimates;
                // Save the updated job application
                return [4 /*yield*/, jobQuotation.save()];
            case 3:
                // Save the updated job application
                _c.sent();
                _b = jobQuotation;
                return [4 /*yield*/, jobQuotation.calculateCharges()
                    // Create or update conversation
                ];
            case 4:
                _b.charges = _c.sent();
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
                        members: conversationMembers
                    }, { new: true, upsert: true })];
            case 5:
                conversation = _c.sent();
                message = new messages_schema_1.MessageModel({
                    conversation: conversation === null || conversation === void 0 ? void 0 : conversation._id,
                    sender: contractorId,
                    receiver: job.customer,
                    message: "Contractor has edited job estimate",
                    messageType: messages_schema_1.MessageType.ALERT,
                });
                res.status(200).json({ success: true, message: 'Job application updated successfully', data: jobQuotation });
                return [3 /*break*/, 7];
            case 6:
                error_8 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_8))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.updateJobQuotation = updateJobQuotation;
var getJobListings = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, contractorId, contractor, profile, _a, distance, latitude, longitude, emergency, _b, category, city, country, address, startDate, endDate, _c, page, _d, limit, sort // Sort field and order (-fieldName or fieldName)
    , pipeline, _e, sortField, sortOrder, sortStage, skip, result, jobs, metadata, error_9;
    var _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 1:
                contractor = _g.sent();
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
            case 2:
                profile = _g.sent();
                _g.label = 3;
            case 3:
                _g.trys.push([3, 7, , 8]);
                _a = req.query, distance = _a.distance, latitude = _a.latitude, longitude = _a.longitude, emergency = _a.emergency, _b = _a.category, category = _b === void 0 ? profile === null || profile === void 0 ? void 0 : profile.skill : _b, city = _a.city, country = _a.country, address = _a.address, startDate = _a.startDate, endDate = _a.endDate, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.limit, limit = _d === void 0 ? 10 : _d, sort = _a.sort;
                limit = limit > 0 ? parseInt(limit) : 10; // Handle null limit
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
                        $addFields: {
                            totalQuotations: { $size: "$totalQuotations" }
                        }
                    }
                ];
                // Match job listings based on query parameters
                pipeline.push({ $match: { type: job_model_1.JobType.LISTING } });
                pipeline.push({ $match: { category: category } });
                pipeline.push({ $match: { status: job_model_1.JOB_STATUS.PENDING } });
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
                if (distance && latitude && longitude) {
                    pipeline.push({
                        $addFields: {
                            distance: {
                                $sqrt: {
                                    $sum: [
                                        { $pow: [{ $subtract: [{ $toDouble: "$location.latitude" }, parseFloat(latitude)] }, 2] },
                                        { $pow: [{ $subtract: [{ $toDouble: "$location.longitude" }, parseFloat(longitude)] }, 2] }
                                    ]
                                }
                            }
                        }
                    });
                    pipeline.push({ $match: { "distance": { $lte: parseInt(distance) } } });
                }
                // Add sorting stage if specified
                if (sort) {
                    _e = sort.startsWith('-') ? [sort.slice(1), -1] : [sort, 1], sortField = _e[0], sortOrder = _e[1];
                    sortStage = {
                        //@ts-ignore
                        $sort: (_f = {}, _f[sortField] = sortOrder, _f)
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
            case 4:
                result = _g.sent();
                jobs = result[0].data;
                if (!jobs) return [3 /*break*/, 6];
                // Map through each job and attach myQuotation if contractor has applied 
                return [4 /*yield*/, Promise.all(jobs.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = job;
                                    return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOne({ job: job.id, contractor: contractorId })];
                                case 1:
                                    _a.myQuotation = _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 5:
                // Map through each job and attach myQuotation if contractor has applied 
                _g.sent();
                _g.label = 6;
            case 6:
                metadata = result[0].metadata[0];
                // Send response with job listings data
                res.status(200).json({ success: true, data: __assign(__assign({}, metadata), { data: jobs }) });
                return [3 /*break*/, 8];
            case 7:
                error_9 = _g.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_9))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getJobListings = getJobListings;
var getMyJobs = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, _a, type, _b, page, _c, limit, sort, customerId, quotations, jobIds, _d, data, error_11, error_10;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                contractorId = req.contractor.id;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, , 7]);
                _a = req.query, type = _a.type, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, sort = _a.sort, customerId = _a.customerId;
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.find({ contractor: contractorId }).select('job').lean()];
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
                            { contractor: contractorId } // Match jobs with contractorId
                        ]
                    }).distinct('_id'), req.query)];
            case 3:
                _d = _e.sent(), data = _d.data, error_11 = _d.error;
                if (!data) return [3 /*break*/, 5];
                // Map through each job and attach myQuotation if contractor has applied 
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = job;
                                    return [4 /*yield*/, job.getMyQoutation(contractorId)];
                                case 1:
                                    _a.myQuotation = _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 4:
                // Map through each job and attach myQuotation if contractor has applied 
                _e.sent();
                _e.label = 5;
            case 5:
                if (error_11) {
                    return [2 /*return*/, next(new custom_errors_1.BadRequestError('Unkowon error occured'))];
                }
                // Send response with job listings data
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 7];
            case 6:
                error_10 = _e.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_10))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getMyJobs = getMyJobs;
// //contractor send job quatation two /////////////
// export const contractorSendJobQuatationControllerTwo = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       materialDetail,
//       totalcostMaterial,
//       workmanShip
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     let totalQuatation = totalcostMaterial + workmanShip
//     let companyCharge = 0
//     if (totalQuatation <= 1000) {
//       companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
//     }else if (totalQuatation <=  5000){
//       companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
//     }else{
//       companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
//     }
//     const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));
//     const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
//     const totalAmountContractorWithdraw = totalQuatation + gst;
//     const qoute = {
//       materialDetail,
//       totalcostMaterial,
//       workmanShip
//     };
//     job.qoute = qoute,
//     job.gst = gst
//     job.totalQuatation = totalQuatation
//     job.companyCharge = companyCharge
//     job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));
//     job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))
//     job.status = "sent qoutation";
//     await job.save()
//     const html = htmlJobQoutationTemplate(customer.firstName, contractorExist.firstName)
//     let emailData = {
//       emailTo: customer.email,
//       subject: "Job qoutetation from artisan",
//       html
//     };
//     await sendEmail(emailData);
//     res.json({  
//       message: "job qoutation sucessfully sent"
//    });
//   } catch (err: any) {
//     // signup error
//     console.log("error", err)
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor send job quatation three [one by one] /////////////
// export const contractorSendJobQuatationControllerThree = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     const qouteObj = {
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     }
//     const dbQoute = job.quate;
//     const newQoute = [...dbQoute, qouteObj]
//     job.quate = newQoute;
//     await job.save()
//     // const html = htmlJobQoutationTemplate(customer.fullName, contractorExist.firstName)
//     // let emailData = {
//     //   emailTo: customer.email,
//     //   subject: "Job qoutetation from artisan",
//     //   html
//     // };
//     // await sendEmail(emailData);
//     res.json({  
//       message: "job qoutation sucessfully enter"
//    });
//   } catch (err: any) {
//     // signup error
//     console.log("error", err)
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor remove job quatation one by one five [romove one by one] /////////////
// export const contractorRemoveobQuatationOneByOneControllerfive = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     if (job.quate.length < 1) {
//       return res
//         .status(401)
//         .json({ message: "please add atleast one qoutation" });
//     }
//     const qouteObj = {
//       material,
//       qty,
//       rate,
//       //tax,
//       amount,
//     }
//     let newQoute = []
//     for (let i = 0; i < job.quate.length; i++) {
//       const qoute = job.quate[i];
//       const dbQoute = {
//         material: qoute.material,
//         qty: qoute.qty,
//         rate: qoute.rate,
//         //tax: qoute.tax,
//         amount: qoute.amount,
//       }
//       const compareQoute = await areObjectsEqual(dbQoute, qouteObj)
//       if (compareQoute) continue
//       newQoute.push(qoute)
//     }
//     job.quate = newQoute;
//     await job.save()
//     res.json({  
//       message: "job qoutation sucessfully remove"
//    });
//   } catch (err: any) {
//     // signup error
//     console.log("error", err)
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor send job quatation four [complete] /////////////
// export const contractorSendJobQuatationControllerFour = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       workmanShip
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     console.log(1);
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     console.log(2);
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     console.log(3);
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     console.log(4);
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     if (job.quate.length < 1) {
//       return res
//         .status(401)
//         .json({ message: "please add atleast one qoutation" });
//     }
//     console.log(5);
//     let totalQuatation = 0
//     for (let i = 0; i < job.quate.length; i++) {
//       const quatation = job.quate[i];
//       totalQuatation = totalQuatation + quatation.amount
//     }
//     totalQuatation = totalQuatation + workmanShip;
//     let companyCharge = 0
//     if (totalQuatation <= 1000) {
//       companyCharge = parseFloat(((20 / 100) * totalQuatation).toFixed(2));
//     }else if (totalQuatation <=  5000){
//       companyCharge = parseFloat(((15 / 100) * totalQuatation).toFixed(2));
//     }else{
//       companyCharge = parseFloat(((10 / 100) * totalQuatation).toFixed(2));
//     }
//     const gst = parseFloat(((5 / 100) * totalQuatation).toFixed(2));
//     const totalAmountCustomerToPaid = companyCharge + totalQuatation + gst;
//     const totalAmountContractorWithdraw = totalQuatation + gst;
//     console.log(6);
//     job.workmanShip = workmanShip
//     job.gst = gst
//     job.totalQuatation = totalQuatation
//     job.companyCharge = companyCharge
//     job.totalAmountCustomerToPaid =  parseFloat(totalAmountCustomerToPaid.toFixed(2));
//     job.totalAmountContractorWithdraw = parseFloat(totalAmountContractorWithdraw.toFixed(2))
//     job.status = "sent qoutation";
//     await job.save()
//     console.log(7);
//     const html = htmlJobQoutationTemplate(customer.firstName, contractorExist.firstName)
//     let emailData = {
//       emailTo: customer.email,
//       subject: "Job qoutetation from artisan",
//       html
//     };
//     console.log(8);
//     //await sendEmail(emailData);
//     console.log(9);
//     res.json({  
//       message: "job qoutation sucessfully sent"
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job qoutation sent to artisan  /////////////
// export const contractorGetQuatationContractorController = async (
//     req: any,
//     res: Response,
//   ) => {
//     try {
//       const {  
//       } = req.body;
//       // Check for validation errors
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
//       const contractor =  req.contractor;
//       const contractorId = contractor.id
//       //get user info from databas
//       const contractorExist = await ContractorModel.findOne({_id: contractorId});
//       if (!contractorExist) {
//         return res
//           .status(401)
//           .json({ message: "invalid credential" });
//       }
//       const jobRequests = await JobModel.find({contractorId, status: 'sent qoutation'}).sort({ createdAt: -1 })
//       let jobRequested = []
//       for (let i = 0; i < jobRequests.length; i++) {
//         const job = jobRequests[i];
//         const customer = await CustomerRegModel.findOne({_id: job.customerId}).select('-password');
//         const obj = {
//           job: job,
//           customer
//         }
//         jobRequested.push(obj)
//       }
//       res.json({  
//         jobRequested
//      });
//     } catch (err: any) {
//       // signup error
//       res.status(500).json({ message: err.message });
//     }
// }
// //contractor get job qoutation payment comfirm and job in progress /////////////
// export const contractorGetQuatationPaymentComfirmAndJobInProgressController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'qoutation payment confirm and job in progress'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const job = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: job.customerId}).select('-password');
//       const obj = {
//         job: job,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor reject job Request /////////////
// export const contractorRejectJobRequestController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//       rejectedReason,
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId, contractorId, status: 'sent request'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     job.rejected = true;
//     job.rejectedReason = rejectedReason;
//     job.status = "job reject";
//     await job.save()
//     // const html = contractorSendJobQuatationSendEmailHtmlMailTemplate(contractorExist.firstName, customer.fullName)
//     // let emailData = {
//     //   emailTo: customer.email,
//     //   subject: "Job qoutetation from artisan",
//     //   html
//     // };
//     // await sendEmail(emailData);
//     res.json({  
//       message: "you sucessfully rejected job request"
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job he rejected /////////////
// export const contractorGeJobRejectedController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'job reject'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const job = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: job.customerId}).select('-password');
//       const obj = {
//         job: job,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job history /////////////
// export const contractorGeJobHistoryController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId,}).sort({ createdAt: -1 })
//     let jobHistory = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const job = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: job.customerId}).select('-password');
//       const obj = {
//         job: job,
//         customer
//       }
//       jobHistory.push(obj)
//     }
//     res.json({  
//       jobHistory
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor complete job /////////////
// export const contractorCompleteJobController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//       jobId,
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const job = await JobModel.findOne({_id: jobId,contractorId, status: 'qoutation payment confirm and job in progress'}).sort({ createdAt: -1 })
//     if (!job) {
//       return res
//         .status(401)
//         .json({ message: "job request do not exist" });
//     }
//     const customer = await CustomerRegModel.findOne({_id: job.customerId})
//     if (!customer) {
//       return res
//       .status(401)
//       .json({ message: "invalid customer Id" });
//     }
//     // check the time of job is reach
//     const currentTime = new Date().getTime()
//     const jobTime = job.time.getTime()
//    if (currentTime > jobTime) {
//        return res.status(400).json({ message: "Not yet job day" });
//    }
//     job.status = "completed";
//     await job.save()
//     //admin notification
//     const adminNotic = new AdminNoficationModel({
//       title: "Contractor Job Completed",
//       message: `${job._id} - ${contractorExist.firstName} has updated this job to completed.`,
//       status: "unseen"
//     })
//       await adminNotic.save();
//     res.json({  
//       message: "you sucessfully complete this job, wait for comfirmation from customer"
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job completed /////////////
// export const contractorGeJobCompletedController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'completed'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const job = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: job.customerId}).select('-password');
//       const obj = {
//         job: job,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job completed and comfirm by customer /////////////
// export const contractorGeJobComfirmController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'comfirmed'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const job = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: job.customerId}).select('-password');
//       const obj = {
//         job: job,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// //contractor get job completed and complain by customer /////////////
// export const contractorGeJobComplainController = async (
//   req: any,
//   res: Response,
// ) => {
//   try {
//     const {  
//     } = req.body;
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const contractor =  req.contractor;
//     const contractorId = contractor.id
//     //get user info from databas
//     const contractorExist = await ContractorModel.findOne({_id: contractorId});
//     if (!contractorExist) {
//       return res
//         .status(401)
//         .json({ message: "invalid credential" });
//     }
//     const jobRequests = await JobModel.find({contractorId, status: 'complain'}).sort({ createdAt: -1 })
//     let jobRequested = []
//     for (let i = 0; i < jobRequests.length; i++) {
//       const job = jobRequests[i];
//       const customer = await CustomerRegModel.findOne({_id: job.customerId}).select('-password');
//       const obj = {
//         job: job,
//         customer
//       }
//       jobRequested.push(obj)
//     }
//     res.json({  
//       jobRequested
//    });
//   } catch (err: any) {
//     // signup error
//     res.status(500).json({ message: err.message });
//   }
// }
// const areObjectsEqual = async (obj1: any, obj2: any): Promise<boolean> => {
//   const keys1 = Object.keys(obj1).sort();
//   const keys2 = Object.keys(obj2).sort();
//   if (keys1.length !== keys2.length) {
//     return false;
//   }
//   for (const key of keys1) {
//     if (obj1[key] !== obj2[key]) {
//       return false;
//     }
//   }
//   return true;
// }
exports.ContractorJobController = {
    getJobRequests: exports.getJobRequests,
    getJobListings: exports.getJobListings,
    getJobRequestById: exports.getJobRequestById,
    rejectJobRequest: exports.rejectJobRequest,
    acceptJobRequest: exports.acceptJobRequest,
    sendJobQuotation: exports.sendJobQuotation,
    getQuotationForJob: exports.getQuotationForJob,
    updateJobQuotation: exports.updateJobQuotation,
    getJobListingById: exports.getJobListingById,
    getMyJobs: exports.getMyJobs
};
