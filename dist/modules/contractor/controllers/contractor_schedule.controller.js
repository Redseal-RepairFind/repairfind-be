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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = exports.isDateInExpandedSchedule = exports.getEventsByMonth = exports.addOrUpdateAvailability = exports.addOrUpdateSchedule = exports.getSchedulesByDate = exports.getSchedules = exports.setAvailability = exports.createSchedule = void 0;
var contractor_schedule_model_1 = require("../../../database/contractor/models/contractor_schedule.model");
var express_validator_1 = require("express-validator");
var date_fns_1 = require("date-fns");
var contractor_profile_model_1 = require("../../../database/contractor/models/contractor_profile.model");
var schedule_util_1 = require("../../../utils/schedule.util");
var job_model_1 = require("../../../database/common/job.model");
var createSchedule = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, dates, type, recurrence, contractorId, schedules, _i, dates_1, date, existingSchedule, updatedSchedule, newScheduleData, newSchedule, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() })];
                }
                _a = req.body, dates = _a.dates, type = _a.type, recurrence = _a.recurrence;
                contractorId = req.contractor.id;
                schedules = [];
                _i = 0, dates_1 = dates;
                _b.label = 1;
            case 1:
                if (!(_i < dates_1.length)) return [3 /*break*/, 7];
                date = dates_1[_i];
                return [4 /*yield*/, contractor_schedule_model_1.ContractorScheduleModel.findOne({ contractor: contractorId, date: date })];
            case 2:
                existingSchedule = _b.sent();
                if (!existingSchedule) return [3 /*break*/, 4];
                // Update the existing schedule if it exists
                existingSchedule.recurrence = recurrence;
                existingSchedule.type = type;
                return [4 /*yield*/, existingSchedule.save()];
            case 3:
                updatedSchedule = _b.sent();
                schedules.push(updatedSchedule);
                return [3 /*break*/, 6];
            case 4:
                newScheduleData = {
                    contractor: contractorId,
                    date: date,
                    type: type,
                    recurrence: recurrence,
                };
                return [4 /*yield*/, contractor_schedule_model_1.ContractorScheduleModel.create(newScheduleData)];
            case 5:
                newSchedule = _b.sent();
                schedules.push(newSchedule);
                _b.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7:
                res.json({
                    success: true,
                    message: 'Schedules created successfully',
                    data: schedules,
                });
                return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                if (error_1.code === 11000) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'A schedule already exists for the given date' })];
                }
                console.error('Error creating/updating schedules:', error_1);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createSchedule = createSchedule;
var setAvailability = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, days, isOffDuty, contractorId, contractorProfile, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, days = _a.days, isOffDuty = _a.isOffDuty;
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
            case 1:
                contractorProfile = _b.sent();
                if (!contractorProfile) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor not found' })];
                }
                contractorProfile.availableDays = days;
                if (isOffDuty) {
                    contractorProfile.isOffDuty = isOffDuty;
                }
                return [4 /*yield*/, contractorProfile.save()];
            case 2:
                _b.sent();
                res.json({ success: true, message: 'Schedules updated successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error('Error retrieving schedules:', error_2);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.setAvailability = setAvailability;
var getSchedules = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, year, month, contractorId, startDate, endDate, schedules, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, year = _a.year, month = _a.month;
                contractorId = req.contractor.id;
                if (!year || !(0, date_fns_1.isValid)(new Date("".concat(year, "-01-01")))) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid year format' })];
                }
                startDate = void 0, endDate = void 0;
                if (month) {
                    // If month is specified, retrieve schedules for that month
                    if (!(0, date_fns_1.isValid)(new Date("".concat(year, "-").concat(month, "-01")))) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid month format' })];
                    }
                    startDate = (0, date_fns_1.startOfMonth)(new Date("".concat(year, "-").concat(month, "-01")));
                    endDate = (0, date_fns_1.endOfMonth)(new Date("".concat(year, "-").concat(month, "-01")));
                }
                else {
                    // If no month specified, retrieve schedules for the whole year
                    startDate = (0, date_fns_1.startOfYear)(new Date("".concat(year, "-01-01")));
                    endDate = (0, date_fns_1.endOfYear)(new Date("".concat(year, "-12-31")));
                }
                return [4 /*yield*/, contractor_schedule_model_1.ContractorScheduleModel.find({
                        contractor: contractorId,
                        date: { $gte: startDate, $lte: endDate },
                    })];
            case 1:
                schedules = _b.sent();
                res.json({ success: true, message: 'Schedules retrieved successfully', data: schedules });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Error retrieving schedules:', error_3);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getSchedules = getSchedules;
