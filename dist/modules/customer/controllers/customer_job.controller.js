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
exports.CustomerJobController = exports.makeJobPayment = exports.getSingleJobApplications = exports.getSingleJob = exports.getJobs = exports.createJobListing = exports.createJobRequest = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var stripe_1 = __importDefault(require("stripe"));
var jobRequestTemplate_1 = require("../../../templates/contractorEmail/jobRequestTemplate");
var customer_jobrequest_model_1 = require("../../../database/customer/models/customer_jobrequest.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var services_1 = require("../../../services");
var date_fns_1 = require("date-fns");
var job_model_1 = require("../../../database/common/job.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var api_feature_1 = require("../../../utils/api.feature");
var conversations_schema_1 = require("../../../database/common/conversations.schema");
var messages_schema_1 = require("../../../database/common/messages.schema");
var job_application_model_1 = require("../../../database/common/job_application.model");
var transaction_model_1 = __importDefault(require("../../../database/common/transaction.model"));
var stripe_2 = require("../../../services/stripe");
var createJobRequest = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, contractorId, category, description, location_1, date, expiresIn, emergency, media, voiceDescription, time, customerId, customer, contractor, startOfToday, existingJobRequest, dateTimeString, jobTime, newJob, conversationMembers, newConversation, newMessage, html, error_1;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 7, , 8]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ message: 'validatior error occured', errors: errors.array() })];
                }
                _a = req.body, contractorId = _a.contractorId, category = _a.category, description = _a.description, location_1 = _a.location, date = _a.date, expiresIn = _a.expiresIn, emergency = _a.emergency, media = _a.media, voiceDescription = _a.voiceDescription, time = _a.time;
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 1:
                customer = _d.sent();
                if (!customer) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: "Customer not found" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId).populate('profile')];
            case 2:
                contractor = _d.sent();
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
                        status: customer_jobrequest_model_1.JobRequestStatus.PENDING,
                        date: { $eq: new Date(date) }, // consider all past jobs
                        createdAt: { $gte: (0, date_fns_1.addHours)(new Date(), -72) }, // Check for job requests within the last 72 hours
                    })];
            case 3:
                existingJobRequest = _d.sent();
                if (existingJobRequest) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'A similar job request has already been sent to this contractor within the last 72 hours' })];
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
                _d.sent();
                conversationMembers = [
                    { memberType: 'customers', member: customerId },
                    { memberType: 'contractors', member: contractorId }
                ];
                return [4 /*yield*/, conversations_schema_1.ConversationModel.create({
                        members: conversationMembers,
                        entity: newJob._id,
                        entityType: conversations_schema_1.ConversationEntityType.JOB,
                        lastMessage: description, // Set the last message to the job description
                        lastMessageAt: new Date() // Set the last message timestamp to now
                    })];
            case 5:
                newConversation = _d.sent();
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: newConversation._id,
                        sender: customerId, // Assuming the customer sends the initial message
                        message: "New job request: ".concat(description), // You can customize the message content as needed
                        messageType: messages_schema_1.MessageType.TEXT, // You can customize the message content as needed
                        createdAt: new Date()
                    })];
            case 6:
                newMessage = _d.sent();
                //  IT WILL BE WISE TO MOVE ALL THIS TO EVENT LISTENER TO KEEP THE CONTROLLER LEAN
                //   contractor notification
                services_1.NotificationService.sendNotification({
                    user: contractor.id,
                    userType: 'contractors',
                    title: 'New Job Request',
                    type: 'NEW_JOB_REQUEST',
                    message: "You've received a job request from ".concat(customer.firstName),
                    heading: { name: "".concat(customer.firstName, " ").concat(customer.lastName), image: (_b = customer.profilePhoto) === null || _b === void 0 ? void 0 : _b.url },
                    payload: {
                        entity: newJob.id,
                        entityType: 'jobs',
                        message: "You've received a job request from ".concat(customer.firstName),
                        contractor: contractor.id,
                    }
                }, { database: true, push: true });
                services_1.NotificationService.sendNotification({
                    user: customer.id,
                    userType: 'customers',
                    title: 'New Job Request',
                    type: 'NEW_JOB_REQUEST',
                    //@ts-ignore
                    message: "You've  sent a job request to ".concat(contractor.name),
                    //@ts-ignore
                    heading: { name: "".concat(contractor.name), image: (_c = contractor.profilePhoto) === null || _c === void 0 ? void 0 : _c.url },
                    payload: {
                        entity: newJob.id,
                        entityType: 'jobs',
                        //@ts-ignore
                        message: "You've sent a job request to ".concat(contractor.name),
                        customer: customer.id,
                    }
                }, { database: true, push: true });
                html = (0, jobRequestTemplate_1.htmlJobRequestTemplate)(customer.firstName, customer.firstName, "".concat(date, " ").concat(time), description);
                services_1.EmailService.send(contractor.email, 'Job request from customer', html);
                res.status(201).json({ success: true, message: 'Job request submitted successfully', data: newJob });
                return [3 /*break*/, 8];
            case 7:
                error_1 = _d.sent();
                console.error('Error submitting job request:', error_1);
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('Bad Request'))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createJobRequest = createJobRequest;
var createJobListing = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, category, description, location_2, date, expiresIn, emergency, media, voiceDescription, time, contractorType, customerId, customer, existingJobRequest, dateTimeString, jobTime, newJob, error_2;
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
                // Check if the specified date is valid
                if (!(0, date_fns_1.isFuture)(new Date(date))) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid date formate or date is not in the future' })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({
                        customer: customerId,
                        status: customer_jobrequest_model_1.JobRequestStatus.PENDING,
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
                console.error('Error submitting job listing:', error_2);
                res.status(400).json({ success: false, message: 'Bad Request' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createJobListing = createJobListing;
var getJobs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, contractorId, status_1, startDate, endDate, date, type, customerId, filter, start, end, selectedDate, startOfDay_1, endOfDay_1, _b, data, error, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.query, contractorId = _a.contractorId, status_1 = _a.status, startDate = _a.startDate, endDate = _a.endDate, date = _a.date, type = _a.type;
                customerId = req.customer.id;
                filter = {};
                if (customerId) {
                    filter.customer = customerId;
                }
                if (contractorId) {
                    filter.contractor = contractorId;
                }
                if (type) {
                    filter.type = type.toUpperCase();
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
                    startOfDay_1 = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
                    endOfDay_1 = new Date(startOfDay_1);
                    endOfDay_1.setDate(startOfDay_1.getUTCDate() + 1);
                    filter.date = { $gte: startOfDay_1, $lt: endOfDay_1 };
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter), req.query)];
            case 1:
                _b = _c.sent(), data = _b.data, error = _b.error;
                res.json({ success: true, message: 'Jobs retrieved', data: data });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _c.sent();
                console.error('Error retrieving jobs:', error_3);
                res.status(400).json({ success: false, message: 'Something went wrong' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getJobs = getJobs;
var getSingleJob = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
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
                console.error('Error retrieving job:', error_4);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleJob = getSingleJob;
var getSingleJobApplications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, jobId, job, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                customerId = req.customer.id;
                jobId = req.params.jobId;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ customer: customerId, _id: jobId }).populate('applications')];
            case 1:
                job = _a.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // If the job exists, return its applications as a response
                res.json({ success: true, message: 'Job applications retrieved', data: job.applications });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error retrieving job applications:', error_5);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleJobApplications = getSingleJobApplications;
