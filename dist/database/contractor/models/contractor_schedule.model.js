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
exports.ContractorScheduleModel = void 0;
var mongoose_1 = require("mongoose");
// Mongoose schema for the Recurrence
var RecurrenceSchema = new mongoose_1.Schema({
    frequency: {
        type: String,
    },
    interval: {
        type: Number,
    },
});
// Mongoose schema for the Event
var EventSchema = new mongoose_1.Schema({
    type: {
        type: String,
    },
    booking: {
        type: Number,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    note: {
        type: String,
    },
    title: {
        type: String,
    },
    reminder: {
        type: String
    },
});
// Mongoose schema for the ContractorSchedule
var ContractorScheduleSchema = new mongoose_1.Schema({
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    type: {
        type: String,
    },
    recurrence: RecurrenceSchema,
    events: [EventSchema],
    originalSchedule: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractor_schedules',
    },
});
ContractorScheduleSchema.statics.handleRecurringEvents = function (scheduleId) {
    return __awaiter(this, void 0, void 0, function () {
        var originalSchedule, frequency, i, newDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.findById({ _id: scheduleId })];
                case 1:
                    originalSchedule = _a.sent();
                    if (!originalSchedule) {
                        console.log('Original schedule not found', scheduleId);
                        return [2 /*return*/, []];
                    }
                    frequency = originalSchedule.recurrence.frequency;
                    i = 1;
                    _a.label = 2;
                case 2:
                    if (!(i <= 400)) return [3 /*break*/, 5];
                    newDate = new Date(originalSchedule.date);
                    // Adjust the date based on the recurrence frequency
                    switch (frequency) {
                        case 'Daily':
                            newDate.setDate(newDate.getDate() + i);
                            break;
                        case 'Weekly':
                            newDate.setDate(newDate.getDate() + i * 7);
                            break;
                        case 'Monthly':
                            newDate.setMonth(newDate.getMonth() + i);
                            break;
                        // Add more cases for other recurrence frequencies as needed
                    }
                    if (!(newDate.getFullYear() == originalSchedule.date.getFullYear())) return [3 /*break*/, 4];
                    return [4 /*yield*/, this.findOneAndUpdate({ contractor: originalSchedule.contractor, date: newDate }, {
                            contractor: originalSchedule.contractor,
                            date: newDate,
                            type: originalSchedule.type,
                            originalSchedule: scheduleId, // Set reference to the original schedule
                        }, { upsert: true, new: true, setDefaultsOnInsert: true })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
};
// Post hook for save method
ContractorScheduleSchema.post('save', function (doc) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!doc.recurrence) return [3 /*break*/, 2];
                    // @ts-ignore
                    return [4 /*yield*/, doc.constructor.handleRecurringEvents(doc._id)];
                case 1:
                    // @ts-ignore
                    _a.sent();
                    _a.label = 2;
                case 2: 
                // doc.
                // @ts-ignore
                // console.log(doc.constructor.activeCampaignsToRedis)
                return [2 /*return*/];
            }
        });
    });
});
exports.ContractorScheduleModel = (0, mongoose_1.model)('contractor_schedules', ContractorScheduleSchema);
// Helper function to generate the expanded schedule based on availability days
var generateExpandedSchedule = function (startDate, availabilityDays) {
    var expandedSchedule = [];
    var year = startDate.getFullYear();
    // Iterate over each weekday in the availability days array
    for (var _i = 0, availabilityDays_1 = availabilityDays; _i < availabilityDays_1.length; _i++) {
        var day = availabilityDays_1[_i];
        var currentDate = new Date(startDate); // Start from the provided date
        // Find all occurrences of the current weekday in the year
        while (currentDate.getFullYear() === year) {
            if (currentDate.toLocaleString('en-us', { weekday: 'long' }) === day) {
                expandedSchedule.push(new Date(currentDate)); // Add the date to the expanded schedule
            }
            // Move to the next week
            currentDate.setDate(currentDate.getDate() + 7);
        }
    }
    return expandedSchedule;
};
// Method to expand weekly availability for a whole year based on an array of week days
ContractorScheduleSchema.statics.expandWeeklyAvailability = function (startDate, availabilityDays) {
    return __awaiter(this, void 0, void 0, function () {
        var expandedSchedule, existingSchedules, updatedSchedule;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expandedSchedule = generateExpandedSchedule(startDate, availabilityDays);
                    return [4 /*yield*/, this.find({
                            date: { $gte: startDate },
                            recurrence: { frequency: 'Weekly' }, // Assuming only weekly schedules are relevant
                        })];
                case 1:
                    existingSchedules = _a.sent();
                    updatedSchedule = expandedSchedule.filter(function (date) {
                        return !existingSchedules.some(function (schedule) {
                            return schedule.date.toDateString() === date.toDateString();
                        });
                    });
                    return [2 /*return*/, updatedSchedule];
            }
        });
    });
};
// Method to check if a given date falls within the expanded schedule
ContractorScheduleSchema.statics.isDateInExpandedSchedule = function (dateToCheck, expandedSchedule) {
    // Check if the date falls within the expanded schedule
    return expandedSchedule.some(function (date) { return dateToCheck.toDateString() === date.toDateString(); });
};
