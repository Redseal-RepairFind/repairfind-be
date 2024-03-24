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
var JobSchema = new mongoose_1.Schema({
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'customers', required: true },
    contractor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors' },
    contractorType: { type: String },
    status: { type: String, enum: Object.values(JobStatus), default: JobStatus.PENDING },
    type: { type: String, enum: Object.values(JobType), default: JobType.LISTING },
    category: { type: String, required: false },
    description: { type: String, required: true },
    title: { type: String },
    voiceDescription: { type: Object, default: null },
    location: { type: JobLocationSchema, required: true },
    date: { type: Date, required: true },
    time: { type: Date, required: false },
    expiresIn: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    media: { type: [Object], default: [] },
    tags: { type: [String] },
    experience: { type: String },
}, { timestamps: true });
var JobModel = (0, mongoose_1.model)("jobs", JobSchema);
exports.JobModel = JobModel;
