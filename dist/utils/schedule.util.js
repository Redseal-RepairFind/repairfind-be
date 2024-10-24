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
exports.getContractorIdsWithDateInSchedule = exports.getContractorsWithDateInSchedule = exports.isDateInExpandedSchedule = exports.generateExpandedSchedule = void 0;
var contractor_profile_model_1 = require("../database/contractor/models/contractor_profile.model");
var generateExpandedSchedule = function (availabilities, year) {
    // IContractorSchedule[]
    var expandedSchedule = [];
    var currentYear = new Date().getFullYear();
    if (year) {
        currentYear = new Date("".concat(year, "-01-02")).getFullYear();
    }
    // Iterate over each weekday in the availability days array
    availabilities.forEach(function (availability) {
        var _a, _b;
        var currentDate = firstWeekdayDate(availability.day, year);
        if (!currentDate) {
            return;
        }
        // Find all occurrences of the current weekday in the year
        while (currentDate.getFullYear() === currentYear) {
            if (currentDate.toLocaleString('en-us', { weekday: 'long' }) === availability.day) {
                var startTime = (_a = availability.startTime) !== null && _a !== void 0 ? _a : "00:00:00";
                var endTime = (_b = availability.endTime) !== null && _b !== void 0 ? _b : "23:00:00";
                var times = [];
                // Expand hours from startTime to endTime with one-hour intervals
                for (var hour = parseInt(startTime.split(":")[0], 10); hour <= parseInt(endTime.split(":")[0], 10); hour++) {
                    var formattedHour = "".concat(hour.toString().padStart(2, '0'), ":00:00");
                    times.push(formattedHour);
                }
                expandedSchedule.push({
                    date: new Date(currentDate),
                    type: 'available',
                    times: times,
                });
            }
            // Move to the next week
            currentDate.setDate(currentDate.getDate() + 7);
        }
    });
    return expandedSchedule;
};
exports.generateExpandedSchedule = generateExpandedSchedule;
var isDateInExpandedSchedule = function (dateToCheck, contractorId) { return __awaiter(void 0, void 0, void 0, function () {
    var contractor, expandedSchedule, isDateInExpandedSchedule_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.findOne({ contractor: contractorId })];
            case 1:
                contractor = _a.sent();
                if (!contractor)
                    return [2 /*return*/, false
                        // Check if the date falls within the expanded schedule
                    ];
                expandedSchedule = (0, exports.generateExpandedSchedule)(contractor.availability);
                isDateInExpandedSchedule_1 = expandedSchedule.some(function (schedule) { return dateToCheck.toDateString() === schedule.date.toDateString(); });
                return [2 /*return*/, isDateInExpandedSchedule_1];
            case 2:
                error_1 = _a.sent();
                console.error('Error checking for date in schedule:', error_1);
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.isDateInExpandedSchedule = isDateInExpandedSchedule;
// Function to get all contractors with a date in their expanded schedule
var getContractorsWithDateInSchedule = function (dateToCheck) { return __awaiter(void 0, void 0, void 0, function () {
    var contractors, contractorsWithDateInSchedule, _i, contractors_1, contractor, isInSchedule, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.find({})];
            case 1:
                contractors = _a.sent();
                contractorsWithDateInSchedule = [];
                _i = 0, contractors_1 = contractors;
                _a.label = 2;
            case 2:
                if (!(_i < contractors_1.length)) return [3 /*break*/, 5];
                contractor = contractors_1[_i];
                return [4 /*yield*/, (0, exports.isDateInExpandedSchedule)(dateToCheck, contractor._id)];
            case 3:
                isInSchedule = _a.sent();
                if (isInSchedule) {
                    contractorsWithDateInSchedule.push(contractor);
                }
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, contractorsWithDateInSchedule];
            case 6:
                error_2 = _a.sent();
                console.error('Error retrieving contractors with date in schedule:', error_2);
                return [2 /*return*/, []];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getContractorsWithDateInSchedule = getContractorsWithDateInSchedule;
var getContractorIdsWithDateInSchedule = function (dateToCheck) { return __awaiter(void 0, void 0, void 0, function () {
    var profiles, contractorsWithDateInSchedule, _i, profiles_1, profile, isInSchedule, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, contractor_profile_model_1.ContractorProfileModel.find({})];
            case 1:
                profiles = _a.sent();
                contractorsWithDateInSchedule = [];
                _i = 0, profiles_1 = profiles;
                _a.label = 2;
            case 2:
                if (!(_i < profiles_1.length)) return [3 /*break*/, 5];
                profile = profiles_1[_i];
                return [4 /*yield*/, (0, exports.isDateInExpandedSchedule)(dateToCheck, profile.contractor)];
            case 3:
                isInSchedule = _a.sent();
                if (isInSchedule) {
                    contractorsWithDateInSchedule.push(profile.contractor);
                }
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, contractorsWithDateInSchedule];
            case 6:
                error_3 = _a.sent();
                console.error('Error retrieving contractors with date in schedule:', error_3);
                return [2 /*return*/, []];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getContractorIdsWithDateInSchedule = getContractorIdsWithDateInSchedule;
function firstWeekdayDate(day, year) {
    var today = new Date();
    if (year) {
        today = new Date("".concat(year, "-01-02"));
    }
    var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Get the index of the specified day
    var dayIndex = weekdayNames.indexOf(day);
    if (dayIndex === -1) {
        console.error('Invalid day specified');
        return null;
    }
    // Start from the first day of the month and iterate until we find the first occurrence of the specified weekday
    var currentDate = new Date(firstDayOfMonth);
    while (currentDate.getDay() !== dayIndex) {
        currentDate.setDate(currentDate.getDate() + 1);
    }
    // console.log(currentDate)
    return currentDate;
}
