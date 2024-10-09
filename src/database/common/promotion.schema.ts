import mongoose, { Schema, Document } from 'mongoose';

// Extend the main IPromotion interface
export interface IPromotion extends Document {
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  target: 'contractors' | 'customers' | 'both';
  criteria?: string;
  value: number; // eg 200
  valueType: 'fixed' | 'percentage'
  description: string;
  status: 'active' | 'inactive';
}

// Define the Promotion schema
const PromotionSchema: Schema<IPromotion> = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  startDate: { type: Date },
  endDate: { type: Date },
  target: { 
    type: String, 
    enum: ['contractors', 'customers', 'both'], 
    default: 'both' 
  },
  criteria: { type: String },
  value: { type: Number },
  valueType: { type: String, enum: ['fixed', 'percentage'], required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'inactive' 
  }
}, {
  timestamps: true 
});

export const PromotionModel = mongoose.model<IPromotion>('promotions', PromotionSchema);
