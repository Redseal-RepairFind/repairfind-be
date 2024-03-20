"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Mongoose schema for ContractorDevice
var ContractorDeviceSchema = new mongoose_1.Schema({
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors', // Reference to the contractor who owns the device
        required: true
    },
    deviceType: {
        type: String,
        required: false
    },
    deviceToken: {
        type: String,
        required: true,
        unique: false
    },
    deviceId: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});
// Create and export the ContractorDevice model
var ContractorDeviceModel = (0, mongoose_1.model)('contractor_devices', ContractorDeviceSchema);
exports.default = ContractorDeviceModel;
