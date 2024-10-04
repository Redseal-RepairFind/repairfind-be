import mongoose, { Schema, Document } from 'mongoose';

// Define the UserPromotion interface
export interface IUserPromotion extends Document {

  promotionId: Schema.Types.ObjectId;
  name: string; // reduce queries here
  code: string;
  user: Schema.Types.ObjectId; 
  userType: 'contractors' | 'customers';
  redeemedAt?: Date;                  
  expiryDate: Date;                  
  status: 'pending' | 'expired' | 'redeemed'; 
}

// Define the UserPromotion schema
const UserPromotionSchema: Schema<IUserPromotion> = new Schema({
  promotionId: { type: Schema.Types.ObjectId, ref: 'promotions', required: true },
  user: { type: Schema.Types.ObjectId, required: true, refPath: 'userType' },
  userType: { type: String, enum: ['contractors', 'customers'], required: true },
  redeemedAt: { type: Date },
  expiryDate: { type: Date }, 
  status: { 
    type: String, 
    enum: ['pending', 'expired', 'redeemed'], 
    default: 'pending' 
  }
}, { timestamps: true }); 

// Export the UserPromotion model
export const UserPromotionModel = mongoose.model<IUserPromotion>('UserPromotion', UserPromotionSchema);
