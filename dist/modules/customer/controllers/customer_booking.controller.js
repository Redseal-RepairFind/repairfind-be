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
exports.CustomerBookingController = exports.createJobEmergency = exports.createBookingDispute = exports.reviewBookingOnCompletion = exports.acceptBookingComplete = exports.requestBookingRefund = exports.cancelBooking = exports.getRefundable = exports.toggleChangeOrder = exports.acceptOrDeclineReschedule = exports.requestBookingReschedule = exports.getSingleBooking = exports.getBookingDisputes = exports.getBookingHistory = exports.getMyBookings = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_model_1 = require("../../../database/common/job.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var api_feature_1 = require("../../../utils/api.feature");
var messages_schema_1 = require("../../../database/common/messages.schema");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var events_1 = require("../../../events");
var mongoose_1 = __importDefault(require("mongoose"));
var transaction_model_1 = __importStar(require("../../../database/common/transaction.model"));
var payment_schema_1 = require("../../../database/common/payment.schema");
var job_dispute_model_1 = require("../../../database/common/job_dispute.model");
var review_model_1 = require("../../../database/common/review.model");
var customer_favorite_contractors_model_1 = __importDefault(require("../../../database/customer/models/customer_favorite_contractors.model"));
var job_emergency_model_1 = require("../../../database/common/job_emergency.model");
var conversation_util_1 = require("../../../utils/conversation.util");
var job_util_1 = require("../../../utils/job.util");
var getMyBookings = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, _b, limit, _c, page, _d, sort, contractorId_1, status_1, startDate, endDate, date, type, customerId, filter, statuses, start, end, selectedDate, startOfDay, endOfDay, _e, data, error, error_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 4, , 5]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.query, _b = _a.limit, limit = _b === void 0 ? 10 : _b, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, contractorId_1 = _a.contractorId, status_1 = _a.status, startDate = _a.startDate, endDate = _a.endDate, date = _a.date, type = _a.type;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                customerId = req.customer.id;
                filter = { customer: customerId, status: { $in: ['BOOKED', 'ONGOING', 'ONGOING_SITE_VISIT', 'COMPLETED_SITE_VISIT'] } };
                // TODO: when contractor is specified, ensure the contractor quotation is attached
                if (contractorId_1) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(contractorId_1)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid contractor id' })];
                    }
                    req.query.contractor = contractorId_1;
                    delete req.query.contractorId;
                }
                if (status_1) {
                    statuses = status_1.split(',');
                    filter.status = { $in: statuses };
                    delete req.query.status;
                }
                if (startDate) {
                    start = new Date(startDate);
                    end = new Date(startDate);
                    if (endDate)
                        end = new Date(endDate);
                    start.setHours(0, 0, 0, 0); // Set to midnight
                    end.setHours(23, 59, 59, 999); // Set to end of the day
                    filter['schedule.startDate'] = { $gte: start, $lte: end };
                    delete req.query.startDate;
                    delete req.query.endDate;
                    console.log(req.query);
                }
                if (date) {
                    selectedDate = new Date(date);
                    startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
                    endOfDay = new Date(startOfDay);
                    endOfDay.setDate(startOfDay.getUTCDate() + 1);
                    req.query.date = { $gte: startOfDay, $lt: endOfDay };
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter).populate(['contractor']), req.query)];
            case 1:
                _e = _f.sent(), data = _e.data, error = _e.error;
                if (!data) return [3 /*break*/, 3];
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
                                        myQuotation: contractorId_1
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
            case 2:
                _f.sent();
                _f.label = 3;
            case 3:
                res.json({ success: true, message: 'Bookings retrieved', data: data });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _f.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred ', error_1))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getMyBookings = getMyBookings;
