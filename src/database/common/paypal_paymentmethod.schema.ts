import { Schema, Document } from "mongoose";

// Interface for PayPal Vault Payment Method
export interface IPaypalPaymentMethod extends Document {
  vault_id: string;
  status: string;
  customer: string;
  card: {
    brand: string;
    last_digits: string;
    expiry: {
      month: number;
      year: number;
    };
    country?: string;
  };
  created_at: Date;
}

// Sub-schema for card expiry details
const ExpirySchema = new Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
}, { _id: false });

// Sub-schema for card details
const CardSchema = new Schema({
  brand: { type: String, required: true },
  last_digits: { type: String, required: true },
  expiry: { type: ExpirySchema, required: true },
  country: { type: String }, // Optional country field
}, { _id: false });

// Main schema for PayPal Vault Payment Method
export const PaypalPaymentMethodSchema = new Schema<IPaypalPaymentMethod>({
  vault_id: { type: String, required: true }, // PayPal Vault ID
  status: { type: String, required: true }, // Vault status (e.g., "VAULTED")
  customer: { type: String, required: true }, // PayPal Customer ID
  card: { type: CardSchema, required: true }, // Card details with brand, last digits, expiry, etc.
  created_at: { type: Date, default: Date.now }, // Timestamp when the token was created
});

