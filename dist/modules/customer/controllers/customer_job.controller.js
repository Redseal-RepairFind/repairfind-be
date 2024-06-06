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
exports.CustomerJobController = exports.declineJobQuotation = exports.acceptJobQuotation = exports.getSingleQuotation = exports.getJobQuotations = exports.getSingleJob = exports.getJobHistory = exports.getMyJobs = exports.createJobListing = exports.createJobRequest = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var jobRequestTemplate_1 = require("../../../templates/contractorEmail/jobRequestTemplate");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var services_1 = require("../../../services");
var date_fns_1 = require("date-fns");
var job_model_1 = require("../../../database/common/job.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var api_feature_1 = require("../../../utils/api.feature");
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var messages_schema_1 = require("../../../database/common/messages.schema");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var events_1 = require("../../../events");
var job_quotation_accepted_template_1 = require("../../../templates/contractorEmail/job_quotation_accepted.template");
var job_quotation_declined_template_1 = require("../../../templates/contractorEmail/job_quotation_declined.template");
var mongoose_1 = __importDefault(require("mongoose"));
var createJobRequest = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, contractorId, category, description, location_1, date, _b, expiresIn, emergency, media, voiceDescription, time, customerId, customer, contractor, startOfToday, existingJobRequest, dateTimeString, jobTime, currentDate, expiryDate, newJob, conversationMembers, conversation, newMessage, html, error_1;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 7, , 8]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ message: 'validatior error occured', errors: errors.array() })];
                }
                _a = req.body, contractorId = _a.contractorId, category = _a.category, description = _a.description, location_1 = _a.location, date = _a.date, _b = _a.expiresIn, expiresIn = _b === void 0 ? 7 : _b, emergency = _a.emergency, media = _a.media, voiceDescription = _a.voiceDescription, time = _a.time;
                customerId = req.customer.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(contractorId)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid contractor format' })];
                }
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _e.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Customer not found" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId).populate('profile')];
            case 2:
                contractor = _e.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Contractor not found" })];
                }
                // Check if contractor has a verified connected account
                if (!contractor.onboarding.hasStripeAccount || !(((_c = contractor.stripeAccountStatus) === null || _c === void 0 ? void 0 : _c.card_payments_enabled) && ((_d = contractor.stripeAccountStatus) === null || _d === void 0 ? void 0 : _d.transfers_enabled))) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "You cannot send a job request to this contractor because  stripe account is not set up" })];
                }
                startOfToday = (0, date_fns_1.startOfDay)(new Date());
                if (!(0, date_fns_1.isValid)(new Date(date)) || (!(0, date_fns_1.isFuture)(new Date(date)) && new Date(date) < startOfToday)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid date format or date is in the past' })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({
                        customer: customerId,
                        contractor: contractorId,
                        status: job_model_1.JOB_STATUS.PENDING,
                        date: { $eq: new Date(date) }, // consider all past jobs
                        createdAt: { $gte: (0, date_fns_1.addHours)(new Date(), -24) }, // Check for job requests within the last 72 hours
                    })];
            case 3:
                existingJobRequest = _e.sent();
                if (existingJobRequest) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'A similar job request has already been sent to this contractor within the last 24 hours' })];
                }
                dateTimeString = "".concat(new Date(date).toISOString().split('T')[0], "T").concat(time);
                jobTime = new Date(dateTimeString);
                currentDate = new Date();
                expiryDate = new Date(currentDate);
                expiryDate.setDate(currentDate.getDate() + expiresIn);
                newJob = new job_model_1.JobModel({
                    customer: customer.id,
                    contractor: contractorId,
                    description: description,
                    location: location_1,
                    date: date,
                    type: job_model_1.JobType.REQUEST,
                    time: jobTime,
                    expiresIn: expiresIn,
                    expiryDate: expiryDate,
                    emergency: emergency || false,
                    voiceDescription: voiceDescription,
                    media: media || [],
                    //@ts-ignore
                    title: "".concat(contractor.profile.skill, " Service"),
                    //@ts-ignore
                    category: "".concat(contractor.profile.skill)
                });
                // Save the job document to the database
                return [4 /*yield*/, newJob.save()];
            case 4:
                // Save the job document to the database
                _e.sent();
                conversationMembers = [
                    { memberType: 'customers', member: customerId },
                    { memberType: 'contractors', member: contractorId }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        $and: [
                            { members: { $elemMatch: { member: customer.id } } }, // memberType: 'customers'
                            { members: { $elemMatch: { member: contractorId } } } // memberType: 'contractors'
                        ]
                    }, {
                        members: conversationMembers,
                        lastMessage: "New job request: ".concat(description), // Set the last message to the job description
                        lastMessageAt: new Date() // Set the last message timestamp to now
                    }, { new: true, upsert: true })];
            case 5:
                conversation = _e.sent();
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversation._id,
                        sender: customerId, // Assuming the customer sends the initial message
                        message: "New job request: ".concat(description), // You can customize the message content as needed
                        messageType: messages_schema_1.MessageType.TEXT, // You can customize the message content as needed
                        createdAt: new Date()
                    })];
            case 6:
                newMessage = _e.sent();
                events_1.JobEvent.emit('NEW_JOB_REQUEST', { jobId: newJob.id, contractorId: contractorId, customerId: customerId, conversationId: conversation.id });
                html = (0, jobRequestTemplate_1.htmlJobRequestTemplate)(customer.firstName, customer.firstName, "".concat(date, " ").concat(time), description);
                services_1.EmailService.send(contractor.email, 'Job request from customer', html);
                res.status(201).json({ success: true, message: 'Job request submitted successfully', data: newJob });
                return [3 /*break*/, 8];
            case 7:
                error_1 = _e.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Bad Request', error_1))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createJobRequest = createJobRequest;
