"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var TransactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    initiator: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        enum: ["admin", "customer", "contractor"],
        required: true,
    },
    to: {
        type: String,
        enum: ["admin", "customer", "contractor"],
        required: true,
    },
    fromId: {
        type: String,
        required: true,
    },
    toId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["pending", "successful", "failed"],
        required: true,
    },
    form: {
        type: String,
        enum: ["inspection", "qoutation", "withraw"],
    },
    invoiceId: {
        type: String,
        default: "",
    },
    jobId: {
        type: String,
        default: "",
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
var TransactionModel = (0, mongoose_1.model)("Transaction", TransactionSchema);
exports.default = TransactionModel;
