import mongoose, { Schema, Document } from 'mongoose';

/**
 * Coupon Model Definitions
 *
 * This module defines the structure and schema for coupons in the application.
 * 
 * Enums:
 * - COUPON_TYPE: Represents the types of coupons (e.g., REFERRAL_BONUS, SERVICE_FEE_DISCOUNT).
 * - COUPON_VALUE_TYPE: Represents the value types of coupons (e.g., FIXED, PERCENTAGE).
 * - COUPON_STATUS: Represents the status of a coupon (e.g., PENDING, EXPIRED, REDEEMED, ACTIVE).
 *
 * Interface:
 * - ICoupon: Represents a coupon with the following properties:
 *   - promotion: Reference to the promotion (Schema.Types.ObjectId).
 *   - name: Name of the coupon (e.g., 'Referral Bonus' or 'Early User Discount').
 *   - code: Unique coupon code to be applied at checkout (e.g., 'REFER25', 'EARLY50').
 *   - user: Reference to the user (Schema.Types.ObjectId).
 *   - type: Coupon type (e.g., REFERRAL_BONUS, SERVICE_FEE_DISCOUNT).
 *   - userType: Type of user (either 'contractors' or 'customers').
 *   - valueType: Type of value (either FIXED or PERCENTAGE).
 *   - value: Amount in dollars or percentage (e.g., 25 for $25 or 50 for 50%).
 *   - applicableAtCheckout: Ensures the coupon can be applied during checkout.
 *   - redeemedAt: Date when the coupon is redeemed (optional).
 *   - expiryDate: Expiration date of the coupon.
 *   - status: The status of the coupon (e.g., 'pending', 'expired', 'redeemed', 'active').
 *
 * Schema:
 * - CouponSchema: Defines the Mongoose schema for the ICoupon interface, including validation rules.
 */

export enum COUPON_TYPE {
  REFERRAL_BONUS = 'REFERRAL_BONUS',
  SERVICE_FEE_DISCOUNT = 'SERVICE_FEE_DISCOUNT',
}

export enum COUPON_VALUE_TYPE {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export enum COUPON_STATUS {
  PENDING = 'PENDING',
  INUSE = 'INUSE',
  EXPIRED = 'EXPIRED',
  REDEEMED = 'REDEEMED',
  ACTIVE = 'ACTIVE',
}

// Define the ICoupon interface
export interface ICoupon extends Document {
  promotion: Schema.Types.ObjectId;
  name: string;
  code: string; 
  user: Schema.Types.ObjectId; 
  type: COUPON_TYPE; 
  userType: 'contractors' | 'customers'; 
  valueType: COUPON_VALUE_TYPE; 
  value: number; 
  applicableAtCheckout: boolean; 
  redeemedAt?: Date;               
  expiryDate: Date; 
  status: COUPON_STATUS;
}

// Define the Coupon schema
const CouponSchema: Schema<ICoupon> = new Schema({
  promotion: { type: Schema.Types.ObjectId, ref: 'promotions', required: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, required: true, refPath: 'userType' },
  userType: { type: String, enum: ['contractors', 'customers'], required: true },
  type: { type: String, enum: Object.values(COUPON_TYPE), required: true },
  valueType: { type: String, enum: Object.values(COUPON_VALUE_TYPE), required: true },
  value: { type: Number, required: true },
  applicableAtCheckout: { type: Boolean, default: true },
  redeemedAt: { type: Date },
  expiryDate: { type: Date },
  status: { 
    type: String, 
    enum: Object.values(COUPON_STATUS), 
    default: COUPON_STATUS.PENDING 
  }
}, { timestamps: true });

// Export the Coupon model
export const CouponModel = mongoose.model<ICoupon>('coupons', CouponSchema);