var getSchedulesByDate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, year, month, contractorId_1, contractorProfile, startDate_1, endDate_1, expandedSchedules, existingSchedules, mergedSchedules_1, uniqueSchedules_1, groupedSchedules, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.query, year = _a.year, month = _a.month;
                contractorId_1 = req.contractor.id;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId_1 })];
            case 1:
                contractorProfile = _b.sent();
                if (!contractorProfile) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor not found' })];
                }
                if (year && !(0, date_fns_1.isValid)(new Date("".concat(year, "-01-01")))) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid year format' })];
                }
                if (!year) {
                    year = new Date().getFullYear().toString();
                }
                if (month) {
                    // If month is specified, retrieve schedules for that month
                    if (!(0, date_fns_1.isValid)(new Date("".concat(year, "-").concat(month, "-01")))) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid month format' })];
                    }
                    startDate_1 = (0, date_fns_1.startOfMonth)(new Date("".concat(year, "-").concat(month, "-01")));
                    endDate_1 = (0, date_fns_1.endOfMonth)(new Date("".concat(year, "-").concat(month, "-01")));
                }
                else {
                    // If no month specified, retrieve schedules for the whole year
                    startDate_1 = (0, date_fns_1.startOfYear)(new Date("".concat(year, "-01-01")));
                    endDate_1 = (0, date_fns_1.endOfYear)(new Date("".concat(year, "-12-31")));
                }
                expandedSchedules = (0, schedule_util_1.generateExpandedSchedule)(contractorProfile.availableDays, year).filter(function (schedule) {
                    return schedule.date >= startDate_1 && schedule.date <= endDate_1;
                });
                return [4 /*yield*/, job_model_1.JobModel.find({
                        contractor: contractorId_1,
                        'schedule.startDate': { $gte: startDate_1, $lte: endDate_1 },
                    }).then(function (jobs) { return jobs.map(function (job) { return ({ date: job.schedule.startDate, type: job.schedule.type, contractor: job.contractor, events: [{ job: job.id }] }); }); })];
            case 2:
                existingSchedules = _b.sent();
                mergedSchedules_1 = __spreadArray(__spreadArray([], expandedSchedules, true), existingSchedules, true);
                uniqueSchedules_1 = [];
                mergedSchedules_1.forEach(function (schedule, index) {
                    var date = (0, date_fns_1.format)(schedule.date, 'yyyy-M-d');
                    var isFirstOccurrence = mergedSchedules_1.findIndex(function (s) { return (0, date_fns_1.format)(s.date, 'yyyy-M-d') === date; }) === index;
                    if (isFirstOccurrence || schedule.type !== 'available') {
                        // Check if the schedule is the first occurrence or its type is not 'available'
                        var indexOfExistingSchedule = uniqueSchedules_1.findIndex(function (su) { return (0, date_fns_1.format)(su.date, 'yyyy-M-d') === date && su.type === 'available'; });
                        if (indexOfExistingSchedule !== -1) {
                            uniqueSchedules_1.splice(indexOfExistingSchedule, 1); // Remove existing 'available' schedule
                        }
                        uniqueSchedules_1.push(schedule);
                    }
                });
                return [4 /*yield*/, uniqueSchedules_1.reduce(function (acc, schedule) {
                        var key = (0, date_fns_1.format)(new Date(schedule.date), 'yyyy-M');
                        if (!acc[key]) {
                            acc[key] = { schedules: [], summary: {}, events: [] };
                        }
                        schedule.contractor = contractorId_1;
                        schedule.date = (0, date_fns_1.format)(new Date(schedule.date), "yyyy-MM-dd'T'HH:mm:ss"); //'yyyy-M-d HH:mm:ss'
                        acc[key].schedules.push(schedule);
                        // Use the event type as the key for the summary object
                        if (!acc[key].summary[schedule.type]) {
                            acc[key].summary[schedule.type] = [];
                        }
                        acc[key].summary[schedule.type].push((0, date_fns_1.getDate)(new Date(schedule.date)));
                        // TODO: 
                        // Include events summary if events are defined
                        if (schedule.events) {
                            // const eventsSummary = schedule.events.map((event: any) => ({
                            //   title: event.title,
                            //   booking: event.booking,
                            //   date: event.date,
                            //   startTime: event.startTime,
                            //   endTime: event.endTime,
                            // }));
                            // const eventsSummary = await JobModel.find({ 'schedule.startDate': { $gte: startDate, $lte: endDate } })
                            //   .select('_id contract customer contractor quotations category, schedule')
                            //   .populate('contract');
                            // acc[key].events = acc[key].events.concat(eventsSummary);
                        }
                        return acc;
                    }, {})];
            case 3:
                groupedSchedules = _b.sent();
                res.json({ success: true, message: 'Schedules retrieved successfully', data: groupedSchedules });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.error('Error retrieving schedules:', error_4);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getSchedulesByDate = getSchedulesByDate;
