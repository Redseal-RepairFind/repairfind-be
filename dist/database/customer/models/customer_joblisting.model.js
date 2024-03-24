"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRequestStatus = void 0;
var mongoose_1 = require("mongoose");
var constants_1 = require("../../../constants");
var JobRequestStatus;
(function (JobRequestStatus) {
    JobRequestStatus["PENDING"] = "PENDING";
    JobRequestStatus["DECLINED"] = "DECLINED";
    JobRequestStatus["ACCEPTED"] = "ACCEPTED";
    JobRequestStatus["EXPIRED"] = "EXPIRED";
})(JobRequestStatus || (exports.JobRequestStatus = JobRequestStatus = {}));
var CustomerJobListingSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'customers',
        required: true,
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors',
        required: false,
    },
    contractorType: {
        type: String,
        enum: [constants_1.contractorAccountTypes.Company, constants_1.contractorAccountTypes.Employee, constants_1.contractorAccountTypes.Individual],
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
var CustomerJobListingModel = (0, mongoose_1.model)("customer_joblistings", CustomerJobListingSchema);
exports.default = CustomerJobListingModel;
