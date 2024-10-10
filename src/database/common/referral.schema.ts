import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IReferral extends Document {
  user: ObjectId; 
  userType: 'customers' | 'contractors'; 
  referrer: ObjectId; 
  referrerType: 'customers' | 'contractors'; 
  date: Date; 
  coupon?: ObjectId;
  referralCode: string; 
  metadata?: any; // Additional data (e.g., discount, order ID, etc.)
}

const ReferralSchema: Schema<IReferral> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'userType', 
  },
  userType: {
    type: String,
    required: true,
    enum: ['customers', 'contractors'], 
  },
  referrer: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'userType', 
  },
  referrerType: {
    type: String,
    required: true,
    enum: ['customers', 'contractors'], 
  },
  referralCode: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, 
  },
  coupon: { 
    type: Schema.Types.ObjectId, 
    ref: 'coupons'
  },
  metadata: {
    type: Schema.Types.Mixed, 
  }
}, {
  timestamps: true
});

// Create and export the Referral model
export const ReferralModel = mongoose.model<IReferral>('Referral', ReferralSchema);
