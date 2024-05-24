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
exports.ContractorBookingController = exports.markBookingComplete = exports.cancelBooking = exports.assignJob = exports.acceptOrDeclineReschedule = exports.requestBookingReschedule = exports.getSingleBooking = exports.getBookingDisputes = exports.getBookingHistory = exports.getMyBookings = void 0;
var express_validator_1 = require("express-validator");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var services_1 = require("../../../services");
var job_model_1 = require("../../../database/common/job.model");
var custom_errors_1 = require("../../../utils/custom.errors");
var api_feature_1 = require("../../../utils/api.feature");
var events_1 = require("../../../events");
var mongoose_1 = __importDefault(require("mongoose"));
var contractor_interface_1 = require("../../../database/contractor/interface/contractor.interface");
var contractor_team_model_1 = __importDefault(require("../../../database/contractor/models/contractor_team.model"));
var job_assigned_template_1 = require("../../../templates/contractorEmail/job_assigned.template");
var getMyBookings = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, _b, limit, _c, page, _d, sort, customerId, _e, status_1, startDate, endDate, date, type, contractorId_1, filter, start, end, selectedDate, startOfDay_1, endOfDay, _f, data, error, error_1;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 4, , 5]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _a = req.query, _b = _a.limit, limit = _b === void 0 ? 10 : _b, _c = _a.page, page = _c === void 0 ? 1 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, customerId = _a.customerId, _e = _a.status, status_1 = _e === void 0 ? 'BOOKED' : _e, startDate = _a.startDate, endDate = _a.endDate, date = _a.date, type = _a.type;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                contractorId_1 = req.contractor.id;
                filter = {
                    $or: [
                        { contractor: contractorId_1 },
                        { 'assignment.contractor': contractorId_1 }
                    ]
                };
                // TODO: when contractor is specified, ensure the contractor quotation is attached
                if (customerId) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid customer id' })];
                    }
                    req.query.customer = customerId;
                    delete req.query.customerId;
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
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter).populate(['customer', 'contract']), req.query)];
            case 1:
                _f = _g.sent(), data = _f.data, error = _f.error;
                if (!data) return [3 /*break*/, 3];
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!contractorId_1) return [3 /*break*/, 4];
                                    if (!job.isAssigned) return [3 /*break*/, 2];
                                    _a = job;
                                    return [4 /*yield*/, job.getMyQoutation(job.contractor)];
                                case 1:
                                    _a.myQuotation = _c.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    _b = job;
                                    return [4 /*yield*/, job.getMyQoutation(contractorId_1)];
                                case 3:
                                    _b.myQuotation = _c.sent();
                                    _c.label = 4;
                                case 4: return [2 /*return*/];
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
    var contractorId, _a, _b, page, _c, limit, _d, sort, customerId, _e, status_2, statusArray, filter, _f, data, error, error_2;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                contractorId = req.contractor.id;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 5, , 6]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, customerId = _a.customerId, _e = _a.status, status_2 = _e === void 0 ? 'COMPLETED, CANCELED, DECLINED, EXPIRED, COMPLETED, DISPUTED' : _e;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                delete req.query.status;
                statusArray = status_2.split(',').map(function (s) { return s.trim(); });
                filter = {
                    status: { $in: statusArray },
                    $or: [
                        { contractor: contractorId },
                        { 'assignment.contractor': contractorId }
                    ]
                };
                if (customerId) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid customer id' })];
                    }
                    req.query.customer = customerId;
                    delete req.query.customerId;
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter).distinct('_id').populate('customer'), req.query)];
            case 2:
                _f = _g.sent(), data = _f.data, error = _f.error;
                if (!data) return [3 /*break*/, 4];
                // Map through each job and attach myQuotation if contractor has applied 
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!job.isAssigned) return [3 /*break*/, 2];
                                    _a = job;
                                    return [4 /*yield*/, job.getMyQoutation(job.contractor)];
                                case 1:
                                    _a.myQuotation = _c.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    _b = job;
                                    return [4 /*yield*/, job.getMyQoutation(contractorId)];
                                case 3:
                                    _b.myQuotation = _c.sent();
                                    _c.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                // Map through each job and attach myQuotation if contractor has applied 
                _g.sent();
                _g.label = 4;
            case 4:
                if (error) {
                    return [2 /*return*/, next(new custom_errors_1.BadRequestError('Unkowon error occured', error))];
                }
                // Send response with job listings data
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _g.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_2))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getBookingHistory = getBookingHistory;
var getBookingDisputes = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, _a, _b, page, _c, limit, _d, sort, customerId, _e, status_3, statusArray, filter, _f, data, error, error_3;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                contractorId = req.contractor.id;
                _g.label = 1;
            case 1:
                _g.trys.push([1, 5, , 6]);
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c, _d = _a.sort, sort = _d === void 0 ? '-createdAt' : _d, customerId = _a.customerId, _e = _a.status, status_3 = _e === void 0 ? 'DISPUTED' : _e;
                req.query.page = page;
                req.query.limit = limit;
                req.query.sort = sort;
                delete req.query.status;
                statusArray = status_3.split(',').map(function (s) { return s.trim(); });
                filter = {
                    status: { $in: statusArray },
                    $or: [
                        { contractor: contractorId },
                        { 'assignment.contractor': contractorId }
                    ]
                };
                if (customerId) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(customerId)) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid customer id' })];
                    }
                    req.query.customer = customerId;
                    delete req.query.customerId;
                }
                return [4 /*yield*/, (0, api_feature_1.applyAPIFeature)(job_model_1.JobModel.find(filter).distinct('_id').populate('customer'), req.query)];
            case 2:
                _f = _g.sent(), data = _f.data, error = _f.error;
                if (!data) return [3 /*break*/, 4];
                // Map through each job and attach myQuotation if contractor has applied 
                return [4 /*yield*/, Promise.all(data.data.map(function (job) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!job.isAssigned) return [3 /*break*/, 2];
                                    _a = job;
                                    return [4 /*yield*/, job.getMyQoutation(job.contractor)];
                                case 1:
                                    _a.myQuotation = _c.sent();
                                    return [3 /*break*/, 4];
                                case 2:
                                    _b = job;
                                    return [4 /*yield*/, job.getMyQoutation(contractorId)];
                                case 3:
                                    _b.myQuotation = _c.sent();
                                    _c.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                // Map through each job and attach myQuotation if contractor has applied 
                _g.sent();
                _g.label = 4;
            case 4:
                if (error) {
                    return [2 /*return*/, next(new custom_errors_1.BadRequestError('Unkowon error occured', error))];
                }
                // Send response with job listings data
                res.status(200).json({ success: true, data: data });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _g.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_3))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getBookingDisputes = getBookingDisputes;