var createJobListing = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, category, description, location_2, date, expiresIn, emergency, media, voiceDescription, time, contractorType, customerId, customer, startOfToday, existingJobRequest, dateTimeString, jobTime, dateTimeString_1, jobTime_1, currentDate, expiryDate, newJob, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ message: 'validatior error occured', errors: errors.array() })];
                }
                _a = req.body, category = _a.category, description = _a.description, location_2 = _a.location, date = _a.date, expiresIn = _a.expiresIn, emergency = _a.emergency, media = _a.media, voiceDescription = _a.voiceDescription, time = _a.time, contractorType = _a.contractorType;
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Customer not found" })];
                }
                startOfToday = (0, date_fns_1.startOfDay)(new Date());
                if (!(0, date_fns_1.isValid)(new Date(date)) || (!(0, date_fns_1.isFuture)(new Date(date)) && new Date(date) < startOfToday)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid date format or date is in the past' })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({
                        customer: customerId,
                        status: job_model_1.JOB_STATUS.PENDING,
                        category: category,
                        date: { $eq: new Date(date) }, // consider all past jobs
                        createdAt: { $gte: (0, date_fns_1.addHours)(new Date(), -24) }, // Check for job requests within the last 72 hours
                    })];
            case 2:
                existingJobRequest = _b.sent();
                if (existingJobRequest) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'A similar job has already been created within the last 24 hours' })];
                }
                dateTimeString = "".concat(new Date(date).toISOString().split('T')[0], "T").concat('00:00:00.000Z');
                jobTime = new Date(dateTimeString);
                if (time) {
                    dateTimeString_1 = "".concat(new Date(date).toISOString().split('T')[0], "T").concat(time);
                    jobTime_1 = new Date(dateTimeString_1);
                }
                currentDate = new Date();
                expiryDate = new Date(currentDate);
                expiryDate.setDate(currentDate.getDate() + expiresIn);
                newJob = new job_model_1.JobModel({
                    customer: customer.id,
                    contractorType: contractorType,
                    description: description,
                    category: category,
                    location: location_2,
                    date: date,
                    time: jobTime,
                    expiresIn: expiresIn,
                    expiryDate: expiryDate,
                    emergency: emergency || false,
                    voiceDescription: voiceDescription,
                    media: media || [],
                    type: job_model_1.JobType.LISTING,
                    title: "".concat(category, " Service"),
                });
                // Save the job document to the database
                return [4 /*yield*/, newJob.save()];
            case 3:
                // Save the job document to the database
                _b.sent();
                events_1.JobEvent.emit('NEW_JOB_LISTING', { jobId: newJob.id });
                res.status(201).json({ success: true, message: 'Job listing submitted successfully', data: newJob });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_2))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createJobListing = createJobListing;
