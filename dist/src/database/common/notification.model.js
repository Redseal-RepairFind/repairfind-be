"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var NotificationSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'userType',
        default: null,
    },
    userType: {
        type: String,
        enum: ['contractors', 'customers'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    entity: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'entityType',
        default: null,
    },
    entityType: {
        type: String
    },
    heading: Object,
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
var NotificationModel = (0, mongoose_1.model)("notifications", NotificationSchema);
exports.default = NotificationModel;
