import mongoose, { Document, ObjectId, Schema } from 'mongoose';


export enum PAYMENT_TYPE {
  JOB_DAY_PAYMENT = 'JOB_DAY_PAYMENT',
  SITE_VISIT_PAYMENT = 'SITE_VISIT_PAYMENT',
  CHANGE_ORDER_PAYMENT = 'CHANGE_ORDER_PAYMENT',
}


// Define the interface for the payment
export interface IPayment  {
  id: ObjectId
  charge: string; // stripe payment or charge id
  amount: number;
  amount_captured: number;
  amount_refunded: number;
  application_fee_amount: number;
  object: string; // charge or payment_intent ?
  user: ObjectId;
  type: PAYMENT_TYPE;
  transaction: ObjectId
  job?: ObjectId
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
  transfer_data: Object; // connected account that receives payment ?
  transfer:string;
  on_behalf_of:string;
  calculated_statement_descriptor:string;
  payment_intent:string;
  
  
  // Add any other fields you need
}

const PaymentSchema = new Schema<IPayment>({
  charge: { type: String, required: true },
  amount: { type: Number, required: true },
  amount_captured: { type: Number, required: true },
  amount_refunded: { type: Number },
  application_fee_amount: { type: Number },
  object: { type: String, required: true },
  type: { type: String, required: false, enum: Object.values(PAYMENT_TYPE) },
  transaction: { type: Schema.Types.ObjectId, ref: 'transactions' },
  job: { type: Schema.Types.ObjectId, ref: 'jobs' },
  user: { type: Schema.Types.ObjectId, refPath: 'userType', required: true },
  userType: { type: String, required: true },

  customer: { type: String  },
  currency: { type: String },
  paymentMethod: { type: String },
  paymentIntent: { type: String },
  description: { type: String},
  status: { type: String },
  remark: { type: String },
  metadata: { type: Schema.Types.Mixed},
  payment_method_details: { type: Schema.Types.Mixed},
  receipt_url: { type: String },
  refunded: { type: Boolean },
  paid: { type: Boolean },
  captured: { type: Boolean},
  created: { type: String},
  destination: { type: String },
  transfer_data: { type: Object},
  transfer: { type: String },
  on_behalf_of: { type: String },
  calculated_statement_descriptor: { type: String },
  payment_intent: { type: String }
}, { timestamps: true });




// Create the Payment model
const PaymentModel = mongoose.model<IPayment>('payments', PaymentSchema);

export { PaymentModel };