var addOrUpdateSchedule = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, date, note, startTime_1, endTime_1, booking, title, type, contractorId, existingSchedule, events, isOverlapping, index, updatedSchedule, newScheduleData, newSchedule, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() })];
                }
                _a = req.body, date = _a.date, note = _a.note, startTime_1 = _a.startTime, endTime_1 = _a.endTime, booking = _a.booking, title = _a.title, type = _a.type;
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_schedule_model_1.ContractorScheduleModel.findOne({ contractor: contractorId, date: date })];
            case 1:
                existingSchedule = _b.sent();
                if (!existingSchedule) return [3 /*break*/, 3];
                events = existingSchedule.events || [];
                isOverlapping = events.some(function (event) {
                    var eventStartTime = new Date(event.startTime).getTime();
                    var eventEndTime = new Date(event.endTime).getTime();
                    var newEventStartTime = new Date(startTime_1).getTime();
                    var newEventEndTime = new Date(endTime_1).getTime();
                    return ((newEventStartTime >= eventStartTime && newEventStartTime < eventEndTime) ||
                        (newEventEndTime > eventStartTime && newEventEndTime <= eventEndTime) ||
                        (newEventStartTime <= eventStartTime && newEventEndTime >= eventEndTime));
                });
                if (isOverlapping) {
                    index = events.findIndex(function (event) {
                        var eventStartTime = new Date(event.startTime).getTime();
                        var eventEndTime = new Date(event.endTime).getTime();
                        var newEventStartTime = new Date(startTime_1).getTime();
                        var newEventEndTime = new Date(endTime_1).getTime();
                        return ((newEventStartTime >= eventStartTime && newEventStartTime < eventEndTime) ||
                            (newEventEndTime > eventStartTime && newEventEndTime <= eventEndTime) ||
                            (newEventStartTime <= eventStartTime && newEventEndTime >= eventEndTime));
                    });
                    if (index !== -1) {
                        events[index] = __assign(__assign({}, events[index]), { startTime: startTime_1, endTime: endTime_1, booking: booking, type: type, note: note, title: title });
                    }
                }
                else {
                    // Add the new event to the events array
                    events.push({
                        startTime: startTime_1,
                        endTime: endTime_1,
                        booking: booking,
                        note: note,
                        type: type,
                        title: title,
                    });
                }
                existingSchedule.events = events;
                return [4 /*yield*/, existingSchedule.save()];
            case 2:
                updatedSchedule = _b.sent();
                res.json({ success: true, message: 'Event added to the schedule successfully', data: updatedSchedule });
                return [3 /*break*/, 5];
            case 3:
                newScheduleData = {
                    contractor: contractorId,
                    date: date,
                    type: 'default', // Set a default type if needed
                    recurrence: { frequency: 'Once' }, // Set default recurrence if needed
                    events: [{
                            date: date,
                            startTime: startTime_1,
                            endTime: endTime_1,
                            booking: booking,
                            note: note,
                            title: title
                        }],
                };
                return [4 /*yield*/, contractor_schedule_model_1.ContractorScheduleModel.create(newScheduleData)];
            case 4:
                newSchedule = _b.sent();
                res.json({ success: true, message: 'Schedule created with the event successfully', data: newSchedule });
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_5 = _b.sent();
                console.error('Error adding or updating schedule:', error_5);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.addOrUpdateSchedule = addOrUpdateSchedule;
