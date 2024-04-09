import mongoose, { Document, ObjectId, Schema } from 'mongoose';

// Define the interface for the payment
export interface IPayment extends Document {
  amount: number;
  amount_captured: number;
  amount_refunded: number;
  application_fee_amount: number;
  object: string; // charge or payment_intent ?
  user: ObjectId;
  userType: string;
  customer: string;
  currency: string;
  paymentMethod: string;
  paymentIntent: string;
  description: string;
  status: string;
  remark: string;
  metadata: Object
  payment_method_details: Object;
  receipt_url: string;
  refunded: boolean
  paid: boolean;
  captured: boolean;
  created: string;
  destination: string; // connected account that receives payment ?
  transfer_data: string; // connected account that receives payment ?
  transfer:string;
  
  // Add any other fields you need
}

// Define the schema for the payment
const PaymentSchema = new Schema<IPayment>({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  // Define other fields if needed
}, { timestamps: true });

// Create the Payment model
const PaymentModel = mongoose.model<IPayment>('Payment', PaymentSchema);

export { PaymentModel };
