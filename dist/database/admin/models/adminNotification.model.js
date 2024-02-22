"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var AdminNotificationSchema = new mongoose_1.Schema({
    title: {
        type: String,
        default: "",
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["seen", "unseen"],
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
var AdminNotificationModel = (0, mongoose_1.model)("AdminNotification", AdminNotificationSchema);
exports.default = AdminNotificationModel;
