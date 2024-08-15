"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobEmergencyModel = exports.JobEmergencySchema = exports.EMERGENCY_STATUS = exports.EmergencyPriority = void 0;
var mongoose_1 = require("mongoose");
var EmergencyPriority;
(function (EmergencyPriority) {
    EmergencyPriority["LOW"] = "LOW";
    EmergencyPriority["MEDIUM"] = "MEDIUM";
    EmergencyPriority["HIGH"] = "HIGH";
})(EmergencyPriority || (exports.EmergencyPriority = EmergencyPriority = {}));
var EMERGENCY_STATUS;
(function (EMERGENCY_STATUS) {
    EMERGENCY_STATUS["PENDING"] = "PENDING";
    EMERGENCY_STATUS["RESOLVED"] = "RESOLVED";
    EMERGENCY_STATUS["IN_PROGRESS"] = "IN_PROGRESS";
})(EMERGENCY_STATUS || (exports.EMERGENCY_STATUS = EMERGENCY_STATUS = {}));
var JobEmergencySchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'customers'
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors'
    },
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'jobs'
    },
    triggeredBy: {
        type: String,
    },
    acceptedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    resolvedWay: {
        type: String,
    },
    priority: {
        type: String,
        enum: Object.values(EmergencyPriority),
        required: true,
        default: EmergencyPriority.LOW,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(EMERGENCY_STATUS),
        required: true,
        default: EMERGENCY_STATUS.PENDING,
    },
    media: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
exports.JobEmergencySchema = JobEmergencySchema;
var JobEmergencyModel = (0, mongoose_1.model)("job_emergencies", JobEmergencySchema);
exports.JobEmergencyModel = JobEmergencyModel;
