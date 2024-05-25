"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
// Mongoose schema for ContractorDevice
var CustomerFavoriteContractorSchema = new mongoose_1.Schema({
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'customers', // Reference to the contractor who owns the device
        required: true
    },
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'contractors', // Reference to the contractor who owns the device
        required: true
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});
// Create and export the ContractorDevice model
var CustomerFavoriteContractorModel = (0, mongoose_1.model)('customer_favorite_contractors', CustomerFavoriteContractorSchema);
exports.default = CustomerFavoriteContractorModel;