var getBookingHistory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, _b, page, _c, limit, _d, sort, contractorId_2, _e, status_2, jobIds, statusArray, filter, quotations, _f, data, error, error_2;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                customerId = req.customer.id;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 7, , 8]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, contractorId_2 = _a.contractorId, _e = _a.status, status_2 = _e === void 0 ? 'COMPLETED, CANCELED, DECLINED, EXPIRED, COMPLETED, DISPUTED, NOT_STARTED' : _e;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                delete req.query.status;
                jobIds = [];
                statusArray = status_2.split(',').map(function (s) { return s.trim(); });
                filter = { status: { $in: statusArray }, customer: customerId };
                if (!contractorId_2) return [3 /*break*/, 3];
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ contractor: contractorId_2 }).select('job').lean()];
            case 2:
                quotations = _g.sent();
                // Extract job IDs from the quotations
                jobIds = quotations.map(function (quotation) { return quotation.job; });
                filter._id = { $in: jobIds };
                if (!mongoose_1.default.Types.ObjectId.isValid(contractorId_2)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid customer id' })];
                }
                req.query.contractor = contractorId_2;
                delete req.query.contractorId;
                _g.label = 3;
            case 3: return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter).distinct('_id').populate('contractor'), req.query)];
            case 4:
                _f = _g.sent(), data = _f.data, error = _f.error;
                if (!data) return [3 /*break*/, 6];
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
                                        myQuotation: contractorId_2
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
            case 5:
                // Map through each job and attach myQuotation if contractor has applied 
                _g.sent();
                _g.label = 6;
            case 6:
                if (error) {
                    console.log(error);
                    res.status(500).json({ success: false, message: error });
                }
                // Send response with job listings data
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 8];
            case 7:
                error_2 = _g.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_2))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getBookingHistory = getBookingHistory;
var getBookingDisputes = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, _b, page, _c, limit, _d, sort, contractorId, _e, status_3, jobIds, statusArray, filter, quotations, _f, data, error, error_3;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                customerId = req.customer.id;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 7, , 8]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, contractorId = _a.contractorId, _e = _a.status, status_3 = _e === void 0 ? 'DISPUTED' : _e;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                delete req.query.status;
                jobIds = [];
                statusArray = status_3.split(',').map(function (s) { return s.trim(); });
                filter = { status: { $in: statusArray }, customer: customerId };
                if (!contractorId) return [3 /*break*/, 3];
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.find({ contractor: contractorId }).select('job').lean()];
            case 2:
                quotations = _g.sent();
                // Extract job IDs from the quotations
                jobIds = quotations.map(function (quotation) { return quotation.job; });
                filter._id = { $in: jobIds };
                if (!mongoose_1.default.Types.ObjectId.isValid(contractorId)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid customer id' })];
                }
                req.query.contractor = contractorId;
                delete req.query.contractorId;
                _g.label = 3;
            case 3: return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter).distinct('_id').populate('contractor'), req.query)];
            case 4:
                _f = _g.sent(), data = _f.data, error = _f.error;
                if (!data) return [3 /*break*/, 6];
                // Map through each job and attach myQuotation if contractor has applied 
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, job_util_1.JobUtil.populate(job, {
                                        contract: true,
                                        dispute: true,
                                        jobDay: true,
                                        totalEnquires: true,
                                        hasUnrepliedEnquiry: true,
                                    })];
                                case 1:
                                    _a = _b.sent(), contract = _a.contract, totalEnquires = _a.totalEnquires, hasUnrepliedEnquiry = _a.hasUnrepliedEnquiry, jobDay = _a.jobDay, dispute = _a.dispute;
                                    job.contract = contract;
                                    job.jobDay = jobDay;
                                    job.dispute = dispute;
                                    job.totalEnquires = totalEnquires;
                                    job.hasUnrepliedEnquiry = hasUnrepliedEnquiry;
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 5:
                // Map through each job and attach myQuotation if contractor has applied 
                _g.sent();
                _g.label = 6;
            case 6:
                if (error) {
                    res.status(500).json({ success: false, message: error });
                }
                // Send response with job listings data
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 8];
            case 7:
                error_3 = _g.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_3))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getBookingDisputes = getBookingDisputes;
var getSingleBooking = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, job, _a, contract, totalEnquires, hasUnrepliedEnquiry, jobDay, dispute, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                customerId = req.customer.id;
                bookingId = req.params.bookingId;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ customer: customerId, _id: bookingId }).populate(['contractor', 'review'])];
            case 1:
                job = _b.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Booking not found' })];
                }
                return [4 /*yield*/, job_util_1.JobUtil.populate(job, {
                        contract: true,
                        dispute: true,
                        jobDay: true,
                        totalEnquires: true,
                        hasUnrepliedEnquiry: true,
                    })];
            case 2:
                _a = _b.sent(), contract = _a.contract, totalEnquires = _a.totalEnquires, hasUnrepliedEnquiry = _a.hasUnrepliedEnquiry, jobDay = _a.jobDay, dispute = _a.dispute;
                job.contract = contract;
                job.jobDay = jobDay;
                job.dispute = dispute;
                job.totalEnquires = totalEnquires;
                job.hasUnrepliedEnquiry = hasUnrepliedEnquiry;
                res.json({ success: true, message: 'Booking retrieved', data: job });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred ', error_4))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSingleBooking = getSingleBooking;
