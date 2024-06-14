"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ContractorNotificationSchema = new mongoose_1.Schema({
    contractor: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'contractors',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'entityType', // Dynamically reference either Customer or Contractor model
        default: null,
    },
    entityType: {
        type: String,
        enum: ['contractors', 'customers', 'bookings', 'jobs', 'others'],
        default: 'others', // false becos we of alert kind of messages
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    readAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
var ContractorNotificationModel = (0, mongoose_1.model)("contractor_notifications", ContractorNotificationSchema);
exports.default = ContractorNotificationModel;
