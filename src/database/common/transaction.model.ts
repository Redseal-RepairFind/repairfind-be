import { Schema, model } from "mongoose";

import { Document, Types, ObjectId } from "mongoose";

// Define enum for transaction status
export enum TRANSACTION_STATUS {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}


// Define enum for transaction type
export enum TRANSACTION_TYPE {
  TRANSFER = "TRANSFER",
  JOB_PAYMENT = "JOB_PAYMENT",
  REFUND = "REFUND",
  PAYOUT = "PAYOUT",
  INSPECTION_PAYMENT = "INSPECTION_PAYMENT",
}

// Define interface for transaction document
export interface ITransaction extends Document {
  type: TRANSACTION_TYPE;
  amount: number;
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
    items: any,
    charges: Object
    id: ObjectId
  };
  job?: ObjectId;
  payment?: string;
  createdAt: Date;
  updatedAt: Date;
  isCredit: boolean;
  paymentMethod: Object;
  getIsCredit: (userId: any) =>  boolean
}

// Define the main schema for the invoice
const InvoiceSchema = new Schema({
  items: [], // Array of invoice items
  charges: { type: Object }, // Charges object
  id: { type: Schema.Types.ObjectId }, // Invoice ID
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
        type: String,  // ["admins", "customers", "contractors"],
        required: true,
      },
      
      toUser: {
        type: Schema.Types.ObjectId,
        refPath: 'toUserType',
        required: true,
      },
      toUserType: {
        type: String, // ["admins", "customers", "contractors"],
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
        type: InvoiceSchema,
        default: null,
      }, // tranfer the quotation and charges object her

      job: {
        type: Schema.Types.ObjectId,
        default: "",
      },

      payment: {
        type: Schema.Types.ObjectId,
      },

      paymentMethod: {
        type: Object,
        default: null
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },

      updatedAt: {
        type: Date, 
        default: Date.now,
      },
      isCredit: {
        type: Boolean, 
        default: false,
      }
    
    },
    {
      timestamps: true,
    }
  );
  

  TransactionSchema.methods.getIsCredit = async function (userId: string) {
      return this.toUser == userId
  };

  TransactionSchema.set('toObject', { virtuals: true });
  TransactionSchema.set('toJSON', { virtuals: true });

  const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);
  
  export default TransactionModel; 