var getSingleBooking = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, bookingId, job, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                contractorId = req.contractor.id;
                bookingId = req.params.bookingId;
                return [4 /*yield*/, job_model_1.JobModel.findOne({
                        $or: [
                            { contractor: contractorId },
                            { 'assignment.contractor': contractorId }
                        ], _id: bookingId
                    }).populate(['contractor', 'contract', 'customer', 'assignment.contractor'])];
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
                error_4 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occured ', error_4))];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSingleBooking = getSingleBooking;
var requestBookingReschedule = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, bookingId, job, _a, date, remark, updatedSchedule, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                contractorId = req.contractor.id;
                bookingId = req.params.bookingId;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _b.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if the customer is the owner of the job
                if (job.contractor.toString() !== contractorId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to perform this action' })];
                }
                _a = req.body, date = _a.date, remark = _a.remark;
                updatedSchedule = {
                    date: date, // Assuming the rescheduled date replaces the previous one
                    awaitingConfirmation: true, // Flag for indicating rescheduling request
                    isCustomerAccept: false, // Assume the customer has has already confirmed the rescheduling
                    isContractorAccept: true, // The contractor has to confirm the rescheduling
                    createdBy: 'contractor', // Assuming customer initiates the reschedule
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
                //emit event here
                events_1.JobEvent.emit('NEW_JOB_RESHEDULE_REQUEST', { job: job });
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
    var contractorId, _a, bookingId, action, job, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                contractorId = req.contractor.id;
                _a = req.params, bookingId = _a.bookingId, action = _a.action;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _b.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if the customer is the owner of the job
                if (job.contractor.toString() !== contractorId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to perform this action' })];
                }
                // Check if the job has a rescheduling request
                if (!job.reschedule) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'No rescheduling request found for this job' })];
                }
                // Ensure that the rescheduling was initiated by the contractor
                if (job.reschedule.createdBy == 'contractor') {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to confirm this rescheduling request' })];
                }
                // Update rescheduling flags based on customer's choice
                if (action == 'accept') {
                    job.reschedule.isContractorAccept = true;
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
                res.json({ success: true, message: "Rescheduling request has been ".concat(action, "d") });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_6))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.acceptOrDeclineReschedule = acceptOrDeclineReschedule;
