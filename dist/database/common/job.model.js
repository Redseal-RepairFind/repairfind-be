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
    JobStatus["ONGOING"] = "ONGOING";
    JobStatus["COMPLETED"] = "COMPLETED";
    JobStatus["DISPUTED"] = "DISPUTED";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var JobType;
(function (JobType) {
    JobType["LISTING"] = "LISTING";
    JobType["REQUEST"] = "REQUEST";
})(JobType || (exports.JobType = JobType = {}));
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
    applications: {
        type: [String],
        ref: 'job_applications'
    },
}, { timestamps: true });
var JobModel = (0, mongoose_1.model)("jobs", JobSchema);
exports.JobModel = JobModel;
