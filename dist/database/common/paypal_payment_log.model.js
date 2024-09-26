"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalPaymentLog = void 0;
var mongoose_1 = require("mongoose");
var PaypalPaymentLogSchema = new mongoose_1.Schema({
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        required: false,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: "userType"
    },
    userType: { type: "String" },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.PaypalPaymentLog = (0, mongoose_1.model)("paypal_logs", PaypalPaymentLogSchema);
