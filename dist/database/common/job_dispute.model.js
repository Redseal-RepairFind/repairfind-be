"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobDisputeModel = exports.JobDisputeSchema = exports.JOB_DISPUTE_STATUS = void 0;
var mongoose_1 = require("mongoose");
var JOB_DISPUTE_STATUS;
(function (JOB_DISPUTE_STATUS) {
    JOB_DISPUTE_STATUS["OPEN"] = "OPEN";
    JOB_DISPUTE_STATUS["ONGOING"] = "ONGOING";
    JOB_DISPUTE_STATUS["RESOLVED"] = "RESOLVED";
    JOB_DISPUTE_STATUS["CLOSED"] = "CLOSED";
})(JOB_DISPUTE_STATUS || (exports.JOB_DISPUTE_STATUS = JOB_DISPUTE_STATUS = {}));
var JobDisputeSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
    },
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'jobs'
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'customers'
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'contractors'
    },
    disputer: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: "disputerType"
    },
    disputerType: { type: String, required: true },
    evidence: {
        type: [
            {
                url: { type: String, required: true },
                addedBy: { type: String, required: true },
                addedAt: { type: Date, required: true },
            },
        ],
        default: [],
    },
    status: {
        type: String,
        enum: Object.values(JOB_DISPUTE_STATUS),
        required: true,
        default: JOB_DISPUTE_STATUS.OPEN,
    },
    arbitrator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'admins'
    },
    resolvedWay: {
        type: String,
    },
    conversation: {
        type: mongoose_1.Schema.Types.ObjectId
    }
}, {
    timestamps: true,
});
exports.JobDisputeSchema = JobDisputeSchema;
var JobDisputeModel = (0, mongoose_1.model)("job_disputes", JobDisputeSchema);
exports.JobDisputeModel = JobDisputeModel;
