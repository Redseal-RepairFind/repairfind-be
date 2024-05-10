"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDayModel = exports.JobDaySchema = exports.JOB_DAY_STATUS = void 0;
var mongoose_1 = require("mongoose");
var JOB_DAY_STATUS;
(function (JOB_DAY_STATUS) {
    JOB_DAY_STATUS["STARTED"] = "STARTED";
    JOB_DAY_STATUS["ARRIVED"] = "ARRIVED";
    JOB_DAY_STATUS["CONFIRMED"] = "CONFIRMED";
    JOB_DAY_STATUS["COMPLETED"] = "COMPLETED";
})(JOB_DAY_STATUS || (exports.JOB_DAY_STATUS = JOB_DAY_STATUS = {}));
var JobDaySchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'customers',
        required: true,
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors',
        required: true,
    },
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'jobs',
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(JOB_DAY_STATUS),
        default: JOB_DAY_STATUS.STARTED,
    },
    verificationCode: {
        type: Number,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    contractorPreJobMedia: {
        type: [String], // Array of contractor's pre-job media URLs or references
        default: [],
    },
    contractorPostJobMedia: {
        type: [String], // Array of contractor's post-job media URLs or references
        default: [],
    },
    customerPreJobMedia: {
        type: [String], // Array of customer's pre-job media URLs or references
        default: [],
    },
    customerPostJobMedia: {
        type: [String], // Array of customer's post-job media URLs or references
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.JobDaySchema = JobDaySchema;
var JobDayModel = (0, mongoose_1.model)("job_day", JobDaySchema);
exports.JobDayModel = JobDayModel;