var assignJob = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, bookingId, employeeId, job, contractor, employee, team, assignData, html, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                contractorId = req.contractor.id;
                bookingId = req.params.bookingId;
                employeeId = req.body.employeeId;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _a.sent();
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                if (job.status !== job_model_1.JOB_STATUS.BOOKED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Only booked jobs can be assigned' })];
                }
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 2:
                contractor = _a.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(employeeId)];
            case 3:
                employee = _a.sent();
                // Check if the contractor exists
                if (!contractor || !employee) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                // Check if the customer is the owner of the job
                if (job.contractor.toString() !== contractorId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to perform this action' })];
                }
                // Check if the contractor is a company
                if (contractor.accountType !== contractor_interface_1.CONTRACTOR_TYPES.Company) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Only companies can assign jobs' })];
                }
                console.log('employeeId', employeeId);
                return [4 /*yield*/, contractor_team_model_1.default.findOne({ 'members.contractor': employeeId, contractor: contractorId })];
            case 4:
                team = _a.sent();
                if (!team) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'Contractor is not a member of your team, kindly invite' })];
                }
                assignData = {
                    contractor: employeeId,
                    date: new Date,
                    confirmed: true // true by default
                };
                job.assignment = assignData;
                job.isAssigned = true;
                job.jobHistory.push({
                    eventType: 'JOB_ASSIGNMENT',
                    timestamp: new Date(),
                    payload: { new: assignData, previous: job.assignment }
                });
                return [4 /*yield*/, job.save()];
            case 5:
                _a.sent();
                html = (0, job_assigned_template_1.NewJobAssignedEmailTemplate)(contractor, employee, job);
                services_1.EmailService.send(employee.email, "New Job Assigned", html);
                res.json({ success: true, message: "Job assigned successfully", data: job });
                return [3 /*break*/, 7];
            case 6:
                error_7 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_7))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.assignJob = assignJob;
