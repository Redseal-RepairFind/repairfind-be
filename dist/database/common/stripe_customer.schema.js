"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeCustomerSchema = void 0;
var mongoose_1 = require("mongoose");
exports.StripeCustomerSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    object: { type: String, required: false },
    address: { type: String, default: null },
    balance: { type: Number, required: false },
    created: { type: Number, required: false },
    currency: { type: String, default: null },
    default_source: { type: String, default: null },
    delinquent: { type: Boolean, required: false },
    description: { type: String, default: null },
    discount: { type: String, default: null },
    email: { type: String, required: false },
    invoice_prefix: { type: String, required: false },
    invoice_settings: {
        custom_fields: [{ type: String }],
        default_payment_method: { type: String, default: null },
        footer: { type: String, default: null },
        rendering_options: [{ type: String }]
    },
    livemode: { type: Boolean, required: false },
    metadata: { type: Map, of: mongoose_1.Schema.Types.Mixed },
    name: { type: String, required: false },
    next_invoice_sequence: { type: Number, required: false },
    phone: { type: String, default: null },
    preferred_locales: [{ type: String }],
    shipping: { type: String, default: null },
    tax_exempt: { type: String, default: "none" },
    test_clock: { type: String, default: null }
});
