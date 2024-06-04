import { Schema, model, Document, ObjectId } from 'mongoose';

export enum TRANSACTION_STATUS {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  REQUIRES_CAPTURE = 'REQUIRES_CAPTURE',
  CANCELLED = 'CANCELLED',
}

export enum TRANSACTION_TYPE {
  TRANSFER = "TRANSFER",
  JOB_PAYMENT = "JOB_PAYMENT",
  REFUND = "REFUND",
  PAYOUT = "PAYOUT",
  INSPECTION_PAYMENT = "INSPECTION_PAYMENT",
  SITE_VISIT = 'SITE_VISIT',
  JOB_DAY = 'JOB_DAY',
  CHANGE_ORDER = 'CHANGE_ORDER',
}

export interface ICaptureDetails extends Document {
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
  status: string;  //'captured', 'requires_capture'
  captured: boolean;
  canceled_at?: string;
  captured_at?: string;
  cancellation_reason?: string;
  capture_method?: string;
}

export interface ITransaction extends Document {
  type: TRANSACTION_TYPE;
  amount: number;
  currency?: string;
  initiatorUser: ObjectId;
  initiatorUserType: string;
  fromUser: ObjectId;
  fromUserType: string;
  toUser: ObjectId;
  toUserType: string;
  description?: string;
  status: TRANSACTION_STATUS;
  remark?: string;
  invoice?: {
    items: any;
    charges: Object;
    id: ObjectId;
  };
  metadata?: Object;
  job?: ObjectId;
  payment?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isCredit: boolean;
  captureDetails: ICaptureDetails
  getIsCredit: (userId: any) =>  boolean
}


const CaptureDetailsShema = new Schema<ICaptureDetails>(
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
      status: { type: String, required: true },
      captured: { type: Boolean, required: true },
      canceled_at: { type: String },
      captured_at: { type: String },
      cancellation_reason: { type: String },
      capture_method: { type: String }
  },
  {
      timestamps: true,
  });


const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPE), // Use enum values for type field
      required: true,
    },
    amount: {
      type: Number,
    },
    initiatorUser: {
      type: Schema.Types.ObjectId,
      refPath: 'initiatorUserType',
    },
    initiatorUserType: {
      type: String,
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      refPath: 'fromUserType',
      required: true,
    },
    fromUserType: {
      type: String,
      required: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      refPath: 'toUserType',
      required: true,
    },
    toUserType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS), // Use enum values for status
      default: TRANSACTION_STATUS.PENDING,
    },
    remark: {
      type: String,
    },
    invoice: {
      type: {
        items: [],
        charges: Schema.Types.Mixed,
        id: Schema.Types.ObjectId,
      },
      default: null,
    },
    metadata:{
      type: Schema.Types.Mixed
    },
    job: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    payment: {
      type: Schema.Types.ObjectId,
    },

    captureDetails: CaptureDetailsShema,
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);


TransactionSchema.methods.getIsCredit =  function (userId: string) {
  return this.toUser == userId
};
const TransactionModel = model("Transaction", TransactionSchema);

export default TransactionModel;

