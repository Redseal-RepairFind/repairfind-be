"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ContractorNotificationSchema = new mongoose_1.Schema({
    contractorId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'ContractorReg',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["seen", "unseen"]
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
var ContractorNotificationModel = (0, mongoose_1.model)("ContractorNotification", ContractorNotificationSchema);
exports.default = ContractorNotificationModel;
