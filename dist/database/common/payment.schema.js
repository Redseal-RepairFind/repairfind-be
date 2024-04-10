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
exports.PaymentModel = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var PaymentSchema = new mongoose_1.Schema({
    reference: { type: String, required: true },
    amount: { type: Number, required: true },
    amount_captured: { type: Number, required: true },
    amount_refunded: { type: Number },
    application_fee_amount: { type: Number },
    object: { type: String, required: true },
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
    payment_intent: { type: String }
}, { timestamps: true });
// Create the Payment model
var PaymentModel = mongoose_1.default.model('payments', PaymentSchema);
exports.PaymentModel = PaymentModel;
