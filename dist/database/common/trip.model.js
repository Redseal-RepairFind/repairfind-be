"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripModel = exports.TripSchema = exports.TRIP_TYPE = exports.TRIP_STATUS = void 0;
var mongoose_1 = require("mongoose");
var TRIP_STATUS;
(function (TRIP_STATUS) {
    TRIP_STATUS["STARTED"] = "STARTED";
    TRIP_STATUS["ARRIVED"] = "ARRIVED";
    TRIP_STATUS["CANCELED"] = "CANCELED";
    TRIP_STATUS["CONFIRMED"] = "CONFIRMED";
    TRIP_STATUS["COMPLETED"] = "COMPLETED";
})(TRIP_STATUS || (exports.TRIP_STATUS = TRIP_STATUS = {}));
var TRIP_TYPE;
(function (TRIP_TYPE) {
    TRIP_TYPE["JOB_DAY"] = "JOB_DAY";
    TRIP_TYPE["SITE_VISIT"] = "SITE_VISIT";
})(TRIP_TYPE || (exports.TRIP_TYPE = TRIP_TYPE = {}));
var TripSchema = new mongoose_1.Schema({
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
        enum: Object.values(TRIP_STATUS),
        default: TRIP_STATUS.STARTED,
    },
    type: {
        type: String,
        enum: Object.values(TRIP_TYPE),
        default: TRIP_TYPE.JOB_DAY,
    },
    verificationCode: {
        type: Number,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    contractorPreTripMedia: {
        type: [String], // Array of contractor's pre-job media URLs or references
        default: [],
    },
    contractorPostTripMedia: {
        type: [String], // Array of contractor's post-job media URLs or references
        default: [],
    },
    customerPreTripMedia: {
        type: [String], // Array of customer's pre-job media URLs or references
        default: [],
    },
    customerPostTripMedia: {
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
exports.TripSchema = TripSchema;
var TripModel = (0, mongoose_1.model)("trips", TripSchema);
exports.TripModel = TripModel;