var requestBookingReschedule = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, job, _a, date, remark, updatedSchedule, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                customerId = req.customer.id;
                bookingId = req.params.bookingId;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _b.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if the customer is the owner of the job
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to perform this action' })];
                }
                _a = req.body, date = _a.date, remark = _a.remark;
                updatedSchedule = {
                    date: date, // Assuming the rescheduled date replaces the previous one
                    awaitingConfirmation: true, // Flag for indicating rescheduling request
                    isCustomerAccept: true, // Assume the customer has has already confirmed the rescheduling
                    isContractorAccept: false, // The contractor has to confirm the rescheduling
                    createdBy: 'customer', // Assuming customer initiates the reschedule
                    type: job_model_1.JOB_SCHEDULE_TYPE.JOB_DAY, // You might need to adjust this based on your business logic
                    remark: remark // Adding a remark for the rescheduling
                };
                // Save rescheduling history in job history
                job.jobHistory.push({
                    eventType: 'RESCHEDULE_REQUEST', // Custom event type identifier
                    timestamp: new Date(), // Timestamp of the event
                    payload: updatedSchedule // Additional payload specific to the event
                });
                job.reschedule = updatedSchedule;
                return [4 /*yield*/, job.save()];
            case 2:
                _b.sent();
                events_1.JobEvent.emit('NEW_JOB_RESCHEDULE_REQUEST', { job: job });
                res.json({ success: true, message: 'Job reschedule request sent' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_5))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.requestBookingReschedule = requestBookingReschedule;
var acceptOrDeclineReschedule = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, bookingId, action, job, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                customerId = req.customer.id;
                _a = req.params, bookingId = _a.bookingId, action = _a.action;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _b.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if the customer is the owner of the job
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to perform this action' })];
                }
                // Check if the job has a rescheduling request
                if (!job.reschedule) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'No rescheduling request found for this job' })];
                }
                // Ensure that the rescheduling was initiated by the contractor
                if (job.reschedule.createdBy !== 'contractor') {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to confirm this rescheduling request' })];
                }
                // Update rescheduling flags based on customer's choice
                if (action == 'accept') {
                    job.reschedule.isCustomerAccept = true;
                    if (job.reschedule.isContractorAccept && job.reschedule.isCustomerAccept) {
                        job.reschedule.awaitingConfirmation = false;
                    }
                    job.schedule = __assign(__assign({}, job.schedule), { startDate: job.reschedule.date });
                    // Change status to booked, just in case it was
                    if (job.revisitEnabled) {
                        job.status = job_model_1.JOB_STATUS.BOOKED;
                    }
                    // Save rescheduling history in job history
                    job.jobHistory.push({
                        eventType: 'JOB_RESCHEDULED', // Custom event type identifier
                        timestamp: new Date(), // Timestamp of the event
                        payload: job.reschedule // Additional payload specific to the event
                    });
                    events_1.JobEvent.emit('JOB_RESCHEDULE_DECLINED_ACCEPTED', { job: job, action: 'accepted' });
                }
                else {
                    events_1.JobEvent.emit('JOB_RESCHEDULE_DECLINED_ACCEPTED', { job: job, action: 'declined' });
                    // job.reschedule = null
                }
                return [4 /*yield*/, job.save()];
            case 2:
                _b.sent();
                res.json({ success: true, message: "Rescheduling request has been ".concat(action, "ed") });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_6))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.acceptOrDeclineReschedule = acceptOrDeclineReschedule;
var toggleChangeOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, job, customer, contract, state, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                customerId = req.customer.id;
                bookingId = req.params.bookingId;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _a.sent();
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 2:
                customer = _a.sent();
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findById(job === null || job === void 0 ? void 0 : job.contract)];
            case 3:
                contract = _a.sent();
                if (!contract) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contract not found' })];
                }
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if the contractor is the owner of the job
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' })];
                }
                if (job.status !== job_model_1.JOB_STATUS.ONGOING) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Only ongoing job can accept extra estimate ' })];
                }
                job.isChangeOrder = !job.isChangeOrder;
                return [4 /*yield*/, job.save()];
            case 4:
                _a.sent();
                state = job.isChangeOrder ? 'enabled' : 'disabled';
                //send notification
                events_1.JobEvent.emit('JOB_CHANGE_ORDER', { job: job });
                res.json({ success: true, message: "Job change order ".concat(state, " successfully"), data: job });
                return [3 /*break*/, 6];
            case 5:
                error_7 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_7))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.toggleChangeOrder = toggleChangeOrder;
