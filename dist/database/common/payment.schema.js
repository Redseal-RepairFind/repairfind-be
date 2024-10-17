"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = exports.PaypalCaptureSchema = exports.PAYMENT_TYPE = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var PAYMENT_TYPE;
(function (PAYMENT_TYPE) {
    PAYMENT_TYPE["JOB_DAY_PAYMENT"] = "JOB_DAY_PAYMENT";
    PAYMENT_TYPE["SITE_VISIT_PAYMENT"] = "SITE_VISIT_PAYMENT";
    PAYMENT_TYPE["CHANGE_ORDER_PAYMENT"] = "CHANGE_ORDER_PAYMENT";
})(PAYMENT_TYPE || (exports.PAYMENT_TYPE = PAYMENT_TYPE = {}));
var RefundSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    object: { type: String, required: true },
    amount: { type: Number, required: true },
    balance_transaction: { type: String, required: true },
    charge: { type: String, required: true },
    created: { type: Number, required: true },
    currency: { type: String, required: true },
    destination_details: {
        card: {
            reference: { type: String, required: true },
            reference_status: { type: String, required: true },
            reference_type: { type: String, required: true },
            type: { type: String, required: true }
        },
        type: { type: String, required: true }
    },
    metadata: { type: Map, of: mongoose_1.Schema.Types.Mixed, default: {} },
    payment_intent: { type: String, required: true },
    reason: { type: String, default: null },
    receipt_number: { type: String, default: null },
    source_transfer_reversal: { type: String, default: null },
    status: { type: String, required: true },
    transfer_reversal: { type: String, default: null }
});
var StripeCaptureShema = new mongoose_1.Schema({
    payment: { type: mongoose_1.Schema.Types.ObjectId, required: true },
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
    captured: { type: Boolean, required: true },
    canceled_at: { type: String },
    captured_at: { type: String },
    cancellation_reason: { type: String },
    capture_method: { type: String }
}, {
    timestamps: true,
});
// Create the PaypalCaptureSchema
exports.PaypalCaptureSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    status: { type: String, required: true },
    amount: {
        currency_code: { type: String, required: true },
        value: { type: String, required: true }
    },
    final_capture: { type: Boolean, required: true },
    seller_protection: {
        status: { type: String, required: true }
    },
    seller_receivable_breakdown: {
        gross_amount: {
            currency_code: { type: String, required: true },
            value: { type: String, required: true }
        },
        paypal_fee: {
            currency_code: { type: String, required: true },
            value: { type: String, required: true }
        },
        net_amount: {
            currency_code: { type: String, required: true },
            value: { type: String, required: true }
        }
    },
    create_time: { type: String, required: true },
    update_time: { type: String, required: true },
    network_transaction_reference: { type: mongoose_1.Schema.Types.Mixed },
    processor_response: { type: mongoose_1.Schema.Types.Mixed },
    links: [
        {
            href: { type: String, required: true },
            rel: { type: String, required: true },
            method: { type: String, required: true }
        }
    ]
});
var PaymentSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    amount_captured: { type: Number, required: true },
    amount_refunded: { type: Number },
    application_fee_amount: { type: Number },
    object: { type: String, required: true },
    type: { type: String, required: false, enum: Object.values(PAYMENT_TYPE) },
    transaction: { type: mongoose_1.Schema.Types.ObjectId, ref: 'transactions' },
    job: { type: mongoose_1.Schema.Types.ObjectId, ref: 'jobs' },
    user: { type: mongoose_1.Schema.Types.ObjectId, refPath: 'userType', required: true },
    userType: { type: String, required: true },
    customer: { type: String },
    currency: { type: String },
    paymentMethod: { type: String },
    paymentIntent: { type: String },
    description: { type: String },
    status: { type: String },
    remark: { type: String },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
    payment_method_details: { type: mongoose_1.Schema.Types.Mixed },
    receipt_url: { type: String },
    refunded: { type: Boolean },
    paid: { type: Boolean },
    captured: { type: Boolean },
    created: { type: String },
    destination: { type: String },
    transfer_data: { type: Object },
    transfer: { type: String },
    on_behalf_of: { type: String },
    calculated_statement_descriptor: { type: String },
    payment_intent: { type: String },
    refunds: [RefundSchema],
    stripeCapture: StripeCaptureShema,
    paypalCapture: exports.PaypalCaptureSchema,
    capture_id: { type: String },
    charge_id: { type: String },
    channel: {
        type: String,
        enum: ['stripe', 'paypal'],
    }
}, { timestamps: true });
// Create the Payment model
var PaymentModel = mongoose_1.default.model('payments', PaymentSchema);
exports.PaymentModel = PaymentModel;