//customer accept and pay for the work /////////////
var makeJobPayment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, applicationId, errors, customerId, customer, job, application, contractor, secret, stripeInstance, generateInvoce, invoiceId, charges, newTransaction, saveTransaction, transactionId, payload, paymentMethod, stripePayment, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                _a = req.body, jobId = _a.jobId, applicationId = _a.applicationId;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                customerId = req.customer.id;
                return [4 /*yield*/, customer_model_1.default.findOne({ _id: customerId })];
            case 1:
                customer = _b.sent();
                if (!customer) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "incorrect Customer ID" })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findOne({ _id: jobId })];
            case 2:
                job = _b.sent();
                return [4 /*yield*/, job_application_model_1.JobApplicationModel.findOne({ _id: applicationId })];
            case 3:
                application = _b.sent();
                if (!application) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Job application not found" })];
                }
                if (!job) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "job do not exist or qoutation have not be sent" })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findOne({ _id: job.contractor })];
            case 4:
                contractor = _b.sent();
                secret = process.env.STRIPE_KEY || "sk_test_51OTMkGIj2KYudFaR1rNIBOPTaBESYoJco6lTCBZw5a0inyttRJOotcds1rXpXCJDSJrpNmIt2FBAaSxdmuma3ZTF00h48RxVny";
                stripeInstance = void 0;
                if (!secret) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ message: "Sripe API Key is missing" })];
                }
                stripeInstance = new stripe_1.default(secret);
                generateInvoce = new Date().getTime().toString();
                invoiceId = generateInvoce.substring(generateInvoce.length - 5);
                return [4 /*yield*/, application.calculateCharges(applicationId)];
            case 5:
                charges = _b.sent();
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
                saveTransaction = _b.sent();
                transactionId = JSON.stringify(saveTransaction._id);
                payload = {
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: "qoutation payment from ".concat(contractor === null || contractor === void 0 ? void 0 : contractor.firstName)
                                },
                                unit_amount: parseFloat(charges.totalAmount.toFixed(2)) * 100,
                            },
                            quantity: 1,
                        },
                    ],
                    metadata: {
                        customerId: customerId,
                        type: "payment",
                        jobId: jobId,
                        transactionId: transactionId
                    },
                    email: customer.email,
                    customerId: customer.stripeCustomer.id
                };
                paymentMethod = customer.stripePaymentMethods.find(function (method) { return method.type === "card"; });
                if (!paymentMethod)
                    throw new Error("No valid card available for this user");
                return [4 /*yield*/, stripe_2.StripeService.payment.chargeCustomer(customer.stripeCustomer.id, 'pm_1P00BvDdPEZ0JirQhBqMa6yn', payload)];
            case 7:
                stripePayment = _b.sent();
                job.status = job_model_1.JobStatus.BOOKED;
                return [4 /*yield*/, job.save()];
            case 8:
                _b.sent();
                res.json({ success: true, message: 'Payment intent created', data: stripePayment });
                return [3 /*break*/, 10];
            case 9:
                err_1 = _b.sent();
                // signup error
                res.status(500).json({ message: err_1.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.makeJobPayment = makeJobPayment;
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
    getJobs: exports.getJobs,
    createJobListing: exports.createJobListing,
    getSingleJob: exports.getSingleJob,
    getSingleJobApplications: exports.getSingleJobApplications
};
