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
exports.JobModel = exports.JobType = exports.JOB_SCHEDULE_TYPE = exports.JOB_STATUS = void 0;
var mongoose_1 = require("mongoose");
var job_quotation_model_1 = require("./job_quotation.model");
var JOB_STATUS;
(function (JOB_STATUS) {
    JOB_STATUS["PENDING"] = "PENDING";
    JOB_STATUS["DECLINED"] = "DECLINED";
    JOB_STATUS["ACCEPTED"] = "ACCEPTED";
    JOB_STATUS["EXPIRED"] = "EXPIRED";
    JOB_STATUS["BOOKED"] = "BOOKED";
    JOB_STATUS["COMPLETED"] = "COMPLETED";
    JOB_STATUS["DISPUTED"] = "DISPUTED";
})(JOB_STATUS || (exports.JOB_STATUS = JOB_STATUS = {}));
var JOB_SCHEDULE_TYPE;
(function (JOB_SCHEDULE_TYPE) {
    JOB_SCHEDULE_TYPE["JOB_DAY"] = "JOB_DAY";
    JOB_SCHEDULE_TYPE["SITE_VISIT"] = "SITE_VISIT";
})(JOB_SCHEDULE_TYPE || (exports.JOB_SCHEDULE_TYPE = JOB_SCHEDULE_TYPE = {}));
var JobType;
(function (JobType) {
    JobType["LISTING"] = "LISTING";
    JobType["REQUEST"] = "REQUEST";
})(JobType || (exports.JobType = JobType = {}));
var VoiceDescriptionSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
    },
    metrics: {
        type: String,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    }
});
var ScheduleSchema = new mongoose_1.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: true },
    isRescheduled: { type: Boolean, default: false },
    isCustomerAccept: { type: Boolean, default: false },
    isContractorAccept: { type: Boolean, default: false },
    createdBy: String,
    type: { type: String, enum: Object.values(JOB_SCHEDULE_TYPE) },
});
var JobLocationSchema = new mongoose_1.Schema({
    address: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    latitude: { type: String },
    longitude: { type: String },
});
var JobHistorySchema = new mongoose_1.Schema({
    eventType: { type: String, required: false }, // Identify the type of event - JOB_REJECTED, JOB_ACCEPTED, JOB_CLOSED, JOB_EXPIRED
    timestamp: { type: Date, default: Date.now }, // Timestamp of the event
    details: { type: mongoose_1.Schema.Types.Mixed }, // Additional details specific to the event
});
var JobSchema = new mongoose_1.Schema({
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'customers', required: true },
    contractor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors' },
    quotation: { type: mongoose_1.Schema.Types.ObjectId, ref: 'job_quotations' },
    contractorType: { type: String },
    status: { type: String, enum: Object.values(JOB_STATUS), default: JOB_STATUS.PENDING },
    type: { type: String, enum: Object.values(JobType), default: JobType.LISTING },
    category: { type: String, required: false },
    description: { type: String, required: true },
    title: { type: String },
    voiceDescription: VoiceDescriptionSchema,
    location: { type: JobLocationSchema, required: true },
    date: { type: Date, required: true },
    time: { type: Date, required: false },
    expiresIn: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    media: { type: [String], default: [] },
    tags: { type: [String] },
    experience: { type: String },
    jobHistory: [JobHistorySchema], // Array of job history entries
    schedules: [ScheduleSchema],
    quotations: [{
            id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'job_quotations' },
            status: { type: String, enum: Object.values(job_quotation_model_1.JOB_QUOTATION_STATUS) }
        }],
    payments: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'payments'
    },
    myQuotation: Object,
    emergency: { type: Boolean, default: false },
}, { timestamps: true });
JobSchema.virtual('totalQuotations').get(function () {
    var pendingQuotations = this.quotations.filter(function (quote) { return quote.status !== job_quotation_model_1.JOB_QUOTATION_STATUS.DECLINED; });
    return pendingQuotations.length;
});
JobSchema.methods.getMyQoutation = function (contractor) {
    return __awaiter(this, void 0, void 0, function () {
        var contractorQuotation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, job_quotation_model_1.JobQoutationModel.findOne({ job: this.id, contractor: contractor })];
                case 1:
                    contractorQuotation = _a.sent();
                    if (contractorQuotation) {
                        return [2 /*return*/, contractorQuotation];
                    }
                    else {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
JobSchema.set('toObject', { virtuals: true });
JobSchema.set('toJSON', { virtuals: true });
var JobModel = (0, mongoose_1.model)("jobs", JobSchema);
exports.JobModel = JobModel;
