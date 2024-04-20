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
exports.CustomerJobController = exports.captureJobPayment = exports.makeJobPayment = exports.declineJobQuotation = exports.acceptJobQuotation = exports.getSingleQuotation = exports.getJobQuotations = exports.getSingleJob = exports.getMyJobs = exports.createJobListing = exports.createJobRequest = void 0;
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
var transaction_model_1 = __importDefault(require("../../../database/common/transaction.model"));
var stripe_1 = require("../../../services/stripe");
var bullmq_1 = require("../../../services/bullmq");
var events_1 = require("../../../events");
var job_quotation_accepted_template_1 = require("../../../templates/contractorEmail/job_quotation_accepted.template");
var job_quotation_declined_template_1 = require("../../../templates/contractorEmail/job_quotation_declined.template");
var mongoose_1 = __importDefault(require("mongoose"));
var createJobRequest = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, contractorId, category, description, location_1, date, expiresIn, emergency, media, voiceDescription, time, customerId, customer, contractor, startOfToday, existingJobRequest, dateTimeString, jobTime, newJob, conversationMembers, conversation, newMessage, html, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ message: 'validatior error occured', errors: errors.array() })];
                }
                _a = req.body, contractorId = _a.contractorId, category = _a.category, description = _a.description, location_1 = _a.location, date = _a.date, expiresIn = _a.expiresIn, emergency = _a.emergency, media = _a.media, voiceDescription = _a.voiceDescription, time = _a.time;
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Customer not found" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId).populate('profile')];
            case 2:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Contractor not found" })];
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
                existingJobRequest = _b.sent();
                if (existingJobRequest) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'A similar job request has already been sent to this contractor within the last 24 hours' })];
                }
                dateTimeString = "".concat(new Date(date).toISOString().split('T')[0], "T").concat(time);
                jobTime = new Date(dateTimeString);
                newJob = new job_model_1.JobModel({
                    customer: customer.id,
                    contractor: contractorId,
                    description: description,
                    location: location_1,
                    date: date,
                    type: job_model_1.JobType.REQUEST,
                    time: jobTime,
                    expiresIn: expiresIn,
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
                _b.sent();
                conversationMembers = [
                    { memberType: 'customers', member: customerId },
                    { memberType: 'contractors', member: contractorId }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({ members: { $elemMatch: { $or: [{ member: customer.id }, { member: contractorId }] } }
                    }, {
                        members: conversationMembers
                    }, { new: true, upsert: true })];
            case 5:
                conversation = _b.sent();
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversation._id,
                        sender: customerId, // Assuming the customer sends the initial message
                        message: "New job request: ".concat(description), // You can customize the message content as needed
                        messageType: messages_schema_1.MessageType.TEXT, // You can customize the message content as needed
                        createdAt: new Date()
                    })];
            case 6:
                newMessage = _b.sent();
                events_1.JobEvent.emit('NEW_JOB_REQUEST', { jobId: newJob.id, contractorId: contractorId, customerId: customerId, conversationId: conversation.id });
                html = (0, jobRequestTemplate_1.htmlJobRequestTemplate)(customer.firstName, customer.firstName, "".concat(date, " ").concat(time), description);
                services_1.EmailService.send(contractor.email, 'Job request from customer', html);
                res.status(201).json({ success: true, message: 'Job request submitted successfully', data: newJob });
                return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Bad Request', error_1))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createJobRequest = createJobRequest;
