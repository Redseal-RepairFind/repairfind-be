import mongoose, { Schema, Document } from 'mongoose';

// Define the UserCoupon interface
export interface IUserCoupon extends Document {
  promotion: Schema.Types.ObjectId; // Reference to the coupon
  name: string; // e.g., 'Referral Bonus' or 'Early User Discount'
  code: string; // Unique coupon code to be applied at checkout (e.g., 'REFER25', 'EARLY50')
  user: Schema.Types.ObjectId; 
  type: 'referral' | 'discount';
  userType: 'contractors' | 'customers';
  valueType: 'fixed' | 'percentage'; // 'fixed' for flat amount, 'percentage' for percentage discount
  value: number; // Amount in dollars or percentage (e.g., 25 for $25 or 50 for 50%)
  applicableAtCheckout: boolean; // Ensures the coupon can be applied during checkout
  redeemedAt?: Date; // Date when coupon is redeemed                
  expiryDate: Date; // Expiration date of the coupon
  status: 'pending' | 'expired' | 'redeemed' | 'active' ; // The status of the coupon
}

// Define the UserCoupon schema
const UserCouponSchema: Schema<IUserCoupon> = new Schema({
  promotion: { type: Schema.Types.ObjectId, ref: 'promotions', required: true }, // Reference to the coupon
  name: { type: String, required: true }, // Name of the coupon
  code: { type: String, required: true, unique: true }, // Coupon code for checkout
  user: { type: Schema.Types.ObjectId, required: true, refPath: 'userType' }, // Reference to the user
  userType: { type: String, enum: ['contractors', 'customers'], required: true }, // Type of user
  valueType: { type: String, enum: ['fixed', 'percentage'], required: true }, // Type of discount
  value: { type: Number, required: true }, // Coupon value (dollar or percentage)
  applicableAtCheckout: { type: Boolean, default: true }, // Can be applied at checkout
  redeemedAt: { type: Date }, // Optional redeemed date
  expiryDate: { type: Date }, // Expiry date of the coupon
  // active means it can be applied, pending means that its not immediately available, either
  // because its already applied to a pending transaction or its not yet approved 
  status: { 
    type: String, 
    enum: ['pending', 'expired', 'redeemed', 'active'],  
    default: 'pending' // Default status is pending
  }
}, { timestamps: true });

// Export the UserCoupon model
export const UserCouponModel = mongoose.model<IUserCoupon>('user_coupons', UserCouponSchema);