var getRefundable = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, reason, job, customer, contract, startDate, jobDate, charges, paymentType, payments, currentTime, timeDifferenceInHours, refund, cancelationFee, contractorShare, companyShare, refundAmount, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                customerId = req.customer.id;
                bookingId = req.params.bookingId;
                reason = req.body.reason;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _a.sent();
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 2:
                customer = _a.sent();
                return [4 /*yield*/, job_quotation_model_1.JobQuotationModel.findById(job === null || job === void 0 ? void 0 : job.contract)];
            case 3:
                contract = _a.sent();
                // Check if the customer exists
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer not found' })];
                }
                if (!contract) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contract not found' })];
                }
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if the contractor is the owner of the job
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' })];
                }
                if (job.status == job_model_1.JOB_STATUS.CANCELED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job is already canceled' })];
                }
                if (job.status === job_model_1.JOB_STATUS.ONGOING) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job is ongoing and cannot be canceled, create a dispute instead' })];
                }
                else if (job.status !== job_model_1.JOB_STATUS.BOOKED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job is not yet booked, only booked jobs can be canceled' })];
                }
                startDate = job.schedule.startDate;
                if (!startDate) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job does not have a schedule' })];
                }
                jobDate = job.schedule.startDate.getTime();
                return [4 /*yield*/, contract.calculateCharges()
                    // choose which payment to refund ? SITE_VISIT_PAYMENT, JOB_DAY_PAYMENT, CHANGE_ORDER_PAYMENT
                ];
            case 4:
                charges = _a.sent();
                paymentType = (job.schedule.type == 'JOB_DAY') ? [payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT, payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT] : [payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT];
                return [4 /*yield*/, job.getPayments(paymentType)];
            case 5:
                payments = _a.sent();
                currentTime = new Date().getTime();
                timeDifferenceInHours = Math.abs(jobDate - currentTime) / (1000 * 60 * 60);
                refund = {
                    refundAmount: payments.totalAmount,
                    cancelationFee: 0,
                    contractorShare: 0,
                    companyShare: 0,
                    initiatedBy: 'customer',
                    policyApplied: 'free_cancelation',
                    contractTerms: charges,
                    payments: payments
                };
                // For cancellations made within 24 hours, apply cancellation fees.
                if (timeDifferenceInHours < 24) {
                    cancelationFee = 1 //50;
                    ;
                    contractorShare = 0.8 * cancelationFee;
                    companyShare = 0.2 * cancelationFee;
                    refundAmount = payments.totalAmount - cancelationFee;
                    refund = {
                        refundAmount: refundAmount,
                        cancelationFee: cancelationFee,
                        contractorShare: contractorShare,
                        companyShare: companyShare,
                        initiatedBy: 'customer',
                        policyApplied: '50_dollar_policy',
                        contractTerms: charges,
                        payments: payments
                    };
                }
                else {
                    // Free cancellation up to 48 hours before the scheduled job time.
                    // timeDifferenceInHours >= 48
                }
                return [4 /*yield*/, job.save()];
            case 6:
                _a.sent();
                res.json({ success: true, message: 'Booking cancelation initiated successfully', data: refund });
                return [3 /*break*/, 8];
            case 7:
                error_8 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_8))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.getRefundable = getRefundable;
