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
exports.CustomerBookingController = exports.acceptBookingComplete = exports.cancelBooking = exports.acceptOrDeclineReschedule = exports.requestBookingReschedule = exports.getSingleBooking = exports.getBookingHistory = exports.getMyBookings = void 0;
var express_validator_1 = require("express-validator");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var job_model_1 = require("../../../database/common/job.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var api_feature_1 = require("../../../utils/api.feature");
var job_quotation_model_1 = require("../../../database/common/job_quotation.model");
var events_1 = require("../../../events");
var mongoose_1 = __importDefault(require("mongoose"));
var getMyBookings = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, _b, limit, _c, page, _d, sort, contractorId_1, _e, status_1, startDate, endDate, date, type, customerId, filter, start, end, selectedDate, startOfDay_1, endOfDay, _f, data, error, error_1;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 4, , 5]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.query, _b = _a.limit, limit = _b === void 0 ? 10 : _b, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, contractorId_1 = _a.contractorId, _e = _a.status, status_1 = _e === void 0 ? 'BOOKED' : _e, startDate = _a.startDate, endDate = _a.endDate, date = _a.date, type = _a.type;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                customerId = req.customer.id;
                filter = { customer: customerId };
                // TODO: when contractor is specified, ensure the contractor quotation is attached
                if (contractorId_1) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(contractorId_1)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid contractor id' })];
                    }
                    req.query.contractor = contractorId_1;
                    delete req.query.contractorId;
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
                    endOfDay = new Date(startOfDay_1);
                    endOfDay.setDate(startOfDay_1.getUTCDate() + 1);
                    req.query.date = { $gte: startOfDay_1, $lt: endOfDay };
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter).populate(['contractor', 'contract']), req.query)];
            case 1:
                _f = _g.sent(), data = _f.data, error = _f.error;
                if (!data) return [3 /*break*/, 3];
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
            case 2:
                _g.sent();
                _g.label = 3;
            case 3:
                res.json({ success: true, message: 'Bookings retrieved', data: data });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _g.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_1))];
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
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, contractorId_2 = _a.contractorId, _e = _a.status, status_2 = _e === void 0 ? 'COMPLETED, CANCELED, DECLINED, EXPIRED, COMPLETED, DISPUTED' : _e;
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
var getSingleBooking = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, job, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                customerId = req.customer.id;
                bookingId = req.params.bookingId;
                return [4 /*yield*/, job_model_1.JobModel.findOne({ customer: customerId, _id: bookingId, status: job_model_1.JOB_STATUS.BOOKED }).populate(['contractor', 'contract'])];
            case 1:
                job = _a.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Booking not found' })];
                }
                // If the job exists, return it as a response
                res.json({ success: true, message: 'Booking retrieved', data: job });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_3))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleBooking = getSingleBooking;
var requestBookingReschedule = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, job, _a, date, remark, updatedSchedule, error_4;
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
                events_1.JobEvent.emit('NEW_JOB_RESHEDULE_REQUEST', { job: job });
                res.json({ success: true, message: 'Job reschedule request sent' });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.InternalServerError('An error occurred', error_4))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.requestBookingReschedule = requestBookingReschedule;
var acceptOrDeclineReschedule = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, _a, bookingId, action, job, error_5;
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
                    // Save rescheduling history in job history
                    job.jobHistory.push({
                        eventType: 'JOB_RESCHEDULED', // Custom event type identifier
                        timestamp: new Date(), // Timestamp of the event
                        payload: job.reschedule // Additional payload specific to the event
                    });
                    events_1.JobEvent.emit('JOB_RESHEDULE_DECLINED_ACCEPTED', { job: job, action: 'accepted' });
                }
                else {
                    events_1.JobEvent.emit('JOB_RESHEDULE_DECLINED_ACCEPTED', { job: job, action: 'declined' });
                    job.reschedule = null;
                }
                return [4 /*yield*/, job.save()];
            case 2:
                _b.sent();
                res.json({ success: true, message: "Rescheduling request has been ".concat(action, "ed") });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_5))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.acceptOrDeclineReschedule = acceptOrDeclineReschedule;
var cancelBooking = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, reason, job, customer, error_6;
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
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' })];
                }
                // Check if the job is already canceled
                if (job.status === job_model_1.JOB_STATUS.CANCELED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'The booking is already canceled' })];
                }
                // Update the job status to canceled
                job.status = job_model_1.JOB_STATUS.CANCELED;
                job.jobHistory.push({
                    eventType: 'JOB_CANCELED',
                    timestamp: new Date(),
                    payload: { reason: reason, canceledBy: 'customer' }
                });
                // emit job cancelled event 
                // inside the event take actions such as refund etc
                events_1.JobEvent.emit('JOB_CANCELED', { job: job, canceledBy: 'customer' });
                return [4 /*yield*/, job.save()];
            case 3:
                _a.sent();
                res.json({ success: true, message: 'Booking canceled successfully', data: job });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_6))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.cancelBooking = cancelBooking;
var acceptBookingComplete = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, bookingId, reason, job, customer, error_7;
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
                if (job.status === job_model_1.JOB_STATUS.COMPLETED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'The booking is already marked as complete' })];
                }
                // Check if the job is already canceled
                if (!job.statusUpdate.awaitingConfirmation) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor has not requested for a status update' })];
                }
                if (job.statusUpdate.status !== job_model_1.JOB_STATUS.COMPLETED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor has not yet marked job as completed' })];
                }
                job.statusUpdate = __assign(__assign({}, job.statusUpdate), { status: job_model_1.JOB_STATUS.COMPLETED, isCustomerAccept: true, awaitingConfirmation: false });
                job.status = job_model_1.JOB_STATUS.COMPLETED; // since its customer accepting job completion
                job.jobHistory.push({
                    eventType: 'JOB_MARKED_COMPLETE_BY_CUSTOMER',
                    timestamp: new Date(),
                    payload: {}
                });
                events_1.JobEvent.emit('JOB_MARKED_COMPLETE_BY_CUSTOMER', { job: job });
                return [4 /*yield*/, job.save()];
            case 3:
                _a.sent();
                res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_7))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.acceptBookingComplete = acceptBookingComplete;
exports.CustomerBookingController = {
    getMyBookings: exports.getMyBookings,
    getBookingHistory: exports.getBookingHistory,
    getSingleBooking: exports.getSingleBooking,
    requestBookingReschedule: exports.requestBookingReschedule,
    acceptOrDeclineReschedule: exports.acceptOrDeclineReschedule,
    cancelBooking: exports.cancelBooking,
    acceptBookingComplete: exports.acceptBookingComplete
};
