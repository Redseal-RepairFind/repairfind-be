"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ContractorRatedJobSchema = new mongoose_1.Schema({
    jobId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Job',
        required: true,
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
var ContractorRatedJobModel = (0, mongoose_1.model)("ContractorRatedJob", ContractorRatedJobSchema);
exports.default = ContractorRatedJobModel;