var cancelBooking = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, bookingId, reason, job_1, contractor, contractorReview, foundIndex, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                contractorId = req.contractor.id;
                bookingId = req.params.bookingId;
                reason = req.body.reason;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job_1 = _a.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 2:
                contractor = _a.sent();
                // Check if the contractor exists
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor not found' })];
                }
                // Check if the job exists
                if (!job_1) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if the contractor is the owner of the job
                if (job_1.contractor.toString() !== contractorId) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to cancel this booking' })];
                }
                // Check if the job is already canceled
                if (job_1.status === job_model_1.JOB_STATUS.CANCELED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'The booking is already canceled' })];
                }
                // Check if the job is already completed
                if (job_1.status === job_model_1.JOB_STATUS.COMPLETED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'The booking is already marked as complete' })];
                }
                // Update the job status to canceled
                job_1.status = job_model_1.JOB_STATUS.CANCELED;
                job_1.jobHistory.push({
                    eventType: 'JOB_CANCELED',
                    timestamp: new Date(),
                    payload: { reason: reason, canceledBy: 'customer' }
                });
                // emit job cancelled event 
                // inside the event take actions such as refund etc
                events_1.JobEvent.emit('JOB_CANCELED', { job: job_1, canceledBy: 'contractor' });
                contractorReview = {
                    averageRating: 0,
                    job: job_1.id,
                    type: contractor_interface_1.CONTRACTOR_REVIEW_TYPE.JOB_CANCELETION
                };
                foundIndex = contractor.reviews.findIndex(function (review) { return review.job && review.job == job_1.id; });
                if (foundIndex !== -1) {
                    contractor.reviews[foundIndex] = contractorReview;
                }
                else {
                    contractor.reviews.push(contractorReview);
                }
                return [4 /*yield*/, job_1.save()];
            case 3:
                _a.sent();
                return [4 /*yield*/, contractor.save()];
            case 4:
                _a.sent();
                res.json({ success: true, message: 'Booking canceled successfully', data: job_1 });
                return [3 /*break*/, 6];
            case 5:
                error_8 = _a.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_8))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.cancelBooking = cancelBooking;
var markBookingComplete = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var contractorId, bookingId, reason, job, contractor, error_9;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                contractorId = req.contractor.id;
                bookingId = req.params.bookingId;
                reason = req.body.reason;
                return [4 /*yield*/, job_model_1.JobModel.findById(bookingId)];
            case 1:
                job = _b.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(contractorId)];
            case 2:
                contractor = _b.sent();
                // Check if the contractor exists
                if (!contractor) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Contractor for job not found' })];
                }
                // Check if the job exists
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ success: false, message: 'Job not found' })];
                }
                // Check if the contractor is the owner of the job
                if (!(job.contractor.toString() == contractorId || ((_a = job === null || job === void 0 ? void 0 : job.assignment) === null || _a === void 0 ? void 0 : _a.contractor.toString()) == contractorId)) {
                    return [2 /*return*/, res.status(403).json({ success: false, message: 'You are not authorized to mark  this booking as complete' })];
                }
                // Check if the job is already canceled
                if (job.status === job_model_1.JOB_STATUS.COMPLETED) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'The booking is already marked as complete' })];
                }
                job.statusUpdate = __assign(__assign({}, job.statusUpdate), { status: job_model_1.JOB_STATUS.COMPLETED, isCustomerAccept: false, isContractorAccept: true, awaitingConfirmation: true });
                job.status = job_model_1.JOB_STATUS.COMPLETED; // since its customer accepting job completion
                job.jobHistory.push({
                    eventType: 'JOB_MARKED_COMPLETE_BY_CONTRACTOR',
                    timestamp: new Date(),
                    payload: {}
                });
                events_1.JobEvent.emit('JOB_MARKED_COMPLETE_BY_CONTRACTOR', { job: job });
                return [4 /*yield*/, job.save()];
            case 3:
                _b.sent();
                res.json({ success: true, message: 'Booking marked as completed successfully', data: job });
                return [3 /*break*/, 5];
            case 4:
                error_9 = _b.sent();
                return [2 /*return*/, next(new custom_errors_1.BadRequestError('An error occurred', error_9))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.markBookingComplete = markBookingComplete;
exports.ContractorBookingController = {
    getMyBookings: exports.getMyBookings,
    getBookingHistory: exports.getBookingHistory,
    getBookingDisputes: exports.getBookingDisputes,
    getSingleBooking: exports.getSingleBooking,
    requestBookingReschedule: exports.requestBookingReschedule,
    acceptOrDeclineReschedule: exports.acceptOrDeclineReschedule,
    assignJob: exports.assignJob,
    cancelBooking: exports.cancelBooking,
    markBookingComplete: exports.markBookingComplete
};