var cancelBooking = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, reason, job, _a, customer, contractor, contract, jobDate, charges, paymentType, payments, currentTime, timeDifferenceInHours, refundPolicy, _i, _b, payment, refund, conversation, newMessage, error_9;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 12, , 13]);
                customerId = req.customer.id;
                bookingId = req.params.bookingId;
                reason = req.body.reason;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId).populate('payments')];
            case 1:
                job = _d.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                return [4 /*yield*/, Promise.all([
                        customer_model_1.default.findById(customerId),
                        contractor_model_1.ContractorModel.findById(job.contractor),
                        job_quotation_model_1.JobQuotationModel.findById(job === null || job === void 0 ? void 0 : job.contract)
                    ])];
            case 2:
                _a = _d.sent(), customer = _a[0], contractor = _a[1], contract = _a[2];
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                if (!contract) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contract not found' })];
                }
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer not found' })];
                }
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' })];
                }
                if (job.status === job_model_1.JOB_STATUS.CANCELED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'The booking is already canceled' })];
                }
                if (job.status === job_model_1.JOB_STATUS.ONGOING) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job is ongoing and cannot be canceled, create a dispute instead' })];
                }
                else if (job.status !== job_model_1.JOB_STATUS.BOOKED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Job is not yet booked, only booked jobs can be canceled' })];
                }
                if (!((_c = job === null || job === void 0 ? void 0 : job.schedule) === null || _c === void 0 ? void 0 : _c.startDate)) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Booking has no associated schedule' })];
                }
                jobDate = job.schedule.startDate.getTime();
                return [4 /*yield*/, contract.calculateCharges()
                    // choose which payment to refund ? SITE_VISIT_PAYMENT, JOB_DAY_PAYMENT, CHANGE_ORDER_PAYMENT
                ];
            case 3:
                charges = _d.sent();
                paymentType = (job.schedule.type == 'JOB_DAY') ? [payment_schema_1.PAYMENT_TYPE.JOB_DAY_PAYMENT, payment_schema_1.PAYMENT_TYPE.CHANGE_ORDER_PAYMENT] : [payment_schema_1.PAYMENT_TYPE.SITE_VISIT_PAYMENT];
                return [4 /*yield*/, job.getPayments(paymentType)];
            case 4:
                payments = _d.sent();
                currentTime = new Date().getTime();
                timeDifferenceInHours = Math.abs(jobDate - currentTime) / (1000 * 60 * 60);
                refundPolicy = { name: 'free_refund', fee: 0 };
                // For cancellations made within 24 hours, apply cancellation fees.
                if (timeDifferenceInHours < 24) {
                    refundPolicy = { name: '50_dollar_policy', fee: 50 };
                }
                else {
                    // Free cancellation up to 48 hours before the scheduled job time.
                    //  timeDifferenceInHours >= 48
                }
                _i = 0, _b = payments.payments;
                _d.label = 5;
            case 5:
                if (!(_i < _b.length)) return [3 /*break*/, 8];
                payment = _b[_i];
                if (payment.refunded)
                    return [3 /*break*/, 7];
                refund = {
                    refundAmount: payment.amount - refundPolicy.fee,
                    totalAmount: payment.amount,
                    fee: refundPolicy.fee,
                    contractorAmount: refundPolicy.fee * 0.8, // contractor takes 80% of the cautionary fee
                    companyAmount: refundPolicy.fee * 0.2, // company takes 20% of the cautionary fee
                    initiatedBy: 'customer',
                    policyApplied: refundPolicy.name,
                };
                //create refund transaction for each payment
                return [4 /*yield*/, transaction_model_1.default.create({
                        type: transaction_model_1.TRANSACTION_TYPE.REFUND,
                        amount: refund.refundAmount,
                        initiatorUser: customerId,
                        initiatorUserType: 'customers',
                        fromUser: job.contractor,
                        fromUserType: 'contractors',
                        toUser: customerId,
                        toUserType: 'customers',
                        description: "Refund from job: ".concat(job === null || job === void 0 ? void 0 : job.title, " payment"),
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING,
                        remark: 'job_refund',
                        invoice: {
                            items: [],
                            charges: refund
                        },
                        metadata: __assign(__assign({}, refund), { payment: payment.id.toString(), charge: payment.charge }),
                        job: job.id,
                        payment: payment.id,
                    })
                    // emit event here
                ];
            case 6:
                //create refund transaction for each payment
                _d.sent();
                // emit event here
                events_1.JobEvent.emit('JOB_REFUND_REQUESTED', { job: job, payment: payment, refund: refund });
                _d.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                // Update the job status to canceled
                job.status = job_model_1.JOB_STATUS.CANCELED;
                job.jobHistory.push({
                    eventType: 'JOB_CANCELED',
                    timestamp: new Date(),
                    payload: { reason: reason, canceledBy: 'customer' }
                });
                return [4 /*yield*/, job.save()];
            case 9:
                _d.sent();
                events_1.JobEvent.emit('JOB_CANCELED', { job: job, canceledBy: 'customer' });
                return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateConversation(customerId, 'customers', contractor.id, 'contractors')];
            case 10:
                conversation = _d.sent();
                return [4 /*yield*/, messages_schema_1.MessageModel.create({
                        conversation: conversation.id,
                        sender: customerId,
                        senderType: 'customers',
                        message: "Job canceled by ".concat(customer.name),
                        messageType: messages_schema_1.MessageType.ALERT,
                        createdAt: new Date(),
                        entity: job.id,
                        entityType: 'jobs'
                    })];
            case 11:
                newMessage = _d.sent();
                events_1.ConversationEvent.emit('NEW_MESSAGE', { message: newMessage });
                res.json({ success: true, message: 'Booking canceled successfully', data: { job: job, payments: payments } });
                return [3 /*break*/, 13];
            case 12:
                error_9 = _d.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_9))];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.cancelBooking = cancelBooking;