var createJobListing = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, category, description, location_2, date, expiresIn, emergency, media, voiceDescription, time, contractorType, customerId, customer, startOfToday, existingJobRequest, dateTimeString, jobTime, newJob, error_2;
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
                dateTimeString = "".concat(new Date(date).toISOString().split('T')[0], "T").concat(time);
                jobTime = new Date(dateTimeString);
                console.log('HWat happened here', jobTime);
                newJob = new job_model_1.JobModel({
                    customer: customer.id,
                    contractorType: contractorType,
                    description: description,
                    category: category,
                    location: location_2,
                    date: date,
                    time: jobTime,
                    expiresIn: expiresIn,
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
    var errors, _a, contractor, status_1, startDate, endDate, date, type, customerId, filter, start, end, selectedDate, startOfDay_1, endOfDay_1, _b, data, error, jobs, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.query, contractor = _a.contractor, status_1 = _a.status, startDate = _a.startDate, endDate = _a.endDate, date = _a.date, type = _a.type;
                customerId = req.customer.id;
                filter = { customer: customerId };
                // TODO: when contractor is specified, ensure the contractor quotation is attached
                if (contractor) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(contractor)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid contractor id' })];
                    }
                    req.query.contractor = contractor;
                }
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
                    endOfDay_1 = new Date(startOfDay_1);
                    endOfDay_1.setDate(startOfDay_1.getUTCDate() + 1);
                    req.query.date = { $gte: startOfDay_1, $lt: endOfDay_1 };
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter), req.query)];
            case 1:
                _b = _c.sent(), data = _b.data, error = _b.error;
                return [4 /*yield*/, job_model_1.JobModel.find()];
            case 2:
                jobs = _c.sent();
                res.json({ success: true, message: 'Jobs retrieved', data: data });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_3))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMyJobs = getMyJobs;
var getSingleJob = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, jobId, job, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                customerId = req.customer.id;
                jobId = req.params.jobId;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ customer: customerId, _id: jobId }).exec()];
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
                error_4 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_4))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleJob = getSingleJob;
var getJobQuotations = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, jobId, job, quotations, error_5;
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
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.find({ job: jobId, status: { $ne: job_quotation_model_1.JOB_QUOTATION_STATUS.DECLINED } }).populate([{ path: 'contractor' }])
                    // If the job exists, return its quo as a response
                ];
            case 2:
                quotations = _a.sent();
                // If the job exists, return its quo as a response
                res.json({ success: true, message: 'Job quotations retrieved', data: quotations });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_5))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getJobQuotations = getJobQuotations;
var getSingleQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, jobId, quotationId, quotation, _b, error_6;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                customerId = req.customer.id;
                _a = req.params, jobId = _a.jobId, quotationId = _a.quotationId;
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOne({ _id: quotationId, job: jobId }).populate('contractor')];
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
                error_6 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_6))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSingleQuotation = getSingleQuotation;
var acceptJobQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, jobId, quotationId_1, quotation, job, conversationMembers, conversation, newMessage, foundQuotationIndex, contractor, customer, html, _b, error_7;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 10, , 11]);
                customerId = req.customer.id;
                _a = req.params, jobId = _a.jobId, quotationId_1 = _a.quotationId;
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOne({ _id: quotationId_1, job: jobId })];
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
                return [4 /*yield*/, conversations_schema_1.ConversationModel.findOneAndUpdate({ members: { $elemMatch: { $or: [{ member: customerId }, { member: quotation.contractor }] } } }, {
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
                job.quotation = quotation.id;
                job.status = job_model_1.JOB_STATUS.ACCEPTED;
                return [4 /*yield*/, quotation.save()];
            case 5:
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
                error_7 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_7))];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.acceptJobQuotation = acceptJobQuotation;
var declineJobQuotation = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, jobId, quotationId_2, quotation, job, foundQuotationIndex, contractor, customer, html, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                customerId = req.customer.id;
                _a = req.params, jobId = _a.jobId, quotationId_2 = _a.quotationId;
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOne({ _id: quotationId_2, job: jobId })];
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
                error_8 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_8))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.declineJobQuotation = declineJobQuotation;
