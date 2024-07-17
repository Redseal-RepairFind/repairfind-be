"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Mongoose schema for ContractorDevice
var ContractorSavedJobSchema = new mongoose_1.Schema({
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors',
    },
    job: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'jobs',
        required: true
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});
// Create and export the ContractorDevice model
var ContractorSavedJobModel = (0, mongoose_1.model)('contractor_saved_jobs', ContractorSavedJobSchema);
exports.default = ContractorSavedJobModel;
