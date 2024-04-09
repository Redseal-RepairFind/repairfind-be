"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeAccountSchema = void 0;
var mongoose_1 = require("mongoose");
// Define the schema for Stripe Account
exports.StripeAccountSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    business_profile: { type: mongoose_1.Schema.Types.Mixed },
    capabilities: { type: mongoose_1.Schema.Types.Mixed },
    charges_enabled: { type: Boolean },
    country: { type: String },
    default_currency: { type: String },
    details_submitted: { type: Boolean },
    requirements: { type: mongoose_1.Schema.Types.Mixed },
    payouts_enabled: { type: Boolean },
    type: { type: String },
    external_accounts: { type: mongoose_1.Schema.Types.Mixed },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
    tos_acceptance: { type: mongoose_1.Schema.Types.Mixed }, // Adjust type as needed
    future_requirements: { type: mongoose_1.Schema.Types.Mixed }, // Adjust type as needed
});
