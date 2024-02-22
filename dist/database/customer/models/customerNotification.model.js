"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var CustomerNotificationSchema = new mongoose_1.Schema({
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'CustomerReg',
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
var CustomerNotificationModel = (0, mongoose_1.model)("CustomerNotification", CustomerNotificationSchema);
exports.default = CustomerNotificationModel;
