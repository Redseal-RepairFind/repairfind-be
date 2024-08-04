"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Mongoose schema for ContractorDevice
var CustomerDeviceSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'customers', // Reference to the contractor who owns the device
        required: true
    },
    deviceType: {
        type: String,
        required: false
    },
    deviceToken: {
        type: String,
        required: false,
        unique: false
    },
    deviceId: {
        type: String,
        required: false,
        unique: false
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});
// Create and export the ContractorDevice model
var CustomerDeviceModel = (0, mongoose_1.model)('customer_devices', CustomerDeviceSchema);
exports.default = CustomerDeviceModel;
