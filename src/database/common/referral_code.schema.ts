import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// Interface for referral usage sub-document
export interface IReferralUsage extends Document {
  user: ObjectId; 
  userType: 'customers' | 'contractors'; 
  date: Date; 
  metadata?: any; // Additional data (e.g., discount, order ID, etc.)
}

// Extend the main IReferral interface
export interface IReferral extends Document {
  user: ObjectId; 
  userType: 'customers' | 'contractors'; 
  code: string; 
  usage: IReferralUsage[]; // Array of referral usages
}

// Define the Referral Usage schema
const ReferralUsageSchema: Schema<IReferralUsage> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'usage.userType', 
  },
  userType: {
    type: String,
    required: true,
    enum: ['customers', 'contractors'], // Define allowed values for the user type
  },
  date: {
    type: Date,
    default: Date.now, 
  },
  metadata: {
    type: Schema.Types.Mixed, // Flexible field to store any additional information
  },
});

// Define the main Referral schema
const ReferralSchema: Schema<IReferral> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    refPath: 'userType',
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['customers', 'contractors'], // Define allowed values for user type
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  usage: [ReferralUsageSchema] // Array of usage records
}, {
  timestamps: true
});

// Create and export the model
export const ReferralModel = mongoose.model<IReferral>('Referral', ReferralSchema);
