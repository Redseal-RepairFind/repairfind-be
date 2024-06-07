import mongoose, { Document, ObjectId, Schema } from 'mongoose';


export enum PAYMENT_TYPE {
  JOB_DAY_PAYMENT = 'JOB_DAY_PAYMENT',
  SITE_VISIT_PAYMENT = 'SITE_VISIT_PAYMENT',
  CHANGE_ORDER_PAYMENT = 'CHANGE_ORDER_PAYMENT',
}


export interface IRefund extends Document {
  id: string;
  object: string;
  amount: number;
  balance_transaction: string;
  charge: string;
  created: number;
  currency: string;
  destination_details: {
    card: {
      reference: string;
      reference_status: string;
      reference_type: string;
      type: string;
    };
    type: string;
  };
  metadata: Record<string, unknown>;
  payment_intent: string;
  reason: string | null;
  receipt_number: string | null;
  source_transfer_reversal: string | null;
  status: string;
  transfer_reversal: string | null;
}


export interface ICapture extends Document {
  payment: ObjectId;
  payment_method: string;
  payment_intent: string;
  amount_authorized: number;
  currency: string;
  brand?: string;
  capture_before?: number;
  country?: string;
  exp_month?: number;
  exp_year?: number;
  extended_authorization?: {
    status: string;
  };
  fingerprint?: string;
  funding?: string;
  incremental_authorization?: {
    status: string;
  };
  installments?: number | null;
  last4?: string;
  mandate?: any;
  multicapture?: {
    status: string;
  };
  network?: string;
  network_token?: {
    used: boolean;
  };
  overcapture?: {
    maximum_amount_capturable: number;
    status: string;
  };
  three_d_secure?: string | null;
  wallet?: any;
  captured: boolean;
  canceled_at?: string;
  captured_at?: string;
  cancellation_reason?: string;
  capture_method?: string;
}



// Define the interface for the payment
export interface IPayment {
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
  transfer: string;
  on_behalf_of: string;
  calculated_statement_descriptor: string;
  payment_intent: string;
  refunds: [IRefund];
  capture: ICapture


  // Add any other fields you need
}


const RefundSchema = new Schema<IRefund>({
  id: { type: String, required: true },
  object: { type: String, required: true },
  amount: { type: Number, required: true },
  balance_transaction: { type: String, required: true },
  charge: { type: String, required: true },
  created: { type: Number, required: true },
  currency: { type: String, required: true },
  destination_details: {
    card: {
      reference: { type: String, required: true },
      reference_status: { type: String, required: true },
      reference_type: { type: String, required: true },
      type: { type: String, required: true }
    },
    type: { type: String, required: true }
  },
  metadata: { type: Map, of: Schema.Types.Mixed, default: {} },
  payment_intent: { type: String, required: true },
  reason: { type: String, default: null },
  receipt_number: { type: String, default: null },
  source_transfer_reversal: { type: String, default: null },
  status: { type: String, required: true },
  transfer_reversal: { type: String, default: null }
});



const CaptureShema = new Schema<ICapture>(
  {
    payment: { type: Schema.Types.ObjectId, required: true },
    payment_method: { type: String, required: true },
    payment_intent: { type: String, required: true },
    amount_authorized: { type: Number, required: true },
    currency: { type: String, required: true },
    brand: { type: String },
    capture_before: { type: Number },
    country: { type: String },
    exp_month: { type: Number },
    exp_year: { type: Number },
    extended_authorization: {
      status: { type: String }
    },
    fingerprint: { type: String },
    funding: { type: String },
    incremental_authorization: {
      status: { type: String }
    },
    installments: { type: Number },
    last4: { type: String },
    mandate: { type: Schema.Types.Mixed },
    multicapture: {
      status: { type: String }
    },
    network: { type: String },
    network_token: {
      used: { type: Boolean }
    },
    overcapture: {
      maximum_amount_capturable: { type: Number },
      status: { type: String }
    },
    three_d_secure: { type: String },
    wallet: { type: Schema.Types.Mixed },
    captured: { type: Boolean, required: true },
    canceled_at: { type: String },
    captured_at: { type: String },
    cancellation_reason: { type: String },
    capture_method: { type: String }
  },
  {
    timestamps: true,
  });




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

  customer: { type: String },
  currency: { type: String },
  paymentMethod: { type: String },
  paymentIntent: { type: String },
  description: { type: String },
  status: { type: String },
  remark: { type: String },
  metadata: { type: Schema.Types.Mixed },
  payment_method_details: { type: Schema.Types.Mixed },
  receipt_url: { type: String },
  refunded: { type: Boolean },
  paid: { type: Boolean },
  captured: { type: Boolean },
  created: { type: String },
  destination: { type: String },
  transfer_data: { type: Object },
  transfer: { type: String },
  on_behalf_of: { type: String },
  calculated_statement_descriptor: { type: String },
  payment_intent: { type: String },
  refunds: [RefundSchema],
  capture: CaptureShema,
}, { timestamps: true });




// Create the Payment model
const PaymentModel = mongoose.model<IPayment>('payments', PaymentSchema);

export { PaymentModel };
