import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// Interface for referral code
export interface IReferralCode extends Document {
  user: ObjectId; 
  userType: 'customers' | 'contractors'; 
  code: string; 
}

// Define the Referral Code schema
const ReferralCodeSchema: Schema<IReferralCode> = new Schema({
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
  }
}, {
  timestamps: true
});

// Create and export the ReferralCode model
export const ReferralCodeModel = mongoose.model<IReferralCode>('referral_codes', ReferralCodeSchema);
