import { Schema, Document } from 'mongoose';

// Define the interface for Stripe Account
export interface IStripeAccount extends Document {
    id: string;
    business_profile?: any;
    capabilities?: any;
    charges_enabled?: boolean;
    country?: string;
    default_currency?: string;
    details_submitted?: boolean;
    requirements?: any;
    payouts_enabled: boolean;
    type?: string;
    external_accounts: any;
    metadata?: any;
    tos_acceptance?: any;
    future_requirements: any
}

// Define the schema for Stripe Account
export const StripeAccountSchema = new Schema<IStripeAccount>({
    id: { type: String, required: true },
    business_profile: { type: Schema.Types.Mixed },
    capabilities: { type: Schema.Types.Mixed },
    charges_enabled: { type: Boolean },
    country: { type: String },
    default_currency: { type: String },
    details_submitted: { type: Boolean },
    requirements: { type: Schema.Types.Mixed },
    payouts_enabled: { type: Boolean },
    type: { type: String},
    external_accounts: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
    tos_acceptance: { type: Schema.Types.Mixed }, // Adjust type as needed
    future_requirements: { type: Schema.Types.Mixed }, // Adjust type as needed
});
