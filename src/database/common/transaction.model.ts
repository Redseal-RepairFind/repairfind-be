import { Schema, model } from "mongoose";

import { Document, Types, ObjectId } from "mongoose";

export interface ITransactionDocument extends Document {
  _id: ObjectId;
  type: string;
  amount: number;
  initiator: string;
  from: string;
  to: string;
  fromId: string;
  toId: string;
  description: string;
  status: string;
  form: string;
  invoiceId: string;
  jobId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema(
    {
      type: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      initiator: {
        type: String,
        required: true,
      },
      from: {
        type: String,
        enum: ["admin", "customer", "contractor"],
        required: true,
      },
      to: {
        type: String,
        enum: ["admin", "customer", "contractor"],
        required: true,
      },
      fromId: {
        type: String,
        required: true,
      },
      toId: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        enum: ["pending", "successful", "failed"],
        required: true,
      },
      form: {
        type: String,
        enum: ["inspection", "qoutation", "withraw"],
      },
      invoiceId: {
        type: String,
        default: "",
      },
      jobId: {
        type: String,
        default: "",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date, 
        default: Date.now,
      },
    
    },
    {
      timestamps: true,
    }
  );
  
  const TransactionModel = model<ITransactionDocument>("Transaction", TransactionSchema);
  
  export default TransactionModel; 