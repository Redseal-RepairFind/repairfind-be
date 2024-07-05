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
var logger_1 = require("../../logger");
var jobDayScheduleCheck = function () { return __awaiter(void 0, void 0, void 0, function () {
    var jobs, _i, jobs_1, job, customer, contractor, currentDate, jobStartDate, timeDifference, daysDifference, hourDifference, minuteDifference, get12HourFormat, formattedJobStartDate, error_1, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 9, , 10]);
                return [4 /*yield*/, job_model_1.JobModel.find({
                        status: { $in: ['BOOKED'] },
                        'schedule.startDate': { $exists: true }
                    })];
            case 1:
                jobs = _a.sent();
                _i = 0, jobs_1 = jobs;
                _a.label = 2;
            case 2:
                if (!(_i < jobs_1.length)) return [3 /*break*/, 8];
                job = jobs_1[_i];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4 /*yield*/, customer_model_1.default.findById(job.customer)];
            case 4:
                customer = _a.sent();
                return [4 /*yield*/, contractor_model_1.ContractorModel.findById(job.contractor)];
            case 5:
                contractor = _a.sent();
                currentDate = new Date();
                jobStartDate = new Date(job.schedule.startDate);
                timeDifference = jobStartDate.getTime() - currentDate.getTime();
                daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                hourDifference = Math.ceil(timeDifference / (1000 * 60 * 60));
                minuteDifference = Math.ceil(timeDifference / (1000 * 60));
                get12HourFormat = function (jobStartDate) {
                    var hours = jobStartDate.getHours();
                    var period = hours >= 12 ? 'PM' : 'AM';
                    var formattedHours = hours % 12 || 12;
                    var minutes = String(jobStartDate.getMinutes()).padStart(2, '0');
                    return "".concat(formattedHours, ":").concat(minutes, " ").concat(period);
                };
                formattedJobStartDate = "".concat(jobStartDate.toDateString(), " at ").concat(get12HourFormat(jobStartDate));
                console.log("".concat(0, " jobStartDate you have a bla bla: ").concat(formattedJobStartDate), daysDifference, hourDifference, currentDate, jobStartDate);
                if (customer && contractor) {
                    if (daysDifference == -1) {
                        if (!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.NOT_STARTED)) {
                            sendReminderContractor(customer, contractor, job, "Your job with ".concat(customer.name, " scheduled for yesterday: ").concat(jobStartDate, " was not started"));
                            job.status = job_model_1.JOB_STATUS.NOT_STARTED;
                            job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.NOT_STARTED);
                            job.save();
                            return [3 /*break*/, 7];
                        }
                    }
                    //
                    if (hourDifference == 1) {
                        if (!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_1)) {
                            sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for today ").concat(formattedJobStartDate));
                            sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for today ").concat(formattedJobStartDate));
                            job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_1);
                            job.save();
                            return [3 /*break*/, 7];
                        }
                    }
                    if (hourDifference == 6) {
                        if (!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_6)) {
                            sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for today ").concat(formattedJobStartDate));
                            sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for today ").concat(formattedJobStartDate));
                            job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_6);
                            job.save();
                            return [3 /*break*/, 7];
                        }
                    }
                    if (hourDifference == 12) {
                        if (!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_12)) {
                            sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for today ").concat(formattedJobStartDate));
                            sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for today ").concat(formattedJobStartDate));
                            job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_12);
                            job.save();
                            return [3 /*break*/, 7];
                        }
                    }
                    if (hourDifference == 24) {
                        if (!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_24)) {
                            sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for tomorrow ").concat(jobStartDate.toDateString()));
                            sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for tomorrow ").concat(jobStartDate.toDateString()));
                            job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_24);
                            job.save();
                            return [3 /*break*/, 7];
                        }
                    }
                    if (daysDifference == 48) {
                        if (!job.reminders.includes(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_48)) {
                            sendReminderContractor(customer, contractor, job, "You have a job with ".concat(customer.name, " scheduled for ").concat(jobStartDate.toDateString()));
                            sendReminderCustomer(customer, contractor, job, "You have a job with ".concat(contractor.name, " scheduled for  ").concat(formattedJobStartDate));
                            job.reminders.push(job_model_1.JOB_SCHEDULE_REMINDER.HOURS_48);
                            job.save();
                            return [3 /*break*/, 7];
                        }
                    }
                }
                logger_1.Logger.info("Processed  job day reminder: hourDifference: ".concat(daysDifference, " - JobId: ").concat(job.id));
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                logger_1.Logger.error("Error sending job day reminder: ".concat(job.id), error_1);
                return [3 /*break*/, 7];
            case 7:
                _i++;
                return [3 /*break*/, 2];
            case 8: return [3 /*break*/, 10];
            case 9:
                error_2 = _a.sent();
                logger_1.Logger.error('Error sending job day reminder:', error_2);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.jobDayScheduleCheck = jobDayScheduleCheck;
function sendReminderContractor(customer, contractor, job, message) {
    var _a;
    __1.NotificationService.sendNotification({
        user: contractor.id,
        userType: 'contractors',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER', //
        message: message,
        heading: { name: "".concat(customer.name), image: (_a = customer.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true });
}
function sendReminderCustomer(customer, contractor, job, message) {
    var _a;
    // reminder to customer
    __1.NotificationService.sendNotification({
        user: customer.id,
        userType: 'customers',
        title: 'Job Schedule Reminder',
        type: 'JOB_DAY_REMINDER', //
        message: message,
        heading: { name: "".concat(contractor.name), image: (_a = contractor.profilePhoto) === null || _a === void 0 ? void 0 : _a.url },
        payload: {
            entity: job.id,
            entityType: 'jobs',
            message: message,
            contractor: contractor.id,
            event: 'JOB_DAY_REMINDER',
        }
    }, { push: true, socket: true });
}