//customer accept and pay for the work /////////////
var makeJobPayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId_1, jobId, errors, customerId, customer, job, quotation, contractor, generateInvoce, invoiceId, charges, newTransaction, saveTransaction, transactionId, paymentMethod, payload, stripePayment, err_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                _a = req.body, quotationId = _a.quotationId, paymentMethodId_1 = _a.paymentMethodId;
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                customer = _c.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId })];
            case 2:
                job = _c.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job do not exist" })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOne({ _id: quotationId })];
            case 3:
                quotation = _c.sent();
                if (!quotation) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Job quotation not found" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: quotation.contractor })];
            case 4:
                contractor = _c.sent();
                generateInvoce = new Date().getTime().toString();
                invoiceId = generateInvoce.substring(generateInvoce.length - 5);
                return [4 /*yield*/, quotation.calculateCharges()];
            case 5:
                charges = _c.sent();
                newTransaction = new transaction_model_1.default({
                    type: 'credit',
                    amount: charges.totalAmount,
                    initiator: customerId,
                    from: 'customer',
                    to: 'admin',
                    fromId: customerId,
                    toId: 'admin',
                    description: "qoutation from ".concat(contractor === null || contractor === void 0 ? void 0 : contractor.firstName, " payment"),
                    status: 'pending',
                    form: 'qoutation',
                    invoiceId: invoiceId,
                    jobId: jobId
                });
                return [4 /*yield*/, newTransaction.save()];
            case 6:
                saveTransaction = _c.sent();
                transactionId = JSON.stringify(saveTransaction._id);
                paymentMethod = customer.stripePaymentMethods.find(function (method) { return method.id == paymentMethodId_1; });
                if (!paymentMethod) {
                    paymentMethod = customer.stripePaymentMethods[0];
                }
                ;
                if (!paymentMethod)
                    throw new Error("No such payment method");
                payload = {
                    payment_method_types: ['card'],
                    payment_method: paymentMethod.id,
                    currency: 'usd',
                    amount: (charges.totalAmount) * 100,
                    application_fee_amount: (charges.processingFee) * 100, // send everthing to connected account and  application_fee_amount will be transfered back
                    transfer_data: {
                        // amount: (charges.contractorAmount) * 100, // transfer to connected account
                        destination: (_b = contractor === null || contractor === void 0 ? void 0 : contractor.stripeAccount.id) !== null && _b !== void 0 ? _b : '' // mostimes only work with same region example us, user
                        // https://docs.stripe.com/connect/destination-charges
                    },
                    on_behalf_of: contractor === null || contractor === void 0 ? void 0 : contractor.stripeAccount.id,
                    metadata: {
                        customerId: customerId,
                        constractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                        quotationId: quotationId,
                        type: "job_booking",
                        jobId: jobId,
                        email: customer.email,
                        transactionId: transactionId,
                        remark: 'initial_job_payment' // we can have extra_job_payment
                    },
                    customer: customer.stripeCustomer.id,
                    off_session: true,
                    confirm: true,
                };
                console.log('payload', payload);
                return [4 /*yield*/, stripe_1.StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)];
            case 7:
                stripePayment = _c.sent();
                job.status = job_model_1.JOB_STATUS.BOOKED;
                return [4 /*yield*/, job.save()];
            case 8:
                _c.sent();
                res.json({ success: true, message: 'Payment intent created', data: stripePayment });
                return [3 /*break*/, 10];
            case 9:
                err_1 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_1.message, err_1))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.makeJobPayment = makeJobPayment;
