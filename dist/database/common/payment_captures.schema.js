"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentCaptureModel = exports.PAYMENT_CAPTURE_STATUS = void 0;
var mongoose_1 = require("mongoose");
var PAYMENT_CAPTURE_STATUS;
(function (PAYMENT_CAPTURE_STATUS) {
    PAYMENT_CAPTURE_STATUS["REQUIRES_CAPTURE"] = "REQUIRES_CAPTURE";
    PAYMENT_CAPTURE_STATUS["CAPTURED"] = "CAPTURED";
    PAYMENT_CAPTURE_STATUS["CANCELLED"] = "CANCELLED";
    PAYMENT_CAPTURE_STATUS["FAILED"] = "FAILED";
})(PAYMENT_CAPTURE_STATUS || (exports.PAYMENT_CAPTURE_STATUS = PAYMENT_CAPTURE_STATUS = {}));
var PaymentCaptureSchema = new mongoose_1.Schema({
    payment: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, refPath: 'userType', required: true },
    userType: { type: String, enum: ['customers', 'contractors'], required: true },
    payment_method: { type: String, required: true },
    payment_intent: { type: String, required: true },
    amount_authorized: { type: Number, required: true },
    currency: { type: String, required: true },
    brand: { type: String },
    capture_before: { type: Number },
    country: { type: String },
    exp_month: { type: Number },
    exp_year: { type: Number },
    extended_authorization: {
        status: { type: String }
    },
    fingerprint: { type: String },
    funding: { type: String },
    incremental_authorization: {
        status: { type: String }
    },
    installments: { type: Number },
    last4: { type: String },
    mandate: { type: mongoose_1.Schema.Types.Mixed },
    multicapture: {
        status: { type: String }
    },
    network: { type: String },
    network_token: {
        used: { type: Boolean }
    },
    overcapture: {
        maximum_amount_capturable: { type: Number },
        status: { type: String }
    },
    three_d_secure: { type: String },
    wallet: { type: mongoose_1.Schema.Types.Mixed },
    status: { type: String, required: true },
    captured: { type: Boolean, required: true },
    canceled_at: { type: String },
    captured_at: { type: String },
    cancellation_reason: { type: String },
    capture_method: { type: String }
}, {
    timestamps: true,
});
var PaymentCaptureModel = (0, mongoose_1.model)('payment_captures', PaymentCaptureSchema);
exports.PaymentCaptureModel = PaymentCaptureModel;
