"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalPaymentMethodSchema = void 0;
var mongoose_1 = require("mongoose");
// paymentMethod {
//     vault_id: '45t689864e821231d',
//     customer: 'lqilLngtad',
//     status: 'active',
//     card: { last_digits: '0011', expiry: '2027-12', brand: 'MASTERCARD' },
//     created_at: 2024-09-25T11:51:51.088Z
//   }
// Sub-schema for card details
var CardSchema = new mongoose_1.Schema({
    brand: { type: String, required: true },
    last_digits: { type: String, required: true },
    expiry: { type: String },
    country: { type: String }, // Optional country field
}, { _id: false });
// Main schema for PayPal Vault Payment Method
exports.PaypalPaymentMethodSchema = new mongoose_1.Schema({
    vault_id: { type: String, required: true }, // PayPal Vault ID
    status: { type: String, required: true }, // Vault status (e.g., "VAULTED")
    customer: { type: String, required: true }, // PayPal Customer ID
    card: { type: CardSchema, required: true }, // Card details with brand, last digits, expiry, etc.
    created_at: { type: Date, default: Date.now }, // Timestamp when the token was created
});