var requestBookingRefund = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, _a, reason, job, _b, customer, contractor, contract, charges, payments, refundPolicy, _i, _c, payment, refund, error_10;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 10, , 11]);
                customerId = req.customer.id;
                bookingId = req.params.bookingId;
                _a = req.body.reason, reason = _a === void 0 ? "Job not started by contractor" : _a;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId).populate('payments')];
            case 1:
                job = _d.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                return [4 /*yield*/, Promise.all([
                        customer_model_1.default.findById(customerId),
                        contractor_model_1.ContractorModel.findById(job.contractor),
                        job_quotation_model_1.JobQuotationModel.findById(job === null || job === void 0 ? void 0 : job.contract)
                    ])];
            case 2:
                _b = _d.sent(), customer = _b[0], contractor = _b[1], contract = _b[2];
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                if (!contract) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contract not found' })];
                }
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer not found' })];
                }
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' })];
                }
                if (job.status !== job_model_1.JOB_STATUS.NOT_STARTED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'You can only get a refund for a job that was not started' })];
                }
                return [4 /*yield*/, contract.calculateCharges()];
            case 3:
                charges = _d.sent();
                return [4 /*yield*/, job.getPayments()];
            case 4:
                payments = _d.sent();
                refundPolicy = { name: 'free_refund', fee: 0 };
                _i = 0, _c = payments.payments;
                _d.label = 5;
            case 5:
                if (!(_i < _c.length)) return [3 /*break*/, 8];
                payment = _c[_i];
                if (payment.refunded)
                    return [3 /*break*/, 7];
                refund = {
                    refundAmount: payment.amount - refundPolicy.fee,
                    totalAmount: payment.amount,
                    fee: refundPolicy.fee,
                    contractorAmount: 0,
                    companyAmount: 0,
                    initiatedBy: 'customer',
                    policyApplied: refundPolicy.name,
                };
                //create refund transaction - 
                return [4 /*yield*/, transaction_model_1.default.create({
                        type: transaction_model_1.TRANSACTION_TYPE.REFUND,
                        amount: refund.refundAmount,
                        initiatorUser: customerId,
                        initiatorUserType: 'customers',
                        fromUser: job.contractor,
                        fromUserType: 'contractors',
                        toUser: customerId,
                        toUserType: 'customers',
                        description: "Refund from job: ".concat(job === null || job === void 0 ? void 0 : job.title, " payment"),
                        status: transaction_model_1.TRANSACTION_STATUS.PENDING,
                        remark: 'job_refund',
                        invoice: {
                            items: [],
                            charges: refund
                        },
                        metadata: __assign(__assign({}, refund), { payment: payment.id.toString(), charge: payment.charge }),
                        job: job.id,
                        payment: payment.id
                    })];
            case 6:
                //create refund transaction - 
                _d.sent();
                _d.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 5];
            case 8:
                // Update the job status to canceled
                job.status = job_model_1.JOB_STATUS.CANCELED;
                job.jobHistory.push({
                    eventType: 'JOB_PAYMENT_REFUNDED',
                    timestamp: new Date(),
                    payload: { reason: reason, initiatedBy: 'customer' }
                });
                // emit job cancelled event 
                // inside the event take actions such as refund etc
                events_1.JobEvent.emit('JOB_PAYMENT_REFUNDED', { job: job });
                return [4 /*yield*/, job.save()];
            case 9:
                _d.sent();
                res.json({ success: true, message: 'Booking refunded successfully', data: { job: job, payments: payments } });
                return [3 /*break*/, 11];
            case 10:
                error_10 = _d.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_10))];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.requestBookingRefund = requestBookingRefund;
