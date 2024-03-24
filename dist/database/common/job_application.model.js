"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobApplicationModel = exports.JobApplicationStatus = void 0;
var mongoose_1 = require("mongoose");
var JobApplicationStatus;
(function (JobApplicationStatus) {
    JobApplicationStatus["PENDING"] = "PENDING";
    JobApplicationStatus["ACCEPTED"] = "ACCEPTED";
    JobApplicationStatus["REJECTED"] = "REJECTED";
    JobApplicationStatus["COMPLETED"] = "COMPLETED";
})(JobApplicationStatus || (exports.JobApplicationStatus = JobApplicationStatus = {}));
var JobApplicationSchema = new mongoose_1.Schema({
    contractorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors', required: true },
    status: { type: String, enum: Object.values(JobApplicationStatus), required: true },
    estimate: { type: [Object], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    siteVerification: { type: Boolean },
    processingFee: { type: Number },
}, { timestamps: true });
var JobApplicationModel = (0, mongoose_1.model)('job_applications', JobApplicationSchema);
exports.JobApplicationModel = JobApplicationModel;