var getMyJobs = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, _b, limit, _c, page, _d, sort, contractorId_1, status_1, startDate, endDate, date, type, customerId, filter, quotations, quotationIds, start, end, selectedDate, startOfDay_1, endOfDay, _e, data, error, error_3;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 6, , 7]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.query, _b = _a.limit, limit = _b === void 0 ? 10 : _b, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, contractorId_1 = _a.contractorId, status_1 = _a.status, startDate = _a.startDate, endDate = _a.endDate, date = _a.date, type = _a.type;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                customerId = req.customer.id;
                filter = { customer: customerId };
                if (!contractorId_1) return [3 /*break*/, 2];
                if (!mongoose_1.default.Types.ObjectId.isValid(contractorId_1)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid contractor id' })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ contractor: contractorId_1 })];
            case 1:
                quotations = _f.sent();
                quotationIds = quotations.map(function (quotation) { return quotation._id; });
                console.log(quotationIds);
                filter['quotations.id'] = { $in: quotationIds };
                // filter['quotations.contractor'] = {$in: contractorId};
                delete req.query.contractorId;
                _f.label = 2;
            case 2:
                if (status_1) {
                    req.query.status = status_1.toUpperCase();
                }
                if (startDate && endDate) {
                    start = new Date(startDate);
                    end = new Date(endDate);
                    // Ensure that end date is adjusted to include the entire day
                    end.setDate(end.getDate() + 1);
                    req.query.createdAt = { $gte: start, $lt: end };
                    delete req.query.startDate;
                    delete req.query.endDate;
                }
                if (date) {
                    selectedDate = new Date(date);
                    startOfDay_1 = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
                    endOfDay = new Date(startOfDay_1);
                    endOfDay.setDate(startOfDay_1.getUTCDate() + 1);
                    req.query.date = { $gte: startOfDay_1, $lt: endOfDay };
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter).populate(['contractor', 'quotation']), req.query)];
            case 3:
                _e = _f.sent(), data = _e.data, error = _e.error;
                if (!data) return [3 /*break*/, 5];
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!contractorId_1) return [3 /*break*/, 2];
                                    _a = job;
                                    return [4 /*yield*/, job.getMyQoutation(contractorId_1)];
                                case 1:
                                    _a.myQuotation = _b.sent();
                                    _b.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 4:
                _f.sent();
                _f.label = 5;
            case 5:
                res.json({ success: true, message: 'Jobs retrieved', data: data });
                return [3 /*break*/, 7];
            case 6:
                error_3 = _f.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_3))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getMyJobs = getMyJobs;
var getJobHistory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, _b, page, _c, limit, _d, sort, contractorId_2, _e, status_2, quotations, jobIds, statusArray, _f, data, error, error_4;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                customerId = req.contractor.id;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 6, , 7]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, contractorId_2 = _a.contractorId, _e = _a.status, status_2 = _e === void 0 ? 'COMPLETED, CANCELLED' : _e;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                delete req.query.status;
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ contractor: contractorId_2 }).select('job').lean()];
            case 2:
                quotations = _g.sent();
                jobIds = quotations.map(function (quotation) { return quotation.job; });
                if (contractorId_2) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(contractorId_2)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid customer id' })];
                    }
                    req.query.contractor = contractorId_2;
                    delete req.query.contractorId;
                }
                statusArray = status_2.split(',').map(function (s) { return s.trim(); });
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find({
                        status: { $in: statusArray },
                        $or: [
                            { _id: { $in: jobIds } }, // Match jobs specified in jobIds
                            { contractor: contractorId_2 } // Match jobs with contractorId
                        ]
                    }).distinct('_id'), req.query)];
            case 3:
                _f = _g.sent(), data = _f.data, error = _f.error;
                if (!data) return [3 /*break*/, 5];
                // Map through each job and attach myQuotation if contractor has applied 
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = job;
                                    return [4 /*yield*/, job.getMyQoutation(contractorId_2)];
                                case 1:
                                    _a.myQuotation = _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 4:
                // Map through each job and attach myQuotation if contractor has applied 
                _g.sent();
                _g.label = 5;
            case 5:
                if (error) {
                    return [2 /*return*/, next(new custom_errors_1.BadRequestError('Unkowon error occured'))];
                }
                // Send response with job listings data
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 7];
            case 6:
                error_4 = _g.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_4))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getJobHistory = getJobHistory;