var acceptBookingComplete = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, reason, job, customer, jobStatus, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                customerId = req.customer.id;
                bookingId = req.params.bookingId;
                reason = req.body.reason;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _a.sent();
                return [4 /*yield*/, customer_model_1.default.findById(customerId)];
            case 2:
                customer = _a.sent();
                // Check if the contractor exists
                if (!customer) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Customer not found' })];
                }
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if the contractor is the owner of the job
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to mark  this booking as complete' })];
                }
                // Check if the job is already canceled
                // if (job.status === JOB_STATUS.COMPLETED) {
                //     return res.status(400).json({ success: false, message: 'The booking is already marked as complete' });
                // }
                if (!job.statusUpdate || !job.statusUpdate.awaitingConfirmation) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor has not requested for a status update' })];
                }
                jobStatus = (job.schedule.type == job_model_1.JOB_SCHEDULE_TYPE.SITE_VISIT) ? job_model_1.JOB_STATUS.COMPLETED_SITE_VISIT : job_model_1.JOB_STATUS.COMPLETED;
                job.statusUpdate = __assign(__assign({}, job.statusUpdate), { status: jobStatus, isCustomerAccept: true, awaitingConfirmation: false });
                job.status = jobStatus; // since its customer accepting job completion
                // add job end date here
                job.schedule.endDate = new Date();
                job.jobHistory.push({
                    eventType: 'JOB_MARKED_COMPLETE_BY_CUSTOMER',
                    timestamp: new Date(),
                    payload: {}
                });
                events_1.JobEvent.emit('JOB_COMPLETED', { job: job });
                return [4 /*yield*/, job.save()];
            case 3:
                _a.sent();
                //release payout here  ?
                res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
                return [3 /*break*/, 5];
            case 4:
                error_11 = _a.sent();
                console.log(error_11);
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_11))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.acceptBookingComplete = acceptBookingComplete;
var reviewBookingOnCompletion = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, review, ratings, favoriteContractor, bookingId, job, contractor, existingReview, totalRatings, totalReviewScore, averageRating, newReview_1, foundIndex, error_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                customerId = req.customer.id;
                _a = req.body, review = _a.review, ratings = _a.ratings, favoriteContractor = _a.favoriteContractor;
                bookingId = req.params.bookingId;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _b.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
            case 2:
                contractor = _b.sent();
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                // Check if the customer is the owner of the job
                if (job.customer.toString() !== customerId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to add a review for this job' })];
                }
                // Check if the job is already completed
                if (job.status !== job_model_1.JOB_STATUS.COMPLETED) {
                    // return res.status(400).json({ success: false, message: 'Job is not yet completed, reviews can only be added for completed jobs' });
                }
                return [4 /*yield*/, review_model_1.ReviewModel.findOne({ job: job.id, type: review_model_1.REVIEW_TYPE.JOB_COMPLETION })];
            case 3:
                existingReview = _b.sent();
                if (existingReview) {
                    // return res.status(400).json({ success: false, message: 'You can only add one review per job' });
                }
                totalRatings = ratings === null || ratings === void 0 ? void 0 : ratings.length;
                totalReviewScore = totalRatings ? ratings.reduce(function (a, b) { return a + b.rating; }, 0) : 0;
                averageRating = (totalRatings && totalReviewScore) > 0 ? totalReviewScore / totalRatings : 0;
                return [4 /*yield*/, review_model_1.ReviewModel.findOneAndUpdate({ job: job.id, type: review_model_1.REVIEW_TYPE.JOB_COMPLETION }, {
                        averageRating: averageRating,
                        ratings: ratings,
                        job: job.id,
                        customer: job.customer,
                        contractor: job.contractor,
                        comment: review,
                        type: review_model_1.REVIEW_TYPE.JOB_COMPLETION,
                        createdAt: new Date(),
                    }, { new: true, upsert: true })];
            case 4:
                newReview_1 = _b.sent();
                foundIndex = contractor.reviews.findIndex(function (review) { return review.review == newReview_1.id; });
                if (foundIndex !== -1) {
                    contractor.reviews[foundIndex] = { review: newReview_1.id, averageRating: averageRating };
                }
                else {
                    contractor.reviews.push({ review: newReview_1.id, averageRating: averageRating });
                }
                if (!favoriteContractor) return [3 /*break*/, 6];
                return [4 /*yield*/, customer_favorite_contractors_model_1.default.findOneAndUpdate({ contractor: contractor.id, customer: customerId }, {
                        customer: customerId,
                        contractor: contractor.id
                    }, { new: true, upsert: true })];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                job.review = newReview_1.id;
                return [4 /*yield*/, job.save()];
            case 7:
                _b.sent();
                return [4 /*yield*/, contractor.save()];
            case 8:
                _b.sent();
                res.json({ success: true, message: 'Review added successfully', data: newReview_1 });
                return [3 /*break*/, 10];
            case 9:
                error_12 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_12))];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.reviewBookingOnCompletion = reviewBookingOnCompletion;
