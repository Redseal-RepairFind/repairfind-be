"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRequestStatus = void 0;
var mongoose_1 = require("mongoose");
var JobRequestStatus;
(function (JobRequestStatus) {
    JobRequestStatus["PENDING"] = "PENDING";
    JobRequestStatus["DECLINED"] = "DECLINED";
    JobRequestStatus["ACCEPTED"] = "ACCEPTED";
    JobRequestStatus["EXPIRED"] = "EXPIRED";
})(JobRequestStatus || (exports.JobRequestStatus = JobRequestStatus = {}));
var CustomerJobRequestSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'customers',
        required: true,
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors',
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: Object.values(JobRequestStatus),
        default: JobRequestStatus.PENDING,
    },
    description: {
        type: String,
        required: true,
    },
    voiceDescription: {
        type: Object,
        default: null
    },
    location: {
        type: Object,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: false,
    },
    expiry: {
        type: String,
        required: false,
    },
    emergency: {
        type: Boolean,
        default: false
    },
    media: {
        type: [Object],
        default: null
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
var CustomerJobRequestModel = (0, mongoose_1.model)("customer_jobrequests", CustomerJobRequestSchema);
exports.default = CustomerJobRequestModel;