var getSingleJob = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, jobId, job, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                customerId = req.customer.id;
                jobId = req.params.jobId;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ customer: customerId, _id: jobId }).populate('contract')];
            case 1:
                job = _a.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // If the job exists, return it as a response
                res.json({ success: true, message: 'Job retrieved', data: job });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_5))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleJob = getSingleJob;
var getJobQuotations = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, jobId, job, quotations, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                customerId = req.customer.id;
                jobId = req.params.jobId;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ customer: customerId, _id: jobId }).populate('quotations')];
            case 1:
                job = _a.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found or does not belong to customer' })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ job: jobId, status: { $ne: job_quotation_model_1.JOB_QUOTATION_STATUS.DECLINED } }).populate([{ path: 'contractor' }])
                    // If the job exists, return its quo as a response
                ];
            case 2:
                quotations = _a.sent();
                // If the job exists, return its quo as a response
                res.json({ success: true, message: 'Job quotations retrieved', data: quotations });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_6))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getJobQuotations = getJobQuotations;
var getSingleQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, jobId, quotationId, quotation, _b, error_7;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                customerId = req.customer.id;
                _a = req.params, jobId = _a.jobId, quotationId = _a.quotationId;
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ _id: quotationId, job: jobId }).populate('contractor')];
            case 1:
                quotation = _c.sent();
                // Check if the job exists
                if (!quotation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Qoutation not found' })];
                }
                _b = quotation;
                return [4 /*yield*/, quotation.calculateCharges()];
            case 2:
                _b.charges = _c.sent();
                res.json({ success: true, message: 'Job quotation retrieved', data: quotation });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_7))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSingleQuotation = getSingleQuotation;
var acceptJobQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, jobId, quotationId_1, quotation, job, conversationMembers, conversation, newMessage, foundQuotationIndex, contractor, customer, html, _b, error_8;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 10, , 11]);
                customerId = req.customer.id;
                _a = req.params, jobId = _a.jobId, quotationId_1 = _a.quotationId;
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ _id: quotationId_1, job: jobId })];
            case 1:
                quotation = _c.sent();
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 2:
                job = _c.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // check if contractor exists
                if (!quotation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Qoutation not found' })];
                }
                quotation.status = job_quotation_model_1.JOB_QUOTATION_STATUS.ACCEPTED;
                conversationMembers = [
                    { memberType: 'customers', member: customerId },
                    { memberType: 'contractors', member: quotation.contractor }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({
                        $and: [
                            { members: { $elemMatch: { member: customerId } } }, // memberType: 'customers'
                            { members: { $elemMatch: { member: quotation.contractor } } } // memberType: 'contractors'
                        ]
                    }, {
                        members: conversationMembers,
                        lastMessage: 'I have accepted your qoutation for the Job', // Set the last message to the job description
                        lastMessageAt: new Date() // Set the last message timestamp to now
                    }, { new: true, upsert: true })];
            case 3:
                conversation = _c.sent();
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversation._id,
                        sender: customerId, // Assuming the customer sends the initial message
                        message: "I have accepted your qoutation for the Job", // You can customize the message content as needed
                        messageType: messages_schema_1.MessageType.TEXT, // You can customize the message content as needed
                        createdAt: new Date()
                    })];
            case 4:
                newMessage = _c.sent();
                // Accepting does not mean
                // job.quotation = quotation.id
                // job.contractor = quotation.contractor
                // job.status = JOB_STATUS.ACCEPTED // no need of moving status to Accepted again - 
                return [4 /*yield*/, quotation.save()];
            case 5:
                // Accepting does not mean
                // job.quotation = quotation.id
                // job.contractor = quotation.contractor
                // job.status = JOB_STATUS.ACCEPTED // no need of moving status to Accepted again - 
                _c.sent();
                foundQuotationIndex = job.quotations.findIndex(function (quotation) { return quotation.id == quotationId_1; });
                if (foundQuotationIndex !== -1) {
                    job.quotations[foundQuotationIndex].status = job_quotation_model_1.JOB_QUOTATION_STATUS.ACCEPTED;
                }
                return [4 /*yield*/, job.save()];
            case 6:
                _c.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(quotation.contractor)];
            case 7:
                contractor = _c.sent();
                return [4 /*yield*/, customer_model_1.default.findById(customerId)
                    //emit event - mail should be sent from event handler shaa
                ];
            case 8:
                customer = _c.sent();
                //emit event - mail should be sent from event handler shaa
                events_1.JobEvent.emit('JOB_QOUTATION_ACCEPTED', { jobId: jobId, contractorId: quotation.contractor, customerId: customerId, conversationId: conversation.id });
                // send mail to contractor
                if (contractor && customer) {
                    html = (0, job_quotation_accepted_template_1.htmlJobQuotationAcceptedContractorEmailTemplate)(contractor.name, customer.name, job);
                    services_1.EmailService.send(contractor.email, 'Job Quotation Accepted', html);
                }
                _b = quotation;
                return [4 /*yield*/, quotation.calculateCharges()];
            case 9:
                _b.charges = _c.sent();
                res.json({ success: true, message: 'Job quotation accepted' });
                return [3 /*break*/, 11];
            case 10:
                error_8 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_8))];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.acceptJobQuotation = acceptJobQuotation;
var declineJobQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, jobId, quotationId_2, quotation, job, foundQuotationIndex, contractor, customer, html, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                customerId = req.customer.id;
                _a = req.params, jobId = _a.jobId, quotationId_2 = _a.quotationId;
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findOne({ _id: quotationId_2, job: jobId })];
            case 1:
                quotation = _b.sent();
                return [4 /*yield*/, job_model_1.JobModel.findById(jobId)];
            case 2:
                job = _b.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // check if contractor exists
                if (!quotation) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Qoutation not found' })];
                }
                quotation.status = job_quotation_model_1.JOB_QUOTATION_STATUS.DECLINED;
                // maybe send mail out ?
                return [4 /*yield*/, quotation.save()];
            case 3:
                // maybe send mail out ?
                _b.sent();
                foundQuotationIndex = job.quotations.findIndex(function (quotation) { return quotation.id == quotationId_2; });
                if (foundQuotationIndex !== -1) {
                    job.quotations[foundQuotationIndex].status = job_quotation_model_1.JOB_QUOTATION_STATUS.DECLINED;
                }
                return [4 /*yield*/, job.save()];
            case 4:
                _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(quotation.contractor)];
            case 5:
                contractor = _b.sent();
                return [4 /*yield*/, customer_model_1.default.findById(customerId)
                    //emit event - mail should be sent from event handler shaa
                ];
            case 6:
                customer = _b.sent();
                //emit event - mail should be sent from event handler shaa
                events_1.JobEvent.emit('JOB_QOUTATION_DECLINED', { jobId: jobId, contractorId: quotation.contractor, customerId: customerId });
                // send mail to contractor
                if (contractor && customer) {
                    html = (0, job_quotation_declined_template_1.htmlJobQuotationDeclinedContractorEmailTemplate)(contractor.name, customer.name, job);
                    services_1.EmailService.send(contractor.email, 'Job Quotation Declined', html);
                }
                res.json({ success: true, message: 'Job quotation declined' });
                return [3 /*break*/, 8];
            case 7:
                error_9 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_9))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.declineJobQuotation = declineJobQuotation;
exports.CustomerJobController = {
    createJobRequest: exports.createJobRequest,
    getMyJobs: exports.getMyJobs,
    getJobHistory: exports.getJobHistory,
    createJobListing: exports.createJobListing,
    getSingleJob: exports.getSingleJob,
    getJobQuotations: exports.getJobQuotations,
    getSingleQuotation: exports.getSingleQuotation,
    acceptJobQuotation: exports.acceptJobQuotation,
    declineJobQuotation: exports.declineJobQuotation
};
