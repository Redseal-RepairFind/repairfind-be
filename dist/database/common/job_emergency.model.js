"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobEmergencyModel = exports.JobEmergencySchema = exports.EmergencyStatus = exports.EmergencyPriority = void 0;
var mongoose_1 = require("mongoose");
var EmergencyPriority;
(function (EmergencyPriority) {
    EmergencyPriority["LOW"] = "LOW";
    EmergencyPriority["MEDIUM"] = "MEDIUM";
    EmergencyPriority["HIGH"] = "HIGH";
})(EmergencyPriority || (exports.EmergencyPriority = EmergencyPriority = {}));
var EmergencyStatus;
(function (EmergencyStatus) {
    EmergencyStatus["PENDING"] = "PENDING";
    EmergencyStatus["RESOLVED"] = "RESOLVED";
    EmergencyStatus["IN_PROGRESS"] = "IN_PROGRESS";
})(EmergencyStatus || (exports.EmergencyStatus = EmergencyStatus = {}));
var JobEmergencySchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: Object.values(EmergencyStatus),
        required: true,
        default: EmergencyStatus.PENDING,
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
