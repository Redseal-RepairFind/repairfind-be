"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = exports.JobType = exports.JobStatus = void 0;
var mongoose_1 = require("mongoose");
var JobStatus;
(function (JobStatus) {
    JobStatus["PENDING"] = "PENDING";
    JobStatus["DECLINED"] = "DECLINED";
    JobStatus["ACCEPTED"] = "ACCEPTED";
    JobStatus["EXPIRED"] = "EXPIRED";
    JobStatus["BOOKED"] = "BOOKED";
    JobStatus["COMPLETED"] = "COMPLETED";
    JobStatus["DISPUTED"] = "DISPUTED";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var JobType;
(function (JobType) {
    JobType["LISTING"] = "LISTING";
    JobType["REQUEST"] = "REQUEST";
})(JobType || (exports.JobType = JobType = {}));
var ScheduleSchema = new mongoose_1.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isCurrent: { type: Boolean, default: true },
    isRescheduled: { type: Boolean, default: false },
    isCustomerAccept: { type: Boolean, default: false },
    isContractorAccept: { type: Boolean, default: false },
    createdBy: String
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
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.PENDING },
    type: { type: String, enum: Object.values(JobType), default: JobType.LISTING },
    category: { type: String, required: false },
    description: { type: String, required: true },
    title: { type: String },
    voiceDescription: { type: String, default: null },
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
    invoices: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'invoices', }],
    quotations: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'job_quotations'
    },
    emergency: { type: Boolean, default: false }
}, { timestamps: true });
JobSchema.virtual('totalQuotations').get(function () {
    return this.quotations.length;
});
// JobSchema.virtual('hasSentQuotation', {
//     ref: 'job_quotations',
//     foreignField: 'contractor', // Assuming this field stores the contractorId in the job_quotations model
//     localField: function() { return 'contractor' }, // Using a function to dynamically return the localField
//     justOne: true,
//     // options: { contractorId: { type: Schema.Types.ObjectId } }, // Define the contractorId option
//     match: function(options: any) {
//         console.log(options.contractorId) 
//       return { _id: { $in: this.quotations }, contractor: options.contractorId }; // Use the passed contractorId option
//     }
// });
JobSchema.virtual('myQuotation', {
    ref: 'job_quotations',
    foreignField: 'contractor', // Assuming this field stores the contractorId in the job_quotations model
    localField: 'contractor', // Using a string to specify the localField
    justOne: true,
    options: { contractorId: { type: mongoose_1.Schema.Types.ObjectId } }, // Define the contractorId option
});
JobSchema.set('toObject', { virtuals: true });
JobSchema.set('toJSON', { virtuals: true });
var JobModel = (0, mongoose_1.model)("jobs", JobSchema);
exports.JobModel = JobModel;
