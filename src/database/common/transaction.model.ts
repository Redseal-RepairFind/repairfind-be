import { Schema, model, Document, ObjectId } from 'mongoose';

export enum TRANSACTION_STATUS {
  PENDING = "PENDING",
  APPROVED = "APPROVED", // important for transfer transactions
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  REQUIRES_CAPTURE = 'REQUIRES_CAPTURE',
  CANCELLED = 'CANCELLED',
}

export enum TRANSACTION_TYPE {
  TRANSFER = "TRANSFER",
  REFUND = "REFUND",
  ESCROW = "ESCROW",
  SITE_VISIT_PAYMENT = 'SITE_VISIT_PAYMENT',
  JOB_DAY_PAYMENT = 'JOB_DAY_PAYMENT',
  CHANGE_ORDER_PAYMENT = 'CHANGE_ORDER_PAYMENT',
  REFERRAL_BONUS_PAYMENT = 'REFERRAL_BONUS_PAYMENT',
}





export interface ITransaction extends Document {
  type: TRANSACTION_TYPE;
  amount: number;
  currency?: string;
  initiatorUser?: ObjectId;
  initiatorUserType?: string;

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
    // id: ObjectId;
  };
  metadata?: Object;
  job?: ObjectId;
  payment?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isCredit: boolean;


  getIsCredit: (userId: any) => boolean
}



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
        // id: Schema.Types.ObjectId,
      },
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed
    },
    job: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    payment: {
      type: Schema.Types.ObjectId,
    },

  
    

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


TransactionSchema.methods.getIsCredit = function (userId: string) {
  return this.toUser == userId
};
const TransactionModel = model("Transaction", TransactionSchema);

export default TransactionModel;