var createBookingDispute = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, description, evidence, bookingId, customerId, errors, job, disputerType, disputer, dispute, disputeEvidence, previousDispute, _b, customerContractor, arbitratorContractor, arbitratorCustomer, error_13;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 8, , 9]);
                _a = req.body, description = _a.description, evidence = _a.evidence;
                bookingId = req.params.bookingId;
                customerId = req.customer.id;
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _d.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if user is customer or contractor for the job
                if (!(job.customer == customerId) && !(job.contractor == customerId)) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Unauthorized to create dispute for this job' })];
                }
                disputerType = 'customers';
                disputer = customerId;
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOneAndUpdate({
                        job: job.id
                    }, {
                        description: description,
                        job: job._id,
                        customer: job.customer,
                        contractor: job.contractor,
                        disputerType: disputerType,
                        disputer: disputer,
                        status: job_dispute_model_1.JOB_DISPUTE_STATUS.OPEN,
                    }, { new: true, upsert: true })];
            case 2:
                dispute = _d.sent();
                if (evidence) {
                    disputeEvidence = evidence.map(function (url) { return ({
                        url: url,
                        addedBy: 'customer',
                        addedAt: new Date(),
                    }); });
                    (_c = dispute.evidence).push.apply(_c, disputeEvidence);
                }
                return [4 /*yield*/, job_dispute_model_1.JobDisputeModel.findOne({ job: job.id, status: job_dispute_model_1.JOB_DISPUTE_STATUS.REVISIT })];
            case 3:
                previousDispute = _d.sent();
                if (!(job.revisitEnabled && previousDispute)) return [3 /*break*/, 5];
                dispute.status = job_dispute_model_1.JOB_DISPUTE_STATUS.ONGOING;
                dispute.arbitrator = previousDispute.arbitrator;
                dispute.status = job_dispute_model_1.JOB_DISPUTE_STATUS.ONGOING;
                return [4 /*yield*/, conversation_util_1.ConversationUtil.updateOrCreateDisputeConversations(dispute)];
            case 4:
                _b = _d.sent(), customerContractor = _b.customerContractor, arbitratorContractor = _b.arbitratorContractor, arbitratorCustomer = _b.arbitratorCustomer;
                dispute.conversations = { customerContractor: customerContractor, arbitratorContractor: arbitratorContractor, arbitratorCustomer: arbitratorCustomer };
                _d.label = 5;
            case 5: return [4 /*yield*/, dispute.save()];
            case 6:
                _d.sent();
                job.status = job_model_1.JOB_STATUS.DISPUTED;
                job.statusUpdate = {
                    isContractorAccept: true,
                    isCustomerAccept: true,
                    awaitingConfirmation: false,
                    status: 'REJECTED',
                };
                return [4 /*yield*/, job.save()];
            case 7:
                _d.sent();
                events_1.JobEvent.emit('JOB_DISPUTE_CREATED', { dispute: dispute });
                return [2 /*return*/, res.status(201).json({ success: true, message: 'Job dispute created successfully', data: dispute })];
            case 8:
                error_13 = _d.sent();
                next(new custom_errors_1.InternalServerError('Error creating job dispute:', error_13));
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createBookingDispute = createBookingDispute;
var createJobEmergency = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, description, priority, date, media, customer, triggeredBy, bookingId, job, jobEmergency, error_14;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, description = _a.description, priority = _a.priority, date = _a.date, media = _a.media;
                customer = req.customer.id;
                triggeredBy = 'customer';
                bookingId = req.params.bookingId;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Booking not found' })];
                }
                return [4 /*yield*/, job_emergency_model_1.JobEmergencyModel.create({
                        job: job.id,
                        customer: job.customer,
                        contractor: job.contractor,
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
                error_14 = _b.sent();
                next(new custom_errors_1.InternalServerError('Error creating job emergency:', error_14));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createJobEmergency = createJobEmergency;
exports.CustomerBookingController = {
    getMyBookings: exports.getMyBookings,
    getBookingHistory: exports.getBookingHistory,
    getBookingDisputes: exports.getBookingDisputes,
    getSingleBooking: exports.getSingleBooking,
    requestBookingReschedule: exports.requestBookingReschedule,
    acceptOrDeclineReschedule: exports.acceptOrDeclineReschedule,
    cancelBooking: exports.cancelBooking,
    getRefundable: exports.getRefundable,
    acceptBookingComplete: exports.acceptBookingComplete,
    reviewBookingOnCompletion: exports.reviewBookingOnCompletion,
    toggleChangeOrder: exports.toggleChangeOrder,
    createBookingDispute: exports.createBookingDispute,
    requestBookingRefund: exports.requestBookingRefund,
    createJobEmergency: exports.createJobEmergency,
};
