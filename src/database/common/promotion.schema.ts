import mongoose, { Schema, Document } from 'mongoose';

// Define exportable enums
export enum PROMOTION_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum PROMOTION_VALUE_TYPE {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export enum PROMOTION_TARGET {
  CONTRACTORS = 'CONTRACTORS',
  CUSTOMERS = 'CUSTOMERS',
  BOTH = 'BOTH',
}

// Extend the main IPromotion interface
export interface IPromotion extends Document {
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  target: PROMOTION_TARGET; // Use enum here
  criteria?: string;
  value: number; // eg 200
  valueType: PROMOTION_VALUE_TYPE; // Use enum here
  description: string;
  status: PROMOTION_STATUS; // Use enum here
}

// Define the Promotion schema
const PromotionSchema: Schema<IPromotion> = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  startDate: { type: Date },
  endDate: { type: Date },
  target: { 
    type: String, 
    enum: Object.values(PROMOTION_TARGET), // Reference the enum
    default: PROMOTION_TARGET.BOTH, // Default value from enum
  },
  criteria: { type: String },
  value: { type: Number },
  valueType: { 
    type: String, 
    enum: Object.values(PROMOTION_VALUE_TYPE), // Reference the enum
    required: true 
  },
  description: { type: String },
  status: { 
    type: String, 
    enum: Object.values(PROMOTION_STATUS), // Reference the enum
    default: PROMOTION_STATUS.INACTIVE, // Default value from enum
  },
}, {
  timestamps: true,
});

export const PromotionModel = mongoose.model<IPromotion>('promotions', PromotionSchema);
