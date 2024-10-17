"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentMethodSchema = void 0;
var mongoose_1 = require("mongoose");
exports.StripePaymentMethodSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    object: { type: String, },
    customer: { type: String, },
    type: { type: String, },
    card: { type: Object },
    billing_details: { type: Object, },
    livemode: { type: Boolean }
});
