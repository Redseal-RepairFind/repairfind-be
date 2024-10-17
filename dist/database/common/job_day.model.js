"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDayModel = exports.JobDayShema = exports.JOB_DAY_TYPE = exports.JOB_DAY_STATUS = void 0;
var mongoose_1 = require("mongoose");
var JOB_DAY_STATUS;
(function (JOB_DAY_STATUS) {
    JOB_DAY_STATUS["PENDING"] = "PENDING";
    JOB_DAY_STATUS["STARTED"] = "STARTED";
    JOB_DAY_STATUS["ARRIVED"] = "ARRIVED";
    JOB_DAY_STATUS["CANCELED"] = "CANCELED";
    JOB_DAY_STATUS["CONFIRMED"] = "CONFIRMED";
    JOB_DAY_STATUS["COMPLETED"] = "COMPLETED";
    JOB_DAY_STATUS["DISPUTED"] = "DISPUTED";
})(JOB_DAY_STATUS || (exports.JOB_DAY_STATUS = JOB_DAY_STATUS = {}));
var JOB_DAY_TYPE;
(function (JOB_DAY_TYPE) {
    JOB_DAY_TYPE["JOB_DAY"] = "JOB_DAY";
    JOB_DAY_TYPE["SITE_VISIT"] = "SITE_VISIT";
})(JOB_DAY_TYPE || (exports.JOB_DAY_TYPE = JOB_DAY_TYPE = {}));
var LocationSchema = new mongoose_1.Schema({
    address: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    latitude: { type: String },
    longitude: { type: String },
});
var JobDayShema = new mongoose_1.Schema({
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
    type: {
        type: String,
        enum: Object.values(JOB_DAY_TYPE),
        default: JOB_DAY_TYPE.JOB_DAY,
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
    jobLocation: LocationSchema,
    contractorLocation: LocationSchema,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isRevisit: { type: mongoose_1.Schema.Types.Boolean, default: false },
}, {
    timestamps: true,
});
exports.JobDayShema = JobDayShema;
var JobDayModel = (0, mongoose_1.model)("job_days", JobDayShema);
exports.JobDayModel = JobDayModel;
