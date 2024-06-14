"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var PayoutSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    accountName: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
    recieverId: {
        type: String,
        required: true,
    },
    jobId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed"]
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
var PayoutModel = (0, mongoose_1.model)("Payout", PayoutSchema);
exports.default = PayoutModel;