var captureJobPayment = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, quotationId, paymentMethodId_2, jobId, errors, customerId, customer, job, quotation, contractor, generateInvoce, invoiceId, charges, newTransaction, saveTransaction, transactionId, paymentMethod, payload, stripePayment, err_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                _a = req.body, quotationId = _a.quotationId, paymentMethodId_2 = _a.paymentMethodId;
                jobId = req.params.jobId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                customer = _c.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId })];
            case 2:
                job = _c.sent();
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job do not exist" })];
                }
                return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOne({ _id: quotationId })];
            case 3:
                quotation = _c.sent();
                if (!quotation) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Job quotation not found" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: quotation.contractor })];
            case 4:
                contractor = _c.sent();
                generateInvoce = new Date().getTime().toString();
                invoiceId = generateInvoce.substring(generateInvoce.length - 5);
                return [4 /*yield*/, quotation.calculateCharges()];
            case 5:
                charges = _c.sent();
                newTransaction = new transaction_model_1.default({
                    type: 'credit',
                    amount: charges.totalAmount,
                    initiator: customerId,
                    from: 'customer',
                    to: 'admin',
                    fromId: customerId,
                    toId: 'admin',
                    description: "qoutation from ".concat(contractor === null || contractor === void 0 ? void 0 : contractor.firstName, " payment"),
                    status: 'pending',
                    form: 'qoutation',
                    invoiceId: invoiceId,
                    jobId: jobId
                });
                return [4 /*yield*/, newTransaction.save()];
            case 6:
                saveTransaction = _c.sent();
                transactionId = JSON.stringify(saveTransaction._id);
                paymentMethod = customer.stripePaymentMethods.find(function (method) { return method.id == paymentMethodId_2; });
                if (!paymentMethod) {
                    paymentMethod = customer.stripePaymentMethods[0];
                }
                ;
                if (!paymentMethod)
                    throw new Error("No such payment method");
                payload = {
                    payment_method_types: ['card'],
                    payment_method_options: {
                        card: {
                            capture_method: 'manual',
                            // request_extended_authorization: 'if_available', // 30 days
                        },
                    },
                    expand: ['latest_charge'],
                    payment_method: paymentMethod.id,
                    currency: 'usd',
                    amount: (charges.totalAmount) * 100,
                    application_fee_amount: (charges.processingFee) * 100, // send everthing to connected account and  application_fee_amount will be transfered back
                    transfer_data: {
                        // amount: (charges.contractorAmount) * 100, // transfer to connected account
                        destination: (_b = contractor === null || contractor === void 0 ? void 0 : contractor.stripeAccount.id) !== null && _b !== void 0 ? _b : '' // mostimes only work with same region example us, user
                        // https://docs.stripe.com/connect/destination-charges
                    },
                    on_behalf_of: contractor === null || contractor === void 0 ? void 0 : contractor.stripeAccount.id,
                    metadata: {
                        customerId: customerId,
                        constractorId: contractor === null || contractor === void 0 ? void 0 : contractor.id,
                        quotationId: quotationId,
                        type: "job_payment",
                        jobId: jobId,
                        email: customer.email,
                        transactionId: transactionId,
                        remark: 'initial_job_payment' // we can have extra_job_payment
                    },
                    customer: customer.stripeCustomer.id,
                    off_session: true,
                    confirm: true,
                    capture_method: 'manual'
                };
                return [4 /*yield*/, stripe_1.StripeService.payment.chargeCustomer(paymentMethod.customer, paymentMethod.id, payload)];
            case 7:
                stripePayment = _c.sent();
                job.status = job_model_1.JOB_STATUS.BOOKED;
                return [4 /*yield*/, job.save()];
            case 8:
                _c.sent();
                bullmq_1.QueueService.addJob('dod', {}, {});
                res.json({ success: true, message: 'Payment intent created', data: stripePayment });
                return [3 /*break*/, 10];
            case 9:
                err_2 = _c.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError(err_2.message, err_2))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.captureJobPayment = captureJobPayment;
