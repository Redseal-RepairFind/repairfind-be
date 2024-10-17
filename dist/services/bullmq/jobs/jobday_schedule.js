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
exports.jobDayScheduleCheck = void 0;
var __1 = require("../..");
var job_model_1 = require("../../../database/common/job.model");
var contractor_model_1 = require("../../../database/contractor/models/contractor.model");
var customer_model_1 = __importDefault(require("../../../database/customer/models/customer.model"));
var i18n_1 = require("../../../i18n");
var logger_1 = require("../../logger");
var jobDayScheduleCheck = function () { return __awaiter(void 0, void 0, void 0, function () {
    var jobs, _i, jobs_1, job, customer, contractor, currentDate, jobStartDate, timeDifference, daysDifference, hourDifference, minuteDifference, formattedJobStartDate, formattedJobStartDateContractorTz, formattedJobStartDateCustomerTz, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, error_1, error_2;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                _o.trys.push([0, 29, , 30]);
                return [4 /*yield*/, job_model_1.JobModel.find({
                        status: { $in: ['BOOKED'] },
                        'schedule.startDate': { $exists: true }
                    })];
            case 1:
                jobs = _o.sent();
                _i = 0, jobs_1 = jobs;
                _o.label = 2;
            case 2:
                if (!(_i < jobs_1.length)) return [3 /*break*/, 28];
                job = jobs_1[_i];
                _o.label = 3;
            case 3:
                _o.trys.push([3, 26, , 27]);
                return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
            case 4:
                customer = _o.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
            case 5:
                contractor = _o.sent();
                currentDate = new Date();
                jobStartDate = new Date(job.schedule.startDate);
                timeDifference = jobStartDate.getTime() - currentDate.getTime();
                daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                hourDifference = Math.floor(timeDifference / (1000 * 60 * 60));
                minuteDifference = Math.floor(timeDifference / (1000 * 60));
                formattedJobStartDate = "".concat(jobStartDate.toDateString(), " at ").concat(get12HourFormat(jobStartDate));
                if (!(customer && contractor)) return [3 /*break*/, 25];
                formattedJobStartDateContractorTz = new Intl.DateTimeFormat('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: contractor === null || contractor === void 0 ? void 0 : contractor.currentTimezone,
                    timeZoneName: 'long'
                }).format(new Date(jobStartDate));
                formattedJobStartDateCustomerTz = new Intl.DateTimeFormat('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                    timeZone: customer === null || customer === void 0 ? void 0 : customer.currentTimezone,
                    timeZoneName: 'long'
                }).format(new Date(jobStartDate));
                logger_1.Logger.info("JobSchedule Reminder", {
                    formattedJobStartDateContractorTz: "".concat(formattedJobStartDateContractorTz),
                    formattedJobStartDateCustomerTz: "".concat(formattedJobStartDateCustomerTz),
                    currentDate: "".concat(currentDate, " "),
                    jobStartDate: "".concat(jobStartDate, " "),
                    formattedJobStartDate: "".concat(formattedJobStartDate, " "),
                    daysDifference: "".concat(daysDifference, " "),
                    hourDifference: "".concat(hourDifference),
                });
                if (!(hourDifference <= 1)) return [3 /*break*/, 8];
                if (!!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_1)) return [3 /*break*/, 7];
                job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_1);
                return [4 /*yield*/, Promise.all([
                        sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for today ").concat(formattedJobStartDateContractorTz)),
                        sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for today ").concat(formattedJobStartDateCustomerTz)),
                        job.save()
                    ])];
            case 6:
                _o.sent();
                _o.label = 7;
            case 7: return [3 /*break*/, 27];
            case 8:
                if (!(hourDifference <= 6)) return [3 /*break*/, 12];
                if (!!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_6)) return [3 /*break*/, 11];
                job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_6);
                _b = (_a = Promise).all;
                _c = [sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for today ").concat(formattedJobStartDateContractorTz)),
                    sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for today ").concat(formattedJobStartDateCustomerTz))];
                return [4 /*yield*/, job.save()];
            case 9: return [4 /*yield*/, _b.apply(_a, [_c.concat([
                        _o.sent()
                    ])])];
            case 10:
                _o.sent();
                _o.label = 11;
            case 11: return [3 /*break*/, 27];
            case 12:
                if (!(hourDifference <= 12)) return [3 /*break*/, 17];
                if (!!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_12)) return [3 /*break*/, 16];
                job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_12);
                return [4 /*yield*/, job.save()];
            case 13:
                _o.sent();
                _e = (_d = Promise).all;
                _f = [sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for today ").concat(formattedJobStartDateContractorTz)),
                    sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for today ").concat(formattedJobStartDateCustomerTz))];
                return [4 /*yield*/, job.save()];
            case 14: return [4 /*yield*/, _e.apply(_d, [_f.concat([
                        _o.sent()
                    ])])];
            case 15:
                _o.sent();
                _o.label = 16;
            case 16: return [3 /*break*/, 27];
            case 17:
                if (!(hourDifference <= 24)) return [3 /*break*/, 21];
                if (!!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_24)) return [3 /*break*/, 20];
                job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_24);
                _h = (_g = Promise).all;
                _j = [sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for tomorrow ").concat(formattedJobStartDateContractorTz)),
                    sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for tomorrow ").concat(formattedJobStartDateCustomerTz))];
                return [4 /*yield*/, job.save()];
            case 18: return [4 /*yield*/, _h.apply(_g, [_j.concat([
                        _o.sent()
                    ])])];
            case 19:
                _o.sent();
                _o.label = 20;
            case 20: return [3 /*break*/, 27];
            case 21:
                if (!(hourDifference <= 48)) return [3 /*break*/, 25];
                if (!!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_48)) return [3 /*break*/, 24];
                job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_48);
                _l = (_k = Promise).all;
                _m = [sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for ").concat(formattedJobStartDateContractorTz)),
                    sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for ").concat(formattedJobStartDateCustomerTz))];
                return [4 /*yield*/, job.save()];
            case 22: return [4 /*yield*/, _l.apply(_k, [_m.concat([
                        _o.sent()
                    ])])];
            case 23:
                _o.sent();
                _o.label = 24;
            case 24: return [3 /*break*/, 27];
            case 25:
                logger_1.Logger.info("Processed job day reminder: daysDifference: ".concat(daysDifference, " - JobId: ").concat(job.id));
                return [3 /*break*/, 27];
            case 26:
                error_1 = _o.sent();
                logger_1.Logger.error("Error sending job day reminder for job ID ".concat(job.id, ":"), error_1);
                return [3 /*break*/, 27];
            case 27:
                _i++;
                return [3 /*break*/, 2];
            case 28: return [3 /*break*/, 30];
            case 29:
                error_2 = _o.sent();
                logger_1.Logger.error('Error fetching jobs for day reminder:', error_2);
                return [3 /*break*/, 30];
            case 30: return [2 /*return*/];
        }
    });
}); };
exports.jobDayScheduleCheck = jobDayScheduleCheck;
function get12HourFormat(date) {
    var hours = date.getHours();
    var period = hours >= 12 ? 'PM' : 'AM';
    var formattedHours = hours % 12 || 12;
    var minutes = String(date.getMinutes()).padStart(2, '0');
    return "".concat(formattedHours, ":").concat(minutes, " ").concat(period);
}
function sendReminderContractor(customer, contractor, job, message) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var contractorLang, nTitle, nMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    contractorLang = contractor.language;
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: 'Job Schedule Reminder', targetLang: contractorLang })];
                case 1:
                    nTitle = _b.sent();
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: message, targetLang: contractorLang })];
                case 2:
                    nMessage = _b.sent();
                    __1.NotificationService.sendNotification({
                        user: contractor.id,
                        userType: 'contractors',
                        title: nTitle,
                        type: 'JOB_DAY_REMINDER',
                        message: nMessage,
                        heading: { name: "".concat(customer.name), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: nMessage,
                            contractor: contractor.id,
                            event: 'JOB_DAY_REMINDER',
                        }
                    }, { push: true, socket: true });
                    return [2 /*return*/];
            }
        });
    });
}
function sendReminderCustomer(customer, contractor, job, message) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var customerLang, nTitle, nMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    customerLang = customer.language;
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: 'Job Schedule Reminder', targetLang: customerLang })];
                case 1:
                    nTitle = _b.sent();
                    return [4 /*yield*/, i18n_1.i18n.getTranslation({ phraseOrSlug: message, targetLang: customerLang })];
                case 2:
                    nMessage = _b.sent();
                    __1.NotificationService.sendNotification({
                        user: customer.id,
                        userType: 'customers',
                        title: nTitle,
                        type: 'JOB_DAY_REMINDER',
                        message: nMessage,
                        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
                        payload: {
                            entity: job.id,
                            entityType: 'jobs',
                            message: nMessage,
                            contractor: contractor.id,
                            event: 'JOB_DAY_REMINDER',
                        }
                    }, { push: true, socket: true });
                    return [2 /*return*/];
            }
        });
    });
}
