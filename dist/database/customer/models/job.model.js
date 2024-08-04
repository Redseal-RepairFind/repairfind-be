"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var JobSchema = new mongoose_1.Schema({
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'CustomerReg',
        required: true,
    },
    contractorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors',
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    voiceDescription: {
        type: String,
        default: ''
    },
    jobLocation: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    jobImg: {
        type: [String],
        default: []
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
var JobModel = (0, mongoose_1.model)("JobRequest", JobSchema);
exports.default = JobModel;