// //customer get job qoutation payment and open /////////////
// export const customerGetJobQoutationPaymentOpenController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'qoutation payment open' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer confirm or verified payment /////////////
// export const customerVerififyPaymentForJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//             jobId,
//             paymentId,
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'qoutation payment open' })
//         if (!job) {
//             return res
//                 .status(401)
//                 .json({ message: "job do not exist or payment has not be initialize" });
//         }
//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');
//         if (!contractor) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect contractor Id" });
//         }
//         let secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";
//         let stripeInstance;
//         console.log(secret)
//         if (!secret) {
//             return res
//                 .status(401)
//                 .json({ message: "Sripe API Key is missing" });
//         }
//         stripeInstance = new stripe(secret);
//         const paymentConfirmation = await stripeInstance.checkout.sessions.retrieve(paymentId)
//         if (paymentConfirmation.status !== "complete") {
//             return res
//                 .status(401)
//                 .json({ message: "no payment or payment url expired" });
//         }
//         if (paymentConfirmation.metadata?.customerId != customerId) {
//             return res
//                 .status(401)
//                 .json({ message: "payment ID in not for this customer" });
//         }
//         job.status = "qoutation payment confirm and job in progress";
//         await job.save()
//         const html = customerAcceptQouteAndPaySendEmailHtmlMailTemplate(contractor?.firstName, checkCustomer.firstName);
//         let emailData = {
//             emailTo: contractor.email,
//             subject: "Artisan payment for the job",
//             html
//         };
//         await sendEmail(emailData);
//         const admins = await AdminRegModel.find();
//         for (let i = 0; i < admins.length; i++) {
//             const admin = admins[i];
//             const html = customerToAdminAfterPaymentSendEmailHtmlMailTemplate(contractor.firstName, checkCustomer.firstName);
//             let emailData = {
//                 emailTo: admin.email,
//                 subject: "Artisan payment for the job",
//                 html
//             };
//             await sendEmail(emailData);
//         }
//         res.json({
//             message: "payment successfully comfirm",
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer get job qoutation payment confirm and job in progres /////////////
// export const customerGetJobQoutationPaymentConfirmAndJobInProgressController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'qoutation payment confirm and job in progress' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer get job request rejected /////////////
// export const customerGetJobRejectedontroller = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'job reject' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //get all job history/////////////
// export const customerGetAllSetJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         let {
//             page,
//             limit
//         } = req.query;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         page = page || 1;
//         limit = limit || 50;
//         const skip = (page - 1) * limit;
//         const jobs = await JobModel.find({ customerId })
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);
//         const jobHistory = [];
//         for (let i = 0; i < jobs.length; i++) {
//             const job = jobs[i];
//             const contractorProfile = await ContractorModel.findOne({ _id: job.contractorId }).select('-password')
//             //const contractorDocument = await ContractorDocumentValidateModel.findOne({contractorId: job.contractorId});
//             const obj = {
//                 job,
//                 contractorProfile,
//                 //contractorDocument
//             }
//             jobHistory.push(obj);
//         }
//         res.json({
//             jobHistory
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer confirm or verified payment web hook/////////////
// export const customerVerififyPaymentWebhook = async (
//     jobId: any,
//     customerId: any,
//     transactionId: any
// ) => {
//     try {
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return
//         }
//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'qoutation payment open' })
//         if (!job) {
//             return
//         }
//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');
//         if (!contractor) {
//             return
//         }
//         const transaction = await TransactionModel.findOne({ _id: transactionId.substring(1, transactionId.length - 1) });
//         if (!transaction) {
//             return
//         }
//         job.status = "qoutation payment confirm and job in progress";
//         await job.save()
//         transaction.status = 'successful',
//             await transaction.save();
//         const html = customerAcceptQouteAndPaySendEmailHtmlMailTemplate(contractor?.firstName, checkCustomer.firstName);
//         let emailData = {
//             emailTo: contractor.email,
//             subject: "Artisan payment for the job",
//             html
//         };
//         await sendEmail(emailData);
//         const admins = await AdminRegModel.find();
//         const adminPaymentHtml = htmlAdminPaymentTemplate(jobId, checkCustomer._id, `${job.totalAmountCustomerToPaid} for job qoutation`)
//         for (let i = 0; i < admins.length; i++) {
//             const admin = admins[i];
//             let adminEmailData = {
//                 emailTo: admin.email,
//                 subject: "qoutation payment",
//                 html: adminPaymentHtml
//             };
//             await sendEmail(adminEmailData);
//             //admin notification
//             const adminNotic = new AdminNoficationModel({
//                 title: "Job Booked",
//                 message: `${job._id} - ${checkCustomer.firstName} booked a job for $${job.totalAmountCustomerToPaid}.`,
//                 status: "unseen"
//             })
//             await adminNotic.save();
//         }
//         //contractor notification
//         const contractorNotic = new ContractorNotificationModel({
//             contractorId: contractor._id,
//             message: `You've been booked for a job from ${checkCustomer.firstName} for ${job.time}`,
//             status: "unseen"
//         });
//         await contractorNotic.save();
//         //customer notification
//         const customerNotic = new CustomerNotificationModel({
//             customerId: checkCustomer._id,
//             message: `You've booked a job with ${contractor.firstName} for ${job.jobTitle}`,
//             status: "unseen"
//         })
//         await customerNotic.save();
//         //customer notification two
//         const customerNoticTwo = new CustomerNotificationModel({
//             customerId: checkCustomer._id,
//             message: `You've just sent a payment for this job - ${job.jobTitle}, Thank you.`,
//             status: "unseen"
//         })
//         await customerNoticTwo.save();
//     } catch (err: any) {
//         // signup error
//         console.log("payment Error", "err")
//     }
// }
// //customer get job completed by contractor /////////////
// export const customerGetComletedByContractorController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'completed' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer comfirm job completed by Contractor /////////////
// export const customerComfirmedJobJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//             jobId
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'completed' })
//         if (!job) {
//             return res
//                 .status(401)
//                 .json({ message: "job do not exist or has not been completed by artisan" });
//         }
//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');
//         if (!contractor) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect contractor id" });
//         }
//         const contractorBank = await ContractorBankModel.findOne({ contractorId: contractor._id })
//         if (!contractorBank) {
//             return res
//                 .status(401)
//                 .json({ message: "contractor has not enter his bank detail" });
//         }
//         const newPayout = new PayoutModel({
//             amount: job.totalAmountContractorWithdraw,
//             accountName: `${contractor.firstName} ${contractor.lastName}`,
//             accountNumber: contractorBank.accountNumber,
//             bankName: contractorBank.financialInstitution,
//             recieverId: contractor._id,
//             jobId,
//             status: "pending"
//         })
//         await newPayout.save()
//         job.status = "comfirmed";
//         await job.save()
//         //admin notification 
//         const adminNotic = new AdminNoficationModel({
//             title: "Customer Confirmed Job Completed",
//             message: `${jobId} - ${checkCustomer.firstName} has updated this job to completed and comfirm`,
//             status: "unseen"
//         })
//         await adminNotic.save();
//         res.json({
//             message: "you successfully comfirm this job completed by artisan"
//         });
//     } catch (err: any) {
//         console.log("error", err)
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer get you comfirm  job/////////////
// export const customerGetComfirmJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'comfirmed' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer complaint job completed by Contractor /////////////
// export const customerComplaintedJobJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//             jobId
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const job = await JobModel.findOne({ _id: jobId, customerId, status: 'completed' })
//         if (!job) {
//             return res
//                 .status(401)
//                 .json({ message: "job do not exist or has not been completed by artisan" });
//         }
//         const contractor = await ContractorModel.findOne({ _id: job.contractorId }).select('-password');
//         job.status = "complain";
//         await job.save()
//         //admin notification 
//         const adminNotic = new AdminNoficationModel({
//             title: "Customer Disagreed on Job Completion",
//             message: `${job} - ${checkCustomer.firstName} disagreed that this job has been completed by this contractor ${contractor?.firstName}.`,
//             status: "unseen"
//         })
//         await adminNotic.save();
//         res.json({
//             message: "you successfully complained about this job completed by artisan"
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
// //customer get job he  complain about /////////////
// export const customerGetComplainJobController = async (
//     req: any,
//     res: Response,
// ) => {
//     try {
//         const {
//         } = req.body;
//         // Check for validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const customer = req.customer;
//         const customerId = customer.id
//         const checkCustomer = await CustomerRegModel.findOne({ _id: customerId })
//         if (!checkCustomer) {
//             return res
//                 .status(401)
//                 .json({ message: "incorrect Customer ID" });
//         }
//         const jobRequests = await JobModel.find({ customerId, status: 'complain' }).sort({ createdAt: -1 })
//         let jobRequested = []
//         for (let i = 0; i < jobRequests.length; i++) {
//             const jobRequest = jobRequests[i];
//             const contractor = await ContractorModel.findOne({ _id: jobRequest.contractorId }).select('-password');
//             const obj = {
//                 job: jobRequest,
//                 contractor
//             }
//             jobRequested.push(obj)
//         }
//         res.json({
//             jobRequested
//         });
//     } catch (err: any) {
//         // signup error
//         res.status(500).json({ message: err.message });
//     }
// }
exports.CustomerJobController = {
    createJobRequest: exports.createJobRequest,
    getMyJobs: exports.getMyJobs,
    createJobListing: exports.createJobListing,
    getSingleJob: exports.getSingleJob,
    getJobQuotations: exports.getJobQuotations,
    getSingleQuotation: exports.getSingleQuotation,
    makeJobPayment: exports.makeJobPayment,
    captureJobPayment: exports.captureJobPayment,
    acceptJobQuotation: exports.acceptJobQuotation,
    declineJobQuotation: exports.declineJobQuotation
};