var addOrUpdateAvailability = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var days, contractorId, contractorProfile, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                days = req.body.days;
                contractorId = req.contractor.id;
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findById({ contractor: contractorId })];
            case 1:
                contractorProfile = _a.sent();
                if (!contractorProfile) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Contractor profile not found' })];
                }
                contractorProfile.availableDays = days;
                contractorProfile.save();
                res.json({ success: true, message: 'Availability Schedule updated  successfully', data: contractorProfile });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error adding or updating schedule:', error_6);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addOrUpdateAvailability = addOrUpdateAvailability;
var getEventsByMonth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, year, month, contractorId, startDate, endDate, jobs, error_7;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.query, _b = _a.year, year = _b === void 0 ? new Date().getFullYear() : _b, month = _a.month;
                contractorId = req.contractor.id;
                if (!year || !(0, date_fns_1.isValid)(new Date("".concat(year, "-01-01")))) {
                    return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid year format' })];
                }
                startDate = void 0, endDate = void 0;
                if (month) {
                    // If month is specified, retrieve events for that month
                    if (!(0, date_fns_1.isValid)(new Date("".concat(year, "-").concat(month, "-01")))) {
                        return [2 /*return*/, res.status(400).json({ success: false, message: 'Invalid month format' })];
                    }
                    startDate = (0, date_fns_1.startOfMonth)(new Date("".concat(year, "-").concat(month, "-01")));
                    endDate = (0, date_fns_1.endOfMonth)(new Date("".concat(year, "-").concat(month, "-01")));
                }
                else {
                    // If no month specified, retrieve events for the whole year
                    startDate = (0, date_fns_1.startOfYear)(new Date("".concat(year, "-01-01")));
                    endDate = (0, date_fns_1.endOfYear)(new Date("".concat(year, "-12-31")));
                }
                return [4 /*yield*/, job_model_1.JobModel.find({ status: { $in: [job_model_1.JOB_STATUS.PENDING, job_model_1.JOB_STATUS.ONGOING, job_model_1.JOB_STATUS.BOOKED] }, contractor: contractorId, 'schedule.startDate': { $gte: startDate, $lte: endDate } })
                        .select('_id contract customer contractor  category, schedule status')
                        .populate('contract')];
            case 1:
                jobs = _c.sent();
                res.json({ success: true, message: 'Events retrieved successfully', data: jobs });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _c.sent();
                console.error('Error retrieving events:', error_7);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getEventsByMonth = getEventsByMonth;
var isDateInExpandedSchedule = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startDate, availabilityDays, contractorId, dateToCheck_1, expandedSchedule, isDateInExpandedSchedule_1;
    return __generator(this, function (_b) {
        try {
            _a = req.body, startDate = _a.startDate, availabilityDays = _a.availabilityDays;
            contractorId = req.contractor.id;
            dateToCheck_1 = new Date('2024-12-08T23:00:00.000Z');
            expandedSchedule = (0, schedule_util_1.generateExpandedSchedule)(availabilityDays);
            isDateInExpandedSchedule_1 = expandedSchedule.some(function (schedule) { return dateToCheck_1.toDateString() === schedule.date.toDateString(); });
            res.json({ success: true, message: 'Events retrieved successfully', data: isDateInExpandedSchedule_1 });
        }
        catch (error) {
            console.error('Error retrieving events:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        return [2 /*return*/];
    });
}); };
exports.isDateInExpandedSchedule = isDateInExpandedSchedule;
exports.ScheduleController = {
    createSchedule: exports.createSchedule,
    getSchedules: exports.getSchedules,
    getSchedulesByDate: exports.getSchedulesByDate,
    addOrUpdateSchedule: exports.addOrUpdateSchedule,
    getEventsByMonth: exports.getEventsByMonth,
    isDateInExpandedSchedule: exports.isDateInExpandedSchedule,
    setAvailability: exports.setAvailability
};
